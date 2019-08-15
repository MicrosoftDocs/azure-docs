---
title: Connect threat intelligence data to Azure Sentinel Preview| Microsoft Docs
description: Learn about how to connect threat intelligence data to Azure Sentinel.
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.assetid: 56412543-5664-44c1-b026-2dbaf78a9a50
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/07/2019
ms.author: rkarlin

---
# Connect data from threat intelligence providers 

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

After you stream your data into Azure Sentinel, you can enrich it with the threat intelligence feed that you use across your organization. 

To enable you to cross check your alerts and rules with true threat intelligence, for example if you get an alert from a specific IP address, your threat intelligence provider integration will be able to let you know if that IP address was recently found to be malicious, Azure Sentinel enables integration with [threat intelligence providers](https://aka.ms/graphsecuritytips). 

You can stream logs from Threat intelligence providers into Azure Sentinel with a single click. This connection enables you to incorporate indicators containing various types of observables such as IP address, domain, URL and file hash to search and create custom alerts rules in Azure Sentinel.  
> [!NOTE]
> You can input customized threat indicators into Azure Sentinel for use in alert rules, dashboards, and hunting scenarios by integrating with the [Microsoft Graph Security tiIndicator](https://aka.ms/graphsecuritytiindicators) entity or by using a [Microsoft Graph Security integrated Threat Intelligence Platform](https://aka.ms/graphsecuritytips).

## Prerequisites  

- User with global administrator or security administrator permissions 

- Threat intelligence application integrated with Microsoft Intelligent Security Graph 

## Connect to threat intelligence 

1. If you’re already using a threat intelligence provider, be sure to browse to your TIP application and grant permission to send indicators to Microsoft and specify the service as Azure Sentinel.  

2. In Azure Sentinel, select **Data connectors** and then click the **Threat Intelligence** tile.

3. Click **Connect**. 

4. To use the relevant schema in Log Analytics for threat intelligence feeds, search for **ThreatIntelligenceIndicator**. 

 
## Next steps

In this document, you learned how to connect your Threat Intelligence provider to Azure Sentinel. To learn more about Azure Sentinel, see the following articles.

- To get started with Azure Sentinel, you need a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- Learn how to [onboard your data to Azure Sentinel](quickstart-onboard.md), and [get visibility into your data, and potential threats](quickstart-get-visibility.md).
