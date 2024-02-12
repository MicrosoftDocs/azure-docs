---
title: 'Quickstart - Create a Private Link service - Azure portal'
titleSuffix: Azure Private Link
description: Learn how to create a Private Link service using the Azure portal in this quickstart.
services: private-link
author: asudbring
ms.service: private-link
ms.topic: quickstart
ms.date: 08/29/2023
ms.author: allensu
ms.custom: mode-ui, template-quickstart
#Customer intent: As someone with a basic network background who's new to Azure, I want to create an Azure Private Link service by using the Azure portal
---

# Quickstart: Create a Private Link service by using the Azure portal

Get started creating a Private Link service that refers to your service. Give Private Link access to your service or resource deployed behind an Azure Standard Load Balancer. Users of your service have private access from their virtual network.

:::image type="content" source="./media/create-private-link-service-portal/private-link-service-qs-resources.png" alt-text="Diagram of resources created in private endpoint quickstart.":::

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## <a name="create-a-virtual-network"></a> Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

[!INCLUDE [virtual-network-create.md](../../includes/virtual-network-create.md)]

### Create load balancer

Create an internal load balancer that load balances virtual machines.

During the creation of the load balancer, you configure:

* Frontend IP address

* Backend pool

* Inbound load-balancing rules

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

1. In the **Load balancer** page, select **+ Create**.

1. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting              | Value                                |
    |----------------------|--------------------------------------|
    | **Project details**  |                                      |
    | Subscription         | Select your subscription.            |  
    | Resource group       | Select **test-rg**. |
    | **Instance details** |                                      |
    | Name                 | Enter **load-balancer**             |
    | Region               | Select **East US 2**.           |
    | SKU                  | Leave the default **Standard**.      |
    | Type                 | Select **Internal**.                 |
    | Tier                 | Select **Regional**.                 |
    
1. Select **Next: Frontend IP configuration**.

1. In **Frontend IP configuration**, select **+ Add a frontend IP configuration**.

1. Enter or select the following information in **Add frontend IP configuration**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **frontend**.|
    | Virtual network | Select **vnet-1 (test-rg)**. |
    | Subnet | Select **subnet-1 (10.0.0.0/24)**. |
    | Assignment | Leave the default of **Dynamic**. |
    | Availability zone | Leave the default of **Zone-redundant**. |

    > [!NOTE]
    > In regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no-zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../availability-zones/az-overview.md).

1. Select **Add**.

1. Select **Next: Backend pools**.

1. In **Backend pools**, select **+ Add a backend pool**.

1. Enter **backend-pool** for **Name**.

1. Select **NIC** or **IP Address** for **Backend Pool Configuration**.

1. Select **Save**.

1. Select **Next: Inbound rules**.

1. In **Load balancing rule**, select **+ Add a load balancing rule**.

1. In **Add load balancing rule**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **http-rule** |
    | IP Version | Select **IPv4** or **IPv6** depending on your requirements. |
    | Frontend IP address | Select **frontend**. |
    | Backend pool | Select **backend-pool**. |
    | Protocol | Select **TCP**. |
    | Port | Enter **80**. |
    | Backend port | Enter **80**. |
    | Health probe | Select **Create new**. </br> In **Name**, enter **health-probe**. </br> Select **HTTP** in **Protocol**. </br> Leave the rest of the defaults, and select **Save**. |
    | Session persistence | Select **None**. |
    | Idle timeout (minutes) | Enter or select **15**. |
    | Enable TCP Reset | Select the box. |
    | Enable Floating IP | Leave the box unchecked. |

1. Select **Save**.

1. Select the blue **Review + create** button.

1. Select **Create**.

## Create a private link service

Create a Private Link service behind the load balancer you created in the previous section.

1. In the search box at the top of the portal, enter **Private link**. Select **Private link services** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource Group | Select **test-rg**. |
    | **Instance details** |  |
    | Name | Enter **private-link-service**. |
    | Region | Select **East US 2**. |

1. Select **Next: Outbound settings**.

1. In the **Outbound settings** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Load balancer | Select **load-balancer**. |
    | Load balancer frontend IP address | Select **frontend (10.0.0.4)**. |
    | Source NAT subnet | Select **vnet-1/subnet-1 (10.0.0.0/24)**. |
    | Enable TCP proxy V2 | Leave the default of **No**. </br> If your application expects a TCP proxy v2 header, select **Yes**. |
    | **Private IP address settings** |  |
    | Leave the default settings |  |

