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
	ms.author="hariag"/>

#Integrate with an on-premises SAP server

The SAP connector lets you connect Azure App Services web, mobile and logic apps to your existing SAP server. You can invoke RFCs, BAPIs, tRFCs as well as send IDOCs to the SAP server.
	
The SAP server can even be behind your firewall on-premises. When using an on-premises server, connectivity is established through a hybrid listener, as shown below.

![Hybrid connectivity flow][1]

An SAP Connector in the cloud cannot directly connect to an SAP server behind a firewall. The Hybrid listener bridges the gap by hosting a relay endpoint that allows the connector to securely establish connectivity to the SAP server.

##Different ways to integrate with SAP
The following actions are supported

- Call RFC
- Call TRFC
- Call BAPI
- Send IDoc

##Prerequisites
The SAP specific client libraries are required on the client machine where the hybrid listener is installed and running. For instructions on configuring SAP client libraries, see the *For the SAP adapter* section in [Installing Microsoft BizTalk Adapter Pack 2010][9].

###Getting started

##Create a new SAP adapter
1. Log in to the Azure portal.
2. Click **New**.
3. In the **Create** blade, click **Compute**, **Azure Marketplace**.
4. In the marketplace blade, click **API Apps** and search for **SAP** in the search bar.
	
	![SAP Connector API App][2]	
5. Click on the **SAP Connector** published by Microsoft.
6. In the **SAP Connector** blade, click **Create**.
7. In the **New API App**, provide the following data
	1. **Name** - specify a name for your SAP Connector.
	2. **App Service plan** - select or create an App Service plan.
	3. **Pricing tier** - choose a pricing tier for the connector.
	4. **Resource group** - select or create a resource group where the connector should reside.
	5. **Subscription** - choose a subscription you want this connector to be created in.
	6. **Location** - choose the geographic location where you would like the connector to be deployed. 
	7. **Package settings**
		- **Server name** - specify the SAP Server name. Example: "SAPserver" or "SAPserver.mydomain.com"
		- **User name** - specify a valid user name to connect to the SAP server.
		- **Password** - specify a valid password to connect to the SAP server.
		- **System number** - specify the system number of the SAP Application server.
		- **Language** - specify the logon language. Example: **EN**. If no value is specified, **EN** is the default.
		- **On-premises** - specify whether your SAP server is on-premises behind a firewall or not. If set to TRUE, you must install a listener agent on a server that can access your SAP server. You can go to your API App summary page and click on 'Hybrid Connection' to install the agent.
		- **Service bus connection string** - specify this parameter if your SAP Server is on-premises. This should be a valid Service Bus Namespace connection string.
		- **RFCs** - Specify the RFCs in SAP that are allowed to be called by the connector.
		- **TRFCs** - Specify the TRFCs in SAP that are allowed to be called by the connector.
		- **BAPI** - Specify the BAPIs in SAP that are allowed to be called by the connector.
		- **IDOCs** - Specify the IDOCs in SAP that can be sent by the connector.
	8. Click **Create**. Within a few minutes your SAP connector will be created.

##Install hybrid listener
Browse to the SAP connector you created by clicking **Browse**, **API Apps**, and selecting the desired SAP connector.

In the connector blade, notice that the Hybrid connection status is pending. Click the **Hybrid Connection** part to open the **Hybrid Connection** blade.

![Hybrid connection blade][3]

Copy the primary gateway configuration setting. You will use it later as part of the hybrid listener installation setup.

Click the **Download and configure** link, and run the click once installer.

![Hybrid connection click once installer][4]

Click **Install**, and then enter the gateway configuration setting you copied earlier.

![Relay listen connection string][5]

Click **Install**, and wait for the Hybrid connection manager setup to complete.

![Hybrid connection manager installation in progress][6]

![Hybrid connection manager installation completed][7]

##Validate the hybrid connection

Browse to the SAP connector you created by clicking **Browse**, **API Apps**, and selecting the desired SAP connector.

In the **Hybrid Connection** part, verify that the status is **Connected**.

![Hybrid connection status - connected][8]

##Using the SAP connector in a Logic App

Once the SAP connector has been created, it can be used inside your Logic App workflow.

To create a new Logic App, click **New**, **Logic App**, **Create**. Provide the metadata for the Logic App including the resource group.

Click **Triggers and Actions** to open the Logic App workflow designer in the **Create logic app** blade.

Click on b from the right pane, and select an action from the actions tab. Note that the list of actions are based on the configuration you provided at the time of the SAP connector creation. For the selected action, you will see the input and output parameters. You can key in the inputs for the action and use the output of the current action in other API apps used downstream for further decision making.

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



