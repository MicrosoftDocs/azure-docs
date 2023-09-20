---
title: Deploy & configure Azure Firewall using the Azure portal
description: In this article, you learn how to deploy and configure Azure Firewall using the Azure portal. 
services: firewall
author: vhorne
ms.service: firewall
ms.topic: how-to
ms.date: 01/11/2023
ms.author: victorh
ms.custom: mvc
#Customer intent: As an administrator new to this service, I want to control outbound network access from resources located in an Azure subnet.
---

# Deploy and configure Azure Firewall using the Azure portal

Controlling outbound network access is an important part of an overall network security plan. For example, you may want to limit access to web sites. Or, you may want to limit the outbound IP addresses and ports that can be accessed.

One way you can control outbound network access from an Azure subnet is with Azure Firewall. With Azure Firewall, you can configure:

* Application rules that define fully qualified domain names (FQDNs) that can be accessed from a subnet.
* Network rules that define source address, protocol, destination port, and destination address.

Network traffic is subjected to the configured firewall rules when you route your network traffic to the firewall as the subnet default gateway.

For this article, you create a simplified single VNet with two subnets for easy deployment.

For production deployments, a [hub and spoke model](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) is recommended, where the firewall is in its own VNet. The workload servers are in peered VNets in the same region with one or more subnets.

* **AzureFirewallSubnet** - the firewall is in this subnet.
* **Workload-SN** - the workload server is in this subnet. This subnet's network traffic goes through the firewall.

![Network infrastructure](media/tutorial-firewall-deploy-portal/tutorial-network.png)

In this article, you learn how to:

> [!div class="checklist"]
> * Set up a test network environment
> * Deploy a firewall
> * Create a default route
> * Configure an application rule to allow access to www.google.com
> * Configure a network rule to allow access to external DNS servers
> * Configure a NAT rule to allow a remote desktop to the test server
> * Test the firewall

> [!NOTE]
> This article uses classic Firewall rules to manage the firewall. The preferred method is to use [Firewall Policy](../firewall-manager/policy-overview.md). To complete this procedure using Firewall Policy, see [Tutorial: Deploy and configure Azure Firewall and policy using the Azure portal](tutorial-firewall-deploy-portal-policy.md)

If you prefer, you can complete this procedure using [Azure PowerShell](deploy-ps.md).

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Set up the network

First, create a resource group to contain the resources needed to deploy the firewall. Then create a VNet, subnets, and a test server.

### Create a resource group

The resource group contains all the resources used in this procedure.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the Azure portal menu, select **Resource groups** or search for and select *Resource groups* from any page. Then select **Create**.
4. For **Subscription**, select your subscription.
1. For **Resource group** name, type **Test-FW-RG**.
1. For **Region**, select a region. All other resources that you create must be in the same region.
1. Select **Review + create**.
1. Select **Create**.

### Create a VNet

This VNet will have two subnets.

