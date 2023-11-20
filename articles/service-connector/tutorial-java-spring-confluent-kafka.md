---
title: 'Tutorial: Deploy a Spring Boot app connected to Apache Kafka on Confluent Cloud with Service Connector in Azure Spring Apps'
description: Create a Spring Boot app connected to Apache Kafka on Confluent Cloud with Service Connector in Azure Spring Apps.
ms.devlang: java
ms.custom: event-tier1-build-2022, devx-track-extended-java
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: tutorial
ms.date: 11/20/2023
---

# Tutorial: Deploy a Spring Boot app connected to Apache Kafka on Confluent Cloud with Service Connector in Azure Spring Apps

Learn how to access Apache Kafka on Confluent Cloud for a Spring Boot application running on Azure Spring Apps. In this tutorial, you complete the following tasks:

> [!div class="checklist"]
> * Create Apache Kafka on Confluent Cloud
> * Create a Spring Cloud application
> * Build and deploy the Spring Boot app
> * Connect Apache Kafka on Confluent Cloud to Azure Spring Apps using Service Connector

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
* Java 8 or a more recent version with LTS.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Clone or download the sample app

1. Clone the sample repository:

    ```Bash
    git clone https://github.com/Azure-Samples/serviceconnector-springcloud-confluent-springboot/
    ```

1. Navigate into the following folder:

    ```Bash
    cd serviceconnector-springcloud-confluent-springboot
    ```

## Prepare cloud services

### Create an instance of Apache Kafka for Confluent Cloud

Create an instance of Apache Kafka for Confluent Cloud by following [this guidance](../partner-solutions/apache-kafka-confluent-cloud/create.md).

### Create Kafka cluster and schema registry on Confluent Cloud

1. Sign in to Confluent Cloud using the SSO provided by Azure

    :::image type="content" source="media/tutorial-java-spring-confluent-kafka/azure-confluent-sso-login.png" alt-text="The link of Confluent cloud SSO login using Azure portal" lightbox="media/tutorial-java-spring-confluent-kafka/azure-confluent-sso-login.png":::

1. Use the default environment or create a new one

    :::image type="content" source="media/tutorial-java-spring-confluent-kafka/confluent-cloud-env.png" alt-text="Cloud environment of Apache Kafka on Confluent Cloud" lightbox="media/tutorial-java-spring-confluent-kafka/confluent-cloud-env.png":::

1. Create a Kafka cluster with the following information:

    * Cluster type: Standard
    * Region/zones: eastus(Virginia), Single Zone
    * Cluster name: `cluster_1` or any other name.

1. In **Cluster overview** -> **Cluster settings**, note the Kafka **Bootstrap server** URL.

    :::image type="content" source="media/tutorial-java-spring-confluent-kafka/confluent-cluster-setting.png" alt-text="Cluster settings of Apache Kafka on Confluent Cloud" lightbox="media/tutorial-java-spring-confluent-kafka/confluent-cluster-setting.png":::

1. Create API keys for the cluster in **Data integration** -> **API Keys** -> **+ Add Key** with **Global access**. Note down the key and secret.
1. Create a topic named `test` with partitions 6 in **Topics** -> **+ Add topic**
1. Under **default environment**, select the **Schema Registry** tab. Enable the Schema Registry and note down the **API endpoint**.
1. Create API keys for schema registry. Save the key and secret.

### Create an Azure Spring Apps instance

Create an instance of Azure Spring Apps by following [the Azure Spring Apps quickstart](../spring-apps/quickstart.md) in Java. Make sure your Azure Spring Apps instance is created in [a region that has Service Connector support](concept-region-support.md).

## Build and deploy the app

### Build the sample app and create a new spring app

1. Sign in to Azure and choose your subscription.

    ```azurecli
    az login

    az account set --subscription <Name or ID of your subscription>
    ```

1. Build the project using gradle.

    ```Bash
    ./gradlew build
    ```

