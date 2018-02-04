---
title: Register to track billing usage in Azure Stack | Microsoft Docs
description: Type the description in Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/05/2018
ms.author: mabrigg
ms.reviewer: alfredo

---

# Register to track billing utilization in Azure Stack

*Applies to: Azure Stack integrated systems*

Determine the type of shared services tenant you use for the Azure Stack registration. Then register Azure Stack with the Azure shared services tenant.

Once your register Azure Stack with your shared services tenant, you may require operators and users using resources to register with Azure with their own tenant. Although there is no charge to deploy Azure Stack, charges accrue in proportion to actual usage. Microsoft sells Azure Stack on a pay-per-use basis. The services that Microsoft charges for include virtual machines (VMs), storage, and a platform-as-a service (PaaS) such as AppService.

## Choose an Azure shared services tenant for Azure Stack

Determine the type of shared services tenant you use for the Azure Stack registration. In most cases, you will want to use a PSS subscription. The only exception is Indirect Cloud Service Providers (CSP)s. The types of shared services tenant that can be used for registration are:

 - Cloud Solution Provider
 - Partner Shared Services subscription

> [!Note]  
> Each registration is specific to one Azure Stack deployment. If you deploy more than one Azure Stack, each needs to be registered. Tenants need to register with each Azure Stack they use.

### Cloud Solution Provider subscriptions

Cloud Solution Provider (CSP) subscriptions are the preferred choice for registration when a CSP Reseller or an end user operates the Azure Stack.

### Partner Shared Services subscription

Partner Shared Services subscriptions (CSPSS) are the preferred choice for registration when a Direct CSP or a CSP Distributor operates the Azure Stack.

## Get an Azure subscription

You need an account, credentials, and a subscription in a Shared Services tenant.

How to do I this?

<!-- You need the shared services tenant ID for an Azure subscription. For steps on setting up a shared services tenant and to get your ID, see [Add Azure Partner Shared Services](https://msdn.microsoft.com/en-us/partner-center/shared-services). -->

## Register Azure Stack with an Azure subscription

Associate Azure Stack with the Azure shared services tenant as soon as you have completed the deployment of an Azure Stack in order to configure usage reporting. Azure Stack utilization is charged to the associated subscription. Make a note of the name of the Registration ID, as it will be needed for future updates.

To register the Azure subscription with Azure Stack, follow the steps at [Register Azure Stack with your Azure Subscription](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-register).

> [!Note]  
CSPSS subscriptions are associated with a shared services tenant. When you register Azure Stack, you need to provide credentials for an account that is an owner of the subscription. The account you use to register Azure Stack can be different from the administrator account that you use for deployment; the two do **not** need to belong to the same domain. In other words, you can use one tenant for deploying and operating Azure Stack and then register utilization for billing with a different tenant, for example IURContosoCSP.onmicrosoft.com. Remember to sign in with ContosoCSP.onmicrosoft.com when you do day-to-do Azure Stack administration. And sign in to Azure using IURContosoCSP.onmicrosoft.com when you need to do registration operations.

## Next steps

 - To learn about The Azure Stack billing infrastructure, see [Usage report infrastructure in Azure Stack](azure-stack-csp-register-azure-stack.md).
 - To learn about registering for multiple tenants in Azure Stack, see  [Enable multitenancy for Azure Stack](azure-stack-csp-register-azure-stack.md).
