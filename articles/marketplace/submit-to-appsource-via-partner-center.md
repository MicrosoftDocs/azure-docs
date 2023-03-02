---
title: Make your solutions available in Microsoft AppSource and within Office 
description: Upload Office Add-ins and SharePoint Add-ins to Microsoft AppSource via Partner Center.
ms.author: siraghav
ms.topic: article
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.date: 01/10/2022
---

# Make your solutions available in Microsoft AppSource and within Office

Microsoft AppSource provides a convenient location for you to upload new Office and SharePoint Add-ins, Microsoft Teams apps, and Power BI visuals that provide solutions for both consumers and businesses. When you add your app solution to Microsoft AppSource, you also make it available in the in-product experience within Office. To include your solution in Microsoft AppSource and within Office, you submit it to [Partner Center](https://partner.microsoft.com/dashboard/marketplace-offers/overview). You need to create an individual or company account and, if applicable, add payout information. For details, see the following:

- [Create a developer account](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/office). After you create your account, it goes through an approval process.
  - For details about the registration process, see [Opening a developer account](open-a-developer-account.md).
  - For details about managing settings and additional users in your Partner Center account, see [Manage account users](manage-account-settings-and-profile.md).
- [Submit your solution to Microsoft AppSource via Partner Center](submit-to-appsource-via-partner-center.md).

> [!NOTE]
> Office VSTO add-ins and COM add-ins cannot be submitted to Microsoft AppSource. For more about the distinction between types of Office add-ins, see [How are Office Add-ins different from COM and VSTO add-ins?](/office/dev/add-ins/overview/office-add-ins#how-are-office-add-ins-different-from-com-and-vsto-add-ins).

For information about how to submit, validate, and publish Microsoft Teams apps, see [Teams apps submission details](/microsoftteams/platform/concepts/deploy-and-publish/appsource/publish).

For information about how to submit, validate, and publish your SharePoint Framework (SPFx) solution apps, see [SPFx solutions submission details](/sharepoint/dev/spfx/publish-to-marketplace-checklist).

For information about how to submit Power BI custom visuals to Microsoft AppSource, see [Publish custom visuals](/power-bi/developer/office-store).

<a name="bk_approval"> </a>
## Approval process

After your account is approved, you can submit your solution to Partner Center. You can make changes at any point before you submit your solution for approval. During the approval process, you can make changes to your submission, but you can’t submit them for publishing until your current submission is complete.

> [!NOTE]
> If you're submitting a Microsoft Teams app, see [Tips for a successful app submission](/microsoftteams/platform/publishing/office-store-approval). This will help to ensure timely approval of your submission.

In order for your submission to be approved:

- It must be free of viruses. If you need virus detection software, see the [Microsoft Safety & Security Center](https://go.microsoft.com/fwlink/?LinkId=248711).
- It must not contain inadmissible or offensive material.
- It must be stable and functional.
- Any material that you associate with your apps or add-ins, such as descriptions and support documentation, must be accurate. Use correct spelling, capitalization, punctuation, and grammar in your descriptions and materials.
- If you want a tailored experience for users in a regional store, you can add additional languages so that your add-in appears in another language store with localized metadata. Your service and your add-in manifest must be updated appropriately. You must also provide descriptions for each language you add.
- If your free app or add-in contains an in-app purchase, the Microsoft AppSource listing for your add-in will reflect this by stating 'Additional purchase may be required' under the pricing options.

For more details about Microsoft AppSource requirements, see the [Certification policies](/legal/marketplace/certification-policies).

<a name="bk_Validation"> </a>

## Certification process

After you submit your solution:

1. Your submission goes through a series of automated checks to ensure that it complies with the [certification policies](/legal/marketplace/certification-policies).

2. The validation team reviews your submission. This can take 3-5 working days, depending on the volume of submissions in the queue. (Teams and SPFx apps submissions are validated in 24 hours.)

   > [!NOTE]
   > The validation team tests Office Add-ins on all the platforms that the add-in is required to support. For details about supported platforms, see the [Office Add-ins host and platform availability page](/office/dev/add-ins/overview/office-add-in-availability).

   For a seamless certification experience, provide detailed test notes with your submission, including:

   - Information about any sample data your app or add-in needs.
   - Configuration instructions, if required.
   - Information about a test or demo account that your app or add-in needs.

   > [!NOTE]
   > Because our team is located in multiple time zones, we request that you do not configure test accounts that require developer interaction before we can test.

3. When the certification process is complete, you receive a message to let you know that either your submission is approved, or you need to make changes and resubmit it.

### Check the status of your submission in Partner Center

You can also follow these steps to check the status of your submission in Partner Center.

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/marketplace-offers/overview).
1. In the **Offer alias** column, select the Office add-in or app you want.
1. On the **Product overview** page, the status of your submission will be one of the following:
    - Pre-processing
    - Certification
    - Published

      > [!NOTE]
      > After your product is certified, there might be a delay before it is published. After certification, a product typically appears in Microsoft AppSource within one hour.

1. If the status is **Attention needed**, your submission needs changes to be approved. For details about the required changes, on the **Product overview** page, select **View report**.

If you make changes after your submission is certified, it must go through the certification process again.

If you have general questions about policies, processes, or validation requirements, you can engage with the Microsoft AppSource validation team via [Stack Overflow](https://stackoverflow.com/search?q=office-store). Tag your question with "Office-Store". Please be aware that the validation team will not be able to discuss individual submission results on Stack Overflow.

## Microsoft 365 App Compliance

After your solution is published through Partner Center, you can begin the [Microsoft 365 App Compliance program](/microsoft-365-app-certification/overview). This program is optional and is designed to allow you to reach the level of security that meets the needs of your customers. To complete the Publisher Attestation within Partner Center, click the **App Compliance** button in the Office Store section. For details, see the [User guide](/microsoft-365-app-certification/docs/userguide).

## See also

- [Office Add-ins](/office/dev/add-ins/overview/office-add-ins)  
- [SharePoint Add-ins](/sharepoint/dev/sp-add-ins/sharepoint-add-ins)
- [Microsoft Teams developer platform](/microsoftteams/platform/overview)
- [Visuals in Power BI](/power-bi/power-bi-custom-visuals)
- [Microsoft 365 App Compliance](/microsoft-365-app-certification/overview)
