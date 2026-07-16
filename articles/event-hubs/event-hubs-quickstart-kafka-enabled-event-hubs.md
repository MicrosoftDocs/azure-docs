---
title: "Quickstart: Use Apache Kafka with Azure Event Hubs"
description: Apache Kafka with Azure Event Hubs lets you stream data without managing clusters. Learn how to configure producer and consumer apps in this quickstart.
ms.topic: quickstart
ms.date: 05/03/2026
author: spelluru
ms.subservice: kafka
ms.author: spelluru
ms.custom:
  - mode-other
  - passwordless-java
  - sfi-image-nochange
  - sfi-ropc-nochange
#customer intent: As a developer, I want to stream data using the Kafka protocol with Azure Event Hubs so that I can use my existing Kafka applications without running my own cluster.
---

# Quickstart: Stream data with Azure Event Hubs and Apache Kafka

Azure Event Hubs provides a Kafka endpoint that you can use to connect Apache Kafka applications to a managed streaming service without running your own cluster. If you already have Kafka producer or consumer applications, you can point them to Event Hubs with minimal configuration changes.

In this quickstart, you configure sample Kafka producer and consumer apps to stream data through an Event Hubs namespace using the Apache Kafka protocol.

> [!NOTE]
> This sample is available on [GitHub](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/java).

## Prerequisites

To complete this quickstart, make sure you have the following prerequisites:

