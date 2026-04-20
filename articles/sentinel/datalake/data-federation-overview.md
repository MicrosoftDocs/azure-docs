---
title: Data federation overview in Microsoft Sentinel data lake
titleSuffix: Microsoft Security
description: Learn how data federation in Microsoft Sentinel data lake enables seamless querying of external data sources including Azure Databricks, ADLS Gen 2, and Microsoft Fabric.
author: EdB-MSFT
ms.service: microsoft-sentinel
ms.subservice: sentinel-platform
ms.topic: concept-article
ms.date: 03/29/2026
ms.author: edbaynash
ms.collection: ms-security

#Customer intent: As a security analyst or administrator, I want to understand data federation capabilities in Microsoft Sentinel data lake so that I can query external data sources alongside my security data.
---

# Data federation overview in Microsoft Sentinel data lake

Data federation in Microsoft Sentinel enables seamless querying of multiple external data sources from within the Microsoft Sentinel data lake environment. By federating data sources such as Azure Databricks, Azure Data Lake Storage (ADLS) Gen 2, and Microsoft Fabric, organizations can enhance their security analytics and operational insights without moving or duplicating data.

## What is data federation?

Data federation allows you to query external data sources directly from the Microsoft Sentinel data lake using Kusto Query Language (KQL) or Jupyter notebooks using the Microsoft Sentinel Visual Studio Code extension. Instead of ingesting the data into Sentinel, federation creates connections to external data stores, enabling:

- **Unified analytics**: Query federated sources alongside native Microsoft Sentinel data lake tables.
- **Preserve governance and compliance controls**: Maintain data security and compliance by querying data in place without moving it.
- **Enhanced insights**: Combine security data with business data, logs, or other datasets stored in external systems.
- **Flexible data access**: Access historical or specialized datasets that complement your security operations.

> [!IMPORTANT]
> Data federation is one-directional from the Sentinel data lake to the federated target. You can query a federated source from the data lake, but you can't access the data lake from a federated source.

## Available federation sources

The following federation sources are available:

| Source | Description |
|--------|-------------|
| **Azure Databricks** | Connect to Databricks Unity Catalog tables and query data from Sentinel. |
| **Azure Data Lake Storage Gen 2** | Query data stored in ADLS Gen 2 storage accounts directly from the Sentinel data lake. |
| **Microsoft Fabric** | Connect to Microsoft Fabric Lakehouse tables for integrated analytics. |

## Key concepts

### Federated connections

A federated connection is a configured link between the Sentinel data lake and an external data source. Each connection specifies:

- The target data source (Databricks, ADLS Gen 2, or Fabric).
- Authentication credentials stored securely in Azure Key Vault for ADLS and Azure Databricks.
- The specific tables to federate.

### Federated tables

Federated tables are tables that come from a federated connection. Federated tables appear in the Sentinel data lake **Table Management** page and can be queried like native tables. Federated table names follow the pattern `<tableName>_<connectorInstanceName>`. For example, if your connector instance is named `ADLS01` and you federate with a table named `widgets`, the federated table name is `widgets_ADLS01`.

### Connector instances

Each configured connection to an external data source is called a connector instance. You can create multiple instances for the same federation source type, each connecting to different external resources.

## Prerequisites

Before setting up data federation, ensure you meet the following requirements:

- Sentinel data lake onboarding: Your tenant must be onboarded to the Sentinel data lake. For more information, see [Onboard to Microsoft Sentinel data lake](./sentinel-lake-onboard-defender.md).
- Public accessibility: The external source must be publicly accessible. Private endpoints aren't supported currently. 
- Service principal: A service principal with appropriate permissions in the data source you want to connect with is required for Azure Databricks and Azure Data Lake Storage Gen2 sources.
- Azure Key Vault: An Azure Key Vault to store authentication secrets for the service principal. You need to configure permissions for Microsoft Sentinel managed identity to read secrets from the key vault.


## How federation works

1. **Configure authentication**: Create a service principal and store its credentials in Azure Key Vault.
2. **Create a federated connection**: Use the Data connectors page in Microsoft Sentinel to create a connector instance for your chosen data federation source.
3. **Select tables**: Choose which tables from the external source to federate.
4. **Query federated data**: Use data lake experiences such as KQL queries, Notebooks, or MCP tools to access federated tables alongside native Sentinel data. 

## Common scenarios for data federation 

Data federation lets you access data that resides outside of the data lake. This is especially valuable in the following scenarios:

+ Data sources that are operationalized across multiple teams and systems.

+ Years of historical data that you want to naturally age out and isn't cost effective to ingest.

+ Regional or compliance regulations that constrain data from being copied.

+ Data that isn't frequently accessed and is only contextually relevant in limited scenarios. 

## Benefits of data federation

### Unified security analytics

Combine security event data in Sentinel with context from external sources, such as:

- Analytics outputs from Databricks
- Historical logs stored in ADLS Gen 2
- Business application data from Microsoft Fabric

### Operational flexibility

- Access data across organizational boundaries
- Integrate data from different teams or business units
- Support complex investigations that span multiple data sources

## Limitations
- Data sources must be publicly accessible. Private endpoints aren't supported.
- Azure Key Vault networking needs to be set for **Allow public access from all networks**, which is the default for Key Vault, during configuration of ADLS or Azure Databricks connection instances. Once you complete creating or editing a connection, the associated Key Vault can have a different networking setting configured.
- Federated connections to Microsoft Fabric support schema-enabled lakehouses, where workspaces aren't enabled for outbound access protection.
- Data federation is read-only; you can't write data back to federated sources.
- Query performance depends on the external source's responsiveness and data volume.
- Federated connections to a Fabric source can have a maximum of 100 tables within the connection instance.
- You can have a maximum of 100 connector instances. Azure Databricks and ADLS use one connector instance per federated connection. Microsoft Fabric uses one connector instance per lakehouse schema in a federated connection.


## Next steps

- [Set up federated data connectors](data-federation-setup.md)
- [Use federated data sources in Microsoft Sentinel](using-data-federation.md)
- [Query federated tables with KQL](kql-jobs-summary-rules-search-jobs.md)
