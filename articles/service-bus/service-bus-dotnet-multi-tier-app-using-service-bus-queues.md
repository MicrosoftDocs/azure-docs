<properties
	pageTitle=".NET multi-tier application | Microsoft Azure"
	description="A tutorial that helps you develop a multi-tier app in Azure that uses Service Bus queues to communicate between tiers. Samples in .NET."
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
	ms.topic="hero-article"
	ms.date="07/02/2015"
	ms.author="sethm"/>

# .NET multi-tier application using Azure Service Bus queues

## Introduction

Developing for Microsoft Azure is easy using Visual Studio 2013 and the free Azure SDK for .NET. If you do not already have Visual Studio 2013, the SDK will automatically install Visual Studio Express, so you can start developing for Azure entirely for
free. This article assumes you have no prior experience using Azure. After completing this tutorial, you will have an application that uses
multiple Azure resources running in your local environment and
that demonstrates how a multi-tier application works.

You will learn:

-   How to enable your computer for Azure development with a
    single download and install.
-   How to use Visual Studio to develop for Azure.
-   How to create a multi-tier application in Azure using web
    and worker roles.
-   How to communicate between tiers using Service Bus queues.

[AZURE.INCLUDE [create-account-note](../../includes/create-account-note.md)]

In this tutorial you'll build and run the multi-tier application in an Azure cloud service. The front end will be an ASP.NET MVC web role and the back end will be a worker-role. You can create the same multi-tier application with the front end as a web project that is deployed to an Azure website instead of a cloud service. For instructions about what to do differently on an Azure website front end, see the [Next steps](#nextsteps) section.

The following screen shot shows the completed application.

![][0]

> [AZURE.NOTE] Azure also provides storage queue functionality. For more information about Azure storage queues and Service Bus queues, see [Azure Queues and Azure Service Bus Queues - Compared and Contrasted][sbqueuecomparison].  

## Scenario overview: Inter-role communication

To submit an order for processing, the front end UI component, running
in the web role, needs to interact with the middle tier logic running in
the worker role. This example uses Service Bus brokered messaging for
the communication between the tiers.

Using brokered messaging between the web and middle tiers decouples the
two components. In contrast to direct messaging (that is, TCP or HTTP),
the web tier does not connect to the middle tier directly; instead it
pushes units of work, as messages, into the Service Bus, which reliably
retains them until the middle tier is ready to consume and process them.

Service Bus provides two entities to support brokered messaging:
queues and topics. With queues, each message sent to the queue is
consumed by a single receiver. Topics support the publish/subscribe
pattern in which each published message is made available to a subscription registered with the topic. Each subscription logically
maintains its own queue of messages. Subscriptions can also be
configured with filter rules that restrict the set of messages passed to
the subscription queue to those that match the filter. The following example uses
Service Bus queues.

![][1]

This communication mechanism has several advantages over direct
messaging:

-   **Temporal decoupling.** With the asynchronous messaging pattern,
    producers and consumers need not be online at the same time. Service
    Bus reliably stores messages until the consuming party is ready to
    receive them. This allows the components of the distributed
    application to be disconnected, either voluntarily, for example, for
    maintenance, or due to a component crash, without impacting the
    system as a whole. Furthermore, the consuming application may only
    need to come online during certain times of the day.

-   **Load leveling.** In many applications, system load varies over
    time, while the processing time required for each unit of work is
    typically constant. Intermediating message producers and consumers
    with a queue means that the consuming application (the worker) only needs to be provisioned to accommodate average load rather than peak
    load. The depth of the queue will grow and contract as the incoming
    load varies. This directly saves money in terms of the amount of
    infrastructure required to service the application load.

-   **Load balancing.** As load increases, more worker processes can be
    added to read from the queue. Each message is processed by only one
    of the worker processes. Furthermore, this pull-based load balancing
    allows for optimum utilization of the worker machines even if the
    worker machines differ in terms of processing power as they will
    pull messages at their own maximum rate. This pattern is often
    termed the competing consumer pattern.

    ![][2]

