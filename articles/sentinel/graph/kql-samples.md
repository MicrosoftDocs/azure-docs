---  
title: Sample KQL queries for the data lake(Preview).
titleSuffix: Microsoft Security  
description:  Sample KQL queries for the Microsoft Sentinel data lake.
author: EdB-MSFT  
ms.service: sentinel  
ms.topic: how-to
ms.subservice: sentinel-graph
ms.date: 06/16/2025
ms.author: edbaynash  

ms.collection: ms-security  
---  
 

# Sample KQL queries for the Microsoft Sentinel data lake (Preview)

The following sample KQL queries can be used to explore and analyze data in the Microsoft Sentinel data lake. These queries are designed to help you get started with querying long-term data and can be modified to suit your specific needs.

## Investigate security incidents using long-term historical data

Security teams often need to go beyond the default retention window to uncover the full scope of an incident. The following query retrieves failed login attempts from the last 365 days, which can help identify patterns of suspicious activity.

```kql
let StartDate = datetime(2024-08-01);
let EndDate = datetime(2024-09-30);
let BinTime = 1h;
let sensitivity = 2.5;
let aadFunc = (tableName:string){
    table(tableName)
    | where TimeGenerated between (StartDate .. EndDate)
    | where AppDisplayName =~ "GitHub.com"
    | where ResultType != 0
    | make-series FailedLogins = count() on TimeGenerated from StartDate to EndDate step BinTime by UserPrincipalName, Type
    | extend (Anomalies, Score, Baseline) = series_decompose_anomalies(FailedLogins, sensitivity, -1, 'linefit')
    | mv-expand FailedLogins to typeof(double), TimeGenerated to typeof(datetime), Anomalies to typeof(double), Score to typeof(double), Baseline to typeof(long)
    | where Anomalies > 0 and Baseline > 0
    | join kind=inner (
        table(tableName)
        | where TimeGenerated between (StartDate .. EndDate)
        | where AppDisplayName =~ "GitHub.com"
        | where ResultType != 0
        | summarize StartTime = min(TimeGenerated), EndTime = max(TimeGenerated), IPAddresses = make_set(IPAddress,100), Locations = make_set(LocationDetails,20), Devices = make_set(DeviceDetail,20) by UserPrincipalName, UserId, AppDisplayName
    ) on UserPrincipalName
    | project-away UserPrincipalName1
    | extend Name = tostring(split(UserPrincipalName,'@',0)[0]), UPNSuffix = tostring(split(UserPrincipalName,'@',1)[0])
    | extend IPAddressFirst = tostring(IPAddresses[0])
};
let aadSignin = aadFunc("SigninLogs");
let aadNonInt = aadFunc("AADNonInteractiveUserSignInLogs");
union isfuzzy=true aadSignin, aadNonInt
```

## Detect anomalies and build behavioral baselines over time:

Build a time-series baseline of failed sign-ins per user over 180 days and flag deviations using anomaly detection to uncover suspicious login behavior.

```kql
let StartDate = ago(180d);
let EndDate = now();
let BinTime = 1h;
let Sensitivity = 3.0;
SigninLogs
| where TimeGenerated between (StartDate .. EndDate)
| where isnotempty(UserPrincipalName)
| where ResultType != 0  // Focus on failed or suspicious sign-ins
| summarize TimeSeries = make_list(pack("Time", TimeGenerated, "Count", 1)) by UserPrincipalName
| mv-expand TimeSeries
| evaluate bag_unpack(TimeSeries)
| project UserPrincipalName, TimeGenerated = todatetime(Time), Count = toint(Count)
| summarize CountSeries = make_list(Count), TimeSeries = make_list(TimeGenerated) by UserPrincipalName
| extend (Anomalies, Score, Baseline) = series_decompose_anomalies(CountSeries, Sensitivity, -1, 'linefit')
| mv-expand TimeGenerated = TimeSeries, Count = CountSeries, Anomalies, Score, Baseline
| where Anomalies > 0 and Baseline > 0
| project TimeGenerated, UserPrincipalName, Count, Anomalies, Score, Baseline
```

