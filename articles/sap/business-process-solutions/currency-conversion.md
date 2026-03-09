---
title: Currency conversion
titleSuffix: Business Process Solutions
description: Learn how to do currency conversion in Business Process Solutions.
author: mimansasingh
ms.service: sap-on-azure
ms.subservice:
ms.topic: how-to
ms.date: 02/23/2026
ms.author: mimansasingh
---

# Currency conversion in Business Process Solutions

In SAP systems, transactions can be recorded in various currencies, creating a need for optional currency conversion capabilities. Most financial data already includes amounts in both the Transaction Currency and Company Code Currency, ensuring alignment between Business Process Solutions and the SAP system without extra conversion steps. Most financial data already includes amounts in both the **Transaction Currency** and **Company Code Currency**, ensuring alignment between Business Process Solutions and the SAP system without another conversion steps. 

However, some tables contain only transaction currency, making it necessary to unify currencies for a comprehensive view — for example, to present total procurement spend in a single currency. To address this, **Business Process Solutions** provides dedicated transformation notebooks that utilize exchange rates from SAP to calculate an average exchange rate per company code and fiscal year. This allows amounts to be consistently represented in a unified currency while maintaining accuracy. 

While this approach offers a reliable and standardized method for currency conversion, you also have the flexibility to implement your own algorithm if needed. Although converted values might not always match SAP’s exact transaction-level amounts, they provide a close approximation that supports meaningful analysis across many functional areas. 

We use currency conversion rates from SAP systems available in CDS View I_EXCHANGERATERAWDATA. Based on this data, notebook ei_nb_s2g_currency_conversion.ipynb calculates average conversion rates using following principles:

1. The I_EXCHANGERATERAWDATA view doesn't contain exchange rates for every day. Instead it contains the Validity Start Date column, which indicates the new exchange rate starting from a given date. The notebook forward-fill all missing dates using the Validity Start Date column.

1. Business Process Solutions provides two levels of exchange rate granularity, allowing customers to choose between higher accuracy and better performance: 

   1. **Fiscal period average exchange rates** – Optimize reporting performance by reducing the number of exchange rate lookups and calculations (table: I_EXCHANGERATERAWDATA_FISCALPERIOD)
   1. **Daily exchange rates** – Improve accuracy by capturing short-term currency fluctuations (table: I_EXCHANGERATERAWDATA_DAILY)

1. Exchange rates are computed separately for Fiscal Period and Company Code combinations.

To ensure optimal performance in Power BI reports, we recommend using the average exchange rates per fiscal period. Instead of performing currency conversion at the row level, the report first groups all amounts by currency and fiscal period, then aggregates the values within each group before applying the fiscal period’s average exchange rate. This approach significantly reduces the computational overhead compared to converting each transaction individually. By eliminating row-level currency calculations, report performance is dramatically improved while maintaining reliable approximations of financial data.
