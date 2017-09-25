---
title: How to use an Azure Managed Service Identity for sign-in and token acquisition
description: Step by step instructions for using an MSI service principal for sign-in, and acquiring an access token.
services: active-directory
documentationcenter: 
author: bryanla
manager: mbaldwin
editor: 

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/25/2017
ms.author: bryanla
---

# How to use an Azure Managed Service Identity for sign-in and token acquisition 

After you've enabled MSI on an Azure resource, [such as an Azure VM](msi-qs-configure-powershell-windows-vm.md), you can use the identity for sign-in and to request an access token. This article shows you how to use an MSI [service principal](develop/active-directory-dev-glossary.md#service-principal-object) for sign-in, and various ways to acquire an access token to access other resources.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../includes/msi-qs-configure-prereqs.md)]

Install [Azure PowerShell version 4.3.1](https://www.powershellgallery.com/packages/AzureRM/4.3.1) or greater, if you haven't already.

> [!IMPORTANT]
> All sample code/script in this article assumes the client is running on an MSI-enabled Virtual Machine. For details on enabling MSI on a VM, see [Configure a VM Managed Service Identity (MSI) using PowerShell](msi-qs-configure-powershell-windows-vm.md), or one of the variant articles (using the Azure portal, CLI, or a template). 
> Before proceeding to one of the following sections, use the VM "Connect" feature in the Azure portal, to remotely connect to your MSI-enabled VM.

## How to sign in using an MSI identity

In cases where a secure client application needs to access an Azure resource under its own identity, you can use the identity of the MSI. Previously, you would have been required to register the application with Azure AD, and authenticate using the client application's identity. In the examples below, we show how to use a VM's MSI service principal for sign-in.

### PowerShell

The following script demonstrates how to:

- acquire an MSI access token
- use the access token to sign in to Azure AD under the corresponding MSI service principal
- use the MSI service principal to make an Azure Resource Manager call

   ```powershell
   # Get an access token from MSI
   $response = Invoke-WebRequest -Uri http://localhost:50342/oauth2/token `
                                 -Method GET -Body @{resource="https://management.azure.com/"} -Headers @{Metadata="true"}
   $content =$response.Content | ConvertFrom-Json
   $access_token = $content.access_token
   # Use the access token to sign in under the MSI service principal
   Login-AzureRmAccount -AccessToken $access_token -AccountId “CLIENT”

   # The MSI service principal is now signed in for this session.
   # Next, a call to Azure Resource Manager is made to get the service principal ID for the VM's MSI. 
   # In order to prevent a 403/AuthorizationFailed error, the VM's identity must be given "Reader" access to the VM instance
   # See https://docs.microsoft.com/azure/active-directory/msi-howto-assign-access-portal for details.
   $spID = (Get-AzureRMVM -ResourceGroupName <RESOURCE-GROUP> -Name <VM-NAME>).identity.principalid
   ```
   
### Azure CLI

To sign in to Azure AD using an MSI service principal, use the following script:

   ```azurecli-interactive
   az login -u <AZURE-SUBSCRIPTION-ID>@50342
   ```

## How to acquire an access token from MSI

Instead of acquiring the access token from Azure Active Directory (AD), an MSI endpoint is provided for use by the resource on which the MSI was configured (in this case, a Windows VM). 

### Get a token using PowerShell

1. Sign in to Azure using the `Login-AzureRmAccount` cmdlet. Use an account that is associated with the Azure subscription under which you have configured the MSI:

   ```powershell
   # Get an access token from MSI
   $response = Invoke-WebRequest -Uri http://localhost:50342/oauth2/token `
                                 -Method GET -Body @{resource="https://management.azure.com/"} -Headers @{Metadata="true"}
   $content =$response.Content | ConvertFrom-Json
   $access_token = $content.access_token
   ```


### Get a token using CURL



### Get a token using .NET C#

> [!IMPORTANT]
> MSI and Azure AD are not integrated. Therefore, the Azure AD Authentication Libraries (ADAL) cannot be used for MSI token acquisition. See [MSI known issues](msi-known-issues.md) for more details.



### Get a token using REST

NOTES:
- look at https://docs.microsoft.com/azure/app-service/app-service-managed-service-identity#using-the-rest-protocol

## How to use MSI with Azure SDK libraries

### .NET library

## Additional information

### Token expiration

TODO: do we recommend calling every time or caching? See Rashid's sample for catching the exception after timeout and retrying.

### Resource IDs for Azure services

See the [Azure services that support Azure AD authentication](msi-overview.md#azure-services-that-support-azure-ad-authentication) topic for a list of services that support MSI, and their respective resource IDs.

## Troubleshooting

If the MSI for the resource does not show up in the list of available identities, verify that the MSI has been enabled correctly. In our case, we can go back to the Azure VM in the [Azure portal](https://portal.azure.com) and:

- Look at the "Configuration" page and ensure MSI enabled = "Yes."
- Look at the "Extensions" page and ensure the MSI extension deployed successfully.

If either is incorrect, you may need to redeploy the MSI on your resource again, or troubleshoot the deployment failure.

## Related content

- For an overview of MSI, see [Managed Service Identity overview](msi-overview.md).
- To enable MSI on an Azure VM, see [Configure an Azure VM Managed Service Identity (MSI) using PowerShell](msi-qs-configure-powershell-windows-vm.md).

Use the following comments section to provide feedback and help us refine and shape our content.

