<properties 
	pageTitle="Integrate with an on-premises SAP server"
	description="Learn how to integrate with an on-premises SAP server"
	authors="rajeshramabathiran" 
	manager="dwrede" 
	editor="" 
	services="app-service\logic" 
	documentationCenter=""/>

<tags
	ms.service="app-service-logic"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/05/2015"
	ms.author="harish"/>

#Integrate with an on-premises SAP server

The SAP connector lets you connect Azure App Services web, mobile and logic apps to your existing SAP server. You can invoke RFCs, BAPIs, tRFCs as well as send IDOCs to the SAP server.
	
The SAP server can even be behind your firewall on-premises. In case of on-premises server, connectivity is established through a hybrid listener, as shown below.

![Hybrid connectivity flow][1]

An SAP Connector in the cloud cannot directly connect to a SAP server behind a firewall. The Hybrid listener bridges the gap by hosting a relay endpoint that allows the connector to securely establish connectivity to the SAP server.

##Different ways to integrate with SAP
The following actions are supported

- Call RFC
- Call TRFC
- Call BAPI
- Send IDoc

##Prerequisites
The SAP specific client libraries are required on the client machine where hybrid listener is installed and running. The precise details are captured [here][9] under the section titled *For the SAP adapter*

###Getting started

##Create a new SAP adapter
1. Login to the Azure portal
2. Click on New.
3. In the create blade, click on Compute -> Azure Marketplace
4. In the marketplace blade, click on API Apps and search for SAP in the search bar
	
	![SAP Connector API App][2]	
5. Click on the SAP Connector published by Microsoft
6. In the SAP connector blade, click on create
7. In the new blade that shows up, provide the following data
	1. **Location** - choose the geographic location where you would like the connector to be deployed
	2. **Subscription** - choose a subscription you want this connector to be created in
	3. **Resource group** - select or create a resource group where the connector should reside
	4. **Web hosting plan** - select or create a web hosting plan
	5. **Pricing tier** - choose a pricing tier for the connector
	6. **Name** - give a name for your SAP Connector
	7. **Package settings**
		- **Server name** - specify the SAP Server name. Example: "SAPserver" or "SAPserver.mydomain.com"
		- **User name** - specify a valid user name to connect to the SAP server.
		- **Password** - specify a valid password to connect to the SAP server.
		- **System number** - specify the system number of the SAP Application server.
		- **Language** - specify the logon language. Example: "EN". If no value is specified, "EN" is considered.
		- **On-premises** - specify whether your SAP server is on-premises behind a firewall or not. If set to TRUE, you need to install a listener agent on a server that can access your SAP server. You can go to your API App summary page and click on 'Hybrid Connection' to install the agent.
		- **Service bus connection string** - specify this parameter if your SAP Server is on-premises. This should be a valid Service Bus Namespace connection string.
		- **RFCs** - Specify the RFCs in SAP that are allowed to be called by the connector.
		- **TRFCs** - Specify the TRFCs in SAP that are allowed to be called by the connector.
		- **BAPI** - Specify the BAPIs in SAP that are allowed to be called by the connector.
		- **IDOCs** - Specify the IDOCs in SAP that can be sent by the connector.
	8. Click on create. Within a few minutes your SAP connector would be created.

##Install hybrid listener
Browse to the SAP connector you created through Browse -> API Apps -> *name of your connector*

In the connector blade, notice that the Hybrid connection status is pending. Click on Hybrid connection part. Hybrid connection blade opens up.

![Hybrid connection blade][3]

Copy the primary gateway configuration setting. You will use it later as part of the hybrid listener installation setup.

Click on *Download and configure* link, and run the click once installer

![Hybrid connection click once installer][4]

Click on install, and then enter the gateway configuration setting you copied earlier.

![Relay listen connection string][5]

Click on install, and let the Hybrid connection manager setup progress and complete

![Hybrid connection manager installation in progress][6]

![Hybrid connection manager installation completed][7]

##Validate hybrid connection

Browse to the SAP connector you created through Browse -> API Apps -> *name of your connector*

In the connector blade, notice that the Hybrid connection status is *Connected*

![Hybrid connection status - connected][8]

##Using the SAP connector in a Logic App

Once the SAP connector has been created, it can be used inside your Logic App workflow.

Create a new Logic App through New -> Logic App -> Create. Provide the metadata for the Logic App including resource group

Click on *triggers and actions*. The Logic App workflow designer opens up.

Click on SAP connector from the right pane, and select an action from the actions tab. Note that the list of actions are based on the configuration you provided at the time of the SAP connector creation. For the selected action, you will see the input and output parameters. You can key in the inputs for the action and use the output of the current action in other API apps used downstream for further decision making.

<!--Image references-->
[1]: ./media/app-service-logic-integrate-with-an-on-premise-SAP-server/HybridConnectivityFlow.PNG	
[2]: ./media/app-service-logic-integrate-with-an-on-premise-SAP-server/SAPConnector.APIApp.PNG
[3]: ./media/app-service-logic-integrate-with-an-on-premise-SAP-server/HybridConnection.PNG
[4]: ./media/app-service-logic-integrate-with-an-on-premise-SAP-server/HybridConnection.ClickOnceInstaller.PNG
[5]: ./media/app-service-logic-integrate-with-an-on-premise-SAP-server/HybridConnection.ClickOnceInstaller.RelayInformation.PNG
[6]: ./media/app-service-logic-integrate-with-an-on-premise-SAP-server/HybridConnectionManager.Install.InProgress.PNG
[7]: ./media/app-service-logic-integrate-with-an-on-premise-SAP-server/HybridConnectionManager.Install.Completed.PNG
[8]: ./media/app-service-logic-integrate-with-an-on-premise-SAP-server/SAPConnector.HybridConnection.Connected.PNG
[9]: http://download.microsoft.com/download/2/D/7/2D7CE8DF-A6C5-45F0-8319-14C3F1F9A0C7/InstallationGuide.htm



