---
title: Configure and list a VM test drive
description: Configure and list a VM test drive in Partner Center.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: iqshahmicrosoft
ms.author: iqshah
ms.date: 10/15/2021
---

# Configure and list a VM test drive

A test drive lets customers try your offer prior to purchase by giving them access to a preconfigured environment for a fixed number of hours, resulting in highly qualified leads and an increased conversion rate.

For VM offers, Azure Resource Manager (ARM) deployment is the **only** test drive option available. The deployment template must contain all the Azure resources that comprise your solution.

To see the **Test drive** tab in left-nav menu, select the **Test drive** check box on the [Offer setup](azure-vm-offer-setup.md#test-drive-optional) page and connect to your CRM system. After you select **Save**, the **Test drive** tab appear with two sub-tabs:

When you've done that, select **Test drive** to reveal two sub-pages:

- **[Technical configuration](#technical-configuration-1)**, where you'll configure your test drive and provide your ARM template (next section below).
- **[Marketplace listing](#marketplace-listing)**, where you'll provide additional details of your listing and supplemental resources for your customers, such as user manuals and videos.

## Technical configuration

### Regions

Select **Edit regions** and select the check box for each region in which you want the test drive to be available. Or, at the top right, use the **Select all** or **Unselect all** links as appropriate. For best performance, choose only the regions where you expect the largest number of customers to be located, and ensure your subscription is allowed to deploy all needed resources there. When you've finished selecting regions, select **Save**.

### Instances

Enter values between 0-99 in the boxes to indicate how many of Hot, Warm, or Cold instances you want available per region. The number of each instance type you specify will be multiplied by the number of regions where your offer is available.

- **Hot** – Pre-deployed instances that are always running and ready for your customers to instantly access (< 10 seconds acquisition time) rather than having to wait for a deployment. Since most customers don't want to wait for a full deployment, we recommended having at least one Hot instance, otherwise you may experience reduced customer usage. Since hot instances are always running on your Azure subscription, they incur a larger uptime cost.
- **Warm** – Pre-deployed instances that are then put in storage. Less expensive than hot instances while still being quick to reboot for your customers (3-10 minutes acquisition time).
- **Cold** – Instances that require the test drive ARM template to be deployed when requested by each customer. Cold instances are much slower to load relative to Hot and Warm instances. The wait time varies greatly based on the resources required (up to 1.5 hours). Cold instances are more cost-effective for you since the cost is only for the test drive duration, compared to always running on your Azure subscription as with a Hot instance.

### Technical configuration

The ARM template for yoru test drive is a coded container of all the Azure resources that comprise your solution. Once your template is complete, return here to learn how to uploaded your ARM template and complete the configuration.

To publish successfully, it is important to validate the formatting of the ARM template. Two ways to do this are by using an [online API tool](/rest/api/resources/deployments/validate) or with a [test deployment](/azure/azure-resource-manager/templates/deploy-portal).

Drag your Test drive Azure Resource Manager template (.zip file) into the area indicated, or **Browse** for the file.

Enter a **Test drive duration**, in hours. This is the number of hours the test drive will stay active. The test drive terminates automatically after this time period ends.

### Deployment subscription details

For Microsoft to deploy the test drive on your behalf, you must connect to your Azure Subscription and Azure Active Directory (AD).

Enter the content requested in the four fields, then select **Save draft**.

Complete your test drive solution by continuing to the next **Test drive** tab in the left-nav menu, **Marketplace listing**.

## Marketplace listing

Use this page to provide details on the test drive description, access information, user manual, and demonstration video.

For details on these fields, see [Test drive listings](test-drive-technical-configuration.md#test-drive-listings).

Select **Save draft** before continuing with **Next steps** below.

## Next steps

- [Review and publish your offer](review-publish-offer.md)
