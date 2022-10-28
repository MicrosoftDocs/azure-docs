---
title: Microsoft 365 Store step-by-step submission guide
description:  Use this step-by-step submission guide to submit your app to the Microsoft stores. 
ms.topic: article
ms.author: mingshen
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.date: 08/01/2022
---

# Store step-by-step submission guide

This article is a step-by-step guide that will detail how to submit your app to Microsoft 365 Stores.

> [!TIP]
> We recommend that you read our [pre-submission checklist](./checklist.md) before reading this store submission guide so you have all information you need to submit your app.

## Step 1: Select the type of app you are submitting

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home). You can use the same username and password you use to manage Office Store products.

1. Select the **Marketplace offers** tile.

    :::image type="content" source="./media/office-store-workspaces/marketplace-offers-tile.png" alt-text="Illustrates the product GUID in the URL for an Office app.":::

1. If you see the Commercial marketplace and Office store tabs in the upper-left of the page, select the **Office store** tab.

1. Select **+ New offer** and then select the type of app you want to submit. The example screenshots in this article show an Office Add-in, but the steps apply to Teams apps, SharePoint solutions, and so on.

   :::image type="content" source="./media/add-in-submission-guide/step-select-type-of-add-in-workspaces.png" alt-text="Screenshot showing the New offer list.":::

## Step 2: Name your app

1. In the dialog box that appears, enter a name for your app.

1. Select **Check availability** to verify that the name you chose is available.

1. Associate the new offer with a _publisher_. A publisher represents an account for your organization. You may have a need to create the offer under a particular publisher. If you don’t, you can simply accept the publisher account you’re signed in to.

    > [!NOTE]
    > The selected publisher must be enrolled in the Office Store program and cannot be modified after the offer is created.

1. Select **Create**.

## Step 3: Tell us about your Product Setup

1. When filling out the **Product setup** page, you'll need to answer the following questions:

    - **Will your app be listed in the Apple Store?**
    If so, update your Apple Developer ID in Account Settings in Partner Center before publishing the app. You'll see a warning or a note to remind you to enter this information on screen. If you don’t enter this information, your app will not be available for acquisition on iOS mobile devices, but the app will appear to be available to use on iOS devices after you acquire the app on another type of device.
        > [!NOTE]
        > Only users with Developer Account Owner or Developer Account Manager roles can update Apple ID in [Account Settings](./manage-account.md).
    - **Does your app use Azure Active Directory or SSO (Azure AD/SSO)?**
    If so, select the box that asks about this.
    - **Does your app require additional purchases?**
    If so, select the box that asks about this. You will see a warning that reminds you to fill in the notes box on the review and publish page in a later step with your test credentials so a tester can verify this.
    - **Do you want to connect with your lead management CRM system?**
    If so, connect this system using the Connect link.

1. Select **Save draft** before continuing to the next page: Packages.

The following screenshot shows two yellow warning boxes on the **Product setup** page that remind you to fill in your Apple ID and provide test credentials.

:::image type="content" source="./media/add-in-submission-guide/step-3-yellow-warnings-workspaces.png" alt-text="Yellow warning box reminds you to fill in your Apple ID.":::

## Step 4: Upload your manifest for package testing

