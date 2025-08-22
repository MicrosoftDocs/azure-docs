---
title: Sample KQL queries for Microsoft Sentinel data lake
titleSuffix: Microsoft Security
description: Use KQL queries to explore and analyze data in the Microsoft Sentinel data lake.

author: EdB-MSFT
ms.service: microsoft-sentinel
ms.topic: how-to
ms.subservice: sentinel-graph
ms.date: 08/20/2025
ms.author: edbaynash
ms.collection: ms-security

#customer intent: As a security analyst, I want to run learn from sample KQL queries so that I can investigate incidents and monitor suspicious activity in Microsoft Sentinel data lake.
---  


# Sample KQL queries for Microsoft Sentinel data lake

This article provides sample KQL queries that you can use interactively or in KQL jobs to investigate security incidents and monitor for suspicious activity in the Microsoft Sentinel data lake.

Interactive queries are run manually in tools like advanced hunting and KQL queries in data lake exploration. Interactive queries are great for ad-hoc investigation, troubleshooting, or exploring data.

Job queries are one-time, long running queries or queries that run automatically on a schedule. Use job queries for data aggregation tasks, historical threat intelligence, and anomaly detection. Job queries often summarize, aggregate, or export results.


## Sample interactive queries

The following sample interactive queries can be used to explore and analyze data in the Microsoft Sentinel data lake.

### Identify possible insider threats

Detect historical access to sensitive document files on endpoints by correlating file activity with Microsoft Purview sensitivity label, for example Confidential, Highly Confidential, or Restricted. Use this query to uncover signs of data exfiltration, policy violations, or suspicious user behavior that may have gone unnoticed during the original 90–180 day time window.


```KQL
DeviceFileEvents
| where Timestamp between (datetime_add("day", -180, now()) .. datetime_add("day", -90, now()))
| where FileName endswith ".docx" or FileName endswith ".pdf" or FileName endswith ".xlsx"
| where FolderPath contains "Confidential" or FolderPath contains "Sensitive" or FolderPath contains "Restricted"
| where ActionType in ("FileAccessed", "FileRead", "FileModified", "FileCopied", "FileMoved")
| extend User = tostring(InitiatingProcessAccountName)
| summarize AccessCount = count(), FirstAccess = min(Timestamp), LastAccess = max(Timestamp) by FileName, FolderPath, User
| sort by AccessCount desc
```

### Investigate potential privilege escalation or unauthorized administrative actions

Identify users who successfully signed in and performed sensitive operations such as “add service principal” or “certificates and secrets management” between 90 and 180 days ago. This query links individual sign-in events with corresponding audit logs to provide detailed visibility into each action. The results include the user identity, IP address, and accessed applications, enabling granular investigation of potentially risky behavior.	

```KQL
AuditLogs
| where TimeGenerated between(ago(180d)..ago(90d))
| where OperationName has_any ("Add service principal", "Certificates and secrets management")
| extend Actor = tostring(parse_json(tostring(InitiatedBy.user)).userPrincipalName)
| project AuditTime = TimeGenerated, Actor, OperationName
| join kind=inner (
    SigninLogs
    | where ResultType == 0 and TimeGenerated between(ago(180d)..ago(90d))
    | project LoginTime = TimeGenerated, Identity, IPAddress, AppDisplayName
) on $left.Actor == $right.Identity
| project AuditTime, Actor, OperationName, LoginTime, IPAddress, AppDisplayName
| sort by Actor asc, LoginTime desc
```

### Investigate slow brute force attack

Detect IP addresses with a high number of failed sign-in attempts and specific error codes coming from multiple unique users.

```KQL
let relevantErrorCodes = dynamic([50053, 50126, 50055, 50057, 50155, 50105, 50133, 50005, 50076, 50079, 50173, 50158, 50072, 50074, 53003, 53000, 53001, 50129]);
SigninLogs
| where TimeGenerated >= ago(180d)
| where ResultType in (relevantErrorCodes)
| extend OS = tostring(parse_json(DeviceDetail).operatingSystem)
| project TimeGenerated, IPAddress, Location, OS, UserPrincipalName, ResultType, ResultDescription
| summarize FailedAttempts = count(), UniqueUsers = dcount(UserPrincipalName) by IPAddress, Location, OS
| where FailedAttempts > 5 and UniqueUsers > 5
| order by FailedAttempts desc
```

## Sample queries for KQL jobs

The following queries can be used in KQL jobs to automate investigations and monitoring tasks in the Microsoft Sentinel data lake.


### Brute force attack incident investigation

Enrich sign-in logs with network logs for brute force attack incident investigation.

```KQL
// Attacker IPs from signin failures (enriched with domains)
let relevantErrorCodes = dynamic([50053, 50126, 50055, 50057, 50155, 50105, 50133, 50005, 50076, 50079, 50173, 50158, 50072, 50074, 53003, 53000, 53001, 50129]);
let attackerSigninData = SigninLogs
| where ResultType in (relevantErrorCodes)
| summarize FailedAttempts = count(), Domains = make_set(UserPrincipalName, 50) by IPAddress
| where FailedAttempts > 5;
// Extract firewall logs where src or dst IP matches attacker IPs
let matchedFirewall = CommonSecurityLog
| extend
    src_ip = SourceIP,
    dst_ip = DestinationIP
| extend EventIP = coalesce(src_ip, dst_ip)
| project EventTime = TimeGenerated, EventIP, DeviceName, MessageID = DeviceEventClassID, Message = AdditionalExtensions;
// Join to enrich firewall logs with domain data
matchedFirewall
| join kind=leftouter (attackerSigninData) on $left.EventIP == $right.IPAddress
| project FirewallTime = EventTime, EventIP, DeviceName, MessageID, Message, SigninDomains = tostring(Domains)
| order by FirewallTime desc

```

