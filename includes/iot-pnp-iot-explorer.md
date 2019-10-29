---
author: baanders
ms.author: baanders
ms.service: iot-pnp
ms.topic: include
ms.date: 10/24/2019
---

## Use the Azure IoT explorer to validate the code

1. Open Azure IoT explorer. You see the **App configurations** page.

1. Enter your _IoT Hub connection string_ and select **Connect**.

1. After you connect, you see the device overview page.

1. To ensure the tool can read the interface model definitions from your device, select **Settings**. In the Settings menu, **On the connected device** may already appear in the list of locations to check; if it does not, select **+ New** and then **On the connected device** to add it.

1. On the device overview page, find the device identity you created previously, and select it to view more details.

1. Expand the interface with ID **urn:YOUR_COMPANY_NAME_HERE:EnvironmentalSensor:1** to see the IoT Plug and Play primitives - interface, properties, commands, and telemetry.

1. Select the **Telemetry** page to view the telemetry data the device is sending.

1. Select the **Properties(non-writable)** page to view the non-writable properties reported by the device.

1. Select the **Properties(writable)** page to view the writable properties you can update.

1. Expand property **name**, update with a new name and select **update writable property**. 

1. To see the new name show up in the **Reported Property** column, select the **Refresh** button on top of the page.

1. Select the **Command** page to view all the commands the device supports.

1. Expand the **blink** command and set a new blink time interval. Select **Send Command** to call the command on the device.

1. Go to the simulated device to verify that the command executed as expected.