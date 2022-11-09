---
title: Configure a catalog
titleSuffix: Azure Deployment Environments
description: Learn how to configure a catalog in your dev center to provide curated infra-as-code templates to your development teams to deploy self-serve environments.
ms.service: deployment-environments
ms.custom: ignite-2022
ms.author: rosemalcolm
author: RoseHJM
ms.date: 10/12/2022
ms.topic: how-to
---

# Configure a catalog to provide curated infra-as-code templates

Learn how to configure a dev center [catalog](./concept-environments-key-concepts.md#catalogs) to provide your development teams with a curated set of 'infra-as-code' templates called [catalog items](./concept-environments-key-concepts.md#catalog-items). To learn about configuring catalog items, see [How to configure a catalog item](./configure-catalog-item.md). 

The catalog could be a repository hosted in [GitHub](https://github.com) or in [Azure DevOps Services](https://dev.azure.com/).

* To learn how to host a repository in GitHub, see [Get started with GitHub](https://docs.github.com/get-started).
* To learn how to host a Git repository in an Azure DevOps Services project, see [Azure Repos](https://azure.microsoft.com/services/devops/repos/).

We offer an example [Sample Catalog](https://aka.ms/deployment-environments/SampleCatalog) that you can attach as-is, or you can fork and customize the catalog items. You can attach your private repo to use your own catalog items.

In this article, you'll learn how to:

* [Add a new catalog](#add-a-new-catalog)
* [Update a catalog](#update-a-catalog)
* [Delete a catalog](#delete-a-catalog)

## Add a new catalog

To add a new catalog, you'll need to:

 - Get the clone URL for your repository
 - Create a personal access token and store it as a Key Vault secret

### Get the clone URL for your repository

**Get the clone URL of your GitHub repo**

1. Go to the home page of the GitHub repository that contains the template definitions.
1. [Get the clone URL](/azure/devops/repos/git/clone#get-the-clone-url-of-a-github-repo).
1. Copy and save the URL. You'll use it later.

**Get the clone URL of your Azure DevOps Services Git repo**

1. Go to the home page of your team collection (for example, `https://contoso-web-team.visualstudio.com`), and then select your project.
1. [Get the clone URL](/azure/devops/repos/git/clone#get-the-clone-url-of-an-azure-repos-git-repo).
1. Copy and save the URL. You'll use it later.

### Create a personal access token and store it as a Key Vault secret

#### Create a personal access token in GitHub

1. Go to the home page of the GitHub repository that contains the template definitions.
1. In the upper-right corner of GitHub, select the profile image, and then select **Settings**.
1. In the left sidebar, select **<> Developer settings**.
1. In the left sidebar, select **Personal access tokens**.
1. Select **Generate new token**.
1. On the **New personal access token** page, add a description for your token in the **Note** field.
1. Select an expiration for your token from the **Expiration** dropdown.
1. For a private repository, select the **repo** scope under **Select scopes**.
1. Select **Generate Token**.
1. Save the generated token. You'll use the token later.

#### Create a personal access token in Azure DevOps Services

1. Go to the home page of your team collection (for example, `https://contoso-web-team.visualstudio.com`), and then select your project.
1. [Create a Personal access token](/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate#create-a-pat).
1. Save the generated token. You'll use the token later.

#### Store the personal access token as a Key Vault secret

To store the personal access token(PAT) that you generated as a [Key Vault secret](../key-vault/secrets/about-secrets.md) and copy the secret identifier:
1. [Create a vault](../key-vault/general/quick-create-portal.md#create-a-vault)
1. [Add](../key-vault/secrets/quick-create-portal.md#add-a-secret-to-key-vault) the personal access token (PAT) as a secret to the Key Vault.
1. [Open](../key-vault/secrets/quick-create-portal.md#retrieve-a-secret-from-key-vault) the secret and copy the secret identifier.

### Connect your repository as a catalog

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Go to your dev center.
1. Ensure that the [identity](./how-to-configure-managed-identity.md) attached to the dev center has [access to the Key Vault's secret](./how-to-configure-managed-identity.md#assign-the-managed-identity-access-to-the-key-vault-secret) where the PAT is stored.
1. Select **Catalogs** from the left pane.
1. Select **+ Add** from the command bar.
1. On the **Add catalog** form, enter the following details, and then select **Add**.

    | Field | Value |
    | ----- | ----- |
    | **Name** | Enter a name for the catalog. |
    | **Git clone URI**  | Enter the [Git HTTPS clone URL](#get-the-clone-url-for-your-repository) for GitHub or Azure DevOps Services repo, that you copied earlier.|
    | **Branch**  | Enter the repository branch you'd like to connect to.|
    | **Folder Path**  | Enter the folder path relative to the clone URI that contains sub-folders with your catalog items. This folder path should be the path to the folder containing the sub-folders with the catalog item manifests, and not the path to the folder with the catalog item manifest itself.|
    | **Secret Identifier**| Enter the [secret identifier](#create-a-personal-access-token-and-store-it-as-a-key-vault-secret) which contains your Personal Access Token(PAT) for the repository.|

1. Verify that your catalog is listed on the **Catalogs** page. If the connection is successful, the **Status** will show as **Connected**.

## Update a catalog

If you update the ARM template contents or definition in the attached repository, you can provide the latest set of catalog items to your development teams by syncing the catalog.

To sync to the updated catalog:

1. Select **Catalogs** from the left pane.
1. Select the specific catalog and select **Sync**. The service scans through the repository and makes the latest list of catalog items available to all the associated projects in the dev center.

## Delete a catalog

You can delete a catalog to remove it from the dev center. Any templates contained in a deleted catalog will not be available when deploying new environments. You'll need to update the catalog item reference for any existing environments created using the catalog items in the deleted catalog. If the reference is not updated and the environment is redeployed, it'll result in deployment failure. 

To delete a catalog:

1. Select **Catalogs** from the left pane.
1. Select the specific catalog and select **Delete**.
1. Confirm to delete the catalog.

## Catalog sync errors

When adding or syncing a catalog, you may encounter a sync error. This indicates that some or all of the catalog items were found to have errors. You can use CLI or REST API to *GET* the catalog, the response to which will show you the list of invalid catalog items which failed due to schema, reference, or validation errors and ignored catalog items which were detected to be duplicates.

### Handling ignored catalog items

Ignored catalog items are caused by adding two or more catalog items with the same name. You can resolve this issue by renaming catalog items so that each item has a unique name within the catalog.

### Handling invalid catalog items

Invalid catalog items can be caused due to a variety of reasons. Potential issues are:

  - **Manifest schema errors**
    - Ensure that your catalog item manifest matches the required schema as described [here](./configure-catalog-item.md#add-a-new-catalog-item).

  - **Validation errors**
    - Ensure that the manifest's engine type is correctly configured as "ARM".
    - Ensure that the catalog item name is between 3 and 63 characters.
    - Ensure that the catalog item name includes only URL-valid characters. This includes alphanumeric characters as well as these symbols: *~!,.';:=-\_+)(\*&$@*
  
  - **Reference errors**
    - Ensure that the template path referenced by the manifest is a valid relative path to a file within the repository.

## Next steps

* [Create and Configure Projects](./quickstart-create-and-configure-projects.md).
