---
title: Manage your environment
titleSuffix: Azure Deployment Environments
description: Learn how to manage your environments in the developer portal or by using the Azure CLI.
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.topic: quickstart
ms.date: 02/24/2023
---

# Manage your environment

Deployment environments allow developers to quickly and efficiently deploy applications. Deployment environments provide a platform to manage and deploy code, as well as to test applications in a safe, secure, and consistent manner. With a deployment environment, you can easily deploy applications to web, mobile, desktop, or other platforms. 

In Azure Deployment Environments Preview, a dev infrastructure manager gives developers access to projects and the environment types associated with them. Once a developer has access, they can create deployments environments based on the pre-configured environment types. The dev infrastructure manager can also give management permissions to the creator of the environment, like Owner or Contributor.

As a developer, you can create and manage your environments from the developer portal or from the Azure CLI.  

## Prerequisites

- Access to a project that has at least one environment type.
- The [Deployment Environments User](how-to-configure-deployment-environments-user.md) role, the [DevCenter Project Admin](how-to-configure-project-admin.md) role, or a [built-in role](../role-based-access-control/built-in-roles.md) that has appropriate permissions.

## Manage an environment by using the developer portal

The developer portal provides a graphical interface for creation and management tasks and provides a visual status for your environments and dev boxes. You can create, redeploy, and delete your environments as needed. 

### Create an environment

1. Sign in to the [developer portal](https://devportal.microsoft.com).
1. From the **New** menu at the top right, select **New environment**.
 
   :::image type="content" source="media/how-to-manage-environments/new-environment.png" alt-text="Screenshot showing the new menu with new environment highlighted.":::
 
1. In the Add an environment pane, select the following information:

   |Field  |Value  |
   |---------|---------|
   |Name     | Enter a descriptive name for your environment. |
   |Project  | Select the project you want to create the environment in. If you have access to more than one project, you see a list of the available projects. |
   |Type     | Select the environment type you want to create. If you have access to more than one environment type, you see a list of the available types. |
   |Catalog item | Select the catalog item you want to use to create the environment. You see a list of the catalog items available from the catalogs associated with your dev center. |

   :::image type="content" source="media/how-to-manage-environments/add-environment.png" alt-text="Screenshot showing add environment pane.":::

   If your environment is configured to accept parameters, you're able to enter them on a separate pane. If your environment doesn't use parameters, select Create.

   :::image type="content" source="media/how-to-manage-environments/parameter-pane.png" alt-text="Screenshot showing the parameter pane.":::

1. Select **Create**. You see the environment tile in the developer portal immediately, displaying the **Creating...** status while creation is in progress.
 
1. To view the resources created for the environment, select **Environment Resources**.
   
   :::image type="content" source="media/how-to-manage-environments/environment-resources-link.png" alt-text="Screenshot showing an environment tile with the Environment Resources link highlighted. ":::

1. The environment resources display in the Azure portal.

   :::image type="content" source="media/how-to-manage-environments/environment-resources.png" alt-text="Screenshot showing environment resources in the Azure portal.":::


### Redeploy an environment 

When you need to update your environment parameters, you can redeploy it. The redeployment process updates any existing resources with changed properties and creates any new resources from the catalog item in the environment resource group.

1. Sign in to the [developer portal](https://devportal.microsoft.com).

1. On the environment you want to redeploy, from the options menu, select **Redeploy**.
   
   :::image type="content" source="media/how-to-manage-environments/option-redeploy.png" alt-text="Screenshot showing an environment tile with the options menu expanded and the redeploy option selected.":::

1. If your environment includes configurable parameters, you're prompted to make any changes you want. When you've made your changes, select **Redeploy**.
 
   :::image type="content" source="media/how-to-manage-environments/redeploy-parameters.png" alt-text="Screenshot showing the redeploy parameters pane.":::

1. If your environment does not include configurable parameters, you see the Redeploy *environment name* message. Select **Redeploy**.

   :::image type="content" source="media/how-to-manage-environments/confirm-redeploy.png" alt-text="Screenshot showing redeploy confirmation message with redeploy highlighted.":::

1. The environment displays the **Redeploying...** status while the redeployment takes place.
 
1. To view the redeployed resources, select **Environment Resources**.
   
1. The environment resources display in the Azure portal.

   :::image type="content" source="media/how-to-manage-environments/redeployed-resources.png" alt-text="Screenshot showing redeployed resources in the Azure portal.":::

### Delete an environment 
You can delete your environment completely when you don't need it anymore. 

1. Sign in to the [developer portal](https://devportal.microsoft.com).

1. On the environment you want to redeploy, from the options menu, select **Delete**.
   
   :::image type="content" source="media/how-to-manage-environments/option-delete.png" alt-text="Screenshot showing an environment tile with the options menu expanded and the delete option selected.":::

1. In the confirmation message, select **Delete**
   
   :::image type="content" source="media/how-to-manage-environments/confirm-delete.png" alt-text="Screenshot showing a confirm deletion message with Delete highlighted.":::

1. The environment tile displays the status **Deleting...** while the deletion is in progress.
 
## Manage an environment by using the Azure CLI

The Azure CLI provides a command line interface for speed and efficiency when creating multiple similar environments, or for platforms where resources like memory are limited.

### Create an environment

```azurecli
az devcenter dev environment create --dev-center-name <devcenter-name> \
    --project-name <project-name> -n <name> --environment-type <environment-type-name> \
    --catalog-item-name <catalog-item-name> ---catalog-name <catalog-name> \
    --parameters <deployment-parameters-json-string>
```

### Deploy an environment

```azurecli
az devcenter environment deploy-action --action-id "deploy" --dev-center <devcenter-name> \
    -g <resource-group-name> --project-name <project-name> -n <name> --parameters <parameters-json-string>
```

### List environments in a project

```azurecli
az devcenter dev environment list --dev-center <devcenter-name> --project-name <project-name>
```

### Delete an environment

```azurecli
az devcenter dev environment delete --dev-center <devcenter-name>  --project-name <project-name> -n <name> --user-id "me"
```

## Next steps

- Learn about configuring Azure Deployment Environments: [Quickstart: Create and configure a dev center](quickstart-create-and-configure-devcenter.md)
- Learn more about managing your environments with the CLI: [Create and access an environment by using the Azure CLI](how-to-create-access-environments.md)