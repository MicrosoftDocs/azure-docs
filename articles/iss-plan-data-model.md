<properties title="Plan the ISS data model for your devices" pageTitle="Plan the ISS data model for your devices" description="Evaluate your device data to plan your ISS data model." metaKeywords="Intelligent Systems,ISS,IoT,data model,model definition" services="intelligent-systems" solutions="" documentationCenter="" authors="jdecker" manager="alanth" videoId="" scriptId="" />

<tags ms.service="intelligent-systems" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="tbd" ms.date="11/13/2014" ms.author="jdecker" ms.prod="azure">

#Plan the ISS data model for your devices
To help you structure the data that your devices will send to Azure Intelligent Systems Service (ISS), you should look at how you need to use that data. You should review your current systems to see what data you need from your devices and what data is available from your devices.  

##Understand what you need
The first thing you need is a clear understanding of what you hope to get from ISS. One of the best ways to do this is to make a list of the reports you want to get, the information you need, the alarms you want to receive, etc.

<table>
<tr>
<th>Example scenario</th>
</tr>
<tr>
<td>The Contoso management team needs the following daily reports:</br>
<ul>
<li>Previous day's sales, broken out by drink SKU</li> 
<li>Previous day's sales, broken out by the type of machine</li>
</ul>
The team also wants to set up alarms on their vending machines to help prevent the following issues:</br>
<ul>
<li>Coolers in the machines failing. During the hot summer months, a cooler failure always means lower sales, and some machines carry drink SKUs that could spoil if the temperature goes above 55 degrees F.</li>
<li>Machines running out of inventory. No inventory means missed sales.</li>
</ul>
</td></tr> 
</table>

##Understand what you have
The next step is to assess what information is available from your devices.   

