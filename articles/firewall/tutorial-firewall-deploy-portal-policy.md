---
title: 'Tutorial: Deploy & configure Azure Firewall and policy using the Azure portal'
description: In this tutorial, you learn how to deploy and configure Azure Firewall and policy rules using the Azure portal. 
services: firewall
author: duongau
ms.service: azure-firewall
ms.topic: tutorial
ms.date: 06/06/2024
ms.author: duau
ms.custom: template-tutorial, mvc, engagement-fy23
#Customer intent: As an administrator new to this service, I want to control outbound network access from resources located in an Azure subnet.
# Customer intent: "As a network administrator, I want to deploy and configure Azure Firewall with policy rules, so that I can manage and control outbound network access from resources within an Azure subnet effectively."
---

# Tutorial: Deploy and configure Azure Firewall and policy using the Azure portal

Controlling outbound network access is an important part of an overall network security plan. For example, you may want to limit access to web sites. Or, you may want to limit the outbound IP addresses and ports that can be accessed.

One way you can control outbound network access from an Azure subnet is with Azure Firewall and Firewall Policy. With Azure Firewall and Firewall Policy, you can configure:

* Application rules that define fully qualified domain names (FQDNs) that can be accessed from a subnet.
* Network rules that define source address, protocol, destination port, and destination address.

Network traffic is subjected to the configured firewall rules when you route your network traffic to the firewall as the subnet default gateway.

For this tutorial, you create a simplified single VNet with two subnets for easy deployment.

* **AzureFirewallSubnet** - the firewall is in this subnet.
* **Workload-SN** - the workload server is in this subnet. This subnet's network traffic goes through the firewall.

:::image type="content" source="media/tutorial-firewall-deploy-portal/tutorial-network.png" alt-text="Diagram of Firewall network infrastructure." lightbox="media/tutorial-firewall-deploy-portal/tutorial-network.png":::

For production deployments, a [hub and spoke model](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) is recommended, where the firewall is in its own VNet. The workload servers are in peered VNets in the same region with one or more subnets.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up a test network environment
> * Deploy a firewall and firewall policy
> * Create a default route
> * Configure an application rule to allow access to www.google.com
> * Configure a network rule to allow access to external DNS servers
> * Configure a NAT rule to allow inbound HTTP access to the test server
> * Test the firewall

If you prefer, you can complete this procedure using [Azure PowerShell](deploy-ps-policy.md).

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Set up the network

First, create a resource group to contain the resources needed to deploy the firewall. Then create a VNet, subnets, and a test server.

### Create a resource group

The resource group contains all the resources for the tutorial.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the Azure portal menu, select **Resource groups** or search for and select *Resource groups* from any page, then select **Create**. Enter or select the following values:

    | Setting  | Value  |
    | -------- | ------ |
    | Subscription  | Select your Azure subscription. |
    | Resource group | Enter **Test-FW-RG**. |
    | Region | Select a region. All other resources that you create must be in the same region. |
 
1. Select **Review + create**.
1. Select **Create**.

### Create a VNet

This VNet has two subnets.

