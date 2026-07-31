---
title: Deploy to Azure Functions by using GitHub Actions
description: Set up continuous deployment for your Azure Functions app by using GitHub Actions with OpenID Connect (OIDC) authentication.
ms.topic: how-to
ms.date: 07/30/2026
ms.custom: devx-track-csharp, github-actions-azure
zone_pivot_groups: github-actions-deployment-options
---

# Deploy to Azure Functions by using GitHub Actions

You can use a [GitHub Actions workflow](https://docs.github.com/actions/learn-github-actions/introduction-to-github-actions#the-components-of-github-actions) to automatically build and deploy your function code to Azure by using the [`Azure/functions-action`](https://github.com/Azure/functions-action).

To deploy by using GitHub Actions, complete these three key steps:

1. [Create a user-assigned managed identity](#create-a-managed-identity-for-github-actions-deployment) in Azure with a federated credential that trusts your GitHub repository, and assign it the Website Contributor role on your function app.
1. Add the identity's client ID, tenant ID, and subscription ID as [repository secrets](https://docs.github.com/actions/security-guides/using-secrets-in-github-actions) in GitHub.
1. Add a workflow YAML file to your repository that uses `azure/login` with OpenID Connect (OIDC) to authenticate, then calls [`Azure/functions-action`] to deploy.

::: zone pivot="method-portal" 
When you [use the Azure portal](./functions-how-to-github-actions.md?pivots=method-portal) to enable GitHub Actions, Functions automatically performs these tasks, both in your Azure subscription and in your GitHub repository.
::: zone-end

## Create a workflow configuration for Azure Functions

You maintain a YAML file (.yml) that defines the workflow configuration in the `/.github/workflows/` path in your repository. This definition contains the actions and parameters that make up the workflow, which is specific to the development language of your functions.

Choose a method for creating your workflow file using the selector at the top of the article:

| Method | Best for | OIDC support |
| ---- | ---- | ---- |
| **Workflow template** | Full control: copy an OIDC-ready template and customize it | Requires configuration |
| **Azure portal** | Easiest setup: portal can create the identity, credentials, and workflow file for you | Configured for you |
| **GitHub marketplace** | GitHub-first: start from GitHub's built-in marketplace templates | Requires configuration and template modification |

## Authentication overview

GitHub Actions must authenticate with Azure to deploy your code. This article uses OpenID Connect (OIDC), which is the recommended authentication method. OIDC uses federated credentials to create a trust relationship between your GitHub repository and a user-assigned managed identity in Microsoft Entra. No secrets are stored in GitHub.

### OIDC authentication example

The following inline example shows the core OIDC authentication and deployment pattern used in all workflow templates:

```yml
permissions:
  id-token: write
  contents: read

steps:
  - name: 'Login via OIDC'
    uses: azure/login@v3
    with:
      client-id: ${{ secrets.AZURE_CLIENT_ID }}
      tenant-id: ${{ secrets.AZURE_TENANT_ID }}
      subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

  - name: 'Deploy to Azure Functions'
    uses: Azure/functions-action@v1
    with:
      app-name: ${{ env.AZURE_FUNCTIONAPP_NAME }}
      package: ${{ env.AZURE_FUNCTIONAPP_PACKAGE_PATH }}
```

### GitHub Actions OIDC authentication considerations

+ OIDC uses [workload identity federation](/entra/workload-id/workload-identity-federation) and only supports user-assigned managed identities.
+ When you enable a GitHub Actions-based deployment in the Azure portal, OIDC authentication is used by default.
+ With OIDC, the managed identity's client ID, tenant ID, and subscription ID are stored as GitHub repository **secrets**.
+ Use Azure role-based access control (Azure RBAC) to limit access only to the Azure resources required for your deployment.

## Prerequisites

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

+ A GitHub account. If you don't have one, sign up for [free](https://github.com/join).  

+ Project source code in a GitHub repository.

+ A basic understanding of GitHub Actions workflows. If you're new to GitHub Actions, see [Understanding GitHub Actions](https://docs.github.com/actions/about-github-actions/understanding-github-actions).

+ A working function app hosted on Azure (code-only or container-based).

+ (Container deployments only) An existing container registry, such as [Azure Container Registry](/azure/container-registry/container-registry-get-started-azure-cli).   
::: zone pivot="method-manual,method-template"
+ [Azure CLI](/cli/azure/install-azure-cli), when developing locally. You can also use the Azure CLI in Azure Cloud Shell.
::: zone-end
::: zone pivot="method-manual,method-template"

## Create a managed identity for GitHub Actions deployment

OpenID Connect (OIDC) is the recommended authentication method for GitHub Actions deployments to Azure Functions. With OIDC, you configure a user-assigned managed identity in Azure and create a trust relationship with your GitHub repository. The workflow can then authenticate with Azure without storing credentials as secrets.

1. Use the [az identity create](/cli/azure/identity#az-identity-create) command to create a user-assigned managed identity:

    ```azurecli
    az identity create --name myGitHubDeployIdentity --resource-group <RESOURCE_GROUP> \
    --query "{clientId: clientId, tenantId: tenantId}" -o table
    ```

    Replace `<RESOURCE_GROUP>` with the name of your resource group.

1. From the output, note the `clientId` and `tenantId` values. Also get your subscription ID:

    ```azurecli
    az account show --query "{subId: id}" -o table
    ```

    You need these three values later when you [add credentials to GitHub](#add-credentials-to-github).

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

1. (Optional) If you're deploying a container from Azure Container Registry, also assign the `acrpull` role to the managed identity:

    ```azurecli
    IDENTITY_PRINCIPAL=$(az identity show --name myGitHubDeployIdentity --resource-group <RESOURCE_GROUP> --query 'principalId' -o tsv)
    az role assignment create --assignee $IDENTITY_PRINCIPAL --role acrpull \
        --scope /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.ContainerRegistry/registries/<REGISTRY_NAME>
    ```

    Replace `<SUBSCRIPTION_ID>`, `<RESOURCE_GROUP>`, and `<REGISTRY_NAME>` with your values.

## Add credentials to GitHub

Use the values you copied when you [created the managed identity](#create-a-managed-identity-for-github-actions-deployment).

1. In [GitHub](https://github.com/), go to your repository.

1. Go to **Settings** > **Secrets and variables** > **Actions**.

1. On the **Secrets** tab, select **New repository secret**.

1. Create each of the following secrets:

    | Name | Value |
    | ---- | ----- |
    | `AZURE_CLIENT_ID` | The `clientId` of the managed identity |
    | `AZURE_TENANT_ID` | The `tenantId` of the managed identity |
    | `AZURE_SUBSCRIPTION_ID` | The subscription ID that contains your function app |

For container deployments from a private registry, you also need registry-specific secrets. For more information, see [Docker Login Action](https://github.com/marketplace/actions/docker-login#usage).

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

1. Copy the language-specific template from the Azure Functions actions repository by using the following link. These templates use the recommended OIDC authentication:

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
    > For new container-based function app deployments, use the native Azure Container Apps hosting model. See [Deploy to Azure Container Apps with GitHub Actions](/azure/container-apps/github-actions). The `Azure/functions-container-action` shown here deploys container images to existing function app resources in Azure.

    Before you use this YAML file, complete the following steps:
    
    + Update the values of `REGISTRY`, `NAMESPACE`, `IMAGE`, and `TAG` based on your container registry. 
    + Update the container repository credentials in the `docker/login-action` action.
    
    --- 

1. Update the `env.AZURE_FUNCTIONAPP_NAME` parameter with the name of your function app resource in Azure. You might also need to update the parameter that sets the language version used by your app, such as `DOTNET_VERSION` for C#.

1. The OIDC templates already include the `azure/login` step with OIDC authentication. Verify that the `secrets.AZURE_CLIENT_ID`, `secrets.AZURE_TENANT_ID`, and `secrets.AZURE_SUBSCRIPTION_ID` references match the [repository secrets you created](#add-credentials-to-github).

1. Add this new YAML file in the `/.github/workflows/` path in your repository.

::: zone-end
::: zone pivot="method-portal"

## Create the workflow configuration in the portal

When you use the portal to enable GitHub Actions, Functions handles all the setup automatically. You don't need to manually create a managed identity, configure credentials, or write a workflow file. Functions performs these tasks for you:

In your **Azure subscription**:

+ Creates a user-assigned managed identity and assigns it the [Website Contributor role](/azure/role-based-access-control/built-in-roles/web-and-mobile#website-contributor) on your function app.
+ Adds a federated credential to the managed identity for GitHub OIDC authentication.

In your **GitHub repository**:

+ Adds the client ID, subscription ID, and tenant ID values as GitHub Actions secrets.
+ Creates a workflow file based on your application stack and commits it to `.github/workflows`.

### During function app create

You can get started quickly with GitHub Actions through the Deployment tab when you create a function in Azure portal. To add a GitHub Actions workflow when you create a new function app:

1. In the [Azure portal], select **Deployment** in the **Create Function App** flow.

1. Enable **Continuous Deployment** if you want each code update to trigger a code push to Azure portal.

1. Under **GitHub settings**, select **Authorize** to connect your GitHub account. Sign in with the GitHub account that has write access to your repository.

1. Enter your GitHub organization, repository, and branch. 

1. Optionally, select **Preview file** to view how the workflow file looks before it gets generated and added to your repository. 

1. Complete configuring your function app. Your GitHub repository now includes a new workflow file in `/.github/workflows/`.

### For an existing function app

[!INCLUDE [functions-deploy-github-actions](../../includes/functions-deploy-github-actions.md)]

::: zone-end
::: zone pivot="method-template"

## Create the workflow configuration file

You can create the GitHub Actions workflow configuration file from the Azure Functions templates directly from your GitHub repository.

1. In [GitHub](https://github.com/), go to your repository.

1. Select **Actions** and **New workflow**.

1. Search for *functions*.

    :::image type="content" source="media/functions-how-to-github-actions/github-actions-functions-templates.png" alt-text="Screenshot of search for GitHub Actions functions templates. ":::

1. In the displayed functions app workflows authored by Microsoft Azure, find the one that matches your code language and select **Configure**.

1. In the newly created YAML file, update the `env.AZURE_FUNCTIONAPP_NAME` parameter with the name of your function app resource in Azure. You might also need to update the parameter that sets the language version used by your app, such as `DOTNET_VERSION` for C# or `PYTHON_VERSION` for Python apps.  

1. The default templates might use publish profile authentication instead of the recommended OIDC. To switch to OIDC and align with portal behaviors, make the following changes:

    + Remove the `publish-profile`, `scm-do-build-during-deployment`, and `enable-oryx-build` parameters from [`Azure/functions-action`].
    + Remove the `environment` setting from the job (if present), since the federated credential subject must match the branch trigger.
    + Add an `azure/login` step before the [`Azure/functions-action`] step:

      ```yml
      - name: 'Login via OIDC'
        uses: azure/login@v3
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: 'Run Azure Functions Action'
        uses: Azure/functions-action@v1
        with:
          app-name: ${{ env.AZURE_FUNCTIONAPP_NAME }}
          package: ${{ env.AZURE_FUNCTIONAPP_PACKAGE_PATH }}
      ```

    + Add the following permissions to the job:

      ```yml
      permissions:
        id-token: write
        contents: read
      ```

1. Verify that the new workflow file is saved with an appropriate name in `/.github/workflows/` and select **Commit changes**.  
::: zone-end

## Example: workflow configuration file

The following examples show the complete OIDC workflow files for reference. Choose the template that matches your language and operating system:

### [Windows](#tab/windows)

Windows deployments use `runs-on: windows-latest` in the workflow. The [`Azure/functions-action`] uses [zip deploy][Zip deploy] on Windows for all plans except Flex Consumption (which uses one deploy).

### [Linux](#tab/linux)

Linux deployments use `runs-on: ubuntu-latest` in the workflow. On the Consumption plan, Linux uses an external package URL for deployment. Container deployments require Linux.

---

### [.NET](#tab/dotnet/windows)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/oidc-auth-samples/windows-dotnet-functionapp-on-azure-oidc.yml" range="24-91":::

### [.NET](#tab/dotnet/linux)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/oidc-auth-samples/linux-dotnet-functionapp-on-azure-oidc.yml" range="24-91":::

### [Java](#tab/java/windows)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/oidc-auth-samples/windows-java-functionapp-on-azure-oidc.yml" range="22-90":::

### [Java](#tab/java/linux)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/oidc-auth-samples/linux-java-functionapp-on-azure-oidc.yml" range="22-90":::

### [JavaScript](#tab/javascript/windows)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/oidc-auth-samples/windows-node-functionapp-on-azure-oidc.yml" range="22-95":::

### [JavaScript](#tab/javascript/linux)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/oidc-auth-samples/linux-node-functionapp-on-azure-oidc.yml" range="22-95":::

### [Python](#tab/python/windows)

Python functions aren't supported on Windows. Choose Linux instead.

### [Python](#tab/python/linux)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/oidc-auth-samples/python-functionapp-on-azure-oidc.yml" range="22-88":::

### [PowerShell](#tab/powershell/windows)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/oidc-auth-samples/powershell-functionapp-on-azure-oidc.yml" range="22-57":::

### [PowerShell](#tab/powershell/linux)

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/oidc-auth-samples/powershell-functionapp-on-azure-oidc.yml" range="22-57":::

### [Container](#tab/container/windows)
    
Container deployments aren't supported on Windows. Choose Linux instead.

### [Container](#tab/container/linux)

> [!IMPORTANT]
> For new container-based function app deployments, use the native Azure Container Apps hosting model. See [Deploy to Azure Container Apps with GitHub Actions](/azure/container-apps/github-actions). The `Azure/functions-container-action` shown here deploys container images to existing function app resources in Azure.

:::code language="yml" source="~/azure-actions-workflow-samples/FunctionApp/linux-container-functionapp-on-azure.yml" range="9-57":::   

--- 

## Azure Functions action

The Azure Functions action ([`Azure/functions-action`]) defines how your code is published to an existing function app in Azure, or to a specific slot in your app. 

### Parameters

The following table describes the input parameters supported by [`Azure/functions-action`]:

| Parameter | Description |
| --------- | --------- |
| **app-name** | (Required) The name of your function app in Azure. |
| **package** | (Required) The path to your project to publish. Default: `.` (all files in the repository). |
| **remote-build** | Set to `true` to enable a build action from Kudu when deploying to a Flex Consumption app. Oryx build is always performed; don't also set **scm-do-build-during-deployment** or **enable-oryx-build**. Default: `false`. |
| **scm-do-build-during-deployment** | Allow the Kudu site to perform pre-deployment operations such as [remote builds](functions-deployment-technologies.md#remote-build). Set to `true` to have Kudu build your project during deployment. Default: `false`. For more information, see [`SCM_DO_BUILD_DURING_DEPLOYMENT`](./functions-app-settings.md#scm_do_build_during_deployment). |
| **enable-oryx-build** | Allow Kudu to resolve project dependencies by using [Oryx](https://github.com/Microsoft/Oryx). Set both this and **scm-do-build-during-deployment** to `true` to use Oryx instead of the workflow. Default: `false`. Linux only. |
| **slot-name** | The [deployment slot](functions-deployment-slots.md) to deploy to. Default: production slot. |
| **publish-profile** | The name of the GitHub secret that contains your publish profile. Not needed when using the recommended OIDC authentication. |
| **sku** | Set to `flexconsumption` when authenticating with **publish-profile** on a Flex Consumption plan. Not needed with OIDC authentication or other hosting plans. |
| **respect-pom-xml** | (Java only) Set to `true` to derive the deployment artifact from pom.xml. When `true`, set **package** to `.`. Default: `false`. |
| **respect-funcignore** | Set to `true` to honor your .funcignore file and exclude listed paths. Default: `false`. |

The following table shows which parameters are supported for each hosting plan:

| Parameter | Flex Consumption | Elastic Premium | Dedicated | Consumption |
| --------- | :-: | :-: | :-: | :-: |
| **app-name** | Required | Required | Required | Required |
| **package** | Required | Required | Required | Required |
| **remote-build** | Optional | — | — | — |
| **scm-do-build-during-deployment** | — | Optional | Optional | Optional |
| **enable-oryx-build** | — | Optional (Linux) | Optional (Linux) | Optional (Linux) |
| **slot-name** | Not supported | Optional | Optional | Optional |
| **publish-profile** | Not recommended | Not recommended | Not recommended | Not recommended |
| **sku** | publish-profile only | — | — | — |
| **respect-pom-xml** | Optional (Java) | Optional (Java) | Optional (Java) | Optional (Java) |
| **respect-funcignore** | Optional | Optional | Optional | Optional |

### Deployment methods

When you use GitHub Actions, the deployment method depends on your hosting plan:

| Hosting plan | Deployment method |
| ---- | ----- |
| [Flex Consumption](./flex-consumption-plan.md) | [One deploy] |
| [Elastic Premium](./functions-premium-plan.md) | [Zip deploy] |
| [Dedicated (App Service)](./dedicated-plan.md) | [Zip deploy] |
| [Consumption](./consumption-plan.md) | Windows: [Zip deploy]<br/>Linux: [external package URL](./functions-deployment-technologies.md#external-package-url)<sup>*</sup> |

\* The ability to run your apps on Linux in a Consumption plan is planned for retirement. For more information, see [Azure Functions Consumption plan hosting](consumption-plan.md).

For more information, see [Deployment technologies in Azure Functions](functions-deployment-technologies.md).

## Next steps

- [Recover from a bad Flex Consumption plan deployment](functions-rollback-deployments.md)
- [Learn more about Azure and GitHub integration](/azure/developer/github/)

[Azure portal]: https://portal.azure.com
[Zip deploy]: functions-deployment-technologies.md#zip-deploy
[One deploy]: functions-deployment-technologies.md#one-deploy
[`Azure/functions-action`]: https://github.com/Azure/functions-action