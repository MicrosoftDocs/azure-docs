---
title: Connect VMware Carbon Black Cloud Endpoint Standard data to Azure Sentinel| Microsoft Docs
description: Learn how to connect VMware Carbon Black Cloud Endpoint Standard data to Azure Sentinel.
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
# Connect your VMware Carbon Black Cloud Endpoint Standard to Azure Sentinel with Azure Function

> [!IMPORTANT]
> The VMware Carbon Black Cloud Endpoint Standard data connector in Azure Sentinel is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

The VMware Carbon Black Cloud Endpoint Standard connector allows you to easily connect all your [VMware Carbon Black Endpoint Standard](https://www.carbonblack.com/products/endpoint-standard/) security solution logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Integration between VMware Carbon Black and Azure Sentinel makes use of Azure Functions to pull log data using REST API.


> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect VMware Carbon Black Cloud Endpoint Standard

Azure Functions can integrate and pull events and logs directly from VMware Carbon Black Cloud Endpoint Standard, and forward them to Azure Sentinel.

1. In the Azure Sentinel portal, click **Data connectors** and select **VMware Carbon Black** connector.
2. Select **Open connector page**.
3. Follow the instructions on the **VMware Carbon Black** page.


## Find your data

After a successful connection is established, the data appears in Log Analytics under the **CarbonBlackAuditLogs_CL**, **CarbonBlackNotifications_CL** and ****CarbonBlackEvents_CL**** tables.

## Validate connectivity
It may take up to 20 minutes until your logs start to appear in Log Analytics. 


## Next steps
In this document, you learned how to connect VMware Carbon Black Cloud Endpoint Standard to Azure Sentinel using Azure Function Apps. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.

