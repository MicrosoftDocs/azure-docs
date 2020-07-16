---
title: Review and publish an offer to Microsoft commercial marketplace
description: Use Partner Center to submit your offer to preview, preview your offer, and then publish it to the Microsoft commercial marketplace.
ms.reviewer: dannyevers 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: mingshen-ms 
ms.author: mingshen
ms.date: 07/05/2020
---

# Review and publish an offer to commercial marketplace

This article shows you how to use Partner Center to submit your offer to preview, preview your offer, and then publish it to the Microsoft commercial marketplace. We also cover how to check your publishing status as it proceeds through the publishing steps. You must have already created an offer that you want to publish.

## Go to your offer in commercial marketplace

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home).
1. In the left-navigation menu, select **Commercial Marketplace** > **Overview**.
1. On the **Overview** tab, under **Offers**, one of the following status indicators is displayed in the **Status** column for each offer.
 
    | Status | Description |
    | ------------ | ------------- |
    | Draft | Offer has been created but it isn't being published. |
    | Publish in progress | Offer is working its way through the publishing process. |
    | Attention needed | We discovered a critical issue during certification or during another publishing phase. |
    | Preview | We certified the offer, which now awaits a final verification by the publisher. Select **Go live** to publish the offer live. |
    | Live | Offer is live in the marketplace and can be seen and acquired by customers. |
    | Pending stop sell | Publisher selected "stop sell" on an offer or plan, but the action has not yet been completed. |
    | Not available in the marketplace | A previously published offer in the marketplace has been removed. |
    |||

4. In the **Offer alias** column, select the offer you want to preview and publish.

## Submit your offer to preview

1. To submit your offer to preview, select **Review and publish** at the upper-right corner of the portal. The **Review and publish** page appears.
1. Make sure that the **Status** column for each page says **Complete**. The three possible statuses are as follows:
   - **Not started** – The page has not been touched and needs to be completed.
   - **Incomplete** – The page is missing required information or has errors that need to be fixed. You'll need to go back to the page and update it.
   - **Complete** – The page is complete. All required data has been provided and there are no errors.
1. If any of the pages have a status other than **Complete**, in the **Page** column, select the page name, correct the issue, save the page, and then select **Review and publish** again to return to this page.
1. After all the pages are complete, in the **Notes for certification** box, provide testing instructions to the certification team to ensure that your app is tested correctly. Provide any supplementary notes helpful for understanding your app.
1. To submit the offer for publishing, select **Publish**. The **Offer overview** page appears and shows the publishing status.

## Validation and publishing steps

After you select **Publish**, the validation and publishing processes proceed in order. The most common publishing process is shown in this table:

| Phase | What happens | 
| ------------ | ------------- | ------------- |
| Automated validation | We process a set of automated validations. | 
| Certification | We conduct manual validations. | 
| Preview creation | The listing page for your offer preview is available to anyone who has the preview link. If your offer will be sold through Microsoft (transactable), only the audience you specified on the **Preview audience** page of your offer can purchase and access the offer for testing. | 
| Publisher signoff | We send you an email with a request for you to preview and approve your offer. | 
| Publish | We run a series of steps to verify that the preview offer is published live to the commercial marketplace. | 
|||

## Automated validation phase

The first step in the publishing process is a set of automated validations. Each validation step corresponds to a feature you chose when you created the offer. Each validation check must be completed before the offer can advance to the next step in the publishing process.

- **Offer purchase flow setup (<10 min)**

   In this step, we ensure that your offer can be fulfilled when purchased by customers through the Azure portal. This step is only applicable for offers being sold through Microsoft.
- **Test drive data validation (~5 min)**

   In this step, we validate the data you provided on the Technical configuration page of the offer. Test drive functionality is tested and approved. This step is only applicable for offers with a test drive enabled.

-	**Test drive provisioning (~30 min)**

    In this step, after validating the data and functionality of your test drive in the previous step, we deploy and replicate instances of your test drive so that they are ready for customer use. This step is only applicable for offers with a test drive enabled.

-	**Lead management validation and registration (<15 min)**

    In this step, we confirm that your lead management system can receive customer leads based on the details you provided on the **Offer setup** page. This step is only applicable for offers with lead management enabled.

## Certification phase

