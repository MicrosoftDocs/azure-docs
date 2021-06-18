---
title: 'Tutorial: Create a cross-region load balancer using the Azure portal'
titleSuffix: Azure Load Balancer
description: Get started with this tutorial deploying a cross-region Azure Load Balancer with the Azure portal.
author: asudbring
ms.author: allensu
ms.service: load-balancer
ms.topic: tutorial
ms.date: 02/24/2021
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

> [!IMPORTANT]
> Cross-region Azure Load Balancer is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure subscription.
- Two **standard** sku Azure Load Balancers with backend pools deployed in two different Azure regions.
    - For information on creating a regional standard load balancer and virtual machines for backend pools, see [Quickstart: Create a public load balancer to load balance VMs using the Azure portal](quickstart-load-balancer-standard-public-portal.md).
        - Append the name of the load balancers, virtual machines, and other resources in each region with a **-R1** and **-R2**. 

## Sign in to Azure portal

[Sign in](https://portal.azure.com) to the Azure portal.

## Create cross-region load balancer

In this section, you'll create a cross-region load balancer and public IP address.

1. Select **Create a resource**. 
2. In the search box, enter **Load balancer**. Select **Load balancer** in the search results.
3. In the **Load balancer** page, select **Create**.
4. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **Create new** and enter **CreateCRLBTutorial-rg** in the text box.|
    | Name                   | Enter **myLoadBalancer-CR**                                   |
    | Region         | Select **(US) West US**.                                        |
    | Type          | Select **Public**.                                        |
    | SKU           | Leave the default of **Standard**. |
    | Tier           | Select **Global** |
    | Public IP address | Select **Create new**.|
    | Public IP address name | Type **myPublicIP-CR** in the text box.|
    | Routing preference| Select **Microsoft network**. </br> For more information on routing preference, see [What is routing preference (preview)?](../virtual-network/routing-preference-overview.md). |

    > [!NOTE]
    > Cross region load-balancer can only be deployed in the following home regions: **East US 2, West US, West Europe, Southeast Asia, Central US, North Europe, East Asia**. For more information, see **https://aka.ms/homeregionforglb**.


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

5. Under **Load balancers**, select the pull-down box under **Load balancer**.

5. Select **myLoadBalancer-R1**, or the name of your load balancer in region 1.

6. Select the pull-down box under **Frontend IP configuration**. Choose **LoadBalancerFrontEnd**.

7. Repeat steps 4-6 to add **myLoadBalancer-R2**.

8. Select **Add**.

    :::image type="content" source="./media/tutorial-cross-region-portal/add-to-backendpool.png" alt-text="Add regional load balancers to backendpool" border="true":::

## Create a load balancer rule

In this section, you'll create a load balancer rule:

* Named **myHTTPRule**.
* In the frontend named **LoadBalancerFrontEnd**.
* Listening on **Port 80**.
* Directs load balanced traffic to the backend named **myBackendPool-CR** on **Port 80**.

    > [!NOTE]
    > Frontend port must match backend port and the frontend port of the regional load balancers in the backend pool.

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
    | Idle timeout (minutes) | Move slider to **15**. |
    | TCP reset | Select **Enabled**. |

4. Leave the rest of the defaults and then select **OK**.

    :::image type="content" source="./media/tutorial-cross-region-portal/create-lb-rule.png" alt-text="Create load balancer rule" border="true":::

## Test the load balancer

In this section, you'll test the cross-region load balancer. You'll connect to the public IP address in a web browser.  You'll stop the virtual machines in one of the regional load balancer backend pools and observe the failover.

1. Find the public IP address for the load balancer on the **Overview** screen. Select **All services** in the left-hand menu, select **All resources**, and then select **myPublicIP-CR**.

2. Copy the public IP address, and then paste it into the address bar of your browser. The default page of IIS Web server is displayed on the browser.

    :::image type="content" source="./media/tutorial-cross-region-portal/test-cr-lb-1.png" alt-text="Test load balancer" border="true":::

3. Stop the virtual machines in the backend pool of one of the regional load balancers.

4. Refresh the web browser and observe the failover of the connection to the other regional load balancer.

    :::image type="content" source="./media/tutorial-cross-region-portal/test-cr-lb-2.png" alt-text="Test load balancer after failover" border="true":::

## Clean up resources

When no longer needed, delete the resource group, load balancer, and all related resources. 

To do so, select the resource group **CreateCRLBTutorial-rg** that contains the resources and then select **Delete**.

## Next steps

In this tutorial, you:

* Created a cross-region load balancer.
* Added regional load balancers to the backend pool of the cross-region load balancer.
* Created a load-balancing rule.
* Tested the load balancer.

For more information on cross-region load balancer, see:
> [!div class="nextstepaction"]
> [Cross-region load balancer (Preview)](cross-region-overview.md)
