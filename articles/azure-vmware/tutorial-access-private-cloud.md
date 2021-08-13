---
title: Tutorial - Access your private cloud
description: Learn how to access an Azure VMware Solution private cloud
ms.topic: tutorial
ms.date: 08/13/2021
---

# Tutorial: Access an Azure VMware Solution private cloud

Azure VMware Solution doesn't allow you to manage your private cloud with your on-premises vCenter. Instead, you'll need to connect to the Azure VMware Solution vCenter instance through a jump box. 

In this tutorial, you'll create a jump box in the resource group you created in the [previous tutorial](tutorial-configure-networking.md) and sign into the Azure VMware Solution vCenter. This jump box is a Windows virtual machine (VM) on the same virtual network you created.  It provides access to both vCenter and the NSX Manager. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Windows VM to access the Azure VMware Solution vCenter
> * Sign into vCenter from this VM

## Create a new Windows virtual machine

1. In the resource group, select **Add**, search for **Microsoft Windows 10**, and select it. Then select **Create**.

   :::image type="content" source="media/tutorial-access-private-cloud/ss8-azure-w10vm-create.png" alt-text="Screenshot of how to add a new Windows 10 VM for a jump box.":::

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
   | **Public inbound ports** | Select **None** and then use [JIT access ](../security-center/security-center-just-in-time.md#jit-configure)to control access to the VM only when you want to access it.  Alternatively, you can use an [Azure Bastion](../bastion/tutorial-create-host-portal.md) to securely access the jump box server from the internet without exposing any network port.  |


1. Once validation passes, select **Create** to start the virtual machine creation process.

## Connect to the local vCenter of your private cloud

1. From the jump box, sign in to vSphere Client with VMware vCenter SSO using a cloud admin username and verify that the user interface displays successfully.

1. In the Azure portal, select your private cloud, and then **Manage** > **Identity**. 

   The URLs and user credentials for private cloud vCenter and NSX-T Manager display.

   :::image type="content" source="media/tutorial-access-private-cloud/ss4-display-identity.png" alt-text="Screenshot showing the private cloud vCenter and NSX Manager URLs and credentials." lightbox="media/tutorial-access-private-cloud/ss4-display-identity.png":::

1. Navigate to the VM you created in the preceding step and connect to the virtual machine. 

   If you need help with connecting to the VM, see [connect to a virtual machine](../virtual-machines/windows/connect-logon.md#connect-to-the-virtual-machine) for details.

1. In the Windows VM, open a browser and navigate to the vCenter and NSX-T Manager URLs in two tabs. 

1. In the vCenter tab, enter the `cloudadmin@vsphere.local` user credentials from the previous step.

   :::image type="content" source="media/tutorial-access-private-cloud/ss5-vcenter-login.png" alt-text="Screenshot showing the VMware vSphere sign in page." border="true":::

   :::image type="content" source="media/tutorial-access-private-cloud/ss6-vsphere-client-home.png" alt-text="Screenshot showing a summary of Cluster-1 in the vSphere Client." border="true":::

1. In the second tab of the browser, sign in to NSX-T Manager.

   :::image type="content" source="media/tutorial-access-private-cloud/ss10-nsx-manager-home.png" alt-text="Screenshot of the NSX-T Manager Overview." border="true":::



## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a Windows VM to use to connect to vCenter
> * Login to vCenter from your VM

Continue to the next tutorial to learn how to create a virtual network to set up local management for your private cloud clusters.

> [!div class="nextstepaction"]
> [Create a Virtual Network](tutorial-configure-networking.md)

