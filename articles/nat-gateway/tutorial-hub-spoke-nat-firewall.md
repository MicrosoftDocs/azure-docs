---
title: 'Tutorial: Integrate NAT gateway with Azure Firewall in a hub and spoke network'
titleSuffix: Azure NAT Gateway
description: Learn how to integrate a NAT gateway and Azure Firewall in a hub and spoke network.
author: asudbring
ms.author: allensu
ms.service: nat-gateway
ms.topic: tutorial
ms.date: 01/17/2023
ms.custom: template-tutorial
---

# Tutorial: Integrate NAT gateway with Azure Firewall in a hub and spoke network for outbound connectivity

In this tutorial, you’ll learn how to integrate a NAT gateway with an Azure Firewall in a hub and spoke network

Azure Firewall provides [2,496 SNAT ports per public IP address](../firewall/integrate-with-nat-gateway.md) configured per backend Virtual Machine Scale Set instance (minimum of two instances). You can associate up to 250 public IP addresses to Azure Firewall. Depending on your architecture requirements and traffic patterns, you may require more SNAT ports than what Azure Firewall can provide. You may also require the use of fewer public IPs while also requiring more SNAT ports. A better method for outbound connectivity is to use NAT gateway. NAT gateway provides 64,512 SNAT ports per public IP address and can be used with up to 16 public IP addresses. 

NAT gateway can be integrated with Azure Firewall by configuring NAT gateway directly to the Azure Firewall subnet in order to provide a more scalable method of outbound connectivity. For production deployments, a hub and spoke network is recommended, where the firewall is in its own virtual network. The workload servers are peered virtual networks in the same region as the hub virtual network where the firewall resides. In this architectural setup, NAT gateway can provide outbound connectivity from the hub virtual network for all spoke virtual networks peered.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a hub virtual network and deploy an Azure Firewall and Azure Bastion during deployment
> * Create a NAT gateway and associate it with the firewall subnet in the hub virtual network
> * Create a spoke virtual network
> * Create a virtual network peering
> * Create a route table for the spoke virtual network
> * Create a firewall policy for the hub virtual network
> * Create a virtual machine to test the outbound connectivity through the NAT gateway

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 

## Create the hub virtual network

The hub virtual network contains the firewall subnet that is associated with the Azure Firewall and NAT gateway. Use the following example to create the hub virtual network.

