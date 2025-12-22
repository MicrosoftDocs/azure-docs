---
title: Understand the billing tenant relationship
description: Learn about the billing tenant relationship in Azure and how it affects your billing and subscription management.
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

:::image type="content" source="./media/understand-billing-tenant-relationship/azure-billing-tenant-relationship.png" alt-text="Diagram that shows the relationship between a billing contract and associated tenant and subsequent subscriptions." border="false":::

## Customer to contract

Customer Organizations can sign multiple contracts with Microsoft. Even though it is advised to have a 1:1 relationship between Customer and Microsoft contract, Customer's can theoretically use multiple contracts at the same time.

### Example

The best example for this scenario is during a transition period from an Enterprise Agreement (EA) to Microsoft Customer Agreement (MCA), where the customer has an active EA and an active MCA contract. During merger and acquisition (M&A) activities, a customer organization might end up with multiple EA or MCA contracts.

## Contract to price sheet

Every contract is associated with a customer specific price sheet. This determines the individual customer prices in the agreed billing currency. In an MCA, the default associated price sheet equals the Azure Retail price list in USD. The price sheet can be accessed in the Azure portal.

## Contract to Microsoft Azure Consumption Commitment (MACC)

Customers can sign a MACC. There is usually a 1:1 relationship between a contract and a MACC. As a benefit of this commitment, Customers might get discounted pricing on Azure Resources (usage). The discount is reflected in the price sheet associated with the contract.

## Contract to billing roles

Both EA and MCA provide Customers with roles, that can manage certain aspects of the contract. These roles are called billing roles. Billing roles differ from EA to MCA and are described in detail here for EA and here for MCA. A key difference between EA and MCA is, that Customers can associate any valid work, school, or Microsoft account to EA billing roles but only work accounts of an approved tenant for MCA.

## Contract to tenant

To manage billing roles, customers must associate exactly one Entra ID tenant with the contract, this action must be completed at the time the contract is setup. Identities within this Tenant can be assigned to billing roles within the contract.

### Example

User Dirk from the contoso.com tenant can be assigned to the EA admin role in Contoso’s EA contract.

In MCA, this tenant is called the primary billing tenant. Only users from this tenant can be assigned to billing roles within the MCA contract.

⚠️ **Warning**
The tenant global administrator role is above the billing account administrator. Global administrators in a Microsoft Entra ID tenant can add or remove themselves as billing account administrators at any time to the Microsoft Customer Agreement.

If you want to assign identities from tenants other than the primary billing tenant, you can add associated billing tenants.

ℹ️ **Information**
Even though customers should strive for a single tenant, there is no restriction in how many tenants a customer can create within a contract.

## Contract to subscription

An Azure subscription is a logical container used to provision and manage Azure resources. Resource access is managed through a trust relationship to an Entra ID tenant and billing is managed via a billing relationship to a Microsoft contract (EA or MCA). Every subscription can only have one billing relationship to one contract. This billing relationship can be moved to a different contract based on certain conditions (for example, in EA/MCA transition scenarios or M&A scenarios).

Every contract can manage 5000 subscriptions by default.

ℹ️ **Information**
The billing relationship determines the prices for the consumed resources within the subscription. If you have a subscription that is associated with a contract that uses Azure retail prices you pay the retail price. If the associated contract has customer specific prices (for example, by signing a MACC with applicable discounts), the resources within this subscription are charged at these prices.

## Subscription to tenant

Every subscription has a 1:1 trust relationship to an Entra ID tenant. This trust relationship determines, which identities can manage the resources within the subscription.

## Tenant to subscription

Every tenant can manage trust relationships with virtually unlimited number of subscriptions. These subscriptions can use billing relationships to multiple contracts, which might lead to different prices for resources deployed to these subscriptions.
