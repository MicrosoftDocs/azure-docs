---
title: Threat intelligence integration in Azure Sentinel | Microsoft Docs
description: Learn about the different ways threat intelligence feeds are integrated with and used by Azure Sentinel.
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
ms.date: 07/13/2021
ms.author: yelevin

---
# Threat intelligence integration in Azure Sentinel

Azure Sentinel gives you a few different ways to [use threat intelligence feeds](work-with-threat-indicators.md) to enhance your security analysts' ability to detect and prioritize known threats. 

You can use one of many available integrated [threat intelligence platform (TIP) products](connect-threat-intelligence-tip.md), you can [connect to TAXII servers](connect-threat-intelligence-taxii.md) to take advantage of any STIX-compatible threat intelligence source, and you can also make use of any custom solutions that can communicate directly with the [Microsoft Graph Security tiIndicators API](/graph/api/resources/tiindicator). 

You can also connect to threat intelligence sources from playbooks, in order to enrich incidents with TI information that can help direct investigation and response actions.

> [!TIP]
> If you have multiple workspaces in the same tenant, such as for [Managed Service Providers (MSSPs)](mssp-protect-intellectual-property.md), it may be more cost effective to connect threat indicators only to the centralized workspace.
>
> When you have the same set of threat indicators imported into each separate workspace, you can run cross-workspace queries to aggregate threat indicators across your workspaces. Correlate them within your MSSP incident detection, investigation, and hunting experience.
>

## TAXII threat intelligence feeds

To connect to TAXII threat intelligence feeds, follow the instructions to [connect Azure Sentinel to STIX/TAXII threat intelligence feeds](connect-threat-intelligence-taxii.md), together with the data supplied by each vendor linked below. You may need to contact the vendor directly to obtain the necessary data to use with the connector.

### Anomali Limo

