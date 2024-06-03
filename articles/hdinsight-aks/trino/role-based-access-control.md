---
title: Configure Role Based Access Control
description: How to provide Role Based Access Control
ms.service: hdinsight-aks
ms.topic: how-to 
ms.date: 08/29/2023
---

# Configure Role Based Access Control

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

This article describes how to provide Role Based Access Control and auto assign users to Apache Superset roles. This Role Based Access Control enables you to manage user groups in Microsoft Entra ID but configure access permissions in Superset. 
For example, if you have a security group called `datateam`, you can propagate membership of this group to Superset, which means Superset can automatically deny access if a user is removed from this security group.

1. Create a role that forbids access to Superset.

    Create a `NoAccess` role in Superset that prevents users from running queries or performing any operations.
    This role is the default role that users get assigned to if they don't belong to any other group.

    1. In Superset, select "Settings" (on the top right) and choose "List Roles."

    1. Select the plus symbol to add a new role.

    1. Give the following details for the new role.
          Name: NoAccess
          Permissions: `[can this form get on UserInfoEditView]`

    1. Select “Save.”

1. Configure Superset to automatically assign roles.

    Replace the `automatic registration of users` section in the Helm chart with the following example:

    ```yaml
        # **** Automatic registration of users
        # Map Authlib roles to superset roles
        # Will allow user self-registration, allowing to create Flask users from Authorized User
        AUTH_USER_REGISTRATION = True
        # The default user self-registration role
        AUTH_USER_REGISTRATION_ROLE = "NoAccess"
        AUTH_ROLES_SYNC_AT_LOGIN = True
        # The role names here are the roles that are auto created by Superset.
        # You may have different requirements.
        AUTH_ROLES_MAPPING = {
          "Alpha": ["Admin"],
          "Public": ["Public"],
          "Alpha": ["Alpha"],
          "Gamma": ["Gamma"],
          "granter": ["granter"],
          "sqllab": ["sql_lab"],
        }
        # **** End automatic registration of users
    ```

## Redeploy Superset

```bash
helm repo update
helm upgrade --install --values values.yaml superset superset/superset
```

1. Modify Microsoft Entra App Registration.

   Search for your application in Microsoft Entra ID and select your app under the "app registration" heading.
   Edit your app registration's roles by selecting "App roles" from the left navigation, and add all of the Superset roles you would like to use. It's recommended you add at least the Admin and Public roles.

    |Value|Display Name|Description|Allowed Member Types|
    |-|-|-|-|
    |Admin|Admin|Superset administrator|Users/Groups|
    |Public|Public|Superset user|Users/Groups|

    Example:

    :::image type="content" source="./media/role-based-access-control/role-assignment.png" alt-text="Screenshot showing role assignments in Microsoft Entra app roles.":::

1. Assign User Roles in Enterprise App Registration.

    1. Search for your application again in Microsoft Entra ID but this time, select your application under the heading "enterprise applications."
    
    1. Select "Users and groups" from the left navigation and add yourself to the admin role, and any other groups or users you want to assign at this time.

1. Open Superset and verify login.

    1. Log out of Superset and log in again. 

    1. Select "Settings" in the top right and choose "Profile."
  
    1. Verify you have the Admin role.
      
       :::image type="content" source="./media/role-based-access-control/admin-role.png" alt-text="Screenshot showing Admin role in Superset is labeled on profile.":::

## Next steps

* [Expose Apache Superset to Internet](./configure-ingress.md)
