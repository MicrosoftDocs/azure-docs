---
title: Create the Azure VMware Solution jump box
description: Steps to create the Azure VMware Solution jump box.
ms.topic: include
ms.date: 03/13/2021
---

<!-- Used in deploy-azure-vmware-solution.md and tutorial-access-private-cloud.md -->

1. In the resource group, select **+ Add** then search and select **Microsoft Windows 10**, and then select **Create**.

   :::image type="content" source="../media/tutorial-access-private-cloud/ss8-azure-w10vm-create.png" alt-text="Add a new Windows 10 VM for a jump box." border="true":::

1. Enter the required information in the fields, and then select **Review + create**. 

   For more information on the fields, see the following table.

   | Field | Value |
   | --- | --- |
   | **Subscription** | Value is pre-populated with the Subscription belonging to the Resource Group. |
   | **Resource group** | Value is pre-populated for the current Resource Group, which you created in the preceding tutorial.  |
   | **Virtual machine name** | Enter a unique name for the VM. |
   | **Region** | Select the geographical location of the VM. |
   | **Availability options** | Leave the default value selected. |
   | **Image** | Select the VM image. |
   | **Size** | Leave the default size value. |
   | **Authentication type**  | Select **Password**. |
   | **Username** | Enter the user name for logging on to the VM. |
   | **Password** | Enter the password for logging on to the VM. |
   | **Confirm password** | Enter the password for logging on to the VM. |
   | **Public inbound ports** | Select **None**. If you select None, you can use [JIT access](../../security-center/security-center-just-in-time.md#jit-configure) to control access to the VM only when you want to access it. Alternatively, you can use an [Azure Bastion](../../bastion/tutorial-create-host-portal.md) if you want to access the jump box server securely from the internet without exposing any network port.  |


1. Once validation passes, select **Create** to start the virtual machine creation process.

