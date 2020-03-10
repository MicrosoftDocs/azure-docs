---

title: 'Quickstart - Create a Private Link service by using the Azure portal'
titlesuffix: Azure Private Link
description: Learn how to create a Private Link service by using the Azure portal in this quickstart
services: private-link
author: malopMSFT
# Customer intent: As someone with a basic network background who's new to Azure, I want to create an Azure Private Link service by using the Azure portal
ms.service: private-link
ms.topic: quickstart
ms.date: 02/03/2020
ms.author: allensu

---

# Quickstart: Create a Private Link service by using the Azure portal

An Azure Private Link service refers to your own service that is managed by Private Link. You can give Private Link access to the service or resource that operates behind Azure Standard Load Balancer. Consumers of your service can access it privately from their own virtual networks. In this quickstart, you learn how to create a Private Link service by using the Azure portal.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to the Azure portal

Sign in to the Azure portal at https://portal.azure.com.

## Create an internal load balancer

First, create a virtual network. Next, create an internal load balancer to use with the Private Link service.

## Virtual network and parameters

In this section, you create a virtual network. You also create the subnet to host the load balancer that accesses your Private Link service.

In this section you'll need to replace the following parameters in the steps with the information below:

| Parameter                   | Value                |
|-----------------------------|----------------------|
| **\<resource-group-name>**  | myResourceGroupLB |
| **\<virtual-network-name>** | myVNet          |
| **\<region-name>**          | East US 2      |
| **\<IPv4-address-space>**   | 10.3.0.0\16          |
| **\<subnet-name>**          | myBackendSubnet        |
| **\<subnet-address-range>** | 10.3.0.0\24          |

[!INCLUDE [virtual-networks-create-new](../../includes/virtual-networks-create-new.md)]

### Create a standard load balancer

Use the portal to create a standard internal load balancer. The name and IP address you specify are automatically configured as the load balancer's front end.

1. On the upper-left side of the portal, select **Create a resource** > **Networking** > **Load Balancer**.

1. On the **Basics** tab of the **Create load balancer** page, enter or select the following information:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Subscription**               | Select your subscription.    |
    | **Resource group**         | Select **myResourceGroupLB** from the box.|
    | **Name**                   | Enter **myLoadBalancer**.                                   |
    | **Region**         | Select **East US 2**.                                        |
    | **Type**          | Select **Internal**.                                        |
    | **SKU**           | Select **Standard**.                          |
    | **Virtual network**           | Select **myVNet**.                          |
    | **IP address assignment**              | Select **Static**.   |
    | **Private IP address**|Enter an address that's in the address space of your virtual network and subnet. An example is 10.3.0.7.  |

1. Accept the defaults for the remaining settings, and then select **Review + create**

1. On the **Review + create** tab, select **Create**.

### Create standard load balancer resources

In this section, you configure load balancer settings for a back-end address pool and a health probe. You also specify load balancer rules.

#### Create a back-end pool

A back-end address pool contains the IP addresses of the virtual NICs connected to the load balancer. This pool lets you distribute traffic to your resources. Create the back-end address pool named **myBackendPool** to include resources that load balance traffic.

1. Select **All Services** from the leftmost menu.
1. Select **All resources**, and then select **myLoadBalancer** from the resources list.
1. Under **Settings**, select **Backend pools**, and then select **Add**.
1. On the **Add a backend pool** page, enter **myBackendPool** as the name for your back-end pool, and then select **Add**.

#### Create a health probe

Use a health probe to let the load balancer monitor resource status. Based on resource response to health checks, the health probe dynamically adds or removes resources from the load balancer rotation.

To create a health probe to monitor the health of the resources:

1. Select **All resources** on the leftmost menu, and then select **myLoadBalancer** from the resource list.

1. Under **Settings**, select **Health probes**, and then select **Add**.

