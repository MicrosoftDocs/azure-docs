---
title: Create and configure a dev center
titleSuffix: Azure Deployment Environments
description: Learn how to create and configure a dev center in Azure Deployment Environments Preview. In the quickstart, you create a dev center, attach an identity, attach a catalog, and create environment types.
author: RoseHJM
ms.author: rosemalcolm
ms.topic: quickstart
ms.service: deployment-environments
ms.custom: ignite-2022
ms.date: 10/26/2022
---

# Quickstart: Create and configure a dev center

This quickstart shows you how to create and configure a dev center in Azure Deployment Environments Preview.

An enterprise development infrastructure team typically sets up a dev center, configures different entities within the dev center, creates projects, and provides access to development teams. Development teams create [environments](concept-environments-key-concepts.md#environments) by using [catalog items](concept-environments-key-concepts.md#catalog-items), connect to individual resources, and deploy applications.

In this quickstart, you learn how to:

> [!div class="checklist"]
>
> - Create a dev center
> - Attach an identity to your dev center
> - Attach a catalog to your dev center
> - Create environment types

> [!IMPORTANT]
> Azure Deployment Environments currently is in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure role-based access control role with permissions to create and manage resources in the subscription, such as [Contributor](../role-based-access-control/built-in-roles.md#contributor) or [Owner](../role-based-access-control/built-in-roles.md#owner).

## Create a dev center

To create and configure a Dev center in Azure Deployment Environments by using the Azure portal:

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

1. (Optional) Select the **Tags** tab and enter a **Name**:**Value** pair.
1. Select **Review + Create**.
1. On the **Review** tab, wait for deployment validation, and then select **Create**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/create-devcenter-review.png" alt-text="Screenshot that shows the Review tab of a dev center to validate the deployment details.":::

1. Confirm that the dev center was successfully created by checking your Azure portal notifications. Then, select **Go to resource**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/azure-notifications.png" alt-text="Screenshot that shows portal notifications to confirm the creation of a dev center.":::

1. In **Dev centers**, verify that the dev center appears.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/deployment-environments-devcenter-created.png" alt-text="Screenshot that shows the Dev centers overview, to confirm that the dev center is created.":::

## Attach an identity to the dev center

After you create a dev center, attach an [identity](concept-environments-key-concepts.md#identities) to the dev center. Learn about the two [types of identities](how-to-configure-managed-identity.md#add-a-managed-identity) you can attach:

- System-assigned managed identity
- User-assigned managed identity

For more information, see [Configure a managed identity](how-to-configure-managed-identity.md).

### Attach a system-assigned managed identity

To attach a system-assigned managed identity to your dev center:

1. Complete the steps to create a [system-assigned managed identity](how-to-configure-managed-identity.md#add-a-system-assigned-managed-identity-to-a-dev-center).

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/system-assigned-managed-identity.png" alt-text="Screenshot that shows a system-assigned managed identity.":::

1. After you create a system-assigned managed identity, assign the Owner role to give the [identity access](how-to-configure-managed-identity.md#assign-a-subscription-role-assignment-to-the-managed-identity) on the subscriptions that will be used to configure [project environment types](concept-environments-key-concepts.md#project-environment-types).

   Make sure that the identity has [access to the key vault secret](how-to-configure-managed-identity.md#grant-the-managed-identity-access-to-the-key-vault-secret) that contains the personal access token to access your repository.

### Attach an existing user-assigned managed identity

To attach a user-assigned managed identity to your dev center:

1. Complete the steps to attach a [user-assigned managed identity](how-to-configure-managed-identity.md#add-a-user-assigned-managed-identity-to-a-dev-center).

   :::image type="content" source="media/quickstart-create-and-configure-devcenter/user-assigned-managed-identity.png" alt-text="Screenshot that shows a user-assigned managed identity.":::

1. After you attach the identity, assign the Owner role to give the [identity access](how-to-configure-managed-identity.md#assign-a-subscription-role-assignment-to-the-managed-identity) on the subscriptions that will be used to configure [project environment types](how-to-configure-project-environment-types.md). Give the identity Reader access to all subscriptions that a project lives in.

   Make sure that the identity has [access to the key vault secret](how-to-configure-managed-identity.md#grant-the-managed-identity-access-to-the-key-vault-secret) that contains the personal access token to access the repository.

> [!NOTE]
> The [identity](concept-environments-key-concepts.md#identities) that's attached to the dev center should be assigned the Owner role for access to the deployment subscription for each environment type.

## Add a catalog to the dev center

> [!NOTE]
> Before you add a [catalog](concept-environments-key-concepts.md#catalogs), store the personal access token as a [key vault secret](../key-vault/secrets/quick-create-portal.md) in Azure Key Vault and copy the secret identifier. Ensure that the [identity](concept-environments-key-concepts.md#identities) that's attached to the dev center has [GET access to the secret](../key-vault/general/assign-access-policy.md).

To add a catalog to your dev center:

1. In the Azure portal, go to Azure Deployment Environments.
1. In **Dev centers**, select your dev center.
1. In the left menu under **Environment configuration**, select **Catalogs**, and then select **Add**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/catalogs-page.png" alt-text="Screenshot that shows the Catalogs pane.":::

1. In the **Add catalog** pane, enter the following information, and then select **Add**.

    |Name     |Value     |
    |---------|----------|
    |**Name**|Enter a name for your catalog.|
    |**Git clone URI**|Enter the URI to your GitHub or Azure DevOps repository.|
    |**Branch**|Enter the repository branch that you want to connect.|
    |**Folder path**|Enter the repository relative path where the [catalog item](concept-environments-key-concepts.md#catalog-items) exists.|
    |**Secret identifier**|Enter the secret identifier that contains your personal access token for the repository.|

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/add-new-catalog-form.png" alt-text="Screenshot that shows the Add new catalog pane.":::

1. Confirm that the catalog is successfully added by checking your Azure portal notifications.

1. Select the specific repository, and then select **Sync**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/sync-catalog.png" alt-text="Screenshot that shows how to sync the catalog." :::

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

## Next steps

In this quickstart, you created a dev center and configured it with an identity, a catalog, and an environment type. To learn how to create and configure a project, advance to the next quickstart.

> [!div class="nextstepaction"]
> [Quickstart: Create and configure a project](./quickstart-create-and-configure-projects.md)
