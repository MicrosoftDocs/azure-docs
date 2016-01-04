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
   ms.date="11/17/2015"
   ms.author="vturecek@microsoft.com"/>

# The Reliable Services communication model

Azure Service Fabric as a platform is completely agnostic about communication between services. All protocols and stacks are fair game, from UDP to HTTP. It's up to the service developer to choose how services should communicate. The Reliable Services application framework provides a few prebuilt communication stacks and tools that you can use to roll out your custom communication stack. These include abstractions that clients can use to discover and communicate with service endpoints.

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
protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
```

For stateful services:

```csharp
protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
```

In both cases, you return a collection of listeners. This allows your service to easily use multiple listeners. For example, you may have an HTTP listener and a separate WebSocket listener. Each listener gets a name, and the resulting collection of *name : address* pairs is represented as a JSON object when a client requests the listening addresses for a service instance or a partition.

In a stateless service, the override returns a collection of ServiceInstanceListeners. A ServiceInstanceListener contains a function to create an ICommunicationListener and gives it a name. For stateful services, the override returns a collection of ServiceReplicaListeners. This is slightly different from its stateless counterpart, because a ServiceReplicaListener has an option to open an ICommunicationListener on secondary replicas. Not only can you use multiple communication listeners in a service, but you can also specify which listeners accept requests on secondary replicas and which ones listen only on primary replicas.

For example, you can have a ServiceRemotingListener that takes RPC calls only on primary replicas, and a second, custom listener that takes read requests on secondary replicas:

```csharp
protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
{
    return new[]
    {
        new ServiceReplicaListener(initParams =>
            new MyCustomListener(initParams),
            "customReadonlyEndpoint",
            true),

        new ServiceReplicaListener(initParams =>
            new ServiceRemotingListener<IMyStatefulInterface2>(initParams, this),
            "rpcPrimaryEndpoint",
            false)
    };
}
```

Finally, you can describe the endpoints that are required for the service in the [service manifest](service-fabric-application-model.md) under the section on endpoints.

```xml

<Resources>
    <Endpoints>
      <Endpoint Name="ServiceEndpoint" Protocol="http" Type="Input" />
    <Endpoints>
</Resources>

```

The communication listener can access the endpoint resources allocated to it from the `CodePackageActivationContext` in the `ServiceInitializationParameters`. The listener can then start listening for requests when it is opened.

```csharp

var codePackageActivationContext = this.serviceInitializationParameters.CodePackageActivationContext;
var port = codePackageActivationContext.GetEndpoint("ServiceEndpoint").Port;

```

> [AZURE.NOTE] Endpoint resources are common to the entire service package, and they are allocated by Service Fabric when the service package is activated. All the replicas hosted in the same ServiceHost share the same port. This means that the communication listener should support port sharing. The recommended way of doing this is for the communication listener to use the partition ID and replica/instance ID when it generates the listen address.

```csharp

var replicaOrInstanceId = 0;
var parameters = this.serviceInitializationParameters as StatelessServiceInitializationParameters;
if (parameters != null)
{
   replicaOrInstanceId = parameters.InstanceId;
}
else
{
   replicaOrInstanceId = ((StatefulServiceInitializationParameters) this.serviceInitializationParameters).ReplicaId;
}

var nodeContext = FabricRuntime.GetNodeContext();

var listenAddress = new Uri(
    string.Format(
        CultureInfo.InvariantCulture,
        "{0}://{1}:{2}/{5}/{3}-{4}",
        scheme,
        nodeContext.IPAddressOrFQDN,
        port,
        this.serviceInitializationParameters.PartitionId,
        replicaOrInstanceId,
        Guid.NewGuid().ToString()));

```

For a complete walk-through of how to write an `ICommunicationListener`, see [Service Fabric Web API services with OWIN self-hosting](service-fabric-reliable-services-communication-webapi.md)

### Client-to-service communication
The Reliable Services API provides the following abstractions that make it easy to write clients that communicate with services.

#### ServicePartitionResolver
This utility class helps clients determine the endpoint of a Service Fabric service at runtime. In Service Fabric terminology, the process of determining the endpoint of a service is referred to as the *service endpoint resolution*.

```csharp

