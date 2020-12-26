---
title: Tutorial - Access your private cloud
description: Learn how to access an Azure VMware Solution private cloud
ms.topic: tutorial
ms.date: 09/21/2020
---

# Tutorial: Access an Azure VMware Solution private cloud

Azure VMware Solution doesn't allow you to manage your private cloud with your on-premises vCenter. You'll need to do additional setup and connection to a local vCenter instance through a jump box. 

In this tutorial, you'll create a jump box in the resource group you created in the [previous tutorial](tutorial-configure-networking.md) and sign into vCenter. The jump box is a Windows virtual machine (VM) on the same virtual network you created.  It provides access to vCenter and NSX Manager. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Windows virtual machine to use to connect to vCenter
> * Login to vCenter from your virtual machine

## Create a new Windows virtual machine

[!INCLUDE [create-avs-jump-box-steps](includes/create-jump-box-steps.md)]

## Connect to the local vCenter of your private cloud

1. From the jump box, sign in to vSphere Client with VMware vCenter SSO using a cloud admin username and verity that the user interface displays successfully.

1. In the Azure portal, select your private cloud and then in the **Overview** view, select **Identity > Default**. 

   The URLs and user credentials for private cloud vCenter and NSX-T Manager display.

   :::image type="content" source="media/tutorial-access-private-cloud/ss4-display-identity.png" alt-text="Display private cloud vCenter and NSX Manager URLs and credentials." border="true":::

1. Navigate to the VM you created in the preceding step and connect to the virtual machine. 

   If you need help with connecting to the VM, see [connect to a virtual machine](../virtual-machines/windows/connect-logon.md#connect-to-the-virtual-machine) for details.

1. In the Windows VM, open a browser and navigate to the vCenter and NSX-T Manger URLs in two tabs. 

1. In the vCenter tab, enter the `cloudadmin@vmcp.local` user credentials from the previous step.

   :::image type="content" source="media/tutorial-access-private-cloud/ss5-vcenter-login.png" alt-text="Sign in to private cloud vCenter." border="true":::

   :::image type="content" source="media/tutorial-access-private-cloud/ss6-vsphere-client-home.png" alt-text="vCenter portal." border="true":::

1. In the second tab of the browser, sign in to NSX-T manager.

   :::image type="content" source="media/tutorial-access-private-cloud/ss10-nsx-manager-home.png" alt-text="In the second tab of the browser, sign in to NSX-T manager." border="true":::



## Next steps

In this tutorial you learned how to:

> [!div class="checklist"]
> * Create a Windows virtual machine to use to connect to vCenter
> * Login to vCenter from your virtual machine

Continue to the next tutorial to learn how to create a virtual network to set up local management for your private cloud clusters.

> [!div class="nextstepaction"]
> [Create a Virtual Network](tutorial-configure-networking.md)


