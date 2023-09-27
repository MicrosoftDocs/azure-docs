---
title: Deploy a Node.js web app using MongoDB to Azure
description: This article shows you have to deploy a Node.js app using Express.js and a MongoDB database to Azure. Azure App Service is used to host the web application and Azure Cosmos DB to host the database using the 100% compatible MongoDB API built into Azure Cosmos DB.
ms.topic: tutorial
ms.date: 09/06/2022
ms.service: app-service
ms.role: developer
ms.devlang: javascript
ms.author: msangapu
author: msangapu-msft
ms.custom: scenarios:getting-started, languages:javascript, devx-track-js, devdivchpfy22, ignite-2022, AppServiceConnectivity
---

# Deploy a Node.js + MongoDB web app to Azure

[Azure App Service](overview.md) provides a highly scalable, self-patching web hosting service using the Linux operating system. This tutorial shows how to create a secure Node.js app in Azure App Service that's connected to a [Azure Cosmos DB for MongoDB](../cosmos-db/mongodb/mongodb-introduction.md) database. When you're finished, you'll have an Express.js app running on Azure App Service on Linux.

:::image type="content" source="./media/tutorial-nodejs-mongodb-app/app-diagram.png" alt-text="A diagram showing how the Express.js app will be deployed to Azure App Service and the MongoDB data will be hosted inside of Azure Cosmos DB." lightbox="./media/tutorial-nodejs-mongodb-app/app-diagram-large.png":::

This article assumes you're already familiar with [Node.js development](/training/paths/build-javascript-applications-nodejs/) and have Node and MongoDB installed locally. You'll also need an Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free/nodejs/).

## Sample application

To follow along with this tutorial, clone or download the sample application from the repository [https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app](https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app).

```bash
git clone https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app.git
```

If you want to run the application locally, do the following:

