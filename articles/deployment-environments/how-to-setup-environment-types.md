---
title: Configure environment types
titleSuffix: Azure Deployment Environments
description: Learn how to configure environment types to define deployment settings and permissions available to developers when deploying environments in a Project.
ms.service: deployment-environments
ms.author: meghaanand
author: anandmeg
ms.date: 09/12/2022
ms.topic: how-to
---

# Configure environment types

In Azure Deployment Environments, [environment types](./concept-environments-key-concepts.md#environment-types) are used to define the types of environments the development teams can create. You can apply different settings to each environment type, and name it as per your requirements, for example, dev, test, production, or sandbox.

:::image type="content" source="./media/configure-environment-types/azure-deployment-environments-environment-types.png" alt-text="Screenshot of Environment Types.":::

In this article, you'll learn how to:

* Add a new environment type
* Delete an environment type

## Add a new environment type

You can add environment types to the dev center to define the type of environments your development teams can create.

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


In a given project, an environment type is only available after it has been assigned a subscription mapping.

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