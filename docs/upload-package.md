---
title: Upload your package to AppSource
description: Upload the manifest for your Office Add-in, SharePoint Add-in, Microsoft Teams app, or Power BI custom visual.
ms.date: 1/11/2018
---

# Upload your package to AppSource

On the Overview page in the Seller Dashboard, under **App package**, you upload your manifest. The upload process varies based on your submission type.

## Upload your Office Add-in manifest

Select the tile under **App package**, and upload the manifest file for your add-in.

When you upload your manifest file, you might get one of the following messages:

- **Manifest errors**. If your manifest contains errors, the Seller Dashboard reports those errors and you have to resolve them before you can submit your add-in.
- **Applications and platforms supported**. Office add-ins, platforms, and operating systems are specified in the **Requirements** element in your manifest. For more information, see [Office Add-in host and platform availability](https://docs.microsoft.com/office/dev/add-ins/overview/office-add-in-availability).

## Upload your SharePoint Add-in manifest

Select the tile under **App package**, and upload the manifest file for your add-in.

If your add-in uses OAuth, select the **My app is a service and requires server to server authorization** check box. The OAuth Client ID drop-down field appears. Select the OAuth client ID that you want your add-in to use. For more information, see [Create or update client IDs and secrets in the Seller Dashboard](create-or-update-client-ids-and-secrets.md).

To submit a SharePoint Add-in that uses OAuth that you want to distribute to China:

- Use a separate client ID and client secret for China.
- Add a separate add-in package specifically for China.
- Block access for all countries except China.
- Create a separate add-in listing for China.

For more information, see [Submit apps for Office 365 operated by 21Vianet in China](submit-sharepoint-add-ins-for-office-365-operated-by-21vianet-in-china.md).

## Upload an Office 365 web app

Office 365 web apps are no longer accepted via the Seller Dashboard. We recommend that you submit Office 365 web apps via the [Cloud Partner Portal](https://appsource.microsoft.com/partners/signup) instead.


## Upload a Power BI custom visual    

To submit a Power BI custom visual, send an email to the Power BI custom visuals submission team at [pbivizsubmit@microsoft.com](mailto:pbivizsubmit@microsoft.com). Attach the following to your email:

- The .pbiviz file 
- The sample report .pbix file

The Power BI team will reply back with instructions and a manifest XML file to upload. This XML manifest is required to submit your custom visual to AppSource.

> [!NOTE]
> To help ensure quality and make sure that existing reports do not break, updates to existing custom visuals take approximately two weeks to reach the general public after approval. 

For more details about submitting Power BI custom visuals, see [Publish custom visuals to AppSource](https://docs.microsoft.com/power-bi/developer/office-store).

## Upload a Microsoft Teams app

Select the tile under **App package**, and upload the manifest file for your add-in. 

When you upload your manifest file, you might get the following message: 

- **Errors exist**. If your package contains errors, the Seller Dashboard reports those errors and you have to resolve them before you can submit your add-in. 

For more details about Microsoft Teams app packages, see [Create the package for your Microsoft Teams app](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/apps/apps-package). For a step-by-step guide that describes how to submit a Microsoft Teams app, see [Use the Seller Dashboard to submit your Microsoft Teams app](https://docs.microsoft.com/microsoftteams/platform/publishing/office-store-guidance).

## See also

- [Create your AppSource listing](office-store-listing.md)
- [Add lead management details for your Office Add-ins in the Seller Dashboard](add-lead-management-details.md)
- [Decide on a pricing model for your AppSource submission](decide-on-a-pricing-model.md)
- [Create or update client IDs and secrets in the Seller Dashboard](create-or-update-client-ids-and-secrets.md)
- [AppSource submission FAQ](office-store-submission-faq.md)
- [Use the Seller Dashboard to submit your solution to AppSource](use-the-seller-dashboard-to-submit-to-the-office-store.md)
- [Make your solutions available in AppSource and within Office](submit-to-the-office-store.md)
