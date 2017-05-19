(function () {
    'use strict';

    angular
        .module('DeezerKids')
        .controller('PlayerController', PlayerController);

    PlayerController.$inject = ['$rootScope', '$scope', '$location', 'FlashService', '$mdDialog', 'LoadingService', '$q'];

    function PlayerController($rootScope, $scope, $location, FlashService, $mdDialog, LoadingService, $q) {

        //--- Declarations ---//
        var vm = this; // Der Controller selbst

        // Parties
        vm.allParties = null; // Liste aller Parties (kann auch null sein)
        vm.selectedParty = null; // Die gerade selektierte Party (in allen Modi verfügbar)
        vm.editedParty = null; // Die Party in Bearbeitung (nur in den Modi EDIT und NEW)

        // Modus
        vm.mode = {};


        //--- Events ---//
        $scope.$watch(
            'vm.editedParty.valid_from_obj',
            function handleChangeDate(newValue, oldValue) {
                if (newValue) {
                    vm.editedParty.valid_from = newValue.toJSON();
                }
            }
        );
        $scope.$watch(
            'vm.editedParty.valid_to_obj',
            function handleChangeDate(newValue, oldValue) {
                if (newValue) {
                    vm.editedParty.valid_to = newValue.toJSON();
                }
            }
        );
        $scope.$watch(
            'vm.editedParty.picture',
            function handleChangeDate(newValue, oldValue) {
                if (newValue) {
                    getPictureURL(newValue)
                        .then(function(url) {
                            vm.editedParty.picture_url = url;
                        })
                        .catch(function(error) {
                            vm.editedParty.picture_url = null;
                        });
                }
            }
        );


        //--- Constructor ---//
        init();


        //--- Public functions ---//
        vm.showParty = function (party) {
            // Party in Bearbeitung zurück setzen
            vm.editedParty = null;
            vm.imageupload = null;

            // Party für Anzeige übernehmen
            vm.selectedParty = party;

            // Party anzeigen
            vm.mode = 'SHOW';
        }

        vm.editParty = function (party) {
            // Party kopieren (für undo)
            vm.editedParty = angular.copy(party);
            vm.editedParty.valid_from_obj = new Date(vm.editedParty.valid_from);
            vm.editedParty.valid_to_obj = new Date(vm.editedParty.valid_to);

            // Party zur Bearbeitung anzeigen
            vm.mode = 'EDIT';
        }

        vm.createParty = function () {
            // Min-/Max-Datum für Datumsauswahl vorgeben
            vm.myDate = new Date();
            vm.minDate = new Date(
                vm.myDate.getFullYear(),
                vm.myDate.getMonth(),
                vm.myDate.getDate());
            vm.maxDate = new Date(
                vm.myDate.getFullYear(),
                vm.myDate.getMonth() + 2,
                vm.myDate.getDate());

            // neue Party anlegen
            vm.editedParty = new Party();

            // Party zur Bearbeitung anzeigen
            vm.mode = 'NEW';
        }

        vm.cancelEditing = function () {
            // Bearbeitete Party zurücksetzen
            vm.editedParty = null;
            vm.imageupload = null;

            // Party ohne Änderungen bzw. vorherige (bei neuer Party) anzeigen
            if (vm.selectedParty != null) {
                vm.showParty(vm.selectedParty);
            } else {
                // Keine Party zum anzeigen
                vm.mode = 'NONE';
            }
        }

        vm.save = function (party) {
            if (vm.mode == 'NEW') {
                // Ladesymbol anzeigen
                LoadingService.Start();

                var picture = party.picture;
                party.picture = "";
                vm.allParties.$add(party)
                    .then(function (ref) {
                        vm.selectedParty = vm.allParties.$getRecord(ref.key);
                        if (picture) {
                            var pictureParts = picture.split(",");
                            picture = pictureParts[0].split("/");
                            picture = picture[1].split(";");
                            picture = vm.selectedParty.$id + '.' + picture[0];
                            var storageRef = firebase.storage().ref().child('images/parties/' + picture);
                            storageRef.putString(pictureParts[1], 'base64')
                                .then(function (snapshot) {
                                    vm.selectedParty.picture = picture;
                                    vm.allParties.$save(vm.selectedParty);

                                    // Neu erstellte Party anzeigen
                                    vm.showParty(vm.allParties.$getRecord(ref.key));

                                    // Ladesymbol ausblenden
                                    LoadingService.Stop();
                                });
                        }
                    });
            }

            if (vm.mode == 'EDIT') {
                // Ladesymbol anzeigen
                LoadingService.Start();

                vm.selectedParty.name = party.name;
                vm.selectedParty.description = party.description;
                vm.selectedParty.picture = party.picture;
                vm.selectedParty.address = party.address;
                vm.selectedParty.valid_from = party.valid_from;
                vm.selectedParty.valid_to = party.valid_to;
                vm.selectedParty.virtual = party.virtual;
                vm.selectedParty.active = party.active;
                vm.selectedParty.created_at = party.created_at;
                vm.selectedParty.created_by = party.created_by;

                vm.allParties.$save(vm.selectedParty);
                vm.showParty(vm.selectedParty);

                // Ladesymbol ausblenden
                LoadingService.Stop();
            }
        }

        vm.deleteParty = function (party) {
            // Sicherheitsabfrage
            var confirm = $mdDialog.confirm()
                .title('Wollen Sie die Party tatsächlich löschen?')
                .textContent('Eine Löschung kann nicht mehr rückgängig gemacht werden.')
                .ok('Party löschen!')
                .cancel('Auf gar keinen Fall.');
            $mdDialog.show(confirm)
                .then(function () {
                    // Ladesymbol anzeigen
                    LoadingService.Start();

                    // Das zugehörige Bild löschen (wenn es eins gibt)
                    if (party.picture) {
                        firebase.storage().ref().child('images/parties/' + party.picture).delete();
                    }

                    // Party löschen
                    vm.allParties.$remove(party)
                        .then(function (ref) {
                            vm.selectedParty = null;

                            // Erste Party anzeigen (wenn noch eine vorhanden)
                            if (vm.allParties.length > 0) {
                                vm.showParty(vm.allParties[0]);
                            } else {
                                // Keine Party zum anzeigen
                                vm.mode = 'NONE';
                            }

                            // Ladesymbol ausblenden
                            LoadingService.Stop();
                        })
                        .catch(function (error) {
                            // Ladesymbol ausblenden
                            LoadingService.Stop();
                        });
                })
                .catch(function (error) {
                    return;
                });
        }

        vm.changePicture = function (party) {
            party.picture = '';
        }

        vm.startParty = function (party) {
            $location.path('/party/' + party.$id + '/start');
        }


        //--- Private functions ---//
        function Party() {
            var date = new Date();

            this.name = '';
            this.description = '';
            this.picture = '';
            this.address = '';
            this.valid_from_obj = date;
            this.valid_from = date.toJSON();
            this.valid_to_obj = date;
            this.valid_to = date.toJSON();
            this.virtual = false;
            this.active = true;
            this.created_at = date.toJSON();
            this.created_by = $rootScope.globals.currentUser.uid;
        }

        function getPartiesByUser(userID) {

            // Ladesymbol anzeigen
            LoadingService.Start('Test 123');

            // Parties aus Firestore lesen
            var parties = $firebaseArray(firebase.database().ref().child('parties').orderByChild("created_by").equalTo(userID));

            // Warten, bis Daten geladen wurden
            parties.$loaded()
                .then(function (FirebaseParties) {
                    // Pfad zum Bild setzen
                    var count = 0;
                    FirebaseParties.forEach(function(party) {
                        if (party.picture) {
                            getPictureURL(party.picture)
                                .then(function(url) {
                                    count++;
                                    party.picture_url = url;

                                    if (count >= FirebaseParties.length) {
                                        showFirstParty(parties)
                                        // Ladesymbol ausblenden
                                        LoadingService.Stop();
                                    }
                                })
                                .catch(function(error) {
                                    count++;
                                    party.picture_url = null;

                                    if (count >= FirebaseParties.length) {
                                        showFirstParty(parties)
                                        // Ladesymbol ausblenden
                                        LoadingService.Stop();
                                    }
                                });
                        } else {
                            count++;
                            if (count >= FirebaseParties.length) {
                                showFirstParty(parties)
                                // Ladesymbol ausblenden
                                LoadingService.Stop();
                            }
                        }
                    });
                })
                .catch(function (error) {
                    // Ladesymbol ausblenden
                    LoadingService.Stop();
                });
        }

        function showFirstParty(parties) {
            // Erste Party anzeigen und Liste der Parties zurück geben
            if (parties.length > 0) {
                vm.showParty(parties[0]);
            } else {
                // Keine Party zum anzeigen
                vm.mode = 'NONE';
            }
            vm.allParties = parties;
        }

        function getPictureURL(picture) {

            return $q(function(resolve, reject) {
                firebase.storage().ref().child('images/parties/' + picture).getDownloadURL()
                    .then(function(url) {
                        resolve(url);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        }

        function init() {
            // Parties zum Kunden lesen
            getPartiesByUser($rootScope.globals.currentUser.uid);
        }
    }

})();
