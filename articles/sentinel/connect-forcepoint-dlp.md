---
title: Connect Forcepoint DLP to Azure Sentinel| Microsoft Docs
description: Learn how to connect Forcepoint DLP to Azure Sentinel.
services: sentinel
author: yelevin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/20/2020
ms.author: yelevin

---


# Connect your Forcepoint DLP to Azure Sentinel

> [!IMPORTANT]
> The Forcepoint Data Loss Prevention (DLP) data connector in Azure Sentinel is currently in public preview. This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).



The Forcepoint DLP connector lets you automatically export DLP incident-data into Azure Sentinel. You can use it to get visibility into user activities and data loss incidents. It also enables correlations with data from Azure workloads and other feeds, and improves monitoring capability with Workbooks inside Azure Sentinel.
​
> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect Forcepoint DLP

​Configure Forcepoint DLP to forward incident data in JSON format to your Azure workspace via REST API as explained in the [Forcepoint DLP Integration Guide](https://frcpnt.com/dlp-sentinel).

​
## Find your data

After the Forcepoint DLP connector is set up, the data appears in Log Analytics under CustomLogs **ForcepointDLPEvents_CL**.


To use the relevant schema in Log Analytics for Forcepoint DLP, search for **ForcepointDLPEvents_CL**.

​
## Validate connectivity
​
It may take upwards of 20 minutes until your logs start to appear in Log Analytics.

## Next steps

In this document, you learned how to connect Forcepoint DLP to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.