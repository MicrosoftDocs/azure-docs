<properties
   pageTitle="Using the HTTP Listener and Connector in Logic Apps | Microsoft Azure App Service "
   description="How to create and configure the HTTP listener and HTTP action Connector or API app and use it in a logic app in Azure App Service"
   services="app-service\logic"
   documentationCenter=".net,nodejs,java"
   authors="anuragdalmia"
   manager="erikre"
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="04/19/2016"
   ms.author="prkumar"/>


# Get started with the HTTP listener and HTTP action and add it to your Logic App

> [AZURE.NOTE] We are ending support for this connector because its functionality is now included by default as the **manual trigger** when you create new Logic apps.  We recommend that you upgrade all your Logic apps that are using this connector.  
> This version of the article applies to logic apps 2014-12-01-preview schema version.

Connect directly to HTTP resources to listen for HTTP requests and configure HTTP web requests. There are some scenarios where you may need to work with direct HTTP connections, including:

1.	To develop a logic App that supports a web or mobile user interactive front end.
2.	To get and process data from a web service that doesn’t have an out of box connector.
3.	To perform actions that are already exposed as a web service, but not available as an API app.

For these scenarios, there are two options:

1. **HTTP listener**: This connector acts as a trigger and listens for HTTP requests on a configured endpoint. When a call is received on the configured endpoint, it triggers a new instance of the flow and passes the data received in the request to the flow for processing. It can also be configured to automatically respond to the incoming request when the flow has started, or let you construct a response based on the flow execution and send a response to the caller.
2. **HTTP action**: This lets you configure a web request to any endpoint available on the internet, gets back a response, and makes it available for additional actions in the flow to consume.

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. You can add the HTTP connector to your business workflow and process data as part of this workflow within a Logic App. 

## Creating an HTTP listener for your Logic App
A connector can be created within a logic app or be created directly from the Azure Marketplace. To create a connector from the Marketplace:  

1. In the Azure startboard, select **Marketplace**.
2. Search for “HTTP”, select HTTP Listener, and select **Create**.
3.	Configure the HTTP listener as follows:  
![][1]

4.	When setting up the package settings, you’ll see the following option on whether the listener should respond automatically or require you to send an explicit response. Set this to **False** to send your own response:  
![][2]

5.	Click **OK** to create.
6.	Once the API app instance is created, open the settings to configure the security. The HTTP listener currently supports Basic Authentication. You can configure this using the Security option when you open the HTTP listener:  
![][3]
  
	**Known issue**  *The Security settings show "None" as the default value, however it is undefined. You must change the setting to Basic and back to None before saving it to ensure that the HTTP Listener is configured correctly.*

7. Lastly, set the security settings of the API App to Public (Anonymous) to allow external clients to access the end point. This setting is available under "All settings > Application Settings" of the HTTP Listener API App:
![][10]

Once that’s done, you can now create a logic app to use the HTTP listener.

## Using the HTTP listener in your Logic App
Once your API app is created, you can now use the HTTP listener as a trigger for your Logic App. To do this, you need to:

4.	Create a new Logic App.
5.	Open “Triggers and Actions” to open the Logic Apps Designer and configure your flow. The HTTP Listener is listed in the gallery. Select it.
6.	You can now set the HTTP Method and the relative URL on which you require the listener to trigger the flow:  
![][4]  
![][5]

7.	To get the complete URI, double click the HTTP Listener to view its configuration settings and copy the URL for the "Host" of your API app:  
![][6]
8.	You can now use the data received in the HTTP Request in other actions in the flow as follows:  
![][7]  
![][8]
9.	Lastly, to send a response, add another HTTP Listener and select the Send HTTP Response action. Set the Request ID to the RequestID obtained from the HTTP Listener, and populate the response body and HTTP status you want to return back:  
![][9]

## Using the HTTP action
The HTTP action is natively supported by Logic Apps and doesn't require an API app to be created first to be able to use it. You can insert an HTTP action at any point in your Logic App and choose the URI, headers and body for the call.
The HTTP action supports multiple options for client side security. See the [client side security options](../scheduler/scheduler-outbound-authentication.md).

The output of the HTTP action is headers and body, which can be used further downstream in the flow similar to how output of other actions and connectors is consumed.

## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).

> [AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic). You can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

<!--Image references-->
[1]: ./media/app-service-logic-connector-http/1.png
[2]: ./media/app-service-logic-connector-http/2.png
[3]: ./media/app-service-logic-connector-http/3.png
[4]: ./media/app-service-logic-connector-http/4.png
[5]: ./media/app-service-logic-connector-http/5.png
[6]: ./media/app-service-logic-connector-http/6.png
[7]: ./media/app-service-logic-connector-http/7.png
[8]: ./media/app-service-logic-connector-http/8.png
[9]: ./media/app-service-logic-connector-http/9.png
[10]: ./media/app-service-logic-connector-http/10.png
