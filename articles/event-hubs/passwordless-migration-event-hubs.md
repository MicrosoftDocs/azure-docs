---
title: Migrate applications to use passwordless authentication with Azure Event Hubs
titleSuffix: Azure Event Hubs
description: Learn to migrate existing applications away from Shared Key authorization with the account key to instead use Azure AD and Azure RBAC for enhanced security with Azure Event Hubs.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 06/12/2023
ms.service: event-hubs
ms.topic: how-to
ms.custom: devx-track-csharp, passwordless-java, passwordless-js, passwordless-python, passwordless-dotnet, passwordless-go, devx-track-azurecli, devx-track-azurepowershell
---

# Migrate an application to use passwordless connections with Azure Event Hubs

[!INCLUDE [passwordless-intro](../../includes/passwordless/migration-guide/passwordless-intro.md)]

## Configure your local development environment

Passwordless connections can be configured to work for both local and Azure-hosted environments. In this section, you'll apply configurations to allow individual users to authenticate to Azure Event Hubs for local development.

### Assign user roles

[!INCLUDE [assign-roles-event-hubs](../../includes/assign-roles-event-hubs.md)]

### Sign-in to Azure locally

[!INCLUDE [default-azure-credential-sign-in](../../includes/passwordless/default-azure-credential-sign-in.md)]

### Update the application code to use passwordless connections

The Azure Identity client library, for each of the following ecosystems, provides a `DefaultAzureCredential` class that handles passwordless authentication to Azure:

