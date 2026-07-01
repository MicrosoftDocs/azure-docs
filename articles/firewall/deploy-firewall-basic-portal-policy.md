---
title: 'Deploy & configure Azure Firewall Basic and policy using the Azure portal'
description: Deploy and configure Azure Firewall Basic and policy rules using the Azure portal.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: how-to
ms.date: 03/28/2026
ms.custom: mvc
# Customer intent: "As a network administrator, I want to deploy and configure Azure Firewall Basic with policy rules via the Azure portal, so that I can secure outbound and inbound network access effectively for my resources in an Azure subnet."
---

# Deploy and configure Azure Firewall Basic and policy by using the Azure portal

Azure Firewall Basic provides the essential protection SMB customers need at an affordable price point. This solution is recommended for SMB customer environments with less than 250 Mbps throughput requirements. Deploy the [Standard SKU](tutorial-firewall-deploy-portal-policy.md) for environments with more than 250 Mbps throughput requirements and the [Premium SKU](premium-portal.md) for advanced threat protection.

Filtering network and application traffic is an important part of an overall network security plan. For example, you might want to limit access to websites. Or, you might want to limit the outbound IP addresses and ports that can be accessed.

One way you can control both inbound and outbound network access from an Azure subnet is with Azure Firewall and Firewall Policy. By using Azure Firewall and Firewall Policy, you can configure:

- Application rules that define fully qualified domain names (FQDNs) that can be accessed from a subnet.
- Network rules that define source address, protocol, destination port, and destination address.
- DNAT rules to translate and filter inbound Internet traffic to your subnets.

Network traffic is subjected to the configured firewall rules when you route your network traffic to the firewall as the subnet default gateway.

In this article, you create a simplified single virtual network with three subnets for easy deployment. Firewall Basic has a mandatory requirement to be configured with a management NIC.

- **AzureFirewallSubnet** - the firewall is in this subnet.
- **AzureFirewallManagementSubnet** - for service management traffic.
- **Workload-SN** - the workload server is in this subnet. This subnet's network traffic goes through the firewall.

> [!NOTE]
> As Azure Firewall Basic has limited traffic handling compared to Azure Firewall Standard or Premium SKU, it requires the **AzureFirewallManagementSubnet** to separate customer traffic from Microsoft management traffic to ensure no disruptions. This management traffic is needed for updates and health metrics communication that occurs automatically to and from Microsoft only. No other connections are allowed on this IP.

For production deployments, use a [hub and spoke model](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke), where the firewall is in its own virtual network. The workload servers are in peered virtual networks in the same region with one or more subnets.

In this article, you learn how to:

> [!div class="checklist"]
> - Set up a test network environment
> - Deploy a basic firewall and basic firewall policy
> - Create a default route
> - Configure an application rule to allow access to www.google.com
> - Configure a network rule to allow access to external DNS servers
> - Configure a NAT rule to allow a remote desktop to the test server
> - Test the firewall

If you prefer, you can complete this procedure by using [Azure PowerShell](deploy-ps-policy.md).

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Create a resource group

The resource group contains all the resources for the how-to.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Resource groups**, and then select **Create**.
1. Enter or select the following values:

   | Setting | Value |
   | --------- | ------- |
   | Subscription | Select your subscription. |
   | Resource group name | Enter *Test-FW-RG*. |
   | Region | Select a region. All other resources that you create must be in the same region. |

1. Select **Review + create**, and then select **Create**.

## Deploy the firewall and policy

Deploy the firewall and create the associated network infrastructure.

