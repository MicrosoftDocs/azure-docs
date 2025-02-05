---
title: 'Create analytics rules for Microsoft Sentinel solutions'
description: This article guides you through the process of creating and publishing analytics rules to Microsoft Sentinel solutions.
author: anilgodavarthy
ms.author: angodavarthy
ms.service: microsoft-sentinel
ms.topic: conceptual 
ms.date: 1/27/2025

#CustomerIntent: As a ISV partner, I want to create and publish analytics rules to my Microsoft Sentinel solution so that I can provide inbuilt detection use cases to my customers.
---

# Creating and publishing analytics rules for Microsoft Sentinel solutions

Microsoft Sentinel analytics Rules are sets of criteria that define how data should be monitored, what should be detected, and what actions should be taken when specific conditions are met. These rules help identify suspicious behavior, anomalies, and potential security threats by analyzing logs and signals from various data sources. Microsoft Sentinel analytics Rules are a powerful tool for enhancing an organization's security posture by proactively detecting and responding to potential threats. By following a structured approach to creating and managing these rules, organizations can use Microsoft Sentinel's capabilities to protect their digital assets and maintain a robust security infrastructure. For more information, see [Threat detection in Microsoft Sentinel | Microsoft Learn](/azure/sentinel/threat-detection)

This article walks you through the process of creating and publishing analytics rules to Microsoft Sentinel solutions.

## Use cases for Microsoft Sentinel analytics rules
Microsoft Sentinel analytics Rules can be applied to a wide range of scenarios to enhance security monitoring and threat detection. Some common use cases include:

- **Intrusion Detection:** Identifying unauthorized access attempts or suspicious sign in activities that could indicate a potential breach.
- **Malware Detection:** Monitoring for known malware signatures or unusual behavior that might suggest the presence of malicious software.
- **Data Exfiltration:** Detecting large or unusual data transfers that could signify data is being exfiltrated from the network.
- **Insider Threats:** Identifying anomalous behavior from internal users, such as accessing sensitive data outside of normal hours or patterns.
- **Compliance Monitoring:** Ensuring adherence to regulatory requirements by monitoring for specific activities or access patterns.
- **Threat Hunting:** Proactively searching for indicators of compromise or other signs of malicious activity within the network.
- **Account Compromise:** Detecting signs that user accounts might be compromised, such as unusual geographic sign in patterns or multiple failed sign in attempts.
- **Network Anomalies:** Identifying unusual network traffic patterns that could indicate the presence of a threat or misconfiguration.
- **Privilege Escalation:** Monitoring for attempts to gain elevated privileges within the network, which can be a precursor to further malicious activity.
- **Privilege Escalation:** Monitoring for attempts to gain elevated privileges within the network, which can be a precursor to further malicious activity.
- **Endpoint Security:** Ensuring that endpoints are secure by detecting deviations from normal behavior or the presence of unauthorized software.

## Creating and publishing analytics rules

