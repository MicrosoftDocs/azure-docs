<properties
	pageTitle="Azure AD Connect: Custom installation | Microsoft Azure"
	description="This document details the custom installation options for Azure AD Connect. Use these instructions to install Active Directory through Azure AD Connect."
	services="active-directory"
    keywords="what is Azure AD Connect, install Active Directory, required components for Azure AD"
	documentationCenter=""
	authors="andkjell"
	manager="stevenpo"
	editor="curtand"/>

<tags
	ms.service="active-directory"  
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="06/27/2016"
	ms.author="billmath;andkjell"/>

# Custom installation of Azure AD Connect
Azure AD Connect **Custom settings** is used when you want more options for the installation. It is used if you have multiple forests or if you want to configure optional features not covered in the express installation. It is used in all cases where the [**express installation**](active-directory-aadconnect-get-started-express.md) option does not satisfy your deployment or topology.

Before you start installing Azure AD Connect, make sure to [download Azure AD Connect](http://go.microsoft.com/fwlink/?LinkId=615771) and complete the pre-requisite steps in [Azure AD Connect: Hardware and prerequisites](active-directory-aadconnect-prerequisites.md). Also make sure you have required accounts available as described in [Azure AD Connect accounts and permissions](active-directory-aadconnect-accounts-permissions.md).

If customized settings does not match your topology, for example to upgrade DirSync, see [related documentation](#related-documentation) for other scenarios.

## Custom settings installation of Azure AD Connect

### Express Settings
On this page, click on **Customize** to start a customized settings installation.

### Install required components
When you install the synchronization services, you can leave the optional configuration section unchecked and Azure AD Connect sets everything up automatically. It sets up a SQL Server 2012 Express LocalDB instance, create the appropriate groups, and assign permissions. If you wish to change the defaults, you can use the following table to understand the optional configuration options that are available.

![Required Components](./media/active-directory-aadconnect-get-started-custom/requiredcomponents.png)

Optional Configuration  | Description
------------- | -------------
Use an existing SQL Server | Allows you to specify the SQL Server name and the instance name. Choose this option if you already have a database server that you would like to use. Enter the instance name followed by a comma and port number in **Instance Name** if your SQL Server does not have browsing enabled.
Use an existing service account | By default Azure AD Connect creates a local service account for the synchronization services to use. The password is generated automatically and unknown to the person installing Azure AD Connect. If you use a remote SQL server or use a proxy that requires authentication, you need a service account in the domain and know the password. In those cases, enter the service account to use. Make sure the user running the installation is an SA in SQL so a login for the service account can be created. See [Azure AD Connect accounts and permissions](active-directory-aadconnect-accounts-permissions.md#custom-settings-installation)
Specify custom sync groups | By default Azure AD Connect creates four groups local to the server when the synchronization services are installed. These groups are: Administrators group, Operators group, Browse group, and the Password Reset Group. You can specify your own groups here. The groups must be local on the server and cannot be located in the domain.

### User sign-in
After installing the required components, you are asked to select your users single sign-on method. The following table provides a brief description of the available options. For a full description of the sign-in methods, see [User sign-in](active-directory-aadconnect-user-signin.md).

![User Signin](./media/active-directory-aadconnect-get-started-custom/usersignin.png)

Single Sign On option | Description
------------- | -------------
Password Sync | Users are able to sign in to Microsoft cloud services, such as Office 365, using the same password they use in their on-premises network. The users passwords are synchronized to Azure AD as a password hash and authentication occurs in the cloud. See [Password synchronization](active-directory-aadconnectsync-implement-password-synchronization.md) for more information.
Federation with AD FS | Users are able to sign in to Microsoft cloud services, such as Office 365, using the same password they use in their on-premises network.  The users are redirected to their on-premises AD FS instance to sign in and authentication occurs on-premises.
Do not configure | Neither feature is installed and configured. Choose this option if you already have a 3rd party federation server or another existing solution in place.

### Connect to Azure AD
On the Connect to Azure AD screen, enter a global admin account and password. If you selected **Federation with AD FS** on the previous page, do not sign in with an account in a domain you plan to enable for federation. A recommendation is to use an account in the default **onmicrosoft.com** domain, which comes with your Azure AD directory.

This account is only used to create a service account in Azure AD and is not used after the wizard has completed.  
![User Signin](./media/active-directory-aadconnect-get-started-custom/connectaad.png)

If your global admin account has MFA enabled, then you need to provide the password again in the sign-in popup and complete the MFA challenge. The challenge could be a providing a verification code or a phone call.  
![User Signin MFA](./media/active-directory-aadconnect-get-started-custom/connectaadmfa.png)

The global admin account can also have [Privileged Identity Management](active-directory-privileged-identity-management-getting-started.md) enabled.

If you receive an error and have problems with connectivity, please see [Troubleshoot connectivity problems](active-directory-aadconnect-troubleshoot-connectivity.md).

## Pages under the section Sync

### Connect your directories
To connect to your Active Directory Domain Service, Azure AD Connect needs the credentials of an account with sufficient permissions. You can enter the domain part in either NetBios or FQDN format, i.e. FABRIKAM\syncuser or fabrikam.com\syncuser. This account can be a regular user account because it only needs the default read permissions. However, depending on your scenario, you may need more permissions. For more information, see [Azure AD Connect Accounts and permissions](active-directory-aadconnect-accounts-permissions.md#create-the-ad-ds-account)

![Connect Directory](./media/active-directory-aadconnect-get-started-custom/connectdir.png)

### Azure AD sign-in configuration
This page will allow you to review the UPN domains present in on-premises AD DS and which have been verified in Azure AD. This page will also allow you to configure the attribute to use for the userPrincipalName.

![Unverified domains](./media/active-directory-aadconnect-get-started-custom/aadsigninconfig.png)  
Review every domain marked **Not Added** and **Not Verified**. Make sure those you use have been verified in Azure AD. Click on the Refresh symbol when you have verified your domains. For more information, see [add and verify the domain](active-directory-add-domain.md)

**UserPrincipalName** - The attribute userPrincipalName is the attribute users use when they sign in to Azure AD and Office 365. The domains used, also known as the UPN-suffix, should be verified in Azure AD before the users are synchronized. Microsoft recommendeds to keep the default attribute userPrincipalName. If this attribute is non-routable and cannot be verified, then it is possible to select another attribute. You can for example select email as the attribute holding the sign-in ID. Using another attribute than userPrincipalName is known as **Alternate ID**. The Alternate ID attribute value must follow the RFC822 standard. An Alternate ID can be used with both password sync and federation.

>[AZURE.WARNING]
Using an Alternate ID is not compatible with all Office 365 workloads. For more information, please refer to [Configuring Alternate Login ID](https://technet.microsoft.com/library/dn659436.aspx).

### Domain and OU filtering
By default all domains and OUs are synchronized. If there are some domains or OUs you do not want to synchronize to Azure AD, you can unselect these domains and OUs.  
![DomainOU filtering](./media/active-directory-aadconnect-get-started-custom/domainoufiltering.png)
This page in the wizard is configuring domain-based filtering. For more information, see [domain-based filtering](active-directory-aadconnectsync-configure-filtering.md#domain-based-filtering).

It is also possible that some domains are not reachable due to firewall restrictions. These domains are unselected by default and have a warning.  
![Unreachable domains](./media/active-directory-aadconnect-get-started-custom/unreachable.png)  
If you see this warning, make sure that these domains are indeed unreachable and the warning is expected.

### Uniquely identifying your users
The Matching across forests feature allows you to define how users from your AD DS forests are represented in Azure AD. A user might either be represented only once across all forests or have a combination of enabled and disabled accounts. The user might also be represented as a contact in some forests.

![Unique](./media/active-directory-aadconnect-get-started-custom/unique.png)

Setting | Description
------------- | -------------
[Users are only represented once across all forests](active-directory-aadconnect-topologies.md#multiple-forests-separate-topologies) | All users are created as individual objects in Azure AD. The objects are not joined in the metaverse.
[Mail attribute](active-directory-aadconnect-topologies.md#multiple-forests-full-mesh-with-optional-galsync) | This option joins users and contacts if the mail attribute has the same value in different forests. Use this option when your contacts have been created using GALSync.
[ObjectSID and msExchangeMasterAccountSID/ msRTCSIP-OriginatorSid](active-directory-aadconnect-topologies.md#multiple-forests-account-resource-forest) | This option joins an enabled user in an account forest with a disabled user in a resource forest. In Exchange, this configuration is known as a linked mailbox. This option can also be used if you only use Lync and Exchange is not present in the resource forest.
sAMAccountName and MailNickName | This option joins on attributes where it is expected the sign-in ID for the user can be found.
A specific attribute | This option allows you to select your own attribute. **Limitation:** Make sure to pick an attribute that already can be found in the metaverse. If you pick a custom attribute (not in the metaverse), the wizard cannot complete.

**Source Anchor** - The attribute sourceAnchor is an attribute that is immutable during the lifetime of a user object. It is the primary key linking the on-premises user with the user in Azure AD. Since the attribute cannot be changed, you must plan for a good attribute to use. A good candidate is objectGUID. This attribute is not changed, unless the user account is moved between forests/domains. In a multi-forest environment where you move accounts between forests, another attribute must be used, such as an attribute with the employeeID. Avoid attributes that would change when a person marries or change assignments. You cannot use attributes with an @-sign, so email and userPrincipalName cannot be used. The attribute is also case-sensitive so when you move an object between forests, make sure to preserve the upper/lower case. Binary attributes are base64-encoded, but other attribute types remain in its unencoded state. In federation scenarios and some Azure AD interfaces, this attribute is also known as immutableID. More information about the source anchor can be found in the [design concepts](active-directory-aadconnect-design-concepts.md#sourceAnchor).

### Sync filtering based on groups
The filtering on groups feature allows you to sync only a small subset of objects for a pilot. To use this feature, create a group for this purpose in your on-premises Active Directory. Then add users and groups that should be synchronized to Azure AD as direct members. You can later add and remove users to this group to maintain the list of objects that should be present in Azure AD. All objects you want to synchronize must be a direct member of the group. Users, groups, contacts, and computers/devices must all be direct members. Nested group membership is not resolved. When you add a group as a member, only the group itself is added and not its members.

![Sync Filtering](./media/active-directory-aadconnect-get-started-custom/filter2.png)

>[AZURE.WARNING]
This feature is only intended to support a pilot deployment. Do not use it in a full-blown production deployment.

In a full-blown production deployment, it is going to be hard to maintain a single group with all objects to synchronize. Instead you should use one of the methods in [Configure filtering](active-directory-aadconnectsync-configure-filtering.md).

### Optional Features
This screen allows you to select the optional features for your specific scenarios.

![Optional features](./media/active-directory-aadconnect-get-started-custom/optional.png)

>[AZURE.WARNING]
If you currently have DirSync or Azure AD Sync active, do not activate any of the writeback features in Azure AD Connect.

Optional Features | Description
------------------- | -------------
Exchange Hybrid Deployment | The Exchange Hybrid Deployment feature allows for the co-existence of Exchange mailboxes both on-premises and in Office 365. Azure AD Connect is synchronizing a specific set of [attributes](active-directory-aadconnectsync-attributes-synchronized.md#exchange-hybrid-writeback) from Azure AD back into your on-premises directory.
Azure AD app and attribute filtering | By enabling Azure AD app and attribute filtering, the set of synchronized attributes can be tailored. This option adds two more configuration pages to the wizard. For more information, see [Azure AD app and attribute filtering](#azure-ad-app-and-attribute-filtering).
Password synchronization | If you selected federation as the sign-in solution, then you can enable this option. Password synchronization can then be used as a backup option. For additional information, see [Password synchronization](active-directory-aadconnectsync-implement-password-synchronization.md).
Password writeback | By enabling password writeback, password changes that originate in Azure AD is written back to your on-premises directory. For more information, see [Getting started with password management](active-directory-passwords-getting-started.md).
Group writeback | If you use the **Office 365 Groups** feature, then you can have these groups represented in your on-premises Active Directory. This option is only available if you have Exchange present in your on-premises Active Directory. For more information, see [Group writeback](active-directory-aadconnect-feature-preview.md#group-writeback).
Device writeback | Allows you to writeback device objects in Azure AD to your on-premises Active Directory for conditional access scenarios. For more information, see [Enabling device writeback in Azure AD Connect](active-directory-aadconnect-feature-device-writeback.md).
Directory extension attribute sync | By enabling directory extensions attribute sync, attributes specified are synced to Azure AD. For more information, see [Directory extensions](active-directory-aadconnectsync-feature-directory-extensions.md).

### Azure AD app and attribute filtering
If you want to limit which attributes to synchronize to Azure AD, then start by selecting which services you are using. If you make configuration changes on this page, a new service has to be selected explicitly by rerunning the installation wizard.

![Optional features Apps](./media/active-directory-aadconnect-get-started-custom/azureadapps2.png)

Based on the services selected in the previous step, this page shows all attributes that are synchronized. This list is a combination of all object types being synchronized. If there are some particular attributes you need to not synchronize, you can unselect those attributes.

![Optional features Attributes](./media/active-directory-aadconnect-get-started-custom/azureadattributes2.png)

>[AZURE.WARNING]
Removing attributes can impact impact functionality. For best practices and recommendations, see [attributes synchronized](active-directory-aadconnectsync-attributes-synchronized.md#attributes-to-synchronize).

### Directory Extension attribute sync
You can extend the schema in Azure AD with custom attributes added by your organization or other attributes in Active Directory. To use this feature, select **Directory Extension attribute sync** on the **Optional Features** page. You can select more attributes to sync on this page.

![Directory extensions](./media/active-directory-aadconnect-get-started-custom/extension2.png)

For more information, see [Directory extensions](active-directory-aadconnectsync-feature-directory-extensions.md).

## Configuring federation with AD FS
Configuring AD FS with Azure AD Connect is simple with just a few clicks. The following is required before the configuration.

- A Windows Server 2012 R2 server for the federation server with remote management enabled
- A Windows Server 2012 R2 server for the Web Application Proxy server with remote management enabled
- An SSL certificate for the federation service name you intend to use (e.g. sts.contoso.com)

### AD FS configuration pre-requisites
To configure your AD FS farm using Azure AD Connect, please ensure WinRM is enabled on the remote servers. In addition, please go through the ports requirement listed in [Table 3 - Azure AD Connect and Federation Servers/WAP](active-directory-aadconnect-ports.md#table-3---azure-ad-connect-and-federation-serverswap).

### Create a new AD FS farm or use an existing AD FS farm
You can use an existing AD FS farm or you can choose to create a new AD FS farm. If you choose to create a new one, you are required to provide the SSL certificate. If the SSL certificate is protected by a password, you are prompted for the password.

![AD FS Farm](./media/active-directory-aadconnect-get-started-custom/adfs1.png)

If you choose to use an existing AD FS farm, you are taken directly to the configuring the trust relationship between AD FS and Azure AD screen.

### Specify the AD FS servers
Enter the servers that you want to install AD FS on. You can add one or more servers based on your capacity planning needs. Join all servers to Active Directory before you perform this configuration. Microsoft recommends to install a single AD FS server for test and pilot deployments. Then add and deploy more servers to meet your scaling needs by running Azure AD Connect again after initial configuration.

>[AZURE.NOTE]
Ensure that all your servers are joined to an AD domain before you do this configuration.

![AD FS Servers](./media/active-directory-aadconnect-get-started-custom/adfs2.png)

### Specify the Web Application Proxy servers
Enter the servers that you want as your Web Application proxy servers. The web application proxy server is deployed in your DMZ (extranet facing) and supports authentication requests from the extranet. You can add one or more servers based on your capacity planning needs. Microsoft recommends to install a single Web application proxy server for test and pilot deployments. Then add and deploy more servers to meet your scaling needs by running Azure AD Connect again after initial configuration. We recommend having an equivalent number of proxy servers to satisfy authentication from the intranet.

>[AZURE.NOTE]
<li> If the account you use is not a local admin on the AD FS servers, then you are prompted for admin credentials.</li>
<li> Ensure that there is HTTP/HTTPS connectivity between the Azure AD Connect server and the Web Application Proxy server before you run this step.</li>
<li> Ensure that there is HTTP/HTTPS connectivity between the Web Application Server and the AD FS server to allow authentication requests to flow through.</li>

![Web App](./media/active-directory-aadconnect-get-started-custom/adfs3.png)

You are prompted to enter credentials so that the web application server can establish a secure connection to the AD FS server. These credentials need to be a local administrator on the AD FS server.

![Proxy](./media/active-directory-aadconnect-get-started-custom/adfs4.png)

### Specify the service account for the AD FS service
The AD FS service requires a domain service account to authenticate users and lookup user information in Active Directory. It can support two types of service accounts:

- **Group Managed Service Account** - Introduced in Active Directory Domain Services with Windows Server 2012. This type of account provides services, such as AD FS, a single account without needing to update the account password regularly. Use this option if you already have Windows Server 2012 domain controllers in the domain that your AD FS servers belong to.
- **Domain User Account** - This type of account requires you to provide a password and regularly update the password when the password changes or expires. Use this option only when you do not have Windows Server 2012 domain controllers in the domain that your AD FS servers belong to.

If you selected Group Managed Service Account and this feature has never been used in Active Directory, you are prompted for Enterprise Admin credentials. These credentials are used to initiate the key store and enable the feature in Active Directory.

![AD FS Service Account](./media/active-directory-aadconnect-get-started-custom/adfs5.png)

### Select the Azure AD domain that you wish to federate
This configuration is used to setup the federation relationship between AD FS and Azure AD. It configures AD FS to issue security tokens to Azure AD and configures Azure AD to trust the tokens from this specific AD FS instance. This page only allows you to configure a single domain in the initial installation. You can configure more domains later by running Azure AD Connect again.

![Azure AD Domain](./media/active-directory-aadconnect-get-started-custom/adfs6.png)

### Verify the Azure AD domain selected for federation
When you select the domain to be federated, Azure AD Connect provides you with necessary information to verify an unverified domain. See [Add and verify the domain](active-directory-add-domain.md) for how to use this information.

![Azure AD Domain](./media/active-directory-aadconnect-get-started-custom/verifyfeddomain.png)

>[AZURE.NOTE]
AD Connect tries to verify the domain during the configure stage. If you continue to configure without adding the necessary DNS records, the wizard is not able to complete the configuration.

## Configure and verify pages
The configuration happens on this page.

>[AZURE.NOTE]
Before you continue installation and if you configured federation, make sure that you have configured [Name resolution for federation servers](active-directory-aadconnect-prerequisites.md#name-resolution-for-federation-servers).

![Ready to configure](./media/active-directory-aadconnect-get-started-custom/readytoconfigure2.png)

### Staging mode
It is possible to setup a new sync server in parallel with staging mode. It is only supported to have one sync server exporting to one directory in the cloud. But if you want to move from another server, for example one running DirSync, then you can enable Azure AD Connect in staging mode. When enabled, the sync engine import and synchronize data as normal, but it does not export anything to Azure AD or AD. The features password sync and password writeback are disabled while in staging mode.

![Staging mode](./media/active-directory-aadconnect-get-started-custom/stagingmode.png)

While in staging mode, it is possible to make required changes to the sync engine and review what is about to be exported. When the configuration looks good, run the installation wizard again and disable staging mode. Data is now exported to Azure AD from this server. Make sure to disable the other server at the same time so only one server is actively exporting.

For more information, see [Staging mode](active-directory-aadconnectsync-operations.md#staging-mode).

### Verify your federation configuration
Azure AD Connect verifies the DNS settings for you when you click on the Verify button.

![Complete](./media/active-directory-aadconnect-get-started-custom/completed.png)

![Verify](./media/active-directory-aadconnect-get-started-custom/adfs7.png)

In addition, perform the following verification steps:

- Validate that you can sign in from a browser from a domain joined machine on the intranet: Connect to https://myapps.microsoft.com and verify the sign-in with your logged in account. The built-in AD DS administrator account is not synchronized and cannot be used for verification.
- Validate that you can sign in from a device from the extranet. On a home machine or a mobile device, connect to https://myapps.microsoft.com and supply your credentials.
- Validate rich client sign-in. Connect to https://testconnectivity.microsoft.com, choose the **Office 365** tab and chose the **Office 365 Single Sign-On Test**.

## Next steps
After the installation has completed, sign out and sign in again to Windows before you use Synchronization Service Manager or Synchronization Rule Editor.

Now that you have Azure AD Connect installed you can [verify the installation and assign licenses](active-directory-aadconnect-whats-next.md).

Learn more about these features, which were enabled with the installation: [Prevent accidental deletes](active-directory-aadconnectsync-feature-prevent-accidental-deletes.md) and [Azure AD Connect Health](active-directory-aadconnect-health-sync.md).

Learn more about these common topics: [scheduler and how to trigger sync](active-directory-aadconnectsync-feature-scheduler.md).

Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).

## Related documentation

Topic |  
--------- | ---------
Azure AD Connect overview | [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)
Install using Express settings | [Express installation of Azure AD Connect](active-directory-aadconnect-get-started-express.md)
Upgrade from DirSync | [Upgrade from Azure AD sync tool (DirSync)](active-directory-aadconnect-dirsync-upgrade-get-started.md)
Accounts used for installation | [More about Azure AD Connect accounts and permissions](active-directory-aadconnect-accounts-permissions.md)
