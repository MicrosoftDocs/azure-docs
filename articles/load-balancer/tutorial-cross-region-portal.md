---
title: 'Tutorial: Create a cross-region load balancer using the Azure portal'
titleSuffix: Azure Load Balancer
description: Get started with this tutorial deploying a cross-region Azure Load Balancer with the Azure portal.
author: asudbring
ms.author: allensu
ms.service: load-balancer
ms.topic: tutorial
ms.date: 11/16/2020
#Customer intent: As a administrator, I want to deploy a cross-region load balancer for global high availability of my application or service.
---

# Tutorial: Create a cross-region Azure Load Balancer using the Azure portal

A cross-region load balancer ensures a service is available globally across multiple Azure regions. If one region fails, the traffic is routed to the next closest healthy regional load balancer.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create cross-region load balancer.
> * Create a backend pool containing two regional load balancers.
> * Create a load balancer rule.
> * Test the load balancer.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure subscription.
- Two **standard** sku Azure Load Balancers with backend pools deployed in two different Azure regions.
    - For information on creating a regional standard load balancer and virtual machines for backend pools, see [Quickstart: Create a public load balancer to load balance VMs using the Azure portal](quickstart-load-balancer-standard-public-portal.md).
        - Append the name of the load balancers, virtual machines, and other resources in each region with a **-R1** and **-R2**. 

## Sign in to Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

## Create cross-region load balancer

In this section, you'll create a cross-region load balancer and public IP address.

1. On the top left-hand side of the screen, select **Create a resource > Networking > Load Balancer**, or search for **Load Balancer** in the search box.

2. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **Create new** and enter **CreateCRLBTutorial-rg** in the text box.|
    | Name                   | Enter **myLoadBalancer-CR**                                   |
    | Region         | Select **West US**.                                        |
    | Type          | Select **Public**.                                        |
    | SKU           | Select **Standard** |
    | Tier           | Select **Global** |
    | Public IP address | Select **Create new**.|
    | Public IP address name | Type **myPublicIP-CR** in the text box.|
    | Routing preference| Select **Microsoft network** |

3. Accept the defaults for the remaining settings, and then select **Review + create**.

4. In the **Review + create** tab, select **Create**.   

    :::image type="content" source="./media/tutorial-cross-region-portal/create-cross-region.png" alt-text="Create a cross-region load balancer" border="true":::

## Create backend pool

In this section, you'll add two regional standard load balancers to the backend pool of the cross-region load balancer.

> [!IMPORTANT]
> To complete these steps, ensure that two regional load balancers with backend pools have been deployed in your subscription.  For more information, see, **[Quickstart: Create a public load balancer to load balance VMs using the Azure portal](quickstart-load-balancer-standard-public-portal.md)**.

Create the backend address pool **myBackendPool-CR** to include the regional standard load balancers.

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer-CR** from the resources list.

2. Under **Settings**, select **Backend pools**, then select **Add**.

3. On the **Add a backend pool** page, for name, type **myBackendPool-CR**.

4. Select **Add**.

4. Select **myBackendPool-CR**.

5. Under **Load balancers**, select the pull down box under **Load balancer**.

5. Select **myLoadBalancer-R1**, or the name of your load balancer in region 1.

6. Select the pull down box under **Frontend IP configuration**. Choose **LoadBalancerFrontEnd**.

7. Repeat steps 4-6 to add **myLoadBalancer-R2**.

8. Select **Save**.

    :::image type="content" source="./media/tutorial-cross-region-portal/add-to-backendpool.png" alt-text="Add regional load balancers to backendpool" border="true":::

## Create a load balancer rule

In this section, you'll create a load balancer rule:

* Named **myHTTPRule**.
* In the frontend named **LoadBalancerFrontEnd**.
* Listening on **Port 80**.
* Directs load balanced traffic to the backend named **myBackendPool-CR** on **Port 80**.

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer-CR** from the resources list.

2. Under **Settings**, select **Load-balancing rules**, then select **Add**.

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
    | Create implicit outbound rules | Select **No**.

4. Leave the rest of the defaults and then select **OK**.

**FINISH INSTRUCTIONS HERE WHEN PORTAL DONE**

## Test the load balancer

In this section, you'll test the cross-region load balancer. You'll connect to the public IP address in a web browser.  You'll stop the virtual machines in one of the regional load balancer backend pools and observe the failover.

1. Find the public IP address for the load balancer on the **Overview** screen. Select **All services** in the left-hand menu, select **All resources**, and then select **myPublicIP-CR**.

2. Copy the public IP address, and then paste it into the address bar of your browser. The default page of IIS Web server is displayed on the browser.

3. Stop the virtual machines in the backend pool of one of the regional load balancers.

4. Refresh the web browser and observe the failover of the connection to the other regional load balancer.

## Clean up resources

When no longer needed, delete the resource group, load Balancer, and all related resources. To do so, select the resource group **CreateCRLBTutorial-rg** that contains the resources and then select **Delete**.

## Next steps

In this tutorial, you:

* Created a cross-region load balancer.
* Added regional load balancers to the backend pool of the cross-region load balancer.
* Created a load-balancing rule.
* Tested the load balancer.


Advance to the next article to learn how to...
> [!div class="nextstepaction"]
> [Load balancer VMs across availability zones](tutorial-load-balancer-standard-public-zone-redundant-portal.md)
