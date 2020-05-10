---
title: Connect Azure DDoS Protection data to Azure Sentinel
description: Learn how to connect Azure DDoS Protection data to Azure Sentinel.
author: yelevin
manager: rkarlin
ms.assetid: bfa2eca4-abdc-49ce-b11a-0ee229770cdd
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: how-to
ms.date: 05/10/2020
ms.author: yelevin
---
# Connect data from Azure DDoS Protection

Distributed denial of service (DDoS) attacks attempt to exhaust an application's resources, making the application unavailable to legitimate users. DDoS attacks can be targeted at any endpoint that is publicly reachable through the internet. Azure DDoS protection, combined with application design best practices, provide defense against DDoS attacks. 

-OR-

Connect to Azure DDoS Protection Standard logs via Public IP Address Diagnostic Logs. In addition to the core DDoS protection in the platform, Azure DDoS Protection Standard provides advanced DDoS mitigation capabilities against network attacks. It's automatically tuned to protect your specific Azure resources. Protection is simple to enable during the creation of new virtual networks. It can also be done after creation and requires no application or resource changes.

You can connect Azure DDoS Protection logs to Azure Sentinel, enabling you to view log data in workbooks, use it to create custom alerts, and incorporate it to improve your investigations.

Learn more about [monitoring DDoS attacks in Azure](https://docs.microsoft.com/azure/virtual-network/ddos-protection-overview).

## Prerequisites

- You must have read and write permissions on the Azure Sentinel workspace.

## Connect to Azure DDoS Protection
	
1. From the Azure Sentinel navigation menu, select **Data connectors**.

1. From the Data connectors list, click **Azure DDoS Protection**, and then click the **Open Connector Page** button on the lower right.

1. Enable **Diagnostic logs** on all the firewalls whose logs you wish to connect:

    1. Click the [Open Azure Public IP Address resource >](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Network%2FPublicIPAddresses) link, and click an entry in the resource list.

    1. From the resource navigation menu, click **Activity log**.
    
    1. Click **Diagnostics settings** at the top of the **Activity log** screen.

    1. Click **+ Add diagnostic setting** at the bottom of the list.​

    1. In the **Diagnostics settings** screen, type a name in the  **Diagnostic settings name** field.
    
    1. Click the **Send to Log Analytics** check box. Two new fields will be displayed below it. Choose the relevant **Subscription** and **Log Analytics Workspace** (where Azure Sentinel resides).​

    1. Click the check boxes of the rule types whose logs you want to ingest. We recommend **????** and **????**.​

    1. Click **Save** at the top of the screen.

1. To use the relevant schema in Log Analytics for Azure DDoS Protection alerts, search for **AzureDiagnostics**.

## Next steps
In this document, you learned how to connect Azure DDoS Protection logs to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
