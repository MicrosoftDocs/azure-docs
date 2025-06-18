---
title: Host a Durable Functions app in Azure Container Apps (preview)
description: Learn how to host a Durable Functions app using the MSSQL backend in Azure Container Apps.
ms.topic: how-to
ms.date: 05/06/2025
---

# Host a Durable Functions app in Azure Container Apps (.NET isolated)

Azure Functions provides integrated support for developing, deploying, and managing containerized Function Apps on Azure Container Apps. Use Azure Container Apps for your Functions apps when you need to run in the same environment as other microservices, APIs, websites, workflows, or any container hosted programs. Learn more about [running Azure Functions in Container Apps](../../container-apps/functions-overview.md). 

> [!NOTE] 
> While Durable Functions supports several [storage providers](./durable-functions-storage-providers.md) or *backends*, autoscaling apps hosted in Azure Container Apps is only available with the [Microsoft SQL (MSSQL) backend](../../container-apps/functions-overview.md#event-driven-scaling). If another backend is used, you have to set minimum replica count to greater than zero. 

In this article, you learn how to:

> [!div class="checklist"]
>
> - Create a Docker image from a local Durable Functions project. 
> - Create an Azure Container App and related resources.
> - Deploy the image to the Azure Container App and set up authentication.

## Prerequisites 

- [Visual Studio Code](https://code.visualstudio.com/download) installed.
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download).
- [Docker](https://docs.docker.com/install/) and [Docker ID](https://hub.docker.com/signup)
- [Azure CLI](/cli/azure/install-azure-cli) [version 2.47](/cli/azure/release-notes-azure-cli#april-21-2020) or later.
- [Azure Functions Core Tools](../functions-run-local.md)
- Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- An HTTP test tool that keeps your data secure. For more information, see [HTTP test tools](../functions-develop-local.md#http-test-tools).

## Create a local Durable Functions project

In Visual Studio Code, [create a **.NET isolated** Durable Functions project configured to use the MSSQL backend](./quickstart-mssql.md). 

[Test the app locally](./quickstart-mssql.md#test-locally) and return to this article. 

## Add Docker-related files

Create a *Dockerfile* in the project root that describes the minimum required environment to run the function app in a container.

1. In the project root directory, create a new file named *Dockerfile*. 

1. Copy/paste the following content into the Dockerfile. 

    ```
    FROM mcr.microsoft.com/dotnet/sdk:8.0 AS installer-env

    COPY . /src/dotnet-function-app
    RUN cd /src/dotnet-function-app && \
    mkdir -p /home/site/wwwroot && \
    dotnet publish *.csproj --output /home/site/wwwroot

    # To enable ssh & remote debugging on app service change the base image to the one below
    # FROM mcr.microsoft.com/azure-functions/dotnet-isolated:4-dotnet-isolated8.0-appservice
    FROM mcr.microsoft.com/azure-functions/dotnet-isolated:4-dotnet-isolated8.0
    ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
        AzureFunctionsJobHost__Logging__Console__IsEnabled=true

    COPY --from=installer-env ["/home/site/wwwroot", "/home/site/wwwroot"]
    ```

1. Save the file.

1. Add a *.dockerignore* file with the following content:

    ```
    local.settings.json
    ```

1. Save the *.dockerignore* file. 

## Build the container image 

Build the Docker image. Find the complete list of supported base images for Azure Functions in the [Azure Functions Base by Microsoft | Docker Hub](https://hub.docker.com/_/microsoft-azure-functions-base)

1. Start the Docker daemon. 

1. Sign in to Docker with the [`docker login`](https://docs.docker.com/engine/reference/commandline/login/) command. 

1. When prompted, log in with your username and password. A "Login Succeeded" message confirms that you're signed in.

1. Navigate to your project root directory. 

1. Run the following command to build the image, replacing `<DOCKER_ID>` with your Docker Hub account ID:

    ```bash
    dockerId=<DOCKER_ID>
    imageName=IMAGE_NAME>
    imageVersion=v1.0.0

    docker build --tag $dockerId/$imageName:$imageVersion .
    ```

    > [!NOTE]
    > If you're running on an M-series Mac, use `--platform linux/amd64` instead.

1. Push the image to Docker:

    ```bash
    docker push $dockerId/$imageName:$imageVersion
    ```

    Depending on network speed, the initial image push might take a few minutes. While you're waiting, proceed to the next section.

## Create Azure resources

Create the Azure resources necessary for running Durable Functions on a container app.
- **Azure resource group:** Resource group containing all created resources.  
- **Azure Container App environment:** Environment hosting the container app. 
- **Azure Container App:** Image containing the Durable Functions app is deployed to this app. 
- **Azure Storage Account:** Required by the function app to store app-related data, such as application code. 

### Initial set up

1. In a new terminal, log in to your Azure subscription:

    ```azurecli
    az login  

    az account set -s <subscription_name>
    ```

1. Run the required commands to set up the Azure Container Apps CLI extension:

    ```azurecli
    az upgrade

    az extension add --name containerapp --upgrade

    az provider register --namespace Microsoft.App

    az provider register --namespace Microsoft.OperationalInsights
    ```

### Create container app and related resources

A [workload profile](../functions-container-apps-hosting.md#hosting-and-workload-profiles) determines the amount of compute and memory resources available to the container apps deployed in an environment. Create a **Consumption workload profile** for scale-to-zero support and pay-per-use. 

1. Set the environment variables.

    ```azurecli
    location=<REGION>
    resourceGroup=<RESOURCE_GROUP_NAME>
    storage=<STORAGE_NAME>
    containerAppEnv=<CONTAINER_APP_ENVIRONMNET_NAME>
    functionApp=<APP_NAME>
    vnet=<VNET_NAME>
    ```

1. Create a resource group.

    ```azurecli
    az group create --name $resourceGroup --location $location
    ```

1. Create the container app environment.

    ```azurecli
    az containerapp env create \
      --enable-workload-profiles \
      --resource-group $resourceGroup \
      --name $containerAppEnv \
      --location $location \
    ```

1. Create a container app based on the Durable Functions image.

    ```azurecli
    az containerapp create --resource-group $resourceGroup \
    --name $functionApp \
    --environment $containerAppEnv \
    --image $dockerId/$imageName:$imageVersion \
    --ingress external \
    --kind functionapp \
    --query properties.outputs.fqdn
    ```

1. Make note of the app URL, which should look similar to `https://<APP_NAME>.<ENVIRONMENT_IDENTIFIER>.<REGION>.azurecontainerapps.io`.

### Create databases

1. Create an Azure Storage account, which is required by the function app.

   ```azurecli
   az storage account create --name $storage --location $location --resource-group $resourceGroup --sku Standard_LRS
   ```

1. In the Azure portal, [create an Azure SQL database](/azure/azure-sql/database/single-database-create-quickstart) to persist state information. During creation:
    - Enable Azure services and resources to access this server (under **Networking**)
    - Set the value for **Database collation** (under **Additional settings**) to `Latin1_General_100_BIN2_UTF8`.

> [!NOTE] 
> Refrain from enabling the **Allow Azure services and resources to access this server** setting for production scenarios. Production applications should implement more secure approaches, such as stronger firewall restrictions or virtual network configurations.

### Configure identity-based authentication

Managed identities make your app more secure by eliminating secrets from your app, such as credentials in the connection strings. While you can choose between [system-assigned and user-assigned managed identity](/entra/identity/managed-identities-azure-resources/overview), user-assigned managed identity is recommended, as it's not tied to the app lifecycle. 

In this section, you set up **user-assigned managed identity** for Azure Storage.

1. Set the environment variables.

    ```azurecli
    subscription=<SUBSCRIPTION_ID>
    identity=<IDENTITY_NAME>
    ```

1. Create a managed identity resource. 

    ```azurecli
    echo "Creating $identity"
    az identity create -g $resourceGroup -n $identity --location "$location"
    ```

1. Assign the user identity to the container app.

    ```azurecli
    echo "Assigning $identity to app"
    az containerapp identity assign --resource-group $resourceGroup --name $functionApp --user-assigned $identity
    ```

1. Set the scope of the role-based access control (RBAC) permissions.

    ```azurecli
    scope="/subscriptions/$subscription/resourceGroups/$resourceGroup/providers/Microsoft.Storage/storageAccounts/$storage"
    ```

1. Get the user identity's `clientId`.

    ```azurecli
    # Get the identity's ClientId 
    clientId=$(az identity show --name $identity --resource-group $resourceGroup --query 'clientId' --output tsv)
    ```

1. Assign the role **Storage Blob Data Owner** role for access to the storage account. 

    ```azurecli
    echo "Assign Storage Blob Data Owner role to identity"
    az role assignment create --assignee "$clientId" --role "Storage Blob Data Owner" --scope "$scope"
    ```

### Set up app settings
> [!NOTE]
> Authenticating to the MSSQL database using managed identity isn't supported when hosting a Durable Functions app in Azure Container Apps. For now, this guide authenticates using connection strings.

1. From the SQL database resource in the Azure portal, navigate to **Settings** > **Connection strings** to find the connection string.

    :::image type="content" source="./media/quickstart-mssql/mssql-azure-db-connection-string.png" alt-text="Screenshot showing database connection string.":::

    The connection string should have a format similar to: 

    ```bash
    dbserver=<SQL_SERVER_NAME>
    sqlDB=<SQL_DB_NAME>
    username=<DB_USER_LOGIN>
    password=<DB_USER_PASSWORD>

    connStr="Server=tcp:$dbserver.database.windows.net,1433;Initial Catalog=$sqlDB;Persist Security Info=False;User ID=$username;Password=$password;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
    ```

    If you forget the password from the previous database creation step, you can reset it on the SQL server resource.

    :::image type="content" source="./media/quickstart-mssql/mssql-azure-reset-pass-2.png" alt-text="Screenshot showing reset password button.":::

1. Store the SQL database's connection string as a [secret](../../container-apps/manage-secrets.md) called *sqldbconnection* in the container app.

    ```azurecli
    az containerapp secret set \
    --resource-group $resourceGroup \
    --name $functionApp \
    --secrets sqldbconnection=$connStr
    ```

1. Add the following settings to the app:

    ```azurecli
    az containerapp update \
    -n $functionApp \
    -g $resourceGroup \
    --set-env-vars SQLDB_Connection=secretref:sqldbconnection \
    AzureWebJobsStorage__accountName=$storage \
    AzureWebJobsStorage__clientId=$clientId \
    AzureWebJobsStorage__credential=managedidentity \
    FUNCTIONS_WORKER_RUNTIME=dotnet-isolated
    ```

## Test locally

1. Use an HTTP test tool to send a `POST` request to the HTTP trigger endpoint, which should be similar to: 

    ```
    https://<APP NAME>.<ENVIRONMENT_IDENTIFIER>.<REGION>.azurecontainerapps.io/api/DurableFunctionsOrchestrationCSharp1_HttpStart
    ```

   The response is the HTTP function's initial result letting you know that the Durable Functions orchestration started successfully. While the response includes a few useful URLs, it doesn't yet display the orchestration's end result.

1. Copy/paste the URL value for `statusQueryGetUri` into your browser's address bar and execute. Alternatively, you can continue to use the HTTP test tool to issue the `GET` request.
    
    The request queries the orchestration instance for the status. You should see that the instance finished and the outputs or results of the Durable Functions app.

    ```json
    {
        "name":"HelloCities",
        "instanceId":"7f99f9474a6641438e5c7169b7ecb3f2",
        "runtimeStatus":"Completed",
        "input":null,
        "customStatus":null,
        "output":"Hello, Tokyo! Hello, London! Hello, Seattle!",
        "createdTime":"2023-01-31T18:48:49Z",
        "lastUpdatedTime":"2023-01-31T18:48:56Z"
    }
    ```

## Next steps

Learn more about:
- [Azure Container Apps hosting of Azure Functions](../../container-apps/functions-overview.md). 
- [MSSQL storage provider](https://microsoft.github.io/durabletask-mssql/) architecture, configuration, and workload behavior. 
- The Azure-managed storage backend, [Durable Task Scheduler](./durable-task-scheduler/durable-task-scheduler.md).