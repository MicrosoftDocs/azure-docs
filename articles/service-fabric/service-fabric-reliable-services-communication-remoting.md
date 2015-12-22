<properties
   pageTitle="Service remoting in Service Fabric | Microsoft Azure"
   description="Service Fabric remoting allows clients and services to communicate with services using remote procedure call."
   services="service-fabric"
   documentationCenter=".net"
   authors="BharatNarasimman"
   manager="timlt"
   editor="vturecek"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="required"
   ms.date="11/12/2015"
   ms.author="bharatn@microsoft.com"/>

# Service remoting with Reliable Services
For services that are not tied to a particular communication protocol or stack, such as WebAPI, WCF, or others, the framework provides a remoting mechanism to quickly and easily set up remote procedure call for services.

## Set up remoting on a service
Setting up remoting for a service is done in two simple steps.

1. Create an interface for your service to implement. This interface defines the methods that will be available for remote procedure call on your service, and must be Task-returning asynchronous methods. The interface must implement `Microsoft.ServiceFabric.Services.Remoting.IService` to signal that the service has a remoting interface. 
2. Use `Microsoft.ServiceFabric.Services.Remoting.Runtime.ServiceRemotingListener` in your service. This is an `ICommunicationListener` implementation that provides remoting capabilities.

For example, this Hello World service exposes a single method to get "Hello World" over remote procedure call:

```csharp
public interface IHelloWorldStateful : IService
{
    Task<string> GetHelloWorld();
}

internal class HelloWorldStateful : StatefulService, IHelloWorldStateful
{
    protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
    {
        return new[] { new ServiceReplicaListener(parameters => new ServiceRemotingListener<HelloWorldStateful>(parameters, this)) };
    }

    public Task<string> GetHelloWorld()
    {
        return Task.FromResult("Hello World!");
    }
}

```
> [AZURE.NOTE] The arguments and the return types in the service interface can any simple, complex, or custom types, but they must be serializable by the .net [DataContractSerializer](https://msdn.microsoft.com/library/ms731923.aspx).


## Call remote service methods
Calling methods on a service using the remoting stack is done using a local proxy to the service through the `Microsoft.ServiceFabric.Services.Remoting.Client.ServiceProxy` class. The `ServiceProxy` creates a local proxy using the same interface that the service implements. With that proxy, you can simply call methods on the interface remotely.


```csharp

IHelloWorldStateful helloWorldClient = ServiceProxy.Create<IHelloWorldStateful>(new Uri("fabric:/MyApplication/MyHelloWorldService"));

string message = await helloWorldClient.GetHelloWorld();

```

The remoting framework propagates exceptions thrown at the service to the client. So exception handling logic at the client using `ServiceProxy` can directly handle execeptions that the service throws.
 
## Next steps

* [Web API with OWIN in Reliable Services](service-fabric-reliable-services-communication-webapi.md)

* [WCF communication with Reliable Services](service-fabric-reliable-services-communication-wcf.md)

