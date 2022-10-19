---
title: "Tutorial: Deploy a Dapr application to Azure Container Apps using Azure Developer CLI (preview)"
description: Learn how to deploy a sample Dapr application to Azure Container Apps using the developer-friendly Azure Developer CLI (azd).
author: hhunter-ms
ms.author: hannahhunter
ms.service: container-apps
ms.topic: tutorial
ms.custom: mvc
ms.date: 10/18/2022
---

# Tutorial: Deploy a Dapr application to Azure Container Apps using Azure Developer CLI (preview) 

[Dapr](https://dapr.io/) (Distributed Application Runtime) is a runtime that helps you build resilient stateless and stateful microservices. In this tutorial, a sample Dapr bindings API microservice is deployed to Azure Container Apps via the [Azure Developer CLI (`azd`)](/developer/azure-developer-cli/overview.md). The service listens to input binding events from a system CRON and then outputs the contents of local data to a PostgreSql output binding.

> ![NOTE]
> The Azure Developer CLI (`azd`) is currently in preview. Preview features are available on a self-service, opt-in basis. Previews are provided "as is" and "as available," and they're excluded from the service-level agreements and limited warranty. The `azd` previews are partially covered by customer support on a best-effort basis.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create a microservice that uses the Dapr bindings API.
> - Deploy the Dapr application to Azure Container Apps using `azd up`.

## Prerequisites

- Install [Azure Developer CLI](/developer/azure-developer-cli/install-azd.md)
- [Install](https://docs.dapr.io/getting-started/install-dapr-cli/) and [init](https://docs.dapr.io/getting-started/install-dapr-selfhost/) Dapr
- Install [Git](https://git-scm.com/downloads)

## Set up

1. Clone the [sample Dapr application](https://github.com/greenie-msft/bindings-dapr-nodejs-cron-postgres.git) to your local machine.

   ```bash
   git clone https://github.com/greenie-msft/bindings-dapr-nodejs-cron-postgres.git
   ```

1. Navigate into the sample's root directory.

   ```bash
   cd bindings-dapr-nodejs-cron-postgres
   ```

## Run and develop the Dapr application locally

Start by running the PostgreSQL container and JavaScript service with [Docker Compose](https://docs.docker.com/compose/) and Dapr.

1. From the sample's root directory, change directories to `db`.

   ```bash
   cd db
   ```
1. Run the container with Docker Compose.

   ```bash
   docker compose up -d
   ```

1. Open a new terminal window and navigate into `/batch` in the sample directory.

   ```bash
   cd bindings-dapr-nodejs-cron-postgres/batch
   ```

1. Update `npm`:

   ```bash
   npm install
   ```

1. Run the JavaScript service application with Dapr.

   ```bash
   dapr run --app-id batch-sdk --app-port 5002 --dapr-http-port 3500 --components-path ../components -- node index.js
   ```

   **Expected output**
   
   A batch script runs every 10 seconds using an input Cron binding. The script processes a JSON file and outputs data to a SQL database using the PostgreSQL Dapr binding.
   
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

1. In the `./db` terminal, stop the PostgreSQL container:

   ```bash
   docker compose stop
   ```

## Deploy the Dapr application to Azure Container Apps

Deploy the Dapr bindings application to Azure Container Apps and Azure Postgres using [Azure Developer CLI](/developer/azure-developer-cli/overview.md)

1. Navigate to the sample's root directory.

1. Set the environment variable for Postgres password. Make sure the password is long enough with unique alphabetical and numeral characters.

   ```azdeveloper
   azd env set POSTGRES_PASSWORD <password>
   ```

1. Provision the Bicep infrastructure and deploy the Dapr application to Azure Container Apps

   ```azdeveloper
   azd up
   ```

## Confirm successful deployment 

In the Azure portal, verify the batch Postgres container is logging each insert successfully every 10 seconds. 

1. In the terminal, copy the Container App name.

   ```azdeveloper
   Infrastructure provisioning plan completed successfully
   Provisioning Azure resources can take some time.
   
   You can view detailed progress in the Azure Portal:
   https://portal.azure.com/
   
   Created Resource group: <resource-group>
   Created Application Insights: <app-insights-resource>
   Created Portal dashboard: <azure-portal-dashboard>
   Created Log Analytics workspace: <log-analytics-workspace>
   Created Container Apps Environment: <container-apps-environment>
   Created Container App: <container-app-name>
   
   Azure resource provisioning completed successfully
   
   Deploying service batch...
   
   Infrastructure provisioning plan completed successfully
   Provisioning Azure resources can take some time.
   
   You can view detailed progress in the Azure Portal:
   https://portal.azure.com/
   
   Created Application Insights: <app-insights-resource>
   Created Container App: <container-app-name>
   ```

1. Navigate to the [Azure portal](https://ms.portal.azure.com) and search for the Container App resource by name.

1. In the Container App dashboard, select **Monitoring** > **Log stream**.

1. Confirm the container is logging the same output as in the terminal earlier.

   :::image type="content" source="media/tutorial-deploy-dapr/log-streams-portal-view.png" alt-text="Screenshot of the container app's log stream in the Azure portal.":::


## Clean up resources

If you're not going to continue to use this application, delete the Azure resources you've provisioned with the following command:

```azdeveloper
azd down
```

## Next steps

- Learn more about [deploying Dapr applications to Azure Container Apps](./microservices-dapr.md).
- Learn more about [Azure Developer CLI](/developer/azure-developer-cli/overview.md) and [making your applications compatible with `azd`](/developer/azure-developer-cli/make-azd-compatible.md).