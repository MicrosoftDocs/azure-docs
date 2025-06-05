---
title: "Quickstart: Deploy an ASP.NET web app"
description: Learn how to run web apps in Azure App Service by deploying your first ASP.NET app.
ms.assetid: b1e6bd58-48d1-4007-9d6c-53fd6db061e3
ms.topic: quickstart
ms.date: 04/17/2025
zone_pivot_groups: app-service-ide
adobe-target: true
adobe-target-activity: DocsExp–386541–A/B–Enhanced-Readability-Quickstarts–2.19.2021
adobe-target-experience: Experience B
adobe-target-content: ./quickstart-dotnetcore-uiex
author: cephalin
ms.author: cephalin
ms.custom: devx-track-csharp, mvc, devcenter, vs-azure, devdivchpfy22, devx-track-azurepowershell, devx-track-dotnet, ai-video-demo, devx-track-extended-azdevcli
ai-usage: ai-assisted
ms.collection: ce-skilling-ai-copilot
#customer intent: As a .NET developer, I want to deploy a web app to Azure App Services by using my preferred development process.
---

<!-- NOTES:

I'm a .NET developer who wants to deploy my web app to App Service. I might develop apps with
Visual Studio, Visual Studio for Mac, Visual Studio Code, or the .NET SDK/CLI. This article
should be able to guide .NET devs, whether they're app is .NET Core, .NET, or .NET Framework.

As a .NET developer, when choosing an IDE and .NET TFM - you map to various OS requirements.
For example, if you choose Visual Studio - you're developing the app on Windows, but you can still
target cross-platform with .NET 8.0.

| .NET / IDE         | Visual Studio | Visual Studio for Mac | Visual Studio Code | Command line   |
|--------------------|---------------|-----------------------|--------------------|----------------|
| .NET 8.0           | Windows       | macOS                 | Cross-platform     | Cross-platform |
| .NET Framework 4.8 | Windows       | N/A                   | Windows            | Windows        |

-->

# Quickstart: Deploy an ASP.NET web app

In this quickstart, you learn how to create and deploy your first ASP.NET web app to [Azure App Service](overview.md). App Service supports various versions of .NET apps. It provides a highly scalable, self-patching web hosting service. ASP.NET web apps are cross-platform and can be hosted on Linux or Windows. When you're finished, you have an Azure resource group that includes an App Service hosting plan and an App Service with a deployed web application.

Alternatively, you can deploy an ASP.NET web app as part of a [Windows or Linux container in App Service](quickstart-custom-container.md).

> [!TIP]
> Find GitHub Copilot tips in the Visual Studio, Visual Studio Code, and Azure portal steps.

## Prerequisites

:::zone target="docs" pivot="development-environment-vs"

### [.NET 8.0](#tab/net80)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- <a href="https://www.visualstudio.com/downloads" target="_blank">Visual Studio 2022</a> with the **ASP.NET and web development** workload.
- **(Optional)** To try GitHub Copilot, a [GitHub Copilot account](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor). A 30-day free trial is available.

### [.NET Framework 4.8](#tab/netframework48)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- <a href="https://www.visualstudio.com/downloads" target="_blank">Visual Studio 2022</a> with the **ASP.NET and web development** workload. Ensure the optional checkbox **.NET Framework project and item templates** is selected.
- **(Optional)** To try GitHub Copilot, a [GitHub Copilot account](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor). A 30-day free trial is available.

-----

If you already installed Visual Studio 2022:

1. Install the latest updates in Visual Studio by selecting **Help** > **Check for Updates**.
1. Add the workload by selecting **Tools** > **Get Tools and Features**.

:::zone-end

:::zone target="docs" pivot="development-environment-vscode"

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- <a href="https://www.visualstudio.com/downloads" target="_blank">Visual Studio Code</a>.
- The <a href="https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack" target="_blank">Azure Tools</a> extension.
- <a href="https://dotnet.microsoft.com/download/dotnet/8.0" target="_blank">The latest .NET 8.0 SDK.</a>
- **(Optional)** To try GitHub Copilot, a [GitHub Copilot account](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor). A 30-day free trial is available.

:::zone-end

<!-- markdownlint-disable MD044 -->
:::zone target="docs" pivot="development-environment-cli"
<!-- markdownlint-enable MD044 -->

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- The <a href="/cli/azure/install-azure-cli" target="_blank">Azure CLI</a>.
- <a href="https://dotnet.microsoft.com/download/dotnet/8.0" target="_blank">The latest .NET 8.0 SDK.</a>
- **(Optional)** To try GitHub Copilot, a [GitHub Copilot account](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor). A 30-day free trial is available.

:::zone-end

<!-- markdownlint-disable MD044 -->
:::zone target="docs" pivot="development-environment-ps"
<!-- markdownlint-enable MD044 -->

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- The <a href="/powershell/azure/install-az-ps" target="_blank">Azure PowerShell</a>.
- <a href="https://dotnet.microsoft.com/download/dotnet/8.0" target="_blank">The latest .NET 8.0 SDK.</a>

:::zone-end

