---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 11/17/2022
---

1. Open Azure IoT explorer.

1. On the **IoT hubs** page, if you haven't already added a connection to your IoT hub, select **+ Add connection**. Enter the connection string for the IoT hub you created previously and select **Save**.

1. On the **IoT Plug and Play Settings** page, select **+ Add > Local folder** and select the local *models* folder where you saved your model files.

1. On the **IoT hubs** page, click on the name of the hub you want to work with. You see a list of devices registered to the IoT hub.

1. Click on the **Device ID** of the device you created previously.

1. The menu on the left shows the different types of information available for the device.

1. Select **IoT Plug and Play components** to view the model information for your device.

1. You can view the different components of the device. The default component and any extra ones. Select a component to work with.

1. Select the **Telemetry** page and then select **Start** to view the telemetry data the device is sending for this component.

1. Select the **Properties (read-only)** page to view the read-only properties reported for this component.

1. Select the **Properties (writable)** page to view the writable properties you can update  for this component.

1. Select a property by it's **name**, enter a new value for it, and select **Update desired value**.

1. To see the new value show up  select the **Refresh** button.

1. Select the **Commands** page to view all the commands for this component.

1. Select the command you want to test set the parameter if any. Select **Send command** to call the command on the device. You can see your device respond to the command in the command prompt window where the sample code is running.