The following sections discuss the code that implements this architecture.

## Set up the development environment

Before you can begin developing your Azure application, download the tools and set up your development environment:

1.  To install the Azure SDK for .NET, click the following link.

    [Get Tools and SDK][]

2. 	Click the link for the version of Visual Studio you are using. The steps in this tutorial use Visual Studio 2013.

	![][32]

4. 	When prompted to run or save the installation file, click
    **Run**.

    ![][3]

5.  In the Web Platform Installer, click **Install** and proceed with the installation.

    ![][33]

6.  Once the installation is complete, you have everything
    necessary to start developing the app. The SDK includes tools that enable you
    to develop Azure applications in Visual Studio. If you
    do not have Visual Studio installed, it also installs the free
    Visual Studio Express for Web.

## Set up the Service Bus namespace

The next step is to create a service namespace, and to obtain a Shared Access Signature (SAS) key. A service namespace provides an application boundary for
each application exposed through Service Bus. A SAS key is
generated by the system when a service namespace is
created. The combination of service namespace and SAS key
provides the credentials for Service Bus to authenticate access to an
application.

> [AZURE.NOTE] You can also manage namespaces and Service Bus messaging entities using the Visual Studio Server Explorer, but you can only create new namespaces from within the Azure portal.

### Set up the namespace using the Azure portal

1.  Log into the [Azure portal][].

2.  In the left navigation pane of the Azure portal, click
    **Service Bus**.

3.  In the lower pane of the Azure portal, click **Create**.

    ![][6]

4.  In the **Add a new namespace** page, enter a namespace name. The system immediately checks to see if the name is available.

    ![][7]

5.  After making sure the namespace name is available, choose the
    country or region in which your namespace should be hosted (make
    sure you use the same country/region in which you are deploying your
    compute resources). Also, make sure that you select **Messaging** in the namespace **Type** field, and **Standard** in the **Messaging Tier** field.

    > [AZURE.IMPORTANT] Pick the **same region** that you intend to choose to
    deploy your application. This will give you the best performance.

6.  Click the check mark. The system now creates your service
    namespace and enables it. You might have to wait several minutes as
    the system provisions resources for your account.

	![][27]

7.  In the main window, click the name of your service namespace.

	![][30]

8. Click **Connection Information**.

	![][31]

9.  In the **Access connection information** pane, find the connection string that contains the SAS key and key name.

    ![][35]

10.  Make a note of these credentials, or copy them to the clipboard.

## Create a web role

In this section, you will build the front end of your application. You
will first create the various pages that your application displays.
After that, you will add the code for submitting items to a Service Bus
queue and displaying status information about the queue.

### Create the project

1.  Using administrator privileges, start either Microsoft Visual Studio
    2013 or Microsoft Visual Studio Express. To start Visual
    Studio with administrator privileges, right-click **Microsoft Visual
    Studio 2013 (or Microsoft Visual Studio Express)** and
    then click **Run as administrator**. The Azure compute emulator,
    discussed later in this article, requires that Visual Studio be
    started with administrator privileges.

    In Visual Studio, on the **File** menu, click **New**, and then
    click **Project**.

    ![][8]

2.  From **Installed Templates**, under **Visual C#**, click **Cloud** and
    then click **Azure Cloud Service**. Name the project
    **MultiTierApp**. Then click **OK**.

    ![][9]

3.  From **.NET Framework 4.5** roles, double-click **ASP.NET Web
    Role**.

    ![][10]

4.  Hover over **WebRole1** under **Azure Cloud Service solution**, click
    the pencil icon, and rename the web role to **FrontendWebRole**. Then click **OK**. (Make sure you enter "Frontend" with a lower-case 'e,' not "FrontEnd".)

    ![][11]

5.  From the **New ASP.NET Project** dialog box, in the **Select a template** list, click **MVC**,
    then click **OK**.

    ![][12]

