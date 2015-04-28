<properties 
	pageTitle="Integrate with an on-premises SAP server in Microsoft Azure App Service"
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
	ms.date="03/22/2015"
	ms.author="harish"/>


# Integrate with an on-premises SAP server
Using the SAP connector, you can connect Azure App Services web, mobile, and logic apps to your existing SAP server. You can invoke RFCs, BAPIs, tRFCs as well as send IDOCs to the SAP server.
	
The SAP server can even be behind your firewall on-premises. In case of on-premises server, connectivity is established through a hybrid listener, as shown:

![Hybrid connectivity flow][1]

An SAP Connector in the cloud cannot directly connect to an SAP server behind a firewall. The Hybrid listener bridges the gap by hosting a relay endpoint that allows the connector to securely establish connectivity to the SAP server.


## Different ways to integrate with SAP
The following actions are supported:

- Call RFC
- Call TRFC
- Call BAPI
- Send IDoc

## Prerequisites
The SAP specific client libraries are required on the client machine where the hybrid listener is installed and running. The precise details are captured [here][9] under the section titled **For the SAP adapter**.


## Create a new SAP adapter
1. Sign in to the Microsoft Azure Management portal. 
2. Select **New**.
3. In the create blade, select **Compute** > **Azure Marketplace**.
4. In the marketplace blade, select **API Apps**, and search for SAP in the search bar:
	
	![SAP Connector API App][2]	
5. Select the **SAP Connector** published by Microsoft.
6. In the SAP connector blade, select **Create**.
7. In the new blade that opens, enter the following:
	1. **Location** - Choose the geographic location where you would like the connector to deploy
	2. **Subscription** - Choose a subscription you want this connector to be created in
	3. **Resource group** - Select or create a resource group where the connector should reside
	4. **Web hosting plan** - Select or create a web hosting plan
	5. **Pricing tier** - Choose a pricing tier for the connector
	6. **Name** - Enter a name for your SAP Connector
	7. **Package settings**
		- **Server name** - Enter the SAP Server name. Example: "SAPserver" or "SAPserver.mydomain.com".
		- **User name** - Enter a valid user name to connect to the SAP server.
		- **Password** - Enter a valid password to connect to the SAP server.
		- **System number** - Enter the system number of the SAP Application server.
		- **Language** - Enter the logon language, like "EN". If no value is entered, "EN" is considered.
		- **On-premises** - Enter whether your SAP server is on-premises behind a firewall or not. If set to TRUE, you need to install a listener agent on a server that can access your SAP server. You can go to your API App summary page and select 'Hybrid Connection' to install the agent.
		- **Service bus connection string** - Enter this parameter if your SAP Server is on-premises. This should be a valid Service Bus Namespace connection string.
		- **RFCs** - Enter the RFCs in SAP that are allowed to be called by the connector.
		- **TRFCs** - Enter the TRFCs in SAP that are allowed to be called by the connector.
		- **BAPI** - Enter the BAPIs in SAP that are allowed to be called by the connector.
		- **IDOCs** - Enter the IDOCs in SAP that can be sent by the connector.
	8. Select Select. Within a few minutes, your SAP connector is created.


## Install the hybrid listener
Browse to the SAP connector you created through **Browse** > **API Apps** > *name of your connector*

In the connector blade, notice that the Hybrid connection status is pending. Select Hybrid Connection. The Hybrid Connection blade opens:

![Hybrid connection blade][3]

Copy the primary gateway configuration string. You use it later as part of the hybrid listener installation setup.

Select **Download and configure** link, and run the click once installer:

![Hybrid connection click once installer][4]

Select **install**, and then enter the gateway configuration setting you copied earlier:

![Relay listen connection string][5]

Select **Install** to complete the Hybrid connection manager setup:

![Hybrid connection manager installation in progress][6]

![Hybrid connection manager installation completed][7]

## Validate hybrid connection
Browse to the SAP connector you created through **Browse** > **API Apps** > *name of your connector*

In the connector blade, notice that the Hybrid connection status is *Connected*:

![Hybrid connection status - connected][8]


## Using the SAP connector in Logic Apps
Once the SAP connector is created, it can be used inside your Logic Apps workflow.

Create a new Logic App through **New** > **Logic Apps** > **Create**. Enter the metadata for the Logic App including resource group.

Select T**riggers and actions**. The Logic Apps workflow designer opens.

Select the SAP connector from the right pane, and select an action from the Actions tab. 

> [AZURE.NOTE] The list of actions are based on the configuration you entered when you created the SAP connector. 

For the selected action, you see the input and output parameters. You can enter in the inputs for the action and use the output of the current action in other API Apps, possibly for further decision making in the workflow.

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



