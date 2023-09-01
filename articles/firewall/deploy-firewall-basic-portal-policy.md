---
title: 'Deploy & configure Azure Firewall Basic and policy using the Azure portal'
description: In this how-to, you learn how to deploy and configure Azure Firewall Basic and policy rules using the Azure portal. 
services: firewall
author: vhorne
ms.service: firewall
ms.topic: how-to
ms.date: 09/12/2022
ms.author: victorh
ms.custom: mvc
#Customer intent: As an administrator new to this service, I want to control outbound network access from resources located in an Azure subnet.
---

# Deploy and configure Azure Firewall Basic and policy using the Azure portal

Azure Firewall Basic provides the essential protection SMB customers need at an affordable price point. This solution is recommended for SMB customer environments with less than 250 Mbps throughput requirements. It is recommended to deploy the [Standard SKU](tutorial-firewall-deploy-portal-policy.md) for environments with more than 250 Mbps throughput requirements and the [Premium SKU](premium-portal.md) for advanced threat protection. 

Filtering network and application traffic is an important part of an overall network security plan. For example, you may want to limit access to web sites. Or, you may want to limit the outbound IP addresses and ports that can be accessed.

One way you can control both inbound and outbound network access from an Azure subnet is with Azure Firewall and Firewall Policy. With Azure Firewall and Firewall Policy, you can configure:

* Application rules that define fully qualified domain names (FQDNs) that can be accessed from a subnet.
* Network rules that define source address, protocol, destination port, and destination address.
* DNAT rules to translate and filter inbound Internet traffic to your subnets. 

Network traffic is subjected to the configured firewall rules when you route your network traffic to the firewall as the subnet default gateway.

For this how-to, you create a simplified single VNet with three subnets for easy deployment. Firewall Basic has a mandatory requirement to be configured with a management NIC.

* **AzureFirewallSubnet** - the firewall is in this subnet.
* **AzureFirewallManagementSubnet** - for service management traffic.
* **Workload-SN** - the workload server is in this subnet. This subnet's network traffic goes through the firewall.

> [!NOTE]
> As the Azure Firewall Basic has limited traffic compared to the Azure Firewall Standard or Premium SKU, it requires the **AzureFirewallManagementSubnet** to separate customer traffic from Microsoft management traffic to ensure no disruptions on it. This management traffic is needed for updates and health metrics communication that occurs automatically to and from Microsoft only. No other connections are allowed on this IP.

For production deployments, a [hub and spoke model](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) is recommended, where the firewall is in its own VNet. The workload servers are in peered VNets in the same region with one or more subnets.

In this how-to, you learn how to:

> [!div class="checklist"]
> * Set up a test network environment
> * Deploy a basic firewall and basic firewall policy
> * Create a default route
> * Configure an application rule to allow access to www.google.com
> * Configure a network rule to allow access to external DNS servers
> * Configure a NAT rule to allow a remote desktop to the test server
> * Test the firewall

If you prefer, you can complete this procedure using [Azure PowerShell](deploy-ps-policy.md).

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a resource group

The resource group contains all the resources for the how-to.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the Azure portal menu, select **Resource groups** or search for and select *Resource groups* from any page. Then select **Create**.
4. For **Subscription**, select your subscription.
1. For **Resource group name**, enter *Test-FW-RG*.
1. For **Region**, select a region. All other resources that you create must be in the same region.
1. Select **Review + create**.
1. Select **Create**.

## Deploy the firewall and policy

Deploy the firewall and create associated network infrastructure.

