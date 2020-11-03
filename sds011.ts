/**
 * MakeCode blocks for
 * NovaFitness SDS011 Air Quality Sensor
 * 
 * 2020-10-06 by Krzysztof Daszuta <irukard@gmail.com>
 * Nettigo.pl
 */

//% weight=100 color=#888888 icon="\uf0c2"
//% groups='["Connection", "Read Sensor Data", "Measured Values"]'
namespace SDS011 {
    //Variables and setting default values
    let initialised = false
    let pm25 = 0
    let pm10 = 0
    let avgpm25 = 0
    let avgpm10 = 0
    let avgpm25cnt = 0
    let avgpm10cnt = 0
    let sdsbuffer : Buffer = null
    let uartbusy = 0

    /**
     * This initialize bi-directional UART connection the SDS011
     */
    //% block="Open connection to SDS011 (P1/P2)"
    //% block.loc.pl="Otwórz połączenie z SDS011 (P1/P2)"
    //% group="Connection"
    export function initConnectionSDSOnly(): void {
        serial.setRxBufferSize(10)
        serial.redirect(
            SerialPin.P1,
            SerialPin.P2,
            BaudRate.BaudRate9600
        )
        initialised = true
    }

    /**
     * This initialize RX connection the SDS011, and TX to PC
     */
    //% block="Open connection to SDS011 and PC (USB_TX/P2)"
    //% block.loc.pl="Otwórz połączenie z SDS011 i PC (USB_TX/P2)"
    //% group="Connection"
    export function initConnectionSDSWithPC(): void {
        serial.setRxBufferSize(10)
        serial.redirect(
            SerialPin.USB_TX,
            SerialPin.P2,
            BaudRate.BaudRate9600
        )
        initialised = true
    }

    /**
     * This initialize RX connection the SDS011, and TX to OpenLog
     */
    //% block="Open connection to SDS011 and OpenLog (P12/P2)"
    //% block.loc.pl="Otwórz połączenie z SDS011 i OpenLog (P12/P2)"
    //% group="Connection"
    export function initConnectionSDSWithOpenLog(): void {
        serial.setRxBufferSize(10)
        serial.redirect(
            SerialPin.P12,
            SerialPin.P2,
            BaudRate.BaudRate9600
        )
        initialised = true
    }

    /**
     * Read 10 bytes from UART
     */
    //% block="Read data from SDS011"
    //% block.loc.pl="Odczytaj dane z SDS011"
    //% group="Read Sensor Data"
    export function readAirQualityData():void {
        if (initialised == true) {
            uartbusy = 1
            sdsbuffer = serial.readBuffer(10)
            uartbusy = 0
            // check if frame starts with 0xAA 0xC0 and ends with 0xAB
            if (sdsbuffer.getNumber(NumberFormat.UInt8LE, 0) == 170
                && sdsbuffer.getNumber(NumberFormat.UInt8LE, 1) == 192
                && sdsbuffer.getNumber(NumberFormat.UInt8LE, 9) == 171) {
                pm25 = sdsbuffer.getNumber(NumberFormat.UInt16LE, 2) / 10
                pm10 = sdsbuffer.getNumber(NumberFormat.UInt16LE, 4) / 10
                avgpm25 += pm25
                avgpm25cnt++
                avgpm10 += pm10
                avgpm10cnt++
            }
            //sdsbuffer = null
        }        
    }
    
    /**
     * Read SDS011 values in backgound (Experimental)
     */
    //% block="Read data from SDS011 in background"
    //% block.loc.pl="Odczytuj dane z SDS011 w tle"
    //% group="Read Sensor Data"
    export function readAirQualityDataInBackgound():void {
        control.inBackground(function () {
            while (true) {
                SDS011.readAirQualityData()
                basic.pause(950)
            }
        })
    }
    
    /**
     * Return PM2.5 Air Quality Value
     */
    //% block="Current PM2.5 Value in μg/m³"
    //% block.loc.pl="Aktualna wartość PM2.5 w μg/m³"
    //% group="Measured Values"
    export function pm25Value():number {
        return pm25
    }

    /**
     * Return PM10 Air Quality Value
     */
    //% block="Current PM10 Value in μg/m³"
    //% block.loc.pl="Aktualna Wartość PM10 w μg/m³"
    //% group="Measured Values"
    export function pm10Value():number {
        return pm10
    }

    /**
     * Return Average PM2.5 Air Quality Value Since Last Call
     */
    //% block="Average PM2.5 Value in μg/m³"
    //% block.loc.pl="Średnia wartość PM2.5 w μg/m³"
    //% group="Measured Values"
    export function pm25AverageValue():number {
        if (avgpm25cnt == 0) {
            return 0
        }
        let average = avgpm25 / avgpm25cnt
        avgpm25 = pm25
        avgpm25cnt = 1
        return average
    }

    /**
     * Return Average PM2.5 Air Quality Value Since Last Call
     */
    //% block="Average PM10 Value in μg/m³"
    //% block.loc.pl="Średnia wartość PM10 w μg/m³"
    //% group="Measured Values"
    export function pm10AverageValue():number {
        if (avgpm10cnt == 0) {
            return 0
        }
        let average = avgpm10 / avgpm10cnt
        avgpm10 = pm10
        avgpm10cnt = 1
        return average 
    }

    /**
     * Send Current PM2.5 & PM10 Air Quality Value via Serial
     */
    //% block="Send Current PM values over serial"
    //% block.loc.pl="Wyślij aktualne PM2.5 i PM10 na port szeregowy"
    //% group="Measured Values"
    export function pmSerialSend():void {
        while (uartbusy == 1) {
            basic.pause(10)
        }
        serial.setBaudRate(BaudRate.BaudRate115200)
        serial.writeValue("PM25CUR", SDS011.pm25Value())
        serial.writeValue("PM10CUR", SDS011.pm10Value())
        serial.setBaudRate(BaudRate.BaudRate9600)
    }

    /**
     * Send Average PM2.5 & PM10 Air Quality Value via Serial
     */
    //% block="Send Average PM values over serial"
    //% block.loc.pl="Wyślij średnie PM2.5 i PM10 na port szeregowy"
    //% group="Measured Values"
    export function pmAverageSerialSend():void {
        while (uartbusy == 1) {
            basic.pause(10)
        }
        serial.setBaudRate(BaudRate.BaudRate115200)
        serial.writeValue("PM25AVG", SDS011.pm25AverageValue())
        serial.writeValue("PM10AVG", SDS011.pm10AverageValue())
        serial.setBaudRate(BaudRate.BaudRate9600)
    }

}
