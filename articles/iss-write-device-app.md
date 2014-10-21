<properties title="Write a device application for ISS" pageTitle="Write a device application for ISS" description="Learn how to build a new device application that uses the ISS managed libraries to communicate with an ISS account. " metaKeywords="Intelligent Systems,ISS,IoT,develop" services="intelligent-systems" solutions="" documentationCenter="" authors="kevinasg" manager="jillfra" videoId="" scriptId="" />

<tags ms.service="intelligent-systems" ms.devlang="multiple" ms.topic="article" ms.tgt_pltfrm="multiple" ms.workload="tbd" ms.date="11/13/2014" ms.author="kevinasg" ms.prod="azure">

#Write a device application for ISS
This tutorial describes how to build a new device application that uses the Azure Intelligent Systems Service (ISS) managed libraries to communicate with an ISS account. You can then use ISS to manage devices and collect data from those devices.  

After you sign up for an ISS account and configure your account, the next step is to connect a device to your ISS account.  

For your device to communicate with ISS, it must be able to send HTTP requests and receive HTTP responses from an Internet connection, because all communication with ISS is based on a set of HTTP REST API calls.   

You'll need to write an application on your device that can perform the following:  

1.	Capture data from your device.
2.	Send the data to your ISS account.
3.	Optionally, respond to commands received from your ISS account.  

ISS uses Microsoft Azure Service Bus to receive data from a device and also to send commands to a device. Microsoft provides a set of libraries that manage communications with ISS. The libraries are referred to as the ISS agent libraries, and they can be downloaded as part of the Azure Intelligent Systems Service (ISS) SDK. The SDK provides libraries for both managed C# code and native C code. This tutorial focuses on using the managed libraries to write a simple "Hello World" managed C# application for your device.  

##Prerequisites
Before you can start, you'll need the following:  

-	Visual Studio 2013
-	The ISS SDK installed
-	An active ISS account
-	The following information for your ISS account:
	-	The account name
	-	The management endpoint
	-	The management access key
	-	The device endpoint
	-	The device access key  
	For more information about how to get this info from your account, see [ISS endpoints and access keys](./iss-endpoints-access-keys.md).  
-	A working connection to the Internet  
	
Learn where to find your endpoints and access keys in [ISS endpoints and access keys](./iss-endpoints-access-keys.md).  

