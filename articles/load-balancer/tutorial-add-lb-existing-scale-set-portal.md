---
title: 'Tutorial: Add Azure Load Balancer to an existing Virtual Machine Scale Set - Azure portal'
description: In this tutorial, learn how to add a load balancer to existing Virtual Machine Scale Set using the Azure portal. 
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: tutorial
ms.date: 01/23/2024
ms.custom: template-tutorial, engagement-fy23
---

# Tutorial: Add Azure Load Balancer to an existing Virtual Machine Scale Set using the Azure portal

In many organizations, the need can arise where an Azure Load Balancer isn't associated with a Virtual Machine Scale Set, but needs to be added. Or an existing Virtual Machine Scale Set is deployed with an Azure Load Balancer that requires updating. The Azure portal can be used to add or update an Azure Load Balancer associated with a Virtual Machine Scale Set.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network
> * Create a NAT gateway for outbound connectivity
> * Create a standard SKU Azure Load Balancer
> * Create a virtual machine scale set without a load balancer
> * Add a Azure Load Balancer to virtual machine scale set

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)


[!INCLUDE [load-balancer-create-bastion](../../includes/load-balancer-create-bastion.md)]


## Create Virtual Machine Scale Set

In this section, you create a Virtual Machine Scale Set that is attached to a load balancer created later.

1. In the search box at the top of the portal, enter **Virtual machine scale**, and select **Virtual machine scale sets** from the search results.
1. Select **Create**.

1. In the **Basics** tab of **Create a virtual machine scale set**, enter, or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **load-balancer-rg**. |
    | **Scale set details** |   |
    | Virtual machine scale set name | Enter **lb-vmss**. |
    | Region | Select **(US) East US**. |
    | Availability zone | Leave the default of **None**. |
    | **Orchestration** |   |
    | Orchestration mode | Leave the default of **Uniform: optimized for large-scale stateless workloads with identical instances**. |
    | Security type | Leave the default of **Standard**
    | **Instance details** |   |
    | Image | Select **Windows Server 2022 Datacenter: Azure Edition - x64 Gen2**. |
    | Azure Spot Instance | Leave the default of the box unchecked. |
    | Size | Select a size. |
    | **Administrator account** |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Confirm password. |

1. Select the **Networking** tab.

1. Enter or select the following information in the **Networking** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Virtual network configuration** |   |
    | Virtual network | Select **lb-vnet**. |

1. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

1. Select **Create**.

[!INCLUDE [load-balancer-nat-gateway](../../includes/load-balancer-nat-gateway.md)]

[!INCLUDE [load-balancer-create-public-no-rule](../../includes/load-balancer-create-public-no-rule.md)]

### Configure load balancer settings

In this section, you create a backend pool for load-balancer. You create a health probe to monitor HTTP and Port 80 to ensure the health of the virtual machines in the backend pool. Additionally, you create a load-balancing rule for Port 80 with outbound SNAT disabled. The outbound connectivity of the virtual machines is handled by the NAT gateway created earlier.

1. In the search box at the top of the portal, enter **Load balancer**.

1. Select **Load balancers** in the search results.

1. Select **load-balancer**.

1. In **load-balancer**, select **Backend pools** in **Settings**.

1. Select **+ Add** in **Backend pools**.

1. In **Add backend pool**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **lb-backend-pool**. |
    | Virtual network | Select **lb-vnet**. |
    | Backend Pool Configuration | Leave the default of **NIC**. |

1. Select **Save**.

1. Select **Next: Inbound rules**

1. In **Create load balancer** page, select **+ Add a load balancing rule**.

1. Enter or select the following information in **Add load-balancing rule**:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **lb-HTTP-rule**. |
    | IP Version | Leave the default of **IPv4**. |
    | Frontend IP address | Select **lb-Frontend-IP**. |
    | Backend pool | Select **lb-backend-pool**. |
    | Protocol | Select the default of **TCP**. |
    | Port | Enter **80**. |
    | Backend port | Enter **80**. |
    | Health probe | Select **Create new**.<br/> Enter **lb-HTTP-probe** for **Name**.</br><br/>Select **HTTP** for **Protocol**.</br><br/> Select **Ok**.</br>|
    | Session persistence | Leave the default of **None**. |
    | Idle timeout (minutes) | Change the slider to **15**. |
    | TCP reset | Select **Enabled**. |
    | Floating IP | Leave the default of **Disabled**. |
    | Outbound source network address translation (SNAT) | Leave the default of **(Recommended) Use outbound rules to provide backend pool members access to the internet.** |

1. Select **Add**.
1. Select **Review + Create** and **Create**.

## Add load balancer to scale set

In this section, you add a load balancer to the scale set in the Azure portal.

1. In the search box at the top of the portal, enter **Virtual machine scale**.

1. In the search results, select **Virtual machine scale sets**.

1. Select **lb-vmss**.

1. In the **Settings** section of **lb-vmss**, select **Networking**.

1. Select the **Load balancing** tab in the **Overview** page of the **Networking** settings of **lb-vmss**.

    :::image type="content" source="./media/tutorial-add-lb-existing-scale-set-portal/load-balancing-tab.png" alt-text="Select the load balancing tab in networking." border="true":::

1. Select the blue **Add load balancing** button.

1. In **Add load balancing**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Load balancing options | Select **Azure load balancer**. |
    | Select a load balancer | Select **load-balancer**. |
    | Backend pool | Select **Use existing**. |
    | Select a backend pool | Select **lb-backend-pool**. |

1. Select **Save**.

## Clean up resources

If you're not going to continue to use this application, delete
the load balancer and the supporting resources with the following steps:

1. In the search box at the top of the portal, enter **Resource group**.
1. Select **Resource groups** in the search results.
1. Select **load-balancer-rg**.
1. In the overview page of **load-balancer-rg**, select **Delete resource group**.
1. Enter **load-balancer-rg** in **TYPE THE RESOURCE GROUP NAME**.
1. Select **Delete**.

## Next steps

In this tutorial, you:

* Created a virtual network and Azure Bastion host.
* Created an Azure Standard Load Balancer.
* Created a virtual machine scale set.
* Added load balancer to Virtual Machine Scale Set.

Advance to the next article to learn how to create a cross-region Azure Load Balancer:
> [!div class="nextstepaction"]
> [Create a cross-region load balancer](tutorial-cross-region-portal.md)