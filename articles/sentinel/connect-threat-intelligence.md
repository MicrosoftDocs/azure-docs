---
title: Connect threat intelligence data to Azure Sentinel | Microsoft Docs
description: Learn about how to connect threat intelligence data to Azure Sentinel.
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
ms.date: 11/22/2019
ms.author: yelevin

---
# Connect data from threat intelligence providers

> [!IMPORTANT]
> The Threat Intelligence data connectors in Azure Sentinel are currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Sentinel lets you import the threat indicators your organization is using, which can enhance your security analysts' ability to detect and prioritize known threats. Several features from Azure Sentinel then become available or are enhanced:

- **Analytics** includes a set of scheduled rule templates you can enable to generate alerts and incidents based on matches of log events from your threat indicators.

- **Workbooks** provide summarized information about the threat indicators imported into Azure Sentinel and any alerts generated from analytics rules that match your threat indicators.

- **Hunting** queries allow security investigators to use threat indicators within the context of common hunting scenarios.

- **Notebooks** can use threat indicators when you investigate anomalies and hunt for malicious behaviors.

You can stream threat indicators to Azure Sentinel by using one of the integrated threat intelligence platform (TIP) products listed in the next section, connecting to TAXII servers, or by using direct integration with the [Microsoft Graph Security tiIndicators API](https://aka.ms/graphsecuritytiindicators).

## Integrated threat intelligence platform products

- [MISP Open Source Threat Intelligence Platform](https://www.misp-project.org/)
    
    For a sample script that provides clients with MISP instances to migrate threat indicators to the Microsoft Graph Security API, see the [MISP to Microsoft Graph Security Script](https://github.com/microsoftgraph/security-api-solutions/tree/master/Samples/MISP).

- [Anomali ThreatStream](https://www.anomali.com/products/threatstream)

    To download ThreatStream Integrator and Extensions, and the instructions for connecting ThreatStream intelligence to the Microsoft Graph Security API, see the [ThreatStream downloads](https://ui.threatstream.com/downloads) page.

- [Palo Alto Networks MineMeld](https://www.paloaltonetworks.com/products/secure-the-network/subscriptions/minemeld)
    
    For guided instructions, see [Sending IOCs to the Microsoft Graph Security API using MineMeld](https://live.paloaltonetworks.com/t5/MineMeld-Articles/Sending-IOCs-to-the-Microsoft-Graph-Security-API-using-MineMeld/ta-p/258540).

- [ThreatConnect Platform](https://threatconnect.com/solution/)

    For information, see [ThreatConnect Integrations](https://threatconnect.com/integrations/) and look for Microsoft Graph Security API on the page.


## Connect Azure Sentinel to your threat intelligence platform

## Prerequisites  

- Azure AD role of either Global administrator or Security administrator to grant permissions to your TIP product or custom application that uses direct integration with the Microsoft Graph Security tiIndicators API.

- Read and write permissions to the Azure Sentinel workspace to store your threat indicators.

## Instructions

1. [Register an application](/graph/auth-v2-service#1-register-your-app) in Azure Active Directory to get an application ID, application secret, and Azure Active Directory tenant ID. You need these values for when you configure your integrated TIP product or app that uses direct integration with Microsoft Graph Security tiIndicators API.

2. [Configure API permissions](/graph/auth-v2-service#2-configure-permissions-for-microsoft-graph) for the registered application: Add the Microsoft Graph Application permission **ThreatIndicators.ReadWrite.OwnedBy** to your registered application.

3. Ask your Azure Active Directory tenant administrator to grant admin consent to the registered application for your organization. From the Azure portal: **Azure Active Directory** > **App registrations** > **\<_app name_>** > **View API Permissions** > **Grant admin consent for \<_tenant name_>**.

4. Configure your TIP product or app that uses direct integration with Microsoft Graph Security tiIndicators API to send indicators to Azure Sentinel by specifying the following:
    
    a. The values for the registered application's ID, secret, and tenant ID.
    
    b. For the target product, specify Azure Sentinel.
    
    c. For the action, specify alert.

5. In the Azure portal, navigate to **Azure Sentinel** > **Data connectors** and then select the **Threat Intelligence Platforms (Preview)** connector.

6. Select **Open connector page**, and then **Connect**.

7. To view the threat indicators imported into Azure Sentinel, navigate to **Azure Sentinel - Logs** > **SecurityInsights**, and then expand **ThreatIntelligenceIndicator**.

## Connect Azure Sentinel to TAXII servers

## Prerequisites  

- Read and write permissions to the Azure Sentinel workspace to store your threat indicators.

- TAXII 2.0 server URI and Collection ID.

## Instructions

1. In the Azure portal, navigate to **Azure Sentinel** > **Data connectors** and then select the **Threat Intelligence - TAXII (Preview)** connector.

2. Select **Open connector page**.

3. Specify the required and optional information in the text boxes.

4. Select **Add** to enable the connection to the TAXII 2.0 server.

5. If you have additional TAXII 2.0 servers: Repeat steps 3 and 4.

6. To view the threat indicators imported into Azure Sentinel, navigate to **Azure Sentinel - Logs** > **SecurityInsights**, and then expand **ThreatIntelligenceIndicator**.

## Next steps

In this document, you learned how to connect your threat intelligence provider to Azure Sentinel. To learn more about Azure Sentinel, see the following articles.

- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