> [!NOTE]
> The size of the AzureFirewallSubnet subnet is /26. For more information about the subnet size, see [Azure Firewall FAQ](firewall-faq.yml#why-does-azure-firewall-need-a--26-subnet-size).

1. On the Azure portal menu or from the **Home** page, search for **Virtual networks**.
1. Select **Virtual networks** in the result pane.
1. Select **Create**.
1. For **Subscription**, select your subscription.
1. For **Resource group**, select **Test-FW-RG**.
1. For **Name**, type **Test-FW-VN**.
1. Select **Next: IP addresses**.
1. For **Address space**, accept the default **10.0.0.0/16**.
1. Under **Subnet name**, select **default** and change it to **AzureFirewallSubnet**. The firewall will be in this subnet, and the subnet name **must** be AzureFirewallSubnet.
1. For **Subnet address range**, change it to **10.0.1.0/26**.
1. Select **Save**.


   Next, create a subnet for the workload server.

1. Select **Add subnet**.
1. For **Subnet name**, type **Workload-SN**.
1. For **Subnet address range**, type **10.0.2.0/24**.
1. Select **Add**.
1. Select **Review + create**.
1. Select **Create**.

### Create a virtual machine

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
1. Accept the defaults and select **Next: Monitoring**.
1. For **Boot diagnostics**, select **Disable** to disable boot diagnostics. Accept the other defaults and select **Review + create**.
1. Review the settings on the summary page, and then select **Create**.
1. After the deployment is complete, select **Go to resource** and note the **Srv-Work** private IP address that you'll need to use later.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]


## Deploy the firewall

Deploy the firewall into the VNet.

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
   |Firewall SKU|**Standard**|
   |Firewall management|**Use Firewall rules (classic) to manage this firewall**|
   |Choose a virtual network     |**Use existing**: **Test-FW-VN**|
   |Public IP address     |**Add new**<br>**Name**:  **fw-pip**|

5. Accept the other default values, then select **Review + create**.
6. Review the summary, and then select **Create** to create the firewall.

   This will take a few minutes to deploy.
7. After deployment completes, select the **Go to resource**.
8. Note the firewall private and public IP addresses. You'll use these addresses later.

## Create a default route

When creating a route for outbound and inbound connectivity through the firewall, a default route to 0.0.0.0/0 with the virtual appliance private IP as a next hop is sufficient. This will take care of any outgoing and incoming connections to go through the firewall. As an example, if the firewall is fulfilling a TCP-handshake and responding to an incoming request, then the response is directed to the IP address who sent the traffic. This is by design. 

As a result, there is no need create an additional user defined route to include the AzureFirewallSubnet IP range. This may result in dropped connections. The original default route is sufficient.

For the **Workload-SN** subnet, configure the outbound default route to go through the firewall.

1. On the Azure portal search for **Route tables**.
1. Select **Route tables** in the results pane.
1. Select **Create**.
1. For **Subscription**, select your subscription.
1. For **Resource group**, select **Test-FW-RG**.
1. For **Region**, select the same location that you used previously.
1. For **Name**, type **Firewall-route**.
1. Select **Review + create**.
1. Select **Create**.

After deployment completes, select **Go to resource**.

1. On the **Firewall-route** page, select **Subnets** and then select **Associate**.
1. For **Virtual network**, select **Test-FW-VN**.
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

1. Open the **Test-FW-RG**, and select the **Test-FW01** firewall.
2. On the **Test-FW01** page, under **Settings**, select **Rules (classic)**.
3. Select the **Application rule collection** tab.
4. Select **Add application rule collection**.
5. For **Name**, type **App-Coll01**.
6. For **Priority**, type **200**.
7. For **Action**, select **Allow**.
8. Under **Rules**, **Target FQDNs**, for **Name**, type **Allow-Google**.
9. For **Source type**, select **IP address**.
10. For **Source**, type **10.0.2.0/24**.
11. For **Protocol:port**, type **http, https**.
12. For **Target FQDNS**, type **`www.google.com`**
13. Select **Add**.

Azure Firewall includes a built-in rule collection for infrastructure FQDNs that are allowed by default. These FQDNs are specific for the platform and can't be used for other purposes. For more information, see [Infrastructure FQDNs](infrastructure-fqdns.md).

## Configure a network rule

This is the network rule that allows outbound access to two IP addresses at port 53 (DNS).

1. Select the **Network rule collection** tab.
2. Select **Add network rule collection**.
3. For **Name**, type **Net-Coll01**.
4. For **Priority**, type **200**.
5. For **Action**, select **Allow**.
6. Under **Rules**, **IP addresses**, for **Name**, type **Allow-DNS**.
7. For **Protocol**, select **UDP**.
9. For **Source type**, select **IP address**.
1. For **Source**, type **10.0.2.0/24**.
2. For **Destination type** select **IP address**.
3. For **Destination address**, type **209.244.0.3,209.244.0.4**

   These are public DNS servers operated by Level3.
1. For **Destination Ports**, type **53**.
2. Select **Add**.

## Configure a DNAT rule

This rule allows you to connect a remote desktop to the Srv-Work virtual machine through the firewall.

1. Select the **NAT rule collection** tab.
2. Select **Add NAT rule collection**.
3. For **Name**, type **rdp**.
4. For **Priority**, type **200**.
5. Under **Rules**, for **Name**, type **rdp-nat**.
6. For **Protocol**, select **TCP**.
7. For **Source type**, select **IP address**.
8. For **Source**, type **\***.
9. For **Destination address**, type the firewall public IP address.
10. For **Destination Ports**, type **3389**.
11. For **Translated address**, type the Srv-work private IP address.
12. For **Translated port**, type **3389**.
13. Select **Add**.


### Change the primary and secondary DNS address for the **Srv-Work** network interface

For testing purposes, configure the server's primary and secondary DNS addresses. This isn't a general Azure Firewall requirement.

1. On the Azure portal menu, select **Resource groups** or search for and select *Resource groups* from any page. Select the **Test-FW-RG** resource group.
2. Select the network interface for the **Srv-Work** virtual machine.
3. Under **Settings**, select **DNS servers**.
4. Under **DNS servers**, select **Custom**.
5. Type **209.244.0.3** and press Enter in the **Add DNS server** text box, and **209.244.0.4** in the next text box.
6. Select **Save**.
7. Restart the **Srv-Work** virtual machine.

## Test the firewall

Now, test the firewall to confirm that it works as expected.

1. Connect a remote desktop to the firewall public IP address and sign in to the Srv-Work virtual machine.
1. Open Internet Explorer and browse to `https://www.google.com`.
4. Select **OK** > **Close** on the Internet Explorer security alerts.

   You should see the Google home page.

5. Browse to `https://www.microsoft.com`.

   You should be blocked by the firewall.

So now you've verified that the firewall rules are working:

* You can connect to the virtual machine using RDP.
* You can browse to the one allowed FQDN, but not to any others.
* You can resolve DNS names using the configured external DNS server.

## Clean up resources

You can keep your firewall resources to continue testing, or if no longer needed, delete the **Test-FW-RG** resource group to delete all firewall-related resources.

## Next steps

- [Tutorial: Monitor Azure Firewall logs](./firewall-diagnostics.md)
- [Learn more about Azure network security](../networking/security/index.yml)
