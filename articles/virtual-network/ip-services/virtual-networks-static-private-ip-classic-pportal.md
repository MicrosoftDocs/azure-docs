---
title: Configure private IP addresses for VMs (Classic) - Azure portal
description: Learn how to configure private IP addresses for virtual machines (Classic) using the Azure portal.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 03/22/2023
ms.author: allensu
ms.custom: H1Hack27Feb2017
---

# Configure private IP addresses for a virtual machine (Classic) using the Azure portal

[!INCLUDE [virtual-networks-static-private-ip-selectors-classic-include](../../../includes/virtual-networks-static-private-ip-selectors-classic-include.md)]

[!INCLUDE [virtual-networks-static-private-ip-intro-include](../../../includes/virtual-networks-static-private-ip-intro-include.md)]

[!INCLUDE [azure-arm-classic-important-include](../../../includes/azure-arm-classic-important-include.md)]

This article covers the classic deployment model. You can also [manage a static private IP address in the Resource Manager deployment model](virtual-networks-static-private-ip-arm-pportal.md).

[!INCLUDE [virtual-networks-static-ip-scenario-include](../../../includes/virtual-networks-static-ip-scenario-include.md)]

The sample steps that follow expect an environment already created. If you want to run the steps as they're displayed in this document, first build the test environment described in [create a vnet](/previous-versions/azure/virtual-network/virtual-networks-create-vnet-classic-pportal).

## How to specify a static private IP address when creating a VM

To create a VM named *DNS01* in the *FrontEnd* subnet of a VNet named *TestVNet* with a static private IP of *192.168.1.101*, complete the following steps:

1. From a browser, navigate to the [Azure portal](https://portal.azure.com) and, if necessary, sign in with your Azure account.

1. Select **NEW** > **Compute** > **Windows Server 2012 R2 Datacenter**, notice that the **Select a deployment model** list already shows **Classic**, and then select **Create**.
   
    :::image type="content" source="./media/virtual-networks-static-ip-classic-pportal/figure01.png" alt-text="Screenshot that shows the Azure portal with the New > Compute > Windows Server 2012 R2 Datacenter tile highlighted.":::

1. In **Create VM**, enter the name of the VM to be created (*DNS01* in the scenario), the local administrator account, and password.
   
    :::image type="content" source="./media/virtual-networks-static-ip-classic-pportal/figure02.png" alt-text="Screenshot that shows how to create a VM by entering the name of the VM, local administrator user name, and password.":::

1. Select **Optional Configuration** > **Network** > **Virtual Network**, and then select **TestVNet**. If **TestVNet** isn't available, make sure you're using the *Central US* location and have created the test environment described at the beginning of this article.

    :::image type="content" source="./media/virtual-networks-static-ip-classic-pportal/figure03.png" alt-text="Screenshot that shows the Optional Configuration > Network > Virtual Network > TestVNet option highlighted.":::

1. In **Network**, make sure the subnet currently selected is *FrontEnd*, then select **IP addresses**, under **IP address assignment** select **Static**, and then enter *192.168.1.101* for **IP Address** as seen in the following screenshot.

    :::image type="content" source="./media/virtual-networks-static-ip-classic-pportal/figure04.png" alt-text="Screenshot that highlights the IP Addresses field where you type the static IP address.":::
 
1. Select **OK** under **IP addresses**, select **OK** under **Network**, and then select **OK** under **Optional config**.

1. Under **Create VM**, select **Create**. Notice the following tile displayed in your dashboard:

    :::image type="content" source="./media/virtual-networks-static-ip-classic-pportal/figure05.png" alt-text="Screenshot that shows the Creating Windows Server 2012 R2 Datacenter tile.":::

## How to retrieve static private IP address information for a VM

To view the static private IP address information for the VM created with the previous steps, execute the following steps.

1. From the Azure portal, select **BROWSE ALL** > **Virtual machines (classic)** > **DNS01** > **All settings** > **IP addresses** and notice the following IP address assignment and IP address information:

    :::image type="content" source="./media/virtual-networks-static-ip-classic-pportal/figure06.png" alt-text=" Screenshot of create VM in Azure portal.":::

## How to remove a static private IP address from a VM

Under **IP addresses**, select **Dynamic** to the right of **IP address assignment**, select **Save**, and then select **Yes**, as shown in the following picture:

:::image type="content" source="./media/virtual-networks-static-ip-classic-pportal/figure07.png" alt-text="Screenshot that shows how to remove the static private IP address from a VM by selecting Dynamic to the right of the IP address assignment label.":::

## How to add a static private IP address to an existing VM

1. Under **IP addresses**, shown previously, select **Static** to the right of **IP address assignment**.

1. Type *192.168.1.101* for **IP address**, select **Save**, and then select **Yes**.

## Set IP addresses within the operating system

It’s recommended that you don't statically assign the private IP assigned to the Azure virtual machine within the operating system of a VM, unless necessary. If you do manually set the private IP address within the operating system, ensure that it's the same address as the private IP address assigned to the Azure VM. Failure to match the IP address could result in loss of connectivity to the virtual machine.

## Next steps

* Learn about [reserved public IP](/previous-versions/azure/virtual-network/virtual-networks-reserved-public-ip) addresses.

* Learn about [instance-level public IP (ILPIP)](/previous-versions/azure/virtual-network/virtual-networks-instance-level-public-ip) addresses.

* Consult the [Reserved IP REST APIs](/previous-versions/azure/reference/dn722420(v=azure.100)).
