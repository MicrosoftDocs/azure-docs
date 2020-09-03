---
title: 'Tutorial: Create cross-region load balancer using the Azure portal'
description: Get started with this tutorial creating a cross region load balancer with the Azure portal.
author: asudbring
ms.author: allensu
ms.service: load-balancer
ms.topic: tutorial
ms.date: 09/01/2020
#Customer intent: As a administrator, I want to load balance virtual machines cross-region so that my application is highly available in multiple Azure regions.
---

# Tutorial: Create cross-region load balancer using the Azure portal.

Get started creating a cross-region load balancer using Azure PowerShell. This article shows you how to create a cross-region load balancer associated with two regional load balancers.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create the cross-region load balancer.
> * Add regional load balancers to cross-region load balancer.
> * Test load balancer failover between regions

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure account with an active subscription.
- Azure PowerShell module installed locally or use the Azure Cloud Shell.
- Two standard load balancer deployments in two regions: 
    - Virtual machines in each region associated with the regional load balancers.
    - IIS installed and the default web page changed to hostname.
    - You can use names of your choosing or hyphenate the names in the load balancer quickstart with **-R1** and **-R2** respectively.
    - See [Quickstart: Create a public load balancer to load balance VMs using the Azure portal](/quickstart-load-balancer-standard-public-portal.md) to create the regional load balancers and install IIS.

## Sign in to the Azure portal

1. [Sign](https://portal.azure.com) in to the Azure portal.

## Create cross-region load balancer

1. In the left-hand menu, select **Create a resource**.

2. Select **Networking** > **Load Balancer**.

3. In the **Basics** tab of **Create load balancer**, enter, or select this information:

| Setting                | Value                                                                |
|------------------------|----------------------------------------------------------------------|
| **Project details**    |                                                                      |
| Subscription           | Select your subscription.                                            |
| Resource group         | Select **Create new**. </br> Enter **myResourceGroupLB-CR** in name. |
| **Instance details**   |                                                                      |
| Name                   | Enter **myLoadBalancer-CR**.                                         |
| Region                 | Select **(US) East US**                                              |
| Type                   | Select **Public**.                                                   |
| SKU                    | Select **Standard**.                                                 |
| Tier                   | Select **Global**.                                                   |
| **Public IP address**  |                                                                      |
| Public IP address      | Select **Create new**.                                               |
| Public IP address name | Enter **myPublicIP-CR**.                                             |

4. Select **Review + create**.

5. Select **Create**.

:::image type="content" source="media/create-cross-region-portal/create-cross-region-portal.png" alt-text="Create the cross-region load balancer portal" border="true":::

## Create backend pool

1. In the Azure portal, in the left-hand menu select **All Resources**.

2. Select **myLoadBalancer-CR** in the list of resources.

3. In the load balancer page, select **Backend pools** under **Settings**.

4. Select **+ Add**.

5. In **Add backend pool** enter or select this information:

| Setting                 | Value                                                                                                                             |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| Name                    | Enter **myBackendPool-CR**.                                                                                                       |
| Regional load balancers | Select **+ Add**. </br> Select the check boxes next to both regional load balancers you previously created. </br> Select **OK**. |

## Test cross-region load balancer

1. In the Azure portal, in the left-hand menu select **All Resources**.

2. Select **myLoadBalancer-CR** in the list of resources.

3. In the load balancer **Overview**, write down or copy the IP address next to **Public IP address**.

4. Open a web browser and enter or paste the IP address from the previous step.

5. One of the pages from either a virtual machine in region 1 or region 2.

6. Shut down the virtual machines in region 1 or region 2.

7. Verify that the page from a virtual machine from the region with active virtual machines is valid.


## Clean up resources

If you're not going to continue to use this application, delete
the cross-region load balancer with the following steps:

1. In the Azure portal, in the left-hand menu select **Resource groups**.

2. Select **myResourceGroup-CR** in the list of resources.

4. Select **Delete** to delete the resource group and the resources it contains.

## Next steps

Advance to the next article to learn how to create an egress only load balancer.
> [!div class="nextstepaction"]
> [Outbound-only load balancer configuration](egress-only.md)
