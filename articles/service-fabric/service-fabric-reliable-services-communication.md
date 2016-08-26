<properties
   pageTitle="Reliable Services communication overview | Microsoft Azure"
   description="Overview of the Reliable Services communication model, including opening listeners on services, resolving endpoints, and communicating between services."
   services="service-fabric"
   documentationCenter=".net"
   authors="vturecek"
   manager="timlt"
   editor="BharatNarasimman"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="required"
   ms.date="07/06/2016"
   ms.author="vturecek"/>

# How to use the Reliable Services communication APIs

Azure Service Fabric as a platform is completely agnostic about communication between services. All protocols and stacks are acceptable, from UDP to HTTP. It's up to the service developer to choose how services should communicate. The Reliable Services application framework provides built-in communication stacks as well as APIs that you can use to build your custom communication components. 

## Set up service communication

The Reliable Services API uses a simple interface for service communication. To open an endpoint for your service, simply implement this interface:

```csharp

public interface ICommunicationListener
{
    Task<string> OpenAsync(CancellationToken cancellationToken);

    Task CloseAsync(CancellationToken cancellationToken);

    void Abort();
}

```

You can then add your communication listener implementation by returning it in a service-based class method override.

For stateless services:

```csharp
class MyStatelessService : StatelessService
{
    protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
    {
        ...
    }
    ...
}
```

For stateful services:

```csharp
class MyStatefulService : StatefulService
{
    protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
    {
        ...
    }
    ...
}
```

In both cases, you return a collection of listeners. This allows your service to listen on multiple endpoints, potentially using different protocols, by using multiple listeners. For example, you may have an HTTP listener and a separate WebSocket listener. Each listener gets a name, and the resulting collection of *name : address* pairs is represented as a JSON object when a client requests the listening addresses for a service instance or a partition.

In a stateless service, the override returns a collection of ServiceInstanceListeners. A ServiceInstanceListener contains a function to create an ICommunicationListener and gives it a name. For stateful services, the override returns a collection of ServiceReplicaListeners. This is slightly different from its stateless counterpart, because a ServiceReplicaListener has an option to open an ICommunicationListener on secondary replicas. Not only can you use multiple communication listeners in a service, but you can also specify which listeners accept requests on secondary replicas and which ones listen only on primary replicas.

For example, you can have a ServiceRemotingListener that takes RPC calls only on primary replicas, and a second, custom listener that takes read requests on secondary replicas over HTTP:

```csharp
protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
{
    return new[]
    {
        new ServiceReplicaListener(context =>
            new MyCustomHttpListener(context),
            "HTTPReadonlyEndpoint",
            true),

        new ServiceReplicaListener(context =>
            this.CreateServiceRemotingListener(context),
            "rpcPrimaryEndpoint",
            false)
    };
}
```

> [AZURE.NOTE] When creating multiple listeners for a service, each listener **must** be given a unique name.

Finally, describe the endpoints that are required for the service in the [service manifest](service-fabric-application-model.md) under the section on endpoints.

```xml
<Resources>
    <Endpoints>
      <Endpoint Name="WebServiceEndpoint" Protocol="http" Port="80" />
      <Endpoint Name="OtherServiceEndpoint" Protocol="tcp" Port="8505" />
    <Endpoints>
</Resources>

```

The communication listener can access the endpoint resources allocated to it from the `CodePackageActivationContext` in the `ServiceContext`. The listener can then start listening for requests when it is opened.

```csharp
var codePackageActivationContext = serviceContext.CodePackageActivationContext;
var port = codePackageActivationContext.GetEndpoint("ServiceEndpoint").Port;

```

> [AZURE.NOTE] Endpoint resources are common to the entire service package, and they are allocated by Service Fabric when the service package is activated. Multiple service replicas hosted in the same ServiceHost may share the same port. This means that the communication listener should support port sharing. The recommended way of doing this is for the communication listener to use the partition ID and replica/instance ID when it generates the listen address.

### Service address registration

A system service called the *Naming Service* runs on Service Fabric clusters. The Naming Service is a registrar for services and their addresses that each instance or replica of the service is listening on. When the `OpenAsync` method of an `ICommunicationListener` completes, its return value gets registered in the Naming Service. This return value that gets published in the Naming Service is a string whose value can be anything at all. This string value is what clients will see when they ask for an address for the service from the Naming Service.

