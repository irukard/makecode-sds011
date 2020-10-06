/**
 * MakeCode blocks for
 * NovaFitness SDS011 Air Quality Sensor
 * 
 * 2020-10-06 by Krzysztof Daszuta <irukard@gmail.com>
 * Nettigo.pl
 */

//% weight=100 color=#0fbc11 icon="\uf0c2"
namespace sds011 {
   /**
     * This initialize UART connection the SDS011
     */
    //% block="Connect SDS011 via UART"
    //% block.loc.pl="Połącz z SDS011 przez UART"
    export function initPrinter(): void {
        serial.redirect(
            SerialPin.P0,
            SerialPin.P1,
            BaudRate.BaudRate9600
        )

    }
}