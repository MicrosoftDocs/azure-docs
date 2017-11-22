---
title: How to use an Azure VM Managed Service Identity with Azure SDKs
description: Code samples for using Azure SDKs with an Azure VM MSI.
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
ms.date: 11/23/2017
ms.author: bryanla
---

# How to use an Azure VM Managed Service Identity (MSI) with Azure SDKs 

[!INCLUDE[preview-notice](../../includes/active-directory-msi-preview-notice.md)]
A VM Managed Service Identity makes two important features available to client applications running on the VM:

1. An MSI [**service principal**](develop/active-directory-dev-glossary.md#service-principal-object), which is [created upon enabling MSI](msi-overview.md#how-does-it-work) on the VM. The service principal can then be given access to Azure resources, and used as an identity by client applications during sign-in and resource access. Traditionally, in order for a client to be able to access secured resources under its own identity, it must:  

   - be registered with Azure AD as a confidential/web client application, and consented for use by a tenant's user(s)/admin
   - sign in under its service principal, using the ID+secret credentials generated during registration (which are likely embedded in the client code)

  With MSI, your client application no longer needs to do either, as it can sign in under the MSI service principal. 

2. An [**app-only access token**](develop/active-directory-dev-glossary.md#access-token), which is issued to a client [based on the MSI service principal](msi-overview.md#how-does-it-work) for access a given resource's API(s). As such, there is also no need for the client to register itself to obtain an access token under its own service principal. The token is suitable for use as a bearer token in [service-to-service calls requiring client credentials](active-directory-protocols-oauth-service-to-service.md).

This article provides a list of SDK samples, which demonstrate use of their respective Azure SDK's support for MSI.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../includes/active-directory-msi-qs-configure-prereqs.md)]

> [!IMPORTANT]
> - All sample code/script in this article assumes the client is running on an MSI-enabled Virtual Machine. Use the VM "Connect" feature in the Azure portal, to remotely connect to your VM. For details on enabling MSI on a VM, see [Configure a VM Managed Service Identity (MSI) using the Azure portal](msi-qs-configure-portal-windows-vm.md), or one of the variant articles (using PowerShell, CLI, a template, or an Azure SDK). 

## Code examples

| Client language | Code sample |
| --------------- | ----------- |
| .NET            | [Deploy an ARM template from a Windows VM using Managed Service Identity](https://github.com/Azure-Samples/windowsvm-msi-arm-dotnet) |
| .NET Core       | [Call Azure services from a Linux VM using Managed Service Identity](https://github.com/Azure-Samples/linuxvm-msi-keyvault-arm-dotnet/) |
| Node.js         | [Manage resources using Managed Service Identity](https://azure.microsoft.com/resources/samples/resources-node-manage-resources-with-msi/) |
| Python          | [Use MSI to authenticate simply from inside a VM](https://azure.microsoft.com/resources/samples/resource-manager-python-manage-resources-with-msi/) |
| Ruby            | [Manage resources from an MSI-enabled VM](https://azure.microsoft.com/resources/samples/resources-ruby-manage-resources-with-msi/) |

## Related content

- See [Azure SDKs](https://azure.microsoft.com/downloads/) for the full list of Azure SDK resources, including library downloads, documentation, and more.
- To enable MSI on an Azure VM, see [Configure a VM Managed Service Identity (MSI) using the Azure portal](msi-qs-configure-portal-windows-vm.md).

Use the following comments section to provide feedback and help us refine and shape our content.








