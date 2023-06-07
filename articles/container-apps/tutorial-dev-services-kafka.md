---
title: 'Tutorial: Create and use a Apache Kafka service for development'
description: Create and use a Apache Kafka service for development
services: container-apps
author: ahmelsayed
ms.service: container-apps
ms.topic: tutorial
ms.date: 06/06/2023
ms.author: ahmels
---

# Tutorial: Create and use a Apache Kafka service for development

The Azure Container Apps service enables you to provision services like Apache Kafka, Redis, [PostgreSQL](./tutorial-dev-services-postgresql.md), etc on the same environment as your applications. Those services are deployed as special type of Container Apps that is managed for you and you can connect other applications to them securely without exporting secrets, or sharing them anywhere. Those services are deployed in the same private network as your applications so you don't have to setup or manage VNETs for simple development workflows. Finally, these services compute scale to 0 like other Container Apps when not used to cut down on cost for development.

In this tutorial you learn how to create and use a development Apache Kafka service. There are both step-by-step Azure CLI commands, as well as Bicep template fragments for each step. For Bicep, adding all fragments to the same bicep file and deploying the template all at once or after each incremental update works equally.

> [!div class="checklist"]
> * Create a Container Apps environment to deploy your service and container apps
> * Create a Apache Kafka service
> * Create and use test command line App to use the dev Apache Kafka
> * Deploy a kafka-ui app to view 
> * Creating or Updating a consumer/prod that uses the dev service
> * Compile a final bicep template to deploy all resources using a consistent and predictable template deployment

## Prerequisites

- Install the [Azure CLI](/cli/azure/install-azure-cli).

## Setup

1. Define some values/parameters to we can use later for all commands/bicep resource.

    # [Bash](#tab/bash)

    ```bash
    RESOURCE_GROUP="kafka-dev"
    LOCATION="northcentralus"
    ENVIRONMENT="aca-env"
    KAFKA_SVC="kafka01"
    KAFKA_CLI_APP="kafka-cli-app"
    KAFKA_UI_APP="kafka-ui-app"
    ```

    # [Bicep](#tab/bicep)

    You'll still need to use the CLI to deploy the bicep template into a resource group. So define the following variables for the CLI

    ```bash
    RESOURCE_GROUP="kafka-dev"
    LOCATION="northcentralus"
    ```

    For Bicep, start by creating a file called `kafka-dev.bicep` then add some parameters with default values to it

    ```bicep
    targetScope = 'resourceGroup'
    param location string = resourceGroup().location
    param appEnvironmentName string = 'aca-env'
    param kafkaSvcName string = 'kafka01'
    param kafkaCliAppName string = 'kafka-cli-app'
    param kafkaUiAppName string = 'kafka-ui'
    ```

    to deploy the bicep template at any stage use:

    ```bash
    az deployment group create -g $RESOURCE_GROUP \
        --query 'properties.outputs.*.value' \
        --template-file kafka-dev.bicep
    ```

    ----

