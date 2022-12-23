---
title: Provide access to dev managers
titleSuffix: Azure Deployment Environments
description: Learn how to configure access for dev managers by using the DevCenter Project Admin built-in role.
ms.service: deployment-environments
ms.custom: ignite-2022
ms.author: rosemalcolm
author: RoseHJM
ms.date: 10/12/2022
ms.topic: how-to
---

# Provide access to dev managers 

In Azure Deployment Environments, you can create multiple projects associated with the dev center to align with each team's requirements. By using the built-in DevCenter Project Admin role, you can delegate project administration to a member of a team. DevCenter Project Admin users can configure [project environment types](concept-environments-key-concepts.md#project-environment-types) to enable developers to create various types of [environments](concept-environments-key-concepts.md#environments) and apply settings to each environment type. 

You can assign the DevCenter Project Admin role to a dev manager at either the project level or the environment type level.

Based on the scope of access that you allow, a DevCenter Project Admin user can:

* View, add, update, disable, or delete the project environment types.
* Create an environment.
* Read, write, delete, or perform actions (like deploy or reset) on their own environment.
* Read, delete, or perform actions (like deploy or reset) on environments that other users created.

When you assign the role at the project level, the user can perform the preceding actions on all environment types at the project level. When you assign the role to specific environment types, the user can perform the actions only on the respective environment types.

## Assign permissions to dev managers for a project

1. Select the project that you want your development team members to be able to access.
2. Select **Access control (IAM)** from the left menu.

   :::image type="content" source=".\media\configure-project-admin\access-control-page.png" alt-text="Screenshot that shows the link to the access control page.":::

3. Select **Add** > **Add role assignment**.

   :::image type="content" source=".\media\configure-project-admin\add-role-assignment.png" alt-text="Screenshot that shows the menu option for adding a role assignment.":::

4. On the **Add role assignment** page, on the **Role** tab, search for **devcenter project admin**, select the **DevCenter Project Admin** built-in role, and then select **Next**.

   :::image type="content" source=".\media\configure-project-admin\built-in-role.png" alt-text="Screenshot that shows selecting the built-in DevCenter Project Admin role.":::

5. On the **Members** tab, select **+ Select members**.

    :::image type="content" source=".\media\configure-project-admin\select-role-members.png" alt-text="Screenshot that shows the link for selecting role members.":::
 
1. In **Select members**, select the Active Directory users or groups that you want to add, and then choose **Select**.

7. On the **Members** tab, select **Review + assign**.

The users can now view the project and manage all the environment types that you've enabled within it. DevCenter Project Admin users can also [create environments from the Azure CLI](./quickstart-create-access-environments.md).

## Assign permissions to dev managers for an environment type

1. Select the project that you want your development team members to be able to access.
2. Select **Environment types**, and then select the ellipsis (**...**) beside the specific environment type.

   :::image type="content" source=".\media\configure-project-admin\project-environment-types.png" alt-text="Screenshot that shows the environment types associated with a project.":::

3. Select **Access control (IAM)**.

   :::image type="content" source=".\media\configure-project-admin\access-control-page.png" alt-text="Screenshot that shows the link to the access control page.":::

4. Select **Add** > **Add role assignment**.

   :::image type="content" source=".\media\configure-project-admin\add-role-assignment.png" alt-text="Screenshot that shows the menu option for adding a role assignment.":::

5. On the **Add role assignment** page, on the **Role** tab, search for **devcenter project admin**, select the **DevCenter Project Admin** built-in role, and then select **Next**.

   :::image type="content" source=".\media\configure-project-admin\built-in-role.png" alt-text="Screenshot that shows selecting the built-in DevCenter Project Admin role.":::

6. On the **Members** tab, select **+ Select members**.
7. In **Select members**, select the Active Directory users or groups that you want to add, and then choose **Select**.
8. On the **Members** tab, select **Review + assign**.

The users can now view the project and manage only the specific environment type that you've granted them access to. DevCenter Project Admin users can also [create environments by using the Azure CLI](./quickstart-create-access-environments.md).

> [!NOTE]
> Only users who have the Deployment Environments User role, the DevCenter Project Admin role, or a built-in role with appropriate permissions can create environments.

## Next steps

* [Create and configure projects](./quickstart-create-and-configure-projects.md)
* [Provide access to developers](./how-to-configure-deployment-environments-user.md)
