---
title: Create an Azure Compute Fleet using Azure portal
description: Learn how to create an Azure Compute Fleet in the Azure portal.
author: rajeeshr
ms.author: rajeeshr
ms.topic: how-to
ms.service: virtual-machines
ms.custom:
  - build-2024
ms.date: 05/09/2024
ms.reviewer: jushiman
---

# Create an Azure Compute Fleet using Azure portal (Preview)

> [!IMPORTANT]
> Azure Compute Fleet is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

This article steps through using Azure portal to create a Compute Fleet.


## Log in to Azure

Sign in to the [Azure portal](https://portal.azure.com).


## Create a Compute Fleet

You can deploy a Compute Fleet with a Windows Server image or Linux image such as RHEL, CentOS, Ubuntu, or SLES.

1. In the Azure portal search bar, search for **Azure Compute Fleet** and select the result under *Marketplace*.
1. Select **Create** on the **Compute Fleet** page. 

1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and create a new resource group called *myFleetResourceGroup*. 
1. Under **Instance details**, set *myFleet* for your Compute Fleet name.
1. Select a **Region** that is close to your area.
1. Select a marketplace image for **Image**. 
1. For **Virtual machine types**, select whether you're deploying Spot VMs, Standard VMs, or both. In this example, we select both. 
1. Specify 3 to 15 virtual machine (VM) sizes for **Sizes**.
1. **For Spot fleet deployment:** Under **VM capacity**, specify your target capacity for Spot VM instance count between 1 and 10,000.
1. **For Standard fleet deployment:** Under **VM capacity**, specify your target capacity for Standard VM instance count between 1 and 10,000. 

1. Under **Administrator account** configure the admin username and set up an associated password or SSH public key.
   - A **Password** must be at least 12 characters long and meet three out of the four following complexity requirements: one lower case character, one upper case character, one number, and one special character. For more information, see [username and password requirements](../virtual-machines/windows/faq.yml#what-are-the-password-requirements-when-creating-a-vm-).
   - If you select a Linux OS disk image, you can instead choose **SSH public key**. You can use an existing key or create a new one. In this example, Azure generates a new key pair for us. For more information on generating key pairs, see [create and use SSH keys](../virtual-machines/linux/mac-create-ssh-keys.md).

1. Select **Next: Networking** to move the networking configuration options. For this quickstart, leave the default networking configurations.

1. When you're done, select **Review + create**.
1. After it passes validation, select **Create** to deploy the Compute Fleet.


## Clean up resources
When no longer needed, delete the resource group, Compute Fleet, and all related resources. To do so, select the resource group for the Compute Fleet and then select **Delete**.


## Next steps
> [!div class="nextstepaction"]
> [Learn how to create an Azure Compute Fleet using an ARM template.](quickstart-create-rest-api.md)
