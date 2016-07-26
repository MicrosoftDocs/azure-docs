<properties 
	pageTitle="Using the Hybrid Connection Manager | Microsoft Azure App Service" 
	description="Install and configure the Hybrid Connection Manager and connect to on-premises connectors in Azure App Service" 
	services="app-service\logic" 
	documentationCenter=".net,nodejs,java"
	authors="MandiOhlinger" 
	manager="dwrede" 
	editor="cgronlun"/>

<tags 
	ms.service="logic-apps" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/10/2016" 
	ms.author="mandia"/>

# Connect to on-premises connectors in Azure App Service using the Hybrid Connection Manager

>[AZURE.NOTE] This version of the article applies to logic apps 2014-12-01-preview schema version.

To use an on-premises system, Azure App Service uses the Hybrid Connection Manager. Some Connectors can connect to an on-premises system, like SQL Server, SAP, SharePoint, and so on. 

The Hybrid Connection Manager (HCM) is a click-once installer that is installed on an IIS server within your network, behind your firewall. Using an Azure Service Bus relay, HCM authenticates the on-premises system with the Connector in Azure. 

> [AZURE.NOTE] Hybrid Connection Manager is required only if you are connecting to an on-premises resource behind your firewall. If you are not connecting to an on-premises system, then you don't need the Hybrid Connection Manager.

To get started, you need:

- Azure Service Bus relay namespace SAS connection string. See [Service Bus Pricing](https://azure.microsoft.com/pricing/details/service-bus/) to determine which tier includes relays.
- On-premises system sign-in information, including user name and password. For example, if you're connecting to an on-premises SQL Server, you need the SQL Server login account and password.
- On-premises server information, including port number and server name. For example, if you're connecting to an on-premises SQL Server, you need the SQL Server name and TCP port number.

## Get the Service Bus Connection String

In the Azure portal, copy the Service Bus root SAS Connection String. This connection string connects your Azure connector to your on-premises system. 

1. In the [Azure classic portal](http://go.microsoft.com/fwlink/p/?LinkID=213885), select your Service Bus namespace, and select **Connection Information**:

	![][SB_ConnectInfo]

2. Copy the SAS Connection String:

	![][SB_SAS]

## Install the Hybrid Connection Manager

1. In the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040), select the connector you created. To open it, you can select **Browse**, select **API Apps**, and then select your connector or API App. 
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
To download the Hybrid Connection Manager, go to your on-premises IIS server, and go to the **ClickOnce application** (http://hybridclickonce.azurewebsites.net/install/Microsoft.Azure.BizTalk.Hybrid.ClickOnce.application). The installation starts automatically so you can run it.

5. In the **Listener Setup** window, enter the **Primary Configuration String** you previously pasted (in step 3) and select **Install**.

When the setup is complete, the following displays:
<br/>
![][3] 

Now when you browse to the connector again, the hybrid connection status is **Connected**. You may have to close the connector and reopen it: 
<br/>
![][4] 

> [AZURE.NOTE] To switch to the secondary connection string, re-run the Hybrid Connection setup and enter the **Secondary Configuration String**.


## TCP Ports and Security

When you create a hybrid connection, a website is created on your local on-premises IIS server. The IIS server can be in a DMZ. The TCP port requirements on the IIS server include:

TCP Port | Why
--- | ---
 | No incoming TCP ports are required.
9350 - 9354 | These ports are used for data transmission. The Service Bus relay manager probes port 9350 to determine if TCP connectivity is available. If it is available, then it assumes that port 9352 is also available. Data traffic goes over port 9352. <br/><br/>Allow outbound connections to these ports.
5671 | When port 9352 is used for data traffic, port 5671 is used as the the control channel. <br/><br/>Allow outbound connections to this port. 
80, 443 | If ports 9352 and 5671 are not usable, *then* ports 80 and 443 are the fallback ports used for data transmission and the control channel.<br/><br/>Allow outbound connections to these ports.
On-prem system port | On the on-premises system, open the port used by the system. For example, SQL Server typically uses port 1433. Open this TCP port.

[Hosting Behind a Firewall with Service Bus](http://msdn.microsoft.com/library/azure/ee706729.aspx)

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
 - Some on-premises systems require additional dependency files. For example, if you're connecting to on-premises SAP, some additional SAP files must be installed on the IIS server.
 - Check connectivity to the system with the login account. For example, the TCP port used by the system must be open, like port 1433 for SQL Server. The login account you entered in the Azure portal must have access to the system.
6. On the IIS server, check the event logs for any errors. 
7. Cleanup and reinstall the Hybrid Connection Manager: 
 - In IIS, manually delete the connector website and its application pool. 
 - Rerun the Hybrid Connection Manager and confirm you're entering the correct **Primary Configuration String** for your connector.



### In the Azure classic portal

1. Confirm the Service Bus namespace has an **Active** state.
2. When you create the connector, enter the Service Bus SAS connection string. Do not enter the ACS connection string.


## FAQ

**QUESTION**: There are two Hybrid Connection Managers. What's the difference? 

**Answer**: There’s the [Hybrid Connections](../biztalk-services/integration-hybrid-connection-overview.md) technology that is used primarily by Web  Apps (formerly websites) and Mobile Apps (formerly mobile services) to connect to on-premises. This Hybrid Connections Manager is its own [setup](../biztalk-services/integration-hybrid-connection-create-manage.md) and uses an Azure BizTalk Service (behind the scenes). It supports TCP and HTTP protocols only.

With Azure App Service connectors, we also have a Hybrid Connection Manager.  This Hybrid Connection Manager does *not* use an Azure BizTalk Service (behind the scenes) and supports more than the TCP and HTTP protocols. See the [Connectors and API Apps List](app-service-logic-connectors-list.md).

Both use Azure Service Bus to connect to the on-premises system.

**QUESTION**: When I create a custom API App, can I use the App Service Hybrid Connection Manager to connect to on-premises? 

**Answer**: Not in the traditional sense. You can use a built-in connector, configure the App Service Hybrid Connection Manager to connect to the on-premises system. Then, use this connector with your custom API App, possibly using a Logic App. Currently, you cannot develop or create your own hybrid API App (like the SQL connector or File connector).

If your custom API uses a TCP or HTTP port, you can use [Hybrid Connections](../biztalk-services/integration-hybrid-connection-overview.md) and its Hybrid Connection Manager. In this scenario, an Azure BizTalk Service is used. [Connect to on-premises SQL Server from a web app](../app-service-web/web-sites-hybrid-connection-connect-on-premises-sql-server.md) may help.  


## Read More

[Monitor your Logic Apps](app-service-logic-monitor-your-logic-apps.md)<br/>
[Service Bus Pricing](https://azure.microsoft.com/pricing/details/service-bus/)



[SB_ConnectInfo]: ./media/app-service-logic-hybrid-connection-manager/SB_ConnectInfo.png
[SB_SAS]: ./media/app-service-logic-hybrid-connection-manager/SB_SAS.png
[PrimaryConfigString]: ./media/app-service-logic-hybrid-connection-manager/PrimaryConfigString.png
[HCMFlow]: ./media/app-service-logic-hybrid-connection-manager/HCMFlow.png
[2]: ./media/app-service-logic-hybrid-connection-manager/BrowseSetupIncomplete.jpg
[3]: ./media/app-service-logic-hybrid-connection-manager/HybridSetup.jpg
[4]: ./media/app-service-logic-hybrid-connection-manager/BrowseSetupComplete.jpg

 
