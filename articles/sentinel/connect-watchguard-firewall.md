---
title: Connect WatchGuard Firebox data to Azure Sentinel | Microsoft Docs
description: Learn how to use the WatchGuard Firebox connector to pull Firebox logs into Azure Sentinel. View Firebox data in workbooks, create alerts, and improve investigation.
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
# Connect your WatchGuard Firebox appliance to Azure Sentinel

> [!IMPORTANT]
> The WatchGuard Firebox connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article explains how to connect your WatchGuard Firebox appliance to Azure Sentinel. The WatchGuard Firebox data connector allows you to easily connect your WatchGuard Firebox logs with Azure Sentinel, so that you can view the data in workbooks, use it to create custom alerts, and incorporate it to improve investigation. Integration between WatchGuard Firebox and Azure Sentinel makes use of Syslog.

> [!NOTE] 
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

- You must have read and write permission on the Azure Sentinel workspace.

- Your WatchGuard Firebox appliance must be configured to export logs via Syslog.

- </IF REQUIRED> You must have read permissions to shared keys for the workspace.

- </OTHERS IF REQUIRED>

## Forward WatchGuard Firebox logs to the Syslog agent

Configure WatchGuard Firebox to forward Syslog messages to your Azure workspace via the Syslog agent.

1. In the Azure Sentinel navigation menu, select **Data connectors**.

1. From the **Data connectors** gallery, select the **WatchGuard Firebox (Preview)** connector, and then **Open connector page**.

1. Follow the instructions on the **WatchGuard Firebox** connector page:

    1. Install and onboard the agent for Linux

        - Choose an Azure Linux VM or a non-Azure Linux machine (physical or virtual).

    1. Configure the logs to be collected

        - Select the facilities and severities in the workspace advanced settings configuration.

    1. Configure and connect the WatchGuard Firebox

        - Follow [these instructions](https://www.watchguard.com/help/docs/help-center/en-US/Content/en-US/Fireware/logging/set_up_logging_on_device_wsm.html?cshid=1040) to define where the Firebox sends Syslog messages. For the remote server, use the IP address of the Linux machine you installed the Linux agent on.

## Find your data

After a successful connection is established, the data appears in **Logs**, under *Syslog*.

See the **Next steps** tab in the connector page for some useful sample queries.

## Validate connectivity

It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Next steps

In this document, you learned how to connect WatchGuard Firebox to Azure Sentinel. To learn more about Azure Sentinel, see the following  articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
