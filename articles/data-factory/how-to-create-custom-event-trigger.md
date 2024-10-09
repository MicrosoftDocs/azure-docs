---
title: Create custom event triggers in Azure Data Factory 
description: Learn how to create a trigger in Azure Data Factory that runs a pipeline in response to a custom event published to Azure Event Grid.
ms.subservice: orchestration
author: kromerm
ms.author: makromer
ms.reviewer: jburchel
ms.topic: conceptual
ms.date: 01/05/2024
---

# Create a custom event trigger to run a pipeline in Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Event-driven architecture is a common data integration pattern that involves production, detection, consumption, and reaction to events. Data integration scenarios often require Azure Data Factory customers to trigger pipelines when certain events occur. Data Factory native integration with [Azure Event Grid](https://azure.microsoft.com/services/event-grid/) now covers [custom topics](../event-grid/custom-topics.md). You send events to an Event Grid topic. Data Factory subscribes to the topic, listens, and then triggers pipelines accordingly.

The integration described in this article depends on [Azure Event Grid](https://azure.microsoft.com/services/event-grid/). Make sure that your subscription is registered with the Event Grid resource provider. For more information, see [Resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md#azure-portal). You must be able to do the `Microsoft.EventGrid/eventSubscriptions/` action. This action is part of the [EventGrid EventSubscription Contributor](../role-based-access-control/built-in-roles.md#eventgrid-eventsubscription-contributor) built-in role.

> [!IMPORTANT]
> If you're using this feature in Azure Synapse Analytics, ensure that your subscription is also registered with a Data Factory resource provider. Otherwise, you get a message stating that "the creation of an Event Subscription failed."

If you combine pipeline parameters and a custom event trigger, you can parse and reference custom `data` payloads in pipeline runs. Because the `data` field in a custom event payload is a freeform, JSON key-value structure, you can control event-driven pipeline runs.

> [!IMPORTANT]
> If a key referenced in parameterization is missing in the custom event payload, `trigger run` fails. You get a message that states the expression can't be evaluated because the `keyName` property doesn't exist. In this case, **no** `pipeline run` is triggered by the event.

## Set up a custom topic in Event Grid

To use the custom event trigger in Data Factory, you need to *first* set up a [custom topic in Event Grid](../event-grid/custom-topics.md).

Go to Event Grid and create the topic yourself. For more information on how to create the custom topic, see Event Grid [portal tutorials](../event-grid/custom-topics.md#azure-portal-tutorials) and [Azure CLI tutorials](../event-grid/custom-topics.md#azure-cli-tutorials).

> [!NOTE]
> The workflow is different from a storage event trigger. Here, Data Factory doesn't set up the topic for you.

Data Factory expects events to follow the [Event Grid event schema](../event-grid/event-schema.md). Make sure that event payloads have the following fields:

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

1. Go to Data Factory and sign in.

1. Switch to the **Edit** tab. Look for the pencil icon.

1. Select **Trigger** on the menu and then select **New/Edit**.

1. On the **Add Triggers** page, select **Choose trigger**, and then select **+ New**.

1. Under **Type**, select **Custom events**.

   :::image type="content" source="media/how-to-create-custom-event-trigger/custom-event-1-creation.png" alt-text="Screenshot that shows creating a new custom event trigger in the Data Factory UI." lightbox="media/how-to-create-custom-event-trigger/custom-event-1-creation-expanded.png":::

1. Select your custom topic from the Azure subscription dropdown list or manually enter the event topic scope.

   > [!NOTE]
   > To create or modify a custom event trigger in Data Factory, you need to use an Azure account with appropriate Azure role-based access control (Azure RBAC). No other permission is required. The Data Factory service principal does *not* require special permission to your Event Grid. For more information about access control, see the [Role-based access control](#role-based-access-control) section.

1. The `Subject begins with` and `Subject ends with` properties allow you to filter for trigger events. Both properties are optional.

1. Use **+ New** to add **Event types** to filter on. The list of custom event triggers uses an OR relationship. When a custom event with an `eventType` property matches one on the list, a pipeline run is triggered. The event type is case insensitive. For example, in the following screenshot, the trigger matches all `copycompleted` or `copysucceeded` events that have a subject that begins with *factories*.

   :::image type="content" source="media/how-to-create-custom-event-trigger/custom-event-2-properties.png" alt-text="Screenshot that shows the Edit trigger page to explain Event types and Subject filtering in the Data Factory UI.":::

1. A custom event trigger can parse and send a custom `data` payload to your pipeline. You create the pipeline parameters and then fill in the values on the **Parameters** page. Use the format `@triggerBody().event.data._keyName_` to parse the data payload and pass values to the pipeline parameters.

   For a detailed explanation, see:

   - [Reference trigger metadata in pipelines](how-to-use-trigger-parameterization.md)
   - [System variables in custom event trigger](control-flow-system-variables.md#custom-event-trigger-scope)

   :::image type="content" source="media/how-to-create-custom-event-trigger/custom-event-4-trigger-values.png" alt-text="Screenshot that shows pipeline parameters settings.":::

   :::image type="content" source="media/how-to-create-custom-event-trigger/custom-event-3-parameters.png" alt-text="Screenshot that shows the parameters page to reference data payload in a custom event.":::

1. After you enter the parameters, select **OK**.

## Advanced filtering

Custom event triggers support advanced filtering capabilities, similar to [Event Grid advanced filtering](../event-grid/event-filtering.md#advanced-filtering). These conditional filters allow pipelines to trigger based on the _values_ of the event payload. For instance, you might have a field in the event payload named _Department_, and the pipeline should only trigger if _Department_ equals _Finance_. You might also specify complex logic, such as the _date_ field in list [1, 2, 3, 4, 5], the _month_ field *not* in the list [11, 12], and if the _tag_ field contains [Fiscal Year 2021, FiscalYear2021, or FY2021].

 :::image type="content" source="media/how-to-create-custom-event-trigger/custom-event-5-advanced-filters.png" alt-text="Screenshot that shows setting advanced filters for a customer event trigger.":::

As of today, custom event triggers support a *subset* of [advanced filtering operators](../event-grid/event-filtering.md#advanced-filtering) in Event Grid. The following filter conditions are supported:

* `NumberIn`
* `NumberNotIn`
* `NumberLessThan`
* `NumberGreaterThan`
* `NumberLessThanOrEquals`
* `NumberGreaterThanOrEquals`
* `BoolEquals`
* `StringContains`
* `StringBeginsWith`
* `StringEndsWith`
* `StringIn`
* `StringNotIn`

Select **+ New** to add new filter conditions.

Custom event triggers also obey the [same limitations as Event Grid](../event-grid/event-filtering.md#limitations), such as:

* 5 advanced filters and 25 filter values across all the filters per custom event trigger.
* 512 characters per string value.
* 5 values for `in` and `not in` operators.
* Keys can't have the `.` (dot) character in them, for example, `john.doe@contoso.com`. Currently, there's no support for escape characters in keys.
* The same key can be used in more than one filter.

Data Factory relies on the latest general availability (GA) version of the [Event Grid API](../event-grid/whats-new.md). As new API versions get to the GA stage, Data Factory expands its support for more advanced filtering operators.

## JSON schema

The following table provides an overview of the schema elements that are related to custom event triggers.

| JSON element | Description | Type | Allowed values | Required |
|---|----------------------------|---|---|---|
| `scope` | The Azure Resource Manager resource ID of the Event Grid topic. | String | Azure Resource Manager ID | Yes. |
| `events` | The type of events that cause this trigger to fire. | Array of strings    |  | Yes, at least one value is expected. |
| `subjectBeginsWith` | The `subject` field must begin with the provided pattern for the trigger to fire. For example, *factories* only fire the trigger for event subjects that start with *factories*. | String   | | No. |
| `subjectEndsWith` | The `subject` field must end with the provided pattern for the trigger to fire. | String   | | No. |
| `advancedFilters` | List of JSON blobs, each specifying a filter condition. Each blob specifies `key`, `operatorType`, and `values`. | List of JSON blobs | | No. |

## Role-based access control

Data Factory uses Azure RBAC to prohibit unauthorized access. To function properly, Data Factory requires access to:

- Listen to events.
- Subscribe to updates from events.
- Trigger pipelines linked to custom events.

To successfully create or update a custom event trigger, you need to sign in to Data Factory with an Azure account that has appropriate access. Otherwise, the operation fails with the message "Access Denied."

Data Factory doesn't require special permission to your instance of Event Grid. You also do *not* need to assign special Azure RBAC role permission to the Data Factory service principal for the operation.

Specifically, you need `Microsoft.EventGrid/EventSubscriptions/Write` permission on `/subscriptions/####/resourceGroups//####/providers/Microsoft.EventGrid/topics/someTopics`.

- When you author in the data factory (in the development environment, for instance), the Azure account signed in needs to have the preceding permission.
- When you publish through [continuous integration and continuous delivery](continuous-integration-delivery.md), the account used to publish the Azure Resource Manager template into the testing or production factory needs to have the preceding permission.

## Related content

* Get detailed information about [trigger execution](concepts-pipeline-execution-triggers.md#trigger-execution-with-json).
* Learn how to [reference trigger metadata in pipeline runs](how-to-use-trigger-parameterization.md).
