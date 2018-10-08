---
title: REST tutorial using Azure Relay | Microsoft Docs
description: Build a simple Azure Service Bus Relay host application that exposes a REST-based interface.
services: service-bus-relay
documentationcenter: na
author: spelluru
manager: timlt
editor: ''

ms.assetid: 1312b2db-94c4-4a48-b815-c5deb5b77a6a
ms.service: service-bus-relay
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/06/2017
ms.author: spelluru

---
# Azure WCF Relay REST tutorial

This tutorial describes how to build a simple Azure Relay host application that exposes a REST-based interface. REST enables a web client, such as a web browser, to access the Service Bus APIs through HTTP requests.

The tutorial uses the Windows Communication Foundation (WCF) REST programming model to construct a REST service on Azure Relay. For more information, see [WCF REST Programming Model](/dotnet/framework/wcf/feature-details/wcf-web-http-programming-model) and [Designing and Implementing Services](/dotnet/framework/wcf/designing-and-implementing-services) in the WCF documentation.

## Step 1: Create a namespace

To begin using the relay features in Azure, you must first create a service namespace. A namespace provides a scoping container for addressing Azure resources within your application. Follow the [instructions here](relay-create-namespace-portal.md) to create a Relay namespace.

## Step 2: Define a REST-based WCF service contract to use with Azure Relay

When you create a WCF REST-style service, you must define the contract. The contract specifies what operations the host supports. A service operation can be thought of as a web service method. Contracts are created by defining a C++, C#, or Visual Basic interface. Each method in the interface corresponds to a specific service operation. The [ServiceContractAttribute](/dotnet/api/system.servicemodel.servicecontractattribute) attribute must be applied to each interface, and the [OperationContractAttribute](/dotnet/api/system.servicemodel.operationcontractattribute) attribute must be applied to each operation. If a method in an interface that has the [ServiceContractAttribute](/dotnet/api/system.servicemodel.servicecontractattribute) does not have the [OperationContractAttribute](/dotnet/api/system.servicemodel.operationcontractattribute), that method is not exposed. The code used for these tasks is shown in the example following the procedure.

The primary difference between a WCF contract and a REST-style contract is the addition of a property to the [OperationContractAttribute](/dotnet/api/system.servicemodel.operationcontractattribute): [WebGetAttribute](/dotnet/api/system.servicemodel.web.webgetattribute). This property enables you to map a method in your interface to a method on the other side of the interface. This example uses the [WebGetAttribute](/dotnet/api/system.servicemodel.web.webgetattribute) attribute to link a method to HTTP GET. This enables Service Bus to accurately retrieve and interpret commands sent to the interface.

### To create a contract with an interface

1. Open Visual Studio as an administrator: right-click the program in the **Start** menu, and then click **Run as administrator**.
2. Create a new console application project. Click the **File** menu and select **New**, then select **Project**. In the **New Project** dialog box, click **Visual C#**, select the **Console Application** template, and name it **ImageListener**. Use the default **Location**. Click **OK** to create the project.
3. For a C# project, Visual Studio creates a `Program.cs` file. This class contains an empty `Main()` method, required for a console application project to build correctly.
4. Add references to Service Bus and **System.ServiceModel.dll** to the project by installing the Service Bus NuGet package. This package automatically adds references to the Service Bus libraries, as well as the WCF **System.ServiceModel**. In Solution Explorer, right-click the **ImageListener** project, and then click **Manage NuGet Packages**. Click the **Browse** tab, then search for `Microsoft Azure Service Bus`. Click **Install**, and accept the terms of use.
5. You must explicitly add a reference to **System.ServiceModel.Web.dll** to the project:
   
    a. In Solution Explorer, right-click the **References** folder under the project folder and then click **Add Reference**.
   
    b. In the **Add Reference** dialog box, click the **Framework** tab on the left-hand side and in the **Search** box, type **System.ServiceModel.Web**. Select the **System.ServiceModel.Web** check box, then click **OK**.
