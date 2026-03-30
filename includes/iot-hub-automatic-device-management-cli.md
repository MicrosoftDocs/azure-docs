---
title: Automatic device management at scale (CLI)
titleSuffix: Azure IoT Hub
description: Use Azure IoT Hub automatic configurations to manage multiple IoT devices or modules
author: SoniaLopezBravo
ms.author: sonialopez
ms.service: azure-iot-hub
ms.topic: include
ms.date: 08/13/2025
ms.custom: devx-track-azurecli
---

## Prerequisites

* An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

* An IoT hub in your Azure subscription. If you don't have a hub yet, you can follow the steps in the **Create an IoT hub** section of [Create and manage Azure IoT hubs](../articles/iot-hub/create-hub.md).

* [Azure CLI](/cli/azure/install-azure-cli) in your environment. At a minimum, your Azure CLI version must be 2.0.70 or later. Use `az –-version` to validate. This version supports az extension commands and introduces the Knack command framework. 

* The [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension).

[!INCLUDE [iot-hub-cli-version-info](iot-hub-cli-version-info.md)]

## Implement twins

Automatic device configurations require the use of device twins to synchronize state between the cloud and devices. For more information, see [Understand and use device twins in IoT Hub](../articles/iot-hub/iot-hub-devguide-device-twins.md).

Automatic module configurations require the use of module twins to synchronize state between the cloud and modules. For more information, see [Understand and use module twins in IoT Hub](../articles/iot-hub/iot-hub-devguide-module-twins.md).

## Use tags to target twins

Before you create a configuration, you must specify which devices or modules you want to affect. Azure IoT Hub identifies devices and using tags in the device twin, and identifies modules using tags in the module twin. Each device or module can have multiple tags, and you can define them any way that makes sense for your solution. For example, if you manage devices in different locations, add the following tags to a device twin:

```json
"tags": {
	"location": {
		"state": "Washington",
		"city": "Tacoma"
    }
},
```

## Define the target content and metrics

The target content and metric queries are specified as JSON documents that describe the device twin or module twin desired properties to set and reported properties to measure. To create an automatic configuration using Azure CLI, save the target content and metrics locally as .txt files. You use the file paths in a later section when you run the command to apply the configuration to your device.

Here's a basic target content sample for an automatic device configuration:

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
}
```

Automatic module configurations behave similarly, but you target `moduleContent` instead of `deviceContent`.

```json
{
  "content": {
    "moduleContent": {
      "properties.desired.chillerWaterSettings": {
        "temperature": 38,
        "pressure": 78
      }
    }
  }
}
```

Here are examples of metric queries:

```json
{
  "queries": {
    "Compliant": "select deviceId from devices where configurations.[[chillerdevicesettingswashington]].status = 'Applied' AND properties.reported.chillerWaterSettings.status='current'",
    "Error": "select deviceId from devices where configurations.[[chillerdevicesettingswashington]].status = 'Applied' AND properties.reported.chillerWaterSettings.status='error'",
    "Pending": "select deviceId from devices where configurations.[[chillerdevicesettingswashington]].status = 'Applied' AND properties.reported.chillerWaterSettings.status='pending'"
  }
}
```

Metric queries for modules are also similar to queries for devices, but you select for `moduleId` from `devices.modules`. For example: 

```json
{
  "queries": {
    "Compliant": "select deviceId, moduleId from devices.module where configurations.[[chillermodulesettingswashington]].status = 'Applied' AND properties.reported.chillerWaterSettings.status='current'"
  }
}
```

## Create a configuration

You can create a maximum of 100 automatic configurations on standard tier IoT hubs; 10 on free tier IoT hubs. To learn more, see [IoT Hub quotas and throttling](../articles/iot-hub/iot-hub-devguide-quotas-throttling.md).

You configure target devices by creating a configuration that consists of the target content and metrics. Use the following command to create a configuration:

```azurecli
   az iot hub configuration create --config-id [configuration id] \
     --labels [labels] --content [file path] --hub-name [hub name] \
     --target-condition [target query] --priority [int] \
     --metrics [metric queries]
