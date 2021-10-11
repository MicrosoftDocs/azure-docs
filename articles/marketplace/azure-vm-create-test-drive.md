---
title: Configure virtual machine offer test drive properties
description: Configure virtual machine offer test drive properties in Partner Center.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: iqshahmicrosoft
ms.author: iqshah
ms.date: 10/15/2021
---

# Set up a virtual machine offer test drive

A test drive allows customers to try your solution before they buy by giving them access to a preconfigured environment for a fixed number of hours, resulting in highly qualified leads and an increase in conversions.

There are different kinds of test drives available depending on the offer and marketplace, but an Azure Resource Manager (ARM) deployment is the only option available for a VM offer.

To create the ARM deployment template you'll need for your test drive, see [Azure Resource Manager test drive](azure-resource-manager-test-drive.md). The deployment template will contain all the Azure resources that comprise your solution. Once your template is complete, return here and continue reading below to learn how to add it to your offer's test drive.

If you want to learn about how other types of test drives work, see [What is a test drive?](https://go.microsoft.com/fwlink/?linkid=2091010).

You will not see the left-nav menu option for **Test drive** unless you select the **Test drive** check box on the [Offer setup](azure-vm-create.md#test-drive-optional) page. When you've done that, select **Test drive** to reveal two sub-pages:

- **Technical configuration**, where you'll attach your ARM template
- **Marketplace listing**, where you'll specify details that help your customers receive the best experience from your test drive.

## Technical configuration

### Regions

Select **Edit regions** and select the check box for each region in which you want the test drive to be available. Or, at the top right, use the **Select all** or **Unselect all** links as appropriate. When you finished selecting regions, select **Save**.

### Instances

Enter a value in the boxes between 0-99 to indicate how many of Hot, Warm, or Cold instances you want available.

- **Hot** – Pre-deployed instances that are always running and always ready for your customers (< 10 seconds acquisition time).
- **Warm** – Pre-deployed instances that are then put in storage. Less expensive than hot instances while still being quick to reboot for your customers (3-10 minutes acquisition time).
- **Cold** – Deployed at the time of request for each customer. The cost is only for the test drive duration, but the wait time varies greatly based on the resources required (up to 1 hour 30 minutes).

### Technical configuration

Technical configuration is accomplished with an Azure Resource Manager template as described at the beginning of this article. An ARM template is a coded .zip container of Azure resources that you design to best represent your solution.

Drag your Azure Resource Manager template into the area indicated, or **Browse** for the file.

Enter a **Test drive duration**, in hours.

### Deployment subscription details

For Microsoft to deploy the test drive on your behalf, you must create and provide a separate, unique Azure subscription. This is discussed in [What is a test drive?](https://go.microsoft.com/fwlink/?linkid=2091010) <font color="red">The term "subscription" appears once under **Logic app test drive**, but not **ARM test drive**; is this stmt incorrect?</font>.

Enter the content requested in the four fields, then select **Save draft**.

Continue to the next **Test drive** tab in the left-nav menu, **Marketplace listing**.

## Marketplace listing

Use this page to provide details on the test drive description, access information, user manual, and demonstration video.

For details on these fields, see [Test drive listings](test-drive-technical-configuration.md#test-drive-listings).

Select **Save draft** before continuing with **Next steps** below.

## Next steps

- [Review and publish your offer](review-publish-offer.md)