```csharp
public Task<string> OpenAsync(CancellationToken cancellationToken)
{
    EndpointResourceDescription serviceEndpoint = serviceContext.CodePackageActivationContext.GetEndpoint("ServiceEndpoint");
    int port = serviceEndpoint.Port;

    this.listeningAddress = string.Format(
                CultureInfo.InvariantCulture,
                "http://+:{0}/",
                port);
                        
    this.publishAddress = this.listeningAddress.Replace("+", FabricRuntime.GetNodeContext().IPAddressOrFQDN);
            
    this.webApp = WebApp.Start(this.listeningAddress, appBuilder => this.startup.Invoke(appBuilder));
    
    // the string returned here will be published in the Naming Service.
    return Task.FromResult(this.publishAddress);
}
```

Service Fabric provides APIs that allows clients and other services to then ask for this address by service name. This is important because the service address is not static. Services are moved around in the cluster for resource balancing and availability purposes. This is the mechanism that allows clients to resolve the listening address for a service.

> [AZURE.NOTE] For a complete walk-through of how to write an `ICommunicationListener`, see [Service Fabric Web API services with OWIN self-hosting](service-fabric-reliable-services-communication-webapi.md)

## Communicating with a service
The Reliable Services API provides the following libraries to write clients that communicate with services.

### Service endpoint resolution
The first step to communication with a service is to resolve an endpoint address of the partition or instance of the service you want to talk to. The `ServicePartitionResolver` utility class is a basic primitive that helps clients determine the endpoint of a service at runtime. In Service Fabric terminology, the process of determining the endpoint of a service is referred to as the *service endpoint resolution*.

To connect to services within a cluster, `ServicePartitionResolver` can be created using default settings. This is the recommended usage for most situations:

```csharp
ServicePartitionResolver resolver = ServicePartitionResolver.GetDefault();
```

To connect to services in a different cluster, a `ServicePartitionResolver` can be created with a set of cluster gateway endpoints. Note that gateway endpoints are just different endpoints for connecting to the same cluster. For example:

```csharp
ServicePartitionResolver resolver = new  ServicePartitionResolver("mycluster.cloudapp.azure.com:19000", "mycluster.cloudapp.azure.com:19001");
```

Alternatively, `ServicePartitionResolver` can be given a function for creating a `FabricClient` to use internally: 
 
```csharp
public delegate FabricClient CreateFabricClientDelegate();
```

`FabricClient` is the object that is used to communicate with the Service Fabric cluster for various management operations on the cluster. This is useful when you want more control over how `ServicePartitionResolver` interacts with your cluster. `FabricClient` performs caching internally and is generally expensive to create, so it is important to reuse `FabricClient` instances as much as possible. 

```csharp
ServicePartitionResolver resolver = new  ServicePartitionResolver(() => CreateMyFabricClient());
```

A resolve method is then used to retrieve the address of a service or a service partition for partitioned services.

```csharp
ServicePartitionResolver resolver = ServicePartitionResolver.GetDefault();

ResolvedServicePartition partition =
    await resolver.ResolveAsync(new Uri("fabric:/MyApp/MyService"), new ServicePartitionKey(), cancellationToken);
```

A service address can be resolved easily using a `ServicePartitionResolver`, but more work is required to ensure the resolved address can be used correctly. Your client will need to detect whether the connection attempt failed because of a transient error and can be retried (e.g., service moved or is temporarily unavailable), or a permanent error (e.g., service was deleted or the requested resource no longer exists). Service instances or replicas can move around from node to node at any time for multiple reasons. The service address resolved through `ServicePartitionResolver` may be stale by the time your client code attempts to connect. In that case again the client will need to re-resolve the address. Providing the previous `ResolvedServicePartition` indicates that the resolver needs to try again rather than simply retrieve a cached address.

Typically, the client code need not work with the `ServicePartitionResolver` directly. It is created and passed on to communication client factories in the Reliable Services API. The factories use the resolver internally to generate a client object that can be used to communicate with services.

### Communication clients and factories

The communication factory library implements a typical fault-handling retry pattern that makes retrying connections to resolved service endpoints easier. The factory library provides the retry mechanism while you provide the error handlers.

