---
title: Create Hunting Queries for Microsoft Sentinel Solutions
description: This article guides you through the process of creating and publishing hunting queries to Microsoft Sentinel solutions.
author: anilgodavarthy
ms.author: angodavarthy
ms.service: microsoft-sentinel
ms.topic: conceptual 
ms.date: 2/06/2025

#CustomerIntent: As an ISV partner, I want to create and publish hunting queries to my Microsoft Sentinel solution so that I can provide inbuilt detection use cases to my customers.
---

# Create and publish hunting queries for Microsoft Sentinel solutions

Hunting queries are at the heart of the threat-hunting process in Microsoft Sentinel. Security analysts use advanced, customizable queries in Kusto Query Language (KQL) to sift through large volumes of data. These queries allow analysts to identify potential security threats, investigate suspicious activities, and gain visibility into their network and endpoints.

Analysts use Microsoft Sentinel to proactively search for threats that bypass existing security defenses. This proactive approach helps analysts uncover hidden threats, patterns, or anomalies within their IT environment. Hypotheses about potential threats or the latest intelligence on emerging attack vectors typically drive the hunting process. For more information, see [Threat hunting in Microsoft Sentinel](/azure/sentinel/hunting).

This article walks you through the process of creating and publishing hunting queries for Microsoft Sentinel solutions.

## Use cases for Microsoft Sentinel hunting queries

Hunting queries in Microsoft Sentinel are used in various scenarios to enhance threat detection and response. Common use cases include:

* **Detect suspicious user activity**: Security teams can use hunting queries to identify anomalous behavior such as unusual sign-in attempts, access patterns, or privilege-escalation activities. By analyzing user activity logs, analysts can detect potential insider threats or compromised accounts.
* **Identify malware and ransomware infections**: Hunting queries can help you detect signs of malware or ransomware infections because they scan for known indicators of compromise (IoCs), unusual network traffic patterns, or file integrity changes. This proactive approach enables teams to respond quickly to mitigate the impact of an infection.
* **Monitor network anomalies**: To identify potential breaches, you can analyze network traffic for unusual patterns, such as unexpected data transfers or communication with known malicious IP addresses. Hunting queries enable analysts to pinpoint these anomalies and investigate further.
* **Investigate phishing attacks**: Hunting queries can help you detect phishing attempts because they analyze email logs and identify suspicious links or attachments. Hunting queries can correlate these findings with threat intelligence data. This process helps you prevent credential theft and protect sensitive information.
* **Track lateral movement**: After an attacker gains initial access, they can move laterally within the network to escalate privileges or access critical systems. Hunting queries can track these movements by analyzing sign-in events, remote desktop sessions, and other relevant data to detect and disrupt the attack.

## Create effective hunting queries

Before you write a query, it's crucial to have a clear objective. What specific threat or behavior are you looking for? When you define a hypothesis, you can better shape the query to target relevant data.

KQL is a powerful language with various operators and functions. When you utilize operators and functions effectively, you can enhance the performance and accuracy of the queries. Useful KQL functions include:

* `parse`: Extracts structured data from text strings.
* `extend`: Adds calculated columns to the result set.
* `summarize`: Aggregates data based on specified criteria.

When you integrate threat intelligence feeds into your queries, it can help you identify known IoCs. By taking this approach, you ensure that your hunting efforts are aligned with the latest threat landscape.

## Create and publish hunting queries