Before being published, offers submitted to the commercial marketplace must be certified. Submitted offers undergo rigorous testing, some automated and others manual. Review the [commercial marketplace certification policies](https://aka.ms/commercial-marketplace-certification-policies) to learn more.

### Types of validation that take place during certification
There are three levels of validation included in the certification process for each submitted offer.
-	Publisher business eligibility
-	Content validation
-	Technical validation

#### Publisher business eligibility
Each offer type checks a set of base eligibility criteria that the publisher must meet. Eligibility criteria may include the publisher's MPN status, competencies held, competency levels, and so on.

#### Content validation

The information entered when you created your offer is checked for quality and relevance. These checks will review your entries for the marketplace listing details, pricing, availability, associated plans, and so on. To meet the listing criteria of Azure Marketplace and Microsoft AppSource, we will validate that your offer includes:
-	A title that accurately describes the offer
-	Well-written descriptions that provide a thorough overview and value proposition
-	Quality screenshots and videos
-	An explanation of how the offer utilizes Microsoft platforms and tools.

Learn more regarding the content validation criteria by reading the [general listing policies](https://aka.ms/commercial-marketplace-certification-policies#100-general).

#### Technical validation
During technical validation, the offer (package or binary) undergoes the following checks.
-	Scanned for malware
-	Network calls monitored
-	Package analyzed
-	Thorough scanning of the offer's functionality

The offer is tested across various platforms and versions to ensure it’s robust.

### Certification failure report

If your offer fails any of the listing, technical, or policy checks, or if you are not eligible to submit an offer of that type, we email a certification failure report to you.

This report contains descriptions of any policies that failed, along with review notes. Review this email report , address any issues, make updates to your offer where needed, and resubmit the offer using the [commercial marketplace portal](https://partner.microsoft.com/dashboard/commercial-marketplace/offers) in Partner Center. You can resubmit the offer as many times as needed until passing certification.

## Preview creation phase

During the preview creation phase, we create a version of your offer that will be accessible to only the audience you specified on the **Preview audience** page of your offer, if any. The preview version of your offer won’t be available to anyone outside the preview audience until you publish the offer live.

> [!NOTE]
> Do not use the preview audience to give people outside your organization visibility into an offer. Use the Private Offer option instead. At this point, your offering has not been fully tested and validated, and is not ready for outside distribution. 

## Publisher signoff phase

When the offer is ready for you to review and signoff, we’ll send you an email to request that you review and approve your offer preview. You can also refresh the **Offer overview** page in your browser to see if your offer has reached the Publisher signoff phase. If it has, the **Go live** button and preview links will be available.

The following screenshot shows the **Offer overview** page for a SaaS offer. The validation steps you’ll see on this page vary depending on the offer type and the selections you made when you created the offer.

![Illustrates the Offer overview page for an offer in Partner Center. The Go live button and preview links are shown.](./partner-center-portal/media/publish-status-publisher-signoff.png)

**To preview your offer and signoff**
1. On the **Offer overview** page, to preview your offer, select the link under the **Go live** button.
   > [!NOTE]
   > There will be a link for either AppSource preview, Azure Marketplace preview, or both depending on the options you chose when creating your offer. If you chose to sell your offer through Microsoft, anyone who has been added to the preview audience can test the acquisition and deployment of your offer to ensure it meets your requirements during this stage.

1. If you want to make changes after previewing the offer, you can edit and resubmit to publish a new preview. For more information, see [Update an existing offer in the commercial marketplace](./partner-center-portal/update-existing-offer.md).

1. After you approve your preview, to publish your offer live to the commercial marketplace, select **Go live**.
   > [!TIP]
   > If your offer is already live and available to the public in the marketplace, any updates you make won't go live until you select **Go live**.

## Publish phase

Now that you’ve chosen to go live with your offer, making it available in the commercial marketplace, there are a series of final validation checks that we do to ensure that the live offer is configured just like the preview version of the offer.

-	**Offer purchase flow setup (>10 min)**

    In this step, we ensure that your offer can be fulfilled when purchased by customers through the Azure portal. This step is only applicable for offers being sold through Microsoft.
-	**Test drive data validation (~5 min)**

    In this step, we validate the data you provided on the Technical configuration page of the offer. Test drive functionality is tested and approved. This step is only applicable for offers with a test drive enabled.

-	**Test drive provisioning (~30 min)**

      In this step, we deploy and replicate instances of your test drive so that they are ready for customer use. This step is only applicable for offers with a test drive enabled.
-	**Lead management validation and registration (>15 min)**

    In this step, we confirm that your lead management system can receive customer leads based on the details provided on the **Offer setup** page of the offer. This step is only applicable for offers with lead management enabled.

-	**Final publish (>30 minutes)**

    In this step, we ensure that your offer becomes publicly available in the marketplace.

After these validation checks have completed, your offer will be live in the marketplace.

## Next step

[Access analytic reports for the commercial marketplace in Partner Center](./partner-center-portal/analytics.md)