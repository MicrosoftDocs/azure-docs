---
title: Triage tool collection in Microsoft Sentinel MCP server
titleSuffix: Microsoft Security  
description: Learn about the different tools available in the triage collection
author: poliveria
ms.topic: how-to
ms.date: 12/01/2025
ms.author: pauloliveria
ms.service: microsoft-sentinel

#customer intent: As a security analyst, I want to know the different tools available to triage incidents and hunt for threats 
---

# Prioritize incidents and hunt for threats with triage collection (preview)

> [!IMPORTANT]
> This information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, expressed or implied, with respect to the information provided here.

The triage collection in the Microsoft Sentinel Model Context Protocol (MCP) server integrates your AI models with APIs that support incident triage and hunting. This integration lets you prioritize incidents quickly and hunt over your own data easily, reducing mean time to resolution, risk exposure, and dwell time.

Use the tool for the following scenarios:
- **Incident triage:** Prioritize incidents quickly by using your own AI models, reducing mean time to resolution. Use the tools to fetch incidents, alerts, alerts evidence, entities, and other data.
- **Hunting:** Hunt over your data easily by using your own AI models, reducing risk exposure and dwell time. Use the tools to run hunting queries and fetch the required data during your hunt.


## Prerequisites

To access the triage tool collection, you must have the following prerequisites:
- Microsoft Defender XDR, Microsoft Defender for Endpoint, or Microsoft Sentinel onboarded to the Defender portal
- Any of the supported AI-powered code editors and agent-building platforms:
    - [Visual Studio Code](sentinel-mcp-use-tool-visual-studio-code.md) 

## Add the triage collection

To add the data exploration collection, you must first set up add Microsoft Sentinel's unified MCP server interface. Follow the step-by-step instructions for compatible AI-powered code editors and agent-building platforms listed in the **Prerequisites** section.

The triage collection is hosted at the following URL:

```
https://sentinel.microsoft.com/mcp/triage
```

## Tools in the triage collection

### List security incidents (`ListIncidents`)

This tool lists security incidents and filters them by date range, severity, status, assigned analyst, and investigation state. 

| Parameters | Required? | Description |
|---|---|---|
| `createdAfter` | No|Time after which the incident was created |
| `createdBefore` | No|Time before the incident was created |
| `Severity` |No |Severity assigned to the incident (for example, Low or High) |
| `Status` |No | Current status of the incident (New, Active, or Closed)|
| `AssignedTo` |No | To which user the incident is assigned|
| `Classification` |No |Classification (for example, True Positive or False Positive) |
| `Determination` |No | Determination (for example, Malware or Phishing)|
| `orderBy` |No |Instructions to order the incidents returned |
| `Search` |No | Free-text search across the incident data|
| `includeAlertsData` |No | Option to include data from the underlying alerts|
| `skip` |No | Skips a specified number of items from the start of the result set|
| `top` |No | Limits the number of items returned in the response|

### Get a security incident (`GetIncidentById`)

This tool retrieves a security incident by ID, including its properties, correlated alerts, and metadata such as status, severity, classification, and timestamps.

| Parameters | Required? | Description |
|---|---|---|
| `incidentID`|Yes |Identifier is associated with the incident |
| `includeAlertsData` | No|Option to include data from the underlying alerts |

### List security alerts related to an incident (`ListAlerts`)

This tool lists security alerts, sorts them, and filters them by date range, severity, and status. 

| Parameters | Required? | Description |
|---|---|---|
| `createdAfter` | No |Time after which the alert was created |
| `createdBefore` | No |Time before the alert was created |
| `Severity` | No |Severity assigned to the alert (for example, Low or High) |
| `status` | No |Current status of the alert; possible values: Unknown, New, InProgress, and Resolved |
| `skip` |No | Skips a specified number of items from the start of the result set|
| `top` |No | Limits the number of items returned in the response|

### Get a security alert (`GetAlertByID`)

This tool retrieves a security alert by ID. It returns the complete alert details, including severity, status, classification, and related evidence entities.

| Parameters | Required? | Description |
|---|---|---|
| `AlertID`| Yes | Unique identifier of the alert |

### List advanced hunting tables (`FetchAdvancedHuntingTablesOverview`) 
This tool lists the names of available advanced hunting tables and their brief descriptions. It's essential for understanding data sources before writing Kusto Query Language (KQL) queries.

