---
title: License dashboard in Microsoft commercial marketplace analytics on Partner Center - Azure Marketplace
description: Learn how to access information about your licenses using the License dashboard in commercial marketplace analytics.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
ms.date: 06/10/2021
author: smannepalle
ms.author: smannepalle
---

# License dashboard in commercial marketplace analytics

This article provides information about the License dashboard in the commercial marketplace program in Partner Center. The License dashboard shows the following information:

- Number of customers who purchased licenses
- Total number of licenses purchased
- Total number of licenses deployed
- Number of licenses purchased and deployed by the customer
- Distribution of licenses across countries and regions

## Check license usage

To check license usage of ISV apps in Partner Center, do the following:
1. Sign in to [Partner Center](https://go.microsoft.com/fwlink/?linkid=2165507).
1. In the left-navigation menu, select **Commercial Marketplace** > **Analyze** > **License**.

:::image type="content" source="./media/license-dashboard/license-dashboard.png" alt-text="Screenshot of the License dashboard in Partner Center.":::

## Elements of the License dashboard

The following sections describe how to use the License dashboard and how to read the data.

## Month range

You can find a month range selection at the top-right corner of the page. Customize the output of the widgets on the page by selecting a month range based on the past 6 or 12 months, or by selecting a custom month range with a maximum duration of 12 months. The default month range (computation period) is six months.

:::image type="content" source="./media/license-dashboard/month-range.png" alt-text="Screenshot of the month range selections on the License dashboard in Partner Center.":::

## Customers widget

The _Customers widget_ shows the current number of customers. The trend chart shows the month-over-month number of customers.

:::image type="content" source="./media/license-dashboard/customers-widget.png" alt-text="Screenshot of the Customers widget on the License dashboard in Partner Center.":::

## License widget

The _License widget_ shows the current number of provisioned and assigned licenses. The trend chart shows the month-over-month number of provisioned and assigned licenses. You can view the data for the last 6 months or 12 months. You can also choose a custom date range by selecting on the **Custom** link in the upper right of the page.

:::image type="content" source="./media/license-dashboard/license-widget.png" alt-text="Screenshot of the License widget on the License dashboard in Partner Center.":::

## Analysis widget

The _Analysis widget_ shows the number and percentage of provisioned and assigned licenses per offer and plan. The trend chart shows the month-over-month number of provisioned and assigned licenses. Using this widget, you can filter the data by Customers or Products.

:::image type="content" source="./media/license-dashboard/analysis-widget.png" alt-text="Screenshot of the Analysis widget on the License dashboard in Partner Center.":::

## License Distribution widget

The _License Distribution_ widget shows the distribution of licenses across different countries and regions. The colored regions show where the user licenses are distributed. To revert to the default view, select the **Reset zoom** button (Home icon) in the widget.

:::image type="content" source="./media/license-dashboard/license-distribution.png" alt-text="Screenshot of the License Distribution widget on the License dashboard in Partner Center.":::

## Data terms in License report downloads

You can use the download icon in the upper-right corner of any widget to download the data.

| Attribute name | Definition |
| ------------ | ------------- |
| Customer Country | Customer’s billing country |
| Customer Country Code | Customer’s billing country code |
| Customer Name | Customer name |
| Activation Date | Date when licenses were activated |
| Product Display Name | Offer title as shown in AppSource |
| Product ID | Product ID |
| Licenses Provisioned | Number of licenses activated into the customer’s account |
| Licenses Assigned | Number of licenses customer has assigned to their users |
| SKU Name | Name of the plan in the offer |
| Tenant ID | Unique ID of the tenant |
| License State | License state |
| Service ID | Unique identifier used in the package to map the plan with the license checks |
|||

## Next steps

- For an overview of analytics reports available in the commercial marketplace, see [Access analytic reports for the commercial marketplace in Partner Center](analytics.md).
