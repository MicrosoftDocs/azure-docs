---
title: .NET multi-tier application using Azure Service Bus | Microsoft Docs
description: A .NET tutorial that helps you develop a multi-tier app in Azure that uses Service Bus queues to communicate between tiers.
ms.devlang: csharp
ms.topic: article
ms.date: 04/30/2021
ms.custom: devx-track-csharp, devx-track-dotnet
---

# .NET multi-tier application using Azure Service Bus queues

Developing for Microsoft Azure is easy using Visual Studio and the free Azure SDK for .NET. This tutorial walks you through the steps to create an application that uses multiple Azure resources running in your local environment.

You'll learn the following:

* How to enable your computer for Azure development with a
  single download and install.
* How to use Visual Studio to develop for Azure.
* How to create a multi-tier application in Azure using web
  and worker roles.
* How to communicate between tiers using Service Bus queues.

[!INCLUDE [create-account-note](../../includes/create-account-note.md)]

In this tutorial, you'll build and run the multi-tier application in an Azure cloud service. The front end is an ASP.NET MVC web role and the back end is a worker-role that uses a Service Bus queue. You can create the same multi-tier application with the front end as a web project that is deployed to an Azure website instead of a cloud service. You can also try out the [.NET on-premises/cloud hybrid application](../azure-relay/service-bus-dotnet-hybrid-app-using-service-bus-relay.md) tutorial.

The following screenshot shows the completed application.

:::image type="content" source="./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-app.png" alt-text="Application's Submit page":::

## Scenario overview: inter-role communication
To submit an order for processing, the front-end UI component, running
in the web role, must interact with the middle tier logic running in
the worker role. This example uses Service Bus messaging for
the communication between the tiers.

Using Service Bus messaging between the web and middle tiers decouples the
two components. In contrast to direct messaging (that is, TCP or HTTP),
the web tier doesn't connect to the middle tier directly; instead it
pushes units of work, as messages, into Service Bus, which reliably
retains them until the middle tier is ready to consume and process them.

Service Bus provides two entities to support brokered messaging:
queues and topics. With queues, each message sent to the queue is
consumed by a single receiver. Topics support the publish/subscribe
pattern in which each published message is made available to a subscription registered with the topic. Each subscription logically
maintains its own queue of messages. Subscriptions can also be
configured with filter rules that restrict the set of messages passed to
the subscription queue to those that match the filter. The following example uses
Service Bus queues.

:::image type="content" source="./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-100.png" alt-text="Diagram showing the communication between the Web Role, Service Bus, and the Worker Role.":::

This communication mechanism has several advantages over direct
messaging:

* **Temporal decoupling.**  When you use the asynchronous messaging pattern, producers and consumers don't need to be online at the same time. Service  Bus reliably stores messages until the consuming party is ready to receive them. This enables the components of the distributed application to be disconnected, either voluntarily, for example, for maintenance, or due to a component crash, without impacting the system as a whole. Furthermore, the consuming application might only need to come online during certain times of the day.
* **Load leveling.** In many applications, system load varies over
  time, while the processing time required for each unit of work is
  typically constant. Intermediating message producers and consumers
  with a queue means that the consuming application (the worker) only needs to be provisioned to accommodate average load rather than peak
  load. The depth of the queue grows and contracts as the incoming
  load varies. This directly saves money in terms of the amount of
  infrastructure required to service the application load.
* **Load balancing.** As load increases, more worker processes can be
  added to read from the queue. Each message is processed by only one
  of the worker processes. Furthermore, this pull-based load balancing
  enables optimal use of the worker machines even if the
  worker machines differ in terms of processing power, as they'll
  pull messages at their own maximum rate. This pattern is often
  termed the *competing consumer* pattern.
  
    :::image type="content" source="./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-101.png" alt-text="Diagram showing the communication between the Web Role, the Service Bus, and two Worker Roles.":::
  
The following sections discuss the code that implements this architecture.

## Prerequisites
In this tutorial, you'll use Microsoft Entra authentication to create `ServiceBusClient` and `ServiceBusAdministrationClient` objects. You'll also use `DefaultAzureCredential` and to use it, you need to do the following steps to test the application locally in a development environment.

