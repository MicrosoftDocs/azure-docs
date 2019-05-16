---
title: Upload your package to AppSource
description: Upload the manifest for your Office Add-in, SharePoint Add-in, Microsoft Teams app, or Power BI custom visual.
ms.date: 1/11/2018
localization_priority: Normal
---

# Upload your package to AppSource

On the Overview page in Partner Center, on the **Packages** tile, choose **Upload package**. The upload process varies based on your submission type.

## Upload your Office Add-in manifest

When you upload your manifest file, you might get one of the following messages:

- **Manifest errors**. If your manifest contains errors, Partner Center reports those errors and you have to resolve them before you can submit your add-in.
- **Applications and platforms supported**. Office add-ins, platforms, and operating systems are specified in the **Requirements** element in your manifest. For more information, see [Office Add-in host and platform availability](https://docs.microsoft.com/office/dev/add-ins/overview/office-add-in-availability).

## Upload your SharePoint Add-in manifest

If your add-in uses OAuth, select the **My app is a service and requires server to server authorization** check box. The OAuth Client ID drop-down field appears. Select the OAuth client ID that you want your add-in to use. For more information, see [Create or update client IDs and secrets in the Seller Dashboard](create-or-update-client-ids-and-secrets.md).

To submit a SharePoint Add-in that uses OAuth that you want to distribute to China:

- Use a separate client ID and client secret for China.
- Add a separate add-in package specifically for China.
- Block access for all countries except China.
- Create a separate add-in listing for China.

For more information, see [Submit apps for Office 365 operated by 21Vianet in China](submit-sharepoint-add-ins-for-office-365-operated-by-21vianet-in-china.md).

## See also

- [Create your AppSource listing](office-store-listing.md)
- [Add lead management details for your Office Add-ins in the Seller Dashboard](add-lead-management-details.md)
- [Decide on a pricing model for your AppSource submission](decide-on-a-pricing-model.md)
- [Create or update client IDs and secrets in the Seller Dashboard](create-or-update-client-ids-and-secrets.md)
- [AppSource submission FAQ](office-store-submission-faq.md)
- [Use the Seller Dashboard to submit your solution to AppSource](use-the-seller-dashboard-to-submit-to-the-office-store.md)
- [Make your solutions available in AppSource and within Office](submit-to-the-office-store.md)
