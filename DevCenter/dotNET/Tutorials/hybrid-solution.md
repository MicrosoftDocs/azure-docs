<properties linkid="dev-net-tutorials-hybrid-solution" urlDisplayName="Hybrid Application" pageTitle="Hybrid On-Premises/ Cloud Application (.NET) - Windows Azure" metaKeywords="Azure Service Bus tutorial  hybrid .NET" metaDescription="Learn how to create a .NET On-Premises/Cloud Hybrid Application Using the Windows Azure Service Bus Relay." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />



<div chunk="../chunks/article-left-menu.md" />

# .NET On-Premises/Cloud Hybrid Application Using Service Bus Relay

<h2><span class="short-header">INTRODUCTION</span>INTRODUCTION</h2>

Developing hybrid cloud applications with Windows Azure is easy using
Visual Studio 2012 and the free Windows Azure SDK for .NET. This guide
assumes you have no prior experience using Windows Azure. In less than
30 minutes, you will have an application that uses multiple Windows
Azure resources up and running in the cloud.

You will learn:

-   How to create or adapt an existing web service for consumption by a
    web solution.
-   How to use the Windows Azure Service Bus relay to share data between
    a Windows Azure application and a web service hosted elsewhere.

<div chunk="../../Shared/Chunks/create-account-note.md" />

### HOW THE SERVICE BUS RELAY HELPS WITH HYBRID SOLUTIONS

Business solutions are typically composed of a combination of custom
code written to tackle new and unique business requirements and existing
functionality provided by solutions and systems that are already in
place.

Solution architects are starting to use the cloud for easier handling of
scale requirements and lower operational costs. In doing so, they find
that existing service assets they’d like to leverage as building blocks
for their solutions are inside the corporate firewall and out of easy
reach for access by the cloud solution. Many internal services are not
built or hosted in a way that they can be easily exposed at the
corporate network edge.

The *Service Bus relay* is designed for the use-case of taking existing
Windows Communication Foundation (WCF) web services and making those
services securely accessible to solutions that reside outside the
corporate perimeter without requiring intrusive changes to the corporate
network infrastructure. Such Service Bus relay services are still hosted
inside their existing environment, but they delegate listening for
incoming sessions and requests to the cloud-hosted Service Bus. The
Service Bus also protects those services from unauthorized access by
using the Windows Azure Access Control Service.

### THE SOLUTION SCENARIO

In this tutorial, you will create an ASP.NET MVC 3 website that will
allow you to see a list of products on the product inventory page.

![][0]

The tutorial assumes that you have product information in an existing
on-premises system, and uses the Service Bus relay to reach into that
system. This is simulated by a web service that is running in a simple
console application and is backed by an in-memory set of products. You
will be able to run this console application on your own computer and
deploy the web role into Windows Azure. By doing so, you will see how
the web role running in the Windows Azure datacenter will indeed call
into your computer, even though your computer will almost certainly
reside behind at least one firewall and a network address translation
(NAT) layer.

A screenshot of the start page of the completed web application is
below.

![][1]

<h2><span class="short-header">SET UP THE ENVIRONMENT</span>SET UP THE DEVELOPMENT ENVIRONMENT</h2>

Before you can begin developing your Windows Azure application, you need
to get the tools and set-up your development environment.

1.  To install the Windows Azure SDK for .NET, click the button below:

    [Get Tools and SDK][]

2. 	Click **install the SDK**.

3. 	Choose the link for the version of Visual Studio you are using. The steps in this tutorial use Visual Studio 2012:

	![][42]

4.  When prompted to run or save **WindowsAzureSDKForNet.exe**, click
    **Run**:

    ![][2]

5.  In the Web Platform Installer, click **Install** and proceed with the installation:

    ![][3]

6.  Once the installation is complete, you will have everything
    necessary to start developing. The SDK includes tools that let you
    easily develop Windows Azure applications in Visual Studio. If you
    do not have Visual Studio installed, it also installs the free
    Visual Web Developer Express.

<h2><span class="short-header">CREATE A NAMESPACE</span>CREATE A SERVICE NAMESPACE</h2>

