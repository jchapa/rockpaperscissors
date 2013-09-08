"use strict";

describe('Compete Controllers', function() {

    beforeEach(function(){
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            },
            toNotEqualData: function(expected) {
                return !angular.equals(this.actual, expected);
            },
            toBeInRange: function(lower, higher) {
                return this.actual >= lower && this.actual <= higher;
            }
        });
    });

    describe("CompeteCtrl", function()
    {
        var scope, ctrl, enumModule, $httpBackend,
            validWeapons =
                [{ // Our mock data
                    "name": "rock",
                    "beats": "scissors"
                },
                {
                    "name": "paper",
                    "beats": "rock"
                },
                {
                    "name": "scissors",
                    "beats": "paper"
                }],
            invalidWeapon = {name: "dynamite", beats: "rock"};

        beforeEach(module('Enums'));
        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, Enum) {
            $httpBackend = _$httpBackend_;
            scope = $rootScope.$new();
            enumModule = Enum;
            ctrl = $controller(CompeteCtrl, {$scope: scope, Enum: enumModule});
        }));

        it('should create "weapons" model with 3 weapons', function()
        {
            expect(scope.weapons).toEqualData(validWeapons);
        });

        it('testValidWeapon :: should return false if empty weapon provided', function()
        {
            //var weapon = $.grep(scope.weapons, function(e){ return e.name == "rock";});
            var weapon = {};
            expect(scope.testValidWeapon(weapon)).toEqualData(false);
        });

        it('testValidWeapon :: should return false if invalid weapon provided', function()
        {
            var weapon = {name: "dynamite", beats: "rock"};
            expect(scope.testValidWeapon(weapon)).toEqualData(false);
        });

        it('testValidWeapon :: should return true if any valid weapon is provided', function()
        {
            for (var i = 0; i < validWeapons.length; i++)
            {
                expect(scope.testValidWeapon(validWeapons[i])).toEqualData(true);
            }
        });

