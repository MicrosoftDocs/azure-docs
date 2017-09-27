---
title: How to configure MSI on an Azure VM using the Azure SDKs
description: Step by step instructions for configuring a Managed Service Identity (MSI) on an Azure VM, using the Azure SDKs.
services: active-directory
documentationcenter: ''
author: bryanla
manager: mbaldwin
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/27/2017
ms.author: bryanla
---

# Configure a VM Managed Service Identity (MSI) using Azure SDKs

[!INCLUDE[preview-notice](../../includes/active-directory-msi-preview-notice.md)]

Managed Service Identity provides Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code. 

In this article, you learn how to enable and remove MSI for an Azure VM, using an Azure SDK.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../includes/msi-qs-configure-prereqs.md)]

## Enable MSI using an Azure SDK 

Azure supports multiple programming languages/frameworks through a series of [Azure SDKs](https://azure.microsoft.com/downloads). Several of them have been updated to support MSI, and provide corresponding samples to demonstrate usage. This list is updated as additional support is added:

| SDK | Sample |
| --- | ------ | 
| .NET   | [Manage resource from an MSI-enabled VM](https://azure.microsoft.com/resources/samples/aad-dotnet-manage-resources-from-vm-with-msi/) |
| Java   | [Manage Storage from an MSI-enabled VM](https://azure.microsoft.com/resources/samples/compute-java-manage-resources-from-vm-with-msi-in-aad-group/)|
| Node.js| [Create a VM with MSI enabled](https://azure.microsoft.com/resources/samples/compute-node-msi-vm/) |
|        | [Manage resources using Managed Service Identity](https://azure.microsoft.com/resources/samples/resources-node-manage-resources-with-msi/) |
| Python | [Create a VM with MSI enabled](https://azure.microsoft.com/resources/samples/compute-python-msi-vm/) |
|        | [Use MSI to authenticate simply from inside a VM](https://azure.microsoft.com/resources/samples/resource-manager-python-manage-resources-with-msi/) |
| Ruby   | [Create Azure VM with an MSI](https://azure.microsoft.com/resources/samples/compute-ruby-msi-vm/) |
|      | [Manage resources from an MSI-enabled VM](https://azure.microsoft.com/resources/samples/resources-ruby-manage-resources-with-msi/) | 

## Next steps

- For an overview of MSI and related content, see [Managed Service Identity overview](msi-overview.md).

Use the following comments section to provide feedback and help us refine and shape our content.
