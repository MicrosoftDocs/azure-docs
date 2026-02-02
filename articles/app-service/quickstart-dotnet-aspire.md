---
title: "Quickstart: Deploy an Aspire app"
description: Learn how to deploy your first Aspire app to Azure App Service using GitHub Codespaces and Azure Developer CLI.
ms.topic: quickstart
ms.date: 01/31/2026
author: cephalin
ms.author: cephalin
#customer intent: As a .NET developer, I want to quickly deploy an Aspire app to Azure App Service using a browser-based development environment.
ms.service: azure-app-service
ms.custom:
  - devx-track-csharp
  - devx-track-dotnet
  - devx-track-extended-azdevcli
---

# Quickstart: Deploy an Aspire app to Azure App Service

In this quickstart, you learn how to create and deploy your first [Aspire](/dotnet/aspire/get-started/aspire-overview) app to [Azure App Service](overview.md). Azure App Service provides a fully managed platform for hosting web apps with built-in infrastructure maintenance, security patching, and scaling.

You can complete this entire quickstart in your browser using GitHub Codespaces, which provides a pre-configured development environment with .NET 10 and Azure Developer CLI already installed. By the end, you have a running Aspire app deployed to Azure App Service.

> [!NOTE]
> While this quickstart focuses on .NET projects, Aspire also supports Python applications starting from [Aspire 1.3](https://aspire.dev/whats-new/aspire-13/). Python Aspire apps can also be deployed to Azure App Service using the same integration.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A GitHub account. [Create an account for free](https://github.com/).

## Create an Aspire starter app in a GitHub codespace

1. Navigate to [github.com/codespaces](https://github.com/codespaces).
1. For the .NET template, select **Use this template**.

   Your browser opens a new codespace with Visual Studio Code running in the browser. The environment includes .NET 10 and Azure Developer CLI pre-installed.

1. In the codespace terminal, install the Aspire CLI globally:

   ```bash
   dotnet tool install -g Aspire.Cli
   ```

1. In the terminal, create a new Aspire app. When prompted, accept the defaults.

   ```bash
   aspire new aspire-starter --name aspire-starter
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

1. Add the Azure App Service hosting integration package:

   ```bash
   aspire add azure-appservice
   ```

   The `aspire add` command automatically detects the AppHost project and adds the **Aspire.Hosting.Azure.AppService** package to it.

1. Open the *aspire-starter/aspire-starter.AppHost/AppHost.cs*.

1. Add an Azure App Service environment after the `CreateBuilder` line:

   ```csharp
   builder.AddAzureAppServiceEnvironment("app-service-env");
   ```

    For more information, see [Do I need an App Service environment to run Aspire apps?](#do-i-need-an-app-service-environment-to-run-aspire-apps).

1. Add `.WithExternalHttpEndpoints()` to the `apiservice` project. Your complete `apiservice` code should look like:

   ```csharp
   var apiService = builder.AddProject<Projects.aspire_starter_ApiService>("apiservice")
       .WithExternalHttpEndpoints()
       .WithHttpHealthCheck("/health");
   ```

   > [!NOTE]
   > The `apiservice` needs `.WithExternalHttpEndpoints()` because Aspire with App Service currently doesn't manage traffic between apps through internal endpoints. `apiservice` needs to be accessible via external HTTP endpoints for service-to-service communication to work.

## Deploy to Azure

1. From the *aspire-starter* directly, initialize azd in the current directory:

   ```bash
   azd init
   ```

   When prompted,
   - Select **Scan current directory**.
   - Select **Confirm and continue initializing my app**.
   - For **Enter a unique environment name:**, enter a name you want like `aspire-quickstart`.

   The command creates the necessary configuration files for deployment, which by default is just an *azure.yaml* file that points to your AppHost project. This configuration allows `azd up` to work by identifying your AppHost project. The `host: containerapp` value doesn't determine your deployment target because `azd` uses the infrastructure defined in your *AppHost.cs* file (in this case, the App Service environment you added with `AddAzureAppServiceEnvironment`).

1. Sign in to Azure with `azd auth login`. It will launch an interactive login page. Sign in with your Azure account credentials.

   ```bash
   azd auth login
   ```

1. Deploy the application:

   ```bash
   azd up
   ```

   When prompted:
   - **Subscription**: Select your Azure subscription
   - **Location**: Select a region near you (for example, **(Europe) West Europe (westeurope)**)

   The `azd up` command performs the following actions based on your *AppHost.cs* code:
   - Creates a new resource group
   - Creates an Azure App Service Plan
   - Creates an Azure Container Registry
   - Creates two App Service web apps (one for the API, one for the frontend)
   - Creates a managed Aspire Dashboard resource
   - Builds and containerizes your applications
   - Pushes the containers to Azure Container Registry
   - Deploys the containers to App Service

   This process takes several minutes to complete.

1. When deployment completes, azd displays the endpoint URLs for your deployed services.

    ```output
    Deploying services (azd deploy)
    
      (✓) Done: Deploying service apiservice
      - Endpoint: https://apiservice-xxxxxx.azurewebsites.net/ 
    
      (✓) Done: Deploying service webfrontend
      - Endpoint: https://webfrontend-xxxxxx.azurewebsites.net/ 
    
      Aspire Dashboard: https://app-service-env-aspiredashboard-xxxxxx.azurewebsites.net
    
    SUCCESS: Your up workflow to provision and deploy to Azure completed in 1 minute 49 seconds.
    ```

## Browse your Aspire app

1. In the deployment output, find the URL for the `webfrontend` service. It looks similar to:

   ```
   webfrontend: https://webfrontend-xxxxx.azurewebsites.net
   ```

1. Copy the URL and open it in a new browser tab.

   You see the Aspire starter app running in Azure App Service. The web frontend communicates with the API service, demonstrating the distributed architecture.

1. Try navigating through the app to verify it's working correctly.

1. To view the Aspire Dashboard, find the **Aspire Dashboard** URL in the deployment output and open it in a new browser tab.

    :::image type="content" source="media/quickstart-dotnet-aspire/aspire-dashboard.png" alt-text="A screenshot of the Aspire dashboard of an app running in Azure App Service.":::

## View deployment details in Azure portal

1. Navigate to the [Azure portal](https://portal.azure.com).
1. In the search bar, type **resource groups** and select **Resource Groups**.
1. Find and select the resource group created by azd (it starts with `rg-` followed by your environment name).

    :::image type="content" source="media/quickstart-dotnet-aspire/resource-group-view.png" alt-text="A screenshot of the resource group view of an Aspire app deployed by AZD.":::

    You should see the following resources:

   - **App Service Plan**: The hosting infrastructure
   - **App Services**: Your webfrontend and apiservice apps
   - **Aspire Dashboard**: A managed Azure resource, protected by resource backed access control (RBAC).
   - **Container Registry**: Stores your container images
   - **User Assigned Identity**: Provides secure access between services

## Clean up resources

When you no longer need the Azure resources, delete them to avoid incurring charges.

1. In your codespace terminal, run:

   ```bash
   azd down
   ```

1. When prompted, confirm you want to delete the resources.
1. Select **Yes** to permanently delete the resource group and all resources.

The command removes all Azure resources created during this quickstart.

## Frequently asked questions

- [Do I need an App Service environment to run Aspire apps?](#do-i-need-an-app-service-environment-to-run-aspire-apps)
- [How do I customize my App Service deployment?](#how-do-i-customize-my-app-service-deployment)

### Do I need an App Service environment to run Aspire apps?

No, you don't need an [App Service environment](environment/overview.md) to run Aspire apps in Azure App Service. The `AddAzureAppServiceEnvironment` method creates an Aspire environment concept that represents the hosting infrastructure for your application, which happens to be App Service in this case. Despite its name, it doesn't refer to App Service environments.

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

For more information, see [Configure an Aspire app for Azure App Service](configure-language-dotnet-aspire.md).

## Next steps

You successfully deployed an Aspire app to Azure App Service! Here are some next steps to explore:

> [!div class="nextstepaction"]
> [Configure an Aspire app for Azure App Service](configure-language-dotnet-aspire.md)

> [!div class="nextstepaction"]
> [Azure App Service documentation](overview.md)

### Explore Azure App Service features

- [Configure custom domains and SSL](tutorial-secure-domain-certificate.md)
- [Set up staging environments](deploy-staging-slots.md)
- [Configure authentication](overview-authentication-authorization.md)
