<?xml version="1.0" encoding="utf-8"?>
<body>
  <properties linkid="dev-net-e2e-multi-tier" urlDisplayName="Multi-Tier Application" headerExpose="" pageTitle=".NET Multi-Tier Application" metaKeywords="Azure Service Bus queue tutorial, Azure queue tutorial, Azure worker role tutorial, Azure .NET Service Bus queue tutorial, Azure .NET queue tutorial, Azure .NET worker role tutorial, Azure C# Service Bus queue tutorial, Azure C# queue tutorial, Azure C# worker role tutorial " footerExpose="" metaDescription="An end-to-end tutorial that helps you develop a multi-tier application in Windows Azure that includes web and worker roles and uses Service Bus queues to communicate between tiers." umbracoNaviHide="0" disqusComments="1" />
  <h1>.NET Multi-Tier Application Using Service Bus Queues</h1>
  <p>Developing for Windows Azure is easy using Visual Studio 2010 and the free Windows Azure SDK for .NET. If you do not already have Visual Studio 2010, the SDK will automatically install Visual Web Developer 2010 Express, so you can start developing for Windows Azure entirely for free. This guide assumes you have no prior experience using Windows Azure. On completing this guide, you will have an application that uses multiple Windows Azure resources running in your local environment and demonstrating how a multi-tier application works.</p>
  <p>You will learn:</p>
  <ul>
    <li>How to enable your computer for Windows Azure development with a single download and install.</li>
    <li>How to use Visual Studio to develop for Windows Azure.</li>
    <li>How to create a multi-tier application in Windows Azure using web and worker roles.</li>
    <li>How to communicate between tiers using Service Bus Queues.</li>
  </ul>
  <p>You will build a front-end ASP.NET MVC web role that uses a back-end worker role to process long running jobs. You will learn how to create multi-role solutions, as well as how to use Service Bus Queues to enable inter-role communication. A screenshot of the completed application is shown below:</p>
  <p>
    <img src="../../../DevCenter/dotNet/media/getting-started-multi-tier-01.png" />
  </p>
  <h2>Scenario Overview: Inter-Role Communication</h2>
  <p>To submit an order for processing, the front end UI component, running in the web role, needs to interact with the middle tier logic running in the worker role. This example uses Service Bus brokered messaging for the communication between the tiers.</p>
  <p>Using brokered messaging between the web and middle tiers decouples the two components. In contrast to direct messaging (that is, TCP or HTTP), the web tier does not connect to the middle tier directly; instead it pushes units of work, as messages, into the Service Bus, which reliably retains them until the middle tier is ready to consume and process them.</p>
  <p>The Service Bus provides two entities to support brokered messaging, queues and topics. With queues, each message sent to the queue is consumed by a single receiver. Topics support the publish/subscribe pattern in which each published message is made available to each subscription registered with the topic. Each subscription logically maintains its own queue of messages. Subscriptions can also be configured with filter rules that restrict the set of messages passed to the subscription queue to those that match the filter. This example uses Service Bus queues.</p>
  <p>
    <img src="../../../DevCenter/dotNet/media/getting-started-multi-tier-100.png" width="600" height="295" />
  </p>
  <p>This communication mechanism has several advantages over direct messaging, namely:</p>
  <ul>
    <li>
      <p>
        <strong>Temporal decoupling.</strong> With the asynchronous messaging pattern, producers and consumers need not be online at the same time. Service Busreliably stores messages until the consuming party is ready to receive them. This allows the components of the distributed application to be disconnected, either voluntarily, for example, for maintenance, or due to a component crash, without impacting the system as a whole. Furthermore, the consuming application may only need to come online during certain times of the day.</p>
    </li>
    <li>
      <p>
        <strong>Load leveling</strong>. In many applications, system load varies over time whereas the processing time required for each unit of work is typically constant. Intermediating message producers and consumers with a queue means that the consuming application (the worker) only needs to be provisioned to accommodate average load rather than peak load. The depth of the queue will grow and contract as the incoming load varies. This directly saves money in terms of the amount of infrastructure required to service the application load.</p>
    </li>
    <li>
      <p>
        <strong>Load balancing.</strong> As load increases, more worker processes can be added to read from the queue. Each message is processed by only one of the worker processes. Furthermore, this pull-based load balancing allows for optimum utilization of the worker machines even if the worker machines differ in terms of processing power as they will pull messages at their own maximum rate. This pattern is often termed the competing consumer pattern.</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/getting-started-multi-tier-101.png" width="600" height="387" />
      </p>
    </li>
  </ul>
  <p>The following sections discuss the code that implements this architecture.</p>
  <h2>Set Up the Development Environment</h2>
  <p>Before you can begin developing your Windows Azure application, you need to get the tools and set-up your development environment.</p>
  <ol>
    <li>
      <p>To install the Windows Azure SDK for .NET, click the button below:</p>
      <a href="http://go.microsoft.com/fwlink/?LinkID=234939&amp;clcid=0x409" class="site-arrowboxcta download-cta">Get Tools and SDK</a>
      <p>When prompted to run or save WindowsAzureSDKForNet.exe, click <strong>Run</strong>:</p>
      <img src="../../../DevCenter/dotNet/media/getting-started-3.png" />
    </li>
    <li>
      <p>Click <strong>Install </strong>in the installer window and proceed with the installation:</p>
      <img src="../../../DevCenter/dotNet/media/getting-started-4.png" />
    </li>
    <li>
      <p>Once the installation is complete, you will have everything necessary to start developing. The SDK includes tools that let you easily develop Windows Azure applications in Visual Studio. If you do not have Visual Studio installed, it also installs the free Visual Web Developer Express.</p>
    </li>
  </ol>
  <h2>Create a Windows Azure Account</h2>
  <ol>
    <li>
      <p>Open a web browser, and browse to <a href="http://www.windowsazure.com" target="_blank">http://www.windowsazure.com</a>.</p>
      <p>To get started with a free account, click <strong>free trial </strong>in the upper right corner and follow the steps.</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/getting-started-12.png" />
      </p>
    </li>
    <li>
      <p>Your account is now created. You are ready to deploy your application to Windows Azure!</p>
    </li>
  </ol>
  <h2>
    <a name="create-namespace">
    </a>Set up the Service Bus Namespace</h2>
  <p>The next step is to create a service namespace, and to obtain a shared secret key. A service namespace provides an application boundary for each application exposed through Service Bus. A shared secret key is automatically generated by the system when a service namespace is created. The combination of service namespace and shared secret key provides a credential for Service Bus to authenticate access to an application.</p>
  <ol>
    <li>
      <p>Log into the <a href="http://windows.azure.com" target="_blank">Windows Azure Platform Management Portal</a>.</p>
    </li>
    <li>
      <p>In the lower left navigation pane of the Management Portal, click <strong>Service Bus, Access Control &amp; Caching</strong>.</p>
    </li>
    <li>
      <p>In the upper left pane of the Management Portal, click the <strong>Service Bus</strong> node, then click <strong>New</strong>.</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/sb-queues-03.png" />
      </p>
    </li>
    <li>
      <p>In the <strong>Create a new Service Namespace</strong> dialog, enter a namespace, and then to make sure that it is unique, click <strong>Check Availability</strong>. <br /><img src="../../../DevCenter/dotNet/media/sb-queues-04.png" /></p>
    </li>
    <li>
      <p>After making sure the namespace name is available, choose the country or region in which your namespace should be hosted (make sure you use the same country/region in which you are deploying your compute resources), and then click <strong>Create Namespace</strong>. Also, choose a country/region from the dropdown, a connection pack size, and the name of the subscription you want to use:</p>
      <p>IMPORTANT: Pick the <strong>same region</strong> that you intend to choose for deploying your application. This will give you the best performance.</p>
    </li>
    <li>
      <p>Click <strong>Create Namespace</strong>. The system now creates your service namespace and enables it. You might have to wait several minutes as the system provisions resources for your account.</p>
    </li>
    <li>
      <p>In the main window, click the name of your service namespace.</p>
    </li>
    <li>
      <p>In the <strong>Properties</strong> pane on the right-hand side, find the <strong>Default Key</strong> entry.</p>
    </li>
    <li>
      <p>In Default Key, click <strong>View</strong>. Make a note of the key, or copy it to the clipboard.</p>
    </li>
  </ol>
  <h2>Create a Web Role</h2>
  <p>In this section, you will build the front end of your application. You will first create the various pages that your application displays. After that, you will add the code for submitting items to a Service Bus Queue and displaying status information about the queue.</p>
  <h3>Create the Project</h3>
  <ol>
    <li>
      <p>Using administrator privileges, start either Microsoft Visual Studio 2010 or Microsoft Visual Web Developer Express 2010. To start Visual Studio with administrator privileges, right-click <strong>Microsoft Visual Studio 2010 (or Microsoft Visual Web Developer Express 2010)</strong> and then click Run as administrator. The Windows Azure compute emulator, discussed later in this guide, requires that Visual Studio be launched with administrator privileges.</p>
      <p>In Visual Studio, on the <strong>File</strong> menu, click <strong>New</strong>, and then click <strong>Project</strong>.</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/getting-started-multi-tier-09.png" />
      </p>
    </li>
    <li>
      <p>From <strong>Installed Templates</strong>, under <strong>Visual C#</strong>, click Cloud and then click <strong>Windows Azure Project</strong>. Name the project <strong>MultiTierApp</strong>. Then click <strong>OK</strong>.</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/getting-started-multi-tier-10.jpg" width="597" height="368" />
      </p>
    </li>
    <li>
      <p>From <strong>.NET Framework 4</strong> roles, double-click <strong>ASP.NET MVC 3 Web Role</strong>.</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/getting-started-multi-tier-11.png" />
      </p>
    </li>
    <li>
      <p>Hover over <strong>MvcWebRole1</strong> under <strong>Windows Azure solution</strong>, click the pencil icon, and rename the web role to <strong>FrontendWebRole</strong>.</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/getting-started-multi-tier-02.png" />
      </p>
    </li>
    <li>
      <p>From the <strong>Select a template</strong> list, click <strong>Internet Application</strong>, then click <strong>OK</strong>.</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/getting-started-multi-tier-12.png" />
      </p>
    </li>
    <li>
      <p>In <strong>Solution Explorer</strong>, right-click <strong>References</strong>, then click <strong>Manage NuGet Packages...</strong> or <strong>Add Library Package Reference</strong>.</p>
    </li>
    <li>
      <p>Select <strong>Online</strong> on the left-hand side of the dialog. Search for ‘<strong>WindowsAzure.ServiceBus</strong>’ and select the <strong>Windows Azure.Service Bus</strong> item. Then complete the installation and close this dialog.</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/getting-started-multi-tier-13.png" />
      </p>
    </li>
    <li>
      <p>Note that the required client assemblies are now referenced and some new code files have been added.</p>
    </li>
    <li>
      <p>In <strong>Solution Explorer</strong>, right click <strong>Models</strong> and click <strong>Add</strong>, then click <strong>Class</strong>. In the Name box, type the name <strong>OnlineOrder.cs</strong>. Then click <strong>Add</strong>.</p>
    </li>
  </ol>
  <h3>Write the Web Code for Your Web Role</h3>
  <p>In this section, you will create the various pages that your application displays.</p>
  <ol>
    <li>
      <p>In the <strong>OnlineOrder.cs</strong> file in Visual Studio, replace the existing namespace definition with the following code:</p>
      <pre class="prettyprint">namespace FrontendWebRole.Models
{
    public class OnlineOrder
    {
        public string Customer { get; set; }
        public string Product { get; set; }
    }
}</pre>
    </li>
    <li>
      <p>In the <strong>Solution Explorer</strong>, double-click <strong>Controllers\HomeController.cs</strong>. Add the following <strong>using</strong> statements at the top of the file to include the namespaces for the model you just created, as well as Service Bus:</p>
      <pre class="prettyprint">using FrontendWebRole.Models;
