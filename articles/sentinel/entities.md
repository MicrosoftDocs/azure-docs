---
title: Entities in Microsoft Sentinel
description: Entity classification, identification, and correlation in Microsoft Sentinel for enhanced threat detection and investigation.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 10/16/2024

#Customer intent: As a security analyst, I want to understand how Microsoft Sentinel identifies and manages entities so that I can effectively correlate alerts and investigate security threats.

---

# Entities in Microsoft Sentinel

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

Entities are classifications for data elements in Microsoft Sentinel alerts that enable correlation, analysis, and investigation across data sources. When Microsoft Sentinel recognizes data elements as specific entity types, it can correlate insights and track items throughout the entire Sentinel experience.

## Entity Categories

| Category | Characterization | Examples |
| -------- | --------------- | -------- |
| **Assets** | Internal, protected, inventoried objects | Accounts (Users), Hosts (Devices), Mailboxes, Azure resources |
| **Other entities** *(Evidence)* | External items, not controlled, indicators of compromise | IP addresses, Files, Processes, URLs |

## Entity Identification

### Identifiers

Each entity type has unique attributes (identifiers) used for recognition. Identifiers are classified as:

- **Strong identifiers**: Uniquely identify entities without ambiguity
- **Weak identifiers**: May identify entities under certain circumstances; combinations can create strong identification

### Example: User Account Identification

**Strong identifiers:**
- Microsoft Entra GUID
- User Principal Name (UPN)

**Weak identifiers (combinable):**
- Name + NTDomain fields

### Entity Merging

Microsoft Sentinel merges entities recognized as the same based on identifiers. Insufficient identification (single weak identifier without context) prevents proper merging, resulting in separate entity instances.

**Best Practices:**
- Ensure alert providers properly identify entities
- Synchronize user accounts with Microsoft Entra ID for unifying directory

## Supported Entity Types

- **[Account](entities-reference.md#account)**
- **[Host](entities-reference.md#host)**  
- **[IP address](entities-reference.md#ip)**
- **[URL](entities-reference.md#url)**
- **[Azure resource](entities-reference.md#azure-resource)**
- **[Cloud application](entities-reference.md#cloud-application)**
- **[DNS resolution](entities-reference.md#dns-resolution)**
- **[File](entities-reference.md#file)**
- **[File hash](entities-reference.md#file-hash)**
- **[Malware](entities-reference.md#malware)**
- **[Process](entities-reference.md#process)**
- **[Registry key](entities-reference.md#registry-key)**
- **[Registry value](entities-reference.md#registry-value)**
- **[Security group](entities-reference.md#security-group)**
- **[Mailbox](entities-reference.md#mailbox)**
- **[Mail cluster](entities-reference.md#mail-cluster)**
- **[Mail message](entities-reference.md#mail-message)**
- **[Submission mail](entities-reference.md#submission-mail)**

View complete identifier information in the [entities reference](entities-reference.md).

## Entity Mapping

Data processing flow:
1. **Data Ingestion**: Via connectors to Log Analytics workspace tables
2. **Query Execution**: Analytics rules query tables at regular intervals
3. **Field Mapping**: Map query result fields to entity identifiers
4. **Entity Recognition**: Apply entity types based on mapped identifiers
5. **Correlation**: Connect entities across alerts and data sources using common identifiers

Proper entity mapping enables:
- Cross-alert correlation
- Rich contextual information
- Enhanced threat detection and response

Learn more: [Map data fields to entities](map-data-fields-to-entities.md)

## Next steps

- [Enable entity behavior analytics](./enable-entity-behavior-analytics.md)
- [View detailed entity information](entity-pages.md)
- [Hunt for security threats](./hunting.md)
- [See complete entity types reference](entities-reference.md)
