---
title: Create custom event triggers in Azure Data Factory 
description: Learn how to create a trigger in Azure Data Factory that runs a pipeline in response to a custom event published to Event Grid.
ms.service: data-factory
ms.subservice: orchestration
author: chez-charlie
ms.author: chez
ms.reviewer: jburchel
ms.topic: conceptual
ms.date: 07/17/2023
---

# Create a custom event trigger to run a pipeline in Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Event-driven architecture (EDA) is a common data integration pattern that involves production, detection, consumption, and reaction to events. Data integration scenarios often require Azure Data Factory customers to trigger pipelines when certain events occur. Data Factory native integration with [Azure Event Grid](https://azure.microsoft.com/services/event-grid/) now covers [custom topics](../event-grid/custom-topics.md). You send events to an event grid topic. Data Factory subscribes to the topic, listens, and then triggers pipelines accordingly.

> [!NOTE]
> The integration described in this article depends on [Azure Event Grid](https://azure.microsoft.com/services/event-grid/). Make sure that your subscription is registered with the Event Grid resource provider. For more information, see [Resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md#azure-portal). You must be able to do the `Microsoft.EventGrid/eventSubscriptions/` action. This action is part of the [EventGrid EventSubscription Contributor](../role-based-access-control/built-in-roles.md#eventgrid-eventsubscription-contributor) built-in role.


> [!IMPORTANT]
> If you are using this feature in Azure Synapse Analytics, please ensure that your subscription is also registered with Data Factory resource provider, or otherwise you will get an error stating that _the creation of an "Event Subscription" failed_.


If you combine pipeline parameters and a custom event trigger, you can parse and reference custom `data` payloads in pipeline runs. Because the `data` field in a custom event payload is a free-form, JSON key-value structure, you can control event-driven pipeline runs.

> [!IMPORTANT]
> If a key referenced in parameterization is missing in the custom event payload, `trigger run` will fail. You'll get an error that states the expression cannot be evaluated because property `keyName` doesn't exist. In this case, **no** `pipeline run` will be triggered by the event.

## Set up a custom topic in Event Grid

To use the custom event trigger in Data Factory, you need to *first* set up a [custom topic in Event Grid](../event-grid/custom-topics.md).

Go to Azure Event Grid and create the topic yourself. For more information on how to create the custom topic, see Azure Event Grid [portal tutorials](../event-grid/custom-topics.md#azure-portal-tutorials) and [CLI tutorials](../event-grid/custom-topics.md#azure-cli-tutorials).

> [!NOTE]
> The workflow is different from Storage Event Trigger. Here, Data Factory doesn't set up the topic for you.

Data Factory expects events to follow the [Event Grid event schema](../event-grid/event-schema.md). Make sure event payloads have the following fields:

```json
[
  {
    "topic": string,
    "subject": string,
    "id": string,
    "eventType": string,
    "eventTime": string,
    "data":{
      object-unique-to-each-publisher
    },
    "dataVersion": string,
    "metadataVersion": string
  }
]
```

## Use Data Factory to create a custom event trigger

1. Go to Azure Data Factory and sign in.

1. Switch to the **Edit** tab. Look for the pencil icon.

1. Select **Trigger** on the menu and then select **New/Edit**.

1. On the **Add Triggers** page, select **Choose trigger**, and then select **+New**.

1. Select **Custom events** for **Type**.

   :::image type="content" source="media/how-to-create-custom-event-trigger/custom-event-1-creation.png" alt-text="Screenshot of Author page to create a new custom event trigger in Data Factory UI." lightbox="media/how-to-create-custom-event-trigger/custom-event-1-creation-expanded.png":::

1. Select your custom topic from the Azure subscription dropdown or manually enter the event topic scope.

   > [!NOTE]
   > To create or modify a custom event trigger in Data Factory, you need to use an Azure account with appropriate role-based access control (Azure RBAC). No additional permission is required. The Data Factory service principal does *not* require special permission to your Event Grid. For more information about access control, see the [Role-based access control](#role-based-access-control) section.

1. The **Subject begins with** and **Subject ends with** properties allow you to filter for trigger events. Both properties are optional.

1. Use **+ New** to add **Event Types** to filter on. The list of custom event triggers uses an OR relationship. When a custom event with an `eventType` property that matches one on the list, a pipeline run is triggered. The event type is case insensitive. For example, in the following screenshot, the trigger matches all `copycompleted` or `copysucceeded` events that have a subject that begins with *factories*.

   :::image type="content" source="media/how-to-create-custom-event-trigger/custom-event-2-properties.png" alt-text="Screenshot of Edit Trigger page to explain Event Types and Subject filtering in Data Factory UI.":::

1. A custom event trigger can parse and send a custom `data` payload to your pipeline. You create the pipeline parameters, and then fill in the values on the **Parameters** page. Use the format `@triggerBody().event.data._keyName_` to parse the data payload and pass values to the pipeline parameters.
 
   For a detailed explanation, see the following articles:
   - [Reference trigger metadata in pipelines](how-to-use-trigger-parameterization.md)
   - [System variables in custom event trigger](control-flow-system-variables.md#custom-event-trigger-scope)

   :::image type="content" source="media/how-to-create-custom-event-trigger/custom-event-4-trigger-values.png" alt-text="Screenshot of pipeline parameters settings.":::

   :::image type="content" source="media/how-to-create-custom-event-trigger/custom-event-3-parameters.png" alt-text="Screenshot of the parameters page to reference data payload in custom event.":::

1. After you've entered the parameters, select **OK**.

## Advanced filtering

Custom event trigger supports advanced filtering capabilities, similar to [Event Grid Advanced Filtering](../event-grid/event-filtering.md#advanced-filtering). These conditional filters allow pipelines to trigger based upon the _values_ of event payload. For instance, you may have a field in the event payload, named _Department_, and pipeline should only trigger if _Department_ equals to _Finance_. You may also specify complex logic, such as _date_ field in list [1, 2, 3, 4, 5], _month_ field __not__ in list [11, 12], _tag_ field contains any of ['Fiscal Year 2021', 'FiscalYear2021', 'FY2021'].

 :::image type="content" source="media/how-to-create-custom-event-trigger/custom-event-5-advanced-filters.png" alt-text="Screenshot of setting advanced filters for customer event trigger":::

As of today custom event trigger supports a __subset__ of [advanced filtering operators](../event-grid/event-filtering.md#advanced-filtering) in Event Grid. Following filter conditions are supported:

* NumberIn
* NumberNotIn
* NumberLessThan
* NumberGreaterThan
* NumberLessThanOrEquals
* NumberGreaterThanOrEquals
* BoolEquals
* StringContains
* StringBeginsWith
* StringEndsWith
* StringIn
* StringNotIn

Select **+New** to add new filter conditions. 

Additionally, custom event triggers obey the [same limitations as Event Grid](../event-grid/event-filtering.md#limitations), including:

* 5 advanced filters and 25 filter values across all the filters per custom event trigger
* 512 characters per string value
* 5 values for in and not in operators
* keys cannot have `.` (dot) character in them, for example, `john.doe@contoso.com`. Currently, there's no support for escape characters in keys.
* The same key can be used in more than one filter.

Data Factory relies upon the latest _GA_ version of [Event Grid API](../event-grid/whats-new.md). As new API versions get to GA stage, Data Factory will expand its support for more advanced filtering operators.

## JSON schema

The following table provides an overview of the schema elements that are related to custom event triggers:

| JSON element | Description | Type | Allowed values | Required |
|---|----------------------------|---|---|---|
| `scope` | The Azure Resource Manager resource ID of the Event Grid topic. | String | Azure Resource Manager ID | Yes |
| `events` | The type of events that cause this trigger to fire. | Array of strings    |  | Yes, at least one value is expected. |
| `subjectBeginsWith` | The `subject` field must begin with the provided pattern for the trigger to fire. For example, _factories_ only fire the trigger for event subjects that start with *factories*. | String   | | No |
| `subjectEndsWith` | The `subject` field must end with the provided pattern for the trigger to fire. | String   | | No |
| `advancedFilters` | List of JSON blobs, each specifying a filter condition. Each blob specifies `key`, `operatorType`, and `values`. | List of JSON blob | | No |

## Role-based access control

Azure Data Factory uses Azure role-based access control (RBAC) to prohibit unauthorized access. To function properly, Data Factory requires access to:
- Listen to events.
- Subscribe to updates from events.
- Trigger pipelines linked to custom events.

To successfully create or update a custom event trigger, you need to sign in to Data Factory with an Azure account that has appropriate access. Otherwise, the operation will fail with an _Access Denied_ error.

Data Factory doesn't require special permission to your Event Grid. You also do *not* need to assign special Azure RBAC role permission to the Data Factory service principal for the operation.

Specifically, you need `Microsoft.EventGrid/EventSubscriptions/Write` permission on `/subscriptions/####/resourceGroups//####/providers/Microsoft.EventGrid/topics/someTopics`.

- When authoring in the data factory (in the development environment for instance), the Azure account signed in needs to have the above permission
- When publishing through [CI/CD](continuous-integration-delivery.md), the account used to publish the ARM template into the testing or production factory needs to have the above permission.

## Next steps

* Get detailed information about [trigger execution](concepts-pipeline-execution-triggers.md#trigger-execution-with-json).
* Learn how to [reference trigger metadata in pipeline runs](how-to-use-trigger-parameterization.md).
