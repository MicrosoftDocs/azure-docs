---
title: Work with STIX objects and indicators to enhance threat intelligence and threat hunting in Microsoft Sentinel (Preview)
titleSuffix: Microsoft Sentinel
description: This article provides examples of how to incorporate STIX objects into queries to enhance threat hunting.
author: guywi-ms
ms.topic: how-to
ms.date: 03/31/2025
ms.author: guywild
ms.reviewer: alsheheb
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security
#Customer intent: As a security analyst, I want to understand how to incorporate STIX objects into queries to enhance threat hunting.
---

# Work with STIX objects and indicators to enhance threat intelligence and threat hunting in Microsoft Sentinel (Preview)

On April 3, 2025, we publicly previewed two new tables to support STIX (Structured Threat Information eXpression) indicator and object schemas: `ThreatIntelIndicators` and `ThreatIntelObjects`. This article provides examples of how to incorporate STIX objects into queries to enhance threat hunting, and how to migrate to the new threat indicator schema.

For more information about threat intelligence in Microsoft Sentinel, see [Threat intelligence in Microsoft Sentinel](understand-threat-intelligence.md).

>[!IMPORTANT]
> Microsoft Sentinel will ingest all threat intelligence into the new `ThreatIntelIndicators` and `ThreatIntelObjects` tables, while continuing to ingest the same data into the legacy `ThreatIntelligenceIndicator` table until July 31, 2025. 
>
> **Be sure to update your custom queries, analytics and detection rules, workbooks, and automation to use the new tables by July 31, 2025.** After this date, Microsoft Sentinel will stop ingesting data to the legacy `ThreatIntelligenceIndicator` table. We're updating all out-of-the-box threat intelligence solutions in Content hub to leverage the new tables. For more information about the new table schemas, see [ThreatIntelIndicators](/azure/azure-monitor/reference/tables/threatintelligenceindicator) and [ThreatIntelObjects](/azure/azure-monitor/reference/tables/threatintelobjects).

## Identify threat actors associated with specific threat indicators

This query is an example of how to correlate threat indicators, such as IP addresses, with threat actors:

```Kusto
 let IndicatorsWithThatIP = (ThreatIntelIndicators
| extend tlId = tostring(Data.id)
| summarize arg_max(TimeGenerated,*) by Id
|  where IsDeleted == false);
let ThreatActors = (ThreatIntelObjects
| where StixType == 'threat-actor'
| extend tlId = tostring(Data.id)
| extend ThreatActorName = Data.name
| extend ThreatActorSource = base64_decode_tostring(tostring(split(Id, '---')[0]))
| summarize arg_max(TimeGenerated,*) by Id
|  where IsDeleted == false);
let AllRelationships = (ThreatIntelObjects
| where StixType == 'relationship'
| extend tlSourceRef = tostring(Data.source_ref)
| extend tlTargetRef = tostring(Data.target_ref)
| extend tlId = tostring(Data.id)
| summarize arg_max(TimeGenerated,*) by Id
|  where IsDeleted == false);
let IndicatorAsSource = (IndicatorsWithThatIP
| join AllRelationships on $left.tlId == $right.tlSourceRef
| join ThreatActors on $left.tlTargetRef == $right.tlId);
let IndicatorAsTarget = (IndicatorsWithThatIP
| join AllRelationships on $left.tlId == $right.tlTargetRef
| join ThreatActors on $left.tlSourceRef == $right.tlId);
IndicatorAsSource
| union IndicatorAsTarget
| project ObservableValue, ThreatActorName
```


## List threat intelligence data related to a specific threat actor 

This query provides insights into the tactics, techniques, and procedures (TTPs) of the threat actor (replace `Sangria Tempest` with the name of the threat actor you want to investigate):

