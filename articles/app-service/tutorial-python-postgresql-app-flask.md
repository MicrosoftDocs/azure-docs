---
title: 'Tutorial: Deploy a Python Flask web app with PostgreSQL'
description: Create a Python Flask web app with a PostgreSQL database and deploy it to Azure. The tutorial uses either the Flask framework and the app is hosted on Azure App Service on Linux.
ms.devlang: python
ms.topic: tutorial
ms.date: 01/22/2025
ms.author: msangapu
author: msangapu-msft
ms.custom: mvc, cli-validate, devx-track-python, devdivchpfy22, vscode-azure-extension-update-completed, AppServiceConnectivity, devx-track-extended-azdevcli, linux-related-content
zone_pivot_groups: app-service-portal-azd
ms.collection: ce-skilling-ai-copilot
---

# Deploy a Python (Flask) web app with PostgreSQL in Azure

In this tutorial, you'll deploy a data-driven Python web app (**[Flask](https://flask.palletsprojects.com/)**) to **[Azure App Service](./overview.md#app-service-on-linux)** with the **[Azure Database for PostgreSQL](/azure/postgresql/)** relational database service. Azure App Service supports [Python](https://www.python.org/downloads/) in a Linux server environment. If you want, see the [Django tutorial](tutorial-python-postgresql-app-django.md) or the [FastAPI tutorial](tutorial-python-postgresql-app-fastapi.md) instead.

:::image type="content" border="False" source="./media/tutorial-python-postgresql-app-flask/python-postgresql-app-architecture-240px.png" lightbox="./media/tutorial-python-postgresql-app-flask/python-postgresql-app-architecture.png" alt-text="An architecture diagram showing an App Service with a PostgreSQL database in Azure.":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a secure-by-default App Service, PostgreSQL, and Redis cache architecture.
> * Secure connection secrets using a managed identity and Key Vault references.
> * Deploy a sample Python app to App Service from a GitHub repository.
> * Access App Service connection strings and app settings in the application code.
> * Make updates and redeploy the application code.
> * Generate database schema by running database migrations.
> * Stream diagnostic logs from Azure.
> * Manage the app in the Azure portal.
> * Provision the same architecture and deploy by using Azure Developer CLI.
> * Optimize your development workflow with GitHub Codespaces and GitHub Copilot.

## Prerequisites

::: zone pivot="azure-portal"

