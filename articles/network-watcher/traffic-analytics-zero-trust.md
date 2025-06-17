---
title: Apply Zero Trust Principles to Segment Azure Network through Traffic Analytics
description: Learn how to use Azure Traffic Analytics to apply Zero Trust principles, segment networks, and detect security risks in your Azure environment.
author:      shijaiswal # GitHub alias
ms.author:   shijaiswal # Microsoft alias
ms.service: azure-network-watcher
ms.topic: concept-article
ms.date:     06/04/2025
# Customer intent: As a network security engineer, I want to utilize traffic analytics to implement Zero Trust principles in my Azure environment, so that I can enhance network segmentation, detect threats, and improve overall security visibility.
---

# Apply Zero Trust principles to segment Azure network through traffic analytics



## What is Zero Trust ?

Zero Trust is a security strategy. It isn't a product or a service, but an approach in designing and implementing the following set of security principles.

|Principle|Description|
|---|---|
|Verify explicitly|Always authenticate and authorize based on all available data points.|
|Use least privilege access|Limit user access with Just-In-Time and Just-Enough-Access (JIT/JEA), risk-based adaptive policies, and data protection.|
|Assume breach|Minimize blast radius and segment access. Verify end-to-end encryption and use analytics to get visibility, drive threat detection, and improve defenses.|

With Zero Trust, you move away from a trust-by-default perspective to a trust-by-exception one. An integrated capability to automatically manage those exceptions and alerts is important. You can more easily detect threats, respond to threats, and prevent or block undesired events across your organization.

Azure’s cloud networking is designed with multiple layers of segmentation that can act as boundaries or trust zones. For more information about segmenting your Azure-based network using Zero Trust principles, see [Apply Zero Trust principles to segmenting Azure-based network communication](/security/zero-trust/azure-networking-segmentation).

## Zero Trust Maturity Model

The Cybersecurity & Infrastructure Security Agency (CISA) Zero Trust Maturity Model (ZTMM) is built upon five pillars that encompass functions to enhance Zero Trust protection areas. For more information, see [Configure Microsoft cloud services for the CISA Zero Trust Maturity Model](/security/zero-trust/cisa-zero-trust-maturity-model-intro)

- Identity
- Devices
- Networks
- Applications and workloads
- Data

The pillars span the ZTMM journey's four stages. For more information, see [ZTMM journey stages](/security/zero-trust/cisa-zero-trust-maturity-model-intro#ztmm-journey-stages).

- Traditional
- Initial
- Advanced
- Optimal

The four stages apply to the **Networks** pillar as follows:

| Stage | Networks pillar |
| ---- | ---- |
| Traditional | - Large perimeter / macro-segmentation <br> - Limited resilience and manually managed rulesets and configuration |
| Initial | - Initial isolation of critical workloads <br> - Network capabilities manage availability demands for more applications <br> - Partial dynamic network configuration |
| Advanced | - Expand isolation and resilience mechanism <br> - Configurations adapt based on risk-aware application profile assessments |
| Optimal | - Distribute micro-perimeter with just-in time and just enough access controls and proportionate resilience <br> - Configuration evolves to meet application profile needs |

## How can you use traffic analytics to achieve Zero Trust security?

Traffic Analytics provides insights into network traffic flows within your Azure environment. It uses virtual network flow logs and performs aggregation to reduce data volume while preserving key traffic patterns. The aggregated logs are then enriched with geographic, security, and topology information and stored in a Log Analytics workspace.

Traffic patterns are visualized using built-in dashboards, with flexibility to customize traffic insights using Azure Workbooks. The traffic analytics dashboard also enables you to configure alerts and initiate investigations in response to potential security breaches.

- **Monitor network traffic:** Capture inbound and outbound traffic using flow logs, and use traffic analytics to process and visualize this data. Gain insights into communication patterns, bandwidth usage, and traffic flows across workloads.

- **Identify workload communication patterns:** Analyze traffic analytics data to understand how resources communicate within and across tenants, subscriptions regions, virtual networks, subnets, protocols, security-based groups, services, and applications. Identify unnecessary or anomalous traffic patterns that could indicate potential security risks.

- **Insightful visualizations:** Use built-in and customizable visualizations in traffic analytics to explore traffic patterns and detect anomalies more effectively.

- **Detect compromised IPs/resources:** Use traffic analytics to identify potentially compromised IP addresses or resources, helping to strengthen security and maintain performance.

#### How to deploy Zero Trust Segmentation (ZTS) with Traffic Analytics?

As a first critical step to deploy Zero Trust Segmentation over existing or new Azure deployment user needs to

- **Start with default deny posture**: It starts with removing or disabling all existing inbound and outbound rules that allows traffic broadly (eg., Allow All, Allow, etc.,) and adding explicit deny rules for both inbound and outbound traffic.

