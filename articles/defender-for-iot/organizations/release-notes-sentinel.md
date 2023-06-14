---
title: Microsoft Defender for IoT solution versions in Microsoft Sentinel
description: Learn about the updates available in each version of the Microsoft Defender for IoT solution, available from the Microsoft Sentinel content hub.
ms.date: 09/22/2022
ms.topic: release-notes
ms.subservice: sentinel-integration
---

# Microsoft Defender for IoT solution versions in Microsoft Sentinel

This article lists the updates to out-of-the-box security content available from each version of the **Microsoft Defender for IoT** solution. The **Microsoft Defender for IoT** solution is available from the Microsoft Sentinel content hub.

The **Microsoft Defender for IoT** solution enhances the integration between Defender for IoT and Microsoft Sentinel, helping to streamline SOC workflows to analyze, investigate, and respond efficiently to OT incidents.

For more information, see:

- [What's new in Microsoft Defender for IoT?](whats-new.md)
- [Tutorial: Integrate Microsoft Sentinel and Microsoft Defender for IoT](../../sentinel/iot-solution.md?bc=%2fazure%2fdefender-for-iot%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fdefender-for-iot%2forganizations%2ftoc.json)
- [Tutorial: Investigate and detect threats for IoT devices](../../sentinel/iot-advanced-threat-monitoring.md?bc=%2fazure%2fdefender-for-iot%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fdefender-for-iot%2forganizations%2ftoc.json).

## Version 2.0.2

**Released**: February 2023

New features in this version include:

- Improved analytics rules, with the new ability to have incidents created only when new alerts are triggered in Defender for IoT. When configuring your incident creation in Microsoft Sentinel, filter alerts by the **Is New** property.

- An enhanced incident details page that includes Defender for IoT data, including a deep link to the Defender for IoT alert details page, the product name, remediation steps, and MITRE tactics and techniques.

- Performance improvements for analytics rule queries.

## Version 2.0.1

**Released**: September 2022

New features in this version include:

- Solution name changed to **Microsoft Defender for IoT**

- Workbook improvements:

  - A new overview dashboard
  - A new vulnerability dashboard
  - Inventory dashboard improvements

- New SOC playbooks for automation with CVEs, triaging incidents that involve sensitive devices, and email notifications to device owners for new incidents.

For more information, see [Updates to the Microsoft Defender for IoT solution](whats-new.md#updates-to-the-microsoft-defender-for-iot-solution-in-microsoft-sentinels-content-hub).

## Version 2.0.0

**Released**: September 2022

This version provides enhanced experiences for managing, installing, and updating the solution package in the Microsoft Sentinel content hub.

For more information, see [Centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions](../../sentinel/sentinel-solutions-deploy.md)

## Version 1.0.14

**Released**: July 2022

New features in this version include:

- [Microsoft Sentinel incident synch with Defender for IoT alerts](whats-new.md#microsoft-sentinel-incident-synch-with-defender-for-iot-alerts)
- IoT device entities displayed in related Microsoft Sentinel incidents.


## Version 1.0.13

**Released**: March 2022

New features in this version include:

- A bug fix to prevent new incidents from being created in Microsoft Sentinel each time an alert in Defender for IoT is updated or deleted.
- A new analytics rule for the **No traffic on sensor detected** Defender for IoT alert.
- Updates in the **Unauthorized PLC changes** analytics rule to support the **Illegal Beckhoff AMS Command** Defender for IoT alert.
- A new, deep link to Defender for IoT alerts directly from related Microsoft Sentinel incidents.

## Earlier versions

For more information about earlier versions of the **Microsoft Defender for IoT** solution, contact us via the [Defender for IoT community](https://techcommunity.microsoft.com/t5/microsoft-defender-for-iot/bd-p/MicrosoftDefenderIoT).

## Next steps

Learn more in [What's new in Microsoft Defender for IoT?](whats-new.md) and the [Microsoft Sentinel documentation](../../sentinel/index.yml).
