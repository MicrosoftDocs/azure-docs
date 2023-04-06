---
title: Microsoft Sentinel solution for SAP® applications overview
description: This article introduces Microsoft Sentinel solution for SAP® applications
author: limwainstein
ms.author: lwainstein
ms.topic: conceptual
ms.date: 03/22/2023
---

# Microsoft Sentinel solution for SAP® applications overview

SAP systems pose a unique security challenge. SAP systems handle extremely sensitive information and are prime targets for attackers.

Security operations teams have traditionally had very little visibility into SAP systems. An SAP system breach could result in stolen files, exposed data, or disrupted supply chain. Once an attacker is in the system, there are few controls to detect exfiltration or other bad acts. SAP activity needs to be correlated with other data across the organization for effective threat detection.

To help close this gap, Microsoft Sentinel offers the Microsoft Sentinel solution for SAP® applications. This comprehensive solution uses components at every level of Microsoft Sentinel to offer end-to-end detection, analysis, investigation, and response to threats in your SAP environment.

## What Microsoft Sentinel solution for SAP® applications does

The Microsoft Sentinel solution for SAP® applications continuously monitors SAP systems for threats at all layers - business logic, application, database, and OS.

It analyzes SAP system data to detect threats such as privilege escalation, unapproved changes, and unauthorized access. It allows you to correlate SAP monitoring with other signals across your organization, and to build your own detections to monitor sensitive transactions and other business risks.
    - Privilege escalation
    - Unapproved changes
    - Unauthorized access
- Correlate SAP monitoring with other signals across your organization
- Build your own detections to monitor sensitive transactions and other business risks

## Solution details

### Log sources

The solution's data connector retrieves a wide variety of SAP Log Sources:
- ABAP Security Audit Log 
- ABAP Change Documents Log 
- ABAP Spool Log 
- ABAP Spool Output Log 
- ABAP Job Log 
- ABAP Workflow Log 
- ABAP DB Table Data
- SAP User Master Data
- ABAP CR Log
- ICM Logs
- JAVA Webdispacher Logs 
- Syslog

### Threat detection coverage

- Suspicious privileges operations 
  – Privileged user creation
  - Usage of break-glass users
  - Unlocking a user and logging into to it from the same IP
  - Assignment of sensitive roles and admin privileges 
  - User Unlocks and uses other users
  - Critical Authorization Assignment 
 
- Attempts to bypass SAP security mechanisms –
  - Disabling audit logging (HANA and SAP)
  - Execution of sensitive function modules
  - Unlocking blocked transactions
  - Debugging production systems
  - Sensitive Tables Direct access by RFC
  - RFC Execution of Sanative Function
  - System Configuration Change,  Dynamic ABAP Program.

- Backdoor creation  (persistency) 
  - Creation of new internet facing interfaces (ICF)
  - Directly accessing sensitive tables by remote-function-call
  - Assigning new service handlers to ICF
  - Execution of obsolete programs
  - User Unlocks and uses other users.
 
- Data exfiltration 
  - Multiple files downloads
  - Spool takeovers
  - Allowing access to insecure FTP servers & connections from unauthorized hosts
  - Dynamic RFC Destination
  - HANA DB - User Admin Actions from DB level.
 
- Initial Access 
  – Brute force
  - Multiple logons from the same IP
  - Privileged user logons from unexpected networks
  - SPNego Replay Attack 
  
## Next steps

Learn more about the Microsoft Sentinel solution for SAP® applications:

- [Deploy Microsoft Sentinel solution for SAP® applications](deployment-overview.md)
- [Prerequisites for deploying Microsoft Sentinel solution for SAP® applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Deploy SAP Change Requests (CRs) and configure authorization](preparing-sap.md)
- [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md)
- [Deploy SAP security content](deploy-sap-security-content.md)
- [Deploy the Microsoft Sentinel for SAP data connector with SNC](configure-snc.md)
- [Enable and configure SAP auditing](configure-audit.md)
- [Collect SAP HANA audit logs](collect-sap-hana-audit-logs.md)

Troubleshooting:

- [Troubleshoot your Microsoft Sentinel solution for SAP® applications deployment](sap-deploy-troubleshoot.md)
- [Configure SAP Transport Management System](configure-transport.md)
- [Monitor the health and role of your SAP systems](../monitor-sap-system-health.md)

Reference files:

- [Microsoft Sentinel solution for SAP® applications data reference](sap-solution-log-reference.md)
- [Microsoft Sentinel solution for SAP® applications: security content reference](sap-solution-security-content.md)
- [Kickstart script reference](reference-kickstart.md)
- [Update script reference](reference-update.md)
- [Systemconfig.ini file reference](reference-systemconfig.md)
