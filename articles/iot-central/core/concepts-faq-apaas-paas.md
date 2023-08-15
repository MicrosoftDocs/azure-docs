---
title: Move from IoT Central to a PaaS solution
description: This article discusses how to move between application platform as a service (aPaaS) and platform as a service (PaaS) Azure IoT solution approaches.
author: dominicbetts
ms.author: dobett
ms.date: 11/28/2022
ms.topic: conceptual
ms.service: iot-central
services: iot-central
---

# How do I move between aPaaS and PaaS solutions?

IoT Central is the fastest and easiest way to evaluate your IoT scenario. You can use the *IoT Central migrator tool* to migrate devices seamlessly from IoT Central to a platform as a service (PaaS) solution that uses IoT Hub and the Device Provisioning Service (DPS).

## Move devices with the IoT Central migrator tool

Use the migrator tool to move devices with no downtime from IoT Central to your own DPS instance. In a PaaS solution, you link a DPS instance to your IoT hub. The migrator tool disconnects devices from IoT Central and connects them to your PaaS solution. From this point forward, new devices are created in your IoT hub.

Download the [migrator tool from GitHub](https://github.com/Azure/iotc-migrator).

## Minimize disruption

To minimize disruption, you can migrate your devices in phases. The migrator tool uses device groups to move devices from IoT Central to your IoT hub. Divide your device fleet into device groups such as devices in Texas, devices in New York, and devices in the rest of the US. Then migrate each device group independently.

> [!WARNING]
> You can't add unassigned devices to a device group. Therefore you can't currently use the migrator tool to migrate unassigned devices.

Minimize business impact by following these steps:

- Create the PaaS solution and run it in parallel with the IoT Central application.

- Set up continuous data export in IoT Central application and appropriate routes to the PaaS solution IoT hub. Transform both data channels and store the data into the same data lake.

- Migrate the devices in phases and verify at each phase. If something doesn't go as planned, fail the devices back to IoT Central.

- When you've migrated all the devices to the PaaS solution and fully exported your data from IoT Central, you can remove the devices from the IoT Central solution.

After the migration, devices aren't automatically deleted from the IoT Central application. These devices continue to be billed as IoT Central charges for all provisioned devices in the application. When you remove these devices from the IoT Central application, you're no longer billed for them. Eventually, remove the IoT Central application.

## Firmware best practices

So that you can seamlessly migrate devices from your IoT Central applications to PaaS solution, follow these guidelines:

- The device must be an IoT Plug and Play device that uses a [Digital Twins Definition Language (DTDL) V2](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.v2.md) model. IoT Central requires all devices to have a DTDL model. These models simplify the interoperability between an IoT PaaS solution and IoT Central.

- The device must follow the [IoT Plug and Play conventions](../../iot-develop/concepts-convention.md).
- IoT Central uses the DPS to provision the devices. The PaaS solution must also use DPS to provision the devices.
- The updatable DPS pattern ensures that the device can move seamlessly between IoT Central applications and the PaaS solution without any downtime.

> [!NOTE]
> IoT Central defines some extensions to the DTDL v2 language. To learn more, see [IoT Central extension](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.iotcentral.v2.md).

## Move existing data out of IoT Central

You can configure IoT Central to continuously export telemetry and property values. Export destinations are data stores such as Azure Data Lake, Event Hubs, and Webhooks. You can export device templates using either the IoT Central UI or the REST API. The REST API lets you export the users in an IoT Central application.

## Next steps  

Now that you've learned about moving from aPaaS to PaaS solutions, a suggested next step is to explore the [IoT Central migrator tool](https://github.com/Azure/iotc-migrator).

