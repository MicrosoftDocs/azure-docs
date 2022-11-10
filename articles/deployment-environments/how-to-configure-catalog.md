---
title: Add and configure a catalog
titleSuffix: Azure Deployment Environments
description: Learn how to add and configure a catalog in your Azure Deployment Environments Preview dev center to provide deployment templates for your development teams.
ms.service: deployment-environments
ms.custom: ignite-2022
author: RoseHJM
ms.author: rosemalcolm
ms.date: 10/12/2022
ms.topic: how-to
---

# Add and configure a catalog

Learn how to add and configure a [catalog](./concept-environments-key-concepts.md#catalogs) in your Azure Deployment Environments Preview dev center. You can use a catalog to provide your development teams with a curated set of infrastructure as code (IaC) templates called [*catalog items*](./concept-environments-key-concepts.md#catalog-items).

For more information about catalog items, see [Add and configure a catalog item](./configure-catalog-item.md).

A catalog is a repository that's hosted in [GitHub](https://github.com) or [Azure DevOps](https://dev.azure.com/).

- To learn how to host a repository in GitHub, see [Get started with GitHub](https://docs.github.com/get-started).
- To learn how to host a Git repository in an Azure DevOps project, see [Azure Repos](https://azure.microsoft.com/services/devops/repos/).

We offer a [sample catalog](https://aka.ms/deployment-environments/SampleCatalog) that you can use as your repository. You also can use your own private repository, or you can fork and customize the catalog items in the sample catalog.

In this article, you learn how to:

> [!div class="checklist"]
>
> - Add a catalog
> - Update a catalog
> - Delete a catalog

> [!IMPORTANT]
> Azure Deployment Environments currently is in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise are not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Add a catalog

To add a catalog, you complete these tasks:

- Get the clone URL for your repository.
- Create a personal access token
- Store the personal access token as a key vault secret in Azure Key Vault.
- Add your repository as a catalog.

### Get the clone URL for your repository

You can choose from two types of repositories:

- A GitHub repository
- An Azure DevOps repository

#### Get the clone URL of a GitHub repository

1. Go to the home page of the GitHub repository that contains the template definitions.
1. [Get the clone URL](/azure/devops/repos/git/clone#get-the-clone-url-of-a-github-repo).
1. Copy and save the URL. You'll use it later.

#### Get the clone URL of an Azure DevOps repository

1. Go to the home page of your team collection (for example, `https://contoso-web-team.visualstudio.com`), and then select your project.
1. [Get the clone URL](/azure/devops/repos/git/clone#get-the-clone-url-of-an-azure-repos-git-repo).
1. Copy and save the URL. You'll use it later.

### Create a personal access token

Next, create a personal access token. Depending on the type of repository you use, create a personal access token either in GitHub or in Azure DevOps.

#### Create a personal access token in GitHub

1. Go to the home page of the GitHub repository that contains the template definitions.
1. In the upper-right corner of GitHub, select the profile image, and then select **Settings**.
1. In the left sidebar, select **Developer settings**.
1. In the left sidebar, select **Personal access tokens**.
1. Select **Generate new token**.
1. In **New personal access token**, in **Note**, enter a description for your token.
1. In the **Expiration** dropdown, select an expiration for your token.
1. For a private repository, under **Select scopes**, select the **repo** scope.
1. Select **Generate token**.
1. Save the generated token. You'll use the token later.

#### Create a personal access token in Azure DevOps

1. Go to the home page of your team collection (for example, `https://contoso-web-team.visualstudio.com`), and then select your project.
1. Create a [personal access token](/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate#create-a-pat).
1. Save the generated token. You'll use the token later.

### Store the personal access token as a key vault secret

To store the personal access token you generated as a [key vault secret](../key-vault/secrets/about-secrets.md) and copy the secret identifier:

1. Create a [key vault](../key-vault/general/quick-create-portal.md#create-a-vault).
1. Add the personal access token as a [secret to the key vault](../key-vault/secrets/quick-create-portal.md#add-a-secret-to-key-vault).
1. Open the secret and [copy the secret identifier](../key-vault/secrets/quick-create-portal.md#retrieve-a-secret-from-key-vault).

### Add your repository as a catalog

1. In the [Azure portal](https://portal.azure.com/), go to your dev center.
1. Ensure that the [identity](./how-to-configure-managed-identity.md) that's attached to the dev center has [access to the key vault secret](./how-to-configure-managed-identity.md#grant-the-managed-identity-access-to-the-key-vault-secret) where your personal access token is stored.
1. In the left menu under **Environment configuration**, select **Catalogs**, and then select **Add**.
1. In **Add catalog**, enter the following information, and then select **Add**:

    | Field | Value |
    | ----- | ----- |
    | **Name** | Enter a name for the catalog. |
    | **Git clone URI**  | Enter or paste the [clone URL](#get-the-clone-url-for-your-repository) for either your GitHub repository or your Azure DevOps repository.|
    | **Branch**  | Enter the repository branch to connect to.|
    | **Folder path**  | Enter the folder path relative to the clone URI that contains subfolders with your catalog items. This folder path should be the path to the folder that contains the subfolders with the catalog item manifests, and not the path to the folder with the catalog item manifest itself.|
    | **Secret identifier**| Enter the [secret identifier](#create-a-personal-access-token) that contains your personal access token for the repository.|

   :::image type="content" source="media/how-to-configure-catalog/catalog-item-add.png" alt-text="Screenshot that shows how to add a catalog to a dev center.":::

1. In **Catalogs** for the dev center, verify that your catalog appears. If the connection is successful, **Status** is **Connected**.

## Update a catalog

If you update the ARM template contents or definition in the attached repository, you can provide the latest set of catalog items to your development teams by syncing the catalog.

To sync an updated catalog:

1. In the left menu for your dev center, under **Environment configuration**, select **Catalogs**,
1. Select the specific catalog, and then select **Sync**. The service scans through the repository and makes the latest list of catalog items available to all the associated projects in the dev center.

## Delete a catalog

You can delete a catalog to remove it from the dev center. Any templates in a deleted catalog won't be available to development teams when they deploy new environments. Update the catalog item reference for any existing environments that were created by using the catalog items in the deleted catalog. If the reference isn't updated and the environment is redeployed, the deployment fails.

To delete a catalog:

1. In the left menu for your dev center, under **Environment configuration**, select **Catalogs**.
1. Select the specific catalog, and then select **Delete**.
1. In the **Delete catalog** dialog, select **Continue** to delete the catalog.

## Catalog sync errors

When you add or sync a catalog, you might encounter a sync error. A sync error indicates that some or all the catalog items have errors. Use the Azure CLI or the REST API to GET the catalog. The GET response shows you the type of errors:

- Ignored catalog items that were detected to be duplicates
- Invalid catalog items that failed due to schema, reference, or validation errors

### Resolve ignored catalog item errors

An ignored catalog item error occurs if you add two or more catalog items that have the same name. You can resolve this issue by renaming catalog items so that each catalog item has a unique name within the catalog.

### Resolve invalid catalog item errors

An invalid catalog item error might occur for a variety of reasons:

- **Manifest schema errors**. Ensure that your catalog item manifest matches the [required schema](./configure-catalog-item.md#add-a-catalog-item).

- **Validation errors**. Check the following items to resolve validation errors:

  - Ensure that the manifest's engine type is correctly configured as `ARM`.
  - Ensure that the catalog item name is between 3 and 63 characters.
  - Ensure that the catalog item name includes only characters that are valid for a URL: alphanumeric characters and the symbols `~` `!` `,` `.` `'` `;` `:` `=` `-` `_` `+` `)` `(` `*` `&` `$` `@`.
  
- **Reference errors**. Ensure that the template path that the manifest references is a valid relative path to a file in the repository.

## Next steps

- Learn how to [create and configure a project](./quickstart-create-and-configure-projects.md).
- Learn how to [create and configure a project environment type](how-to-configure-project-environment-types.md).
