---
title: 'Tutorial: Linux Java app with Tomcat and MySQL'
description: Learn how to get a data-driven Linux Tomcat app working in Azure App Service, with connection to a MySQL running in Azure.
author: cephalin
ms.author: cephalin
ms.devlang: java
ms.topic: tutorial
ms.date: 05/08/2024
ms.custom: mvc, devx-track-extended-java, AppServiceConnectivity, devx-track-extended-azdevcli
zone_pivot_groups: app-service-portal-azd
---

# Tutorial: Build a Tomcat web app with Azure App Service on Linux and MySQL

This tutorial shows how to build, configure, and deploy a secure Tomcat application in Azure App Service that connects to a MySQL database (using [Azure Database for MySQL](../mysql/index.yml)). Azure App Service is a highly scalable, self-patching, web-hosting service that can easily deploy apps on Windows or Linux. When you're finished, you'll have a Tomcat app running on [Azure App Service on Linux](overview.md).

:::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-browse-app-2.png" alt-text="Screenshot of Tomcat application storing data in MySQL.":::

**To complete this tutorial, you'll need:**

::: zone pivot="azure-portal"  

* An Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free/java/).
* Knowledge of Java with Tomcat development.

::: zone-end

::: zone pivot="azure-developer-cli"

* An Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free/java).
* [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) installed. You can follow the steps with the [Azure Cloud Shell](https://shell.azure.com) because it already has Azure Developer CLI installed.
* Knowledge of Java with Tomcat development.

::: zone-end

## Skip to the end

You can quickly deploy the sample app in this tutorial and see it running in Azure. Just run the following commands in the [Azure Cloud Shell](https://shell.azure.com), and follow the prompt:

```bash
mkdir msdocs-tomcat-mysql-sample-app
cd msdocs-tomcat-mysql-sample-app
azd init --template msdocs-tomcat-mysql-sample-app
azd up
```

## 1. Run the sample

First, you set up a sample data-driven app as a starting point. For your convenience, the [sample repository](https://github.com/Azure-Samples/msdocs-tomcat-mysql-sample-app), includes a [dev container](https://docs.github.com/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers) configuration. The dev container has everything you need to develop an application, including the database, cache, and all environment variables needed by the sample application. The dev container can run in a [GitHub codespace](https://docs.github.com/en/codespaces/overview), which means you can run the sample on any computer with a web browser.

:::row:::
    :::column span="2":::
        **Step 1:** In a new browser window:
        1. Sign in to your GitHub account.
        1. Navigate to [https://github.com/Azure-Samples/msdocs-tomcat-mysql-sample-app/fork](https://github.com/Azure-Samples/msdocs-tomcat-mysql-sample-app/fork).
        1. Unselect **Copy the main branch only**. You want all the branches.
        1. Select **Create fork**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-run-sample-application-1.png" alt-text="A screenshot showing how to create a fork of the sample GitHub repository." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-run-sample-application-1.png":::
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
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-run-sample-application-2.png" alt-text="A screenshot showing how to create a codespace in GitHub." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-run-sample-application-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** In the codespace terminal:
        1. Run `mvn jetty:run`.
        1. When you see the notification `Your application running on port 80 is available.`, select **Open in Browser**.
        You should see the sample application in a new browser tab.
        To stop the Jetty server, type `Ctrl`+`C`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-run-sample-application-3.png" alt-text="A screenshot showing how to run the sample application inside the GitHub codespace." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-run-sample-application-3.png":::
    :::column-end:::
:::row-end:::

Having issues? Check the [Troubleshooting section](#troubleshooting).

::: zone pivot="azure-portal"  

## 2. Create App Service and MySQL

First, you create the Azure resources. The steps used in this tutorial create a set of secure-by-default resources that include App Service and Azure Database for MySQL. For the creation process, you specify:

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
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-create-app-mysql-1.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find the Web App + Database creation wizard." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-create-app-mysql-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the **Create Web App + Database** page, fill out the form as follows.
        1. *Resource Group*: Select **Create new** and use a name of **msdocs-tomcat-mysql-tutorial**.
        1. *Region*: Any Azure region near you.
        1. *Name*: **msdocs-tomcat-mysql-XYZ** where *XYZ* is any three random characters. This name must be unique across Azure.
        1. *Runtime stack*: **Java 17**.
        1. *Java web server stack*: **Apache Tomcat 10.1**.
        1. **MySQL - Flexible Server** is selected for you by default as the database engine. If not, select it. Azure Database for MySQL is a fully managed MySQL database as a service on Azure, compatible with the latest community editions.
        1. *Hosting plan*: **Basic**. When you're ready, you can [scale up](manage-scale-up.md) to a production pricing tier later.
        1. Select **Review + create**.
        1. After validation completes, select **Create**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-create-app-mysql-2.png" alt-text="A screenshot showing how to configure a new app and database in the Web App + Database wizard." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-create-app-mysql-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** The deployment takes a few minutes to complete. Once deployment completes, select the **Go to resource** button. You're taken directly to the App Service app, but the following resources are created:
        - **Resource group**: The container for all the created resources.
        - **App Service plan**: Defines the compute resources for App Service. A Linux plan in the *Basic* tier is created.
        - **App Service**: Represents your app and runs in the App Service plan.
        - **Virtual network**: Integrated with the App Service app and isolates back-end network traffic.
        - **Azure Database for MySQL flexible server**: Accessible only from behind its private endpoint. A database and a user are created for you on the server.
        - **Private DNS zones**: Enable DNS resolution of the database server and the Redis cache in the virtual network.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-create-app-mysql-3.png" alt-text="A screenshot showing the deployment process completed." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-create-app-mysql-3.png":::
    :::column-end:::
:::row-end:::

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 3. Verify connection settings

The creation wizard generated the connectivity string for you already as [app settings](configure-common.md#configure-app-settings). In this step, you learn where to find the app settings, and how you can create your own.

App settings are one way to keep connection secrets out of your code repository. When you're ready to move your secrets to a more secure location, you can use [Key Vault references](app-service-key-vault-references.md) instead.

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page, in the left menu, select **Configuration**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-get-connection-string-1.png" alt-text="A screenshot showing how to open the configuration page in App Service." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-get-connection-string-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** 
        1. In the **Application settings** tab of the **Configuration** page, find the app setting `AZURE_MYSQL_CONNECTIONSTRING`. The creation wizard created it for you.
        1. If you want, you can select the **Edit** button to the right of each setting and see or copy its value, or select Add to add a variable to inject into your Tomcat container. If you add an app setting that contains a valid Oracle, SQL Server, PostgreSQL, or MySQL connection string, App Service adds it as a Java Naming and Directory Interface (JNDI) data source in the Tomcat server's *context.xml* file. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-get-connection-string-2.png" alt-text="A screenshot showing how to see the autogenerated connection string." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-get-connection-string-2.png":::
    :::column-end:::
:::row-end:::

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 4. Confirm JNDI data source

In this step, you use the SSH connection to the app container to verify the JNDI data source in the Tomcat server. In the process, you learn how to access the SSH shell for the Tomcat container.

:::row:::
    :::column span="2":::
        **Step 1:** Back in the App Service page, 
        1. In the left menu, select **SSH**.
        1. Select **Go**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-check-config-in-ssh-1.png" alt-text="A screenshot showing how to open the SSH shell for your app from the Azure portal." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-check-config-in-ssh-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the SSH terminal, run `cat /usr/local/tomcat/conf/context.xml`. You should see that a JNDI resource called `jdbc/AZURE_MYSQL_CONNECTIONSTRING_DS` was added. You'll use this data source later.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-check-config-in-ssh-2.png" alt-text="A screenshot showing the commands to run in the SSH shell and their output." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-check-config-in-ssh-2.png":::
    :::column-end:::
:::row-end:::

> [!NOTE]
> Only changes to files in `/home` can persist beyond app restarts. For example, if you edit `/usr/local/tomcat/conf/server.xml`, the changes won't persist beyond an app restart.
>

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 5. Deploy sample code

In this step, you configure GitHub deployment using GitHub Actions. It's just one of many ways to deploy to App Service, but also a great way to have continuous integration in your deployment process. By default, every `git push` to your GitHub repository kicks off the build and deploy action.

Like the Tomcat convention, if you want to deploy to the root context of Tomcat, name your built artifact *ROOT.war*.

:::row:::
    :::column span="2":::
        **Step 1:** Back in the App Service page, in the left menu, select **Deployment Center**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-deploy-sample-code-1.png" alt-text="A screenshot showing how to open the deployment center in App Service." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-deploy-sample-code-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the Deployment Center page:
        1. In **Source**, select **GitHub**. By default, **GitHub Actions** is selected as the build provider.        
        1. Sign in to your GitHub account and follow the prompt to authorize Azure.
        1. In **Organization**, select your account.
        1. In **Repository**, select **msdocs-tomcat-mysql-sample-app**.
        1. In **Branch**, select **starter-no-infra**. This is the same branch that you worked in with your sample app, without any Azure-related files or configuration.
        1. For **Authentication type**, select **User-assigned identity**.
        1. In the top menu, select **Save**. App Service commits a workflow file into the chosen GitHub repository, in the `.github/workflows` directory.
        By default, the deployment center [creates a user-assigned identity](#i-dont-have-permissions-to-create-a-user-assigned-identity) for the workflow to authenticate using Microsoft Entra (OIDC authentication). For alternative authentication options, see [Deploy to App Service using GitHub Actions](deploy-github-actions.md).
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-deploy-sample-code-2.png" alt-text="A screenshot showing how to configure CI/CD using GitHub Actions." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-deploy-sample-code-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** Back in the GitHub codespace of your sample fork, run `git pull origin starter-no-infra`. 
        This pulls the newly committed workflow file into your codespace.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-deploy-sample-code-3.png" alt-text="A screenshot showing git pull inside a GitHub codespace." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-deploy-sample-code-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4:**  
        1. Open *src/main/java/com/microsoft/azure/appservice/examples/tomcatmysql/ContextListener.java* in the explorer. When the application starts, this class loads the database settings in *src/main/resources/META-INF/persistence.xml*.
        1. In the `contextIntialized()` method, find the commented code (lines 29-33) and uncomment it. 
        This code checks to see if the `AZURE_MYSQL_CONNECTIONSTRING` app setting exists, and changes the data source to `java:comp/env/jdbc/AZURE_MYSQL_CONNECTIONSTRING_DS`, which is the data source you found earlier in *context.xml* in the SSH shell.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-deploy-sample-code-4.png" alt-text="A screenshot showing a GitHub codespace and the ContextListener.java file opened." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-deploy-sample-code-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5:**
        1. Select the **Source Control** extension.
        1. In the textbox, type a commit message like `Configure Azure data source`.
        1. Select **Commit**, then confirm with **Yes**.
        1. Select **Sync changes 1**, then confirm with **OK**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-deploy-sample-code-5.png" alt-text="A screenshot showing the changes being committed and pushed to GitHub." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-deploy-sample-code-5.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6:**
        Back in the Deployment Center page in the Azure portal:
        1. Select **Logs**. A new deployment run is already started from your committed changes.
        1. In the log item for the deployment run, select the **Build/Deploy Logs** entry with the latest timestamp.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-deploy-sample-code-6.png" alt-text="A screenshot showing how to open deployment logs in the deployment center." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-deploy-sample-code-6.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 7:** You're taken to your GitHub repository and see that the GitHub action is running. The workflow file defines two separate stages, build and deploy. Wait for the GitHub run to show a status of **Complete**. It takes about 5 minutes.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-deploy-sample-code-7.png" alt-text="A screenshot showing a GitHub run in progress." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-deploy-sample-code-7.png":::
    :::column-end:::
:::row-end:::

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 6. Browse to the app

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, select **Overview**.
        1. Select the URL of your app. You can also navigate directly to `https://<app-name>.azurewebsites.net`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-browse-app-1.png" alt-text="A screenshot showing how to launch an App Service from the Azure portal." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-browse-app-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** Add a few tasks to the list.
        Congratulations, you're running a web app in Azure App Service, with secure connectivity to Azure Database for MySQL.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-browse-app-2.png" alt-text="A screenshot of the Tomcat web app with MySQL running in Azure." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-browse-app-2.png":::
    :::column-end:::
:::row-end:::

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 7. Stream diagnostic logs

Azure App Service captures all messages output to the console to help you diagnose issues with your application. The sample application includes standard Log4j logging statements to demonstrate this capability, as shown in the following snippet:

:::code language="java" source="~/msdocs-tomcat-mysql-sample-app/src/main/java/com/microsoft/azure/appservice/examples/tomcatmysql/ViewServlet.java" range="17-26" highlight="3,8":::

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, select **App Service logs**.
        1. Under **Application logging**, select **File System**.
        1. In the top menu, select **Save**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-stream-diagnostic-logs-1.png" alt-text="A screenshot showing how to enable native logs in App Service in the Azure portal." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-stream-diagnostic-logs-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** From the left menu, select **Log stream**. You see the logs for your app, including platform logs and logs from inside the container.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-stream-diagnostic-logs-2.png" alt-text="A screenshot showing how to view the log stream in the Azure portal." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-stream-diagnostic-logs-2.png":::
    :::column-end:::
:::row-end:::

Learn more about logging in Java apps in the series on [Enable Azure Monitor OpenTelemetry for .NET, Node.js, Python and Java applications](../azure-monitor/app/opentelemetry-enable.md?tabs=java).

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 8. Clean up resources

When you're finished, you can delete all of the resources from your Azure subscription by deleting the resource group.

:::row:::
    :::column span="2":::
        **Step 1:** In the search bar at the top of the Azure portal:
        1. Enter the resource group name.
        1. Select the resource group.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-clean-up-resources-1.png" alt-text="A screenshot showing how to search for and navigate to a resource group in the Azure portal." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-clean-up-resources-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the resource group page, select **Delete resource group**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-clean-up-resources-2.png" alt-text="A screenshot showing the location of the **Delete Resource Group** button in the Azure portal." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-clean-up-resources-2.png":::
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
        :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-clean-up-resources-3.png" alt-text="A screenshot of the confirmation dialog for deleting a resource group in the Azure portal." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-clean-up-resources-3.png":::
    :::column-end:::
:::row-end:::

::: zone-end

::: zone pivot="azure-developer-cli"

## 2. Create Azure resources and deploy a sample app

In this step, you create the Azure resources and deploy a sample app to App Service on Linux. The steps used in this tutorial create a set of secure-by-default resources that include App Service and Azure Database for MySQL.

The dev container already has the [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) (AZD).

1. From the repository root, run `azd init`.

    ```bash
    azd init --template tomcat-app-service-mysql-infra
    ```

1. When prompted, give the following answers:
    
    |Question  |Answer  |
    |---------|---------|
    |The current directory is not empty. Would you like to initialize a project here in '\<your-directory>'?     | **Y**        |
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
    - **Azure Database for MySQL flexible server**: Accessible only from behind its private endpoint. A database is created for you on the server.
    - **Azure Cache for Redis**: Accessible only from within the virtual network.
    - **Private DNS zones**: Enable DNS resolution of the database server and the Redis cache in the virtual network.
    - **Log Analytics workspace**: Acts as the target container for your app to ship its logs, where you can also query the logs.
    - **Key vault**: Used to keep your database password the same when you redeploy with AZD.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 3. Verify connection strings

The AZD template you use generated the connectivity variables for you already as [app settings](configure-common.md#configure-app-settings) and outputs the them to the terminal for your convenience. App settings are one way to keep connection secrets out of your code repository.

1. In the AZD output, find the app setting `AZURE_MYSQL_CONNECTIONSTRING`. To keep secrets safe, only the setting names are displayed. They look like this in the AZD output:

    <pre>
    App Service app has the following connection strings:
    
            - AZURE_MYSQL_CONNECTIONSTRING
            - AZURE_REDIS_CONNECTIONSTRING
    </pre>

    `AZURE_MYSQL_CONNECTIONSTRING` contains the connection string to the MySQL database in Azure. You need to use it in your code later. 

1. For your convenience, the AZD template shows you the direct link to the app's app settings page. Find the link and open it in a new browser tab.

    If you add an app setting that contains a valid Oracle, SQL Server, PostgreSQL, or MySQL connection string, App Service adds it as a Java Naming and Directory Interface (JNDI) data source in the Tomcat server's *context.xml* file. 

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 4. Confirm JNDI data source

In this step, you use the SSH connection to the app container to verify the JNDI data source in the Tomcat server. In the process, you learn how to access the SSH shell for the Tomcat container.

1. In the AZD output, find the URL for the SSH session and navigate to it in the browser. It looks like this in the output:

    <pre>
    Open SSH session to App Service container at: https://&lt;app-name>.scm.azurewebsites.net/webssh/host
    </pre>

1. In the SSH terminal, run `cat /usr/local/tomcat/conf/context.xml`. You should see that a JNDI resource called `jdbc/AZURE_MYSQL_CONNECTIONSTRING_DS` was added. You'll use this data source later.

    :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-check-config-in-ssh-2.png" alt-text="A screenshot showing the commands to run in the SSH shell and their output.":::

> [!NOTE]
> Only changes to files in `/home` can persist beyond app restarts. For example, if you edit `/usr/local/tomcat/conf/server.xml`, the changes won't persist beyond an app restart.
>

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 5. Modify sample code and redeploy

1. Back in the GitHub codespace of your sample fork, from the explorer, open *src/main/java/com/microsoft/azure/appservice/examples/tomcatmysql/ContextListener.java*. When the application starts, this class loads the database settings in *src/main/resources/META-INF/persistence.xml*.

1. In the `contextIntialized()` method, find the commented code (lines 29-33) and uncomment it. 

    ```java
    String azureDbUrl= System.getenv("AZURE_MYSQL_CONNECTIONSTRING");
    if (azureDbUrl!=null) {
        logger.info("Detected Azure MySQL connection string. Adding Tomcat data source...");
        props.put("jakarta.persistence.nonJtaDataSource", "java:comp/env/jdbc/AZURE_MYSQL_CONNECTIONSTRING_DS");
    }
    ```
    
    This code checks to see if the `AZURE_MYSQL_CONNECTIONSTRING` app setting exists, and changes the data source to `java:comp/env/jdbc/AZURE_MYSQL_CONNECTIONSTRING_DS`, which is the data source you found earlier in *context.xml* in the SSH shell.

1. Back in the codespace terminal, run `azd deploy`.
 
    ```bash
    azd deploy
    ```

    > [!TIP]
    > You can also just use `azd up` always, which does all of `azd package`, `azd provision`, and `azd deploy`.
    >
    > To find out how the War file is packaged, you can run `azd package --debug` by itself.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 6. Browse to the app

1. In the AZD output, find the URL of your app and navigate to it in the browser. The URL looks like this in the AZD output:

    <pre>
    Deploying services (azd deploy)
    
      (✓) Done: Deploying service web
      - Endpoint: https://&lt;app-name>.azurewebsites.net/
    </pre>

2. Add a few tasks to the list.

    :::image type="content" source="./media/tutorial-java-tomcat-mysql-app/azure-portal-browse-app-2.png" alt-text="A screenshot of the Tomcat web app with MySQL running in Azure showing tasks." lightbox="./media/tutorial-java-tomcat-mysql-app/azure-portal-browse-app-2.png":::

    Congratulations, you're running a web app in Azure App Service, with secure connectivity to Azure Database for MySQL.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 7. Stream diagnostic logs

Azure App Service can capture console logs to help you diagnose issues with your application. For convenience, the AZD template already [enabled logging to the local file system](troubleshoot-diagnostic-logs.md#enable-application-logging-linuxcontainer) and is [shipping the logs to a Log Analytics workspace](troubleshoot-diagnostic-logs.md#send-logs-to-azure-monitor).

The sample application includes standard Log4j logging statements to demonstrate this capability, as shown in the following snippet:

:::code language="java" source="~/msdocs-tomcat-mysql-sample-app/src/main/java/com/microsoft/azure/appservice/examples/tomcatmysql/ViewServlet.java" range="17-26" highlight="3,8":::

In the AZD output, find the link to stream App Service logs and navigate to it in the browser. The link looks like this in the AZD output:

<pre>
Stream App Service logs at: https://portal.azure.com/#@/resource/subscriptions/&lt;subscription-guid>/resourceGroups/&lt;group-name>/providers/Microsoft.Web/sites/&lt;app-name>/logStream
</pre>

Learn more about logging in Java apps in the series on [Enable Azure Monitor OpenTelemetry for .NET, Node.js, Python and Java applications](../azure-monitor/app/opentelemetry-enable.md?tabs=java).

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 8. Clean up resources

To delete all Azure resources in the current deployment environment, run `azd down` and follow the prompts.

```bash
azd down
```

::: zone-end

## Troubleshooting

- [I see many \<Class> scanned from multiple locations warnings with mvn jetty:run](#i-see-many-class-scanned-from-multiple-locations-warnings-with-mvn-jettyrun)
- [The portal deployment view for Azure Database for MySQL Flexible Server shows a Conflict status](#the-portal-deployment-view-for-azure-database-for-mysql-flexible-server-shows-a-conflict-status)
- [The deployed sample app doesn't show the tasks list app](#the-deployed-sample-app-doesnt-show-the-tasks-list-app)
- [I see a 404 Page Not Found error in the deployed sample app](#i-see-a-404-page-not-found-error-in-the-deployed-sample-app)

#### I see many \<Class> scanned from multiple locations warnings with mvn jetty:run

You can ignore the warnings. The Maven Jetty plugin shows the warnings because the app's *pom.xml* contains the dependency for `jakarta.servlet.jsp.jstl`, which the Jetty already provides out of the box. You need the dependency for Tomcat.

#### The portal deployment view for Azure Database for MySQL Flexible Server shows a Conflict status

Depending on your subscription and the region you select, you might see the deployment status for Azure Database for MySQL Flexible Server to be `Conflict`, with the following message in Operation details:

`InternalServerError: An unexpected error occured while processing the request.`

This error is most likely caused by a limit on your subscription for the region you select. Try choosing a different region for your deployment.

#### The deployed sample app doesn't show the tasks list app

If you see a `Hey, Java developers!` page instead of the tasks list app, App Service is most likely still loading the updated container from your most recent code deployment. Wait a few minutes and refresh the page.

#### I see a 404 Page Not Found error in the deployed sample app

Make sure that you made the code changes to use the `java:comp/env/jdbc/AZURE_MYSQL_CONNECTIONSTRING_DS` data source. If you made the changes and redeployed your code, App Service is most likely still loading the updated container. Wait a few minutes and refresh the page.

## Frequently asked questions

- [How much does this setup cost?](#how-much-does-this-setup-cost)
- [How do I connect to the MySQL server behind the virtual network with other tools?](#how-do-i-connect-to-the-mysql-server-behind-the-virtual-network-with-other-tools)
- [How does local app development work with GitHub Actions?](#how-does-local-app-development-work-with-github-actions)
- [I don't have permissions to create a user-assigned identity](#i-dont-have-permissions-to-create-a-user-assigned-identity)

#### How much does this setup cost?

Pricing for the created resources is as follows:

- The App Service plan is created in **Basic** tier and can be scaled up or down. See [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/).
- The MySQL flexible server is created in **B1ms** tier and can be scaled up or down. With an Azure free account, **B1ms** tier is free for 12 months, up to the monthly limits. See [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/mysql/flexible-server/).
- The Azure Cache for Redis is created in **Basic** tier with the minimum cache size. There's a small cost associated with this tier. You can scale it up to higher performance tiers for higher availability, clustering, and other features. See [Azure Cache for Redis pricing](https://azure.microsoft.com/pricing/details/cache/).
- The virtual network doesn't incur a charge unless you configure extra functionality, such as peering. See [Azure Virtual Network pricing](https://azure.microsoft.com/pricing/details/virtual-network/).
- The private DNS zone incurs a small charge. See [Azure DNS pricing](https://azure.microsoft.com/pricing/details/dns/). 

#### How do I connect to the MySQL server behind the virtual network with other tools?

- The Tomcat container currently doesn't have the `mysql-client` terminal too. If you want, you must manually install it. Note that anything you install doesn't persist across app restarts.
- To connect from a desktop tool like MySQL Workbench, your machine must be within the virtual network. For example, it could be an Azure VM in one of the subnets, or a machine in an on-premises network that has a [site-to-site VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md) connection with the Azure virtual network.
- You can also [integrate Azure Cloud Shell](../cloud-shell/private-vnet.md) with the virtual network.

#### How does local app development work with GitHub Actions?

Using the autogenerated workflow file from App Service as an example, each `git push` kicks off a new build and deployment run. From a local clone of the GitHub repository, you make the desired updates and push to GitHub. For example:

```terminal
git add .
git commit -m "<some-message>"
git push origin main
```

#### I don't have permissions to create a user-assigned identity

See [Set up GitHub Actions deployment from the Deployment Center](deploy-github-actions.md#set-up-github-actions-deployment-from-the-deployment-center).

## Next steps

- [Azure for Java Developers](/java/azure/)

Learn more about running Java apps on App Service in the developer guide.

> [!div class="nextstepaction"] 
> [Configure a Java app in Azure App Service](configure-language-java.md?pivots=platform-linux)

Learn how to secure your app with a custom domain and certificate.

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)
