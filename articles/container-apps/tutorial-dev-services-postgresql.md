---
title: 'Tutorial: Create and use a PostgreSQL service for development'
description: Create and use a PostgreSQL service for development
services: container-apps
author: ahmelsayed
ms.service: container-apps
ms.topic: tutorial
ms.date: 06/06/2023
ms.author: ahmels
---

# Tutorial: Create and use a PostgreSQL service for development

The Azure Container Apps service enables you to provision services like PostgreSQL, Redis, and Apache Kafka on the same environment as your applications. Those services are deployed as special type of Container Apps. You can connect other applications to them securely without exporting secrets, or sharing them anywhere. Those services are deployed in the same private network as your applications so you don't have to setup or manage VNETs for simple development workflows. Finally, these services compute scale to 0 like other Container Apps when not used to cut down on cost for development.

In this tutorial, you learn how to create and use a development PostgreSQL service. There are both step-by-step Azure CLI commands, and Bicep template fragments for each step. For Bicep, adding all fragments to the same bicep file and deploying the template all at once or after each incremental update works equally.

> [!div class="checklist"]
> * Create a Container Apps environment to deploy your service and container apps
> * Create a PostgreSQL service
> * Create and use a test command line App to use the dev PostgreSQL
> * Creating or Updating an app that uses the dev service
> * Create a `pgweb` app.
> * Compile a final bicep template to deploy all resources using a consistent and predictable template deployment
> * Use an `azd` template for a one command deployment of all resources

## Prerequisites

- Install the [Azure CLI](/cli/azure/install-azure-cli).
- Optional: [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) of following AZD instructions


