---  
title: Microsoft Sentinel data lake overview (preview)
titleSuffix: Microsoft Security  
description: An overview of Microsoft Sentinel data lake, a cloud-native platform that extends Microsoft Sentinel with highly scalable, cost-effective long-term storage, advanced analytics, and AI-driven security operations.
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.subservice: sentinel-graph
ms.topic: conceptual
ms.custom: references_regions
ms.date: 07/16/2025
ms.author: edbaynash  

ms.collection: ms-security  
---  


# What is Microsoft Sentinel data lake (preview)?

Microsoft Sentinel data lake is a purpose-built, cloud-native security data lake that transforms how organizations manage and analyze security data. Architected as a true data lake, it is designed to ingest, store, and analyze large volumes of diverse security data at scale. By centralizing all your security data into a single, open, and extensible platform, it delivers deep visibility, long-term retention, and advanced analytics.  
  
The data lake makes it cost-effective to bring all your security data into Microsoft Sentinel, eliminating the need to choose between coverage and cost. Retain more data for longer, detect threats with greater context and historical depth, and respond faster, without compromising on security.  

The Microsoft Sentinel data lake is fully managed, without the need to deploy or maintain your data infrastructure. It provides a unified data platform for end-to-end threat analysis and response. It enables you to store one copy of security data across assets, activity logs, and threat intelligence in the lake and leverage multiple analytics tools like KQL and notebooks for deep security analytics.

Traditional SIEM solutions struggle with the cost and complexity of storing and querying long-term data. Microsoft Sentinel data lake addresses these challenges in the following ways:

+ Unifying security data across Microsoft Defender XDR, third-party sources and across assets, activity logs, and threat intelligence 
+ Optimizing costs through tiered storage and on-demand data promotion. 
+ Enabling deep security insights with up to 12 years of security data and telemetry that can be queried and deeply analyzed. 
+ Powering AI and automation for faster detection and response.

With a single copy of data, Microsoft Sentinel data lake empowers you to run queries in KQL and conduct deeper analysis for forensics, incidence response, and anomaly detection in Jupyter notebooks using sophisticated Python libraries and machine learning tools. 

## Architecture

Microsoft Sentinel data lake, built on Azure's scalable infrastructure, facilitates centralized ingestion, analysis, and action across diverse data sources. The Microsoft Sentinel data lake technical architecture includes the following key benefits: 

+ Single, open-format data copy for efficient and cost-effective storage. 
+ Separation of storage and compute for greater flexibility. 
+ Support for multiple analytics engines to unlock insights from your security data. 
+ Native integration with Microsoft Sentinel SIEM and its security operations workflows. 

### Storage tiers

Microsoft Sentinel is designed with two distinct storage tiers to optimize cost and performance:

+ Analytics tier: The existing Microsoft Sentinel data tier enabling querying, visualization, and alerting capabilities to help you proactively identify and resolve issues across your infrastructure and applications. 
+ Data lake tier: A centralized security data lake offering long-term data storage for querying and python-based advanced analytics. The data lake tier is designed for cost-effective storage of large volumes of security data, enabling you to retain data for up to 12 years. For more information on data tiers and retention, see [Manage data tiers and retention in Microsoft Defender portal (preview)](https://aka.ms/manage-data-defender-portal-overview).


### Supported Data Sources

Microsoft Sentinel data lake works with all existing Sentinel data connectors, including: 
+ All Microsoft Defender and Microsoft Sentinel data sources
+ Microsoft 365
+ Microsoft Entra ID
+ Microsoft Resource Graph
+ Endpoint Detection and Response (EDR) platforms
+ Firewall and network logs
+ Cloud infrastructure and workload telemetry
+ Identity and access logs (Microsoft Entra, Okta, etc.)
+ DNS, proxy, and email telemetry


### Flexible querying with Kusto Query Language

Data lake exploration Kusto Query Language (KQL) queries enable you to write and run KQL queries against your data lake resources. You can use the query editor to explore your data, analyze your data lake, and create jobs to promote data from the data lake tier to the analytics tier.
KQL queries offer the following key features:

+ KQL query editor: Provides editing and running KQL queries with IntelliSense and autocomplete.
+ Full support for KQL: Use the full range of KQL capabilities, including machine learning functions and advanced analytics.
+ Job Creation: Create one-time or scheduled jobs to promote data from the lake to the analytics tier.

For more information, see [KQL and the Microsoft Sentinel data lake (preview)](kql-overview.md)

:::image type="content" source="media/sentinel-lake-overview/data-lake-exploration.png" lightbox="media/sentinel-lake-overview/data-lake-exploration.png" alt-text="A screenshot showing the KQL query editor in the Microsoft Sentinel data lake.":::

### Powerful analytics using Jupyter notebooks

Jupyter notebooks in the Microsoft Sentinel data lake provide a powerful environment for data analysis and machine learning. Use Python libraries to build and run machine learning models, conduct advanced analytics, and visualize your data. The notebooks support rich visualizations, enabling you to gain insights from your security data. Schedule notebooks to regularly summarize data, run machine learning models, and promote data from the data lake tier to the analytics tier.

For more information, see [Jupyter notebooks in the Microsoft Sentinel data lake (preview)](notebooks-overview.md).

:::image type="content" source="media/sentinel-lake-overview/notebook.png" lightbox="media/sentinel-lake-overview/notebook.png" alt-text="A screenshot showing a Jupyter notebook."::: 

### Activity audit
The Microsoft Sentinel data lake provides audit functionality that tracks activities performed in the data lake. The audit log captures events related to data access, job management, and queries, enabling you to monitor and investigate activities in the data lake.

Some of the activities audited are: 
+ Accessing data in lake via KQL queries
+ Running notebooks on data lake
+ Create, edit, run, and delete jobs 

Auditing is automatically turned on for Microsoft Sentinel data lake. Features that are audited are logged in the audit log automatically. 
For more information on audited data lake activities, see [Audit log for Microsoft Sentinel data lake](./auditing-lake-activities.md)

## Supported regions

For a list of supported regions, see [Regions supported for Microsoft Sentinel data lake](../geographical-availability-data-residency.md#regions-supported-for-microsoft-sentinel-data-lake) 

 
## Get started

To get started with Microsoft Sentinel data lake, follow these steps in the [onboarding guide](sentinel-lake-onboarding.md). 
For more information on using the Microsoft Sentinel data lake, see the following articles:
+ [Jupyter notebooks in the Microsoft Sentinel data lake (preview)](notebooks-overview.md).
+ [KQL and the Microsoft Sentinel data lake (preview)](kql-overview.md)
+ [Permissions for the Microsoft Sentinel data lake (preview)](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake-preview) 
+ [Manage data tiers and retention in Microsoft Defender Portal (preview)](https://aka.ms/manage-data-defender-portal-overview) 
+ [Manage and monitor costs for Microsoft Sentinel](../billing-monitor-costs.md)
