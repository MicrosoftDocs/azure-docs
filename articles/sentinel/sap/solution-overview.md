---
title: Microsoft Sentinel Threat Monitoring for SAP solution overview  | Microsoft Docs
description: This article introduces Microsoft Sentinel Threat Monitoring solution for SAP
author: MSFTandrelom
ms.author: andrelom
ms.topic: how-to
ms.date: 06/21/2022
---

# Microsoft Sentinel Threat Monitoring for SAP solution overview

SAP systems pose a unique security challenge, SAP systems handle extremely sensitive information and are prime targets for attackers.

An SAP system breach could result in stolen files, exposed data, or disrupted supply chain. Once an attacker is in the system, there are few controls to detect exfiltration or other bad acts. SAP activity needs to be correlated with other data across the org for efficient detection. SOC teams traditionally have very little visibility into SAP systems.


Microsoft Sentinel Threat Monitoring for SAP solution continuously monitors SAP systems for threats at all layers: 
- business logic
- application
- database
- OS

It analyzes SAP system data to detect threats such as privilege escalation, unapproved changes, and unauthorized access. It allows you to correlate SAP monitoring with other signals across your organization, and to build your own detections to monitor sensitive transactions and other business risks.
    - Privilege escalation
    - Unapproved changes
    - Unauthorized access
- Correlate SAP monitoring with other signals across your organization
- Build your own detections to monitor sensitive transactions and other business risks


### Log sources

The solution's data connector retreives a wide variety of SAP Log Sources:
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

Example Detection Coverage

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