1. On the Azure portal menu or from the **Home** page, select **Create a resource**.
2. Type **firewall** in the search box and press **Enter**.
3. Select **Firewall** and then select **Create**.
4. On the **Create a Firewall** page, use the following table to configure the firewall:

   |Setting  |Value  |
   |---------|---------|
   |Subscription     |\<your subscription\>|
   |Resource group     |**Test-FW-RG** |
   |Name     |**Test-FW01**|
   |Region     |Select the same location that you used previously|
   |Firewall Tier|**Basic**|
   |Firewall management|**Use a Firewall Policy to manage this firewall**|
   |Firewall policy|**Add new**:<br>**fw-test-pol**<br>Your selected region<br>Policy tier should default to **Basic** 
   |Choose a virtual network     |**Create new**<br> Name: **Test-FW-VN**<br>Address space: **10.0.0.0/16**<br>Subnet address space: **10.0.0.0/26**|
   |Public IP address     |**Add new**:<br>**Name**:  **fw-pip**|
   |Management - Subnet address space| **10.0.1.0/26**|
   |Management public IP address| **Add new**<br>**fw-mgmt-pip**

5. Accept the other default values, then select **Review + create**.
6. Review the summary, and then select **Create** to create the firewall.

   This will take a few minutes to deploy.
7. After deployment completes, go to the **Test-FW-RG** resource group, and select the **Test-FW01** firewall.
8. Note the firewall private and public IP (fw-pip) addresses. You'll use these addresses later.

## Create a subnet for the workload server

Next, create a subnet for the workload server.

1. Go to the Test-FW-RG resource group and select the **Test-FW-VN** virtual network.
1. Select **Subnets**.
1. Select **Subnet**.
1. For **Subnet name**, type **Workload-SN**.
1. For **Subnet address range**, type **10.0.2.0/24**.
1. Select **Save**.

## Create a virtual machine

Now create the workload virtual machine, and place it in the **Workload-SN** subnet.

1. On the Azure portal menu or from the **Home** page, select **Create a resource**.
2. Select **Windows Server 2019 Datacenter**.
4. Enter these values for the virtual machine:

   |Setting  |Value  |
   |---------|---------|
   |Resource group     |**Test-FW-RG**|
   |Virtual machine name     |**Srv-Work**|
   |Region     |Same as previous|
   |Image|Windows Server 2019 Datacenter|
   |Administrator user name     |Type a user name|
   |Password     |Type a password|

4. Under **Inbound port rules**, **Public inbound ports**, select **None**.
6. Accept the other defaults and select **Next: Disks**.
7. Accept the disk defaults and select **Next: Networking**.
8. Make sure that **Test-FW-VN** is selected for the virtual network and the subnet is **Workload-SN**.
9. For **Public IP**, select **None**.
11. Accept the other defaults and select **Next: Management**.
1. Select **Next: Monitoring**.
1. Select **Disable** to disable boot diagnostics. Accept the other defaults and select **Review + create**.
1. Review the settings on the summary page, and then select **Create**.
1. After the deployment completes, select the **Srv-Work** resource and note the private IP address for later use.

## Create a default route

For the **Workload-SN** subnet, configure the outbound default route to go through the firewall.

1. On the Azure portal menu, select **All services** or search for and select *All services* from any page.
2. Under **Networking**, select **Route tables**.
3. Select **Create**.
5. For **Subscription**, select your subscription.
6. For **Resource group**, select **Test-FW-RG**.
7. For **Region**, select the same location that you used previously.
4. For **Name**, type **Firewall-route**.
1. Select **Review + create**.
1. Select **Create**.

After deployment completes, select **Go to resource**.

1. On the Firewall-route page, select **Subnets** and then select **Associate**.
1. Select **Virtual network** > **Test-FW-VN**.
1. For **Subnet**, select **Workload-SN**. Make sure that you select only the **Workload-SN** subnet for this route, otherwise your firewall won't work correctly.

13. Select **OK**.
14. Select **Routes** and then select **Add**.
15. For **Route name**, type **fw-dg**.
1. For **Address prefix destination**, select **IP Addresses**.
1. For **Destination IP addresses/CIDR ranges**, type **0.0.0.0/0**.
1. For **Next hop type**, select **Virtual appliance**.

    Azure Firewall is actually a managed service, but virtual appliance works in this situation.
18. For **Next hop address**, type the private IP address for the firewall that you noted previously.
19. Select **Add**.

## Configure an application rule

This is the application rule that allows outbound access to `www.google.com`.

