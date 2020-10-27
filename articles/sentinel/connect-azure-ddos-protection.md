---
title: Connect Azure DDoS Protection data to Azure Sentinel
description: Learn how to ingest Azure DDoS Protection data into Azure Sentinel, so you can view it, analyze it, and investigate it.
author: yelevin
manager: rkarlin
ms.assetid: bfa2eca4-abdc-49ce-b11a-0ee229770cdd
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: how-to
ms.date: 09/01/2020
ms.author: yelevin
---
# Connect data from Azure DDoS Protection

> [!IMPORTANT]
> The Azure DDoS Protection data connector in Azure Sentinel is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Distributed denial of service (DDoS) attacks attempt to exhaust an application's resources, making the application unavailable to legitimate users. DDoS attacks can be targeted at any endpoint that is publicly reachable through the internet. [Azure DDoS protection](../virtual-network/ddos-protection-overview.md), combined with application design best practices, provides a robust defense against DDoS attacks. You can connect Azure DDoS Protection logs to Azure Sentinel, enabling you to view log data in workbooks, use it to create custom alerts, and incorporate it to improve your investigations. 

## Prerequisites

- You must have read and write permissions on the Azure Sentinel workspace.

- You must have a configured [Azure DDoS Standard protection plan](../virtual-network/manage-ddos-protection.md#create-a-ddos-protection-plan).

- You must have a configured [virtual network with Azure DDoS Standard enabled](../virtual-network/manage-ddos-protection.md#enable-ddos-for-a-new-virtual-network).

## Connect to Azure DDoS Protection
	
1. From the Azure Sentinel navigation menu, select **Data connectors**.

1. Select **Azure DDoS Protection** from the data connectors gallery, and then select **Open Connector Page** on the preview pane.

1. Enable **Diagnostic logs** on all the firewalls whose logs you wish to connect:

    1. Select the **Open Diagnostics settings >** link, and choose a **Public IP Address** resource from the list.

    1. Select **+ Add diagnostic setting**.​

    1. In the **Diagnostics settings** screen:
       - Enter a name in the  **Diagnostic setting name** field.

       - Mark the **Send to Log Analytics** check box. Two new fields will be displayed below it. Choose the relevant **Subscription** and **Log Analytics Workspace** (where Azure Sentinel resides).​

       - Mark the check boxes of the rule types whose logs you want to ingest. We recommend **DDoSProtectionNotifications**, **DDoSMitigationFlowLogs**, and **DDoSMitigationReports**.​

    1. Click **Save** at the top of the screen. Repeat this process for any additional firewalls (public IP addresses) for which you have enabled DDoS protection.

1. To use the relevant schema in Log Analytics for Azure DDoS Protection alerts, search for **AzureDiagnostics**.

> [!NOTE]
>
> With this particular data connector, the connectivity status indicators (a color stripe in the data connectors gallery and connection icons next to the data type names) will show as *connected* (green) only if data has been ingested at some point in the past two weeks. Once two weeks have passed with no data ingestion, the connector will show as being disconnected. The moment more data comes through, the *connected* status will return.

## Next steps

In this document, you learned how to connect Azure DDoS Protection logs to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