using Microsoft.ServiceBus.Messaging;
using Microsoft.ServiceBus;</pre>
    </li>
    <li>
      <p>Also in the <strong>HomeController.cs</strong> file in Visual Studio, replace the existing namespace definition with the following code. This code contains methods for handling the submission of items to the queue:</p>
      <pre class="prettyprint">namespace FrontendWebRole.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            // Simply redirect to Submit, since Submit will serve as the
            // front page of this application
            return RedirectToAction("Submit");
        }

        public ActionResult About()
        {
            return View();
        }

        // GET: /Home/Submit
        // Controller method for a view you will create for the submission
        // form
        public ActionResult Submit()
        {
            // Will put code for displaying queue message count here.

            return View();
        }

        // POST: /Home/Submit
        // Controler method for handling submissions from the submission
        // form 
        [HttpPost]
        public ActionResult Submit(OnlineOrder order)
        {
            if (ModelState.IsValid)
            {
                // Will put code for submitting to queue here.
            
                return RedirectToAction("Submit");
            }
            else
            {
                return View(order);
            }
        }
    }
}</pre>
    </li>
    <li>
      <p>Now, you will create the view for the <strong>Submit()</strong> method you created above. Right-click within the Submit() method, and choose <strong>Add View</strong></p>
      <p>
        <img src="../../../DevCenter/dotNet/media/getting-started-multi-tier-33.png" />
      </p>
    </li>
    <li>
      <p>Build the application (F6).</p>
    </li>
    <li>
      <p>A dialog appears for creating the view. Click the checkbox for <strong>Create a strongly-typed view</strong>. In addition, select the <strong>OnlineOrder</strong> class in the <strong>Model class</strong> dropdown, and choose <strong>Create</strong> under the <strong>Scaffold template</strong> dropdown.</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/getting-started-multi-tier-34.png" />
      </p>
    </li>
    <li>
      <p>Click <strong>Add</strong>.</p>
    </li>
    <li>
      <p>Now, you will change the displayed name of your application. In the <strong>Solution Explorer</strong>, double-click the <strong>Views\Shared\_Layout.cshtml </strong>file to open it in the Visual Studio editor.</p>
    </li>
    <li>
      <p>Locate <strong>&lt;h1&gt;My MVC Application&lt;/h1&gt;</strong>, and replace it with <strong>&lt;h1&gt;LITWARE'S Awesome Products&lt;/h1&gt;</strong>:</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/getting-started-multi-tier-35.png" />
      </p>
    </li>
    <li>
      <p>Finally, tweak the submission page to include some information about the queue. In the <strong>Solution Explorer</strong>, double-click the <strong>Views\Home\Submit.cshtml</strong> file to open it in the Visual Studio editor. Add the following line after <strong>&lt;h2&gt;Submit&lt;/h2&gt;</strong>. For now, the <strong>ViewBag.MessageCount</strong> is empty. You will populate it later.</p>
      <pre class="prettyprint">&lt;p&gt;Current Number of Orders in Queue Waiting to be Processed: @ViewBag.MessageCount&lt;/p&gt;
     </pre>
    </li>
    <li>
      <p>You now have implemented your UI. You can press <strong>F5</strong> to run your application and confirm it looks as expected.</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/getting-started-multi-tier-36.png" />
      </p>
    </li>
  </ol>
  <h3>Write the Code for Submitting Items to a Service Bus Queue</h3>
  <p>Now, you will add code for submitting items to a queue. You will first create a class that contains your Service Bus Queue connection information. Then, you will initialize your connection from <strong>Global.aspx.cs</strong>. Finally, you will update the submission code you created earlier in <strong>HomeController.cs</strong> to actually submit items to a Service Bus Queue.</p>
  <ol>
    <li>
      <p>In Solution Explorer, right-click <strong>FrontendWebRole</strong>. Click <strong>Add</strong>, and then click <strong>Class</strong>.</p>
    </li>
    <li>
      <p>Name the class <strong>QueueConnector.cs</strong>.</p>
    </li>
    <li>
      <p>You will now paste in code that encapsulates your connection information and contains methods for initializing the connection to a Service Bus Queue. Paste in the following code, and enter in values for <strong>Namespace</strong>, <strong>IssuerName</strong>, and <strong>IssuerKey</strong>. You can find these values in the <a href="http://windows.azure.com">Management Portal</a>.</p>
      <pre class="prettyprint">using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.ServiceBus.Messaging;
