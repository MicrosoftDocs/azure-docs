---
title: Set up an Azure Deployment Environments Project
description: This quickstart shows you how to create and configure an Azure Deployment Environments project and associate it with a dev center.
author: anandmeg
ms.author: meghaanand
ms.service: deployment-environments
ms.custom: ignite-2022
ms.topic: quickstart
ms.date: 10/12/2022
---

# Quickstart: Create and configure a project

This quickstart shows you how to create and configure a project in Azure Deployment Environments Preview. Then, you associate the project with the dev center you created in [Quickstart: Create and configure a dev center](./quickstart-create-and-configure-devcenter.md).

An enterprise development infrastructure team typically creates projects and provides project access to development teams. Development teams then create [environments](concept-environments-key-concepts.md#environments) by using [catalog items](concept-environments-key-concepts.md#catalog-items), connect to individual resources, and deploy applications.

In this quickstart, you learn how to:

> [!div class="checklist"]
>
> - Create a project
> - Configure a project
> - Provide project access to the development team

> [!IMPORTANT]
> Azure Deployment Environments currently is in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure role-based access control role with permissions to create and manage resources in the subscription, such as [Contributor](../role-based-access-control/built-in-roles.md#contributor) or [Owner](../role-based-access-control/built-in-roles.md#owner).

## Create a project

To create and configure a project in your dev center:

1. In the [Azure portal](https://portal.azure.com/), go to Azure Deployment Environments.
1. In **Dev centers**, select your dev center.
1. In the left menu under **Manage**, select **Projects**, and then elect **Create**.
1. In **Create a project**, on the **Basics** tab, enter or select the following information:

     |Name   |Value   |
     |----------|-----------|
     |**Subscription**     |Select the subscription in which you want to create the project.       |
     |**Resource group**|Either use an existing resource group or select **Create new** and enter a name for the resource group.   |
     |**Dev center**|Select a dev center to associate with this project. All settings for the dev center will apply to the project.   |
     |**Name**|Enter a name for the project.  |
     |**Description** (Optional) |Enter any project-related details.  |

    :::image type="content" source="media/quickstart-create-configure-projects/create-project-page-basics.png" alt-text="Screenshot of the Basics tab of the Create a project page.":::

1. Select the **Tags** tab and enter a **Name**:**Value** pair.

    :::image type="content" source="media/quickstart-create-configure-projects/create-project-page-tags.png" alt-text="Screenshot of the Tags tab of the Create a project page.":::

1. On the **Review + Create** tab, wait for deployment validation, and then select **Create**.

    :::image type="content" source="media/quickstart-create-configure-projects/create-project-page-review-create.png" alt-text="Screenshot of selecting the Create button to validate and create a project.":::

1. Confirm that the project was successfully created by checking your Azure portal notifications. Then, select **Go to resource**.

1. Confirm that you see the project overview page.

    :::image type="content" source="media/quickstart-create-configure-projects/created-project.png" alt-text="Screenshot of the Project page.":::

## Configure a project

To configure a project, add a [project environment type](how-to-configure-project-environment-types.md):

1. On the project overview page, in the left menu under **Environment configuration**, select **Environment types**, and then select **Add**.

    :::image type="content" source="media/quickstart-create-configure-projects/add-environment-types.png" alt-text="Screenshot of the Environment types page.":::

1. In **Add environment type to \<project-name\>**, enter or select the following information:

    |Name     |Value     |
    |---------|----------|
    |**Type**| Select a dev center level environment type to enable for the specific project.|
    |**Deployment subscription**| Select the subscription in which the environment will be created.|
    |**Deployment identity** | Select either a system assigned identity or a user assigned managed identity that'll be used to perform deployments on behalf of the user.|
    |**Permissions on environment resources** > **Environment creator role(s)**|  Select the role(s) that'll get access to the environment resources.|
    |**Permissions on environment resources** > **Additional access** | Select the user(s) or Azure Active Directory (Azure AD) group(s) that'll be granted specific role(s) on the environment resources.|
    |**Tags** | Enter a tag name and a tag value. These tags are applied on all resources that are created as part of the environment.|

   :::image type="content" source="./media/configure-project-environment-types/add-project-environment-type-page.png" alt-text="Screenshot showing adding details on the add project environment type page.":::

> [!NOTE]
> At least one identity (system-assigned or user-assigned) must be enabled for deployment identity. The identity is used to perform the environment deployment on behalf of the developer. Additionally, the identity attached to the dev center should be [granted Owner access to the deployment subscription](how-to-configure-managed-identity.md) configured per environment type.

## Give project access to the development team

1. On the project overview page, in the left menu, select **Access control (IAM)**.
1. Select **Add** > **Add role assignment**.

    :::image type="content" source="media/quickstart-create-configure-projects/project-access-control-page.png" alt-text="Screenshot of the Access control page.":::

1. In **Add role assignment**, enter the following information, and then select **Save**:

    1. On the **Role** tab, select either [DevCenter Project Admin](how-to-configure-project-admin.md) or [Deployment Environments user](how-to-configure-deployment-environments-user.md).
    1. On the **Members** tab, select either a **User, group, or service principal** or a **Managed identity** to assign access.

    :::image type="content" source="media/quickstart-create-configure-projects/add-role-assignment.png" alt-text="Screenshot of the Add role assignment page.":::

>[!NOTE]
> Only users with a [Deployment Environments user](how-to-configure-deployment-environments-user.md) role or a [DevCenter Project Admin](how-to-configure-project-admin.md) role or with a built-in role with appropriate permissions can create environments.

## Next steps

In this quickstart, you created a project and granted project access to your development team. To learn about how your development team members can create environments, advance to the next quickstart.

> [!div class="nextstepaction"]
> [Quickstart: Create and access environments](quickstart-create-access-environments.md)