1. On the Azure portal menu or from the **Home** pane, select **Create a resource**.
1. Type `firewall` in the search box and press **Enter**.
1. Select **Firewall** and then select **Create**.
1. On **Create a Firewall**, enter or select the following values:

   | Setting | Value |
   | --------- | ------- |
   | Subscription | Select your subscription. |
   | Resource group | Select **Test-FW-RG**. |
   | Name | Enter **Test-FW01**. |
   | Region | Select the same location that you used previously. |
   | Firewall Tier | **Basic** |
   | Firewall management | **Use a Firewall Policy to manage this firewall** |
   | Firewall policy | Select **Add new**. Enter **fw-test-pol**, select your region, and confirm the policy tier defaults to **Basic**. |
   | Choose a virtual network | Select **Create new**. Enter **Test-FW-VN** for the name, **10.0.0.0/16** for the address space, and **10.0.0.0/26** for the subnet address space. |
   | Public IP address | Select **Add new** and enter **fw-pip** for the name. |
   | Management - Subnet address space | **10.0.1.0/26** |
   | Management public IP address | Select **Add new** and enter **fw-mgmt-pip** for the name. |

1. Accept the other default values, and then select **Review + create**.
1. Review the summary, and then select **Create** to create the firewall.

   The deployment takes a few minutes.
1. After the deployment finishes, go to the **Test-FW-RG** resource group, and select the **Test-FW01** firewall.
1. Note the firewall private and public IP (fw-pip) addresses. You use these addresses later.

## Create a subnet for the workload server

Next, create a subnet for the workload server.

1. Go to the **Test-FW-RG** resource group and select the **Test-FW-VN** virtual network.
1. Select **Subnets**, and then select **+ Subnet**.
1. For **Subnet name**, enter `Workload-SN`. For **Subnet address range**, enter `10.0.2.0/24`.
1. Select **Save**.

## Create a virtual machine

Create the workload virtual machine and place it in the **Workload-SN** subnet.

1. On the Azure portal menu or **Home**, select **Create a resource**.
1. Select **Windows Server 2019 Datacenter**.
1. Enter the following values for the virtual machine:

   | Setting | Value |
   | --------- | ------- |
   | Resource group | **Test-FW-RG** |
   | Virtual machine name | **Srv-Work** |
   | Region | Same as previous |
   | Image | Windows Server 2019 Datacenter |
   | Administrator user name | Type a user name |
   | Password | Type a password |

1. Under **Inbound port rules**, for **Public inbound ports**, select **None**.
1. Accept the defaults on the **Disks** tab and select **Next: Networking**.
1. For **Virtual network**, select **Test-FW-VN**. For **Subnet**, select **Workload-SN**. For **Public IP**, select **None**.
1. Accept the defaults through **Management**, and then on the **Monitoring** tab select **Disable** for boot diagnostics. Select **Review + create**, and then select **Create**.
1. After the deployment finishes, select the **Srv-Work** resource and note the private IP address for later use.

## Create a default route

For the **Workload-SN** subnet, configure the outbound default route to go through the firewall.

1. Search for and select **Route tables**, and then select **Create**.
1. Enter or select the following values:

   | Setting | Value |
   | --------- | ------- |
   | Subscription | Select your subscription. |
   | Resource group | Select **Test-FW-RG**. |
   | Region | Select the same location that you used previously. |
   | Name | Enter `Firewall-route`. |

1. Select **Review + create**, and then select **Create**. When the deployment finishes, select **Go to resource**.
1. On the **Firewall-route** page, select **Subnets**, and then select **Associate**.
1. Select **Virtual network** > **Test-FW-VN**. For **Subnet**, select **Workload-SN**.

   > [!IMPORTANT]
   > Select only the **Workload-SN** subnet for this route, otherwise your firewall doesn't work correctly.

1. Select **OK**.
1. Select **Routes**, and then select **Add**. Enter or select the following values:

   | Setting | Value |
   | --------- | ------- |
   | Route name | `fw-dg` |
   | Address prefix destination | **IP Addresses** |
   | Destination IP addresses/CIDR ranges | `0.0.0.0/0` |
   | Next hop type | **Virtual appliance** (Azure Firewall is a managed service, but virtual appliance works here.) |
   | Next hop address | The firewall private IP address that you noted previously. |

1. Select **Add**.

## Configure an application rule

This application rule grants outbound access to `www.google.com`.

1. Open **Test-FW-RG**, and select the **fw-test-pol** firewall policy.
1. Select **Application rules**, and then select **Add a rule collection**.
1. Enter or select the following values:

   | Setting | Value |
   | --------- | ------- |
   | Name | `App-Coll01` |
   | Priority | `200` |
   | Rule collection action | **Allow** |

