<properties umbraconavihide="0" pagetitle="Service Bus Relay - How To - .NET - Develop" metakeywords="get started azure Service Bus Relay, Azure relay, Azure Service Bus relay, Service Bus relay, Azure relay .NET, Azure Service Bus relay .NET, Service Bus relay .NET, Azure relay C#, Azure Service Bus relay C#, Service Busy relay C#" metadescription="Learn how to use the Windows Azure Service Bus relay service to connect two applications hosted in different locations." linkid="dev-net-how-to-service-bus-relay" urldisplayname="Service Bus Relay" headerexpose="" footerexpose="" disquscomments="1"></properties>

# How to Use the Service Bus Relay Service

This guide will show you how to use the Service Bus relay service.
The samples are written in C# and use the Windows Communication
Foundation API with extensions contained in the Service Bus assembly
that is part of the .NET libraries for Windows Azure. For more
information on the Service Bus relay, see the [Next Steps][]
section.

## Table of Contents

-   [What is the Service Bus Relay][]
-   [Create a Service Namespace][]
-   [Obtain the Default Management Credentials for the Namespace][]
-   [Get the Service Bus NuGet Package][]
-   [How to: Use Service Bus to Expose and Consume a SOAP Web Service
    with TCP][]
-   [Next Steps][]

## <a name="what-is"> </a>What is the Service Bus Relay

The Service Bus **Relay** service enables you to build **hybrid
applications** that run in both a Windows Azure datacenter and your
own on-premises enterprise environment. The Service Bus relay facilitates
this by enabling you to securely expose Windows Communication
Foundation (WCF) services that reside within a corporate
enterprise network to the public cloud, without having to open up a
firewall connection or requiring intrusive changes to a corporate
network infrastructure.

![Relay Concepts][]

The Service Bus relay allows you to host WCF services within your
existing enterprise environment. You can then delegate listening for
incoming sessions and requests to these WCF services to the Service Bus
running within Windows Azure. This enables you to expose these services to
application code running in Windows Azure, or to mobile workers or extranet partner
environments. The Service Bus allows you to securely control who can
access these services at a fine-grain level. It provides a powerful and
secure way to expose application functionality and data from your
existing enterprise solutions and take advantage of it from the cloud.

This guide demonstrates how to use the Service Bus relay to create a WCF
web service, exposed using a TCP channel binding, that implements a
secured conversation between two parties.

## <a name="create_namespace"> </a>Create a Service Namespace

To begin using the Service Bus relay in Windows Azure, you must first
create a service namespace. A service namespace provides a scoping
container for addressing Service Bus resources within your application.

To create a service namespace:

1.  Log on to the [Windows Azure Management Portal][].

2.  In the lower left navigation pane of the Management Portal, click
    **Service Bus, Access Control & Caching**.

3.  In the upper left pane of the Management Portal, click the **Service
    Bus** node, then click the **New** button.   
    ![][]

4.  In the **Create a new Service Namespace** dialog box, enter a
    **Namespace**, and then to make sure that it is unique, click the
    **Check Availability** button.   
    ![][1]

5.  After making sure the namespace name is available, choose the
    country or region in which your namespace should be hosted (make
    sure you use the same **Country/Region** in which you are deploying
    your compute resources), and then click the **Create Namespace**
    button.

The namespace you created will then appear in the Management Portal and
takes a moment to activate. Wait until the status is **Active** before
continuing.

## <a name="obtain_credentials"> </a>Obtain the Default Management Credentials for the Namespace

In order to perform management operations, such as creating a relay
connection, on the new namespace, you need to obtain the management
credentials for the namespace.

1.  In the left navigation pane, click **Service Bus** to display the
    list of available namespaces:   
    ![][]

2.  Select the namespace you just created from the list shown:   
    ![][2]

3.  The **Properties** pane on the right side will list the properties
    for the new namespace:   
    ![][3]

4.  The **Default Key** is hidden. Click the **View** button to display
    the security credentials:   
    ![][4]

5.  Make a note of the **Default Issuer** and the **Default Key** as you
    will use this information below to perform operations with the
    namespace.

## <a name="get_nuget_package"> </a>Get the Service Bus NuGet Package

The Service Bus **NuGet** package is the easiest way to get the
Service Bus API and to configure your application with all of the
Service Bus dependencies. The NuGet Visual Studio extension makes it
easy to install and update libraries and tools in Visual Studio and
Visual Web Developer. The Service Bus NuGet package is the easiest way
to get the Service Bus API and to configure your application with all of
the Service Bus dependencies.

To install the NuGet package in your application, do the following:

1.  In Solution Explorer, right-click **References**, then click
    **Manage NuGet Packages**.
