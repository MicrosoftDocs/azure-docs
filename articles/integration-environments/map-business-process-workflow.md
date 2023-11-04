---
title: Map business processes to Standard workflows
description: Map business process stages to operations in Standard workflows created with Azure Logic Apps.
ms.service: azure
ms.topic: how-to
ms.reviewer: estfan, azla
ms.date: 11/15/2023
---

# Map a business process to a Standard logic app workflow (preview)

> [!IMPORTANT]
>
> This capability is in public preview and isn't yet ready production use. For more information, see the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

After you create a business process for an application group in an integration environment, you can add tracking for key business data by mapping stages in your business process to operations and data in a Standard workflow created using Azure Logic Apps.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [integration environment](create-integration-environment.md) that includes at least one [application group](create-application-group.md) with the Azure resources for your integration solution

- A [business process with the stages to map](create-business-process.md)

## Map a business process stage

These steps show how to map your business process stage to a Standard logic app, workflow, and operation as the data source for the business properties that you previously defined for collecting data and tracking.

1. In the [Azure portal](https://portal.azure.com), find and open your integration environment.

1. On your integration environment menu, under **Environment**, select **Applications**.

1. On the **Applications** page, select the application group that has the business process to map.

1. On the application group menu, under **Business process tracking**, select **Business processes**.

1. From the **Business processes** list, select the business process that you want to map.

## Next steps

[What is Azure Integration Environments](overview.md)?