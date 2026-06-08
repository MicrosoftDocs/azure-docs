---
title: Data Models in Business Process Solutions
description: Learn about various data models and how they provide essential building blocks for enterprise analytics to transform raw data and how to use it to drive business value.
author: mohitmakhija1
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: overview
ms.custom: subject-monitoring
ms.date: 11/07/2025
ms.author: momakhij
---

# Data models in Business Process Solutions

This article describes the available data models in Business Process Solutions and highlights supported source systems. By understanding the capabilities and structure of each data model, you can access the full potential of your organization's data.

Business Process Solutions provides a suite of preconfigured data models. Each model is tailored to a distinct functional area or business domain. The models address the unique requirements of various processes across the organization to ensure comprehensive coverage for analytics and reporting.

Each model provides a robust foundation for analytics and captures transactional details (facts) and contextual information (dimensions) along with text elements and hierarchies. This information supports granular analysis and reporting across business processes.

To gain the full value of these data models, Business Process Solutions applies transformation logic that prepares data from source systems for reporting and analytics. For example, it assigns surrogate keys for dimensions and uses them to create relationships with fact tables.

Hierarchical structures are transformed to support advanced drill-down and roll-up analysis. Dedicated logic is applied for currency conversion to ensure that financial data is consistently represented across different reporting scenarios. These steps ensure that the resulting data models are accurate, consistent, and optimized for performance and usability in downstream reporting tools.

## Record to report

Record to report delivers a comprehensive view of financial performance. The model integrates data from key finance areas that include general ledger, assets, accounts receivable, and accounts payable.

### General Ledger

The General Ledger data model provides a comprehensive foundation for financial reporting and performance analysis across an organization. It integrates essential transactional details and data to support core financial processes such as general ledger accounting, asset tracking, cost center management, and fiscal period control. Integration ensures consistency and accuracy across financial systems.

This model enables a wide range of analytics, which includes balance sheet, profit and loss reporting, and trend analysis across fiscal periods. It supports multidimensional views of financial performance by linking organizational structures like company codes, business areas, and segments with account hierarchies and transactional line items. It also facilitates compliance and audit readiness through transparent tracking of ledger entries and financial postings across time and entities.

:::image type="content" source="./media/data-models-business-process-solutions/general-ledger.png" alt-text="Screenshot that shows the Trial Balance screen." lightbox="./media/data-models-business-process-solutions/general-ledger.png":::

**Supported source systems:**

- SAP S/4HANA
- SAP ECC (available through partner integration)

