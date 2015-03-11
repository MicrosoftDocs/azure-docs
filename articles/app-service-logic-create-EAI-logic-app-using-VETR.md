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


Most EAI (Enterprise Application Integration) scenarios involve mediating data between a source and a destination. There is a common set of requirements in such scenarios:

•	Ensure the data obtained from the different systems are in the correct format

•	Preform a “look up” on some aspect of the incoming data to make decisions

•	Convert data from one format to another (for example, CRM systems might store the data in one format, and an ERP system might store the same data in some other format)

•	Route the data to the desired application or system

In this article, we will take a look at one of the most common integration patterns - one way message mediation or VETR (Validate, Enrich, Transform, Route).

The VETR pattern mediates data between a source entity and a destination entity. Usually the source and destination are data sources. Let’s take an example:

Consider a website that accepts orders; users post orders in the website (HTTP) and behind the scene the orders will be queued for further processing (e.g. Service Bus queue). The order processing system which takes the orders from the queue expects data in a specific format. The incoming data from the website needs to be validated for correctness and then normalized before it is persisted in the queue for further processing. Thus, the end-to-end data flow looks like the one depicted below 

HTTP -> Validate -> Transform -> Service Bus


![Basic VETR flow][1]

There are a number of BizTalk API Apps that help in building this pattern:

*HTTP Trigger* - Source which triggers the message event

*Validate* - Validate the correctness the incoming data

*Transform* - Transform the data from the incoming format to a format required by the downstream system

*Service Bus Connector* - Destination entity where the data is being sent to


###Constructing a basic VETR pattern
####The Basics
First, go to the azure portal and sign-in to your subscription. 
Once you’ve signed in, click on the +New button at the bottom-left of the screen and choose Logic App. 
When you click on Logic App, you’ll have to fill out some basic settings to get started:

1.	Name your Logic App something you’ll remember
2.	Choose the App Service Plan that you’ll use to pay for your flow. Note: you can get started with a Free App Service Plan
3.	Choose the Resource group for your App – resource groups act as containers for your apps – all of the resources for your app will go to the same resource group.
4.	Choose which Azure subscription you’d like to use.
5.	Choose a location 
Once you’ve filled out the basic settings for your flow you can add Triggers and Actions click there to get started.

####Adding a HTTP Trigger

1.	Select HTTP listener from list displayed on the right side and create a new instance called HTTP1. 
2.	Leave the “Send response automatically?” setting as false, and click the check icon to create the API app.
3.	Once the API app is created, select the trigger action. Provide the following inputs to configure the trigger:
a.	Set “HTTP Method” to POST
b.	Set “Relative URL” to /OneWayPipeline
Now, let’s specify the actions that would run whenever this trigger fires (that is, whenever a call is received on the HTTP endpoint you’ve configured).

![HTTP Trigger][2]

####Adding a Validate action

1.	Similar to how you created an instance of the HTTP Listener API app, select the BizTalk XML Validator API app from the gallery on the right hand side and provide it a name (Validate1) to create an instance.
2.	Once the instance is created, the portal will present the interface for managing the validate API app. Configure an XSD schema to validate the incoming XML messages.
3.	Select the Validate action.
4.	Select triggers(‘httplistener’).outputs.Content   as the value for the inputXml parameter.

Once you complete the configuration of the API, the validate action would be positioned as the first action after the HTTP listener. We can now similarly add the rest of the actions.

![BizTalk XML Validator][3]

####Adding a Transform action
Configure BizTalk Transforms and upload the transform which normalizes the incoming data.

1.	Add the Transform API app and create an instance similar to how the Validate API app is created.
2.	Once the instance is created, the portal will present the interface for managing the transform API app. Configure a TRFM to transform the incoming XML messages.
3.	Select the “Transform” action as the action to execute when this API app is called.
4.	Select triggers(‘httplistener’).outputs.Content as the value for the inputXml parameter.
5.	The Map is an optional parameter. By default, the Transform service would attempt to match the incoming data with all the configured transforms and apply one that matches the schema.
6.	Lastly, the Transform action needs to run only if Validate actually succeeded. To configure this condition, select the gear icon on the top right of the card and select the option to “Add a condition to be met”. Set the condition to: equals(actions('xmlvalidator').status,'Succeeded')


![BizTalk Transforms][4]

####Adding a Service Bus connector
Now we can add the destination to write the data to, which is a Service Bus Queue.

1.	Add the service bus connector from the gallery. Provide the following inputs to configure the API app:
   a. Name: Servicebus1
   b. Connection String: {The connection string to your service bus instance.}
   c. Entity Name: Queue
   d. Subscription name – skip this configuration. It is required only if the Entity you are working with is a Topic.

2.	Select the Send Message action.
3.	Set the Message field for the action by selecting the actions('transformservice').outputs.OutputXml from the list of available inputs.

![Service Bus][5]

####Sending an HTTP response
Once the pipeline processing is done, we need to send a response on the HTTP channel for both success and error cases. For this, carry out the following steps:

1.	Select the HTTP Listener from the “Recently used” section in the right hand side gallery.
2.	Select the Send Http Response action.
3.	Type the Response Content as “Pipeline processing completed”
4.	Set the Response Status Code to “200” to indicate HTTP 200 OK.
5.	Set the condition to the expression: @equals(actions('servicebusconnector').status,'Succeeded')
	
Repeat the above steps to send an HTTP response on failure as well. Change the condition to: @not(equals(actions('servicebusconnector').status,'Succeeded')).


###And you are done!
Every time someone sends a message at HTTP end-point, it would trigger the App and go through the flow to execute actions we just created. 
To manage the App we just created, click on Browse at the left side of the screen and select Logic Apps. You’ll see the App that you created. Click on it. And you can see all the details of that App including historical runs.


<!--image references -->
[1]: ./media/app-service-logic-create-EAI-logic-app-using-VETR/BasicVETR.PNG
[2]: ./media/app-service-logic-create-EAI-logic-app-using-VETR/HTTPListener.PNG
[3]: ./media/app-service-logic-create-EAI-logic-app-using-VETR/BizTalkXMLValidator.PNG
[4]: ./media/app-service-logic-create-EAI-logic-app-using-VETR/BizTalkTransforms.PNG
[5]: ./media/app-service-logic-create-EAI-logic-app-using-VETR/AzureServiceBus.PNG