### Historical activity involving IP addresses from threat intelligence

Uncover historical network activity involving IP addresses from threat intelligence, helping trace potential exposure or compromise that occurred 3–6 months ago. 

```KQL
let IPRegex = '[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}';
let dt_start = ago(180d);
let dt_end = ago(90d);
let ioc_lookBack = 180d;
let IP_Indicators = ThreatIntelIndicators
    | extend IndicatorType = replace(@"\[|\]|\""", "", tostring(split(ObservableKey, ":", 0)))
    | where IndicatorType in ("ipv4-addr", "ipv6-addr", "network-traffic")
    | extend NetworkSourceIP = toupper(ObservableValue)
    | extend TrafficLightProtocolLevel = tostring(parse_json(AdditionalFields).TLPLevel)
    | where TimeGenerated >= dt_start
    | extend TI_ipEntity = iff(isnotempty(NetworkSourceIP), NetworkSourceIP, NetworkSourceIP)
    | extend TI_ipEntity = iff(isempty(TI_ipEntity) and isnotempty(NetworkSourceIP), NetworkSourceIP, TI_ipEntity)
    | where ipv4_is_private(TI_ipEntity) == false 
        and TI_ipEntity !startswith "fe80" 
        and TI_ipEntity !startswith "::" 
        and TI_ipEntity !startswith "127."
    | where IsActive and (ValidUntil > dt_start or isempty(ValidUntil));
IP_Indicators
    | project-reorder *, Tags, TrafficLightProtocolLevel, NetworkSourceIP, Type, TI_ipEntity
    | join kind=innerunique (
        CommonSecurityLog
        | where TimeGenerated between (dt_start .. dt_end)
        | extend MessageIP = extract(IPRegex, 0, Message)
        | extend CS_ipEntity = iff((not(ipv4_is_private(SourceIP)) and isnotempty(SourceIP)), SourceIP, DestinationIP)
        | extend CS_ipEntity = iff(isempty(CS_ipEntity) and isnotempty(MessageIP), MessageIP, CS_ipEntity)
        | extend CommonSecurityLog_TimeGenerated = TimeGenerated
    )
    on $left.TI_ipEntity == $right.CS_ipEntity
    | where CommonSecurityLog_TimeGenerated < ValidUntil
    | project 
        timestamp = CommonSecurityLog_TimeGenerated, 
        SourceIP, DestinationIP, MessageIP, Message, 
        DeviceVendor, DeviceProduct, Id, ValidUntil, Confidence, 
        TI_ipEntity, CS_ipEntity, LogSeverity, DeviceAction, Type

```

### Suspicious travel activity

Look for successful sign-ins from countries or regions not previously seen for a given user, which may signal account compromise or suspicious travel activity in the last 180 days.

```KQL
SigninLogs
| where TimeGenerated >= ago(180d)
| where ResultType == 0
| summarize CountriesAccessed = make_set(Location) by UserPrincipalName
| where array_length(CountriesAccessed) > 3  // Adjust threshold
```


### Daily sign-in baseline

Create a daily baseline of all users and their sign-in locations.

```KQL
SigninLogs
| where ResultType == 0
| where TimeGenerated between (ago(180d)..ago(1d))  // Historical window excluding today
| summarize HistoricalCountries = make_set(Location) by UserPrincipalName
| join kind=inner (
    SigninLogs
    | where ResultType == 0
    | where TimeGenerated between (startofday(ago(0d))..now())  // Today’s sign-ins
    | summarize TodayCountries = make_set(Location) by UserPrincipalName
) on UserPrincipalName
| extend NewLocations = set_difference(TodayCountries, HistoricalCountries)
| project UserPrincipalName, HistoricalCountries, TodayCountries, NewLocations
| where array_length(NewLocations) > 0
```


### Daily location trend per user and application

A daily job to summarize sign-in activity by user and application, showing the list and count of distinct geographic locations and IPs used in the last 24 hours.

```KQL
SigninLogs
  | where TimeGenerated > ago(1d)
  | extend locationString= strcat(tostring(LocationDetails["countryOrRegion"]), "/", 
  tostring(LocationDetails["state"]), "/", tostring(LocationDetails["city"]), ";")
  | extend Day = format_datetime(TimeGenerated, "yyyy-MM-dd")
  | summarize LocationList = make_set(locationString), LocationCount=dcount(locationString), 
  DistinctSourceIp = dcount(IPAddress), LogonCount = count() by Day, AppDisplayName, UserPrincipalName
```

### Daily process execution trend

A daily job to track process creation events (Event ID 4688) from `SecurityEvents`, summarizing counts by process name along with the number of distinct computers, accounts, parent processes, and unique command lines observed in the past 24 hours.	

```KQL

// Frequency - Daily - Maintain 30 day or 60 Day History.
  SecurityEvent
  | where TimeGenerated > ago(1d)
  | where EventID==4688
  | extend Day = format_datetime(TimeGenerated, "yyyy-MM-dd")
  | summarize Count= count(), DistinctComputers = dcount(Computer), DistinctAccounts = dcount(Account), 
  DistinctParent = dcount(ParentProcessName), NoofCommandLines = dcount(CommandLine) by Day, NewProcessName
```

