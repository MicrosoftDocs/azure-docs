---
title: 'Quickstart: Create a NAT gateway - Azure portal'
titlesuffix: Azure NAT Gateway
description: This quickstart shows how to create a NAT gateway by using the Azure portal.
author: asudbring
ms.author: allensu
ms.service: nat-gateway
ms.topic: quickstart 
ms.date: 02/09/2023
ms.custom: template-quickstart, FY23 content-maintenance
---

# Quickstart: Create a NAT gateway using the Azure portal

This quickstart shows you how to use the Azure NAT Gateway service. You'll create a NAT gateway to provide outbound connectivity for a virtual machine in Azure. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a NAT gateway

Before you deploy the NAT gateway resource and the other resources, a resource group is required to contain the resources deployed. In the following steps, you'll create a resource group, NAT gateway resource, and a public IP address. You can use one or more public IP address resources, public IP prefixes, or both. 

For information about public IP prefixes and a NAT gateway, see [Manage NAT gateway](./manage-nat-gateway.md?tabs=manage-nat-portal#add-or-remove-a-public-ip-prefix).

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **+ Create**. 

1. In **Create network address translation (NAT) gateway**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription.                                  |
    | Resource Group   | Select **Create new**. </br> Enter **myResourceGroupNAT**. </br> Select **OK**. |
    | **Instance details** |                                                                 |
    | NAT gateway name             | Enter **myNATgateway**                                    |
    | Region           | Select **West Europe**  |
    | Availability Zone | Select **No Zone**. |
    | TCP idle timeout (minutes) | Enter **10**. |

    For information about availability zones and NAT gateway, see [NAT gateway and availability zones](./nat-availability-zones.md).

1. Select the **Outbound IP** tab, or select the **Next: Outbound IP** button at the bottom of the page.

1. In the **Outbound IP** tab, enter or select the following information:

    | **Setting** | **Value** |
    | ----------- | --------- |
    | Public IP addresses | Select **Create a new public IP address**. </br> In **Name**, enter **myPublicIP**. </br> Select **OK**. |

1. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

1. Select **Create**.

## Virtual network

Before you deploy a virtual machine and can use your NAT gateway, you need to create the virtual network. This virtual network will contain the virtual machine created in later steps.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **+ Create**.

1. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **myResourceGroupNAT**. |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **(Europe) West Europe** |

1. Select the **Security** tab or select the **Next: Security** button at the bottom of the page.

1. Under **Azure Bastion**, select **Enable Azure Bastion**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Azure Bastion name | Enter **myBastionHost** |
    | Azure Bastion public IP address | Select **New(myVNet-publicipAddress1)** |

1. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

1. Accept the default IPv4 address space of **10.0.0.0/16**.

1. In the subnet section in **Subnet name**, select the **default** subnet, then select **Save**.

1. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Name| Enter **mySubnet** |
    | Starting address | Enter **10.0.0.0** |
    | Subnet size    | Select **/24**    |
    | **Security** |
    | NAT gateway | Select **myNATgateway**. |

1. Select **Add a subnet** and enter the following information, then select **Add**.

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet template | Select **Azure Bastion** |
    | Starting address | Enter **10.0.1.0** |
    | Subnet size    | Select **/26**    |

1. Select the **Review + create** tab or select the **Review + create** button.

1. Select **Create**.

It can take a few minutes for the deployment of the virtual network to complete. Proceed to the next steps when the deployment completes.
    
## Virtual machine

In this section, you'll create a virtual machine to test the NAT gateway and verify the public IP address of the outbound connection.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **+ Create** > **Azure virtual machine**.

1. In the **Create a virtual machine** page in the **Basics** tab, enter, or select the following information:

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

1. Select the **Disks** tab, or select the **Next: Disks** button at the bottom of the page.

1. Leave the default in the **Disks** tab.

1. Select the **Networking** tab, or select the **Next: Networking** button at the bottom of the page.

1. In the **Networking** tab, enter or select the following information:

    | **Setting** | **Value** |
    | ----------- | --------- |
    | **Network interface** |   |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **mySubnet (10.1.0.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Basic**. |
    | Public inbound ports | Select **None**. |

1. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

1. Select **Create**.

## Test NAT gateway

In this section, you'll test the NAT gateway. You'll first discover the public IP of the NAT gateway. You'll then connect to the test virtual machine and verify the outbound connection through the NAT gateway.
    
1. In the search box at the top of the portal, enter **Public IP**. Select **Public IP addresses** in the search results.

1. Select **myPublicIP**.

1. Make note of the public IP address:

    :::image type="content" source="./media/quickstart-create-nat-gateway-portal/find-public-ip.png" alt-text="Discover public IP address of NAT gateway" border="true":::

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **myVM**.

1. On the **Overview** page, select **Connect**, then **Bastion**.

1. Enter the username and password entered during VM creation. Select **Connect**.

1. Open **Microsoft Edge** on **myTestVM**.

1. Enter **https://whatsmyip.com** in the address bar.

1. Verify the IP address displayed matches the NAT gateway address you noted in the previous step:

    :::image type="content" source="./media/quickstart-create-nat-gateway-portal/my-ip.png" alt-text="Internet Explorer showing external outbound IP" border="true":::

## Clean up resources

If you're not going to continue to use this application, delete
the virtual network, virtual machine, and NAT gateway with the following steps:

1. From the left-hand menu, select **Resource groups**.

1. Select the **myResourceGroupNAT** resource group.

1. Select **Delete resource group**.

1. Enter **myResourceGroupNAT** and select **Delete**.

## Next steps

For more information on Azure NAT Gateway, see:
> [!div class="nextstepaction"]
> [Azure NAT Gateway overview](nat-overview.md)