using Microsoft.ServiceBus;

namespace FrontendWebRole
{
    public static class QueueConnector
    {
        // Thread-safe. Recommended that you cache rather than recreating it
        // on every request.
        public static QueueClient OrdersQueueClient;

        // Obtain these values from the Management Portal
        public const string Namespace = "&lt;your service bus namespace&gt;";
        public const string IssuerName = "&lt;issuer name&gt;";
        public const string IssuerKey = "&lt;issuer key&gt;";

        // The name of your queue
        public const string QueueName = "OrdersQueue";

        public static NamespaceManager CreateNamespaceManager()
        {
            // Create the namespace manager which gives you access to
            // management operations
            var uri = ServiceBusEnvironment.CreateServiceUri(
                "sb", Namespace, String.Empty);
            var tP = TokenProvider.CreateSharedSecretTokenProvider(
                IssuerName, IssuerKey);
            return new NamespaceManager(uri, tP);
        }

        public static void Initialize()
        {
            // Using Http to be friendly with outbound firewalls
            ServiceBusEnvironment.SystemConnectivity.Mode = 
                ConnectivityMode.Http;

            // Create the namespace manager which gives you access to 
            // management operations
            var namespaceManager = CreateNamespaceManager();

            // Create the queue if it does not exist already
            if (!namespaceManager.QueueExists(QueueName))
            {
                namespaceManager.CreateQueue(QueueName);
            }

            // Get a client to the queue
            var messagingFactory = MessagingFactory.Create(
                namespaceManager.Address, 
                namespaceManager.Settings.TokenProvider);
            OrdersQueueClient = messagingFactory.CreateQueueClient(
                "OrdersQueue");
        }
    }
}</pre>
    </li>
    <li>
      <p>Now, you will ensure your <strong>Initialize</strong> method gets called. In the <strong>Solution Explorer</strong>, double-click <strong>Global.asax\Global.asax.cs</strong>.</p>
    </li>
    <li>
      <p>Add the following line to the bottom of the <strong>Application_Start</strong> method:</p>
      <pre class="prettyprint">QueueConnector.Initialize();</pre>
    </li>
    <li>
      <p>Finally, you will update your web code you created earlier, to submit items to the queue. In the <strong>Solution Explorer</strong>, double-click <strong>Controllers\HomeController.cs</strong> that you created earlier.</p>
    </li>
    <li>
      <p>Update the <strong>Submit()</strong> method as follows to get the message count for the queue:</p>
      <pre class="prettyprint">public ActionResult Submit()
{            
    // Get a NamespaceManager which allows you to perform management and
    // diagnostic operations on your Service Bus Queues.
    var namespaceManager = QueueConnector.CreateNamespaceManager();

    // Get the queue, and obtain the message count.
    var queue = namespaceManager.GetQueue(QueueConnector.QueueName);
    ViewBag.MessageCount = queue.MessageCount;

    return View();
}</pre>
    </li>
    <li>
      <p>Update the <strong>Submit(OnlineOrder order)</strong> method as follows to submit order information to the queue:</p>
      <pre class="prettyprint">public ActionResult Submit(OnlineOrder order)
{
    if (ModelState.IsValid)
    {
        // Create a message from the order
        var message = new BrokeredMessage(order);
        
        // Submit the order
        QueueConnector.OrdersQueueClient.Send(message);
        return RedirectToAction("Submit");
    }
    else
    {
        return View(order);
    }
}</pre>
    </li>
    <li>
      <p>You can now run your application again. Each time you submit an order, you should see the message count increase.</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/getting-started-multi-tier-37.png" />
      </p>
    </li>
  </ol>
  <h2>Create the Worker Role</h2>
  <p>You will now create the worker role that will process the order submissions.</p>
  <ol>
    <li>
      <p>In Visual Studio, in <strong>Solution Explorer</strong> right-click the <strong>MultiTierApp</strong> solution, then click <strong>New Worker Role Project</strong>.</p>
    </li>
    <li>
      <p>In the <strong>Add New Role Project </strong>dialog, name the project <strong>OrderProcessingRole</strong>. Then click <strong>Add</strong>.</p>
    </li>
    <li>
      <p>In Visual Studio, in <strong>Solution Explorer</strong>, right-click <strong>References </strong>in the <strong>OrderProcessingRole </strong>project and add references to <strong>System.ServiceModel.dll</strong>, <strong>Microsoft.ServiceBus.dll </strong>and <strong>System.Runtime.Serialization.dll</strong>.</p>
    </li>
    <li>
      <p>Create a <strong>QueueConnector</strong> class to encapsulate the connection to the Service Bus Queue, as you did earlier. Rather than rewriting the code, you can copy the one you already created. Right-click <strong>OrderProcessingRole</strong>. Click <strong>Add</strong>, and then click <strong>Existing Item</strong>.</p>
    </li>
    <li>
      <p>Browse to the subfolder for <strong>FrontendWebRole</strong>, and double-click <strong>QueueConnector.cs</strong> to add it to this project.</p>
    </li>
    <li>
      <p>You now need an <strong>OnlineOrder</strong> class to represent the orders as you process them from the queue. Again, you can copy a class you have already created. Right-click <strong>OrderProcessingRole</strong>. Click <strong>Add</strong>, and then click <strong>Existing Item</strong>.</p>
    </li>
    <li>
      <p>Browse to the subfolder for <strong>FrontendWebRole\Models</strong>, and double-click <strong>OnlineOrder.cs</strong> to add it to this project.</p>
    </li>
    <li>
      <p>Finally, replace the code in <strong>WorkerRole.cs</strong> with the following. As you did earlier when initializing the queue for the front end, you also have the initialize the queue in the worker role. However, you now initialize it the <strong>OnStart()</strong> method of your worker role, as compared to the <strong>Application_Start</strong> method of your web role. Once your queue is initialized, you receive messages by calling the <strong>Receive()</strong> method in a loop. Once you process the message, you finally remove it from the queue by calling <strong>Complete()</strong>.</p>
      <pre class="prettyprint">using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Threading;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Diagnostics;
