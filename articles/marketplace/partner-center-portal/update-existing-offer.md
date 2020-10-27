---
title: Update an existing offer - Microsoft commercial marketplace
description: How to make updates to an existing commercial marketplace offer or plan, sync private audiences, and remove an offer. 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: keferna
ms.author: keferna
ms.date: 10/27/2020
ms.custom: contperfq2
---

# Update existing offers in the commercial marketplace

This article explains how to make updates to existing offers and plans, and also how to remove an offer from the commercial marketplace. You can view your offers on the **Overview** tab of the [Commercial Marketplace portal](https://partner.microsoft.com/dashboard/commercial-marketplace/offers) in Partner Center.

## Update a published offer

Use these steps to update an offer that's been successfully published to Preview or Live state.

1. Select the name of the offer you would like to update. The status of the offer may be listed as **Preview**, **Live**, **Publish in progress**, **Draft**, **Attention needed**, or **Not available** (if you've previously chosen to stop selling the offer). Once selected, the **Offer overview** page for that offer will open.
1. Select the offer page you want to update, such as **Properties**, **Offer listing**, or **Preview** (or select **Update** from the applicable card on the **Offer overview** page).
1. Make your changes and select **Save draft**. Repeat this process until all your changes are complete.
1. Review your changes on the **[Compare](#compare-changes-to-your-offer)** page.
1. When you're ready to publish your updated offer, select **Review and publish** from any page. The **Review and publish** page will open. On this page you'll see the completion status for the sections of the offer that you updated: 
    - **Unpublished changes**: The section has been updated and is complete. All required data has been provided and there were no errors introduced in the updates.
    - **Incomplete**: The updates made to the section introduced errors that need to be fixed or requires more information to be provided.
2. Select **Publish** to submit the updated offer for publishing. Your offer will then go through the standard [validation and publishing steps](../review-publish-offer.md#validation-and-publishing-steps).

> [!IMPORTANT]
> You must review your offer preview once it's available and select **Go-live** to publish your updated offer to your intended audience (public or private).

## Add a plan to an existing offer

Complete these steps to add a new plan to an offer that you've already published.

1. With the **Offer overview** page for your existing offer open, go to the **Plan overview** page, and then select **Create new plan**.
1. Create a new plan according to the [guidelines](../plans-pricing.md) by using the **existing plans Pricing model**.
1. Select **Save draft** after you change the plan name.
1. Select **Publish** when you're ready to publish your updates. The **[Review and publish](../review-publish-offer.md)** page opens and provides a completion status for your updates.

## Update a plan for an existing offer

Complete these steps to make changes to a plan for an offer that you've already published.

1. With the **Offer overview** page for your existing offer open, choose the plan that you want to change. If the plan isn't accessible from the **Plan overview** list, select **See all plans**.
1. Select the plan **Name**, **Pricing model**, or **Availability**. *Currently, plans are available only in English (United States)*.
1. Select **Save draft** after making any changes to the plan name, description, or audience availability.
1. Select **Review and publish** when you're ready to publish your updates. The **[Review and publish](../review-publish-offer.md)** page opens and provides a completion status for your updates.
1. Select **Publish** to submit the updated plan for publishing. We'll email you when a preview version of the updated offer is available for you to review and approve.

## Offer a virtual machine plan at a new price

After a virtual machine plan is published, its price can’t be changed. To offer the same plan at a different price, you must hide the plan and create a new one with the updated price. First, hide the plan with the price you want to change:

1. With the **Offer overview** page for your existing offer open, choose the plan that you want to change. If the plan isn't accessible from the **Plan overview** list, select **See all plans**.
1. Select the **Hide plan** checkbox. Save the draft before you continue.

Now that you have hidden the plan with the old price, create a copy of that plan with the updated price:

1. In Partner Center, go back to **Plan overview**.
2. Select **Create new plan**. Enter a **Plan ID** and a **Plan name**, then select **Create**.
1. To reuse the technical configuration from the plan you’ve hidden, select the **Reuse technical configuration** checkbox. Read [Create plans for a VM offer](../azure-vm-create-plans.md) to learn more.
    > [!IMPORTANT]
    > If you select **This plan reuses technical configuration from another plan**, you won’t be able to stop selling the parent plan later. Don’t use this option if you want to stop selling the parent plan.
3. Complete all the required sections for the new plan, including the new price.
1. Select **Save draft**.
1. After you've completed all the required sections for the new plan, select **Review and publish**. This will submit your offer for review and publication. Read [Review and publish an offer to the commercial marketplace](../review-publish-offer.md) for more details.

## Sync private plan audiences

If your offer includes one or more plans that are configured to only be available to a private restricted audience, it's possible to update only the audience who can access that private plan without publishing other changes to the offer. 

To update and sync the private audience for your plan(s):

- Modify the audience in one or more private plans using the + **Add ID** or **Import customers (csv)** button and then save the changes.
- Select **Sync private audience** from the **Plan overview** page.

**Sync private audience** will publish only the changes to your private audiences, without publishing any other updates you might have made to the draft offer.

## Compare changes to your offer

Before you publish updates to your live or [preview](#compare-changes-to-a-preview-offer) offer, you can audit the saved changes in the **Compare** page. You can access the **Compare** page in the upper-right corner of any offer page, such as the **Properties** or **Offer listing** page. The **Compare** page shows side-by-side versions of the saved changes of this offer and the published marketplace offer.

- You can use **Compare** at any point during the editing process.
- Select a field on the **Compare** page to navigate to the value you want to modify.
- To see the values for all fields, even fields not updated, select the **All fields** filter. You can modify filters within these fields by selecting **Modified fields**, then selecting one of the filters below:
    - **Removed values** filter displays fields that you published and you're now completely removing.
    - **Added values** filter displays fields that you did not originally publish and are now adding.
    - **Edited values** filter displays fields that had been published but you've now updated the contents.

      >[!NOTE]
      > If one of these filters isn't available, it indicates that you didn't make an update of that type.

- To see only values that haven't been updated, select the **Unchanged fields** filter. The field values shown for the published and draft version will be the same.

  ![Filters for comparing updates to your published or preview offer](./media/compare-changes-marketplace.png)

>[!NOTE]
> The following pages don't currently support **Compare**:
>- CSP Reseller Audience
>- Test Drive Technical Configuration
>- Test Drive Marketplace Listing
>- Co-sell
>- Supplemental files

Remember to republish your offer after making updates for the changes to take effect.

### Compare changes to a preview offer

If you have changes in preview that aren't live, you can compare new changes with the preview marketplace offer.

1. Select **Compare** in the command bar of the page.
2. Select the **With** dropdown and change it from **Live offer** to **Preview offer**. If your offer hasn't gone live yet, you won't see the **Live offer** option.
3. The **Compare** page provides side-by-side versions that show the changes.

Remember to republish your offer after making updates for the changes to take effect.

## Stop selling an offer or plan

You can remove offer listings and plans from the Microsoft commercial marketplace, which will prevent new customers from finding and purchasing them. Any customers who previously acquired the offer or plan can still use it, and they can download it again if needed. However, they won't get updates if you decide to republish the offer or plan at a later time.

- To stop selling an offer after you've published it, select **Stop selling** from the **Offer overview** page. Within a few hours of your confirmation, the offer will no longer be visible in the commercial marketplace.

- To stop selling a plan, select **Stop selling** from the **Plan overview** page. The option to stop selling a plan is only available if you have more than one plan in the offer. You can choose to stop selling one plan without impacting other plans within your offer.
     >[!NOTE]
     > Once you confirm you want to stop selling the plan, you must republish the offer for the change to take effect.

After you stop selling an offer or plan, you'll still see it in Partner Center with a **Not available** status. If you decide to list or sell this offer or plan again, follow the instructions to [update a published offer](#update-a-published-offer). Don't forget that you will need to **publish** the offer or plan again after making any changes.

## Remove offers from existing customers

To remove offers from existing customers, [log a support request](https://aka.ms/marketplacepublishersupport). In the support topic list, select **Commercial Marketplace** > **Offer or App Delisting, Removal, or Termination** and submit the request. The support team will guide you through the offer removal process.

## Next steps

- [Check the publishing status of your commercial marketplace offer](../review-publish-offer.md)
