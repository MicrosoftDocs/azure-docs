---
title: Deploy a Node.js + MongoDB app to Azure
description: This article shows you have to deploy a Node.js app using Express.js and a MongoDB database to Azure. Azure App Service is used to host the web application and Azure Cosmos DB to host the database using the 100% compatible MongoDB API built into Azure Cosmos DB.
ms.topic: tutorial
ms.date: 09/30/2024
ms.service: azure-app-service
ms.role: developer
ms.devlang: javascript
ms.author: msangapu
author: msangapu-msft
ms.custom: scenarios:getting-started, languages:javascript, devx-track-js, devdivchpfy22, AppServiceConnectivity, devx-track-extended-azdevcli
zone_pivot_groups: app-service-portal-azd
ms.collection: ce-skilling-ai-copilot
---

# Tutorial: Deploy a Node.js + MongoDB web app to Azure

[Azure App Service](overview.md) provides a highly scalable, self-patching web hosting service using the Linux operating system. This tutorial shows how to create a secure Node.js app in Azure App Service that's connected to a [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction) database. When you're finished, you'll have an Express.js app running on Azure App Service on Linux.

:::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-browse-app-2.png" alt-text="Screenshot of Node.js application storing data in Cosmos DB.":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a secure-by-default architecture for Azure App Service and Azure Cosmos DB with MongoDB API.
> * Secure connection secrets using a managed identity and Key Vault references.
> * Deploy a Node.js sample app to App Service from a GitHub repository.
> * Access App Service app settings in the application code.
> * Make updates and redeploy the application code.
> * Stream diagnostic logs from App Service.
> * Manage the app in the Azure portal.
> * Provision the same architecture and deploy by using Azure Developer CLI.
> * Optimize your development workflow with GitHub Codespaces and GitHub Copilot.

## Prerequisites

::: zone pivot="azure-portal"  

