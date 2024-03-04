---
title: Assign a managed identity access to a resource using the Azure portal
description: Step-by-step instructions for assigning a managed identity on one resource access to another resource, by using the Azure portal.
services: active-directory
documentationcenter: 
author: barclayn
manager: amycolannino
editor: 

ms.custom: subject-rbac-steps
ms.service: active-directory
ms.subservice: msi
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 01/11/2022
ms.author: barclayn
ms.collection: M365-identity-device-management
---

# Assign a managed identity access to a resource by using the Azure portal

[!INCLUDE [preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

After you've configured an Azure resource with a managed identity, you can give the managed identity access to another resource, just like any security principal. This article shows you how to give an Azure virtual machine or virtual machine scale set's managed identity access to an Azure storage account, by using the Azure portal.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md). **Be sure to review the [difference between a system-assigned and user-assigned managed identity](overview.md#managed-identity-types)**.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.

## Use Azure RBAC to assign a managed identity access to another resource

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

>[!IMPORTANT]
> The steps outlined below show is how you grant access to a service using Azure RBAC. Check specific service documentation on how to grant access - for example check Azure Data Explorer for instructions. Some Azure services are in the process of adopting Azure RBAC on the data plane

After you've enabled managed identity on an Azure resource, such as an [Azure VM](qs-configure-portal-windows-vm.md) or [Azure virtual machine scale set](qs-configure-portal-windows-vmss.md):

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with the Azure subscription under which you have configured the managed identity.

2. Navigate to the desired resource on which you want to modify access control. In this example, we are giving an Azure virtual machine access to a storage account, so we navigate to the storage account.

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the Add role assignment page.

1. Select the role and managed identity. For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

    ![Add role assignment page in Azure portal.](../../../includes/role-based-access-control/media/add-role-assignment-page.png)
     
## Next steps

- [Managed identity for Azure resources overview](overview.md)
- To enable managed identity on an Azure virtual machine, see [Configure managed identities for Azure resources on a VM using the Azure portal](qs-configure-portal-windows-vm.md).
- To enable managed identity on an Azure virtual machine scale set, see [Configure managed identities for Azure resources on a virtual machine scale set using the Azure portal](qs-configure-portal-windows-vmss.md).
