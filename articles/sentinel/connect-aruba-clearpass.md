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
# Connect your Aruba ClearPass to Azure Sentinel

> [!IMPORTANT]
> The <PRODUCT NAME> connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article explains how to connect your Aruba ClearPass appliance to Azure Sentinel. The Aruba ClearPass data connector allows you to easily connect your Aruba ClearPass logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. 

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Forward Aruba ClearPass logs to the Syslog agent  

Configure Aruba ClearPass to forward Syslog messages in CEF format to your Azure workspace via the Syslog agent.

1. In the Azure Sentinel portal, click **Data connectors** and select **Aruba ClearPass** connector.

1. Select **Open connector page**.

1. Follow the instructions on the **Aruba ClearPass** page.

## Validate connectivity

It may take upwards of 20 minutes until your logs start to appear in Log Analytics. 

If the expected logs do not appear, continue to [validate connectivity](connect-cef-verify.md) for troubleshooting.

## Find your data

After a successful connection is established, to use the relevant schema in Log Analytics for the Aruba ClearPass, search for the **CommonSecurityLog** table.

## Next steps

In this document, you learned how to connect Aruba ClearPass to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
