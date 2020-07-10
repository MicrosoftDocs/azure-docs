---
author: dominicbetts
ms.author: dominicbetts
ms.service: iot-pnp
ms.topic: include
ms.date: 04/27/2020
---

1. Open Azure IoT explorer. You see the **App configurations** page.

1. Enter your _IoT Hub connection string_ and select **Connect**.

1. After you connect, you see the **Devices** overview page.

1. To ensure the tool can read the model definition from your device, select **Settings**. In the Settings menu, **On the connected device** may already appear in the Plug and Play configurations; if it does not, select **+ Add module definition source** and then **On the connected device** to add it. To save any changes you made, select **Save and Connect**.

1. Back on the **Devices** overview page, find the device identity you created previously. With the sample device application still running in the command prompt, check that the device **Connection state** in Azure IoT explorer is **Connected**. If the connection state is **Disconnected**, select **Refresh** until it is. Click on the device ID to view more details about the device.

1. Select **IoT Plug and Play components** to view the model information for your device.

1. Select the **Telemetry** page and then select **Start** to view the telemetry data the device is sending.

1. Select the **Properties (non-writable)** page to view the non-writable properties reported by the device.

1. Select the **Properties (writable)** page to view the writable properties you can update.

1. Expand property **name**, enter a new name, and select **Update writable property**.

1. To see the new name show up in the **Reported Property** column, select the **Refresh** button on top of the page.

1. Select the **Commands** page to view all the commands the device supports.

1. Expand the **getMaxMinReport ** command and set a new blink time interval. Select **Send command** to call the command on the device.

1. Go to the simulated device command prompt. Read through the printed confirmation messages to verify that the command executed as expected.