You create hunting queries in [YAML](https://yaml.org/) format. You can use this hunting query as a reference to create your own queries: [Sample hunting query in GitHub](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Malware%20Protection%20Essentials/Hunting%20Queries/FileCretaedInStartupFolder.yaml).

In this section, we provide a detailed walkthrough of hunting query attributes.

### ID

The `id` attribute consists of a standard globally unique identifier (GUID). Generate it by using any development tool, an online generator, or the new PowerShell [New-GUID cmdlet](/powershell/module/microsoft.powershell.utility/new-guid?view=powershell-6&preserve-view=true). It must be unique among other GUIDs.

This field is mandatory.

### Name

The `name` attribute provides a brief label that summarizes the detection. Make sure the label is clear and concise to help users understand the purpose of the hunting query. Use `alertDetailsOverride` to generate dynamic names to help analysts understand the alert. This attribute:

* Uses sentence-case capitalization.
* Doesn't end in a period.
* Has a maximum length of 50 characters (whenever possible).

This field is mandatory.

### Description

The `description` attribute provides a detailed description of the detection. The description includes information about the behavior being detected, the potential effect, and any recommended actions. This attribute:

* Uses sentence case capitalization.
* Starts with "This query searches for" or "Identifies."
* Is different from and more descriptive than the name field.
* Has a maximum length of 255 characters.
* Is five sentences or less.
* Doesn't describe the data source (connector or data type).
* Doesn't provide a technical explanation for the query language.

This field is mandatory.

### Required data connectors

The `requiredDataConnectors` attribute represents the list of data connectors that the query needs to function correctly, including the data sources against which the rule queries. If there's no current data connector mapping, you must use an open brace: `requiredDataConnectors: []`.

The `connectorId` attribute specifies the ID of the data connector that you need so the query functions correctly. If your detection query depends on the data fetched from a specific connector, you must specify the connector ID here. For instance, if your hunting query depends on the data from this [connector](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/1Password/Data%20Connectors/1Password_ccpv2/1Password_DataConnectorDefinition.json), you must specify the `connectorID` as `1PasswordCCPDefinition`.

The `dataTypes` attribute represents the data types that the hunting query depends on and mentions the name of the data type referenced in the `dataTypes` section of the connector. For instance, if your hunting query depends on the data from this [connector](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/1Password/Data%20Connectors/1Password_ccpv2/1Password_DataConnectorDefinition.json), you must specify the data type as `OnePasswordEventLogs_CL`. If the hunting query operates on a Kusto function/parser instead of the table (like `Syslog`, `CommonEventFormat`, or `_CL`), `dataTypes` is the Kusto function name/parser name and not the table name.

### Tactics

The `tactics` attribute defines the [`MITRE ATT&CK tactics`](https://attack.mitre.org/versions/v13/matrices/enterprise/) that the detection relates to. When you define the tactics, it helps users understand the context of the detection and how it fits into the overall threat landscape. For this attribute:

* `ATT&CK Framework v13` is supported.
* Names can't include spaces. For example: `InitialAccess` or `LateralMovement`.

This field is mandatory.

### Relevant techniques

The `relevantTechniques` attribute defines the [`MITRE ATT&CK techniques`](https://attack.mitre.org/versions/v13/matrices/enterprise/) that the detection relates to. When you define the techniques, it helps users understand the context of the detection and how it fits into the overall threat landscape. For this attribute:

* `ATT&CK Framework v13` is supported.
* Attribute matches `MITRE` tactics.
* Names can't include spaces. For example: `T1078` or `T1078.001`.

This field is mandatory.

### Query

The `query` attribute defines the detection logic. We recommend that you write the query in KQL and make sure that it's well structured and easy to understand. We recommend that you create an efficient query that's optimized for performance to ensure it can be run against large datasets without affecting performance. Make sure that your query meets the following criteria.

Limit the query to 10,000 characters. If the query section exceeds this limit, consider reducing the number of characters. A static list of items used for comparison within the query body can cause you to go over the limit. We recommend that you move these lists to one of the following options:

* A [watchlist function](/azure/sentinel/watchlists)
* A [custom JSON/CSV](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/ExchangeServerVulnerabilitiesMarch2021IoCs.yaml)
* A [custom function](https://techcommunity.microsoft.com/t5/azure-sentinel/using-kql-functions-to-speed-up-analysis-in-azure-sentinel/ba-p/712381)

Each line in the query body must have at least one space at the beginning, but two spaces are standard to support readability.

When you submit a query for a datatype that isn't present in the Detections or Hunting Queries folder, name the subfolder that contains the YAML files after the table being queried. For instance, if your query pertains to the `AzureDevOpsAuditing` table, create a folder named `AzureDevOpsAuditing`.

Define human-readable names for explicit constants:

* `let FailedLoginEventID = 4625;`
* `let countThreshold = 6;`

We highly recommend that you use comments to clarify the query. Avoid adding comments at the end of a query statement line. Instead, add your comments on a separate line. For example:

```
// Removing noisy processes for an environment, adjust as needed
```

If you're referencing a parser instead of a table name, ensure clarity in the description by including a comment next to the parser function reference. The parser must be imported into the workspace first. Otherwise, the queries don't recognize it as valid.

Ensure that every available entity field is returned for mapping purposes. (Refer to the [Entity mappings section](#entity-mappings).) Sanitize the returned table so that it provides only the properties that you need to investigate further. You don't need a `TimeGenerated` filter when you use a simple `lookback` command across the entire query. The `queryPeriod` value in the YAML controls this process.

For baselining or performing a historical comparison, such as comparing today to the previous seven days, include a time-bounded filter such as `| where TimeGenerated >= ago(lookback)`, because the YAML template doesn't currently support multiple `queryPeriod` values. Avoid using time frames shorter than one day unless there's a specific reason. We don't recommend time frames longer than 14 days due to potential performance impacts.

Summarize when necessary. Ensure that you include the time field (usually `TimeGenerated`) because you need it in the entity field. Include both the `min()` and `max()` values as follows: `| summarize StartTime = max(TimeGenerated), EndTime = min(TimeGenerated)`. Use the terms `StartTime` and `EndTime` exclusively. Don't assign the fields the names `StartTimeUtc` or `EndTimeUtc`, because these names can conflict with user experience preferences.

Additionally, include as many fields as possible to help the user understand the context of the alert. We recommend that you include at least one of the primary entities: `Host`, `Account`, or `IP`.

This field is mandatory.

### Entity mappings

The `entityMappings` attribute is integral when you configure scheduled hunting queries. It enriches the query's output (alerts and incidents) with essential information that serves as the building blocks of any investigative processes and remedial actions that follow.

The `entityType` represents the standard list of entities recognized by Microsoft Sentinel. See allowed values in the Entity type column in the [Entity mapping table](/azure/sentinel/entities-reference#entity-types-and-identifiers).

This field is mandatory.

### Field mappings

The `fieldMappings` attribute represents the identifier of the field in the query output that corresponds to the entity type. See allowed values under the identifiers column value at [Entity mapping table](/azure/sentinel/entities-reference#entity-types-and-identifiers). For this attribute:

* Each template can have up to 10 entity mappings.
* Each entity mapping can have up to three field mappings (that is, identifiers).

  ```json
  entityMappings:
  - entityType: Account
    fieldMappings:
      - identifier: FullName
        columnName: AccountCustomEntity
  - entityType: Host
    fieldMappings:
      - identifier: FullName
        columnName: HostCustomEntity
  - entityType: IP
    fieldMappings:
      - identifier: Address
        columnName: ClientIP
  - entityType: DNS
    fieldMappings:
        - identifier: DomainName
          columnName: Name    

  ```

### Custom details

The `customDetails` attribute integrates event data into alerts, making it visible in security incidents for faster triaging, investigation, and response. Custom details are key/value pairs of property and column names. For more information, see [Surface custom event details in alerts in Microsoft Sentinel](/azure/sentinel/surface-custom-details-in-alerts). Up to 20 custom details (that is, key/value pairs) can be defined per template.

```json
    customDetails:
      Computers: Computer
      IPs: ComputerIP
```

### Version

When a customer creates a new hunting query from the template, the template `version` is saved. If a new template version is published, customers are notified in the UX. Versions follow the format `a`, `b`, and `c`, in which `a` is the major version, `b` is the minor version, and `c` is the patch. The version field is the last line of the template.

This field is mandatory.
