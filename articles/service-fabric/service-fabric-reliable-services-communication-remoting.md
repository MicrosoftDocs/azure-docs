---
title: Service remoting using C# in Service Fabric | Microsoft Docs
description: Service Fabric remoting allows clients and services to communicate with C# services by using a remote procedure call.
services: service-fabric
documentationcenter: .net
author: vturecek
manager: timlt
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
# Service Remoting in C# with Reliable Services
> [!div class="op_single_selector"]
> * [C# on Windows](service-fabric-reliable-services-communication-remoting.md)
> * [Java on Linux](service-fabric-reliable-services-communication-remoting-java.md)
>
>

For services that aren't tied to a particular communication protocol or stack, such as WebAPI, Windows Communication Foundation (WCF), or others, the Reliable Services framework provides a remoting mechanism to quickly and easily set up remote procedure calls for services. This article discusses how to set up remote procedure calls for services written with C#.

## Set up Remoting on a Service
Setting up remoting for a service is done in two simple steps:

1. Create an interface for your service to implement. This interface defines the methods that are available for a remote procedure call on your service. The methods must be task-returning asynchronous methods. The interface must implement `Microsoft.ServiceFabric.Services.Remoting.IService` to signal that the service has a remoting interface.
2. Use a remoting listener in your service. RemotingListener is an `ICommunicationListener` implementation that provides remoting capabilities. The `Microsoft.ServiceFabric.Services.Remoting.Runtime` namespace contains an extension method,`CreateServiceRemotingListener` for both stateless and stateful services that can be used to create a remoting listener using the default remoting transport protocol.

>[!NOTE]
>The `Remoting` namespace is available as a separate NuGet package called `Microsoft.ServiceFabric.Services.Remoting`

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
> The arguments and the return types in the service interface can be any simple, complex, or custom types, but they must be serializable by the .NET [DataContractSerializer](https://msdn.microsoft.com/library/ms731923.aspx).
>
>

## Call Remote Service Methods
Calling methods on a service by using the remoting stack is done by using a local proxy to the service through the `Microsoft.ServiceFabric.Services.Remoting.Client.ServiceProxy` class. The `ServiceProxy` method creates a local proxy by using the same interface that the service implements. With that proxy, you can call methods on the interface remotely.

```csharp

IMyService helloWorldClient = ServiceProxy.Create<IMyService>(new Uri("fabric:/MyApplication/MyHelloWorldService"));

string message = await helloWorldClient.HelloWorldAsync();

```

The remoting framework propagates exceptions thrown by the service to the client. As a result, when using `ServiceProxy`, the client is responsible for handling the exceptions thrown by the service.

## Service Proxy Lifetime
ServiceProxy creation is a lightweight operation, so you can create as many as you need. Service Proxy instances can be reused as long as they are needed. If a remote procedure call throws an Exception, you can still reuse the same proxy instance. Each ServiceProxy contains a communication client used to send messages over the wire. While invoking remote calls, internal checks are performed to determine if the communication client is valid. Based on the results of those checks, the communication client is recreated if needed. Therefore, if an exception occurs, you do not need to recreate `ServiceProxy`.

### ServiceProxyFactory Lifetime
[ServiceProxyFactory](https://docs.microsoft.com/dotnet/api/microsoft.servicefabric.services.remoting.client.serviceproxyfactory) is a factory that creates proxy instances for different remoting interfaces. If you use the api `ServiceProxy.Create` for creating proxy, then the framework creates a singleton ServiceProxy.
It is useful to create one manually when you need to override [IServiceRemotingClientFactory](https://docs.microsoft.com/dotnet/api/microsoft.servicefabric.services.remoting.v1.client.iserviceremotingclientfactory) properties.
Factory creation is an expensive operation. ServiceProxyFactory maintains an internal cache of communication client.
Best practice is to cache ServiceProxyFactory for as long as possible.

## Remoting Exception Handling
All remote exceptions thrown by the service API are sent back to the client as AggregateException. RemoteExceptions should be DataContract serializable; if they are not, the proxy API throws [ServiceException](https://docs.microsoft.com/dotnet/api/microsoft.servicefabric.services.communication.serviceexception) with the serialization error in it.

ServiceProxy handles all failover exceptions for the service partition it is created for. It re-resolves the endpoints if there are failover exceptions (non-transient exceptions) and retries the call with the correct endpoint. The number of retries for failover exceptions are indefinite.
If transient exceptions occur, the proxy retries the call.

Default retry parameters are provided by [OperationRetrySettings](https://docs.microsoft.com/dotnet/api/microsoft.servicefabric.services.communication.client.operationretrysettings).

User can configure these values by passing OperationRetrySettings object to ServiceProxyFactory constructor.

## How to use the Remoting V2 stack

As of the NuGet Remoting package version 2.8, you have the option to use the Remoting V2 stack. The Remoting V2 stack is more performant and provides features like custom serialization and more pluggable API's.
Template code continues to use the Remoting V1 Stack.
Remoting V2 is not compatible with V1 (the previous Remoting stack), so follow the instructions below on [how to upgrade from V1 to V2](#how-to-upgrade-from-remoting-v1-to-remoting-v2) without impacting service availability.

The following approaches are available to enable the V2 stack.

### Using an assembly attribute to use the V2 stack

These steps change template code to use the V2 Stack using an assembly attribute.

1. Change the Endpoint Resource from `"ServiceEndpoint"` to `"ServiceEndpointV2"` in the service manifest.

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

3. Mark the assembly containing the remoting interfaces with a `FabricTransportServiceRemotingProvider` attribute.

  ```csharp
  [assembly: FabricTransportServiceRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V2, RemotingClientVersion = RemotingClientVersion.V2)]
  ```

No code changes are required in the client project.
Build the client assembly with the interface assembly to make sure that the assembly attribute shown above is used.

### Using explicit V2 classes to use the V2 stack

As an alternative to using an assembly attribute, the V2 stack can also be enabled by using explicit V2 classes.

These steps change template code to use the V2 Stack using explicit V2 classes.

1. Change the Endpoint Resource from `"ServiceEndpoint"` to `"ServiceEndpointV2"` in the service manifest.

  ```xml
  <Resources>
    <Endpoints>
      <Endpoint Name="ServiceEndpointV2" />
    </Endpoints>
  </Resources>
  ```

2. Use the [FabricTransportServiceRemotingListener](https://docs.microsoft.com/dotnet/api/microsoft.servicefabric.services.remoting.v2.fabrictransport.runtime.fabrictransportserviceremotingListener?view=azure-dotnet) from the `Microsoft.ServiceFabric.Services.Remoting.V2.FabricTransport.Runtime` namespace.

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

3. Use the [FabricTransportServiceRemotingClientFactory ](https://docs.microsoft.com/dotnet/api/microsoft.servicefabric.services.remoting.v2.fabrictransport.client.fabrictransportserviceremotingclientfactory?view=azure-dotnet) from the `Microsoft.ServiceFabric.Services.Remoting.V2.FabricTransport.Client` namespace to create clients.

  ```csharp
  var proxyFactory = new ServiceProxyFactory((c) =>
          {
              return new FabricTransportServiceRemotingClientFactory();
          });
  ```

## How to upgrade from Remoting V1 to Remoting V2.
In order to upgrade from V1 to V2, 2-step upgrades are required. Following steps to be executed in the sequence listed.

1. Upgrade the V1 Service to V2 Service by using below Attribute.
This change makes sure that service is listening  on V1 and V2 Listener.

    a)  Add an Endpoint Resource with name as "ServiceEndpointV2" in the service manifest.
      ```xml
      <Resources>
        <Endpoints>
          <Endpoint Name="ServiceEndpointV2" />  
        </Endpoints>
      </Resources>
      ```

    b)  Use Following Extension Method to Create Remoting Listener.

    ```csharp
    protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
    {
        return this.CreateServiceRemotingInstanceListeners();
    }
    ```

    c)  Add Assembly Attribute on Remoting Interfaces to use V1 and V2 Listener and V2 Client.
    ```csharp
    [assembly: FabricTransportServiceRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V2|RemotingListenerVersion.V1, RemotingClientVersion = RemotingClientVersion.V2)]

      ```
2. Upgrade the V1 Client to  V2 Client by using V2 Client Attribute.
This step makes sure Client is using V2 stack.
No Change in Client Project/Service is required. Building Client projects with updated interface assembly is sufficient.

3. This step is optional. Use V2Listener Attribute and then Upgrade the V2 Service.
This step makes sure that service is listening only on V2 Listener.

```csharp
[assembly: FabricTransportServiceRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V2, RemotingClientVersion = RemotingClientVersion.V2)]
```


## How to use Remoting V2(InterfaceCompatible) stack
 Remoting V2(InterfaceCompatible aka V2_1) stack has all the features of V2 Remoting stack besides it is interface compatible stack to Remoting V1 stack but is not backward compatible with V2 and V1. In order to do the upgrade from V1 to V2_1 without impacting service availability, follow below article[how to upgrade from V1 to V2(InterfaceCompatible)](#how-to-upgrade-from-remoting-v1-to-remoting-v2interfacecompatible).


### Using Assembly Attribute to use Remoting V2(InterfaceCompatible) stack.

Here are the steps to follow to change to V2_1 Stack.

1. Add an Endpoint Resource with name as "ServiceEndpointV2_1" in the service manifest.

  ```xml
  <Resources>
    <Endpoints>
      <Endpoint Name="ServiceEndpointV2_1" />  
    </Endpoints>
  </Resources>
  ```

2.  Use Remoting Extension Method to create Remoting Listener.

  ```csharp
    protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
    {
        return this.CreateServiceRemotingInstanceListeners();
    }
  ```

3.  Add [Assembly Attribute](https://docs.microsoft.com/dotnet/api/microsoft.servicefabric.services.remoting.fabrictransport.fabrictransportserviceremotingproviderattribute?view=azure-dotnet) on Remoting Interfaces.

  ```csharp
 	[assembly:  FabricTransportServiceRemotingProvider(RemotingListenerVersion=  RemotingListenerVersion.V2_1, RemotingClientVersion= RemotingClientVersion.V2_1)]

  ```
No Changes are required in Client Project.
Build the  Client assembly with interface assembly, to makes sure that above assembly attribute is being used.

### Using Explicit Remoting Classes to create Listener/ ClientFactory for V2(InterfaceCompatible) version.
Here are the steps to follow.
1.  Add an Endpoint Resource with name as "ServiceEndpointV2_1" in the service manifest.

  ```xml
  <Resources>
    <Endpoints>
      <Endpoint Name="ServiceEndpointV2_1" />  
    </Endpoints>
  </Resources>
  ```

2. Use [Remoting V2Listener](https://docs.microsoft.com/dotnet/api/microsoft.servicefabric.services.remoting.v2.fabrictransport.runtime.fabrictransportserviceremotinglistener?view=azure-dotnet). Default Service Endpoint Resource name used is "ServiceEndpointV2_1" and must be defined in Service Manifest.

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

3. Use V2 [Client Factory](https://docs.microsoft.com/dotnet/api/microsoft.servicefabric.services.remoting.v2.fabrictransport.client.fabrictransportserviceremotingclientfactory?view=azure-dotnet).
  ```csharp
  var proxyFactory = new ServiceProxyFactory((c) =>
          {
            var settings = new FabricTransportRemotingSettings();
            settings.UseWrappedMessage = true;
            return new FabricTransportServiceRemotingClientFactory(settings);
          });
  ```

## How to upgrade from Remoting V1 to Remoting V2(InterfaceCompatible).
In order to upgrade from V1 to V2(InterfaceCompatible aka V2_1), 2-step upgrades are required. Following steps to be executed in the sequence listed.

1. Upgrade the V1 Service to V2_1 Service by using following Attribute.
This change makes sure that service is listening  on V1 and V2_1 Listener.

    a)  Add an Endpoint Resource with name as "ServiceEndpointV2_1" in the service manifest.
      ```xml
      <Resources>
        <Endpoints>
          <Endpoint Name="ServiceEndpointV2_1" />  
        </Endpoints>
      </Resources>
      ```

    b)  Use Following Extension Method to Create Remoting Listener.

    ```csharp
    protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
    {
        return this.CreateServiceRemotingInstanceListeners();
    }
    ```

    c)  Add Assembly Attribute on Remoting Interfaces to use V1,V2_1 Listener and V2_1 Client.
    ```csharp
   [assembly: FabricTransportServiceRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V2_1 | RemotingListenerVersion.V1, RemotingClientVersion = RemotingClientVersion.V2_1)]

      ```
2. Upgrade the V1 Client to  V2_1 Client by using V2_1 Client Attribute.
This step makes sure Client is using V2_1 stack.
No Change in Client Project/Service is required. Building Client projects with updated interface assembly is sufficient.

3. This step is optional. Remove V1 Listener Version from Attribute and then Upgrade the V2 Service.
This step makes sure that service is listening only on V2 Listener.

```csharp
[assembly: FabricTransportServiceRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V2_1, RemotingClientVersion = RemotingClientVersion.V2_1)]
```

### How to use Custom Serialization with Remoting Wrapped Message.
In Remoting Wrapped Message , we create single wrapped object with all the parameters as a field in it.
Here are the steps :

1. Implement IServiceRemotingMessageSerializationProvider interface to provide implementation for custom serialization.
    Here is the code-snippet on how implementation looks like.

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

2.    Override Default Serialization Provider with JsonSerializationProvider for Remoting    Listener.

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

3.    Override Default Serialization Provider with JsonSerializationProvider for Remoting Client Factory.

```csharp
var proxyFactory = new ServiceProxyFactory((c) =>
{
    return new FabricTransportServiceRemotingClientFactory(
    serializationProvider: new ServiceRemotingJsonSerializationProvider());
  });
  ```
## Next steps
* [Web API with OWIN in Reliable Services](service-fabric-reliable-services-communication-webapi.md)
* [WCF communication with Reliable Services](service-fabric-reliable-services-communication-wcf.md)
* [Securing communication for Reliable Services](service-fabric-reliable-services-secure-communication.md)
