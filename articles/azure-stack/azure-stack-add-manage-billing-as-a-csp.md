---
title: Manage usage and billing for Azure Stack as a Cloud Service Provider | Microsoft Docs
description: A walk through registering Azure Stack as a Cloud Provider (CSP) and adding customers for billing.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/15/2018
ms.author: sethm
ms.reviewer: alfredo

---

# Manage usage and billing for Azure Stack as a Cloud Service Provider 

*Applies to: Azure Stack integrated systems*

This article walks you through registering Azure Stack as a Cloud Provider (CSP) and adding customers.

As a CSP you work with diverse customers using your Azure Stack. Each customer has a CSP subscription in Azure. You'll need to direct usage from your Azure Stack to each user subscription.

The following diagram shows the steps that you will need to choose your shared services account and register the Azure account with the Azure Stack account. Registered, you can onboard your end customers.

**Steps to add usage tracking as a CSP**

[ ![Process for enabling usage and management as a Cloud Service Provider](media\azure-stack-add-manage-billing-as-a-csp\process-add-useage-as-a-csp.png "Process for enabling usage and management as a Cloud Service Provider") ](media\azure-stack-add-manage-billing-as-a-csp\process-add-useage-as-a-csp.png#lightbox)

## Create a CSP or APSS subscription

### Cloud Service Provider subscription types

You will need to choose the type of shared services account that you use for Azure Stack. The types of subscriptions that can be used for registration of a multitenant Azure Stack are:

 - Cloud Service Provider 
 - Partner Shared Services subscription 

#### Azure Partner Shared Services

Azure Partner Shared Services (APSS) subscriptions are the preferred choice for registration when a Direct CSP or a CSP Distributor operates Azure Stack.

APSS subscriptions are associated with a shared-services tenant. When you register Azure Stack, you need to provide credentials for an account that is an owner of the subscription. The account you use to register Azure Stack can be different from the administrator account that you use for deployment. Furthermore, the two accounts do *not* need to belong to the same domain. In other words, you may deploy using the tenant that you already use. For example you may use ContosoCSP.onmicrosoft.com, then register using a different tenant, for example IURContosoCSP.onmicrosoft.com. You will need to remember that you sign in using ContosoCSP.onmicrosoft.com when you do day-to-do Azure Stack administration. When you sign in to Azure using IURContosoCSP.onmicrosoft.com when you need to do registration operations.

Refer to the following for a description of APSS subscriptions, and instructions on how to create subscription [Add Azure Partner Shared Services](https://msdn.microsoft.com/partner-center/shared-services).

#### CSP subscriptions

Cloud Service Provider (CSP) subscriptions are the preferred choice for registration when a CSP reseller or an end customer operates  Azure Stack.

## Register Azure Stack

Use the APSS subscription created following the information in the preceding section to register Azure Stack with Azure. For more information, see [Register Azure Stack with your Azure Subscription](azure-stack-registration.md).

## Add end customer

To configure Azure Stack so that when a new tenant uses resources their usage will be reported to their Cloud Service Provider (CSP) subscription, see [Add tenant for usage and billing to Azure Stack](azure-stack-csp-howto-register-tenants.md).

## Charge the right subscriptions

Azure Stack uses a feature called registration. A registration is an object stored in Azure. The registration object documents which Azure subscription(s) to use to charge for a given Azure Stack. This section addresses the importance of registration.

Using registration Azure Stack can:
 - Forward Azure Stack usage data to Azure Commerce and bill an Azure subscription.
 - Report each customer’s usage on a different subscription with a multitenant Azure Stack deployment. Multitenancy enables Azure Stack to support different organizations on the same Azure Stack instance.

For each Azure Stack, there is one default subscription and many tenant subscriptions. The default subscription is an Azure subscription that is charged if there isn't a tenant-specific subscription. It must be the first to subscription registered. For multi-tenant usage reporting to work, the subscription must be a CSP or APSS subscription.

Then, the registration is updated with an Azure subscription for each tenant that is going to use Azure Stack. Tenant subscriptions must be of the CSP type and must roll up to the partner who owns the default subscription. In other words, you cannot register someone else’s customers.

When Azure Stack forwards usage information to global Azure, a service in Azure consults the registration and maps each tenant’s usage to the appropriate tenant subscription. If a tenant has not been registered, that usage goes to the default subscription for the Azure Stack instance from which it originated.

Since tenant subscriptions are CSP subscriptions, their bill is sent to the CSP partner, and usage information is not visible to the end customer.

## Next steps

 - To learn more about the CSP program, see [Cloud Solution Provider program](https://partner.microsoft.com/solutions/microsoft-cloud-solutions).
 - To learn more about how to retrieve resource usage information from Azure Stack, see [Usage and billing in Azure Stack](azure-stack-billing-and-chargeback.md).
