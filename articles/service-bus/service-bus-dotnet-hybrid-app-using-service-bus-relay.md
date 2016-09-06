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
	ms.date="05/23/2016"
	ms.author="sethm"/>

# .NET on-premises/cloud hybrid application using Azure Service Bus relay

## Introduction

This article describes how to build a hybrid cloud application with Microsoft Azure and Visual Studio. The tutorial assumes you have no prior experience using Azure. In less than
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
incoming sessions and requests to the cloud-hosted Service Bus. Service Bus also protects those services from unauthorized access by using [Shared Access Signature](service-bus-sas-overview.md) (SAS) authentication.

## Solution scenario

In this tutorial, you will create an ASP.NET website that enables you to see a list of products on the product inventory page.

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

Before you can begin developing Azure applications, get the tools and set up your development environment.

1.  Install the Azure SDK for .NET at [Get Tools and SDK][].

2. 	Click **Install the SDK** for the version of Visual Studio you are using. The steps in this tutorial use Visual Studio 2015.

4.  When prompted to run or save the installer, click **Run**.

5.  In the **Web Platform Installer**, click **Install** and proceed with the installation.

6.  Once the installation is complete, you will have everything
    necessary to start to develop the app. The SDK includes tools that let you
    easily develop Azure applications in Visual Studio. If you
    do not have Visual Studio installed, the SDK also installs the free
    Visual Studio Express.

## Create a namespace

To begin using Service Bus features in Azure, you must first create a service namespace. A namespace provides a scoping container for addressing Service Bus resources within your application.

1.  Sign in to the [Azure classic portal][].

2.  In the left navigation pane of the portal, click
    **Service Bus**.

3.  In the lower pane of the portal, click **Create**.

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

6.	Leave the other fields in the dialog box with their default values, then click the OK check mark. The system creates your namespace and enables it. You might have to wait several minutes as the system provisions resources for your account.

The namespace you created will appear in the portal, though it may take a moment to activate. Wait until the status is **Active** before moving on.

## Obtain the default management credentials for the namespace

In order to perform management operations on the new namespace, such as creating messaging entities, you must obtain credentials for the namespace.

1.  In the main window, click the namespace you created in the previous step.

2.  At the bottom of the page, click **Connection Information**.

3.  In the **Access connection information** pane, find the connection string that contains the SAS key and key name.

	![][45]

4.  Copy the connection string, and paste it somewhere to use later in this tutorial.

5. In the same portal page, click the **Configure** tab at the top of the page.

6. Copy the primary key for the **RootManageSharedAccessKey** policy to the clipboard, or paste it into Notepad. You will use this value later in this tutorial.

	![][46]

## Create an on-premises server

First, you will build a (mock) on-premises product catalog system. It
will be fairly simple; you can see this as representing an actual
on-premises product catalog system with a complete service surface that
we're trying to integrate.

