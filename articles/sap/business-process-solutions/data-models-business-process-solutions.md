---
title: Data models in Business Process Solutions
description: Learn about various data models and how they provide essential building blocks for enterprise analytics to transform raw data and how to use it to drive business value.
author: mohitmakhija1
ms.service: sap-on-azure
ms.subservice:
ms.topic: overview
ms.custom: subject-monitoring
ms.date: 11/07/2025
ms.author: momakhij
---

# Data models in Business Process Solutions

In this article, we describe available data models in Business Process Solutions and highlight supported source systems. By understanding the capabilities and structure of each data model, you’ll be equipped to unlock the full potential of your organization’s data.

Business Process Solutions provides a suite of preconfigured data models, each tailored to a distinct functional area or business domain. These models are designed to address the unique requirements of various processes across the organization, ensuring comprehensive coverage for analytics and reporting. Each of them is designed to provide a robust foundation for analytics and capture both transactional details (facts) and contextual information (dimensions) alongside with text elements and hierarchies, supporting granular analysis and reporting across business processes.

To fully realize the value of these data models, Business Process Solutions applies transformation logic that prepares data from source systems for reporting and analytics. For example, it assigns surrogate keys for dimensions and uses them to create relationship with fact tables. Hierarchical structures are transformed to support advanced drill-down and roll-up analysis. Dedicated logic is applied for currency conversion to ensure financial data is consistently represented across different reporting scenarios. These steps ensure that the resulting data models are accurate, consistent, and optimized for performance and usability in downstream reporting tools.

## Record to report

Record to report delivers a comprehensive view of financial performance, integrating data from key finance areas including general ledger, assets, accounts receivable, and accounts payable.

### General ledger

The general ledger data model provides a comprehensive foundation for financial reporting and performance analysis across an organization. It integrates essential transactional and data to support core financial processes such as general ledger accounting, asset tracking, cost center management, and fiscal period control - ensuring consistency and accuracy across financial systems.

This model enables a wide range of analytics which includes balance sheet, profit and loss reporting, and trend analysis across fiscal periods. It supports multi-dimensional views of financial performance by linking organizational structures like company codes, business areas and segments with account hierarchies and transactional line items. Additionally, it facilitates compliance and audit readiness through transparent tracking of ledger entries, and financial postings across time and entities.

:::image type="content" source="./media/data-models-business-process-solutions/general-ledger.png" alt-text="Screenshot showing the General Ledger Insights dashboard." lightbox="./media/data-models-business-process-solutions/general-ledger.png":::

Supported source systems:

- SAP S/4HANA
- SAP ECC – available through partner integration

