---
title: Configure project environment types
titleSuffix: Azure Deployment Environments
description: Learn how to configure environment types to define deployment settings and permissions available to developers when deploying environments in a project.
ms.service: deployment-environments
ms.custom: ignite-2022
ms.author: meghaanand
author: anandmeg
ms.date: 10/12/2022
ms.topic: how-to
---

# Configure project environment types

Project environment types are a subset of the [environment types configured per dev center](how-to-configure-devcenter-environment-types.md) and help pre-configure the different types of environments a specific development team can create . In Azure Deployment Environments Preview, [environment types](concept-environments-key-concepts.md#project-environment-types) added to the project will be available to developers when they deploy environments, and they determine the subscription and identity used for those deployments.

Project environment types enable the Dev Infra teams to:
- Configure the target subscription in which Azure resources will be created per environment type per project. 
  You will be able to provide different subscriptions for different Environment Types in a given project and thereby, automatically apply the right set of policies on different environments. This also abstracts Azure governance related concepts from your development teams.
- Pre-configure the managed identity that will be used to perform the deployment and the access levels development teams get after the specific environment is created.

In this article, you'll learn how to:

* Add a new project environment type
* Update a project environment type
* Enable or disable a project environment type
* Delete a project environment type 

> [!IMPORTANT]
> Azure Deployment Environments is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites
- A [dev center level environment type](how-to-configure-devcenter-environment-types.md).

## Add a new project environment type

>[!NOTE]
> To configure project environment types, you'll need write [access](/azure/devops/organizations/security/add-users-team-project) to the specific project.

Configuring a new project environment type will enable your development teams to create an environment with a specific environment type. The environment will be created in the mapped subscription using the configured deployment identity, along with permissions granted to the resources created as part of the environment, and all the associated policies automatically applied.

Add a new project environment type as follows:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Access Azure Deployment Environments.
1. Select **Projects** from the left pane, and then select the specific Project.
1. Select **Environment types** from the left pane.
1. Select **+ Add**.

   :::image type="content" source="./media/configure-project-environment-types/add-new-project-environment-type.png" alt-text="Screenshot showing adding a project environment type.":::

1. On the **Add environment type to Project** page, provide the following details:

    |Name     |Value     |
    |---------|----------|
    |**Type**| Select a dev center level environment type to enable for the specific project.|
    |**Deployment Subscription**| Select the target subscription in which the environments will be created.|
    |**Deployment Identity** | Select either a system assigned identity or a user assigned managed identity that'll be used to perform deployments on behalf of the user.|
    |**Permissions on environment resources** > **Environment Creator Role(s)**|  Select the role(s) that'll get access to the environment resources.|
    |**Permissions on environment resources** > **Additional access** | Select the user(s) or Azure Active Directory (Azure AD) group(s) that'll be granted specific role(s) on the environment resources.|
    |**Tags** (optional) | Provide a **Name** and **Value**. These tags will be applied on all resources created as part of the environments.|

   :::image type="content" source="./media/configure-project-environment-types/add-project-environment-type-page.png" alt-text="Screenshot showing adding details on the add project environment type page.":::

> [!NOTE]
> At least one identity (system assigned or user assigned) must be enabled for deployment identity and will be used to perform the environment deployment on behalf of the developer. Additionally, the identity attached to the dev center should be [granted 'Owner' access to the deployment subscription](how-to-configure-managed-identity.md) configured per environment type.

## Update a project environment type

A project environment type can be updated to use a different subscription or deployment identity when deploying environments. Once the project environment type is updated, it will only affect creation of new environments. Existing environments will continue to exist in the previously mapped subscription.

Update an existing project environment type as follows:

1. Navigate to the Azure Deployment Environments Project.
1. Select **Environment types** from the left pane of the specific Project.
1. Select the environment type you want to update.
1. Select the **Edit** icon (![image](./media/configure-project-environment-types/edit-icon.png)) on the specific row.
1. On the **Edit environment type** page, update the previous configuration, and then select **Submit**. 

## Enable or disable a project environment type

A project environment type can be disabled to prevent developers from creating new environments with the specific environment type. Once a project environment type is disabled, it cannot be used to create a new environment. Existing environments are not affected.

When a disabled environment type is re-enabled, development teams will be able to create new environments with that specific environment type.

1. Navigate to the Azure Deployment Environments project.
1. Select **Environment types** on the left pane of the specific project.
1. Select the specific environment type to enable or disable.
1. Select **Enable** or **Disable** from the command bar and then confirm.

## Delete a project environment type

You can delete a specific project environment type only if it is not being used by any deployed environments in the Project. Once you delete a specific project environment type, development teams will no longer be able to use it to create environments.

1. Navigate to the Azure Deployment Environments project.
1. Select **Environment types** from the left pane of the specific project.
1. Select a project environment type to delete.
1. Select **Delete** from the command bar.
1. Confirm to delete the project environment type.

## Next steps

* Get started with [creating environments](quickstart-create-access-environments.md)
