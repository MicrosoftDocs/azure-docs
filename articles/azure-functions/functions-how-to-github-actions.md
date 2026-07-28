---
title: Use GitHub Actions to make code updates in Azure Functions
description: Learn how to use GitHub Actions to define a workflow to build and deploy Azure Functions projects in GitHub.
ms.topic: how-to
ms.date: 07/28/2026
ms.custom: devx-track-csharp, github-actions-azure
zone_pivot_groups: github-actions-deployment-options
---

# Continuous delivery by using GitHub Actions

You can use a [GitHub Actions workflow](https://docs.github.com/actions/learn-github-actions/introduction-to-github-actions#the-components-of-github-actions) to automatically build and deploy your function code to Azure. This article supports these GitHub Actions-based deployment methods: 

| Method | Action | Tasks |
| ---- | ---- | ---- |
| Code-only | `Azure/functions-action` | 1. Set up the environment.<br/>2. Build the code project.<br/>3. Deploy the package to a function app in Azure. |
| Container | `Azure/functions-container-action` | 1. Set up the environment.<br/>2. Build the Docker container.<br/>3. Push the image to the container registry.<br/>4. Deploy the container to Azure. |

To deploy using GitHub Actions, you complete these three key steps:

1. [Create a user-assigned managed identity](#create-a-managed-identity-for-github-actions-deployment) in Azure with a federated credential that trusts your GitHub repository, and assign it the Website Contributor role on your function app.
1. Add the identity's client ID, tenant ID, and subscription ID as [repository variables](https://docs.github.com/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables) in GitHub.
1. Add a workflow YAML file to your repository that uses `azure/login` with OpenID Connect (OIDC) to authenticate, then calls `Azure/functions-action` to deploy.

## Authentication overview

GitHub Actions authenticates with Azure to deploy your code. The recommended method is OpenID Connect (OIDC), which uses workload identity federation with a user-assigned managed identity. With OIDC, no secrets are stored in GitHub — only non-sensitive configuration values (client ID, tenant ID, subscription ID) are stored as repository variables. The workflow requests a short-lived token from GitHub's OIDC provider, which Azure validates against the federated credential you configured.

Other supported methods (service principal secret and publish profile) require storing sensitive credentials in GitHub and are not recommended for new deployments. The following inline example shows the core OIDC authentication and deployment pattern used in all workflow templates:

```yml
permissions:
  id-token: write
  contents: read

steps:
  - name: 'Login via OIDC'
    uses: azure/login@v3
    with:
      client-id: ${{ vars.AZURE_CLIENT_ID }}
      tenant-id: ${{ vars.AZURE_TENANT_ID }}
      subscription-id: ${{ vars.AZURE_SUBSCRIPTION_ID }}

  - name: 'Deploy to Azure Functions'
    uses: Azure/functions-action@v1
    with:
      app-name: ${{ env.AZURE_FUNCTIONAPP_NAME }}
      package: ${{ env.AZURE_FUNCTIONAPP_PACKAGE_PATH }}
```

A YAML file (.yml) that defines the workflow configuration is maintained in the `/.github/workflows/` path in your repository. This definition contains the actions and parameters that make up the workflow, which is specific to the development language of your functions. 

You can create a workflow configuration file for your deployment manually. You can also generate the file from a set of language-specific templates in one of these ways:  

+ In the Azure portal
+ Using the Azure CLI
+ From your GitHub repository

If you don't want to create your YAML file by hand, select a different method at the top of the article.

## Prerequisites

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

+ A GitHub account. If you don't have one, sign up for [free](https://github.com/join).  

+ Project source code in a GitHub repository.

+ One of these deployment targets:

    + A working function app hosted on Azure. When using publish profile authentication, this function app must have [basic authentication enabled on the `scm` endpoint](./functions-continuous-deployment.md#enable-basic-authentication-for-deployments). Basic authentication isn't required when using OIDC.

    + An existing container registry, such as [Azure Container Registry](../container-registry/container-registry-get-started-azure-cli.md), a private container registry hosted in Azure. Examples in this article feature Azure Container Registry.   
::: zone pivot="method-cli,method-manual,method-template"
+ [Azure CLI](/cli/azure/install-azure-cli), when developing locally. You can also use the Azure CLI in Azure Cloud Shell.
::: zone-end
::: zone pivot="method-manual,method-template"

## <a name="generate-deployment-credentials"></a>Choose deployment credentials

Since GitHub Actions requires credentials to be able to access Azure resources, you first need to get the credentials you need from Azure and store them securely in your repository as [GitHub secrets](https://docs.github.com/en/actions/reference/encrypted-secrets). 

There are several supported authentication credentials you can use when deploying your code to Azure using GitHub Actions:

| Credential | Status | Set in... | Deployment type | Usage |
| ---- | ---- | ---- | --- | --- |
| OpenID Connect (OIDC) token | **Recommended** | [`Azure/login`](https://github.com/Azure/login) | Code-only<br/>Containers | Federated credentials create a trust relationship between your GitHub repository and a user-assigned managed identity in Microsoft Entra. No secrets are stored in GitHub. |
| Service principal secret | Not recommended | [`Azure/login`](https://github.com/Azure/login) | Code-only<br/>Containers | Requires you to manage and rotate a client secret in GitHub. |
| Publish profile | Not recommended | [`Azure/functions-action`](https://github.com/marketplace/actions/azure-functions-action) | Code-only | Uses basic authentication credentials to connect to the `scm` deployment endpoint. Requires [basic authentication to be enabled](./functions-continuous-deployment.md#enable-basic-authentication-for-deployments). |
| Docker credentials | Depends on registry | [`docker/login-action`](https://github.com/marketplace/actions/docker-login) | Container | Required when pushing to a private Docker container registry. For Azure Container Registry, you can use OIDC with a managed identity instead. |  

Authentication considerations:

+ OIDC is the most secure authentication method and is recommended for all new deployments. OIDC uses [workload identity federation](/entra/workload-id/workload-identity-federation) and only supports user-assigned managed identities.
+ When you enable a GitHub Actions-based deployment in the Azure portal, OIDC authentication is used by default.
+ With OIDC, the managed identity's client ID, tenant ID, and subscription ID are stored as GitHub repository **variables** (not secrets), since these values aren't sensitive.
+ Publish profile authentication requires [basic authentication to be enabled](./functions-continuous-deployment.md#enable-basic-authentication-for-deployments) on your function app's `scm` endpoint, which is a security concern.
+ Service principal authentication requires you to manage and manually rotate the client secret stored in GitHub.
+ You use Azure role-based access control (Azure RBAC) to limit access only to the Azure resources required for your deployment.
+ Unless otherwise noted, this article shows you how to configure a workflow that uses OIDC authentication.
+ When using the `Azure/functions-container-action` with a container registry other than Azure Container Registry, you also need to store those access credentials in your GitHub Actions secrets.

## Create a managed identity for GitHub Actions deployment

OpenID Connect (OIDC) is the recommended authentication method for GitHub Actions deployments to Azure Functions. With OIDC, you configure a user-assigned managed identity in Azure and create a trust relationship with your GitHub repository. The workflow can then authenticate with Azure without storing credentials as secrets.

1. Use the [az identity create](/cli/azure/identity#az-identity-create) command to create a user-assigned managed identity:

    ```azurecli
    az identity create --name myGitHubDeployIdentity --resource-group <RESOURCE_GROUP>
    ```

    Replace `<RESOURCE_GROUP>` with the name of your resource group.

1. From the output, copy the values for `clientId`, `subscriptionId` (from the `id` field), and `tenantId`. You need these values later.

1. Use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to assign the [`Website Contributor`](/azure/role-based-access-control/built-in-roles/web-and-mobile#website-contributor) role to the managed identity, scoped to your function app:

    ```azurecli
    IDENTITY_PRINCIPAL=$(az identity show --name myGitHubDeployIdentity --resource-group <RESOURCE_GROUP> --query 'principalId' -o tsv)
    FUNCTION_APP_ID=$(az functionapp show --name <APP_NAME> --resource-group <RESOURCE_GROUP> --query 'id' -o tsv)
    az role assignment create --assignee $IDENTITY_PRINCIPAL --role "Website Contributor" --scope $FUNCTION_APP_ID
    ```

    Replace `<APP_NAME>` and `<RESOURCE_GROUP>` with the names of your app and resource group, respectively.

1. Use the [az identity federated-credential create](/cli/azure/identity/federated-credential#az-identity-federated-credential-create) command to create a federated credential that trusts tokens from your GitHub repository:

    ```azurecli
    az identity federated-credential create \
        --identity-name myGitHubDeployIdentity \
        --resource-group <RESOURCE_GROUP> \
        --name github-deploy-credential \
        --issuer https://token.actions.githubusercontent.com \
        --subject repo:<GITHUB_ORG>/<REPO_NAME>:ref:refs/heads/<BRANCH_NAME> \
        --audiences api://AzureADTokenExchange
    ```

    Replace `<RESOURCE_GROUP>`, `<GITHUB_ORG>`, `<REPO_NAME>`, and `<BRANCH_NAME>` with your values. The subject must match the branch that triggers your workflow.

1. In your GitHub repository, [create these repository variables](https://docs.github.com/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#defining-configuration-variables-for-multiple-workflows) using the values from step 2:

    + `AZURE_CLIENT_ID`: the `clientId` of the managed identity
    + `AZURE_TENANT_ID`: the `tenantId` of the managed identity
    + `AZURE_SUBSCRIPTION_ID`: the subscription ID that contains your function app

1. (Optional) If you're deploying a container from Azure Container Registry, also assign the `acrpull` role to the managed identity:

    ```azurecli
    IDENTITY_PRINCIPAL=$(az identity show --name myGitHubDeployIdentity --resource-group <RESOURCE_GROUP> --query 'principalId' -o tsv)
    az role assignment create --assignee $IDENTITY_PRINCIPAL --role acrpull \
        --scope /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.ContainerRegistry/registries/<REGISTRY_NAME>
    ```

    Replace `<SUBSCRIPTION_ID>`, `<RESOURCE_GROUP>`, and `<REGISTRY_NAME>` with your values.
 
### [Docker credentials](#tab/docker-credentials)

You need to use registry-specific credentials when deploying a container from a private container registry. The way that you obtain this credential depends on the container registry. For more information, see [Docker Login Action](https://github.com/marketplace/actions/docker-login#usage).

For Azure Container Registry (ACR), you can instead use the same service principal credentials you use to deploy to Azure.

---

## Add credentials to GitHub secrets

1. In [GitHub](https://github.com/), go to your repository.

1. Go to **Settings**.

1. Select **Secrets and variables > Actions**.

1. Select **New repository secret**.

1. Define the secret, which depends on your chosen credential:

    ### [Publish profile](#tab/publish-profile)

    + **Name**: `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`
    + **Secret**: Paste the entire XML contents of the publish profile. 

    ### [Service principal secret](#tab/service-principal)
    
    + **Name**: `AZURE_CREDENTIALS`
    + **Secret**: Paste the entire JSON output you obtained when you created your service principal. 
    
    ### [Docker credentials](#tab/docker-credentials)
    
    + **Name**: `REGISTRY_USERNAME`
    + **Secret**: The username of your account in the private Docker registry. 
    + **Name**: `REGISTRY_PASSWORD`
    + **Secret**: The password for your account in the private Docker registry. 
    
    ---

1. Select **Add secret**.

GitHub can now authenticate with your Azure resources during deployment.
::: zone-end
::: zone pivot="method-manual"

## Create the workflow from a template

The best way to manually create a workflow configuration is to start from the officially supported template.

1. Choose either **Windows** or **Linux** to make sure that you get the template for the correct operating system.

    ### [Windows](#tab/windows)
    
    Deployments to Windows use `runs-on: windows-latest`. Containerized deployments require Linux.
    
    ### [Linux](#tab/linux)
    
    Deployments to Linux use `runs-on: ubuntu-latest`. Use Linux for containerized deployments.
    
    ---

1. Copy the language-specific template from the Azure Functions actions repository using the following link. These templates use the recommended OIDC authentication:

    ### [.NET](#tab/dotnet/windows)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/oidc-auth-samples/windows-dotnet-functionapp-on-azure-oidc.yml> 
    
    ### [.NET](#tab/dotnet/linux)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/oidc-auth-samples/linux-dotnet-functionapp-on-azure-oidc.yml>
    
    ### [Java](#tab/java/windows)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/oidc-auth-samples/windows-java-functionapp-on-azure-oidc.yml>
    
    ### [Java](#tab/java/linux)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/oidc-auth-samples/linux-java-functionapp-on-azure-oidc.yml>
    
    ### [JavaScript](#tab/javascript/windows)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/oidc-auth-samples/windows-node-functionapp-on-azure-oidc.yml> 
    
    ### [JavaScript](#tab/javascript/linux)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/oidc-auth-samples/linux-node-functionapp-on-azure-oidc.yml>
    
    ### [Python](#tab/python/windows)
    
    Python functions aren't supported on Windows. Choose Linux instead.
    
    ### [Python](#tab/python/linux)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/oidc-auth-samples/python-functionapp-on-azure-oidc.yml>
    
    ### [PowerShell](#tab/powershell/windows)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/oidc-auth-samples/powershell-functionapp-on-azure-oidc.yml>
    
    ### [PowerShell](#tab/powershell/linux)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/oidc-auth-samples/powershell-functionapp-on-azure-oidc.yml> 

    ### [Container](#tab/container/windows)
    
    Container deployments aren't supported on Windows. Choose Linux instead.
    
    ### [Container](#tab/container/linux)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/linux-container-functionapp-on-azure.yml> 

    > [!IMPORTANT]
    > For function apps hosted natively on Azure Container Apps, use the Container Apps deployment methods instead. See [Deploy to Azure Container Apps with GitHub Actions](/azure/container-apps/github-actions).

    Remember to do the following before you use this YAML file:
    
    + Update the values of `REGISTRY`, `NAMESPACE`, `IMAGE`, and `TAG` based on your container registry. 
    + Update the container repository credentials in the `docker/login-action` action.
    
    --- 

1. Update the `env.AZURE_FUNCTIONAPP_NAME` parameter with the name of your function app resource in Azure. You may optionally need to update the parameter that sets the language version used by your app, such as `DOTNET_VERSION` for C#.

1. The OIDC templates already include the `azure/login` step with OIDC authentication. Verify that the `vars.AZURE_CLIENT_ID`, `vars.AZURE_TENANT_ID`, and `vars.AZURE_SUBSCRIPTION_ID` references match the [repository variables you created](#create-a-managed-identity-for-github-actions-deployment).

1. Add this new YAML file in the `/.github/workflows/` path in your repository.

::: zone-end
::: zone pivot="method-portal"

## Create the workflow configuration in the portal

When you use the portal to enable GitHub Actions, Functions automatically performs these tasks, both in your Azure subscription and in your GitHub repository:

+ Creates a workflow file based on your application stack under `.github/workflows` and commits it to your GitHub repository.
+ Creates a user-assigned managed identity in your subscription and assigns it to the [Website Contributor role](/azure/role-based-access-control/built-in-roles/web-and-mobile#website-contributor) in your function app. 
+ Adds a federated credential to the new user-assigned managed identity, which GitHub uses when connecting during deployment. 
+ Adds the client ID, subscription ID, and tenant ID values of the new managed identity to the GitHub Actions secrets for your repository. The names of these secrets match the references in the workflow file.

### During function app create

You can get started quickly with GitHub Actions through the Deployment tab when you create a function in Azure portal. To add a GitHub Actions workflow when you create a new function app:

1. In the [Azure portal], select **Deployment** in the **Create Function App** flow.

    :::image type="content" source="media/functions-how-to-github-actions/github-actions-deployment.png" alt-text="Screenshot of Deployment option in Functions menu.":::

1. Enable **Continuous Deployment** if you want each code update to trigger a code push to Azure portal.

1. Enter your GitHub organization, repository, and branch.

    :::image type="content" source="media/functions-how-to-github-actions/github-actions-github-account-details.png" alt-text="Screenshot of GitHub user account details.":::

1. Complete configuring your function app. Your GitHub repository now includes a new workflow file in `/.github/workflows/`.

### For an existing function app

[!INCLUDE [functions-deploy-github-actions](../../includes/functions-deploy-github-actions.md)]

::: zone-end
::: zone pivot="method-cli"

## Add workflow configuration to your repository

You can use the [`az functionapp deployment github-actions add`](/cli/azure/functionapp/deployment/github-actions) command to generate a workflow configuration file from the correct template for your function app. The new YAML file is then stored in the correct location (`/.github/workflows/`) in the GitHub repository you provide, while the publish profile file for your app is added to GitHub secrets in the same repository.

> [!NOTE]
> This command currently configures publish profile authentication, which is not the recommended approach. For the recommended OIDC authentication, use the [manual workflow setup method](#create-the-workflow-from-a-template) instead.

1. Run this `az functionapp` command, replacing the values `githubUser/githubRepo`, `MyResourceGroup`, and `MyFunctionapp`:

    ```azurecli
    az functionapp deployment github-actions add --repo "githubUser/githubRepo" -g MyResourceGroup -n MyFunctionapp --login-with-github
    ```

    This command uses an interactive method to retrieve a personal access token for your GitHub account.

1. In your terminal window, you should see something like the following message:

    ```output
    Please navigate to https://github.com/login/device and enter the user code XXXX-XXXX to activate and retrieve your GitHub personal access token.
    ```  

1. Copy the unique `XXXX-XXXX` code, browse to <https://github.com/login/device>, and enter the code you copied. After entering your code, you should see something like the following message:

    ```output
    Verified GitHub repo and branch
    Getting workflow template using runtime: java
    Filling workflow template with name: func-app-123, branch: main, version: 8, slot: production, build_path: .
    Adding publish profile to GitHub
    Fetching publish profile with secrets for the app 'func-app-123'
    Creating new workflow file: .github/workflows/master_func-app-123.yml
    ```

1. Go to your GitHub repository and select **Actions**. Verify that your workflow ran.

::: zone-end
::: zone pivot="method-template"

## Create the workflow configuration file

You can create the GitHub Actions workflow configuration file from the Azure Functions templates directly from your GitHub repository.

1. In [GitHub](https://github.com/), go to your repository.

1. Select **Actions** and **New workflow**.

1. Search for *functions*.

    :::image type="content" source="media/functions-how-to-github-actions/github-actions-functions-templates.png" alt-text="Screenshot of search for GitHub Actions functions templates. ":::

1. In the displayed functions app workflows authored by Microsoft Azure, find the one that matches your code language and select **Configure**.

1. In the newly created YAML file, update the `env.AZURE_FUNCTIONAPP_NAME` parameter with the name of your function app resource in Azure. You may optionally need to update the parameter that sets the language version used by your app, such as `DOTNET_VERSION` for C#.  

1. The default templates might use publish profile authentication, which aren't recommended because they use shared secret keys. To use the recommended OIDC authentication instead, replace the `publish-profile` parameter in `azure/functions-action` with an `azure/login` step:

    ```yml
    - name: 'Login via OIDC'
      uses: azure/login@v3
      with:
        client-id: ${{ vars.AZURE_CLIENT_ID }}
        tenant-id: ${{ vars.AZURE_TENANT_ID }}
        subscription-id: ${{ vars.AZURE_SUBSCRIPTION_ID }}
    ```

    You also need to add `id-token: write` and `contents: read` permissions to the job. For the complete OIDC setup, see [Create a managed identity for GitHub Actions deployment](#create-a-managed-identity-for-github-actions-deployment).

1. Verify that the new workflow file is being saved in `/.github/workflows/` and select **Commit changes...**.  
::: zone-end

## Update a workflow configuration

If for some reason you need to update or change an existing workflow configuration, just navigate to the `/.github/workflows/` location in your repository, open the specific YAML file, make any needed changes, and then commit the updates to the repository.

## Example: workflow configuration file

The following template example uses the `functions-action` and OIDC for authentication. The template depends on your chosen language and the operating system on which your function app is deployed:

### [Windows](#tab/windows)

If your function app runs on Linux, select **Linux**.

### [Linux](#tab/linux)

If your function app runs on Windows, select **Windows**.

---

### [.NET](#tab/dotnet/windows)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/oidc-auth-samples/windows-dotnet-functionapp-on-azure-oidc.yml":::

### [.NET](#tab/dotnet/linux)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/oidc-auth-samples/linux-dotnet-functionapp-on-azure-oidc.yml":::

### [Java](#tab/java/windows)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/oidc-auth-samples/windows-java-functionapp-on-azure-oidc.yml":::

### [Java](#tab/java/linux)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/oidc-auth-samples/linux-java-functionapp-on-azure-oidc.yml":::

### [JavaScript](#tab/javascript/windows)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/oidc-auth-samples/windows-node-functionapp-on-azure-oidc.yml":::

### [JavaScript](#tab/javascript/linux)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/oidc-auth-samples/linux-node-functionapp-on-azure-oidc.yml":::

### [Python](#tab/python/windows)

Python functions aren't supported on Windows. Choose Linux instead.

### [Python](#tab/python/linux)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/oidc-auth-samples/python-functionapp-on-azure-oidc.yml":::

### [PowerShell](#tab/powershell/windows)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/oidc-auth-samples/powershell-functionapp-on-azure-oidc.yml":::

### [PowerShell](#tab/powershell/linux)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/oidc-auth-samples/powershell-functionapp-on-azure-oidc.yml":::

### [Container](#tab/container/windows)
    
Container deployments aren't supported on Windows. Choose Linux instead.

### [Container](#tab/container/linux)

> [!IMPORTANT]
> The `Azure/functions-container-action` deploys containers to function apps on Premium and Dedicated plans. For function apps hosted natively on Azure Container Apps, see [Deploy to Azure Container Apps with GitHub Actions](/azure/container-apps/github-actions).

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/linux-container-functionapp-on-azure.yml" range="9-57":::   

--- 

## Azure Functions action

The Azure Functions action (`Azure/functions-action`) defines how your code is published to an existing function app in Azure, or to a specific slot in your app. 

### Parameters

The following parameters are required for all function app plans:

|Parameter |Explanation  |
|--------- | --------- |
|_**app-name**_ | The name of your function app. |
|***package*** | This is the location in your project to be published. By default, this value is set to `.`, which means all files and folders in the GitHub repository will be deployed.|

The following parameters are required for the Flex Consumption plan:

|Parameter |Explanation  |
|---------|---------|
|_**sku**_ | Set this to `flexconsumption` when authenticating with publish-profile. When using RBAC credentials or deploying to a non-Flex Consumption plan, the Action can resolve the value, so the parameter doesn't need to be included. |
|_**remote-build**_ | Set this to `true` to enable a build action from Kudu when the package is deployed to a Flex Consumption app. Oryx build is always performed during a remote build in Flex Consumption; don't set **scm-do-build-during-deployment** or **enable-oryx-build**. By default, this parameter is set to `false`. |

The following parameters are specific to the Consumption, Elastic Premium, and App Service (Dedicated) plans:

|Parameter |Explanation  |
|--------- |--------- |
|_**scm-do-build-during-deployment**_ | (Optional) Allow the Kudu site (for example, `https://<APP_NAME>.scm.azurewebsites.net/`) to perform pre-deployment operations, such as [remote builds](functions-deployment-technologies.md#remote-build). By default, this is set to `false`. Set this to `true` when you do want to control deployment behaviors using Kudu instead of resolving dependencies in your GitHub workflow. For more information, see the [`SCM_DO_BUILD_DURING_DEPLOYMENT`](./functions-app-settings.md#scm_do_build_during_deployment) setting.|
|_**enable-oryx-build**_ | (Optional) Allow Kudu site to resolve your project dependencies with Oryx. By default, this is set to `false`. If you want to use [Oryx](https://github.com/Microsoft/Oryx) to resolve your dependencies instead of the GitHub Workflow, set both **scm-do-build-during-deployment** and **enable-oryx-build** to `true`.|

Optional parameters for all function app plans:

|Parameter | Explanation |
| --------- | --------- |
| ***slot-name*** | This is the [deployment slot](functions-deployment-slots.md) name to be deployed to. By default, this value is empty, which means the GitHub Action will deploy to your production site. When this setting points to a non-production slot, ensure the **publish-profile** parameter contains the credentials for the slot instead of the production site. _Currently not supported in Flex Consumption_. |
|***publish-profile*** | The name of the GitHub secret that contains your publish profile.|
| _**respect-pom-xml**_ | Used only for Java functions. Whether it's required for your app's deployment artifact to be derived from the pom.xml file. When deploying Java function apps, you should set this parameter to `true` and set `package` to `.`. By default, this parameter is set to `false`, which means that the `package` parameter must point to your app's artifact location, such as `./target/azure-functions/` |
| _**respect-funcignore**_ | Whether GitHub Actions honors your .funcignore file to exclude files and folders defined in it. Set this value to `true` when your repository has a .funcignore file and you want to use it exclude paths and files, such as text editor configurations, .vscode/, or a Python virtual environment (.venv/). The default setting is `false`. |

### Considerations

Keep the following considerations in mind when using the Azure Functions action:

+ When using GitHub Actions, the way that your code is deployed depends on your hosting plan, as shown in this table:

    | Hosting plan | Deployment method |
    | ---- | ----- |
    | [Flex Consumption](./flex-consumption-plan.md) | [One deploy](./functions-deployment-technologies.md#one-deploy) |
    | [Elastic Premium](./functions-premium-plan.md) | [Zip deploy](deployment-zip-push.md) |
    | [Dedicated (App Service)](./dedicated-plan.md) | [Zip deploy](deployment-zip-push.md) |
    | [Consumption](./consumption-plan.md) | Windows: [Zip deploy](deployment-zip-push.md)<br/>Linux: [external package URL](./functions-deployment-technologies.md#external-package-url)<sup>*</sup> |

    \* The ability to run your apps on Linux in a Consumption plan is planned for retirement. For more information, see [Azure Functions Consumption plan hosting](consumption-plan.md).

+ The credentials required by GitHub to connect to Azure for deployment are stored as variables or secrets in your GitHub repository and accessed in the deployment as `vars.<VARIABLE_NAME>` or `secrets.<SECRET_NAME>`.

+ OIDC with a user-assigned managed identity is the recommended way for GitHub Actions to authenticate with Azure Functions for deployment. You can also use a service principal or publish profile, but these methods are not recommended. To learn more, see [this GitHub Actions repository](https://github.com/Azure/functions-action).

+ The actions for setting up the environment and running a build are generated from the templates and are language specific.

+ The templates use `env` elements to define settings unique to your build and deployment.

## Next steps

- [Recover from a bad Flex Consumption plan deployment](functions-rollback-deployments.md)
- [Learn more about Azure and GitHub integration](/azure/developer/github/)

[Azure portal]: https://portal.azure.com