* An Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free/java/).
* A GitHub account. you can also [get one for free](https://github.com/join).
* Knowledge of Express.js development.
* **(Optional)** To try GitHub Copilot, a [GitHub Copilot account](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor). A 30-day free trial is available.

::: zone-end

::: zone pivot="azure-developer-cli"

* An Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free/java).
* [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) installed. You can follow the steps with the [Azure Cloud Shell](https://shell.azure.com) because it already has Azure Developer CLI installed.
* Knowledge of Express.js development.
* **(Optional)** To try GitHub Copilot, a [GitHub Copilot account](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor). A 30-day free trial is available.

::: zone-end

## Skip to the end

You can quickly deploy the sample app in this tutorial and see it running in Azure. Just run the following commands in the [Azure Cloud Shell](https://shell.azure.com), and follow the prompt:

```bash
mkdir msdocs-nodejs-mongodb-azure-sample-app
cd msdocs-nodejs-mongodb-azure-sample-app
azd init --template msdocs-nodejs-mongodb-azure-sample-app
azd up
```

## 1. Run the sample

First, you set up a sample data-driven app as a starting point. For your convenience, the [sample repository](https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app), includes a [dev container](https://docs.github.com/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers) configuration. The dev container has everything you need to develop an application, including the database, cache, and all environment variables needed by the sample application. The dev container can run in a [GitHub codespace](https://docs.github.com/en/codespaces/overview), which means you can run the sample on any computer with a web browser.

:::row:::
    :::column span="2":::
        **Step 1:** In a new browser window:
        1. Sign in to your GitHub account.
        1. Navigate to [https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app/fork](https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app/fork).
        1. Unselect **Copy the main branch only**. You want all the branches.
        1. Select **Create fork**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-run-sample-application-1.png" alt-text="A screenshot showing how to create a fork of the sample GitHub repository." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-run-sample-application-1.png":::
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
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-run-sample-application-2.png" alt-text="A screenshot showing how to create a codespace in GitHub." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-run-sample-application-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** In the codespace terminal:
        1. Run `npm install && npm start`.
        1. When you see the notification `Your application running on port 3000 is available.`, select **Open in Browser**.
        You should see the sample application in a new browser tab.
        To stop the Express.js application, type `Ctrl`+`C`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-run-sample-application-3.png" alt-text="A screenshot showing how to run the sample application inside the GitHub codespace." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-run-sample-application-3.png":::
    :::column-end:::
:::row-end:::

> [!TIP]
> You can ask [GitHub Copilot](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor) about this repository. For example:
>
> * *@workspace What does this project do?*
> * *@workspace What does the .devcontainer folder do?*

Having issues? Check the [Troubleshooting section](#troubleshooting).

::: zone pivot="azure-portal"  

## 2. Create App Service and Azure Cosmos DB

In this step, you create the Azure resources. The steps used in this tutorial create a set of secure-by-default resources that include App Service and Azure Cosmos DB for MongoDB. For the creation process, you'll specify:

* The **Name** for the web app. It's used as part of the DNS name for your app in the form of `https://<app-name>-<hash>.<region>.azurewebsites.net`.
* The **Region** to run the app physically in the world. It's also used as part of the DNS name for your app.
* The **Runtime stack** for the app. It's where you select the version of Node to use for your app.
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
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-create-app-cosmos-1.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find the Web App + Database creation wizard." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-create-app-cosmos-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the **Create Web App + Database** page, fill out the form as follows.
        1. *Resource Group*: Select **Create new** and use a name of **msdocs-expressjs-mongodb-tutorial**.
        1. *Region*: Any Azure region near you.
        1. *Name*: **msdocs-expressjs-mongodb-XYZ**, where *XYZ* is any three random characters. 
        1. *Runtime stack*: **Node 20 LTS**.
        1. *Engine*: **Cosmos DB API for MongoDB**. Azure Cosmos DB is a cloud native database offering a 100% MongoDB compatible API. Note the database name that's generated for you (*\<app-name>-database*). You'll need it later.
        1. *Hosting plan*: **Basic**. When you're ready, you can [scale up](manage-scale-up.md) to a production pricing tier.
        1. Select **Review + create**.
        1. After validation completes, select **Create**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-create-app-cosmos-2.png" alt-text="A screenshot showing how to configure a new app and database in the Web App + Database wizard." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-create-app-cosmos-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** The deployment takes a few minutes to complete. Once deployment completes, select the **Go to resource** button. You're taken directly to the App Service app, but the following resources are created:
        - **Resource group** &rarr; The container for all the created resources.
        - **App Service plan** &rarr; Defines the compute resources for App Service. A Linux plan in the *Basic* tier is created.
        - **App Service** &rarr; Represents your app and runs in the App Service plan.
        - **Virtual network** &rarr; Integrated with the App Service app and isolates back-end network traffic.
        - **Private endpoint** &rarr; Access endpoint for the database resource in the virtual network.
        - **Network interface** &rarr; Represents a private IP address for the private endpoint.
        - **Azure Cosmos DB for MongoDB** &rarr; Accessible only from behind the private endpoint. A database and a user are created for you on the server.
        - **Private DNS zone** &rarr; Enables DNS resolution of the Azure Cosmos DB server in the virtual network.
        
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-create-app-cosmos-3.png" alt-text="A screenshot showing the deployment process completed." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-create-app-cosmos-3.png":::
    :::column-end:::
:::row-end:::

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 3. Secure connection secrets

The creation wizard generated the connectivity string for you already as an [app setting](configure-common.md#configure-app-settings). However, the security best practice is to keep secrets out of App Service completely. You'll move your secrets to a key vault and change your app setting to a [Key Vault reference](app-service-key-vault-references.md) with the help of Service Connectors.

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. In the left menu, select **Settings > Environment variables**. 
        1. Next to **AZURE_COSMOS_CONNECTIONSTRING**, select **Show value**.
        This connection string lets you connect to the Cosmos DB database secured behind a private endpoint. However, the secret is saved directly in the App Service app, which isn't the best. You'll change this.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-secure-connection-secrets-1.png" alt-text="A screenshot showing how to see the value of an app setting." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-secure-connection-secrets-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** Create a key vault for secure management of secrets.
        1. In the top search bar, type "*key vault*", then select **Marketplace** > **Key Vault**.
        1. In **Resource Group**, select **msdocs-expressjs-mongodb-tutorial**.
        1. In **Key vault name**, type a name that consists of only letters and numbers.
        1. In **Region**, set it to the sample location as the resource group.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-secure-connection-secrets-2.png" alt-text="A screenshot showing how to create a key vault." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-secure-connection-secrets-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:**
        1. Select the **Networking** tab.
        1. Unselect **Enable public access**.
        1. Select **Create a private endpoint**.
        1. In **Resource Group**, select **msdocs-expressjs-mongodb-tutorial**.
        1. In **Key vault name**, type a name that consists of only letters and numbers.
        1. In **Region**, set it to the sample location as the resource group.
        1. In the dialog, in **Location**, select the same location as your App Service app.
        1. In **Resource Group**, select **msdocs-expressjs-mongodb-tutorial**.
        1. In **Name**, type **msdocs-expressjs-mongodb-XYZVaultEndpoint**.
        1. In **Virtual network**, select **msdocs-expressjs-mongodb-XYZVnet**.
        1. In **Subnet**, **msdocs-expressjs-mongodb-XYZSubnet**.
        1. Select **OK**.
        1. Select **Review + create**, then select **Create**. Wait for the key vault deployment to finish. You should see "Your deployment is complete."
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-secure-connection-secrets-3.png" alt-text="A screenshot showing how to secure a key vault with a private endpoint." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-secure-connection-secrets-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4:**
        1. In the top search bar, type *msdocs-expressjs-mongodb*, then the App Service resource called **msdocs-expressjs-mongodb-XYZ**.
        1. In the App Service page, in the left menu, select **Settings > Service Connector**. There's already a connector, which the app creation wizard created for you.
        1. Select checkbox next to the connector, then select **Edit**.
        1. In the **Basics** tab, set **Client type** to **Node.js**.
        1. Select the **Authentication** tab.
        1. Select **Store Secret in Key Vault**.
        1. Under **Key Vault Connection**, select **Create new**. 
        A **Create connection** dialog is opened on top of the edit dialog.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-secure-connection-secrets-4.png" alt-text="A screenshot showing how to edit a service connector with a key vault connection." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-secure-connection-secrets-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5:** In the **Create connection** dialog for the Key Vault connection:
        1. In **Key Vault**, select the key vault you created earlier.
        1. Select **Review + Create**. You should see that **System assigned managed identity** is set to **Selected**.
        1. When validation completes, select **Create**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-secure-connection-secrets-5.png" alt-text="A screenshot showing how to configure a key vault service connector." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-secure-connection-secrets-5.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6:** You're back in the edit dialog for **defaultConnector**.
        1. In the **Authentication** tab, wait for the key vault connector to be created. When it's finished, the **Key Vault Connection** dropdown automatically selects it.
        1. Select **Next: Networking**.
        1. Select **Configure firewall rules to enable access to target service**. If you see the message, "No Private Endpoint on the target service," ignore it. The app creation wizard already secured the Cosmos DB database with a private endpoint.
        1. Select **Save**. Wait until the **Update succeeded** notification appears.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-secure-connection-secrets-6.png" alt-text="A screenshot showing the key vault connection selected in the defaultConnector." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-secure-connection-secrets-6.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 7:** To verify your changes: 
        1. From the left menu, select **Environment variables** again.
        1. Next to the app setting **AZURE_COSMOS_CONNECTIONSTRING**, select **Show value**. The value should be `@Microsoft.KeyVault(...)`, which means that it's a [key vault reference](app-service-key-vault-references.md) because the secret is now managed in the key vault.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-secure-connection-secrets-7.png" alt-text="A screenshot showing how to see the value of the App Service environment variable in Azure." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-secure-connection-secrets-7.png":::
    :::column-end:::
:::row-end:::

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 4. Deploy sample code

In this step, you configure GitHub deployment using GitHub Actions. It's just one of many ways to deploy to App Service, but also a great way to have continuous integration in your deployment process. By default, every `git push` to your GitHub repository kicks off the build and deploy action.

:::row:::
    :::column span="2":::
        **Step 1:** In the left menu, select **Deployment** > **Deployment Center**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-1.png" alt-text="A screenshot showing how to open the deployment center in App Service." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the Deployment Center page:
        1. In **Source**, select **GitHub**. By default, **GitHub Actions** is selected as the build provider.        
        1. Sign in to your GitHub account and follow the prompt to authorize Azure.
        1. In **Organization**, select your account.
        1. In **Repository**, select **msdocs-nodejs-mongodb-azure-sample-app**.
        1. In **Branch**, select **starter-no-infra**. This is the same branch that you worked in with your sample app, without any Azure-related files or configuration.
        1. For **Authentication type**, select **User-assigned identity**.
        1. In the top menu, select **Save**. App Service commits a workflow file into the chosen GitHub repository, in the `.github/workflows` directory.
        By default, the deployment center [creates a user-assigned identity](#i-dont-have-permissions-to-create-a-user-assigned-identity) for the workflow to authenticate using Microsoft Entra (OIDC authentication). For alternative authentication options, see [Deploy to App Service using GitHub Actions](deploy-github-actions.md).
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-2.png" alt-text="A screenshot showing how to configure CI/CD using GitHub Actions." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2"::: 
        **Step 3:** Back in the GitHub codespace of your sample fork, run `git pull origin starter-no-infra`. 
        This pulls the newly committed workflow file into your codespace.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-3.png" alt-text="A screenshot showing git pull inside a GitHub codespace." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4 (Option 1: with GitHub Copilot):**  
        1. Start a new chat session by selecting the **Chat** view, then selecting **+**.
        1. Ask, "*@workspace How does the app connect to the database?*" Copilot might point you to the *app.js* file and the `mongoose.connect` call.
        1. Say, "*I have a connection string variable in Azure called AZURE_COSMOS_CONNECTIONSTRING.". Copilot might give you a code suggestion similar to the one in the **Option 2: without GitHub Copilot** steps below and even tell you to make the change in [app.js](https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app/blob/main/app.js).
        1. Open *app.js* in the explorer and add the code suggestion in the `getApp` method.
        GitHub Copilot doesn't give you the same response every time, you might need to ask more questions to fine-tune its response. For tips, see [What can I do with GitHub Copilot in my codespace?](#what-can-i-do-with-github-copilot-in-my-codespace).
    :::column-end:::
    :::column:::
        :::image type="content" source="media/tutorial-nodejs-mongodb-app/github-copilot-1.png" alt-text="A screenshot showing how to ask a question in a new GitHub Copilot chat session." lightbox="media/tutorial-nodejs-mongodb-app/github-copilot-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4 (Option 2: without GitHub Copilot):** 
        1. From the explorer, open *app.js*.
        1. Find the line where `mongoose.connect` is called (Line 16) and change `process.env.MONGODB_URI` to `process.env.AZURE_COSMOS_CONNECTIONSTRING || process.env.MONGODB_URI`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-4.png" alt-text="A screenshot showing a GitHub codespace and app.js opened." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5:**
        1. Select the **Source Control** extension.
        1. In the textbox, type a commit message like `Update environment variable`. Or, select :::image type="icon" source="media/quickstart-dotnetcore/github-copilot-in-editor.png" border="false"::: and let GitHub Copilot generate a commit message for you.
        1. Select **Commit**, then confirm with **Yes**.
        1. Select **Sync changes 1**, then confirm with **OK**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-5.png" alt-text="A screenshot showing the changes being committed and pushed to GitHub." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-5.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6:**
        Back in the Deployment Center page in the Azure portal:
        1. Under the **Logs** tab, select **Refresh**. A new deployment run is already started from your committed changes.
        1. In the log item for the deployment run, select the **Build/Deploy Logs** entry with the latest timestamp.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-6.png" alt-text="A screenshot showing a successful deployment in the deployment center's Logs page." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-6.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 7:** You're taken to your GitHub repository and see that the GitHub action is running. The workflow file defines two separate stages, build and deploy. Wait for the GitHub run to show a status of **Complete**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-7.png" alt-text="A screenshot showing a successful GitHub run." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-7.png":::
    :::column-end:::
:::row-end:::

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 5. Browse to the app

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, select **Overview**.
        1. Select the URL of your app. You can also navigate directly to `https://<app-name>.azurewebsites.net`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-browse-app-1.png" alt-text="A screenshot showing how to launch an App Service from the Azure portal." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-browse-app-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** Add a few tasks to the list.
        Congratulations, you're running a secure data-driven Node.js app in Azure App Service.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-browse-app-2.png" alt-text="A screenshot of the Express.js app running in App Service." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-browse-app-2.png":::
    :::column-end:::
:::row-end:::

## 6. Stream diagnostic logs

Azure App Service captures all messages logged to the console to assist you in diagnosing issues with your application. The sample app outputs console log messages in each of its endpoints to demonstrate this capability. For example, the `get` endpoint outputs a message about the number of tasks retrieved from the database and an error message appears if something goes wrong.

:::code language="javascript" source="~/msdocs-nodejs-mongodb-azure-sample-app/routes/index.js" range="7-21" highlight="8,12":::

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, select **App Service logs**.
        1. Under **Application logging**, select **File System**.
        1. In the top menu, select **Save**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-stream-diagnostic-logs-1.png" alt-text="A screenshot showing how to enable native logs in App Service in the Azure portal." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-stream-diagnostic-logs-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** From the left menu, select **Log stream**. You see the logs for your app, including platform logs and logs from inside the container.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-stream-diagnostic-logs-2.png" alt-text="A screenshot showing how to view the log stream in the Azure portal." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-stream-diagnostic-logs-2.png":::
    :::column-end:::
:::row-end:::

## 7. Inspect deployed files using Kudu

Azure App Service provides a web-based diagnostics console named [Kudu](./resources-kudu.md) that lets you examine the server hosting environment for your web app. Using Kudu, you can view the files deployed to Azure, review the deployment history of the application, and even open an SSH session into the hosting environment.

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, select **Advanced Tools**.
        1. Select **Go**. You can also navigate directly to `https://<app-name>.scm.azurewebsites.net`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-inspect-kudu-1.png" alt-text="A screenshot showing how to navigate to the App Service Kudu page." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-inspect-kudu-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the Kudu page, select **Deployments**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-inspect-kudu-2.png" alt-text="A screenshot of the main page in the Kudu SCM app showing the different information available about the hosting environment." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-inspect-kudu-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        If you deploy code to App Service using Git or zip deploy, you see a history of deployments of your web app.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-inspect-kudu-3.png" alt-text="A screenshot showing deployment history of an App Service app in JSON format." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-inspect-kudu-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** Go back to the Kudu homepage and select **Site wwwroot**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-inspect-kudu-4.png" alt-text="A screenshot showing site wwwroot selected." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-inspect-kudu-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        You can see the deployed folder structure and select to browse and view the files.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-inspect-kudu-5.png" alt-text="A screenshot of deployed files in the wwwroot directory." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-inspect-kudu-5.png":::
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
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-clean-up-resources-1.png" alt-text="A screenshot showing how to search for and navigate to a resource group in the Azure portal." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-clean-up-resources-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the resource group page, select **Delete resource group**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-clean-up-resources-2.png" alt-text="A screenshot showing the location of the Delete Resource Group button in the Azure portal." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-clean-up-resources-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** 
        1. Enter the resource group name to confirm your deletion.
        1. Select **Delete**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-clean-up-resources-3.png" alt-text="A screenshot of the confirmation dialog for deleting a resource group in the Azure portal." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-clean-up-resources-3.png"::::
    :::column-end:::
:::row-end:::

::: zone-end

::: zone pivot="azure-developer-cli"

## 2. Create Azure resources and deploy a sample app

In this step, you create the Azure resources and deploy a sample app to App Service on Linux. The steps used in this tutorial create a set of secure-by-default resources that include App Service and Azure Cosmos DB.

The dev container already has the [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) (AZD).

1. From the repository root, run `azd init`.

    ```bash
    azd init --template nodejs-app-service-cosmos-redis-infra
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
    - **App Service plan**: Defines the compute resources for App Service. A Linux plan in the *B1* tier is created.
    - **App Service**: Represents your app and runs in the App Service plan.
    - **Virtual network**: Integrated with the App Service app and isolates back-end network traffic.
    - **Azure Cosmos DB account with MongoDB API**: Accessible only from behind its private endpoint. A database is created for you on the server.
    - **Azure Cache for Redis**: Accessible only from within the virtual network.
    - **Key vault**: Accessible only from behind its private endpoint. Used to manage secrets for the App Service app.
    - **Private endpoints**: Access endpoints for the key vault, the database server, and the Redis cache in the virtual network.
    - **Private DNS zones**: Enable DNS resolution of the Cosmos DB database, the Redis cache, and the key vault in the virtual network.
    - **Log Analytics workspace**: Acts as the target container for your app to ship its logs, where you can also query the logs.

    Once the command finishes creating resources and deploying the application code the first time, the deployed sample app doesn't work yet because you must make small changes to make it connect to the database in Azure.

## 3. Verify connection strings

The AZD template you use generated the connectivity variables for you already as [app settings](configure-common.md#configure-app-settings) and outputs the them to the terminal for your convenience. App settings are one way to keep connection secrets out of your code repository.

1. In the AZD output, find the app setting `AZURE_COSMOS_CONNECTIONSTRING`. Only the setting names are displayed. They look like this in the AZD output:

    <pre>
    App Service app has the following app settings:
            - AZURE_COSMOS_CONNECTIONSTRING
            - AZURE_REDIS_CONNECTIONSTRING
            - AZURE_KEYVAULT_RESOURCEENDPOINT
            - AZURE_KEYVAULT_SCOPE
    </pre>

    `AZURE_COSMOS_CONNECTIONSTRING` contains the connection string to the Cosmos DB database in Azure. You need to use it in your code later. 

1. For your convenience, the AZD template shows you the direct link to the app's app settings page. Find the link and open it in a new browser tab.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 4. Modify sample code and redeploy

# [With GitHub Copilot](#tab/copilot)

1. In the GitHub codespace, start a new chat session by clicking the **Chat** view, then clicking **+**. 

1. Ask, "*@workspace How does the app connect to the database?*" Copilot might point you to the *app.js* file and the `mongoose.connect` call.

1. Say, "*I have a connection string variable in Azure called AZURE_COSMOS_CONNECTIONSTRING.*". Copilot might give you a code suggestion similar to the one in the **Option 2: without GitHub Copilot** steps below and even tell you to make the change in [app.js](https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app/blob/main/app.js).

1. Open *app.js* in the explorer and add the code suggestion in the `getApp` method.

    GitHub Copilot doesn't give you the same response every time, you might need to ask more questions to fine-tune its response. For tips, see [What can I do with GitHub Copilot in my codespace?](#what-can-i-do-with-github-copilot-in-my-codespace).

1. Back in the codespace terminal, run `azd deploy`.

    ```bash
    azd deploy
    ```

# [Without GitHub Copilot](#tab/nocopilot)

1. From the explorer, open *app.js* and see that the app creates a Mongoose connection using `MONGODB_URI` (Line 16).

1. Change `process.env.MONGODB_URI` to `process.env.AZURE_COSMOS_CONNECTIONSTRING || process.env.MONGODB_URI`.

    This change makes it possible to pick the right environment variable for the MongoDB connection string, regardless of whether you're running locally or in Azure. You can use the same variable name for both environments, but that's beyond the scope of the tutorial.

1. Back in the codespace terminal, run `azd deploy`.
 
    ```bash
    azd deploy
    ```

-----

> [!TIP]
> You can also just use `azd up` always, which does all of `azd package`, `azd provision`, and `azd deploy`.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 5. Browse to the app

1. In the AZD output, find the URL of your app and navigate to it in the browser. The URL looks like this in the AZD output:

    <pre>
    Deploying services (azd deploy)
    
      (✓) Done: Deploying service web
      - Endpoint: https://&lt;app-name>-&lt;hash>.azurewebsites.net/
    </pre>

2. Add a few tasks to the list.

    :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-browse-app-2.png" alt-text="A screenshot of the Express.js web app with Cosmos DB running in Azure showing tasks." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-browse-app-2.png":::

    Congratulations, you're running a web app in Azure App Service, with secure connectivity to Azure Cosmos DB.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 6. Stream diagnostic logs

Azure App Service captures all messages logged to the console to assist you in diagnosing issues with your application. The sample app outputs console log messages in each of its endpoints to demonstrate this capability. For example, the `get` endpoint outputs a message about the number of tasks retrieved from the database and an error message appears if something goes wrong.

:::code language="javascript" source="~/msdocs-nodejs-mongodb-azure-sample-app/routes/index.js" range="7-21" highlight="8,12":::

In the AZD output, find the link to stream App Service logs and navigate to it in the browser. The link looks like this in the AZD output:

<pre>
Stream App Service logs at: https://portal.azure.com/#@/resource/subscriptions/&lt;subscription-guid>/resourceGroups/&lt;group-name>/providers/Microsoft.Web/sites/&lt;app-name>/logStream
</pre>

Learn more about logging in Java apps in the series on [Enable Azure Monitor OpenTelemetry for .NET, Node.js, Python and Java applications](/azure/azure-monitor/app/opentelemetry-enable?tabs=java).

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 7. Clean up resources

To delete all Azure resources in the current deployment environment, run `azd down` and follow the prompts.

```bash
azd down
```

::: zone-end

## Troubleshooting

- [The portal deployment view for Azure Cosmos DB shows a Conflict status](#the-portal-deployment-view-for-azure-cosmos-db-shows-a-conflict-status)
- [The browser page of the deployed app says "Something went wrong."](#the-browser-page-of-the-deployed-app-says-something-went-wrong)

#### The portal deployment view for Azure Cosmos DB shows a Conflict status

Depending on your subscription and the region you select, you might see the deployment status for Azure Cosmos DB to be `Conflict`, with the following message in Operation details:

`Sorry, we are currently experiencing high demand in <region> region, and cannot fulfill your request at this time.`

The error is most likely caused by a limit on your subscription for the region you select. Try choosing a different region for your deployment.

#### The browser page of the deployed app says "Something went wrong."

You probably still need to make the connection string changes in your application code. See [4. Deploy sample code](#4-deploy-sample-code). 

## Frequently asked questions

- [How much does this setup cost?](#how-much-does-this-setup-cost)
- [How do I connect to the Azure Cosmos DB server that's secured behind the virtual network with other tools?](#how-do-i-connect-to-the-azure-cosmos-db-server-thats-secured-behind-the-virtual-network-with-other-tools)
- [How does local app development work with GitHub Actions?](#how-does-local-app-development-work-with-github-actions)
- [Why is the GitHub Actions deployment so slow?](#why-is-the-github-actions-deployment-so-slow)
- [I don't have permissions to create a user-assigned identity](#i-dont-have-permissions-to-create-a-user-assigned-identity)
- [What can I do with GitHub Copilot in my codespace?](#what-can-i-do-with-github-copilot-in-my-codespace)

#### How much does this setup cost?

Pricing for the created resources is as follows:

- The App Service plan is created in **Basic** tier and can be scaled up or down. See [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/).
- The Azure Cosmos DB server is created in a single region and can be distributed to other regions. See [Azure Cosmos DB pricing](https://azure.microsoft.com/pricing/details/cosmos-db/).
- The virtual network doesn't incur a charge unless you configure extra functionality, such as peering. See [Azure Virtual Network pricing](https://azure.microsoft.com/pricing/details/virtual-network/).
- The private DNS zone incurs a small charge. See [Azure DNS pricing](https://azure.microsoft.com/pricing/details/dns/). 

#### How do I connect to the Azure Cosmos DB server that's secured behind the virtual network with other tools?

- For basic access from a command-line tool, you can run `mongosh` from the app's SSH terminal. The app's container doesn't come with `mongosh`, so you must [install it manually](https://www.mongodb.com/docs/mongodb-shell/install/). Remember that the installed client doesn't persist across app restarts.
- To connect from a MongoDB GUI client, your machine must be within the virtual network. For example, it could be an Azure VM that's connected to one of the subnets, or a machine in an on-premises network that has a [site-to-site VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md) connection with the Azure virtual network.
- To connect from the MongoDB shell from the Azure Cosmos DB management page in the portal, your machine must also be within the virtual network. You could instead open the Azure Cosmos DB server's firewall for your local machine's IP address, but it increases the attack surface for your configuration.

#### How does local app development work with GitHub Actions?

Take the autogenerated workflow file from App Service as an example, each `git push` kicks off a new build and deployment run. From a local clone of the GitHub repository, you make the desired updates push it to GitHub. For example:

```terminal
git add .
git commit -m "<some-message>"
git push origin main
```

#### Why is the GitHub Actions deployment so slow?

The autogenerated workflow file from App Service defines build-then-deploy, two-job run. Because each job runs in its own clean environment, the workflow file ensures that the `deploy` job has access to the files from the `build` job:

- At the end of the `build` job, [upload files as artifacts](https://docs.github.com/actions/using-workflows/storing-workflow-data-as-artifacts).
- At the beginning of the `deploy` job, download the artifacts.

Most of the time taken by the two-job process is spent uploading and download artifacts. If you want, you can simplify the workflow file by combining the two jobs into one, which eliminates the need for the upload and download steps.

#### I don't have permissions to create a user-assigned identity

See [Set up GitHub Actions deployment from the Deployment Center](deploy-github-actions.md#set-up-github-actions-deployment-from-the-deployment-center).

#### What can I do with GitHub Copilot in my codespace?

You might notice that the GitHub Copilot chat view was already there for you when you created the codespace. For your convenience, we include the GitHub Copilot chat extension in the container definition (see *.devcontainer/devcontainer.json*). However, you need a [GitHub Copilot account](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor) (30-day free trial available). 

A few tips for you when you talk to GitHub Copilot:

- In a single chat session, the questions and answers build on each other and you can adjust your questions to fine-tune the answer you get.
- By default, GitHub Copilot doesn't have access to any file in your repository. To ask questions about a file, open the file in the editor first.
- To let GitHub Copilot have access to all of the files in the repository when preparing its answers, begin your question with `@workspace`. For more information, see [Use the @workspace agent](https://github.blog/2024-03-25-how-to-use-github-copilot-in-your-ide-tips-tricks-and-best-practices/#10-use-the-workspace-agent).
- In the chat session, GitHub Copilot can suggest changes and (with `@workspace`) even where to make the changes, but it's not allowed to make the changes for you. It's up to you to add the suggested changes and test it.

Here are some other things you can say to fine-tune the answer you get:

* @workspace Where is MONGODB_URI defined?
* Which file do I make the change in?
* Will this change break my app when running locally?
 
## Next steps

> [!div class="nextstepaction"]
> [JavaScript on Azure developer center](/azure/developer/javascript)

> [!div class="nextstepaction"]
> [Configure Node.js app in App Service](./configure-language-nodejs.md)

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)
