---
title: Configure deployment environments project admin access
titleSuffix: Azure Deployment Environments
description: Learn how to configure access for dev managers by using the DevCenter Project Admin built-in role.
ms.service: deployment-environments
ms.custom: ignite-2022
ms.author: rosemalcolm
author: RoseHJM
ms.date: 10/12/2022
ms.topic: how-to
---

# Provide access to Dev Managers 

You can create multiple projects associated with the dev center to align with each team's specific requirements. By using the built-in DevCenter Project Admin role, you can delegate project administration to a member of a team. Project Admins can configure [project environment types](concept-environments-key-concepts.md#project-environment-types) to enable developers to create different types of [environments](concept-environments-key-concepts.md#environments) and apply different settings to each environment type. 

The DevCenter Project Admin role can be assigned at either the project level or the specific project environment type level.

Based on the scope that users are granted access to, a DevCenter Project Admin can:

* View, add, update, disable or delete the project environment types
* Create an environment
* Read, write, delete, or perform actions (deploy, reset, etc.) on their own environment
* Read, delete, or perform actions (deploy, reset, etc.) on environments created by other users

When the role is assigned at the project level, the DevCenter Project Admin can perform the actions listed above on all environment types at the Project level. When the role is assigned to specific environment type(s), the DevCenter Project Admin can perform the actions only on the respective environment type(s).

## Assign permissions to dev managers to a project

1. Select the project you want to provide your development team members access to.
2. Select **Access Control(IAM)** from the left menu.

   :::image type="content" source=".\media\configure-project-admin\access-control-page.png" alt-text="Screenshot showing link to access control page.":::

3. Select **Add** > **Add role assignment**.

   :::image type="content" source=".\media\configure-project-admin\add-role-assignment.png" alt-text="Screenshot showing Add role assignment menu option.":::

4. On the Add role assignment page, on the Role tab, search for *DevCenter Project Admin*, select the **DevCenter Project Admin** built-in role, and then select **Next**.

   :::image type="content" source=".\media\configure-project-admin\built-in-role.png" alt-text="Screenshot showing built-in DevCenter project admin role.":::

5. On the Members tab, select **+ Select Members**.

    :::image type="content" source=".\media\configure-project-admin\select-role-members.png" alt-text="Screenshot showing link to select role members pane.":::
 
1. In **Select members**, select the Active Directory Users or Groups you want to add, and then select **Select**.

7. On the Members tab, select **Review + assign**.

The user will now be able to view the project and manage all the Environment Types that have been enabled within it. DevCenter Project Admin can also [create environments from the CLI](./quickstart-create-access-environments.md).

## Assign permissions to dev managers to a specific environment type

1. Select the project you want to provide your development team members access to.
2. Select **Environment Types** and select the **...** beside the specific environment type.

   :::image type="content" source=".\media\configure-project-admin\project-environment-types.png" alt-text="Screenshot showing the environment types associated with a project.":::

3. Select **Access Control**.

   :::image type="content" source=".\media\configure-project-admin\access-control-page.png" alt-text="Screenshot showing link to access control page.":::

4. Select **Add** > **Add role assignment**.

   :::image type="content" source=".\media\configure-project-admin\add-role-assignment.png" alt-text="Screenshot showing Add role assignment menu option.":::

5. On the Add role assignment page, on the Role tab, search for **DevCenter Project Admin**, select the **DevCenter Project Admin** built-in role, and then select **Next**.

   :::image type="content" source=".\media\configure-project-admin\built-in-role.png" alt-text="Screenshot showing built-in DevCenter project admin role.":::

6. On the Members tab, select **+ Select Members**.
7. In **Select members**, select the Active Directory Users or Groups you want to add, and then select **Select**.
8. On the Members tab, select **Review + assign**.

The user will now be able to view the project and manage only the specific environment type that they have been granted access to. DevCenter Project Admin can also [create environments using the CLI](./quickstart-create-access-environments.md).

> [!NOTE]
> Only users assigned the Deployment Environments User role, the DevCenter Project Admin role, or a built-in role with appropriate permissions will be able to create environments.

## Next steps

* [Create and Configure Projects](./quickstart-create-and-configure-projects.md)
* [Provide access to developers](./how-to-configure-deployment-environments-user.md)
