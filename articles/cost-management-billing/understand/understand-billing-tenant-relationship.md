---
title: Understand the Billing and Tenant Relationship
description: Learn about the billing and tenant relationship in Azure, and how it affects your billing and subscription management.
keywords: billing tenant,azure billing,subscription management,billing relationship
author: chrisdoofer
ms.reviewer: jkinma
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 09/07/2025
ms.author: chbenne
service.tree.id: 95459a4b-434c-4f83-879b-aa5f509fc7fa
---

# Billing and tenant relationship

As you plan for and manage your Azure subscriptions, understand the relationship between billing and your tenant account or accounts.

## Customer to contract

We recommend that you sign only one contract with Microsoft. But in theory, you can sign multiple contracts with us at the same time.

For example, during a transition period from an Enterprise Agreement (EA) to Microsoft Customer Agreement (MCA), an organization can have an active EA and an active MCA contract. During merger and acquisition (M&A) activities, an organization might end up with multiple EA or MCA contracts.

Every contract is associated with a price sheet specific to a customer. This association determines the individual customer prices in the agreed billing currency. In an MCA, the default associated price sheet equals the Azure retail price list in US currency (USD). You can access the price sheet in the Azure portal.

### Microsoft Azure Consumption Commitment

Your organization might decide to sign a Microsoft Azure Consumption Commitment (MACC). There's usually a 1:1 relationship between a contract and a MACC. As a benefit of this commitment, you might get discounted pricing on Azure resources (usage). The discount is reflected in the price sheet associated with the contract.

### Billing roles

With both EA and MCA contracts, you can manage certain aspects of the contract with *billing roles*. There's a key difference between billing roles for an EA account and those for an MCA account. In an EA account, you can associate any valid work, school, or Microsoft account to EA billing roles. In an MCA account, you can associate only work accounts of an approved tenant to billing roles.

## Contract to tenant

To manage billing roles, you must associate exactly one Microsoft Entra ID tenant with the contract. You must complete this association at the time the contract is set up. You can then assign billing roles to identities within this tenant and contract.

With this association of tenant and contract, for example:

- In EA, a user from the contoso.com tenant can be assigned to the EA admin role in Contoso's EA contract.

- In MCA, this tenant is called the *primary billing tenant*. Only users from this tenant can be assigned to billing roles within the MCA contract.

> [!IMPORTANT]
> In the hierarchy of roles, the tenant global administrator is above the billing account administrator. Global administrators in a Microsoft Entra ID tenant can add or remove themselves as billing account administrators at any time to the Microsoft Customer Agreement.

If you want to assign identities from tenants other than the primary billing tenant, you can add associated billing tenants.

We recommend that you use only a single tenant, but you're not restricted from creating multiple tenants within a contract.

## Contract to subscription

You use your Azure subscription to provision and manage Azure resources. You get access to Azure resources because of a trust relationship to a Microsoft Entra ID tenant. You get billed according to your contract with Microsoft (EA or MCA).

Every subscription can only have one billing relationship to one contract. This billing relationship can be moved to a different contract based on certain conditions (for example, in EA/MCA transition scenarios or M&A scenarios). Every contract can manage 5,000 subscriptions by default.

The billing relationship determines the prices for the consumed resources within the subscription. If you have a subscription that is associated with a contract that uses Azure retail prices, you pay the retail price. If the associated contract has customer specific prices (for example, by signing a MACC with applicable discounts), the resources within this subscription are charged at these prices.

### Subscription to tenant

Every subscription has a 1:1 trust relationship to a Microsoft Entra ID tenant. This trust relationship determines which identities can manage the resources within the subscription.

### Tenant to subscription

Every tenant can manage trust relationships with an unlimited number of subscriptions. These subscriptions can use billing relationships to multiple contracts, which might lead to different prices for resources deployed to these subscriptions.

## Detailed diagram

The following diagram shows the relationship between a billing contract and associated tenant and subsequent subscriptions.

:::image type="content" source="./media/understand-billing-tenant-relationship/azure-billing-tenant-relationship.png" alt-text="Diagram that shows the relationship between a billing contract and associated tenant and subsequent subscriptions." border="false":::
