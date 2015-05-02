<properties 
	pageTitle="How to use Service Bus relay (.NET) - Azure" 
	description="Learn how to use the Azure Service Bus relay service to connect two applications hosted in different locations." 
	services="service-bus" 
	documentationCenter=".net" 
	authors="sethmanheim" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="service-bus" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="03/18/2015" 
	ms.author="sethm"/>


# How to Use the Service Bus Relay Service

This guide describes how to use the Service Bus relay service.
The samples are written in C# and use the Windows Communication
Foundation (WCF) API with extensions contained in the Service Bus assembly
that is part of the Microsoft Azure .NET SDK. For more
information about the Service Bus relay, see the "Next Steps" section.

[AZURE.INCLUDE [create-account-note](../includes/create-account-note.md)]

## What is the Service Bus relay?

The Service Bus *relay* service enables you to build hybrid
applications that run in both an Azure datacenter and your
own on-premises enterprise environment. The Service Bus relay facilitates
this by enabling you to securely expose Windows Communication
Foundation (WCF) services that reside within a corporate
enterprise network to the public cloud, without having to open a
firewall connection, or require intrusive changes to a corporate
network infrastructure.

![Relay Concepts](./media/service-bus-dotnet-how-to-use-relay/sb-relay-01.png)

The Service Bus relay allows you to host WCF services within your
existing enterprise environment. You can then delegate listening for
incoming sessions and requests to these WCF services to the Service Bus
service running within Azure. This enables you to expose these services to
application code running in Azure, or to mobile workers or extranet partner
environments. Service Bus allows you to securely control who can
access these services at a fine-grained level. It provides a powerful and
secure way to expose application functionality and data from your
existing enterprise solutions and take advantage of it from the cloud.

This how-to guide demonstrates how to use the Service Bus relay to create a WCF
web service, exposed using a TCP channel binding, that implements a
secure conversation between two parties.

## Create a service namespace

To begin using the Service Bus relay in Azure, you must first
create a service namespace. A namespace provides a scoping
container for addressing Service Bus resources within your application.

To create a service namespace:

1.  Log on to the [Azure Management Portal][].

2.  In the left navigation pane of the Management Portal, click
    **Service Bus**.

3.  In the lower pane of the Management Portal, click **Create**.   

	![](./media/service-bus-dotnet-how-to-use-relay/sb-queues-13.png)

4.  In the **Add a new namespace** dialog, enter a namespace name.
    The system immediately checks to see if the name is available.   

	![](./media/service-bus-dotnet-how-to-use-relay/sb-queues-04.png)


5.  After making sure the namespace name is available, choose the
    country or region in which your namespace should be hosted (make
    sure you use the same country/region in which you are deploying your
    compute resources).

	IMPORTANT: Pick the **same region** that you intend to choose for deploying your application. This will give you the best performance.

6.	Leave the other fields in the dialog with their default values (**Messaging** and **Standard Tier**), then click the check mark. The system now creates your namespace and enables it. You might have to wait several minutes as the system provisions resources for your account.

	![](./media/service-bus-dotnet-how-to-use-relay/getting-started-multi-tier-27.png)

	The namespace you created then appears in the Management Portal and takes a moment to activate. Wait until the status is **Active** before continuing.

## Obtain the default management credentials for the namespace

In order to perform management operations, such as creating a relay connection, on the new namespace, you must configure the Shared Access Signature (SAS) authorization rule for the namespace. For more information about SAS, see [Shared Access Signature Authentication with Service Bus][].

1.  In the left navigation pane, click the **Service Bus** node, to
    display the list of available namespaces:   
	![](./media/service-bus-dotnet-how-to-use-relay/sb-queues-13.png)


2.  Double click the name of the namespace you just created from the list shown:   
	![](./media/service-bus-dotnet-how-to-use-relay/sb-queues-09.png)


3.  Click the **Configure** tab at the top of the page.   
 
4.  When a Service Bus namespace is provisioned, a **SharedAccessAuthorizationRule**, with **KeyName** set to **RootManageSharedAccessKey**, is created by default. This page displays that key, as well as the primary and secondary keys for the default rule. 

## Get the Service Bus NuGet package

The Service Bus **NuGet** package is the easiest way to get the
Service Bus API and to configure your application with all of the
Service Bus dependencies. The NuGet Visual Studio extension makes it
easy to install and update libraries and tools in Visual Studio and
Visual Studio Express. The Service Bus NuGet package is the easiest way
to get the Service Bus API and to configure your application with all of
the Service Bus dependencies.

To install the NuGet package in your application, do the following:

1.  In Solution Explorer, right-click **References**, then click **Manage NuGet Packages**.
2.  Search for "Service Bus" and select the **Microsoft Azure
    Service Bus** item. Click **Install** to complete the installation, then close this dialog.

	![](./media/service-bus-dotnet-how-to-use-relay/getting-started-multi-tier-13.png)
  

## How to use Service Bus to expose and consume a SOAP web service with TCP

