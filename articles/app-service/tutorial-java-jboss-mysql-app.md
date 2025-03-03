---
title: 'Tutorial: Linux Java app with JBoss and MySQL'
description: Learn how to get a data-driven Linux JBoss app working in Azure App Service, with connection to a MySQL running in Azure.
author: cephalin
ms.author: cephalin
ms.devlang: java
ms.topic: tutorial
ms.date: 12/11/2024
ms.custom: mvc, devx-track-extended-java, AppServiceConnectivity, devx-track-extended-azdevcli, linux-related-content
zone_pivot_groups: app-service-portal-azd
ms.collection: ce-skilling-ai-copilot
---

# Tutorial: Build a JBoss web app with Azure App Service on Linux and MySQL

This tutorial shows how to build, configure, and deploy a secure JBoss application in Azure App Service that connects to a MySQL database (using [Azure Database for MySQL](/azure/mysql/)). Azure App Service is a highly scalable, self-patching, web-hosting service that can easily deploy apps on Windows or Linux. When you're finished, you'll have a JBoss app running on [Azure App Service on Linux](overview.md).

:::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-browse-app-2.png" alt-text="Screenshot of JBoss application storing data in MySQL.":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a secure-by-default architecture for Azure App Service and Azure Database for MySQL Flexible Server.
> * Secure database connectivity using a passwordless connection string.
> * Verify JBoss data sources in App Service using JBoss CLI.
> * Deploy a JBoss sample app to App Service from a GitHub repository.
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
* Knowledge of Java with JBoss development.
* **(Optional)** To try GitHub Copilot, a [GitHub Copilot account](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor). A 30-day free trial is available.

::: zone-end

::: zone pivot="azure-developer-cli"

