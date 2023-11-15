---
title: Create and access an environment in the developer portal
titleSuffix: Azure Deployment Environments
description: Learn how to create and access an environment in an Azure Deployment Environments project through the developer portal.
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.custom: ignite-2022, build-2023
ms.topic: quickstart
ms.date: 04/25/2023
---

# Quickstart: Create and access Azure Deployment Environments by using the developer portal

This quickstart shows you how to create and access an [environment](concept-environments-key-concepts.md#environments) in an existing Azure Deployment Environments project.

In this quickstart, you learn how to:

> [!div class="checklist"]
>
> - Create an environment
> - Access an environment

## Prerequisites

- [Create and configure a dev center](quickstart-create-and-configure-devcenter.md).
- [Create and configure a project](quickstart-create-and-configure-projects.md).

## Create an environment

An environment in Azure Deployment Environments is a collection of Azure resources on which your application is deployed. You can create an environment from the developer portal.

> [!NOTE]
> Only a user who has the [Deployment Environments User](how-to-configure-deployment-environments-user.md) role, the [DevCenter Project Admin](how-to-configure-project-admin.md) role, or a [built-in role](../role-based-access-control/built-in-roles.md) that has appropriate permissions can create an environment.

1. Sign in to the [developer portal](https://devportal.microsoft.com).
1. From the **New** menu at the top left, select **New environment**.
 
   :::image type="content" source="media/quickstart-create-access-environments/new-environment.png" alt-text="Screenshot showing the new menu with new environment highlighted.":::
 
1. In the Add an environment pane, select the following information:

   |Field  |Value  |
   |---------|---------|
   |Name     | Enter a descriptive name for your environment. |
   |Project  | Select the project you want to create the environment in. If you have access to more than one project, you see a list of the available projects. |
   |Type     | Select the environment type you want to create. If you have access to more than one environment type, you see a list of the available types. |
   |Environment definitions | Select the environment definition you want to use to create the environment. You see a list of the environment definitions available from the catalogs associated with your dev center. |

   :::image type="content" source="media/quickstart-create-access-environments/add-environment.png" alt-text="Screenshot showing add environment pane.":::

If your environment is configured to accept parameters, you're able to enter them on a separate pane. In this example, you don't need to specify any parameters.

1. Select **Create**. You see your environment in the developer portal immediately, with an indicator that shows creation in progress.
 
## Access an environment

You can access and manage your environments in the Azure Deployment Environments developer portal.

1. Sign in to the [developer portal](https://devportal.microsoft.com).

1. You're able to view all of your existing environments. To access the specific resources created as part of an Environment, select the **Environment Resources** link.

   :::image type="content" source="media/quickstart-create-access-environments/environment-resources.png" alt-text="Screenshot showing an environment card, with the environment resources link highlighted."::: 

1. You're able to view the resources in your environment listed in the Azure portal.
   :::image type="content" source="media/quickstart-create-access-environments/azure-portal-view-of-environment.png" alt-text="Screenshot showing Azure portal list of environment resources.":::

   Creating an environment automatically creates a resource group that stores the environment's resources. The resource group name follows the pattern {projectName}-{environmentName}. You can view the resource group in the Azure portal.

## Next steps

- Learn how to [add and configure a catalog](how-to-configure-catalog.md).
- Learn how to [add and configure an environment definition](configure-environment-definition.md).
