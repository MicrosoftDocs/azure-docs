---
title: Add tenants for usage and billing to Azure Stack | Microsoft Docs
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
ms.date: 02/27/2018
ms.author: mabrigg
ms.reviewer: alfredo

---

# Add tenant for usage and billing to Azure Stack

*Applies to: Azure Stack integrated systems*

This article describes the steps required add an end user to Azure Stack managed by a Cloud Service Provider (CSP). When the new tenant uses resources, Azure Stack will report usage to their CSP subscription.

CSPs often offer services to multiple customers (tenants) on their Azure Stack deployment. Registering tenants ensures that each tenant’s usage will be reported and billed to the corresponding CSP subscription. If you do not complete the steps in this article, tenant usage is charged to the subscription used in the initial registration of Azure Stack. Before you can add an end customer to Azure Stack for usage tracking and to manage their tenant, you will need to configure Azure Stack as a CSP. For steps and resources, see [Manage usage and billing for Azure Stack as a Cloud Service Provider](azure-stack-add-manage-billing-as-a-csp.md).

The following diagram shows the steps that you will need to follow to add an end customer to your CSP account for usage tracking. By adding the end customer, you will also be to manage resources in Azure Stack. You have two options for how you would like to manage their resources:

1. You can maintain the end customer tenant and provide credentials to the local Azure Stack subscription to the end customer.  
2. Or the end customer can work with their subscription locally and add the CSP as a guest with owner permissions.  

**Steps to add an end customer**

![Set up Cloud Service Provider for usage tracking and to manage the end customer account](media\azure-stack-csp-enable-billing-usage-tracking\process-csp-enable-billing.png)

## Create a new customer in Partner Center

Add the customer in Partner Center and creates an Azure subscription. For instructions, see [Add a new customer](https://msdn.microsoft.com/en-us/partner-center/add-a-new-customer).


##  Create an Azure subscription for the end customer

After you've created a record of your customer in Partner Center, you can sell them subscriptions to products in the catalog. For instructions, see [Create, suspend, or cancel customer subscriptions](https://msdn.microsoft.com/partner-center/create-a-new-subscription).

## Create a guest user in end customer directory

If the end customer will manager their own account, create a guest user in their directory, and send them the information. The end user will then add the guest and elevate the guest permission to **Owner** to the Azure Stack CSP account.
 
## Update the registration with the end customer subscription

Update your registration with the new customer’s subscription. Azure reports the customer's usage using the customer identity from Partner Central. This step ensures that each customer’s usage is reported under that customer’s individual CSP subscription. This makes tracking user usage and billing much easier.

> [!Note]  
> To carry out this step, you must have [registered Azure Stack](azure-stack-register.md).

1. Open Windows PowerShell with an elevated prompt, and run:  
    `Login-AzureRmAccount`
2. Type your Azure credentials.
3. In the PowerShell session, run:

```powershell
    New-AzureRmResource -ResourceId "subscriptions/{registrationSubscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.AzureStack/registrations/{registrationName}/customerSubscriptions/{customerSubscriptionId}" -ApiVersion 2017-06-01 -Properties
```
### New-AzureRmResource PowerShell parameters
| Parameter | Description |
| --- | --- | 
|registrationSubscriptionID | The Azure subscription that was used for the initial registration. |
| customerSubscriptionID | The Azure subscription (not Azure Stack) belonging to the customer to be registered. Must be created in the CSP offer. In practice, this means through Partner Center. If a customer has more than one tenant, this subscription must be created in the tenant that will be used to log into Azure Stack.
| resourceGroup | The resource group in Azure in which your registration is stored. 
| registrationName | The name of the registration of your Azure Stack. It is an object stored in Azure. The name is usually in the form | 
| azurestack-CloudID | The Cloud ID of your Azure Stack deployment.

> [!Note]  
> Tenants need to be registered with each Azure Stack they use. If a tenant uses more than one Azure Stack, you need to update the initial registrations of each deployment with the tenant subscription.

## Create a local Azure Stack subscription

Configure Azure Stack to support users from multiple Azure AD tenants to use services in Azure Stack. For instructions, see [Enable multi-tenancy in Azure Stack](azure-stack-enable-multitenancy.md).


## Create a local resource in the end customer tenant in Azure Stack

Once you have added the new customer to Azure Stack, or the end customer tenant has enabled your guest account with owner privileges, verify that you could create a resource in their tenant. For example, they can [Create a Windows virtual machine with the Azure Stack portal](azure-stack-quick-windows-portal.md).

## Next steps

 - To review the error messages if they are triggered in your registration process, see [Tenant registration error messages](/azure-stack-csp-ref-error-codes.md).
 - To learn more about how to retrieve resource usage information from Azure Stack, see [Usage and billing in Azure Stack](/azure-stack-billing-and-chargeback.md).
 - To review how an end customer may add you, as the CSP, as the manager for their Azure Stack, tenant, see [Enable a Cloud Service Provider to manage your Azure Stack subscription](user\azure-stack-csp-enable-billing-usage-tracking.md).