---
title: "Quickstart: Investigate security alerts"
description: Understand, drill down, and investigate Defender for IoT security alerts on your IoT devices.
ms.topic: quickstart
ms.date: 06/21/2021
---

# Quickstart: Investigate security alerts

Scheduled investigation and remediation of the alerts issued by Defender for IoT is the best way to ensure compliance, and protection across your IoT solution.

## Investigate new security alerts

The IoT Hub security alert list displays all of the aggregated security alerts for your IoT Hub. 

1. In the Azure portal, open the **IoT Hub** you want to investigate for new alerts.

1. From the **Security** menu, select **Alerts**. All of the security alerts for the IoT Hub will display, and the alerts with a **New** flag, mark your alerts from the past 24 hours.

    :::image type="content" source="media/quickstart/investigate-new-security-alerts.png" alt-text="Investigate new IoT security alerts by using the new alert flag":::

1. Select an alert from the list to open the alert details, and understand the alert specifics. 

## Security alert details

Opening each aggregated alert displays the detailed alert description, remediation steps, and device ID for each device that triggered an alert. The alert severity, and direct investigation is accessible using Log Analytics. 

1. Navigate to **IoT Hub** > **Security** > **Alerts**. 

1. Select any security alert from the list to open it. 

1. Review the alert **description**, **severity**, **source of the detection**, **device details** of all devices that issued this alert in the aggregation period.

    :::image type="content" source="media/quickstart/drill-down-iot-alert-details.png" alt-text="Investigate and review the details of each device in an aggregated alert "::: 

1. After reviewing the alert specifics, use the **manual remediation step** instructions to help remediate, and resolve the issue that caused the alert.

    :::image type="content" source="media/quickstart/iot-alert-manual-remediation-steps.png" alt-text="Follow the manual remediation steps to help resolve or remediate your device security alerts":::

1. If further investigation is required, **Investigate the alerts in Log Analytics** using the link.
 
    :::image type="content" source="media/quickstart/investigate-iot-alert-log-analytics.png" alt-text="To further investigate an alert, use the investigate using log analytics link provided on screen":::

## Next steps

Advance to the next article to learn more about Defender alert types and possible customizations.

> [!div class="nextstepaction"]
> [Understanding IoT security alerts](concept-security-alerts.md)
