---
title: Introduction to Business Process Solutions (Public Preview)
description: Learn how to use Business Process Solutions to enable organizations in unifying business data across different systems and functional areas.
author: mohitmakhija1
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: overview
ms.custom: subject-monitoring
ms.date: 11/07/2025
ms.author: momakhij
---

# Introduction to Business Process Solutions (preview)

Business Process Solutions accelerates enterprise data analytics and derisks AI adoption by providing prebuilt resources that include data models, transformations, and business templates. This article introduces the solution and outlines how it enables organizations to unify business data across various systems and functional areas.

In AI-driven enterprises, access to reliable business information is critical for success. Whether AI augmented or fully autonomous, agentic solutions require trusted consistent information to drive successful outcomes. In many organizations, data fragmentation across best-of-breed applications complicates the adoption of agentic solutions. This fragmentation reduces visibility into processes that span multiple applications and also complicates AI automation. To speed up adoption and derisk AI adoption, organizations require a unified, trusted dataset as a foundation for their AI transformation.

## Key capabilities

Business Process Solutions delivers a suite of capabilities designed to unify and enhance enterprise data across previously siloed environments. Organizations can use it to discover business insights by integrating data from disparate systems, which provides a holistic view of operations.

The solution features prebuilt data models that are tailored for enterprise business applications. The models are ready to use within Microsoft Fabric to ensure robust and scalable analytics. The data extraction and transformation processes make sure that source data is accurately extracted and converted. This capability enables efficient and reliable data handling from initial capture to final analysis.

Business Process Solutions also includes a library of business templates. These ready-made analytics assets include dashboards, reports, and AI agents. The templates help teams quickly gain insights and automate processes in finance, sales, and procurement. They reduce the time and effort needed to build solutions from scratch.

Data models and extraction and transformation processes, supplemented with analytics assets, form a robust foundation for enterprise analytics. They enable organizations to rapidly demonstrate value. The solution's open architecture lets customers tailor the platform to their needs. Customers can integrate their own data sources or adjust existing processes, which gives them the flexibility to meet unique business requirements.

## Functional insights and business templates

At the functional level, Business Process Solutions uses application-native data models to simplify data extraction and integration.

:::image type="content" source="./media/about-business-process-solutions/enterprise-data.png" alt-text="Diagram that shows functional insights and available business templates for business process solutions." lightbox="./media/about-business-process-solutions/enterprise-data.png":::

Business Process Solutions (public preview) currently supports a set of business applications and functional areas. Organizations can use them to break down silos and drive actionable insights across their core processes. The platform covers the following key domains:

- **Finance**: Delivers a comprehensive view of financial performance. Integrates data from key finance areas that include general ledger, assets, accounts receivable, and accounts payable. Prebuilt dashboards provide financial statements, account balances, and profitability reports. Organizations can use this information to gain a complete picture of financial health. The Copilot agent in Business Process Solutions provides access to data by using natural language and enables users to perform financial postings.
- **Sales**: Provides a complete perspective on the customer opportunity-to-cash journey. Moves from initial opportunity through delivery, invoicing, and payments. The Copilot agent can help improve revenue forecasting by connecting structured enterprise resource planning (ERP) and customer relationship management (CRM) data with unstructured data from Microsoft 365. The agent also tracks sales pipeline health and identifies bottlenecks.
- **Procurement**: Supports strategic procurement and supplier management. Consolidates purchase orders, goods receipts, and vendor invoicing data. This domain empowers procurement teams to optimize sourcing strategies, manage supplier risk, and control spend.

Each scope item within Business Process Solutions is delivered as a complete, business-ready solution. The solutions reflect the operational logic of the functional domain and business application. Business Process Solutions defines the precise datasets that are required for each functional area. They specify the systems of record to source from and the integration patterns to apply. Detailed guidance that includes an understanding of business semantics shows how data should be extracted, normalized, and transformed. Then it can be reliably aggregated and analyzed across functions.

For example, financial reports such as the Balance Sheet often depend on complex hierarchies. Business Process Solutions retrieves these hierarchies from the source system, applies the necessary transformations, and visualizes the results in Power BI. In procurement, where transactions often involve multiple currencies, Business Process Solutions sources exchange rates and applies consistent conversions. Dashboards can then consolidate values into a single currency.

Customers can use prebuilt Copilot agents to turn insight into action. These agents are deeply integrated with Microsoft Fabric and other connected systems. Users can take direct, contextual actions to execute informed transactions within attached source systems based on these insights. The agents connect unstructured data sources, such as emails, chats, and documents from Microsoft 365, to provide a holistic and contextualized view to support smarter decisions.

