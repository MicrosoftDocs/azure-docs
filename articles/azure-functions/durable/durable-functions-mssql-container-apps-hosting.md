---
title: "Host a Durable Functions app in Azure Container Apps"
description: Learn how to host a Durable Functions app using the MSSQL backend in Azure Container Apps.
ms.topic: how-to
ms.date: 05/06/2025
---

# Host a Durable Functions app in Azure Container Apps (.NET isolated)

This article shows how to host a Durable Functions app in Azure Container Apps. While Durable Functions supports several [storage providers](./durable-functions-storage-providers.md) or *backends*, autoscaling of the app is only available when using the Microsoft SQL (MSSQL) backend. If another backends is used, you need to [manually set up scaling](../functions-container-apps-hosting.md#event-driven-scaling) today.

## Prerequisites 
+ [Visual Studio Code](https://code.visualstudio.com/download) installed.

+ [.NET 8.0 SDK](https://dotnet.microsoft.com/download).

+ [Docker](https://docs.docker.com/install/) and [Docker ID](https://hub.docker.com/signup)

+ [Azure CLI](/cli/azure/install-azure-cli) [version 2.47](/cli/azure/release-notes-azure-cli#april-21-2020) or later.

+ [Azure Functions Core Tools](../functions-run-local.md)

+ Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ An HTTP test tool that keeps your data secure. For more information, see [HTTP test tools](../functions-develop-local.md#http-test-tools).

## Create a local Durable Functions project
In Visual Studio Code, [create a .NET isolated Durable Functions project](./quickstart-mssql.md) configured to use the MSSQL backend. Follow the article until the [Test locally](./quickstart-mssql.md#test-locally) section and make sure you can run the app locally before going to the next step. 

### Add Docker related files
1. In the project root directory, add a _Dockerfile_ with the following content:
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

1. Add a _.dockerignore_ file with the following content:
    ```
    local.settings.json
    ```

## Build the container image 
The Dockerfile in the project root describes the minimum required environment to run the function app in a container. The complete list of supported base images for Azure Functions is documented above as Host images in the pre-requisites section or can be found in the [Azure Functions Base by Microsoft | Docker Hub](https://hub.docker.com/_/microsoft-azure-functions-base)

1. Start the Docker daemon. 

1. Sign in to Docker with the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command. This command prompts you for your username and password. A "Login Succeeded" message confirms that you're signed in.

1. In the **LocalFunctionProj** project folder, run the following command to build the image, replacing <DOCKER_ID> with your Docker Hub account ID:
    ```bash
    dockerId=<DOCKER_ID>
    imageName=IMAGE_NAME>
    imageVersion=v1.0.0

    docker build --platform linux --tag $dockerId/$imageName:$imageVersion .
    ```

    >[!NOTE]
    > If you're running on an M-series Mac, use `--platform linux/amd64` instead.

1. Push the image to Docker:
    ```bash
    docker push $dockerId/$imageName:$imageVersion
    ```

Depending on network speed, pushing the image the first time might take a few minutes (pushing subsequent changes is much faster). While you're waiting, proceed to the next section to create Azure resources in another terminal.

## Create Azure resources
The following instructions will guide you through creating these Azure resources:
- Azure resource group: For convenient cleanup later, all resources are created in this group. 
- Azure Container App environment: Environment where container app is hosted. 
- Azure Container App: Image containing the Durable Functions app is deployed to this app. 
- Azure Storage Account: Required by the function app to store app related data such as application code. 
- A virtual network: Required when running container apps. 

### Initial set up
1. Login to your Azure subscription:
```azurecli
az login  
az account set -subscription | -s <subscription_name>
```

1. Run the required commands to set up the Azure Container Apps CLI extension:
```azurecli
az upgrade

az extension add --name containerapp --upgrade

az provider register --namespace Microsoft.App

az provider register --namespace Microsoft.OperationalInsights
```

### Create app related resources
A workload profile determines the amount of compute and memory resources available to the container apps deployed in an environment. The following creates a Consumption workload profile for scale-to-zero support and pay-per-use. Learn more about [workload profiles](../functions-container-apps-hosting.md#hosting-and-workload-profiles). 

```azurecli
location=<REGION>
resourceGroup=<RESOURCE_GROUP_NAME>
storage=<STORAGE_NAME>
containerAppEnv=<CONTAINER_APP_ENVIRONMNET_NAME>
storageSku=Standard_LRS
functionApp=<APP_NAME>
vnet=<VNET_NAME>

# Create an Azure resource group
az group create --name $resourceGroup --location $location

# A VNET is required when creating a container app environment
az network vnet create --resource-group $resourceGroup --name $vnet --location $location --address-prefix 10.0.0.0/16

# The VNET must have a subnet for the environment deployment
az network vnet subnet create \
  --resource-group $resourceGroup \
  --vnet-name $vnet \
  --name infrastructure-subnet \
  --address-prefixes 10.0.0.0/23

# Get subnet ID
subnetId=$(az network vnet subnet show --resource-group $resourceGroup --vnet-name $vnet --name infrastructure-subnet --query "id" -o tsv | tr -d '[:space:]')

# Delegate the subnet to `Microsoft.App/environments`
az network vnet subnet update --resource-group $resourceGroup --vnet-name $vnet --name infrastructure-subnet --delegations Microsoft.App/environments

# Create the container app environment
az containerapp env create \
  --enable-workload-profiles \
  --resource-group $resourceGroup \
  --name $containerAppEnv \
  --location $location \
  --infrastructure-subnet-resource-id $subnetId

# Create a container app based on the Durable Functions image
az containerapp create --resource-group $resourceGroup \
--name $functionApp \
--environment $containerAppEnv \
--image $dockerId/$imageName:$imageVersion \
--ingress external \
--allow-insecure \
--target-port 80 \
--transport auto \
--kind functionapp \
--query properties.outputs.fqdn
```

Note down the app link, which should look similar to:
```
https://<APP_NAME>.victoriouswave-3866c33e.<REGION>.azurecontainerapps.io/
```

### Create databases
You need to create an Azure Storage account for storing app related data:

```azurecli
az storage account create --name $storage --location $location --resource-group $resourceGroup --sku $storageSku
```

Your Durable Functions also needs an Azure SQL Database as its storage backend. This is where state information is persisted as your orchestrations run. In the Azure portal, you can [create an Azure SQL database](/azure/azure-sql/database/single-database-create-quickstart). During creation:
- Enable Azure services and resources to access this server (under _Networking_)
- Set the value for _Database collation_ (under _Additional settings_) to `Latin1_General_100_BIN2_UTF8`.

> [!NOTE] Enabling the **Allow Azure services and resources to access this server** setting is not a recommended security practice for production scenarios. Real applications should implement more secure approaches, such as stronger firewall restrictions or virtual network configurations.

### Configure identity-based authentication
Managed identities make your app more secure by eliminating secrets from your app, such as credentials in the connection strings. You can choose between [system-assigned and user-assigned managed identity](/entra/identity/managed-identities-azure-resources/overview). This article demonstrates setting up user-assigned managed identity, which is the recommended option as it is not tied to the app lifecycle.

1. Create identity and assign it to the container app:
    ```azurecli
    # Variables
    subscription=<SUBSCRIPTION_ID>
    identity=<IDENTITY_NAME>

    # Create a managed identity resource
    echo "Creating $identity"
    az identity create -g $resourceGroup -n $identity --location "$location"

    # Construct the identity resource ID 
    resourceId="/subscriptions/$subscription/resourceGroups/$resourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$identity"

    # Assign the identity to the container app
    echo "Assigning $identity to app"
    az containerapp identity assign --resource-group $resourceGroup --name $functionApp --user-assigned $identity
    ```

1. Assign the identity `Storage Blob Data Owner` role for access to the storage account. 
    ```
    # Set the scope of the access
    scope="/subscriptions/$subscription/resourceGroups/$resourceGroup/providers/Microsoft.Storage/storageAccounts/$storage"

    # Get the identity's ClientId 
    clientId=$(az identity show --name $identity --resource-group $resourceGroup --query 'clientId' --output tsv)
    
    # Assign the role
    echo "Assign Storage Blob Data Owner role to identity"
    az role assignment create --assignee "$clientId" --role "Storage Blob Data Owner" --scope "$scope"
    ```

### Set up app settings
1. Start by storing the SQL database's connection string as a [secret](../../container-apps/manage-secrets.md) in the container app. Find the connection string by going to the SQL database resource on Azure portal, navigating to the **Settings** tab, then clicking on **Connection strings**:

    :::image type="content" source="/media/quickstart-mssql/mssql-azure-db-connection-string.png" alt-text="Screenshot showing database connection string.":::

    The connection string should have this format: 
    ```bash
    dbserver=<SQL_SERVER_NAME>
    sqlDB=<SQL_DB_NAME>
    username=<DB_USER_LOGIN>
    password=<DB_USER_PASSWORD>

    connStr="Server=tcp:$dbserver.database.windows.net,1433;Initial Catalog=$sqlDB;Persist Security Info=False;User ID=$username;Password=$password;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
    ```

> [!NOTE]
> Authenticating to the MSSQL database using managed identity is not yet supported when hosting a Durable Functions app in Azure Container Apps. Only connection string is supported today. 
>
> If you forget the password from the previous database creation step, you can reset it on the SQL server resource:
> :::image type="content" source="/media/quickstart-mssql/mssql-azure-reset-pass-2.png" alt-text="Screenshot showing reset password button.":::

1. Store the connection string as a secret:

    ```azurecli
    az containerapp create \
    --resource-group $resourceGroup \
    --name $functionApp \
    --environment $containerAppEnv \
    --image $dockerId/$imageName:$imageVersion \
    --secrets sqldbconnection=$connStr
    ```

1. Add these settings required by the app:
    - `AzureWebJobsStorage__accountName`: <STORAGE_NAME>
    - `AzureWebJobsStorage__clientId`: <IDENTITY_CLIENT_ID>
    - `AzureWebJobsStorage__credential`: managedidentity
    - `SQLDB_Connection`: <SQLDB_CONNECTION_STRING>
    - `FUNCTIONS_WORKER_RUNTIME`: <APP_LANGUAGE>

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

## Test

1. Use an HTTP test tool to send a POST request to the HTTP trigger endpoint, which should be similar to: 
    ```
    https://<APP NAME>.victoriouswave-3866c33e.<REGION>.azurecontainerapps.io/api/DurableFunctionsOrchestrationCSharp1_HttpStart
    ```

   The response is the HTTP function's initial result. It lets you know that the Durable Functions orchestration started successfully. It doesn't yet display the end result of the orchestration. The response includes a few useful URLs.

1. Copy the URL value for `statusQueryGetUri`, paste it in your browser's address bar, and execute the request. Alternatively, you can also continue to use the HTTP test tool to issue the GET request.

    The request queries the orchestration instance for the status. You should see that the instance finished and that it includes the outputs or results of the Durable Functions app like in this example:

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

- Learn more about [Azure Container Apps hosting of Azure Functions](../functions-container-apps-hosting.md). 
- See the [MSSQL storage provider documentation](https://microsoft.github.io/durabletask-mssql/) for more information about this backend's architecture, configuration, and workload behavior. 
- Learn about the Azure-managed storage backend [Durable Task Scheduler](./durable-task-scheduler/durable-task-scheduler.md)