| Parameters | Required? | Description |
|---|---|---|
| `tableNames` | No |Advanced hunting table names |

### Get advanced hunting table schema (`FetchAdvancedHuntingTablesDetailedSchema`) 

This tool retrieves complete column schemas with descriptions for specified advanced hunting tables. The information it provides is crucial for constructing error-free KQL queries. Use this tool before calling `RunAdvancedHuntingQuery`.

| Parameters | Required? | Description |
|---|---|---|
| `tableNames` |Yes |Advanced hunting table names |

### Run hunting query (`RunAdvancedHuntingQuery`)

Run an advanced hunting query by using KQL across supported Microsoft Defender tables to proactively search for threats. To understand data sources, first run `FetchAdvancedHuntingTablesOverview`. For error-free KQL, first run `FetchAdvancedHuntingTablesDetailedSchema`.

| Parameters | Required? | Description |
|---|---|---|
| `kqlQuery` |Yes |KQL query to run over the selected table |
| `timestamp` |No |Timestamp to choose for the query |

### Get file information (`GetDefenderFileInfo`) 

Get file details such as hashes, size, type, publisher, signer certificate info, and global prevalence with first and last seen timestamps.

| Parameters | Required? | Description |
|---|---|---|
| `fileHash` |Yes |SHA-1, SHA-256, or MD5 hash of the file  |

### Get file statistics (`GetDefenderFileStatistics`)  

Get organizational file prevalence statistics, including the number of devices where the file was observed.

| Parameters | Required? | Description |
|---|---|---|
| `fileHash` |Yes |SHA-1, SHA-256, or MD5 hash of the file  |

### Get file alerts (`GetDefenderFileAlerts`)  

List all security alerts generated by a specific file across your organization, including historical and active alerts.

| Parameters | Required? | Description |
|---|---|---|
| `fileHash` |Yes |SHA-1, SHA-256, or MD5 hash of the file  |

### Get file-related devices (`GetDefenderFileRelatedMachines`)   

List all devices that encountered a specific file to assess its spread across your environment.

| Parameters | Required? | Description |
|---|---|---|
| `fileHash` |Yes |SHA-1, SHA-256, or MD5 hash of the file  |

### List threat indicators (`ListDefenderIndicators`)   
 
List tenant indicators of compromise (IOCs) in Microsoft Defender for Endpoint. Use filters for type, value, action, and severity.

| Parameters | Required? | Description |
|---|---|---|
| `indicatorType` |No |Indicator type (for example, file hash, domain name, or IP address) |
| `indicatorValue` |No |Specific value of the indicator to filter results |
| `Action` |No |Action applied to the indicator (Alert, Block, or Allow) |
| `ApplicationName` |No |Application associated with the indicator |
| `Title` |No | Title or description of the indicator|
| `Severity` |No | Severity level (Informational, Low, Medium, or High)|
| `createdAfter` |No | Return indicators created after this timestamp |
| `createdBefore` |No |Return indicators created before this timestamp |

### List automated investigations (`ListDefenderInvestigations`)   

List automated investigation cases in Defender for Endpoint. Use filters for state, target device, start time, or triggering alert ID.

| Parameters | Required? | Description |
|---|---|---|
| `startTime`|No |Return investigations started after this timestamp |
| `endTime`|No |Return investigations started before this timestamp |
| `Status`|No |Investigation state (Running, Completed, or Failed) |
| `skip` |No | Skips a specified number of items from the start of the result set|
| `top` |No | Limits the number of items returned in the response|


### Get automated investigation (`GetDefenderInvestigation`)   

Get details of a specific automated investigation, including state, timestamps, target device, and triggering alert.

| Parameters | Required? | Description |
|---|---|---|
| `ID`| Yes|Unique identifier of the investigation |

### Get all security alerts for an IP address (`GetDefenderIpAlerts`)   

List all security alerts in the organization that are related to a specified IP address. 

| Parameters | Required? | Description |
|---|---|---|
| `ipAddress` |Yes |IP address to retrieve related alerts for |

### Get statistics for an IP address (`GetDefenderIpStatistics`)   

Get statistics for a given IP address, including the number of distinct devices that communicated with it.

| Parameters | Required? | Description |
|---|---|---|
| `ipAddress` |Yes | IP address to retrieve statistics for|


### Get endpoint device (`GetDefenderMachine`)   

Get detailed information about a specific Defender for Endpoint device, including operating system details, health status, risk score, and exposure level. 

