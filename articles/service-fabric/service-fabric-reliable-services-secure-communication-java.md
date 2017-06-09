---
title: Help secure communication for services in Azure Service Fabric | Microsoft Docs
description: Overview of how to help secure communication for reliable services that are running in an Azure Service Fabric cluster.
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
# Help secure communication for services in Azure Service Fabric
> [!div class="op_single_selector"]
> * [C# on Windows](service-fabric-reliable-services-secure-communication.md)
> * [Java on Linux](service-fabric-reliable-services-secure-communication-java.md)
>
>

## Help secure a service when you're using service remoting
We'll be using an existing [example](service-fabric-reliable-services-communication-remoting-java.md) that explains how to set up remoting for reliable services. To help secure a service when you're using service remoting, follow these steps:

1. Create an interface, `HelloWorldStateless`, that defines the methods that will be available for a remote procedure call on your service. Your service will use `FabricTransportServiceRemotingListener`, which is declared in the `microsoft.serviceFabric.services.remoting.fabricTransport.runtime` package. This is an `CommunicationListener` implementation that provides remoting capabilities.

    ```java
    public interface HelloWorldStateless extends Service {
        CompletableFuture<String> getHelloWorld();
    }

    class HelloWorldStatelessImpl extends StatelessService implements HelloWorldStateless {
        @Override
        protected List<ServiceInstanceListener> createServiceInstanceListeners() {
            ArrayList<ServiceInstanceListener> listeners = new ArrayList<>();
            listeners.add(new ServiceInstanceListener((context) -> {
                return new FabricTransportServiceRemotingListener(context,this);
            }));
        return listeners;
        }

        public CompletableFuture<String> getHelloWorld() {
            return CompletableFuture.completedFuture("Hello World!");
        }
    }
    ```
2. Add listener settings and security credentials.

    Make sure that the certificate that you want to use to help secure your service communication is installed on all the nodes in the cluster. There are two ways that you can provide listener settings and security credentials:

   1. Provide them by using a [config package](service-fabric-application-model.md):

       Add a `TransportSettings` section in the settings.xml file.

       ```xml
       <!--Section name should always end with "TransportSettings".-->
       <!--Here we are using a prefix "HelloWorldStateless".-->
        <Section Name="HelloWorldStatelessTransportSettings">
            <Parameter Name="MaxMessageSize" Value="10000000" />
            <Parameter Name="SecurityCredentialsType" Value="X509_2" />
            <Parameter Name="CertificatePath" Value="/path/to/cert/BD1C71E248B8C6834C151174DECDBDC02DE1D954.crt" />
            <Parameter Name="CertificateProtectionLevel" Value="EncryptandSign" />
            <Parameter Name="CertificateRemoteThumbprints" Value="BD1C71E248B8C6834C151174DECDBDC02DE1D954" />
        </Section>

       ```

       In this case, the `createServiceInstanceListeners` method will look like this:

       ```java
        protected List<ServiceInstanceListener> createServiceInstanceListeners() {
            ArrayList<ServiceInstanceListener> listeners = new ArrayList<>();
            listeners.add(new ServiceInstanceListener((context) -> {
                return new FabricTransportServiceRemotingListener(context,this, FabricTransportRemotingListenerSettings.loadFrom(HelloWorldStatelessTransportSettings));
            }));
            return listeners;
        }
       ```

        If you add a `TransportSettings` section in the settings.xml file without any prefix, `FabricTransportListenerSettings` will load all the settings from this section by default.

        ```xml
        <!--"TransportSettings" section without any prefix.-->
        <Section Name="TransportSettings">
            ...
        </Section>
        ```
        In this case, the `CreateServiceReplicaListeners` method will look like this:

        ```java
        protected List<ServiceInstanceListener> createServiceInstanceListeners() {
            ArrayList<ServiceInstanceListener> listeners = new ArrayList<>();
            listeners.add(new ServiceInstanceListener((context) -> {
                return new FabricTransportServiceRemotingListener(context,this);
            }));
            return listeners;
        }
       ```
3. When you call methods on a secured service by using the remoting stack, instead of using the `microsoft.serviceFabric.services.remoting.client.ServiceProxyBase` class to create a service proxy, use `microsoft.serviceFabric.services.remoting.client.FabricServiceProxyFactory`.

    If the client code is running as part of a service, you can load `FabricTransportSettings` from the settings.xml file. Create a TransportSettings section that is similar to the service code, as shown earlier. Make the following changes to the client code:

    ```java

    FabricServiceProxyFactory serviceProxyFactory = new FabricServiceProxyFactory(c -> {
            return new FabricTransportServiceRemotingClientFactory(FabricTransportRemotingSettings.loadFrom("TransportPrefixTransportSettings"), null, null, null, null);
        }, null)

    HelloWorldStateless client = serviceProxyFactory.createServiceProxy(HelloWorldStateless.class,
        new URI("fabric:/MyApplication/MyHelloWorldService"));

    CompletableFuture<String> message = client.getHelloWorld();

    ```
