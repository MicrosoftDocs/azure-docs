---
title: How to configure an Managed Service Identity enabled Azure VM using an Azure SDK
description: Step by step instructions for configuring and using a Managed Service Identity on an Azure VM, using an Azure SDK.
services: active-directory
documentationcenter: ''
author: daveba
manager: mtillman
editor: ''

ms.service: active-directory
ms.component: msi
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/28/2017
ms.author: daveba
---

# Configure a VM-Managed Service Identity using an Azure SDK

[!INCLUDE[preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

Managed Service Identity provides Azure services with an automatically managed identity in Azure Active Directory (AD). You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code. 

In this article, you learn how to enable and remove Managed Service Identity for an Azure VM, using an Azure SDK.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../../includes/active-directory-msi-qs-configure-prereqs.md)]

## Azure SDKs with Managed Service Identity support 

Azure supports multiple programming platforms through a series of [Azure SDKs](https://azure.microsoft.com/downloads). Several of them have been updated to support Managed Service Identity, and provide corresponding samples to demonstrate usage. This list is updated as additional support is added:

| SDK | Sample |
| --- | ------ | 
| .NET   | [Manage resource from an MSI-enabled VM](https://azure.microsoft.com/resources/samples/aad-dotnet-manage-resources-from-vm-with-msi/) |
| Java   | [Manage storage from an MSI-enabled VM](https://azure.microsoft.com/resources/samples/compute-java-manage-resources-from-vm-with-msi-in-aad-group/)|
| Node.js| [Create a VM with MSI enabled](https://azure.microsoft.com/resources/samples/compute-node-msi-vm/) |
| Python | [Create a VM with MSI enabled](https://azure.microsoft.com/resources/samples/compute-python-msi-vm/) |
| Ruby   | [Create Azure VM with an MSI](https://azure.microsoft.com/resources/samples/compute-ruby-msi-vm/) |

## Next steps

- See related articles under "Configure Managed Service Identity for an Azure VM", to learn how you can also use the Azure portal, PowerShell, CLI, and resource templates.

Use the following comments section to provide feedback and help us refine and shape our content.
