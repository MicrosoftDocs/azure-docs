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

Based on the scope of access that you allow, a Deployment Environments User can:

* View the project environment types. 
* Create an environment.
* Read, write, delete, or perform actions (like deploy or reset) on their own environment.
* Read or perform actions (deploy or reset) on environments that other users created.

When you assign the role at the project level, the Deployment Environments User can perform the preceding actions on all environment types enabled at the project level. When you assign the role to specific environment types, the Deployment Environments User can perform the actions only on the respective environment types.

## Assign permissions to developers for a project

1. Select the project you want to provide your development team members access to.
2. Select **Access Control(IAM)** from the left menu.

   :::image type="content" source=".\media\configure-deployment-environments-user\access-control-page.png" alt-text="Screenshot showing link to access control page.":::

3. Select **Add** > **Add role assignment**.

   :::image type="content" source=".\media\configure-deployment-environments-user\add-role-assignment.png" alt-text="Screenshot showing Add role assignment menu option.":::

4. On the Add role assignment page, on the Role tab, search for *deployment environments user*, select the **Deployment Environments User** built-in role, and then select **Next**.
5. On the Members tab, select **+ Select Members**.
6. In **Select members**, select the Active Directory Users or Groups you want to add, and then select **Select**.
7. On the Members tab, select **Review + assign**.

The user can now view the project and all the Environment Types enabled within it. Deployment Environments users can [create environments from the CLI](./quickstart-create-access-environments.md).

## Assign permissions to developers for an environment type

1. Select the project you want to provide your development team members access to.
2. Select **Environment Types** and select the **...** beside the specific environment type.

   :::image type="content" source=".\media\configure-deployment-environments-user\project-environment-types.png" alt-text="Screenshot showing the environment types associated with a project.":::

3. Select **Access Control**.

   :::image type="content" source=".\media\configure-deployment-environments-user\access-control-page.png" alt-text="Screenshot showing link to access control page.":::

4. Select **Add** > **Add role assignment**.

   :::image type="content" source=".\media\configure-deployment-environments-user\add-role-assignment.png" alt-text="Screenshot showing Add role assignment menu option.":::

5. On the Add role assignment page, on the Role tab, search for *deployment environments user*, select the **Deployment Environments User** built-in role, and then select **Next**.
6. On the Members tab, select **+ Select Members**.
7. In **Select members**, select the Active Directory Users or Groups you want to add, and then select **Select**.
8. On the Members tab, select **Review + assign**.

The user can now view the project and the specific environment type that they have been granted access to. Deployment Environments users can [create environments using the CLI](./quickstart-create-access-environments.md).

> [!NOTE]
> Only users assigned the Deployment Environments User role, the DevCenter Project Admin role, or a built-in role with appropriate permissions will be able to create environments.

## Next steps

* [Create and Configure Projects](./quickstart-create-and-configure-projects.md)
* [Provide access to Dev Managers](./how-to-configure-project-admin.md)
