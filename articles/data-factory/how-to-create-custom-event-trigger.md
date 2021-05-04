---
title: Create custom event triggers in Azure Data Factory 
description: Learn how to create a trigger in Azure Data Factory that runs a pipeline in response to a custom event published to Event Grid.
ms.service: data-factory
author: chez-charlie
ms.author: chez
ms.reviewer: jburchel
ms.topic: conceptual
ms.date: 03/11/2021
---

# Create a custom event trigger to run a pipeline in Azure Data Factory (Preview)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes custom event triggers you can create in your Data Factory pipelines.

Event-driven architecture (EDA) is a common data integration pattern that involves production, detection, consumption, and reaction to events. Data integration scenarios often require Data Factory customers to trigger pipelines based on certain events happening. Data Factory native integration with [Azure Event Grid](https://azure.microsoft.com/services/event-grid/) now covers [custom topics](../event-grid/custom-topics.md). You send events to an event grid topic. Data Factory subscribes to the topic, listens, and then triggers pipelines accordingly.

> [!NOTE]
> The integration described in this article depends on [Azure Event Grid](https://azure.microsoft.com/services/event-grid/). Make sure that your subscription is registered with the Event Grid resource provider. For more information, see [Resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md#azure-portal). You must be able to do the `Microsoft.EventGrid/eventSubscriptions/` action. This action is part of the [EventGrid EventSubscription Contributor](../role-based-access-control/built-in-roles.md#eventgrid-eventsubscription-contributor) built-in role.

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

1. Select **Trigger** on the menu, then select **New/Edit**.

1. On the **Add Triggers** page, select **Choose trigger...**, then select **+New**.

1. Select **Custom events** as the **Type**.

    :::image type="content" source="media/how-to-create-custom-event-trigger/custom-event-1-creation.png" alt-text="Screenshot of Author page to create a new custom event trigger in Data Factory UI." lightbox="media/how-to-create-custom-event-trigger/custom-event-1-creation-expanded.png":::

1. Select your custom topic from the Azure subscription dropdown or manually enter the event topic scope.

   > [!NOTE]
   > To create a new or modify an existing custom event trigger in Data Factory, you need to use an Azure account with appropriate role based access control (Azure RBAC). No additional permission is required: Service Principal for the Azure Data Factory does _not_ need special permission to Event Grid. For more information about access control, see the [Role based access control](#role-based-access-control) section.

1. The **Subject begins with** and **Subject ends with** properties allow you to filter for events you want to trigger the pipeline. Both properties are optional.

***

1. Use **+ New** to add **Event Types** that you want to filter on. Custom Event trigger employee an OR relationship for the list: if a custom event has an _eventType_ property that matches any listed here, it will trigger a pipeline run. The event type is case insensitive. For instance, in the screenshot below, the trigger matches all _copycompleted_ or _copysucceeded_ events with subject starts with _factories_

    :::image type="content" source="media/how-to-create-custom-event-trigger/custom-event-2-properties.png" alt-text="Screenshot of Edit Trigger page to explain Event Types and Subject filtering in Data Factory UI.":::

1. Custom event trigger can parse and send custom _data_ payload to your pipeline. First create the pipeline parameters, and fill in the values on the **Parameters** page. Use format **@triggerBody().event.data._keyName_** to parse the data payload, and pass values to pipeline parameters. For detailed explanation, see [Reference Trigger Metadata in Pipelines](how-to-use-trigger-parameterization.md) and [System Variables in Custom Event Trigger](control-flow-system-variables.md#custom-event-trigger-scope)

    :::image type="content" source="media/how-to-create-custom-event-trigger/custom-event-4-trigger-values.png" alt-text="Screenshot of pipeline Parameters setting.":::

    :::image type="content" source="media/how-to-create-custom-event-trigger/custom-event-3-parameters.png" alt-text="Screenshot of Parameters page to reference data payload in custom event.":::

1. Click **OK** once you are done.

## JSON schema

The following table provides an overview of the schema elements that are related to custom event triggers:

| **JSON Element** | **Description** | **Type** | **Allowed Values** | **Required** |
| ---------------- | --------------- | -------- | ------------------ | ------------ |
| **scope** | The Azure Resource Manager resource ID of the event grid topic. | String | Azure Resource Manager ID | Yes |
| **events** | The type of events that cause this trigger to fire. | Array of strings    |  | Yes, at least one value is expected |
| **subjectBeginsWith** | Subject field must begin with the pattern provided for the trigger to fire. For example, `factories` only fires the trigger for event subject starting with `factories`. | String   | | No |
| **subjectEndsWith** | Subject field must end with the pattern provided for the trigger to fire. | String   | | No |

## Role-based access control

Azure Data Factory uses Azure role-based access control (Azure RBAC) to ensure that unauthorized access to listen to, subscribe to updates from, and trigger pipelines linked to custom events, are strictly prohibited.

* To successfully create a new or update an existing Custom Event Trigger, the Azure account signed into the Data Factory needs to have appropriate access to the relevant storage account. Otherwise, the operation with fail with _Access Denied_.
* Data Factory needs no special permission to your Event Grid, and you do _not_ need to assign special Azure RBAC permission to Data Factory service principal for the operation.

Specifically, customer needs _Microsoft.EventGrid/EventSubscriptions/Write_ permission on _/subscriptions/####/resourceGroups//####/providers/Microsoft.EventGrid/topics/someTopics_

## Next steps

* For detailed information about triggers, see [Pipeline execution and triggers](concepts-pipeline-execution-triggers.md#trigger-execution).
* Learn how to reference trigger metadata in pipeline, see [Reference Trigger Metadata in Pipeline Runs](how-to-use-trigger-parameterization.md)
