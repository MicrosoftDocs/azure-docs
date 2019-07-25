---
title: Azure AD Connect Health Version History
description: This document describes the releases for Azure AD Connect Health and what has been included in those releases.
services: active-directory
documentationcenter: ''
author: zhiweiwangmsft
manager: daveba
editor: curtand

ms.assetid: 8dd4e998-747b-4c52-b8d3-3900fe77d88f
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 03/20/2019
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Azure AD Connect Health: Version Release History
The Azure Active Directory team regularly updates Azure AD Connect Health with new features and functionality. This article lists the versions and features that have been released.  

> [!NOTE]
> Connect Health agents are updated automatically when new version is released. Please ensure the auto-upgrade settings is enabled from Azure portal. 
>

Azure AD Connect Health for Sync is integrated with Azure AD Connect installation. Read more about [Azure AD Connect release history](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-version-history)
For feature feedback, vote at [Connect Health User Voice channel](https://feedback.azure.com/forums/169401-azure-active-directory/filters/new?category_id=165591)


## May 2019
**Agent Update:** 
* Azure AD Connect Health agent for AD FS (version 3.1.51.0) 
   1. Bug fix to distinguish between multiple sign ins that share the same client-request-id.
   2. Bug fix to parse bad username/password errors on language localized servers.   

## April 2019
**Agent Update:** 
* Azure AD Connect Health agent for AD FS (version 3.1.46.0) 
   1. Fix Check Duplicate SPN alert process for ADFS

## March 2019
**Agent Update:** 
* Azure AD Connect Health agent for AD DS (version 3.1.41.0)  
   1. .NET version collection
   2. Improvement of performance counter collection when missing certain categories
   3. Bug fix on preventing spawning of multiple Monitoring Agent instances

* Azure AD Connect Health agent for AD FS (version 3.1.41.0) 
   1. Integrate and upgrade of AD FS test scripts using ADFSToolBox
   2. Implement .NET version collection
   3. Improvement of performance counter collection when missing certain categories
   4. Bug fix on preventing spawning of multiple Monitoring Agent instances


## November 2018
**New GA features:** 
* Azure AD Connect Health for Sync - Diagnose and remediate duplicated attribute sync errors from the portal

**Agent Update:** 
* Azure AD Connect Health agent for AD DS (version 3.1.24.0) 
   1. Transport Layer Security (TLS) protocol version 1.2 compliance and enforcement
   2. Reduce Global Catalog alert noise
   3. Health agent registration bug fixes

* Azure AD Connect Health agent for AD FS (version 3.1.24.0)  
   1. Transport Layer Security (TLS) protocol version 1.2 compliance and enforcement
   2. Support of Test-ADFSRequestToken for localized operating system
   3. Solved diagnostic agent EventHandler locking issue
   4. Health agent registration bug fixes

## August 2018 
*  Azure AD Connect Health agent for Sync (version 3.1.7.0) released with Azure AD Connect version 1.1.880.0    
   1. Hotfix for [high CPU issue of monitoring agent with .NET Framework KB releases](https://support.microsoft.com/help/4346822/high-cpu-issue-in-azure-active-directory-connect-health-for-sync)

## June 2018 
**New preview features:** 
* Azure AD Connect Health for Sync - Diagnose and remediate duplicated attribute sync errors from the portal 

**Agent Update:** 
* Azure AD Connect Health agent for AD DS (version 3.1.7.0)    
  1. Hotfix for [high CPU issue of monitoring agent with .NET Framework KB releases](https://support.microsoft.com/help/4346822/high-cpu-issue-in-azure-active-directory-connect-health-for-sync)
   
* Azure AD Connect Health agent for AD FS (version 3.1.7.0)  
  1. Hotfix for [high CPU issue of monitoring agent with .NET Framework KB releases](https://support.microsoft.com/help/4346822/high-cpu-issue-in-azure-active-directory-connect-health-for-sync)
  2. Test results fixes on ADFS Server 2016 secondary server
   
* Azure AD Connect Health agent for AD FS (version 3.1.2.0)  
  1. Hotfix for agent memory management and related alerts specifically for version 3.0.244.0


## May 2018
**Agent Update:**
* Azure AD Connect Health agent for AD DS (version 3.0.244.0)
  1. Agent privacy improvement  
  2. Bug fixes and general improvements

* Azure AD Connect Health agent for AD FS (version 3.0.244.0)
  1. Agent Diagnostics Service and related PowerShell module improvements
  2. Agent privacy improvement  
  3. Bug fixes and general improvements

* Azure AD Connect Health agent for Sync (version 3.0.164.0) released with Azure AD Connect version 1.1.819.0 
  1. Agent privacy improvement  
  2. Bug fixes and general improvements


## March 2018
**New preview features:**
* Azure AD Connect Health for AD FS - Risky IP report and alert.

**Agent Update:**

* Azure AD Connect Health agent for AD DS (version 3.0.176.0)
  1. Agent availability improvements 
  2. Bug fixes and general improvements
* Azure AD Connect Health agent for AD FS (version 3.0.176.0)
  1. Agent availability improvements 
  2. Bug fixes and general improvements
* Azure AD Connect Health agent for Sync (version 3.0.129.0) released with Azure AD Connect version 1.1.750.0  
  1. Agent availability improvements 
  2. Bug fixes and general improvements

## December 2017
**Agent Update:**

* Azure AD Connect Health agent for AD DS (version 3.0.145.0)
  1. Agent availability improvements 
  2. Added new agent troubleshooting commands
  3. Bug fixes and general improvements
* Azure AD Connect Health agent for AD FS (version 3.0.145.0)
  1. Added new agent troubleshooting commands
  2. Agent availability improvements 
  3. Bug fixes and general improvements
  
## October 2017
**Agent Update:**

 * Azure AD Connect Health agent for Sync (version 3.0.129.0) released with Azure AD Connect version 1.1.649.0
<br></br> Fixed a version compatibility issue between Azure AD Connect and Azure AD Connect Health Agent for Sync. This issue affects customers who are performing Azure AD Connect in-place upgrade to version 1.1.647.0, but currently has Health Agent version 3.0.127.0. After the upgrade, the Health Agent can no longer send health data about Azure AD Connect Synchronization Service to Azure AD Health Service. With this fix, Health Agent version 3.0.129.0 is installed during Azure AD Connect in-place upgrade. Health Agent version 3.0.129.0 does not have compatibility issue with Azure AD Connect version 1.1.649.0.

## July 2017
**Agent Update:**

* Azure AD Connect Health agent for AD DS (version 3.0.68.0)
  1. Bug fixes and general improvements
  2. Sovereign cloud support
* Azure AD Connect Health agent for AD FS (version 3.0.68.0)
  1. Bug fixes and general improvements
  2. Sovereign cloud support
* Azure AD Connect Health agent for Sync (version 3.0.68.0) released with Azure AD Connect version 1.1.614.0
  1. Support for Microsoft Azure Government Cloud and Microsoft Cloud Germany

## April 2017      
**Agent Update:**

* Azure AD Connect Health agent for AD FS (version 3.0.12.0)
  1. Bug fixes and general improvements
* Azure AD Connect Health agent for AD DS (version 3.0.12.0)
  1. Performance counters upload improvements
  2. Bug fixes and general improvements

## October 2016
**Agent Update:**

* Azure AD Connect Health agent for AD FS (version 2.6.408.0)
* Improvements in detecting client IP addresses in authentication requests
* Bug Fixes related to Alerts
* Azure AD Connect Health agent for AD DS (version 2.6.408.0)
* Bug fixes related to Alerts.
* Azure AD Connect Health agent for Sync (version 2.6.353.0) released with Azure AD Connect version 1.1.281.0
* Provide the required data for the Synchronization Error Reports
* Bug fixes related to Alerts

**New preview features:**

* Synchronization Error Reports for Azure AD Connect

**New features:**

* Azure AD Connect Health for AD FS - IP address field is available in the report about top 50 users with bad username/password.

## July 2016
**New preview features:**

* [Azure AD Connect Health for AD DS](how-to-connect-health-adds.md).

## January 2016
**Agent Update:**

* Azure AD Connect Health agent for AD FS (version 2.6.91.1512)

**New features:**

* [Test Connectivity Tool for Azure AD Connect Health Agents](how-to-connect-health-agent-install.md#test-connectivity-to-azure-ad-connect-health-service)

## November 2015
**New features:**

* Support for [Role Based Access Control](how-to-connect-health-operations.md#manage-access-with-role-based-access-control)

**New preview features:**

* [Azure AD Connect Health for sync](how-to-connect-health-sync.md).

**Fixed issues:**

* Bug fixes for errors seen during agent registrations.

## September 2015
**New features:**

* Wrong Username password report for AD FS
* Support to configure Unauthenticated HTTP Proxy
* Support to configure agent on Server core
* Improvements to Alerts for AD FS
* Improvements in Azure AD Connect Health Agent for AD FS for connectivity and data upload.

**Fixed issues:**

* Bug fixes in Usage Insights for AD FS Error types.

## June 2015
**Initial release of Azure AD Connect Health for AD FS and AD FS Proxy.**

**New features:**

* Alerts for monitoring AD FS and AD FS Proxy servers with email notifications.
* Easy access to AD FS topology and patterns in AD FS Performance Counters.
* Trend in successful token requests on AD FS servers grouped by Applications, Authentication Methods, Request Network Location etc.
* Trends in failed request on AD FS servers grouped by Applications, Error Types etc.
* Simpler Agent Deployment using Azure AD Global Admin credentials.  

## Next steps
Learn more about [Monitor your on-premises identity infrastructure and synchronization services in the cloud](whatis-hybrid-identity-health.md).