1. Open the **Test-FW-RG**, and select the **fw-test-pol** firewall policy.
1. Select **Application rules**.
1. Select **Add a rule collection**.
1. For **Name**, type **App-Coll01**.
1. For **Priority**, type **200**.
1. For **Rule collection action**, select **Allow**.
1. Under **Rules**, for **Name**, type **Allow-Google**.
1. For **Source type**, select **IP address**.
1. For **Source**, type **10.0.2.0/24**.
1. For **Protocol:port**, type **http, https**.
1. For **Destination Type**, select **FQDN**.
1. For **Destination**, type **`www.google.com`**
1. Select **Add**.

Azure Firewall includes a built-in rule collection for infrastructure FQDNs that are allowed by default. These FQDNs are specific for the platform and can't be used for other purposes. For more information, see [Infrastructure FQDNs](infrastructure-fqdns.md).

## Configure a network rule

This is the network rule that allows outbound access to two IP addresses at port 53 (DNS).

1. Select **Network rules**.
2. Select **Add a rule collection**.
3. For **Name**, type **Net-Coll01**.
4. For **Priority**, type **200**.
5. For **Rule collection action**, select **Allow**.
1. For **Rule collection group**, select **DefaultNetworkRuleCollectionGroup**.
1. Under **Rules**, for **Name**, type **Allow-DNS**.
1. For **Source type**, select **IP Address**.
1. For **Source**, type **10.0.2.0/24**.
1. For **Protocol**, select **UDP**.
1. For **Destination Ports**, type **53**.
1. For **Destination type** select **IP address**.
1. For **Destination**, type **209.244.0.3,209.244.0.4**.<br>These are public DNS servers operated by Level3.
2. Select **Add**.

## Configure a DNAT rule

This rule allows you to connect a remote desktop to the Srv-Work virtual machine through the firewall.

1. Select the **DNAT rules**.
2. Select **Add a rule collection**.
3. For **Name**, type **rdp**.
1. For **Priority**, type **200**.
1. For **Rule collection group**, select **DefaultDnatRuleCollectionGroup**.
1. Under **Rules**, for **Name**, type **rdp-nat**.
1. For **Source type**, select **IP address**.
1. For **Source**, type **\***.
1. For **Protocol**, select **TCP**.
1. For **Destination Ports**, type **3389**.
1. For **Destination Type**, select **IP Address**.
1. For **Destination**, type the firewall public IP address (fw-pip).
1. For **Translated address**, type the **Srv-work** private IP address.
1. For **Translated port**, type **3389**.
1. Select **Add**.


### Change the primary and secondary DNS address for the **Srv-Work** network interface

For testing purposes in this how-to, configure the server's primary and secondary DNS addresses. This isn't a general Azure Firewall requirement.

1. On the Azure portal menu, select **Resource groups** or search for and select *Resource groups* from any page. Select the **Test-FW-RG** resource group.
2. Select the network interface for the **Srv-Work** virtual machine.
3. Under **Settings**, select **DNS servers**.
4. Under **DNS servers**, select **Custom**.
5. Type **209.244.0.3** in the **Add DNS server** text box, and **209.244.0.4** in the next text box.
6. Select **Save**.
7. Restart the **Srv-Work** virtual machine.

## Test the firewall

Now, test the firewall to confirm that it works as expected.

1. Connect a remote desktop to firewall public IP address (fw-pip) and sign in to the **Srv-Work** virtual machine. 
3. Open Internet Explorer and browse to `https://www.google.com`.
4. Select **OK** > **Close** on the Internet Explorer security alerts.

   You should see the Google home page.

5. Browse to `http://www.microsoft.com`.

   You should be blocked by the firewall.

So now you've verified that the firewall rules are working:

* You can connect a remote desktop to the Srv-Work virtual machine.
* You can browse to the one allowed FQDN, but not to any others.
* You can resolve DNS names using the configured external DNS server.

## Clean up resources

You can keep your firewall resources for further testing, or if no longer needed, delete the **Test-FW-RG** resource group to delete all firewall-related resources.

## Next steps

> [!div class="nextstepaction"]
> [Deploy and configure Azure Firewall Premium](premium-deploy.md)
