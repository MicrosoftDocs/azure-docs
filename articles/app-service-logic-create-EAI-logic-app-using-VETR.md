<properties 
   pageTitle="Create EAI Logic App using VETR" 
   description="This topic covers the features of BizTalk XML services and details the Validate, Encode and Transform features." 
   services="app-service-logic" 
   documentationCenter=".net,nodejs,java" 
   authors="rajeshramabathiran" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="03/05/2015"
   ms.author="rajram"/>

##Create EAI Logic App using VETR

###Understanding VETR pattern
A lot of EAI scenarios involves mediating data between a source and a destination. In this article, we will take a look at one of the most common integration patterns - one way message mediation (VETR).

![Basic VETR flow][1]

VETR pattern mediates data between a source entity and a destination entity. Usually source and destination are data sources. Lets take a look at few examples.

**EOD Processing**

A lot of applications produce data end of day and store them in a secure storage location (e.g. FTP). These need to be processed and updated in ERP system (e.g. SAP). Since any file can be dropped in the storage location, it needs to be validated first - to ensure validity of the content being processed. SAP has a specific data format in which it expects data. The incoming data need not exactly the data format required by SAP. So the incoming data needs to be converted to the format required by SAP.

Thus, the end-end flow looks like the one depicted below.
FTP -> Validate -> Transform -> SAP

**Normalize data**

Consider a website that accepts orders. Users post orders in website (HTTP). Behind the scene the orders will be queued for further processing (e.g. Service Bus queue). The order processing system which processes the orders from the queue expects data in a specific format. The incoming data from the website needs to be validated for correctnes and then normalized before it is persisted in the queue.

Thus, the end-end data flow looks like the one depicted below
HTTP -> Validate -> Transform -> SAP

These are just two examples. Note that a common pattern emerges.

*Trigger* - Source which triggers the message event (e.g. app dropped a file in FTP share).

*Validate* - Validate the correctness the incoming data

*Transform* - Transform the data from the incoming format to a format required by the downstream 
system

*Connector* - Destination entity where the data is being sent to

###Constructing a basic VETR pattern
1. Log into Azure portal
2. Create a new logic app
3. In the logic app flow designer,
	1. Drag and drop HTTP Listener API App
	2. Drag and drop BizTalk XML Validator API App
	3. Drag and drop BizTalk Transforms API App
	4. Drag and drop Service Bus API app
4. Configure HTTP Listener as Trigger, and the rest of the API Apps as actions
5. Configure BizTalk XML Validator and upload the incoming schema
6. Configure BizTalk Transforms and upload the transform which normalizes the incoming data
7. Drag and drop the output of HTTP listener to the input of Validate
8. Configure output of HTTP Listener as the input of BizTalk XML Validator. Also, provide the name of the schema to validate against.
9. Configure the output of HTTP Listener as the input of BizTalk Transforms. Also, provide the name of the transform to normalize the incoming data.

<!--image references -->
[1]: ./media/app-service-logic-create-EAI-logic-app-using-VETR/BasicVETR.PNG
