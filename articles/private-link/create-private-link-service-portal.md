---
title: 'Quickstart - Create a Private Link service - Azure portal'
titleSuffix: Azure Private Link
description: Learn how to create a Private Link service using the Azure portal in this quickstart.
services: private-link
author: asudbring
ms.service: private-link
ms.topic: quickstart
ms.date: 11/17/2022
ms.author: allensu
ms.custom: mode-ui, template-quickstart
#Customer intent: As someone with a basic network background who's new to Azure, I want to create an Azure Private Link service by using the Azure portal
---

# Quickstart: Create a Private Link service by using the Azure portal

Get started creating a Private Link service that refers to your service. Give Private Link access to your service or resource deployed behind an Azure Standard Load Balancer. Users of your service have private access from their virtual network.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create an internal load balancer

In this section, you'll create a virtual network and an internal Azure Load Balancer.

### Load balancer virtual network

Create a virtual network and subnet to host the load balancer that accesses your Private Link service.

1. Sign-in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

3. Select **+ Create**. 

4. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **Create new**. Enter **CreatePrivLinkService-rg**. </br> Select **OK**. |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **East US 2** |

5. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

6. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16** |

7. Under **Subnet name**, select the word **default**.

8. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **myBackendSubnet** |
    | Subnet address range | Enter **10.1.0.0/24** |

9. Select **Save**.

10. Select the **Review + create** tab or select the **Review + create** button.

11. Select **Create**.

### Create load balancer

Create an internal load balancer that load balances virtual machines.

During the creation of the load balancer, you'll configure:

* Frontend IP address
* Backend pool
* Inbound load-balancing rules

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

1. In the **Load balancer** page, select **+ Create**.

2. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting              | Value                                |
    |----------------------|--------------------------------------|
    | **Project details**  |                                      |
    | Subscription         | Select your subscription.            |  
    | Resource group       | Select **CreatePrivLinkService-rg**. |
    | **Instance details** |                                      |
    | Name                 | Enter **myLoadBalancer**             |
    | Region               | Select **East US 2**.           |
    | SKU                  | Leave the default **Standard**.      |
    | Type                 | Select **Internal**.                 |
    | Tier                 | Select **Regional**.                 |
    
3. Select **Next: Frontend IP configuration**.

4. In **Frontend IP configuration**, select **+ Add a frontend IP configuration**.

5. Enter or select the following information in **Add frontend IP configuration**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **LoadBalancerFrontend**.|
    | Virtual network | Select **myVNet (CreatePrivLinkService-rg)**. |
    | Subnet | Select **myBackendSubnet (10.1.0.0/24)**. |
    | Assignment | Leave the default of **Dynamic**. |
    | Availability zone | Leave the default of **Zone-redundant**. |

    > [!NOTE]
    > In regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no-zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../availability-zones/az-overview.md).

6. Select **Add**.

7. Select **Next: Backend pools**.

8. In **Backend pools**, select **+ Add a backend pool**.

9. Enter **myBackendPool** for **Name**.

10. Select **NIC** or **IP Address** for **Backend Pool Configuration**.

11. Select **Save**.

12. Select **Next: Inbound rules**.

13. In **Load balancing rule**, select **+ Add a load balancing rule**.

14. In **Add load balancing rule**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHTTPRule** |
    | IP Version | Select **IPv4** or **IPv6** depending on your requirements. |
    | Frontend IP address | Select **LoadBalancerFrontend**. |
    | Backend pool | Select **myBackendPool**. |
    | Protocol | Select **TCP**. |
    | Port | Enter **80**. |
    | Backend port | Enter **80**. |
    | Health probe | Select **Create new**. </br> In **Name**, enter **myHealthProbe**. </br> Select **HTTP** in **Protocol**. </br> Leave the rest of the defaults, and select **OK**. |
    | Session persistence | Select **None**. |
    | Idle timeout (minutes) | Enter or select **15**. |
    | TCP reset | Select **Enabled**. |
    | Floating IP | Select **Disabled**. |

15. Select **Add**.

16. Select the blue **Review + create** button.

17. Select **Create**.

## Create a private link service

Create a Private Link service behind the load balancer you created in the previous section.

1. In the search box at the top of the portal, enter **Private link**. Select **Private link services** in the search results.

2. Select **+ Create**.

3. In the **Basics** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource Group | Select **CreatePrivLinkService-rg**. |
    | **Instance details** |  |
    | Name | Enter **myPrivateLinkService**. |
    | Region | Select **East US 2**. |

4. Select **Next: Outbound settings**.

5. In the **Outbound settings** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Load balancer | Select **myLoadBalancer**. |
    | Load balancer frontend IP address | Select **LoadBalancerFrontEnd (10.1.0.4)**. |
    | Source NAT subnet | Select **myVNet/myBackendSubnet (10.1.0.0/24)**. |
    | Enable TCP proxy V2 | Leave the default of **No**. </br> If your application expects a TCP proxy v2 header, select **Yes**. |
    | **Private IP address settings** |  |
    | Leave the default settings |  |