> [!NOTE]
> The size of the AzureFirewallSubnet subnet is /26. For more information about the subnet size, see [Azure Firewall FAQ](firewall-faq.yml#why-does-azure-firewall-need-a--26-subnet-size).

1. On the Azure portal menu or from the **Home** page, select **Create a resource**.
1. Select **Networking**.
1. Search for **Virtual network** and select **Create**.
1. Enter or select the following values:

    | Setting  | Value  |
    | -------- | ------ |
    | Subscription  | Select your Azure subscription. |
    | Resource group | Select **Test-FW-RG**. |
    | Name | Enter **Test-FW-VN**. |
    | Region | Select the same location that you used previously. |

1. Select **Next**.
1. On the **Security** tab, select **Next**.
1. For **IPv4 Address space**, accept the default **10.0.0.0/16**.
1. Under **Subnets**, select **default**.
1. On the **Edit subnet** page, for **Subnet purpose**, select **Azure Firewall**.

   The firewall is in this subnet, and the subnet name **must** be AzureFirewallSubnet.
1. For **Starting address**, type **10.0.1.0**.
1. Select **Save**.

Next, create a subnet for the workload server.

1. Select **Add subnet**.
1. For **Subnet name**, type **Workload-SN**.
1. For **Starting address**, type **10.0.2.0/24**.
1. Select **Add**.
1. Select **Review + create**.
1. Select **Create**.

## Deploy Azure Bastion

Deploy Azure Bastion Developer edition to securely connect to the **Srv-Work** virtual machine for testing.

1. In the search box at the top of the portal, enter **Bastion**.  Select **Bastions** from the search results.
1. Select **Create**.
1. On the **Create a Bastion** page, enter or select the following values:

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

1. Select **Review + create**.
1. Review the settings and select **Create**.

   The deployment takes a few minutes to complete.

### Create a virtual machine

Now create the workload virtual machine, and place it in the **Workload-SN** subnet.

1. In the search box at the top of the portal enter **Virtual machine**, select **Virtual machines** in the search results.
1. Select **Create** > **Virtual machine**.
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

1. Under **Inbound port rules**, **Public inbound ports**, select **None**.
1. Accept the other defaults and select **Next: Disks**.
1. Accept the disk defaults and select **Next: Networking**.
1. Make sure that **Test-FW-VN** is selected for the virtual network and the subnet is **Workload-SN**.
1. For **Public IP**, select **None**.
1. Select **Review + create**.
1. Review the settings on the summary page, and then select **Create**.
1. When prompted, select **Download private key and create resource**. Save the private key file to your computer.
1. After the deployment completes, select the **Srv-Work** resource and note the private IP address for later use.

### Install a web server

Connect to the virtual machine and install a web server for testing.

1. On the Azure portal menu, select **Resource groups** or search for and select *Resource groups* from any page. Select the **Test-FW-RG** resource group.
1. Select the **Srv-Work** virtual machine.
1. Select **Operations** > **Run command** > **RunShellScript**.
1. In the script box, enter the following commands:

   ```bash
   sudo apt-get update
   sudo apt-get install -y nginx
   echo "<html><body><h1>Azure Firewall DNAT Test</h1><p>If you can see this page, the DNAT rule is working correctly!</p></body></html>" | sudo tee /var/www/html/index.html
   ```

1. Select **Run**.
1. Wait for the script to complete successfully.

## Deploy the firewall and policy

Deploy the firewall into the VNet.

1. On the Azure portal menu or from the **Home** page, select **Create a resource**.
2. Type **firewall** in the search box and press **Enter**.
3. Select **Firewall** and then select **Create**.
4. On the **Create a Firewall** page, use the following table to configure the firewall:

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

1. Clear the **Enable Firewall Management NIC** check box.
5. Accept the other default values, then select **Next: Tags**.
1. Select **Next : Review + create**.
1. Review the summary, and then select **Create** to create the firewall.

   This takes a few minutes to deploy.
7. After deployment completes, go to the **Test-FW-RG** resource group, and select the **Test-FW01** firewall.
8. Note the firewall private and public IP addresses. You use these addresses later.

## Create a default route

For the **Workload-SN** subnet, configure the outbound default route to go through the firewall.

1. On the Azure portal menu, select **All services** or search for and select *All services* from any page.
1. Under **Networking**, select **Route tables**.
1. Select **Create**, then enter or select the following values:

   | Setting | Value |
   | ------- | ----- |
   | **Project details** | |
   | Subscription | Select your Azure subscription. |
   | Resource group | Select **Test-FW-RG**. |
   | **Instance details** | |
   | Name  | Enter **Firewall-route**. |
   | Region  | Select the same location that you used previously. |

1. Select **Review + create**.
1. Select **Create**.

After deployment completes, select **Go to resource**.

1. On the **Firewall-route** page, under **Settings**, select **Subnets** and then select **Associate**.
1. For **Virtual network** select **Test-FW-VN**.
1. For **Subnet**, select **Workload-SN**. 
1. Select **OK**.
1. Select **Routes** and then select **Add**.
1. For **Route name**, enter **fw-dg**.
1. For **Destination type** select **IP Addresses**.
1. For **Destination IP addresses/CIDR ranges prefix**, enter **0.0.0.0/0**.
1. For **Next hop type**, select **Virtual appliance**.
    
   Azure Firewall is actually a managed service, but virtual appliance works in this situation.
1. For **Next hop address**, enter the private IP address for the firewall that you noted previously.
1. Select **Add**.

## Configure an application rule

This is the application rule that allows outbound access to `www.google.com`.

1. Open the **Test-FW-RG** resource group, and select the **fw-test-pol** firewall policy.
1. Under **Settings** > **Rules**, Select **Application rules**.
1. Select **Add a rule collection**.
1. For **Name**, enter **App-Coll01**.
1. For **Priority**, enter **200**.
1. For **Rule collection action**, select **Allow**.
1. Under **Rules**, for **Name**, enter **Allow-Google**.
1. For **Source type**, select **IP address**.
1. For **Source**, enter **10.0.2.0/24**.
1. For **Protocol:port**, enter **http, https**.
1. For **Destination Type**, select **FQDN**.
1. For **Destination**, enter *`www.google.com`*
1. Select **Add**.

Azure Firewall includes a built-in rule collection for infrastructure FQDNs that are allowed by default. These FQDNs are specific for the platform and can't be used for other purposes. For more information, see [Infrastructure FQDNs](infrastructure-fqdns.md).

Wait for the application rule deployment to complete before creating the network rule in the next steps.

## Configure a network rule

This is the network rule that allows outbound access to two IP addresses at port 53 (DNS).

1. Select **Network rules**.
2. Select **Add a rule collection**.
3. For **Name**, enter **Net-Coll01**.
4. For **Priority**, enter **200**.
5. For **Rule collection action**, select **Allow**.
1. For **Rule collection group**, select **DefaultNetworkRuleCollectionGroup**.
1. Under **Rules**, for **Name**, enter **Allow-DNS**.
1. For **Source type**, select **IP Address**.
1. For **Source**, enter **10.0.2.0/24**.
1. For **Protocol**, select **UDP**.
1. For **Destination Ports**, enter **53**.
1. For **Destination type** select **IP address**.
1. For **Destination**, enter **209.244.0.3,209.244.0.4**.<br>These are public DNS servers operated by CenturyLink.
1. Select **Add**.

Wait for the network rule deployment to complete before creating the DNAT rule in the next steps.

## Configure a DNAT rule

This rule allows you to connect to the web server on the **Srv-Work** virtual machine through the firewall.

1. Select the **DNAT rules**.
2. Select **Add a rule collection**.
3. For **Name**, enter **HTTP**.
1. For **Priority**, enter **200**.
1. For **Rule collection group**, select **DefaultDnatRuleCollectionGroup**.
1. Under **Rules**, for **Name**, enter **http-nat**.
1. For **Source type**, select **IP address**.
1. For **Source**, enter *\**.
1. For **Protocol**, select **TCP**.
1. For **Destination Ports**, enter **80**.
1. For **Destination**, enter the firewall public IP address.
1. For **Translated type**, select **IP Address**.
1. For **Translated address**, enter the **Srv-work** private IP address.
1. For **Translated port**, enter **80**.
1. Select **Add**.


### Change the primary and secondary DNS address for the **Srv-Work** network interface

For testing purposes in this tutorial, configure the server's primary and secondary DNS addresses. This isn't a general Azure Firewall requirement.

1. On the Azure portal menu, select **Resource groups** or search for and select *Resource groups* from any page. Select the **Test-FW-RG** resource group.
2. Select the network interface for the **Srv-Work** virtual machine.
3. Under **Settings**, select **DNS servers**.
4. Under **DNS servers**, select **Custom**.
5. Enter **209.244.0.3** in the **Add DNS server** text box, and **209.244.0.4** in the next text box.
6. Select **Save**.
7. Restart the **Srv-Work** virtual machine.

## Test the firewall

Now, test the firewall to confirm that it works as expected.

### Test the DNAT rule

1. Open a web browser on your local computer.
1. In the address bar, enter `http://<firewall-public-ip-address>`, where `<firewall-public-ip-address>` is the public IP address of the firewall you noted earlier.
1. You should see the custom web page: **Azure Firewall DNAT Test**. This confirms that the DNAT rule is working and traffic is being forwarded to the **Srv-Work** virtual machine.

### Test the application and network rules

Use Azure Bastion to securely connect to the **Srv-Work** virtual machine and test the firewall rules.

1. On the Azure portal menu, select **Resource groups** or search for and select *Resource groups* from any page. Select the **Test-FW-RG** resource group.
1. Select the **Srv-Work** virtual machine.
1. Select **Connect** > **Connect via Bastion**.
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

   You should see a successful HTTP response (200 OK), indicating that the application rule is allowing access to Google.

1. Now test access to Microsoft, which should be blocked. Enter:

   ```bash
   curl -I https://www.microsoft.com
   ```

   The command should time out or fail after approximately 60 seconds, indicating that the firewall is blocking access.

So now you've verified that the firewall rules are working:

* You can access the web server through the DNAT rule.
* You can browse to the one allowed FQDN, but not to any others.
* You can resolve DNS names using the configured external DNS server.

## Clean up resources

You can keep your firewall resources for the next tutorial, or if no longer needed, delete the **Test-FW-RG** resource group to delete all firewall-related resources.

## Next steps

> [!div class="nextstepaction"]
> [Deploy and configure Azure Firewall Premium](premium-deploy.md)
