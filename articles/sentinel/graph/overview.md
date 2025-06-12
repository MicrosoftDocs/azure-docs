---  
title: Microsoft Sentinel data lake overview(Preview).
titleSuffix: Microsoft Security  
description: An overview of Microsoft Sentinel data lake, a cloud-native platform that extends Microsoft Sentinel with highly scalable, cost-effective long-term storage, advanced analytics, and AI-driven security operations.
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.topic: conceptual
ms.custom: sentinel-lake-graph
ms.date: 05/29/2025
ms.author: edbaynash  

ms.collection: ms-security  
---  

# Microsoft Sentinel data lake

A data lake is a centralized repository that allows you to store all your structured and unstructured data at scale. It provides a cost-effective way to retain and analyze large volumes of security telemetry over extended periods, enabling deep investigations and proactive threat hunting. Microsoft Sentinel data lake is cloud-native platform that extends Microsoft Sentinel with highly scalable, cost-effective long-term storage, advanced analytics, and AI-driven security operations.
  
As cyber threats grow in scale and sophistication, security operations centers (SOCs) face increasing pressure to retain and analyze vast volumes of telemetry. Traditional SIEM solutions often struggle with the cost and complexity of storing and querying long-term data. Microsoft Sentinel Lake addresses these challenges by:
+ Unifying security data across Microsoft Defender, XDR, and third-party sources.
+ Reducing costs through tiered storage and on-demand data promotion.
+ Enabling deep investigations with up to 12 years of searchable telemetry.
+ Powering AI and automation for faster detection and response.

## Key Features of Microsoft Sentinel Lake

### Unified Data Platform

Microsoft Sentinel Lake integrates seamlessly with Microsoft Defender and Microsoft Sentinel, allowing SOC analysts to access security data using familiar tools. Whether you're investigating a breach or proactively hunting threats, the lake provides the scale and flexibility needed to operate effectively.

### Flexible Querying with KQL

The Data lake exploration KQL queries allow you to write and run KQL queries against your data lake resources. You can use the query editor to explore your data, analyze your data lake resources, and create jobs to promote data from the lake tier to the analytics tier.  

Lake-based KQL queries empower SOC teams and threat hunters to use historical data in the lake using KQL. Create and schedule KQL jobs to promote data to the analytics tier, enabling you to run advanced analytics and machine learning models on your data. When gathering forensic evidence and investigating an incident, use the KQL queries to use historical data to gather evidence and identify the root cause and timeline of the incident, ensuring a comprehensive investigation producing a full picture of the incident. Detect patterns and build a baseline based on historical data. Use KQL's machine learning functions to detect unusual activities and respond to threat actors by using historical data to detect an attack.

KQL queries offer the following key features:
+ KQL Query Editor: Provides editing and running KQL queries with IntelliSense and autocomplete.
+ Full support for KQL: Use the full range of KQL capabilities, including machine learning functions and advanced analytics. 

+ Job Creation: Create one-time or scheduled jobs to promote data from the lake to the Analytics tier. 
+ Job Management: Enable, disable, edit, or delete jobs. 


### Scheduled Jobs and Notebooks
Microsoft Sentinel Lake supports both KQL and Notebook jobs:
+ Jobs: Schedule queries to run on historical data and write results to custom tables.
+ Notebooks: Use Python and built-in libraries to apply machine learning, visualize anomalies, and collaborate across teams. (link to doc)

#### Tiered Storage and Promotion
Data is stored in a cost-efficient lake tier by default. When needed, specific datasets can be promoted to the analytics tier for fast access and alerting, without vendor lock-in or external tooling.

## Related content

- []