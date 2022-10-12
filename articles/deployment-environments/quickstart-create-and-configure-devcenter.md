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

# Quickstart: Configure the Azure Deployment Environments Preview service

This quickstart shows you how to configure Azure Deployment Environments Preview by using the Azure portal. The Enterprise Dev Infra team typically sets up a Dev center, configures different entities within the Dev center, creates projects, and provides access to development teams. Development teams create [Environments](concept-environments-key-concepts.md#environments) using the [Catalog items](concept-environments-key-concepts.md#catalog-items), connect to individual resources, and deploy their applications.

In this quickstart, you'll perform the following actions:

* Create a Dev center
* Attach an Identity
* Attach a Catalog
* Create Environment types

> [!IMPORTANT]
> Azure Deployment Environments is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure RBAC role with permissions to create and manage resources in the subscription, such as [Contributor](../role-based-access-control/built-in-roles.md#contributor) or [Owner](../role-based-access-control/built-in-roles.md#owner).

## Create a Dev center

The following steps illustrate how to use the Azure portal to create and configure a Dev center in Azure Deployment Environments.

1. Sign in to the [Azure portal](https://portal.azure.com).

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/deployment-environments-add-devcenter.png" alt-text="Screenshot to create and configure an Azure Deployment Environments dev center.":::

1. Select **+ Add** to create a new dev center.
1. Add the following details on the **Basics** tab of the **Create a dev center** page.

    |Name      |Value      |
    |----------|-----------|
    |**Subscription**|Select the subscription in which you want to create the dev center.|
    |**Resource group**|Either use an existing resource group or select **Create new**, and enter a name for the resource group.|
    |**Name**|Enter a name for the dev center.|
    |**Location**|Select the location/region in which you want the dev center to be created.|

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/create-devcenter-page-basics.png" alt-text="Screenshot of Basics tab of the Create a dev center page.":::

1. [Optional] Select the **Tags** tab and add a **Name**/**Value** pair.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/create-devcenter-page-tags.png" alt-text="Screenshot of Tags tab of a Dev center to apply the same tag to multiple resources and resource groups.":::

1. Select **Review + Create**
1. Validate all details on the **Review** tab, and then select **Create**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/create-devcenter-review.png" alt-text="Screenshot of Review tab of a DevCenter to validate all the details.":::

1. Confirm that the dev center is created successfully by checking **Notifications**. Select **Go to resource**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/azure-notifications.png" alt-text="Screenshot of Notifications to confirm the creation of dev center.":::

1. Confirm that you see the dev center on the **Dev centers** page.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/deployment-envrionments-devcenter-created.png" alt-text="Screenshot of Dev centers page to confirm the dev center is created and displayed on the page":::

## Attach an Identity

After you've created a dev center, the next step is to attach an [identity](concept-environments-key-concepts.md#identities) to the dev center. Learn about the [types of identities](how-to-configure-managed-identity.md#types-of-managed-identities) (system assigned managed identity or a user assigned managed identity) you can attach.

### Using a system-assigned managed identity

1. Create a [system-assigned managed identity](how-to-configure-managed-identity.md#configure-a-system-assigned-managed-identity-for-a-dev-center).

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/system-assigned-managed-identity.png" alt-text="Screenshot of system assigned managed identity.":::

1. After the system-assigned managed identity is created, select **Azure role assignments** to provide **Owner** access on the subscriptions that will be used to configure [Project Environment Types](concept-environments-key-concepts.md#project-environment-types) and ensure the **Identity** has [access to the **Key Vault** secrets](how-to-configure-managed-identity.md#assign-the-managed-identity-access-to-the-key-vault-secret) containing the personal access token (PAT) token to access your repository.

### Using the user-assigned existing managed identity

1. Attach a [user assigned managed identity](how-to-configure-managed-identity.md#configure-a-user-assigned-managed-identity-for-a-dev-center).

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/user-assigned-managed-identity.png" alt-text="Screenshot of user assigned managed identity.":::

1. After the identity is attached, ensure that the attached identity has **Owner** access on the subscriptions that will be used to configure [Project Environment Types](how-to-configure-project-environment-types.md) and provide **Reader** access to all subscriptions that a project lives in. Also ensure the identity has [access to the Key Vault secrets](how-to-configure-managed-identity.md#assign-the-managed-identity-access-to-the-key-vault-secret) containing the personal access token (PAT) token to access the repository.

>[!NOTE]
> The [identity](concept-environments-key-concepts.md#identities) attached to the dev center should be granted 'Owner' access to the deployment subscription configured per environment type.

## Attach a Catalog

**Prerequisite** - Before attaching a [Catalog](concept-environments-key-concepts.md#catalogs), store the personal access token (PAT) as a [Key Vault secret](../key-vault/secrets/quick-create-portal.md) and copy the **Secret Identifier**. Ensure that the [Identity](concept-environments-key-concepts.md#identities) attached to the dev center has [**Get** access to the **Secret**](../key-vault/general/assign-access-policy.md).

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Access Azure Deployment Environments.
1. Select your dev center from the list.
1. Select **Catalogs** from the left pane and select **+ Add**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/catalogs-page.png" alt-text="Screenshot of Catalogs page.":::

1. On the **Add New Catalog** page, provide the following details, and then select **Add**.

    |Name     |Value     |
    |---------|----------|
    |**Name**|Provide a name for your catalog.|
    |**Git clone URI**|Provide the URI to your GitHub or ADO repository.|
    |**Branch**|Provide the repository branch that you would like to connect.|
    |**Folder path**|Provide the repo path in which the [catalog item](concept-environments-key-concepts.md#catalog-items) exist.|
    |**Secret identifier**|Provide the secret identifier that which contains your Personal Access Token (PAT) for the repository|

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/add-new-catalog-form.png" alt-text="Screenshot of add new catalog page.":::

1. Confirm that the catalog is successfully added by checking the **Notifications**.

## Create Environment types

Environment types help you define the different types of environments your development teams can deploy. You can apply different settings per environment type.

1. Select the **Environment types** from the left pane and select **+ Create**.
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

* [Quickstart: Create and Configure projects](./quickstart-create-and-configure-projects.md)
