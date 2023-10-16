---
title: "Tutorial: Create a single virtual machine inbound NAT rule - Azure portal"
titleSuffix: Azure Load Balancer
description: In this tutorial, learn how to configure port forwarding using Azure Load Balancer to create a connection to a single virtual machine in an Azure virtual network.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: tutorial
ms.date: 07/18/2023
ms.custom: template-tutorial, engagement-fy23, FY23 content-maintenance
---

# Tutorial: Create a single virtual machine inbound NAT rule using the Azure portal

Inbound NAT rules allow you to connect to virtual machines (VMs) in an Azure virtual network by using an Azure Load Balancer public IP address and port number. 

For more information about Azure Load Balancer rules, see [Manage rules for Azure Load Balancer using the Azure portal](manage-rules-how-to.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and virtual machines
> * Create a standard SKU public load balancer with frontend IP, health probe, backend configuration, load-balancing rule, and inbound NAT rules
> * Create a NAT gateway for outbound internet access for the backend pool
> * Install and configure a web server on the VMs to demonstrate the port forwarding and load-balancing rules

:::image type="content" source="media/tutorial-load-balancer-port-forwarding-portal/load-balancer-port-forwarding-resources-thumb.png" alt-text="Diagram of load balancer resources for deploying an inbound NAT rule for a virtual machine." lightbox="media/tutorial-load-balancer-port-forwarding-portal/load-balancer-port-forwarding-resources.png":::

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create virtual network and virtual machines

A virtual network and subnet is required for the resources in the tutorial. In this section, you create a virtual network and virtual machines for the later steps.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. In **Virtual machines**, select **+ Create** > **+ Virtual machine**.
   
1. In **Create a virtual machine**, enter or select the following values in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter *myResourceGroup*. </br> Select **OK**. |
    | **Instance details** |    |
    | Virtual machine name | Enter *myVM1*. |
    | Region | Select **(US) West US 2**. |
    | Availability options | Select **Availability zone**. |
    | Availability zone | Select **Zone 1**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 20.04 LTS - Gen2**. |
    | Azure Spot instance | Leave the default of unchecked. |
    | Size | Select a VM size. |
    | **Administrator account** |    |
    | Authentication type | Select **SSH public key**. |
    | Username | Enter *azureuser*. |
    | SSH public key source | Select **Generate new key pair**. |
    | Key pair name | Enter *myKey*. |
    | **Inbound port rules** |    |
    | Public inbound ports | Select **None**. |

    :::image type="content" source="./media/tutorial-load-balancer-port-forwarding-portal/create-vm-portal.png" alt-text="Screenshot of create virtual machine.":::

1. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.

1. In the **Networking** tab, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **Create new**. </br> Enter *myVNet* in **Name**. </br> In **Address space**, under **Address range**, enter *10.1.0.0/16*. </br> In **Subnets**, under **Subnet name**, enter *myBackendSubnet*. </br> In **Address range**, enter *10.1.0.0/24*. </br> Select **OK**. |
    | Subnet | Select **myBackendSubnet**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**. </br> Enter *myNSG* in **Name**. </br> Select **+ Add an inbound rule** under **Inbound rules**. </br> In **Service**, select **HTTP**. </br> Enter *100* in **Priority**. </br> Enter *myNSGRule* for **Name**. </br> Select **Add**. </br> Select **OK**. |

1. Select the **Review + create** tab, or select the **Review + create** button at the bottom of the page.

1. Select **Create**.

1. At the **Generate new key pair** prompt, select **Download private key and create resource**. Your key file is downloaded as myKey.pem. Ensure you know where the .pem file was downloaded, you'll need the path to the key file in later steps.

1. Follow the steps 1 through 7 to create another VM with the following values and all the other settings the same as **myVM1**:

    | Setting | Value |
    | ------- | ----- |
    | **Basics** |    |
    | **Instance details** |   |
    | Virtual machine name | Enter *myVM2* |
    | Availability zone | Select **Zone 2** |
    | **Administrator account** |   |
    | Authentication type | Select **SSH public key** |
    | SSH public key source | Select **Use existing key stored in Azure**. |
    | Stored Keys | Select **myKey**. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |
    | **Networking** |   |
    | **Network interface** |  |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select the existing **myNSG** |

## Create a load balancer

You create a load balancer in this section. The frontend IP, backend pool, load-balancing, and inbound NAT rules are configured as part of the creation.

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

1. In the **Load balancer** page, select **Create**.

1. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **myResourceGroup**. |
    | **Instance details** |   |
    | Name                   | Enter *myLoadBalancer*                                   |
    | Region         | Select **West US 2**.                                        |
    | SKU           | Leave the default **Standard**. |
    | Type          | Select **Public**.                                        |
    | Tier          | Leave the default **Regional**. |

1. Select **Next: Frontend IP configuration** at the bottom of the page.

1. In **Frontend IP configuration**, select **+ Add a frontend IP configuration**.

1. Enter *myFrontend* in **Name**.

1. Select **IPv4** or **IPv6** for the **IP version**.

    > [!NOTE]
    > IPv6 isn't currently supported with Routing Preference or Cross-region load-balancing (Global Tier).

1. Select **IP address** for the **IP type**.

    > [!NOTE]
    > For more information on IP prefixes, see [Azure Public IP address prefix](../virtual-network/ip-services/public-ip-address-prefix.md).

1. Select **Create new** in **Public IP address**.

1. In **Add a public IP address**, enter *myPublicIP* for **Name**.

1. Select **Zone-redundant** in **Availability zone**.

    > [!NOTE]
    > In regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no-zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../availability-zones/az-overview.md).

