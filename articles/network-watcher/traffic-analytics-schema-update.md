---
title: Traffic analytics schema update - March 2020
titleSuffix: Azure Network Watcher
description: Learn how to use queries to replace the deprecated fields in the Traffic Analytics schema with the new ones.
services: network-watcher
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 06/20/2023
ms.custom: template-how-to, kr2b-contr-experiment, engagement-fy23
---

# Use sample queries to replace deprecated fields in traffic analytics schema (March 2020 schema update)

The [Traffic analytics log schema](./traffic-analytics-schema.md) includes the following new fields:

- `SrcPublicIPs_s`
- `DestPublicIPs_s`
- `NSGRule_s`

The new fields provide information about source and destination IP addresses, and they simplify queries.

The following older fields will be deprecated in future:

- `VMIP_s`
- `Subscription_g`
- `Region_s`
- `NSGRules_s`
- `Subnet_s`
- `VM_s`
- `NIC_s`
- `PublicIPs_s`
- `FlowCount_d`

The following three examples show you how to replace the old fields with the new ones.

## Example 1: `VMIP_s`, `Subscription_g`, `Region_s`, `Subnet_s`, `VM_s`, `NIC_s`, and `PublicIPs_s` fields

The schema doesn't have to infer source and destination cases from the `FlowDirection_s` field for AzurePublic and ExternalPublic flows. It can also be inappropriate to use the `FlowDirection_s` field for a network virtual appliance.

Previous Kusto query:

```kusto
AzureNetworkAnalytics_CL
| where SubType_s == "FlowLog" and FASchemaVersion_s == "1"
| extend isAzureOrExternalPublicFlows = FlowType_s in ("AzurePublic", "ExternalPublic")
| extend SourceAzureVM = iif(isAzureOrExternalPublicFlows, iif(FlowDirection_s == 'O', VM_s, "N/A"), VM1_s),
SourceAzureVMIP = iif(isAzureOrExternalPublicFlows, iif(FlowDirection_s == 'O', VM_s, "N/A"), SrcIP_s),
SourceAzureVMSubscription = iif(isAzureOrExternalPublicFlows, iif(FlowDirection_s == 'O', Subscription_g, "N/A"), Subscription1_g),
SourceAzureRegion = iif(isAzureOrExternalPublicFlows, iif(FlowDirection_s == 'O', Region_s, "N/A"), Region1_s),
SourceAzureSubnet = iif(isAzureOrExternalPublicFlows, iif(FlowDirection_s == 'O', Subnet_s, "N/A"), Subnet1_s),
SourceAzureNIC = iif(isAzureOrExternalPublicFlows, iif(FlowDirection_s == 'O', NIC_s, "N/A"), NIC1_s),
DestAzureVM = iif(isAzureOrExternalPublicFlows, iif(FlowDirection_s == 'I', VM_s, "N/A"), VM2_s),
DestAzureVMIP = iif(isAzureOrExternalPublicFlows, iif(FlowDirection_s == 'I', VM_s, "N/A"), DestIP_s),
DestAzureVMSubscription = iif(isAzureOrExternalPublicFlows, iif(FlowDirection_s == 'I', Subscription_g, "N/A"), Subscription2_g),
DestAzureRegion = iif(isAzureOrExternalPublicFlows, iif(FlowDirection_s == 'I', Region_s, "N/A"), Region2_s),
DestAzureSubnet = iif(isAzureOrExternalPublicFlows, iif(FlowDirection_s == 'I', Subnet_s, "N/A"), Subnet2_s),
DestAzureNIC = iif(isAzureOrExternalPublicFlows, iif(FlowDirection_s == 'I', NIC_s, "N/A"), NIC2_s),
SourcePublicIPsAggregated = iif(isAzureOrExternalPublicFlows and FlowDirection_s == 'I', PublicIPs_s, "N/A"),
DestPublicIPsAggregated = iif(isAzureOrExternalPublicFlows and FlowDirection_s == 'O', PublicIPs_s, "N/A")
```

New Kusto query:

