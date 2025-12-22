---
title: Introduction to Business Process Solutions (Public Preview)
description: Learn how to use Business Process Solutions to enable organizations in unifying business data across different systems and functional areas.
author: mohitmakhija1
ms.service: sap-on-azure
ms.subservice:
ms.topic: overview
ms.custom: subject-monitoring
ms.date: 11/07/2025
ms.author: momakhij
---

# Introduction to Business Process Solutions (Public Preview)

Business Process Solutions accelerates enterprise data analytics and derisks AI adoption by providing prebuilt resources, including data models, transformations, and business templates. This article introduces the solution and outlines how it enables organizations to unify business data across various systems and functional areas.

In AI driven enterprises, access to reliable business information is critical for success. Whether AI augmented or fully autonomous, agentic solutions require trusted consistent information to drive successful outcomes. In many organizations, data fragmentation across best of breed applications complicates the realization of agentic solutions. This fragmentation not only reduces visibility into processes, which span multiple applications but also significantly complicates AI automation. To accelerate adoption and derisk AI adoption, organizations require a unified, trusted data set as a foundation for their AI transformation.

## Key capabilities

Business Process Solutions delivers a suite of capabilities designed to unify and enhance enterprise data across previously siloed environments. It enables organizations to discover business insights by integrating data from disparate systems, providing a holistic view of operations. The solution features prebuilt data models tailored for enterprise business applications, ready to consume within Microsoft Fabric, ensuring robust and scalable analytics. Our data extraction and transformation processes ensure that source data is accurately extracted and converted. This enables efficient and reliable data handling from initial capture to final analysis.

To further accelerate value, Business Process Solutions includes a library of business templates - ready-made analytics assets such as dashboards, reports, and AI agents. These templates help teams quickly gain insights and automate processes in finance, sales, and procurement. They reduce the time and effort needed to build solutions from scratch.

Data models, extraction and transformation processes, supplemented with analytics assets, form a robust foundation for enterprise analytics, enabling organizations to rapidly demonstrate value. The solution’s open architecture lets customers tailor the platform to their needs. They can integrate their own data sources or adjust existing processes, giving them the flexibility to meet unique business requirements.

## Functional insights and business templates

At the functional level, Business Process Solutions use application-native data models to simplify data extraction and integration.

:::image type="content" source="./media/about-business-process-solutions/enterprise-data.png" alt-text="Diagram that shows Functional insights and available business templates for business process solutions." lightbox="./media/about-business-process-solutions/enterprise-data.png":::

Business Process Solutions (Public Preview) currently support a set of business applications and functional areas, enabling organizations to break down silos and drive actionable insights across their core processes. The platform covers the following key domains:

- **Finance**: Delivers a comprehensive view of financial performance, integrating data from key finance areas including general ledger, assets, accounts receivable, and accounts payable. Prebuilt dashboards provide out-of-the-box financial statements, account balances, and profitability reports, giving organizations a complete picture of financial health. The Copilot Agent in Business Process Solutions provides access to data using natural language and enables users to perform financial postings.

- **Sales**: Provides a complete perspective on the customer opportunity-to-cash journey, from initial opportunity through delivery, invoicing and payments. The Copilot agent can help improve revenue forecasting by connecting structured ERP and CRM data with unstructured data from Microsoft 365, also tracking sales pipeline health and identifying bottlenecks.

- **Procurement**: Supports strategic procurement and supplier management, consolidating purchase orders, goods receipts, and vendor invoicing data. This domain empowers procurement teams to optimize sourcing strategies, manage supplier risk, and control spend.

Each scope item within Business Process Solutions is delivered as a complete, business-ready solution. They reflect the operational logic of the functional domain and business application. Business Process Solutions define the precise data sets required for each functional area, specifying both the systems of record to source from and the integration patterns to apply. This includes detailed guidance on how data should be extracted, normalized, and transformed – while understanding business semantics - so that it can be reliably aggregated and analyzed across functions. For example, financial reports such as the Balance Sheet often depend on complex hierarchies. Business Process Solutions retrieves these hierarchies from the source system, applies the necessary transformations, and visualizes the results in Power BI. In procurement, where transactions often involve multiple currencies, Business Process Solutions source exchange rates and applies consistent conversions, enabling dashboards to consolidate values into a single currency.

