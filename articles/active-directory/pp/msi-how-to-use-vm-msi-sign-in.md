---
title: How to use an Azure VM Managed Service Identity for sign in
description: Step by step instructions and examples for using an Azure VM MSI service principal for script client sign in and resource access.
services: active-directory
documentationcenter: 
author: daveba
manager: mtillman
editor: 
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 01/05/2018
ms.author: daveba
ROBOTS: NOINDEX,NOFOLLOW
---

# Sign in using a VM user-assigned Managed Service Identity (MSI)

[!INCLUDE[preview-notice](~/includes/active-directory-msi-preview-notice-ua.md)]
This article provides CLI script examples for sign-in using a user-assigned MSI service principal, and guidance on important topics such as error handling.

## Prerequisites

[!INCLUDE [msi-core-prereqs](~/includes/active-directory-msi-core-prereqs-ua.md)]

In order to use the Azure CLI examples in this article, be sure to install the latest version of [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli). 

> [!IMPORTANT]
> - All sample script in this article assumes the command-line client is running on an MSI-enabled Virtual Machine. Use the VM "Connect" feature in the Azure portal, to remotely connect to your VM. For details on enabling MSI on a VM, see [Configure a VM Managed Service Identity (MSI) using Azure CLI](msi-qs-configure-cli-windows-vm.md), or one of the variant articles (using PowerShell, Portal, a template, or an Azure SDK). 
> - To prevent errors during sign-in and resource access, the MSI must be given at least "Reader" access at the appropriate scope (the VM or higher) to allow Azure Resource Manager operations on the VM. See [Assign a Managed Service Identity (MSI) access to a resource using Azure CLI](msi-howto-assign-access-cli.md) for details.

## Overview

An MSI provides a [service principal](~/articles/active-directory/develop/active-directory-dev-glossary.md#service-principal-object), which is [created upon enabling MSI](msi-overview.md#how-does-it-work) on the VM. The service principal can be given access to Azure resources, and used as an identity by script/command-line clients for sign-in and resource access. Traditionally, in order to access secured resources under its own identity, a script client would need to:  

   - be registered and consented with Azure AD as a confidential/web client application
   - sign in under its service principal, using the app's credentials (which are likely embedded in the script)

With MSI, your script client no longer needs to do either, as it can sign in under the MSI service principal. 

## Azure CLI

The following script demonstrates how to:

1. Sign in to Azure AD under the user-assigned MSI's service principal.  
2. Call Azure Resource Manager and get the Azure region location for a VM. CLI takes care of managing token acquisition/use for you automatically. Be sure to substitute your VM name for `<VM NAME>`, and user-assigned MSI resource id for `<MSI ID>`. The MSI resource id is returned in the `id` property during creation of a user-assigned MSI (see [Configure a user-assigned Managed Service Identity (MSI) for a VM, using Azure CLI](msi-qs-configure-cli-windows-vm.md) for examples of the `az identity create` command).

    ```azurecli
    az login --msi –u <MSI ID>
   
    vmLocation=$(az resource list -n <VM NAME> --query [*].location --out tsv)
    echo The VM region location is $vmLocation
    ```

    Example responses:
   
    ```bash
    user@vmLinux:~$ az login --msi -u /subscriptions/80c696ff-5efa-4909-a64d-z1b616f423bl/resourcegroups/rgName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/msiName
    [
      {
        "environmentName": "AzureCloud",
        "id": "90c696ff-5efa-4909-a64d-z1b616f423bl",
        "isDefault": true,
        "name": "MSIResource-/subscriptions/90c696ff-5efa-4909-a64d-z1b616f423bl/resourcegroups/rgName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/msiName@50342",
        "state": "Enabled",
        "tenantId": "933a8f0e-ec41-4e69-8ad8-971zc4b533ll",
        "user": {
          "name": "userAssignedIdentity",
          "type": "servicePrincipal"
        }
      }
    ]  
    user@vmLinux:~$ vmLocation=$(az resource list -n vmLinux --query [*].location --out tsv)
    user@vmLinux:~$ echo The VM region location is $vmLocation
    The VM region location is westcentralus
    ```

## Resource IDs for Azure services

See [Azure services that support Azure AD authentication](msi-overview.md#azure-services-that-support-azure-ad-authentication) for a list of resources that support Azure AD and have been tested with MSI, and their respective resource IDs.

## Error handling guidance 

The following responses may indicate that the MSI has not been correctly configured:

- CLI: *MSI: Failed to retrieve a token from 'http://localhost:50342/oauth2/token' with an error of 'HTTPConnectionPool(host='localhost', port=50342)* 

If you receive one of these errors, return to the Azure VM in the [Azure portal](https://portal.azure.com) and:

- Go to the **Configuration** page and ensure "Managed service identity" is set to "Yes."
- Go to the **Extensions** page and ensure the MSI extension deployed successfully.

If either is incorrect, you may need to reassign the MSI to your resource again, or troubleshoot the deployment failure. See [Configure a VM Managed Service Identity (MSI) using Azure CLI](msi-qs-configure-cli-windows-vm.md) if you need assistance with VM configuration.

## Next steps

- To enable MSI on an Azure VM, see [Configure a VM Managed Service Identity (MSI) using Azure CLI](msi-qs-configure-cli-windows-vm.md).

Use the following comments section to provide feedback and help us refine and shape our content.








