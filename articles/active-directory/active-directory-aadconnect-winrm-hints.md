<properties 
	pageTitle="Azure AD Connect - Windows Remote Managed Hints" 
	description="Azure AD Connect Windows Remote Managed hints for using with AD FS." 
	services="active-directory" 
	documentationCenter="" 
	authors="billmath" 
	manager="swadhwa" 
	editor="curtand"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/28/2015" 
	ms.author="billmath"/>

# Azure AD Connect - Windows Remote Managed Hints


When using Azure AD Connect to deploy Active Directory Federation Services or the Web Application Proxy, check the requirements below hints to ensure connectivity and configuration will succeed: 

- If the target server is domain joined, ensure that Windows Remote Managed is enabled 
	* In an elevated PSH command window, use command “Enable-PSRemoting –force” 

- If the target server is a non domain joined WAP machine, there are a couple of additional requirements 
	- On the target machine (WAP machine):” 

- Ensure the winrm (Windows Remote Management / WS-Management) service is running via the Services snap-in 

- In an elevated PSH command window, use command “Enable-PSRemoting –force” 
	- On the machine on which the wizard is running (if the target machine is non domain joined or untrusted domain): 

- In an elevated PSH command window, use the command “Set-Item WSMan:\localhost\Client\TrustedHosts –Value <DMZServerFQDN> -Force –Concatenate” 
	- In Server Manager:
		- add DMZ WAP host to machine pool (server manager -> Manage -> Add Servers...use DNS tab) 
		- Server Manager All Servers tab: right click WAP server and choose Manage As..., enter local (not domain) creds for the WAP machine 
		- To validate remote PSH connectivity, in the Server Manager All Servers tab: right click WAP server and choose Windows PowerShell.  A remote PSH session should open to ensure remote PowerShell sessions can be established. 

**Additional Resources**


* [More on Azure AD Connect accounts and permissions](active-directory-aadconnect-account-summary.md)
* [Custom installation of Azure AD Connect](active-directory-aadconnect-get-started-custom.md)
* [Azure AD Connect on MSDN](https://msdn.microsoft.com/library/azure/dn832695.aspx) 