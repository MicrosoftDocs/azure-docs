<properties 
	pageTitle="Azure AD Connect Health Version History" 
	description="This document describes the releases for Azure AD Connect Health and what has been included in those releases." 
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
	ms.topic="article" 
	ms.date="07/14/2016" 
	ms.author="billmath"/>

# Azure AD Connect Health: Version Release History

The Azure Active Directory team regularly updates Azure AD Connect Health with new features and functionality. 

This article is designed to help you keep track of the versions that have been released.


## July 2016

**New preview features:**

- [Azure AD Connect Health for AD DS](active-directory-aadconnect-health-adds.md).


## January 2016


**Agent Update:**

- Azure AD Connect Health agent for AD FS (version 2.6.91.1512)


**New features:**

- [Test Connectivity Tool for Azure AD Connect Health Agents](active-directory-aadconnect-health-agent-install.md#test-connectivity-to-azure-ad-connect-health-service)


## November 2015


**New features:**

- Support for [Role Based Access Control](active-directory-aadconnect-health-operations.md#manage-access-with-role-based-access-control)


**New preview features:**

- [Azure AD Connect Health for sync](active-directory-aadconnect-health-sync.md).

**Fixed issues:**

- Bug fixes for errors seen during agent registrations. 

## September 2015

**New features:**

- Wrong Username password report for AD FS 
- Support to configure Unauthenticated HTTP Proxy 
- Support to configure agent on Server core
- Improvements to Alerts for AD FS 
- Improvements in Azure AD Connect Health Agent for AD FS for connectivity and data upload. 


**Fixed issues:**

- Bug fixes in Usage Insights for AD FS Error types. 


## June 2015

**Initial release of Azure AD Connect Health for AD FS and AD FS Proxy.**

**New features:**

- Alerts for monitoring AD FS and AD FS Proxy servers with email notifications. 
- Easy access to AD FS topology and patterns in AD FS Performance Counters. 
- Trend in successful token requests on AD FS servers grouped by Applications, Authentication Methods, Request Network Location etc. 
- Trends in failed request on AD FS servers grouped by Applications, Error Types etc.
- Simpler Agent Deployment using Azure AD Global Admin credentials.  




## Next steps
Learn more about [Monitor your on-premises identity infrastructure and synchronization services in the cloud](active-directory-aadconnect-health.md).
