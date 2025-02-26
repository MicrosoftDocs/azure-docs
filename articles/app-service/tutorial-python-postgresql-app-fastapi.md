---
title: 'Tutorial: Deploy a Python FastAPI web app with PostgreSQL'
description: Create a FastAPI web app with a PostgreSQL database and deploy it to Azure. The tutorial uses the FastAPI framework and the app is hosted on Azure App Service on Linux.
ms.devlang: python
ms.topic: tutorial
ms.date: 7/24/2024
ms.author: msangapu
author: msangapu-msft
ms.custom: mvc, cli-validate, devx-track-python, devdivchpfy22, vscode-azure-extension-update-completed, AppServiceConnectivity, devx-track-extended-azdevcli, linux-related-content
zone_pivot_groups: app-service-portal-azd
---

# Deploy a Python FastAPI web app with PostgreSQL in Azure

In this tutorial, you deploy a data-driven Python web app (**[FastAPI](https://fastapi.tiangolo.com/)** ) to **[Azure App Service](./overview.md#app-service-on-linux)** with the **[Azure Database for PostgreSQL](/azure/postgresql/)** relational database service. Azure App Service supports [Python](https://www.python.org/downloads/) in a Linux server environment. If you want, see the [Flask tutorial](tutorial-python-postgresql-app-flask.md) or the [Django tutorial](tutorial-python-postgresql-app-django.md) instead.

:::image type="content" border="False" source="./media/tutorial-python-postgresql-app-fastapi/python-postgresql-app-architecture-240px.png" lightbox="./media/tutorial-python-postgresql-app-fastapi/python-postgresql-app-architecture.png" alt-text="An architecture diagram showing an App Service with a PostgreSQL database in Azure.":::

**To complete this tutorial, you'll need:**

::: zone pivot="azure-portal"  

* An Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free/python).
* Knowledge of Python with FastAPI development

::: zone-end

::: zone pivot="azure-developer-cli"

* An Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free/python).
* [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) installed. You can follow the steps with the [Azure Cloud Shell](https://shell.azure.com) because it already has Azure Developer CLI installed.
* Knowledge of Python with FastAPI development

::: zone-end

## Skip to the end

With [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) installed, you can skip to the end of the tutorial by running the following commands in an empty working directory:

```bash
azd auth login
azd init --template msdocs-fastapi-postgresql-sample-app
azd up
```

## Sample application

A sample Python application using FastAPI framework is provided to help you follow along with this tutorial. To deploy it without running it locally, skip this part.

To run the application locally, make sure you have [Python 3.8 or higher](https://www.python.org/downloads/) and [PostgreSQL](https://www.postgresql.org/download/) installed locally. Then, clone the sample repository's `starter-no-infra` branch and change to the repository root.

```bash
git clone -b starter-no-infra https://github.com/Azure-Samples/msdocs-fastapi-postgresql-sample-app
cd msdocs-fastapi-postgresql-sample-app
```

Create an *.env* file as shown below using the *.env.sample* file as a guide. Set the value of `DBNAME` to the name of an existing database in your local PostgreSQL instance. Set the values of `DBHOST`, `DBUSER`, and `DBPASS` as appropriate for your local PostgreSQL instance.

```
DBNAME=<database name>
DBHOST=<database-hostname>
DBUSER=<db-user-name>
DBPASS=<db-password>
```

Create a virtual environment for the app:

[!INCLUDE [Virtual environment setup](./includes/quickstart-python/virtual-environment-setup.md)]

Install the dependencies:

```bash
python3 -m pip install -r src/requirements.txt
```

Install the app as an editable package:

```bash
python3 -m pip install -e src
```

Run the sample application with the following commands:

```bash
# Run database migration
python3 src/fastapi_app/seed_data.py
# Run the app at http://127.0.0.1:8000
python3 -m uvicorn fastapi_app:app --reload --port=8000
```

::: zone pivot="azure-portal"  

## 1. Create App Service and PostgreSQL

In this step, you create the Azure resources. The steps used in this tutorial create a set of secure-by-default resources that include App Service and Azure Database for PostgreSQL. For the creation process, you specify:

* The **Name** for the web app. It's the name used as part of the DNS name for your webapp in the form of `https://<app-name>.azurewebsites.net`.
* The **Region** to run the app physically in the world.
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
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-create-app-postgres-1.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find the Web App + Database creation wizard (FastAPI)." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-create-app-postgres-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the **Create Web App + Database** page, fill out the form as follows.
        1. *Resource Group* &rarr; Select **Create new** and use a name of **msdocs-python-postgres-tutorial**.
        1. *Region* &rarr; Any Azure region near you.
        1. *Name* &rarr; **msdocs-python-postgres-XYZ** where *XYZ* is any three random characters. This name must be unique across Azure.
        1. *Runtime stack* &rarr; **Python 3.12**.
        1. *Database* &rarr;  **PostgreSQL - Flexible Server** is selected by default as the database engine. The server name and database name are also set by default to appropriate values.
        1. *Hosting plan* &rarr; **Basic**. When you're ready, you can [scale up](manage-scale-up.md) to a production pricing tier later.
        1. Select **Review + create**.
        1. After validation completes, select **Create**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-create-app-postgres-2.png" alt-text="A screenshot showing how to configure a new app and database in the Web App + Database wizard (FastAPI)." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-create-app-postgres-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** The deployment takes a few minutes to complete. Once deployment completes, select the **Go to resource** button. You're taken directly to the App Service app, but the following resources are created:
        - **Resource group** &rarr; The container for all the created resources.
        - **App Service plan** &rarr; Defines the compute resources for App Service. A Linux plan in the *Basic* tier is created.
        - **App Service** &rarr; Represents your app and runs in the App Service plan.
        - **Virtual network** &rarr; Integrated with the App Service app and isolates back-end network traffic.
        - **Azure Database for PostgreSQL flexible server** &rarr; Accessible only from within the virtual network. A database and a user are created for you on the server.
        - **Private DNS zone** &rarr; Enables DNS resolution of the PostgreSQL server in the virtual network.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-create-app-postgres-3.png" alt-text="A screenshot showing the deployment process completed (FastAPI)." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-create-app-postgres-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4:** For FastAPI apps, you must enter a startup command so App service can start your app. On the App Service page:
        1. In the left menu, under **Settings**, select **Configuration**.
        1. In the **General settings** tab of the **Configuration** page, enter `src/entrypoint.sh` in the **Startup Command** field under **Stack settings**.
        1. Select **Save**. When prompted, select **Continue**.
        To learn more about app configuration and startup in App Service, see [Configure a Linux Python app for Azure App Service](configure-language-python.md).
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-create-app-postgres-fastapi-4.png" alt-text="A screenshot showing adding a startup command (FastAPI)." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-create-app-postgres-fastapi-4.png":::
    :::column-end:::
:::row-end:::

## 2. Verify connection settings

The creation wizard generated the connectivity variables for you already as [app settings](configure-common.md#configure-app-settings). App settings are one way to keep connection secrets out of your code repository. When you're ready to move your secrets to a more secure location, here's an [article on storing in Azure Key Vault](/azure/key-vault/certificates/quick-create-python).

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page, in the left menu, select **Environment variables**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-get-connection-string-fastapi-1.png" alt-text="A screenshot showing how to open the configuration page in App Service (FastAPI)." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-get-connection-string-fastapi-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the **App settings** tab of the **Environment variables** page, verify that `AZURE_POSTGRESQL_CONNECTIONSTRING` is present. The connection string will be injected into the runtime environment as an environment variable.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-get-connection-string-fastapi-2.png" alt-text="A screenshot showing how to see the autogenerated connection string (FastAPI)." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-get-connection-string-fastapi-2.png":::
    :::column-end:::
:::row-end:::

## 3. Deploy sample code

In this step, you configure GitHub deployment using GitHub Actions. It's just one of many ways to deploy to App Service, but also a great way to have continuous integration in your deployment process. By default, every `git push` to your GitHub repository will kick off the build and deploy action.

:::row:::
    :::column span="2":::
        **Step 1:** In a new browser window:
        1. Sign in to your GitHub account.
        1. Navigate to [https://github.com/Azure-Samples/msdocs-fastapi-postgresql-sample-app](https://github.com/Azure-Samples/msdocs-fastapi-postgresql-sample-app).
        1. Select **Fork**.
        1. Select **Create fork**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-deploy-sample-code-fastapi-1.png" alt-text="A screenshot showing how to create a fork of the sample GitHub repository (FastAPI)." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-deploy-sample-code-fastapi-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the GitHub page, open Visual Studio Code in the browser by pressing the `.` key.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-deploy-sample-code-fastapi-2.png" alt-text="A screenshot showing how to open the Visual Studio Code browser experience in GitHub (FastAPI)." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-deploy-sample-code-fastapi-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** In Visual Studio Code in the browser, open *src/fastapi/models.py* in the explorer.
        See the environment variables being used in the production environment, including the app settings that you saw in the configuration page.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-deploy-sample-code-fastapi-3.png" alt-text="A screenshot showing Visual Studio Code in the browser and an opened file (FastAPI)." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-deploy-sample-code-fastapi-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4:** Back in the App Service page, in the left menu, under **Deployment**, select **Deployment Center**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-deploy-sample-code-fastapi-4.png" alt-text="A screenshot showing how to open the deployment center in App Service (FastAPI)." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-deploy-sample-code-fastapi-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5:** In the Deployment Center page:
        1. In **Source**, select **GitHub**. By default, **GitHub Actions** is selected as the build provider.        
        1. Sign in to your GitHub account and follow the prompt to authorize Azure.
        1. In **Organization**, select your account.
        1. In **Repository**, select **msdocs-fastapi-postgresql-sample-app**.
        1. In **Branch**, select **main**.
        1. Keep the default option selected to **Add a workflow**.
        1. Under **Authentication type**, select **User-assigned identity**.
        1. In the top menu, select **Save**. App Service commits a workflow file into the chosen GitHub repository, in the `.github/workflows` directory.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-deploy-sample-code-fastapi-5.png" alt-text="A screenshot showing how to configure CI/CD using GitHub Actions (FastAPI)." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-deploy-sample-code-fastapi-5.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6:** In the Deployment Center page:
        1. Select **Logs**. A deployment run is already started.
        1. In the log item for the deployment run, select **Build/Deploy Logs**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-deploy-sample-code-fastapi-6.png" alt-text="A screenshot showing how to open deployment logs in the deployment center (FastAPI)." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-deploy-sample-code-fastapi-6.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 7:** You're taken to your GitHub repository and see that the GitHub action is running. The workflow file defines two separate stages, build and deploy. Wait for the GitHub run to show a status of **Complete**. It takes about 5 minutes.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-deploy-sample-code-fastapi-7.png" alt-text="A screenshot showing a GitHub run in progress (FastAPI)." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-deploy-sample-code-fastapi-7.png":::
    :::column-end:::
:::row-end:::

Having issues? Check the [Troubleshooting guide](configure-language-python.md#troubleshooting).

## 4. Generate database schema

In previous section, you added *src/entrypoint.sh* as the startup command for your app. *entrypoint.sh* contains the following line: `python3 src/fastapi_app/seed_data.py`. This command migrates your database. In the sample app, it only ensures that the correct tables are created in your database. It doesn't populate these tables with any data.

In this section, you'll run this command manually for demonstration purposes. With the PostgreSQL database protected by the virtual network, the easiest way to run the command is in an SSH session with the App Service container.

:::row:::
    :::column span="2":::
        **Step 1:** Back in the App Service page, in the left menu, 
        1. Select **SSH**. 
        1. Select **Go**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-generate-db-schema-fastapi-1.png" alt-text="A screenshot showing how to open the SSH shell for your app from the Azure portal (FastAPI)." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-generate-db-schema-fastapi-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the SSH terminal, run `python3 src/fastapi_app/seed_data.py`. If it succeeds, App Service is [connecting successfully to the database](#i-get-an-error-when-running-database-migrations).
        Only changes to files in `/home` can persist beyond app restarts. Changes outside of `/home` aren't persisted.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-generate-db-schema-fastapi-2.png" alt-text="A screenshot showing the commands to run in the SSH shell and their output (FastAPI)." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-generate-db-schema-fastapi-2.png":::
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
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-browse-app-1.png" alt-text="A screenshot showing how to launch an App Service from the Azure portal (FastAPI)." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-browse-app-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** Add a few restaurants to the list.
        Congratulations, you're running a web app in Azure App Service, with secure connectivity to Azure Database for PostgreSQL.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-browse-app-2.png" alt-text="A screenshot of the FastAPI web app with PostgreSQL running in Azure showing restaurants and restaurant reviews (FastAPI)." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-browse-app-2.png":::
    :::column-end:::
:::row-end:::

## 6. Stream diagnostic logs

The sample app uses the Python Standard Library logging module to help you diagnose issues with your application. The sample app includes calls to the logger as shown in the following code.

:::code language="python" source="~/msdocs-fastapi-postgresql-sample-app/src/fastapi_app/app.py" range="39-46" highlight="3":::

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, under **Monitoring**, select **App Service logs**.
        1. Under **Application logging**, select **File System**.
        1. In the top menu, select **Save**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-stream-diagnostic-logs-1-fastapi.png" alt-text="A screenshot showing how to enable native logs in App Service in the Azure portal." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-stream-diagnostic-logs-1-fastapi.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** From the left menu, select **Log stream**. You see the logs for your app, including platform logs and logs from inside the container.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-stream-diagnostic-logs-2-fastapi.png" alt-text="A screenshot showing how to view the log stream in the Azure portal." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-stream-diagnostic-logs-2-fastapi.png":::
    :::column-end:::
:::row-end:::

Events can take several minutes to show up in the diagnostic logs. Learn more about logging in Python apps in the series on [setting up Azure Monitor for your Python application](/azure/azure-monitor/app/opencensus-python).

## 7. Clean up resources

When you're finished, you can delete all of the resources from your Azure subscription by deleting the resource group.

:::row:::
    :::column span="2":::
        **Step 1:** In the search bar at the top of the Azure portal:
        1. Enter the resource group name.
        1. Select the resource group.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-clean-up-resources-1.png" alt-text="A screenshot showing how to search for and navigate to a resource group in the Azure portal." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-clean-up-resources-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the resource group page, select **Delete resource group**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-clean-up-resources-2.png" alt-text="A screenshot showing the location of the Delete Resource Group button in the Azure portal." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-clean-up-resources-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** 
        1. Enter the resource group name to confirm your deletion.
        1. Select **Delete**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-clean-up-resources-3.png" alt-text="A screenshot of the confirmation dialog for deleting a resource group in the Azure portal." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-clean-up-resources-3.png"::::
    :::column-end:::
:::row-end:::
::: zone-end

::: zone pivot="azure-developer-cli"

## 1. Create Azure resources and deploy a sample app

In this step, you create the Azure resources and deploy a sample app to App Service on Linux. The steps used in this tutorial create a set of secure-by-default resources that include App Service and Azure Database for PostgreSQL.

1. If you haven't already, clone the sample repository's `starter-no-infra` branch in a local terminal.
    
    ```bash
    git clone -b starter-no-infra https://github.com/Azure-Samples/msdocs-fastapi-postgresql-sample-app
    cd msdocs-fastapi-postgresql-sample-app
    ```

    This cloned branch is your starting point. It contains a simple data-drive FastAPI application.

1. From the repository root, run `azd init`.

    ```bash
    azd init --template msdocs-fastapi-postgresql-sample-app
    ```

1. When prompted, give the following answers:
    
    |Question  |Answer  |
    |---------|---------|
    |The current directory is not empty. Would you like to initialize a project here in '\<your-directory>'?     | **Y**        |
    |What would you like to do with these files?     | **Keep my existing files unchanged**        |
    |Enter a new environment name     | Type a unique name. The azd template uses this name as part of the DNS name of your web app in Azure (`<app-name>.azurewebsites.net`). Alphanumeric characters and hyphens are allowed.          |

1. Run the `azd up` command to provision the necessary Azure resources and deploy the app code. If you aren't already signed-in to Azure, the browser will launch and ask you to sign-in. The `azd up` command will also prompt you to select the desired subscription and location to deploy to. 

    ```bash
    azd up
    ```  

    The `azd up` command can take several minutes to complete. It also compiles and deploys your application code. While it's running, the command provides messages about the provisioning and deployment process, including a link to the deployment in Azure. When it finishes, the command also displays a link to the deploy application.

    This azd template contains files (*azure.yaml* and the *infra* directory) that generate a secure-by-default architecture with the following Azure resources:

    - **Resource group** &rarr; The container for all the created resources.
    - **App Service plan** &rarr; Defines the compute resources for App Service. A Linux plan in the *B1* tier is specified.
    - **App Service** &rarr; Represents your app and runs in the App Service plan.
    - **Virtual network** &rarr; Integrated with the App Service app and isolates back-end network traffic.
    - **Azure Database for PostgreSQL flexible server** &rarr; Accessible only from within the virtual network. A database and a user are created for you on the server.
    - **Private DNS zone** &rarr; Enables DNS resolution of the PostgreSQL server in the virtual network.
    - **Log Analytics workspace** &rarr; Acts as the target container for your app to ship its logs, where you can also query the logs.

1. When the `azd up` command completes, note down the values for the **Subscription ID** (Guid), the **App Service**, and the **Resource Group** in the output. You use them in the following sections. Your output will look similar to the following (partial) output:

    ```output
    Subscription: Your subscription name (1111111-1111-1111-1111-111111111111)
    Location: East US
    
      You can view detailed progress in the Azure Portal:
      https://portal.azure.com/#view/HubsExtension/DeploymentDetailsBlade/~/overview/id/%2Fsubscriptions%2F1111111-1111-1111-1111-111111111111%2Fproviders%2FMicrosoft.Resources%2Fdeployments%2Fyourenv-1721867673
    
      (✓) Done: Resource group: yourenv-rg
      (✓) Done: Virtual Network: yourenv-e2najjk4vewf2-vnet
      (✓) Done: App Service plan: yourenv-e2najjk4vewf2-service-plan
      (✓) Done: Log Analytics workspace: yourenv-e2najjk4vewf2-workspace
      (✓) Done: Application Insights: yourenv-e2najjk4vewf2-appinsights
      (✓) Done: Portal dashboard: yourenv-e2najjk4vewf2-dashboard
      (✓) Done: App Service: yourenv-e2najjk4vewf2-app-service
      (✓) Done: Azure Database for PostgreSQL flexible server: yourenv-e2najjk4vewf2-postgres-server
      (✓) Done: Cache for Redis: yourenv-e2najjk4vewf2-redisCache
      (✓) Done: Private Endpoint: cache-privateEndpoint
    
    SUCCESS: Your application was provisioned in Azure in 32 minutes.
    You can view the resources created under the resource group yourenv-rg in Azure Portal:
    https://portal.azure.com/#@/resource/subscriptions/1111111-1111-1111-1111-111111111111/resourceGroups/yourenv-rg/overview
    
    Deploying services (azd deploy)
    
      (✓) Done: Deploying service web
      - Endpoint: https://yourenv-e2najjk4vewf2-app-service.azurewebsites.net/
    
    ```

## 2. Examine the database connection string

The azd template generates the connectivity variables for you as [app settings](configure-common.md#configure-app-settings). App settings are one way to keep connection secrets out of your code repository.

1. In the `infra/resources.bicep` file, find the app settings and find the setting for `AZURE_POSTGRESQL_CONNECTIONSTRING`.

    :::code language="python" source="~/msdocs-fastapi-postgresql-sample-app/infra/resources.bicep" range="180-188" highlight="5":::

1. `AZURE_POSTGRESQL_CONNECTIONSTRING` contains the connection string to the Postgres database in Azure. You need to use it in your code to connect to it. You can find the code that uses this environment variable in *src/fastapi/models.py*:

    :::code language="python" source="~/msdocs-fastapi-postgresql-sample-app/src/fastapi_app/models.py" range="13-40" highlight="4-16":::

## 3. Examine the startup command

Azure App Service requires a startup command to run your FastAPI app. The azd template sets this command for you in your App Service instance.

1. In the `infra/resources.bicep` file, find the declaration for your web site and then find the setting for `appCommandLine`. This is the setting for your startup command.

    :::code language="python" source="~/msdocs-fastapi-postgresql-sample-app/infra/resources.bicep" range="160-178" highlight="12":::

1. The startup command runs the file *src/entrypoint.sh*. Examine the code in that file to understand the commands that App Service runs to start your app:

    :::code language="python" source="~/msdocs-fastapi-postgresql-sample-app/src/entrypoint.sh" range="1-6":::

To learn more about app configuration and startup in App Service, see [Configure a Linux Python app for Azure App Service](configure-language-python.md).

## 4. Generate database schema

You might have noticed in the previous section that *entrypoint.sh* contains the following line: `python3 src/fastapi_app/seed_data.py`. This command migrates your database. In the sample app, it only ensures that the correct tables are created in your database. It doesn't populate these tables with any data.

In this section, you'll run this command manually for demonstration purposes. With the PostgreSQL database protected by the virtual network, the easiest way to run the command is in an SSH session with the App Service container.

1. Use the value of the **App Service** that you noted previously in the azd output and the template shown below, to construct the URL for the SSH session and navigate to it in the browser:

    ```
    https://<app-name>.scm.azurewebsites.net/webssh/host
    ```

1. In the SSH terminal, run `python3 src/fastapi_app/seed_data.py`. If it succeeds, App Service is [connecting successfully to the database](#i-get-an-error-when-running-database-migrations).

    :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-generate-db-schema-fastapi-2.png" alt-text="A screenshot showing the commands to run in the SSH shell and their output (FastAPI)." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-generate-db-schema-fastapi-2.png":::

    > [!NOTE]
    > Only changes to files in `/home` can persist beyond app restarts. Changes outside of `/home` aren't persisted.
    >

## 5. Browse to the app

1. In the azd output, find the URL of your app and navigate to it in the browser. The URL looks like this in the AZD output:

    <pre>
    Deploying services (azd deploy)
    
      (✓) Done: Deploying service web
      - Endpoint: https://&lt;app-name>.azurewebsites.net/
    </pre>

2. Add a few restaurants to the list.

    :::image type="content" source="./media/tutorial-python-postgresql-app-fastapi/azure-portal-browse-app-2.png" alt-text="A screenshot of the FastAPI web app with PostgreSQL running in Azure showing restaurants and restaurant reviews (FastAPI)." lightbox="./media/tutorial-python-postgresql-app-fastapi/azure-portal-browse-app-2.png":::

    Congratulations, you're running a web app in Azure App Service, with secure connectivity to Azure Database for PostgreSQL.

## 6. Stream diagnostic logs

Azure App Service can capture logs to help you diagnose issues with your application. For convenience, the azd template has already [enabled logging to the local file system](troubleshoot-diagnostic-logs.md#enable-application-logging-linuxcontainer).

The sample app uses the Python Standard Library logging module to output logs. The sample app includes calls to the logger as shown below.

:::code language="python" source="~/msdocs-fastapi-postgresql-sample-app/src/fastapi_app/app.py" range="39-46" highlight="3":::

Use the values of the **Subscription ID** (Guid), **Resource Group**, and **App Service** that you noted previously in the azd output and the template shown below, to construct the URL to stream App Service logs and navigate to it in the browser.

```
https://portal.azure.com/#@/resource/subscriptions/<subscription-guid>/resourceGroups/<group-name>/providers/Microsoft.Web/sites/<app-name>/logStream
```

Events can take several minutes to show up in the diagnostic logs. Learn more about logging in Python apps in the series on [setting up Azure Monitor for your Python application](/azure/azure-monitor/app/opencensus-python).

## 7. Clean up resources

To delete all Azure resources in the current deployment environment, run `azd down`.

```bash
azd down
```
::: zone-end

## Troubleshooting

Listed below are issues you might encounter while trying to work through this tutorial and steps to resolve them.

#### I can't connect to the SSH session

If you can't connect to the SSH session, then the app itself has failed to start. Check the [diagnostic logs](#6-stream-diagnostic-logs) for details. For example, if you see an error like `KeyError: 'AZURE_POSTGRESQL_CONNECTIONSTRING'`, it might mean that the environment variable is missing (you might have removed the app setting).

#### I get an error when running database migrations

If you encounter any errors related to connecting to the database, check if the app settings (`AZURE_POSTGRESQL_CONNECTIONSTRING`) have been changed. Without that connection string, the migrate command can't communicate with the database. 

## Frequently asked questions

- [How much does this setup cost?](#how-much-does-this-setup-cost)
- [How do I connect to the PostgreSQL server that's secured behind the virtual network with other tools?](#how-do-i-connect-to-the-postgresql-server-thats-secured-behind-the-virtual-network-with-other-tools)
- [How does local app development work with GitHub Actions?](#how-does-local-app-development-work-with-github-actions)

#### How much does this setup cost?

Pricing for the created resources is as follows:

- The App Service plan is created in **Basic** tier and can be scaled up or down. See [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/).
- The PostgreSQL flexible server is created in the lowest burstable tier **Standard_B1ms**, with the minimum storage size, which can be scaled up or down. See [Azure Database for PostgreSQL pricing](https://azure.microsoft.com/pricing/details/postgresql/flexible-server/).
- The virtual network doesn't incur a charge unless you configure extra functionality, such as peering. See [Azure Virtual Network pricing](https://azure.microsoft.com/pricing/details/virtual-network/).
- The private DNS zone incurs a small charge. See [Azure DNS pricing](https://azure.microsoft.com/pricing/details/dns/). 

#### How do I connect to the PostgreSQL server that's secured behind the virtual network with other tools?

- For basic access from a command-line tool, you can run `psql` from the app's SSH terminal.
- To connect from a desktop tool, your machine must be within the virtual network. For example, it could be an Azure VM that's connected to one of the subnets, or a machine in an on-premises network that has a [site-to-site VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md) connection with the Azure virtual network.
- You can also [integrate Azure Cloud Shell](../cloud-shell/private-vnet.md) with the virtual network.

#### How does local app development work with GitHub Actions?

Using the autogenerated workflow file from App Service as an example, each `git push` kicks off a new build and deployment run. From a local clone of the GitHub repository, you make the desired updates and push to GitHub. For example:

```terminal
git add .
git commit -m "<some-message>"
git push origin main
```

## Next steps

Advance to the next tutorial to learn how to secure your app with a custom domain and certificate.

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)

Learn how App Service runs a Python app:

> [!div class="nextstepaction"]
> [Configure Python app](configure-language-python.md)
