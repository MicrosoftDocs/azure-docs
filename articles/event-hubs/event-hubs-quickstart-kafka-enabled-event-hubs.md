---
title: 'Quickstart: Data streaming with Azure Event Hubs using the Kafka protocol'
description: 'Quickstart: This article provides information on how to stream into Azure Event Hubs using the Kafka protocol and APIs.'
ms.topic: quickstart
ms.date: 05/10/2021
---

# Quickstart: Data streaming with Event Hubs using the Kafka protocol
This quickstart shows how to stream into Event Hubs without changing your protocol clients or running your own clusters. You learn how to use your producers and consumers to talk to Event Hubs with just a configuration change
in your applications. 

> [!NOTE]
> This sample is available on [GitHub](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/java)

## Prerequisites

To complete this quickstart, make sure you have the following prerequisites:

* Read through the [Event Hubs for Apache Kafka](event-hubs-for-kafka-ecosystem-overview.md) article.
* An Azure subscription. If you do not have one, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
* [Java Development Kit (JDK) 1.7+](/azure/developer/java/fundamentals/java-support-on-azure).
* [Download](https://maven.apache.org/download.cgi) and [install](https://maven.apache.org/install.html) a Maven binary archive.
* [Git](https://www.git-scm.com/)


## Create an Event Hubs namespace
When you create an Event Hubs namespace, the Kafka endpoint for the namespace is automatically enabled. You can stream events from your applications that use the Kafka protocol into event hubs. Follow step-by-step instructions in the [Create an event hub using Azure portal](event-hubs-create.md) to create an Event Hubs namespace. If you are using a dedicated cluster, see [Create a namespace and event hub in a dedicated cluster](event-hubs-dedicated-cluster-create-portal.md#create-a-namespace-and-event-hub-within-a-cluster).

> [!NOTE]
> Event Hubs for Kafka isn't supported in the **basic** tier.

## Send and receive messages with Kafka in Event Hubs

1. Clone the [Azure Event Hubs for Kafka repository](https://github.com/Azure/azure-event-hubs-for-kafka).

2. Navigate to `azure-event-hubs-for-kafka/quickstart/java/producer`.

3. Update the configuration details for the producer in `src/main/resources/producer.config` as follows:

    **TLS/SSL:**

    ```xml
    bootstrap.servers=NAMESPACENAME.servicebus.windows.net:9093
    security.protocol=SASL_SSL
    sasl.mechanism=PLAIN
    sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="{YOUR.EVENTHUBS.CONNECTION.STRING}";
    ```
    
    > [!IMPORTANT]
    > Replace `{YOUR.EVENTHUBS.CONNECTION.STRING}` with the connection string for your Event Hubs namespace. For instructions on getting the connection string, see [Get an Event Hubs connection string](event-hubs-get-connection-string.md). Here's an example configuration: `sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="Endpoint=sb://mynamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXXXXX";`

    **OAuth:**

    ```xml
    bootstrap.servers=NAMESPACENAME.servicebus.windows.net:9093
    security.protocol=SASL_SSL
    sasl.mechanism=OAUTHBEARER
    sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required;
    sasl.login.callback.handler.class=CustomAuthenticateCallbackHandler;
    ```    

    You can find the source code for the sample handler class CustomAuthenticateCallbackHandler on GitHub [here](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/oauth/java/appsecret/producer/src/main/java).
4. Run the producer code and stream events into Event Hubs:
   
    ```shell
    mvn clean package
    mvn exec:java -Dexec.mainClass="TestProducer"                                    
    ```
    
5. Navigate to `azure-event-hubs-for-kafka/quickstart/java/consumer`.

6. Update the configuration details for the consumer in `src/main/resources/consumer.config` as follows:
   
    **TLS/SSL:**

    ```xml
    bootstrap.servers=NAMESPACENAME.servicebus.windows.net:9093
    security.protocol=SASL_SSL
    sasl.mechanism=PLAIN
    sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="{YOUR.EVENTHUBS.CONNECTION.STRING}";
    ```

    > [!IMPORTANT]
    > Replace `{YOUR.EVENTHUBS.CONNECTION.STRING}` with the connection string for your Event Hubs namespace. For instructions on getting the connection string, see [Get an Event Hubs connection string](event-hubs-get-connection-string.md). Here's an example configuration: `sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="Endpoint=sb://mynamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXXXXX";`

    **OAuth:**

    ```xml
    bootstrap.servers=NAMESPACENAME.servicebus.windows.net:9093
    security.protocol=SASL_SSL
    sasl.mechanism=OAUTHBEARER
    sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required;
    sasl.login.callback.handler.class=CustomAuthenticateCallbackHandler;
    ``` 

    You can find the source code for the sample handler class CustomAuthenticateCallbackHandler on GitHub [here](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/oauth/java/appsecret/consumer/src/main/java).

    You can find all the OAuth samples for Event Hubs for Kafka [here](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/oauth).
7. Run the consumer code and process events from event hub using your Kafka clients:

    ```java
    mvn clean package
    mvn exec:java -Dexec.mainClass="TestConsumer"                                    
    ```

If your Event Hubs Kafka cluster has events, you now start receiving them from the consumer.

## Next steps
In this article, you learned how to stream into Event Hubs without changing your protocol clients or running your own clusters. To learn more, see [Apache Kafka developer guide for Azure Event Hubs](apache-kafka-developer-guide.md).