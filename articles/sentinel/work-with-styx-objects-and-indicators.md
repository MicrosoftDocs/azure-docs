---
title: Work with STIX objects to enhance threat intelligence and threat hunting in Microsoft Sentinel (Preview)
titleSuffix: Microsoft Sentinel
description: This article provides examples of how to incorporate STIX objects into queries to enhance threat hunting.
author: guywi-ms
ms.topic: how-to
ms.date: 03/31/2025
ms.author: guywild
ms.reviewer: alsheheb
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#Customer intent: As a security analyst, I want to understand how to incorporate STIX objects into queries to enhance threat hunting.
---

# Work with STIX objects to enhance threat intelligence and threat hunting in Microsoft Sentinel (Preview)

On March 31, 2025, we publicly previewed two new tables to support STIX indicator and object schemas: `ThreatIntelIndicator` and `ThreatIntelObjects`. For more information about these table schemas, see [ThreatIntelIndicator](/azure/azure-monitor/reference/tables/threatintelligenceindicator) and [ThreatIntelObjects](/azure/azure-monitor/reference/tables/threatintelobjects).
 This article provides examples of how to incorporate STIX objects into queries to enhance threat hunting.

>[!IMPORTANT]
> On March 31, 2025, we publicly previewed two new tables to support STIX indicator and object schemas: `ThreatIntelIndicator` and `ThreatIntelObjects`. Microsoft Sentinel will ingest all threat intelligence into these new tables, while continuing to ingest the same data into the legacy `ThreatIntelligenceIndicator` table until July 31, 2025. 
>
> **Be sure to update your custom queries, analytics and detection rules, workbooks, and automation to use the new tables by July 31, 2025.** After this date, the legacy `ThreatIntelligenceIndicator` table will no longer be available in Microsoft Sentinel. All out-of-the box threat intelligence solutions in Content hub have been updated to leverage the new tables. For more information about the new table schemas, see [ThreatIntelIndicator](/azure/azure-monitor/reference/tables/threatintelligenceindicator) and [ThreatIntelObjects](/azure/azure-monitor/reference/tables/threatintelobjects).

**Be sure to update your custom queries, analytics and detection rules, workbooks, and automation to use the new tables by July 31, 2025.** After this date, the legacy `ThreatIntelligenceIndicator` table will no longer be available in Microsoft Sentinel. All out-of-the box threat intelligence solutions in Content hub have been updated to leverage the new tables.

## Identify threat actors associated with specific threat indicators

This query correlates threat indicators with threat actors:

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


## Related content

For more information, see the following articles:

- [Threat intelligence in Microsoft Sentinel](understand-threat-intelligence.md).
- Connect Microsoft Sentinel to [STIX/TAXII threat intelligence feeds](./connect-threat-intelligence-taxii.md).
- See which [TIPs, TAXII feeds, and enrichments](threat-intelligence-integration.md) can be readily integrated with Microsoft Sentinel.

[!INCLUDE [kusto-reference-general-no-alert](includes/kusto-reference-general-no-alert.md)]
