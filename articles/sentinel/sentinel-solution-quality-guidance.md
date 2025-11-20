---
title: Sentinel solution quality guidelines
description: This article guides you through the process of publishing high quality solutions for Microsoft Sentinel.
author: mberdugo
ms.author: monaberdugo
ms.reviewer: angodavarthy
ms.service: microsoft-sentinel
ms.topic: conceptual
ms.date: 09/18/2025
#CustomerIntent: As an ISV partner, I want clear guidance on how I can build and publish high quality solutions to Microsoft Sentinel so that customers can get a truly out-of-the-box experience using my solution.
---

# Sentinel solution quality guidelines

This document describes the quality guidelines and recommendations for Microsoft Sentinel solutions.

## Understanding data 

Platform solutions use the Sentinel data lake to maximize data coverage and include data that is being retained long term. Except for connectors, content for Sentinel SIEM solutions that is surfaced in Content Hub (i.e. playbooks) work over data in log analytics and do not use the Sentinel data lake.

## Security Copilot agents

- **Simplify authentication for complex agents**: Agents that call APIs to enrich data or communicate with remote endpoints must authenticate with the API they are calling. Managing basic passwords and client secrets can be a burden and introduces security risks. Use the following mechanisms to simplify the user experience:
  - **Security Copilot plugins**: Before connecting directly to an API, check to see if there's a plug-in that supports your desired capability. For Microsoft plug-ins, authentication is handled by the Security Copilot platform. See the [Security CoPilot plugins overview](/copilot/security/plugin-overview) for more information.
  - **AADDelegated auth type**: When connecting to an API that utilizes Entra accounts and roles, check to see if the API supports the AADDelegated auth type. This removes the burden of securely managing client secrets or passwords. See the [API plugins documentation for Security Copilot](/copilot/security/plugin-api) for more information.
- **Promoting good security practices among your users**: The following are recommendations that it is suggested solution publishers make to their users to help their users run the solutions in the most secure manner:
  - **AADDelegated Auth**: Agents run within the context of the user that installed the agent. Apply the principle of least privilege by assigning the agent to run in a user account that has the minimum set of roles or permissions to perform the required operation and is configured with MFA.
  - **Auth types with secrets**: For auth types requiring secrets such as account passwords or client app secret keys, follow best practices for managing secrets: for example, using Azure Key Vault when storing secrets.

## Notebooks and notebook jobs

[Notebook jobs](/azure/sentinel/datalake/notebook-jobs) are powerful tools to transform data and provide complex ML models. They augment Security Copilot agents by providing a deterministic and efficient means of providing data analysis and summarization. Processed data can be written to custom tables in the data lake and read by agents using the KQL Skill or corresponding MCP tool. 

Best practices include: 
- Author notebooks jobs with the [Visual Studio Code Sentinel extension](/azure/sentinel/datalake/notebooks-overview). This extension is available in the VS Code extension marketplace. The extension provides: 
  - Microsoft Sentinel Provider, enabling notebooks to interact with the data lake
  - GitHub copilot integration for notebooks and PySpark package.
  - GUI for creating and managing notebooks, scheduled notebook jobs and packaging
- **Use notebook examples**: [Example notebooks](/azure/sentinel/datalake/notebook-examples) provide common calling patterns and inspiration for creating security solutions.
- **Use workspace autodetection logic**: As a solution provider, you won't know ahead of time which workspace to query for Sentinel data. You can use the following sample to programmatically discover what workspaces contain your required data tables. Additionally, if the same table is present in multiple workspaces, you can union the tables into one dataframe for easy data manipulation. See example here.
- **Write to the System tables workspace**: As a solution provider, you can count on the System tables workspace to always be present in the data lake. Reading and writing to this table does not require any specific detection logic. 
- **Use required permissions**: Please notify your users that in order to install a solution containing notebook jobs the user must have a Security Operator, Security Admin, or Global Administrator role. See [Roles and permissions in the Microsoft Sentinel platform](/azure/sentinel/roles) to learn more. 

