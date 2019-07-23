---
title: Check the publishing status of your Commercial Marketplace offer
description: Check the status of the validation, certification, and preview steps required to publish an offer via the Commercial Marketplace in Microsoft Partner Center. 
author: mattwojo 
manager: evansma
ms.author: mattwoj 
ms.service: marketplace 
ms.topic: conceptual
ms.date: 05/30/2019
---

# Check the publishing status of your Commercial Marketplace offer

You can view your current **Publishing status** on the **Offer overview** tab of the [Commercial Marketplace portal](https://partner.microsoft.com/dashboard/commercial-marketplace/offers) in Partner Center.

One of the following status indicators should be displayed for each offer.

| **Status**    | **Description**  |
| :---------- | :-------------------|
| **Draft** | Offer has been created but it isn’t being published. |
| **Publish in progress** | Offer/Plan is working its way through the steps of the publishing process. |
| **Attention needed** | A critical issue was discovered during certification by Microsoft or any of the publishing steps. |
| **Preview** | Offer was certified by Microsoft, and now awaits a final verification by the publisher. Select go live to make the offer live. |
| **Live** | Offer is live in the marketplace and can be seen and acquired by customers. |
| **Pending stop sell** | Publisher selected "stop sell" on offer or plan, but the action has not yet been completed. |
| **Not available in the marketplace** | A previously published offer/plan in the marketplace has been removed. |

## Automated validation

The first step in the publishing process is a set of automated validations. Each validation step corresponds to a feature you chose to enable in the creation of your offer. If that feature was not enabled, the validation skips ahead to the next publishing step. Each validation check must be completed before the publishing status is approved.

- **Offer purchase flow setup (<10 min)**

In this step, we ensure that your offer can be fulfilled when purchased by customers through the Azure portal. This step is only applicable for offers being sold through Microsoft.

- **Test drive data validation (~5 min)**

In this step, we validate the data you provided in the test drive Technical configuration section of the offer. Test drive functionality is tested and approved. This step is only applicable for offers with a test drive enabled.

- **Test drive provisioning (~30 min)**

In this step, after validating the data and functionality of your test drive in the previous step, we deploy and replicate instances of your test drive so that they are ready for customer use.  This step is only applicable for offers with a test drive enabled.

- **Lead management validation and registration  (<15 min)**

In this step, we confirm that your lead management system can receive customer leads based on the details provided in the Offer setup. This step is only applicable for offers with Lead management enabled.

## Certification

Before being published, offers submitted to the Commercial Marketplace in Partner Center must be certified. Submitted offers undergo rigorous testing, some automated and others manual, including a check against the [Azure Marketplace certification policies](https://docs.microsoft.com/legal/marketplace/general-policies). Offer submissions must be marked eligible for certification before they proceed to the next step in the publishing flow.

### Types of validation that take place during certification

There are three levels of validation included in the certification process for each offer submitted.

- Publisher business eligibility
- Content validation
- Technical validation

#### Publisher business eligibility

Each offer type checks a set of base eligibility criteria that the publisher must meet. Eligibility criteria may include the publisher's MPN status, competencies held, competency levels, etc.

#### Content validation

During content validation, the information entered when you created your offer are checked for quality and relevance. These checks will review your entries for the marketplace listing details, pricing, availability, associated plans, etc. To meet the Azure Marketplace and/or AppSource listing criteria, we will validate that your offer includes:

- a title that accurately describes the offer;
- well-written descriptions that provide a thorough overview and value proposition;
- quality screenshots and accompanying videos; and
- an explanation of how the offer utilizes Microsoft platforms and tools.

Learn more regarding the content validation criteria by reading the [general listing policies](https://docs.microsoft.com/legal/marketplace/certification-policies#100-general-policies).

#### Technical validation

During technical validation, the offer (package or binary) undergoes the following checks.
- Scanned for malware
- Network calls monitored
- Package analyzed
- Thorough scanning of the offer's actual functionality

The offer is tested across various platforms and versions in order to ensure it is robust.

Review the specific configuration details required for your offer in the  Technical configuration section of this document.

### Certification failure report

Upon completion of the review, if your offer has passed certification then it moves along to the next step in the publishing process. If your offer has failed any of the listing, technical, or policy checks, or if you are not eligible to submit an offer of that type, a certification failure report is generated and emailed to you.

This report contains descriptions of any policies that failed, along with review notes. Review this email report, address any issues, making updates to your offer where needed, and resubmit the offer using the [Commercial Marketplace portal](https://partner.microsoft.com/dashboard/commercial-marketplace/offers) in Partner Center. (You can resubmit the offer as many times as needed until passing certification).

## Preview creation

During the **Preview creation** step, we create a version of your offer accessible to only the audience that you specified in the Preview section of your offer.

## Publisher approval

In this step, you will be emailed with a request for you to review and approve your offer preview prior to the final publishing step.

If you have selected to sell your offer through Microsoft, you will be able to test the acquisition and deployment of your offer to ensure that it meets your requirements during this preview approval stage. Your offer will not yet be available in the pubic marketplace. Once you test and approve this preview, you will need to select **Go-Live** on the [**Offer Overview**](https://partner.microsoft.com/dashboard/commercial-marketplace/overview) dashboard.

If you want to make changes to the offer during this preview stage, you may edit and resubmit to publish a new preview. See the article [Update existing marketplace offers](#update-existing-marketplace-offers) for details on more changes.

If your offer is already live and available to the public in the marketplace, any updates you make won't go live until you select **Go-live** on the [**Offer Overview**](https://partner.microsoft.com/dashboard/commercial-marketplace/overview) dashboard.

### Publish offer to the public

Sign in to Partner Center and access the offer. You will be redirected to the **Offer overview** page. At the top of this page, you will see an option for **Go live**. Select **Go live,** and after confirming, the offer will start getting published to the public. You will receive an email notification when the offer is live.

## Publish

Now that you have selected to **Go live** with your offer, making it available in the marketplace, there are a series of final validation checks that will be stepped through to ensure that the live offer is configured just like the preview version of the offer.

- **Offer purchase flow setup (>10 min)**

In this step, we ensure that your offer can be fulfilled when purchased by customers through the Azure portal. This step is only applicable for offers being sold through Microsoft.

- **Test drive data validation (~5 min)**

In this step, we validate the data you provided in the test drive Technical configuration section of the offer. Test drive functionality is tested and approved. This step is only applicable for offers with a test drive enabled.

- **Test drive provisioning (~30 min)**

In this step, we deploy and replicate instances of your test drive so that they are ready for customer use.  This step is only applicable for offers with a test drive enabled.

- **Lead management validation and registration  (>15 min)**

In this step, we confirm that your lead management system can receive customer leads based on the details provided in the Offer setup. This step is only applicable for offers with Lead management enabled.

- **Final publish  (>30 minutes)**

In this step, we ensure that your offer becomes publicly available in the marketplace.

## Update existing marketplace offers

If you want to make changes to an offer you've already published, you'll need to first update the existing offer and then publish it again.

## Next steps

- [Update an existing offer in the Commercial Marketplace](./update-existing-offer.md)