1. Select **Next: Access security**.

1. Leave the default of **Role-based access control only** in the **Access security** tab.

1. Select **Next: Tags**.

1. Select **Next: Review + create**.

1. Select **Create**.

Your private link service is created and can receive traffic. If you want to see traffic flows, configure your application behind your standard load balancer.

## Create private endpoint

In this section, you map the private link service to a private endpoint. A virtual network contains the private endpoint for the private link service. This virtual network contains the resources that access your private link service.

### Create private endpoint virtual network

Repeat steps in [Create a virtual network](#create-a-virtual-network) to create a virtual network with the following settings:

| Setting | Value |
| ------- | ----- |
| Name | **vnet-pe** |
| Location | **East US 2** |
| Address space | **10.1.0.0/16** |
| Subnet name | **subnet-pe** |
| Subnet address range | **10.1.0.0/24** |

### Create private endpoint

1. In the search box at the top of the portal, enter **Private endpoint**. Select **Private endpoints** in the search results.

1. Select **+ Create**. 

1. In the **Basics** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. You created this resource group in the previous section.|
    | **Instance details** |  |
    | Name  | Enter **private-endpoint**. |
    | Network Interface Name | Leave the default of **private-endpoint-nic**. |
    | Region | Select **East US 2**. |

1. Select **Next: Resource**.
    
1. In the **Resource** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Connection method | Select **Connect to an Azure resource in my directory**. |
    | Subscription | Select your subscription. |
    | Resource type | Select **Microsoft.Network/privateLinkServices**. |
    | Resource | Select **private-link-service**. |

1. Select **Next: Virtual Network**.

1. In **Virtual Network**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Networking** |  |
    | Virtual network | Select **vnet-pe (test-rg)**. |
    | Subnet | Select **subnet-pe**. |
    | Network policy for private endpoints | Select **edit** to apply Network policy for private endpoints. </br> In **Edit subnet network policy**, in **Network policies setting for all private endpoints in this subnet**, select **Network security groups** and **Route Tables**. </br> Select **Save**. </br></br>For more information, see [Manage network policies for private endpoints](disable-private-endpoint-network-policy.md) |

    # [**Dynamic IP**](#tab/dynamic-ip)

    | Setting | Value |
    | ------- | ----- |
    | **Private IP configuration** | Select **Dynamically allocate IP address**. |

    :::image type="content" source="./media/create-private-endpoint-portal/dynamic-ip-address.png" alt-text="Screenshot of dynamic IP address selection." border="true":::

    # [**Static IP**](#tab/static-ip)

    | Setting | Value |
    | ------- | ----- |
    | **Private IP configuration** | Select **Statically allocate IP address**. |
    | Name | Enter **ipconfig-1**. |
    | Private IP | Enter **10.1.0.10**. |

    :::image type="content" source="./media/create-private-endpoint-portal/static-ip-address.png" alt-text="Screenshot of static IP address selection." border="true":::

    ---

1. Select **Next: DNS**.

1. Select **Next: Tags**.

1. Select **Next: Review + create**.

1. Select **Create**.

### IP address of private endpoint

In this section, you find the IP address of the private endpoint that corresponds with the load balancer and private link service. The following steps are only necessary if you selected **Dynamically allocate IP address** in the previous section.

1. Enter **test-rg** in the search box at the top of the portal. Select **test-rg** in the search results in **Resource Groups**.

1. In the **test-rg** resource group, select **private-endpoint**.

1. In the **Overview** page of **private-endpoint**, select the name of the network interface associated with the private endpoint. The network interface name begins with **private-endpoint.nic**.

1. In the **Overview** page of the private endpoint nic, the IP address of the endpoint is displayed in **Private IP address**.

[!INCLUDE [portal-clean-up.md](../../includes/portal-clean-up.md)]

## Next steps

In this quickstart, you:

* Created a virtual network and internal Azure Load Balancer.

* Created a private link service.

* Created a virtual network and a private endpoint for the private link service.

To learn more about Azure Private endpoint, continue to:
> [!div class="nextstepaction"]
> [Quickstart: Create a Private Endpoint using the Azure portal](create-private-endpoint-portal.md)
