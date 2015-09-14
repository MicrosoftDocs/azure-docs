<properties
	pageTitle="Hybrid on-premises/cloud application (.NET) | Microsoft Azure"
	description="Learn how to create a .NET on-premises/cloud hybrid application using the Azure Service Bus relay."
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
	ms.topic="get-started-article"
	ms.date="06/02/2015"
	ms.author="sethm"/>

# .NET on-premises/cloud hybrid application using Azure Service Bus relay

## Introduction

Developing hybrid cloud applications with Microsoft Azure is easy using
Visual Studio 2013 and the free Azure SDK for .NET. This article
assumes you have no prior experience using Azure. In less than
30 minutes, you will have an application that uses multiple Azure resources up and running in the cloud.

You will learn:

-   How to create or adapt an existing web service for consumption by a
    web solution.
-   How to use the Azure Service Bus relay to share data between
    an Azure application and a web service hosted elsewhere.

[AZURE.INCLUDE [create-account-note](../../includes/create-account-note.md)]

## How the Service Bus relay helps with hybrid solutions

Business solutions are typically composed of a combination of custom
code written to tackle new and unique business requirements and existing
functionality provided by solutions and systems that are already in
place.

Solution architects are starting to use the cloud for easier handling of
scale requirements and lower operational costs. In doing so, they find
that existing service assets they'd like to leverage as building blocks
for their solutions are inside the corporate firewall and out of easy
reach for access by the cloud solution. Many internal services are not
built or hosted in a way that they can be easily exposed at the
corporate network edge.

