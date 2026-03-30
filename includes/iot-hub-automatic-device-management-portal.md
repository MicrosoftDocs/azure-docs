---
title: Automatic device management at scale (Azure portal)
titleSuffix: Azure IoT Hub
description: Use Azure IoT Hub automatic configurations to manage multiple IoT devices and modules in the Azure portal
author: SoniaLopezBravo
ms.service: azure-iot-hub
ms.topic: include
ms.date: 12/01/2025
ms.author: sonialopez
ms.custom: ['Role: Cloud Development', 'Role: IoT Device']
---

## Prerequisites

* An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

* An IoT hub in your Azure subscription. If you don't have a hub yet, you can follow the steps in the **Create an IoT hub** section of [Create and manage Azure IoT hubs](../articles/iot-hub/create-hub.md).

## Implement twins

Automatic device configurations require the use of device twins to synchronize state between the cloud and devices. For more information, see [Understand and use device twins in IoT Hub](../articles/iot-hub/iot-hub-devguide-device-twins.md).

Automatic module configurations require the use of module twins to synchronize state between the cloud and modules. For more information, see [Understand and use module twins in IoT Hub](../articles/iot-hub/iot-hub-devguide-module-twins.md).

## Use tags to target twins

Before you create a configuration, you must specify which devices or modules you want to affect. Azure IoT Hub identifies devices using tags in the device twin, and identifies modules using tags in the module twin. Each device or modules can have multiple tags, and you can define them any way that makes sense for your solution. For example, if you manage devices in different locations, add the following tags to a device twin:

```json
"tags": {
    "location": {
        "state": "Washington",
        "city": "Tacoma"
    }
},
```

## Create a configuration

You can create a maximum of 100 automatic configurations on standard tier IoT hubs; 10 on free tier IoT hubs. To learn more, see [IoT Hub quotas and throttling](../articles/iot-hub/iot-hub-devguide-quotas-throttling.md).