**Related resources:**
[Finance Insights](business-templates.md#finance-insights)

### Accounts Payable

The Accounts Payable data model provides visibility into all supplier-related obligations, which helps organizations manage outgoing cash flows effectively. It consolidates the finance view of supplier invoices to monitor whether commitments are met on time.

This model enables tracking of overdue payables, identifies bottlenecks in invoice processing, and assesses the impact of payment schedules on liquidity. Over time, these insights help to reveal potential payment risks, support accurate financial statements, and reinforce compliance with contractual and regulatory requirements.

:::image type="content" source="./media/data-models-business-process-solutions/account-payables.png" alt-text="Screenshot that shows the Supplier Payments screen." lightbox="./media/data-models-business-process-solutions/account-payables.png":::

**Supported source systems:**

- SAP S/4HANA
- SAP ECC (available through partner integration)

**Related resources:**
[Accounts Payable Insights](business-templates.md#accounts-payable-insights)

### Accounts Receivable

The Accounts Receivable data model focuses on incoming cash flows from customers and offers a complete view of outstanding invoices, payment behavior, and credit exposure. By analyzing receivables data, finance teams can measure collection efficiency, monitor overdue items, and predict cash inflows to optimize working capital.

Advanced analytics highlight trends in customer payment patterns, flag potential credit risks, and enable proactive actions to reduce days sales outstanding. This transparency improves forecasting accuracy and strengthens financial health across the organization.

:::image type="content" source="./media/data-models-business-process-solutions/account-receivables.png" alt-text="Screenshot that shows the Aging Report." lightbox="./media/data-models-business-process-solutions/account-receivables.png":::

**Supported source systems:**

- SAP S/4HANA
- SAP ECC (available through partner integration)

**Related resources:**
[Accounts Receivable Insights](business-templates.md#accounts-receivable-insights)

## Order to Cash

Order to Cash provides a complete perspective on the customer opportunity-to-cash journey from initial opportunity through delivery, invoicing, and payments.

### Opportunities

The Opportunities data model provides a unified view of the sales pipeline and performance metrics. It consolidates opportunity data into a single reporting layer, which enables monitoring of pipeline health, deal progression, and revenue potential across the organization.

:::image type="content" source="./media/data-models-business-process-solutions/opportunity-insights.png" alt-text="Screenshot that shows the Executive Summary." lightbox="./media/data-models-business-process-solutions/opportunity-insights.png":::

**Supported source systems:**

- Salesforce

**Related resources:**
[Opportunity Insights](business-templates.md#opportunity-insights)

### Sales

The Sales data model provides insight into how sales orders are created, managed, and connected to operational and financial dimensions of the business. Within this model, organizations can trace each sales document down to the item level. They can link orders to customers, products, and the sales organization responsible for fulfillment.

Delivery blocks and their status are captured directly in the data, which makes it possible to identify obstacles that prevent orders from moving forward. These operational details are then tied to financial structures, such as profit centers and controlling areas. This connection ensures that every order is visible as a commercial agreement and also as part of the organization's financial performance.

**Supported source systems:**

- SAP S/4HANA
- SAP ECC

**Related resources:**
[Sales and Billing Insights](business-templates.md#sales-and-billing-insights)

### Delivery

With the Delivery data model, organizations can follow the creation and processing of delivery documents and examine how goods are prepared, shipped, and handed over to customers. The data also reveals where deliveries are blocked or delayed. This information makes it easier to identify the causes of interruptions and resolve them before they affect customer satisfaction.

**Supported source systems:**

- SAP S/4HANA
- SAP ECC (available through partner integration)

### Billing

The Billing data model provides a structured view of billing documents, which shows how business activity translates into revenue. Working with this model allows organizations to monitor the timeliness and accuracy of billing. They can understand how different customers and products contribute to revenue. They can also confirm that billing activities align with contractual terms and organizational policies. Over time, this transparency supports more reliable revenue recognition and provides a stronger foundation for financial reporting and operational decision-making.

**Supported source systems:**

- SAP S/4HANA
- SAP ECC

**Related resources:**
[Sales and Billing Insights](business-templates.md#sales-and-billing-insights)

### Sales and Billing Insights

The Sales and Billing Insights data model combines sales order and billing document data to provide a comprehensive view of the sales process. Organizations can use the data to analyze the entire sales lifecycle from initial order creation through to billing and revenue recognition. Because the model integrates these two critical areas, businesses can gain deeper insights into customer behavior, sales performance, and financial outcomes.

:::image type="content" source="./media/data-models-business-process-solutions/sales-billing-insights-dashboard.png" alt-text="Screenshot that shows the Sales & Performance Report." lightbox="./media/data-models-business-process-solutions/sales-billing-insights-dashboard.png":::

**Supported source systems:**

- SAP S/4HANA
- SAP ECC

**Related resources:**
[Sales and Billing Insights](business-templates.md#sales-and-billing-insights)

### Accounts Receivable

The Accounts Receivable data model focuses on incoming cash flows from customers and offers a complete view of outstanding invoices, payment behavior, and credit exposure. By analyzing receivables data, finance teams can measure collection efficiency, monitor overdue items, and predict cash inflows to optimize working capital.

Advanced analytics highlight trends in customer payment patterns, flag potential credit risks, and enable proactive actions to reduce days sales outstanding. This transparency improves forecasting accuracy and strengthens financial health across the organization.

**Supported source systems:**

- SAP S/4HANA
- SAP ECC (available through partner integration)

**Related resources:**
[Accounts Receivable Insights](business-templates.md#accounts-receivable-insights)

## Procure to Pay

Procure to Pay supports strategic procurement and supplier management. It consolidates purchase orders, goods receipts, and vendor invoicing data.

### Purchase Requisitions

The Purchase Requisitions data model provides a structured foundation for managing internal procurement requests before formal purchase orders are created. It supports the initial stages of the procurement lifecycle by enabling organizations to capture demand, ensure budget alignment, and streamline approval workflows. By associating requisitions with purchasing groups and product categories, teams can uncover demand patterns and more accurately forecast future procurement needs.

**Supported source systems:**

- SAP S/4HANA
- SAP ECC (available through partner integration)

### Purchase Orders

The Purchase Orders data model provides a structured framework for managing procurement operations, supplier relationships, and financial commitments within an organization. It integrates core and transactional data to support the full lifecycle of purchase orders, from creation and approval to goods receipt and invoice processing. Transactional records capture detailed purchase order activity. Core data defines organizational structures, product classifications, and supplier attributes to ensure consistency and alignment with reporting and operational needs.

**Supported source systems:**

- SAP S/4HANA
- SAP ECC (available through partner integration)

**Related resources:**
[Spend Insights](business-templates.md#spend-insights)

### Goods Movements

The Goods Movements data model captures how materials flow through the procurement cycle and connects these movements with financial and operational structures. With this model, organizations can trace goods from receipt through storage, transfer, and consumption. They can ensure that every movement is tied to accounting and controlling dimensions such as cost centers, profit centers, and company codes. This linkage makes it possible to assess whether deliveries arrive as expected. Organizations can understand the impact of goods movements on costs and inventory levels. They can also monitor compliance with internal processes.

Over time, the model also helps to highlight patterns in supplier reliability, product handling efficiency, and the overall stability of procurement operations. These insights give finance and operations teams a consistent view of physical and financial outcomes.

**Supported source systems:**

- SAP S/4HANA
- SAP ECC (available through partner integration)

### Supplier Invoices

The Supplier Invoices data model is central to maintaining financial oversight and operational efficiency within the procurement process. It provides a structured way to manage invoice validation by seamlessly combining transactional and core data.

With this model, organizations gain a clearer view of their spending activity. They can follow how invoices progress through each stage of their lifecycle and assess whether compliance standards are being met. The model also provides a view into supplier performance.

**Supported source systems:**

- SAP S/4HANA
- SAP ECC (available through partner integration)

**Related resources:**
[Spend Insights](business-templates.md#spend-insights)

### Accounts Receivable

The Accounts Receivable data model focuses on incoming cash flows from customers. It offers a complete view of outstanding invoices, payment behavior, and credit exposure. By analyzing receivables data, finance teams can measure collection efficiency, monitor overdue items, and predict cash inflows to optimize working capital.

Advanced analytics highlight trends in customer payment patterns, flag potential credit risks, and enable proactive actions to reduce days sales outstanding. This transparency improves forecasting accuracy and strengthens financial health across the organization.

:::image type="content" source="./media/data-models-business-process-solutions/account-receivables.png" alt-text="Screenshot that shows the Aging Report." lightbox="./media/data-models-business-process-solutions/account-receivables.png":::

**Supported source systems:**

- SAP S/4HANA
- SAP ECC (available through partner integration)

**Related resources:**
[Accounts Receivable Insights](business-templates.md#accounts-receivable-insights)

## Related content

Data models provide the essential building blocks for enterprise analytics. Organizations can use them to transform raw data into meaningful insights and drive business value. To put them into action and advance your analytics projects, explore the available business templates. The adaptable Power BI reports and Copilot Studio agents help you maximize the benefits of these data models in real-world scenarios.

- [Business templates](business-templates.md)
