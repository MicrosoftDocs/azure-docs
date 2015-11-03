<properties
   pageTitle="Create EAI Logic App using VETR | Microsoft Azure"
   description="Validate, Encode and Transform features of BizTalk XML services"
   services="app-service\logic"
   documentationCenter=".net,nodejs,java"
   authors="rajeshramabathiran"
   manager="dwrede"
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="09/29/2015"
   ms.author="rajram"/>


# Create EAI Logic App Using VETR

Most Enterprise Application Integration (EAI) scenarios mediate data between a source and a destination. Such scenarios often have a common set of requirements:

- Ensure that data from different systems are correctly formatted
- Perform “look-up” on incoming data to make decisions
- Convert data from one format to another (for example, from a CRM system's data format to an ERP system's data format)
- Route data to desired application or system

This article shows you a common integration pattern: "one-way message mediation" or VETR (Validate, Enrich, Transform, Route). The VETR pattern mediates data between a source entity and a destination entity. Usually the source and destination are data sources.

Consider a website that accepts orders. Users post orders to the system using HTTP. Behind the scenes, the system validates the incoming data for correctness, normalizes it, and persists it in a Service Bus queue for further processing. The system takes orders off the queue, expecting it in a particular format. Thus, the end-to-end flow is:

**HTTP** > **Validate** > **Transform** > **Service Bus**

![Basic VETR Flow][1]

The following BizTalk API Apps help build this pattern:

* **HTTP Trigger** - Source to trigger message event
* **Validate** - Validates correctness of incoming data
* **Transform** - Transforms data from incoming format to format required by downstream system
* **Service Bus Connector** - Destination entity where data is sent


## Constructing basic VETR pattern
### The basics

In the Azure Management Portal, click the **+New** button at the bottom-left of the screen and click **Logic App**. Choose a name, location, subscription, resource group, and location that works. Resource groups act as containers for your apps and all of the resources for your app go to the same resource group.

Next, let's add triggers and actions.


## Add HTTP Trigger

1. Select **HTTP Listener** from the gallery to create a new listener. Call it **HTTP1**.
2. Leave **Send response automatically?** setting as false. Configure the trigger action by setting _HTTP Method_ to _POST_ and setting _Relative URL_ to _/OneWayPipeline_:  

	![HTTP Trigger][2]


## Add Validate Action

Now, let’s enter actions that run whenever the trigger fires--that is, whenever a call is received on the HTTP endpoint.

1. Add **BizTalk XML Validator** from the gallery and name it _(Validate1)_ to create an instance.
2. Configure an XSD schema to validate the incoming XML messages. Select the _Validate_ action and select _triggers(‘httplistener’).outputs.Content_ as the value for the _inputXml_ parameter.

Now, the validate action is the first action after the HTTP listener: 

![BizTalk XML Validator][3]

Similarly, let's add the rest of the actions. 

## Add Transform action
Let's configure transforms to normalize the incoming data.

1. Add **Transform** from the gallery.
2. To configure a transform to transform the incoming XML messages, select the **Transform** action as the action to carry out when this API is called and select ```triggers(‘httplistener’).outputs.Content``` as the value for _inputXml_. *Map* is an optional parameter since the incoming data is matched with all configured transforms, and only those that match the schema are applied.
3. Lastly, the Transform runs only if Validate succeeds. To configure this condition, click the gear icon on the top right and select _Add a condition to be met_. Set the condition to ```equals(actions('xmlvalidator').status,'Succeeded')```:  

![BizTalk Transforms][4]


## Add Service Bus Connector
Next, let's add the destination--a Service Bus Queue--to write data to.

1. Add a **Service Bus Connector** from the gallery. Set the **Name** to _Servicebus1_, set **Connection String** to the connection string to your service bus instance, set **Entity Name** to _Queue_, and skip **Subscription name**.
2. Select the **Send Message** action and set the **Message** field for the action to _actions('transformservice').outputs.OutputXml_.

![Service Bus][5]


## Send HTTP Response
Once pipeline processing is done, send back an HTTP response for both success and failure with the following steps:

1. Add an **HTTP Listener** from the gallery and select the **Send HTTP Response** action.
2. Set **Response Content** to *Pipeline processing completed*, **Response Status Code** to *200* to indicate HTTP 200 OK, and **Condition** to the following expression:  
	```@equals(actions('servicebusconnector').status,'Succeeded')```  <br/>


Repeat these steps to send an HTTP response on failure as well. Change **Condition** to  the following expression:  
```@not(equals(actions('servicebusconnector').status,'Succeeded'))``` <br/>


## Completion
Every time someone sends a message to the HTTP endpoint, it triggers the app and executes the actions you just created. To manage any such logic apps you create, click **Browse** in the Azure Portal and select **Logic Apps**. Select your app to see more information.

Some helpful topics:

[Manage and Monitor your API Apps and Connectors](app-service-logic-monitor-your-connectors.md)  <br/>
[Monitor your Logic Apps](app-service-logic-monitor-your-logic-apps.md)

<!--image references -->
[1]: ./media/app-service-logic-create-EAI-logic-app-using-VETR/BasicVETR.PNG
[2]: ./media/app-service-logic-create-EAI-logic-app-using-VETR/HTTPListener.PNG
[3]: ./media/app-service-logic-create-EAI-logic-app-using-VETR/BizTalkXMLValidator.PNG
[4]: ./media/app-service-logic-create-EAI-logic-app-using-VETR/BizTalkTransforms.PNG
[5]: ./media/app-service-logic-create-EAI-logic-app-using-VETR/AzureServiceBus.PNG