2.  Search for "WindowsAzure.ServiceBus" and select the **Windows Azure
    Service Bus** item. Click **Install** to complete the installation,
    then close this dialog.

    ![][5]

## <a name="how_soap"> </a>How to Use Service Bus to Expose and Consume a SOAP Web Service with TCP

To expose an existing WCF SOAP web service for external
consumption, you must make changes to the service bindings and
addresses. This may require changes to your configuration file or it
could require code changes, depending on how you have set up and
configured your WCF services. Note that WCF allows you to have multiple
network endpoints over the same service, so you can retain the existing
internal endpoints while adding Service Bus endpoints for external
access at the same time.

In this task, you will build a simple WCF service and
add a Service Bus listener to it. This exercise assumes some familiarity with Visual Studio 2010, and therefore does not walk through all the details of creating a project. Instead, it focuses on the code.

Before starting the steps below, complete the following procedure to set up
your environment:

1.  Within Visual Studio, create a console application that contains two
    projects, "Client" and "Service", within the solution.
2.  Set the target framework for both projects to .NET Framework 4.
3.  Add the **Windows Azure Service Bus NuGet** package to both projects.
    This adds all of the necessary assembly references to your projects.

### How to Create the Service

First, create the service itself. Any WCF service consists of at
least three distinct parts:

-   Definition of a contract that describes what messages are
    exchanged and what operations are to be invoked. 
-   Implementation of said contract.
-   Host that hosts that service and exposes a number of
    endpoints.

The code examples in this section address each of these
components.

The contract defines a single operation, **AddNumbers**, that adds
two numbers and returns the result. The **IProblemSolverChannel**
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

**How to Configure a Service Host Programmatically**

With the contract and implementation in place, you can now host
the service. Hosting occurs inside a
**System.ServiceModel.ServiceHost** object, which takes care of managing
instances of the service and hosts the endpoints that listen for
messages. The code below configures the service with both a regular
local endpoint and a Service Bus endpoint to illustrate the appearance, side-by-side, of internal and external endpoints. Replace the
string "\*\*namespace\*\*" with your namespace name and "\*\*key\*\*"
with the issuer key that you obtained in the setup step above. 

    ServiceHost sh = new ServiceHost(typeof(ProblemSolver));

    sh.AddServiceEndpoint(
       typeof (IProblemSolver), new NetTcpBinding(), 
       "net.tcp://localhost:9358/solver");

    sh.AddServiceEndpoint(
       typeof(IProblemSolver), new NetTcpRelayBinding(), 
       ServiceBusEnvironment.CreateServiceUri("sb", "**namespace**", "solver"))
        .Behaviors.Add(new TransportClientEndpointBehavior {
              TokenProvider = TokenProvider.CreateSharedSecretTokenProvider( "owner", "**key**")});

    sh.Open();
    Console.WriteLine("Press ENTER to close");
    Console.ReadLine();
    sh.Close();

In the example, you create two endpoints that are on the same
contract implementation. One is local and one is projected through the Service Bus. The key differences between them are the bindings;
**NetTcpBinding** for the local one and **NetTcpRelayBinding** for the
Service Bus endpoint and the addresses. The local endpoint has a local
network address with a distinct port. The Service Bus endpoint has an
endpoint address composed of the string "sb", your namespace name, and
the path "solver". This results in the URI
"sb://[serviceNamespace].servicebus.windows.net/solver", identifying the service
endpoint as a Service Bus TCP endpoint with a fully qualified external
DNS name. If you place the code replacing the placeholders as explained
above into the **Main** function of the "Service" application, you will have a functional service. If you want your service to listen exclusively on the Service Bus, remove the local endpoint declaration.

**How to Configure a Service Host in the App.config File**

You can also configure the host using the App.config file. The service
hosting code in this case is as follows:

    ServiceHost sh = new ServiceHost(typeof(ProblemSolver));
    sh.Open();
    Console.WriteLine("Press ENTER to close");
    Console.ReadLine();
    sh.Close();

The endpoint definitions move into the App.config file. Note that the **NuGet** package has already added a range of definitions to the App.config file, which are the required configuration extensions for the Service Bus. The following code snippet, which is the exact equivalent of the code listed above, should
appear directly beneath the **system.serviceModel** element. This snippet assumes that your project C\# namespace is named "Service".
Replace the placeholders with your Service Bus service namespace and key.

    <services>
        <service name="Service.ProblemSolver">
            <endpoint contract="Service.IProblemSolver"
                      binding="netTcpBinding"
                      address="net.tcp://localhost:9358/solver"/>
            <endpoint contract="Service.IProblemSolver"
                      binding="netTcpRelayBinding"
                      address="sb://**namespace**.servicebus.windows.net/solver"
                      behaviorConfiguration="sbTokenProvider"/>
        </service>
    </services>
    <behaviors>
        <endpointBehaviors>
            <behavior name="sbTokenProvider">
                <transportClientEndpointBehavior>
                    <tokenProvider>
                        <sharedSecret issuerName="owner" issuerSecret="**key**" />
                    </tokenProvider>
                </transportClientEndpointBehavior>
            </behavior>
        </endpointBehaviors>
    </behaviors>

