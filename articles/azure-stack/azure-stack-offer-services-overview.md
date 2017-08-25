---
title: Offering services in Azure Stack | Microsoft Docs
description: As a cloud operator, you can offer services to your users.
services: azure-stack
documentationcenter: ''
author: ErikjeMS
manager: byronr
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/25/2017
ms.author: erikje

---
# Overview of offering services in Azure Stack

Microsoft Azure Stack is a hybrid cloud platform that lets you deliver services from your datacenter. As a service provider, you can offer services to your tenants. Within a business or government agency, you can offer on-premises services to your employees. The services that you can deliver include, but are not limited to:

- Platform as a Service (PaaS) services like App Services, Mobile Apps, API Apps, API Functions, SQL, MySQL.
- Software as a Service (SaaS) services like Sharepoint.

You can even combine services to integrate and build complex solutions for different users.

To deliver these services to your users, you must create [plans, offers, and quotas](azure-stack-plan-offer-quota-overview.md). Your users can then subscribe to your offers to use the services.

## Plan your service offers

When you’re planning your offers, keep the following points in mind:

**Trial offers**: You can use trial offers to attract new users, who can then upgrade to additional services. To create a trial offer, create a small [base plan](azure-stack-plan-offer-quota-overview.md#base-plan) with an optional larger add-on plan.

**Capacity planning**: You might be concerned about users grabbing large amounts of resources and clogging the system for all users. To help performance, you can [configure your plans with quotas](azure-stack-plan-offer-quota-overview.md#plans) to cap usage.

**Delegated providers**: You can grant others the ability to create offers in your environment. For example, if you’re a service provider, you can [delegate](azure-stack-delegated-provider.md) this ability to your resellers. Or, if you’re an organization, you can delegate to other divisions/subsidiaries.

## Next steps
[Learn more about offers, plans, quotas, and subscriptions](azure-stack-plan-offer-quota-overview.md)

