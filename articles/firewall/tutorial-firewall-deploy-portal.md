---
title: Deploy & configure Azure Firewall using the Azure portal
description: In this article, you learn how to deploy and configure Azure Firewall using the Azure portal. 
services: firewall
author: duongau
ms.service: azure-firewall
ms.topic: how-to
ms.date: 02/05/2026
ms.author: duau
ms.custom: mvc
#Customer intent: As an administrator new to this service, I want to control outbound network access from resources located in an Azure subnet.
# Customer intent: As a network administrator, I want to deploy and configure a firewall in our Azure environment, so that I can control outbound access from our virtual networks and enhance our overall network security.
---

# Deploy and configure Azure Firewall using the Azure portal

Controlling outbound network access is an important part of an overall network security plan. For example, you might want to limit access to web sites. Or, you might want to limit the outbound IP addresses and ports that can be accessed.

One way you can control outbound network access from an Azure subnet is with Azure Firewall. With Azure Firewall, you can configure:

* Application rules that define fully qualified domain names (FQDNs) that can be accessed from a subnet.
* Network rules that define source address, protocol, destination port, and destination address.

Network traffic is subjected to the configured firewall rules when you route your network traffic to the firewall as the subnet default gateway.

For this article, you create a simplified single virtual network with two subnets for easy deployment.

For production deployments, a [hub and spoke model](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) is recommended, where the firewall is in its own virtual network. The workload servers are in peered virtual networks in West US with one or more subnets.

* **AzureFirewallSubnet** - the firewall is in this subnet.
* **Workload-SN** - the workload server is in this subnet. This subnet's network traffic goes through the firewall.

:::image type="content" source="media/tutorial-firewall-deploy-portal/tutorial-network.png" alt-text="Diagram of Firewall network infrastructure." lightbox="media/tutorial-firewall-deploy-portal/tutorial-network.png":::

In this article, you learn how to:

> [!div class="checklist"]
> * Set up a test network environment
> * Deploy a firewall
> * Create a default route
> * Configure an application rule to allow access to www.google.com
> * Configure a network rule to allow access to external DNS servers
 > * Deploy Azure Bastion for secure VM access
> * Test the firewall

> [!NOTE]
> This article uses classic Firewall rules to manage the firewall. The preferred method is to use [Firewall Policy](../firewall-manager/policy-overview.md). To complete this procedure using Firewall Policy, see [Tutorial: Deploy and configure Azure Firewall and policy using the Azure portal](tutorial-firewall-deploy-portal-policy.md)

If you prefer, you can complete this procedure using [Azure PowerShell](deploy-ps.md).

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Set up the network

First, create a resource group to contain the resources needed to deploy the firewall. Then create a virtual network, subnets, and a test server.

### Create a resource group

The resource group contains all the resources used in this procedure.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the Azure portal menu, select **Resource groups** or search for and select *Resource groups* from any page. Then select **Create**.
4. For **Subscription**, select your subscription.
1. For **Resource group** name, type **Test-FW-RG**.
1. For **Region**, select **West US**. All other resources that you create must be in West US.
1. Select **Review + create**.
1. Select **Create**.

### Create a virtual network

This virtual network has two subnets.

