---
title: 'Tutorial: Create a gateway load balancer - Azure portal'
titleSuffix: Azure Load Balancer
description: Use this tutorial to learn how to create a gateway load balancer using the Azure portal.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: tutorial
ms.date: 06/27/2023
ms.custom: template-tutorial, ignite-fall-2021, engagement-fy23
---

# Tutorial: Create a gateway load balancer using the Azure portal

Azure Load Balancer consists of Standard, Basic, and Gateway SKUs. Gateway Load Balancer is used for transparent insertion of Network Virtual Appliances (NVA). Use Gateway Load Balancer for scenarios that require high performance and high scalability of NVAs.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create virtual network.
> * Create network security group.
> * Create a gateway load balancer.
> * Chain a load balancer frontend to gateway load balancer.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An existing public standard SKU Azure Load Balancer. For more information on creating a load balancer, see **[Create a public load balancer using the Azure portal](quickstart-load-balancer-standard-public-portal.md)**.
    - For the purposes of this tutorial, the load balancer in the examples is named **myLoadBalancer**.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create virtual network

A virtual network is needed for the resources that are in the backend pool of the gateway load balancer. 

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual Networks** in the search results.

2. In **Virtual networks**, select **+ Create**.

3. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **Create new**. </br> In **Name** enter **TutorGwLB-rg**. </br> Select **OK**. |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **East US** |

4. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

5. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16** |

6. Under **Subnet name**, select the word **default**.

7. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **myBackendSubnet** |
    | Subnet address range | Enter **10.1.0.0/24** |

8. Select **Save**.

9. Select the **Security** tab.

10. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost** |
    | AzureBastionSubnet address space | Enter **10.1.1.0/26** |
    | Public IP Address | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |


11. Select the **Review + create** tab or select the **Review + create** button.

12. Select **Create**.

> [!IMPORTANT]

> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

>

## Create NSG

Use the following example to create a network security group. You'll configure the NSG rules needed for network traffic in the virtual network created previously.

1. In the search box at the top of the portal, enter **Network Security**. Select **Network security groups** in the search results.

2. Select **+ Create**.

3. In the **Basics** tab of **Create network security group**, enter, or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorGwLB-rg** |
    | **Instance details** |   |
    | Name | Enter **myNSG**. |
    | Region | Select **East US**. |

4. Select the **Review + create** tab or select the **Review + create** button.

5. Select **Create**.

6. In the search box at the top of the portal, enter **Network Security**. Select **Network security groups** in the search results.

7. Select **myNSG**.

8. Select **Inbound security rules** in **Settings** in **myNSG**.

9. Select **+ Add**.

10. In **Add inbound security rule**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Source | Leave the default of **Any**. |
    | Source port ranges | Leave the default of **'*'**. |
    | Destination | Leave the default of **Any**. |
    | Service | Leave the default of **Custom**. |
    | Destination port ranges | Enter **'*'**. |
    | Protocol | Select **Any**. |
    | Action | Leave the default of **Allow**. |
    | Priority | Enter **100**. | 
    | Name | Enter **myNSGRule-AllowAll-All** |

11. Select **Add**.

12. Select **Outbound security rules** in **Settings**.

13. Select **+ Add**.

14. In **Add outbound security rule**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Source | Leave the default of **Any**. |
    | Source port ranges | Leave the default of **'*'**. |
    | Destination | Leave the default of **Any**. |
    | Service | Leave the default of **Custom**. |
    | Destination port ranges | Enter **'*'**. |
    | Protocol | Select **TCP**. |
    | Action | Leave the default of **Allow**. |
    | Priority | Enter **100**. | 
    | Name | Enter **myNSGRule-AllowAll-TCP-Out** |

15. Select **Add**.

Select this NSG when creating the NVAs for your deployment.

## Create Gateway Load Balancer

In this section, you'll create the configuration and deploy the gateway load balancer. 

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

2. In the **Load balancer** page, select **Create**.

3. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **TutorGwLB-rg**. |
    | **Instance details** |   |
    | Name                   | Enter **myLoadBalancer-gw**                                   |
    | Region         | Select **(US) East US**.                                        |
    | Type          | Select **Internal**.                                        |
    | SKU           | Select **Gateway**. |

    :::image type="content" source="./media/tutorial-gateway-portal/create-load-balancer.png" alt-text="Screenshot of create standard load balancer basics tab." border="true":::

4. Select **Next: Frontend IP configuration** at the bottom of the page.

5. In **Frontend IP configuration**, select **+ Add a frontend IP**.

6. Enter **MyFrontEnd** in **Name**.

7. Select **myBackendSubnet** in **Subnet**.

8. Select **Dynamic** for **Assignment**.

