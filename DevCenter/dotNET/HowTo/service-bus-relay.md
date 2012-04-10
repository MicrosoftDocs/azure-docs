<properties
umbracoNaviHide=0
pageTitle=Service Bus Relay - How To - .NET - Develop
metaKeywords=get started azure Service Bus Relay, Azure relay, Azure Service Bus relay, Service Bus relay, Azure relay .NET, Azure Service Bus relay .NET, Service Bus relay .NET, Azure relay C#, Azure Service Bus relay C#, Service Busy relay C#
metaDescription=Learn how to use the Windows Azure Service Bus relay service to connect two applications hosted in different locations.
linkid=dev-net-how-to-service-bus-relay
urlDisplayName=Service Bus Relay
headerExpose=
footerExpose=
disqusComments=1
/>
<h1>How to Use the Service Bus Relay Service</h1>
<p><span>This guide will show you how to use the Service Bus relay service. The samples are written in C# and use the Windows Communication Foundation API with extensions contained in the Service Bus assembly that is part of the .NET libraries for Windows Azure. For more information on the Service Bus relay, see the <a href="#next_steps">Next Steps</a> section.</span></p>
<h2>Table of Contents</h2>
<ul>
<li><a href="#what-is">What is the Service Bus Relay</a></li>
<li><a href="#create_namespace">Create a Service Namespace</a></li>
<li><a href="#obtain_credentials">Obtain the Default Management Credentials for the Namespace</a></li>
<li><a href="#get_nuget_package">Get the Service Bus NuGet Package</a></li>
<li><a href="#how_soap">How to: Use Service Bus to Expose and Consume a SOAP Web Service with TCP</a></li>
<li><a href="#next_steps">Next Steps</a></li>
</ul>
<h2><a name="what-is"></a>What is the Service Bus Relay</h2>
<p>The Service Bus <strong>Relay</strong> service enables you to build <strong>hybrid applications</strong> that run across both a Windows Azure datacenter and your own on-premise enterprise environment. The Service Bus relay facilitates this by enabling you to securely expose <span> Windows Communication Foundation (</span>WCF) services that reside within a corporate enterprise network to the public cloud, without having to open up a firewall connection or requiring intrusive changes to a corporate network infrastructure.</p>
<p><img src="/media/net/dev-net-how-to-sb-relay-01.png" alt="Relay Concepts"/></p>
<p>The Service Bus relay allows you to host WCF services within your existing enterprise environment. You can then delegate listening for incoming sessions and requests to these WCF services to the Service Bus running within Windows Azure - allowing you to expose these services to application code running there, or to mobile workers or extranet partner environments. The Service Bus allows you to securely control who can access these services at a fine-grain level. It provides a powerful and secure way to expose application functionality and data from your existing enterprise solutions and take advantage of it from the cloud.</p>
<p>This guide demonstrates how to use the Service Bus relay to create a WCF web service, exposed using a TCP channel binding, that implements a secured conversation between two parties.</p>
<h2><a name="create_namespace"></a>Create a Service Namespace</h2>
<p>To begin using the Service Bus relay in Windows Azure, you must first create a service namespace. A service namespace provides a scoping container for addressing Service Bus resources within your application.</p>
<p>To create a service namespace:</p>
<ol>
<li>
<p>Log on to the <a href="http://windows.azure.com">Windows Azure Management Portal</a>.</p>
</li>
<li>
<p>In the lower left navigation pane of the Management Portal, click <strong>Service Bus, Access Control &amp; Caching</strong>.</p>
</li>
<li>
<p>In the upper left pane of the Management Portal, click the <strong>Service Bus</strong> node, then click the <strong>New</strong> button. <br /><img src="/media/net/dev-net-how-to-sb-queues-03.png"/></p>
</li>
<li>
<p>In the <strong>Create a new Service Namespace</strong> dialog box, enter a <strong>Namespace</strong>, and then to make sure that it is unique, click the <strong>Check Availability</strong> button. <br /><img src="/media/net/dev-net-how-to-sb-queues-04.png"/></p>
</li>
<li>
<p>After making sure the namespace name is available, choose the country or region in which your namespace should be hosted (make sure you use the same <strong>Country/Region</strong> in which you are deploying your compute resources), and then click the <strong>Create Namespace</strong> button.</p>
</li>
</ol>
<p>The namespace you created will then appear in the Management Portal and takes a moment to activate. Wait until the status is <strong>Active</strong> before continuing.</p>
<h2><a name="obtain_credentials"></a>Obtain the Default Management Credentials for the Namespace</h2>
<p>In order to perform management operations, such as creating a relay connection, on the new namespace, you need to obtain the management credentials for the namespace.</p>
<ol>
<li>
<p>In the left navigation pane, click <strong>Service Bus</strong> to display the list of available namespaces: <br /><img src="/media/net/dev-net-how-to-sb-queues-03.png"/></p>
</li>
<li>
<p>Select the namespace you just created from the list shown: <br /><img src="/media/net/dev-net-how-to-sb-queues-05.png"/></p>
</li>
<li>
<p>The <strong>Properties</strong> pane on the right side will list the properties for the new namespace: <br /><img src="/media/net/dev-net-how-to-sb-queues-06.png"/></p>
</li>
<li>
<p>The <strong>Default Key</strong> is hidden. Click the <strong>View</strong> button to display the security credentials: <br /><img src="/media/net/dev-net-how-to-sb-queues-07.png"/></p>
</li>
<li>
<p>Make a note of the <strong>Default Issuer</strong> and the <strong>Default Key</strong> as you will use this information below to perform operations with the namespace.</p>
</li>
</ol>
<h2><a name="get_nuget_package"></a>Get the Service Bus NuGet Package</h2>
<p><span>The Service Bus<strong> NuGet</strong> package is the easiest way to get the Service Bus API and to configure your application with all of the Service Bus dependencies. The NuGet Visual Studio extension makes it easy to install and update libraries and tools in Visual Studio and Visual Web Developer. The Service Bus NuGet package is the easiest way to get the Service Bus API and to configure your application with all of the Service Bus dependencies.</span></p>
<p>To install the NuGet package in your application, do the following:</p>
<ol>
<li>In Solution Explorer, right-click <strong>References</strong>, then click <strong>Manage NuGet Packages</strong>.</li>
<li>
<p>Search for "WindowsAzure.ServiceBus" and select the <strong>Windows Azure Service Bus</strong> item. Click <strong>Install</strong> to complete the installation, then close this dialog.</p>
<img src="/media/net/hy-con-2.png"/></li>
</ol>
<h2><a name="how_soap"></a>How to Use Service Bus to Expose and Consume a SOAP Web Service with TCP</h2>
<p><span>To expose an existing WCF SOAP web service for external consumption, you need to make changes to the service's bindings and addresses. This may require changes to your configuration file or it could require code changes, depending on how you have set up and configured your WCF services. Note that WCF allows you to have multiple network endpoints over the same service, so you can retain the existing internal endpoints while adding Service Bus endpoints for external access at the same time.</span></p>
<p><span>In this task, you will build a simple WCF service from scratch and add a Service Bus listener to it. The assumption is that you're somewhat familiar with Visual Studio 2010, so this task does not walk through all the details of creating a project, but rather focuses on the code.</span></p>
<p>Before starting the steps below, complete the following steps to set up your environment:</p>
<ol>
<li>Within Visual Studio, create a console application that contains two projects, "Client" and "Service", within the solution.</li>
<li>Set the target framework for both projects to .NET Framework 4.</li>
<li>Add the <strong>Windows Azure Service Bus NuGet </strong>package to both projects. This adds all of the necessary assembly references to your projects.</li>
</ol>
<h3>How to Create the Service</h3>
<p><span>First, create the service itself. Any WCF service consists of at least three distinct pieces: </span></p>
<ul>
<li>D<span>efinition of a contract that describes what messages are exchanged what operations are to be invoked. </span></li>
<li>I<span>mplementation of said contract.</span></li>
<li>H<span>ost that hosts that service and exposes a number of endpoints. </span></li>
</ul>
<p><span>The code examples in this section address each of these pieces.</span></p>
<p>The contract just defines a single operation, <strong>AddNumbers</strong>,that adds two numbers and returns the result. The <strong>IProblemSolverChannel</strong> interface is a best practice to create for the client so that it can easily manage the proxy lifetime. It's a good idea to put this contract definition into a separate file so you can reference that file from both your "Client" and "Service" projects, but you can also copy the code into both projects.</p>
<pre class="prettyprint">    using System.ServiceModel;
 
    [ServiceContract(Namespace = "urn:ps")]
    interface IProblemSolver
    {
        [OperationContract]
        int AddNumbers(int a, int b);
    }
 
    interface IProblemSolverChannel : IProblemSolver, IClientChannel {}
