---
title: Create routes and filters
titleSuffix: Azure Digital Twins
description: Learn how to set up event routes and event filters to Azure Digital Twins endpoints
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 02/08/2023
ms.topic: how-to
ms.service: digital-twins
ms.custom: devx-track-azurecli

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Create event routes and filters in Azure Digital Twins

This article walks you through the process of creating *event routes* using the [Azure portal](https://portal.azure.com), [Azure CLI az dt route commands](/cli/azure/dt/route), [Event Routes data plane APIs](/rest/api/digital-twins/dataplane/eventroutes), and the [.NET (C#) SDK](/dotnet/api/overview/azure/digitaltwins.core-readme).

Routing [event notifications](concepts-event-notifications.md) from Azure Digital Twins to downstream services or connected compute resources is a two-step process: create endpoints, then create event routes to send data to those endpoints. This article covers the second step, setting up routes to control which events are delivered to which Azure Digital Twin endpoints. To proceed with this article, you should have [endpoints](how-to-create-endpoints.md) already created.

## Prerequisites

* You'll need an Azure account, which [can be set up for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
* You'll need an Azure Digital Twins instance in your Azure subscription. If you don't have an instance already, you can create one using the steps in [Set up an instance and authentication](how-to-set-up-instance-portal.md). Have the following values from setup handy to use later in this article:
    - Instance name
    - Resource group

    You can find these details in the [Azure portal](https://portal.azure.com) after setting up your instance. 
    
    :::image type="content" source="media/includes/instance-details.png" alt-text="Screenshot of the Overview page for an Azure Digital Twins instance in the Azure portal. The name and resource group are highlighted." lightbox="media/includes/instance-details.png":::

* Create an endpoint using the instructions in [Create endpoints](how-to-create-endpoints.md). In this article, you'll create a route to send data to that endpoint.

Next, follow the instructions below if you intend to use the Azure CLI while following this guide.

[!INCLUDE [azure-cli-prepare-your-environment-h3.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-h3.md)]

## Create an event route

After [creating an endpoint](how-to-create-endpoints.md), you'll need to define an *event route* to actually send data to the endpoint. These routes let developers wire up event flow, throughout the system and to downstream services. A single route can allow multiple notifications and event types to be selected. Read more about event routes in [Endpoints and event routes](concepts-route-events.md).

>[!NOTE]
> Make sure you've created at least one endpoint as described in the [Prerequisites](#prerequisites) before you move on to creating a route.
>
>If you've only recently deployed your endpoints, validate that they're finished deploying before attempting to use them for a new event route. If route deployment fails because the endpoints aren't ready, wait a few minutes and try again.
>
> If you are scripting this flow, you may want to account for this by building in 2-3 minutes of wait time for the endpoint service to finish deploying before moving on to route setup.

A route definition can contain these elements:
* The route name you want to use
* The name of the endpoint you want to use
* A filter that defines which events are sent to the endpoint
    - To disable the route so that no events are sent, use a filter value of `false`
    - To enable a route that has no specific filtering, use a filter value of `true`
    - For details on any other type of filter, see the [Filter events](#filter-events) section below

If there's no route name, no messages are routed outside of Azure Digital Twins. 
If there's a route name and the filter is `true`, all messages are routed to the endpoint. 
If there's a route name and a different filter is added, messages will be filtered based on the filter.

Event routes can be created with the [Azure portal](https://portal.azure.com), [EventRoutes data plane APIs](/rest/api/digital-twins/dataplane/eventroutes), or [az dt route CLI commands](/cli/azure/dt/route). The rest of this section walks through the creation process.

# [Portal](#tab/portal2)

To create an event route, go to the details page for your Azure Digital Twins instance in the [Azure portal](https://portal.azure.com) (you can find the instance by entering its name into the portal search bar).

From the instance menu, select **Event routes**. Then from the **Event routes** page that follows, select **+ Create an event route**. 

On the **Create an event route** page that opens up, choose at minimum:
* A name for your route in the **Name** field
* The **Endpoint** you want to use to create the route 

For the route to be enabled, you must also **Add an event route filter** of at least `true`. (Leaving the default value of `false` will create the route, but no events will be sent to it.) To do so, toggle the switch for the **Advanced editor** to enable it, and write `true` in the **Filter** box.

:::image type="content" source="media/how-to-create-routes/create-event-route-no-filter.png" alt-text="Screenshot of creating an event route for your instance in the Azure portal." lightbox="media/how-to-create-routes/create-event-route-no-filter.png":::

When finished, select the **Save** button to create your event route.

# [CLI](#tab/cli2)

Routes can be managed using the [az dt route](/cli/azure/dt/route) commands for the Azure Digital Twins CLI. 

For more information about using the CLI and what commands are available, see [Azure Digital Twins CLI command set](concepts-cli.md).

# [.NET SDK](#tab/sdk2)

This section shows how to create an event route using the [.NET (C#) SDK](/dotnet/api/overview/azure/digitaltwins.core-readme).

`CreateOrReplaceEventRouteAsync` is the SDK call that is used to add an event route. Here's an example of its usage:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/eventRoute_operations.cs" id="CreateEventRoute":::
    
> [!TIP]
> All SDK functions come in synchronous and asynchronous versions.

### Event route sample SDK code

The following sample method shows how to create, list, and delete an event route with the C# SDK:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/eventRoute_operations.cs" id="FullEventRouteSample":::

---

## Filter events

As described above, routes have a filter field. If the filter value on your route is `false`, no events will be sent to your endpoint. 

After you've enabled a minimal filter of `true`, endpoints will receive different kinds of events from Azure Digital Twins:
* Telemetry fired by [digital twins](concepts-twins-graph.md) using the Azure Digital Twins service API
* Twin property change notifications, fired on property changes for any twin in the Azure Digital Twins instance
* Life-cycle events, fired when twins or relationships are created or deleted

You can restrict the types of events being sent by defining a more-specific filter.

>[!NOTE]
> Filters are case-sensitive and need to match the payload case. 
>
> For telemetry filters, this means that the casing needs to match the casing in the telemetry sent by the device, not necessarily the casing defined in the twin's model.

# [Portal](#tab/portal3)

To add an event filter while you're creating an event route, use the **Add an event route filter** section of the **Create an event route** page. 

You can either select from some basic common filter options, or use the advanced filter options to write your own custom filters.

### Use the basic filters

To use the basic filters, expand the **Event types** option and select the checkboxes corresponding to the events you want to send to your endpoint. 

:::image type="content" source="media/how-to-create-routes/create-event-route-filter-basic-1.png" alt-text="Screenshot of creating an event route with a basic filter in the Azure portal, highlighting the checkboxes of the events." lightbox="media/how-to-create-routes/create-event-route-filter-basic-1-large.png":::

Doing so will autopopulate the filter text box with the text of the filter you've selected:

:::image type="content" source="media/how-to-create-routes/create-event-route-filter-basic-2.png" alt-text="Screenshot of creating an event route with a basic filter in the Azure portal, highlighting the autopopulated filter text after selecting the events." lightbox="media/how-to-create-routes/create-event-route-filter-basic-2-large.png":::

### Use the advanced filters

You can also use the advanced filter option to write your own custom filters.

To create an event route with advanced filter options, toggle the switch for the **Advanced editor** to enable it. You can then write your own event filters in the **Filter** box:

:::image type="content" source="media/how-to-create-routes/create-event-route-filter-advanced.png" alt-text="Screenshot of creating an event route with an advanced filter in the Azure portal." lightbox="media/how-to-create-routes/create-event-route-filter-advanced-large.png":::

# [API](#tab/api)

You can use the [Event Routes data plane APIs](/rest/api/digital-twins/dataplane/eventroutes) to write custom filters. To add a filter, you can use a PUT request to `https://<Your-Azure-Digital-Twins-host-name>/eventRoutes/<event-route-name>?api-version=2020-10-31` with the following body:

:::code language="json" source="~/digital-twins-docs-samples/api-requests/filter.json":::

---

### Supported route filters

Here are the supported route filters.

| Filter name | Description | Filter text schema | Supported values | 
| --- | --- | --- | --- |
| True / False | Allows creating a route with no filtering, or disabling a route so no events are sent | `<true/false>` | `true` = route is enabled with no filtering <br> `false` = route is disabled |
| Type | The [type of event](concepts-route-events.md#types-of-event-messages) flowing through your digital twin instance | `type = '<event-type>'` | Here are the possible event type values: <br>`Microsoft.DigitalTwins.Twin.Create` <br> `Microsoft.DigitalTwins.Twin.Delete` <br> `Microsoft.DigitalTwins.Twin.Update`<br>`Microsoft.DigitalTwins.Relationship.Create`<br>`Microsoft.DigitalTwins.Relationship.Update`<br> `Microsoft.DigitalTwins.Relationship.Delete` <br> `microsoft.iot.telemetry`  |
| Source | Name of Azure Digital Twins instance | `source = '<host-name>'`| Here are the possible host name values: <br><br> For notifications: `<your-Digital-Twins-instance>.api.<your-region>.digitaltwins.azure.net` <br><br> For telemetry: `<your-Digital-Twins-instance>.api.<your-region>.digitaltwins.azure.net/<twin-ID>`|
| Subject | A description of the event in the context of the event source above | `subject = '<subject>'` | Here are the possible subject values: <br><br>For notifications: The subject is `<twin-ID>` <br> or a URI format for subjects, which are uniquely identified by multiple parts or IDs:<br>`<twin-ID>/relationships/<relationship-ID>`<br><br> For telemetry: The subject is the component path (if the telemetry is emitted from a twin component), such as `comp1.comp2`. If the telemetry isn't emitted from a component, then its subject field is empty. |
| Data schema | DTDL model ID | `dataschema = '<model-dtmi-ID>'` | For telemetry: The data schema is the model ID of the twin or the component that emits the telemetry. For example, `dtmi:example:com:floor4;2` <br><br>For notifications (create/delete): Data schema can be accessed in the notification body at `$body.$metadata.$model`. <br><br>For notifications (update): Data schema can be accessed in the notification body at `$body.modelId`|
| Content type | Content type of data value | `datacontenttype = '<content-type>'` | The content type is `application/json` |
| Spec version | The version of the event schema you're using | `specversion = '<version>'` | The version must be `1.0`. This value indicates the CloudEvents schema version 1.0 |
| Notification body | Reference any property in the `data` field of a notification | `$body.<property>` | See [Event notifications](concepts-event-notifications.md) for examples of notifications. Any property in the `data` field can be referenced using `$body`

>[!NOTE]
> Azure Digital Twins currently doesn't support filtering events based on fields within an array. This includes filtering on properties within a `patch` section of a [digital twin change notification](concepts-event-notifications.md#digital-twin-change-notifications).

The following data types are supported as values returned by references to the data above:

| Data type | Example |
|-|-|-|
|String| `STARTS_WITH($body.$metadata.$model, 'dtmi:example:com:floor')` <br> `CONTAINS(subject, '<twin-ID>')`|
|Integer|`$body.errorCode > 200`|
|Double|`$body.temperature <= 5.5`|
|Bool|`$body.poweredOn = true`|
|Null|`$body.prop != null`|

The following operators are supported when defining route filters:

|Family|Operators|Example|
|-|-|-|
|Logical|AND, OR, ( )|`(type != 'microsoft.iot.telemetry' OR datacontenttype = 'application/json') OR (specversion != '1.0')`|
|Comparison|<, <=, >, >=, =, !=|`$body.temperature <= 5.5`

The following functions are supported when defining route filters:

|Function|Description|Example|
|--|--|--|
|STARTS_WITH(x,y)|Returns true if the value `x` starts with the string `y`.|`STARTS_WITH($body.$metadata.$model, 'dtmi:example:com:floor')`|
|ENDS_WITH(x,y) | Returns true if the value `x` ends with the string `y`.|`ENDS_WITH($body.$metadata.$model, 'floor;1')`|
|CONTAINS(x,y)| Returns true if the value `x` contains the string `y`.|`CONTAINS(subject, '<twin-ID>')`|

When you implement or update a filter, the change may take a few minutes to be reflected in the data pipeline.

## Monitor event routes

Routing metrics such as count, latency, and failure rate can be viewed in the [Azure portal](https://portal.azure.com/). 

For information about viewing and managing metrics with Azure Monitor, see [Get started with metrics explorer](../azure-monitor/essentials/metrics-getting-started.md). For a full list of routing metrics available for Azure Digital Twins, see [Azure Digital Twins routing metrics](how-to-monitor.md#routing-metrics).

## Next steps

Read about the different types of event messages you can receive:
* [Event notifications](concepts-event-notifications.md)
