<properties title="Estimate the size of your ISS data" pageTitle="Estimate the size of your ISS data" description="Learn how to estimate the amount of data your devices will send to ISS." metaKeywords="Intelligent Systems,ISS,IoT,get data, data size" services="intelligent-systems" solutions="" documentationCenter="" authors="jdecker" manager="alanth" videoId="" scriptId="" />

<tags ms.service="intelligent-systems" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="tbd" ms.date="11/13/2014" ms.author="jdecker" ms.prod="azure">


#Estimate the size of your ISS data
This topic explains how to estimate the amount of data your devices will send to your Azure Intelligent Systems Service (ISS) account and how to estimate the size of data contained in a query.  

When you build reports or queries to retrieve data from the ISS OData feeds, you should consider the amount of data you are going to retrieve. The size of the data directly affects the performance of Excel worksheets and Power BI reports.  
 
##Assumptions
For simplicity, this topic uses the following assumptions to calculate the amount of data:  

-	If you have multiple data models, you should estimate the amount of data separately for each data model.  
-	Each device always sends the same number of properties, and the properties do not change data type. 
-	All of the properties sent from the device contain data (that is, the data is not sparse).
-	These data calculations ignore all protocol headers.
-	Because events and alarms are hard to predict, this topic does not include events or alarms in the calculations.  

If you need more precise estimations, you can change any or all of these assumptions based on the behavior of your devices. For example, if you can predict how often a specific event will occur on your devices, you can include this in your estimation.  

##Formulas
To estimate the amount of data, we will use the following parameters:

|Parameter	|Description
|-----------|-----------
|*s* 	|The total number of bytes from all properties in the data model. (This can be used to estimate the amount of data in each row of a table or query.)
|*t*	|The number of data transmissions each device makes per minute.
|*d*	|The number of devices that use this data model.
|*r*	|The number of rows included in a query.

  
To calculate the amount of data from your devices, use the following formulas:  

**To estimate the amount of data transmitted per minute, per device**  

*s* X *t*  

If you have multiple data models, this value will be different for each data model.

**To estimate the amount of data transmitted per minute from all devices**  

*s* X *t* X *d*  

If you have multiple data models, calculate this value separately for each data model and add the results together.

**To estimate the total amount of data saved to your ISS account per day**  

*s* X *t* X *d* X 1440.  

If you have multiple data models, calculate this value separately for each data model and add the results together.

**To estimate the amount of data contained in a query**  

*s* X *d* X *r*

For information about the memory limitations in Excel, see [Data Model specification and limits](http://go.microsoft.com/fwlink/p/?LinkID=403688). For information about how to create a memory-efficient report in Excel, see [Create a memory-efficient Data Model using Excel 2013 and the Power Pivot add-in](http://go.microsoft.com/fwlink/p/?LinkId=403689).  

For information about how to create queries to retrieve data from your ISS account, see [Retrieve and analyze your ISS data](). To see diagnostic data from your devices, see [See diagnostic data from your devices](./iss-diagnostics.md).
