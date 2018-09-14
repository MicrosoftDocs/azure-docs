---
title: Usage reporting infrastructure for Cloud Service Providers for Azure Stack | Microsoft Docs
description: Azure Stack includes the infrastructure needed to track usage for tenants serviced by a Cloud Service Provider (CSP) as it occurs and forwards it to Azure.
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
ms.date: 07/12/2018
ms.author: sethm
ms.reviewer: alfredo

---
## Usage reporting infrastructure for Cloud Service Providers

Azure Stack includes the infrastructure needed to track usage as it occurs and forwards it to Azure. In Azure, Azure Commerce processes the usage data and charges usage to the appropriate Azure subscriptions. This happens in the same way as usage tracking is monitored in the global Azure cloud.

You should note that certain concepts are consistent between global Azure and Azure Stack. Azure Stack has local subscriptions, which fulfill a similar role to an Azure subscription. Local subscriptions are only valid locally. Local subscriptions are mapped to Azure subscriptions when usage is forwarded to Azure.

Azure Stack has local usage meters. Local usage is mapped to the meters used in Azure commerce. However, the meter IDs are different. There are more meters available locally than the one Microsoft uses for billing.

There are some differences between how services are priced in Azure Stack and Azure. For example, in Azure Stack, the charge for VMs is only based on vcore/hours, with the same rate for all VM series, unlike Azure. The reason is that in global Azure the different prices reflect different hardware. In Azure Stack, the customer provides the hardware, so there is no reason to charge different rates for different VM classes.

You can find out about the Azure Stack meters used in Commerce and their prices in Partner Center, in the same way as you would for Azure services:

1. In Partner Center, go to the **Dashboard menu** > **Pricing and offers**.
2. Under **Usage-based services**, select **Current**.
3. Open the **Azure in Global CSP price list** spreadsheet.
4. Filter on **Region = Azure Stack**.

## Usage and billing error codes

The following error messages can be encountered when adding tenants to a registration.

| Error                           | Details                                                                                                                                                                                                                                                                                                                           | Comments                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|---------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| RegistrationNotFound            | The provided registration was not found. Make sure the following information was provided correctly:<br>1. Subscription Identifier (value provided: _subscription identifier_),<br>2. Resource Group (value provided: _resource group_),<br>3. Registration Name (value provided: _registration name_).                             | This error usually occurs when the information pointing to the initial registration is not correct. If you need to verify the resource group and name of your registration, you can find it in the Azure portal, by listing all resources. If you find more than one registration resource, look at the CloudDeploymentID in the properties, and select the registration whose CloudDeploymentID matches that of your cloud. To find the CloudDeploymentID, you can use this PowerShell on the Azure Stack:<br>`$azureStackStampInfo = Invoke-Command -Session $session -ScriptBlock { Get-AzureStackStampInformation }` |
| BadCustomerSubscriptionId       | The provided _customer subscription identifier_ and the _registration name_ Subscription Identifier are not owned by the same Microsoft Cloud Service Provider. Check that the Customer Subscription Identifier is correct. If the problem persists, contact support. | This error occurs when the customer subscription is a CSP subscription, but it rolls up to a CSP partner different from the one to which the subscription used in the initial registration rolls up. This check is made to prevent a situation that would result in billing a CSP partner who is not responsible for the Azure Stack used.                                                                                                                                                                                                                                                                          |
| InvalidCustomerSubscriptionId   | The '_customer subscription identifier_' is not valid. Make sure a valid Azure subscription is provided.                                                                                                                                                                         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| CustomerSubscriptionNotFound    | _Customer subscription identifier_ was not found under _registration name. Make sure a valid Azure subscription is being used and that the Subscription Identifier was added to the registration using the PUT operation.                                                   | This error occurs when trying to verity that a tenant has been added to a subscription, and the customer subscription is not found to be associated with the registration. The customer has not been added to the registration, or the subscription ID has been written incorrectly.                                                                                                                                                                                                                                                                                                                                |
| UnauthorizedCspRegistration     | The provided _registration name_ is not approved to use multi-tenancy. Send an email to azstCSP@microsoft.com and include your registration name, resource group, and the subscription identifier used in the registration.                                                                                    | A registration needs to be approved for multi-tenancy by Microsoft before you can start adding tenants to it. Refer to the section Registering Tenants in this document for further explanation.                                                                                                                                                                                                                                                                                                                                                                                                             |
| CustomerSubscriptionsNotAllowed | Customer Subscriptions operations are not supported for disconnected customers. In order to use this feature, re-register with Pay As You Use licensing.                                                                                                                                                                    | The registration to which you are trying to add tenants is a Capacity registration, that is, when the registration was created, the parameter BillingModel Capacity was used. Only Pay as you use registrations are allowed for to add tenants. You need to re-register using the parameter BillingModel PayAsYouUse.                                                                                                                                                                                                                                                                                          |
| InvalidCSPSubscription          | The provided _customer subscription identifier_ is not a valid CSP subscription. Make sure a valid Azure subscription is provided.                                                                                                                                                        | This is mostly likely to be due to the customer subscription being mistyped.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| MetadataResolverBadGatewayError | One of the upstream servers returned an unexpected error. Try again later. If the problem persists, Contact support.                                                                                                                                                                                                |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

## Terms used for billing and usage

The following terms and concepts are used for usage and billing in Azure Stack:

| Term | Definition |
| --- | --- |
| Direct CSP partner | A direct Cloud Solution Provider (CSP) partner receives an invoice directly from Microsoft for Azure and Azure Stack usage, and bills customers directly. |
| Indirect CSP | Indirect resellers work with an indirect provider (also known as a distributor). The resellers recruit end customers; the indirect provider holds the billing relationship with Microsoft, manages customer billing, and provides additional services like product support. |
| End customer | End customers are the businesses and government agencies that own the applications and other workloads that run on Azure Stack. |

## Next steps

 - To learn more about the CSP program, see [Cloud Solution Provider program](https://partner.microsoft.com/solutions/microsoft-cloud-solutions).
 - To learn more about how to retrieve resource usage information from Azure Stack, see [Usage and billing in Azure Stack](azure-stack-billing-and-chargeback.md).
