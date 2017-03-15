---
title: Overview of the Azure Relay .NET Standard APIs | Microsoft Docs
description: Relay .NET Standard API overview
services: service-bus-relay
documentationcenter: na
author: jtaubensee
manager: timlt
editor: ''

ms.assetid: b1da9ac1-811b-4df7-a22c-ccd013405c40
ms.service: service-bus-relay
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/15/2017
ms.author: jotaub
---

# Azure Relay Hybrid Connections .NET Standard API overview
This article summarizes some of the key [Azure Relay Hybrid Connections .NET Standard client APIs](/dotnet/api/microsoft.azure.relay).
  
## Relay connection string builder
The [**RelayConnectionStringBuilder**](/dotnet/api/microsoft.azure.relay.relayconnectionstringbuilder) class will format connection strings that are specific to Relay Hybrid Connections. You can use it to verify the format of a connection string, or to build a connection string from scratch. See the following for an example.

```csharp
var endpoint = "{ Relay namespace }";
var entityPath = "{ Name of the Hybrid Connection }";
var sharedAccessKeyName = "{ SAS key name }";
var sharedAccessKey = "{ SAS key value }";

var connectionStringBuilder = new RelayConnectionStringBuilder()
{
    Endpoint = endpoint,
    EntityPath = entityPath,
    SharedAccessKeyName = sasKeyName,
    SharedAccessKey = sasKeyValue
};
```

## Hybrid Connection client
The [**HybridConnectionClient**](/dotnet/api/microsoft.azure.relay.hybridconnectionclient) is the primary object used to create a client for Hybrid Connections. 

### Create a Hybrid Connection client and connect to the Relay endpoint
The easiest way to create a `HybridConnectionClient` is with a Relay connection string. Using the above example of a [`RelayConnectionStringBuilder`](#relay-connection-string-builder), you can call `connectionStringBuilder.ToString()` to populate the required parameter. Once the `HybridConnectionClient` object is instantiated, you can then create a connection to the Relay endpoint.

```csharp
var client = new HybridConnectionClient(csb.ToString());
var clientConnection = await client.CreateConnectionAsync();
```

### Send a message
Once you have a connection established, you can send a message to the Relay endpoint. Since the connection object inherits [`Stream`](https://msdn.microsoft.com/library/system.io.stream(v=vs.110).aspx), you will need to send your data as a `byte[]`. The following example shows how to do this:

```csharp
var data = Encoding.UTF8.GetBytes("hello");
await clientConnection.WriteAsync(data, 0, data.Length);
```

However, if you would like to send text directly, without needing to encode the string each time you can wrap the stream with a writer.

```csharp
// The StreamWriter object only needs to be created once
var textWriter = new StreamWriter(clientConnection);
await textWriter.WriteLineAsync("hello");
```

### Listen for a message
Since Relay provides two-way communication, you can listen for data using the [**HybridConnectionClient**](/dotnet/api/microsoft.azure.relay.hybridconnectionclient). To do so, see the following:

```csharp
// Create a CancellationToken, so that we can cancel the while loop
var cancellationToken = new CancellationToken();
// Create a StreamReader that will allow us to 
var streamReader = new StreamReader(clientConnection);

while (!cancellationToken.IsCancellationRequested)
{
    // Read a line of input until a newline is encountered
    var line = await streamReader.ReadLineAsync();

    if (string.IsNullOrEmpty(line))
    {
        // If there's no input data, we will signal that 
        // we will no longer send data on this connection
        // and then break out of the processing loop.
        await clientConnection.ShutdownAsync(cancellationToken);
        break;
    }
}
```

## Next steps
To learn more about Azure Relay, visit these links:

* [What is Azure Relay?](relay-what-is-it.md)
* [Available Relay apis](relay-api-overview.md)

The .NET API reference is [Microsoft.Azure.Relay](/dotnet/api/microsoft.azure.relay)