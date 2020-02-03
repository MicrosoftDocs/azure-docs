---

title: 'Quickstart - Create a Private Link service using the Azure Portal'
titlesuffix: Azure Private Link
description: Learn how to create a Private Link service using the Azure portal in this Quickstart
services: private-link
author: malopMSFT
# Customer intent: As someone with a basic network background, but is new to Azure, I want to create an Azure private link service using the Azure Portal
ms.service: private-link
ms.topic: quickstart
ms.date: 09/16/2019
ms.author: allensu

---

# Quickstart: Create a Private Link service using the Azure Portal

Azure Private Link service is the reference to your own service that is powered by Azure Private Link. Your service that is running behind Azure Standard Load Balancer can be enabled for Private Link access so that consumers to your service can access it privately from their own VNets. In this Quickstart, you will learn how to create a private link service using Azure Portal. Later, your customers can create a private endpoint inside their VNets and map it to your service using the Alias or ResourceID. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Create a Internal load balancer

First, create a virtual network (vnet), then an internal load balancer to use with the Azure Private Link service.

### Create the virtual network

In this section, you will create a Virtual Network and the subnet to host the load balancer that is used to access your Private Link service.


1. On the upper-left side of the portal, select **Create a resource** > **Networking** > **Virtual network**.
   
1. In the **Create virtual network** pane, type or select these values:
   
   - **Name**: Type **MyVNet**.
   - **ResourceGroup**: Select **Create new**, then enter **MyResourceGroupLB**, and select **OK**. 
   - **Subnet** > **Name**: Type **MyBackendSubnet**.
   
1. Select **Create**.

   ![Create a virtual network](../load-balancer/media/tutorial-load-balancer-basic-internal-portal/2-load-balancer-virtual-network.png)

### Create a Standard load balancer

Create a standard internal load balancer by using the portal. The name and IP address you create are automatically configured as the load balancer's front end.

1. On the upper-left side of the portal, select **Create a resource** > **Networking** > **Load Balancer**.
   
2. In the **Basics** tab of the **Create load balancer** page, enter or select the following information, accept the defaults for the remaining settings, and then select **Review + create**:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **Create new** and type *MyResourceGroupLB* in the text box.|
    | Name                   | *myLoadBalancer*                                   |
    | Region         | Select **East US 2**.                                        |
    | Type          | Select **Internal**.                                        |
    | SKU           | Select **Standard**.                          |
    | Virtual network           | Select *MyVNet*.                          |    
    | IP address assignment              | Select **Static**.   |
    | Private IP address|Type an address that is in the address space of your virtual network and subnet, for example *10.3.0.7*.  |

3. In the **Review + create** tab, click **Create**. 
   

### Create Standard load balancer resources

In this section, you configure load balancer settings for a back-end address pool and a health probe, and specify load balancer rules.

### Create a Backend pool

To distribute traffic to your resources, a backend address pool contains the IP addresses of the virtual (NICs) connected to the Load Balancer. Create the backend address pool *myBackendPool* to include resources for load-balancing internet traffic.

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer** from the resources list.
2. Under **Settings**, select **Backend pools**, then select **Add**.
3. On the **Add a backend pool** page, for name, type *myBackendPool*, as the name for your backend pool, and then select **Add**.



### Create a health probe

To allow the load balancer to monitor VM status, you use a health probe. The health probe dynamically adds or removes VMs from the load balancer rotation based on their response to health checks. 

**To create a health probe to monitor the health of the resources:**

1. Select **All resources** on the left menu, and then select **MyLoadBalancer** from the resource list.
   
1. Under **Settings**, select **Health probes**, and then select **Add**.
   
1. On the **Add a health probe** page, type or select the following values:
   
   - **Name**: Type **MyHealthProbe**.
   - **Protocol**: Drop down and select **TCP**. 
   - **Port**: Type **80**. 
   - **Interval**: Type **15**. Interval is the number of seconds between probe attempts.
   - **Unhealthy threshold**: Type **2**. This value is the number of consecutive probe failures that occur before a VM is considered unhealthy.
   
