---
title: What is Microsoft Sentinel? | Microsoft Docs
description: Learn about Microsoft Sentinel, a scalable, cloud-native security information and event management (SIEM) and security orchestration, automation, and response (SOAR) solution.
author: cwatson-cat
ms.author: cwatson
ms.topic: overview
ms.service: microsoft-sentinel
ms.date: 04/08/2024
---

# What is Microsoft Sentinel?

Microsoft Sentinel is a scalable, cloud-native solution that delivers an intelligent, comprehensive security information and event management (SIEM) solution for cyberthreat detection, investigation, response, and proactive hunting.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Enable out of the box security content

Microsoft Sentinel provides security content packaged in SIEM solutions that enable you to ingest data, monitor, alert, hunt, investigate, respond, and connect with different products, platforms, and services. For more information, see [About Microsoft Sentinel content and solutions](sentinel-solutions.md).

# [Azure portal](#tab/azure-portal)

:::image type="content" source="media/overview/content-hub-azure-portal.png" alt-text="Screenshot of the Microsoft Sentinel content hub in the Azure portal that shows the security content available with a solution":::

# [Defender portal](#tab/defender-portal)

:::image type="content" source="media/overview/content-hub-defender-portal.png" alt-text="Screenshot of the Microsoft Sentinel content hub in the Defender portal that shows the security content available with a solution":::

---

## Collect data at cloud scale

After you onboard Microsoft Sentinel into your workspace, use data connectors to start ingesting your data into Microsoft Sentinel.

### Out of the box data connectors

Microsoft Sentinel comes with many connectors packaged with solutions that are available out of the box and provide real-time integration. Some of these connectors include:

- Microsoft sources like Microsoft Entra ID, Microsoft Defender XDR, Microsoft Defender for Cloud, Microsoft 365, Microsoft Defender for IoT, and more.

- Azure service sources like Azure Activity, Azure Storage, Azure Key Vault, Azure Kubernetes service, and more.

Microsoft Sentinel has out of the box connectors to the broader security and applications ecosystems for non-Microsoft solutions. You can also use common event format, Syslog, or REST-API to connect your data sources with Microsoft Sentinel.

The Microsoft Sentinel **Data connectors** page lists the installed or in-use data connectors.

# [Azure portal](#tab/azure-portal)

:::image type="content" source="media/overview/data-connectors.png" alt-text="Screenshot of the data connectors page in Microsoft Sentinel that shows a list of available connectors.":::

# [Defender portal](#tab/defender-portal)

:::image type="content" source="media/overview/data-connector-list-defender.png" alt-text="Screenshot of the Microsoft Sentinel data connectors page in the Defender portal that shows a list of available connectors.":::

---

For more information, see the following resources:

- [Microsoft Sentinel data connectors](connect-data-sources.md)
- [Connect your data sources to Microsoft Sentinel by using data connectors](configure-data-connector.md)
- [Find your data connector](data-connectors-reference.md)

### Custom connectors

Microsoft Sentinel supports ingesting data from some sources without a dedicated connector. If you're unable to connect your data source to Microsoft Sentinel using an existing solutions, create your own data source connector. For more information, [Resources for creating Microsoft Sentinel custom connectors](create-custom-connector.md).

### Data normalization

Microsoft Sentinel uses both query time and ingestion time normalization to translate various sources into a uniform, normalized view. For more information, see [Normalization and the Advanced Security Information Model (ASIM)](normalization.md).

## Detect threats

Add intro
### Analytics 

Detect patterns of activity and identify security threats across your organization by using analytic rules. Use out of the box analytic rule templates packaged with security content in the content hub or create your own. 

### MITRE ATT&CK coverage

Microsoft Sentinel analyzes ingested data, not only to detect threats and help you investigate, but also to visualize the nature and coverage of your organization's security status based on the tactics and techniques from the MITRE ATT&CK® framework. MITRE ATT&CK is a publicly accessible knowledge base of tactics and techniques that are commonly used by attackers, and is created and maintained by observing real-world observations. Many organizations use the MITRE ATT&CK knowledge base to develop specific threat models and methodologies that are used to verify security status in their environments.

### Threat intelligence 

Integrate numerous sources of threat intelligence into Microsoft Sentinel to detect malicious activity in your environment and provide context to security investigators for informed response decisions.

### Watchlist 

Correlate data from a data source you provide, a watchlist, with the events in your Microsoft Sentinel environment. For example, you might create a watchlist with a list of high-value assets, terminated employees, or service accounts in your environment. Use watchlists in your search, detection rules, threat hunting, and response playbooks.

## Investigate

Incident experience 

Tasks 

Hunt 

Notebooks

## Respond
Automation 

Playbooks 


## Related content