6. Add the following `using` statements at the top of the Program.cs file.
   
    ```csharp
    using System.ServiceModel;
    using System.ServiceModel.Channels;
    using System.ServiceModel.Web;
    using System.IO;
    ```
   
    [System.ServiceModel](/dotnet/api/system.servicemodel) is the namespace that enables programmatic access to basic features of WCF. WCF Relay uses many of the objects and attributes of WCF to define service contracts. You use this namespace in most of your relay applications. Similarly, [System.ServiceModel.Channels](/dotnet/api/system.servicemodel.channels) helps define the channel, which is the object through which you communicate with Azure Relay and the client web browser. Finally, [System.ServiceModel.Web](/dotnet/api/system.servicemodel.web) contains the types that enable you to create web-based applications.
7. Rename the `ImageListener` namespace to **Microsoft.ServiceBus.Samples**.
   
    ```csharp
    namespace Microsoft.ServiceBus.Samples
    {
        ...
    ```
8. Directly after the opening curly brace of the namespace declaration, define a new interface named **IImageContract** and apply the **ServiceContractAttribute** attribute to the interface with a value of `http://samples.microsoft.com/ServiceModel/Relay/`. The namespace value differs from the namespace that you use throughout the scope of your code. The namespace value is used as a unique identifier for this contract, and should have version information. For more information, see [Service Versioning](http://go.microsoft.com/fwlink/?LinkID=180498). Specifying the namespace explicitly prevents the default namespace value from being added to the contract name.
   
    ```csharp
    [ServiceContract(Name = "ImageContract", Namespace = "http://samples.microsoft.com/ServiceModel/Relay/RESTTutorial1")]
    public interface IImageContract
    {
    }
    ```
9. Within the `IImageContract` interface, declare a method for the single operation the `IImageContract` contract exposes in the interface and apply the `OperationContractAttribute` attribute to the method that you want to expose as part of the public Service Bus contract.
   
    ```csharp
    public interface IImageContract
    {
        [OperationContract]
        Stream GetImage();
    }
    ```
10. In the **OperationContract** attribute, add the **WebGet** value.
    
    ```csharp
    public interface IImageContract
    {
        [OperationContract, WebGet]
        Stream GetImage();
    }
    ```
    
    Doing so enables the relay service to route HTTP GET requests to `GetImage`, and to translate the return values of `GetImage` into an HTTP GETRESPONSE reply. Later in the tutorial, you will use a web browser to access this method, and to display the image in the browser.
11. Directly after the `IImageContract` definition, declare a channel that inherits from both the `IImageContract` and `IClientChannel` interfaces.
    
    ```csharp
    public interface IImageChannel : IImageContract, IClientChannel { }
    ```
    
    A channel is the WCF object through which the service and client pass information to each other. Later, you create the channel in your host application. Azure Relay then uses this channel to pass the HTTP GET requests from the browser to your **GetImage** implementation. The relay also uses the channel to take the **GetImage** return value and translate it into an HTTP GETRESPONSE for the client browser.
12. From the **Build** menu, click **Build Solution** to confirm the accuracy of your work so far.

### Example
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

    [ServiceContract(Name = "IImageContract", Namespace = "http://samples.microsoft.com/ServiceModel/Relay/")]
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

## Step 3: Implement a REST-based WCF service contract to use Service Bus
Creating a REST-style WCF Relay service requires that you first create the contract, which is defined by using an interface. The next step is to implement the interface. This involves creating a class named **ImageService** that implements the user-defined **IImageContract** interface. After you implement the contract, you then configure the interface using an App.config file. The configuration file contains necessary information for the application, such as the name of the service, the name of the contract, and the type of protocol that is used to communicate with the relay service. The code used for these tasks is provided in the example following the procedure.

As with the previous steps, there is very little difference between implementing a REST-style contract and a WCF Relay contract.

### To implement a REST-style Service Bus contract
1. Create a new class named **ImageService** directly after the definition of the **IImageContract** interface. The **ImageService** class implements the **IImageContract** interface.
   
    ```csharp
    class ImageService : IImageContract
    {
    }
    ```
    Similar to other interface implementations, you can implement the definition in a different file. However, for this tutorial, the implementation appears in the same file as the interface definition and `Main()` method.
2. Apply the [ServiceBehaviorAttribute](/dotnet/api/system.servicemodel.servicebehaviorattribute) attribute to the **IImageService** class to indicate that the class is an implementation of a WCF contract.
   
    ```csharp
    [ServiceBehavior(Name = "ImageService", Namespace = "http://samples.microsoft.com/ServiceModel/Relay/")]
    class ImageService : IImageContract
    {
    }
    ```
   
    As mentioned previously, this namespace is not a traditional namespace. Instead, it is part of the WCF architecture that identifies the contract. For more information, see the [Data Contract Names](https://msdn.microsoft.com/library/ms731045.aspx) article in the WCF documentation.
3. Add a .jpg image to your project.  
   
    This is a picture that the service displays in the receiving browser. Right-click your project, then click **Add**. Then click **Existing Item**. Use the **Add Existing Item** dialog box to browse to an appropriate .jpg, and then click **Add**.
   
    When adding the file, make sure that **All Files** is selected in the drop-down list next to the **File name:** field. The rest of this tutorial assumes that the name of the image is "image.jpg". If you have a different file, you must rename the image, or change your code to compensate.
4. To make sure that the running service can find the image file, in **Solution Explorer** right-click the image file, then click **Properties**. In the **Properties** pane, set **Copy to Output Directory** to **Copy if newer**.
5. Add a reference to the **System.Drawing.dll** assembly to the project, and also add the following associated `using` statements.  
   
    ```csharp
    using System.Drawing;
    using System.Drawing.Imaging;
    using Microsoft.ServiceBus;
    using Microsoft.ServiceBus.Web;
    ```
6. In the **ImageService** class, add the following constructor that loads the bitmap and prepares to send it to the client browser.
   
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
7. Directly after the previous code, add the following **GetImage** method in the **ImageService** class to return an HTTP message that contains the image.
   
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
   
    This implementation uses **MemoryStream** to retrieve the image and prepare it for streaming to the browser. It starts the stream position at zero, declares the stream content as a jpeg, and streams the information.
8. From the **Build** menu, click **Build Solution**.

### To define the configuration for running the web service on Service Bus
1. In **Solution Explorer**, double-click **App.config** to open it in the Visual Studio editor.
   
    The **App.config** file includes the service name, endpoint (that is, the location Azure Relay exposes for clients and hosts to communicate with each other), and binding (the type of protocol that is used to communicate). The main difference here is that the configured service endpoint refers to a [WebHttpRelayBinding](/dotnet/api/microsoft.servicebus.webhttprelaybinding) binding.
2. The `<system.serviceModel>` XML element is a WCF element that defines one or more services. Here, it is used to define the service name and endpoint. At the bottom of the `<system.serviceModel>` element (but still within `<system.serviceModel>`), add a `<bindings>` element that has the following content. This defines the bindings used in the application. You can define multiple bindings, but for this tutorial you are defining only one.
   
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
   
    The previous code defines a WCF Relay [WebHttpRelayBinding](/dotnet/api/microsoft.servicebus.webhttprelaybinding) binding with **relayClientAuthenticationType** set to **None**. This setting indicates that an endpoint using this binding does not require a client credential.
3. After the `<bindings>` element, add a `<services>` element. Similar to the bindings, you can define multiple services in a single configuration file. However, for this tutorial, you define only one.
   
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
   
    This step configures a service that uses the previously defined default **webHttpRelayBinding**. It also uses the default **sbTokenProvider**, which is defined in the next step.
4. After the `<services>` element, create a `<behaviors>` element with the following content, replacing "SAS_KEY" with the *Shared Access Signature* (SAS) key you previously obtained from the [Azure portal][Azure portal].
   
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
5. Still in App.config, in the `<appSettings>` element, replace the entire connection string value with the connection string you previously obtained from the portal. 
   
    ```xml
    <appSettings>
       <!-- Service Bus specific app settings for messaging connections -->
       <add key="Microsoft.ServiceBus.ConnectionString"
           value="Endpoint=sb://yourNamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=YOUR_SAS_KEY"/>
    </appSettings>
    ```
6. From the **Build** menu, click **Build Solution** to build the entire solution.

### Example
The following code shows the contract and service implementation for a REST-based service that is running on  Service Bus using the **WebHttpRelayBinding** binding.

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


    [ServiceContract(Name = "ImageContract", Namespace = "http://samples.microsoft.com/ServiceModel/Relay/")]
    public interface IImageContract
    {
        [OperationContract, WebGet]
        Stream GetImage();
    }

    public interface IImageChannel : IImageContract, IClientChannel { }

    [ServiceBehavior(Name = "ImageService", Namespace = "http://samples.microsoft.com/ServiceModel/Relay/")]
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

The following example shows the App.config file associated with the service.

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
        <!-- Service Bus specific app setings for messaging connections -->
        <add key="Microsoft.ServiceBus.ConnectionString"
            value="Endpoint=sb://yourNamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey="YOUR_SAS_KEY"/>
    </appSettings>
</configuration>
```

## Step 4: Host the REST-based WCF service to use Azure Relay
This step describes how to run a web service using a console application with WCF Relay. A complete listing of the code written in this step is provided in the example following the procedure.

### To create a base address for the service
1. In the `Main()` function declaration, create a variable to store the namespace of your project. Make sure to replace `yourNamespace` with the name of the Relay namespace you created previously.
   
    ```csharp
    string serviceNamespace = "yourNamespace";
    ```
    Service Bus uses the name of your namespace to create a unique URI.
2. Create a `Uri` instance for the base address of the service that is based on the namespace.
   
    ```csharp
    Uri address = ServiceBusEnvironment.CreateServiceUri("https", serviceNamespace, "Image");
    ```

### To create and configure the web service host
* Create the web service host, using the URI address created earlier in this section.
  
    ```csharp
    WebServiceHost host = new WebServiceHost(typeof(ImageService), address);
    ```
    The service host is the WCF object that instantiates the host application. This example passes it the type of host you want to create (an **ImageService**), and also the address at which you want to expose the host application.

### To run the web service host
1. Open the service.
   
    ```csharp
    host.Open();
    ```
    The service is now running.
2. Display a message indicating that the service is running, and how to stop the service.
   
    ```csharp
    Console.WriteLine("Copy the following address into a browser to see the image: ");
    Console.WriteLine(address + "GetImage");
    Console.WriteLine();
    Console.WriteLine("Press [Enter] to exit");
    Console.ReadLine();
    ```
3. When finished, close the service host.
   
    ```csharp
    host.Close();
    ```

## Example
The following example includes the service contract and implementation from previous steps in the tutorial and hosts the service in a console application. Compile the following code into an executable named ImageListener.exe.

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

    [ServiceContract(Name = "ImageContract", Namespace = "http://samples.microsoft.com/ServiceModel/Relay/")]
    public interface IImageContract
    {
        [OperationContract, WebGet]
        Stream GetImage();
    }

    public interface IImageChannel : IImageContract, IClientChannel { }

    [ServiceBehavior(Name = "ImageService", Namespace = "http://samples.microsoft.com/ServiceModel/Relay/")]
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

### Compiling the code
After building the solution, do the following to run the application:

1. Press **F5**, or browse to the executable file location (ImageListener\bin\Debug\ImageListener.exe), to run the service. Keep the app running, as it's required to perform the next step.
2. Copy and paste the address from the command prompt into a browser to see the image.
3. When you are finished, press **Enter** in the command prompt window to close the app.

## Next steps
Now that you've built an application that uses the Azure Relay service, see the following articles to learn more:

* [Azure Relay overview](relay-what-is-it.md)
* [How to use the WCF relay service with .NET](relay-wcf-dotnet-get-started.md)

[Azure portal]: https://portal.azure.com
