---
title: Azure Synapse Analytics security white paper
description: Overview of the Azure Synapse Analytics security white paper series of articles.
author: peter-myers
ms.author: v-petermyers
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: overview
ms.date: 01/14/2022
---

# Azure Synapse Analytics security white paper: Introduction

**Summary:** [Azure Synapse Analytics](https://azure.microsoft.com/services/synapse-analytics/) is a Microsoft limitless analytics platform that integrates enterprise data warehousing and big data processing into a single managed environment with no system integration required. Azure Synapse provides the end-to-end tools for your analytic life cycle with:

- [Pipelines](../../data-factory/concepts-pipelines-activities.md?context=/azure/synapse-analytics/context/context&amp;tabs=synapse-analytics) for data integration.
- [Apache Spark pool](../spark/apache-spark-overview.md) for big data processing.
- [Data Explorer](../data-explorer/data-explorer-overview.md) for log and time series analytics.
- [Serverless SQL pool](../sql/on-demand-workspace-overview.md) for data exploration over [Azure Data Lake](https://azure.microsoft.com/solutions/data-lake/).
- [Dedicated SQL pool](../sql-data-warehouse/sql-data-warehouse-overview-what-is.md?context=/azure/synapse-analytics/context/context) (formerly SQL DW) for enterprise data warehousing.
- Deep integration with [Power BI](https://powerbi.microsoft.com/), [Azure Cosmos DB](../../cosmos-db/synapse-link.md?context=/azure/synapse-analytics/context/context), and [Azure Machine Learning](../machine-learning/what-is-machine-learning.md).

Azure Synapse data security and privacy are non-negotiable. The purpose of this white paper, then, is to provide a comprehensive overview of Azure Synapse security features, which are enterprise-grade and industry-leading. The white paper comprises a series of articles that cover the following five layers of security:

- Data protection
- Access control
- Authentication
- Network security
- Threat protection

This white paper targets all enterprise security stakeholders. They include security administrators, network administrations, Azure administrators, workspace administrators, and database administrators.

**Writers:** Vengatesh Parasuraman, Fretz Nuson, Ron Dunn, Khendr'a Reid, John Hoang, Nithesh Krishnappa, Mykola Kovalenko, Brad Schacht, Pedro Matinez, and Mark Pryce-Maher.

**Technical Reviewers:** Nandita Valsan, Rony Thomas, Daniel Crawford, and Tammy Richter Jones.

**Applies to:** Azure Synapse Analytics, dedicated SQL pool (formerly SQL DW), serverless SQL pool, and Apache Spark pool.

> [!IMPORTANT]
> This white paper does not apply to Azure SQL Database, Azure SQL Managed Instance, Azure Machine Learning, or Azure Databricks.

## Introduction

Frequent headlines of data breaches, malware infections, and malicious code injection are among an extensive list of security concerns for companies looking to cloud modernization. The enterprise customer requires a cloud provider or service solution that can address their concerns as they can't afford to get it wrong.

Some common security questions include:

- How can I control who can see what data?
- What are the options for verifying a user's identity?
- How is my data protected?
- What network security technology can I use to protect the integrity, confidentiality, and access of my networks and data?
- What are the tools that detect and notify me of threats?

The purpose of this white paper is to provide answers to these common security questions, and many others.

## Security layers

Azure Synapse implements a multi-layered security architecture for end-to-end protection of your data. There are five layers:

- [**Data protection**](security-white-paper-data-protection.md) to identify and classify sensitive data, and encrypt data at rest and in motion.
- [**Access control**](security-white-paper-access-control.md) to determine a user's right to interact with data.
- [**Authentication**](security-white-paper-authentication.md) to prove the identity of users and applications.
- [**Network security**](security-white-paper-network-security.md) to isolate network traffic with private endpoints and virtual private networks.
- [**Threat protection**](security-white-paper-threat-protection.md) to identify potential security threats, such as unusual access locations, SQL injection attacks, authentication attacks, and more.

:::image type="content" source="media/security-white-paper-overview/azure-synapse-security-layers.png" alt-text="Image shows the five layers of Azure Synapse security architecture: Data protection, Access control, Authentication, Network security, and Threat protection.":::

## Next steps

In the [next article](security-white-paper-data-protection.md) in this white paper series, learn about data protection.
