<properties title="Build and run the ISS getting started sample" pageTitle="Build and run the ISS getting started sample" description="Get started developing for ISS by building and running the getting started sample." metaKeywords="Intelligent Systems,ISS,IoT,develop,get started, sample" services="intelligent-systems" solutions="" documentationCenter="" authors="kevinasg" manager="jillfra" videoId="" scriptId="" />

<tags ms.service="intelligent-systems" ms.devlang="dotnet" ms.topic="article" ms.tgt_pltfrm="multiple" ms.workload="tbd" ms.date="11/13/2014" ms.author="kevinasg" ms.prod="azure">

#Build and run the getting started sample
This tutorial describes how to build and run the getting started sample project to demonstrate the basic concepts of developing a device application for Azure Intelligent Systems Service (ISS). The getting started sample uses the C# ISS client library to create a device application that simulates a simple thermostat device.  

The sample can be found in the ISSSDK zip file, under the Contoso.Samples.GettingStarted folder.

##Prerequisites
Before you start this tutorial, make sure you have the following items:  

-	Visual Studio 2013.
-	The ISS SDK.
-	An active ISS account.
-	The following info for your account:
	-	The account name
	-	The management endpoint
	-	The management endpoint access key
	-	The device endpoint   
	For more information about how to get this info from your account, see [ISS endpoints and access keys](./iss-endpoints-access-keys.md).
-	A working connection to the Internet.  

##Table of contents
This tutorial walks you through the following steps:  