1. In the [Azure portal](https://portal.azure.com), go to your IoT hub.
1. In the service menu, under **Device management**, select **Configurations + Deployments**.
1. Select **Add** and choose **Device twin configuration** or **Module twin configuration** from the dropdown list.

   :::image type="content" source="../articles/iot-hub/media/iot-hub-automatic-device-management/create-automatic-configuration.png" alt-text="Screenshot showing how to add a configuration." border="true":::

There are five steps to create a configuration. The following sections walk through each one.

### Name and label

1. Enter a unique name for your configuration. The name can be up to 128 characters and can include lowercase letters and the following special characters: `-+%_*!'`. Spaces aren't allowed.
1. Add labels to organize and describe your configuration. Labels are key-value pairs, such as `HostPlatform, Linux` or `Version, 3.0.1`.
1. Select **Next** to continue.

### Twin settings

Set the content in the targeted device twin or module twin desired properties by providing two inputs for each setting. First, specify the twin path, which points to the JSON section within the twin desired properties to update. Next, enter the JSON content to insert at that location.


For example, you could set the twin path to `properties.desired.chiller-water` and then provide the following JSON content: 

```json
{
  "temperature": 66,
  "pressure": 28
}
```

:::image type="content" source="../articles/iot-hub/media/iot-hub-automatic-device-management/module-config-twin-settings.png" alt-text="Screenshot of setting the device or module twin property and json content.":::

You can also set individual settings by specifying the entire twin path and providing the value with no brackets. For example, with the twin path `properties.desired.chiller-water.temperature`, set the content to `66`. Then create a new twin setting for the pressure property. 

If two or more configurations target the same twin path, the content from the highest priority configuration applies (priority is defined in step 4).

If you wish to remove an existing property, specify the property value to `null`.

You can add more settings by selecting **Add Device Twin Setting** or **Add Module Twin Setting**.

### Target devices or modules

Use the tags property from your twins to target the specific devices or modules that should receive this configuration. You can also target twin reported properties.

Automatic device configurations can only target device twin tags, and automatic module configurations can only target module twin tags. 

Since multiple configurations might target the same device or module, each configuration needs a priority number. If there's ever a conflict, the configuration with the highest priority wins. 

1. Enter a positive integer for the configuration **Priority**. The highest numerical value is considered as the highest priority. If two configurations have the same priority number, the one created most recently wins. 
1. Enter a **Target condition** to determine which devices or modules are targeted with this configuration. The condition is based on twin tags or twin reported properties and should match the expression format. 

   - For automatic device configuration, you can specify just the tag or reported property to target. For example, `tags.environment='test'` or `properties.reported.chillerProperties.model='4000x'`. You can specify `*` to target all devices. 
   
   - For automatic module configuration, use a query to specify tags or reported properties from the modules registered to the IoT hub. For example, `from devices.modules where tags.environment='test'` or `from devices.modules where properties.reported.chillerProperties.model='4000x'`. The wildcard can't be used to target all modules. 

### Metrics

Metrics provide summary counts of the various states that a device or module might report back after applying configuration content. For example, you might create a metric for pending settings changes, a metric for errors, and a metric for successful settings changes.

Each configuration can have up to five custom metrics. 

1. Enter a name for **Metric Name**.
1. Enter a query for **Metric Criteria**. The query is based on device twin reported properties. The metric represents the number of rows returned by the query.

   For example:

   ```sql
   SELECT deviceId FROM devices 
     WHERE properties.reported.chillerWaterSettings.status='pending'
   ```

   You can include a clause that the configuration was applied, for example:

   ```sql
   /* Include the double brackets. */
   SELECT deviceId FROM devices 
     WHERE configurations.[[yourconfigname]].status='Applied'
   ```

   If you're building a metric to report on configured modules, select `moduleId` from `devices.modules`. For example:

   ```sql
   SELECT deviceId, moduleId FROM devices.modules
     WHERE properties.reported.lastDesiredStatus.code = 200
   ```

### Review Configuration

Review your configuration information, then select **Submit**.

## Monitor a configuration

To view the details of a configuration and monitor the devices running it, use the following steps:

1. In the [Azure portal](https://portal.azure.com), go to your IoT hub. 
1. In the service menu, under **Device management**, select **Configurations + Deployments**.
1. Inspect the configuration list. For each configuration, you can view the following details:

   * **ID** - the name of the configuration.

   * **Target condition** - the query used to define targeted devices or modules.

   * **Priority** - the priority number assigned to the configuration.

   * **Creation time** - the timestamp from when the configuration was created. This timestamp is used to break ties when two configurations have the same priority. 

   * **System metrics** - metrics that are calculated by IoT Hub and can't be customized by developers. *Targeted* specifies the number of device twins that match the target condition. *Applies* specifies the number of device twins that are modified by the configuration, which can include partial modifications if a separate, higher priority configuration also made changes. 

   * **Custom metrics** - metrics that are specified by the developer as queries against twin reported properties. Up to five custom metrics can be defined per configuration. 
   
1. Select the configuration that you want to monitor. 
1. Inspect the configuration details. You can use tabs to view specific details about the devices that received the configuration.

   * **Target Devices** or **Target Modules** - the devices or modules that match the target condition.

   * **Metrics** - a list of system metrics and custom metrics. You can view a list of devices or modules that are counted for each metric by selecting the metric in the drop-down and then selecting **View Devices** or **View Modules**.

   * **Labels** - key-value pairs used to describe a configuration. Labels have no impact on functionality.

   * **Device Twin Settings** or **Module Twin Settings** - the twin settings that are set by the configuration, if any.

## Modify a configuration

When you modify a configuration, the changes immediately replicate to all targeted devices or modules. 

If you update the target condition, the following updates occur:

* If a twin didn't meet the old target condition, but meets the new target condition and this configuration is the highest priority for that twin, then this configuration is applied. 

* If a twin currently running this configuration no longer meets the target condition, the settings from the configuration are removed and the twin is modified by the next highest priority configuration. 

* If a twin currently running this configuration no longer meets the target condition and doesn't meet the target condition of any other configurations, then the settings from the configuration are removed and no other changes are made on the twin. 

To modify a configuration, use the following steps: 

1. In the [Azure portal](https://portal.azure.com), go to your IoT hub. 
1. In the service menu, under **Device management**, select **Configurations + Deployments**.
1. Select the configuration that you want to modify. 
1. You can make updates to the following fields: priority, metrics, target condition, and labels.
1. Select **Save**.
1. Follow the steps in [Monitor a configuration](#monitor-a-configuration) to watch the changes roll out. 

## Delete a configuration

When you delete a configuration, any device twins take on their next highest priority configuration. If device twins don't meet the target condition of any other configuration, then no other settings are applied. 

1. In the [Azure portal](https://portal.azure.com), go to your IoT hub. 
1. In the service menu, under **Device management**, select **Configurations + Deployments**.
1. Use the checkbox to select the configuration that you want to delete. 
1. Select **Delete**.
1. A prompt asks you to confirm the deletion.
