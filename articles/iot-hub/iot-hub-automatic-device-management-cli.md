---
title: Automatic device management at scale with Azure IoT Hub (CLI) | Microsoft Docs
description: Use Azure IoT Hub automatic device management to assign a configuration to multiple IoT devices
author: ChrisGMsft
manager: bruz
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 06/28/2019
ms.author: chrisgre
---

# Automatic IoT device management at scale using the Azure CLI

[!INCLUDE [iot-edge-how-to-deploy-monitor-selector](../../includes/iot-hub-auto-device-config-selector.md)]

Automatic device management in Azure IoT Hub automates many of the repetitive and complex tasks of managing large device fleets. With automatic device management, you can target a set of devices based on their properties, define a desired configuration, and then let IoT Hub update the devices when they come into scope. This update is done using an _automatic device configuration_, which lets you summarize completion and compliance, handle merging and conflicts, and roll out configurations in a phased approach.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

Automatic device management works by updating a set of device twins with desired properties and reporting a summary that's based on device twin reported properties.  It introduces a new class and JSON document called a *Configuration* that has three parts:

* The **target condition** defines the scope of device twins to be updated. The target condition is specified as a query on device twin tags and/or reported properties.

* The **target content** defines the desired properties to be added or updated in the targeted device twins. The content includes a path to the section of desired properties to be changed.

* The **metrics** define the summary counts of various configuration states such as **Success**, **In Progress**, and **Error**. Custom metrics are specified as queries on device twin reported properties.  System metrics are the default metrics that measure twin update status, such as the number of device twins that are targeted and the number of twins that have been successfully updated.

Automatic device configurations run for the first time shortly after the configuration is created and then at five minute intervals. Metrics queries run each time the automatic device configuration runs.

## CLI prerequisites

* An [IoT hub](../iot-hub/iot-hub-create-using-cli.md) in your Azure subscription. 
* [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) in your environment. At a minimum, your Azure CLI version must be 2.0.24 or above. Use `az –-version` to validate. This version supports az extension commands and introduces the Knack command framework. 
* The [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension).

## Implement device twins to configure devices

Automatic device configurations require the use of device twins to synchronize state between the cloud and devices.  Refer to [Understand and use device twins in IoT Hub](iot-hub-devguide-device-twins.md) for guidance on using device twins.

## Identify devices using tags

Before you create a configuration, you must specify which devices you want to affect. Azure IoT Hub identifies devices using tags in the device twin. Each device can have multiple tags, and you can define them any way that makes sense for your solution. For example, if you manage devices in different locations, add the following tags to a device twin:

```json
"tags": {
	"location": {
		"state": "Washington",
		"city": "Tacoma"
    }
},
```

## Define the target content and metrics

The target content and metric queries are specified as JSON documents that describe the device twin desired properties to set and reported properties to measure.  To create an automatic device configuration using Azure CLI, save the target content and metrics locally as .txt files. You use the file paths in a later section when you run the command to apply the configuration to your device.

Here's a basic target content sample:

```json
{
  "content": {
    "deviceContent": {
      "properties.desired.chillerWaterSettings": {
        "temperature": 38,
        "pressure": 78
      }
    }
}
```

Here are examples of metric queries:

```json
{
  "queries": {
    "Compliant": "select deviceId from devices where configurations.[[chillersettingswashington]].status = 'Applied' AND properties.reported.chillerWaterSettings.status='current'",
    "Error": "select deviceId from devices where configurations.[[chillersettingswashington]].status = 'Applied' AND properties.reported.chillerWaterSettings.status='error'",
    "Pending": "select deviceId from devices where configurations.[[chillersettingswashington]].status = 'Applied' AND properties.reported.chillerWaterSettings.status='pending'"
  }
}
```

## Create a configuration

You configure target devices by creating a configuration that consists of the target content and metrics. 

Use the following command to create a configuration:

```cli
   az iot hub configuration create --config-id [configuration id] \
     --labels [labels] --content [file path] --hub-name [hub name] \
     --target-condition [target query] --priority [int] \
     --metrics [metric queries]
```

* --**config-id** - The name of the configuration that will be created in the IoT hub. Give your configuration a unique name that is up to 128 lowercase letters. Avoid spaces and the following invalid characters: `& ^ [ ] { } \ | " < > /`.

* --**labels** - Add labels to help track your configuration. Labels are Name, Value pairs that describe your deployment. For example, `HostPlatform, Linux` or `Version, 3.0.1`

* --**content** - Inline JSON or file path to the target content to be set as twin desired properties. 

