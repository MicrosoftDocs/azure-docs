---
title: Continuous deployment for Azure Functions
description: Use the continuous deployment features of Azure App Service when publishing to Azure Functions.
ms.assetid: 361daf37-598c-4703-8d78-c77dbef91643
ms.topic: conceptual
ms.date: 04/01/2024
#Customer intent: As a developer, I want to learn how to set up a continuous integration environment so that function app updates are deployed automatically when I check in my code changes.
---

# Continuous deployment for Azure Functions

You can use Azure Functions to deploy your code continuously by using [source control integration](functions-deployment-technologies.md#source-control). Source control integration enables a workflow in which a code update triggers build, packaging, and deployment from your project to Azure. 

Continuous deployment is a good option for projects where you integrate multiple and frequent contributions. When you use continuous deployment, you maintain a single source of truth for your code, which allows teams to easily collaborate. 

Steps in this article show you how to configure continuous code deployments to your function app in Azure by using the Deployment Center in the Azure portal. You can also configure continuous integration using the Azure CLI. 

In the Deployment Center, you must first choose your source code location, which can be one of these options:

### [Azure Repos](#tab/azure-repos)

Maintain your project code in [Azure Repos](https://azure.microsoft.com/services/devops/repos/), one of the services in Azure DevOps. Supports both Git and Team Foundation Version Control. Used with the [Azure Pipelines build provider](functions-continuous-deployment.md?tabs=azure-repos%2azure-pipelines#build-providers)). For more information, see [What is Azure Repos?](/azure/devops/repos/get-started/what-is-repos)

### [GitHub](#tab/github)

Maintain your project code in [GitHub](https://github.com). Supported by all [build providers](functions-continuous-deployment.md?tabs=github%2Cgithub-actions#build-providers). For more information, see [GitHub docs](https://docs.github.com/en/get-started).

### [Bitbucket](#tab/bitbucket)

Maintain your project code in [Bitbucket](https://bitbucket.org/). Requires the [App Service build provider](functions-continuous-deployment.md?tabs=bitbucket%2Capp-service#build-providers).

### [Local Git](#tab/local-git)

Maintain your project code in a dedicated Git server hosted in the same App Service plan with your function app. Requires the [App Service build provider](functions-continuous-deployment.md?tabs=local-git%2Capp-service#build-providers). For more information, see [Local Git deployment to Azure App Service](../app-service/deploy-local-git.md). 

--- 

You can also connect your function app to an external Git repository, but this requires a manual synchronization. For more information about deployment options, see [Deployment technologies in Azure Functions](functions-deployment-technologies.md).

>[!NOTE] 
>Continuous deployment options covered in this article are specific to code-only deployments. For containerized function app deployments, see [Enable continuous deployment of containers to Azure](functions-how-to-custom-container.md#enable-continuous-deployment-to-azure).
>
>GitHub is the only continuous deployment source supported for apps running on Linux in a [Consumption plan](./consumption-plan.md), which includes serverless Python apps. 

## Requirements

For continuous deployment to succeed, your directory structure must be compatible with the basic folder structure that Azure Functions expects.

[!INCLUDE [functions-folder-structure](../../includes/functions-folder-structure.md)]

## Build providers

Building your code project is part of the deployment process. The specific build process depends on your specific language stack, operating system, and hosting plan. Builds can be done locally or remotely, again depending on your specific hosting. For more information, see [Remote build](functions-deployment-technologies.md#remote-build).

Functions supports these build providers:

### [Azure Pipelines](#tab/azure-pipelines)

Azure Pipelines is one of the services in Azure DevOps and the default build provider for Azure Repos projects. You can also use Pipelines to build projects from GitHub. In Pipelines, there's an `AzureFunctionApp` task designed specifically for deploying to Azure Functions. This task provides you with  control over how the project gets built, packaged, and deployed. 

### [GitHub Actions](#tab/github-actions)

GitHub Actions is the default build provider for GitHub projects. GitHub Actions provides you with control over how the project gets built, packaged, and deployed. 

### [App Service (Kudu) service](#tab/app-service)

The App Service platform maintains a native deployment service ([Project Kudu](https://github.com/projectkudu/kudu/wiki)) to support local Git deployment, some container deployments, and other deployment sources not supported by either Pipelines or GitHub Actions. Remote builds, packaging, and other maintainence tasks are performed in a subdomain of `scm.azurewebsites.net` dedicated to your app, such as `https://myfunctionapp.scm.azurewebsites.net`. This build service can only be used when the `scm` site is accessible to your app. For more information, see [Secure the scm endpoint](security-concepts.md#secure-the-scm-endpoint). 

---

Your options for which of these build providers you can use depend on the specific code deployment source.  

## <a name="credentials"></a>Deployment center

The [Azure portal](https://portal.azure.com) provides a **Deployment center** for your function apps, which makes it easier to configure continuous deployment. The way that you configure continuous deployment depends both on the specific source control in which your code resides and the [build provider](#build-providers) you choose. 

### [Azure Repos](#tab/azure-repos/azure-pipelines)

Deployments from Azure Repos that use Azure Pipelines are defined in the [Azure DevOps portal](https://go.microsoft.com/fwlink/?linkid=2245703) and not from your function app. For a step-by-step guide for creating a Pipelines-based deployment from Azure Repos, see [Continuous delivery with Azure Pipelines](functions-how-to-azure-devops.md).  

### [GitHub](#tab/github/azure-pipelines)

Deployments from GitHub that use Azure Pipelines are defined in the [Azure DevOps portal](https://go.microsoft.com/fwlink/?linkid=2245703) and not from your function app. For a step-by-step guide for creating a Pipelines-based deployment from GitHub, see [Continuous delivery with Azure Pipelines](functions-how-to-azure-devops.md). 

### [Bitbucket](#tab/bitbucket/azure-pipelines)

You can't deploy from Bitbucket using Azure Pipelines. Instead choose the App Service (Kudu) [build provider](#build-providers). 

### [Local Git](#tab/local-git/azure-pipelines)

You can't deploy from local git using Azure Pipelines. Instead choose the App Service (Kudu) [build provider](#build-providers). 

### [Azure Repos](#tab/azure-repos/github-actions)

You can't deploy from Azure Repos using GitHub Actions. Choose a different [build provider](#build-providers).

### [GitHub](#tab/github/github-actions)

[!INCLUDE [functions-deploy-github-actions](../../includes/functions-deploy-github-actions.md)]

To learn more about GitHub Action deployments, including other ways to generate the workflow configuration file, see [Continuous delivery by using GitHub Actions](functions-how-to-github-actions.md). 

### [Bitbucket](#tab/bitbucket/github-actions)

You can't deploy from Bitbucket using GitHub Actions. Instead choose the App Service (Kudu) [build provider](#build-providers).

### [Local Git](#tab/local-git/github-actions)

You can't deploy from local git using GitHub Actions. Instead choose the App Service (Kudu) [build provider](#build-providers).

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

## Considerations

You should keep these considerations in mind when planning for a continuous deployment strategy:

+ GitHub is the only source that currently supports continuous deployment for Linux apps running on a Consumption plan, which is a popular hosting option for Python apps.  

+ The unit of deployment for functions in Azure is the function app. All functions in a function app are deployed at the same time and in the same package. 

+ After you enable continuous deployment, access to function code in the Azure portal is configured as *read-only* because the _source of truth_ is known to reside elsewhere.

+ You should always configure continuous deployment for a staging slot and not for the production slot. When you use the production slot, code updates are pushed directly to production without being verified in Azure. Instead, enable continuous deployment to a staging slot, verify updates in the staging slot, and after everything runs correctly you can [swap the staging slot code into production](./functions-deployment-slots.md#swap-slots).

+ To enable continuous deployment for a function app with inbound network restrictions, you need to instead configure the build provider workflow externally and use a self-hosted runner in the same virtual network as the function app that can connect to the source location.

## Next steps

> [!div class="nextstepaction"]
> [Best practices for Azure Functions](functions-best-practices.md)