//        it('generateOpponentWeapon :: should produce every possibility given enough executions (statistically)', function()
//        {
//            var iMax = validWeapons.length,
//                aSeenValues = [];
//
//            for (var i = 0; i< 100; i++)
//            {
//                var iNewNum = scope.generateOpponentWeapon();
//                if (aSeenValues.indexOf(iNewNum) == -1)
//                {
//                    aSeenValues.push(iNewNum);
//                }
//            }
//
//            for (var i = 0; i < iMax; i ++)
//            {
//                expect(aSeenValues.indexOf(i)).toNotEqualData(-1);
//            }
//        });

        it('compete :: should return both win and loss given enough executions with the same input (statistically)', function()
        {
            var oWeapon = validWeapons[0],
                aSeenStatuses = [];

            for (var i = 0; i < 100; i++)
            {
                var iNewStatus = scope.compete(oWeapon);
                if (aSeenStatuses.indexOf(iNewStatus) == -1)
                {
                    aSeenStatuses.push(iNewStatus);
                }
            }
            expect(aSeenStatuses.indexOf(enumModule.result.win)).toNotEqualData(-1);
            expect(aSeenStatuses.indexOf(enumModule.result.loss)).toNotEqualData(-1);
        });

        it('play :: should return error if either weapon is invalid', function()
        {
            var validWeapon = validWeapons[0];

            expect(scope.play(invalidWeapon, validWeapon)).toEqualData(enumModule.result.error);
            expect(scope.play(validWeapon, invalidWeapon)).toEqualData(enumModule.result.error);
            expect(scope.play(invalidWeapon, invalidWeapon)).toEqualData(enumModule.result.error);
        });

        it('play :: should return win if player wins', function()
        {
            var playerWeapon = validWeapons[0],
                computerWeapon;

            // This is slow. Could be faster if it returned when it found something.
            for (var i = 1; i < validWeapons.length; i++)
            {
                if (validWeapons[i].name == playerWeapon.beats)
                {
                    computerWeapon = validWeapons[i];
                }
            }

            // Now should be ready to roll
            expect(typeof(computerWeapon)).toNotEqualData("undefined");
            expect(scope.play(playerWeapon, computerWeapon)).toEqualData(enumModule.result.win);
        });

        it('play :: should return loss if computer wins', function()
        {
            var computerWeapon = validWeapons[0],
                playerWeapon;

            // This is slow. Could be faster if it returned when it found something.
            for (var i = 1; i < validWeapons.length; i++)
            {
                if (validWeapons[i].name == computerWeapon.beats)
                {
                    playerWeapon = validWeapons[i];
                }
            }

            // Now should be ready to roll
            expect(typeof(computerWeapon)).toNotEqualData("undefined");
            expect(scope.play(playerWeapon, computerWeapon)).toEqualData(enumModule.result.loss);
        });

        it('play :: should return draw if nobody wins', function()
        {
            var weapon = validWeapons[0];

            expect(scope.play(weapon, weapon)).toEqualData(enumModule.result.draw);
        });

        it('play :: should return an error if invalid weapon provided', function()
        {
            var validWeapon = validWeapons[0];
            expect(scope.play(invalidWeapon, invalidWeapon)).toEqualData(enumModule.result.error);
            expect(scope.play(validWeapon, invalidWeapon)).toEqualData(enumModule.result.error);
            expect(scope.play(invalidWeapon, validWeapon)).toEqualData(enumModule.result.error);
        });

        it('getBeatableWeapon :: should return the weapon that this weapon can beat', function()
        {
            var weapon = validWeapons[0];
            expect(scope.getBeatableWeapon(weapon).name).toEqualData(weapon.beats);200
        });

        it('should create empty weaponSelectionCounter', function()
        {
            expect(scope.weaponSelectionCounter).toEqualData({});
        });

        it('incrementCounter :: should increment the counter of the provided weapon', function()
        {
            var weapon = validWeapons[0],
                expectedObject = {};
            scope.incrementCounter(weapon);
            expectedObject[weapon.name] = 1;
            expect(scope.weaponSelectionCounter).toEqualData(expectedObject);
        });

        it('incrementCounter :: should increment the counter of the provided weapon if called multiple times', function()
        {
            var weapon = validWeapons[0],
                expectedObject = {};

            scope.incrementCounter(weapon);
            scope.incrementCounter(weapon);
            expectedObject[weapon.name] = 2;
            expect(scope.weaponSelectionCounter).toEqualData(expectedObject);
        })

        it('should create wins variable and init to 0', function()
        {
            expect(scope.wins).toEqualData(0);
        });

        it('should create losses variable and init to 0', function()
        {
            expect(scope.losses).toEqualData(0);
        });

        it('updateScoreboard :: should increment the wins counter only if win', function()
        {
            scope.updateScoreboard(enumModule.result.win);
            expect(scope.wins).toEqualData(1);
            expect(scope.losses).toEqualData(0);
        });

        it('updateScoreboard :: should increment the losses counter only if loss', function()
        {
            scope.updateScoreboard(enumModule.result.loss);
            expect(scope.losses).toEqualData(1);
            expect(scope.wins).toEqualData(0);
        });

        it('updateScoreboard :: should increment both wins and losses if one of each is encountered', function()
        {
            scope.updateScoreboard(enumModule.result.loss);
            scope.updateScoreboard(enumModule.result.win);
            expect(scope.losses).toEqualData(1);
            expect(scope.wins).toEqualData(1);
        });

        it('updateScoreboard :: should increment the wins counter twice only if win twice', function()
        {
            scope.updateScoreboard(enumModule.result.win);
            scope.updateScoreboard(enumModule.result.win);
            expect(scope.wins).toEqualData(2);
            expect(scope.losses).toEqualData(0);
        });

        it('updateScoreboard :: should increment the loss counter twice only if loss twice', function()
        {
            scope.updateScoreboard(enumModule.result.loss);
            scope.updateScoreboard(enumModule.result.loss);
            expect(scope.losses).toEqualData(2);
            expect(scope.wins).toEqualData(0);
        });
    });
});
