---
title: Create a virtual machine on VMware vCenter using Azure Arc
description: In this quickstart, you will learn how to Create a virtual machine on VMware vCenter using Azure Arc
ms.topic: quickstart 
ms.date: 04/05/2021

# Customer intent: As a self-service user, I want to provision a VM using vCenter resources through Azure so that I can deploy my code
---

# Quickstart: Create a virtual machine on VMware vCenter using Azure Arc

Once your administrator has connected a VMware vCenter to Azure, represented VMware vCenter resources in Azure, and provided you permissions on those resources, you'll be able to create a virtual machine.

## Prerequisites

- An Azure subscription and resource group where you have Arc VMware VM contributor role

- A resourcepool resource on which you have Arc Private Cloud Resource User Role

- A virtual machine template resource on which you have Arc Private Cloud Resource User Role

- (Optional) A virtual network resource on which you have Arc Private Cloud Resource User Role

## How to create a VM in Azure portal

1. From your browser, go to the [Azure portal](https://aka.ms/AzureArcVM). You'll see unified browse experience for Azure and Arc virtual machines.

   :::image type="content" source="media/browse-virtual-machines.png" alt-text="Screenshot showing the unified browse experience for Azure and Arc virtual machines.":::

1. Select **Add** and then select **Azure Arc machine** from the drop-down.

   :::image type="content" source="media/create-azure-arc-virtual-machine-1.png" alt-text="Screenshot showing the Basic tab for creating an Azure Arc virtual machine.":::

1. Select the **Subscription** and **Resource group** where you want to deploy the VM.

1. Provide the **Virtual machine name** and then select a **Custom location** that your administrator has shared with you.

   If multiple kinds of VMs are supported, select **VMware** from the **Virtual machine kind** drop-down.

1. Select the **Resource pool/cluster/host** into which the VM should be deployed.

1. Select the **Template** based on which the VM you'll create.

   >[!TIP]
   >You can override the template defaults for **CPU Cores** and **Memory**.

   If you selected a Windows template, you can also provide a **Username**, **Password** for the **Administrator account**.

1. You can optionally change the disks configured in the template. You can add more disks or update existing disks. These disks are created on the default datastore per the VMWare vCenter storage policies.

1. You can optionally change the network interfaces configured in the template. You can add Network interface cards or update existing NICs. You can also change the network that this NIC will be attached to provided you have appropriate permissions to the network resource.

1. You can optionally add tags to the VM resource.

1. Finally click create after reviewing all the properties.

1. The VM should be provisioned in a few minutes.

## Next Steps

- [Perform operations on VMware VMs in Azure](manage-vmware-vms-in-azure.md)
