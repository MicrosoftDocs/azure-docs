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
# Connect your Alsid for Active Directory to Azure Sentinel

> [!IMPORTANT]
> The <PRODUCT NAME> connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article explains how to connect your Alsid for AD appliance to Azure Sentinel. The Alsid for AD data connector allows you to easily connect your Alsid for AD logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Forward Alsid for AD logs to Azure Sentinel

1. In the Azure portal, navigate to Azure Sentinel > Data connectors and then select the Alsid for Active Directory connector.

1. Select Open connector page.

1. Follow the instructions on the Alsid for Active Directory page.

## Find your data

After a successful connection is established, the data appears in Log Analytics under the AlsidForADLog_CL table.

## Validate connectivity

It may take up to 20 minutes before your logs start to appear in Log Analytics.
You can then write a simple query in the *Log* tab to check that data is correctly flowing by using the provided data parser:
```kql
afad_parser
```

## Next steps

In this document, you learned how to connect <PRODUCT NAME> to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
