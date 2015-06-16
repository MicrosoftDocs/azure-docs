<properties 
	pageTitle="Why we require an enterprise administrator account" 
	description="Custom settings description." 
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

# Why we require an enterprise administrator account for connecting to AD DS when setting up Azure AD Connect

The following table shows the reasons an enterprise administrator account is required for setting up Azure AD Connect.

Under the following conditions  | Description 
------------- | ------------- |
For Express Settings and DirSync Upgrade | <li>For Express Settings, we create the local Active Directory account that is used for sync  (otherwise known as the AD Connector account) and assign the correct permissions for sync and password sync</li> <li>For Dirsync upgrade, we reset the password on the currently configured AD Connector account and configure the new Azure AD Connect sync service to use this account. </li>



**Additional Resources**


* [More on Azure AD Connect accounts and permissions](active-directory-aadconnect-account-summary.md)
* [Custom installation of Azure AD Connect](active-directory-aadconnect-get-started-custom.md)
* [Azure AD Connect on MSDN](https://msdn.microsoft.com/library/azure/dn832695.aspx)