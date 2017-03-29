---
title: Update an existing offer for Azure Marketplace | Microsoft Docs
description: This article gives gives details around updating an existing offer via the cloud partner portal
services: cloud-partner-portal
documentationcenter: ''
author: anuragdalmia
manager: hamidm

ms.robots: NOINDEX, NOFOLLOW
ms.service: cloud-partner-portal
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/22/2017
ms.author: andalmia

---
# Update an existing offer for Azure Marketplace
There are various kinds of updates that you may want to do to your offer once its gone live.

1. Adding new VM image version to existing SKUs.
1. Change regions a SKU is available in. 
1. Adding new SKUs. 
1. Updating offer/SKU marketplace metadata.

To do this you need to update your offer in the [Cloud Partner Portal](https://cloudpartner.azure.com/) and republish. This article walks you through the different aspects of updating your VM offer.

## Unpermitted changes to VM offer/SKU
There are some attributes of a VM offer/SKU that cannot be modified once the offer is live in Azure Marketplace.
1. Offer ID and Publisher ID of the offer.
2. SKU ID of existing SKUs.
3. Open port configuration of existing SKUs.
4. Data disk count of existing SKUs.
5. Billing/License model changes to existing SKUs.

## Updating the VM image version for a SKU
The VM image for a SKU of your offer may have been updated with additional features, security patches, etc. Under such scenarios, you may want to update the VM image that your SKU references. To do this, follow the below steps:
1. Login to the [Cloud Partner Portal](https://cloudpartner.azure.com/)
2. Under **All offers** find the offer you would like to update
3. Under the **SKUs** form, click on the SKU whos VM image you would like to update
4. Under **Disk version**, click on **+New Disk Version** to add a new VM image
5. Provide the new VM Images **Disk version**. The disk version needs to follow the [semantic version](http://semver.org/) format. Versions should be of the form X.Y.Z, where X, Y, and Z are integers. Make sure that the new version you provide is greater than the previous versions, else this will not show up in Azure portal or Azure marketplace upon republish.
6. For **OS VHD URL**, enter the [shared access signature URI](../marketplace-publishing/marketplace-publishing-vm-image-creation.md#52-get-the-shared-access-signature-uri-for-your-vm-images) created for the operating system VHD. Note that data disk count cannot change between different versions of the SKU. If previous versions had data disks configured, this new version must also have the data disks configured. 
7. Click on **Publish** to kick off the publish workflow to get your new VM version to go live onto Azure marketplace and Azure portal. 

## Changing regions a SKU is available in
Over time, you may want to make your offer/SKU available in more regions. Alternatively, you may want to stop supporting the offer/SKU in a given region. To enable this, follow the steps below.

1. Login to the [Cloud Partner Portal](https://cloudpartner.azure.com/)
2. Under **All offers** find the offer you would like to update
3. Under the **SKUs** form, click on the SKU whos region availability you would like to update
4. Click on the **Select Countries** button under the **Country/Region availability** field. 
5. In the region availability pop-up, add/remove the regions you want for this SKU.
6. Click on **Publish** to kick off the publish workflow to update your SKUs region avaiability. 

If a SKU is being made available in a new region, you will have the ability to specify pricing for that particular region via the **Export Pricing Data** functionality. Note that if you are adding a region back that was once available before, you will not be able to update its pricing since pricing changes are not permitted. 

## Adding a new SKU
You may choose to make a new SKU available for your existing offer. To enable this, follow the below steps.

1. Login to the [Cloud Partner Portal](https://cloudpartner.azure.com/)
2. Under **All offers** find the offer you would like to update
3. Under the **SKUs** form, clik on **Add new SKU** and provide a **SKU ID** in the pop-up. 
4. Follow the rest of the steps as specified [here](./cloud-partner-portal-publish-virtual-machine.md).
6. Click on **Publish** to kick off the publish workflow to have your new SKU go live.

## Updating offer marketplace metadata.
You may have scenarios where you need to update the marketplace metadata associated with your offer like updating your company logos, etc. To do this, follow the below steps.

1. Login to the [Cloud Partner Portal](https://cloudpartner.azure.com/)
2. Under **All offers** find the offer you would like to update
3. Goto the **Marketplace** form and follow the instructions [here](./cloud-partner-portal-publish-virtual-machine.md) to make any changes. 
4. Click on **Publish** to kick off the publish workflow to have your changes go live.

