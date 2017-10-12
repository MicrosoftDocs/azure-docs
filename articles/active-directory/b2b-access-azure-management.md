---
title: How to grant external users authorization to access Azure
description: Provides an overview of how to authorize users outside of your tenant (external users) access to Azure resources.
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
ms.date: 10/17/2017
ms.author: bryanla
---

# Grant external users authorization to access Azure

[!INCLUDE[preview-notice](../../includes/active-directory-msi-preview-notice.md)]

User accounts that exist outside of your tenant are called "external users", from an Azure Active Directory (AD) perspective. In some cases, you many need to authorize those users to have the ability to perform limited management of Azure resources. This article provides an overview of the process.

## How to authorize external users

To grant someone from outside your organization access to manage Azure:

1. Enter their email address when assigning a role.  
2. An invitation will be sent to that email address. The person who receives the mail can redeem the invite using a Microsoft personal or work/school account.  
3. A guest user will be created in your AAD tenant, and the guest user will be given the role assignment.

With a nice screenshot.  

## Azure B2B

Fo

## Related content

- For an overview of MSI, see [Managed Service Identity overview](msi-overview.md).
- To enable MSI on an Azure VM, see [Configure an Azure VM Managed Service Identity (MSI) using Azure CLI](msi-qs-configure-cli-windows-vm.md).

Use the following comments section to provide feedback and help us refine and shape our content.

