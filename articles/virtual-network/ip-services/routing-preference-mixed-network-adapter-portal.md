---
title: 'Tutorial: Configure both routing preference options for a virtual machine - Azure portal'
titlesuffix: Azure Virtual Network
description: Use this tutorial to learn how to configure both routing preference options for a virtual machine using the Azure portal.
ms.date: 08/24/2023
ms.author: mbender
author: mbender-ms
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: tutorial
ms.custom: template-tutorial
---

# Tutorial: Configure both routing preference options for a virtual machine using the Azure portal

This article shows you how to configure both [routing preference](routing-preference-overview.md) options (Internet and Microsoft global network) for a virtual machine (VM). This configuration is achieved using two virtual network interfaces. One network interface is configured with a public IP routed via the Microsoft global network. The other network interface is configured with a public IP routed via an ISP network.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual machine with a public IP address with the **Microsoft network** routing preference.
> * Create a public IP address with the **Internet** routing preference.
> * Create a secondary network interface for the virtual machine.
> * Associate the **Internet** routing preference public IP to the virtual machine secondary network interface.
> * Attach secondary network interface to virtual machine.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create the virtual machine

In this section, you'll create a virtual machine and public IP address. During the public IP address configuration, you'll select **Microsoft network** for routing preference.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the portal search box, enter **Virtual machine**. In the search results, select **Virtual machines**.

3. In **Virtual machines**, select **+ Create**, then **+ Virtual machine**.

4. In the **Basics** tab of **Create a virtual machine**, enter, or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **TutorVMMixRoutePref-rg**. Select **OK**. |
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

    :::image type="content" source="./media/routing-preference-mixed-network-adapter-portal/create-virtual-machine.png" alt-text="Screenshot of create virtual machine.":::

5. Select **Next: Disks** then **Next: Networking**, or select the **Networking** tab.

6. In the networking tab, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Leave the default of **(new) TutorVMMixRoutePref-rg-vnet**. |
    | Subnet | Leave the default of **(new) default (10.1.0.0/24)**. |
    | Public IP | Select **Create new**. </br> In **Name**, enter **myPublicIP**. </br> Select **Standard** in **SKU**. </br> In **Routing preference**, select **Microsoft network**. </br> Select **OK**. |

    :::image type="content" source="./media/routing-preference-mixed-network-adapter-portal/create-public-ip-ms-rp.png" alt-text="Screenshot of create public IP address with Microsoft routing preference.":::

7. Select **Review + create**.

8. Select **Create**.

## Create the public IP address

In this section, you'll create a public IP address with the **Internet** routing preference.

1. In the portal search box, enter **Public IP address**. In the search results, select **Public IP addresses**.

2. Select **+ Create**.

3. In **Create public IP address**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | IP Version | Leave the default of **IPv4**. |
    | SKU | Leave the default of **Standard**. |
    | Tier | Leave the default of **Regional**. |
    | **IPv4 IP Address Configuration** |   |
    | Name | Enter **myPublicIP-IR**. |
    | Routing preference | Select **Internet**. |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorVMMixRoutePref-rg**. |
    | Location | Select **West US 2**. |

    :::image type="content" source="./media/routing-preference-mixed-network-adapter-portal/create-public-ip-internet-rp.png" alt-text="Screenshot of create public IP address with Internet routing preference.":::

4. Select **Create**.

## Create the secondary NIC

In this section, you'll create a secondary network interface for the virtual machine you created previously.

1. In the portal search box, enter **Network interface**. In the search results, select **Network interfaces**.

2. Select **+ Create**.

3. In **Create network interface**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorVMMixRoutePref-rg**. |
    | Name | Enter **myVMNic2**. |
    | Region | Select **West US 2**. |
    | Virtual network | Select **TutorVMMixRoutePref-rg-vnet**. |
    | Subnet | Select **TutorVMMixRoutePref-rg-vnet/default (10.1.0.0/24)**. |
    | Network security group | Select **myVM-nsg**. |

    :::image type="content" source="./media/routing-preference-mixed-network-adapter-portal/create-network-interface.png" alt-text="Screenshot of create secondary network interface.":::

4. Select the **Review + create** tab, or select the **Review + create** button at the bottom of the page.

5. Select **Create**.

## Associate the public IP address with secondary NIC

In this section, you'll associate the **Internet** routing preference public IP address you created previously with the network interface you created in the previous section.

1. In the portal search box, enter **Public IP address**. In the search results, select **Public IP addresses**.

2. Select **myPublicIP-IR**.

3. In the **Overview** page of **myPublic-IR**, select **Associate**.

    :::image type="content" source="./media/routing-preference-mixed-network-adapter-portal/associate-public-ip.png" alt-text="Screenshot of myPublicIP-IR overview page with associate button.":::

4. In **Associate public IP address**, select **Network interface** in the **Resource type** pull-down box.

5. Select **myVMNic2** in the **Network interface** pull-down box.

    :::image type="content" source="./media/routing-preference-mixed-network-adapter-portal/select-ip-association-resource.png" alt-text="Screenshot of selecting resource to associate to public IP address.":::

6. Select **OK**.

## Attach secondary network interface to virtual machine

In this section, you'll attach the secondary network interface you created previously to the virtual machine.

1. In the portal search box, enter **Virtual machine**. In the search results, select **Virtual machines**.

2. Select **myVM**.

3. Stop **myVM** if it's running, otherwise continue to next step.

4. In **myVM**, select **Networking** in **Settings**.

5. In **Networking** of **myVM**, select **Attach network interface**.

    :::image type="content" source="./media/routing-preference-mixed-network-adapter-portal/attach-nic-01.png" alt-text="Screenshot of myVM networking overview page.":::

6. In **Attach network interface**, select **myVMNic2** in the pull-down box.

    :::image type="content" source="./media/routing-preference-mixed-network-adapter-portal/attach-nic-02.png" alt-text="Screenshot of attach network interface.":::

7. Select **OK**.

## Clean up resources

If you're not going to continue to use this application, delete the public IP addresses and virtual machine with the following steps:

1. In the search box at the top of the portal, enter **Resource group**.

2. In the search results, select **Resource groups**.

3. Select **TutorVMMixRoutePref-rg**

4. Select **Delete resource group**.

5. Enter **myResourceGroup** for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Next steps

Advance to the next article to learn how to create a public IP prefix:
> [!div class="nextstepaction"]
> [Configure routing preference for a Kubernetes cluster using Azure CLI](routing-preference-azure-kubernetes-service-cli.md)