1. Leave the default of **Microsoft Network** for **Routing preference**.

1. Select **OK**.

1. Select **Add**.

1. Select **Next: Backend pools** at the bottom of the page.

1. In the **Backend pools** tab, select **+ Add a backend pool**.

1. Enter or select the following information in **Add backend pool**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter *myBackendPool*. |
    | Virtual network | Select **myVNet (myResourceGroup)**. |
    | Backend Pool Configuration | Select **NIC**. |

1. Select **+ Add** in **Virtual machines**.

1. Select the checkboxes next to **myVM1** and **myVM2** in **Add virtual machines to backend pool**.

1. Select **Add** and then select **Save**.

1. Select the **Next: Inbound rules** button at the bottom of the page.

1. In **Load balancing rule** in the **Inbound rules** tab, select **+ Add a load balancing rule**.

1. In **Add load balancing rule**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter *myHTTPRule* |
    | IP Version | Select **IPv4** or **IPv6** depending on your requirements. |
    | Frontend IP address | Select **myFrontend (To be created)**. |
    | Backend pool | Select **myBackendPool**. |
    | Protocol | Select **TCP**. |
    | Port | Enter *80*. |
    | Backend port | Enter *80*. |
    | Health probe | Select **Create new**. </br> In **Name**, enter *myHealthProbe*. </br> Select **TCP** in **Protocol**. </br> Leave the rest of the defaults, and select **Save**. |
    | Session persistence | Select **None**. |
    | Idle timeout (minutes) | Enter or select **15**. |
    | Enable TCP reset | Select **checkbox** to enable. |
    | Enable Floating IP | Leave the default of unchecked. |
    | Outbound source network address translation (SNAT) | Leave the default of **(Recommended) Use outbound rules to provide backend pool members access to the internet.** |

    For more information about load-balancing rules, see [Load-balancing rules](manage-rules-how-to.md#load-balancing-rules).

1. Select **Save**.

1. In **Inbound NAT rule** in the **Inbound rules** tab, select **+ Add an inbound nat rule**.

1. In **Add inbound NAT rule**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter *myNATRuleVM1-221*. |
    | Target virtual machine | Select **myVM1**. |
    | Network IP configuration | Select **ipconfig1 (10.1.0.4)**. |
    | Frontend IP address | Select **myFrontend (To be created)**. |
    | Frontend Port | Enter *221*. |
    | Service Tag | Select **Custom**. |
    | Backend port | Enter *22*. |
    | Protocol | Leave the default of **TCP**. |
    | Enable TCP Reset | Leave the default of unchecked. |
    | Idle timeout (minutes) | Leave the default **4**. |
    | Enable Floating IP | Leave the default of unchecked. |

1. Select **Add**.

1. Select **+ Add an inbound nat rule**.

1. In **Add inbound NAT rule**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter *myNATRuleVM2-222*. |
    | Target virtual machine | Select **myVM2**. |
    | Network IP configuration | Select **ipconfig1 (10.1.0.5)**. |
    | Frontend IP address | Select **myFrontend**. |
    | Frontend Port | Enter *222*. |
    | Service Tag | Select **Custom**. |
    | Backend port | Enter *22*. |
    | Protocol | Leave the default of **TCP**. |
    | Enable TCP Reset | Leave the default of unchecked. |
    | Idle timeout (minutes) | Leave the default **4**. |
    | Enable Floating IP | Leave the default of unchecked. |

1. Select **Add**.

1. Select the blue **Review + create** button at the bottom of the page.

1. Select **Create**.

## Create a NAT gateway

In this section, you create a NAT gateway for outbound internet access for resources in the virtual network. 

For more information about outbound connections and Azure Virtual Network NAT, see [Using Source Network Address Translation (SNAT) for outbound connections](load-balancer-outbound-connections.md) and [What is Virtual Network NAT?](../virtual-network/nat-gateway/nat-overview.md).

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. In **NAT gateways**, select **+ Create**.

1. In **Create network address translation (NAT) gateway**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |    |
    | NAT gateway name | Enter *myNATgateway*. |
    | Region | Select **West US 2**. |
    | Availability zone | Select **None**. |
    | Idle timeout (minutes) | Enter *15*. |

1. Select the **Outbound IP** tab or select the **Next: Outbound IP** button at the bottom of the page.

1. In **Outbound IP**, select **Create a new public IP address** next to **Public IP addresses**.

1. Enter *myNATGatewayIP* in **Name** in **Add a public IP address**.

1. Select **OK**.

1. Select the **Subnet** tab or select the **Next: Subnet** button at the bottom of the page.

1. In **Virtual network** in the **Subnet** tab, select **myVNet**.

1. Select **myBackendSubnet** under **Subnet name**.

1. Select the blue **Review + create** button at the bottom of the page, or select the **Review + create** tab.

1. Select **Create**.

## Install web server

In this section, you'll SSH to the virtual machines through the inbound NAT rules and install a web server.

1. In the search box at the top of the portal, enter *Load balancer*. Select **Load balancers** in the search results.

1. Select **myLoadBalancer**.

1. Select **Fronted IP configuration** in **Settings**.

1. In the **Frontend IP configuration**, make note of the **IP address** for **myFrontend**. In this example, it's **20.99.165.176**.

    :::image type="content" source="./media/tutorial-load-balancer-port-forwarding-portal/get-public-ip.png" alt-text="Screenshot of public IP in Azure portal.":::

1. If you're using a Mac or Linux computer, open a Bash prompt. If you're using a Windows computer, open a PowerShell prompt.

1. At your prompt, open an SSH connection to **myVM1**. Replace the IP address with the address you retrieved in the previous step and port **221** you used for the myVM1 inbound NAT rule. Replace the path to the .pem with the path to where the key file was downloaded.

    ```console
    ssh -i .\Downloads\myKey.pem azureuser@20.99.165.176 -p 221
    ```

    > [!TIP]
    > The SSH key you created can be used the next time your create a VM in Azure. Just select the **Use a key stored in Azure** for **SSH public key source** the next time you create a VM. You already have the private key on your computer, so you won't need to download anything.

1. From your SSH session, update your package sources and then install the latest NGINX package.

    ```bash
    sudo apt-get -y update
    sudo apt-get -y install nginx
    ``` 

1. Enter `Exit` to leave the SSH session

1. At your prompt, open an SSH connection to **myVM2**. Replace the IP address with the address you retrieved in the previous step and port **222** you used for the myVM2 inbound NAT rule. Replace the path to the .pem with the path to where the key file was downloaded.

    ```console
    ssh -i .\Downloads\myKey.pem azureuser@20.99.165.176 -p 222
    ```

1. From your SSH session, update your package sources and then install the latest NGINX package.

    ```bash
    sudo apt-get -y update
    sudo apt-get -y install nginx
    ``` 

1. Enter `Exit` to leave the SSH session.

## Test the web server

In this section you test the web server by using the public IP address for the load balancer.

1. Open your web browser.

1. In the address bar, enter the IP address for the load balancer. In this example, it's **20.99.165.176**.

1. The default NGINX website is displayed.

    :::image type="content" source="./media/tutorial-load-balancer-port-forwarding-portal/web-server-test.png" alt-text="Screenshot of testing the NGINX web server.":::

## Clean up resources

If you're not going to continue to use this application, delete the virtual machines and load balancer with the following steps:

1. In the search box at the top of the portal, enter **Resource group**.  Select **Resource groups** in the search results.

1. Select **myResourceGroup** in **Resource groups**.

1. Select **Delete resource group**.

1. Enter *myResourceGroup* in **TYPE THE RESOURCE GROUP NAME:**. Select **Delete**.

## Next steps

Advance to the next article to learn how to create a cross-region load balancer:

> [!div class="nextstepaction"]
> [Create a multiple virtual machines inbound NAT rule using the Azure portal](tutorial-nat-rule-multi-instance-portal.md)
