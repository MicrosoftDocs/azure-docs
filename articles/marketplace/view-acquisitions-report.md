---
title: View acquisitions report
description: Analyze your app or add-in performance and see funnel and acquisitions metrics.
ms.author: siraghav
ms.reviewer: dannyevers
ms.topic: article
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.date: 01/10/2022
---

# View the Acquisitions report in the dashboard
<!--- [
[image](https://user-images.githubusercontent.com/62076972/134597753-6fd281d2-9cdd-4ba0-b45d-645ca18e22d1.png)
]() --->

The _Acquisitions report_ in the Partner Center dashboard lets you see who has acquired and installed your add-in, app, or visual, and shows info about how customers have arrived at your Microsoft AppSource listing.

In this report, an acquisition means a new customer has obtained a license to your solution (whether you charged money or you've offered it for free). If your solution supports multi-seat acquisitions, such as site license purchases, these will also be detailed and displayed.

The SLA for Acquisitions data is currently 4 days.

> [!NOTE]
> Acquisition data for Teams apps is currently not supported in this report.

## How to view the Acquisitions report

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home). You can use the same username and password you use to manage Office Store products.

1. Select the **Insights** tile.

    :::image type="content" source="./media/office-store-workspaces/insights-tile.png" alt-text="Illustrates the Insights tile on the Partner Center home page.":::

1. In the left-menu, select **Acquistions**.

<a name="BKMK_Edit"> </a>
## Apply filters

Near the top of the page, you can select the time period for which you want to show data. The default selection is 30D (30 days), but you can choose to show data for 2 or 3 months.
You can also expand Filters to filter all of the data on this page by market.

- Market: The default filter is All markets, but you can limit the data to acquisitions in one or more markets.

    > [!NOTE]
    > Acquisitions via Centralized Deployment do not currently support market information.

The info in all of the charts listed below will reflect the date range and any filters you've selected. Some sections also allow you to apply additional filters.

## Acquisitions chart

The **Acquisitions** chart shows the number of daily or weekly acquisitions (a new customer obtaining a license for your app) over the selected period of time.

You can also see the lifetime number of acquisitions for your app by selecting App cumulative. This shows the cumulative total of all acquisitions, starting from when your app was first published.

The values supported within the Acquisitions chart include:

- Free - Webstore: Free acquisitions generated in web surfaces such as Microsoft AppSource.
- Free - Client: Free acquisitions generated in store surfaces within the Office Apps. This includes Windows, Mac, and the web client.
- Paid: These are paid acquisitions, and may be either perpetual or subscription based on your solution's payment model.
- Trial: These are trial acquisitions. Length and expiration of these trial acquisitions are based on your selected trial lengths during the store submission process.
- Site License: These are paid acquisitions where an entire tenant is provisioned with a license.
- Deployment: These are the number of tenants who have deployed your solution. One tenant deployment here may generate multiple assignments. For the amount of end-users who received a license for your solution, please see the Assignments chart.

<a name="BKMK_delist"> </a>
## Markets chart

The **Markets** chart shows the total number of acquisitions over the selected period of time for each market in which your solution is available.

You can view this data in a visual Map form, or toggle the setting to view it in Table form. Table form will show five markets at a time, sorted either alphabetically or by highest/lowest number of acquisitions. You can also download the data to view info for all markets together.

## App page views and conversions by channel

The Acquisition funnel shows you how many customers completed each step of the funnel, from viewing the Microsoft AppSource page to using the add-in or app, along with the conversion rate. This data can help you identify areas where you might want to invest more to increase your page views, acquisitions, or activations.

> [!NOTE]
> Client surfaces do not generate funnel information, and provided data only covers Microsoft AppSource acquisitions.

In this chart, a channel refers to the method in which a customer arrived at your solution's listing page (for example, browsing and searching on Microsoft AppSource, a link from an external website, a link from one of your custom campaigns, and so on). The following channel types are included:

- Store traffic - The customer was browsing or searching within Microsoft AppSource when they viewed your app's listing.

- Custom campaign - The customer followed a link that used a [custom campaign ID](promote-your-office-store-solution.md).

- Other - The customer followed an external link (without any custom campaign ID) from a website to your app's listing or the customer followed a link from a search engine to your app's listing.

A page view means that a customer viewed your solutions's Microsoft AppSource listing page. This includes views by people who aren't signed in. Some customers have opted out of providing this information to Microsoft.

> [!NOTE]
> Customers can arrive at your app's listing by clicking a custom campaign not created by you. We stamp every page view within a session with the campaign ID from which the customer first landed on Microsoft AppSource. We then attribute conversions to that campaign ID for all acquisitions within 24 hours. Because of this, you might see a higher number of total conversions than the total conversions for your campaign IDs, and you might have conversions or add-on conversions that have zero page views.

## App page views and conversions by campaign ID

The App page views and conversions by campaign ID chart lets you track conversions and page views, as described above, for each of your [custom promotion campaigns](promote-your-office-store-solution.md). The top campaign IDs are shown, and you can use the filters to exclude or include specific campaign IDs.

## Campaign performance by channel

The campaign performance by channel chart lets you track at a high level the influence various channels have over your store traffic. This breaks down the funnel steps by each of the channels tracked.

## Total campaign conversions

The Total campaign conversions chart shows the total number of app and add-on conversions from all custom campaigns during the selected period of time.

## See also

- [Make your solutions available in Microsoft AppSource and within Office](submit-to-appsource-via-partner-center.md)
- [Promote your solution](promote-your-office-store-solution.md)
