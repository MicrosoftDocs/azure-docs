---
title: Connect Proofpoint Targeted Attack Protection (TAP) data to Azure Sentinel| Microsoft Docs
description: Learn how to connect Proofpoint Targeted Attack Protection (TAP) data to Azure Sentinel.
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
# Connect your Proofpoint TAP to Azure Sentinel with Azure Function

> [!IMPORTANT]
> The Proofpoint TAP data connector in Azure Sentinel is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The Proofpoint Targeted Attack Protection (TAP) connector allows you to easily connect all your [Proofpoint TAP](https://www.proofpoint.com/us/products/advanced-threat-protection/targeted-attack-protection) security solution logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Integration between Proofpoint TAP and Azure Sentinel makes use of Azure Functions to pull log data using REST API.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect Proofpoint TAP

Azure Functions can integrate and pull events and logs directly from Proofpoint TAP and forward them to Azure Sentinel.

1. In the Azure Sentinel portal, click **Data connectors** and select **Proofpoint TAP** connector.

1. Select **Open connector page**.

1. Follow the instructions on the **Proofpoint TAP** page.

## Find your data

After a successful connection is established, the data appears in Log Analytics under the **ProofpointTAPMessagesBlocked_CL**, **ProofpointTAPMessagesDelivered_CL**, **ProofpointTAPClicksPermitted_CL** and **ProofpointTAPClicksBlocked_CL** tables.

## Validate connectivity

It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Next steps

In this document, you learned how to connect Proofpoint TAP to Azure Sentinel using Azure Function Apps. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
