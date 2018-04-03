---
title: How to use an Azure VM Managed Service Identity with Azure SDKs
description: Code samples for using Azure SDKs with an Azure VM MSI.
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
ms.date: 12/01/2017
ms.author: daveba
---

# How to use an Azure VM Managed Service Identity (MSI) with Azure SDKs 

[!INCLUDE[preview-notice](../../../includes/active-directory-msi-preview-notice.md)]  
This article provides a list of SDK samples, which demonstrate use of their respective Azure SDK's support for MSI.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../../includes/active-directory-msi-qs-configure-prereqs.md)]

> [!IMPORTANT]
> - All sample code/script in this article assumes the client is running on an MSI-enabled Virtual Machine. Use the VM "Connect" feature in the Azure portal, to remotely connect to your VM. For details on enabling MSI on a VM, see [Configure a VM Managed Service Identity (MSI) using the Azure portal](qs-configure-portal-windows-vm.md), or one of the variant articles (using PowerShell, CLI, a template, or an Azure SDK). 

## SDK code samples

| SDK             | Code sample |
| --------------- | ----------- |
| .NET            | [Deploy an Azure Resource Manager template from a Windows VM using Managed Service Identity](https://github.com/Azure-Samples/windowsvm-msi-arm-dotnet) |
| .NET Core       | [Call Azure services from a Linux VM using Managed Service Identity](https://github.com/Azure-Samples/linuxvm-msi-keyvault-arm-dotnet/) |
| Node.js         | [Manage resources using Managed Service Identity](https://azure.microsoft.com/resources/samples/resources-node-manage-resources-with-msi/) |
| Python          | [Use MSI to authenticate simply from inside a VM](https://azure.microsoft.com/resources/samples/resource-manager-python-manage-resources-with-msi/) |
| Ruby            | [Manage resources from an MSI-enabled VM](https://azure.microsoft.com/resources/samples/resources-ruby-manage-resources-with-msi/) |

## Related content

- See [Azure SDKs](https://azure.microsoft.com/downloads/) for the full list of Azure SDK resources, including library downloads, documentation, and more.
- To enable MSI on an Azure VM, see [Configure a VM Managed Service Identity (MSI) using the Azure portal](qs-configure-portal-windows-vm.md).

Use the following comments section to provide feedback and help us refine and shape our content.








