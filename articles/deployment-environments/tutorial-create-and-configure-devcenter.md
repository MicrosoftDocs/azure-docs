---
title: Set up an Azure Deployment Environment
description: This tutorial helps to create a DevCenter using the Azure portal.
author: meghaanand
ms.author: meghaanand
ms.topic: tutorial
ms.service: deployment-environments
ms.date: 07/20/2022
ms.custom: devdivchpfy22
---

# Tutorial: Set up an Azure Deployment Environment DevCenter

In this tutorial, you create a DevCenter by using the Azure portal. The Enterprise Dev IT team typically sets up a DevCenter, configures different entities within the DevCenter, creates projects and provides access to development teams. Development Teams creates environments using the catalog items, connects to individual resource, and deploys their application.

In this tutorial, you'll perform the following actions:

* Create a DevCenter
* Attach an identity
* Attach a catalog
* Create environment types

## Create a DevCenter

The following steps illustrate how to use the Azure portal to create and configure a DevCenter in Azure Deployment Environment.

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters).

    ![Screenshot of sign in page.](https://user-images.githubusercontent.com/68404454/123879160-162cd480-d906-11eb-8a9a-0b640b23aeb1.png)

1. Select on **+ Create** and in the **Basics** tab of **Create an Azure Deployment Environment DevCenter** window, perform the following actions:
    1. For **Subscription**, select the subscription in which you want to create the DevCenter.
    1. For **Resource group**, either use an existing resource group or select **Create new**, and enter a name for the resource group.
    1. For **Name**, enter a name for the DevCenter.
    1. For **Location**, select the location/region in which you want the DevCenter to be created.

    ![Screenshot of Basics tab of Create a Azure Deployment Environment DevCenter.](https://user-images.githubusercontent.com/68404454/123877585-17103700-d903-11eb-96f0-10100fdee30a.png)

1. In the **Tags** tab, enter a name and value pair that you want to assign.

    ![Screenshot of Tags tab.](https://user-images.githubusercontent.com/68404454/123877734-5f2f5980-d903-11eb-932c-ff76918145ff.png)

1. In the **Review** tab, validate all the details and select **Create**.

    ![Screenshot of Review tab.](https://user-images.githubusercontent.com/68404454/123877892-ad445d00-d903-11eb-812e-2e401350f930.png)

1. Confirm that the DevCenter is created successfully by looking at the notifications. Select **Go to resource**.

    ![Screenshot of Notification.](https://user-images.githubusercontent.com/68404454/123880317-04e4c780-d908-11eb-83b1-b035048c4a56.png)

1. Confirm that you see the **DevCenter** page.

    ![Screenshot of DevCenter page.](https://user-images.githubusercontent.com/68404454/123880540-82a8d300-d908-11eb-9a32-a2e90153525e.png)

## Attach an [identity](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/project-fidalgo-concepts.md#identities)

After you've created a DevCenter, the next step is to create a system-assigned identity or attach an existing user-assigned managed identity.

### Using a system assigned managed identity

1. Create a system-assigned managed identity by switching the status to **On**, selecting **Save** and confirming **Yes**. [Learn more about system-assigned managed identities.](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/configure-managed-identity.md#types-of-managed-identities)

    ![Screenshot of system-assigned managed identity tab.](https://user-images.githubusercontent.com/68404454/124187021-c58eb600-da82-11eb-8910-18e6784ab33e.png)

1. After the system-assigned managed identity is created, select **Azure role assignments** to provide "Owner" access on the subscriptions that will be used in [Mappings](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/project-fidalgo-concepts.md#mappings) and ensure the identity has [access to the KeyVault secrets](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/configure-managed-identity.md#assigning-key-vault-secret-access) containing the PAT token to access your repository.

### Using an existing managed identity

1. Switch to the **User Assigned** tab and select **+ Add** to attach an existing identity.

    ![Screenshot of user-assigned tab.](https://user-images.githubusercontent.com/68404454/124188735-477fde80-da85-11eb-8ae4-04cafb6ec264.png)

1. On the **Add user assigned managed identity** page,
    1. For **Subscription**, select the subscription in which the identity exists.
    1. For **User assigned managed identities**, select an existing identity from the drop-down.
    1. Select **Add**.

    ![Screenshot of user-assigned managed identity tab.](https://user-images.githubusercontent.com/68404454/124189314-24096380-da86-11eb-9949-0988c6a6c293.png)

1. After the identity is attached, ensure that the attached identity has "Owner" access on the subscriptions that will be used in [Mappings](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/project-fidalgo-concepts.md#mappings). Also, check "Reader" access to all subscriptions that a project lives in. Also ensure the identity has [access to the Key Vault secrets](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/configure-managed-identity.md#assigning-key-vault-secret-access) containing Personal Access Token(PAT) token to access the repository.

## Attach a [catalog](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/project-fidalgo-concepts.md#catalogs)

**Prerequisite** - Before attempting to attach a catalog, store the PAT as a "KeyVault Secret" and copy the "secret identifier". [Learn more about generating a PAT](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/configure-catalog.md#get-the-repository-information-and-credentials). Ensure that the identity attached to the DevCenter has `GET` access to the Secret.

1. Select **Catalogs** in the left menu and select **+ Add Repo**.

    ![Screenshot of catalog tab.](https://user-images.githubusercontent.com/68404454/124190442-e6a5d580-da87-11eb-81cf-206050c45df1.png)

1. In **Add New Catalog** page, provide the following details and select **Add**.
    1. For **Name**, provide a name for your catalog.
    1. For **Git clone Uri**, provide the URI to your GitHub or ADO repository.
    1. For  **Branch Name**, provide the repository branch that you would like to connect.
    1. For **Secret Identifier**, provide the secret identifier that contains your PAT for the repository.
    1. For **Folder Path**, provide the repo path in which the catalog items exist.

    ![Screenshot of add new catalog page.](https://user-images.githubusercontent.com/68404454/124191487-74ce8b80-da89-11eb-92b7-3c610090e25a.png)

1. Confirm that the catalog is successfully added by looking at the notifications.

## Create environment types

Environment types help you define the different types of environments your development teams can create and apply different settings for different environment types.

1. Select the **Environment Types** in the left menu and select **+ Add**.
1. On the **Add environment type** page, provide the following details and select **Add**.
    1. For **Name**, select a name for the environment type.
    1. For **Description**, you may choose to provide details about the environment type.
    1. For **Tags**, provide a name and value.

    ![Screenshot of add environment type page.](https://user-images.githubusercontent.com/68404454/124192773-700ad700-da8b-11eb-82e6-ca0a62892b99.png)

1. Confirm that the environment type is added and repeat Step 2 to create more environment types.

## Next steps

In this tutorial, you created a DevCenter and configured the DevCenter with identity, catalog, and environment types. To learn about how to create and configure a project, advance to the next tutorial:

* [Tutorial: Create and Configure Projects](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/tutorial-create-and-configure-projects.md)
