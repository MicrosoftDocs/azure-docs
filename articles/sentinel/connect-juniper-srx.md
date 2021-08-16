---
title: Connect Juniper Networks SRX data to Azure Sentinel| Microsoft Docs
description: Learn how to use the Juniper SRX data connector to pull Juniper SRX logs into Azure Sentinel. View Juniper SRX data in workbooks, create alerts, and improve investigation.
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
# Connect your Juniper SRX firewall to Azure Sentinel

> [!IMPORTANT]
> The Juniper SRX connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

This article explains how to connect your Juniper SRX firewall appliance to Azure Sentinel. The Juniper SRX data connector allows you to easily connect your SRX logs with Azure Sentinel, so that you can view the data in workbooks, use it to create custom alerts, and incorporate it to improve investigation. Integration between Juniper SRX and Azure Sentinel makes use of Syslog.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

- You must have read and write permission on the Azure Sentinel workspace.

- Your Juniper SRX solution must be configured to export logs via Syslog.

## Forward Juniper SRX logs to the Syslog agent  

Configure Juniper SRX to forward Syslog messages to your Azure Sentinel workspace via the Syslog agent.

1. In the Azure Sentinel navigation menu, select **Data connectors**.

1. From the **Data connectors** gallery, select the **Juniper SRX (Preview)** connector, and then **Open connector page**.

1. Follow the instructions on the **Juniper SRX** connector page:

    1. Install and onboard the agent for Linux

        - Choose an Azure Linux VM or a non-Azure Linux machine (physical or virtual).

    1. Configure the logs to be collected

        - Select the facilities and severities in the workspace agents configuration.

    1. Configure and connect the Juniper SRX

        - Follow these instructions to configure the Juniper SRX to forward syslog.
            - [Traffic logs (Security policy logs)](https://kb.juniper.net/InfoCenter/index?page=content&id=KB16509&actp=METADATA)
            - [System logs](https://kb.juniper.net/InfoCenter/index?page=content&id=kb16502)
        - For the remote server, use the IP address of the Linux machine you installed the Linux agent on.

## Find your data

After a successful connection is established, the data appears in Log Analytics under Syslog.

See the **Next steps** tab in the connector page for some useful sample queries.

## Validate connectivity

It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Next steps

In this document, you learned how to connect Juniper SRX to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.