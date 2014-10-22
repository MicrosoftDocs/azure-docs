<properties title="Developer guide for managed ISS agent libraries" pageTitle="Developer guide for managed ISS agent libraries" description="Learn how to use the C# device libraries for ISS to write a device application." metaKeywords="Intelligent Systems,ISS,IoT,develop" services="intelligent-systems" solutions="" documentationCenter="" authors="kevinasg" manager="jillfra" videoId="" scriptId="" />

<tags ms.service="intelligent-systems" ms.devlang="dotnet" ms.topic="article" ms.tgt_pltfrm="multiple" ms.workload="tbd" ms.date="11/13/2014" ms.author="kevinasg" ms.prod="azure">

#Developer guide for C# ISS client libraries
This topic describes how to use the C# Azure Intelligent Systems Service (ISS) client libraries in your device application. A complete code sample can be found in the ISSSDK.zip with the Contoso.Samples.DeviceModel sample. You can download ISSSDK.zip on the Connect site. Learn to create your own device application in [Write a device application for ISS](./iss-write-device-app.md).  

##Get the C# ISS client libraries
You can find the C# ISS client libraries in the ISSSDK.zip file, in the folder named ManagedLibraries. You must unzip this folder before you can add references to the library files.  

The C# ISS client libraries are available as either 32-bit libraries (under ManagedLibraries\x86) or 64-bit libraries (under ManagedLibraries\x64).  

The ManagedLibraries x86 and x64-folders contains the following library files:  

-	Microsoft.IntelligentSystems.Agent.dll
-	Microsoft.IntelligentSystems.Azure.dll
-	Microsoft.IntelligentSystems.Metadata.dll
-	Microsoft.ServiceBus.dll
-	Microsoft.WindowsAzure.Storage.dll
-	System.Reactive.Core.dll
-	System.Reactive.Interfaces.dll
-	System.Reactive.Linq.dll  

You must add references to all of these library files to your project. The C# Azure Intelligent Systems Service (ISS) client libraries require these specific versions of the Microsoft Azure and Reactive libraries.  

##Choose the namespace for your project
By default, Visual Studio 2013 uses the name of your project as the namespace for any new files that you add to your project. When you generate the schema for your data model, the API that generates the schema uses the namespace that contains your data model in your code.  

The namespace that contains your data model must only contain alphanumeric characters and the period (.) character. You cannot use underscores in the namespace that contains the data model.  

If you are adding ISS functionality to an existing project, and that project is using a namespace that does not meet the previous limitation, you use one of the following options:  

-	You can define the data model in a different namespace in the same project, and use the fully qualified name to reference the data model.
-	You can create a separate class library that defines your data model with a different namespace, and add a reference to the new class library in your main project.  

##Add the C# ISS client libraries to your project
Before you can implement your data model, your must add the C# ISS client libraries to your project.  

###To add the C# ISS client libraries to your project
1.	In Visual Studio 2013, on the **Solution Explorer** window, right-click **References**, and then select **Add Reference**.
2.	In the **Reference Manager** window, click the **Browse** button.
3.	In the **Select the files to reference** window, navigate to the location where you unzipped the ISSSDK.zip file.
4.	Open either the ManagedLibraries\x86 (for 32-bit applications) or the ManagedLibraries\x64 (for 64-bit applications) folder.
5.	Select all of the files, and then click **Add** to add the file references.
6.	Click **OK** to close the **Reference Manager** window.  

##Implement your data model in your application
In the C# ISS client libraries, you can declare the elements of your data model by using attributes that are defined in Microsoft.IntelligentSystems.Metadata.Annotations.dll. Using these attributes allows the managed ISS agent to use reflection on your data structures to create the data model that defines the data contract between your application and your ISS account.  

The attributes that you can use are listed in the following table:

|Data model element	|Attribute
|-------------------|
|Data model	|`[IssInterface(RootName = "<model_name>")`]
|Sub model	|`[IssInterface]`
|Property	|`[IssProperty]`
|Event	|`[IssEvent]`
|Action	|`[IssAction]`
|Complex data type	|`[IssStruct]`
|Alarm definition	|`[IssStruct(IsAlarm = true)]`

