---
title: "Tutorial: Use Dapr Bindings for Event-Driven Work"
titleSuffix: "Azure Container Apps"
description: Find out how a microservice can use the Dapr Bindings API to work with external systems. Follow steps for deploying the service to Azure Container Apps.
author: greenie-msft
ms.author: nigreenf
ms.reviewer: hannahhunter
ms.service: azure-container-apps
ms.subservice: dapr
ms.custom: devx-track-dotnet, devx-track-js, devx-track-python
ms.topic: how-to
ms.date: 12/11/2025
zone_pivot_group_filename: container-apps/dapr-zone-pivot-groups.json
zone_pivot_groups: dapr-languages-set
# customer intent: As a developer, I want to find out how to use the Dapr Bindings API so that I can streamline the interaction between my microservices and external systems.
---

# Tutorial: Use Dapr Bindings for event-driven work  

In a microservice-based application, you can use Distributed Application Runtime (Dapr) to streamline your app's interaction with external systems. The [Dapr Bindings API](https://docs.dapr.io/developing-applications/building-blocks/bindings/bindings-overview/) makes it possible to work with external systems as inputs and outputs.

This tutorial uses a sample service application:

- The service listens to input-binding events from system `cron` jobs.
- The service uses a PostgreSQL output binding to insert data into a database.

:::image type="content" source="media/microservices-dapr-azd/bindings-quickstart.png" alt-text="Diagram of a batch service that uses a Dapr sidecar. Input flows from cron jobs to the service. Output flows from the service to a database.":::

In this tutorial, you:

> [!div class="checklist"]
> * Run the application locally with the Dapr CLI. 
> * Deploy the application to Azure Container Apps by using the Azure Developer CLI and Bicep files provided in the sample project.

## Prerequisites