```

* --**config-id** - The name of the configuration created in the IoT hub. Give your configuration a unique name that is up to 128 characters long. Lowercase letters and the following special characters are allowed: `-+%_*!'`. Spaces aren't allowed.

* --**labels** - Add labels to help track your configuration. Labels are Name, Value pairs that describe your deployment. For example, `HostPlatform, Linux` or `Version, 3.0.1`

* --**content** - Inline JSON or file path to the target content to be set as twin desired properties. 

* --**hub-name** - Name of the IoT hub in which the configuration is created. The hub must be in the current subscription. Switch to the desired subscription with the command `az account set -s [subscription name]`

* --**target-condition** - Enter a target condition to determine which devices or modules are targeted with this configuration. For automatic device configuration, the condition is based on device twin tags or device twin desired properties and should match the expression format. For example, `tags.environment='test'` or `properties.desired.devicemodel='4000x'`. For automatic module configuration, the condition is based on module twin tags or module twin desired properties. For example, `from devices.modules where tags.environment='test'` or `from devices.modules where properties.reported.chillerProperties.model='4000x'`.

* --**priority** - A positive integer. If two or more configurations are targeted at the same device or module, the configuration with the highest numerical value for Priority applies.

* --**metrics** - Filepath to the metric queries. Metrics provide summary counts of the various states that a device or module can report back after applying configuration content. For example, you can create a metric for pending settings changes, a metric for errors, and a metric for successful settings changes. 

## Monitor a configuration

Use the following command to display the contents of a configuration:

```azurecli
az iot hub configuration show --config-id [configuration id] \
  --hub-name [hub name]
```

* --**config-id** - The name of the configuration that exists in the IoT hub.

* --**hub-name** - Name of the IoT hub in which the configuration exists. The hub must be in the current subscription. Switch to the desired subscription with the command `az account set -s [subscription name]`.

Inspect the configuration in the command window. The **metrics** property lists a count for each metric that is evaluated by each hub:

* **targetedCount** - A system metric that specifies the number of device twins or module twins in IoT Hub that match the targeting condition.

* **appliedCount** - A system metric specifies the number of devices or modules that have the target content applied.

* **Your custom metric** - Any metrics you defined are user metrics.

You can show a list of device IDs, module IDs, or objects for each of the metrics by using the following command:

```azurecli
az iot hub configuration show-metric --config-id [configuration id] \
   --metric-id [metric id] --hub-name [hub name] --metric-type [type] 
```

* --**config-id** - The name of the deployment that exists in the IoT hub.

* --**metric-id** - The name of the metric for which you want to see the list of device IDs or module IDs, for example `appliedCount`.

* --**hub-name** - Name of the IoT hub in which the deployment exists. The hub must be in the current subscription. Switch to the desired subscription with the command `az account set -s [subscription name]`.

* --**metric-type** - Metric type can be `system` or `user`. System metrics are `targetedCount` and `appliedCount`. All other metrics are user metrics.

## Modify a configuration

When you modify a configuration, the changes immediately replicate to all targeted devices. 

If you update the target condition, the following updates occur:

* If a twin didn't meet the old target condition, but meets the new target condition and this configuration is the highest priority for that twin, then this configuration is applied. 

* If a twin currently running this configuration no longer meets the target condition, the settings from the configuration are removed and the twin is modified by the next highest priority configuration. 

* If a twin currently running this configuration no longer meets the target condition and doesn't meet the target condition of any other configurations, then the settings from the configuration are removed and no other changes are made on the twin. 

Use the following command to update a configuration:

```azurecli
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

When you delete a configuration, any device twins or module twins take on their next highest priority configuration. If twins don't meet the target condition of any other configuration, then no other settings are applied. 

Use the following command to delete a configuration:

```azurecli
az iot hub configuration delete --config-id [configuration id] \
   --hub-name [hub name] 
```

* --**config-id** - The name of the configuration that exists in the IoT hub.

* --**hub-name** - Name of the IoT hub in which the configuration exists. The hub must be in the current subscription. Switch to the desired subscription with the command `az account set -s [subscription name]`.

