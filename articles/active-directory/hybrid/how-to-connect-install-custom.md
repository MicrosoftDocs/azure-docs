---
title: 'Customize an installation of Azure Active Directory Connect'
description: This article explains the custom installation options for Azure AD Connect. Use these instructions to install Active Directory through Azure AD Connect.
services: active-directory
keywords: what is Azure AD Connect, install Active Directory, required components for Azure AD
documentationcenter: ''
author: billmath
manager: daveba
ms.assetid: 6d42fb79-d9cf-48da-8445-f482c4c536af
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 09/10/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Custom installation of Azure Active Directory Connect
Use *custom settings* in Azure Active Directory (Azure AD) Connect when you want more options for the installation. Use these settings, for example, if you have multiple forests or if you want to configure optional features. You should use custom settings in all cases where [*express installation*](how-to-connect-install-express.md) doesn't satisfy your deployment or topology.

Before you install Azure AD Connect:
- [Download Azure AD Connect](https://go.microsoft.com/fwlink/?LinkId=615771).
- Complete the prerequisite steps in [Azure AD Connect: Hardware and prerequisites](how-to-connect-install-prerequisites.md). 
- Make sure you have the accounts described in [Azure AD Connect accounts and permissions](reference-connect-accounts-permissions.md).

## Custom installation settings 

To set up a custom installation for Azure AD Connect, go through the pages that the following sections describe.

### Express Settings page
On this page, select **Customize** to start a customized-settings installation.  The remainder of this article guides you through the custom installation process.  You can use the following links to quickly go to the information for a particular page.

- [Install required components](#install-required-components)
- [Choose a user sign-in method](#user-sign-in)
- [Connect to Azure AD](#connect-to-azure-ad)
- [Pages in the Sync section](#pages-under-the-sync-section)

### Required Components page
When you install the synchronization services, you can leave the optional configuration section unselected. Azure AD Connect sets up everything automatically. It sets up a SQL Server 2012 Express LocalDB instance, creates the appropriate groups, and assign permissions. If you want to change the defaults, clear the appropriate boxes.  The following table summarizes these options and links to additional information. 

![Screenshot showing optional selections for the required installation components in Azure AD Connect.](./media/how-to-connect-install-custom/requiredcomponents2.png)

| Optional configuration | Description |
| --- | --- |
|Specify a custom installation location| Allows you to change the default installation path for Azure AD Connect.|
| Use an existing SQL Server |Allows you to specify the SQL Server name and instance name. Choose this option if you already have a database server that you want to use. For **Instance Name**, enter the instance name, a comma, and the port number if your SQL Server doesn't have browsing enabled.  Then specify the name of the Azure AD Connect database.  Your SQL privileges determine whether a new database will be created or your SQL administrator must create the database in advance.  If you have SQL server-administrator (SA) permissions, see [Install Azure AD Connect by using an existing database](how-to-connect-install-existing-database.md).  If you have been delegated permissions (DBO), see [Install Azure AD Connect by using SQL delegated administrator permissions](how-to-connect-install-sql-delegation.md). |
| Use an existing service account |By default. Azure AD Connect provides a virtual service account for the synchronization services to use. If you use a remote SQL server or use a proxy that requires authentication, you can use a *managed service account* or a password-protected service account in the domain. In those cases, enter the account you want to use. To run the installation, you need to be an SA in SQL so you can create sign-in credentials for the service account. For more information, see [Azure AD Connect accounts and permissions](reference-connect-accounts-permissions.md#adsync-service-account). </br></br>By using the latest build, the SQL administrator can now provision the database out of band. Then the Azure AD Connect administrator can install it with database owner rights.  For more information, see [Install Azure AD Connect by using SQL delegated administrator permissions](how-to-connect-install-sql-delegation.md).|
| Specify custom sync groups |By default, when the synchronization services are installed, Azure AD Connect creates four groups that are local to the server. These groups are Administrators, Operators, Browse, and Password Reset. You can specify your own groups here. The groups must be local on the server. They can't be located in the domain. |
|Import synchronization settings (preview)|Allows you to import settings from other versions of Azure AD Connect.  For more information, see [Importing and exporting Azure AD Connect configuration settings](how-to-connect-import-export-config.md).|

### User Sign-In page
After installing the required components, you select your users' single sign-on method. The following table briefly describes the available options. For a full description of the sign-in methods, see [User sign-in](plan-connect-user-signin.md).

![Screenshot that shows the "User Sign-in" page. The "Password Hash Synchronization" option is selected.](./media/how-to-connect-install-custom/usersignin4.png)

| Single sign-on option | Description |
| --- | --- |
| Password Hash Synchronization |Users can sign in to Microsoft cloud services, such as Microsoft 365, by using the same password they use in their on-premises network. User passwords are synchronized to Azure AD as a password hash. Authentication occurs in the cloud. For more information, see [Password hash synchronization](how-to-connect-password-hash-synchronization.md). |
|Pass-through authentication|Users can sign in to Microsoft cloud services, such as Microsoft 365, by using the same password they use in their on-premises network.  User passwords validated by being passed through to the on-premises Active Directory domain controller.
| Federation with AD FS |Users can sign in to Microsoft cloud services, such as Microsoft 365, by using the same password they use in their on-premises network.  Users are redirected to their on-premises Azure Directory Federation Services (AD FS) instance to sign in. Authentication occurs on-premises. |
| Federation with PingFederate|Users can sign in to Microsoft cloud services, such as Microsoft 365, by using the same password they use in their on-premises network.  The users are redirected to their on-premises PingFederate instance to sign in. Authentication occurs on-premises. |
| Do not configure |No user sign-in feature is installed or configured. Choose this option if you already have a third-party federation server or another existing solution in place. |
|Enable single sign-on|This option is available with both password hash sync and pass-through authentication. It provides a single sign-on experience for desktop users on corporate networks. For more information, see [Single sign-on](how-to-connect-sso.md). </br>**Note:** For AD FS customers, this option is not available. AD FS already offers the same level of single sign-on.</br>

### Connect to Azure AD page
On the Connect to Azure AD page, enter a global admin account and password. If you selected **Federation with AD FS** on the previous page, don't sign in with an account that's in a domain you plan to enable for federation. You might want to use an account in the default *onmicrosoft.com* domain, which comes with your Azure AD tenant.

This account is used only to create a service account in Azure AD. It's not used after the installation finishes.
  
![Screenshot showing the Connect to Azure AD tab selected on the left. On the right are a username field and a password field.](./media/how-to-connect-install-custom/connectaad.png)

If your global admin account has multifactor authentication enabled, you'll provide the password again in the sign-in window, and you must complete the multifactor authentication challenge. The challenge could be a verification code or a phone call.  

![Screenshot showing the Connect to Azure AD tab selected on the left. On the right is a multifactor authentication code field.](./media/how-to-connect-install-custom/connectaadmfa.png)

The global admin account can also have [privileged identity management](../privileged-identity-management/pim-getting-started.md) enabled.

If you get an error and have problems with connectivity, then see [Troubleshoot connectivity problems](tshoot-connect-connectivity.md).

## Sync pages

The following sections describe the pages in the Sync section.

### Connect Directories page
To connect to your Active Directory Domain Services (Azure AD DS), Azure AD Connect needs the forest name and credentials of an account that has sufficient permissions.

![Screenshot that shows the "Connect your directories" page.](./media/how-to-connect-install-custom/connectdir01.png)

After you enter the forest name and select  **Add Directory**, a window appears. The following table describes your options.

| Option | Description |
| --- | --- |
| Create new account | Select this option to create the Azure AD DS account that Azure AD Connect needs to connect to the AD forest during directory synchronization. After you select this option, enter the username and password for an enterprise admin account.  Azure AD Connect wizard uses the provided enterprise admin account to create the required Azure AD DS account. You can enter the domain part in either NetBios format or FQDN format. That is, enter *FABRIKAM\administrator* or *fabrikam.com\administrator*. |
| Use existing account | Select this option to provide an existing Azure AD DS account that Azure AD Connect can use to connect to the AD forest during directory synchronization. You can enter the domain part in either NetBios format or FQDN format. That is, enter *FABRIKAM\syncuser* or *fabrikam.com\syncuser*. This account can be a regular user account because it needs only the default read permissions. But depending on your scenario, you might need more permissions. For more information, see [Azure AD Connect accounts and permissions](reference-connect-accounts-permissions.md#create-the-ad-ds-connector-account). |

![Screenshot showing the Connect Directory page and the A D forest account window, where you can choose to create a new A D account or use an existing A D account.](./media/how-to-connect-install-custom/connectdir02.png)

>[!NOTE]
> As of build 1.4.18.0, enterprise admin accounts and domain admin accounts can't use an enterprise admin or domain admin account as the Azure AD DS connector account. When you select **Use existing account**, if you try to enter an enterprise admin account or a domain admin account, you see the following error:
>
>"Using  an Enterprise or Domain administrator account for your AD forest account is not allowed. Let Azure AD Connect create the account for you or specify a synchronization account with the correct permissions."

### Azure AD sign-in page
On the Azure AD sign-in configuration page, you review the user principal name (UPN) domains in on-premises Azure AD DS. These are UPN domains that have been verified in Azure AD. On this page, you configure the attribute to use for the userPrincipalName.

![Screenshot showing unverified domains.](./media/how-to-connect-install-custom/aadsigninconfig2.png)  

Review every domain that's marked as **Not Added** or **Not Verified**. Make sure that the domains you use have been verified in Azure AD. After you verify your domains, select the Refresh icon. For more information, see [Add and verify the domain](../fundamentals/add-custom-domain.md).

Users use the *userPrincipalName* attribute when they sign in to Azure AD and Microsoft 365. Azure AD should verify the domains, also known as the UPN-suffix, before users are synchronized. We recommend that you keep the default attribute userPrincipalName. 

If the userPrincipalName attribute is nonroutable and can't be verified, then you can select another attribute. You can, for example, select email as the attribute that holds the sign-in ID. When you use an attribute other than userPrincipalName, it's known as the *alternate ID*. 

The alternate ID attribute value must follow the RFC 822 standard. You can use an alternate ID with password hash sync, pass-through authentication, and federation. In Active Directory, the attribute can't be defined as multivalued, even if it has only a single value. For more information about the alternate ID, see [Pass-through authentication frequently asked questions](./how-to-connect-pta-faq.md#does-pass-through-authentication-support-alternate-id-as-the-username-instead-of-userprincipalname).

>[!NOTE]
> When you enable pass-through authentication, you must have at least one verified domain to continue through the custom installation process.

> [!WARNING]
> Alternate IDs aren't compatible with all Microsoft 365 workloads. For more information, see [Configuring alternate sign-in IDs](/windows-server/identity/ad-fs/operations/configuring-alternate-login-id).
>

### Domain and OU Filtering page
By default, all domains and organizational units (OUs) are synchronized. If you don't want to synchronize some domains or OUs to Azure AD, you can clear the selections for these domains and OUs.  

![Screenshot showing the Domain and O U filtering page.](./media/how-to-connect-install-custom/domainoufiltering.png)  

This page configures domain-based and OU-based filtering. If you plan to make changes, then see [Domain-based filtering](how-to-connect-sync-configure-filtering.md#domain-based-filtering) and [OU-based filtering](how-to-connect-sync-configure-filtering.md#organizational-unitbased-filtering). Some OUs are essential for functionality, so you should leave them selected.

If you use OU-based filtering with an Azure AD Connect version older than 1.1.524.0, new OUs are synchronized by default. If you don't want new OUs to be synchronized, then you can adjust the default behavior after the [OU-based filtering](how-to-connect-sync-configure-filtering.md#organizational-unitbased-filtering) step. For Azure AD Connect 1.1.524.0 or later, you can indicate whether you want new OUs to be synchronized.

If you plan to use [group-based filtering](#sync-filtering-based-on-groups), then make sure the OU with the group is included and is not filtered by using OU-filtering. OU filtering is evaluated before group-based filtering is evaluated.

It's also possible that some domains are unreachable because of firewall restrictions. These domains are unselected by default and display a warning.  

![Screenshot showing unreachable domains.](./media/how-to-connect-install-custom/unreachable.png)  

If you see this warning, make sure that these domains are indeed unreachable and that the warning is expected.

### Identifying users page

On the Identifying users page, choose how to identify users in your on-premises directories and how to identify them by using the sourceAnchor attribute.

#### Select how users should be identified in your on-premises directories
By using the *Matching across forests* feature, you can define how users from your Azure AD DS forests are represented in Azure AD. A user might be represented only once across all forests or might have a combination of enabled and disabled accounts. The user might also be represented as a contact in some forests.

![Screenshot showing the page where you can uniquely identify your users.](./media/how-to-connect-install-custom/unique2.png)

| Setting | Description |
| --- | --- |
| [Users are represented only once across all forests](plan-connect-topologies.md#multiple-forests-single-azure-ad-tenant) |All users are created as individual objects in Azure AD. The objects are not joined in the metaverse. |
| [Mail attribute](plan-connect-topologies.md#multiple-forests-single-azure-ad-tenant) |This option joins users and contacts if the mail attribute has the same value in different forests. Use this option when your contacts were created by using GALSync. If you choose this option, user objects whose mail attribute is unpopulated aren't synchronized to Azure AD. |
| [ObjectSID and msExchangeMasterAccountSID/ msRTCSIP-OriginatorSID attributes](plan-connect-topologies.md#multiple-forests-single-azure-ad-tenant) |This option joins an enabled user in an account forest with a disabled user in a resource forest. In Exchange, this configuration is known as a linked mailbox. You can use this option if you use only Lync and Exchange isn't present in the resource forest. |
| SAMAccountName and MailNickName attributes |This option joins on attributes where it's expected that the sign-in ID for the user can be found. |
| Choose a specific attribute |This option allows you to select your own attribute. If you choose this option, user objects whose (selected) attribute is unpopulated aren't synchronized to Azure AD. **Limitation:** Only attributes that are already in the metaverse are available for this option. |

#### Select how users should be identified by using a source anchor
The *sourceAnchor* attribute is immutable during the lifetime of a user object. It's the primary key that links the on-premises user with the user in Azure AD.

| Setting | Description |
| --- | --- |
| Let Azure manage the source anchor | Select this option if you want Azure AD to pick the attribute for you. If you select this option, Azure AD Connect applies the sourceAnchor attribute selection logic that's described in [Using ms-DS-ConsistencyGuid as sourceAnchor](plan-connect-design-concepts.md#using-ms-ds-consistencyguid-as-sourceanchor). After the custom installation finishes, you see which attribute was picked as the sourceAnchor attribute. |
| Choose a specific attribute | Select this option if you want to specify an existing AD attribute as the sourceAnchor attribute. |

Because the sourceAnchor attribute can't be changed, you must choose a good attribute. A good candidate is objectGUID. This attribute isn't changed unless the user account is moved between forests or domains. Don't choose attributes that would change when a person marries or changes assignments. 

You can't use attributes that include an at sign (@), so email and userPrincipalName can't be used. The attribute is also case sensitive, so when you move an object between forests, make sure to preserve the uppercase and lowercase. Binary attributes are Base64-encoded, but other attribute types remain in their unencoded state. 

In federation scenarios and some Azure AD interfaces, the sourceAnchor attribute is also known as *immutableID*. 

For more information about the source anchor, see [Design concepts](plan-connect-design-concepts.md#sourceanchor).

### Filtering page
The filtering-on-groups feature allows you to sync only a small subset of objects for a pilot. To use this feature, create a group for this purpose in your on-premises instance of Active Directory. Then add users and groups that should be synchronized to Azure AD as direct members. You can later add or remove users from this group to maintain the list of objects that should be present in Azure AD. 

All objects that you want to synchronize must be direct members of the group. Users, groups, contacts, and computers or devices must all be direct members. Nested group membership is not resolved. When you add a group as a member, only the group itself is added. Its members aren't added.

![Screenshot showing the page where you can choose how to filter users and devices.](./media/how-to-connect-install-custom/filter2.png)

> [!WARNING]
> This feature is intended to support only a pilot deployment. Don't use it in a full production deployment.
>

In a full production deployment, it will be hard to maintain a single group and all of its objects to synchronize. Instead, use one of the methods described in [Configure filtering](how-to-connect-sync-configure-filtering.md).

### Optional Features page
On this page, you can select optional features for your specific scenario.

>[!WARNING]
>Azure AD Connect versions 1.0.8641.0 and earlier rely on Azure Access Control Service for password writeback.  This service was retired on November 7, 2018.  If you are using any of these versions of Azure AD Connect and have enabled password writeback, users may lose the ability to change or reset their passwords once the service is retired. Password writeback with these versions of Azure AD Connect will not be supported.
>
>For more information on the Azure Access Control service see [How to: Migrate from the Azure Access Control service](../azuread-dev/active-directory-acs-migration.md)
>
>To download the latest version of Azure AD Connect click [here](https://www.microsoft.com/download/details.aspx?id=47594).

 ![Optional features](./media/how-to-connect-install-custom/optional2a.png)

> [!WARNING]
> If you currently have DirSync or Azure AD Sync active, do not activate any of the writeback features in Azure AD Connect.



| Optional features | Description |
| --- | --- |
| Exchange Hybrid Deployment |The Exchange Hybrid Deployment feature allows for the co-existence of Exchange mailboxes both on-premises and in Microsoft 365. Azure AD Connect is synchronizing a specific set of [attributes](reference-connect-sync-attributes-synchronized.md#exchange-hybrid-writeback) from Azure AD back into your on-premises directory. |
| Exchange Mail Public Folders | The Exchange Mail Public Folders feature allows you to synchronize mail-enabled Public Folder objects from your on-premises Active Directory to Azure AD. |
| Azure AD app and attribute filtering |By enabling Azure AD app and attribute filtering, the set of synchronized attributes can be tailored. This option adds two more configuration pages. For more information, see [Azure AD app and attribute filtering](#azure-ad-app-and-attribute-filtering). |
| Password hash synchronization |If you selected federation as the sign-in solution, then you can enable this option. Password hash synchronization can then be used as a backup option. For additional information, see [Password hash synchronization](how-to-connect-password-hash-synchronization.md). </br></br>If you selected Pass-through Authentication this option can also be enabled to ensure support for legacy clients and as a backup option. For additional information, see [Password hash synchronization](how-to-connect-password-hash-synchronization.md).|
| Password writeback |By enabling password writeback, password changes that originate in Azure AD is written back to your on-premises directory. For more information, see [Getting started with password management](../authentication/tutorial-enable-sspr.md). |
| Group writeback |If you use the **Microsoft 365 Groups** feature, then you can have these groups represented in your on-premises Active Directory. This option is only available if you have Exchange present in your on-premises Active Directory. For more information see [Azure AD Connect group writeback](how-to-connect-group-writeback.md)|
| Device writeback |Allows you to writeback device objects in Azure AD to your on-premises Active Directory for Conditional Access scenarios. For more information, see [Enabling device writeback in Azure AD Connect](how-to-connect-device-writeback.md). |
| Directory extension attribute sync |By enabling directory extensions attribute sync, attributes specified are synced to Azure AD. For more information, see [Directory extensions](how-to-connect-sync-feature-directory-extensions.md). |

### Azure AD Attributes page
If you want to limit which attributes to synchronize to Azure AD, then start by selecting which services you are using. If you make configuration changes on this page, a new service has to be selected explicitly by rerunning the installation wizard.

![Optional features Apps](./media/how-to-connect-install-custom/azureadapps2.png)

Based on the services selected in the previous step, this page shows all attributes that are synchronized. This list is a combination of all object types being synchronized. If there are some particular attributes you need to not synchronize, you can unselect those attributes.

![Optional features Attributes](./media/how-to-connect-install-custom/azureadattributes2.png)

> [!WARNING]
> Removing attributes can impact functionality. For best practices and recommendations, see [attributes synchronized](reference-connect-sync-attributes-synchronized.md#attributes-to-synchronize).
>
>

### Directory Extensions page
You can extend the schema in Azure AD with custom attributes added by your organization or other attributes in Active Directory. To use this feature, select **Directory Extension attribute sync** on the **Optional Features** page. You can select more attributes to sync on this page.

>[!NOTE]
>The Available attributes box is case sensitive.

![Directory extensions](./media/how-to-connect-install-custom/extension2.png)

For more information, see [Directory extensions](how-to-connect-sync-feature-directory-extensions.md).

### Single sign-on page
Configuring single sign-on for use with Password Synchronization or Pass-through authentication is a simple process that you only need to complete once for each forest that is being synchronized to Azure AD. Configuration involves two steps as follows:

1.	Create the necessary computer account in your on-premises Active Directory.
2.	Configure the intranet zone of the client machines to support single sign on.

#### Create the computer account in Active Directory
For each forest that has been added in Azure AD Connect, you will need to supply Domain Administrator credentials so that the computer account can be created in each forest. The credentials are only used to create the account and are not stored or used for any other operation. Simply add the credentials on the **Enable Single sign on** page as shown:

![Enable Single sign on](./media/how-to-connect-install-custom/enablesso.png)

>[!NOTE]
>You can skip a particular forest if you do not wish to use Single sign on with that forest.

#### Configure the Intranet Zone for client machines
To ensure that the client sign-ins automatically in the intranet zone you need to ensure that the URL is part of the intranet zone. This ensures that the domain joined computer automatically sends a Kerberos ticket to Azure AD when it is connected to the corporate network.
On a computer that has the Group Policy management tools.

1.	Open the Group Policy Management tools
2.	Edit the Group policy that will be applied to all users. For example, the Default Domain Policy.
3.	Navigate to **User Configuration\Administrative Templates\Windows Components\Internet Explorer\Internet Control Panel\Security Page** and select **Site to Zone Assignment List** per the image below.
4.	Enable the policy, and enter a value name of `https://autologon.microsoftazuread-sso.com` and value of `1` in the dialog box.
5.	It should look similar to the following:  
![Intranet Zones](./media/how-to-connect-install-custom/sitezone.png)

6.	Click **Ok** twice.

## Configuring federation with AD FS
Configuring AD FS with Azure AD Connect is simple and only requires a few clicks. The following is required before the configuration.

* A Windows Server 2012 R2 or later server for the federation server with remote management enabled
* A Windows Server 2012 R2 or later server for the Web Application Proxy server with remote management enabled
* A TLS/SSL certificate for the federation service name you intend to use (for example sts.contoso.com)

>[!NOTE]
>You can update a TLS/SSL certificate for your AD FS farm using Azure AD Connect even if you do not use it to manage your federation trust.

### AD FS configuration pre-requisites
To configure your AD FS farm using Azure AD Connect, ensure WinRM is enabled on the remote servers. Make sure you have completed the other tasks in [federation prerequisites](how-to-connect-install-prerequisites.md#prerequisites-for-federation-installation-and-configuration). In addition, go through the ports requirement listed in [Table 3 - Azure AD Connect and Federation Servers/WAP](reference-connect-ports.md#table-3---azure-ad-connect-and-ad-fs-federation-serverswap).

### Create a new AD FS farm or use an existing AD FS farm
You can use an existing AD FS farm or you can choose to create a new AD FS farm. If you choose to create a new one, you are required to provide the TLS/SSL certificate. If the TLS/SSL certificate is protected by a password, you are prompted for the password.

![AD FS Farm](./media/how-to-connect-install-custom/adfs1.png)

If you choose to use an existing AD FS farm, you are taken directly to the configuring the trust relationship between AD FS and Azure AD screen.

>[!NOTE]
>Azure AD Connect can be used to manage only one AD FS farm. If you have existing federation trust with Azure AD configured on the selected AD FS farm, the trust will be re-created again from scratch by Azure AD Connect.

### Specify the AD FS servers
Enter the servers that you want to install AD FS on. You can add one or more servers based on your capacity planning needs. Join all AD FS servers (not required for the WAP servers) to Active Directory before you perform this configuration. Microsoft recommends installing a single AD FS server for test and pilot deployments. Then add and deploy more servers to meet your scaling needs by running Azure AD Connect again after initial configuration.

> [!NOTE]
> Ensure that all your servers are joined to an AD domain before you do this configuration.
>
>

![AD FS Servers](./media/how-to-connect-install-custom/adfs2.png)

### Specify the Web Application Proxy servers
Enter the servers that you want as your Web Application proxy servers. The web application proxy server is deployed in your DMZ (extranet facing) and supports authentication requests from the extranet. You can add one or more servers based on your capacity planning needs. Microsoft recommends installing a single Web application proxy server for test and pilot deployments. Then add and deploy more servers to meet your scaling needs by running Azure AD Connect again after initial configuration. We recommend having an equivalent number of proxy servers to satisfy authentication from the intranet.

> [!NOTE]
> <li> If the account you use is not a local admin on the WAP servers, then you are prompted for admin credentials.</li>
> <li> Ensure that there is HTTP/HTTPS connectivity between the Azure AD Connect server and the Web Application Proxy server before you run this step.</li>
> <li> Ensure that there is HTTP/HTTPS connectivity between the Web Application Server and the AD FS server to allow authentication requests to flow through.</li>
>
>

![Web App](./media/how-to-connect-install-custom/adfs3.png)

You are prompted to enter credentials so that the web application server can establish a secure connection to the AD FS server. These credentials need to be a local administrator on the AD FS server.

![Proxy](./media/how-to-connect-install-custom/adfs4.png)

### Specify the service account for the AD FS service
The AD FS service requires a domain service account to authenticate users and lookup user information in Active Directory. It can support two types of service accounts:

* **Group Managed Service Account** - Introduced in Active Directory Domain Services with Windows Server 2012. This type of account provides services, such as AD FS, a single account without needing to update the account password regularly. Use this option if you already have Windows Server 2012 domain controllers in the domain that your AD FS servers belong to.
* **Domain User Account** - This type of account requires you to provide a password and regularly update the password when the password changes or expires. Use this option only when you do not have Windows Server 2012 domain controllers in the domain that your AD FS servers belong to.

If you selected Group Managed Service Account and this feature has never been used in Active Directory, you are prompted for Enterprise Admin credentials. These credentials are used to initiate the key store and enable the feature in Active Directory.

> [!NOTE]
> Azure AD Connect performs a check to detect if the AD FS service is already registered as a SPN in the domain.  Azure AD DS will not allow duplicate SPN’s to be registered at once.  If a duplicate SPN is found, you will not be able to proceed further until the SPN is removed.

![AD FS Service Account](./media/how-to-connect-install-custom/adfs5.png)

### Select the Azure AD domain that you wish to federate
This configuration is used to setup the federation relationship between AD FS and Azure AD. It configures AD FS to issue security tokens to Azure AD and configures Azure AD to trust the tokens from this specific AD FS instance. This page only allows you to configure a single domain in the initial installation. You can configure more domains later by running Azure AD Connect again.

![Screenshot that shows the "Azure AD Domain" page.](./media/how-to-connect-install-custom/adfs6.png)

### Verify the Azure AD domain selected for federation
When you select the domain to be federated, Azure AD Connect provides you with necessary information to verify an unverified domain. See [Add and verify the domain](../fundamentals/add-custom-domain.md) for how to use this information.

![Azure AD Domain](./media/how-to-connect-install-custom/verifyfeddomain.png)

> [!NOTE]
> AD Connect tries to verify the domain during the configure stage. If you continue to configure without adding the necessary DNS records, the wizard is not able to complete the configuration.
>
>

## Configuring federation with PingFederate
Configuring PingFederate with Azure AD Connect is simple and only requires a few clicks. However, the following prerequisites are required.
- PingFederate 8.4 or higher.  For more information see [PingFederate Integration with Azure Active Directory and Microsoft 365](https://docs.pingidentity.com/bundle/O365IG20_sm_integrationGuide/page/O365IG_c_integrationGuide.html)
- A TLS/SSL certificate for the federation service name you intend to use (for example sts.contoso.com)

### Verify the domain
After selecting Federation with PingFederate, you will be asked to verify the domain you want to federate.  Select the domain from the drop-down box.

![Screenshot that shows the "Azure AD Domain" with the example domain "contoso.com" selected.](./media/how-to-connect-install-custom/ping1.png)

### Export the PingFederate settings


PingFederate must be configured as the federation server for each federated Azure domain.  Click the Export Settings button and share this information with your PingFederate administrator.  The federation server administrator will update the configuration, then provide the PingFederate server URL and port number so Azure AD Connect can verify the metadata settings.  

![Verify Domain](./media/how-to-connect-install-custom/ping2.png)

Contact your PingFederate administrator to resolve any validation issues.  The following is an example of a PingFederate server that does not have a valid trust relationship with Azure:

![Trust](./media/how-to-connect-install-custom/ping5.png)




### Verify federation connectivity
Azure AD Connect will attempt to validate the authentication endpoints retrieved from the PingFederate metadata in the previous step.  Azure AD Connect will first attempt to resolve the endpoints using your local DNS servers.  Next it will attempt to resolve the endpoints using an external DNS provider.  Contact your PingFederate administrator to resolve any validation issues.  

![Verify Connectivity](./media/how-to-connect-install-custom/ping3.png)

### Verify federation login
Finally, you can verify the newly configured federated login flow by signing in to the federated domain. When this succeeds, the federation with PingFederate is successfully configured.
![Verify login](./media/how-to-connect-install-custom/ping4.png)

## Configure and verify pages
The configuration happens on this page.

> [!NOTE]
> Before you continue installation and if you configured federation, make sure that you have configured [Name resolution for federation servers](how-to-connect-install-prerequisites.md#name-resolution-for-federation-servers).
>
>


![Ready to configure](./media/how-to-connect-install-custom/readytoconfigure2.png)

### Staging mode
It is possible to setup a new sync server in parallel with staging mode. It is only supported to have one sync server exporting to one directory in the cloud. But if you want to move from another server, for example one running DirSync, then you can enable Azure AD Connect in staging mode. When enabled, the sync engine import and synchronize data as normal, but it does not export anything to Azure AD or AD. The features password sync and password writeback are disabled while in staging mode.

![Staging mode](./media/how-to-connect-install-custom/stagingmode.png)

While in staging mode, it is possible to make required changes to the sync engine and review what is about to be exported. When the configuration looks good, run the installation wizard again and disable staging mode. Data is now exported to Azure AD from this server. Make sure to disable the other server at the same time so only one server is actively exporting.

For more information, see [Staging mode](how-to-connect-sync-staging-server.md).

### Verify your federation configuration
Azure AD Connect verifies the DNS settings for you when you click the Verify button.

**Intranet connectivity checks**

* Resolve federation FQDN: Azure AD Connect checks if the  federation FQDN can be resolved by DNS to ensure connectivity. If Azure AD Connect cannot resolve the FQDN, the verification will fail. Ensure that a DNS record is present for the federation service FQDN in order to successfully complete the verification.
* DNS A record: Azure AD Connect checks if there is an A record for your federation service. In the absence of an A record, the verification will fail. Create an A record and not CNAME record for your federation FQDN in order to successfully complete the verification.

**Extranet connectivity checks**

* Resolve federation FQDN: Azure AD Connect checks if the  federation FQDN can be resolved by DNS to ensure connectivity.

![Complete](./media/how-to-connect-install-custom/completed.png)

![Verify](./media/how-to-connect-install-custom/adfs7.png)

To validate end-to-end authentication is successful you should manually perform one or more the following tests:

* Once synchronization in complete, use the Verify federated login additional task in Azure AD Connect to verify authentication for an on-premises user account of your choice.
* Validate that you can sign in from a browser from a domain joined machine on the intranet: Connect to https://myapps.microsoft.com and verify the sign-in with your logged in account. The built-in Azure AD DS administrator account is not synchronized and cannot be used for verification.
* Validate that you can sign in from a device from the extranet. On a home machine or a mobile device, connect to https://myapps.microsoft.com and supply your credentials.
* Validate rich client sign-in. Connect to https://testconnectivity.microsoft.com, choose the **Office 365** tab and chose the **Office 365 Single Sign-On Test**.

## Troubleshooting
The following section contains troubleshooting and information that you can use if you encounter an issue installing Azure AD Connect.

### “The ADSync database already contains data and cannot be overwritten”
When you custom install Azure AD Connect and select the option **Use an existing SQL server** on the **Install required components** page, you might encounter an error that states **The ADSync database already contains data and cannot be overwritten. Please remove the existing database and try again.**

![Screenshot that shows the "Install required components" page.](./media/how-to-connect-install-custom/error1.png)

This is because there is already an existing database named **ADSync** on the SQL instance of the SQL server, which you specified in the above textboxes.

This typically occurs after you have uninstalled Azure AD Connect.  The database will not be deleted from the SQL Server when you uninstall.

To fix this issue, first verify that the **ADSync** database that was used by Azure AD Connect prior to being uninstalled, is no longer being used.

Next, it is recommended that you backup the database prior to deleting it.

Finally, you need to delete the database.  You can do this by using **Microsoft SQL Server Management Studio** and connect to the SQL instance. Find the **ADSync** database, right click on it, and select **Delete** from the context menu.  Then click **OK** button to delete it.

![Error](./media/how-to-connect-install-custom/error2.png)

After you delete the **ADSync** database, you can click the **install** button, to retry installation.

## Next steps
After the installation has completed, sign out and sign in again to Windows before you use Synchronization Service Manager or Synchronization Rule Editor.

Now that you have Azure AD Connect installed you can [verify the installation and assign licenses](how-to-connect-post-installation.md).

Learn more about these features, which were enabled with the installation: [Prevent accidental deletes](how-to-connect-sync-feature-prevent-accidental-deletes.md) and [Azure AD Connect Health](how-to-connect-health-sync.md).

Learn more about these common topics: [scheduler and how to trigger sync](how-to-connect-sync-feature-scheduler.md).

Learn more about [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).