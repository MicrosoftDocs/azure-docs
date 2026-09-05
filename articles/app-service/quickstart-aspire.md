---
title: "Quickstart: Deploy an Aspire app"
description: Learn how to deploy your first Aspire app to Azure App Service using GitHub Codespaces and the Aspire CLI.
ms.topic: quickstart
ms.date: 09/04/2026
author: cephalin
ms.author: cephalin
#customer intent: As a developer, I want to quickly deploy an Aspire app to Azure App Service using a browser-based development environment.
ms.service: azure-app-service
ms.custom:
  - devx-track-csharp
  - devx-track-dotnet
---

# Quickstart: Deploy an Aspire app to Azure App Service

In this quickstart, you learn how to create and deploy your first [Aspire](https://aspire.dev/get-started/what-is-aspire/) app to [Azure App Service](overview.md). Azure App Service provides a fully managed platform for hosting web apps with built-in infrastructure maintenance, security patching, and scaling.

You can complete this entire quickstart in your browser using the official Aspire development container for GitHub Codespaces. By the end, you have a running Aspire app deployed to Azure App Service.

> [!IMPORTANT]
> The Aspire Azure App Service integration is currently in preview.

This quickstart uses a C# AppHost and .NET projects. Aspire also supports TypeScript AppHosts and polyglot application resources. For more information, see [Aspire AppHost](https://aspire.dev/get-started/app-host/) and [What's new in Aspire 13.5](https://aspire.dev/whats-new/aspire-13-5/).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A GitHub account with access to [GitHub Codespaces](https://github.com/features/codespaces).
- The [Azure CLI](/cli/azure/install-azure-cli) available in the codespace for authentication.

## Create an Aspire starter app in a GitHub codespace

1. [Create a repository from the Aspire development container template](https://github.com/new?template_name=aspire-devcontainer&template_owner=microsoft).
1. In the new repository, select **Code** > **Codespaces** > **Create codespace on main**.

   Your browser opens a codespace with Visual Studio Code. The environment includes the Aspire CLI and a trusted local HTTPS development certificate.

   For more information, see [Develop with Aspire using GitHub Codespaces](https://aspire.dev/get-started/github-codespaces/).

1. In the terminal, create a new Aspire app:

   ```bash
   aspire new aspire-starter --name aspire-starter --output aspire-starter
   ```

   The command creates a new directory named `aspire-starter` with a complete Aspire solution, including:
   - An AppHost project for orchestration
   - A ServiceDefaults project for shared configurations
   - Sample API and web frontend projects

1. Navigate into the project directory:

   ```bash
   cd aspire-starter
   ```

## Add Azure App Service integration

Configure your Aspire app to deploy to Azure App Service.

1. Add the Azure App Service hosting integration:

   ```bash
   aspire add Aspire.Hosting.Azure.AppService
   ```

   The `aspire add` command detects the AppHost project and adds the `Aspire.Hosting.Azure.AppService` package. For more information, see [`aspire add`](https://aspire.dev/reference/cli/commands/aspire-add/).

1. Open the *aspire-starter/aspire-starter.AppHost/AppHost.cs*.

1. Add an Azure App Service environment after the `CreateBuilder` line:

   ```csharp
   builder.AddAzureAppServiceEnvironment("app-service-env");
   ```

    For more information, see [Do I need an App Service environment to run Aspire apps?](#do-i-need-an-app-service-environment-to-run-aspire-apps).

1. Add `.WithExternalHttpEndpoints()` to the `apiservice` project. Your complete `apiservice` resource should look like:

   ```csharp
   var apiService = builder.AddProject<Projects.aspire_starter_ApiService>("apiservice")
       .WithExternalHttpEndpoints()
       .WithHttpHealthCheck("/health");
   ```

   > [!NOTE]
   > App Service supports only external HTTP and HTTPS endpoints and one distinct target port for each deployed app. The starter template already exposes the frontend endpoint. For more information, see [Azure App Service Hosting integration](https://aspire.dev/integrations/cloud/azure/azure-app-service/azure-app-service-host/#add-azure-app-service-environment).

1. From the solution root, run `aspire run` to verify the AppHost locally.

    :::image type="content" source="media/quickstart-aspire/aspire-dashboard.png" alt-text="A screenshot of the current Aspire dashboard showing the App Service environment and sample app resources.":::

## Deploy to Azure

1. Sign in to Azure:

   ```bash
   az login
   ```

1. Deploy the application:

   ```bash
   aspire deploy
   ```

   When prompted, select your Azure subscription, location, and resource group. Aspire stores the selected deployment settings as AppHost user secrets so you can reuse them.

   The `aspire deploy` command performs the following actions based on your *AppHost.cs* code:
   - Creates or reuses the selected resource group
   - Creates an Azure App Service Plan
   - Creates an Azure Container Registry
   - Creates two App Service web apps (one for the API, one for the frontend)
   - Creates a managed Aspire Dashboard resource
   - Builds and containerizes your applications
   - Pushes the containers to Azure Container Registry
   - Deploys the containers to App Service

   For more information about deployment settings and authentication, see [Deploy to Azure](https://aspire.dev/deployment/azure/).

1. When deployment completes, the command displays the endpoint URLs for the deployed services and Aspire Dashboard.

   For more information about the deployment flow, see [Deploy to Azure App Service](https://aspire.dev/deployment/azure/app-service/).

## Browse your Aspire app

1. In the deployment output, find the URL for the `webfrontend` service. It looks similar to:

   ```
   webfrontend: https://webfrontend-xxxxx.azurewebsites.net
   ```

1. Copy the URL and open it in a new browser tab.

   You see the Aspire starter app running in Azure App Service. The web frontend communicates with the API service, demonstrating the distributed architecture.

1. Try navigating through the app to verify it's working correctly.

1. To view the Aspire Dashboard, find the **Aspire Dashboard** URL in the deployment output and open it in a new browser tab.

## View deployment details in Azure portal

1. Navigate to the [Azure portal](https://portal.azure.com).
1. In the search bar, type **resource groups** and select **Resource Groups**.
1. Find and select the resource group that you chose during `aspire deploy`.

    :::image type="content" source="media/quickstart-aspire/resource-group-view.png" alt-text="A screenshot of the resource group view of an Aspire app deployed by Aspire.":::

    You should see the following resources:

   - **App Service Plan**: The hosting infrastructure
   - **App Services**: Your webfrontend and apiservice apps
   - **Aspire Dashboard**: A managed Azure resource protected by role-based access control (RBAC).
   - **Container Registry**: Stores your container images
   - **User Assigned Identity**: Provides secure access between services

## Clean up resources

When you no longer need the Azure resources, delete them to avoid incurring charges.

1. In your codespace terminal, run:

   ```bash
   aspire destroy
   ```

1. When prompted, confirm that you want to destroy the deployed environment.

The command runs the destroy step registered by the App Service environment. For more information, see [`aspire destroy`](https://aspire.dev/reference/cli/commands/aspire-destroy/).

> [!CAUTION]
> `aspire destroy` deletes the entire resource group, including resources that weren't created by Aspire. Review the target resource group before you confirm.

## Frequently asked questions

- [Do I need an App Service environment to run Aspire apps?](#do-i-need-an-app-service-environment-to-run-aspire-apps)
- [How do I customize my App Service deployment?](#how-do-i-customize-my-app-service-deployment)

### Do I need an App Service environment to run Aspire apps?

No. Despite its name, `AddAzureAppServiceEnvironment` doesn't provision an [App Service Environment](environment/overview.md) in the Isolated tier. It creates an Aspire environment resource that represents the App Service hosting infrastructure for your application.

When you call `AddAzureAppServiceEnvironment`, it provisions:
- An Azure App Service Plan (Premium P0V3 tier on Linux by default)
- An Azure Container Registry for storing container images
- A user-assigned managed identity for secure access between services

This Aspire environment concept groups your resources together and provides the infrastructure needed to deploy your Aspire apps to Azure App Service.

### How do I customize my App Service deployment?

You can customize your App Service deployment by modifying the AppHost.cs configuration. The Aspire Azure App Service integration provides several ways to customize your deployment:

- **Configure the App Service Plan**: Adjust SKU, tier, and scaling options
- **Customize App Service settings**: Add environment variables, connection strings, and app settings
- **Configure infrastructure**: Modify networking, authentication, and other Azure resources
- **Use existing resources**: Connect to existing App Service Plans or other Azure resources

For more information, see [Configure an Aspire app for Azure App Service](configure-language-aspire.md).

For more information about supported App Service workloads and deployment behavior, see [Azure App Service Hosting integration](https://aspire.dev/integrations/cloud/azure/azure-app-service/azure-app-service-host/) and [Deploy to Azure App Service](https://aspire.dev/deployment/azure/app-service/).

## Next steps

You successfully deployed an Aspire app to Azure App Service! Here are some next steps to explore:

> [!div class="nextstepaction"]
> [Configure an Aspire app for Azure App Service](configure-language-aspire.md)

> [!div class="nextstepaction"]
> [Azure App Service documentation](overview.md)

### Explore Azure App Service features

- [Configure custom domains and SSL](tutorial-secure-domain-certificate.md)
- [Set up staging environments](deploy-staging-slots.md)
- [Configure authentication](overview-authentication-authorization.md)