1. Sign in to the [Azure portal](https://portal.azure.com)

2. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

3. Select **+ Create**.

4. In the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **TutorialNATHubSpokeFW-rg**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myVNet-Hub**. |
    | Region | Select **South Central US**. |

5. Select **Next: IP Addresses**.

6. In the **IP Addresses** tab in **IPv4 address space**, select the trash can to delete the address space that is auto populated.

7. In **IPv4 address space** enter **10.1.0.0/16**.

8. Select **+ Add subnet**.

9. In **Add subnet** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subnet name | Enter **subnet-private**. |
    | Subnet address range | Enter **10.1.0.0/24**. |

10. Select **Add**.

11. Select **Next: Security**.

12. In the **Security** tab in **BastionHost**, select **Enable**.

13. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Bastion name | Enter **myBastion**. |
    | AzureBastionSubnet address space | Enter **10.1.1.0/26**. |
    | Public IP address | Select **Create new**. </br> In **Name** enter **myPublicIP-Bastion**. </br> Select **OK**. |

14. In **Firewall** select **Enable**.

15. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Firewall name | Enter **myFirewall**. |
    | Firewall subnet address space | Enter **10.1.2.0/26**. |
    | Public IP address | Select **Create new**. </br> In **Name** enter **myPublicIP-Firewall**. </br> Select **OK**. |

16. Select **Review + create**.

17. Select **Create**.

It will take a few minutes for the bastion host and firewall to deploy. When the virtual network is created as part of the deployment, you can proceed to the next steps.

## Create the NAT gateway

All outbound internet traffic will traverse the NAT gateway to the internet. Use the following example to create a NAT gateway for the hub and spoke network and associate it with the **AzureFirewallSubnet**.

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

2. Select **+ Create**.

3. In the **Basics** tab of **Create network address translation (NAT) gateway** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorialNATHubSpokeFW-rg**. |
    | **Instance details** |  |
    | NAT gateway name | Enter **myNATgateway**. |
    | Region | Select **South Central US**. |
    | Availability zone | Select a **Zone** or **No zone**. |
    | TCP idle timeout (minutes) | Leave the default of **4**. |
    
    For more information about availability zones, see [NAT gateway and availability zones](nat-availability-zones.md).

5. Select **Next: Outbound IP**.

6. In **Outbound IP** in **Public IP addresses**, select **Create a new public IP address**.

7. Enter **myPublicIP-NAT** in **Name**.

8. Select **OK**.

9. Select **Next: Subnet**.

10. In **Virtual Network** select **myVNet-Hub**.

11. Select **AzureFirewallSubnet** in **Subnet name**.

12. Select **Review + create**. 

13. Select **Create**.

## Create spoke virtual network

The spoke virtual network contains the test virtual machine used to test the routing of the internet traffic to the NAT gateway. Use the following example to create the spoke network.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

2. Select **+ Create**.

3. In the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorialNATHubSpokeFW-rg**. |
    | **Instance details** |   |
    | Name | Enter **myVNet-Spoke**. |
    | Region | Select **South Central US**. |

4. Select **Next: IP Addresses**.

5. In the **IP Addresses** tab in **IPv4 address space**, select the trash can to delete the address space that is auto populated.

6. In **IPv4 address space** enter **10.2.0.0/16**.

7. Select **+ Add subnet**.

8. In **Add subnet** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subnet name | Enter **subnet-private**. |
    | Subnet address range | Enter **10.2.0.0/24**. |

9. Select **Add**.

10. Select **Review + create**. 

12. Select **Create**.

## Create peering between the hub and spoke

A virtual network peering is used to connect the hub to the spoke and the spoke to the hub. Use the following example to create a two-way network peering between the hub and spoke.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

2. Select **myVNet-Hub**.

3. Select **Peerings** in **Settings**.

4. Select **+ Add**.

5. Enter or select the following information in **Add peering**:

    | Setting | Value |
    | ------- | ----- |
    | **This virtual network** |   |
    | Peering link name | Enter **myVNet-Hub-To-myVNet-Spoke**. |
    | Traffic to remote virtual network | Leave the default of **Allow (default)**. |
    | Traffic forwarded from remote virtual network | Leave the default of **Allow (default)**. |
    | Virtual network gateway or Route Server | Leave the default of **None**. |
    | **Remote virtual network** |   |
    | Peering link name | Enter **myVNet-Spoke-To-myVNet-Hub**. |
    | Virtual network deployment model | Leave the default of **Resource manager**. |
    | Subscription | Select your subscription. |
    | Virtual network | Select **myVNet-Spoke**. |
    | Traffic to remote virtual network | Leave the default of **Allow (default)**. |
    | Traffic forwarded from remote virtual network | Leave the default of **Allow (default)**. |
    | Virtual network gateway or Route Server | Leave the default of **None**. |

6. Select **Add**.

7. Select **Refresh** and verify **Peering status** is **Connected**.

## Create spoke network route table

A route table will force all traffic leaving the spoke virtual network to the hub virtual network. The route table is configured with the private IP address of the Azure Firewall as the virtual appliance.

### Obtain private IP address of firewall

The private IP address of the firewall is needed for the route table created later in this article. Use the following example to obtain the firewall private IP address.

1. In the search box at the top of the portal, enter **Firewall**. Select **Firewall** in the search results.

2. Select **myFirewall**.

3. In the **Overview** of **myFirewall**, note the IP address in the field **Firewall private IP**. The IP address should be **10.1.2.4**.

### Create route table

Create a route table to force all inter-spoke and internet egress traffic through the firewall in the hub virtual network.

1. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

2. Select **+ Create**.

3. In **Create Route table** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorialNATHubSpokeFW-rg**. |
    | **Instance details** |   |
    | Region | Select **South Central US**. |
    | Name | Enter **myRouteTable-Spoke**. |
    | Propagate gateway routes | Select **No**. |

4. Select **Review + create**. 

5. Select **Create**.

6. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

7. Select **myRouteTable-Spoke**.

8. In **Settings** select **Routes**.

9. Select **+ Add** in **Routes**.

10. Enter or select the following information in **Add route**:

    | Setting | Value |
    | ------- | ----- |
    | Route name | Enter **Route-To-Hub**. |
    | Address prefix destination | Select **IP Addresses**. |
    | Destination IP addresses/CIDR ranges | Enter **0.0.0.0/0**. |
    | Next hop type | Select **Virtual appliance**. |
    | Next hop address | Enter **10.1.2.4**. |

11. Select **Add**.

12. Select **Subnets** in **Settings**.

13. Select **+ Associate**.

14. Enter or select the following information in **Associate subnet**:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Select **myVNet-Spoke (TutorialNATHubSpokeFW-rg)**. |
    | Subnet | Select **subnet-private**. |

15. Select **OK**.

## Configure firewall

Traffic from the spoke through the hub must be allowed through and firewall policy and a network rule. Use the following example to create the firewall policy and network rule.

### Create firewall policy

1. In the search box at the top of the portal, enter **Firewall**. Select **Firewalls** in the search results.

2. Select **myFirewall**.

3. In the **Overview** select **Migrate to firewall policy**.

4. In **Migrate to firewall policy** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorialNATHubSpokeFW-rg**. |
    | **Policy details** |  |
    | Name | Enter **myFirewallPolicy**. |
    | Region | Select **South Central US**. |

5. Select **Review + create**.

6. Select **Create**.

### Configure network rule

1. In the search box at the top of the portal, enter **Firewall**. Select **Firewall Policies** in the search results.

2. Select **myFirewallPolicy**.

3. In **Settings** select **Network rules**.

4. Select **+ Add a rule collection**.

5. In **Add a rule collection** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **SpokeToInternet**. |
    | Rule collection type | Select **Network**. |
    | Priority | Enter **100**. |
    | Rule collection action | Select **Allow**. |
    | Rule collection group | Select **DefaultNetworkRuleCollectionGroup**. |
    | Rules |    |
    | Name | Enter **AllowWeb**. |
    | Source type | **IP Address**. |
    | Source | Enter **10.2.0.0/24**. |
    | Protocol | Select **TCP**. |
    | Destination Ports | Enter **80**,**443**. |
    | Destination Type | Select **IP Address**. |
    | Destination | Enter * |

6. Select **Add**.

## Create test virtual machine

A Windows Server 2022 virtual machine is used to test the outbound internet traffic through the NAT gateway. Use the following example to create a Windows Server 2022 virtual machine.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **+ Create** then **Azure virtual machine**.

3. In **Create a virtual machine** enter or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorialNATHubSpokeFW-rg**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **myVM-Spoke**. |
    | Region | Select **South Central US**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Authentication type | Select **Password**. |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |

4. Select **Next: Disks** then **Next: Networking**.

5. In the Networking tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **myVNet-Spoke**. |
    | Subnet | Select **subnet-private (10.2.0.0/24)**. |
    | Public IP | Select **None**. |

6. Leave the rest of the options at the defaults and select **Review + create**.

7. Select **Create**.

## Test NAT gateway

You'll connect to the Windows Server 2022 virtual machines you created in the previous steps to verify that the outbound internet traffic is leaving the NAT gateway.

### Obtain NAT gateway public IP address

Obtain the NAT gateway public IP address for verification of the steps later in the article.

1. In the search box at the top of the portal, enter **Public IP**. Select **Public IP addresses** in the search results.

2. Select **myPublic-NAT**.

3. Make note of value in **IP address**. The example used in this article is **20.225.88.213**.

### Test NAT gateway from spoke

Use Microsoft Edge on the Windows Server 2022 virtual machine to connect to https://whatsmyip.com to verify the functionality of the NAT gateway.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM-Spoke**.

3. Select **Connect** then **Bastion**.

4. Enter the username and password you entered when the virtual machine was created.

5. Select **Connect**.

6. Open **Microsoft Edge** when the desktop finishes loading.

7. In the address bar, enter **https://whatsmyip.com**.

8. Verify the outbound IP address displayed is the same as the IP of the NAT gateway you obtained previously.

    :::image type="content" source="./media/tutorial-hub-spoke-nat-firewall/outbound-ip-address.png" alt-text="Screenshot of outbound IP address.":::

## Clean up resources

If you're not going to continue to use this application, delete the created resources with the following steps:

1. In the search box at the top of the portal, enter **Resource group**. Select **Resource groups** in the search results.

2. Select **TutorialNATHubSpokeFW-rg**.

3. In the **Overview** of **TutorialNATHubSpokeFW-rg**, select **Delete resource group**.

4. In **TYPE THE RESOURCE GROUP NAME:**, enter **TutorialNATHubSpokeFW-rg**.

5. Select **Delete**.

## Next steps

Advance to the next article to learn how to integrate a NAT gateway with an Azure Load Balancer:
> [!div class="nextstepaction"]
> [Integrate NAT gateway with an internal load balancer](tutorial-nat-gateway-load-balancer-internal-portal.md)
