---
title: "Quickstart: Deploy a virtual machine in an Extended Zone - Azure portal"
description: Learn how to deploy a virtual machine (VM) in an Azure Extended Zone using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: azure-extended-zones
ms.topic: quickstart
ms.date: 08/02/2024
---
  
# Quickstart: Deploy a virtual machine in an Extended Zone using the Azure portal
 
> [!IMPORTANT]
> Azure Extended Zones service is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this quickstart, you learn how to deploy a virtual machine (VM) in Los Angeles Extended Zone using the Azure portal.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure account with an active subscription

- Access to Los Angeles Extended Zone. For more information, see [Request access to an Azure Extended Zone](request-access.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create a virtual network in an Extended Zone

In this section, you create a virtual network in the Azure Extended Zone that you want to deploy a virtual machine to.

1. In the search box at the top of the portal, enter ***virtual network***. Select **Virtual networks** from the search results.

    :::image type="content" source="./media/deploy-vm-portal/portal-search.png" alt-text="Screenshot that shows how to search for virtual machines in the Azure portal.":::

1. In the **Virtual networks** page, select **+ Create**.

1. On the **Basics** tab of **Create virtual network**, enter, or select the following information:

    | Setting | Value |
    | --- | --- |
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Create new**. </br> Enter *myResourceGroup* in **Name**. </br> Select **OK**. |
    | **Instance details** |  |
    | Virtual network name | Enter *myVNet*. |
    | Region | Select **Deploy to an Azure Extended Zone**. </br> In  **Azure Extended Zones**, select **Los Angeles**. </br> Select the **Select** button. |

    :::image type="content" source="./media/deploy-vm-portal/create-vnet-basics.png" alt-text="Screenshot that shows the Basics tab of creating a virtual network in an Azure Extended Zone." lightbox="./media/deploy-vm-portal/create-vnet-basics.png":::

1. Select **Review + create**.

    :::image type="content" source="./media/deploy-vm-portal/review-create-vnet.png" alt-text="Screenshot that shows the Basics tab of creating a virtual network after selecting the Extended Zone." lightbox="./media/deploy-vm-portal/review-create-vnet.png":::

1. Review the settings, and then select **Create**.

## Create a virtual machine in an Extended Zone

1. In the search box at the top of the portal, enter ***virtual machines***. Select **Virtual machines** from the search results.

1. In the **Virtual machines** page, select **+ Create** and then select **Azure virtual machine**.

1. On the **Basics** tab of **Create a virtual machine**, enter, or select the following information:

    | Setting | Value |
    | --- | --- |
    | **Project details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |  |
    | Virtual machine name | Enter *myVM*. |
    | Region | Select **Deploy to an Azure Extended Zone**. </br> In  **Azure Extended Zones**, select **Los Angeles**. </br> Select the **Select** button. |
    | Availability options | Select **No infrastructure redundancy required**. Azure Extended Zones don't support availability zones. |
    | Security type | Leave the default of **Standard**.  The other available option is **Trusted launch virtual machines**.|
    | Image | Select **Windows Server 2022 Datacenter: Azure Edition - x64 Gen2**. |
    | Size | Choose a size or leave the default setting. |
    | **Administrator account** |  |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Select **RDP (3389)**. |

    :::image type="content" source="./media/deploy-vm-portal/create-vm-basics.png" alt-text="Screenshot that shows the Basics tab of creating a virtual machine in an Azure Extended Zone." lightbox="./media/deploy-vm-portal/create-vm-basics.png":::

1. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.

1. On the **Networking** tab, enter or select the following information:

    | Setting | Value |
    | --- | --- |
    | **Network interface** |  |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **default (10.0.0.0/24)**. |
    | Public IP | Select **(new) myVM-ip**. |
    | NIC network security group |  Select **Basic**. |
    
    :::image type="content" source="./media/deploy-vm-portal/create-vm-networking.png" alt-text="Screenshot that shows the Networking tab of creating a virtual machine in an Azure Extended Zone." lightbox="./media/deploy-vm-portal/create-vm-networking.png":::

    > [!CAUTION]
    > Leaving the RDP port open to the internet is only recommended for testing. For production environments, it's recommended to restrict access to the RDP port to a specific IP address or range of IP addresses. You can also block internet access to the RDP port and use [Azure Bastion](../bastion/bastion-overview.md) to securely connect to your virtual machine from the Azure portal. 

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

1. After deployment is complete, select **Go to resource**.

## Connect to virtual machine

1. Select **Connect**.

1.  Under **Native RDP**, select the **select** button.

    :::image type="content" source="./media/deploy-vm-portal/connect-vm.png" alt-text="Screenshot that shows how to connect to a virtual machine using RDP." lightbox="./media/deploy-vm-portal/connect-vm.png":::

1. Select **Download RDP file** and open the downloaded file.

1. Select **Connect** and then enter the username and password that you created in the previous steps. Accept the certificate if prompted.

> [!NOTE]
> Default outbound access is not available to VMs in Azure Extended Zones. For more information, see [Default outbound access in Azure](../virtual-network/ip-services/default-outbound-access.md).

## Clean up resources

When no longer needed, delete **myResourceGroup** resource group and all of the resources it contains:

1. In the search box at the top of the portal, enter ***myResourceGroup***. Select **myResourceGroup** from the search results.

1. Select **Delete resource group**.

1. In **Delete a resource group**, enter ***myResourceGroup***, and then select **Delete**.

1. Select **Delete** to confirm the deletion of the resource group and all its resources.

## Related content

- [Deploy an AKS cluster in an Extended Zone](deploy-aks-cluster.md)
- [Deploy a storage account in an Extended Zone](create-storage-account.md)
- [Frequently asked questions](faq.md)
