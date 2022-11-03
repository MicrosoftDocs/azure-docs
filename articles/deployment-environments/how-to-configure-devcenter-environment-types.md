---
title: Configure Dev center environment types
titleSuffix: Azure Deployment Environments
description: Learn how to configure dev center environment types to define the types of environments that your developers can deploy.
ms.service: deployment-environments
ms.custom: ignite-2022
ms.author: rosemalcolm
author: RoseHJM
ms.date: 10/12/2022
ms.topic: how-to
---

# Configure environment types for your Dev center

In Azure Deployment Environments Preview, [environment types](./concept-environments-key-concepts.md#dev-center-environment-types) are used to define the types of environments available to development teams to deploy. You have the flexibility to name the environment types as per the nomenclature used in your enterprise, for example, sandbox, dev, test, or production. You can specify deployment settings and the permissions available to developers per environment type per project. 

In this article, you'll learn how to:

* Add a new environment type to your dev center
* Delete an environment type from the dev center

:::image type="content" source="./media/configure-dev-center-environment-types/azure-deployment-environments-environment-types.png" alt-text="Screenshot of example Environment types.":::

> [!IMPORTANT]
> Azure Deployment Environments is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Add a new dev center environment type

Environment types allow your development teams to choose from different types of environments when creating self-service environments. 

Add a new environment type to the dev center as follows:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Access Azure Deployment Environments.
1. Select your dev center from the list.
1. Select **Environment types** from the left pane.
1. Select **+ Add**
1. On the **Add environment type** page, add the following details:
  1. Add a **Name** for the environment type.
  1. Add a **Description** (optional).
  1. Add **Tags** by adding **Name/Value** (optional).
1. Select **Add**.

:::image type="content" source="./media/configure-dev-center-environment-types/add-new-dev-center-environment-type.png" alt-text="Screenshot showing the add environment type page.":::

>[!NOTE]
> A dev center environment type is available to a specific project only after an associated [project environment type](how-to-configure-project-environment-types.md) is added.

## Delete a dev center environment type

> [!NOTE] 
> Environment types can't be deleted if any existing project environment types or deployed environments reference the specific dev center environment type. Delete all the associated deployed environments and project environment types before attempting to delete an environment type.
 
When you delete an environment type, it'll no longer be available when deploying environments or configuring new project environment types.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Access Azure Deployment Environments.
1. Select your dev center from the list.
1. Select **Environment types** from the left pane.
1. Select the environment type(s) you want to delete.
1. Select **Delete** and confirm.

## Next steps

* [Create and configure project environment type](how-to-configure-project-environment-types.md) to enable environment types for specific projects.