6.  In **Solution Explorer**, right-click **References**, then click
    **Manage NuGet Packages** or **Add Library Package Reference**.

7.  Select **Online** on the left side of the dialog box. Search for
    "**Service Bus**" and select the **Microsoft Azure Service
    Bus** item. Then complete the installation and close this dialog box.

    ![][13]

8.  Note that the required client assemblies are now referenced and some
    new code files have been added.

9.  In **Solution Explorer**, right-click **Models** and click **Add**,
    then click **Class**. In the **Name** box, type the name
    **OnlineOrder.cs**. Then click **Add**.

### Write the code for your web role

In this section, you will create the various pages that your application
displays.

1.  In the OnlineOrder.cs file in Visual Studio, replace the
    existing namespace definition with the following code:

        namespace FrontendWebRole.Models
        {
            public class OnlineOrder
            {
                public string Customer { get; set; }
                public string Product { get; set; }
            }
        }

2.  In **Solution Explorer**, double-click
    **Controllers\HomeController.cs**. Add the following **using**
    statements at the top of the file to include the namespaces for the
    model you just created, as well as Service Bus.

        using FrontendWebRole.Models;
        using Microsoft.ServiceBus.Messaging;
        using Microsoft.ServiceBus;

3.  Also in the HomeController.cs file in Visual Studio, replace the
    existing namespace definition with the following code. This code
    contains methods for handling the submission of items to the queue.

        namespace FrontendWebRole.Controllers
        {
            public class HomeController : Controller
            {
                public ActionResult Index()
                {
                    // Simply redirect to Submit, since Submit will serve as the
                    // front page of this application.
                    return RedirectToAction("Submit");
                }

                public ActionResult About()
                {
                    return View();
                }

                // GET: /Home/Submit.
                // Controller method for a view you will create for the submission
                // form.
                public ActionResult Submit()
                {
                    // Will put code for displaying queue message count here.

                    return View();
                }

                // POST: /Home/Submit.
                // Controller method for handling submissions from the submission
                // form.
                [HttpPost]
				// Attribute to help prevent cross-site scripting attacks and
				// cross-site request forgery.  
    			[ValidateAntiForgeryToken]
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
        }

4.  On the **Build** menu, click **Build Solution** to test the accuracy of your work so far.

5.  Now, you will create the view for the **Submit()** method you
    created earlier. Right-click within the **Submit()** method, and then choose
    **Add View**.

    ![][14]

6.  A dialog box appears for creating the view. In the **Template** list, choose **Create**. In the **Model class** list, click the **OnlineOrder** class.

    ![][15]

7.  Click **Add**.

8.  Now, change the displayed name of your application. In **Solution Explorer**, double-click the
    **Views\Shared\\_Layout.cshtml** file to open it in the Visual
    Studio editor.

9.  Replace all occurrences of **My ASP.NET Application** with
    **LITWARE'S Products**.

10. Remove the **Home**, **About**, and **Contact** links. Delete the highlighted code:

	![][28]

11. Finally, modify the submission page to include some information about
    the queue. In **Solution Explorer**, double-click the
    **Views\Home\Submit.cshtml** file to open it in the Visual Studio
    editor. Add the following line after **&lt;h2>Submit&lt;/h2>**. For now,
    the **ViewBag.MessageCount** is empty. You will populate it later.

        <p>Current number of orders in queue waiting to be processed: @ViewBag.MessageCount</p>

12. You now have implemented your UI. You can press **F5** to run your
    application and confirm that it looks as expected.

    ![][17]

### Write the code for submitting items to a Service Bus queue

Now, you will add code for submitting items to a queue. You will first
create a class that contains your Service Bus queue connection
information. Then, you will initialize your connection from
Global.aspx.cs. Finally, you will update the submission code you
created earlier in HomeController.cs to actually submit items to a
Service Bus queue.

1.  In **Solution Explorer**, right-click **FrontendWebRole** (right-click the project, not the role). Click **Add**, and then click **Class**.

2.  Name the class QueueConnector.cs. Click **Add** to create the class.

3.  You will now add code that encapsulates the connection information and initializes the connection to a Service Bus queue. In QueueConnector.cs, add the following code, and enter values for **Namespace** (your service namespace) and **yourKey**, which is the SAS key you obtained from the [Azure portal][Azure portal] earlier.

        using System;
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

                // Obtain these values from the Azure portal.
                public const string Namespace = "your service bus namespace";

                // The name of your queue.
                public const string QueueName = "OrdersQueue";

                public static NamespaceManager CreateNamespaceManager()
                {
                    // Create the namespace manager which gives you access to
                    // management operations.
                    var uri = ServiceBusEnvironment.CreateServiceUri(
                        "sb", Namespace, String.Empty);
                    var tP = TokenProvider.CreateSharedAccessSignatureTokenProvider(
                        "RootManageSharedAccessKey", "yourKey");
                    return new NamespaceManager(uri, tP);
                }

                public static void Initialize()
                {
                    // Using Http to be friendly with outbound firewalls.
                    ServiceBusEnvironment.SystemConnectivity.Mode =
                        ConnectivityMode.Http;

                    // Create the namespace manager which gives you access to
                    // management operations.
                    var namespaceManager = CreateNamespaceManager();

                    // Create the queue if it does not exist already.
                    if (!namespaceManager.QueueExists(QueueName))
                    {
                        namespaceManager.CreateQueue(QueueName);
                    }

                    // Get a client to the queue.
                    var messagingFactory = MessagingFactory.Create(
                        namespaceManager.Address,
                        namespaceManager.Settings.TokenProvider);
                    OrdersQueueClient = messagingFactory.CreateQueueClient(
                        "OrdersQueue");
                }
            }
        }

    Note that later in this tutorial you will learn how to store the name of your **Namespace** and your SAS key value in a configuration file.

