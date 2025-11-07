---
title: Available data models in Business Process Solutions
description: Overview of data models in Business Process Solutions.
author: momakhij
ms.service: sap-on-azure
ms.subservice: business-process-solutions
ms.topic: overview
ms.custom: subject-monitoring
ms.date: 11/07/2024
ms.author: momakhij
---

# Available data models in Business Process Solutions

In this article, we describe available data models in Business Process Solutions and highlight supported source systems. By understanding the capabilities and structure of each data model, you’ll be equipped to unlock the full potential of your organisation’s data.

Business Process Solutions provides a suite of preconfigured data models, each tailored to a distinct functional area or business domain. These models are designed to address the unique requirements of various processes across the organisation, ensuring comprehensive coverage for analytics and reporting. Each of them is designed to provide a robust foundation for analytics and capture both transactional details (facts) and contextual information (dimensions) alongside with text elements and hierarchies, supporting granular analysis and reporting across business processes.

To fully realise the value of these data models, Business Process Solutions applies transformation logic that prepares data from source systems for reporting and analytics. For example, it assigns surrogate keys for dimensions and uses them to create relationship with fact tables. Hierarchical structures are transformed to support advanced drill-down and roll-up analysis. Dedicated logic is applied for currency conversion to ensure financial data is consistently represented across different reporting scenarios. These steps ensure that the resulting data models are accurate, consistent, and optimised for performance and usability in downstream reporting tools.

# Record to Report

Delivers a comprehensive view of financial performance, integrating data from key finance areas including general ledger, assets, accounts receivable, and accounts payable.

## General Ledger

The General Ledger data model provides a comprehensive foundation for financial reporting and performance analysis across an organisation. It integrates essential transactional and data to support core financial processes such as general ledger accounting, asset tracking, cost centre management, and fiscal period control - ensuring consistency and accuracy across financial systems.

This model enables a wide range of analytics, including balance sheet and profit and loss reporting as well as trend analysis across fiscal periods. It supports multi-dimensional views of financial performance by linking organisational structures like company codes, business areas and segments with account hierarchies and transactional line items. Additionally, it facilitates compliance and audit readiness through transparent tracking of ledger entries, and financial postings across time and entities.

Supported source systems:
SAP S/4HANA
SAP ECC – available through partner integration
Oracle Fusion – coming soon

Related resources:
Finance Insights

## Accounts Payable

The Accounts Payable data model provides visibility into all supplier-related obligations, helping organisations manage outgoing cash flows effectively. It consolidates the finance view of supplier invoices to monitor whether commitments are met on time. This model enables tracking of overdue payables, identifying bottlenecks in invoice processing, and assessing the impact of payment schedules on liquidity. Over time, these insights help surface potential payment risks and support accurate financial statements, while reinforcing compliance with contractual and regulatory requirements.

Supported source systems:
SAP S/4HANA
SAP ECC – available through partner integration

Related resources:
AP Insights

## Accounts Receivable

The Accounts Receivable data model focuses on incoming cash flows from customers, offering a complete view of outstanding invoices, payment behaviour, and credit exposure. By analysing receivables data, finance teams can measure collection efficiency, monitor overdue items, and predict cash inflows to optimise working capital. Advanced analytics highlight trends in customer payment patterns, flag potential credit risks, and enable proactive actions to reduce days sales outstanding (DSO). This transparency improves forecasting accuracy and strengthens financial health across the organisation.

Supported source systems:
SAP S/4HANA
SAP ECC – available through partner integration

Related resources:
AR Insights

## Assets (coming soon)

The data model for Assets delivers a unified view of an organisation’s fixed assets, covering acquisition, valuation, depreciation, and retirement transactions. It ensures consistency across financial reporting by integrating asset master data with transactional details.

# Order to Cash

Provides a complete perspective on the customer opportunity-to-cash journey, from initial opportunity through delivery, invoicing and payments.

## Opportunities

The Opportunity model provides a unified view of the sales pipeline and performance metrics. It consolidates opportunity data into a single reporting layer, enabling monitoring of pipeline health, deal progression, and revenue potential across the organisation.

Supported source systems:
Salesforce

Related resources:
Opportunity Insights

## Sales

The Sales data model provides insight into how sales orders are created, managed, and connected to both operational and financial dimensions of the business. Within this model, organisations can trace each sales document down to the item level, linking orders to customers, products, and the sales organisation responsible for fulfilment. Delivery blocks and their status are captured directly in the data, which makes it possible to identify obstacles that prevent orders from moving forward. These operational details are then tied to financial structures such as profit centers and controlling areas, ensuring that every order is visible not only as a commercial agreement but also as part of the organisation’s financial performance.

Supported source systems:
SAP S/4HANA
SAP ECC

Related resources:
Sales and Billing Insights

## Delivery

With the delivery model, organisations can follow the creation and processing of delivery documents, examining how goods are prepared, shipped, and handed over to customers. The data also reveals where deliveries are blocked or delayed, making it easier to identify the causes of interruptions and resolve them before they affect customer satisfaction.

Supported source systems:
SAP S/4HANA
SAP ECC – available through partner integration

## Billing

The Billing data model provides a structured view of billing documents, showing how business activity translates into revenue. Working with this model allows organisations to monitor the timeliness and accuracy of billing, understand how different customers and products contribute to revenue, and confirm that billing activities align with contractual terms and organisational policies. Over time, this transparency supports more reliable revenue recognition and provides a stronger foundation for both financial reporting and operational decision-making.