## Enrich investigations using high-volume, low-fidelity logs

Correlate Cisco firewall logs with attacker IPs identified from sign-in failures, enriching network events with domain context to trace lateral movement .

```kql
let timeframe = 24h;
let relevantErrorCodes = dynamic([
    50053, 50126, 50055, 50057, 50155, 50105, 50133,
    50005, 50076, 50079, 50173, 50158, 50072, 50074,
    53003, 53000, 53001, 50129
]);
// Attacker IPs from signin failures (enriched with domains)
let attackerSigninData = SigninLogs
| where TimeGenerated >= ago(timeframe)
| where ResultType in (relevantErrorCodes)
| summarize FailedAttempts = count(), Domains = make_set(UserPrincipalName, 50) by IPAddress
| where FailedAttempts > 5;
// Extract firewall logs where src or dst IP matches attacker IPs
let matchedFirewall = CiscoLog_CL
| where EventTime >= ago(timeframe)
| extend
    src_ip = extract(@"src=([^ ]+)", 1, Message),
    dst_ip = extract(@"dst=([^ ]+)", 1, Message)
| extend EventIP = coalesce(src_ip, dst_ip)
| project EventTime, EventIP, DeviceName, MessageID, Message;
// Join to enrich firewall logs with domain data
matchedFirewall
| join kind=leftouter (attackerSigninData) on $left.EventIP == $right.IPAddress
| project FirewallTime = EventTime, EventIP, DeviceName, MessageID, Message, SigninDomains = tostring(Domains)
| order by FirewallTime desc
```

## A threat analyst investigates newly published threat indicators

Query DeviceNetworkEvents and DeviceProcessEvents from early 2024 to trace outbound connections to known threat domains, revealing malware behavior.

```kql
let startTime = datetime(2024-01-01);
let endTime = datetime(2024-03-01);
let threatDomains = dynamic(["malicious.example.com", "c2.attacker.net"]);

DeviceNetworkEvents
| where TimeGenerated between (startTime .. endTime)
| where RemoteUrl in (threatDomains)
| project DeviceId, DeviceName, RemoteUrl, InitiatingProcessId, NetworkEventTime = TimeGenerated
| join kind=inner (
    DeviceProcessEvents
    | where TimeGenerated between (startTime .. endTime)
    | project DeviceId, ProcessId, FileName, FolderPath, ProcessTime = TimeGenerated
) on $left.DeviceId == $right.DeviceId and $left.InitiatingProcessId == $right.ProcessId
| extend Suspicious = "Yes", InvestigationStatus = "Pending Review"
| project DeviceName, RemoteUrl, FileName, FolderPath, NetworkEventTime, ProcessTime, Suspicious, InvestigationStatus
| sort by NetworkEventTime desc
```

## Explore asset data from sources beyond traditional security logs

Identify Entra ID users who are members of groups that have access to Azure resources, and list the resources and subscriptions they can access.

```kql
EntraGroupMemberships 
| join kind=inner ( 
EntraGroups 
| project GroupId = targetid, GroupName = displayName 
) on $left.sourceId == $right.GroupId 
| join kind=inner ( 
EntraUsers 
| project UserId = id, userPrincipalName, UserDisplayName = displayName 
) on $left.targetId == $right.UserId 
| join kind=inner ( 
ARGAuthorizationResources 
| project principalId = tags['principalId'], resourceId = id 
) on $left.sourceId == $right.principalId 
| join kind=inner ( 
ARGResources 
| project resourceId = id, ResourceName = name, ResourceType = type, subscriptionId 
) on resourceId 
| join kind=inner ( 
ARGSubscriptions 
| project subscriptionId, SubscriptionName = displayName 
) on subscriptionId 
| project userPrincipalName, UserDisplayName, GroupName, ResourceName, ResourceType, SubscriptionName
```

