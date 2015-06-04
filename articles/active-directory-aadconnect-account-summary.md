<properties 
	pageTitle="More about Azure AD Connect credentials and permissions" 
	description="Custom settings description of Azure AD Connect credentials and permissions." 
	services="active-directory" 
	documentationCenter="" 
	authors="billmath" 
	manager="terrylan" 
	editor="bryanla"/>

<tags 
	ms.service="azure-active-directory-connect" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/28/2015" 
	ms.author="billmath"/>



# More about Azure AD Connect credentials and permissions 


The Azure AD Connect wizard offers two different paths with distinct permissions requirements:  

* In Express Settings, we require more privileges so that we can setup your configuration easily, without requiring you to create users or configure permissions separately. 

* In Custom Settings we offer you more choices and options, but there are some situations in which you’ll need to ensure you have the correct permissions yourself. 

The following table is a summary of the credentials that are collected and what they are used for in an express setup.

Wizard Page  | Credentials Collected | Permissions Required| Used For 
------------- | ------------- |------------- |------------- |
Connect to Azure AD| Azure AD directory credentials | Global administrator role in Azure AD | <li>Enabling sync in the Azure AD directory.</li>  <li>Creation of the Azure AD account that will be used for on-going sync operations in Azure AD.</li>
Connect to AD DS | On-premises Active Directory credentials | Member of the Enterprise Admins (EA) group in Active Directory|  <li>Creation of the local AD account that will be used for reading objects and attributes from the local AD for ongoing sync operation.</li> <li> Assigning the correct permissions and access control settings for sync and password sync to the above account and to AD.</li> 
NA|Logon credentials of the user running the wizard| Administrator of the local server|The wizard creates the AD account that will be used as the sync service logon account on the local machine.

<br>
<br>

The following table is a summary of the credentials that are collected and what they are used for in an express setup.


Wizard Page  | Credentials Collected | Permissions Required| Used For 
------------- | ------------- |------------- |------------- |
Connect to Azure AD| Azure AD directory credentials | Global administrator role in Azure AD | <li>Enabling sync in the Azure AD directory.</li>  <li>Creation of the Azure AD account that will be used for on-going sync operations in Azure AD.</li>
Connect to AD DS | On-premises Active Directory credentials | Member of the Enterprise Admins (EA) group in Active Directory|  <li>Creation of the local AD account that will be used for reading objects and attributes from the local AD for ongoing sync operation.</li> <li> Assigning the correct permissions and access control settings for sync and password sync to the above account and to AD.</li> 
NA|Logon credentials of the user running the wizard| Administrator of the local server|The wizard creates the AD account that will be used as the sync service logon account on the local machine.

<br>
<br>
The following table is a summary of the credentials that are collected and what they are used for in an express setup.

Wizard Page  | Credentials Collected | Permissions Required| Used For 
------------- | ------------- |------------- |------------- |
NA|Logon credentials of the user running the wizard|Administrator of the local server| <li>By default, wizard creates the AD account that will be used as the sync service logon account on the local machine</li><li>We only create the sync service logon account if the admin does not specify a particular account</li> <li>The account is a local user unless on a DC in which case the account is a domain user</li> 
Install synchronization services page, Service account option | AD or local user account credentials | Local user|If the admin specifies an account, this account is used as the logon account for the sync service.
Connect to Azure AD|Azure AD directory credentials| Global administrator role in Azure AD|The wizard creates the AD account that will be used as the sync service logon account on the local machine.
Connect your directories|On premises Active Directory credentials for each forest that will be connected to Azure AD |<li>The minimum level of permissions required by the wizard is Domain user.</li> <li>However, the specified account must have the permissions required for your intended scenario.</li><li>If you intend to configure password sync to Azure AD, ensure this account has the following permissions assigned: -Replicating Directory Changes  -Replicating Directory Changes All</li> <li>If you intend to configure sync to ‘write back’ information from Azure AD to your local AD, ensure the account has write permissions to the directory objects and attributes you intend to be written back.</li> <li>If you intend to configure AD FS for Sign on, ensure the AD credentials you provide for the forest in which your AD FS servers reside has Domain Administrator privileges.</li><li>See the table below of a list of additional requirements for your scenario.</li>|<li>Creation of the local AD Management Agent (MA) account, the account that will be used for reading and writing objects and attributes in the local AD for ongoing sync operation.</li><li>Assigning the correct permissions and access control settings for your chosen sync options to the above account and to AD.</li>
AD FS Servers|For each server in the list, the wizard collects credentials if the logon credentials of the user running the wizard are insufficient to connect|Domian Administrator|Installation and configuration of the AD FS server role.|
Web application proxy servers |For each server in the list, the wizard collects credentials if the logon credentials of the user running the wizard are insufficient to connect|Local admin on the target machine.|Installation and configuration of WAP server role.
Proxy trust credentials |Federation service trust credentials (the credentials the proxy will use to enroll for a trust certificate from the FS |Domain account that is a local administrator of the AD FS server|Inital enrollment of FS-WAP trust certificate
AD FS Service Account page, "Use a domain user account option"|AD user account credentials|Domain user|The AD user account whose credentials are provided will be used as the logon account of the AD FS service.



<br>
<br>
The following table is a summary of the permissions that are required for specific scenarios.

Scenario  |Permission
------------- | ------------- |
Password Sync| <li>Replicate Directory Changes.</li>  <li>Replicate Directory Changes All.</li>
Exchange Hybrid Deployment|See [Office 365 Exchange Hybrid AAD Sync write-back attributes and permissions](https://msdn.microsoft.com/library/azure/dn757602.aspx#exchange).
Password Write-back | <li>Change Password</li><li>Reset password</li>
User, Group, and Device Write-back|Write permissions to the directory objects and attributes that you wish to 'write-back'
Single Sign-On and AD FS| Domain admin permissions in the domain in which your federated servers are located.

<br>
<br>
The following table is a summary of the accounts that are created by Azure AD Connect.



Account created |Permissions assigned | Used for
------------- | ------------- |------------- |
Azure AD account for sync| Global Administrator|On-going sync operations (Azure AD MA account)
Express Settings:  AD account used for sync|Read/write permissions on the directory as required for sync+password sync|On-going sync operations (Azure AD MA account)
Express Settings: sync service logon account | Logon credentials of the user running the wizard|Sync service logon account
Custom Settings: sync service logon account |NA|Sync service logon account
AD FS:GMSA account (aadcsvc$)|Domain user|FS service logon account


**Additional Resources**



* [Permissions for password synchronization](https://msdn.microsoft.com/library/azure/dn757602.aspx#psynch)
* [Permissions for Exchange hybrid](https://msdn.microsoft.com/library/azure/dn757602.aspx#exchange)
* [Permissions for password writeback](https://msdn.microsoft.com/library/azure/dn757602.aspx#pwriteback)
* [Custom installation of Azure AD Connect](active-directory-aadconnect-get-started-custom.md)
* [Azure AD Connect on MSDN](https://msdn.microsoft.com/library/azure/dn832695.aspx)
