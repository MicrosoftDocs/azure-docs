---
title: 'Tutorial: Deploy environments in CI/CD by using GitHub'
description: Learn how to integrate Azure Deployment Environments into your CI/CD pipeline by using GitHub Actions.
author: RoseHJM
ms.author: rosemalcolm
ms.service: azure-deployment-environments
ms.custom: devx-track-azurecli
ms.topic: tutorial
ms.date: 03/26/2025

#customer intent: As a platform engineer, I want to integrate Deployment Environments into a CI/CD pipeline so that I can use them for automated building, testing, and deployment. 
---

# Tutorial: Deploy environments in CI/CD by using GitHub and Azure Deployment Environments

In this tutorial, you learn how to integrate Azure Deployment Environments into your CI/CD pipeline. You can use any GitOps provider that supports CI/CD, like GitHub Actions, Azure Arc, GitLab, or Jenkins.

Continuous integration and continuous delivery (CI/CD) is a software development approach that helps teams automate the process of building, testing, and deploying software changes. CI/CD enables you to release software changes more frequently and with more confidence. 

You use a workflow that features three branches: main, dev, and test.

- The *main* branch is always considered production.
- You create feature branches from the *main* branch.
- You create pull requests to merge feature branches into *main*.

The workflow in this tutorial is a simplified example. Real-world workflows might be more complex.