- The [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd)
- The Dapr CLI, [installed](https://docs.dapr.io/getting-started/install-dapr-cli/) and [initialized](https://docs.dapr.io/getting-started/install-dapr-selfhost/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/install)

::: zone pivot="nodejs"

## Run the Node.js application locally

Before you deploy the application to Container Apps, take the steps in the following sections to run the PostgreSQL container and JavaScript service locally with [Docker Compose](https://docs.docker.com/compose/) and Dapr.

### Prepare the project

1. Clone the [sample application](https://github.com/Azure-Samples/bindings-dapr-nodejs-cron-postgres) to your local machine.

   ```bash
   git clone https://github.com/Azure-Samples/bindings-dapr-nodejs-cron-postgres.git
   ```

1. Go to the sample root directory.

   ```bash
   cd bindings-dapr-nodejs-cron-postgres
   ```

### Run the application by using the Dapr CLI

1. From the sample root directory, go to the *db* directory.

   ```bash
   cd db
   ```
1. Run the PostgreSQL container with Docker Compose.

   ```bash
   docker compose up -d
   ```

1. In a new terminal window, go to the sample root directory, and then go to the *batch* directory.

   ```bash
   cd bindings-dapr-nodejs-cron-postgres/batch
   ```

1. Install the dependencies.

   ```bash
   npm install
   ```

1. Run the JavaScript service application.

   ```bash
   dapr run --app-id batch-sdk --app-port 5002 --dapr-http-port 3500 --resources-path ../components -- node index.js
   ```

   The `dapr run` command runs the binding application locally. When the application is running successfully, the terminal window shows the data from the output binding.

#### Expected output

The batch service listens to input-binding events from system `cron` jobs. In response to each event, the batch service uses the PostgreSQL output binding to insert data into a database.
   
```
== APP == {"sql": "insert into orders (orderid, customer, price) values (1, 'John Smith', 100.32);"}
== APP == {"sql": "insert into orders (orderid, customer, price) values (2, 'Jane Bond', 15.4);"}
== APP == {"sql": "insert into orders (orderid, customer, price) values (3, 'Tony James', 35.56);"}
== APP == Finished processing batch
== APP == {"sql": "insert into orders (orderid, customer, price) values (1, 'John Smith', 100.32);"}
== APP == {"sql": "insert into orders (orderid, customer, price) values (2, 'Jane Bond', 15.4);"}
== APP == {"sql": "insert into orders (orderid, customer, price) values (3, 'Tony James', 35.56);"}
== APP == Finished processing batch
== APP == {"sql": "insert into orders (orderid, customer, price) values (1, 'John Smith', 100.32);"}
== APP == {"sql": "insert into orders (orderid, customer, price) values (2, 'Jane Bond', 15.4);"}
== APP == {"sql": "insert into orders (orderid, customer, price) values (3, 'Tony James', 35.56);"}
== APP == Finished processing batch
```

### Stop the database container

In the `./db` terminal, stop the PostgreSQL container.

```bash
docker compose stop
```

## Deploy the application template by using the Azure Developer CLI

To deploy the bindings application to Container Apps by using [`azd`](/azure/developer/azure-developer-cli/overview) commands, take the steps in the following sections. The deployment replaces the local PostgreSQL container with an instance of Azure Database for PostgreSQL.

### Prepare the project

Go to the [sample](https://github.com/Azure-Samples/bindings-dapr-nodejs-cron-postgres) root directory.

```bash
cd bindings-dapr-nodejs-cron-postgres
```

### Create and deploy by using the Azure Developer CLI

1. Run `azd init` to initialize the project.

   ```azdeveloper
   azd init
   ```

   When prompted in the terminal, enter a unique environment name. The command uses this name as a prefix for the resource group that it creates to hold all Azure resources.

1. Run `azd up` to prepare the infrastructure and deploy the application to Container Apps in a single command.

   ```azdeveloper
   azd up
   ```

   When prompted in the terminal, provide the following parameters.

   | Parameter | Description |
   | --------- | ----------- |
   | Azure location  | The Azure location for your resources. Select a [location where Azure Database for PostgreSQL is available](/azure/postgresql/flexible-server/overview#azure-regions). |
   | Azure subscription | The Azure subscription for your resources. |

   This process can take some time to run. While the `azd up` command runs, the output displays an Azure portal link that you can use to monitor the deployment progress. The output also demonstrates how `azd up`:

   - Creates and configures all necessary Azure resources via the Bicep files in the *./infra* directory by using `azd provision`. After the Azure Developer CLI deploys these resources, you can use the Azure portal to access them. The files that are used to configure the Azure resources include:
     - *main.parameters.json*.
     - *main.bicep*.
     - An *app* resources directory organized by functionality.
     - A *core* reference library that contains the Bicep modules used by the `azd` template.
   - Deploys the code using `azd deploy`.

   If this step causes [error BCP420](https://aka.ms/bicep/core-diagnostics#BCP420), go to your cloned repo, open the *bindings-dapr-nodejs-cron-postgres/infra/core/host/container-apps.bicep* file, and replace line 28 with the following line:

   ```bicep
   scope: resourceGroup(!empty(containerRegistryResourceGroupName) ? containerRegistryResourceGroupName : resourceGroup().name)
   ```

#### Expected output

The `azd init` command displays output that's similar to the following lines:

```azdeveloper
Initializing an app to run on Azure (azd init)

? Enter a unique environment name: [? for help] <environment-name>

? Enter a unique environment name: <environment-name>

SUCCESS: Initialized environment <environment-name>.
```

The `azd up` command displays output that's similar to the following lines:

```azdeveloper
? Select an Azure Subscription to use:  3. <subscription-name> (aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e)
? Enter a value for the 'location' infrastructure parameter: 51. (US) East US 2 (eastus2)

Packaging services (azd package)

  (✓) Done: Packaging service api
  - Container: bindings-dapr-node-postgres-aca/api-<environment-name>:azd-deploy-1765294769


Provisioning Azure resources (azd provision)
Provisioning Azure resources can take some time.

Subscription: <subscription-name> (aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e)
Location: East US 2

  You can view detailed progress in the Azure Portal:
  https://portal.azure.com/#view/HubsExtension/DeploymentDetailsBlade/~/overview/id/%2Fsubscriptions%2Faaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e%2Fproviders%2FMicrosoft.Resources%2Fdeployments%2F<environment-name>-1765294775

  (✓) Done: Resource group: rg-<environment-name> (1.258s)
  (✓) Done: Log Analytics workspace: log-a1bc2de3fh4ij (20.848s)
  (✓) Done: Application Insights: appi-a1bc2de3fh4ij (2.064s)
  (✓) Done: Portal dashboard: dash-a1bc2de3fh4ij (1.94s)
  (✓) Done: Azure Database for PostgreSQL flexible server: a1bc2de3fh4ij-pg-server (4m2.697s)
  (✓) Done: Key Vault: kv-a1bc2de3fh4ij (21.004s)
  (✓) Done: Container Registry: cra1bc2de3fh4ij (24.916s)
  (✓) Done: Container Apps Environment: cae-a1bc2de3fh4ij (1m40.922s)
  (✓) Done: Container App: ca-batch-a1bc2de3fh4ij (44.638s)

Deploying services (azd deploy)

  (✓) Done: Deploying service api
  - Endpoint: https://ca-batch-a1bc2de3fh4ij.blackrock-c2de3fh4.eastus2.azurecontainerapps.io/


SUCCESS: Your up workflow to provision and deploy to Azure completed in 9 minutes 35 seconds.
```

### Confirm successful deployment 

After deployment, the batch container app uses an output binding to insert data into Azure Database for PostgreSQL every 10 seconds. To check the logs for these insert operations, take the following steps.

1. In the terminal output, copy the container app name.

1. Sign in to the [Azure portal](https://portal.azure.com), and then search for the container app resource by name.

1. On the container app **Overview** page, select **Monitoring** > **Log stream**.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-menu.png" alt-text="Screenshot of the Azure portal side panel. Under Monitoring, Log stream is highlighted.":::

1. On the **Log stream** page, next to **Container**, select **batch**.

   :::image type="content" source="media/microservices-dapr-azd/select-batch-container-logs.png" alt-text="Screenshot of the Log stream page for the batch container app. In the Container list, batch is highlighted." lightbox="media/microservices-dapr-azd/select-batch-container-logs.png":::

1. Confirm the container is logging the same output as in the terminal earlier.

   ```
   Connecting to stream...
   2025-12-09T15:49:43.31766  Connecting to the container 'batch'...
   2025-12-09T15:49:43.33815  Successfully Connected to container: 'batch' [Revision: 'ca-batch-a1bc2de3fh4ij--azd-1010101010', Replica: 'ca-batch-a1bc2de3fh4ij--azd-1010101010-e3fh4ij5kl-6mn7o']
   2025-12-09T15:49:25.003474294Z {"sql": "insert into orders (orderid, customer, price) values (1, 'John Smith', 100.32);"} 
   2025-12-09T15:49:25.004271468Z {"sql": "insert into orders (orderid, customer, price) values (2, 'Jane Bond', 15.4);"} 
   2025-12-09T15:49:25.004668724Z {"sql": "insert into orders (orderid, customer, price) values (3, 'Tony James', 35.56);"} 
   2025-12-09T15:49:25.005036659Z Finished processing batch
   2025-12-09T15:49:35.003595579Z {"sql": "insert into orders (orderid, customer, price) values (1, 'John Smith', 100.32);"} 
   2025-12-09T15:49:35.004256349Z {"sql": "insert into orders (orderid, customer, price) values (2, 'Jane Bond', 15.4);"} 
   2025-12-09T15:49:35.004795603Z {"sql": "insert into orders (orderid, customer, price) values (3, 'Tony James', 35.56);"} 
   2025-12-09T15:49:35.005243829Z Finished processing batch
   2025-12-09T15:49:45.003274969Z {"sql": "insert into orders (orderid, customer, price) values (1, 'John Smith', 100.32);"} 
   2025-12-09T15:49:45.003913458Z {"sql": "insert into orders (orderid, customer, price) values (2, 'Jane Bond', 15.4);"} 
   2025-12-09T15:49:45.004432789Z {"sql": "insert into orders (orderid, customer, price) values (3, 'Tony James', 35.56);"} 
   2025-12-09T15:49:45.004907028Z Finished processing batch
   ```

## Understand azd up

When the `azd up` command runs successfully:

- The Azure Developer CLI creates the Azure resources referenced in the [sample project ./infra directory](https://github.com/Azure-Samples/bindings-dapr-nodejs-cron-postgres/tree/master/infra) in the Azure subscription you specify. You can find those resources in the Azure portal.
- The app is deployed to Container Apps. In the Azure portal, you can access the fully functional app.

::: zone-end

::: zone pivot="python"

## Run the Python application locally

### Prepare the project

1. Clone the [sample application](https://github.com/Azure-Samples/bindings-dapr-python-cron-postgres) to your local machine.

   ```bash
   git clone https://github.com/Azure-Samples/bindings-dapr-python-cron-postgres.git
   ```

1. Go to the sample root directory.

   ```bash
   cd bindings-dapr-python-cron-postgres
   ```

### Run the application by using the Dapr CLI

Before you deploy the application to Container Apps, take the steps in the following sections to run the PostgreSQL container and Python service locally with [Docker Compose](https://docs.docker.com/compose/) and Dapr.

1. From the sample root directory, go to the *db* directory.

   ```bash
   cd db
   ```
1. Run the PostgreSQL container with Docker Compose.

   ```bash
   docker compose up -d
   ```

1. In a new terminal window, go to the sample root directory, and then go to the *batch* directory.

   ```bash
   cd bindings-dapr-python-cron-postgres/batch
   ```

1. Install the dependencies.

   ```bash
   pip install -r requirements.txt
   ```

1. Run the Python service application.

   # [Windows](#tab/windows)
   
   ```bash
   dapr run --app-id batch-sdk --app-port 5001 --dapr-http-port 3500 --resources-path ../components -- python app.py
   ```

   # [Linux](#tab/linux)
   
   ```bash
   dapr run --app-id batch-sdk --app-port 5001 --dapr-http-port 3500 --resources-path ../components -- python3 app.py
   ```

   ---

   The `dapr run` command runs the binding application locally. When the application is running successfully, the terminal window shows the data from the output binding.

#### Expected output

The batch service listens to input-binding events from system `cron` jobs. In response to each event, the batch service uses the PostgreSQL output binding to insert data into a database.
   
```
== APP == Processing batch..
== APP == insert into orders (orderid, customer, price) values (1, 'John Smith', 100.32)
== APP == insert into orders (orderid, customer, price) values (2, 'Jane Bond', 15.4)
== APP == insert into orders (orderid, customer, price) values (3, 'Tony James', 35.56)
== APP == 127.0.0.1 - - [09/Dec/2025 11:19:42] "POST /cron HTTP/1.1" 200 -
== APP == Finished processing batch
== APP == Processing batch..
== APP == insert into orders (orderid, customer, price) values (1, 'John Smith', 100.32)
== APP == insert into orders (orderid, customer, price) values (2, 'Jane Bond', 15.4)
== APP == insert into orders (orderid, customer, price) values (3, 'Tony James', 35.56)
== APP == 127.0.0.1 - - [09/Dec/2025 11:19:52] "POST /cron HTTP/1.1" 200 -
== APP == Finished processing batch
== APP == Processing batch..
== APP == insert into orders (orderid, customer, price) values (1, 'John Smith', 100.32)
== APP == insert into orders (orderid, customer, price) values (2, 'Jane Bond', 15.4)
== APP == insert into orders (orderid, customer, price) values (3, 'Tony James', 35.56)
== APP == 127.0.0.1 - - [09/Dec/2025 11:20:02] "POST /cron HTTP/1.1" 200 -
== APP == Finished processing batch
```

### Stop the database container

In the `./db` terminal, stop the PostgreSQL container.

```bash
docker compose stop
```

## Deploy the application template by using the Azure Developer CLI

To deploy the bindings application to Container Apps by using [`azd`](/azure/developer/azure-developer-cli/overview) commands, take the steps in the following sections. The deployment replaces the local PostgreSQL container with an instance of Azure Database for PostgreSQL.

### Prepare the project

Go to the [sample](https://github.com/Azure-Samples/bindings-dapr-python-cron-postgres) root directory.

```bash
cd bindings-dapr-python-cron-postgres
```

### Create and deploy by using the Azure Developer CLI

1. Run `azd init` to initialize the project.

   ```azdeveloper
   azd init
   ```

   When prompted in the terminal, enter a unique environment name. The command uses this name as a prefix for the resource group that it creates to hold all Azure resources.

1. Run `azd up` to prepare the infrastructure and deploy the application to Container Apps in a single command.

   ```azdeveloper
   azd up
   ```

   When prompted in the terminal, provide the following parameters.

   | Parameter | Description |
   | --------- | ----------- |
   | Azure location  | The Azure location for your resources. Select a [location where Azure Database for PostgreSQL is available](/azure/postgresql/flexible-server/overview#azure-regions). |
   | Azure subscription | The Azure subscription for your resources. |

   This process can take some time to run. While the `azd up` command runs, the output displays an Azure portal link that you can use to monitor the deployment progress. The output also demonstrates how `azd up`:

   - Creates and configures all necessary Azure resources via the Bicep files in the *./infra* directory by using `azd provision`. After the Azure Developer CLI deploys these resources, you can use the Azure portal to access them. The files that are used to configure the Azure resources include:
     - *main.parameters.json*.
     - *main.bicep*.
     - An *app* resources directory organized by functionality.
     - A *core* reference library that contains the Bicep modules used by the `azd` template.
   - Deploys the code using `azd deploy`.

#### Expected output

The `azd init` command displays output that's similar to the following lines:

```azdeveloper
Initializing an app to run on Azure (azd init)

? Enter a unique environment name: [? for help] <environment-name>

? Enter a unique environment name: <environment-name>

SUCCESS: Initialized environment <environment-name>.
```

The `azd up` command displays output that's similar to the following lines:

```azdeveloper
? Select an Azure Subscription to use:  3. <subscription-name> (aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e)
? Enter a value for the 'location' infrastructure parameter: 51. (US) East US 2 (eastus2)

Packaging services (azd package)

  (✓) Done: Packaging service api
  - Container: bindings-dapr-node-postgres-aca/api-<environment-name>:azd-deploy-1765297375


Provisioning Azure resources (azd provision)
Provisioning Azure resources can take some time.

Subscription: <subscription-name> (aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e)
Location: East US 2

  You can view detailed progress in the Azure Portal:
  https://portal.azure.com/#view/HubsExtension/DeploymentDetailsBlade/~/overview/id/%2Fsubscriptions%2Faaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e%2Fproviders%2FMicrosoft.Resources%2Fdeployments%2F<environment-name>-1765297381

  (✓) Done: Resource group: rg-<environment-name> (2.56s)
  (✓) Done: Log Analytics workspace: log-a1bc2de3fh4ij (21.897s)
  (✓) Done: Application Insights: appi-a1bc2de3fh4ij (1.05s)
  (✓) Done: Portal dashboard: dash-a1bc2de3fh4ij (498ms)
  (✓) Done: Azure Database for PostgreSQL flexible server: a1bc2de3fh4ij-pg-server (4m2.986s)
  (✓) Done: Key Vault: kv-a1bc2de3fh4ij (26.377s)
  (✓) Done: Container Registry: cra1bc2de3fh4ij (21.53s)
  (✓) Done: Container Apps Environment: cae-a1bc2de3fh4ij (1m38.436s)
  (✓) Done: Container App: ca-batch-a1bc2de3fh4ij (18.094s)

Deploying services (azd deploy)

  (✓) Done: Deploying service api
  - Endpoint: https://ca-batch-a1bc2de3fh4ij.wonderfulocean-c2de3fh4.eastus2.azurecontainerapps.io/


SUCCESS: Your up workflow to provision and deploy to Azure completed in 8 minutes 57 seconds.
```

### Confirm successful deployment 

After deployment, the batch container app uses an output binding to insert data into Azure Database for PostgreSQL every 10 seconds. To check the logs for these insert operations, take the following steps.

1. In the terminal output, copy the container app name.

1. Sign in to the [Azure portal](https://portal.azure.com), and then search for the container app resource by name.

1. On the container app **Overview** page, select **Monitoring** > **Log stream**.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-menu.png" alt-text="Screenshot of the side panel in the Azure portal. Under Monitoring, Log stream is highlighted.":::

1. On the **Log stream** page, next to **Container**, select **batch**.

   :::image type="content" source="media/microservices-dapr-azd/select-batch-container-logs.png" alt-text="Screenshot of the Log stream page for the batch container app. Above the log stream, in the Container list, batch is highlighted." lightbox="media/microservices-dapr-azd/select-batch-container-logs.png":::

1. Confirm the container is logging the same output as in the terminal earlier.

   ```
   Connecting to stream...
   2025-12-09T16:32:30.19562  Connecting to the container 'batch'...
   2025-12-09T16:32:30.23184  Successfully Connected to container: 'batch' [Revision: 'ca-batch-a1bc2de3fh4ij--azd-1010101010', Replica: 'ca-batch-a1bc2de3fh4ij--azd-1010101010-e3fh4ij5kl-6mn7o']
   2025-12-09T16:32:18.002034430Z Processing batch..
   2025-12-09T16:32:18.008563791Z insert into orders (orderid, customer, price) values (1, 'John Smith', 100.32)
   2025-12-09T16:32:18.073856313Z insert into orders (orderid, customer, price) values (2, 'Jane Bond', 15.4)
   2025-12-09T16:32:18.080456155Z insert into orders (orderid, customer, price) values (3, 'Tony James', 35.56)
   2025-12-09T16:32:18.087961494Z 127.0.0.1 - - [09/Dec/2025 16:32:18] "POST /cron HTTP/1.1" 200 -
   2025-12-09T16:32:28.002101744Z Finished processing batch
   2025-12-09T16:32:28.002144407Z Processing batch..
   2025-12-09T16:32:28.004318297Z insert into orders (orderid, customer, price) values (1, 'John Smith', 100.32)
   2025-12-09T16:32:28.011310277Z insert into orders (orderid, customer, price) values (2, 'Jane Bond', 15.4)
   2025-12-09T16:32:28.017106194Z insert into orders (orderid, customer, price) values (3, 'Tony James', 35.56)
   2025-12-09T16:32:28.022352037Z 127.0.0.1 - - [09/Dec/2025 16:32:28] "POST /cron HTTP/1.1" 200 -
   2025-12-09T16:32:38.001907828Z Finished processing batch
   2025-12-09T16:32:38.001965435Z Processing batch..
   2025-12-09T16:32:38.004525471Z insert into orders (orderid, customer, price) values (1, 'John Smith', 100.32)
   2025-12-09T16:32:38.012426346Z insert into orders (orderid, customer, price) values (2, 'Jane Bond', 15.4)
   2025-12-09T16:32:38.018113370Z insert into orders (orderid, customer, price) values (3, 'Tony James', 35.56)
   2025-12-09T16:32:38.022870049Z 127.0.0.1 - - [09/Dec/2025 16:32:38] "POST /cron HTTP/1.1" 200 -
   ```

## Understand azd up

When the `azd up` command runs successfully:

- The Azure Developer CLI creates the Azure resources referenced in the [sample project ./infra directory](https://github.com/Azure-Samples/bindings-dapr-python-cron-postgres/tree/master/infra) in the Azure subscription you specify. You can find those resources in the Azure portal.
- The app is deployed to Container Apps. In the Azure portal, you can access the fully functional app.

::: zone-end

::: zone pivot="csharp"

## Run the .NET application locally

### Prepare the project

1. Clone the [sample application](https://github.com/Azure-Samples/bindings-dapr-csharp-cron-postgres) to your local machine.

   ```bash
   git clone https://github.com/Azure-Samples/bindings-dapr-csharp-cron-postgres.git
   ```

1. Go to the sample root directory.

   ```bash
   cd bindings-dapr-csharp-cron-postgres
   ```

### Run the application by using the Dapr CLI

Before you deploy the application to Container Apps, take the steps in the following sections to run the PostgreSQL container and .NET service locally with [Docker Compose](https://docs.docker.com/compose/) and Dapr.

1. From the sample root directory, go to the *db* directory.

   ```bash
   cd db
   ```
1. Run the PostgreSQL container with Docker Compose.

   ```bash
   docker compose up -d
   ```

1. In a new terminal window, go to the sample root directory, and then go to the *batch* directory.

   ```bash
   cd bindings-dapr-csharp-cron-postgres/batch
   ```

1. Install the dependencies.

   ```bash
   dotnet build
   ```

1. Run the .NET service application.

   ```bash
   dapr run --app-id batch-sdk --app-port 7002 --resources-path ../components -- dotnet run
   ```

   The `dapr run` command runs the binding application locally. When the application is running successfully, the terminal window shows the data from the output binding.

#### Expected output

The batch service listens to input-binding events from system `cron` jobs. In response to each event, the batch service uses the PostgreSQL output binding to insert data into a database.

```
== APP == Processing batch..
== APP == insert into orders (orderid, customer, price) values (1, 'John Smith', 100.32);
== APP == insert into orders (orderid, customer, price) values (2, 'Jane Bond', 15.4);
== APP == insert into orders (orderid, customer, price) values (3, 'Tony James', 35.56);
== APP == Finished processing batch
== APP == Processing batch..
== APP == insert into orders (orderid, customer, price) values (1, 'John Smith', 100.32);
== APP == insert into orders (orderid, customer, price) values (2, 'Jane Bond', 15.4);
== APP == insert into orders (orderid, customer, price) values (3, 'Tony James', 35.56);
== APP == Finished processing batch
== APP == Processing batch..
== APP == insert into orders (orderid, customer, price) values (1, 'John Smith', 100.32);
== APP == insert into orders (orderid, customer, price) values (2, 'Jane Bond', 15.4);
== APP == insert into orders (orderid, customer, price) values (3, 'Tony James', 35.56);
== APP == Finished processing batch
```

### Stop the database container

In the `./db` terminal, stop the PostgreSQL container.

```bash
docker compose stop
```

## Deploy the application template by using the Azure Developer CLI

To deploy the bindings application to Container Apps by using [`azd`](/azure/developer/azure-developer-cli/overview) commands, take the steps in the following sections. The deployment replaces the local PostgreSQL container with an instance of Azure Database for PostgreSQL.

### Prepare the project

Go to the [sample](https://github.com/Azure-Samples/bindings-dapr-csharp-cron-postgres) root directory.

```bash
cd bindings-dapr-csharp-cron-postgres
```

### Create and deploy by using the Azure Developer CLI

1. Run `azd init` to initialize the project.

   ```azdeveloper
   azd init
   ```

   When prompted in the terminal, enter a unique environment name. The command uses this name as a prefix for the resource group that it creates to hold all Azure resources.

1. Run `azd up` to prepare the infrastructure and deploy the application to Container Apps in a single command.

   ```azdeveloper
   azd up
   ```

   When prompted in the terminal, provide the following parameters.

   | Parameter | Description |
   | --------- | ----------- |
   | Azure location  | The Azure location for your resources. Select a [location where Azure Database for PostgreSQL is available](/azure/postgresql/flexible-server/overview#azure-regions). |
   | Azure subscription | The Azure subscription for your resources. |

   This process can take some time to run. While the `azd up` command runs, the output displays an Azure portal link that you can use to monitor the deployment progress. The output also demonstrates how `azd up`:

   - Creates and configures all necessary Azure resources via the Bicep files in the *./infra* directory by using `azd provision`. After the Azure Developer CLI deploys these resources, you can use the Azure portal to access them. The files that are used to configure the Azure resources include:
     - *main.parameters.json*.
     - *main.bicep*.
     - An *app* resources directory organized by functionality.
     - A *core* reference library that contains the Bicep modules used by the `azd` template.
   - Deploys the code using `azd deploy`.

   If this step causes [error BCP420](https://aka.ms/bicep/core-diagnostics#BCP420), go to your cloned repo, open the *bindings-dapr-csharp-cron-postgres/infra/core/host/container-apps.bicep* file, and replace line 28 with the following line:

   ```bicep
   scope: resourceGroup(!empty(containerRegistryResourceGroupName) ? containerRegistryResourceGroupName : resourceGroup().name)
   ```

#### Expected output

The `azd init` command displays output that's similar to the following lines:

```azdeveloper
Initializing an app to run on Azure (azd init)

? Enter a unique environment name: [? for help] <environment-name>

? Enter a unique environment name: <environment-name>

SUCCESS: Initialized environment <environment-name>.
```

The `azd up` command displays output that's similar to the following lines:

```azdeveloper
? Select an Azure Subscription to use:  3. <subscription-name> (aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e)
? Enter a value for the 'location' infrastructure parameter: 51. (US) East US 2 (eastus2)

Packaging services (azd package)

  (✓) Done: Packaging service api
  - Container: bindings-dapr-csharp-postgres-aca/api-<environment-name>:azd-deploy-1765302322


Provisioning Azure resources (azd provision)
Provisioning Azure resources can take some time.

Subscription: <subscription-name> (aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e)
Location: East US 2

  You can view detailed progress in the Azure Portal:
  https://portal.azure.com/#view/HubsExtension/DeploymentDetailsBlade/~/overview/id/%2Fsubscriptions%2Faaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e%2Fproviders%2FMicrosoft.Resources%2Fdeployments%2F<environment-name>-1765302329

  (✓) Done: Resource group: rg-<environment-name> (5.064s)
  (✓) Done: Log Analytics workspace: log-a1bc2de3fh4ij (23.618s)
  (✓) Done: Application Insights: appi-a1bc2de3fh4ij (1.046s)
  (✓) Done: Portal dashboard: dash-a1bc2de3fh4ij (1.734s)
  (✓) Done: Azure Database for PostgreSQL flexible server: a1bc2de3fh4ij-pg-server (5m3.165s)
  (✓) Done: Key Vault: kv-a1bc2de3fh4ij (18.652s)
  (✓) Done: Container Registry: cra1bc2de3fh4ij (17.922s)
  (✓) Done: Container Apps Environment: cae-a1bc2de3fh4ij (1m43.553s)
  (✓) Done: Container App: ca-batch-a1bc2de3fh4ij (28.457s)

Deploying services (azd deploy)

  (✓) Done: Deploying service api
  - Endpoint: https://ca-batch-a1bc2de3fh4ij.lemonstone-c2de3fh4.eastus2.azurecontainerapps.io/


SUCCESS: Your up workflow to provision and deploy to Azure completed in 10 minutes 48 seconds.
```

### Confirm successful deployment 

After deployment, the batch container app uses an output binding to insert data into Azure Database for PostgreSQL every 10 seconds. To check the logs for these insert operations, take the following steps.

1. In the terminal output, copy the container app name.

1. Sign in to the [Azure portal](https://portal.azure.com), and then search for the container app resource by name.

1. On the container app **Overview** page, select **Monitoring** > **Log stream**.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-menu.png" alt-text="Screenshot of the Azure portal. On the side panel, under Monitoring, Log stream is highlighted.":::

1. On the **Log stream** page, next to **Container**, select **batch**.

   :::image type="content" source="media/microservices-dapr-azd/select-batch-container-logs.png" alt-text="Screenshot of the Log stream page for the batch container app. In the Container list, batch is highlighted and selected." lightbox="media/microservices-dapr-azd/select-batch-container-logs.png":::

1. Confirm the container is logging the same output as in the terminal earlier.

   ```
   Connecting to stream...
   2025-12-09T17:56:48.71008  Connecting to the container 'batch'...
   2025-12-09T17:56:48.74569  Successfully Connected to container: 'batch' [Revision: 'ca-batch-a1bc2de3fh4ij--azd-1010101010', Replica: 'ca-batch-a1bc2de3fh4ij--azd-1010101010-e3fh4ij5kl-6mn7o']
   2025-12-09T17:56:37.036094824Z Processing batch..
   2025-12-09T17:56:37.260654837Z insert into orders (orderid, customer, price) values (1, 'John Smith', 100.32);
   2025-12-09T17:56:37.266900768Z insert into orders (orderid, customer, price) values (2, 'Jane Bond', 15.4);
   2025-12-09T17:56:37.271348202Z insert into orders (orderid, customer, price) values (3, 'Tony James', 35.56);
   2025-12-09T17:56:37.274707749Z Finished processing batch
   2025-12-09T17:56:47.002095902Z Processing batch..
   2025-12-09T17:56:47.007495846Z insert into orders (orderid, customer, price) values (1, 'John Smith', 100.32);
   2025-12-09T17:56:47.013275972Z insert into orders (orderid, customer, price) values (2, 'Jane Bond', 15.4);
   2025-12-09T17:56:47.018779719Z insert into orders (orderid, customer, price) values (3, 'Tony James', 35.56);
   2025-12-09T17:56:47.022543870Z Finished processing batch
   2025-12-09T17:56:57.001690635Z Processing batch..
   2025-12-09T17:56:57.005758247Z insert into orders (orderid, customer, price) values (1, 'John Smith', 100.32);
   2025-12-09T17:56:57.011196545Z insert into orders (orderid, customer, price) values (2, 'Jane Bond', 15.4);
   2025-12-09T17:56:57.017163911Z insert into orders (orderid, customer, price) values (3, 'Tony James', 35.56);
   2025-12-09T17:56:57.020340292Z Finished processing batch
   ```

## Understand azd up

When the `azd up` command runs successfully:

- The Azure Developer CLI creates the Azure resources referenced in the [sample project ./infra directory](https://github.com/Azure-Samples/bindings-dapr-csharp-cron-postgres/tree/master/infra) in the Azure subscription you specify. You can find those resources in the Azure portal.
- The app is deployed to Container Apps. In the Azure portal, you can access the fully functional app.

::: zone-end

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the Azure resources you created.

```azdeveloper
azd down
```

## Related content

- For more information about deploying Dapr microservices to Container Apps, see [Quickstart: Deploy a Dapr application to Azure Container Apps using the Azure CLI](./microservices-dapr.md).
- For information about using a token to check that requests to your app come from Dapr, see [Enable token authentication for Dapr requests](./dapr-authentication-token.md).
- For information about making your applications compatible with `azd`, see [Create Azure Developer CLI templates overview](/azure/developer/azure-developer-cli/make-azd-compatible).

