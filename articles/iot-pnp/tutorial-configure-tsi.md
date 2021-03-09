---
title: Tutorial - Use Azure Time Series Insights to store and analyze your Azure IoT Plug and Play device telemetry  
description: Tutorial - Set up a Time Series Insights environment and connect your IoT hub to view and analyze telemetry from your IoT Plug and Play devices.
author: lyrana
ms.author: lyhughes
ms.date: 10/14/2020
ms.topic: tutorial
ms.service: iot-pnp
services: iot-pnp

# As an IoT solution builder, I want to historize and analyze data from my IoT Plug and Play devices by routing to Time Series Insights.
---

# Tutorial: Create and configure a Time Series Insights Gen2 environment

In this tutorial, you learn how to create and configure an [Azure Time Series Insights Gen2](../time-series-insights/overview-what-is-tsi.md) environment to integrate with your IoT Plug and Play solution. Use Time Series Insights to collect, process, store, query, and visualize time series data at the scale of Internet of Things (IoT).

In this tutorial, you

> [!div class="checklist"]
> * Provision a Time Series Insights environment and connect your IoT hub as a streaming event source.
> * Work through model synchronization to author your [Time Series Model](../time-series-insights/concepts-model-overview.md).
> * Use the [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl) sample model files that you used for the temperature controller and thermostat devices.

> [!NOTE]
> This integration between Time Series Insights and IoT Plug and Play is in preview. The way that DTDL device models map to the Time Series Insights Time Series Model might change. 

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](../../includes/iot-pnp-prerequisites.md)]

At this point, you have:

* An Azure IoT hub.
* A Device Provisioning Service (DPS) instance linked to your IoT hub. The DPS instance should have an individual device enrollment for your IoT Plug and Play device.
* A connection to your IoT hub from either a single-component device or a multiple-component device that streams simulated data.

To avoid the requirement to install the Azure CLI locally, you can use Azure Cloud Shell to set up the cloud services.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prepare your event source

The IoT hub you created previously will be your Time Series Insights environment's [event source](../time-series-insights/concepts-streaming-ingestion-event-sources.md).

> [!IMPORTANT]
> Disable any existing IoT Hub routes. There's a known issue with using an IoT hub with [routing](../iot-hub/iot-hub-devguide-messages-d2c.md#routing-endpoints) configured. Temporarily disable any routing endpoints. When your IoT hub is connected to Time Series Insights, you can enable routing endpoints again.

On your IoT hub, create a unique consumer group for Time Series Insights to consume. In the following example, replace `my-pnp-hub` with the name of the IoT hub you used previously.

```azurecli-interactive
az iot hub consumer-group create --hub-name my-pnp-hub --name tsi-consumer-group
```

## Choose a Time Series ID

When you provision your Time Series Insights environment, you need to select a *Time Series ID*. It's important to select the appropriate Time Series ID. This property is immutable and can't be changed after it's set. A Time Series ID is like a database partition key. The Time Series ID acts as the primary key for your Time Series Model. For more information, see [Best practices for choosing a Time Series ID](../time-series-insights/how-to-select-tsid.md).

As an IoT Plug and Play user, for your Time Series ID, specify a _composite key_ that consists of `iothub-connection-device-id` and `dt-subject`. The IoT hub adds these system properties that contain your IoT Plug and Play device ID and your device component names, respectively.

Even if your IoT Plug and Play device models don't currently use components, you should include `dt-subject` as part of a composite key so that you can use components in the future. Because your Time Series ID is immutable, Microsoft recommends enabling this option in case you need it in the future.

> [!NOTE]
> The examples in this article are for the multiple-component `TemperatureController` device. But the concepts are the same for the no-component `Thermostat` device.

## Provision your Time Series Insights environment

This section describes how to provision your Azure Time Series Insights Gen2 environment.

Run the following command to:

* Create an Azure storage account for your environment's [cold store](../time-series-insights/concepts-storage.md#cold-store). This account is designed for long-term retention and analytics for historical data.
  * In your code, replace `mytsicoldstore` with a unique name for your cold storage account.
