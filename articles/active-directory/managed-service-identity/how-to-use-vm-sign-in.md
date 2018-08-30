---
title: How to use an Azure VM Managed Service Identity for sign in
description: Step by step instructions and examples for using an Azure VM MSI service principal for script client sign in and resource access.
services: active-directory
documentationcenter: 
author: daveba
manager: mtillman
editor: 

ms.service: active-directory
ms.component: msi
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/01/2017
ms.author: daveba
---

# How to use an Azure VM Managed Service Identity (MSI) for sign in 

[!INCLUDE [preview-notice](../../../includes/active-directory-msi-preview-notice.md)]  
This article provides PowerShell and CLI script examples for sign-in using an MSI service principal, and guidance on important topics such as error handling.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../../includes/active-directory-msi-qs-configure-prereqs.md)]

If you plan to use the Azure PowerShell or Azure CLI examples in this article, be sure to install the latest version of [Azure PowerShell](https://www.powershellgallery.com/packages/AzureRM) or [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli). 

> [!IMPORTANT]
> - All sample script in this article assumes the command-line client is running on an MSI-enabled Virtual Machine. Use the VM "Connect" feature in the Azure portal, to remotely connect to your VM. For details on enabling MSI on a VM, see [Configure a VM Managed Service Identity (MSI) using the Azure portal](qs-configure-portal-windows-vm.md), or one of the variant articles (using PowerShell, CLI, a template, or an Azure SDK). 
> - To prevent errors during resource access, the VM's MSI must be given at least "Reader" access at the appropriate scope (the VM or higher) to allow Azure Resource Manager operations on the VM. See [Assign a Managed Service Identity (MSI) access to a resource using the Azure portal](howto-assign-access-portal.md) for details.

## Overview

An MSI provides a [service principal object](../develop/developer-glossary.md#service-principal-object) 
, which is [created upon enabling MSI](overview.md#how-does-it-work) on the VM. The service principal can be given access to Azure resources, and used as an identity by script/command-line clients for sign in and resource access. Traditionally, in order to access secured resources under its own identity, a script client would need to:  

   - be registered and consented with Azure AD as a confidential/web client application
   - sign in under its service principal, using the app's credentials (which are likely embedded in the script)

With MSI, your script client no longer needs to do either, as it can sign in under the MSI service principal. 

## Azure CLI

The following script demonstrates how to:

1. Sign in to Azure AD under the VM's MSI service principal  
2. Call Azure Resource Manager and get the VM's service principal ID. CLI takes care of managing token acquisition/use for you automatically. Be sure to substitute your virtual machine name for `<VM-NAME>`.  

   ```azurecli
   az login --identity
   
   spID=$(az resource list -n <VM-NAME> --query [*].identity.principalId --out tsv)
   echo The MSI service principal ID is $spID
   ```

## Azure PowerShell

The following script demonstrates how to:

1. Sign in to Azure AD under the VM's MSI service principal  
2. Call an Azure Resource Manager cmdlet to get information about the VM. PowerShell takes care of managing token use for you automatically.  

   ```azurepowershell
   Add-AzureRmAccount -identity

   # Call Azure Resource Manager to get the service principal ID for the VM's MSI. 
   $vmInfoPs = Get-AzureRMVM -ResourceGroupName <RESOURCE-GROUP> -Name <VM-NAME>
   $spID = $vmInfoPs.Identity.PrincipalId
   echo "The MSI service principal ID is $spID"
   ```

## Resource IDs for Azure services

See [Azure services that support Azure AD authentication](services-support-msi.md#azure-services-that-support-azure-ad-authentication) for a list of resources that support Azure AD and have been tested with MSI, and their respective resource IDs.

## Error handling guidance 

Responses such as the following may indicate that the VM's MSI has not been correctly configured:

- PowerShell: *Invoke-WebRequest : Unable to connect to the remote server*
- CLI: *MSI: Failed to retrieve a token from 'http://localhost:50342/oauth2/token' with an error of 'HTTPConnectionPool(host='localhost', port=50342)* 

If you receive one of these errors, return to the Azure VM in the [Azure portal](https://portal.azure.com) and:

- Go to the **Configuration** page and ensure "Managed service identity" is set to "Yes."
- Go to the **Extensions** page and ensure the MSI extension deployed successfully.

If either is incorrect, you may need to redeploy the MSI on your resource again, or troubleshoot the deployment failure. See [Configure a VM Managed Service Identity (MSI) using the Azure portal](qs-configure-portal-windows-vm.md) if you need assistance with VM configuration.

## Related content

- To enable MSI on an Azure VM, see [Configure a VM Managed Service Identity (MSI) using PowerShell](qs-configure-powershell-windows-vm.md), or [Configure a VM Managed Service Identity (MSI) using Azure CLI](qs-configure-cli-windows-vm.md)

Use the following comments section to provide feedback and help us refine and shape our content.








