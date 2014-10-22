<properties title="Intelligent Systems Service Overview" pageTitle="Intelligent Systems Service Overview" description="An introduction to Intelligent Systems Service in Azure." metaKeywords="Intelligent Systems,ISS,IoT" services="intelligent-systems" solutions="" documentationCenter="" authors="jdecker" manager="alanth" videoId="" scriptId="" />

<tags ms.service="intelligent-systems" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="tbd" ms.date="11/13/2014" ms.author="jdecker" ms.prod="azure">

#Intelligent Systems Service overview
Azure Intelligent Systems Service (ISS) is a cloud-based service built on Microsoft Azure that provides a complete solution for enterprises that want to get value from machine-generated data.  

Devices and sensors can produce data, and that data can help businesses improve their operations, but how do you collect that data to make use of it? How do you make that data work for you by notifying you when conditions change or problems occur? How do you manage security for that data? ISS answers those questions by integrating Azure technologies that make it easy to:  

-	Connect devices to your service.
-	Collect and store data from your devices securely. 
-	Bring events to your attention by sending alarms.
-	Send files and commands to your devices.
-	Apply analytics tools to your data.
 
![][1]  

##ISS in action
As an example, we’ll follow the story of Contoso, Ltd., a vending machine operator that wants to track the inventory and general state of their machines. Some of their challenges include short-term issues, such as knowing when a vending machine is out of service or when stock levels of different items are low, and long-term questions about more cost-effective inventory plans and route scheduling.  

Each day, service technicians drive set routes to check the machines on that day's route. Each machine is visited once a week. The technicians refill the vending machines, collect money, make repairs, and so on. The technicians carry handheld devices running a line-of-business (LOB) app in which they record the status and activities for each machine. At the end of the day, the technicians turn in their handheld devices so the data can be transferred to a database.  

An administrator in the office runs weekly reports from the database. Over time, Contoso accumulates information that they can use to adjust their inventory plans and routes. However, because it takes time to gather that data and the data is old by the time it is analyzed, their operations aren't as efficient as they could be. Popular items can sell out and those slots remain empty for days until the next scheduled visit. A broken or malfunctioning vending machine makes no money. Service technicians have a limited amount of space for stock in their trucks and might not have sufficient replacements for unexpected variations in a machine's items.  
   
A Contoso vending machine contains an inventory tracking application, a temperature sensor, and a digital thermostat that can control the cooler temperature. The vending machines run Windows 7 and have TCP/IP connectivity. Contoso knows there is valuable data in these smart machines, but finds the problems involved in defining and automating secure data collection to be intimidating.  

ISS provides an end-to-end solution for Contoso. After Contoso sets up their ISS account, Contoso’s developers download the ISS SDK and use the sample code to add the device application for ISS to their vending machine software. They configure the device application to transmit the available data from the vending machines to Contoso’s ISS account after every transaction, or once an hour if there were no transactions.  

The developers set up an alarm to alert Contoso when a machine reports a cooler temperature higher than 55 degrees Fahrenheit. Another major concern is running out of stock, so the developers define low inventory alarms for each drink SKU.   

The administrator can connect to the ISS management portal on any browser on any device to see alarms and status of all of the connected devices. Using Microsoft Power Query for Excel, he retrieves the data sent by the devices to ISS, and analyzes usage patterns to inform inventory planning.  

##How ISS works
ISS runs on Azure, which provides authentication through Microsoft Azure Active Directory (Microsoft Azure AD). Each ISS account is assigned a storage account and three endpoints that provide access to specific functions:  

- The **device endpoint** receives data from devices.  

- The **management endpoint** processes the data and stores it.  

- The **data endpoint** allows you to retrieve your data.  

On the device, the device application is configured with a model definition that identifies the data that will be sent. The model definition contains all of the information about the device, the alarms and events the device can trigger, and the commands the device can accept. The device application registers the device to an ISS account using the device endpoint and provides an access key or per-device security token to authorize itself to ISS.  
 
>[AZURE.NOTE] For more information about using security tokens and access keys, see [Best practices for device registration](./iss-best-practice-device-registration.md).  

Registered devices begin sending data as defined in the model definition. The data is passed from the device service to the management service where rules are applied against the data. Commands that have been configured in the model definition can be sent from the management service to the device.
 
![][2]

Within the ISS management portal, you can view all registered and active devices. The dashboard summarizes the status of devices and alarms. You can drill down on any device or alarm for more details, including recent data received from the device.   

You can retrieve your data from ISS directly through the OData feed on the data endpoint. The simplest way to connect to the Odata feed is through Power Query for Excel.   

##Next steps
-	[Connect your device application to ISS by using the ISS agent libraries](./iss-client-libraries.md)
-	[Structure the data from your devices](./iss-plan-data-model.md)
-	[ISS customer workflow](./iss-workflow.md)
-	[Set up your ISS account]()
  

[1]: ./media/iss-overview/iss-overview-01.jpg
[2]: ./media/iss-overview/iss-overview-02.jpg
