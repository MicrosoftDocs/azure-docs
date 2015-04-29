<properties 
	pageTitle="How Azure AD Connect Works" 
	description="Learn about how Azure AD Connect Works." 
	services="active-directory" 
	documentationCenter="" 
	authors="billmath" 
	manager="terrylan" 
	editor="lisatoft"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/02/2015" 
	ms.author="billmath"/>

# How Azure AD Connect Works

Azure Active Directory Connect is made up of three primary parts that make up Azure Active Directory Connect.  They are the synchronization services, the optional Active Directory Federation Services piece, and the monitoring piece which is done using Azure AD Connect Health.


<center>![Azure AD Connect Stack](./media/active-directory-aadconnect-howitworks/AADConnectStack.png)
</center>

- Synchronization - This part is made up of the the components and functionality previously released as Dirsync and AAD Sync.  This is the part that is responsible for creating users and groups.  It is also responsible for making sure that the information on users and groups in your on-premises environment, matches in the cloud.
- AD FS - This is an optional part of Azure AD Connect and can be used to setup a hybrid environment using an on-premises AD FS infrastructure.  This part can be used by organization's to address complex deployments that include such things as domain join SSO, Enforcement of AD login policy and smart card or 3rd party MFA.  For additional information on configuring SSO see [DirSync with Single-Sign On](https://msdn.microsoft.com/library/azure/dn441213.aspx).
- Health Monitoring - For complex deployments using AD FS, Azure AD Connect Health can provide robust monitoring of your federation servers and provide a central location in the Azure portal to view this activity.  For additional information see [Azure Active Directory Connect Health](https://msdn.microsoft.com/library/azure/dn906722.aspx).






**Additional Resources**

* [Use your on-premises identity infrastructure in the cloud](active-directory-aadconnect.md)
* [Getting started with Azure AD Connect](active-directory-aadconnect-getstarted.md)
* [Manage Azure AD Connect](active-directory-aadconnect-manage.md)
* [Azure AD Connect on MSDN](https://msdn.microsoft.com/library/azure/dn832695.aspx)