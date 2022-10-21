---
title: Provide access to developers
titleSuffix: Azure Deployment Environments
description: Learn how to configure access for developers by using the Deployment Environments User built-in role.
ms.service: deployment-environments
ms.custom: ignite-2022
ms.author: rosemalcolm
author: RoseHJM
ms.date: 10/12/2022
ms.topic: how-to
---


# Provide access to developers

In Azure Deployment Environments, development team members must get access to a specific project before they can create deployment environments. By using the built-in Deployment Environments User role, you can assign permissions to Active Directory users or groups at either the project level or the environment type level. 

Based on the scope of access that you allow, a developer who has the Deployment Environments User role can:

* View the project environment types. 
* Create an environment.
* Read, write, delete, or perform actions (like deploy or reset) on their own environment.
* Read or perform actions (like deploy or reset) on environments that other users created.

When you assign the role at the project level, the user can perform the preceding actions on all environment types enabled at the project level. When you assign the role to specific environment types, the user can perform the actions only on the respective environment types.

## Assign permissions to developers for a project

1. Select the project that you want your development team members to be able to access.
2. Select **Access control (IAM)** from the left menu.

   :::image type="content" source=".\media\configure-deployment-environments-user\access-control-page.png" alt-text="Screenshot that shows the link to the access control page.":::

3. Select **Add** > **Add role assignment**.

   :::image type="content" source=".\media\configure-deployment-environments-user\add-role-assignment.png" alt-text="Screenshot that shows the menu option for adding a role assignment.":::

4. On the **Add role assignment** page, on the **Role** tab, search for **deployment environments user**, select the **Deployment Environments User** built-in role, and then select **Next**.
5. On the **Members** tab, select **+ Select members**.
6. In **Select members**, select the Active Directory users or groups that you want to add, and then choose **Select**.
7. On the **Members** tab, select **Review + assign**.

The users can now view the project and all the environment types that you've enabled within it. Users who have the Deployment Environments User role can also [create environments from the Azure CLI](./quickstart-create-access-environments.md).

## Assign permissions to developers for an environment type

1. Select the project that you want your development team members to be able to access.
2. Select **Environment types**, and then select the ellipsis (**...**) beside the specific environment type.

   :::image type="content" source=".\media\configure-deployment-environments-user\project-environment-types.png" alt-text="Screenshot that shows the environment types associated with a project.":::

3. Select **Access control (IAM)**.

   :::image type="content" source=".\media\configure-deployment-environments-user\access-control-page.png" alt-text="Screenshot that shows the link to the access control page.":::

4. Select **Add** > **Add role assignment**.

   :::image type="content" source=".\media\configure-deployment-environments-user\add-role-assignment.png" alt-text="Screenshot that shows the menu option for adding a role assignment.":::

5. On the **Add role assignment** page, on the **Role** tab, search for **deployment environments user**, select the **Deployment Environments User** built-in role, and then select **Next**.
6. On the **Members** tab, select **+ Select members**.
7. In **Select members**, select the Active Directory users or groups that you want to add, and then choose **Select**.
8. On the **Members** tab, select **Review + assign**.

The users can now view the project and the specific environment type that you've granted them access to. Users who have the Deployment Environments User role can also [create environments by using the Azure CLI](./quickstart-create-access-environments.md).

> [!NOTE]
> Only users who have the Deployment Environments User role, the DevCenter Project Admin role, or a built-in role with appropriate permissions can create environments.

## Next steps

* [Create and configure projects](./quickstart-create-and-configure-projects.md)
* [Provide access to dev managers](./how-to-configure-project-admin.md)
