---
title: Currency Conversion
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

In SAP systems, transactions can be recorded in various currencies, which creates a need for optional currency conversion capabilities. Most financial data already includes amounts in both the transaction currency and company code currency, which ensures alignment between Business Process Solutions and the SAP system without extra conversion steps.

Some tables contain only the transaction currency, which makes it necessary to unify currencies for a comprehensive view. For example, you might need to present total procurement spend in a single currency. To address this situation, Business Process Solutions provides dedicated transformation notebooks that use exchange rates from SAP to calculate an average exchange rate per company code and fiscal year. This solution allows amounts to be consistently represented in a unified currency while maintaining accuracy.

Although this approach offers a reliable and standardized method for currency conversion, you also have the flexibility to implement your own algorithm if needed. Although converted values might not always match SAP's exact transaction-level amounts, they provide a close approximation that supports meaningful analysis across many functional areas.

We use currency conversion rates from SAP systems available in the CDS view `I_EXCHANGERATERAWDATA`. Based on this data, the notebook `ei_nb_s2g_currency_conversion.ipynb` calculates average conversion rates by using the following principles:

- The `I_EXCHANGERATERAWDATA` view doesn't contain exchange rates for every day. Instead, it contains the **Validity Start Date** column, which indicates the new exchange rate that starts from a specific date. The notebook forward-fills all missing dates by using the **Validity Start Date** column.
- Business Process Solutions provides two levels of exchange rate granularity. Customers can choose between higher accuracy and better performance:

   - **Fiscal period average exchange rates**: Optimize reporting performance by reducing the number of exchange rate lookups and calculations (table: `I_EXCHANGERATERAWDATA_FISCALPERIOD`).
   - **Daily exchange rates**: Improve accuracy by capturing short-term currency fluctuations (table: `I_EXCHANGERATERAWDATA_DAILY`).

- Exchange rates are computed separately for fiscal period and company code combinations.

To ensure optimal performance in Power BI reports, we recommend that you use average exchange rates per fiscal period. Instead of performing currency conversion at the row level, the report first groups all amounts by currency and fiscal period. Then it aggregates the values within each group before applying the fiscal period's average exchange rate.

This approach reduces the computational overhead compared to converting each transaction individually. When row-level currency calculations are eliminated, report performance is dramatically improved while maintaining reliable approximations of financial data.