- [.NET](/dotnet/api/overview/azure/Identity-readme?view=azure-dotnet&preserve-view=true#defaultazurecredential)
- [C++](https://github.com/Azure/azure-sdk-for-cpp/blob/main/sdk/identity/azure-identity/README.md#defaultazurecredential)
- [Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#readme-defaultazurecredential)
- [Java](/java/api/overview/azure/identity-readme?view=azure-java-stable&preserve-view=true#defaultazurecredential)
- [Node.js](/javascript/api/overview/azure/identity-readme?view=azure-node-latest&preserve-view=true#defaultazurecredential)
- [Python](/python/api/overview/azure/identity-readme?view=azure-python&preserve-view=true#defaultazurecredential)

`DefaultAzureCredential` supports multiple authentication methods. The method to use is determined at runtime. This approach enables your app to use different authentication methods in different environments (local vs. production) without implementing environment-specific code. See the preceding links for the order and locations in which `DefaultAzureCredential` looks for credentials.

## [.NET](#tab/dotnet)

1. To use `DefaultAzureCredential` in a .NET application, install the `Azure.Identity` package:

   ```dotnetcli
   dotnet add package Azure.Identity
   ```

1. At the top of your file, add the following code:

   ```csharp
   using Azure.Identity;
   ```

1. Identify the locations in your code that create an `EventHubProducerClient` or `EventProcessorClient` object to connect to Azure Event Hubs. Update your code to match the following example:

    ```csharp
    DefaultAzureCredential credential = new();
    var eventHubNamespace = $"https://{namespace}.servicebus.windows.net";

    // Event Hubs producer
    EventHubProducerClient producerClient = new(
        eventHubNamespace,
        eventHubName,
        credential);

    // Event Hubs processor
    EventProcessorClient processorClient = new(
        storageClient,
        EventHubConsumerClient.DefaultConsumerGroupName,
        eventHubNamespace,
        eventHubName,
        credential);
    ```

## [Go](#tab/go)

1. To use `DefaultAzureCredential` in a Go application, install the `azidentity` module:

    ```bash
    go get -u github.com/Azure/azure-sdk-for-go/sdk/azidentity
    ```

1. At the top of your file, add the following code:

    ```go
    import (
        "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    )
    ```

1. Identify the locations in your code that create a `ProducerClient` or `ConsumerClient` instance to connect to Azure Event Hubs. Update your code to match the following example:

    ```go
    credential, err := azidentity.NewDefaultAzureCredential(nil)
    eventHubNamespace := fmt.Sprintf(
        "https://%s.servicebus.windows.net",
        namespace)

    if err != nil {
        // handle error
    }

    // Event Hubs producer
    producerClient, err = azeventhubs.NewProducerClient(
        eventHubNamespace,
        eventHubName,
        credential,
        nil)

    if err != nil {
        // handle error
    }

    // Event Hubs processor
    processorClient, err = azeventhubs.NewConsumerClient(
        eventHubNamespace,
        eventHubName,
        azeventhubs.DefaultConsumerGroup,
        credential,
        nil)

    if err != nil {
        // handle error
    }
    ```

## [Java](#tab/java)

1. To use `DefaultAzureCredential` in a Java application, install the `azure-identity` package via one of the following approaches:
    1. [Include the BOM file](/java/api/overview/azure/identity-readme?view=azure-java-stable&preserve-view=true#include-the-bom-file).
    1. [Include a direct dependency](/java/api/overview/azure/identity-readme?view=azure-java-stable&preserve-view=true#include-direct-dependency).

1. At the top of your file, add the following code:

    ```java
    import com.azure.identity.DefaultAzureCredentialBuilder;
    ```

1. Identify the locations in your code that create an `EventHubProducerClient` or `EventProcessorClient` object to connect to Azure Event Hubs. Update your code to match the following example:

    ```java
    DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
        .build();
    String eventHubNamespace = "https://" + namespace + ".servicebus.windows.net";

    // Event Hubs producer
    EventHubProducerClient producerClient = new EventHubClientBuilder()
        .credential(eventHubNamespace, eventHubName, credential)
        .buildProducerClient();

    // Event Hubs processor
    EventProcessorClient processorClient = new EventProcessorClientBuilder()
        .consumerGroup(consumerGroupName)
        .credential(eventHubNamespace, eventHubName, credential)
        .checkpointStore(new SampleCheckpointStore())
        .processEvent(eventContext -> {
            System.out.println(
                "Partition ID = " +
                eventContext.getPartitionContext().getPartitionId() +
                " and sequence number of event = " +
                eventContext.getEventData().getSequenceNumber());
        })
        .processError(errorContext -> {
            System.out.println(
                "Error occurred while processing events " +
                errorContext.getThrowable().getMessage());
        })
        .buildEventProcessorClient();
    ```

## [Node.js](#tab/nodejs)

1. To use `DefaultAzureCredential` in a Node.js application, install the `@azure/identity` package:

    ```bash
    npm install --save @azure/identity
    ```

1. At the top of your file, add the following code:

    ```nodejs
    import { DefaultAzureCredential } from "@azure/identity";
    ```

1. Identify the locations in your code that create an `EventHubProducerClient` or `EventHubConsumerClient` object to connect to Azure Event Hubs. Update your code to match the following example:

    ```nodejs
    const credential = new DefaultAzureCredential();
    const eventHubNamespace = `https://${namespace}.servicebus.windows.net`;

    // Event Hubs producer    
    const producerClient = new EventHubProducerClient(
        eventHubNamespace,
        eventHubName,
        credential);

    // Event Hubs processor
    const processorClient = new EventHubConsumerClient(
        consumerGroupName,
        eventHubNamespace,
        eventHubName,
        credential
    );
    ```

## [Python](#tab/python)

1. To use `DefaultAzureCredential` in a Python application, install the `azure-identity` package:
    
    ```bash
    pip install azure-identity
    ```

1. At the top of your file, add the following code:

    ```python
    from azure.identity import DefaultAzureCredential
    ```

1. Identify the locations in your code that create an `EventHubProducerClient` or `EventHubConsumerClient` object to connect to Azure Event Hubs. Update your code to match the following example:

    ```python
    credential = DefaultAzureCredential()
    event_hub_namespace = "https://%s.servicebus.windows.net" % namespace

    # Event Hubs producer
    producer_client = EventHubProducerClient(
        fully_qualified_namespace = event_hub_namespace,
        eventhub_name = event_hub_name,
        credential = credential
    )

    # Event Hubs processor
    processor_client = EventHubConsumerClient(
        fully_qualified_namespace = event_hub_namespace,
        eventhub_name = event_hub_name,
        consumer_group = "$Default",
        checkpoint_store = checkpoint_store,
        credential = credential
    )
    ```

---

4. Make sure to update the event hubs namespace in the URI of your `EventHubProducerClient` or `EventProcessorClient` objects. You can find the namespace name on the overview page of the Azure portal.

    :::image type="content" source="media/event-hubs-passwordless/event-hubs-namespace.png" alt-text="Screenshot showing how to find the namespace name.":::

### Run the app locally

After making these code changes, run your application locally. The new configuration should pick up your local credentials, such as the Azure CLI, Visual Studio, or IntelliJ. The roles you assigned to your user in Azure allows your app to connect to the Azure service locally.

## Configure the Azure hosting environment

Once your application is configured to use passwordless connections and runs locally, the same code can authenticate to Azure services after it's deployed to Azure. The sections that follow explain how to configure a deployed application to connect to Azure Event Hubs using a [managed identity](/azure/active-directory/managed-identities-azure-resources/overview). Managed identities provide an automatically managed identity in Azure Active Directory (Azure AD) for applications to use when connecting to resources that support Azure AD authentication. Learn more about managed identities:

* [Passwordless Overview](/azure/developer/intro/passwordless-overview)
* [Managed identity best practices](/azure/active-directory/managed-identities-azure-resources/managed-identity-best-practice-recommendations)

### Create the managed identity

[!INCLUDE [create-user-assigned-managed-identity](../../includes/passwordless/migration-guide/create-user-assigned-managed-identity.md)]

#### Associate the managed identity with your web app

You need to configure your web app to use the managed identity you created. Assign the identity to your app using either the Azure portal or the Azure CLI.

# [Azure portal](#tab/azure-portal-associate)

Complete the following steps in the Azure portal to associate an identity with your app. These same steps apply to the following Azure services:

* Azure Spring Apps
* Azure Container Apps
* Azure virtual machines
* Azure Kubernetes Service

1. Navigate to the overview page of your web app.
1. Select **Identity** from the left navigation.
1. On the **Identity** page, switch to the **User assigned** tab.
1. Select **+ Add** to open the **Add user assigned managed identity** flyout.
1. Select the subscription you used previously to create the identity.
1. Search for the **MigrationIdentity** by name and select it from the search results.
1. Select **Add** to associate the identity with your app.

   :::image type="content" source="../../articles/storage/common/media/create-user-assigned-identity-small.png" alt-text="Screenshot showing how to create a user assigned identity." lightbox="../../articles/storage/common/media/create-user-assigned-identity.png":::

# [Azure CLI](#tab/azure-cli-associate)

[!INCLUDE [associate-managed-identity-cli](../../includes/passwordless/migration-guide/associate-managed-identity-cli.md)]

# [Service Connector](#tab/service-connector-associate)

[!INCLUDE [service-connector-commands-event-hubs](../../includes/passwordless/migration-guide/service-connector-commands-event-hubs.md)]

---

### Assign roles to the managed identity

Next, you need to grant permissions to the managed identity you created to access your event hub. Grant permissions by assigning a role to the managed identity, just like you did with your local development user.

### [Azure portal](#tab/assign-role-azure-portal)

1. Navigate to your event hub overview page and select **Access Control (IAM)** from the left navigation.

1. Choose **Add role assignment**

    :::image type="content" source="../../includes/passwordless/media/migration-add-role-small.png" alt-text="Screenshot showing how to add a role to a managed identity." lightbox="../../includes/passwordless/media/migration-add-role.png" :::

1. In the **Role** search box, search for *Azure Event Hub Data Sender*, which is a common role used to manage data operations for queues. You can assign whatever role is appropriate for your use case. Select the *Azure Event Hub Data Sender* from the list and choose **Next**.

1. On the **Add role assignment** screen, for the **Assign access to** option, select **Managed identity**. Then choose **+Select members**.

1. In the flyout, search for the managed identity you created by name and select it from the results. Choose **Select** to close the flyout menu.

    :::image type="content" source="../../includes/passwordless/media/migration-select-identity-small.png" alt-text="Screenshot showing how to select the assigned managed identity." lightbox="../../includes/passwordless/media/migration-select-identity.png":::

1. Select **Next** a couple times until you're able to select **Review + assign** to finish the role assignment.

1. Repeat these steps for the **Azure Event Hub Data Receiver** role.

### [Azure CLI](#tab/assign-role-azure-cli)

To assign a role at the resource level using the Azure CLI, you first must retrieve the resource ID using the [az eventhubs eventhub show](/cli/azure/eventhubs/eventhub) show command. You can filter the output properties using the `--query` parameter.

```azurecli
az eventhubs eventhub show \
    --resource-group '<your-resource-group-name>' \
    --namespace-name '<your-event-hubs-namespace>' \
    --name '<your-event-hub-name>' \
    --query id
```

Copy the output ID from the preceding command. You can then assign roles using the [az role assignment](/cli/azure/role/assignment) command of the Azure CLI.

```azurecli
az role assignment create --assignee "<user@domain>" \
    --role "Azure Event Hubs Data Receiver" \
    --scope "<your-resource-id>"

az role assignment create --assignee "<user@domain>" \
    --role "Azure Event Hubs Data Sender" \
    --scope "<your-resource-id>"
```

### [Service Connector](#tab/assign-role-service-connector)

If you connected your services using Service Connector you don't need to complete this step. The necessary role configurations were handled for you when you ran the Service Connector CLI commands.

---

[!INCLUDE [Code changes to use user-assigned managed identity](../../includes/passwordless/migration-guide/passwordless-user-assigned-managed-identity.md)]

### Test the app

After deploying the updated code, browse to your hosted application in the browser. Your app should be able to connect to the event hub successfully. Keep in mind that it may take several minutes for the role assignments to propagate through your Azure environment. Your application is now configured to run both locally and in a production environment without the developers having to manage secrets in the application itself.

## Next steps

In this tutorial, you learned how to migrate an application to passwordless connections.

You can read the following resources to explore the concepts discussed in this article in more depth:

* [Passwordless connections for Azure services](/azure/developer/intro/passwordless-overview)
* To learn more about .NET, see [Get started with .NET in 10 minutes](https://dotnet.microsoft.com/learn/dotnet/hello-world-tutorial/intro).
