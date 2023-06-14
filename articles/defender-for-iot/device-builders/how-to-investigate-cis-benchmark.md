---
title: Investigate CIS benchmark recommendation
description: Perform basic and advanced investigations based on OS baseline recommendations.
ms.date: 05/03/2022
ms.topic: how-to
---

# Investigate OS baseline (based on CIS benchmark) recommendation

Perform basic and advanced investigations based on OS baseline recommendations.

> [!NOTE]
> The Microsoft Defender for IoT legacy experience under IoT Hub has been replaced by our new Defender for IoT standalone experience, in the Defender for IoT area of the Azure portal. The legacy experience under IoT Hub will not be supported after **March 31, 2023**.

## Basic OS baseline security recommendation investigation

You can investigate OS baseline recommendations by navigating to [Defender for IoT in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started). For more information, see how to [Investigate security recommendations](quickstart-investigate-security-recommendations.md).

## Advanced OS baseline security recommendation investigation

This section describes how to better understand the OS baseline test results, and querying events in Azure Log Analytics.

**Prerequisites**:

The advanced OS baseline security recommendation investigation is only supported by using Azure Log Analytics and you must connect Defender for IoT to a Log Analytics workspace before continuing.

For more information, see [Configure Microsoft Defender for IoT agent-based solution](tutorial-configure-agent-based-solution.md).

**To query your IoT security events in Log Analytics for alerts**:

1. In your Log Analytics workspace, go to **Logs** > **AzureSecurityOfThings** > **SecurityAlert**.

1. In the query editor on the right, enter a KQL query to display the alerts you want to see. 

1. Select **Run** to display the alerts that match your query.

For example:

:::image type="content" source="media/how-to-investigate-cis-benchmark/log-analytics.png" alt-text="Screenshot of the Log Analytics workspace with a Defender for I o T alert query." lightbox="media/how-to-investigate-cis-benchmark/log-analytics.png":::

> [!NOTE]
> In addition to alerts, you can also use this same procedure to query for recommendations or raw event data.
>

## Useful queries to investigate the OS baseline resources

> [!Note]
> Make sure to replace `<device-id>` with the name(s) you gave your device in each of the following queries.

### Retrieve the latest information

- **Device fleet failure**: Run this query to retrieve the latest information about checks that failed across the device fleet:

    ```kusto
    let lastDates = SecurityIoTRawEvent |
    where RawEventName == "Baseline" |
    summarize TimeStamp=max(TimeStamp) by DeviceId;
    lastDates | join kind=inner (SecurityIoTRawEvent) on TimeStamp, DeviceId |
    extend event = parse_json(EventDetails) |
    where event.BaselineCheckResult == "FAIL" |
    project DeviceId, event.BaselineCheckId, event.BaselineCheckDescription
    ```

- **Specific device failure** - Run this query to retrieve the latest information about checks that failed on a specific device:  

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
