---
title: What is Enterprise Insights?
description: "Overview of Enterprise Insights for SAP data integration and analytics in Microsoft Fabric."
author: ritikesh-vali
ms.author: ritikeshvali
ms.service: enterprise-insights
ms.topic: overview
ms.date: 05/16/2025

#customer intent: As a data analyst or business professional, I want to understand the capabilities and architecture of Enterprise Insights so that I can leverage SAP data for advanced analytics in Microsoft Fabric.
---

# What is Enterprise Insights?

Enterprise Insights is a unified analytics solution built on a lakehouse-centric architecture within Microsoft Fabric, designed for organizations seeking to unlock the full value of their SAP data. This article provides an overview of Enterprise Insights, focusing on its capabilities for SAP data integration, transformation, and analytics within the Microsoft ecosystem.

## Introduction

In today's data-driven world, enterprises face the challenge of extracting strategic insights from distributed IT landscapes. Integrating SAP data is particularly complex, which can discourage unification with non-SAP data and result in missed opportunities for holistic business analysis.

Enterprise Insights addresses these challenges by enabling a unified data platform approach. By replicating and blending data from various systems into a single location, organizations can achieve end-to-end visibility and make informed, strategic decisions. 

SAP ERP and SAP S/4HANA are pivotal in controlling core processes across enterprises, and Enterprise Insights facilitates the modeling of SAP data within Microsoft Fabric using a lakehouse-centric analytics solution. This approach merges the scalability of data lakes with the structured capabilities of data warehouses, allowing organizations to leverage the latest technologies while preserving business context.

With Enterprise Insights, businesses can streamline analytics workflows, accelerate time-to-insight, and maintain a strategic edge by making decisions grounded in comprehensive, context-rich insights. The solution empowers organizations to break down data silos, regain unified visibility, and drive innovation through advanced analytics on SAP data.

![Enterprise Insights Introduction Diagram](ei-introduction.png)

## Solution Overview

![Solution Overview Diagram](ei-solution-overview.png)

Enterprise Insights provides a robust foundation for SAP data analysis through Microsoft Fabric. The solution encompasses all the tools and processes needed for extracting and transforming data, preparing it for in-depth analysis and reporting. It also includes a thorough examination of essential SAP data sources to ensure comprehensive coverage and insight.

The key features of the solution include:

- **Functional Insights** leverages Core Data Services (CDS) Views within SAP systems to enable efficient data modeling and extraction. For each supported functional area, a curated set of CDS Views is selected to form the foundation for analytical cubes and reporting. These chosen objects ensure that all essential business processes are covered and that the data model is both robust and relevant for analytics.
- **Data Warehouse Architecture** is built upon Microsoft Fabric, employing the medallion architecture using lakehouses. This approach combines the flexibility and scalability of data lakes with the structured querying capabilities of traditional data warehouses. By leveraging lakehouses, Enterprise Insights provides a robust platform that supports efficient data storage, management, and analysis, tailored to meet the dynamic needs of businesses handling SAP data.
- **Prebuilt Resources** include a suite of data extraction pipelines, dataflows, and Spark-based data transformation notebooks. These resources are designed to streamline the ETL process, ensuring efficient and reliable handling of data from its initial extraction through to its final transformation.
- **Power BI Templates** for key functional areas address the most frequently needed reports, such as Sales Overview or Financial Statements. These templates serve as practical examples for leveraging the Enterprise Insights data model and include advanced functionalities like hierarchical data structures and master data translations.
- **Comprehensive Documentation** is available for deploying and utilizing the Enterprise Insights platform. It covers everything from setup instructions and system requirements to detailed explanations of the data model and how to customize it for specific business needs.

## Reference Architecture

![Reference Architecture Diagram](ei-reference-architecture.png)

The reference architecture for Enterprise Insights follows these main stages:

- **Data Extraction** using Azure Data Factory or third-party solutions
- **Data Storage** in a Silver lakehouse (medallion architecture)
- **Data Processing** with Spark parallel processing to create optimized star schemas
- **Data Transformation** for hierarchies, currency conversion, and standardized reporting
- **Data Refinement** with movement to the Gold layer for analytics
- **Data Structuring** using star schemas with transactional (fact) tables, predefined dimensions, and translations
- **Performance Optimization** through surrogate and foreign keys for performance and reliability
- **Security Implementation** with built-in role templates for row-level security, customizable to organization structure
- **Data Consumption** through business applications for reporting and self-service analytics (Power BI, Azure ML, Fabric AI, Azure OpenAI, Power Platform)
- **Reporting Acceleration** with prebuilt Power BI templates for Finance, Sales and Distribution, and Procurement domains

### Architecture Overview

This architecture leverages Microsoft Fabric and OneLake storage to enable data transformation and analytics, ensuring SAP data can be efficiently used across the Microsoft ecosystem of products and services.

The process begins with data extraction using Azure Data Factory or a set of third-party solutions. Enterprise Insights provides a structured directory of SAP pre-selected objects covering key functional areas of SAP, including Finance, Sales and Distribution, and Procurement. Extracted data is stored in a Silver lakehouse, following the medallion architecture to ensure a scalable and structured data management approach.

Once ingested, data uses Spark parallel processing to create optimized star schemas for reporting. The transformation logic resolves common customer challenges such as:
- Reconstructing profit and cost center hierarchies in Power BI
- Unifying currency conversion processes to ensure consistent reporting based on standardized exchange rates

Following transformation, the refined data is moved to the Gold layer, designed for analytical consumption. Each star schema consists of a transactional (fact) table surrounded by predefined dimensions and translations. Enterprise Insights enhances performance and reliability of reporting processes by introducing surrogate and foreign keys to replace business keys commonly used in SAP systems. 

Built-in role templates use organization levels such as company code and purchasing areas to enforce row-level security, which can be customized to align with an organization's structure.

### Data Consumption

The processed data is exposed to various business applications for reporting and self-service analytics:
- Users can leverage insights and create interactive dashboards through Power BI
- Advanced predictive analysis and machine learning models using Azure ML, Fabric AI Skills, and Azure OpenAI
- Low-code and no-code integrations through Power Platform
- A baseline for partners to develop specialized solutions in areas such as financial planning and analysis

To accelerate insights generation, Enterprise Insights includes prebuilt Power BI templates for Finance, Sales and Distribution, and Procurement domains. While these templates provide a general framework, organizations may need to customize them to align with specific metrics and goals. They serve as a valuable starting point for KPI definition and visualization, offering a blueprint for leveraging Enterprise Insights to drive advanced reporting on SAP data.

## Related content

- [Enterprise Insights Deployment Guide](deployment-guide.md): Step-by-step setup instructions.