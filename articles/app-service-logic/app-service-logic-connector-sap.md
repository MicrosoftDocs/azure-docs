<properties
   pageTitle="Using the SAP connector in Logic apps | Microsoft Azure App Service"
   description="How to create and configure the SAP connector or API app and use it in a Logic app in Azure App Service"
   services="app-service\logic"
   documentationCenter=".net,nodejs,java"
   authors="harishkragarwal"
   manager="erikre"
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="05/31/2016"
   ms.author="sameerch"/>


# Get started with the SAP connector and add it to your Logic app

>[AZURE.NOTE] Based on customer feedback, we are upgrading this connector. We’ll update this page when it is ready. We do not recommend using the SAP connector before the new version is available. This version of the article applies to Logic apps 2014-12-01-preview schema version.

Connect to on-premises SAP to call RFC or get metadata. There are scenarios where you may need to work with SAP, which is installed on-premises and behind the firewall. By leveraging the SAP connector in your flow, you can achieve a variety of scenarios. A few examples:  

1.	Expose a section of the data residing in your SAP via a web or mobile user front end.
2.	Publish data to your SAP after due processing
3.	Extract data from SAP for use in a business process

connectors can be used in Logic apps to fetch, process or push data as a part of a flow. You can add the SAP connector to your business workflow and process data as part of this workflow within a Logic app. 


For these scenarios, the following needs to be done:

1. Create an instance of the SAP connector API App
2. Establish hybrid connectivity for the API App to communicate with the on-premises SAP
3. Use the created API App in a Logic app to achieve the desired business process


## Create an instance of the SAP connector API App ##

A connector can be created within a Logic app or be created directly from the Azure Marketplace. To create a connector from the Marketplace:  

1. In the Azure startboard, select **Marketplace**.
2. Search for “SAP connector”, select it, and select **Create**.
3. Configure it as follows:
	1. Provide the generic details such as Name, App service plan, and so on in the first blade

	2. As part of Package settings provide the SAP Credentials. Also provide an Azure Service Bus connection string. This is used to establish hybrid connectivity with your on-premises SAP. 

	3. RFCs, TRFCs, BAPIs and IDOCs need to be configured based on the scenario need. If multiple values need to be provided then they can be separated by commas

![][1]  

## Configure the just created SAP connector API App ##

Browse to the just created API App via Browse -> API Apps -> <Name of the API App just created> and you see the following behavior. The setup is incomplete as the hybrid connection is not yet established:  
![][2]

The SAP connector does require hybrid connectivity to connect to *any* SAP endpoint.  To establish hybrid connectivity, do the following:

1. Copy the primary connection string
2. Click on the 'Download and Configure' link
3. Follow the install process which gets initiated and provide the primary connection string when asked for
4. Once the setup process is complete, then a dialog similar to the following is displayed:   
![][3]

More on [integrating with an on-premises SAP server](app-service-logic-integrate-with-an-on-premise-sap-server.md). 

Now when you browse to the created API App again then you will observe the hybrid connection status as Connected:  
![][4]

Note: in case you wish to switch to the secondary connection string then just re-do the hybrid setup and provide the secondary connection string in place of the primary connection string  

## Usage in a Logic app ##

SAP connector can be used as an action/step only in a Logic app.

When creating/editing a Logic app, choose the SAP connector API App created above. This lists all the permissible actions once can choose from:  
![][5]

Upon selection of an action, it lists the input parameters for that action. Provide the appropriate values and click on the Tick icon:  
![][6]

The step/action now appears as configured in the Logic app. The output(s) of the operation will be shown and can be used inputs in a subsequent step:  
![][7]

Complete the Logic app to define the business process and then execute it to achieve the desired purpose.  

## Do more with your connector
Now that the connector is created, you can add it to a business workflow using a Logic app. See [What are Logic apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic apps before signing up for an Azure account, go to [Try Logic app](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter Logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and connectors](app-service-logic-monitor-your-connectors.md).

<!--Image references-->
[1]: ./media/app-service-logic-connector-sap/Create.jpg
[2]: ./media/app-service-logic-connector-sap/BrowseSetupIncomplete.jpg
[3]: ./media/app-service-logic-connector-sap/HybridSetup.jpg
[4]: ./media/app-service-logic-connector-sap/BrowseSetupComplete.jpg
[5]: ./media/app-service-logic-connector-sap/LogicApp1.jpg
[6]: ./media/app-service-logic-connector-sap/LogicApp2.jpg
[7]: ./media/app-service-logic-connector-sap/LogicApp3.jpg