After you make these changes, the service starts as it did before, but with two live endpoints: one local and one listening in the cloud.

### How to Create the Client

**How to Configure a Client Programmatically**

To consume the service, you can construct a WCF client using a
**ChannelFactory** object. The Service Bus uses a claims-based security
model implemented using the Access Control Service (ACS). The
**TokenProvider** class represents a security token provider with
built-in factory methods that return some well-known token providers. The
example below uses the **SharedSecretTokenProvider** to hold the shared
secret credentials and handle the acquisition of the appropriate tokens
from the Access Control Service. The name and key are those obtained
from the portal as described in the previous section.

First, reference or copy the **IProblemSolver** contract code from
the service into your client project.

Then, replace the code in the **Main** method of the client, again replacing the placeholder text with your Service Bus service namespace and key:

    var cf = new ChannelFactory<IProblemSolverChannel>(
        new NetTcpRelayBinding(), 
        new EndpointAddress(ServiceBusEnvironment.CreateServiceUri("sb", "**namespace**", "solver")));

    cf.Endpoint.Behaviors.Add(new TransportClientEndpointBehavior
                { TokenProvider = TokenProvider.CreateSharedSecretTokenProvider("owner","**key**") });
     
    using (var ch = cf.CreateChannel())
    {
        Console.WriteLine(ch.AddNumbers(4, 5));
    }

You can now compile the client and the service, run
them (run the service first), and the client will call the service and
print "9". You can run the client and server on different machines, even across networks, and the communication will still work. The client code can also run in the cloud or locally.

**How to Configure a Client in the App.config File**

You can also configure the client using the App.config file. The client
code for this is as follows:

    var cf = new ChannelFactory<IProblemSolverChannel>("solver");
    using (var ch = cf.CreateChannel())
    {
        Console.WriteLine(ch.AddNumbers(4, 5));
    }

The endpoint definitions move into the App.config file. The following
snippet, which is the same as the code listed above, should
appear directly beneath the **system.serviceModel** element. Here, as before,
you must replace the placeholders with your Service Bus service namespace
and key.

    <client>
        <endpoint name="solver" contract="Service.IProblemSolver"
                  binding="netTcpRelayBinding"
                  address="sb://**namespace**.servicebus.windows.net/solver"
                  behaviorConfiguration="sbTokenProvider"/>
    </client>
    <behaviors>
        <endpointBehaviors>
            <behavior name="sbTokenProvider">
                <transportClientEndpointBehavior>
                    <tokenProvider>
                        <sharedSecret issuerName="owner" issuerSecret="**key**" />
                    </tokenProvider>
                </transportClientEndpointBehavior>
            </behavior>
        </endpointBehaviors>
    </behaviors>

## <a name="next_steps"> </a>Next Steps

Now that you've learned the basics of the Service Bus **Relay** service,
follow these links to learn more.

-   Building a service: [Building a Service for the Service Bus][].
-   Building the client: [Building a Service Bus Client Application][].
-   Service Bus samples: download from [Windows Azure Samples][].

  [Next Steps]: #next_steps
  [What is the Service Bus Relay]: #what-is
  [Create a Service Namespace]: #create_namespace
  [Obtain the Default Management Credentials for the Namespace]: #obtain_credentials
  [Get the Service Bus NuGet Package]: #get_nuget_package
  [How to: Use Service Bus to Expose and Consume a SOAP Web Service with
  TCP]: #how_soap
  [Relay Concepts]: ../../../DevCenter/dotNet/Media/sb-relay-01.png
  [Windows Azure Management Portal]: http://windows.azure.com
  []: ../../../DevCenter/dotNet/Media/sb-queues-03.png
  [1]: ../../../DevCenter/dotNet/Media/sb-queues-04.png
  [2]: ../../../DevCenter/dotNet/Media/sb-queues-05.png
  [3]: ../../../DevCenter/dotNet/Media/sb-queues-06.png
  [4]: ../../../DevCenter/dotNet/Media/sb-queues-07.png
  [5]: ../../../DevCenter/dotNet/Media/hy-con-2.png
  [Building a Service for the Service Bus]: http://msdn.microsoft.com/en-us/library/windowsazure/ee173564.aspx
  [Building a Service Bus Client Application]: http://msdn.microsoft.com/en-us/library/windowsazure/ee173543.aspx
  [Windows Azure Samples]: http://code.msdn.microsoft.com/windowsazure
