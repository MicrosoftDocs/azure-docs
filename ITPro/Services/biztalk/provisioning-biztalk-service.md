<properties linkid="provisioning-biztalk-service" urlDisplayName="Provision a Windows Azure BizTalk Service" pageTitle="BizTalk Services: Provisioning Using Windows Azure Management Portal" metaKeywords="Get started Azure biztalk services, provision, Azure unstructured data" metaDescription="Lists the steps to provision a BizTalk Service in the Windows Azure Management Portal." metaCanonical="http://www.windowsazure.com/en-us/manage/services/biztalk-services/provisioning-biztalk-service" umbracoNaviHide="0" disqusComments="1" writer="mandia" editor="cgronlun" manager="paulettm" /> 

# BizTalk Services: Provisioning Using Windows Azure Management Portal

<div class="dev-callout"> 
<b>Tip</b> 
<p>To log into the Windows Azure Management Portal, you need a Windows Azure account and Windows Azure subscription. If you don't have an account, you can create a free trial account within a few minutes. For details, see <a href="http://go.microsoft.com/fwlink/p/?LinkID=239738">Windows Azure Free Trial</a>.</p> 
</div>

A Windows Azure BizTalk Service consists of the following components:

<table border="1">
<tr bgcolor="FAF9F9">
        <td><strong>Requirement</strong></td>
        <td><strong>Description</strong></td>
</tr>
<tr>
<td>Windows Azure Subscription</td>
<td><p>The subscription governs access to the Windows Azure Management Portal and is created by the Windows Azure account holder at <a HREF="https://account.windowsazure.com/Subscriptions"> Windows Azure Subscriptions</a>.</p>
<p>The Windows Azure account can have multiple subscriptions and can be managed by the Windows Azure account holder or by different people or groups. For example, your Windows Azure account holder creates a subscription named <i>BizTalkServiceSubscription</i> and gives the BizTalk Administrators within your company (e.g. ContosoBTSAdmins@live.com) access to this subscription. In this scenario, the BizTalk Administrators log into the Windows Azure Management Portal and have full Administrator rights to all the hosted services in the subscription, including Windows Azure BizTalk Services. The BizTalk Administrators are not the Windows Azure account holders and therefore don’t have access to any billing information.</p>
<a HREF="http://go.microsoft.com/fwlink/p/?LinkID=267577"> Manage Subscriptions and Storage Accounts in the Windows Azure Management Portal</a> provides more information on Windows Azure Accounts and Subscriptions.
</td>
</tr>
<tr>
<td>Windows Azure SQL Database</td>
<td><p>A SQL Database stores the tables, views and stored procedures used by Windows Azure BizTalk Services.</p>
<p>When you provision a BizTalk Service, you can use an existing Azure SQL Server, Azure SQL Database, or automatically create a new Server or Database. When you choose to create a new Windows Azure SQL Server and Database, Windows Azure Services is automatically enabled.</p>
<p>If you create a new Azure SQL Database on an existing Azure SQL Server, the firewall rules of the Server are not modified. As a result, it's possible other Windows Azure Services are not allowed access to the Server’s databases.</p>
There are no minimum scale requirements for the SQL Database settings.</td>
</tr>
<tr>
<td>Windows Azure Access Control namespace</td>
<td>The Access Control namespace authenticates with Windows Azure BizTalk Services. When you deploy a BizTalk Service project from Visual Studio, you enter this Access Control Namespace. When you provision a BizTalk Service, the Access Control Namespace is automatically created.</td>
</tr>

<tr>
<td>Windows Azure Storage Account</td>
<td><p>The Windows Azure Storage Account gives access to tables, blobs, and queues. When you provision a BizTalk Service, you can use an existing Storage Account or automatically create a new Storage Account. The tables, blobs, and queues are used by your BizTalk Service to do the following:</p>
<ul>
<li>Log files that monitor the BizTalk Service are stored. The monitoring output is also displayed in Monitoring tab in the Windows Azure Management Portal.</li>
<li>When creating an X12 or AS2 agreement between partners, you can enable the Archiving feature to store message properties. This tracking data is saved in this Storage Account.</li>
</ul>
</td>
</tr>

<tr>
<td>SSL private certificate</td>
<td><p>When you provision Windows Azure BizTalk Services, you create a URL that includes your  BizTalk Service name. This private SSL certificate (.pfx) is used as the HTTPS Server Authentication certificate when requests are made to your BizTalk Service URL. When you provision a BizTalk Service, a self-signed certificate is automatically created. </p>
<strong>Important SSL Certificate Information</strong>

<ul>
<li>The certificate expiration date must be less than 5 years.</li>
<li>All private certificates require a password. Know this password and as a best practice, share this password with your administrators.</li>
<li>Self-signed certificates can be used in a test or development environment. When using self-signed certificates, import the certificate to your Personal certificate store and the Trusted Root Certification Authorities certificate store.</li>
</ul>
<br/>When sending the production certificate request to your certification authority, specify the following certificate properties:
<br/>

