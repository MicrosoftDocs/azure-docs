<properties 
	pageTitle="Create and Manage Hybrid Connections | Azure" 
	description="Learn how to create a hybrid connection, manage the connection, and install the Hybrid Connection Manager. MABS, WABS" 
	services="biztalk-services" 
	documentationCenter="" 
	authors="MandiOhlinger" 
	manager="dwrede" 
	editor="cgronlun"/>

<tags 
	ms.service="biztalk-services" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/03/2015" 
	ms.author="mandia"/>


# Create and Manage Hybrid Connections


## Overview of the Steps
1. Create a Hybrid Connection by entering the host name or IP address of the on-premises resource in your private network.
2. Link your Azure website or Azure mobile service to the Hybrid Connection.
3. Install the Hybrid Connection Manager on your on-premises resource and connect to the specific Hybrid Connection. The Azure portal provides a single-click experience to install and connect.
4. Manage Hybrid Connections and their connection keys.

This topic lists these steps. 


## <a name="CreateHybridConnection"></a>Create a Hybrid Connection

A Hybrid Connection can be created in the Azure Management Portal using Websites **or** using BizTalk Services. 

**To create Hybrid Connections using Websites**, see [Connect an Azure Website to an On-Premises Resource](http://go.microsoft.com/fwlink/p/?LinkId=397538).

**To create Hybrid Connections in BizTalk Services**:

1. Sign in to the [Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=213885).
2. In the left navigation pane, select **BizTalk Services** and then select your BizTalk Service. 
<br/>If you don't have an existing BizTalk Service, you can [Create a BizTalk Service](http://go.microsoft.com/fwlink/p/?LinkID=329870).
3. Select the Hybrid Connections tab:
<br/>
![Hybrid Connections Tab][HybridConnectionTab]

4. Select **Create a Hybrid Connection** or select the **ADD** button in the task bar. Enter the following:

	<table border="1">
    <tr>
       <td><strong>Name</strong></td>
        <td>The Hybrid Connection name must be unique and cannot be the same name as the BizTalk Service. You can enter any name but be specific with its purpose. Examples include:<br/><br/>
		Payroll<em>SQLServer</em><br/>
		SupplyList<em>SharepointServer</em><br/>
		Customers<em>OracleServer</em>
        </td>
    </tr>
    <tr>
        <td><strong>Host Name</strong></td>
        <td>Enter the fully qualified host name, only the host name, or the IPv4 address of the on-premises resource. Examples include:
        <br/><br/>
<em>mySQLServer</em>
<br/>
<em>mySQLServer</em>.<em>Domain</em>.corp.<em>yourCompany</em>.com
<br/>
<em>myHTTPSharePointServer</em>
<br/>
<em>myHTTPSharePointServer</em>.<em>yourCompany</em>.com
<br/>
10.100.10.10
       </td>
    </tr>
	<tr>
        <td><strong>Port</strong></td>
        <td>Enter the port number of the on-premises resource. For example, if you're using a website, enter port 80 or port 443. If you're using SQL Server, enter port 1433.</td>
	</tr>
	</table>


5. Select the check mark to complete the setup. 

#### Additional

- Multiple Hybrid Connections can be created. See the [BizTalk Services: Editions Chart](http://go.microsoft.com/fwlink/p/?LinkID=302279) for the number of connections allowed. 
- Each Hybrid Connection is created with a pair of connection strings: Application keys that SEND and On-premises keys that LISTEN. Each pair has a Primary and a Secondary key. 


## <a name="LinkWebSite"></a>Link your Azure website or Azure mobile service

To link the Azure Website to an existing Hybrid Connection, select **use an existing Hybrid Connection** in the Hybrid Connections blade. See [Connect an Azure Website to an On-Premises Resource](http://go.microsoft.com/fwlink/p/?LinkId=397538).

To link the Azure Mobile Service to an existing Hybrid Connection, select **add hybrid connection** when changing or creating a Mobile Service. See [Azure Mobile Services and Hybrid Connections](mobile-services-dotnet-backend-hybrid-connections-get-started.md).


## <a name="InstallHCM"></a>Install the Hybrid Connection Manager on-premises

After a Hybrid Connection is created, install the Hybrid Connection Manager on the on-premises resource. It can be downloaded from your Azure Website or from your BizTalk Service. BizTalk Services steps: 

1. Sign in to the [Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=213885).
2. In the left navigation pane, select **BizTalk Services** and then select your BizTalk Service. 
3. Select the **Hybrid Connections** tab:
<br/>
![Hybrid Connections Tab][HybridConnectionTab]
4. In the task bar, select **On-Premises Setup**:
<br/>
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
- Hybrid Connections support on-premises resources installed on the following operating systems:

	- Windows Server 2008 R2
	- Windows Server 2012
	- Windows Server 2012 R2


- After you install the Hybrid Connection Manager, the following occurs: 

	- The Hybrid Connection hosted on Azure is automatically configured to use the Primary Application Connection String. 
	- The On-Premises resource is automatically configured to use the Primary On-Premises Connection String.

- The Hybrid Connection Manager must use a valid on-premises connection string for authorization. The Azure Website or  Mobile Service must use a valid application connection string for authorization.


## <a name="ManageHybridConnection"></a>Manage Hybrid Connections
To manage your Hybrid Connections, you can:

- Use the Azure portal and go to your BizTalk Service. 
- Use [REST APIs](http://msdn.microsoft.com/library/azure/dn232347.aspx).

#### Copy/regenerate the Hybrid Connection Strings

1. Sign in to the [Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=213885).
2. In the left navigation pane, select **BizTalk Services** and then select your BizTalk Service. 
3. Select the **Hybrid Connections** tab:
<br/>
![Hybrid Connections Tab][HybridConnectionTab]
4. Select the Hybrid Connection. In the task bar, select **Manage Connection**:
<br/>
![Manage Options][HCManageConnection]
<br/>
**Manage Connection** lists the Application and On-Premises connection strings. You can copy the Connection Strings or regenerate the Access Key used in the connection string. 
<br/>
<br/>
**If you select Regenerate**, the Shared Access Key used within the Connection String is changed. Do the following:
- In the Azure Management Portal, select **Sync Keys** in the Azure application.
- Re-run the **On-Premises Setup**. When you re-run the On-Premises Setup, the on-premises resource is automatically configured to use the updated Primary connection string.


#### Use Group Policy to control the on-premises resources used by a Hybrid Connection

1. Download the Hybrid Connection Manager Administrative Templates.
2. Extract the files.
3. On the computer that modifies group policy, do the following: 

	- Copy the .ADMX files to the *%WINROOT%\PolicyDefinitions* folder.
	- Copy the .ADML files to the *%WINROOT%\PolicyDefinitions\en-us* folder.

Once copied, you can use Group Policy Editor to change the policy.




## Next

- [Connect an Azure Website to an On-Premises Resource](http://go.microsoft.com/fwlink/p/?LinkId=397538)
- [Hybrid Connections Step-by-Step: Connect to on-premises SQL Server from an Azure website](http://go.microsoft.com/fwlink/p/?LinkID=397979)
- [Azure Mobile Services and Hybrid Connections](mobile-services-dotnet-backend-hybrid-connections-get-started.md)
- [Hybrid Connections Overview](integration-hybrid-connection-overview.md)


## See Also

- [REST API for Managing BizTalk Services on Microsoft Azure](http://msdn.microsoft.com/library/azure/dn232347.aspx)
- [BizTalk Services: Editions Chart](http://go.microsoft.com/fwlink/p/?LinkID=302279)<br/>
- [Create a BizTalk Service using Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=302280)<br/>
- [BizTalk Services: Dashboard, Monitor and Scale tabs](http://go.microsoft.com/fwlink/p/?LinkID=302281)<br/>


[HybridConnectionTab]: ./media/integration-hybrid-connection-overview/WABS_HybridConnectionTab.png
[HCOnPremSetup]: ./media/integration-hybrid-connection-overview/WABS_HybridConnectionOnPremSetup.png
[HCManageConnection]: ./media/integration-hybrid-connection-overview/WABS_HybridConnectionManageConn.png