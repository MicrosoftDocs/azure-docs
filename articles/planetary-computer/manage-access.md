---
title: Managing Access Controls in Microsoft Planetary Computer Pro
description: This article shows you how to manage role-based access control (RBAC) access to Microsoft Planetary Computer Pro.
author: prasadko
ms.author: prasadkomma
ms.service: azure
ms.topic: how-to
ms.date: 04/09/2025
#customer intent: I want to manage access to Microsoft Planetary Computer Pro.
---

# Manage access to Microsoft Planetary Computer Pro

This article shows you how to manage identities in [Microsoft Entra ID](/entra/fundamentals/whatis), and configure via Microsoft Planetary Computer Pro's (MPC Pro) role-based access control (RBAC) to grant the Microsoft Entra identities access to an MPC Pro resource.

## Prerequisites

- Azure account with an active subscription - [create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio)
- An existing [GeoCatalog resource](./deploy-geocatalog-resource.md)

## Users access

Follow [How to create, invite, and delete users](/entra/fundamentals/how-to-create-delete-users) to create and manage your desired type of users that you want to grant access to MPC Pro. Once you have the users created, you need to grant proper permissions to them to access MPC Pro resource via RBAC configuration. 

MPC Pro defines two resource specific roles, in addition to Azure built in roles:

| **Role**                          | **Description**                                                                                     | **RBAC Management** |
|------------------------------------|-----------------------------------------------------------------------------------------------------|----------------------|
| **GeoCatalog Administrator**       | Allows the user to read, write, and delete data inside a GeoCatalog                                 | No                   |
| **GeoCatalog Reader**              | Allows the user to only read GeoCatalogs data.                                                          | No                   |
| **Owner**                          | Azure built-in role that grants full access to all resources, including the ability to manage RBAC.  | Yes                  |
| **User Access Administrator**      | Azure built-in role that allows management of user access to Azure resources.                      | Yes                  |
| **Role Based Access Control Administrator** | Azure built-in role that allows management of RBAC assignments and permissions.                   | Yes                  |

> [!NOTE]
> **Owner** is also a **GeoCatalog Administrator**.

## Assigning Role Based Access Control to a user

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

- [Configure Application Authentication for Microsoft Planetary Computer Pro](./application-authentication.md)