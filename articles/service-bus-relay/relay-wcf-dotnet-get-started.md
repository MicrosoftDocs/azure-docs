---
title: Get started with Azure Relay WCF relays in .NET | Microsoft Docs
description: Learn how to use Azure Relay WCF relays to connect two applications hosted in different locations.
services: service-bus-relay
documentationcenter: .net
author: spelluru
manager: timlt
editor: ''

ms.assetid: 5493281a-c2e5-49f2-87ee-9d3ffb782c75
ms.service: service-bus-relay
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 12/20/2017
ms.author: spelluru
---

# How to use Azure Relay WCF relays with .NET
This article describes how to use the Azure Relay service. The samples are written in C# and use the Windows Communication Foundation (WCF) API with extensions contained in the Service Bus assembly. For more information about Azure relay, see the [Azure Relay overview](relay-what-is-it.md).

[!INCLUDE [create-account-note](../../includes/create-account-note.md)]

## What is WCF Relay?

The Azure [*WCF Relay*](relay-what-is-it.md) service enables you to build hybrid applications that run in both an Azure datacenter and your own on-premises enterprise environment. The relay service facilitates this by enabling you to securely expose Windows Communication Foundation (WCF) services that reside within a corporate enterprise network to the public cloud, without having to open a firewall connection, or requiring intrusive changes to a corporate network infrastructure.

![WCF Relay Concepts](./media/service-bus-dotnet-how-to-use-relay/sb-relay-01.png)

Azure Relay enables you to host WCF services within your existing enterprise environment. You can then delegate listening for incoming sessions and requests to these WCF services to the relay
service running within Azure. This enables you to expose these services to application code running in Azure, or to mobile workers or extranet partner environments. Relay enables you to securely control who can
access these services at a fine-grained level. It provides a powerful and secure way to expose application functionality and data from your existing enterprise solutions and take advantage of it from the cloud.

This article discusses how to use Azure Relay to create a WCF web service, exposed using a TCP channel binding, that implements a secure conversation between two parties.

[!INCLUDE [service-bus-create-namespace-portal](../../includes/service-bus-create-namespace-portal.md)]

