---
title: 'Tutorial: Deploy and configure Azure Firewall and policy using the Azure portal'
description: Deploy and configure Azure Firewall and policy rules by using the Azure portal.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: tutorial
ms.date: 03/28/2026
ms.custom: template-tutorial, mvc, engagement-fy23
# Customer intent: "As a network administrator, I want to deploy and configure Azure Firewall with policy rules, so that I can manage and control outbound network access from resources within an Azure subnet effectively."
---

# Tutorial: Deploy and configure Azure Firewall and policy by using the Azure portal

Controlling outbound network access is an important part of an overall network security plan. For example, you might want to limit access to websites. Or, you might want to limit the outbound IP addresses and ports that can be accessed.

You can control outbound network access from an Azure subnet by using Azure Firewall and Firewall Policy. By using Azure Firewall and Firewall Policy, you can configure:

- Application rules that define fully qualified domain names (FQDNs) that can be accessed from a subnet.
- Network rules that define source address, protocol, destination port, and destination address.

Network traffic is subjected to the configured firewall rules when you route your network traffic to the firewall as the subnet default gateway.

For this tutorial, you create a simplified single virtual network (VNet) with two subnets for easy deployment.

- **AzureFirewallSubnet** - the firewall is in this subnet.
- **Workload-SN** - the workload server is in this subnet. This subnet's network traffic goes through the firewall.

:::image type="content" source="media/tutorial-firewall-deploy-portal/tutorial-network.png" alt-text="Diagram that shows a firewall network infrastructure." lightbox="media/tutorial-firewall-deploy-portal/tutorial-network.png":::

For production deployments, use a [hub and spoke model](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke), where the firewall is in its own VNet. The workload servers are in peered VNets in the same region with one or more subnets.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up a test network environment
> * Deploy a firewall and firewall policy
> * Create a default route
> * Configure an application rule to allow access to www.google.com
> * Configure a network rule to allow access to external DNS servers
> * Configure a NAT rule to allow inbound HTTP access to the test server
> * Test the firewall

If you prefer, you can complete this procedure by using [Azure PowerShell](deploy-ps-policy.md).

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Set up the network

First, create a resource group to contain the resources needed to deploy the firewall. Then create a virtual network, subnets, and a test server.

### Create a resource group

The resource group contains all the resources for the tutorial.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the Azure portal menu, select **Resource groups** or search for and select *Resource groups* from any page, and then select **Create**. Enter or select the following values:

    | Setting  | Value  |
    | -------- | ------ |
    | Subscription  | Select your Azure subscription. |
    | Resource group | Enter **Test-FW-RG**. |
    | Region | Select a region. All other resources that you create must be in the same region. |

1. Select **Review + create** > **Create**.

### Create a VNet

This VNet has two subnets.

