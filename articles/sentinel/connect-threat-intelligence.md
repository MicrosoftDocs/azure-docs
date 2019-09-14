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

Azure Sentinel allows you to bring your organization's threat indicators into the product to enhance your security analysts ability to detect and prioritize known threats.

Several features within Azure Sentinel are made available or significantly enhanced after users have imported threat indicators

* **Analytics** contain a set of scheduled rule templates which can be enabled to generate alerts and incidents based on matches of log events with threat indicators.
* **Workbooks** provide summarized information about the threat indicators imported into Azure Sentinel and any alerts generated from threat indicator matching analytics rules.
* **Hunting** queries allow security investigators to utlize threat indicators within the context of common hunting scenarios
* **Notebooks** can leverage threat indicators when investigating anomalies and hunting for malicious behaviors.

You can stream threat indicators to Azure Sentinel using one of the integrated Threat Intelligence Platform (TIP) products listed below or through direct integration with the [Microsoft Graph Security tiIndicators API](https://aka.ms/graphsecuritytiindicators).

## Integrated Threat Intelligence Platform products
* [Palo Alto Networks MineMeld](https://www.paloaltonetworks.com/products/secure-the-network/subscriptions/minemeld) ([*guided instructions*](https://medium.com/@antonio.formato/azure-sentinel-minemeld-bring-your-own-threat-intelligence-feeds-7e2f622d6c66))
* [ThreatConnect Platform](https://threatconnect.com/solution/)
* [MISP Open Source Threat Intelligence Platform](https://www.misp-project.org/) ([*integration script*](https://github.com/microsoftgraph/security-api-solutions/tree/master/Samples/MISP))

## Prerequisites  

- User with either **Global Administrator** or **Security Administrator** Azure Active Directory Limited Administrator roles to grant permissions to your TIP product or custom application using direct integration with the Microsoft Graph Security tiIndicators API.

- User with Read and Write permissions to the Azure Sentinel Workspace where threat indicators will reside.

## Connect Azure Sentinel to your threat intelligence 

1. [Regsiter an application](https://docs.microsoft.com/en-us/graph/auth-v2-service#1-register-your-app) in Azure Active Directory which will provide you with an Application ID, Application Secret (app password), and Azure Active Directory Tenant ID for use with your integrated TIP product or app using direct integration with Microsoft Graph Security tiIndicators API.

2. [Configure API permissions](https://docs.microsoft.com/en-us/graph/auth-v2-service#2-configure-permissions-for-microsoft-graph) on the application from step (1) and add the Microsoft Graph Application permission **ThreatIndicators.ReadWrite.OwnedBy** to your application registration.

3. Ask your Azure Active Directory tenant administrator to grant consent to the application from step (1) using the Azure portal, Azure Active Directory->App registrations->API permissions->**Grant consent** button.

4. Configure your TIP product or app using direct integration with Microsoft Graph Security tiIndicators API to send indicators to Azure Sentinel by specifying the following values:

   i. The AppID, App Secret, and Tenant ID from step (1) above.
   
   ii. Set "Azure Sentinel" as the **target product**.

   iii. Set the **Action** value to "Alert" which is appropriate for Azure Sentinel use cases.

5. Once your TIP product or app using direct integration with the Microsoft Graph Security tiIndicators API is configured to send threat indicators (steps 1-4 above), navigate to your Azure Sentinel Data Connectors page and find the **Threat Intelligence Platforms (Preview)** connector.

6. Click **Open connector page** and then click on **Connect**.

7. To view the threat indicators imported into Azure Sentinel, navigate to the **Logs** blade and view the **ThreatIntelligenceIndicator** log found within the **SecurityInsights** group of schemas.

## Next steps

In this document, you learned how to connect your Threat Intelligence provider to Azure Sentinel. To learn more about Azure Sentinel, see the following articles.

- To get started with Azure Sentinel, you need a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- Learn how to [onboard your data to Azure Sentinel](quickstart-onboard.md), and [get visibility into your data, and potential threats](quickstart-get-visibility.md).
