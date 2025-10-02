---
title: Create an Azure Compute Fleet using Azure portal
description: Learn how to create an Azure Compute Fleet in the Azure portal.
author: shandilvarun
ms.author: vashan
ms.topic: how-to
ms.service: azure-compute-fleet
ms.custom:
  - build-2024
ms.date: 04/21/2025
ms.reviewer: jushiman
# Customer intent: As a cloud administrator, I want to deploy a Compute Fleet through the cloud portal, so that I can efficiently manage my virtual machine resources for various applications.
---

# Create an Azure Compute Fleet using Azure portal 

This article steps through using the Azure portal to create a Compute Fleet.


## Log in to Azure

Sign in to the [Azure portal](https://portal.azure.com).


## Create a Compute Fleet

You can deploy a Compute Fleet with a Windows Server image or Linux image such as RHEL, CentOS, Ubuntu, or SLES.

1. In the Azure portal search bar, search for **Compute Fleet** and select the result under *Marketplace*.
1. Select **Create** on the **Compute Fleet** page. 

1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and create a new resource group called *myFleetResourceGroup*. 
1. Under **Instance details**, set *myFleet* for your Compute Fleet name.
1. Select a **Region** that is close to your area.
1. Select an option from **Availability zones** or a qualified availability zone will be automatically picked up for you.
1. Select a **Security type** that is available for a Virtual Machine (VM).
1. Select a marketplace image for **Image**.
1. Select **Architecture** for your VM. Available options are `Arm64` or `x64`.  
1. For **Virtual machine types**, select whether you're deploying Spot VMs, Standard VMs, or both. In this example, we select both. 
1. Specify 3 to 15 VM sizes for **Sizes**.
1. **For Spot fleet deployment:** Under **VM capacity**, specify your target capacity for Spot VM instance count between 1 and 10,000.
1. **For Standard fleet deployment:** Under **VM capacity**, specify your target capacity for Standard VM instance count between 1 and 10,000.
1. Select **Allocation strategy** to what factors you would like to prioritize when procuring VM size.
1. Enter the **Max hourly price per Spot VM (USD)**. Note that Spot VMs above your maximum hourly price will be evicted. 

1. Under **Administrator account** configure the admin username and set up an associated password or SSH public key.
   - A **Password** must be at least 12 characters long and meet three out of the four following complexity requirements: one lowercase character, one uppercase character, one number, and one special character. For more information, see [username and password requirements](/azure/virtual-machines/windows/faq#what-are-the-password-requirements-when-creating-a-vm-).
   - If you select a Linux OS disk image, you can instead choose **SSH public key**. You can use an existing key or create a new one. In this example, Azure generates a new key pair for us. For more information on generating key pairs, see [create and use SSH keys](/azure/virtual-machines/linux/mac-create-ssh-keys).

1. Select **Next: Networking** to move the networking configuration options. For this quickstart, leave the default networking configurations.

1. When you're done, select **Review + create**.
1. After it passes validation, select **Create** to deploy the Compute Fleet.


## Clean up resources
When no longer needed, delete the resource group, Compute Fleet, and all related resources. To do so, select the resource group for the Compute Fleet and then select **Delete**.


## Next steps
> [!div class="nextstepaction"]
> [Learn how to create an Azure Compute Fleet using an ARM template.](quickstart-create-rest-api.md)
