---
title: 'Azure OpenAI Provisioned August 2024 Update'
titleSuffix: Azure OpenAI
description: Learn about the improvements to Provisioned Throughput
manager: nitinme
ms.service: azure-ai-openai
ms.custom: 
ms.topic: how-to
ms.date: 08/07/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
---

# Azure OpenAI provisioned August 2024 update 

In mid-August, 2024, Microsoft is launching improvements to its Provisioned Throughput offering that address customer feedback on usability and operational agility, and that open new payment options and deployment scenarios.

This article is intended for existing users of the provisioned throughput offering. New customers should refer to the [Azure OpenAI provisioned onboarding guide](../how-to/provisioned-throughput-onboarding.md).

## What's changing?

The capabilities below are rolling out for the Provisioned Managed offering.

> [!IMPORTANT]
> The changes in this article do not apply to the older *“Provisioned Classic (PTU-C)”* offering. They only affect the Provisioned (also known as the Provisioned Managed) offering.

### Usability improvements

|Feature | Benefit|
|---|---|
|Model-independent quota | A single quota limit covering all models/versions reduces quota administration and accelerates experimentation with new models |
|Self-service quota requests | Request quota increases without engaging the sales team – many will be autoapproved |
|Default provisioned-managed quota in many regions | Get started quickly without having to first request quota |
|Transparent information on real-time capacity availability + New deployment flow | Reduced negotiation around availability accelerates time-to-market |

### New hourly/reservation commercial model

|Feature | Benefit|
|---|---|
|Hourly, uncommitted usage | Hourly payment option without a required commitment enables short-term deployment scenarios |
|Term discounts via Azure Reservations | Azure reservations provide substantial discounts over the hourly rate for one month and one year terms, and provide flexible scopes that minimize administration and associated with today’s resource-bound commitments.|
| Default provisioned-managed quota in many regions | Get started quickly in new regions without having to first request quota |
| Flexible choice of payment model for existing provisioned customers | Customers with commitments can stay on the commitment model at least through the end of 2024, and can choose to migrate existing commitments to hourly/reservations via a self-service or managed process. |
| Supports latest model generations | The hourly/reservation model will be required to deploy models released after June 28, 2024. |

### Usability improvement details

Provisioned quota granularity is changing from model-specific to model-independent. Rather than each model and version within subscription and region having its own quota limit, there will be a single quota item per subscription and region that limits the total number of PTUs that can be deployed across all supported models and versions.

Starting August 12, 2024, existing customers will have their current, model-specific quota converted to model-independent. This will happen automatically and be complete by August 14, 2024. No quota will be lost in the transition. Existing quota limits will be summed and assigned to a new model-independent quota item.

:::image type="content" source="../media/provisioned/consolidation.png" alt-text="Diagram showing quota consolidation." lightbox="../media/provisioned/consolidation.png":::

The new model-independent quota will show up as a quota item named **Provisioned Managed Throughput Unit**, with model and version no longer included in the name. In the Studio Quota pane, expanding the quota item will still show all of the deployments that contribute to the quota item. 

### Default quota

New and existing subscriptions will be assigned a small amount of provisioned quota in many regions. This allows customers to start using those regions without having to first request quota.

For existing customers, if the region already contains a quota assignment, the quota limit won't be changed for the region. For example, it will not be automatically increased by the new default amount.

### Self-service quota requests

Customers will no longer obtain quota by contacting their sales teams. Instead, they'll use the self-service quota request form and specify the PTU-Managed quota type. The form is accessible from a link to the right of the quota item. The target is to respond to all quota requests within two business days.  

The Quota screenshot below shows model-independent quota being used by deployments of different types, as well as the link for requesting additional quota. 

:::image type="content" source="../media/provisioned/quota-request-type.png" alt-text="Screenshot of new request type UI for Azure OpenAI provisioned for requesting more quota." lightbox="../media/provisioned/quota-request-type.png":::


## New hourly reservation payment model

> [!NOTE]
> The following discussion of payment models does not apply to the older “Provisioned Classic (PTU-C)” offering.  They only affect the Provisioned (aka Provisioned Managed) offering. Provisioned Classic will continue to be governed by the monthly commitment payment model, unchanged from today.

Microsoft has introduced a new “Hourly/reservation” payment model for provisioned deployments. This is in addition to the current **Commitment** payment model, which will continue to be supported at least through the end of 2024.

### Commitment payment mode (current model)

- Regional, monthly commitment is required to use provisioned (longer terms available contractually)

- Commitments are bound to Azure OpenAI resources, making moving deployments across resources difficult.

- Commitments can't be canceled or altered during their term, except to add new PTUs.

- Supports models released prior to June 29, 2024.

### Hourly reservation payment model

- Payment model aligned with Azure standards for other products.

- Hourly usage is supported, without commitment.

- One month and one year term discounts can be purchased as regional Azure Reservations.

- Reservations can be flexibly scoped to cover multiple subscriptions, and the scope can be changed mid-term.

- Supports all models, both old and new

> [!IMPORTANT]
> **Models released after July 28, 2024 require the use of the Hourly/Reservation payment model.** They are not deployable on Azure OpenAI resources that have active commitments. To deploy models released after July 28, exiting customers must either:
> - Create deployments on new Azure OpenAI resources without commitments.
> - Migrate an existing resources off its commitments.


