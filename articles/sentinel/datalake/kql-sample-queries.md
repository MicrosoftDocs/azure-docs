---
title: Sample KQL queries for Microsoft Sentinel data lake
titleSuffix: Microsoft Security
description: Use KQL queries to explore and analyze data in the Microsoft Sentinel data lake.

author: EdB-MSFT
ms.service: microsoft-sentinel
ms.topic: how-to
ms.subservice: sentinel-graph
ms.date: 12/10/2025
ms.author: edbaynash
ms.collection: ms-security

#customer intent: As a security analyst, I want to run learn from sample KQL queries so that I can investigate incidents and monitor suspicious activity in Microsoft Sentinel data lake.
---  


# Sample KQL queries for Microsoft Sentinel data lake

This article provides sample KQL queries that you can use interactively or in KQL jobs to investigate security incidents and monitor for suspicious activity in the Microsoft Sentinel data lake.

## Out of the box queries

Microsoft Sentinel includes a set of out-of-the-box KQL queries that you can use to explore and analyze data in the data lake. These queries are available in the KQL query editor under the **Queries** tab. For more information, see [Run KQL queries](kql-queries.md#out-of-the-box-queries).


### Anomalous sign-in locations increase

**Category**: Threat activities

Analyze trend analysis of Entra ID sign-in logs to detect unusual location changes for users across applications by computing trend lines of location diversity. It highlights the top three accounts with the steepest increase in location variability and lists their associated locations within 21-day windows.
 
```kql
SigninLogs
| where TimeGenerated > ago(1d)
// Forces Log Analytics to recognize that the query should be run over full time range
| extend locationString = strcat(tostring(LocationDetails["countryOrRegion"]), "/", tostring(LocationDetails["state"]), "/", tostring(LocationDetails["city"]), ";")
| project TimeGenerated, AppDisplayName, UserPrincipalName, locationString
// Create time series
| make-series dLocationCount = dcount(locationString) on TimeGenerated step 1d by UserPrincipalName, AppDisplayName
// Compute best fit line for each entry
| extend (RSquare, Slope, Variance, RVariance, Interception, LineFit) = series_fit_line(dLocationCount)
// Chart the 3 most interesting lines
// A 0-value slope corresponds to an account being completely stable over time for a given Azure Active Directory application
| top 3 by Slope desc
// Extract the set of locations for each top user:
| join kind=inner (
    SigninLogs
    | extend locationString = strcat(tostring(LocationDetails["countryOrRegion"]), "/", tostring(LocationDetails["state"]), "/", tostring(LocationDetails["city"]), ";")
    | summarize locationList = makeset(locationString), threeDayWindowLocationCount = dcount(locationString) by AppDisplayName, UserPrincipalName, timerange = bin(TimeGenerated, 21d)
) on AppDisplayName, UserPrincipalName
| order by UserPrincipalName, timerange asc
| project timerange, AppDisplayName, UserPrincipalName, threeDayWindowLocationCount, locationList
| order by AppDisplayName, UserPrincipalName, timerange asc
| extend timestamp = timerange, AccountCustomEntity = UserPrincipalName
``` 



### Anomalous sign-in behavior based on location changes

**Category**: Anomalies

Identify anomalous sign-in behavior based on location changes for Entra ID users and apps to detect sudden changes in behavior.

```kql
SigninLogs
| where TimeGenerated > ago(1d)
// Forces Log Analytics to recognize that the query should be run over full time range
| extend locationString = strcat(tostring(LocationDetails["countryOrRegion"]), "/", tostring(LocationDetails["state"]), "/", tostring(LocationDetails["city"]), ";")
| project TimeGenerated, AppDisplayName, UserPrincipalName, locationString
// Create time series
| make-series dLocationCount = dcount(locationString) on TimeGenerated step 1d by UserPrincipalName, AppDisplayName
// Compute best fit line for each entry
| extend (RSquare, Slope, Variance, RVariance, Interception, LineFit) = series_fit_line(dLocationCount)
// Chart the 3 most interesting lines
// A 0-value slope corresponds to an account being completely stable over time for a given Azure Active Directory application
| top 3 by Slope desc
// Extract the set of locations for each top user:
| join kind=inner (
    SigninLogs
    | extend locationString = strcat(tostring(LocationDetails["countryOrRegion"]), "/", tostring(LocationDetails["state"]), "/", tostring(LocationDetails["city"]), ";")
    | summarize locationList = makeset(locationString), threeDayWindowLocationCount = dcount(locationString) by AppDisplayName, UserPrincipalName, timerange = bin(TimeGenerated, 21d)
) on AppDisplayName, UserPrincipalName
| order by UserPrincipalName, timerange asc
| project timerange, AppDisplayName, UserPrincipalName, threeDayWindowLocationCount, locationList
| order by AppDisplayName, UserPrincipalName, timerange asc
| extend timestamp = timerange, AccountCustomEntity = UserPrincipalName
```



### Audit rare activity by app

**Category**: Threat activities

Find apps performing rare actions (for example, consent, grants) that can quietly create privilege. Compare the current day to last 14 days of audits to identify new audit activities. Useful for tracking malicious activity related to user/group additions or removals by Azure Apps and automated approvals.

```kql
let starttime = todatetime('{{StartTimeISO}}');
let endtime = todatetime('{{EndTimeISO}}');
let auditLookback = starttime - 14d;
let propertyIgnoreList = dynamic(["TargetId.UserType", "StsRefreshTokensValidFrom", "LastDirSyncTime", "DeviceOSVersion", "CloudDeviceOSVersion", "DeviceObjectVersion"]);
let appIgnoreList = dynamic(["Microsoft Azure AD Group-Based Licensing"]);
let AuditTrail = AuditLogs
| where TimeGenerated between(auditLookback..starttime)
| where isnotempty(tostring(parse_json(tostring(InitiatedBy.app)).displayName))
| extend InitiatedByApp = tostring(parse_json(tostring(InitiatedBy.app)).displayName)
| extend ModProps = TargetResources[0].modifiedProperties
| extend InitiatedByIpAddress = tostring(parse_json(tostring(InitiatedBy.app)).ipAddress)
| extend TargetUserPrincipalName = tolower(tostring(TargetResources[0].userPrincipalName))
| extend TargetResourceName = tolower(tostring(TargetResources[0].displayName))
| mv-expand ModProps
| where isnotempty(tostring(parse_json(tostring(ModProps.newValue))[0]))
| extend PropertyName = tostring(ModProps.displayName), newValue = tostring(parse_json(tostring(ModProps.newValue))[0])
| where PropertyName !in~ (propertyIgnoreList) and (PropertyName !~ "Action Client Name" and newValue !~ "DirectorySync") and (PropertyName !~ "Included Updated Properties" and newValue !~ "LastDirSyncTime")
| where InitiatedByApp !in~ (appIgnoreList) and OperationName !~ "Change user license"
| summarize by OperationName, InitiatedByApp, TargetUserPrincipalName, InitiatedByIpAddress, TargetResourceName, PropertyName;
let AccountMods = AuditLogs
| where TimeGenerated >= starttime
| where isnotempty(tostring(parse_json(tostring(InitiatedBy.app)).displayName))
| extend InitiatedByApp = tostring(parse_json(tostring(InitiatedBy.app)).displayName)
| extend ModProps = TargetResources[0].modifiedProperties
| extend InitiatedByIpAddress = tostring(parse_json(tostring(InitiatedBy.app)).ipAddress)
| extend TargetUserPrincipalName = tolower(tostring(TargetResources[0].userPrincipalName))
| extend TargetResourceName = tolower(tostring(TargetResources[0].displayName))
| mv-expand ModProps
| where isnotempty(tostring(parse_json(tostring(ModProps.newValue))[0]))
| extend PropertyName = tostring(ModProps.displayName), newValue = tostring(parse_json(tostring(ModProps.newValue))[0])
| where PropertyName !in~ (propertyIgnoreList) and (PropertyName !~ "Action Client Name" and newValue !~ "DirectorySync") and (PropertyName !~ "Included Updated Properties" and newValue !~ "LastDirSyncTime")
| where InitiatedByApp !in~ (appIgnoreList) and OperationName !~ "Change user license"
| extend ModifiedProps = pack("PropertyName", PropertyName, "newValue", newValue, "Id", Id, "CorrelationId", CorrelationId)
| summarize StartTimeUtc = min(TimeGenerated), EndTimeUtc = max(TimeGenerated), Activity = make_bag(ModifiedProps) by Type, InitiatedByApp, TargetUserPrincipalName, InitiatedByIpAddress, TargetResourceName, Category, OperationName, PropertyName;
let RareAudits = AccountMods
| join kind=leftanti (
    AuditTrail
) on OperationName, InitiatedByApp, InitiatedByIpAddress, TargetUserPrincipalName; //, PropertyName; //uncomment if you want to see Rare Property changes.
RareAudits
| summarize StartTime = min(StartTimeUtc), EndTime = max(EndTimeUtc), make_set(Activity), make_set(PropertyName) by InitiatedByApp, OperationName, TargetUserPrincipalName, InitiatedByIpAddress, TargetResourceName
| order by TargetUserPrincipalName asc, StartTime asc
| extend timestamp = StartTime, AccountCustomEntity = TargetUserPrincipalName, HostCustomEntity = iff(set_PropertyName has_any ('DeviceOSType', 'CloudDeviceOSType'), TargetResourceName, ''), IPCustomEntity = InitiatedByIpAddress
```


### Azure rare subscription level operations

**Category**: Threat activities

Identify sensitive Azure subscription-level events based on Azure Activity Logs. For example, monitoring based on operation name "Create or Update Snapshot", which is used for creating backups but could be misused by attackers to dump hashes or extract sensitive information from the disk.

```kql
let starttime = 14d;
let endtime = 1d;
// The number of operations above which an IP address is considered an unusual source of role assignment operations
let alertOperationThreshold = 5;
// Add or remove operation names below as per your requirements. For operations lists, please refer to https://learn.microsoft.com/en-us/Azure/role-based-access-control/resource-provider-operations#all
let SensitiveOperationList = dynamic(["microsoft.compute/snapshots/write", "microsoft.network/networksecuritygroups/write", "microsoft.storage/storageaccounts/listkeys/action"]);
let SensitiveActivity = AzureActivity
| where OperationNameValue in~ (SensitiveOperationList) or OperationNameValue hassuffix "listkeys/action"
| where ActivityStatusValue =~ "Success";
SensitiveActivity
| where TimeGenerated between (ago(starttime) .. ago(endtime))
| summarize count() by CallerIpAddress, Caller, OperationNameValue, bin(TimeGenerated, 1d)
| where count_ >= alertOperationThreshold
// Returns all the records from the right side that don't have matches from the left
| join kind=rightanti (
    SensitiveActivity
    | where TimeGenerated >= ago(endtime)
    | summarize StartTimeUtc = min(TimeGenerated), EndTimeUtc = max(TimeGenerated), ActivityTimeStamp = make_list(TimeGenerated), ActivityStatusValue = make_list(ActivityStatusValue), CorrelationIds = make_list(CorrelationId), ResourceGroups = make_list(ResourceGroup), SubscriptionIds = make_list(SubscriptionId), ActivityCountByCallerIPAddress = count() by CallerIpAddress, Caller, OperationNameValue
    | where ActivityCountByCallerIPAddress >= alertOperationThreshold
) on CallerIpAddress, Caller, OperationNameValue
| extend Name = tostring(split(Caller, '@', 0)[0]), UPNSuffix = tostring(split(Caller, '@', 1)[0])
```


### Daily activity trend by app in AuditLogs

**Category**: Baselines 

From the last 14 days, identify any "Consent to application" operation occurs by a user or app. This could indicate that permissions to access the listed AzureApp was provided to a malicious actor. Consent to application, add service principal and add Auth2PermissionGrant events should be rare. If available, extra context is added from the AuditLogs based on CorrleationId from the same account that performed "Consent to application".

```kql
let starttime = todatetime('{{StartTimeISO}}');
let endtime = todatetime('{{EndTimeISO}}');
let auditLookback = starttime - 14d;
// Setting threshold to 3 as a default, change as needed. Any operation that has been initiated by a user or app more than 3 times in the past 30 days will be exluded
let threshold = 3;
// Helper function to extract relevant fields from AuditLog events
let auditLogEvents = (startTimeSpan:datetime) {
    AuditLogs
    | where TimeGenerated >= startTimeSpan
    | extend ModProps = TargetResources[0].modifiedProperties
    | extend IpAddress = iff(isnotempty(tostring(parse_json(tostring(InitiatedBy.user)).ipAddress)),
        tostring(parse_json(tostring(InitiatedBy.user)).ipAddress),
        tostring(parse_json(tostring(InitiatedBy.app)).ipAddress)
    )
    | extend InitiatedBy = iff(isnotempty(tostring(parse_json(tostring(InitiatedBy.user)).userPrincipalName)),
        tostring(parse_json(tostring(InitiatedBy.user)).userPrincipalName),
        tostring(parse_json(tostring(InitiatedBy.app)).displayName)
    )
    | extend TargetResourceName = tolower(tostring(TargetResources[0].displayName))
    | mv-expand ModProps
    | extend PropertyName = tostring(ModProps.displayName), newValue = replace('"', "", tostring(ModProps.newValue))
};
// Get just the InitiatedBy and CorrleationId so we can look at associated audit activity
// 2 other operations that can be part of malicious activity in this situation are
// "Add OAuth2PermissionGrant" and "Add service principal", replace the below if you are interested in those as starting points for OperationName
let HistoricalConsent = auditLogEvents(auditLookback)
| where OperationName == "Consent to application"
| summarize StartTimeUtc = min(TimeGenerated), EndTimeUtc = max(TimeGenerated), OperationCount = count()
    by InitiatedBy, IpAddress, TargetResourceName, Category, OperationName, PropertyName, newValue, CorrelationId, Id
// Remove comment below to only include operations initiated by a user or app that is above the threshold for the last 30 days
//| where OperationCount > threshold
;
let Correlate = HistoricalConsent
| summarize by InitiatedBy, CorrelationId;
// 2 other operations that can be part of malicious activity in this situation are
// "Add OAuth2PermissionGrant" and "Add service principal", replace the below if you changed the starting OperationName above
let allOtherEvents = auditLogEvents(auditLookback)
| where OperationName != "Consent to application";
// Gather associated activity based on audit activity for "Consent to application" and InitiatedBy and CorrleationId
let CorrelatedEvents = Correlate
| join (allOtherEvents) on InitiatedBy, CorrelationId
| summarize StartTimeUtc = min(TimeGenerated), EndTimeUtc = max(TimeGenerated)
    by InitiatedBy, IpAddress, TargetResourceName, Category, OperationName, PropertyName, newValue, CorrelationId, Id
;
// Union the results
let Results = (union isfuzzy=true HistoricalConsent, CorrelatedEvents);
// newValues that are simple semi-colon separated, make those dynamic for easy viewing and Aggregate into the PropertyUpdate set based on CorrelationId and Id(DirectoryId)
Results
| extend newValue = split(newValue, ";")
| extend PropertyUpdate = pack(PropertyName, newValue, "Id", Id)
// Extract scope requested
| extend perms = tostring(parse_json(tostring(PropertyUpdate.["ConsentAction.Permissions"]))[0])
| extend scope = extract('Scope:\\s*([^,\\]]*)', 1, perms)
// Filter out some common openid, and low privilege request scopes - uncomment line below to filter out where no scope is requested
//| where isnotempty(scope)
| where scope !contains 'openid' and scope !in ('user_impersonation', 'User.Read')
| summarize StartTime = min(StartTimeUtc), EndTime = max(EndTimeUtc), PropertyUpdateSet = make_bag(PropertyUpdate), make_set(scope)
    by InitiatedBy, IpAddress, TargetResourceName, OperationName, CorrelationId
| extend timestamp = StartTime, AccountCustomEntity = InitiatedBy, IPCustomEntity = IpAddress
// uncommnet below to summarize by app if many results
//| summarize make_set(InitiatedBy), make_set(IpAddress), make_set(PropertyUpdateSet) by TargetResourceName, tostring(set_scope)
```


### Daily location trend per user or app in SignInLogs

**Category**: Baseline

Build daily trends for all user sign-ins, locations count, and their app usage.

```kql
SigninLogs
| where TimeGenerated > ago(1d)
| extend locationString = strcat(tostring(LocationDetails["countryOrRegion"]), "/", tostring(LocationDetails["state"]), "/", tostring(LocationDetails["city"]), ";")
| extend Day = format_datetime(TimeGenerated, "yyyy-MM-dd")
| summarize LocationList = make_set(locationString), LocationCount = dcount(locationString), DistinctSourceIp = dcount(IPAddress), LogonCount = count() by Day, AppDisplayName, UserPrincipalName
```


### Daily network traffic trend per destination IP

**Category**: Baseline

Create a baseline including bytes and distinct peers to detect beaconing and exfiltration.

```kql
// Daily Network traffic trend Per destination IP along with data transfer stats
CommonSecurityLog
| where TimeGenerated > ago(1d)
| extend Day = format_datetime(TimeGenerated, "yyyy-MM-dd")
| summarize Count = count(), DistinctDestinationIps = dcount(DestinationIP), NoofByesTransferred = sum(SentBytes), NoofBytesReceived = sum(ReceivedBytes) by Day, SourceIP, DeviceVendor
```

### Daily network traffic trend per destination IP with data transfer stats

**Category**: Threat activities

Identify internal host that reached out outbound destination, including volume trends, estimating blast radius.

```kql
// Daily Network traffic trend Per Destination IP along with Data transfer stats
// Frequency - Daily - Maintain 30 days or more history.
CommonSecurityLog
| where TimeGenerated > ago(1d)
| extend Day = format_datetime(TimeGenerated, "yyyy-MM-dd")
| summarize Count = count(), DistinctDestinationIps = dcount(DestinationIP), NoofByesTransferred = sum(SentBytes), NoofBytesReceived = sum(ReceivedBytes) by Day, SourceIP, DeviceVendor
```


### Daily network traffic trend per source IP

**Category**: Baseline

Create a baseline including bytes and distinct peers to detect beaconing and exfiltration.

```kql
// Daily Network traffic trend Per source IP along with data transfer stats
CommonSecurityLog
| where TimeGenerated > ago(1d)
| extend Day = format_datetime(TimeGenerated, "yyyy-MM-dd")
| summarize Count = count(), DistinctSourceIps = dcount(SourceIP), NoofByesTransferred = sum(SentBytes), NoofBytesReceived = sum(ReceivedBytes) by Day, DestinationIP, DeviceVendor
```


### Daily network traffic trend per source IP with data transfer stats

**Category**: Threat activities

Today's connections and bytes are evaluated against the host's day-over-day baseline to determine whether the observed behaviors deviate significantly from established pattern.

```kql
// Daily Network traffic trend Per Destination IP along with Data transfer stats
// Frequency - Daily - Maintain 30 days or more history.
CommonSecurityLog
| where TimeGenerated > ago(1d)
| extend Day = format_datetime(TimeGenerated, "yyyy-MM-dd")
| summarize Count = count(), DistinctDestinationIps = dcount(DestinationIP), NoofByesTransferred = sum(SentBytes), NoofBytesReceived = sum(ReceivedBytes) by Day, SourceIP, DeviceVendor
```


### Daily sign-in location trend per user and app

**Category**: Baseline

Create a sign-in baseline for each user or application with typical geographic and IP, enabling efficient and cost-effective anomaly detection at scale.

```kql
// Daily Location Trend per User, App in SigninLogs
// Frequency - Daily - Maintain 30 days or more history.
SigninLogs
| where TimeGenerated > ago(1d)
| extend locationString = strcat(tostring(LocationDetails["countryOrRegion"]), "/", tostring(LocationDetails["state"]), "/", tostring(LocationDetails["city"]), ";")
| extend Day = format_datetime(TimeGenerated, "yyyy-MM-dd")
| summarize LocationList = make_set(locationString), LocationCount = dcount(locationString), DistinctSourceIp = dcount(IPAddress), LogonCount = count() by Day, AppDisplayName, UserPrincipalName
```


### Daily process execution trend

**Category**: Baseline

Identify new processes and prevalence, making "new rare process" detections easier.

```kql
// Daily ProcessExecution Trend in SecurityEvents
// Frequency - Daily - Maintain 30 days or more history.
SecurityEvent
| where TimeGenerated > ago(1d)
| where EventID == 4688
| extend Day = format_datetime(TimeGenerated, "yyyy-MM-dd")
| summarize Count = count(), DistinctComputers = dcount(Computer), DistinctAccounts = dcount(Account), DistinctParent = dcount(ParentProcessName), NoofCommandLines = dcount(CommandLine) by Day, NewProcessName
```


### Entra ID rare user agent per app

**Category**: Anomaly detection

Establish a baseline of the type of UserAgent (that is, browser, office application, etc.) that is typically used for a particular application by looking back for a number of days. It then searches the current day for any deviations from this pattern, that is, types of UserAgents not seen before in combination with this application.

```kql
let minimumAppThreshold = 100;
let timeframe = 1d;
let lookback_timeframe = 7d;
let ExtractBrowserTypeFromUA = (ua:string) {
    // Note: these are in a specific order since, for example, Edge contains "Chrome/" and "Edge/" strings.
    case(
        ua has "Edge/", dynamic({"AgentType": "Browser", "AgentName": "Edge"}),
        ua has "Edg/", dynamic({"AgentType": "Browser", "AgentName": "Edge"}),
        ua has "Trident/", dynamic({"AgentType": "Browser", "AgentName": "Internet Explorer"}),
        ua has "Chrome/" and ua has "Safari/", dynamic({"AgentType": "Browser", "AgentName": "Chrome"}),
        ua has "Gecko/" and ua has "Firefox/", dynamic({"AgentType": "Browser", "AgentName": "Firefox"}),
        not(ua has "Mobile/") and ua has "Safari/" and ua has "Version/", dynamic({"AgentType": "Browser", "AgentName": "Safari"}),
        ua startswith "Dalvik/" and ua has "Android", dynamic({"AgentType": "Browser", "AgentName": "Android Browser"}),
        ua startswith "MobileSafari//", dynamic({"AgentType": "Browser", "AgentName": "Mobile Safari"}),
        ua has "Mobile/" and ua has "Safari/" and ua has "Version/", dynamic({"AgentType": "Browser", "AgentName": "Mobile Safari"}),
        ua has "Mobile/" and ua has "FxiOS/", dynamic({"AgentType": "Browser", "AgentName": "IOS Firefox"}),
        ua has "Mobile/" and ua has "CriOS/", dynamic({"AgentType": "Browser", "AgentName": "IOS Chrome"}),
        ua has "Mobile/" and ua has "WebKit/", dynamic({"AgentType": "Browser", "AgentName": "Mobile Webkit"}),
        //
        ua startswith "Excel/", dynamic({"AgentType": "OfficeApp", "AgentName": "Excel"}),
        ua startswith "Outlook/", dynamic({"AgentType": "OfficeApp", "AgentName": "Outlook"}),
        ua startswith "OneDrive/", dynamic({"AgentType": "OfficeApp", "AgentName": "OneDrive"}),
        ua startswith "OneNote/", dynamic({"AgentType": "OfficeApp", "AgentName": "OneNote"}),
        ua startswith "Office/", dynamic({"AgentType": "OfficeApp", "AgentName": "Office"}),
        ua startswith "PowerPoint/", dynamic({"AgentType": "OfficeApp", "AgentName": "PowerPoint"}),
        ua startswith "PowerApps/", dynamic({"AgentType": "OfficeApp", "AgentName": "PowerApps"}),
        ua startswith "SharePoint/", dynamic({"AgentType": "OfficeApp", "AgentName": "SharePoint"}),
        ua startswith "Word/", dynamic({"AgentType": "OfficeApp", "AgentName": "Word"}),
        ua startswith "Visio/", dynamic({"AgentType": "OfficeApp", "AgentName": "Visio"}),
        ua startswith "Whiteboard/", dynamic({"AgentType": "OfficeApp", "AgentName": "Whiteboard"}),
        ua =~ "Mozilla/5.0 (compatible; MSAL 1.0)", dynamic({"AgentType": "OfficeApp", "AgentName": "Office Telemetry"}),
        //
        ua has ".NET CLR", dynamic({"AgentType": "Custom", "AgentName": "Dotnet"}),
        ua startswith "Java/", dynamic({"AgentType": "Custom", "AgentName": "Java"}),
        ua startswith "okhttp/", dynamic({"AgentType": "Custom", "AgentName": "okhttp"}),
        ua has "Drupal/", dynamic({"AgentType": "Custom", "AgentName": "Drupal"}),
        ua has "PHP/", dynamic({"AgentType": "Custom", "AgentName": "PHP"}),
        ua startswith "curl/", dynamic({"AgentType": "Custom", "AgentName": "curl"}),
        ua has "python-requests", dynamic({"AgentType": "Custom", "AgentName": "Python"}),
        pack("AgentType", "Other", "AgentName", extract(@"^([^/]*)/", 1, ua))
    )
};
// Query to obtain 'simplified' user agents in a given timespan.
let QueryUserAgents = (start_time:timespan, end_time:timespan) {
    union withsource=tbl_name AADNonInteractiveUserSignInLogs, SigninLogs
    | where TimeGenerated >= ago(start_time)
    | where TimeGenerated < ago(end_time)
    | where ResultType == 0 // Only look at succesful logins
    | extend ParsedUserAgent = ExtractBrowserTypeFromUA(UserAgent)
    | extend UserAgentType = tostring(ParsedUserAgent.AgentType)
    | extend UserAgentName = tostring(ParsedUserAgent.AgentName)
    //| extend SimpleUserAgent=strcat(UserAgentType,"_",UserAgentName)
    | extend SimpleUserAgent = UserAgentType
    | where not(isempty(UserAgent))
    | where not(isempty(AppId))
};
// Get baseline usage per application.
let BaselineUserAgents = materialize(
    QueryUserAgents(lookback_timeframe + timeframe, timeframe)
    | summarize RequestCount = count() by AppId, AppDisplayName, SimpleUserAgent
);
let BaselineSummarizedAgents = (
    BaselineUserAgents
    | summarize BaselineUAs = make_set(SimpleUserAgent), BaselineRequestCount = sum(RequestCount) by AppId, AppDisplayName
);
QueryUserAgents(timeframe, 0d)
| summarize count() by AppId, AppDisplayName, UserAgent, SimpleUserAgent
| join kind=leftanti BaselineUserAgents on AppId, AppDisplayName, SimpleUserAgent
| join BaselineSummarizedAgents on AppId, AppDisplayName
| where BaselineRequestCount > minimumAppThreshold // Search only for actively used applications.
// Get back full original requests.
| join (QueryUserAgents(timeframe, 0d)) on AppId, UserAgent
| project-away ParsedUserAgent, UserAgentName
| project-reorder TimeGenerated, AppDisplayName, UserPrincipalName, UserAgent, BaselineUAs
// Begin allow-list.
// End allow-list.
| summarize count() by UserPrincipalName, AppDisplayName, AppId, UserAgentType, SimpleUserAgent, UserAgent
```


### Network log IOC matching

**Category**: Threat activities

Identify any IP indicators of compromise (IOCs) from threat intelligence (TI), by searching for matches in CommonSecurityLog.

```kql
let IPRegex = '[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}';
let dt_lookBack = 1h; // Look back 1 hour for CommonSecurityLog events
let ioc_lookBack = 14d; // Look back 14 days for threat intelligence indicators
// Fetch threat intelligence indicators related to IP addresses
let IP_Indicators = ThreatIntelIndicators
//extract key part of kv pair
| extend IndicatorType = replace(@"\[|\]|\""", "", tostring(split(ObservableKey, ":", 0)))
| where IndicatorType in ("ipv4-addr", "ipv6-addr", "network-traffic")
| extend NetworkSourceIP = toupper(ObservableValue)
| extend TrafficLightProtocolLevel = tostring(parse_json(AdditionalFields).TLPLevel)
| where TimeGenerated >= ago(ioc_lookBack)
| extend TI_ipEntity = iff(isnotempty(NetworkSourceIP), NetworkSourceIP, NetworkSourceIP)
| extend TI_ipEntity = iff(isempty(TI_ipEntity) and isnotempty(NetworkSourceIP), NetworkSourceIP, TI_ipEntity)
| where ipv4_is_private(TI_ipEntity) == false and TI_ipEntity !startswith "fe80" and TI_ipEntity !startswith "::" and TI_ipEntity !startswith "127."
| summarize LatestIndicatorTime = arg_max(TimeGenerated, *) by Id, ObservableValue
| where IsActive and (ValidUntil > now() or isempty(ValidUntil));
// Perform a join between IP indicators and CommonSecurityLog events
IP_Indicators
| project-reorder *, Tags, TrafficLightProtocolLevel, NetworkSourceIP, TI_ipEntity
// Use innerunique to keep performance fast and result set low, as we only need one match to indicate potential malicious activity that needs investigation
| join kind=innerunique (
    CommonSecurityLog
    | where TimeGenerated >= ago(dt_lookBack)
    | extend MessageIP = extract(IPRegex, 0, Message)
    | extend CS_ipEntity = iff((not(ipv4_is_private(SourceIP)) and isnotempty(SourceIP)), SourceIP, DestinationIP)
    | extend CS_ipEntity = iff(isempty(CS_ipEntity) and isnotempty(MessageIP), MessageIP, CS_ipEntity)
    | extend CommonSecurityLog_TimeGenerated = TimeGenerated
)
on $left.TI_ipEntity == $right.CS_ipEntity
// Filter out logs that occurred after the expiration of the corresponding indicator
| where CommonSecurityLog_TimeGenerated < ValidUntil
// Group the results by IndicatorId and CS_ipEntity, and keep the log entry with the latest timestamp
| summarize CommonSecurityLog_TimeGenerated = arg_max(CommonSecurityLog_TimeGenerated, *) by Id, CS_ipEntity
// Select the desired output fields
| project timestamp = CommonSecurityLog_TimeGenerated, SourceIP, DestinationIP, MessageIP, Message, DeviceVendor, DeviceProduct, Id, ValidUntil, Confidence, TI_ipEntity, CS_ipEntity, LogSeverity, DeviceAction
```


### New processes observed in last 24 hours

**Category**: Threat activities

New processes in stable environments may indicate malicious activity. Analyzing sign-in sessions where these binaries ran can help identify attacks.

```kql
let starttime = todatetime('{{StartTimeISO}}');
let endtime = todatetime('{{EndTimeISO}}');
let lookback = starttime - 14d;
let ProcessCreationEvents = () {
    SecurityEvent
    | where TimeGenerated between(lookback..endtime)
    | where EventID == 4688
    | project
        TimeGenerated,
        Computer,
        Account,
        FileName = tostring(split(NewProcessName, '\\')[-1]),
        NewProcessName,
        ProcessCommandLine = CommandLine,
        InitiatingProcessFileName = ParentProcessName
};
ProcessCreationEvents()
| where TimeGenerated between(lookback..starttime)
| summarize HostCount = dcount(Computer) by FileName
| join kind=rightanti (
    ProcessCreationEvents()
    | where TimeGenerated between(starttime..endtime)
    | summarize
        StartTime = min(TimeGenerated),
        EndTime = max(TimeGenerated),
        Computers = make_set(Computer, 1000),
        HostCount = dcount(Computer)
        by Account, NewProcessName, FileName, ProcessCommandLine, InitiatingProcessFileName
) on FileName
| extend timestamp = StartTime
| extend NTDomain = tostring(split(Account, '\\', 0)[0]), Name = tostring(split(Account, '\\', 1)[0])
| extend Account_0_Name = Name
| extend Account_0_NTDomain = NTDomain
```


### SharePoint file operation via previously unseen IPs

**Category**: Threat activities

Identify anomalies using user behavior by setting a threshold for significant changes in file upload/download activities from new IP addresses. It establishes a baseline of typical behavior, compares it to recent activity, and flags deviations exceeding a default threshold of 25.

```kql
// Define a threshold for significant deviations
let threshold = 25;
// Define the name for the SharePoint File Operation record type
let szSharePointFileOperation = "SharePointFileOperation";
// Define an array of SharePoint operations of interest
let szOperations = dynamic(["FileDownloaded", "FileUploaded"]);
// Define the start and end time for the analysis period
let starttime = 14d;
let endtime = 1d;
// Define a baseline of normal user behavior
let userBaseline = OfficeActivity
| where TimeGenerated between(ago(starttime) .. ago(endtime))
| where RecordType =~ szSharePointFileOperation
| where Operation in~ (szOperations)
| where isnotempty(UserAgent)
| summarize Count = count() by UserId, Operation, Site_Url, ClientIP
| summarize AvgCount = avg(Count) by UserId, Operation, Site_Url, ClientIP;
// Get recent user activity
let recentUserActivity = OfficeActivity
| where TimeGenerated > ago(endtime)
| where RecordType =~ szSharePointFileOperation
| where Operation in~ (szOperations)
| where isnotempty(UserAgent)
| summarize StartTimeUtc = min(TimeGenerated), EndTimeUtc = max(TimeGenerated), RecentCount = count() by UserId, UserType, Operation, Site_Url, ClientIP, OfficeObjectId, OfficeWorkload, UserAgent;
// Join the baseline and recent activity, and calculate the deviation
let UserBehaviorAnalysis = userBaseline
| join kind=inner (recentUserActivity) on UserId, Operation, Site_Url, ClientIP
| extend Deviation = abs(RecentCount - AvgCount) / AvgCount;
// Filter for significant deviations
UserBehaviorAnalysis
| where Deviation > threshold
| project StartTimeUtc, EndTimeUtc, UserId, UserType, Operation, ClientIP, Site_Url, OfficeObjectId, OfficeWorkload, UserAgent, Deviation, Count = RecentCount
| order by Count desc, ClientIP asc, Operation asc, UserId asc
| extend AccountName = tostring(split(UserId, "@")[0]), AccountUPNSuffix = tostring(split(UserId, "@")[1])
```


### Palo Alto potential network beaconing

**Category**: Threat activities

Identify beaconing patterns from Palo Alto Network traffic logs based on recurrent time delta patterns. The query uses various KQL functions to calculate time deltas and then compares it with total events observed in a day to find percentage of beaconing.

```kql
let starttime = 2d;
let endtime = 1d;
let TimeDeltaThreshold = 25;
let TotalEventsThreshold = 30;
let MostFrequentTimeDeltaThreshold = 25;
let PercentBeaconThreshold = 80;
CommonSecurityLog
| where DeviceVendor == "Palo Alto Networks" and Activity == "TRAFFIC"
| where TimeGenerated between (startofday(ago(starttime)) .. startofday(ago(endtime)))
| where ipv4_is_private(DestinationIP) == false
| project TimeGenerated, DeviceName, SourceUserID, SourceIP, SourcePort, DestinationIP, DestinationPort, ReceivedBytes, SentBytes
| sort by SourceIP asc, TimeGenerated asc, DestinationIP asc, DestinationPort asc
| serialize
| extend nextTimeGenerated = next(TimeGenerated, 1), nextSourceIP = next(SourceIP, 1)
| extend TimeDeltainSeconds = datetime_diff('second', nextTimeGenerated, TimeGenerated)
| where SourceIP == nextSourceIP
//Allowlisting criteria/ threshold criteria
| where TimeDeltainSeconds > TimeDeltaThreshold
| summarize count(), sum(ReceivedBytes), sum(SentBytes) by TimeDeltainSeconds, bin(TimeGenerated, 1h), DeviceName, SourceUserID, SourceIP, DestinationIP, DestinationPort
| summarize (MostFrequentTimeDeltaCount, MostFrequentTimeDeltainSeconds) = arg_max(count_, TimeDeltainSeconds), TotalEvents = sum(count_), TotalSentBytes = sum(sum_SentBytes), TotalReceivedBytes = sum(sum_ReceivedBytes) by bin(TimeGenerated, 1h), DeviceName, SourceUserID, SourceIP, DestinationIP, DestinationPort
| where TotalEvents > TotalEventsThreshold and MostFrequentTimeDeltaCount > MostFrequentTimeDeltaThreshold
| extend BeaconPercent = MostFrequentTimeDeltaCount / toreal(TotalEvents) * 100
| where BeaconPercent > PercentBeaconThreshold
```

### Windows suspicious login outside normal hours

**Category**: Anomaly detection

Identify unusual Windows sign-in events outside a user's normal hours by comparing with the last 14 days' sign-in activity, flagging anomalies based on historical patterns.

```kql
let starttime = todatetime('{{StartTimeISO}}');
let endtime = todatetime('{{EndTimeISO}}');
let lookback = starttime - 14d;
let AllLogonEvents = materialize(
    SecurityEvent
    | where TimeGenerated between (lookback..starttime)
    | where EventID in (4624, 4625)
    | where LogonTypeName in~ ('2 - Interactive', '10 - RemoteInteractive')
    | where AccountType =~ 'User'
    | extend HourOfLogin = hourofday(TimeGenerated), DayNumberofWeek = dayofweek(TimeGenerated)
    | extend DayofWeek = case(
        DayNumberofWeek == "00:00:00", "Sunday",
        DayNumberofWeek == "1.00:00:00", "Monday",
        DayNumberofWeek == "2.00:00:00", "Tuesday",
        DayNumberofWeek == "3.00:00:00", "Wednesday",
        DayNumberofWeek == "4.00:00:00", "Thursday",
        DayNumberofWeek == "5.00:00:00", "Friday",
        DayNumberofWeek == "6.00:00:00", "Saturday", "InvalidTimeStamp"
    )
    // map the most common ntstatus codes
    | extend StatusDesc = case(
        Status =~ "0x80090302", "SEC_E_UNSUPPORTED_FUNCTION",
        Status =~ "0x80090308", "SEC_E_INVALID_TOKEN",
        Status =~ "0x8009030E", "SEC_E_NO_CREDENTIALS",
        Status =~ "0xC0000008", "STATUS_INVALID_HANDLE",
        Status =~ "0xC0000017", "STATUS_NO_MEMORY",
        Status =~ "0xC0000022", "STATUS_ACCESS_DENIED",
        Status =~ "0xC0000034", "STATUS_OBJECT_NAME_NOT_FOUND",
        Status =~ "0xC000005E", "STATUS_NO_LOGON_SERVERS",
        Status =~ "0xC000006A", "STATUS_WRONG_PASSWORD",
        Status =~ "0xC000006D", "STATUS_LOGON_FAILURE",
        Status =~ "0xC000006E", "STATUS_ACCOUNT_RESTRICTION",
        Status =~ "0xC0000073", "STATUS_NONE_MAPPED",
        Status =~ "0xC00000FE", "STATUS_NO_SUCH_PACKAGE",
        Status =~ "0xC000009A", "STATUS_INSUFFICIENT_RESOURCES",
        Status =~ "0xC00000DC", "STATUS_INVALID_SERVER_STATE",
        Status =~ "0xC0000106", "STATUS_NAME_TOO_LONG",
        Status =~ "0xC000010B", "STATUS_INVALID_LOGON_TYPE",
        Status =~ "0xC000015B", "STATUS_LOGON_TYPE_NOT_GRANTED",
        Status =~ "0xC000018B", "STATUS_NO_TRUST_SAM_ACCOUNT",
        Status =~ "0xC0000224", "STATUS_PASSWORD_MUST_CHANGE",
        Status =~ "0xC0000234", "STATUS_ACCOUNT_LOCKED_OUT",
        Status =~ "0xC00002EE", "STATUS_UNFINISHED_CONTEXT_DELETED",
        EventID == 4624, "Success",
        "See - https://docs.microsoft.com/openspecs/windows_protocols/ms-erref/596a1078-e883-4972-9bbc-49e60bebca55"
    )
    | extend SubStatusDesc = case(
        SubStatus =~ "0x80090325", "SEC_E_UNTRUSTED_ROOT",
        SubStatus =~ "0xC0000008", "STATUS_INVALID_HANDLE",
        SubStatus =~ "0xC0000022", "STATUS_ACCESS_DENIED",
        SubStatus =~ "0xC0000064", "STATUS_NO_SUCH_USER",
        SubStatus =~ "0xC000006A", "STATUS_WRONG_PASSWORD",
        SubStatus =~ "0xC000006D", "STATUS_LOGON_FAILURE",
        SubStatus =~ "0xC000006E", "STATUS_ACCOUNT_RESTRICTION",
        SubStatus =~ "0xC000006F", "STATUS_INVALID_LOGON_HOURS",
        SubStatus =~ "0xC0000070", "STATUS_INVALID_WORKSTATION",
        SubStatus =~ "0xC0000071", "STATUS_PASSWORD_EXPIRED",
        SubStatus =~ "0xC0000072", "STATUS_ACCOUNT_DISABLED",
        SubStatus =~ "0xC0000073", "STATUS_NONE_MAPPED",
        SubStatus =~ "0xC00000DC", "STATUS_INVALID_SERVER_STATE",
        SubStatus =~ "0xC0000133", "STATUS_TIME_DIFFERENCE_AT_DC",
        SubStatus =~ "0xC000018D", "STATUS_TRUSTED_RELATIONSHIP_FAILURE",
        SubStatus =~ "0xC0000193", "STATUS_ACCOUNT_EXPIRED",
        SubStatus =~ "0xC0000380", "STATUS_SMARTCARD_WRONG_PIN",
        SubStatus =~ "0xC0000381", "STATUS_SMARTCARD_CARD_BLOCKED",
        SubStatus =~ "0xC0000382", "STATUS_SMARTCARD_CARD_NOT_AUTHENTICATED",
        SubStatus =~ "0xC0000383", "STATUS_SMARTCARD_NO_CARD",
        SubStatus =~ "0xC0000384", "STATUS_SMARTCARD_NO_KEY_CONTAINER",
        SubStatus =~ "0xC0000385", "STATUS_SMARTCARD_NO_CERTIFICATE",
        SubStatus =~ "0xC0000386", "STATUS_SMARTCARD_NO_KEYSET",
        SubStatus =~ "0xC0000387", "STATUS_SMARTCARD_IO_ERROR",
        SubStatus =~ "0xC0000388", "STATUS_DOWNGRADE_DETECTED",
        SubStatus =~ "0xC0000389", "STATUS_SMARTCARD_CERT_REVOKED",
        EventID == 4624, "Success",
        "See - https://docs.microsoft.com/openspecs/windows_protocols/ms-erref/596a1078-e883-4972-9bbc-49e60bebca55"
    )
    | project StartTime = TimeGenerated, DayofWeek, HourOfLogin, EventID, Activity, IpAddress, WorkstationName, Computer, TargetUserName, TargetDomainName, ProcessName, SubjectUserName, PrivilegeList, LogonTypeName, StatusDesc, SubStatusDesc
);
AllLogonEvents
| where TargetDomainName !in ("Window Manager", "Font Driver Host")
| summarize max(HourOfLogin), min(HourOfLogin), historical_DayofWeek = make_set(DayofWeek, 10) by TargetUserName
| join kind=inner (
    AllLogonEvents
    | where StartTime between(starttime..endtime)
) on TargetUserName
// Filtering for logon events based on range of max and min of historical logon hour values seen
| where HourOfLogin > max_HourOfLogin or HourOfLogin < min_HourOfLogin
// Also populating additional column showing historical days of week when logon was seen
| extend historical_DayofWeek = tostring(historical_DayofWeek)
| summarize Total = count(), max(HourOfLogin), min(HourOfLogin), current_DayofWeek = make_set(DayofWeek, 10), StartTime = max(StartTime), EndTime = min(StartTime), SourceIP = make_set(IpAddress, 10000), SourceHost = make_set(WorkstationName, 10000), SubjectUserName = make_set(SubjectUserName, 10000), HostLoggedOn = make_set(Computer, 10000) by EventID, Activity, TargetDomainName, TargetUserName, ProcessName, LogonTypeName, StatusDesc, SubStatusDesc, historical_DayofWeek
| extend historical_DayofWeek = todynamic(historical_DayofWeek)
| extend timestamp = StartTime, NTDomain = split(TargetUserName, '\\', 0)[0], Name = split(TargetUserName, '\\', 1)[0]
| extend Account_0_NTDomain = NTDomain
| extend Account_0_Name = Name
```


## Additional sample queries

The following sample queries can be used to explore and analyze data in the Microsoft Sentinel data lake.


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

