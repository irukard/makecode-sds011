basic.forever(function () {
    SDS011.readAirQualityData()
    led.toggle(0, 0)
    basic.pause(200)
})
