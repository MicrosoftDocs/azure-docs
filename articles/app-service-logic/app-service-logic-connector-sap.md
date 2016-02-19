<properties
   pageTitle="Using the SAP Connector in Logic Apps | Microsoft Azure App Service"
   description="How to create and configure the SAP Connector or API app and use it in a logic app in Azure App Service"
   services="app-service\logic"
   documentationCenter=".net,nodejs,java"
   authors="harishkragarwal"
   manager="erikre"
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="02/18/2016"
   ms.author="sameerch"/>


# Get started with the SAP Connector and add it to your Logic App
>[AZURE.NOTE] This version of the article applies to logic apps 2014-12-01-preview schema version.

Connect to on-premises SAP to call RFC or get metadata. There are scenarios where you may need to work with SAP, which is installed on-premises and behind the firewall. By leveraging the SAP Connector in your flow, you can achieve a variety of scenarios. A few examples:  

1.	Expose a section of the data residing in your SAP via a web or mobile user front end.
2.	Publish data to your SAP after due processing
3.	Extract data from SAP for use in a business process

Connectors can be used in Logic apps to fetch, process or push data as a part of a flow. You can add the SAP Connector to your business workflow and process data as part of this workflow within a Logic App. 


For these scenarios, the following needs to be done:

1. Create an instance of the SAP Connector API App
2. Establish hybrid connectivity for the API App to communicate with the on-premises SAP
3. Use the created API App in a logic app to achieve the desired business process


## Create an instance of the SAP Connector API App ##

A connector can be created within a logic app or be created directly from the Azure Marketplace. To create a connector from the Marketplace:  

1. In the Azure startboard, select **Marketplace**.
2. Search for “SAP Connector”, select it, and select **Create**.
3. Configure it as follows:
	1. Provide the generic details such as Name, App service plan, and so on in the first blade

	2. As part of Package settings provide the SAP Credentials. Also provide an Azure Service Bus connection string. This is used to establish hybrid connectivity with your on-premises SAP. 

	3. RFCs, TRFCs, BAPIs and IDOCs need to be configured based on the scenario need. If multiple values need to be provided then they can be separated by commas

![][1]  

## Configure the just created SAP Connector API App ##

Browse to the just created API App via Browse -> API Apps -> <Name of the API App just created> and you see the following behavior. The setup is incomplete as the hybrid connection is not yet established:  
![][2]

The SAP Connector does require hybrid connectivity to connect to *any* SAP endpoint.  To establish hybrid connectivity, do the following:

1. Copy the primary connection string
2. Click on the 'Download and Configure' link
3. Follow the install process which gets initiated and provide the primary connection string when asked for
4. Once the setup process is complete, then a dialog similar to the following is displayed:   
![][3]

More on [integrating with an on-premises SAP server](app-service-logic-integrate-with-an-on-premise-sap-server.md). 

Now when you browse to the created API App again then you will observe the hybrid connection status as Connected:  
![][4]

Note: in case you wish to switch to the secondary connection string then just re-do the hybrid setup and provide the secondary connection string in place of the primary connection string  

## Usage in a Logic App ##

SAP Connector can be used as an action/step only in a logic app.

When creating/editing a logic app, choose the SAP Connector API App created above. This lists all the permissible actions once can choose from:  
![][5]

Upon selection of an action, it lists the input parameters for that action. Provide the appropriate values and click on the Tick icon:  
![][6]

The step/action now appears as configured in the logic app. The output(s) of the operation will be shown and can be used inputs in a subsequent step:  
![][7]

Complete the logic app to define the business process and then execute it to achieve the desired purpose.  

## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).

<!--Image references-->
[1]: ./media/app-service-logic-connector-sap/Create.jpg
[2]: ./media/app-service-logic-connector-sap/BrowseSetupIncomplete.jpg
[3]: ./media/app-service-logic-connector-sap/HybridSetup.jpg
[4]: ./media/app-service-logic-connector-sap/BrowseSetupComplete.jpg
[5]: ./media/app-service-logic-connector-sap/LogicApp1.jpg
[6]: ./media/app-service-logic-connector-sap/LogicApp2.jpg
[7]: ./media/app-service-logic-connector-sap/LogicApp3.jpg
