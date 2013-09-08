<html>
<head>
    <title>Rock, Paper, Scissors</title>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.8/angular.min.js"></script>
<script type="text/javascript" src="js/main.js"></script>
<script type="text/javascript" src="js/controllers.js"></script>

    <style type="text/css">
        .nostyle{
            list-style-type:none;
            padding-left:0;
        }
        .nostyle li{
            display:inline;
            padding-right:10px;
        }
    </style>
</head>
<body>
<h1>Rock, Paper, Scissors</h1>

<h2>Choose your weapon</h2>

<p>Simple rock, paper scissors game. You pick your weapon, and the computer picks a weapon to challenge out. Don't
get too predictable, though! It learns from your habits.</p>

<div ng-controller="CompeteCtrl">
    <table border="all">
        <tr>
            <th>Weapon</th>
            <th>Beats</th>
        </tr>
        <tr ng-repeat="weapon in weapons">
            <td>{{weapon.name}}</td>
            <td>{{weapon.beats}}</td>
        </tr>
    </table>

    <ul class="nostyle">
        <li ng-repeat="weapon in weapons">
            <input type="button" value="{{weapon.name}}" ng-click="compete(weapon)" />
        </li>
    </ul>
    <div class="score">
        <strong>Wins: {{wins}} | Losses: {{losses}}</strong>
    </div>
    <strong>Result: {{lastGameResult}}</strong>
    <h3>History</h3>
    <ul>
        <li ng-repeat="(item, count) in weaponSelectionCounter">{{item}} - {{count}}</li>
    </ul>
</div>
</body>
</html>