1. Under **Rules**, enter or select the following values:

   | Setting | Value |
   | --------- | ------- |
   | Name | `Allow-Google` |
   | Source type | **IP address** |
   | Source | `10.0.2.0/24` |
   | Protocol:port | `http, https` |
   | Destination Type | **FQDN** |
   | Destination | `www.google.com` |

1. Select **Add**.

Azure Firewall includes a built-in rule collection for infrastructure FQDNs that are allowed by default. These FQDNs are specific to the platform and you can't use them for other purposes. For more information, see [Infrastructure FQDNs](rule-processing.md#infrastructure-rule-collection).

## Configure a network rule

This network rule grants outbound access to two IP addresses at port 53 (DNS).

1. Select **Network rules**, and then select **Add a rule collection**.
1. Enter or select the following values:

   | Setting | Value |
   | --------- | ------- |
   | Name | `Net-Coll01` |
   | Priority | `200` |
   | Rule collection action | **Allow** |
   | Rule collection group | **DefaultNetworkRuleCollectionGroup** |

1. Under **Rules**, enter or select the following values:

   | Setting | Value |
   | --------- | ------- |
   | Name | `Allow-DNS` |
   | Source type | **IP Address** |
   | Source | `10.0.2.0/24` |
   | Protocol | **UDP** |
   | Destination Ports | `53` |
   | Destination type | **IP address** |
   | Destination | `209.244.0.3,209.244.0.4` (public DNS servers operated by Level3) |

1. Select **Add**.

## Configure a DNAT rule

This rule connects a remote desktop to the Srv-Work virtual machine through the firewall.

1. Select **DNAT rules**, and then select **Add a rule collection**.
1. Enter or select the following values:

   | Setting | Value |
   | --------- | ------- |
   | Name | `rdp` |
   | Priority | `200` |
   | Rule collection group | **DefaultDnatRuleCollectionGroup** |

1. Under **Rules**, enter or select the following values:

   | Setting | Value |
   | --------- | ------- |
   | Name | `rdp-nat` |
   | Source type | **IP address** |
   | Source | `*` |
   | Protocol | **TCP** |
   | Destination Ports | `3389` |
   | Destination Type | **IP Address** |
   | Destination | The firewall public IP address (fw-pip) |
   | Translated address | The **Srv-Work** private IP address |
   | Translated port | `3389` |

1. Select **Add**.


### Change the primary and secondary DNS address for the **Srv-Work** network interface

For testing purposes in this article, configure the server's primary and secondary DNS addresses. This configuration isn't a general Azure Firewall requirement.

1. In the Azure portal, go to **Resource groups**, either from the menu or by searching, and then select **Test-FW-RG**.
1. Select the network interface for the **Srv-Work** virtual machine.
1. Under **Settings**, select **DNS servers**.
1. Under **DNS servers**, select **Custom**.
1. Type `209.244.0.3` in the **Add DNS server** text box, and `209.244.0.4` in the next text box.
1. Select **Save**.
1. Restart the **Srv-Work** virtual machine.

## Test the firewall

Now, test the firewall to confirm that it works as expected.

1. Connect a remote desktop to the firewall public IP address (fw-pip) and sign in to the **Srv-Work** virtual machine.
1. Open Microsoft Edge and browse to `https://www.google.com`. You see the Google home page.

1. Browse to `http://www.microsoft.com`.

   The firewall blocks you.

Now you verified that the firewall rules are working:

- You can connect a remote desktop to the Srv-Work virtual machine.
- You can browse to the one allowed FQDN, but not to any others.
- You can resolve DNS names by using the configured external DNS server.

## Clean up resources

You can keep your firewall resources for further testing. If you no longer need them, delete the **Test-FW-RG** resource group to delete all firewall-related resources.

## Next steps

> [!div class="nextstepaction"]
> [Deploy and configure Azure Firewall Premium](premium-deploy.md)
