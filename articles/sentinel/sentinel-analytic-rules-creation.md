---
title: Create Analytics Rules for Microsoft Sentinel Solutions
description: This article guides you through the process of creating and publishing analytics rules to Microsoft Sentinel solutions.
author: anilgodavarthy
ms.author: angodavarthy
ms.service: microsoft-sentinel
ms.topic: conceptual 
ms.date: 1/27/2025

#CustomerIntent: As an ISV partner, I want to create and publish analytics rules to my Microsoft Sentinel solution so that I can provide inbuilt detection use cases to my customers.
---

# Create and publish analytics rules for Microsoft Sentinel solutions

Microsoft Sentinel analytics rules are sets of criteria. They define how data is monitored, what's detected, and what actions are taken when specific conditions are met. These rules help identify suspicious behavior, anomalies, and potential security threats by analyzing logs and signals from various data sources.

Microsoft Sentinel analytics rules are powerful tools for enhancing an organization's security posture because they proactively detect and respond to potential threats. By following a structured approach to creating and managing these rules, organizations can use the capabilities of Microsoft Sentinel to protect their digital assets and maintain a robust security infrastructure. For more information, see [Threat detection in Microsoft Sentinel](/azure/sentinel/threat-detection).

This article walks you through the process of creating and publishing analytics rules to Microsoft Sentinel solutions.

## Use cases for Microsoft Sentinel analytics rules

Microsoft Sentinel analytics rules can be applied to a wide range of scenarios to enhance security monitoring and threat detection. Common use cases include:

* **Intrusion detection**: Identify unauthorized access attempts or suspicious sign-in activities that could indicate a potential breach.
* **Malware detection**: Monitor for known malware signatures or unusual behavior that might suggest the presence of malicious software.
* **Data exfiltration**: Detect large or unusual data transfers that could signify that data is being exfiltrated from the network.
* **Insider threats**: Identify anomalous behavior from internal users, such as accessing sensitive data outside of normal hours or patterns.
* **Compliance monitoring**: Ensure adherence to regulatory requirements by monitoring for specific activities or access patterns.
* **Threat hunting**: Proactively search for indicators of compromise or other signs of malicious activity within the network.
* **Account compromise**: Detect signs that user accounts might be compromised, such as unusual geographic sign-in patterns or multiple failed sign-in attempts.
* **Network anomalies**: Identify unusual network traffic patterns that could indicate the presence of a threat or misconfiguration.
* **Privilege escalation**: Monitor for attempts to gain elevated privileges within the network, which can be a precursor to further malicious activity.
* **Endpoint security**: Ensure that endpoints are secure by detecting deviations from normal behavior or the presence of unauthorized software.

## Create and publish analytics rules