This project is a Visual Studio console application, and uses the [Azure Service Bus NuGet package](https://www.nuget.org/packages/WindowsAzure.ServiceBus/) to include the Service Bus libraries and configuration settings.

### Create the project

1.  Using administrator privileges, start Microsoft Visual
    Studio. To start Visual Studio with administrator privileges, right-click the **Visual Studio** program icon, and then click **Run as administrator**.

2.  In Visual Studio, on the **File** menu, click **New**, and then
    click **Project**.

3.  From **Installed Templates**, under **Visual C#**, click **Console
    Application**. In the **Name** box, type the name
    **ProductsServer**:

    ![][11]

4.  Click **OK** to create the **ProductsServer** project.

7.  If you have already installed the NuGet package manager for Visual Studio, skip to the next step. Otherwise, visit [NuGet][] and click [Install NuGet](http://visualstudiogallery.msdn.microsoft.com/27077b70-9dad-4c64-adcf-c7cf6bc9970c). Follow the prompts to install the NuGet package manager, then re-start Visual Studio.

7.  In Solution Explorer, right-click the **ProductsServer** project, then click
    **Manage NuGet Packages**.

8.  Click the **Browse** tab, then search for `Microsoft Azure Service Bus`. Click **Install**, and accept the terms of use.

    ![][13]

    Note that the required client assemblies are now referenced.

9.  Add a new class for your product contract. In Solution Explorer,
    right-click the **ProductsServer** project and click **Add**, and then click
    **Class**.

10. In the **Name** box, type the name **ProductsContract.cs**. Then
    click **Add**.

11. In **ProductsContract.cs**, replace the namespace definition with the following code, which defines the contract for the service.

	```
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
	```

12. In Program.cs, replace the namespace definition with the following
    code, which adds the profile service and the host for it.

	```
	namespace ProductsServer
	{
	    using System;
	    using System.Linq;
	    using System.Collections.Generic;
	    using System.ServiceModel;
	
	    // Implement the IProducts interface.
	    class ProductsService : IProducts
	    {
	
	        // Populate array of products for display on website
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
	```

13. In Solution Explorer, double-click the **App.config** file to open it in the Visual Studio editor. At the bottom of the **&lt;system.ServiceModel&gt;** element (but still within &lt;system.ServiceModel&gt;), add the following XML code. Be sure to replace *yourServiceNamespace* with the name of your namespace, and *yourKey* with the SAS key you retrieved earlier from the portal:

    ```
    <system.serviceModel>
	...
      <services>
         <service name="ProductsServer.ProductsService">
           <endpoint address="sb://yourServiceNamespace.servicebus.windows.net/products" binding="netTcpRelayBinding" contract="ProductsServer.IProducts" behaviorConfiguration="products"/>
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
    ```
14. Still in App.config, in the **&lt;appSettings&gt;** element, replace the connection string value with the connection string you previously obtained from the portal. 

	```
	<appSettings>
   	<!-- Service Bus specific app settings for messaging connections -->
   	<add key="Microsoft.ServiceBus.ConnectionString"
	       value="Endpoint=sb://yourNamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=yourKey"/>
	</appSettings>
	```

14. Press **Ctrl+Shift+B** or from the **Build** menu, click **Build Solution** to build the application and verify the accuracy of your work so far.

## Create an ASP.NET application

In this section you will build a simple ASP.NET application that displays data retrieved from your product service.

### Create the project

1.  Ensure that Visual Studio is running with administrator privileges.

2.  In Visual Studio, on the **File** menu, click **New**, and then
    click **Project**.

3.  From **Installed Templates**, under **Visual C#**, click **ASP.NET Web Application**. Name the project **ProductsPortal**. Then click **OK**.

    ![][15]

4.  From the **Select a template** list, click **MVC**. 

6.  Check the box for **Host in the cloud**.

    ![][16]

5. Click the **Change Authentication** button. In the **Change Authentication** dialog box, click **No Authentication**, and then click **OK**. For this tutorial, you're deploying an app that doesn't need a user login.

	![][18]

6. 	In the **Microsoft Azure** section of the **New ASP.NET Project** dialog box, make sure that **Host in the cloud** is selected and that **App Service** is selected in the drop-down list.

	![][19]

7. Click **OK**. 

8. Now you must configure Azure resources for a new web app. Follow all the steps in the section [Configure Azure resources for a new web app](../app-service-web/web-sites-dotnet-get-started.md#configure-azure-resources-for-a-new-web-app). Then, return to this tutorial and proceed to the next step.

5.  In Solution Explorer, right click **Models** and then click **Add**,
    then click **Class**. In the **Name** box, type the name
    **Product.cs**. Then click **Add**.

    ![][17]

### Modify the web application

1.  In the Product.cs file in Visual Studio, replace the existing namespace definition with the following code.

	```
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
	```

2.  In Solution Explorer, expand the **Controllers** folder, then double-click the **HomeController.cs** file to open it in Visual Studio.

3. In **HomeController.cs**, replace the existing namespace definition with the following code.

	```
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
	```

3.  In Solution Explorer, expand the Views\Shared folder, then double-click **_Layout.cshtml** to open it in the Visual Studio editor.

5.  Change all occurrences of **My ASP.NET Application** to **LITWARE's Products**.

6. Remove the **Home**, **About**, and **Contact** links. In the following example, delete the highlighted code.

	![][41]

7.  In Solution Explorer, expand the Views\Home folder, then double-click **Index.cshtml** to open it in the Visual Studio editor.
    Replace the entire contents of the file with the following code.

	```
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
	```

9.  To verify the accuracy of your work so far, you can press **Ctrl+Shift+B** to build the project.


### Run the app locally

Run the application to verify that it works.

1.  Ensure that **ProductsPortal** is the active project. Right-click
    the project name in Solution Explorer and select **Set As
    Startup Project**.
2.  In Visual Studio, press F5.
3.  Your application should appear running in a browser.

    ![][21]

## Put the pieces together

The next step is to hook up the on-premises products server with the ASP.NET application.

1.  If it is not already open, in Visual Studio re-open the **ProductsPortal** project you created in the "Creating an ASP.NET Application" section.

2.  Similar to the step in the "Create an On-Premises Server" section, add the NuGet package to the project References. In Solution Explorer, right-click the **ProductsPortal** project, then click **Manage NuGet Packages**.

3.  Search for "Service Bus" and select the **Microsoft Azure Service Bus** item. Then complete the installation and close this dialog box.

4.  In Solution Explorer, right-click the **ProductsPortal** project, then click **Add**, then **Existing Item**.

5.  Navigate to the **ProductsContract.cs** file from the **ProductsServer** console project. Click to highlight   ProductsContract.cs. Click the down arrow next to **Add**, then click **Add as Link**.

	![][24]

6.  Now open the **HomeController.cs** file in the Visual Studio  editor and replace the namespace definition with the following code. Be sure to replace *yourServiceNamespace* with the name of your service namespace, and *yourKey* with your SAS key. This will enable the client to call the on-premises service, returning the result of the call.

	```
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
	            // Create shared access signature token credentials for authentication.
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
	```

7.  In Solution Explorer, right-click the **ProductsPortal** solution, click **Add**, then click **Existing Project**.

8.  Navigate to the **ProductsServer** project, then double-click the **ProductsServer.csproj** solution file to add it.

9.  **ProductsServer** must be running in order to display the data on **ProductsPortal**. In Solution Explorer, right-click the **ProductsPortal** solution and click **Properties**. The **Property Pages** dialog box is displayed.

10. On the left side, click **Startup Project**. On the right side, click **Multiple startup projects**. Ensure that **ProductsServer** and **ProductsPortal** appear, in that order, with **Start** set as the action for both.

      ![][25]

11. Still in the **Properties** dialog box, click **Project Dependencies** on the left side.

12. In the **Projects** list, click **ProductsServer**. Ensure that **ProductsPortal** is **not** selected.

14. In the **Projects** list, click **ProductsPortal**. Ensure that **ProductsServer** is selected. 

    ![][26]

15. Click **OK** in the **Property Pages** dialog box.

## Run the project locally

To test the application locally, in Visual Studio press **F5**. The on-premises server (**ProductsServer**) should start first, then the **ProductsPortal** application should start in a browser window. This time, you will see that the product inventory lists data retrieved from the product service on-premises system.

![][10]

Press **Refresh** on the **ProductsPortal** page. Each time you refresh the page, you'll see the server app display a message when `GetProducts()` from **ProductsServer** is called.

## Deploy the ProductsPortal project to an Azure web app

The next step is to convert the **ProductsPortal** frontend to an Azure web app. First, deploy the **ProductsPortal** project, following all the steps in the section [Deploy the web project to the Azure web app](../app-service-web/web-sites-dotnet-get-started.md#deploy-the-web-project-to-the-azure-web-app). After deployment is complete, return to this tutorial and proceed to the next step. 

Copy the URL of the deployed web app, as you will need the URL in the next step. You can also obtain this URL from the Azure App Service Activity window in Visual Studio:

![][9] 
   

> [AZURE.NOTE] You may see an error message in the browser window when the **ProductsPortal** web project is automatically launched after the deployment. This is expected, and occurs because the **ProductsServer** application isn't running yet.

### Set ProductsPortal as web app

Before running the application in the cloud, you must ensure that **ProductsPortal** is launched from within Visual Studio as a web app.

1. In Visual Studio, right-click the **ProjectsPortal** project and then click **Properties**.

3. In the left-hand column, click **Web**.

5. In the **Start Action** section, click the **Start URL** button, and in the text box enter the URL for your previously deployed web app; for example, `http://productsportal1234567890.azurewebsites.net/`.

	![][27]

6. From the **File** menu in Visual Studio, click **Save All**.

7. From the Build menu in Visual Studio, click **Rebuild Solution**.

## Run the application

2.  Press F5 to build and run the application. The on-premises server (the **ProductsServer** console application) should start first, then the **ProductsPortal** application should start in a browser window, as shown in the following screen shot. Notice again that the product inventory lists data retrieved from the product service on-premises system, and displays that data in the web app. Check the URL to make sure that **ProductsPortal** is running in the cloud, as an Azure web app. 

    ![][1]

	> [AZURE.IMPORTANT] The **ProductsServer** console application must be running and able to serve the data to the **ProductsPortal** application. If the browser displays an error, wait a few more seconds for **ProductsServer** to load and display the following message. Then press **Refresh** in the browser.

	![][37]

3. Back in the browser, press **Refresh** on the **ProductsPortal** page. Each time you refresh the page, you'll see the server app display a message when `GetProducts()` from **ProductsServer** is called.

	![][38]

## Next steps  

To learn more about Service Bus, see the following resources:  

* [Azure Service Bus][sbwacom]  
* [How to Use Service Bus Queues][sbwacomqhowto]  


  [0]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hybrid.png
  [1]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/App2.png
  [Get Tools and SDK]: http://go.microsoft.com/fwlink/?LinkId=271920
  [NuGet]: http://nuget.org
  
  [Azure classic portal]: http://manage.windowsazure.com
  [5]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/sb-queues-03.png
  [6]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/sb-queues-04.png


  [11]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-con-1.png
  [13]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/getting-started-multi-tier-13.png
  [15]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-2.png
  [16]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-4.png
  [17]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-7.png
  [18]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-5.png
  [19]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-6.png
  [9]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-9.png
  [10]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/App3.png

  [21]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/App1.png
  [24]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-12.png
  [25]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-13.png
  [26]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-14.png
  [27]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-8.png
  
  [36]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/App2.png
  [37]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-service1.png
  [38]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-service2.png
  [41]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/getting-started-multi-tier-40.png
  [43]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/getting-started-hybrid-43.png
  [45]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-45.png
  [46]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/service-bus-policies.png

  [sbwacom]: /documentation/services/service-bus/  
  [sbwacomqhowto]: service-bus-dotnet-get-started-with-queues.md

