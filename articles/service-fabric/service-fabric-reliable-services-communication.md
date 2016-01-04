<properties
   pageTitle="Reliable service communication overview | Microsoft Azure"
   description="Overview of the Reliable Service communication model including opening listeners on services, resolving endpoints, and communicating between services."
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

# The Reliable Service communication model

Service Fabric as a platform is completely agnostic to communication between services. Any and all protocols and stacks are fair game, from UDP to HTTP. It's up to the service developer to choose how services should communicate. The Reliable Services application framework provides a few pre-built communication stacks as well as tools to roll your custom communication stack, such as abstractions which clients can use to discover and communicate with service endpoints.

## Setting up service communication

The Reliable Services API uses a simple interface for service communication. To open up an endpoint for your service, simply implement this interface:

```csharp

public interface ICommunicationListener
{
    Task<string> OpenAsync(CancellationToken cancellationToken);

    Task CloseAsync(CancellationToken cancellationToken);

    void Abort();
}

```

Then add your communication listener implementation by returning it in a service base class method override. 

For stateless:

```csharp
protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
```

For stateful:

```csharp
protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
```

In both cases you return a collection of listeners which allows your service to easily use multiple listeners - for example, you may have an HTTP listener and a separate WebSocket listener. Each listener gets a name, and the resulting collection of name : address pairs is represented as a JSON object when a client requests the listening addresses for a service instance or partition.

In a stateless service, the override returns a collection of ServiceInstanceListeners. A ServiceInstanceListener simply contains a function to create your ICommunicationListener and gives it a name. For stateful services, the override returns a collection of ServiceReplicaListeners. This is slightly different from its stateless counterpart, because ServiceReplicaListener has an option to open a ICommunicationListener on secondary replicas. This allows you to not only use multiple communication listeners in a service, but you can also specify which ones accept requests on secondary replicas, and which ones only listen on primary replicas. 

For example, we can have a ServiceRemotingListener taking RPC calls only on primaries, and a second, custom listener that takes read requests on secondary replicas:

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

Finally, describe the endpoints that are required for the service in the [Service manifest](service-fabric-application-model.md) under the Endpoints section.

```xml

<Resources>
    <Endpoints>
      <Endpoint Name="ServiceEndpoint" Protocol="http" Type="Input" />
    <Endpoints>
</Resources>

```

The communication listener can access the endpoint resources allocated to it from the `CodePackageActivationContext` in the `ServiceInitializationParameters`, and start listening for requests when it is opened.

```csharp

var codePackageActivationContext = this.serviceInitializationParameters.CodePackageActivationContext;
var port = codePackageActivationContext.GetEndpoint("ServiceEndpoint").Port;

```

> [AZURE.NOTE] The Endpoints resources are common to the entire service package and are allocated by Service Fabric when the service package is activated. So all the replicas hosted in the same ServiceHost share the same port. This means that the communication listener should support port sharing. The recommended way of doing this, is for the communication listener to use the partition Id and replica/instance Id when generating the listen address.

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

For a complete walkthrough of writing an `ICommunicationListener`, see [Getting Started with Microsoft Azure Service Fabric Web API services with OWIN self-host](service-fabric-reliable-services-communication-webapi.md)

## Client to service communication
Reliable Services API provides the following abstractions which make writing clients for communicating with Services easy.

### ServicePartitionResolver
This utility class helps clients determine the endpoint of a Service Fabric service at runtime. The process of determining the endpoint of a service is referred to as Service Endpoint Resolution in Service Fabric terminology.

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
> [AZURE.NOTE] FabricClient is the object that is used to communicate to the Service Fabric cluster for various management operations on the Service Fabric cluster.

Typically client code need not work with `ServicePartitionResolver` directly. It is created and passed on to other helper classes in the Reliable Service's API, which internally use the resolver and help the client communicate with the service.

### CommunicationClientFactory
`ICommunicationClientFactory` defines the base interface implemented by a communication client factory that produces clients that can talk to a ServiceFabric service. The implementation of the CommunicationClientFactory will depend on the communication stack used by the Service Fabric service to which the client wants to communicate to. Reliable Service's API provides a CommunicationClientFactoryBase<TCommunicationClient> which provides a base implementation of this `ICommunicationClientFactory` interface and performs tasks which are common for all the communication stacks.(like using a `ServicePartitionResolver` to determine the service endpoint). Clients usually implement the abstract CommunicationClientFactoryBase class to handle communication stack specific logic.

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

### ServicePartitionClient
`ServicePartitionClient` uses the CommunicationClientFactory(and internally the ServicePartitionResolver) and helps in communicating with the service by handling retries for common communication and Service Fabric Transient exceptions.

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

A typical usage pattern would look like this:

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

## Next Steps
* [Remote procedure call with Reliable Services remoting](service-fabric-reliable-services-communication-remoting.md)

* [Web API with OWIN in Reliable Services](service-fabric-reliable-services-communication-webapi.md)

* [WCF communication with Reliable Services](service-fabric-reliable-services-communication-wcf.md)

 
