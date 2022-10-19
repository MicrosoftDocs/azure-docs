---
title: Deprecate or restore a virtual machine offer from Azure Marketplace
description: Deprecate or restore a virtual machine, image, plan, or offer.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: iqshahmicrosoft
ms.author: iqshah
ms.reviewer: amhindma
ms.date: 04/18/2022
---

# Deprecate or restore a virtual machine offer

This article describes how to deprecate or restore virtual machine images, plans, and offers. The deprecation feature replaces the _stop sell_ feature. It complies with the Azure 90-day wind down period as it allows deprecation to be scheduled in advance.

## What is deprecation?

Deprecation is the delisting of a VM offer or a subset of the offer from Azure Marketplace so that it is no longer available for customers to deploy additional instances. Reasons to deprecate may vary. Common examples are due to security issues or end of life. You can deprecate image versions, plans, or an entire VM offer:

- **Deprecation of an image version** – The removal of an individual VM image version
- **Deprecation of a plan** – The removal of a plan and subsequently all images within the plan
- **Deprecation of an offer** – The removal of an entire VM offer, including all plans within the offer and subsequently all images within each plan

To ensure your customers are provided with ample notification, deprecation is scheduled in advance.

> [!IMPORTANT]
> Existing deployments are not impacted by deprecation.

## How deprecation affects customers

Here are some important things to understand about the deprecation process.

Before the scheduled deprecation date:

- Customers with active deployments are notified.
- Customers can continue to deploy new instances up until the deprecation date.
- If deprecating an offer or plan, the offer or plan will no longer be available in the marketplace. This is to reduce the discoverability of the offer or plan.

After the scheduled deprecation date:

- Customers will not be able to deploy new instances using the affected images. If deprecating a plan, all images within the plan will no longer be available and if deprecating an offer, all images within the offer will no longer be available following deprecation.
- Active VM instances will not be impacted.
- Existing virtual machine scale sets (VMSS) deployments cannot be scaled out if configured with any of the impacted images. If deprecating a plan or offer, all existing VMSS deployments pinned to any image within the plan or offer respectively cannot be scaled out.

> [!TIP]
> Before you deprecate an offer or plan, make sure you understand the current usage by reviewing the [Usage dashboard in commercial marketplace analytics](usage-dashboard.md). If usage is high, consider hiding the plan or offer to minimize discoverability within the commercial marketplace. This will steer new customers towards other available options.

## Deprecate an image

Keep the following things in mind when deprecating an image:

- You can deprecate any image within a plan.
- Each plan must have at least one image.
- Publish the offer after scheduling the deprecation of an image.
- Images that are published to preview can be deprecated or deleted immediately.

**To deprecate an image**:

1. On the [Marketplace offers](https://partner.microsoft.com/dashboard/marketplace-offers/overview) page, in the **Offer alias** column, select the offer with the image you want to deprecate.
1. On the **Offer overview** page, under **Plan overview**, select the plan with the image.
1. In the left nav, select the **Technical Configuration** page.
1. Under **VM images**, select the **Active** tab.
1. In the **Action** column, select **Deprecate** for the image you want to deprecate. Upon confirming the deprecation, the image is listed on the **Deprecated** tab.
1. Save your changes on the **Technical configuration** page.
1. For the change to take effect and for customers to be notified, select **Review and publish** and publish the offer.

## Restore a deprecated image

Keep the following things in mind when restoring a deprecated image:

- Publish the offer after restoring an image for it to become available to customers.
- You can undo or cancel the deprecation anytime up until the scheduled date.
- You can restore an image for a period of time after deprecation. After the window has expired, the image can no longer be restored.

**To restore a deprecated image**:

1. On the [Marketplace offers](https://partner.microsoft.com/dashboard/marketplace-offers/overview) page, in the **Offer alias** column, select the offer with the image you want to restore.
1. On the **Offer overview** page, under **Plan overview**, select the plan with the image.
1. In the left nav, select the **Technical configuration** page.
1. Under **VM images**, select the **Deprecated** tab. The status is shown in the **Status** column.
1. In the **Action** column, select one of the following:
    - If the deprecation date shown in the **Status** column is in the future, you can select **Cancel deprecation**. The image version will then be listed under the Active tab.
    - If the deprecation date shown in the **Status** column is in the past, select **Restore image**. The image is then listed on the **Active** tab.
    > [!NOTE]
    > If the image can no longer be restored, then no actions will be available.
1. Save your changes on the **Technical configuration** page.
1. For the change to take effect, select **Review and publish** and publish the offer.

## Deprecate a plan

Keep the following things in ming when deprecating a plan:

- Publish the offer after scheduling the deprecation of a plan.
- Upon scheduling the deprecation of a plan, free trials are disabled immediately.
- If a test drive is enabled on your offer and it’s configured to use the plan that’s being deprecated, be sure to reconfigure the test drive to use another plan in the offer. Otherwise, disable the test drive on the **Offer Setup** page.

**To deprecate a plan**:

1. On the [Marketplace offers](https://partner.microsoft.com/dashboard/marketplace-offers/overview) page, in the **Offer alias** column, select the offer with the plan you want to deprecate.
1. On the **Offer overview** page, under **Plan overview**, in the **Action** column, select **Deprecate plan**.
1. In the confirmation box that appears, enter the Plan ID and confirm that you want to deprecate the plan.
1. For the change to take effect and for customers to be notified, select **Review and publish** and publish the offer.

## Restore a deprecated plan

Keep the following things in mind when restoring a plan:

- Ensure that there is at least one active image version available on the **Technical Configuration** page of the plan. You can either restore a deprecated image or provide a new one.
- Publish the offer after restoring a plan for it to become available to customers.

**To restore a plan**:

1. On the [Marketplace offers](https://partner.microsoft.com/dashboard/marketplace-offers/overview) page, in the **Offer alias** column, select the offer with the plan you want to restore.
1. On the **Offer overview** page, under **Plan overview**, in the **Action** column of the plan you want to restore, select **Restore plan**.
1. In the confirmation dialog box that appears, confirm that you want to restore the plan.
1. Ensure that there is at least one active image version available on the **Technical Configuration** page of the plan. Note that all deprecated images are listed under **VM Images** on the **Deprecated** tab. You can either [restore a deprecated image](#restore-a-deprecated-image) or [add a new VM image](azure-vm-plan-technical-configuration.md#vm-images). Remember, if the restore window has expired, the image can no longer be restored.
1. Save your changes on the **Technical configuration** page.
1. For the change to take effect, select **Review and publish** and publish the offer.

## Deprecate an offer

On the **Offer Overview** page, you can deprecate the entire offer. This deprecates all plans and images within the offer.

Keep the following things in mind when deprecating an offer:

- The deprecation will be scheduled 90 days into the future and customers will be notified.
- Test drive and any free trials will be disabled immediately upon scheduling deprecation of an offer.

**To deprecate an offer**:

1. On the [Marketplace offers](https://partner.microsoft.com/dashboard/marketplace-offers/overview) page, in the **Offer alias** column, select the offer you want to deprecate.
1. On the **Offer overview** page, in the upper right, select **Deprecate offer**.
1. In the confirmation dialog box that appears, enter the Offer ID and then confirm that you want to deprecate the offer.
    > [!NOTE]
    > On the [Marketplace offers](https://partner.microsoft.com/dashboard/marketplace-offers/overview) page, the **Status column** of the offer will say **Deprecation scheduled**. On the **Offer overview** page, under **Publish status**, the scheduled deprecation date is shown.

## Restore a deprecated offer

You can restore an offer only if the offer contains at least one active plan and at least one active image.

**To restore a deprecated offer**:

1. On the [Marketplace offers](https://partner.microsoft.com/dashboard/marketplace-offers/overview) page, in the **Offer alias** column, select the offer you want to restore.
1. In the left nav, select **Plan overview**.
1. In the **Action** column of the plan you want to restore, select **Restore**. You can optionally [create a new plan](azure-vm-plan-overview.md) within the offer.
1. Ensure that there is at least one active image version available on the **Technical Configuration** page of the plan. Note that all deprecated images are listed under **VM Images** on the **Deprecated** tab. You can either [restore a deprecated image](#restore-a-deprecated-image) or [add a new VM image](azure-vm-plan-technical-configuration.md#vm-images). Remember, if the restore window has expired, the image can no longer be restored.
1. Save your changes on the **Technical configuration** page.
1. For the changes to take effect, select **Review and publish** and publish the offer.