<ul>
<li><p><strong>Enhanced Key Usage</strong>: Server Authentication
Additional key usages can be enabled on the certificate. At a minimum, Windows Azure BizTalk Services requires Server Authentication.</p></li>
<li><p><strong>Common Name</strong>: Enter the fully qualified domain name (FQDN) of your Windows Azure BizTalk Services URL; which is created when you provision the BizTalk Service in <a HREF="#BizTalk">Provision a BizTalk Service</a>, in this topic.</p>
<p>So, you need to know what your URL will be when you send the certificate request to your certification authority. A new or different certificate can be added after the BizTalk Service is provisioned.</p></li>
</ul>
<br/>
</td>
</tr>
</table>


This topic lists the steps to provision Windows Azure BizTalk Services, including: 

-  [Step 1: Provision a BizTalk Service](#BizTalk)
-  [Step 2: Post-Provisioning Steps](#PostProv)
-  [Optional: Create the SQL Database Server](#SQLDB)
-  [Optional: Create a Storage Account](#Storage)

##<a name="BizTalk"></a>Step 1: Provision a BizTalk Service

The BizTalk Service hosts your Windows Azure BizTalk Service applications. When you provision a BizTalk Service, the Access Control Namespace and self-signed SSL certificate are automatically created. You can choose to create a new Windows Azure SQL Database and new Storage Account. After the BizTalk Service is provisioned, some of these requirements can be updated. 

The following steps provision a new Windows Azure BizTalk Service:

1. Log in to the [Windows Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=213885).

2. At the bottom of the navigation pane, select <b>+NEW</b>:

	![Select the New button][NEWButton]

3. Select <b>APP SERVICES</b>, select <b>BIZTALK SERVICE</b>, and then select <b>CUSTOM CREATE</b>:

	![Select BizTalk Service and select Custom Create][NewBizTalkService]

4. Enter the following BizTalk Service settings:
	<table border="1">
	<tr>
	<td><strong>BizTalk Service Name</strong></td>
	<td>Enter a name for your BizTalk Service. ".biztalk.windows.net" is automatically added to the name you enter. This results in a URL that is used to access your BizTalk Service. You can enter any name but it’s best to be specific. Some examples include:<br/><br/>
	<em>mycompany</em>.biztalk.windows.net<br/>
	<em>mycompanymyapplication</em>.biztalk.windows.net<br/>
	<em>myapplication</em>.biztalk.windows.net
	</td>
	</tr>
	<tr>
	<td><strong>Domain URL</strong></td>
	<td><b>Optional</b>. By default, the domain URL is <i>YourBizTalkServiceName</i>.biztalk.windows.net. A custom domain can also be entered. For example, if your domain is <i>contoso</i>, you can enter: <br/><br/>
	<i>MyCompany</i>.contoso.com<br/>
	<i>MyCompanyMyApplication</i>.contoso.com<br/>
	<i>MyApplication</i>.contoso.com<br/>
	<i>YourBizTalkServiceName</i>.contoso.com<br/>
	</td>
	</tr>
	<tr>
	<td><strong>Edition</strong></td>
	<td>Options include:
	<ul>
	<li>Developer</li>
	<li>Standard</li>
	<li>Basic</li>
	<li>Premium</li>
	</ul>
	<a HREF="http://go.microsoft.com/fwlink/p/?LinkID=302279">BizTalk Services: Developer, Basic, Standard and Premium Editions Chart</a> lists the differences with the editions. If you are in the testing/development phase, choose <b>Developer</b>. If you are in the production phase, use the chart to determine if Premium, Standard, or Basic is the correct choice for your business scenario.
	</td>
	</tr>
	<tr>
	<td><strong>Region</strong></td>
	<td>Select the geographic region to host your BizTalk Service.</td>
	</tr>
	<tr>
	<td><strong>Tracking Database</strong></td>
	<td><p>Select your SQL Database to store the tables used by your BizTalk Service. Choose from the following options:</p>
	<ul>
	<li><strong>Use an existing SQL Database instance</strong>: Select this option to use an existing Azure SQL Database. An existing Azure SQL Database can be used if it's not used by another BizTalk Service. You need the login name and password specified when that Azure SQL Database Server was created.</li>
	<li><p><strong>Create a new SQL Database instance</strong>: Select this option to create a new SQL Database.</p></li>
	<p><b>Note</b></p>
	<p>When you create a new Azure SQL Server and Database, Windows Azure Services is automatically enabled on the SQL Database. The BizTalk Service requires Windows Azure Services be enabled on the Azure SQL Database.</p>
	<p><b>Tip</b></p>
	Create the Tracking database and Monitoring/Archiving Storage Account in the same region as the BizTalk Service.
	</ul>
	</td>
	</tr>
	<tr>
	<td><b>Subscription</b></td>
	<td><b>Optional</b>. Available only when there is more than one subscription. Select your subscription to host your BizTalk Service.</td>
	</tr>
	</table>
Select the NEXT arrow.

5. Enter your Database Settings:

	<table border="1">
	<tr>
	<td><strong>Subscription</strong></td>
	<td><strong>Optional</strong>. Available only when there is more than one subscription. Select your subscription to host the Windows Azure SQL Database.</td>
	</tr>
	<tr>
	<td><strong>Database</strong></td>
	<td><p>Available when <strong>Use an existing SQL Database instance</strong> is selected in the previous screen.</p>
	Select your SQL Database to store the tables used by your BizTalk Service.
	</td>
	</tr>
	<tr>
	<td><strong>Name</strong></td>
	<td><p>Available when <strong>Create a new SQL Database instance</strong> is selected in the previous screen.</p>
	Enter the SQL Database name to be used by your BizTalk Service. By Default, <i>YourBizTalkServiceName</i>_db is entered.</td>
	</tr>
	<tr>
	<td><strong>Server</strong></td>
	<td><p>Available when <strong>Create a new SQL Database instance</strong> is selected in the previous screen.</p>
	Select an existing SQL Database Server. Or, select <strong>New SQL database server</strong> to create a new SQL Database server.</td>
	</tr>
	<tr>
	<td><strong>Server Login Name</strong></td>
	<td>Enter the login user name.</td>
	</tr>
	<tr>
	<td><strong>Server Login Password</strong></td>
	<td>Enter the login password.</td>
	</tr>
	<tr>
	<td><strong>Region</strong></td>
	<td>Available when <strong>Create a new SQL Database instance</strong> is selected. Select the geographic region to host your SQL Database.</td>
	</tr>
	</table>
Select the NEXT arrow.

6. Enter the Windows Azure monitoring settings:

	<table border="1">
	<tr>
	<td><strong>Monitoring/Archiving Storage Account</strong></td>
	<td>Select an existing storage account or select <strong>Create a new storage account</strong>.</td>
	</tr><tr>
	<td><strong>Storage Account Name</strong></td>
	<td>Available when <strong>Create a new storage account</strong> is selected. Enter a name for the Storage Account used by your BizTalk Service.</td>
	</tr>
	</table>

Select the check mark to complete the wizard. When complete, the progress icon displays:<br/>

![Progress icon displays when complete][ProgressComplete]


When complete, a Windows Azure BizTalk Service is provisioned and ready for your applications.

The default settings are sufficient. If you want to modify the default settings, select **BIZTALK SERVICES** in the left navigation pane, and select your BizTalk Service. Additional settings are displayed in the Dashboard, Monitor, and Scale tabs.

Depending on the state of the BizTalk Service, there are some operations that cannot be completed. For a list of these operations, refer to [BizTalk Services: BizTalk Service State Chart](http://go.microsoft.com/fwlink/p/?LinkID=329870).

##<a name="PostProv"></a>Step 2: Post-Provisioning Steps

This section lists the following steps: 

-  [Add a private certificate](#AddCert)
-  [Retrieve the Access Control namespace](#ACS)

####<a name="AddCert"></a>Add a private certificate
When you provision a Windows Azure BizTalk Service, a URL that includes your BizTalk Service name is created. A private SSL certificate (.pfx) is used as the HTTPS Server Authentication certificate when requests are made to your BizTalk Service URL. 

A self-signed certificate is automatically created for your BizTalk service. This certificate can be downloaded or replaced on the BizTalk Service Dashboard. Self-signed certificates are used in development environments. 

To add a production-ready certificate:

1. Log in to the [Windows Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=213885).
2. Select **BIZTALK SERVICES** in the left navigation pane and then select your BizTalk Service.
3. Select the **Dashboard** tab.
4. Select **Update SSL Certificate**:<br/><br/>
![Modify SSL Certificate][QuickGlance]

5. Browse to your private SSL certificate (*CertificateName*.pfx) that includes your BizTalk Service name, enter the password, and select the check mark.


####<a name="ACS"></a>Retrieve the Access Control namespace

The Access Control namespace authenticates with Windows Azure BizTalk Services. When you deploy a BizTalk Service project from Visual Studio, you enter this Access Control namespace. 

The Access Control Namespace is automatically created for your BizTalk service. To retrieve the Access Control namespace, Default Issuer, and Issuer Key, select the **Connection Information** button on the BizTalk Service Dashboard.

To retrieve the Access Control Namespace:

1. Log in to the [Windows Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=213885).
2. Select **BIZTALK SERVICES** in the left navigation pane and then select your BizTalk Service.
3. In the task bar, select **Connection Information**:<br/><br/>
![Select Connection Information][ACSConnectInfo]

You can copy and paste the Access Control values.

When the Access Control namespace is created, the Access Control values can be used with any application. When Windows Azure BizTalk Services is provisioned, this Access Control namespace controls the authentication with your BizTalk Service deployment. If you want to change the subscription or manage the namespace, select **ACTIVE DIRECTORY** in the left navigation pane and then select your namespace. The bottom navigation pane lists your options.

Clicking **Manage** opens the Access Control Management Portal. In the Access Control Management Portal, the BizTalk Service uses **Service identities**:<br/><br/>
![ACS Service Identities in the Access Control Management Portal][ACSServiceIdentities]

The Access Control service identity is a set of credentials that allow applications or clients to authenticate directly with Access Control and receive a token. 

**Important**<br/>
The BizTalk Service uses **Owner** for the default service identity and the **Password** value. If you use the Symmetric Key value instead of the Password value, the following error may occur:

*Could not connect to the Access Control Management Service account with the specified credentials*

[Managing Your ACS Namespace](http://go.microsoft.com/fwlink/p/?LinkID=285670) lists some guidelines and recommendations.




##<a name="SQLDB"></a>Optional: Create the SQL Database Server

When you provision a Windows Azure BizTalk Services, a new SQL Database Server is automatically created. If you prefer to create a SQL Database Server independent of the BizTalk Service, refer to [How to use Windows Azure SQL Database in .NET applications](http://go.microsoft.com/fwlink/p/?LinkID=251285).

When complete, there is a new Windows Azure SQL Database that you can log into and create tables, views, and stored procedures. 

By default, the SQL Database scale is configured with the following:

- Web Edition
- 1GB database size

The default configuration is sufficient for a BizTalk Service. If you want to modify the scale configuration settings, select **SQL DATABASES** in the left navigation pane, double-select your SQL Database, and select the **Configure** tab. Modifying the scale may impact pricing. [Accounts and Billing in Windows Azure SQL Database](http://go.microsoft.com/fwlink/p/?LinkID=234930) provides information on the editions and billing.


##<a name="Storage"></a>Optional: Create a Storage Account

When you provision a Windows Azure BizTalk Service, a Windows Azure Storage Account is automatically created. If you prefer to create a Windows Azure Storage Account independent of the BizTalk Service, refer to [How To Create a Storage Account](http://go.microsoft.com/fwlink/p/?LinkID=279823).

When complete, there is a new Windows Azure Storage Account that gives you access to tables, blobs, and queues. 

The default settings are sufficient for a BizTalk Service. If you want to modify the default settings, select **STORAGE** in the left navigation pane, and select your Storage Account. The settings are displayed in the Dashboard, Monitor, Configure and Containers tabs.

When you create a Storage account, a Primary Key and Secondary Key are automatically created. These Keys control access to your Storage Account. The BizTalk Service automatically uses the Primary Key.

[Storage](http://go.microsoft.com/fwlink/p/?LinkID=285671) provides information on your Storage Account.



## Next

Now that a BizTalk Service is provisioned, you can familiar yourself with the different tabs at [BizTalk Services: Dashboard, Monitor and Scale tabs](http://go.microsoft.com/fwlink/p/?LinkID=302281). Your BizTalk Service is ready for your applications. To start creating applications, go to [Windows Azure BizTalk Services](http://go.microsoft.com/fwlink/p/?LinkID=235197).

## See Also
- [BizTalk Services: Developer, Basic, Standard and Premium Editions Chart](http://go.microsoft.com/fwlink/p/?LinkID=302279)<br/>
- [BizTalk Services: BizTalk Service State Chart](http://go.microsoft.com/fwlink/p/?LinkID=329870)<br/>
- [BizTalk Services: Backup and Restore](http://go.microsoft.com/fwlink/p/?LinkID=329873)<br/>
- [BizTalk Services: Throttling](http://go.microsoft.com/fwlink/p/?LinkID=302282)<br/>
- [BizTalk Services: Issuer Name and Issuer Key](http://go.microsoft.com/fwlink/p/?LinkID=303941)<br/>
- [How do I Start Using the Windows Azure BizTalk Services SDK](http://go.microsoft.com/fwlink/p/?LinkID=302335)

[NEWButton]: ../Media/WABS_New.png
[ProgressComplete]: ../Media/WABS_ProgressComplete.png
[NewBizTalkService]: ../Media/WABS_NewBizTalkService.png
[ACSConnectInfo]: ../Media/WABS_ACSConnectInformation.png
[QuickGlance]: ../Media/WABS_QuickGlance.png
[ACSServiceIdentities]: ../Media/WABS_ACSServiceIdentities.png