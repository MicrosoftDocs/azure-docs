---
title: Manage your environment
titleSuffix: Azure Deployment Environments
description: Learn how to manage your Azure Deployment Environments deployment environment in the developer portal or by using the Azure CLI.
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.custom: devx-track-azurecli, build-2023
ms.topic: how-to
ms.date: 10/06/2023
---

# Manage your deployment environment

In Azure Deployment Environments, a platform engineer gives developers access to projects and the environment types that are associated with them. After a developer has access, they can create deployment environments based on the preconfigured environment types. The permissions that the creator of the environment and the rest of team have to access the environment's resources are defined in the specific environment type.

As a developer, you can create and manage your environments from the developer portal or by using the Azure CLI.  

## Prerequisites

- Access to a project that has at least one environment type.
- The [Deployment Environments User](how-to-configure-deployment-environments-user.md) role, the [DevCenter Project Admin](how-to-configure-project-admin.md) role, or a [built-in role](../role-based-access-control/built-in-roles.md) that has the required permissions to create an environment.

## Manage an environment by using the developer portal

The developer portal provides a graphical interface for development teams to create new environments and manage existing environments. You can create, redeploy, and delete your environments as needed in the developer portal.

### Create an environment by using the developer portal

1. Sign in to the [developer portal](https://devportal.microsoft.com).
1. On the **New** menu at the top right, select **New environment**.

   :::image type="content" source="media/how-to-manage-environments/new-environment.png" alt-text="Screenshot showing the new menu with new environment highlighted.":::

1. In the **Add an environment** pane, enter or select the following information:

   |Field  |Value  |
   |---------|---------|
   |Name     | Enter a descriptive name for your environment. |
   |Project  | Select the project you want to create the environment in. If you have access to more than one project, you see a list of the available projects. |
   |Type     | Select the environment type you want to create. If you have access to more than one environment type, you see a list of the available types. |
   |Environment definitions | Select the environment definition you want to use to create the environment. You see a list of the environment definitions available in the catalogs associated with your dev center. |

   :::image type="content" source="media/how-to-manage-environments/add-environment.png" alt-text="Screenshot showing the add environment pane.":::

   If parameters are defined on the environment definition, you're prompted to enter them in a separate pane. If your environment doesn't use parameters, select **Create**.

   :::image type="content" source="media/how-to-manage-environments/parameter-pane.png" alt-text="Screenshot showing the parameter pane.":::

1. Select **Create**. The environment tile is shown in the developer portal immediately, displaying the **Creating...** status while creation is in progress.

1. To view the resources that were created for the environment, select **Environment Resources**.

   :::image type="content" source="media/how-to-manage-environments/environment-resources-link.png" alt-text="Screenshot showing an environment tile with the Environment Resources link highlighted. ":::

1. The environment resources are displayed in the Azure portal.

   :::image type="content" source="media/how-to-manage-environments/environment-resources.png" alt-text="Screenshot showing environment resources in the Azure portal.":::

### Redeploy an environment by using the developer portal

When you need to update your environment, you can redeploy it. The redeployment process updates any existing resources with changed properties or creates any new resources based on the latest configuration of the environment definition.

1. Sign in to the [developer portal](https://devportal.microsoft.com).

1. On the environment you want to redeploy, on the options menu, select **Redeploy**.

   :::image type="content" source="media/how-to-manage-environments/option-redeploy.png" alt-text="Screenshot showing an environment tile with the options menu expanded and the redeploy option selected.":::

1. If parameters are defined on the environment definition, you're prompted to make any changes you want to make. When you've made your changes, select **Redeploy**.

   :::image type="content" source="media/how-to-manage-environments/redeploy-parameters.png" alt-text="Screenshot showing the redeploy parameters pane.":::

1. If your environment doesn't include configurable parameters, you see the **Redeploy \<environment name\>** message. Select **Redeploy**.

   :::image type="content" source="media/how-to-manage-environments/confirm-redeploy.png" alt-text="Screenshot showing the redeploy confirmation message with redeploy highlighted.":::

1. The environment displays the **Redeploying...** status while the redeployment takes place. To view the redeployed resources, select **Environment Resources**.

   The environment resources are displayed in the Azure portal.

   :::image type="content" source="media/how-to-manage-environments/redeployed-resources.png" alt-text="Screenshot showing redeployed resources in the Azure portal.":::

### Delete an environment by using the developer portal

You can delete your environment completely when you don't need it anymore.

1. Sign in to the [developer portal](https://devportal.microsoft.com).

1. On the environment you want to redeploy, on the options menu, select **Delete**.

   :::image type="content" source="media/how-to-manage-environments/option-delete.png" alt-text="Screenshot showing an environment tile with the options menu expanded and the delete option selected.":::

1. In the confirmation message, select **Delete**

   :::image type="content" source="media/how-to-manage-environments/confirm-delete.png" alt-text="Screenshot showing a confirm deletion message with Delete highlighted.":::

1. The environment tile displays the status **Deleting...** while the deletion is in progress.

## Manage an environment by using the Azure CLI

The Azure CLI provides a command-line interface for speed and efficiency when you create multiple similar environments, or for platforms where resources like memory are limited. You can use the `devcenter` Azure CLI extension to create, list, deploy, or delete an environment.

To learn how to manage your environments by using the CLI, see [Create and access an environment by using the Azure CLI](how-to-create-access-environments.md).

For reference documentation on the  `devcenter` Azure CLI extension, see [az devcenter](https://aka.ms/CLI-reference).

## Related content

- [Create and configure a dev center for Azure Deployment Environments by using the Azure CLI](how-to-create-configure-dev-center.md)
- [Create and configure a project by using the Azure CLI](how-to-create-configure-projects.md)