6. Select **Next: Access security**.

7. Leave the default of **Role-based access control only** in the **Access security** tab.

8. Select **Next: Tags**.

9. Select **Next: Review + create**.

10. Select **Create**.

Your private link service is created and can receive traffic. If you want to see traffic flows, configure your application behind your standard load balancer.

## Create private endpoint

In this section, you'll map the private link service to a private endpoint. A virtual network contains the private endpoint for the private link service. This virtual network contains the resources that will access your private link service.

### Create private endpoint virtual network

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

2. Select **+ Create**. 

3. In the **Basics** tab, enter or select the following information:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **CreatePrivLinkService-rg** |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNetPE**                                    |
    | Region           | Select **East US 2** |

4. Select **Next: IP Addresses** or the **IP Addresses** tab.

5. In the **IP Addresses** tab, enter the following information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16** |

6. Select **+Add subnet**.

7. In **Add subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **mySubnetPE** |
    | Subnet address range | Enter **10.1.0.0/24** |

8. Select **Add**.

9. Select **Review + create**.

10. Select **Create**.

### Create private endpoint

1. In the search box at the top of the portal, enter **Private endpoint**. Select **Private endpoints** in the search results.

2. Select **+ Create**. 

3. In the **Basics** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **CreatePrivLinkService-rg**. You created this resource group in the previous section.|
    | **Instance details** |  |
    | Name  | Enter **myPrivateEndpoint**. |
    | Network Interface Name | Leave the default of **myPrivateEndpoint-nic**. |
    | Region | Select **East US 2**. |

4. Select **Next: Resource**.
    
5. In the **Resource** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Connection method | Select **Connect to an Azure resource in my directory**. |
    | Subscription | Select your subscription. |
    | Resource type | Select **Microsoft.Network/privateLinkServices**. |
    | Resource | Select **myPrivateLinkService**. |

6. Select **Next: Virtual Network**.

7. In **Virtual Network**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Networking** |  |
    | Virtual network | Select **myVNetPE**. |
    | Subnet | Select **myVNet/mySubnetPE (10.1.0.0/24)**. |
    | Network policy for private endpoints | Select **edit** to apply Network security groups and/or Route tables to the subnet that contains the private endpoint. </br> In **Edit subnet network policy**, select the checkbox next to **Network security groups** and **Route Tables**. </br> Select **Save**. </br></br>For more information, see [Manage network policies for private endpoints](disable-private-endpoint-network-policy.md) |

# [**Dynamic IP**](#tab/dynamic-ip)

| Setting | Value |
| ------- | ----- |
| **Private IP configuration** | Select **Dynamically allocate IP address**. |

:::image type="content" source="./media/create-private-endpoint-portal/dynamic-ip-address.png" alt-text="Screenshot of dynamic IP address selection." border="true":::

# [**Static IP**](#tab/static-ip)

| Setting | Value |
| ------- | ----- |
| **Private IP configuration** | Select **Statically allocate IP address**. |
| Name | Enter **myIPconfig**. |
| Private IP | Enter **10.1.0.10**. |

:::image type="content" source="./media/create-private-endpoint-portal/static-ip-address.png" alt-text="Screenshot of static IP address selection." border="true":::

---

8. Select **Next: DNS**.

9. Select **Next: Tags**.

10. Select **Next: Review + create**.

11. Select **Create**.

### IP address of private endpoint

In this section, you'll find the IP address of the private endpoint that corresponds with the load balancer and private link service.

1. Enter **CreatePrivLinkService-rg** in the search box at the top of the portal. Select **CreatePrivLinkService-rg** in the search results in **Resource Groups**.

2. In the **CreatePrivLinkService-rg** resource group, select **myPrivateEndpoint**.

4. In the **Overview** page of **myPrivateEndpoint**, select the name of the network interface associated with the private endpoint. The network interface name begins with **myPrivateEndpoint.nic**.

5. In the **Overview** page of the private endpoint nic, the IP address of the endpoint is displayed in **Private IP address**.

## Clean up resources

When you're done using the private link service, delete the resource group to clean up the resources used in this quickstart.

1. Enter **CreatePrivLinkService-rg** in the search box at the top of the portal. Select **CreatePrivLinkService-rg** in the search results.

2. Select **Delete resource group**.

3. In **TYPE THE RESOURCE GROUP NAME**, enter **CreatePrivLinkService-rg**.

4. Select **Delete**.

## Next steps

In this quickstart, you:

* Created a virtual network and internal Azure Load Balancer.

* Created a private link service.

* Created a virtual network and a private endpoint for the private link service.

To learn more about Azure Private endpoint, continue to:
> [!div class="nextstepaction"]
> [Quickstart: Create a Private Endpoint using the Azure portal](create-private-endpoint-portal.md)
