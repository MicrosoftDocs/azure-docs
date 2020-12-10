---
title: Submit your Office solution to Microsoft AppSource via Partner Center
description: If you want your Office solution to appear in Microsoft AppSource, you need to submit it to Partner Center for approval.
localization_priority: Priority
---

# Submit your Office solution to Microsoft AppSource via Partner Center

If you want your Office solution to appear in Microsoft AppSource, you need to submit it to [Partner Center](https://partner.microsoft.com/dashboard/office/products) for approval. First, familiarize yourself with the [certification policies](https://docs.microsoft.com/legal/marketplace/certification-policies). 

If your SharePoint Add-in requires an Open Authorization (OAuth) client ID and client secret, see [Create or update client IDs and secrets in Partner Center](create-or-update-client-ids-and-secrets.md).

For information about the Microsoft AppSource approval process, see [Make your solutions available in Microsoft AppSource](submit-to-appsource-via-partner-center.md).

## Submission process

Submitting your solution involves specifying your solution name and adding your solution details via Partner Center.

### 1 - Create your solution and reserve name

On the [Overview](https://partner.microsoft.com/dashboard/office/overview) page in Partner Center, select **Create a new...**, and select the type of solution that you are submitting:

- Office add-in
- SharePoint solution
- Power BI visual
- Microsoft Teams app

In the dialog box, provide a name for your solution and choose **Check availability** to verify that the name is available. For details, see [Reserve a name](reserve-solution-name.md).

After you've verified that the name you chose is available, choose **Create**.

### 2 - Add your submission details

On the Product overview page, add the details associated with your submission. The following table lists the tasks that you need to complete.

|**Task**|**More information**|
|:-------------|:-------|
|Add setup and lead management details|[Add setup details](add-setup-details.md)|
|Upload your add-in manifest or app package|[Upload your submission package](upload-package.md)|
|Define your marketplace listing|[Define properties](define-office-solution-properties.md) and [Create your Microsoft AppSource listing](appsource-listing.md)|
|Specify the availability for your solution|[Specify availability](specify-availability.md)|

> [!NOTE]
> Partner Center does not support pricing model management for Office solutions. Existing paid add-ins that migrated from Seller Dashboard will need to move to a SaaS model or be made free by July 2020.

### 3 - Review and publish

After you have defined all the required information, you can submit your solution for publishing. Your approved solution will be listed in product-specific marketplaces.

1. Complete your submission details.
2. Select **Publish** on the top right in Partner Center.
3. Review the details and status of your submission.
4. Add any notes for certification.
5. Select **Publish**.
    
> [!NOTE]
> After you submit a solution for approval, you can make changes to your submission, but you cannot submit them until your initial submission is completed. When the approval process is complete, you receive an email message indicating that your solution was approved or that you need to make changes before it can be approved. 

## Unpublishing a solution

To unpublish a solution to remove it from the marketplace, on the **Product overview** page, choose **Stop selling** on the top right, and then select **Confirm**.

After a solution is unpublished, new customers will not be able to get it. Existing customers will be able to access the solution for 90 days, and then the solution will no longer be accessible. If you later want to make your solution available again, you can resubmit it via Partner Center.

## Microsoft 365 App Compliance program

After your solution is published through Partner Center, you can begin the [Microsoft 365 App Compliance program](https://docs.microsoft.com/microsoft-365-app-certification/overview). This program is optional and is designed to allow you to reach the level of security that meets the needs of your customers. To complete the Publisher Attestation within Partner Center, click the **App Compliance** button in the Office Store section. For details, see the [User guide](https://docs.microsoft.com/microsoft-365-app-certification/docs/userguide).

## See also
<a name="bk_addresources"> </a>

- [Microsoft AppSource submission FAQ](appsource-submission-faq.md)
- [Create effective listings](create-effective-office-store-listings.md)
- [Certification policies](https://docs.microsoft.com/legal/marketplace/certification-policies)
- [Microsoft 365 App Compliance](https://docs.microsoft.com/microsoft-365-app-certification/overview)
 