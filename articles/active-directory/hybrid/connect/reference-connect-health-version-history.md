---
title: Microsoft Entra Connect Health Version History
description: This document describes the releases for Microsoft Entra Connect Health and what has been included in those releases.
services: active-directory
documentationcenter: ''
author: zhiweiwangmsft
manager: amycolannino

ms.assetid: 8dd4e998-747b-4c52-b8d3-3900fe77d88f
ms.service: active-directory
ms.subservice: hybrid
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: reference
ms.date: 01/19/2023
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Microsoft Entra Connect Health: Version Release History
The Microsoft Entra team regularly updates Microsoft Entra Connect Health with new features and functionality. This article lists the versions and features that have been released.  

> [!NOTE]
> Microsoft Entra Connect Health agents are updated automatically when new version is released.
>

Microsoft Entra Connect Health for Sync is integrated with Microsoft Entra Connect installation. Read more about [Microsoft Entra Connect release history](./reference-connect-version-history.md)
For feature feedback, vote at [Connect Health User Voice channel](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789)

## May / June 2023
**Agent Updates**

Microsoft Entra Connect Health ADFS Agents (versions 4.5.x)

- New version of the Microsoft Entra Connect Health ADFS agent that uses an updated architecture.
  - Updated installer package
  - Migration to MSAL authentication library
  - New pre-requisite checks
  - Improved logging

## 27 March 2023
**Agent Update**

Microsoft Entra Connect Health AD DS and ADFS Health Agents (version 3.2.2256.26, Download Center Only)

- We created a fix for so that the agents would be FIPS compliant
  - the change was to have the agents use ‘CloudStorageAccount.UseV1MD5 = false’ so the agent only uses only FIPS compliant cryptography, otherwise Azure blob client causes FIPs exceptions to be thrown.
- Update of Newtonsoft.json library from 12.0.1 to 13.0.1 to resolve a component governance alert. 
- In ADFS health agent, the TestADFSDuplicateSPN test was disabled as the test was unreliable, it would generate misleading alerts when server experienced transient connectivity issues.

## 19 January 2023 
**Agent Update**
- Microsoft Entra Connect Health agent for Microsoft Entra Connect (version 3.2.2188.23)
   - We fixed a bug where, under certain circumstances, Microsoft Entra Connect Sync errors were not getting uploaded or shown in the portal.

## September 2021
**Agent Update**
- Microsoft Entra Connect Health agent for AD FS (version 3.1.113.0)
  - Fix to extract device information such as device compliance and managed status, device OS, and device OS version from AD FS audits in certain device based authentication scenarios.
  - Fix to populate OAuth Application info in failure cases and categorizing OAuth failures with more specific error codes
  - Fix for alerts on broken WMI calls on the customer machine. Now such calls the result/status would be set to "notRun".

## May 2021
**Agent Update**
- Microsoft Entra Connect Health agent for AD FS (version 3.1.99.0)
  - Fix for low unique user count value in AD FS application activity report
  - Fix for sign-ins with empty or default GUID CorrelationId

## March 2021
**Agent Update**

- Microsoft Entra Connect Health agent for AD FS (version 3.1.95.0)

  - Fix to resolve NT4 formatted username to a UPN during sign-in events.
  - Fix to identify incorrect application identifier scenarios with a dedicated error code.
  - Changes to add a new property for OAuth client identifier.
  - Fix to display correct values in the **Protocol** and **Authentication Type** fields in Microsoft Entra sign-in report for certain sign-in scenarios.
  - Fix to display IP addresses in Microsoft Entra sign-in report's IP chain field in order of the request.
  - Changes to introduce a new field to differentiate if secondary authentication was requested during a sign-in.
  - Fix for AD FS application identifier property to display in Microsoft Entra sign-in report.

## April 2020
**Agent Update**

- Microsoft Entra Connect Health agent for AD FS (version 3.1.77.0)

   - Bug fix for “Invalid Service Principal Name (SPN) for AD FS service” alert, for which the alert was reporting incorrectly.


## July 2019
**Agent Update**
* Microsoft Entra Connect Health agent for AD FS (version 3.1.59.0) 
   1. Text change in TestWindowsTransport
   2. Changes for AD FS RP upload
   
* Microsoft Entra Connect Health agent for AD FS (version 3.1.56.0) 
   1. Add TestWindowsTransport test and remove WsTrust endpoints checks in CheckOffice365Endpoints test
   2. Log OS and .NET information
   3. Increase RP configuration message upload size to 1MB.
   4. Bug fixes
   
* Microsoft Entra Connect Health agent for AD DS (version 3.1.56.0) 
   1. Log OS and .NET information 
   2. Bug fixes