1. Make sure to login and upgrade/register all providers needed for your Azure Subscription

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
        --template-file kafka-dev.bicep
    ```

    ----

1. Create a Container Apps environment

    # [Bash](#tab/bash)

    ```bash
    az containerapp env create \
      --name "$ENVIRONMENT" \
      --resource-group "$RESOURCE_GROUP" \
      --location "$LOCATION"
    ```

    # [Bicep](#tab/bicep)

    add the following to your `kafka-dev.bicep` file

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

    ----

## Create a Apache Kafka service

1. Create a Apache Kafka service 

    # [Bash](#tab/bash)

    ```bash
    ENVIRONMENT_ID=$(az containerapp env show \
      --name "$ENVIRONMENT" \
      --resource-group "$RESOURCE_GROUP" \
      --output tsv \
      --query id)

    az rest \
        --method PUT \
        --url "/subscriptions/$(az account show --output tsv --query id)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.App/containerApps/$KAFKA_SVC?api-version=2023-04-01-preview" \
        --body "{\"location\": \"$LOCATION\", \"properties\": {\"environmentId\": \"$ENVIRONMENT_ID\", \"configuration\": {\"service\": {\"type\": \"kafka\"}}}}"
    ```

    # [Bicep](#tab/bicep)

    Add the following to `kafka-dev.bicep`

    ```bicep
    resource kafka 'Microsoft.App/containerApps@2023-04-01-preview' = {
      name: kafkaSvcName
      location: location
      properties: {
        environmentId: appEnvironment.id
        configuration: {
          service: {
              type: 'kafka'
          }
        }
      }
    }

    output kafkaLogs string = 'az containerapp logs show -n ${kafka.name} -g ${resourceGroup().name} --follow --tail 30'
    ```
    To deploy the bicep template do

    ```bash
    az deployment group create -g $RESOURCE_GROUP \
        --query 'properties.outputs.*.value' \
        --template-file kafka-dev.bicep
    ```

    > [!TIP]
    > The output `kafkaLogs` will output a CLI command to view the logs of postgres after it's been deployed. You can run the command to view the initialization logs of the new postgres service. 

    ----

1. View log output from the postgres instance

    # [Bash](#tab/bash)

    use the logs command to view the logs

    ```bash
    az containerapp logs show \
        --name $KAFKA_SVC \
        --resource-group $RESOURCE_GROUP \
        --follow --tail 30
    ```

    # [Bicep](#tab/bicep)

    The bicep example above includes an output for the command to view the logs. For example:

    ```bash
    [
      "az containerapp logs show -n kafka01 -g kafka-dev --follow --tail 30"
    ]
    ```

    If you don't have the command, you can use the service name to get the logs using the CLI

    ```bash
    az containerapp logs show \
        --name $KAFKA_SVC \
        --resource-group $RESOURCE_GROUP \
        --follow --tail 30
    ```

    ----

    :::image type="content" source="media/services/azure-container-apps-kafka-service-logs.png" alt-text="Screenshot of container app PostgreSQL service logs.":::

## Create a command line test apps

We will start by creating an app to use `./kafka-topics.sh`, `./kafka-console-producer.sh`, and `kafka-console-consumer.sh` to connect to the Kafka instance.

1. Create a `kafka-cli-app` app that binds to the PostgreSQL service

    # [Bash](#tab/bash)

    ```bash
    az containerapp create \
        --name "$KAFKA_CLI_APP" \
        --image mcr.microsoft.com/k8se/services/kafka:3.4 \
        --environment "$ENVIRONMENT" \
        --resource-group "$RESOURCE_GROUP" \
        --min-replicas 1 \
        --max-replicas 1 \
        --command "/bin/sleep" "infinity"
    
    az rest \
        --method PATCH \
        --headers "Content-Type=application/json" \
        --url "/subscriptions/$(az account show --output tsv --query id)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.App/containerApps/$KAFKA_CLI_APP?api-version=2023-04-01-preview" \
        --body "{\"properties\": {\"template\": {\"serviceBinds\": [{\"serviceId\": \"/subscriptions/$(az account show --output tsv --query id)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.App/containerApps/$KAFKA_SVC\"}]}}}"
    ```

    # [Bicep](#tab/bicep)

    Add the following to `postgres-dev.bicep`

    ```bicep
    resource kafkaCli 'Microsoft.App/containerApps@2023-04-01-preview' = {
      name: kafkaCliAppName
      location: location
      properties: {
        environmentId: appEnvironment.id
        template: {
          serviceBinds: [
            {
              serviceId: kafka.id
            }
          ]
          containers: [
            {
              name: 'kafka-cli'
              image: 'mcr.microsoft.com/k8se/services/kafka:3.4'
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

    output kafkaCliExec string = 'az containerapp exec -n ${kafkaCli.name} -g ${resourceGroup().name} --command /bin/bash'
    ```

    > [!TIP]
    > The output `kafkaCliExec` will output a CLI command to exec into the test app after it's been deployed.

    ----

1. Run CLI exec command to exec command to connect to the test app

    # [Bash](#tab/bash)

    ```bash
    az containerapp exec \
        --name $KAFKA_CLI_APP \
        --resource-group $RESOURCE_GROUP \
        --command /bin/bash
    ```

    # [Bicep](#tab/bicep)

    The bicep example above includes an output a second for the command to exec into the app. For example:

    ```bash
    [
      "az containerapp logs show -n kafka01 -g kafka-dev --follow --tail 30",
      "az containerapp exec -n kafka-cli-app -g kafka-dev --command /bin/bash"
    ]
    ```

    If you don't have the command, you can get use the app name to exec using the CLI

    ```bash
    az containerapp exec \
        --name $KAFKA_CLI_APP \
        --resource-group $RESOURCE_GROUP \
        --command /bin/bash
    ```

    ----

    Using `--bind` or `serviceBinds` on the test app injects all the connection information into the application environment. Once you exec into the test container you can inspect the values using 

    ```bash
    env | grep "^KAFKA_"

    KAFKA_SECURITYPROTOCOL=SASL_PLAINTEXT
    KAFKA_BOOTSTRAPSERVER=kafka01:9092
    KAFKA_HOME=/opt/kafka
    KAFKA_PROPERTIES_SASL_JAAS_CONFIG=org.apache.kafka.common.security.plain.PlainLoginModule required username="kafka-user" password="7dw..." user_kafka-user="7dw..." ;
    KAFKA_BOOTSTRAP_SERVERS=kafka01:9092
    KAFKA_SASLUSERNAME=kafka-user
    KAFKA_SASL_USER=kafka-user
    KAFKA_VERSION=3.4.0
    KAFKA_SECURITY_PROTOCOL=SASL_PLAINTEXT
    KAFKA_SASL_PASSWORD=7dw...
    KAFKA_SASLPASSWORD=7dw...
    KAFKA_SASL_MECHANISM=PLAIN
    KAFKA_SASLMECHANISM=PLAIN
    ```

1. Us `kafka-topics.sh` to create a topic

    First create a `kafka.props` file

    ```bash
    echo "security.protocol=$KAFKA_SECURITY_PROTOCOL" >> kafka.props && \
    echo "sasl.mechanism=$KAFKA_SASL_MECHANISM" >> kafka.props && \
    echo "sasl.jaas.config=$KAFKA_PROPERTIES_SASL_JAAS_CONFIG" >> kafka.props
    ```

    Create a `quickstart-events` topic

    ```bash
    /opt/kafka/bin/kafka-topics.sh \
        --create --topic quickstart-events \
        --bootstrap-server $KAFKA_BOOTSTRAP_SERVERS \
        --command-config kafka.props
    # Created topic quickstart-events.

    /opt/kafka/bin/kafka-topics.sh \
        --describe --topic quickstart-events \
        --bootstrap-server $KAFKA_BOOTSTRAP_SERVERS \
        --command-config kafka.props
    # Topic: quickstart-events	TopicId: lCkTKmvZSgSUCHozhhvz1Q	PartitionCount: 1	ReplicationFactor: 1	Configs: segment.bytes=1073741824
	Topic: quickstart-events	Partition: 0	Leader: 1	Replicas: 1	Isr: 1
    ```

1. Use `kafka-console-producer.sh` to write some events to the topic

    ```bash
    /opt/kafka/bin/kafka-console-producer.sh \
        --topic quickstart-events \
        --bootstrap-server $KAFKA_BOOTSTRAP_SERVERS \
        --producer.config kafka.props
    
    > this is my first event
    > this is my second event
    > this is my third event
    > CTRL-C
    ```

    > [!NOTE]
    > The `./kafka-console-producer.sh` command will prompt you to write events with `>`. Write some events as shown above, then hit `CTRL-C` any time to finish.

1. Use `kafka-console-consumer.sh` to read events from the topic

    ```bash
    /opt/kafka/bin/kafka-console-consumer.sh \
         --topic quickstart-events \
        --bootstrap-server $KAFKA_BOOTSTRAP_SERVERS \
        --from-beginning \
        --consumer.config kafka.props

    # this is my first event
    # this is my second event
    # this is my third event
    ```

:::image type="content" source="media/services/azure-container-apps-kafka-cli-output.png" alt-text="Screenshot of container app PostgreSQL service logs.":::

## Using a dev service with an existing app

If you already have an app that uses Apache Kafka, you can update where the app reads the connection information to Kafka to use the following environment variables

```bash
KAFKA_HOME=/opt/kafka
KAFKA_PROPERTIES_SASL_JAAS_CONFIG=org.apache.kafka.common.security.plain.PlainLoginModule required username="kafka-user" password="7dw..." user_kafka-user="7dw..." ;
KAFKA_BOOTSTRAP_SERVERS=kafka01:9092
KAFKA_SASL_USER=kafka-user
KAFKA_VERSION=3.4.0
KAFKA_SECURITY_PROTOCOL=SASL_PLAINTEXT
KAFKA_SASL_PASSWORD=7dw...
KAFKA_SASL_MECHANISM=PLAIN
```

Then using the CLI (or bicep) you can update the app to add a `--bind $KAFKA_SVC` to use the created dev service.

## Deploying `kafka-ui` and binding it to the the PostgreSQL service

For example, we can deploy [kafka-ui](https://github.com/provectus/kafka-ui) to view and manage the Kafka instance we have.

```bicep
resource kafkaUi 'Microsoft.App/containerApps@2023-04-01-preview' = {
  name: kafkaUiAppName
  location: location
  properties: {
    environmentId: appEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8080
      }
    }
    template: {
      serviceBinds: [
        {
          serviceId: kafka.id
          name: 'kafka'
        }
      ]
      containers: [
        {
          name: 'kafka-ui'
          image: 'docker.io/provectuslabs/kafka-ui:latest'
          command: [
            '/bin/sh'
          ]
          args: [
            '-c'
            '''export KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS="$KAFKA_BOOTSTRAP_SERVERS" && \
            export KAFKA_CLUSTERS_0_PROPERTIES_SASL_JAAS_CONFIG="$KAFKA_PROPERTIES_SASL_JAAS_CONFIG" && \
            export KAFKA_CLUSTERS_0_PROPERTIES_SASL_MECHANISM="$KAFKA_SASL_MECHANISM" && \
            export KAFKA_CLUSTERS_0_PROPERTIES_SECURITY_PROTOCOL="$KAFKA_SECURITY_PROTOCOL" && \
            java $JAVA_OPTS -jar kafka-ui-api.jar'''
          ]
          resources: {
            cpu: json('1.0')
            memory: '2.0Gi'
          }
        }
      ]
    }
  }
}

output kafkaUiUrl string = 'https://${kafkaUi.properties.configuration.ingress.fqdn}'
```

and visit the url printed url

:::image type="content" source="media/services/azure-container-apps-kafka-ui-data.png" alt-text="Screenshot of pgweb Container App connecting to PostgreSQL service.":::

## Final Bicep template for deploying all resources

The following bicep template contains all the resources in this tutorial. You can create a `postgres-dev.bicep` file with this content

```bicep
targetScope = 'resourceGroup'
param location string = resourceGroup().location
param appEnvironmentName string = 'aca-env'
param kafkaSvcName string = 'kafka01'
param kafkaCliAppName string = 'kafka-cli-app'
param kafkaUiAppName string = 'kafka-ui'

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

resource kafka 'Microsoft.App/containerApps@2023-04-01-preview' = {
  name: kafkaSvcName
  location: location
  properties: {
    environmentId: appEnvironment.id
    configuration: {
      service: {
          type: 'kafka'
      }
    }
  }
}

resource kafkaCli 'Microsoft.App/containerApps@2023-04-01-preview' = {
  name: kafkaCliAppName
  location: location
  properties: {
    environmentId: appEnvironment.id
    template: {
      serviceBinds: [
        {
          serviceId: kafka.id
        }
      ]
      containers: [
        {
          name: 'kafka-cli'
          image: 'mcr.microsoft.com/k8se/services/kafka:3.4'
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

resource kafkaUi 'Microsoft.App/containerApps@2023-04-01-preview' = {
  name: kafkaUiAppName
  location: location
  properties: {
    environmentId: appEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8080
      }
    }
    template: {
      serviceBinds: [
        {
          serviceId: kafka.id
          name: 'kafka'
        }
      ]
      containers: [
        {
          name: 'kafka-ui'
          image: 'docker.io/provectuslabs/kafka-ui:latest'
          command: [
            '/bin/sh'
          ]
          args: [
            '-c'
            '''export KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS="$KAFKA_BOOTSTRAP_SERVERS" && \
            export KAFKA_CLUSTERS_0_PROPERTIES_SASL_JAAS_CONFIG="$KAFKA_PROPERTIES_SASL_JAAS_CONFIG" && \
            export KAFKA_CLUSTERS_0_PROPERTIES_SASL_MECHANISM="$KAFKA_SASL_MECHANISM" && \
            export KAFKA_CLUSTERS_0_PROPERTIES_SECURITY_PROTOCOL="$KAFKA_SECURITY_PROTOCOL" && \
            java $JAVA_OPTS -jar kafka-ui-api.jar'''
          ]
          resources: {
            cpu: json('1.0')
            memory: '2.0Gi'
          }
        }
      ]
    }
  }
}

output kafkaUiUrl string = 'https://${kafkaUi.properties.configuration.ingress.fqdn}'

output kafkaCliExec string = 'az containerapp exec -n ${kafkaCli.name} -g ${resourceGroup().name} --command /bin/bash'

output kafkaLogs string = 'az containerapp logs show -n ${kafka.name} -g ${resourceGroup().name} --follow --tail 30'
```

Then use the Azure CLI to deploy it

```bash
RESOURCE_GROUP="kafka-dev"
LOCATION="northcentralus"

az group create \
    --name "$RESOURCE_GROUP" \
    --location "$LOCATION"

az deployment group create -g $RESOURCE_GROUP \
    --query 'properties.outputs.*.value' \
    --template-file kafka-dev.bicep
```

## Clean up resources

Once you're done, run the following command to delete the resource group that contains your Container Apps resources.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this tutorial exist in the specified resource group, they will also be deleted.

```azurecli
az group delete \
    --resource-group $RESOURCE_GROUP
```
