---
title: Connect Azure Defender for IoT to Azure Sentinel | Microsoft Docs
description: Learn how to connect Azure Defender (formerly Azure Security Center) for IoT data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/16/2020
ms.author: yelevin

---


# Connect your data from Azure Defender (formerly Azure Security Center) for IoT to Azure Sentinel 


> [!IMPORTANT]
> The Defender for IoT data connector is currently in public preview. This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Use the Defender for IoT connector to stream all your Defender for IoT events into Azure Sentinel. 

> [!div class="checklist"]
> * Prerequisites
> * Connection settings
> * Log Analytics alert view

This integration enables organizations to quickly detect multistage attacks that often cross IT and OT boundaries. Additionally, Defender for IoT’s integration with Azure Sentinel's security orchestration, automation, and response (SOAR) capabilities enables automated response and prevention using built-in OT-optimized playbooks. 
## Prerequisites

- **Read** and **Write** permissions on the Workspace onto which Azure Sentinel is deployed
- **Defender for IoT** must be **enabled** on your relevant IoT Hub(s)
- You must have **Contributor** permissions on the **Subscription** you want to connect

## Connect to Defender for IoT

1. In Azure Sentinel, select **Data connectors** and then select **Defender for IoT** tile.
1. From the bottom of the right pane, click **Open connector page**. 
1. Click **Connect**, next to each IoT Hub subscription whose alerts and device alerts you want to stream into Azure Sentinel. 
    - If Defender for IoT is not enabled on any IoT Hub, you’ll see an **Enable** warning message. Click the **Enable** link to start the service. 
1. You can decide whether you want the alerts from Defender for IoT to automatically generate incidents in Azure Sentinel. Under **Create incidents**,  select **Enable** to enable the default analytic rule to automatically create incidents from the generated alerts. This rule can be changed or edited under **Analytics** > **Active** rules.

> [!NOTE]
> It can take 10 seconds or more for the **Subscription** list to refresh after making connection changes. 

## Log Analytics alert view

To use the relevant schema in Log Analytics to display the Defender for IoT alerts:

1. Open **Logs** > **SecurityInsights** > **SecurityAlert**, or search for **SecurityAlert**. 
2. Filter to see only Defender for IoT generated alerts using the following kql filter:

```kusto
SecurityAlert | where ProductName == "Azure Security Center for IoT"
``` 

### Service notes

After connecting a **Subscription**, the hub data is available in Azure Sentinel approximately 15 minutes later.


## Next steps

In this document, you learned how to connect Defender for IoT to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
