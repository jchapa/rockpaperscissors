angular.element(document).ready(function()
{
    angular.module('Enums', []).
        factory('Enum', [ function () {
            var oRetval = {
                result: {win:1, loss:0, draw:2, error:-1}
            };
            return oRetval;
        }]);
    angular.module('rpsApp', ['Enums']);
    angular.bootstrap(document, ['rpsApp']);
});

// Helpers

Object.prototype.getKeyByValue = function( value ) {
    for( var prop in this ) {
        if( this.hasOwnProperty( prop ) ) {
            if( this[ prop ] === value )
                return prop;
        }
    }
}