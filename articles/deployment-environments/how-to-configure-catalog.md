---
title: Add a catalog from a GitHub or Azure DevOps repository
titleSuffix: Azure Deployment Environments
description: Learn how to add a catalog in your Azure Deployment Environments dev center or project to provide environment definitions for your developers.
ms.service: deployment-environments
ms.custom: build-2023, build-2024
author: RoseHJM
ms.author: rosemalcolm
ms.date: 05/10/2024
ms.topic: how-to
#customer intent: As a platform engineer, I want to learn how to add a catalog in my Azure Deployment Environments dev center or project so that I can provide environment definitions for my developers.
---

# Add and configure a catalog from GitHub or Azure Repos

This article explains how to add and configure a [catalog](./concept-environments-key-concepts.md#catalogs) for your Azure Deployment Environments dev center or project. 

Catalogs help you provide a set of curated infrastructure-as-code(IaC) templates, known as environment definitions for your development teams to create environments. You can attach your own source control repository from GitHub or Azure DevOps as a catalog and specify the folder with your environment definitions. Deployment Environments scans the folder for environment definitions and makes them available for dev teams to create environments. 

To further secure your templates, the catalog is encrypted; Azure Deployment Environments supports encryption at rest with platform-managed encryption keys, which Microsoft for Azure Services manages.

- To learn how to host a repository in GitHub, see [Get started with GitHub](https://docs.github.com/get-started).
- To learn how to host a Git repository in an Azure Repos project, see [Azure Repos](https://azure.microsoft.com/products/devops/repos/).

Microsoft offers a [*quick start* catalog](https://github.com/microsoft/devcenter-catalog) that you can add to the dev center or project, and a [sample catalog](https://aka.ms/deployment-environments/SampleCatalog) that you can use as your repository. You also can use your own private repository, or you can fork and customize the environment definitions in the sample catalog.

In this article, you learn how to:
1. [Configure project-level catalogs](#configure-project-level-catalogs)
1. [Configure a managed identity](#configure-a-managed-identity)
1. [Add a catalog from Azure Repos or GitHub](#add-a-catalog)
1. [Update a catalog](#update-a-catalog)
1. [Delete a catalog](#delete-a-catalog)
1. [Troubleshoot catalog sync errors](#troubleshoot-catalog-sync-errors)

## Configure project-level catalogs

Attaching catalogs at the project level enables platform engineers to provide curated environment definitions that are specific to the development teams. Additionally, it empowers dev team leads assigned as Project Admins to manage the environment definitions made available to their teams.
 
Platform engineers have full control over the use of catalogs at the project level. The use of project level catalogs must be enabled at the dev center level before a catalog can be added to a project. Platform engineers can also configure which types of catalogs items, such as environment definitions, can be consumed at the project level.
 
By default, use of catalogs at the project level is disabled and none of the catalog item types are enabled. Environment definitions from a project-level catalog are synced and usable under two conditions. First, you must enable project-based catalogs at the corresponding dev center level. Second, you must enable the use of environment definitions for the project.

### Add a catalog to a project

You must enable project-level catalogs at the dev center level before you can add a catalog to a project. You should also enable the use of environment definitions at the project level.

To enable the use of project-level catalogs at the dev center level:

1. In the [Azure portal](https://portal.azure.com), navigate to your dev center.
1. In the left menu, under **Settings**, select **Configuration**.
 
    :::image type="content" source="media/how-to-configure-catalog/dev-center-overview.png" alt-text="Screenshot showing the Overview page for a dev center with Configuration highlighted." lightbox="media/how-to-configure-catalog/dev-center-overview.png"::: 
 
1. In the **Project level catalogs** pane, select **Enable catalogs per project**, and then select **Apply**.

    :::image type="content" source="media/how-to-configure-catalog/dev-center-project-catalog-selected.png" alt-text="Screenshot showing the Project level catalogs pane, with Enable catalogs per project highlighted." lightbox="media/how-to-configure-catalog/dev-center-project-catalog-selected.png":::

To enable the use of environment definitions in the project:

1. In the [Azure portal](https://portal.azure.com), navigate to your project.
1. In the left menu, under **Settings**, select **Catalogs**.
 
    :::image type="content" source="media/how-to-configure-catalog/project-overview.png" alt-text="Screenshot showing the Overview page for a project with Catalogs highlighted." lightbox="media/how-to-configure-catalog/project-overview.png":::
  
1. On the **Catalogs** page, select **Catalog item permissions**.
 
    :::image type="content" source="media/how-to-configure-catalog/project-catalog-item-permissions.png" alt-text="Screenshot showing the Catalogs pane with Catalog item permissions highlighted." lightbox="media/how-to-configure-catalog/project-catalog-item-permissions.png":::
 
1. In the **Catalog item settings** pane, select **Azure deployment environment definitions** to enable the use of environment definitions at the project level.
 
    :::image type="content" source="media/how-to-configure-catalog/project-enable-environment-definitions.png" alt-text="Screenshot showing the Catalog item settings pane with Azure deployment environment definitions selected." lightbox="media/how-to-configure-catalog/project-enable-environment-definitions.png":::
 
Now, you can add a catalog to the project. 

For catalogs that use a managed identity or Personal Access Token (PAT) for authentication, you must assign a managed identity for the project. For catalogs that use a PAT, you must store the PAT in a key vault and grant the managed identity access to the key vault secret.

## Configure a managed identity

Before you can attach a catalog to a dev center or project, you must configure a [managed identity](concept-environments-key-concepts.md#identities), also called a Managed Service Identity (MSI). You can attach either a system-assigned managed identity (system-assigned MSI) or a user-assigned managed identity (user-assigned MSI). You then assign roles to the managed identity to allow the dev center or project to create environment types in your subscription and read the Azure Repos project that contains the catalog repo.

If your dev center or project doesn't have an MSI attached, follow the steps in [Configure a managed identity](how-to-configure-managed-identity.md) to create one and to assign roles for the managed identity.

To learn more about managed identities, see [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview)

## Add a catalog

You can add a catalog from an Azure Repos repository or a GitHub repository. You can choose to authenticate by assigning permissions to an MSI or by using a PAT, which you store in a key vault.

Select the tab for the type of repository and authentication you want to use.

## [Azure Repos repo with MSI](#tab/DevOpsRepoMSI/)

To add a catalog, complete the following tasks:

- Assign permissions in Azure Repos for the managed identity.
- Add your repository as a catalog.

### Assign permissions in Azure Repos for the managed identity

You must give the managed identity permissions to the repository in Azure Repos.  

1. Sign in to your [Azure DevOps organization](https://dev.azure.com).

    > [!NOTE]
    > Your Azure DevOps organization must be in the same directory as the Azure subscription that contains your dev center or project.

1. Select **Organization settings**.

   :::image type="content" source="media/how-to-configure-catalog/devops-organization-settings.png" alt-text="Screenshot showing the Azure DevOps organization page, with Organization Settings highlighted." lightbox="media/how-to-configure-catalog/devops-organization-settings.png"::: 

1. On the **Overview** page, select **Users**.

   :::image type="content" source="media/how-to-configure-catalog/devops-organization-overview.png" alt-text="Screenshot showing the Organization overview page, with Users highlighted." lightbox="media/how-to-configure-catalog/devops-organization-overview.png":::

1. On the **Users** page, select **Add users**.

   :::image type="content" source="media/how-to-configure-catalog/devops-add-user.png" alt-text="Screenshot showing the Users page, with Add user highlighted." lightbox="media/how-to-configure-catalog/devops-add-user.png":::

1. Complete **Add new users** by entering or selecting the following information, and then select **Add**:

    |Name     |Value     |
    |---------|----------|
    |**Users or Service Principals**|Enter the name of your dev center or project. <br> When you use a system-assigned MSI, specify the name of the dev center or project, not the object ID of the managed account. When you use a user-assigned MSI, use the name of the managed account. |
    |**Access level**|Select **Basic**.|
    |**Add to projects**|Select the project that contains your repository.|
    |**Azure DevOps Groups**|Select **Project Readers**.|
    |**Send email invites (to Users only)**|Clear the checkbox.|

   :::image type="content" source="media/how-to-configure-catalog/devops-add-user-blade.png" alt-text="Screenshot showing Add users, with example entries and Add highlighted." lightbox="media/how-to-configure-catalog/devops-add-user-blade.png":::

### Add your repository as a catalog

Azure Deployment Environments supports attaching Azure Repos repositories and GitHub repositories. You can store a set of curated IaC templates in a repository. Attaching the repository to a dev center or project as a catalog gives your development teams access to the templates and enables them to quickly create consistent environments.

The following steps let you attach an Azure Repos repository.

1. In the [Azure portal](https://portal.azure.com), navigate to your dev center or project.

1. In the left menu under **Environment configuration**, select **Catalogs**, and then select **Add**.

    :::image type="content" source="media/how-to-configure-catalog/catalogs-page.png" alt-text="Screenshot that shows the Catalogs pane." lightbox="media/how-to-configure-catalog/catalogs-page.png":::

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

    :::image type="content" source="media/how-to-configure-catalog/add-catalog-to-dev-center.png" alt-text="Screenshot showing the Add catalog pane with examples entries and Add highlighted." lightbox="media/how-to-configure-catalog/add-catalog-to-dev-center.png":::

1. In **Catalogs** for the dev center or project, verify that your catalog appears. When the connection is successful, the **Status** reads **Sync successful**. Connecting to a catalog can take a few minutes the first time.


## [Azure Repos repo with PAT](#tab/DevOpsRepoPAT/)

To add a catalog, complete the following tasks:

- Get the clone URL for your Azure Repos repository.
- Create a personal access token (PAT).
- Store the PAT as a key vault secret in Azure Key Vault.
- Add your repository as a catalog.

### Get the clone URL for your Azure Repos repository

1. Go to the home page of your team collection (for example, `https://contoso-web-team.visualstudio.com`), and then select your project.

1. [Get the clone URL of your Azure Repos Git repo](/azure/devops/repos/git/clone#get-the-clone-url-of-an-azure-repos-git-repo).

1. Copy and save the URL.
 
### Create a personal access token in Azure Repos

1. Go to the home page of your team collection (for example, `https://contoso-web-team.visualstudio.com`) and select your project.

1. Create a [PAT](/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate#create-a-pat).

1. Copy and save the generated token to use later.

### Create a Key Vault

You need an Azure Key Vault to store the PAT used to grant Azure access to your repository. Key vaults can control access with either access policies or role-based access control (RBAC). If you have an existing key vault, you can use it, but you should check whether it uses access policies or RBAC assignments to control access. For help with configuring an access policy for a key vault, see [Assign a Key Vault access policy](/azure/key-vault/general/assign-access-policy?branch=main&tabs=azure-portal). 

Use the following steps to create an RBAC key vault:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the Search box, enter *Key Vault*.

1. From the results list, select **Key Vault**.

1. On the Key Vault page, select **Create**.

1. On the **Create key vault** tab, provide the following information:

    |Name      |Value      |
    |----------|-----------|
    |**Name**|Enter a name for the key vault.|
    |**Subscription**|Select the subscription in which you want to create the key vault.|
    |**Resource group**|Either use an existing resource group or select **Create new** and enter a name for the resource group.|
    |**Location**|Select the location or region where you want to create the key vault.|

    Leave the other options at their defaults.

1. On the **Access policy** tab, select **Azure role-based access control**, and then select **Review + create**.

1. On the **Review + create** tab, select **Create**.

If your organization's policies require you to keep your Key Vault private from the internet, you can set your Key Vault to allow trusted Microsoft services to bypass your firewall rule. 

:::image type="content" source="media/how-to-configure-catalog/key-vault-configure-firewall.png" alt-text="Screenshot showing Azure firewall configuration with Allow trusted Microsoft services to bypass this firewall selected." lightbox="media/how-to-configure-catalog/key-vault-configure-firewall.png":::

To learn how to allow trusted Microsoft services to bypass the firewall, see [Configure Azure Key Vault networking settings](../key-vault/general/how-to-azure-key-vault-network-security.md).

### Store the personal access token in the key vault

1. In the Key Vault, on the left menu, select **Secrets**.

1. On the **Secrets** page, select **Generate/Import**.

1. On the **Create a secret** page:
    - In the **Name** box, enter a descriptive name for your secret.
    - In the **Secret value** box, paste the PAT that you copied earlier.
    - Select **Create**.

### Get the secret identifier

Get the path to the secret you created in the key vault. 

1. In the Azure portal, navigate to your key vault.

1. On the key vault page, from the left menu, select **Secrets**.

1. On the **Secrets** page, select the secret you created earlier.

1. On the versions page, select the **CURRENT VERSION**.

1. On the current version page, for the **Secret identifier**, select copy.

### Add your repository as a catalog

1. In the [Azure portal](https://portal.azure.com), go to your dev center or project.

1. Ensure that the [identity](./how-to-configure-managed-identity.md) attached to the dev center or project has [access to the key vault secret](./how-to-configure-managed-identity.md#grant-the-managed-identity-access-to-the-key-vault-secret) where your personal access token is stored.

1. In the left menu under **Environment configuration**, select **Catalogs**, and then select **Add**.

1. In **Add catalog**, enter the following information, and then select **Add**:

    | Field | Value |
    | ----- | ----- |
    | **Name** | Enter a name for the catalog. |
    | **Catalog location**  | Select **Azure DevOps**. |
    | **Authentication type** | Select **Personal Access Token**.|
    | **Organization**  | Select the organization that hosts the catalog repo. |
    | **Project**  | Select the project that stores the catalog repo.|
    | **Rep**  | Select the repo that stores the catalog.|
    | **Folder path** | Select the folder that holds your IaC templates.|
    | **Secret identifier**| Enter the secret identifier that contains your PAT for the repository.<br> When you copy a secret identifier, the connection string includes a version identifier at the end, like in this example: `https://contoso-kv.vault.azure.net/secrets/GitHub-repo-pat/9376b432b72441a1b9e795695708ea5a`.<br>Removing the version identifier ensures that Deployment Environments fetches the latest version of the secret from the key vault. If your PAT expires, only the key vault needs to be updated. <br>*Example secret identifier:* `https://contoso-kv.vault.azure.net/secrets/GitHub-repo-pat`|

    :::image type="content" source="media/how-to-configure-catalog/add-devops-catalog-pane.png" alt-text="Screenshot that shows how to add a catalog to a dev center." lightbox="media/how-to-configure-catalog/add-devops-catalog-pane.png":::

1. In **Catalogs**, verify that your catalog appears. If the connection is successful, the **Status** is **Connected**.

## [GitHub repo DevCenter App](#tab/GitHubRepoApp/)

To add a catalog, complete the following tasks:

1. Install and configure the Microsoft Dev Center app
1. Assign permissions in GitHub for the repos.
1. Add your repository as a catalog.
 
### Install Microsoft Dev Center app

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your dev center or project.
 
1. In the left menu under **Environment configuration**, select **Catalogs**, and then select **Add**.
 
1. In the **Add catalog** pane, enter, or select the following:
 
   | Field | Value |
   |-----|-----| 
   | **Name** | Enter a name for the catalog. |
   | **Catalog source** | Select **GitHub**. |
   | **Authentication type** | Select **GitHub app**.|

1. To install the Microsoft Dev Center app, select **configure your repositories**.
 
   :::image type="content" source="media/how-to-configure-catalog/add-catalog-configure-repositories.png" alt-text="Screenshot of Azure portal Add catalog with configure your repositories link highlighted." lightbox="media/how-to-configure-catalog/add-catalog-configure-repositories.png":::
 
1. If you're prompted to authenticate to GitHub, authenticate.
 
1. On the **Microsoft DevCenter** page, select **Configure**.
 
   :::image type="content" source="media/how-to-configure-catalog/configure-microsoft-dev-center.png" alt-text="Screenshot of the Microsoft Dev Center app page, with Configure highlighted." lightbox="media/how-to-configure-catalog/configure-microsoft-dev-center.png":::

1. Select the GitHub organization that contains the repository you want to add as a catalog. You must be an owner of the organization to install this app.
 
   :::image type="content" source="media/how-to-configure-catalog/install-organization.png" alt-text="Screenshot of the Install Microsoft DevCenter page, with a GitHub organization highlighted." lightbox="media/how-to-configure-catalog/install-organization.png":::
 
1. On the Install Microsoft DevCenter page, select **Only select repositories**, select the repository you want to add as a catalog, and then select **Install**. 

   :::image type="content" source="media/how-to-configure-catalog/select-one-repository.png" alt-text="Screenshot of the Install Microsoft DevCenter page, with one repository selected and highlighted." lightbox="media/how-to-configure-catalog/select-one-repository.png":::

   You can select multiple repositories to add as catalogs. You must add each repository as a separate catalog, as described in [Add your repository as a catalog](#add-your-repository-as-a-catalog).
 
1. On the **Microsoft DevCenter by Microsoft would like permission to:** page, review the permissions required, and then select **Authorize Microsoft Dev Center**.

   :::image type="content" source="media/how-to-configure-catalog/authorize-microsoft-dev-center.png" alt-text="Screenshot of the Microsoft DevCenter by Microsoft would like permission to page, with authorize highlighted." lightbox="media/how-to-configure-catalog/authorize-microsoft-dev-center.png":::


### Add your repository as a catalog

1. Switch back to the Azure portal. 
 
1. In **Add catalog**, enter the following information, and then select **Add**:

    | Field | Value |
    | ----- | ----- |
    | **Repo**  | Select the repository that you want to add as a catalog. |
    | **Branch**  | Select the branch. |
    | **Folder path**  | Select the folder that contains subfolders that hold your environment definitions. |   

   :::image type="content" source="media/how-to-configure-catalog/add-catalog-repo-branch-folder.png" alt-text="Screenshot of Azure portal add catalog, with repo, branch, folder, and add selected." lightbox="media/how-to-configure-catalog/add-catalog-repo-branch-folder.png":::

1. In **Catalogs**, verify that your catalog appears. When the connection is successful, the **Status** reads **Sync successful**.

   :::image type="content" source="media/how-to-configure-catalog/catalog-connection-successful.png" alt-text="Screenshot of Azure portal Catalogs page with a connected status." lightbox="media/how-to-configure-catalog/catalog-connection-successful.png":::

## [GitHub repo with PAT](#tab/GitHubRepoPAT/)

To add a catalog, complete the following tasks:

- Get the clone URL of your GitHub repository.
- Create a personal access token (PAT) in GitHub.
- Store the PAT as a key vault secret in Azure Key Vault.
- Add your repository as a catalog.

### Get the clone URL of your GitHub repository

1. Go to the home page of the GitHub repository that contains the template definitions.

1. [Get the GitHub repository clone URL](/azure/devops/repos/git/clone#get-the-clone-url-of-a-github-repo).

1. Copy and save the URL.

### Create a personal access token in GitHub

Azure Deployment Environments supports authenticating to GitHub repositories by using either classic tokens or fine-grained tokens. In this example, you create a fine-grained token. 

1. Go to the home page of the GitHub repository that contains the template definitions.

1. In the upper-right corner of GitHub, select the profile image, and then select **Settings**.

1. On the left sidebar, select **Developer settings** > **Personal access tokens** > **Fine-grained tokens**.

1. Select **Generate new token**.

1. On the **New fine-grained personal access token** page, provide the following information:

    |Name      |Value      |
    |----------|-----------|
    |**Token name**|Enter a descriptive name for the token.|
    |**Expiration**|Select the token expiration period in days.|
    |**Description**|Enter a description for the token.|
    |**Resource owner**|Select the owner of the repository.|
    |**Repository access**|Select **Only select repositories**.|
    |**Select repositories**|Select the repository that contains the environment definitions.|
    |**Repository permissions**|Expand **Repository permissions**, and for **Contents**, from the **Access** list, select **Code read**.|

    :::image type="content" source="media/how-to-configure-catalog/github-repository-permissions.png" alt-text="Screenshot of the GitHub New fine-grained personal access token page, showing the Repository permissions with Contents highlighted." lightbox="media/how-to-configure-catalog/github-repository-permissions.png":::

1. Select **Generate token**.

1. Copy and save the generated token to use later.

> [!IMPORTANT]
> When working with a private repository stored within a GitHub organization, you must ensure that the GitHub PAT is configured to give access to the correct organization and the repositories within it. 
> - Classic tokens within the organization must be SSO authorized to the specific organization after they are created.
> - Fine-grained tokens must have the owner of the token set as the organization itself to be authorized.
>
> Incorrectly configured PATs can result in a *Repository not found* error.

### Create a Key Vault

You need an Azure Key Vault to store the PAT that is used to grant Azure access to your repository. Key vaults can control access with either access policies or role-based access control (RBAC). If you have an existing key vault, you can use it, but you should check whether it uses access policies or RBAC assignments to control access. For help with configuring an access policy for a key vault, see [Assign a key vault access policy](/azure/key-vault/general/assign-access-policy?branch=main&tabs=azure-portal). 

Use the following steps to create an RBAC key vault:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the Search box, enter *key vault*.

1. From the results list, select **Key Vault**.

1. On the Key Vault page, select **Create**.

1. On the **Create key vault** tab, provide the following information:

    |Name      |Value      |
    |----------|-----------|
    |**Name**|Enter a name for the key vault.|
    |**Subscription**|Select the subscription in which you want to create the key vault.|
    |**Resource group**|Either use an existing resource group or select **Create new** and enter a name for the resource group.|
    |**Location**|Select the location or region where you want to create the key vault.|

    Leave the other options at their defaults.

1. On the **Access policy** tab, select **Azure role-based access control**, and then select **Review + create**.

1. On the **Review + create** tab, select **Create**.
 
If your organization's policies require you to keep your Key Vault private from the internet, you can set your Key Vault to allow trusted Microsoft services to bypass your firewall rule. 

:::image type="content" source="media/how-to-configure-catalog/key-vault-configure-firewall.png" alt-text="Screenshot showing Azure firewall configuration with Allow trusted Microsoft services to bypass this firewall selected." lightbox="media/how-to-configure-catalog/key-vault-configure-firewall.png":::

To learn how to allow trusted Microsoft services to bypass the firewall, see [Configure Azure Key Vault networking settings](../key-vault/general/how-to-azure-key-vault-network-security.md).

### Store the personal access token in the key vault

1. In the Key Vault, on the left menu, select **Secrets**.

1. On the **Secrets** page, select **Generate/Import**.

1. On the **Create a secret** page:
    - In the **Name** box, enter a descriptive name for your secret.
    - In the **Secret value** box, paste your PAT.
    - Select **Create**.

### Get the secret identifier

Get the path to the secret you created in the key vault. 

1. In the Azure portal, navigate to your key vault.

1. On the key vault page, from the left menu, select **Secrets**.

1. On the **Secrets** page, select the secret you created earlier.

1. On the versions page, select the **CURRENT VERSION**.

1. On the current version page, for the **Secret identifier**, select copy.

### Add your repository as a catalog

1. In the Azure portal, go to your dev center or project.

1. Ensure that the [managed identity](./how-to-configure-managed-identity.md) attached to the dev center or project has [access to the key vault secret](./how-to-configure-managed-identity.md#grant-the-managed-identity-access-to-the-key-vault-secret) where your personal access token is stored.

1. In the left menu under **Environment configuration**, select **Catalogs**, and then select **Add**.

1. In **Add catalog**, enter the following information, and then select **Add**.

    | Field | Value |
    | ----- | ----- |
    | **Name** | Enter a name for the catalog. |
    | **Catalog location**  | Select **GitHub**. |
    | **Repo**  | Enter or paste the clone URL for either your GitHub repository or your Azure Repos repository.<br>*Sample catalog example:* `https://github.com/Azure/deployment-environments.git` |
    | **Branch**  | Enter the repository branch to connect to.<br>*Sample catalog example:* `main`|
    | **Folder path**  | Enter the folder path relative to the clone URI that contains subfolders that hold your environment definitions. <br> The folder path is for the folder with subfolders containing environment definition environment files, not for the folder with the environment definition environment file itself. The following image shows the sample catalog folder structure.<br>*Sample catalog example:* `/Environments`<br> :::image type="content" source="media/how-to-configure-catalog/github-folders.png" alt-text="Screenshot showing Environments sample folder in GitHub." lightbox="media/how-to-configure-catalog/github-folders.png"::: The folder path can begin with or without a forward slash (`/`).|
    | **Secret identifier**| Enter the secret identifier that contains your PAT for the repository.<br> When you copy a secret identifier, the connection string includes a version identifier at the end, like in this example: `https://contoso-kv.vault.azure.net/secrets/GitHub-repo-pat/9376b432b72441a1b9e795695708ea5a`.<br>Removing the version identifier ensures that Deployment Environments fetch the latest version of the secret from the key vault. If your PAT expires, only the key vault needs to be updated. <br>*Example secret identifier:* `https://contoso-kv.vault.azure.net/secrets/GitHub-repo-pat`|

    :::image type="content" source="media/how-to-configure-catalog/add-github-catalog-pane.png" alt-text="Screenshot that shows how to add a catalog to a dev center." lightbox="media/how-to-configure-catalog/add-github-catalog-pane.png":::

1. In **Catalogs**, verify that your catalog appears. When the connection is successful, the **Status** reads **Sync successful**.
---

### View synced catalog items

Regardless of the type of repository you use, you can view the catalog items that are synced from the catalog.

1. On the left menu for your dev center or project, under **Environment configuration**, select **Catalogs**.

1. In the **Catalogs** pane, select the catalog name.

    :::image type="content" source="media/how-to-configure-catalog/check-catalog-items-sync.png" alt-text="Screenshot showing the Catalog pane, with the attached catalog name highlighted." lightbox="media/how-to-configure-catalog/check-catalog-items-sync.png":::

1. You see a list of successfully synced catalog items.

   :::image type="content" source="media/how-to-configure-catalog/catalog-items-first-sync.png" alt-text="Screenshot showing successfully synced catalog items from attached catalog." lightbox="media/how-to-configure-catalog/catalog-items-first-sync.png":::


## Update a catalog

If you update the definition or template contents in the attached repository, you can provide the latest set of environment definitions to your development teams by syncing the catalog. You can sync a catalog manually or automatically.

### Manually sync a catalog

When you manually sync a catalog, Deployment Environments scans through the repository and makes the latest list of environment definitions available to all of the associated projects in the dev center.

1. On the left menu for your dev center, under **Environment configuration**, select **Catalogs**.

1. Select the specific catalog, and then from the command bar, select **Sync**.
 
    :::image type="content" source="media/how-to-configure-catalog/catalog-manual-sync.png" alt-text="Screenshot showing the Sync button in the command bar." lightbox="media/how-to-configure-catalog/catalog-manual-sync.png":::
 
### Automatically sync a catalog

When you configure a catalog to sync automatically, Deployment Environments scans through the repository every 30 minutes and makes the latest list of environment definitions available to all of the associated projects in the dev center.

1. On the left menu for your dev center or project, under **Environment configuration**, select **Catalogs**.

1. Select the specific catalog, and then select edit.

    :::image type="content" source="media/how-to-configure-catalog/catalog-automatic-sync.png" alt-text="Screenshot showing the edit button for a catalog." lightbox="media/how-to-configure-catalog/catalog-automatic-sync.png":::  
 
1. In the **Edit catalog** pane, select **Automatically sync this catalog**, and then select **Save**.

    :::image type="content" source="media/how-to-configure-catalog/catalog-automatic-sync-pane.png" alt-text="Screenshot showing the edit details pane for a catalog, with Automatically sync this catalog highlighted." lightbox="media/how-to-configure-catalog/catalog-automatic-sync-pane.png":::  

## Delete a catalog

You can delete a catalog to remove it from the Azure Deployment Environments dev center or project. Templates in a deleted catalog aren't available to development teams when they deploy new environments. Update the environment definition reference for any existing environments that were created by using the environment definitions in the deleted catalog. If the reference isn't updated and the environment is redeployed, the deployment fails.

To delete a catalog:

1. On the left menu for your dev center or project, under **Environment configuration**, select **Catalogs**.

1. Select the specific catalog, and then select **Delete**.

1. In the **Delete catalog** dialog, select **Continue** to delete the catalog.

## Troubleshoot catalog sync errors

When you add or sync a catalog, you might encounter a sync error or warning. A sync error indicates that a catalog failed to sync successfully, A sync warning indicates that some or all of the catalog items have errors. You can view the sync status and errors in the Azure portal, or use the Azure CLI and REST API to troubleshoot and resolve the errors.

### View catalog sync status

In the Azure portal, you can get more information about the catalog sync status and any warnings or errors by selecting the status link. The status link opens a pane that shows the sync status, the number of environment definitions that were added, and the number of environment definitions that were ignored or failed.

#### View catalog sync failures

1. On the left menu for your dev center or project, under **Environment configuration**, select **Catalogs**.
 
1. In the **Status** column, select the status link for the catalog that failed to sync.

   :::image type="content" source="media/how-to-configure-catalog/catalog-items-fail.png" alt-text="Screenshot showing the Catalogs pane, with sync failed highlighted." lightbox="media/how-to-configure-catalog/catalog-items-fail.png":::
 
1. You see a details pane that shows the changes in the last sync, the number of sync errors, and the type of errors. 

   :::image type="content" source="media/how-to-configure-catalog/catalog-items-fail-details.png" alt-text="Screenshot showing the Catalog sync failures pane." lightbox="media/how-to-configure-catalog/catalog-items-fail-details.png":::

#### View catalog sync warnings

1. On the left menu for your dev center or project, under **Environment configuration**, select **Catalogs**.
 
1. In the **Status** column, select the status link for the catalog that synced but reports a warning.
 
   :::image type="content" source="media/how-to-configure-catalog/catalog-items-errors.png" alt-text="Screenshot showing the Catalogs pane, with Errors in 3 items highlighted." lightbox="media/how-to-configure-catalog/catalog-items-errors.png":::  
 
1. You see a details pane that shows the changes in the last sync, the number of item errors, and the type and source of each error.
 
    :::image type="content" source="media/how-to-configure-catalog/catalog-items-error-details.png" alt-text="Screenshot showing the Catalog sync errors pane." lightbox="media/how-to-configure-catalog/catalog-items-error-details.png"::: 
 
1. You can view items that have synced successfully from a catalog that also reports sync errors. From the **Catalogs** pane, select the catalog name.

    :::image type="content" source="media/how-to-configure-catalog/catalog-with-error-view-successful-items.png" alt-text="Screenshot showing the Catalog pane, with a catalog name highlighted." lightbox="media/how-to-configure-catalog/catalog-with-error-view-successful-items.png":::

1. You see a list of successfully synced catalog items.

   :::image type="content" source="media/how-to-configure-catalog/catalog-items-successful.png" alt-text="Screenshot showing successfully synced catalog items." lightbox="media/how-to-configure-catalog/catalog-items-successful.png":::

### Troubleshoot catalog sync errors by using the Azure CLI

Use the Azure CLI or the REST API to *GET* the catalog. The GET response shows you the type of error:

- Ignored environment definitions that were detected to be duplicates.
- Invalid environment definitions that failed due to schema, reference, or validation errors.

### Resolve ignored environment definition errors

An ignored environment definition error occurs if you add two or more environment definitions that have the same name. You can resolve this issue by renaming environment definitions so that each environment definition has a unique name within the catalog.

### Resolve invalid environment definition errors

An invalid environment definition error might occur for various reasons:

- **Manifest schema errors**. Ensure that your environment definition environment file matches the [required schema](configure-environment-definition.md#add-an-environment-definition).

- **Validation errors**. Check the following items to resolve validation errors:

  - Ensure that the environment file's engine type is correctly configured.
  - Ensure that the environment definition name is between 3 and 63 characters.
  - Ensure that the environment definition name includes only characters that are valid for a URL, which are alphanumeric characters and these symbols: `~` `!` `,` `.` `'` `;` `:` `=` `-` `_` `+` `(` `)` `*` `&` `$` `@`
  
- **Reference errors**. Ensure that the template path that the environment file references is a valid relative path to a file in the repository.

## Related content

- [Configure environment types for a dev center](how-to-configure-devcenter-environment-types.md)
- [Create and configure a project by using the Azure CLI](how-to-create-configure-projects.md)
- [Configure project environment types](how-to-configure-project-environment-types.md)
