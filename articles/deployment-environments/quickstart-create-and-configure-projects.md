---
title: Create and configure a project
titleSuffix: Azure Deployment Environments
description: Learn how to create a project in Azure Deployment Environments and associate the project with a dev center.
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.custom: ignite-2022, build-2023
ms.topic: quickstart
ms.date: 09/06/2023
---

# Quickstart: Create and configure an Azure Deployment Environments project

This quickstart shows you how to create a project in Azure Deployment Environments, and associate the project with the dev center you created in [Quickstart: Create and configure a dev center](./quickstart-create-and-configure-devcenter.md). After you complete this quickstart, developers can use the developer portal to create environments to deploy their applications.

The following diagram shows the steps you perform in this quickstart to configure a project associated with a dev center for Deployment Environments in the Azure portal.

:::image type="content" source="media/quickstart-create-configure-projects/create-environment-steps.png" alt-text="Diagram showing the stages required to configure a project for Deployment Environments.":::

First, you create a project. Then, assign the dev center managed identity the Contributor and the User Access Administrator roles to the subscription. Then, you configure the project by creating a project environment type. Finally, you give the development team access to the project by assigning the [Deployment Environments User](how-to-configure-deployment-environments-user.md) role to the project.

You need to perform the steps in both quickstarts before you can create a deployment environment. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure role-based access control role with permissions to create and manage resources in the subscription, such as [Contributor](../role-based-access-control/built-in-roles.md#contributor)
- An Azure Deployment Environments dev center with a catalog attached. If you don't have a dev center with a catalog, see [Quickstart: Create and configure a dev center](./quickstart-create-and-configure-devcenter.md).

## Create a project

In Azure Deployment Environments, a project represents a team or business function within the organization. When you associate a project with a dev center, all the settings for the dev center are automatically applied to the project. Each project can be associated with only one dev center.

To create an Azure Deployment Environments project in your dev center:

1. In the [Azure portal](https://portal.azure.com/), go to Azure Deployment Environments.

1. In the left menu under **Configure**, select **Projects**.

1. In **Projects**, select **Create**.

1. In **Create a project**, on the **Basics** tab, enter or select the following information:

     |Name   |Value   |
     |----------|-----------|
     |**Subscription**     |Select the subscription in which you want to create the project.       |
     |**Resource group**|Either use an existing resource group or select **Create new** and enter a name for the resource group.   |
     |**Dev center**|Select a dev center to associate with this project. All settings for the dev center apply to the project.   |
     |**Name**|Enter a name for the project.  |
     |**Description** (Optional) |Enter any project-related details.  |

1. On the **Review + Create** tab, wait for deployment validation, and then select **Create**.

    :::image type="content" source="media/quickstart-create-configure-projects/create-project.png" alt-text="Screenshot that shows selecting the create project basics tab.":::

1. Confirm that the project was successfully created by checking your Azure portal notifications. Then, select **Go to resource**.

1. Confirm that you see the project overview pane.

    :::image type="content" source="media/quickstart-create-configure-projects/created-project.png" alt-text="Screenshot that shows the project overview pane.":::

## Create a project environment type

In Azure Deployment Environments, project environment types are a subset of the environment types that you configure for the dev center. They help you preconfigure the types of environments that specific development teams can create.

To configure a project, add a [project environment type](how-to-configure-project-environment-types.md):

1. In the Azure portal, go to your project.

1. In the left menu under **Environment configuration**, select **Environment types**, and then select **Add**.

    :::image type="content" source="media/quickstart-create-configure-projects/add-environment-types.png" alt-text="Screenshot that shows the Environment types pane.":::

1. In **Add environment type to \<project-name\>**, enter or select the following information:

    |Name     |Value     |
    |---------|----------|
    |**Type**| Select a dev center level environment type to enable for the specific project.|
    |**Deployment subscription**| Select the subscription in which the environment is created.|
    |**Deployment identity** | Select either a system-assigned identity or a user-assigned managed identity to perform deployments on behalf of the user.|
    |**Permissions on environment resources** > **Environment creator role(s)**|  Select the roles to give access to the environment resources.|
    |**Permissions on environment resources** > **Additional access** | Select the users or Microsoft Entra groups to assign to specific roles on the environment resources.|
    |**Tags** | Enter a tag name and a tag value. These tags are applied on all resources that are created as part of the environment.|

   :::image type="content" source="./media/quickstart-create-configure-projects/add-project-environment-type-page.png" alt-text="Screenshot that shows adding details in the Add project environment type pane.":::

> [!NOTE]
> At least one identity (system-assigned or user-assigned) must be enabled for deployment identity. The identity is used to perform the environment deployment on behalf of the developer. Additionally, the identity attached to the dev center should be [assigned the Contributor and the User Access Admistrator roles](how-to-configure-managed-identity.md) for  access to the deployment subscription for each environment type.

## Give access to the development team

Before developers can create environments based on the environment types in a project, you must provide access for them through a role assignment at the level of the project. The Deployment Environments User role enables users to create, manage and delete their own environments. You must have sufficient permissions to a project before you can add users to it.

1. In the Azure portal, go to your project.

1. In the left menu, select **Access control (IAM)**.

1. Select **Add** > **Add role assignment**.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).
    
    | Setting | Value |
    | --- | --- |
    | **Role** | Select **[Deployment Environments User](how-to-configure-deployment-environments-user.md)**. |
    | **Assign access to** | Select **User, group, or service principal**. |
    | **Members** | Select the users or groups you want to have access to the project. |

    :::image type="content" source="media/quickstart-create-configure-projects/add-role-assignment.png" alt-text="Screenshot that shows the Add role assignment pane.":::

[!INCLUDE [note-deployment-environments-user](includes/note-deployment-environments-user.md)]


## Next steps

In this quickstart, you created a project and granted project access to your development team. To learn about how your development team members can create environments, advance to the next quickstart.

> [!div class="nextstepaction"]
> [Quickstart: Create and access an environment](quickstart-create-access-environments.md)