4.  Now, ensure that your **Initialize** method gets called. In **Solution Explorer**, double-click **Global.asax\Global.asax.cs**.

5.  Add the following line to the bottom of the **Application_Start**
    method.

        FrontendWebRole.QueueConnector.Initialize();

6.  Finally, update the web code you created earlier, to
    submit items to the queue. In **Solution Explorer**,
    double-click **Controllers\HomeController.cs**.

7.  Update the **Submit()** method as follows to get the message count
    for the queue.

        public ActionResult Submit()
        {
            // Get a NamespaceManager which allows you to perform management and
            // diagnostic operations on your Service Bus queues.
            var namespaceManager = QueueConnector.CreateNamespaceManager();

            // Get the queue, and obtain the message count.
            var queue = namespaceManager.GetQueue(QueueConnector.QueueName);
            ViewBag.MessageCount = queue.MessageCount;

            return View();
        }

8.  Update the **Submit(OnlineOrder order)** method as follows to submit
    order information to the queue.

        public ActionResult Submit(OnlineOrder order)
        {
            if (ModelState.IsValid)
            {
                // Create a message from the order.
                var message = new BrokeredMessage(order);

                // Submit the order.
                QueueConnector.OrdersQueueClient.Send(message);
                return RedirectToAction("Submit");
            }
            else
            {
                return View(order);
            }
        }

9.  You can now run the application again. Each time you submit an
    order, the message count increases.

    ![][18]

## Cloud configuration manager

The **GetSettings** method in the
**Microsoft.WindowsAzure.Configuration.CloudConfigurationManager** class
enables you to read configuration settings from the configuration store for your
platform. For example, if your code is running
in a web or worker role the **GetSettings** method reads the
ServiceConfiguration.cscfg file, and if your code is running in a standard
console app the **GetSettings** method reads the app.config file.

