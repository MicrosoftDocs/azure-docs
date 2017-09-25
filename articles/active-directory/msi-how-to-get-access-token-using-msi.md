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

After you've enabled MSI on an Azure resource, [such as an Azure VM](msi-qs-configure-powershell-windows-vm.md), you can use the identity for sign-in and to request an access token. This article shows you how to use an MSI [service principal](active-directory-dev-glossary.md#service-principal-object) for sign in, and various ways to acquire an access token to access other resources.

> [!IMPORTANT]
> All of the sample code/script in this article assumes it is being run from an MSI-enabled Virtual Machine. For details in enabling MSI on a VM, see [Configure a VM Managed Service Identity (MSI) using PowerShell](Configure a VM Managed Service Identity (MSI) using PowerShell.md), or one of the variant articles (using the Azure Portal, CLI, or a template).

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../includes/msi-qs-configure-prereqs.md)]

Also, install [Azure PowerShell version 4.3.1](https://www.powershellgallery.com/packages/AzureRM/4.3.1) if you haven't already.

## How to sign in using an MSI identity

In cases where a secure application needs to access an Azure resource under its own identity, you can use the identity of the MSI instead of an application identity. In the examples below, we show how to use a VM's MSI service principal for sign-in.

### PowerShell

TODO
- Declare that this is VM specific, and assumes the client code is running on the VM
- Instructions on connecting to the VM
- replace the args with placeholders

To sign in to Azure AD using an MSI service principal, use the following script:

   ```powershell
   # Get an access token from MSI
   $response = Invoke-WebRequest -Uri http://localhost:50342/oauth2/token `
                                 -Method GET -Body @{resource="https://management.azure.com/"} -Headers @{Metadata="true"}
   $content =$response.Content | ConvertFrom-Json
   $access_token = $content.access_token
   # Use the access token to sign-in under the MSI service principal
   Login-AzureRmAccount -AccessToken $access_token -AccountId “CLIENT”

   # You can now use the MSI service principal for secured calls,
   # for instance, to call Azure Resource Manager to get its service principal ID.
   # Note that the VM identity must also be given "Reader" access to the VM instance, in
   # order to extract the service principal ID. See [Assign a Managed Service Identity (MSI) access # to a resource using PowerShell](msi-howto-assign-access-powershell.md) for details.
   $spID = (Get-AzureRMVM -ResourceGroupName Demo -Name SimpleWinVM).identity.principalid
   ```
   
### Azure CLI

To sign in to Azure AD using an MSI service principal, use the following script:

   ```azurecli-interactive
   az login -u <subscriptionID>@50342
   ```

## How to acquire an access token from MSI

Instead of acquiring the access token from Azure Active Directory (AD), an MSI endpoint is provided for use by the resource on which the MSI was configured (in this case, a Windows VM). Before you proceed to one of the following sections, use remote desktop to connect to your MSI-enabled VM.

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
> MSI and Azure AD are not integrated. Therefore, the Azure AD Authentication Libraries (ADAL) cannot be used for MSI token acquisition. Please see the [MSI known issues topic](msi-known-issues.md) for more details.



### Get a token using REST

https://docs.microsoft.com/en-us/azure/app-service/app-service-managed-service-identity#using-the-rest-protocol

## How to use MSI with Azure SDK libaries

### .NET library

## Additional information

### Token expiration

TODO: do we recommend calling every time or caching? See Rashid's sample for catching the exception after timeout and retrying.

### Resource IDs for Azure services

See the [Azure services that support Azure AD authentication](msi-overview.md#azure-services-that-support-azure-ad-authentication) topic for a list of services that support MSI, and their respective resouce IDs.

## Troubleshooting

If the MSI for the resource does not show up in the list of available identities, verify that the MSI has been enabled correctly. In our case, we can go back to the Azure VM in the [Azure portal](https://portal.azure.com) and:

- Look at the "Configuration" page and ensure MSI enabled = "Yes."
- Look at the "Extensions" page and ensure the MSI extension deployed successfully.

If either is incorrect, you may need to redeploy the MSI on your resource again, or troubleshoot the deployment failure.

## Related content

- For an overview of MSI, see [Managed Service Identity overview](msi-overview.md).
- To enable MSI on an Azure VM, see [Configure an Azure VM Managed Service Identity (MSI) using PowerShell](msi-qs-configure-powershell-windows-vm.md).

Use the following comments section to provide feedback and help us refine and shape our content.

