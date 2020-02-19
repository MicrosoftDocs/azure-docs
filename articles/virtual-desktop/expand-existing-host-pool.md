---
title: Expand existing host pool with new session hosts - Azure
description: How to expand an existing host pool with new session hosts in Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 02/18/2020
ms.author: helohr
---
# Expand an existing host pool with new session hosts

Host pools are a collection of one or more identical virtual machines within Windows Virtual Desktop tenant environments. Each host pool can contain an app group that users can interact with as they would on a physical desktop.

This article will tell you how you can expand an existing host pool with new session hosts.

## What you need to expand the host pool

Before you start, make sure you've created a host pool and session host virtual machines (VMs) using one of the following methods:

- [Azure Marketplace offering](./create-host-pools-azure-marketplace.md)
- [GitHub Azure Resource Manager template](./create-host-pools-arm-template.md)
- [Create a host pool with PowerShell](./create-host-pools-powershell.md)

You'll also need the following information from when you first created the host pool and session host VMs:

- VM size, image, and name prefix
- Domain join and Windows Virtual Desktop tenant administrator credentials
- Virtual network name and subnet name

The next three sections are three methods you can use to expand the host pool. You can do either with whichever deployment tool you're comfortable with.

## Redeploy from Azure

If you previously created a host pool and session host VMs through the [Azure Marketplace offering](./create-host-pools-azure-marketplace.md) or [GitHub Azure Resource Manager template](./create-host-pools-arm-template.md), you can redeploy the same Azure Resource Manager template from the Azure portal. This will automatically reenter all of the same information except for passwords, ensuring that you do not mistype input parameters this time around.

Follow the instructions below to redeploy the Azure Resource Manager template to expand an existing host pool:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. From the search bar at the top of the Azure portal, search for **Resource groups** and select the item under **Services**.
3. Find the resource group you created when you first created the host pool, then select it.
4. In the panel on the left side of the browser, select **Deployments**.
5. Select the appropriate deployment that maps to the host pool creation process:
     - If you initially created the host pool through the Azure Marketplace offering, select the deployment starting with *rds.wvd-provision-host-pool*.
     - If you initially created the host pool through the GitHub Azure Resource Manager template, select the deployment named *Microsoft.Template*.
6. Select **Redeploy**.
7. Make sure that the correct *Resource group* is entered.
     
     >[!NOTE]
     >Even though the *Resource group* is automatically and correctly populated, you may see an error that suggests selecting a different resource group. To fix, select another resource group, then select the original resource group.

8. Enter the new total for *Rdsh Number Of Instances*. For example, if you are expanding your host pool from 5 session hosts to 8 session hosts, enter **8** for this parameter.
9. Re-enter the *Existing Domain Password* for the user entered for *Existing Domain UPN*. Do not change the username, as this will result in an error when running the template.
10. Re-enter the *Tenant Admin Password* for the user or application ID entered for *Tenant Admin Upn Or Application Id*. Do not change the username, as this will result in an error when running the template.
11. Complete the submission to expand your host pool.

## Run the Azure Marketplace offering

Follow the instructions in [Run the Azure Marketplace offering to provision a new host pool](./create-host-pools-azure-marketplace.md#run-the-azure-marketplace-offering-to-provision-a-new-host-pool), with the following guidance per blade:

1. For [Basics](./create-host-pools-azure-marketplace.md#basics), select the same resource group, then enter the same host pool name as the original host pool.
2. For [Configure virtual machines](./create-host-pools-azure-marketplace.md#configure-virtual-machines), enter the same prefix and VM size that you did when you first created the host pool. Enter the total number of VMs that you want in your host pool. For example, if you want to expand your host pool from five session hosts to eight, enter **8**.
3. For [Virtual machine settings](./create-host-pools-azure-marketplace.md#virtual-machine-settings), enter the same information that you did when you first created the host pool, including the image, domain join, and networking information.
4. For [Windows Virtual Desktop information](./create-host-pools-azure-marketplace.md#windows-virtual-desktop-information), enter the same information you did when you first created the host pool, including your Windows Virtual Desktop tenant name and tenant administrator credentials.

## Run the GitHub Azure Resource Manager template

Follow the same steps provided in [Run the Azure Resource Manager template for provisioning a new host pool](./create-host-pools-arm-template.md#run-the-azure-resource-manager-template-for-provisioning-a-new-host-pool) and provide all of the same parameter values except for the *Rdsh Number Of Instances*. Enter the number of session host VMs you want in the host pool after running the template. For example, if you are expanding your host pool from 5 session hosts to 8 session hosts, enter **8** for this parameter.