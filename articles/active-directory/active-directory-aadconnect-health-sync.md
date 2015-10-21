
<properties 
	pageTitle="Using Azure AD Connect Health with Sync | Microsoft Azure" 
	description="This is the Azure AD Connect Health page that will discuss how to monitor Azure AD Connect Synch Services." 
	services="active-directory" 
	documentationCenter="" 
	authors="billmath" 
	manager="stevenpo" 
	editor="curtand"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="get-started-article" 
	ms.date="09/25/2015" 
	ms.author="billmath"/>

# Using Azure AD Connect Health for Sync Services
The following documentation is specific to monitoring Azure AD Connect Sync Services with Azure AD Connect Health.  For information on monitoring AD FS with Azure AD Connect Health see [Using Azure AD Connect Health with AD FS](active-directory-aadconnect-health-adfs.md).

![Azure AD Connect Health for Sync](./media/active-directory-aadconnect-health-sync/sync.png)

## Installing Azure AD Connect Health for Synch Services
The Azure AD Connect Health Agent for Sync Services is installed automatically in the latest build of Azure AD Connect.  To use Azure AD Connect for Sync Services you will need to download the latest version of Azure AD Connect and install it.  You can download the latest version [here](http://www.microsoft.com/download/details.aspx?id=47594).

To verify the agent has been installed, open services and look for the following. These services should be running if you completed the configuration. Otherwise, they will not start until the configuration is complete.

- Azure AD Connect Health AadSync Insights Service
- Azure AD Connect Health AadSync Monitoring Service
 
![Verify Azure AD Connect Health for Sync](./media/active-directory-aadconnect-health-sync/services.png)

>[Azure.NOTE} Remember that using Azure AD Connect Health requires Azure AD Premium.  If you do not have Azure AD Premium you will not be able to complete the configuration in the Azure portal.  For more information see the requirements [here](active-directory-aadconnect-health.md#requirements). 

## Alerts for Sync Services
The Azure AD Connect Health Alerts for Synch Services section provides you the list of active alerts. Each alert includes relevant information, resolution steps, and links to related documentation. By selecting an active or resolved alert you will see a new blade with additional information, as well as steps you can take to resolve the alert, and links to additional documentation. You can also view historical data on alerts that were resolved in the past.

By selecting an alert you will be provided with additional information as well as steps you can take to resolve the alert and links to additional documentation.

![Azure AD Connect Health Portal](./media/active-directory-aadconnect-health-sync/alerts.png)

## Related links

* [Azure AD Connect Health](active-directory-aadconnect-health.md)
* [Azure AD Connect Health Operations](active-directory-aadconnect-health-operations.md)
* [Using Azure AD Connect Health with AD FS](active-directory-aadconnect-health-adfs.md)
* [Azure AD Connect Health FAQ](active-directory-aadconnect-health-faq.md)