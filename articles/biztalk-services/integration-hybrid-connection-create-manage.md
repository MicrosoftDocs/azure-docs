<properties 
	pageTitle="Create and Manage Hybrid Connections | Microsoft Azure" 
	description="Learn how to create a hybrid connection, manage the connection, and install the Hybrid Connection Manager. MABS, WABS" 
	services="biztalk-services" 
	documentationCenter="" 
	authors="MandiOhlinger" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="biztalk-services" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/16/2016" 
	ms.author="mandia"/>


# Create and Manage Hybrid Connections


## Overview of the Steps
1. Create a Hybrid Connection by entering the **host name** or **FQDN** of the on-premises resource in your private network.
2. Link your Azure web apps or Azure mobile apps to the Hybrid Connection.
3. Install the Hybrid Connection Manager on your on-premises resource and connect to the specific Hybrid Connection. The Azure portal provides a single-click experience to install and connect.
4. Manage Hybrid Connections and their connection keys.

This topic lists these steps. 

[AZURE.IMPORTANT] It is possible to set a Hybrid Connection endpoint to an IP address **but** if you do so, you may or may not be able to reach the on premises resource depending on your client. The Hybrid Connection feature depends on the client doing a DNS lookup (In most cases the __client__ is your application code). If the client does not perform a DNS lookup, so it does not try to resolve the IP address as if it were a domain name (x.x.x.x), then traffic will not be sent through the Hybrid Connection.
Example (pseudocode) -- Considering you define **10.4.5.6** as your on premises host: 
**This works:** `Application code -> GetHostByName("10.4.5.6") -> Resolves to 127.0.0.3 -> Connect("127.0.0.3") -> Hybrid Connection -> on-prem host` // 
**This doesn't work:** `Application code -> Connect("10.4.5.6") -> ?? -> No route to host`


## <a name="CreateHybridConnection"></a>Create a Hybrid Connection

A Hybrid Connection can be created in the Azure portal using Web Apps **or** using BizTalk Services. 

**To create Hybrid Connections using Web Apps**, see [Connect Azure Web Apps to an On-Premises Resource](../app-service-web/web-sites-hybrid-connection-get-started.md). You can also install the Hybrid Connection Manager (HCM) from your web app, which is the preferred method. 

**To create Hybrid Connections in BizTalk Services**:

1. Sign in to the [Azure classic portal](http://go.microsoft.com/fwlink/p/?LinkID=213885).
2. In the left navigation pane, select **BizTalk Services** and then select your BizTalk Service. 

	If you don't have an existing BizTalk Service, you can [Create a BizTalk Service](biztalk-provision-services.md).
3. Select the **Hybrid Connections** tab:  
![Hybrid Connections Tab][HybridConnectionTab]

4. Select **Create a Hybrid Connection** or select the **ADD** button in the task bar. Enter the following:

	Property | Description
--- | ---
Name | The Hybrid Connection name must be unique and cannot be the same name as the BizTalk Service. You can enter any name but be specific with its purpose. Examples include:<br/><br/>Payroll*SQLServer*<br/>SupplyList*SharepointServer*<br/>Customers*OracleServer*
Host Name | Enter the fully qualified host name or only the host name of the on-premises resource. Examples include:<br/><br/>mySQLServer<br/>*mySQLServer*.*Domain*.corp.*yourCompany*.com<br/>*myHTTPSharePointServer*<br/>*myHTTPSharePointServer*.*yourCompany*.com
Port | Enter the port number of the on-premises resource. For example, if you're using Web Apps, enter port 80 or port 443. If you're using SQL Server, enter port 1433.

5. Select the check mark to complete the setup. 

#### Additional

- Multiple Hybrid Connections can be created. See the [BizTalk Services: Editions Chart](biztalk-editions-feature-chart.md) for the number of connections allowed. 
- Each Hybrid Connection is created with a pair of connection strings: Application keys that SEND and On-premises keys that LISTEN. Each pair has a Primary and a Secondary key. 


## <a name="LinkWebSite"></a>Link your Azure Web Apps or Azure Mobile Apps

To link the Azure Web Apps to an existing Hybrid Connection, select **use an existing Hybrid Connection** in the Hybrid Connections blade. See [Connect Azure Web Apps to an On-Premises Resource](../app-service-web/web-sites-hybrid-connection-get-started.md).

To link the Azure Mobile Apps to an existing Hybrid Connection, select **add hybrid connection** when changing or creating a Mobile Service. See [Azure Mobile Services and Hybrid Connections](../mobile-services/mobile-services-dotnet-backend-hybrid-connections-get-started.md).


## <a name="InstallHCM"></a>Install the Hybrid Connection Manager on-premises

After a Hybrid Connection is created, install the Hybrid Connection Manager on the on-premises resource. It can be downloaded from your Azure web apps or from your BizTalk Service. BizTalk Services steps: 

1. Sign in to the [Azure classic portal](http://go.microsoft.com/fwlink/p/?LinkID=213885).
2. In the left navigation pane, select **BizTalk Services** and then select your BizTalk Service. 
3. Select the **Hybrid Connections** tab:  
![Hybrid Connections Tab][HybridConnectionTab]
4. In the task bar, select **On-Premises Setup**:  
![On-Premises Setup][HCOnPremSetup]
5. Select **Install and Configure** to run or download the Hybrid Connection Manager on the on-premises system. 
6. Select the check mark to start the installation. 

<!--
You can also download the Hybrid Connection Manager MSI file and copy the file to your on-premises resource. Specific steps:

1. Copy the on-premises primary Connection String. See [Manage Hybrid Connections](#ManageHybridConnection) in this topic for the specific steps.
2. Download the Hybrid Connection Manager MSI file. 
3. On the on-premises resource, install the Hybrid Connection Manager from the MSI file. 
4. Using Windows PowerShell, type: 
> Add-HybridConnection -ConnectionString “*Your On-Premises Connection String that you copied*” 
--> 

#### Additional
- Hybrid Connection Manager can be installed on the following operating systems:

	- Windows Server 2008 R2 (.NET Framework 4.5+ and Windows Management Framework 4.0+ required)
	- Windows Server 2012 (Windows Management Framework 4.0+ required)
	- Windows Server 2012 R2


- After you install the Hybrid Connection Manager, the following occurs: 

	- The Hybrid Connection hosted on Azure is automatically configured to use the Primary Application Connection String. 
	- The On-Premises resource is automatically configured to use the Primary On-Premises Connection String.

- The Hybrid Connection Manager must use a valid on-premises connection string for authorization. The Azure Web Apps or Mobile Apps must use a valid application connection string for authorization.
- You can scale Hybrid Connections by installing another instance of the Hybrid Connection Manager on another server. Configure the on-premises listener to use the same address as the first on-premises listener. In this situation, the traffic is randomly distributed (round robin) between the active on-premises listeners. 


## <a name="ManageHybridConnection"></a>Manage Hybrid Connections
To manage your Hybrid Connections, you can:

- Use the Azure portal and go to your BizTalk Service. 
- Use [REST APIs](http://msdn.microsoft.com/library/azure/dn232347.aspx).

#### Copy/regenerate the Hybrid Connection Strings

1. Sign in to the [Azure classic portal](http://go.microsoft.com/fwlink/p/?LinkID=213885).
2. In the left navigation pane, select **BizTalk Services** and then select your BizTalk Service. 
3. Select the **Hybrid Connections** tab:  
![Hybrid Connections Tab][HybridConnectionTab]
4. Select the Hybrid Connection. In the task bar, select **Manage Connection**:  
![Manage Options][HCManageConnection]

	**Manage Connection** lists the Application and On-Premises connection strings. You can copy the Connection Strings or regenerate the Access Key used in the connection string. 

	**If you select Regenerate**, the Shared Access Key used within the Connection String is changed. Do the following:
	- In the Azure classic portal, select **Sync Keys** in the Azure application.
	- Re-run the **On-Premises Setup**. When you re-run the On-Premises Setup, the on-premises resource is automatically configured to use the updated Primary connection string.


#### Use Group Policy to control the on-premises resources used by a Hybrid Connection

1. Download the [Hybrid Connection Manager Administrative Templates](http://www.microsoft.com/download/details.aspx?id=42963).
2. Extract the files.
3. On the computer that modifies group policy, do the following:  

	- Copy the .ADMX files to the *%WINROOT%\PolicyDefinitions* folder.
	- Copy the .ADML files to the *%WINROOT%\PolicyDefinitions\en-us* folder.

Once copied, you can use Group Policy Editor to change the policy.




## Next

[Connect Azure Web Apps to an On-Premises Resource](../app-service-web/web-sites-hybrid-connection-get-started.md)  
[Connect to on-premises SQL Server from Azure Web Apps](../app-service-web/web-sites-hybrid-connection-connect-on-premises-sql-server.md)  
[Azure Mobile Services and Hybrid Connections](../mobile-services/mobile-services-dotnet-backend-hybrid-connections-get-started.md)  
[Hybrid Connections Overview](integration-hybrid-connection-overview.md)


## See Also

[REST API for Managing BizTalk Services on Microsoft Azure](http://msdn.microsoft.com/library/azure/dn232347.aspx)  
[BizTalk Services: Editions Chart](biztalk-editions-feature-chart.md)  
[Create a BizTalk Service using Azure classic portal](biztalk-provision-services.md)  
[BizTalk Services: Dashboard, Monitor and Scale tabs](biztalk-dashboard-monitor-scale-tabs.md)


[HybridConnectionTab]: ./media/integration-hybrid-connection-create-manage/WABS_HybridConnectionTab.png
[HCOnPremSetup]: ./media/integration-hybrid-connection-create-manage/WABS_HybridConnectionOnPremSetup.png
[HCManageConnection]: ./media/integration-hybrid-connection-create-manage/WABS_HybridConnectionManageConn.png 