* An Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free/java).
* [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) installed. You can follow the steps with the [Azure Cloud Shell](https://shell.azure.com) because it already has Azure Developer CLI installed.
* Knowledge of Java with JBoss development.
* **(Optional)** To try GitHub Copilot, a [GitHub Copilot account](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor). A 30-day free trial is available.

::: zone-end

## Skip to the end

You can quickly deploy the sample app in this tutorial and see it running in Azure. Just run the following commands in the [Azure Cloud Shell](https://shell.azure.com), and follow the prompt:

```bash
mkdir msdocs-jboss-mysql-sample-app
cd msdocs-jboss-mysql-sample-app
azd init --template msdocs-jboss-mysql-sample-app
azd up
```

## 1. Run the sample

First, you set up a sample data-driven app as a starting point. For your convenience, the [sample repository](https://github.com/Azure-Samples/msdocs-jboss-mysql-sample-app), includes a [dev container](https://docs.github.com/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers) configuration. The dev container has everything you need to develop an application, including the database, cache, and all environment variables needed by the sample application. The dev container can run in a [GitHub codespace](https://docs.github.com/en/codespaces/overview), which means you can run the sample on any computer with a web browser.

:::row:::
    :::column span="2":::
        **Step 1:** In a new browser window:
        1. Sign in to your GitHub account.
        1. Navigate to [https://github.com/Azure-Samples/msdocs-jboss-mysql-sample-app/fork](https://github.com/Azure-Samples/msdocs-jboss-mysql-sample-app/fork).
        1. Unselect **Copy the main branch only**. You want all the branches.
        1. Select **Create fork**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-run-sample-application-1.png" alt-text="A screenshot showing how to create a fork of the sample GitHub repository." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-run-sample-application-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the GitHub fork:
        1. Select **main** > **starter-no-infra** for the starter branch. This branch contains just the sample project and no Azure-related files or configuration.
        Select **Code** > **Create codespace on starter-no-infra**.
        The codespace takes a few minutes to set up.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-run-sample-application-2.png" alt-text="A screenshot showing how to create a codespace in GitHub." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-run-sample-application-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** In the codespace terminal:
        1. Run `mvn clean wildfly:run`.
        1. When you see the notification `Your application running on port 8080 is available.`, wait a few seconds longer for the WildFly server to finish loading the application. Then, select **Open in Browser**.
        You should see the sample application in a new browser tab.
        To stop the WildFly server, type `Ctrl`+`C`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-run-sample-application-3.png" alt-text="A screenshot showing how to run the sample application inside the GitHub codespace." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-run-sample-application-3.png":::
    :::column-end:::
:::row-end:::

> [!TIP]
> You can ask [GitHub Copilot](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor) about this repository. For example:
>
> * *@workspace What does this project do?*
> * *@workspace What does the .devcontainer folder do?*

Having issues? Check the [Troubleshooting section](#troubleshooting).

::: zone pivot="azure-portal"  

## 2. Create App Service and MySQL

First, you create the Azure resources. The steps used in this tutorial create a set of secure-by-default resources that include App Service and Azure Database for MySQL. For the creation process, you specify:

* The **Name** for the web app. It's used as part of the DNS name for your app in the form of `https://<app-name>-<hash>.<region>.azurewebsites.net`.
* The **Region** to run the app physically in the world. It's also used as part of the DNS name for your app.
* The **Runtime stack** for the app. It's where you select the version of Java to use for your app.
* The **Hosting plan** for the app. It's the pricing tier that includes the set of features and scaling capacity for your app.
* The **Resource Group** for the app. A resource group lets you group (in a logical container) all the Azure resources needed for the application.

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resources.

:::row:::
    :::column span="2":::
        **Step 1:** In the Azure portal:
        1. In the top search bar, type *app service*.
        1. Select the item labeled **App Service** under the **Services** heading.
        1. Select **Create** > **Web App**.
        You can also navigate to the [creation wizard](https://portal.azure.com/#create/Microsoft.WebSite) directly.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-create-app-mysql-1.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find the Web App creation wizard." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-create-app-mysql-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the **Create Web App** page, fill out the form as follows.
        1. *Name*: **msdocs-jboss-mysql**. A resource group named **msdocs-jboss-mysql_group** will be generated for you.
        1. *Runtime stack*: **Java 17**.
        1. *Java web server stack*: **Red Hat JBoss EAP 8**. If you configured your Red Hat subscription with Azure already, select **Red Hat JBoss EAP 8 BYO License**.
        1. *Region*: Any Azure region near you.
        1. *Linux Plan*: **Create new** and use the name **msdocs-jboss-mysql**.
        1. *Pricing plan*: **Premium V3 P0V3**. When you're ready, you can [scale up](manage-scale-up.md) to a different pricing tier.
        1. *Deploy with your app*: Select **Database**. Azure Database for MySQL - Flexible Server is selected for you by default. It's a fully managed MySQL database as a service on Azure, compatible with the latest community editions.
        1. Select **Review + create**.
        1. After validation completes, select **Create**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-create-app-mysql-2.png" alt-text="A screenshot showing how to configure a new app and database in the Web App wizard." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-create-app-mysql-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** The deployment takes a few minutes to complete. Once deployment completes, select the **Go to resource** button. You're taken directly to the App Service app, but the following resources are created:
        - **Resource group**: The container for all the created resources.
        - **App Service plan**: Defines the compute resources for App Service. A Linux plan in the *Basic* tier is created.
        - **App Service**: Represents your app and runs in the App Service plan.
        - **Virtual network**: Integrated with the App Service app and isolates back-end network traffic.
        - **Azure Database for MySQL Flexible Server**: Accessible only from the virtual network. A database and a user are created for you on the server.
        - **Private DNS zones**: Enable DNS resolution of the database server in the virtual network.
        - **Private endpoints**: Access endpoints for the database server in the virtual network.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-create-app-mysql-3.png" alt-text="A screenshot showing the deployment process completed." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-create-app-mysql-3.png":::
    :::column-end:::
:::row-end:::

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 3. Create a passwordless connection

In this step, you generate a managed identity based service connection, which you can later use to create a data source in your JBoss server. By using a managed identity to connect to the MySQL database, your code is safe from accidental secrets leakage.

:::row:::
    :::column span="2":::
        **Step 1: Create a managed identity.** 
        1. In the top search bar, type *managed identity*.
        1. Select the item labeled **Managed Identities** under the **Services** heading.
        1. Select **Create**.
        1. In **Resource group**, select **msdocs-jboss-mysql_group**.
        1. In **Region**, select the same region that you used for your web app.
        1. In **Name**, type **msdocs-jboss-mysql-server-identity**.
        1. Select **Review + create**.
        1. Select **Create**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-create-passwordless-connection-1.png" alt-text="A screenshot showing how to configure a new managed identity." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-create-passwordless-connection-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2: Enable Microsoft Entra authentication in the MySQL server.** 
        1. In the top search bar, type *msdocs-jboss-mysql-server*.
        1. Select the Azure Database for MySQL Flexible Server resource called **msdocs-jboss-mysql-server**.
        1. From the left menu, select **Security** > **Authentication**.
        1. In **Assign access to**, select **Microsoft Entra authentication only**.
        1. In **User assigned managed identity**, select **Select**.
        1. Select **msdocs-jboss-mysql-server-identity**, then select **Add**. It takes a moment for the identity to be assigned to the MySQL server.
        1. In **Microsoft Entra Admin Name**, select **Select**.
        1. Find your Azure account and select it, then select **Select**.
        1. Select **Save** and wait for the operation to complete.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-create-passwordless-connection-2.png" alt-text="A screenshot showing how to configure Microsoft Entra authentication for Azure Database for MySQL Flexible Server." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-create-passwordless-connection-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3: Add a managed identity-based service connector.**
        1. In the top search bar, type *msdocs-jboss-mysql*.
        1. Select the App Service resource called **msdocs-jboss-mysql**.
        1. In the App Service page, in the left menu, select **Settings > Service Connector**.
        1. Select **Create**.
        1. In the **Basics** tab:
            1. Set **Service type** to **DB for MySQL flexible server**.
            1. Set **MySQL flexible server** to **msdocs-jboss-mysql-server**.
            1. Set **MySQL database** to **msdocs-jboss-mysql-database**.
            1. Set **Client type** to **Java**.
        1. Select the **Authentication** tab.
        1. Select **System assigned managed identity**.
        1. Select the **Review + Create** tab.
        1. When validation completes, select **Create on Cloud Shell** and wait for the operation to complete in the Cloud Shell.
        1. When you see the output JSON, you can close the Cloud Shell. Also, close the **Create connection** dialog.
        1. Select **Refresh** to show the new service connector.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-create-passwordless-connection-3.png" alt-text="A screenshot showing a completely configured service connector, ready to be created with cloud shell." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-create-passwordless-connection-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4: Add authentication plugins to the connection string.**
        1. From the left menu, select **Environment variables**.
        1. Select **AZURE_MYSQL_CONNECTIONSTRING**. The **Value** field should contain a `user` but no `password`. The user is a managed identity.
        1. The JBoss server in your App Service app has the authentication plugins authenticate the managed identity, but you still need to add it to the connection string. Scroll to the end of the value and append `&defaultAuthenticationPlugin=com.azure.identity.extensions.jdbc.mysql.AzureMysqlAuthenticationPlugin&authenticationPlugins=com.azure.identity.extensions.jdbc.mysql.AzureMysqlAuthenticationPlugin`.
        1. Select **Apply**.
        1. Select **Apply**, then **Confirm**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-create-passwordless-connection-4.png" alt-text="A screenshot showing how to change the value of the MySQL environment variable in Azure." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-create-passwordless-connection-4.png":::
    :::column-end:::
:::row-end:::

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 4. Confirm JNDI data source

If you add an app setting that contains a valid JDBC connection string for Oracle, SQL Server, PostgreSQL, or MySQL, App Service adds a Java Naming and Directory Interface (JNDI) data source for it in the JBoss server. In this step, you use the SSH connection to the app container to verify the JNDI data source. In the process, you learn how to access the SSH shell and run the JBoss CLI.

:::row:::
    :::column span="2":::
        **Step 1:** Back in the App Service page:
        1. In the left menu, select **Development Tools > SSH**.
        1. Select **Go**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-check-config-in-ssh-1.png" alt-text="A screenshot showing how to open the SSH shell for your app from the Azure portal." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-check-config-in-ssh-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the SSH terminal:
        1. Run `$JBOSS_HOME/bin/jboss-cli.sh --connect`.
        1. In the JBoss CLI connection, run `ls subsystem=datasources/data-source`. You should see the automatically generated data source called `AZURE_MYSQL_CONNECTIONSTRING_DS`.
        1. Get the JNDI name of the data source with `/subsystem=datasources/data-source=AZURE_MYSQL_CONNECTIONSTRING_DS:read-attribute(name=jndi-name)`.
        You now have a JNDI name `java:jboss/env/jdbc/AZURE_MYSQL_CONNECTIONSTRING_DS`, which you can use in your application code later.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-check-config-in-ssh-2.png" alt-text="A screenshot showing the JBoss CLI commands to run in the SSH shell and their output." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-check-config-in-ssh-2.png":::
    :::column-end:::
:::row-end:::

> [!NOTE]
> Only changes to files in `/home` can persist beyond app restarts. For example, if you edit `/opt/eap/standalone/configuration/standalone.xml` or change server configuration in the JBoss CLI, the changes won't persist beyond an app restart. To persist your changes, use a startup script, such as demonstrated in [Configure data sources for a Tomcat, JBoss, or Java SE app in Azure App Service](configure-language-java-data-sources.md?tabs=linux&pivots=java-jboss)
>

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 5. Deploy sample code

In this step, you configure GitHub deployment using GitHub Actions. It's just one of many ways to deploy to App Service, but also a great way to have continuous integration in your deployment process. By default, every `git push` to your GitHub repository kicks off the build and deploy action.

Like the JBoss convention, if you want to deploy to the root context of JBoss, name your built artifact *ROOT.war*.

:::row:::
    :::column span="2":::
        **Step 1:** Back in the App Service page, in the left menu, select **Deployment > Deployment Center**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-deploy-sample-code-1.png" alt-text="A screenshot showing how to open the deployment center in App Service." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-deploy-sample-code-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the Deployment Center page:
        1. In **Source**, select **GitHub**. By default, **GitHub Actions** is selected as the build provider.        
        1. Sign in to your GitHub account and follow the prompt to authorize Azure.
        1. In **Organization**, select your account.
        1. In **Repository**, select **msdocs-jboss-mysql-sample-app**.
        1. In **Branch**, select **starter-no-infra**. This is the same branch that you worked in with your sample app, without any Azure-related files or configuration.
        1. For **Authentication type**, select **User-assigned identity**.
        1. In the top menu, select **Save**. App Service commits a workflow file into the chosen GitHub repository, in the `.github/workflows` directory.
        By default, the deployment center [creates a user-assigned identity](#i-dont-have-permissions-to-create-a-user-assigned-identity) for the workflow to authenticate using Microsoft Entra (OIDC authentication). For alternative authentication options, see [Deploy to App Service using GitHub Actions](deploy-github-actions.md).
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-deploy-sample-code-2.png" alt-text="A screenshot showing how to configure CI/CD using GitHub Actions." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-deploy-sample-code-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** Back in the GitHub codespace of your sample fork, run `git pull origin starter-no-infra`. 
        This pulls the newly committed workflow file into your codespace. You can modify it according to your needs at *.github/workflows/starter-no-infra_msdocs-jboss-mysql.yml*.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-deploy-sample-code-3.png" alt-text="A screenshot showing git pull inside a GitHub codespace." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-deploy-sample-code-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4 (Option 1: with GitHub Copilot):**  
        1. Start a new chat session by clicking the **Chat** view, then clicking **+**.
        1. Ask, "*@workspace How does the app connect to the database?*" Copilot might give you some explanation about the `java:jboss/MySQLDS` data source and how it's configured. 
        1. Say, "*The data source in JBoss in Azure uses the JNDI name java:jboss/env/jdbc/AZURE_MYSQL_CONNECTIONSTRING_DS.*" Copilot might give you a code suggestion similar to the one in the **Option 2: without GitHub Copilot** steps below and even tell you to make the change in the class. 
        GitHub Copilot doesn't give you the same response every time, you might need to ask more questions to fine-tune its response. For tips, see [What can I do with GitHub Copilot in my codespace?](#what-can-i-do-with-github-copilot-in-my-codespace).
    :::column-end:::
    :::column:::
        :::image type="content" source="media/tutorial-java-jboss-mysql-app/github-copilot-1.png" alt-text="A screenshot showing how to ask a question in a new GitHub Copilot chat session." lightbox="media/tutorial-java-jboss-mysql-app/github-copilot-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4 (Option 2: without GitHub Copilot):**  
        1. Open *src/main/resources/META-INF/persistence.xml* in the explorer. When the application starts, it loads the database settings in this file.
        1. Change the value of `<jta-data-source>` from `java:jboss/MySQLDS` to `java:jboss/env/jdbc/AZURE_MYSQL_CONNECTIONSTRING_DS`, which is the data source you found with JBoss CLI earlier in the SSH shell.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-deploy-sample-code-4.png" alt-text="A screenshot showing a GitHub codespace and the ContextListener.java file opened." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-deploy-sample-code-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5:**
        1. Select the **Source Control** extension.
        1. In the textbox, type a commit message like `Configure Azure JNDI name`.
        1. Select **Commit**, then confirm with **Yes**.
        1. Select **Sync changes 1**, then confirm with **OK**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-deploy-sample-code-5.png" alt-text="A screenshot showing the changes being committed and pushed to GitHub." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-deploy-sample-code-5.png":::
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
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-deploy-sample-code-6.png" alt-text="A screenshot showing how to open deployment logs in the deployment center." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-deploy-sample-code-6.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 7:** You're taken to your GitHub repository and see that the GitHub action is running. The workflow file defines two separate stages, build and deploy. Wait for the GitHub run to show a status of **Complete**. It takes about 5 minutes.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-deploy-sample-code-7.png" alt-text="A screenshot showing a GitHub run in progress." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-deploy-sample-code-7.png":::
    :::column-end:::
:::row-end:::

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 6. Browse to the app

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, select **Overview**.
        1. In **Default domain**, select the URL of your app.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-browse-app-1.png" alt-text="A screenshot showing how to launch an App Service from the Azure portal." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-browse-app-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** Add a few tasks to the list.
        Congratulations, you're running a web app in Azure App Service, with secure connectivity to Azure Database for MySQL.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-browse-app-2.png" alt-text="A screenshot of the JBoss web app with MySQL running in Azure." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-browse-app-2.png":::
    :::column-end:::
:::row-end:::

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 7. Stream diagnostic logs

Azure App Service captures all messages output to the console to help you diagnose issues with your application. The sample application includes standard Log4j logging statements to demonstrate this capability, as shown in the following snippet:

:::code language="java" source="~/msdocs-jboss-mysql-sample-app/src/main/java/com/microsoft/azure/appservice/examples/jbossmysql/model/TaskRepository.java" range="17-26" highlight="1,7":::

:::row:::
    :::column span="2":::
        In the App Service page, from the left menu, select **Log stream**. You see the logs for your app, including platform logs and logs from inside the container.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-stream-diagnostic-logs-1.png" alt-text="A screenshot showing how to view the log stream in the Azure portal." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-stream-diagnostic-logs-1.png":::
    :::column-end:::
:::row-end:::

Learn more about logging in Java apps in the series on [Enable Azure Monitor OpenTelemetry for .NET, Node.js, Python, and Java applications](/azure/azure-monitor/app/opentelemetry-enable?tabs=java).

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 8. Clean up resources

When you're finished, you can delete all of the resources from your Azure subscription by deleting the resource group.

:::row:::
    :::column span="2":::
        **Step 1:** In the search bar at the top of the Azure portal:
        1. Enter the resource group name *msdocs-jboss-mysql_group*.
        1. Select the resource group.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-clean-up-resources-1.png" alt-text="A screenshot showing how to search for and navigate to a resource group in the Azure portal." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-clean-up-resources-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the resource group page, select **Delete resource group**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-clean-up-resources-2.png" alt-text="A screenshot showing the location of the **Delete Resource Group** button in the Azure portal." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-clean-up-resources-2.png":::
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
        :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-clean-up-resources-3.png" alt-text="A screenshot of the confirmation dialog for deleting a resource group in the Azure portal." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-clean-up-resources-3.png":::
    :::column-end:::
:::row-end:::

::: zone-end

::: zone pivot="azure-developer-cli"

## 2. Create Azure resources and deploy a sample app

In this step, you create the Azure resources and deploy a sample app to App Service on Linux. The steps used in this tutorial create a set of secure-by-default resources that include App Service and Azure Database for MySQL.

The dev container already has the [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) (AZD).

1. From the repository root, run `azd init`.

    ```bash
    azd init --template jboss-app-service-mysql-infra
    ```

1. When prompted, give the following answers:
    
    |Question  |Answer  |
    |---------|---------|
    |Continue initializing an app in '`<your-directory>`'?     | **Y**        |
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
    - **Azure Database for MySQL Flexible Server**: Accessible only from the virtual network. A database is created for you on the server.
    - **Azure Cache for Redis**: Accessible only from within the virtual network.
    - **Private endpoints**: Access endpoints for the key vault and the Redis cache in the virtual network.
    - **Private DNS zones**: Enable DNS resolution of the key vault, the database server, and the Redis cache in the virtual network.
    - **Log Analytics workspace**: Acts as the target container for your app to ship its logs, where you can also query the logs.
    - **Key vault**: Used to keep your database password the same when you redeploy with AZD.
    <!-- Author note: This networking for Azure Database for MySQL's is not the same as other databases. It integrates with the virtual network directly, not indirectly through a private endpoint. -->

    Once the command finishes creating resources and deploying the application code the first time, the deployed sample app doesn't work yet because you must make small changes to make it connect to the database in Azure.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 3. Verify connection strings

The AZD template you use generated the connectivity variables for you already as [app settings](configure-common.md#configure-app-settings) and outputs the them to the terminal for your convenience. App settings are one way to keep connection secrets out of your code repository.

1. In the AZD output, find the app setting `AZURE_MYSQL_CONNECTIONSTRING`. Only the setting names are displayed. They look like this in the AZD output:

    <pre>
    App Service app has the following app settings:
            - AZURE_KEYVAULT_RESOURCEENDPOINT
            - AZURE_KEYVAULT_SCOPE
            - AZURE_MYSQL_CONNECTIONSTRING
            - AZURE_REDIS_CONNECTIONSTRING
    </pre>

    `AZURE_MYSQL_CONNECTIONSTRING` contains the connection string to the MySQL database in Azure. You need to use it in your code later. 

1. For your convenience, the AZD template shows you the direct link to the app's app settings page. Find the link and open it in a new browser tab.

    If you add an app setting that contains a valid Oracle, SQL Server, PostgreSQL, or MySQL connection string, App Service adds it as a Java Naming and Directory Interface (JNDI) data source in the JBoss server's *context.xml* file. 

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 4. Confirm JNDI data source

In this step, you use the SSH connection to the app container to verify the JNDI data source in the JBoss server. In the process, you learn how to access the SSH shell for the JBoss container.

1. In the AZD output, find the URL for the SSH session and navigate to it in the browser. It looks like this in the output:

    <pre>
    Open SSH session to App Service container at: https://&lt;app-name>-&lt;hash>.scm.azurewebsites.net/webssh/host
    </pre>

1. In the SSH terminal, run `$JBOSS_HOME/bin/jboss-cli.sh --connect`.

1. In the JBoss CLI connection, run `ls subsystem=datasources/data-source`. You should see the automatically generated data source called `AZURE_MYSQL_CONNECTIONSTRING_DS`.

1. Get the JNDI name of the data source with `/subsystem=datasources/data-source=AZURE_MYSQL_CONNECTIONSTRING_DS:read-attribute(name=jndi-name)`.
You now have a JNDI name `java:jboss/env/jdbc/AZURE_MYSQL_CONNECTIONSTRING_DS`, which you can use in your application code later.

    :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-check-config-in-ssh-2.png" alt-text="A screenshot showing the commands to run in the SSH shell and their output.":::

> [!NOTE]
> Only changes to files in `/home` can persist beyond app restarts. For example, if you edit `/opt/eap/standalone/configuration/standalone.xml` or change server configuration in the JBoss CLI, the changes won't persist beyond an app restart. To persist your changes, use a startup script, such as demonstrated in [Configure data sources for a Tomcat, JBoss, or Java SE app in Azure App Service](configure-language-java-data-sources.md?tabs=linux&pivots=java-jboss)
>

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 5. Modify sample code and redeploy

# [With GitHub Copilot](#tab/copilot)

1. In the GitHub codespace, start a new chat session by clicking the **Chat** view, then clicking **+**. 

1. Ask, "*@workspace How does the app connect to the database?*" Copilot might give you some explanation about the `java:jboss/MySQLDS` data source and how it's configured.

1. Ask, "*@workspace I want to replace the data source defined in persistence.xml with an existing JNDI data source in JBoss.*" Copilot might give you a code suggestion similar to the one in the **Option 2: without GitHub Copilot** steps below and even tell you to make the change in the [persistence.xml](https://github.com/Azure-Samples/msdocs-jboss-mysql-sample-app/blob/starter-no-infra/src/main/resources/META-INF/persistence.xml) file. 

1. Open *src/main/resources/META-INF/persistence.xml* in the explorer and make the suggested JNDI change.

    GitHub Copilot doesn't give you the same response every time, you might need to ask other questions to fine-tune its response. For tips, see [What can I do with GitHub Copilot in my codespace?](#what-can-i-do-with-github-copilot-in-my-codespace).

1. In the codespace terminal, run `azd deploy`.
 
    ```bash
    azd deploy
    ```

# [Without GitHub Copilot](#tab/nocopilot)

1. From the explorer, open *src/main/resources/META-INF/persistence.xml*.

1. In the `<jta-data-source>` element (line 7), change the JNDI data source from `java:jboss/MySQLDS` to `java:jboss/env/jdbc/AZURE_MYSQL_CONNECTIONSTRING_DS`. 

    ```xml
    <jta-data-source>java:jboss/env/jdbc/AZURE_MYSQL_CONNECTIONSTRING_DS</jta-data-source>
    ```

1. Back in the codespace terminal, run `azd deploy`.
 
    ```bash
    azd deploy
    ```

-----

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
      - Endpoint: https://&lt;app-name>-&lt;hash>.azurewebsites.net/
    </pre>

2. Add a few tasks to the list.

    :::image type="content" source="./media/tutorial-java-jboss-mysql-app/azure-portal-browse-app-2.png" alt-text="A screenshot of the JBoss web app with MySQL running in Azure showing tasks." lightbox="./media/tutorial-java-jboss-mysql-app/azure-portal-browse-app-2.png":::

    Congratulations, you're running a web app in Azure App Service, with secure connectivity to Azure Database for MySQL.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 7. Stream diagnostic logs

Azure App Service can capture console logs to help you diagnose issues with your application. For convenience, the AZD template already [enabled logging to the local file system](troubleshoot-diagnostic-logs.md#enable-application-logging-linuxcontainer) and is [shipping the logs to a Log Analytics workspace](troubleshoot-diagnostic-logs.md#send-logs-to-azure-monitor).

The sample application includes standard Log4j logging statements to demonstrate this capability, as shown in the following snippet:

:::code language="java" source="~/msdocs-jboss-mysql-sample-app/src/main/java/com/microsoft/azure/appservice/examples/jbossmysql/model/TaskRepository.java" range="17-26" highlight="1,7":::

In the AZD output, find the link to stream App Service logs and navigate to it in the browser. The link looks like this in the AZD output:

<pre>
Stream App Service logs at: https://portal.azure.com/#@/resource/subscriptions/&lt;subscription-guid>/resourceGroups/&lt;group-name>/providers/Microsoft.Web/sites/&lt;app-name>/logStream
</pre>

Learn more about logging in Java apps in the series on [Enable Azure Monitor OpenTelemetry for .NET, Node.js, Python, and Java applications](/azure/azure-monitor/app/opentelemetry-enable?tabs=java).

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 8. Clean up resources

To delete all Azure resources in the current deployment environment, run `azd down` and follow the prompts.

```bash
azd down
```

::: zone-end

## Troubleshooting

- [I see the error 'not entitled to use the Bring Your Own License feature' in the creation wizard.](#i-see-the-error-not-entitled-to-use-the-bring-your-own-license-feature-in-the-creation-wizard)
- [The portal deployment view for Azure Database for MySQL Flexible Server shows a Conflict status.](#the-portal-deployment-view-for-azure-database-for-mysql-flexible-server-shows-a-conflict-status)
- [The Create connection dialog shows a Create On Cloud Shell button but it's not enabled.](#the-create-connection-dialog-shows-a-create-on-cloud-shell-button-but-its-not-enabled)
- [My app failed to start, and I see 'Access denied for user... (using password: NO)' in the logs.](#my-app-failed-to-start-and-i-see-access-denied-for-user-using-password-no-in-the-logs)
- [The deployed sample app doesn't show the tasks list app.](#the-deployed-sample-app-doesnt-show-the-tasks-list-app)
- [I see a "Table 'Task' already exists" error in the diagnostic logs.](#i-see-a-table-task-already-exists-error-in-the-diagnostic-logs)

#### I see the error 'not entitled to use the Bring Your Own License feature' in the creation wizard.

If you see the error: `The subscription '701ea799-fb46-4407-bb67-9cbcf289f1c7' is not entitled to use the Bring Your Own License feature when creating the application`, it means that you selected **Red Hat JBoss EAP 7/8 BYO License** in **Java web server stack** but haven't set up your Azure account in Red Hat Cloud Access or don't have an active JBoss EAP license in Red Hat Cloud Access.

#### The portal deployment view for Azure Database for MySQL Flexible Server shows a Conflict status.

Depending on your subscription and the region you select, you might see the deployment status for Azure Database for MySQL Flexible Server to be `Conflict`, with the following message in Operation details:

`InternalServerError: An unexpected error occured while processing the request.`

This error is most likely caused by a limit on your subscription for the region you select. Try choosing a different region for your deployment.

#### The Create connection dialog shows a Create On Cloud Shell button but it's not enabled.

You might also see an error message in the dialog: `The database server is in Virtual Network and Cloud Shell can't connect to it. Please copy the commands and execute on an environment which can connect to the database server in Virtual Network.`

The service connector automation needs network access to the MySQL server. Look in the networking settings of your MySQL server resource and make sure **Allow public access to this resource through the internet using a public IP address** is selected at a minimum. Service Connector can take it from there. 

If you don't see this checkbox, you might have created the deployment using the [Web App + Database wizard](https://portal.azure.com/?feature.customportal=false#create/Microsoft.AppServiceWebAppDatabaseV3) instead, and the deployment locks down all public network access to the MySQL server. There's no way to modify the configuration. Since app's Linux container can access MySQL through the virtual network integration, you could install Azure CLI in the app's SSH session and run the supplied Cloud Shell commands there. 

#### The deployed sample app doesn't show the tasks list app.

If you see the JBoss splash page instead of the tasks list app, App Service is most likely still loading the updated container from your most recent code deployment. Wait a few minutes and refresh the page.

#### My app failed to start, and I see 'Access denied for user... (using password: NO)' in the logs.

This error is most likely because you didn't add the passwordless authentication plugin to the connection string (see the Java sample code for [Integrate Azure Database for MySQL with Service Connector](../service-connector/how-to-integrate-mysql.md?tabs=java#default-environment-variable-names-or-application-properties-and-sample-code)). Change the MySQL connection string by following the instructions in [3. Create a passwordless connection](#3-create-a-passwordless-connection).

#### I see a "Table 'Task' already exists" error in the diagnostic logs.

You can ignore this Hibernate error because it indicates that the application code is connected to the MySQL database. The application is configured to create the necessary tables when it starts (see *src/main/resources/META-INF/persistence.xml*). When the application starts the first time, it should create the tables successfully, but on subsequent restarts, you would see this error because the tables already exist.

## Frequently asked questions

- [How much does this setup cost?](#how-much-does-this-setup-cost)
- [How do I connect to the MySQL server behind the virtual network with other tools?](#how-do-i-connect-to-the-mysql-server-behind-the-virtual-network-with-other-tools)
- [How do I get a valid access token for the MySQL connection using Microsoft Entra authentication?](#how-do-i-get-a-valid-access-token-for-the-mysql-connection-using-microsoft-entra-authentication)
- [How does local app development work with GitHub Actions?](#how-does-local-app-development-work-with-github-actions)
- [I don't have permissions to create a user-assigned identity](#i-dont-have-permissions-to-create-a-user-assigned-identity)
- [What can I do with GitHub Copilot in my codespace?](#what-can-i-do-with-github-copilot-in-my-codespace)

#### How much does this setup cost?

Pricing for the created resources is as follows:

- The App Service plan is created in **P0v3** tier and can be scaled up or down. See [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/).
- The MySQL flexible server is created in **D2ds** tier and can be scaled up or down. See [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/mysql/flexible-server/).
- The Azure Cache for Redis is created in **Basic** tier with the minimum cache size. There's a small cost associated with this tier. You can scale it up to higher performance tiers for higher availability, clustering, and other features. See [Azure Cache for Redis pricing](https://azure.microsoft.com/pricing/details/cache/).
- The virtual network doesn't incur a charge unless you configure extra functionality, such as peering. See [Azure Virtual Network pricing](https://azure.microsoft.com/pricing/details/virtual-network/).
- The private DNS zone incurs a small charge. See [Azure DNS pricing](https://azure.microsoft.com/pricing/details/dns/). 

#### How do I connect to the MySQL server behind the virtual network with other tools?

In this tutorial, the App Service app is already has network connectivity to the MySQL server and can authenticate with Microsoft Entra by using its system-assigned managed identity. You can connect to MySQL directly from within the app container by running the following commands in the SSH session (get your `<server>`, `<user>`, and `<database>` values from the `AZURE_MYSQL_CONNECTIONSTRING` app setting):

```bash
apt-get update
apt-get install curl less mysql-client jq -y
mysql -h <server> --user <user> --database <database> --enable-cleartext-plugin --password=`curl "${IDENTITY_ENDPOINT}?resource=https://ossrdbms-aad.database.windows.net&api-version=2019-08-01" -H "X-IDENTITY-HEADER: $IDENTITY_HEADER" -s | jq -r '.access_token'`
```

A few considerations:

- The tools you install in the SSH session don't persist across app restarts.
- If you followed the portal steps and configured MySQL using your Microsoft Entra user as the administrator, you can connect to MySQL using the Microsoft Entra user.
- To connect from a desktop tool like MySQL Workbench, your machine must be within the virtual network, such as an Azure VM deployed into the same virtual network. You must also configure authentication separately, either with a managed identity or with a Microsoft Entra user.
- To connect from a machine in an on-premises network that has a [site-to-site VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md) connection with the Azure virtual network, you can't configure authentication with a managed identity, but you can configure authentication by using a Microsoft Entra user.
- You can also [integrate Azure Cloud Shell](../cloud-shell/private-vnet.md) and connect using Azure CLI or the MySQL CLI. To authenticate, you can configure a Microsoft Entra user.

#### How do I get a valid access token for the MySQL connection using Microsoft Entra authentication?

For a Microsoft Entra user, a system-assigned managed identity, or a user-assigned managed identity that's authorized to access the MySQL database, Azure CLI can help you generate an access token. In case of a managed identity, the identity must be configured on the App Service app or VM where you run Azure CLI. 

```azurecli-interactive
# Sign in as a Microsoft Entra user
az login
# Sign in as the system-assigned managed identity
az login --identity
# Sign in as a user-assigned managed identity
az login --identity --username <client-id-of-user-assigned-identity>

# Get an access token
az account get-access-token --resource-type oss-rdbms
```

If you want, you can also use the [az mysql flexible-server connect](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-connect) Azure CLI command to connect to MySQL. When prompted, use the access token as the password.

```azurecli-interactive
az mysql flexible-server connect -n <server-name-only> -u <user> -d <database> --interactive
```

For more information, see:
- [How to use managed identities for App Service and Azure Functions](overview-managed-identity.md)
- [Authenticate to Azure using Azure CLI](/cli/azure/authenticate-azure-cli)
- [Connect to Azure Database for MySQL Flexible Server using Microsoft Entra ID](/azure/mysql/flexible-server/how-to-azure-ad#connect-to-azure-database-for-mysql-flexible-server-using-microsoft-entra-id)

#### How does local app development work with GitHub Actions?

Using the autogenerated workflow file from App Service as an example, each `git push` kicks off a new build and deployment run. From a local clone of the GitHub repository, you make the desired updates and push to GitHub. For example:

```terminal
git add .
git commit -m "<some-message>"
git push origin starter-no-infra
```

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

* Change this code to use the data source jdbc/AZURE_MYSQL_CONNECTIONSTRING_DS.
* Some imports in your code are using javax but I have a Jakarta app.
* I want this code to run only if the environment variable AZURE_MYSQL_CONNECTIONSTRING is set.
* I want this code to run only in Azure App Service and not locally.
 
## Next steps

- [Azure for Java Developers](/java/azure/)

Learn more about running Java apps on App Service in the developer guide.

> [!div class="nextstepaction"] 
> [Configure a Java app in Azure App Service](configure-language-java-deploy-run.md?pivots=platform-linux)

Learn how to secure your app with a custom domain and certificate.

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)
