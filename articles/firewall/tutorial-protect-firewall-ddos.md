---
title: 'Tutorial: Deploy a firewall with Azure DDoS Protection'
description: Deploy and configure Azure Firewall and policy rules by using the Azure portal with Azure DDoS Protection.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: tutorial
ms.date: 03/28/2026
ms.custom: template-tutorial
# Customer intent: As a network administrator, I want to deploy Azure Firewall with DDoS Protection so that I can secure my virtual network and control outbound access for my resources effectively.
---

# Tutorial: Deploy a firewall with Azure DDoS Protection

This article helps you create an Azure Firewall with a DDoS protected virtual network. Azure DDoS Protection provides enhanced DDoS mitigation capabilities such as adaptive tuning, attack alert notifications, and monitoring to protect your firewall from large scale DDoS attacks.

> [!IMPORTANT]
> Azure DDoS Protection incurs a cost when you use the Network Protection SKU. Overages charges only apply if more than 100 public IPs are protected in the tenant. Ensure you delete the resources in this tutorial if you aren't using the resources in the future. For information about pricing, see [Azure DDoS Protection Pricing]( https://azure.microsoft.com/pricing/details/ddos-protection/). For more information about Azure DDoS protection, see [What is Azure DDoS Protection?](../ddos-protection/ddos-protection-overview.md)


For this tutorial, you create a simplified single VNet with two subnets for easy deployment. Azure DDoS Network Protection is enabled for the virtual network.

- **AzureFirewallSubnet** - the firewall is in this subnet.
- **Workload-SN** - the workload server is in this subnet. This subnet's network traffic goes through the firewall.

:::image type="content" source="media/tutorial-firewall-deploy-portal/tutorial-network.png" alt-text="Diagram that shows a firewall network infrastructure with DDoS Protection." lightbox="media/tutorial-firewall-deploy-portal/tutorial-network.png":::

For production deployments, use a [hub and spoke model](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke), where the firewall is in its own VNet. The workload servers are in peered VNets in the same region with one or more subnets.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up a test network environment
> * Deploy a firewall and firewall policy
> * Create a default route
> * Configure an application rule to allow access to www.google.com
> * Configure a network rule to allow access to external DNS servers
> * Configure a NAT rule to allow a remote desktop to the test server
> * Test the firewall

If you prefer, you can complete this procedure using [Azure PowerShell](deploy-ps-policy.md).

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Set up the network

First, create a resource group to contain the resources needed to deploy the firewall. Then create a virtual network, subnets, and a test server.

### Create a resource group

The resource group contains all the resources for the tutorial.