##Table of contents
1.	[Model your device](#subheading1)
2.	[Create your device application project](#subheading2)
3.	[Implement the data model](#subheading3)
4.	[Generate the schema to validate your data model](#subheading4)
5.	[Add a class to get the connection settings for your ISS account](#subheading5)
6.	[Upload the data model schema to ISS](#subheading6)
7.	[Create a class that implements your data model](#subheading7)
8.	[Use the ISS Azure agent to send data to ISS](#subheading8)
9.	[Full Program.cs code](#subheading9)
10.	[Next steps](#subheading10)

##<a name="subheading1"></a>Model your device
Before a device can send data to ISS, the device and the service need to agree on the format of the data to be sent. You do this by defining a data model, which is a schema that defines the format of the possible data items that can be sent to your ISS account.  

When you model your device, think of your device in the following way:
![][1] 

-	The device can have a **state**. The state is the collection of properties and data that defines the device at any given time. Some examples of state properties might be the current GPS location of the device or the temperature of the device.
-	The device can have **events**. An event is something that happens to the device or the result of an action taken by the device. An event represents something happening at a specific time and can have data attached to it that describes it. For example, an event might be triggered if a device is moved, and the event could include the new GPS location of the device.
	-	If the event requires attention from an operator, you can use a special type of event called an **alarm**. An alarm is an event that also has a severity and a state (active, closed, ignored) that can be set by a remote operator.
-	The device can have **actions** that can be remotely invoked from your ISS account. These actions can be anything that you can define in code.  

For this tutorial, you'll model a device which is a very simple "Hello World" device. This simple device has the following characteristics:  

-	The state is composed of a single property:
	-	The hello message.
-	The events are composed of two events:
	-	A simple event to indicate that the hello message was sent.
	-	An alarm event to alert an operator that hello message was sent.
-	There are no actions defined for this device.  

So now that the data model for the simple Hello World device is defined, the next step is to create a project for the device application that includes the managed ISS libraries.  

##<a name="subheading2"></a>Create your device application project
If you haven't already extracted the ISSSDK.zip file, extract it now to a location on your development computer. In this tutorial, we assume that you extract the contents to a folder named ISSSDK in your Visual Studio 2013 projects folder.  

###To create a device application in Visual Studio 2013
1.	In Visual Studio 2013, create a new **Visual C#** > **Windows** > **Console Application** project, with the name "HelloISSWorld".
	>[AZURE.NOTE] A number of the steps below ask you to explicitly change the namespace of the project. If you want to avoid having to change the namespace, you can name your project with the same name as namespace you want to use. For example, Fabrikam.HelloISSWorld.V1..
2.	In **Program.cs**, change the namespace to "Fabrikam.HelloISSWorld.V1". The namespace is the name that ISS uses to identify the data model schema.
	>[AZURE.NOTE] If more than one developer follows this tutorial on the same ISS account, each developer should change the namespace in the project to a unique value to avoid potentially overwriting the schema and data uploaded to ISS by a different developer on the same account.
3.	Next, you need to add references to the managed ISS library files. In **Solution Explorer**, right-click **References** > **Add Reference**.
4.	In the **Reference Manager** window, click the **Browse** button.
5.	Navigate to the ManagedLibraries\x64 (for 64-bit applications) or ManagedLibraries\x86 (for 32-bit applications) folder under the ISSSDK folder where you extracted the ISSSDK.zip file.
6.	Select all of the files and click **Add**.
7.	Click **OK** to add the references to your project.
8.	Build the project to verify that you followed the steps correctly. If the project builds successfully, you can move on to the next step.  

##<a name="subheading3"></a>Implement the data model
Now that you have an application which includes the managed ISS libraries, the next step is to implement that data model in code.  

From a coding perspective, the Hello World data model consists of the following parts:  

-	The data model itself, which defines the following:
	-	A string that represents the Hello World message property.
	-	A string that represents the Hello World event.
	-	A complex data type that represents the Hello World alarm.
-	The complex data type definition for the Hello World alarm, which defines the following fields:
	-	An integer that represents the severity of the alarm. Every alarm type must include this field.
	-	A string that represents the message of the alarm.  

First, you'll define the complex data type for the alarm. When you use the managed ISS libraries, you define complex data types by defining a **struct**.  

###To define a complex data type
1.	In Visual Studio 2013, add a new C# class named **HelloWorldAlarmType** to your project.
2.	Open the HelloWorldAlarmType.cs file so that you can edit it.
3.	Replace the contents of the file with the following code:  

		namespace Fabrikam.HelloISSWorld.V1
			{
			using System;
			using Microsoft.IntelligentSystems.Metadata.Annotations;
			
			[IssStruct(IsAlarm=true)]
			public struct HelloWorldAlarmType
			{
			public int Severity {get; private set;}
			public string AlarmMessage { get; private set; }
			
			public HelloWorldAlarmType(int severity, string alarmMessage):this()
			{
			Severity = severity;
			AlarmMessage = alarmMessage;
			}
			}
			}

4.	Save the file.  

Let's break down the code you just added and describe it:  

1.	The Microsoft.IntelligentSystems.Metadata.Annotations library defines the attributes that you can use to annotate the elements of your data model.  

		namespace Fabrikam.HelloISSWorld.V1
		{
		    using System;
		    using Microsoft.IntelligentSystems.Metadata.Annotations;

2.	You create a complex data type in your data model by declaring a **struct** that is annotated as `[IssStruct]`. If the complex data type is for an alarm, you must add `(IsAlarm=true)` to your annotation.

	    [IssStruct(IsAlarm=true)]
	    public struct HelloWorldAlarmType
	    {

3.	Next you must define the fields that make up the complex data type. Because a **struct** is immutable in C#, these fields must be read-only and defined when the structure is created.
The code does that by declaring a public get and a private set accessor for the fields.  

        public int Severity {get; private set;}
        public string AlarmMessage { get; private set; }

4.	In the constructor for the **struct**, you must set the values for the fields, as this is the only time those values can be set.  

        public HelloWorldAlarmType(int severity, string alarmMessage):this()
        {
            Severity = severity;
            AlarmMessage = alarmMessage;
        }

Now that you have defined all of the complex data types that you need for your data model, you can define the data model itself. You do this by defining an **interface**.  

###To define a data model
1.	In Visual Studio 2013, add a new C# interface named **IHelloDataModel** to your project.
2.	Open the IHelloDataModel.cs file so that you can edit it.
3.	Replace the contents of the file with the following code:  

		namespace Fabrikam.HelloISSWorld.V1
		{
		    using System;
		    using Microsoft.IntelligentSystems.Metadata.Annotations;
		
		    [IssInterface(RootName="HelloDevice")]
		    public interface IHelloDataModel
		    {
		        [IssProperty]
		        string HelloMessage { get; set; }
		
		        [IssEvent]
		        string HelloEventMessage { get; }
		
		        [IssEvent]
		        HelloWorldAlarmType HelloAlarm { get; }
		    }
		}

4.	Save the file.  

Again, let's break down the code you just added:  

1.	As before, you must make sure that you are using the correct namespaces.  

		namespace Fabrikam.HelloISSWorld.V1
		{
		    using System;
		    using Microsoft.IntelligentSystems.Metadata.Annotations;

2.	You define a data model by declaring an **interface** that is annotated as `[IssInterface]`. If the data model is the root model for your device, you must specify a root name for the data model. In this case, the root name is "HelloDevice".  

	    [IssInterface(RootName="HelloDevice")]
	    public interface IHelloDataModel
	    {

3.	Next, you must declare the properties of the data model state. Each property must be annotated with `[IssProperty]`.  

        [IssProperty]
        string HelloMessage { get; set; }

4.	Next, you must declare the events of the data model state. Each event must be annotated with `[IssEvent]`. Events can only have a get accessor.  

        [IssEvent]
        string HelloEventMessage { get; }

5.	Next, you must declare the alarm. Since alarms are a type of event, you declare them in the same way that you declare an event:  

        [IssEvent]
        HelloWorldAlarmType HelloAlarm { get; }


##<a name="subheading4"></a>Generate the schema to validate your data model
Your project should now have enough information to generate the data model schema. The schema is a Common Schema Definition Language (CSDL) structure that defines the data model. The next step is to generate the schema to verify that your data model is implemented correctly.  

###To add code to generate the data model schema
1.	In your project, open Program.cs.
2.	Replace the contents of Program.cs with the following code:  

		namespace Fabrikam.HelloISSWorld.V1
		{
		    using System;
		    using System.IO;
		    using Microsoft.IntelligentSystems.Agent.EdmxGeneration;
		
		    class Program
		    {
		        static void Main(string[] args)
		        {
		            try
		            {
		                // Generate schema
		                var schemaTuple = EdmxGenerator.Generate(typeof(IHelloDataModel).Assembly);
		
		                Console.WriteLine("Namespace: " + schemaTuple.Item1);
		                Console.WriteLine("");
		                Console.Write("Schema: " + schemaTuple.Item2);
		            }
		            catch (Exception ex)
		            {
		                // Schema generation failed, report error message
		                Console.WriteLine(ex.InnerException.ToString());
		            }
		
		            Console.Write("Press any key to exit: ");
		            Console.ReadKey();
		        }
		    }
		}

3.	Build and run the project.  

If you implemented the data model correctly, you should see a console window which displays the namespace of the schema followed by the actual schema in an XML format.  

If the data model is not valid, the exception message may contain information to help you figure out what’s wrong with the data model. 

##<a name="subheading5"></a>Add a class to get the connection settings for your ISS account
Now that you can generate the schema for your data model, your application will need the credentials to connect to your ISS account to do anything further. In this step, to keep things simple, you'll add a class that hard codes your settings in the code. In a real-world application, you will want a more secure way of obtaining the credentials.  

###To set account credentials
1.	In Visual Studio 2013, add a new C# class named IssAccountInfo.cs to your project.
2.	Open IssAccountInfo.cs so that you can edit it.
3.	Replace the contents of IssAccountInfo.cs with the following code, entering your account name, endpoints, and access keys where the code says "Your…":  

		using System;
		
		namespace Fabrikam.HelloISSWorld.V1
		{
		    public class IssAccountInfo
		    {
		        public string accountName { get; set; }
		        public string deviceEndpoint { get; set; }
		        public string deviceAccessKey { get; set; }
		
		        public string managementEndpoint { get; set; }
		        public string managementAccessKey { get; set; }
		
		        public void getCredentials()
		        {
		            // Set account credentials. 
		            accountName = "Your ISS account name";
		            deviceEndpoint = "Your device endpoint";
		            deviceAccessKey = "Your device access key";
		            managementEndpoint = "Your management endpoint";
		            managementAccessKey = "Your management access key";
		        }
		    }
		}  

The device endpoint should look similar to https://<account_name>.device.intelligentsystems.azure.net/, where <account_name> is the account name for your ISS account.  

The management endpoint should look similar to https://<account_name>.management.intelligentsystems.azure.net/, where <account_name> is the account name for your ISS account.  

4.	Save the file.
5.	Open Program.cs so that you can edit it.
6.	At the beginning of the **Main** method, add the following code to create an instance of the **IssAccountInfo** class and get the credentials to connect to your ISS account.  

        IssAccountInfo accountInfo = new IssAccountInfo();

        // Get the connection settings to connect to your ISS account
        accountInfo.getCredentials();

##<a name="subheading6"></a>Upload the data model schema to ISS
Before the ISS agent for Windows can send data to your ISS account, you must upload the data model schema to your ISS account at least once. ISS associates the schema with any devices that register by using that schema, as well as any alarms or data sent by those devices.  

While you are developing your device application, you will upload the data model as a scratch schema. Any time that you upload a different schema with the same namespace as an existing scratch schema, the old schema is deleted, along with any other data or devices associated with the schema.  

If you upload the exact same schema as one that already exists in your ISS account, ISS accepts the upload without deleting any associated data. To keep things simple, the Hello World program uploads the schema every time it runs, although this is not necessary after the schema has been uploaded once.  

You must supply the credentials for the management endpoint for your ISS account in order to upload a schema.  

In this step, you will upload the data model schema to your ISS account.  

###To upload the schema to ISS
1.	Open Program.cs.
2.	Replace the contents of Program.cs with the following code:  

		namespace Fabrikam.HelloISSWorld.V1
		{
		    using System;
		    using System.IO;
		    using Microsoft.IntelligentSystems.Azure;
		    using Microsoft.IntelligentSystems.Agent.EdmxGeneration;
		
		    class Program
		    {
		        static void Main(string[] args)
		        {
		            IssAccountInfo accountInfo = new IssAccountInfo();
		
		            // Get the connection settings to connect to your ISS account
		            accountInfo.getCredentials();
		
		            try
		            {
		                // Generate schema
		                var schemaTuple = EdmxGenerator.Generate(typeof(IHelloDataModel).Assembly);
		
		                // Upload the schema to you ISS account
		                var uploader = new SchemaUploader(accountInfo.managementEndpoint, accountInfo.managementAccessKey, accountInfo.accountName);
		                uploader.Upload(schemaTuple.Item1, schemaTuple.Item2, "Hello World tutorial", "Schema for Hello ISS World.");
		
		                Console.WriteLine("Successfully uploaded the " + schemaTuple.Item1 + " schema.");
		            }
		            catch (Exception ex)
		            {
		                // Schema generation failed, report error message
		                Console.WriteLine(ex.InnerException.ToString());
		            }
		
		            Console.Write("Press any key to exit: ");
		            Console.ReadKey();
		        }
		    }
		}

3.	Build and run the project.  
If you entered the code correctly and supplied valid management endpoint credentials in your **IssAccountInfo** class, you should see the following output in your console window when you run the program: 
 
		Successfully uploaded the Fabrikam.HelloISSWorld.V1 schema.
		Press any key to continue:  

Now let's break down the code that you added to upload the schema.  

1.	The code uses the **SchemaUploader** class to upload the schema. This class is part of the Microsoft.IntelligentSystems.Azure library, so we add a `using` statement:  

    	using Microsoft.IntelligentSystems.Azure;  

2.	Next, the code creates an instance of the **SchemaUploader** class, providing the management endpoint credentials to connect to your ISS account:  

        var uploader = new SchemaUploader(accountInfo.managementEndpoint, accountInfo.managementAccessKey, accountInfo.accountName);

3.	Next, the code calls the **Upload()** method to upload the schema that we generated earlier:  

        uploader.Upload(schemaTuple.Item1, schemaTuple.Item2, "Hello World tutorial", "Schema for Hello ISS World.");  

##<a name="subheading7"></a>Create a class that implements your data model
Now that you have verified and uploaded the data model successfully, the next step is to create a class that implements the data model interface. This class can have additional fields and methods beyond those defined in the data model interface.  

###To create the HelloWorldDevice class
1.	In Visual Studio 2013, add a new C# class named **HelloWorldDevice** to your project.
2.	Open HelloWorldDevice.cs so that you can edit it.
3.	Replace the code in HelloworldDevice.cs with the following:  

		using System;
		
		namespace Fabrikam.HelloISSWorld.V1
		{
		    public class HelloWorldDevice : IHelloDataModel, IDisposable
		    {
		        // Data model implementation
		        public string HelloMessage { get; set; }
		        public string HelloEventMessage { get; set; }
		        public HelloWorldAlarmType HelloAlarm { get; set; }
		
		        // Flag: Has Dispose already been called? 
		        protected bool disposed = false;
		
		        // Is the device registered with ISS?
		        public bool registered = false;
		        public bool registrationFailed = false;
		
		        // The name of this device
		        public string DeviceName { get; private set; }
		
		        // Constructor for the device
		        public HelloWorldDevice(string deviceName)
		        {
		            HelloMessage = "Hello ISS World!";
		            DeviceName = deviceName;
		        }
		
		        // Public implementation of Dispose pattern callable by consumers. 
		        public void Dispose()
		        {
		            Dispose(true);
		            GC.SuppressFinalize(this);
		        }
		
		        // Protected implementation of Dispose pattern. 
		        protected virtual void Dispose(bool disposing)
		        {
		            if (disposed)
		                return;
		
		            if (disposing)
		            {
		                // Free any other managed objects here. 
		                //
		            }
		
		            disposed = true;
		        }
		
		    }
		}

4.	Save the file.  

Now, let's break down the code you just added:  

1.	The class you create must implement your data model interface. In addition, it's good practice to implement the **IDisposable** interface, although this is not strictly necessary:  

    	public class HelloWorldDevice : IHelloDataModel, IDisposable

2.	Next, your class must implement all of the properties, events, and alarms that you defined in your data model interface:  

        // Data model implementation
        public string HelloMessage { get; set; }
        public string HelloEventMessage { get; set; }
        public HelloWorldAlarmType HelloAlarm { get; set; }

3.	Next, the code declares several additional fields to keep track of information:  

        // Flag: Has Dispose already been called? 
        protected bool disposed = false;

        // Is the device registered with ISS?
        public bool registered = false;
        public bool registrationFailed = false;

        // The name of this device
        public string DeviceName { get; private set; }

	-	The class uses the **disposed** field to help implement the **IDisposable** interface.
	-	The class uses the **registered** and **registrationFailed** fields to track if the device has successfully registered with ISS or not. The device cannot send data to ISS or notify ISS about events until registration is complete.
	-	The class uses the **DeviceName** property to determine the name of the device. The device name is used when you register your device to your ISS account. Because the device name should not change for a device, the code uses a private set accessor to make the field read only, but settable in the constructor.  

4.	Next, the class defines a constructor that takes a device name:  

        // Constructor for the device
        public HelloWorldDevice(string deviceName)
        {
            HelloMessage = "Hello ISS World!";
            DeviceName = deviceName;
        }

5.	The rest of the class defines a standard **IDisposable** implementation.  

##<a name="subheading8"></a>Use the ISS Azure agent to send data to ISS
The managed ISS libraries provide a class called **IssAzureAgent**. This class handles all of the communication between your application and your ISS account.  

###To set up an instance of the ISS Azure agent
1.	In Visual Studio 2013, in your project, open Program.cs.
2.	The **IssAzureAgent** class is defined in the Microsoft.IntelligentSystems.Agent library, so add the following using statement to the code alongside the other using statements:  

    	using Microsoft.IntelligentSystems.Agent;  

3.	In your Main() method, after the try/catch code that generates and uploads the schema, add the following code:  

		// Create an instance of your device
        HelloWorldDevice helloWorldDevice = new HelloWorldDevice("HelloWorldDevice");
        IHelloDataModel deviceModel = (IHelloDataModel) helloWorldDevice;
         
        // Change the default options for the ISS Azure agent to enable verbose diagnostics
        var issAgentOptions = new IssAzureAgentOptions();
        issAgentOptions.VerboseDiagnostics = true;

        // Create a new instance of the ISS Azure agent
        var issAgent = new IssAzureAgent(new Uri(accountInfo.deviceEndpoint), accountInfo.deviceAccessKey, accountInfo.accountName, issAgentOptions);

        // Register the device with the agent instance
        issAgent.RegisterObject(deviceModel, helloWorldDevice.DeviceName);


        // Setup a callback function to respond to agent registration
        issAgent.RegistrationResult.Subscribe(result =>
        {
            if (result.Success)
            {
                // Registration is successful, the IssAzureAgent object is ready to send data
                helloWorldDevice.registered = true;
                Console.WriteLine("Registration Completed.");
            }
            else
            {
                // Registration failed, the error message is contained in result.Message
                helloWorldDevice.registrationFailed = true;
                Console.WriteLine(result.Message);
            }
        });

        // Start the agent and register the device
        issAgent.Start();

        // Wait for registration to complete or fail
        while (helloWorldDevice.registrationFailed == false && helloWorldDevice.registered == false)
        {
            System.Threading.Thread.Sleep(250);
        }
        
        if (helloWorldDevice.registered == true) 
        {
            // Registration successful, the device can now send data and events to ISS

            // Send all of the state properties
            issAgent.Send(deviceModel);

            // Notify about an event
            helloWorldDevice.HelloEventMessage = "Hello message sent.";
            issAgent.Notify(deviceModel, t => t.HelloEventMessage);

            // Send an alarm
            helloWorldDevice.HelloAlarm = new HelloWorldAlarmType(2, "Hello World alarm!");
            issAgent.Notify(deviceModel, t => t.HelloAlarm);
        }
        else if (helloWorldDevice.registrationFailed == true)
        { 
            Console.WriteLine("Registration failed."); 
        }

4.	Save the file.
5.	Build and run the project. If the project does not build, see the section below for the full Program.cs code listing.  

Now let's break down the code:  

1.	First, the code created an instance of your device class:  

    	// Create an instance of your device
        HelloWorldDevice helloWorldDevice = new HelloWorldDevice("HelloWorldDevice");

2.	Next, the code added the following line so that the **IssAzureAgent** class can treat your device instance as the data model interface:  

        IHelloDataModel deviceModel = (IHelloDataModel) helloWorldDevice;

3.	The next step is to define the configuration options for the **IssAzureAgent** class:  

        // Change the default options for the ISS azure agent to enable verbose diagnostics
        var issAgentOptions = new IssAzureAgentOptions();
        issAgentOptions.VerboseDiagnostics = true;

	This code tells the **IssAzureAgent** class to provide verbose diagnostic messages when communicating with ISS.
4.	The code then creates an instance of the **IssAzureAgent** class, passing in the connection settings for the device endpoint of your ISS account:  

        // Create a new instance of the ISS Azure agent
        var issAgent = new IssAzureAgent(new Uri(accountInfo.deviceEndpoint), accountInfo.deviceAccessKey, accountInfo.accountName, issAgentOptions);

5.	Next you need to register your device with your **IssAzureAgent** instance. The following code does this:  

        // Register the device with the agent instance
        issAgent.RegisterObject(deviceModel, helloWorldDevice.DeviceName);

6.	Because registering a device takes a few seconds, the application must wait until registration is complete before trying to send any data or notify about any events. The following code subscribes to the registration result and set a flag to indicate when registration is complete:  

        // Setup a callback function to respond to agent registration
        issAgent.RegistrationResult.Subscribe(result =>
        {
            if (result.Success)
            {
                // Registration is successful, the IssAzureAgent object is ready to send data
                helloWorldDevice.registered = true;
                Console.WriteLine("Registration Completed.");
            }
            else
            {
                // Registration failed, the error message is contained in result.Message
                helloWorldDevice.registrationFailed = true;
                Console.WriteLine(result.Message);
            }
        });

7.	Now, the **IssAzureAgent** instance has enough information to set up communications with your ISS account. At this point, your application is ready to start the **IssAzureAgent** instance and start sending data and events to ISS.  

	The following code starts the **IssAzureAgent** instance. The **Start()** method first tries to register the device, and then listens for commands, if any are defined, from your ISS account.  

        // Start the agent and register the device
        issAgent.Start();

8.	Now the application needs to wait for the **IssAzureAgent** instance to register your device with ISS. The following code waits for registration to complete, checking every quarter of a second:  

        // Wait for registration to complete or fail
        while (helloWorldDevice.registrationFailed == false && helloWorldDevice.registered == false)
        {
            System.Threading.Thread.Sleep(250);
        }

9.	Once registration is successful, the **IssAzureAgent** instance can send data to ISS. The following code sends the device state to ISS:  

        // Send all of the state properties
        issAgent.Send(deviceModel);

10.	The following code sends the simple event:  

        // Notify about an event
        helloWorldDevice.HelloEventMessage = "Hello message sent.";
        issAgent.Notify(deviceModel, t => t.HelloEventMessage);

	The lambda expression, t => t.HelloEventMessage, specifies which event in the data model to send.
11.	Finally, the code sends the alarm, which is a **struct** type. Because structs are immutable, you must create a new alarm instance to send it.  

        // Send an alarm
        helloWorldDevice.HelloAlarm = new HelloWorldAlarmType(2, "Hello World alarm!");
        issAgent.Notify(deviceModel, t => t.HelloAlarm);

##<a name="subheading9"></a>Full Program.cs code
The final Program.cs code should resemble the following code:  

	namespace Fabrikam.HelloISSWorld.V1
	{
	    using System;
	    using System.IO;
	    using Microsoft.IntelligentSystems.Azure;
	    using Microsoft.IntelligentSystems.Agent;
	    using Microsoft.IntelligentSystems.Agent.EdmxGeneration;
	
	    class Program
	    {
	        static void Main(string[] args)
	        {
	            IssAccountInfo accountInfo = new IssAccountInfo();
	
	            // Get the connection settings to connect to your ISS account
	            accountInfo.getCredentials();
	
	            // Generate and upload the schema
	            try
	            {
	                // Generate schema
	                var schemaTuple = EdmxGenerator.Generate(typeof(IHelloDataModel).Assembly);
	
	                // Upload the schema to you ISS account
	                var uploader = new SchemaUploader(accountInfo.managementEndpoint, accountInfo.managementAccessKey, accountInfo.accountName);
	                uploader.Upload(schemaTuple.Item1, schemaTuple.Item2, "Hello World tutorial", "Schema for Hello ISS World.");
	
	                Console.WriteLine("Successfully uploaded the " + schemaTuple.Item1 + " schema.");
	            }
	            catch (Exception ex)
	            {
	                // Schema generation failed, report error message
	                Console.WriteLine(ex.InnerException.ToString());
	            }
	
	            // Create an instance of your device
	            HelloWorldDevice helloWorldDevice = new HelloWorldDevice("HelloWorldDevice");
	            IHelloDataModel deviceModel = (IHelloDataModel) helloWorldDevice;
	             
	            // Change the default options for the ISS Azure agent to enable verbose diagnostics
	            var issAgentOptions = new IssAzureAgentOptions();
	            issAgentOptions.VerboseDiagnostics = true;
	
	            // Create a new instance of the ISS Azure agent
	            var issAgent = new IssAzureAgent(new Uri(accountInfo.deviceEndpoint), accountInfo.deviceAccessKey, accountInfo.accountName, issAgentOptions);
	
	            // Register the device with the agent instance
	            issAgent.RegisterObject(deviceModel, helloWorldDevice.DeviceName);
	
	
	            // Setup a callback function to respond to agent registration
	            issAgent.RegistrationResult.Subscribe(result =>
	            {
	                if (result.Success)
	                {
	                    // Registration is successful, the IssAzureAgent object is ready to send data
	                    helloWorldDevice.registered = true;
	                    Console.WriteLine("Registration Completed.");
	                }
	                else
	                {
	                    // Registration failed, the error message is contained in result.Message
	                    helloWorldDevice.registrationFailed = true;
	                    Console.WriteLine(result.Message);
	                }
	            });
	
	            // Start the agent and register the device
	            issAgent.Start();
	
	            // Wait for registration to complete or fail
	            while (helloWorldDevice.registrationFailed == false && helloWorldDevice.registered == false)
	            {
	                System.Threading.Thread.Sleep(250);
	            }
	            
	            if (helloWorldDevice.registered == true) 
	            {
	                // Registration successful, the device can now send data and events to ISS
	
	                // Send all of the state properties
	                issAgent.Send(deviceModel);
	
	                // Notify about an event
	                helloWorldDevice.HelloEventMessage = "Hello message sent.";
	                issAgent.Notify(deviceModel, t => t.HelloEventMessage);
	
	                // Send an alarm
	                helloWorldDevice.HelloAlarm = new HelloWorldAlarmType(2, "Hello World alarm!");
	                issAgent.Notify(deviceModel, t => t.HelloAlarm);
	            }
	            else if (helloWorldDevice.registrationFailed == true)
	            { 
	                Console.WriteLine("Registration failed."); 
	            }
	
	            Console.Write("Press any key to exit: ");
	            Console.ReadKey();
	        }
	    }
	}

##<a name="subheading10"></a>Next steps
This example demonstrates how to create a simple device application that sends data to ISS. The next step is to use the ISS management portal to view your device information. For more information, see [Use the ISS management portal]().

[1]: ./media/iss-write-device-app/iss-write-device-app-01.png
