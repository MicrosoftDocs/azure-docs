---
title: IoT/OT Threat Monitoring with Defender for IoT release notes  - Microsoft Defender for IoT
description: Learn about the updates available in each version of the IoT / OT Threat Monitoring with Defender for IoT solution for Microsoft Sentinel.
ms.date: 09/15/2022
ms.topic: overview
---

# IoT/OT Threat Monitoring with Defender for IoT release notes

Defender for IoT's built-in integration with Microsoft Sentinel helps customers to bridge the gap between IT and OT security challenges.

In Microsoft Sentinel, deploy the Defender for IoT data connector and install the **IoT/OT Threat Monitoring with Defender for IoT** solution to stream Defender for IoT data into Microsoft Sentinel.

Microsoft regularly releases new versions of the **IoT/OT Threat Monitoring with Defender for IoT** solution, with updates for streamlining SOC workflows to analyze, investigate, and respond efficiently to OT incidents.

For more information, see [Tutorial: Integrate Microsoft Sentinel and Microsoft Defender for IoT](/azure/sentinel/iot-solution?toc=%2Fazure%2Fdefender-for-iot%2Forganizations%2Ftoc.json&bc=%2Fazure%2Fdefender-for-iot%2Fbreadcrumb%2Ftoc.json).

This article lists the new features available in each version of the **IoT/OT Threat Monitoring with Defender for IoT** solution. For more information, see [What's new in Microsoft Defender for IoT?](release-notes.md).

## Version 2.0

New features in this version include:

1)	Workbook improvements:
a)	New overview dashboard with Key metrics on the inventory, threat detection and security posture
b)	New vulnerability dashboard
c)	Improvement to the inventory dashboard including access to device’s recommendations, vulnerabilities, backlink to MDIoT device page and full alignment with MDIoT inventory data
2)	New OT SOAR Playbooks:
a)	Incident with active CVEs: Auto Workflow
The playbook automates the SOC workflow by automatically enriching incident comments with the CVEs of the involved devices based on Defender for IoT data. An automated triage is performed if the CVE is critical, and the asset owner is automatically notified by email
b)	Triage incidents involving Crown Jewels devices automatically
SOC and OT engineers can stream their workflows using the playbook, which automatically updates the incident severity based on the devices involved in the incident and their importance.
c)	Send Email to IoT/OT Device Owner
The playbooks automate the SOC workflow by automatically emailing the incident details to the right IoT/OT device owner (based on Defender for IoT dafinition) and allowing him to respond by email. The incident is automatically updated based on the email response from the devices owner.


## Version 1.0.14

New features in this version include:

1)	Sentinel -> Defender for IoT Alert Status Sync: Streamline the SOC workflow by updating the alert status in Defender for IoT automatically when Microsoft Sentinel updates the incident status.
After updating the solution, make sure that you also take the required steps to ensure that the new playbook works as expected.
2)	IoT Device Entities in Sentinel incidents: Providing IoT/OT context for SOCs by displaying IoT/OT devices inside incidents created with Sentinel's solution package.


## Version 1.0.13

New features in this version include:

1)	Bugs fix including prevents new incidents from being created in sentinel every time an alert in Defender for IoT is updated/deleted.
2)	New SOC Workflow: New analytic rule for MDIoT alert ‘No traffic on Sensor Detected’ 
3)	Alert 'Illegal Beckhoff AMS Command' to existing workflow use case – the 'Unauthorized PLC changes' analytic rule has been updated
4)	Deep link to Defender for IoT alerts from Sentinel incidents: Easily navigate between Sentinel incidents created by the solution package and Defender for IoT alerts through the MDIoT alert link in Sentinel's incident page.
