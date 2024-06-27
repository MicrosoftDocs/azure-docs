---
title: Continuous deployment for Azure Functions
description: Use the continuous deployment features of Azure App Service when publishing to Azure Functions.
ms.assetid: 361daf37-598c-4703-8d78-c77dbef91643
ms.topic: conceptual
ms.date: 05/01/2024
#Customer intent: As a developer, I want to learn how to set up a continuous integration environment so that function app updates are deployed automatically when I check in my code changes.
---

# Continuous deployment for Azure Functions

Azure Functions enables you to continuously deploy the changes made in a source control repository to a connected function app. This [source control integration](functions-deployment-technologies.md#source-control) enables a workflow in which a code update triggers build, packaging, and deployment from your project to Azure. 

You should always configure continuous deployment for a staging slot and not for the production slot. When you use the production slot, code updates are pushed directly to production without being verified in Azure. Instead, enable continuous deployment to a staging slot, verify updates in the staging slot, and after everything runs correctly you can [swap the staging slot code into production](./functions-deployment-slots.md#swap-slots). If you connect to a production slot, make sure that only production-quality code makes it into the integrated code branch.

Steps in this article show you how to configure continuous code deployments to your function app in Azure by using the Deployment Center in the Azure portal. You can also [configure continuous integration using the Azure CLI](/cli/azure/functionapp/deployment). These steps can target either a staging or a production slot. 

Functions supports these sources for continuous deployment to your app:

### [Azure Repos](#tab/azure-repos)

Maintain your project code in [Azure Repos](https://azure.microsoft.com/services/devops/repos/), one of the services in Azure DevOps. Supports both Git and Team Foundation Version Control. Used with the [Azure Pipelines build provider](functions-continuous-deployment.md?tabs=azure-repos%2azure-pipelines#build-providers). For more information, see [What is Azure Repos?](/azure/devops/repos/get-started/what-is-repos)

### [GitHub](#tab/github)

Maintain your project code in [GitHub](https://github.com). Supported by all [build providers](functions-continuous-deployment.md?tabs=github%2Cgithub-actions#build-providers). For more information, see [GitHub docs](https://docs.github.com/en/get-started).  

GitHub is the only continuous deployment source supported for apps running on Linux in a [Consumption plan](./consumption-plan.md), which includes serverless Python apps.

### [Bitbucket](#tab/bitbucket)

Maintain your project code in [Bitbucket](https://bitbucket.org/). Requires the [App Service build provider](functions-continuous-deployment.md?tabs=bitbucket%2Capp-service#build-providers).

### [Local Git](#tab/local-git)

Maintain your project code in a dedicated Git server hosted in the same App Service plan with your function app. Requires the [App Service build provider](functions-continuous-deployment.md?tabs=local-git%2Capp-service#build-providers). For more information, see [Local Git deployment to Azure App Service](../app-service/deploy-local-git.md). 

--- 

You can also connect your function app to an external Git repository, but this requires a manual synchronization. For more information about deployment options, see [Deployment technologies in Azure Functions](functions-deployment-technologies.md).

>[!NOTE] 
>Continuous deployment options covered in this article are specific to code-only deployments. For containerized function app deployments, see [Enable continuous deployment of containers to Azure](functions-how-to-custom-container.md#enable-continuous-deployment-to-azure). 

## Requirements

The unit of deployment for functions in Azure is the function app. For continuous deployment to succeed, the directory structure of your project must be compatible with the basic folder structure that Azure Functions expects. When you create your code project using Azure Functions Core Tools, Visual Studio Code, or Visual Studio, the Azure Functions templates are used to create code projects with the correct directory structure. All functions in a function app are deployed at the same time and in the same package.

After you enable continuous deployment, access to function code in the Azure portal is configured as *read-only* because the _source of truth_ is known to reside elsewhere.

>[!NOTE]
>The Deployment Center doesn't support enabling continuous deployment for a function app with [inbound network restrictions](functions-networking-options.md?#inbound-networking-features). You need to instead configure the build provider workflow directly in GitHub or Azure Pipelines. These workflows also require you to use a virtual machine in the same virtual network as the function app as either a [self-hosted agent (Pipelines)](/azure/devops/pipelines/agents/agents#self-hosted-agents) or a [self-hosted runner (GitHub)](https://docs.github.com/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners).

## <a name="build-providers"></a>Select a build provider

Building your code project is part of the deployment process. The specific build process depends on your specific language stack, operating system, and hosting plan. Builds can be done locally or remotely, again depending on your specific hosting. For more information, see [Remote build](functions-deployment-technologies.md#remote-build).

> [!IMPORTANT]
> For increased security, consider using a build provider that supports managed identities, including Azure Pipelines and Gitub Actions. The App Service (Kudu) service requires you to [enable basic authenication](#enable-basic-authentication-for-deployments) and work with text-based credentials. 

Functions supports these build providers:

### [Azure Pipelines](#tab/azure-pipelines)

Azure Pipelines is one of the services in Azure DevOps and the default build provider for Azure Repos projects. You can also use Pipelines to build projects from GitHub. In Pipelines, there's an [`AzureFunctionApp`](/azure/devops/pipelines/tasks/reference/azure-function-app-v2) task designed specifically for deploying to Azure Functions. This task provides you with control over how the project gets built, packaged, and deployed. Supports managed identities. 

### [GitHub Actions](#tab/github-actions)

GitHub Actions is the default build provider for GitHub projects. GitHub Actions provides you with control over how the project gets built, packaged, and deployed. Supports managed identities. 

### [App Service (Kudu) service](#tab/app-service)

The App Service platform maintains a native deployment service ([Project Kudu](https://github.com/projectkudu/kudu/wiki)) to support local Git deployment, some container deployments, and other deployment sources not supported by either Pipelines or GitHub Actions. Remote builds, packaging, and other maintainence tasks are performed in a subdomain of `scm.azurewebsites.net` dedicated to your app, such as `https://myfunctionapp.scm.azurewebsites.net`. This build service can only be used when the `scm` site can be accessed by your deployment. Many publishing tools require basic authentication to connect to the `scm` endpoint, which means you can't use managed identities. 

This build provider is used when you deploy your code project by using Visual Studio, Visual Studio Code, or Azure Functions Core Tools. If you haven't already deployed code to your function app by using one of these tools, you might need to [Enable basic authentication for deployments](#enable-basic-authentication-for-deployments) to use the `scm` site.  

---

Keep the strengths and limitations of these providers in mind when you enable source control integration. You might need to change your repository source type to take advantage of a specific provider.

## <a name="credentials"></a>Configure continuous deployment

The [Azure portal](https://portal.azure.com) provides a **Deployment center** for your function apps, which makes it easier to configure continuous deployment. The specific way you configure continuous deployment depends both on the type of source control repository in which your code resides and the [build provider](#build-providers) you choose. 

In the [Azure portal](https://portal.azure.com), browse to your function app page and select **Deployment Center** under **Deployment** in the left pane. 

:::image type="content" source="media/functions-continuous-deployment/deployment-center-choose-source.png" alt-text="Screenshot of Function app deployment center in the Azure portal where you choose your source repository.":::

Select the **Source** repository type where your project code is being maintained from one of these supported options:

### [Azure Repos](#tab/azure-repos/azure-pipelines)

Deployments from Azure Repos that use Azure Pipelines are defined in the [Azure DevOps portal](https://go.microsoft.com/fwlink/?linkid=2245703) and not from your function app. For a step-by-step guide for creating a Pipelines-based deployment from Azure Repos, see [Continuous delivery with Azure Pipelines](functions-how-to-azure-devops.md).  

### [GitHub](#tab/github/azure-pipelines)

Deployments from GitHub that use Azure Pipelines are defined in the [Azure DevOps portal](https://go.microsoft.com/fwlink/?linkid=2245703) and not from your function app. For a step-by-step guide for creating a Pipelines-based deployment from GitHub, see [Continuous delivery with Azure Pipelines](functions-how-to-azure-devops.md). 

### [Bitbucket](#tab/bitbucket/azure-pipelines)

You can't deploy from Bitbucket using Azure Pipelines. Instead choose the [App Service build provider](functions-continuous-deployment.md?tabs=bitbucket%2Capp-service#build-providers). 

### [Local Git](#tab/local-git/azure-pipelines)

You can't deploy from local git using Azure Pipelines. Instead choose the [App Service build provider](functions-continuous-deployment.md?tabs=local-git%2Capp-service#build-providers). 

### [Azure Repos](#tab/azure-repos/github-actions)

You can't deploy from Azure Repos using GitHub Actions. Choose a different [build provider](#build-providers).

### [GitHub](#tab/github/github-actions)

[!INCLUDE [functions-deploy-github-actions](../../includes/functions-deploy-github-actions.md)]

To learn more about GitHub Action deployments, including other ways to generate the workflow configuration file, see [Continuous delivery by using GitHub Actions](functions-how-to-github-actions.md). 

### [Bitbucket](#tab/bitbucket/github-actions)

You can't deploy from Bitbucket using GitHub Actions. Instead choose the [App Service build provider](functions-continuous-deployment.md?tabs=bitbucket%2Capp-service#build-providers).

### [Local Git](#tab/local-git/github-actions)

You can't deploy from local git using GitHub Actions. Instead choose the [App Service build provider](functions-continuous-deployment.md?tabs=local-git%2Capp-service#build-providers).

### [Azure Repos](#tab/azure-repos/app-service)

1. Navigate to your function app in the [Azure portal](https://portal.azure.com) and select **Deployment Center**. 

1. For **Source** select **Azure Repos**. If **App Service build service** provider isn't the default, select **Change provider** choose **App Service build service** and select **OK**.

1. Select values for **Organization**, **Project**, **Repository**, and **Branch**. Only organizations that belong to your Azure account are displayed. 

1. Select **Save** to create the webhook in your repository. 

### [GitHub](#tab/github/app-service)

1. Navigate to your function app in the [Azure portal](https://portal.azure.com) and select **Deployment Center**. 

1. For **Source** select **GitHub**. If **App Service build service** provider isn't the default, select **Change provider** choose **App Service build service** and select **OK**.

1. If you haven't already authorized GitHub access, select **Authorize**. Provide your GitHub credentials and select **Sign in**. If you need to authorize a different GitHub account, select **Change Account** and sign in with another account.

1. Select values for **Organization**, **Repository**, and **Branch**. The values are based on the location of your code. 

1. Review all details and select **Save**. A webhook is placed in your chosen repository. 

When a new commit is pushed to the selected branch, the service pulls your code, builds your application, and deploys it to your function app.

### [Bitbucket](#tab/bitbucket/app-service)

1. Navigate to your function app in the [Azure portal](https://portal.azure.com) and select **Deployment Center**. 

1. For **Source** select **Bitbucket**. 

1. If you haven't already authorized Bitbucket access, select **Authorize** and then **Grant access**. If requested, provide your Bitbucket credentials and select **Sign in**. If you need to authorize a different Bitbucket account, select **Change Account** and sign in with another account.

1. Select values for **Organization**, **Repository**, and **Branch**. The values are based on the location of your code. 

1. Review all details and select **Save**. A webhook is placed in your chosen repository. 

When a new commit is pushed to the selected branch, the service pulls your code, builds your application, and deploys it to your function app.

### [Local Git](#tab/local-git/app-service)

1. Navigate to your function app in the [Azure portal](https://portal.azure.com) and select **Deployment Center**. 

1. For **Source** select **Local Git** and select **Save**. 

1. A local repository is created in your existing App Service plan, which is accessed from the `scm` domain. Copy the **Git clone URI** and use it to create a clone of this new repository on your local computer.   

When a new commit is pushed to the local git repository, the service pulls your code, builds your application, and deploys it to your function app.

---

After deployment completes, all code from the specified source is deployed to your app. At that point, changes in the deployment source trigger a deployment of those changes to your function app in Azure.

## Enable continuous deployment during app creation

Currently, you can configure continuous deployment from GitHub using GitHub Actions when you create your function app in the Azure portal. You can do this on the **Deployment** tab in the **Create Function App** page.

If you want to use a different deployment source or build provider for continuous integration, first create your function app and then return to the portal and [set up continuous integration in the Deployment Center](#credentials).

## Enable basic authentication for deployments

By default, your function app is created with basic authentication access to the `scm` endpoint disabled. This blocks publishing by all methods that can't use managed identities to access the `scm` endpoint. The publishing impacts of having the `scm` endpoint disabled are detailed in [Deployment without basic authentication](../app-service/configure-basic-auth-disable.md#deployment-without-basic-authentication). 

> [!IMPORTANT]
> When you use basic authenication, credentials are sent in clear text. To protect these credentials, you must only access the `scm` endpoint over an encrypted connection (HTTPS) when using basic authentication. For more information, see [Secure deployment](security-concepts.md#secure-deployment).

To enable basic authentication to the `scm` endpoint:

### [Azure portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your function app.

1. In the app's left menu, select **Configuration** > **General settings**.

1. Set **SCM Basic Auth Publishing Credentials** to **On**, then select **Save**.

### [Azure CLI](#tab/azure-cli)

You can use the Azure CLI to turn on basic authentication by using this [`az resource update`](/cli/azure/resource#az-resource-update) command to update the resource that controls the `scm` endpoint. 

```azure-cli
az resource update --resource-group <RESOURCE_GROUP> --name scm --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<APP_NAME> --set properties.allow=true
```

In this command, replace the placeholders with your resource group name and app name.

---

## Next steps

> [!div class="nextstepaction"]
> [Best practices for Azure Functions](functions-best-practices.md)