```kusto
AzureNetworkAnalytics_CL
| where SubType_s == "FlowLog" and FASchemaVersion_s == "2"
| extend SourceAzureVM = iif(isnotempty(VM1_s), VM1_s, "N/A"),
SourceAzureVMIP = iif(isnotempty(SrcIP_s), SrcIP_s, "N/A"),
SourceAzureVMSubscription = iif(isnotempty(Subscription1_g), Subscription1_g, "N/A"),
SourceAzureRegion = iif(isnotempty(Region1_s), Region1_s, "N/A"),
SourceAzureSubnet = iif(isnotempty(Subnet1_s), Subnet1_s, "N/A"),
SourceAzureNIC = iif(isnotempty(NIC1_s), NIC1_s, "N/A"),
DestAzureVM = iif(isnotempty(VM2_s), VM2_s, "N/A"),
DestAzureVMIP = iif(isnotempty(DestIP_s), DestIP_s, "N/A"),
DestAzureVMSubscription = iif(isnotempty(Subscription2_g), Subscription2_g, "N/A"),
DestAzureRegion = iif(isnotempty(Region2_s), Region2_s, "N/A"),
DestAzureSubnet = iif(isnotempty(Subnet2_s), Subnet2_s, "N/A"),
DestAzureNIC = iif(isnotempty(NIC2_s), NIC2_s, "N/A"),
SourcePublicIPsAggregated = iif(isnotempty(SrcPublicIPs_s), SrcPublicIPs_s, "N/A"),
DestPublicIPsAggregated = iif(isnotempty(DestPublicIPs_s), DestPublicIPs_s, "N/A")
```

## Example 2: `NSGRules_s` field

The old field used the following format:

```kusto
<Index value 0)>|<NSG_ RuleName>|<Flow Direction>|<Flow Status>|<FlowCount ProcessedByRule>
```

The schema no longer aggregates data across a network security group (NSG). In the updated schema, `NSGList_s` contains only one network security group. Also, `NSGRules` contains only one rule. The complicated formatting has been removed here and in other fields, as shown in the following example.

Previous Kusto query:

```kusto
AzureNetworkAnalytics_CL
| where SubType_s == "FlowLog" and FASchemaVersion_s == "1"
| extend NSGRuleComponents = split(NSGRules_s, "|")
| extend NSGName = NSGList_s // remains same
| extend NSGRuleName = NSGRuleComponents[1],
         FlowDirection = NSGRuleComponents[2],
         FlowStatus = NSGRuleComponents[3],
         FlowCountProcessedByRule = NSGRuleComponents[4]
| project NSGName, NSGRuleName, FlowDirection, FlowStatus, FlowCountProcessedByRule
```

New Kusto query:

```kusto
AzureNetworkAnalytics_CL
| where SubType_s == "FlowLog" and FASchemaVersion_s == "2"
| extend NSGRuleComponents = split(NSGRules_s, "|")
| project NSGName = NSGList_s,
NSGRuleName = NSGRule_s ,
FlowDirection = FlowDirection_s,
FlowStatus = FlowStatus_s,
FlowCountProcessedByRule = AllowedInFlows_d + DeniedInFlows_d + AllowedOutFlows_d + DeniedOutFlows_d
```

## Example 3: `FlowCount_d` field

Because the schema doesn't club data across the network security group, the `FlowCount_d` is simply:

`AllowedInFlows_d` + `DeniedInFlows_d` + `AllowedOutFlows_d` + `DeniedOutFlows_d`

Only one of the four fields is nonzero. The other three fields are zero. The fields populate to indicate the status and count in the NIC where the flow was captured.

To illustrate these conditions:

- If the flow was allowed, one of the `Allowed` prefixed fields is populated.
- If the flow was denied, one of the `Denied` prefixed fields is populated.
- If the flow was inbound, one of the `InFlows_d` suffixed fields is populated.
- If the flow was outbound, one of the `OutFlows_d` suffixed fields is populated.

Depending on the conditions, it's clear which of the four fields is populated.

## Next steps

- To get answers to frequently asked questions, see [Traffic analytics FAQ](traffic-analytics-faq.yml).
- To learn more about functionality, see [Traffic analytics overview](traffic-analytics.md).
