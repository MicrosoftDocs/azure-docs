---
title: Set up an Azure Deployment Environments DevCenter
description: This tutorial shows you how to configure the Azure Deployment Environments (ADE) service. You'll create a DevCenter, attach an Identity, attach a Catalog, and create Environment types.
author: anandmeg
ms.author: meghaanand
ms.topic: tutorial
ms.service: deployment-environments
ms.date: 07/20/2022
ms.custom: devdivchpfy22
---

# Tutorial: Create and configure the Azure Deployment Environments DevCenter

This tutorial shows you how to configure Azure Deployment Environments by using the Azure portal. The Enterprise Dev IT team typically sets up a DevCenter, configures different entities within the DevCenter, creates projects and provides access to development teams. Development teams create Environments using the Catalog items, connect to individual resources, and deploy their applications.

In this tutorial, you'll perform the following actions:

* Create a DevCenter
* Attach an Identity
* Attach a Catalog
* Create Environment types

## Create a DevCenter

The following steps illustrate how to use the Azure portal to create and configure a DevCenter in Azure Deployment Environments.

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters).

    :::image type="content" source="media/azure-deployment-environment-deventer.png" alt-text="Screenshot of sign in page.":::

1. Select on **+ Add** and in the **Basics** tab of **Create an Azure Deployment Environment DevCenter** window, perform the following actions:
    |Name   |Value   |
    |-------|--------|
    |**Subscription**|Select the subscription in which you want to create the DevCenter.|
    |**Resource group**|either use an existing resource group or select **Create new**, and enter a name for the resource group.|
    |**Name**|Enter a name for the DevCenter.|
    |**Location**|Select the location/region in which you want the DevCenter to be created.|

    :::image type="content" source="https://user-images.githubusercontent.com/68404454/123877585-17103700-d903-11eb-96f0-10100fdee30a.png" alt-text="Screenshot of Basics tab of Create a Azure Deployment Environment DevCenter.":::

1. In the **Tags** tab, enter a **Name** and **Value** pair that you want to assign.

    :::image type="content" source="https://user-images.githubusercontent.com/68404454/123877734-5f2f5980-d903-11eb-932c-ff76918145ff.png" alt-text="Screenshot of Tags tab.":::

1. In the **Review** tab, validate all the details and select **Create**.

    :::image type="content" source="https://user-images.githubusercontent.com/68404454/123877892-ad445d00-d903-11eb-812e-2e401350f930.png" alt-text="Screenshot of Review tab.":::

1. Confirm that the DevCenter is created successfully by checking the **Notifications**. Select **Go to resource**.

    :::image type="content" source="https://user-images.githubusercontent.com/68404454/123880317-04e4c780-d908-11eb-83b1-b035048c4a56.png" alt-text="Screenshot of Notification.":::

1. Confirm that you see the **DevCenter** page.

    :::image type="content" source="https://user-images.githubusercontent.com/68404454/123880540-82a8d300-d908-11eb-9a32-a2e90153525e.png" alt-text="Screenshot of DevCenter page.":::

## Attach an [Identity](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/project-fidalgo-concepts.md#identities)

After you've created a DevCenter, the next step is to create a system-assigned managed identity or attach an existing user-assigned managed identity.

### Using a system-assigned managed identity

1. Create a system-assigned managed identity by switching the status to **On**, selecting **Save** and confirming **Yes**. [Learn more about system-assigned managed identities.](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/configure-managed-identity.md#types-of-managed-identities)

    :::image type="content" source="https://user-images.githubusercontent.com/68404454/124187021-c58eb600-da82-11eb-8910-18e6784ab33e.png" alt-text="Screenshot of system-assigned managed identity tab.":::

1. After the system-assigned managed identity is created, select **Azure role assignments** to provide **Owner** access on the subscriptions that will be used in [Mappings](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/project-fidalgo-concepts.md#mappings) and ensure the **Identity** has [access to the **Key Vault** secrets](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/configure-managed-identity.md#assigning-key-vault-secret-access) containing the personal access token (PAT) token to access your repository.

### Using the user-assigned existing managed identity

1. Switch to the **User Assigned** tab and select **+ Add** to attach an existing identity.

    :::image type="content" source="https://user-images.githubusercontent.com/68404454/124188735-477fde80-da85-11eb-8ae4-04cafb6ec264.png" alt-text="Screenshot of user-assigned tab.":::

1. On the **Add user assigned managed identity** page,
    1. For **Subscription**, select the subscription in which the Identity exists.
    1. For **User assigned managed identities**, select an existing Identity from the drop-down.
    1. Select **Add**.

    :::image type="content" source="https://user-images.githubusercontent.com/68404454/124189314-24096380-da86-11eb-9949-0988c6a6c293.png" alt-text="Screenshot of user-assigned managed identity tab.":::

1. After the identity is attached, ensure that the attached identity has **Owner** access on the subscriptions that will be used in [Mappings](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/project-fidalgo-concepts.md#mappings). Also, check **Reader** access to all subscriptions that a project lives in. Also ensure the identity has [access to the Key Vault secrets](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/configure-managed-identity.md#assigning-key-vault-secret-access) containing the personal access token(PAT) token to access the repository.

## Attach a [Catalog](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/project-fidalgo-concepts.md#catalogs)

**Prerequisite** - Before attaching a Catalog, store the personal access token(PAT) as a [Key Vault secret](../key-vault/secrets/quick-create-portal?tabs=azure-portal) and copy the **Secret Identifier**. [Learn more about generating a PAT](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/configure-catalog.md#get-the-repository-information-and-credentials). Ensure that the Identity attached to the DevCenter has [**Get** access to the **Secret**](../key-vault/general/assign-access-policy?tabs=azure-portal).

1. Select **Catalogs** in the left menu and select **+ Add Repo**.

    :::image type="content" source="https://user-images.githubusercontent.com/68404454/124190442-e6a5d580-da87-11eb-81cf-206050c45df1.png" alt-text="Screenshot of catalog tab.":::

1. In **Add New Catalog** page, provide the following details and select **Add**.
    |Name   |Value   |
    |-------|--------|
    |**Name**|Provide a name for your catalog.|
    |**Git clone Uri**|Provide the URI to your GitHub or ADO repository.|
    |**Branch Name**|Provide the repository branch that you would like to connect.|
    |**Secret Identifier**|Provide the secret identifier that contains your PAT for the repository.|
    |**Folder Path**|Provide the repo path in which the catalog items exist.|

    :::image type="content" source="https://user-images.githubusercontent.com/68404454/124191487-74ce8b80-da89-11eb-92b7-3c610090e25a.png" alt-text="Screenshot of add new catalog page.":::

1. Confirm that the catalog is successfully added by checking the Notifications.

## Create Environment types

Environment types help you define the different types of environments your development teams can create and apply different settings for different environment types.

1. Select the **Environment types** in the left menu and select **+ Add**.
1. On the **Add environment type** page, provide the following details and select **Add**.
    |Name   |Value   |
    |-------|--------|
    |**Name**|Select a name for the environment type.|
    |**Description**|You may choose to provide details about the environment type.|
    |**Tags**|Provide a **Name** and **Value**.|

    :::image type="content" source="https://user-images.githubusercontent.com/68404454/124192773-700ad700-da8b-11eb-82e6-ca0a62892b99.png" alt-text="Screenshot of add environment type page.":::

1. Confirm that the environment type is added.

## Next steps

In this tutorial, you created a DevCenter and configured the DevCenter with identity, catalog, and environment types. To learn about how to create and configure a project, advance to the next tutorial:

* [Tutorial: Create and Configure Projects](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/tutorial-create-and-configure-projects.md)
