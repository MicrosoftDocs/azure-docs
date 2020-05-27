---
title: Tutorial - Learn how to access your private cloud
description: Learn how to access an Azure VMware Solution (AVS) private cloud
ms.topic: tutorial
ms.date: 05/04/2020
---

# Tutorial: Learn how to access an Azure VMware Solution (AVS) private cloud

During preview, AVS does not allow you to manage your private cloud with your on-premises vCenter. You'll need to perform additional setup and connection to a local vCenter instance through a jump box. 

In this tutorial, you create a Windows virtual machine for a jump box in the resource group you created in the previous tutorial [Tutorial: Configure networking for your VMware private cloud in Azure](tutorial-configure-networking.md) and sign into vCenter. This is a VM on the same virtual network you created and provides access to vCenter and NSX Manager. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Windows virtual machine to use to connect to vCenter
> * Login to vCenter from your virtual machine

## Create a new Windows virtual machine

In the resource group, select **+ Add** then search and select **Microsoft Windows 10**, and then click **Create**.

:::image type="content" source="./media/tutorial-access-private-cloud/ss8-azure-w10vm-create.png" alt-text="Add a new Windows 10 VM for a jumpbox" border="true":::

Enter the required information in the fields, and then select **Review + create**. For more information on the fields, see the following table.

| Field | Value |
| --- | --- |
| **Subscription** | This value is already populated with the Subscription the Resource Group belongs to. |
| **Resource group** | This value is already populated for the current Resource Group. This should be the Resource Group you created in a preceding tutorial. |
| **Virtual machine name** | Enter a unique name for the VM. |
| **Region** | Select the geographical location of the VM. |
| **Availability options** | Leave the default value selected. |
| **Image** | Select the VM image. |
| **Size** | Leave the default size value. |
| **Authentication type**  | Select **Password**. |
| **Username** | Enter the user name for logging on to the VM. |
| **Password** | Enter the password for logging on to the VM. |
| **Confirm password** | Enter the password for logging on to the VM. |
| **Public inbound ports** | Select **None**. If you select None, you can use [JIT access](../security-center/security-center-just-in-time.md#configure-jit-access-from-an-azure-vms-page-) to control access to the VM only when you want to access it.  |

After you have entered the appropriate information, click **Review + create**. Once validation passes, select **Create** to start the virtual machine creation process.

:::image type="content" source="./media/tutorial-access-private-cloud/ss11-review-create-wjb01.png" alt-text="Create a new Windows 10 VM for a jumpbox" border="true":::

## Connect to the local vCenter of your private cloud

From the jump box sign in to vSphere Client with VMware vCenter SSO. sign in to the vSphere Client using a cloud administrator user name; accept the security risk and continue when you see a warning about a potential security risk; sign in to VMware vCenter with Single Sign-On credentials and verify the user interface successfully displays.

In the Azure portal, select your private cloud and then in the **Overview** view, select **Identity > Default**. The URLs and login credentials for private cloud vCenter and NSX-T manager are displayed.

:::image type="content" source="./media/tutorial-access-private-cloud/ss4-display-identity.png" alt-text="Display private cloud vCenter and NSX Manager URLs and credentials" border="true":::

Navigate to the virtual machine you created in the preceding step and connect to the virtual machine. For detailed steps on how to connect to the virtual machine, see [connect to a virtual machine](../virtual-machines/windows/connect-logon.md#connect-to-the-virtual-machine)

In the Windows VM, open a browser and navigate to the vCenter and NSX-T Manger URLs in two tabs. In the vCenter tab, enter the `cloudadmin@vmcp.local` user credentials from the previous step.

:::image type="content" source="./media/tutorial-access-private-cloud/ss5-vcenter-login.png" alt-text="Sign in to private cloud vCenter" border="true":::

:::image type="content" source="./media/tutorial-access-private-cloud/ss6-vsphere-client-home.png" alt-text="vCenter portal" border="true":::

In the second tab of the browser, sign in to NSX-T manager.

:::image type="content" source="./media/tutorial-access-private-cloud/ss10-nsx-manager-home.png" alt-text="Local private cloud NSX Manger home" border="true":::

## Next steps

In this tutorial you learned how to:

> [!div class="checklist"]
> * Create a Windows virtual machine to use to connect to vCenter
> * Login to vCenter from your virtual machine

Continue to the next tutorial to learn how to scale your AVS private cloud.

> [!div class="nextstepaction"]
> [Scale an AVS private cloud](tutorial-scale-private-cloud.md)
