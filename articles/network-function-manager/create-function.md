---
title: 'Tutorial: Create a network function as a managed application'
titleSuffix: Azure Network Functions Manager
description: In this tutorial, learn how to create a network function as a managed application.
author: cherylmc
ms.service: vnf-manager
ms.topic: tutorial
ms.date: 05/12/2021
ms.author: cherylmc

---
# Tutorial: Create a network function as a managed application (Preview)

In this tutorial, you create a network function as a managed application for Azure Network Functions Manager.

> [!div class="checklist"]
> * Verify prerequisites
> * Create a network function
> * Verify network function details

## Prerequisites

* You have created a device for Network Functions Manager. If you have not completed those steps, see [How to create a device resource](create-device.md).
* On the **Overview** tab for the device, verify the following values are present:
  * Provisioning State = Succeeded
  * Device Status = Registered

## <a name="create"></a>Create a network function

1. Sign in to the [Azure Preview portal](https://aka.ms/AzureNetworkFunctionManager).
1. Navigate to the **Device** resource in which you want to deploy a network function and select **+Create Network Function**.

   :::image type="content" source="./media/create-function/create-network-function.png" alt-text="Screenshot of +Create Network Function." lightbox="./media/create-function/create-network-function.png":::
1. From the dropdown, choose the **Vendor SKU** you want to use, and click **Create**.

   :::image type="content" source="./media/create-function/create.png" alt-text="Screenshot of vendor SKU." lightbox="./media/create-function/create.png":::
1. Depending on the selected SKU, you will see a set of custom-managed app inputs that are needed by vendor to deploy the network function. For example, name, IP address, and location. 
   > [!NOTE]
   > You cannot use the first 4 IP addresses in the subnet (x.x.x.0-x.x.x.3) for your VM's IP settings because these addresses are reserved.
   >
1. Once the resource has been successfully deployed on the device, you can go the managed app resource group to view the managed app and underlying network function.
   :::image type="content" source="./media/create-function/view.png" alt-text="Screenshot of how to view settings." lightbox="./media/create-function/view.png":::

## <a name="verify"></a>Verify details

1. Verify that the details of managed app and network function are accurate. **Vendor Provisioning State = Provisioned** for the network function means that the VMs are running on your Azure Stack Edge.

   :::image type="content" source="./media/create-function/details.png" alt-text="Screenshot of essential details." lightbox="./media/create-function/details.png":::
1. Next, navigate to the partner portal to finish configuring the network function. Check with your partner for management portal and additional configuration steps.
  
## Next steps

Go to the vendor portal to finish configuring the network function.
