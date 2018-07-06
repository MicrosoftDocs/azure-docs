---
title: View acquisitions report
description: Analyze your add-in performance and see funnel and acquisitions metrics.
ms.date: 1/11/2018
---

# Acquisitions report

The Acquisitions report in the Dev Center dashboard lets you see who has acquired and installed your add-in, app or visual, and shows info about how customers have arrived at your AppSource listing. 

In this report, an acquisition means a new customer has obtained a license to your solution (whether you charged money or you've offered it for free). If your solution supports multi-seat acquisitions, such as site license purchases, these will also be detailed and displayed.

    > [!NOTE]
    > The Acquisitions report does not include data about refunds, reversals, chargebacks, etc. To estimate your solution proceeds, visit Payout summary. 

<a name="BKMK_Edit"> </a>
## Apply filters

Near the top of the page, you can select the time period for which you want to show data. The default selection is 30D (30 days), but you can choose to show data for 2 or 3 months.
You can also expand Filters to filter all of the data on this page by market.
- Market: The default filter is All markets, but you can limit the data to acquisitions in one or more markets.

    > [!NOTE]
    > Acquisitions via Centralized Deployment do not currently support market information. 

The info in all of the charts listed below will reflect the date range and any filters you've selected. Some sections also allow you to apply additional filters.


## Acquisitions

The **Acquisitions** chart shows the number of daily or weekly acquisitions (a new customer obtaining a license for your app) over the selected period of time.

You can also see the lifetime number of acquisitions for your app by selecting App cumulative. This shows the cumulative total of all acquisitions, starting from when your app was first published.

The values supported within the Acquisitions chart include:

- Free - Webstore: Free acquisitions generated in web surfaces such as AppSource.

- Free - Client: Free acquisitions generated in store surfaces within the Office Apps. This includes Windows, Mac and Office Online.

- Paid: These are paid acquisitions, and may be either perpetual or subscription based on your solution's payment model.

- Trial: These are trial acquisitions. Length and expiration of these trial acquisitions are based on your selected trial lengths during the store submission process.

- Site License: These are paid acquisitions where an entire tenant is provisioned with a license.

- Deployment: These are the number of tenants who have deployed your solution. One tenant deployment here may generate multiple assignments. For the amount of end-users who received a license for your solution, please see the Assignments chart.

   
 
<a name="BKMK_delist"> </a>
## Markets

The **Markets** chart shows the total number of acquisitions over the selected period of time for each market in which your solution is available.

You can view this data in a visual Map form, or toggle the setting to view it in Table form. Table form will show five markets at a time, sorted either alphabetically or by highest/lowest number of acquisitions. You can also download the data to view info for all markets together.
 
## App page views and conversions by channel

In this chart, a channel refers to the method in which a customer arrived at your solution's listing page (for example, browsing and searching in the Store, a link from an external website, a link from one of your custom campaigns, etc.). The following channel types are included:

- Store traffic: The customer was browsing or searching within the Store when they viewed your app's listing.

- Custom campaign: The customer followed a link that used a custom campaign ID.

- Other: The customer followed an external link (without any custom campaign ID) from a website to your app's listing or the customer followed a link from a search engine to your app's listing.

A page view means that a customer viewed your solutions' AppSource listing page. This includes views by people who aren't signed in. Some customers have opted out of providing this information to Microsoft.

    > [!NOTE]
    > Client storefronts from within the Office applications do not currently provide page view information.  

A conversion means that a customer has newly obtained a license to your app (whether you charged money or you've offered it for free). See acquisitions for more details.

<a name="BKMK_delete"> </a>
## App page views and conversions by campaign ID

The **App page views and conversions by campaign ID** chart lets you track conversions and page views, as described above, for each of your custom promotion campaigns. The top campaign IDs are shown, and you can use the filters to exclude or include specific campaign IDs.
 
## Campaign performance by channel

The **Campaign performance by channel chart** lets you track at a high level the influence various channels have over your store traffic. This breaks down the funnel steps by each of the channels tracked.

## Total campaign conversions

The **Total campaign conversions chart** shows the total number of conversions from all custom campaigns during the selected period of time.

## See also

- [Make your solutions available in AppSource and within Office](submit-to-the-office-store.md)
- [Promote your AppSource solution](promote-your-office-store-solution.md)
