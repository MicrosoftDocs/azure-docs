---
title: Register tenants for usage tracking in Azure Stack | Microsoft Docs
description: Details about operations used to manage  tenant registrations and how tenant usage is tracked in Azure Stack.
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
ms.date: 10/15/2018
ms.author: mabrigg
ms.reviewer: alfredo

---

# Manage tenant registration in Azure Stack

*Applies to: Azure Stack integrated systems*

This article contains details about registration operations. You can use these operations to:
- Manage tenant registrations
- Manage tenant usage tracking

You can find details about how to add, list, or remove tenant mappings. You can use PowerShell or the Billing API endpoints to manage your use tracking. You can find details about how to add, list, or remove tenant mappings. You can use PowerShell or the Billing API endpoints to manage your use tracking.

## Add tenant to registration

You use the operation when you want to add a new tenant to your registration. Tenant usage is reported under an Azure subscription connected with their Azure Active Directory (Azure AD) tenant.

You can also use the operation if you want to change the subscription associated with a tenant. Call PUT/New-AzureRMResource  to overwrite the previous mapping.

You can associate a single Azure subscription with a tenant. If you try to add a second subscription to an existing tenant, the first subscription is over-written.

### Use API profiles

The registration cmdlets require that you specify an API profile when running PowerShell. API profiles represent a set of Azure resource providers and their API versions. They help you use the right version of the API when interacting with multiple Azure clouds. For instance, you work with multiple clouds when working with global Azure and Azure Stack. Profiles specify a name that matches their release date. You will need to use the **2017-09-03** profile.

For more information about Azure Stack and API Profiles, see [Manage API version profiles in Azure Stack](user/azure-stack-version-profiles.md). For instructions on getting up and running with API Profile with PowerShell, see [Use API version profiles for PowerShell in Azure Stack](user/azure-stack-version-profiles-powershell.md).

### Parameters

| Parameter                  | Description |
|---                         | --- |
| registrationSubscriptionID | The Azure subscription that was used for the initial registration. |
| customerSubscriptionID     | The  Azure subscription (not Azure Stack) belonging to the customer to be registered. Must be created in the Cloud Service Provider (CSP) offer through Partner Center. If a customer has more than one tenant, created a subscription for the tenant to log into Azure Stack. |
| resourceGroup              | The resource group in Azure in which your registration is stored. |
| registrationName           | The name of the registration of your Azure Stack. It is an object stored in Azure. The name is usually in the form azurestack-CloudID, where CloudID is the Cloud ID of your Azure Stack deployment. |

> [!Note]  
> Tenants need to be registered with each Azure Stack they use. If a tenant uses more than one Azure Stack, you need to update the initial registrations of each deployment with the tenant subscription.

### PowerShell

Use the New-AzureRmResource cmdlet to update the registration resource. Sign in to Azure (`Add-AzureRmAccount`) using the account you used for the initial registration. Here is an example of how to add a tenant:

```powershell
  New-AzureRmResource -ResourceId "subscriptions/{registrationSubscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.AzureStack/registrations/{registrationName}/customerSubscriptions/{customerSubscriptionId}" -ApiVersion 2017-06-01 -Properties
```

### API call

**Operation**: PUT  
**RequestURI**: `subscriptions/{registrationSubscriptionId}/resourceGroups/{resourceGroup}  /providers/Microsoft.AzureStack/registrations/{registrationName}/customerSubscriptions/  
{customerSubscriptionId}?api-version=2017-06-01 HTTP/1.1`  
**Response**: 201 Created  
**Response Body**: Empty  

## List all registered tenants

Get a list of all tenants that have been added to a registration.

 > [!Note]  
 > If no tenants have been registered, you won't receive a response.

### Parameters

| Parameter                  | Description          |
|---                         | ---                  |
| registrationSubscriptionId | The Azure subscription that was used for the initial registration.   |
| resourceGroup              | The resource group in Azure in which your registration is stored.    |
| registrationName           | The name of the registration of your Azure Stack. It is an object stored in Azure. The name is usually in the form of **azurestack**-***CloudID***, where ***CloudID*** is the Cloud ID of your Azure Stack deployment.   |

### PowerShell

Use the Get-AzureRmResource cmdlet to list all registered tenants. Sign in to Azure (`Add-AzureRmAccount`) using the account you used for the initial registration. Here is an example of how to add a tenant:

```powershell
  Get-AzureRmResource -ResourceId "subscriptions/{registrationSubscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.AzureStack/registrations/{registrationName}/customerSubscriptions" -ApiVersion 2017-06-01
```

### API Call

You can get a list of all tenant mappings using the GET operation

**Operation**: GET  
**RequestURI**: `subscriptions/{registrationSubscriptionId}/resourceGroups/{resourceGroup}  
/providers/Microsoft.AzureStack/registrations/{registrationName}/customerSubscriptions?  
api-version=2017-06-01 HTTP/1.1`  
**Response**: 200  
**Response Body**: 

```JSON  
{
    "value": [{
            "id": " subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.AzureStack/registrations/{registrationName}/customerSubscriptions/{ cspSubscriptionId 1}”,
            "name": " cspSubscriptionId 1",
            "type": “Microsoft.AzureStack\customerSubscriptions”,
            "properties": { "tenantId": "tId1" }
        },
        {
            "id": " subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.AzureStack/registrations/{registrationName}/customerSubscriptions/{ cspSubscriptionId 2}”,
            "name": " cspSubscriptionId2 ",
            "type": “Microsoft.AzureStack\customerSubscriptions”,
            "properties": { "tenantId": "tId2" }
        }
    ],
    "nextLink": "{originalRequestUrl}?$skipToken={opaqueString}"
}
```

## Remove a tenant mapping

You can remove a tenant that has been added to a registration. If that tenant is still using resources on Azure Stack, their usage is charged to the subscription used in the initial Azure Stack registration.

### Parameters

| Parameter                  | Description          |
|---                         | ---                  |
| registrationSubscriptionId | Subscription ID for the registration.   |
| resourceGroup              | The resource group for the registration.   |
| registrationName           | The name of the registration.  |
| customerSubscriptionId     | The customer subscription ID.  |

### PowerShell

```powershell
  Remove-AzureRmResource -ResourceId "subscriptions/{registrationSubscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.AzureStack/registrations/{registrationName}/customerSubscriptions/{customerSubscriptionId}" -ApiVersion 2017-06-01
```

### API Call

You can remove tenant mappings using the DELETE operation.

**Operation**: DELETE  
**RequestURI**: `subscriptions/{registrationSubscriptionId}/resourceGroups/{resourceGroup}  
/providers/Microsoft.AzureStack/registrations/{registrationName}/customerSubscriptions/  
{customerSubscriptionId}?api-version=2017-06-01 HTTP/1.1`  
**Response**: 204 No Content  
**Response Body**: Empty

## Next steps

 - To learn more about how to retrieve resource usage information from Azure Stack, see [Usage and billing in Azure Stack](azure-stack-billing-and-chargeback.md).