9. Select **Add**.

10. Select **Next: Backend pools** at the bottom of the page.

11. In the **Backend pools** tab, select **+ Add a backend pool**.

12. In **Add backend pool**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myBackendPool**. |
    | Backend Pool Configuration | Select **NIC**. |
    | IP Version | Select **IPv4**. |
    | **Gateway load balancer configuration** |   |
    | Type | Select **Internal and External**. |
    | Internal port | Leave the default of **10800**. |
    | Internal identifier | Leave the default of **800**. |
    | External port | Leave the default of **10801**. |
    | External identifier | Leave the default of **801**. |

13. Select **Add**.

14. Select the **Next: Inbound rules** button at the bottom of the page.

15. In **Load balancing rule** in the **Inbound rules** tab, select **+ Add a load balancing rule**.

16. In **Add load balancing rule**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myLBRule** |
    | IP Version | Select **IPv4** or **IPv6** depending on your requirements. |
    | Frontend IP address | Select **MyFrontend**. |
    | Backend pool | Select **myBackendPool**. |
    | Health probe | Select **Create new**. </br> In **Name**, enter **myHealthProbe**. </br> Select **TCP** in **Protocol**. </br> Leave the rest of the defaults, and select **OK**. |
    | Session persistence | Select **None**. |

    :::image type="content" source="./media/tutorial-gateway-portal/add-load-balancing-rule.png" alt-text="Screenshot of create load-balancing rule." border="true":::

17. Select **Add**.

18. Select the blue **Review + create** button at the bottom of the page.

19. Select **Create**.

## Add network virtual appliances to the gateway load balancer backend pool

Deploy NVAs through the Azure Marketplace. Once deployed, add the NVA virtual machines to the backend pool of the gateway load balancer. To add the virtual machines, go to the backend pools tab of your gateway load balancer.

## Chain load balancer frontend to the gateway load balancer

In this example, you'll chain the frontend of a standard load balancer to the gateway load balancer. 

You'll add the frontend to the frontend IP of an existing load balancer in your subscription.

1. In the search box in the Azure portal, enter **Load balancer**. In the search results, select **Load balancers**.

2. In **Load balancers**, select **myLoadBalancer** or your existing load balancer name.

3. In the load balancer page, select **Frontend IP configuration** in **Settings**.

4. Select the frontend IP of the load balancer. In this example, the name of the frontend is **myFrontendIP**.

    :::image type="content" source="./media/tutorial-gateway-portal/frontend-ip.png" alt-text="Screenshot of frontend IP configuration." border="true":::

5. Select **myFrontendIP (10.1.0.4)** in the pull-down box next to **Gateway load balancer**.

6. Select **Save**.

    :::image type="content" source="./media/tutorial-gateway-portal/select-gateway-load-balancer.png" alt-text="Screenshot of addition of gateway load balancer to frontend IP." border="true":::

## Chain virtual machine to Gateway Load Balancer

Alternatively, you can chain a VM's NIC IP configuration to the gateway load balancer.

You'll add the gateway load balancer's frontend to an existing VM's NIC IP configuration.

> [!IMPORTANT]
> A virtual machine must have a public IP address assigned before attempting to chain the NIC configuration to the frontend of the gateway load balancer.

1. In the search box in the Azure portal, enter **Virtual machine**. In the search results, select **Virtual machines**.

2. In **Virtual machines**, select the virtual machine that you want to add to the gateway load balancer. In this example, the virtual machine is named **myVM1**.

3. In the overview of the virtual machine, select **Networking** in **Settings**.

4. In **Networking**, select the name of the network interface attached to the virtual machine. In this example, it's **myvm1229**.

    :::image type="content" source="./media/tutorial-gateway-portal/vm-nic.png" alt-text="Screenshot of virtual machine networking overview." border="true":::

5. In the network interface page, select **IP configurations** in **Settings**.

6. Select **myFrontend** in **Gateway Load balancer**.

    :::image type="content" source="./media/tutorial-gateway-portal/vm-nic-gw-lb.png" alt-text="Screenshot of nic IP configuration." border="true":::

7. Select **Save**.

## Clean up resources

When no longer needed, delete the resource group, load balancer, and all related resources. To do so, select the resource group **TutorGwLB-rg** that contains the resources and then select **Delete**.

## Next steps

Create Network Virtual Appliances in Azure. 

When creating the NVAs, choose the resources created in this tutorial:

* Virtual network

* Subnet

* Network security group

* Gateway load balancer

Advance to the next article to learn how to create a cross-region Azure Load Balancer.
> [!div class="nextstepaction"]
> [Cross-region load balancer](tutorial-cross-region-powershell.md)
