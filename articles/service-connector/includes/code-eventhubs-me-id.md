---
author: wchigit
description: Code sample, managed identity
ms.service: service-connector
ms.topic: include
ms.date: 04/08/2026
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependencies.

    ```bash
    dotnet add package Azure.Identity
    dotnet add package Azure.Messaging.EventHubs
    ```

1. Run the following code, uncommenting the part of the code snippet for the authentication type you want to use. The code authenticates using `Azure.Identity` and gets the Azure Event Hubs namespace from the Service Connector environment variables.

    ```csharp
    using System; 
    using Azure.Identity;
    using Azure.Messaging.EventHubs;

    // Uncomment the following lines corresponding to the authentication type you want to use.
    // system-assigned managed identity
    // var credential = new DefaultAzureCredential();
    
    // user-assigned managed identity
    // var credential = new DefaultAzureCredential(
    //     new DefaultAzureCredentialOptions
    //     {
    //         ManagedIdentityClientId = Environment.GetEnvironmentVariable("AZURE_EVENTHUB_CLIENTID");
    //     });
    
    // service principal 
    // var tenantId = Environment.GetEnvironmentVariable("AZURE_EVENTHUB_TENANTID");
    // var clientId = Environment.GetEnvironmentVariable("AZURE_EVENTHUB_CLIENTID");
    // var clientSecret = Environment.GetEnvironmentVariable("AZURE_EVENTHUB_CLIENTSECRET");
    // var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

    var fullyQualifiedNamespace = Environment.GetEnvironmentVariable("AZURE_EVENTHUB_FULLYQUALIFIEDNAMESPACE");
    var eventHubName = "<NAME OF THE EVENT HUB>";

    // Example of sending events
    var producer = new EventHubProducerClient(fullyQualifiedNamespace, eventHubName, credential);
    ```

### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file:

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-messaging-eventhubs</artifactId>
        <version>5.15.0</version>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.1.5</version>
    </dependency>
    ```

1. Run the following code, uncommenting the part of the code snippet for the authentication type you want to use. The code authenticates using `azure-identity` and gets the Azure Event Hubs namespace from the Service Connector environment variables.

    ```java
    // Uncomment the following lines corresponding to the authentication type you want to use.
    // for system-managed identity
    // DefaultAzureCredential credential = new DefaultAzureCredentialBuilder().build();

    // for user-assigned managed identity
    // DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
    //     .managedIdentityClientId(System.getenv("AZURE_EVENTHUB_CLIENTID"))
    //     .build();

    // for service principal
    // ClientSecretCredential credential = new ClientSecretCredentialBuilder()
    //   .clientId(System.getenv("AZURE_EVENTHUB_CLIENTID"))
    //   .clientSecret(System.getenv("AZURE_EVENTHUB_CLIENTSECRET"))
    //   .tenantId(System.getenv("AZURE_EVENTHUB_TENANTID"))
    //   .build();
    
    String namespace = System.getenv("AZURE_EVENTHUB_FULLYQUALIFIEDNAMESPACE");

    // Example of sending events
    EventProcessorClientBuilder eventProcessorClientBuilder = new EventProcessorClientBuilder()
        .consumerGroup(EventHubClientBuilder.DEFAULT_CONSUMER_GROUP_NAME)
        .credential(namespace, "<event-hub-name>", credential)
    EventProcessorClient eventProcessorClient = eventProcessorClientBuilder.buildEventProcessorClient();    
    ```

### [Spring Boot](#tab/springBoot)

To set up your Spring application, see [Spring Cloud Stream with Azure Event Hubs](/azure/developer/java/spring-framework/configure-spring-cloud-stream-binder-java-app-azure-event-hub?toc=%2Fazure%2Fevent-hubs%2FTOC.json) and [Using Spring Integration for Azure Event Hubs](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.4.1/eventhubs/spring-cloud-azure-starter-integration-eventhubs/eventhubs-integration).

Service Connector adds the configuration properties to Spring Apps. Service Connector provides two sets of configuration properties, depending on whether the Spring Cloud Azure version is below 4.0 or above 4.0. For more information about Spring Cloud Azure library changes, see the [Spring Cloud Azure Migration Guide](https://microsoft.github.io/spring-cloud-azure/current/reference/html/appendix.html#configuration-spring-cloud-azure-starter-integration-eventhubs).

### [Kafka Spring Boot](#tab/kafka-springBoot)

To set up your Spring application, see [Use Spring Kafka with Azure Event Hubs for Kafka API](/azure/developer/java/spring-framework/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub?tabs=passwordless). Service Connector adds the configuration properties to Spring Apps.

### [Python](#tab/python)

1. Install dependencies.

    ```bash
    pip install azure-eventhub
    pip install azure-identity
    ```

1. Run the following code, uncommenting the part of the code snippet for the authentication type you want to use. The code authenticates using `azure-identity` and gets the Azure Event Hubs namespace from the Service Connector environment variables.

    ```python
    import os
    from azure.eventhub import EventData
    from azure.eventhub.aio import EventHubProducerClient

    # Uncomment the following lines corresponding to the authentication type you want to use.
    # system-assigned managed identity
    # cred = ManagedIdentityCredential()
    
    # user-assigned managed identity
    # managed_identity_client_id = os.getenv('AZURE_EVENTHUB_CLIENTID')
    # cred = ManagedIdentityCredential(client_id=managed_identity_client_id)
    
    # service principal
    # tenant_id = os.getenv('AZURE_EVENTHUB_TENANTID')
    # client_id = os.getenv('AZURE_EVENTHUB_CLIENTID')
    # client_secret = os.getenv('AZURE_EVENTHUB_CLIENTSECRET')
    # cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)

    namespace = os.getenv("AZURE_EVENTHUB_FULLYQUALIFIEDNAMESPACE")
    EVENT_HUB_NAME = "EVENT_HUB_NAME"

    # Example of sending events
    producer = EventHubProducerClient(
        fully_qualified_namespace=namespace,
        eventhub_name=EVENT_HUB_NAME,
        credential=cred,
    )
    ```

### [Go](#tab/go)

1. Install dependencies.

    ```bash
    go get github.com/Azure/azure-sdk-for-go/sdk/messaging/azeventhubs
    go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
    ```

1. Run the following code, uncommenting the part of the code snippet for the authentication type you want to use. The code authenticates using `azidentity` and gets the Azure Event Hubs namespace from the Service Connector environment variables.


    ```go
    import (
        "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
        "github.com/Azure/azure-sdk-for-go/sdk/messaging/azeventhubs"
    )
    // Uncomment the following lines corresponding to the authentication type you want to use.
    // for system-assigned managed identity
    // cred, err := azidentity.NewDefaultAzureCredential(nil)

    // for user-assigned managed identity
    // clientid := os.Getenv("AZURE_EVENTHUB_CLIENTID")
    // azidentity.ManagedIdentityCredentialOptions.ID := clientid
    // options := &azidentity.ManagedIdentityCredentialOptions{ID: clientid}
    // cred, err := azidentity.NewManagedIdentityCredential(options)

    // for service principal
    // clientid := os.Getenv("AZURE_EVENTHUB_CLIENTID")
    // tenantid := os.Getenv("AZURE_EVENTHUB_TENANTID")
    // clientsecret := os.Getenv("AZURE_EVENTHUB_CLIENTSECRET")
    // cred, err := azidentity.NewClientSecretCredential(tenantid, clientid, clientsecret, &azidentity.ClientSecretCredentialOptions{})
        
    namespace := os.Getenv("AZURE_EVENTHUB_FULLYQUALIFIEDNAMESPACE")

    // Example of sending events
    producerClient, err := azeventhubs.NewProducerClient(namespace, "<eventhub-name>", defaultAzureCred, nil)
    if err != nil {
        panic(err)
    }
    ```

### [NodeJS](#tab/nodejs)

1. Install dependencies.

    ```bash
    npm install @azure/event-hubs
    npm install @azure/identity
    ```

1. Run the following code, uncommenting the part of the code snippet for the authentication type you want to use. The code authenticates using `@azure/identity` and gets the Azure Event Hubs namespace from the Service Connector environment variables.

    ```javascript
    const { EventHubProducerClient } = require("@azure/event-hubs");
    import { DefaultAzureCredential,ClientSecretCredential } from "@azure/identity";

    // Uncomment the following lines corresponding to the authentication type you want to use.
    // for system-assigned managed identity
    // const credential = new DefaultAzureCredential();

    // for user-assigned managed identity
    // const clientId = process.env.AZURE_EVENTHUB_CLIENTID;
    // const credential = new DefaultAzureCredential({
    //     managedIdentityClientId: clientId
    // });

    // for service principal
    // const tenantId = process.env.AZURE_EVENTHUB_TENANTID;
    // const clientId = process.env.AZURE_EVENTHUB_CLIENTID;
    // const clientSecret = process.env.AZURE_EVENTHUB_CLIENTSECRET;
    // const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

    const namespace = process.env.AZURE_EVENTHUB_FULLYQUALIFIEDNAMESPACE; 
    const eventHubName = "EVENT HUB NAME";

    // Example of sending events
    const producer = new EventHubProducerClient(fullyQualifiedNamespace, eventHubName, credential);
    ```

### [Other](#tab/none)
For other languages, you can use the environment variables Service Connector adds as configuration properties to connect to Event Hubs.

---
