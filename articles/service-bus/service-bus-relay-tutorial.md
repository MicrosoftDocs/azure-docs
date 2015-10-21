<properties 
   pageTitle="Service Bus relayed messaging tutorial | Microsoft Azure"
   description="Build a Service Bus client application and service using Service Bus relayed messaging."
   services="service-bus"
   documentationCenter="na"
   authors="sethmanheim"
   manager="timlt"
   editor="tysonn" />
<tags 
   ms.service="service-bus"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="09/11/2015"
   ms.author="sethm" />

# Service Bus relayed messaging tutorial

This tutorial describes how to build a simple Service Bus client application and service using the Service Bus "relay" capabilities. For a corresponding tutorial that describes how to build an application that uses the Service Bus "brokered," or asynchronous messaging capabilities, see the [Service Bus Brokered Messaging .NET Tutorial](https://msdn.microsoft.com/library/hh367512.aspx). For a similar tutorial that uses Service Bus [brokered messaging](service-bus-messaging-overview.md/#Brokered-messaging), see the [Service Bus Brokered Messaging .NET Tutorial](https://msdn.microsoft.com/library/hh367512.aspx).

Working through this tutorial gives you an understanding of the steps that are required to create a Service Bus client and service application. Like their WCF counterparts, a service is a construct that exposes one or more endpoints, each of which exposes one or more service operations. The endpoint of a service specifies an address where the service can be found, a binding that contains the information that a client must communicate with the service, and a contract that defines the functionality provided by the service to its clients. The main difference between a WCF and a Service Bus service is that the endpoint is exposed in the cloud instead of locally on your computer.

After you work through the sequence of topics in this tutorial, you will have a running service, and a client that can invoke the operations of the service. The first topic describes how to set up an account. The next steps describe how to define a service that uses a contract, how to implement the service, and how to configure the service in code. They also describe how to host and run the service. The service that is created is self-hosted and the client and service run on the same computer. You can configure the service by using either code or a configuration file. For more information, see [Configuring a WCF Service to Register with Service Bus](https://msdn.microsoft.com/library/ee173579.aspx) and [Building a Service for Service Bus](https://msdn.microsoft.com/library/ee173564.aspx).

The final three steps describe how to create a client application, configure the client application, and create and use a client that can access the functionality of the host. For more information, see [Building a Service Bus Client Application](https://msdn.microsoft.com/library/ee173543.aspx) and [Discovering and Exposing a Service Bus Service](https://msdn.microsoft.com/library/dd582704.aspx).

All of the topics in this section assume that you are using Visual Studio as the development environment.

## Sign up for an Account

The first step is to create a Service Bus service namespace, and to obtain a Shared Access Signature (SAS) key. A service namespace provides an application boundary for each application exposed through the Service Bus. The combination of service namespace and SAS key provides a credential for the Service Bus to authenticate access to an application.

To create a namespace, follow the steps outlined in [How To: Create or Modify a Service Bus Service Namespace](https://msdn.microsoft.com/library/hh690931.aspx).

>[AZURE.NOTE] You do not have to use the same namespace for both client and service applications.

1. In the main window of the Azure portal, click the name of the service namespace you created in the previous step.

2. Click **Configure** to view the default shared access policies for your service namespace.

3. Make a note of the primary key for the **RootManageSharedAccessKey** policy, or copy it to the clipboard. You will use this value later in this tutorial.

## Define a WCF service contract to use with Service Bus

The service contract specifies what operations (the Web service terminology for methods or functions) the service supports. Contracts are created by defining a C++, C#, or Visual Basic interface. Each method in the interface corresponds to a specific service operation. Each interface must have the [ServiceContractAttribute](https://msdn.microsoft.com/library/system.servicemodel.servicecontractattribute.aspx) attribute applied to it, and each operation must have the [OperationContractAttribute](https://msdn.microsoft.com/library/system.servicemodel.operationcontractattribute.aspx) attribute applied to it. If a method in an interface that has the [ServiceContractAttribute](https://msdn.microsoft.com/library/system.servicemodel.servicecontractattribute.aspx) attribute does not have the [OperationContractAttribute](https://msdn.microsoft.com/library/system.servicemodel.operationcontractattribute.aspx) attribute, that method is not exposed. The code for these tasks is provided in the example following the procedure. For more information about how to define a contract, see [Designing a WCF Contract for Service Bus](https://msdn.microsoft.com/library/ee173585.aspx). For a larger discussion of contracts and services, see [Designing and Implementing Services](https://msdn.microsoft.com/library/ms729746.aspx) in the WCF documentation.

### To create a Service Bus contract with an interface

1. Open Visual Studio as an administrator by right-clicking the program in the **Start** menu and selecting **Run as administrator**.

1. Create a new console application project. Click the **File** menu and select **New**, then click **Project**. In the **New Project** dialog, click **Visual C#** (if **Visual C#** does not appear, look under **Other Languages**). Click the **Console Application** template, and name it **EchoService**. Use the default **Location**. Click **OK** to create the project.

1. Add a reference to `System.ServiceModel.dll` to the project: in Solution Explorer, right-click the **References** folder under the project folder, and then click **Add Reference**. Select the **.NET** tab in the **Add Reference** dialog and scroll down until you see **System.ServiceModel**. Select it, and then click **OK**.

1. In Solution Explorer, double-click the Program.cs file to open it in the editor.

1. Add a `using` statement for the System.ServiceModel namespace.

	```
	using System.ServiceModel;
	```

	[System.ServiceModel](https://msdn.microsoft.com/library/system.servicemodel.aspx) is the namespace that enables you to programmatically access the basic features of WCF. Service Bus uses many of the objects and attributes of WCF to define service contracts.

1. Change the namespace name from its default name of **EchoService** to **Microsoft.ServiceBus.Samples**.

	>[AZURE.IMPORTANT] This tutorial uses the C# namespace Micr**osoft.ServiceBus.Samples**, which is the namespace of the contract managed type that is used in the configuration file in Step 6: Configure the WCF Client. You can specify any namespace you want when you build this sample; however, the tutorial will not work unless you then modify the namespaces of the contract and service accordingly, in the application configuration file. The namespace specified in the App.config file must be the same as the namespace specified in your C# files.

1. Directly after the `Microsoft.ServiceBus.Samples` namespace declaration, but within the namespace, define a new interface named `IEchoContract` and apply the `ServiceContractAttribute` attribute to the interface with a namespace value of **http://samples.microsoft.com/ServiceModel/Relay/**. The namespace value differs from the namespace that you use throughout the scope of your code. Instead, the namespace value is used as a unique identifier for this contract. Specifying the namespace explicitly prevents the default namespace value from being added to the contract name.

	```
	[ServiceContract(Name = "IEchoContract", Namespace = "http://samples.microsoft.com/ServiceModel/Relay/")]
	publicinterface IEchoContract
	{
	}
	```

	>[AZURE.NOTE] Typically, the service contract namespace contains a naming scheme that includes version information. Including version information in the service contract namespace enables services to isolate major changes by defining a new service contract with a new namespace and exposing it on a new endpoint. In in this manner, clients can continue to use the old service contract without having to be updated. Version information can consist of a date or a build number. For more information, see [Service Versioning](http://go.microsoft.com/fwlink/?LinkID=180498). For the purposes of this tutorial, the naming scheme of the service contract namespace does not contain version information.

1. Within the IEchoContract interface, declare a method for the single operation the `IEchoContract` contract exposes in the interface and apply the `OperationContractAttribute` attribute to the method that you want to expose as part of the public Service Bus contract.

	```
	[OperationContract]
	string Echo(string text);
	```

1. Outside the contract, declare a channel that inherits from both `IEchoChannel` and also to the `IClientChannel` interface, as shown here:

	```
    [ServiceContract(Name = "IEchoContract", Namespace = "http://samples.microsoft.com/ServiceModel/Relay/")]
    publicinterface IEchoContract
    {
        [OperationContract]
        String Echo(string text);
    }

    publicinterface IEchoChannel : IEchoContract, IClientChannel { }
	```

	A channel is the WCF object through which the host and client pass information to each other. Later, you will write code against the channel to echo information between the two applications.

1. From the **Build** menu, click **Build Solution** or press F6 to confirm the accuracy of your work.

### Example

The following code shows a basic interface that defines a Service Bus contract.

```
using System;
using System.ServiceModel;

namespace Microsoft.ServiceBus.Samples
{
    [ServiceContract(Name = "IEchoContract", Namespace = "http://samples.microsoft.com/ServiceModel/Relay/")]
    public interface IEchoContract
    {
        [OperationContract]
        String Echo(string text);
    }

    public interface IEchoChannel : IEchoContract, IClientChannel { }

    class Program
    {
        static void Main(string[] args)
        {
        }
    }
}
```

Now that the interface is created, you can implement the interface.

## Implement the WCF contract to use Service Bus

Creating a Service Bus service requires that you first create the contract, which is defined by using an interface. For more information about creating the interface, see the previous step. The next step is to implement the interface. This involves creating a class named `EchoService` that implements the user-defined `IEchoContract` interface. After you implement the interface, you then configure the interface using an App.config configuration file. The configuration file contains necessary information for the application, such as the name of the service, the name of the contract, and the type of protocol that is used to communicate with Service Bus. The code used for these tasks is provided in the example following the procedure. For a more general discussion about how to implement a service contract, see [Implementing Service Contracts](https://msdn.microsoft.com/library/ms733764.aspx) in the Windows Communication Foundation (WCF) documentation.

1. Create a new class named `EchoService` directly after the definition of the `IEchoContract` interface. The `EchoService` class implements the `IEchoContract` interface. 

	```
	class EchoService : IEchoContract
	{
	}
	```
	
	Similar to other interface implementations, you can implement the definition in a different file. However, for this tutorial, the implementation is located in the same file as the interface definition and the `Main` method.

1. Apply the [ServiceBehaviorAttribute](https://msdn.microsoft.com/library/system.servicemodel.servicebehaviorattribute.aspx) attribute that indicates the service name and namespace.

	```[ServiceBehavior(Name = "EchoService", Namespace = "http://samples.microsoft.com/ServiceModel/Relay/")]
	class EchoService : IEchoContract
	{
	}
	```

1. Implement the `Echo` method defined in the `IEchoContract` interface in the `EchoService` class. 

	```
	public string Echo(string text)
	{
    	Console.WriteLine("Echoing: {0}", text);
    	return text;
	}
	```

1. Click **Build**, then click **Build Solution** to confirm the accuracy of your work.

### To define the configuration for the service host

1. The configuration file is very similar to a WCF configuration file. It includes the service name, endpoint (that is, the location Service Bus exposes for clients and hosts to communicate with each other), and the binding (the type of protocol that is used to communicate). The main difference is that this configured service endpoint refers to a [netTcpRelayBinding](https://msdn.microsoft.com/library/azure/microsoft.servicebus.nettcprelaybinding.aspx), which is not part of the .NET Framework. [NetTcpRelayBinding](https://msdn.microsoft.com/library/microsoft.servicebus.nettcprelaybinding.aspx) is one of the bindings defined by Service Bus.

1. In **Solution Explorer**, click the App.config file, which currently contains the following XML elements:

	```
	<?xmlversion="1.0"encoding="utf-8"?>
	<configuration>
	</configuration>
	```

1. Add a `<system.serviceModel>` XML element to the App.config file. This is a WCF element that defines one or more services. This example uses it to define the service name and endpoint.

	```
	<?xmlversion="1.0"encoding="utf-8"?>
	<configuration>
	  <system.serviceModel>
  
	  </system.serviceModel>
	</configuration>
	```

1. Within the `<system.serviceModel>` tags, add a `<services>` element. You can define multiple Service Bus applications in a single configuration file. However, this tutorial defines only one.
 
	```
	<?xmlversion="1.0"encoding="utf-8"?>
	<configuration>
	  <system.serviceModel>
	    <services>

	    </services>
	  </system.serviceModel>
	</configuration>
	```

1. Within the `<services>` element, add a `<service>` element to define the name of the service.

	```
	<servicename="Microsoft.ServiceBus.Samples.EchoService">
	</service>
	```

1. Within the `<service>` element, define the location of the endpoint contract, and also the type of binding for the endpoint.

	```
	<endpointcontract="Microsoft.ServiceBus.Samples.IEchoContract"binding="netTcpRelayBinding"/>
	```

	The endpoint defines where the client will look for the host application. Later, the tutorial uses this step to create a URI that fully exposes the host through the Service Bus. The binding declares that we are using TCP as the protocol to communicate with the Service Bus.


1. Directly after the `<services>` element, add the following binding extension:
 
	```
	<extensions>
	  <bindingExtensions>
	    <addname="netTcpRelayBinding"type="Microsoft.ServiceBus.Configuration.NetTcpRelayBindingCollectionElement, Microsoft.ServiceBus, Version=2.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
	  </bindingExtensions>
	</extensions>
	```

1. From the **Build** menu, click **Build Solution** to confirm the accuracy of your work.

### Example

The following code shows the implementation of the service contract.

```
[ServiceBehavior(Name = "EchoService", Namespace = "http://samples.microsoft.com/ServiceModel/Relay/")]

    class EchoService : IEchoContract
    {
        public string Echo(string text)
        {
            Console.WriteLine("Echoing: {0}", text);
            return text;
        }
    }
```

The following code shows the basic format of the App.config file associated with the service host.

```
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <system.serviceModel>
    <services>
      <service name="Microsoft.ServiceBus.Samples.EchoService">
        <endpoint contract="Microsoft.ServiceBus.Samples.IEchoContract" binding="netTcpRelayBinding" />
      </service>
    </services>
    <extensions>
      <bindingExtensions>
        <add name="netTcpRelayBinding" type="Microsoft.ServiceBus.Configuration.NetTcpRelayBindingCollectionElement, Microsoft.ServiceBus, Version=2.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" />
      </bindingExtensions>
    </extensions>
  </system.serviceModel>
</configuration>
```

## Host and run a basic Web service to register with Service Bus

This step describes how to run a basic Service Bus service.

### To create the Service Bus credentials

1. Add a reference to Microsoft.ServiceBus.dll to the project: see [Using the NuGet Service Bus Package](https://msdn.microsoft.com/library/dn741354.aspx).

	>[AZURE.NOTE] When using a command-line compiler, you must also provide the path to the assemblies.

1. In Program.cs, add a `using` statement for the Microsoft.ServiceBus namespace.

	```
	using Microsoft.ServiceBus;
	```

1. In `Main()`, create two variables in which to store the namespace and the SAS key that are read from the console window.

	```
	Console.Write("Your Service Namespace: ");
	string serviceNamespace = Console.ReadLine();
	Console.Write("Your SAS key: ");
	string sasKey = Console.ReadLine();
	```

	The SAS key will be used later to access your Service Bus project. The service namespace is passed as a parameter to `CreateServiceUri` to create a service URI.

4. Using a [TransportClientEndpointBehavior](https://msdn.microsoft.com/library/microsoft.servicebus.transportclientendpointbehavior.aspx) object, declare that you will be using a SAS key as the credential type. Add the following code directly after the code added in the last step.

	```
	TransportClientEndpointBehavior sasCredential = new TransportClientEndpointBehavior();
	sasCredential.TokenProvider = TokenProvider.CreateSharedAccessSignatureTokenProvider("RootManageSharedAccessKey", sasKey);
	```

### To create a base address for the service

1. Following the code you added in the last step, create a `Uri` instance for the base address of the service. This URI specifies the Service Bus scheme, the namespace, and the path of the service interface.

	```
	Uri address = ServiceBusEnvironment.CreateServiceUri("sb", serviceNamespace, "EchoService");
	```

	"sb" is an abbreviation for the Service Bus scheme, and indicates that we are using TCP as the protocol. This was also previously indicated in the configuration file, when [NetTcpRelayBinding](https://msdn.microsoft.com/library/microsoft.servicebus.nettcprelaybinding.aspx) was specified as the binding.
	
	For this tutorial, the URI is `sb://putServiceNamespaceHere.windows.net/EchoService`.

### To create and configure the service host

1. Set the connectivity mode to `AutoDetect`.

	```
	ServiceBusEnvironment.SystemConnectivity.Mode = ConnectivityMode.AutoDetect;
	```

	The connectivity mode describes the protocol the service uses to communicate with Service Bus; either HTTP or TCP. Using the default setting `AutoDetect`, the service attempts to connect to Service Bus over TCP if it is available, and HTTP if TCP is not available. Note that this differs from the protocol the service specifies for client communication. That protocol is determined by the binding used. For example, a service can use the [BasicHttpRelayBinding](https://msdn.microsoft.com/library/microsoft.servicebus.basichttprelaybinding.aspx) binding, which specifies that its endpoint (exposed on Service Bus) communicates with clients over HTTP. That same service could specify **ConnectivityMode.AutoDetect** so that the service communicates with Service Bus over TCP.

1. Create the service host, using the URI created earlier in this section.

	```
	ServiceHost host = new ServiceHost(typeof(EchoService), address);
	```

	The service host is the WCF object that instantiates the service. Here, you pass it the type of service you want to create (an `EchoService` type), and also to the address at which you want to expose the service.

1. At the top of the Program.cs file, add references to [System.ServiceModel.Description](https://msdn.microsoft.com/library/system.servicemodel.description.aspx) and [Microsoft.ServiceBus.Description](https://msdn.microsoft.com/library/microsoft.servicebus.description.aspx).

	```
	using System.ServiceModel.Description;
	using Microsoft.ServiceBus.Description;
	```

1. Back in `Main()`, configure the endpoint to enable public access.

	```
	IEndpointBehavior serviceRegistrySettings = new ServiceRegistrySettings(DiscoveryType.Public);
	```

	This step informs Service Bus that your application can be found publicly by examining the Service Bus ATOM feed for your project. If you set **DiscoveryType** to **private**, a client would still be able to access the service. However, the service would not appear when it searches the Service Bus namespace. Instead, the client would have to know the endpoint path beforehand.

1. Apply the service credentials to the service endpoints defined in the App.config file:

	```
	foreach (ServiceEndpoint endpoint in host.Description.Endpoints)
	{
	    endpoint.Behaviors.Add(serviceRegistrySettings);
	    endpoint.Behaviors.Add(sasCredential);
	}
	```

	As stated in the previous step, you could have declared multiple services and endpoints in the configuration file. If you had, this code would traverse the configuration file and search for every endpoint to which it should apply your credentials. However, for this tutorial, the configuration file has only one endpoint.

### To open the service host

1. Open the service.

	```
	host.Open();
	```

1. Inform the user that the service is running, and explain how to shut down the service.

	```
	Console.WriteLine("Service address: " + address);
	Console.WriteLine("Press [Enter] to exit");
	Console.ReadLine();
	```

1. When finished, close the service host.

	```
	host.Close();
	```

1. Press F6 to build the project.

### Example

The following example includes the service contract and implementation from previous steps in the tutorial, and hosts the service in a console application. Compile the following into an executable named EchoService.exe.

```
using System;
using System.ServiceModel;
using System.ServiceModel.Description;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Description;

namespace Microsoft.ServiceBus.Samples
{
    [ServiceContract(Name = "IEchoContract", Namespace = "http://samples.microsoft.com/ServiceModel/Relay/")]

    public interface IEchoContract
    {
        [OperationContract]
        String Echo(string text);
    }

    public interface IEchoChannel : IEchoContract, IClientChannel { };

    [ServiceBehavior(Name = "EchoService", Namespace = "http://samples.microsoft.com/ServiceModel/Relay/")]

    class EchoService : IEchoContract
    {
        public string Echo(string text)
        {
            Console.WriteLine("Echoing: {0}", text);
            return text;
        }
    }

    class Program
    {
        static void Main(string[] args)
        {

            ServiceBusEnvironment.SystemConnectivity.Mode = ConnectivityMode.AutoDetect;         
          
            Console.Write("Your Service Namespace: ");
            string serviceNamespace = Console.ReadLine();
            Console.Write("Your SAS key: ");
            string sasKey = Console.ReadLine();

           // Create the credentials object for the endpoint.
            TransportClientEndpointBehavior sasCredential = new TransportClientEndpointBehavior();
            sasCredential.TokenProvider = TokenProvider.CreateSharedAccessSignatureTokenProvider("RootManageSharedAccessKey", sasKey);

            // Create the service URI based on the service namespace.
            Uri address = ServiceBusEnvironment.CreateServiceUri("sb", serviceNamespace, "EchoService");

            // Create the service host reading the configuration.
            ServiceHost host = new ServiceHost(typeof(EchoService), address);

            // Create the ServiceRegistrySettings behavior for the endpoint.
            IEndpointBehavior serviceRegistrySettings = new ServiceRegistrySettings(DiscoveryType.Public);

            // Add the Service Bus credentials to all endpoints specified in configuration.
            foreach (ServiceEndpoint endpoint in host.Description.Endpoints)
            {
                endpoint.Behaviors.Add(serviceRegistrySettings);
                endpoint.Behaviors.Add(sasCredential);
            }
            
            // Open the service.
            host.Open();

            Console.WriteLine("Service address: " + address);
            Console.WriteLine("Press [Enter] to exit");
            Console.ReadLine();

            // Close the service.
            host.Close();
        }
    }
}
```

## Create a WCF client for the service contract

The next step is to create a basic Service Bus client application and define the service contract you will implement in later steps. Note that many of these steps resemble the steps used to create a service: defining a contract, editing an App.config file, using credentials to connect to Service Bus, and so on. The code used for these tasks is provided in the example following the procedure.

1. Create a new project in the current Visual Studio solution for the client by doing the following:
	1. In Solution Explorer, in the same solution that contains the service, right-click the current solution (not the project), and click **Add**. Then click **New Project**.
	2. In the **Add New Project** dialog box, click **Visual C#** (if **Visual C#** does not appear, look under **Other Languages**), select the **Console Application** template, and name it **EchoClient**.
	3. Click **OK**.
<br />

1. In Solution Explorer, double-click the Program.cs file in the **EchoClient** project to open it in the editor.

1. Change the namespace name from its default name of `EchoClient` to `Microsoft.ServiceBus.Samples`.

1. Add a reference to System.ServiceModel.dll for the project: 
	1. Right-click **References** under the **EchoClient** project in Solution Explorer. Then click **Add Reference**.
	2. Because you already added a reference to this assembly in the first step of this tutorial, it is now listed in the **Recent** tab. Click **Recent**, then select **System.ServiceModel.dll** from the list. Then click **OK**. If you do not see **System.ServiceModel.dll** in the **Recent** tab, click the **Browse** tab and go to **C:\Windows\Microsoft.NET\Framework\v3.0\Windows Communication Foundation**. Then select the assembly from there.
<br />

1. Add a `using` statement for the [System.ServiceModel](https://msdn.microsoft.com/library/system.servicemodel.aspx) namespace in the Program.cs file. 

	```
	using System.ServiceModel;
	```

1. Repeat the previous steps to add a reference to the Microsoft.ServiceBus.dll and [Microsoft.ServiceBus](https://msdn.microsoft.com/library/microsoft.servicebus.aspx) namespace to your project.

1. Add the service contract definition to the namespace, as shown in the following example. Note that this definition is identical to the definition used in the **Service** project. You should add this code at the top of the `Microsoft.ServiceBus.Samples` namespace.

	```
	[ServiceContract(Name = "IEchoContract", Namespace = "http://samples.microsoft.com/ServiceModel/Relay/")]
	publicinterface IEchoContract
	{
	    [OperationContract]
	    string Echo(string text);
	}

	publicinterface IEchoChannel : IEchoContract, IClientChannel { }
	```

1. Press F6 to build the client.

### Example

The following code shows the current status of the Program.cs file in the EchoClient project.

```
using System;
using Microsoft.ServiceBus;
using System.ServiceModel;

namespace Microsoft.ServiceBus.Samples
{

[ServiceContract(Name = "IEchoContract", Namespace = "http://samples.microsoft.com/ServiceModel/Relay/")]
    public interface IEchoContract
    {
        [OperationContract]
        string Echo(string text);
    }

    public interface IEchoChannel : IEchoContract, IClientChannel { }


    class Program
    {
        static void Main(string[] args)
        {
        }
    }
}
```

## Configure the WCF client

In this step, you create an App.config file for a basic client application that accesses the service created previously in this tutorial. This App.config file defines the contract, binding, and name of the endpoint. The code used for these tasks is provided in the example following the procedure.

1. In Solution Explorer, in the client project, double-click **App.config** to open the file, which currently contains the following XML elements:

	```
	<?xmlversion="1.0"?>
	<configuration>
	  <startup>
	    <supportedRuntimeversion="v4.0"sku=".NETFramework,Version=v4.0"/>
	  </startup>
	</configuration>
	```

1. Add an XML element to the App.config file for `system.serviceModel`.

	```
	<?xmlversion="1.0"encoding="utf-8"?>
	<configuration>
	  <system.serviceModel>
	
	  </system.serviceModel>
	</configuration>
	```
	
	This element declares that your application uses WCF-style endpoints. As stated previously, much of the configuration of a Service Bus application is identical to a WCF application; the main difference is the location to which the configuration file points.

1. Within the system.serviceModel element, add a `<client>` element.

	```
	<?xmlversion="1.0"encoding="utf-8"?>
	<configuration>
	  <system.serviceModel>
	    <client>
	    </client>
	  </system.serviceModel>
	</configuration>
	```

	This step declares that you are defining a WCF-style client application.

1. Within the `client` element, define the name, contract, and binding type for the endpoint.

	```
	<endpointname="RelayEndpoint"
					contract="Microsoft.ServiceBus.Samples.IEchoContract"
					binding="netTcpRelayBinding"/>
	```

	This step defines the name of the endpoint, the contract defined in the service, and the fact that the client application uses TCP to communicate with Service Bus. The endpoint name is used in the next step to link this endpoint configuration with the service URI.

1. Directly after the <client> element, add the following binding extension.
 
	```
	<extensions>
	  <bindingExtensions>
	    <addname="netTcpRelayBinding"type="Microsoft.ServiceBus.Configuration.NetTcpRelayBindingCollectionElement, Microsoft.ServiceBus, Version=2.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/>
	  </bindingExtensions>
	</extensions>
	```

1. Click **File**, then **Save All**.

## Example

The following code shows the App.config file for the Echo client.

```
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <system.serviceModel>
    <client>
      <endpoint name="RelayEndpoint"
                      contract="Microsoft.ServiceBus.Samples.IEchoContract"
                      binding="netTcpRelayBinding"/>
    </client>
    <extensions>
      <bindingExtensions>
        <add name="netTcpRelayBinding" type="Microsoft.ServiceBus.Configuration.NetTcpRelayBindingCollectionElement, Microsoft.ServiceBus, Version=2.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" />
      </bindingExtensions>
    </extensions>
  </system.serviceModel>
</configuration>
```

## Implement the WCF client to call Service Bus

In this step, you implement a basic client application that accesses the service you created previously in this tutorial. Similar to the service, the client performs many of the same operations to access Service Bus:

1. Sets the connectivity mode.

1. Creates the URI that locates the host service.

1. Defines the security credentials.

1. Applies the credentials to the connection.

1. Opens the connection.

1. Performs the application-specific tasks.

1. Closes the connection.

However, one of the main differences is that the client application uses a channel to connect to Service Bus, whereas the service uses a call to **ServiceHost**. The code used for these tasks is provided in the example following the procedure.

### To implement a client application

1. Set the connectivity mode to **AutoDetect**. Add the following code inside the `Main()` method of the client application.

	```
	ServiceBusEnvironment.SystemConnectivity.Mode = ConnectivityMode.AutoDetect;
	```

1. Define variables to hold the values for the service namespace, and SAS key that are read from the console.

	```
	Console.Write("Your Service Namespace: ");
	string serviceNamespace = Console.ReadLine();
	Console.Write("Your SAS Key: ");
	string sasKey = Console.ReadLine();
	```

1. Create the URI that defines the location of the host in your Service Bus project.

	```
	Uri serviceUri = ServiceBusEnvironment.CreateServiceUri("sb", serviceNamespace, "EchoService");
	```

1. Create the credential object for your service namespace endpoint.

	```
	TransportClientEndpointBehavior sasCredential = new TransportClientEndpointBehavior();
	sasCredential.TokenProvider = TokenProvider.CreateSharedAccessSignatureTokenProvider("RootManageSharedAccessKey", sasKey);
	```

1. Create the channel factory that loads the configuration described in the App.config file.

	```
	ChannelFactory<IEchoChannel> channelFactory = new ChannelFactory<IEchoChannel>("RelayEndpoint", new EndpointAddress(serviceUri));
	```

	A channel factory is a WCF object that creates a channel through which the service and client applications communicate.

1. Apply the Service Bus credentials.

	```
	channelFactory.Endpoint.Behaviors.Add(sasCredential);
	```

1. Create and open the channel to the service.

	```
	IEchoChannel channel = channelFactory.CreateChannel();
	channel.Open();
	```

1. Write the basic user interface and functionality for the echo.

	```
	Console.WriteLine("Enter text to echo (or [Enter] to exit):");
	string input = Console.ReadLine();
	while (input != String.Empty)
	{
	    try
	    {
	        Console.WriteLine("Server echoed: {0}", channel.Echo(input));
	    }
	    catch (Exception e)
	    {
	        Console.WriteLine("Error: " + e.Message);
	    }
	    input = Console.ReadLine();
	}
	```

	Note that the code uses the instance of the channel object as a proxy for the service.

1. Close the channel, and close the factory.

	```
	channel.Close();
	channelFactory.Close();
	```

## To run the client application

1. Press F6 to build the solution. This builds both the client project and the service project that you created in a previous step of this tutorial and creating an executable file for each.

1. Before running the client application, make sure that the service application is running.

	You should now have an executable file for the Echo service application named EchoService.exe, located under your service project folder at \bin\Debug\EchoService.exe (for the debug configuration) or \bin\Release\EchoService.exe (for the release configuration). Double-click this file to start the service application.

1. A console window opens and prompts you for the namespace. In this console window, enter the service namespace and press Enter.

1. Next, you are prompted for your SAS key. Enter the SAS key and press ENTER.

	Here is example output from the console window. Note that the values provided here are for example purposes only.

	`Your Service Namespace: myNamespace`

	`Your SAS Key: <SAS key value>`

	The service application starts and prints to the console window the address on which it's listening, as seen in the following example.

    `Service address: sb://mynamespace.servicebus.windows.net/EchoService/`

    `Press [Enter] to exit`
    
1. Run the client application. You should now have an executable for the Echo client application named EchoClient.exe that is located under the client project directory at .\bin\Debug\EchoClient.exe (for the debug configuration) or .\bin\Release\EchoClient.exe (for the release configuration). Double-click this file to start the client application.

1. A console window opens and prompts you for the same information that you entered previously for the service application. Follow the previous steps to enter the same values for the client application for the service namespace, issuer name, and issuer secret.

1. After entering these values, the client opens a channel to the service and prompts you to enter some text as seen in the following console output example.

	`Enter text to echo (or [Enter] to exit):` 

	Enter some text to send to the service application and press Enter. This text is sent to the service through the Echo service operation and appears in the service console window as in the following example output.

	`Echoing: My sample text`

	The client application receives the return value of the `Echo` operation, which is the original text, and prints it to its console window. The following is example output from the client console window.

	`Server echoed: My sample text`

1. You can continue sending text messages from the client to the service in this manner. When you are finished, press Enter in the client and service console windows to end both applications.

## Example

The following example shows how to create a client application, how to call the operations of the service, and how to close the client after the operation call is finished.

```
using System;
using Microsoft.ServiceBus;
using System.ServiceModel;

namespace Microsoft.ServiceBus.Samples
{
    [ServiceContract(Name = "IEchoContract", Namespace = "http://samples.microsoft.com/ServiceModel/Relay/")]
    public interface IEchoContract
    {
        [OperationContract]
        String Echo(string text);
    }

    public interface IEchoChannel : IEchoContract, IClientChannel { }

    class Program
    {
        static void Main(string[] args)
        {
            ServiceBusEnvironment.SystemConnectivity.Mode = ConnectivityMode.AutoDetect;

            
            Console.Write("Your Service Namespace: ");
            string serviceNamespace = Console.ReadLine();
            Console.Write("Your SAS Key: ");
            string sasKey = Console.ReadLine();



            Uri serviceUri = ServiceBusEnvironment.CreateServiceUri("sb", serviceNamespace, "EchoService");

            TransportClientEndpointBehavior sasCredential = new TransportClientEndpointBehavior();
            sasCredential.TokenProvider = TokenProvider.CreateSharedAccessSignatureTokenProvider("RootManageSharedAccessKey", sasKey);

            ChannelFactory<IEchoChannel> channelFactory = new ChannelFactory<IEchoChannel>("RelayEndpoint", new EndpointAddress(serviceUri));

            channelFactory.Endpoint.Behaviors.Add(sasCredential);

            IEchoChannel channel = channelFactory.CreateChannel();
            channel.Open();

            Console.WriteLine("Enter text to echo (or [Enter] to exit):");
            string input = Console.ReadLine();
            while (input != String.Empty)
            {
                try
                {
                    Console.WriteLine("Server echoed: {0}", channel.Echo(input));
                }
                catch (Exception e)
                {
                    Console.WriteLine("Error: " + e.Message);
                }
                input = Console.ReadLine();
            }

            channel.Close();
            channelFactory.Close();

        }
    }
}
```

Make sure that the service is running before you start the client. 

## Next steps

This tutorial showed how to build a Service Bus client application and service using the Service Bus "relay" capabilities. For a similar tutorial that uses Service Bus [brokered messaging](service-bus-messaging-overview.md/#Brokered-messaging), see the [Service Bus Brokered Messaging .NET Tutorial](https://msdn.microsoft.com/library/hh367512.aspx).

To learn more about Service Bus, see the following topics.

- [Service Bus messaging overview](service-bus-messaging-overview.md)
- [Service Bus fundamentals](service-bus-fundamentals-hybrid-solutions.md)
- [Service Bus architecture](service-bus-architecture.md)
