<properties
   pageTitle="Default communication stack provided by Service Fabric"
   description="This article describes the default communication stack provided by the Reliable Service's Framework for Services and clients to communicate."
   services="service-fabric"
   documentationCenter=".net"
   authors="BharatNarasimman"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="required"
   ms.date="04/13/2015"
   ms.author="bharatn@microsoft.com"/>

# Default communication stack provided by Reliable Services Framework
For service authors who are not tied to a particular implementation of communication stack(WebAPI, WCF etc), the framework provides Client and Service side communication pieces that can be used to setup communication between the Service and Client.

> [AZURE.NOTE] Please update to the latest nuget packges to get the features mentioned below.

## Service Communication Listener
The default communication listener for the service is implemented in the `ServiceCommunicationListener` class

```csharp

public class ServiceCommunicationListener<TServiceImplementation> : ICommunicationListener where TServiceImplementation : class
{
    public ServiceCommunicationListener(TServiceImplementation serviceImplementationType);
    public ServiceCommunicationListener(TServiceImplementation serviceImplementationType, string endpointResourceName);

    public void Abort();
    public Task CloseAsync(CancellationToken cancellationToken);
    public void Initialize(ServiceInitializationParameters serviceInitializationParameters);
    public Task<string> OpenAsync(CancellationToken cancellationToken);
}

```
The methods that the service service implements and wants to expose to its clients are defined as asynchronous methods in an interface which inherits from the `IService` interface. The service can then just instantiate the `ServiceCommunicationListener` object and return it in the [`CreateCommunicationListener` method](service-fabric-reliable-services-communication.md). For example, the HelloWorld service code to setup this communication stack may be defined as follows.

```csharp

[DataContract]
public class Message
{
    [DataMember]
    public string Content;
}

public interface IHelloWorld : IService
{
    Task<Message> GetGreeting();
}

public class HelloWorldService : StatelessService, IHelloWorld
{
    public const string ServiceTypeName = "HelloWorldUsingDefaultCommunicationType";

    private Message greeting = new Message() { Content = "Default greeting" };

    protected override ICommunicationListener CreateCommunicationListener()
    {
        return new ServiceCommunicationListener<HelloWorldService>(this);
    }

    public Task<Message> GetGreeting()
    {
        return Task.FromResult(this.greeting);
    }
}

```
> [AZURE.NOTE] The arguments and the return types in the Service Interface, for example the Message class above, are expected to be serializable by the .net [DataContractSerializer](https://msdn.microsoft.com/library/ms731923.aspx).


## Writing Clients to communicate with ServiceCommunicationListener
For clients to communicate to services using the `ServiceCommunicationListener`, the framework provides a `ServiceProxy` class.

```csharp

public abstract class ServiceProxy : IServiceProxy
{
...

    public static TServiceInterface Create<TServiceInterface>(Uri serviceName);

...
}

```

Clients can instantiate a service proxy object that implements the corresponding Service Interface and invoke methods on the proxy object.

```csharp

var helloWorldClient = ServiceProxy.Create<IHelloWorld>(helloWorldServiceName);

var message = await helloWorldClient.GetGreeting();

Console.WriteLine("Greeting is {0}", message.Content);


```

>[AZURE.NOTE] The communication framework takes care of propagating exceptions thrown at the service to the client. So exception handling logic at the client using ServiceProxy can directly handle for execeptions that the service can potentially throw.
