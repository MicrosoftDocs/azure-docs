<properties 
	pageTitle="Windows Authentication and Azure Multi-Factor Authentication Server" 
	description="This is the Azure Multi-factor authentication page that will assist in deploying Windows Authentication and Azure Multi-Factor Authentication Server." 
	services="multi-factor-authentication" 
	documentationCenter="" 
	authors="billmath" 
	manager="stevenpo" 
	editor="curtand"/>

<tags 
	ms.service="multi-factor-authentication" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="get-started-article" 
	ms.date="08/04/2016" 
	ms.author="billmath"/>

# Windows Authentication and Azure Multi-Factor Authentication Server

The Windows Authentication section allows the administrator to enable and configure Windows authentication for one or more applications.  The following is a list of things to keep in mind prior to setting up Windows Authentication.

-  reboot is needed before the Azure Multi-Factor Authentication for Terminal Services will be in effect.
-  If ‘Require Azure Multi-Factor Authentication user match’ is checked and you are not in the user list, you will not be able to log into the machine after reboot.
-  Trusted IPs is dependent on whether the application can provide the client IP with the authentication. Currently only Terminal Services is supported.  







>[AZURE.NOTE]This feature is not supported to secure Terminal Services on Windows Server 2012 R2.
 



## To secure an application with Windows Authentication, use the following procedure.

1. In the Azure Multi-Factor Authentication Server click the Windows Authentication icon.
![Windows Authentication](./media/multi-factor-authentication-get-started-server-windows/windowsauth.png)
2. Check the Enable Windows authentication checkbox. By default, this box is unchecked.
3. The Applications tab allows the administrator to configure one or more applications for Windows Authentication.
4. Select a server or application – specify whether the server/application is enabled. Click OK.
5. Click Add… button.
6. The Trusted IPs tab allows you to skip Azure Multi-Factor Authentication for Windows sessions originating from specific IPs. For example, if employees use the application from the office and from home, you may decide you don't want their phones ringing for Azure Multi-Factor Authentication while at the office. For this, you would specify the office subnet as Trusted IPs entry.
7. Click Add… button.
8. Select Single IP if you would like to skip a single IP address.
9. Select IP Range if you would like to skip an entire IP range. Example 10.63.193.1-10.63.193.100.
10. Select Subnet if you would like to specify a range of IPs using subnet notation. Enter the subnet's starting IP and pick the appropriate netmask from the drop-down list. 
11. Click the OK button.
