---

title: 'Quickstart - Create a Private Link service by using the Azure portal'
titlesuffix: Azure Private Link
description: Learn how to create a Private Link service by using the Azure portal in this quickstart
services: private-link
author: asudbring
# Customer intent: As someone with a basic network background who's new to Azure, I want to create an Azure Private Link service by using the Azure portal
ms.service: private-link
ms.topic: quickstart
ms.date: 01/18/2021
ms.author: allensu

---

# Quickstart: Create a Private Link service by using the Azure portal

Get started creating a Private Link by using the Azure portal to create a Private Link service that refers your service.  Give Private Link access to your service or resource deployed behind an Azure Standard Load Balancer.  Users of your service have private access from their virtual network.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to the Azure portal

Sign in to the Azure portal at https://portal.azure.com.

## Create an internal load balancer

In this section you'll create a virtual network and an internal Azure Load Balancer.

### Virtual network

In this section, you create a virtual network and subnet to host the load balancer that accesses your Private Link service.

1. On the upper-left side of the screen, select **Create a resource > Networking > Virtual network** or search for **Virtual network** in the search box.

2. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **CreatePrivLinkService-rg** |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **East US 2** |

3. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

4. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16** |

5. Under **Subnet name**, select the word **default**.

6. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **mySubnet** |
    | Subnet address range | Enter **10.1.0.0/24** |

7. Select **Save**.

8. Select the **Review + create** tab or select the **Review + create** button.

9. Select **Create**.

### Create a standard load balancer

Use the portal to create a standard internal load balancer. The name and IP address you specify are automatically configured as the load balancer's front end.

1. On the top left-hand side of the screen, select **Create a resource** > **Networking** > **Load Balancer**.

2. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **CreatePrivLinkService-rg** created in the previous step.|
    | Name                   | Enter **myLoadBalancer**                                   |
    | Region         | Select **East US 2**.                                        |
    | Type          | Select **Internal**.                                        |
    | SKU           | Select **Standard** |
    | Virtual network | Select **myVNet** created in the previous step. |
    | Subnet  | Select **mySubnet** created in the previous step. |
    | IP address assignment | Select **Dynamic**. |
    | Availability zone | Select **Zone-redundant** |

3. Accept the defaults for the remaining settings, and then select **Review + create**.

4. In the **Review + create** tab, select **Create**.   

## Create load balancer resources

In this section, you configure:

* Load balancer settings for a backend address pool.
* A health probe.
* A load balancer rule.

### Create a backend pool

A backend address pool contains the IP addresses of the virtual (NICs) connected to the load balancer. 

Create the backend address pool **myBackendPool** to include virtual machines for load-balancing internet traffic.

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer** from the resources list.

2. Under **Settings**, select **Backend pools**, then select **Add**.

3. On the **Add a backend pool** page, for name, type **myBackendPool**, as the name for your backend pool, and then select **Add**.

### Create a health probe

The load balancer monitors the status of your app with a health probe. 

The health probe adds or removes VMs from the load balancer based on their response to health checks. 

Create a health probe named **myHealthProbe** to monitor the health of the VMs.

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer** from the resources list.

2. Under **Settings**, select **Health probes**, then select **Add**.
    
    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHealthProbe**. |
    | Protocol | Select **TCP**. |
    | Port | Enter **80**.|
    | Interval | Enter **15** for number of **Interval** in seconds between probe attempts. |
    | Unhealthy threshold | Select **2** for number of **Unhealthy threshold** or consecutive probe failures that must occur before a VM is considered unhealthy.|
    | | |

3. Leave the rest the defaults and Select **OK**.

### Create a load balancer rule

A load balancer rule is used to define how traffic is distributed to the VMs. You define the frontend IP configuration for the incoming traffic and the backend IP pool to receive the traffic. The source and destination port are defined in the rule. 

In this section, you'll create a load balancer rule:

* Named **myHTTPRule**.
* In the frontend named **LoadBalancerFrontEnd**.
* Listening on **Port 80**.
* Directs load balanced traffic to the backend named **myBackendPool** on **Port 80**.

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer** from the resources list.

2. Under **Settings**, select **Load balancing rules**, then select **Add**.

3. Use these values to configure the load-balancing rule:
    
    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHTTPRule**. |
    | IP Version | Select **IPv4** |
    | Frontend IP address | Select **LoadBalancerFrontEnd** |
    | Protocol | Select **TCP**. |
    | Port | Enter **80**.|
    | Backend port | Enter **80**. |
    | Backend pool | Select **myBackendPool**.|
    | Health probe | Select **myHealthProbe**. |
    | Idle timeout (minutes) | Move the slider to **15** minutes. |
    | TCP reset | Select **Enabled**. |

4. Leave the rest of the defaults and then select **OK**.

## Create a Private Link service

In this section, you will create a Private Link service behind a standard load balancer.

1. On the upper-left part of the page in the Azure portal, select **Create a resource**.

2. Search for **Private Link** in the **Search the Marketplace** box.

3. Select **Create**.

4. In **Overview** under **Private Link Center**, select the blue **Create private link service** button.

5. In the **Basics** tab under **Create private link service**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource Group | Select **CreatePrivLinkService-rg**. |
    | **Instance details** |  |
    | Name | Enter **myPrivateLinkService**. |
    | Region | Select **East US 2**. |

6. Select the **Outbound settings** tab or select **Next: Outbound settings** at the bottom of the page.

7. In the **Outbound settings** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Load balancer | Select **myLoadBalancer**. |
    | Load balancer frontend IP address | Select **LoadBalancerFrontEnd (10.1.0.4)**. |
    | Source NAT subnet | Select **mySubnet (10.1.0.0/24)**. |
    | Enable TCP proxy V2 | Leave the default of **No**. </br> If your application expects a TCP proxy v2 header, select **Yes**. |
    | **Private IP address settings** |  |
    | Leave the default settings |  |

8. Select the **Access security** tab or select **Next: Access security** at the bottom of the page.

9. Leave the default of **Role-based access control only** in the **Access security** tab.

10. Select the **Tags** tab or select **Next: Tags** at the bottom of the page.

11. Select the **Review + create** tab or select **Next: Review + create** at the bottom of the page.

12. Select **Create** in the **Review + create** tab.

## Clean up resources

When you are done using the Private Link service, delete the resource group to clean up the resources used in this quickstart.

1. Enter **CreatePrivLinkService-rg** in the search box at the top of the portal, and select **CreatePrivLinkService-rg** from the search results.
1. Select **Delete resource group**.
1. In **TYPE THE RESOURCE GROUP NAME**, enter **CreatePrivLinkService-rg**.
1. Select **Delete**.

## Next steps

In this quickstart you:

* Created a virtual network and internal Azure Load Balancer.
* Created a private link service

To learn more about Azure Private endpoint, continue to:
> [!div class="nextstepaction"]
> [Quickstart: Create a Private Endpoint using the Azure portal](create-private-endpoint-portal.md)