To expose an existing WCF SOAP web service for external
consumption, you must make changes to the service bindings and
addresses. This may require changes to your configuration file or it
could require code changes, depending on how you have set up and
configured your WCF services. Note that WCF allows you to have multiple
network endpoints over the same service, so you can retain the existing
internal endpoints while adding Service Bus endpoints for external
access at the same time.

In this task, you will build a simple WCF service and
add a Service Bus listener to it. This exercise assumes some familiarity with Visual Studio, and therefore does not walk through all the details of creating a project. Instead, it focuses on the code.

Before starting the steps below, complete the following procedure to set up
your environment:

1.  Within Visual Studio, create a console application that contains two
    projects, "Client" and "Service", within the solution.
2.  Add the **Microsoft Azure Service Bus** NuGet package to both projects.
    This adds all of the necessary assembly references to your projects.

### How to create the service

First, create the service itself. Any WCF service consists of at
least three distinct parts:

-   Definition of a contract that describes what messages are
    exchanged and what operations are to be invoked. 
-   Implementation of said contract.
-   Host that hosts the WCF service and exposes a number of
    endpoints.

The code examples in this section address each of these
components.

The contract defines a single operation, `AddNumbers`, that adds
two numbers and returns the result. The `IProblemSolverChannel`
interface enables the client to more easily manage the proxy lifetime. Creating such an interface is considered a best practice. It's a good idea to put this contract
definition into a separate file so that you can reference that file from both
your "Client" and "Service" projects, but you can also copy the code
into both projects:

        using System.ServiceModel;
     
        [ServiceContract(Namespace = "urn:ps")]
        interface IProblemSolver
        {
            [OperationContract]
            int AddNumbers(int a, int b);
        }
     
        interface IProblemSolverChannel : IProblemSolver, IClientChannel {}

With the contract in place, the implementation is trivial:

        class ProblemSolver : IProblemSolver
        {
            public int AddNumbers(int a, int b)
            {
                return a + b;
            }
        }

### How to configure a service host programmatically