* Create an Azure Time Series Insights Gen2 environment. The environment will be created with warm storage that has a retention period of seven days. The cold storage account will be attached for infinite retention.
  * In your code, replace `my-tsi-env` with a unique name for your Time Series Insights environment.
  * In your code, replace `my-pnp-resourcegroup` with the name of the resource group you used during setup.
  * Your Time Series ID property is `iothub-connection-device-id, dt-subject`.

```azurecli-interactive
storage=mytsicoldstore
rg=my-pnp-resourcegroup
az storage account create -g $rg -n $storage --https-only
key=$(az storage account keys list -g $rg -n $storage --query [0].value --output tsv)
az tsi environment gen2 create --name "my-tsi-env" --location eastus2 --resource-group $rg --sku name="L1" capacity=1 --time-series-id-properties name=iothub-connection-device-id type=String --time-series-id-properties name=dt-subject type=String --warm-store-configuration data-retention=P7D --storage-configuration account-name=$storage management-key=$key
```

Connect your IoT Hub event source. Replace `my-pnp-resourcegroup`, `my-pnp-hub`, and `my-tsi-env` with the values you chose. The following command references the consumer group for Time Series Insights that you created previously:

```azurecli-interactive
rg=my-pnp-resourcegroup
iothub=my-pnp-hub
env=my-tsi-env
es_resource_id=$(az iot hub create -g $rg -n $iothub --query id --output tsv)
shared_access_key=$(az iot hub policy list -g $rg --hub-name $iothub --query "[?keyName=='service'].primaryKey" --output tsv)
az tsi event-source iothub create --event-source-name iot-hub-event-source --environment-name $env --resource-group $rg --location eastus2 --consumer-group-name tsi-consumer-group --key-name iothubowner --shared-access-key $shared_access_key --event-source-resource-id $es_resource_id --iot-hub-name $iothub
```

