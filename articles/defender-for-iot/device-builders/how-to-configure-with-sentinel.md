---
title: Configure Microsoft Sentinel with Defender for IoT for device builders
description: This article explains how to configure Microsoft Sentinel to receive data from your Defender for IoT for device builders solution.
ms.topic: how-to
ms.date: 11/09/2021
---

# Connect your data from Defender for IoT for device builders to Microsoft Sentinel (Public preview)

Use the Defender for IoT connector to stream all your Defender for IoT events into Microsoft Sentinel. 

This integration enables organizations to quickly detect multistage attacks that often cross IT and OT boundaries. Additionally, Defender for IoT’s integration with Microsoft Sentinel's security orchestration, automation, and response (SOAR) capabilities enables automated response and prevention using built-in OT-optimized playbooks. 

## Prerequisites

- **Read** and **Write** permissions on the Workspace onto which Microsoft Sentinel is deployed
- **Defender for IoT** must be **enabled** on your relevant IoT Hub(s)
- You must have **Contributor** permissions on the **Subscription** you want to connect

## Connect to Defender for IoT

1. In Microsoft Sentinel, select **Data connectors** and then select the **Defender for IoT** (formerly Azure Security Center for IoT) from the gallery.

1. From the bottom of the right pane, click **Open connector page**.

1. Click **Connect**, next to each IoT Hub subscription whose alerts and device alerts you want to stream into Microsoft Sentinel.
    - You will receive an error message if Defender for IoT is not enabled on  at least one IoT Hub within a subscription. Enable Defender for IoT within the IoT Hub to remove the error.

1. You can decide whether you want the alerts from Defender for IoT to automatically generate incidents in Microsoft Sentinel. Under **Create incidents**,  select **Enable** to enable the default analytics rule to automatically create incidents from the generated alerts. This rule can be changed or edited under **Analytics** > **Active rules**.

> [!NOTE]
> It can take 10 seconds or more for the **Subscription** list to refresh after making connection changes. 

## Log Analytics alert view

To use the relevant schema in Log Analytics to display the Defender for IoT alerts:

1. Open **Logs** > **SecurityInsights** > **SecurityAlert**, or search for **SecurityAlert**.

1. Filter to see only Defender for IoT generated alerts using the following kql filter:

```kusto
SecurityAlert | where ProductName == "Azure Security Center for IoT"
```

### Service notes

After connecting a **Subscription**, the hub data is available in Microsoft Sentinel approximately 15 minutes later.

## Next steps

In this document, you learned how to connect Defender for IoT to Microsoft Sentinel. To learn more about threat detection and security data access, see the following articles:

- Learn how to use Microsoft Sentinel to [Quickstart: Get started with Microsoft Sentinel](../../sentinel/get-visibility.md).
- Learn how to [Access your IoT security data](how-to-security-data-access.md)