Analytics rules should be created in [YAML](https://yaml.org/) format. You can use this analytics rule as reference for creating your own detections - [Sample analytics rule in GitHub](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Microsoft%20Entra%20ID/Analytic%20Rules/FailedLogonToAzurePortal.yaml). In this section, we provide a detailed walkthrough of various attributes in the analytics rule.

- **ID** - ID is a standard GUID. Generate it using any development tool, online generator, or PowerShell's [New-GUID cmdlet](/powershell/module/microsoft.powershell.utility/new-guid?view=powershell-6&preserve-view=true). It must be unique among other GUIDs. **This field is mandatory**.
- **kind** - Represents the type of rule. **This field is mandatory**. Accepted values are:
    - "scheduled" - requires defining other properties - queryFrequency, queryPeriod, triggerThreshold, and triggerOperator
    - "NRT" - Near Real Time
- **Name** - Provide a brief label that summarizes the detection which is clear and concise to help users understand the purpose of the rule. Use alertDetailsOverride for dynamic names to aid analysts in understanding the alert. **This field is mandatory**.
    - Use Sentence case capitalization
    - Do NOT end with a period
    - Length SHOULD NOT exceed 50 chars whenever possible
- **Description** - Provide a detailed description of the detection. Description should include information about the behavior being detected, the potential effect, and any recommended actions. **This field is mandatory**.
    - Use Sentence case capitalization
    - Start with - "This query searches for" or "Identifies"
    - Isn't a copy of the name field, it needs to be more descriptive.
    - 'Description' for 'Hunting Query' should NOT exceed 255 characters.
    - Restrict to five sentences or less.
    - Do NOT Describe the Data source (connector or datatype).
    - Do NOT provide a Technical explanation for the query language used. **This field is mandatory**.
- **Severity** - Define the severity level of the detection. Severity should reflect the potential effect of the behavior being detected and the urgency of the response.
    - Informational: The incident might not represent a security threat directly but might be of interest for follow-up investigation, or to add context or situational awareness to an analyst.
    - Low: Immediate effect is minimal, and a threat actor would need to conduct multiple steps before achieving affect on an environment.
    - Medium: The threat actor could perform some effect on the environment with this activity, but it would be limited in scope or require extra activity.
    - High: The activity identified provides the threat actor with wide ranging access to conduct actions on the environment.    
 > [!NOTE]
> Severity level defaults aren't a guarantee of current or environment impact level. Severity level applies only to Microsoft Sentinel analytics templates. Severity in the Alerts table is otherwise controlled by the security service for which the alert came from. You can use alertDetailsOverride to provide a dynamic severity that depends on the actual outcome of the query.
- **requiredDataConnectors** - Represents the list of data connectors that are required for the rule to function correctly. This should include the data sources that the rule query against. If there's no current data connector mapping, then an open brace must be used - requiredDataConnectors: []
    - **connectorId** - Specifies the ID of data connector that is required for the rule to function correctly. If your detection query is dependent on the data fetched from a specific connector, you must specify the connector ID here. For instance, if your analytics rule query depends on the data from this [connector](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/1Password/Data%20Connectors/1Password_ccpv2/1Password_DataConnectorDefinition.json), you must specify the connector ID as "1PasswordCCPDefinition"
    - **dataTypes** - Data types that the analytics rule is dependent on. This should mention the name of the data type that is mentioned in the "dataTypes" section of the connector. For instance, if your analytics rule query depends on the data from this [connector](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/1Password/Data%20Connectors/1Password_ccpv2/1Password_DataConnectorDefinition.json), you must specify the data type as "OnePasswordEventLogs_CL." If the analytics rule operates on a Kusto Function/ Parser instead of the table (like Syslog, CommonEventFormat, _CL), dataTypes should be the Kusto Function name/Parser name and not the table name.
- **queryPeriod** - The query runs across a specified period, such as the last 3 days. **This field is mandatory for scheduled analytics rules**.
    - Use Kusto Query Language (KQL) TimeSpan Format (for example, three days is 3d, 2 hours is 2h).
    - Ensure any learning or reference period is within this time frame.
    - Maximum supported value: 14d
- **queryFrequency** -  The frequency at which the query runs. **This field is mandatory for scheduled analytics rules**.
    - Use Kusto Query Language (KQL) TimeSpan Format (for example, three days is 3d, 2 hours is 2h).
    - QueryFrequency must be less than, or equal to, the QueryPeriod.
    - If the QueryPeriod is greater than or equal to two days (2d), the QueryFrequency value MUST NOT be less than 1 hour (1h) and is only used for High severity detections
- **triggerOperator** - Indicates the mechanism that triggers the alert, such as greater than a count of 6 (in this case, an alert is triggered if the number of results returned from the query is higher than 6). **This field is mandatory for scheduled analytics rules**.
    - gt – Greater Than
    - lt – Less Than
    - eq – Equal To
- **triggerThreshold** - The threshold that triggers the alert. Threshold is the value that the triggerOperator compares against. Supported Values: Any integer between 0 and 10000. **This field is mandatory for scheduled analytics rules**.
    - The alert triggers when AlertTriggerOperator is set to Greater Than and AlertTriggerThreshold is above 1.
- **tactics** - Define the [MITRE ATT&CK tactics](https://attack.mitre.org/versions/v13/matrices/enterprise/) that the detection is related to. This should help users understand the context of the detection and how it fits into the overall threat landscape. **This field is mandatory**.
    - ATT&CK Framework v13 Supported
    - Names MUST NOT have any spaces. Example – InitialAccess or LateralMovement
- **relevantTechniques** - Define the [MITRE ATT&CK techniques](https://attack.mitre.org/versions/v13/matrices/enterprise/) that the detection is related to. This should help users understand the context of the detection and how it fits into the overall threat landscape. *This field is mandatory**.
    - ATT&CK Framework v13 Supported
    2. MUST match MITRE Tactics
    3. Names MUST NOT have any spaces. Example – T1078 or T1078.001
- **query** - This is the Kusto query that defines the detection logic. It should be written in Kusto Query Language (KQL) and should be well-structured and easy to understand. The query should be efficient and optimized for performance to ensure it can be run against large datasets without impacting performance. **This field is mandatory**.
    - The query is limited to 10,000 characters. If the query section exceeds this limit, consider reducing the number of characters. This is typically due to including a static list of items used for comparison within the query body. It's recommended to move these lists to use a [Watchlist function](/azure/sentinel/watchlists), [custom JSON/CSV](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/ExchangeServerVulnerabilitiesMarch2021IoCs.yaml) with your list, or a [custom function](https://techcommunity.microsoft.com/t5/azure-sentinel/using-kql-functions-to-speed-up-analysis-in-azure-sentinel/ba-p/712381) with your list.
    - Each line in the query body must have at least one space at the beginning; we standardized on two spaces for readability. 
    - If submitting a query for a datatype not present in the Detections or Hunting Queries folder, name the subfolder containing the YAML files after the table being queried. 
        - For instance, if your query pertains to the AzureDevOpsAuditing table, create a folder named AzureDevOpsAuditing.
        - Define human-readable names for explicit constants:
            - let FailedLoginEventID = 4625;
            - let countThreshold = 6;
        - Using comments to clarify the query is highly recommended. 
            - Comments should be on a separate line rather than at the end of a query statement line:
            - // Removing noisy processes for an environment, adjust as needed
    - If referencing a parser instead of a table name, ensure clarity in the description and include a comment next to the parser function reference. The parser must be imported into the workspace first; otherwise, these queries won't recognize it as valid.
        - Ensure that every available entity field is returned for mapping purposes. Refer to the Entity Mapping - 
        - Sanitize the returned table so that it provides only the necessary properties for further investigation. 
        - No TimeGenerated filter is required when a simple lookback is used across the entire query; this will be controlled by the queryPeriod value in the YAML.
    - For baselining or historical comparisons, such as comparing today to the previous seven days, include a time-bounded filter such as "*| where TimeGenerated >= ago(lookback)*", as the YAML template doesn't currently support multiple queryPeriod values. 
        - Avoid using timeframes shorter than one day unless there's a specific reason. 
        - Timeframes longer than 14 days aren't recommended due to potential performance impacts.
    - Summarize when necessary, ensuring to include the time field (usually TimeGenerated) as it's needed in the Entity part. 
        - Include both the min() and max() values as follows: "*| summarize StartTime = max(TimeGenerated), EndTime = min(TimeGenerated)*"
        - Use the terms StartTime and EndTime exclusively; do NOT assign the fields the names StartTimeUtc or EndTimeUtc, as this can conflict with user experience preferences. 
        - Additionally, include as many fields as possible to help the user understand the context of the alert. It's recommended to include at least one of the primary entities: Host, Account, or IP.
- **eventGroupingSettings** - An alert rule can generate a separate alert for each query result. For instance, a rule identifying third-party alerts in the event stream could create a Microsoft Sentinel alert for each source alert. 
    - To produce a single alert for all query results (the default), use:
            ```json
            eventGroupingSettings:
              aggregationKind: SingleAlert
            ```    
    - To produce a separate alert for each query result, use:
            ```json
            eventGroupingSettings:
              aggregationKind: AlertPerResult
            ```
- **entityMappings** - Entity mapping is an integral part of the configuration of scheduled analytics rules. It enriches the rules' output (alerts and incidents) with essential information that serves as the building blocks of any investigative processes and remedial actions that follow. **This field is mandatory**.
    - **entityType** - Represents the standard list of entities recognized by Microsoft Sentinel. See allowed values under the Entity type column value at [Entity Mapping table](/azure/sentinel/entities-reference#entity-types-and-identifiers)
- **fieldMappings** - Represents the identifier of the field in the query output that corresponds to the entity type. See allowed values under the identifiers column value at [Entity Mapping table](/azure/sentinel/entities-reference#entity-types-and-identifiers). 
    - Each template can have up to 10 entity mappings.
    - Each entity mapping can have up to three field mappings (that is, identifiers).
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
- **customDetails** - Custom Details integrate event data into alerts, making it visible in security incidents for faster triaging, investigation, and response. Defined as key-value pairs of property and column names, more information on Custom Details is available [here](/azure/sentinel/surface-custom-details-in-alerts). Up to 20 custom details (that is, key-value pairs) can be defined per template.
    ```json
        customDetails:
          Computers: Computer
          IPs: ComputerIP
    ```    
- **alertDetailsOverride** - This is a dynamic field that can be used to override the alert details. This can be used to provide more context or information to the analyst when the alert is triggered. Using this feature ensures that analysts receive pertinent information, including relevant entity names to facilitate a quicker and more accurate understanding of the incident. Limitations - 
    - A maximum of three parameters can be included in either the Name or Description.
    - The Name must not exceed 256 characters, while the Description is limited to 5,000 characters.
    - The column name within the curly braces must precisely match the expected column name, without any leading or trailing whitespace (for example, {{columnName}}, not {{ columnName }}). See example (columnName1, columnName2, dynamicTactic, and dynamicSeverity are output fields of the scheduled alert query).

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

- **Version** - This template version is saved when a customer creates a rule from it. If a new template version is published, customers are notified in the UX. Versions follow the format a.b.c, where a is the major version, b is the minor version, and c is the patch. The version field should be the template's last line. **This field is mandatory**.