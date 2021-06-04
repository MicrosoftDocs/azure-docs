---
title: Connect Orca Security alerts to Azure Sentinel| Microsoft Docs
description: Learn how to connect Orca Security alert data to Azure Sentinel, to view dashboards, create custom alerts, and improve investigation.
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
ms.date: 07/17/2020
ms.author: yelevin

---

# Connect your Orca Security alerts to Azure Sentinel 

> [!IMPORTANT]
> The Orca Security alerts connector in Azure Sentinel is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

Orca Security alerts connector allows you to easily bring your [Orca alerts](https://orca.security/) security solution alerts into Azure Sentinel, so that you can view them in workbooks, use them to create custom alerts, and incorporate them to improve investigation. Integration between Orca Security alerts and Azure Sentinel makes use of REST API.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect Orca Security alerts

Orca Security alerts can integrate and export logs directly to Azure Sentinel.

1. In the Azure Sentinel portal, click **Data connectors** and select **Orca Security alerts** and then **Open connector page**.

2. Refer to https://orcasecurity.zendesk.com/hc/en-us/articles/360043941992-Azure-Sentinel-integration to complete integration from the Orca platform.

## Find your data

After a successful connection is established, the data appears in Log Analytics under **CustomLogs** in the **OrcaAlerts_CL** table.
To use the relevant schema in Log Analytics for the Orca alerts, search for `OrcaAlerts_CL`.

## Validate connectivity
It may take up to 20 minutes until your logs start to appear in Log Analytics. 


## Next steps
In this document, you learned how to connect Orca security alerts to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.

