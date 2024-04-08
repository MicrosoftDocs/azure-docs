---
title: "Tutorial: Create a single virtual machine inbound NAT rule - Azure portal"
titleSuffix: Azure Load Balancer
description: Learn to configure port forwarding using Azure Load Balancer and NAT gateway to create a connection to a single virtual machine in an Azure virtual network.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: tutorial
ms.date: 10/24/2023
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

:::image type="content" source="media/tutorial-load-balancer-port-forwarding-portal/load-balancer-port-forwarding-resources.png" alt-text="Diagram of load balancer resources for deploying an inbound NAT rule for a virtual machine.":::

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

[!INCLUDE [load-balancer-create-vnet-vm](../../includes/load-balancer-create-vnet-vm.md)]

## Create a load balancer

You create a load balancer in this section. The frontend IP, backend pool, load-balancing, and inbound NAT rules are configured as part of the creation.

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

1. In the **Load balancer** page, select **Create**.

1. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **load-balancer-rg**. |
    | **Instance details** |   |
    | Name                   | Enter *load-balancer*                                   |
    | Region         | Select **East US**.                                        |
    | SKU           | Leave the default **Standard**. |
    | Type          | Select **Public**.                                        |
    | Tier          | Leave the default **Regional**. |

1. Select **Next: Frontend IP configuration** at the bottom of the page.

1. In **Frontend IP configuration**, select **+ Add a frontend IP configuration**.

1. Enter *lb-frontend* in **Name**.

1. Select **IPv4** or **IPv6** for the **IP version**.

    > [!NOTE]
    > IPv6 isn't currently supported with Routing Preference or Cross-region load-balancing (Global Tier).

1. Select **IP address** for the **IP type**.

    > [!NOTE]
    > For more information on IP prefixes, see [Azure Public IP address prefix](../virtual-network/ip-services/public-ip-address-prefix.md).

1. Select **Create new** in **Public IP address**.

1. In **Add a public IP address**, enter *lb-frontend-ip* for **Name**.

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
    | Name | Enter *lb-backend-pool*. |
    | Virtual network | Select **lb-vnet (load-balancer-rg)**. |
    | Backend Pool Configuration | Select **NIC**. |

1. Select **+ Add** in **Virtual machines**.

1. Select the checkboxes next to **lb-vm1** and **lb-vm2** in **Add virtual machines to backend pool**.

1. Select **Add** and then select **Save**.

1. Select the **Next: Inbound rules** button at the bottom of the page.

1. In **Load balancing rule** in the **Inbound rules** tab, select **+ Add a load balancing rule**.

1. In **Add load balancing rule**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter *lb-HTTP-rule* |
    | IP Version | Select **IPv4** or **IPv6** depending on your requirements. |
    | Frontend IP address | Select **lb-frontend (To be created)**. |
    | Backend pool | Select **lb-backend-pool**. |
    | Protocol | Select **TCP**. |
    | Port | Enter *80*. |
    | Backend port | Enter *80*. |
    | Health probe | Select **Create new**. </br> In **Name**, enter *lb-health-probe*. </br> Select **TCP** in **Protocol**. </br> Leave the rest of the defaults, and select **Save**. |
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
    | Name | Enter *lb-NAT-rule-VM1-221*. |
    | Target virtual machine | Select **lb-vm1**. |
    | Network IP configuration | Select **ipconfig1 (10.0.0.4)**. |
    | Frontend IP address | Select **lb-frontend (To be created)**. |
    | Frontend Port | Enter *221*. |
    | Service Tag | Select **Custom**. |
    | Backend port | Enter *22*. |
    | Protocol | Leave the default of **TCP**. |
    | Enable TCP Reset | Leave the default of unchecked. |
    | Idle timeout (minutes) | Leave the default **4**. |
    | Enable Floating IP | Leave the default of unchecked. |

2. Select **Add**.

3. Select **+ Add an inbound nat rule**.