## May 2019
**Agent Update:** 
* Microsoft Entra Connect Health agent for AD FS (version 3.1.51.0) 
   1. Bug fix to distinguish between multiple sign ins that share the same client-request-id.
   2. Bug fix to parse bad username/password errors on language localized servers.   

## April 2019
**Agent Update:** 
* Microsoft Entra Connect Health agent for AD FS (version 3.1.46.0) 
   1. Fix Check Duplicate SPN alert process for ADFS

## March 2019
**Agent Update:** 
* Microsoft Entra Connect Health agent for AD DS (version 3.1.41.0)  
   1. .NET version collection
   2. Improvement of performance counter collection when missing certain categories
   3. Bug fix on preventing spawning of multiple Monitoring Agent instances

* Microsoft Entra Connect Health agent for AD FS (version 3.1.41.0) 
   1. Integrate and upgrade of AD FS test scripts using ADFSToolBox
   2. Implement .NET version collection
   3. Improvement of performance counter collection when missing certain categories
   4. Bug fix on preventing spawning of multiple Monitoring Agent instances


## November 2018
**New GA features:** 
* Microsoft Entra Connect Health for Sync - Diagnose and remediate duplicated attribute sync errors from the portal

**Agent Update:** 
* Microsoft Entra Connect Health agent for AD DS (version 3.1.24.0) 
   1. Transport Layer Security (TLS) protocol version 1.2 compliance and enforcement
   2. Reduce Global Catalog alert noise
   3. Health agent registration bug fixes

* Microsoft Entra Connect Health agent for AD FS (version 3.1.24.0)  
   1. Transport Layer Security (TLS) protocol version 1.2 compliance and enforcement
   2. Support of Test-ADFSRequestToken for localized operating system
   3. Solved diagnostic agent EventHandler locking issue
   4. Health agent registration bug fixes

