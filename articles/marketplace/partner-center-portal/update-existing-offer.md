---
title: Update an existing commercial marketplace offer
description: How to make updates to an existing commercial marketplace offer, including editing, deleting a draft, canceling a publish request, stop selling an offer or plan, and syncing private audiences. 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: keferna
ms.author: keferna
ms.date: 01/16/2020
---

# Update an existing offer in the commercial marketplace

You can view your existing offers on the **Overview** tab of the [Commercial Marketplace portal](https://partner.microsoft.com/dashboard/commercial-marketplace/offers) in Partner Center.

To update an existing offer that's currently live in the commercial marketplace:

1. Select the name of the offer you would like to update. The status of the offer may be listed as **Preview**, **Live**, **Publish in progress**, **Draft**, **Attention needed**, or **Not available** (if you've previously chosen to stop selling the offer). Once selected, the **Offer overview** page for that offer will open.
2. Select **Update** from the card on the offer overview page, or the menu item on the left navigation for the area that you would like to update. You may want to update the **Offer setup**, **Properties**, **Offer listing**, **Preview**, **Technical configuration**, **Plan overview**, or **Test drive**.
3. Make your changes and select **Save draft**. Repeat this process until all your changes are complete.

## Review and publish an updated offer

When you're ready to publish your updated offer, select **Review and publish** from any page. The **Review and publish** page will open. On this page you can:

- See the completion status for the sections of the offer that you updated: 
    - **Unpublished changes**: The section has been updated and is complete. All required data has been provided and there were no errors introduced in the updates.
    - **Incomplete**: The updates made to the section introduced errors that need to be fixed or requires more information to be provided.
- Provide additional information to the certification testing team to ensure that testing goes smoothly.
- Submit the updated offer for publishing by selecting **Publish**.  We'll email you when a preview version of the updated offer is available for you to review and sign off.

> [!IMPORTANT]
> You must review your offer preview once it's available and select **Go-live** to publish your updated offer to your intended audience (public or private).

## Add a plan to an existing offer

To add a new plan within an existing offer that you've already published:

1. With the **Offer overview** page for your existing offer open, go to the **Plan overview** page, and then select **Create new plan**.
1. Create a new plan according to the [guidelines](./create-new-saas-offer.md#plan-overview) by using the **existing plans Pricing model**.
1. Select **Save draft** after you change the plan name.
1. Select **Publish** when you're ready to publish your updates. The **[Review and publish](#review-and-publish-an-updated-offer)** page opens and provides a completion status for your updates.

## Update a plan within an existing offer

To make changes to a plan within an existing offer that you've already published:

1. With the **Offer overview** page for your existing offer open, choose the plan that you want to change. If the plan isn't accessible from the **Plan overview** list, select **See all plans**.
1. Select the plan **Name**, **Pricing model**, or **Availability**. *Currently, plans are available only in English (United States)*.
1. Select **Save draft** after making any changes to the plan name, description, or audience availability.
1. Select **Review and publish** when you're ready to publish your updates. The **[Review and publish](#review-and-publish-an-updated-offer)** page opens and provides a completion status for your updates.
1. Submit the updated plan for publishing by selecting **Publish**. We'll email you when a preview version of the the updated offer is available for you to review and sign off.

## Offer a virtual machine plan at a new price

After a virtual machine plan is published, its price can’t be changed. To offer the same plan at a different price, you must hide the plan and create a new one with the updated price. First, hide the plan with the price you want to change:

1. With the **Offer overview** page for your existing offer open, choose the plan that you want to change. If the plan isn't accessible from the **Plan overview** list, select **See all plans**.
1. Select the **Hide plan** checkbox. Save the draft before you continue.

Now that you have hidden the plan with the old price, create a copy of that plan with the updated price:

1. In Partner Center, go back to **Plan overview**.
2. Select **Create new plan**. Enter a **Plan ID** and a **Plan name**, then select **Create**.
1. To reuse the technical configuration from the plan you’ve hidden, select the **Reuse technical configuration** checkbox. Read [Plan overview](azure-vm-create-offer.md#plan-overview) to learn more.
    > [!IMPORTANT]
    > If you select **This plan reuses technical configuration from another plan**, you won’t be able to stop selling the parent plan later. Don’t use this option if you want to stop selling the parent plan.
3. Complete all the required sections for the new plan, including the new price.
1. Select **Save draft**.
1. After you've completed all the required sections for the new plan, select **Review and publish**. This will submit your offer for review and publication. Read [Review and publish an offer to the commercial marketplace](../review-publish-offer.md) for more details.

## Compare changes to commercial marketplace offers

You can audit the changes you make to a [published](#compare-changes-to-published-offer) or [preview](#compare-changes-to-a-preview-offer) offer before making them live by using **Compare**.

> [!NOTE]
> A published offer is an offer that's been successfully published to Preview or Live state.

See below for general auditing information:

- You can use **Compare** at any point during the editing process.
- Select a field on the **Compare** page to navigate to the value you want to modify.
- If you're ready to publish your updates, select **Review and publish**.
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

### Compare changes to published offer

Follow the instructions below to compare your changes from the published offer:

1. Select **Compare** in the command bar of the page. The **Compare** page provides side-by-side versions of the saved changes of this offer and the published marketplace offer.
2. When you access **Compare** from a specific page of the offer, the default displays only the changes made on that page.
    - If you want to compare changes on all pages, change the page from **Select a page to compare**.  
    - If you want to compare changes to the offer across all pages, select **All pages**.

As the default, **Compare** contrasts your new changes to the live marketplace offer.

Remember to republish your offer after making updates for the changes to take effect.

### Compare changes to a preview offer

If you have changes in preview that aren't live, you can compare new changes with the preview marketplace offer.

Follow the instructions below to compare new changes with your preview marketplace offer:

1. Select **Compare** in the command bar of the page.
2. Select the **With** dropdown and change it from **Live offer** to **Preview offer**.
3. The **Compare** page provides side-by-side versions that show the changes.

>[!NOTE]
>If your offer hasn't become live yet but you've published to preview, you don’t have the option to compare with a live offer.

Remember to republish your offer after making updates for the changes to take effect.

## Delete a draft offer

You can delete a draft offer (one that hasn't been published) by selecting **Delete draft** from the **Offer overview** page. This option won't be available to you if you've previously published the offer.

After you confirm that you want to delete the draft offer, the offer will no longer be visible or accessible in Partner Center and the **All Offers** page will open.

## Delete a draft plan

To delete a plan that hasn't been published, select **Delete draft** from the **Plan overview** page. This option will not be available to you if you've previously published the offer.

After you confirm that you want to delete the draft plan, the plan will no longer be visible or accessible in Partner Center.

## Cancel publishing

To cancel an offer with the **Publish in progress** status:

1. Select the offer name to open the **Offer overview** page.
1. Select **Cancel publish** from the top-right corner of the page.
1. Confirm that you want to stop the offer from being published.

If you want to publish the offer at a later time, you'll need to start the publishing process over.

> [!NOTE]
> You can stop an offer from being published only if the offer hasn't yet progressed to the publisher sign off step. After selecting **Go live** you will not have the option to cancel publish any longer.

## Stop selling an offer or plan

For various reasons, you may decide to remove your offer listing from the Microsoft commercial marketplace. Offer removal ensures that new customers can no longer purchase or deploy your offer, but has no impact on existing customers.

To stop selling an offer after you've published it, select **Stop selling** from the **Offer overview** page.

After you confirm that you want to stop selling the offer, within a few hours it will no longer be visible in the commercial marketplace and no new customers will be able to download it.

To stop selling a plan, select **Stop selling** from the **Plan overview** page. The option to stop selling a plan is only available if you have more than one plan in the offer. You can choose to stop selling one plan without impacting other plans within your offer. Once you confirm you want to stop selling the plan, you must republish the offer for the change to take effect. After the offer is republished, the plan will no longer be visible in the commercial marketplace and no new customers will be able to download it.

Any customers who previously acquired the offer or plan can still use it. They can download it again, but they won't get updates if you update and republish the offer or plan at a later time.

After your request to stop selling the offer/plan has been completed, you'll still see it in the commercial marketplace portal on Partner Center with a **Not available** status.

If you decide to list or sell this offer or plan again, follow the instructions to [update an existing offer](#update-an-existing-offer-in-the-commercial-marketplace). Don't forget that you will need to **publish** the offer or plan again after making any changes.

## Remove offers from existing customers

To remove offers from existing customers, [log a support request](https://aka.ms/marketplacepublishersupport). In the support topic list, select **Commercial Marketplace** > **Offer or App Delisting, Removal, or Termination** and submit the request. The support team will guide you through the offer removal process.

## Sync private plan audiences

If your offer includes one or more plans that are configured to only be available to a private restricted audience, it's possible to update only the audience who can access that private plan without publishing other changes to the offer. 

To update and sync the private audience for your plan(s):

- Modify the audience in one or more private plans using the + **Add ID** or **Import customers (csv)** button and then save the changes.
- Select **Sync private audience** from the **Plan overview** page.

**Sync private audience** will publish only the changes to your private audiences, without publishing any other updates you might have made to the draft offer.

## Next steps

- [Check the publishing status of your commercial marketplace offer](./publishing-status.md)