> [!NOTE]
> The size of the AzureFirewallSubnet subnet is /26. For more information about the subnet size, see [Azure Firewall FAQ](firewall-faq.yml#why-does-azure-firewall-need-a--26-subnet-size).

1. On the Azure portal menu or from the **Home** page, search for and select **Virtual networks**.
1. Select **Create**.
1. On the **Basics** tab, configure the following settings:

   | Setting | Value |
   |---------|-------|
   | Subscription | Select your subscription |
   | Resource group | **Test-FW-RG** |
   | Virtual network name | **Test-FW-VN** |
   | Region | **West US** |

1. Select **Next**.
1. On the **Security** tab, configure the following settings:

   | Setting | Value |
   |---------|-------|
   | Enable Azure Firewall | Selected |
   | Azure Firewall name | **Test-FW01** |
   | Tier | **Standard** |
   | Policy | **None (Use classic firewall rules)** |
   | Azure Firewall public IP address | Select **Create a public IP address**, type **fw-pip** for the name, and select **OK** |

1. Select **Next**.
1. On the **IP addresses** tab, configure the following settings:

   | Setting | Value |
   |---------|-------|
   | Address space | Accept the default **10.0.0.0/16** |
   | Subnets | Select **default**, change **Name** to **Workload-SN**, and set **Starting address** to **10.0.2.0/24**. Select **Save**. |

1. Select **Review + create**.
1. Select **Create**.

> [!NOTE]
> Azure Firewall uses public IPs as needed based on available ports. After randomly selecting a public IP to connect outbound from, it will only use the next available public IP after no more connections can be made from the current public IP. In scenarios with high traffic volume and throughput, it's recommended to use a NAT Gateway to provide outbound connectivity. SNAT ports are dynamically allocated across all public IPs associated with NAT Gateway. To learn more, see [Scale SNAT ports with Azure NAT Gateway](/azure/firewall/integrate-with-nat-gateway). 

### Create a virtual machine

Now create the workload virtual machine, and place it in the **Workload-SN** subnet.

1. On the Azure portal menu or from the **Home** page, select **Create a resource**.
2. Select **Ubuntu Server 22.04 LTS**.
4. Enter these values for the virtual machine:

   |Setting  |Value  |
   |---------|---------|
   |Resource group     |**Test-FW-RG**|
   |Virtual machine name     |**Srv-Work**|
   |Region     |West US|
   |Image|Ubuntu Server 22.04 LTS - x64 Gen2|
   |Size|Standard_B2s|
   |Authentication type|SSH public key|
   |Username     |**azureuser**|
   |SSH public key source|Generate new key pair|
   |Key pair name|**Srv-Work_key**|

1. On the **Networking** tab, configure the following settings:

   | Setting | Value |
   |---------|-------|
   | Virtual network | **Test-FW-VN** |
   | Subnet | **Workload-SN** |
   | Public IP | **None** |

1. Accept the other defaults and select **Next: Management**.
1. Accept the defaults and select **Next: Monitoring**.
1. For **Boot diagnostics**, select **Disable**. Accept the other defaults and select **Review + create**.
1. Review the settings on the summary page, and then select **Create**.
1. On the **Generate new key pair** dialog, select **Download private key and create resource**. Save the key file as **Srv-Work_key.pem**.
1. After the deployment is complete, select **Go to resource** and note the **Srv-Work** private IP address that you'll need to use later.

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]


## Examine the firewall

1. Go to the resource group and select the firewall.
1. Note the firewall private and public IP addresses. You use these addresses later.

## Create a default route

When you create a route for outbound and inbound connectivity through the firewall, a default route to 0.0.0.0/0 with the virtual appliance private IP as a next hop is sufficient. This directs any outgoing and incoming connections through the firewall. As an example, if the firewall is fulfilling a TCP-handshake and responding to an incoming request, then the response is directed to the IP address who sent the traffic. This is by design. 

As a result, there's no need to create another user defined route to include the AzureFirewallSubnet IP range. This might result in dropped connections. The original default route is sufficient.

For the **Workload-SN** subnet, configure the outbound default route to go through the firewall.

1. On the Azure portal, search for and select **Route tables**.
1. Select **Create**.
1. On the **Basics** tab, configure the following settings:

   | Setting | Value |
   |---------|-------|
   | Subscription | Select your subscription |
   | Resource group | **Test-FW-RG** |
   | Region | **West US** |
   | Name | **Firewall-route** |
   | Propagate gateway routes | Select your preference |

1. Select **Review + create**.
1. Select **Create**.

After deployment completes, select **Go to resource**.

1. On the **Firewall-route** page, select **Settings** > **Subnets** and then select **Associate**.
1. For **Virtual network**, select **Test-FW-VN**.
1. For **Subnet**, select **Workload-SN**. Make sure that you select only the **Workload-SN** subnet for this route, otherwise your firewall won't work correctly.
1. Select **OK**.
1. Select **Routes** and then select **Add**.
1. Configure the route with the following settings:

   | Setting | Value |
   |---------|-------|
   | Route name | **fw-dg** |
   | Destination type | **IP Addresses** |
   | Destination IP addresses/CIDR ranges | **0.0.0.0/0** |
   | Next hop type | **Virtual appliance**. Azure Firewall is actually a managed service, but virtual appliance works in this situation. |
   | Next hop address | The private IP address for the firewall that you noted previously |

1. Select **Add**.

## Configure an application rule

This is the application rule that allows outbound access to `www.google.com`.

1. Open the **Test-FW-RG** resource group and select the **Test-FW01** firewall.
1. On the **Test-FW01** page, under **Settings**, select **Rules (classic)**.
1. Select the **Application rule collection** tab.
1. Select **Add application rule collection**.
1. Configure the rule collection with the following settings:

   | Setting | Value |
   |---------|-------|
   | Name | **App-Coll01** |
   | Priority | **200** |
   | Action | **Allow** |

