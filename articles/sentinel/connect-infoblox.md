---
title: Connect Infoblox Network Identity Operating System (NIOS) data to Azure Sentinel| Microsoft Docs
description: Learn how to connect Infoblox Network Identity Operating System (NIOS) data to Azure Sentinel.
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
# Connect your Infoblox NIOS to Azure Sentinel

> [!IMPORTANT]
> The Infoblox NIOS data connector in Azure Sentinel is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

This article explains how to connect your [Infoblox Network Identity Operating System (NIOS) appliance](https://www.infoblox.com/glossary/network-identity-operating-system-nios/) to Azure Sentinel. The Infoblox NIOS data connector allows you to easily connect your Infoblox logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Integration between Infoblox NIOS and Azure Sentinel makes use of Syslog.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Forward Infoblox logs to the Syslog agent  

Configure Infoblox to forward Syslog messages to your Azure Sentinel workspace via the Syslog agent.

1. In the Azure Sentinel portal, click **Data connectors** and select **Infoblox NIOS** connector.

1. Select **Open connector page**.

1. Follow the instructions on the **Infoblox NIOS** page.

## Find your data

After a successful connection is established, the data appears in Log Analytics under Syslog.

## Validate connectivity

It may take up to 20 minutes until your logs start to appear in Log Analytics. 

## Next steps

In this document, you learned how to connect Infoblox NIOS to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.