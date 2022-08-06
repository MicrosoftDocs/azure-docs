---
title: 'Quickstart: Set up an Azure Deployment Environments Dev center'
description: This quickstart shows you how to configure the Azure Deployment Environments (ADE) service. You'll create a Dev center, attach an Identity, attach a Catalog, and create Environment types.
author: anandmeg
ms.author: meghaanand
ms.topic: quickstart
ms.service: deployment-environments
ms.date: 08/05/2022
ms.custom: devdivchpfy22
---

# Quickstart: Create and configure the Azure Deployment Environments Dev center

This tutorial shows you how to configure Azure Deployment Environments by using the Azure portal. The Enterprise Dev IT team typically sets up a Dev center, configures different entities within the Dev center, creates projects and provides access to development teams. Development teams create Environments using the Catalog items, connect to individual resources, and deploy their applications.

In this quickstart, you'll perform the following actions:

* Create a Dev center
* Attach an Identity
* Attach a Catalog
* Create Environment types

## Create a Dev center

The following steps illustrate how to use the Azure portal to create and configure a Dev center in Azure Deployment Environments.

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters).

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/create-devcenter.png" alt-text="Screenshot of sign-in page to create and configure a Dev center.":::

1. Select on **+ Add** and in the **Basics** tab of **Create a Dev center** window, perform the following actions:

    |Name      |Value      |
    |----------|-----------|
    |**Subscription**|Select the subscription in which you want to create the Dev center.|
    |**Resource group**|Either use an existing resource group or select **Create new**, and enter a name for the resource group.|
    |**Name**|Enter a name for the Dev center.|
    |**Location**|Select the location/region in which you want the Dev center to be created.|

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/create-devcenter-basics.png" alt-text="Screenshot of Basics tab of Create the Azure Deployment Environment Dev center.":::

1. In the **Tags** tab, enter a **Name** and **Value** pair that you want to assign.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/create-devcenter-tags.png" alt-text="Screenshot of Tags tab of a Dev center to apply the same tag to multiple resources and resource groups.":::

1. In the **Review** tab, validate all the details and select **Create**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/create-devcenter-review.png" alt-text="Screenshot of Review tab of a DevCenter to validate all the details.":::

1. Confirm that the Dev center is created successfully by checking the **Notifications**. Select **Go to resource**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/create-devcenter-notification.png" alt-text="Screenshot of Notification to confirm the creation of Dev center.":::

1. Confirm that you see the **Dev center** page.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/devcenter-overview.png" alt-text="Screenshot of DevCenter page to confirm the DevCenter is created and displayed on Dev center page":::

## Attach an [Identity](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/project-fidalgo-concepts.md#identities)

After you've created a Dev center, the next step is to create a system-assigned managed identity or attach an existing user-assigned managed identity.

### Using a system-assigned managed identity

1. Create a system-assigned managed identity by switching the status to **On**, selecting **Save** and confirming **Yes**. [Learn more about system-assigned managed identities.](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/configure-managed-identity.md#types-of-managed-identities)

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/system-assigned-identity-tab.png" alt-text="Screenshot of system-assigned managed identity tab.":::

1. After the system-assigned managed identity is created, select **Azure role assignments** to provide **Owner** access on the subscriptions that will be used in [Mappings](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/project-fidalgo-concepts.md#mappings) and ensure the **Identity** has [access to the **Key Vault** secrets](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/configure-managed-identity.md#assigning-key-vault-secret-access) containing the personal access token (PAT) token to access your repository.

### Using the user-assigned existing managed identity

1. Switch to the **User Assigned** tab and select **+ Add** to attach an existing identity.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/user-assigned-identity-tab.png" alt-text="Screenshot of user-assigned tab.":::

1. On the **Add user assigned managed identity** page,
    1. For **Subscription**, select the subscription in which the Identity exists.
    1. For **User assigned managed identities**, select an existing Identity from the drop-down.
    1. Select **Add**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/add-user-assigned-managed-identity.png" alt-text="Screenshot of user-assigned managed identity tab.":::

1. After the identity is attached, ensure that the attached identity has **Owner** access on the subscriptions that will be used in [Mappings](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/project-fidalgo-concepts.md#mappings). Also, check **Reader** access to all subscriptions that a project lives in. Also ensure the identity has [access to the Key Vault secrets](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/configure-managed-identity.md#assigning-key-vault-secret-access) containing the personal access token (PAT) token to access the repository.

## Attach a [Catalog](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/project-fidalgo-concepts.md#catalogs)

**Prerequisite** - Before attaching a Catalog, store the personal access token (PAT) as a [Key Vault secret](../key-vault/secrets/quick-create-portal.md) and copy the **Secret Identifier**. [Learn more about generating a PAT](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/configure-catalog.md#get-the-repository-information-and-credentials). Ensure that the Identity attached to the Dev center has [**Get** access to the **Secret**](../key-vault/general/assign-access-policy.md).

1. Select **Catalogs** in the left menu and select **+ Add Repo**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/catalog-tab.png" alt-text="Screenshot of catalog option to the left menu of the Dev center and the Add Repo option in the catalog menu.":::

1. In **Add New Catalog** page, provide the following details and select **Add**.

    |Name     |Value     |
    |---------|----------|
    |**Name**|Provide a name for your catalog.|
    |**Git clone Uri**|Provide the URI to your GitHub or ADO repository.|
    |**Branch Name**|Provide the repository branch that you would like to connect.|
    |**Personal Access Token**|Provide the secret identifier that contains your PAT for the repository.|
    |**Folder Path**|Provide the repo path in which the catalog items exist.|

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/add-new-catalog-tab.png" alt-text="Screenshot of add new catalog page.":::

1. Confirm that the catalog is successfully added by checking the **Notifications**.

## Create Environment types

Environment types help you define the different types of environments your development teams can create and apply different settings for different environment types.

1. Select the **Environment types** in the left menu and select **+ Add**.
1. On the **Add environment type** page, provide the following details and select **Add**.

    |Name     |Value     |
    |---------|----------|
    |**Name**|Select a name for the environment type.|
    |**Description**|You may choose to provide details about the environment type.|
    |**Tags**|Provide a **Name** and **Value**.|

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/add-environment-type-tab.png" alt-text="Screenshot of add environment type page.":::

1. Confirm that the environment type is added.

## Next steps

In this quickstart, you created a Dev center and configured it with an identity, a catalog, and environment types. To learn about how to create and configure a project, advance to the next quickstart:

* [Quickstart: Create and Configure Projects](./quickstart-create-and-configure-projects.md)
