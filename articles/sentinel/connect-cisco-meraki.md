---
title: Connect Cisco Meraki data to Azure Sentinel | Microsoft Docs
description: Learn how to use the Cisco Meraki connector to pull Cisco Meraki logs into Azure Sentinel. View Cisco Meraki data in workbooks, create alerts, and improve investigation.
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
ms.date: 02/28/2021
ms.author: yelevin
---
# Connect your Cisco Meraki to Azure Sentinel

> [!IMPORTANT]
> The Cisco Meraki connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

This article explains how to connect your Cisco Meraki (MX/MS/MR) appliance(s) to Azure Sentinel. The Cisco Meraki data connector allows you to easily connect your Cisco Meraki logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Integration between Cisco Meraki and Azure Sentinel makes use of a Syslog server with the Log Analytics agent installed. It also uses a custom-built log parser based on a Kusto function.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

- You must have read and write permission on the Azure Sentinel workspace.

- Your Cisco Meraki solution must be configured to export logs via Syslog.

## Send Cisco Meraki logs to Azure Sentinel via the Syslog agent  

Configure Cisco Meraki to forward Syslog messages to your Azure Sentinel workspace via the Syslog agent.

1. In the Azure Sentinel navigation menu, select **Data connectors**.

1. From the **Data connectors** gallery, select the **Cisco Meraki (Preview)** connector, and then **Open connector page**.

1. Follow the instructions on the **Cisco Meraki** connector page:

    1. Install and onboard the agent for Linux

        - Choose an Azure Linux VM or a non-Azure Linux machine (physical or virtual).

    1. Configure the logs to be collected

        - Select the facilities and severities in the **workspace agents configuration**.

    1. Configure and connect the Cisco Meraki device(s)

        - Follow [these instructions](https://documentation.meraki.com/General_Administration/Monitoring_and_Reporting/Meraki_Device_Reporting_-_Syslog%2C_SNMP_and_API) to configure the Cisco Meraki device(s) to forward syslog. For the remote server, use the IP address of the Linux machine you installed the Linux agent on.

## Validate connectivity and find your data

It may take up to 20 minutes until your logs start to appear in Azure Sentinel. 

After a successful connection is established, the data appears in **Logs**, under the *Log Management* section, in the *Syslog* table.

This data connector depends on a parser based on a Kusto Function to work as expected. [Follow these steps](https://aka.ms/sentinel-ciscomeraki-parser) to create the **CiscoMeraki** Kusto function alias. Then you can type `CiscoMeraki` in the query window to query the data.

See the **Next steps** tab in the connector page for some useful query samples.

## Next steps

In this document, you learned how to connect Cisco Meraki to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