If you store a connection string for your Service Bus namespace in a
configuration file, you can use the **GetSettings** method to read a connection
string that you can use to instantiate a **NamespaceMananger** object. You can
use a **NamespaceMananger** instance to configure your Service Bus namespace
programmatically. You can use the same connection string to instantiate a client
objects (such as **QueueClient**, **TopicClient**, and **EventHubClient**
object) that you can use to perform runtime operations such as sending and
receiving messages.

### Connection string

To instantiate a client (for example, a Service Bus **QueueClient**), you can represent the configuration information as a connection string. On the client side, there is a `CreateFromConnectionString()` method that instantiates that client type by using that connection string. For example, given the following configuration section

	<ConfigurationSettings>
    ...
    	<Setting name="Microsoft.ServiceBus.ConnectionString" value="Endpoint=sb://[yourServiceNamespace].servicebus.windows.net/;SharedSecretIssuer=RootManageSharedAccessKey;SharedSecretValue=[yourKey]" />
	</ConfigurationSettings>

The following code retrieves the connection string, creates a queue, and initializes the connection to the queue.

	QueueClient Client;

	string connectionString =
     CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

    var namespaceManager =
     NamespaceManager.CreateFromConnectionString(connectionString);

	if (!namespaceManager.QueueExists(QueueName))
    {
        namespaceManager.CreateQueue(QueueName);
    }

	// Initialize the connection to Service Bus queue.
	Client = QueueClient.CreateFromConnectionString(connectionString, QueueName);

The code in the following section uses the **CloudConfigurationManager** class.

## Create the worker role

You will now create the worker role that processes the order
submissions. This example uses the **Worker Role with Service Bus Queue** Visual Studio project template. First, use Server Explorer in Visual Studio to obtain the required credentials.

1. Make sure you have connected Visual Studio to your Azure account.

2.  In Visual Studio, in **Solution Explorer** right-click the
    **Roles** folder under the **MultiTierApp** project.

3.  Click **Add**, and then click **New Worker Role Project**. The **Add New Role Project** dialog box appears.

	![][26]

4.  In the **Add New Role Project** dialog box, click **Worker Role with Service Bus Queue**.

	![][23]

5.  In the **Name** box, name the project **OrderProcessingRole**. Then click **Add**.

6.  In **Server Explorer**, right-click the name of your service namespace, then click **Properties**. In the Visual Studio **Properties** pane, the first entry contains a connection string that is populated with the namespace endpoint containing the required authorization credentials. For example, see the following screen shot. Double-click **ConnectionString**, and then press **Ctrl+C** to copy this string to the clipboard.

	![][24]

7.  In **Solution Explorer**, right-click the **OrderProcessingRole** you created in step 5 (make sure that you right-click **OrderProcessingRole** under **Roles**, and not the class). Then click **Properties**.

8.  On the **Settings** tab of the **Properties** dialog box, click inside the **Value** box for **Microsoft.ServiceBus.ConnectionString**, and then paste the endpoint value you copied in step 6.

	![][25]

9.  Create an **OnlineOrder** class to represent the orders as you process them from the queue. You can reuse a class you have already created. In **Solution Explorer**, right-click the **OrderProcessingRole** project (right-click the project, not the role). Click **Add**, then click **Existing Item**.

10. Browse to the subfolder for **FrontendWebRole\Models**, and then double-click **OnlineOrder.cs** to add it to this project.

11. In WorkerRole.cs, replace the value of the **QueueName** variable in **WorkerRole.cs** from `"ProcessingQueue"` to `"OrdersQueue"` as shown in the following code.

		// The name of your queue.
		const string QueueName = "OrdersQueue";

12. Add the following using statement at the top of the WorkerRole.cs file.

		using FrontendWebRole.Models;

13. In the `Run()` function, inside the `OnMessage` call, add the following code inside the `try` clause.

		Trace.WriteLine("Processing", receivedMessage.SequenceNumber.ToString());
		// View the message as an OnlineOrder.
		OnlineOrder order = receivedMessage.GetBody<OnlineOrder>();
		Trace.WriteLine(order.Customer + ": " + order.Product, "ProcessingMessage");
		receivedMessage.Complete();

