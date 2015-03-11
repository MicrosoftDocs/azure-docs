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
Most EAI scenarios involves mediating data between a source and a destination. There is a common set of needs to fulfill these scenario


- Ensure the data obtained from the different systems are in the right format


- Look up on some aspect of the incoming data to make decisions


- Convert data from one format to another format (for example, CRM systems might store the data in one format, and ERP might store the same data in some other format)


- Route the data to selected destination

In this article, we will take a look at one of the most common integration patterns - one way message mediation (VETR).

VETR pattern mediates data between a source entity and a destination entity. Usually source and destination are data sources. Let’s take an example:

Consider a website that accepts orders. Users post orders in website (HTTP). Behind the scene the orders will be queued for further processing (e.g. Service Bus queue). The order processing system which processes the orders from the queue expects data in a specific format. The incoming data from the website needs to be validated for correctness and then normalized before it is persisted in the queue for further processing. Thus, the end-end data flow looks like the one depicted below 

HTTP -> Validate -> Transform -> Service Bus


![Basic VETR flow][1]

The API Apps that help in building this pattern

*Trigger* - Source which triggers the message event (e.g. app dropped a file in FTP share).

*Validate* - Validate the correctness the incoming data

*Transform* - Transform the data from the incoming format to a format required by the downstream 
system

*Connector* - Destination entity where the data is being sent to

###Constructing a basic VETR pattern
####The Basics
First, go to https://aka.ms/ApiAppsPublicPreview and sign in to your Azure subscription. 

Once you’ve signed in click on the + New button at the bottom-left of the screen. Select Logic Apps. 

When you click on Logic Apps, you’ll have to fill out some basic settings to get started:


- Name your App something you’ll remember


- Choose the App Hosting Plan that you’ll use to pay for your flow. Note: you can get started with Free App


- Choose the Resource group for your App – resource groups act as containers for your apps – all of the resources for your app will go to the same resource group.


- Choose which Azure subscription you’d like to use.


- Choose a location to run your flow from.

Once you’ve filled out the basic settings for your flow you can add Triggers and Actions click there to get started.

####Adding a HTTP Trigger
Select HTTP Listener from list displayed on the right side.
Configure HTTP Listener as Trigger, and the rest of the API Apps as actions

![HTTP Trigger][2]

####Adding a Validate action
Configure BizTalk XML Validator and upload the incoming schema
Drag and drop the output of HTTP listener to the input of Validate

![BizTalk XML Validator][3]

####Adding a Transform action
Configure BizTalk Transforms and upload the transform which normalizes the incoming data 
Configure the output of HTTP Listener as the input of BizTalk Transforms. Also, provide the name of the transform to normalize the incoming data.

![BizTalk Transforms][4]

####Adding a Service Bus connector
![Service Bus][5]

###And you are done!

<!--image references -->
[1]: ./media/app-service-logic-create-EAI-logic-app-using-VETR/BasicVETR.png
[2]: ./media/app-service-logic-create-EAI-logic-app-using-VETR/HTTPListener.png
[3]: ./media/app-service-logic-create-EAI-logic-app-using-VETR/BizTalkXMLValidator.png
[4]: ./media/app-service-logic-create-EAI-logic-app-using-VETR/BizTalkTransforms.png
[5]: ./media/app-service-logic-create-EAI-logic-app-using-VETR/AzureServiceBus.png