- **Observe the patterns through Traffic Analytics**: Analyze Flow Logs to identify the traffic patterns that are essential for your workload. 

- **Create selective allow rules**: Based on insights from Traffic Analytics, define rules that explicitly allow only the observed and necessary traffic. This approach ensures that only validated, required traffic is permitted, aligning with Zero Trust principle of Verifying explicitly.

The following sections highlight key scenarios where traffic analytics supports segmentation to help implement Zero Trust principles in Azure.

## Scenario 1: Detect traffic flowing through risky or restricted regions

Use traffic analytics to detect incoming or outgoing traffic to high-risk regions as defined by your organization's policies. For example, you can identify traffic flowing to or from regions considered sensitive or restricted based on your organization’s security and compliance requirements.

```kusto
let ExternalIps = NTAIpDetails 
    | where Location in ("country1", "country2") 
    | where FlowType in ("MaliciousFlow", "ExternalPublic")
        //and FlowIntervalStartTime between (datetime('{timeInterval') .. datetime('{timeInterval'))
    | project-away
        TimeGenerated,
        SubType,
        FaSchemaVersion,
        FlowIntervalEndTime,
        FlowIntervalStartTime,
        FlowType,
        Type 
    | distinct Ip, ThreatType, DnsDomain, ThreatDescription, Location, PublicIpDetails, Url;
    let ExternalFlows =  NTANetAnalytics 
    //| where FlowStartTime between (datetime('{timeInterval}') .. datetime('{timeInterval}'))
    | where SubType == "FlowLog" and FlowType in ("ExternalPublic", "MaliciousFlow")
    | extend PublicIP = SrcPublicIps
    | extend ExtractedIPs = split(PublicIP, " ") // Split IPs by spaces
    | mv-expand ExtractedIPs // Expand into multiple rows
    | extend IP = tostring(split(ExtractedIPs, "|")[0])
    | extend AllSrcIps = coalesce(SrcIp, IP)
    | project 
        AllSrcIps,
        DestIp,
        SrcVm,
        DestVm,
        SrcSubscription,
        DestSubscription,FlowType; 
let SrcMalicious = ExternalFlows 
    | lookup kind=inner ExternalIps on $left.AllSrcIps == $right.Ip
    | extend CompromisedVM = iff(isnotempty(DestVm),strcat("/subscriptions/",DestSubscription,"/resourceGroups/",tostring(split(DestVm,"/")[0]),"/providers/Microsoft.Compute/virtualMachines/",tostring(split(DestVm,"/")[1])),'')
    | project
        SrcExternalIp = strcat('🌐 ', AllSrcIps),      
        DestCompromisedIp = strcat('🖥️', DestIp),
        CompromisedVM,
        PublicIpDetails,
        FlowType,
        ThreatType,
        DnsDomain,
        ThreatDescription,
        Location,
        Url;
SrcMalicious
| summarize count() by SrcExternalIp ,DestCompromisedIp, CompromisedVM,
        PublicIpDetails,
        FlowType,
        ThreatType,
        DnsDomain,
        ThreatDescription,
        Location,
        Url
```

## Scenario 2: Achieve traffic segmentation based on Azure service interactions

Use traffic analytics to gain a bird's-eye view of how different workloads interact with Azure services. For example, SAP workloads might communicate with Azure Arc infrastructure, while other workloads, such as development environments or productivity services, interact with Azure Monitor. These insights help you understand service dependencies, detect unexpected or anomalous traffic patterns, and enforce more granular security policies through micro-segmentation.

```kusto
let SpecificServices = NTAIpDetails
| where FlowType == "AzurePublic"
| where FlowIntervalStartTime > ago(4h)
| project Ip, PublicIpDetails;
let PublicIPs = NTANetAnalytics
| where SubType == 'FlowLog'
| where FlowIntervalStartTime > ago(4h)
| where(isnotempty(SrcPublicIps) or isnotempty(DestPublicIps))
| extend PublicIP = coalesce(SrcPublicIps, DestPublicIps), Vnet = iff(isnotempty(SrcSubnet), strcat("/subscriptions/", SrcSubscription, "/resourceGroups/", tostring(split(SrcSubnet, "/")[0]), "/providers/Microsoft.Network/virtualNetworks/", tostring(split(SrcSubnet, "/")[1])), iff(isnotempty(DestSubnet), strcat("/subscriptions/", DestSubscription, "/resourceGroups/", tostring(split(DestSubnet, "/")[0]), "/providers/Microsoft.Network/virtualNetworks/", tostring(split(DestSubnet, "/")[1])),''))
| extend ExtractedIPs = split(PublicIP, " ") // Split IPs by spaces
| mv-expand ExtractedIPs // Expand into multiple rows
| extend IP = tostring(split(ExtractedIPs, "|")[0]) // Extract IP address
| lookup kind=inner SpecificServices on $left.IP == $right.Ip
| project Vnet, PublicIpDetails;
PublicIPs
| summarize CounterValue = count() by Vnet, PublicIpDetails
| top 100 by CounterValue desc
```

