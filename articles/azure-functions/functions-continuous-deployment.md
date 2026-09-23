---
title: Continuous deployment for Azure Functions
description: Learn how to continuously deploy Azure Functions projects by using the CI/CD workflow supported by your hosting plan.
ms.assetid: 361daf37-598c-4703-8d78-c77dbef91643
ms.topic: concept-article
ms.date: 08/28/2026
zone_pivot_groups: functions-hosting-plan
#Customer intent: As a developer, I want to learn how to set up a continuous integration environment so that function app updates are deployed automatically when I check in my code changes.
---

# Continuous deployment for Azure Functions

Azure Functions enables you to continuously deploy changes from a source control repository to a function app. In this workflow, a code update triggers build, packaging, and deployment from your project to Azure. The supported deployment providers and release strategies depend on the hosting plan.

| Hosting plan | Recommended CI/CD provider | Deployment and release guidance |
| --- | --- | --- |
| Flex Consumption | GitHub Actions or Azure Pipelines | Uses [package deployment](functions-deployment-technologies.md#flex-consumption-package-deployment). Deployment slots aren't supported. Use CI/CD release controls and consider [rolling updates](flex-consumption-site-updates.md) for zero-downtime deployments. |
| Elastic Premium, Dedicated, and Consumption | GitHub Actions or Azure Pipelines | Uses [ZIP deployment](functions-deployment-technologies.md#zip-deployment). When supported by your app, deploy to a staging slot, validate the update, and then swap the slot into production. |
| Azure Container Apps | Container build and deployment workflow | Deploys a container image. For more information, see [Azure Functions on Azure Container Apps overview](../container-apps/functions-overview.md). |

Select your hosting plan at the top of this article to view the continuous deployment guidance that applies to your function app.

::: zone pivot="premium-plan,dedicated-plan,consumption-plan"

For hosting plans that support deployment slots, configure continuous deployment for a staging slot instead of the production slot. Verify updates in staging, and then [swap the staging slot into production](./functions-deployment-slots.md#swap-slots). If you connect directly to a production slot, make sure that only production-quality code reaches the integrated branch.

::: zone-end
::: zone pivot="flex-consumption-plan"

For Flex Consumption, configure [GitHub Actions](functions-how-to-github-actions.md) or [Azure Pipelines](functions-how-to-azure-devops.md). Because Flex Consumption doesn't support deployment slots, retain your deployment history in source control and your CI/CD system so that you can [recover from a bad deployment](functions-rollback-deployments.md).

::: zone-end
::: zone pivot="container-apps"

For Functions on Azure Container Apps, build and deploy a container image. Deployment slots aren't available. Use [revisions](../container-apps/revisions.md) and consider a [blue-green deployment strategy](../container-apps/blue-green-deployment.md) for zero-downtime releases.

::: zone-end

::: zone pivot="premium-plan,dedicated-plan,consumption-plan"

The Deployment Center steps in this article apply to function apps that support App Service source control integration. On the Consumption plan, this integration is supported only on Windows. You can also [configure source control integration by using Azure CLI](/cli/azure/functionapp/deployment).

Azure Functions supports these sources for continuous deployment to your app:

### [Azure Repos](#tab/azure-repos)

Maintain your project code in [Azure Repos](https://azure.microsoft.com/services/devops/repos/), one of the services in Azure DevOps. Supports both Git and Team Foundation Version Control. Used with the [Azure Pipelines build provider](functions-continuous-deployment.md?tabs=azure-repos%2azure-pipelines#build-providers). For more information, see [What is Azure Repos?](/azure/devops/repos/get-started/what-is-repos)

### [GitHub](#tab/github)

Maintain your project code in [GitHub](https://github.com). Supported by all [build providers](functions-continuous-deployment.md?tabs=github%2Cgithub-actions#build-providers). For more information, see [GitHub docs](https://docs.github.com/en/get-started).  

### [Bitbucket](#tab/bitbucket)

Maintain your project code in [Bitbucket](https://bitbucket.org/). Requires the [App Service build service](functions-continuous-deployment.md?tabs=bitbucket%2Capp-service#build-providers).

### [Local Git](#tab/local-git)

Maintain your project code in a dedicated Git server that's hosted in the same App Service plan as your function app. This option requires the [App Service build service](functions-continuous-deployment.md?tabs=local-git%2Capp-service#build-providers). For more information, see [Local Git deployment to Azure App Service](../app-service/deploy-local-git.md).

--- 

You can also connect your function app to an external Git repository, but this option requires manual synchronization. For more information about deployment options, see [Deployment technologies in Azure Functions](functions-deployment-technologies.md).

>[!NOTE] 
> Continuous deployment options covered in this article are specific to code-only deployments. For Azure Functions on Azure Container Apps, see [Azure Functions on Azure Container Apps overview](../container-apps/functions-overview.md). For a custom container hosted by Azure Functions in a Premium or Dedicated plan, see the **Enable continuous deployment of containers to Azure** section in [Work with containers and Azure Functions](functions-how-to-custom-container.md).

::: zone-end
::: zone pivot="flex-consumption-plan"

Flex Consumption supports continuous deployment from Azure Repos by using [Azure Pipelines](functions-how-to-azure-devops.md) and from GitHub by using [GitHub Actions](functions-how-to-github-actions.md). App Service source control integration, including Bitbucket and Local Git deployments, isn't supported.

::: zone-end
::: zone pivot="container-apps"

For Functions on Azure Container Apps, maintain your source in your preferred repository and use a CI/CD workflow to build and push a container image. Then update your function app to use the new image. For more information, see [Deployment and setup for Functions on Azure Container Apps](../container-apps/functions-overview.md#deployment-and-setup).

::: zone-end

## Requirements

::: zone pivot="flex-consumption-plan,premium-plan,dedicated-plan,consumption-plan"

The unit of deployment for functions in Azure is the function app. For continuous deployment to succeed, the directory structure of your project must be compatible with the basic folder structure that Azure Functions expects. When you create your code project by using Azure Functions Core Tools, Visual Studio Code, or Visual Studio, the Azure Functions templates create code projects with the correct directory structure. You deploy all functions in a function app at the same time and in the same package.

After you enable continuous deployment, access to function code in the Azure portal is configured as *read-only* because the *source of truth* resides elsewhere.

::: zone-end
::: zone pivot="premium-plan,dedicated-plan,consumption-plan"

>[!NOTE]
>The Deployment Center doesn't support enabling continuous deployment for a function app with [inbound network restrictions](functions-networking-options.md#inbound-networking-features). Instead, configure the build provider workflow directly in GitHub or Azure Pipelines. The runner or agent must be able to reach the app's deployment endpoint under the configured access restrictions. When the endpoint is private, the runner or agent also needs private DNS resolution. For Azure Pipelines, use a [self-hosted agent](/azure/devops/pipelines/agents/agents#self-hosted-agents) on a connected network or a [managed DevOps agent pool with networking](/azure/devops/managed-devops-pools/configure-networking). For GitHub Actions, use a [self-hosted runner](https://docs.github.com/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners) on a connected network or a [GitHub-hosted runner with Azure private networking](https://docs.github.com/organizations/managing-organization-settings/about-azure-private-networking-for-github-hosted-runners-in-your-organization).

::: zone-end
::: zone pivot="flex-consumption-plan"

When your function app has [inbound network restrictions](functions-networking-options.md#inbound-networking-features), the workflow runner or agent must be able to reach the app's deployment endpoint under the configured access restrictions. When the endpoint is private, the runner or agent also needs private DNS resolution. For Azure Pipelines, use a [self-hosted agent](/azure/devops/pipelines/agents/agents#self-hosted-agents) on a connected network or a [managed DevOps agent pool with networking](/azure/devops/managed-devops-pools/configure-networking). For GitHub Actions, use a [self-hosted runner](https://docs.github.com/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners) on a connected network or a [GitHub-hosted runner with Azure private networking](https://docs.github.com/organizations/managing-organization-settings/about-azure-private-networking-for-github-hosted-runners-in-your-organization).

::: zone-end
::: zone pivot="container-apps"

Your CI/CD workflow must build a valid Azure Functions container image, push the image to a registry that your container app can access, and update the function app to create a revision from that image. For more information, see [Create a function app on Azure Container Apps](../container-apps/functions-container-apps.md).

::: zone-end

## <a name="build-providers"></a>Select a build provider

::: zone pivot="premium-plan,dedicated-plan,consumption-plan"

Building your code project is part of the deployment process. The specific build process depends on your specific language stack, operating system, and hosting plan. You can build locally or remotely, depending on your hosting. For more information, see [Remote build](functions-deployment-technologies.md#remote-build).

> [!IMPORTANT]
> For increased security, use a build provider that supports managed identities, such as Azure Pipelines and GitHub Actions. The App Service build service requires you to [enable basic authentication](#enable-basic-authentication-for-deployments) and use text-based credentials.

Azure Functions supports these build providers:

### [Azure Pipelines](#tab/azure-pipelines)

Azure Pipelines is one of the services in Azure DevOps and the default build provider for Azure Repos projects. You can also use Azure Pipelines to build projects from GitHub. In Azure Pipelines, there's an [`AzureFunctionApp`](/azure/devops/pipelines/tasks/reference/azure-function-app-v2) task designed specifically for deploying to Azure Functions. This task provides you with control over how the project gets built, packaged, and deployed. Azure Pipelines supports managed identities. 

### [GitHub Actions](#tab/github-actions)

The default build provider for GitHub projects is GitHub Actions. It provides you with control over how the project gets built, packaged, and deployed. This provider supports managed identities.

### [App Service build service](#tab/app-service)

The App Service platform provides a native build and deployment service. This service supports local Git deployment, some container deployments, and other deployment sources that Azure Pipelines and GitHub Actions don't support. The deployment site dedicated to your app handles remote builds, packaging, and other maintenance tasks. The deployment endpoint uses the `scm` subdomain, as in `https://myfunctionapp.scm.azurewebsites.net`. You can use this build service only when your deployment can access the deployment endpoint. While you can use identities to connect to the deployment endpoint, many publishing tools require basic authentication instead.

On the Consumption plan, the App Service build service supports only Windows.

This build service is used when you deploy your code project by using Visual Studio, Visual Studio Code, or Azure Functions Core Tools. If you didn't already use one of these tools to deploy code to your function app, you might need to [Enable basic authentication for deployments](#enable-basic-authentication-for-deployments) to use the deployment endpoint.

---

Keep the strengths and limitations of these providers in mind when you enable source control integration. You might need to change your repository source type to take advantage of a specific provider.

::: zone-end
::: zone pivot="flex-consumption-plan"

Use Azure Pipelines or GitHub Actions to build and deploy your project. These providers support Microsoft Entra identities and use the Flex Consumption package deployment process.

- For Azure Repos, use [Azure Pipelines](functions-how-to-azure-devops.md).
- For GitHub, use [GitHub Actions](functions-how-to-github-actions.md).

The App Service build service doesn't apply to Flex Consumption.

::: zone-end
::: zone pivot="container-apps"

Use a container build provider that can build your Azure Functions image, push it to a container registry, and update your function app to create a revision from the new image. For an end-to-end GitHub Actions workflow, see [Deploy to Azure Container Apps with GitHub Actions](../container-apps/github-actions.md).

::: zone-end

## <a name="credentials"></a>Configure continuous deployment

::: zone pivot="premium-plan,dedicated-plan,consumption-plan"

The [Azure portal](https://portal.azure.com) provides a **Deployment Center** for your function apps, which makes it easier to configure continuous deployment. The specific way you configure continuous deployment depends both on the type of source control repository in which your code resides and the [build provider](#build-providers) you choose.

In the [Azure portal](https://portal.azure.com), browse to your function app page and select **Deployment Center** under **Deployment** on the left pane. 

:::image type="content" source="media/functions-continuous-deployment/deployment-center-choose-source.png" alt-text="Screenshot of the function app Deployment Center in the Azure portal where you choose your source repository.":::

Select the **Source** repository type where your project code is being maintained from one of these supported options:

### [Azure Repos](#tab/azure-repos/azure-pipelines)

Define deployments from Azure Repos that use Azure Pipelines in the [Azure DevOps portal](https://go.microsoft.com/fwlink/?linkid=2245703). Don't define these deployments from your function app. For a step-by-step guide to creating an Azure Pipelines-based deployment from Azure Repos, see [Continuous delivery with Azure Pipelines](functions-how-to-azure-devops.md).

### [GitHub](#tab/github/azure-pipelines)

Define deployments from GitHub that use Azure Pipelines in the [Azure DevOps portal](https://go.microsoft.com/fwlink/?linkid=2245703). Don't define these deployments from your function app. For a step-by-step guide to creating an Azure Pipelines-based deployment from GitHub, see [Continuous delivery with Azure Pipelines](functions-how-to-azure-devops.md).

### [Bitbucket](#tab/bitbucket/azure-pipelines)

You can't deploy from Bitbucket by using Azure Pipelines. Instead, choose the [App Service build service](functions-continuous-deployment.md?tabs=bitbucket%2Capp-service#build-providers).

### [Local Git](#tab/local-git/azure-pipelines)

You can't deploy from Local Git by using Azure Pipelines. Instead, choose the [App Service build service](functions-continuous-deployment.md?tabs=local-git%2Capp-service#build-providers).

### [Azure Repos](#tab/azure-repos/github-actions)

You can't deploy from Azure Repos by using GitHub Actions. Choose a different [build provider](#build-providers).

### [GitHub](#tab/github/github-actions)

[!INCLUDE [functions-deploy-github-actions](../../includes/functions-deploy-github-actions.md)]

To learn more about GitHub Actions deployments, including other ways to generate the workflow configuration file, see [Continuous delivery by using GitHub Actions](functions-how-to-github-actions.md).

### [Bitbucket](#tab/bitbucket/github-actions)

You can't deploy from Bitbucket by using GitHub Actions. Instead, choose the [App Service build service](functions-continuous-deployment.md?tabs=bitbucket%2Capp-service#build-providers).

### [Local Git](#tab/local-git/github-actions)

You can't deploy from Local Git by using GitHub Actions. Instead, choose the [App Service build service](functions-continuous-deployment.md?tabs=local-git%2Capp-service#build-providers).

### [Azure Repos](#tab/azure-repos/app-service)

1. Go to your function app in the [Azure portal](https://portal.azure.com) and select **Deployment Center**.

1. For **Source**, select **Azure Repos**. If **App Service build service** provider isn't the default, select **Change provider**, select **App Service build service**, and then select **OK**.

1. Select values for **Organization**, **Project**, **Repository**, and **Branch**. Only organizations that belong to your Azure account are displayed. 

1. Select **Save** to create the webhook in your repository. 

### [GitHub](#tab/github/app-service)

1. Go to your function app in the [Azure portal](https://portal.azure.com) and select **Deployment Center**.

1. For **Source**, select **GitHub**. If **App Service build service** provider isn't the default, select **Change provider**, select **App Service build service**, and then select **OK**.

1. If your GitHub access isn't already authorized, select **Authorize**. Provide your GitHub credentials and select **Sign in**. If you need to authorize a different GitHub account, select **Change Account** and sign in with another account.

1. Select values for **Organization**, **Repository**, and **Branch**. The values are based on the location of your code. 

1. Review all details and select **Save**. The service places a webhook in your chosen repository. 

When you push a new commit to the selected branch, the service pulls your code, builds your application, and deploys it to your function app.

### [Bitbucket](#tab/bitbucket/app-service)

1. Go to your function app in the [Azure portal](https://portal.azure.com) and select **Deployment Center**. 

1. For **Source**, select **Bitbucket**. 

1. If you didn't already authorize access to Bitbucket, select **Authorize** and then **Grant access**. If requested, provide your Bitbucket credentials and select **Sign in**. If you need to authorize a different Bitbucket account, select **Change Account** and sign in with another account.

1. Select values for **Organization**, **Repository**, and **Branch**. The values are based on the location of your code. 

1. Review all details and select **Save**. The service places a webhook in your chosen repository. 

When you push a new commit to the selected branch, the service pulls your code, builds your application, and deploys it to your function app.

### [Local Git](#tab/local-git/app-service)

1. Go to your function app in the [Azure portal](https://portal.azure.com) and select **Deployment Center**. 

1. For **Source**, select **Local Git** and select **Save**. 

1. You create a local repository in your existing App Service plan, which you access from the deployment site. Copy the **Git clone URI** and use it to create a clone of this new repository on your local computer.

When you push a new commit to the Local Git repository, the service pulls your code, builds your application, and deploys it to your function app.

---

After deployment finishes, the service deploys all code from the specified source to your app. At that point, changes in the deployment source trigger a deployment of those changes to your function app in Azure.

::: zone-end
::: zone pivot="flex-consumption-plan"

Configure continuous deployment in your repository by using one of these providers:

- [Continuous delivery with Azure Pipelines](functions-how-to-azure-devops.md)
- [Continuous delivery by using GitHub Actions](functions-how-to-github-actions.md)

Each successful workflow run deploys a new application package. Deployment Center source control integration isn't available for Flex Consumption.

::: zone-end
::: zone pivot="container-apps"

Configure your CI/CD workflow to build and push the container image, and then deploy the image to your function app. Each image update creates a Container Apps revision. For more information, see [Deploy to Azure Container Apps with GitHub Actions](../container-apps/github-actions.md).

::: zone-end

## Enable continuous deployment during app creation

::: zone pivot="flex-consumption-plan,premium-plan,dedicated-plan,consumption-plan"

When you create a function app in the Azure portal, you can configure continuous deployment from GitHub by using GitHub Actions. Configure GitHub Actions on the **Deployment** tab of the **Create Function App** page.

::: zone-end
::: zone pivot="premium-plan,dedicated-plan,consumption-plan"

To use a different deployment source or build provider for continuous integration, first create your function app. Then return to the portal and [set up continuous integration in the Deployment Center](#credentials).

::: zone-end
::: zone pivot="flex-consumption-plan"

For Azure Pipelines, first create your function app and then [configure the pipeline](functions-how-to-azure-devops.md) in Azure DevOps.

::: zone-end
::: zone pivot="container-apps"

Create the function app from a container image, and then configure your CI/CD workflow to publish updated images and create revisions. For more information, see [Create a function app on Azure Container Apps](../container-apps/functions-container-apps.md).

::: zone-end

## Enable basic authentication for deployments

::: zone pivot="premium-plan,dedicated-plan,consumption-plan"

This section applies only to deployment methods that use the App Service deployment endpoint.

In some cases, your function app is created with basic authentication access to the deployment endpoint disabled. This condition blocks publishing by all methods that can't use Microsoft Entra identities to access the deployment endpoint. The publishing impacts of disabling basic authentication for the deployment endpoint are detailed in [Deploy without basic authentication](../app-service/configure-basic-auth-disable.md#deploy-without-basic-authentication).

> [!IMPORTANT]
> When you use basic authentication, credentials are sent in clear text. To protect these credentials, you must only access the deployment endpoint over an encrypted connection (HTTPS) when using basic authentication. For more information, see [Secure deployment](security-concepts.md#secure-deployment).

To enable basic authentication for the deployment endpoint:

### [Azure portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), go to your function app.

1. On the app's left menu, select **Settings** > **Configuration** > **General settings**.

1. Set **SCM Basic Auth Publishing Credentials** to **On**, and then select **Save**.

### [Azure CLI](#tab/azure-cli)

Use Azure CLI to turn on basic authentication. Run the [`az resource update`](/cli/azure/resource#az-resource-update) command to update the resource that controls the deployment endpoint.

```azure-cli
az resource update --resource-group <RESOURCE_GROUP> --name scm --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<APP_NAME> --set properties.allow=true
```

In this command, replace the placeholders with your resource group name and app name.

---

::: zone-end
::: zone pivot="flex-consumption-plan"

SCM basic authentication doesn't apply to Flex Consumption package deployments. By default, Azure Pipelines uses a Microsoft Entra bearer token from its required Azure service connection; workload identity federation is recommended. For GitHub Actions, use the recommended OpenID Connect (OIDC) authentication. These methods avoid SCM publishing credentials and are more secure than basic authentication.

::: zone-end
::: zone pivot="container-apps"

This basic authentication setting doesn't apply to Functions on Azure Container Apps. Configure authentication between your CI/CD provider, container registry, and container app instead.

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Best practices for Azure Functions](functions-best-practices.md)
