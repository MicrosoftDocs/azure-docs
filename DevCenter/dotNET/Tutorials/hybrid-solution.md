<?xml version="1.0" encoding="utf-8"?>
<body>
  <properties linkid="dev-net-tutorials-hybrid-solution" urlDisplayName="Hybrid Application" headerExpose="" pageTitle="Hybrid On-Premise /Cloud Application" metaKeywords="Azure Service Bus tutorial, Azure Service Bus relay tutorial, Azure hybrid tutorial, Azure C# Service Bus tutorial, Azure C# Service Bus relay tutorial, Azure C# hybrid tutorial, Azure C# Service Bus tutorial, Azure C# Service Bus relay tutorial, Azure C# hybrid tutorial" footerExpose="" metaDescription="An end-to-end tutorial that helps you develop an application that uses the Windows Azure Service Bus relay to connect between two applications." umbracoNaviHide="0" disqusComments="1" />
  <h1>.NET On-Premises/Cloud Hybrid Application Using Service Bus Relay</h1>
  <h2>INTRODUCTION</h2>
  <p>Developing hybrid cloud applications with Windows Azure is easy using Visual Studio 2010 and the free Windows Azure SDK for .NET. This guide assumes you have no prior experience using Windows Azure. In less than 30 minutes, you will have an application that uses multiple Windows Azure resources up and running in the cloud.</p>
  <p>You will learn:</p>
  <ul>
    <li>How to create or adapt an existing web service for consumption by a web solution.</li>
    <li>How to use the Windows Azure Service Bus relay to share data between a Windows Azure application and a web service hosted elsewhere.</li>
  </ul>
  <h3>HOW THE SERVICE BUS RELAY HELPS WITH HYBRID SOLUTIONS</h3>
  <p>Business solutions are typically composed of a combination of custom code written to tackle new and unique business requirements and existing functionality provided by solutions and systems that are already in place.</p>
  <p>Solution architects are starting to use the cloud for easier handling of scale requirements and lower operational costs. In doing so, they find that existing service assets they’d like to leverage as building blocks for their solutions are inside the corporate firewall and out of easy reach for access by the cloud solution. Many internal services are not built or hosted in a way that they can be easily exposed at the corporate network edge.</p>
  <p>The <em>Service Bus relay</em> is designed for the use-case of taking existing Windows Communication Foundation (WCF) web services and making those services securely accessible to solutions that reside outside the corporate perimeter without requiring intrusive changes to the corporate network infrastructure. Such Service Bus relay services are still hosted inside their existing environment, but they delegate listening for incoming sessions and requests to the cloud-hosted Service Bus. The Service Bus also protects those services from unauthorized access by using the Windows Azure Access Control Service.</p>
  <h3>THE SOLUTION SCENARIO</h3>
  <p>In this tutorial, you will create an ASP.NET MVC 3 website that will allow you to see a list of products on the product inventory page.</p>
  <p>
    <img src="../../../DevCenter/dotNet/Media/hybrid.png" />
  </p>
  <p>The tutorial assumes that you have product information in an existing on-premises system, and uses the Service Bus relay to reach into that system. This is simulated by a web service that is running in a simple console application and is backed by an in-memory set of products. You will be able to run this console application on your own computer and deploy the web role into Windows Azure. By doing so, you will see how the web role running in the Windows Azure datacenter will indeed call into your computer, even though your computer will almost certainly reside behind at least one firewall and a network address translation (NAT) layer.</p>
  <p>A screenshot of the start page of the completed web application is below.</p>
  <p>
    <img src="../../../DevCenter/dotNet/Media/App2.png" />
  </p>
  <h2>SET UP THE DEVELOPMENT ENVIRONMENT</h2>
  <p>Before you can begin developing your Windows Azure application, you need to get the tools and set-up your development environment.</p>
  <ol>
    <li>
      <p>To install the Windows Azure SDK for .NET, click the button below:</p>
      <a href="http://go.microsoft.com/fwlink/?LinkID=234939&amp;clcid=0x409" class="site-arrowboxcta download-cta">Get Tools and SDK</a>
    </li>
    <li>
      <p>When prompted to run or save <strong>WindowsAzureSDKForNet.exe</strong>, click <strong>Run</strong>:</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-hybrid-3.png" />
    </li>
    <li>
      <p>Click on <strong>Install</strong> in the installer window and proceed with the installation:</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-hybrid-4.png" />
    </li>
    <li>Once the installation is complete, you will have everything necessary to start developing. The SDK includes tools that let you easily develop Windows Azure applications in Visual Studio. If you do not have Visual Studio installed, it also installs the free Visual Web Developer Express.</li>
  </ol>
  <h2>CREATE A WINDOWS AZURE ACCOUNT</h2>
  <p>In order to set up the Service Bus Service Namespace and later deploy your application to Windows Azure, you need an account. If you do not have one you can create a free trial account.</p>
  <ol>
    <li>
      <p>Open a web browser, and browse to the <a href="http://www.windowsazure.com">http://www.windowsazure.com</a>. To get started with a free account, click <strong>free trial</strong> in the upper right corner and follow the steps.</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-hybrid-32.png" />
    </li>
    <li>Your account is now created. You are ready to deploy your application to Windows Azure!</li>
  </ol>
  <h2>CREATE A SERVICE NAMESPACE</h2>
  <p>To begin using Service Bus features in Windows Azure, you must first create a service namespace. A service namespace provides a scoping container for addressing Service Bus resources within your application.</p>
  <p>To create a service namespace:</p>
  <ol>
    <li>
      <p>Log on to the <a href="http://windows.azure.com">Windows Azure Management Portal</a>.</p>
    </li>
    <li>
      <p>In the lower left navigation pane of the Management Portal, click <strong>Service Bus, Access Control &amp; Caching</strong>.</p>
    </li>
    <li>
      <p>In the upper left pane of the Management Portal, click the <strong>Service Bus</strong> node, and then click the <strong>New</strong> button. <br /><img src="../../../DevCenter/dotNet/Media/sb-queues-03.png" /></p>
    </li>
    <li>
      <p>In the <strong>Create a new Service Namespace</strong> dialog, enter a <strong>Namespace</strong>, and then to make sure that it is unique, click the <strong>Check Availability</strong> button. <br /><img src="../../../DevCenter/dotNet/Media/sb-queues-04.png" /></p>
    </li>
    <li>
      <p>After making sure the namespace name is available, choose the country or region in which your namespace should be hosted (make sure you use the same country/region in which you are deploying your compute resources), and then click the <strong>Create Namespace</strong> button.</p>
    </li>
  </ol>
  <p>The namespace you created will then appear in the Management Portal and takes a moment to activate. Wait until the status is <strong>Active</strong> before moving on.</p>
  <h2>OBTAIN THE DEFAULT MANAGEMENT CREDENTIALS FOR THE NAMESPACE</h2>
  <p>In order to perform management operations, such as creating a queue, on the new namespace, you need to obtain the management credentials for the namespace.</p>
  <ol>
    <li>
      <p>In the left navigation pane, click the <strong>Service Bus</strong> node, to display the list of available namespaces: <br /><img src="../../../DevCenter/dotNet/Media/sb-queues-03.png" /></p>
    </li>
    <li>
      <p>Select the namespace you just created from the list shown: <br /><img src="../../../DevCenter/dotNet/Media/sb-queues-05.png" /></p>
    </li>
    <li>
      <p>The right-hand <strong>Properties</strong> pane will list the properties for the new namespace: <br /><img src="../../../DevCenter/dotNet/Media/sb-queues-06.png" /></p>
    </li>
    <li>
      <p>The <strong>Default Key</strong> is hidden. Click the <strong>View</strong> button to display the security credentials: <br /><img src="../../../DevCenter/dotNet/Media/sb-queues-07.png" /></p>
    </li>
    <li>
      <p>Make a note of the <strong>Default Issuer</strong> and the <strong>Default Key</strong> as you will use this information below to perform operations with the namespace.</p>
    </li>
  </ol>
  <h2>CREATE AN ON-PREMISES SERVER</h2>
  <p>First, you will build a (mock) on-premises product catalog system. It will be fairly simple; you can see this as representing an actual on-premises product catalog system with a complete service surface that we’re trying to integrate.</p>
  <p>This project will start as a Visual Studio console application. The project uses the Service Bus NuGet package to include the service bus libraries and configuration settings. The NuGet Visual Studio extension makes it easy to install and update libraries and tools in Visual Studio and Visual Web Developer. The Service Bus NuGet package is the easiest way to get the Service Bus API and to configure your application with all of the Service Bus dependencies. For details about using NuGet and the Service Bus package, see <a href="http://go.microsoft.com/fwlink/?LinkId=234589">Using the NuGet Service Bus Package</a>.</p>
  <h3>CREATE THE PROJECT</h3>
  <ol>
    <li>Using administrator privileges, launch either Microsoft Visual Studio 2010 or Microsoft Visual Web Developer Express 2010. To launch Visual Studio with administrator privileges, right-click <strong>Microsoft Visual Studio 2010 (or Microsoft Visual Web Developer Express 2010)</strong> and then click <strong>Run as administrator</strong>.</li>
    <li>
      <p>In Visual Studio, on the <strong>File</strong> menu, click <strong>New</strong>, and then click <strong>Project</strong>.</p>
      <img src="../../../DevCenter/dotNet/Media/hy-web-1.jpg" />
    </li>
    <li>
      <p>From <strong>Installed Templates</strong>, under <strong> Visual C#</strong>, click <strong>Console Application</strong>. In the <strong>Name</strong> box, type the name <strong> ProductsServer</strong>:</p>
      <img src="../../../DevCenter/dotNet/Media/hy-con-1.jpg" />
    </li>
    <li>Click <strong>OK </strong>to create the <strong> ProductsServer </strong>project.</li>
    <li>In the <strong>Solution Explorer</strong>, right-click <strong>ProductsServer</strong>, then click <strong>Properties</strong>.</li>
    <li>
      <p>Click the <strong>Application</strong> tab on the left, then select <strong>.NET Framework 4</strong> from the <strong>Target framework:</strong> dropdown. Click <strong> Yes</strong> when prompted to reload the project.</p>
      <img src="../../../DevCenter/dotNet/Media/hy-con-3.png" />
    </li>
    <li>In <strong>Solution Explorer</strong>, right-click <strong>References</strong>, then click <strong>Manage NuGet Packages</strong>...</li>
    <li>
      <p>Search for ‘<strong>WindowsAzure.ServiceBus</strong>’ and select the <strong>Windows Azure Service Bus</strong> item. Click <strong>Install </strong>to complete the installation, then close this dialog.</p>
      <img src="../../../DevCenter/dotNet/Media/hy-con-2.png" />
      <p>Note that the required client assemblies are now referenced.</p>
    </li>
    <li>
      <p>Add a new class for your product contract. In <strong>Solution Explorer</strong>, right click <strong>ProductsServer</strong> and click <strong>Add</strong>, then click <strong>Class</strong>.</p>
      <img src="../../../DevCenter/dotNet/Media/hy-con-4.png" />
    </li>
    <li>In the <strong>Name</strong> box, type the name <strong>ProductsContract.cs</strong>. Then click <strong>Add</strong>.</li>
    <li>
      <p>In <strong>ProductsContract.cs</strong>, replace the namespace definition with the following code, which defines the contract for the service:</p>
      <pre class="prettyprint">namespace ProductsServer
{
    using System.Collections.Generic;
    using System.Runtime.Serialization;
    using System.ServiceModel;

    // Define the data contract for the service
    [DataContract]
    // Declare the serializable properties
    public class ProductData
    {
        [DataMember]
        public string Id { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string Quantity { get; set; }
    }

    // Define the service contract.
    [ServiceContract]
    interface IProducts
    {
        [OperationContract]
        IList&lt;ProductData&gt; GetProducts();

    }

    interface IProductsChannel : IProducts, IClientChannel
    {
    }
}
</pre>
    </li>
    <li>
      <p>In Program.cs, replace the namespace definition with the following code, which adds the profile service and the host for it:</p>
      <pre class="prettyprint">namespace ProductsServer
{
    using System;
    using System.Linq;
    using System.Collections.Generic;
    using System.ServiceModel;

    // Implement the IProducts interface
    class ProductsService : IProducts
    {
        
        // Populate array of products for display on Web site
        ProductData[] products = 
            new []
                {
                    new ProductData{ Id = "1", Name = "Rock", 
                                     Quantity = "1"},
                    new ProductData{ Id = "2", Name = "Paper", 
                                     Quantity = "3"},
                    new ProductData{ Id = "3", Name = "Scissors", 
                                     Quantity = "5"},
                    new ProductData{ Id = "4", Name = "Well", 
                                     Quantity = "2500"},
                };

        // Display a message in the service console application 
        // when the list of products is retrieved
        public IList&lt;ProductData&gt; GetProducts()
        {
            Console.WriteLine("GetProducts called.");
            return products;
        }

    }

    class Program
    {
        // Define the Main() function in the service application
        static void Main(string[] args)
        {
            var sh = new ServiceHost(typeof(ProductsService));
            sh.Open();

            Console.WriteLine("Press ENTER to close");
            Console.ReadLine();

            sh.Close();
        }
    }
}
</pre>
    </li>
    <li>
      <p>In <strong>Solution Explorer</strong>, double click the <strong>app.config </strong>file to open it in the <strong>Visual Studio </strong>editor. Replace the contents of <strong>&lt;system.ServiceModel&gt; </strong>with the following XML code. Be sure to replace <em>yourServiceNamespace</em> with the name of your service namespace, and <em>yourIssuerSecret</em> with the key you retrieved earlier from the Windows Azure Management Portal:</p>
      <pre class="prettyprint">&lt;system.serviceModel&gt;
  &lt;extensions&gt;
     &lt;behaviorExtensions&gt;
        &lt;add name="transportClientEndpointBehavior" type="Microsoft.ServiceBus.Configuration.TransportClientEndpointBehaviorElement, Microsoft.ServiceBus, Version=1.6.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/&gt;
      &lt;/behaviorExtensions&gt;
      &lt;bindingExtensions&gt;
         &lt;add name="netTcpRelayBinding" type="Microsoft.ServiceBus.Configuration.NetTcpRelayBindingCollectionElement, Microsoft.ServiceBus, Version=1.6.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/&gt;
      &lt;/bindingExtensions&gt;
  &lt;/extensions&gt;
  &lt;services&gt;
     &lt;service name="ProductsServer.ProductsService"&gt;
       &lt;endpoint address="sb://<em>yourServiceNamespace</em>.servicebus.windows.net/products" binding="netTcpRelayBinding" contract="ProductsServer.IProducts"
behaviorConfiguration="products"/&gt;
     &lt;/service&gt;
  &lt;/services&gt;
  &lt;behaviors&gt;
     &lt;endpointBehaviors&gt;
       &lt;behavior name="products"&gt;
         &lt;transportClientEndpointBehavior&gt;
            &lt;tokenProvider&gt;
               &lt;sharedSecret issuerName="owner" issuerSecret="<em>yourIssuerSecret</em>" /&gt;
            &lt;/tokenProvider&gt;
         &lt;/transportClientEndpointBehavior&gt;
       &lt;/behavior&gt;
     &lt;/endpointBehaviors&gt;
  &lt;/behaviors&gt;
&lt;/system.serviceModel&gt;
</pre>
    </li>
    <li>Press <strong>F6</strong> to build the application to verify the accuracy of your work so far.</li>
  </ol>
  <h2>CREATE AN ASP.NET MVC 3 APPLICATION</h2>
  <p>In this section you will build a simple MVC 3 application that will display data retrieved from your product service.</p>
  <h3>CREATE THE PROJECT</h3>
  <ol>
    <li>Using administrator privileges, launch either Microsoft Visual Studio 2010 or Microsoft Visual Web Developer Express 2010. To launch Visual Studio with administrator privileges, right-click <strong>Microsoft Visual Studio 2010 (or Microsoft Visual Web Developer Express 2010)</strong> and then click Run as administrator. The Windows Azure compute emulator, discussed later in this guide, requires that Visual Studio be launched with administrator privileges.</li>
    <li>In Visual Studio, on the <strong>File</strong> menu, click <strong>New</strong>, and then click <strong>Project</strong>.</li>
    <li>
      <p>From <strong>Installed Templates</strong>, under <strong> Visual C#</strong>, click <strong>ASP.NET MVC 3 Web Application</strong>. Name the project <strong> ProductsPortal</strong>. Then click <strong>OK</strong>.</p>
      <img src="../../../DevCenter/dotNet/Media/hy-web-2.jpg" />
    </li>
    <li>
      <p>From the <strong>Select a template</strong> list, click <strong>Internet Application</strong>, then click <strong>OK</strong>.</p>
      <img src="../../../DevCenter/dotNet/Media/hy-web-4.jpg" />
    </li>
    <li>
      <p>In <strong>Solution Explorer</strong>, right click <strong>Models</strong> and click <strong>Add</strong>, then click <strong>Class</strong>. In the <strong>Name</strong> box, type the name <strong>Product.cs</strong>. Then click <strong>Add</strong>.</p>
      <img src="../../../DevCenter/dotNet/Media/hy-web-7.jpg" />
    </li>
  </ol>
  <h3>MODIFY THE WEB APPLICATION</h3>
  <ol>
    <li>
      <p>In the Product.cs file in Visual Studio, replace the existing namespace definition with the following code:</p>
      <pre class="prettyprint">// Declare properties for the products inventory
namespace ProductsWeb.Models
{
    public class Product
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Quantity { get; set; }
    }
}
</pre>
    </li>
    <li>
      <p>In the HomeController.cs file in Visual Studio, replace the existing namespace definition with the following code:</p>
      <pre class="prettyprint">namespace ProductsWeb.Controllers
{
    using System.Collections.Generic;
    using System.Web.Mvc;
    using Models;

    public class HomeController : Controller
    {
        // Return a view of the products inventory
        public ActionResult Index(string Identifier, string ProductName)
        {
            var products = new List&lt;Product&gt; 
                {new Product {Id = Identifier, Name = ProductName}};
            return View();
        }

    }
}</pre>
    </li>
    <li>
      <p>In the <strong>Solution Explorer</strong>, expand Views\Shared:</p>
      <img src="../../../DevCenter/dotNet/Media/hy-web-10.jpg" />
    </li>
    <li>
      <p>Next, change the page title by replacing the header text in _Layout.cshtml with the text "LITWARE'S Products". Double-click _Layout.cshtml to open it in the Visual Studio editor.</p>
    </li>
    <li>
      <p>Within the body tag, find the title of the page enclosed in h1 tags. Change the title text from My MVC Application to LITWARE's Products. Here is where you type this in:</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-8.png" />
    </li>
    <li>
      <p>In <strong>Solution Explorer</strong>, expand Views\Home:</p>
      <img src="../../../DevCenter/dotNet/Media/hy-web-11.jpg" />
    </li>
    <li>
      <p>Double-click Index.cshtml to open it in the Visual Studio editor. Replace the entire contents of the file with the following code:</p>
      <pre class="prettyprint">@model IEnumerable&lt;ProductsWeb.Models.Product&gt;
