---
title: Configure dev center environment types
titleSuffix: Azure Deployment Environments
description: Learn how to define the environment types available for all projects within a dev center by creating them as dev center environment types.
ms.service: azure-deployment-environments
ms.custom: build-2023
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/20/2025
ms.topic: how-to

#customer intent: As a platform engineer, I want to create an environment type so that my team members can deploy environments.
---

# Configure environment types for a dev center

In Azure Deployment Environments, you use [environment types](./concept-environments-key-concepts.md#dev-center-environment-types) to define the environments that development teams can deploy. You have the flexibility to name the environment types according to the naming conventions that your enterprise uses: for example, *sandbox*, *dev*, *test*, and *production*. You can specify deployment settings and the permissions that are available to developers per environment type and per project. 

In this article, you learn how to:

* Add a new environment type to a dev center.
* Delete an environment type from a dev center.

:::image type="content" source="media/configure-dev-center-environment-types/azure-deployment-environments-environment-types.png" alt-text="Screenshot of example environment types." lightbox="media/configure-dev-center-environment-types/azure-deployment-environments-environment-types.png":::

## Add a dev center environment type

To add a new environment type to a dev center:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to Azure Deployment Environments.
1. In the left pane, under **Configure**, select **Dev centers**.
1. On the **Dev centers** page, select your dev center. 
1. Select **Environment types** in the left pane.
1. Select **+ Create**.
1. On the **Create environment type** page, add the following details:
   1. In the **Name** box, add a name for the environment type.
   1. Under **Tags**, add tags by entering **Name** and **Value** information (optional).
1. Select **Add**.

:::image type="content" source="media/configure-dev-center-environment-types/create-new-dev-center-environment-type.png" alt-text="Screenshot that shows the page for adding an environment type." lightbox="media/configure-dev-center-environment-types/create-new-dev-center-environment-type.png":::

>[!NOTE]
> A dev center environment type is available to a specific project only after you add an associated [project environment type](how-to-configure-project-environment-types.md).

## Delete a dev center environment type

> [!NOTE]
> You can't delete a dev center environment type if any existing project environment types or deployed environments reference it. Delete all the associated project environment types and deployed environments before you try to delete a dev center environment type.
 
When you delete an environment type, it's no longer available when you deploy environments or configure new project environment types.

To delete an environment type from a dev center:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to Azure Deployment Environments.
1. In the left pane, under **Configure**, select **Dev centers**.
1. On the **Dev centers** page, select your dev center. 
1. Select **Environment types** in the left pane.
1. Select the environment types that you want to delete.
1. Select **Delete** and then confirm.

## Next step

* [Configure environment types for specific projects](how-to-configure-project-environment-types.md)
