p---
title: Link partner ID to your account in Azuure | Microsoft Docs
description: Track engagements with Azure customers by linking partner ID to the user account that you use to manage the customer's resources. 
services: billing
author: dhirajgandhi
ms.author: dhgandhi
ms.date: 03/12/2018
ms.service: billing
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
---

# Link partner ID to your account in Azure
As a partners that does consulting work or provide managed services on Azure,track your impact across your customer engagements by linking your Partner ID to the accounts that you use to manage customer's resources.

This feature is available in a public preview. 

## Before you link 
Before you link partner ID, you need to get access from the customer using one of the following steps:

- **Guest User:** Customer can add you as a guest user and assign any RBAC role. See [Add guest users from another directory](https://docs.microsoft.com/azure/active-directory/active-directory-b2b-what-is-azure-ad-b2b) for information.

- **Directory account:**  Customer can create a new user from your organization in their directory and assign any RBAC role. 

- **Service Principal:**  Customer can add an app or script from your organization in their directory and assign any RBAC role. The identity of the app or script is known as Service Principal. 

Once you have access to customer resources, you can use PowerShell or CLI to link your Microsoft Partner Network ID (MPN ID) to  user account or Service Principal. 

## PowerShell - Link new partner ID

1. Install the [AzurePartnerRP](https://www.powershellgallery.com/packages/AzureRM.ManagementPartner/0.1.0-preview) PowerShell Module.

2. Log in to customer's tenant either with user ID or service principal, using the instruction from [Login with Powershell](https://docs.microsoft.com/en-us/powershell/azure/authenticate-azureps?view=azurermps-5.2.0).
 
```azurepowershell-interactive
C:\> Login-AzureRmAccount -TenantId XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX 
```


3. Link the new partner ID. The partner ID is the [Microsoft Partner Network(MPN)](https://partner.microsoft.com/) ID of your organization.

```azurepowershell-interactive
C:\> new-AzureRmManagementPartner -PartnerId 12345 
```


### Get the linked partner ID.

```azurepowershell-interactive
C:\> get-AzureRmManagementPartner 
```
### Update the linked partner ID

```azurepowershell-interactive
C:\> Update-AzureRmManagementPartner -PartnerId 12345 
```
### Delete the linked partner ID

```azurepowershell-interactive
C:\> remove-AzureRmManagementPartner -PartnerId 12345 
```

## CLI - Link new partner ID
1.  Install the CLI Extension.

```azure-cli
C:\ az extension add --name managementpartner
``` 

2.  Log in to customer's tenant either with user ID or service principal, using the instruction from [Log in with Azure CLI 2.0](https://docs.microsoft.com/cli/azure/authenticate-azure-cli?view=azure-cli-latest).

```azure-cli
C:\ az login --tenant <tenant>
``` 


3.  Link the new partner ID. The partner ID is the [Microsoft Partner Network(MPN)](https://partner.microsoft.com/) ID of your organization.

```azure-cli
C:\ az managementpartner create --partner-id 12345
```  

### Get the linked partner ID

```azure-cli
C:\ az managementpartner show
``` 

### Update the linked partner ID

```azure-cli
C:\ az managementpartner update --partner-id 12345
``` 

### Delete the linked partner ID

```azure-cli
C:\ az managementpartner delete --partner-id 12345
``` 


## Frequently Asked Questions

**Who can link the partner ID?**

Any user from partner organization who is working with customers can link a partner ID to the account within each the customer tenant that they have been granted access. 

**Once a partner ID has been linked can it be changed? Is there a limit to the number of changes possible?**

Yes, partner ID linked can be changed, added, removed as many times as the partner wishes.

**What if a user has credentials in multiple customer tenants?**

The link between the Partner ID and the credentials is done per customer tenant.  You can associate and Partner ID to the user in each customer tenant.

**Can other partner or customer edit or remove the link to the Partner ID**

The link is associated at the account level. Only you can edit or remove the link to the Partner ID.


