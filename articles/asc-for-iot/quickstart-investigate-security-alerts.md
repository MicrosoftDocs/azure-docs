---
title: "Quickstart: Investigate security alerts"
description: Understand, drill down, and investigate Azure Security Center for IoT security alerts on your IoT devices.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/30/2020
ms.author: mlottner
---

# Quickstart: Investigate security alerts

Scheduled investigation and remediation of the alerts issued by Azure Security Center for IoT is the best way to ensure compliance and protection across your IoT solution.

In this quickstart, we'll explore the information available in each IoT security alert, and explain how to drill down and use the details of each alert and related device, to respond and remediate. 

Let's get started. 


## Investigate new security alerts

The IoT Hub security alert list displays all of the aggregated security alerts for your IoT Hub. 

1. In the Azure portal, open the **IoT Hub** you want to investigate for new alerts.
1. From the **Security** menu, select **Alerts**. All of the security alerts for the IoT Hub will display, and the alerts with a **New** flag, mark your alerts from the past 24 hours.
:::image type="content" source="media/quickstart/investigate-new-security-alerts.png" alt-text="Investigate new IoT security alerts by using the new alert flag":::
1. Select and open any alert from the list to open the alert details and drill down to the alert specifics. 

## Security alert details

Opening each aggregated alert displays the detailed alert description, remediation steps, device ID for each device that triggered an alert, as well as alert severity and direct investigation access using Log Analytics. 

1. Select and open any security alert from the **IoT Hub** > **Security** > **Alerts** list. 
1. Review the alert **description**, **severity**, **source of the detection**, **device details** of all devices that issued this alert in the aggregation period.
:::image type="content" source="media/quickstart/drill-down-iot-alert-details.png" alt-text="Drill-down and review the details of each device in an aggregated alert "::: 
1. After reviewing alert specifics, use the **manual remediation step** instructions to help remediate and/or resolve the issue that caused the alert. 
:::image type="content" source="media/quickstart/iot-alert-manual-remediation-steps.png" alt-text="Follow the manual remediation steps to help resolve or remediate your device security alerts":::

1. If further investigation is required, **Investigate the alerts in Log Analytics** using the link. 
:::image type="content" source="media/quickstart/investigate-iot-alert-log-analytics.png" alt-text="To further investigate an alert, use the investigate using log analytics link provided on screen":::

## Next steps

Advance to the next article to learn more about Azure Security Center alert types and possible customizations...

> [!div class="nextstepaction"]
> [Understanding IoT security alerts](concept-security-alerts.md)
