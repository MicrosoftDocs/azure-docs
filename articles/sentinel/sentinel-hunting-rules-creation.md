---
title: 'Create hunting queries for Microsoft Sentinel solutions'
description: This article guides you through the process of creating and publishing hunting queries to Microsoft Sentinel solutions.
author: anilgodavarthy
ms.author: angodavarthy
ms.service: microsoft-sentinel
ms.topic: conceptual 
ms.date: 2/06/2025

#CustomerIntent: As a ISV partner, I want to create and publish hunting queries to my Microsoft Sentinel solution so that I can provide inbuilt detection use cases to my customers.
---

# Creating and publishing hunting queries for Microsoft Sentinel solutions

Security analysts use hunting queries at the heart of the threat hunting process in Microsoft Sentinel. They write advanced, customizable queries in Kusto Query Language (KQL) to sift through large volumes of data collected from various sources. These queries allow analysts to identify potential security threats, investigate suspicious activities, and gain insights into the behavior of their network and endpoints. In Microsoft Sentinel, analysts proactively search for threats that might have bypassed existing security defenses. This proactive approach helps analysts uncover hidden threats, patterns, or anomalies within their IT environment. Hypotheses about potential threats or the latest intelligence on emerging attack vectors typically drive the hunting process. For more information, see [Threat hunting in Microsoft Sentinel | Microsoft Learn](/azure/sentinel/hunting)

This article walks you through the process of creating and publishing hunting queries to Microsoft Sentinel solutions.

## Creating Effective Hunting Queries

- **Define Clear Objectives:** Before writing a query, it's crucial to have a clear objective. What specific threat or behavior are you looking for? Defining a hypothesis - helps in shaping the query to target relevant data.
- **Utilize KQL Efficiently:** KQL is a powerful language with various operators and functions. Utilizing these effectively can enhance the performance and accuracy of the queries. Some useful KQL functions include:
    - parse: Extracts structured data from text strings.
    - extend: Adds calculated columns to the result set.
    - summarize: Aggregates data based on specified criteria.
- **Incorporate Threat Intelligence:** Integrating threat intelligence feeds into your queries can help in identifying known Indications of compromise (IOCs). This approach ensures that your hunting efforts are aligned with the latest threat landscape.

## Use cases for Microsoft Sentinel hunting queries
Hunting queries in Microsoft Sentinel are used in various scenarios to enhance threat detection and response. Some common use cases include:

- **Detecting Suspicious User Activities:** Security teams can use hunting queries to identify anomalous behavior such as unusual sign-in attempts, access patterns, or privilege escalation activities. By analyzing user activity logs, analysts can detect potential insider threats or compromised accounts.
- **Identifying Malware and Ransomware Infections:** Hunting queries can help detect signs of malware or ransomware infections by scanning for known indicators of compromise (IoCs), unusual network traffic patterns, or file integrity changes. This proactive approach enables teams to respond quickly to mitigate the impact of an infection.
- **Monitoring Network Anomalies:** Analyzing network traffic for unusual patterns, such as unexpected data transfers or communication with known malicious IP addresses, can help identify potential breaches. Hunting queries enable analysts to pinpoint these anomalies and investigate further.
- **Investigating Phishing Attacks:** Hunting queries can be used to detect phishing attempts by analyzing email logs, identify suspicious links or attachments, and correlate these findings with threat intelligence data. This helps in preventing credential theft and protecting sensitive information.
- **Tracking Lateral Movement:** Once an attacker gains initial access, they often move laterally within the network to escalate privileges or access critical systems. Hunting queries can track these movements by analyzing sign-in events, remote desktop sessions, and other relevant data to detect and disrupt the attack.

## Creating and publishing hunting queries

Hunting queries should be created in [YAML](https://yaml.org/) format. You can use this hunting query as reference for creating your own queries - [Sample hunting query in GitHub](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Malware%20Protection%20Essentials/Hunting%20Queries/FileCretaedInStartupFolder.yaml). In this section, we provide a detailed walkthrough of various attributes in the hunting query.

- **ID** - ID is a standard GUID. Generate it using any development tool, online generator, or PowerShell's [New-GUID cmdlet](/powershell/module/microsoft.powershell.utility/new-guid?view=powershell-6&preserve-view=true). It must be unique among other GUIDs. **This field is mandatory**.
- **Name** - Provide a brief label that summarizes the detection which is clear and concise to help users understand the purpose of the hunting query. Use alertDetailsOverride for dynamic names to aid analysts in understanding the alert. **This field is mandatory**.
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
- **requiredDataConnectors** - Represents the list of data connectors that are required for the query to function correctly. This should include the data sources that the rule query against. If there's no current data connector mapping, then an open brace must be used - requiredDataConnectors: []
    - **connectorId** - Specifies the ID of data connector that is required for the query to function correctly. If your detection query is dependent on the data fetched from a specific connector, you must specify the connector ID here. For instance, if your hunting query depends on the data from this [connector](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/1Password/Data%20Connectors/1Password_ccpv2/1Password_DataConnectorDefinition.json), you must specify the connector ID as "1PasswordCCPDefinition"
    - **dataTypes** - Data types that the hunting query is dependent on. This should mention the name of the data type that is mentioned in the "dataTypes" section of the connector. For instance, if your hunting query depends on the data from this [connector](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/1Password/Data%20Connectors/1Password_ccpv2/1Password_DataConnectorDefinition.json), you must specify the data type as "OnePasswordEventLogs_CL." If the hunting query operates on a Kusto Function/ Parser instead of the table (like Syslog, CommonEventFormat, _CL), dataTypes should be the Kusto Function name/Parser name and not the table name.
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
- **entityMappings** - Entity mapping is an integral part of the configuration of scheduled hunting queries. It enriches the query's output (alerts and incidents) with essential information that serves as the building blocks of any investigative processes and remedial actions that follow. **This field is mandatory**.
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
- **Version** - This template version is saved when a customer creates a hunting query from the template. If a new template version is published, customers are notified in the UX. Versions follow the format a.b.c, where a is the major version, b is the minor version, and c is the patch. The version field should be the template's last line. **This field is mandatory**.