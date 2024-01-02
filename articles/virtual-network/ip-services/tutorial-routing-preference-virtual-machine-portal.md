---
title: 'Tutorial: Configure routing preference for a VM - Azure portal'
description: In this tutorial, learn how to create a VM with a public IP address with routing preference choice using the Azure portal.
ms.date: 08/24/2023
ms.author: mbender
author: mbender-ms
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: tutorial
ms.custom: template-tutorial
---

# Tutorial: Configure routing preference for a VM using the Azure portal 

This tutorial shows you how to configure routing preference for a virtual machine. Internet bound traffic from the VM will be routed via the ISP network when you choose **Internet** as your routing preference option. The default routing is via the Microsoft global network.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual machine with a public IP address configured for **Internet** routing preference.
> * Verify the public IP address is set to **Internet** routing preference.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create virtual machine

In this section, you'll create a virtual machine and public IP address. During the public IP address configuration, you'll select **Internet** for routing preference.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the portal search box, enter **Virtual machine**. In the search results, select **Virtual machines**.

3. In **Virtual machines**, select **+ Create**, then **+ Virtual machine**.

4. In the **Basics** tab of **Create a virtual machine**, enter, or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **TutorVMRoutePref-rg**. Select **OK**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **myVM**. |
    | Region | Select **(US) West US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Image | Select **Windows Server 2019 Datacenter - Gen2**. |
    | Azure Spot instance | Leave the default of unchecked. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | **Inbound port rules** |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Leave the default of **RDP (3389)**. </br> _**Opening port 3389 from the internet is not recommended for production workloads**_. |

    :::image type="content" source="./media/tutorial-routing-preference-virtual-machine-portal/create-virtual-machine.png" alt-text="Screenshot of create virtual machine.":::

5. Select **Next: Disks** then **Next: Networking**, or select the **Networking** tab.

6. In the networking tab, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Leave the default of **(new) TutorVMRoutePref-rg-vnet**. |
    | Subnet | Leave the default of **(new) default (10.1.0.0/24)**. |
    | Public IP | Select **Create new**. </br> In **Name**, enter **myPublicIP**. </br> Select **Standard** in **SKU**. </br> In **Routing preference**, select **Internet**. </br> Select **OK**. |

    :::image type="content" source="./media/tutorial-routing-preference-virtual-machine-portal/create-public-ip.png" alt-text="Screenshot of create public IP address.":::

7. Select **Review + create**.

8. Select **Create**.

## Verify internet routing preference

In this section, you'll search for the public IP address previously created and verify the internet routing preference.

1. In the portal search box, enter **Public IP address**. In the search results, select **Public IP addresses**.

2. In **Public IP addresses**, select **myPublicIP**.

3. Select **Properties** in **Settings**.

4. Verify **Internet** is displayed in **Routing preference**. 

    :::image type="content" source="./media/tutorial-routing-preference-virtual-machine-portal/verify-routing-preference.png" alt-text="Screenshot of verify internet routing preference.":::

## Clean up resources

If you're not going to continue to use this application, delete the public IP address with the following steps:

1. In the search box at the top of the portal, enter **Resource group**.

2. In the search results, select **Resource groups**.

3. Select **TutorVMRoutePref-rg**

4. Select **Delete resource group**.

5. Enter **myResourceGroup** for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Next steps

Advance to the next article to learn how to create a virtual machine with mixed routing preference:
> [!div class="nextstepaction"]
> [Configure both routing preference options for a virtual machine](routing-preference-mixed-network-adapter-portal.md)