1. [Register an application in the Microsoft Entra ID](../active-directory/develop/quickstart-register-app.md).
1. [Add the application to the `Service Bus Data Owner` role](../role-based-access-control/role-assignments-portal.md).
1. Set the `AZURE-CLIENT-ID`, `AZURE-TENANT-ID`, AND `AZURE-CLIENT-SECRET` environment variables. For instructions, see [this article](/dotnet/api/overview/azure/identity-readme#environment-variables).

For a list of Service Bus built-in roles, see [Azure built-in roles for Service Bus](service-bus-managed-service-identity.md#azure-built-in-roles-for-azure-service-bus).

## Create a namespace

The first step is to create a *namespace*, and obtain a [Shared Access Signature (SAS)](service-bus-sas.md) key for that namespace. A namespace provides an application boundary for each application exposed through Service Bus. A SAS key is generated by the system when a namespace is created. The combination of namespace name and SAS key provides the credentials for Service Bus to authenticate access to an application.

[!INCLUDE [service-bus-create-namespace-portal](./includes/service-bus-create-namespace-portal.md)]

[!INCLUDE [get-namespace-connection-string](./includes/get-namespace-connection-string.md)]

## Create a web role

In this section, you build the front end of your application. First, you
create the pages that your application displays.
After that, add code that submits items to a Service Bus
queue and displays status information about the queue.

### Create the project

1. Using administrator privileges, start Visual
   Studio: right-click the **Visual Studio** program icon, and then select **Run as administrator**. The Azure Compute Emulator,
   discussed later in this article, requires that Visual Studio be
   started with administrator privileges.
   
   In Visual Studio, on the **File** menu, select **New**, and then
   select **Project**.
2. On the **Templates** page, follow these steps:
    1. Select **C#** for programming language.
    1. Select **Cloud** for the project type.
    1. Select **Azure Cloud Service**.
    1. Select **Next**. 
   
        :::image type="content" source="./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-10.png" alt-text="Screenshot of the New Project dialog box with Cloud selected and Azure Cloud Service Visual C# highlighted and outlined in red.":::
3.  Name the project **MultiTierApp**, select location for the project, and then select **Create**.

    :::image type="content" source="./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/project-name.png" alt-text="Specify project name.":::    
1. On the **Roles** page, double-click **ASP.NET Web  Role**, and select **OK**. 
   
    :::image type="content" source="./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-11.png" alt-text="Select Web Role":::
4. Hover over **WebRole1** under **Azure Cloud Service solution**, select
   the pencil icon, and rename the web role to **FrontendWebRole**. Then select **OK**. (Make sure you enter "Frontend" with a lower-case 'e,' not "FrontEnd".)
   
    :::image type="content" source="./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-02.png" alt-text="Screenshot of the New Microsoft Azure Cloud Service dialog box with the solution renamed to FrontendWebRole.":::
5. In the  **Create a new ASP.NET Web Application** dialog box, select **MVC**, and then select **Create**.
   
    :::image type="content" source="./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-12.png" alt-text="Screenshot of the New ASP.NET Project dialog box with MVC highlighted and outlined in red and the Change Authentication option outlined in red.":::
8. In **Solution Explorer**, in the **FrontendWebRole** project, right-click **References**, then select
   **Manage NuGet Packages**.
9. Select the **Browse** tab, then search for **Azure.Messaging.ServiceBus**. Select the **Azure.Messaging.ServiceBus** package, select **Install**, and accept the terms of use.
   
    :::image type="content" source="./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-13.png" alt-text="Screenshot of the Manage NuGet Packages dialog box with the Azure.Messaging.ServiceBus highlighted and the Install option outlined in red.":::

   Note that the required client assemblies are now referenced and some new code files have been added.
10. Follow the same steps to add the `Azure.Identity` NuGet package to the project.  
10. In **Solution Explorer**, expand **FronendWebRole**, right-click **Models** and select **Add**,
    then select **Class**. In the **Name** box, type the name
    **OnlineOrder.cs**. Then select **Add**.

### Write the code for your web role
In this section, you create the various pages that your application displays.

1. In the OnlineOrder.cs file in Visual Studio, replace the
   existing namespace definition with the following code:
   
   ```csharp
   namespace FrontendWebRole.Models
   {
       public class OnlineOrder
       {
           public string Customer { get; set; }
           public string Product { get; set; }
       }
   }
   ```
2. In **Solution Explorer**, double-click
   **Controllers\HomeController.cs**. Add the following **using**
   statements at the top of the file to include the namespaces for the
   model you just created, as well as Service Bus.
   
   ```csharp
    using FrontendWebRole.Models;
    using Azure.Messaging.ServiceBus;    
   ```
3. Also in the HomeController.cs file in Visual Studio, replace the
   existing namespace definition with the following code. This code
   contains methods for handling the submission of items to the queue.
   
   ```csharp
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
   ```
4. From the **Build** menu, select **Build Solution** to test the accuracy of your work so far.
5. Now, create the view for the `Submit()` method you
   created earlier. Right-click within the `Submit()` method (the overload of `Submit()` that takes no parameters) in the **HomeController.cs** file, and then choose **Add View**.
6. In the **Add New Scaffolded Item** dialog box, select **Add**. 
1. In the **Add View** dialog box, do these steps:
    1. In the **Template** list, choose **Create**. 
    1. In the **Model class** list, select the **OnlineOrder** class.
    1. Select **Add**. 
   
        :::image type="content" source="./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-34.png" alt-text="A screenshot of the Add View dialog box with the Template and Model class drop-down lists outlined in red.":::
8. Now, change the displayed name of your application. In **Solution Explorer**, double-click the
   **Views\Shared\\_Layout.cshtml** file to open it in the Visual
   Studio editor.
9. Replace all occurrences of **My ASP.NET Application** with
   **Northwind Traders Products**.
10. Remove the **Home**, **About**, and **Contact** links. Delete the highlighted code:
    
    :::image type="content" source="./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-40.png" alt-text="Screenshot of the code with three lines of  H T M L Action Link code highlighted.":::
11. Finally, modify the submission page to include some information about
    the queue. In **Solution Explorer**, double-click the
    **Views\Home\Submit.cshtml** file to open it in the Visual Studio
    editor. Add the following line after `<h2>Submit</h2>`. For now,
    the `ViewBag.MessageCount` is empty. You'll populate it later.
    
    ```html
    <p>Current number of orders in queue waiting to be processed: @ViewBag.MessageCount</p>
    ```
12. You now have implemented your UI. You can press **F5** to run your
    application and confirm that it looks as expected.
    
    :::image type="content" source="./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-app.png" alt-text="Screenshot of the application's Submit page.":::

### Write the code for submitting items to a Service Bus queue
Now, add code for submitting items to a queue. First, you
create a class that contains your Service Bus queue connection
information. Then, initialize your connection from
Global.aspx.cs. Finally, update the submission code you
created earlier in HomeController.cs to actually submit items to a
Service Bus queue.

1. In **Solution Explorer**, right-click **FrontendWebRole** (right-click the project, not the role). Select **Add**, and then select **Class**.
2. Name the class **QueueConnector.cs**. Select **Add** to create the class.
3. Now, add code that encapsulates the connection information and initializes the connection to a Service Bus queue. Replace the entire contents of QueueConnector.cs with the following code, and enter values for `your Service Bus namespace` (your namespace name) and `yourKey`, which is the **primary key** you previously obtained from the Azure portal.
   
   ```csharp
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Threading.Tasks;
    using Azure.Messaging.ServiceBus;
    using Azure.Messaging.ServiceBus.Administration;
       
   namespace FrontendWebRole
   {
        public static class QueueConnector
        {
            // object to send messages to a Service Bus queue
            internal static ServiceBusSender SBSender;
    
            // object to create a queue and get runtime properties (like message count) of queue
            internal static ServiceBusAdministrationClient SBAdminClient;
        
            // Fully qualified Service Bus namespace
            private const string FullyQualifiedNamespace = "<SERVICE BUS NAMESPACE NAME>.servicebus.windows.net";
            
            // The name of your queue.
            internal const string QueueName = "OrdersQueue";
        
            public static async Task Initialize()
            {
                // Create a Service Bus client that you can use to send or receive messages
                ServiceBusClient SBClient = new ServiceBusClient(FullyQualifiedNamespace, new DefaultAzureCredential());
        
                // Create a Service Bus admin client to create queue if it doesn't exist or to get message count
                SBAdminClient = new ServiceBusAdministrationClient(FullyQualifiedNamespace, new DefaultAzureCredential());
        
                // create the OrdersQueue if it doesn't exist already
                if (!(await SBAdminClient.QueueExistsAsync(QueueName)))
                {
                    await SBAdminClient.CreateQueueAsync(QueueName);
                }
        
                // create a sender for the queue 
                SBSender = SBClient.CreateSender(QueueName);    
            }
        }    
   }
   ```
4. Now, ensure that your **Initialize** method gets called. In **Solution Explorer**, double-click **Global.asax\Global.asax.cs**.
5. Add the following line of code at the end of the **Application_Start** method.
   
   ```csharp
    FrontendWebRole.QueueConnector.Initialize().Wait();
   ```
6. Finally, update the web code you created earlier, to
   submit items to the queue. In **Solution Explorer**,
   double-click **Controllers\HomeController.cs**.
7. Update the `Submit()` method (the overload that takes no parameters) as follows to get the message count
   for the queue.
   
   ```csharp
        public ActionResult Submit()
        {
            QueueRuntimeProperties properties = QueueConnector.adminClient.GetQueueRuntimePropertiesAsync(QueueConnector.queueName).Result;
            ViewBag.MessageCount = properties.ActiveMessageCount;

            return View();
        }
   ```
8. Update the `Submit(OnlineOrder order)` method (the overload that takes one parameter) as follows to submit
   order information to the queue.
   
   ```csharp
        public ActionResult Submit(OnlineOrder order)
        {
            if (ModelState.IsValid)
            {
                // create a message 
                var message = new ServiceBusMessage(new BinaryData(order));

                // send the message to the queue
                QueueConnector.sbSender.SendMessageAsync(message);

                return RedirectToAction("Submit");
            }
            else
            {
                return View(order);
            }
        }
   ```
9. You can now run the application again. Each time you submit an
   order, the message count increases.
   
    :::image type="content" source="./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-app2.png" alt-text="Screenshot of the application's Submit page with the message count incremented to 1.":::

## Create the worker role
You'll now create the worker role that processes the order
submissions. This example uses the **Worker Role with Service Bus Queue** Visual Studio project template. You already obtained the required credentials from the portal.

1. Make sure you have connected Visual Studio to your Azure account.
2. In Visual Studio, in **Solution Explorer** right-click the
   **Roles** folder under the **MultiTierApp** project.
3. Select **Add**, and then select **New Worker Role Project**. The **Add New Role Project** dialog box appears.

   :::image type="content" source="./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/SBNewWorkerRole.png" alt-text="Screenshot of the Solution Explorer pane with the New Worker Role Project option and Add option highlighted.":::
1. In the **Add New Role Project** dialog box, select **Worker Role**. Don't select **Worker Role with Service Bus Queue** as it generates code that uses the legacy Service Bus SDK. 
   
    :::image type="content" source="./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/SBWorkerRole1.png" alt-text="Screenshot of the Ad New Role Project dialog box with the Worker Role with Service Bus Queue option highlighted and outlined in red.":::
5. In the **Name** box, name the project **OrderProcessingRole**. Then select **Add**.
1. In **Solution Explorer**, right-click **OrderProcessingRole** project, and select **Manage NuGet Packages**.
9. Select the **Browse** tab, then search for **Azure.Messaging.ServiceBus**. Select the **Azure.Messaging.ServiceBus** package, select **Install**, and accept the terms of use.
   
    :::image type="content" source="./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-13.png" alt-text="Screenshot of the Manage NuGet Packages dialog box with the Azure.Messaging.ServiceBus highlighted and the Install option outlined in red.":::
1. Follow the same steps to add the `Azure.Identity` NuGet package to the project.  
1. Create an **OnlineOrder** class to represent the orders as you process them from the queue. You can reuse a class you have already created. In **Solution Explorer**, right-click the **OrderProcessingRole** class (right-click the class icon, not the role). Select **Add**, then select **Existing Item**.
1. Browse to the subfolder for **FrontendWebRole\Models**, and then double-click **OnlineOrder.cs** to add it to this project.
1. Add the following `using` statement to the **WorkerRole.cs** file in the **OrderProcessingRole** project. 

    ```csharp
    using FrontendWebRole.Models;
    using Azure.Messaging.ServiceBus;
    using Azure.Messaging.ServiceBus.Administration; 
    ```    
1. In **WorkerRole.cs**, add the following properties. 

    > [!IMPORTANT]
    > Use the connection string for the namespace you noted down as part of prerequisites. 

    ```csharp
        // Fully qualified Service Bus namespace
        private const string FullyQualifiedNamespace = "<SERVICE BUS NAMESPACE NAME>.servicebus.windows.net";

        // The name of your queue.
        private const string QueueName = "OrdersQueue";

        // Service Bus Receiver object to receive messages message the specific queue
        private ServiceBusReceiver SBReceiver;

    ```
1. Update the `OnStart` method to create a `ServiceBusClient` object and then a `ServiceBusReceiver` object to receive messages from the `OrdersQueue`. 
    
    ```csharp
        public override bool OnStart()
        {
            // Create a Service Bus client that you can use to send or receive messages
            ServiceBusClient SBClient = new ServiceBusClient(FullyQualifiedNamespace, new DefaultAzureCredential());

            CreateQueue(QueueName).Wait();

            // create a receiver that we can use to receive the message
            SBReceiver = SBClient.CreateReceiver(QueueName);

            return base.OnStart();
        }
        private async Task CreateQueue(string queueName)
        {
            // Create a Service Bus admin client to create queue if it doesn't exist or to get message count
            ServiceBusAdministrationClient SBAdminClient = new ServiceBusAdministrationClient(FullyQualifiedNamespace, new DefaultAzureCredential());

            // create the OrdersQueue if it doesn't exist already
            if (!(await SBAdminClient.QueueExistsAsync(queueName)))
            {
                await SBAdminClient.CreateQueueAsync(queueName);
            }
        }
    ```
12. Update the `RunAsync` method to include the code to receive messages. 

    ```csharp
        private async Task RunAsync(CancellationToken cancellationToken)
        {
            // TODO: Replace the following with your own logic.
            while (!cancellationToken.IsCancellationRequested)
            {
                // receive message from the queue
                ServiceBusReceivedMessage receivedMessage = await SBReceiver.ReceiveMessageAsync();

                if (receivedMessage != null)
                {
                    Trace.WriteLine("Processing", receivedMessage.SequenceNumber.ToString());

                    // view the message as an OnlineOrder
                    OnlineOrder order = receivedMessage.Body.ToObjectFromJson<OnlineOrder>();
                    Trace.WriteLine(order.Customer + ": " + order.Product, "ProcessingMessage");

                    // complete message so that it's removed from the queue
                    await SBReceiver.CompleteMessageAsync(receivedMessage);
                }
            }
        }
    ```
14. You've completed the application. You can test the full
    application by right-clicking the MultiTierApp project in Solution Explorer,
    selecting **Set as Startup Project**, and then pressing F5. The
    message count doesn't increment, because the worker role processes items
    from the queue and marks them as complete. You can see the trace output of
    your worker role by viewing the Azure Compute Emulator UI. You
    can do this by right-clicking the emulator icon in the notification
    area of your taskbar and selecting **Show Compute Emulator UI**.
    
    :::image type="content" source="./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-38.png" alt-text="Screenshot of what appears when you select the emulator icon. Show Compute Emulator UI is in the list of options.":::
    
    :::image type="content" source="./media/service-bus-dotnet-multi-tier-app-using-service-bus-queues/getting-started-multi-tier-39.png" alt-text="Screenshot of the Microsoft Azure Compute Emulator (Express) dialog box.":::

## Next steps
To learn more about Service Bus, see the following resources:  

* [Get started using Service Bus queues][sbacomqhowto]
* [Service Bus service page][sbacom]  


[sbacom]: https://azure.microsoft.com/services/service-bus/  
[sbacomqhowto]: service-bus-dotnet-get-started-with-queues.md  