To begin using Service Bus features in Windows Azure, you must first
create a service namespace. A service namespace provides a scoping
container for addressing Service Bus resources within your application.

To create a service namespace:

1.  Log on to the [Windows Azure Management Portal][].

2.  In the left navigation pane of the Management Portal, click
    **Service Bus**.

3.  In the lower pane of the Management Portal, click **Create**.   
    ![][5]

4.  In the **Add a new namespace** dialog, enter a namespace name.
    The system immediately checks to see if the name is available.   
    ![][6]

5.  After making sure the namespace name is available, choose the
    country or region in which your namespace should be hosted (make
    sure you use the same country/region in which you are deploying your
    compute resources).

    IMPORTANT: Pick the **same region** that you intend to choose for
    deploying your application. This will give you the best performance.

6.	Click the check mark. The system now creates your service
    namespace and enables it. You might have to wait several minutes as
    the system provisions resources for your account.

	![][38]

The namespace you created will then appear in the Management Portal and
takes a moment to activate. Wait until the status is **Active** before
moving on.

<h2><span class="short-header">OBTAIN MANAGEMENT CREDENTIALS</span>OBTAIN THE DEFAULT MANAGEMENT CREDENTIALS FOR THE NAMESPACE</h2>

In order to perform management operations, such as creating a queue, on
the new namespace, you need to obtain the management credentials for the
namespace.

1.  In the main window, click the name of your service namespace.   

	![][39]
  

2.  Click **Access Key**.   

	![][40]


3.  In the **Connect to your namespace** pane, find the **Default Issuer** and **Default Key** entries.   
    

4.  Make a note of the key, or copy it to the clipboard.


<h2><span class="short-header">CREATE AN ON-PREMISES SERVER</span>CREATE AN ON-PREMISES SERVER</h2>

First, you will build a (mock) on-premises product catalog system. It
will be fairly simple; you can see this as representing an actual
on-premises product catalog system with a complete service surface that
we’re trying to integrate.

This project will start as a Visual Studio console application. The
project uses the Service Bus NuGet package to include the service bus
libraries and configuration settings. The NuGet Visual Studio extension
makes it easy to install and update libraries and tools in Visual Studio
and Visual Web Developer. The Service Bus NuGet package is the easiest
way to get the Service Bus API and to configure your application with
all of the Service Bus dependencies. For details about using NuGet and
the Service Bus package, see [Using the NuGet Service Bus Package][].

### CREATE THE PROJECT

1.  Using administrator privileges, launch either Microsoft Visual
    Studio 2012 or Microsoft Visual Web Developer Express. To
    launch Visual Studio with administrator privileges, right-click
    **Microsoft Visual Studio 2012 (or Microsoft Visual Web Developer
    Express)** and then click **Run as administrator**.
2.  In Visual Studio, on the **File** menu, click **New**, and then
    click **Project**.

    ![][10]

3.  From **Installed Templates**, under **Visual C#**, click **Console
    Application**. In the **Name** box, type the name
    **ProductsServer**:

    ![][11]

4.  Click **OK** to create the **ProductsServer** project.
5.  In the **Solution Explorer**, right-click **ProductsServer**, then
    click **Properties**.
6.  Click the **Application** tab on the left, then ensure that **.NET
    Framework 4** appears in the **Target framework:** dropdown. If not, select it from the dropdown and then click **Yes**
    when prompted to reload the project.

    ![][12]

7.  In **Solution Explorer**, right-click **References**, then click
    **Manage NuGet Packages**...
8.  Search for ‘**WindowsAzure**’ and select the **Windows
    Azure Service Bus** item. Click **Install** to complete the
    installation, then close this dialog.

    ![][13]

    Note that the required client assemblies are now referenced.

9.  Add a new class for your product contract. In **Solution Explorer**,
    right click **ProductsServer** and click **Add**, then click
    **Class**.

    ![][14]

10. In the **Name** box, type the name **ProductsContract.cs**. Then
    click **Add**.