## SIEM solutions 

A Microsoft Sentinel SIEM solution consists of multiple content items, each serving a specific purpose.  

This section describes requirements for each content type that can be included in a Sentinel SIEM solution. 

## Data connectors 

**Partners must use the Codeless Connector Framework (CCF) to create data connectors.** The Codeless Connector Framework (CCF) provides partners, advanced users, and developers the ability to create custom connectors for ingesting data to Microsoft Sentinel. Connectors created using the CCF require no service installations and the entire infrastructure for polling and pulling data is managed behind the scenes by Microsoft Sentinel. CCF comes with inbuilt health monitoring, full support from Microsoft Sentinel, and scales automatically to support varying ingestion sizes. With the CCF platform, customers have a simple UI interface through which they can configure ingestion, without having to deploy resources in Azure. Customers aren't charged for the compute capacity required to poll and ingest data into Microsoft Sentinel and are only charged for data that is ingested into Microsoft Sentinel. 

> [!CAUTION]
> Partners are required to use the Codeless Connector Framework (CCF), instead of Azure functions, for all new data connectors. If you find any blockers during the development of your data connector due to limitations in the CCF framework, log an issue with title "CCF Limitations" at https://github.com/Azure/Azure-Sentinel/issues. The Microsoft Sentinel team will work with you to resolve the issue or provide a workaround. If the issue is a blocker, the Microsoft Sentinel team will work with you to create an exception for your data connector. To contact the Microsoft Sentinel team for assistance, email Microsoft Sentinel Partners at [AzureSentinelPartner@microsoft.com](mailto:AzureSentinelPartner@microsoft.com).

## Analytics rules 

Analytic rules must have appropriate MITRE mappings to ensure that customers can monitor and visualize their threat coverage across their security infrastructure. For more information, see [View MITRE coverage for your organization from Microsoft Sentinel](/azure/sentinel/mitre-coverage?tabs=azure-portal).  

It's important that rules are scoped to cover all key data columns that are pulled by the data connector so customers don’t feel like they’re being charged for ingesting data that isn't being used. 

Entities need to be mapped to the rule output where applicable. Mapping rule output to standardized entities ensures that the rule output can be correlated with other data points in Microsoft Sentinel. Some common examples of entities are user accounts, hosts, mailboxes, IP addresses, files, cloud applications, processes, and URLs. To know more about entities in Microsoft Sentinel, see [Entities in Microsoft Sentinel](/azure/sentinel/entities). 

> [!CAUTION]
> Partners must create at least one analytic rule as part of their Sentinel solution.
> 
> Analytic rules are at the core of the value a Microsoft Sentinel SIEM solution can offer to customers. Getting the data into Microsoft Sentinel is only the first step. However, it's important for customers to monitor their security infrastructure and get notified of any issues. Getting data into Microsoft Sentinel without any detections written on the data wouldn't add any value for customers. To ensure that customers can deploy a Microsoft Sentinel SIEM solution and get started with monitoring their security infrastructure, it's important to have prebuilt analytic rules as part of the solution. This ensures that customers get value out-of-the-box as soon as they install and configure the Microsoft Sentinel SIEM solution, without any extra development effort by the customers.

## Playbooks

Although we don't mandate the availability of playbooks as part of the solution, we strongly recommend that you include playbooks as part of your SIEM solution. Playbooks are critical to ensure that the SOC analysts aren't overburdened by tactical items and can focus on the more strategic and deeper root cause of the vulnerabilities. As you design your solution, think of the automated actions that can be taken to resolve incidents created by the analytic rules defined in your solution. 

## Hunting queries

Although we don't mandate the availability of hunting queries as part of the solution, we strongly recommend that you include hunting queries as part of your solution. Creating hunting queries enable SOC analysts to understand the underlying schema better and inspire them to think of new scenarios. 

