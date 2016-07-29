<properties
   pageTitle="Service remoting in Service Fabric | Microsoft Azure"
   description="Service Fabric remoting allows clients and services to communicate with services by using a remote procedure call."
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

# Service remoting with Reliable Services
For services that are not tied to a particular communication protocol or stack, such as WebAPI, Windows Communication Foundation (WCF), or others, the Reliable Services framework provides a remoting mechanism to quickly and easily set up remote procedure call for services.

## Set up remoting on a service
Setting up remoting for a service is done in two simple steps:

1. Create an interface for your service to implement. This interface defines the methods that will be available for a remote procedure call on your service. The methods must be task-returning asynchronous methods. The interface must implement `Microsoft.ServiceFabric.Services.Remoting.IService` to signal that the service has a remoting interface.
2. Use a remoting listener in your service. This is an `ICommunicationListener` implementation that provides remoting capabilities. The `Microsoft.ServiceFabric.Services.Remoting.Runtime` namespace contains an extension method, 
`CreateServiceRemotingListener` for both stateless and stateful services that can be used to create a remoting listener using the default remoting transport protocol.

For example, the following stateless service exposes a single method to get "Hello World" over a remote procedure call.

```csharp
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;

public interface IMyService : IService
{
    Task<string> GetHelloWorld();
}

class MyService : StatelessService, IMyService
{
    public MyService(StatelessServiceContext context)
        : base (context)
    {
    }

    public Task HelloWorld()
    {
        return Task.FromResult("Hello!");
    }

    protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
    {
        return new[] { new ServiceInstanceListener(context => 
            this.CreateServiceRemotingListener(context)) };
    }
}
```
> [AZURE.NOTE] The arguments and the return types in the service interface can be any simple, complex, or custom types, but they must be serializable by the .NET [DataContractSerializer](https://msdn.microsoft.com/library/ms731923.aspx).


## Call remote service methods
Calling methods on a service by using the remoting stack is done by using a local proxy to the service through the `Microsoft.ServiceFabric.Services.Remoting.Client.ServiceProxy` class. The `ServiceProxy` method creates a local proxy by using the same interface that the service implements. With that proxy, you can simply call methods on the interface remotely.


```csharp

IMyService helloWorldClient = ServiceProxy.Create<IMyService>(new Uri("fabric:/MyApplication/MyHelloWorldService"));

string message = await helloWorldClient.GetHelloWorld();

```

The remoting framework propagates exceptions thrown at the service to the client. So exception-handling logic at the client by using `ServiceProxy` can directly handle exceptions that the service throws.

## Next steps

* [Web API with OWIN in Reliable Services](service-fabric-reliable-services-communication-webapi.md)

* [WCF communication with Reliable Services](service-fabric-reliable-services-communication-wcf.md)

* [Securing communication for Reliable Services](service-fabric-reliable-services-secure-communication.md)
