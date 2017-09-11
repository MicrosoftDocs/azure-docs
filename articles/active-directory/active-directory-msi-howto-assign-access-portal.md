---
title: How to assign an MSI access to a resource, using the Azure portal
description: Step by step instructions for assigning an MSI on one resource, access to another resource, using the Azure portal.
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
ms.date: 09/14/2017
ms.author: bryanla
---

# How to assign an MSI access to a resource, using the Azure portal

Once you've configured an Azure resource with an MSI, you can use the MSI as an identity when enabling access to another resource. This example shows you how to give an Azure virtual machine access to an Azure storage account.

## Use RBAC to assign the MSI access to another resource

If you have a VM that was originally provisioned without an MSI:

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with the Azure subscription under which you have configured a resource with an MSI.

2. Navigate to the desired resource on which you want to modify access control. In this example, we are giving an Azure VM access to a storage account.

2. Click the "Access control (IAM)" page of the resource on which you want to modify access control:

   ![Configuration page screenshot](./media/active-directory-msi-qs-configure-portal-windows-vm/create-windows-vm-portal-configuration-blade.png)  

  

## Related content

- For an overview of MSI, see [Managed Service Identity overview](../active-directory/active-directory-msi-overview.md).
- This article is adapted from the [Create a Windows virtual machine with the Azure portal](../virtual-machines/windows/quick-create-portal.md) QuickStart, modified to include MSI-specific instructions. 

## Next steps

- TODO: Assign an MSI access to Azure Resource Manager
- TODO: Get a token using Managed Service Identity 

Use the following comments section to provide feedback and help us refine and shape our content.

<!--Reference style links IN USE -->
[AAD-App-Branding]: ./active-directory-branding-guidelines.md

<!--Image references-->
[AAD-Sign-In]: ./media/active-directory-devhowto-multi-tenant-overview/sign-in-with-microsoft-light.png
