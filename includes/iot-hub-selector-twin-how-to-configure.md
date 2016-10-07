> [AZURE.SELECTOR]
- [Node.js](../articles/iot-hub/iot-hub-node-node-twin-how-to-configure.md)
- [C#](../articles/iot-hub/iot-hub-csharp-node-twin-how-to-configure.md)

## Introduction

In [Get started with IoT Hub twins][lnk-twin-tutorial], you learned how to set device meta-data from your solution back end using *tags*, report device conditions from a device app using *reported properties*, and query this information using a SQL-like language.

In this tutorial, you will learn how to use the the twin's *desired properties* in conjunction with *reported properties*, to remotely configure device apps. More specifically, this tutorial shows how twin's reported and desired properties enable a multi-step configuration of a device application setting, and provide the visibility to the solution back end of the status of this operation across all devices.

At a high level, this tutorial follows the *desired state pattern* for device management. The fundamental idea of this pattern is to have the solution back end specify the desired state for the managed devices, instead of sending specific commands. This puts the device in charge of establishing the best way to reach the desired state (very important in IoT scenarios where specific device conditions affect the ability to immediately carry out specific commands), while continually reporting to the back end the current state and potential error conditions. The desired state pattern is instrumental to the management of large sets of devices, as it enables the back end to have full visibility of the state of the configuration process across all devices.
You can find more information regarding the role of the desired state pattern in device management in [Overview of Azure IoT Hub device management][lnk-dm-overview].

> [AZURE.NOTE] In scenarios where devices are controlled in a more interactive fashion (turn on a fan from a user-controlled app), consider using [cloud-to-device methods][lnk-methods].

In this tutorial, the application back end changes the telemetry configuration of a target device and, as a result of that, the device app follows a multi-step process to apply a configuration update (e.g. requiring a software module restart), which this tutorial simulates with a simple delay).

The back-end stores the configuration in the device twin's desired properties in the following way:

        {
            ...
            "properties": {
                ...
                "desired": {
                    "telemetryConfig": {
                        "configId": "{id of the configuration}",
                        "sendFrequency": "{config}"
                    }
                }
                ...
            }
            ...
        }

> [AZURE.NOTE] Since configurations can be complex objects, they are usually assigned unique ids (hashes or [GUIDs][lnk-guid]) to simplify their comparisons.

The device app reports its current configuration mirroring the desired property **telemetryConfig** in the reported properties:

        {
            "properties": {
                ...
                "reported": {
                    "telemetryConfig": {
                        "changeId": "{id of the current configuration}",
                        "sendFrequency": "{current configuration}",
                        "status": "Success",
                    }
                }
                ...
            }
        }

Note how the reported **telemetryConfig** has an additional property **status**, used to report the state of the configuration update process.

When a new desired configuration is received, the device app reports a pending configuration by changing the information:

        {
            "properties": {
                ...
                "reported": {
                    "telemetryConfig": {
                        "changeId": "{id of the current configuration}",
                        "sendFrequency": "{current configuration}",
                        "status": "Pending",
                        "pendingConfig": {
                            "changeId": "{id of the pending configuration}",
                            "sendFrequency": "{pending configuration}"
                        }
                    }
                }
                ...
            }
        }

Then, at some later time, the device app will report the success of failure of this operation by updating the above property.
Note how the back end is able, at any time, to query the status of the configuration process across all the devices.

This tutorial shows you how to:

- Create a simulated device that receives configuration updates from the back end and reports multiple updates as *reported properties* on the configuration update process.
- Create a back-end app that updates the desired configuration of a device, and then queries the configuration update process.

<!-- links -->

[lnk-methods]: ../articles/iot-hub/iot-hub-devguide-direct-methods.md
[lnk-dm-overview]: ../articles/iot-hub/iot-hub-device-management-overview.md
[lnk-twin-tutorial]: ../articles/iot-hub/iot-hub-node-node-twin-getstarted.md
[lnk-guid]: https://en.wikipedia.org/wiki/Globally_unique_identifier