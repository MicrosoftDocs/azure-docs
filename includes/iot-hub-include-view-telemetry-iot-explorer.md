---
title: include file
description: include file
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.topic: include
ms.date: 07/31/2021
---

## View telemetry

After the simulated device connects to IoT Hub, it begins sending telemetry. You can view the device telemetry with IoT Explorer. Optionally, you can view telemetry using Azure CLI.

In this section, you'll use the Plug and Play capabilities surfaced in IoT Explorer to manage and interact with the simulated device. These capabilities rely on the device model published in the public model repository. You configured IoT Explorer to search this repository for device models earlier in this quickstart. In many cases, you can perform the same action without using plug and play by selecting the same action from the left side menu of your device pane in IoT Explorer; however, using plug and play often provides an enhanced experience. This is because IoT Explorer can read the device model specified by a plug and play device and present information specific to that device.  

To view telemetry in Azure IoT Explorer:

1. From the **IoT Plug and Play components** (Default Component) pane for your device in IoT Explorer, select the **Telemetry** tab. Confirm that **Use built-in event hub** is set to *Yes*.
1. Select **Start**.
1. View the telemetry as the device sends messages to the cloud.

    :::image type="content" source="media/iot-hub-include-view-telemetry-iot-explorer/iot-explorer-device-telemetry.png" alt-text="Screenshot of device telemetry in IoT Explorer":::

1. Select the **Show modeled events** checkbox to view the events in the data format specified by the device model.

    :::image type="content" source="media/iot-hub-include-view-telemetry-iot-explorer/iot-explorer-show-modeled-events.png" alt-text="Screenshot of modeled telemetry events in IoT Explorer":::

1. Select **Stop** to end receiving events.

To use Azure CLI to view device telemetry:

1. In your CLI app, run the [az iot hub monitor-events](/cli/azure/iot/hub#az_iot_hub_monitor_events) command to monitor events sent from the simulated device to your IoT hub. Use the names that you created previously in Azure IoT for your device and IoT hub.

    ```azurecli
    az iot hub monitor-events --output table --device-id mydevice --hub-name {YourIoTHubName}
    ```

1. View the connection details and telemetry output in the console.

    ```output
    Starting event monitor, use ctrl-c to stop...
    event:
      component: thermostat1
      interface: dtmi:com:example:TemperatureController;2
      module: ''
      origin: myDevice
      payload:
        temperature: 39.8
    
    event:
      component: thermostat2
      interface: dtmi:com:example:TemperatureController;2
      module: ''
      origin: myDevice
      payload:
        temperature: 36.7
    ```

1. Select CTRL+C to end monitoring.