1. On the **Add a health probe** page, enter or select the following values:

   - **Name**: Enter **myHealthProbe**.
   - **Protocol**: Select **TCP**.
   - **Port**: Enter **80**.
   - **Interval**: Enter **15**. This value is the number of seconds between probe attempts.
   - **Unhealthy threshold**: Enter **2**. This value is the number of consecutive probe failures that occur before a virtual machine is considered unhealthy.

1. Select **OK**.

#### Create a load balancer rule

A load balancer rule defines how traffic is distributed to resources. The rule defines:

- The front-end IP configuration for incoming traffic.
- The back-end IP pool to receive the traffic.
- The required source and destination ports.

The load balancer rule named **myLoadBalancerRule** listens to port 80 in the **LoadBalancerFrontEnd** front end. The rule sends network traffic to the **myBackendPool** back-end address pool on the same port 80.

To create a load balancer rule:

1. Select **All resources** on the leftmost menu, and then select **myLoadBalancer** from the resource list.

1. Under **Settings**, select **Load-balancing rules**, and then select **Add**.

1. On the **Add load-balancing rule** page, enter or select the following values if they aren't already present:

   - **Name**: Enter **myLoadBalancerRule**.
   - **Frontend IP address:** Enter **LoadBalancerFrontEnd**.
   - **Protocol**: Select **TCP**.
   - **Port**: Enter **80**.
   - **Backend port**: Enter **80**.
   - **Backend pool**: Select **myBackendPool**.
   - **Health probe**: Select **myHealthProbe**. 

1. Select **OK**.

## Create a Private Link service

In this section, you create a Private Link service behind a standard load balancer.

1. On the upper-left part of the page in the Azure portal, select **Create a resource** > **Networking** > **Private Link Center (Preview)**. You can also use the portal's search box to search for Private Link.

1. In **Private Link Center - Overview** > **Expose your own service so others can connect**, select **Start**.

1. Under **Create a private link service - Basics**, enter or select this information:

    | Setting           | Value                                                                        |
    |-------------------|------------------------------------------------------------------------------|
    | Project details:  |                                                                              |
    | **Subscription**      | Select your subscription.                                                     |
    | **Resource Group**    | Select **myResourceGroupLB**.                                                    |
    | Instance details: |                                                                              |
    | **Name**              | Enter **myPrivateLinkService**. |
    | **Region**            | Select **East US 2**.                                                        |

1. Select **Next: Outbound settings**.

1. Under **Create a private link service - Outbound settings**, enter or select this information:

    | Setting                           | Value                                                                           |
    |-----------------------------------|---------------------------------------------------------------------------------|
    | **Load Balancer**                     | Select **myLoadBalancer**.                                                           |
    | **Load Balancer frontend IP address** | Select the front-end IP address of **myLoadBalancer**.                                |
    | **Source NAT Virtual network**        | Select **myVNet**.                                                                   |
    | **Source NAT subnet**                 | Select **myBackendSubnet**.                                                          |
    | **Enable TCP proxy v2**               | Select **YES** or **NO** depending on whether your application expects a TCP proxy v2 header. |
    | **Private IP address settings**       | Configure the allocation method and IP address for each NAT IP.                  |

1. Select **Next: Access security**.

1. Under **Create a private link service - Access security**, select **Visibility**, and then choose **Role-Based access control only**.
  
1. Either select **Next: Tags** > **Review + create** or choose the **Review + create** tab at the top of the page.

1. Review your information, and select **Create**.

## Clean up resources

When you're done using the Private Link service, delete the resource group to clean up the resources used in this quickstart.

1. Enter **myResourceGroupLB** in the search box at the top of the portal, and select **myResourceGroupLB** from the search results.
1. Select **Delete resource group**.
1. In **TYPE THE RESOURCE GROUP NAME**, enter **myResourceGroup**.
1. Select **Delete**.

## Next steps

In this quickstart, you created an internal Azure load balancer and a Private Link service. You can also learn how to [create a private endpoint by using the Azure portal](https://docs.microsoft.com/azure/private-link/create-private-endpoint-portal).
