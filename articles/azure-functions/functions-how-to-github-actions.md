---
title: Use GitHub Actions to make code updates in Azure Functions
description: Learn how to use GitHub Actions to define a workflow to build and deploy Azure Functions projects in GitHub.
ms.topic: conceptual
ms.date: 09/27/2024
ms.custom: devx-track-csharp, github-actions-azure
zone_pivot_groups: github-actions-deployment-options
---

# Continuous delivery by using GitHub Actions

You can use a [GitHub Actions workflow](https://docs.github.com/actions/learn-github-actions/introduction-to-github-actions#the-components-of-github-actions) to define a workflow to automatically build and deploy code to your function app in Azure Functions. 

A YAML file (.yml) that defines the workflow configuration is maintained in the `/.github/workflows/` path in your repository. This definition contains the actions and parameters that make up the workflow, which is specific to the development language of your functions. A GitHub Actions workflow for Functions performs the following tasks, regardless of language: 

1. Set up the environment.
1. Build the code project.
1. Deploy the package to a function app in Azure.

The Azure Functions action handles the deployment to an existing function app in Azure. 

You can create a workflow configuration file for your deployment manually. You can also generate the file from a set of language-specific templates in one of these ways:  

+ In the Azure portal
+ Using the Azure CLI   
+ From your GitHub repository 

If you don't want to create your YAML file by hand, select a different method at the top of the article.

## Prerequisites

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

+ A GitHub account. If you don't have one, sign up for [free](https://github.com/join).  

+ A working function app hosted on Azure with source code in a GitHub repository. 
:::zone pivot="method-cli"
+ [Azure CLI](/cli/azure/install-azure-cli), when developing locally. You can also use the Azure CLI in Azure Cloud Shell.
:::zone-end
::: zone pivot="method-manual,method-template"

## Generate deployment credentials

Since GitHub Actions uses your publish profile to access your function app during deployment, you first need to get your publish profile and store it securely as a [GitHub secret](https://docs.github.com/en/actions/reference/encrypted-secrets).  

>[!IMPORTANT]
>The publish profile is a valuable credential that allows access to Azure resources. Make sure you always transport and store it securely. In GitHub, the publish profile must only be stored in GitHub secrets.

### Download your publish profile

[!INCLUDE [functions-download-publish-profile](../../includes/functions-download-publish-profile.md)]

### Add the GitHub secret

1. In [GitHub](https://github.com/), go to your repository.

1. Go to **Settings**. 

1. Select **Secrets and variables > Actions**.

1. Select **New repository secret**.

1. Add a new secret with the name `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` and the value set to the contents of the publishing profile file.

1. Select **Add secret**.

GitHub can now authenticate to your function app in Azure.
::: zone-end
::: zone pivot="method-manual"

## Create the workflow from a template

The best way to manually create a workflow configuration is to start from the officially supported template. 

1. Choose either **Windows** or **Linux** to make sure that you get the template for the correct operating system.

    # [Windows](#tab/windows)
    
    Deployments to Windows use `runs-on: windows-latest`.
    
    # [Linux](#tab/linux)
    
    Deployments to Linux use `runs-on: ubuntu-latest`.
    
    ---

1. Copy the language-specific template from the Azure Functions actions repository using the following link:  

    # [.NET](#tab/dotnet/windows)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/windows-dotnet-functionapp-on-azure.yml> 
    
    # [.NET](#tab/dotnet/linux)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/linux-dotnet-functionapp-on-azure.yml>
    
    # [Java](#tab/java/windows)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/windows-java-functionapp-on-azure.yml>
    
    # [Java](#tab/java/linux)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/linux-java-functionapp-on-azure.yml>
    
    # [JavaScript](#tab/javascript/windows)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/windows-node.js-functionapp-on-azure.yml> 
    
    # [JavaScript](#tab/javascript/linux)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/linux-node.js-functionapp-on-azure.yml>
    
    # [Python](#tab/python/windows)
    
    Python functions aren't supported on Windows. Choose Linux instead.
    
    # [Python](#tab/python/linux)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/linux-python-functionapp-on-azure.yml>
    
    # [PowerShell](#tab/powershell/windows)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/windows-powershell-functionapp-on-azure.yml>
    
    # [PowerShell](#tab/powershell/linux)
    
    <https://github.com/Azure/actions-workflow-samples/blob/master/FunctionApp/linux-powershell-functionapp-on-azure.yml> 
    
    --- 

1. Update the `env.AZURE_FUNCTIONAPP_NAME` parameter with the name of your function app resource in Azure. You may optionally need to update the parameter that sets the language version used by your app, such as `DOTNET_VERSION` for C#. 

1. Add this new YAML file in the `/.github/workflows/` path in your repository. 

::: zone-end
::: zone pivot="method-portal"

## Create the workflow configuration in the portal

When you use the portal to enable GitHub Actions, Functions creates a workflow file based on your application stack and commits it to your GitHub repository in the correct directory.

The portal automatically gets your publish profile and adds it to the GitHub secrets for your repository.

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

1. Verify that the new workflow file is being saved in `/.github/workflows/` and select **Commit changes...**.  
::: zone-end

## Update a workflow configuration

If for some reason, you need to update or change an existing workflow configuration, just navigate to the `/.github/workflows/` location in your repository, open the specific YAML file, make any needed changes, and then commit the updates to the repository.

## Example: workflow configuration file

The following template example uses version 1 of the `functions-action` and a `publish profile` for authentication. The template depends on your chosen language and the operating system on which your function app is deployed:

# [Windows](#tab/windows)

If your function app runs on Linux, select **Linux**.

# [Linux](#tab/linux)

If your function app runs on Windows, select **Windows**.

---

# [.NET](#tab/dotnet/windows)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/windows-dotnet-functionapp-on-azure.yml" range="1-5,13-44"::: 

# [.NET](#tab/dotnet/linux)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/linux-dotnet-functionapp-on-azure.yml" range="1-5,13-44"::: 

# [Java](#tab/java/windows)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/windows-java-functionapp-on-azure.yml" range="1-5,13-45"::: 

# [Java](#tab/java/linux)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/linux-java-functionapp-on-azure.yml" range="1-5,13-45"::: 

# [JavaScript](#tab/javascript/windows)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/windows-node.js-functionapp-on-azure.yml" range="1-5,13-46"::: 

# [JavaScript](#tab/javascript/linux)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/linux-node.js-functionapp-on-azure.yml" range="1-5,13-46"::: 

# [Python](#tab/python/windows)

Python functions aren't supported on Windows. Choose Linux instead.

# [Python](#tab/python/linux)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/linux-python-functionapp-on-azure.yml" range="1-5,13-47"::: 

# [PowerShell](#tab/powershell/windows)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/windows-powershell-functionapp-on-azure.yml" range="1-5,13-31"::: 

# [PowerShell](#tab/powershell/linux)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/linux-powershell-functionapp-on-azure.yml" range="1-5,13-31"::: 

--- 

## Azure Functions action

The Azure Functions action (`Azure/azure-functions`) defines how your code is published to an existing function app in Azure, or to a specific slot in your app. 

### Parameters

The following parameters are required for all function app plans:

|Parameter |Explanation  |
|---------|---------|
|_**app-name**_ | The name of your function app. |
|***package*** | This is the location in your project to be published. By default, this value is set to `.`, which means all files and folders in the GitHub repository will be deployed.|

The following parameters are required for the Flex Consumption plan:

|Parameter |Explanation  |
|---------|---------|
|_**sku**_ | Set this to `flexconsumption` when authenticating with publish-profile. When using RBAC credentials or deploying to a non-Flex Consumption plan, the Action can resolve the value, so the parameter does not need to be included. |
|_**remote-build**_ | Set this to `true` to enable a build action from Kudu when the package is deployed to a Flex Consumption app. Oryx build is always performed during a remote build in Flex Consumption; do not set **scm-do-build-during-deployment** or **enable-oryx-build**. By default, this parameter is set to `false`. |

The following parameters are specific to the Consumption, Elastic Premium, and App Service (Dedicated) plans:

|Parameter |Explanation  |
|---------|---------|
|_**scm-do-build-during-deployment**_ | (Optional) Allow the Kudu site (e.g. `https://<APP_NAME>.scm.azurewebsites.net/`) to perform pre-deployment operations, such as [remote builds](functions-deployment-technologies.md#remote-build). By default, this is set to `false`. Set this to `true` when you do want to control deployment behaviors using Kudu instead of resolving dependencies in your GitHub workflow. For more information, see the [`SCM_DO_BUILD_DURING_DEPLOYMENT`](./functions-app-settings.md#scm_do_build_during_deployment) setting.|
|_**enable-oryx-build**_ | (Optional) Allow Kudu site to resolve your project dependencies with Oryx. By default, this is set to `false`. If you want to use [Oryx](https://github.com/Microsoft/Oryx) to resolve your dependencies instead of the GitHub Workflow, set both **scm-do-build-during-deployment** and **enable-oryx-build** to `true`.|

Optional parameters for all function app plans:

|Parameter |Explanation  |
|---------|---------|
| ***slot-name*** | This is the [deployment slot](functions-deployment-slots.md) name to be deployed to. By default, this value is empty, which means the GitHub Action will deploy to your production site. When this setting points to a non-production slot, please ensure the **publish-profile** parameter contains the credentials for the slot instead of the production site. _Currently not supported in Flex Consumption_. |
|***publish-profile*** | The name of the GitHub secret that contains your publish profile.|
| _**respect-pom-xml**_ | Used only for Java functions. Whether it's required for your app's deployment artifact to be derived from the pom.xml file. When deploying Java function apps, you should set this parameter to `true` and set `package` to `.`. By default, this parameter is set to `false`, which means that the `package` parameter must point to your app's artifact location, such as `./target/azure-functions/` |
| _**respect-funcignore**_ | Whether GitHub Actions honors your .funcignore file to exclude files and folders defined in it. Set this value to `true` when your repository has a .funcignore file and you want to use it exclude paths and files, such as text editor configurations, .vscode/, or a Python virtual environment (.venv/). The default setting is `false`. |

### Considerations

Keep the following considerations in mind when using the Azure Functions action: 

+ When using GitHub Actions, the code is deployed using [one deploy](./functions-deployment-technologies.md#one-deploy) to apps on the [Flex Consumption](./flex-consumption-plan.md) plan and [zip deploy](deployment-zip-push.md) to apps on the [Consumption](./consumption-plan.md), [Elastic Premium](./functions-premium-plan.md), and [Dedicated (App Service)](./dedicated-plan.md) plans. The exception is Linux Consumption, where [external package URL](./functions-deployment-technologies.md#external-package-url) is used.

+ The credentials required by GitHub to connection to Azure for deployment are stored as Secrets in your GitHub repository and accessed in the deployment as `secrets.<SECRET_NAME>`.

+ The easiest way for GitHub Actions to authenticate with Azure Functions for deployment is by using a publish profile. You can also authenticate using a service principal. To learn more, see [this GitHub Actions repository](https://github.com/Azure/functions-action). 

+ The actions for setting up the environment and running a build are generated from the templates, and are language specific.

+ The templates use `env` elements to define settings unique to your build and deployment.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure and GitHub integration](/azure/developer/github/)

[Azure portal]: https://portal.azure.com
