<properties linkid="manage-services-integration-hybrid-connection" urlDisplayName="Integration Hybrid Connection" pageTitle="Hybrid Connection in Integration and Web Sites | Azure" metaKeywords="BizTalk Services, BizTalk, web sites, hybrid connection, Azure" description="Learn how to create a hybrid connection, manage the connection, and install the Hybrid Connection Manager." metaCanonical="" services="integration-services" documentationCenter="" title="Hybrid Connection" authors="mandia" solutions="" manager="paulettm" editor="cgronlun" />



# Hybrid Connections
This topic lists the steps to create and manage Hybrid Connections, and install the Hybrid Connection Manager. Specifically:

- [What is a Hybrid Connection](HCOverview)
- [Create a Hybrid Connection](#CreateHybridConnection)
- [Install the Hybrid Connection Manager on-premises](#InstallHCM)
- [Manage Hybrid Connections](#ManageHybridConnection)

##<a name="HCOverview"></a>What is a Hybrid Connection

A Hybrid Connection provides an easy and convenient way to connect Azure applications, like Web Sites and Mobile Services, to an on-premises resource. Hybrid Connection benefits include:

- Can connect to any on-premises resource that uses a static TCP port, such as SQL Server, MySQL, HTTP Web APIs, and most custom Web Services.
- Can be used by multiple Azure Web Sites and Mobile Services.
- No code changes to the Azure Web Site or the web site pages.

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>TCP-based services that use dynamic ports (FTP Passive Mode or Extended Passive Mode) are not supported.</p>
	</div>

In the following examples, you can use a Hybrid Connection to create and manage the connectivity:

- There is an Azure Web Site using ADO.NET to connect to an on-premises SQL Server.
- There is an Azure Web Site that connects to an on-premises HTTP web service, like SharePoint.


##<a name="CreateHybridConnection"></a>Create a Hybrid Connection

A Hybrid Connection can be created in the Azure Management Portal using Web Sites **or** using BizTalk Services. 

**To create a Hybrid Connection using Azure Web Sites**, see [Connect an Azure Web Site to an On-Premises Resource](http://go.microsoft.com/fwlink/p/?LinkId=397538).

**To get started with Hybrid Connection and Azure Mobile Services**, see [Azure Mobile Services and Hybrid Connections](http://azure.microsoft.com/en-us/documentation/articles/mobile-services-dotnet-backend-hybrid-connections-get-started).

**To create a Hybrid Connection in BizTalk Services**:

1. Log in to the [Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=213885).
2. In the left navigation pane, select **BizTalk Services** and then select your BizTalk Service. 
<br/>If you don't have an existing BizTalk Service, you can [Create a BizTalk Service](http://go.microsoft.com/fwlink/p/?LinkID=329870).
3. Select the Hybrid Connections tab:
<br/>
![Hybrid Connections Tab][HybridConnectionTab]

4. Select **Create a Hybrid Connection** or select the **ADD** button in the task bar. Enter the following:

	<table border="1">
    <tr>
       <td><strong>Name</strong></td>
        <td>You can enter any name but be specific with its purpose. Examples include:<br/><br/>
		Payroll<em>SQLServerName</em><br/>
		SupplyList<em>SharepointServerName</em><br/>
		Customers<em>OracleServerName</em>
        </td>
    </tr>
    <tr>
        <td><strong>Host Name</strong></td>
        <td>Enter the fully qualified domain name, computer name, or the IPv4 address of the on-premises resource. Examples include:
        <br/><br/>
<em>SQLServerName</em>
<br/>
<em>SQLServerName</em>.<em>Domain</em>.corp.<em>yourCompany</em>.com
<br/>
<em>myHTTPSharePointServer</em>
<br/>
<em>myHTTPSharePointServer</em>.<em>yourCompany</em>.com
<br/>
<em>myFTPServer</em>
<br/>
10.100.10.10
       </td>
    </tr>
	<tr>
        <td><strong>Port</strong></td>
        <td>Enter the port number of the on-premises resource. For example, if you're using a web site, enter port 80 or port 443. If you're using SQL Server, enter port 1433.</td>
	</tr>
	</table>


5. Select the check mark. 

Multiple Hybrid Connections can be created. See the [BizTalk Services: Editions Chart](http://go.microsoft.com/fwlink/p/?LinkID=302279) for the number of connections allowed. 


##<a name="InstallHCM"></a>Install the Hybrid Connection Manager on-premises

After a Hybrid Connection is created, download the Hybrid Connection Manager and install on the on-premises resource:

1. Log in to the [Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=213885).
2. In the left navigation pane, select **BizTalk Services** and then select your BizTalk Service. 
3. Select the **Hybrid Connections** tab:
<br/>
![Hybrid Connections Tab][HybridConnectionTab]
4. In the task bar, select **On-Premises Setup**:
<br/>
![On-Premises Setup][HCOnPremSetup]
5. Select **Install and Configure** to run or download the Hybrid Connection Manager on the on-premises system. 
6. Select the check mark. 


Hybrid Connections support on-premises resources installed on the following operating systems:

- Windows Server 2008 R2
- Windows Server 2012
- Windows Server 2012 R2


After you install the Hybrid Connection Manager, the following occurs: 

- The Hybrid Connection hosted on Azure is automatically configured to use the Primary Application Connection String. 
- The On-Premises resource is automatically configured to use the Primary On-Premises Connection String.

[Manage Hybrid Connections](#ManageHybridConnection) in this topic provides more information on the Connection Strings.


##<a name="ManageHybridConnection"></a>Manage Hybrid Connections
Hybrid Connections are managed in Azure BizTalk Services. [REST APIs](http://msdn.microsoft.com/library/azure/dn232347.aspx) are also available to manage Hybrid Connections.

**To copy/regenerate the Hybrid Connection Strings**:

1. Log in to the [Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=213885).
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
- In the Azure mangement Portal, select **Sync Keys** in the Azure application.
- Re-run the **On-Premises Setup**. When you re-run the On-Premises Setup, the on-premises resource is automatically configured to use the updated Primary connection string.
<br/>


## Next

- [Connect an Azure Web Site to an On-Premises Resource](http://go.microsoft.com/fwlink/p/?LinkId=397538)
- [Hybrid Connections Step-by-Step: Connect to on-premises SQL Server from an Azure web site](http://go.microsoft.com/fwlink/?LinkID=397979)
- [Azure Mobile Services and Hybrid Connections](http://azure.microsoft.com/en-us/documentation/articles/mobile-services-dotnet-backend-hybrid-connections-get-started)


## See Also

- [REST API for Managing BizTalk Services on Windows Azure](http://msdn.microsoft.com/library/azure/dn232347.aspx)
- [BizTalk Services: Editions Chart](http://go.microsoft.com/fwlink/p/?LinkID=302279)<br/>
- [Create a BizTalk Service using Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=302280)<br/>
- [BizTalk Services: Dashboard, Monitor and Scale tabs](http://go.microsoft.com/fwlink/p/?LinkID=302281)<br/>


[HybridConnectionTab]: ./media/integration-hybrid-connection-overview/WABS_HybridConnectionTab.png
[HCOnPremSetup]: ./media/integration-hybrid-connection-overview/WABS_HybridConnectionOnPremSetup.png
[HCManageConnection]: ./media/integration-hybrid-connection-overview/WABS_HybridConnectionManageConn.png