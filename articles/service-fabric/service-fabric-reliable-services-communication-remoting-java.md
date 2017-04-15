---
title: Service remoting in Azure Service Fabric | Microsoft Docs
description: Service Fabric remoting allows clients and services to communicate with services by using a remote procedure call.
services: service-fabric
documentationcenter: java
author: PavanKunapareddyMSFT
manager: timlt

ms.assetid:
ms.service: service-fabric
ms.devlang: java
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: required
ms.date: 03/09/2017
ms.author: pakunapa

---
# Service remoting with Reliable Services
> [!div class="op_single_selector"]
> * [C# on Windows](service-fabric-reliable-services-communication-remoting.md)
> * [Java on Linux](service-fabric-reliable-services-communication-remoting-java.md)
>
>

The Reliable Services framework provides a remoting mechanism to quickly and easily set up remote procedure call for services.

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

## Next steps
* [Securing communication for Reliable Services](service-fabric-reliable-services-secure-communication.md)