You will need to upload your manifest file to the grey box on the **Packages** page. Remember to pre-test your package to prevent any unexpected failures in this step. Get information on all [the pre-testing manifest tools](/office/dev/add-ins/testing/troubleshoot-manifest#:~:text=%20To%20use%20a%20command-line%20XML%20schema%20validation,and%20replace%20XML_FILE%20with%20the%20path...%20More%20).

When your manifest is uploaded and is correct, you will receive a confirmation and see that manifest checks have passed and that the **Status** column shows **Complete**.

:::image type="content" source="./media/add-in-submission-guide/step-4-packages-complete-upload-workspaces.png" alt-text="Screenshot showing a completed manifest upload.":::

## Step 5: Define the metadata that will categorize your app in the store

1. On the **Properties** page, select at least one and up to three categories to help your customers find your product in the marketplace.
1. You can optionally select up to two industries. If your product is not specific to an industry, do not select one.
1. Under **Legal and support info**, do one of the following:
    - Choose the **Standard Contract** check box. If you choose to use Microsoft's standard end user license agreement (EULA), you will need to select **Accept** in the confirmation dialog box that appears to confirm that you do not want to use your own agreement, as this cannot be reversed once your app is published.
    - In the **End User License Agreement (EULA) link** box, enter the link to your EULA (starting with https). 

    :::image type="content" source="./media/add-in-submission-guide/step-5-contract-eula.png" alt-text="Screenshot of the standard contract and EULA options.":::

1. In the **Privacy policy link** box, enter a link (starting with https) to your organization's privacy policy, as seen in the following screenshot. You're responsible to ensure your app complies with privacy laws and regulations, and for providing a valid privacy policy.

1. In the **Support document link** box, enter a link (starting with https) that customers will use if they have issues with your product, as seen this screenshot.

   :::image type="content" source="./media/add-in-submission-guide/step-5-privacy-support.png" alt-text="Screenshot of the privacy policy and support document link boxes.":::

    The yellow warning reminds you of the following things your privacy policy must include to pass certification:

    - Information on your policies regarding user's personal information.
    - Refer to the app or your service overall and NOT your website.
    - Your service description must include the name of app submitted.
    - A valid URL link that does not generate a 404 error.

    > [!NOTE]
    > A _Terms of Use Policy_ is not considered a privacy policy. You must include a privacy policy that is separate from your Terms of Use policy.

1. Select **Save** before continuing to the next page: Marketplace listings.

## Step 6: Define your languages in Marketplace Listings

1. To create a store entry, on the **Marketplace listings** page, select **Manage additional languages**.
1. In the dialog box that appears, select the languages your app will be in.
1. Select **Update**.

## Step 7: For each language your app is available in, create your detailed store listing

Your store listing is configured on the **Marketplace listings** page. You should include a summary, description, optional search keywords, icons, screenshots, and an optional video. For details, see [our submission checklist](./checklist.md).

To provide your listing information, select the language you want to configure under the **Language** column.

:::image type="content" source="./media/add-in-submission-guide/step-7-define-your-store-page.png" alt-text="Screenshot showing English being added to the listing.":::

## Step 8: Decide on your availability date

1. On the **Availability** page, schedule when your app will be available.

    > [!NOTE]
    > It typically takes four to six weeks to complete an app submission and get it approved. On average, most apps require multiple submissions to pass our validation process, so follow our [checklist](checklist.md) carefully to reduce this time.  

   :::image type="content" source="./media/add-in-submission-guide/step-8-set-availability-time-date-workspaces.png" alt-text="Screenshot showing product availability in a future market.":::

1. Select **Save draft** before continuing.

## Step 9:  Make sure you add your critical testing instructions

This final critical step requires you to include notes for certification. Provide any instructions for the reviewer who will be testing your app, including test accounts, license keys, and testing credentials.

If you indicated in a previous step that your app requires additional purchases, make sure you provide any information such as license keys that a reviewer might need to evaluate your app.

When you are ready to publish your app, in the upper-right of the page, select **Review and publish**.

The following screenshot shows the **Notes for certification** box where you must provide information.

:::image type="content" source="./media/add-in-submission-guide/step-9-certification-notes-workspaces.png" alt-text="Screenshot showing credentials testing.":::

In addition to _Notes for certification_, you can optionally provide additional detailed instructions for the reviewers by uploading a PDF file to the **Additional certification info** page. This option provides the following benefits:

- Enables you to include images to improve the clarity of the instructions
- The PDF file is uploaded, saved, and persisted for subsequent submissions.

The following screenshot shows where you can optionally upload a PDF file of instructions for reviewers.

:::image type="content" source="./media/add-in-submission-guide/additional-cert-info-workspaces.png" alt-text="Screenshot of the Additional Certification Info page.":::

> [!TIP]
> Do not include an email address of a company employee who can provide sign-in information. Our reviewers will **not be able to email you for sign-in information**. Applications that do not list clear instructions in the certification notes will automatically fail the submission process.

## Step 10: Use the following checklist to avoid the top five common errors that produce 80% of review rejections

Use our [pre-submission checklist](./checklist.md) to address all the things on this list.

- Did you include Terms of Use links?
- Did you include Privacy Policy links?
- Did you include Testing instructions for the Reviewer?
- Did you indicate Service or Account disclosures?
- Did you indicate any Additional Charge Disclosures for required paid services?

Once you have answered those questions for yourself, select the submit button on your app for review and approval.

## Step 11: Congratulations, you are done submitting!

Expect a response within three to four business days from our reviewers if there are any issues related to your submission.

> [!TIP]
> After publishing an offer, the [owner](./user-roles.md) of your developer account is notified of the publishing status and required actions through email and the Action Center in Partner Center. For more information about Action Center, see [Action Center Overview](/partner-center/action-center-overview).