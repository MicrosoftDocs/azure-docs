---
title: Register tenants in Azure Stack | Microsoft Docs
description: Type the description in Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.assetid: B4AD8EA6-DAD9-4198-B134-BF628379AFEE
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/01/2018
ms.author: mabrigg

---

# Add tenants to Azure Stack

*Applies to: Azure Stack integrated systems*

Registering tenants ensures that each tenant’s usage will be reported and billed against that tenant’s CSP subscription. If you do not go through this process, tenant usage will be charged to the subscription used in the initial registration.

## Create a new customer in Partner Center

Add the customer in Partner Center and creates an Azure subscription. For instruction, see [Add a new customer](https://msdn.microsoft.com/en-us/partner-center/add-a-new-customer).

## Enable new customer tenant in Azure Stack

1. Update the registration with the new customer’s subscription. This will ensure usage is reported against the correct customer in Partner Center. 

2. Add the new customer tenant to Azure Stack.


## Log into Azure Stack using the principal tenant

Add tenants to your registration. 

1. Open Windows PowerShell with an elevated prompt, and run:

```PowerShell
    Login-AzureRmAccount
```

2. Type your Azure credentials.


## Add new tenant to registration

In your PowerShell session, run:

```powershell
    New-AzureRmResource -ResourceId "subscriptions/{registrationSubscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.AzureStack/registrations/{registrationName}/customerSubscriptions/{customerSubscriptionId}" -ApiVersion 2017-06-01 -Properties
```

| parameter | Description |
| --- | --- | 
|registrationSubscriptionID | The Azure subscription that was used for the initial registration. |
| customerSubscriptionID | The Azure subscription (not Azure Stack) belonging to the customer to be registered. Must be created in the CSP offer. In practice, this means through Partner Center. If a customer has more than one tenant, this subscription must be created in the tenant that will be used to log into Azure Stack.
| resourceGroup | The resource group in Azure in which your registration is stored. 
| registrationName | The name of the registration of your Azure Stack. It is an object stored in Azure. The name is usually in the form | 
| azurestack-CloudID | The Cloud ID of your Azure Stack deployment.

> [!Note]  
> Tenants need to be registered with each Azure Stack they use. If a tenant uses more than one Azure Stack, you need to update the initial registrations of each deployment with the tenant subscription.


## Next steps

 - To review the error messages if they are triggered in your registration process, see [Tenant registration error messages](azure-stack-partner-billing-register-error-messages.md).
 
