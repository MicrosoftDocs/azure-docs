---
title: Azure Stack plan, offer, quota, and subscription overview | Microsoft Docs
description: As a cloud operator, I want to understand Azure Stack plans, offers, quotas, and subscriptions.
services: azure-stack
documentationcenter: ''
author: ErikjeMS
manager: byronr
editor: ''

ms.assetid: 3dc92e5c-c004-49db-9a94-783f1f798b98
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 8/22/2017
ms.author: erikje

---
# Plan, offer, quota, and subscription overview

*Applies to: Azure Stack Development Kit*

[Azure Stack](azure-stack-poc.md) lets you deliver a wide variety of services, like virtual machines, SQL Server databases, SharePoint, Exchange, and even [Azure Marketplace items](azure-stack-marketplace-azure-items.md). As a cloud operator, you configure and deliver such services in Azure Stack by using plans, offers, and quotas.

Offers contain one or more plans, and each plan includes one or more services. By creating plans and combining them into different offers, you control
- which services and resources users can access
- the amount of those resources that users can consume
- which regions have access to the resources

When you deliver a service, you'll follow these high-level steps:

1. Add a service that you want to deliver to your users.
2. Create a plan that contains one or more services. When creating a plan, you will select or create quotas that define the resource limits of each service in the plan.
3. Create an offer that contains one or more plans (including base plans and optional add-on plans).

After you have created the offer, your users can subscribe to it to access the services and resources it provides. Users can subscribe to as many offers as they want. The following diagram shows a simple example of a user who has subscribed to two offers. Each offer has a plan or two, and each plan gives them access to services.

![](media/azure-stack-key-features/image4.png)

## Plans

Plans are groupings of one or more services. As a cloud operator, you [create plans](azure-stack-create-plan.md) to offer to your users. In turn, your users subscribe to your offers to use the plans and services they include. When creating plans, make sure to set your quotas, define your base plans, and consider including optional add-on plans.

### Quotas

To help you manage your cloud capacity, you select or create a quota for each service in a plan. Quotas define the upper resource limits that a user subscription can provision or consume. For example, a quota might allow a user to create up to five virtual machines. Quotas can limit a variety of resources, like virtual machines, RAM, and CPU limits.

Quotas can be configured by region. For example, a plan containing compute services from Region A could have a quota of two virtual machines, 4-GB RAM, and 10 CPU cores. In the Azure Stack Development Kit, only one region (named *local*) is available.

### Base plan

When creating an offer, the service administrator can include a base plan. These base plans are included by default when a user subscribes to that offer. When a user subscribes, they have access to all the resource providers specified in those base plans (with the corresponding quotas).

### Add-on plans

You can also include optional add-on plans in an offer. Add-on plans are not included by default in the subscription. Add-on plans are additional plans (with quotas) available in an offer that a subscriber can add to their subscriptions. For example, you can offer a base plan with limited resources for a trial, and an add-on plan with more substantial resources to customers who decide to adopt the service.

## Offers

Offers are groups of one or more plans that you create so that users can subscribe to them. For example, Offer Alpha can contain Plan A containing a set of compute services and Plan B containing a set of storage and network services. 

When you [create an offer](azure-stack-create-offer.md), you must include at least one base plan, but you can also create add-on plans that users can add to their subscription.


## Subscriptions

A subscription is how users access your offers. If you’re a cloud operator at a service provider, your users (tenants) buy your services by subscribing to your offers. If you’re a cloud operator at an organization, your users (employees) can subscribe to the services you offer without paying. Each combination of a user with an offer is a unique subscription. Thus, a user can have subscriptions to multiple offers, but each subscription applies to only one offer. Plans, offers, and quotas apply only to each unique subscription – they can’t be shared between subscriptions. Each resource that a user creates is associated with one subscription.


### Default provider subscription

The Default Provider Subscription is automatically created when you deploy the Azure Stack Development Kit. This subscription can be used to manage Azure Stack, deploy further resource providers, and create plans and offers for users. For security and licensing reasons, it should not be used to run customer workloads and applications. 

## Next steps

[Create a plan](azure-stack-create-plan.md)