</pre>
<p>With the contract in place, the implementation is trivial:</p>
<pre class="prettyprint">    class ProblemSolver : IProblemSolver
    {
        public int AddNumbers(int a, int b)
        {
            return a + b;
        }
    }
</pre>
<p><strong>How to Configure a Service Host Programmatically</strong></p>
<p><span>With the contract and implementation in place, you can now host the service. Hosting happens inside a <strong>System.ServiceModel.ServiceHost</strong>, which takes care of managing instances of the service and hosts the endpoints that listen for messages. The code below configures the service with both a regular local endpoint and a Service Bus endpoint to illustrate how the side-by-side of internal and external endpoint might look. Replace the string "**namespace**" with your namespace name and "**key**" with the issuer key that you obtained in the setup step above. </span></p>
<pre class="prettyprint">ServiceHost sh = new ServiceHost(typeof(ProblemSolver));

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
</pre>
<p><span>In the example, you create two endpoints that are on the same contract implementation. One is local and one is projected through Service Bus. The key difference between them are the bindings, <strong>NetTcpBinding</strong> for the local one and <strong>NetTcpRelayBinding</strong> for the Service Bus endpoint and the addresses. The local endpoint has a local network address with a distinct port, the Service Bus endpoint has an endpoint address composed from the scheme "sb", your namespace name and the path "solver", resulting in the URI "sb://namespace.servicebus.windows,net/solver", identifying the service endpoint as a Service Bus TCP endpoint with a fully qualified external DNS name. If you place the code replacing the placeholders as explained above into the "Service" application's <strong>Main </strong>function, you will now have a functional service. If you want your service to exclusively listen on Service Bus, just remove the local endpoint declaration.</span></p>
<p><strong>How to Configure a Service Host in the App.config File</strong></p>
<p>You can also configure the host using the app.config file. The service hosting code for this case is simple:</p>
<pre class="prettyprint">ServiceHost sh = new ServiceHost(typeof(ProblemSolver));
sh.Open();
Console.WriteLine("Press ENTER to close");
Console.ReadLine();
sh.Close();
</pre>
<p>The endpoint definitions move into the app.config file. Within the app.config file, you will notice that the <strong>NuGet</strong> package has already added a range of definitions to the file, which are the required config extensions for Service Bus, some of which we'll use below. The following snippet, which is the exact equivalent of the code listed above, should go just beneath the <strong>system.serviceModel</strong> element. The assumption for this snippet is that your project's C# namespace is simply "Service". Replace the placeholders with your Service Bus namespace name and key.</p>
<pre class="prettyprint">&lt;services&gt;
    &lt;service name="Service.ProblemSolver"&gt;
        &lt;endpoint contract="Service.IProblemSolver"
                  binding="netTcpBinding"
                  address="net.tcp://localhost:9358/solver"/&gt;
        &lt;endpoint contract="Service.IProblemSolver"
                  binding="netTcpRelayBinding"
                  address="sb://**namespace**.servicebus.windows.net/solver"
                  behaviorConfiguration="sbTokenProvider"/&gt;
    &lt;/service&gt;
