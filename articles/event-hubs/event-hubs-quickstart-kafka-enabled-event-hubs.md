---
title: 'Quickstart: Use Apache Kafka with Azure Event Hubs'
description: 'This quickstart shows you how to stream data into and from Azure Event Hubs using the Apache Kafka protocol.'
ms.topic: quickstart
ms.date: 02/07/2023
author: kasun04
ms.author: kindrasiri
ms.custom: mode-other, passwordless-java
---

# Quickstart: Stream data with Azure Event Hubs and Apache Kafka
This quickstart shows you how to stream data into and from Azure Event Hubs using the Apache Kafka protocol. You'll not change any code in the sample Kafka producer or consumer apps. You just update the configurations that the clients use to point to an Event Hubs namespace, which exposes a Kafka endpoint. You also don't build and use a Kafka cluster on your own. Instead, you use the Event Hubs namespace with the Kafka endpoint.

> [!NOTE]
> This sample is available on [GitHub](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/java)

## Prerequisites

To complete this quickstart, make sure you have the following prerequisites:

* Read through the [Event Hubs for Apache Kafka](azure-event-hubs-kafka-overview.md) article.
* An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
* Create a Windows virtual machine and install the following components: 
    * [Java Development Kit (JDK) 1.7+](/azure/developer/java/fundamentals/java-support-on-azure).
    * [Download](https://maven.apache.org/download.cgi) and [install](https://maven.apache.org/install.html) a Maven binary archive.
    * [Git](https://www.git-scm.com/)

## Create an Azure Event Hubs namespace

When you create an Event Hubs namespace, the Kafka endpoint for the namespace is automatically enabled. You can stream events from your applications that use the Kafka protocol into event hubs. Follow step-by-step instructions in the [Create an event hub using Azure portal](event-hubs-create.md) to create an Event Hubs namespace. If you're using a dedicated cluster, see [Create a namespace and event hub in a dedicated cluster](event-hubs-dedicated-cluster-create-portal.md#create-a-namespace-and-event-hub-within-a-cluster).

> [!NOTE]
> Event Hubs for Kafka isn't supported in the **basic** tier.

## Send and receive messages with Kafka in Event Hubs

### [Passwordless (Recommended)](#tab/passwordless)
1. Enable a system-assigned managed identity for the virtual machine. For more information about configuring managed identity on a VM, see [Configure managed identities for Azure resources on a VM using the Azure portal](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md#system-assigned-managed-identity). Managed identities for Azure resources provide Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code.

    :::image type="content" source="./media/event-hubs-quickstart-kafka-enabled-event-hubs/enable-identity-vm.png" alt-text="Screenshot of the Identity tab of a virtual machine page in the Azure portal.":::
1. Using the **Access control** page of the Event Hubs namespace you created, assign **Azure Event Hubs Data Owner** role to the VM's managed identity. 
Azure Event Hubs supports using Azure Active Directory (Azure AD) to authorize requests to Event Hubs resources. With Azure AD, you can use Azure role-based access control (Azure RBAC) to grant permissions to a security principal, which may be a user, or an application service principal.    
    1. In the Azure portal, navigate to your Event Hubs namespace. Go to "Access Control (IAM)" in the left navigation.    
    2. Select + Add and select `Add role assignment`.    
    
        :::image type="content" source="./media/event-hubs-quickstart-kafka-enabled-event-hubs/add-role-assignment-menu.png" alt-text="Screenshot of the Access Control page of an Event Hubs namespace.":::        
    1. In the Role tab, select **Azure Event Hubs Data Owner**, and select the **Next** button.    
    
        :::image type="content" source="./media/event-hubs-quickstart-kafka-enabled-event-hubs/select-event-hubs-owner-role.png" alt-text="Screenshot showing the selection of the Azure Event Hubs Data Owner role.":::        
    1. In the **Members** tab, select the **Managed Identity** in the **Assign access to** section.    
    1. Select the **+Select members** link. 
    1. On the **Select managed identities** page, follow these steps:
        1. Select the **Azure subscription** that has the VM.
        1. For **Managed identity**, select **Virtual machine**
        1. Select your virtual machine's managed identity. 
        1. Select **Select** at the bottom of the page.
        
            :::image type="content" source="./media/event-hubs-quickstart-kafka-enabled-event-hubs/add-vm-identity.png" alt-text="Screenshot showing the Add role assignment -> Select managed identities page.":::      
    1. Select **Review + Assign**.

        :::image type="content" source="./media/event-hubs-quickstart-kafka-enabled-event-hubs/review-assign.png" alt-text="Screenshot showing the Add role assignment page with role assigned to VM's managed identity.":::
1. Restart the VM and sign in back to the VM for which you configured the managed identity. 
1. Clone the [Azure Event Hubs for Kafka repository](https://github.com/Azure/azure-event-hubs-for-kafka).
1. Navigate to `azure-event-hubs-for-kafka/tutorials/oauth/java/managedidentity/consumer`.
1. Switch to the `src/main/resources/` folder, and open `consumer.config`. Replace `namespacename` with the name of your Event Hubs namespace. 

    ```xml
    bootstrap.servers=NAMESPACENAME.servicebus.windows.net:9093
    security.protocol=SASL_SSL
    sasl.mechanism=OAUTHBEARER
    sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required;
    sasl.login.callback.handler.class=CustomAuthenticateCallbackHandler;
    ```    

    > [!NOTE]
    > You can find all the OAuth samples for Event Hubs for Kafka [here](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/oauth).
7. Switch back to the **Consumer** folder where the pom.xml file is and, and run the consumer code and process events from event hub using your Kafka clients:

    ```java
    mvn clean package
    mvn exec:java -Dexec.mainClass="TestConsumer"                                    
    ```
1. Launch another command prompt window, and navigate to `azure-event-hubs-for-kafka/tutorials/oauth/java/managedidentity/producer`.
1. Switch to the `src/main/resources/` folder, and open `producer.config`. Replace `mynamespace` with the name of your Event Hubs namespace.       
4. Switch back to the **Producer** folder where the `pom.xml` file is and, run the producer code and stream events into Event Hubs:
   
    ```shell
    mvn clean package
    mvn exec:java -Dexec.mainClass="TestProducer"                                    
    ```    

    You should see messages about events sent in the producer window. Now, check the consumer app window to see the messages that it receives from the event hub.

      :::image type="content" source="./media/event-hubs-quickstart-kafka-enabled-event-hubs/producer-consumer-output.png" alt-text="Screenshot showing the Producer and Consumer app windows showing the events.":::

### [Connection string](#tab/connection-string)

1. Clone the [Azure Event Hubs for Kafka repository](https://github.com/Azure/azure-event-hubs-for-kafka).

1. Navigate to *azure-event-hubs-for-kafka/quickstart/java/producer*.

1. Update the configuration details for the producer in *src/main/resources/producer.config* as follows:

   ```xml
   bootstrap.servers=NAMESPACENAME.servicebus.windows.net:9093
   security.protocol=SASL_SSL
   sasl.mechanism=PLAIN
   sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="{YOUR.EVENTHUBS.CONNECTION.STRING}";
   ```

   > [!IMPORTANT]
   > Replace `{YOUR.EVENTHUBS.CONNECTION.STRING}` with the connection string for your Event Hubs namespace. For instructions on getting the connection string, see [Get an Event Hubs connection string](event-hubs-get-connection-string.md). Here's an example configuration: `sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="Endpoint=sb://mynamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXXXXX";`

1. Run the producer code and stream events into Event Hubs:

   ```shell
   mvn clean package
   mvn exec:java -Dexec.mainClass="TestProducer"
   ```

1. Navigate to *azure-event-hubs-for-kafka/quickstart/java/consumer*.

1. Update the configuration details for the consumer in *src/main/resources/consumer.config* as follows:

   ```xml
   bootstrap.servers=NAMESPACENAME.servicebus.windows.net:9093
   security.protocol=SASL_SSL
   sasl.mechanism=PLAIN
   sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="{YOUR.EVENTHUBS.CONNECTION.STRING}";
   ```

   > [!IMPORTANT]
   > Replace `{YOUR.EVENTHUBS.CONNECTION.STRING}` with the connection string for your Event Hubs namespace. For instructions on getting the connection string, see [Get an Event Hubs connection string](event-hubs-get-connection-string.md). Here's an example configuration: `sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="Endpoint=sb://mynamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXXXXX";`

1. Run the consumer code and process events from event hub using your Kafka clients:

   ```java
   mvn clean package
   mvn exec:java -Dexec.mainClass="TestConsumer"
   ```

If your Event Hubs Kafka cluster has events, you'll now start receiving them from the consumer.

---

## Schema validation for Kafka with Schema Registry  

You can use Azure Schema Registry to perform schema validation when you stream data with your Kafka applications using Event Hubs. 
Azure Schema Registry of Event Hubs provides a centralized repository for managing schemas and you can seamlessly connect your new or existing Kafka applications with Schema Registry. 

To learn more, see [Validate schemas for Apache Kafka applications using Avro](schema-registry-kafka-java-send-receive-quickstart.md). 

## Next steps

In this article, you learned how to stream into Event Hubs without changing your protocol clients or running your own clusters. To learn more, see [Apache Kafka developer guide for Azure Event Hubs](apache-kafka-developer-guide.md).