## Get the Service Bus NuGet package
The [Service Bus NuGet package](https://www.nuget.org/packages/WindowsAzure.ServiceBus) is the easiest way to get the Service Bus API and to configure your application with all of the Service Bus dependencies. To install the NuGet package in your project, do the following:

1. In Solution Explorer, right-click **References**, then click **Manage NuGet Packages**.
2. Search for "Service Bus" and select the **Microsoft Azure
   Service Bus** item. Click **Install** to complete the installation, then close the following dialog box:
   
   ![](./media/service-bus-dotnet-how-to-use-relay/getting-started-multi-tier-13.png)

## Expose and consume a SOAP web service with TCP
To expose an existing WCF SOAP web service for external consumption, you must make changes to the service bindings and addresses. This may require changes to your configuration file or it could require code changes, depending on how you have set up and configured your WCF services. Note that WCF allows you to have multiple network endpoints over the same service, so you can retain the existing internal endpoints while adding relay endpoints for external access at the same time.

In this task, you build a simple WCF service and add a relay listener to it. This exercise assumes some familiarity with Visual Studio, and therefore does not walk through all the details of creating a project. Instead, it focuses on the code.

Before starting these steps, complete the following procedure to set up your environment:

1. Within Visual Studio, create a console application that contains two projects, "Client" and "Service", within the solution.
2. Add the Service Bus NuGet package to both projects. This package adds all the necessary assembly references to your projects.

### How to create the service
First, create the service itself. Any WCF service consists of at least three distinct parts:

* Definition of a contract that describes what messages are exchanged and what operations are to be invoked.
* Implementation of that contract.
* Host that hosts the WCF service and exposes several endpoints.

The code examples in this section address each of these components.

The contract defines a single operation, `AddNumbers`, that adds two numbers and returns the result. The `IProblemSolverChannel` interface enables the client to more easily manage the proxy lifetime. Creating such an interface is considered a best practice. It's a good idea to put this contract definition into a separate file so that you can reference that file from both your "Client" and "Service" projects, but you can also copy the code into both projects.

```csharp
using System.ServiceModel;

[ServiceContract(Namespace = "urn:ps")]
interface IProblemSolver
{
    [OperationContract]
    int AddNumbers(int a, int b);
}

interface IProblemSolverChannel : IProblemSolver, IClientChannel {}
```

With the contract in place, the implementation is as follows:

```csharp
class ProblemSolver : IProblemSolver
{
    public int AddNumbers(int a, int b)
    {
        return a + b;
    }
}
```

### Configure a service host programmatically
With the contract and implementation in place, you can now host the service. Hosting occurs inside a
[System.ServiceModel.ServiceHost](https://msdn.microsoft.com/library/system.servicemodel.servicehost.aspx) object, which takes care of managing instances of the service and hosts the endpoints that listen for messages. The following code configures the service with both a regular local endpoint and a relay endpoint to illustrate the appearance, side by side, of internal and external endpoints. Replace the string *namespace* with your namespace name and *yourKey* with the SAS key that you obtained in the previous setup step.

```csharp
ServiceHost sh = new ServiceHost(typeof(ProblemSolver));

sh.AddServiceEndpoint(
   typeof (IProblemSolver), new NetTcpBinding(),
   "net.tcp://localhost:9358/solver");

sh.AddServiceEndpoint(
   typeof(IProblemSolver), new NetTcpRelayBinding(),
   ServiceBusEnvironment.CreateServiceUri("sb", "namespace", "solver"))
    .Behaviors.Add(new TransportClientEndpointBehavior {
          TokenProvider = TokenProvider.CreateSharedAccessSignatureTokenProvider("RootManageSharedAccessKey", "<yourKey>")});

sh.Open();

Console.WriteLine("Press ENTER to close");
Console.ReadLine();

sh.Close();
```

In the example, you create two endpoints that are on the same contract implementation. One is local and one is projected through Azure Relay. The key differences between them are the bindings; [NetTcpBinding](https://msdn.microsoft.com/library/system.servicemodel.nettcpbinding.aspx) for the local one and [NetTcpRelayBinding](/dotnet/api/microsoft.servicebus.nettcprelaybinding) for the relay endpoint and the addresses. The local endpoint has a local network address with a distinct port. The relay endpoint has an endpoint address composed of the string `sb`, your namespace name, and the path "solver." This results in the URI `sb://[serviceNamespace].servicebus.windows.net/solver`, identifying the service endpoint as a Service Bus (relay) TCP endpoint with a fully qualified external DNS name. If you place the code replacing the placeholders into the `Main` function of the **Service** application, you will have a functional service. If you want your service to listen exclusively on the relay, remove the local endpoint declaration.

### Configure a service host in the App.config file
You can also configure the host using the App.config file. The service hosting code in this case appears in the next example.

```csharp
ServiceHost sh = new ServiceHost(typeof(ProblemSolver));
sh.Open();
Console.WriteLine("Press ENTER to close");
Console.ReadLine();
sh.Close();
```

The endpoint definitions move into the App.config file. The NuGet package has already added a range of definitions to the App.config file, which are the required configuration extensions for Azure Relay. The following example, which is the exact equivalent of the previous code, should appear directly beneath the **system.serviceModel** element. This code example assumes that your project C# namespace is named **Service**.
Replace the placeholders with your relay namespace name and SAS key.

```xml
<services>
    <service name="Service.ProblemSolver">
        <endpoint contract="Service.IProblemSolver"
                  binding="netTcpBinding"
                  address="net.tcp://localhost:9358/solver"/>
        <endpoint contract="Service.IProblemSolver"
                  binding="netTcpRelayBinding"
                  address="sb://<namespaceName>.servicebus.windows.net/solver"
                  behaviorConfiguration="sbTokenProvider"/>
    </service>
</services>
<behaviors>
    <endpointBehaviors>
        <behavior name="sbTokenProvider">
            <transportClientEndpointBehavior>
                <tokenProvider>
                    <sharedAccessSignature keyName="RootManageSharedAccessKey" key="<yourKey>" />
                </tokenProvider>
            </transportClientEndpointBehavior>
        </behavior>
    </endpointBehaviors>
</behaviors>
```

After you make these changes, the service starts as it did before, but with two live endpoints: one local and one listening in the cloud.

### Create the client
#### Configure a client programmatically
To consume the service, you can construct a WCF client using a [ChannelFactory](https://msdn.microsoft.com/library/system.servicemodel.channelfactory.aspx) object. Service Bus uses a token-based security
model implemented using SAS. The [TokenProvider](/dotnet/api/microsoft.servicebus.tokenprovider) class represents a security token provider with built-in factory methods that return some well-known token providers. The following example uses the [CreateSharedAccessSignatureTokenProvider](/dotnet/api/microsoft.servicebus.tokenprovider) method to handle the acquisition of the appropriate SAS token. The name and key are those obtained from the portal as described in the previous section.

First, reference or copy the `IProblemSolver` contract code from the service into your client project.

Then, replace the code in the `Main` method of the client, again replacing the placeholder text with your relay namespace and SAS key.

```csharp
var cf = new ChannelFactory<IProblemSolverChannel>(
    new NetTcpRelayBinding(),
    new EndpointAddress(ServiceBusEnvironment.CreateServiceUri("sb", "<namespaceName>", "solver")));

cf.Endpoint.Behaviors.Add(new TransportClientEndpointBehavior
            { TokenProvider = TokenProvider.CreateSharedAccessSignatureTokenProvider("RootManageSharedAccessKey","<yourKey>") });

using (var ch = cf.CreateChannel())
{
    Console.WriteLine(ch.AddNumbers(4, 5));
}
```

You can now build the client and the service, run them (run the service first), and the client calls the service and prints **9**. You can run the client and server on different machines, even across networks, and the communication will still work. The client code can also run in the cloud or locally.

#### Configure a client in the App.config file
The following code shows how to configure the client using the App.config file.

```csharp
var cf = new ChannelFactory<IProblemSolverChannel>("solver");
using (var ch = cf.CreateChannel())
{
    Console.WriteLine(ch.AddNumbers(4, 5));
}
```

The endpoint definitions move into the App.config file. The following example, which is the same as the code listed previously, should appear directly beneath the `<system.serviceModel>` element. Here, as before,
you must replace the placeholders with your relay namespace and SAS key.

```xml
<client>
    <endpoint name="solver" contract="Service.IProblemSolver"
              binding="netTcpRelayBinding"
              address="sb://<namespaceName>.servicebus.windows.net/solver"
              behaviorConfiguration="sbTokenProvider"/>
</client>
<behaviors>
    <endpointBehaviors>
        <behavior name="sbTokenProvider">
            <transportClientEndpointBehavior>
                <tokenProvider>
                    <sharedAccessSignature keyName="RootManageSharedAccessKey" key="<yourKey>" />
                </tokenProvider>
            </transportClientEndpointBehavior>
        </behavior>
    </endpointBehaviors>
</behaviors>
```

## Next steps
Now that you've learned the basics of Azure Relay, follow these links to learn more.

* [What is Azure Relay?](relay-what-is-it.md)
* Download Service Bus samples from [Azure samples][Azure samples] or see the [overview of Service Bus samples][overview of Service Bus samples].

[Shared Access Signature Authentication with Service Bus]: ../service-bus-messaging/service-bus-shared-access-signature-authentication.md
[Azure samples]: https://code.msdn.microsoft.com/site/search?query=service%20bus&f%5B0%5D.Value=service%20bus&f%5B0%5D.Type=SearchText&ac=2
[overview of Service Bus samples]: ../service-bus-messaging/service-bus-samples.md
