---
title: Create custom event triggers in Azure Data Factory 
description: Learn how to create a custom trigger in Azure Data Factory that runs a pipeline in response to a custom event published to Event Grid.
ms.service: data-factory
author: chez-charlie
ms.author: chez
ms.reviewer: maghan
ms.topic: conceptual
ms.date: 03/11/2021
---

# Create a trigger that runs a pipeline in response to a custom event

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes the Custom Event Triggers that you can create in your Data Factory pipelines. Custom Event Trigger is currently in Public Preview state and will gradually roll out ot GA phase.

Event-driven architecture (EDA) is a common data integration pattern that involves production, detection, consumption, and reaction to events. Data integration scenarios often require Data Factory customers to trigger pipelines based on events happening in storage account, such as the arrival or deletion of a file in Azure Blob Storage account. Data Factory natively integrates with [Azure Event Grid](https://azure.microsoft.com/services/event-grid/), which lets you trigger pipelines on such events.

> The integration described in this article depends on [Azure Event Grid](https://azure.microsoft.com/services/event-grid/). Make sure that your subscription is registered with the Event Grid resource provider. For more info, see [Resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md#azure-portal). You must be able to do the *Microsoft.EventGrid/eventSubscriptions/** action. This action is part of the EventGrid EventSubscription Contributor built-in role.

__PLACE HOLDER FILE__

## Next steps

* For detailed information about triggers, see [Pipeline execution and triggers](concepts-pipeline-execution-triggers.md#trigger-execution).
* Learn how to reference trigger metadata in pipeline, see [Reference Trigger Metadata in Pipeline Runs](how-to-use-trigger-parameterization.md)