-	What data can your devices track? What sensors do they have? What format is that data in? 
-	What alarms or alerts do you want from your devices? How severe is each alarm? 
-	Are there any other local events you want to track (events that you don't consider alarms)?
-	Can your device adjust any settings or perform any actions that you want to trigger from the service?

<table>
<tr>
<th>Example scenario</th>
</tr>
<tr>
<td>Contoso's vending machines contain an inventory tracking application and a temperature sensor inside the cooler. Each machine can provide the following information in the listed format:</br>
<table>
<tr>
<th>Property</th>
<th>Format or data type</th>
</tr>
<tr>
<td>Vending machine ID</td>	
<td>String</td>
</tr>
<tr>
<td>Current cooler temperature (in Fahrenheit)</td>
<td>Double</td>
</tr>
<tr>
<td>ID of each drink SKU in the machine</td>	
<td>String</td>
</tr>
<tr>
<td>Current inventory for each drink SKU</td>	
<td>Integer</td>
</tr>
</table>
The Contoso development team will use the cooler temperature and inventory properties to define <i>alarms</i>.
</br>
</br>
Some of Contoso's newer vending machines have a digital thermostat that controls the cooler temperature. The Contoso development team wants to set the cooler temperature remotely by sending commands from the ISS management portal. This will be defined as an action.
</table>

After you identify what you want to know and the information that is available from your devices, your next step is [Plan the data model for your devices]().  

##Separate your devices by feature and function
If you have several different types of devices with different capabilities, you will probably need to create multiple data models to describe these different devices. First, separate your devices into categories based on their main features and functions. Then, review each category and determine which devices share most of the same properties, events, and actions. These devices can all use the same data model.  

<table>
<tr>
<th>Example scenario</th>
</tr>
<tr>
<td>To build the data model, the Contoso development team separates machines that carry perishable drink SKUs and machines that don’t carry perishable drink SKUs. If a machine carries a drink SKU that could spoil if the temperature rose above 55 degrees F, the team wants that machine to trigger an alarm when the cooler temperature hit 56 degrees F. However, if a machine does not carry any perishable drink SKUs, they don't want to trigger an alarm until the temperature hit 65 degrees F.</td>
</tr>
</table>

##Plan the data model for your devices
The data model contains all the information about your devices, including information about the device state, the alarms and events the device can trigger, and the commands the device can accept. By planning out your data models before you start developing code for your devices, you can minimize the number of changes and updates you need to make.  

You should divide the information from your devices into the categories described in the following table: 

|Type of information	|Description
|-----------------------|-----------
|Properties	|Properties can refer to any data that your device can track. The collection of properties that provide information about the device at a given time is the device state. You can use properties to define events, alarms, and actions. 
|*Events*	|Events contain information that your device sends to the service in response to a local trigger. For example, when a device logs a purchase, you can use an event to have that device send updated inventory data to the service
|*Alarms*	|An alarm is a special type of event that contains a severity code and a management status (active, ignored, or closed). Once an alarm is active, any other instances of that alarm are counted together until the status changes to closed. Use an alarm when you want to track the status of an event in the ISS management portal.
|Actions	|Actions tell the service what commands your device can recognize and perform. If you define actions for a device, you can send commands from the service that will invoke those actions on your device.

###Supported data types
ISS supports the following simple data types:  

-	String
-	32-bit integer (Int32) 
-	64-bit integer (Int64) 
-	Double
-	Long
-	Guid
-	Boolean (Bool)
-	Stream (for binary data)  

The following table describes some common data types that are not currently supported along with a workaround if you need to use these data types:

|Non-supported data types	|Workaround
|---------------------------|----------
|8-bit or byte integer (IntByte) 	|Use Int32 instead.
|16-bit integer (Int16)	|Use Int32 instead
|Collections	|Use an event to send a complex data type that represents your collection
|Enumerations	|Use an event to send a complex data type that represents your enumeration

You can use complex data types to group two or more simple data types together into a single property. Complex data types can also make it easier to refer to properties that should always be grouped together.

<table>
<tr>
<th>Example scenario:</th>
</tr>
<tr>
<td>The Contoso development team needs to distinguish between older machines that have an analog thermostat and new machines that have a digital thermostat. They also want to know the setting of thermostat, so they can change this setting on the digital machines. They decide to create a complex type called <i>Thermostat</i> to represent this information:

<table>
<tr>
<th>Property Name</th>	
<th>Data type</th>
</tr>
<tr>
<td>ThermostatType</td>	
<td>String (Analog or Digital)</td>
</tr>
<tr>
<td>Setting</td>	
<td>Double</td>
</tr>
</table>
</td>
</tr>
</table>

###Represent complex data types with events  

Each time an event trigger occurs, the device sends all the properties associated with that event to the service, and each event transmission creates a separate record in the output data. This means that you can use events to handle more complex data types such as collections and enumerations.   

First, define a complex data type that contains all the properties that you want your device to send. Then, define an event that causes the device to send that complex data type each time the trigger occurs.

<table>
<tr>
<th>Example scenario</th>
</tr>
<tr>
<td>To handle the complex data from their machines, the Contoso development team decides to define an event to send the inventory report after each purchase. First, they define a complex type called <i>UnitSale</i> to represent the information the machines should send. 
<table>
<tr>
<th>Property Name</th>	
<th>Data type</th>
</tr>
<tr>
<td>DrinkId</td>	
<td>String</td>
</tr>
<tr>
<td>DrinkName</td>	
<td>String</td>
</tr>
<tr>
<td>UnitCount</td>	
<td>Int32</td>
</tr>
<tr>
<td>UnitPrice</td>	
<td>Double</td>
</tr>
<tr>
<td>RemainingInventory</td>	
<td>Int32</td>
</tr>
</table>

When they define their events, they will create a <i>Sale</i> event that sends a UnitSale data type to the service.</td>
</tr>
</table>

###Mapping the output back to the data model
When the service processes your data, it separates data from properties, events, and alarms. The service then converts the data into a format that you can use with standard analytics tools such as Microsoft Power Query for Excel and makes the data available at different OData feeds. The following diagram shows how the service outputs data from your devices:
 
![][1]

-	Data from any properties defined as part of an event is available at the *Events* OData feed.
-	Data from all properties defined as part of an alarm is available at the *Alarms* OData feed.  
	>[AZURE.NOTE] Since alarms are a type of event, the events feed includes properties defined for an alarm.
-	Data from all other properties defined on the device (that is, properties not defined as part of an event or alarm) is available at the *State* OData feed.  

The output data always has the following mappings:  

-	Properties defined by events are mapped to columns as <*Event name*>_<*Property Name*>.
-	Properties defined by alarms are mapped to columns as <*Alarm name*>_<*Property Name*>.
-	All other properties are mapped to columns as <*Property Name*> for simple data types or <*Complex type name*>_<*Property Name*> for complex data types.

<table>
<tr>
<th>Example scenario</th>
</tr>
<tr>
<td>For the Contoso Sale event described above, the service maps the properties to columns as follows:
<table>
<tr>
<th>Property name in data model</th>
<th>Column name in data output</th>
</tr>
<tr>
<td>DeviceName</td>	
<td>ISS_DeviceName</td>
</tr>
<tr>
<td>DrinkId</td>	
<td>Sale_DrinkId</td>
</tr>
<tr>
<td>DrinkName</td>	
<td>Sale_DrinkName</td>
</tr>
<tr>
<td>UnitCount</td>	
<td>Sale_UnitCount</td>
</tr>
<tr>
<td>UnitPrice</td>	
<td>Sale_UnitPrice</td>
</tr>
<tr>
<td>RemainingInventory</td>
<td>Sale_RemainingInventory</td>
</tr>
</table>
<blockquote>
<p>[AZURE.NOTE] The service adds <i>ISS_</i> to the front of system properties; do not create any properties that start with <i>ISS_</i>.</p>
</blockquote>

Sample output data would resemble the following:
<table>
<tr>
<th>ISS_DeviceName</th>	
<th>Sale_ DrinkId</th>	
<th>Sale_ DrinkName</th>	
<th>Sale_ UnitCount</th>	
<th>Sale_ UnitPrice</th>	
<th>Sale_ RemainingInventory</th>
</tr>
<tr>
<td>ContosoVM001</td>	
<td>P1008</td>	
<td>Cola</td>	
<td>20</td>	
<td>1.2</td>
<td>10</td>
</tr>
<tr>
<td>ContosoVM001</td>	
<td>P1013</td>	
<td>Power IT PRO</td>	
<td>15</td>	
<td>1.75</td>	
<td>13</td>
</tr>
<tr>
<td>ContosoVM001</td>	
<td>P1008</td>	
<td>Cola</td>	
<td>20</td>	
<td>1.2</td>	
<td>11</td>
</tr>
</table>
</td>
</tr>
</table>


[1]: ./media/iss-plan-data-model/iss-plan-data-model-01.png