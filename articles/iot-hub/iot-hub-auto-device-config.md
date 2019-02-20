---
title: Configure and monitor IoT devices at scale with Azure IoT Hub | Microsoft Docs
description: Use Azure IoT Hub automatic device configurations to assign a configuration to multiple devices
author: ChrisGMsft
manager: bruz
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/13/2018
ms.author: chrisgre
---

# Configure and monitor IoT devices at scale using the Azure portal

[!INCLUDE [iot-edge-how-to-deploy-monitor-selector](../../includes/iot-hub-auto-device-config-selector.md)]

Automatic device management in Azure IoT Hub automates many of the repetitive and complex tasks of managing large device fleets over the entirety of their lifecycles. With automatic device management, you can target a set of devices based on their properties, define a desired configuration, and let IoT Hub update devices whenever they come into scope.  This is performed using an automatic device configuration, which will also allow you to summarize completion and compliance, handle merging and conflicts, and roll out configurations in a phased approach.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

Automatic device configurations work by updating a set of device twins with desired properties and reporting a summary based on device twin reported properties.  It introduces a new class and JSON document called a *Configuration* which has three parts:

* The **target condition** defines the scope of device twins to be updated. The target condition is specified as a query on device twin tags and/or reported properties.

* The **target content** defines the desired properties to be added or updated in the targeted device twins. The content includes a path to the section of desired properties to be changed.

* The **metrics** define the summary counts of various configuration states such as **Success**, **In Progress**, and **Error**. Custom metrics are specified as queries on device twin reported properties.  System metrics are default metrics that measure twin update status, such as the number of device twins that are targeted and the number of twins that have been successfully updated. 

## Implement device twins to configure devices

Automatic device configurations require the use of device twins to synchronize state between the cloud and devices. Refer to [Understand and use device twins in IoT Hub](iot-hub-devguide-device-twins.md) for guidance on using device twins.

## Identify devices using tags

Before you can create a configuration, you must specify which devices you want to affect. Azure IoT Hub identifies devices using tags in the device twin. Each device can have multiple tags, and you can define them any way that makes sense for your solution. For example, if you manage devices in different locations, you may add the following tags to a device twin:

```json
"tags": {
	"location": {
		"state": "Washington",
		"city": "Tacoma"
    }
},
```

## Create a configuration

