---
title: Configure project environment types
titleSuffix: Azure Deployment Environments
description: Learn how to add, update, and delete project environment types in Azure Deployment Environments. Define project-level deployment settings and permissions.
ms.service: deployment-environments
ms.custom: ignite-2022, build-2023
ms.author: rosemalcolm
author: RoseHJM
ms.date: 04/25/2023
ms.topic: how-to
---

# Configure project environment types

Project environment types are a subset of the [environment types configured for a dev center](how-to-configure-devcenter-environment-types.md). They help preconfigure the environments that a specific development team can create. 

In Azure Deployment Environments, [environment types](concept-environments-key-concepts.md#project-environment-types) that you add to the project will be available to developers when they deploy environments. Environment types determine the subscription and identity that are used for those deployments.

Project environment types enable platform engineering teams to:

- Configure the target subscription in which Azure resources will be created per environment type and per project. 
  
  You can provide subscriptions for environment types in a project to automatically apply the right set of policies on environments. This action also abstracts Azure governance-related concepts from your development teams.
- Preconfigure the managed identity that developers will use to perform the deployment, along with the access levels that development teams get after the environment is created.

In this article, you'll learn how to:

* Add a new project environment type.
* Update a project environment type.
* Enable or disable a project environment type.
* Delete a project environment type. 

## Prerequisites
Before you configure a project environment type, you need:

- An [environment type at the dev center level](how-to-configure-devcenter-environment-types.md).
- [Write access](/azure/devops/organizations/security/add-users-team-project) to the specific project.

## Add a new project environment type

When you configure a new project environment type, your development teams can use it to create an environment. They'll create the environment in the mapped subscription by using the configured deployment identity, along with permissions granted to resources created as part of the environment. All the associated policies are automatically applied.

Add a new project environment type as follows:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Open Azure Deployment Environments.
1. Select **Projects** from the left pane, and then select the specific project.
1. Select **Environment types** from the left pane.
1. Select **+ Add**.

   :::image type="content" source="./media/configure-project-environment-types/add-new-project-environment-type.png" alt-text="Screenshot that shows selections for adding a project environment type.":::

1. On the **Add environment type to Project** page, provide the following details:

    |Name     |Value     |
    |---------|----------|
    |**Type**| Select a dev center environment type to enable for the project.|
    |**Deployment subscription**| Select the target subscription in which the environment will be created.|
    |**Deployment identity** | Select either a system-assigned identity or a user-assigned managed identity that will be used to perform deployments on behalf of the user.|
    |**Permissions on environment resources** > **Environment Creator Role(s)**|  Select the roles that will get access to the environment resources.|
    |**Permissions on environment resources** > **Additional access** | Select the users or Microsoft Entra groups that will be granted specific roles on the environment resources.|
    |**Tags** (optional) | Provide a name and value for tags that will be applied on all resources created as part of the environments.|

   :::image type="content" source="./media/configure-project-environment-types/add-project-environment-type-page.png" alt-text="Screenshot that shows adding details on the page for adding a project environment type.":::

> [!NOTE]
> At least one identity (system assigned or user assigned) must be enabled for deployment identity. It will be used to perform the environment deployment on behalf of the developer. Additionally, the identity attached to the dev center should be [granted Owner access to the deployment subscription](how-to-configure-managed-identity.md) configured per environment type.

## Update a project environment type

You can update a project environment type so that it uses a different subscription or deployment identity when developers deploy environments. Updating a project environment type affects only the creation of new environments. Existing environments will continue to exist in the previously mapped subscription.

Update an existing project environment type as follows:

1. In the Azure portal, open Azure Deployment Environments.
1. Select **Projects** from the left pane, and then select the specific project.
1. Select **Environment types** from the left pane.
1. Select the environment type that you want to update.
1. Select the **Edit** icon (![image](./media/configure-project-environment-types/edit-icon.png)) on the specific row.
1. On the **Edit environment type** page, update the previous configuration, and then select **Submit**. 

## Enable or disable a project environment type

You can disable a project environment type to prevent developers from using it to create environments. Disabling a project environment type doesn't affect existing environments.

When you enable an environment type (or re-enable one that you disabled), development teams can use it to create environments.

1. In the Azure portal, open Azure Deployment Environments.
1. Select **Projects** from the left pane, and then select the specific project.
1. Select **Environment types** from the left pane.
1. Select the environment type to enable or disable.
1. Select **Enable** or **Disable** from the command bar and then confirm.

## Delete a project environment type

You can delete a specific project environment type only if no deployed environments in the project are using it. After you delete a project environment type, development teams can't use it to create environments.

1. In the Azure portal, open Azure Deployment Environments.
1. Select **Projects** from the left pane, and then select the specific project.
1. Select **Environment types** from the left pane.
1. Select a project environment type to delete.
1. Select **Delete** from the command bar and then confirm.

## Next steps

* Get started with [creating environments](quickstart-create-access-environments.md).
