<properties 
	pageTitle="Configure Group Policy for registering Windows 10 domain joined computers as devices| Microsoft Azure" 
	description="A topic that explains how administrators can configure group policies so that users can register Windows 10 computers as devices." 
	services="active-directory" 
	documentationCenter="" 
	authors="femila" 
	manager="stevenpo" 
	editor=""
	tags="azure-classic-portal"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/30/2015" 
	ms.author="femila"/>

# Configure Group Policy for registering Windows 10 domain joined computers as devices

In Windows 10, end-users can join their device to Azure AD in the out-of-box experience (OOBE). This will allow organizations to distribute shrink-wrapped devices to their employees or students, or let them choose their own device (CYOD).
If you install either the Professional or Enterprise SKU for Windows 10, the experience defaults to the setup for company-owned devices.

To configure the group policy for registering Windows 10 devices
-----------------------------------------------------------------------

1. 	Open Server Manager and navigate to **Tools** > **Group Policy Management**.
2.	From Group Policy Management, navigate to the domain node that corresponds to the domain in which you would like to enable Azure AD Join.
3.	Right-click **Group Policy Objects** and select **New**. Give your Group Policy object a name, for example, Automatic Azure AD Join. Click **OK**.
4.	Right-click on your new Group Policy object and then select **Edit**.
5.	Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > Azure AD Join.
6.	Right-click Automatically Azure AD join client computers and then select **Edit**.
7.	Select the **Enabled** radio button and then click **Apply**. Click **OK**.
8.	You may now link the Group Policy object to a location of your choice. To enable this policy for all of the domain joined Windows 10 devices at your organization, link the Group Policy to the domain.

## Additional Information
* [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-user-upgrade.md)
* [Learn about usage scenarios for Azure AD Join](active-directory-azureadjoin-deployment-aadjoindirect.md)
* [Set up Azure AD Join](active-directory-azureadjoin-setup.md)