1. In the [Azure portal](https://portal.azure.com), go to your IoT hub. 

2. Select **IoT device configuration**.

3. Select **Add Configuration**.

There are five steps to create a configuration. The following sections walk through each one. 

### Name and Label

1. Give your configuration a unique name that is up to 128 lowercase letters. Avoid spaces and the following invalid characters: `& ^ [ ] { } \ | " < > /`.

2. Add labels to help track your configurations. Labels are **Name**, **Value** pairs that describe your configuration. For example, `HostPlatform, Linux` or `Version, 3.0.1`.

3. Select **Next** to move to the next step. 

### Specify Settings

This section specifies the target content to be set in targeted device twins. There are two inputs for each set of settings. The first is the device twin path, which is the path to the JSON section within the twin desired properties that will be set.  The second is the JSON content to be inserted in that section. For example, set the Device Twin Path and Content to the following:

![Set the Device Twin Path and Content](./media/iot-hub-auto-device-config/create-configuration-full-browser.png)

You can also set individual settings by specifying the entire path in the Device Twin Path and the value in the Content with no brackets. For example, set the Device Twin Path to `properties.desired.chiller-water.temperature` and set the Content to `66`.

If two or more configurations target the same Device Twin Path, the Content from the highest priority configuration will apply (priority is defined in Step 4).

If you wish to remove a property, specify the property value to `null`.

You can add additional settings by selecting **Add Device Twin Setting**.

### Specify Metrics (optional)

Metrics provide summary counts of the various states that a device may report back as a result of applying configuration content. For example, you may create a metric for pending settings changes, a metric for errors, and a metric for successful settings changes.

1. Enter a name for **Metric Name**.

2. Enter a query for **Metric Criteria**.  The query is based on device twin reported properties.  The metric represents the number of rows returned by the query.

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

### Target Devices

Use the tags property from your device twins to target the specific devices that should receive this configuration.  You can also target devices by device twin reported properties.

Since multiple configurations may target the same device, you should give each configuration a priority number. If there's ever a conflict, the configuration with the highest priority wins. 

1. Enter a positive integer for the configuration **Priority**. The highest numerical value is considered the highest priority. If two configurations have the same priority number, the one that was created most recently wins. 

2. Enter a **Target condition** to determine which devices will be targeted with this configuration. The condition is based on device twin tags or device twin reported properties and should match the expression format. For example, `tags.environment='test'` or `properties.reported.chillerProperties.model='4000x'`. You can specify `*` to target all devices.

3. Select **Next** to move on to the final step.

### Review Configuration

Review your configuration information, then select **Submit**.

## Monitor a configuration

To view the details of a configuration and monitor the devices running it, use the following steps:

1. In the [Azure portal](https://portal.azure.com), go to your IoT hub. 

2. Select **IoT device configuration**.

3. Inspect the configuration list. For each configuration, you can view the following details:

   * **ID** - the name of the configuration.

   * **Target condition** - the query used to define targeted devices.

   * **Priority** - the priority number assigned to the configuration.

   * **Creation time** - the timestamp from when the configuration was created. This timestamp is used to break ties when two configurations have the same priority. 

   * **System metrics** - metrics that are calculated by IoT Hub and cannot be customized by developers. Targeted specifies the number of device twins that match the target condition. Applies specified the number of device twins that have been modified by the configuration, which can include partial modifications in the event that a separate, higher priority configuration also made changes. 

   * **Custom metrics** - metrics that have been specified by the developer as queries against device twin reported properties.  Up to five custom metrics can be defined per configuration. 
   
4. Select the configuration that you want to monitor.  

5. Inspect the configuration details. You can use tabs to view specific details about the devices that received the configuration.

   * **Target Condition** - the devices that match the target condition. 

   * **Metrics** - a list of system metrics and custom metrics.  You can view a list of devices that are counted for each metric by selecting the metric in the drop-down and then selecting **View Devices**.

   * **Device Twin Settings** - the device twin settings that are set by the configuration. 

   * **Configuration Labels** - key-value pairs used to describe a configuration.  Labels have no impact on functionality. 

## Modify a configuration

When you modify a configuration, the changes immediately replicate to all targeted devices. 

If you update the target condition, the following updates occur:

* If a device twin didn't meet the old target condition, but meets the new target condition and this configuration is the highest priority for that device twin, then this configuration is applied to the device twin. 

* If a device twin no longer meets the target condition, the settings from the configuration will be removed and the device twin will be modified by the next highest priority configuration. 

* If a device twin currently running this configuration no longer meets the target condition and doesn't meet the target condition of any other configurations, then the settings from the configuration will be removed and no other changes will be made on the twin. 

To modify a configuration, use the following steps: 

1. In the [Azure portal](https://portal.azure.com), go to your IoT hub. 

2. Select **IoT device configuration**. 

3. Select the configuration that you want to modify. 

4. Make updates to the following fields: 

   * Target condition 
   * Labels 
   * Priority 
   * Metrics

4. Select **Save**.

5. Follow the steps in [Monitor a configuration](#monitor-a-configuration) to watch the changes roll out. 

## Delete a configuration

When you delete a configuration, any device twins take on their next highest priority configuration. If device twins don't meet the target condition of any other configuration, then no other settings are applied. 

1. In the [Azure portal](https://portal.azure.com) go to your IoT hub. 

2. Select **IoT device configuration**. 

3. Use the checkbox to select the configuration that you want to delete. 

4. Select **Delete**.

5. A prompt will ask you to confirm.

## Next steps

In this article, you learned how configure and monitor IoT devices at scale. Follow these links to learn more about managing Azure IoT Hub:

* [Manage your IoT Hub device identities in bulk](iot-hub-bulk-identity-mgmt.md)
* [IoT Hub metrics](iot-hub-metrics.md)
* [Operations monitoring](iot-hub-operations-monitoring.md)

To further explore the capabilities of IoT Hub, see:

* [IoT Hub developer guide](iot-hub-devguide.md)
* [Deploying AI to edge devices with Azure IoT Edge](../iot-edge/tutorial-simulate-device-linux.md)

To explore using the IoT Hub Device Provisioning Service to enable zero-touch, just-in-time provisioning, see: 

* [Azure IoT Hub Device Provisioning Service](/azure/iot-dps)
