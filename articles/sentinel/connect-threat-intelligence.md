---
title: Connect threat intelligence data to Azure Sentinel| Microsoft Docs
description: Learn about how to connect threat intelligence data to Azure Sentinel.
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/24/2019
ms.author: rkarlin

---
# Connect data from threat intelligence providers - Preview

> [!IMPORTANT]
> Threat intelligence in Azure Sentinel is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Sentinel lets you import the threat indicators that your organization is using, which can enhance your security analysts' ability to detect and prioritize known threats. Several features from Azure Sentinel then become available or are significantly enhanced:

- **Analytics** includes a set of scheduled rule templates that can be enabled to generate alerts and incidents that are based on matches of log events with threat indicators.

- **Workbooks** provide summarized information about the threat indicators that are imported into Azure Sentinel and any alerts generated from threat indicator matching analytics rules.

- **Hunting** queries allow security investigators to use threat indicators within the context of common hunting scenarios.

- **Notebooks** can use threat indicators when you investigate anomalies and hunt for malicious behaviors.

You can stream threat indicators to Azure Sentinel by using one of the integrated threat intelligence platform (TIP) products listed in the next section, or by using direct integration with the [Microsoft Graph Security tiIndicators API](https://aka.ms/graphsecuritytiindicators).

## Integrated threat intelligence platform products

- [Palo Alto Networks MineMeld](https://www.paloaltonetworks.com/products/secure-the-network/subscriptions/minemeld) ([*guided instructions*](https://live.paloaltonetworks.com/t5/MineMeld-Articles/Sending-IOCs-to-the-Microsoft-Graph-Security-API-using-MineMeld/ta-p/258540))

-[ThreatConnect Platform](https://threatconnect.com/solution/)

- [MISP Open Source Threat Intelligence Platform](https://www.misp-project.org/) ([*integration script*](https://github.com/microsoftgraph/security-api-solutions/tree/master/Samples/MISP))

## Prerequisites  

- Azure AD role of either **Global Administrator** or **Security Administrator** to grant permissions to your TIP product or custom application that uses direct integration with the Microsoft Graph Security tiIndicators API.

- Read and write permissions to the Azure Sentinel workspace to store your threat indicators.

## Connect Azure Sentinel to your threat intelligence provider

1. [Register an application](/graph/auth-v2-service#1-register-your-app) in Azure Active Directory to get an application ID, application secret, and Azure Active Directory tenant ID. You need these values for when you configure your integrated TIP product or app that uses direct integration with Microsoft Graph Security tiIndicators API.

2. [Configure API permissions](/graph/auth-v2-service#2-configure-permissions-for-microsoft-graph) for the registered application, and add the Microsoft Graph Application permission **ThreatIndicators.ReadWrite.OwnedBy** to your registered application.

3. Ask your Azure Active Directory tenant administrator to grant admin consent to the registered application for your organization. From the Azure portal: **Azure Active Directory** > **App registrations** > \<*app name*\> **View API Permissions** >**Grant admin consent for \<*organization name*\>**.

4. Configure your TIP product or app that uses direct integration with Microsoft Graph Security tiIndicators API to send indicators to Azure Sentinel by specifying the following:

   a. The values for the registered application's ID, secret, and tenant ID.
   
   b. For the target product, specify Azure Sentinel.

   c. For the action, specify alert.

5. In the Azure portal, navigate to **Azure Sentinel** > **Data connectors** and then select the **Threat Intelligence Platforms (Preview)** connector.

6. Select **Open connector page**, and then **Connect**.

7. To view the threat indicators that are imported into Azure Sentinel, navigate to **Azure Sentinel - Logs** and view the **ThreatIntelligenceIndicator** log in the **SecurityInsights** group of schemas.

## Next steps

In this document, you learned how to connect your threat intelligence provider to Azure Sentinel. To learn more about Azure Sentinel, see the following articles.

- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).