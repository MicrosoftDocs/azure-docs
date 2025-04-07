---
title: Threat intelligence integration in Microsoft Sentinel
description: Learn about the different ways threat intelligence feeds are integrated with and used by Microsoft Sentinel.
author: austinmccollum
ms.topic: concept-article
ms.date: 03/14/2024
ms.author: austinmc
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security


#Customer intent: As a security analyst, I want to integrate various threat intelligence feeds into Microsoft Sentinel so that I can enhance threat detection, investigation, and response capabilities.

---

# Threat intelligence integration in Microsoft Sentinel

Microsoft Sentinel gives you a few ways to [use threat intelligence feeds](work-with-threat-indicators.md) to enhance your security analysts' ability to detect and prioritize known threats:

- Use one of many available integrated [threat intelligence platform (TIP) products](connect-threat-intelligence-tip.md).
- Connect to [TAXII servers](connect-threat-intelligence-taxii.md) to take advantage of any STIX-compatible threat intelligence source.
- Connect directly to the [Microsoft Defender Threat Intelligence](connect-mdti-data-connector.md) feed.
- Make use of any custom solutions that can communicate directly with the [Threat Intelligence Upload Indicators API](connect-threat-intelligence-upload-api.md). 
- Connect to threat intelligence sources from playbooks to enrich incidents with threat intelligence information that can help direct investigation and response actions.

> [!TIP]
> If you have multiple workspaces in the same tenant, such as for [Managed Security Service Providers (MSSPs)](mssp-protect-intellectual-property.md), it might be more cost effective to connect threat indicators only to the centralized workspace.
>
> When you have the same set of threat indicators imported into each separate workspace, you can run cross-workspace queries to aggregate threat indicators across your workspaces. Correlate them within your MSSP incident detection, investigation, and hunting experience.

## TAXII threat intelligence feeds

To connect to TAXII threat intelligence feeds, follow the instructions to [connect Microsoft Sentinel to STIX/TAXII threat intelligence feeds](connect-threat-intelligence-taxii.md), together with the data supplied by each vendor. You might need to contact the vendor directly to obtain the necessary data to use with the connector.

### Accenture cyber threat intelligence

