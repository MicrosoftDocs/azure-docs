---
title: 'Tutorial: Protect your NAT gateway with Azure DDoS Protection Standard'
titlesuffix: Azure NAT Gateway
description: Learn how to create an NAT gateway in an Azure DDoS Protection Standard protected virtual network.
author: asudbring
ms.author: allensu
ms.service: nat-gateway
ms.topic: tutorial 
ms.date: 01/24/2022
---

# Tutorial: Protect your NAT gateway with Azure DDoS Protection Standard

This article helps you create a NAT gateway with a DDoS protected virtual network. Azure DDoS Protection Standard enables enhanced DDoS mitigation capabilities such as adaptive tuning, attack alert notifications, and monitoring to protect your NAT gateway from large scale DDoS attacks.

> [!IMPORTANT]
> Azure DDoS Protection incurs a cost when you use the Standard SKU. Overages charges only apply if more than 100 public IPs are protected in the tenant. Ensure you delete the resources in this tutorial if you aren't using the resources in the future. For information about pricing, see [Azure DDoS Protection Pricing]( https://azure.microsoft.com/pricing/details/ddos-protection/). For more information about Azure DDoS protection, see [What is Azure DDoS Protection?](../ddos-protection/ddos-protection-overview.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a NAT gateway
> * Create a DDoS protection plan
> * Create a virtual network and associate the DDoS protection plan
> * Create a test virtual machine
> * Test the NAT gateway

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a NAT gateway

Before you deploy the NAT gateway resource and the other resources, a resource group is required to contain the resources deployed. In the following steps, you'll create a resource group, NAT gateway resource, and a public IP address. You can use one or more public IP address resources, public IP prefixes, or both. 

For information about public IP prefixes and a NAT gateway, see [Manage NAT gateway](./manage-nat-gateway.md?tabs=manage-nat-portal#add-or-remove-a-public-ip-prefix).

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

3. Select **+ Create**. 

4. In **Create network address translation (NAT) gateway**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription.                                  |
    | Resource Group   | Select **Create new**. </br> Enter **myResourceGroupNAT**. </br> Select **OK**. |
    | **Instance details** |                                                                 |
    | NAT gateway name             | Enter **myNATgateway**                                    |
    | Region           | Select **West Europe**  |
    | Availability Zone | Select **No Zone**. |
    | Idle timeout (minutes) | Enter **10**. |

    For information about availability zones and NAT gateway, see [NAT gateway and availability zones](./nat-availability-zones.md).

5. Select the **Outbound IP** tab, or select the **Next: Outbound IP** button at the bottom of the page.

6. In the **Outbound IP** tab, enter or select the following information:

    | **Setting** | **Value** |
    | ----------- | --------- |
    | Public IP addresses | Select **Create a new public IP address**. </br> In **Name**, enter **myPublicIP**. </br> Select **OK**. |

7. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

8. Select **Create**.

## Create a DDoS protection plan

1. In the search box at the top of the portal, enter **DDoS protection**. Select **DDoS protection plans** in the search results and then select **+ Create**.

1. In the **Basics** tab of **Create a DDoS protection plan** page, enter or select the following information:

    | Setting | Value |
    |--|--|
    | **Project details** |   |
    | Subscription | Select your Azure subscription. |
    | Resource group | Enter **myResourceGroupNAT**. |
    | **Instance details** |   |
    | Name | Enter **myDDoSProtectionPlan**. |
    | Region | Select **West Europe**. |

1. Select **Review + create** and then select **Create** to deploy the DDoS protection plan.

## Create a virtual network

Before you deploy a virtual machine and can use your NAT gateway, you need to create the virtual network. This virtual network will contain the virtual machine created in later steps.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

2. Select **Create**.

3. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **myResourceGroupNAT**. |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **(Europe) West Europe** |

4. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

5. Accept the default IPv4 address space of **10.1.0.0/16**.

6. In the subnet section in **Subnet name**, select the **default** subnet.

7. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **mySubnet** |
    | Subnet address range | Enter **10.1.0.0/24** |
    | **NAT GATEWAY** |
    | NAT gateway | Select **myNATgateway**. |

8. Select **Save**.

9. Select the **Security** tab.

10. In **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost** |
    | AzureBastionSubnet address space | Enter **10.1.1.0/26** |
    | Public IP Address | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |

11. In **DDoS protection** select **Enable**. Select **myDDoSProtectionPlan** in DDoS protection plan.

12. Select the **Review + create** tab or select the **Review + create** button.

13. Select **Create**.

It can take a few minutes for the deployment of the virtual network to complete. Proceed to the next steps when the deployment completes.
    
## Create test virtual machine

In this section, you'll create a virtual machine to test the NAT gateway and verify the public IP address of the outbound connection.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **+ Create** > **Azure virtual machine**.

2. In the **Create a virtual machine** page in the **Basics** tab, enter, or select the following information:

    | **Setting** | **Value** |
    | ----------- | --------- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroupNAT**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **myVM**. |
    | Region | Select **(Europe) West Europe**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter: Azure Edition - Gen2**. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Username | Enter a username for the virtual machine. |
    | Password | Enter a password. |
    | Confirm password | Confirm password. |
    | **Inbound port rules** |    |
    | Public inbound ports | Select **None**. |

3. Select the **Disks** tab, or select the **Next: Disks** button at the bottom of the page.

4. Leave the default in the **Disks** tab.

5. Select the **Networking** tab, or select the **Next: Networking** button at the bottom of the page.

6. In the **Networking** tab, enter or select the following information:

    | **Setting** | **Value** |
    | ----------- | --------- |
    | **Network interface** |   |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **mySubnet (10.1.0.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Basic**. |
    | Public inbound ports | Select **None**. |

7. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

8. Select **Create**.

## Test NAT gateway

In this section, you'll test the NAT gateway. You'll first discover the public IP of the NAT gateway. You'll then connect to the test virtual machine and verify the outbound connection through the NAT gateway.
    
1. In the search box at the top of the portal, enter **Public IP**. Select **Public IP addresses** in the search results.

2. Select **myPublicIP**.

3. Make note of the public IP address:

    :::image type="content" source="./media/quickstart-create-nat-gateway-portal/find-public-ip.png" alt-text="Screenshot of discover public IP address of NAT gateway." border="true":::

4. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

5. Select **myVM**.

4. On the **Overview** page, select **Connect**, then **Bastion**.

6. Enter the username and password entered during VM creation. Select **Connect**.

7. Open **Microsoft Edge** on **myTestVM**.

8. Enter **https://whatsmyip.com** in the address bar.

9. Verify the IP address displayed matches the NAT gateway address you noted in the previous step:

    :::image type="content" source="./media/quickstart-create-nat-gateway-portal/my-ip.png" alt-text="Screenshot of Internet Explorer showing external outbound IP." border="true":::

## Clean up resources

If you're not going to continue to use this application, delete
the virtual network, virtual machine, and NAT gateway with the following steps:

1. From the left-hand menu, select **Resource groups**.

2. Select the **myResourceGroupNAT** resource group.

3. Select **Delete resource group**.

4. Enter **myResourceGroupNAT** and select **Delete**.

## Next steps

For more information on Azure NAT Gateway, see:
> [!div class="nextstepaction"]
> [Azure NAT Gateway overview](nat-overview.md)
