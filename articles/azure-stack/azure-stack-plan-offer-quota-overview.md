---
title: Azure Stack plan, offer, quota, and subscription overview | Microsoft Docs
description: As a cloud operator, I want to understand Azure Stack plans, offers, quotas, and subscriptions.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid: 3dc92e5c-c004-49db-9a94-783f1f798b98
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 10/12/2018
ms.author: sethm
ms.reviewer:

---
# Plan, offer, quota, and subscription overview

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

[Azure Stack](azure-stack-poc.md) lets you deliver a wide variety of services, like virtual machines, SQL Server databases, SharePoint, Exchange, and even [Azure Marketplace items](azure-stack-marketplace-azure-items.md). As an Azure Stack operator, you configure and deliver such services in Azure Stack by using plans, offers, and quotas.

Offers contain one or more plans, and each plan includes one or more services. By creating plans and combining them into different offers, you can manage:

- Which services and resources your users can access.
- The amount of resources that users can consume.
- Which regions have access to the resources.

When you deliver a service, follow these high-level steps:

1. Add a service that you want to deliver to your users.
2. Create a plan that has one or more services. When creating a plan, select or create quotas that define the resource limits of each service in the plan.
3. Create an offer that contains one or more plans. The offer can include base plans and optional add-on plans.

After you've created the offer, your users can subscribe to it to access the services and resources the offer provides. Users can subscribe to as many offers as they want. The following figure shows a simple example of a user who has subscribed to two offers. Each offer has a plan or two, and each plan gives them access to services.

![Tenant subscription with offers and plans](media/azure-stack-key-features/image4.png)

## Plans

Plans are groupings of one or more services. As an Azure Stack operator, you [create plans](azure-stack-create-plan.md) to offer to your users. In turn, your users subscribe to your offers to use the plans and services they include. When creating plans, make sure to set your quotas, define your base plans, and consider including optional add-on plans.

### Quotas

To help you manage your cloud capacity, you can use pre-configured *quotas*, or create a new quota for each service in a plan. Quotas define the upper resource limits that a user subscription can provision or consume. For example, a quota might allow a user to create up to five virtual machines (VMs).

You can configure quotas by region. For example, a plan that provides compute services for Region A could have a quota of two VMs.

>[!NOTE]
>In the Azure Stack Development Kit, only one region (named *local*) is available.

Learn more about [quota types in Azure Stack](azure-stack-quota-types.md).

### Base plan

When creating an offer, the service administrator can include a base plan. These base plans are included by default when a user subscribes to that offer. When a user subscribes, they have access to all the resource providers specified in those base plans (with the corresponding quotas).

### Add-on plans

Add-on plans are optional plans you add to an offer. Add-on plans are not included by default in the subscription. Add-on plans are additional plans (with quotas) available in an offer that a subscriber can add to their subscriptions. For example, you can offer a base plan with limited resources for a trial, and an add-on plan with more substantial resources to customers who decide to adopt the service.

## Offers

Offers are groups of one or more plans that you create so that users can subscribe to them. For example, Offer Alpha can contain Plan A, which provides a set of compute services and Plan B, which provides a set of storage and network services.

When you [create an offer](azure-stack-create-offer.md), you must include at least one base plan, but you can also create add-on plans that users can add to their subscription.

## Subscriptions

A subscription is how users access your offers. If you're an Azure Stack operator for a service provider, your users (tenants) buy your services by subscribing to your offers. If you're an Azure Stack operator at an organization, your users (employees) can subscribe to the services you offer without paying.

Each combination of a user with an offer is a unique subscription. A user can have subscriptions to multiple offers, but each subscription only applies to one offer. Plans, offers, and quotas only apply to a unique subscription – they can’t be shared between subscriptions. Each resource that a user creates is associated with one subscription.

### Default provider subscription

The default provider subscription is automatically created when you deploy the Azure Stack Development Kit. This subscription can be used to manage Azure Stack, deploy additional resource providers, and create plans and offers for users. For security and licensing reasons, it should not be used to run customer workloads and applications.

## Next steps

For more information about plans and offers, see [Create a plan](azure-stack-create-plan.md).
