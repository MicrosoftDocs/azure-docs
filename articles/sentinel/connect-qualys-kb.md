---
title: Connect <PRODUCT NAME> data to Azure Sentinel | Microsoft Docs
description: Learn how to use the <PRODUCT NAME> connector to pull <PRODUCT NAME> logs into Azure Sentinel. View <PRODUCT NAME> data in workbooks, create alerts, and improve investigation.
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
ms.date: 01/26/2021
ms.author: yelevin
---
# Connect your Qualys VM KnowledgeBase (KB) to Azure Sentinel with Azure Function

> [!IMPORTANT]
> The <PRODUCT NAME> connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The Qualys KB connector allows you to easily connect all your Qualys KB security solution logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Integration between Qualys KB and Azure Sentinel makes use of Azure Functions to pull log data using REST API.


> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect Qualys KB

Azure Functions can integrate and pull events and logs directly from Qualys KB and forward them to Azure Sentinel.

1. In the Azure Sentinel portal, click **Data connectors** and select **Qualys KB** connector.
2. Select **Open connector page**.
3. Follow the instructions on the **Qualys KB** page.


## Find your data

After a successful connection is established, the data appears in Log Analytics under the **QualysVM_CL** table.

## Validate connectivity
It may take upwards of 20 minutes until your logs start to appear in Log Analytics. 


## Next steps
In this document, you learned how to connect Qualys KB to Azure Sentinel using Azure Function Apps. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.

