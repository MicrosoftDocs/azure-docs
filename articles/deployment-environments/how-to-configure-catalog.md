---
title: Add and configure a catalog
titleSuffix: Azure Deployment Environments
description: Learn how to add a catalog in your dev center to provide environment templates for your developers. Catalogs are repositories stored in GitHub or Azure DevOps.
ms.service: deployment-environments
ms.custom: ignite-2022, build-2023
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/25/2023
ms.topic: how-to
---

# Add and configure a catalog from GitHub or Azure DevOps

Learn how to add and configure a [catalog](./concept-environments-key-concepts.md#catalogs) in your Azure Deployment Environments dev center. You can use a catalog to provide your development teams with a curated set of infrastructure as code (IaC) templates called [environment definitions](./concept-environments-key-concepts.md#environment-definitions). Your catalog is encrypted; Azure Deployment Environments supports encryption at rest with platform-managed encryption keys, which are managed by Microsoft for Azure Services.

For more information about environment definitions, see [Add and configure an environment definition](./configure-environment-definition.md).

A catalog is a repository that's hosted in [GitHub](https://github.com) or [Azure DevOps](https://dev.azure.com/).

- To learn how to host a repository in GitHub, see [Get started with GitHub](https://docs.github.com/get-started).
- To learn how to host a Git repository in an Azure DevOps project, see [Azure Repos](https://azure.microsoft.com/services/devops/repos/).

We offer a [sample catalog](https://aka.ms/deployment-environments/SampleCatalog) that you can use as your repository. You also can use your own private repository, or you can fork and customize the environment definitions in the sample catalog.

In this article, you learn how to:

> [!div class="checklist"]
>
> - Add a catalog.
> - Update a catalog.
> - Delete a catalog.

## Add a catalog

To add a catalog, you complete these tasks:

- Get the clone URL for your repository.
- Create a personal access token.
- Store the personal access token as a key vault secret in Azure Key Vault.
- Add your repository as a catalog.

### Get the clone URL for your repository

You can choose from two types of repositories:

- A GitHub repository
- An Azure DevOps repository

#### Get the clone URL of a GitHub repository

1. Go to the home page of the GitHub repository that contains the template definitions.
1. [Get the GitHub repo clone URL](/azure/devops/repos/git/clone#get-the-clone-url-of-a-github-repo).
1. Copy and save the URL. You use it later.

#### Get the clone URL of an Azure DevOps repository

1. Go to the home page of your team collection (for example, `https://contoso-web-team.visualstudio.com`), and then select your project.
1. [Get the Git repo clone URL](/azure/devops/repos/git/clone#get-the-clone-url-of-an-azure-repos-git-repo).
1. Copy and save the URL. You use it later.

### Create a personal access token

Next, create a personal access token. Depending on the type of repository you use, create a personal access token either in GitHub or in Azure DevOps.

#### Create a personal access token in GitHub

1. Go to the home page of the GitHub repository that contains the template definitions.
1. In the upper-right corner of GitHub, select the profile image, and then select **Settings**.
1. On the left sidebar, select **Developer settings** > **Personal access tokens** > **Fine-grained tokens**.
1. Select **Generate new token**.
1. On the New fine-grained personal access token page, provide the following information:

    |Name      |Value      |
    |----------|-----------|
    |**Token name**|Enter a descriptive name for the token.|
    |**Expiration**|Select the token expiration period in days.|
    |**Description**|Enter a description for the token.|
    |**Repository access**|Select **Public Repositories (read-only)**.|
    
    Leave the other options at their defaults.
1. Select **Generate token**.
1. Save the generated token. You use the token later.

#### Create a personal access token in Azure DevOps

1. Go to the home page of your team collection (for example, `https://contoso-web-team.visualstudio.com`) and select your project.
1. Create a [personal access token](/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate#create-a-pat).
1. Save the generated token. You use the token later.

### Store the personal access token as a key vault secret

Store the personal access token that you generated as a [key vault secret](../key-vault/secrets/about-secrets.md) and copy the secret identifier:

#### Create a Key Vault
You need an Azure Key Vault to store the GitHub personal access token (PAT) that is used to grant Azure access to your GitHub repository. Key Vaults can control access with either access policies or role-based access control (RBAC). If you have an existing key vault, you can use it, but you should check whether it uses access policies or RBAC assignments to control access. For help with configuring an access policy for a key vault, see [Assign a Key Vault access policy](/azure/key-vault/general/assign-access-policy?branch=main&tabs=azure-portal). 

Use the following steps to create an RBAC key vault:

1.	Sign in to the [Azure portal](https://portal.azure.com).
1.	In the Search box, enter *Key Vault*.
1.	From the results list, select **Key Vault**.
1.	On the Key Vault page, select **Create**.
1.	On the Create key vault tab, provide the following information:

    |Name      |Value      |
    |----------|-----------|
    |**Name**|Enter a name for the key vault.|
    |**Subscription**|Select the subscription in which you want to create the key vault.|
    |**Resource group**|Either use an existing resource group or select **Create new** and enter a name for the resource group.|
    |**Location**|Select the location or region where you want to create the key vault.|
    
    Leave the other options at their defaults.

1. On the Access policy tab, select **Azure role-based access control**, and then select **Review + create**.

1. On the Review + create tab, select **Create**.

#### Store the personal access token in the key vault

1. In the Key Vault, on the left menu, select **Secrets**.
1.	On the Secrets page, select **Generate/Import**.
1.	On the Create a secret page:
    - In the **Name** box, enter a descriptive name for your secret.
    - In the **Secret value** box, paste the GitHub secret.
    - Select **Create**.


#### Get the secret identifier

Get the path to the secret you created in the key vault. 

1. In the Azure portal, navigate to your key vault.
1. On the key vault page, from the left menu, select **Secrets**.
1. On the Secrets page, select the secret you created earlier.
1. On the versions page, select the **CURRENT VERSION**.
1. On the current version page, for the **Secret identifier**, select copy.

### Add your repository as a catalog

1. In the [Azure portal](https://portal.azure.com/), go to your dev center.
1. Ensure that the [identity](./how-to-configure-managed-identity.md) that's attached to the dev center has [access to the key vault secret](./how-to-configure-managed-identity.md#grant-the-managed-identity-access-to-the-key-vault-secret) where your personal access token is stored.
1. In the left menu under **Environment configuration**, select **Catalogs**, and then select **Add**.
1. In **Add catalog**, enter the following information, and then select **Add**:

    | Field | Value |
    | ----- | ----- |
    | **Name** | Enter a name for the catalog. |
    | **Git clone URI**  | Enter or paste the [clone URL](#get-the-clone-url-for-your-repository) for either your GitHub repository or your Azure DevOps repository.<br />*Sample catalog example:* `https://github.com/Azure/deployment-environments.git` |
    | **Branch**  | Enter the repository branch to connect to.<br />*Sample catalog example:* `main`|
    | **Folder path**  | Enter the folder path relative to the clone URI that contains subfolders that hold your environment definitions. <br /> The folder path is for the folder with subfolders containing environment definition manifests, not for the folder with the environment definition manifest itself. The following image shows the sample catalog folder structure.<br />*Sample catalog example:* `/Environments`<br /> :::image type="content" source="media/how-to-configure-catalog/github-folders.png" alt-text="Screenshot showing Environments sample folder in GitHub."::: The folder path can begin with or without a forward slash (`/`).|
    | **Secret identifier**| Enter the [secret identifier](#create-a-personal-access-token) that contains your personal access token for the repository.<br /> When you copy a secret identifier, the connection string includes a version identifier at the end, like in this example: `https://contoso-kv.vault.azure.net/secrets/GitHub-repo-pat/9376b432b72441a1b9e795695708ea5a`.<br />Removing the version identifier ensures that Deployment Environments fetches the latest version of the secret from the key vault. If your personal access token expires, only the key vault needs to be updated. <br />*Example secret identifier:* `https://contoso-kv.vault.azure.net/secrets/GitHub-repo-pat`|

   :::image type="content" source="media/how-to-configure-catalog/add-catalog-form-inline.png" alt-text="Screenshot that shows how to add a catalog to a dev center." lightbox="media/how-to-configure-catalog/add-catalog-form-expanded.png":::

1. In **Catalogs** for the dev center, verify that your catalog appears. If the connection is successful, **Status** is **Connected**.

## Update a catalog

If you update the Azure Resource Manager template (ARM template) contents or definition in the attached repository, you can provide the latest set of environment definitions to your development teams by syncing the catalog.

To sync an updated catalog:

1. On the left menu for your dev center, under **Environment configuration**, select **Catalogs**,
1. Select the specific catalog, and then select **Sync**. The service scans through the repository and makes the latest list of environment definitions available to all the associated projects in the dev center.

## Delete a catalog

You can delete a catalog to remove it from the dev center. Templates in a deleted catalog aren't available to development teams when they deploy new environments. Update the environment definition reference for any existing environments that were created by using the environment definitions in the deleted catalog. If the reference isn't updated and the environment is redeployed, the deployment fails.

To delete a catalog:

1. On the left menu for your dev center, under **Environment configuration**, select **Catalogs**.
1. Select the specific catalog, and then select **Delete**.
1. In the **Delete catalog** dialog, select **Continue** to delete the catalog.

## Catalog sync errors

When you add or sync a catalog, you might encounter a sync error. A sync error indicates that some or all the environment definitions have errors. Use the Azure CLI or the REST API to GET the catalog. The GET response shows you the type of errors:

- Ignored environment definitions that were detected to be duplicates.
- Invalid environment definitions that failed due to schema, reference, or validation errors.

### Resolve ignored environment definition errors

An ignored environment definition error occurs if you add two or more environment definitions that have the same name. You can resolve this issue by renaming environment definitions so that each environment definition has a unique name within the catalog.

### Resolve invalid environment definition errors

An invalid environment definition error might occur for various reasons:

- **Manifest schema errors**. Ensure that your environment definition manifest matches the [required schema](./configure-environment-definition.md#add-an-environment-definition).

- **Validation errors**. Check the following items to resolve validation errors:

  - Ensure that the manifest's engine type is correctly configured as `ARM`.
  - Ensure that the environment definition name is between 3 and 63 characters.
  - Ensure that the environment definition name includes only characters that are valid for a URL, which are alphanumeric characters and these symbols: `~` `!` `,` `.` `'` `;` `:` `=` `-` `_` `+` `(` `)` `*` `&` `$` `@`
  
- **Reference errors**. Ensure that the template path that the manifest references is a valid relative path to a file in the repository.

## Next steps

- Learn how to [create and configure a project](./quickstart-create-and-configure-projects.md).
- Learn how to [create and configure a project environment type](how-to-configure-project-environment-types.md).
