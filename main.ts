let distanceBackup: number = 0;

function measureInMeters(pin: DigitalPin): number {
    let duration = 0;
    let RangeInMeters = 0;

    pins.digitalWritePin(pin, 0);
    control.waitMicros(2);
    pins.digitalWritePin(pin, 1);
    control.waitMicros(20);
    pins.digitalWritePin(pin, 0);
    duration = pins.pulseIn(pin, PulseValue.High, 50000); // Max duration 50 ms

    RangeInMeters = duration * 0.3432 / 2000;

    if (RangeInMeters > 0) distanceBackup = RangeInMeters;
    else RangeInMeters = distanceBackup;

    basic.pause(50);

    return RangeInMeters;
}

namespace modules {

    /**
     * Grove Ultrasonicsensor at C16
     */
    //% fixedInstance whenUsed block="Grove ultrasonic"
    export const seeedUltrasonic = new DistanceClient("grove ultrasonic?dev=self&variant=sonar")
}

namespace servers {
    function start() {
        jacdac.productIdentifier = 0x3fb58ebc
        jacdac.deviceDescription = "Seeed ultrasonic"
        jacdac.startSelfServers(() => [
            jacdac.createSimpleSensorServer(jacdac.SRV_DISTANCE,
                jacdac.DistanceRegPack.Distance,
                () => measureInMeters(116), {
                variant: jacdac.DistanceVariant.Ultrasonic,
                streamingInterval: 100
            }
            ),
        ])

    }
    start()
}