`ICommunicationClientFactory` defines the base interface implemented by a communication client factory that produces clients that can talk to a Service Fabric service. The implementation of the CommunicationClientFactory depends on the communication stack used by the Service Fabric service where the client wants to communicate. The Reliable Services API provides a `CommunicationClientFactoryBase<TCommunicationClient>`. This provides a base implementation of the `ICommunicationClientFactory` interface and performs tasks that are common to all the communication stacks. (These tasks include using a `ServicePartitionResolver` to determine the service endpoint). Clients usually implement the abstract CommunicationClientFactoryBase class to handle logic that is specific to the communication stack.

The communication client just receives an address and uses it to connect to a service. The client can use whatever protocol it wants.

```csharp
class MyCommunicationClient : ICommunicationClient
{
    public ResolvedServiceEndpoint Endpoint { get; set; }

    public string ListenerName { get; set; }

    public ResolvedServicePartition ResolvedServicePartition { get; set; }
}
```

The client factory is primarily responsible for creating communication clients. For clients that don't maintain a persistent connection, such as an HTTP client, the factory only needs to create and return the client. Other protocols that maintain a persistent connection, such as some binary protocols, should also be validated by the factory to determine whether or not the connection needs to be re-created.  

```csharp
public class MyCommunicationClientFactory : CommunicationClientFactoryBase<MyCommunicationClient>
{
    protected override void AbortClient(MyCommunicationClient client)
    {
    }

    protected override Task<MyCommunicationClient> CreateClientAsync(string endpoint, CancellationToken cancellationToken)
    {
    }

    protected override bool ValidateClient(MyCommunicationClient clientChannel)
    {
    }

    protected override bool ValidateClient(string endpoint, MyCommunicationClient client)
    {
    }
}
```

Finally, an exception handler is reponsible for determining what action to take when an exception occurs. Exceptions are categorized into **retriable** and **non retriable**. 

 - **Non retriable** exceptions simply get re-thrown back to the caller. 
 - **Retriable** exceptions are further categorized into **transient** and **non-transient**.
  - **Transient** exceptions are those that can simply be retried without re-resolving the service endpoint address. These will include transient network problems or service error responses other than those that indicate the service endpoint address does not exist. 
  - **Non-transient** exceptions are those that require the service endpoint address to be re-resolved. These include exceptions that indicate the service endpoint could not be reached, indicating the service has moved to a different node. 

The `TryHandleException` makes a decision about a given exception. If it **does not know** what decisions to make about an exception, it should return **false**. If it **does know** what decision to make, it should set the result accordingly and return **true**.
 
```csharp
class MyExceptionHandler : IExceptionHandler
{
    public bool TryHandleException(ExceptionInformation exceptionInformation, OperationRetrySettings retrySettings, out ExceptionHandlingResult result)
    {
        // if exceptionInformation.Exception is known and is transient (can be retried without re-resolving)
        result = new ExceptionHandlingRetryResult(exceptionInformation.Exception, true, retrySettings, retrySettings.DefaultMaxRetryCount);
        return true;


        // if exceptionInformation.Exception is known and is not transient (indicates a new service endpoint address must be resolved)
        result = new ExceptionHandlingRetryResult(exceptionInformation.Exception, false, retrySettings, retrySettings.DefaultMaxRetryCount);
        return true;

        // if exceptionInformation.Exception is unknown (let the next IExceptionHandler attempt to handle it)
        result = null;
        return false;
    }
}
```
### Putting it all together
With an `ICommunicationClient`, `ICommunicationClientFactory`, and `IExceptionHandler` built around a communication protocol, a `ServicePartitionClient` is wraps it all together and provides the fault-handling and service partition address resolution loop around these components.

```csharp
private MyCommunicationClientFactory myCommunicationClientFactory;
private Uri myServiceUri;

var myServicePartitionClient = new ServicePartitionClient<MyCommunicationClient>(
    this.myCommunicationClientFactory,
    this.myServiceUri,
    myPartitionKey);

var result = await myServicePartitionClient.InvokeWithRetryAsync(async (client) =>
   {
      // Communicate with the service using the client.
   },
   CancellationToken.None);

```

## Next steps
 - See an example of HTTP communication between services in a [sample project on GitHUb](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started/tree/master/Services/WordCount).

 - [Remote procedure calls with Reliable Services remoting](service-fabric-reliable-services-communication-remoting.md)

 - [Web API that uses OWIN in Reliable Services](service-fabric-reliable-services-communication-webapi.md)

 - [WCF communication by using Reliable Services](service-fabric-reliable-services-communication-wcf.md)