Related resources:
[Finance Insights](business-templates.md#finance-insights)

### Accounts payable

The accounts payable data model provides visibility into all supplier-related obligations, helping organizations manage outgoing cash flows effectively. It consolidates the finance view of supplier invoices to monitor whether commitments are met on time. This model enables tracking of overdue payables, identifying bottlenecks in invoice processing, and assessing the impact of payment schedules on liquidity. Over time, these insights help surface potential payment risks and support accurate financial statements, while reinforcing compliance with contractual and regulatory requirements.

:::image type="content" source="./media/data-models-business-process-solutions/account-payables.png" alt-text="Screenshot showing the Accounts Payable Insights dashboard." lightbox="./media/data-models-business-process-solutions/account-payables.png":::

Supported source systems:

- SAP S/4HANA
- SAP ECC – available through partner integration

Related resources:
[Accounts Payable Insights](business-templates.md#account-payables-insights)

### Accounts receivable

The accounts receivable data model focuses on incoming cash flows from customers, offering a complete view of outstanding invoices, payment behavior, and credit exposure. By analyzing receivables data, finance teams can measure collection efficiency, monitor overdue items, and predict cash inflows to optimize working capital. Advanced analytics highlight trends in customer payment patterns, flag potential credit risks, and enable proactive actions to reduce days sales outstanding (DSO). This transparency improves forecasting accuracy and strengthens financial health across the organization.

:::image type="content" source="./media/data-models-business-process-solutions/account-receivables.png" alt-text="Screenshot showing the Accounts Receivable Insights dashboard." lightbox="./media/data-models-business-process-solutions/account-receivables.png":::

Supported source systems:

- SAP S/4HANA
- SAP ECC – available through partner integration

Related resources:
[Accounts Receivable Insights](business-templates.md#account-receivable-insights)

## Order to cash

Order to cash provides a complete perspective on the customer opportunity-to-cash journey, from initial opportunity through delivery, invoicing and payments.

### Opportunities

The opportunity model provides a unified view of the sales pipeline and performance metrics. It consolidates opportunity data into a single reporting layer, enabling monitoring of pipeline health, deal progression, and revenue potential across the organization.

:::image type="content" source="./media/data-models-business-process-solutions/opportunity-insights.png" alt-text="Screenshot showing the Opportunity Insights dashboard." lightbox="./media/data-models-business-process-solutions/opportunity-insights.png":::

Supported source systems:

- Salesforce

Related resources:
[Opportunity Insights](business-templates.md#opportunity-insights)

### Sales

The sales data model provides insight into how sales orders are created, managed, and connected to both operational and financial dimensions of the business. Within this model, organizations can trace each sales document down to the item level, linking orders to customers, products, and the sales organization responsible for fulfillment. Delivery blocks and their status are captured directly in the data, which makes it possible to identify obstacles that prevent orders from moving forward. These operational details are then tied to financial structures such as profit centers and controlling areas, ensuring that every order is visible not only as a commercial agreement but also as part of the organization’s financial performance.

Supported source systems:

- SAP S/4HANA
- SAP ECC

Related resources:
[Sales and Billing Insights](business-templates.md#sales-and-billing-insights)

### Delivery

With the delivery model, organizations can follow the creation and processing of delivery documents, examining how goods are prepared, shipped, and handed over to customers. The data also reveals where deliveries are blocked or delayed, making it easier to identify the causes of interruptions and resolve them before they affect customer satisfaction.

Supported source systems:

- SAP S/4HANA
- SAP ECC – available through partner integration

### Billing

The billing data model provides a structured view of billing documents, showing how business activity translates into revenue. Working with this model allows organizations to monitor the timeliness and accuracy of billing, understand how different customers and products contribute to revenue, and confirm that billing activities align with contractual terms and organizational policies. Over time, this transparency supports more reliable revenue recognition and provides a stronger foundation for both financial reporting and operational decision-making.

Supported source systems:

- SAP S/4HANA
- SAP ECC

Related resources:
[Sales and Billing Insights](business-templates.md#sales-and-billing-insights)

### Sales and billing insights

The sales and billing insights data model combines sales order and billing document data to provide a comprehensive view of the sales process. It enables organizations to analyze the entire sales lifecycle, from initial order creation through to billing and revenue recognition. By integrating these two critical areas, businesses can gain deeper insights into customer behavior, sales performance, and financial outcomes.

:::image type="content" source="./media/data-models-business-process-solutions/sales-billing-insights-dashboard.png" alt-text="Screenshot showing the Sales and Billing Insights dashboard." lightbox="./media/data-models-business-process-solutions/sales-billing-insights-dashboard.png":::

Supported source systems:

- SAP S/4HANA
- SAP ECC

Related resources:
[Sales and Billing Insights](business-templates.md#sales-and-billing-insights)

### Accounts receivable

The accounts receivable data model focuses on incoming cash flows from customers, offering a complete view of outstanding invoices, payment behavior, and credit exposure. By analyzing receivables data, finance teams can measure collection efficiency, monitor overdue items, and predict cash inflows to optimize working capital. Advanced analytics highlight trends in customer payment patterns, flag potential credit risks, and enable proactive actions to reduce days sales outstanding (DSO). This transparency improves forecasting accuracy and strengthens financial health across the organization.

Supported source systems:

- SAP S/4HANA
- SAP ECC – available through partner integration

Related resources:
[Accounts Receivable Insights](business-templates.md#account-receivable-insights)

## Procure to pay

Supports strategic procurement and supplier management, consolidating purchase orders, goods receipts, and vendor invoicing data.

### Purchase requisitions

The purchase requisition data model provides a structured foundation for managing internal procurement requests before formal purchase orders are created. It supports the initial stages of the procurement lifecycle by enabling organizations to capture demand, ensure budget alignment, and streamline approval workflows. By associating requisitions with purchasing groups and product categories, teams can uncover demand patterns and more accurately forecast future procurement needs.

Supported source systems:

- SAP S/4HANA
- SAP ECC – available through partner integration

### Purchase orders

The purchase order data model provides a structured framework for managing procurement operations, supplier relationships, and financial commitments within an organization. It integrates master and transactional data to support the full lifecycle of purchase orders, from creation and approval to goods receipt and invoice processing. Transactional records capture detailed purchase order activity, while master data defines organizational structures, product classifications, and supplier attributes to ensure consistency and alignment with reporting and operational needs.

Supported source systems:

- SAP S/4HANA
- SAP ECC – available through partner integration

Related resources:
[Spend Insights](business-templates.md#spend-insights)

### Goods movements

The procure to pay – goods movement data model captures how materials flow through the procurement cycle and connects these movements with financial and operational structures. With this model, organizations can trace goods from receipt through storage, transfer, and consumption, while ensuring every movement is tied to accounting and controlling dimensions such as cost centers, profit centers, and company codes. This linkage makes it possible to assess whether deliveries arrive as expected, to understand the impact of goods movements on costs and inventory levels, and to monitor compliance with internal processes. Over time, the model also helps highlight patterns in supplier reliability, product handling efficiency, and the overall stability of procurement operations, giving finance and operations teams a consistent view of both physical and financial outcomes.

Supported source systems:

- SAP S/4HANA
- SAP ECC – available through partner integration

### Supplier invoices

The supplier invoices data model is central to maintaining both financial oversight and operational efficiency within the procurement process. It provides a structured way to manage invoice validation, seamlessly combining transactional and master data. With this model, organizations gain a clearer view of their spending activity. They can follow how invoices progress through each stage of their lifecycle and assess whether compliance standards are being met. The model also provides a view into supplier performance.

Supported source systems:

- SAP S/4HANA
- SAP ECC – available through partner integration

Related resources:
[Spend Insights](business-templates.md#spend-insights)

### Accounts receivable

The accounts receivable data model focuses on incoming cash flows from customers, offering a complete view of outstanding invoices, payment behavior, and credit exposure. By analyzing receivables data, finance teams can measure collection efficiency, monitor overdue items, and predict cash inflows to optimize working capital. Advanced analytics highlight trends in customer payment patterns, flag potential credit risks, and enable proactive actions to reduce days sales outstanding (DSO). This transparency improves forecasting accuracy and strengthens financial health across the organization.

:::image type="content" source="./media/data-models-business-process-solutions/account-receivables.png" alt-text="Screenshot showing the Accounts Receivable Insights dashboard." lightbox="./media/data-models-business-process-solutions/account-receivables.png":::

Supported source systems:

- SAP S/4HANA
- SAP ECC – available through partner integration

Related resources:
[Accounts Receivable Insights](business-templates.md#account-receivable-insights)

## Next steps

Data models provide the essential building blocks for enterprise analytics, enabling organizations to transform raw data into meaningful insights and drive business value. To put them into action and accelerate your analytics projects, explore the available Business Templates, where you’ll find adaptable Power BI reports and Copilot Studio Agents designed to help you maximize the benefits of these data models in real-world scenarios.