-	[Download and unzip the ISS SDK](#subheading1)
-	[Open and configure the getting started sample](#subheading2)
-	[(Optional) View the data model for the device](#subheading3)
-	[Generate and upload the schema for the data model to your ISS account and register your device](#subheading4)
-	[Run the getting started device project](#subheading5)
-	[Manage your device in the ISS management portal](#subheading6)

##<a name="subheading1"></a>Download and unzip the ISS SDK
The ISS SDK is a zip file that contains the ISS client libraries and several code samples that use the libraries, including the getting started sample. Before you can complete this tutorial, you must unzip the ISSSDK.zip file to a location on your computer.  

##<a name="subheading2"></a>Open and configure the getting started sample
The getting started sample is located in the Contoso.Samples.GettingStarted in the ISSSDK folder.  

The Contoso.Samples.GettingStarted solution contains the following projects:  

- Contoso.Samples.GettingStarted.DataModel - This project demonstrates how to declare the data model.
- Contoso.Samples.GetingStarted.Registration - This project demonstrates how to generate a schema from the data model, upload the schema to your ISS account, and register your device with your ISS account.
-	Contoso.Samples.GettingStarted.Device - This project demonstrates how to connect your device with your ISS account and send data and receive commands.  
-	
Before you can run the getting started sample, you must enter some information so that the sample can connect to your ISS account.  

###To open and configure the Contoso.Samples.GettingStarted sample
1.	Open ISSSDK/Contoso.Samples.GettingStarted/Contoso.Samples.GettingStarted.sln in Visual Studio 2013.
2.	On the **Solution Explorer**, expand the **Configuration** folder and double-click AccountInfo.xml to open the file  
The file should look like the following:  
  
		<Account>
			<DeviceID>[DEVICE ID HERE]</DeviceID>
			<Name>[ACCOUNT NAME HERE]</Name>
			<ManagementAccessKey>[MANAGEMENT ACCESS KEY HERE]</ManagementAccessKey>
			<ManagementEndpoint>[PLACE MANAGEMENT ENPOINT HERE]</ManagementEndpoint>
			<DeviceEndpoint>[PLACE DEVICE ENDPOINT HERE]</DeviceEndpoint>
		</Account>    

3.	Choose a name for your device. The name must be all alphanumeric characters, cannot contain spaces or underscores, and must be less than 36 characters long. Set the value of the DeviceID to the name of your device.
4.	Set the value of ManagementAccessKey, ManagementEndpoint, and DeviceEndpoint to the appropriate values for your ISS account. For more information about how to get this info from your account, see [ISS endpoints and access keys](./iss-endpoints-access-keys.md).
For example, if your account name was treyresearch, your file would look similar to the following:  

    	<Account>
    		<DeviceID>MyThermostatDevice001</DeviceID>
    		<Name>treyresearch</Name>
    	<ManagementAccessKey>abcdegf123456xyz</ManagementAccessKey>
    	<ManagementEndpoint>https://treyresearch.management.intelligentsystems.azure.net/</ManagementEndpoint>
    	<DeviceEndpoint>https://treyresearch.device.intelligentsystems.azure.net/</DeviceEndpoint>
    	</Account>  

5.	Save AccountInfo.xml  

##<a name="subheading3"></a>(Optional) View the data model for the device
The data model for the Getting Started sample is defined in the Contoso.Samples.GettingStarted.DataModel project. This project builds a class library. You can add references to this class library to other projects in order to use the data model in multiple projects.  

The getting started data model is composed of the following elements and is defined in the file IThermostatDataModel.cs:

|&nbsp;|&nbsp;
|------|-----	
|Temperature	|A simple integer property that indicates the current temperature reading of the device.
|Location	|A complex property that represents the geographical location of the device. Location consists of latitude and longitude fields.
|OperationEvent	|A simple string event, used in this sample to indicate a change in the operation status of the device.
|OverTemperatureAlarm	|An alarm that indicates if the temperature of the device is above a certain level. OverTemperatureAlarm contains a string message and an integer severity.
|PrintMessage	|An action that prints a string message received from ISS.

###To build the data model
1.	In Visual Studio 2013, on **Solution Explorer**, right click Contoso.Samples.GettingStarted.DataModel and select **Build**.
>[AZURE.NOTE] If you change the data model and upload the new schema, any existing schema with the same name is deleted, along with any devices and data associated with that schema. To avoid conflict with other developers working with the sample in the same account, if you modify the data model, you should change the namespace Contoso.Samples.GettingStarted.DataModel throughout the solution to a namespace unique to you. For example, you could append your email alias to the end of the namespace.  

##<a name="subheading4"></a>Generate and upload the schema for the data model to your ISS account and register your device
Before your device can send data to ISS, you must first perform the following registration tasks:   

-	Generate a CDSL schema based on the data model.
-	Upload the schema to your ISS account.
-	Register your device with your ISS account and get a device security token.  

The Contoso.Samples.GettingStarted.Registration project handles all of these tasks for you. You only need to run the project once for each device that you want to register, unless you modify the data model.    

###To upload the schema for your data model and register your device
1.	On the **Solution Explorer**, right-click the **Contoso.Samples.GettingStarted.Registration** project and select **Set as StartUp Project**.
2.	Build and run the registration project. The project will try to upload the schema to your account and then register your device. Any error messages are displayed in the console window.  
The project saves the schema to a file named schema.edmx in the current directory, which by default is ISSSDK\Contoso.Samples.GettingStarted\bin\Debug.  
In the same directory, the project also saves the device security token to a file, which is read by the device project. The default file name for the device security token is <Device ID>.txt, where <Device ID> is the device ID that you specified in AccountInfo.xml.  

##<a name="subheading5"></a>Run the getting started device project
Now that your device is registered with your ISS account, you can run the device project to send data to your ISS account and to respond to commands from your ISS account.  

The Contoso.Samples.GettingStarted.Device project simulates a device by sending a set of data to ISS, sending an event, raising an alarm, and then waiting for commands to be sent from ISS until you exit the program.  

###To run the getting started device project
1.	On the **Solution Explorer**, right-click the **Contoso.Samples.GettingStarted.Device** project and select Set as **StartUp Project**.
2.	Build and run the device project. The project will try to send data, an event, and an alarm to your ISS account. Bus diagnostic messages are displayed in the console window, as are any error messages.
3.	Leave the program running for the next step to see the device respond to commands.  

##<a name="subheading6"></a>Manage your device in the ISS management portal
ISS provides an ISS management portal that you can use to manage your devices and view data from your device.  

###To manage your device in the ISS management portal
1.	In a web browser, connect to the ISS management portal. The URL should be similar to https://<account name>.portal.intelligentsystems.azure.net.
2.	On the menu, navigate to **Devices**.
3.	The dashboard defaults to displaying device groups. In the **Quick Links** menu, select **All Devices** in the drop down box.
4.	You should see a list of all devices that are registered to your account. Find the device that you registered with the getting started sample and click on it to view device details.
5.	Click on alarms to view the active alarms raised by the device. You can click on an alarm for further details about the alarm.
6.	If you click the checkbox next to the alarm on the all alarms view, a new Actions menu appears on the menu bar. You can use the Actions menu to change the status of an alarm.
7.	Navigate back to the device detail view, and click **Device data** to see data that your device sent to your ISS account. Recently sent data may take several minutes before it is visible in the portal.
8.	Navigate back to the **All Devices** view.
9.	Click the checkbox next to the device you registered with the getting started sample.
10.	On the menu bar, click the **Actions** menu item, and select **Commands** in order to send a command to the device. The ISS management portal presents a drop down list with a list of the commands available to the selected device.
11.	In the dropdown list, select Contoso.Samples.GettingStarted.DataModel.PrintMessage.
12.	In the message field, enter a text string message, and click **Submit**.
13.	If the getting started device sample is still running, it will display the message you sent. If the sample is not running, the sample will display the messages the next time you run the sample.  

##Next steps
Once you have the getting started sample running and sending data from a simulated device to your ISS account, the next steps are:
1.	Try extending the data model in the getting started sample. For more information, see [Developer guide for managed ISS agent libraries](./iss-C#-dev-guide.md).
2.	Try to export the data from your ISS account into Power Query. For more information, see [Analyze your data with Power Query](./iss-analyze.md).
