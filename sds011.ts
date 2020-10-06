/**
 * MakeCode blocks for
 * NovaFitness SDS011 Air Quality Sensor
 * 
 * 2020-10-06 by Krzysztof Daszuta <irukard@gmail.com>
 * Nettigo.pl
 */

//% weight=100 color=#0fbc11 icon="\uf0c2"
namespace SDS011 {
    //Variables and setting default values
    let initialised = false
    let sdsbuffer : Buffer = null
    let pm25 = 0
    let pm10 = 0

   /**
     * This initialize UART connection the SDS011
     */
    //% block="Open UART Connection to SDS011"
    //% block.loc.pl="Połącz z SDS011 przez UART"
    function initConnection(): void {
        serial.setRxBufferSize(10)
        serial.redirect(
            SerialPin.P0,
            SerialPin.P1,
            BaudRate.BaudRate9600
        )
        initialised = true
    }

    /**
     * Read 10 bytes from UART
     */
    //% block="Read DATA from SDS011"
    //% block.loc.pl="Odczytaj dane z SDS011"
    export function readAirQualityData():void {
        if (initialised == false) {
            initConnection();
        }
        sdsbuffer = serial.readBuffer(10)
        // check if frame starts with 0xAA 0xC0 and ends with 0xAB
        if (sdsbuffer.getNumber(NumberFormat.UInt8LE, 0) == 170
            && sdsbuffer.getNumber(NumberFormat.UInt8LE, 1) == 192
            && sdsbuffer.getNumber(NumberFormat.UInt8LE, 9) == 171) {

            pm25 = sdsbuffer.getNumber(NumberFormat.UInt16LE, 2) / 10
            pm10 = sdsbuffer.getNumber(NumberFormat.UInt16LE, 4) / 10
            led.toggle(0, 0)
        }
    }

    /**
     * Return PM2.5 Air Quality Value
     */
    //% block="PM2.5 Value in μg/m³"
    //% block.loc.pl="Wartość PM2.5 w μg/m³"
    export function pm25Value():number {
        return pm25
    }

    /**
     * Return PM10 Air Quality Value
     */
    //% block="PM10 Value in μg/m³"
    //% block.loc.pl="Wartość PM10 w μg/m³"
    export function pm10Value():number {
        return pm10
    }
    
}