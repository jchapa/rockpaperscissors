function CompeteCtrl($scope, Enum)
{
    $scope.lastGameResult = "";
    $scope.weaponSelectionCounter = {};
    $scope.wins = 0;
    $scope.losses = 0;
    $scope.weapons = [
        {
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
        }
    ];

    $scope.compete = function(weapon)
    {
        // 0) Determine if weapon is valid
        if ($scope.testValidWeapon(weapon))
        {
            // First let's store the user's selection
            // There are 2 ways we could do this:
            // 1) Store an overall count, and weight our simple AI against the overall count (currently used)
            // 2) Store data in a "ledger", weighting toward more recently selected choices and watching patterns
            $scope.incrementCounter(weapon);

            // 1) Randomly determine opponent weapon
            var oOpponentWeapon = $scope.generateOpponentWeapon();

            // 2) Determine the winner
            var iPlayStatus = $scope.play(weapon, oOpponentWeapon);

            // Set our messaging
            $scope.lastGameResult = Enum.result.getKeyByValue(iPlayStatus);
            $scope.updateScoreboard(iPlayStatus);
            return iPlayStatus;
        }
        else
        {
            // Lame. Send error.
            return Enum.result.error;
        }
    };

    // VOID
    $scope.updateScoreboard = function(result)
    {
        if (result == Enum.result.win)
        {
            $scope.wins++;
        }
        else if (result == Enum.result.loss)
        {
            $scope.losses++;
        }
    };

    // VOID
    // TODO: this variable will grow forever as is. Might want to limit counter
    $scope.incrementCounter = function(weapon)
    {
        if (typeof($scope.weaponSelectionCounter[weapon.name]) == "undefined")
        {
            $scope.weaponSelectionCounter[weapon.name] = 1;
        }
        else
        {
            $scope.weaponSelectionCounter[weapon.name]++;
        }
    };

    $scope.play = function(playerWeapon, computerWeapon)
    {
        var iRetval = Enum.result.error;
        // First let's ensure our weapons are valid
        if ($scope.testValidWeapon(playerWeapon) && $scope.testValidWeapon(computerWeapon))
        {
            // Yay. Let's compete these guys
            if (playerWeapon.name == computerWeapon.name)
            {
                // We have a draw
                iRetval = Enum.result.draw;
            }
            else if (playerWeapon.beats == computerWeapon.name)
            {
                // Player wins
                iRetval = Enum.result.win;
            }
            else if (computerWeapon.beats == playerWeapon.name)
            {
                iRetval = Enum.result.loss;
            }
            else
            {
                // ??
                iRetval = Enum.result.error;
            }
        }
        else
        {
            iRetval =  Enum.result.error;
        }

        return iRetval;
    };

    /**
     * Randomly chooses opponent's weapon, using historical data to weight selection
     * @returns {number}
     */
    $scope.generateOpponentWeapon = function(){
        var iWeaponCount = $scope.weapons.length,
            weightMap = {},
            totalCompetitions = 0,
            prevVal = 0,
            currentWeapon,
            localCounter = JSON.parse(JSON.stringify($scope.weaponSelectionCounter)),
            weightCalc,
            seed = Math.random();

        // init
        for (var i = 0; i < iWeaponCount; i++)
        {
            currentWeapon = $scope.weapons[i];
            weightMap[currentWeapon.name] = 1;
            if (typeof(localCounter[currentWeapon.name]) == "undefined")
            {
                // We don't have any data for this item yet. Let's set it to '1' for now, so it gets lowest weight
                localCounter[currentWeapon.name] = 1;
            }
                totalCompetitions += localCounter[currentWeapon.name];

        }

        // Now to calculate percentage ('weights') each weapon should have
        for (i = 0; i < iWeaponCount; i++)
        {
            currentWeapon = $scope.weapons[i];

            weightCalc =  prevVal + (localCounter[currentWeapon.name] / totalCompetitions);
            weightMap[currentWeapon.name] = weightCalc;
            prevVal = weightCalc;
        }

        return $scope.getWeaponBane($scope.weapons[$scope.findWinnerFromWeight(weightMap, seed)]);

    };

    $scope.findWinnerFromWeight = function(weightMap, seed)
    {
        // For each weapon
        for (var i = 0; i < $scope.weapons.length; i++)
        {
            // Keep going up through the weapons, and determine where the seed falls in our weightMap
            // E.g. item 1 weight = 0.4
            // item 2 weight = 0.5 (i.e. item 1 + item 2 weight of 0.1)
            // item 3 weight = 1 (i.e. item 1 + item 2 + item 3 weight of 0.5
            if (weightMap[$scope.weapons[i].name] >= seed)
            {
                // Winner! Return now.
                return i;
            }
        }
        // Should never be here
        return -1;
    };

    $scope.testValidWeapon = function(weapon)
    {
        var bRetval = false;
        if (typeof(weapon.name) != "undefined" && typeof(weapon.beats) != "undefined")
        {
            for (var i = 0; i < $scope.weapons.length; i++)
            {
                if ($scope.weapons[i].name == weapon.name)
                {
                    bRetval = true;
                }
            }
        }
        return bRetval;
    };

    $scope.getBeatableWeapon = function(weapon)
    {
        var oRetval = {};
        for (var i = 1; i < $scope.weapons.length; i++)
        {
            if ($scope.weapons[i].name == weapon.beats)
            {
                oRetval = $scope.weapons[i];
                return oRetval; // Return early for speed
            }
        }
        return oRetval;
    };

    $scope.getWeaponBane = function(weapon)
    {
        var oRetval = {};
        for (var i = 0; i < $scope.weapons.length; i++)
        {
            if ($scope.weapons[i].beats == weapon.name)
            {
                oRetval = $scope.weapons[i];
                return oRetval; // Return early for speed
            }
        }
        return oRetval;
    };
}