using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using FrontendWebRole;
using FrontendWebRole.Models;

namespace OrderProcessingRole
{
    public class WorkerRole : RoleEntryPoint
    {
        public override void Run()
        {
            while (true)
            {
                // Receive the message
                BrokeredMessage receivedMessage = 
                    QueueConnector.OrdersQueueClient.Receive();
                if (receivedMessage != null)
                {
                    try
                    {
                        // View the message as an OnlineOrder
                        OnlineOrder order = receivedMessage.GetBody&lt;OnlineOrder&gt;();
                        Trace.WriteLine(
                            order.Customer + ": " + order.Product, 
                            "ProcessingMessage");

                        // Remove it from the queue
                        receivedMessage.Complete();
                    }
                    catch (MessagingException)
                    {
                        receivedMessage.Abandon();
                    }
                }
                else
                {
                    Thread.Sleep(10000);
                }
            }
        }

        public override bool OnStart()
        {
            // Set the maximum number of concurrent connections 
            ServicePointManager.DefaultConnectionLimit = 12;

            // Initialize the connection to a Service Bus Queue
            QueueConnector.Initialize();

            return base.OnStart();
        }
    }
}</pre>
    </li>
    <li>
      <p>You have completed the application. You can test the full application as you did earlier, by pressing F5. You will notice now, however, that the message count rarely goes above 1 or 2. This is because the worker role is processing items from the queue and marking them as complete. You can see the trace output of your worker role by viewing the Windows Azure Compute Emulator UI. You can do this by right-clicking the emulator icon in the notification area of your taskbar and selecting <strong>Show Compute Emulator UI</strong>.</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/getting-started-multi-tier-38.png" />
      </p>
      <p>
        <img src="../../../DevCenter/dotNet/media/getting-started-multi-tier-39.png" />
      </p>
    </li>
  </ol>
</body>