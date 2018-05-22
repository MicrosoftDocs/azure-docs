---
title: Create Azure BizTalk Services in the Azure portal | Microsoft Docs
description: Learn how to provision or create Azure BizTalk Services in the Azure portal; MABS, WABS
services: biztalk-services
documentationcenter: ''
author: MandiOhlinger
manager: anneta
editor: ''

ms.assetid: 3ad18876-a649-40d6-9aa0-1509c1d62c43
ms.service: biztalk-services
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 11/07/2016
ms.author: mandia

---
# Create BizTalk Services using the Azure portal

> [!INCLUDE [BizTalk Services is being retired, and replaced with Azure Logic Apps](../../includes/biztalk-services-retirement.md)]

> [!INCLUDE [Use APIs to manage MABS](../../includes/biztalk-services-retirement-azure-classic-portal.md)]

> [!TIP]
> To sign in to the Azure portal, you need an Azure account and Azure subscription. If you don't have an account, you can create a free trial account within a few minutes. See [Azure Free Trial](http://go.microsoft.com/fwlink/p/?LinkID=239738).


## <a name="CreateService"></a>Create a BizTalk Service

> [!INCLUDE [Use APIs to manage MABS](../../includes/biztalk-services-retirement-azure-classic-portal.md)]

Depending on the state of the BizTalk Service, there are some operations that cannot be completed. For a list of these operations, go to [BizTalk Services State Chart](biztalk-service-state-chart.md).

