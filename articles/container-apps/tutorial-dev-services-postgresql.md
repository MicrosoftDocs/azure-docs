---
title: 'Tutorial: Create and use a PostgreSQL service for development'
description: Create and use a PostgreSQL service for development
services: container-apps
author: ahmelsayed
ms.service: container-apps
ms.custom: devx-track-azurecli
ms.topic: tutorial
ms.date: 06/06/2023
ms.author: ahmels
---

# Tutorial: Use a PostgreSQL service for development

Azure Container Apps allows you to connect to development and production-grade services to provide a wide variety of functionality to your applications.

In this tutorial, you learn to use a development PostgreSQL service with Container Apps.

Azure CLI commands and Bicep template fragments are featured in this tutorial. If you use Bicep, you can add all the fragments to a single Bicep file and [deploy the template all at once](#deploy-all-resources).

> [!div class="checklist"]
> * Create a Container Apps environment to deploy your service and container apps
> * Create a PostgreSQL service
> * Create and use a command line app to use the dev PostgreSQL service
> * Create a *pgweb* app
> * Write data to the PostgreSQL database

## Prerequisites

- Install the [Azure CLI](/cli/azure/install-azure-cli).
- Optional: [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) for following AZD instructions.

> [!NOTE]
> For a one command deployment, skip to the last `azd` [template step](#azure-developer-cli).

## Setup

1. Define variables for common values.

    # [Bash](#tab/bash)

    ```bash
    RESOURCE_GROUP="postgres-dev"
    LOCATION="northcentralus"
    ENVIRONMENT="aca-env"
    PG_SVC="postgres01"
    PSQL_CLI_APP="psql-cloud-cli-app"
    ```

    # [Bicep](#tab/bicep)

    The following variables allow you to use the CLI to deploy the Bicep template.

    ```bash
    RESOURCE_GROUP="postgres-dev"
    LOCATION="northcentralus"
    ```

    For Bicep, start by creating a file called `postgres-dev.bicep`, then add parameters with the following default values.

    ```bicep
    targetScope = 'resourceGroup'
    param location string = resourceGroup().location
    param appEnvironmentName string = 'aca-env'
    param pgSvcName string = 'postgres01'
    param pgsqlCliAppName string = 'psql-cloud-cli-app'
    ```

    As you deploy the bicep template at any stage, you can use the `az deployment group create` command.

    ```bash
    az deployment group create -g $RESOURCE_GROUP \
        --query 'properties.outputs.*.value' \
        --template-file postgres-dev.bicep
    ```

    # [azd](#tab/azd)

    Define your initial variables.

    ```bash
    AZURE_ENV_NAME="azd-postgres-dev"
    LOCATION="northcentralus"
    ```

    Use the values to initialize a minimal `azd` template.

    ```bash
    azd init \
        --environment "$AZURE_ENV_NAME" \
        --location "$LOCATION" \
        --no-prompt
    ```

    > [!NOTE]
    > `AZURE_ENV_NAME` is different from the Container App environment name. In this context, `AZURE_ENV_NAME` in `azd` is for all resources in a template. These resources include resources not associated with Container Apps. You create a different name for the Container Apps environment.

    Next, create `infra/main.bicep` and define parameters for later use.

    ```bicep
    param appEnvironmentName string = 'aca-env'
    param pgSvcName string = 'postgres01'
    param pgsqlCliAppName string = 'psql-cloud-cli-app'
    ```

    ---

1. Log in to Azure.

    ```bash
    az login
    ```

1. Upgrade the CLI to the latest version.

    ```bash
    az upgrade
    ```

1. Upgrade Bicep to the latest version.

    ```bash
    az bicep upgrade
    ```

1. Add th `containerapp` extension.

    ```bash
    az extension add --name containerapp --upgrade
    ```

1. Register required namespaces.

    ```bash
    az provider register --namespace Microsoft.App
    ```

    ```bash
    az provider register --namespace Microsoft.OperationalInsights
    ```

## Create a Container Apps environment

1. Create a resource group.

    # [Bash](#tab/bash)

    ```bash
    az group create \
        --name "$RESOURCE_GROUP" \
        --location "$LOCATION"
    ```

    # [Bicep](#tab/bicep)

    ```bash
    az group create \
        --name "$RESOURCE_GROUP" \
        --location "$LOCATION"
    ```

    As you deploy the bicep template at any stage, you can use the `az deployment group create` command.

    ```bash
    az deployment group create -g $RESOURCE_GROUP \
        --query 'properties.outputs.*.value' \
        --template-file postgres-dev.bicep
    ```

    # [azd](#tab/azd)

    No special setup is needed for managing resource groups in `azd`. The `azd` command gets the resource group from the `AZURE_ENV_NAME`/`--environment` value.

    You can test the minimal template with the `up` command.

    ```bash
    azd up
    ```

    Running this command creates an empty resource group.

    ---

1. Create a Container Apps environment.

    # [Bash](#tab/bash)

    ```bash
    az containerapp env create \
      --name "$ENVIRONMENT" \
      --resource-group "$RESOURCE_GROUP" \
      --location "$LOCATION"
    ```

    # [Bicep](#tab/bicep)

    Add the following values to your `postgres-dev.bicep` file.

    ```bicep
    resource appEnvironment 'Microsoft.App/managedEnvironments@2023-04-01-preview' = {
      name: appEnvironmentName
      location: location
      properties: {
        appLogsConfiguration: {
          destination: 'azure-monitor'
        }
      }
    }
    ```

    The Azure CLI automatically creates a Log Analytics workspace for each environment. To generate a workspace using a Bicep template, you explicitly declare the environment and link to it in the template. This step makes your deployment more stable, even if at the cost of being a little verbose.

    Add the following values to your environment.

    ```bicep
    resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
      name: '${appEnvironmentName}-log-analytics'
      location: location
      properties: {
        sku: {
          name: 'PerGB2018'
        }
      }
    }
    
    resource appEnvironment 'Microsoft.App/managedEnvironments@2023-04-01-preview' = {
      name: appEnvironmentName
      location: location
      properties: {
        appLogsConfiguration: {
          destination: 'log-analytics'
          logAnalyticsConfiguration: {
            customerId: logAnalytics.properties.customerId
            sharedKey: logAnalytics.listKeys().primarySharedKey
          }
        }
      }
    }
    ```

    # [azd](#tab/azd)

    The templates used by `azd` use [bicep modules](/azure/azure-resource-manager/bicep/modules).

    Create a folder named `./infra/core/host`, then create a `./infra/core/host/container-apps-environment.bicep` module with the following content.

    ```bicep
    param name string
    param location string = resourceGroup().location
    param tags object = {}
    
    resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
      name: '${name}-log-analytics'
      location: location
      tags: tags
      properties: {
        sku: {
          name: 'PerGB2018'
        }
      }
    }
    
    resource appEnvironment 'Microsoft.App/managedEnvironments@2023-04-01-preview' = {
      name: name
      location: location
      tags: tags
      properties: {
        appLogsConfiguration: {
          destination: 'log-analytics'
          logAnalyticsConfiguration: {
            customerId: logAnalytics.properties.customerId
            sharedKey: logAnalytics.listKeys().primarySharedKey
          }
        }
      }
    }

    output appEnvironmentId string = appEnvironment.id
    ```

    In the `./infra/main.bicep` file, load the module using the following values.

    ```bicep
    module appEnvironment './core/host/container-apps-environment.bicep' = {
      name: 'appEnvironment'
      scope: rg
      params: {
        name: appEnvironmentName
        location: location
        tags: tags
      }
    }
    ```

    Run `azd up` to deploy the template.

    ---

## Create a PostgreSQL service

1. Create a PostgreSQL service.

    # [Bash](#tab/bash)

    ```bash
    az containerapp service postgres create \
        --name "$PG_SVC" \
        --resource-group "$RESOURCE_GROUP" \
        --environment "$ENVIRONMENT"
    ```

    # [Bicep](#tab/bicep)

    Add the following values to `postgres-dev.bicep`.

    ```bicep
    resource postgres 'Microsoft.App/containerApps@2023-04-01-preview' = {
    name: pgSvcName
      location: location
      properties: {
        environmentId: appEnvironment.id
        configuration: {
          service: {
              type: 'postgres'
          }
        }
      }
    }

    output postgresLogs string = 'az containerapp logs show -n ${postgres.name} -g ${resourceGroup().name} --follow --tail 30'
    ```

    To deploy the bicep template, run `az deployment group create`.

    ```bash
    az deployment group create -g $RESOURCE_GROUP \
        --query 'properties.outputs.*.value' \
        --template-file postgres-dev.bicep
    ```

    The output `postgresLogs` command outputs a CLI command you can run to view PostgreSQL logs after deployment.

    You can run the command to view the initialization logs of the new postgres service.

    # [azd](#tab/azd)

    Create a `./infra/core/host/container-app-service.bicep` module file with the following content.

    ```bicep
    param name string
    param location string = resourceGroup().location
    param tags object = {}
    param environmentId string
    param serviceType string
    
    
    resource service 'Microsoft.App/containerApps@2023-04-01-preview' = {
      name: name
      location: location
      tags: tags
      properties: {
        environmentId: environmentId
        configuration: {
          service: {
              type: serviceType
          }
        }
      }
    }
    
    output serviceId string = service.id
    ```

    Next, update the `./infra/main.bicep` module file with the following declaration.

    ```bicep
    module postgres './core/host/container-app-service.bicep' = {
      name: 'postgres'
      scope: rg
      params: {
        name: pgSvcName
        location: location
        tags: tags
        environmentId: appEnvironment.outputs.appEnvironmentId
        serviceType: 'postgres'
      }
    }
    ```

    Then deploy the template using `azd up`.

    ```bash
    `azd up`
    ```

    ---

1. View log output from the Postgres instance

    # [Bash](#tab/bash)

    Use the `logs` command to view log messages.

    ```bash
    az containerapp logs show \
        --name $PG_SVC \
        --resource-group $RESOURCE_GROUP \
        --follow --tail 30
    ```

    # [Bicep](#tab/bicep)

    The previous bicep example includes an output for the command to view the logs.

    For example:

    ```bash
    [
      "az containerapp logs show -n postgres01 -g postgres-dev --follow --tail 30"
    ]
    ```

    If you don't have the command, you can use the service name to view the logs using the CLI.

    ```bash
    az containerapp logs show \
        --name $PG_SVC \
        --resource-group $RESOURCE_GROUP \
        --follow --tail 30
    ```

    # [azd](#tab/azd)

    use the logs command to view the logs

    ```bash
    az containerapp logs show \
        --name postgres01 \
        --resource-group $RESOURCE_GROUP \
        --follow --tail 30
    ```

    ---

    :::image type="content" source="media/tutorial-dev-services-postgresql/azure-container-apps-postgresql-service-logs.png" alt-text="Screenshot of container app PostgreSQL service logs.":::

## Create an app to test the service

When you creat the app, you begin by creating a debug app to use the `psql` CLI to connect to the PostgreSQL instance.

1. Create a `psql` app that binds to the PostgreSQL service.

    # [Bash](#tab/bash)

    ```bash
    az containerapp create \
        --name "$PSQL_CLI_APP" \
        --image mcr.microsoft.com/k8se/services/postgres:14 \
        --bind "$PG_SVC" \
        --environment "$ENVIRONMENT" \
        --resource-group "$RESOURCE_GROUP" \
        --min-replicas 1 \
        --max-replicas 1 \
        --command "/bin/sleep" "infinity"
    ```

    # [Bicep](#tab/bicep)

    Add the following values to `postgres-dev.bicep`.

    ```bicep
    resource pgsqlCli 'Microsoft.App/containerApps@2023-04-01-preview' = {
      name: pgsqlCliAppName
      location: location
      properties: {
        environmentId: appEnvironment.id
        template: {
          serviceBinds: [
            {
              serviceId: postgres.id
            }
          ]
          containers: [
            {
              name: 'psql'
              image: 'mcr.microsoft.com/k8se/services/postgres:14'
              command: [ '/bin/sleep', 'infinity' ]
            }
          ]
          scale: {
            minReplicas: 1
            maxReplicas: 1
          }
        }
      }
    }

    output pgsqlCliExec string = 'az containerapp exec -n ${pgsqlCli.name} -g ${resourceGroup().name} --revision ${pgsqlCli.properties.latestRevisionName} --command /bin/bash'
    ```

    > [!TIP]
    > The output `pgsqlCliExec` outputs a CLI command to exec into the test app after deployment.

    # [azd](#tab/azd)

    Create a module under `./infra/core/host/container-app.bicep` and add the following values.

    ```bicep
    param name string
    param location string = resourceGroup().location
    param tags object = {}
    
    param environmentId string
    param serviceId string = ''
    param containerName string
    param containerImage string
    param containerCommands array = []
    param containerArgs array = []
    param minReplicas int
    param maxReplicas int
    param targetPort int = 0
    param externalIngress bool = false
    
    resource app 'Microsoft.App/containerApps@2023-04-01-preview' = {
      name: name
      location: location
      tags: tags
      properties: {
        environmentId: environmentId
        configuration: {
          ingress: targetPort > 0 ? {
            targetPort: targetPort
            external: externalIngress
          } : null
        }
        template: {
          serviceBinds: !empty(serviceId) ? [
            {
              serviceId: serviceId
            }
          ] : null
          containers: [
            {
              name: containerName
              image: containerImage
              command: !empty(containerCommands) ? containerCommands : null
              args: !empty(containerArgs) ? containerArgs : null
            }
          ]
          scale: {
            minReplicas: minReplicas
            maxReplicas: maxReplicas
          }
        }
      }
    }
    ```

    Now, use the module in `./infra/main.bicep` by adding the following values.

    ```bicep
    module psqlCli './core/host/container-app.bicep' = {
      name: 'psqlCli'
      scope: rg
      params: {
        name: pgsqlCliAppName
        location: location
        tags: tags
        environmentId: appEnvironment.outputs.appEnvironmentId
        serviceId: postgres.outputs.serviceId
        containerImage: 'mcr.microsoft.com/k8se/services/postgres:14'
        containerName: 'psql'
        maxReplicas: 1
        minReplicas: 1
        containerCommands: [ '/bin/sleep', 'infinity' ]
      }
    }
    ```

    Deploy the template with `azd up`.

    ```bash
    azd up
    ```

    ---

1. Run the CLI `exec` command to connect to the test app.

    # [Bash](#tab/bash)

    ```bash
    az containerapp exec \
        --name $PSQL_CLI_APP \
        --resource-group $RESOURCE_GROUP \
        --command /bin/bash
    ```

    # [Bicep](#tab/bicep)

    The previous Bicep example includes output that shows you how to run the app.

    For example:

    ```bash
    [
      "az containerapp logs show -n postgres01 -g postgres-dev --follow --tail 30",
      "az containerapp exec -n psql-cloud-cli-app -g postgres-dev --command /bin/bash"
    ]
    ```

    If you don't have the command, you can use the app name to run the application using the `exec` command.

    ```bash
    az containerapp exec \
        --name $PSQL_CLI_APP \
        --resource-group $RESOURCE_GROUP \
        --command /bin/bash
    ```

    # [azd](#tab/azd)

    ```bash
    az containerapp exec \
        --name psql-cloud-cli-app \
        --resource-group $RESOURCE_GROUP \
        --command /bin/bash
    ```

    ---

    When you use `--bind` or `serviceBinds` on the test app, the connection information is injected into the application environment. Once you connect to the test container, you can inspect the values using the `env` command.

    ```bash
    env | grep "^POSTGRES_"

    POSTGRES_HOST=postgres01
    POSTGRES_PASSWORD=AiSf...
    POSTGRES_SSL=disable
    POSTGRES_URL=postgres://postgres:AiSf...@postgres01:5432/postgres?sslmode=disable
    POSTGRES_DATABASE=postgres
    POSTGRES_PORT=5432
    POSTGRES_USERNAME=postgres
    POSTGRES_CONNECTION_STRING=host=postgres01 database=postgres user=postgres password=AiSf...
    ```

1. Us `psql` to connect to the service

    ```bash
    psql $POSTGRES_URL
    ```

    :::image type="content" source="media/tutorial-dev-services-postgresql/azure-container-apps-postgresql-psql.png" alt-text="Screenshot of container app using pgsql to connect to a PostgreSQL service.":::

1. Create a table named `accounts` and insert data.

    ```sql
    postgres=# CREATE TABLE accounts (
        user_id serial PRIMARY KEY,
        username VARCHAR ( 50 ) UNIQUE NOT NULL,
        email VARCHAR ( 255 ) UNIQUE NOT NULL,
        created_on TIMESTAMP NOT NULL,
        last_login TIMESTAMP 
    );

    postgres=# INSERT INTO accounts (username, email, created_on)
    VALUES
    ('user1', 'user1@example.com', current_timestamp),
    ('user2', 'user2@example.com', current_timestamp),
    ('user3', 'user3@example.com', current_timestamp);

    postgres=# SELECT * FROM accounts;
    ```

    :::image type="content" source="media/tutorial-dev-services-postgresql/azure-container-apps-postgresql-psql-data.png" alt-text="Screenshot of container app using pgsql connect to PostgreSQL and create a table and seed some data.":::

## Using a dev service with an existing app

If you already have an app that uses PostgreSQL, you can change how connection information is loaded.

First, create the following environment variables.

```bash
POSTGRES_HOST=postgres01
POSTGRES_PASSWORD=AiSf...
POSTGRES_SSL=disable
POSTGRES_URL=postgres://postgres:AiSf...@postgres01:5432/postgres?sslmode=disable
POSTGRES_DATABASE=postgres
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_CONNECTION_STRING=host=postgres01 database=postgres user=postgres password=AiSf...
```

Using the CLI (or Bicep) you can update the app to add `--bind $PG_SVC` to use the dev service.

## Binding to the dev service

Deploy [pgweb](https://github.com/sosedoff/pgweb) to view and manage the PostgreSQL instance.

# [Bash](#tab/bash)

See Bicep or `azd` example.

# [Bicep](#tab/bicep)

```bicep
resource pgweb 'Microsoft.App/containerApps@2023-04-01-preview' = {
  name: 'pgweb'
  location: location
  properties: {
    environmentId: appEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8081
      }
    }
    template: {
      serviceBinds: [
        {
          serviceId: postgres.id
          name: 'postgres'
        }
      ]
      containers: [
        {
          name: 'pgweb'
          image: 'docker.io/sosedoff/pgweb:latest'
          command: [
            '/bin/sh'
          ]
          args: [
            '-c'
            'PGWEB_DATABASE_URL=$POSTGRES_URL /usr/bin/pgweb --bind=0.0.0.0 --listen=8081'
          ]
        }
      ]
    }
  }
}

output pgwebUrl string = 'https://${pgweb.properties.configuration.ingress.fqdn}'
```

Deploy the bicep template with the same command.

```bash
az deployment group create -g $RESOURCE_GROUP \
    --query 'properties.outputs.*.value' \
    --template-file postgres-dev.bicep
```

The Bicep command returns a URL. Copy this URL to your browser to visit the deployed site.

# [azd](#tab/azd)

Update `./infra/main.bicep` with the following values.

```bicep
module pgweb './core/host/container-app.bicep' = {
  name: 'pgweb'
  scope: rg
  params: {
    name: 'pgweb'
    location: location
    tags: tags
    environmentId: appEnvironment.outputs.appEnvironmentId
    serviceId: postgres.outputs.serviceId
    containerImage: 'docker.io/sosedoff/pgweb:latest'
    containerName: 'pgweb'
    maxReplicas: 1
    minReplicas: 1
    containerCommands: [ '/bin/sh' ]
    containerArgs: [ 
      '-c'
      'PGWEB_DATABASE_URL=$POSTGRES_URL /usr/bin/pgweb --bind=0.0.0.0 --listen=8081'
    ]
    targetPort: 8081
    externalIngress: true
  }
}
```

Deploy the template with `azd up`.

```bash
azd up
```

---

:::image type="content" source="media/tutorial-dev-services-postgresql/azure-container-apps-postgresql-pgweb.png" alt-text="Screenshot of pgweb Container App connecting to PostgreSQL service.":::

## Deploy all resources

Use the following examples to if you want to deploy all resources at once.

### Bicep

The following Bicep template contains all the resources in this tutorial.

You can create a `postgres-dev.bicep` file with this content.

```bicep
targetScope = 'resourceGroup'
param location string = resourceGroup().location
param appEnvironmentName string = 'aca-env'
param pgSvcName string = 'postgres01'
param pgsqlCliAppName string = 'psql-cloud-cli-app'

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: '${appEnvironmentName}-log-analytics'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
  }
}

resource appEnvironment 'Microsoft.App/managedEnvironments@2023-04-01-preview' = {
  name: appEnvironmentName
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

resource postgres 'Microsoft.App/containerApps@2023-04-01-preview' = {
name: pgSvcName
  location: location
  properties: {
    environmentId: appEnvironment.id
    configuration: {
      service: {
          type: 'postgres'
      }
    }
  }
}

resource pgsqlCli 'Microsoft.App/containerApps@2023-04-01-preview' = {
  name: pgsqlCliAppName
  location: location
  properties: {
    environmentId: appEnvironment.id
    template: {
      serviceBinds: [
        {
          serviceId: postgres.id
        }
      ]
      containers: [
        {
          name: 'psql'
          image: 'mcr.microsoft.com/k8se/services/postgres:14'
          command: [ '/bin/sleep', 'infinity' ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
    }
  }
}

resource pgweb 'Microsoft.App/containerApps@2023-04-01-preview' = {
  name: 'pgweb'
  location: location
  properties: {
    environmentId: appEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8081
      }
    }
    template: {
      serviceBinds: [
        {
          serviceId: postgres.id
          name: 'postgres'
        }
      ]
      containers: [
        {
          name: 'pgweb'
          image: 'docker.io/sosedoff/pgweb:latest'
          command: [
            '/bin/sh'
          ]
          args: [
            '-c'
            'PGWEB_DATABASE_URL=$POSTGRES_URL /usr/bin/pgweb --bind=0.0.0.0 --listen=8081'
          ]
        }
      ]
    }
  }
}

output pgsqlCliExec string = 'az containerapp exec -n ${pgsqlCli.name} -g ${resourceGroup().name} --revision ${pgsqlCli.properties.latestRevisionName} --command /bin/bash'

output postgresLogs string = 'az containerapp logs show -n ${postgres.name} -g ${resourceGroup().name} --follow --tail 30'

output pgwebUrl string = 'https://${pgweb.properties.configuration.ingress.fqdn}'
```

Use the Azure CLI to deploy it the template.

```bash
RESOURCE_GROUP="postgres-dev"
LOCATION="northcentralus"

az group create \
    --name "$RESOURCE_GROUP" \
    --location "$LOCATION"

az deployment group create -g $RESOURCE_GROUP \
    --query 'properties.outputs.*.value' \
    --template-file postgres-dev.bicep
```

### Azure Developer CLI

A [final template](https://github.com/ahmelsayed/aca-dev-service-postgres-azd) is available on GitHub.

Use `azd up` to deploy the template.

```bash
git clone https://github.com/Azure-Samples/aca-dev-service-postgres-azd
cd aca-dev-service-postgres-azd
azd up
```

## Clean up resources

Once you're done, run the following command to delete the resource group that contains your Container Apps resources.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this tutorial exist in the specified resource group, they will also be deleted.

```azurecli
az group delete \
    --resource-group $RESOURCE_GROUP
```
