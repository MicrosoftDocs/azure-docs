---
title: Update the owner of Azure Stack user subscription | Microsoft Docs
description: Change the Billing Owner for Azure STack user subscriptions.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid:  
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: PowerShell
ms.topic: get-started-article
ms.date: 06/12/2018
ms.author: sethm
ms.reviewer: shnatara

---


# Change the Owner for an Azure Stack user subscription

Azure Stack operators can use PowerShell to change the Billing Owner of a user subscription. One reason to change the owner is to replace a user that leaves your organization.   

There are two types of *Owners* that are assigned to a subscription:

- **Billing Owner** – By default, the Billing Owner is the user account that gets the subscription from an Offer and then owns the billing relationship for that subscription. This account is also an administrator of the subscription.  Only one user account can have this designation on a subscription. A Billing Owner is often an organization or team lead. 

  You use the PowerShell cmdlet the **Set-AzsUserSubscription** to change the Billing Owner.  

- **Owners added through RBAC roles** – Additional users can be granted the Owner role using the [Role Based Access Control](azure-stack-manage-permissions.md) (RBAC) system.  Any number of additional user accounts can be added as owners to compliment the Billing Owner. Additional owners are also administrators of the subscription and have all privileges for the subscription except permissions to delete the Billing  Owner. 

  You can use PowerShell to manage additional owners, see [Azure PowerShell to manage role-based access control]( https://docs.microsoft.com/azure/role-based-access-control/role-assignments-powershell).


## Change the Billing Owner
Run the following script to change the Billing Owner of a user subscription.  The computer that you use to run the script must connect to Azure Stack and run the Azure Stack PowerShell module 1.3.0 or later. For more information, see [Install Azure Stack PowerShell](azure-stack-powershell-install.md). 

> [!Note]  
>  In a multi-tenanted Azure Stack, the new owner must be in the same directory as the existing owner. Before you can provide ownership of the subscription to a user that is in another directory, you must first [invite that user as a guest into your Directory](https://docs.microsoft.com/azure/active-directory/b2b/add-users-administrator). 


Replace the following values in the script before it runs: 
 
- **$ArmEndpoint** –  Specify the Resource Manager endpoint for your environment.  
- **$TenantId**   - Specify your Tenant ID. 
- **$SubscriptionId** – Specify your Subscription ID.
- **$OwnerUpn** - Specify an account as *user@example.com* to  add as the new Billing Owner.  


```PowerSHell   
# Setup Azure Stack Admin Environment
Add-AzureRmEnvironment -ARMEndpoint $ArmEndpoint -Name AzureStack-admin
Add-AzureRmAccount -Environment AzureStack-admin -TenantId $TenantId

# Select Admin Subscriptionr
$providerSubscriptionId = (Get-AzureRmSubscription -SubscriptionName "Default Provider Subscription").Id
Write-Output "Setting context the Default Provider Subscription: $providerSubscriptionId" 
Set-AzureRmContext -Subscription $providerSubscriptionId

# Change User Subscription owner
$subscription = Get-AzsUserSubscription -SubscriptionId $SubscriptionId
$Subscription.Owner = $OwnerUpn
Set-AzsUserSubscription -InputObject $subscription
```


## Next steps
[Manage Role-Based Access Control](azure-stack-manage-permissions.md)