- Learn about [Accenture cyber threat intelligence (CTI) integration with Microsoft Sentinel](https://www.accenture.com/us-en/services/security/cyber-resilience).

### Cybersixgill Darkfeed

- Learn about [Cybersixgill integration with Microsoft Sentinel](https://www.cybersixgill.com/partners/azure-sentinel/).
- Connect Microsoft Sentinel to the Cybersixgill TAXII server and get access to Darkfeed. [Contact azuresentinel@cybersixgill.com](mailto://azuresentinel@cybersixgill.com) to obtain the API root, collection ID, username, and password.

### Cyware threat intelligence exchange (CTIX)

One component of Cyware's TIP, CTIX, is to make intel actionable with a TAXII feed for your security information and event management. For Microsoft Sentinel, follow the instructions here:

 - Learn how to [integrate with Microsoft Sentinel](https://techdocs.cyware.com/en/299670-419978-configure-subscribers-to-receive-ctix-threat-intel-over-taxii.html#299670-13832-integrate-with-microsoft-sentinel)
 
### ESET

- Learn about [ESET's threat intelligence offering](https://www.eset.com/int/business/services/threat-intelligence/).
- Connect Microsoft Sentinel to the ESET TAXII server. Obtain the API root URL, collection ID, username, and password from your ESET account. Then follow the [general instructions](connect-threat-intelligence-taxii.md) and [ESET's knowledge base article](https://support.eset.com/en/kb8314-eset-threat-intelligence-with-ms-azure-sentinel).

### Financial Services Information Sharing and Analysis Center (FS-ISAC)

- Join [FS-ISAC](https://www.fsisac.com/membership?utm_campaign=ThirdParty&utm_source=MSFT&utm_medium=ThreatFeed-Join) to get the credentials to access this feed.

### Health intelligence sharing community (H-ISAC)

- Join the [H-ISAC](https://h-isac.org/) to get the credentials to access this feed.

### IBM X-Force

- Learn more about [IBM X-Force integration](https://www.ibm.com/security/xforce).

### IntSights

- Learn more about the [IntSights integration with Microsoft Sentinel @IntSights](https://intsights.com/resources/intsights-microsoft-azure-sentinel).
- Connect Microsoft Sentinel to the IntSights TAXII server. Obtain the API root, collection ID, username, and password from the IntSights portal after you configure a policy of the data that you want to send to Microsoft Sentinel.

### Kaspersky

- Learn about [Kaspersky integration with Microsoft Sentinel](https://support.kaspersky.com/15908).

### Pulsedive

- Learn about [Pulsedive integration with Microsoft Sentinel](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/import-pulsedive-feed-into-microsoft-sentinel/ba-p/3478953).

### ReversingLabs

- Learn about [ReversingLabs TAXII integration with Microsoft Sentinel](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/import-reversinglab-s-ransomware-feed-into-microsoft-sentinel/ba-p/3423937).

### Sectrio

- Learn more about [Sectrio integration](https://sectrio.com/threat-intelligence/).
- Learn about the [step-by-step process for integrating Sectrio's threat intelligence feed into Microsoft Sentinel](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/microsoft-sentinel-bring-threat-intelligence-from-sectrio-using/ba-p/2964648).

### SEKOIA.IO

- Learn about [SEKOIA.IO integration with Microsoft Sentinel](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/bring-threat-intelligence-from-sekoia-io-using-taxii-data/ba-p/3302497).

### ThreatConnect

- Learn more about [STIX and TAXII at ThreatConnect](https://threatconnect.com/stix-taxii/).
- See the [TAXII services documentation at ThreatConnect](https://docs.threatconnect.com/en/latest/rest_api/taxii/taxii_2.1.html).

## Integrated threat intelligence platform products

To connect to TIP feeds, see [Connect threat intelligence platforms to Microsoft Sentinel](connect-threat-intelligence-tip.md). See the following solutions to learn what other information is needed.

### Agari Phishing Defense and Brand Protection

- To connect [Agari Phishing Defense and Brand Protection](https://agari.com/products/phishing-defense/), use the built-in [Agari data connector](./data-connectors-reference.md) in Microsoft Sentinel.

### Anomali ThreatStream

- To download [ThreatStream Integrator and Extensions](https://www.anomali.com/products/threatstream), and the instructions for connecting ThreatStream intelligence to the Microsoft Graph Security API, see the [ThreatStream downloads](https://ui.threatstream.com/downloads) page.

### AlienVault Open Threat Exchange (OTX) from AT&T Cybersecurity

- Learn how [AlienVault OTX](https://otx.alienvault.com/) makes use of Azure Logic Apps (playbooks) to connect to Microsoft Sentinel. See the [specialized instructions](https://techcommunity.microsoft.com/t5/azure-sentinel/ingesting-alien-vault-otx-threat-indicators-into-azure-sentinel/ba-p/1086566) necessary to take full advantage of the complete offering.

### EclecticIQ Platform

- EclecticIQ Platform integrates with Microsoft Sentinel to enhance threat detection, hunting, and response. Learn more about the [benefits and use cases](https://www.eclecticiq.com/resources/microsoft-sentinel-and-eclecticiq-intelligence-center) of this two-way integration.

### Filigran OpenCTI

- [Filigran OpenCTI](https://filigran.io/solutions/open-cti/) can send threat intelligence to Microsoft Sentinel via either a [dedicated connector](https://filigran.notion.site/Microsoft-Sentinel-934a09d3736c403e88a8944ec6badfc9) which runs in realtime, or by acting as a TAXII 2.1 server that Sentinel will poll regularly. It can also receive structured incidents from Sentinel via the [Microsoft Sentinel Incident connector](https://filigran.notion.site/Microsoft-Sentinel-Incidents-11c8fce17f2a80f1b461c6379265d5d3).


### GroupIB Threat Intelligence and Attribution

- To connect [GroupIB Threat Intelligence and Attribution](https://www.group-ib.com/products/threat-intelligence/) to Microsoft Sentinel, GroupIB makes use of Logic Apps. See the [specialized instructions](https://techcommunity.microsoft.com/t5/azure-sentinel/group-ib-threat-intelligence-and-attribution-connector-azure/ba-p/2252904) that are necessary to take full advantage of the complete offering.

### MISP open-source threat intelligence platform

- Push threat indicators from MISP to Microsoft Sentinel by using the Threat Intelligence Upload Indicators API with [MISP2Sentinel](https://www.misp-project.org/2023/08/26/MISP-Sentinel-UploadIndicatorsAPI.html/).
- See [MISP2Sentinel](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftsentinelcommunity.azure-sentinel-solution-misp2sentinel?tab=Overview) in Azure Marketplace.
- Learn more about the [MISP Project](https://www.misp-project.org/).

### Palo Alto Networks MineMeld

- To configure [Palo Alto MineMeld](https://www.paloaltonetworks.com/products/secure-the-network/subscriptions/minemeld) with the connection information to Microsoft Sentinel, see [Sending IOCs to the Microsoft Graph Security API using MineMeld](https://live.paloaltonetworks.com/t5/MineMeld-Articles/Sending-IOCs-to-the-Microsoft-Graph-Security-API-using-MineMeld/ta-p/258540). Go to the "MineMeld Configuration" heading.

### Recorded Future security intelligence platform

- Learn how [Recorded Future](https://www.recordedfuture.com/integrations/microsoft-azure/) makes use of Logic Apps (playbooks) to connect to Microsoft Sentinel. See the [specialized instructions](https://www.recordedfuture.com/integrations/microsoft) necessary to take full advantage of the complete offering.

### ThreatConnect Platform

- See the [Microsoft Graph Security Threat Indicators Integration Configuration Guide](https://training.threatconnect.com/learn/article/microsoft-graph-security-threat-indicators-integration-configuration-guide-kb-article) for instructions to connect [ThreatConnect](https://threatconnect.com/solution/) to Microsoft Sentinel.

### ThreatQuotient threat intelligence platform

- See [Microsoft Sentinel Connector for ThreatQ integration](https://azuremarketplace.microsoft.com/marketplace/apps/threatquotientinc1595345895602.microsoft-sentinel-connector-threatq?tab=overview) for support information and instructions to connect [ThreatQuotient TIP](https://www.threatq.com/) to Microsoft Sentinel.

## Incident enrichment sources

Besides being used to import threat indicators, threat intelligence feeds can also serve as a source to enrich the information in your incidents and provide more context to your investigations. The following feeds serve this purpose and provide Logic Apps playbooks to use in your [automated incident response](automate-responses-with-playbooks.md). Find these enrichment sources in the **Content hub**.

For more information about how to find and manage the solutions, see [Discover and deploy out-of-the-box content](sentinel-solutions-deploy.md).

### HYAS Insight

- Find and enable incident enrichment playbooks for [HYAS Insight](https://www.hyas.com/hyas-insight) in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/HYAS/Playbooks). Search for subfolders beginning with `Enrich-Sentinel-Incident-HYAS-Insight-`.
- See the HYAS Insight Logic Apps [connector documentation](/connectors/hyasinsight/).

### Microsoft Defender Threat Intelligence

- Find and enable incident enrichment playbooks for [Microsoft Defender Threat Intelligence](/defender/threat-intelligence/what-is-microsoft-defender-threat-intelligence-defender-ti) in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/Microsoft%20Defender%20Threat%20Intelligence/Playbooks).
- See the [Defender Threat Intelligence Tech Community blog post](https://aka.ms/sentinel-playbooks) for more information.

### Recorded Future Security Intelligence Platform

- Find and enable incident enrichment playbooks for [Recorded Future](https://www.recordedfuture.com/integrations/microsoft-azure/) in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks). Search for subfolders beginning with `RecordedFuture_`.
- See the Recorded Future Logic Apps [connector documentation](/connectors/recordedfuturev2/).

### ReversingLabs TitaniumCloud

- Find and enable incident enrichment playbooks for [ReversingLabs](https://www.reversinglabs.com/products/file-reputation-service) in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/ReversingLabs/Playbooks/).
- See the ReversingLabs TitaniumCloud Logic Apps [connector documentation](/connectors/reversinglabstitaniu/).

### RiskIQ PassiveTotal

- Find and enable the incident enrichment playbooks for [RiskIQ Passive Total](https://www.riskiq.com/products/passivetotal/) in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/RiskIQ/Playbooks).
- See [more information](https://techcommunity.microsoft.com/t5/azure-sentinel/enrich-azure-sentinel-security-incidents-with-the-riskiq/ba-p/1534412) on working with RiskIQ playbooks.
- See the RiskIQ PassiveTotal Logic Apps [connector documentation](/connectors/riskiqpassivetotal/).

### VirusTotal

- Find and enable incident enrichment playbooks for [VirusTotal](https://developers.virustotal.com/v3.0/reference) in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/VirusTotal/Playbooks). Search for subfolders beginning with `Get-VTURL`.
- See the VirusTotal Logic Apps [connector documentation](/connectors/virustotal/).

## Related content

In this article, you learned how to connect your threat intelligence provider to Microsoft Sentinel. To learn more about Microsoft Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](./detect-threats-built-in.md).