14. You have completed the application. You can test the full
    application by right-clicking the MultiTierApp project in Solution Explorer,
    selecting **Set as Startup Project**, and then pressing F5. Note that the
    message count does not increment, because the worker role processes items
    from the queue and marks them as complete. You can see the trace output of
    your worker role by viewing the Azure Compute Emulator UI. You
    can do this by right-clicking the emulator icon in the notification
    area of your taskbar and selecting **Show Compute Emulator UI**.

    ![][19]

    ![][20]

## Next steps  

To learn more about Service Bus, see the following resources:  

* [Azure Service Bus][sbmsdn]  
* [Service Bus service page][sbwacom]  
* [How to Use Service Bus Queues][sbwacomqhowto]  

To learn more about multi-tier scenarios, or to learn how to deploy an application to a cloud service, see:  

* [.NET Multi-Tier Application Using Storage Tables, Queues, and Blobs][mutitierstorage]  

You might want to implement the front-end of a multi-tier application in an Azure website instead of an Azure cloud service. To learn more about the difference between websites and cloud services, see [Azure Execution Models][executionmodels].

To implement the application you create in this tutorial as a standard web project instead of as a cloud service web role, follow the steps in this tutorial with the following differences:

1. When you create the project, choose the **ASP.NET MVC Web Application** project template in the **Web** category instead of the **Cloud Service** template in the **Cloud** category. Then follow the same directions for creating the MVC application, until you get to the **Cloud configuration manager** section.

2. When you create the worker role, create it in a new, separate solution, similar to the original instructions for the web role. Now however, you're creating just the worker role in the cloud service project. Then follow the same directions for creating the worker role.

3. You can test the front-end and back-end separately, or you can run both simultaneously in separate Visual Studio instances.

To learn how to deploy the front end to an Azure website, see [Deploying an ASP.NET Web Application to an Azure Website](http://azure.microsoft.com/develop/net/tutorials/get-started/). To learn how to deploy the back end to an Azure cloud service, see [.NET Multi-Tier Application Using Storage Tables, Queues, and Blobs][mutitierstorage].


  [0]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-01.png
  [1]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-100.png
  [sbqueuecomparison]: service-bus-azure-and-service-bus-queues-compared-contrasted.md
  [2]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-101.png
  [Get Tools and SDK]: http://go.microsoft.com/fwlink/?LinkId=271920
  [3]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-3.png



  [Azure portal]: http://manage.windowsazure.com
  [6]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/sb-queues-03.png
  [7]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/sb-queues-04.png
  [8]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-09.png
  [9]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-10.png
  [10]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-11.png
  [11]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-02.png
  [12]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-12.png
  [13]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-13.png
  [14]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-33.png
  [15]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-34.png
  [16]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-35.png
  [17]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-36.png
  [18]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-37.png

  [19]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-38.png
  [20]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-39.png
  [23]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/SBWorkerRole1.png
  [24]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/SBExplorerProperties.png
  [25]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/SBWorkerRoleProperties.png
  [26]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/SBNewWorkerRole.png
  [27]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-27.png
  [28]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-40.png
  [30]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/sb-queues-09.png
  [31]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/sb-queues-06.png
  [32]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-41.png
  [33]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-4-2-WebPI.png
  [35]: ./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/multi-web-45.png
  [sbmsdn]: http://msdn.microsoft.com/library/azure/ee732537.aspx  
  [sbwacom]: /documentation/services/service-bus/  
  [sbwacomqhowto]: service-bus-dotnet-how-to-use-queues.md  
  [mutitierstorage]: https://code.msdn.microsoft.com/Windows-Azure-Multi-Tier-eadceb36
  [executionmodels]: ../cloud-services/fundamentals-application-models.md