The Service Bus relay is designed for the use-case of taking existing
Windows Communication Foundation (WCF) web services and making those
services securely accessible to solutions that reside outside the
corporate perimeter without requiring intrusive changes to the corporate
network infrastructure. Such Service Bus relay services are still hosted
inside their existing environment, but they delegate listening for
incoming sessions and requests to the cloud-hosted Service Bus. Service Bus also protects those services from unauthorized access by using [Shared Access Signature](https://msdn.microsoft.com/library/dn170478.aspx) (SAS) authentication.

## Solution scenario

In this tutorial, you will create an ASP.NET MVC website that enables you to see a list of products on the product inventory page.

![][0]

The tutorial assumes that you have product information in an existing
on-premises system, and uses the Service Bus relay to reach into that
system. This is simulated by a web service that runs in a simple
console application and is backed by an in-memory set of products. You
will be able to run this console application on your own computer and
deploy the web role into Azure. By doing so, you will see how
the web role running in the Azure datacenter will indeed call
into your computer, even though your computer will almost certainly
reside behind at least one firewall and a network address translation
(NAT) layer.

The following is a screen shot of the start page of the completed web application.

![][1]

## Set up the development environment

Before you can begin developing your Azure application, get the tools and set up your development environment.

1.  Install the Azure SDK for .NET at [Get Tools and SDK][].

2. 	Click **Install the SDK** for the version of Visual Studio you are using. The steps in this tutorial use Visual Studio 2013.

	![][42]

4.  When prompted to run or save the installer, click **Run**.

    ![][2]

5.  In the **Web Platform Installer**, click **Install** and proceed with the installation.

    ![][3]

6.  Once the installation is complete, you will have everything
    necessary to start to develop the app. The SDK includes tools that let you
    easily develop Azure applications in Visual Studio. If you
    do not have Visual Studio installed, the SDK also installs the free
    Visual Studio Express.

## Create a service namespace

To begin using Service Bus features in Azure, you must first create a service namespace. A namespace provides a scoping container for addressing Service Bus resources within your application.

You can manage namespaces and Service Bus messaging entities using either the [Azure portal][] or the Visual Studio Server Explorer, but you can only create new namespaces from within the portal.

### To create a namespace using the portal:

1.  Sign in to the [Azure portal][].

2.  In the left navigation pane of the Azure portal, click
    **Service Bus**.

3.  In the lower pane of the Azure portal, click **Create**.

    ![][5]

4.  In the **Add a new namespace** dialog box, enter a namespace name.
    The system immediately checks to see if the name is available.
    ![][6]

5.  After making sure the namespace name is available, choose the
    country or region in which your namespace should be hosted (make
    sure you use the same country/region in which you are deploying your
    compute resources).

    > [AZURE.IMPORTANT] Pick the *same region* that you intend to choose for
    deploying your application. This will give you the best performance.

6.	Leave the other fields in the dialog box with their default values (**Messaging** and **Standard** tier), then click the check mark. The system now creates your namespace and enables it. You might have to wait several minutes as the system provisions resources for your account.

	![][38]

The namespace you created will appear in the Azure portal, though it may take a moment to activate. Wait until the status is **Active** before moving on.

## Obtain the default management credentials for the namespace

In order to perform management operations on the new namespace, such as creating messaging entities, you must obtain credentials for the namespace.

1.  In the main window, click the name of your service namespace.

	![][39]

2.  Click **Connection Information**.

	![][40]

3.  In the **Access connection information** pane, find the connection string that contains the SAS key and key name.

	![][45]

4.  Make a note of these credentials, or copy them to the clipboard.

## Create an on-premises server

First, you will build a (mock) on-premises product catalog system. It
will be fairly simple; you can see this as representing an actual
on-premises product catalog system with a complete service surface that
we're trying to integrate.

This project starts as a Visual Studio console application. The
project uses the Service Bus NuGet package to include the service bus
libraries and configuration settings. The NuGet Visual Studio extension
makes it easy to install and update libraries and tools in Visual Studio
and Visual Studio Express. The Service Bus NuGet package is the easiest
way to get the Service Bus API and to configure your application with
all of the Service Bus dependencies. For details about using NuGet and
the Service Bus package, see [Using the NuGet Service Bus Package][].

### Create the project

1.  Using administrator privileges, start either Microsoft Visual
    Studio 2013 or Microsoft Visual Studio Express. To
    start Visual Studio with administrator privileges, right-click
    **Microsoft Visual Studio 2013 (or Microsoft Visual Studio Express)** and then click **Run as administrator**.

2.  In Visual Studio, on the **File** menu, click **New**, and then
    click **Project**.

    ![][10]

3.  From **Installed Templates**, under **Visual C#**, click **Console
    Application**. In the **Name** box, type the name
    **ProductsServer**:

    ![][11]

4.  Click **OK** to create the **ProductsServer** project.

5.  In Solution Explorer, right-click **ProductsServer**, and then
    click **Properties**.

6.  Click the **Application** tab on the left, then ensure that **.NET
    Framework 4** or **.NET Framework 4.5** appears in the **Target framework** list. If not, select it from the list and then click **Yes** when prompted to reload the project.

    ![][12]

7.  If you have already installed the NuGet package manager for Visual Studio, skip to the next step. Otherwise, visit [NuGet][] and click [Install NuGet](http://visualstudiogallery.msdn.microsoft.com/27077b70-9dad-4c64-adcf-c7cf6bc9970c). Follow the prompts to install the NuGet package manager, then re-start Visual Studio.

7.  In Solution Explorer, right-click **References**, then click
    **Manage NuGet Packages**.

8.  In the left column of the **NuGet** dialog box, click **Online**.

9. 	In the right-hand column, click the **Search** box, type "**Service Bus**" and then select the **Microsoft
    Azure Service Bus** item. Click **Install** to complete the
    installation, then close the dialog box.

    ![][13]

    Note that the required client assemblies are now referenced.

9.  Add a new class for your product contract. In Solution Explorer,
    right-click the **ProductsServer** project and click **Add**, and then click
    **Class**.

    ![][14]

10. In the **Name** box, type the name **ProductsContract.cs**. Then
    click **Add**.

11. In **ProductsContract.cs**, replace the namespace definition with
    the following code, which defines the contract for the service.

        namespace ProductsServer
        {
            using System.Collections.Generic;
            using System.Runtime.Serialization;
            using System.ServiceModel;

            // Define the data contract for the service
            [DataContract]
            // Declare the serializable properties.
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
                IList<ProductData> GetProducts();

            }

            interface IProductsChannel : IProducts, IClientChannel
            {
            }
        }

12. In Program.cs, replace the namespace definition with the following
    code, which adds the profile service and the host for it.

        namespace ProductsServer
        {
            using System;
            using System.Linq;
            using System.Collections.Generic;
            using System.ServiceModel;

            // Implement the IProducts interface.
            class ProductsService : IProducts
            {

                // Populate array of products for display on website.
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
                // when the list of products is retrieved.
                public IList<ProductData> GetProducts()
                {
                    Console.WriteLine("GetProducts called.");
                    return products;
                }

            }

            class Program
            {
                // Define the Main() function in the service application.
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

13. In Solution Explorer, double-click the **App.config** file to
    open it in the Visual Studio editor. Replace the contents of
    **&lt;system.ServiceModel&gt;** with the following XML code. Be sure to
    replace *yourServiceNamespace* with the name of your service
    namespace, and *yourKey* with the SAS key you retrieved earlier
    from the Azure portal:

        <system.serviceModel>
          <extensions>
             <behaviorExtensions>
                <add name="transportClientEndpointBehavior" type="Microsoft.ServiceBus.Configuration.TransportClientEndpointBehaviorElement, Microsoft.ServiceBus, Version=2.6.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
              </behaviorExtensions>
              <bindingExtensions>
                 <add name="netTcpRelayBinding" type="Microsoft.ServiceBus.Configuration.NetTcpRelayBindingCollectionElement, Microsoft.ServiceBus, Version=2.6.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
              </bindingExtensions>
          </extensions>
          <services>
             <service name="ProductsServer.ProductsService">
               <endpoint address="sb://yourServiceNamespace.servicebus.windows.net/products" binding="netTcpRelayBinding" contract="ProductsServer.IProducts"
        behaviorConfiguration="products"/>
             </service>
          </services>
          <behaviors>
             <endpointBehaviors>
               <behavior name="products">
                 <transportClientEndpointBehavior>
                    <tokenProvider>
                       <sharedAccessSignature keyName="RootManageSharedAccessKey" key="yourKey" />
                    </tokenProvider>
                 </transportClientEndpointBehavior>
               </behavior>
             </endpointBehaviors>
          </behaviors>
        </system.serviceModel>

14. Press F6 or from the **Build** menu, click **Build Solution** to build the application to verify the accuracy of your work so far.

## Create an ASP.NET MVC application

In this section you will build a simple ASP.NET application that displays data retrieved from your product service.

### Create the project

1.  Ensure that Visual Studio is running with administrator privileges. If not, to
    start Visual Studio with administrator privileges, right-click
    **Microsoft Visual Studio 2013 (or Microsoft Visual Studio Express)** and then click **Run as administrator**. The Microsoft Azure compute emulator, discussed later in this article, requires that
    Visual Studio be started with administrator privileges.

2.  In Visual Studio, on the **File** menu, click **New**, and then
    click **Project**.

3.  From **Installed Templates**, under **Visual C#**, click **ASP.NET Web Application**. Name the project **ProductsPortal**. Then
    click **OK**.

    ![][15]

4.  From the **Select a template** list, click **MVC**,
    and then click **OK**.

    ![][16]

5.  In Solution Explorer, right click **Models** and then click **Add**,
    then click **Class**. In the **Name** box, type the name
    **Product.cs**. Then click **Add**.

    ![][17]

### Modify the web application

1.  In the Product.cs file in Visual Studio, replace the existing
    namespace definition with the following code.

        // Declare properties for the products inventory.
        namespace ProductsWeb.Models
        {
            public class Product
            {
                public string Id { get; set; }
                public string Name { get; set; }
                public string Quantity { get; set; }
            }
        }

2.  In the HomeController.cs file in Visual Studio, replace the existing
    namespace definition with the following code.

        namespace ProductsWeb.Controllers
        {
            using System.Collections.Generic;
            using System.Web.Mvc;
            using Models;

            public class HomeController : Controller
            {
                // Return a view of the products inventory.
                public ActionResult Index(string Identifier, string ProductName)
                {
                    var products = new List<Product>
                        {new Product {Id = Identifier, Name = ProductName}};
                    return View(products);
                }

            }
        }

3.  In Solution Explorer, expand the Views\Shared folder.

    ![][18]

4.  Double-click **_Layout.cshtml** to open it in the Visual Studio editor.

5.  Change all occurrences of **My ASP.NET Application** to **LITWARE's Products**.

6. Remove the **Home**, **About**, and **Contact** links. In the following example, delete the highlighted code.

	![][41]

7.  In Solution Explorer, expand the Views\Home folder:

    ![][20]

8.  Double-click **Index.cshtml** to open it in the Visual Studio editor.
    Replace the entire contents of the file with the following code.

		@model IEnumerable<ProductsWeb.Models.Product>

		@{
    		ViewBag.Title = "Index";
		}

		<h2>Prod Inventory</h2>

		<table>
    		<tr>
        		<th>
            		@Html.DisplayNameFor(model => model.Name)
        		</th>
                <th></th>
        		<th>
            		@Html.DisplayNameFor(model => model.Quantity)
        		</th>
    		</tr>

		@foreach (var item in Model) {
    		<tr>
        		<td>
            		@Html.DisplayFor(modelItem => item.Name)
        		</td>
        		<td>
            		@Html.DisplayFor(modelItem => item.Quantity)
        		</td>
    		</tr>
		}

		</table>

9.  To verify the accuracy of your work so far, you can press **F6** or
    **Ctrl+Shift+B** to build the project.


### Run your application locally

Run the application to verify that it works.

1.  Ensure that **ProductsPortal** is the active project. Right-click
    the project name in Solution Explorer and select **Set As
    Startup Project**.
2.  In **Visual Studio**, press F5.
3.  Your application should appear running in a browser.

    ![][21]

## Make your application ready to deploy to Azure

You can deploy your application to an Azure cloud service or to an Azure website. To learn more about the difference between websites and cloud services, see [Azure Execution Models][executionmodels]. To learn how to deploy the application to an Azure website, see [Deploying an ASP.NET Web Application to an Azure Website](http://azure.microsoft.com/develop/net/tutorials/get-started/). This section contains detailed steps for deploying the application to an Azure cloud service.

To deploy your application to a cloud service, you'll add a cloud service project deployment project to the solution. The deployment project contains configuration information that is needed to properly run your application in the cloud.

1.  To make your application deployable to the cloud, right-click the **ProductsPortal** project in Solution Explorer and click **Convert**, then click **Convert to Microsoft Azure Cloud Service Project**.

    ![][22]

2.  To test your application, press F5.

3.  This will start the Azure compute emulator. The compute emulator uses the local computer to emulate your application running in Azure. You can confirm the emulator has started by looking at the system tray.

       ![][23]

4.  A browser will still display your application running locally, and it will look and function the same way it did when you ran it earlier as a regular ASP.NET MVC 4 application.

## Put the pieces together

The next step is to hook up the on-premises products server with the ASP.NET MVC application.

1.  If it is not already open, in Visual Studio re-open the **ProductsPortal** project you created in the "Creating an ASP.NET MVC Application" section.

2.  Similar to the step in the "Create an On-Premises Server" section, add the NuGet package to the project References. In Solution Explorer, right-click **References**, then click **Manage NuGet Packages**.

3.  Search for "Service Bus" and select the **Microsoft Azure Service Bus** item. Then complete the installation and close this dialog box.

4.  In Solution Explorer, right-click the **ProductsPortal** project, then click **Add**, then **Existing Item**.

5.  Navigate to the **ProductsContract.cs** file from the **ProductsServer** console project. Click to highlight   ProductsContract.cs. Click the down arrow next to **Add**, then click **Add as Link**.

	![][24]

6.  Now open the **HomeController.cs** file in the Visual Studio  editor and replace the namespace definition with the following code. Be sure to replace *yourServiceNamespace* with the name of your service namespace, and *yourKey* with your SAS key. This will enable the client to call the on-premises service, returning the result of the call.

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
                    // Declare the channel factory.
                    static ChannelFactory<IProductsChannel> channelFactory;

                    static HomeController()
                    {
                        // Create shared secret token credentials for authentication.
                        channelFactory = new ChannelFactory<IProductsChannel>(new NetTcpRelayBinding(),
                            "sb://yourServiceNamespace.servicebus.windows.net/products");
                        channelFactory.Endpoint.Behaviors.Add(new TransportClientEndpointBehavior {
                            TokenProvider = TokenProvider.CreateSharedAccessSignatureTokenProvider(
                                "RootManageSharedAccessKey", "yourKey") });
                    }

                    public ActionResult Index()
                    {
                        using (IProductsChannel channel = channelFactory.CreateChannel())
                        {
                            // Return a view of the products inventory.
                            return this.View(from prod in channel.GetProducts()
                                             select
                                                 new Product { Id = prod.Id, Name = prod.Name,
                                                     Quantity = prod.Quantity });
                        }
                    }
                }
            }
7.  In Solution Explorer, right-click the **ProductsPortal**solution, click **Add**, then click **Existing Project**.

8.  Navigate to the **ProductsServer** project, then double-click the **ProductsServer.csproj** solution file to add it.

9.  In Solution Explorer, right-click the **ProductsPortal** solution and click **Properties**.

10. On the left side, click **Startup Project**. On the right side, click **Multiple startup projects**. Ensure that **ProductsServer**, **ProductsPortal.Azure**, and **ProductsPortal** appear, in that order, with **Start** set as the action for **ProductsServer** and **ProductsPortal.Azure**, and **None** set as the action for **ProductsPortal**.

      ![][25]

11. Still in the **Properties** dialog box, click **ProjectDependencies** on the left side.

12. In the **Projects** list, click **ProductsServer**. Ensure that **ProductsPortal** is not selected, and **ProductsPortal.Azure** is selected. Then click **OK**:

    ![][26]

## Run the application

1.  From the **File** menu in Visual Studio, click **Save All**.

2.  Press F5 to build and run the application. The on-premises server (the **ProductsServer** console application) should start first, then the **ProductsWeb** application should start in a browser window, as shown in the following screen shot. This time, you will see that the product inventory lists data retrieved from the product service on-premises system.

    ![][1]

## Deploy your application to Azure

1.  Right-click the **ProductsPortal** project in Solution Explorer and then click **Publish to Microsoft Azure**.

2.  You might have to sign in to see all your subscriptions.

    Click **Sign in to see more subscriptions**:

    ![][27]

3.  Sign in using your Microsoft Account.

8.  Click **Next**. If your subscription doesn't already contain any hosted services, you will be asked to create one. The hosted service acts as a container for your application within your Azure subscription. Enter a name that identifies your application and choose the region for which the application should be optimized. (You can expect faster loading times for users accessing it from this region.)

9.  Select the hosted service to which you would like to publish your application. Keep the defaults as shown below for the remaining settings. Click **Next**.

    ![][33]

10. On the last page, click **Publish** to start the deployment process.

    ![][34]
This will take approximately 5-7 minutes. Since this is the first time you are publishing, Azure provisions a virtual machine (VM), performs security hardening, creates a Web role on the VM to host your application, deploys your code to that Web role, and finally configures the load balancer and networking so your application is available to the public.

11. While publishing is in progress you will be able to monitor the activity in the **Azure Activity Log** window, which is typically docked to the bottom of Visual Studio or Visual Web Developer.

    ![][35]

12. When deployment is complete, you can view your website by clicking the **Website URL** link in the monitoring window.

    ![][36]

    Your website depends on your on-premises server, so you must run the **ProductsServer** application locally for the website to function properly. As you perform requests on the cloud website, you will see requests coming into your on-premises console application, as indicated by the "GetProducts called" output displayed in the following screen shot.

    ![][37]

To learn more about the difference between websites and cloud services, see [Azure Execution Models][executionmodels].

## Stop and delete your application

After deploying your application, you may want to disable it so you
can build and deploy other applications within the free 750
hours/month (31 days/month) of server time.

Azure bills web role instances per hour of server time
consumed. Server time is consumed once your application is deployed,
even if the instances are not running and are in the stopped state.
A free account includes 750 hours/month (31 days/month) of dedicated
virtual machine server time for hosting these web role instances.

The following steps show you how to stop and delete your
application.

1.  Sign in to the [Azure portal], click **Cloud Services**, then click the name of your service.

2.  Click the **Dashboard** tab, and then click **Stop** to temporarily suspend your application. You will be able to start it again by clicking **Start**. Click **Delete** to completely remove your application from Azure with no ability to restore it.

	![][43]

## Next steps  

To learn more about Service Bus, see the following resources:  

* [Azure Service Bus][sbmsdn]  
* [Service Bus How To's][sbwacom]  
* [How to Use Service Bus Queues][sbwacomqhowto]  


  [0]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hybrid.png
  [1]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/App2.png
  [Get Tools and SDK]: http://go.microsoft.com/fwlink/?LinkId=271920
  [NuGet]: http://nuget.org
  [2]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/getting-started-3.png
  [3]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/getting-started-4-2-WebPI.png


  [Azure portal]: http://manage.windowsazure.com
  [5]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/sb-queues-03.png
  [6]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/sb-queues-04.png



  [Using the NuGet Service Bus Package]: https://msdn.microsoft.com/library/azure/dn741354.aspx
  [10]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-1.png
  [11]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-con-1.png
  [12]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-con-3.png
  [13]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/getting-started-multi-tier-13.png
  [14]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-con-4.png
  [15]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-2.png
  [16]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-4.png
  [17]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-7.jpg
  [18]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-10.jpg

  [20]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-11.png
  [21]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/App1.png
  [22]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/getting-started-hybrid-21.png
  [23]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/getting-started-hybrid-22.png
  [24]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-12.png
  [25]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-13.png
  [26]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-14.png
  [27]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/getting-started-hybrid-33.png


  [30]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/getting-started-hybrid-36.png
  [31]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/getting-started-hybrid-37.png
  [32]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/getting-started-hybrid-38.png
  [33]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/getting-started-hybrid-39.png
  [34]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/getting-started-hybrid-40.png
  [35]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/getting-started-hybrid-41.png
  [36]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/App2.png
  [37]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-service1.png
  [38]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/getting-started-multi-tier-27.png
  [39]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/sb-queues-09.png
  [40]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/sb-queues-06.png
  [41]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/getting-started-multi-tier-40.png
  [42]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/getting-started-41.png
  [43]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/getting-started-hybrid-43.png
  [45]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-45.png

  [sbmsdn]: http://msdn.microsoft.com/library/azure/ee732537.aspx  
  [sbwacom]: /documentation/services/service-bus/  
  [sbwacomqhowto]: service-bus-dotnet-how-to-use-queues.md
  [executionmodels]: ../cloud-services/fundamentals-application-models.md