&lt;/services&gt;
&lt;behaviors&gt;
    &lt;endpointBehaviors&gt;
        &lt;behavior name="sbTokenProvider"&gt;
            &lt;transportClientEndpointBehavior&gt;
                &lt;tokenProvider&gt;
                    &lt;sharedSecret issuerName="owner" issuerSecret="**key**" /&gt;
                &lt;/tokenProvider&gt;
            &lt;/transportClientEndpointBehavior&gt;
        &lt;/behavior&gt;
    &lt;/endpointBehaviors&gt;
&lt;/behaviors&gt;
</pre>
<p>After<span> you make these changes, the service should start up just like it did before, but with two live endpoints: one local and one listening in the cloud.</span></p>
<h3>How to Create the Client</h3>
<p><strong>How to Configure a Client Programmatically</strong></p>
<p><span>To consume the service, you can construct a WCF client using a <strong>ChannelFactory</strong> object. Service Bus uses a claims-based security model implemented using the Access Control Service (ACS). The <strong>TokenProvider</strong> class represents a security token provider with built-in factory methods returning some well-known token providers. The example below uses the <strong>SharedSecretTokenProvider</strong> to hold the shared secret credentials and handle the acquisition of the appropriate tokens from the Access Control Service. The name and key are those obtained from the portal as described in the previous section.</span></p>
<p><span>First, reference or copy the <strong>IProblemSolver</strong> contract code from the service into your client project.</span></p>
<p>After<span> you're done with that, replace your client's <strong>Main</strong> method content, again replacing the placeholder text with your Service Bus namespace name and key:</span></p>
<pre class="prettyprint">var cf = new ChannelFactory&lt;IProblemSolverChannel&gt;(
    new NetTcpRelayBinding(), 
    new EndpointAddress(ServiceBusEnvironment.CreateServiceUri("sb", "**namespace**", "solver")));

