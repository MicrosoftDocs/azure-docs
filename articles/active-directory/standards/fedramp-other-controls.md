---
title: Configure additional controls to meet FedRAMP High Impact
description: Detailed guidance on how to configure additional controls to meet FedRAMP High Impact levels.
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
author: barbaraselden
ms.author: baselden
manager: celested
ms.reviewer: martinco
ms.date: 4/26/2021
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Configure additional controls to achieve FedRAMP High Impact level

The following list of controls (and control enhancements) in the families below may require configuration in your Azure AD tenant.

Each row in the following tables provides prescriptive guidance to aid you in developing your organization’s response to any shared responsibilities regarding the control and/or control enhancement.

## Audit & Accountability

* AU-02 Audit events

* AU-03 Content of audit
* AU-06 Audit Review, Analysis, and Reporting


| Control ID and subpart| Customer responsibilities and guidance |
| - | - |
| AU-02 <br>AU-03 <br>AU-03(1)<br>AU-03(2)| **Ensure the system is capable of auditing events defined in AU-02 Part a and coordinate with other entities within the organization’s subset of auditable events to support after-the-fact investigations. Implement centralized management of audit records**.<p>All account lifecycle operations (account creation, modification, enabling, disabling, and removal actions) are audited within the Azure AD audit logs. All authentication and authorization events are audited within Azure AD sign-in logs, and any detected risks are audited in the Identity Protection logs. Each of these logs can be streamed directly into a Security Information and Event Management (SIEM) solution such as Azure Sentinel. Alternatively, use Azure Event Hub to integrate logs with third-party SIEM solutions.<p>Audit Events<li> [Audit activity reports in the Azure Active Directory portal](https://docs.microsoft.com///azure/active-directory/reports-monitoring/concept-audit-logs)<li> [Sign-in activity reports in the Azure Active Directory portal](https://docs.microsoft.com///azure/active-directory/reports-monitoring/concept-sign-ins)<li>[How To: Investigate risk](https://docs.microsoft.com///azure/active-directory/identity-protection/howto-identity-protection-investigate-risk)<p>SIEM Integrations<li> [Azure Sentinel : Connect data from Azure Active Directory (Azure AD)](https://docs.microsoft.com///azure/sentinel/connect-azure-active-directory)<li>[Stream to Azure event hub and other SIEMs](https://docs.microsoft.com///azure/active-directory/reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub) |
| AU-06<br>AU-06(1)<br>AU-06(3)<br>AU-06(4)<br>AU-06(5)<br>AU-06(6)<br>AU-06(7)<br>AU-06(10)<br>| **Review and analyze audit records at least once each week to identify inappropriate or unusual activity and report findings to appropriate personnel**. <p>Guidance provided above for AU-02 & AU-03 allows for weekly review of audit records and reporting to appropriate personnel. You cannot meet these requirements using only Azure AD. You must also use a SIEM solution such as Azure Sentinel.<p>[What is Azure Sentinel?](https://docs.microsoft.com///azure/sentinel/overview) |

## Incident Response

* IR-04 Incident handling

* IR-05 Incident monitoring

| Control ID and subpart| Customer responsibilities and guidance |
| - | - |
| IR-04<br>IR-04(1)<br>IR-04(2)<br>IR-04(3)<br>IR-04(4)<br>IR-04(6)<br>IR-04(8)<br>IR-05<br>IR-05(1)| **Implement incident handling and monitoring capabilities including Automated Incident Handling, Dynamic Reconfiguration, Continuity of Operations, Information Correlation, Insider Threats, Correlation with External Organizations, Incident Monitoring & Automated Tracking**. <p>All configuration changes are logged in the audit logs. Authentication and authorization events are audited within the sign-in logs, and any detected risks are audited in the Identity Protection logs. Each of these logs can be streamed directly into a Security Information and Event Management (SIEM) solution such as Azure Sentinel. Alternatively, use Azure Event Hub to integrate logs with third-party SIEM solutions. Automate dynamic reconfiguration based on events within the SIEM using MSGraph and/or Azure AD PowerShell.<p>Audit Events<br><li>[Audit activity reports in the Azure Active Directory portal](https://docs.microsoft.com///azure/active-directory/reports-monitoring/concept-audit-logs)<li>[Sign-in activity reports in the Azure Active Directory portal](https://docs.microsoft.com///azure/active-directory/reports-monitoring/concept-sign-ins)<li>[How To: Investigate risk](https://docs.microsoft.com///azure/active-directory/identity-protection/howto-identity-protection-investigate-risk)<p>SIEM Integrations<li>[Azure Sentinel : Connect data from Azure Active Directory (Azure AD)](https://docs.microsoft.com///azure/sentinel/connect-azure-active-directory)<li>[Stream to Azure event hub and other SIEMs](https://docs.microsoft.com///azure/active-directory/reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub)<p>Dynamic Reconfiguration<li>[AzureAD Module](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0)<li>[Overview of Microsoft Graph](https://docs.microsoft.com/graph/overview?view=graph-rest-1.0) |


  
## Personnel Security

* PS-04 Personnel termination

| Control ID and subpart| Customer responsibilities and guidance |
| - | - |
| PS-04<br>PS-04(2)| **Automatically notify personnel responsible for disabling access to the system.** <p>Disable accounts and revoke all associated authenticators and credentials within 8 hours. <p>Configure provisioning (including disablement upon termination) of accounts in Azure AD from external HR systems, on-premises Active Directory, or directly in the cloud. Terminate all system access by revoking existing sessions. <p>Account Provisioning<li> See detailed guidance in AC-02. <p>Revoke all Associated Authenticators. <li> [Revoke user access in an emergency in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/enterprise-users/users-revoke-access) |


## System & Information Integrity

* SI-04 Information system monitoring

 Control ID and subpart| Customer responsibilities and guidance |
| - | - |
| SI-04<br>SI-04(1)| **Implement Information System wide monitoring & Intrusion Detection System**<p>Include all Azure AD logs (Audit, Sign-in, Identity Protection) within the information system monitoring solution. <p>Stream Azure AD logs into a SIEM solution (See IA-04). |

## Next steps

[Configure access controls](fedramp-access-controls.md)

[Configure identification & authentication controls](fedramp-identification-and-authentication-controls.md)

[Configure other controls](fedramp-other-controls.md)
 
