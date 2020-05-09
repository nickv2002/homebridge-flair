import type { Service, PlatformAccessory, CharacteristicValue, CharacteristicSetCallback, CharacteristicGetCallback} from 'homebridge';

import { FlairPlatform } from './platform';
import Client from "flair-api-ts/lib/client";
import {Vent} from "flair-api-ts/lib/client/models";

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class FlairVentPlatformAccessory {
    private windowService: Service;
    private temperatureService: Service;

    private vent: Vent;
    private client: Client;

    constructor(
        private readonly platform: FlairPlatform,
        private readonly accessory: PlatformAccessory,
        client: Client
    ) {
        this.vent = this.accessory.context.device;
        this.client = client;

        // set accessory information
        this.accessory.getService(this.platform.Service.AccessoryInformation)!
            .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Flair')
            .setCharacteristic(this.platform.Characteristic.Model, 'Vent')
            .setCharacteristic(this.platform.Characteristic.SerialNumber, this.vent.id!);

        // get the LightBulb service if it exists, otherwise create a new LightBulb service
        // you can create multiple services for each accessory
        this.windowService = this.accessory.getService(this.platform.Service.WindowCovering) ?? this.accessory.addService(this.platform.Service.WindowCovering);
        this.temperatureService = this.accessory.getService(this.platform.Service.TemperatureSensor) ?? this.accessory.addService(this.platform.Service.TemperatureSensor);
        this.windowService.addLinkedService(this.temperatureService);

        // To avoid "Cannot add a Service with the same UUID another Service without also defining a unique 'subtype' property." error,
        // when creating multiple services of the same type, you need to use the following syntax to specify a name and subtype id:
        // this.accessory.getService('NAME') ?? this.accessory.addService(this.platform.Service.Lightbulb, 'NAME', 'USER_DEFINED_SUBTYPE');

        // set the service name, this is what is displayed as the default name on the Home app
        // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.
        this.windowService.setCharacteristic(this.platform.Characteristic.Name, this.vent.name!);
        this.windowService.setCharacteristic(this.platform.Characteristic.TargetPosition, this.vent.percentOpen)
        this.windowService.setCharacteristic(this.platform.Characteristic.CurrentPosition, this.vent.percentOpen)
        this.windowService.setCharacteristic(this.platform.Characteristic.PositionState, this.platform.Characteristic.PositionState.STOPPED)

        // this.pressureCharactristic = this.windowService.getCharacteristic(PressureCharacteristic) ?? this.windowService.addCharacteristic(PressureCharacteristic)
        // this.pressureCharactristic.setValue(123);

        //this.temperatureService.setCharacteristic(this.platform.Characteristic.CurrentTemperature, 50)

        // each service must implement at-minimum the "required characteristics" for the given service type
        // see https://github.com/homebridge/HAP-NodeJS/blob/master/src/lib/gen/HomeKit.ts

        // // register handlers for the On/Off Characteristic
        // this.service.getCharacteristic(this.platform.Characteristic.On)
        //     .on(CharacteristicEventTypes.SET, this.setOn.bind(this))                // SET - bind to the `setOn` method below
        //     .on(CharacteristicEventTypes.GET, this.getOn.bind(this));               // GET - bind to the `getOn` method below
        //
        // // register handlers for the Brightness Characteristic
        // this.service.getCharacteristic(this.platform.Characteristic.Brightness)
        //     .on(CharacteristicEventTypes.SET, this.setBrightness.bind(this));       // SET - bind to the 'setBrightness` method below

        // EXAMPLE ONLY
        // Example showing how to update the state of a Characteristic asynchronously instead
        // of using the `on('get')` handlers.
        //
        // Here we change update the brightness to a random value every 5 seconds using
        // the `updateCharacteristic` method.
        // setInterval(() => {
        //     // assign the current temperature a random value between 0 and 100
        //     const currentTemperature = Math.floor(Math.random() * 100);
        //
        //     // push the new value to HomeKit
        //     this.temperatureService.updateCharacteristic(this.platform.Characteristic.CurrentTemperature, currentTemperature);
        //
        //     this.platform.log.debug('Pushed updated current temperature state to HomeKit:', currentTemperature);
        // }, 10000);
    }

    /**
     * Handle "SET" requests from HomeKit
     * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
     */
    // setOn(value: CharacteristicValue, callback: CharacteristicSetCallback) {
    //
    //     // implement your own code to turn your device on/off
    //     this.exampleStates.On = value as boolean;
    //
    //     this.platform.log.debug('Set Characteristic On ->', value);
    //
    //     // you must call the callback function
    //     callback(null);
    // }

    /**
     * Handle the "GET" requests from HomeKit
     * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
     *
     * GET requests should return as fast as possbile. A long delay here will result in
     * HomeKit being unresponsive and a bad user experience in general.
     *
     * If your device takes time to respond you should update the status of your device
     * asynchronously instead using the `updateCharacteristic` method instead.
     * @example
     * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
     */
    // getOn(callback: CharacteristicGetCallback) {
    //
    //     // implement your own code to check if the device is on
    //     const isOn = this.exampleStates.On;
    //
    //     this.platform.log.debug('Get Characteristic On ->', isOn);
    //
    //     // you must call the callback function
    //     // the first argument should be null if there were no errors
    //     // the second argument should be the value to return
    //     callback(null, isOn);
    // }

    /**
     * Handle "SET" requests from HomeKit
     * These are sent when the user changes the state of an accessory, for example, changing the Brightness
     */
    // setBrightness(value: CharacteristicValue, callback: CharacteristicSetCallback) {
    //
    //     // implement your own code to set the brightness
    //     this.exampleStates.Temperature = value as number;
    //
    //     this.platform.log.debug('Set Characteristic Brightness -> ', value);
    //
    //     // you must call the callback function
    //     callback(null);
    // }

}
