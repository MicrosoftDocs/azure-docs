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
# Expand existing host pool with new session hosts
Host pools are a collection of one or more identical virtual machines within Windows Virtual Desktop tenant environments. Each host pool can contain an app group that users can interact with as they would on a physical desktop.

Follow this section's instructions to expand an existing host pool with new session hosts.

## What you need to expand the host pool

Make sure you have created a host pool and session host VMs through either of these methods:
- [Azure Marketplace offering](./create-host-pools-azure-marketplace.md)
- [GitHub Azure Resource Manager template](./create-host-pools-arm-template.md)
- [Create a host pool with PowerShell](./create-host-pools-powershell.md)

Also, make sure you have the same information as when you first created the host pool and session host VMs, such as:
- VM size, image, and name prefix
- Domain join and Windows Virtual Desktop tenant administrator credentials
- Virtual network name and subnet name

Follow either of the two sections below to expand the host pool, using the deployment tool you are most comfortable with.

## Run the Azure Marketplace offering

Follow the same steps provided in [Run the Azure Marketplace offering to provision a new host pool](./create-host-pools-azure-marketplace.md#run-the-azure-marketplace-offering-to-provision-a-new-host-pool), with the following guidance per blade:

- *Basics* - Select the same resource group and enter the same host pool name as the original host pool.
- *Configure virtual machines* - Enter the same prefix and VM size as you did when first creating the host pool. Enter the total number of VMs that you would like to have in your host pool. For example, if you would like to expand your host pool from 5 session hosts to 8 session hosts, enter 8.
- *Virtual machine settings* - Enter the same information for the VMs as you did when first creating the host pool, including the image information, domain join information, and networking information.
- *Windows Virtual Desktop information* - Enter the same information as you did when first creating the host pool, including the Windows Virtual Desktop tenant name and the Windows Virtual Desktop tenant administrator credentials.

## Run the GitHub Azure Resource Manager template

Follow the same steps provided in [Run the Azure Resource Manager template for provisioning a new host pool](./create-host-pools-arm-template#run-the-azure-resource-manager-template-for-provisioning-a-new-host-pool) and provide all of the same parameter values except for the *Rdsh Number Of Instances*. Enter the number of session host VMs you want in the host pool after running the template. For example, if you are expanding your host pool from 5 session hosts to 8 session hosts, enter 8 for this parameter.