---
title: Microsoft Sentinel solution for SAP applications overview
description: This article provides an overview of the Microsoft Sentinel solution for SAP applications and available support.
author: batamig
ms.author: bagol
ms.topic: conceptual
ms.date: 05/22/2024
#customerIntent: As a SOC analyst, I want to learn more about the Microsoft Sentinel solution for SAP applications, which I can use to connect my SAP system to Microsoft Sentinel, and start ingesting and analyzing SAP data in Microsoft Sentinel.
---

# Microsoft Sentinel solution for SAP applications

SAP systems pose a unique security challenge, as they handle extremely sensitive information, are a prime target for attackers, and traditionally provide little visibility for security operations teams.

An SAP system breach could result in stolen files, exposed data, or a disrupted supply chain. Once an attacker is in the system, there are few controls to detect exfiltration or other bad acts. SAP activity needs to be correlated with other data across the organization for effective threat detection.

To help close this gap, Microsoft Sentinel offers the Microsoft Sentinel solution for SAP applications. This comprehensive solution uses components at every level of Microsoft Sentinel to offer end-to-end detection, analysis, investigation, and response to threats in your SAP environment.

## Supported features and sample architecture

The Microsoft Sentinel solution for SAP applications continuously monitors SAP systems for threats at all layers - business logic, application, database, and OS. It allows you to:

- **Correlate SAP monitoring with other signals across your organization**. Use out-of-the-box and custom detections to monitor sensitive transactions and other business risks, such as privilege escalation, unapproved changes, and unauthorized access.

- **Build automated response processes** that interact with your SAP systems to stop active security threats.

The Microsoft Sentinel solution for SAP applications also offers threat monitoring and detection for SAP Business Technology Platform (BTP).

For example, the following image shows a multi-SID SAP landscape with a split between productive and non-productive systems, including the SAP BTP. All of the systems in this image are onboarded to Microsoft Sentinel for the SAP solution.

:::image type="content" source="media/deployment-overview/sap-sentinel-multi-sid-overview.png" alt-text="Diagram of a multi-SID SAP landscape with Microsoft Sentinel." lightbox="media/deployment-overview/sap-sentinel-multi-sid-overview.png" border="false":::

<!--i don't think we need this section here, it should be covered in the log reference.
## Supported log sources

The data connector provided with the Microsoft Sentinel solution for SAP applications injests data from the following SAP log sources:

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
-->

## Threat detection coverage

The Microsoft Sentinel solution for SAP applications supports the following types of threat detections:

|Type  |Detections  |
|---------|---------|
|**Suspicious privileges operations**     |  <li>Privileged user creation <li>Usage of break-glass users<li>Unlocking a user and signing into to it from the same IP<li>Assignment of sensitive roles and admin privileges <li>User unlocks and uses other users <li>Critical authorization assignment        |
|**Attempts to bypass SAP security mechanisms**     |   <li> Disabling audit logging (HANA and SAP)<li> Execution of sensitive function modules <li> Unlocking blocked transactions<li> Debugging production systems <li> Sensitive tables direct access by RFC <li>RFC execution of sanative function<li> System configuration change,  dynamic ABAP program       |
|**Backdoor creation  (persistency)**     |      <li> Creation of new internet facing interfaces (ICF)<li> Directly accessing sensitive tables by remote-function-call<li>  Assigning new service handlers to ICF <li>Execution of obsolete programs<li> User unlocks and uses other users     |
|**Data exfiltration**     |   <li> Multiple files downloads <li>Spool takeovers<li> Allowing access to insecure FTP servers and connections from unauthorized hosts<li> Dynamic RFC Destination <li>HANA DB - user admin actions from database level     |
|**Initial Access**     |   <li> Brute force<li>   Multiple logons from the same IP<li>   Privileged user logons from unexpected networks <li>SPNego Replay Attack        |

## Investigation support

Investigate SAP incidents just as you would any other incidents in Microsoft Sentinel and Microsoft Defender. For more information, see:

- [Navigate and investigate incidents in Microsoft Sentinel](../investigate-incidents.md)
- [Investigate and respond with Microsoft Defender XDR](/defender-xdr/incident-response-overview)

## Certification

Microsoft Sentinel solution for SAP applications is certified for SAP S/4HANA Cloud, Private Edition RISE with SAP and SAP S/4 on-premises.

- The integration scenarios include S/4-BC-XAL 1.0/S/4 EXTERNAL ALERT AND MONITORING 1.0 (for S/4).
- Our certification includes S/4 and SAP Rise S/4 HANA Cloud Private Edition running in any cloud and on-premises.
- We support hybrid deployments that can cover the entire customer estate.

For more information, see the certification on the [SAP Certified Solutions Directory](https://www.sap.com/dmc/exp/2013_09_adpd/enEN/#/solutions?id=s:33db1376-91ae-4f36-a435-aafa892a88d8).

## Solution pricing

While the Microsoft Sentinel for SAP solution is free to install, there is an additional hourly charge for activating and using the solution on production systems.

- The additional hourly charge applies to connected production systems only.
- Microsoft Sentinel identifies a production system by looking at the configuration on the SAP system. To do this, Microsoft Sentinel searches for a production entry in the T000 table.

For more information, see [View the roles of your connected production systems](../monitor-sap-system-health.md) and [Microsoft Sentinel solution for SAP® applications](https://azure.microsoft.com/pricing/offers/microsoft-sentinel-sap-promo/).

<!--do we need this?
## Trademark attribution

SAP S/4HANA and SAP are trademarks or registered trademarks of SAP SE or its affiliates in Germany and in other countries/regions. 
-->

## Related content

For more information, see:

- [Configure initial Microsoft Sentinel solution for SAP applications content](deployment-solution-configuration.md)
- [Microsoft Sentinel incident response playbooks for SAP](sap-incident-response-playbooks.md)
- [Deploy Microsoft Sentinel solution for SAP applications](deployment-overview.md)