@{
  ViewBag.Title = "Product Inventory";
}
&lt;h2&gt;Product Inventory&lt;/h2&gt;
&lt;table&gt;
&lt;tr&gt;
  &lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Quantity&lt;/th&gt;
&lt;/tr&gt;
@foreach (var item in Model)
{
  &lt;tr&gt;
  &lt;td&gt;@item.Name&lt;/td&gt;
  &lt;td&gt;@item.Quantity&lt;/td&gt;
&lt;/tr&gt;
}
&lt;/table&gt;

</pre>
    </li>
    <li>To verify the accuracy of your work so far, you can press <strong>F6</strong> or <strong>Ctrl+Shift+B</strong> to build the project.</li>
  </ol>
  <h3>RUN YOUR APPLICATION LOCALLY</h3>
  <p>Run the application to verify that it works.</p>
  <ol>
    <li>Ensure that <strong>ProductsPortal</strong> is the active project. Right-click the project name in <strong>Solution Explorer</strong> and select <strong>Set As Startup Project</strong></li>
    <li>Within <strong>Visual Studio</strong>, press <strong>F5</strong>.</li>
    <li>
      <p>Your application should appear running in a browser:</p>
      <img src="../../../DevCenter/dotNet/Media/App1.png" />
      <h2>MAKE YOUR APPLICATION READY TO DEPLOY TO WINDOWS AZURE</h2>
      <p>Now, you will prepare your application to run in a Windows Azure hosted service. Your application already includes a Windows Azure deployment project. The deployment project contains configuration information that is needed to properly run your application in the cloud.</p>
      <ol>
        <li>
          <p>To make your application deployable to the cloud, right-click the <strong>ProductsPortal</strong> project in <strong>Solution Explorer</strong> and click <strong>Add Windows Azure Deployment Project</strong>.</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-hybrid-21.png" />
        </li>
        <li>To test your application, press <strong>F5</strong>.</li>
        <li>
          <p>This will start the Windows Azure compute emulator. The compute emulator uses the local computer to emulate your application running in Windows Azure. You can confirm the emulator has started by looking at the system tray:</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-hybrid-22.png" />
        </li>
        <li>A browser will still display your application running locally, and it will look and function the same way it did when you ran it earlier as a regular ASP.NET MVC 3 application.</li>
      </ol>
      <h2>PUT THE PIECES TOGETHER</h2>
      <p>The next step is to hook up the on-premises products server with the ASP.NET MVC3 application.</p>
      <ol>
        <li>
          <p>If it is not already open, in Visual Studio re-open the <strong>ProductsPortal</strong> project you created in the “Creating an ASP.NET MVC 3 Application” section.</p>
        </li>
        <li>
          <p>Similar to the step in the “Create an On-Premises Server” section, add the NuGet package to the project References. In Solution Explorer, right-click <strong>References</strong>, then click <strong>Manage NuGet Packages</strong>.</p>
        </li>
        <li>
          <p>Search for "WindowsAzure.ServiceBus" and select the <strong>Windows Azure Service Bus</strong> item. Then complete the installation and close this dialog.</p>
        </li>
        <li>
          <p>In Solution Explorer, right-click the <strong>ProductsPortal</strong> project, then click <strong>Add</strong>, then <strong>Existing Item</strong>.</p>
        </li>
        <li>
          <p>Navigate to the <strong>ProductsContract.cs</strong> file from the <strong>ProductsServer</strong> console project. Click to highlight ProductsContract.cs. Click the down arrow next to <strong>Add</strong>, then click <strong>Add as Link</strong>.</p>
          <img src="../../../DevCenter/dotNet/Media/hy-web-12.jpg" />
        </li>
        <li>
          <p>Now open the <strong>HomeController.cs</strong> file in the Visual Studio editor and replace the namespace definition with the following code. Be sure to replace <em>yourServiceNamespace</em> with the name of your service namespace, and <em>yourIssuerSecret</em> with your key. This will allow the client to call the on-premises service, returning the result of the call.</p>
          <pre class="prettyprint">using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProductsWeb.Controllers
{
    using System.Linq;
    using System.ServiceModel;
    using System.Web.Mvc;
    using Microsoft.ServiceBus;
    using Models;
    using ProductsServer;

    public class HomeController : Controller
    {
        // Declare the channel factory
        static ChannelFactory&lt;IProductsChannel&gt; channelFactory;

        static HomeController()
        {
            // Create shared secret token credentials for authentication 
            channelFactory = new ChannelFactory&lt;IProductsChannel&gt;(new NetTcpRelayBinding(), 
                "sb://<em>yourServiceNamespace</em>.servicebus.windows.net/products");
            channelFactory.Endpoint.Behaviors.Add(new TransportClientEndpointBehavior { 
                TokenProvider = TokenProvider.CreateSharedSecretTokenProvider(
                    "owner", "<em>yourIssuerSecret</em>") });
        }

        public ActionResult Index()
        {
            using (IProductsChannel channel = channelFactory.CreateChannel())
            {
                // Return a view of the products inventory
                return this.View(from prod in channel.GetProducts()
                                 select
                                     new Product { Id = prod.Id, Name = prod.Name, 
                                         Quantity = prod.Quantity });
            }
        }
    }
}
</pre>
        </li>
        <li>
          <p>In Solution Explorer, right-click on the <strong>ProductsPortal</strong> solution, click <strong>Add</strong>, then click <strong>Existing Project</strong>.</p>
        </li>
        <li>
          <p>Navigate to the <strong>ProductsServer</strong> project, then double-click the <strong>ProductsServer.csproj</strong> solution file to add it.</p>
        </li>
        <li>
          <p>In Solution Explorer, right-click the <strong>ProductsPortal</strong> solution and click <strong>Properties</strong>.</p>
        </li>
        <li>
          <p>On the left-hand side, click <strong>Startup Project</strong>. On the right-hand side, cick <strong>Multiple startup projects</strong>. Ensure that <strong>ProductsServer</strong>, <strong>ProductsPortal.Azure</strong>, and <strong>ProductsPortal</strong> appear, in that order, with <strong>Start</strong> set as the action for <strong>ProductsServer</strong> and <strong>ProductsPortal.Azure</strong>, and <strong>None</strong> set as the action for <strong>ProductsPortal</strong>. For example:</p>
          <img src="../../../DevCenter/dotNet/Media/hy-web-13.jpg" />
        </li>
        <li>
          <p>Still in the Properties dialog, click <strong>ProjectDependencies</strong> on the left-hand side.</p>
        </li>
        <li>
          <p>In the <strong>Project Dependencies</strong> dropdown, click <strong>ProductsServer</strong>. Ensure that <strong>ProductsPortal</strong> is unchecked, and <strong> ProductsPortal.Azure </strong>is checked. Then click <strong>OK</strong>:</p>
          <img src="../../../DevCenter/dotNet/Media/hy-web-14.jpg" />
        </li>
      </ol>
      <h2>RUN THE APPLICATION</h2>
      <ol>
        <li>
          <p>From the <strong>File</strong> menu in Visual Studio, click <strong>Save All</strong>.</p>
        </li>
        <li>
          <p>Press <strong>F5</strong> to build and run the application. The on-premises server (the <strong> ProductsServer</strong> console application) should start first, then the <strong>ProductsWeb</strong> application should start in a browser window, as shown in the screenshot below. This time, you will see that the product inventory lists data retrieved from the product service on-premises system.</p>
          <img src="../../../DevCenter/dotNet/Media/App2.png" />
        </li>
      </ol>
      <h2>DEPLOY YOUR APPLICATION TO WINDOWS AZURE</h2>
      <ol>
        <li>
          <p>Right-click on the <strong>ProductsPortal</strong> project in <strong>Solution Explorer</strong> and click <strong>Publish to Windows Azure</strong>.</p>
        </li>
        <li>
          <p>The first time you publish to Windows Azure, you will first have to download credentials via the link provided in Visual Studio.</p>
          <p>Click <strong>Sign in to download credentials</strong>:</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-hybrid-33.png" />
        </li>
        <li>
          <p>Sign-in using your Live ID:</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-hybrid-34.png" />
        </li>
        <li>
          <p>Save the publish profile file to a location on your hard drive where you can retrieve it:</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-hybrid-25.png" />
        </li>
        <li>
          <p>Within the publish dialog, click on <strong>Import</strong>:</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-hybrid-36.png" />
        </li>
        <li>Browse for and select the file that you just downloaded, then click <strong>Next</strong>.</li>
        <li>
          <p>Pick the Windows Azure subscription you would like to publish to:</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-hybrid-37.png" />
        </li>
        <li>
          <p>7.If your subscription doesn’t already contain any hosted services, you will be asked to create one. The hosted service acts as a container for your application within your Windows Azure subscription. Enter a name that identifies your application and choose the region for which the application should be optimized. (You can expect faster loading times for users accessing it from this region.)</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-hybrid-38.png" />
        </li>
        <li>
          <p>Select the hosted service you would like to publish your application to. Keep the defaults as shown below for the remaining settings. Click <strong>Next</strong>:</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-hybrid-39.png" />
        </li>
        <li>
          <p>On the last page, click <strong>Publish</strong> to start the deployment process:</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-hybrid-40.png" />
          <p>This will take approximately 5-7 minutes. Since this is the first time you are publishing, Windows Azure provisions a virtual machine (VM), performs security hardening, creates a Web role on the VM to host your application, deploys your code to that Web role, and finally configures the load balancer and networking so your application is available to the public.</p>
        </li>
        <li>
          <p>While publishing is in progress you will be able to monitor the activity in the <strong>Windows Azure Activity Log</strong> window, which is typically docked to the bottom of Visual Studio or Visual Web Developer:</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-hybrid-41.png" />
        </li>
        <li>
          <p>When deployment is complete, you can view your Web site by clicking the <strong>Website URL </strong>link in the monitoring window.</p>
          <img src="../../../DevCenter/dotNet/Media/App3.png" />
          <p>Your Web site depends on your on-premises server, so you must run the <strong> ProductsServer </strong>application locally for the Web site to function properly. As you perform requests on the cloud Web site, you will see requests coming into your on-premises console application, as indicated by the "GetProducts called" output displayed in the screenshot below.</p>
          <img src="../../../DevCenter/dotNet/Media/hy-service1.png" />
        </li>
      </ol>
      <h2>STOP AND DELETE YOUR APPLICATION</h2>
      <p>After deploying your application, you may want to disable it so you can build and deploy other applications within the free 750 hours/month (31 days/month) of server time.</p>
      <p>Windows Azure bills web role instances per hour of server time consumed. Server time is consumed once your application is deployed, even if the instances are not running and are in the stopped state. A free account includes 750 hours/month (31 days/month) of dedicated virtual machine server time for hosting these web role instances.</p>
      <p>The following steps show you how to stop and delete your application.</p>
      <ol>
        <li>
          <p>Login to the Windows Azure Platform Management Portal, http://windows.azure.com, and click on Hosted Sevices, Storage Accounts &amp; CDN, then Hosted Services:</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-hybrid-39.png" />
        </li>
        <li>
          <p>Click on Stop to temporarily suspend your application. You will be able to start it again just by clicking on Start. Click on Delete to completely remove your application from Windows Azure with no ability to restore it.</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-hybrid-40.png" />
        </li>
      </ol>
    </li>
  </ol>
</body>