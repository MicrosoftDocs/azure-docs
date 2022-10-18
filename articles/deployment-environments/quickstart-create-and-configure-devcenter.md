---
title: Configure the Azure Deployment Environments service
description: This quickstart shows you how to configure the Azure Deployment Environments service. You'll create a dev center, attach an identity, attach a catalog, and create environment types.
author: anandmeg
ms.author: meghaanand
ms.topic: quickstart
ms.service: deployment-environments
ms.custom: ignite-2022
ms.date: 10/12/2022
---

# Quickstart: Set up your Azure Deployment Environments Preview instance

This quickstart shows you how to configure Azure Deployment Environments Preview by using the Azure portal. The enterprise development infrastructure team typically sets up a dev center, configures different entities within the dev center, creates projects, and provides access to development teams. Development teams create [environments](concept-environments-key-concepts.md#environments) by using [catalog items](concept-environments-key-concepts.md#catalog-items), connect to individual resources, and deploy their applications.

In this quickstart, you perform the following actions:

> [!div class="checklist"]
>
> - Create a dev center.
> - Attach an identity.
> - Attach a catalog.
> - Create environment types

> [!IMPORTANT]
> Azure Deployment Environments currently is in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure role-based access control (Azure RBAC) role with permissions to create and manage resources in the subscription, such as [Contributor](../role-based-access-control/built-in-roles.md#contributor) or [Owner](../role-based-access-control/built-in-roles.md#owner).

## Create a dev center

To use the Azure portal to create and configure a Dev center in Azure Deployment Environments:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar, search for **Azure Deployment Environments**, and then select the service in the results.
1. In the Dev centers navigation menu, select **Create**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/deployment-environments-add-devcenter.png" alt-text="Screenshot that shows how to create a dev center in Azure Deployment Environments.":::

1. In **Create a dev center**, on the **Basics** tab, select or enter the following information:

    |Name      |Value      |
    |----------|-----------|
    |**Subscription**|Select the subscription in which you want to create the dev center.|
    |**Resource group**|Either use an existing resource group or select **Create new** and enter a name for the resource group.|
    |**Name**|Enter a name for the dev center.|
    |**Location**|Select the location or region where you want to create the dev center.|

1. \[Optional\] Select the **Tags** tab and add a **Name**:**Value** pair.
1. Select **Review + Create**
1. On the **Review** tab, validate the deployment, and then select **Create**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/create-devcenter-review.png" alt-text="Screenshot that shows the Review tab of a DevCenter to validate all the details.":::

1. Confirm that the dev center is created successfully by checking your Azure portal **Notifications**. Then, select **Go to resource**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/azure-notifications.png" alt-text="Screenshot of Notifications to confirm the creation of dev center.":::

1. In **Dev centers**, verify that the dev center appears.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/deployment-envrionments-devcenter-created.png" alt-text="Screenshot of Dev centers page to confirm the dev center is created and displayed on the page":::

## Attach an identity to the dev center

After you create a dev center, attach an [identity](concept-environments-key-concepts.md#identities) to the dev center. Learn about the two [types of identities](how-to-configure-managed-identity.md#types-of-managed-identities) you can attach:

- System-assigned managed identity
- User-assigned managed identity

### Use a system-assigned managed identity

1. Complete the steps to create a [system-assigned managed identity](how-to-configure-managed-identity.md#configure-a-system-assigned-managed-identity-for-a-dev-center).

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/system-assigned-managed-identity.png" alt-text="Screenshot of system assigned managed identity.":::

1. After you create a system-assigned managed identity, in **Identity**, on the **System assigned** tab, select **Azure role assignments**.
1. Select **Owner** to give the identity access on the subscriptions that will be used to configure [project environment types](concept-environments-key-concepts.md#project-environment-types).

   Make sure that the identity has [access to the Key Vault secrets](how-to-configure-managed-identity.md#assign-the-managed-identity-access-to-the-key-vault-secret) that contain the personal access token (PAT) token to access your repository.

### Use an existing user-assigned managed identity

1. Complete the steps to attach a [user-assigned managed identity](how-to-configure-managed-identity.md#configure-a-user-assigned-managed-identity-for-a-dev-center).

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/user-assigned-managed-identity.png" alt-text="Screenshot of user assigned managed identity.":::

1. After you attach the identity, ensure that the attached identity has Owner access on the subscriptions that will be used to configure [project environment types](how-to-configure-project-environment-types.md). Give the identity Reader access to all subscriptions that a project lives in. Also, make sure that the identity has [access to the Key Vault secrets](how-to-configure-managed-identity.md#assign-the-managed-identity-access-to-the-key-vault-secret) that contain the PAT to access the repository.

> [!NOTE]
> The [identity](concept-environments-key-concepts.md#identities) that's attached to the dev center should be granted Owner access to the deployment subscription configured per environment type.

## Attach a catalog to the dev center

Next, attach a catalog to your dev center.

### Prerequisites

Before you attach a [catalog](concept-environments-key-concepts.md#catalogs), store the PAT as a [Key Vault secret](../key-vault/secrets/quick-create-portal.md) and copy the **Secret Identifier**. Ensure that the [identity](concept-environments-key-concepts.md#identities) that's attached to the dev center has [Get access to the secret](../key-vault/general/assign-access-policy.md).

To attach a catalog:

1. In the [Azure portal](https://portal.azure.com/), go to Azure Deployment Environments.
1. In **Dev centers**, select your dev center.
1. In the left menu under **Environment configuration**, select **Catalogs**, and select **Add**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/catalogs-page.png" alt-text="Screenshot of Catalogs page.":::

1. In the **Add catalog** pane, enter the following information, and then select **Add**.

    |Name     |Value     |
    |---------|----------|
    |**Name**|Enter a name for your catalog.|
    |**Git clone URI**|Enter the URI to your GitHub or Azure DevOps repository.|
    |**Branch**|Enter the repository branch that you want to connect.|
    |**Folder path**|Enter the repo path where the [catalog item](concept-environments-key-concepts.md#catalog-items) exists.|
    |**Secret identifier**|Enter the secret identifier that contains your PAT for the repository.|

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/add-new-catalog-form.png" alt-text="Screenshot of add new catalog page.":::

1. Confirm that the catalog is successfully added by checking your Azure portal **Notifications**.

## Create an environment type

Use an environment type to help you define the different types of environments your development teams can deploy. You can apply different settings for each environment type.

1. In the left menu under **Environment configuration**, select **Environment types**, and select **Create**.
1. On the **Create environment type** page, provide the following details and select **Add**.

    |Name     |Value     |
    |---------|----------|
    |**Name**|Add a name for the environment type.|
    |**Tags**|Provide a **Name** and **Value**.|

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/create-environment-type.png" alt-text="Screenshot of Create environment type form.":::

1. Confirm that the environment type is added by checking the **Notifications**.

Environment types added to the dev center are available within each project it contains, but are not enabled by default. When enabled at the project level, the environment type determines the managed identity and subscription that is used for deploying environments.

## Next steps

In this quickstart, you created a dev center and configured it with an identity, a catalog, and environment types. To learn about how to create and configure a project, advance to the next quickstart:

- [Quickstart: Create and configure projects](./quickstart-create-and-configure-projects.md)