- [See what you need to connect to Anomali Limo feed](https://www.anomali.com/resources/limo).

### Cybersixgill Darkfeed

- [Learn about Cybersixgill integration with Azure Sentinel @Cybersixgill](https://www.cybersixgill.com/partners/azure-sentinel/)
- To connect Azure Sentinel to Cybersixgill TAXII Server and get access to Darkfeed, [contact Cybersixgill](mailto://azuresentinel@cybersixgill.com) to obtain the API Root, Collection ID, Username and Password.

### Financial Services Information Sharing and Analysis Center (FS-ISAC)

- Join [FS-ISAC](https://www.fsisac.com/membership?utm_campaign=ThirdParty&utm_source=MSFT&utm_medium=ThreatFeed-Join) to get the credentials to access this feed.

### Health intelligence sharing community (H-ISAC)

- [Join the H-ISAC](https://h-isac.org/soltra/) to get the credentials to access this feed.

### IBM X-Force

- [Learn more about IBM X-Force integration](https://www.ibm.com/security/xforce)

### IntSights

- [Learn more about the IntSights integration with Azure Sentinel @IntSights](https://intsights.com/resources/intsights-microsoft-azure-sentinel)
- To connect Azure Sentinel to the IntSights TAXII Server, obtain the API Root, Collection ID, Username and Password from the IntSights portal after you configure a policy of the data you wish to send to Azure Sentinel.

### ThreatConnect

- [Learn more about STIX and TAXII @ThreatConnect](https://threatconnect.com/stix-taxii/)
- [TAXII Services documentation @ThreatConnect](https://docs.threatconnect.com/en/latest/rest_api/taxii/taxii.html)

## Integrated threat intelligence platform products

To connect to Threat Intelligence Platform (TIP) feeds, follow the instructions to [connect Threat Intelligence platforms to Azure Sentinel](connect-threat-intelligence-tip.md). The second part of these instructions calls for you to enter information into your TIP solution. See the links below for more information.

### Agari Phishing Defense and Brand Protection

- To connect [Agari Phishing Defense and Brand Protection](https://agari.com/products/phishing-defense/), use the built-in [Agari data connector](connect-agari-phishing-defense.md) in Azure Sentinel.

### Anomali ThreatStream

- To download [ThreatStream Integrator and Extensions](https://www.anomali.com/products/threatstream), and the instructions for connecting ThreatStream intelligence to the Microsoft Graph Security API, see the [ThreatStream downloads](https://ui.threatstream.com/downloads) page.

### AlienVault Open Threat Exchange (OTX) from AT&T Cybersecurity

- [AlienVault OTX](https://otx.alienvault.com/) makes use of Azure Logic Apps (playbooks) to connect to Azure Sentinel. See the [specialized instructions](https://techcommunity.microsoft.com/t5/azure-sentinel/ingesting-alien-vault-otx-threat-indicators-into-azure-sentinel/ba-p/1086566) necessary to take full advantage of the complete offering.

### EclecticIQ Platform

- EclecticIQ Platform integrates with Azure Sentinel to enhance threat detection, hunting and response. Learn more about the [benefits and use cases](https://www.eclecticiq.com/resources/azure-sentinel-and-eclecticiq-intelligence-center) of this two-way integration.

### GroupIB Threat Intelligence and Attribution

- To connect [GroupIB Threat Intelligence and Attribution](https://www.group-ib.com/intelligence-attribution.html) to Azure Sentinel, GroupIB makes use of Azure Logic Apps. See the [specialized instructions](https://techcommunity.microsoft.com/t5/azure-sentinel/group-ib-threat-intelligence-and-attribution-connector-azure/ba-p/2252904) necessary to take full advantage of the complete offering.

### MISP Open Source Threat Intelligence Platform

- For a sample script that provides clients with MISP instances to migrate threat indicators to the Microsoft Graph Security API, see the [MISP to Microsoft Graph Security Script](https://github.com/microsoftgraph/security-api-solutions/tree/master/Samples/MISP).
- [Learn more about the MISP Project](https://www.misp-project.org/).

### Palo Alto Networks MineMeld

- To configure [Palo Alto MineMeld](https://www.paloaltonetworks.com/products/secure-the-network/subscriptions/minemeld) with the connection information to Azure Sentinel, see [Sending IOCs to the Microsoft Graph Security API using MineMeld](https://live.paloaltonetworks.com/t5/MineMeld-Articles/Sending-IOCs-to-the-Microsoft-Graph-Security-API-using-MineMeld/ta-p/258540) and skip to the **MineMeld Configuration** heading.

### Recorded Future Security Intelligence Platform

- [Recorded Future](https://www.recordedfuture.com/integrations/microsoft-azure/) makes use of Azure Logic Apps (playbooks) to connect to Azure Sentinel. See the [specialized instructions](https://go.recordedfuture.com/hubfs/partners/microsoft-azure-installation-guide.pdf) necessary to take full advantage of the complete offering.

### ThreatConnect Platform

- See the [Microsoft Graph Security Threat Indicators Integration Configuration Guide](https://training.threatconnect.com/learn/article/microsoft-graph-security-threat-indicators-integration-configuration-guide-kb-article) for instructions to connect [ThreatConnect](https://threatconnect.com/solution/) to Azure Sentinel.

### ThreatQuotient Threat Intelligence Platform

- See [Microsoft Sentinel Connector for ThreatQ integration](https://appsource.microsoft.com/product/web-apps/threatquotientinc1595345895602.microsoft-sentinel-connector-threatq?src=health&tab=DetailsAndSupport) for support information and instructions to connect [ThreatQuotient TIP](https://www.threatq.com/) to Azure Sentinel.

## Incident enrichment sources

Besides being used to import threat indicators, threat intelligence feeds can also serve as a source to enrich the information in your incidents and provide more context to your investigations. The following feeds serve this purpose, and provide Logic App playbooks to use in your [automated incident response](automate-responses-with-playbooks.md).

### HYAS Insight

- Find and enable incident enrichment playbooks for [HYAS Insight](https://www.hyas.com/hyas-insight) in the Azure Sentinel [GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks). Search for subfolders beginning with "Enrich-Sentinel-Incident-HYAS-Insight-".
- See the HYAS Insight Logic App [connector documentation](/connectors/hyasinsight/).

### Recorded Future Security Intelligence Platform

- Find and enable incident enrichment playbooks for [Recorded Future](https://www.recordedfuture.com/integrations/microsoft-azure/) in the Azure Sentinel [GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks). Search for subfolders beginning with "RecordedFuture_".
- See the Recorded Future Logic App [connector documentation](/connectors/recordedfuture/).

### ReversingLabs TitaniumCloud

- Find and enable incident enrichment playbooks for [ReversingLabs](https://www.reversinglabs.com/products/file-reputation-service) in the Azure Sentinel [GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/ReversingLabs/Playbooks/Enrich-SentinelIncident-ReversingLabs-File-Information).
- See the ReversingLabs Intelligence Logic App [connector documentation](/connectors/reversinglabsintelligence/).

### RiskIQ Passive Total

- Find and enable incident enrichment playbooks for [RiskIQ Passive Total](https://www.riskiq.com/products/passivetotal/) in the Azure Sentinel [GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks). Search for subfolders beginning with "Enrich-SentinelIncident-RiskIQ-".
- See [more information](https://techcommunity.microsoft.com/t5/azure-sentinel/enrich-azure-sentinel-security-incidents-with-the-riskiq/ba-p/1534412) on working with RiskIQ playbooks.
- See the RiskIQ PassiveTotal Logic App [connector documentation](/connectors/riskiqpassivetotal/).

### Virus Total

- Find and enable incident enrichment playbooks for [Virus Total](https://developers.virustotal.com/v3.0/reference) in the Azure Sentinel [GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks). Search for subfolders beginning with "Get-VirusTotal" and "Get-VTURL".
- See the Virus Total Logic App [connector documentation](/connectors/virustotal/).

## Next steps

In this document, you learned how to connect your threat intelligence provider to Azure Sentinel. To learn more about Azure Sentinel, see the following articles.

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](./tutorial-detect-threats-built-in.md).
