---
title: 'Tutorial: Linux Java app with Quarkus and PostgreSQL'
description: Learn how to get a data-driven Linux Quarkus app working in Azure App Service, with connection to a PostgreSQL running in Azure.
author: cephalin
ms.author: cephalin
ms.devlang: java
ms.topic: tutorial
ms.date: 05/08/2024
ms.custom: mvc, devx-track-extended-java, AppServiceConnectivity, linux-related-content, devx-track-extended-azdevcli
zone_pivot_groups: app-service-portal-azd

---

# Tutorial: Build a Quarkus web app with Azure App Service on Linux and PostgreSQL

This tutorial shows how to build, configure, and deploy a secure [Quarkus](https://quarkus.io) application in Azure App Service that's connected to a PostgreSQL database (using [Azure Database for PostgreSQL](../postgresql/index.yml)). Azure App Service is a highly scalable, self-patching, web-hosting service that can easily deploy apps on Windows or Linux. When you're finished, you'll have a Quarkus app running on [Azure App Service on Linux](overview.md).

:::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-browse-app-2.png" alt-text="Screenshot of Quarkus application storing data in PostgreSQL.":::

**To complete this tutorial, you'll need:**

::: zone pivot="azure-portal"  

* An Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free/java/).
* Knowledge of Java with [Quarkus](https://quarkus.io) development.

::: zone-end

::: zone pivot="azure-developer-cli"

* An Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free/java).
* [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) installed. You can follow the steps with the [Azure Cloud Shell](https://shell.azure.com) because it already has Azure Developer CLI installed.
* Knowledge of Java with Tomcat development.

::: zone-end

## Skip to the end

You can quickly deploy the sample app in this tutorial and see it running in Azure. Just run the following commands in the [Azure Cloud Shell](https://shell.azure.com), and follow the prompt:

```bash
mkdir msdocs-quarkus-postgresql-sample-app
cd msdocs-quarkus-postgresql-sample-app
azd init --template msdocs-quarkus-postgresql-sample-app
azd up
```

## 1. Run the sample

First, you set up a sample data-driven app as a starting point. For your convenience, the sample repository, [Hibernate ORM with Panache and RESTEasy](https://github.com/Azure-Samples/msdocs-quarkus-postgresql-sample-app), includes a [dev container](https://docs.github.com/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers) configuration. The dev container has everything you need to develop an application, including the database, cache, and all environment variables needed by the sample application. The dev container can run in a [GitHub codespace](https://docs.github.com/en/codespaces/overview), which means you can run the sample on any computer with a web browser.

:::row:::
    :::column span="2":::
        **Step 1:** In a new browser window:
        1. Sign in to your GitHub account.
        1. Navigate to [https://github.com/Azure-Samples/msdocs-quarkus-postgresql-sample-app/fork](https://github.com/Azure-Samples/msdocs-quarkus-postgresql-sample-app/fork).
        1. Unselect **Copy the main branch only**. You want all the branches.
        1. Select **Create fork**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-run-sample-application-1.png" alt-text="A screenshot showing how to create a fork of the sample GitHub repository." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-run-sample-application-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the GitHub fork:
        1. Select **main** > **starter-no-infra** for the starter branch. This branch contains just the sample project and no Azure-related files or configuration.
        1. Select **Code** > **Create codespace on main**.
        The codespace takes a few minutes to set up.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-run-sample-application-2.png" alt-text="A screenshot showing how create a codespace in GitHub." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-run-sample-application-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** In the codespace terminal:
        1. Run `mvn quarkus:dev`.
        1. When you see the notification `Your application running on port 8080 is available.`, select **Open in Browser**. If you see a notification with port 5005, skip it.
        You should see the sample application in a new browser tab.
        To stop the Quarkus development server, type `Ctrl`+`C`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-run-sample-application-3.png" alt-text="A screenshot showing how to run the sample application inside the GitHub codespace." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-run-sample-application-3.png":::
    :::column-end:::
:::row-end:::

For more information on how the Quarkus sample application is created, see Quarkus documentation [Simplified Hibernate ORM with Panache](https://quarkus.io/guides/hibernate-orm-panache) and [Configure data sources in Quarkus](https://quarkus.io/guides/datasource).

Having issues? Check the [Troubleshooting section](#troubleshooting).

::: zone pivot="azure-portal"  

## 2. Create App Service and PostgreSQL

First, you create the Azure resources. The steps used in this tutorial create a set of secure-by-default resources that include App Service and Azure Database for PostgreSQL. For the creation process, you'll specify:

* The **Name** for the web app. It's the name used as part of the DNS name for your webapp in the form of `https://<app-name>.azurewebsites.net`.
* The **Region** to run the app physically in the world.
* The **Runtime stack** for the app. It's where you select the version of Java to use for your app.
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
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-create-app-postgres-1.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find the Web App + Database creation wizard." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-create-app-postgres-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the **Create Web App + Database** page, fill out the form as follows.
        1. *Resource Group*: Select **Create new** and use a name of **msdocs-quarkus-postgres-tutorial**.
        1. *Region*: Any Azure region near you.
        1. *Name*: **msdocs-quarkus-postgres-XYZ** where *XYZ* is any three random characters. This name must be unique across Azure.
        1. *Runtime stack*: **Java 17**.
        1. *Java web server stack*: **Java SE (Embedded Web Server)**.
        1. *Database*:  **PostgreSQL - Flexible Server**. The server name and database name are set by default to appropriate values.
        1. *Hosting plan*: **Basic**. When you're ready, you can [scale up](manage-scale-up.md) to a production pricing tier later.
        1. Select **Review + create**.
        1. After validation completes, select **Create**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-create-app-postgres-2.png" alt-text="A screenshot showing how to configure a new app and database in the Web App + Database wizard." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-create-app-postgres-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** The deployment takes a few minutes to complete. Once deployment completes, select the **Go to resource** button. You're taken directly to the App Service app, but the following resources are created:
        - **Resource group**: The container for all the created resources.
        - **App Service plan**: Defines the compute resources for App Service. A Linux plan in the *Basic* tier is created.
        - **App Service**: Represents your app and runs in the App Service plan.
        - **Virtual network**: Integrated with the App Service app and isolates back-end network traffic.
        - **Azure Database for PostgreSQL flexible server**: Accessible only from within the virtual network. A database and a user are created for you on the server.
        - **Private DNS zone**: Enables DNS resolution of the PostgreSQL server in the virtual network.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-create-app-postgres-3.png" alt-text="A screenshot showing the deployment process completed." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-create-app-postgres-3.png":::
    :::column-end:::
:::row-end:::

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 3. Verify connection settings

The creation wizard generated the connectivity variables for you already as [app settings](configure-common.md#configure-app-settings). In this step, you learn where to find the app settings, and how you can create your own.

App settings are one way to keep connection secrets out of your code repository. When you're ready to move your secrets to a more secure location, you can use [Key Vault references](app-service-key-vault-references.md) instead.

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page, in the left menu, select **Environment variables**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-get-connection-string-1.png" alt-text="A screenshot showing how to open the configuration page in App Service." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-get-connection-string-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the **App settings** tab of the **Environment variables** page, verify that `AZURE_POSTGRESQL_CONNECTIONSTRING` is present. It's injected at runtime as an environment variable.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-get-connection-string-2.png" alt-text="A screenshot showing how to see the autogenerated connection string." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-get-connection-string-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4:** Select **Add application setting**. Name the setting `PORT` and set its value to `8080`, which is the default port of the Quarkus application. Select **Apply**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-app-service-app-setting.png" alt-text="A screenshot showing how to set the PORT app setting in the Azure portal." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-app-service-app-setting.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5:** Select **Apply**, then select **Confirm**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-app-service-app-setting-save.png" alt-text="A screenshot showing how to save the PORT app setting in the Azure portal." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-app-service-app-setting-save.png":::
    :::column-end:::
:::row-end:::


Having issues? Check the [Troubleshooting section](#troubleshooting).

## 4. Deploy sample code

In this step, you'll configure GitHub deployment using GitHub Actions. It's just one of many ways to deploy to App Service, but also a great way to have continuous integration in your deployment process. By default, every `git push` to your GitHub repository will kick off the build and deploy action.

Note the following: 

- Your deployed Java package must be an [Uber-Jar](https://quarkus.io/guides/maven-tooling#uber-jar-maven).
- For simplicity of the tutorial, you'll disable tests during the deployment process. The GitHub Actions runners don't have access to the PostgreSQL database in Azure, so any integration tests that require database access will fail, such as is the case with the Quarkus sample application. 

:::row:::
    :::column span="2":::
        **Step 1:** Back in the App Service page, in the left menu, select **Deployment Center**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-1.png" alt-text="A screenshot showing how to open the deployment center in App Service." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the Deployment Center page:
        1. In **Source**, select **GitHub**. By default, **GitHub Actions** is selected as the build provider.        
        1. Sign in to your GitHub account and follow the prompt to authorize Azure.
        1. In **Organization**, select your account.
        1. In **Repository**, select **msdocs-quarkus-postgresql-sample-app**.
        1. In **Branch**, select **starter-no-infra**.
        1. In **Authentication type**, select **User-assigned identity (Preview)**.
        1. In the top menu, select **Save**. App Service commits a workflow file into the chosen GitHub repository, in the `.github/workflows` directory.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-2.png" alt-text="A screenshot showing how to configure CI/CD using GitHub Actions." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** Back in the GitHub codespace of your sample fork, run `git pull origin starter-no-infra`. 
        This pulls the newly committed workflow file into your codespace.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-3.png" alt-text="A screenshot showing git pull inside a GitHub codespace." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4:**  
        1. Open *src/main/resources/application.properties* in the explorer. Quarkus uses this file to load Java properties.
        1. Find the commented code (lines 10-11) and uncomment it.
        This code sets the production variable `%prod.quarkus.datasource.jdbc.url` to the app setting that the creation wizard for you. The `quarkus.package.type` is set to build an Uber-Jar, which you need to run in App Service.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-4.png" alt-text="A screenshot showing a GitHub codespace and the application.properties file opened." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5:** 
        1. Open *.github/workflows/main_msdocs-quarkus-postgres-XYZ.yml* in the explorer. This file was created by the App Service create wizard.
        1. Under the `Build with Maven` step, change the Maven command to `mvn clean install -DskipTests`.
        `-DskipTests` skips the tests in your Quarkus project, to avoid the GitHub workflow failing prematurely.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-5.png" alt-text="A screenshot showing a GitHub codespace and a GitHub workflow YAML opened." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-5.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6:**
        1. Select the **Source Control** extension.
        1. In the textbox, type a commit message like `Configure DB and deployment workflow`.
        1. Select **Commit**, then confirm with **Yes**.
        1. Select **Sync changes 1**, then confirm with **OK**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-6.png" alt-text="A screenshot showing the changes being committed and pushed to GitHub." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-6.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 7:** Back in the Deployment Center page in the Azure portal:
        1. Select **Logs**. A new deployment run is already started from your committed changes.
        1. In the log item for the deployment run, select the **Build/Deploy Logs** entry with the latest timestamp.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-7.png" alt-text="A screenshot showing how to open deployment logs in the deployment center." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-7.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 8:** You're taken to your GitHub repository and see that the GitHub action is running. The workflow file defines two separate stages, build and deploy. Wait for the GitHub run to show a status of **Complete**. It takes about 5 minutes.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-8.png" alt-text="A screenshot showing a GitHub run in progress." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-8.png":::
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
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-browse-app-1.png" alt-text="A screenshot showing how to launch an App Service from the Azure portal." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-browse-app-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** Add a few fruits to the list.
        Congratulations, you're running a web app in Azure App Service, with secure connectivity to Azure Database for PostgreSQL.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-browse-app-2.png" alt-text="A screenshot of the Quarkus web app with PostgreSQL running in Azure showing a list of fruits." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-browse-app-2.png":::
    :::column-end:::
:::row-end:::

## 6. Stream diagnostic logs

Azure App Service captures all messages output to the console to help you diagnose issues with your application. The sample application includes standard JBoss logging statements to demonstrate this capability as shown below.

:::code language="java" source="~/msdocs-quarkus-postgresql-sample-app/src/main/java/org/acme/hibernate/orm/panache/entity/FruitEntityResource.java" range="34-40" highlight="1,5":::

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, select **App Service logs**.
        1. Under **Application logging**, select **File System**.
        1. In the top menu, select **Save**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-stream-diagnostic-logs-1.png" alt-text="A screenshot showing how to enable native logs in App Service in the Azure portal." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-stream-diagnostic-logs-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** From the left menu, select **Log stream**. You see the logs for your app, including platform logs and logs from inside the container.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-stream-diagnostic-logs-2.png" alt-text="A screenshot showing how to view the log stream in the Azure portal." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-stream-diagnostic-logs-2.png":::
    :::column-end:::
:::row-end:::

Learn more about logging in Java apps in the series on [Enable Azure Monitor OpenTelemetry for .NET, Node.js, Python and Java applications](../azure-monitor/app/opentelemetry-enable.md?tabs=java).

## 7. Clean up resources

When you're finished, you can delete all of the resources from your Azure subscription by deleting the resource group.

:::row:::
    :::column span="2":::
        **Step 1:** In the search bar at the top of the Azure portal:
        1. Enter the resource group name.
        1. Select the resource group.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-clean-up-resources-1.png" alt-text="A screenshot showing how to search for and navigate to a resource group in the Azure portal." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-clean-up-resources-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the resource group page, select **Delete resource group**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-clean-up-resources-2.png" alt-text="A screenshot showing the location of the Delete Resource Group button in the Azure portal." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-clean-up-resources-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** 
        1. Confirm your deletion by typing the resource group name.
        1. Select **Delete**.
        1. Confirm with **Delete** again.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-clean-up-resources-3.png" alt-text="A screenshot of the confirmation dialog for deleting a resource group in the Azure portal." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-clean-up-resources-3.png"::::
    :::column-end:::
:::row-end:::

::: zone-end

::: zone pivot="azure-developer-cli"

## 2. Create Azure resources and deploy a sample app

In this step, you create the Azure resources and deploy a sample app to App Service on Linux. The steps used in this tutorial create a set of secure-by-default resources that include App Service and Azure Database for PostgreSQL.

The dev container already has the [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) (AZD).

1. From the repository root, run `azd init`.

    ```bash
    azd init --template javase-app-service-postgresql-infra
    ```

1. When prompted, give the following answers:
    
    |Question  |Answer  |
    |---------|---------|
    |Continue initializing an app in '\<your-directory>'?     | **Y**        |
    |What would you like to do with these files?     | **Keep my existing files unchanged**        |
    |Enter a new environment name     | Type a unique name. The AZD template uses this name as part of the DNS name of your web app in Azure (`<app-name>.azurewebsites.net`). Alphanumeric characters and hyphens are allowed.          |

1. Sign into Azure by running the `azd auth login` command and following the prompt:

    ```bash
    azd auth login
    ```  

1. Create the necessary Azure resources and deploy the app code with the `azd up` command. Follow the prompt to select the desired subscription and location for the Azure resources.

    ```bash
    azd up
    ```  

    The `azd up` command takes about 15 minutes to complete (the Redis cache take the most time). It also compiles and deploys your application code, but you'll modify your code later to work with App Service. While it's running, the command provides messages about the provisioning and deployment process, including a link to the deployment in Azure. When it finishes, the command also displays a link to the deploy application.

    This AZD template contains files (*azure.yaml* and the *infra* directory) that generate a secure-by-default architecture with the following Azure resources:

    - **Resource group**: The container for all the created resources.
    - **App Service plan**: Defines the compute resources for App Service. A Linux plan in the *B1* tier is created.
    - **App Service**: Represents your app and runs in the App Service plan.
    - **Virtual network**: Integrated with the App Service app and isolates back-end network traffic.
    - **Azure Database for PostgreSQL flexible server**: Accessible only from behind its private endpoint. A database is created for you on the server.
    - **Azure Cache for Redis**: Accessible only from within the virtual network.
    - **Private DNS zones**: Enable DNS resolution of the database server and the Redis cache in the virtual network.
    - **Log Analytics workspace**: Acts as the target container for your app to ship its logs, where you can also query the logs.
    - **Key vault**: Used to keep your database password the same when you redeploy with AZD.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 3. Verify connection strings

The AZD template you use generated the connectivity variables for you already as [app settings](configure-common.md#configure-app-settings) and outputs the them to the terminal for your convenience. App settings are one way to keep connection secrets out of your code repository.

1. In the AZD output, find the app setting `AZURE_POSTGRESQL_CONNECTIONSTRING`. To keep secrets safe, only the setting names are displayed. They look like this in the AZD output:

    <pre>
    App Service app has the following connection strings:
    
            - AZURE_POSTGRESQL_CONNECTIONSTRING
            - AZURE_REDIS_CONNECTIONSTRING
    </pre>

    `AZURE_POSTGRESQL_CONNECTIONSTRING` contains the connection string to the PostgreSQL database in Azure. You need to use it in your code later. 

1. For your convenience, the AZD template shows you the direct link to the app's app settings page. Find the link and open it in a new browser tab. Later, you will add an app setting using AZD instead of in the portal.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 4. Modify sample code and redeploy

1. Back in the GitHub codespace of your sample fork, open *infra/resources.bicep*.

1. Find the `appSettings` resource and comment the property `PORT: '8080'`. When you're done, your `appSettings` resource should look like the following code:

    ```Bicep
    resource appSettings 'config' = {
      name: 'appsettings'
      properties: {
        PORT: '8080'
      }
    }
    ```

1. From the explorer, open *src/main/resources/application.properties*.

1. Find the commented code (lines 10-11) and uncomment it. 

    ```
    %prod.quarkus.datasource.jdbc.url=${AZURE_POSTGRESQL_CONNECTIONSTRING}
    quarkus.package.type=uber-jar
    ```
    
    This code sets the production variable `%prod.quarkus.datasource.jdbc.url` to the app setting that the creation wizard for you. The `quarkus.package.type` is set to build an Uber-Jar, which you need to run in App Service.

1. Back in the codespace terminal, run `azd up`.
 
    ```bash
    azd up
    ```

    > [!TIP]
    > `azd up` actually does `azd package`, `azd provision`, and `azd deploy`. `azd provision` lets you update the Azure changes you made in *infra/resources.bicep*. `azd deploy` uploads the built Jar file.
    >
    > To find out how the Jar file is packaged, you can run `azd package --debug` by itself.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 5. Browse to the app

1. In the AZD output, find the URL of your app and navigate to it in the browser. The URL looks like this in the AZD output:

    <pre>
    Deploying services (azd deploy)
    
      (✓) Done: Deploying service web
      - Endpoint: https://&lt;app-name>.azurewebsites.net/
    </pre>

2. Add a few fruits to the list.

    :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-browse-app-2.png" alt-text="A screenshot of the Quarkus web app with PostgreSQL running in Azure showing fruits." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-browse-app-2.png":::

    Congratulations, you're running a web app in Azure App Service, with secure connectivity to Azure Database for PostgreSQL.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 6. Stream diagnostic logs

Azure App Service can capture console logs to help you diagnose issues with your application. For convenience, the AZD template already [enabled logging to the local file system](troubleshoot-diagnostic-logs.md#enable-application-logging-linuxcontainer) and is [shipping the logs to a Log Analytics workspace](troubleshoot-diagnostic-logs.md#send-logs-to-azure-monitor).

The sample application includes standard JBoss logging statements to demonstrate this capability as shown below.

:::code language="java" source="~/msdocs-quarkus-postgresql-sample-app/src/main/java/org/acme/hibernate/orm/panache/entity/FruitEntityResource.java" range="34-40" highlight="1,5":::

In the AZD output, find the link to stream App Service logs and navigate to it in the browser. The link looks like this in the AZD output:

<pre>
Stream App Service logs at: https://portal.azure.com/#@/resource/subscriptions/&lt;subscription-guid>/resourceGroups/&lt;group-name>/providers/Microsoft.Web/sites/&lt;app-name>/logStream
</pre>

Learn more about logging in Java apps in the series on [Enable Azure Monitor OpenTelemetry for .NET, Node.js, Python and Java applications](../azure-monitor/app/opentelemetry-enable.md?tabs=java).

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 7. Clean up resources

To delete all Azure resources in the current deployment environment, run `azd down` and follow the prompts.

```bash
azd down
```

::: zone-end

## Troubleshooting

#### I see the error log "ERROR [org.acm.hib.orm.pan.ent.FruitEntityResource] (vert.x-eventloop-thread-0) Failed to handle request: jakarta.ws.rs.NotFoundException: HTTP 404 Not Found".

This is a Vert.x error (see [Quarkus Reactive Architecture](https://quarkus.io/guides/quarkus-reactive-architecture)), indicating that the client requested an unknown path. This error happens on every app startup because App Service verifies that the app starts by sending a `GET` request to `/robots933456.txt`.

#### The app failed to start and shows the following error in log: "Model classes are defined for the default persistence unit \<default> but configured datasource \<default> not found: the default EntityManagerFactory will not be created."

This Quarkus error is most likely because the app can't connect to the Azure database. Make sure that the app setting `AZURE_POSTGRESQL_CONNECTIONSTRING` hasn't been changed, and that *application.properties* is using the app setting properly.

## Frequently asked questions

- [How much does this setup cost?](#how-much-does-this-setup-cost)
- [How do I connect to the PostgreSQL server that's secured behind the virtual network with other tools?](#how-do-i-connect-to-the-postgresql-server-thats-secured-behind-the-virtual-network-with-other-tools)
- [How does local app development work with GitHub Actions?](#how-does-local-app-development-work-with-github-actions)
- [What if I want to run tests with PostgreSQL during the GitHub workflow?](#what-if-i-want-to-run-tests-with-postgresql-during-the-github-workflow)

#### How much does this setup cost?

Pricing for the created resources is as follows:

- The App Service plan is created in **Basic** tier and can be scaled up or down. See [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/).
- The PostgreSQL flexible server is created in the lowest burstable tier **Standard_B1ms**, with the minimum storage size, which can be scaled up or down. See [Azure Database for PostgreSQL pricing](https://azure.microsoft.com/pricing/details/postgresql/flexible-server/).
- The virtual network doesn't incur a charge unless you configure extra functionality, such as peering. See [Azure Virtual Network pricing](https://azure.microsoft.com/pricing/details/virtual-network/).
- The private DNS zone incurs a small charge. See [Azure DNS pricing](https://azure.microsoft.com/pricing/details/dns/). 

#### How do I connect to the PostgreSQL server that's secured behind the virtual network with other tools?

- For basic access from a command-line tool, you can run `psql` from the app's SSH terminal.
- To connect from a desktop tool, your machine must be within the virtual network. For example, it could be an Azure VM in one of the subnets, or a machine in an on-premises network that has a [site-to-site VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md) connection with the Azure virtual network.
- You can also [integrate Azure Cloud Shell](../cloud-shell/private-vnet.md) with the virtual network.

#### How does local app development work with GitHub Actions?

Using the autogenerated workflow file from App Service as an example, each `git push` kicks off a new build and deployment run. From a local clone of the GitHub repository, you make the desired updates and push to GitHub. For example:

```terminal
git add .
git commit -m "<some-message>"
git push origin main
```

#### What if I want to run tests with PostgreSQL during the GitHub workflow?

The default Quarkus sample application includes tests with database connectivity. To avoid connection errors, you added the `-skipTests` property. If you want, you can run the tests against a PostgreSQL service container. For example, in the automatically generated workflow file in your GitHub fork (*.github/workflows/main_cephalin-quarkus.yml*), make the following changes:

1. Add YAML code for the PostgreSQL container to the `build` job, as shown in the following snippet.

    ```yml
    ...
    jobs:
      build:
        runs-on: ubuntu-latest
    
        # BEGIN CODE ADDITION
        container: ubuntu
        services:
          # Hostname for the PostgreSQL container
          postgresdb:
            image: postgres
            env:
              POSTGRES_PASSWORD: postgres
              POSTGRES_USER: postgres
              POSTGRES_DB: postgres
            # Set health checks to wait until postgres has started
            options: >-
              --health-cmd pg_isready
              --health-interval 10s
              --health-timeout 5s
              --health-retries 5
    
        # END CODE ADDITION
    
        steps:
          - uses: actions/checkout@v4
          ...
    ```
    
    `container: ubuntu` tells GitHub to run the `build` job in a container. This way, the connection string in your dev environment `jdbc:postgresql://postgresdb:5432/postgres` can work as-is in when the workflow runs. For more information about PostgreSQL connectivity in GitHub Actions, see [Creating PostgreSQL service containers](https://docs.github.com/en/actions/using-containerized-services/creating-postgresql-service-containers).

1. In the `Build with Maven` step, remove `-DskipTests`. For example:

    ```yml
          - name: Build with Maven
            run: mvn clean install
    ```

## Next steps

- [Azure for Java Developers](/java/azure/)
- [Quarkus](https://quarkus.io),
- [Getting Started with Quarkus](https://quarkus.io/get-started/)

Learn more about running Java apps on App Service in the developer guide.

> [!div class="nextstepaction"] 
> [Configure a Java app in Azure App Service](configure-language-java.md?pivots=platform-linux)

Learn how to secure your app with a custom domain and certificate.

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)
