---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 10/30/2023
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependencies.
    ```bash
    dotnet add package Azure.Messaging.ServiceBus
    dotnet add package Azure.Identity
    ```
1. Authenticate using `Azure.Identity` and get the Service Bus namespace from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    
    ```csharp
    using Azure.Identity;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Configuration.AzureSERVICEBUS;
    
    string namespace = Environment.GetEnvironmentVariable("AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE");
    
    // Uncomment the following lines according to the authentication type.
    // system-assigned managed identity
    // var credential = new DefaultAzureCredential();
    
    // user-assigned managed identity
    // var credential = new DefaultAzureCredential(
    //     new DefaultAzureCredentialOptions
    //     {
    //         ManagedIdentityClientId = Environment.GetEnvironmentVariable("AZURE_SERVICEBUS_CLIENTID");
    //     });
    
    // service principal 
    // var tenantId = Environment.GetEnvironmentVariable("AZURE_SERVICEBUS_TENANTID");
    // var clientId = Environment.GetEnvironmentVariable("AZURE_SERVICEBUS_CLIENTID");
    // var clientSecret = Environment.GetEnvironmentVariable("AZURE_SERVICEBUS_CLIENTSECRET");
    // var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    
    var client = new ServiceBusClient(namespace, credential);
    ```
    
### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file:
    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-messaging-servicebus</artifactId>
        <version>7.13.3</version>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.8.0</version>
        <scope>compile</scope>
    </dependency>
    ```
1. Authenticate using `azure-identity` and get the Service Bus namespace from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

    ```java
    import com.azure.messaging.servicebus.*;
    import com.azure.identity.*;

    // Uncomment the following lines according to the authentication type.
    // for system-managed identity
    // DefaultAzureCredential defaultCredential = new DefaultAzureCredentialBuilder().build();

    // for user-assigned managed identity
    // DefaultAzureCredential defaultCredential = new DefaultAzureCredentialBuilder()
    //     .managedIdentityClientId(System.getenv("AZURE_SERVICEBUS_CLIENTID"))
    //     .build();

    // for service principal
    // ClientSecretCredential defaultCredential = new ClientSecretCredentialBuilder()
    //   .clientId(System.getenv("<AZURE_SERVICEBUS_CLIENTID>"))
    //   .clientSecret(System.getenv("<AZURE_SERVICEBUS_CLIENTSECRET>"))
    //   .tenantId(System.getenv("<AZURE_SERVICEBUS_TENANTID>"))
    //   .build();
    
    String namespace = System.getenv("AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE");

    // For example, create a Service Bus Sender client for a queue using a managed identity or a service principal.
    ServiceBusSenderClient senderClient = new ServiceBusClientBuilder()
            .fullyQualifiedNamespace(namespace)
            .credential(credential)
            .sender()
            .queueName("<queueName>")
            .buildClient();
    ```

### [SpringBoot](#tab/springBoot)

1. Add the following dependencies to your pom.xml file:
    ```xml
    <dependencyManagement>
      <dependencies>
        <dependency>
          <groupId>com.azure.spring</groupId>
          <artifactId>spring-cloud-azure-dependencies</artifactId>
          <version>4.12.0</version>
          <type>pom</type>
          <scope>import</scope>
        </dependency>
      </dependencies>
    </dependencyManagement>
    ```
1. Set up a Spring application. The Service Bus connection configuration properties are set to Spring Apps by Service Connector. For more information, check [Use Azure Service Bus in Spring applications](/azure/developer/java/spring-framework/using-service-bus-in-spring-applications).

### [Python](#tab/python)

1. Install dependencies.
    ```bash
    pip install azure-servicebus
    pip install azure-identity
    ```
1. Authenticate using `azure-identity` and get the Service Bus namespace from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```python
    import os
    from azure.servicebus.aio import ServiceBusClient
    from azure.servicebus import ServiceBusMessage
    from azure.identity import ManagedIdentityCredential, ClientSecretCredential
    
    # Uncomment the following lines according to the authentication type.
    # system-assigned managed identity
    # cred = ManagedIdentityCredential()
    
    # user-assigned managed identity
    # managed_identity_client_id = os.getenv('AZURE_SERVICEBUS_CLIENTID')
    # cred = ManagedIdentityCredential(client_id=managed_identity_client_id)
    
    # service principal
    # tenant_id = os.getenv('AZURE_SERVICEBUS_TENANTID')
    # client_id = os.getenv('AZURE_SERVICEBUS_CLIENTID')
    # client_secret = os.getenv('AZURE_SERVICEBUS_CLIENTSECRET')
    # cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)

    namespace = os.getenv('AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE')

    client = ServiceBusClient(fully_qualified_namespace=namespace, credential=cred)
    ```

### [Go](#tab/go)

1. Install dependencies.
    ```bash
    go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
    go get github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus
    ```
1. Authenticate using `azidentity` and get the Service Bus namespace from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```go
    import (
    	"context"
    	"errors"
    	"fmt"
    	"os"
    
    	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
    	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    	"github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus"
    )

    namespace, ok := os.LookupEnv("AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE")
	if !ok {
		panic("AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE environment variable not found")
	}

	// Uncomment the following lines according to the authentication type.
    // For system-assigned identity.
    // cred, err := azidentity.NewDefaultAzureCredential(nil)
    
    // For user-assigned identity.
    // clientid := os.Getenv("AZURE_POSTGRESQL_CLIENTID")
    // azidentity.ManagedIdentityCredentialOptions.ID := clientid
    // options := &azidentity.ManagedIdentityCredentialOptions{ID: clientid}
    // cred, err := azidentity.NewManagedIdentityCredential(options)
    
    // For service principal.
    // clientid := os.Getenv("AZURE_POSTGRESQL_CLIENTID")
    // tenantid := os.Getenv("AZURE_POSTGRESQL_TENANTID")
    // clientsecret := os.Getenv("AZURE_POSTGRESQL_CLIENTSECRET")
    // cred, err := azidentity.NewClientSecretCredential(tenantid, clientid, clientsecret, &azidentity.ClientSecretCredentialOptions{})

	if err != nil {
		panic(err)
	}

	client, err := azservicebus.NewClient(namespace, cred, nil)
	if err != nil {
		panic(err)
	}
    ```

### [NodeJS](#tab/nodejs)

1. Install dependencies.
    ```bash
    npm install @azure/service-bus @azure/identity
    
    ```
1. Authenticate using `@azure/identity` and get the Service Bus namespace from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    
    ```javascript
    import { DefaultAzureCredential,ClientSecretCredential } from "@azure/identity";
    const { ServiceBusClient } = require("@azure/service-bus");
    
    // Uncomment the following lines according to the authentication type.
    // for system-assigned managed identity
    // const credential = new DefaultAzureCredential();
    
    // for user-assigned managed identity
    // const clientId = process.env.AZURE_SERVICEBUS_CLIENTID;
    // const credential = new DefaultAzureCredential({
    //     managedIdentityClientId: clientId
    // });
    
    // for service principal
    // const tenantId = process.env.AZURE_SERVICEBUS_TENANTID;
    // const clientId = process.env.AZURE_SERVICEBUS_CLIENTID;
    // const clientSecret = process.env.AZURE_SERVICEBUS_CLIENTSECRET;
    // const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    
    const fullyQualifiedNamespace = process.env.AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE;
    const client = new ServiceBusClient(fullyQualifiedNamespace, credential);
    ```

### [None](#tab/none)
For other languages, you can use the connection information that Service Connector sets to the environment variables to connect compute services to the Service Bus. For environment variable details, see [Integrate Service Bus with Service Connector](../how-to-integrate-service-bus.md).