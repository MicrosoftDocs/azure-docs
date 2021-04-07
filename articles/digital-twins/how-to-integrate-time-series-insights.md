---
# Mandatory fields.
title: Integrate with Azure Time Series Insights
titleSuffix: Azure Digital Twins
description: See how to set up event routes from Azure Digital Twins to Azure Time Series Insights.
author: alexkarcher-msft
ms.author: alkarche # Microsoft employees only
ms.date: 4/7/2021
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Integrate Azure Digital Twins with Azure Time Series Insights

In this article, you'll learn how to integrate Azure Digital Twins with [Azure Time Series Insights (TSI)](../time-series-insights/overview-what-is-tsi.md).

The solution described in this article will allow you to gather and analyze historical data about your IoT solution. Azure Digital Twins is a great fit for feeding data into Time Series Insights, as it allows you to correlate multiple data streams and standardize your information before sending it to Time Series Insights.

## Prerequisites

Before you can set up a relationship with Time Series Insights, you'll need to set up the following resources:
* An **IoT hub**. For instructions, see the *Create an IoT Hub* section of [this IoT Hub quickstart](../iot-hub/quickstart-send-telemetry-cli.md).
* An **Azure Digital Twins instance**.
For instructions, see [*How-to: Set up an Azure Digital Twins instance and authentication*](./how-to-set-up-instance-portal.md).
* A **model and a twin in the Azure Digital Twins instance**.
You'll need to update twin's information a few times to see that data tracked in Time Series Insights. For instructions, see [*Add a model and twin*](how-to-ingest-iot-hub-data.md#add-a-model-and-twin) section of the *How to: Ingest IoT hub* article.

**Optional prerequisite** 
* An **Azure function** to access Azure Digital Twins and update twins based on IoT telemetry events. For instructions, follow [*How to: Ingest IoT Hub data*](how-to-ingest-iot-hub-data.md). For best results, complete the whole article, including the final validation step to confirm that the data flow works.

## Solution architecture

You will be attaching Time Series Insights to Azure Digital Twins through the path below.

:::row:::
    :::column:::
        :::image type="content" source="media/how-to-integrate-time-series-insights/diagram-simple.png" alt-text="Diagram of Azure services in an end-to-end scenario, highlighting Time Series Insights." lightbox="media/how-to-integrate-time-series-insights/diagram-simple.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

## Create event hub namespace

Before creating the event hubs, you'll first create an event hub namespace that will receive events from your Azure Digital Twins instance. You can either use the Azure CLI instructions below, or use the Azure portal: [*Quickstart: Create an event hub using Azure portal*](../event-hubs/event-hubs-create.md). To see what regions support event hubs, visit [*Azure products available by region*](https://azure.microsoft.com/global-infrastructure/services/?products=event-hubs).

```azurecli-interactive
az eventhubs namespace create --name <name-your-event-hubs-namespace> --resource-group <your-resource-group> -l <region>
```

> [!TIP]
> If you get an error stating `BadRequest: The specified service namespace is invalid.`, make sure the name you've chosen for your namespace meets the naming requirements described in this reference document: [Create Namespace](/rest/api/servicebus/create-namespace).

You'll be using this event hubs namespace to hold the two event hubs that are needed for this article:

  1. **Twins hub** - Event hub to receive twin change events
  2. **Time series hub** - Event hub to stream events to Time Series Insights

The next sections will walk you through creating and configuring these hubs within your event hub namespace.

## Create twins hub

Create **twins hub** with the following CLI command. Specify a name for your twins hub.

```azurecli-interactive
az eventhubs eventhub create --name <name-your-twins-hub> --resource-group <your-resource-group> --namespace-name <your-event-hubs-namespace-from-above>
```

### Create twins hub authorization rule

Create an [authorization rule](/cli/azure/eventhubs/eventhub/authorization-rule#az-eventhubs-eventhub-authorization-rule-create) with send and receive permissions. Specify a name for the rule.

```azurecli-interactive
az eventhubs eventhub authorization-rule create --rights Listen Send --resource-group <your-resource-group> --namespace-name <your-event-hubs-namespace-from-earlier> --eventhub-name <name-of-your-twins-hub-from-above> --name <name-your-twins-hub-auth-rule>
```

### Create twins hub endpoint

Create an Azure Digital Twins [endpoint](concepts-route-events.md#create-an-endpoint) that links your event hub to your Azure Digital Twins instance. Specify a name for your twins hub endpoint.

```azurecli-interactive
az dt endpoint create eventhub -n <your-Azure-Digital-Twins-instance-name> --eventhub-resource-group <your-resource-group> --eventhub-namespace <your-event-hubs-namespace-from-earlier> --eventhub <name-of-your-twins-hub-from-above> --eventhub-policy <name-of-your-twins-hub-auth-rule-from-earlier> --endpoint-name <name-for-your-twins-hub-endpoint>
```

### Create twins hub event route

Azure Digital Twins instances can emit [twin update events](how-to-interpret-event-data.md) whenever a twin's state is updated. In this section, you'll create an Azure Digital Twins **event route** that will direct these update events to Azure [Event Hubs](../event-hubs/event-hubs-about.md) for further processing.

Create a [route](concepts-route-events.md#create-an-event-route) in Azure Digital Twins to send twin update events to your endpoint. The filter in this route will only allow twin update messages to be passed to your endpoint. Specify a name for the twins hub event route.

>[!NOTE]
>There is currently a **known issue** in Cloud Shell affecting these command groups: `az dt route`, `az dt model`, `az dt twin`.
>
>To resolve, either run `az login` in Cloud Shell prior to running the command, or use the [local CLI](/cli/azure/install-azure-cli) instead of Cloud Shell. For more detail on this, see [*Troubleshooting: Known issues in Azure Digital Twins*](troubleshoot-known-issues.md#400-client-error-bad-request-in-cloud-shell).

```azurecli-interactive
az dt route create -n <your-Azure-Digital-Twins-instance-name> --endpoint-name <name-of-your-twins-hub-endpoint-from-above> --route-name <name-your-twins-hub-event-route> --filter "type = 'Microsoft.DigitalTwins.Twin.Update'"
```

### Set connection string

1. Get the Twins [event hub connection string](../event-hubs/event-hubs-get-connection-string.md), using the authorization rules you created above for the twins hub.

    ```azurecli-interactive
    az eventhubs eventhub authorization-rule keys list --resource-group <your-resource-group> --namespace-name <your-event-hubs-namespace-from-earlier> --eventhub-name <name-of-your-twins-hub-from-above> --name <name-of-your-twins-hub-auth-rule-from-earlier>
    ```

2. Use the **primaryConnectionString** value from the result to create an app setting in your function app that contains your connection string:

    ```azurecli-interactive
    az functionapp config appsettings set --settings "EventHubAppSetting-Twins=<primaryConnectionString-value-from-above>" -g <your-resource-group> -n <your-App-Service-(function-app)-name>
    ```

## Create time series hub

To create a second event hub, you can either use the Azure CLI instructions below, or use the Azure portal: [*Quickstart: Create an event hub using Azure portal*](../event-hubs/event-hubs-create.md). You'll use your *event hubs namespace* and *resource group* name from earlier in this article. This event hub will stream events to the Time Series Insights.

Create the **time series hub** using the following command. Specify a name for the time series hub.

```azurecli-interactive
 az eventhubs eventhub create --name <name-your-time-series-hub> --resource-group <your-resource-group> --namespace-name <your-event-hub-namespace-from-earlier>
```

### Create time series hub authorization rule

Create an [authorization rule](/cli/azure/eventhubs/eventhub/authorization-rule#az-eventhubs-eventhub-authorization-rule-create) with send and receive permissions. Specify a name for the time series hub auth rule.

```azurecli-interactive
az eventhubs eventhub authorization-rule create --rights Listen Send --resource-group <your-resource-group> --namespace-name <your-event-hub-namespace-from-earlier> --eventhub-name <your-time-series-hub-name-from-above> --name <name-your-time-series-hub-auth-rule>
```

### Set connection string

You'll need to set environment variables in your function app from earlier, containing the connection strings for the event hub.

1. Get the [time series hub connection string](../event-hubs/event-hubs-get-connection-string.md), using the authorization rules you created above for the time series hub:

    ```azurecli-interactive
    az eventhubs eventhub authorization-rule keys list --resource-group <your-resource-group> --namespace-name <your-event-hub-namespace-from-earlier> --eventhub-name <your-time-series-hub-name-from-earlier> --name <your-time-series-hub-auth-rule-from-earlier>
    ```

2. Use the **primaryConnectionString** value from the result to create an app setting in your function app that contains your connection string:

    ```azurecli-interactive
    az functionapp config appsettings set --settings "EventHubAppSetting-TSI=<primaryConnectionString-from above>" -g <your-resource-group> -n <your-App-Service-(function-app)-name>
    ```

Make note of the following values as you'll use them later to create a Time Series Insights instance.
* Event hub namespace
* Time series hub name
* Time series hub auth rule

## Create a function

> [!Note]
> It is optional to create a function to visualize twin data in the Time Series Insights explorer.

In this section, you'll create an Azure function that will convert twin update events from their original form as JSON Patch documents to JSON objects, containing only updated and added values from your twins.

### Step 1: Add a new function

Inside your function app project created in the [prerequisites](#prerequisites) section, create a new Azure function called *ProcessDTUpdatetoTSI.cs* to update device telemetry events to the Time Series Insights. The function type will be **Event Hub trigger**.

:::image type="content" source="media/how-to-integrate-time-series-insights/create-event-hub-trigger-function.png" alt-text="Screenshot of Visual Studio to create a new Azure function of type event hub trigger.":::

### Step 2: Fill in function code

Add the following packages to your project:
* [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs/)
* [Microsoft.Azure.WebJobs.Extensions.EventHubs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs/)
* [Microsoft.NET.Sdk.Functions](https://www.nuget.org/packages/Microsoft.NET.Sdk.Functions/)

Replace the code in the *ProcessDTUpdatetoTSI.cs* file with the following code:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/updateTSI.cs":::

Save your function code.

### Step 3: Publish the function app to Azure

Next, **publish** the new Azure function. For instructions on how to do this, see [*How-to: Set up an Azure function for processing data*](how-to-create-azure-function.md#publish-the-function-app-to-azure).

[!INCLUDE [digital-twins-publish-and-configure-function-app.md](../../includes/digital-twins-publish-and-configure-function-app.md)]

## Create and connect a time series insights instance

Next, you will set up Time Series Insights instance to receive data from your time series hub. For more details about this process, see [*Tutorial: Set up an Azure Time Series Insights Gen2 PAYG environment*](../time-series-insights/tutorial-set-up-environment.md). Follow the steps below to create a time series insights.

1. In the [Azure portal](https://portal.azure.com), search for *Time Series Insights environments*, and select the **Add** button. Choose the following options to create the time series environment.

    * **Subscription** - Choose your subscription.
        - **Resource group** - Choose your resource group.
    * **Environment name** - Specify a name for your time series environment.
    * **Location** - Choose a location.
    * **Tier** - **Gen2(L1)** pricing tier.
    
    *Time series ID*

    * **Property name** - $dtId (Your time series ID can be up to three values that you will use to search for your data in Time Series Insights. For this tutorial, you can use **$dtId**. Read more about selecting an ID value in [*Best practices for choosing a Time Series ID*](../time-series-insights/how-to-select-tsid.md)).
    * **Storage account name** - Specify a storage account name.
    * **Enable Warm store** - Leave this field to *Yes*.

You can leave default values for other properties on this page. Select the **Next : Event Source >** button.

   :::image type="content" source="media/how-to-integrate-time-series-insights/create-time-series-insights-environment-1.png" alt-text="Screenshot of the Azure portal to create Time Series Insights environment. Select your subscription, resource group, and location from the respective dropdowns and choose a name for your environment." lightbox="media/how-to-integrate-time-series-insights/create-time-series-insights-environment-1.png":::
        
   :::image type="content" source="media/how-to-integrate-time-series-insights/create-time-series-insights-environment-2.png" alt-text="Screenshot of the Azure portal to create Time Series Insights environment. The Gen2(L1) pricing tier is selected and the time series ID property name is $dtId." lightbox="media/how-to-integrate-time-series-insights/create-time-series-insights-environment-2.png":::

2. In the *Event Source* tab, choose the following fields:

   * **Create an event source?** - Choose *Yes*.
   * **Source type** - Choose *Event Hub* 
   * **Name** - Specify a name for your event source.
   * **Subscription** - Choose your Azure subscription
   * **Event Hub namespace** - Choose the namespace that you created earlier in this article.
   * **Event Hub name** - Choose the *time series hub* name that you created earlier in this article.
   * **Event Hub access policy name** - Choose the *time series hub auth rule* that you created earlier in this article.
   * **Event Hub consumer group** - Select *New* and specify a name for your event hub consumer group. Then, select *Add*.
   * **Property name** - You can leave this field blank.
    
Choose the **Review + Create** button to review all the details. Then, select the **Review + Create** button again to create the time series environment.

:::image type="content" source="media/how-to-integrate-time-series-insights/create-tsi-environment-event-source.png" alt-text="Screenshot of the Azure portal to create Time Series Insights environment. You are creating an event source with the event hub information from above. You are also creating a new consumer group." lightbox="media/how-to-integrate-time-series-insights/create-tsi-environment-event-source.png":::

## Send IoT data to Azure Digital Twins

To begin sending data to Time Series Insights, you'll need to start updating the digital twin properties in Azure Digital Twins with changing data values. You can choose to do this in either of the following ways:

  * Use the following CLI command to update the twin property. If you followed [*How-to: Ingest IoT Hub data*](how-to-ingest-iot-hub-data.md#add-a-model-and-twin) article to create a model and twin, the twin_id value will be *thermostat67*. Repeat the command with different temperature values to observe changes reflected in the Time Series Insights environment.

    ```azurecli-interactive
    az dt twin update -n <your-azure-digital-twins-instance-name> --twin-id {twin_id} --json-patch '{"op":"replace", "path":"/Temperature", "value": 20.5}'
    ```

> [!Note]
> If you want to update your values using a device simulator, you can download the [*Azure Digital Twins end-to-end samples*](/samples/azure-samples/digital-twins-samples/digital-twins-samples), and run the *DeviceSimulator* project to update the temperature values for the twins in the Azure Digital Twins instance. The instructions are in the [*Configure and run the simulation*](tutorial-end-to-end.md#configure-and-run-the-simulation) section of the *How to: Connect an end-to-end solution* tutorial.

## Visualize your data in Time Series Insights

Now, data should be flowing into your Time Series Insights instance, ready to be analyzed. Follow the steps below to explore the data coming in.

1. In the [Azure portal](https://portal.azure.com), search for your time series environment name that you created earlier. In the menu options on the left, select *Overview* to see the *Time Series Insights Explorer URL*. Select the URL to view the temperature changes reflected in the Time Series Insights environment.
    
    :::image type="content" source="media/how-to-integrate-time-series-insights/view-environment.png" alt-text="Screenshot of the Azure portal to select the Time Series Insights explorer URL in the overview tab of your Time Series Insights environment." lightbox="media/how-to-integrate-time-series-insights/view-environment.png":::

2. In the explorer, you will see the twins in the Azure Digital Twins instance shown on the left. Select a twin, choose the property *Temperature*, and hit **Add**. Note that the instance has multiple twins in the below screenshot.

    :::image type="content" source="media/how-to-integrate-time-series-insights/add-data.png" alt-text="Screenshot of the Time Series Insights explorer to select thermostat67, select the property temperature, and hit add." lightbox="media/how-to-integrate-time-series-insights/add-data.png":::

3. You should now see the initial temperature readings from your thermostat, as shown below. 

    :::image type="content" source="media/how-to-integrate-time-series-insights/initial-data.png" alt-text="Screenshot of the TSI explorer to view the initial temperature data. It is a line of random values between 68 and 85" lightbox="media/how-to-integrate-time-series-insights/initial-data.png":::

4. If you allow the simulation to run for much longer, your visualization will look something like this:
    
    :::image type="content" source="media/how-to-integrate-time-series-insights/day-data.png" alt-text="Screenshot of the TSI explorer where temperature data for each twin is graphed in three parallel lines of different colors." lightbox="media/how-to-integrate-time-series-insights/day-data.png":::

## Next steps

The digital twins are stored by default as a flat hierarchy in Time Series Insights, but they can be enriched with model information and a multi-level hierarchy for organization. To learn more about this process, read: 

* [*Tutorial: Define and apply a model*](../time-series-insights/tutorial-set-up-environment.md#define-and-apply-a-model) 

You can write custom logic to automatically provide this information using the model and graph data already stored in Azure Digital Twins. To read more about managing, upgrading, and retrieving information from the twins graph, see the following references:

* [*How-to: Manage a digital twin*](./how-to-manage-twin.md)
* [*How-to: Query the twin graph*](./how-to-query-graph.md)