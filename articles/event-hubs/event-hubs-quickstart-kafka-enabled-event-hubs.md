---
title: 'Quickstart: Data streaming with Azure Event Hubs using the Kafka protocol'
description: 'Quickstart: This article provides information on how to stream into Azure Event Hubs using the Kafka protocol and APIs.'
ms.topic: quickstart
ms.date: 05/10/2021
ms.custom: mode-other
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


#### [Passwordless (Recommended)](#tab/passwordless)

 **OAuth:**

Azure Event Hubs supports using Azure Active Directory (Azure AD) to authorize requests to Event Hubs resources. With Azure AD, you can use Azure role-based access control (Azure RBAC) to grant permissions to a security principal, which may be a user, or an application service principal.

If you want to run this sample locally with Azure AD authentication, be sure your user account has authenticated via Azure Toolkit for IntelliJ, Visual Studio Code Azure Account plugin, or Azure CLI. Also, be sure the account has been granted sufficient permissions.

> [!NOTE]
> You need to set the following data plane access roles: `Azure Event Hubs Data Sender` and `Azure Event Hubs Data Receiver`.

To authenticate using the Azure CLI, use the following steps.

1. First, use the following command to get the resource ID for your Azure Event Hubs namespace:

   ```azurecli
   export AZURE_RESOURCE_ID=$(az resource show \
       --resource-group $AZ_RESOURCE_GROUP \
       --name $AZ_EVENTHUBS_NAMESPACE_NAME \
       --resource-type Microsoft.EventHub/Namespaces \
       --query "id" \
       --output tsv)
   ```

1. Second, use the following command to get your user object ID of your Azure CLI user account:

   ```azurecli
   export AZURE_ACCOUNT_ID=$(az ad signed-in-user show \
       --query "id" --output tsv)
   ```

1. Then, use the following commands to assign the `Azure Event Hubs Data Sender` and `Azure Event Hubs Data Receiver` roles to your account.

   ```azurecli
   az role assignment create \
       --assignee $AZURE_ACCOUNT_ID \
       --role "Azure Event Hubs Data Receiver" \
       --scope $AZURE_RESOURCE_ID
   
   az role assignment create \
       --assignee $AZURE_ACCOUNT_ID \
       --role "Azure Event Hubs Data Sender" \
       --scope $AZURE_RESOURCE_ID
   ```

For more information about granting access roles, see [Authorize access to Event Hubs resources using Azure Active Directory](/azure/event-hubs/authorize-access-azure-active-directory).

Once your user account is authenticated, you can update use following configuration in `src/main/resources/producer.config` as shown below. 

```xml
bootstrap.servers=NAMESPACENAME.servicebus.windows.net:9093
security.protocol=SASL_SSL
sasl.mechanism=OAUTHBEARER
sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required;
sasl.login.callback.handler.class=CustomAuthenticateCallbackHandler;
```    

You can find the source code for the sample handler class CustomAuthenticateCallbackHandler on GitHub [here](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/oauth/java/appsecret/producer/src/main/java).


---

#### [Connection string](#tab/connection-string)

**TLS/SSL:**

    ```xml
    bootstrap.servers=NAMESPACENAME.servicebus.windows.net:9093
    security.protocol=SASL_SSL
    sasl.mechanism=PLAIN
    sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="{YOUR.EVENTHUBS.CONNECTION.STRING}";
    ```

> [!IMPORTANT]
> Replace `{YOUR.EVENTHUBS.CONNECTION.STRING}` with the connection string for your Event Hubs namespace. For instructions on getting the connection string, see [Get an Event Hubs connection string](event-hubs-get-connection-string.md). Here's an example configuration: `sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="Endpoint=sb://mynamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXXXXX";`

---



   
4. Run the producer code and stream events into Event Hubs:
   
    ```shell
    mvn clean package
    mvn exec:java -Dexec.mainClass="TestProducer"                                    
    ```
    
5. Navigate to `azure-event-hubs-for-kafka/quickstart/java/consumer`.

6. Update the configuration details for the consumer in `src/main/resources/consumer.config` as follows:
   

#### [Passwordless (Recommended)](#tab/passwordless)

Make sure you configure Azure AD authentication as mentioned in step 3 and use the followning consumer configuration.  
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


---

#### [Connection string](#tab/connection-string)

**TLS/SSL:**

```xml
bootstrap.servers=NAMESPACENAME.servicebus.windows.net:9093
security.protocol=SASL_SSL
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="{YOUR.EVENTHUBS.CONNECTION.STRING}";
```

> [!IMPORTANT]
> Replace `{YOUR.EVENTHUBS.CONNECTION.STRING}` with the connection string for your Event Hubs namespace. For instructions on getting the connection string, see [Get an Event Hubs connection string](event-hubs-get-connection-string.md). Here's an example configuration: `sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="Endpoint=sb://mynamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXXXXX";`

---




7. Run the consumer code and process events from event hub using your Kafka clients:

    ```java
    mvn clean package
    mvn exec:java -Dexec.mainClass="TestConsumer"                                    
    ```

If your Event Hubs Kafka cluster has events, you now start receiving them from the consumer.

## Next steps
In this article, you learned how to stream into Event Hubs without changing your protocol clients or running your own clusters. To learn more, see [Apache Kafka developer guide for Azure Event Hubs](apache-kafka-developer-guide.md).
