---
title: Overview of Azure Relay .NET Standard APIs | Microsoft Docs
description: This article summarizes some of the key an overview of Azure Relay Hybrid Connections .NET Standard API.
ms.topic: article
ms.date: 06/23/2020
---

# Azure Relay Hybrid Connections .NET Standard API overview

This article summarizes some of the key Azure Relay Hybrid Connections .NET Standard [client APIs](/dotnet/api/microsoft.azure.relay).
  
## Relay Connection String Builder class

The [RelayConnectionStringBuilder][RelayConnectionStringBuilder] class formats connection strings that are specific to Relay Hybrid Connections. You can use it to verify the format of a connection string, or to build a connection string from scratch. See the following code for an example:

```csharp
var endpoint = "[Relay namespace]";
var entityPath = "[Name of the Hybrid Connection]";
var sharedAccessKeyName = "[SAS key name]";
var sharedAccessKey = "[SAS key value]";

var connectionStringBuilder = new RelayConnectionStringBuilder()
{
    Endpoint = endpoint,
    EntityPath = entityPath,
    SharedAccessKeyName = sasKeyName,
    SharedAccessKey = sasKeyValue
};
```

You can also pass a connection string directly to the `RelayConnectionStringBuilder` method. This operation enables you to verify that the connection string is in a valid format. If any of the parameters are invalid, the constructor generates an `ArgumentException`.

```csharp
var myConnectionString = "[RelayConnectionString]";
// Declare the connectionStringBuilder so that it can be used outside of the loop if needed
RelayConnectionStringBuilder connectionStringBuilder;
try
{
    // Create the connectionStringBuilder using the supplied connection string
    connectionStringBuilder = new RelayConnectionStringBuilder(myConnectionString);
}
catch (ArgumentException ae)
{
    // Perform some error handling
}
```

## Hybrid connection stream

The [HybridConnectionStream][HCStream] class is the primary object used to send and receive data from an Azure Relay endpoint, whether you are working with a [HybridConnectionClient][HCClient], or a [HybridConnectionListener][HCListener].

### Getting a Hybrid connection stream

#### Listener

Using a [HybridConnectionListener][HCListener] object, you can obtain a `HybridConnectionStream` object as follows:

```csharp
// Use the RelayConnectionStringBuilder to get a valid connection string
var listener = new HybridConnectionListener(csb.ToString());
// Open a connection to the Relay endpoint
await listener.OpenAsync();
// Get a `HybridConnectionStream`
var hybridConnectionStream = await listener.AcceptConnectionAsync();
```

#### Client

Using a [HybridConnectionClient][HCClient] object, you can obtain a `HybridConnectionStream` object as follows:

```csharp
// Use the RelayConnectionStringBuilder to get a valid connection string
var client = new HybridConnectionClient(csb.ToString());
// Open a connection to the Relay endpoint and get a `HybridConnectionStream`
var hybridConnectionStream = await client.CreateConnectionAsync();
```

### Receiving data

The [HybridConnectionStream][HCStream] class enables two-way communication. In most cases, you continuously receive from the stream. If you are reading text from the stream, you might also want to use a [StreamReader](https://msdn.microsoft.com/library/system.io.streamreader(v=vs.110).aspx) object, which enables easier parsing of the data. For example, you can read data as text, rather than as `byte[]`.

The following code reads individual lines of text from the stream until a cancellation is requested:

```csharp
// Create a CancellationToken, so that we can cancel the while loop
var cancellationToken = new CancellationToken();
// Create a StreamReader from the 'hybridConnectionStream`
var streamReader = new StreamReader(hybridConnectionStream);

while (!cancellationToken.IsCancellationRequested)
{
    // Read a line of input until a newline is encountered
    var line = await streamReader.ReadLineAsync();
    if (string.IsNullOrEmpty(line))
    {
        // If there's no input data, we will signal that 
        // we will no longer send data on this connection
        // and then break out of the processing loop.
        await hybridConnectionStream.ShutdownAsync(cancellationToken);
        break;
    }
}
```

### Sending data

Once you have a connection established, you can send a message to the Relay endpoint. Because the connection object inherits [Stream](https://msdn.microsoft.com/library/system.io.stream(v=vs.110).aspx), send your data as a `byte[]`. The following example shows how to do this:

```csharp
var data = Encoding.UTF8.GetBytes("hello");
await clientConnection.WriteAsync(data, 0, data.Length);
```

However, if you want to send text directly, without needing to encode the string each time, you can wrap the `hybridConnectionStream` object with a [StreamWriter](https://msdn.microsoft.com/library/system.io.streamwriter(v=vs.110).aspx) object.

```csharp
// The StreamWriter object only needs to be created once
var textWriter = new StreamWriter(hybridConnectionStream);
await textWriter.WriteLineAsync("hello");
```

## Next steps

To learn more about Azure Relay, visit these links:

* [Microsoft.Azure.Relay reference](/dotnet/api/microsoft.azure.relay)
* [What is Azure Relay?](relay-what-is-it.md)
* [Available Relay APIs](relay-api-overview.md)

[RelayConnectionStringBuilder]: /dotnet/api/microsoft.azure.relay.relayconnectionstringbuilder
[HCStream]: /dotnet/api/microsoft.azure.relay.hybridconnectionstream
[HCClient]: /dotnet/api/microsoft.azure.relay.hybridconnectionclient
[HCListener]: /dotnet/api/microsoft.azure.relay.hybridconnectionlistener