```Kusto
let THREAT_ACTOR_NAME = 'Sangria Tempest';
let ThreatIntelObjectsPlus = (ThreatIntelObjects
| union (ThreatIntelIndicators
| extend StixType = 'indicator')
| extend tlId = tostring(Data.id)
| extend PlusStixTypes = StixType
| extend importantfield = case(StixType == "indicator", Data.pattern,
                            StixType == "attack-pattern", Data.name,
                            "Unkown")
| extend feedSource = base64_decode_tostring(tostring(split(Id, '---')[0]))
| summarize arg_max(TimeGenerated,*) by Id
|  where IsDeleted == false);
let ThreatActorsWithThatName = (ThreatIntelObjects
| where StixType == 'threat-actor'
| where Data.name == THREAT_ACTOR_NAME
| extend tlId = tostring(Data.id)
| extend ActorName = tostring(Data.name)
| summarize arg_max(TimeGenerated,*) by Id
|  where IsDeleted == false);
let AllRelationships = (ThreatIntelObjects
| where StixType == 'relationship'
| extend tlSourceRef = tostring(Data.source_ref)
| extend tlTargetRef = tostring(Data.target_ref)
| extend tlId = tostring(Data.id)
| summarize arg_max(TimeGenerated,*) by Id
|  where IsDeleted == false);
let SourceRelationships = (ThreatActorsWithThatName
| join AllRelationships on $left.tlId == $right.tlSourceRef
| join ThreatIntelObjectsPlus on $left.tlTargetRef == $right.tlId);
let TargetRelationships = (ThreatActorsWithThatName
| join AllRelationships on $left.tlId == $right.tlTargetRef
| join ThreatIntelObjectsPlus on $left.tlSourceRef == $right.tlId);
SourceRelationships
| union TargetRelationships
| project ActorName, PlusStixTypes, ObservableValue, importantfield, Tags, feedSource
 ```

## Migrate existing queries to the new ThreatIntelObjects schema

This example shows how to migrate existing queries from the legacy `ThreatIntelligenceIndicator` table to the new `ThreatIntelObjects` schema. The query uses the `extend` operator to recreate legacy columns based on the `ObservableKey` and `ObservableValue` columns in the new table. 

```Kusto
ThreatIntelIndicators
| extend NetworkIP = iff(ObservableKey == 'ipv4-addr:value', ObservableValue, ''),
        NetworkSourceIP = iff(ObservableKey == 'network-traffic:src_ref.value', ObservableValue, ''),
        NetworkDestinationIP = iff(ObservableKey == 'network-traffic:dst_ref.value', ObservableValue, ''),
        DomainName = iff(ObservableKey == 'domain-name:value', ObservableValue, ''),
        EmailAddress = iff(ObservableKey == 'email-addr:value', ObservableValue, ''),
        FileHashType = case(ObservableKey has 'MD5', 'MD5',
                                ObservableKey has 'SHA-1', 'SHA-1',
                                ObservableKey has 'SHA-256', 'SHA-256',
                                ''),
        FileHashValue = iff(ObservableKey has 'file:hashes', ObservableValue, ''),
        Url = iff(ObservableKey == 'url:value', ObservableValue, ''),
        x509Certificate = iff(ObservableKey has 'x509-certificate:hashes.', ObservableValue, ''),
        x509Issuer = iff(ObservableKey has 'x509-certificate:issuer', ObservableValue, ''),
        x509CertificateNumber = iff(ObservableKey == 'x509-certificate:serial_number', ObservableValue, ''),        
        Description = tostring(Data.description),
        CreatedByRef = Data.created_by_ref,
        Extensions = Data.extensions,
        ExternalReferences = Data.references,
        GranularMarkings = Data.granular_markings,
        IndicatorId = tostring(Data.id),
        ThreatType = tostring(Data.indicator_types[0]),
        KillChainPhases = Data.kill_chain_phases,
        Labels = Data.labels,
        Lang = Data.lang,
        Name = Data.name,
        ObjectMarkingRefs = Data.object_marking_refs,
        PatternType = Data.pattern_type,
        PatternVersion = Data.pattern_version,
        Revoked = Data.revoked,
        SpecVersion = Data.spec_version
| project-reorder TimeGenerated, WorkspaceId, AzureTenantId, ThreatType, ObservableKey, ObservableValue, Confidence, Name, Description, LastUpdateMethod, SourceSystem, Created, Modified, ValidFrom, ValidUntil, IsDeleted, Tags, AdditionalFields, CreatedByRef, Extensions, ExternalReferences, GranularMarkings, IndicatorId, KillChainPhases, Labels, Lang, ObjectMarkingRefs, Pattern, PatternType, PatternVersion, Revoked, SpecVersion, NetworkIP, NetworkDestinationIP, NetworkSourceIP, DomainName, EmailAddress, FileHashType, FileHashValue, Url, x509Certificate, x509Issuer, x509CertificateNumber, Data
```

## Related content

For more information, see the following articles:

- [Threat intelligence in Microsoft Sentinel](understand-threat-intelligence.md).
- Connect Microsoft Sentinel to [STIX/TAXII threat intelligence feeds](./connect-threat-intelligence-taxii.md).
- See which [TIPs, TAXII feeds, and enrichments](threat-intelligence-integration.md) can be readily integrated with Microsoft Sentinel.

[!INCLUDE [kusto-reference-general-no-alert](includes/kusto-reference-general-no-alert.md)]
