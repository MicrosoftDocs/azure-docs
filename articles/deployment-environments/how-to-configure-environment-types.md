---
title: Configure environment types
titleSuffix: Azure Deployment Environments
description: Learn how to configure environment types to define deployment settings and permissions available to developers when deploying environments in a Project.
ms.service: deployment-environments
ms.author: meghaanand
author: anandmeg
ms.date: 09/20/2022
ms.topic: how-to
---

# Configure environment types

In Azure Deployment Environments Preview, [Environment types](./concept-environments-key-concepts.md#environment-types) are used to define the types of environments that are available to development teams when they deploy environments. You can specify deployment settings and the permissions available to developers for each environment type in your Project.

In this article, you'll learn how to:

* Add a new environment type
* Delete an environment type

:::image type="content" source="./media/configure-environment-types/azure-deployment-environments-environment-types.png" alt-text="Screenshot of example Environment types.":::

> [!IMPORTANT]
> Azure Deployment Environments is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Add a new environment type

Add a new environment type to the project, and specify the subscription and identity to use for the deployment.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select the Project.
1. Select **Environment types** from the left pane.
1. Select **+ Add**
1. On the **Add environment type** page, add the following details:
  1. Add an environment **Type**.
  1. Select a **Deployment subscription** to associate with the environment type.
  1. Select the **Deployment identity** (system assigned managed identity or user assigned managed identity) to use for deployment.
  1. Add an **Environment creator role(s)** and **Additional role(s)** with permissions to environment resources.
  1. Add **Tags** by adding a **Name/Value** pair (optional).

:::image type="content" source="./media/configure-environment-types/add-new-environment-type.png" alt-text="Screenshot of **Add environment type** page.":::

## Delete an environment type

> [!NOTE] 
> Environment types can only be deleted if they are not in use by any deployed environments. Delete all the associated environments before attempting to delete an environment type.
 
When you delete an environment type, it'll no longer be available for use when deploying environments.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select your Project.
3. Select **Environment types** from the left pane.
4. Select the environment type(s) you want to delete.
1. Select **Delete** and confirm. 

## Next steps

* Create and configure mappings to enable environment types for specific projects.