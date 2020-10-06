basic.forever(function () {
    SDS011.readAirQualityData()
    led.toggle(0, 0)
})