Before beginning this tutorial, you can familiarize yourself with Deployment Environments components and concepts by reviewing [Key concepts for Azure Deployment Environments](concept-environments-key-concepts.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create and configure a dev center
> * Create a key vault
> * Create and configure a GitHub repository
> * Connect the catalog to your dev center
> * Configure deployment identities
> * Configure GitHub environments
> * Test the CI/CD pipeline

## Prerequisites

|Product|Requirements|
|-|-|
|Azure|- An [Azure subscription](https://azure.microsoft.com/pricing/purchase-options/azure-account?icid=azurefreeaccount). <br>- Owner permissions on the Azure subscription. <br> - [Azure CLI](/cli/azure/install-azure-cli) installed.|
|Git|- A [GitHub account](https://github.com/).<br>- [Git](https://github.com/git-guides/install-git) installed.|

## 1. Create and configure a dev center

In this section, you create an Azure Deployment Environments dev center and project with three environment types: *Dev*, *Test*, and *Prod*.

- The *Prod* environment type contains the single production environment.
- A new environment is created in *Dev* for each feature branch.
- A new environment is created in *Test* for each pull request.

### 1.1 Set up Azure CLI

To begin, sign in to Azure. Run the following command, and follow the prompts to complete the authentication process:

```azurecli
az login
```

Next, install the Azure devcenter extension for Azure CLI:

```azurecli
az extension add --name devcenter --upgrade
```

Now that the current extension is installed, register the `Microsoft.DevCenter` namespace:

```azurecli
az provider register --namespace Microsoft.DevCenter
```

> [!TIP]
> Throughout this tutorial, you'll save several values as environment variables to use later. You might also want to record these values elsewhere to ensure they're available when you need them.

Get your user ID and set it to an environment variable for later:

```azurecli
MY_AZURE_ID=$(az ad signed-in-user show --query id -o tsv)
```

Retrieve the subscription ID for your current subscription:

```azurecli
AZURE_SUBSCRIPTION_ID=$(az account show --query id --output tsv)
```

Retrieve the tenant ID for your current tenant:

```azurecli
AZURE_TENANT_ID=$(az account show --query tenantId --output tsv)
```

Set the following environment variables:

```azurecli
LOCATION="eastus"
AZURE_RESOURCE_GROUP=<resourceGroupName>
AZURE_DEVCENTER=<devcenterName>
AZURE_PROJECT=<projectName>
AZURE_KEYVAULT=<keyVaultName>
```

> [!NOTE]
> You must use a globally unique key vault name. Otherwise, you might get the following error:
> 
> `Code: VaultAlreadyExists Message: The vault name 'mykeyvaultname' is already in use. Vault names are globally unique so it is possible that the name is already taken.` 

### 1.2 Create a dev center

A *dev center* is a collection of projects and environments that have similar settings. Dev centers provide access to a catalog of templates and artifacts that can be used to create environments. Dev centers also provide a way to manage access to environments and projects. 

Create a resource group:

```azurecli
az group create \
  --name $AZURE_RESOURCE_GROUP \
  --location $LOCATION
```

Create a dev center:

```azurecli
az devcenter admin devcenter create \
  --name $AZURE_DEVCENTER \
  --identity-type SystemAssigned \
  --resource-group $AZURE_RESOURCE_GROUP \
  --location $LOCATION
```

The previous command outputs JSON. Save the values for `id` and `identity.principalId` as environment variables to use later:

```azurecli
AZURE_DEVCENTER_ID=<id>
AZURE_DEVCENTER_PRINCIPAL_ID=<identity.principalId>
```

### 1.3 Assign the dev center identity owner role on the subscription

A dev center needs permissions to assign roles on subscriptions associated with environment types. 

To reduce unnecessary complexity, in this tutorial, you use a single subscription for the dev center and all environment types. In practice, the dev center and target deployment subscriptions would probably be separate subscriptions with different policies applied.

```azurecli
az role assignment create \
  --scope /subscriptions/$AZURE_SUBSCRIPTION_ID \
  --role Owner \
  --assignee-object-id $AZURE_DEVCENTER_PRINCIPAL_ID \
  --assignee-principal-type ServicePrincipal
```

### 1.4 Create the environment types

 At the dev center level, environment types define the environments that development teams can create, like dev, test, sandbox, preproduction, and production. 

Create three new environment types: *Dev*, *Test*, and *Prod*:

```azurecli
az devcenter admin environment-type create \
  --name Dev \
  --resource-group $AZURE_RESOURCE_GROUP \
  --dev-center $AZURE_DEVCENTER
```

```azurecli
az devcenter admin environment-type create \
  --name Test \
  --resource-group $AZURE_RESOURCE_GROUP \
  --dev-center $AZURE_DEVCENTER
```

```azurecli
az devcenter admin environment-type create \
  --name Prod \
  --resource-group $AZURE_RESOURCE_GROUP \
  --dev-center $AZURE_DEVCENTER
```

### 1.5 Create a project

A *project* is the point of access for the development team. Each project is associated with a dev center. 

Create a project:

```azurecli
az devcenter admin project create \
  --name $AZURE_PROJECT \
  --resource-group $AZURE_RESOURCE_GROUP \
  --location $LOCATION \
  --dev-center-id $AZURE_DEVCENTER_ID
```

The previous command outputs JSON. Save the `id` value as an environment variable to use later:

```azurecli
AZURE_PROJECT_ID=<id>
```

Assign yourself the DevCenter Project Admin role on the project:

```azurecli
az role assignment create \
  --scope "$AZURE_PROJECT_ID" \
  --role "DevCenter Project Admin" \
  --assignee-object-id $MY_AZURE_ID \
  --assignee-principal-type User
```

### 1.6 Create project environment types

At the project level, platform engineers specify which environment types are appropriate for the development team.

Create a new project environment type for each of the environment types you created on the dev center:

```azurecli
az devcenter admin project-environment-type create \
  --name Dev \
  --roles "{\"b24988ac-6180-42a0-ab88-20f7382dd24c\":{}}" \
  --deployment-target-id /subscriptions/$AZURE_SUBSCRIPTION_ID \
  --resource-group $AZURE_RESOURCE_GROUP \
  --location $LOCATION \
  --project $AZURE_PROJECT \
  --identity-type SystemAssigned \
  --status Enabled
```

```azurecli
az devcenter admin project-environment-type create \
  --name Test \
  --roles "{\"b24988ac-6180-42a0-ab88-20f7382dd24c\":{}}" \
  --deployment-target-id /subscriptions/$AZURE_SUBSCRIPTION_ID \
  --resource-group $AZURE_RESOURCE_GROUP \
  --location $LOCATION \
  --project $AZURE_PROJECT \
  --identity-type SystemAssigned \
  --status Enabled
```

```azurecli
az devcenter admin project-environment-type create \
  --name Prod \
  --roles "{\"b24988ac-6180-42a0-ab88-20f7382dd24c\":{}}" \
  --deployment-target-id /subscriptions/$AZURE_SUBSCRIPTION_ID \
  --resource-group $AZURE_RESOURCE_GROUP \
  --location $LOCATION \
  --project $AZURE_PROJECT \
  --identity-type SystemAssigned \
  --status Enabled
```

## 2. Create a key vault

In this section, you create a new key vault. You use this key vault later in the tutorial to save a [personal access token](https://docs.github.com/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#fine-grained-personal-access-tokens) from GitHub.

```azurecli
az keyvault create \
  --name $AZURE_KEYVAULT \
  --resource-group $AZURE_RESOURCE_GROUP \
  --location $LOCATION \
  --enable-rbac-authorization true
```

Again, save the `id` from the previous command's JSON output as an environment variable:

```azurecli
AZURE_KEYVAULT_ID=<id>
```

Give yourself the Key Vault Administrator role on the new key vault:

```azurecli
az role assignment create \
  --scope $AZURE_KEYVAULT_ID \
  --role "Key Vault Administrator" \
  --assignee-object-id $MY_AZURE_ID \
  --assignee-principal-type User
```

Assign the dev center's identity the role of Key Vault Secrets User:

```azurecli
az role assignment create \
  --scope $AZURE_KEYVAULT_ID \
  --role "Key Vault Secrets User" \
  --assignee-object-id $AZURE_DEVCENTER_PRINCIPAL_ID \
  --assignee-principal-type ServicePrincipal
```

## 3. Create and configure a GitHub repository

In this section, you create a new GitHub repository to store a catalog. Azure Deployment Environments supports both GitHub and Azure DevOps repositories. In this tutorial, you use GitHub.

### 3.1 Create a GitHub repository

In this step, you create a new repository in your GitHub account that has a predefined directory structure, branches, and files. These items are generated from a sample template repository.

1. Generate a new GitHub repository from the [sample template](https://github.com/Azure-Samples/deployment-environments-cicd-tutorial/generate):

   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-generate-from-template.png" alt-text="Screenshot showing the GitHub create a new repository page." lightbox="media/tutorial-deploy-environments-in-cicd-github/github-generate-from-template.png"::: 

1. If you don't have a paid GitHub account, set your repository to **Public**.

1. Select **Create repository**.

### 3.2 Protect the repository's main branch

You can protect important branches by setting branch protection rules. Protection rules define whether collaborators can delete a branch or force push to the branch. They also set requirements for pushes to the branch, such as passing status checks or enforcing a linear commit history.

> [!NOTE]
> Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub plans](https://docs.github.com/get-started/learning-about-github/githubs-products).

1. If it's not already open, go to the main page of your repository.

1. Select **Settings** in the menu at the top of the window:

   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-repo-settings.png" alt-text="Screenshot showing the GitHub repository page. Settings is highlighted." lightbox="media/tutorial-deploy-environments-in-cicd-github/github-repo-settings.png":::

1. In the **Code and automation** section of the left sidebar, select **Branches**:

   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-branches-protect.png" alt-text="Screenshot showing the settings page. Branches is highlighted." lightbox="media/tutorial-deploy-environments-in-cicd-github/github-branches-protect.png":::

1. Under **Branch protection rules**, select **Add branch ruleset**: 
 
   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-protect-rule.png" alt-text="Screenshot showing the Branch protection rules page. Add branch rule set is highlighted." lightbox="media/tutorial-deploy-environments-in-cicd-github/github-protect-rule.png":::

1. On the **New branch ruleset** page, in **Ruleset Name**, enter **CI-CD-tutorial-ruleset**:
 
   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-branch-name-pattern.png" alt-text="Screenshot showing the Ruleset Name box. The ruleset name is highlighted." lightbox="media/tutorial-deploy-environments-in-cicd-github/github-branch-name-pattern.png":::

1. Under **Target branches**, select **Add target**, and then select either **Include default branch** or **Include all branches**:

    :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-target-branches.png" alt-text="Screenshot showing the Target branches section. The two choices for Add target are highlighted." lightbox="media/tutorial-deploy-environments-in-cicd-github/github-target-branches.png":::

1. Under **Branch rules**, select **Require a pull request before merging**:

   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-require-pull-request.png" alt-text="Screenshot showing Branch rules. The Require a pull request before merging checkbox is selected and highlighted." lightbox="media/tutorial-deploy-environments-in-cicd-github/github-require-pull-request.png":::

1. Optionally, you can enable [more protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/managing-a-branch-protection-rule#creating-a-branch-protection-rule).

1. Select **Create**.

### 3.3 Configure repository variables

1. In the **Security** section of the sidebar, select **Secrets and variables**, and then select **Actions**:
 
   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-security-menu.png" alt-text="Screenshot showing the Security section of the sidebar. Actions is highlighted." lightbox="media/tutorial-deploy-environments-in-cicd-github/github-security-menu.png":::

1. Select the **Variables** tab.

1. For each item in the following table:

    1. Select **New repository variable**.
    1. In the **Name** field, enter the variable name.
    1. In the **Value** field, enter the value described in the table.
    1. Select **Add variable**.

    | Variable name         | Variable value               |
    | --------------------- | ---------------------------- |
    | AZURE_DEVCENTER       | Your dev center name         |
    | AZURE_PROJECT         | Your project name            |
    | AZURE_CATALOG         | Set to **Environments**        |
    | AZURE_CATALOG_ITEM    | Set to **FunctionApp**         |
    | AZURE_SUBSCRIPTION_ID | Your Azure subscription ID   |
    | AZURE_TENANT_ID       | Your Azure tenant ID         |

    :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-variables.png" alt-text="Screenshot showing the variables page with the variables table." lightbox="media/tutorial-deploy-environments-in-cicd-github/github-variables.png":::

### 3.4 Create a GitHub personal access token

Next, create a [fine-grained personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#fine-grained-personal-access-tokens) to enable your Azure Deployment Environments dev center to connect to your repository and consume the environment catalog.

> [!NOTE]
> You can leave feedback on fine-grained personal access tokens in the [feedback discussion](https://github.com/community/community/discussions/36441).

1. In the upper-right corner of any page on GitHub.com, select your profile photo, and then select **Settings**.

1. In the left sidebar, select **Developer settings**.

1. In the left sidebar, under **Personal access tokens**, select **Fine-grained tokens**, and then select **Generate new token**:

   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-fine-grained-personal-access-token.png" alt-text="Screenshot showing the GitHub personal access token options. The Fine-grained tokens and Generate new token options are highlighted." lightbox="media/tutorial-deploy-environments-in-cicd-github/github-fine-grained-personal-access-token.png":::

1. On the **New fine-grained personal access token** page, under **Token name**, enter a name for the token.

1. Under **Expiration**, select an expiration for the token.

1. Under **Resource owner**, select your GitHub user name.

1. Under **Repository access**, select **Only select repositories**. Under **Selected repositories**, search for and select the repository you created:
 
   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-repo-access.png" alt-text="Screenshot showing GitHub repository access options. The Only select repositories option is highlighted." lightbox="media/tutorial-deploy-environments-in-cicd-github/github-repo-access.png":::

1. Under **Permissions**, select **Repository permissions**, and then change **Contents** to **Read-only**:

    :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-repo-permissions.png" alt-text="Screenshot showing GitHub repository permissions. The Contents section is highlighted." lightbox="media/tutorial-deploy-environments-in-cicd-github/github-repo-permissions.png":::

1. Select **Generate token**.
 
1. Copy and save your personal access token. You won't be able to view it again.

### 3.5 Save your personal access token to the key vault

Next, save the personal access token as a key vault secret named **pat**:

```azurecli
az keyvault secret set \
    --name pat \
    --vault-name $AZURE_KEYVAULT \
    --value <personalAccessToken>
```

## 4. Connect the catalog to your dev center

In Azure Deployment Environments, a *catalog* is a repository that contains a set of environment definitions. Catalog items consist of an infrastructure-as-code (IaC) template and an environment file that acts as a manifest. The template defines the environment, and the environment file provides metadata about the template. Development teams use environment definitions from the catalog to create environments.

The template you used to create your GitHub repository contains a catalog in the _Environments_ folder.

#### Add the catalog to your dev center 

In the following command, replace `< Organization/Repository >` with your GitHub organization and repository name:

```azurecli
az devcenter admin catalog create \
    --name Environments \
    --resource-group $AZURE_RESOURCE_GROUP \
    --dev-center $AZURE_DEVCENTER \
    --git-hub path="/Environments" branch="main" secret-identifier="https://$AZURE_KEYVAULT.vault.azure.net/secrets/pat" uri="https://github.com/< Organization/Repository >.git"
```

## 5. Configure deployment identities

[OpenID Connect with GitHub Actions](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect) is an authentication method that uses short-lived tokens to provide hardened security. It's the recommended way to authenticate GitHub Actions to Azure.

You can also authenticate a service principal directly by using a secret, but that's out of scope for this tutorial.

### 5.1 Generate deployment identities

1. Register [Microsoft Entra applications and service principals](../active-directory/develop/howto-create-service-principal-portal.md) for each of the three environment types.

    Create the Microsoft Entra application for *Dev*:

    ```azurecli
    az ad app create --display-name "$AZURE_PROJECT-Dev"
    ```

    This command outputs JSON with an `id` that you use when creating federated credentials with Graph API, and an `appId` (also called a *client ID*).

    Set the following environment variables:

    ```azurecli
    DEV_AZURE_CLIENT_ID=<appId>
    DEV_APPLICATION_ID=<id>
    ```

    Repeat these steps for *Test*:

    ```azurecli
    az ad app create --display-name "$AZURE_PROJECT-Test"
    ```

    ```azurecli
    TEST_AZURE_CLIENT_ID=<appId>
    TEST_APPLICATION_ID=<id>
    ```

    Repeat the steps again for *Prod*:

    ```azurecli
    az ad app create --display-name "$AZURE_PROJECT-Prod"
    ```

    ```azurecli
    PROD_AZURE_CLIENT_ID=<appId>
    PROD_APPLICATION_ID=<id>
    ```

1. Create a service principal for each application.

    Run the following command to create a new service principal for *Dev*:

    ```azurecli
     az ad sp create --id $DEV_AZURE_CLIENT_ID
    ```

    This command generates JSON output with a different `id` that will be used in the next step.

    Set the following environment variable:

    ```azurecli
    DEV_SERVICE_PRINCIPAL_ID=<id>
    ```

    Repeat these steps for *Test*:

    ```azurecli
     az ad sp create --id $TEST_AZURE_CLIENT_ID
    ```

    ```azurecli
    TEST_SERVICE_PRINCIPAL_ID=<id>
    ```

    Repeat the steps again for *Prod*:

    ```azurecli
     az ad sp create --id $PROD_AZURE_CLIENT_ID
    ```

    ```azurecli
    PROD_SERVICE_PRINCIPAL_ID=<id>
    ```

1. Run the following commands to [create a new federated identity credential](/graph/api/application-post-federatedidentitycredentials?view=graph-rest-beta&preserve-view=true) for each Microsoft Entra application.

   In each of the three following commands, replace `< Organization/Repository >` with your GitHub organization and repository name.

    Create the federated identity credential for *Dev*:

    ```azurecli
    az rest --method POST \
        --uri "https://graph.microsoft.com/beta/applications/$DEV_APPLICATION_ID/federatedIdentityCredentials" \
        --body '{"name":"ADEDev","issuer":"https://token.actions.githubusercontent.com","subject":"repo:< Organization/Repository >:environment:Dev","description":"Dev","audiences":["api://AzureADTokenExchange"]}'
    ```

    Create the credential for *Test*:

    ```azurecli
    az rest --method POST \
        --uri "https://graph.microsoft.com/beta/applications/$TEST_APPLICATION_ID/federatedIdentityCredentials" \
        --body '{"name":"ADETest","issuer":"https://token.actions.githubusercontent.com","subject":"repo:< Organization/Repository >:environment:Test","description":"Test","audiences":["api://AzureADTokenExchange"]}'
    ```

    Create the credential for *Prod*:

    ```azurecli
    az rest --method POST \
        --uri "https://graph.microsoft.com/beta/applications/$PROD_APPLICATION_ID/federatedIdentityCredentials" \
        --body '{"name":"ADEProd","issuer":"https://token.actions.githubusercontent.com","subject":"repo:< Organization/Repository >:environment:Prod","description":"Prod","audiences":["api://AzureADTokenExchange"]}'
    ```

### 5.2 Assign roles to deployment identities

1. Assign each deployment identity the Reader role on the project:

    ```azurecli
    az role assignment create \
        --scope "$AZURE_PROJECT_ID" \
        --role Reader \
        --assignee-object-id $DEV_SERVICE_PRINCIPAL_ID \
        --assignee-principal-type ServicePrincipal
    ```

    ```azurecli
    az role assignment create \
        --scope "$AZURE_PROJECT_ID" \
        --role Reader \
        --assignee-object-id $TEST_SERVICE_PRINCIPAL_ID \
        --assignee-principal-type ServicePrincipal
    ```

    ```azurecli
    az role assignment create \
        --scope "$AZURE_PROJECT_ID" \
        --role Reader \
        --assignee-object-id $PROD_SERVICE_PRINCIPAL_ID \
        --assignee-principal-type ServicePrincipal
    ```

1. Assign the Deployment Environments User role to the corresponding environment type of each deployment identity:

    ```azurecli
    az role assignment create \
        --scope "$AZURE_PROJECT_ID/environmentTypes/Dev" \
        --role "Deployment Environments User" \
        --assignee-object-id $DEV_SERVICE_PRINCIPAL_ID \
        --assignee-principal-type ServicePrincipal
    ```

    ```azurecli
    az role assignment create \
        --scope "$AZURE_PROJECT_ID/environmentTypes/Test" \
        --role "Deployment Environments User" \
        --assignee-object-id $TEST_SERVICE_PRINCIPAL_ID \
        --assignee-principal-type ServicePrincipal
    ```

    ```azurecli
    az role assignment create \
        --scope "$AZURE_PROJECT_ID/environmentTypes/Prod" \
        --role "Deployment Environments User" \
        --assignee-object-id $PROD_SERVICE_PRINCIPAL_ID \
        --assignee-principal-type ServicePrincipal
    ```

## 6. Configure GitHub environments

With GitHub environments, you can configure environments with protection rules and secrets. A workflow job that references an environment must follow any protection rules for the environment before running or accessing the environment's secrets.

Create *Dev*, *Test*, and *Prod* environments that map to the environment types in the Azure Deployment Environments project.

> [!NOTE]
> Environments, environment secrets, and environment protection rules are available in public repositories for all products. For access to environments, environment secrets, and deployment branches in private or internal repositories, you must use GitHub Pro, GitHub Team, or GitHub Enterprise. For access to other environment protection rules in private or internal repositories, you must use GitHub Enterprise. For more information, see [GitHub plans](https://docs.github.com/get-started/learning-about-github/githubs-products).

### 6.1 Create the Dev environment

1. In GitHub, go to the main page of your repository.

1. Under your repository name, select  **Settings**. If you can't see the **Settings** tab, select the **...** dropdown menu, and then select **Settings**.

1. In the left sidebar, select **Environments**.
 
1. Select **New environment** and enter **Dev** for the environment name, and then select **Configure environment**:
 
   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-create-environment.png" alt-text="Screenshot showing the Environments Add / pane. The environment name is Dev, and the Configure environment button is highlighted." lightbox="media/tutorial-deploy-environments-in-cicd-github/github-create-environment.png":::

1. Under **Environment secrets**, select **Add environment secret**, and then enter **AZURE_CLIENT_ID** in the **Name** box.

   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-secret.png" alt-text="Screenshot showing the Environment / Configure Dev pane. Add environment secret is highlighted." lightbox="media/tutorial-deploy-environments-in-cicd-github/github-secret.png":::

1. In the **Value** box, enter the client ID (`appId`) for the *Dev* Microsoft Entra app you created earlier (saved as the `$DEV_AZURE_CLIENT_ID` environment variable):
 
   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-add-secret.png" alt-text="Screenshot of the Add secret box. The name is set to AZURE CLIENT ID, the value is set to an ID number, and the Add secret button is highlighted." lightbox="media/tutorial-deploy-environments-in-cicd-github/github-add-secret.png" :::

1. Select **Add secret**.

### 6.2 Create the Test environment

Return to the main environments page by selecting **Environments** in the left sidebar.

1. Select **New environment**, enter **Test** for the environment name, and then select **Configure environment**.

1. Under **Environment secrets**, select **Add environment secret**, and then enter **AZURE_CLIENT_ID** in the **Name** box.

1. In the **Value** box, enter the client ID (`appId`) for the *Test* Microsoft Entra app you created earlier (saved as the `$TEST_AZURE_CLIENT_ID` environment variable).

1. Select **Add secret**.

### 6.3 Create the Prod environment

Once more, return to the main environments page by selecting **Environments** in the left sidebar.

1. Select **New environment**, enter **Prod** for the environment name, and then select **Configure environment**.

1. Under **Environment secrets**, select **Add environment secret**, and then enter **AZURE_CLIENT_ID** in the **Name** box.

1. In the **Value** box, enter the client ID (`appId`) for the *Prod* Microsoft Entra app you created earlier (saved as the `$PROD_AZURE_CLIENT_ID` environment variable).

1. Select **Add secret**.

Next, set yourself as a [required reviewer](https://docs.github.com/actions/managing-workflow-runs/reviewing-deployments) for this environment. When an attempt is made to deploy to *Prod*, GitHub Actions waits for an approval before starting. While a job is awaiting approval, it has a status of *Waiting*. If a job isn't approved within 30 days, it automatically fails.

For more information about environments and required approvals, see [Using environments for deployment](https://docs.github.com/actions/deployment/targeting-different-environments/using-environments-for-deployment).

1. Select **Required reviewers**.

1. Search for and select your GitHub user name. You can enter up to six people or teams. Only one of the required reviewers needs to approve the job for it to proceed.

1. Select **Save protection rules**.

Finally, configure `main` as the deployment branch:

1. In the **Deployment branches and tags** list, select **Selected branches and tags**.

1. Select **Add deployment branch or tag rule**, ensure **Ref type: Branch** is selected, and then enter **main** in the **Name pattern** box.

1. Select **Add rule**.

## 7. Test the CI/CD pipeline

In this section, you make some changes to the repository and test the CI/CD pipeline.

### 7.1 Clone the repository

1. In Git Bash, use `cd` to switch to a folder where you want to clone your repository locally.

1. Clone the repository. Be sure to replace `< Organization/Repository >` in the following command with your GitHub organization and repository name.

    ```Bash
    git clone https://github.com/< Organization/Repository >.git
    ```

1. Navigate into the cloned directory:

    ```Bash
    cd <repository>
    ```

1. Create a new branch and publish it remotely:

    ```Bash
    git checkout -b feature1
    ```

    ```Bash
    git push -u origin feature1
    ```

    A new environment, specific to this branch, is created in Azure.

1. In GitHub, go to the main page of your newly created repository.

1. Under your repository name, select **Actions**:

   You should see a new Create Environment workflow running.

### 7.2 Make a change to the code

1. Open the locally cloned repo in Visual Studio Code.

1. In the *ADE.Tutorial* folder, make a change to a file.

1. Save your change.

### 7.3 Push your changes to update the environment

1. Stage your changes and push to the `feature1` branch:

   ``` Bash
   git add .
   git commit -m '<commit message>'
   git push
   ```

1. On your repository's **Actions** page, you see a new Update Environment workflow running.

### 7.4 Create a pull request

1. Create a GitHub pull request `main <- feature1`.

1. On your repository's **Actions** page, you see that a new workflow is started to create an environment that's specific to the pull request. The Test environment type is used.

### 7.5 Merge the pull request

1. In GitHub, go to the pull request you created.

1. Merge the pull request.

    Your changes are published into the production environment, and the branch and pull request environments are deleted.

## Clean up resources

[!INCLUDE [alt-delete-resource-group](includes/alt-delete-resource-group.md)]

## Related content

- [Create and access an environment by using the Azure CLI](how-to-create-access-environments.md)
- For complete command listings, see the [Microsoft Dev Box and Azure Deployment Environments Azure CLI documentation](https://aka.ms/CLI-reference)