11. In **ProductsContract.cs**, replace the namespace definition with
    the following code, which defines the contract for the service:

        namespace ProductsServer
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
                IList<ProductData> GetProducts();

            }

            interface IProductsChannel : IProducts, IClientChannel
            {
            }
        }

12. In Program.cs, replace the namespace definition with the following
    code, which adds the profile service and the host for it:

        namespace ProductsServer
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
                public IList<ProductData> GetProducts()
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

13. In **Solution Explorer**, double click the **app.config** file to
    open it in the **Visual Studio** editor. Replace the contents of
    **&lt;system.ServiceModel>** with the following XML code. Be sure to
    replace *yourServiceNamespace* with the name of your service
    namespace, and *yourIssuerSecret* with the key you retrieved earlier
    from the Windows Azure Management Portal:

        <system.serviceModel>
          <extensions>
             <behaviorExtensions>
                <add name="transportClientEndpointBehavior" type="Microsoft.ServiceBus.Configuration.TransportClientEndpointBehaviorElement, Microsoft.ServiceBus, Version=1.7.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
              </behaviorExtensions>
              <bindingExtensions>
                 <add name="netTcpRelayBinding" type="Microsoft.ServiceBus.Configuration.NetTcpRelayBindingCollectionElement, Microsoft.ServiceBus, Version=1.7.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
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
                       <sharedSecret issuerName="owner" issuerSecret="yourIssuerSecret" />
                    </tokenProvider>
                 </transportClientEndpointBehavior>
               </behavior>
             </endpointBehaviors>
          </behaviors>
        </system.serviceModel>

14. Press **F6** to build the application to verify the accuracy of your
    work so far.

<h2><span class="short-header">CREATE AN ASP.NET APPLICATION</span>CREATE AN ASP.NET MVC 3 APPLICATION</h2>

In this section you will build a simple MVC 4 application that will
display data retrieved from your product service.

### CREATE THE PROJECT

1.  Using administrator privileges, launch either Microsoft Visual
    Studio 2012 or Microsoft Visual Web Developer Express. To
    launch Visual Studio with administrator privileges, right-click
    **Microsoft Visual Studio 2012 (or Microsoft Visual Web Developer
    Express)** and then click Run as administrator. The Windows
    Azure compute emulator, discussed later in this guide, requires that
    Visual Studio be launched with administrator privileges.
2.  In Visual Studio, on the **File** menu, click **New**, and then
    click **Project**.
3.  From **Installed Templates**, under **Visual C#**, click **ASP.NET
    MVC 4 Web Application**. Name the project **ProductsPortal**. Then
    click **OK**.

    ![][15]

4.  From the **Select a template** list, click **Internet Application**,
    then click **OK**.

    ![][16]

5.  In **Solution Explorer**, right click **Models** and click **Add**,
    then click **Class**. In the **Name** box, type the name
    **Product.cs**. Then click **Add**.

    ![][17]

### MODIFY THE WEB APPLICATION

1.  In the Product.cs file in Visual Studio, replace the existing
    namespace definition with the following code:

        // Declare properties for the products inventory
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
    namespace definition with the following code:

        namespace ProductsWeb.Controllers
        {
            using System.Collections.Generic;
            using System.Web.Mvc;
            using Models;

            public class HomeController : Controller
            {
                // Return a view of the products inventory
                public ActionResult Index(string Identifier, string ProductName)
                {
                    var products = new List<Product> 
                        {new Product {Id = Identifier, Name = ProductName}};
                    return View();
                }

            }
        }

3.  In the **Solution Explorer**, expand Views\Shared:

    ![][18]

4.  Next, double-click _Layout.cshtml to open it in the Visual Studio editor.

5.  Within the body tag, find the title of the page enclosed in `title` tags.
    Change the title text from My MVC Application to LITWARE's Products. Also change **your logo here** to **LITWARE's Products**.

6. Remove the **Home**, **About**, and **Contact** links. Delete the highlighted code:

	![][41]

7.  In **Solution Explorer**, expand Views\Home:

    ![][20]

