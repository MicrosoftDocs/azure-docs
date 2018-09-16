---
title: Azure WCF Relay hybrid on-premises/cloud application (.NET) | Microsoft Docs
description: Learn how to create a .NET on-premises/cloud hybrid application using Azure WCF Relay.
services: service-bus-relay
documentationcenter: .net
author: spelluru
manager: timlt
editor: ''

ms.assetid: 9ed02f7c-ebfb-4f39-9c97-b7dc15bcb4c1
ms.service: service-bus-relay
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 11/02/2017
ms.author: spelluru

---
# .NET on-premises/cloud hybrid application using Azure WCF Relay

This article shows how to build a hybrid cloud application with Microsoft Azure and Visual Studio. The tutorial assumes you have no prior experience using Azure. In less than
30 minutes, you will have an application that uses multiple Azure resources up and running in the cloud.

You will learn:

* How to create or adapt an existing web service for consumption by a
  web solution.
* How to use the Azure WCF Relay service to share data between
  an Azure application and a web service hosted elsewhere.

[!INCLUDE [create-account-note](../../includes/create-account-note.md)]

## How Azure Relay helps with hybrid solutions

Business solutions are typically composed of a combination of custom code written to tackle new and unique business requirements and existing functionality provided by solutions and systems that are already in place.

Solution architects are starting to use the cloud for easier handling of scale requirements and lower operational costs. In doing so, they find that existing service assets they'd like to leverage as building blocks for their solutions are inside the corporate firewall and out of easy reach for access by the cloud solution. Many internal services are not built or hosted in a way that they can be easily exposed at the corporate network edge.

