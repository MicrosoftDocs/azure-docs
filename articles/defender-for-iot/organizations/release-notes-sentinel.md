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

This article lists the new features available in each version of the **IoT/OT Threat Monitoring with Defender for IoT** solution. For more information, see [What's new in Microsoft Defender for IoT?](release-notes.md)

## Version 2.0

**Released**: September 2022

New features in this version include:

- Workbook improvements
- A new overview dashboard
- A new vulnerability dashboard
- Inventory dashboard improvements
- New SOC playbooks for automation with CVEs, triaging incidents that involve sensitive devices, and email notifications to device owners for new incidents.

For more information, see [Microsoft Sentinel integration enhancements](release-notes.md#microsoft-sentinel-integration-enhancements).


## Version 1.0.14

**Released**: July 2022

New features in this version include:

- [Microsoft Sentinel incident synch with Defender for IoT alerts](release-notes.md#microsoft-sentinel-incident-synch-with-defender-for-iot-alerts)
- IoT device entities displayed in related Microsoft Sentinel incidents. <!--did we not mention this in the main what's new? let's add more details now, with a screenshot?-->


## Version 1.0.13

**Released**: March 2022

New features in this version include:

- A bug fix to prevent new incidents from being created in Microsoft Sentinel each time an alert in Defender for IoT is updated or deleted.
- A new analytics rule for the **No traffic on sensor detected** Defender for IoT alert.
- Updates in the **Unauthorized PLC changes** analytics rule to support the **Illegal Beckhoff AMS Command** Defender for IoT alert.
- A new, deep link to Defender for IoT alerts directly from related Microsoft Sentinel incidents.

## Earlier versions

For more information about earlier versions of the **IoT/OT Threat Monitoring with Defender for IoT** solution, contact us via the [Defender for IoT community](https://techcommunity.microsoft.com/t5/microsoft-defender-for-iot/bd-p/MicrosoftDefenderIoT).

## Next steps

Learn more in [What's new in Microsoft Defender for IoT?](release-notes.md) and the [Microsoft Sentinel documentation](/azure/sentinel/)
