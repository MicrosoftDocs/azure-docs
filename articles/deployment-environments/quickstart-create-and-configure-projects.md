---
title: Create and configure a project
titleSuffix: Azure Deployment Environments
description: Learn how to create a project in Azure Deployment Environments and associate the project with a dev center.
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.custom: ignite-2022, build-2023
ms.topic: quickstart
ms.date: 04/25/2023
---

# Quickstart: Create and configure a project

This quickstart shows you how to create a project in Azure Deployment Environments. Then, you associate the project with the dev center you created in [Quickstart: Create and configure a dev center](./quickstart-create-and-configure-devcenter.md).

A platform engineering team typically creates projects and provides project access to development teams. Development teams then create [environments](concept-environments-key-concepts.md#environments) by using [environment definitions](concept-environments-key-concepts.md#environment-definitions), connect to individual resources, and deploy applications.

The following diagram shows the steps you perform in the [Create and configure a dev center for Azure Deployment Environments](quickstart-create-and-configure-devcenter.md) quickstart to configure a dev center for Azure Deployment Environments in the Azure portal. You must perform these steps before you can create a project.

:::image type="content" source="media/quickstart-create-configure-projects/create-environment-steps-2-a.png" alt-text="Diagram showing the stages required to configure a dev center for Deployment Environments.":::
 
The following diagram shows the steps you perform in this quickstart to configure a project associated with a dev center for Deployment Environments in the Azure portal.

:::image type="content" source="media/quickstart-create-configure-projects/create-environment-steps-2-b.png" alt-text="Diagram showing the stages required to configure a project for Deployment Environments.":::

First, you create a project. Then, assign the dev center managed identity the Owner role to the subscription. Then, you configure the project by creating a project environment type. Finally, you give the development team access to the project by assigning the [Deployment Environments User](how-to-configure-deployment-environments-user.md) role to the project.

You need to perform the steps in both quickstarts before you can create a deployment environment. 

For more information on how to create an environment, see [Quickstart: Create and access Azure Deployment Environments by using the developer portal](quickstart-create-access-environments.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure role-based access control role with permissions to create and manage resources in the subscription, such as [Contributor](../role-based-access-control/built-in-roles.md#contributor) or [Owner](../role-based-access-control/built-in-roles.md#owner).

## Create a project

To create a project in your dev center:

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

    :::image type="content" source="media/quickstart-create-configure-projects/create-project-page-review-create.png" alt-text="Screenshot that shows selecting the Review + Create button to validate and create a project.":::

1. Confirm that the project was successfully created by checking your Azure portal notifications. Then, select **Go to resource**.

1. Confirm that you see the project overview pane.

    :::image type="content" source="media/quickstart-create-configure-projects/created-project.png" alt-text="Screenshot that shows the project overview pane.":::

### Assign a managed identity the owner role to the subscription
Before you can create environment types, you must give the managed identity that represents your dev center access to the subscriptions where you configure the [project environment types](concept-environments-key-concepts.md#project-environment-types). 

In this quickstart you assign the Owner role to the system-assigned managed identity that you configured previously: [Attach a system-assigned managed identity](quickstart-create-and-configure-devcenter.md#attach-a-system-assigned-managed-identity).

1.	Navigate to your dev center.
1.  On the left menu under Settings, select **Identity**.
1.	Under System assigned > Permissions, select **Azure role assignments**.

    :::image type="content" source="media/quickstart-create-configure-projects/system-assigned-managed-identity.png" alt-text="Screenshot that shows a system-assigned managed identity with Role assignments highlighted.":::

1. In Azure role assignments, select **Add role assignment (Preview)**, enter or select the following information, and then select **Save**:
    
    |Name     |Value     |
    |---------|----------|
    |**Scope**|Subscription|
    |**Subscription**|Select the subscription in which to use the managed identity.|
    |**Role**|Owner|

## Configure a project

To configure a project, add a [project environment type](how-to-configure-project-environment-types.md):

1. In the Azure portal, go to your project.

1. In the left menu under **Environment configuration**, select **Environment types**, and then select **Add**.

    :::image type="content" source="media/quickstart-create-configure-projects/add-environment-types.png" alt-text="Screenshot that shows the Environment types pane.":::

1. In **Add environment type to \<project-name\>**, enter or select the following information:

    |Name     |Value     |
    |---------|----------|
    |**Type**| Select a dev center level environment type to enable for the specific project.|
    |**Deployment subscription**| Select the subscription in which the environment will be created.|
    |**Deployment identity** | Select either a system-assigned identity or a user-assigned managed identity that's used to perform deployments on behalf of the user.|
    |**Permissions on environment resources** > **Environment creator role(s)**|  Select the roles to give access to the environment resources.|
    |**Permissions on environment resources** > **Additional access** | Select the users or Azure Active Directory groups to assign to specific roles on the environment resources.|
    |**Tags** | Enter a tag name and a tag value. These tags are applied on all resources that are created as part of the environment.|

   :::image type="content" source="./media/quickstart-create-configure-projects/add-project-environment-type-page.png" alt-text="Screenshot that shows adding details in the Add project environment type pane.":::

> [!NOTE]
> At least one identity (system-assigned or user-assigned) must be enabled for deployment identity. The identity is used to perform the environment deployment on behalf of the developer. Additionally, the identity attached to the dev center should be [assigned the Owner role](how-to-configure-managed-identity.md) for  access to the deployment subscription for each environment type.

## Give project access to the development team

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

> [!NOTE]
> Only a user who has the [Deployment Environments User](how-to-configure-deployment-environments-user.md) role, the [DevCenter Project Admin](how-to-configure-project-admin.md) role, or a built-in role that has appropriate permissions can create an environment.

## Next steps

In this quickstart, you created a project and granted project access to your development team. To learn about how your development team members can create environments, advance to the next quickstart.

> [!div class="nextstepaction"]
> [Quickstart: Create and access an environment](quickstart-create-access-environments.md)
