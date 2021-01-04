---
title: Connect Qualys Vulnerability Management data to Azure Sentinel| Microsoft Docs
description: Learn how to connect Qualys Vulnerability Management data to Azure Sentinel.
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
# Connect your Qualys VM to Azure Sentinel with Azure Function

> [!IMPORTANT]
> The Qualys VM data connector in Azure Sentinel is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The Qualys Vulnerability Management (VM) connector allows you to easily connect all your [Qualys VM](https://www.qualys.com/apps/vulnerability-management/) security solution logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Integration between Qualys VM and Azure Sentinel makes use of Azure Functions to pull log data using REST API.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect Qualys VM

Azure Functions can integrate and pull events and logs directly from Qualys VM and forward them to Azure Sentinel.

1. In the Azure Sentinel portal, click **Data connectors** and select **Qualys Vulnerability Management** connector.

1. Select **Open connector page**.

1. Follow the instructions on the **Qualys Vulnerability Management** page.

## Find your data

After a successful connection is established, the data appears in Log Analytics under the **QualysHostDetection_CL** table.

## Validate connectivity

It may take upwards of 20 minutes until your logs start to appear in Log Analytics.

## Next steps

In this document, you learned how to connect Qualys VM to Azure Sentinel using Azure Function Apps. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
