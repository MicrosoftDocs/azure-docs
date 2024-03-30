---
title: Create a deployment environment
titleSuffix: Azure Deployment Environments
description: Learn how to create and access an environment in Azure Deployment Environments through the developer portal. An environment has all Azure resource preconfigured for deploying your application.
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.custom: build-2023
ms.topic: quickstart
ms.date: 12/01/2023
---

# Quickstart: Create and access an environment in Azure Deployment Environments

This quickstart shows you how to create and access an [environment](concept-environments-key-concepts.md#environments) in Azure Deployment Environments by using the developer portal.

As a developer, you can create environments associated with a [project](concept-environments-key-concepts.md#projects) in Azure Deployment Environments. An environment has all Azure resource preconfigured for deploying your application.

## Prerequisites

- [Create and configure a dev center](quickstart-create-and-configure-devcenter.md).

## Create an environment

An environment in Azure Deployment Environments is a collection of Azure resources on which your application is deployed. You can create an environment from the developer portal.

[!INCLUDE [note-deployment-environments-user](includes/note-deployment-environments-user.md)]

1. Sign in to the [developer portal](https://devportal.microsoft.com).

1. From the **New** menu at the top left, select **New environment**.
 
   :::image type="content" source="media/quickstart-create-access-environments/dev-new-environment.png" alt-text="Screenshot showing the new menu with new environment highlighted." lightbox="media/quickstart-create-access-environments/dev-new-environment-expanded.png":::
 
1. In the **Add an environment** pane, select the following information:

   |Field  |Value  |
   |---------|---------|
   |Name     | Enter a descriptive name for your environment. |
   |Project  | Select the project you want to create the environment in. If you have access to more than one project, you see a list of available projects. |
   |Type     | Select the environment type you want to create. If you have access to more than one environment type, you see a list of available types. |
   |Environment definitions | Select the environment definition you want to use to create the environment. You see a list of the environment definitions available from the catalogs associated with your dev center. |

   :::image type="content" source="media/quickstart-create-access-environments/dev-add-environment.png" alt-text="Screenshot showing add environment pane." lightbox="media/quickstart-create-access-environments/dev-add-environment-expanded.png":::

   If your environment is configured to accept parameters, you can enter them on a separate pane. In this example, you don't need to specify any parameters.

1. Select **Create**. You see your environment in the developer portal immediately, with an indicator that shows creation in progress.

## Access an environment

You can access and manage your environments in the Azure Deployment Environments developer portal.

1. Sign in to the [developer portal](https://devportal.microsoft.com).

1. You can view all of your existing environments. To access the specific resources created as part of an environment, select the **Environment Resources** link.

   :::image type="content" source="media/quickstart-create-access-environments/dev-environment-resources.png" alt-text="Screenshot showing an environment card, with the environment resources link highlighted." lightbox="media/quickstart-create-access-environments/dev-environment-resources-expanded.png":::

1. You can view the resources in your environment listed in the Azure portal.

   :::image type="content" source="media/quickstart-create-access-environments/azure-portal-view-of-environment.png" alt-text="Screenshot showing Azure portal list of environment resources." lightbox="media/quickstart-create-access-environments/azure-portal-view-of-environment.png":::

   Creating an environment automatically creates a resource group that stores the environment's resources. The resource group name follows the pattern `{projectName}-{environmentName}`. You can view the resource group in the Azure portal.

## Next steps

- [Add and configure a catalog](how-to-configure-catalog.md)
- [Add and configure an environment definition](configure-environment-definition.md)