[Azure Relay](https://azure.microsoft.com/services/service-bus/) is designed for the use-case of taking existing
Windows Communication Foundation (WCF) web services and making those services securely accessible to solutions that reside outside the corporate perimeter without requiring intrusive changes to the corporate network infrastructure. Such relay services are still hosted inside their existing environment, but they delegate listening for incoming sessions and requests to the cloud-hosted relay service. Azure Relay also protects those services from unauthorized access by using [Shared Access Signature (SAS)](../service-bus-messaging/service-bus-sas.md) authentication.

## Solution scenario
In this tutorial, you will create an ASP.NET website that enables you to see a list of products on the product inventory page.

![][0]

The tutorial assumes that you have product information in an existing on-premises system, and uses Azure Relay to reach into that system. This is simulated by a web service that runs in a simple console application and is backed by an in-memory set of products. You will be able to run this console application on your own computer and deploy the web role into Azure. By doing so, you will see how the web role running in the Azure datacenter will indeed call into your computer, even though your computer will almost certainly reside behind at least one firewall and a network address translation (NAT) layer.

## Set up the development environment

Before you can begin developing Azure applications, download the tools and set up your development environment:

1. Install the Azure SDK for .NET from the SDK [downloads page](https://azure.microsoft.com/downloads/).
2. In the **.NET** column, click the version of [Visual Studio](http://www.visualstudio.com) you are using. The steps in this tutorial use Visual Studio 2017.
3. When prompted to run or save the installer, click **Run**.
4. In the **Web Platform Installer**, click **Install** and proceed with the installation.
5. Once the installation is complete, you will have everything
   necessary to start to develop the app. The SDK includes tools that let you
   easily develop Azure applications in Visual Studio.

## Create a namespace

To begin using the relay features in Azure, you must first create a service namespace. A namespace provides a scoping container for addressing Azure resources within your application. Follow the [instructions here](relay-create-namespace-portal.md) to create a Relay namespace.

## Create an on-premises server

First, you will build a (mock) on-premises product catalog system. It will be fairly simple; you can see this as representing an actual on-premises product catalog system with a complete service surface that we're trying to integrate.

This project is a Visual Studio console application, and uses the [Azure Service Bus NuGet package](https://www.nuget.org/packages/WindowsAzure.ServiceBus/) to include the Service Bus libraries and configuration settings.

### Create the project

1. Using administrator privileges, start Microsoft Visual Studio. To do so, right-click the Visual Studio program icon, and then click **Run as administrator**.
2. In Visual Studio, on the **File** menu, click **New**, and then click **Project**.
3. From **Installed Templates**, under **Visual C#**, click **Console App (.NET Framework)**. In the **Name** box, type the name
   **ProductsServer**:

   ![][11]
4. Click **OK** to create the **ProductsServer** project.
5. If you have already installed the NuGet package manager for Visual Studio, skip to the next step. Otherwise, visit [NuGet][NuGet] and click [Install NuGet](http://visualstudiogallery.msdn.microsoft.com/27077b70-9dad-4c64-adcf-c7cf6bc9970c). Follow the prompts to install the NuGet package manager, then re-start Visual Studio.
6. In Solution Explorer, right-click the **ProductsServer** project, then click **Manage NuGet Packages**.
7. Click the **Browse** tab, then search for **WindowsAzure.ServiceBus**. Select the **WindowsAzure.ServiceBus** package.
8. Click **Install**, and accept the terms of use.

   ![][13]

   Note that the required client assemblies are now referenced.
8. Add a new class for your product contract. In Solution Explorer, right-click the **ProductsServer** project and click **Add**, and then click **Class**.
9. In the **Name** box, type the name **ProductsContract.cs**. Then click **Add**.
10. In **ProductsContract.cs**, replace the namespace definition with the following code, which defines the contract for the service.

    ```csharp
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
11. In Program.cs, replace the namespace definition with the following code, which adds the profile service and the host for it.

    ```csharp
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
12. In Solution Explorer, double-click the **App.config** file to open it in the Visual Studio editor. At the bottom of the `<system.ServiceModel>` element (but still within `<system.ServiceModel>`), add the following XML code. Be sure to replace *yourServiceNamespace* with the name of your namespace, and *yourKey* with the SAS key you retrieved earlier from the portal:

    ```xml
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
    The error caused by "transportClientEndpointBehavior" is just a warning and is not a blocking issue for this sample.
    
13. Still in App.config, in the `<appSettings>` element, replace the connection string value with the connection string you previously obtained from the portal.

    ```xml
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

1. Ensure that Visual Studio is running with administrator privileges.
2. In Visual Studio, on the **File** menu, click **New**, and then click **Project**.
3. From **Installed Templates**, under **Visual C#**, click **ASP.NET Web Application (.NET Framework)**. Name the project **ProductsPortal**. Then click **OK**.

   ![][15]

4. From the **ASP.NET Templates** list in the **New ASP.NET Web Application** dialog, click **MVC**.

   ![][16]

6. Click the **Change Authentication** button. In the **Change Authentication** dialog box, ensure that **No Authentication** is selected, and then click **OK**. For this tutorial, you're deploying an app that does not need a user login.

    ![][18]

7. Back in the **New ASP.NET Web Application** dialog, click **OK** to create the MVC app.
8. Now you must configure Azure resources for a new web app. Follow the steps in the [Publish to Azure section of this article](../app-service/app-service-web-get-started-dotnet-framework.md#launch-the-publish-wizard). Then, return to this tutorial and proceed to the next step.
10. In Solution Explorer, right-click **Models** and then click **Add**,
    then click **Class**. In the **Name** box, type the name
    **Product.cs**. Then click **Add**.

    ![][17]

### Modify the web application

1. In the Product.cs file in Visual Studio, replace the existing namespace definition with the following code.

   ```csharp
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
2. In Solution Explorer, expand the **Controllers** folder, then double-click the **HomeController.cs** file to open it in Visual Studio.
3. In **HomeController.cs**, replace the existing namespace definition with the following code.

    ```csharp
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
4. In Solution Explorer, expand the Views\Shared folder, then double-click **_Layout.cshtml** to open it in the Visual Studio editor.
5. Change all occurrences of **My ASP.NET Application** to **Northwind Traders Products**.
6. Remove the **Home**, **About**, and **Contact** links. In the following example, delete the highlighted code.

    ![][41]

7. In Solution Explorer, expand the Views\Home folder, then double-click **Index.cshtml** to open it in the Visual Studio editor. Replace the entire contents of the file with the following code.

   ```html
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
8. To verify the accuracy of your work so far, you can press **Ctrl+Shift+B** to build the project.

### Run the app locally

Run the application to verify that it works.

1. Ensure that **ProductsPortal** is the active project. Right-click the project name in Solution Explorer and select **Set As Startup Project**.
2. In Visual Studio, press **F5**.
3. Your application should appear, running in a browser.

   ![][21]

## Put the pieces together

The next step is to hook up the on-premises products server with the ASP.NET application.

1. If it is not already open, in Visual Studio re-open the **ProductsPortal** project you created in the [Create an ASP.NET application](#create-an-aspnet-application) section.
2. Similar to the step in the "Create an On-Premises Server" section, add the NuGet package to the project references. In Solution Explorer, right-click the **ProductsPortal** project, then click **Manage NuGet Packages**.
3. Search for **WindowsAzure.ServiceBus** and select the **WindowsAzure.ServiceBus** item. Then complete the installation and close this dialog box.
4. In Solution Explorer, right-click the **ProductsPortal** project, then click **Add**, then **Existing Item**.
5. Navigate to the **ProductsContract.cs** file from the **ProductsServer** console project. Click to highlight ProductsContract.cs. Click the down arrow next to **Add**, then click **Add as Link**.

   ![][24]

6. Now open the **HomeController.cs** file in the Visual Studio editor and replace the namespace definition with the following code. Be sure to replace *yourServiceNamespace* with the name of your service namespace, and *yourKey* with your SAS key. This will enable the client to call the on-premises service, returning the result of the call.

   ```csharp
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
7. In Solution Explorer, right-click the **ProductsPortal** solution (make sure to right-click the solution, not the project). Click **Add**, then click **Existing Project**.
8. Navigate to the **ProductsServer** project, then double-click the **ProductsServer.csproj** solution file to add it.
9. **ProductsServer** must be running in order to display the data on **ProductsPortal**. In Solution Explorer, right-click the **ProductsPortal** solution and click **Properties**. The **Property Pages** dialog box is displayed.
10. On the left side, click **Startup Project**. On the right side, click **Multiple startup projects**. Ensure that **ProductsServer** and **ProductsPortal** appear, in that order, with **Start** set as the action for both.

      ![][25]

11. Still in the **Properties** dialog box, click **Project Dependencies** on the left side.
12. In the **Projects** list, click **ProductsServer**. Ensure that **ProductsPortal** is not selected.
13. In the **Projects** list, click **ProductsPortal**. Ensure that **ProductsServer** is selected.

    ![][26]

14. Click **OK** in the **Property Pages** dialog box.

## Run the project locally

To test the application locally, in Visual Studio press **F5**. The on-premises server (**ProductsServer**) should start first, then the **ProductsPortal** application should start in a browser window. This time, you will see that the product inventory lists data retrieved from the product service on-premises system.

![][10]

Press **Refresh** on the **ProductsPortal** page. Each time you refresh the page, you'll see the server app display a message when `GetProducts()` from **ProductsServer** is called.

Close both applications before proceeding to the next step.

## Deploy the ProductsPortal project to an Azure web app

The next step is to republish the Azure Web app **ProductsPortal** frontend. Do the following:

1. In Solution Explorer, right-click the **ProductsPortal** project, and click **Publish**. Then, click **Publish** on the **Publish** page.

  > [!NOTE]
  > You may see an error message in the browser window when the **ProductsPortal** web project is automatically launched after the deployment. This is expected, and occurs because the **ProductsServer** application isn't running yet.
>
>

2. Copy the URL of the deployed web app, as you will need the URL in the next step. You can also obtain this URL from the Azure App Service Activity window in Visual Studio:

  ![][9]

3. Close the browser window to stop the running application.

### Set ProductsPortal as web app

Before running the application in the cloud, you must ensure that **ProductsPortal** is launched from within Visual Studio as a web app.

1. In Visual Studio, right-click the **ProductsPortal** project and then click **Properties**.
2. In the left-hand column, click **Web**.
3. In the **Start Action** section, click the **Start URL** button, and in the text box enter the URL for your previously deployed web app; for example, `http://productsportal1234567890.azurewebsites.net/`.

    ![][27]

4. From the **File** menu in Visual Studio, click **Save All**.
5. From the Build menu in Visual Studio, click **Rebuild Solution**.

## Run the application

1. Press F5 to build and run the application. The on-premises server (the **ProductsServer** console application) should start first, then the **ProductsPortal** application should start in a browser window, as shown in the following screen shot. Notice again that the product inventory lists data retrieved from the product service on-premises system, and displays that data in the web app. Check the URL to make sure that **ProductsPortal** is running in the cloud, as an Azure web app.

   ![][1]

   > [!IMPORTANT]
   > The **ProductsServer** console application must be running and able to serve the data to the **ProductsPortal** application. If the browser displays an error, wait a few more seconds for **ProductsServer** to load and display the following message. Then press **Refresh** in the browser.
   >
   >

   ![][37]
2. Back in the browser, press **Refresh** on the **ProductsPortal** page. Each time you refresh the page, you'll see the server app display a message when `GetProducts()` from **ProductsServer** is called.

    ![][38]

## Next steps

To learn more about Azure Relay, see the following resources:  

* [What is Azure Relay?](relay-what-is-it.md)  
* [How to use Azure Relay](relay-wcf-dotnet-get-started.md)  

[0]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hybrid.png
[1]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/App2.png
[NuGet]: http://nuget.org

[11]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-con-1.png
[13]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/getting-started-multi-tier-13.png
[15]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-2.png
[16]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-4.png
[17]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-7.png
[18]: ./media/service-bus-dotnet-hybrid-app-using-service-bus-relay/hy-web-5.png
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