* Install the package dependencies by running `npm install`.
* Copy the `.env.sample` file to `.env` and populate the DATABASE_URL value with your MongoDB URL (for example *mongodb://localhost:27017/*).
* Start the application using `npm start`.
* To view the app, browse to `http://localhost:3000`.

## 1. Create App Service and Azure Cosmos DB

In this step, you create the Azure resources. The steps used in this tutorial create a set of secure-by-default resources that include App Service and Azure Cosmos DB for MongoDB. For the creation process, you'll specify:

* The **Name** for the web app. It's the name used as part of the DNS name for your webapp in the form of `https://<app-name>.azurewebsites.net`.
* The **Region** to run the app physically in the world.
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
        1. *Resource Group* &rarr; Select **Create new** and use a name of **msdocs-expressjs-mongodb-tutorial**.
        1. *Region* &rarr; Any Azure region near you.
        1. *Name* &rarr; **msdocs-expressjs-mongodb-XYZ** where *XYZ* is any three random characters. This name must be unique across Azure.
        1. *Runtime stack* &rarr; **Node 16 LTS**.
        1. *Hosting plan* &rarr; **Basic**. When you're ready, you can [scale up](manage-scale-up.md) to a production pricing tier later.
        1. **Azure Cosmos DB for MongoDB** is selected by default as the database engine. Azure Cosmos DB is a cloud native database offering a 100% MongoDB compatible API. Note the database name that's generated for you (*\<app-name>-database*). You'll need it later.
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

## 2. Set up database connectivity

The creation wizard generated the MongoDB URI for you already, but your app needs a `DATABASE_URL` variable and a `DATABASE_NAME` variable. In this step, you create [app settings](configure-common.md#configure-app-settings) with the format that your app needs.

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page, in the left menu, select Configuration.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-get-connection-string-1.png" alt-text="A screenshot showing how to open the configuration page in App Service." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-get-connection-string-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the **Application settings** tab of the **Configuration** page, create a `DATABASE_NAME` setting:
        1. Select **New application setting**.
        1. In the **Name** field, enter *DATABASE_NAME*.
        1. In the **Value** field, enter the automatically generated database name from the creation wizard, which looks like *msdocs-expressjs-mongodb-XYZ-database*.
        1. Select **OK**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-get-connection-string-2.png" alt-text="A screenshot showing how to see the autogenerated connection string." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-get-connection-string-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** 
        1. Scroll to the bottom of the page and select the connection string **MONGODB_URI**. It was generated by the creation wizard.
        1. In the **Value** field, select the **Copy** button and paste the value in a text file for the next step. It's in the [MongoDB connection string URI format](https://www.mongodb.com/docs/manual/reference/connection-string/).
        1. Select **Cancel**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-get-connection-string-3.png" alt-text="A screenshot showing how to create an app setting." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-get-connection-string-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4:** 
        1. Using the same steps in **Step 2**, create an app setting named *DATABASE_URL* and set the value to the one you copied from the `MONGODB_URI` connection string (i.e. `mongodb://...`).
        1. In the menu bar at the top, select **Save**.
        1. When prompted, select **Continue**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-get-connection-string-4.png" alt-text="A screenshot showing how to save settings in the configuration page." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-get-connection-string-4.png":::
    :::column-end:::
:::row-end:::

## 3. Deploy sample code

In this step, you'll configure GitHub deployment using GitHub Actions. It's just one of many ways to deploy to App Service, but also a great way to have continuous integration in your deployment process. By default, every `git push` to your GitHub repository will kick off the build and deploy action.

:::row:::
    :::column span="2":::
        **Step 1:** In a new browser window:
        1. Sign in to your GitHub account.
        1. Navigate to [https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app](https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app).
        1. Select **Fork**.
        1. Select **Create fork**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-1.png" alt-text="A screenshot showing how to create a fork of the sample GitHub repository." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the GitHub page, open Visual Studio Code in the browser by pressing the `.` key.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-2.png" alt-text="A screenshot showing how to open the Visual Studio Code browser experience in GitHub." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** In Visual Studio Code in the browser, open *config/connection.js* in the explorer.
        In the `getConnectionInfo` function, see that the app settings you created earlier for the MongoDB connection are used (`DATABASE_URL` and `DATABASE_NAME`).
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-3.png" alt-text="A screenshot showing Visual Studio Code in the browser and an opened file." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4:** Back in the App Service page, in the left menu, select **Deployment Center**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-4.png" alt-text="A screenshot showing how to open the deployment center in App Service." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5:** In the Deployment Center page:
        1. In **Source**, select **GitHub**. By default, **GitHub Actions** is selected as the build provider.        
        1. Sign in to your GitHub account and follow the prompt to authorize Azure.
        1. In **Organization**, select your account.
        1. In **Repository**, select **msdocs-nodejs-mongodb-azure-sample-app**.
        1. In **Branch**, select **main**.
        1. In the top menu, select **Save**. App Service commits a workflow file into the chosen GitHub repository, in the `.github/workflows` directory.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-5.png" alt-text="A screenshot showing how to configure CI/CD using GitHub Actions." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-5.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6:** In the Deployment Center page:
        1. Select **Logs**. A deployment run is already started.
        1. In the log item for the deployment run, select **Build/Deploy Logs**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-6.png" alt-text="A screenshot showing how to open deployment logs in the deployment center." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-6.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 7:** You're taken to your GitHub repository and see that the GitHub action is running. The workflow file defines two separate stages, build and deploy. Wait for the GitHub run to show a status of **Complete**. It takes about 15 minutes.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-7.png" alt-text="A screenshot showing a GitHub run in progress." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-deploy-sample-code-7.png":::
    :::column-end:::
:::row-end:::

## 4. Browse to the app

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

## 5. Stream diagnostic logs

Azure App Service captures all messages logged to the console to assist you in diagnosing issues with your application. The sample app outputs console log messages in each of its endpoints to demonstrate this capability. For example, the `get` endpoint outputs a message about the number of tasks retrieved from the database and an error message appears if something goes wrong.

:::code language="javascript" source="~/msdocs-nodejs-mongodb-azure-sample-app/routes/index.js" range="7-21" highlight="8,12":::

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, select **App Service logs**.
        1. Under **Application logging**, select **File System**.
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

## 6. Inspect deployed files using Kudu

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
        If you have deployed code to App Service using Git or zip deploy, you'll see a history of deployments of your web app.
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
        You can see the deployed folder structure and click to browse and view the files.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-nodejs-mongodb-app/azure-portal-inspect-kudu-5.png" alt-text="A screenshot of deployed files in the wwwroot directory." lightbox="./media/tutorial-nodejs-mongodb-app/azure-portal-inspect-kudu-5.png":::
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

## Frequently asked questions

- [How much does this setup cost?](#how-much-does-this-setup-cost)
- [How do I connect to the Azure Cosmos DB server that's secured behind the virtual network with other tools?](#how-do-i-connect-to-the-azure-cosmos-db-server-thats-secured-behind-the-virtual-network-with-other-tools)
- [How does local app development work with GitHub Actions?](#how-does-local-app-development-work-with-github-actions)
- [Why is the GitHub Actions deployment so slow?](#why-is-the-github-actions-deployment-so-slow)

#### How much does this setup cost?

Pricing for the create resources is as follows:

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

## Next steps

> [!div class="nextstepaction"]
> [JavaScript on Azure developer center](/azure/developer/javascript)

> [!div class="nextstepaction"]
> [Configure Node.js app in App Service](./configure-language-nodejs.md)

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)