* An Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free/python).
* A GitHub account. you can also [get one for free](https://github.com/join).
* Knowledge of Python with Flask development.
* **(Optional)** To try GitHub Copilot, a [GitHub Copilot account](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor). A 30-day free trial is available.

::: zone-end

::: zone pivot="azure-developer-cli"

* An Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free/python).
* [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) installed. You can follow the steps with the [Azure Cloud Shell](https://shell.azure.com) because it already has Azure Developer CLI installed.
* Knowledge of Python with Flask development.
* **(Optional)** To try GitHub Copilot, a [GitHub Copilot account](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor). A 30-day free trial is available.

::: zone-end

## Skip to the end

If you just want to see the sample app in this tutorial running in Azure, just run the following commands in the [Azure Cloud Shell](https://shell.azure.com), and follow the prompt:

```bash
mkdir msdocs-flask-postgresql-sample-app
cd msdocs-flask-postgresql-sample-app
azd init --template msdocs-flask-postgresql-sample-app
azd up
```

## 1. Run the sample

First, you set up a sample data-driven app as a starting point. For your convenience, the [sample repository](https://github.com/Azure-Samples/msdocs-flask-postgresql-sample-app), includes a [dev container](https://docs.github.com/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers) configuration. The dev container has everything you need to develop an application, including the database, cache, and all environment variables needed by the sample application. The dev container can run in a [GitHub codespace](https://docs.github.com/en/codespaces/overview), which means you can run the sample on any computer with a web browser.

> [!NOTE]
> If you are following along with this tutorial with your own app, look at the *requirements.txt* file description in [README.md](https://github.com/Azure-Samples/msdocs-flask-postgresql-sample-app/blob/main/README.md) to see what packages you'll need.

:::row:::
    :::column span="2":::
        **Step 1:** In a new browser window:
        1. Sign in to your GitHub account.
        1. Navigate to [https://github.com/Azure-Samples/msdocs-flask-postgresql-sample-app/fork](https://github.com/Azure-Samples/msdocs-flask-postgresql-sample-app/fork).
        1. Unselect **Copy the main branch only**. You want all the branches.
        1. Select **Create fork**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-run-sample-application-1.png" alt-text="A screenshot showing how to create a fork of the sample GitHub repository." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-run-sample-application-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the GitHub fork:
        1. Select **main** > **starter-no-infra** for the starter branch. This branch contains just the sample project and no Azure-related files or configuration.
        1. Select **Code** > **Create codespace on starter-no-infra**.
        The codespace takes a few minutes to set up, and it runs `pip install -r requirements.txt` for your repository at the end.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-run-sample-application-2.png" alt-text="A screenshot showing how to create a codespace in GitHub." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-run-sample-application-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** In the codespace terminal:
        1. Run database migrations with `flask db upgrade`.
        1. Run the app with `flask run`.
        1. When you see the notification `Your application running on port 5000 is available.`, select **Open in Browser**.
        You should see the sample application in a new browser tab.
        To stop the application, type `Ctrl`+`C`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-run-sample-application-3.png" alt-text="A screenshot showing how to run the sample application inside the GitHub codespace." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-run-sample-application-3.png":::
    :::column-end:::
:::row-end:::

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
* The **Runtime stack** for the app. It's where you select the version of Python to use for your app.
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
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-create-app-postgres-1.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find the Web App + Database creation wizard." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-create-app-postgres-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the **Create Web App + Database** page, fill out the form as follows.
        1. *Resource Group*: Select **Create new** and use a name of **msdocs-flask-postgres-tutorial**.
        1. *Region*: Any Azure region near you.
        1. *Name*: **msdocs-python-postgres-XYZ**.
        1. *Runtime stack*: **Python 3.12**.
        1. *Database*: **PostgreSQL - Flexible Server** is selected by default as the database engine. The server name and database name are also set by default to appropriate values.
        1. *Add Azure Cache for Redis?*: **No**.
        1. *Hosting plan*: **Basic**. When you're ready, you can [scale up](manage-scale-up.md) to a production pricing tier.
        1. Select **Review + create**.
        1. After validation completes, select **Create**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-create-app-postgres-2.png" alt-text="A screenshot showing how to configure a new app and database in the Web App + Database wizard." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-create-app-postgres-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** The deployment takes a few minutes to complete. Once deployment completes, select the **Go to resource** button. You're taken directly to the App Service app, but the following resources are created:
        - **Resource group**: The container for all the created resources.
        - **App Service plan**: Defines the compute resources for App Service. A Linux plan in the *Basic* tier is created.
        - **App Service**: Represents your app and runs in the App Service plan.
        - **Virtual network**: Integrated with the App Service app and isolates back-end network traffic.
        - **Network interfaces**: Represents private IP addresses, one for each of the private endpoints.
        - **Azure Database for PostgreSQL flexible server**: Accessible only from within the virtual network. A database and a user are created for you on the server.
        - **Private DNS zones**: Enables DNS resolution of the key vault and the database server in the virtual network.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-create-app-postgres-3.png" alt-text="A screenshot showing the deployment process completed." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-create-app-postgres-3.png":::
    :::column-end:::
:::row-end:::

## 3. Secure connection secrets

The creation wizard generated the connectivity variables for you already as [app settings](configure-common.md#configure-app-settings). However, the security best practice is to keep secrets out of App Service completely. You'll move your secrets to a key vault and change your app setting to [Key Vault references](app-service-key-vault-references.md) with the help of Service Connectors.

:::row:::
    :::column span="2":::
        **Step 1: Retrieve the existing connection string** 
        1. In the left menu of the App Service page, select **Settings > Environment variables**. 
        1. Select **AZURE_POSTGRESQL_CONNECTIONSTRING**. 
        1. In **Add/Edit application setting**, in the **Value** field, find the *password=* part at the end of the string.
        1. Copy the password string after *Password=* for use later.
        This app setting lets you connect to the Postgres database secured behind a private endpoint. However, the secret is saved directly in the App Service app, which isn't the best. You'll change this.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-secure-connection-secrets-1.png" alt-text="A screenshot showing how to see the value of an app setting." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-secure-connection-secrets-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:  Create a key vault for secure management of secrets**
        1. In the top search bar, type "*key vault*", then select **Marketplace** > **Key Vault**.
        1. In **Resource Group**, select **msdocs-python-postgres-tutorial**.
        1. In **Key vault name**, type a name that consists of only letters and numbers.
        1. In **Region**, set it to the same location as the resource group.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-secure-connection-secrets-2.png" alt-text="A screenshot showing how to create a key vault." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-secure-connection-secrets-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3: Secure the key vault with a Private Endpoint**
        1. Select the **Networking** tab.
        1. Unselect **Enable public access**.
        1. Select **Create a private endpoint**.
        1. In **Resource Group**, select **msdocs-python-postgres-tutorial**.
        1. In the dialog, in **Location**, select the same location as your App Service app.
        1. In **Name**, type **msdocs-python-postgres-XYZVaultEndpoint**.
        1. In **Virtual network**, select **msdocs-python-postgres-XYZVnet**.
        1. In **Subnet**, **msdocs-python-postgres-XYZSubnet**.
        1. Select **OK**.
        1. Select **Review + create**, then select **Create**. Wait for the key vault deployment to finish. You should see "Your deployment is complete."
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-secure-connection-secrets-3.png" alt-text="A screenshot showing how to secure a key vault with a private endpoint." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-secure-connection-secrets-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4: Configure the PostgreSQL connector**
        1. In the top search bar, type *msdocs-python-postgres*, then select the App Service resource called **msdocs-python-postgres-XYZ**.
        1. In the App Service page, in the left menu, select **Settings > Service Connector**. There's already a connector, which the app creation wizard created for you.
        1. Select checkbox next to the PostgreSQL connector, then select **Edit**.
        1. In **Client type**, select **Django**. Even though you have a Flask app, the [Django client type in the PostgreSQL service connector](/azure/service-connector/how-to-integrate-postgres?tabs=django#connection-string) gives you database variables in separate settings instead of one connection string. The separate variables are easier for you to use in your application code, which uses [SQLAlchemy](https://pypi.org/project/SQLAlchemy/) to connect to the database.
        1. Select the **Authentication** tab.
        1. In **Password**, paste the password you copied earlier.
        1. Select **Store Secret in Key Vault**.
        1. Under **Key Vault Connection**, select **Create new**. 
        A **Create connection** dialog is opened on top of the edit dialog.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-secure-connection-secrets-4.png" alt-text="A screenshot showing how to edit a service connector with a key vault connection." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-secure-connection-secrets-4.png":::
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
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-secure-connection-secrets-5.png" alt-text="A screenshot showing how to configure a key vault service connector." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-secure-connection-secrets-5.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6: Finalize the PostgreSQL connector settings** 
        1. You're back in the edit dialog for **defaultConnector**. In the **Authentication** tab, wait for the key vault connector to be created. When it's finished, the **Key Vault Connection** dropdown automatically selects it.
        1. Select **Next: Networking**.
        1. Select **Save**. Wait until the **Update succeeded** notification appears.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-secure-connection-secrets-6.png" alt-text="A screenshot showing the key vault connection selected in the defaultConnector." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-secure-connection-secrets-6.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 7: Verify the Key Vault integration**
        1. From the left menu, select **Settings > Environment variables** again.
        1. Next to **AZURE_POSTGRESQL_PASSWORD**, select **Show value**. The value should be `@Microsoft.KeyVault(...)`, which means that it's a [key vault reference](app-service-key-vault-references.md) because the secret is now managed in the key vault.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-secure-connection-secrets-7.png" alt-text="A screenshot showing how to see the value of PostgreSQL password in Azure." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-secure-connection-secrets-7.png":::
    :::column-end:::
:::row-end:::

To summarize, the process for securing your connection secrets involved:

- Retrieving the connection secrets from the App Service app's environment variables.
- Creating a key vault.
- Creating a Key Vault connection with the system-assigned managed identity.
- Updating the service connectors to store the secrets in the key vault.

Having issues? Check the [Troubleshooting section](#troubleshooting).

-----

## 4. Deploy sample code

In this step, you configure GitHub deployment using GitHub Actions. It's just one of many ways to deploy to App Service, but also a great way to have continuous integration in your deployment process. By default, every `git push` to your GitHub repository kicks off the build and deploy action.

:::row:::
    :::column span="2":::
        **Step 1:** In the left menu, select **Deployment** > **Deployment Center**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-deploy-sample-code-flask-1.png" alt-text="A screenshot showing how to open the deployment center in App Service." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-deploy-sample-code-flask-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the Deployment Center page:
        1. In **Source**, select **GitHub**. By default, **GitHub Actions** is selected as the build provider.        
        1. Sign in to your GitHub account and follow the prompt to authorize Azure.
        1. In **Organization**, select your account.
        1. In **Repository**, select **msdocs-flask-postgresql-sample-app**.
        1. In **Branch**, select **starter-no-infra**. This is the same branch that you worked in with your sample app, without any Azure-related files or configuration.
        1. For **Authentication type**, select **User-assigned identity**.
        1. In the top menu, select **Save**. 
        App Service commits a workflow file into the chosen GitHub repository, in the `.github/workflows` directory.
        By default, the deployment center [creates a user-assigned identity](#i-dont-have-permissions-to-create-a-user-assigned-identity) for the workflow to authenticate using Microsoft Entra (OIDC authentication). For alternative authentication options, see [Deploy to App Service using GitHub Actions](deploy-github-actions.md).
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-deploy-sample-code-flask-2.png" alt-text="A screenshot showing how to configure CI/CD using GitHub Actions." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-deploy-sample-code-flask-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** Back in the GitHub codespace of your sample fork, run `git pull origin starter-no-infra`. 
        This pulls the newly committed workflow file into your codespace.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-deploy-sample-code-flask-3.png" alt-text="A screenshot showing git pull inside a GitHub codespace." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-deploy-sample-code-flask-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4 (Option 1: with GitHub Copilot):**  
        1. Start a new chat session by selecting the **Chat** view, then selecting **+**.
        1. Ask, "*@workspace How does the app connect to the database?*" Copilot might give you some explanation about `SQLAlchemy` how it's connection URI is configured in *azureproject/development.py* and *azureproject/production.py*. 
        1. Ask, "*@workspace In production mode, my app is running in an App Service web app, which uses Azure Service Connector to connect to a PostgreSQL flexible server using the Django client type. What are the environment variable names I need to use?*" Copilot might give you a code suggestion similar to the one in the **Option 2: without GitHub Copilot** steps below and even tell you to make the change in the *azureproject/production.py* file. 
        1. Open *azureproject/production.py* in the explorer and add the code suggestion.
        GitHub Copilot doesn't give you the same response every time, and it's not always correct. You might need to ask more questions to fine-tune its response. For tips, see [What can I do with GitHub Copilot in my codespace?](#what-can-i-do-with-github-copilot-in-my-codespace).
    :::column-end:::
    :::column:::
        :::image type="content" source="media/tutorial-python-postgresql-app-flask/github-copilot-1.png" alt-text="A screenshot showing how to ask a question in a new GitHub Copilot chat session." lightbox="media/tutorial-python-postgresql-app-flask/github-copilot-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4 (Option 2: without GitHub Copilot):**  
        1. Open *Program.cs* in the explorer.
        1. Find the commented code (lines 3-8) and uncomment it. 
        This creates a connection string for SQLAlchemy by using `AZURE_POSTGRESQL_USER`, `AZURE_POSTGRESQL_PASSWORD`, `AZURE_POSTGRESQL_HOST`, and `AZURE_POSTGRESQL_NAME`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-deploy-sample-code-flask-4.png" alt-text="A screenshot showing a GitHub codespace and azureproject/production.py opened." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-deploy-sample-code-flask-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5:**
        1. Select the **Source Control** extension.
        1. In the textbox, type a commit message like `Configure Azure database connecton`. Or, select :::image type="icon" source="media/quickstart-dotnetcore/github-copilot-in-editor.png" border="false"::: and let GitHub Copilot generate a commit message for you.
        1. Select **Commit**, then confirm with **Yes**.
        1. Select **Sync changes 1**, then confirm with **OK**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-deploy-sample-code-flask-6.png" alt-text="A screenshot showing the changes being committed and pushed to GitHub." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-deploy-sample-code-flask-5.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6:**
        Back in the Deployment Center page in the Azure portal:
        1. Select the **Logs** tab, then select **Refresh** to see the new deployment run.
        1. In the log item for the deployment run, select the **Build/Deploy Logs** entry with the latest timestamp.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-deploy-sample-code-flask-6.png" alt-text="A screenshot showing how to open deployment logs in the deployment center." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-deploy-sample-code-flask-6.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 7:** You're taken to your GitHub repository and see that the GitHub action is running. The workflow file defines two separate stages, build and deploy. Wait for the GitHub run to show a status of **Success**. It takes about 5 minutes.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-deploy-sample-code-flask-7.png" alt-text="A screenshot showing a GitHub run in progress." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-deploy-sample-code-flask-7.png":::
    :::column-end:::
:::row-end:::

Having issues? Check the [Troubleshooting guide](configure-language-python.md#troubleshooting).

## 5. Generate database schema

With the PostgreSQL database protected by the virtual network, the easiest way to run [Flask database migrations](https://flask-migrate.readthedocs.io/en/latest/) is in an SSH session with the Linux container in App Service. 

:::row:::
    :::column span="2":::
        **Step 1:** Back in the App Service page, in the left menu, 
        1. Select **Development Tools** > **SSH**.
        1. Select **Go**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-generate-db-schema-flask-1.png" alt-text="A screenshot showing how to open the SSH shell for your app from the Azure portal." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-generate-db-schema-flask-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the SSH session, run `flask db upgrade`. If it succeeds, App Service is [connecting successfully to the database](#i-get-an-error-when-running-database-migrations).
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-generate-db-schema-flask-2.png" alt-text="A screenshot showing the commands to run in the SSH shell and their output." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-generate-db-schema-flask-2.png":::
    :::column-end:::
:::row-end:::

> [!TIP]
> In the SSH session, only changes to files in `/home` can persist beyond app restarts. Changes outside of `/home` aren't persisted.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 6. Browse to the app

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, select **Overview**.
        1. Select the URL of your app.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-browse-app-1.png" alt-text="A screenshot showing how to launch an App Service from the Azure portal." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-browse-app-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** Add a few restaurants to the list.
        Congratulations, you're running a web app in Azure App Service, with secure connectivity to Azure Database for PostgreSQL.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-browse-app-2.png" alt-text="A screenshot of the Flask web app with PostgreSQL running in Azure showing restaurants and restaurant reviews." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-browse-app-2.png":::
    :::column-end:::
:::row-end:::

## 7. Stream diagnostic logs

Azure App Service captures all console logs to help you diagnose issues with your application. The sample app includes `print()` statements to demonstrate this capability as shown below.

:::code language="python" source="~/msdocs-flask-postgresql-sample-app/app.py" range="37-41" highlight="3":::

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, select **Monitoring** > **App Service logs**.
        1. Under **Application logging**, select **File System**.
        1. In the top menu, select **Save**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-stream-diagnostic-logs-1.png" alt-text="A screenshot showing how to enable native logs in App Service in the Azure portal." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-stream-diagnostic-logs-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** From the left menu, select **Log stream**. You see the logs for your app, including platform logs and logs from inside the container.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-stream-diagnostic-logs-2.png" alt-text="A screenshot showing how to view the log stream in the Azure portal." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-stream-diagnostic-logs-2.png":::
    :::column-end:::
:::row-end:::

Learn more about logging in Python apps in the series on [setting up Azure Monitor for your Python application](/azure/azure-monitor/app/opencensus-python).

## 8. Clean up resources

When you're finished, you can delete all of the resources from your Azure subscription by deleting the resource group.

:::row:::
    :::column span="2":::
        **Step 1:** In the search bar at the top of the Azure portal:
        1. Enter the resource group name.
        1. Select the resource group.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-clean-up-resources-1.png" alt-text="A screenshot showing how to search for and navigate to a resource group in the Azure portal." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-clean-up-resources-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the resource group page, select **Delete resource group**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-clean-up-resources-2.png" alt-text="A screenshot showing the location of the Delete Resource Group button in the Azure portal." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-clean-up-resources-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** 
        1. Enter the resource group name to confirm your deletion.
        1. Select **Delete**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-clean-up-resources-3.png" alt-text="A screenshot of the confirmation dialog for deleting a resource group in the Azure portal." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-clean-up-resources-3.png"::::
    :::column-end:::
:::row-end:::
::: zone-end

::: zone pivot="azure-developer-cli"

## 2. Create Azure resources and deploy a sample app

In this step, you create the Azure resources and deploy a sample app to App Service on Linux. The steps used in this tutorial create a set of secure-by-default resources that include App Service and Azure Database for PostgreSQL.

The dev container already has the [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) (AZD).

1. From the repository root, run `azd init`.

    ```bash
    azd init --template python-app-service-postgresql-infra
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

    Once the command finishes creating resources and deploying the application code the first time, the deployed sample app doesn't work yet because you must make small changes to make it connect to the database in Azure.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 3. Use the database connection string

The AZD template you use generated the connectivity variables for you already as [app settings](configure-common.md#configure-app-settings) and outputs the them to the terminal for your convenience. App settings are one way to keep connection secrets out of your code repository.

1. In the AZD output, find the settings `AZURE_POSTGRESQL_USER`, `AZURE_POSTGRESQL_PASSWORD`, `AZURE_POSTGRESQL_HOST`, and `AZURE_POSTGRESQL_NAME`. To keep secrets safe, only the setting names are displayed. They look like this in the AZD output:

    <pre>
    App Service app has the following connection settings:
            - AZURE_POSTGRESQL_NAME
            - AZURE_POSTGRESQL_HOST
            - AZURE_POSTGRESQL_USER
            - AZURE_POSTGRESQL_PASSWORD
            - AZURE_REDIS_CONNECTIONSTRING
            - AZURE_KEYVAULT_RESOURCEENDPOINT
            - AZURE_KEYVAULT_SCOPE
    </pre>

1. For your convenience, the AZD template shows you the direct link to the app's app settings page. Find the link and open it in a new browser tab.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 4. Modify sample code and redeploy

# [With GitHub Copilot](#tab/copilot)

1. In the GitHub codespace, start a new chat session by selecting the **Chat** view, then selecting **+**. 

1. Ask, "*@workspace How does the app connect to the database?*" Copilot might give you some explanation about `SQLAlchemy` how it's connection URI is configured in *azureproject/development.py* and *azureproject/production.py*. 

1. Ask, "*@workspace In production mode, my app is running in an App Service web app, which uses Azure Service Connector to connect to a PostgreSQL flexible server using the Django client type. What are the environment variable names I need to use?*" Copilot might give you a code suggestion similar to the one in the **Option 2: without GitHub Copilot** steps below and even tell you to make the change in the *azureproject/production.py* file. 

1. Open *azureproject/production.py* in the explorer and add the code suggestion.

    GitHub Copilot doesn't give you the same response every time, and it's not always correct. You might need to ask more questions to fine-tune its response. For tips, see [What can I do with GitHub Copilot in my codespace?](#what-can-i-do-with-github-copilot-in-my-codespace).

1. In the terminal, run `azd deploy`.
 
    ```bash
    azd deploy
    ```

# [Without GitHub Copilot](#tab/nocopilot)

1. You need to use the four app settings for connectivity in App service. Open *azureproject/production.py*, uncomment the following lines (lines 3-8), and save the file:

    ```python
    DATABASE_URI = 'postgresql+psycopg2://{dbuser}:{dbpass}@{dbhost}/{dbname}'.format(
        dbuser=os.getenv('AZURE_POSTGRESQL_USER'),
        dbpass=os.getenv('AZURE_POSTGRESQL_PASSWORD'),
        dbhost=os.getenv('AZURE_POSTGRESQL_HOST'),
        dbname=os.getenv('AZURE_POSTGRESQL_NAME')
    )
    ```
    
    Your application code is now configured to connect to the PostgreSQL database in Azure. If you want, open `app.py` and see how the `DATABASE_URI` environment variable is used.

1. In the terminal, run `azd deploy`.
 
    ```bash
    azd deploy
    ```

> [!NOTE]
> If you run `azd up`, it combines `azd package`, `azd provision`, and `azd deploy`. The reason you didn't do it at the beginning was because you didn't have the PostgreSQL connection settings to modify your code with yet. If you ran `azd up` then, the deploy stage would stall because the Gunicorn server wouldn't be able to start the app without valid connection settings.

-----

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 5. Generate database schema

With the PostgreSQL database protected by the virtual network, the easiest way to run [Flask database migrations](https://flask-migrate.readthedocs.io/en/latest/) is in an SSH session with the Linux container in App Service.


1. In the AZD output, find the URL for the SSH session and navigate to it in the browser. It looks like this in the output:

    <pre>
    Open SSH session to App Service container at: https://&lt;app-name>.scm.azurewebsites.net/webssh/host
    </pre>

1. In the SSH session, run `flask db upgrade`. If it succeeds, App Service is [connecting successfully to the database](#i-get-an-error-when-running-database-migrations).

    :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-generate-db-schema-flask-2.png" alt-text="A screenshot showing the commands to run in the SSH shell and their output." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-generate-db-schema-flask-2.png":::

    > [!NOTE]
    > Only changes to files in `/home` can persist beyond app restarts. Changes outside of `/home` aren't persisted.
    >

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 6. Browse to the app

1. In the AZD output, find the URL of your app and navigate to it in the browser. The URL looks like this in the AZD output:

    <pre>
    Deploying services (azd deploy)
    
      (✓) Done: Deploying service web
      - Endpoint: https://&lt;app-name>.azurewebsites.net/
    </pre>

2. Add a few restaurants to the list.

    :::image type="content" source="./media/tutorial-python-postgresql-app-flask/azure-portal-browse-app-2.png" alt-text="A screenshot of the Flask web app with PostgreSQL running in Azure showing restaurants and restaurant reviews." lightbox="./media/tutorial-python-postgresql-app-flask/azure-portal-browse-app-2.png":::

    Congratulations, you're running a web app in Azure App Service, with secure connectivity to Azure Database for PostgreSQL.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 7. Stream diagnostic logs

Azure App Service can capture console logs to help you diagnose issues with your application. For convenience, the AZD template already [enables logging to the local file system](troubleshoot-diagnostic-logs.md#enable-application-logging-linuxcontainer) and is [shipping the logs to a Log Analytics workspace](troubleshoot-diagnostic-logs.md#send-logs-to-azure-monitor).

The sample application includes `print()` statements to demonstrate this capability, as shown in the following snippet.

:::code language="python" source="~/msdocs-flask-postgresql-sample-app/app.py" range="37-41" highlight="3":::

In the AZD output, find the link to stream App Service logs and navigate to it in the browser. The link looks like this in the AZD output:

<pre>
Stream App Service logs at: https://portal.azure.com/#@/resource/subscriptions/&lt;subscription-guid>/resourceGroups/&lt;group-name>/providers/Microsoft.Web/sites/&lt;app-name>/logStream
</pre>

Learn more about logging in Python apps in the series on [setting up Azure Monitor for your Python application](/azure/azure-monitor/app/opencensus-python).

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 8. Clean up resources

To delete all Azure resources in the current deployment environment, run `azd down` and follow the prompts.

```bash
azd down
```

::: zone-end

## Troubleshooting

Listed below are issues you might encounter while trying to work through this tutorial and steps to resolve them.

#### I can't connect to the SSH session

If you can't connect to the SSH session, then the app itself has failed to start. Check the [diagnostic logs](#7-stream-diagnostic-logs) for details. For example, if you see an error like `KeyError: 'AZURE_POSTGRESQL_HOST'`, it might mean that the environment variable is missing (you might have removed the app setting).

#### I get an error when running database migrations

If you encounter any errors related to connecting to the database, check if the app settings (`AZURE_POSTGRESQL_USER`, `AZURE_POSTGRESQL_PASSWORD`, `AZURE_POSTGRESQL_HOST`, and `AZURE_POSTGRESQL_NAME`) were changed or deleted. Without that connection string, the migrate command can't communicate with the database. 

## Frequently asked questions

- [How much does this setup cost?](#how-much-does-this-setup-cost)
- [How do I connect to the PostgreSQL server that's secured behind the virtual network with other tools?](#how-do-i-connect-to-the-postgresql-server-thats-secured-behind-the-virtual-network-with-other-tools)
- [How does local app development work with GitHub Actions?](#how-does-local-app-development-work-with-github-actions)
- [How do I debug errors during the GitHub Actions deployment?](#how-do-i-debug-errors-during-the-github-actions-deployment)
- [I don't have permissions to create a user-assigned identity](#i-dont-have-permissions-to-create-a-user-assigned-identity)
- [What can I do with GitHub Copilot in my codespace?](#what-can-i-do-with-github-copilot-in-my-codespace)

#### How much does this setup cost?

Pricing for the created resources is as follows:

- The App Service plan is created in **Basic** tier and can be scaled up or down. See [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/).
- The PostgreSQL flexible server is created in the lowest burstable tier **Standard_B1ms**, with the minimum storage size, which can be scaled up or down. See [Azure Database for PostgreSQL pricing](https://azure.microsoft.com/pricing/details/postgresql/flexible-server/).
- The virtual network doesn't incur a charge unless you configure extra functionality, such as peering. See [Azure Virtual Network pricing](https://azure.microsoft.com/pricing/details/virtual-network/).
- The private DNS zone incurs a small charge. See [Azure DNS pricing](https://azure.microsoft.com/pricing/details/dns/). 

#### How do I connect to the PostgreSQL server that's secured behind the virtual network with other tools?

- For basic access from a command-line tool, you can run `psql` from the app's SSH session.
- To connect from a desktop tool, your machine must be within the virtual network. For example, it could be an Azure VM that's connected to one of the subnets, or a machine in an on-premises network that has a [site-to-site VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md) connection with the Azure virtual network.
- You can also [integrate Azure Cloud Shell](../cloud-shell/private-vnet.md) with the virtual network.

#### How does local app development work with GitHub Actions?

Using the autogenerated workflow file from App Service as an example, each `git push` kicks off a new build and deployment run. From a local clone of the GitHub repository, you make the desired updates and push to GitHub. For example:

```terminal
git add .
git commit -m "<some-message>"
git push origin main
```

#### How do I debug errors during the GitHub Actions deployment?

If a step fails in the autogenerated GitHub workflow file, try modifying the failed command to generate more verbose output. For example, you can get more output from the `python` command by adding the `-d` option. Commit and push your changes to trigger another deployment to App Service.

#### I don't have permissions to create a user-assigned identity

See [Set up GitHub Actions deployment from the Deployment Center](deploy-github-actions.md#set-up-github-actions-deployment-from-the-deployment-center).

#### What can I do with GitHub Copilot in my codespace?

You might have noticed that the GitHub Copilot chat view was already there for you when you created the codespace. For your convenience, we include the GitHub Copilot chat extension in the container definition (see *.devcontainer/devcontainer.json*). However, you need a [GitHub Copilot account](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor) (30-day free trial available). 

A few tips for you when you talk to GitHub Copilot:

- In a single chat session, the questions and answers build on each other and you can adjust your questions to fine-tune the answer you get.
- By default, GitHub Copilot doesn't have access to any file in your repository. To ask questions about a file, open the file in the editor first.
- To let GitHub Copilot have access to all of the files in the repository when preparing its answers, begin your question with `@workspace`. For more information, see [Use the @workspace agent](https://github.blog/2024-03-25-how-to-use-github-copilot-in-your-ide-tips-tricks-and-best-practices/#10-use-the-workspace-agent).
- In the chat session, GitHub Copilot can suggest changes and (with `@workspace`) even where to make the changes, but it's not allowed to make the changes for you. It's up to you to add the suggested changes and test it.

## Next steps

Advance to the next tutorial to learn how to secure your app with a custom domain and certificate.

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)

Learn how App Service runs a Python app:

> [!div class="nextstepaction"]
> [Configure Python app](configure-language-python.md)