Supported source systems:
SAP S/4HANA
SAP ECC

Related resources:
Sales and Billing Insights

## Sales and Billing Insights

The Sales

Supported source systems:
SAP S/4HANA
SAP ECC

Related resources:
Sales and Billing Insights

## Accounts Receivable

The Accounts Receivable data model focuses on incoming cash flows from customers, offering a complete view of outstanding invoices, payment behaviour, and credit exposure. By analysing receivables data, finance teams can measure collection efficiency, monitor overdue items, and predict cash inflows to optimise working capital. Advanced analytics highlight trends in customer payment patterns, flag potential credit risks, and enable proactive actions to reduce days sales outstanding (DSO). This transparency improves forecasting accuracy and strengthens financial health across the organisation.

Supported source systems:
SAP S/4HANA
SAP ECC – available through partner integration

Related resources:
AR Insights

# Procure to Pay

Supports strategic procurement and supplier management, consolidating purchase orders, goods receipts, and vendor invoicing data.

## Purchase Requisitions

The Purchase Requisition data model provides a structured foundation for managing internal procurement requests before formal purchase orders are created. It supports the initial stages of the procurement lifecycle by enabling organisations to capture demand, ensure budget alignment, and streamline approval workflows. By associating requisitions with purchasing groups and product categories, teams can uncover demand patterns and more accurately forecast future procurement needs.

Supported source systems:
SAP S/4HANA
SAP ECC – available through partner integration

## Purchase Orders

The Purchase Order data model provides a structured framework for managing procurement operations, supplier relationships, and financial commitments within an organisation. It integrates master and transactional data to support the full lifecycle of purchase orders, from creation and approval to goods receipt and invoice processing. Transactional records capture detailed purchase order activity, while master data defines organisational structures, product classifications, and supplier attributes to ensure consistency and alignment with reporting and operational needs.

Supported source systems:
SAP S/4HANA
SAP ECC – available through partner integration

Related resources:
Spend Insights



## Goods Movements

The Procure to Pay – Goods Movement data model captures how materials flow through the procurement cycle and connects these movements with financial and operational structures. With this model, organisations can trace goods from receipt through storage, transfer, and consumption, while ensuring every movement is tied to accounting and controlling dimensions such as cost centers, profit centers, and company codes. This linkage makes it possible to assess whether deliveries arrive as expected, to understand the impact of goods movements on costs and inventory levels, and to monitor compliance with internal processes. Over time, the model also helps highlight patterns in supplier reliability, product handling efficiency, and the overall stability of procurement operations, giving finance and operations teams a consistent view of both physical and financial outcomes.

Supported source systems:
SAP S/4HANA
SAP ECC – available through partner integration

## Supplier Invoices

The Supplier Invoices data model is central to maintaining both financial oversight and operational efficiency within the procurement process. It provides a structured way to manage invoice validation, seamlessly combining transactional and master data. With this model, organisations gain a clearer view of their spending activity. They can follow how invoices progress through each stage of their lifecycle and assess whether compliance standards are being met. The model also provides a view into supplier performance.

Supported source systems:
SAP S/4HANA
SAP ECC – available through partner integration

Related resources:
Spend Insights

## Accounts Receivable

The Accounts Receivable data model focuses on incoming cash flows from customers, offering a complete view of outstanding invoices, payment behaviour, and credit exposure. By analysing receivables data, finance teams can measure collection efficiency, monitor overdue items, and predict cash inflows to optimise working capital. Advanced analytics highlight trends in customer payment patterns, flag potential credit risks, and enable proactive actions to reduce days sales outstanding (DSO). This transparency improves forecasting accuracy and strengthens financial health across the organisation.

Supported source systems:
SAP S/4HANA
SAP ECC – available through partner integration

Related resources:
AR Insights

# Plan to Produce (coming soon)

Covers manufacturing and production processes, providing end-to-end visibility across the entire production cycle, from order creation and operation planning to material consumption and execution confirmations

## Orders

The Manufacturing Order data model provides a structured foundation for tracking and analysing production activities in discrete manufacturing. It captures essential details such as product, quantity, plant, planned and actual dates, and order status. This model enables organisations to monitor order backlog, throughput, and schedule adherence, supporting analysis of released versus completed orders and trends in production volume.

## Operations

The Manufacturing Operations data model details the planned execution steps for each production order, including work centre, sequence, control key, and standard values for setup, run, and labour. It supports capacity planning, bottleneck analysis, and schedule management at the operation level. This model is essential for understanding how production resources are allocated and used throughout the manufacturing process.

## Components

The Manufacturing Components data model defines the materials required for each operation within a production order, based on the bill of materials (BOM) snapshot. It enables planning and analysis of component requirements, staging readiness, and supply area completeness. This model helps ensure that the right materials are available at the right time, supporting efficient production and minimising delays.

## Confirmations

The Manufacturing Confirmations data model captures actual production execution results, including yield, scrap, labour, machine, and setup time recorded per operation and work centre. It enables analysis of labour utilisation, yield and scrap rates, and production throughput by shift or operator. By comparing planned operations with actual confirmations, organisations can track performance, identify variances, and optimise resource allocation. This model supports continuous improvement and provides the data needed for accurate reporting and compliance.

# Next steps

Data models provide the essential building blocks for enterprise analytics, enabling organisations to transform raw data into meaningful insights and drive business value. To put them into action and accelerate your analytics projects, explore the available Business Templates, where you’ll find adaptable Power BI reports and Copilot Studio Agents designed to help you maximise the benefits of these data models in real-world scenarios.