:::zone target="docs" pivot="development-environment-azure-portal"

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- A GitHub account [Create an account for free](https://github.com/).

:::zone-end

:::zone target="docs" pivot="development-environment-vs, development-environment-azure-portal, development-environment-ps, development-environment-vscode, development-environment-cli"

## Skip to the end

You can quickly deploy the ASP.NET Core sample app in this tutorial using Azure Developer CLI and see it running in Azure. Just run the following commands in the [Azure Cloud Shell](https://shell.azure.com), and follow the prompt:

```bash
mkdir dotnetcore-quickstart
cd dotnetcore-quickstart
azd init --template https://github.com/Azure-Samples/quickstart-deploy-aspnet-core-app-service.git
azd up
```

And, to delete the resources:

```bash
azd down
```

## Create an ASP.NET web app

:::zone-end

:::zone target="docs" pivot="development-environment-vs"

### [.NET 8.0](#tab/net80)

1. Open Visual Studio and then select **Create a new project**.
1. In **Create a new project**, find and select **ASP.NET Core Web App (Razor Pages)**, then select **Next**.
1. In **Configure your new project**, name the application *MyFirstAzureWebApp*, and then select **Next**.

   :::image type="content" source="./media/quickstart-dotnetcore/configure-web-app-project.png" alt-text="Screenshot of Visual Studio - Configure ASP.NET 8.0 web app." lightbox="media/quickstart-dotnetcore/configure-web-app-project.png" border="true":::

1. Select **.NET 8.0 (Long Term Support)**.
1. Ensure **Authentication type** is set to **None**. Select **Create**.

   :::image type="content" source="media/quickstart-dotnetcore/vs-additional-info-net-80.png" alt-text="Screenshot of Visual Studio - Additional info when selecting .NET 8.0." lightbox="media/quickstart-dotnetcore/vs-additional-info-net-80.png" border="true":::

1. From the Visual Studio menu, select **Debug** > **Start Without Debugging** to run the web app locally. If you see a message asking you to trust a self-signed certificate, select **Yes**.

   :::image type="content" source="media/quickstart-dotnetcore/local-web-app-net.png" alt-text="Screenshot of Visual Studio - ASP.NET Core 8.0 running locally." lightbox="media/quickstart-dotnetcore/local-web-app-net.png" border="true":::

### [.NET Framework 4.8](#tab/netframework48)

1. Open Visual Studio and then select **Create a new project**.
1. In **Create a new project**, find and select **ASP.NET Web Application (.NET Framework)**, then select **Next**.
1. In **Configure your new project**, name the application *MyFirstAzureWebApp*, and then select **Create**.

   :::image type="content" source="media/quickstart-dotnet/configure-web-app-net-framework-48.png" alt-text="Screenshot of Visual Studio - Configure ASP.NET Framework 4.8 web app." lightbox="media/quickstart-dotnet/configure-web-app-net-framework-48.png" border="true":::

1. Select the **MVC** template.
1. Ensure **Authentication** is set to **No Authentication**. Select **Create**.

   :::image type="content" source="media/quickstart-dotnetcore/vs-mvc-no-auth-net-framework-48.png" alt-text="Screenshot of Visual Studio - Select the MVC template." lightbox="media/quickstart-dotnetcore/vs-mvc-no-auth-net-framework-48.png" border="true":::

1. From the Visual Studio menu, select **Debug** > **Start Without Debugging** to run the web app locally.

   :::image type="content" source="media/quickstart-dotnetcore/vs-local-web-app-net-framework-48.png" alt-text="Screenshot of Visual Studio - ASP.NET Framework 4.8 running locally." lightbox="media/quickstart-dotnetcore/vs-local-web-app-net-framework-48.png" border="true":::

-----

> [!TIP]
> If you have a GitHub Copilot account, try [getting GitHub Copilot features for Visual Studio](https://visualstudio.microsoft.com/github-copilot/).

:::zone-end

<!-- markdownlint-disable MD044 -->
:::zone target="docs" pivot="development-environment-vscode,development-environment-cli,development-environment-ps"
<!-- markdownlint-enable MD044 -->

1. Open a terminal window on your machine to a working directory. Create a new .NET web app using the [dotnet new webapp](/dotnet/core/tools/dotnet-new#web-options) command, and then change directories into the newly created app.

   <!-- Please keep the following commands in two lines instead of one && separated line. The latter doesn't work in PowerShell -->

   ```dotnetcli
   dotnet new webapp -n MyFirstAzureWebApp --framework net8.0
   cd MyFirstAzureWebApp
   ```

1. From the same terminal session, run the application locally using the [dotnet run](/dotnet/core/tools/dotnet-run) command.

   ```dotnetcli
   dotnet run --urls=https://localhost:5001/
   ```

1. Open a web browser, and navigate to the app at `https://localhost:5001`.

   You see the template ASP.NET Core 8.0 web app displayed in the page.

   :::image type="content" source="media/quickstart-dotnetcore/local-web-app-net.png" alt-text="Screenshot of Visual Studio Code - ASP.NET Core 8.0 in local browser." lightbox="media/quickstart-dotnetcore/local-web-app-net.png" border="true":::

:::zone-end

:::zone target="docs" pivot="development-environment-azure-portal"

In this step, you fork a demo project to deploy.

### [.NET 8.0](#tab/net80)

1. Go to the [.NET 8.0 sample app](https://github.com/Azure-Samples/dotnetcore-docs-hello-world).
1. Select the **Fork** button in the upper right on the GitHub page.
1. Select the **Owner** and leave the default **Repository name**.
1. Select **Create fork**.

### [.NET Framework 4.8](#tab/netframework48)

1. Go to the [.NET Framework 4.8 sample app](https://github.com/Azure-Samples/app-service-web-dotnet-get-started).
1. Select the **Fork** button in the upper right on the GitHub page.
1. Select the **Owner** and leave the default **Repository name**.
1. Select **Create fork**.

-----

:::zone-end

## Publish your web app

Follow these steps to create your App Service resources and publish your project:

:::zone target="docs" pivot="development-environment-vs"

1. In **Solution Explorer**, right-click the **MyFirstAzureWebApp** project and select **Publish**.
1. In **Publish**, select **Azure** and then **Next**.

   :::image type="content" source="media/quickstart-dotnetcore/vs-publish-target-azure.png" alt-text="Screenshot of Visual Studio - Publish the web app and target Azure." lightbox="media/quickstart-dotnetcore/vs-publish-target-azure.png" border="true":::

1. Choose the **Specific target**, either **Azure App Service (Linux)** or **Azure App Service (Windows)**. Select **Next**.

   > [!IMPORTANT]
   > When targeting ASP.NET Framework 4.8, use **Azure App Service (Windows)**.

1. Your options depend on whether you're signed in to Azure already and whether you have a Visual Studio account linked to an Azure account. Select either **Add an account** or **Sign in** to sign in to your Azure subscription. If you're already signed in, select the account you want.

   :::image type="content" source="media/quickstart-dotnetcore/sign-in-azure.png" border="true" alt-text="Screenshot of Visual Studio - Select sign in to Azure dialog." lightbox="media/quickstart-dotnetcore/sign-in-azure.png" :::

1. To the right of **App Service instances**, select **+**.

   :::image type="content" source="media/quickstart-dotnetcore/publish-new-app-service.png" border="true" alt-text="Screenshot of Visual Studio - New App Service app dialog." lightbox="media/quickstart-dotnetcore/publish-new-app-service.png" :::

1. For **Subscription**, accept the subscription that is listed or select a new one from the drop-down list.
1. For **Resource group**, select **New**. In **New resource group name**, enter *myResourceGroup* and select **OK**.
1. For **Hosting Plan**, select **New**.
1. In the **Hosting Plan: Create new** dialog, enter the values specified in the following table:

   | Setting          | Suggested value          | Description                                                           |
   |------------------|--------------------------|-----------------------------------------------------------------------|
   | **Hosting Plan** | *MyFirstAzureWebAppPlan* | Name of the App Service plan.                                         |
   | **Location**     | *West Europe*            | The datacenter where the web app is hosted.                           |
   | **Size**         | Choose the lowest tier.                   | [Pricing tiers][app-service-pricing-tier] define hosting features. |

1. In **Name**, enter a unique app name. Include only characters `a-z`, `A-Z`, `0-9`, and `-`. You can accept the automatically generated unique name. 
1. Select **Create** to create the Azure resources.

   :::image type="content" source="media/quickstart-dotnetcore/web-app-name.png" border="true" alt-text="Screenshot of Visual Studio - Create app resources dialog." lightbox="media/quickstart-dotnetcore/web-app-name.png" :::

   When the process completes, the Azure resources are created for you. You're ready to publish your ASP.NET Core project.

1. In the **Publish** dialog, ensure your new App Service app is selected, then select **Finish**, then select **Close**. Visual Studio creates a publish profile for you for the selected App Service app.

1. In the **Publish** page, select **Publish**. If you see a warning message, select **Continue**.

   Visual Studio builds, packages, and publishes the app to Azure, and then launches the app in the default browser.

   ### [.NET 8.0](#tab/net80)

   You see the ASP.NET Core 8.0 web app displayed in the page.

   :::image type="content" source="media/quickstart-dotnetcore/azure-web-app-net.png" lightbox="media/quickstart-dotnetcore/azure-web-app-net.png" border="true" alt-text="Screenshot of Visual Studio - ASP.NET Core 8.0 web app in Azure." :::

   ### [.NET Framework 4.8](#tab/netframework48)

   You see the ASP.NET Framework 4.8 web app displayed in the page.

   :::image type="content" source="media/quickstart-dotnetcore/vs-azure-web-app-net-48.png" lightbox="media/quickstart-dotnetcore/vs-azure-web-app-net-48.png" border="true" alt-text="Screenshot of Visual Studio - ASP.NET Framework 4.8 web app in Azure.":::

   -----

:::zone-end

:::zone target="docs" pivot="development-environment-vscode"

<!-- :::image type="content" source="media/quickstart-dotnet/vscode-sign-in-to-Azure.png" alt-text="Screenshot of Visual Studio Code - Sign in to Azure." border="true"::: -->

1. Open Visual Studio Code from your project's root directory.

   ```terminal
   code .
   ```

1. If prompted, select **Yes, I trust the authors.**

   > [!TIP]
   > If you have a GitHub Copilot account, try [getting GitHub Copilot features for Visual Studio Code](https://code.visualstudio.com/docs/copilot/overview).

1. In Visual Studio Code, select **View** > **Command Palette** to open the [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).
1. Search for and select *Azure App Service: Create New Web App (Advanced)*.
1. Respond to the prompts as follows:

   1. If prompted, sign in to your Azure account.
   1. Select your **Subscription**.
   1. Select **Create new Web App... Advanced**.
   1. For **Enter a globally unique name for the new web app**, use a name that's unique across all of Azure. Valid characters are `a-z`, `0-9`, and `-`. A good pattern is to use a combination of your company name and an app identifier.
   1. Select **Create new resource group** and provide a name like `myResourceGroup`.
   1. When prompted to **Select a runtime stack**, select **.NET 8 (LTS)**.
   1. Select an operating system (Windows or Linux).
   1. Select a location near you.
   1. Select **Create new App Service plan**, provide a name, and select the **Free (F1)** [pricing tier][app-service-pricing-tier].
   1. For the Application Insights resource, select **Skip for now** for the Application Insights resource.
   1. When prompted, select **Deploy**.
   1. Select *MyFirstAzureWebApp* as the folder to deploy.
   1. Select **Add Config** when prompted.

1. In the dialog **Always deploy the workspace "MyFirstAzureWebApp" to \<app-name>"**, select **Yes** so that Visual Studio Code deploys to the same App Service app every time you're in that workspace.
1. When publishing completes, select **Browse Website** in the notification and select **Open** when prompted.

   You see the ASP.NET Core 8.0 web app displayed in the page.

   :::image type="content" source="media/quickstart-dotnetcore/azure-web-app-net.png" lightbox="media/quickstart-dotnetcore/azure-web-app-net.png" border="true" alt-text="Screenshot of Visual Studio Code - ASP.NET Core 8.0 web app in Azure.":::

:::zone-end

<!-- markdownlint-disable MD044 -->
:::zone target="docs" pivot="development-environment-cli"
<!-- markdownlint-enable MD044 -->

1. Sign into your Azure account by using the [az login](/cli/azure/reference-index#az-login) command and following the prompt:

   ```azurecli
   az login
   ```

   - If the `az` command isn't recognized, ensure that you have the Azure CLI installed as described in [Prerequisites](#prerequisites).

1. Use [az webapp up](/cli/azure/webapp#az-webapp-up) to deploy the code in your local *MyFirstAzureWebApp* directory:

   ```azurecli
   az webapp up --sku F1 --name <app-name> --os-type <os>
   ```

   - Replace `<app-name>` with a name that's unique across all of Azure. Valid characters are `a-z`, `0-9`, and `-`. A good pattern is to use a combination of your company name and an app identifier.
   - The `--sku F1` argument creates the web app on the **Free** [pricing tier][app-service-pricing-tier]. Omit this argument to use a faster premium tier, which incurs an hourly cost.
   - Replace `<os>` with either `linux` or `windows`.
   - You can optionally include the argument `--location <location-name>` where `<location-name>` is an available Azure region. To get a list of allowable regions for your Azure account, run the [az account list-locations](/cli/azure/appservice#az-appservice-list-locations) command.

   The command might take a few minutes to complete. While it runs, the command provides messages about creating the resource group, the App Service plan, and hosting app, configuring logging, then performing ZIP deployment. Then it shows a message with the app's URL.

1. Open a web browser and navigate to the URL. You see the ASP.NET Core 8.0 web app displayed in the page.

   :::image type="content" source="media/quickstart-dotnetcore/azure-web-app-net.png" lightbox="media/quickstart-dotnetcore/azure-web-app-net.png" border="true" alt-text="Screenshot of the CLI - ASP.NET Core 8.0 web app in Azure.":::

:::zone-end

<!-- markdownlint-disable MD044 -->
:::zone target="docs" pivot="development-environment-ps"
<!-- markdownlint-enable MD044 -->

> [!NOTE]
> We recommend Azure PowerShell for creating apps on the Windows hosting platform. To create apps on Linux, use a different tool, such as [Azure CLI](quickstart-dotnetcore.md?pivots=development-environment-cli).

1. Sign into your Azure account by using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command and following the prompt:

   ```azurepowershell
   Connect-AzAccount
   ```
   <!-- ### [Deploy to Windows](#tab/windows) -->
1. Create a new app by using the [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) command:

   ```azurepowershell
   New-AzWebApp -ResourceGroupName myResourceGroup -Name <app-name> -Location westeurope
   ```

   - Replace `<app-name>` with a name that's unique across all of Azure. Valid characters are `a-z`, `0-9`, and `-` A combination of your company name and an app identifier is a good pattern.
   - You can optionally include the parameter `-Location <location-name>` where `<location-name>` is an available Azure region. To get a list of allowable regions for your Azure account, run the [Get-AzLocation](/powershell/module/az.resources/get-azlocation) command.

   The command might take a few minutes to complete. The command creates a resource group, an App Service plan, and the App Service resource.

    <!-- ### [Deploy to Linux](#tab/linux)
    
    2. Create the Azure resources you need:
    
        ```azurepowershell
        New-AzResourceGroup -Name myResourceGroup -Location westeurope
        New-AzAppServicePlan -ResourceGroupName myResourceGroup -Name myAppServicePlan -Location westeurope -Linux
        New-AzWebApp -ResourceGroupName myResourceGroup -AppServicePlan myAppServicePlan -Name <app-name>
        Set-AzWebApp -
        ```
    
        - Replace `<app-name>` with a name that's unique across all of Azure (*valid characters are `a-z`, `0-9`, and `-`*). A good pattern is to use a combination of your company name and an app identifier.
        - You can optionally specify a different location in the `-Location` parameter. You can retrieve a list of allowable regions for your Azure account by running the [`Get-AzLocation`](/powershell/module/az.resources/get-azlocation) command.
        - [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) creates a resource group to contain the resources.
        - [New-AzAppServicePlan](/powershell/module/az.websites/new-azappserviceplan) uses `-Linux` to create a Linux App Service plan, which hosts your app. The default pricing tier is `Free`, but you can change it with the `-Tier` parameter.
        - [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) creates the app itself.
    
    --- -->

1. From the application root folder, run the [dotnet publish](/dotnet/core/tools/dotnet-publish) command to prepare your local *MyFirstAzureWebApp* application for deployment:

   ```dotnetcli
   dotnet publish --configuration Release
   ```

1. Change to the release directory and create a zip file from the contents:

   ```powershell
   cd bin\Release\net8.0\publish
   Compress-Archive -Path * -DestinationPath deploy.zip
   ```

1. Publish the zip file to the Azure app using the [Publish-AzWebApp](/powershell/module/az.websites/publish-azwebapp) command:

   ```azurepowershell
   Publish-AzWebApp -ResourceGroupName myResourceGroup -Name <app-name> -ArchivePath (Get-Item .\deploy.zip).FullName -Force
   ```

   > [!NOTE]
   > `-ArchivePath` needs the full path of the zip file.

1. Open a web browser and navigate to the URL. You see the ASP.NET Core 8.0 web app displayed in the page.

   :::image type="content" source="media/quickstart-dotnetcore/azure-web-app-net.png" lightbox="media/quickstart-dotnetcore/azure-web-app-net.png" border="true" alt-text="Screenshot of the CLI - ASP.NET Core 8.0 web app in Azure.":::

:::zone-end

:::zone target="docs" pivot="development-environment-azure-portal"

1. Type **app services** in the search. Under **Services**, select **App Services**.

   :::image type="content" source="./media/quickstart-dotnetcore/portal-search.png" alt-text="Screenshot of portal search in the Azure portal." lightbox="./media/quickstart-dotnetcore/portal-search.png":::

1. In the **App Services** page, select **Create** > **Web App**.

1. In the **Basics** tab:

   ### [.NET 8.0](#tab/net80)

   - Under **Resource group**, select **Create new**. Enter *myResourceGroup* for the name.
   - Under **Name**, enter a globally unique name for your web app.
   - Under **Publish**, select *Code*.
   - Under **Runtime stack** select *.NET 8 (LTS)*.
   - Under **Operating System**, select **Windows**. If you select **Linux**, you can't configure GitHub deployment in the next step, but you can still do it after you create the app in the **Deployment Center** page.
   - Select a **Region** you want to serve your app from.
   - Under **App Service Plan**, select **Create new** and type *myAppServicePlan* for the name.
   - Under **Pricing plan**, select **Free F1**.

   :::image type="content" source="./media/quickstart-dotnetcore/app-service-details-net-80.png" lightbox="./media/quickstart-dotnetcore/app-service-details-net-80.png" alt-text="Screenshot of new App Service app configuration for .NET 8 in the Azure portal.":::

   ### [.NET Framework 4.8](#tab/netframework48)

   - Under **Resource group**, select **Create new**. Enter *myResourceGroup* for the name.
   - Under **Name**, enter a globally unique name for your web app.
   - Under **Publish**, select *Code*.
   - Under **Runtime stack** select *ASP.NET V4.8*.
   - Select an **Operating System**, and a **Region** you want to serve your app from.
   - Under **App Service Plan**, select **Create new** and type *myAppServicePlan* for the name.
   - Under **Pricing plan**, select **Free F1**.

   :::image type="content" source="./media/quickstart-dotnetcore/app-service-details-net-48.png" lightbox="./media/quickstart-dotnetcore/app-service-details-net-48.png" alt-text="Screenshot of new App Service app configuration for .NET Framework V4.8 in the Azure portal.":::
   -----

1. Select the **Deployment** tab at the top of the page

1. Under **GitHub Actions settings**, set **Continuous deployment** to *Enable*.

1. Under **GitHub Actions details**, authenticate with your GitHub account, and select the following options:

   ### [.NET 8.0](#tab/net80)

   - For **Organization**, select the organization where you forked the demo project.
   - For **Repository**, select the *dotnetcore-docs-hello-world* project.
   - For **Branch**, select *main*.

   :::image type="content" source="media/quickstart-dotnetcore/app-service-deploy-80.png" lightbox="media/quickstart-dotnetcore/app-service-deploy-80.png" border="true" alt-text="Screenshot of the deployment options for an app using the .NET 8 runtime.":::

   ### [.NET Framework 4.8](#tab/netframework48)

   - For **Organization**, select the organization where you forked the demo project.
   - For **Repository**, select the *app-service-web-dotnet-get-started* project.
   - For **Branch**, select *main*.

   :::image type="content" source="media/quickstart-dotnet/app-service-deploy-48.png" lightbox="media/quickstart-dotnet/app-service-deploy-48.png" border="true" alt-text="Screenshot of the deployment options for an app using the .NET Framework 4.8 runtime.":::
   -----

   > [!NOTE]
   > By default, the resource creation [disables basic authentication](configure-basic-auth-disable.md). It creates the GitHub Actions deployment by using a [user-assigned identity](deploy-continuous-deployment.md#what-does-the-user-assigned-identity-option-do-for-github-actions). If you get a permissions error during resource creation, your Azure account might not have [enough permissions](deploy-continuous-deployment.md#why-do-i-see-the-error-you-do-not-have-sufficient-permissions-on-this-app-to-assign-role-based-access-to-a-managed-identity-and-configure-federated-credentials). You can [configure GitHub Actions deployment later](deploy-continuous-deployment.md) with an identity generated for you by an Azure administrator, or you enable basic authentication instead.

1. Select **Review + create** at the bottom of the page.

1. After validation runs, select **Create** at the bottom of the page.

1. After deployment is complete, select **Go to resource**.

   :::image type="content" source="./media/quickstart-dotnet/next-steps.png" alt-text="Screenshot of the next step of going to the resource.":::

1. To browse to the created app, select the **default domain** in the **Overview** page. If you see the message *Your web app is running and waiting for your content*, GitHub deployment is still running. Wait a couple of minutes and refresh the page.

   ### [.NET 8.0](#tab/net80)

   :::image type="content" source="media/quickstart-dotnetcore/browse-dotnet-80.png" lightbox="media/quickstart-dotnetcore/browse-dotnet-80.png" border="true" alt-text="Screenshot of the deployed .NET 8.0 sample app.":::

   ### [.NET Framework 4.8](#tab/netframework48)

   :::image type="content" source="media/quickstart-dotnet/browse-dotnet-48.png" lightbox="media/quickstart-dotnet/browse-dotnet-48.png" border="true" alt-text="Screenshot of the deployed .NET Framework 4.8 sample app.":::
   -----

:::zone-end

## Update the app and redeploy

Make a change to *Index.cshtml* and redeploy to see the changes. In the .NET 8.0 template, it's in the *Pages* folder. In the .NET Framework 4.8 template, it's in the *Views/Home* folder. Follow these steps to update and redeploy your web app:

:::zone target="docs" pivot="development-environment-vs"

1. In **Solution Explorer**, under your project, double-click *Pages* > *Index.cshtml* to open.
1. Replace the first `<div>` element with the following code:

   ```html
   <div class="jumbotron">
       <h1>.NET 💜 Azure</h1>
       <p class="lead">Example .NET app to Azure App Service.</p>
   </div>
   ```

   > [!TIP]
   > With GitHub Copilot enabled in Visual Studio, try the following steps:
   >
   > 1. Select the `<div>` element and type <kbd>Alt</kbd>+<kbd>/</kbd>.
   > 1. Ask Copilot, "Change to a Bootstrap card that says .NET 💜 Azure."

   Save your changes.

1. To redeploy to Azure, right-click the **MyFirstAzureWebApp** project in **Solution Explorer** and select **Publish**.
1. In the **Publish** summary page, select **Publish**.

   When publishing completes, Visual Studio launches a browser to the URL of the web app.

   ### [.NET 8.0](#tab/net80)

   You see the updated ASP.NET Core 8.0 web app displayed in the page.

   :::image type="content" source="media/quickstart-dotnetcore/updated-azure-web-app-net.png" lightbox="media/quickstart-dotnetcore/updated-azure-web-app-net.png" border="true" alt-text="Screenshot of Visual Studio - Updated ASP.NET Core 8.0 web app in Azure.":::

   ### [.NET Framework 4.8](#tab/netframework48)

   You see the updated ASP.NET Framework 4.8 web app displayed in the page.

   :::image type="content" source="media/quickstart-dotnetcore/vs-updated-azure-web-app-net-48.png" lightbox="media/quickstart-dotnetcore/vs-updated-azure-web-app-net-48.png" border="true" alt-text="Screenshot of Visual Studio - Updated ASP.NET Framework 4.8 web app in Azure.":::
   -----

:::zone-end

:::zone target="docs" pivot="development-environment-vscode"

1. Open *Pages/Index.cshtml*.
1. Replace the first `<div>` element with the following code:

   ```html
   <div class="jumbotron">
       <h1>.NET 💜 Azure</h1>
       <p class="lead">Example .NET app to Azure App Service.</p>
   </div>
   ```

   > [!TIP]
   > Try this approach with GitHub Copilot:
   >
   > 1. Select the entire `<div>` element and select :::image type="icon" source="media/quickstart-dotnetcore/github-copilot-in-editor.png" border="false":::.
   > 1. Ask Copilot, "Change to a Bootstrap card that says .NET 💜 Azure."

   Save your changes.

1. In Visual Studio Code, open the [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette): <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>.
1. Search for and select *Azure App Service: Deploy to Web App*.
1. Select the subscription and the web app you used earlier.
1. When prompted, select **Deploy**.
1. When publishing completes, select **Browse Website** in the notification.

   You see the updated ASP.NET Core 8.0 web app displayed in the page.

   :::image type="content" source="media/quickstart-dotnetcore/updated-azure-web-app-net.png" lightbox="media/quickstart-dotnetcore/updated-azure-web-app-net.png" border="true" alt-text="Screenshot of Visual Studio Code - Updated ASP.NET Core 8.0 web app in Azure.":::

:::zone-end

<!-- markdownlint-disable MD044 -->
:::zone target="docs" pivot="development-environment-cli,development-environment-ps"
> [!TIP]
> To see how Visual Studio Code with GitHub Copilot helps improve your web development experience, see the Visual Studio Code steps.
<!-- markdownlint-enable MD044 -->

:::zone-end

<!-- markdownlint-disable MD044 -->
:::zone target="docs" pivot="development-environment-cli"
<!-- markdownlint-enable MD044 -->

In the local directory, open the *Pages/Index.cshtml* file. Replace the first `<div>` element:

```html
<div class="jumbotron">
    <h1>.NET 💜 Azure</h1>
    <p class="lead">Example .NET app to Azure App Service.</p>
</div>
```

Save your changes, then redeploy the app using the `az webapp up` command again and replace `<os>` with either `linux` or `windows`.

```azurecli
az webapp up --os-type <os>
```

This command uses values that are cached locally in the *.azure/config* file, including the app name, resource group, and App Service plan.

After deployment completes, switch back to the browser window that opened in the **Browse to the app** step, and refresh.

You see the updated ASP.NET Core 8.0 web app displayed in the page.

:::image type="content" source="media/quickstart-dotnetcore/updated-azure-web-app-net.png" lightbox="media/quickstart-dotnetcore/updated-azure-web-app-net.png" border="true" alt-text="Screenshot of the CLI - Updated ASP.NET Core 8.0 web app in Azure.":::

:::zone-end

<!-- markdownlint-disable MD044 -->
:::zone target="docs" pivot="development-environment-ps"
<!-- markdownlint-enable MD044 -->

1. In the local directory, open the *Pages/Index.cshtml* file. Replace the first `<div>` element:

   ```html
   <div class="jumbotron">
       <h1>.NET 💜 Azure</h1>
       <p class="lead">Example .NET app to Azure App Service.</p>
   </div>
   ```

1. From the application root folder, prepare your local *MyFirstAzureWebApp* application for deployment using the [dotnet publish](/dotnet/core/tools/dotnet-publish) command:

   ```dotnetcli
   dotnet publish --configuration Release
   ```

1. Change to the release directory and create a zip file from the contents:

   ```powershell
   cd bin\Release\net8.0\publish
   Compress-Archive -Path * -DestinationPath deploy.zip -Force
   ```

1. Publish the zip file to the Azure app using the [Publish-AzWebApp](/powershell/module/az.websites/publish-azwebapp) command:

   ```azurepowershell
   Publish-AzWebApp -ResourceGroupName myResourceGroup -Name <app-name> -ArchivePath (Get-Item .\deploy.zip).FullName -Force
   ```

   > [!NOTE]
   > `-ArchivePath` needs the full path of the zip file.

1. After deployment completes, switch back to the browser window that opened in the **Browse to the app** step, and refresh.

   You see the updated ASP.NET Core 8.0 web app displayed in the page.

   :::image type="content" source="media/quickstart-dotnetcore/updated-azure-web-app-net.png" lightbox="media/quickstart-dotnetcore/updated-azure-web-app-net.png" border="true" alt-text="Screenshot of the CLI - Updated ASP.NET Core 8.0 web app in Azure.":::

:::zone-end

:::zone target="docs" pivot="development-environment-azure-portal"

1. Browse to your GitHub fork of the sample code.

1. On your repo page, create a codespace by selecting **Code** > **Create codespace on main**.

   ### [.NET 8.0](#tab/net80)

   :::image type="content" source="media/quickstart-dotnetcore/github-forked-dotnetcore-docs-hello-world-repo-create-codespace.png" alt-text="Screenshot showing how to create a codespace in the forked dotnetcore-docs-hello-world GitHub repo.":::

   ### [.NET Framework 4.8](#tab/netframework48)

   :::image type="content" source="media/quickstart-dotnetcore/github-forked-app-service-web-dotnet-get-started-repo-create-codespace.png" alt-text="Screenshot showing how to create a codespace in the forked app-service-web-dotnet-get-started GitHub repo.":::
   -----

   > [!TIP]
   > If you have a GitHub Copilot account, try [getting GitHub Copilot features in your codespace](https://docs.github.com/codespaces/reference/using-github-copilot-in-github-codespaces).

1. Open *Index.cshtml*.

   ### [.NET 8.0](#tab/net80)

   Index.cshtml is located in the *Pages* folder.

   :::image type="content" source="media/quickstart-dotnetcore/index-cshtml-in-explorer-dotnetcore.png" alt-text="Screenshot of the Explorer window from Visual Studio Code in the browser, highlighting the Index.cshtml in the dotnetcore-docs-hello-world repo.":::

   ### [.NET Framework 4.8](#tab/netframework48)

   Index.cshtml is located in the *aspnet-get-started/Views/Home* folder

   :::image type="content" source="media/quickstart-dotnetcore/index-cshtml-in-explorer-dotnet-framework.png" alt-text="Screenshot of the Explorer window from Visual Studio Code in the browser, highlighting the Index.cshtml in the app-service-web-dotnet-get-started repo.":::
   -----

1. Replace the first `<div>` element with the following code:

   ```html
   <div class="jumbotron">
       <h1>.NET 💜 Azure</h1>
       <p class="lead">Example .NET app to Azure App Service.</p>
   </div>
   ```

   The changes are automatically saved.

   > [!TIP]
   > Try this approach with GitHub Copilot:
   >
   > 1. Select the entire `<div>` element and select :::image type="icon" source="media/quickstart-dotnetcore/github-copilot-in-editor.png" border="false":::.
   > 1. Ask Copilot, "Change to a Bootstrap card that says .NET 💜 Azure."

1. From the **Source Control** menu, enter a commit message such as `Modify homepage`. Then, select **Commit** and confirm staging the changes by selecting **Yes**.

   ### [.NET 8.0](#tab/net80)

   :::image type="content" source="media/quickstart-dotnetcore/visual-studio-code-in-browser-commit-push-dotnetcore.png" alt-text="Screenshot of Visual Studio Code in the browser, Source Control panel with a commit message of 'We love Azure' and the Commit and Push button highlighted.":::

   ### [.NET Framework 4.8](#tab/netframework48)

   :::image type="content" source="media/quickstart-dotnetcore/visual-studio-code-in-browser-commit-push-dotnet-framework.png" alt-text="Screenshot of Visual Studio Code in the browser, Source Control panel with a commit message of 'We love Azure' and the Commit and Push button highlighted.":::
   -----

   > [!TIP]
   > Let GitHub Copilot create a commit message for you by selecting :::image type="icon" source="media/quickstart-dotnetcore/github-copilot-in-editor.png" border="false"::: in the message box.

1. Select **Sync changes 1**, then confirm by selecting **OK**.

1. It takes a few minutes for the deployment to run. To view the progress, navigate to `https://github.com/<your-github-alias>/dotnetcore-docs-hello-world/actions`.

1. Return to the browser window that opened during the **Browse to the app** step, and refresh the page.

   ### [.NET 8.0](#tab/net80)

   You see the updated ASP.NET Core 8.0 web app displayed in the page.

   :::image type="content" source="media/quickstart-dotnetcore/portal-updated-dotnet-7.png" lightbox="media/quickstart-dotnetcore/portal-updated-dotnet-7.png" border="true" alt-text="Screenshot of the CLI - Updated ASP.NET Core 8.0 web app in Azure.":::

   ### [.NET Framework 4.8](#tab/netframework48)

   You see the updated ASP.NET Framework 4.8 web app displayed in the page.

   :::image type="content" source="media/quickstart-dotnet/updated-azure-webapp-net-48.png" lightbox="media/quickstart-dotnet/updated-azure-webapp-net-48.png" border="true" alt-text="Screenshot of the CLI - Updated ASP.NET Framework 4.8 web app in Azure.":::
   -----

:::zone-end

## Manage the Azure app

To manage your web app, go to the [Azure portal](https://portal.azure.com), and search for and select **App Services**.

:::image type="content" source="media/quickstart-dotnetcore/app-services.png" alt-text="Screenshot of the Azure portal - Select App Services option." lightbox="media/quickstart-dotnetcore/app-services.png":::

On the **App Services** page, select the name of your web app.

:::image type="content" source="./media/quickstart-dotnetcore/select-app-service.png" alt-text="Screenshot of the Azure portal - App Services page with an example web app selected.":::

The **Overview** page for your web app, contains options for basic management like browse, stop, start, restart, and delete. The left menu provides further pages for configuring your app.

:::image type="content" source="media/quickstart-dotnetcore/web-app-overview-page.png" alt-text="Screenshot of the Azure portal - App Service overview page." lightbox="media/quickstart-dotnetcore/web-app-overview-page.png":::

<!--
## Clean up resources - H2 added from the next three includes
-->
:::zone target="docs" pivot="development-environment-vs"
[!INCLUDE [Clean-up Portal web app resources](../../includes/clean-up-section-portal-web-app.md)]
:::zone-end

:::zone target="docs" pivot="development-environment-vscode"
[!INCLUDE [Clean-up Portal web app resources](../../includes/clean-up-section-portal-web-app.md)]
:::zone-end

<!-- markdownlint-disable MD044 -->
:::zone target="docs" pivot="development-environment-cli"
<!-- markdownlint-enable MD044 -->
In the preceding steps, you created Azure resources in a resource group. If you don't expect to need these resources in the future, delete the resource group by running the following command in the Cloud Shell:

```azurecli
az group delete
```

For your convenience, the [az webapp up](/cli/azure/webapp#az-webapp-up) command that you ran earlier in this project saves the resource group name as the default value whenever you run `az` commands from this project.

:::zone-end

:::zone target="docs" pivot="development-environment-ps"
<!-- markdownlint-enable MD044 -->
[!INCLUDE [Clean-up PowerShell resources](../../includes/powershell-samples-clean-up.md)]
:::zone-end
<!-- markdownlint-enable MD044 -->

:::zone target="docs" pivot="development-environment-azure-portal"
<!-- markdownlint-enable MD044 -->
[!INCLUDE [Clean-up Portal web app resources](../../includes/clean-up-section-portal-web-app.md)]
:::zone-end
<!-- markdownlint-enable MD044 -->

## Next steps

### [.NET 8.0](#tab/net80)

Advance to the next article to learn how to create a .NET Core app and connect it to a SQL Database:

> [!div class="nextstepaction"]
> [Tutorial: ASP.NET Core app with SQL database](tutorial-dotnetcore-sqldb-app.md)

> [!div class="nextstepaction"]
> [App Template: ASP.NET Core app with SQL database and App Insights deployed using CI/CD GitHub Actions](https://github.com/Azure-Samples/app-templates-dotnet-azuresql-appservice)

> [!div class="nextstepaction"]
> [Configure ASP.NET Core app](configure-language-dotnetcore.md)

### [.NET Framework 4.8](#tab/netframework48)

Advance to the next article to learn how to create a .NET Framework app and connect it to a SQL Database:

> [!div class="nextstepaction"]
> [Tutorial: ASP.NET app with SQL database](app-service-web-tutorial-dotnet-sqldatabase.md)
>
> [!div class="nextstepaction"]
> [Configure ASP.NET Framework app](configure-language-dotnet-framework.md)

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)

-----

[app-service-pricing-tier]: https://azure.microsoft.com/pricing/details/app-service/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
