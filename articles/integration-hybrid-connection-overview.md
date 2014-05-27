<properties linkid="manage-services-integration-hybrid-connection" urlDisplayName="Hybrid Connections Overview - BizTalk Services" pageTitle="Hybrid Connections Overview | Azure" metaKeywords="BizTalk Services, BizTalk, web sites, hybrid connections, Azure" description="Learn how to create a hybrid connection, manage the connection, and install the Hybrid Connection Manager." metaCanonical="" services="integration-services" documentationCenter="" title="Hybrid Connection" authors="mandia" solutions="" manager="paulettm" editor="cgronlun" />



# Hybrid Connections
This topic introduces Hybrid Connections and lists the steps to create and configure Hybrid Connections. Specifically:

- [What is a Hybrid Connection](HCOverview)
- [Create a Hybrid Connection](#CreateHybridConnection)
- [Install the Hybrid Connection Manager on-premises](#InstallHCM)
- [Manage Hybrid Connections](#ManageHybridConnection)
- [Important Details](#KnownIssues)

##<a name="HCOverview"></a>What is a Hybrid Connection

Hybrid Connections provides an easy and convenient way to connect Azure Web Sites and Azure Mobile Services to on-premises resources. Hybrid Connections are a feature of Azure BizTalk Services:

![Hybrid Connections][HCImage]

Hybrid Connections benefits include:

- Web Sites and Mobile Services can access existing on-premises data and services securely.
- Multiple Web sites or Mobile Services can share a Hybrid Connection to access an on-premises resource. 
- No changes are required to the Enterprise network, such as configuring a VPN gateway, or opening firewall ports to incoming traffic.
- Applications using Hybrid Connections access only the specific on-premises resource that is published through the Hybrid Connection.
- Can connect to any on-premises resource that uses a static TCP port, such as SQL Server, MySQL, HTTP Web APIs, and most custom Web Services.

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>TCP-based services that use dynamic ports (such as FTP Passive Mode or Extended Passive Mode) are currently not supported.</p>
	</div>
- Can be used with all frameworks supported by Azure Web Sites (.NET, PHP, Java, Python, Node.js) and Azure Mobile Services (Node.js, .NET).
- Web Sites and Mobile Services can access on-premises resources in exactly the same way as if the Web Site or Mobile Service is located on your local network. For example, the same connection string used on-premises can also be used on Azure.


Hybrid Connections also provides Enterprise Administrators control and visibility into the corporate resources accessed by hybrid applications, including:

- Using Group Policy settings, Administrators can allow Hybrid Connections on the network and also designate resources that can be accessed by hybrid applications.
- Event and Audit logs on the corporate network provide visibility into the resources accessed by Hybrid Connections.

####Process Overview

To connect to an on-premises resource, the primary steps include:

1.	Create the Hybrid Connection by specifying the host name or IP address of the on-premises resource on your private network.

2.	Link your Azure web site or Azure mobile service to the Hybrid Connection.

3.	Install the Hybrid Connection Manager on your on-premises network and connect to the specific Hybrid Connection. The Azure portal provides a single-click experience to install and connect.


##<a name="CreateHybridConnection"></a>Create a Hybrid Connection

A Hybrid Connection can be created in the Azure Management Portal using Web Sites **or** using BizTalk Services. 

**To create Hybrid Connections using Azure Web Sites**, see [Connect an Azure Web Site to an On-Premises Resource](http://go.microsoft.com/fwlink/p/?LinkId=397538).

**To get started with Hybrid Connection and Azure Mobile Services**, see [Azure Mobile Services and Hybrid Connections](http://azure.microsoft.com/en-us/documentation/articles/mobile-services-dotnet-backend-hybrid-connections-get-started).

**To create Hybrid Connections in BizTalk Services**:

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
10.100.10.10
       </td>
    </tr>
	<tr>
        <td><strong>Port</strong></td>
        <td>Enter the port number of the on-premises resource. For example, if you're using a web site, enter port 80 or port 443. If you're using SQL Server, enter port 1433.</td>
	</tr>
	</table>


5. Select the check mark. 

####Additional

- Multiple Hybrid Connections can be created. See the [BizTalk Services: Editions Chart](http://go.microsoft.com/fwlink/p/?LinkID=302279) for the number of connections allowed. 
- Each Hybrid Connection is created with a pair of connection strings: Application keys that SEND and On-premises keys that LISTEN. Each pair has a Primary and a Secondary key.


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
6. Select the check mark to start the installation. 

#### Additional
- Hybrid Connections support on-premises resources installed on the following operating systems:

	- Windows Server 2008 R2
	- Windows Server 2012
	- Windows Server 2012 R2


- After you install the Hybrid Connection Manager, the following occurs: 

	- The Hybrid Connection hosted on Azure is automatically configured to use the Primary Application Connection String. 
	- The On-Premises resource is automatically configured to use the Primary On-Premises Connection String.

- The Hybrid Connection Manager must use a valid on-premises connection string for authorization. The Azure Website or  Mobile Service must use a valid application connection string for authorization.


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


##<a name="KnownIssues"></a>Important Details

Hybrid Connections support the following framework and application combinations:

- .NET framework access to SQL Server
- .NET framework access to HTTP/HTTPS services with WebClient
- PHP access to SQL Server, MySQL
- Java access to SQL Server, MySQL and Oracle
- Java access to HTTP/HTTPS services

When using Hybrid Connections to access on-premises SQL Server, consider the following:

- SQL Express Named Instances must be configured to use static ports. By default, SQL Express named instances use dynamic ports.
- SQL Express Default Instances uses a static port, but TCP must be enabled. By default, TCP is not enabled.
- When using Clustering or Availability Groups, the MultiSubnetFailover=true mode is currently not supported.
- The ApplicationIntent=ReadOnly is currently not supported.
- SQL Authentication should be used.


## Next

- [Connect an Azure Web Site to an On-Premises Resource](http://go.microsoft.com/fwlink/p/?LinkId=397538)
- [Hybrid Connections Step-by-Step: Connect to on-premises SQL Server from an Azure web site](http://go.microsoft.com/fwlink/?LinkID=397979)
- [Azure Mobile Services and Hybrid Connections](http://azure.microsoft.com/en-us/documentation/articles/mobile-services-dotnet-backend-hybrid-connections-get-started)


## See Also

- [REST API for Managing BizTalk Services on Windows Azure](http://msdn.microsoft.com/library/azure/dn232347.aspx)
- [BizTalk Services: Editions Chart](http://go.microsoft.com/fwlink/p/?LinkID=302279)<br/>
- [Create a BizTalk Service using Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=302280)<br/>
- [BizTalk Services: Dashboard, Monitor and Scale tabs](http://go.microsoft.com/fwlink/p/?LinkID=302281)<br/>

[HCImage]: ./media/integration-hybrid-connection-overview/WABS_HybridConnectionImage.png
[HybridConnectionTab]: ./media/integration-hybrid-connection-overview/WABS_HybridConnectionTab.png
[HCOnPremSetup]: ./media/integration-hybrid-connection-overview/WABS_HybridConnectionOnPremSetup.png
[HCManageConnection]: ./media/integration-hybrid-connection-overview/WABS_HybridConnectionManageConn.png