| Parameters | Required? | Description |
|---|---|---|
| `ID`|Yes | Unique identifier of the device|

### Get security alerts related to a device (`GetDefenderMachineAlerts`)   

List all security alerts associated with a specific device for a device-centric view of threats.

| Parameters | Required? | Description |
|---|---|---|
| `ID`|Yes | Unique identifier of the device|

### Get users that signed into a device (`GetDefenderMachineLoggedOnUsers`)   

List accounts that signed in to a device. For each user, the API provides context such as the account username and domain.

| Parameters | Required? | Description |
|---|---|---|
| `ID`|Yes |Unique identifier of the device |

### Get device vulnerabilities (`GetDefenderMachineVulnerabilities`)   

List discovered security vulnerabilities on a device with Common Vulnerabilities and Exposures (CVE) details and risk assessment scores.

| Parameters | Required? | Description |
|---|---|---|
| `ID`|Yes |Unique identifier of the device |

### Find device by internal IP address (`FindDefenderMachineByIp`)   

List all devices that communicated with a specific internal IP address in the time range of 15 minutes before and after the given timestamp, for network mapping and lateral movement analysis.

| Parameters | Required? | Description |
|---|---|---|
| `ipAddress` |Yes | Internal IP address to search for|
| `timestamp` |Yes | The timestamp that defines the query window, checking 15 minutes before and 15 minutes after the specified time |

### List remediation tasks (`ListDefenderRemediationActivities`)   

List remediation tasks and their execution status across devices. Each remediation activity corresponds to a security recommendation or task.

| Parameters | Required? | Description |
|---|---|---|
| `Type` | No|Type of remediation activity |
| `machineID`|No | Identifier of the affected device |
| `Status` |No |Status of the remediation task (Pending or Completed) |
| `createdTimeFrom` |No |Return tasks created after this timestamp |
| `createdTimeTo` |No |Return tasks created before this timestamp |
| `skip` |No | Skips a specified number of items from the start of the result set|
| `top` |No | Limits the number of items returned in the response|


### Get detailed remediation task information (`GetDefenderRemediationActivity`)   

Get detailed remediation task information, including execution status, results, and affected devices.

| Parameters | Required? | Description |
|---|---|---|
| `ID`|Yes | Unique identifier of the remediation activity|

### List security alerts related to a user account (`ListUserRelatedAlerts`) 

List all security alerts associated with a specific user account. This information is essential for user-centric threat investigations and behavior analysis.

| Parameters | Required? | Description |
|---|---|---|
| `ID`|Yes |Unique identifier of the user account |

### List all devices active for a user (`ListUserRelatedMachines`) 

List all devices where a specific user has active or recent sign-in sessions. Use this tool to track user activity and analyze lateral movement.

| Parameters | Required? | Description |
|---|---|---|
|`ID` |Yes |Unique identifier of the user account |

### List all devices affected by a vulnerability (`ListDefenderMachinesByVulnerability`) 

List all devices affected by a specific CVE vulnerability. This tool is critical for patch management prioritization.

| Parameters | Required? | Description |
|---|---|---|
| `cveID`| Yes| CVE identifier of the vulnerability|

### List vulnerabilities affecting software (`ListDefenderVulnerabilitiesBySoftware`) 

List vulnerabilities that affect specific software on a specific device for targeted vulnerability assessment.

| Parameters | Required? | Description |
|---|---|---|
| `machineID`|Yes | Unique identifier of the device|
| `softwareID`|Yes |Unique identifier of the software |



## Sample prompts

The following sample prompts demonstrate what you can do with the triage collection:

- List the last five incidents from my tenant and assess which one is the most urgent to triage
- Provide the alerts for <specific incident\> and analyze the alert evidence for maliciousness 
- Run a hunting query to check which users interacted with <entity\> 

## Limitations

- You can't use this collection as a guest in another tenant or with delegated access. You can only use the MCP server on your own home tenant.
- Microsoft Sentinel users can't choose which workspace to use.
- You can't query data in Microsoft Sentinel lake. You can use the [data exploration tools](sentinel-mcp-data-exploration-tool.md) instead.


## Related content
- [What is Microsoft Sentinel's support for Model Context Protocol (MCP)?](sentinel-mcp-overview.md) 
- [Get started with Microsoft Sentinel MCP server](sentinel-mcp-get-started.md)