4. In **Add inbound NAT rule**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter *lb-NAT-rule-VM2-222*. |
    | Target virtual machine | Select **lb-vm2**. |
    | Network IP configuration | Select **ipconfig1 (10.0.0.5)**. |
    | Frontend IP address | Select **lb-frontend**. |
    | Frontend Port | Enter *222*. |
    | Service Tag | Select **Custom**. |
    | Backend port | Enter *22*. |
    | Protocol | Leave the default of **TCP**. |
    | Enable TCP Reset | Leave the default of unchecked. |
    | Idle timeout (minutes) | Leave the default **4**. |
    | Enable Floating IP | Leave the default of unchecked. |

5. Select **Add**.

6. Select the blue **Review + create** button at the bottom of the page.

7. Select **Create**.

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
    | Resource group | Select **load-balancer-rg**. |
    | **Instance details** |    |
    | NAT gateway name | Enter *lb-nat-gateway*. |
    | Region | Select **East US**. |
    | Availability zone | Select **None**. |
    | Idle timeout (minutes) | Enter *15*. |

1. Select the **Outbound IP** tab or select the **Next: Outbound IP** button at the bottom of the page.

1. In **Outbound IP**, select **Create a new public IP address** next to **Public IP addresses**.

1. Enter *nat-gw-public-ip* in **Name** in **Add a public IP address**.

1. Select **OK**.

1. Select the **Subnet** tab or select the **Next: Subnet** button at the bottom of the page.

1. In **Virtual network** in the **Subnet** tab, select **lb-vnet**.

1. Select **backend-subnet** under **Subnet name**.

1. Select the blue **Review + create** button at the bottom of the page, or select the **Review + create** tab.

1. Select **Create**.

## Install web server

In this section, you'll SSH to the virtual machines through the inbound NAT rules and install a web server.

1. In the search box at the top of the portal, enter *Load balancer*. Select **Load balancers** in the search results.

1. Select **load-balancer**.

1. Select **Fronted IP configuration** in **Settings**.

1. In the **Frontend IP configuration**, make note of the **IP address** for **lb-frontend**. In this example, it's **20.99.165.176**.

    :::image type="content" source="./media/tutorial-load-balancer-port-forwarding-portal/get-public-ip.png" alt-text="Screenshot of public IP in Azure portal.":::

1. If you're using a Mac or Linux computer, open a Bash prompt. If you're using a Windows computer, open a PowerShell prompt.

1. At your prompt, open an SSH connection to **lb-vm1**. Replace the IP address with the address you retrieved in the previous step and port **221** you used for the lb-vm1 inbound NAT rule. Replace the path to the .pem with the path to where the key file was downloaded.

    ```console
    ssh -i .\Downloads\lb-key-pair.pem azureuser@20.99.165.176 -p 221
    ```

    > [!TIP]
    > The SSH key you created can be used the next time your create a VM in Azure. Just select the **Use a key stored in Azure** for **SSH public key source** the next time you create a VM. You already have the private key on your computer, so you won't need to download anything.

1. From your SSH session, update your package sources and then install the latest NGINX package.

    ```bash
    sudo apt-get -y update
    sudo apt-get -y install nginx
    ``` 

1. Enter `Exit` to leave the SSH session

1. At your prompt, open an SSH connection to **lb-vm2**. Replace the IP address with the address you retrieved in the previous step and port **222** you used for the lb-vm2 inbound NAT rule. Replace the path to the .pem with the path to where the key file was downloaded.

    ```console
    ssh -i .\Downloads\lb-key-pair.pem azureuser@20.99.165.176 -p 222
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

1. Select **load-balancer-rg** in **Resource groups**.

1. Select **Delete resource group**.

1. Enter *load-balancer-rg* in **TYPE THE RESOURCE GROUP NAME:**. Select **Delete**.

## Next steps

Advance to the next article to learn how to create a cross-region load balancer:

> [!div class="nextstepaction"]
> [Create a multiple virtual machines inbound NAT rule using the Azure portal](tutorial-nat-rule-multi-instance-portal.md)
