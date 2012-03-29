# NET Multi-Tier Application Using Service Bus Queues
 
Developing for Windows Azure is easy using Visual Studio 2010 and the free Windows Azure SDK for .NET. If you do not already have Visual Studio 2010, the SDK will automatically install Visual Web Developer 2010 Express, so you can start developing for Windows Azure entirely for free. This guide assumes you have no prior experience using Windows Azure. On completing this guide, you will have an application that uses multiple Windows Azure resources running in your local environment and demonstrating how a multi-tier application works.
 
You will learn:

* How to enable your computer for Windows Azure development with a single download and install.
* How to use Visual Studio to develop for Windows Azure.
* How to create a multi-tier application in Windows Azure using web and worker roles.
* How to communicate between tiers using Service Bus Queues.
 
You will build a front-end ASP.NET MVC web role that uses a back-end worker role to process long running jobs. You will learn how to create multi-role solutions, as well as how to use Service Bus Queues to enable inter-role communication. A screenshot of the completed application is shown below:

![screenshot of website] [Image1]

## Scenario Overview: Inter-Role Communication
 
To submit an order for processing, the front end UI component, running in the web role, needs to interact with the middle tier logic running in the worker role. This example uses Service Bus brokered messaging for the communication between the tiers.
 
Using brokered messaging between the web and middle tiers decouples the two components. In contrast to direct messaging (that is, TCP or HTTP), the web tier does not connect to the middle tier directly; instead it pushes units of work, as messages, into the Service Bus, which reliably retains them until the middle tier is ready to consume and process them.
 
The Service Bus provides two entities to support brokered messaging, queues and topics. With queues, each message sent to the queue is consumed by a single receiver. Topics support the publish/subscribe pattern in which each published message is made available to each subscription registered with the topic. Each subscription logically maintains its own queue of messages. Subscriptions can also be configured with filter rules that restrict the set of messages passed to the subscription queue to those that match the filter. This example uses Service Bus queues.

![Interrole communication diagram] [Image2]

This communication mechanism has several advantages over direct messaging, namely:

* **Temporal decoupling.** With the asynchronous messaging pattern, producers and consumers need not be online at the same time. Service Busreliably stores messages until the consuming party is ready to receive them. This allows the components of the distributed application to be disconnected, either voluntarily, for example, for maintenance, or due to a component crash, without impacting the system as a whole. Furthermore, the consuming application may only need to come online during certain times of the day.

* **Load leveling.** In many applications, system load varies over time whereas the processing time required for each unit of work is typically constant. Intermediating message producers and consumers with a queue means that the consuming application (the worker) only needs to be provisioned to accommodate average load rather than peak load. The depth of the queue will grow and contract as the incoming load varies. This directly saves money in terms of the amount of infrastructure required to service the application load.

* **Load balancing.** As load increases, more worker processes can be added to read from the queue. Each message is processed by only one of the worker processes. Furthermore, this pull-based load balancing allows for optimum utilization of the worker machines even if the worker machines differ in terms of processing power as they will pull messages at their own maximum rate. This pattern is often termed the competing consumer pattern.

![Inter-role communication diagram 2][Image3]

The following sections discuss the code that implements this architecture.
 
## Set Up the Development Environment
 
Before you can begin developing your Windows Azure application, you need to get the tools and set-up your development environment.

1. To install the Windows Azure SDK for .NET, click the button below:
<a href="http://go.microsoft.com/fwlink/?LinkID=234939&clcid=0x409">![Get Tools and SDK link button][Image4]</a><br />
When prompted to run or save WindowsAzureSDKForNet.exe, click **Run**:
![Installer UI][Image5]
2. Click **Install** in the installer window and proceed with the installation:
![Installer UI after beginning install][Image6]
3. Once the installation is complete, you will have everything necessary to start developing. The SDK includes tools that let you easily develop Windows Azure applications in Visual Studio. If you do not have Visual Studio installed, it also installs the free Visual Web Developer Express.

## Create a Windows Azure Account

1. Open a web browser, and browse to [http://www.windowsazure.com][].
To get started with a free account, click free trial in the upper right corner and follow the steps.
![Free trial screenshot][Image7]
2. Your account is now created. You are ready to deploy your application to Windows Azure!
 
## Set up the Service Bus Namespace
 
The next step is to create a service namespace, and to obtain a shared secret key. A service namespace provides an application boundary for each application exposed through Service Bus. A shared secret key is automatically generated by the system when a service namespace is created. The combination of service namespace and shared secret key provides a credential for Service Bus to authenticate access to an application.

1. Log into the Windows Azure Platform Management Portal.
2. In the lower left navigation pane of the Management Portal, click **Service Bus, Access Control & Caching**.
3. In the upper left pane of the Management Portal, click the **Service Bus** node, then click **New**.
![Management Portal New Service Bus][Image8]
4. In the **Create a new Service Namespace** dialog, enter a namespace, and then to make sure that it is unique, click **Check Availability**. 
![Management Portal Service Bus Check Availability][Image9]
5. After making sure the namespace name is available, choose the country or region in which your namespace should be hosted (make sure you use the same country/region in which you are deploying your compute resources), and then click **Create Namespace**. Also, choose a country/region from the dropdown, a connection pack size, and the name of the subscription you want to use.<br /><br />
**IMPORTANT:** Pick the same region that you intend to choose for deploying your application. This will give you the best performance.

6. Click Create Namespace. The system now creates your service namespace and enables it. You might have to wait several minutes as the system provisions resources for your account.
7. In the main window, click the name of your service namespace.
8. In the **Properties** pane on the right-hand side, find the **Default Key** entry.
9. In **Default Key**, click **View**. Make a note of the key, or copy it to the clipboard.


[http://www.windowsazure.com]: http://www.windowsazure.com


[Image1]: media/net/dev-net-getting-started-multi-tier-01.png
[Image2]: media/net/dev-net-getting-started-multi-tier-100.png
[Image3]: media/net/dev-net-getting-started-multi-tier-101.png
[Image4]: media/net/installbutton.png
[Image5]: media/net/dev-net-getting-started-3.png
[Image6]: media/net/dev-net-getting-started-4.png
[Image7]: media/net/dev-net-getting-started-12.png
[Image8]: media/net/dev-net-how-to-sb-queues-03.png
[Image9]: media/net/dev-net-how-to-sb-queues-04.png
