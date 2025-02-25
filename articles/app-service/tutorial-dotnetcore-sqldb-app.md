---
#customer intent: As a developer, I want to learn how to deploy an ASP.NET Core web app to Azure App Service and connect to an Azure SQL Database.
title: Deploy ASP.NET Core and Azure SQL Database app
description: Learn how to deploy an ASP.NET Core web app to Azure App Service and connect to an Azure SQL Database.
ms.topic: tutorial
ms.date: 01/31/2025
author: cephalin
ms.author: cephalin
ms.devlang: csharp
ms.service: azure-app-service
ms.custom: devx-track-csharp, mvc, cli-validate, devdivchpfy22, service-connector, devx-track-dotnet, AppServiceConnectivity
zone_pivot_groups: app-service-portal-azd
ms.collection: ce-skilling-ai-copilot
---

# Tutorial: Deploy an ASP.NET Core and Azure SQL Database app to Azure App Service

In this tutorial, you learn how to deploy a data-driven ASP.NET Core app to Azure App Service and connect to an Azure SQL Database. You'll also deploy an Azure Cache for Redis to enable the caching code in your application. Azure App Service is a highly scalable, self-patching, web-hosting service that can easily deploy apps on Windows or Linux. Although this tutorial uses an ASP.NET Core 8.0 app, the process is the same for other versions of ASP.NET Core.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a secure-by-default App Service, SQL Database, and Redis cache architecture.
> * Secure connection secrets using a managed identity and Key Vault references.
> * Deploy a sample ASP.NET Core app to App Service from a GitHub repository.
> * Access App Service connection strings and app settings in the application code.
> * Make updates and redeploy the application code.
> * Generate database schema by uploading a migrations bundle.
> * Stream diagnostic logs from Azure.
> * Manage the app in the Azure portal.
> * Provision the same architecture and deploy by using Azure Developer CLI.
> * Optimize your development workflow with GitHub Codespaces and GitHub Copilot.

## Prerequisites

::: zone pivot="azure-portal"

