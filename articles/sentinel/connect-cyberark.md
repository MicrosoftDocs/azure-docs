---
title: Connect CyberArk EPV data to Azure Sentinel| Microsoft Docs
description: Learn how to use the CyberArk Enterprise Password Vault (EPV) data connector to pull its logs into Azure Sentinel. View CyberArk EPV data in workbooks, create alerts, and improve investigation.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.assetid: 0001cad6-699c-4ca9-b66c-80c194e439a5
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/25/2020
ms.author: yelevin

---

# Connect CyberArk Enterprise Password Vault (EPV) to Azure Sentinel

> [!IMPORTANT]
> The CyberArk Enterprise Password Vault (EPV) data connector in Azure Sentinel is currently in public preview. This feature is provided without a service level agreement. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The CyberArk Syslog connector allows you to easily connect all your CyberArk security solution logs with your Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Integration between CyberArk and Azure Sentinel makes use of the CEF Data Connector to properly parse and display CyberArk Syslog messages.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect CyberArk EPV

CyberArk EPV logs are sent from the Vault to a Linux-based log forwarding server (running rsyslog or syslog-ng) with the Log Analytics agent installed on it, which exports the logs to Azure Sentinel. If you don't have such a log forwarding server, see [these instructions](connect-cef-agent.md) to get one up and running.

1. In the Azure Sentinel portal, click **Data connectors**, select **CyberArk Enterprise Password Vault (EPV) Events (Preview)** and then **Open connector page**.

1. Follow the [CyberArk EPV instructions](https://docs.cyberark.com/Product-Doc/OnlineHelp/PAS/Latest/en/Content/PASIMP/DV-Integrating-with-SIEM-Applications.htm) to configure sending syslog data to the log forwarding server.

1. Validate your connection and verify data ingestion using [these instructions](connect-cef-verify.md). It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Find your data

After a successful connection is established, the data appears in **Logs**, under the **Azure Sentinel** section, in the *CommonSecurityLog* table.

To query the CyberArk EPV logs in Log Analytics, enter `CommonSecurityLog` at the top of the query window.

## Next steps

In this document, you learned how to connect CyberArk Enterprise Password Vault logs to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
