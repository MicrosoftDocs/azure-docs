---
title: Configure Azure Sentinel for Defender for IoT (preview)
description: Explains how to configure Azure Sentinel to receive data from your Defender for IoT solution.
services: defender-for-iot
ms.service: defender-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin

ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/09/2020
ms.author: mlottner
---

# Connect your data from Defender for IoT to Azure Sentinel (preview)

The Azure Defender for IoT data connector in Azure Sentinel is currently in public preview. This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/en-us/support/legal/preview-supplemental-terms/).

In this guide, learn how to connect your Defender for IoT data to Azure Sentinel.

> [!div class="checklist"]
> * Prerequisites
> * Connection settings
> * Log Analytics alert view

Connect alerts from Defender for IoT and stream them directly into Azure Sentinel.

By more tightly integrating Azure Defender for IoT with Azure Sentinel, the first cloud-native SIEM and the first SIEM with native IoT and OT security, Microsoft provides a simpler approach to unified security across IT and industrial networks. When combined with Azure Sentinel’s machine learning, this integration enables organizations to quickly detect multistage attacks that often cross IT and OT boundaries. Additionally, Azure Defender for IoT’s integration with Azure Sentinel's security orchestration, automation, and response (SOAR) capabilities enables automated response and prevention using built-in OT-optimized playbooks. 

## Prerequisites

- You must have Workspace **read** and **write** permissions.
- **Defender for IoT** must be **enabled** on your relevant IoT Hub(s).
- You must have both **read** and **write** permissions on the **Azure IoT Hub** you wish to connect.
- You must also have **read** and **write** permissions on the **Azure IoT Hub resource group**.


## Connect to Defender for IoT

1. In Azure Sentinel, select **Data connectors** and then click the **Defender for IoT** tile.
1. From the bottom of the right pane, click **Open connector page**.
1. Click **Connect**, next to each IoT Hub subscription whose alerts and device alerts you want to stream into Azure Sentinel.
    - If Defender for IoT isn't enabled on that Hub, you'll see an Enable warning message. Click the **Enable** link to start and enable the service.
1. You can decide whether you want the alerts from Defender for IoT to automatically generate incidents in Azure Sentinel. Under **Create incidents**,  select **Enable** to enable the rule to automatically create incidents from the generated alerts.  This rule can be changed or edited under **Analytics** > **Active** rules.

> [!NOTE]
>It can take 10 seconds or more to refresh the hub list after making connection changes.

## Using Log Analytics for alert display

To use the relevant schema in Log Analytics to display the Defender for IoT alerts:

1. Open **Logs** > **SecurityInsights** > **SecurityAlert**, or search for **SecurityAlert**.
1. Filter to see only Defender for IoT generated alerts using the following kql filter:

```kusto
SecurityAlert | where ProductName == "Defender for IoT"
```

### Service notes

After connecting an IoT Hub, the hub data is available in Azure Sentinel approximately 15 minutes later.

## Next steps

In this document, you learned how to connect Defender for IoT to Azure Sentinel. To learn more about threat detection and security data access, see the following articles:

- Learn how to use Azure Sentinel to [get visibility into your data, and potential threats](https://docs.microsoft.com/azure/sentinel/quickstart-get-visibility).

- Learn how to [Access your IoT security data](how-to-security-data-access.md)
