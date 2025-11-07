---
title: What is Business Process Solutions?
description: Introduction to Business Process Solutions.
author: momakhij
ms.service: sap-on-azure
ms.subservice: business-process-solutions
ms.topic: overview
ms.custom: subject-monitoring
ms.date: 11/07/2024
ms.author: momakhij
---

# Introduction to Business Process Solutions

Business Process Solutions accelerates enterprise data analytics and de-risks AI adoption by providing prebuilt resources, including data models, transformations, and business templates. This article introduces the solution and outlines how it enables organisations to unify business data across various systems and functional areas.

In AI driven enterprises access to reliable business information is critical for success. Whether AI augmented or fully autonomous, agentic solutions require trusted consistent information to drive successful outcomes. In many organizations data fragmentation across best of breed applications complicates the realization of agentic solutions. This fragmentation not only reduces visibility into processes which span multiple applications but also significantly complicates AI automation. To accelerate adoption and derisk AI adoption, organizations require a unified, trusted data set as a foundation for their AI transformation.

# Key capabilities

Business Process Solutions delivers a suite of capabilities designed to unify and enhance enterprise data across previously siloed environments. It enables organisations to discover business insights by integrating data from disparate systems, providing a holistic view of operations. The solution features prebuilt data models tailored for enterprise business applications, ready to consume within Microsoft Fabric, ensuring robust and scalable analytics. Provided data extraction and transformation processes ensure that source data is correctly extracted and transformed, facilitating efficient and reliable data handling from initial capture to final analytics-ready form.

To further accelerate value, Business Process Solutions includes a library of business templates - ready-made analytics assets such as dashboards, reports, and AI agents. These templates address common functional scenarios, enabling rapid deployment of insights and automation across areas like finance, sales, and procurement, while reducing the time and effort required to build solutions from scratch.

Data models, extraction and transformation processes, supplemented with analytics assets, form a robust foundation for enterprise analytics, enabling organisations to rapidly demonstrate value. At the same time, the solution’s open architecture allows customers to tailor the platform to their own requirements, whether by integrating custom data sources or adjusting processes, ensuring the flexibility needed to address the unique needs of every business.

# Functional Insights and Business Templates

At the functional level, Business Process Solutions leverage application-native data models to simplify data extraction and integration.

Figure 1: Functional scope of Business Process Solutions

Business Process Solutions (Public Preview) currently support a set of business applications and functional areas, enabling organizations to break down silos and drive actionable insights across their core processes. The platform covers key domains such as:

1. **Finance**: Delivers a comprehensive view of financial performance, integrating data from key finance areas including general ledger, assets, accounts receivable, and accounts payable. Prebuilt dashboards provide out-of-the-box financial statements, account balances, and profitability reports, giving organisations a complete picture of financial health. The Copilot Agent in Business Process Solutions provides not only access to this data via natural language but will also enable financial postings.

2. **Sales**: Provides a complete perspective on the customer opportunity-to-cash journey, from initial opportunity through delivery, invoicing and payments. The Copilot agent can help improve revenue forecasting by connecting structured ERP and CRM data with unstructured data from Microsoft 365, also tracking sales pipeline health and identifying bottlenecks.

3. **Procurement**: Supports strategic procurement and supplier management, consolidating purchase orders, goods receipts, and vendor invoicing data. This empowers procurement teams to optimize sourcing strategies, manage supplier risk, and control spend.

4. **Manufacturing**: (coming soon): Will extend coverage to manufacturing and production processes, providing end-to-end visibility across the entire production cycle, from order creation and operation planning to material consumption and execution confirmations

Each scope item within Business Process Solutions is delivered as a complete, business-ready solution. They reflect the operational logic of the functional domain and business application. Business Process Solutions define the precise data sets required for each functional area, specifying both the systems of record to source from and the integration patterns to apply. This includes detailed guidance on how data should be extracted, normalized, and transformed – while understanding business semantics - so that it can be reliably aggregated and analyzed across functions. For example, financial reports such as the Balance Sheet often rely on complex hierarchies, and Business Process Solutions ensure these can be retrieved from the source system, transformed appropriately, and visualized in Power BI. In procurement, where transactions often involve multiple currencies, Business Process Solutions source exchange rates and applies consistent conversions, enabling dashboards to consolidate values into a single currency.

Customers will be able to leverage prebuild Copilot Agents to turn insight into action. These agents are deeply integrated not only with Microsoft Fabric, but also other connected systems, enabling users to take direct, contextual actions executing informed transactions within attached source systems based on these insights. By connecting unstructured data sources such as emails, chats, and documents from Microsoft 365, the agents can provide a holistic and contextualized view to support smarter decisions. With embedded triggers and intelligent agents, automated responses could be initiated based on new insights -- streamlining decision-making and enabling proactive, data-driven financial operations. Ultimately, this will empower teams not just to understand what is happening on a wholistic level, but to act on it -- faster, smarter, and with greater confidence.

# Data Foundation

The data warehouse layer is built on Microsoft Fabric, following the medallion architecture based on OneLake.

Figure 3: Data foundation in Business Process Solutions

Data foundation in Project Sage

