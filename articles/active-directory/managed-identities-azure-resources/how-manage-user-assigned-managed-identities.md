---
title: Manage user assigned managed identities
description: Create user assigned managed identities
services: active-directory
author: barclayn
manager: daveba
editor: 
ms.service: active-directory
ms.subservice: msi
ms.devlang: 
ms.topic: how-to
ms.workload: identity
ms.date: 06/07/2021
ms.author: barclayn
zone_pivot_groups: identity-mi-methods
---

# Manage user-assigned managed identities


Managed identities for Azure resources eliminate the need to manage credentials in code. They allow you to get an Azure active directory token your applications can use when accessing resources that support Azure Active Directory authentication. Azure manages the identity so you don't have to. There are two types of managed identities – system-assigned and user-assigned. The main difference between the two types is that system assigned managed identities have their lifecycle linked to the resource where they are used. User assigned managed identities may be used on multiple resources. You can learn more about managed identities in the managed identities [overview](../overview.md). 

::: zone pivot="identity-mi-methods-azp"

In this article, you learn how to create, list, delete, or assign a role to a user-assigned managed identity using the Azure portal

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md). **Be sure to review the [difference between a system-assigned and user-assigned managed identity](overview.md#managed-identity-types)**.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.

## Create a user-assigned managed identity

To create a user-assigned managed identity, your account needs the [Managed Identity Contributor](../../role-based-access-control/built-in-roles.md#managed-identity-contributor) role assignment.

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with the Azure subscription to create the user-assigned managed identity.
2. In the search box, type *Managed Identities*, and under **Services**, click **Managed Identities**.
3. Click **Add** and enter values in the following fields under **Create user assigned managed** identity pane:
    - **Subscription**: Choose the subscription to create the user-assigned managed identity under.
    - **Resource group**: Choose a resource group to create the user-assigned managed identity in or click **Create new** to create a new resource group.
    - **Region**: Choose a region to deploy the user-assigned managed identity, for example **West US**.
    - **Name**: This is the name for your user-assigned managed identity, for example UAI1.
    ![Create a user-assigned managed identity](media/how-to-manage-ua-identity-portal/create-user-assigned-managed-identity-portal.png)
4. Click **Review + create** to review the changes.
5. Click **Create**.

## List user-assigned managed identities

To list/read a user-assigned managed identity, your account needs the [Managed Identity Operator](../../role-based-access-control/built-in-roles.md#managed-identity-operator) or [Managed Identity Contributor](../../role-based-access-control/built-in-roles.md#managed-identity-contributor) role assignment.

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with the Azure subscription to list the user-assigned managed identities.
2. In the search box, type *Managed Identities*, and under Services, click **Managed Identities**.
3. A list of the user-assigned managed identities for your subscription is returned.  To see the details of a user-assigned managed identity click its name.

![List user-assigned managed identity](media/how-to-manage-ua-identity-portal/list-user-assigned-managed-identity-portal.png)

## Delete a user-assigned managed identity

To delete a user-assigned managed identity, your account needs the [Managed Identity Contributor](../../role-based-access-control/built-in-roles.md#managed-identity-contributor) role assignment.

Deleting a user assigned identity does not remove it from the VM or resource it was assigned to.  To remove the user assigned identity from a VM see, [Remove a user-assigned managed identity from a VM](qs-configure-portal-windows-vm.md#remove-a-user-assigned-managed-identity-from-a-vm).

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with the Azure subscription to delete a user-assigned managed identity.
2. Select the user-assigned managed identity and click **Delete**.
3. Under the confirmation box choose, **Yes**.

![Delete user-assigned managed identity](media/how-to-manage-ua-identity-portal/delete-user-assigned-managed-identity-portal.png)

## Assign a role to a user-assigned managed identity 

To assign a role to a user-assigned managed identity, your account needs the [User Access Administrator](../../../role-based-access-control/built-in-roles.md#user-access-administrator) role assignment.

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with the Azure subscription to list the user-assigned managed identities.
2. In the search box, type *Managed Identities*, and under Services, click **Managed Identities**.
3. A list of the user-assigned managed identities for your subscription is returned.  Select the user-assigned managed identity that you want to assign a role.
4. Select **Access control (IAM)**, and then select **Add role assignment**.

   ![User-assigned managed identity start](media/how-to-manage-ua-identity-portal/assign-role-screenshot1.png)

5. In the Add role assignment blade, configure the following values, and then click **Save**:
   - **Role** - the role to assign
   - **Assign access to**  - the resource to assign the user-assigned managed identity
   - **Select** - the member to assign access
   
   ![User-assigned managed identity IAM](media/how-to-manage-ua-identity-portal/assign-role-screenshot2.png)



::: zone-end

::: zone pivot="identity-mi-methods-azcli"

[!INCLUDE [CLI](includes/create-user-assigned-managed-identities-cli.md)]

::: zone-end

::: zone pivot="identity-mi-methods-powershell"

[!INCLUDE [PowerShell](includes/create-user-assigned-managed-identities-powershell.md)]

::: zone-end


::: zone pivot="identity-mi-methods-arm"

[!INCLUDE [Resource Manager](includes/create-user-assigned-managed-identities-arm.md)]

::: zone-end




