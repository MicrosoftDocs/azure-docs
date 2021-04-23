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
* An **IoT hub**. For instructions, see the [*Create an IoT Hub*](../iot-hub/quickstart-send-telemetry-cli.md#create-an-iot-hub) section of the *IoT Hub's Send Telemetry* quickstart.
* An **Azure Digital Twins instance**.
For instructions, see [*How-to: Set up an Azure Digital Twins instance and authentication*](./how-to-set-up-instance-portal.md).
* A **model and a twin in the Azure Digital Twins instance**.
You'll need to update twin's information a few times to see that data tracked in Time Series Insights. For instructions, see the [*Add a model and twin*](how-to-ingest-iot-hub-data.md#add-a-model-and-twin) section of the *How to: Ingest IoT hub* article.

> [!TIP]
> In this article, the changing digital twin values that are viewed in Time Series Insights are updated manually for simplicity. However, if you'd like to complete this article with live simulated data, you can set up an Azure function that updates digital twins based on IoT telemetry events from a simulated device. For instructions, follow [*How to: Ingest IoT Hub data*](how-to-ingest-iot-hub-data.md), including the final steps to run the device simulator and validate that the data flow works.
>
> Later, look for another TIP to show you where to start running the device simulator and have your Azure functions update the twins automatically, instead of sending manual digital twin update commands.


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
az eventhubs namespace create --name <name-for-your-event-hubs-namespace> --resource-group <your-resource-group> -l <region>
```

> [!TIP]
> If you get an error stating `BadRequest: The specified service namespace is invalid.`, make sure the name you've chosen for your namespace meets the naming requirements described in this reference document: [Create Namespace](/rest/api/servicebus/create-namespace).

You'll be using this event hubs namespace to hold the two event hubs that are needed for this article:

  1. **Twins hub** - Event hub to receive twin change events
  2. **Time series hub** - Event hub to stream events to Time Series Insights

The next sections will walk you through creating and configuring these hubs within your event hub namespace.

## Create twins hub

The first event hub you'll create in this article is the **twins hub**. This event hub will receive twin change events from Azure Digital Twins.
To set up the twins hub, you'll complete the following steps in this section:

1. Create the twins hub
2. Create an authorization rule to control permissions to the hub
3. Create an endpoint in Azure Digital Twins that uses the authorization rule to access the hub
4. Create a route in Azure Digital Twins that sends twin updates event to the endpoint and connected twins hub
5. Get the twins hub connection string

Create the **twins hub** with the following CLI command. Specify a name for your twins hub.

```azurecli-interactive
az eventhubs eventhub create --name <name-for-your-twins-hub> --resource-group <your-resource-group> --namespace-name <your-event-hubs-namespace-from-above>
```

### Create twins hub authorization rule

Create an [authorization rule](/cli/azure/eventhubs/eventhub/authorization-rule#az_eventhubs_eventhub_authorization_rule_create) with send and receive permissions. Specify a name for the rule.

```azurecli-interactive
az eventhubs eventhub authorization-rule create --rights Listen Send --name <name-for-your-twins-hub-auth-rule> --resource-group <your-resource-group> --namespace-name <your-event-hubs-namespace-from-earlier> --eventhub-name <your-twins-hub-from-above>
```

### Create twins hub endpoint

Create an Azure Digital Twins [endpoint](concepts-route-events.md#create-an-endpoint) that links your event hub to your Azure Digital Twins instance. Specify a name for your twins hub endpoint.

```azurecli-interactive
az dt endpoint create eventhub -n <your-Azure-Digital-Twins-instance-name> --eventhub-resource-group <your-resource-group> --eventhub-namespace <your-event-hubs-namespace-from-earlier> --eventhub <your-twins-hub-name-from-above> --eventhub-policy <your-twins-hub-auth-rule-from-earlier> --endpoint-name <name-for-your-twins-hub-endpoint>
```

### Create twins hub event route

Azure Digital Twins instances can emit [twin update events](how-to-interpret-event-data.md) whenever a twin's state is updated. In this section, you'll create an Azure Digital Twins **event route** that will direct these update events to the twins hub for further processing.

Create a [route](concepts-route-events.md#create-an-event-route) in Azure Digital Twins to send twin update events to your endpoint from above. The filter in this route will only allow twin update messages to be passed to your endpoint. Specify a name for the twins hub event route.

```azurecli-interactive
az dt route create -n <your-Azure-Digital-Twins-instance-name> --endpoint-name <your-twins-hub-endpoint-from-above> --route-name <name-for-your-twins-hub-event-route> --filter "type = 'Microsoft.DigitalTwins.Twin.Update'"
```

### Get twins hub connection string

Get the [twins event hub connection string](../event-hubs/event-hubs-get-connection-string.md), using the authorization rules you created above for the twins hub.

```azurecli-interactive
az eventhubs eventhub authorization-rule keys list --resource-group <your-resource-group> --namespace-name <your-event-hubs-namespace-from-earlier> --eventhub-name <your-twins-hub-from-above> --name <your-twins-hub-auth-rule-from-earlier>
```
Take note of the **primaryConnectionString** value from the result to configure the twins hub app setting later in this article.

## Create time series hub

The second event hub you'll create in this article is the **time series hub**. This is an event hub that will stream the Azure Digital Twins events to Time Series Insights.
To set up the time series hub, you'll complete these steps:

1. Create the time series hub
2. Create an authorization rule to control permissions to the hub
3. Get the time series hub connection string

Later, when you create the Time Series Insights instance, you'll connect this time series hub as the event source for the Time Series Insights instance.

Create the **time series hub** using the following command. Specify a name for the time series hub.

```azurecli-interactive
 az eventhubs eventhub create --name <name-for-your-time-series-hub> --resource-group <your-resource-group> --namespace-name <your-event-hub-namespace-from-earlier>
```

### Create time series hub authorization rule

Create an [authorization rule](/cli/azure/eventhubs/eventhub/authorization-rule#az_eventhubs_eventhub_authorization_rule_create) with send and receive permissions. Specify a name for the time series hub auth rule.

```azurecli-interactive
az eventhubs eventhub authorization-rule create --rights Listen Send --name <name-for-your-time-series-hub-auth-rule> --resource-group <your-resource-group> --namespace-name <your-event-hub-namespace-from-earlier> --eventhub-name <your-time-series-hub-name-from-above>
```

### Get time series hub connection string

Get the [time series hub connection string](../event-hubs/event-hubs-get-connection-string.md), using the authorization rules you created above for the time series hub:

```azurecli-interactive
az eventhubs eventhub authorization-rule keys list --resource-group <your-resource-group> --namespace-name <your-event-hub-namespace-from-earlier> --eventhub-name <your-time-series-hub-name-from-earlier> --name <your-time-series-hub-auth-rule-from-earlier>
```
Take note of the **primaryConnectionString** value from the result to configure the time series hub app setting later in this article.

Also, take note of the following values to use them later to create a Time Series Insights instance.
* Event hub namespace
* Time series hub name
* Time series hub auth rule

## Create a function

In this section, you'll create an Azure function that will convert twin update events from their original form as JSON Patch documents to JSON objects, containing only updated and added values from your twins.

### Step 1: Create function app

First, create a new function app project in Visual Studio. For instructions on how to do this, see the [**Create a function app in Visual Studio**](how-to-create-azure-function.md#create-a-function-app-in-visual-studio) section of the *How-to: Set up a function for processing data* article.

### Step 2: Add a new function

Create a new Azure function called *ProcessDTUpdatetoTSI.cs* to update device telemetry events to the Time Series Insights. The function type will be **Event Hub trigger**.

:::image type="content" source="media/how-to-integrate-time-series-insights/create-event-hub-trigger-function.png" alt-text="Screenshot of Visual Studio to create a new Azure function of type event hub trigger.":::

### Step 3: Fill in function code

Add the following packages to your project:
* [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs/)
* [Microsoft.Azure.WebJobs.Extensions.EventHubs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs/)
* [Microsoft.NET.Sdk.Functions](https://www.nuget.org/packages/Microsoft.NET.Sdk.Functions/)

Replace the code in the *ProcessDTUpdatetoTSI.cs* file with the following code:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/updateTSI.cs":::

Save your function code.

### Step 4: Publish the function app to Azure

Publish the project with the *ProcessDTUpdatetoTSI.cs* function to a function app in Azure.

For instructions on how to do this, see the section [**Publish the function app to Azure**](how-to-create-azure-function.md#publish-the-function-app-to-azure) of the *How-to: Set up a function for processing data* article.

Save the function app name to use later to configure app settings for the two event hubs.

### Step 5: Security access for the function app

Next, **assign an access role** for the function and **configure the application settings** so that it can access your Azure Digital Twins instance. For instructions on how to do this, see the section [**Set up security access for the function app**](how-to-create-azure-function.md#set-up-security-access-for-the-function-app) of the *How-to: Set up a function for processing data* article.

### Step 6: Configure app settings for the two event hubs

Next, you'll add environment variables in the function app's settings that allow it to access the twins hub and time series hub.

Use the twins hub **primaryConnectionString** value that you saved earlier to create an app setting in your function app that contains the twins hub connection string:

```azurecli-interactive
az functionapp config appsettings set --settings "EventHubAppSetting-Twins=<your-twins-hub-primaryConnectionString>" -g <your-resource-group> -n <your-App-Service-(function-app)-name>
```

Use the time series hub **primaryConnectionString** value that you saved earlier to create an app setting in your function app that contains the time series hub connection string:

```azurecli-interactive
az functionapp config appsettings set --settings "EventHubAppSetting-TSI=<your-time-series-hub-primaryConnectionString>" -g <your-resource-group> -n <your-App-Service-(function-app)-name>
```

## Create and connect a Time Series Insights instance

In this section, you'll set up Time Series Insights instance to receive data from your time series hub. For more details about this process, see [*Tutorial: Set up an Azure Time Series Insights Gen2 PAYG environment*](../time-series-insights/tutorial-set-up-environment.md). Follow the steps below to create a time series insights environment.

1. In the [Azure portal](https://portal.azure.com), search for *Time Series Insights environments*, and select the **Add** button. Choose the following options to create the time series environment.

    * **Subscription** - Choose your subscription.
        - **Resource group** - Choose your resource group.
    * **Environment name** - Specify a name for your time series environment.
    * **Location** - Choose a location.
    * **Tier** - Choose the **Gen2(L1)** pricing tier.
    * **Property name** - Enter **$dtId** (Read more about selecting an ID value in [*Best practices for choosing a Time Series ID*](../time-series-insights/how-to-select-tsid.md)).
    * **Storage account name** - Specify a storage account name.
    * **Enable warm store** - Leave this field set to *Yes*.

    You can leave default values for other properties on this page. Select the **Next : Event Source >** button.

    :::image type="content" source="media/how-to-integrate-time-series-insights/create-time-series-insights-environment-1.png" alt-text="Screenshot of the Azure portal to create Time Series Insights environment. Select your subscription, resource group, and location from the respective dropdowns and choose a name for your environment." lightbox="media/how-to-integrate-time-series-insights/create-time-series-insights-environment-1.png":::
        
    :::image type="content" source="media/how-to-integrate-time-series-insights/create-time-series-insights-environment-2.png" alt-text="Screenshot of the Azure portal to create Time Series Insights environment. The Gen2(L1) pricing tier is selected and the time series ID property name is $dtId." lightbox="media/how-to-integrate-time-series-insights/create-time-series-insights-environment-2.png":::

2. In the *Event Source* tab, choose the following fields:

   * **Create an event source?** - Choose *Yes*.
   * **Source type** - Choose *Event Hub*.
   * **Name** - Specify a name for your event source.
   * **Subscription** - Choose your Azure subscription.
   * **Event Hub namespace** - Choose the namespace that you created earlier in this article.
   * **Event Hub name** - Choose the **time series hub** name that you created earlier in this article.
   * **Event Hub access policy name** - Choose the *time series hub auth rule* that you created earlier in this article.
   * **Event Hub consumer group** - Select *New* and specify a name for your event hub consumer group. Then, select *Add*.
   * **Property name** - Leave this field blank.
    
    Choose the **Review + Create** button to review all the details. Then, select the **Review + Create** button again to create the time series environment.

    :::image type="content" source="media/how-to-integrate-time-series-insights/create-tsi-environment-event-source.png" alt-text="Screenshot of the Azure portal to create Time Series Insights environment. You are creating an event source with the event hub information from above. You are also creating a new consumer group." lightbox="media/how-to-integrate-time-series-insights/create-tsi-environment-event-source.png":::

## Send IoT data to Azure Digital Twins

To begin sending data to Time Series Insights, you'll need to start updating the digital twin properties in Azure Digital Twins with changing data values.

Use the following CLI command to update the *Temperature* property on the *thermostat67* twin that you added to your instance in the [Prerequisites](#prerequisites) section.

```azurecli-interactive
az dt twin update -n <your-azure-digital-twins-instance-name> --twin-id thermostat67 --json-patch '{"op":"replace", "path":"/Temperature", "value": 20.5}'
```

**Repeat the command at least 4 more times with different temperature values**, to create several data points that can be observed later in the Time Series Insights environment.

> [!TIP]
> If you'd like to complete this article with live simulated data instead of manually updating the digital twin values, first make sure you've completed the TIP from the [*Prerequisites*](#prerequisites) section to set up an Azure function that updates twins from a simulated device.
After that, you can run the device now to start sending simulated data and updating your digital twin through that data flow.

## Visualize your data in Time Series Insights

Now, data should be flowing into your Time Series Insights instance, ready to be analyzed. Follow the steps below to explore the data coming in.

1. In the [Azure portal](https://portal.azure.com), search for your time series environment name that you created earlier. In the menu options on the left, select *Overview* to see the *Time Series Insights Explorer URL*. Select the URL to view the temperature changes reflected in the Time Series Insights environment.

    :::image type="content" source="media/how-to-integrate-time-series-insights/view-environment.png" alt-text="Screenshot of the Azure portal to select the Time Series Insights explorer URL in the overview tab of your Time Series Insights environment." lightbox="media/how-to-integrate-time-series-insights/view-environment.png":::

2. In the explorer, you will see the twins in the Azure Digital Twins instance shown on the left. Select the *thermostat67* twin, choose the property *Temperature*, and hit **Add**.

    :::image type="content" source="media/how-to-integrate-time-series-insights/add-data.png" alt-text="Screenshot of the Time Series Insights explorer to select thermostat67, select the property temperature, and hit add." lightbox="media/how-to-integrate-time-series-insights/add-data.png":::

3. You should now see the initial temperature readings from your thermostat, as shown below. 

    :::image type="content" source="media/how-to-integrate-time-series-insights/initial-data.png" alt-text="Screenshot of the TSI explorer to view the initial temperature data. It is a line of random values between 68 and 85" lightbox="media/how-to-integrate-time-series-insights/initial-data.png":::

If you allow a simulation to run for much longer, your visualization will look something like this:

:::image type="content" source="media/how-to-integrate-time-series-insights/day-data.png" alt-text="Screenshot of the TSI explorer where temperature data for each twin is graphed in three parallel lines of different colors." lightbox="media/how-to-integrate-time-series-insights/day-data.png":::

## Next steps

The digital twins are stored by default as a flat hierarchy in Time Series Insights, but they can be enriched with model information and a multi-level hierarchy for organization. To learn more about this process, read: 

* [*Tutorial: Define and apply a model*](../time-series-insights/tutorial-set-up-environment.md#define-and-apply-a-model) 

You can write custom logic to automatically provide this information using the model and graph data already stored in Azure Digital Twins. To read more about managing, upgrading, and retrieving information from the twins graph, see the following references:

* [*How-to: Manage a digital twin*](./how-to-manage-twin.md)
* [*How-to: Query the twin graph*](./how-to-query-graph.md)