---
title: Deploy and configure Azure Firewall using the Azure portal
description: In this tutorial, you learn how to deploy and configure Azure Firewall using the Azure portal. 
services: firewall
author: vhorne
manager: jpconnock

ms.service: firewall
ms.topic: tutorial
ms.date: 10/5/2018
ms.author: victorh
ms.custom: mvc
#Customer intent: As an administrator, I want to deploy and configure Azure Firewall so that I can control outbound access from resources located in a subnet.
---
# Tutorial: Deploy and configure Azure Firewall using the Azure portal

Azure Firewall has two rule types to control outbound access:

- **Application rules**

   Allows you to configure fully qualified domain names (FQDNs) that can be accessed from a subnet. For example, you could allow access to *github.com* from your subnet.
- **Network rules**

   Allows you to configure rules containing source address, protocol, destination port, and destination address. For example, you could create a rule to allow traffic to port 53 (DNS) to the IP address of your DNS server from your subnet.

Network traffic is subjected to the configured firewall rules when you route your network traffic to the firewall as the subnet default gateway.

Application and network rules are stored in *rule collections*. A rule collection is a list of rules that share the same action and priority.  A network rule collection is a list of network rules and an application rule collection is a list of application rules.

Azure Firewall has NAT rules, network rules and application rules. To learn more about Azure Firewall rule processing logic, see [Azure Firewall rule processing logic](rule-processing.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up a test network environment
> * Deploy a firewall
> * Create a default route
> * Configure application rules
> * Configure network rules
> * Test the firewall



If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

For this tutorial, you create a single VNet with three subnets:
- **FW-SN** - the firewall is in this subnet.
- **Workload-SN** - the workload server is in this subnet. This subnet's network traffic goes through the firewall.
- **Jump-SN** - The "jump" server is in this subnet. The jump server has a public IP address that you can connect to using Remote Desktop. From there, you can then connect to (using another Remote Desktop) the workload server.

![Tutorial network infrastructure](media/tutorial-firewall-rules-portal/Tutorial_network.png)

This tutorial uses a simplified network configuration for easy deployment. For production deployments, a [hub and spoke model](https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) is recommended, where the firewall is in its own VNet, and workload servers are in peered VNets in the same region with one or more subnets.



## Set up the network environment
First, create a resource group to contain the resources needed to deploy the firewall. Then create a VNet, subnets, and test servers.

### Create a resource group
1. Sign in to the Azure portal at [http://portal.azure.com](http://portal.azure.com).
1. On the Azure portal home page, click **Resource groups**, then click **Add**.
2. For **Resource group name**, type **Test-FW-RG**.
3. For **Subscription**, select your subscription.
4. For **Resource group location**, select a location. All subsequent resources that you create must be in the same location.
5. Click **Create**.


### Create a VNet
1. From the Azure portal home page, click **All services**.
2. Under **Networking**, click **Virtual networks**.
3. Click **Add**.
4. For **Name**, type **Test-FW-VN**.
5. For **Address space**, type **10.0.0.0/16**.
7. For **Subscription**, select your subscription.
8. For **Resource group**, select **Use existing**, and then select **Test-FW-RG**.
9. For **Location**, select the same location that you used previously.
10. Under **Subnet**, for **Name** type **AzureFirewallSubnet**. The firewall will be in this subnet, and the subnet name **must** be AzureFirewallSubnet.
11. For **Address range**, type **10.0.1.0/24**.
12. Use the other default settings, and then click **Create**.

> [!NOTE]
> The minimum size of the AzureFirewallSubnet subnet is /25.

### Create additional subnets

Next, create subnets for the jump server, and a subnet for the workload servers.

1. On the Azure portal home page, click **Resource groups**, then click **Test-FW-RG**.
2. Click the **Test-FW-VN** virtual network.
3. Click **Subnets**, and then click **+Subnet**.
4. For **Name**, type **Workload-SN**.
5. For **Address range**, type **10.0.2.0/24**.
6. Click **OK**.

Create another subnet named **Jump-SN**, address range **10.0.3.0/24**.

### Create virtual machines

Now create the jump and workload virtual machines, and place them in the appropriate subnets.

1. From the Azure portal home page, click **All services**.
2. Under **Compute**, click **Virtual machines**.
3. Click **Add**, and click **Windows Server**,  click **Windows Server 2016 Datacenter**, and then click **Create**.

**Basics**

1. For **Name**, type **Srv-Jump**.
5. Type a username and password.
6. For **Subscription**, select your subscription.
7. For **Resource group**, click **Use existing**, and then select **Test-FW-RG**.
8. For **Location**, select the same location that you used previously.
9. Click **OK**.

**Size**

1. Choose an appropriate size for a test virtual machine running Windows Server. For example, **B2ms** (8 GB RAM, 16 GB storage).
2. Click **Select**.

**Settings**

1. Under **Network**, for **Virtual network**, select **Test-FW-VN**.
2. For **Subnet**, select **Jump-SN**.
3. For **Select public inbound ports**, select **RDP (3389)**. 

    You'll want to limit the access to your public IP address, but you need to open port 3389 so you can connect a remote desktop to the jump server. 
2. Leave the other default settings and click **OK**.

**Summary**

Review the summary, and then click **Create**. This will take a few minutes to complete.

Repeat this process to create another virtual machine named **Srv-Work**.

Use the information in the following table to configure the **Settings** for the Srv-Work virtual machine. The rest of the configuration is the same as the Srv-Jump virtual machine.


|Setting  |Value  |
|---------|---------|
|Subnet|Workload-SN|
|Public IP address|None|
|Select public inbound ports|No public inbound ports|


## Deploy the firewall

1. From the portal home page, click **Create a resource**.
2. Click **Networking**, and after **Featured**, click **See all**.
3. Click **Firewall**, and then click **Create**. 
4. On the **Create a Firewall** page, use the following table to configure the firewall:
   
   |Setting  |Value  |
   |---------|---------|
   |Name     |Test-FW01|
   |Subscription     |\<your subscription\>|
   |Resource group     |**Use existing**: Test-FW-RG |
   |Location     |Select the same location that you used previously|
   |Choose a virtual network     |**Use existing**: Test-FW-VN|
   |Public IP address     |**Create new**. The Public IP address must be the Standard SKU type.|

2. Click **Review + create**.
3. Review the summary, and then click **Create** to create the firewall.

   This will take a few minutes to deploy.
4. After deployment completes, go to the **Test-FW-RG** resource group, and click the **Test-FW01** firewall.
6. Note the private IP address. You'll use it later when you create the default route.


## Create a default route

For the **Workload-SN** subnet, you configure the outbound default route to go through the firewall.

1. From the Azure portal home page, click **All services**.
2. Under **Networking**, click **Route tables**.
3. Click **Add**.
4. For **Name**, type **Firewall-route**.
5. For **Subscription**, select your subscription.
6. For **Resource group**, select **Use existing**, and select **Test-FW-RG**.
7. For **Location**, select the same location that you used previously.
8. Click **Create**.
9. Click **Refresh**, and then click the **Firewall-route** route table.
10. Click **Subnets**, and then click **Associate**.
11. Click **Virtual network**, and then select **Test-FW-VN**.
12. For **Subnet**, click **Workload-SN**.

    > [!IMPORTANT]
    > Make sure that you select only the **Workload-SN** subnet for this route, otherwise your firewall will not work correctly.

13. Click **OK**.
14. Click **Routes**, and then click **Add**.
15. For **Route name**, type **FW-DG**.
16. For **Address prefix**, type **0.0.0.0/0**.
17. For **Next hop type**, select **Virtual appliance**.

    Azure Firewall is actually a managed service, but virtual appliance works in this situation.
18. For **Next hop address**, type the private IP address for the firewall that you noted previously.
19. Click **OK**.


## Configure application rules


1. Open the **Test-FW-RG**, and click the **Test-FW01** firewall.
2. On the **Test-FW01** page, under **Settings**, click **Rules**.
3. Click **Add application rule collection**.
4. For **Name**, type **App-Coll01**.
5. For **Priority**, type **200**.
6. For **Action**, select **Allow**.
7. Under **Rules**, for **Name**, type **AllowGH**.
8. For **Source Addresses**, type **10.0.2.0/24**.
9. For **Protocol:port**, type **http, https**. 
10. For **Target FQDNS**, type **github.com**
11. Click **Add**.

Azure Firewall includes a built-in rule collection for infrastructure FQDNs that are allowed by default. These FQDNs are specific for the platform and can't be used for other purposes. For more information, see [Infrastructure FQDNs](infrastructure-fqdns.md).

## Configure network rules

1. Click **Add network rule collection**.
2. For **Name**, type **Net-Coll01**.
3. For **Priority**, type **200**.
4. For **Action**, select **Allow**.

6. Under **Rules**, for **Name**, type **AllowDNS**.
8. For **Protocol**, select **UDP**.
9. For **Source Addresses**, type **10.0.2.0/24**.
10. For Destination address, type **209.244.0.3,209.244.0.4**
11. For **Destination Ports**, type **53**.
12. Click **Add**.

### Change the primary and secondary DNS address for the **Srv-Work** network interface

For testing purposes in this tutorial, you configure the primary and secondary DNS addresses. This is not a general Azure Firewall requirement. 

1. From the Azure portal, open the **Test-FW-RG** resource group.
2. Click the network interface for the **Srv-Work** virtual machine.
3. Under **Settings**, click **DNS servers**.
4. Under **DNS servers**, click **Custom**.
5. Type **209.244.0.3** in the **Add DNS server** text box, and **209.244.0.4** in the next text box.
6. Click **Save**. 
7. Restart the **Srv-Work** virtual machine.


## Test the firewall

1. From the Azure portal, review the network settings for the **Srv-Work** virtual machine and note the private IP address.
2. Connect a remote desktop to **Srv-Jump** virtual machine, and from there open a remote desktop connection to the **Srv-Work** private IP address.

5. Open Internet Explorer and browse to http://github.com.
6. Click **OK**, and **Close** on the security alerts.

   You should see the GitHub home page.

7. Browse to http://www.msn.com.

   You should be blocked by the firewall.

So now you have verified that the firewall rules are working:

- You can browse to the one allowed FQDN, but not to any others.
- You can resolve DNS names using the configured external DNS server.

## Clean up resources

You can keep your firewall resources for the next tutorial, or if no longer needed, delete the **Test-FW-RG** resource group to delete all firewall-related resources.


## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Set up the network
> * Create a firewall
> * Create a default route
> * Configure application and network firewall rules
> * Test the firewall

Next, you can monitor the Azure Firewall logs.

> [!div class="nextstepaction"]
> [Tutorial: Monitor Azure Firewall logs](./tutorial-diagnostics.md)
