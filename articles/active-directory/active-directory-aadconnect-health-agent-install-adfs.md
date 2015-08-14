<properties 
	pageTitle="Azure AD Connect Health AD FS Agent installation." 
	description="This is the Azure AD Connect Health page that describes the ad fs agent installation." 
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
	ms.date="08/14/2015" 
	ms.author="billmath"/>






# Azure AD Connect Health Agent Installation for AD FS

This document will walk you through installing and configuring the Azure AD Connect Health Agent for AD FS on your servers. 

>[AZURE.NOTE]Remember that before you see any data in your instance of Azure AD Connect Health, you will need to install the Azure AD Connect Health Agent on your targeted servers.  Be sure to complete the requirements [here](active-directory-aadconnect-health.md#requirements) prior to installing the agent.  You can download the agent [here](http://go.microsoft.com/fwlink/?LinkID=518973).


## Agent installation
To start the agent installation, double-click on the .exe file that you downloaded. On the first screen, click Install.

![Verify Azure AD Connect Health](./media/active-directory-aadconnect-health-requirements/install1.png)

Once the installation is finished, click Configure Now.

![Verify Azure AD Connect Health](./media/active-directory-aadconnect-health-requirements/install2.png)

This will launch a command prompt followed by some PowerShell that will execute Register-AzureADConnectHealthADFSAgent. You will be prompted to sign in to Azure. Go ahead and sign in.

![Verify Azure AD Connect Health](./media/active-directory-aadconnect-health-requirements/install3.png)


After signing in, PowerShell will continue. Once it completes you can close PowerShell and the configuration is complete.

At this point, the services should be started automatically and the agent will be now monitoring and gathering data.  Be aware that you will see warnings in the PowerShell window if you have not met all of the pre-requisites that were outlined in the previous sections. Be sure to complete the requirements [here](active-directory-aadconnect-health.md#requirements) prior to installing the agent. The following screenshot below is an example of these errors.

![Verify Azure AD Connect Health](./media/active-directory-aadconnect-health-requirements/install4.png)

To verify the agent has been installed, open services and look for the following. These services should be running if you completed the configuration. Otherwise, they will not start until the configuration is complete.

- Azure AD Connect Health AD FS Diagnostics Service
- Azure AD Connect Health AD FS Insights Service
- Azure AD Connect Health AD FS Monitoring Service
 
![Verify Azure AD Connect Health](./media/active-directory-aadconnect-health-requirements/install5.png)


## Agent installation on Windows Server 2008 R2 Servers

For Windows Server 2008 R2 servers do the following:

1. Ensure that the server is running at Service Pack 1 or higher.
1. Turn off IE ESC for agent installation:
1. Install Windows PowerShell 4.0 on each of the servers prior to installing the AD Health agent.  To install Windows PowerShell 4.0:
 - Install [Microsoft .NET Framework 4.5](https://www.microsoft.com/download/details.aspx?id=40779) using the following link to download the offline installer.
 - Install PowerShell ISE (From Windows Features)
 - Install the [Windows Management Framework 4.0.](https://www.microsoft.com/download/details.aspx?id=40855)
 - Install Internet Explorer version 10 or above on the server. This is required by the Health Service to authenticate you using your Azure Admin credentials.
1. For additional information on installing Windows PowerShell 4.0 on Windows Server 2008 R2 see the wiki article [here](http://social.technet.microsoft.com/wiki/contents/articles/20623.step-by-step-upgrading-the-powershell-version-4-on-2008-r2.aspx).

## Related links

* [Azure AD Connect Health](active-directory-aadconnect-health.md)
* [Azure AD Connect Health Operations](active-directory-aadconnect-health-operations.md)
* [Using Azure AD Connect Health with AD FS](active-directory-aadconnect-health-adfs.md)
* [Azure AD Connect Health FAQ](active-directory-aadconnect-health-faq.md)