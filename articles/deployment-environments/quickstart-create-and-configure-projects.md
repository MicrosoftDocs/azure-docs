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

# Quickstart: Configure an Azure Deployment Environments Project

This quickstart shows you how to create and configure an Azure Deployment Environments Preview Project and associate it to the dev center created in [Quickstart: Configure an Azure Deployment Environments service](./quickstart-create-and-configure-devcenter.md). The enterprise Dev Infra team typically creates projects and provides access to development teams. Development teams then create [environments](concept-environments-key-concepts.md#environments) using the [catalog items](concept-environments-key-concepts.md#catalog-items), connect to individual resources, and deploy their applications.

In this quickstart, you'll learn how to:

* Create a project
* Configure a project
* Provide access to the development team

> [!IMPORTANT]
> Azure Deployment Environments is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure RBAC role with permissions to create and manage resources in the subscription, such as [Contributor](../role-based-access-control/built-in-roles.md#contributor) or [Owner](../role-based-access-control/built-in-roles.md#owner).

## Create a project

Create and configure a project in your dev center as follows:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Access Azure Deployment Environments.
1. Select **Projects** from the left pane.
1. Select **+ Create**. 
1. On the **Basics** tab of the **Create a project** page, provide the following details:

     |Name   |Value   |
     |----------|-----------|
     |**Subscription**     |Select the subscription in which you want to create the project.       |
     |**Resource group**|Either use an existing resource group or select **Create new**, and enter a name for the resource group.   |
     |**Dev center**|Select a Dev center to associate with this project. All the Dev center level settings will then apply to the project.   |
     |**Name**|Add a name for the project.  |
     |[Optional]**Description**|Add any project related details.  |

    :::image type="content" source="media/quickstart-create-configure-projects/create-project-page-basics.png" alt-text="Screenshot of the Basics tab of the Create a project page.":::

1. [Optional]On the **Tags** tab, add a **Name**/**Value** pair that you want to assign.

    :::image type="content" source="media/quickstart-create-configure-projects/create-project-page-tags.png" alt-text="Screenshot of the Tags tab of the Create a project page.":::

1. On the **Review + create** tab, validate all the details and select **Create**:

    :::image type="content" source="media/quickstart-create-configure-projects/create-project-page-review-create.png" alt-text="Screenshot of selecting the Create button to validate and create a project.":::

1. Confirm that the project is created successfully by checking the **Notifications**. Select **Go to resource**.

1. Confirm that you see the **Project** page.

    :::image type="content" source="media/quickstart-create-configure-projects/created-project.png" alt-text="Screenshot of the Project page.":::

## Configure a Project

Add a [project environment type](how-to-configure-project-environment-types.md) as follows:

1. On the Project page, select **Environment types** from the left pane and select **+ Add**.
    
    :::image type="content" source="media/quickstart-create-configure-projects/add-environment-types.png" alt-text="Screenshot of the Environment types page.":::
   
1. On the **Add environment type to Project** page, provide the following details:

    |Name     |Value     |
    |---------|----------|
    |**Type**| Select a dev center level environment type to enable for the specific project.|
    |**Deployment Subscription**| Select the target subscription in which the environments will be created.|
    |**Deployment Identity** | Select either a system assigned identity or a user assigned managed identity that'll be used to perform deployments on behalf of the user.|
    |**Permissions on environment resources** > **Environment Creator Role(s)**|  Select the role(s) that'll get access to the environment resources.|
    |**Permissions on environment resources** > **Additional access** | Select the user(s) or Azure Active Directory (Azure AD) group(s) that'll be granted specific role(s) on the environment resources.|
    |**Tags** | Provide a **Name** and **Value**. These tags will be applied on all resources created as part of the environments.|

   :::image type="content" source="./media/configure-project-environment-types/add-project-environment-type-page.png" alt-text="Screenshot showing adding details on the add project environment type page.":::


> [!NOTE]
> At least one identity (system assigned or user assigned) must be enabled for deployment identity and will be used to perform the environment deployment on behalf of the developer. Additionally, the identity attached to the dev center should be [granted 'Owner' access to the deployment subscription](how-to-configure-managed-identity.md) configured per environment type.

## Provide access to the development team

1. On the **Project** page, select **Access Control (IAM)** from the left pane.
1. Select **+ Add** > **Add role assignment**.

    :::image type="content" source="media/quickstart-create-configure-projects/project-access-control-page.png" alt-text="Screenshot of the Access control page.":::

1. On the **Add role assignment** page, provide the following details, and select **Save**:
    1. On the **Role** tab, select either [DevCenter Project Admin](how-to-configure-project-admin.md) or [Deployment Environments user](how-to-configure-deployment-environments-user.md).
    1. On the **Members** tab, select either a **User, group, or service principal** or a **Managed identity** to assign access.

    :::image type="content" source="media/quickstart-create-configure-projects/add-role-assignment.png" alt-text="Screenshot of the Add role assignment page.":::

>[!NOTE]
> Only users with a [Deployment Environments user](how-to-configure-deployment-environments-user.md) role or a [DevCenter Project Admin](how-to-configure-project-admin.md) role or a built-in role with appropriate permissions will be able to create environments.

## Next steps

In this quickstart, you created a project and granted access to your development team. To learn about how your development team members can create environments, advance to the next quickstart:

* [Quickstart: Create & access Environments](quickstart-create-access-environments.md)
