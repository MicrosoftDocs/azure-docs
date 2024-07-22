---
title: 'Azure OpenAI Provisoned Managed Migration'
titleSuffix: Azure OpenAI
description: Learn about the improvements to Provisioned Throughput
manager: nitinme
ms.service: azure-ai-openai
ms.custom: 
ms.topic: how-to
ms.date: 07/21/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
---

# Provisioned throughput migration

Starting July 29th, 2024, Microsoft is launching improvements to its Provisioned Throughput offering that address customer feedback on usability and operational agility, and that open new payment options and deployment scenarios.

This article is intended for existing users of the provisioned throughput offering. New customers should refer to the [Azure OpenAI provisioned onboarding guide](./how-to/provisioned-throughput-onboarding.md).

## What's changing?

The capabilities below are rolling out for the Provisioned Managed offering.

> [!IMPORTANT]
> The changes in this article do not apply to the older *“Provisioned Classic (PTU-C)”* offering. They only affect the Provisioned (also known as the Provisioned Managed) offering.

### Usability improvements

|Feature | Benefit|
|---|---|
|Model-independent quota | A single quota limit covering all models/versions reduces quota administration and accelerates experimentation with new models |
|Self-service quota requests | Request quota increases without engaging the sales team – many will be auto-approved |
|Default provisioned-managed quota in many regions | Get started quickly in new regions without having to first request quota |
|Transparent information on real-time capacity availability + New deployment flow | Reduced negotiation around where deployments can be accelerates time-to-market |

### New hourly/reservation commercial model

|Feature | Benefit|
|---|---|
|Hourly, uncommitted usage | Hourly payment option without a required commitment enables short-term deployment scenarios |
|Term discounts via Azure Reservations | Azure reservations provide substantial discounts over the hourly rate for 1mo and 1yr terms, and provide flexible scopes that minimize administration and associated with today’s resource-bound commitments.|
| Default provisioned-managed quota in many regions | Get started quickly in new regions without having to first request quota |
| Flexible choice of payment model for existing provisioned customers | Customers with commitments may stay on the commitment model at least through the end of 2024, and can choose to migrate existing commitments to hourly/reservations via a self-service or managed process. |
| Supports latest model generations | The hourly/reservation model will be required to deploy models released after June 28, 2024. |

### Usability improvement details

Provisioned quota granularity is changing from model-specific to model-independent. Rather than each model and version within subscription and region having its own quota limit, there will be a single quota item per subscription and region that limits the total number of PTUs that can be deployed across all supported models and versions.

:::image type="content" source="./media/provisioned/model-independent-quota.png" alt-text="Diagram of model independent quota with one pool of PTUs available to multiple Azure OpenAI models." lightbox="./media/provisioned/model-independent-quota.png":::

The conversion to model-independent quota will be made automatically within 48 hours of launch. Existing customers will not lose any quota in the transition. Existing quota limits will be summed and assigned to a new model-independent quota item.

:::image type="content" source="./media/provisioned/consolidation.png" alt-text="Diagram showing quota consolidation." lightbox="./media/provisioned/consolidation.png":::

The new model-independent quota will show up as a quota item named **Provisioned Managed Throughput Unit**. Model/version is no longer included in the name.  In the Studio Quota pane, expanding the quota item will still show all of the deployments that contribute to the quota item. However, the deployments will include all provisioned managed deployments within the subscription and region.

:::image type="content" source="./media/provisioned/quota.png" alt-text="Screenshot of new quota UI for Azure OpenAI provisioned." lightbox="./media/provisioned/quota.png":::

### Default quota

New and existing subscriptions will be assigned a small amount of provisioned quota in many regions. This allows customers to start using those regions without having to first request quota.

For existing customers, if the region already contains a quota assignment, the quota limit will not be changed for the region. For example, it will not be automatically increased by the new default amount.

### Self-service 