> [!NOTE]
> For a one command deployment, skip to the last `azd` [template step](#final-azd-template-for-all-resource).

## Setup

1. Define some values/parameters to we can use later for all commands/bicep resource.

    # [Bash](#tab/bash)

    ```bash
    RESOURCE_GROUP="postgres-dev"
    LOCATION="northcentralus"
    ENVIRONMENT="aca-env"
    PG_SVC="postgres01"
    PSQL_CLI_APP="psql-cloud-cli-app"
    ```

    # [Bicep](#tab/bicep)

    You still need to use the CLI to deploy the bicep template into a resource group. So define the following variables for the CLI

    ```bash
    RESOURCE_GROUP="postgres-dev"
    LOCATION="northcentralus"
    ```

    For Bicep, start by creating a file called `postgres-dev.bicep` then add some parameters with default values to it

    ```bicep
    targetScope = 'resourceGroup'
    param location string = resourceGroup().location
    param appEnvironmentName string = 'aca-env'
    param pgSvcName string = 'postgres01'
    param pgsqlCliAppName string = 'psql-cloud-cli-app'
    ```

    to deploy the bicep template at any stage use:

    ```bash
    az deployment group create -g $RESOURCE_GROUP \
        --query 'properties.outputs.*.value' \
        --template-file postgres-dev.bicep
    ```

    # [azd](#tab/azd)
    
    Define a couple of values to use for `azd`
    
    ```bash
    AZURE_ENV_NAME="azd-postgres-dev"
    LOCATION="northcentralus"
    ```

    Initialize a Minimal azd template

    ```bash
    azd init \
        --environment "$AZURE_ENV_NAME" \
        --location "$LOCATION" \
        --no-prompt
    ```

    > [!NOTE]
    > `AZURE_ENV_NAME` is different from the Container App Environment name. `AZURE_ENV_NAME` in `azd` is for all resources in a template. Including other non Container Apps resources. We will create a different name for the Container Apps Environment.

    then option `infra/main.bicep` and define a couple of parameters to use later in our template

    ```bicep
    param appEnvironmentName string = 'aca-env'
    param pgSvcName string = 'postgres01'
    param pgsqlCliAppName string = 'psql-cloud-cli-app'
    ```

    ---

2. Make sure to log in and upgrade/register all providers needed for your Azure Subscription

    ```bash
    az login
    az upgrade
    az bicep upgrade
    az extension add --name containerapp --upgrade
    az provider register --namespace Microsoft.App
    az provider register --namespace Microsoft.OperationalInsights
    ```

## Create a Container App Environment

1. Create a resource group

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

    to deploy the bicep template at any stage use:

    ```bash
    az deployment group create -g $RESOURCE_GROUP \
        --query 'properties.outputs.*.value' \
        --template-file postgres-dev.bicep
    ```

    # [azd](#tab/azd)

    No special setup is needed for managing resource groups in `azd`. `azd` drives a resource group from `AZURE_ENV_NAME`/`--environment` value.
    You can however test the minimal template with 

    ```bash
    azd up
    ```

    That command should create an empty resource group.

    ---

1. Create a Container Apps environment

    # [Bash](#tab/bash)

    ```bash
    az containerapp env create \
      --name "$ENVIRONMENT" \
      --resource-group "$RESOURCE_GROUP" \
      --location "$LOCATION"
    ```

    # [Bicep](#tab/bicep)

    add the following to your `postgres-dev.bicep` file

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

    > [!TIP]
    > The Azure CLI will automatically create a Log Analytics work space for each environment. To achieve the same using a bicep template you must explicitly declare it and link it. This makes your deployment and resources significantly more clear and predictable, at the cost of some verbosity. To do that in Bicep, update the environment resource in bicep to

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

    `azd` templates must use [bicep modules](/azure/azure-resource-manager/bicep/modules). First create a `./infra/core/host` folder. Then create `./infra/core/host/container-apps-environment.bicep` module with the following content

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

    then in `./infra/main.bicep` load the module using

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

    run `azd up` to deploy.

    ---

## Create a PostgreSQL service

1. Create a PostgreSQL service 

    # [Bash](#tab/bash)

    ```bash
    az containerapp service postgres create \
        --name "$PG_SVC" \
        --resource-group "$RESOURCE_GROUP" \
        --environment "$ENVIRONMENT"
    ```

    # [Bicep](#tab/bicep)

    Add the following to `postgres-dev.bicep`

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
    To deploy the bicep template do

    ```bash
    az deployment group create -g $RESOURCE_GROUP \
        --query 'properties.outputs.*.value' \
        --template-file postgres-dev.bicep
    ```

    > [!TIP]
    > The output `postgresLogs` will output a CLI command to view the logs of postgres after it's been deployed. You can run the command to view the initialization logs of the new postgres service. 

    # [azd](#tab/azd)

    Create a `./infra/core/host/container-app-service.bicep` module file with the following content

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

    Then update `./infra/main.bicep` to use the module with the following declaration:

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

    Then deploy the template using `azd up`

    ---

1. View log output from the postgres instance

    # [Bash](#tab/bash)

    use the logs command to view the logs

    ```bash
    az containerapp logs show \
        --name $PG_SVC \
        --resource-group $RESOURCE_GROUP \
        --follow --tail 30
    ```

    # [Bicep](#tab/bicep)

    The previous bicep example includes an output for the command to view the logs. For example:

    ```bash
    [
      "az containerapp logs show -n postgres01 -g postgres-dev --follow --tail 30"
    ]
    ```

    If you don't have the command, you can use the service name to get the logs using the CLI

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

## Create a command line test app to view and connect to the service

We start by creating a debug app to use `psql` CLI to connect to the PostgreSQL instance.

1. Create a `psql` app that binds to the PostgreSQL service

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

    Add the following to `postgres-dev.bicep`

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
    > The output `pgsqlCliExec` will output a CLI command to exec into the test app after it's been deployed.

    # [azd](#tab/azd)

    Create a module under `./infra/core/host/container-app.bicep` and add the following there

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

    then use that module in `./infra/main.bicep` using

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

    deploy the template with `azd up`

    ---

1. Run CLI exec command to connect to the test app

    # [Bash](#tab/bash)

    ```bash
    az containerapp exec \
        --name $PSQL_CLI_APP \
        --resource-group $RESOURCE_GROUP \
        --command /bin/bash
    ```

    # [Bicep](#tab/bicep)

    The previous bicep example includes an output a second for the command to exec into the app. For example:

    ```bash
    [
      "az containerapp logs show -n postgres01 -g postgres-dev --follow --tail 30",
      "az containerapp exec -n psql-cloud-cli-app -g postgres-dev --command /bin/bash"
    ]
    ```

    If you don't have the command, you can get the app name to exec using the CLI

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

    Using `--bind` or `serviceBinds` on the test app injects all the connection information into the application environment. Once you connect to the test container, you can inspect the values using 

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

1. Create a table `accounts` and insert some data 

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

If you already have an app that uses PostgreSQL, you can update where the app reads the connection information to postgres to use the following environment variables

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

Then using the CLI (or bicep) you can update the app to add a `--bind $PG_SVC` to use the created dev service.

## Deploying `pgweb` and binding it to the PostgreSQL service

For example, we can deploy [pgweb](https://github.com/sosedoff/pgweb) to view and manage the PostgreSQL instance we have.

# [Bash](#tab/bash)

See Bicep or `azd` example

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

deploy the bicep template with the same command

```bash
az deployment group create -g $RESOURCE_GROUP \
    --query 'properties.outputs.*.value' \
    --template-file postgres-dev.bicep
```

and visit the url printed url

# [azd](#tab/azd)

Update `./infra/main.bicep` with the following 

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

then deploy the template with `azd up`

---


:::image type="content" source="media/tutorial-dev-services-postgresql/azure-container-apps-postgresql-pgweb.png" alt-text="Screenshot of pgweb Container App connecting to PostgreSQL service.":::


## Final Bicep template for deploying all resources

The following bicep template contains all the resources in this tutorial. You can create a `postgres-dev.bicep` file with this content

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

Then use the Azure CLI to deploy it

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

## Final `azd` template for all resource

A final template can be found [here](https://github.com/ahmelsayed/aca-dev-service-postgres-azd). To deploy it 

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
