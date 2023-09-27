---
title: Deploy an ASP.NET Core and Azure SQL Database app to Azure App Service
description: Learn how to deploy an ASP.NET Core web app to Azure App Service and connect to an Azure SQL Database.
ms.topic: tutorial
ms.date: 05/24/2023
author: cephalin
ms.author: cephalin
ms.devlang: csharp
ms.service: app-service
ms.custom: devx-track-csharp, mvc, cli-validate, seodec18, devdivchpfy22, service-connector, devx-track-dotnet, AppServiceConnectivity
---

# Tutorial: Deploy an ASP.NET Core and Azure SQL Database app to Azure App Service

In this tutorial, you'll learn how to deploy a data-driven ASP.NET Core app to Azure App Service and connect to an Azure SQL Database. You'll also deploy an Azure Cache for Redis to enable the caching code in your application. Azure App Service is a highly scalable, self-patching, web-hosting service that can easily deploy apps on Windows or Linux. Although this tutorial uses an ASP.NET Core 7.0 app, the process is the same for other versions of ASP.NET Core and ASP.NET Framework.

This tutorial requires:

- An Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free).
- A GitHub account. you can also [get one for free](https://github.com/join).

## Sample application

To explore the sample application used in this tutorial, [download it](https://github.com/Azure-Samples/msdocs-app-service-sqldb-dotnetcore/archive/refs/heads/main.zip) from the repository [https://github.com/Azure-Samples/msdocs-app-service-sqldb-dotnetcore](https://github.com/Azure-Samples/msdocs-app-service-sqldb-dotnetcore) or clone it using the following Git command:

```terminal
git clone https://github.com/Azure-Samples/msdocs-app-service-sqldb-dotnetcore.git
cd msdocs-app-service-sqldb-dotnetcore
```

## 1. Create App Service, database, and cache

In this step, you create the Azure resources. The steps used in this tutorial create a set of secure-by-default resources that include App Service, Azure SQL Database, and Azure Cache. For the creation process, you'll specify:

* The **Name** for the web app. It's the name used as part of the DNS name for your webapp in the form of `https://<app-name>.azurewebsites.net`.
* The **Region** to run the app physically in the world.
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
        1. *Resource Group* &rarr; Select **Create new** and use a name of **msdocs-core-sql-tutorial**.
        1. *Region* &rarr; Any Azure region near you.
        1. *Name* &rarr; **msdocs-core-sql-XYZ** where *XYZ* is any three random characters. This name must be unique across Azure.
        1. *Runtime stack* &rarr; **.NET 7 (STS)**.
        1. *Add Azure Cache for Redis?* &rarr; **Yes**.
        1. *Hosting plan* &rarr; **Basic**. When you're ready, you can [scale up](manage-scale-up.md) to a production pricing tier later.
        1. **SQLAzure** is selected by default as the database engine. Azure SQL Database is a fully managed platform as a service (PaaS) database engine that's always running on the latest stable version of the SQL Server.
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
        - **Resource group** &rarr; The container for all the created resources.
        - **App Service plan** &rarr; Defines the compute resources for App Service. A Linux plan in the *Basic* tier is created.
        - **App Service** &rarr; Represents your app and runs in the App Service plan.
        - **Virtual network** &rarr; Integrated with the App Service app and isolates back-end network traffic.
        - **Private endpoints** &rarr; Access endpoints for the database server and the Redis cache in the virtual network.
        - **Network interfaces** &rarr; Represents private IP addresses, one for each of the private endpoints.
        - **Azure SQL Database server** &rarr; Accessible only from behind its private endpoint.
        - **Azure SQL Database** &rarr; A database and a user are created for you on the server.
        - **Azure Cache for Redis** &rarr; Accessible only from behind its private endpoint.
        - **Private DNS zones** &rarr; Enable DNS resolution of the database server and the Redis cache in the virtual network.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-create-app-sqldb-3.png" alt-text="A screenshot showing the deployment process completed." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-create-app-sqldb-3.png":::
    :::column-end:::
:::row-end:::

## 2. Verify connection strings

The creation wizard generated connection strings for the SQL database and the Redis cache already. In this step, find the generated connection strings for later.

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page, in the left menu, select Configuration.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-get-connection-string-1.png" alt-text="A screenshot showing how to open the configuration page in App Service." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-get-connection-string-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** 
        1. Scroll to the bottom of the page and find **AZURE_SQL_CONNECTIONSTRING** in the **Connection strings** section. This string was generated from the new SQL database by the creation wizard. To set up your application, this name is all you need.
        1. Also, find **AZURE_REDIS_CONNECTIONSTRING** in the **Application settings** section. This string was generated from the new Redis cache by the creation wizard. To set up your application, this name is all you need.
        1. If you want, you can select the **Edit** button to the right of each setting and see or copy its value.
        Later, you'll change your application to use `AZURE_SQL_CONNECTIONSTRING` and `AZURE_REDIS_CONNECTIONSTRING`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-get-connection-string-2.png" alt-text="A screenshot showing how to create an app setting." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-get-connection-string-2.png":::
    :::column-end:::
:::row-end:::

## 3. Deploy sample code

In this step, you'll configure GitHub deployment using GitHub Actions. It's just one of many ways to deploy to App Service, but also a great way to have continuous integration in your deployment process. By default, every `git push` to your GitHub repository will kick off the build and deploy action.

:::row:::
    :::column span="2":::
        **Step 1:** In a new browser window:
        1. Sign in to your GitHub account.
        1. Navigate to [https://github.com/Azure-Samples/msdocs-app-service-sqldb-dotnetcore](https://github.com/Azure-Samples/msdocs-app-service-sqldb-dotnetcore).
        1. Select **Fork**.
        1. Select **Create fork**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-1.png" alt-text="A screenshot showing how to create a fork of the sample GitHub repository." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the App Service page, in the left menu, select **Deployment Center**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-2.png" alt-text="A screenshot showing how to open the deployment center in App Service." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** In the Deployment Center page:
        1. In **Source**, select **GitHub**. By default, **GitHub Actions** is selected as the build provider.        
        1. Sign in to your GitHub account and follow the prompt to authorize Azure.
        1. In **Organization**, select your account.
        1. In **Repository**, select **msdocs-app-service-sqldb-dotnetcore**.
        1. In **Branch**, select **main**.
        1. In the top menu, select **Save**. App Service commits a workflow file into the chosen GitHub repository, in the `.github/workflows` directory.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-3.png" alt-text="A screenshot showing how to configure CI/CD using GitHub Actions." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4:** Back the GitHub page of the forked sample, open Visual Studio Code in the browser by pressing the `.` key.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-4.png" alt-text="A screenshot showing how to open the Visual Studio Code browser experience in GitHub." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5:** In Visual Studio Code in the browser:
        1. Open *DotNetCoreSqlDb/appsettings.json* in the explorer.
        1. Change the connection string name `MyDbConnection` to `AZURE_SQL_CONNECTIONSTRING`, which matches the connection string created in App Service earlier.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-5.png" alt-text="A screenshot showing connection string name changed in appsettings.json." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-5.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6:**
        1. Open *DotNetCoreSqlDb/Program.cs* in the explorer.
        1. In the `options.UseSqlServer` method, change the connection string name `MyDbConnection` to `AZURE_SQL_CONNECTIONSTRING`. This is where the connection string is used by the sample application.
        1. Remove the `builder.Services.AddDistributedMemoryCache();` method and replace it with the following code. It changes your code from using an in-memory cache to the Redis cache in Azure, and it does so by using `AZURE_REDIS_CONNECTIONSTRING` from earlier.
        ```csharp
        builder.Services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = builder.Configuration["AZURE_REDIS_CONNECTIONSTRING"];
            options.InstanceName = "SampleInstance";
        });
        ```
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-6.png" alt-text="A screenshot showing connection string name changed in Program.cs." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-6.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 7:**
        1. Open *.github/workflows/main_msdocs-core-sql-XYZ* in the explorer. This file was created by the App Service create wizard.
        1. Under the `dotnet publish` step, add a step to install the [Entity Framework Core tool](/ef/core/cli/dotnet) with the command `dotnet tool install -g dotnet-ef`.
        1. Under the new step, add another step to generate a database [migration bundle](/ef/core/managing-schemas/migrations/applying?tabs=dotnet-core-cli#bundles) in the deployment package: `dotnet ef migrations bundle --runtime linux-x64 -p DotNetCoreSqlDb/DotNetCoreSqlDb.csproj -o ${{env.DOTNET_ROOT}}/myapp/migrate`.
        The migration bundle is a self-contained executable that you can run in the production environment without needing the .NET SDK. The App Service linux container only has the .NET runtime and not the .NET SDK.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-7.png" alt-text="A screenshot showing steps added to the GitHub workflow file for database migration bundle." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-7.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 8:**
        1. Select the **Source Control** extension.
        1. In the textbox, type a commit message like `Configure DB & Redis & add migration bundle`.
        1. Select **Commit and Push**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-8.png" alt-text="A screenshot showing the changes being committed and pushed to GitHub." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-8.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 9:** Back in the Deployment Center page in the Azure portal:
        1. Select **Logs**. A new deployment run is already started from your committed changes.
        1. In the log item for the deployment run, select the **Build/Deploy Logs** entry with the latest timestamp.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-9.png" alt-text="A screenshot showing how to open deployment logs in the deployment center." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-9.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 10:** You're taken to your GitHub repository and see that the GitHub action is running. The workflow file defines two separate stages, build and deploy. Wait for the GitHub run to show a status of **Complete**. It takes a few minutes.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-10.png" alt-text="A screenshot showing a GitHub run in progress." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-deploy-sample-code-10.png":::
    :::column-end:::
:::row-end:::

## 4. Generate database schema

With the SQL Database protected by the virtual network, the easiest way to run Run [dotnet database migrations](/ef/core/managing-schemas/migrations/?tabs=dotnet-core-cli) is in an SSH session with the App Service container. 

:::row:::
    :::column span="2":::
        **Step 1:** Back in the App Service page, in the left menu, select **SSH**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-generate-db-schema-1.png" alt-text="A screenshot showing how to open the SSH shell for your app from the Azure portal." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-generate-db-schema-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the SSH terminal:
        1. Run `cd /home/site/wwwroot`. Here are all your deployed files.
        1. Run the migration bundle that's generated by the GitHub workflow with `./migrate`. If it succeeds, App Service is connecting successfully to the SQL Database.
        Only changes to files in `/home` can persist beyond app restarts. Changes outside of `/home` aren't persisted.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-generate-db-schema-2.png" alt-text="A screenshot showing the commands to run in the SSH shell and their output." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-generate-db-schema-2.png":::
    :::column-end:::
:::row-end:::

## 5. Browse to the app

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, select **Overview**.
        1. Select the URL of your app. You can also navigate directly to `https://<app-name>.azurewebsites.net`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-browse-app-1.png" alt-text="A screenshot showing how to launch an App Service from the Azure portal." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-browse-app-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** Add a few tasks to the list.
        Congratulations, you're running a secure data-driven ASP.NET Core app in Azure App Service.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-browse-app-2.png" alt-text="A screenshot of the .NET Core app running in App Service." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-browse-app-2.png":::
    :::column-end:::
:::row-end:::

> [!TIP]
> The sample application implements the [cache-aside](/azure/architecture/patterns/cache-aside) pattern. When you visit a data view for the second time, or reload the same page after making data changes,  **Processing time** in the webpage shows a much faster time because it's loading the data from the cache instead of the database.

## 6. Stream diagnostic logs

Azure App Service captures all messages logged to the console to assist you in diagnosing issues with your application. The sample app outputs console log messages in each of its endpoints to demonstrate this capability.

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, select **App Service logs**.
        1. Under **Application logging**, select **File System**.
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

## 7. Clean up resources

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

## Frequently asked questions

- [How much does this setup cost?](#how-much-does-this-setup-cost)
- [How do I connect to the Azure SQL Database server that's secured behind the virtual network with other tools?](#how-do-i-connect-to-the-azure-sql-database-server-thats-secured-behind-the-virtual-network-with-other-tools)
- [How does local app development work with GitHub Actions?](#how-does-local-app-development-work-with-github-actions)
- [How do I debug errors during the GitHub Actions deployment?](#how-do-i-debug-errors-during-the-github-actions-deployment)

#### How much does this setup cost?

Pricing for the create resources is as follows:

- The App Service plan is created in **Basic** tier and can be scaled up or down. See [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/).
- The Azure SQL Database is created in general-purpose, serverless tier on Standard-series hardware with the minimum cores. There's a small cost and can be distributed to other regions. You can minimize cost even more by reducing its maximum size, or you can scale it up by adjusting the serving tier, compute tier, hardware configuration, number of cores, database size, and zone redundancy. See [Azure SQL Database pricing](https://azure.microsoft.com/pricing/details/azure-sql-database/single/).
- The Azure Cache for Redis is created in **Basic** tier with the minimum cache size. There's a small cost associated with this tier. You can scale it up to higher performance tiers for higher availability, clustering, and other features. See [Azure Cache for Redis pricing](https://azure.microsoft.com/pricing/details/cache/).
- The virtual network doesn't incur a charge unless you configure extra functionality, such as peering. See [Azure Virtual Network pricing](https://azure.microsoft.com/pricing/details/virtual-network/).
- The private DNS zone incurs a small charge. See [Azure DNS pricing](https://azure.microsoft.com/pricing/details/dns/).

#### How do I connect to the Azure SQL Database server that's secured behind the virtual network with other tools?

- For basic access from a command-line tool, you can run `sqlcmd` from the app's SSH terminal. The app's container doesn't come with `sqlcmd`, so you must [install it manually](/sql/linux/sql-server-linux-setup-tools#ubuntu). Remember that the installed client doesn't persist across app restarts.
- To connect from a SQL Server Management Studio client or from Visual Studio, your machine must be within the virtual network. For example, it could be an Azure VM that's connected to one of the subnets, or a machine in an on-premises network that has a [site-to-site VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md) connection with the Azure virtual network.

#### How does local app development work with GitHub Actions?

Take the autogenerated workflow file from App Service as an example, each `git push` kicks off a new build and deployment run. From a local clone of the GitHub repository, you make the desired updates push it to GitHub. For example:


```terminal
git add .
git commit -m "<some-message>"
git push origin main
```

#### How do I debug errors during the GitHub Actions deployment?

If a step fails in the autogenerated GitHub workflow file, try modifying the failed command to generate more verbose output. For example, you can get more output from any of the `dotnet` commands by adding the `-v` option. Commit and push your changes to trigger another deployment to App Service.

## Next steps

Advance to the next tutorial to learn how to secure your app with a custom domain and certificate.

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)

Or, check out other resources:

> [!div class="nextstepaction"]
> [Tutorial: Connect to SQL Database from App Service without secrets using a managed identity](tutorial-connect-msi-sql-database.md)

> [!div class="nextstepaction"]
> [Configure ASP.NET Core app](configure-language-dotnetcore.md)