1. Sign in to the [Azure portal](https://portal.azure.com), search for and select **Resource groups**, and then select **Add**. Enter or select the following values:

    | Setting  | Value  |
    | -------- | ------ |
    | Subscription  | Select your Azure subscription. |
    | Resource group | Enter *Test-FW-RG*. |
    | Region | Select a region. All other resources that you create must be in the same region. |

1. Select **Review + create**, and then select **Create**.

### Create a DDoS protection plan

1. Search for and select **DDoS protection plans**. Select **+ Create**, and enter or select the following information:

    | Setting | Value |
    | -- | -- |
    | **Project details** |   |
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Test-FW-RG**. |
    | **Instance details** |   |
    | Name | Enter **myDDoSProtectionPlan**. |
    | Region | Select the region. |

1. Select **Review + create**, and then select **Create**.

### Create a VNet

This VNet has two subnets.

> [!NOTE]
> The size of the AzureFirewallSubnet subnet is /26. For more information about the subnet size, see [Azure Firewall FAQ](firewall-faq.yml#why-does-azure-firewall-need-a--26-subnet-size).

1. On the Azure portal menu, select **Create a resource**.
1. Select **Networking**.
1. Search for **Virtual network** and select it.
1. Select **Create** and enter or select the following values:

    | Setting  | Value  |
    | -------- | ------ |
    | Subscription  | Select your Azure subscription. |
    | Resource group | Select **Test-FW-RG**. |
    | Name | Enter *Test-FW-VN*. |
    | Region | Select the same location that you used previously. |

1. On the **IP addresses** tab, accept the default **10.1.0.0/16** for **IPv4 Address space**. Under **Subnet**, select **default** and enter the following values, and then select **Save**:

    | Setting | Value |
    | ------- | ----- |
    | Subnet name | **AzureFirewallSubnet** (the subnet name **must** be AzureFirewallSubnet) |
    | Address range | **10.1.1.0/26** |

1. Select **Add subnet**, enter the following values, and then select **Add**:

    | Setting | Value |
    | ------- | ----- |
    | Subnet name | **Workload-SN** |
    | Subnet address range | **10.1.2.0/24** |

1. On the **Security** tab, under **DDoS Network Protection**, select **Enable** and select **myDDoSProtectionPlan** for **DDoS protection plan**.
1. Select **Review + create**, and then select **Create**.

### Create a virtual machine

Create the workload virtual machine and place it in the **Workload-SN** subnet.

1. On the Azure portal menu, select **Create a resource**.
1. Select **Windows Server 2019 Datacenter**.
1. Enter or select values for the virtual machine:

   | Setting | Value |
   | ------- | ----- |
   | Subscription  | Select your Azure subscription. |
   | Resource group     | Select **Test-FW-RG**. |
   | Virtual machine name     | Enter *Srv-Work*.|
   | Region     | Select the same location that you used previously. |
   | Username     | Enter a username. |
   | Password     | Enter a password. |

1. For **Public inbound ports**, select **None**, accept disk defaults, and on the **Networking** tab ensure **Test-FW-VN** is the virtual network, the subnet is **Workload-SN**, and **Public IP** is **None**.
1. On the **Management** tab, select **Disable** for boot diagnostics, and then select **Review + create** and **Create**.
1. After the deployment finishes, select the **Srv-Work** resource and note the private IP address for later use.

## Deploy the firewall and policy

Deploy the firewall into the virtual network.

1. Select **Create a resource**, search for and select **Firewall**, and then select **Create**. Enter or select the following values:

   | Setting | Value |
   | ------- | ----- |
   | Subscription  | Select your Azure subscription. |
   | Resource group     | Select **Test-FW-RG**. |
   | Name     | Enter *Test-FW01*. |
   | Region     | Select the same location that you used previously. |
   | Firewall management | Select **Use a Firewall Policy to manage this firewall**. |
   | Firewall policy | Select **Add new**, and enter *fw-test-pol*. <br> Select the same region that you used previously.
   | Choose a virtual network | Select **Use existing**, and then select **Test-FW-VN**. |
   | Public IP address     | Select **Add new**, and enter *fw-pip* for the **Name**. |

1. Accept the other default settings, select **Review + create**, and then select **Create**. Deployment takes a few minutes.
1. After deployment finishes, go to the **Test-FW-RG** resource group, select the **Test-FW01** firewall, and note the firewall private and public IP addresses for later use.

## Create a default route

For the **Workload-SN** subnet, configure the outbound default route to go through the firewall.

1. Search for and select **Route tables**, and then select **Create**. Enter or select the following values:

   | Setting | Value |
   | ------- | ----- |
   | Subscription | Select your Azure subscription. |
   | Resource group | Select **Test-FW-RG**. |
   | Region  | Select the same location that you used previously. |
   | Name  | Enter *Firewall-route*. |

1. Select **Review + create**, and then select **Create**. After the deployment finishes, select **Go to resource**.
1. Select **Subnets** > **Associate**, select **Virtual network** > **Test-FW-VN**, and for **Subnet** select **Workload-SN** (select only this subnet, otherwise the firewall won't work correctly), and then select **OK**.
1. Select **Routes** > **Add** and enter or select the following values, and then select **OK**:

   | Setting | Value |
   | ------- | ----- |
   | Route name | *fw-dg* |
   | Address prefix | *0.0.0.0/0* |
   | Next hop type | **Virtual appliance** (Azure Firewall is a managed service, but virtual appliance works here) |
   | Next hop address | The firewall private IP address you noted previously |

## Configure an application rule

This application rule grants outbound access to `www.google.com`.

1. Open the **Test-FW-RG** resource group, select the **fw-test-pol** firewall policy, and then select **Application rules** > **Add a rule collection**. Enter the following values:

   | Setting | Value |
   | ------- | ----- |
   | Name | *App-Coll01* |
   | Priority | *200* |
   | Rule collection action | **Allow** |
   | Rule > Name | *Allow-Google* |
   | Rule > Source type | **IP address** |
   | Rule > Source | *10.0.2.0/24* |
   | Rule > Protocol:port | *http, https* |
   | Rule > Destination type | **FQDN** |
   | Rule > Destination | *`www.google.com`* |

1. Select **Add**.

Azure Firewall includes a built-in rule collection for infrastructure FQDNs that are allowed by default. These FQDNs are specific to the platform and you can't use them for other purposes. For more information, see [Infrastructure FQDNs](rule-processing.md#infrastructure-rule-collection).

## Configure a network rule

This network rule grants outbound access to two IP addresses at port 53 (DNS).

1. Select **Network rules** > **Add a rule collection** and enter the following values:

   | Setting | Value |
   | ------- | ----- |
   | Name | *Net-Coll01* |
   | Priority | *200* |
   | Rule collection action | **Allow** |
   | Rule collection group | **DefaultNetworkRuleCollectionGroup** |
   | Rule > Name | *Allow-DNS* |
   | Rule > Source type | **IP Address** |
   | Rule > Source | *10.0.2.0/24* |
   | Rule > Protocol | **UDP** |
   | Rule > Destination Ports | *53* |
   | Rule > Destination type | **IP address** |
   | Rule > Destination | *209.244.0.3,209.244.0.4* (public DNS servers operated by CenturyLink) |

1. Select **Add**.

## Configure a DNAT rule

This rule connects a remote desktop to the **Srv-Work** virtual machine through the firewall.

1. Select **DNAT rules** > **Add a rule collection** and enter the following values:

   | Setting | Value |
   | ------- | ----- |
   | Name | *rdp* |
   | Priority | *200* |
   | Rule collection group | **DefaultDnatRuleCollectionGroup** |
   | Rule > Name | *rdp-nat* |
   | Rule > Source type | **IP address** |
   | Rule > Source | *\** |
   | Rule > Protocol | **TCP** |
   | Rule > Destination Ports | *3389* |
   | Rule > Destination type | **IP Address** |
   | Rule > Destination | The firewall public IP address |
   | Rule > Translated address | The **Srv-Work** private IP address |
   | Rule > Translated port | *3389* |

1. Select **Add**.


### Change the DNS address for the Srv-Work network interface

For testing purposes in this tutorial, configure the server's primary and secondary DNS addresses. This configuration isn't a general Azure Firewall requirement.

1. In the **Test-FW-RG** resource group, select the network interface for the **Srv-Work** virtual machine.
1. Under **Settings**, select **DNS servers** > **Custom**, enter `209.244.0.3` and `209.244.0.4`, and then select **Save**.
1. Restart the **Srv-Work** virtual machine.

## Test the firewall

Now, test the firewall to confirm that it works as expected.

1. Connect a remote desktop to the firewall public IP address and sign in to the **Srv-Work** virtual machine.
1. Open a web browser and browse to `https://www.google.com`.

   You see the Google home page.

1. Browse to `https://www.microsoft.com`.

   The firewall blocks you.

Now you verified that the firewall rules are working:

- You can browse to the one allowed FQDN, but not to any others.
- You can resolve DNS names by using the configured external DNS server.

## Clean up resources

You can keep your firewall resources for the next tutorial, or if you no longer need them, delete the **Test-FW-RG** resource group to delete all firewall-related resources.

## Next steps

> [!div class="nextstepaction"]
> [Deploy and configure Azure Firewall Premium](premium-deploy.md)
