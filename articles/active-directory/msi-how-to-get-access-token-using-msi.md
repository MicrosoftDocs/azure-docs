---
title: How to use an Azure Managed Service Identity for sign-in and token acquisition
description: Step by step instructions for using an MSI for sign-in and OAuth access token acquisition.
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

After you've enabled MSI on an Azure resource, [such as an Azure VM](msi-qs-configure-powershell-windows-vm.md), you can use its identity for sign-in and  requesting an access token. This article shows you various ways to use an MSI [service principal](active-directory-dev-glossary.md#service-principal-object) for sign-in, and to acquire an access token to access other resources.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../includes/msi-qs-configure-prereqs.md)]

Also, install [Azure PowerShell version 4.3.1](https://www.powershellgallery.com/packages/AzureRM/4.3.1) if you haven't already.

## How to sign in using an MSI identity

In cases where an application needs to authenticate with Azure Active Directory (AD) under a non-user identity, you can use the MSI-provisioned service principal of the host resource. Previously, you would have had to register the application with Azure Active Directory (AD) to provision its own identity. 

In the examples below, we show how to use a VM's MSI service principal for sign-in.

### PowerShell

### Azure CLI

To sign in to CLI using an MSI... 

   ```azurecli-interactive
   az login -u <subscriptionID>@50342
   ```

test


## How to acquire an access token from MSI

Instead of acquiring an access token from Azure AD, an MSI endpoint is provided for use by clients running on the host resource instance (in this case, a Windows VM). Before you proceed to one of the following sections, use remote desktop to connect to your MSI-enabled VM.

### Get a token using PowerShell

1. Sign in to Azure using the `Login-AzureRmAccount` cmdlet. Use an account that is associated with the Azure subscription under which you have configured the MSI:

   ```powershell
   Login-AzureRmAccount
   ```


### Get a token using CURL



### Get a token using .NET C#

> [!IMPORTANT]
> MSI and Azure AD are not integrated. Therefore, the Azure AD Authentication Libraries (ADAL) cannot be used for MSI token acquisition. Please refer to the [MSI known issues topic](msi-known-issues.md) for more details.



### Get a token using REST

https://docs.microsoft.com/en-us/azure/app-service/app-service-managed-service-identity#using-the-rest-protocol

## How to use MSI with Azure SDK libraries

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

