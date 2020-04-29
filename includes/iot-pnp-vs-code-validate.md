---
author: dominicbetts
ms.author: dobett
ms.service: iot-pnp
ms.topic: include
ms.date: 03/17/2020
---

### Use Azure IoT explorer to validate the code

1. Open Azure IoT explorer. You see the **App configurations** page.

1. Enter your _IoT Hub connection string_ and select **Connect**.

1. After you connect, you see the **Devices** overview page.

1. To add your company repository, select **Settings**, then **+ Add module definition source**, then **Company repository**. Add your company model repository connection string, and select **Save and Connect**.

1. Back on the **Devices** overview page, find the device identity you created previously. With the device application still running in the command prompt, check that the device's **Connection state** in Azure IoT explorer is reporting as _Connected_. If it's not showing as connected, select **Refresh** until it is. Select the device to view more details.

1. Select **IoT Plug and Play components**.

1. Expand the interface with ID **urn:\<your name\>:EnvironmentalSensor:1** to see the IoT Plug and Play primitives - properties, commands, and telemetry. The interface name is the name you used when you authored your model.

1. Select the **Telemetry** page and then select _Start_ to view the telemetry data the device is sending.

1. Select the **Properties (non-writable)** page to view the non-writable properties reported by the device.

1. Select the **Properties (writable)** page to view the writable properties you can update.

1. Expand property **name**, enter a new name, and select **Update writable property**.

1. To see the new name show up in the **Reported Property** column, select the **Refresh** button on top of the page.

1. Select the **Commands** page to view all the commands the device supports.

1. Expand the **blink** command and set a new blink time interval. Select **Send command** to call the command on the device.

1. Go to the simulated device command prompt and read through the printed confirmation messages to verify that the commands have executed as expected.
