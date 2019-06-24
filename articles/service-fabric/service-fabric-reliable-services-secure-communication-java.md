---
title: Secure service remoting communications with Java in Azure Service Fabric | Microsoft Docs
description: Learn how to secure service remoting based communication for Java reliable services that are running in an Azure Service Fabric cluster.
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
# Secure service remoting communications in a Java service
> [!div class="op_single_selector"]
> * [C# on Windows](service-fabric-reliable-services-secure-communication.md)
> * [Java on Linux](service-fabric-reliable-services-secure-communication-java.md)
>
>

Security is one of the most important aspects of communication. The Reliable Services application framework provides a few prebuilt communication stacks and tools that you can use to improve security. This article discusses how to improve security when you're using service remoting in a Java service. It builds on an existing [example](service-fabric-reliable-services-communication-remoting-java.md) that explains how to set up remoting for reliable services written in Java. 

To help secure a service when you're using service remoting with Java services, follow these steps:

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

    Make sure the certificate that you want to use to help secure your service communication is installed on all the nodes in the cluster. For services running on Linux, the certificate must be available as a PEM-formmatted file; either a `.pem` file that contains the certificate and private key or a `.crt` file that contains the certificate and a `.key` file that contains the private key. To learn more, see [Location and format of X.509 certificates on Linux nodes](./service-fabric-configure-certificates-linux.md#location-and-format-of-x509-certificates-on-linux-nodes).
    
    There are two ways that you can provide listener settings and security credentials:

   1. Provide them by using a [config package](service-fabric-application-and-service-manifests.md):

       Add a named `TransportSettings` section in the settings.xml file.

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
        In this case, the `CreateServiceInstanceListeners` method will look like this:

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
