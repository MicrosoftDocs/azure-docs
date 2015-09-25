<properties
   pageTitle="Service Communication Model Overview"
   description="This article describes the basics of Communication model supported by the Reliable Service's api."
   services="service-fabric"
   documentationCenter=".net"
   authors="BharatNarasimman"
   manager="vipulm"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="required"
   ms.date="08/27/2015"
   ms.author="bharatn@microsoft.com"/>

# Service Communication Model

The Reliable Services programming model allows service authors to specify the communication mechanism they want to use to expose their service endpoints and also provides abstractions which clients can use to discover and communicate with the service endpoint.

## Setting up the Service communication stack

Reliable Services API allows service authors to plugin the communication stack of their choice in the service by implementing the following method in their service,

```csharp

protected override ICommunicationListener CreateCommunicationListener()
{
    ...
}

```

The `ICommunicationListener` interface defines the interface that must be implemented by the communication listener for a service.

```csharp

public interface ICommunicationListener
{
    void Initialize(ServiceInitializationParameters serviceInitializationParameters);

    Task<string> OpenAsync(CancellationToken cancellationToken);

    Task CloseAsync(CancellationToken cancellationToken);

    void Abort();
}

```
The endpoints that are required for the service are described via the [Service manifest](service-fabric-application-model.md) under the Endpoints section.

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

## Client to Service Communication
Reliable Services API provides the following abstractions which make writing clients for communicating with Services easy.

## ServicePartitionResolver
ServicePartitionResolver class helps the client to determine the endpoint of a Service Fabric service at runtime.

> [AZURE.TIP] The process of determining the endpoint of a service is referred to as Service Endpoint Resolution in Service Fabric terminology.

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

## CommunicationClientFactory
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
    protected override void AbortClient(MyCommunicationClient1 client)
    {
        throw new NotImplementedException();
    }

    protected override Task<MyCommunicationClient> CreateClientAsync(ResolvedServiceEndpoint endpoint, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    protected override bool ValidateClient(MyCommunicationClient clientChannel)
    {
        throw new NotImplementedException();
    }

    protected override bool ValidateClient(ResolvedServiceEndpoint endpoint, MyCommunicationClient client)
    {
        throw new NotImplementedException();
    }
}

```

## ServicePartitionClient
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

A typical usage pattern would look like this,

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
* [Default communication stack provided by the Reliable Services Framework](service-fabric-reliable-services-communication-default.md)

* [WCF based communication stack provided by the Reliable Services Framework](service-fabric-reliable-services-communication-wcf.md)

* [Writing a Service using Reliable Services API that uses WebAPI communication stack](service-fabric-reliable-services-communication-webapi.md)
 