###Define a data model
In the C# ISS client libraries, you must implement a data model description as an interface. Every data model must have a root model that is the data model for the device.  

The data model root name must only contain alphanumeric characters and the period (.) character. You cannot use underscores in the root name.  

In the body of your data model interface, you can declare properties, events, and actions.  

The following C# code demonstrates how to declare a root model interface:  

	namespace Contoso.Samples.DeviceModel.V1
	{
	    using Microsoft.IntelligentSystems.Metadata.Annotations;
	
	    /// Interface for device type
	    [IssInterface(RootName = "Device")]
	    public interface IDevice
	    {
	        // Declare properties, events, and actions
	    }
	}


###Properties
You define a property in your interface by using the following format:  

	[IssProperty]
	dataType propertyName { get; [set;] }  

You must define data model properties as C# properties by declaring a **get** accessor and an optional **set** accessor. If you do not define a **set** accessor, the property is considered read-only.  

You can use the following C# data types to define simple properties in your data model:  

-	Bool
-	DataTimeOffset
-	Double
-	Guid
-	Int
-	Long
-	Stream
-	String  

If your data model contains binary data properties, use the Stream data type.  

You can also define properties that use complex data types that are built on the previous list of data types. To do this, you must first define the complex type. For more information, see the [Complex data types](#subheading1) section later in this topic.  

The data type of a property can also be a reference to another data model interface.  

The following C# example demonstrates how to declare a data model with a simple property of each type:  

	namespace Contoso.Samples.DeviceModel.V1
	{
	    using System;
	    using System.IO;
	    using Microsoft.IntelligentSystems.Metadata.Annotations;
	
	    /// Interface for device type
	    [IssInterface(RootName = "Device")]
	    public interface IDevice
	    {
	        /// Gets the DateTimeOffsetProperty
	        [IssProperty]
	        DateTimeOffset DateTimeOffsetProperty { get; }
	
	        /// Gets or sets the StringProperty
	        [IssProperty]
	        string StringProperty { get; set; }
	
	        /// Gets or sets the BinaryProperty
	        [IssProperty]
	        Stream BinaryProperty { get; set; }
	
	        /// Gets the ReadOnlyDoubleProperty
	        [IssProperty]
	        double ReadOnlyDoubleProperty { get; }
	
	        /// Gets the ReadOnlyInt32Property
	        [IssProperty]
	        int ReadOnlyInt32Property { get; }
	
	        /// Gets the ReadOnlyInt64Property
	        [IssProperty]
	        long ReadOnlyInt64Property { get; }
	
	        /// Gets the ReadOnlyGuidProperty
	        [IssProperty]
	        Guid ReadOnlyGuidProperty { get; }
	
	        /// Gets the ReadOnlyBooleanValue
	        [IssProperty]
	        bool ReadOnlyBooleanValue { get; }
	    }
	}

###Events
You define an event in your interface by using the following format:  

    [IssEvent]
    dataType eventName { get; }  

The possible data types are the same data types listed for properties, with the exception that you can't declare an event type to be a reference to another data model.  

Alarms are defined in the same way as events, with the exception that alarms must always be declared by using a complex data type.  

The following C# example demonstrates how to define a simple string event in your data model interface:  

        /// Event for StringEvent
        [IssEvent]
        string StringEvent { get; }  

###Actions
You define an action in your interface by using the following format:  

        [IssAction]
        void actionMethod(dataType1 sampleParameter1, dataType2 sampleParameter2, …);  

The class that implements the interface must implement the action method. The action method must have a void return type. The parameter data types can be simple or complex data types.
For example, an action declaration might look like the following:  

        /// Action with parameters
        [IssAction]
        void ParameterAction(string simpleParameter, StructType1 complexParameter);  

###<a name="subheading1"></a>Complex data types
You can create a complex data type for use with the managed ISS agent libraries by creating a **struct** in the following format:  

	namespace <namespace>
	{
	    using Microsoft.IntelligentSystems.Metadata.Annotations;
	
	    [IssStruct]
	    public struct ComplexType
	    {
	        // Declare read only properties or fields of the complex data type
	
	        /// Initializes a new instance of the ComplexType struct
	
	        public ComplexType( <list of properties or fields to initialize> )
	        {
	            // Initialize read only properties/fields
	        }
	
	        // Implement public get accessor for any private read only fields
	    }
	} 

In Microsoft .NET Framework, a **struct** is immutable, so all of the properties and fields of the **struct** must be declared as read-only and initialized when the **struct** is first constructed.  

Because the C# ISS client libraries use reflection to build the schema from the data model, the constructor parameters must have the same names as the properties/fields defined in the struct, but with a different case. For example, simpleParameter vs SimpleParameter.  

When your application needs to update the value of a complex type, it will need to create a new structure each time.  

The properties of a complex type can consists of the same simple data types that can be used to declare properties in the data model interface, and can also include other complex types that you have defined. However, you cannot have circular references within complex types.  

We recommend implementing the following methods for any **struct** that you create, although the managed ISS agent libraries do not require them:  

-	`GetHashCode`
-	`Equals`
-	`operator ==`
-	`operator !=`  

For readability, the examples in this topic do not include implementations of the previous methods.  

The following C# example demonstrates how define a complex data type that includes two properties: an integer and another complex data type:  

	namespace Contoso.Samples.DeviceModel.V1
	{
	    using Microsoft.IntelligentSystems.Metadata.Annotations;
	
	    /// Struct type 1
	    [IssStruct]
	    public struct StructType1
	    {
	        private readonly int simpleField;
	        private readonly StructType2 structField;
	
	        /// Initializes a new instance of the StructType1 struct
	        public StructType1(int simpleField, StructType2 structField)
	        {
	            this.simpleField = simpleField;
	            this.structField = structField;
	        }
	
	        /// Gets the int simpleField
	        public int SimpleField { get { return this.simpleField; } }
	
	        /// Gets the structField
	        public StructType2 StructField { get { return this.structField; } }
	    }
	}  

Alternatively, you could declare the properties by using a private set accessor, which allows you to initialize the properties when the **struct** is constructed, but keep the properties read-only. If you declare your properties this way, you must also make sure that the constructor invokes the base constructor before it attempts to assign values to the properties.  

The following example demonstrates how to use private set accessor to declare a complex data type.  

	namespace Contoso.Samples.DeviceModel.V1
	{
	    using Microsoft.IntelligentSystems.Metadata.Annotations;
	
	    /// Struct type 1
	    [IssStruct]
	    public struct StructType1
	    {
	        public int SimpleField { get; private set; }
	        public StructType2 StructField { get; private set; }
	
	        /// Initializes a new instance of the StructType1 struct
	        public StructType1(int simpleField, StructType2 structField) : this()
	        {
	            SimpleField = simpleField;
	            StructField = structField;
	        }
	    }
	}

###Alarms
An alarm is a special type of event that includes a **Severity** property in addition to any other data. You declare alarms in your data model interface the same way that you declare other events, except that the data type of an alarm must be a **struct** that is tagged with the attribute `[IssStruct(IsAlarm = true)]`.  

You can define an alarm type data type as follows:  

	namespace <namespace>
	{
	    using System;
	    using Microsoft.IntelligentSystems.Metadata.Annotations;
	
	    /// Alarm type
	    [IssStruct(IsAlarm = true)]
	    {
	        // Alarm data types must include a Severity property
	        public int Severity { get; private set; }
	
	        // Declare any additional properties
	
	    public SampleAlarmType(int severity, <additional property parameters>) : this()
	        {
	            Severity = severity;
	            // Initialize any additional properties
	        }
	    }
	}

Once you have defined the **struct** data type for the alarm, you can declare the alarm in your model interface in the same way that you declare an event:  

        [IssEvent]
        SampleAlarmType Alarm1 { get; }

For example, an alarm type declaration might look like the following:  

	namespace Contoso.Samples.DeviceModel.V1
	{
	    using Microsoft.IntelligentSystems.Metadata.Annotations;
	
	    /// Alarm type
	    [IssStruct(IsAlarm = true)]
	    public struct AlarmType
	    {
	        private readonly int severity;
	        private readonly int fieldI;
	        private readonly double fieldD;
	
	        /// Initializes a new instance of the AlarmType class
	        public AlarmType(int severity, int fieldI, double fieldD)
	        {
	            this.severity = severity;
	            this.fieldI = fieldI;
	            this.fieldD = fieldD;
	        }
	
	        /// Gets the severity
	        public int Severity { get { return this.severity; } }
	
	        /// Gets the int field
	        public int FieldI { get { return this.fieldI; } }
	
	        /// Gets the double field
	        public double FieldD { get { return this.fieldD; } }
	
	    }
	}

##Implement your data model
Next, you need to create a class that implements your data model interface. Your data model interface must be tagged as a root model.  

The class must implement any actions defined in the data model interface. In addition, your class should also implement the **IDisposable** interface, so your class declaration should resemble the following:  

    public class SimpleDevice : IDevice, IDisposable {…}  

In your class, you must implement the **get** accessor (and the **set** accessor for all settable values) for all properties and events defined in your data model interface. You must also implement any actions that you declared in your data model interface.  

Your class can include additional properties and methods beyond what is defined in the data model; however, you will not be able to send those properties directly to ISS. For example, your device model may contain methods to start a timer for periodically sending data to ISS.  

The following example demonstrates declaring a property, a non-alarm event, and an alarm event in your class:  

        /// Gets or sets the StructProperty
        public StructType1 StructProperty { get; set; }

        /// Gets or sets the StructEvent
        public StructType2 StructEvent { get; set; }

        /// Gets or sets the Alarm1
        public AlarmType Alarm1 { get; set; }

Your class must also implement any actions that your have defined in your data model interface.  

The following code demonstrates the implementation of a simple action with no parameters:  

        /// SimpleAction action
        public void SimpleAction()
        {
            Trace.WriteLine("SimpleAction called");
        }

While the following code demonstrates the implementation of a more complex action with several parameters:  

        /// ParameterAction action
        public void ParameterAction(string simpleParameter, StructType1 complexParameter)
        {
            Trace.WriteLine(string.Format(CultureInfo.CurrentCulture, "string={0}, struct={1}", simpleParameter, complexParameter));
        }

##Generate and upload the schema for your data model
The next step is to validate that you implemented your data model correctly by generating a schema for your data model and uploading the schema to ISS. Once you have generated and uploaded the schema for the data model, you do not need to do this again unless the data model changes.  

Because you need to generate and upload the schema only once for each revision of the data model, you may want to add a command-line option to tell your application to generate and upload the schema, or you can port your data model to a separate application that handles the schema generation and upload to ISS. Because uploading exactly same schema to your ISS account has no negative effect (other than generating an HTTP request), you can also choose to automatically generate and upload the schema each time your application runs if you prefer.  

You can use the **EdmxGenerator.Generate()** method to generate the schema by passing in the **Assembly** property of the root data model interface as follows:  

    using Microsoft.IntelligentSystems.Agent.EdmxGeneration;

    Tuple<string, string> schemaTuple = EdmxGenerator.Generate(typeof(IDevice).Assembly);

The **EdmxGenerator.Generate()** method returns a tuple value that contains two strings. The first string contains the namespace of the schema, and the second string contains the Common Schema Definition Language (CSDL) schema.  

The schema namespace is generated from the project namespace that contains the data model.  

Once you have the schema generated, you can upload the schema to your ISS account. To upload the schema, you need to provide the information required to access the management endpoint of your ISS account. This includes the management endpoint URL, the management access key, and the account name.  

You can upload the schema by creating a new **SchemaUploader** object and then calling the **Upload()** method, as the following example demonstrates:  

    using Microsoft.IntelligentSystems.Azure;

    var uploader = new SchemaUploader(managementEndpoint, accessKey, accountName);
    uploader.Upload(schemaTuple.Item1, schemaTuple.Item2, "Name of uploader", "Schema description");


During development, the schema is tagged as a scratch schema, which means that uploading a modified version of the schema deletes any previous implementations of the schema, along with any device registrations, alarms, and data that may have already been sent to ISS. If the schema is identical to the schema that already exists in your ISS account, then ISS ignores the new schema but returns a successful upload message.  

>[AZURE.NOTE] ISS allows only five devices to register against the same scratch schema. There is no limit to how many devices can register against a production schema.  

Once your data model is finalized, and you want to use the schema into a production environment, the administrator for your ISS account can update the schema to a production schema by using the [Create or update a schema definition]() REST API.  

Once a schema is uploaded as a production schema, it becomes much more difficult to update or delete the schema.  

##Register your device and start the ISS agent
Once you have created the classes, interfaces, and structs that define your device, your application must start an ISS agent to handle communication with ISS.  

###Create an instance of the ISS Azure agent
First, you'll need to create an instance of the **IssAzureAgent** class:  

    var issAgent = new IssAzureAgent(deviceEndpointUri, accessKey, accountName);

To create an instance of the **IssAzureAgent** class, you must provide the device endpoint URI, the access key for the endpoint, and the account name for your ISS account.  

If you have a device security token for the device, you can set the accessKey parameter to null and specify the device security token in the **RegisterObject **method call later on.  

If you want to modify the default configuration of the ISS agent instance, you can optionally provide a fourth parameter that is an **IssAzureAgentOptions** object that contains settings for the ISS agent class. For example, the following code demonstrates how to create an ISS agent that returns verbose messages while running:  

    var issAgent = new IssAzureAgent(deviceEndpointUri, accessKey, accountName,
        new IssAzureAgentOptions() { VerboseDiagnostics = true });

You can configure the following options by creating an **IssAzureAgentOptions** object: 

|Property	|Default value	|Description
|-----------|---------------|
|MessageBufferLimit |50	|An integer that represents the maximum number of messages to buffer. If the buffer is full when the ISS agent object receives a new message (as a result of a send or notify), the ISS agent object removes the oldest message from the buffer.
|MessageRetryDelay	|00:01:00	|A TimeSpan value that represents the time that the ISS agent object waits before attempting to resend a message.
|MessageRetryLimit	|50	|An integer that represents the maximum number of tries to resend a message. If the message cannot be sent successfully after the retry limit is reached, the message is discarded.
|VerboseDiagnostics	|false	|A Boolean value that indicates if the ISS agent object returns verbose diagnostic messages.

###Create an instance of your device and register it with the ISS agent
Next you must create an instance of your device model and then register it with your IssAzureAgent object.  

First, you must create an instance of your device model class. Next, you can create an object that represents the data model interface of your device by casting your device object as the data model interface that it implements. The reason you cast the device model class instance to the interface is because the **IssAzureAgent** methods expect to receive the data model interface as a parameter.  

Next, you must register your data model with the **IssAzureAgent** object by calling the **RegisterObject** method, which takes a data model interface, a device name, and an optional device security token as the parameters.  

For example, assume that your device application has defined the following elements:  

-	A data model interface called **IDevice**
-	A device model class called **SimpleDevice** that implements your data model interface..
-	An instance of the **IssAzureAgent** class called **issAgent**.
-	A per device security token for your device with the value of "EncryptedSecurityToken".  

Your code might look like the following:  

    var myDevice = new SimpleDevice()
    var device = (IDevice)myDevice;
    string deviceName = "DeviceName01";
    string deviceSecurityToken = "EncryptedSecurityToken";

    // Provide the information needed to register the device with ISS
    issAgent.RegisterObject(device, deviceName, deviceSecurityToken);

If you specify a device security token, the **IssAzureAgent** class uses it to register the device with ISS; otherwise the **IssAzureAgent** uses the device or management endpoint access key to register the device with ISS. If you do not specify a device security token, and specify a null value for the device endpoint access key, the **IssAzureAgent** returns a failed **RegistrationResult** when it tries to register the device, with a result message equal to "Device access key is missing."  

If you don't have a device security token, then you must specify the device or management endpoint access key when you create the **IssAzureAgent** object. In this case, your code might instead look like the following:  

    var myDevice = new SampleDevice()
    var device = (IDataModel)myDevice;
    string deviceName = "DeviceName01";

    // Provide the information needed to register the device with ISS
    issAgent.RegisterObject(device, deviceName);

###Register to receive notification when the ISS agent is ready to send data
Since the ISS agent can take a few seconds to start up and register your device with ISS, you want to make sure the ISS agent is ready to receive data before you start sending data and events. You can do this by subscribing to the **RegistrationResult IObservable** property of the **IssAzureAgent** object.  

The following code demonstrates how to subscribe to the **RegistrationResult** by using Reactive Extensions to avoid having to implement an **IObserver** object:   

    // Builds the callback for when registration succeeds/fails
    using (issAgent.RegistrationResult.Subscribe(result =>
    {
        if (result.Success)
        {
            // Registration is successful, the IssAzureAgent object is ready to send data
        }
        else
        {
            // Registration failed, the error message is contained in result.Message
        }
    } ))  

The ISS agent ignores any messages that your application sends until registration is complete. 

If registration does not succeed, you must discard the current **IssAzureAgent** object and create a new instance.  

###Start the ISS agent
Next, you must start your instance of the **IssAzureAgent** so that your application can send the device state, notify about events, and receive commands from ISS. You do this by calling the **Start()** method on your ISS agent instance:  

    issAgent.Start();  

The **Start()** method raises an asynchronous process that handles communication with ISS. Your instance of the ISS agent will register your device with ISS and notify any subscribers when registration is complete.  

##Send device state and events to ISS
Once the ISS agent has successfully started and registered your device, your application can start sending state data, notify about events, and respond to action invocations. The ISS agent automatically invokes any action methods that you have defined in your data model. You can send properties and notify about events by calling the **Send()** and **Notify()** methods on the **IssAzureAgent** object.  

Each **Send()** and **Notify()** method call results in the ISS agent creating a single message to send to ISS.  

If the ISS agent cannot send a message due to connectivity issues, the ISS agent stores the message in a buffer and retries sending the message after a set amount of time. The time between retries, the number of times to retry, and the maximum number of messages to keep in the buffer can be configured in the *IssAzureAgentOptions* parameter when you create an instance of the **IssAzureAgent** class.  

###Send the device state to ISS
You can send the entire state of your device to ISS in a single method call by calling the **Send()** method on your instance of the **IssAzureAgent** and passing in the data model interface:  

    issAgent.Send(device);  

This sends the current value of all properties that you defined in your data model to ISS. If your data model is a composite data model, the state of all referenced data models is also sent.
If you don't want to send the entire state of the device, you can send individual properties in the **Send()** method by using a lambda expression to select a subset of your data model:   

    issAgent.Send(device, t => t.StringProperty);  

You can send multiple properties by specifying additional lambda expressions separated by commas:  

    issAgent.Send(device, t => t.StringProperty, t => t.StructProperty);  

You can also drill down into referenced data models if your data model is a composite data model:  

    issAgent.Send(device, t => t.SubDataModel.Property1);  

###Notify ISS about events
You can notify ISS about an event or alarm by calling the **Notify()** method on your instance of the **IssAzureAgent**. You must use a lambda expression to specify the event:  

    issAgent.Notify(device, t => t.Event1);  

Because an alarm is just a specific type of an event, you notify about alarms in the same way as you notify about events:  

    issAgent.Notify(device, t => t.Alarm1);  

If your data model is a composite data model, you can drill down into the sub models in your lambda expressions in order to send an event:  

    issAgent.Notify(device, t => t.SubModel.Event1);  

Unlike properties, you cannot notify about multiple events in a single **Notify()**.  

##See Also
[Developer guide for C client libraries]()