cf.Endpoint.Behaviors.Add(new TransportClientEndpointBehavior
            { TokenProvider = TokenProvider.CreateSharedSecretTokenProvider("owner","**key**") });
 
using (var ch = cf.CreateChannel())
{
    Console.WriteLine(ch.AddNumbers(4, 5));
}
</pre>
<p><span>That's it. Now you can compile the client and the service, run them (service first), and then the client will call the service and print "9". You can run the client and server on different machines, and even across networks, and the communication will still work. The client code can also be in the cloud or vice versa.</span></p>
<p><strong>How to Configure a Client in the App.config File</strong></p>
<p>You can also configure the client using the app.config file. The client code for this is simple:</p>
<pre class="prettyprint">var cf = new ChannelFactory&lt;IProblemSolverChannel&gt;("solver");
using (var ch = cf.CreateChannel())
{
    Console.WriteLine(ch.AddNumbers(4, 5));
}
</pre>
<p>The endpoint definitions move into the app.config file. The following snippet, which is the exact equivalent of the code listed above, should go just beneath the <strong>system.serviceModel</strong> element. Here, as before, you need to replace the placeholders with your Service Bus namespace name and key.</p>
<pre class="prettyprint">&lt;client&gt;
    &lt;endpoint name="solver" contract="MyService.IProblemSolver"
              binding="netTcpRelayBinding"
              address="sb://**namespace**.servicebus.windows.net/solver"
              behaviorConfiguration="sbTokenProvider"/&gt;
&lt;/client&gt;
&lt;behaviors&gt;
    &lt;endpointBehaviors&gt;
        &lt;behavior name="sbTokenProvider"&gt;
            &lt;transportClientEndpointBehavior&gt;
                &lt;tokenProvider&gt;
                    &lt;sharedSecret issuerName="owner" issuerSecret="**key**" /&gt;
                &lt;/tokenProvider&gt;
            &lt;/transportClientEndpointBehavior&gt;
        &lt;/behavior&gt;
    &lt;/endpointBehaviors&gt;
&lt;/behaviors&gt;
</pre>
<h2><a name="next_steps"></a>Next Steps</h2>
<p>Now that you've learned the basics of the Service Bus <strong>Relay</strong> service, follow these links to learn more.</p>
<ul>
<li>Building a service: <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee173564.aspx">Building a Service for the Service Bus</a>.</li>
<li>Building the client: <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee173543.aspx">Building a Service Bus Client Application</a>.</li>
<li>Service Bus samples: download from <a href="http://code.msdn.microsoft.com/windowsazure">Windows Azure Samples</a>.</li>
</ul>