With the contract and implementation in place, you can now host
the service. Hosting occurs inside a
[System.ServiceModel.ServiceHost](https://msdn.microsoft.com/library/system.servicemodel.servicehost(v=vs.110).aspx) object, which takes care of managing
instances of the service and hosts the endpoints that listen for
messages. The code below configures the service with both a regular
local endpoint and a Service Bus endpoint to illustrate the appearance, side-by-side, of internal and external endpoints. Replace the
string *namespace* with your namespace name and *yourKey*
with the SAS key that you obtained in the setup step above. 

    ServiceHost sh = new ServiceHost(typeof(ProblemSolver));

    sh.AddServiceEndpoint(
       typeof (IProblemSolver), new NetTcpBinding(), 
       "net.tcp://localhost:9358/solver");

    sh.AddServiceEndpoint(
       typeof(IProblemSolver), new NetTcpRelayBinding(), 
       ServiceBusEnvironment.CreateServiceUri("sb", "namespace", "solver"))
        .Behaviors.Add(new TransportClientEndpointBehavior {
              TokenProvider = TokenProvider.CreateSharedAccessSignatureTokenProvider("RootManageSharedAccessKey", "yourKey")});

    sh.Open();

    Console.WriteLine("Press ENTER to close");
    Console.ReadLine();

    sh.Close();

In the example, you create two endpoints that are on the same
contract implementation. One is local and one is projected through Service Bus. The key differences between them are the bindings;
[`NetTcpBinding`](https://msdn.microsoft.com/library/system.servicemodel.nettcpbinding(v=vs.110).aspx) for the local one and [NetTcpRelayBinding](https://msdn.microsoft.com/library/microsoft.servicebus.nettcprelaybinding.aspx) for the
Service Bus endpoint and the addresses. The local endpoint has a local
network address with a distinct port. The Service Bus endpoint has an
endpoint address composed of the string "sb", your namespace name, and
the path "solver". This results in the URI
"sb://[serviceNamespace].servicebus.windows.net/solver", identifying the service
endpoint as a Service Bus TCP endpoint with a fully qualified external
DNS name. If you place the code replacing the placeholders as explained
above into the `Main` function of the "Service" application, you will have a functional service. If you want your service to listen exclusively on Service Bus, remove the local endpoint declaration.

### How to configure a service host in the App.config file

You can also configure the host using the App.config file. The service
hosting code in this case is as follows:

    ServiceHost sh = new ServiceHost(typeof(ProblemSolver));
    sh.Open();
    Console.WriteLine("Press ENTER to close");
    Console.ReadLine();
    sh.Close();

The endpoint definitions move into the App.config file. Note that the **NuGet** package has already added a range of definitions to the App.config file, which are the required configuration extensions for Service Bus. The following code snippet, which is the exact equivalent of the previous code snippet, should
appear directly beneath the **system.serviceModel** element. This snippet assumes that your project C\# namespace is named "Service".
Replace the placeholders with your Service Bus service namespace and SAS key.

    <services>
        <service name="Service.ProblemSolver">
            <endpoint contract="Service.IProblemSolver"
                      binding="netTcpBinding"
                      address="net.tcp://localhost:9358/solver"/>
            <endpoint contract="Service.IProblemSolver"
                      binding="netTcpRelayBinding"
                      address="sb://namespace.servicebus.windows.net/solver"
                      behaviorConfiguration="sbTokenProvider"/>
        </service>
    </services>
    <behaviors>
        <endpointBehaviors>
            <behavior name="sbTokenProvider">
                <transportClientEndpointBehavior>
                    <tokenProvider>
                        <sharedAccessSignature keyName="RootManageSharedAccessKey" key="yourKey" />
                    </tokenProvider>
                </transportClientEndpointBehavior>
            </behavior>
        </endpointBehaviors>
    </behaviors>

After you make these changes, the service starts as it did before, but with two live endpoints: one local and one listening in the cloud.

### How to create the client

#### How to configure a client programmatically

To consume the service, you can construct a WCF client using a
[`ChannelFactory`](https://msdn.microsoft.com/library/system.servicemodel.channelfactory(v=vs.110).aspx) object. Service Bus uses a token-based security
model implemented using SAS. The
**TokenProvider** class represents a security token provider with
built-in factory methods that return some well-known token providers. The
example below uses the [`CreateSharedAccessSignatureTokenProvider`](https://msdn.microsoft.com/library/microsoft.servicebus.tokenprovider.createsharedaccesssignaturetokenprovider.aspx) method to handle the acquisition of the appropriate SAS token. The name and key are those obtained
from the portal as described in the previous section.

First, reference or copy the `IProblemSolver` contract code from
the service into your client project.

Then, replace the code in the `Main` method of the client, again replacing the placeholder text with your Service Bus namespace and SAS key:

    var cf = new ChannelFactory<IProblemSolverChannel>(
        new NetTcpRelayBinding(), 
        new EndpointAddress(ServiceBusEnvironment.CreateServiceUri("sb", "namespace", "solver")));

    cf.Endpoint.Behaviors.Add(new TransportClientEndpointBehavior
                { TokenProvider = TokenProvider.CreateSharedAccessSignatureTokenProvider("RootManageSharedAccessKey","yourKey") });
     
    using (var ch = cf.CreateChannel())
    {
        Console.WriteLine(ch.AddNumbers(4, 5));
    }

You can now build the client and the service, run
them (run the service first), and the client will call the service and
print "**9**." You can run the client and server on different machines, even across networks, and the communication will still work. The client code can also run in the cloud or locally.

#### How to configure a client in the App.config file

You can also configure the client using the App.config file. The client
code for this is as follows:

    var cf = new ChannelFactory<IProblemSolverChannel>("solver");
    using (var ch = cf.CreateChannel())
    {
        Console.WriteLine(ch.AddNumbers(4, 5));
    }

The endpoint definitions move into the App.config file. The following code snippet, which is the same as the code listed previously, should
appear directly beneath the **system.serviceModel** element. Here, as before,
you must replace the placeholders with your Service Bus namespace
and SAS key.

    <client>
        <endpoint name="solver" contract="Service.IProblemSolver"
                  binding="netTcpRelayBinding"
                  address="sb://namespace.servicebus.windows.net/solver"
                  behaviorConfiguration="sbTokenProvider"/>
    </client>
    <behaviors>
        <endpointBehaviors>
            <behavior name="sbTokenProvider">
                <transportClientEndpointBehavior>
                    <tokenProvider>
                        <sharedAccessSignature keyName="RootManageSharedAccessKey" key="yourKey" />
                    </tokenProvider>
                </transportClientEndpointBehavior>
            </behavior>
        </endpointBehaviors>
    </behaviors>

## Next Steps

Now that you've learned the basics of the Service Bus **relay** service,
follow these links to learn more.

-   Building a service: [Building a Service for Service Bus][].
-   Building the client: [Building a Service Bus Client Application][].
-   Service Bus samples: download from [Azure Samples][] or see the overview on [MSDN][].

  [Create a Service Namespace]: #create_namespace
  [Obtain the Default Management Credentials for the Namespace]: #obtain_credentials
  [Get the Service Bus NuGet Package]: #get_nuget_package
  [How to: Use Service Bus to Expose and Consume a SOAP Web Service  with TCP]: #how_soap
  [Azure Management Portal]: http://manage.windowsazure.com
  [Shared Access Signature Authentication with Service Bus]: http://msdn.microsoft.com/library/dn170477.aspx
  [Building a Service for Service Bus]: http://msdn.microsoft.com/library/ee173564.aspx
  [Building a Service Bus Client Application]: http://msdn.microsoft.com/library/ee173543.aspx
  [Azure Samples]: https://code.msdn.microsoft.com/windowsazure/site/search?query=service%20bus&f%5B0%5D.Value=service%20bus&f%5B0%5D.Type=SearchText&ac=2
  [MSDN]: https://msdn.microsoft.com/en-us/library/dn194201.aspx
