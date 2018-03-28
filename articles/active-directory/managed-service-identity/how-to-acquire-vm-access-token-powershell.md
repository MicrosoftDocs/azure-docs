---
title: How to use an Azure VM Managed Service Identity to acquire an access token using PowerShell
description: Instructions and for using an Azure VM MSI to acquire an OAuth access token using PowerShell.
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
ms.date: 03/28/2018
ms.author: daveba
---

# How to use an Azure VM Managed Service Identity (MSI) to acquire an access token using PowerShell

This article provides a PowerShell script example for token acquisition.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../../includes/active-directory-msi-qs-configure-prereqs.md)]

If you plan to use the Azure PowerShell example in this article, be sure to install the latest version of [Azure PowerShell](https://www.powershellgallery.com/packages/AzureRM).


> [!IMPORTANT]
> - All sample code/script in this article assumes the client is running on an MSI-enabled Virtual Machine. Use the VM "Connect" feature in the Azure portal, to remotely connect to your VM. For details on enabling MSI on a VM, see [Configure a VM Managed Service Identity (MSI) using the Azure portal](qs-configure-portal-windows-vm.md), or one of the variant articles (using PowerShell, CLI, a template, or an Azure SDK). 

## Overview

A client application can request an MSI [app-only access token](../develop/active-directory-dev-glossary.md#access-token) for accessing a given resource. The token is [based on the MSI service principal](overview.md#how-does-it-work). As such, there is no need for the client to register itself to obtain an access token under its own service principal. The token is suitable for use as a bearer token in
[service-to-service calls requiring client credentials](../develop/active-directory-protocols-oauth-service-to-service.md).

## Get a token using Azure PowerShell

The following example demonstrates how to use the MSI REST endpoint from a PowerShell client to:

1. Acquire an access token.
2. Use the access token to call an Azure Resource Manager REST API and get information about the VM. Be sure to substitute your subscription ID, resource group name, and virtual machine name for `<SUBSCRIPTION-ID>`, `<RESOURCE-GROUP>`, and `<VM-NAME>`, respectively.

```azurepowershell
# Get an access token for the MSI
$response = Invoke-WebRequest -Uri http://localhost:50342/oauth2/token `
                              -Method GET -Body @{resource="https://management.azure.com/"} -Headers @{Metadata="true"}
$content =$response.Content | ConvertFrom-Json
$access_token = $content.access_token
echo "The MSI access token is $access_token"

# Use the access token to get resource information for the VM
$vmInfoRest = (Invoke-WebRequest -Uri https://management.azure.com/subscriptions/<SUBSCRIPTION-ID>/resourceGroups/<RESOURCE-GROUP>/providers/Microsoft.Compute/virtualMachines/<VM-NAME>?api-version=2017-12-01 -Method GET -ContentType "application/json" -Headers @{ Authorization ="Bearer $access_token"}).content
echo "JSON returned from call to get VM info:"
echo $vmInfoRest

```
## Related content

- To enable MSI on an Azure VM, see [Configure a VM Managed Service Identity (MSI) using the Azure portal](qs-configure-portal-windows-vm.md).










