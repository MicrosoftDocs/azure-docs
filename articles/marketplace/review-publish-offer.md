---
title: Review and publish an offer to Microsoft commercial marketplace
description: Use Partner Center to submit your offer to preview, preview your offer, and then publish it to the Microsoft commercial marketplace.
author: dsindona 
ms.author: dsindona 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 06/15/2020
---

# Review and publish an offer to commercial marketplace

This article shows you how to use Partner Center to submit your offer to preview, preview your offer, and then publish it to the Microsoft commercial marketplace. You must have already created an offer that you want to publish.

## Go to your offer in commercial marketplace

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home).
1. In the left-navigation menu, select **Commercial Marketplace** > **Overview**.
1. On the **Overview** tab, under **Offers**, in the **Offer alias** column, select the offer you want to preview and publish.

## Submit your offer to preview

1. To submit your offer to preview, select **Review and publish** at the upper-right corner of the portal. The **Review and publish** page appears.
1. Make sure that the **Status** column for each page says **Complete**. The three possible statuses are as follows:
   - **Not started** – The page has not been touched and needs to be completed.
   - **Incomplete** – The page is missing required information or has errors that need to be fixed. You'll need to go back to the section and update it.
   - **Complete** – The page is complete. All sections of the offer must be in a complete state before you can submit the offer.
1. If any of the pages have a status other than **Complete**, in the **Page** column, select the page name, correct the issue, save the page, and then select **Review and publish** again to return to this page.
1. After all the pages are complete, in the **Notes for certification** box, provide testing instructions to the certification team to ensure that your app is tested correctly. Provide any supplementary notes helpful for understanding your app.
1. To submit the offer for publishing, select **Publish**. The **Offer overview** page appears and shows the publishing status.

## Validation and publishing steps

After you select **Publish**, the validation and publishing processes proceed in order. The most common publishing process is shown in this table:

| Phase | What happens | Average completion time | 
| ------------ | ------------- | ------------- |
| Automated validation | We process a set of automated validations. | < two hours |
| Certification | We conduct manual validations. | < two business days |
| Preview creation | We create a version of your offer to only the audience you specified in the Preview section of your offer. | < one hour |
| Publisher signoff | We send you an email with a request for you to preview and approve your offer. | N/A |
| Publish | We run a series of steps to verify that the live offer is configured like the preview version of the offer. | < 2.5 hours |
|||

For detailed information about checking the status of your offer and the verification steps done during the publishing phases, see [Check the publishing status of your Commercial marketplace offer](./partner-center-portal/publishing-status.md).

## Automated validation phase

The first step in the publishing process is a set of automated validations. Each validation step corresponds to a feature you enabled when you created the offer. Each validation check must be completed before the offer can advance to the next step in the publishing process.

For details about the checks that are done during this phase, see [Automated validation](./partner-center-portal/publishing-status.md#automated-validation).

## Certification phase

Before being published, offers submitted to the commercial marketplace must be certified. Submitted offers undergo rigorous testing, some automated and others manual, including a check against the externally published policies.

Offer submissions must be marked eligible for certification before they proceed to the next publishing step. For details about the validation steps we perform during the certification phase, see [Certification](./partner-center-portal/publishing-status.md#certification).

## Preview creation phase

During the preview creation phase, we create a version of your offer that will be accessible to only the audience you specified on the **Preview** page of your offer, if any.

## Publisher signoff phase

When the offer is ready for you to review and signoff, we’ll send you an email. You can also refresh the **Offer overview** page in your browser to see if your offer has reached the Publisher signoff phase. If it has, the **Go live** button and preview links will be available.

The following screenshot shows the **Offer overview** page for a SaaS offer. The validation steps you’ll see on this page vary depending on the offer type and the selections you made when you created the offer.

:::image type="content" source="./partner-center-portal/media/publish-status-publisher-signoff.png" alt-text="Illustrates the Offer overview page for an offer in Partner Center. The Go live button and preview links are shown.":::

**To preview your offer and signoff**
1. On the **Offer overview** page, to preview your offer, select the link under the **Go live** button.
   > [!NOTE]
   > There will be a link for AppSource preview, Azure Marketplace preview, or both. If you chose to sell your offer through Microsoft, you can test the acquisition and deployment of your offer to ensure it meets your requirements during this stage.
1. If you want to make changes after previewing the offer, you can edit and resubmit to publish a new preview. For more information, see [Update existing marketplace offers](./partner-center-portal/publishing-status.md#update-existing-marketplace-offers).
   > [!NOTE]
   > Your offer won’t be available in the public marketplace yet.
1. After you approve your preview, to publish your offer live to the commercial marketplace, select **Go live**.
   > [!TIP]
   > If your offer is already live and available to the public in the marketplace, any updates you make won't go live until you select **Go live**.

## Publish phase

Now that you’ve chosen to go live with your offer, making it available in the commercial marketplace, there are a series of final validation checks that we do to ensure that the live offer is configured just like the preview version of the offer. This process takes less than 2.5 hours to complete. After these validation checks have completed, your offer will be live in the marketplace.

For details about the steps we perform during this phase, see [Publish](./partner-center-portal/publishing-status.md#publish)

## Next step

[Access analytic reports for the commercial marketplace in Partner Center](./partner-center-portal/analytics.md)