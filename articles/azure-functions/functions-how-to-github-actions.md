---
title: Use GitHub Actions to make code updates in Azure Functions
description: Learn how to use GitHub Actions to define a workflow to build and deploy Azure Functions projects in GitHub.
ms.topic: how-to
ms.date: 03/02/2026
ms.custom: devx-track-csharp, github-actions-azure
zone_pivot_groups: github-actions-deployment-options
---

# Continuous delivery by using GitHub Actions

You can use a [GitHub Actions workflow](https://docs.github.com/actions/learn-github-actions/introduction-to-github-actions#the-components-of-github-actions) to automatically build and deploy your function code to Azure. This article supports these GitHub Actions-based deployment methods: 

| Method | Action | Tasks |
| ---- | ---- | ---- |
| Code-only | `Azure/functions-action` | 1. Set up the environment.<br/>2. Build the code project.<br/>3. Deploy the package to a function app in Azure.   |
| Container | `Azure/functions-container-action` | 1. Set up the environment.<br/>2. Build the Docker container.<br/>3. Push the image to the container registry.<br/>4. Deploy the container to Azure. | 

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

    + A working function app hosted on Azure. This function app must have [basic authentication enabled on the `scm` endpoint](./functions-continuous-deployment.md#enable-basic-authentication-for-deployments).

    + An existing container registry, such as [Azure Container Registry](../container-registry/container-registry-get-started-azure-cli.md), a private container registry hosted in Azure. Examples in this article feature Azure Container Registry.   
::: zone pivot="method-cli,method-manual,method-template"
+ [Azure CLI](/cli/azure/install-azure-cli), when developing locally. You can also use the Azure CLI in Azure Cloud Shell.
::: zone-end
::: zone pivot="method-manual,method-template"

## <a name="generate-deployment-credentials"></a>Choose deployment credentials

Since GitHub Actions requires credentials to be able to access Azure resources, you first need to get the credentials you need from Azure and store them securely in your repository as [GitHub secrets](https://docs.github.com/en/actions/reference/encrypted-secrets). 

There are several supported authentication credentials you can use when deploying your code to Azure using GitHub Actions:

| Credential | Set in... | Deployment type | Usage |
| ---- | ---- |  --- |  --- |
| OpenID Connect (OIDC) token | [`Azure/login`](https://github.com/Azure/login) | Code-only<br/>Containers | Federated credentials are used to create a trust relationship between your GitHub organization and Microsoft Entra. This trust is used to generate a tightly-scoped access token that is used in the deployment. | 
| Service principal secret |[`Azure/login`](https://github.com/Azure/login) | Code-only<br/>Containers | Using the [credentials of an Azure service principal](https://github.com/marketplace/actions/azure-login?version=v1.6.1#login-with-a-service-principal-secret) to perform identity-based authentication during deployment. |
| Publish profile | [`Azure/functions-action`](https://github.com/marketplace/actions/azure-functions-action) | Code-only | Use the basic authentication credentials in the publish profile to connect to the `scm` deployment endpoint. |
| Docker credentials | [`docker/login-action`](https://github.com/marketplace/actions/docker-login) | Container | When accessing a private Docker container registry. For an Azure Container Registry, you can also use an Azure service principal secret. |  

Authentication considerations:

+ When you enable a GitHub Actions-based deployment in the Azure portal, OIDC authentication is used in your GitHub Actions deployment. 
+ You must securely store the required credentials in GitHub secrets for use by GitHub Actions during deployment. 
+ You use Azure role-based access control (Azure RBAC) to limit access only to the Azure resources required for your specific.
+ Unless otherwise noted, this article shows you how to configure a workflow that uses OIDC authentication.
+ When using the `Azure/functions-container-action` with a container registry other than Azure Container Registry, you also need to store those access credentials in your GitHub Action secrets.

## Create a managed identity

GitHub Actions deployments use a user-assigned managed identity that has been granted deployment permissions in your function app. 

1. Use the [az identity create](/cli/azure/identity#az-identity-create) and [az functionapp identity assign](/cli/azure/functionapp/identity#az-functionapp-identity-assign) commands to create a user-assigned managed identity named `myGitHubDeployment` and assign it to your function app resource:

    ```azurecli
    IDENTITY_ID=$(az identity create --name myGitHubDeployIdentity --resource-group <RESOURCE_GROUP> --query 'id' -o tsv)
    az functionapp identity assign --name <APP_NAME> --resource-group <RESOURCE_GROUP> --identities $IDENTITY_ID
    ```

    Replace `<APP_NAME>` and `<RESOURCE_GROUP>` with the names of your app and resource group, respectively.

1. Use the [az resource update](/cli/azure/resource#az-resource-update) command to assign the managed identity to your function app.

    ```azurecli
    IDENTITY_ID=$(az identity show --name myUserAssignedIdentity --resource-group <RESOURCE_GROUP> --query 'id' -o tsv)
    RESOURCE_ID=$(az vm show --name myVM --resource-group myResourceGroup --query 'id' -o tsv)
    
    # Assign the managed identity to the Azure resource
    az resource update --ids $RESOURCE_ID --set identity.type=UserAssigned --set identity.userAssignedIdentities.$IDENTITY_ID={}
    ```

    Replace `<RESOURCE_GROUP>` with the names of your resource group.

1. If you are deploying a container from Azure Container Registry, you must also grant permissions in the registry to the identity. (Optional) To deploy a containerized function app from Azure Container Registry, use this [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to add the `acrpull` role to the new service principal:

    ```azurecli    
    az role assignment create --assignee <SERVICE_PRINCIPAL_ID> --scope /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.ContainerRegistry/registries/<REGISTRY_NAME> --role acrpull
    ```

    Replace `<SUBSCRIPTION_ID>`, `<RESOURCE_GROUP>`, and `<REGISTRY_NAME>` with the names of your subscription, resource group, and registry.Replace `<SERVICE_PRINCIPAL_ID>` with the `clientID` from the credentials you obtained in the previous step. The role you added is scoped to your specific Azure Container Registry instance.
 
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

1. Copy the language-specific template from the Azure Functions actions repository using the following link:  

    ### [.NET](#tab/dotnet/windows)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/windows-dotnet-functionapp-on-azure.yml> 
    
    ### [.NET](#tab/dotnet/linux)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/linux-dotnet-functionapp-on-azure.yml>
    
    ### [Java](#tab/java/windows)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/windows-java-functionapp-on-azure.yml>
    
    ### [Java](#tab/java/linux)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/linux-java-functionapp-on-azure.yml>
    
    ### [JavaScript](#tab/javascript/windows)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/windows-node.js-functionapp-on-azure.yml> 
    
    ### [JavaScript](#tab/javascript/linux)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/linux-node.js-functionapp-on-azure.yml>
    
    ### [Python](#tab/python/windows)
    
    Python functions aren't supported on Windows. Choose Linux instead.
    
    ### [Python](#tab/python/linux)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/linux-python-functionapp-on-azure.yml>
    
    ### [PowerShell](#tab/powershell/windows)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/windows-powershell-functionapp-on-azure.yml>
    
    ### [PowerShell](#tab/powershell/linux)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/linux-powershell-functionapp-on-azure.yml> 

    ### [Container](#tab/container/windows)
    
    Container deployments aren't supported on Windows. Choose Linux instead.
    
    ### [Container](#tab/container/linux)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/linux-container-functionapp-on-azure.yml> 

    Remember to do the following before you use this YAML file:
    
    + Update the values of `REGISTRY`, `NAMESPACE`, `IMAGE`, and `TAG` based on your container registry. 
    + Update the container respository credentials in the `docker/login-action` action. To use service principal credentials with Azure Container Registry, add an environment variable for the credentials object to your file:
    
        ```yml
        - env: 
            creds: ${{ secrets.AZURE_CREDENTIALS }}
        ```
    
        Then replace the existing `azure/docker-Login` action with this `docker/login-action`:

        ```yml
        - name: Login to ACR
          uses: docker/login-action@v3
          with:
            registry: <registry-name>.azurecr.io
            username: ${{ fromJson(creds.clientId) }}
            password: ${{ fromJson(creds.clientSecret) }}
        ```
    --- 

1. Update the `env.AZURE_FUNCTIONAPP_NAME` parameter with the name of your function app resource in Azure. You may optionally need to update the parameter that sets the language version used by your app, such as `DOTNET_VERSION` for C#. 
 
1. To connect to your app using service principal credentials instead of a publish profile, remove `publish-profile` from the `azure/functions-action` and add this `azure/login` action before `azure/functions-action`:

    ```yml
    - name: 'Login w/ service principal'
      uses: azure/login@v2
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}

    ---

1. Update the `env.AZURE_FUNCTIONAPP_NAME` parameter with the name of your function app resource in Azure. You may optionally need to update the parameter that sets the language version used by your app, such as `DOTNET_VERSION` for C#.

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

1. To use service principal credentials instead of a publish profile, remove `publish-profile` from the `azure/functions-action` and add this `azure/login` action before `azure/functions-action`:

    ```yml
    - name: 'Login w/ service principal'
      uses: azure/login@v2
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}

1. Verify that the new workflow file is being saved in `/.github/workflows/` and select **Commit changes...**.  
::: zone-end

## Update a workflow configuration

If for some reason you need to update or change an existing workflow configuration, just navigate to the `/.github/workflows/` location in your repository, open the specific YAML file, make any needed changes, and then commit the updates to the repository.

## Example: workflow configuration file

The following template example uses version 1 of the `functions-action` and a `publish profile` for authentication. The template depends on your chosen language and the operating system on which your function app is deployed:

### [Windows](#tab/windows)

If your function app runs on Linux, select **Linux**.

### [Linux](#tab/linux)

If your function app runs on Windows, select **Windows**.

---

### [.NET](#tab/dotnet/windows)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/windows-dotnet-functionapp-on-azure.yml" range="1-5,13-44":::

### [.NET](#tab/dotnet/linux)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/linux-dotnet-functionapp-on-azure.yml" range="1-5,13-44":::

### [Java](#tab/java/windows)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/windows-java-functionapp-on-azure.yml" range="1-5,13-45":::

### [Java](#tab/java/linux)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/linux-java-functionapp-on-azure.yml" range="1-5,13-45":::

### [JavaScript](#tab/javascript/windows)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/windows-node.js-functionapp-on-azure.yml" range="1-5,13-46":::

### [JavaScript](#tab/javascript/linux)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/linux-node.js-functionapp-on-azure.yml" range="1-5,13-46":::

### [Python](#tab/python/windows)

Python functions aren't supported on Windows. Choose Linux instead.

### [Python](#tab/python/linux)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/linux-python-functionapp-on-azure.yml" range="1-5,13-47":::

### [PowerShell](#tab/powershell/windows)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/windows-powershell-functionapp-on-azure.yml" range="1-5,13-31":::

### [PowerShell](#tab/powershell/linux)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/linux-powershell-functionapp-on-azure.yml" range="1-5,13-31":::

### [Container](#tab/container/windows)
    
Container deployments aren't supported on Windows. Choose Linux instead.

### [Container](#tab/container/linux)
  
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
    | [Elastic Premium](./functions-premium-plan.md) | [Zip deploy](deployment-zip-push.md) to apps on the [Consumption](./consumption-plan.md) |
    | [Dedicated (App Service)](./dedicated-plan.md) | [Zip deploy](deployment-zip-push.md) to apps on the [Consumption](./consumption-plan.md) |
    | [Consumption](./consumption-plan.md) | Windows: [Zip deploy](deployment-zip-push.md)<br/>Linux: [external package URL](./functions-deployment-technologies.md#external-package-url)<sup>*</sup> |

    \* The ability to run your apps on Linux in a Consumption plan is planned for retirement. For more information, see [Azure Functions Consumption plan hosting](consumption-plan.md).

+ The credentials required by GitHub to connect to Azure for deployment are stored as Secrets in your GitHub repository and accessed in the deployment as `secrets.<SECRET_NAME>`.

+ The easiest way for GitHub Actions to authenticate with Azure Functions for deployment is by using a publish profile. You can also authenticate using a service principal. To learn more, see [this GitHub Actions repository](https://github.com/Azure/functions-action).

+ The actions for setting up the environment and running a build are generated from the templates and are language specific.

+ The templates use `env` elements to define settings unique to your build and deployment.

## Next steps

- [Recover from a bad Flex Consumption plan deployment](functions-rollback-deployments.md)
- [Learn more about Azure and GitHub integration](/azure/developer/github/)

[Azure portal]: https://portal.azure.com
