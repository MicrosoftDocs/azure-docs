---
title: Connect Microsoft web application firewall data to Azure Sentinel Preview| Microsoft Docs
description: Learn how to connect Microsoft web application firewall data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.assetid: bfa2eca4-abdc-49ce-b11a-0ee229770cdd
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/07/2019
ms.author: rkarlin

---
# Connect data from Microsoft web application firewall

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can stream logs from the Azure Application Gateway’s Microsoft web application firewall (WAF). This WAF protects your applications from common web vulnerabilities such as SQL injection and cross-site scripting, and lets you customize rules to reduce false positives.​ Follow these instructions to stream your Microsoft Web application firewall logs into Azure Sentinel.​


## Prerequisites

- An existing application gateway resource

## Connect to Microsoft web application firewall

If you already have Microsoft web application firewall, make sure you have an existing gateway resource.
Once your Microsoft web application firewall is deployed and getting data, the alert data can easily be streamed into Azure Sentinel.
	
1. In the Azure Sentinel portal, select **Data connectors**.
1. In the Data connectors page, select the **WAF** tile.
1. Go to [Application Gateway resource](https://ms.portal.azure.com/#blade/HubsExtension/BrowseAllResourcesBlade/resourceType/Microsoft.Network%2FapplicationGateways) and choose your WAF.​
    1. Select **Diagnostic settings**.​
    1. Select **+ Add diagnostic setting** under the table.​
    1. In the **Diagnostic settings** page, type a **Name** and select **Send to Log Analytics**.
    1. Under **Log Analytics Workspace** select the Azure Sentinel workspace.​
    1. Select the log types that you want to analyze. We recommended: ApplicationGatewayAccessLog and ApplicationGatewayFirewallLog.​
1. To use the relevant schema in Log Analytics for the Microsoft web application firewall alerts, search for **AzureDiagnostics**.

## Next steps
In this document, you learned how to connect Microsoft web application firewall to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
