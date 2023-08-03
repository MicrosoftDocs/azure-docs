---
title: Configure dev center environment types
titleSuffix: Azure Deployment Environments
description: Learn how to define dev center level permissions and deployment settings for the environments that developers can deploy.
ms.service: deployment-environments
ms.custom: ignite-2022, build-2023
ms.author: rosemalcolm
author: RoseHJM
ms.date: 04/25/2023
ms.topic: how-to
---

# Configure environment types for a dev center

In Azure Deployment Environments, you use [environment types](./concept-environments-key-concepts.md#dev-center-environment-types) to define the environments that development teams can deploy. You have the flexibility to name the environment types according to the nomenclature that your enterprise uses: for example, sandbox, dev, test, or production. You can specify deployment settings and the permissions that are available to developers per environment type and per project. 

In this article, you'll learn how to:

* Add a new environment type to a dev center.
* Delete an environment type from a dev center.

:::image type="content" source="./media/configure-dev-center-environment-types/azure-deployment-environments-environment-types.png" alt-text="Screenshot of example environment types.":::

## Add a new dev center environment type

Add a new environment type to the dev center as follows:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Open Azure Deployment Environments.
1. Select your dev center from the list.
1. Select **Environment types** from the left pane.
1. Select **+ Add**.
1. On the **Add environment type** page, add the following details:
   1. For **Name**, add a name for the environment type.
   1. For **Description**, add a description (optional).
   1. For **Tags**, add tags by adding **Name** and **Value** information (optional).
1. Select **Add**.

:::image type="content" source="./media/configure-dev-center-environment-types/add-new-dev-center-environment-type.png" alt-text="Screenshot that shows the page for adding an environment type.":::

>[!NOTE]
> A dev center environment type is available to a specific project only after you add an associated [project environment type](how-to-configure-project-environment-types.md).

## Delete a dev center environment type

> [!NOTE] 
> You can't delete a dev center environment type if any existing project environment types or deployed environments reference it. Delete all the associated project environment types and deployed environments before you try to delete a dev center environment type.
 
When you delete an environment type, it will no longer be available when you're deploying environments or configuring new project environment types.

To delete an environment type from a dev center:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Open Azure Deployment Environments.
1. Select your dev center from the list.
1. Select **Environment types** from the left pane.
1. Select the environment types that you want to delete.
1. Select **Delete** and then confirm.

## Next steps

* [Create and configure environment types for specific projects](how-to-configure-project-environment-types.md)
