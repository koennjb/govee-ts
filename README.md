# TypeScript Govee Client

[![CI](https://img.shields.io/github/workflow/status/koennjb/govee-ts/CI)](https://img.shields.io/github/workflow/status/koennjb/govee-ts/CI) ![Codecov](https://img.shields.io/codecov/c/github/koennjb/govee-ts) ![npm type definitions](https://img.shields.io/npm/types/typescript)

This package uses the **Govee HTTP API v1.1** to control Govee smart LEDs in NodeJS. It is written in TypeScript so there is full type support. Behind the scenes, it uses Axios so this package should be supported on all browsers.

# API Key

To use this API, you must request an API key through the [Govee Home](https://www.govee.com/govee-home) app.

- Go to your profile tab
- Go to the "About Us" section, then "Apply for API key"
- Enter your name and a reason that you wish to use the API. It can be a brief description saying you want to control your lights programmatically.
- Shortly after, check your email. There should be an email from Govee containing your API Key and the API documentation.

# Installation

To install this package, run `npm install govee-ts`.

# Usage

Most of the methods to get/control devices in this API are asynchronous. You can use `async/await` methods or the regular `.then().catch()` format for these methods.

## Instantiate client

    // Import using ES6 syntax
    import Govee from 'govee-ts';

    // If using CommonJS (requires)
    const Govee = require('govee-ts').default;

    var client = new Govee("<your API key here>");

## Find devices

govee-ts caches all devices using the name as the key to retrieve a device. To get a list of all devices, use the `getDevices()` method.

    await client.getDevices();

The first time you call the method it will retrieve all devices from the API and store each one in the cache. Each subsequent call with return all cached devices.

## Get a specific device

    var device = client.getDevice('deviceName');

once you have a device, you can use its methods to control it.

    // Turn the device on
    await device.turnOn();
    // Turn the device on
    await device.turnOff();

    // Set the device's brightness
    await device.setBrightness(50); // from 1-100

    // Set the color
    await device.setHexColor('#a02020');
    // or using RGB
    await device.setRGBColor({r: 160, g: 32, b: 32});

    // Set the device's color temperature
    await device.setColorTemperature(6000);

    // Get device state
    await device.getState();

## Alternative Device Control

Instead of retrieving a specific device, if you wish to you can use the Govee methods to control a device using the MAC address and device model.

    // On or off
    await client.setPower('<device MAC address>', '<device model>, true); // true for on, false for off.

    // Brightness
    await client.setBrightness('<device MAC address>', '<device model>, 50); // 1-100

    // Color
    await client.setBrightness('<device MAC address>', '<device model>, { r: 50, g: 50, b: 50 }); // RGB color only

    // Color temperature
    await client.setTemperature(<device MAC address>', '<device model>, 6000);

## Supported models

According to the Govee API documentation, it currently supports models: **H6160, H6163,
H6104, H6109, H6110, H6117, H6159, H7021, H7022, H6086, H6089, H6182, H6085, H7014, H5081, H6188, H6135, H6137, H6141, H6142, H6195, H7005, H6083, H6002, H6003, H6148, H6052, H6143, H6144, H6050, H6199 H6054, H5001**

## Issues

Please add any issues or feature requests to the [GitHub Issues page](https://github.com/koennjb/govee-ts/issues)!

## Contributing

This is my first open source project and there's a lot that can be improved here. Feel free to submit pull requests if you would like to contribute to this package 🙂
