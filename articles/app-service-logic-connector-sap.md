<properties 
   pageTitle="SAP Connector" 
   description="How to use the SAPConnector" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="harishkragarwal" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="03/20/2015"
   ms.author="hariag"/>


# SAP Connector #

Connectors can be used in Logic apps to fetch, process or push data as a part of a flow. 
There are scenarios where you may need to work with SAP which is installed on-premise and behind the firewall. By leveraging the SAP Connector in your flow you can achieve a variety of scenarios. A few examples:  

1.	Expose a section of the data residing in your SAP via a web or mobile user front end.
2.	Publish data to your SAP after due processing
3.	Extract data from SAP for use in a business process

For these scenarios, the following needs to be done: 

1. Create an instance of the SAP Connector API App
2. Establish hybrid connectivity for the API App to communicate with the on-premise SAP
3. Use the created API App in a logic app to achieve the desired business process

## Create an instance of the SAP Connector API App ##

To use the SAP Connector, you need to create an instance of the 'SAP Connector' API App. The can be done as follows:

1. Open the Azure Marketplace using the '+ NEW' option at the bottom left of the Azure Portal
2. Browse to “Web and Mobile > API apps” and search for “SAP Connector”
3. Configure it as follows:
	1. Provide the generic details such as Name, App service plan, and so on in the first blade
	2. As part of Package settings provide the SAP Credentials. Also provide an Azure Servce Bus connection string. This will be used to establish hybrid connectivity with your on-premise SAP. 
	3. RFCs, TRFCs, BAPIs and IDOCs need to be configured based on the scenario need. If multiple values need to be provided then they can be separated by commas

![][1]  

## Configure the just created SAP Connector API App ##

Browse to the just created API App via Browse -> API Apps -> <Name of the API App just created> and you will see the following behavior. The setup is incomplete as the hybrid connection is not yet established.

![][2] 

To establish hybrid connectivity do the following:

1. Copy the primary connection string
2. Click on the 'Download and Configure' link
3. Follow the install process which gets initiated and provide the primary connection string when asked for
4. Once the setup process is complete then a dialog similar to this would show up

![][3] 

Now when you browse to the created API App again then you will observe the hybrid connection status as Connected. 

![][4] 

Note: in case you wish to switch to the secondary connection string then just re-do the hybrid setup and provide the secondary connection string in place of the primary connection string  

## Usage in a Logic App ##

SAP Connector can be used as an action/step only in a logic app. 

When creating/editing a logic app, choose the SAP Connector API App created above. This will list all the permissible actions once can choose from. 

![][5] 

Upon selection of an action, it will list the input parameters for that action. Provide the appropriate values and click on the Tick icon.  

![][6] 

The step/action will now appear as configured in the logic app. The output(s) of the operation will be shown and can be used inputs in a subsequent step. 

![][7] 

Complete the logic app to define the business process and then execute it to achieve the desired purpose.  

<!--Image references-->
[1]: ./media/app-service-logic-connector-sap/Create.jpg
[2]: ./media/app-service-logic-connector-sap/BrowseSetupIncomplete.jpg
[3]: ./media/app-service-logic-connector-sap/HybridSetup.jpg
[4]: ./media/app-service-logic-connector-sap/BrowseSetupComplete.jpg
[5]: ./media/app-service-logic-connector-sap/LogicApp1.jpg
[6]: ./media/app-service-logic-connector-sap/LogicApp2.jpg
[7]: ./media/app-service-logic-connector-sap/LogicApp3.jpg


