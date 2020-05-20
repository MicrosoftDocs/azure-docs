---
title: Common questions about the migration to Partner Center - Microsoft commercial marketplace
description: Answers to commonly asked questions about the migration of offers from Cloud Partner Portal to Partner Center.
author: anbene
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 05/19/2020
ms.author: mingshen
---

# Common questions about migrating from the Cloud Partner Portal to Partner Center

This article addresses commonly asked questions about the migration of offers from the Cloud Partner Portal to Partner Center.

## What does offer migration mean?

We are moving your offer data from the Cloud Partner Portal to Partner Center with changes in the offer publishing and management experience.

| Area  | Changes  |
|-------|----------|
| **Publishing and offer management experience** | You'll have an improved user experience with an intuitive interface in Partner Center. For more details, see [What are the differences between Partner Center and the Cloud Partner Portal?](#what-are-the-differences-between-partner-center-and-the-cloud-partner-portal) |
| **Availability of your offers in the marketplace** | No changes. If your offer is live in the marketplace it will continue to be live during and after the migration is completed. |
| **New purchases and deployments** | No changes. Your customers will continue to be able to purchase and deploy your offers with no interruptions. |
| **Payouts** | Any purchases and deployments that occur during or after the migration will continue to be paid out to you as normal. |
|**API integrations with existing [Cloud Partner Portal APIs](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal-orig/cloud-partner-portal-api-overview)** | Existing Cloud Partner Portal APIs will continue to be supported after the migration and your existing integrations will continue to work. For more details, see [Will the Cloud Partner Portal REST APIs be supported post-migration?](#will-the-cloud-partner-portal-rest-apis-be-supported-post-migration) |
| | |

## Can I still access the Cloud Partner Portal and manage my offers during migration?

All offers have been migrated to Partner Center. The migration period for each offer should have been less than 24 hours. After your offer was migrated, you should have received an email notification.

After your offers are migrated, they will be in read-only mode **for a limited period of time** in the Cloud Partner Portal. Their status will show "Moved to Partner Center" and include a link to your offer in Partner Center, as shown in the following screenshots. From this point, you'll manage updates to all your offers or create new offers exclusively through Partner Center,

:::image type="content" source="media/migration-faq/all-offers-2.png" alt-text="Illustrates the message given for offers that have been migrated to Partner Center":::

:::image type="content" source="media/migration-faq/offer-has-moved.png" alt-text="Illustrates the Cloud Partner Portal page for a migrated offer.":::

## How will I create new offers?

From the Cloud Partner Portal, you'll be directed to create new offers in Partner Center

:::image type="content" source="media/migration-faq/create-new-offer-1.png" alt-text="Illustrates the menu to create a new offer in Cloud Partner Portal":::

After you select a new offer, you'll see a message, such as the following.

:::image type="content" source="media/migration-faq/create-new-offer-2.png" alt-text="Illustrates the message received when creating a new offer in CPP":::

## Do I need to create a new account to manage offers in Partner Center?

No. Your underlying account will be preserved, and you should already be managing it in Partner Center. This means that if you're an existing partner, you can use your existing Cloud Partner Portal account credentials to log into Partner Center post-migration. Only offers and the associated management experience are moving from the Cloud Partner Portal to Partner Center. We ask that you don't create any new accounts as your offers won't be associated with the new account.

## I see a message in the Cloud Partner Portal to activate my account, what does this mean?

We need a few more details from you in order to properly migrate your account to Partner Center and enable you to manage your offers in Partner Center after the offer migration is complete. For more details about account activation, see [Account migration from Cloud Partner Portal to Partner Center](https://docs.microsoft.com/azure/marketplace/partner-center-portal/account-migration-from-cpp-to-pc).

The steps required to complete the account activation vary based on your account role.

| Account role | Activation steps |
|--------------|----------------|
|Owner | Go to the [Publisher Profile](https://cloudpartner.azure.com/#profile) page in the Cloud Partner Portal and then click the link in the banner to activate. You'll be redirected to Partner Center to complete the account activation. |
| Contributor | Only a user in the account with an owner role can activate the account. Contact your account owners to complete the account activation. Your account owners should be listed in the banner message. |
| | |

## I'm having trouble logging in to my account and opening a support ticket

If you can't log in to your account, you can open a [support ticket](https://partner.microsoft.com/support/v2/?stage=1).

## Where can I find documentation on the new Partner Center publishing experience?

Go to the [commercial marketplace documentation](https://docs.microsoft.com/azure/marketplace/). Then expand **Commercial Marketplace Portal in Partner Center**  > **Create a new offer** to see the help topics for creating each type of offer.

:::image type="content" source="media/migration-faq/marketplace-help-topics.png" alt-text="Illustrates the help topics for Partner Center":::

### What are the differences between Partner Center and the Cloud Partner Portal?

You might notice the following differences between the Cloud Partner Portal and Partner Center.

### Modular publishing capabilities

Partner Center provides a modular publishing option that lets you select the changes you want to publish instead of always publishing all updates at once. For example, the following screenshot shows that the only changes selected to be published are the changes to **Properties** and **Offer Listing**.

:::image type="content" source="media/migration-faq/review-and-publish-migration.png" alt-text="Illustrates the Preview and Publish page":::

The updates that you don't publish are saved as drafts. Continue to use your offer preview to verify your offer before making it live to the public.

### Rich text format

Enhance your offer and plan description using the Rich Text Editor on the Offer Listing and Plan Listing page.

:::image type="content" source="media/migration-faq/rich-text-editor-migration.png" alt-text="Illustrates the rich text editor":::

### Enhanced preview options

Partner Center includes a [compare feature](https://docs.microsoft.com/azure/marketplace/partner-center-portal/update-existing-offer#compare-changes-to-marketplace-offers) with improved filtering options. This gives you the ability to compare against the preview and live versions of the offer.

:::image type="content" source="media/migration-faq/enhanced-preview.png" alt-text="Illustrates the compare feature":::

### Branding and navigation changes

You'll notice some branding changes. For example, "SKUs" are branded as "Plans" in Partner Center.

:::image type="content" source="media/migration-faq/plan-overview-migration.png" alt-text="Illustrates the plan overview.":::

Also, the information you used to provide in the **Marketplace** or S**torefront Details** (Consulting Service, Power BI app) pages in the Cloud Partner Portal is collected in the **Offer listing** page in Partner Center.

:::image type="content" source="media/migration-faq/offer-listing-migration.png" alt-text="Illustrates the offer listing page.":::

The information you used to provide for SKUs in a single page in the Cloud Partner Portal may now be collected throughout several pages in Partner Center:

* Plan set up page
* Plan listing page
* Plan availability page
* Plan technical configuration page, as shown in this screenshot.

:::image type="content" source="media/migration-faq/tech-config-migration.png" alt-text="Illustrates the Plan technical configuration page.":::

Your offer ID is now shown on the left-navigation bar of the offer.

:::image type="content" source="media/migration-faq/offer-id-offer-overview.png" alt-text="Illustrates the left navigation menu with the offer ID.":::

### Stop selling an offer

You can request to [stop selling an offer](https://docs.microsoft.com/azure/marketplace/partner-center-portal/update-existing-offer#stop-selling-an-offer-or-plan) on the marketplace directly from the Partner Center portal. The option is available on the **Offer overview** page for your offer.

:::image type="content" source="media/migration-faq/stop-selling-migration.png" alt-text="Illustrates the Offer Overview page with the stop selling option.":::

## What pages in Partner Center correspond to pages I used in the Cloud Partner Portal?

The following table shows corresponding links between the two portals.

| Page | Cloud Partner Portal link | Partner Center link |
|------|---------------------------|---------------------|
| **All offers page** | https://cloudpartner.azure.com/#alloffers | https://partner.microsoft.com/dashboard/commercial-marketplace/overview |
| **All publishers page** | https://cloudpartner.azure.com/#publishers | https://partner.microsoft.com/dashboard/account/v3/publishers/list |
| **Publisher profile** | https://cloudpartner.azure.com/#profile | https://partner.microsoft.com/dashboard/account/management |
| **Users page** | https://cloudpartner.azure.com/#users | https://partner.microsoft.com/dashboard/account/usermanagement |
| **History page** | https://cloudpartner.azure.com/#history | The History feature is not yet supported in Partner Center. |
| **Insights dashboard** | https://cloudpartner.azure.com/#insights | https://partner.microsoft.com/dashboard/commercial-marketplace/analytics/summary |
| **Payout report** | https://cloudpartner.azure.com/#insights/payout | https://partner.microsoft.com/dashboard/payouts/reports/incentivepayments |
| | |

## Will the Cloud Partner Portal REST APIs be supported post-migration?

The Cloud Partner Portal APIs are integrated with Partner Center and will continue to work after your offers are migrated to Partner Center. The integration introduces small changes. Review the changes in the table below to ensure your code continues to work after the migration to Partner Center.

| **API** | **Change description** | **Impact** |
| ------- | ---------------------- | ---------- |
| POST Publish, GoLive, Cancel | For migrated offers, the response header will have a different format but will continue to work in the same way, denoting a relative path to retrieve the operation status. | When sending any of the corresponding POST requests for an offer, the Location header will have one of two format depending on the migration status of the offer:<ul><li>Non-migrated offers<br>`/api/operations/{PublisherId}${offerId}$2$preview?api-version=2017-10-31`</li><li>Migrated offers<br>`/api/publishers/{PublisherId}/offers/{offereId}/operations/408a4835-0000-1000-0000-000000000000?api-version=2017-10-31`</li> |
| GET Operation | For offers that previously supported 'notification-email' field in the response, this field will be deprecated and no longer returned for migrated offers. | For migrated offers, we'll no longer send notifications to the list of emails specified in the requests. Instead, the API service will align with the notification email process in Partner Center to send emails. Specifically, notifications will be sent to the email address set in the Seller contact info section of your Account settings in Partner Center, to notify you of operation progress.<br><br>Review the email address set in the Seller contact info section in the [Account settings](https://partner.microsoft.com/dashboard/account/management) in Partner Center to ensure the correct email is provided for notifications.  |
| | | |
