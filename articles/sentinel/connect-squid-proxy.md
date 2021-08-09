---
title: Connect Squid Proxy data to Azure Sentinel| Microsoft Docs
description: Learn how to use the Squid Proxy data connector to pull Squid Proxy logs into Azure Sentinel. View Squid Proxy data in workbooks, create alerts, and improve investigation.
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
ms.date: 01/17/2021
ms.author: yelevin

---
# Connect your Squid Proxy to Azure Sentinel

> [!IMPORTANT]
> The Squid Proxy connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

This article explains how to connect your Squid Proxy appliance to Azure Sentinel. The Squid Proxy data connector allows you to easily connect your Squid logs with Azure Sentinel, so that you can view the data in workbooks, use it to create custom alerts, and incorporate it to improve investigation. Integration between Squid Proxy and Azure Sentinel makes use of local file processing by the Log Analytics agent.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

- You must have read and write permission on the Azure Sentinel workspace.

## Forward Squid Proxy logs to the Log Analytics agent  

Configure Squid Proxy to send log files to your Azure workspace via the Log Analytics agent.

1. In the Azure Sentinel navigation menu, select **Data connectors**.

1. From the **Data connectors** gallery, select the **Squid Proxy (Preview)** connector, and then **Open connector page**.

1. Follow the instructions on the **Squid Proxy** connector page:

    1. Install and onboard the agent for Linux

        - Choose an Azure Linux VM or a non-Azure Linux machine (physical or virtual).

    1. Configure the logs to be collected

        - In the workspace advanced settings, add a custom log type, upload a sample file, and configure as directed.

## Find your data

After a successful connection is established, the data appears in **Logs**, under **Custom Logs**, in the `SquidProxy_CL` table.

See the **Next steps** tab in the connector page for some useful sample queries.

## Validate connectivity

It may take up to 20 minutes until your logs start to appear in Log Analytics. 

## Next steps

In this document, you learned how to connect Squid Proxy to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
