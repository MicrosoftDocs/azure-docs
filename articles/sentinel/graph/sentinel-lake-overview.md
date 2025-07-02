---  
title: Microsoft Sentinel data lake overview(preview).
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


# What is Microsoft Sentinel data lake (preview)?

Microsoft Sentinel data lake is a purpose-built, cloud-native security data lake that transforms how organizations manage and analyze security data. Architected as a true data lake, it is designed to ingest, store, and analyze large volumes of diverse security data at scale. By centralizing all your security data into a single, open, and extensible platform, it delivers deep visibility, long-term retention, and advanced analytics.  
  
Microsoft Sentinel data lake makes it cost-effective to bring all your security data into the Microsoft Sentinel SIEM, eliminating the need to choose between coverage and cost. Retain more data for longer, detect threats with greater context and historical depth, and respond faster, without compromising on security.  

The Microsoft Sentinel data lake is fully managed, without the need to deploy or maintain your data infrastructure. It provides a unified data platform for end-to-end threat analysis and response. 

Traditional SIEM solutions struggle with the cost and complexity of storing and querying long-term data. Microsoft Sentinel data lake addresses these challenges in the following ways:

+ Unifying security data across Microsoft Defender, XDR, and third-party sources.
+ Reducing costs through tiered storage and on-demand data promotion.
+ Enabling deep investigations with up to 12 years of searchable logs and telemetry.
+ Powering AI and automation for faster detection and response.

As a single data source, Microsoft Sentinel data lake empowers you to run queries in KQL and conduct forensic investigations in Jupyter notebooks using sophisticated python libraries to build machine learning models.

## Architecture

Microsoft Sentinel data lake, built on Azure's scalable infrastructure, facilitates centralized ingestion, analysis, and action across diverse data sources. 
The Microsoft Sentinel data lake technical architecture includes the following key benefits: 
+ Single, open-format data copy for efficient and cost-effective storage 
+ Separation of storage and compute for greater flexibility 
+ Support for multiple analytics engines to unlock insights from your security data 
+ Native integration with Microsoft Sentinel,

### Storage Tiers

The Microsoft Sentinel data lake is designed with two distinct storage tiers to optimize cost and performance:

+ Analytics tier: The existing Microsoft Sentinel data tier enabling advanced querying, visualization, and alerting capabilities to help you proactively identify and resolve issues across your infrastructure and applications. 
+ Data lake tier: A centralized security data lake offering long-term data storage for querying and python-based advanced analytics. The data lake tier is designed for cost-effective storage of large volumes of security data, enabling you to retain data for up to 12 years. For more information on data tiers and retention, see [Manage data tiers and retention in Microsoft Defender Portal (preview)](https://aka.ms/manage-data-defender-portal-overview).


### Integration
Microsoft Sentinel data lake is an integrated extension of Microsoft Sentinel, providing a unified platform for security operations. It integrates with Microsoft Sentinel's advanced hunting, incident management, and alerting capabilities, enabling security teams to leverage the full power of the data lake for threat detection and response. Once onboarded, all of your Microsoft Sentinel data is mirrored in the data lake. Data retention is centrally managed though the Defender portal, giving you the flexibility to control how long you retain your data in each storage tier.

:::image type="content" source="media/sentinel-lake-overview/sentinel-lake-overview.png" lightbox="media/sentinel-lake-overview/sentinel-lake-overview.png" alt-text="A diagram showing the Microsoft Sentinel data lake data architecture.":::

### Supported Data Sources

Microsoft Sentinel data lake supports a wide range of data sources, including:
+ All Microsoft Defender and Microsoft Sentinel data sources
+ Microsoft 365
+ Microsoft Entra ID
+ Microsoft Resource Graph
+ Endpoint Detection and Response (EDR) platforms
+ Firewall and network logs
+ Cloud infrastructure and workload telemetry
+ Identity and access logs (Microsoft Entra, Okta, etc.)
+ DNS, proxy, and email telemetry

## Analysis and modeling

The Microsoft Sentinel data lake supports advanced analytics and machine learning capabilities, enabling security teams to build sophisticated models for threat detection and response. The data lake provides a unified platform for running KQL queries, Python-based analysis, and machine learning models, allowing security teams to leverage the full power of their security data.

### Flexible querying with Kusto Query Language

The Data lake exploration Kusto Query Language (KQL) queries allow you to write and run KQL queries against your data lake resources. You can use the query editor to explore your data, analyze your data lake resources, and create jobs to promote data from the lake tier to the analytics tier.
KQL queries offer the following key features:

+ KQL Query Editor: Provides editing and running KQL queries with IntelliSense and autocomplete.
+ Full support for KQL: Use the full range of KQL capabilities, including machine learning functions and advanced analytics.
+ Job Creation: Create one-time or scheduled jobs to promote data from the lake to the analytics tier.

For more information, see [KQL and the Microsoft Sentinel data lake (preview)](https://aka.ms/kql-overview)

### Powerful analytics using Jupyter notebooks

Jupyter notebooks in the Microsoft Sentinel data lake provide a powerful environment for data analysis and machine learning. Use Python libraries to build and run machine learning models, conduct advanced analytics, and visualize your data. The notebooks support rich visualizations, enabling you to gain insights from your security data. Schedule notebooks to summarize data, run machine learning models, and promote data from the lake tier to the analytics tier.

For more information, see [Jupyter notebooks in the Microsoft Sentinel data lake (preview)](https://aka.ms/notebooks-overview).

:::image type="content" source="media/sentinel-lake-overview/notebook.png" lightbox="media/sentinel-lake-overview/notebook.png" alt-text="A screenshot showing a Jupyter notebook."::: 

### Activity Audit
The Microsoft Sentinel data lake provides audit functionality that tracks activities performed in the data lake. The audit log captures events related to data access, job management, and queries, enabling you to monitor and investigate activities in the data lake.

Some of the activities audited are: 
+ Accessing data in lake via KQL queries
+ Running notebooks on data lake
+ Create, edit, run, and delete jobs 

Auditing is automatically turned on for Microsoft Sentinel data lake. Features that are audited are logged in the audit log automatically. 
For more information on audited data lake activities,  see [Search the audit log for events in Microsoft Defender XDR](/defender-xdr/microsoft-xdr-auditing)


## Get started

To get started with Microsoft Sentinel data lake, follow these steps in the [onboarding guide](https://aka.ms/sentinel-lake-onboarding). 
For more information on using the Microsoft Sentinel data lake, see the following articles:
+ [Jupyter notebooks in the Microsoft Sentinel data lake (preview)](https://aka.ms/notebooks-overview).
+ [KQL and the Microsoft Sentinel data lake (preview)](https://aka.ms/kql-overview)
+ [Permissions for the Microsoft Sentinel data lake (preview)](https://aka.ms/sentinel-data-lake-roles) 
+ [Manage data tiers and retention in Microsoft Defender Portal (preview)](https://aka.ms/manage-data-defender-portal-overview) 