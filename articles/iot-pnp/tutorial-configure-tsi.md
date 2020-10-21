---
title: Use Time Series Insights to store and analyze your IoT Plug and Play device telemetry  | Microsoft Docs
description: Set up a Time Series Insights environment and connect your IoT Hub to view and analyze telemetry from your IoT Plug and Play devices.
author: lyrana
ms.author: lyhughes
ms.date: 10/14/2020
ms.topic: tutorial
ms.service: iot-pnp
services: iot-pnp

# As a IoT solution builder, I want to see historize and analyze data from my IoT Plug and Play certified device by setting up and routing to Time Series Insights.
---

# Tutorial: Create and Connect to Time Series Insights Gen2 to store, visualize, and analyze IoT Plug and Play device telemetry

In this tutorial, you'll learn how to create and correclty configure an [Azure Time Series Insights Gen2](https://docs.microsoft.com/azure/time-series-insights/overview-what-is-tsi) (TSI) environment to integrate with your IoT Plug and Play solution. With TSI, you can collect, process, store, query and visualize time series data at Internet of Things (IoT) scale.

First you'll provision a TSI environment and connect your IoT Hub as a streaming event source. Then you'll work through model synchronization to author your TSI environment's Time Series Model based off of the [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl) sample model files you used for the temperature controller and thermostat devices.

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](../../includes/iot-pnp-prerequisites.md)]

To avoid the requirement to install the Azure CLI locally, you can use the Azure Cloud Shell to set up the cloud services.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

### Time Series ID selection

While provisioning your TSI environment, you'll be required to select a Time Series ID. Selecting the appropriate Time Series ID is critical, as the property is immutable and cannot be changed after it's set. Choosing a Time Series ID is like choosing a partition key for a database. Typically, your TS ID should be the leaf node of your asset model. In other words, you typically want to select the ID property of the most granular asset or sensor that is emitting telemtry.

As an IoT Plug and Play user, the pertinent question for selecting your TS ID is the prevalence of [components](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#component) your device models. 

![TS ID selection](./media/tutorial-configure-tsi/ts-id-selection-pnp.png)


Refer back to your [TemperatureController.json](https://raw.githubusercontent.com/Azure/opendigitaltwins-dtdl/master/DTDL/v2/samples/TemperatureController.json) file. There are two thermostats sending time series data, thus you'll want to use a composite key consiting of `iot-hub-connection-device-id` and `dt-subject` in the section below.

## Provision your Azure Time Series Insights Gen2 environment

The command below will do the following:

* Create an Azure storage account that will be your environment's [cold store](https://docs.microsoft.com/en-us/azure/time-series-insights/concepts-storage#cold-store), designed for long-term retention and analytics over historical data. Replace `mytsicoldstore` with a unique name for your account.
* Create an Azure Time Series Insights Gen2 environment. Replace `my-tsi-env` with a name of your choosing

Replace `my-pnp-resourcegroup` with the name of the resource group you used during set-up, and replace `my-ts-id-property` with your TS ID property value based on the selection criteria above.

```azurecli-interactive
storage=mytsicoldstore
rg=my-pnp-resourcegroup
az storage account create -g $rg -n $storage --https-only
key=$(az storage account keys list -g $rg -n $storage --query [0].value --output tsv)
az timeseriesinsights environment longterm create --name my-tsi-env --resource-group $rg --time-series-id-properties my-ts-id-property --sku-name L1 --data-retention 7 --storage-account-name $storage --storage-management-key $key
```

Now you'll configure the IoT Hub you created previously as your environment's [event source](https://docs.microsoft.com/azure/time-series-insights/concepts-streaming-ingestion-event-sources). When the event source is created, TSI will begin ingesting and storing any data currently stored in your hub, beginning with the earliest event. 

First create a unique consumer group for TSI environment. Replace `my-pnp-hub` with the name of the IoT Hub you used previously.

```azurecli-interactive
az iot hub consumer-group create --my-pnp-hub --name tsi-consumer-group 
```

Connect the IoT Hub. Replace `my-pnp-resourcegroup`, `my-pnp-hub`, and `my-tsi-env` with your respective values.

```azurecli-interactive
rg=my-pnp-resourcegroup
iothub=my-pnp-hub
env=my-tsi-env
es_resource_id=$(az iot hub create -g $rg -n $iothub --query id --output tsv)
shared_access_key=$(az iot hub policy list -g $rg --hub-name $iothub --query "[?keyName=='service'].primaryKey" --output tsv)
az timeseriesinsights event-source iothub create -g $rg --environment-name $env -n iot-hub-event-source --consumer-group-name tsi-consumer-group  --key-name iothubowner --shared-access-key $shared_access_key --event-source-resource-id $es_resource_id
```
Navigate to your resource group in the Azure portal and select your newly created TSI environment. In the metrics  