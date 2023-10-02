---
title: Create a virtual machine on VMware vCenter using Azure Arc
description: In this quickstart, you'll learn how to create a virtual machine on VMware vCenter using Azure Arc
ms.topic: quickstart 
ms.date: 08/18/2023
ms.service: azure-arc
ms.subservice: azure-arc-vmware-vsphere

# Customer intent: As a self-service user, I want to provision a VM using vCenter resources through Azure so that I can deploy my code
---

# Quickstart: Create a virtual machine on VMware vCenter using Azure Arc

Once your administrator has connected a VMware vCenter to Azure, represented VMware vCenter resources in Azure, and provided you permissions on those resources, you'll create a virtual machine.

## Prerequisites

- An Azure subscription and resource group where you have an Arc VMware VM contributor role.

- A resource pool/cluster/host on which you have Arc Private Cloud Resource User Role.

- A virtual machine template resource on which you have Arc Private Cloud Resource User Role.

- A virtual network resource on which you have Arc Private Cloud Resource User Role.

## How to create a VM in the Azure portal

1. From your browser, go to the [Azure portal](https://portal.azure.com). Navigate to virtual machines browse view. You'll see a unified browse experience for Azure and Arc virtual machines.

   :::image type="content" source="media/browse-virtual-machines.png" alt-text="Screenshot showing the unified browse experience for Azure and Arc virtual machines.":::

2. Click **Add** and then select **Azure Arc machine** from the drop-down.

   :::image type="content" source="media/create-azure-arc-virtual-machine-1.png" alt-text="Screenshot showing the Basic tab for creating an Azure Arc virtual machine.":::

3. Select the **Subscription** and **Resource group** where you want to deploy the VM.

4. Provide the **Virtual machine name** and then select a **Custom location** that your administrator has shared with you.

   If multiple kinds of VMs are supported, select **VMware** from the **Virtual machine kind** drop-down.

5. Select the **Resource pool/cluster/host** into which the VM should be deployed.

6. Select the **datastore** that you want to use for storage.

7. Select the **Template** based on which the VM you'll create.

   >[!TIP]
   >You can override the template defaults for **CPU Cores** and **Memory**.

   If you selected a Windows template, provide a **Username**, **Password** for the **Administrator account**.

8. (Optional) Change the disks configured in the template. For example, you can add more disks or update existing disks. All the disks and VM will be on the datastore selected in step 6.

9. (Optional) Change the network interfaces configured in the template. For example, you can add network interface (NIC) cards or update existing NICs. You can also change the network to which this NIC will be attached, provided you have appropriate permissions to the network resource.

10. (Optional) Add tags to the VM resource if necessary.

11. Select **Create** after reviewing all the properties.  It should take a few minutes to provision the VM.

## Next steps

- [Perform operations on VMware VMs in Azure](perform-vm-ops-through-azure.md)
