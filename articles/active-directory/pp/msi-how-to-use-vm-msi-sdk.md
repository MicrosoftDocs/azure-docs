---
title: How to use a user-assigned Managed Service Identity from Azure SDKs on a VM
description: Code samples for using Azure SDKs with an user-assigned MSI on a VM.
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
ms.date: 12/22/2017
ms.author: daveba
ROBOTS: NOINDEX,NOFOLLOW
---

# Use Azure SDKs with a user-assigned Managed Service Identity (MSI)

[!INCLUDE[preview-notice](~/includes/active-directory-msi-preview-notice-ua.md)]

This article provides a list of SDK samples, which demonstrate use of their respective Azure SDK's support for user-assigned MSI.

## Prerequisites

[!INCLUDE [msi-core-prereqs](~/includes/active-directory-msi-core-prereqs-ua.md)]

> [!IMPORTANT]
> - All sample code/script in this article assumes the client is running on an MSI-enabled Virtual Machine. Use the VM "Connect" feature in the Azure portal, to remotely connect to your VM. For details on enabling MSI on a VM, see [Configure a VM Managed Service Identity (MSI) using the Azure CLI](msi-qs-configure-cli-windows-vm.md), or one of the variant articles (using PowerShell, Azure portal, a template, or an Azure SDK). 

## SDK code samples

| SDK             | Code sample |
| --------------- | ----------- |
| Python          | [Use MSI to authenticate simply from inside a VM](https://azure.microsoft.com/resources/samples/resource-manager-python-manage-resources-with-msi/) |
| Ruby            | [Manage resources from an MSI-enabled VM](https://azure.microsoft.com/resources/samples/resources-ruby-manage-resources-with-msi/) |

## Next steps

- See [Azure SDKs](https://azure.microsoft.com/downloads/) for the full list of Azure SDK resources, including library downloads, documentation, and more.

Use the following comments section to provide feedback and help us refine and shape our content.








