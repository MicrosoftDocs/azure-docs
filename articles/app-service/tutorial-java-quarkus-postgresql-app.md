---
title: 'Tutorial: Linux Java app with Quarkus and PostgreSQL'
description: Learn how to get a data-driven Linux Quarkus app working in Azure App Service, with connection to a PostgreSQL running in Azure.
author: cephalin
ms.author: cephalin
ms.devlang: java
ms.topic: tutorial
ms.date: 04/30/2025
ms.custom: mvc, devx-track-extended-java, AppServiceConnectivity
zone_pivot_groups: app-service-portal-azd
---

# Tutorial: Deploy a Quarkus web app to Azure App Service and PostgreSQL

In this tutorial, you deploy a data-driven [Quarkus](https://quarkus.io) web application to Azure App Service with the [Azure Database for PostgreSQL](/azure/postgresql/) relational database service. Azure App Service supports Java Standard Edition (Java SE) in a Windows or Linux server environment. 

:::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-browse-app-2.png" alt-text="Screenshot of Quarkus application storing data in PostgreSQL.":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a secure-by-default architecture for Azure App Service and Azure Database for PostgreSQL flexible server.
> * Secure connection secrets using a managed identity and Key Vault reference.
> * Deploy a sample Quarkus app to App Service from a GitHub repository.
> * Access App Service app settings in the application code.
> * Make updates and redeploy the application code.
> * Generate database schema by running database migrations.
> * Stream diagnostic logs from Azure.
> * Manage the app in the Azure portal.
> * Provision the same architecture and deploy by using Azure Developer CLI.
> * Optimize your development workflow with GitHub Codespaces and GitHub Copilot.

## Prerequisites

::: zone pivot="azure-portal"

* An Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free/java/).
* A GitHub account. you can also [get one for free](https://github.com/join).
* Knowledge of Java with Quarkus development.
* **(Optional)** To try GitHub Copilot, a [GitHub Copilot account](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor). A 30-day free trial is available.

::: zone-end

::: zone pivot="azure-developer-cli"

* An Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free/java).
* A GitHub account. you can also [get one for free](https://github.com/join).
* [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) installed. You can follow the steps with the [Azure Cloud Shell](https://shell.azure.com) because it already has Azure Developer CLI installed.
* Knowledge of Java with Quarkus development.
* **(Optional)** To try GitHub Copilot, a [GitHub Copilot account](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor). A 30-day free trial is available.

::: zone-end

## Skip to the end

If you just want to see the sample app in this tutorial running in Azure, just run the following commands in the [Azure Cloud Shell](https://shell.azure.com), and follow the prompt:

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
        1. Select **Code** > **Create codespace on starter-no-infra**.
        The codespace takes a few minutes to set up.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-run-sample-application-2.png" alt-text="A screenshot showing how to create a codespace in GitHub." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-run-sample-application-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** In the codespace terminal:
        1. Run `mvn quarkus:dev`.
        1. Ignore the notification `Your application running on port 5005 is available.`
        1. When you see the notification `Your application running on port 8080 is available.`, select **Open in Browser**.
        You should see the sample application in a new browser tab.
        To stop the Quarkus development server, type `Ctrl`+`C`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-run-sample-application-3.png" alt-text="A screenshot showing how to run the sample application inside the GitHub codespace." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-run-sample-application-3.png":::
    :::column-end:::
:::row-end:::

For more information on how the Quarkus sample application is created, see Quarkus documentation [Simplified Hibernate ORM with Panache](https://quarkus.io/guides/hibernate-orm-panache) and [Configure data sources in Quarkus](https://quarkus.io/guides/datasource).

> [!TIP]
> You can ask [GitHub Copilot](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor) about this repository. For example:
>
> * *@workspace What does this project do?*
> * *@workspace What does the .devcontainer folder do?*

Having issues? Check the [Troubleshooting section](#troubleshooting).

::: zone pivot="azure-portal"  

## 2. Create App Service and PostgreSQL

In this step, you create the Azure resources. The steps used in this tutorial create a set of secure-by-default resources that include App Service and Azure Database for PostgreSQL. For the creation process, you specify:

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
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-create-app-postgres-1.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find the Web App creation wizard." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-create-app-postgres-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2: Configure the new app**
        Fill out the form as follows.
        1. *Name*: **msdocs-quarkus-postgres**. A resource group named **msdocs-quarkus-postgres_group** is generated for you.
        1. *Runtime stack*: **Java 21**.
        1. *Java web server stack*: **Java SE (Embedded Web Server)**.
        1. *Operating system*: **Linux**.
        1. *Region*: Any Azure region near you.
        1. *Linux Plan*: **Create new** and use the name **msdocs-quarkus-postgres**.
        1. *Pricing plan*: **Basic B1**. When you're ready, you can [scale up](manage-scale-up.md) to a different pricing tier.
        <!-- 1. *Database*: **PostgreSQL - Flexible Server**. The server name and database name are set by default to appropriate values.
        1. *Add Azure Cache for Redis?*: **No**.
        1. *Hosting plan*: **Basic**. When you're ready, you can [scale up](manage-scale-up.md) to a production pricing tier later.
 -->
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-create-app-postgres-2.png" alt-text="A screenshot showing the Web App wizard with the Basics tab." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-create-app-postgres-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3: Add database**
        1. Select the **Database** tab.
        1. Select **Create a Database**.
        1. In **Engine**, select **PostgreSQL - Flexible Server**. The server name and database name are set by default to appropriate values.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-create-app-postgres-3.png" alt-text="A screenshot showing the Web App wizard with the Database tab." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-create-app-postgres-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4: Configure GitHub deployment**
        1. Select the **Deployment** tab.
        1. Select **Continuous deployment**.
        1. If this is your first time configuring GitHub deployment in App Service, select **Authorize** and authenticate with your GitHub account.
        1. In **Organization**, select your GitHub alias.
        1. In **Repository**, select **msdocs-quarkus-postgresql-sample-app**.
        1. In **Branch**, select **starter-no-infra**.
        1. Select **Review + create**.
        1. After validation completes, select **Create**.
        By default, the create wizard [creates a user-assigned identity](#i-dont-have-permissions-to-create-a-user-assigned-identity) for the workflow to authenticate using Microsoft Entra (OIDC authentication). For alternative authentication options, see [Deploy to App Service using GitHub Actions](deploy-github-actions.md).
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-create-app-postgres-4.png" alt-text="A screenshot showing the Web App wizard with the Deployment tab." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-create-app-postgres-4.png":::
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
        - **Private DNS zones**: Enables DNS resolution of the key vault and the database server in the virtual network.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-create-app-postgres-5.png" alt-text="A screenshot showing the deployment process completed." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-create-app-postgres-5.png":::
    :::column-end:::
:::row-end:::

## 3. Secure connection secrets

The creation wizard generated the connectivity variables for you already as [app settings](configure-common.md#configure-app-settings). However, the security best practice is to keep secrets out of App Service completely. You'll move your secrets to a key vault and change your app setting to [Key Vault references](app-service-key-vault-references.md) with the help of Service Connectors.

:::row:::
    :::column span="2":::
        **Step 1: Retrieve the existing connection string** 
        1. In the left menu of the App Service page, select **Settings > Environment variables**. 
        1. Select **Connection strings**.
        1. Select **AZURE_POSTGRESQL_CONNECTIONSTRING**. 
        1. In **Add/Edit application setting**, in the **Value** field, find the *User Id=* and *Password=* parts at the end of the string.
        1. Copy the username and password strings after *User Id=* and *Password=* for use later.
        This app setting lets you connect to the Postgres database secured behind a private endpoint. However, the secret is saved directly in the App Service app, which isn't the best. You'll change this.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-secure-connection-secrets-1.png" alt-text="A screenshot showing how to see the value of an app setting in App Service." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-secure-connection-secrets-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2: Create a subnet for securing Key Vault**
        The virtual network already has two existing subnets, but one is already delegated to App Service and the other is already delegated to Azure Database for PostgreSQL. You create another one for secure access to Key Vault with a private endpoint (for more information, see [Network security for Azure Key Vault](/azure/key-vault/general/network-security)).
        1. In the left menu of the App Service page, select the **Overview** tab.
        1. Select the resource group of the app.
        1. Select the virtual network in the resource group.
        1. In the left menu of the virtual network, select **Settings > Subnets**.
        1. Select **+ Subnet**.
        1. In **Name**, type **subnet-keyvault**. Accept the defaults.
        1. Select **Add**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-secure-connection-secrets-2.png" alt-text="A screenshot showing how to create a subnet in the virtual network." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-secure-connection-secrets-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3: Create a key vault for secure management of secrets**
        1. In the top search bar, type "*key vault*", then select **Marketplace** > **Key Vault**.
        1. In **Resource Group**, select **msdocs-quarkus-postgres_group**.
        1. In **Key vault name**, type a name that consists of only letters and numbers.
        1. In **Region**, set it to the same location as the resource group.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-secure-connection-secrets-3.png" alt-text="A screenshot showing how to create a key vault." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-secure-connection-secrets-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4: Secure the key vault with a Private Endpoint**
        1. Select the **Networking** tab.
        1. Unselect **Enable public access**.
        1. Select **Create a private endpoint**.
        1. In **Resource Group**, select **msdocs-quarkus-postgres_group**.
        1. In the dialog, in **Location**, select the same location as your App Service app.
        1. In **Name**, type **msdocs-quarkus-postgresVaultEndpoint**.
        1. In **Virtual network**, select **vnet-xxxxxxx**.
        1. In **Subnet**, **subnet-keyvault**.
        1. Select **OK**.
        1. Select **Review + create**, then select **Create**. Wait for the key vault deployment to finish. You should see "Your deployment is complete."
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-secure-connection-secrets-4.png" alt-text="A screenshot showing how to secure a key vault with a private endpoint." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-secure-connection-secrets-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5: Create a PostgreSQL connector**
        1. In the top search bar, type *msdocs-quarkus-postgres*, then select the App Service resource called **msdocs-quarkus-postgres**.
        1. In the App Service page, in the left menu, select **Settings > Service Connector > Create**.
        1. In **Service type**, select **DB for PostgreSQL flexible server**.
        1. In **PostgreSQL flexible server**, **msdocs-quarkus-postgres-server** should be selected already.
        1. In **PostgreSQL database**, select **msdocs-quarkus-postgres-database**.
        1. In **Client type**, select **Java**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-secure-connection-secrets-5.png" alt-text="A screenshot showing how to create a PostgreSQL connector in App Service." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-secure-connection-secrets-5.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6: Save secrets in key vault**
        1. Select the **Authentication** tab.
        1. Select **Connection string**.
        1. In **Username** and **Password**, paste the password you copied earlier.
        1. Select **Store Secret in Key Vault**.
        1. Under **Key Vault Connection**, select **Create new**.
        A **Create connection** dialog is opened on top of the edit dialog.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-secure-connection-secrets-6.png" alt-text="A screenshot showing how to edit a service connector with a key vault connection." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-secure-connection-secrets-6.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 7: Establish the Key Vault connection**        
        1. In the **Create connection** dialog for the Key Vault connection, in **Key Vault**, select the key vault you created earlier.
        1. In **Client type**, select **Java** for consistency. Your application code doesn't actually use the key vault directly.
        1. Select **Review + Create**.
        1. When validation completes, select **Create**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-secure-connection-secrets-7.png" alt-text="A screenshot showing how to configure a key vault service connector." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-secure-connection-secrets-7.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 8: Finalize the PostgreSQL connector settings**
        1. You're back in the edit dialog for the PostgreSQL connector. In the **Authentication** tab, wait for the key vault connector to be created. When it's finished, the **Key Vault Connection** dropdown automatically selects it.
        1. Select **Review + Create**.
        1. When validation completes, select **Create**. Wait until the **Creation succeeded** notification appears.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-secure-connection-secrets-8.png" alt-text="A screenshot showing the key vault connection selected in the PostgreSQL connector." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-secure-connection-secrets-8.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 9: Verify the Key Vault integration**
        1. From the left menu, select **Settings > Environment variables** again.
        1. Next to **AZURE_POSTGRESQL_CONNECTIONSTRING**, select **Show value**. The value should be `@Microsoft.KeyVault(...)`, which means that it's a [key vault reference](app-service-key-vault-references.md) because the secret is now managed in the key vault.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-secure-connection-secrets-9.png" alt-text="A screenshot showing how to see value of an app setting that includes a Key Vault reference." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-secure-connection-secrets-9.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 10: Delete database credentials from App Service**
        1. Select the **Connection strings** tab.
        1. To the right of **AZURE_POSTGRESQL_CONNECTIONSTRING**, select **Delete**. Remember that the create wizard created this connection string for you at the beginning.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-secure-connection-secrets-10.png" alt-text="A screenshot showing how to delete a connection string in App Service." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-secure-connection-secrets-10.png":::
    :::column-end:::
:::row-end:::

To summarize, the process for securing your connection secrets involved:

- Retrieving the connection secrets from the App Service app's environment variables.
- Creating a key vault with a private endpoint.
- Creating a Key Vault connection with the system-assigned managed identity.
- Create a service connector to store the connection secrets in the key vault.
- Delete the old connection secrets from the App Service app.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 4. Deploy sample code

In the create wizard, you already configured continuous deployment from your sample GitHub repository using GitHub Actions. It's just one of many ways to deploy to App Service, but also a great way to have continuous integration in your deployment process. By default, every `git push` to your GitHub repository kicks off the build and deploy action.

Note the following: 

- Quarkus listens to port 8080 by default. In production, it needs to be configured to listen to the port specified by the `PORT` environment variable in App Service.
- Your deployed Java package must be an [Uber-Jar](https://quarkus.io/guides/maven-tooling#uber-jar-maven).
- For simplicity of the tutorial, you'll disable tests during the deployment process. The GitHub Actions runners don't have access to the PostgreSQL database in Azure, so any integration tests that require database access will fail, such as is the case with the Quarkus sample application. 

:::row:::
    :::column span="2":::
        **Step 1:** Back in the GitHub codespace of your sample fork, run `git pull origin starter-no-infra`. 
        This pulls the newly committed GitHub workflow file into your codespace.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-1.png" alt-text="A screenshot showing git pull inside a GitHub codespace." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2 (Option 1: with GitHub Copilot):**  
        1. Start a new chat session by selecting the **Chat** view, then selecting **+**.
        1. Ask, "*@workspace How does the app connect to the database?*" Copilot might give you some explanation about how the Quarkus data source settings are configured in *src/main/resources/application.properties*. 
        1. Say, "*@workspace I created a PostgreSQL service connector in Azure App Service using the Java client type and the app setting name is AZURE_POSTGRESQL_CONNECTIONSTRING. I want to use this connection string when the app is running in production.*" Copilot might give you a code suggestion similar to the one in the **Option 2: without GitHub Copilot** steps below and even tell you to make the change in the *src/main/resources/application.properties* file.
        1. Open *src/main/resources/application.properties* in the explorer and add the code suggestion.
        1. Say, "@workspace How do i configure this project to create an Uber Jar?" Copilot might give you a code suggestion similar to the one in the **Option 2: without GitHub Copilot** steps below and even tell you to make the change in the *src/main/resources/application.properties* file.
        1. Open *src/main/resources/application.properties* in the explorer and add the code suggestion.
        1. Say, "@workspace How do I use the App Service port?" Copilot might give you a code suggestion similar to the one in the **Option 2: without GitHub Copilot** steps below and even tell you to make the change in the *src/main/resources/application.properties* file. 
        1. Open *src/main/resources/application.properties* in the explorer and add the code suggestion.
        GitHub Copilot doesn't give you the same response every time, and it's not always correct. You might need to ask more questions to fine-tune its response. For tips, see [What can I do with GitHub Copilot in my codespace?](#what-can-i-do-with-github-copilot-in-my-codespace).
    :::column-end:::
    :::column:::
        :::image type="content" source="media/tutorial-java-quarkus-postgresql-app/github-copilot-1.png" alt-text="A screenshot showing how to ask a question in a new GitHub Copilot chat session." lightbox="media/tutorial-java-quarkus-postgresql-app/github-copilot-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2 (Option 2: without GitHub Copilot):**  
        1. Open *src/main/resources/application.properties* in the explorer. Quarkus uses this file to load Java properties.
        1. Uncomment lines 10-12. These settings use the app setting you created with the PostgreSQL connector, creates an Uber Jar, and sets the port to the one used by App Service.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-2.png" alt-text="A screenshot showing a GitHub codespace and the application.properties file opened." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3 (Option 1: with GitHub Copilot):**  
        1. Ask, "*@workspace For the GitHub Actions deployment, I want to skip tests to avoid database related errors.*" Copilot might give you a code suggestion similar to the one in the **Option 2: without GitHub Copilot** steps below and even tell you to make the change in the *.github/workflows/starter-no-infra_msdocs-quarkus-postgres.yml* file. 
        1. Open *.github/workflows/starter-no-infra_msdocs-quarkus-postgres.yml* in the explorer and add the code suggestion.
        For tips, see [What can I do with GitHub Copilot in my codespace?](#what-can-i-do-with-github-copilot-in-my-codespace).
    :::column-end:::
    :::column:::
        :::image type="content" source="media/tutorial-java-quarkus-postgresql-app/github-copilot-2.png" alt-text="A screenshot showing how to ask a question about GitHub Actions deployment in a new GitHub Copilot chat session." lightbox="media/tutorial-java-quarkus-postgresql-app/github-copilot-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3 (Option 2: without GitHub Copilot):**  
        1. Open *.github/workflows/starter-no-infra_msdocs-quarkus-postgres.yml* in the explorer. This is the GitHub Actions workflow that the create wizard created for you.
        1. Find the `Build with Maven` step, and modify the `run` command to `mvn clean install -DskipTests`. `-DskipTests` tells Maven to skip tests so that the deployment doesn't fail on database errors. The GitHub Actions container can't connect to a PostgreSQL server.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-3.png" alt-text="A screenshot showing a GitHub codespace and a GitHub workflow file opened." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4:**
        1. Select the **Source Control** extension.
        1. In the textbox, type a commit message like `Configure DB and deployment`. Or, select :::image type="icon" source="media/quickstart-dotnetcore/github-copilot-in-editor.png" border="false"::: and let GitHub Copilot generate a commit message for you.
        1. Select **Commit**, then confirm with **Yes**.
        1. Select **Sync changes 1**, then confirm with **OK**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-4.png" alt-text="A screenshot showing the changes being committed and pushed to GitHub." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5:**
        1. From the left menu, select **Deployment** > **Deployment Center** > **Logs**.
        1. In the log item for the deployment run, select the **Build/Deploy Logs** entry with the latest timestamp.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-5.png" alt-text="A screenshot showing how to open deployment logs in the deployment center." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-5.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6:** You're taken to your GitHub repository and see that the GitHub action is running. The workflow file defines two separate stages, build and deploy. Wait for the GitHub run to show a status of **Success**. It takes about 5 minutes.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-6.png" alt-text="A screenshot showing a GitHub run in progress." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-deploy-sample-code-6.png":::
    :::column-end:::
:::row-end:::

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 5. Browse to the app

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, select **Overview**.
        1. Select the URL of your app.
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

:::code language="java" source="~/msdocs-quarkus-postgresql-sample-app/src/main/java/org/acme/hibernate/orm/panache/entity/FruitEntityResource.java" range="34-40" highlight="38":::

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, select **Monitoring** > **App Service logs**.
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

Learn more about logging in Java apps in the series on [Enable Azure Monitor OpenTelemetry for .NET, Node.js, Python and Java applications](/azure/azure-monitor/app/opentelemetry-enable?tabs=java).

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
        1. Enter the resource group name to confirm your deletion.
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

1. From the repository root of the GitHub codespace, run `azd init`.

    ```bash
    azd init --template javase-app-service-postgresql-infra
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

1. Create the necessary Azure resources with the `azd provision` command. Follow the prompt to select the desired subscription and location for the Azure resources.

    ```bash
    azd provision
    ```  

    The `azd provision` command takes about 15 minutes to complete (the Redis cache takes the most time). Later, you'll modify your code to work with App Service and deploy the changes with `azd deploy`. While it's running, the command provides messages about the provisioning and deployment process, including a link to the deployment in Azure.

    This AZD template contains files (*azure.yaml* and the *infra* directory) that generate a secure-by-default architecture with the following Azure resources:

    - **Resource group**: The container for all the created resources.
    - **App Service plan**: Defines the compute resources for App Service. A Linux plan in the *Basic* tier is created.
    - **App Service**: Represents your app and runs in the App Service plan.
    - **Virtual network**: Integrated with the App Service app and isolates back-end network traffic.
    - **Private endpoints**: Access endpoints for the key vault and the Redis cache in the virtual network.
    - **Network interfaces**: Represents private IP addresses, one for each of the private endpoints.
    - **Azure Database for PostgreSQL flexible server**: Accessible only from within the virtual network. A database and a user are created for you on the server.
    - **Private DNS zone**: Enables DNS resolution of the PostgreSQL server in the virtual network.
    - **Log Analytics workspace**: Acts as the target container for your app to ship its logs, where you can also query the logs.
    - **Azure Cache for Redis**: Accessible only from behind its private endpoint.
    - **Key vault**: Accessible only from behind its private endpoint. Used to manage secrets for the App Service app.

1. Once provisioning finishes, find the setting `AZURE_POSTGRESQL_CONNECTIONSTRING` in the AZD output. To keep secrets safe, only the setting names are displayed. They look like this in the AZD output:

    <pre>
    App Service app has the following connection settings:
            - AZURE_POSTGRESQL_CONNECTIONSTRING
            - AZURE_REDIS_CONNECTIONSTRING
            - AZURE_KEYVAULT_RESOURCEENDPOINT
            - AZURE_KEYVAULT_SCOPE
    </pre>

    The AZD template you use generated the connectivity variables for you already as [app settings](configure-common.md#configure-app-settings) and outputs the them to the terminal for your convenience. App settings are one way to keep connection secrets out of your code repository. You can also find the direct link to the app settings page for the created App Service app.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 3. Modify sample code and redeploy

You must make some changes in your application code to make it work with App Service:

- Quarkus listens to port 8080 by default. In production, it needs to be configured to listen to the port specified by the `PORT` environment variable in App Service.
- Your deployed Java package must be an [Uber-Jar](https://quarkus.io/guides/maven-tooling#uber-jar-maven).
- For simplicity of the tutorial, you'll disable tests during the deployment process. The GitHub Actions runners don't have access to the PostgreSQL database in Azure, so any integration tests that require database access will fail, such as is the case with the Quarkus sample application. 

# [With GitHub Copilot](#tab/copilot)

1. In the GitHub codespace, start a new chat session by selecting the **Chat** view, then selecting **+**.
1. Ask, "*@workspace How does the app connect to the database?*" Copilot might give you some explanation about how the quarkus data source settings are configured in *src/main/resources/application.properties*. 
1. Say, "*@workspace I have created a PostgreSQL service connector in Azure App Service using the Java client type and the app setting name is AZURE_POSTGRESQL_CONNECTIONSTRING. I want to use this connection string when the app is running in production.*" Copilot might give you a code suggestion similar to the one in the **Option 2: without GitHub Copilot** steps below and even tell you to make the change in the *src/main/resources/application.properties* file.
1. Add the code suggestion in *src/main/resources/application.properties*.
1. Say, "@workspace How do i configure this project to create an Uber Jar?" Copilot might give you a code suggestion similar to the one in the **Option 2: without GitHub Copilot** steps below and even tell you to make the change in the *src/main/resources/application.properties* file.
1. Add the code suggestion in *src/main/resources/application.properties*.
1. Say, "@workspace How do I use the App Service port?" Copilot might give you a code suggestion similar to the one in the **Option 2: without GitHub Copilot** steps below and even tell you to make the change in the *src/main/resources/application.properties* file. 
1. Add the code suggestion in *src/main/resources/application.properties*.

    GitHub Copilot doesn't give you the same response every time, and it's not always correct. You might need to ask more questions to fine-tune its response. For tips, see [What can I do with GitHub Copilot in my codespace?](#what-can-i-do-with-github-copilot-in-my-codespace).

1. In the terminal, run `azd deploy`.
 
    ```bash
    azd deploy
    ```

# [Without GitHub Copilot](#tab/nocopilot)

1. Open *src/main/resources/application.properties* in the explorer. Quarkus uses this file to load Java properties.
1. Uncomment lines 10-12. These settings use the app setting you created with the PostgreSQL connector, creates an Uber Jar, and sets the port to the one used by App Service.
1. In the terminal, run `azd deploy`.
 
    ```bash
    azd deploy
    ```

> [!NOTE]
> If you run `azd up`, it combines `azd package`, `azd provision`, and `azd deploy`. The reason you didn't do it at the beginning was because you didn't have the PostgreSQL connection settings to modify your code with yet. If you ran `azd up` then, the deploy stage would stall because the Quarkus app wouldn't be able to start without the changes you made here.

-----

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 5. Browse to the app

1. In the AZD output, find the URL of your app and navigate to it in the browser. The URL looks like this in the AZD output:

    <pre>
    Deploying services (azd deploy)
    
      (✓) Done: Deploying service web
      - Endpoint: https://&lt;app-name>.azurewebsites.net/
    </pre>

2. Add a few fruits to the list.

    :::image type="content" source="./media/tutorial-java-quarkus-postgresql-app/azure-portal-browse-app-2.png" alt-text="A screenshot of the Quarkus web app with PostgreSQL running in Azure showing a list of fruits." lightbox="./media/tutorial-java-quarkus-postgresql-app/azure-portal-browse-app-2.png":::

    Congratulations, you're running a web app in Azure App Service, with secure connectivity to Azure Database for PostgreSQL.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 6. Stream diagnostic logs

Azure App Service can capture console logs to help you diagnose issues with your application. For convenience, the AZD template already [enables logging to the local file system](troubleshoot-diagnostic-logs.md#enable-application-logging-linuxcontainer) and is [shipping the logs to a Log Analytics workspace](troubleshoot-diagnostic-logs.md#send-logs-to-azure-monitor).

The sample application includes standard JBoss logging statements to demonstrate this capability as shown below.

:::code language="java" source="~/msdocs-quarkus-postgresql-sample-app/src/main/java/org/acme/hibernate/orm/panache/entity/FruitEntityResource.java" range="34-40" highlight="1,5":::

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

### The GitHub Actions run failed at the build stage

Select the failed build stage to see which step failed. If it's the **Build with Maven** stage, expand the step to verify that the `-DskipTests` option is used. If not, go back to [4. Deploy sample code](#4-deploy-sample-code) and modify the GitHub workflow file according to the instructions.

### The app failed to start and shows the following error in the log stream: "Model classes are defined for the default persistence unit \<default> but configured datasource \<default> not found: the default EntityManagerFactory will not be created."

This Quarkus error is most likely because the app can't connect to the Azure database. Make sure that the app setting `AZURE_POSTGRESQL_CONNECTIONSTRING` hasn't been changed, and that *application.properties* is using the app setting properly.

### The app failed to start and the log stream shows "Waiting for response to warmup request for container"

Your application is probably not configured to listen to the port specified by the App Service `PORT` environment variable, so it can't respond to any requests. If App Service doesn't get a response from your application, it assumes that the application failed to start. Go back to [4. Deploy sample code](#4-deploy-sample-code) and verify that *application.properties* is configured properly.

### The app works, but I see the error log "ERROR [org.acm.hib.orm.pan.ent.FruitEntityResource] (vert.x-eventloop-thread-0) Failed to handle request: jakarta.ws.rs.NotFoundException: HTTP 404 Not Found".

This is a Vert.x error (see [Quarkus Reactive Architecture](https://quarkus.io/guides/quarkus-reactive-architecture)), indicating that the client requested an unknown path. It can happen the first time the app starts, when the client requests the REST API before the Hibernate database migration happens.

In App Service, this error also happens on every app startup because App Service verifies that the app starts by sending a `GET` request to `/robots933456.txt`.

## Frequently asked questions

- [How much does this setup cost?](#how-much-does-this-setup-cost)
- [How do I connect to the PostgreSQL server that's secured behind the virtual network with other tools?](#how-do-i-connect-to-the-postgresql-server-thats-secured-behind-the-virtual-network-with-other-tools)
- [How does local app development work with GitHub Actions?](#how-does-local-app-development-work-with-github-actions)
- [What if I want to run tests with PostgreSQL during the GitHub workflow?](#what-if-i-want-to-run-tests-with-postgresql-during-the-github-workflow)
- [I don't have permissions to create a user-assigned identity](#i-dont-have-permissions-to-create-a-user-assigned-identity)
- [What can I do with GitHub Copilot in my codespace?](#what-can-i-do-with-github-copilot-in-my-codespace)

### How much does this setup cost?

Pricing for the created resources is as follows:

- The App Service plan is created in **Basic** tier and can be scaled up or down. See [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/).
- The PostgreSQL flexible server is created in the lowest burstable tier **Standard_B1ms**, with the minimum storage size, which can be scaled up or down. See [Azure Database for PostgreSQL pricing](https://azure.microsoft.com/pricing/details/postgresql/flexible-server/).
- The virtual network doesn't incur a charge unless you configure extra functionality, such as peering. See [Azure Virtual Network pricing](https://azure.microsoft.com/pricing/details/virtual-network/).
- The private DNS zone incurs a small charge. See [Azure DNS pricing](https://azure.microsoft.com/pricing/details/dns/). 

### How do I connect to the PostgreSQL server that's secured behind the virtual network with other tools?

- For basic access from a command-line tool, you can run `psql` from the app's SSH terminal.
- To connect from a desktop tool, your machine must be within the virtual network. For example, it could be an Azure VM that's connected to one of the subnets, or a machine in an on-premises network that has a [site-to-site VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md) connection with the Azure virtual network.
- You can also [integrate Azure Cloud Shell](../cloud-shell/private-vnet.md) with the virtual network.

### How does local app development work with GitHub Actions?

Using the autogenerated workflow file from App Service as an example, each `git push` kicks off a new build and deployment run. From a local clone of the GitHub repository, you make the desired updates and push to GitHub. For example:

```terminal
git add .
git commit -m "<some-message>"
git push origin main
```

### What if I want to run tests with PostgreSQL during the GitHub workflow?

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
            run: mvn clean install -Dquarkus.package.type=uber-jar
    ```

### I don't have permissions to create a user-assigned identity

See [Set up GitHub Actions deployment from the Deployment Center](deploy-github-actions.md#set-up-github-actions-deployment-from-the-deployment-center).

### What can I do with GitHub Copilot in my codespace?

You might have noticed that the GitHub Copilot chat view was already there for you when you created the codespace. However, you need a [GitHub Copilot account](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor) (30-day free trial available). 

A few tips for you when you talk to GitHub Copilot:

- In a single chat session, the questions and answers build on each other and you can adjust your questions to fine-tune the answer you get.
- By default, GitHub Copilot doesn't have access to any file in your repository. To ask questions about a file, open the file in the editor first.
- To let GitHub Copilot have access to all of the files in the repository when preparing its answers, begin your question with `@workspace`. For more information, see [Use the @workspace agent](https://github.blog/2024-03-25-how-to-use-github-copilot-in-your-ide-tips-tricks-and-best-practices/#10-use-the-workspace-agent).
- In the chat session, GitHub Copilot can suggest changes and (with `@workspace`) even where to make the changes, but it's not allowed to make the changes for you. It's up to you to add the suggested changes and test it.

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
