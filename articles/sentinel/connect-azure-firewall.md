---
title: Connect Azure Firewall data to Azure Sentinel
description: Learn how to connect Azure Firewall data to Azure Sentinel.
author: yelevin
manager: rkarlin
ms.assetid: bfa2eca4-abdc-49ce-b11a-0ee229770cdd
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: how-to
ms.date: 01/20/2021
ms.author: yelevin
---
# Connect data from Azure Firewall

Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources. It's a fully stateful firewall-as-a-service with built-in high availability and unrestricted cloud scalability. 

You can connect Azure Firewall logs to Azure Sentinel, enabling you to view log data in workbooks, use it to create custom alerts, and incorporate it to improve your investigation.

Learn more about [monitoring Azure Firewall logs](../firewall/firewall-diagnostics.md).

## Prerequisites

- You must have read and write permissions on the Azure Sentinel workspace.

## Connect to Azure Firewall
	
1. From the Azure Sentinel navigation menu, select **Data connectors**.

1. Select **Azure Firewall** from the data connectors gallery, and then select **Open Connector Page**  on the preview pane.

1. Enable **Diagnostic logs** on all the firewalls whose logs you wish to connect:

    1. Select the **Open Azure Firewall resource >** link.

    1. From the **Firewalls** navigation menu, select **Diagnostic settings**.

    1. Select **+ Add diagnostic setting** at the bottom of the list.​

    1. In the **Diagnostics settings** screen, enter a name in the  **Diagnostic settings name** field.
    
    1. Mark the **Send to Log Analytics** check box. Two new fields will be displayed below it. Choose the relevant **Subscription** and **Log Analytics Workspace** (where Azure Sentinel resides).​

    1. Mark the check boxes of the rule types whose logs you want to ingest. We recommend **AzureFirewallApplicationRule** and **AzureFirewallNetworkRule**.​

    1. Select **Save** at the top of the screen.

1. To use the relevant schema in Log Analytics for Azure Firewall alerts, search for **AzureDiagnostics**.

> [!NOTE]
>
> With this particular data connector, the connectivity status indicators (a color stripe in the data connectors gallery and connection icons next to the data type names) will show as *connected* (green) only if data has been ingested at some point in the past two weeks. Once two weeks have passed with no data ingestion, the connector will show as being disconnected. The moment more data comes through, the *connected* status will return.

## Next steps
In this document, you learned how to connect Azure Firewall logs to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).