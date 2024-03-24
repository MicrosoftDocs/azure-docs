---
title: Continuous deployment for Azure Functions
description: Use the continuous deployment features of Azure App Service to publish your functions.
ms.assetid: 361daf37-598c-4703-8d78-c77dbef91643
ms.topic: conceptual
ms.date: 03/15/2024
#Customer intent: As a developer, I want to learn how to set up a continuous integration environment so that function app updates are deployed automatically when I check in my code changes.
---

# Continuous deployment for Azure Functions

You can use Azure Functions to deploy your code continuously by using [source control integration](functions-deployment-technologies.md#source-control). Source control integration enables a workflow in which a code update triggers build, packaging, and deployment from your preoject to Azure. 

Continuous deployment is a good option for projects where you integrate multiple and frequent contributions. When you use continuous deployment, you maintain a single source of truth for your code, which allows teams to easily collaborate. You can configure continuous code deployments to Azure Functions from the following source locations:

### [Azure Repos](#tab/azure-repos)

Maintain your project code in [Azure Repos](https://azure.microsoft.com/services/devops/repos/), one of the services in Azure DevOps. Supports both Git and Team Foundation Version Control. Supports all [build providers](#build-providers). For more information, see [What is Azure Repos?](/azure/devops/repos/get-started/what-is-repos).

### [GitHub](#tab/github)

Maintain your project code in [GitHub](https://github.com). Supports all [build providers](#build-providers). For more information, see [GitHub docs](https://docs.github.com/en/get-started).

### [Bitbucket](#tab/bitbucket)

Maintain your project code in [Bitbucket](https://bitbucket.org/). Requires the App Service build provider.

### [Local Git](#tab/local-git)

Maintain your project code in a dedicated Git server hosted in the same App Service plan with your function app. Requires the App Service build provider. For more information, see [Local Git deployment to Azure App Service](../app-service/deploy-local-git.md). 

--- 

You can also connect your function app to an external Git repository, but this requires a manual sychronization. For more information about deployment options, see [Deployment technologies in Azure Functions](functions-deployment-technologies.md).

>[!NOTE] 
>Continuous deployment options covered in this article are specific to code-only deployments. For containerized function app deployments, see [Enable continuous deployment to Azure](functions-how-to-custom-container.md#enable-continuous-deployment-to-azure).

## Requirements for continuous deployment

For continuous deployment to succeed, your directory structure must be compatible with the basic folder structure that Azure Functions expects.

[!INCLUDE [functions-folder-structure](../../includes/functions-folder-structure.md)]

## Build providers

Building your code project is part of the deployment process. While this build proces is key for compiled languages (C#/Java/TypeScript) to generate runable binaries, even interpreted and hybrid languages (Python/JavaScript) require a build to obtain and package any required libraries. Builds can be done locally or remotely. For more information, see [Remote build](functions-deployment-technologies.md#remote-build).

### [Azure Pipelines](#tab/azure-pipelines)

Azure Pipelines is the default build provider for Azure Repos projects, and it can also be used to build projects from GitHub. In Pipelines, there's an `AzureFunctionApp` task designed specfically for deploying to Azure Functions. This task provides you with  control over how the project gets built, packaged, and deployed. For a complete example of how to configure Pipelines for continuous deployment from Azure Repos to Functions, see [Continuous delivery by using Azure Pipelines](./functions-how-to-azure-devops.md).

### [GitHub Actions](#tab/github-actions)

GitHub Actions is the default build provider for GitHub projects. GitHub Actions provides you with control over how the project gets built, packaged, and deployed. For a complete example of how to configure GitHub Actions for continuous deployment from GitHub to Azure Functions, see [Continuous delivery by using GitHub Actions](functions-how-to-github-actions.md).

### [App Service (Kudu) service](#tab/app-service)

The App Service platform maintains a native deployment service ([Project Kudu](https://github.com/projectkudu/kudu/wiki)) to support local Git deployment, some container deployments, and other deployments not well suited for either Pipelines or GitHub Actions. Remote builds, packaging, and other maintainence tasks are performed in a subdomain of `scm.azurewebsites.net` dedicated to your app, such as `https://myfunctionapp.scm.azurewebsites.net`. This build service can't be used when the site can't be accessed from your app. For more information, see [Secure the scm endpoint](security-concepts.md#secure-the-scm-endpoint). 

---

## Considerations for continous deployment

You should keep these considerations in mind when planning for a continuous deployment strategy:

+ Continuous deployment isn't yet supported for Linux apps running on a Consumption plan. 

+ The unit of deployment for functions in Azure is the function app. All functions in a function app are deployed at the same time and in the same package. 

+ After you enable continuous deployment, access to function code in the Azure portal is configured as *read-only* because the _source of truth_ is known to reside elsewhere.

+ You should always configure continuous deployment for a staging slot and not for the production slot. When you use the production slot, code updates are pushed directly to production without being verified in Azure. Instead, enable continuous deployment to a staging slot, verify updates in the staging slot, and after everything runs correctly you can [swap the staging slot code into production](./functions-deployment-slots.md#swap-slots). 

## <a name="credentials"></a>Deployment center

The [Azure portal](https://portal.azure.com) provides a **Deployment center**, which makes it easier to configure continuous deployment for your function app. The way that you configure continuous deployment depends both on the specific source control in which your code resides and the [build provider](#build-providers) you choose. 

### [Azure Repos](#tab/azure-repos/azure-pipelines)

Deployments from Azure Repos that use Azure Pipelines are defined in the [Azure DevOps portal](https://go.microsoft.com/fwlink/?linkid=2245703) and not from your function app. For a step-by-step guide for creating a Pipelines-based deployment from Azure Repos, see [Continuous delivery with Azure Pipelines](functions-how-to-azure-devops.md).  

### [GitHub](#tab/github/azure-pipelines)

Deployments from GitHub that use Azure Pipelines are defined in the [Azure DevOps portal](https://go.microsoft.com/fwlink/?linkid=2245703) and not from your function app. For a step-by-step guide for creating a Pipelines-based deployment from GitHub, see [Continuous delivery with Azure Pipelines](functions-how-to-azure-devops.md). 

### [Bitbucket](#tab/bitbucket/azure-pipelines)

Not supported by Azure Pipelines. Choose a different [build provider](#build-providers). 

### [Local Git](#tab/local-git/azure-pipelines)

Not supported by Azure Pipelines. Choose a different [build provider](#build-providers). 

### [Azure Repos](#tab/azure-repos/github-actions)

GitHub Actions are only supported for deployments from GitHub.

### [GitHub](#tab/github/github-actions)

[!INCLUDE [functions-deploy-github-actions](../../includes/functions-deploy-github-actions.md)]

To learn more about GitHub Action deployments, including other ways to generate the workflow configuration file, see [Continuous delivery by using GitHub Actions](functions-how-to-github-actions.md). 

### [Bitbucket](#tab/bitbucket/github-actions)

GitHub Actions are only supported for deployments from GitHub.

### [Local Git](#tab/local-git/github-actions)

GitHub Actions are only supported for deployments from GitHub.

### [Azure Repos](#tab/azure-repos/app-service)

1. Navigate to your function app in the [Azure portal](https://portal.azure.com) and select **Deployment Center**. 

1. For **Source** select **Azure Repos**. If **App Service build service** provider isn't the default, select **Change provider** choose **App Service build service** and select **OK**.

1. Select values for **Organization**, **Project**, **Repository**, and **Branch**. Only organizations that belong to your Azure account are displayed. 

1. Select **Save** to create the webhook in your repository. 

### [GitHub](#tab/github/app-service)

1. Navigate to your function app in the [Azure portal](https://portal.azure.com) and select **Deployment Center**. 

1. For **Source** select **GitHub**. If **App Service build service** provider isn't the default, select **Change provider** choose **App Service build service** and select **OK**.

1. If you haven't already authorized GitHub access, select **Authorize**. Provide your GitHub credentials and select **Sign in**. If want to authorize a diffent GitHub account, select **Change Account** and sign in with a different account.

1. Select values for **Organization**, **Repository**, and **Branch**. The values are based on the location of your code. 

1. Review all details and select **Save**. A webhook is placed in your chosen repository. 

When a new commit is pushed to the selected branch, the service pulls your code, builds your application, and deploys it to your function app.

### [Bitbucket](#tab/bitbucket/app-service)

1. Navigate to your function app in the [Azure portal](https://portal.azure.com) and select **Deployment Center**. 

1. For **Source** select **Bitbucket**. 

1. If you haven't already authorized Bitbucket access, select **Authorize** and then **Grant access**. If requested, provide your Bitbucket credentials and select **Sign in**. If want to authorize a diffent Bitbucket account, select **Change Account** and sign in with a different account.

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

## Next steps

> [!div class="nextstepaction"]
> [Best practices for Azure Functions](functions-best-practices.md)
