---
title: Create virtual machines in a Flexible scale set using Azure portal
description: Learn how to create a Virtual Machine Scale Set in Flexible orchestration mode in the Azure portal.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 11/22/2022
ms.reviewer: jushiman
ms.custom: mimckitt, vmss-flex
---

# Create virtual machines in a scale set using Azure portal

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

This article steps through using Azure portal to create a Virtual Machine Scale Set.
## Log in to Azure
Sign in to the [Azure portal](https://portal.azure.com).


## Create a Virtual Machine Scale Set

You can deploy a scale set with a Windows Server image or Linux image such as RHEL, CentOS, Ubuntu, or SLES.

1. In the Azure portal search bar, search for and select **Virtual Machine Scale Sets**.
1. Select **Create** on the **Virtual Machine Scale Sets** page.

1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and create a new resource group called *myVMSSResourceGroup*.
1. Under **Scale set details**, set *myScaleSet* for your scale set name and select a **Region** that is close to your area.
1. Under **Orchestration**, select *Flexible*.
1. Under **Instance details**, select a marketplace image for **Image**. Select any of the Supported Distros.
1. Under **Administrator account** configure the admin username and set up an associated password or SSH public key.
   - A **Password** must be at least 12 characters long and meet three out of the four following complexity requirements: one lower case character, one upper case character, one number, and one special character. For more information, see [username and password requirements](../virtual-machines/windows/faq.yml#what-are-the-password-requirements-when-creating-a-vm-).
   - If you select a Linux OS disk image, you can instead choose **SSH public key**. You can use an existing key or create a new one. In this example, we will have Azure generate a new key pair for us. For more information on generating key pairs, see [create and use SSH keys](../virtual-machines/linux/mac-create-ssh-keys.md).


:::image type="content" source="media/quickstart-guides/quick-start-portal-1.png" alt-text="A screenshot of the Basics tab in the Azure portal during the Virtual Machine Scale Set creation process.":::

1. Select **Next: Disks** to move the disk configuration options. For this quickstart, leave the default disk configurations.

1. Select **Next: Networking** to move the networking configuration options.

1. On the **Networking** page, under **Load balancing**, select the **Use a load balancer** checkbox to put the scale set instances behind a load balancer.
1. In **Load balancing options**, select **Azure load balancer**.
1. In **Select a load balancer**, select a load balancer or create a new one.
1. For **Select a backend pool**, select **Create new**, type *myBackendPool*, then select **Create**.

:::image type="content" source="media/quickstart-guides/quick-start-portal-2.png" alt-text="A screenshot of the Networking tab in the Azure portal during the Virtual Machine Scale Set creation process.":::

1. Select **Next: Scaling** to move to the scaling configurations.

1. On the **Scaling** page, set the **initial instance count** field to *5*. You can set this number up to 1000.
1. For the **Scaling policy**, keep it *Manual*.

:::image type="content" source="media/quickstart-guides/quick-start-portal-3.png" alt-text="A screenshot of the Scaling tab in the Azure portal during the Virtual Machine Scale Set creation process.":::

1. When you're done, select **Review + create**.
1. After it passes validation, select **Create** to deploy the scale set.


## Clean up resources
When no longer needed, delete the resource group, scale set, and all related resources. To do so, select the resource group for the scale set and then select **Delete**.


## Next steps
> [!div class="nextstepaction"]
> [Learn how to create a Flexible scale with Azure CLI.](flexible-virtual-machine-scale-sets-cli.md)
