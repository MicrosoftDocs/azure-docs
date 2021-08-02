---
title: Connect VMware ESXi data to Azure Sentinel | Microsoft Docs
description: Learn how to use the VMware ESXi data connector to pull ESXi logs into Azure Sentinel. View ESXi data in workbooks, create alerts, and improve investigation.
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
ms.date: 03/01/2021
ms.author: yelevin

---
# Connect your VMware ESXi to Azure Sentinel

> [!IMPORTANT]
> The VMware ESXi connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

This article explains how to connect your VMware ESXi appliance to Azure Sentinel. The VMware ESXi data connector allows you to easily ingest your VMware ESXi logs into Azure Sentinel, giving you more insight into your organization's ESXi activities and helping improve your Security Operations capabilities. Integration between VMware ESXi and Azure Sentinel makes use of a Syslog server with the Log Analytics agent installed. It also uses a custom-built log parser based on a Kusto function.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

- You must have read and write permission on the Azure Sentinel workspace.

- Your VMware ESXi solution must be configured to export logs via Syslog.

## Send VMware ESXi logs to the Syslog agent  

Configure VMware ESXi to forward Syslog messages to your Azure Sentinel workspace via the Syslog agent.
3. Follow the instructions on the **VMware ESXi** page.


1. In the Azure Sentinel navigation menu, select **Data connectors**.

1. From the **Data connectors** gallery, select the **VMware ESXi (Preview)** connector, and then **Open connector page**.

1. Follow the instructions on the **VMware ESXi** connector page:

    1. Install and onboard the agent for Linux

        - Choose an Azure Linux VM or a non-Azure Linux machine (physical or virtual).

    1. Configure the logs to be collected

        - Select the facilities and severities in the **workspace agents configuration**.

    1. Configure and connect the VMware ESXi

        - Follow these instructions to configure the VMware ESXi to forward syslog:
            - [VMware ESXi 3.5 and 4.x](https://kb.vmware.com/s/article/1016621)
            - [VMware ESXi 5.0 and higher](https://docs.vmware.com/en/VMware-vSphere/5.5/com.vmware.vsphere.monitoring.doc/GUID-9F67DB52-F469-451F-B6C8-DAE8D95976E7.html)

            For the remote server, use the IP address of the Linux machine you installed the Linux agent on.

## Validate connectivity and find your data

It may take up to 20 minutes until your logs start to appear in Azure Sentinel. 

After a successful connection is established, the data appears in **Logs**, under the *Log Management* section, in the *Syslog* table.

This data connector depends on a parser based on a Kusto Function to work as expected. [Follow these steps](https://aka.ms/sentinel-vmwareesxi-parser) to create the **VMwareESXi** Kusto function alias. Then you can type `VMwareESXi` in any query window in Azure Sentinel to query the data.

See the **Next steps** tab in the connector page for some useful query samples.

## Next steps

In this document, you learned how to connect VMware ESXi to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