## Post-provisioning steps
* [Install the certificate on a local computer](#InstallCert)
* [Add a production-ready certificate](#AddCert)
* [Get the Access Control namespace](#ACS)

#### <a name="InstallCert"></a>Install the certificate on a local computer

> [!INCLUDE [Use APIs to manage MABS](../../includes/biztalk-services-retirement-azure-classic-portal.md)]

#### <a name="AddCert"></a>Add a production-ready certificate

> [!INCLUDE [Use APIs to manage MABS](../../includes/biztalk-services-retirement-azure-classic-portal.md)]

#### <a name="ACS"></a>Get the Access Control namespace

> [!INCLUDE [Use APIs to manage MABS](../../includes/biztalk-services-retirement-azure-classic-portal.md)]

When you deploy a BizTalk Service project from Visual Studio, you enter this Access Control namespace. The Access Control namespace is automatically created for your BizTalk Service.

The Access Control values can be used with any application. When Azure BizTalk Services is created, this Access Control namespace controls the authentication with your BizTalk Service deployment. If you want to change the subscription or manage the namespace, select **ACTIVE DIRECTORY** in the left navigation pane and then select your namespace. The task bar lists your options.

Clicking **Manage** opens the Access Control Management Portal. In the Access Control Management Portal, the BizTalk Service uses **Service identities**:  
![ACS Service Identities in the Access Control Management Portal][ACSServiceIdentities]

The Access Control service identity is a set of credentials that allow applications or clients to authenticate directly with Access Control and receive a token.

> [!IMPORTANT]
> The BizTalk Service uses **Owner** for the default service identity and the **Password** value. If you use the Symmetric Key value instead of the Password value, the following error may occur.<br/><br/>*Could not connect to the Access Control Management Service account with the specified credentials*
> 
> 

[Managing Your ACS Namespace](https://msdn.microsoft.com/library/azure/hh674478.aspx) lists some guidelines and recommendations.

## Requirements explained
These requirements do not apply to the Free Edition.

<table border="1">
<tr bgcolor="FAF9F9">
        <td><strong>What you need</strong></td>
        <td><strong>Why you need it</strong></td>
</tr>
<tr>
<td>Azure subscription</td>
<td>The subscription determines who can sign in to Azure. The Account holder creates the subscription at <a HREF="https://account.windowsazure.com/Subscriptions"> Azure Subscriptions</a>.
<br/><br/>
The Azure account can have multiple subscriptions and can be managed by anyone who is permitted. For example, your Azure account holder creates a subscription named <em>BizTalkServiceSubscription</em> and gives the BizTalk Administrators within your company (for example, ContosoBTSAdmins@live.com) access to this subscription. In this scenario, the BizTalk Administrators sign in to the Azure, and have full Administrator rights to all the hosted services in the subscription, including Azure BizTalk Services. The BizTalk Administrators are not the Azure account holders and therefore don't have access to any billing information.
<br/><br/>
<a HREF="http://go.microsoft.com/fwlink/p/?LinkID=267577"> Manage Subscriptions and Storage Accounts in Azure</a> provides more information.
</td>
</tr>
<tr>
<td>Azure SQL Database</td>
<td>Stores the tables, views, and stored procedures used by the BizTalk Service, including the Tracking data.
<br/><br/>
When you create a BizTalk Service, you can use an existing Azure SQL Server, Azure SQL Database, or automatically create a new Server or Database.
<br/><br/>
The SQL Database scale is automatically configured. Typically, the default scale is sufficient for a BizTalk Service. Changing the scale impacts pricing. See <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=234930"> Accounts and Billing in Azure SQL Database</a>
<br/><br/>
<strong>Notes</strong>
<br/>
<ul>
<li> When you create a new Azure SQL Server and Database, Azure Services is automatically enabled. The BizTalk Service requires Azure Services be enabled.</li>
<li>If you create a new Azure SQL Database on an existing Azure SQL Server, the firewall rules of the Server are not changed. As a result, it's possible other Azure Services are not allowed access to the Server's databases.</li>
</ul>
</td>
</tr>
<tr>
<td>Azure Access Control namespace</td>
<td>Authenticates with Azure BizTalk Services. When you deploy a BizTalk Service project from Visual Studio, you enter this Access Control namespace. When you create a BizTalk Service, the Access Control namespace is automatically created.</td>
</tr>

<tr>
<td>Azure Storage account</td>
<td>Gives access to tables, blobs, and queues used by your BizTalk Service to save the following:

<ul>
<li>Log files that monitor the BizTalk Service. </li>
<li>When creating an X12 or AS2 agreement between partners, you can enable the Archiving feature to store message properties. This data is saved in the Storage account.</li>
</ul>
<br/>
When you create a BizTalk Service, you can use an existing Storage account or automatically create a new Storage account.
<br/><br/>
The default Storage settings are sufficient for a BizTalk Service.
<br/><br/>
When you create a Storage account, a Primary Key and Secondary Key are automatically created. These Keys control access to your Storage account. The BizTalk Service automatically uses the Primary Key.
<br/><br/>
See <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=285671"> Storage</a> for more information.
</td>
</tr>

<tr>
<td>SSL private certificate</td>
<td>
When an Azure BizTalk Service is created, an HTTPS URL that includes your BizTalk Service name is also created. This URL is automatically configured to use a self-signed development-only certificate. For production, you need a private SSL certificate.
<br/><br/>
<strong>Important SSL Certificate Information</strong>

<ul>
<li>The certificate expiration date must be less than 5 years.</li>
<li>All private certificates require a password. Know this password and as a best practice, share this password with your administrators.</li>
<li>Self-signed certificates are used in a test/development environment. When using self-signed certificates, import the certificate to your Personal certificate store and the Trusted Root Certification Authorities certificate store.</li>
</ul>
<br/>When sending the production certificate request to your certification authority, give the following certificate properties:
<br/>

<ul>
<li><strong>Enhanced Key Usage</strong>: At a minimum, Azure BizTalk Services requires Server Authentication.</li>
<li><strong>Common Name</strong>: Enter the fully qualified domain name (FQDN) of your Azure BizTalk Service URL. See <a HREF="#CreateService">Create a BizTalk Service</a> in this article.</li>
</ul>
<br/>
A new or different certificate can be added after the BizTalk Service is created.
</td>
</tr>
</table>
<!---Loc Comment: Please, check link [Create a BizTalk Service] since it is not redirecting to any location.--->



## Hybrid Connections
When you create an Azure BizTalk Service, the **Hybrid Connections** tab is available:

![Hybrid Connections Tab][HybridConnectionTab]

Hybrid Connections are used to connect an Azure website or Azure mobile service to any on-premises resource that uses a static TCP port, such as SQL Server, MySQL, HTTP Web APIs, Mobile Services, and most custom Web Services.  Hybrid Connections and the BizTalk Adapter Service are different. The BizTalk Adapter Service is used to connect Azure BizTalk Services to an on-premises Line of Business (LOB) system.

 See [Hybrid Connections](integration-hybrid-connection-overview.md) to learn more, including creating and managing Hybrid Connections.

## Next steps
Now that a BizTalk Service is created, familiarize yourself with the different [BizTalk Services: Dashboard, Monitor and Scale tabs](biztalk-dashboard-monitor-scale-tabs.md). Your BizTalk Service is ready for your applications. To start creating applications, go to [Azure BizTalk Services](http://go.microsoft.com/fwlink/p/?LinkID=235197).

## See also
* [BizTalk Services: Editions Chart](biztalk-editions-feature-chart.md)<br/>
* [BizTalk Services: State Chart](biztalk-service-state-chart.md)<br/>
* [BizTalk Services: Backup and Restore](biztalk-backup-restore.md)<br/>
* [BizTalk Services: Throttling](biztalk-throttling-thresholds.md)<br/>
* [BizTalk Services: Issuer Name and Issuer Key](biztalk-issuer-name-issuer-key.md)<br/>
* [How do I Start Using the Azure BizTalk Services SDK](http://go.microsoft.com/fwlink/p/?LinkID=302335)<br/>
* [Hybrid Connections](integration-hybrid-connection-overview.md)

[NewBizTalkService]: ./media/biztalk-provision-services/WABS_NewBizTalkService.png
[NEWButton]: ./media/biztalk-provision-services/WABS_New.png
[ProgressComplete]: ./media/biztalk-provision-services/WABS_ProgressComplete.png
[ACSConnectInfo]: ./media/biztalk-provision-services/WABS_ACSConnectInformation.png
[QuickGlance]: ./media/biztalk-provision-services/WABS_QuickGlance.png
[ACSServiceIdentities]: ./media/biztalk-provision-services/WABS_ACSServiceIdentities.png
[HybridConnectionTab]: ./media/biztalk-provision-services/WABS_HybridConnectionTab.png