## Hourly reservation model details

Details on the hourly/reservation model can be found in the [Azure OpenAI Provisioned Onboarding Guide](../how-to/provisioned-throughput-onboarding.md)

### Commitment and hourly reservation coexistence

Customers that have commitments today aren't required to use the hourly/reservation model. They can continue to use existing commitments, purchase new commitments, and manage commitments as they do today.

A customer can also decide to use both payment models in the same subscription/region. In this case, **the payment model for a deployment depends on the resource to which it is attached.**

**Deployments on resources with active commitments will follow the commitment payment model.**

- The monthly commitment purchase will cover the deployed PTUs.

- Hourly overage charges will be generated if the deployed PTUs ever become greater than the committed PTUs.

- All existing discounts attached to the monthly commitment SKU will continue to apply.

- **Azure Reservations DO NOT apply additional discounts on top of the monthly commitment SKU**, however they will apply discounts to any overages (this behavior is new).

- The **Manage Commitments** page in Studio will be used to purchase and manage commitments.

Deployments on resources without commitments (or only expired commitments) will follow the Hourly/Reservation payment model.
- Deployments will generate hourly charges under the new Hourly/Reservation SKU and meter.
- Azure Reservations can be purchased to discount the PTUs for deployments.
- Reservations are purchased and managed from the Reservation blade of the Azure portal (not within Studio).

If a deployment is on a resource that has a commitment, and that commitment expires. The deployment will automatically shift to be billed  

### Changes to the existing payment mode

Customers that have commitments today can continue to use them at least through the end of 2024. This includes purchasing new PTUs on new or existing commitments and managing commitment renewal behaviors. However, the changes on July 29, 2024 will change these aspects of commitment operation.

- Only models released as provisioned July 28, 2024 or before can be deployed on a resource with a commitment.

- Overage charges will be emitted against the hourly SKU used for the hourly/reservations model, allowing the overage charges to be discounted by an Azure Reservation if one exists.

## Migrating existing resources off commitments

Existing customers can choose to migrate their existing resources from the Commitment to the Hourly/Reservation payment model to benefit from the ability to deploy the latest models, or to consolidate discounting for diverse deployments under a single reservation.

Two approaches are available for customers to migrate resources using the Commitment model to the Hourly/Reservation model.

### Self-service migration

The self-service migration approach allows a customer to organically resources off of their commitments by allowing them to expire. The process to migrate a resource is as follows:

- Set existing commitment to not autorenew and note the expiration date.

- Before the expiration date, a customer should purchase an Azure Reservation covering the total number of committed PTUs per subscription. If an existing reservation already has the subscription in its scope, it can be increased in size to cover the new PTUs.

- When the commitment expires, the deployments under the resource will automatically switch to the Hourly/Reservation mode with the usage discounted by the reservation.

This self-service migration approach will result in an overlap where the reservation and commitment are both active. This is a characteristic of this migration mode and the reservation or commitment time for this overlap won't be credited back to the customer.

An alternative approach to self-service migration is to switch the reservation purchase to occur after the expiration of the commitment. In this approach, the deployments will generate hourly usage for the period between the commitment expiration and the purchase of the reservation. As with the previous model, this is a characteristic of this approach, and this hourly usage won't be credited.

**Self-service migration advantages:**

* Individual resources can be migrated at different times.
* Customers manage the migration without any dependencies on Microsoft.

**Self-service migration disadvantages:**

* There will be a short period of double-billing or hourly charges during the switchover from committed to hourly/reservation billing.

> [!IMPORTANT]
> Both self-service approaches will generate some additional charges as the payment mode is switched from Committed to Hourly/Reservation.  These are characteristics of the migration approaches and customers will not be credited for these charges.  Customers may choose to use the managed migration approach described below to avoid them.

### Managed migration

The managed migration approach involves the customer partnering with Microsoft to bulk-migrate all the PTU commitments in a subscription/region at the same time. It works like this:

1. The customer will engage their account team and request a managed migration. A migration owner from the Microsoft team will be assigned to assist the customer with migration.
2. A date will be selected when all resources within each of the customers' subscriptions and regions containing current PTU commitments will be migrated from committed to hourly/reservation billing model. Multiple subscriptions and regions can be migrated on the same date.
3. On the agreed-upon date:
    * The customer will purchase regional reservations to cover the committed PTUs that will be converted and pass the reservation information to their Microsoft migration contact.
    * Within 2-3 business days, all commitments will be proactively canceled and deployments previously under commitments will begin using the hourly/reservation payment model.
    * In the billing period after the one with the reservation purchase, the customer will receive a credit for the reservation purchase covering the portions of the commitments that were canceled, starting from the time of the reservation purchase.

Customers must reach out to their account teams to schedule a managed migration.

**Managed migration advantages:**

- Bulk migration of all commitments in an subscription/region is beneficial for customers with many commitments.
- Seamless cost migration: No possibility of double-billing or extra hourly charges.

**Managed migration disadvantages:**

- All commitments in a subscription/region must be migrated at the same time.
- Needing to coordinate a time for migration with the Microsoft team.

 


