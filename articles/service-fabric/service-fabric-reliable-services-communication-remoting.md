---
title: Service remoting by using C# in Service Fabric | Microsoft Docs
description: Service Fabric remoting allows clients and services to communicate with C# services by using a remote procedure call.
services: service-fabric
documentationcenter: .net
author: vturecek
manager: chackdan
editor: BharatNarasimman

ms.assetid: abfaf430-fea0-4974-afba-cfc9f9f2354b
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: required
ms.date: 09/20/2017
ms.author: vturecek

---
# Service remoting in C# with Reliable Services

> [!div class="op_single_selector"]
> * [C# on Windows](service-fabric-reliable-services-communication-remoting.md)
> * [Java on Linux](service-fabric-reliable-services-communication-remoting-java.md)
>
>

For services that aren't tied to a particular communication protocol or stack, such as a web API, Windows Communication Foundation, or others, the Reliable Services framework provides a remoting mechanism to quickly and easily set up remote procedure calls for services. This article discusses how to set up remote procedure calls for services written with C#.

## Set up remoting on a service

You can set up remoting for a service in two simple steps:

1. Create an interface for your service to implement. This interface defines the methods that are available for a remote procedure call on your service. The methods must be task-returning asynchronous methods. The interface must implement `Microsoft.ServiceFabric.Services.Remoting.IService` to signal that the service has a remoting interface.
2. Use a remoting listener in your service. A remoting listener is an `ICommunicationListener` implementation that provides remoting capabilities. The `Microsoft.ServiceFabric.Services.Remoting.Runtime` namespace contains the extension method `CreateServiceRemotingListener` for both stateless and stateful services that can be used to create a remoting listener by using the default remoting transport protocol.

>[!NOTE]
>The `Remoting` namespace is available as a separate NuGet package called `Microsoft.ServiceFabric.Services.Remoting`.

For example, the following stateless service exposes a single method to get "Hello World" over a remote procedure call.

```csharp
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;

public interface IMyService : IService
{
    Task<string> HelloWorldAsync();
}

class MyService : StatelessService, IMyService
{
    public MyService(StatelessServiceContext context)
        : base (context)
    {
    }

    public Task<string> HelloWorldAsync()
    {
        return Task.FromResult("Hello!");
    }

    protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
    {
     return this.CreateServiceRemotingInstanceListeners();
    }
}
```

> [!NOTE]
> The arguments and the return types in the service interface can be any simple, complex, or custom types, but they must be able to be serialized by the .NET [DataContractSerializer](https://msdn.microsoft.com/library/ms731923.aspx).
>
>

## Call remote service methods

Calling methods on a service by using the remoting stack is done by using a local proxy to the service through the `Microsoft.ServiceFabric.Services.Remoting.Client.ServiceProxy` class. The `ServiceProxy` method creates a local proxy by using the same interface that the service implements. With that proxy, you can call methods on the interface remotely.

```csharp

IMyService helloWorldClient = ServiceProxy.Create<IMyService>(new Uri("fabric:/MyApplication/MyHelloWorldService"));

string message = await helloWorldClient.HelloWorldAsync();

```

The remoting framework propagates exceptions thrown by the service to the client. As a result, when `ServiceProxy`is used, the client is responsible for handling the exceptions thrown by the service.

## Service proxy lifetime

Service proxy creation is a lightweight operation, so you can create as many as you need. Service proxy instances can be reused for as long as they are needed. If a remote procedure call throws an exception, you can still reuse the same proxy instance. Each service proxy contains a communication client used to send messages over the wire. While invoking remote calls, internal checks are performed to determine if the communication client is valid. Based on the results of those checks, the communication client is re-created if needed. Therefore, if an exception occurs, you do not need to re-create `ServiceProxy`.

### Service proxy factory lifetime

[ServiceProxyFactory](https://docs.microsoft.com/dotnet/api/microsoft.servicefabric.services.remoting.client.serviceproxyfactory) is a factory that creates proxy instances for different remoting interfaces. If you use the API `ServiceProxyFactory.CreateServiceProxy` to create a proxy, the framework creates a singleton service proxy.
It is useful to create one manually when you need to override [IServiceRemotingClientFactory](https://docs.microsoft.com/dotnet/api/microsoft.servicefabric.services.remoting.v1.client.iserviceremotingclientfactory) properties.
Factory creation is an expensive operation. A service proxy factory maintains an internal cache of the communication client.
A best practice is to cache the service proxy factory for as long as possible.

## Remoting exception handling

All remote exceptions thrown by the service API are sent back to the client as AggregateException. Remote exceptions should be able to be serialized by DataContract. If they are not, the proxy API throws [ServiceException](https://docs.microsoft.com/dotnet/api/microsoft.servicefabric.services.communication.serviceexception) with the serialization error in it.

The service proxy handles all failover exceptions for the service partition it is created for. It re-resolves the endpoints if there are failover exceptions (non-transient exceptions) and retries the call with the correct endpoint. The number of retries for failover exceptions is indefinite.
If transient exceptions occur, the proxy retries the call.

Default retry parameters are provided by [OperationRetrySettings](https://docs.microsoft.com/dotnet/api/microsoft.servicefabric.services.communication.client.operationretrysettings).

A user can configure these values by passing the OperationRetrySettings object to the ServiceProxyFactory constructor.

## Use the remoting V2 stack

As of version 2.8 of the NuGet remoting package, you have the option to use the remoting V2 stack. The remoting V2 stack performs better. It also provides features like custom serialization and more pluggable APIs.
Template code continues to use the remoting V1 stack.
Remoting V2 is not compatible with V1 (the previous remoting stack). Follow the instructions in the article  [Upgrade from V1 to V2](#upgrade-from-remoting-v1-to-remoting-v2) to avoid effects on service availability.

The following approaches are available to enable the V2 stack.

### Use an assembly attribute to use the V2 stack

These steps change the template code to use the V2 stack by using an assembly attribute.

1. Change the endpoint resource from `"ServiceEndpoint"` to `"ServiceEndpointV2"` in the service manifest.

   ```xml
   <Resources>
    <Endpoints>
      <Endpoint Name="ServiceEndpointV2" />
    </Endpoints>
   </Resources>
   ```

2. Use the `Microsoft.ServiceFabric.Services.Remoting.Runtime.CreateServiceRemotingInstanceListeners`  extension method to create remoting listeners (equal for both V1 and V2).

   ```csharp
    protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
    {
        return this.CreateServiceRemotingInstanceListeners();
    }
   ```

3. Mark the assembly that contains the remoting interfaces with a `FabricTransportServiceRemotingProvider` attribute.

   ```csharp
   [assembly: FabricTransportServiceRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V2, RemotingClientVersion = RemotingClientVersion.V2)]
   ```

No code changes are required in the client project.
Build the client assembly with the interface assembly to make sure that the assembly attribute previously shown is used.

### Use explicit V2 classes to use the V2 stack

As an alternative to using an assembly attribute, the V2 stack also can be enabled by using explicit V2 classes.

These steps change the template code to use the V2 stack by using explicit V2 classes.

1. Change the endpoint resource from `"ServiceEndpoint"` to `"ServiceEndpointV2"` in the service manifest.

   ```xml
   <Resources>
    <Endpoints>
      <Endpoint Name="ServiceEndpointV2" />
    </Endpoints>
   </Resources>
   ```

2. Use [FabricTransportServiceRemotingListener](https://docs.microsoft.com/dotnet/api/microsoft.servicefabric.services.remoting.v2.fabrictransport.runtime.fabrictransportserviceremotingListener?view=azure-dotnet) from the `Microsoft.ServiceFabric.Services.Remoting.V2.FabricTransport.Runtime` namespace.

   ```csharp
   protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
    {
        return new[]
        {
            new ServiceInstanceListener((c) =>
            {
                return new FabricTransportServiceRemotingListener(c, this);

            })
        };
    }
   ```

3. Use [FabricTransportServiceRemotingClientFactory](https://docs.microsoft.com/dotnet/api/microsoft.servicefabric.services.remoting.v2.fabrictransport.client.fabrictransportserviceremotingclientfactory?view=azure-dotnet) from the `Microsoft.ServiceFabric.Services.Remoting.V2.FabricTransport.Client` namespace to create clients.

   ```csharp
   var proxyFactory = new ServiceProxyFactory((c) =>
          {
              return new FabricTransportServiceRemotingClientFactory();
          });
   ```

## Upgrade from remoting V1 to remoting V2

To upgrade from V1 to V2, two-step upgrades are required. Follow the steps in this sequence.

1. Upgrade the V1 service to V2 service by using this attribute.
This change makes sure that the service listens on the V1 and V2 listener.

    a. Add an endpoint resource with the name "ServiceEndpointV2" in the service manifest.
      ```xml
      <Resources>
        <Endpoints>
          <Endpoint Name="ServiceEndpointV2" />  
        </Endpoints>
      </Resources>
      ```

    b. Use the following extension method to create a remoting listener.

    ```csharp
    protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
    {
        return this.CreateServiceRemotingInstanceListeners();
    }
    ```

    c. Add an assembly attribute on remoting interfaces to use the V1 and V2 listener and the V2 client.
    ```csharp
    [assembly: FabricTransportServiceRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V2|RemotingListenerVersion.V1, RemotingClientVersion = RemotingClientVersion.V2)]

      ```
2. Upgrade the V1 client to a V2 client by using the V2 client attribute.
This step makes sure the client uses the V2 stack.
No change in the client project/service is required. Building client projects with updated interface assembly is sufficient.

3. This step is optional. Use the V2 listener attribute, and then upgrade the V2 service.
This step makes sure that the service is listening only on the V2 listener.

    ```csharp
    [assembly: FabricTransportServiceRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V2, RemotingClientVersion = RemotingClientVersion.V2)]
    ```


## Use the remoting V2 (interface compatible) stack

 The remoting V2 (interface compatible, known as V2_1) stack has all the features of the V2 remoting stack. Its interface stack is compatible with the remoting V1 stack, but it is not backward compatible with V2 and V1. To upgrade from V1 to V2_1 without affecting service availability, follow the steps in the article Upgrade from V1 to V2 (interface compatible).


### Use an assembly attribute to use the remoting V2 (interface compatible) stack

Follow these steps to change to a V2_1 stack.

1. Add an endpoint resource with the name "ServiceEndpointV2_1" in the service manifest.

   ```xml
   <Resources>
    <Endpoints>
      <Endpoint Name="ServiceEndpointV2_1" />  
    </Endpoints>
   </Resources>
   ```

2. Use the remoting extension method to create a remoting listener.

   ```csharp
    protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
    {
        return this.CreateServiceRemotingInstanceListeners();
    }
   ```

3. Add an [assembly attribute](https://docs.microsoft.com/dotnet/api/microsoft.servicefabric.services.remoting.fabrictransport.fabrictransportserviceremotingproviderattribute?view=azure-dotnet) on remoting interfaces.

   ```csharp
 	[assembly:  FabricTransportServiceRemotingProvider(RemotingListenerVersion=  RemotingListenerVersion.V2_1, RemotingClientVersion= RemotingClientVersion.V2_1)]

   ```

No changes are required in the client project.
Build the client assembly with the interface assembly to make sure that the previous assembly attribute is being used.

### Use explicit remoting classes to create a listener/client factory for the V2 (interface compatible) version

Follow these steps:

1. Add an endpoint resource with the name "ServiceEndpointV2_1" in the service manifest.

   ```xml
   <Resources>
    <Endpoints>
      <Endpoint Name="ServiceEndpointV2_1" />  
    </Endpoints>
   </Resources>
   ```

2. Use the [remoting V2 listener](https://docs.microsoft.com/dotnet/api/microsoft.servicefabric.services.remoting.v2.fabrictransport.runtime.fabrictransportserviceremotinglistener?view=azure-dotnet). The default service endpoint resource name used is "ServiceEndpointV2_1." It must be defined in the service manifest.

   ```csharp
   protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
    {
        return new[]
        {
            new ServiceInstanceListener((c) =>
            {
                var settings = new FabricTransportRemotingListenerSettings();
                settings.UseWrappedMessage = true;
                return new FabricTransportServiceRemotingListener(c, this,settings);

            })
        };
    }
   ```

3. Use the V2 [client factory](https://docs.microsoft.com/dotnet/api/microsoft.servicefabric.services.remoting.v2.fabrictransport.client.fabrictransportserviceremotingclientfactory?view=azure-dotnet).
   ```csharp
   var proxyFactory = new ServiceProxyFactory((c) =>
          {
            var settings = new FabricTransportRemotingSettings();
            settings.UseWrappedMessage = true;
            return new FabricTransportServiceRemotingClientFactory(settings);
          });
   ```

## Upgrade from remoting V1 to remoting V2 (interface compatible)

To upgrade from V1 to V2 (interface compatible, known as V2_1), two-step upgrades are required. Follow the steps in this sequence.

1. Upgrade the V1 service to V2_1 service by using the following attribute.
This change makes sure that the service is listening on the V1 and the V2_1 listener.

    a. Add an endpoint resource with the name "ServiceEndpointV2_1" in the service manifest.
      ```xml
      <Resources>
        <Endpoints>
          <Endpoint Name="ServiceEndpointV2_1" />  
        </Endpoints>
      </Resources>
      ```

    b. Use the following extension method to create a remoting listener.

    ```csharp
    protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
    {
        return this.CreateServiceRemotingInstanceListeners();
    }
    ```

    c. Add an assembly attribute on remoting interfaces to use the V1, V2_1 listener, and V2_1 client.
    ```csharp
   [assembly: FabricTransportServiceRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V2_1 | RemotingListenerVersion.V1, RemotingClientVersion = RemotingClientVersion.V2_1)]

      ```
2. Upgrade the V1 client to the V2_1 client by using the V2_1 client attribute.
This step makes sure the client is using the V2_1 stack.
No change in the client project/service is required. Building client projects with updated interface assembly is sufficient.

3. This step is optional. Remove the V1 listener version from the attribute, and then upgrade the V2 service.
This step makes sure that the service is listening only on the V2 listener.

    ```csharp
    [assembly: FabricTransportServiceRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V2_1, RemotingClientVersion = RemotingClientVersion.V2_1)]
    ```
  
### Use custom serialization with a remoting wrapped message

For a remoting wrapped message, we create a single wrapped object with all the parameters as a field in it.
Follow these steps:

1. Implement the `IServiceRemotingMessageSerializationProvider` interface to provide implementation for custom serialization.
    This code snippet shows what the implementation looks like.

      ```csharp
      public class ServiceRemotingJsonSerializationProvider : IServiceRemotingMessageSerializationProvider
      {
        public IServiceRemotingMessageBodyFactory CreateMessageBodyFactory()
        {
          return new JsonMessageFactory();
        }

        public IServiceRemotingRequestMessageBodySerializer CreateRequestMessageSerializer(Type serviceInterfaceType, IEnumerable<Type> requestWrappedType, IEnumerable<Type> requestBodyTypes = null)
        {
          return new ServiceRemotingRequestJsonMessageBodySerializer();
        }

        public IServiceRemotingResponseMessageBodySerializer CreateResponseMessageSerializer(Type serviceInterfaceType, IEnumerable<Type> responseWrappedType, IEnumerable<Type> responseBodyTypes = null)
        {
          return new ServiceRemotingResponseJsonMessageBodySerializer();
        }
      }
      ```
      ```csharp
        class JsonMessageFactory : IServiceRemotingMessageBodyFactory
            {

              public IServiceRemotingRequestMessageBody CreateRequest(string interfaceName, string methodName, int numberOfParameters, object wrappedRequestObject)
              {
                return new JsonBody(wrappedRequestObject);
              }

              public IServiceRemotingResponseMessageBody CreateResponse(string interfaceName, string methodName, object wrappedRequestObject)
              {
                return new JsonBody(wrappedRequestObject);
              }
            }
      ```
      ```csharp
      class ServiceRemotingRequestJsonMessageBodySerializer : IServiceRemotingRequestMessageBodySerializer
        {
            private JsonSerializer serializer;

            public ServiceRemotingRequestJsonMessageBodySerializer()
            {
              serializer = JsonSerializer.Create(new JsonSerializerSettings()
              {
                TypeNameHandling = TypeNameHandling.All
                });
              }

              public IOutgoingMessageBody Serialize(IServiceRemotingRequestMessageBody serviceRemotingRequestMessageBody)
             {
               if (serviceRemotingRequestMessageBody == null)
               {
                 return null;
               }          
               using (var writeStream = new MemoryStream())
               {
                 using (var jsonWriter = new JsonTextWriter(new StreamWriter(writeStream)))
                 {
                   serializer.Serialize(jsonWriter, serviceRemotingRequestMessageBody);
                   jsonWriter.Flush();
                   var bytes = writeStream.ToArray();
                   var segment = new ArraySegment<byte>(bytes);
                   var segments = new List<ArraySegment<byte>> { segment };
                   return new OutgoingMessageBody(segments);
                 }
               }
              }

              public IServiceRemotingRequestMessageBody Deserialize(IIncomingMessageBody messageBody)
             {
               using (var sr = new StreamReader(messageBody.GetReceivedBuffer()))
               {
                 using (JsonReader reader = new JsonTextReader(sr))
                 {
                   var ob = serializer.Deserialize<JsonBody>(reader);
                   return ob;
                 }
               }
             }
            }
      ```
      ```csharp
      class ServiceRemotingResponseJsonMessageBodySerializer : IServiceRemotingResponseMessageBodySerializer
       {
         private JsonSerializer serializer;

        public ServiceRemotingResponseJsonMessageBodySerializer()
        {
          serializer = JsonSerializer.Create(new JsonSerializerSettings()
          {
              TypeNameHandling = TypeNameHandling.All
            });
          }

          public IOutgoingMessageBody Serialize(IServiceRemotingResponseMessageBody responseMessageBody)
          {
            if (responseMessageBody == null)
            {
              return null;
            }

            using (var writeStream = new MemoryStream())
            {
              using (var jsonWriter = new JsonTextWriter(new StreamWriter(writeStream)))
              {
                serializer.Serialize(jsonWriter, responseMessageBody);
                jsonWriter.Flush();
                var bytes = writeStream.ToArray();
                var segment = new ArraySegment<byte>(bytes);
                var segments = new List<ArraySegment<byte>> { segment };
                return new OutgoingMessageBody(segments);
              }
            }
          }

          public IServiceRemotingResponseMessageBody Deserialize(IIncomingMessageBody messageBody)
          {

             using (var sr = new StreamReader(messageBody.GetReceivedBuffer()))
             {
               using (var reader = new JsonTextReader(sr))
               {
                 var obj = serializer.Deserialize<JsonBody>(reader);
                 return obj;
               }
             }
           }
       }
    ```
    ```csharp
    class JsonBody : WrappedMessage, IServiceRemotingRequestMessageBody, IServiceRemotingResponseMessageBody
    {
          public JsonBody(object wrapped)
          {
            this.Value = wrapped;
          }

          public void SetParameter(int position, string parameName, object parameter)
          {  //Not Needed if you are using WrappedMessage
            throw new NotImplementedException();
          }

          public object GetParameter(int position, string parameName, Type paramType)
          {
            //Not Needed if you are using WrappedMessage
            throw new NotImplementedException();
          }

          public void Set(object response)
          { //Not Needed if you are using WrappedMessage
            throw new NotImplementedException();
          }

          public object Get(Type paramType)
          {  //Not Needed if you are using WrappedMessage
            throw new NotImplementedException();
          }
    }
    ```

2. Override the default serialization provider with `JsonSerializationProvider` for a remoting listener.

   ```csharp
   protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
   {
       return new[]
       {
           new ServiceInstanceListener((c) =>
           {
               return new FabricTransportServiceRemotingListener(c, this,
                   new ServiceRemotingJsonSerializationProvider());
           })
       };
   }
   ```

3. Override the default serialization provider with `JsonSerializationProvider` for a remoting client factory.

    ```csharp
    var proxyFactory = new ServiceProxyFactory((c) =>
    {
        return new FabricTransportServiceRemotingClientFactory(
        serializationProvider: new ServiceRemotingJsonSerializationProvider());
      });
      ```

## Next steps

* [Web API with OWIN in Reliable Services](service-fabric-reliable-services-communication-webapi.md)
* [Windows Communication Foundation communication with Reliable Services](service-fabric-reliable-services-communication-wcf.md)
* [Secure communication for Reliable Services](service-fabric-reliable-services-secure-communication.md)