> [!NOTE]
> The size of the AzureFirewallSubnet subnet is /26. For more information about the subnet size, see [Azure Firewall FAQ](firewall-faq.yml#why-does-azure-firewall-need-a--26-subnet-size).

1. On the Azure portal menu or from **Home**, select **Create a resource**, search for **Virtual network**, and select **Create**.
1. Enter or select the following values:

    | Setting  | Value  |
    | -------- | ------ |
    | Subscription  | Select your Azure subscription. |
    | Resource group | Select **Test-FW-RG**. |
    | Name | Enter **Test-FW-VN**. |
    | Region | Select the same location that you used previously. |

1. Select **Next** twice to get to the **IP addresses** tab.
1. For **IPv4 Address space**, accept the default **10.0.0.0/16**.
1. Under **Subnets**, select **default**. On the **Edit subnet** pane, set **Subnet purpose** to **Azure Firewall**.

   The firewall is in this subnet, and the subnet name **must** be AzureFirewallSubnet.

1. For **Starting address**, type **10.0.1.0**, then select **Save**.
1. Select **Add subnet** and enter the following values, then select **Add**:

   | Setting | Value |
   | ------- | ----- |
   | Subnet name | **Workload-SN** |
   | Starting address | **10.0.2.0/24** |

1. Select **Review + create** > **Create**.

## Deploy Azure Bastion

Deploy Azure Bastion Developer edition to securely connect to the **Srv-Work** virtual machine for testing.

1. In the search box at the top of the portal, enter **Bastion** and select **Bastions** from the results. Select **Create** and enter the following values:

   | Setting | Value |
   | ------- | ----- |
   | **Project details** | |
   | Subscription | Select your Azure subscription. |
   | Resource group | Select **Test-FW-RG**. |
   | **Instance details** | |
   | Name | Enter **Test-Bastion**. |
   | Region | Select the same location that you used previously. |
   | Tier | Select **Developer**. |
   | Virtual network | Select **Test-FW-VN**. |
   | Subnet | The **AzureBastionSubnet** is created automatically with address space **10.0.0.0/26**. |

1. Select **Review + create** > **Create**.

   The deployment takes a few minutes to complete.

### Create a virtual machine

Create the workload virtual machine and place it in the **Workload-SN** subnet.

1. In the search box at the top of the portal, enter **Virtual machine**, select **Virtual machines**, then select **Create** > **Virtual machine**.
1. Enter or select these values for the virtual machine:

   | Setting | Value |
   | ------- | ----- |
   | **Project details** | |
   | Subscription  | Select your Azure subscription. |
   | Resource group     | Select **Test-FW-RG**. |
   | **Instance details** | |
   | Virtual machine name     | Enter **Srv-Work**.|
   | Region     | Select the same location that you used previously. |
   | Availability options | Select **No infrastructure redundancy required**. |
   | Security type | Select **Standard**. |
   | Image | Select **Ubuntu Server 24.04 LTS -x64 Gen2** |
   | Size | Select a size for the virtual machine. |
   | **Administrator account** | |
   | Username | Enter **azureuser**. |
   | SSH public key source | Select **Generate new key pair**. |
   | Key pair name | Enter **Srv-Work_key**. |

1. Under **Inbound port rules**, set **Public inbound ports** to **None**.
1. Accept the other defaults, and on the **Networking** tab, make sure **Test-FW-VN** / **Workload-SN** is selected and **Public IP** is **None**.
1. Select **Review + create** > **Create**. When prompted, select **Download private key and create resource** and save the key file.
1. After deployment finishes, note the **Srv-Work** private IP address for later use.

### Install a web server

Connect to the virtual machine and install a web server for testing.

1. In the **Test-FW-RG** resource group, select the **Srv-Work** virtual machine.
1. Select **Operations** > **Run command** > **RunShellScript**, enter the following commands, then select **Run**:

   ```bash
   sudo apt-get update
   sudo apt-get install -y nginx
   echo "<html><body><h1>Azure Firewall DNAT Test</h1><p>If you can see this page, the DNAT rule is working correctly!</p></body></html>" | sudo tee /var/www/html/index.html
   ```

1. Wait for the script to complete successfully.

## Deploy the firewall and policy

Deploy the firewall into the virtual network.

1. On the Azure portal menu or from **Home**, select **Create a resource**, search for **Firewall**, and select **Create**.
1. On **Create a Firewall**, use the following table to configure the firewall:

   | Setting | Value |
   | ------- | ----- |
   | **Project details** | |
   | Subscription  | Select your Azure subscription. |
   | Resource group     | Select **Test-FW-RG**. |
   | **Instance details** | |
   | Name     | Enter **Test-FW01**. |
   | Region     | Select the same location that you used previously. |
   | Firewall SKU | Select **Standard**. |
   | Firewall management | Select **Use a Firewall Policy to manage this firewall**. |
   | Firewall policy | Select **Add new**, and enter **fw-test-pol**. <br> Select the same region that you used previously. Select **OK**. |
   | Choose a virtual network | Select **Use existing**, and then select **Test-FW-VN**. **Ignore the warning about the Force Tunneling. The warning is resolved in a later step**.|
   | Public IP address     | Select **Add new**, and enter **fw-pip** for the **Name**. Select **OK**. |

1. Clear the **Enable Firewall Management NIC** check box, accept the other default values, and then select **Review + create** > **Create**.

   This process takes a few minutes to deploy.

1. After deployment finishes, go to **Test-FW-RG**, select the **Test-FW01** firewall, and note the private and public IP addresses for later use.

## Create a default route

For the **Workload-SN** subnet, configure the outbound default route to go through the firewall.

1. Search for and select **Route tables**, select **Create**, and enter the following values:

   | Setting | Value |
   | ------- | ----- |
   | **Project details** | |
   | Subscription | Select your Azure subscription. |
   | Resource group | Select **Test-FW-RG**. |
   | **Instance details** | |
   | Name  | Enter **Firewall-route**. |
   | Region  | Select the same location that you used previously. |

1. Select **Review + create** > **Create**.

After deployment finishes, select **Go to resource**.

1. On the **Firewall-route** pane, under **Settings**, select **Subnets** > **Associate**.
1. For **Virtual network**, select **Test-FW-VN**, and for **Subnet**, select **Workload-SN**. Select **OK**.
1. Select **Routes** > **Add**, and enter the following values:

   | Setting | Value |
   | ------- | ----- |
   | Route name | **fw-dg** |
   | Destination type | **IP Addresses** |
   | Destination IP addresses/CIDR ranges prefix | **0.0.0.0/0** |
   | Next hop type | **Virtual appliance** |
   | Next hop address | The private IP address for the firewall that you noted previously |

   > [!NOTE]
   > Azure Firewall is actually a managed service, but virtual appliance works in this situation.

1. Select **Add**.

## Configure an application rule

This application rule grants outbound access to `www.google.com`.

1. Open the **Test-FW-RG** resource group, and select the **fw-test-pol** firewall policy.
1. Under **Settings** > **Rules**, select **Application rules** > **Add a rule collection**.
1. Enter the following values:

   | Setting | Value |
   | ------- | ----- |
   | Name | **App-Coll01** |
   | Priority | **200** |
   | Rule collection action | **Allow** |
   | **Rules** | |
   | Name | **Allow-Google** |
   | Source type | **IP address** |
   | Source | **10.0.2.0/24** |
   | Protocol:port | **http, https** |
   | Destination Type | **FQDN** |
   | Destination | **`www.google.com`** |

1. Select **Add**.

Azure Firewall includes a built-in rule collection for infrastructure FQDNs that are allowed by default. These FQDNs are specific to the platform and can't be used for other purposes. For more information, see [Infrastructure FQDNs](rule-processing.md#infrastructure-rule-collection).

Wait for the application rule deployment to complete before continuing.

## Configure a network rule

This network rule grants outbound access to two IP addresses at port 53 (DNS).

1. Select **Network rules** > **Add a rule collection**.
1. Enter the following values:

   | Setting | Value |
   | ------- | ----- |
   | Name | **Net-Coll01** |
   | Priority | **200** |
   | Rule collection action | **Allow** |
   | Rule collection group | **DefaultNetworkRuleCollectionGroup** |
   | **Rules** | |
   | Name | **Allow-DNS** |
   | Source type | **IP Address** |
   | Source | **10.0.2.0/24** |
   | Protocol | **UDP** |
   | Destination Ports | **53** |
   | Destination type | **IP address** |
   | Destination | **209.244.0.3,209.244.0.4** (public DNS servers operated by CenturyLink) |

1. Select **Add**.

Wait for the network rule deployment to complete before continuing.

## Configure a DNAT rule

This rule connects to the web server on the **Srv-Work** virtual machine through the firewall.

1. Select **DNAT rules** > **Add a rule collection**.
1. Enter the following values:

   | Setting | Value |
   | ------- | ----- |
   | Name | **HTTP** |
   | Priority | **200** |
   | Rule collection group | **DefaultDnatRuleCollectionGroup** |
   | **Rules** | |
   | Name | **http-nat** |
   | Source type | **IP address** |
   | Source | **\*** |
   | Protocol | **TCP** |
   | Destination Ports | **80** |
   | Destination | The firewall public IP address |
   | Translated type | **IP Address** |
   | Translated address | The **Srv-Work** private IP address |
   | Translated port | **80** |

1. Select **Add**.

### Change the primary and secondary DNS address for the **Srv-Work** network interface

For testing purposes in this tutorial, configure the server's primary and secondary DNS addresses. This configuration isn't a general Azure Firewall requirement.

1. In the **Test-FW-RG** resource group, select the network interface for the **Srv-Work** virtual machine.
1. Under **Settings**, select **DNS servers** > **Custom**.
1. Enter **209.244.0.3** and **209.244.0.4** as the DNS servers, then select **Save**.
1. Restart the **Srv-Work** virtual machine.

## Test the firewall

Now, test the firewall to confirm that it works as expected.

### Test the DNAT rule

1. In a web browser on your local computer, enter `http://<firewall-public-ip-address>`.
1. You see the custom web page: **Azure Firewall DNAT Test**. This confirms that the DNAT rule is working.

### Test the application and network rules

Use Azure Bastion to securely connect to the **Srv-Work** virtual machine and test the firewall rules.

1. In the **Test-FW-RG** resource group, select the **Srv-Work** virtual machine, then select **Connect** > **Connect via Bastion**.
1. On the Bastion page, enter or select the following values:

   | Setting | Value |
   | ------- | ----- |
   | Authentication Type | Select **SSH Private Key from Local File**. |
   | Username | Enter **azureuser**. |
   | Local File | Select **Browse** and select the **Srv-Work_key.pem** file that you downloaded during VM creation. |

1. Select **Connect**.

   A new browser tab opens with an SSH session to the **Srv-Work** virtual machine.

1. In the SSH session, enter the following command to test access to Google:

   ```bash
   curl -I https://www.google.com
   ```

   You see a successful HTTP response (200 OK), indicating that the application rule is allowing access to Google.

1. Now test access to Microsoft, which should be blocked. Enter:

   ```bash
   curl -I https://www.microsoft.com
   ```

   The command times out or fails after approximately 60 seconds, indicating that the firewall is blocking access.

Now you verified that the firewall rules are working:

- You can access the web server through the DNAT rule.
- You can browse to the one allowed FQDN, but not to any others.
- You can resolve DNS names by using the configured external DNS server.

## Clean up resources

You can keep your firewall resources for the next tutorial. If you no longer need them, delete the **Test-FW-RG** resource group to delete all firewall-related resources.

## Next steps

> [!div class="nextstepaction"]
> [Deploy and configure Azure Firewall Premium](premium-deploy.md)
