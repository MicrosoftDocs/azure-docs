---
title: Secure service remoting communications with C#
description: Learn how to secure service remoting based communication for C# reliable services that are running in an Azure Service Fabric cluster.
author: suchiagicha

ms.topic: conceptual
ms.date: 04/20/2017
ms.author: pepogors
---
# Secure service remoting communications in a C# service
> [!div class="op_single_selector"]
> * [C# on Windows](service-fabric-reliable-services-secure-communication.md)
> * [Java on Linux](service-fabric-reliable-services-secure-communication-java.md)
>
>

Security is one of the most important aspects of communication. The Reliable Services application framework provides a few prebuilt communication stacks and tools that you can use to improve security. This article discusses how to improve security when you're using service remoting in a C# service. It builds on an existing [example](service-fabric-reliable-services-communication-remoting.md) that explains how to set up remoting for reliable services written in C#. 

To help secure a service when you're using service remoting with C# services, follow these steps:

1. Create an interface, `IHelloWorldStateful`, that defines the methods that will be available for a remote procedure call on your service. Your service will use `FabricTransportServiceRemotingListener`, which is declared in the `Microsoft.ServiceFabric.Services.Remoting.FabricTransport.Runtime` namespace. This is an `ICommunicationListener` implementation that provides remoting capabilities.

    ```csharp
    public interface IHelloWorldStateful : IService
    {
        Task<string> GetHelloWorld();
    }

    internal class HelloWorldStateful : StatefulService, IHelloWorldStateful
    {
        protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
        {
            return new[]{
                    new ServiceReplicaListener(
                        (context) => new FabricTransportServiceRemotingListener(context,this))};
        }

        public Task<string> GetHelloWorld()
        {
            return Task.FromResult("Hello World!");
        }
    }
    ```
2. Add listener settings and security credentials.

    Make sure the certificate that you want to use to help secure your service communication is installed on all the nodes in the cluster. 
    
    > [!NOTE]
    > On Linux nodes, the certificate must be present as PEM-formatted files in the */var/lib/sfcerts* directory. To learn more, see [Location and format of X.509 certificates on Linux nodes](./service-fabric-configure-certificates-linux.md#location-and-format-of-x509-certificates-on-linux-nodes). 

    There are two ways that you can provide listener settings and security credentials:

   1. Provide them directly in the service code:

       ```csharp
       protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
       {
           FabricTransportRemotingListenerSettings  listenerSettings = new FabricTransportRemotingListenerSettings
           {
               MaxMessageSize = 10000000,
               SecurityCredentials = GetSecurityCredentials()
           };
           return new[]
           {
               new ServiceReplicaListener(
                   (context) => new FabricTransportServiceRemotingListener(context,this,listenerSettings))
           };
       }

       private static SecurityCredentials GetSecurityCredentials()
       {
           // Provide certificate details.
           var x509Credentials = new X509Credentials
           {
               FindType = X509FindType.FindByThumbprint,
               FindValue = "4FEF3950642138446CC364A396E1E881DB76B48C",
               StoreLocation = StoreLocation.LocalMachine,
               StoreName = "My",
               ProtectionLevel = ProtectionLevel.EncryptAndSign
           };
           x509Credentials.RemoteCommonNames.Add("ServiceFabric-Test-Cert");
           x509Credentials.RemoteCertThumbprints.Add("9FEF3950642138446CC364A396E1E881DB76B483");
           return x509Credentials;
       }
       ```
   2. Provide them by using a [config package](service-fabric-application-and-service-manifests.md):

       Add a named `TransportSettings` section in the settings.xml file.

       ```xml
       <Section Name="HelloWorldStatefulTransportSettings">
           <Parameter Name="MaxMessageSize" Value="10000000" />
           <Parameter Name="SecurityCredentialsType" Value="X509" />
           <Parameter Name="CertificateFindType" Value="FindByThumbprint" />
           <Parameter Name="CertificateFindValue" Value="4FEF3950642138446CC364A396E1E881DB76B48C" />
	       <Parameter Name="CertificateRemoteThumbprints" Value="9FEF3950642138446CC364A396E1E881DB76B483" />
           <Parameter Name="CertificateStoreLocation" Value="LocalMachine" />
           <Parameter Name="CertificateStoreName" Value="My" />
           <Parameter Name="CertificateProtectionLevel" Value="EncryptAndSign" />
           <Parameter Name="CertificateRemoteCommonNames" Value="ServiceFabric-Test-Cert" />
       </Section>
       ```

       In this case, the `CreateServiceReplicaListeners` method will look like this:

       ```csharp
       protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
       {
           return new[]
           {
               new ServiceReplicaListener(
                   (context) => new FabricTransportServiceRemotingListener(
                       context,this,FabricTransportRemotingListenerSettings .LoadFrom("HelloWorldStatefulTransportSettings")))
           };
       }
       ```

        If you add a `TransportSettings` section in the settings.xml file , `FabricTransportRemotingListenerSettings` will load all the settings from this section by default.

        ```xml
        <!--"TransportSettings" section .-->
        <Section Name="TransportSettings">
            ...
        </Section>
        ```
        In this case, the `CreateServiceReplicaListeners` method will look like this:

        ```csharp
        protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
        {
            return new[]
            {
                return new[]{
                        new ServiceReplicaListener(
                            (context) => new FabricTransportServiceRemotingListener(context,this))};
            };
        }
        ```
3. When you call methods on a secured service by using the remoting stack, instead of using the `Microsoft.ServiceFabric.Services.Remoting.Client.ServiceProxy` class to create a service proxy, use `Microsoft.ServiceFabric.Services.Remoting.Client.ServiceProxyFactory`. Pass in `FabricTransportRemotingSettings`, which contains `SecurityCredentials`.

    ```csharp

    var x509Credentials = new X509Credentials
    {
        FindType = X509FindType.FindByThumbprint,
        FindValue = "9FEF3950642138446CC364A396E1E881DB76B483",
        StoreLocation = StoreLocation.LocalMachine,
        StoreName = "My",
        ProtectionLevel = ProtectionLevel.EncryptAndSign
    };
    x509Credentials.RemoteCommonNames.Add("ServiceFabric-Test-Cert");
    x509Credentials.RemoteCertThumbprints.Add("4FEF3950642138446CC364A396E1E881DB76B48C");

    FabricTransportRemotingSettings transportSettings = new FabricTransportRemotingSettings
    {
        SecurityCredentials = x509Credentials,
    };

    ServiceProxyFactory serviceProxyFactory = new ServiceProxyFactory(
        (c) => new FabricTransportServiceRemotingClientFactory(transportSettings));

    IHelloWorldStateful client = serviceProxyFactory.CreateServiceProxy<IHelloWorldStateful>(
        new Uri("fabric:/MyApplication/MyHelloWorldService"));

    string message = await client.GetHelloWorld();

    ```

    If the client code is running as part of a service, you can load `FabricTransportRemotingSettings` from the settings.xml file. Create a HelloWorldClientTransportSettings section that is similar to the service code, as shown earlier. Make the following changes to the client code:

    ```csharp
    ServiceProxyFactory serviceProxyFactory = new ServiceProxyFactory(
        (c) => new FabricTransportServiceRemotingClientFactory(FabricTransportRemotingSettings.LoadFrom("HelloWorldClientTransportSettings")));

    IHelloWorldStateful client = serviceProxyFactory.CreateServiceProxy<IHelloWorldStateful>(
        new Uri("fabric:/MyApplication/MyHelloWorldService"));

    string message = await client.GetHelloWorld();

    ```

    If the client is not running as part of a service, you can create a client_name.settings.xml file in the same location where the client_name.exe is. Then create a TransportSettings section in that file.

    Similar to the service, if you add a `TransportSettings` section in client settings.xml/client_name.settings.xml, `FabricTransportRemotingSettings` loads all the settings from this section by default.

    In that case, the earlier code is even further simplified:  

    ```csharp

    IHelloWorldStateful client = ServiceProxy.Create<IHelloWorldStateful>(
                 new Uri("fabric:/MyApplication/MyHelloWorldService"));

    string message = await client.GetHelloWorld();

    ```


As a next step, read [Web API with OWIN in Reliable Services](service-fabric-reliable-services-communication-webapi.md).