1. Select **OK**.
   
   ![Add a probe](../load-balancer/media/tutorial-load-balancer-basic-internal-portal/4-load-balancer-probes.png)

### Create a load balancer rule

A load balancer rule defines how traffic is distributed to the VMs. The rule defines the front-end IP configuration for incoming traffic, the back-end IP pool to receive the traffic, and the required source and destination ports. 

The load balancer rule named **MyLoadBalancerRule** listens to port 80 in the front-end **LoadBalancerFrontEnd**. The rule sends network traffic to the back-end address pool **MyBackendPool**, also on port 80. 

**To create the load balancer rule:**

1. Select **All resources** on the left menu, and then select **MyLoadBalancer** from the resource list.
   
1. Under **Settings**, select **Load balancing rules**, and then select **Add**.
   
1. On the **Add load balancing rule** page, type or select the following values, if not already present:
   
   - **Name**: Type **MyLoadBalancerRule**.
   - **Frontend IP address:** Type **LoadBalancerFrontEnd** if not present.
   - **Protocol**: Select **TCP**.
   - **Port**: Type **80**.
   - **Backend port**: Type **80**.
   - **Backend pool**: Select **MyBackendPool**.
   - **Health probe**: Select **MyHealthProbe**. 
   
1. Select **OK**.
   
   ![Add a load balancer rule](../load-balancer/media/tutorial-load-balancer-basic-internal-portal/5-load-balancing-rules.png)

## Create a private link service

In this section, you will create a private link service behind a standard load balancer.

1. On the upper-left side of the screen in the Azure portal, select **Create a resource** > **Networking** > **Private Link Center (Preview)**. You can also search Private Link through portal search.

2. In **Private Link Center - Overview**, on the option to **"Expose your own service so others can connect"** select Start.

3. In **Create a private link service - Basics**, enter or select this information:

    | Setting           | Value                                                                        |
    |-------------------|------------------------------------------------------------------------------|
    | **Project details:**  |                                                                              |
    | Subscription      | Select your subscription                                                     |
    | Resource Group    | Select *MyResourceGroupLB*                                                     |
    | **INSTANCE DETAILS:** |                                                                              |
    | Name              | Choose a name for your service. If this name is taken, create a unique name. |
    | Region            | Select your region.                                                          |

4. Select **Next: Outbound settings**.

5. In **Create a private link service - Outbound settings**, enter or select this information:


    | Setting                           | Value                                                                           |
    |-----------------------------------|---------------------------------------------------------------------------------|
    | Load Balancer                     | Select *MyLoadBalancer*                                                           |
    | Load Balancer frontend IP address | Select the frontend IP address of MyLoadBalancer                                |
    | Source NAT Virtual network        | Select *myVNET*                                                                   |
    | Source NAT subnet                 | Select *myBackendSubnet*                                                          |
    | Enable TCP proxy v2               | Select YES/NO depending on if your application is expecting TCP proxy v2 header |
    | Private IP address settings       | Configure the allocation method and IP address for each NAT IP                  |

6. Select **Next: Access security**.

7. In **Create a private link service - Access security**, enter or select this information:

    | Setting                                     | Value                                                             |
    |---------------------------------------------|-------------------------------------------------------------------|
    | Visibility                                  | Choose the appropriate visibility option for your service         |
    | Subscription-level access and auto-approval | Add subscriptions and configure access and auto-approval settings |

8. Select **Next: Review + create**.

9. Review your information and select **Create**.

## Clean up resources 
When you're done using the private link service, delete the resource group to clean up the resources used in this quickstart:

1. Enter *myResourceGroupLB* in the **Search** box at the top of the portal and select *myResourceGroupLB* from the search results. 
2. Select **Delete resource group**. 
3. Enter myResourceGroup for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Next steps

In this quickstart, you created a VM on a virtual network, a SQL database server, and a private endpoint for private access. You connected to one VM from the internet and securely communicated to the SQL database server using Private Link. To learn more about private endpoints, see [What is Azure private endpoint?](private-endpoint-overview.md).