The Bronze layer is where data first enters the platform. The Bronze layer is optional, and its presence and format depend on the source system and data integration method. Within the Bronze layer, the data is recorded “as-is,” with minimal or no transformation, ensuring that nothing is lost from the original source.

From there, the data moves into the Silver layer, which integrates information from multiple systems into a single lakehouse. At this point, all data changes—such as inserts, updates, and deletes—are applied, together with any required data mappings and data type adjustments, ensuring that the Silver layer always holds consistent and up-to-date data. When integrating data through Azure Data Factory, the Silver layer serves as the main ingestion area, as Business Process Solutions reuse the capabilities of the SAP CDC connector to maintain data consistency.

As data progresses into the Gold layer, it is shaped into business-ready models designed for reporting and analytics. In this layer, information is organized into star schemas, where transactional facts such as sales or procurement data are linked to descriptive dimensions like customers, products, or suppliers. We provide processes to simplify common tasks such as re-using source system hierarchies and implementing currency conversion, making it easier for teams to maintain accuracy and efficiency. We add aggregations to improve performance and provide optional authorization structures.

# Data Extraction

Business Process Solutions use the same connectivity options as Microsoft Fabric and Azure Data Factory, but goes further by embedding best practices that make integration simpler and more effective. We also understand that many businesses have already invested in data extraction tools, which is why Business Process Solutions support a wide range of options, from native connectivity to third-party options that bring specialized capabilities to the table. The solution automatically deploys necessary objects to establish the connection to the source system and extract data.

Figure 3: Data extraction options

Business Process Solutions offers integration with following source systems:

## SAP S/4HANA (Public Preview)

Business Process Solutions supports integration with SAP S/4HANA, enabling organisations to extract and process data from core system for downstream analytics and reporting. This integration is designed to accommodate different technical preferences and existing investments, ensuring flexibility in how data is accessed and moved.

Supported releases: SAP S/4HANA 1909 and newer

### Azure Data Factory

For organisations already familiar with Azure Data Factory, the existing workflows can continue without disruption. Business Process Solutions provides pre-built templates that simplify connectivity to SAP S/4HANA and streamline the extraction process. These templates reduce the need for custom development and help maintain consistency in data pipelines.

### ABAP Mirroring (coming soon)

ABAP Mirroring provides a direct integration path from SAP systems without the need for traditional ETL processes. It uses an ABAP add-on deployed on the SAP application server to replicate selected CDS views into a mirrored database, which then serves as the source for subsequent processing within Business Process Solutions. This approach reduces complexity, ensures compliance with SAP standards, and offers a lightweight method for integrating SAP data into Microsoft Fabric for analytics and reporting.

### Microsoft Partner Solutions

For organisations with highly specialised requirements or extremely large-scale extraction scenarios, Microsoft Partner solutions can provide additional capabilities. They often include advanced delta extraction features, support for complex transformations, and tailored performance tuning.  Partner offerings can be useful when customers need bespoke configurations or extended services beyond the standard templates provided by Business Process Solutions.

For organisations with highly specialised requirements or extremely large-scale extraction scenarios, Microsoft Partner solutions can provide additional capabilities. They often include advanced delta extraction features, support for complex transformations, and tailored performance tuning.  Partner offerings can be useful when customers need bespoke configurations or extended services beyond the standard templates provided by Business Process Solutions.

### SAP Datasphere with Fabric Mirroring

Another option is to use SAP Datasphere as the primary extraction layer. This approach allows organisations to take advantage of SAP-native integration features while maintaining compatibility with modern analytics platforms.

## SAP ECC (Private Preview)

Customers who have not yet migrated their SAP environment to SAP S/4HANA can still leverage Business Process Solutions for data analytics. The prebuilt processing is adjusted to work with SAP ECC systems enabling extraction of key business data.

Supported releases: SAP ECC 6.0

### ABAP Mirroring (coming soon)

ABAP Mirroring can be used to create a direct integration path from SAP ECC into Microsoft Fabric. In this configuration the ABAP add-on installed on the source system replicates required tables into a mirrored database, which is then used in downstream processing.

### Microsoft Partner Solutions

Microsoft Partners play an important role in SAP ECC integration due to their specialised data extraction capabilities and advanced delta handling at the table level. These solutions are designed to optimise performance and support complex extraction scenarios that go beyond standard configurations. In addition, partners often provide a broader set of data models tailored specifically for ECC environments, offering flexibility and customisation options that extend beyond the standard packages delivered by Business Process Solutions.

## Salesforce (Private Preview)

### Microsoft Fabric Pipelines

Business Process Solutions supports connectivity to Salesforce through the Salesforce connector available in Microsoft Fabric. During the system onboarding the solution automatically deploys all required pipelines required to efficiently extract required Salesforce data. The approach simplifies integration by leveraging native capabilities, reducing complexity and accelerating time-to-insight.

# Next Steps

Business Process Solutions provide a unified approach to integrating, transforming, and analysing enterprise data, enabling organisations to break down silos and drive actionable insights across core business functions. By leveraging robust data models and prebuilt business content, teams can accelerate their AI transformation and make more informed decisions. To deepen your understanding and unlock the full potential of these solutions, explore further resources on available Data Models and Business Templates, which form the foundation for scalable, intelligent business processes.