When building Hunting queries, consider the following best practices: 
- Use MITRE framework to identify potential threats: The MITRE framework provides a comprehensive set of tactics, techniques, and procedures (TTPs) that can be used to identify potential threats in your data. By using the MITRE framework, you can ensure that your hunting queries are aligned with industry best practices and can help you identify potential threats more effectively. 
- Create queries that cover all important data columns that are being pulled by the data connector. This ensures that your hunting queries are comprehensive and also provide guidance on whether new data points have to be added to the data connector or if any of the existing data points have to remove. 
- Incorporating Threat intelligence (TI) can provide valuable context for your hunting queries. Incorporating threat intelligence available in Microsoft Sentinel into your hunting queries ensure that the SOC analysts have valuable context to identify potential threats. For more information on threat intelligence in Microsoft Sentinel, see [Threat intelligence in Microsoft Sentinel](/azure/sentinel/understand-threat-intelligence). 


 ## Parsers 

Review the available ASIM schemas provided by Microsoft Sentinel to identify relevant ASIM schemas (one or more) for your data to ensure easier onboarding for SOC analysts and to ensure that the existing security content written for the ASIM schema is applicable out-of-the-box for your product data. For more information on the available ASIM schemas, see [Advanced Security Information Model (ASIM) schemas](/azure/sentinel/normalization-about-schemas).

Microsoft Sentinel provides several built-in, source-specific parsers for many of the data sources. You may want to modify, or develop new parsers in the following situations: 
- When your device provides events that fit an ASIM schema, but a source-specific parser for your device and the relevant schema isn't available in Microsoft Sentinel. 
- When ASIM source-specific parsers are available for your device, but your device sends events in a method or a format different than expected by the ASIM parsers. For example: 
- Your source device may be configured to send events in a nonstandard way. 
- Your device may have a different version than the one supported by the ASIM parser. 
- The events might be collected, modified, and forwarded by an intermediary system. 
- To understand how parsers fit within the ASIM architecture, refer to the ASIM architecture diagram. 

> [!NOTE] 
> We don't mandate the availability of parsers in your solution. However if our certification team identifies that your data maps closely to an existing ASIM schema, our team may mandate the creation of parsers to avail the benefits of normalization.

## Workbooks 

We don't mandate the availability of workbooks in your solution as they're use case dependent. However, if you do create workbooks, ensure that they're relevant to the data being ingested and provide value to the customers.

When creating workbooks, consider the following best practices: 
- **Use clear and concise titles and descriptions**: Ensure that the titles and descriptions of your workbooks are clear and concise, making it easy for users to understand the purpose of each workbook.
- **Use appropriate visualizations**: Choose the right type of visualization for the data being presented. For example, use line charts for trends over time, bar charts for comparisons, and tables for detailed data. 
- **Use filters and parameters**: Incorporate filters and parameters to allow users to customize the data displayed in the workbook. This can help users focus on specific time ranges, data sources, or other criteria relevant to their needs. 
- **Optimize performance**: If your workbooks handle vast amounts of data, it may impact performance negatively. In these instances, it's advisable to aggregate the data using summary rules and ensure that the workbooks operate on the summarized data instead of the underlying raw data. 
- **Provide documentation**: Include documentation or tooltips within the workbook to help users understand how to use it effectively. This can include explanations of the data sources, visualizations, and any filters or parameters available. 

## Maintaining solutions 

Once your solution is published, it's important to ensure that the solution is maintained and updated regularly. This includes:  
- **Account for deprecated features**: If a feature used by a solution is deprecated, Microsoft recommends the solution be updated to account for the deprecation six months prior to the end of life or end of service event. 
- **Ensure Solution Description page is accurate and functioning as expected**: The solution description page should be updated as needed to ensure it's accurate and fully functional. Any links that become broken should be fixed. 
- **Address GitHub CodeQL alerts**: If the solution publisher identifies GitHub CodeQL alerts, they should be addressed in a timely manner.