8.  Double-click Index.cshtml to open it in the Visual Studio editor.
    Replace the entire contents of the file with the following code:
	
		@model IEnumerable<ProductsPortal.Models.Product>

		@{
    		ViewBag.Title = "Index";
		}

		<h2>Prod Inventory</h2>

		<table>
    		<tr>
        		<th>
            		@Html.DisplayNameFor(model => model.Name)
        		</th>
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


### RUN YOUR APPLICATION LOCALLY

Run the application to verify that it works.

1.  Ensure that **ProductsPortal** is the active project. Right-click
    the project name in **Solution Explorer** and select **Set As
    Startup Project**
2.  Within **Visual Studio**, press **F5**.
3.  Your application should appear running in a browser:

    ![][21]

    <h2><span class="short-header">DEPLOY TO WINDOWS AZURE</span>MAKE YOUR APPLICATION READY TO DEPLOY TO WINDOWS AZURE</h2>

    Now, you will prepare your application to run in a Windows Azure
    hosted service. Your application already includes a Windows Azure
    deployment project. The deployment project contains configuration
    information that is needed to properly run your application in the
    cloud.

    1.  To make your application deployable to the cloud, right-click
        the **ProductsPortal** project in **Solution Explorer** and
        click **Add Windows Azure Deployment Project**.

        ![][22]

    2.  To test your application, press **F5**.
    3.  This will start the Windows Azure compute emulator. The compute
        emulator uses the local computer to emulate your application
        running in Windows Azure. You can confirm the emulator has
        started by looking at the system tray:

        ![][23]

    4.  A browser will still display your application running locally,
        and it will look and function the same way it did when you ran
        it earlier as a regular ASP.NET MVC 3 application.

    <h2><span class="short-header">PUT THE PIECES TOGETHER</span>PUT THE PIECES TOGETHER</h2>

    The next step is to hook up the on-premises products server with the
    ASP.NET MVC3 application.

    1.  If it is not already open, in Visual Studio re-open the
        **ProductsPortal** project you created in the "Creating an
        ASP.NET MVC 3 Application" section.

    2.  Similar to the step in the "Create an On-Premises Server"
        section, add the NuGet package to the project References. In
        Solution Explorer, right-click **References**, then click
        **Manage NuGet Packages**.

    3.  Search for "WindowsAzure.ServiceBus" and select the **Windows
        Azure Service Bus** item. Then complete the installation and
        close this dialog.

    4.  In Solution Explorer, right-click the **ProductsPortal**
        project, then click **Add**, then **Existing Item**.

    5.  Navigate to the **ProductsContract.cs** file from the
        **ProductsServer** console project. Click to highlight
        ProductsContract.cs. Click the down arrow next to **Add**, then
        click **Add as Link**.

        ![][24]

    6.  Now open the **HomeController.cs** file in the Visual Studio
        editor and replace the namespace definition with the following
        code. Be sure to replace *yourServiceNamespace* with the name of
        your service namespace, and *yourIssuerSecret* with your key.
        This will allow the client to call the on-premises service,
        returning the result of the call.

            using System;
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
                    static ChannelFactory<IProductsChannel> channelFactory;

                    static HomeController()
                    {
                        // Create shared secret token credentials for authentication 
                        channelFactory = new ChannelFactory<IProductsChannel>(new NetTcpRelayBinding(), 
                            "sb://yourServiceNamespace.servicebus.windows.net/products");
                        channelFactory.Endpoint.Behaviors.Add(new TransportClientEndpointBehavior { 
                            TokenProvider = TokenProvider.CreateSharedSecretTokenProvider(
                                "owner", "yourIssuerSecret") });
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

    7.  In Solution Explorer, right-click on the **ProductsPortal**
        solution, click **Add**, then click **Existing Project**.

    8.  Navigate to the **ProductsServer** project, then double-click
        the **ProductsServer.csproj** solution file to add it.

    9.  In Solution Explorer, right-click the **ProductsPortal**
        solution and click **Properties**.

    10. On the left-hand side, click **Startup Project**. On the
        right-hand side, cick **Multiple startup projects**. Ensure that
        **ProductsServer**, **ProductsPortal.Azure**, and
        **ProductsPortal** appear, in that order, with **Start** set as
        the action for **ProductsServer** and **ProductsPortal.Azure**,
        and **None** set as the action for **ProductsPortal**. For
        example:

        ![][25]

    11. Still in the Properties dialog, click **ProjectDependencies** on
        the left-hand side.

    12. In the **Project Dependencies** dropdown, click
        **ProductsServer**. Ensure that **ProductsPortal** is unchecked,
        and **ProductsPortal.Azure**is checked. Then click **OK**:

        ![][26]

    <h2><span class="short-header">RUN THE APPLICATION</span>RUN THE APPLICATION</h2>

    1.  From the **File** menu in Visual Studio, click **Save All**.

    2.  Press **F5** to build and run the application. The on-premises
        server (the **ProductsServer** console application) should start
        first, then the **ProductsWeb** application should start in a
        browser window, as shown in the screenshot below. This time, you
        will see that the product inventory lists data retrieved from
        the product service on-premises system.

        ![][1]

    <h2><span class="short-header">DEPLOY THE APPLICATION</span>DEPLOY YOUR APPLICATION TO WINDOWS AZURE</h2>

    1.  Right-click on the **ProductsPortal** project in **Solution
        Explorer** and click **Publish to Windows Azure**.

    2.  The first time you publish to Windows Azure, you will first have
        to download credentials via the link provided in Visual Studio.

        Click **Sign in to download credentials**:

        ![][27]

    3.  Sign-in using your Live ID:

        ![][28]

    4.  Save the publish profile file to a location on your hard drive
        where you can retrieve it:

        ![][29]

    5.  Within the publish dialog, click on **Import**:

        ![][30]

    6.  Browse for and select the file that you just downloaded, then
        click **Next**.
    7.  Pick the Windows Azure subscription you would like to publish
        to:

        ![][31]

    8.  7.If your subscription doesn’t already contain any hosted
        services, you will be asked to create one. The hosted service
        acts as a container for your application within your Windows
        Azure subscription. Enter a name that identifies your
        application and choose the region for which the application
        should be optimized. (You can expect faster loading times for
        users accessing it from this region.)

        ![][32]

    9.  Select the hosted service you would like to publish your
        application to. Keep the defaults as shown below for the
        remaining settings. Click **Next**:

        ![][33]

    10. On the last page, click **Publish** to start the deployment
        process:

        ![][34]

        This will take approximately 5-7 minutes. Since this is the
        first time you are publishing, Windows Azure provisions a
        virtual machine (VM), performs security hardening, creates a Web
        role on the VM to host your application, deploys your code to
        that Web role, and finally configures the load balancer and
        networking so your application is available to the public.

    11. While publishing is in progress you will be able to monitor the
        activity in the **Windows Azure Activity Log** window, which is
        typically docked to the bottom of Visual Studio or Visual Web
        Developer:

        ![][35]

    12. When deployment is complete, you can view your Web site by
        clicking the **Website URL**link in the monitoring window.

        ![][36]

        Your Web site depends on your on-premises server, so you must
        run the **ProductsServer**application locally for the Web site
        to function properly. As you perform requests on the cloud Web
        site, you will see requests coming into your on-premises console
        application, as indicated by the "GetProducts called" output
        displayed in the screenshot below.

        ![][37]

    <h2><span class="short-header">DELETE THE APPLICATION</span>STOP AND DELETE YOUR APPLICATION</h2>

    After deploying your application, you may want to disable it so you
    can build and deploy other applications within the free 750
    hours/month (31 days/month) of server time.

    Windows Azure bills web role instances per hour of server time
    consumed. Server time is consumed once your application is deployed,
    even if the instances are not running and are in the stopped state.
    A free account includes 750 hours/month (31 days/month) of dedicated
    virtual machine server time for hosting these web role instances.

    The following steps show you how to stop and delete your
    application.

    1.  Login to the Windows Azure Management Portal,
        http://windows.azure.com, and click on Hosted Sevices, Storage
        Accounts & CDN, then Hosted Services:

        ![][33]

    2.  Click on Stop to temporarily suspend your application. You will
        be able to start it again just by clicking on Start. Click on
        Delete to completely remove your application from Windows Azure
        with no ability to restore it.

        ![][34]

  [0]: ../../../DevCenter/dotNet/Media/hybrid.png
  [1]: ../../../DevCenter/dotNet/Media/App2.png
  [Get Tools and SDK]: http://go.microsoft.com/fwlink/?LinkId=271920
  [2]: ../../../DevCenter/dotNet/Media/getting-started-3.png
  [3]: ../../../DevCenter/dotNet/Media/getting-started-4-WebPI.png
  [http://www.windowsazure.com]: http://www.windowsazure.com
  [4]: ../../../DevCenter/dotNet/Media/getting-started-hybrid-32.png
  [Windows Azure Management Portal]: http://manage.windowsazure.com
  [5]: ../../../DevCenter/dotNet/Media/sb-queues-03.png
  [6]: ../../../DevCenter/dotNet/Media/sb-queues-04.png
  [7]: ../../../DevCenter/dotNet/Media/sb-queues-05.png
  [8]: ../../../DevCenter/dotNet/Media/sb-queues-06.png
  [9]: ../../../DevCenter/dotNet/Media/sb-queues-07.png
  [Using the NuGet Service Bus Package]: http://go.microsoft.com/fwlink/?LinkId=234589
  [10]: ../../../DevCenter/dotNet/Media/hy-web-1.png
  [11]: ../../../DevCenter/dotNet/Media/hy-con-1.jpg
  [12]: ../../../DevCenter/dotNet/Media/hy-con-3.png
  [13]: ../../../DevCenter/dotNet/Media/getting-started-multi-tier-13.png
  [14]: ../../../DevCenter/dotNet/Media/hy-con-4.png
  [15]: ../../../DevCenter/dotNet/Media/hy-web-2.jpg
  [16]: ../../../DevCenter/dotNet/Media/hy-web-4.png
  [17]: ../../../DevCenter/dotNet/Media/hy-web-7.jpg
  [18]: ../../../DevCenter/dotNet/Media/hy-web-10.jpg
  [19]: ../../../DevCenter/dotNet/Media/getting-started-8.png
  [20]: ../../../DevCenter/dotNet/Media/hy-web-11.jpg
  [21]: ../../../DevCenter/dotNet/Media/App1.png
  [22]: ../../../DevCenter/dotNet/Media/getting-started-hybrid-21.png
  [23]: ../../../DevCenter/dotNet/Media/getting-started-hybrid-22.png
  [24]: ../../../DevCenter/dotNet/Media/hy-web-12.jpg
  [25]: ../../../DevCenter/dotNet/Media/hy-web-13.jpg
  [26]: ../../../DevCenter/dotNet/Media/hy-web-14.jpg
  [27]: ../../../DevCenter/dotNet/Media/getting-started-hybrid-33.png
  [28]: ../../../DevCenter/dotNet/Media/getting-started-hybrid-34.png
  [29]: ../../../DevCenter/dotNet/Media/getting-started-hybrid-25.png
  [30]: ../../../DevCenter/dotNet/Media/getting-started-hybrid-36.png
  [31]: ../../../DevCenter/dotNet/Media/getting-started-hybrid-37.png
  [32]: ../../../DevCenter/dotNet/Media/getting-started-hybrid-38.png
  [33]: ../../../DevCenter/dotNet/Media/getting-started-hybrid-39.png
  [34]: ../../../DevCenter/dotNet/Media/getting-started-hybrid-40.png
  [35]: ../../../DevCenter/dotNet/Media/getting-started-hybrid-41.png
  [36]: ../../../DevCenter/dotNet/Media/App3.png
  [37]: ../../../DevCenter/dotNet/Media/hy-service1.png
  [38]: ../../../DevCenter/dotNet/Media/getting-started-multi-tier-27.png
  [39]: ../../../DevCenter/dotNet/Media/sb-queues-09.png
  [40]: ../../../DevCenter/dotNet/Media/sb-queues-06.png
  [41]: ../../../DevCenter/dotNet/Media/getting-started-multi-tier-40.png
  [42]: ../Media/getting-started-41.png