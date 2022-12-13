---
title: "Deploy a Dapr application to Azure Container Apps using Azure Developer CLI (preview)"
description: Learn how to deploy a sample Dapr application to Azure Container Apps using the developer-friendly Azure Developer CLI (azd).
author: hhunter-ms
ms.author: hannahhunter
ms.service: container-apps
ms.topic: how-to
ms.date: 12/08/2022
---

# Deploy a Dapr application to Azure Container Apps using Azure Developer CLI (preview) 

[Dapr](https://dapr.io/) (Distributed Application Runtime) is a runtime that helps you build resilient stateless and stateful microservices. While you can deploy and manage the Dapr OSS project yourself, deploying your Dapr applications to the Container Apps platform:

- Provides a managed and supported Dapr integration
- Seamlessly updates Dapr versions
- Exposes a simplified Dapr interaction model to increase developer productivity

To simplify this process even further, you can deploy a Dapr application using the developer-focused [Azure Developer CLI (`azd`)](/developer/azure-developer-cli/overview.md).
In this guide, you:
> [!div class="checklist"]
> * Deploy a Dapr bindings API microservice application locally using the Dapr CLI. 
> * Redeploy the same application using `azd up` to Azure Container Apps via the Azure Developer CLI. 
> * Explore how `azd` works with the Dapr application template with just one command.

The Dapr service you deploy:
1. Listens to input binding events from a system CRON (a standard UNIX utility used to schedule commands for automatic execution at specific intervals). 
1. Outputs the contents of local data to a [PostgreSQL](https://www.postgresql.org/) output binding.  

:::image type="content" source="media/microservices-dapr-azd/bindings-application.png" alt-text="Diagram of the Dapr binding application.":::

> [!NOTE]
> The Azure Developer CLI (`azd`) is currently in preview. Preview features are available on a self-service, opt-in basis. Previews are provided "as is" and "as available," and they're excluded from the service-level agreements and limited warranty. The `azd` previews are partially covered by customer support on a best-effort basis.

## Prerequisites

- Install [Azure Developer CLI](/developer/azure-developer-cli/install-azd.md)
- [Install](https://docs.dapr.io/getting-started/install-dapr-cli/) and [init](https://docs.dapr.io/getting-started/install-dapr-selfhost/) Dapr
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Install [Git](https://git-scm.com/downloads)

## Deploy a Dapr application locally

### Prepare the project

1. Clone the [sample Dapr application](https://github.com/greenie-msft/bindings-dapr-nodejs-cron-postgres.git) to your local machine.

   ```bash
   git clone https://github.com/greenie-msft/bindings-dapr-nodejs-cron-postgres.git
   ```

1. Navigate into the sample's root directory.

   ```bash
   cd bindings-dapr-nodejs-cron-postgres
   ```

### Run the Dapr application using the Dapr CLI

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

   The `dapr run` command kicks off the local deployment of the Dapr binding application. Upon successful deployment, the terminal window will show the output binding data.

   **Expected output:**
   
   A batch script runs every 10 seconds using an input CRON binding. The script processes a JSON file and outputs data to a SQL database using the PostgreSQL Dapr binding.
   
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

## Deploy the Dapr application template using `azd`

Deploy the Dapr bindings application to Azure Container Apps and Azure Postgres using [`azd`](/developer/azure-developer-cli/overview.md).

### Prepare the project

1. Clone the [sample Dapr application](https://github.com/greenie-msft/bindings-dapr-nodejs-cron-postgres.git) to your local machine.

   ```bash
   git clone https://github.com/greenie-msft/bindings-dapr-nodejs-cron-postgres.git
   ```

1. Navigate into the sample's root directory.

   ```bash
   cd bindings-dapr-nodejs-cron-postgres
   ```

### Run using Azure Developer CLI

1. Set the environment variable for Postgres password. Make sure the password is long enough with unique alphabetical and numeral characters.

   ```azdeveloper
   azd env set POSTGRES_PASSWORD <PASSWORD>
   ```

1. If you don't already have an `azd` environment already set up, you'll be prompted to supply and select the appropriate values for your environment. The environment name you create is used for an Azure resource group during deployment.

   | Parameter | Description |
   | --------- | ----------- |
   | `Environment Name` | Prefix for the resource group that will be created to hold all Azure resources. For more informaiton, refer to [What is an Environment Name in `azd`?](/developer/azure-developer-cli/faq.yml#what-is-an-environment-name) |
   | `Azure Location`   | The Azure location where your resources are deployed. |
   | `Azure Subscription` | The Azure Subscription where your resources are deployed. |


1. Provision the Bicep infrastructure and deploy the Dapr application to Azure Container Apps:

   ```azdeveloper
   azd up
   ```

   This process may take some time to complete, as the `azd up` command:

   - Initializes your project (azd init)
   - Creates and configures all necessary Azure resources (azd provision), including:
     - Access policies and roles for your account
     - Service-to-service communication with Managed Identities
   - Deploys the code (azd deploy)
   
   As the `azd up` command completes, the CLI output displays two Azure portal links to monitor the deployment progress.

   **Expected output:**
   
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

### Confirm successful deployment 

In the Azure portal, verify the batch Postgres container is logging each insert successfully every 10 seconds. 

1. Copy the Container App name from the terminal output.

1. Navigate to the [Azure portal](https://ms.portal.azure.com) and search for the Container App resource by name.

1. In the Container App dashboard, select **Monitoring** > **Log stream**.

1. Confirm the container is logging the same output as in the terminal earlier.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-portal-view.png" alt-text="Screenshot of the container app's log stream in the Azure portal.":::

## What happened?

Upon successful completion of the `azd up` command:

- The Dapr bindings application was initialized.
- The Azure resources referenced in the [sample project's `./infra` directory](https://github.com/greenie-msft/bindings-dapr-nodejs-cron-postgres/tree/master/infra) have been provisioned to the Azure subscription you specified. You can now view those Azure resources via the Azure portal.
- The app has been built and deployed to Azure Container Apps. Using the web app URL output from the `azd up` command, you can browse to the fully functional app.

### How to make your Dapr container app `azd`-compatible

While [Microsoft provides several templates to get started deploying with `azd`](/developer/azure-developer-cli/azd-templates.md), you can make your own Dapr application `azd`-compatible. Learn more about [how to `azd`-ify your application](/developer/azure-developer-cli/make-azd-compatible.md). 

To make [the above Dapr application](https://github.com/greenie-msft/bindings-dapr-nodejs-cron-postgres) `azd`-compatible, it required the following components:

- Application code (JavaScript application and Dapr input and output binding components)
- Infra-as-code (in this case, Bicep) needed to provision Azure resources, including monitoring and CI/CD
- An `azure.yaml` file that describes your application

The following diagram gives a quick overview of the creation process of an `azd` template:

:::image type="content" source="media/microservices-dapr-azd/azd-workflow.png" alt-text="Diagram of the Azure Developer CLI template workflow.":::

The next section explains the key parts of the `azd` template that help deploy the Dapr application.

#### Infra-as-code

Locate the Bicep files for the Dapr application in the `./infra` directory:

```bash
cd bindings-dapr-nodejs-cron-postgres/infra
```

The `./infra` directory contains the following files and directories:

- `main.parameters.json`
- `main.bicep`
- An `app` resources directory organized by functionality
- A `core` reference library that contains the Bicep modules used by the `azd` template

##### `main.parameters.json`

The `main.parameters.json` file contains environment variables you provided as parameters in the CLI.  

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "name": {
            "value": "${AZURE_ENV_NAME}"
        },
        "location": {
            "value": "${AZURE_LOCATION}"
        },
        "postgresPassword": {
            "value": "${POSTGRES_PASSWORD}"
        }
    }
}
```

##### `main.bicep`

The `main.bicep` file contains:

- The password, location, and name parameters included in `main.parameters.json`:
- The Bicep files used, like:
  - `app/batch-service.bicep`: the Dapr application listening to the Cron input binding
  - `app/paas-application.bicep`: Azure resources like a Resource Group containing Log Analytics, App Insights, a Container Apps Environment, and the Container App
  - `app/dapr-state-postgres.bicep`: the Dapr application's PostgreSQL output binding

```bicep
targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the the environment which is used to generate a short unqiue hash used in all resources.')
param name string

param postgresLogin string = 'testdeveloper'

@secure()
param postgresPassword string

@minLength(1)
@description('Primary location for all resources')
param location string

resource resourceGroup 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: '${name}-rg'
  location: location
}

var resourceToken = toLower(uniqueString(subscription().id, name, location))

module application 'app/paas-application.bicep' = {
  name: 'bindings-dapr-aca-paas-${resourceToken}'
  params: {
    name: name
    location: location
    postgresUser: postgresLogin
    postgresPassword: postgresPassword
  }
  scope: resourceGroup
  dependsOn:[
    binding
  ]
}

module batchContainerApp 'app/batch-service.bicep' = {
  name: 'ca-batch-${resourceToken}'
  params:{
    name: name
    location: location
  }
  scope: resourceGroup
  dependsOn:[
    application
  ]
}

module binding 'app/dapr-state-postgres.bicep' = {
  name: 'bindings-pg-orders-${resourceToken}'
  params: {
    name: name
    location: location
    postgresUser: postgresLogin
    postgresPassword: postgresPassword
  }
  scope: resourceGroup
}

output APPINSIGHTS_INSTRUMENTATIONKEY string = application.outputs.APPINSIGHTS_INSTRUMENTATIONKEY
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = application.outputs.CONTAINER_REGISTRY_ENDPOINT
output AZURE_CONTAINER_REGISTRY_NAME string = application.outputs.CONTAINER_REGISTRY_NAME
output APP_CHECKOUT_BASE_URL string = batchContainerApp.outputs.CONTAINERAPP_URI
output APP_APPINSIGHTS_INSTRUMENTATIONKEY string = application.outputs.APPINSIGHTS_INSTRUMENTATIONKEY
output POSTGRES_USER string = binding.outputs.POSTGRES_USER
```



#### `azure.yaml`

The `azure.yaml` file included in the `azd` template lives in the root of the project directory and ties together all of the services.

```yaml
name: bindings-dapr-node-postgres-aca
metadata:
  template: bindings-dapr-node-postgres-aca@0.0.1-beta
services:
  batch:
    project: batch
    language: js
    host: containerapp
    module: app/batch-service
```

## Clean up resources

If you're not going to continue to use this application, delete the Azure resources you've provisioned with the following command:

```azdeveloper
azd down
```

`azd down` tears down the entire application, including the resource group and all the provisioned Azure resources.

## Next steps

- Learn more about [deploying Dapr applications to Azure Container Apps](./microservices-dapr.md).
- Learn more about [Azure Developer CLI](/developer/azure-developer-cli/overview.md) and [making your applications compatible with `azd`](/developer/azure-developer-cli/make-azd-compatible.md).