* --**hub-name** - Name of the IoT hub in which the configuration will be created. The hub must be in the current subscription. Switch to the desired subscription with the command `az account set -s [subscription name]`

* --**target-condition** - Enter a target condition to determine which devices will be targeted with this configuration. The condition is based on device twin tags or device twin desired properties and should match the expression format. For example, `tags.environment='test'` or `properties.desired.devicemodel='4000x'`. 

* --**priority** - A positive integer. In the event that two or more configurations are targeted at the same device, the configuration with the highest numerical value for Priority will apply.

* --**metrics** - Filepath to the metric queries. Metrics provide summary counts of the various states that a device may report back after applying configuration content. For example, you may create a metric for pending settings changes, a metric for errors, and a metric for successful settings changes. 

## Monitor a configuration

Use the following command to display the contents of a configuration:

```cli
az iot hub configuration show --config-id [configuration id] \
  --hub-name [hub name]
```

* --**config-id** - The name of the configuration that exists in the IoT hub.

* --**hub-name** - Name of the IoT hub in which the configuration exists. The hub must be in the current subscription. Switch to the desired subscription with the command `az account set -s [subscription name]`

Inspect the configuration in the command window. The **metrics** property lists a count for each metric that is evaluated by each hub:

* **targetedCount** - A system metric that specifies the number of device twins in IoT Hub that match the targeting condition.

* **appliedCount** - A system metric specifies the number of devices that have had the target content applied.

* **Your custom metric** - Any metrics you've defined are user metrics.

You can show a list of device IDs or objects for each of the metrics by using the following command:

```cli
az iot hub configuration show-metric --config-id [configuration id] \
   --metric-id [metric id] --hub-name [hub name] --metric-type [type] 
```

* --**config-id** - The name of the deployment that exists in the IoT hub.

* --**metric-id** - The name of the metric for which you want to see the list of device IDs, for example `appliedCount`.

* --**hub-name** - Name of the IoT hub in which the deployment exists. The hub must be in the current subscription. Switch to the desired subscription with the command `az account set -s [subscription name]`.

* --**metric-type** - Metric type can be `system` or `user`.  System metrics are `targetedCount` and `appliedCount`. All other metrics are user metrics.

## Modify a configuration

When you modify a configuration, the changes immediately replicate to all targeted devices. 

If you update the target condition, the following updates occur:

* If a device twin didn't meet the old target condition, but meets the new target condition and this configuration is the highest priority for that device twin, then this configuration is applied to the device twin. 

* If a device twin no longer meets the target condition, the settings from the configuration will be removed and the device twin will be modified by the next highest priority configuration. 

* If a device twin currently running this configuration no longer meets the target condition and doesn't meet the target condition of any other configurations, then the settings from the configuration will be removed and no other changes will be made on the twin. 

Use the following command to update a configuration:

```cli
az iot hub configuration update --config-id [configuration id] \
   --hub-name [hub name] --set [property1.property2='value']
```

* --**config-id** - The name of the configuration that exists in the IoT hub.

* --**hub-name** - Name of the IoT hub in which the configuration exists. The hub must be in the current subscription. Switch to the desired subscription with the command `az account set -s [subscription name]`.

* --**set** - Update a property in the configuration. You can update the following properties:

    * targetCondition - for example `targetCondition=tags.location.state='Oregon'`

    * labels 

    * priority

## Delete a configuration

When you delete a configuration, any device twins take on their next highest priority configuration. If device twins don't meet the target condition of any other configuration, then no other settings are applied. 

Use the following command to delete a configuration:

```cli
az iot hub configuration delete --config-id [configuration id] \
   --hub-name [hub name] 
```
* --**config-id** - The name of the configuration that exists in the IoT hub.

* --**hub-name** - Name of the IoT hub in which the configuration exists. The hub must be in the current subscription. Switch to the desired subscription with the command `az account set -s [subscription name]`.

## Next steps

In this article, you learned how to configure and monitor IoT devices at scale. Follow these links to learn more about managing Azure IoT Hub:

* [Manage your IoT Hub device identities in bulk](iot-hub-bulk-identity-mgmt.md)
* [IoT Hub metrics](iot-hub-metrics.md)
* [Operations monitoring](iot-hub-operations-monitoring.md)

To further explore the capabilities of IoT Hub, see:

* [IoT Hub developer guide](iot-hub-devguide.md)
* [Deploying AI to edge devices with Azure IoT Edge](../iot-edge/tutorial-simulate-device-linux.md)

To explore using the IoT Hub Device Provisioning Service to enable zero-touch, just-in-time provisioning, see: 

* [Azure IoT Hub Device Provisioning Service](/azure/iot-dps)
