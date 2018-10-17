---
title: How to manage a user-assigned managed identity using the Azure portal
description: Step by step instructions on how to create, list, delete and assign a role to a user-assigned managed identity.
services: active-directory
documentationcenter: 
author: daveba
manager: mtillman
editor: 

ms.service: active-directory
ms.component: msi
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/16/2018
ms.author: daveba
---

# Create, list, delete or assign a role to a user-assigned managed identity using the Azure portal

[!INCLUDE [preview-notice](~/includes/active-directory-msi-preview-notice-ua.md)]

Managed identities for Azure resources provides Azure services with a managed identity in Azure Active Directory. You can use this identity to authenticate to services that support Azure AD authentication, without needing credentials in your code. 

In this article, you learn how to create, list, delete or assign a role to a user-assigned managed identity using the Azure Portal.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md). **Be sure to review the [difference between a system-assigned and user-assigned managed identity](overview.md#how-does-it-work)**.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.
- To perform the management operations in this article, your account needs the following role assignments:
    - [Managed Identity Contributor](/azure/role-based-access-control/built-in-roles#managed-identity-contributor) role to create, read (list), update, and delete a user-assigned managed identity.
    - [Managed Identity Operator](/azure/role-based-access-control/built-in-roles#managed-identity-operator) role to read (list) the properties of a user-assigned managed identity.

## Create a user-assigned managed identity

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with the Azure subscription to create the user-assigned managed identity.
2. In the search box, type *Managed Identities*, and under **Services**, click **Managed Identities**.
3. Click **Add** and enter values in the following fields under **Create user assigned managed** identity pane:
   - **Resource Name**: This is the name for your user-assigned managed identity, for example UAI1.
   - **Subscription**: Choose the subscription to create the user-assigned managed identity under
   - **Resource Group**: Create a new resource group to contain your user-assigned managed identity or choose **Use existing** to create the user-assigned managed identity in an existing resource group.
   - **Location**: Choose a location to deploy the user-assigned managed identity,for example **West US**.
4. Click **Create**.

![Create a user-assigned managed identity](./media/how-to-manage-ua-identity-portal/create-user-assigned-managed-identity-portal.png)

## List user-assigned managed identities

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with the Azure subscription to list the user-assigned managed identities.
2. In the search box, type *Managed Identities*, and under Services, click **Managed Identities**.
3. A list of the user-assigned managed identities for your subscription is returned.  To see the details of a user-assigned managed identity click its name.

![List user-assigned managed identity](./media/how-to-manage-ua-identity-portal/list-user-assigned-managed-identity-portal.png)

## Delete a user-assigned managed identity

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with the Azure subscription to delete a user-assigned managed identity.
2. Select the user-assigned managed identity and click **Delete**.
3. Under the confirmation box choose, **Yes**.

![Delete user-assigned managed identity](./media/how-to-manage-ua-identity-portal/delete-user-assigned-managed-identity-portal.png)

## Assign a role to a user-assigned managed identity 

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with the Azure subscription to list the user-assigned managed identities.
2. In the search box, type *Managed Identities*, and under Services, click **Managed Identities**.
3. A list of the user-assigned managed identities for your subscription is returned.  Select the user-assigned managed identity that you want to assign a role.
4. Select **Access control (IAM)** and then select **Add**.

   ![User-assigned managed identity start](./media/how-to-manage-ua-identity-portal/assign-role-screenshot1.png)

5. In the Add permissions blade, configure the following values and then click **Save**:
   - **Role** - the role to assign
   - **Assign access to**  - the resource to assign the user-assigned managed identity
   - **Select** - the member to assign access
   
   ![User-assigned managed identity IAM](./media/how-to-manage-ua-identity-portal/assign-role-screenshot2.png)  