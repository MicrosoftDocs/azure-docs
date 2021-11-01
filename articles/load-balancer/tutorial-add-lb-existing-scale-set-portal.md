---
title: 'Tutorial: Add Azure Load Balancer to an existing virtual machine scale set - Azure portal'
description: In this tutorial, learn how to add a load balancer to existing virtual machine scale set using the Azure portal. 
author: asudbring
ms.author: allensu
ms.service: load-balancer
ms.topic: tutorial
ms.date: 4/21/2021
ms.custom: template-tutorial
---

# Tutorial: Add Azure Load Balancer to an existing virtual machine scale set using the Azure portal

The need may arise when an Azure Load Balancer isn't associated with a virtual machine scale set. 

You may have an existing virtual machine scale set deployed with an Azure Load Balancer that requires updating.

The Azure portal can be used to add or update an Azure Load Balancer associated with a virtual machine scale set.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network
> * Create a NAT gateway for outbound connectivity
> * Create a standard SKU Azure Load Balancer
> * Create a virtual machine scale set without a load balancer
> * Add a Azure Load Balancer to virtual machine scale set

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)

## Create a virtual network

In this section, you'll create a virtual network for the scale set and the other resources used in the tutorial.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual network**.

3. In the search results, select **Virtual networks**.

4. Select **+ Create**.

5. In the **Basics** tab of the **Create virtual network**, enter, or select the following information:

    | Setting | Value |
    | ------- | ------|
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **TutorLBVMSS-rg** in **Name**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myVNet**. |
    | Region | Select **(US) West US 2**. |

6. Select the **IP addresses** tab, or the **Next: IP Addresses** button at the bottom of the page.

7. In the **IP addresses** tab, under **Subnet name** select **default**.

8. In the **Edit subnet** pane, under **Subnet name** enter **myBackendSubnet**.

9. Select **Save**.

10. Select the **Security** tab, or the **Next: Security** button at the bottom of the page.

11. In the **Security** tab, in **BastionHost** select **Enable**.

12. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Bastion name | Enter **MyBastionHost**. |
    | AzureBastionSubnet address space | Enter **10.1.1.0/27**. |
    | Public IP address | Select **Create new**. </br> Enter **myBastionIP** in **Name**. |

13. Select the **Review + create** tab, or the blue **Review + create** button at the bottom of the page.

14. Select **Create**.

## Create NAT gateway 

In this section, you'll create a NAT gateway for outbound connectivity of the virtual machines.

1. In the search box at the top of the portal, enter **NAT gateway**.

2. Select **NAT gateways** in the search results.

3. Select **+ Create**.

4. In the **Basics** tab of **Create network address translation (NAT) gateway**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorLBVMSS-rg**. |
    | **Instance details** |   |
    | NAT gateway name | Enter **myNATgateway**. |
    | Region | Select **(US) West US 2**. |
    | Availability zone | Select **None**. |
    | Idle timeout (minutes) | Enter **15**. |

5. Select the **Outbound IP** tab, or select the **Next: Outbound IP** button at the bottom of the page.

6. Select **Create a new public IP address** next to **Public IP addresses** in the **Outbound IP** tab.

7. Enter **myPublicIP-nat** in **Name**.

8. Select **OK**.

9. Select the **Subnet** tab, or select the **Next: Subnet** button at the bottom of the page.

10. Select **myVNet** in the pull-down menu under **Virtual network**.

11. Select the check box next to **myBackendSubnet**.

12. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

13. Select **Create**.

## Create load balancer

In this section, you'll create a load balancer for the virtual machines.

1. In the search box at the top of the portal, enter **Load balancer**.

2. Select **Load balancers** in the search results.

3. Select **+ Create**.

4. In the **Basics** tab of **Create load balancer**, enter, or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorLBVMSS-rg**. |
    | **Instance details** |   |
    | Name | Enter **myLoadBalancer**. |
    | Region | Select **(US) West US 2**. |
    | Type | Leave the default of **Public**. |
    | SKU | Leave the default of **Standard**. |
    | Tier | Leave the default of **Regional**. |
    | **Public IP address** |   |
    | Public IP address | Leave the default of **Create new**. |
    | Public IP address name | Enter **myPublicIP-lb**. |
    | Availability zone | Select **Zone-redundant**. |
    | Add a public IPv6 address | Leave the default of **No**. |
    | Routing preference | Leave the default of **Microsoft network**. |

5. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

6. Select **Create**.

### Configure load balancer settings

In this section, you'll create a backend pool for **myLoadBalancer**.

You'll create a health probe to monitor **HTTP** and **Port 80**. The health probe will monitor the health of the virtual machines in the backend pool. 

You'll create a load-balancing rule for **Port 80** with outbound SNAT disabled. The NAT gateway you created earlier will handle the outbound connectivity of the virtual machines.

1. In the search box at the top of the portal, enter **Load balancer**.