## Scenario 3:  Identify blast radius in case of network breach

Use traffic analytics to trace the path of potentially malicious IP addresses attempting to communicate with your resources. In the event of a compromised virtual machine (VM), traffic analytics can help map all communications initiated by that VM over the past 24 hours, aiding in identifying potential data exfiltration and limiting the blast radius.

The following query identifies all direct and indirect IP addresses interacting with malicious flows from high-risk geographies:

```kusto
let MAliciousIps = NTAIpDetails 
| where FlowIntervalStartTime between (datetime('{timeInterval:startISO}') .. datetime('{timeInterval:endISO}'))
| where FlowType == "MaliciousFlow" 
| distinct Ip; 
let MaliciousFlows =  NTANetAnalytics 
| where FlowStartTime between (todatetime('{timeInterval:startISO}') .. todatetime('{timeInterval:endISO}'))
| where SubType == "FlowLog" and FlowType == "MaliciousFlow" 
| project SrcIp, DestIp, FlowLogResourceId, TargetResourceId; 
let SrcMalicious = MaliciousFlows 
| lookup kind=leftouter MAliciousIps on $left.SrcIp == $right.Ip 
| project SrcIp, DestIp; 
let DestMalicious = MaliciousFlows 
| lookup kind=leftouter MAliciousIps on $left.DestIp == $right.Ip 
| project SrcIp, DestIp; 
let MaliciousIps = SrcMalicious 
| union DestMalicious 
| distinct *; 
let SpecificCountryIPs = NTAIpDetails 
| where Location in ("country1", "country2") 
| project Ip; 
let SrcIpCountry = SpecificCountryIPs 
| join kind=inner NTANetAnalytics on $left.Ip == $right.SrcIp 
| project SrcIp, DestIp; 
let DestIpCountry = SpecificCountryIPs 
| join kind=inner NTANetAnalytics on $left.Ip == $right.DestIp 
| project SrcIp, DestIp; 
let SpecificCountryFlows = SrcIpCountry 
| union DestIpCountry; 
let MaliciousFlowsObserved = MaliciousIps 
| union SpecificCountryFlows 
| distinct SrcIp, DestIp; 
let MaliciousFlowsTransitive = MaliciousFlowsObserved 
| join kind=inner MaliciousFlowsObserved on $left.DestIp == $right.SrcIp 
| project SrcIp, DestIp = DestIp1 
| distinct SrcIp, DestIp; 
let MaliciousFlowsObserved1 = MaliciousFlowsObserved 
| union MaliciousFlowsTransitive 
| distinct SrcIp, DestIp; 
let MaliciousFlowsTransitive1 = MaliciousFlowsObserved1 
| join kind=inner MaliciousFlowsObserved1 on $left.DestIp == $right.SrcIp 
| project SrcIp, DestIp = DestIp1 
| distinct SrcIp, DestIp; 
let MaliciousFlowsObserved2 = MaliciousFlowsObserved1 
| union MaliciousFlowsTransitive1 
| distinct SrcIp, DestIp; 
MaliciousFlowsObserved2 
| project SrcIp = strcat('🖥️ ', SrcIp), DestIp = strcat('🖥️ ', DestIp)
```

## Scenario 4: Enforce subscription boundaries

Use traffic analytics to enforce subscription boundaries and ensure that traffic between different Azure subscriptions is properly segmented.

```kusto
NTANetAnalytics 
| where SubType == "FlowLog"  and FlowType !in ("AzurePublic","ExternalPublic","Unknown","UnknownPrivate") // Filter to flows for which we know the Subscription Details
| where FlowStartTime between (start .. end) 
| where AclGroup !contains "Unspecified" 
|extend Dest = iff(isnotempty(DestSubnet),strcat("/subscriptions/",DestSubscription,"/resourceGroups/",tostring(split(DestSubnet,"/")[0]),"/providers/Microsoft.Network/virtualNetworks/",tostring(split(DestSubnet,"/")[1])),'')
| extend Src = iff(isnotempty(SrcSubnet),strcat("/subscriptions/",SrcSubscription,"/resourceGroups/",tostring(split(SrcSubnet,"/")[0]),"/providers/Microsoft.Network/virtualNetworks/",tostring(split(SrcSubnet,"/")[1])),'')
| extend SrcSubscription = strcat("/subscriptions/",SrcSubscription), DestSubscription = strcat("/subscriptions/",DestSubscription)
| where SrcSubscription != DestSubscription // Cross Subscription
| summarize Flows = sum(CompletedFlows) by Src, Dest, SrcSubscription, DestSubscription, AclGroup,AclRule, FlowType
//| top 10 by Flows
```