With embedded triggers and intelligent agents, automated responses could be initiated based on new insights. This approach streamlines decision-making and enables proactive, data-driven financial operations. Teams can now understand what's happening on a holistic level and also act on it faster and with greater confidence.

## Data foundation

The data warehouse layer is built on Fabric. It follows the medallion architecture based on Microsoft OneLake.

:::image type="content" source="./media/about-business-process-solutions/data-foundation.png" alt-text="Diagram that shows the data foundation for Business Process Solutions." lightbox="./media/about-business-process-solutions/data-foundation.png":::

The Bronze layer is where data first enters the platform. This layer is optional, and its presence and format depend on the source system and data integration method. Within the Bronze layer, the data is recorded as is, with minimal or no transformation, to ensure that nothing is lost from the original source.

From the Bronze layer, the data moves into the Silver layer, which integrates information from multiple systems into a single lakehouse. At this point, all data changes like inserts, updates, and deletes are applied, together with any required data mappings and data type adjustments. As a result, the Silver layer always holds consistent and up-to-date data. When data is integrated through Azure Data Factory, the Silver layer serves as the main ingestion area. Business Process Solutions reuses the capabilities of the SAP CDC connector to maintain data consistency.

As data progresses into the Gold layer, it's shaped into business-ready models designed for reporting and analytics. In this layer, information is organized into star schemas. Transactional facts such as sales or procurement data are linked to descriptive dimensions like customers, products, or suppliers. Processes to simplify common tasks, such as reusing source system hierarchies and implementing currency conversion, make it easier for teams to maintain accuracy and efficiency. Aggregations improve performance and provide optional authorization structures.

## Data extraction

Business Process Solutions uses the same connectivity options as Fabric and Azure Data Factory but goes further by embedding best practices that make integration simpler and more effective. Because many businesses have already invested in data extraction tools, Business Process Solutions supports options that range from native connectivity to third-party options to offer specialized capabilities. Business Process Solutions automatically deploys necessary objects to establish the connection to the source system and extract data.

Business Process Solutions offers integration with the following source systems.

### SAP S/4HANA (public preview)

Business Process Solutions supports integration with SAP S/4HANA. Organizations can extract and process data from core systems for downstream analytics and reporting. This integration accommodates different technical preferences and existing investments, which ensures flexibility in how data is accessed and moved.

**Supported releases:** SAP S/4HANA 1909 and newer

#### Azure Data Factory

For organizations that are already familiar with Azure Data Factory, the existing workflows can continue without disruption. Business Process Solutions provides prebuilt templates that simplify connectivity to SAP S/4HANA and streamline the extraction process. These templates reduce the need for custom development and help maintain consistency in data pipelines.

#### Open mirroring (using partner solutions)

For organizations with specialized requirements or large-scale extraction scenarios, Microsoft partner solutions can provide more capabilities. They often include advanced delta extraction features, support for complex transformations, and tailored performance tuning. Partner offerings can be useful when customers need bespoke configurations or extended services beyond the standard templates that are provided by Business Process Solutions.

#### SAP Datasphere with Fabric mirroring (preview)

Another option is to use SAP Datasphere as the primary extraction layer. This approach allows organizations to take advantage of SAP-native integration features while maintaining compatibility with modern analytics platforms.

### SAP ECC (preview)

Customers that haven't yet migrated their SAP environment to SAP S/4HANA can still use Business Process Solutions for data analytics. The prebuilt processing is adjusted to work with SAP ECC systems to enable extraction of key business data.

**Supported release:** SAP ECC 6.0

#### Open mirroring (using partner solutions)

Microsoft partners play an important role in SAP ECC integration because of their specialized data extraction capabilities and advanced delta handling at the table level. These solutions are designed to optimize performance and support complex extraction scenarios that go beyond standard configurations.

### Salesforce (preview)

Customers that use Salesforce can integrate Business Process Solutions to gain insights from CRM data through connectors that are available directly in Fabric.

#### Microsoft Fabric pipelines

Business Process Solutions supports connectivity to Salesforce through the Salesforce connector available in Fabric. During the system onboarding, the solution automatically deploys all the pipelines that are required to efficiently extract Salesforce data. The approach simplifies integration by using native capabilities, which reduces complexity and speeds up the delivery of insights.

## Related content

- [Data models](data-models-business-process-solutions.md)
- [Business templates](business-templates.md)