## August 2018 
*  Microsoft Entra Connect Health agent for Sync (version 3.1.7.0) released with Microsoft Entra Connect version 1.1.880.0    
   1. Hotfix for [high CPU issue of monitoring agent with .NET Framework KB releases](https://support.microsoft.com/help/4346822/high-cpu-issue-in-azure-active-directory-connect-health-for-sync)

## June 2018 
**New preview features:** 
* Microsoft Entra Connect Health for Sync - Diagnose and remediate duplicated attribute sync errors from the portal 

**Agent Update:** 
* Microsoft Entra Connect Health agent for AD DS (version 3.1.7.0)    
  1. Hotfix for [high CPU issue of monitoring agent with .NET Framework KB releases](https://support.microsoft.com/help/4346822/high-cpu-issue-in-azure-active-directory-connect-health-for-sync)
   
* Microsoft Entra Connect Health agent for AD FS (version 3.1.7.0)  
  1. Hotfix for [high CPU issue of monitoring agent with .NET Framework KB releases](https://support.microsoft.com/help/4346822/high-cpu-issue-in-azure-active-directory-connect-health-for-sync)
  2. Test results fixes on ADFS Server 2016 secondary server
   
* Microsoft Entra Connect Health agent for AD FS (version 3.1.2.0)  
  1. Hotfix for agent memory management and related alerts specifically for version 3.0.244.0


## May 2018
**Agent Update:**
* Microsoft Entra Connect Health agent for AD DS (version 3.0.244.0)
  1. Agent privacy improvement  
  2. Bug fixes and general improvements

* Microsoft Entra Connect Health agent for AD FS (version 3.0.244.0)
  1. Agent Diagnostics Service and related PowerShell module improvements
  2. Agent privacy improvement  
  3. Bug fixes and general improvements

* Microsoft Entra Connect Health agent for Sync (version 3.0.164.0) released with Microsoft Entra Connect version 1.1.819.0 
  1. Agent privacy improvement  
  2. Bug fixes and general improvements


## March 2018
**New preview features:**
* Microsoft Entra Connect Health for AD FS - Risky IP report and alert.

**Agent Update:**

* Microsoft Entra Connect Health agent for AD DS (version 3.0.176.0)
  1. Agent availability improvements 
  2. Bug fixes and general improvements
* Microsoft Entra Connect Health agent for AD FS (version 3.0.176.0)
  1. Agent availability improvements 
  2. Bug fixes and general improvements
* Microsoft Entra Connect Health agent for Sync (version 3.0.129.0) released with Microsoft Entra Connect version 1.1.750.0  
  1. Agent availability improvements 
  2. Bug fixes and general improvements

## December 2017
**Agent Update:**

* Microsoft Entra Connect Health agent for AD DS (version 3.0.145.0)
  1. Agent availability improvements 
  2. Added new agent troubleshooting commands
  3. Bug fixes and general improvements
* Microsoft Entra Connect Health agent for AD FS (version 3.0.145.0)
  1. Added new agent troubleshooting commands
  2. Agent availability improvements 
  3. Bug fixes and general improvements
  
## October 2017
**Agent Update:**

 * Microsoft Entra Connect Health agent for Sync (version 3.0.129.0) released with Microsoft Entra Connect version 1.1.649.0
<br></br> Fixed a version compatibility issue between Microsoft Entra Connect and Microsoft Entra Connect Health Agent for Sync. This issue affects customers who are performing Microsoft Entra Connect in-place upgrade to version 1.1.647.0, but currently has Health Agent version 3.0.127.0. After the upgrade, the Health Agent can no longer send health data about Microsoft Entra Connect Synchronization Service to Microsoft Entra Health Service. With this fix, Health Agent version 3.0.129.0 is installed during Microsoft Entra Connect in-place upgrade. Health Agent version 3.0.129.0 does not have compatibility issue with Microsoft Entra Connect version 1.1.649.0.

## July 2017
**Agent Update:**

* Microsoft Entra Connect Health agent for AD DS (version 3.0.68.0)
  1. Bug fixes and general improvements
  2. Sovereign cloud support
* Microsoft Entra Connect Health agent for AD FS (version 3.0.68.0)
  1. Bug fixes and general improvements
  2. Sovereign cloud support
* Microsoft Entra Connect Health agent for Sync (version 3.0.68.0) released with Microsoft Entra Connect version 1.1.614.0
  1. Support for Microsoft Azure Government Cloud and Microsoft Cloud Germany

## April 2017      
**Agent Update:**

* Microsoft Entra Connect Health agent for AD FS (version 3.0.12.0)
  1. Bug fixes and general improvements
* Microsoft Entra Connect Health agent for AD DS (version 3.0.12.0)
  1. Performance counters upload improvements
  2. Bug fixes and general improvements

## October 2016
**Agent Update:**

* Microsoft Entra Connect Health agent for AD FS (version 2.6.408.0)
* Improvements in detecting client IP addresses in authentication requests
* Bug Fixes related to Alerts
* Microsoft Entra Connect Health agent for AD DS (version 2.6.408.0)
* Bug fixes related to Alerts.
* Microsoft Entra Connect Health agent for Sync (version 2.6.353.0) released with Microsoft Entra Connect version 1.1.281.0
* Provide the required data for the Synchronization Error Reports
* Bug fixes related to Alerts

**New preview features:**

* Synchronization Error Reports for Microsoft Entra Connect

**New features:**

* Microsoft Entra Connect Health for AD FS - IP address field is available in the report about top 50 users with bad username/password.

## July 2016
**New preview features:**

* [Microsoft Entra Connect Health for AD DS](how-to-connect-health-adds.md).

## January 2016
**Agent Update:**

* Microsoft Entra Connect Health agent for AD FS (version 2.6.91.1512)

**New features:**

* [Test Connectivity Tool for Microsoft Entra Connect Health Agents](how-to-connect-health-agent-install.md#test-connectivity-to-azure-ad-connect-health-service)

## November 2015
**New features:**

* Support for [Azure role-based access control (Azure RBAC)](how-to-connect-health-operations.md#manage-access-with-azure-rbac)

**New preview features:**

* [Microsoft Entra Connect Health for sync](how-to-connect-health-sync.md).

**Fixed issues:**

* Bug fixes for errors seen during agent registrations.

## September 2015
**New features:**

* Wrong Username password report for AD FS
* Support to configure Unauthenticated HTTP Proxy
* Support to configure agent on Server core
* Improvements to Alerts for AD FS
* Improvements in Microsoft Entra Connect Health Agent for AD FS for connectivity and data upload.

**Fixed issues:**

* Bug fixes in Usage Insights for AD FS Error types.

## June 2015
**Initial release of Microsoft Entra Connect Health for AD FS and AD FS Proxy.**

**New features:**

* Alerts for monitoring AD FS and AD FS Proxy servers with email notifications.
* Easy access to AD FS topology and patterns in AD FS Performance Counters.
* Trend in successful token requests on AD FS servers grouped by Applications, Authentication Methods, Request Network Location etc.
* Trends in failed request on AD FS servers grouped by Applications, Error Types etc.
* Simpler Agent Deployment using Microsoft Entra Global Administrator credentials.  

## Next steps
Learn more about [Monitor your on-premises identity infrastructure and synchronization services in the cloud](./whatis-azure-ad-connect.md).