1. Create the app with a public endpoint assigned. If you selected Java version 11 when generating the Spring Cloud project, include the `--runtime-version=Java_11` switch.

    ```azurecli
    az spring-cloud app create -n hellospring -s <service-instance-name> -g <your-resource-group-name> --assign-endpoint true
    ```

## Create a service connection using Service Connector

#### [CLI](#tab/Azure-CLI)

Run the following command to connect your Apache Kafka on Confluent Cloud to your spring cloud app.

```azurecli
az spring-cloud connection create confluent-cloud -g <your-spring-cloud-resource-group> --service <your-spring-cloud-service> --app <your-spring-cloud-app> --deployment <your-spring-cloud-deployment> --bootstrap-server <kafka-bootstrap-server-url> --kafka-key <cluster-api-key> --kafka-secret <cluster-api-secret> --schema-registry <kafka-schema-registry-endpoint> --schema-key <registry-api-key> --schema-secret <registry-api-secret>
```

Replace the following placeholder texts with your own data:

* Replace *`<your-resource-group-name>`* with the resource group name that you created for your Apps Spring Apps instance.
* Replace *`<kafka-bootstrap-server-url>`* with your Kafka bootstrap server URL. For example: `pkc-xxxx.eastus.azure.confluent.cloud:9092`.
* Replace *`<cluster-api-key>`* and *`<cluster-api-secret>`* with your cluster API key and secret.
* Replace *`<kafka-schema-registry-endpoint>`* with your Kafka Schema Registry endpoint. For example: `https://psrc-xxxx.westus2.azure.confluent.cloud`.
* Replace *`<registry-api-key>`* and *`<registry-api-secret>`* with your kafka Schema Registry API key and secret.

> [!NOTE]
> If you see the error message "The subscription is not registered to use Microsoft.ServiceLinker", please run `az provider register -n Microsoft.ServiceLinker` to register the Service Connector resource provider and run the connection command again.

#### [Portal](#tab/Azure-portal)

Select **Service Connector** and enter the following settings.

| Setting      | Suggested value  | Description                               |
| ------------ |  ------- | -------------------------------------------------- |
| **Service Type** | Apache Kafka on Confluent cloud | Target service type. If you don't have an Apache Kafka on Confluent Cloud target service, complete the previous steps in this tutorial. |
| **Name** | Generated unique name | The connection name that identifies the connection between your Spring Cloud and target service.  |
| **Kafka bootstrap server url** | Your Kafka bootstrap server url. | Enter the value from earlier step: "Create Kafka cluster and schema registry on Confluent Cloud". |
| **Cluster API Key** | Your cluster API key. | Your cluster API key. |
| **Cluster API Secret** |  Your cluster API secret. | Your cluster API secret. |
| **Create connection for schema registry**  | Checked | Also create a connection to the schema registry. |
| **Schema Registry endpoint** | Your Kafka Schema Registry endpoint.  |  |
| **Schema Registry API Key** | Your Kafka Schema Registry API Key. |Your Kafka Schema Registry API Key. |
| **Schema Registry API Secret** | Your Kafka Schema Registry API Secret. |Your Kafka Schema Registry API Secret. |

Select **Review + Create** to review the connection settings. Then select **Create** to create start creating the service connection.

---

## Deploy the JAR file

Run the following command to upload the JAR file (`build/libs/java-springboot-0.0.1-SNAPSHOT.jar`) to your Spring Cloud app.

```azurecli
az spring-cloud app deploy -n hellospring -s <service-instance-name> -g <your-resource-group-name>  --artifact-path build/libs/java-springboot-0.0.1-SNAPSHOT.jar
```

## Validate the Kafka data ingestion

Navigate to your Spring Cloud app's endpoint from the Azure portal and select the application URL. You'll see "10 messages were produced to topic test".

Then go to the Confluent portal and the topic's page will show production throughput.

:::image type="content" source="media/tutorial-java-spring-confluent-kafka/confluent-sample-metrics.png" alt-text="Sample metrics" lightbox="media/tutorial-java-spring-confluent-kafka/confluent-sample-metrics.png":::

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
