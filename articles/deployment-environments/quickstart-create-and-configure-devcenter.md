---
title: Create and configure a dev center
titleSuffix: Azure Deployment Environments
description: Learn how to configure a dev center in Azure Deployment Environments. You create a dev center, attach an identity, attach a catalog, and create environment types.
author: RoseHJM
ms.author: rosemalcolm
ms.topic: quickstart
ms.service: deployment-environments
ms.custom: ignite-2022, build-2023
ms.date: 10/23/2023
---

# Quickstart: Create and configure a dev center for Azure Deployment Environments

In this quickstart, you'll set up all the resources in Azure Deployment Environments to enable development teams to self-service deployment environments for their applications. Learn how to create and configure a dev center, add a catalog to the dev center, and define an environment type.

A platform engineering team typically sets up a dev center, attaches external catalogs to the dev center, creates projects, and provides access to development teams. Development teams create [environments](concept-environments-key-concepts.md#environments) by using [environment definitions](concept-environments-key-concepts.md#environment-definitions), connect to individual resources, and deploy applications. To learn more about the components of Azure Deployment Environments, see [Key concepts for Azure Deployment Environments](concept-environments-key-concepts.md).

The following diagram shows the steps you perform in this quickstart to configure a dev center for Azure Deployment Environments in the Azure portal. 

:::image type="content" source="media/quickstart-create-and-configure-devcenter/environments-build-stages.png" alt-text="Diagram showing the stages required to configure a dev center for Deployment Environments.":::

You need to perform the steps in both quickstarts before you can create a deployment environment.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure role-based access control role with permissions to create and manage resources in the subscription, such as [Contributor](../role-based-access-control/built-in-roles.md#contributor) or [Owner](../role-based-access-control/built-in-roles.md#owner).
- An [Azure DevOps repository](https://azure.microsoft.com/products/devops/repos/) repository that contains IaC templates. You can use the [Deployment Environments sample catalog](https://github.com/azure/deployment-environments) that contains samples created and maintained by the Azure Deployment Environments team.
  - In your Azure DevOps organization, [create a project](/azure/devops/repos/get-started/sign-up-invite-teammates?view=azure-devops&branch=main&preserve-view=true) to store your repository.
  - Import the [Deployment Environments sample catalog](https://github.com/azure/deployment-environments)  

## Create a dev center
To create and configure a dev center in Azure Deployment Environments by using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Azure Deployment Environments**, and then select the service in the results.
1. In **Dev centers**, select **Create**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/deployment-environments-add-devcenter.png" alt-text="Screenshot that shows how to create a dev center in Azure Deployment Environments.":::

1. In **Create a dev center**, on the **Basics** tab, select or enter the following information:

    |Name      |Value      |
    |----------|-----------|
    |**Subscription**|Select the subscription in which you want to create the dev center.|
    |**Resource group**|Either use an existing resource group or select **Create new** and enter a name for the resource group.|
    |**Name**|Enter a name for the dev center.|
    |**Location**|Select the location or region where you want to create the dev center.|

1. Select **Review + Create**.
1. On the **Review** tab, wait for deployment validation, and then select **Create**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/create-devcenter-review.png" alt-text="Screenshot that shows the Review tab of a dev center to validate the deployment details.":::

1. You can check the progress of the deployment in your Azure portal notifications. 

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/azure-notifications.png" alt-text="Screenshot that shows portal notifications to confirm the creation of a dev center.":::

1. When the creation of the dev center is complete, select **Go to resource**.

1. In **Dev centers**, verify that the dev center appears.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/deployment-environments-devcenter-created.png" alt-text="Screenshot that shows the Dev centers overview, to confirm that the dev center is created.":::

## Configure a managed identity for the dev center

After you create a dev center, attach an [identity](concept-environments-key-concepts.md#identities) to the dev center. You can attach either a system-assigned managed identity or a user-assigned managed identity. Learn about the two [types of identities](how-to-configure-managed-identity.md#add-a-managed-identity).

In this quickstart, you configure a system-assigned managed identity for your dev center. You then assign roles to the managed identity to allow the dev center to create environment types in your subscription and read the Azure DevOps repository project that contains the catalog.

### Attach a system-assigned managed identity

To attach a system-assigned managed identity to your dev center:

1.	In Dev centers, select your dev center.
1.	In the left menu under Settings, select **Identity**.
1.	Under **System assigned**, set **Status** to **On**, and then select **Save**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/system-assigned-managed-identity-on.png" alt-text="Screenshot that shows a system-assigned managed identity.":::

1.	In the **Enable system assigned managed identity** dialog, select **Yes**.

### Assign roles for the dev center managed identity

The managed identity that represents your dev center requires access to the subscriptions where you configure the [project environment types](concept-environments-key-concepts.md#project-environment-types), and to the Azure DevOps repo that stores your catalog. 

1.	Navigate to your dev center.
1.  On the left menu under Settings, select **Identity**.
1.	Under System assigned > Permissions, select **Azure role assignments**.

    :::image type="content" source="media/quickstart-create-configure-projects/system-assigned-managed-identity.png" alt-text="Screenshot that shows a system-assigned managed identity with Role assignments highlighted.":::

1. To give Contributor access to the subscription, select **Add role assignment (Preview)**, enter or select the following information, and then select **Save**:
    
    |Name     |Value     |
    |---------|----------|
    |**Scope**|Subscription|
    |**Subscription**|Select the subscription in which to use the managed identity.|
    |**Role**|Contributor|

1. To give User Access Administrator access to the subscription, select **Add role assignment (Preview)**, enter or select the following information, and then select **Save**:

    |Name     |Value     |
    |---------|----------|
    |**Scope**|Subscription|
    |**Subscription**|Select the subscription in which to use the managed identity.|
    |**Role**|User Access Administrator|

### Assign permissions in Azure DevOps for the dev center managed identity
You must give the dev center managed identity permissions to the repository in Azure DevOps.  

1. Sign in to your [Azure DevOps organization](https://dev.azure.com).

1. Select **Organization settings**.
 
   :::image type="content" source="media/quickstart-create-and-configure-devcenter/devops-organization-settings.png" alt-text="Screenshot showing the Azure DevOps organization page, with Organization Settings highlighted."::: 
 
1. On the **Overview** page, select **Users**.

   :::image type="content" source="media/quickstart-create-and-configure-devcenter/devops-organization-overview.png" alt-text="Screenshot showing the Organization overview page, with Users highlighted.":::

1. On the **Users** page, select **Add users**.

   :::image type="content" source="media/quickstart-create-and-configure-devcenter/devops-add-user.png" alt-text="Screenshot showing the Users page, with Add user highlighted.":::

1. Complete **Add new users** by entering or selecting the following information, and then select **Add**:

    |Name     |Value     |
    |---------|----------|
    |**Users or Service Principals**|Enter the name of your dev center. </br> When you use a system assigned managed account, specify the name of the dev center, not the Object ID of the Managed Account. When you use a user assigned managed account, use the name of the managed account. |
    |**Access level**|Select **Basic**.|
    |**Add to projects**|Select the project that contains your repository.|
    |**Azure DevOps Groups**|Select **Project Readers**.|
    |**Send email invites (to Users only)**|Clear the checkbox.|

   :::image type="content" source="media/quickstart-create-and-configure-devcenter/devops-add-user-blade.png" alt-text="Screenshot showing Add users, with example entries and Add highlighted.":::

## Add a catalog to the dev center
Azure Deployment Environments supports attaching Azure DevOps repositories and GitHub repositories. You can store a set of curated IaC templates in a repository. Attaching the repository to a dev center as a catalog gives your development teams access to the templates and enables them to quickly create consistent environments.

In this quickstart, you attach an Azure DevOps repository.

### Add a catalog to your dev center
1. Navigate to your dev center.
1. In the left menu under **Environment configuration**, select **Catalogs**, and then select **Add**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/catalogs-page.png" alt-text="Screenshot that shows the Catalogs pane.":::

1. In **Add catalog**, enter the following information, and then select **Add**:

    | Field | Value |
    | ----- | ----- |
    | **Name** | Enter a name for the catalog. |
    | **Catalog location**  | Select **Azure DevOps**. |
    | **Authentication type**  | Select **Managed Identity**.|
    | **Organization**  | Select your Azure DevOps organization. |
    | **Project**  | From the list of projects, select the project that stores the repo. |
    | **Repo**  | From the list of repos, select the repo you want to add. |
    | **Branch**  | Select the branch. |
    | **Folder path**  | Dev Box retrieves a list of folders in your branch. Select the folder that stores your IaC templates. |

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/add-catalog-to-devcenter.png" alt-text="Screenshot showing the add catalog pane with examples entries and Add highlighted.":::

1. In **Catalogs** for the dev center, verify that your catalog appears. If the connection is successful, **Status** is **Connected**. Connecting to a catalog can take a few minutes the first time.
 
## Create an environment type

Use an environment type to help you define the different types of environments your development teams can deploy. You can apply different settings for each environment type.

1. In the Azure portal, go to Azure Deployment Environments.
1. In **Dev centers**, select your dev center.
1. In the left menu under **Environment configuration**, select **Environment types**, and then select **Create**.
1. In **Create environment type**, enter the following information, and then select **Add**.

    |Name     |Value     |
    |---------|----------|
    |**Name**|Enter a name for the environment type.|
    |**Tags**|Enter a tag name and a tag value.|

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/create-environment-type.png" alt-text="Screenshot that shows the Create environment type pane.":::

1. Confirm that the environment type is added by checking your Azure portal notifications.

An environment type that you add to your dev center is available in each project in the dev center, but environment types aren't enabled by default. When you enable an environment type at the project level, the environment type determines the managed identity and subscription that are used to deploy environments.

## Next step

In this quickstart, you created a dev center and configured it with an identity, a catalog, and an environment type. To learn how to create and configure a project, advance to the next quickstart.

> [!div class="nextstepaction"]
> [Quickstart: Create and configure a project](./quickstart-create-and-configure-projects.md)
