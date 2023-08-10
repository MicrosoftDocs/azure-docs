---
title: 'Tutorial: REST tutorial using Azure Relay'
description: 'Tutorial: Build an Azure Relay host application that exposes a REST-based interface.'
ms.topic: tutorial
ms.custom: devx-track-csharp
ms.date: 06/21/2022
---

# Tutorial: Azure WCF Relay REST tutorial

This tutorial describes how to build an Azure Relay host application that exposes a REST-based interface. REST enables a web client, such as a web browser, to access the Service Bus APIs through HTTP requests.

The tutorial uses the Windows Communication Foundation (WCF) REST programming model to construct a REST service on Azure Relay. For more information, see [WCF REST Programming Model](/dotnet/framework/wcf/feature-details/wcf-web-http-programming-model) and [Designing and Implementing Services](/dotnet/framework/wcf/designing-and-implementing-services).

You do the following tasks in this tutorial:

> [!div class="checklist"]
>
> * Install prerequisites for this tutorial.
> * Create a Relay namespace.
> * Define a REST-based WCF service contract.
> * Implement the REST-based WCF contract.
> * Host and run the REST-based WCF service.
> * Run and test the service.

## Prerequisites

To complete this tutorial, you need the following prerequisites:

* An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.
* [Visual Studio 2015 or later](https://www.visualstudio.com). The examples in this tutorial use Visual Studio 2019.
* Azure SDK for .NET. Install it from the [SDK downloads page](https://azure.microsoft.com/downloads/).

## Create a Relay namespace

To begin using the relay features in Azure, you must first create a service namespace. A namespace provides a scoping container for addressing Azure resources within your application. Follow the [instructions here](relay-create-namespace-portal.md) to create a Relay namespace.

## Define a REST-based WCF service contract to use with Azure Relay

When you create a WCF REST-style service, you must define the contract. The contract specifies what operations the host supports. A service operation resembles a web service method. Define a contract with a C++, C#, or Visual Basic interface. Each method in the interface corresponds to a specific service operation. Apply the [ServiceContractAttribute](/dotnet/api/system.servicemodel.servicecontractattribute) attribute to each interface, and apply the [OperationContractAttribute](/dotnet/api/system.servicemodel.operationcontractattribute) attribute to each operation. 

> [!TIP]
> If a method in an interface that has the [ServiceContractAttribute](/dotnet/api/system.servicemodel.servicecontractattribute) doesn't have the [OperationContractAttribute](/dotnet/api/system.servicemodel.operationcontractattribute), that method isn't exposed. The code used for these tasks appears in the example following the procedure.

The primary difference between a WCF contract and a REST-style contract is the addition of a property to the [OperationContractAttribute](/dotnet/api/system.servicemodel.operationcontractattribute): [WebGetAttribute](/dotnet/api/system.servicemodel.web.webgetattribute). This property enables you to map a method in your interface to a method on the other side of the interface. This example uses the [WebGetAttribute](/dotnet/api/system.servicemodel.web.webgetattribute) attribute to link a method to `HTTP GET`. This approach enables Service Bus to accurately retrieve and interpret commands sent to the interface.

### To create a contract with an interface

1. Start Microsoft Visual Studio as an administrator. To do so, right-click the Visual Studio program icon, and select **Run as administrator**.
1. In Visual Studio, select **Create a new project**.
1. In **Create a new project**, choose **Console App (.NET Framework)** for C# and select **Next**.
1. Name the project *ImageListener*. Use the default **Location**, and then select **Create**.

   For a C# project, Visual Studio creates a *Program.cs* file. This class contains an empty `Main()` method, required for a console application project to build correctly.

1. In **Solution Explorer**, right-click the **ImageListener** project, then select **Manage NuGet Packages**.
1. Select **Browse**, then search for and choose **WindowsAzure.ServiceBus**. Select **Install**, and accept the terms of use.

    This step adds references to Service Bus and *System.ServiceModel.dll*. This package automatically adds references to the Service Bus libraries and the WCF `System.ServiceModel`.

1. Explicitly add a reference to `System.ServiceModel.Web.dll` to the project. In **Solution Explorer**, right-click **References** under the project folder, and select **Add Reference**.
1. In **Add Reference**, select **Framework** and enter *System.ServiceModel.Web* in **Search**. Select the **System.ServiceModel.Web** check box, then click **OK**.

Next, make the following code changes to the project:

1. Add the following `using` statements at the top of the *Program.cs* file.

    ```csharp
    using System.ServiceModel;
    using System.ServiceModel.Channels;
    using System.ServiceModel.Web;
    using System.IO;
    ```

    * [System.ServiceModel](/dotnet/api/system.servicemodel) is the namespace that enables programmatic access to basic features of WCF. WCF Relay uses many of the objects and attributes of WCF to define service contracts. You use this namespace in most of your relay applications.
    * [System.ServiceModel.Channels](/dotnet/api/system.servicemodel.channels) helps define the channel, which is the object through which you communicate with Azure Relay and the client web browser.
    * [System.ServiceModel.Web](/dotnet/api/system.servicemodel.web) contains the types that enable you to create web-based applications.

1. Rename the `ImageListener` namespace to `Microsoft.ServiceBus.Samples`.

    ```csharp
    namespace Microsoft.ServiceBus.Samples
    {
        ...
    ```

1. Directly after the opening curly brace of the namespace declaration, define a new interface named `IImageContract` and apply the `ServiceContractAttribute` attribute to the interface with a value of `https://samples.microsoft.com/ServiceModel/Relay/RESTTutorial1`. 

    ```csharp
    [ServiceContract(Name = "ImageContract", Namespace = "https://samples.microsoft.com/ServiceModel/Relay/RESTTutorial1")]
    public interface IImageContract
    {
    }
    ```

    The namespace value differs from the namespace that you use throughout the scope of your code. The namespace value is a unique identifier for this contract, and should have version information. For more information, see [Service Versioning](/dotnet/framework/wcf/service-versioning). Specifying the namespace explicitly prevents the default namespace value from being added to the contract name.

1. Within the `IImageContract` interface, declare a method for the single operation that the `IImageContract` contract exposes in the interface and apply the `OperationContract` attribute to the method that you want to expose as part of the public Service Bus contract.

    ```csharp
    public interface IImageContract
    {
        [OperationContract]
        Stream GetImage();
    }
    ```

1. In the `OperationContract` attribute, add the `WebGet` value.

    ```csharp
    public interface IImageContract
    {
        [OperationContract, WebGet]
        Stream GetImage();
    }
    ```

   Adding the `WebGet` value enables the relay service to route HTTP GET requests to `GetImage`, and to translate the return values of `GetImage` into an `HTTP GETRESPONSE` reply. Later in the tutorial, you'll use a web browser to access this method, and to display the image in the browser.

1. Directly after the `IImageContract` definition, declare a channel that inherits from both the `IImageContract` and `IClientChannel` interfaces.

    ```csharp
    public interface IImageChannel : IImageContract, IClientChannel { }
    ```

   A channel is the WCF object through which the service and client pass information to each other. Later, you create the channel in your host application. Azure Relay then uses this channel to pass the HTTP GET requests from the browser to your `GetImage` implementation. The relay also uses the channel to take the `GetImage` return value and translate it into an `HTTP GETRESPONSE` for the client browser.

1. Select **Build** > **Build Solution** to confirm the accuracy of your work so far.

### Example that defines a WCF Relay contract

The following code shows a basic interface that defines a WCF Relay contract.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Web;
using System.IO;

namespace Microsoft.ServiceBus.Samples
{

    [ServiceContract(Name = "IImageContract", Namespace = "https://samples.microsoft.com/ServiceModel/Relay/")]
    public interface IImageContract
    {
        [OperationContract, WebGet]
        Stream GetImage();
    }

    public interface IImageChannel : IImageContract, IClientChannel { }

    class Program
    {
        static void Main(string[] args)
        {
        }
    }
}
```

## Implement the REST-based WCF service contract

To create a REST-style WCF Relay service, first create the contract by using an interface. The next step is to implement the interface. This procedure involves creating a class named `ImageService` that implements the user-defined `IImageContract` interface. After you implement the contract, you then configure the interface by using an *App.config* file. The configuration file contains necessary information for the application. This information includes the name of the service, the name of the contract, and the type of protocol that is used to communicate with the relay service. The code used for these tasks appears in the example following the procedure.

As with the previous steps, there's little difference between implementing a REST-style contract and a WCF Relay contract.

### To implement a REST-style Service Bus contract

1. Create a new class named `ImageService` directly after the definition of the `IImageContract` interface. The `ImageService` class implements the `IImageContract` interface.

    ```csharp
    class ImageService : IImageContract
    {
    }
    ```

    Similar to other interface implementations, you can implement the definition in a different file. However, for this tutorial, the implementation appears in the same file as the interface definition and `Main()` method.

1. Apply the [ServiceBehaviorAttribute](/dotnet/api/system.servicemodel.servicebehaviorattribute) attribute to the `IImageService` class to indicate that the class is an implementation of a WCF contract.

    ```csharp
    [ServiceBehavior(Name = "ImageService", Namespace = "https://samples.microsoft.com/ServiceModel/Relay/")]
    class ImageService : IImageContract
    {
    }
    ```

    As mentioned previously, this namespace isn't a traditional namespace. It's part of the WCF architecture that identifies the contract. For more information, see the [Data Contract Names](/dotnet/framework/wcf/feature-details/data-contract-names/).

1. Add a *.jpg* image to your project. This file is a picture that the service displays in the receiving browser.

   1. Right-click your project and select **Add**.
   1. Then select **Existing Item**.
   1. Use **Add Existing Item** to browse to an appropriate .jpg, and then select **Add**. When adding the file, select **All Files** from the drop-down list next to **File name**.

   The rest of this tutorial assumes that the name of the image is *image.jpg*. If you have a different file, you must rename the image, or change your code to compensate.

1. To make sure that the running service can find the image file, in **Solution Explorer** right-click the image file, then choose **Properties**. In **Properties**, set **Copy to Output Directory** to **Copy if newer**.

1. Use the procedure in [To create a contract with an interface](#to-create-a-contract-with-an-interface) to add a reference to the *System.Drawing.dll* assembly to the project.

1. Add the following associated `using` statements:

    ```csharp
    using System.Drawing;
    using System.Drawing.Imaging;
    using Microsoft.ServiceBus;
    using Microsoft.ServiceBus.Web;
    ```

1. In the `ImageService` class, add the following constructor that loads the bitmap and prepares to send it to the client browser:

    ```csharp
    class ImageService : IImageContract
    {
        const string imageFileName = "image.jpg";
   
        Image bitmap;
   
        public ImageService()
        {
            this.bitmap = Image.FromFile(imageFileName);
        }
    }
    ```

1. Directly after the previous code, add the following `GetImage` method in the `ImageService` class to return an HTTP message that contains the image.

    ```csharp
    public Stream GetImage()
    {
        MemoryStream stream = new MemoryStream();
        this.bitmap.Save(stream, ImageFormat.Jpeg);
   
        stream.Position = 0;
        WebOperationContext.Current.OutgoingResponse.ContentType = "image/jpeg";
   
        return stream;
    }
    ```

    This implementation uses `MemoryStream` to retrieve the image and prepare it for streaming to the browser. It starts the stream position at zero, declares the stream content as a *.jpg*, and streams the information.

1. Select **Build** > **Build Solution**.

### To define the configuration for running the web service on Service Bus

1. In **Solution Explorer**, double-click **App.config** to open the file in the Visual Studio editor.

    The *App.config* file includes the service name, endpoint, and binding. The endpoint is the location Azure Relay exposes for clients and hosts to communicate with each other. The binding is the type of protocol that is used to communicate. The main difference here is that the configured service endpoint refers to a [WebHttpRelayBinding](/dotnet/api/microsoft.servicebus.webhttprelaybinding) binding.

1. The `<system.serviceModel>` XML element is a WCF element that defines one or more services. Here, it's used to define the service name and endpoint. At the bottom of the `<system.serviceModel>` element, but still within `<system.serviceModel>`, add a `<bindings>` element that has the following content:

    ```xml
    <bindings>
        <!-- Application Binding -->
        <webHttpRelayBinding>
            <binding name="default">
                <security relayClientAuthenticationType="None" />
            </binding>
        </webHttpRelayBinding>
    </bindings>
    ```

    This content defines the bindings used in the application. You can define multiple bindings, but for this tutorial you're defining only one.

    The previous code defines a WCF Relay [WebHttpRelayBinding](/dotnet/api/microsoft.servicebus.webhttprelaybinding) binding with `relayClientAuthenticationType` set to `None`. This setting indicates that an endpoint using this binding doesn't require a client credential.

1. After the `<bindings>` element, add a `<services>` element. Similar to the bindings, you can define multiple services in a single configuration file. However, for this tutorial, you define only one.

    ```xml
    <services>
        <!-- Application Service -->
        <service name="Microsoft.ServiceBus.Samples.ImageService"
             behaviorConfiguration="default">
            <endpoint name="RelayEndpoint"
                    contract="Microsoft.ServiceBus.Samples.IImageContract"
                    binding="webHttpRelayBinding"
                    bindingConfiguration="default"
                    behaviorConfiguration="sbTokenProvider"
                    address="" />
        </service>
    </services>
    ```

    This content configures a service that uses the previously defined default `webHttpRelayBinding`. It also uses the default `sbTokenProvider`, which is defined in the next step.

1. After the `<services>` element, create a `<behaviors>` element with the following content, replacing `SAS_KEY` with the Shared Access Signature (SAS) key. To obtain an SAS key from the [Azure portal], see [Get management credentials](service-bus-relay-tutorial.md#get-management-credentials).

    ```xml
    <behaviors>
        <endpointBehaviors>
            <behavior name="sbTokenProvider">
                <transportClientEndpointBehavior>
                    <tokenProvider>
                        <sharedAccessSignature keyName="RootManageSharedAccessKey" key="YOUR_SAS_KEY" />
                    </tokenProvider>
                </transportClientEndpointBehavior>
            </behavior>
            </endpointBehaviors>
            <serviceBehaviors>
                <behavior name="default">
                    <serviceDebug httpHelpPageEnabled="false" httpsHelpPageEnabled="false" />
                </behavior>
            </serviceBehaviors>
    </behaviors>
    ```

1. Still in *App.config*, in the `<appSettings>` element, replace the entire connection string value with the connection string you previously obtained from the portal.

    ```xml
    <appSettings>
       <!-- Service Bus specific app settings for messaging connections -->
       <add key="Microsoft.ServiceBus.ConnectionString"
           value="Endpoint=sb://yourNamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=YOUR_SAS_KEY"/>
    </appSettings>
    ```

1. Select **Build** > **Build Solution** to build the entire solution.

### Example that implements the REST-based WCF service contract

The following code shows the contract and service implementation for a REST-based service that is running on Service Bus using the `WebHttpRelayBinding` binding.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Web;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Web;

namespace Microsoft.ServiceBus.Samples
{


    [ServiceContract(Name = "ImageContract", Namespace = "https://samples.microsoft.com/ServiceModel/Relay/")]
    public interface IImageContract
    {
        [OperationContract, WebGet]
        Stream GetImage();
    }

    public interface IImageChannel : IImageContract, IClientChannel { }

    [ServiceBehavior(Name = "ImageService", Namespace = "https://samples.microsoft.com/ServiceModel/Relay/")]
    class ImageService : IImageContract
    {
        const string imageFileName = "image.jpg";

        Image bitmap;

        public ImageService()
        {
            this.bitmap = Image.FromFile(imageFileName);
        }

        public Stream GetImage()
        {
            MemoryStream stream = new MemoryStream();
            this.bitmap.Save(stream, ImageFormat.Jpeg);

            stream.Position = 0;
            WebOperationContext.Current.OutgoingResponse.ContentType = "image/jpeg";

            return stream;
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
        }
    }
}
```

The following example shows the *App.config* file associated with the service.

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
    <startup> 
        <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.5.2"/>
    </startup>
    <system.serviceModel>
        <extensions>
            <!-- In this extension section we are introducing all known service bus extensions. User can remove the ones they don't need. -->
            <behaviorExtensions>
                <add name="connectionStatusBehavior"
                    type="Microsoft.ServiceBus.Configuration.ConnectionStatusElement, Microsoft.ServiceBus, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
                <add name="transportClientEndpointBehavior"
                    type="Microsoft.ServiceBus.Configuration.TransportClientEndpointBehaviorElement, Microsoft.ServiceBus, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
                <add name="serviceRegistrySettings"
                    type="Microsoft.ServiceBus.Configuration.ServiceRegistrySettingsElement, Microsoft.ServiceBus, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
            </behaviorExtensions>
            <bindingElementExtensions>
                <add name="netMessagingTransport"
                    type="Microsoft.ServiceBus.Messaging.Configuration.NetMessagingTransportExtensionElement, Microsoft.ServiceBus,  Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
                <add name="tcpRelayTransport"
                    type="Microsoft.ServiceBus.Configuration.TcpRelayTransportElement, Microsoft.ServiceBus, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
                <add name="httpRelayTransport"
                    type="Microsoft.ServiceBus.Configuration.HttpRelayTransportElement, Microsoft.ServiceBus, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
                <add name="httpsRelayTransport"
                    type="Microsoft.ServiceBus.Configuration.HttpsRelayTransportElement, Microsoft.ServiceBus, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
                <add name="onewayRelayTransport"
                    type="Microsoft.ServiceBus.Configuration.RelayedOnewayTransportElement, Microsoft.ServiceBus, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
            </bindingElementExtensions>
            <bindingExtensions>
                <add name="basicHttpRelayBinding"
                    type="Microsoft.ServiceBus.Configuration.BasicHttpRelayBindingCollectionElement, Microsoft.ServiceBus, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
                <add name="webHttpRelayBinding"
                    type="Microsoft.ServiceBus.Configuration.WebHttpRelayBindingCollectionElement, Microsoft.ServiceBus, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
                <add name="ws2007HttpRelayBinding"
                    type="Microsoft.ServiceBus.Configuration.WS2007HttpRelayBindingCollectionElement, Microsoft.ServiceBus, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
                <add name="netTcpRelayBinding"
                    type="Microsoft.ServiceBus.Configuration.NetTcpRelayBindingCollectionElement, Microsoft.ServiceBus, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
                <add name="netOnewayRelayBinding"
                    type="Microsoft.ServiceBus.Configuration.NetOnewayRelayBindingCollectionElement, Microsoft.ServiceBus, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
                <add name="netEventRelayBinding"
                    type="Microsoft.ServiceBus.Configuration.NetEventRelayBindingCollectionElement, Microsoft.ServiceBus, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
                <add name="netMessagingBinding"
                    type="Microsoft.ServiceBus.Messaging.Configuration.NetMessagingBindingCollectionElement, Microsoft.ServiceBus, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
            </bindingExtensions>
        </extensions>
      <bindings>
        <!-- Application Binding -->
        <webHttpRelayBinding>
          <binding name="default">
            <security relayClientAuthenticationType="None" />
          </binding>
        </webHttpRelayBinding>
      </bindings>
      <services>
        <!-- Application Service -->
        <service name="Microsoft.ServiceBus.Samples.ImageService"
             behaviorConfiguration="default">
          <endpoint name="RelayEndpoint"
                  contract="Microsoft.ServiceBus.Samples.IImageContract"
                  binding="webHttpRelayBinding"
                  bindingConfiguration="default"
                  behaviorConfiguration="sbTokenProvider"
                  address="" />
        </service>
      </services>
      <behaviors>
        <endpointBehaviors>
          <behavior name="sbTokenProvider">
            <transportClientEndpointBehavior>
              <tokenProvider>
                <sharedAccessSignature keyName="RootManageSharedAccessKey" key="YOUR_SAS_KEY" />
              </tokenProvider>
            </transportClientEndpointBehavior>
          </behavior>
        </endpointBehaviors>
        <serviceBehaviors>
          <behavior name="default">
            <serviceDebug httpHelpPageEnabled="false" httpsHelpPageEnabled="false" />
          </behavior>
        </serviceBehaviors>
      </behaviors>
    </system.serviceModel>
    <appSettings>
        <!-- Service Bus specific app settings for messaging connections -->
        <add key="Microsoft.ServiceBus.ConnectionString"
            value="Endpoint=sb://yourNamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=YOUR_SAS_KEY>"/>
    </appSettings>
</configuration>
```

## Host the REST-based WCF service to use Azure Relay

This section describes how to run a web service using a console application with WCF Relay. A complete listing of the code written in this section appears in the example following the procedure.

### To create a base address for the service

1. In the `Main()` function declaration, create a variable to store the namespace of your project. Make sure to replace `yourNamespace` with the name of the Relay namespace you created previously.

    ```csharp
    string serviceNamespace = "yourNamespace";
    ```

    Service Bus uses the name of your namespace to create a unique URI.

1. Create a `Uri` instance for the base address of the service that is based on the namespace.

    ```csharp
    Uri address = ServiceBusEnvironment.CreateServiceUri("https", serviceNamespace, "Image");
    ```

### To create and configure the web service host

Still in `Main()`, create the web service host, using the URI address created earlier in this section.
  
```csharp
WebServiceHost host = new WebServiceHost(typeof(ImageService), address);
```

The service host is the WCF object that instantiates the host application. This example passes it the type of host you want to create, which is an `ImageService`, and also the address at which you want to expose the host application.

### To run the web service host

1. Still in `Main()`, add the following line to open the service.

    ```csharp
    host.Open();
    ```

    The service is now running.

1. Display a message indicating that the service is running, and how to stop the service.

    ```csharp
    Console.WriteLine("Copy the following address into a browser to see the image: ");
    Console.WriteLine(address + "GetImage");
    Console.WriteLine();
    Console.WriteLine("Press [Enter] to exit");
    Console.ReadLine();
    ```

1. When finished, close the service host.

    ```csharp
    host.Close();
    ```

### Example of the service contract and implementation

The following example includes the service contract and implementation from previous steps in the tutorial and hosts the service in a console application. Compile the following code into an executable named *ImageListener.exe*.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Web;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Web;

namespace Microsoft.ServiceBus.Samples
{

    [ServiceContract(Name = "ImageContract", Namespace = "https://samples.microsoft.com/ServiceModel/Relay/")]
    public interface IImageContract
    {
        [OperationContract, WebGet]
        Stream GetImage();
    }

    public interface IImageChannel : IImageContract, IClientChannel { }

    [ServiceBehavior(Name = "ImageService", Namespace = "https://samples.microsoft.com/ServiceModel/Relay/")]
    class ImageService : IImageContract
    {
        const string imageFileName = "image.jpg";

        Image bitmap;

        public ImageService()
        {
            this.bitmap = Image.FromFile(imageFileName);
        }

        public Stream GetImage()
        {
            MemoryStream stream = new MemoryStream();
            this.bitmap.Save(stream, ImageFormat.Jpeg);

            stream.Position = 0;
            WebOperationContext.Current.OutgoingResponse.ContentType = "image/jpeg";

            return stream;
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            string serviceNamespace = "InsertServiceNamespaceHere";
            Uri address = ServiceBusEnvironment.CreateServiceUri("https", serviceNamespace, "Image");

            WebServiceHost host = new WebServiceHost(typeof(ImageService), address);
            host.Open();

            Console.WriteLine("Copy the following address into a browser to see the image: ");
            Console.WriteLine(address + "GetImage");
            Console.WriteLine();
            Console.WriteLine("Press [Enter] to exit");
            Console.ReadLine();

            host.Close();
        }
    }
}
```

## Run and test the service

After building the solution, do the following to run the application:

1. Select F5, or browse to the executable file location, *ImageListener\bin\Debug\ImageListener.exe*, to run the service. Keep the app running, because it's required for the next step.
1. Copy and paste the address from the command prompt into a browser to see the image.
1. When you're finished, select Enter in the command prompt window to close the app.

## Next steps

Now that you've built an application that uses the Azure Relay service, see the following articles to learn more:

* [What is Azure Relay?](relay-what-is-it.md)
* [Expose an on-premises WCF REST service to external client by using Azure WCF Relay](service-bus-relay-tutorial.md)

[Azure portal]: https://portal.azure.com
