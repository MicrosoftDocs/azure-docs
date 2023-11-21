---
title: 'Tutorial: Deploy environments in CI/CD with GitHub'
description: Learn how to integrate Azure Deployment Environments into your CI/CD pipeline by using GitHub Actions.
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.custom: devx-track-azurecli
ms.topic: tutorial
ms.date: 04/13/2023
---

# Tutorial: Deploy environments in CI/CD with GitHub and Azure Deployment Environments

In this tutorial, you'll Learn how to integrate Azure Deployment Environments into your CI/CD pipeline by using GitHub Actions. You can use any GitOps provider that supports CI/CD, like GitHub Actions, Azure Arc, GitLab, or Jenkins. 

Continuous integration and continuous delivery (CI/CD) is a software development approach that helps teams to automate the process of building, testing, and deploying software changes. CI/CD enables you to release software changes more frequently and with greater confidence. 

You use a workflow that features three branches: main, dev, and test.

- The  *main* branch is always considered production.
- You create feature branches from the *main* branch.
- You create pull requests to merge feature branches into *main*.

This workflow is a small example for the purposes of this tutorial. Real world workflows might be more complex.

Before beginning this tutorial, you can familiarize yourself with Deployment Environments resources and concepts by reviewing [Key concepts for Azure Deployment Environments](concept-environments-key-concepts.md).

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