public delegate FabricClient CreateFabricClientDelegate();

// ServicePartitionResolver methods

public ServicePartitionResolver(CreateFabricClientDelegate createFabricClient);

Task<ResolvedServicePartition> ResolveAsync(Uri serviceName,
   long partitionKey,
   CancellationToken cancellationToken);

Task<ResolvedServicePartition> ResolveAsync(ResolvedServicePartition previousRsp,
   CancellationToken cancellationToken);


```
> [AZURE.NOTE] FabricClient is the object that is used to communicate with the Service Fabric cluster for various management operations on the cluster.

Typically, the client code need not work with the `ServicePartitionResolver` directly. It is created and passed on to other helper classes in the Reliable Services API. These classes use the resolver internally and help the client communicate with the service.

#### CommunicationClientFactory
`ICommunicationClientFactory` defines the base interface implemented by a communication client factory that produces clients that can talk to a Service Fabric service. The implementation of the CommunicationClientFactory depends on the communication stack used by the Service Fabric service where the client wants to communicate. The Reliable Services API provides a `CommunicationClientFactoryBase<TCommunicationClient>`. This provides a base implementation of the `ICommunicationClientFactory` interface and performs tasks that are common to all the communication stacks. (These tasks include using a `ServicePartitionResolver` to determine the service endpoint). Clients usually implement the abstract CommunicationClientFactoryBase class to handle logic that is specific to the communication stack.

```csharp

protected CommunicationClientFactoryBase(
   ServicePartitionResolver servicePartitionResolver = null,
   IEnumerable<IExceptionHandler> exceptionHandlers = null,
   IEnumerable<Type> doNotRetryExceptionTypes = null);


public class MyCommunicationClient : ICommunicationClient
{
   public MyCommunicationClient(MyCommunicationChannel communicationChannel)
   {
      this.CommunicationChannel = communicationChannel;
   }
   public MyCommunicationChannel CommunicationChannel { get; private set; }
   public ResolvedServicePartition ResolvedServicePartition;
}

public class MyCommunicationClientFactory : CommunicationClientFactoryBase<MyCommunicationClient>
{
    protected override void AbortClient(MyCommunicationClient client)
    {
        throw new NotImplementedException();
    }

    protected override Task<MyCommunicationClient> CreateClientAsync(string endpoint, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    protected override bool ValidateClient(MyCommunicationClient clientChannel)
    {
        throw new NotImplementedException();
    }

    protected override bool ValidateClient(string endpoint, MyCommunicationClient client)
    {
        throw new NotImplementedException();
    }
}

```

#### ServicePartitionClient
`ServicePartitionClient` uses the CommunicationClientFactory (and the ServicePartitionResolver internally). It also helps in communication with the service by handling retries for common communication and Service Fabric transient exceptions.

```csharp

public ServicePartitionClient(
    ICommunicationClientFactory<TCommunicationClient> factory,
    Uri serviceName,
    long partitionKey);

public async Task<TResult> InvokeWithRetryAsync<TResult>(
    Func<TCommunicationClient, Task<TResult>> func,
    CancellationToken cancellationToken,
    params Type[] doNotRetryExceptionTypes)

```

A typical usage pattern looks like this:

```csharp

public MyCommunicationClientFactory myCommunicationClientFactory;
public Uri myServiceUri;

... other client code ..

// Call the service corresponding to the partitionKey myKey.

var myServicePartitionClient = new ServicePartitionClient<MyCommunicationClient>(
    this.myCommunicationClientFactory,
    this.myServiceUri,
    myKey);

var result = await myServicePartitionClient.InvokeWithRetryAsync(
   client =>
   {
      // Communicate with the service using the client.
      throw new NotImplementedException();
   },
   CancellationToken.None);


... other client code ...

```

## Next steps
* [Remote procedure calls with Reliable Services remoting](service-fabric-reliable-services-communication-remoting.md)

* [Web API that uses OWIN in Reliable Services](service-fabric-reliable-services-communication-webapi.md)

* [WCF communication by using Reliable Services](service-fabric-reliable-services-communication-wcf.md)