In the [Azure portal](https://portal.azure.com), go to your resource group, and then select your new Time Series Insights environment. Go to the **Time Series Insights Explorer URL** shown in the instance overview:

![Screenshot of the portal overview page.](./media/tutorial-configure-tsi/view-environment.png)

In the Explorer, you see three instances:

* &lt;your pnp device ID&gt;, thermostat1
* &lt;your pnp device ID&gt;, thermostat2
* &lt;your pnp device ID&gt;, `null`

> [!NOTE]
> The third tag represents telemetry from the `TemperatureController` itself, such as the working set of device memory. Because this is a top-level property, the value for the component name is null. In a later step, you make this name more user-friendly.

![Screenshot showing three instances in the Explorer.](./media/tutorial-configure-tsi/tsi-env-first-view.png)

## Configure model translation

Next, you translate your DTDL device model to the asset model in Azure Time Series Insights. In Time Series Insights, the Time Series Model is a semantic modeling tool for data contextualization. The model has three core components:

* [Time Series Model instances](../time-series-insights/concepts-model-overview.md#time-series-model-instances) are virtual representations of the time series themselves. Instances are uniquely identified by your Time Series ID.
* [Time Series Model hierarchies](../time-series-insights/concepts-model-overview.md#time-series-model-hierarchies) organize instances by specifying property names and their relationships.
* [Time Series Model types](../time-series-insights/concepts-model-overview.md#time-series-model-types) help you define [variables](../time-series-insights/concepts-variables.md) or formulas for computations. Types are associated with a specific instance.

### Define your types

You can begin ingesting data into Azure Time Series Insights Gen2 without having predefined a model. When telemetry arrives, Time Series Insights attempts to automatically resolve time series instances based on your Time Series ID property values. All instances are assigned the *default type*. You need to manually create a new type to correctly categorize your instances. 

The following details outline the simplest method to synchronize your device DTDL models with your Time Series Model types:

* Your digital twin model identifier becomes your type ID.
* The type name can be either the model name or the display name.
* The model description becomes the type's description.
* At least one type variable is created for each telemetry that has a numeric schema.
  * Only numeric data types can be used for variables, but if a value is sent as another type that can be converted, `"0"` for example, you can use a [conversion](/rest/api/time-series-insights/reference-time-series-expression-syntax#conversion-functions) function such as `toDouble`.
* The variable name can be either the telemetry name or the display name.
* When you define the Time Series Expression variable, refer to the telemetry's name on the wire and to the telemetry's data type.

| DTDL JSON | Time Series Model type JSON | Example value |
|-----------|------------------|-------------|
| `@id` | `id` | `dtmi:com:example:TemperatureController;1` |
| `displayName`    | `name`   |   `Temperature Controller`  |
| `description`  |  `description`  |  `Device with two thermostats and remote reboot.` |  
|`contents` (array)| `variables` (object)  | See the following example.

![Screenshot showing D T D L to Time Series Model type.](./media/tutorial-configure-tsi/DTDL-to-TSM-Type.png)

> [!NOTE]
> This example shows three variables, but each type can have up to 100 variables. Different variables can reference the same telemetry value to do different calculations as needed. For the full list of filters, aggregates, and scalar functions, see [Time Series Insights Gen2 Time Series Expression syntax](/rest/api/time-series-insights/reference-time-series-expression-syntax).

Open a text editor and save the following JSON to your local drive.

```JSON
{
  "put": [
    {
      "id": "dtmi:com:example:TemperatureController;1",
      "name": "Temperature Controller",
      "description": "Device with two thermostats and remote reboot.",
      "variables": {
        "workingSet": {
          "kind": "numeric",
          "value": {
            "tsx": "coalesce($event.workingSet.Long, toLong($event.workingSet.Double))"
          }, 
          "aggregation": {
            "tsx": "avg($value)"
          }
        },
        "temperature": {
          "kind": "numeric",
          "value": {
            "tsx": "coalesce($event.temperature.Long, toLong($event.temperature.Double))"
          },
          "aggregation": {
            "tsx": "avg($value)"
          }
        },
        "eventCount": {
          "kind": "aggregate",
          "aggregation": {
            "tsx": "count()"
          }
        }
      }
    }
  ]
}
```

In the Time Series Insights Explorer, select the model icon on the left to open the **Model** tab. Select **Types** and then select **Upload JSON**:

![Screenshot showing how to upload JSON.](./media/tutorial-configure-tsi/upload-type.png)

Select **Choose file**, select the JSON you saved previously, and then select **Upload**.

You see the newly defined **Temperature Controller** type.

### Create a hierarchy

Create a hierarchy to organize the tags under their `TemperatureController` parent. The following simple example has a single level, but IoT solutions commonly have many levels of nesting to contextualize tags within their physical and semantic position within an organization.

Select **Hierarchies** and then select **Add hierarchy**. For the name, enter *Device Fleet*. Create one level called *Device Name*. Then select **Save**.

![Screenshot showing how to add a hierarchy.](./media/tutorial-configure-tsi/add-hierarchy.png)

### Assign your instances to the correct type

Next you change the type of your instances and place them in the hierarchy.

Select the **Instances** tab. Find the instance that represents the device's working set, and then select the **Edit** icon on the far right.

![Screenshot showing how to edit an instance.](./media/tutorial-configure-tsi/edit-instance.png)

Open the **Type** drop-down menu and then select **Temperature Controller**. Enter *defaultComponent, <your device name>* to update the name of the instance that represents all top-level tags associated with your device.

![Screenshot showing how to change an instance type.](./media/tutorial-configure-tsi/change-type.png)

Before you select **Save**, first select the **Instance Fields** tab, and then select **Device Fleet**. To group the telemetry together, enter *\<your device name> - Temp Controller*. Then select **Save**.

![Screenshot showing how to assign an instance to a hierarchy](./media/tutorial-configure-tsi/assign-to-hierarchy.png)

Repeat the previous steps to assign your thermostat tags the correct type and hierarchy.

## View your data

Go back to the charting pane and expand **Device Fleet** > your device. Select **thermostat1**, select the **Temperature** variable, and then select **Add** to chart the value. Do the same for **thermostat2** and the **defaultComponent** **workingSet** value.

![Screenshot showing how to change the instance type for thermostat2.](./media/tutorial-configure-tsi/charting-values.png)

## Clean up resources

[!INCLUDE [iot-pnp-clean-resources](../../includes/iot-pnp-clean-resources.md)]

## Next steps

> [!div class="nextstepaction"]
> To learn more about the various charting options, including interval sizing and y-axis controls, see [Azure Time Series Insights Explorer](../time-series-insights/concepts-ux-panels.md).
