<properties 
	pageTitle="Connect your directories with Azure AD Connect" 
	description="Custom settings description of Azure AD Connect connected directories." 
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



# Connect your directories with Azure AD Connect

For Custom Settings, an enterprise administrator account is not required to connect to your Active Directory forests.  The wizard will accept a domain or local user account.  However, the account is used as the local AD Connector account, that is, it is the account that reads and writes the directory information for synchronization.

This means you will need to assign additional permissions to enable the following scenarios: 

Scenario  |Permission
------------- | ------------- |
Password Sync| <li>Replicate Directory Changes.</li>  <li>Replicate Directory Changes All.</li>
Exchange Hybrid Deployment|See [Office 365 Exchange Hybrid AAD Sync write-back attributes and permissions](https://msdn.microsoft.com/library/azure/dn757602.aspx#exchange).
Password Write-back | <li>Change Password</li><li>Reset password</li>
User, Group, and Device Write-back|Write permissions to the directory objects and attributes that you wish to 'write-back'
Single Sign-On and AD FS| Domain admin permissions in the domain in which your federated servers are located.





**Additional Resources**

* [More on Azure AD Connect accounts and permissions](active-directory-aadconnect-account-summary.md)
* [Permissions for password synchronization](https://msdn.microsoft.com/library/azure/dn757602.aspx#psynch)
* [Permissions for Exchange Hybrid](https://msdn.microsoft.com/library/azure/dn757602.aspx#exchange)
* [Permissions for password writeback](https://msdn.microsoft.com/library/azure/dn757602.aspx#pwriteback)
* [Custom installation of Azure AD Connect](active-directory-aadconnect-get-started-custom.md)
* [Azure AD Connect on MSDN](https://msdn.microsoft.com/library/azure/dn832695.aspx)
