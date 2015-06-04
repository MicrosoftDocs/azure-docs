<properties 
	pageTitle="Using the Hybrid Connection Manager for Azure App Service" 
	description="Install and configure the Hybrid Connection Manager in Azure App Service; microservices architecture" 
	services="app-service\logic" 
	documentationCenter=".net,nodejs,java"
	authors="MandiOhlinger" 
	manager="dwrede" 
	editor="cgronlun"/>

<tags 
	ms.service="app-service-logic" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/03/2015" 
	ms.author="mandia"/>

# Using the Hybrid Connection Manager in Azure App Service
Some Connectors can connect to an on-premises system, like SQL Server, SAP, SharePoint, and so on. To use an on-premises system, Azure App Service uses the Hybrid Connection Manager. 

The Hybrid Connection Manager (HCM) is a click-once installer that is installed on an IIS server within your network, behind your firewall. Using an Azure Service Bus relay, HCM authenticates the on-premises system with the Connector in Azure. 

> [AZURE.NOTE] Hybrid Connection Manager is required only if you are connecting to an on-premises resource behind your firewall. If you are not connecting to an on-premises system, then you don't need the Hybrid Connection Manager.

To get started, you need:

- Azure Service Bus namespace ACS connection string
- On-premises system sign-in information, including user name and password. For example, if you're connecting to an on-premises SQL Server, you need the SQL Server login account and password.
- On-premises server information, including port number and server name. For example, if you're connecting to an on-premises SQL Server, you need the SQL Server name and TCP port number.

## Get the Service Bus Connection String

In the Azure portal, copy the Service Bus Access Control (ACS) Connection String. This connection string connects your Azure connector to your on-premises system. 

1. In the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=213885), select your Service Bus namespace, and select **Connection Information**:

	![][SB_ConnectInfo]

2. Copy the ACS Connection String:

	![][SB_ACS]

## Install the Hybrid Connection Manager

1. In the preview [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040), select the connector you created. To open it, you can select **Browse**, select **API Apps**, and then select your connector or API App. 
<br/><br/>
In **Hybrid Connection**, the setup is **incomplete**:
<br/>
![][2] 

2. Select **Hybrid Connection**. The Service Bus connection string you previously entered is listed.
3. Copy the **Primary Configuration String**:
<br/>
![][PrimaryConfigString]

4. Under **On-Premises Hybrid Connection Manager**, you can download the Hybrid Connection Manger or install it directly from the portal. 
<br/><br/>
To install directly from the portal, go to your on-premises IIS server, browse to the portal, and select **Download and Configure**.
<br/><br/>
To download the Hybrid Connection Manager, go to your on-premises IIS server, and go to the **ClickOnce application** (http://hybridclickonce.azurewebsites.net/install/Microsoft.Azure.BizTalk.Hybrid.ClickOnce.application). You can then copy the file to your IIS server and run it.

5. In the **Listener Setup** window, enter the **Primary Configuration String** you previously pasted (in step 3) and select **Install**.

When the setup is complete, the following displays:
<br/>
![][3] 

Now when you browse to the connector again, the hybrid connection status is Connected. You may have to close the connector and reopen it: 
<br/>
![][4] 

> [AZURE.NOTE] To switch to the secondary connection string, re-run the Hybrid Connection setup and enter the **Secondary Configuration String**.


## TCP Ports and Security

When you create a hybrid connection, a website is created on your local on-premises IIS server. The IIS server can be in a DMZ. The TCP port requirements on the IIS server include:

- No incoming TCP ports are required.
- Allow outbound TCP communication on TCP ports 9350 - 9354. These ports are used to connect to the Service Bus relay.
- Allow outbound HTTPS connections to TCP port 443. This port is used for hybrid outgoing messages. 

On the on-premises system, open the port used by the system. For example, SQL Server typically uses port 1433. Open this TCP port.

## Troubleshooting

![][HCMFlow]

### On-premises troubleshooting

1. On the IIS server, confirm the IIS web role is installed and all the IIS services are started.
2. On the IIS server, confirm the Hybrid Connection Manager is installed and running:
 - In IIS Manager (inetmgr), the ***MicrosoftAzureBizTalkHybridListener*** website should be listed and be running. 
 - This website uses the ***HybridListenerAppPool*** that runs as the *NetworkService* local built-in user account. This AppPool should also be started.
3. On the IIS server, confirm the connector is installed and running: 
 - A website is created for your App Service connector. For example, if you created a SQL connector, there is a ***MicrosoftSqlConnector_nnn*** website. In IIS Manager (inetmgr), confirm this website is listed and started. 
 - This website uses its own IIS application pool named ***HybridAppPoolnnn***. This AppPool runs as the *NetworkService* local built-in user account. This website and AppPool should both be started. 
 - Browse the local connector. For example, if your connector website uses port 6569, browse to http://localhost:6569. A default document is not configured so an `HTTP Error 403.14 - Forbidden error` is expected.
4. In your firewall, confirm the TCP Ports listed in this topic are open.
5. Look at the source or destination system:
 - Some on-premises systems require additional installation files. For example, if you're connecting to on-premises SAP, some additional SAP files must be installed on the IIS server.
 - Check connectivity to the system with the login account. For example, the TCP port used by the system must be open, like port 1433 for SQL Server. The login account you entered in the Azure portal must have access to the system.
6. On the IIS server, check the event logs for any errors. 
7. Cleanup and reinstall the Hybrid Connection Manager: 
 - In IIS, manually delete the connector website and its application pool. 
 - Rerun the Hybrid Connection Manager and confirm you're entering the correct **Primary Configuration String** for your connector.



### In the Azure portal

1. Confirm the Service Bus namespace has an **Active** state.
2. When you create the connector, enter the Service Bus ACS connection string. Do not enter the SAS connection string.


## Read More

[Monitor your Connectors and API Apps](app-service-logic-monitor-your-connectors.md)<br/>
[Monitor your Logic Apps](app-service-logic-monitor-your-logic-apps.md)


[SB_ConnectInfo]: ./media/app-service-logic-hybrid-connection-manager/SB_ConnectInfo.png
[SB_ACS]: ./media/app-service-logic-hybrid-connection-manager/SB_ACS.png
[PrimaryConfigString]: ./media/app-service-logic-hybrid-connection-manager/PrimaryConfigString.png
[HCMFlow]: ./media/app-service-logic-hybrid-connection-manager/HCMFlow.png
[2]: ./media/app-service-logic-hybrid-connection-manager/BrowseSetupIncomplete.jpg
[3]: ./media/app-service-logic-hybrid-connection-manager/HybridSetup.jpg
[4]: ./media/app-service-logic-hybrid-connection-manager/BrowseSetupComplete.jpg

