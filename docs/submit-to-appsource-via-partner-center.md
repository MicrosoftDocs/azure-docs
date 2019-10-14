---
title: Make your solutions available in AppSource and within Office 
description: Upload Office Add-ins and SharePoint Add-ins to AppSource via the Partner Center.
localization_priority: Priority
---

# Make your solutions available in AppSource and within Office

Microsoft AppSource provides a convenient location for you to upload new Office and SharePoint Add-ins, Microsoft Teams apps, and Power BI visuals that provide solutions for both consumers and businesses. When you add your add-in solution to AppSource, you also make it available in the in-product experience within Office. To include your solution in AppSource and within Office, you submit it to [Partner Center](https://partner.microsoft.com/en-us/dashboard/office/overview). You need to create an individual or company account and, if applicable, add payout information. For details, see:

- [Register as an app developer](https://developer.microsoft.com/store/register). After you create your account, it goes through an approval process. 
  - For details about the registration process, see [Opening a developer account](open-a-developer-account.md).
  - For details about adding and managing additional users in your Partner Center account, see [Manage account users](manage-account-users.md).
- [Submit your solution to AppSource via Partner Center](use-partner-center-to-submit-to-appsource.md).

> [!NOTE]
> Office VSTO add-ins and COM add-ins cannot be submitted to AppSource. For more about the distinction between types of Office add-ins, see [How are Office Add-ins different from COM and VSTO add-ins?](https://docs.microsoft.com/en-us/office/dev/add-ins/overview/office-add-ins#how-are-office-add-ins-different-from-com-and-vsto-add-ins).

For information about how to submit Power BI custom visuals to AppSource, see [Publish custom visuals to AppSource](https://docs.microsoft.com/en-us/power-bi/developer/office-store).

<a name="bk_approval"> </a>
## Approval process

After your account is approved, you can submit your solution to Partner Center. You can make changes at any point before you submit your solution for approval. During the approval process, you can make changes to your submission, but you can’t submit them for publishing until your current submission is complete.

> [!NOTE] 
> You must submit Microsoft Teams apps for pre-approval before you submit them to AppSource via Partner Center. For details, see [Microsoft Teams app pre-approval](https://docs.microsoft.com/microsoftteams/platform/publishing/office-store-approval).

In order for your submission to be approved:

- It must be free of viruses. If you need virus detection software, see the [Microsoft Safety & Security Center](https://go.microsoft.com/fwlink/?LinkId=248711).
- It must not contain inadmissible or offensive material.
- It must be stable and functional.
- Any material that you associate with your apps or add-ins, such as descriptions and support documentation, must be accurate. Use correct spelling, capitalization, punctuation, and grammar in your descriptions and materials.
- If you want a tailored experience for users in a regional store, you can add additional languages so that your add-in appears in another language store with localized metadata. Your service and your add-in manifest must be updated appropriately. You must also provide descriptions for each language you add.
- If your free app or add-in contains an in-app purchase, the AppSource listing for your add-in will reflect this by stating 'Additional purchase may be required' under the pricing options.

For more details about AppSource requirements, see the [Validation policies](validation-policies.md).

<a name="bk_Validation"> </a>
## Certification process

After you submit your solution:

1. Your submission goes through a series of automated checks to ensure that it complies with the [validation policies](validation-policies.md).

2. The validation team reviews your submission. This can take 3-5 working days, depending on the volume of submissions in the queue.

   > [!NOTE]
   > The validation team tests Office Add-ins on all the platforms that the add-in is required to support. For details about supported platforms, see the [Office Add-ins host and platform availability page](/office/dev/add-ins/overview/office-add-in-availability).

   For a seamless certification experience, provide detailed test notes with your submission, including:

   - Information about any sample data your app or add-in needs.
   - Configuration instructions, if required.
   - Information about a test or demo account that your app or add-in needs.

   > [!NOTE]
   > Because our team is located in multiple time zones, we request that you do not configure test accounts that require developer interaction before we can test.

3. When the certification process is complete, you receive a message to let you know that either your submission is approved, or you need to make changes and resubmit it. You can also follow these steps to check the status of your submission in Partner Center:

   - Sign in to [Partner Center](https://partner.microsoft.com/en-us/dashboard/office/overview).
   - On the **Product overview** page, the status of your submission will be one of the following:
      - Pre-processing
      - Certification
      - Published

        > [!NOTE]
        > After your product is certified, there might be a delay before it is published. After certification, a product typically appears in AppSource within one hour.

      - If the status is **Attention needed**, your submission needs changes to be approved. For details about the required changes, on the **Product overview** page, select **View report**.

If you make changes after your submission is certified, it must go through the certification process again.

If you have questions about policies or requirements in your report, you can engage with the Office Validation Team via [Stack Overflow](https://stackoverflow.com/search?q=appsource). Tag your question with "AppSource".

## See also

- [Office Add-ins](/office/dev/add-ins/overview/office-add-ins)  
- [SharePoint Add-ins](/sharepoint/dev/sp-add-ins/sharepoint-add-ins)
- [Microsoft Teams developer platform](https://docs.microsoft.com/microsoftteams/platform/overview)
- [Visuals in Power BI](https://docs.microsoft.com/power-bi/power-bi-custom-visuals)
