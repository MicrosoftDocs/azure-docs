---  
title: Microsoft Sentinel data lake overview
titleSuffix: Microsoft Security  
description: An overview of Microsoft Sentinel data lake, a cloud-native platform that extends Microsoft Sentinel with highly scalable, cost-effective long-term storage, advanced analytics, and AI-driven security operations.
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.subservice: sentinel-graph
ms.topic: conceptual
ms.custom: references_regions
ms.date: 08/11/2025
ms.author: edbaynash  

ms.collection: ms-security  
---  

# What is Microsoft Sentinel data lake?

Microsoft Sentinel data lake is a purpose-built, cloud-native security data lake that transforms how organizations manage and analyze security data. Designed as a true data lake, it ingests, stores, and analyzes large volumes of diverse security data at scale. By centralizing security data into a single, open-format, extensible platform, it provides deep visibility, long-term retention, and advanced analytics.

The data lake lets you bring all your security data into Microsoft Sentinel cost-effectively, removing the need to choose between coverage and cost. You can retain more data for longer, detect threats with greater context and historical depth, and respond faster without compromising security.  

The Microsoft Sentinel data lake is fully managed, so you don't need to deploy or maintain data infrastructure. It provides a unified data platform for end-to-end threat analysis and response. It stores a single copy of security data across assets, activity logs, and threat intelligence in the lake and leverages multiple analytics tools like KQL and Jupyter notebooks for deep security analytics.

Traditional SIEM solutions struggle with the cost and complexity of storing and querying long-term security data. Microsoft Sentinel data lake solves these challenges in the following ways:

+ Unifying security data across Microsoft Defender XDR, third-party sources and assets, activity logs, and threat intelligence
+ Optimizing costs with tiered storage, on-demand data promotion, and a single copy of the data
+ Enabling deep security insights with up to 12 years of security data and telemetry you can query and analyze
+ Powering AI and automation for faster detection and response.

With a single copy of data, use KQL to run queries and Jupyter notebooks with sophisticated Python libraries and machine learning tools to conduct deeper analysis for forensics, incidence response, and anomaly detection.

## Architecture

Microsoft Sentinel data lake, built on Azure's scalable infrastructure, facilitates centralized ingestion, analysis, and action across diverse data sources. The Microsoft Sentinel data lake technical architecture includes the following key benefits: 

+ Open format Parquet data files for interoperability and extensibility
+ Single copy of data for efficient and cost effective storage
+ Separation of storage and compute for greater flexibility
+ Support for multiple analytics engines to unlock insights from your security data
+ Native integration with Microsoft Sentinel SIEM and its security operations workflows

### Storage tiers

Microsoft Sentinel is designed with two distinct storage tiers to optimize cost and performance:

+ Analytics tier: The existing Microsoft Sentinel data tier supporting advanced hunting, alerting, and incident management to help you proactively identify and resolve issues across your infrastructure and applications. This tier is designed for high-performance analytics and real-time data processing.
+ Data lake tier: Provides centralized long-term storage for querying and Python-based advanced analytics. It's designed for cost effective retention of large volumes of security data for up to 12 years. Data in the analytics tier is mirrored to the lake tier, preserving a single copy of the data. 
  
For more information on data tiers and retention, see [Manage data tiers and retention in Microsoft Defender portal](https://aka.ms/manage-data-defender-portal-overview).


### Supported data sources

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

Data lake exploration Kusto Query Language (KQL) queries let you write and run queries against data lake resources. Use the query editor to explore data, analyze the lake, and create jobs that promote data from the data lake tier to the analytics tier.
KQL queries offer the following key features:

+ KQL query editor: Provides editing and running KQL queries with IntelliSense and autocomplete.
+ Full support for KQL: Use the full range of KQL capabilities, including machine learning functions and advanced analytics.
+ Job creation: Create one-time or scheduled jobs to promote data from the lake to the analytics tier.

For more information, see [KQL and the Microsoft Sentinel data lake](kql-overview.md).

:::image type="content" source="media/sentinel-lake-overview/data-lake-exploration.png" lightbox="media/sentinel-lake-overview/data-lake-exploration.png" alt-text="Screenshot of the KQL query editor in the Microsoft Sentinel data lake.":::

### Powerful analytics using Jupyter notebooks

Jupyter notebooks in the Microsoft Sentinel data lake offer a powerful environment for data analysis and machine learning. Use Python libraries to build and run machine learning models, conduct advanced analytics, and visualize your data. The notebooks support rich visualizations, enabling you to gain insights from your security data. Schedule notebooks to summarize data regularly, run machine learning models, and promote data from the data lake tier to the analytics tier.

For more information, see [Jupyter notebooks in the Microsoft Sentinel data lake](notebooks-overview.md).

:::image type="content" source="media/sentinel-lake-overview/notebook.png" lightbox="media/sentinel-lake-overview/notebook.png" alt-text="Screenshot of a Jupyter notebook showing data analysis and visualization."::: 

### Activity audit
The Microsoft Sentinel data lake provides auditing that tracks activities in the lake. The audit log captures data access, job management, and query events, letting you monitor and investigate activity.

Some of the activities audited are: 
+ Accessing data in lake with KQL queries
+ Running notebooks on data lake
+ Create, edit, run, and delete jobs 

Auditing is enabled by default for the Microsoft Sentinel data lake. Audited actions are shown in the audit log. 
 
For more information on audited data lake activities, see [Audit log for Microsoft Sentinel data lake](./auditing-lake-activities.md).

## Supported regions

See [Regions supported for Microsoft Sentinel data lake](../geographical-availability-data-residency.md#supported-regions) for supported regions.
 

 
## Get started

To get started with Microsoft Sentinel data lake, follow these steps in the [onboarding guide](sentinel-lake-onboarding.md). 
For more information on using the Microsoft Sentinel data lake, see the following articles:
+ [Jupyter notebooks in the Microsoft Sentinel data lake](notebooks-overview.md).
+ [KQL and the Microsoft Sentinel data lake](kql-overview.md)
+ [Permissions for the Microsoft Sentinel data lake](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake) 
+ [Manage data tiers and retention in Microsoft Defender Portal](https://aka.ms/manage-data-defender-portal-overview) 
+ [Manage and monitor costs for Microsoft Sentinel](../billing-monitor-costs.md)
