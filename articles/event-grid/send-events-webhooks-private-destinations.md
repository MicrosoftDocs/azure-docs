---
title: Send events to webhooks hosted in private destinations
description: Shows how to send events to webhooks in private destinations using Azure Event Grid and Azure Relay. 
ms.topic: how-to
ms.date: 08/23/2024
# Customer intent: As a developer, I want to know how to send events to webhooks hosted in private destinations such as on-premises servers or virtual machines. 
---

# Send events to webhooks hosted in private destinations using Azure Event Grid and Azure Relay
In this article, you learn how to receive events from Azure Event Grid to webhooks hosted in private destinations, such as on-premises servers or virtual machines, using Azure Relay. 

Azure Relay is a service that enables you to securely expose services that reside within a corporate enterprise network to the public cloud, without having to open a firewall connection or require intrusive changes to a corporate network infrastructure. 

Azure Relay supports hybrid connections, which are a secure, open-protocol evolution of the existing Azure Relay features that can be implemented on any platform and in any language that has a basic WebSocket capability, which includes the option to accept relayed traffic initiated from Azure Event Grid. See [Azure Relay Hybrid Connections protocol guide - Azure Relay](../azure-relay/relay-hybrid-connections-protocol.md).

## Receive events from Event Grid basic resources to webhooks in private destinations
This section gives you the high-level steps for receiving events from Event Grid basic resources to webhooks hosted in private destinations using Azure Relay. 

1. Create an Azure Relay resource. You can use the Azure portal, Azure CLI, or Azure Resource Manager templates to create a Relay namespace and a hybrid connection. For more information, see [Create Azure Relay namespaces and hybrid connections using Azure portal](../azure-relay/relay-hybrid-connections-http-requests-dotnet-get-started.md).

    > [!NOTE]
    > Ensure you have enabled the option: **client authorization required**. This option ensures that only authorized clients can connect to your hybrid connection endpoint. You can use the Azure portal or Azure CLI to enable the client authorization and manage the client authorization rules. For more information, see [Secure Azure Relay Hybrid Connections](../azure-relay/relay-authentication-and-authorization.md).
1. Implement the Azure Relay hybrid connection listener.

    - **Option 1**: You can use the Azure Relay SDK for .NET to programmatically create a hybrid connection listener and handle the incoming requests. For more information, see [Azure Relay Hybrid Connections - HTTP requests in .NET](../azure-relay/relay-hybrid-connections-http-requests-dotnet-get-started.md).
    - **Option 2**: Azure Relay Bridge. You can use Azure Relay Bridge, a cross-platform command line tool that can create VPN-less TCP tunnels from and to anywhere. You can run the Azure Relay Bridge as a Docker container or as a standalone executable. For more information, see [Azure Relay Bridge](https://github.com/Azure/azure-relay-bridge).
1. Ensure your hybrid connection listener is connected. You can use the following Azure CLI command to list the hybrid connections in your namespace and check their status. 

    ```azurecli
    az relay hyco list --resource-group [resource-group-name] --namespace-name [namespace-name]. You should see a "listenerCount" attribute in the properties of your hybrid connection.
    ```
1. Create an Azure Event Grid system topic. You can use the Azure portal, Azure CLI, or Azure Resource Manager templates to create a system topic that corresponds to an Azure service that has events, such as Storage accounts, event hubs, or Azure subscriptions. For more information, see [System topics in Azure Event Grid](create-view-manage-system-topics.md).
1. Create an event subscription to the system topic. You can use the Azure portal, Azure CLI, or Azure Resource Manager templates to create an event subscription that defines the filter criteria and the destination endpoint for the events. In this case, select the **Azure Relay Hybrid Connection** as the endpoint type and provide the connection string of your hybrid connection. For more information, see [Azure Relay Hybrid Connection as an event handler](handler-relay-hybrid-connections.md).


## Considerations when using webhooks to receive events from Azure Event Grid
Ensure you have the Cloud Events validation handshake implemented. Here's the sample code in C# that demonstrates how to validate the Cloud Event schema handshake required during the subscription creation. You can use this sample code as a reference to implement your own validation handshake logic in the language of your preference.

```csharp
if (context.Request.HttpMethod == "OPTIONS" && context.Request.Url.PathAndQuery == _settings!.relayWebhookPath)
{
                context.Response.StatusCode = HttpStatusCode.OK;
                context.Response.StatusDescription = "OK";

                var origin = context.Request.Headers["Webhook-Request-Origin"];
                context.Response.Headers.Add("Webhook-Allowed-Origin", origin);
                using (var sw = new StreamWriter(context.Response.OutputStream))
                {
                                sw.WriteLine("OK");
                }

                context.Response.Close();
}
```

If you want to forward events from the Azure Relay Bridge to your local webhook you can use the following command:

```bash
.\azbridge.exe -x "AzureRelayConnectionString" -H [HybridConnectionName]:[http/https]/localhost:[ApplicationPort] -v
```

## Related content

- [Azure Relay Hybrid Connection as an event handler](handler-relay-hybrid-connections.md)
- [Azure Relay Bridge](https://github.com/Azure/azure-relay-bridge)