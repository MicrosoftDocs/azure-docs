---
title: "Event-driven work using Dapr Bindings"
titleSuffix: "Azure Container Apps"
description: Deploy a sample Dapr Bindings application to Azure Container Apps.
author: hhunter-ms
ms.author: hannahhunter
ms.service: container-apps
ms.custom: devx-track-dotnet, devx-track-js, devx-track-python
ms.topic: how-to
ms.date: 04/11/2023
zone_pivot_group_filename: container-apps/dapr-zone-pivot-groups.json
zone_pivot_groups: dapr-languages-set
---

# Event-driven work using Dapr Bindings 

In this tutorial, you create a microservice to demonstrate [Dapr's Bindings API](https://docs.dapr.io/developing-applications/building-blocks/bindings/bindings-overview/) to work with external systems as inputs and outputs. You'll:
> [!div class="checklist"]
> * Run the application locally. 
> * Deploy the application to Azure Container Apps via the Azure Developer CLI with the provided Bicep. 

The service listens to input binding events from a system CRON and then outputs the contents of local data to a PostreSql output binding.

:::image type="content" source="media/microservices-dapr-azd/bindings-quickstart.png" alt-text="Diagram of the Dapr binding application.":::

## Prerequisites

- Install [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd)
- [Install](https://docs.dapr.io/getting-started/install-dapr-cli/) and [init](https://docs.dapr.io/getting-started/install-dapr-selfhost/) Dapr
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Install [Git](https://git-scm.com/downloads)

::: zone pivot="nodejs"

## Run the Node.js application locally

Before deploying the application to Azure Container Apps, start by running the PostgreSQL container and JavaScript service locally with [Docker Compose](https://docs.docker.com/compose/) and Dapr.

### Prepare the project

1. Clone the [sample Dapr application](https://github.com/Azure-Samples/bindings-dapr-nodejs-cron-postgres) to your local machine.

   ```bash
   git clone https://github.com/Azure-Samples/bindings-dapr-nodejs-cron-postgres.git
   ```

1. Navigate into the sample's root directory.

   ```bash
   cd bindings-dapr-nodejs-cron-postgres
   ```

### Run the Dapr application using the Dapr CLI

1. From the sample's root directory, change directories to `db`.

   ```bash
   cd db
   ```
1. Run the PostgreSQL container with Docker Compose.

   ```bash
   docker compose up -d
   ```

1. Open a new terminal window and navigate into `/batch` in the sample directory.

   ```bash
   cd bindings-dapr-nodejs-cron-postgres/batch
   ```

1. Install the dependencies.

   ```bash
   npm install
   ```

1. Run the JavaScript service application with Dapr.

   ```bash
   dapr run --app-id batch-sdk --app-port 5002 --dapr-http-port 3500 --resources-path ../components -- node index.js
   ```

   The `dapr run` command runs the Dapr binding application locally. Once the application is running successfully, the terminal window shows the output binding data.

   #### Expected output
   
   The batch service listens to input binding events from a system CRON and then outputs the contents of local data to a PostgreSQL output binding.
   
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

1. In the `./db` terminal, stop the PostgreSQL container.

   ```bash
   docker compose stop
   ```

## Deploy the Dapr application template using Azure Developer CLI

Now that you've run the application locally, let's deploy the Dapr bindings application to Azure Container Apps using [`azd`](/azure/developer/azure-developer-cli/overview). During deployment, we will swap the local containerized PostgreSQL for an Azure PostgreSQL component.

### Prepare the project

Navigate into the [sample's](https://github.com/Azure-Samples/bindings-dapr-nodejs-cron-postgres) root directory.

```bash
cd bindings-dapr-nodejs-cron-postgres
```

### Provision and deploy using Azure Developer CLI

1. Run `azd init` to initialize the project.

   ```azdeveloper
   azd init
   ```

1. When prompted in the terminal, provide the following parameters.

   | Parameter | Description |
   | --------- | ----------- |
   | Environment Name | Prefix for the resource group created to hold all Azure resources. |
   | Azure Location  | The Azure location for your resources. [Make sure you select a location available for Azure PostgreSQL](../postgresql/flexible-server/overview.md#azure-regions). |
   | Azure Subscription | The Azure subscription for your resources. |

1. Run `azd up` to provision the infrastructure and deploy the Dapr application to Azure Container Apps in a single command.

   ```azdeveloper
   azd up
   ```

   This process may take some time to complete. As the `azd up` command completes, the CLI output displays two Azure portal links to monitor the deployment progress. The output also demonstrates how `azd up`:

   - Creates and configures all necessary Azure resources via the provided Bicep files in the `./infra` directory using `azd provision`. Once provisioned by Azure Developer CLI, you can access these resources via the Azure portal. The files that provision the Azure resources include:
     - `main.parameters.json`
     - `main.bicep`
     - An `app` resources directory organized by functionality
     - A `core` reference library that contains the Bicep modules used by the `azd` template
   - Deploys the code using `azd deploy`


   #### Expected output
   
   ```azdeveloper
   Initializing a new project (azd init)
   
   
   Provisioning Azure resources (azd provision)
   Provisioning Azure resources can take some time
   
     You can view detailed progress in the Azure Portal:
     https://portal.azure.com/#blade/HubsExtension/DeploymentDetailsBlade/overview
   
     (✓) Done: Resource group: resource-group-name
     (✓) Done: Log Analytics workspace: log-analytics-name
     (✓) Done: Application Insights: app-insights-name
     (✓) Done: Portal dashboard: dashboard-name
     (✓) Done: Azure Database for PostgreSQL flexible server: postgres-server
     (✓) Done: Key vault: key-vault-name
     (✓) Done: Container Apps Environment: container-apps-env-name
     (✓) Done: Container App: container-app-name
   
   
   Deploying services (azd deploy)
   
     (✓) Done: Deploying service api
     - Endpoint: https://your-container-app-endpoint.region.azurecontainerapps.io/
   
   SUCCESS: Your Azure app has been deployed!
   You can view the resources created under the resource group resource-group-name in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/your-subscription-ID/resourceGroups/your-resource-group/overview
   ```

### Confirm successful deployment 

In the Azure portal, verify the batch container app is logging each insert into Azure PostgreSQL every 10 seconds. 

1. Copy the Container App name from the terminal output.

1. Sign in to the [Azure portal](https://portal.azure.com) and search for the Container App resource by name.

1. In the Container App dashboard, select **Monitoring** > **Log stream**.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-menu.png" alt-text="Screenshot of the navigating to the log streams from the Azure Container Apps side menu.":::

1. Confirm the container is logging the same output as in the terminal earlier.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-portal-view.png" alt-text="Screenshot of the container app's log stream in the Azure portal.":::

## What happened?

Upon successful completion of the `azd up` command:

- Azure Developer CLI provisioned the Azure resources referenced in the [sample project's `./infra` directory](https://github.com/Azure-Samples/bindings-dapr-nodejs-cron-postgres-/tree/master/infra) to the Azure subscription you specified. You can now view those Azure resources via the Azure portal.
- The app deployed to Azure Container Apps. From the portal, you can browse the fully functional app.

::: zone-end

::: zone pivot="python"

## Run the Python application locally

### Prepare the project

1. Clone the [sample Dapr application](https://github.com/Azure-Samples/bindings-dapr-python-cron-postgres) to your local machine.

   ```bash
   git clone https://github.com/Azure-Samples/bindings-dapr-python-cron-postgres.git
   ```

1. Navigate into the sample's root directory.

   ```bash
   cd bindings-dapr-python-cron-postgres
   ```

### Run the Dapr application using the Dapr CLI

Before deploying the application to Azure Container Apps, start by running the PostgreSQL container and Python service locally with [Docker Compose](https://docs.docker.com/compose/) and Dapr.

1. From the sample's root directory, change directories to `db`.

   ```bash
   cd db
   ```
1. Run the PostgreSQL container with Docker Compose.

   ```bash
   docker compose up -d
   ```

1. Open a new terminal window and navigate into `/batch` in the sample directory.

   ```bash
   cd bindings-dapr-python-cron-postgres/batch
   ```

1. Install the dependencies.

   ```bash
   pip install -r requirements.txt
   ```

1. Run the Python service application with Dapr.

   ```bash
   dapr run --app-id batch-sdk --app-port 5001 --dapr-http-port 3500 --resources-path ../components -- python3 app.py
   ```

   The `dapr run` command runs the Dapr binding application locally. Once the application is running successfully, the terminal window shows the output binding data.

   #### Expected output
   
   The batch service listens to input binding events from a system CRON and then outputs the contents of local data to a PostgreSQL output binding.
   
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

1. In the `./db` terminal, stop the PostgreSQL container.

   ```bash
   docker compose stop
   ```

## Deploy the Dapr application template using Azure Developer CLI

Now that you've run the application locally, let's deploy the Dapr bindings application to Azure Container Apps using [`azd`](/azure/developer/azure-developer-cli/overview). During deployment, we will swap the local containerized PostgreSQL for an Azure PostgreSQL component.

### Prepare the project

Navigate into the [sample's](https://github.com/Azure-Samples/bindings-dapr-python-cron-postgres) root directory.

```bash
cd bindings-dapr-python-cron-postgres
```

### Provision and deploy using Azure Developer CLI

1. Run `azd init` to initialize the project.

   ```azdeveloper
   azd init
   ```

1. When prompted in the terminal, provide the following parameters.

   | Parameter | Description |
   | --------- | ----------- |
   | Environment Name | Prefix for the resource group created to hold all Azure resources. |
   | Azure Location  | The Azure location for your resources. [Make sure you select a location available for Azure PostgreSQL](../postgresql/flexible-server/overview.md#azure-regions). |
   | Azure Subscription | The Azure subscription for your resources. |

1. Run `azd up` to provision the infrastructure and deploy the Dapr application to Azure Container Apps in a single command.

   ```azdeveloper
   azd up
   ```

   This process may take some time to complete. As the `azd up` command completes, the CLI output displays two Azure portal links to monitor the deployment progress. The output also demonstrates how `azd up`:

   - Creates and configures all necessary Azure resources via the provided Bicep files in the `./infra` directory using `azd provision`. Once provisioned by Azure Developer CLI, you can access these resources via the Azure portal. The files that provision the Azure resources include:
     - `main.parameters.json`
     - `main.bicep`
     - An `app` resources directory organized by functionality
     - A `core` reference library that contains the Bicep modules used by the `azd` template
   - Deploys the code using `azd deploy`

   #### Expected output
   
   ```azdeveloper
   Initializing a new project (azd init)
   
   
   Provisioning Azure resources (azd provision)
   Provisioning Azure resources can take some time
   
     You can view detailed progress in the Azure Portal:
     https://portal.azure.com/#blade/HubsExtension/DeploymentDetailsBlade/overview
   
     (✓) Done: Resource group: resource-group-name
     (✓) Done: Log Analytics workspace: log-analytics-name
     (✓) Done: Application Insights: app-insights-name
     (✓) Done: Portal dashboard: dashboard-name
     (✓) Done: Azure Database for PostgreSQL flexible server: postgres-server
     (✓) Done: Key vault: key-vault-name
     (✓) Done: Container Apps Environment: container-apps-env-name
     (✓) Done: Container App: container-app-name
   
   
   Deploying services (azd deploy)
   
     (✓) Done: Deploying service api
     - Endpoint: https://your-container-app-endpoint.region.azurecontainerapps.io/
   
   SUCCESS: Your Azure app has been deployed!
   You can view the resources created under the resource group resource-group-name in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/your-subscription-ID/resourceGroups/your-resource-group/overview
   ```

### Confirm successful deployment 

In the Azure portal, verify the batch container app is logging each insert into Azure PostgreSQL every 10 seconds. 

1. Copy the Container App name from the terminal output.

1. Sign in to the [Azure portal](https://portal.azure.com) and search for the Container App resource by name.

1. In the Container App dashboard, select **Monitoring** > **Log stream**.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-menu.png" alt-text="Screenshot of the navigating to the log streams from the Azure Container Apps side menu.":::

1. Confirm the container is logging the same output as in the terminal earlier.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-portal-view.png" alt-text="Screenshot of the container app's log stream in the Azure portal.":::

## What happened?

Upon successful completion of the `azd up` command:

- Azure Developer CLI provisioned the Azure resources referenced in the [sample project's `./infra` directory](https://github.com/Azure-Samples/bindings-dapr-nodejs-cron-postgres-/tree/master/infra) to the Azure subscription you specified. You can now view those Azure resources via the Azure portal.
- The app deployed to Azure Container Apps. From the portal, you can browse the fully functional app.
::: zone-end

::: zone pivot="csharp"

## Run the .NET application locally

### Prepare the project

1. Clone the [sample Dapr application](https://github.com/Azure-Samples/bindings-dapr-csharp-cron-postgres) to your local machine.

   ```bash
   git clone https://github.com/Azure-Samples/bindings-dapr-csharp-cron-postgres.git
   ```

1. Navigate into the sample's root directory.

   ```bash
   cd bindings-dapr-csharp-cron-postgres
   ```

### Run the Dapr application using the Dapr CLI

Before deploying the application to Azure Container Apps, start by running the PostgreSQL container and .NET service locally with [Docker Compose](https://docs.docker.com/compose/) and Dapr.

1. From the sample's root directory, change directories to `db`.

   ```bash
   cd db
   ```
1. Run the PostgreSQL container with Docker Compose.

   ```bash
   docker compose up -d
   ```

1. Open a new terminal window and navigate into `/batch` in the sample directory.

   ```bash
   cd bindings-dapr-csharp-cron-postgres/batch
   ```

1. Install the dependencies.

   ```bash
   dotnet build
   ```

1. Run the .NET service application with Dapr.

   ```bash
   dapr run --app-id batch-sdk --app-port 7002 --resources-path ../components -- dotnet run
   ```

   The `dapr run` command runs the Dapr binding application locally. Once the application is running successfully, the terminal window shows the output binding data.

   #### Expected output
   
   The batch service listens to input binding events from a system CRON and then outputs the contents of local data to a PostgreSQL output binding.
   
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

1. In the `./db` terminal, stop the PostgreSQL container.

   ```bash
   docker compose stop
   ```

## Deploy the Dapr application template using Azure Developer CLI

Now that you've run the application locally, let's deploy the Dapr bindings application to Azure Container Apps using [`azd`](/azure/developer/azure-developer-cli/overview). During deployment, we will swap the local containerized PostgreSQL for an Azure PostgreSQL component.

### Prepare the project

Navigate into the [sample's](https://github.com/Azure-Samples/bindings-dapr-csharp-cron-postgres) root directory.

```bash
cd bindings-dapr-csharp-cron-postgres
```

### Provision and deploy using Azure Developer CLI

1. Run `azd init` to initialize the project.

   ```azdeveloper
   azd init
   ```

1. When prompted in the terminal, provide the following parameters.

   | Parameter | Description |
   | --------- | ----------- |
   | Environment Name | Prefix for the resource group created to hold all Azure resources. |
   | Azure Location  | The Azure location for your resources. [Make sure you select a location available for Azure PostgreSQL](../postgresql/flexible-server/overview.md#azure-regions). |
   | Azure Subscription | The Azure subscription for your resources. |

1. Run `azd up` to provision the infrastructure and deploy the Dapr application to Azure Container Apps in a single command.

   ```azdeveloper
   azd up
   ```

   This process may take some time to complete. As the `azd up` command completes, the CLI output displays two Azure portal links to monitor the deployment progress. The output also demonstrates how `azd up`:

   - Creates and configures all necessary Azure resources via the provided Bicep files in the `./infra` directory using `azd provision`. Once provisioned by Azure Developer CLI, you can access these resources via the Azure portal. The files that provision the Azure resources include:
     - `main.parameters.json`
     - `main.bicep`
     - An `app` resources directory organized by functionality
     - A `core` reference library that contains the Bicep modules used by the `azd` template
   - Deploys the code using `azd deploy`

   #### Expected output
   
   ```azdeveloper
   Initializing a new project (azd init)
   
   
   Provisioning Azure resources (azd provision)
   Provisioning Azure resources can take some time
   
     You can view detailed progress in the Azure Portal:
     https://portal.azure.com/#blade/HubsExtension/DeploymentDetailsBlade/overview
   
     (✓) Done: Resource group: resource-group-name
     (✓) Done: Log Analytics workspace: log-analytics-name
     (✓) Done: Application Insights: app-insights-name
     (✓) Done: Portal dashboard: dashboard-name
     (✓) Done: Azure Database for PostgreSQL flexible server: postgres-server
     (✓) Done: Key vault: key-vault-name
     (✓) Done: Container Apps Environment: container-apps-env-name
     (✓) Done: Container App: container-app-name
   
   
   Deploying services (azd deploy)
   
     (✓) Done: Deploying service api
     - Endpoint: https://your-container-app-endpoint.region.azurecontainerapps.io/
   
   SUCCESS: Your Azure app has been deployed!
   You can view the resources created under the resource group resource-group-name in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/your-subscription-ID/resourceGroups/your-resource-group/overview
   ```

### Confirm successful deployment 

In the Azure portal, verify the batch container app is logging each insert into Azure PostgreSQL every 10 seconds. 

1. Copy the Container App name from the terminal output.

1. Sign in to the [Azure portal](https://portal.azure.com) and search for the Container App resource by name.

1. In the Container App dashboard, select **Monitoring** > **Log stream**.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-menu.png" alt-text="Screenshot of the navigating to the log streams from the Azure Container Apps side menu.":::

1. Confirm the container is logging the same output as in the terminal earlier.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-portal-view.png" alt-text="Screenshot of the container app's log stream in the Azure portal.":::

## What happened?

Upon successful completion of the `azd up` command:

- Azure Developer CLI provisioned the Azure resources referenced in the [sample project's `./infra` directory](https://github.com/Azure-Samples/bindings-dapr-nodejs-cron-postgres-/tree/master/infra) to the Azure subscription you specified. You can now view those Azure resources via the Azure portal.
- The app deployed to Azure Container Apps. From the portal, you can browse the fully functional app.

::: zone-end



## Clean up resources

If you're not going to continue to use this application, delete the Azure resources you've provisioned with the following command.

```azdeveloper
azd down
```

## Next steps

- Learn more about [deploying Dapr applications to Azure Container Apps](./microservices-dapr.md).
- [Enable token authentication for Dapr requests.](./dapr-authentication-token.md)
- Learn more about [Azure Developer CLI](/azure/developer/azure-developer-cli/overview) and [making your applications compatible with `azd`](/azure/developer/azure-developer-cli/make-azd-compatible).
- [Scale your Dapr applications using KEDA scalers](./dapr-keda-scaling.md)