1. Under **Rules**, **Target FQDNs**, configure the following settings:

   | Setting | Value |
   |---------|-------|
   | Name | **Allow-Google** |
   | Source type | **IP address** |
   | Source | **10.0.2.0/24** |
   | Protocol:port | **http, https** |
   | Target FQDNs | **`www.google.com`** |

1. Select **Add**.

Azure Firewall includes a built-in rule collection for infrastructure FQDNs that are allowed by default. These FQDNs are specific for the platform and can't be used for other purposes. For more information, see [Infrastructure FQDNs](infrastructure-fqdns.md).

## Configure a network rule

This is the network rule that allows outbound access to two IP addresses at port 53 (DNS).

1. Select the **Network rule collection** tab.
1. Select **Add network rule collection**.
1. Configure the rule collection with the following settings:

   | Setting | Value |
   |---------|-------|
   | Name | **Net-Coll01** |
   | Priority | **200** |
   | Action | **Allow** |

1. Under **Rules**, **IP addresses**, configure the following settings:

   | Setting | Value |
   |---------|-------|
   | Name | **Allow-DNS** |
   | Protocol | **UDP** |
   | Source type | **IP address** |
   | Source | **10.0.2.0/24** |
   | Destination type | **IP address** |
   | Destination address | **209.244.0.3,209.244.0.4** (public DNS servers operated by Level3) |
   | Destination Ports | **53** |

1. Select **Add**.

## Deploy Azure Bastion

Now deploy Azure Bastion to provide secure access to the virtual machine.

1. On the Azure portal menu, select **Create a resource**.
1. In the search box, type **Bastion** and select it from the results.
1. Select **Create**.
1. On the **Basics** tab, configure the following settings:

   | Setting | Value |
   |---------|-------|
   | Subscription | Select your subscription |
   | Resource group | **Test-FW-RG** |
   | Name | **Test-Bastion** |
   | Region | **West US** |
   | Tier | **Developer** |
   | Virtual network | **Test-FW-VN** |
   | Subnet | Select **Edit subnet** |

1. In the **Edit subnet** page, configure the following settings:

   | Setting | Value |
   |---------|-------|
   | Starting address | **10.0.4.0/26** |
   | Size | **/26** |

1. Select **Save** and close the subnets page.
1. Select **Review + create**.
1. After validation passes, select **Create**.

> [!NOTE]
> The Bastion deployment takes about 10 minutes to complete. The Developer tier is intended for test and evaluation purposes. For production deployments, review the Azure Bastion SKU options in [Azure Bastion SKU comparison](../bastion/bastion-sku-comparison.md).

### Change the primary and secondary DNS address for the **Srv-Work** network interface

For testing purposes, configure the server's primary and secondary DNS addresses. This isn't a general Azure Firewall requirement.

1. On the Azure portal menu, select **Resource groups** or search for and select *Resource groups* from any page. Select the **Test-FW-RG** resource group.
1. Select the network interface for the **Srv-Work** virtual machine.
1. Under **Settings**, select **DNS servers**.
1. Under **DNS servers**, select **Custom**.
1. Configure the following DNS servers:

   | DNS server | Value |
   |------------|-------|
   | Primary | **209.244.0.3** |
   | Secondary | **209.244.0.4** |

1. Select **Save**.
1. Restart the **Srv-Work** virtual machine.

## Test the firewall

Now, test the firewall to confirm that it works as expected.

1. In the Azure portal, navigate to the **Srv-Work** virtual machine.
1. Select **Connect**, then select **Connect via Bastion**.
1. Select **Use SSH Private Key from Local File**.
1. For **Username**, type **azureuser**.
1. Select the folder icon and browse to the **Srv-Work_key.pem** file you downloaded earlier.
1. Select **Connect**.
1. At the bash prompt, run the following commands to test DNS resolution:

   ```bash
   nslookup www.google.com
   nslookup www.microsoft.com
   ```

   Both commands should return answers, showing that your DNS queries are getting through the firewall.

1. Run the following commands to test the application rule:

   ```bash
   curl https://www.google.com
   curl https://www.microsoft.com
   ```

   The `www.google.com` request should succeed, and you should see the HTML response.
   
   The `www.microsoft.com` request should fail, showing that the firewall is blocking the request.

So now you verified that the firewall rules are working:

* You can connect to the virtual machine using Bastion and SSH.
* You can browse to the one allowed FQDN, but not to any others.
* You can resolve DNS names using the configured external DNS server.

## Clean up resources

You can keep your firewall resources to continue testing, or if no longer needed, delete the **Test-FW-RG** resource group to delete all firewall-related resources.

## Next steps

- [Tutorial: Monitor Azure Firewall logs](./firewall-diagnostics.md)
- [Learn more about Azure network security](../networking/security/index.yml)
