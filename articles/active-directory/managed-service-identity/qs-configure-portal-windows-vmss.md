---
title: Configure Managed Service Identity on an Azure virtual machine scale set using the Azure portal
description: Step by step instructions for configuring a Managed Service Identity on Azure VMSS, using the Azure portal.
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
ms.date: 02/20/2018
ms.author: daveba
---

# Configure a virtual machine scale set Managed Service Identity using the Azure portal

[!INCLUDE[preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

Managed Service Identity provides Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code. 

In this article, you will learn how to enable and disable system and user assigned identity for a virtual machine scale set using the Azure portal.

## Prerequisites

- If you're unfamiliar with Managed Service Identity, check out the [overview section](overview.md).
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.
- To perform the management operations in this article, your account needs the following role assignment:
    - [Virtual Machine Contributor](/azure/role-based-access-control/built-in-roles#virtual-machine-contributor) to enable and remove system assigned managed identity from a virtual machine scale set.

## System assigned identity 

In this section, you will learn how to enable and disable the system assigned identity on a virtual machine scale set using the Azure portal.

### Enable system assigned identity during creation of a virtual machine scale set

Currently, the Azure portal does not support enabling system assigned identity during the creation of a virtual machine scale set. Instead, refer to the following virtual machine scale set creation Quickstart article to first create a virtual machine scale set, and then proceed to the next section for details on enabling system assigned identity on a virtual machine scale set:

- [Create a Virtual Machine Scale Set in the Azure portal](../../virtual-machine-scale-sets/quick-create-portal.md)  

### Enable system assigned identity on an existing virtual machine scale set

To enable the system assigned identity on a virtual machine scale set that was originally provisioned without it:

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with the Azure subscription that contains the virtual machine scale set.

2. Navigate to the desired virtual machine scale set.

3. Enable the system assigned identity on the VM by selecting "Yes" under "Managed service identity" and then click **Save**. This operation can take 60 seconds or more to complete:

   [![Configuration page screenshot](../managed-service-identity/media/msi-qs-configure-portal-windows-vmss/create-windows-vmss-portal-configuration-blade.png)](../managed-service-identity/media/msi-qs-configure-portal-windows-vmss/create-windows-vmss-portal-configuration-blade.png#lightbox)  

## Remove system assigned identity from a virtual machine scale set

If you have a virtual machine scale set that no longer needs a Managed Service Identity:

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with the Azure subscription that contains the virtual machine scale set. Also make sure your account belongs to a role that gives you write permissions on the virtual machine scale set.

2. Navigate to the desired virtual machine scale set.

3. Disable the system assigned identity on the VM by selecting "No" under "Managed service identity", then click Save. This operation can take 60 seconds or more to complete:

   ![Configuration page screenshot](../managed-service-identity/media/msi-qs-configure-portal-windows-vmss/disable-windows-vmss-portal-configuration-blade.png)

## User assigned identity

In this section, you will learn how to add and remove a user assigned identity from a virtual machine scale set using the Azure portal.

### Assign a user assigned identity during the creation of a virtual machine scale set

Currently, the Azure portal does not support assigning a user assigned identity during the creation of a virtual machine scale set. Instead, refer to the following virtual machine scale set creation Quickstart article to first create a virtual machine scale set, and then proceed to the next section for details on assigning a user assigned identity to it:

- [Create a Virtual Machine Scale Set in the Azure portal](../../virtual-machine-scale-sets/quick-create-portal.md)

### Assign a user assigned identity to an existing virtual machine scale set

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with the Azure subscription that contains the virtual machine scale set.
2. Navigate to the desired virtual machine scale set and click **Identity**, **User assigned** and then **\+Add**.

   ![Add user assigned identity to VMSS](./media/msi-qs-configure-portal-windows-vm/add-user-assigned-identity-vmss-screenshot1.png)

3. Click the user assigned identity you want to add to the virtual machine scale set and then click **Add**.
   
   ![Add user assigned identity to VMSS](./media/msi-qs-configure-portal-windows-vm/add-user-assigned-identity-vm-screenshot2.png)

### Remove a user assigned identity from a virtual machine scale set

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with the Azure subscription that contains the VM.
2. Navigate to the desired virtual machine scale set and click **Identity**, **User assigned**, the name of the user assigned identity you want to delete and then click **Remove** (click **Yes** in the confirmation pane).

   ![Remove user assigned identity from a VMSS](./media/msi-qs-configure-portal-windows-vm/remove-user-assigned-identity-vmss-screenshot.png)


## Related Content

- For an overview of Managed Service Identity, see [overview](overview.md).

## Next steps

- Using the Azure portal, give an Azure virtual machine scale set Managed Service Identity [access to another Azure resource](howto-assign-access-portal.md).

Use the following comments section to provide feedback and help us refine and shape our content.