2. Select **Load balancers** in the search results.

3. Select **myLoadBalancer**.

4. In **myLoadBalancer**, select **Backend pools** in **Settings**.

5. Select **+ Add** in **Backend pools**.

6. In **Add backend pool**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myBackendPool**. |
    | Virtual network | Select **myVNet**. |
    | Backend Pool Configuration | Leave the default of **NIC**. |
    | IP Version | Leave the default of **IPv4**. |

7. Select **Add**.

8. Select **Health probes**.

9. Select **+ Add**.

10. In **Add health probe**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHTTPProbe**. |
    | Protocol | Select **HTTP**. |
    | Port | Leave the default of **80**. |
    | Path | Leave the default of **/**. |
    | Interval | Leave the default of **5** seconds. |
    | Unhealthy threshold | Leave the default of **2** consecutive failures. |

11. Select **Add**.

12. Select **Load-balancing rules**. 

13. Select **+ Add**.

14. Enter or select the following information in **Add load-balancing rule**:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHTTPRule**. |
    | IP Version | Leave the default of **IPv4**. |
    | Frontend IP address | Select **LoadBalancerFrontEnd**. |
    | Protocol | Select the default of **TCP**. |
    | Port | Enter **80**. |
    | Backend port | Enter **80**. |
    | Backend pool | Select **myBackendPool**. |
    | Health probe | Select **myHTTPProbe**. |
    | Session persistence | Leave the default of **None**. |
    | Idle timeout (minutes) | Change the slider to **15**. |
    | TCP reset | Select **Enabled**. |
    | Floating IP | Leave the default of **Disabled**. |
    | Outbound source network address translation (SNAT) | Leave the default of **(Recommended) Use outbound rules to provide backend pool members access to the internet.** |

5. Select **Add**.

## Create virtual machine scale set

In this section, you'll create a virtual machine scale set without a load balancer. Later, you'll add a load balancer to this scale set in the Azure portal.

1. In the search box at the top of the portal, enter **Virtual machine scale**.

2. In the search results, select **Virtual machine scale sets**.

3. Select **+ Add**.

4. In the **Basics** tab of **Create a virtual machine scale set**, enter, or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorLBVMSS-rg**. |
    | **Scale set details** |   |
    | Virtual machine scale set name | Enter **myVMScaleSet**. |
    | Region | Select **(US) West US 2**. |
    | Availability zone | Leave the default of **None**. |
    | **Orchestration** |   |
    | Orchestration mode | Leave the default of **Uniform: optimized for large-scale stateless workloads with identical instances**. |
    | **Instance details** |   |
    | Image | Select **Windows Server 2019 Datacenter - Gen1**. |
    | Azure Spot Instance | Leave the default of the box unchecked. |
    | Size | Select a size. |
    | **Administrator account** |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Confirm password. |

5. Select the **Networking** tab.

6. Enter or select the following information in the **Networking** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Virtual network configuration** |   |
    | Virtual network | Select **myVNet**. |

7. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

8. Select **Create**.

## Add load balancer to scale set

In this section, you'll go to the scale set in the Azure portal and add a load balancer to the scale set.

1. In the search box at the top of the portal, enter **Virtual machine scale**.

2. In the search results, select **Virtual machine scale sets**.

3. Select **myVMScaleSet**.

4. In the **Settings** section of **myVMScaleSet**, select **Networking**.

5. Select the **Load balancing** tab in the **Overview** page of the **Networking** settings of **myVMScaleSet**.

    :::image type="content" source="./media/tutorial-add-lb-existing-scale-set-portal/load-balancing-tab.png" alt-text="Select the load balancing tab in networking." border="true":::

6. Select the blue **Add load balancing** button.

7. In **Add load balancing**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Load balancing options | Select **Azure load balancer**. |
    | Select a load balancer | Select **myLoadBalancer**. |
    | Backend pool | Select **Use existing**. |
    | Select a backend pool | Select **myBackendPool**. |

8. Select **Save**.

## Clean up resources

If you're not going to continue to use this application, delete
the load balancer and the supporting resources with the following steps:

1. In the search box at the top of the portal, enter **Resource group**.

2. Select **Resource groups** in the search results.

3. Select **TutorLBVMSS-rg**.

4. In the overview page of **TutorLBVMSS-rg**, select **Delete resource group**.

5. Enter **TutorLBVMSS-rg** in **TYPE THE RESOURCE GROUP NAME**.

6. Select **Delete**.

## Next steps

In this tutorial, you:

* Created a virtual network and Azure Bastion host.
* Created an Azure Standard Load Balancer.
* Created a virtual machine scale set.
* Added load balancer to virtual machine scale set.

Advance to the next article to learn how to create a cross-region Azure Load Balancer:
> [!div class="nextstepaction"]
> [Create a cross-region load balancer](tutorial-cross-region-portal.md)