Customers will be able to leverage prebuild Copilot Agents to turn insight into action. These agents are deeply integrated not only with Microsoft Fabric, but also other connected systems, enabling users to take direct, contextual actions executing informed transactions within attached source systems based on these insights. By connecting unstructured data sources such as emails, chats, and documents from Microsoft 365, the agents can provide a holistic and contextualized view to support smarter decisions. With embedded triggers and intelligent agents, automated responses could be initiated based on new insights - streamlining decision-making and enabling proactive, data-driven financial operations. Ultimately, this empowers teams not just to understand what is happening on a holistic level, but to act on it - faster, smarter, and with greater confidence.

## Data foundation

The data warehouse layer is built on Microsoft Fabric, following the medallion architecture based on OneLake.

:::image type="content" source="./media/about-business-process-solutions/data-foundation.png" alt-text="Diagram that data foundation for business process solutions." lightbox="./media/about-business-process-solutions/data-foundation.png":::

The Bronze layer is where data first enters the platform. The Bronze layer is optional, and its presence and format depend on the source system and data integration method. Within the Bronze layer, the data is recorded "as-is," with minimal or no transformation, ensuring that nothing is lost from the original source.

From the bronze layer, the data moves into the Silver layer, which integrates information from multiple systems into a single lakehouse. At this point, all data changes—such as inserts, updates, and deletes—are applied, together with any required data mappings and data type adjustments, ensuring that the Silver layer always holds consistent and up-to-date data. When integrating data through Azure Data Factory, the Silver layer serves as the main ingestion area, as Business Process Solutions reuse the capabilities of the SAP CDC connector to maintain data consistency.

As data progresses into the Gold layer, it's shaped into business-ready models designed for reporting and analytics. In this layer, information is organized into star schemas, where transactional facts such as sales or procurement data are linked to descriptive dimensions like customers, products, or suppliers. We provide processes to simplify common tasks such as reusing source system hierarchies and implementing currency conversion, making it easier for teams to maintain accuracy and efficiency. We add aggregations to improve performance and provide optional authorization structures.

## Data extraction

Business Process Solutions use the same connectivity options as Microsoft Fabric and Azure Data Factory, but goes further by embedding best practices that make integration simpler and more effective. We also understand that many businesses have already invested in data extraction tools, which is why Business Process Solutions support a wide range of options, from native connectivity to third-party options that bring specialized capabilities to the table. The solution automatically deploys necessary objects to establish the connection to the source system and extract data.

Business Process Solutions offers integration with following source systems:

### SAP S/4HANA (Public Preview)

Business Process Solutions supports integration with SAP S/4HANA, enabling organizations to extract and process data from core system for downstream analytics and reporting. This integration is designed to accommodate different technical preferences and existing investments, ensuring flexibility in how data is accessed and moved.

Supported releases: SAP S/4HANA 1909 and newer.

#### Azure Data Factory

For organizations already familiar with Azure Data Factory, the existing workflows can continue without disruption. Business Process Solutions provides prebuilt templates that simplify connectivity to SAP S/4HANA and streamline the extraction process. These templates reduce the need for custom development and help maintain consistency in data pipelines.

#### Open Mirroring (using Partner solutions)

For organizations with highly specialized requirements or extremely large-scale extraction scenarios, Microsoft Partner solutions can provide additional capabilities. They often include advanced delta extraction features, support for complex transformations, and tailored performance tuning. Partner offerings can be useful when customers need bespoke configurations or extended services beyond the standard templates provided by Business Process Solutions.

#### SAP Datasphere with Fabric Mirroring (Private Preview)

Another option is to use SAP Datasphere as the primary extraction layer. This approach allows organizations to take advantage of SAP-native integration features while maintaining compatibility with modern analytics platforms.

### SAP ECC (Private Preview)

Customers who haven't yet migrated their SAP environment to SAP S/4HANA can still leverage Business Process Solutions for data analytics. The prebuilt processing is adjusted to work with SAP ECC systems enabling extraction of key business data.

Supported release: SAP ECC 6.0

#### Open Mirroring (using Partner solutions)

Microsoft Partners play an important role in SAP ECC integration due to their specialized data extraction capabilities and advanced delta handling at the table level. These solutions are designed to optimize performance and support complex extraction scenarios that go beyond standard configurations.

### Salesforce (Private Preview)

Customers using Salesforce can integrate Business Process Solutions to unlock insights from CRM data though connectors available directly in Microsoft Fabric.

#### Microsoft Fabric Pipelines

Business Process Solutions supports connectivity to Salesforce through the Salesforce connector available in Microsoft Fabric. During the system onboarding, the solution automatically deploys all required pipelines required to efficiently extract required Salesforce data. The approach simplifies integration by leveraging native capabilities, reducing complexity and accelerating time-to-insight.

## Related content

[Data Models](data-models-business-process-solutions.md)

[Business Templates](business-templates.md)