* An Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free).
* A GitHub account. you can also [get one for free](https://github.com/join).
* Knowledge of ASP.NET Core development.
* **(Optional)** To try GitHub Copilot, a [GitHub Copilot account](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor). A 30-day free trial is available.

::: zone-end

::: zone pivot="azure-developer-cli"

* An Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free).
* [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) installed. You can follow the steps with the [Azure Cloud Shell](https://shell.azure.com) because it already has Azure Developer CLI installed.
* Knowledge of ASP.NET Core development.
* **(Optional)** To try GitHub Copilot, a [GitHub Copilot account](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor). A 30-day free trial is available.

::: zone-end

## Skip to the end

If you just want to see the sample app in this tutorial running in Azure, just run the following commands in the [Azure Cloud Shell](https://shell.azure.com), and follow the prompt:

```bash
dotnet tool install --global dotnet-ef
mkdir msdocs-app-service-sqldb-dotnetcore
cd msdocs-app-service-sqldb-dotnetcore
azd init --template msdocs-app-service-sqldb-dotnetcore
azd up
```

## 1. Run the sample

First, you set up a sample data-driven app as a starting point. For your convenience, the [sample repository](https://github.com/Azure-Samples/msdocs-app-service-sqldb-dotnetcore), includes a [dev container](https://docs.github.com/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers) configuration. The dev container has everything you need to develop an application, including the database, cache, and all environment variables needed by the sample application. The dev container can run in a [GitHub codespace](https://docs.github.com/en/codespaces/overview), which means you can run the sample on any computer with a web browser.

:::row:::
    :::column span="2":::
        **Step 1:** In a new browser window:
        1. Sign in to your GitHub account.
        1. Navigate to [https://github.com/Azure-Samples/msdocs-app-service-sqldb-dotnetcore/fork](https://github.com/Azure-Samples/msdocs-app-service-sqldb-dotnetcore/fork).
        1. Unselect **Copy the main branch only**. You want all the branches.
        1. Select **Create fork**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-run-sample-application-1.png" alt-text="A screenshot showing how to create a fork of the sample GitHub repository." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-run-sample-application-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the GitHub fork:
        1. Select **main** > **starter-no-infra** for the starter branch. This branch contains just the sample project and no Azure-related files or configuration.
        1. Select **Code** > **Create codespace on starter-no-infra**.
        The codespace takes a few minutes to set up.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-run-sample-application-2.png" alt-text="A screenshot showing how to create a codespace in GitHub." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-run-sample-application-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** In the codespace terminal:
        1. Run database migrations with `dotnet ef database update`.
        1. Run the app with `dotnet run`.
        1. When you see the notification `Your application running on port 5093 is available.`, select **Open in Browser**.
        You should see the sample application in a new browser tab.
        To stop the application, type `Ctrl`+`C`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-run-sample-application-3.png" alt-text="A screenshot showing how to run the sample application inside the GitHub codespace." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-run-sample-application-3.png":::
    :::column-end:::
:::row-end:::

> [!TIP]
> You can ask [GitHub Copilot](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor) about this repository. For example:
>
> * *@workspace What does this project do?*
> * *@workspace What does the .devcontainer folder do?*

Having issues? Check the [Troubleshooting section](#troubleshooting).

::: zone pivot="azure-portal"  

## 2. Create App Service, database, and cache

In this step, you create the Azure resources. The steps used in this tutorial create a set of secure-by-default resources that include App Service, Azure SQL Database, and Azure Cache. For the creation process, you'll specify:

* The **Name** for the web app. It's used as part of the DNS name for your app in the form of `https://<app-name>-<hash>.<region>.azurewebsites.net`.
* The **Region** to run the app physically in the world. It's also used as part of the DNS name for your app.
* The **Runtime stack** for the app. It's where you select the .NET version to use for your app.
* The **Hosting plan** for the app. It's the pricing tier that includes the set of features and scaling capacity for your app.
* The **Resource Group** for the app. A resource group lets you group (in a logical container) all the Azure resources needed for the application.

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resources.

:::row:::
    :::column span="2":::
        **Step 1:** In the Azure portal:
        1. Enter "web app database" in the search bar at the top of the Azure portal.
        1. Select the item labeled **Web App + Database** under the **Marketplace** heading.
        You can also navigate to the [creation wizard](https://portal.azure.com/?feature.customportal=false#create/Microsoft.AppServiceWebAppDatabaseV3) directly.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-create-app-sqldb-1.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find the Web App + Database creation wizard." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-create-app-sqldb-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the **Create Web App + Database** page, fill out the form as follows.
        1. *Resource Group*: Select **Create new** and use a name of **msdocs-core-sql-tutorial**.
        1. *Region*: Any Azure region near you.
        1. *Name*: **msdocs-core-sql-XYZ** where *XYZ* is any three random characters. This name must be unique across Azure.
        1. *Runtime stack*: **.NET 8 (LTS)**.
        1. *Engine*: **SQLAzure**. Azure SQL Database is a fully managed platform as a service (PaaS) database engine that's always running on the latest stable version of the SQL Server.
        1. *Add Azure Cache for Redis?*: **Yes**.
        1. *Hosting plan*: **Basic**. When you're ready, you can [scale up](manage-scale-up.md) to a production pricing tier.
        1. Select **Review + create**.
        1. After validation completes, select **Create**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-create-app-sqldb-2.png" alt-text="A screenshot showing how to configure a new app and database in the Web App + Database wizard." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-create-app-sqldb-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** The deployment takes a few minutes to complete. Once deployment completes, select the **Go to resource** button. You're taken directly to the App Service app, but the following resources are created:
        - **Resource group**: The container for all the created resources.
        - **App Service plan**: Defines the compute resources for App Service. A Linux plan in the *Basic* tier is created.
        - **App Service**: Represents your app and runs in the App Service plan.
        - **Virtual network**: Integrated with the App Service app and isolates back-end network traffic.
        - **Private endpoints**: Access endpoints for the key vault, the database server, and the Redis cache in the virtual network.
        - **Network interfaces**: Represents private IP addresses, one for each of the private endpoints.
        - **Azure SQL Database server**: Accessible only from behind its private endpoint.
        - **Azure SQL Database**: A database and a user are created for you on the server.
        - **Azure Cache for Redis**: Accessible only from behind its private endpoint.
        - **Key vault**: Accessible only from behind its private endpoint. Used to manage secrets for the App Service app.
        - **Private DNS zones**: Enable DNS resolution of the key vault, the database server, and the Redis cache in the virtual network.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-create-app-sqldb-3.png" alt-text="A screenshot showing the deployment process completed." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-create-app-sqldb-3.png":::
    :::column-end:::
:::row-end:::

## 3. Secure connection secrets

The creation wizard generated the connectivity variable for you already as [.NET connection strings](configure-common.md#configure-connection-strings) and [app settings](configure-common.md#configure-app-settings). However, the security best practice is to keep secrets out of App Service completely. You'll move your secrets to a key vault and change your app setting to [Key Vault references](app-service-key-vault-references.md) with the help of Service Connectors.

> [!TIP]
> To use passwordless authentication, see [How do I change the SQL Database connection to use a managed identity instead?](#how-do-i-change-the-sql-database-connection-to-use-a-managed-identity-instead)

:::row:::
    :::column span="2":::
        **Step 1: Retrieve the existing connection string** 
        1. In the left menu of the App Service page, select **Settings > Environment variables > Connection strings**. 
        1. Select **AZURE_SQL_CONNECTIONSTRING**.
        1. In **Add/Edit connection string**, in the **Value** field, find the *Password=* part at the end of the string.
        1. Copy the password string after *Password=* for use later.
        This connection string lets you connect to the SQL database secured behind a private endpoint. However, the secrets are saved directly in the App Service app, which isn't the best. Likewise, the Redis cache connection string in the **App settings** tab contains a secret. You'll change this.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-secure-connection-secrets-1.png" alt-text="A screenshot showing how to see the value of an app setting." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-secure-connection-secrets-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:  Create a key vault for secure management of secrets**
        1. In the top search bar, type "*key vault*", then select **Marketplace** > **Key Vault**.
        1. In **Resource Group**, select **msdocs-core-sql-tutorial**.
        1. In **Key vault name**, type a name that consists of only letters and numbers.
        1. In **Region**, set it to the same location as the resource group.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-secure-connection-secrets-2.png" alt-text="A screenshot showing how to create a key vault." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-secure-connection-secrets-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3: Secure the key vault with a Private Endpoint**
        1. Select the **Networking** tab.
        1. Unselect **Enable public access**.
        1. Select **Create a private endpoint**.
        1. In **Resource Group**, select **msdocs-core-sql-tutorial**.
        1. In the dialog, in **Location**, select the same location as your App Service app.
        1. In **Name**, type **msdocs-core-sql-XYZVvaultEndpoint**.
        1. In **Virtual network**, select **msdocs-core-sql-XYZVnet**.
        1. In **Subnet**, **msdocs-core-sql-XYZSubnet**.
        1. Select **OK**.
        1. Select **Review + create**, then select **Create**. Wait for the key vault deployment to finish. You should see "Your deployment is complete."
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-secure-connection-secrets-3.png" alt-text="A screenshot showing how to secure a key vault with a private endpoint." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-secure-connection-secrets-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4:**
        1. In the top search bar, type *msdocs-core-sql*, then the App Service resource called **msdocs-core-sql-XYZ**.
        1. In the App Service page, in the left menu, select **Settings > Service Connector**. There are already two connectors, which the app creation wizard created for you.
        1. Select checkbox next to the SQL Database connector, then select **Edit**.
        1. Select the **Authentication** tab.
        1. In **Password**, paste the password you copied earlier.
        1. Select **Store Secret in Key Vault**.
        1. Under **Key Vault Connection**, select **Create new**. 
        A **Create connection** dialog is opened on top of the edit dialog.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-secure-connection-secrets-4.png" alt-text="A screenshot showing how to edit the SQL Database service connector with a key vault connection." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-secure-connection-secrets-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5: Establish the Key Vault connection** 
        1. In the **Create connection** dialog for the Key Vault connection, in **Key Vault**, select the key vault you created earlier.
        1. Select **Review + Create**.
        1. When validation completes, select **Create**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-secure-connection-secrets-5.png" alt-text="A screenshot showing how to create a Key Vault service connector." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-secure-connection-secrets-5.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6: Finalize the SQL Database connector settings**
        1. You're back in the edit dialog for **defaultConnector**. In the **Authentication** tab, wait for the key vault connector to be created. When it's finished, the **Key Vault Connection** dropdown automatically selects it.
        1. Select **Next: Networking**.
        1. Select **Save**. Wait until the **Update succeeded** notification appears.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-secure-connection-secrets-6.png" alt-text="A screenshot showing the key vault connection selected in the SQL Database service connector." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-secure-connection-secrets-6.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 7: Configure the Redis connector to use Key Vault secrets** 
        1. In the Service Connectors page, select the checkbox next to the Cache for Redis connector, then select **Edit**.
        1. Select the **Authentication** tab.
        1. Select **Store Secret in Key Vault**.
        1. Under **Key Vault Connection**, select the key vault you created. 
        1. Select **Next: Networking**.
        1. Select **Configure firewall rules to enable access to target service**. The app creation wizard already secured the SQL database with a private endpoint.
        1. Select **Save**. Wait until the **Update succeeded** notification appears.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-secure-connection-secrets-7.png" alt-text="A screenshot showing how to edit the Cache for Redis service connector with a key vault connection." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-secure-connection-secrets-7.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 8: Verify the Key Vault integration**
        1. From the left menu, select **Settings > Environment variables > Connection strings** again.
        1. Next to **AZURE_SQL_CONNECTIONSTRING**, select **Show value**. The value should be `@Microsoft.KeyVault(...)`, which means that it's a [key vault reference](app-service-key-vault-references.md) because the secret is now managed in the key vault.
        1. To verify the Redis connection string, select the **App setting** tab. Next to **AZURE_REDIS_CONNECTIONSTRING**, select **Show value**. The value should be `@Microsoft.KeyVault(...)` too.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-secure-connection-secrets-8.png" alt-text="A screenshot showing how to see the value of the .NET connection string in Azure." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-secure-connection-secrets-8.png":::
    :::column-end:::
:::row-end:::

To summarize, the process for securing your connection secrets involved:

- Retrieving the connection secrets from the App Service app's environment variables.
- Creating a key vault.
- Creating a Key Vault connection with the system-assigned managed identity.
- Updating the service connectors to store the secrets in the key vault.

## 4. Deploy sample code

In this step, you configure GitHub deployment using GitHub Actions. It's just one of many ways to deploy to App Service, but also a great way to have continuous integration in your deployment process. By default, every `git push` to your GitHub repository kicks off the build and deploy action.

:::row:::
    :::column span="2":::
        **Step 1:** In the left menu, select **Deployment** > **Deployment Center**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-1.png" alt-text="A screenshot showing how to open the deployment center in App Service." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the Deployment Center page:
        1. In **Source**, select **GitHub**. By default, **GitHub Actions** is selected as the build provider.        
        1. Sign in to your GitHub account and follow the prompt to authorize Azure.
        1. In **Organization**, select your account.
        1. In **Repository**, select **msdocs-app-service-sqldb-dotnetcore**.
        1. In **Branch**, select **starter-no-infra**. This is the same branch that you worked in with your sample app, without any Azure-related files or configuration.
        1. For **Authentication type**, select **User-assigned identity**.
        1. In the top menu, select **Save**. 
        App Service commits a workflow file into the chosen GitHub repository, in the `.github/workflows` directory.
        By default, the deployment center [creates a user-assigned identity](#i-dont-have-permissions-to-create-a-user-assigned-identity) for the workflow to authenticate using Microsoft Entra (OIDC authentication). For alternative authentication options, see [Deploy to App Service using GitHub Actions](deploy-github-actions.md).
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-2.png" alt-text="A screenshot showing how to configure CI/CD using GitHub Actions." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** Back in the GitHub codespace of your sample fork, run `git pull origin starter-no-infra`. 
        This pulls the newly committed workflow file into your codespace.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-3.png" alt-text="A screenshot showing git pull inside a GitHub codespace." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4 (Option 1: with GitHub Copilot):**  
        1. Start a new chat session by selecting the **Chat** view, then selecting **+**.
        1. Ask, "*@workspace How does the app connect to the database and the cache?*" Copilot might give you some explanation about the `MyDatabaseContext` class and how it's configured in *Program.cs*. 
        1. Ask, "In production mode, I want the app to use the connection string called AZURE_SQL_CONNECTIONSTRING for the database and the app setting called AZURE_REDIS_CONNECTIONSTRING*." Copilot might give you a code suggestion similar to the one in the **Option 2: without GitHub Copilot** steps below and even tell you to make the change in the *Program.cs* file. 
        1. Open *Program.cs* in the explorer and add the code suggestion.
        GitHub Copilot doesn't give you the same response every time, and it's not always correct. You might need to ask more questions to fine-tune its response. For tips, see [What can I do with GitHub Copilot in my codespace?](#what-can-i-do-with-github-copilot-in-my-codespace).
    :::column-end:::
    :::column:::
        :::image type="content" source="media/tutorial-dotnetcore-sqldb-app/github-copilot-1.png" alt-text="A screenshot showing how to ask a question in a new GitHub Copilot chat session." lightbox="media/tutorial-dotnetcore-sqldb-app/github-copilot-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4 (Option 2: without GitHub Copilot):**  
        1. Open *Program.cs* in the explorer.
        1. Find the commented code (lines 12-21) and uncomment it. 
        This code connects to the database by using `AZURE_SQL_CONNECTIONSTRING` and connects to the Redis cache by using the app setting `AZURE_REDIS_CONNECTIONSTRING`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-4.png" alt-text="A screenshot showing a GitHub codespace and the Program.cs file opened." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5 (Option 1: with GitHub Copilot):**
        1. Open *.github/workflows/starter-no-infra_msdocs-core-sql-XYZ* in the explorer. This file was created by the App Service create wizard.
        1. Highlight the `dotnet publish` step and select :::image type="icon" source="media/quickstart-dotnetcore/github-copilot-in-editor.png" border="false":::.
        1. Ask Copilot, "*Install dotnet ef, then create a migrations bundle in the same output folder.*"
        1. If the suggestion is acceptable, select **Accept**.
        GitHub Copilot doesn't give you the same response every time, and it's not always correct. You might need to ask more questions to fine-tune its response. For tips, see [What can I do with GitHub Copilot in my codespace?](#what-can-i-do-with-github-copilot-in-my-codespace).
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/github-copilot-2.png" alt-text="A screenshot showing the use of GitHub Copilot in a GitHub workflow file." lightbox="./media/tutorial-dotnetcore-sqldb-app/github-copilot-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5 (Option 2: without GitHub Copilot):**
        1. Open *.github/workflows/starter-no-infra_msdocs-core-sql-XYZ* in the explorer. This file was created by the App Service create wizard.
        1. Under the `dotnet publish` step, add a step to install the [Entity Framework Core tool](/ef/core/cli/dotnet) with the command `dotnet tool install -g dotnet-ef --version 8.*`.
        1. Under the new step, add another step to generate a database [migration bundle](/ef/core/managing-schemas/migrations/applying?tabs=dotnet-core-cli#bundles) in the deployment package: `dotnet ef migrations bundle --runtime linux-x64 -o ${{env.DOTNET_ROOT}}/myapp/migrationsbundle`.
        The migration bundle is a self-contained executable that you can run in the production environment without needing the .NET SDK. The App Service linux container only has the .NET runtime and not the .NET SDK.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-5.png" alt-text="A screenshot showing steps added to the GitHub workflow file for database migration bundle." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-5.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6:**
        1. Select the **Source Control** extension.
        1. In the textbox, type a commit message like `Configure Azure database and cache connections`. Or, select :::image type="icon" source="media/quickstart-dotnetcore/github-copilot-in-editor.png" border="false"::: and let GitHub Copilot generate a commit message for you.
        1. Select **Commit**, then confirm with **Yes**.
        1. Select **Sync changes 1**, then confirm with **OK**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-6.png" alt-text="A screenshot showing the changes being committed and pushed to GitHub." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-6.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 7:**
        Back in the Deployment Center page in the Azure portal:
        1. Select the **Logs** tab, then select **Refresh** to see the new deployment run.
        1. In the log item for the deployment run, select the **Build/Deploy Logs** entry with the latest timestamp.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-7.png" alt-text="A screenshot showing how to open deployment logs in the deployment center." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-7.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 8:** You're taken to your GitHub repository and see that the GitHub action is running. The workflow file defines two separate stages, build and deploy. Wait for the GitHub run to show a status of **Success**. It takes about 5 minutes.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-8.png" alt-text="A screenshot showing a GitHub run in progress." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-8.png":::
    :::column-end:::
:::row-end:::

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 5. Generate database schema

With the SQL Database protected by the virtual network, the easiest way to run [dotnet database migrations](/ef/core/managing-schemas/migrations/?tabs=dotnet-core-cli) is in an SSH session with the Linux container in App Service. 

:::row:::
    :::column span="2":::
        **Step 1:** Back in the App Service page, in the left menu, 
        1. Select **Development Tools** > **SSH**.
        1. Select **Go**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-generate-db-schema-1.png" alt-text="A screenshot showing how to open the SSH shell for your app from the Azure portal." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-generate-db-schema-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the SSH session:
        1. Run `cd /home/site/wwwroot`. Here are all your deployed files.
        1. Run the migration bundle that the GitHub workflow generated, with the command `./migrationsbundle -- --environment Production`. If it succeeds, App Service is connecting successfully to the SQL Database. Remember that `--environment Production` corresponds to the code changes you made in *Program.cs*.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-generate-db-schema-2.png" alt-text="A screenshot showing the commands to run in the SSH shell and their output." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-generate-db-schema-2.png":::
    :::column-end:::
:::row-end:::

In the SSH session, only changes to files in `/home` can persist beyond app restarts. Changes outside of `/home` aren't persisted.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 6. Browse to the app

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, select **Overview**.
        1. Select the URL of your app.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-browse-app-1.png" alt-text="A screenshot showing how to launch an App Service from the Azure portal." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-browse-app-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** Add a few tasks to the list.
        Congratulations, you're running a web app in Azure App Service, with secure connectivity to Azure SQL Database.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-browse-app-2.png" alt-text="A screenshot of the .NET Core app running in App Service." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-browse-app-2.png":::
    :::column-end:::
:::row-end:::

> [!TIP]
> The sample application implements the [cache-aside](/azure/architecture/patterns/cache-aside) pattern. When you visit a data view for the second time, or reload the same page after making data changes, **Processing time** in the webpage shows a much faster time because it's loading the data from the cache instead of the database.

## 7. Stream diagnostic logs

Azure App Service captures all console logs to help you diagnose issues with your application. The sample app includes logging code in each of its endpoints to demonstrate this capability.

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, select **Monitoring** > **App Service logs**.
        1. Under **Application logging**, select **File System**.
        1. In the top menu, select **Save**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-stream-diagnostic-logs-1.png" alt-text="A screenshot showing how to enable native logs in App Service in the Azure portal." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-stream-diagnostic-logs-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** From the left menu, select **Log stream**. You see the logs for your app, including platform logs and logs from inside the container.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-stream-diagnostic-logs-2.png" alt-text="A screenshot showing how to view the log stream in the Azure portal." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-stream-diagnostic-logs-2.png":::
    :::column-end:::
:::row-end:::

## 8. Clean up resources

When you're finished, you can delete all of the resources from your Azure subscription by deleting the resource group.

:::row:::
    :::column span="2":::
        **Step 1:** In the search bar at the top of the Azure portal:
        1. Enter the resource group name.
        1. Select the resource group.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-clean-up-resources-1.png" alt-text="A screenshot showing how to search for and navigate to a resource group in the Azure portal." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-clean-up-resources-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the resource group page, select **Delete resource group**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-clean-up-resources-2.png" alt-text="A screenshot showing the location of the Delete Resource Group button in the Azure portal." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-clean-up-resources-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** 
        1. Enter the resource group name to confirm your deletion.
        1. Select **Delete**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-clean-up-resources-3.png" alt-text="A screenshot of the confirmation dialog for deleting a resource group in the Azure portal." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-clean-up-resources-3.png"::::
    :::column-end:::
:::row-end:::

::: zone-end

::: zone pivot="azure-developer-cli"

## 2. Create Azure resources and deploy a sample app

In this step, you create the Azure resources and deploy a sample app to App Service on Linux. The steps used in this tutorial create a set of secure-by-default resources that include App Service, Azure SQL Database, and Azure Cache for Redis.

The dev container already has the [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) (AZD).

1. From the repository root, run `azd init`.

    ```bash
    azd init --template dotnet-app-service-sqldb-infra
    ```

1. When prompted, give the following answers:
    
    |Question  |Answer  |
    |---------|---------|
    |The current directory is not empty. Would you like to initialize a project here in '\<your-directory>'?     | **Y**        |
    |What would you like to do with these files?     | **Keep my existing files unchanged**        |
    |Enter a new environment name     | Type a unique name. The AZD template uses this name as part of the DNS name of your web app in Azure (`<app-name>-<hash>.azurewebsites.net`). Alphanumeric characters and hyphens are allowed.          |

1. Sign into Azure by running the `azd auth login` command and following the prompt:

    ```bash
    azd auth login
    ```  

1. Create the necessary Azure resources and deploy the app code with the `azd up` command. Follow the prompt to select the desired subscription and location for the Azure resources.

    ```bash
    azd up
    ```  

    The `azd up` command takes about 15 minutes to complete (the Redis cache takes the most time). It also compiles and deploys your application code, but you'll modify your code later to work with App Service. While it's running, the command provides messages about the provisioning and deployment process, including a link to the deployment in Azure. When it finishes, the command also displays a link to the deploy application.

    This AZD template contains files (*azure.yaml* and the *infra* directory) that generate a secure-by-default architecture with the following Azure resources:

    - **Resource group**: The container for all the created resources.
    - **App Service plan**: Defines the compute resources for App Service. A Linux plan in the *Basic* tier is created.
    - **App Service**: Represents your app and runs in the App Service plan.
    - **Virtual network**: Integrated with the App Service app and isolates back-end network traffic.
    - **Private endpoints**: Access endpoints for the key vault, the database server, and the Redis cache in the virtual network.
    - **Network interfaces**: Represents private IP addresses, one for each of the private endpoints.
    - **Azure SQL Database server**: Accessible only from behind its private endpoint.
    - **Azure SQL Database**: A database and a user are created for you on the server.
    - **Azure Cache for Redis**: Accessible only from behind its private endpoint.
    - **Key vault**: Accessible only from behind its private endpoint. Used to manage secrets for the App Service app.
    - **Private DNS zones**: Enable DNS resolution of the key vault, the database server, and the Redis cache in the virtual network.

    Once the command finishes creating resources and deploying the application code the first time, the deployed sample app doesn't work yet because you must make small changes to make it connect to the database in Azure.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 3. Verify connection strings

> [!TIP]
> The default SQL database connection string uses SQL authentication. For more secure, passwordless authentication, see [How do I change the SQL Database connection to use a managed identity instead?](#how-do-i-change-the-sql-database-connection-to-use-a-managed-identity-instead) 

The AZD template you use generated the connectivity variables for you already as [app settings](configure-common.md#configure-app-settings) and outputs the them to the terminal for your convenience. App settings are one way to keep connection secrets out of your code repository.

1. In the AZD output, find the settings `AZURE_SQL_CONNECTIONSTRING` and `AZURE_REDIS_CONNECTIONSTRING`. Only the setting names are displayed. They look like this in the AZD output:

    <pre>
    App Service app has the following connection strings:
        - AZURE_SQL_CONNECTIONSTRING
        - AZURE_REDIS_CONNECTIONSTRING
        - AZURE_KEYVAULT_RESOURCEENDPOINT
        - AZURE_KEYVAULT_SCOPE
    </pre>

    `AZURE_SQL_CONNECTIONSTRING` contains the connection string to the SQL Database in Azure, and `AZURE_REDIS_CONNECTIONSTRING` contains the connection string to the Azure Redis cache. You need to use them in your code later. 

1. For your convenience, the AZD template shows you the direct link to the app's app settings page. Find the link and open it in a new browser tab.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 4. Modify sample code and redeploy

# [With GitHub Copilot](#tab/copilot)

1. In the GitHub codespace, start a new chat session by selecting the **Chat** view, then selecting **+**. 

1. Ask, "*@workspace How does the app connect to the database and the cache?*" Copilot might give you some explanation about the `MyDatabaseContext` class and how it's configured in *Program.cs*.

1. Ask, "In production mode, I want the app to use the connection string called AZURE_SQL_CONNECTIONSTRING for the database and the app setting called AZURE_REDIS_CONNECTIONSTRING*." Copilot might give you a code suggestion similar to the one in the **Option 2: without GitHub Copilot** steps below and even tell you to make the change in the *Program.cs* file.

1. Open *Program.cs* in the explorer and add the code suggestion.

    GitHub Copilot doesn't give you the same response every time, and it's not always correct. You might need to ask more questions to fine-tune its response. For tips, see [What can I do with GitHub Copilot in my codespace?](#what-can-i-do-with-github-copilot-in-my-codespace).

# [Without GitHub Copilot](#tab/nocopilot)

1. From the explorer, open *Program.cs*.

1. In the `contextIntialized()` method, find the commented code (lines 12-21) and uncomment it. 

    ```csharp
    else
    {
        builder.Services.AddDbContext<MyDatabaseContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING")));
        builder.Services.AddStackExchangeRedisCache(options =>
        {
        options.Configuration = builder.Configuration["AZURE_REDIS_CONNECTIONSTRING"];
        options.InstanceName = "SampleInstance";
        });
    } 
    ```
    
    When the app isn't in development mode (like in Azure App Service), this code connects to the database by using `AZURE_SQL_CONNECTIONSTRING` and connects to the Redis cache by using the app setting `AZURE_REDIS_CONNECTIONSTRING`.

-----

Before you deploy these changes, you still need to generate a migration bundle.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 5. Generate database schema

With the SQL Database protected by the virtual network, the easiest way to run database migrations is in an SSH session with the App Service container. However, the App Service Linux containers don't have the .NET SDK, so the easiest way to run database migrations is to upload a self-contained migrations bundle.

1. Generate a migrations bundle for your project with the following command:

    ```bash
    dotnet ef migrations bundle --runtime linux-x64 -o migrationsbundle
    ```

    > [!TIP]
    > The sample application (see [DotNetCoreSqlDb.csproj](https://github.com/Azure-Samples/msdocs-app-service-sqldb-dotnetcore/blob/main/DotNetCoreSqlDb.csproj)) is configured to include this *migrationsbundle* file. During the `azd package` stage, *migrationsbundle* will be added to the deploy package.

1. Deploy all the changes with `azd up`.

    ```bash
    azd up
    ```

1. In the AZD output, find the URL for the SSH session and navigate to it in the browser. It looks like this in the output:

    <pre>
    Open SSH session to App Service container at: https://&lt;app-name>.scm.azurewebsites.net/webssh/host
    </pre>

1. In the SSH session, run the following commands: 

    ```bash
    cd /home/site/wwwroot
    ./migrationsbundle -- --environment Production
    ```

    If it succeeds, App Service is connecting successfully to the database. Remember that `--environment Production` corresponds to the code changes you made in *Program.cs*.

    > [!NOTE]
    > Only changes to files in `/home` can persist beyond app restarts. Changes outside of `/home` aren't persisted.
    >

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 6. Browse to the app

1. In the AZD output, find the URL of your app and navigate to it in the browser. The URL looks like this in the AZD output:

    <pre>
    Deploying services (azd deploy)
    
      (✓) Done: Deploying service web
      - Endpoint: https://&lt;app-name>-&lt;hash>.azurewebsites.net/
    </pre>

2. Add a few tasks to the list.

    :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-browse-app-2.png" alt-text="A screenshot of the ASP.NET Core web app with SQL Database running in Azure showing tasks." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-browse-app-2.png":::

    Congratulations, you're running a web app in Azure App Service, with secure connectivity to Azure SQL Database.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 7. Stream diagnostic logs

Azure App Service can capture console logs to help you diagnose issues with your application. For convenience, the AZD template already [enabled logging to the local file system](troubleshoot-diagnostic-logs.md#enable-application-logging-linuxcontainer) and is [shipping the logs to a Log Analytics workspace](troubleshoot-diagnostic-logs.md#send-logs-to-azure-monitor).

The sample application includes standard logging statements to demonstrate this capability, as shown in the following snippet:

:::code language="csharp" source="~/msdocs-app-service-sqldb-dotnetcore/Controllers/TodosController.cs" range="28-45" highlight="6,12":::

In the AZD output, find the link to stream App Service logs and navigate to it in the browser. The link looks like this in the AZD output:

<pre>
Stream App Service logs at: https://portal.azure.com/#@/resource/subscriptions/&lt;subscription-guid>/resourceGroups/&lt;group-name>/providers/Microsoft.Web/sites/&lt;app-name>/logStream
</pre>

Learn more about logging in .NET apps in the series on [Enable Azure Monitor OpenTelemetry for .NET, Node.js, Python and Java applications](/azure/azure-monitor/app/opentelemetry-enable?tabs=aspnetcore).

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 8. Clean up resources

To delete all Azure resources in the current deployment environment, run `azd down` and follow the prompts.

```bash
azd down
```

::: zone-end

## Troubleshooting

- [The portal deployment view for Azure SQL Database shows a Conflict status](#the-portal-deployment-view-for-azure-sql-database-shows-a-conflict-status)
- [In the Azure portal, the log stream UI for the web app shows network errors](#in-the-azure-portal-the-log-stream-ui-for-the-web-app-shows-network-errors)
- [The SSH session in the browser shows `SSH CONN CLOSED`](#the-ssh-session-in-the-browser-shows-ssh-conn-closed)
- [The portal log stream page shows `Connected!` but no logs](#the-portal-log-stream-page-shows-connected-but-no-logs)

### The portal deployment view for Azure SQL Database shows a Conflict status

Depending on your subscription and the region you select, you might see the deployment status for Azure SQL Database to be `Conflict`, with the following message in Operation details:

`Location '<region>' is not accepting creation of new Windows Azure SQL Database servers at this time.`

This error is most likely caused by a limit on your subscription for the region you select. Try choosing a different region for your deployment.

### In the Azure portal, the log stream UI for the web app shows network errors

You might see this error: 

<pre>
Unable to open a connection to your app. This may be due to any network security groups or IP restriction rules that you have placed on your app. To use log streaming, please make sure you are able to access your app directly from your current network.
</pre>

This is usually a transient error when the app is first started. Wait a few minutes and check again.

### The SSH session in the browser shows `SSH CONN CLOSED`

It takes a few minutes for the Linux container to start up. Wait a few minutes and check again.

### The portal log stream page shows `Connected!` but no logs

After you configure diagnostic logs, the app is restarted. You might need to refresh the page for the changes to take effect in the browser.

## Frequently asked questions

- [How much does this setup cost?](#how-much-does-this-setup-cost)
- [How do I connect to the Azure SQL Database server that's secured behind the virtual network with other tools?](#how-do-i-connect-to-the-azure-sql-database-server-thats-secured-behind-the-virtual-network-with-other-tools)
- [How does local app development work with GitHub Actions?](#how-does-local-app-development-work-with-github-actions)
- [How do I debug errors during the GitHub Actions deployment?](#how-do-i-debug-errors-during-the-github-actions-deployment)
- [How do I change the SQL Database connection to use a managed identity instead?](#how-do-i-change-the-sql-database-connection-to-use-a-managed-identity-instead)
- [I don't have permissions to create a user-assigned identity](#i-dont-have-permissions-to-create-a-user-assigned-identity)
- [What can I do with GitHub Copilot in my codespace?](#what-can-i-do-with-github-copilot-in-my-codespace)

### How much does this setup cost?

Pricing for the created resources is as follows:

- The App Service plan is created in **Basic** tier and can be scaled up or down. See [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/).
- The Azure SQL Database is created in general-purpose, serverless tier on Standard-series hardware with the minimum cores. There's a small cost and can be distributed to other regions. You can minimize cost even more by reducing its maximum size, or you can scale it up by adjusting the serving tier, compute tier, hardware configuration, number of cores, database size, and zone redundancy. See [Azure SQL Database pricing](https://azure.microsoft.com/pricing/details/azure-sql-database/single/).
- The Azure Cache for Redis is created in **Basic** tier with the minimum cache size. There's a small cost associated with this tier. You can scale it up to higher performance tiers for higher availability, clustering, and other features. See [Azure Cache for Redis pricing](https://azure.microsoft.com/pricing/details/cache/).
- The virtual network doesn't incur a charge unless you configure extra functionality, such as peering. See [Azure Virtual Network pricing](https://azure.microsoft.com/pricing/details/virtual-network/).
- The private DNS zone incurs a small charge. See [Azure DNS pricing](https://azure.microsoft.com/pricing/details/dns/).

### How do I connect to the Azure SQL Database server that's secured behind the virtual network with other tools?

- For basic access from a command-line tool, you can run `sqlcmd` from the app's SSH terminal. The app's container doesn't come with `sqlcmd`, so you must [install it manually](/sql/tools/sqlcmd/sqlcmd-utility?tabs=go%2Clinux&pivots=cs1-bash#download-and-install-sqlcmd). Remember that the installed client doesn't persist across app restarts.
- To connect from a SQL Server Management Studio client or from Visual Studio, your machine must be within the virtual network. For example, it could be an Azure VM that's connected to one of the subnets, or a machine in an on-premises network that has a [site-to-site VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md) connection with the Azure virtual network.

### How does local app development work with GitHub Actions?

Take the autogenerated workflow file from App Service as an example, each `git push` kicks off a new build and deployment run. From a local clone of the GitHub repository, you make the desired updates push it to GitHub. For example:


```terminal
git add .
git commit -m "<some-message>"
git push origin main
```

### How do I debug errors during the GitHub Actions deployment?

If a step fails in the autogenerated GitHub workflow file, try modifying the failed command to generate more verbose output. For example, you can get more output from any of the `dotnet` commands by adding the `-v` option. Commit and push your changes to trigger another deployment to App Service.

### I don't have permissions to create a user-assigned identity

See [Set up GitHub Actions deployment from the Deployment Center](deploy-github-actions.md#set-up-github-actions-deployment-from-the-deployment-center).

### How do I change the SQL Database connection to use a managed identity instead?

The default connection string to the SQL database is managed by Service Connector, with the name *defaultConnector*, and it uses SQL authentication. To replace it with a connection that uses a managed identity, run the following commands in the [cloud shell](https://shell.azure.com) after replacing the placeholders:

```azurecli-interactive
az extension add --name serviceconnector-passwordless --upgrade
az sql server update --enable-public-network true
az webapp connection delete sql --connection defaultConnector --resource-group <group-name> --name <app-name>
az webapp connection create sql --connection defaultConnector --resource-group <group-name> --name <app-name> --target-resource-group <group-name> --server <database-server-name> --database <database-name> --client-type dotnet --system-identity --config-connstr true
az sql server update --enable-public-network false
```

By default, the command `az webapp connection create sql --client-type dotnet --system-identity --config-connstr` does the following:

- Sets your user as the Microsoft Entra ID administrator of the SQL database server.
- Create a system-assigned managed identity and grants it access to the database.
- Generates a passwordless connection string called `AZURE_SQL_CONNECTIONGSTRING`, which your app is already using at the end of the tutorial.

Your app should now have connectivity to the SQL database. For more information, see [Tutorial: Connect to Azure databases from App Service without secrets using a managed identity](tutorial-connect-msi-azure-database.md).

> [!TIP]
> **Don't want to enable public network connection?** You can skip `az sql server update --enable-public-network true` by running the commands from an [Azure cloud shell that's integrated with your virtual network](../cloud-shell/vnet/deployment.md) if you have the **Owner** role assignment on your subscription. 
> 
> To grant the identity the required access to the database that's secured by the virtual network, `az webapp connection create sql` needs direct connectivity with Entra ID authentication to the database server. By default, the Azure cloud shell doesn't have this access to the network-secured database.

### What can I do with GitHub Copilot in my codespace?

You might have noticed that the GitHub Copilot chat view was already there for you when you created the codespace. For your convenience, we include the GitHub Copilot chat extension in the container definition (see *.devcontainer/devcontainer.json*). However, you need a [GitHub Copilot account](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor) (30-day free trial available). 

A few tips for you when you talk to GitHub Copilot:

- In a single chat session, the questions and answers build on each other and you can adjust your questions to fine-tune the answer you get.
- By default, GitHub Copilot doesn't have access to any file in your repository. To ask questions about a file, open the file in the editor first.
- To let GitHub Copilot have access to all of the files in the repository when preparing its answers, begin your question with `@workspace`. For more information, see [Use the @workspace agent](https://github.blog/2024-03-25-how-to-use-github-copilot-in-your-ide-tips-tricks-and-best-practices/#10-use-the-workspace-agent).
- In the chat session, GitHub Copilot can suggest changes and (with `@workspace`) even where to make the changes, but it's not allowed to make the changes for you. It's up to you to add the suggested changes and test it.

Here are some other things you can say to fine-tune the answer you get:

* I want this code to run only in production mode.
* I want this code to run only in Azure App Service and not locally.
* The --output-path parameter seems to be unsupported.
 
## Related content

Advance to the next tutorial to learn how to secure your app with a custom domain and certificate.

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)

Or, check out other resources:

> [!div class="nextstepaction"]
> [Tutorial: Connect to SQL Database from App Service without secrets using a managed identity](tutorial-connect-msi-sql-database.md)

> [!div class="nextstepaction"]
> [Configure ASP.NET Core app](configure-language-dotnetcore.md)
