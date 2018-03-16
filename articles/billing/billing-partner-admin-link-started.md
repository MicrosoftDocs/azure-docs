---
<!-- All articles need the metadata header along with the required values for reporting.</br>
Detailed instructions for completing this template are available in the </br>
Contributor Guide:https://review.docs.microsoft.com/en-us/help/contribute/mock-template-quickstart?branch=master -->

---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Azure Partner Admin Link
description: Method for partners to track engagements with Azure customers based on their access to customer's Azure resources. 
services: billing
keywords: Azure partner link
author: dhirajgandhi
ms.author: dhgandhi
ms.date: 03/12/2018
ms.service: billing
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na


# Partner Admin Link
Partner Admin Link allows partners who do consulting work or provide managed services on Microsoft Azure to track and report the impact across all customer engagements. This feature uses partner's existing access to customer's Azure resources.  Partner can link their existing access credentials, which are used for managing customer's Azure resources to their Microsoft Partner Network ID. This method doesn't give any new access to partners. 

Partner Admin Link is available in a public preview. 

## How this works? 
Today as a partner, you use following methods to get access for customer’s Azure resources: 

- **Guest User:** The customer can add with guest users from your organization using Azure AD business-to-business (B2B) collaboration capabilities and assign the role to the Azure resources.    See [Add guest users from another directory](https://docs.microsoft.com/azure/active-directory/active-directory-b2b-what-is-azure-ad-b2b) for information.

- **Directory account:**   The customer can create a new user from your organization in their own directory and assign the role to the Azure resources.

- **Service Principal:**  The customer can add an app or script that can manage customer's Azure resources.  The identity of the app or script is known as a service principal. 

Once you have access to customer resources, you can use PowerShell or CLI to link your Microsoft Partner Network ID (MPN ID) to  user ID or Service Principal. 

## PowerShell

- Install the [AzurePartnerRP](https://www.powershellgallery.com/packages/AzureRM.ManagementPartner/0.1.0-preview) PowerShell Module.

- Log in to customer's tenant either with user ID or service principal, using the instruction from [Login with Powershell](https://docs.microsoft.com/en-us/powershell/azure/authenticate-azureps?view=azurermps-5.2.0)
 
```azurepowershell-interactive
C:\> Login-AzureRmAccount -TenantId XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX 
```


- Link the new Partner ID

```azurepowershell-interactive
C:\> new-AzureRmManagementPartner -PartnerId 12345 
```
**PartnerId** is the [Microsoft Partner Network(MPN)](https://partner.microsoft.com/) ID of your organization. 

- Get the linked Partner ID.

```azurepowershell-interactive
C:\> get-AzureRmManagementPartner 
```
- Update the linked Partner ID

```azurepowershell-interactive
C:\> Update-AzureRmManagementPartner -PartnerId 12345 
```
- Delete the linked Partner ID

```azurepowershell-interactive
C:\> remove-AzureRmManagementPartner -PartnerId 12345 
```

## CLI
- Install the CLI Extension

```azure-cli
C:\ az extension add --name managementpartner
``` 

- Log in to customer's tenant either with user ID or service principal, using the instruction from [Log in with Azure CLI 2.0](https://docs.microsoft.com/cli/azure/authenticate-azure-cli?view=azure-cli-latest)

```azure-cli
C:\ az login --tenant <tenant>
``` 


- Link the new Partner ID

```azure-cli
C:\ az managementpartner create --partner-id 12345
``` 
**partner-id** is the [Microsoft Partner Network(MPN)](https://partner.microsoft.com/) ID of your organization. 

- Get the linked Partner ID

```azure-cli
C:\ az managementpartner show
``` 

- Update the linked Partner ID

```azure-cli
C:\ az managementpartner update --partner-id 12345
``` 

- Delete the linked Partner ID

```azure-cli
C:\ az managementpartner delete --partner-id 12345
``` 


## Frequently Asked Questions

**Who can link the partner ID?**

The user from partner organization who has been granted access rights within a customer environment can attach a partner ID to the credentials within each the customer environment that they have been granted access. 

**Once a partner ID has been linked can it be changed? Is there a limit to the number of changes possible?**

Yes, partner ID linked can be changed, added, removed as many times as the partner wishes.

**What if an individual or application has credentials in multiple customer environments?**

The link between the Partner ID and the credentials is done per customer tenant.  You can associate and Partner ID to the user in each customer tenant.

**Can other partner or customer edit or remove the link to the Partner ID**

The link is associated at the user level. Only you can edit or remove the link to the Partner ID.


