---
title: Migrate WCF Relay to Hybrid Connections
description: Migrate WCF Relay applications to Hybrid Connections by updating packages, authentication, listeners, senders, and application contracts.
author: EldertGrootenboer
ms.author: egrootenboer
ms.service: azure-relay
ms.topic: how-to
ms.date: 11/13/2026
ms.custom: devx-track-dotnet
# Customer intent: As a developer, I want to migrate a WCF Relay application to Hybrid Connections while preserving its required behavior.
---

# Migrate WCF Relay to Hybrid Connections

WCF Relay uses service contracts and bindings to define how client applications communicate with a service. Hybrid Connections supports HTTP request/response and bidirectional streams between a sender and a listener. The sender initiates a request or connection; with a stream, either side can then send data independently, allowing the service to send callbacks. For the architecture of both offerings, see the [Azure Relay overview](relay-what-is-it.md).

When you migrate, your application takes over the operation dispatch and serialization previously handled by WCF. This means updating both the listener and senders.

## Prerequisites

- Access to the listener and client code, WCF configuration, and service contracts
- An Azure subscription with permission to create Hybrid Connections and configure their access policies or role assignments

## Packages and namespaces

| Component | WCF Relay | Hybrid Connections |
| --- | --- | --- |
| NuGet package | `WindowsAzure.ServiceBus` | [Microsoft.Azure.Relay](https://www.nuget.org/packages/Microsoft.Azure.Relay/) |
| .NET namespaces | `Microsoft.ServiceBus`, `System.ServiceModel` | `Microsoft.Azure.Relay` |

The examples use the .NET client library. You can also implement the [Hybrid Connections protocol](relay-hybrid-connections-protocol.md) with HTTP and WebSocket libraries in another language or runtime, without these packages.

Add the Hybrid Connections package to the listener and to senders that open bidirectional streams. HTTP senders can use `HttpClient` or another HTTP library; the HTTP example also uses `Microsoft.Azure.Relay` to obtain a token. Keep the WCF dependencies in any code that still serves WCF endpoints.

## Create the Hybrid Connection

WCF Relay supports precreated entities and relays that a listener registers dynamically. Create the Hybrid Connection before opening its listener.

> [!NOTE]
> To create a Hybrid Connection at runtime, call the [management API](/rest/api/relay/hybrid-connections/create-or-update) using an identity that has permission to create Hybrid Connections.

1. Open your Azure Relay namespace in the portal.
2. Select **Entities** > **Hybrid Connections** > **+ Hybrid Connection**.
3. Enter an entity name, configure **Requires Client Authorization** for your application, and create the Hybrid Connection.

Keep **Requires Client Authorization** enabled when senders must authenticate to Relay, as in the following examples. Disable it only when you intend to allow anonymous senders at the Relay endpoint. Application-level authentication remains a separate choice. Listeners still need authorization to listen.

For infrastructure as code, this Bicep template adds a [Microsoft.Relay/namespaces/hybridConnections](/azure/templates/microsoft.relay/namespaces/hybridconnections) resource to an existing namespace in the deployment's resource group:

```bicep
param namespaceName string
param hybridConnectionName string = 'orders-hc'

resource relayNamespace 'Microsoft.Relay/namespaces@2024-01-01' existing = {
  name: namespaceName
}

resource hybridConnection 'Microsoft.Relay/namespaces/hybridConnections@2024-01-01' = {
  parent: relayNamespace
  name: hybridConnectionName
  properties: {
    requiresClientAuthorization: true
  }
}
```

WCF Relay and Hybrid Connections can run in the same namespace.

The .NET listener and stream sender use an address such as `sb://contoso-relay.servicebus.windows.net/orders-hc`. HTTP senders use `https://contoso-relay.servicebus.windows.net/orders-hc`, followed by the application's route.

## Authentication and authorization

In WCF Relay, `TransportClientEndpointBehavior` supplies the Relay credentials to the WCF endpoint. With Hybrid Connections, pass a `Microsoft.Azure.Relay.TokenProvider` to the `HybridConnectionListener` or `HybridConnectionClient` constructor.

Use [Microsoft Entra ID authentication](authenticate-application.md), preferably with a [managed identity](authenticate-managed-identity.md) when your hosting environment supports it. Assign **Azure Relay Listener** to the listener and, when sender authorization is enabled, **Azure Relay Sender** to senders at the new entity's scope. The token audience is `https://relay.azure.net/`.

For a system-assigned managed identity:

```csharp
using Microsoft.Azure.Relay;

TokenProvider tokenProvider =
    TokenProvider.CreateManagedIdentityTokenProvider();
```

If you use shared access signatures (SAS), create separate policies on the new entity with `Listen` and `Send` rights for the listener and authorized senders. Create the provider with `TokenProvider.CreateSharedAccessSignatureTokenProvider`, using the policy name and key. See [Relay authentication and authorization](relay-authentication-and-authorization.md).

When sender authorization is enabled, HTTP senders send a valid Relay token in `ServiceBusAuthorization`. Obtain a token for the new endpoint using the sender's identity:

```csharp
string endpoint = "https://contoso-relay.servicebus.windows.net/orders-hc";
var relayToken = await tokenProvider.GetTokenAsync(endpoint, TimeSpan.FromMinutes(15));
```

Relay consumes that header and forwards a separate `Authorization` header to your application. Use the latter when the service needs to authenticate individual application callers in addition to authorizing access to Relay.

## Listeners

In WCF Relay, `ServiceHost` hosts the service implementation and WCF dispatches calls to its operations. With Hybrid Connections, `HybridConnectionListener` receives HTTP requests or accepts streams, and your application handles the protocol above that transport.

| Listener task | WCF Relay | Hybrid Connections |
| --- | --- | --- |
| Configure | Add a service endpoint with its contract, binding, address, and Relay credentials. | Construct `HybridConnectionListener` with the Hybrid Connection address and listener token provider. |
| Start | Call `ServiceHost.Open`. | Set `RequestHandler` for HTTP requests, then await `OpenAsync`. For streams, await `AcceptConnectionAsync` after opening the listener. |
| Dispatch | WCF invokes the operation selected by the service contract. | Dispatch HTTP requests by method and path, or define messages on each accepted stream. |
| Stop | Call `ServiceHost.Close`. | Await `CloseAsync` and finish or cancel work on accepted requests and streams. |

## HTTP requests

For request/response operations, including those exposed through `WebHttpRelayBinding`, map each WCF operation to an HTTP method, route, and payload format. In WCF:

```csharp
using System.ServiceModel;

[ServiceContract]
public interface IEcho
{
    [OperationContract]
    string Echo(string value);
}

public sealed class EchoService : IEcho
{
    public string Echo(string value) => value;
}
```

Before opening the Hybrid Connections listener, register the following handler. It maps `Echo` to `POST /echo` with a UTF-8 `text/plain` body. The path includes the Hybrid Connection name from `endpoint`; other paths return 404, and other methods on this path return 405.

```csharp
using System;
using System.IO;
using System.Net;
using System.Text;

string echoPath = new Uri(endpoint + "/echo").AbsolutePath;
listener.RequestHandler = HandleEcho;

void HandleEcho(RelayedHttpListenerContext context)
{
    context.Response.StatusCode = HttpStatusCode.InternalServerError;
    try
    {
        if (context.Request.Url.AbsolutePath != echoPath)
        {
            context.Response.StatusCode = HttpStatusCode.NotFound;
            return;
        }

        if (context.Request.HttpMethod != "POST")
        {
            context.Response.StatusCode = HttpStatusCode.MethodNotAllowed;
            context.Response.Headers["Allow"] = "POST";
            return;
        }

        using var reader = new StreamReader(context.Request.InputStream, Encoding.UTF8);
        byte[] body = Encoding.UTF8.GetBytes(reader.ReadToEnd());
        context.Response.Headers["Content-Type"] = "text/plain; charset=utf-8";
        context.Response.StatusCode = HttpStatusCode.OK;
        context.Response.OutputStream.Write(body, 0, body.Length);
    }
    finally
    {
        context.Response.Close();
    }
}
```

Map WCF faults to HTTP error status codes and response bodies.

In WCF Relay, using `ChannelFactory<IEcho>`:

```csharp
IEcho proxy = factory.CreateChannel();
string result = proxy.Echo("hello");
```

The Hybrid Connections example uses the endpoint and token from the authentication section:

```csharp
using System.Net.Http;
using System.Text;

using var request = new HttpRequestMessage(HttpMethod.Post, endpoint + "/echo");
request.Headers.Add("ServiceBusAuthorization", relayToken.TokenString);
request.Content = new StringContent("hello", Encoding.UTF8, "text/plain");

using var response = await http.SendAsync(request);
response.EnsureSuccessStatusCode();
string result = await response.Content.ReadAsStringAsync();
```

For Hybrid Connections HTTP requests, the Relay service enforces a 60-second deadline for receiving the listener's initial response. A streaming response body has a separate 60-second idle timeout. Check long-running WCF operations against these [service limits](relay-hybrid-connections-protocol.md#responding-to-requests) before switching senders.

### Retain a SOAP service

For `BasicHttpRelayBinding` or `WS2007HttpRelayBinding`, choose a new HTTP contract or an adapter to the SOAP service. The [HTTP reverse proxy sample](https://github.com/Azure/azure-relay/tree/master/samples/hybrid-connections/dotnet/hcreverseproxy) is a starting point for an adapter. Test it with your WCF proxy: it must preserve the SOAP version, `SOAPAction`, addressing, serialization, attachments, and faults used by the contract. Address or payload changes can also invalidate message signatures.

## Bidirectional streams

For `NetTcpRelayBinding`, replace WCF calls with messages over a `HybridConnectionStream`. The following listener and sender implement the earlier `Echo` operation with one request/reply exchange per connection. Both use the `ReadMessage` and `WriteMessage` helpers defined after the sender example and set a 30-second timeout for each read and write as an example.

On the listener, after calling `OpenAsync`:

```csharp
using var stream = await listener.AcceptConnectionAsync();
if (stream != null)
{
    stream.ReadTimeout = stream.WriteTimeout = 30_000;
    string value = ReadMessage(stream);
    WriteMessage(stream, value);
}
```

On the sender:

```csharp
using var stream = await client.CreateConnectionAsync();
stream.ReadTimeout = stream.WriteTimeout = 30_000;
WriteMessage(stream, "hello");
string result = ReadMessage(stream);
```

These helpers frame each UTF-8 payload with a four-byte little-endian length. They use `BinaryReader` to handle partial reads and enforce a 64-KiB payload limit for this example.

```csharp
using System.IO;
using System.Text;

const int MaxMessageBytes = 64 * 1024;

static void WriteMessage(Stream stream, string value)
{
    byte[] body = Encoding.UTF8.GetBytes(value);
    if (body.Length > MaxMessageBytes)
    {
        throw new InvalidDataException("The message exceeds the 64-KiB example limit.");
    }

    using var writer = new BinaryWriter(stream, Encoding.UTF8, leaveOpen: true);
    writer.Write(body.Length);
    if (body.Length > 0)
    {
        writer.Write(body);
    }
}

static string ReadMessage(Stream stream)
{
    using var reader = new BinaryReader(stream, Encoding.UTF8, leaveOpen: true);
    int length = reader.ReadInt32();
    if (length < 0 || length > MaxMessageBytes)
    {
        throw new InvalidDataException("The message length is outside the example's allowed range.");
    }

    byte[] body = reader.ReadBytes(length);
    if (body.Length != length)
    {
        throw new EndOfStreamException("The message body is incomplete.");
    }

    return Encoding.UTF8.GetString(body);
}
```

Choose timeouts based on your application's latency requirements. The stream defaults to infinite read and write timeouts. `ReadTimeout` and `WriteTimeout` limit individual I/O calls, not the complete message or request/reply exchange: a peer that sends a little data before each timeout can keep an exchange running.

To preserve an overall WCF operation deadline, use asynchronous framing with `ReadAsync` and `WriteAsync`, passing the same `CancellationToken` from a time-limited `CancellationTokenSource` through every read and write in the exchange. Don't restart the deadline for each fragment. Dispose of the connection after an interrupted frame rather than reusing a partially read or written message. WCF client `SendTimeout` initializes the request/reply operation timeout; service `ReceiveTimeout` controls session idle time, so don't copy these values as equivalent stream settings. See [WCF binding timeouts](/dotnet/framework/wcf/feature-details/configuring-timeout-values-on-a-binding).

Add operation dispatch, request/reply correlation, or callbacks where your contract needs them.

If you retain a TCP service, test the [PortBridge sample](https://github.com/Azure/azure-relay/tree/master/samples/hybrid-connections/dotnet/portbridge) with your WCF client, including authentication and connection recovery.

## WCF behaviors that need application changes

| WCF behavior | Migration change |
| --- | --- |
| Message security, Windows authentication, or impersonation | Preserve the required caller identity, signing, and encryption in the application or retained backend. |
| Reliable sessions and session state | Define recovery after a disconnect. Successive HTTP requests can reach different listeners, so store state where the selected listener can access it. |
| Service-local transactions | Keep the transaction boundary inside the service, for example with `TransactionScope` in the HTTP or stream handler. |
| `NetOnewayRelayBinding` | Define failure handling and add an acknowledgement if senders need confirmation that a request was accepted. |
| `NetEventRelayBinding` multicast | Implement fan-out to the required recipients. Hybrid Connections selects one listener for each incoming request or connection. |

The standard `NetTcpRelayBinding`, `WS2007HttpRelayBinding`, and `BasicHttpRelayBinding` don't provide WCF transaction flow between a caller and a service.

If you retain a transaction-enabled WCF backend, `NetTcpBinding` with `TransactionFlow` enabled can carry `OleTransactions` over a Hybrid Connections TCP tunnel. The WCF tunnel doesn't provide the separate connectivity needed between [Microsoft Distributed Transaction Coordinator (MSDTC) services](/dotnet/framework/wcf/feature-details/using-ws-atomictransaction) on different machines. Test commit and rollback with the transaction managers and resource managers in your deployment.

## Network access

Hybrid Connections uses outbound HTTPS and WebSockets over TCP port **443**. Configure proxies to allow WebSocket upgrades and long-lived connections. A listener using [Azure Private Link](private-link-service.md) also needs outbound ports **9400-9599**, with private DNS and routing configured for the namespace. See [Relay port settings](relay-port-settings.md).

If you change network settings on a shared namespace, verify that the WCF endpoints remain reachable during migration.

## Verify and switch senders

Run the WCF and Hybrid Connections implementations against the same application test cases from each production network path. Compare results, side effects, fault handling, and performance with representative payloads and concurrency. Check rejected credentials and recovery after listener loss, including whether retrying an interrupted operation can duplicate a state change.

1. Move senders in stages, checking application errors and latency before expanding traffic.
2. Keep the WCF listener, credentials, and compatible WCF client code available for rollback. Shared data changes must remain compatible with both implementations.
3. After all senders have moved and the rollback period ends, let in-flight WCF calls finish, stop the WCF listener, and remove only its unused entity and credentials.

Use read-only requests when comparing both implementations in parallel, unless the application prevents duplicate side effects.

## Next steps

- [Build an HTTP listener and sender](relay-hybrid-connections-http-requests-dotnet-get-started.md).
- [Build a WebSocket listener and sender](relay-hybrid-connections-dotnet-get-started.md).
- [Review Hybrid Connections protocol details and limits](relay-hybrid-connections-protocol.md).