You create analytics rules in [YAML](https://yaml.org/) format. You can use this example of an analytics rule as a reference to create your own queries: [Sample analytics rule in GitHub](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Microsoft%20Entra%20ID/Analytic%20Rules/FailedLogonToAzurePortal.yaml).

The following sections provide a detailed walkthrough of various attributes of an analytics rule.

### ID

The `id` attribute consists of a standard globally unique identifier (GUID). Generate it by using any development tool, an online generator, or the new PowerShell [New-GUID cmdlet](/powershell/module/microsoft.powershell.utility/new-guid?view=powershell-6&preserve-view=true). It must be unique among other GUIDs.

This field is mandatory.

### Kind

The `kind` attribute represents the type of rule.

There are two accepted values: `scheduled` and `NRT` (near-real time). The `scheduled` value requires that you define other properties, including `queryFrequency`, `queryPeriod`, `triggerThreshold`, and `triggerOperator`.

This field is mandatory.

### Name

The `name` attribute provides a brief label that summarizes the detection. Make sure the label is clear and concise to help users understand the purpose of the rule. Use `alertDetailsOverride` to generate dynamic names to help analysts understand the alert. This attribute:

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

### Severity

The `severity` attribute defines the severity level of the detection. Severity reflects the potential effect of the behavior being detected and the urgency of the response.

* **Informational**: The incident might not directly represent a security threat, but might be of interest for follow-up investigation, or to add context or situational awareness to an analyst.
* **Low**: Immediate effect is minimal, and a threat actor would need to conduct multiple steps before achieving an effect on an environment.
* **Medium**: The threat actor could achieve some effect on the environment with this activity, but the effect would be limited in scope or require extra activity.
* **High**: The identified activity provides the threat actor with wide-ranging access to conduct actions on the environment.

> [!NOTE]
> Severity level defaults aren't a guarantee of the current or environment impact level. Severity level applies only to Microsoft Sentinel analytics templates. Otherwise, the security service that issued the alert controls the `severity` attribute in the Alerts table. You can use `alertDetailsOverride` to provide a dynamic `severity` attribute that depends on the actual outcome of the query.

### Required data connectors

The `requiredDataConnectors` attribute represents the list of data connectors that the rule needs to function correctly, including the data sources against which the rule queries. If there's no current data connector mapping, you must use an open brace: `requiredDataConnectors: []`.

The `connectorId` attribute specifies the ID of the data connector that you need so the query functions correctly. If your detection query depends on the data fetched from a specific connector, you must specify the connector ID here. For instance, if your analytics rule depends on the data from this [connector](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/1Password/Data%20Connectors/1Password_ccpv2/1Password_DataConnectorDefinition.json), you must specify the `connectorID` as `1PasswordCCPDefinition`.

The `dataTypes` attribute represents the data types that the analytics rule depends on and mentions the name of the data type referenced in the `dataTypes` section of the connector. For instance, if your hunting query depends on the data from this [connector](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/1Password/Data%20Connectors/1Password_ccpv2/1Password_DataConnectorDefinition.json), you must specify the data type as `OnePasswordEventLogs_CL`. If the hunting query operates on a Kusto function/parser instead of the table (like `Syslog`, `CommonEventFormat`, or `_CL`), `dataTypes` is the Kusto function name/parser name and not the table name.

### Query period

The `queryPeriod` attribute represents a specified period during which the query runs. For example: the last 3 days. For this attribute:

* Use Kusto Query Language (KQL) `TimeSpan` format (for example, 3 days is `3d`, 2 hours is `2h`).
* Ensure that any learning or reference period is within this time frame.
* Don't use a value higher than the maximum supported value, which is `14d`.

This field is mandatory for scheduled analytics rules.

### Query frequency

The `queryFrequency` attribute represents the frequency at which the query runs. For this attribute:

* Use KQL `TimeSpan` format (for example, 3 days is `3d`, 2 hours is `2h`).
* Use a `queryFrequency` that is less than or equal to the `queryPeriod`.
* Follow this rule: if the `queryPeriod` is greater than or equal to 2 days (`2d`), the `queryFrequency` value can't be less than 1 hour (`1h`) and is only used for high-severity detections.

This field is mandatory for scheduled analytics rules.

### Trigger operator

The `triggerOperator` attribute indicates the mechanism that triggers the alert. For example: greater than (`gt`) the number set in the `triggerThreshold` attribute (see [Trigger threshold](#trigger-threshold)).

* `gt`: Greater than.
* `lt`: Less than.
* `eq`: Equal to.

This field is mandatory for scheduled analytics rules.

### Trigger threshold

The `triggerThreshold` attribute represents the threshold that triggers the alert. Threshold is the value that the `triggerOperator` references. Supported values include any integer between 0 and 10,000.

For example, if the `triggerOperator` is set to `gt` and the `triggerThreshold` is `1`, the alert triggers when a value is greater than 1.

This field is mandatory for scheduled analytics rules.

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

The `query` attribute defines the detection logic. We recommend that you write the query in KQL and make sure that it's structured and easy to understand. We recommend that you create an efficient query that's optimized for performance to ensure it can be run against large datasets without affecting performance. Make sure that your query meets the following criteria.

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

### Event grouping settings

The `eventGroupingSettings` attribute relates to alerts. An alert rule can generate a separate alert for each query result. For instance, a rule that identifies non-Microsoft alerts in the event stream could create a Microsoft Sentinel alert for each source alert.

* To produce a single alert for all query results (the default), use:

  ```json
  eventGroupingSettings:
  aggregationKind: SingleAlert
  ```

* To produce a separate alert for each query result, use:

  ```json
  eventGroupingSettings:
  aggregationKind: AlertPerResult
  ```

### Entity mappings

The `entityMappings` attribute is integral when you configure scheduled analytics rules. It enriches the query's output (alerts and incidents) with essential information that serves as the building blocks of any investigative processes and remedial actions that follow.

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

### Alert details override

The `alertDetailsOverride` attribute is a dynamic field that you can use to override the alert details. You can use this attribute to provide more context or information to the analyst when the alert is triggered. When you use this feature, you ensure that analysts receive pertinent information, including relevant entity names, to facilitate a quicker, and more accurate understanding of the incident. Limitations include:

* A maximum of three parameters can be included in either the `name` or `description`.
* The `name` must not exceed 256 characters, while the `description` is limited to 5,000 characters.
* The column name within the curly braces must precisely match the expected column name, without any leading or trailing white space (for example, `{{columnName}}`, not `{{ columnName }}`). In the following example, `columnName1`, `columnName2`, `dynamicTactic`, and `dynamicSeverity` are output fields of the scheduled alert query.

  ```json
      alertDetailsOverride:
        alertDisplayNameFormat: free text with field names embedded using the format {{columnName}} # Up to 256 chars and 3 placeholders
        alertDescriptionFormat: free text with field names embedded using the format  {{columnName}} # Up to 5000 chars and 3 placeholders
        alertTacticsColumnName: dynamicTacticColumnName
        alertSeverityColumnName: dynamicSeverityColumnName

  ```

  ```json
      alertDetailsOverride:
        alertDisplayNameFormat: rule {{columnName1}} display name
        alertDescriptionFormat: rule {{columnName2}} display name
        alertTacticsColumnName: dynamicTactic
        alertSeverityColumnName: dynamicSeverity
  ```

### Version

When a customer creates a new hunting query from the template, the template `version` is saved. If a new template version is published, customers are notified in the UX. Versions follow the format `a`, `b`, and `c`, in which `a` is the major version, `b` is the minor version, and `c` is the patch. The version field is the last line of the template.

This field is mandatory.
