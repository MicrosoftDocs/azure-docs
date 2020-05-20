---
title: Configure Sentinel (preview)
description: Explains how to configure Azure Sentinel to receive data from your Azure Security Center for IoT solution.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin

ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/18/2020
ms.author: mlottner
---

# Connect your data from Azure Security Center for IoT to Azure Sentinel (preview)

> [!IMPORTANT]
> The Azure Security Center for IoT data connector in Azure Sentinel is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this guide, learn how to connect your Azure Security Center for IoT data to Azure Sentinel.

> [!div class="checklist"]
> * Prerequisites
> * Connection settings
> * Log Analytics alert view

Connect alerts from Azure Security Center for IoT and stream them directly into Azure Sentinel.

## Prerequisites

- You must have Workspace **read** and **write** permissions.
- **Azure Security Center for IoT** must be **enabled** on your relevant IoT Hub(s).
- You must have both **read** and **write** permissions on the **Azure IoT Hub** you wish to connect.
- You must also have **read** and **write** permissions on the **Azure IoT Hub resource group**.

> [!NOTE]
> You must have the Azure Security Center Standard tier licensing running on your subscription to send general Azure resource alerts. With the free tier licensing required for Azure Security Center for IoT, only Azure Security Center for IoT related alerts will be forwarded to Azure Sentinel.

## Connect to Azure Security Center for IoT

1. In Azure Sentinel, select **Data connectors** and then click the **Azure Security Center for IoT** tile.
1. From the bottom of the right pane, click **Open connector page**.
1. Click **Connect**, next to each IoT Hub subscription whose alerts and device alerts you want to stream into Azure Sentinel.
    - If Azure Security Center for IoT isn't enabled on that Hub, you'll see an Enable warning message. Click the **Enable** link to start and enable the service.
1. You can decide whether you want the alerts from Azure Security Center for IoT to automatically generate incidents in Azure Sentinel. Under **Create incidents**,  select **Enable** to enable the rule to automatically create incidents from the generated alerts.  This rule can be changed or edited under **Analytics** > **Active** rules.

> [!NOTE]
>It can take 10 seconds or more to refresh the hub list after making connection changes.

## Log Analytics alert display

To use the relevant schema in Log Analytics to display  the Azure Security Center for IoT alerts:

1. Open **Logs** > **SecurityInsights** > **SecurityAlert**, or search for **SecurityAlert**.
1. Filter to see only Azure Security Center for IoT generated alerts using the following kql filter:

```kusto
SecurityAlert | where ProductName == "Azure Security Center for IoT"
```

### Service notes

After connecting an IoT Hub, the hub data is available in Azure Sentinel approximately 15 minutes later.

## Next steps

In this document, you learned how to connect Azure Security Center for IoT to Azure Sentinel. To learn more about threat detection and security data access, see the following articles:

- Learn how to use Azure Sentinel to [get visibility into your data, and potential threats](https://docs.microsoft.com/azure/sentinel/quickstart-get-visibility).

- Learn how to [Access your IoT security data](how-to-security-data-access.md)
