---
title: Microsoft 365 app publishing checklist 
description:  Use this checklist to determine if your Microsoft 365 app is ready to be published.
ms.author: siraghav
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
ms.date: 7/23/2022
---

# Am I ready to publish?

Before submitting your Microsoft 365 app for review, make sure it’s ready to be released to customers and that you’re making the most of your app description page that customers will see when they download your app.

## Submission checklist

This is a checklist to help you ensure your submission and review go smoothly.

### Step 1: Determine your launch timeline

Submitting your app for review can take up to four weeks from first submission until final approval, so preparation is crucial.

Make sure include time in your deployment schedule for our team to not only review your app, but for changes to be made to your app if needed.

> [!NOTE]
> Your validation application may not be approved at first submission. This is common if this is your team’s first time submitting an app.

### Step 2: Review all the Microsoft 365 app policies

Make sure you read through our [Microsoft 365 app general policies here](/legal/marketplace/certification-policies). Additionally, read through the policies that pertain to the Microsoft 365 product your app is targeting:

- [Office 365](/legal/marketplace/certification-policies#1100-office-365) and [Office Add-ins](/legal/marketplace/certification-policies#1120-office-add-ins) for apps targeting Outlook, Word, Excel, and PowerPoint
- [Teams apps](/legal/marketplace/certification-policies#1140-teams)
- [Power BI visuals and template apps](/legal/marketplace/certification-policies#1180-power-bi-visuals)
- [SharePoint Add-ins](/legal/marketplace/certification-policies#1160-sharepoint) or [SharePoint Framework (SPFx)](/legal/marketplace/certification-policies#1170-sharepoint-framework-solutions)

### Step 3: Check that your manifest is compliant

There are several tools you can use to self-test your manifest file. These tools use the same package validation service we use in our review process. This will help ensure you pass our automated testing before you submit.

- [Find the best tool for self-testing your manifest](/office/dev/add-ins/testing/troubleshoot-manifest#:~:text=%20To%20use%20a%20command-line%20XML%20schema%20validation,and%20replace%20XML_FILE%20with%20the%20path...%20More%20)

### Step 4: Decide what platforms you will support

If you are supporting Apple iOS or Android, make sure you have your correct ID information associated with your Partner Center Profile.

For example, for an app available on iOS, you will need to have your Apple ID in your Partner Center account settings page.

Note that Outlook is the only Microsoft 365 product that supports Android. Learn how to configure this in Partner Center before you submit here.

### Step 5: If your app requires additional purchases from third party services or SaaS offers, provide testing information for these services

Make sure you have any third party service information ready to include in your submission. In the submission process, you’ll first need to check the additional purchases box, as shown in the following image.

![Additional purchases step with unchecked box indicating a service must be purchased or in-app purchases are offered](./media/office-store-new/additional-purchases.png)

Next, you’ll need to provide license keys, sample accounts, test credentials and any other critical instructions to our review team so that the process for getting the in-app purchase can be tested by our review team. This information should go in the Notes for certification box, as shown in the following picture.

Your test plans and any testing accounts and instructions need to be included here

### Step 6: Include critical information links with https:// URLs

The addresses for a support URL, a privacy policy URL, and an end user license agreement (EULA) URL  are required. One of the top reasons an app submission fails our validation process is when these links are not included in submission. The following image shows the box that asks for the support information.

![Support information fillable form fields](./media/add-in-submission-guide/step-5-b-validation.jpg)

#### Make sure you provide a link to your support page so that your users can reach you if they have a problem

Provide a URL for so the customers who have issues with your app can contact your company for support.

> [!NOTE]
> This cannot be an email address, it must be an https:// URL.

#### Ensure your company has a privacy policy that includes your app

Provide the URL for the privacy policy for your app.

The privacy policy you link to must include:

- Information on your policies regarding users’ personal information
- A reference to the app OR your service overall, not only your website
- A description of your service that includes the name of the app you are submitting
- A valid link that does not generate a 404 error

If your privacy policy is missing any of the above, it will fail validation and require re-submission.

>[!NOTE]
> A Terms of Use policy is not considered a privacy policy. You must include a privacy policy that is separate from your Terms of Use policy.

#### Include an End User License Agreement

Make sure you have an https:// URL for your EULA policy ready when you submit. If you don’t already have one and you have consulted with your legal council, you can use [this one from Microsoft](https://support.office.com/client/61994a3b-2c87-41c4-a88d-a6455efa362d). 

### Step 7: Prepare your store listing with your team

Your final step in preparing your submission is to fill out a marketplace listing that will appear in the store to customers. This listing includes the copy in your listing, your branding, your app name and any screenshots and videos you want to use to promote it.

You'll need to provide the correct metadata indicating how you want your app to be listed in the store, including:

- Your app name
- A short description of your app and its value.
- A long description of your app with HTML formatting

> [!TIP]
> We recommend you use an HTML editor to create your descriptions ahead of time, so that you can preview how it looks before you paste it into the description fields. There isn't a preview in our submission process. Otherwise, you may have to re-submit your app for review again to fix any formatting issues or typos.

![Marketplace listing form](./media/office-store-new/step-7-marketplace-listing.png)

You'll also need to provide:

- Correct icons that are the right sizes.
- Any screenshots and video demos. Read [our tips](./craft-effective-appsource-store-images.md) on doing this effectively. One screen shot is required.  

## Next steps

Read our [step-by-step submission guide](./add-in-submission-guide.md) to learn how to submit your app for validation.