- An Azure account with an active subscription.
  - [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Owner permissions on the Azure subscription.
- A GitHub account.
  - If you don't have one, sign up for [free](https://github.com/join).
- Install [Git](https://github.com/git-guides/install-git).
- Install the [Azure CLI](/cli/azure/install-azure-cli).


## 1. Create and configure a dev center

In this section, you create an Azure Deployment Environments dev center and project with three environment types: Dev, Test and Prod.

- The Prod environment type contains the single production environment
- A new environment is created in Dev for each feature branch
- A new environment is created in Test for each pull request

### 1.1 Setup the Azure CLI

To begin, sign in to Azure. Run the following command, and follow the prompts to complete the authentication process.

```azurecli
az login
```

Next, install the Azure Dev Center extension for the CLI.

```azurecli
az extension add --name devcenter --upgrade
```

Now that the current extension is installed, register the `Microsoft.DevCenter` namespace.

```azurecli
az provider register --namespace Microsoft.DevCenter
```

> [!TIP]
> Throughout this tutorial, you'll save several values as environment variables to use later. You may also want to record these value elsewhere to ensure they are available when needed.

Get your user's ID and set it to an environment variable for later:

```azurecli
MY_AZURE_ID=$(az ad signed-in-user show --query id -o tsv)
```

Retrieve the subscription ID for your current subscription.

```azurecli
AZURE_SUBSCRIPTION_ID=$(az account show --query id --output tsv)
```

Retrieve the tenant ID for your current tenant.

```azurecli
AZURE_TENANT_ID=$(az account show --query tenantId --output tsv)
```

Set the following environment variables:

```azurecli
LOCATION="eastus"
AZURE_RESOURCE_GROUP="my-dev-center-rg"
AZURE_DEVCENTER="my-dev-center"
AZURE_PROJECT="my-project"
AZURE_KEYVAULT="myuniquekeyvaultname"
```

### 1.2 Create a dev center

A dev center is a collection of projects and environments that have similar settings. Dev centers provide access to a catalog of templates and artifacts that can be used to create environments. Dev centers also provide a way to manage access to environments and projects. 

Create a Resource Group

```azurecli
az group create \
  --name $AZURE_RESOURCE_GROUP \
  --location $LOCATION
```

Create a new Dev Center

```azurecli
az devcenter admin devcenter create \
  --name $AZURE_DEVCENTER \
  --identity-type SystemAssigned \
  --resource-group $AZURE_RESOURCE_GROUP \
  --location $LOCATION
```

The previous command outputs JSON. Save the values for `id` and `identity.principalId` as environment variables to use later.

```azurecli
AZURE_DEVCENTER_ID=<id>
AZURE_DEVCENTER_PRINCIPAL_ID=<identity.principalId>
```

### 1.3 Assign dev center identity owner role on subscription

A dev center needs permissions to assign roles on subscriptions associated with environment types. 

To reduce unnecessary complexity, in this tutorial, you use a single subscription for the dev center and all environment types. In practice, the dev center and target deployment subscriptions would likely be separate subscriptions with different policies applied.

```azurecli
az role assignment create \
  --scope /subscriptions/$AZURE_SUBSCRIPTION_ID \
  --role Owner \
  --assignee-object-id $AZURE_DEVCENTER_PRINCIPAL_ID \
  --assignee-principal-type ServicePrincipal
```

### 1.4 Create the environment types

 At the dev center level, environment types define the environments that development teams can create, like dev, test, sandbox, preproduction, or production. 

Create three new Environment types: **Dev**, **Test**, and **Prod**.

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

A project is the point of access for the development team. Each project is associated with a dev center. 

Create a new Project

```azurecli
az devcenter admin project create \
  --name $AZURE_PROJECT \
  --resource-group $AZURE_RESOURCE_GROUP \
  --location $LOCATION \
  --dev-center-id $AZURE_DEVCENTER_ID
```

The previous command outputs JSON. Save the `id` value as an environment variable to use later.

```azurecli
AZURE_PROJECT_ID=<id>
```

Assign yourself the "DevCenter Project Admin" role on the project

```azurecli
az role assignment create \
  --scope "$AZURE_PROJECT_ID" \
  --role "DevCenter Project Admin" \
  --assignee-object-id $MY_AZURE_ID \
  --assignee-principal-type User
```

### 1.6 Create project environment types

At the project level, platform engineers specify which environment types are appropriate for the development team.

Create a new Project Environment Type for each of the Environment Types we created on the dev center

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

In this section, you create a new key vault. You use this key vault later in the tutorial to save a [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#fine-grained-personal-access-tokens) from GitHub.

```azurecli
az keyvault create \
  --name $AZURE_KEYVAULT \
  --resource-group $AZURE_RESOURCE_GROUP \
  --location $LOCATION \
  --enable-rbac-authorization true
```

Again, save the `id` from the previous command's JSON output as an environment variable.

```azurecli
AZURE_KEYVAULT_ID=<id>
```

Give yourself the "Key Vault Administrator" role on the new key vault.

```azurecli
az role assignment create \
  --scope $AZURE_KEYVAULT_ID \
  --role "Key Vault Administrator" \
  --assignee-object-id $MY_AZURE_ID \
  --assignee-principal-type User
```

Assign the dev center's identity the role of "Key Vault Secrets User"

```azurecli
az role assignment create \
  --scope $AZURE_KEYVAULT_ID \
  --role "Key Vault Secrets User" \
  --assignee-object-id $AZURE_DEVCENTER_PRINCIPAL_ID \
  --assignee-principal-type ServicePrincipal
```

## 3. Create and configure a GitHub repository

In this section, you create a new GitHub repository to store a catalog. Azure Deployment Environments supports both GitHub and Azure DevOps repositories. In this tutorial, you use GitHub. 
### 3.1 Create a new GitHub repository

In this step, you create a new repository in your GitHub account that has a predefined directory structure, branches, and files. These items are generated from a sample template repository.

1. Use this link to generate a new GitHub repository from the [sample template](https://github.com/Azure-Samples/deployment-environments-cicd-tutorial/generate).
 
   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-generate-from-template.png" alt-text="Screenshot showing the GitHub create repository from template page."::: 

1. If you don't have a paid GitHub account, set your repository to **Public**.

1. Select **Create repository from template**.

1. On the **Actions** tab, notice that the Create Environment action fails.  This behavior is expected, you can proceed with the next step.

### 3.2 Protect the repository's *main* branch

You can protect important branches by setting branch protection rules. Protection rules define whether collaborators can delete or force push to the branch. They also set requirements for any pushes to the branch, such as passing status checks or a linear commit history.

> [!NOTE]
> Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see "[GitHub’s products](https://docs.github.com/en/get-started/learning-about-github/githubs-products)".

1. If it's not already open, navigate to the main page of your repository.

1. Under your repository name, select **Settings**. If you can't see the "Settings" tab, select the **...** dropdown menu, then select **Settings**.
 
   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-repo-settings.png" alt-text="Screenshot showing the GitHub repository page with settings highlighted.":::

1. In the **Code and automation** section of the sidebar, select **Branches**.

   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-branches-protect.png" alt-text="Screenshot showing the settings page, with branches highlighted.":::

1. Under **Branch protection rules**, select **Add branch protection rule**. 
 
   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-protect-rule.png" alt-text="Screenshot showing the branch protection rule page, with Add branch protection rule highlighted. ":::

1. Under **Branch name pattern**, enter <*main*>.
 
   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-branch-name-pattern.png" alt-text="Screenshot showing the branch name pattern text box, with main highlighted.":::
 
1. Under **Protect matching branches**, select **Require a pull request before merging**.

   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-require-pull-request.png" alt-text="Screenshot showing protect matching branches with Require a pull request before merging selected and highlighted.":::

1. Optionally, you can enable [more protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/managing-a-branch-protection-rule#creating-a-branch-protection-rule).

1. Select **Create**.

### 3.3 Configure repository variables

> [!NOTE]
> Configuration variables for GitHub Actions are in beta and subject to change.

1. In the **Security** section of the sidebar, select **Secrets and variables**, then select **Actions**.

1. Select the **Variables** tab.
 
   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-security-menu.png" alt-text="Screenshot showing the Security section of the sidebar with Actions highlighted."::: 

1. For each item in the table:

    1. Select **New repository variable**.
    2. In the **Name** field, enter the variable name.
    3. In the **Value** field, enter the value described in the table.
    4. Select **Add variable**.

    | Variable name         | Variable value               |
    | --------------------- | ---------------------------- |
    | AZURE_DEVCENTER       | Dev center name              |
    | AZURE_PROJECT         | Project name                 |
    | AZURE_CATALOG         | Set to: _Environments_       |
    | AZURE_CATALOG_ITEM    | Set to: _FunctionApp_        |
    | AZURE_SUBSCRIPTION_ID | Azure subscription ID (GUID) |
    | AZURE_TENANT_ID       | Azure tenant ID (GUID)       |

    :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-variables.png" alt-text="Screenshot showing the variables page with the variables table.":::

### 3.4 Create a GitHub personal access token

Next, create a [fine-grained personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#fine-grained-personal-access-tokens) to enable your Azure Deployment Environments dev center to connect to your repository and consume the environment catalog.

> [!NOTE]
> Fine-grained personal access token are currently in beta and subject to change. To leave feedback, see the [feedback discussion](https://github.com/community/community/discussions/36441).

1. In the upper-right corner of any page on GitHub.com, select your profile photo, then select **Settings**.

1. In the left sidebar, select **Developer settings**.

1. In the left sidebar, under **Personal access tokens**, select **Fine-grained tokens**, and then select **Generate new token**.
   
   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-fine-grained-personal-access-token.png" alt-text="Screenshot showing the GitHub personal access token options, with Fine-grained tokens and Generate new token highlighted.":::

1. On the New fine-grained personal access token page, under **Token name**, enter a name for the token.

1. Under **Expiration**, select an expiration for the token.

1. Select your GitHub user under **Resource owner**.

1. Under **Repository access**, select **Only select repositories** then in the **Selected repositories** dropdown, search and select the repository you created.
 
   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-repo-access.png" alt-text="Screenshot showing GitHub repository access options, with Only select repositories highlighted.":::

1. Under **Permissions**, select **Repository permissions**, and change **Contents** to **Read-only**.

    :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-repo-permissions.png" alt-text="Screenshot showing GitHub repository permissions with Contents highlighted.":::

1. Select **Generate token**.
 
1. Copy your personal access token now. You cannot view it again.

### 3.5 Save personal access token to key vault

Next, save the PAT token as a key vault secret named _pat_.

```azurecli
az keyvault secret set \
    --name pat \
    --vault-name $AZURE_KEYVAULT \
    --value "github_pat_..."
```

## 4. Connect the catalog to your dev center

In Azure Deployment Environments, a catalog is a repository that contains a set of environment definitions. Catalog items consist of an IaC template and an environment file that acts as a manifest. The template defines the environment, and the environment file provides metadata about the template. Development teams use environment definitions from the catalog to create environments.                                                         

The template you used to create your GitHub repository contains a catalog in the _Environments_ folder.

#### Add the catalog to your dev center 

In the following command, replace `< Organization/Repository >` with your GitHub organization and repository name.

```azurecli
az devcenter admin catalog create \
    --name Environments \
    --resource-group $AZURE_RESOURCE_GROUP \
    --dev-center $AZURE_DEVCENTER \
    --git-hub path="/Environments" branch="main" secret-identifier="https://$AZURE_KEYVAULT.vault.azure.net/secrets/pat" uri="https://github.com/< Organization/Repository >.git"
```

## 5. Configure deployment identities

[OpenID Connect with GitHub Actions](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect) is an authentication method that uses short-lived tokens to offer hardened security. It's the recommended way to authenticate GitHub Actions to Azure.

You can also authenticate a service principal directly using a secret, but that is out of scope for this tutorial.
### 5.1 Generate deployment identities

1. Register [new Active Directory applications and service principals](../active-directory/develop/howto-create-service-principal-portal.md) for each of the three environment types.

    Create the Active Directory application for **Dev**.

    ```azurecli
    az ad app create --display-name "$AZURE_PROJECT-Dev"
    ```

    This command outputs JSON with an `id` that you use when creating federated credentials with Graph API, and an `appId` (also called client ID).

    Set the following environment variables:

    ```azurecli
    DEV_AZURE_CLIENT_ID=<appId>
    DEV_APPLICATION_ID=<id>
    ```

    Repeat for **Test**:

    ```azurecli
    az ad app create --display-name "$AZURE_PROJECT-Test"
    ```

    ```azurecli
    TEST_AZURE_CLIENT_ID=<appId>
    TEST_APPLICATION_ID=<id>
    ```

    And **Prod**:

    ```azurecli
    az ad app create --display-name "$AZURE_PROJECT-Prod"
    ```

    ```azurecli
    PROD_AZURE_CLIENT_ID=<appId>
    PROD_APPLICATION_ID=<id>
    ```

2. Create a service principal for each application.

    Run the following command to create a new service principal for **Dev**.

    ```azurecli
     az ad sp create --id $DEV_AZURE_CLIENT_ID
    ```

    This command generates JSON output with a different `id` and will be used in the next step.

    Set the following environment variables:

    ```azurecli
    DEV_SERVICE_PRINCIPAL_ID=<id>
    ```

    Repeat for **Test**:

    ```azurecli
     az ad sp create --id $TEST_AZURE_CLIENT_ID
    ```

    ```azurecli
    TEST_SERVICE_PRINCIPAL_ID=<id>
    ```

    And **Prod**:

    ```azurecli
     az ad sp create --id $PROD_AZURE_CLIENT_ID
    ```

    ```azurecli
    PROD_SERVICE_PRINCIPAL_ID=<id>
    ```

3. Run the following commands to [create a new federated identity credentials](/graph/api/application-post-federatedidentitycredentials?view=graph-rest-beta&preserve-view=true) for each active directory application.

   In each of the three following commands, replace `< Organization/Repository >` with your GitHub organization and repository name.

    Create the federated identity credential for **Dev**:

    ```azurecli
    az rest --method POST \
        --uri "https://graph.microsoft.com/beta/applications/$DEV_APPLICATION_ID/federatedIdentityCredentials" \
        --body '{"name":"ADEDev","issuer":"https://token.actions.githubusercontent.com","subject":"repo:< Organization/Repository >:environment:Dev","description":"Dev","audiences":["api://AzureADTokenExchange"]}'
    ```

    For **Test**:

    ```azurecli
    az rest --method POST \
        --uri "https://graph.microsoft.com/beta/applications/$TEST_APPLICATION_ID/federatedIdentityCredentials" \
        --body '{"name":"ADETest","issuer":"https://token.actions.githubusercontent.com","subject":"repo:< Organization/Repository >:environment:Test","description":"Test","audiences":["api://AzureADTokenExchange"]}'
    ```

    And **Prod**:

    ```azurecli
    az rest --method POST \
        --uri "https://graph.microsoft.com/beta/applications/$PROD_APPLICATION_ID/federatedIdentityCredentials" \
        --body '{"name":"ADEProd","issuer":"https://token.actions.githubusercontent.com","subject":"repo:< Organization/Repository >:environment:Prod","description":"Prod","audiences":["api://AzureADTokenExchange"]}'
    ```

### 5.2 Assign roles to deployment identities

1. Assign each deployment identity the Reader role on the project.

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

1. Assign each deployment identity the "Deployment Environments User" role to it's corresponding environment type

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

Create three environments: Dev, Test, and Prod to map to the environment types in the Azure Deployment Environments project.

> [!NOTE]
> Environments, environment secrets, and environment protection rules are available in public repositories for all products. For access to environments, environment secrets, and deployment branches in **private** or **internal** repositories, you must use GitHub Pro, GitHub Team, or GitHub Enterprise. For access to other environment protection rules in **private** or **internal** repositories, you must use GitHub Enterprise. For more information, see "[GitHub’s products.](https://docs.github.com/en/get-started/learning-about-github/githubs-products)"

### 6.1 Create the Dev environment

1. On GitHub.com, navigate to the main page of your repository.

1. Under your repository name, select  **Settings**. If you can't see the "Settings" tab, select the **...** dropdown menu, then select **Settings**.

1. In the left sidebar, select **Environments**.
 
1. Select **New environment** and enter _Dev_ for the environment name, then select **Configure environment**.
 
   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-create-environment.png" alt-text="Screenshot showing the Environments Add pane, with the environment name Dev, and Configure Environment highlighted. ":::

1. Under **Environment secrets**, select **Add Secret** and enter _AZURE_CLIENT_ID_ for **Name**.

   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-secret.png" alt-text="Screenshot showing the Environment Configure Dev pane, with Add secret highlighted.":::

1. For **Value**, enter the client ID (`appId`) for the **Dev** Microsoft Entra app you created earlier (saved as the `$DEV_AZURE_CLIENT_ID` environment variable).
 
   :::image type="content" source="media/tutorial-deploy-environments-in-cicd-github/github-add-secret.png" alt-text="Screenshot of the Add secret box with the name AZURE CLIENT ID, the value set to an ID number, and add secret highlighted.":::

1. Select **Add secret**.

### 6.2 Create the Test environment

Return to the main environments page by selecting **Environments** in the left sidebar.

1. Select **New environment** and enter _Test_ for the environment name, then select **Configure environment**.

2. Under **Environment secrets**, select **Add Secret** and enter _AZURE_CLIENT_ID_ for **Name**.

3. For **Value**, enter the client ID (`appId`) for the **Test** Microsoft Entra app you created earlier (saved as the `$TEST_AZURE_CLIENT_ID` environment variable).

4. Select **Add secret**.

### 6.3 Create the Prod environment

Once more, return to the main environments page by selecting **Environments** in the left sidebar

1. Select **New environment** and enter _Prod_ for the environment name, then select **Configure environment**.

2. Under **Environment secrets**, select **Add Secret** and enter _AZURE_CLIENT_ID_ for **Name**.

3. For **Value**, enter the client ID (`appId`) for the **Prod** Microsoft Entra app you created earlier (saved as the `$PROD_AZURE_CLIENT_ID` environment variable).

4. Select **Add secret**.

Next, set yourself as a [required reviewer](https://docs.github.com/en/actions/managing-workflow-runs/reviewing-deployments) for this environment. When attempting to deploy to Prod, the GitHub Actions wait for an approval before starting. While a job is awaiting approval, it has a status of "Waiting". If a job isn't approved within 30 days, it automatically fails.

For more information about environments and required approvals, see "[Using environments for deployment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)."

1. Select **Required reviewers**.

2. Search for and select your GitHub user.  You can enter up to six people or teams. Only one of the required reviewers needs to approve the job for it to proceed.

3. Select **Save protection rules**.

Finally configure *main* as the deployment branch:

1. In the **Deployment branches dropdown**, choose **Selected branches**.

2. Select **Add deployment branch rule** and enter *main* for the **Branch name pattern**.

3. Select **Add rule**.

## 7. Test the CI/CD pipeline

In this section, you make some changes to the repository and test the CI/CD pipeline.
### 7.1 Clone the repository

1. In your terminal, cd into a folder where you'd like to clone your repository locally.

2. Clone the repository. Be sure to replace `< Organization/Repository >` in the following command with your GitHub organization and repository name.

    ```azurecli
    git clone https://github.com/< Organization/Repository >.git
    ```

3. Navigate into the cloned directory.

    ```azurecli
    cd Repository
    ```

4. Next, create a new branch and publish it remotely.

    ```azurecli
    git checkout -b feature1
    ```

    ```azurecli
    git push -u origin feature1
    ```

    A new environment is created in Azure specific to this branch.

5. Go to [GitHub](https://github.com) and navigate to the main page of your newly created repository.

6. Under your repository name, select **Actions**.

   You should see a new Create Environment workflow running.

### 7.2 Make a change to the code

1. Open the locally cloned repo in VS Code.

1. In the ADE.Tutorial folder, make a change to a file.

1. Save your change.

### 7.3 Push your changes to update the environment

1. Stage your changes and push to the `feature1` branch.

   ``` azurecli
   git add .
   git commit -m '<commit message>'
   git push
   ```

1. On your repository's **Actions** page, you see a new Update Environment workflow running.

### 7.4 Create a pull request

1. Create a pull request on GitHub.com `main <- feature1`.

1. On your repository's **Actions** page, you see a new workflow is started to create an environment specific to the PR using the Test environment type.

### 7.5 Merge the PR

1. On [GitHub](https://github.com), navigate to the pull request you created.

1. Merge the PR.

    Your changes are published into the production environment, and the branch and pull request environments are deleted.

## Clean up resources

[!INCLUDE [alt-delete-resource-group](includes/alt-delete-resource-group.md)]

## Next steps

- Learn more about managing your environments by using the CLI in [Create and access an environment by using the Azure CLI](how-to-create-access-environments.md).
- For complete command listings, refer to the [Microsoft Deployment Environments and Azure Deployment Environments Azure CLI documentation](https://aka.ms/CLI-reference).
