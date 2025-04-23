---
title: Manage access to Microsoft Planetary Computer Pro
description: This article shows you how to manage role-based access control (RBAC) access to Microsoft Planetary Computer Pro.
author: prasadkomma
ms.author: prasadkomma
ms.service: planetary-computer
ms.topic: how-to
md.date: 04/09/2025
#customer intent: I want to manage access to Microsoft Planetary Computer Pro.
---

# Manage access to Microsoft Planetary Computer Pro

This article shows you how to manage identities in Microsoft Entra ID, and configure via Microsoft Planetary Computer Pro's (MPC Pro) role-based access control (RBAC) to grant the Microsoft Entra identities access to an MPC Pro resource.

## Prerequisites

- Azure account with an active subscription - [create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio)
- An existing GeoCatalog resource.

## Users access

(Optional) For organizations who are moving their directory from on-premises to the cloud, they first need to decide on which authentication methods to choose, see [Choose the correct authentication method for your Microsoft Entra hybrid identity solution](/azure/active-directory/hybrid/choose-ad-authn). Microsoft Entra ID allows different types of users to be created in your tenant. Follow [How to create, invite, and delete users](/entra/fundamentals/how-to-create-delete-users) to create and manage your desired type of users that you want to grant access to MPC Pro. Once you have the users created, you need to grant proper permissions to them to access MPC Pro resource via RBAC configuration. MPC Pro defines two resource specific roles, in addition to Azure built in roles:

> [!NOTE]
> The **GeoCatalog Administrator** allows the user to read, write, and delete against the GeoCatalog, but not allowed to manage RBAC. The **GeoCatalog Reader** allows the user to read GeoCatalogs only. For more details of each role, you can run az command like 
>> ``az role definition list --name "GeoCatalog Administrator"``

> [!NOTE]
> Other Azure built-in roles including **Owner**, **User Access Administrator**, and **Role Based Access Control Administrator** allow users to manage RBAC.

Here's an example of how to configure MPC Pro RBAC to grant **GeoCatalog Administrator** role to a user.

1. Within Azure portal, go to MPC Pro resource **Access control (IAM)** tab in the left sidebar:

    :::image type="content" source="media/RBAC_IAM_blade.png" alt-text="Screenshot of the Access control (IAM) tab in the Azure portal, showing options to manage role assignments.":::

1. Select on **Add role Assignment** and then select **GeoCatalog Administrator** under **Job function roles**:

    :::image type="content" source="media/RBAC_role_assigment.png" alt-text="Screenshot showing the RBAC role assignment options in the Azure portal.":::

1. Select on **Next** button and then select radio button of **User, group, or service principal**:

    :::image type="content" source="media/RBAC_members_section.png" alt-text="Screenshot showing the members section during RBAC role assignment in the Azure portal.":::

1. Select on **Select members** and search for the user on the **Select members** pane on the right-hand side. Repeat the step for any other users to be selected.

1. Select on **Next** to verify the information and finish **review + assign**.

Now the selected users are able to access MPC Pro resource, either through Azure portal or APIs.

## Related content

- [Managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview)
- [Managed identities for App Service and Azure Functions](/azure/app-service/overview-managed-identity?tabs=portal%2Chttp)
- [Create, invite, and delete users](/entra/fundamentals/how-to-create-delete-users)