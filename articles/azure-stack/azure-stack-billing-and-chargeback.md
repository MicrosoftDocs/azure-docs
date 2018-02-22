---
title: Customer Billing And Chargeback In Azure Stack | Microsoft Docs
description: Learn how to retrieve resource usage information from Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/21/2018
ms.author: mabrigg
ms.reviewer: alfredop

---
# Usage and billing in Azure Stack

This article describes how Azure Stack users are billed for resource usage. You can learn how the billing information is accessed for analytics and charge-backs.

Each Microsoft Azure subscription incurs charges for resource consumption in Microsoft Azure Stack. Azure allows users with a subscription to deploy infrastructure and services in Microsoft run datacenters. Azure then tracks the resource consumption. Azure directly invoices cloud customers based on their usage.

Azure Stack allows you to host a private instance of Azure on hardware in your own datacenter. Yet, each user must have an Azure subscription so that they can use resources on the instance of Azure Stack that you host. Where Microsoft incurs the cost of running the datacenter with Azure, the owner of Azure Stack bears this responsibility. But usage data is still collected and stored in Microsoft Azure.

Azure Stack collects and groups usage data for all resources, and forwards this data to Azure Commerce. You can get usage data and export it to your own billing system by using a billing adapter, or export it to a business intelligence tool such as Microsoft Power BI. After getting the data, you can use this billing information for analytics or transferred to your charge-back system.

## Usage pipeline

Each resource provider in Azure Stack emits usage data per resource usage. The Usage Service periodically(hourly and daily) aggregates usage data and stores it in the usage database. Azure Stack operators and users can locally access the stored usage data through the Azure Stack Resource Usage APIs.

If you have [Registered your Azure Stack instance with Azure](azure-stack-register.md), Usage Bridge is configured to send the usage data to Azure Commerce. After the data is available in Azure, you can access it through the billing portal or by using  Azure Resource Usage APIs. Refer to the [Usage data reporting](azure-stack-usage-reporting.md) topic to learn more about what usage data is reported to Azure. 

The following image shows the key components in the usage pipeline:

![Usage pipeline](\media\azure-stack-billing-and-chargeback\usagepipeline.png)

## What usage information can I find, and how?

Azure Stack Resource providers, such as Compute, Storage, and Network, generate usage data at hourly intervals for each subscription. The usage data contains information about the resource used such as resource name, subscription used, and quantity used. To learn about the meters ID resources, refer to the [usage API FAQ](azure-stack-usage-related-faq.md) article. 

After the usage data has been collected, it is [reported to Azure](azure-stack-usage-reporting.md) to generate a bill, which can be viewed through the Azure billing portal.

> [!NOTE]
> Usage data reporting is not required for Azure Stack Development Kit and for Azure Stack integrated system users who license under the capacity model. To learn more about licensing in Azure Stack, see the [Packaging and pricing](https://azure.microsoft.com/mediahandler/files/resourcefiles/5bc3f30c-cd57-4513-989e-056325eb95e1/Azure-Stack-packaging-and-pricing-datasheet.pdf) data sheet.

The Azure billing portal shows usage data for the chargeable resources. In addition to the chargeable resources, Azure Stack captures usage data for a broader set of resources, which you can access in your Azure Stack environment through REST APIs or PowerShell. Azure Stack operators can get the usage data for all user subscriptions. Individual users can only get their usage details.

## Usage reporting for multitenant Cloud Service Providers

A multitenant Cloud Service Provider (CSP), who has many customers using Azure Stack, may want to report each customer usage separately so that the provider can charge usage to different Azure subscriptions.

Each customer is going to have their identity represented by a different Azure Active Directory (Azure AD) tenant. Azure Stack supports assigning one CSP subscription to each Azure AD tenant. You can add tenants and their subscriptions to the *base* Azure Stack registration. The base registration is done for all Azure Stacks. If a subscription isn't registered for a tenant, the user can still use Azure Stack, and their usage will be sent to the subscription used for the base registration.

## Next steps

[Register with Azure Stack](azure-stack-registration.md)

[Report Azure Stack usage data to Azure](azure-stack-usage-reporting.md)

[Provider Resource Usage API](azure-stack-provider-resource-api.md)

[Tenant Resource Usage API](azure-stack-tenant-resource-usage-api.md)

[Usage-related FAQ](azure-stack-usage-related-faq.md)