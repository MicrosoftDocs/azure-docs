---
title: Investigate CIS benchmark recommendation
description: Perform basic and advanced investigations based on OS baseline recommendations.
ms.date: 08/09/2021
ms.topic: how-to
---

# Investigate OS baseline (based on CIS benchmark) recommendation

Perform basic and advanced investigations based on OS baseline recommendations.

## Basic OS baseline security recommendation investigation  

You can investigate OS baseline recommendations by navigating to your Azure Defender for IoT portal, under the **IoT Hub**. For more information, see how to [Investigate security recommendations](quickstart-investigate-security-recommendations.md).

## Advanced OS baseline security recommendation investigation  

This section describes how to better understand the OS baseline test results, and querying events in Azure Log Analytics.  

The advanced OS baseline security recommendation investigation is only supported by using log analytics. Connect Defender for IoT to a Log Analytics workspace before continuing. For more information on advanced OS baseline security recommendations, see how to [Configure Azure Defender for IoT agent-based solution](how-to-configure-agent-based-solution.md).

To query your IoT security events in Log Analytics for alerts:

1. Navigate to the **Alerts** page.

1. Select **Investigate recommendations in Log Analytics workspace**.

To query your IoT security events in Log Analytics for recommendations:

1. Navigate to the **Recommendations** page.

1. Select **Investigate recommendations in Log Analytics workspace**.

1. Select **Show Operation system (OS) baseline rules details** from the **Recommendation details** quick view page to see the details of a specific device.

   :::image type="content" source="media/how-to-investigate-cis-benchmark/recommendation-details.png" alt-text="See the details of a specific device.":::

To query your IoT security events in Log Analytics workspace directly:

1. Navigate to the **Logs** page.

    :::image type="content" source="media/how-to-investigate-cis-benchmark/logs.png" alt-text="Select logs from the left side pane.":::

1. Select **Investigate the alerts** or, select the **Investigate the alerts in Log Analytics** option from any security recommendation, or alert.

## Useful queries to investigate the OS baseline resources

> [!Note]
> Make sure to Replace `<device-id>` with the name(s) you gave your device in each of the following queries.

### Retrieve the latest information

- **Device fleet failure**: Run the following query to retrieve the latest information about checks that failed across the device fleet:

    ```kusto
    let lastDates = SecurityIoTRawEvent |
    where RawEventName == "Baseline" |
    summarize TimeStamp=max(TimeStamp) by DeviceId;
    lastDates | join kind=inner (SecurityIoTRawEvent) on TimeStamp, DeviceId |
    extend event = parse_json(EventDetails) |
    where event.BaselineCheckResult == "FAIL" |
    project DeviceId, event.BaselineCheckId, event.BaselineCheckDescription
    ```

- **Specific device failure** - Run the following query to retrieve the latest information about checks that failed on a specific device:  

    ```kusto
    let id = SecurityIoTRawEvent | 
    extend IoTRawEventId = extractjson("$.EventId", EventDetails, typeof(string)) |
    where TimeGenerated <= now() |
    where RawEventName == "Baseline" |
    where DeviceId == "<device-id>" |
    summarize arg_max(TimeGenerated, IoTRawEventId) |
    project IoTRawEventId;
    SecurityIoTRawEvent |
    extend IoTRawEventId = extractjson("$.EventId", EventDetails, typeof(string)), extraDetails = todynamic(EventDetails) |
    where IoTRawEventId == toscalar(id) |
    where extraDetails.BaselineCheckResult == "FAIL" |
    project DeviceId, CceId = extraDetails.BaselineCheckId, Description = extraDetails.BaselineCheckDescription
    ```

- **Specific device error** - Run this query to retrieve the latest information about checks that have an error on a specific device:

    ```kusto
    let id = SecurityIoTRawEvent |
    extend IoTRawEventId = extractjson("$.EventId", EventDetails, typeof(string)) |
    where TimeGenerated <= now() |
    where RawEventName == "Baseline" |
    where DeviceId == "<device-id>" |
    summarize arg_max(TimeGenerated, IoTRawEventId) |
    project IoTRawEventId;
    SecurityIoTRawEvent |
    extend IoTRawEventId = extractjson("$.EventId", EventDetails, typeof(string)), extraDetails = todynamic(EventDetails) |
    where IoTRawEventId == toscalar(id) |
    where extraDetails.BaselineCheckResult == "ERROR" |
    project DeviceId, CceId = extraDetails.BaselineCheckId, Description = extraDetails.BaselineCheckDescription
    ```

- **Update device list for device fleet that failed a specific check** - Run this query to retrieve updated list of devices (across the device fleet) that failed a specific check:  

    ```kusto
    let lastDates = SecurityIoTRawEvent |
    where RawEventName == "Baseline" |
    summarize TimeStamp=max(TimeStamp) by DeviceId;
    lastDates | join kind=inner (SecurityIoTRawEvent) on TimeStamp, DeviceId |
    extend event = parse_json(EventDetails) |
    where event.BaselineCheckResult == "FAIL" |
    where event.BaselineCheckId contains "6.2.8" |
    project DeviceId;
    ```

## Next steps

[Investigate security recommendations](quickstart-investigate-security-recommendations.md).