* Read through the [Event Hubs for Apache Kafka](azure-event-hubs-apache-kafka-overview.md) article.
* An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.
* Create a Windows virtual machine and install the following components: 
    * [Java Development Kit (JDK) 1.7+](/azure/developer/java/fundamentals/java-support-on-azure).
    * [Download](https://maven.apache.org/download.cgi) and [install](https://maven.apache.org/install.html) a Maven binary archive.
    * [Git](https://www.git-scm.com/).

## Create an Azure Event Hubs namespace

When you create an Event Hubs namespace, the Kafka endpoint for the namespace is automatically enabled. You can stream events from your applications that use the Kafka protocol into event hubs. Follow step-by-step instructions in the [Create an event hub using Azure portal](event-hubs-create.md) to create an Event Hubs namespace. If you're using a dedicated cluster, see [Create a namespace and event hub in a dedicated cluster](event-hubs-dedicated-cluster-create-portal.md#create-a-namespace-and-event-hub-within-a-cluster).

> [!NOTE]
> Event Hubs for Kafka isn't supported in the **basic** tier.

## Send and receive messages with Kafka in Event Hubs

### [Passwordless (Recommended)](#tab/passwordless)
This section shows you how to enable a managed identity for a virtual machine and use that identity to authenticate with Event Hubs for Kafka. This authentication mechanism is recommended when connecting to Event Hubs for Kafka from Azure compute services because it eliminates the need for credentials in your code.

1. Enable a system-assigned managed identity for the virtual machine. For more information about configuring managed identity on a virtual machine (VM), see [Configure managed identities for Azure resources on a VM using the Azure portal](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md#system-assigned-managed-identity). Managed identities for Azure resources provide Azure services with an automatically managed identity in Microsoft Entra ID. You can use this identity to authenticate to any service that supports Microsoft Entra authentication, without having credentials in your code.

    :::image type="content" source="./media/event-hubs-quickstart-kafka-enabled-event-hubs/enable-identity-vm.png" alt-text="Screenshot of the Identity tab of a virtual machine page in the Azure portal.":::
1. Using the **Access control** page of the Event Hubs namespace you created, assign the **Azure Event Hubs Data Owner** role to the VM's managed identity. 
Azure Event Hubs supports using Microsoft Entra ID to authorize requests to Event Hubs resources. With Microsoft Entra ID, you can use Azure role-based access control (Azure RBAC) to grant permissions to a security principal, which can be a user or an application service principal.    
    1. In the Azure portal, navigate to your Event Hubs namespace. Go to **Access Control (IAM)** in the left navigation.    
    1. Select **+ Add** and select **Add role assignment**.    
    
        :::image type="content" source="./media/event-hubs-quickstart-kafka-enabled-event-hubs/add-role-assignment-menu.png" alt-text="Screenshot of the Access Control page of an Event Hubs namespace.":::        
    1. On the **Role** tab, select **Azure Event Hubs Data Owner**, and select **Next**.    
    
        :::image type="content" source="./media/event-hubs-quickstart-kafka-enabled-event-hubs/select-event-hubs-owner-role.png" alt-text="Screenshot showing the selection of the Azure Event Hubs Data Owner role.":::        
    1. In the **Members** tab, select the **Managed Identity** in the **Assign access to** section.    
    1. Select the **+Select members** link. 
    1. On the **Select managed identities** page, follow these steps:
        1. Select the **Azure subscription** that has the VM.
        1. For **Managed identity**, select **Virtual machine**.
        1. Select your virtual machine's managed identity. 
        1. Select **Select** at the bottom of the page.
        
            :::image type="content" source="./media/event-hubs-quickstart-kafka-enabled-event-hubs/add-vm-identity.png" alt-text="Screenshot showing the Add role assignment -> Select managed identities page.":::      
    1. Select **Review + Assign**.

        :::image type="content" source="./media/event-hubs-quickstart-kafka-enabled-event-hubs/review-assign.png" alt-text="Screenshot showing the Add role assignment page with role assigned to VM's managed identity.":::
1. Restart the VM and sign back in to the VM for which you configured the managed identity. 
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
1. Switch back to the **Consumer** folder where the `pom.xml` file is, and run the consumer code to process events from the event hub using your Kafka clients:

    ```java
    mvn clean package
    mvn exec:java -Dexec.mainClass="TestConsumer"                                    
    ```
1. Launch another command prompt window, and navigate to `azure-event-hubs-for-kafka/tutorials/oauth/java/managedidentity/producer`.
1. Switch to the `src/main/resources/` folder, and open `producer.config`. Replace `mynamespace` with the name of your Event Hubs namespace.       
1. Switch back to the **Producer** folder where the `pom.xml` file is, and run the producer code to stream events into Event Hubs:
   
    ```shell
    mvn clean package
    mvn exec:java -Dexec.mainClass="TestProducer"                                    
    ```    

    You see messages about events sent in the producer window. Now, check the consumer app window to see the messages that it receives from the event hub.

      :::image type="content" source="./media/event-hubs-quickstart-kafka-enabled-event-hubs/producer-consumer-output.png" alt-text="Screenshot showing the Producer and Consumer app windows showing the events.":::

### [Connection string](#tab/connection-string)

1. Clone the [Azure Event Hubs for Kafka repository](https://github.com/Azure/azure-event-hubs-for-kafka).
1. Go to *azure-event-hubs-for-kafka/quickstart/java/consumer*.
1. Update the configuration details for the consumer in *src/main/resources/consumer.config* as follows:

   ```xml
   bootstrap.servers=NAMESPACENAME.servicebus.windows.net:9093
   security.protocol=SASL_SSL
   sasl.mechanism=PLAIN
   sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="{YOUR.EVENTHUBS.CONNECTION.STRING}";
   ```

   > [!IMPORTANT]
   > Replace `{YOUR.EVENTHUBS.CONNECTION.STRING}` with the connection string for your Event Hubs namespace. For instructions on getting the connection string, see [Get an Event Hubs connection string](event-hubs-get-connection-string.md). Here's an example configuration: `sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="Endpoint=sb://mynamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXXXXX";`
1. Run the consumer code and process events from the event hub by using your Kafka clients:

   ```java
   mvn clean package
   mvn exec:java -Dexec.mainClass="TestConsumer"
   ```
1. Go to *azure-event-hubs-for-kafka/quickstart/java/producer*.
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

If your Event Hubs Kafka cluster has events, you now start receiving them from the consumer.

---

## Schema validation for Kafka with Schema Registry  

You can use Azure Schema Registry to perform schema validation when you stream data with your Kafka applications using Event Hubs. 
Azure Schema Registry of Event Hubs provides a centralized repository for managing schemas, and you can seamlessly connect your new or existing Kafka applications with Schema Registry. 

To learn more, see [Validate schemas for Apache Kafka applications using Avro](schema-registry-kafka-java-send-receive-quickstart.md).

## Clean up resources

If you no longer need the resources, delete the resource group and all related resources. In the Azure portal, select the resource group for your Event Hubs namespace and select **Delete**.

## Next steps

In this article, you learned how to stream into Event Hubs without changing your protocol clients or running your own clusters. To learn more, see [Apache Kafka developer guide for Azure Event Hubs](apache-kafka-developer-guide.md).
