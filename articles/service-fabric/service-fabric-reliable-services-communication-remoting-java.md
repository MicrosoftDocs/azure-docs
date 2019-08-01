---
title: Service remoting using Java in Azure Service Fabric | Microsoft Docs
description: Service Fabric remoting allows clients and services to communicate with Java services by using a remote procedure call.
services: service-fabric
documentationcenter: java
author: PavanKunapareddyMSFT
manager: chackdan

ms.assetid:
ms.service: service-fabric
ms.devlang: java
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: required
ms.date: 06/30/2017
ms.author: pakunapa

---
# Service remoting in Java with Reliable Services
> [!div class="op_single_selector"]
> * [C# on Windows](service-fabric-reliable-services-communication-remoting.md)
> * [Java on Linux](service-fabric-reliable-services-communication-remoting-java.md)
>
>

For services that aren't tied to a particular communication protocol or stack, such as WebAPI, Windows Communication Foundation (WCF), or others, the Reliable Services framework provides a remoting mechanism to quickly and easily set up remote procedure calls for services.  This article discusses how to set up remote procedure calls for services written with Java.

## Set up remoting on a service
Setting up remoting for a service is done in two simple steps:

1. Create an interface for your service to implement. This interface defines the methods that are available for a remote procedure call on your service. The methods must be task-returning asynchronous methods. The interface must implement `microsoft.serviceFabric.services.remoting.Service` to signal that the service has a remoting interface.
2. Use a remoting listener in your service. This is an `CommunicationListener` implementation that provides remoting capabilities. `FabricTransportServiceRemotingListener` can be used to create a remoting listener using the default remoting transport protocol.

For example, the following stateless service exposes a single method to get "Hello World" over a remote procedure call.

```java
import java.util.ArrayList;
import java.util.concurrent.CompletableFuture;
import java.util.List;
import microsoft.servicefabric.services.communication.runtime.ServiceInstanceListener;
import microsoft.servicefabric.services.remoting.Service;
import microsoft.servicefabric.services.runtime.StatelessService;

public interface MyService extends Service {
    CompletableFuture<String> helloWorldAsync();
}

class MyServiceImpl extends StatelessService implements MyService {
    public MyServiceImpl(StatelessServiceContext context) {
       super(context);
    }

    public CompletableFuture<String> helloWorldAsync() {
        return CompletableFuture.completedFuture("Hello!");
    }

    @Override
    protected List<ServiceInstanceListener> createServiceInstanceListeners() {
        ArrayList<ServiceInstanceListener> listeners = new ArrayList<>();
        listeners.add(new ServiceInstanceListener((context) -> {
            return new FabricTransportServiceRemotingListener(context,this);
        }));
        return listeners;
    }
}
```

> [!NOTE]
> The arguments and the return types in the service interface can be any simple, complex, or custom types, but they must be serializable.
>
>

## Call remote service methods
Calling methods on a service by using the remoting stack is done by using a local proxy to the service through the `microsoft.serviceFabric.services.remoting.client.ServiceProxyBase` class. The `ServiceProxyBase` method creates a local proxy by using the same interface that the service implements. With that proxy, you can simply call methods on the interface remotely.

```java

MyService helloWorldClient = ServiceProxyBase.create(MyService.class, new URI("fabric:/MyApplication/MyHelloWorldService"));

CompletableFuture<String> message = helloWorldClient.helloWorldAsync();

```

The remoting framework propagates exceptions thrown at the service to the client. So exception-handling logic at the client by using `ServiceProxyBase` can directly handle exceptions that the service throws.

## Service Proxy Lifetime
ServiceProxy creation is a lightweight operation, so you can create as many as you need. Service Proxy instances can be reused as long as they are needed. If a remote procedure call throws an Exception, you can still reuse the same proxy instance. Each ServiceProxy contains a communication client used to send messages over the wire. While invoking remote calls, internal checks are performed to determine if the communication client is valid. Based on the results of those checks, the communication client is recreated if needed. Therefore, if an exception occurs, you do not need to recreate `ServiceProxy`.

### ServiceProxyFactory Lifetime
[FabricServiceProxyFactory](https://docs.microsoft.com/java/api/microsoft.servicefabric.services.remoting.client.fabricserviceproxyfactory) is a factory that creates proxy for different remoting interfaces. If you use API `ServiceProxyBase.create` for creating proxy, then framework creates a `FabricServiceProxyFactory`.
It is useful to create one manually when you need to override [ServiceRemotingClientFactory](https://docs.microsoft.com/java/api/microsoft.servicefabric.services.remoting.client.serviceremotingclientfactory) properties.
Factory is an expensive operation. `FabricServiceProxyFactory` maintains cache of communication clients.
Best practice is to cache `FabricServiceProxyFactory` for as long as possible.

## Remoting Exception Handling
All the remote exception thrown by service API, are sent back to the client either as RuntimeException or FabricException.

ServiceProxy does handle all Failover Exception for the service partition it  is created for. It re-resolves the endpoints if there is Failover Exceptions(Non-Transient Exceptions) and retries the call with the correct endpoint. Number of retries for failover Exception is indefinite.
In case of TransientExceptions, it only retries the call.

Default retry parameters are provied by [OperationRetrySettings](https://docs.microsoft.com/java/api/microsoft.servicefabric.services.communication.client.operationretrysettings).
You can configure these values by passing OperationRetrySettings object to ServiceProxyFactory constructor.

## Next steps
* [Securing communication for Reliable Services](service-fabric-reliable-services-secure-communication-java.md)
