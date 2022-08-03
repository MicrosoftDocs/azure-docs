---
title: 'Tutorial: Deploy network functions on Azure Stack Edge'
titleSuffix: Azure Network Function Manager
description: In this tutorial, learn how to deploy a network function as a managed application.
author: polarapfel
ms.service: network-function-manager
ms.topic: tutorial
ms.date: 11/02/2021
ms.author: tobiaw
ms.custom: ignite-fall-2021
---
# Tutorial: Deploy network functions on Azure Stack Edge

In this tutorial, you learn how to deploy a network function on Azure Stack Edge using the Azure Marketplace. Network Function Manager enables an Azure Managed Applications experience for a simplified deployment on Azure Stack Edge.

> [!div class="checklist"]
> * Verify [prerequisites](#prereq)
> * Create a network function
> * Verify network function details

## <a name="prereq"></a>Prerequisites

* You have met all the prerequisites listed in the [Prerequisites and requirements](requirements.md) article.
* You have created a device resource for Network Function Manager. If you have not completed those steps, see [How to create a device resource](create-device.md).
* On the **Overview** tab for the device, verify the following values are present:
  * Provisioning State = Succeeded
  * Device Status = Registered

## <a name="create"></a>Create a network function

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to the **Device** resource in which you want to deploy a network function and select **+Create Network Function**.

   :::image type="content" source="./media/deploy-functions/create-network-function.png" alt-text="Screenshot of +Create Network Function." lightbox="./media/deploy-functions/create-network-function.png":::
1. From the dropdown, choose the **Vendor SKU** you want to use, then click **Create**.

   :::image type="content" source="./media/deploy-functions/select.png" alt-text="Screenshot of vendor SKU." lightbox="./media/deploy-functions/select.png":::
1. Depending on the selected SKU, you will be redirected to the Marketplace portal for the network function managed application.
 
   Every network function partner will have different requirements for deploying their network function on Azure Stack Edge. Additionally, some network functions such as mobile packet core and SD-WAN edge, may require you to configure management, LAN, and WAN ports and allocate IP addresses on these ports before you deploy the network functions. Check with your partner on the required properties and Azure Stack Edge device network configuration.
   
   > [!IMPORTANT]
   > For all network functions that support static IP address for management, LAN, or WAN virtual network interfaces, ensure that you don’t use the first four IP addresses from the IP address range assigned for the specific port. These IP addresses are reserved IP address for the Azure Stack Edge service.
   >

1. Follow the steps in the marketplace portal to deploy the partner-managed application. Once the managed application is successfully provisioned, you can go to the resource group to view the managed app. To check if the vendor provisioning status of the network function resource is Provisioned, go to the managed resource group. This confirms that the deployment of the network function is successful, and the required additional configurations can be provisioned through the network function partner management portal. Check with the network function partner for the management experience following initial deployment using Network Function Manager.

### Example

1. Find the **Fusion Core – 5G packet core** offer in Marketplace and click **Create** to begin creating your network function.

   :::image type="content" source="./media/deploy-functions/metaswitch.png" alt-text="Screenshot of Metaswitch page." lightbox="./media/deploy-functions/metaswitch.png":::
1. Configure Basic settings.

   :::image type="content" source="./media/deploy-functions/basics-blade.png" alt-text="Screenshot Basic settings." lightbox="./media/deploy-functions/basics-blade.png":::
1. Apply managed identity. For more information, see [Managed Identity](resources-permissions.md).

   :::image type="content" source="./media/deploy-functions/managed-identity.png" alt-text="Screenshot of Managed Identity." lightbox="./media/deploy-functions/managed-identity.png":::
1. Enter IP Address information for Management, LAN, and WAN interfaces of the Fusion Core VM.

   :::image type="content" source="./media/deploy-functions/ip-settings.png" alt-text="Screenshot of Management, LAN, and WAN interfaces of the Fusion Core VM." lightbox="./media/deploy-functions/ip-settings.png":::
1. Enter optional settings for 5G and Test UEs configuration.

   :::image type="content" source="./media/deploy-functions/5g-settings-blade.png" alt-text="Screenshot of 5G." lightbox="./media/deploy-functions/5g-settings-blade.png":::

   :::image type="content" source="./media/deploy-functions/test-blade.png" alt-text="Screenshot of Test UEs configuration." lightbox="./media/deploy-functions/test-blade.png":::
1. Once validation has passed, agree to the terms and conditions. Then click **Create** to begin creating the Fusion Core Managed Application in the Customer resource group and the Network Function resource in the managed resource group. You must check the **Show Hidden Types** box in the managed resource group view to see the Network Function resource.

   :::image type="content" source="./media/deploy-functions/managed-app-customer.png" alt-text="Screenshot of Managed App in the Customer resource group." lightbox="./media/deploy-functions/managed-app-customer.png":::

   :::image type="content" source="./media/deploy-functions/managed-resource-group.png" alt-text="Screenshot of the network function in the managed resource group." lightbox="./media/deploy-functions/managed-resource-group.png":::

## Next steps

Navigate to the vendor portal to finish configuring the network function.
