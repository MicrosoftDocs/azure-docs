---
title: 'Tutorial: Deploy and configure Azure Firewall using the Azure portal'
description: In this tutorial, you learn how to deploy and configure Azure Firewall using the Azure portal. 
services: firewall
author: vhorne
ms.service: firewall
ms.topic: tutorial
ms.date: 11/15/2018
ms.author: victorh
ms.custom: mvc
#Customer intent: As an administrator new to this service, I want to control outbound network access from resources located in an Azure subnet.
---
# Tutorial: Deploy and configure Azure Firewall using the Azure portal

Controlling outbound network access is an important part of an overall network security plan. For example, you may want to limit access to web sites, or the outbound IP addresses and ports that can be accessed.

One way you can control outbound network access from an Azure subnet is with Azure Firewall. With Azure Firewall, you can configure:

* Application rules that define fully qualified domain names (FQDNs) that can be accessed from a subnet.
* Network rules that define source address, protocol, destination port, and destination address.

Network traffic is subjected to the configured firewall rules when you route your network traffic to the firewall as the subnet default gateway.

For this tutorial, you create a simplified single VNet with three subnets for easy deployment. For production deployments, a [hub and spoke model](https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) is recommended, where the firewall is in its own VNet, and workload servers are in peered VNets in the same region with one or more subnets.

- **AzureFirewallSubnet** - the firewall is in this subnet.
- **Workload-SN** - the workload server is in this subnet. This subnet's network traffic goes through the firewall.
- **Jump-SN** - The "jump" server is in this subnet. The jump server has a public IP address that you can connect to using Remote Desktop. From there, you can then connect to (using another Remote Desktop) the workload server.

![Tutorial network infrastructure](media/tutorial-firewall-rules-portal/Tutorial_network.png)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up a test network environment
> * Deploy a firewall
> * Create a default route
> * Configure an application to allow access to github.com
> * Configure a network rule to allow access to external DNS servers
> * Test the firewall

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Set up the network

First, create a resource group to contain the resources needed to deploy the firewall. Then create a VNet, subnets, and test servers.

### Create a resource group

The resource group contains all the resources for the tutorial.

1. Sign in to the Azure portal at [http://portal.azure.com](http://portal.azure.com).
2. On the Azure portal home page, click **Resource groups** > **Add**.
3. For **Resource group name**, type **Test-FW-RG**.
4. For **Subscription**, select your subscription.
5. For **Resource group location**, select a location. All subsequent resources that you create must be in the same location.
6. Click **Create**.

### Create a VNet

This VNet will contain three subnets.

1. From the Azure portal home page, click **All services**.
2. Under **Networking**, click **Virtual networks**.
3. Click **Add**.
4. For **Name**, type **Test-FW-VN**.
5. For **Address space**, type **10.0.0.0/16**.
6. For **Subscription**, select your subscription.
7. For **Resource group**, select **Use existing** > **Test-FW-RG**.
8. For **Location**, select the same location that you used previously.
9. Under **Subnet**, for **Name** type **AzureFirewallSubnet**. The firewall will be in this subnet, and the subnet name **must** be AzureFirewallSubnet.
10. For **Address range**, type **10.0.1.0/24**.
11. Use the other default settings, and then click **Create**.

> [!NOTE]
> The minimum size of the AzureFirewallSubnet subnet is /26.

### Create additional subnets

Next, create subnets for the jump server, and a subnet for the workload servers.

1. On the Azure portal home page, click **Resource groups** > **Test-FW-RG**.
2. Click the **Test-FW-VN** virtual network.
3. Click **Subnets** > **+Subnet**.
4. For **Name**, type **Workload-SN**.
5. For **Address range**, type **10.0.2.0/24**.
6. Click **OK**.

Create another subnet named **Jump-SN**, address range **10.0.3.0/24**.

### Create virtual machines

Now create the jump and workload virtual machines, and place them in the appropriate subnets.

1. On the Azure portal, click **Create a resource**.
2. Click **Compute** and then select **Windows Server 2016 Datacenter** in the Featured list.
3. Enter these values for the virtual machine:

    - *Test-FW-RG* for the resource group.
    - *Srv-Jump* - for the name of the virtual machine.
    - *azureuser* - for the administrator user name.
    - *Azure123456!* for the password.

4. Under **Inbound port rules**, for **Public inbound ports**, click **Allow selected ports**.
5. For **Select inbound ports**, select **RDP (3389)**.

6. Accept the other defaults and click **Next: Disks**.
7. Accept the disk defaults and click **Next: Networking**.
8. Make sure that **Test-FW-VN** is selected for the virtual network and the subnet is **Jump-SN**.
9. For **Public IP**, click **Create new**.
10. Type **Srv-Jump-PIP** for the public IP address name and click **OK**.
11. Accept the other defaults and click **Next: Management**.
12. Click **Off** to disable boot diagnostics. Accept the other defaults and click **Review + create**.
13. Review the settings on the summary page, and then click **Create**.

Repeat this process to create another virtual machine named **Srv-Work**.

Use the information in the following table to configure the Srv-Work virtual machine. The rest of the configuration is the same as the Srv-Jump virtual machine.

|Setting  |Value  |
|---------|---------|
|Subnet|Workload-SN|
|Public IP|None|
|Public inbound ports|None|

## Deploy the firewall

Deploy the firewall into the VNet.

1. From the portal home page, click **Create a resource**.
2. Click **Networking**, and after **Featured**, click **See all**.
3. Click **Firewall** > **Create**. 
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

For the **Workload-SN** subnet, configure the outbound default route to go through the firewall.

1. From the Azure portal home page, click **All services**.
2. Under **Networking**, click **Route tables**.
3. Click **Add**.
4. For **Name**, type **Firewall-route**.
5. For **Subscription**, select your subscription.
6. For **Resource group**, select **Use existing**, and select **Test-FW-RG**.
7. For **Location**, select the same location that you used previously.
8. Click **Create**.
9. Click **Refresh**, and then click the **Firewall-route** route table.
10. Click **Subnets** > **Associate**.
11. Click **Virtual network** > **Test-FW-VN**.
12. For **Subnet**, click **Workload-SN**. Make sure that you select only the **Workload-SN** subnet for this route, otherwise your firewall will not work correctly.

13. Click **OK**.
14. Click **Routes** > **Add**.
15. For **Route name**, type **FW-DG**.
16. For **Address prefix**, type **0.0.0.0/0**.
17. For **Next hop type**, select **Virtual appliance**.

    Azure Firewall is actually a managed service, but virtual appliance works in this situation.
18. For **Next hop address**, type the private IP address for the firewall that you noted previously.
19. Click **OK**.

## Configure an application rule

This is the application rule that allows outbound access to github.com.

1. Open the **Test-FW-RG**, and click the **Test-FW01** firewall.
2. On the **Test-FW01** page, under **Settings**, click **Rules**.
3. Click the **Application rule collection** tab.
4. Click **Add application rule collection**.
5. For **Name**, type **App-Coll01**.
6. For **Priority**, type **200**.
7. For **Action**, select **Allow**.
8. Under **Rules**, **Target FQDNs**, for **Name**, type **AllowGH**.
9. For **Source Addresses**, type **10.0.2.0/24**.
10. For **Protocol:port**, type **http, https**.
11. For **Target FQDNS**, type **github.com**
12. Click **Add**.

Azure Firewall includes a built-in rule collection for infrastructure FQDNs that are allowed by default. These FQDNs are specific for the platform and can't be used for other purposes. For more information, see [Infrastructure FQDNs](infrastructure-fqdns.md).

## Configure a network rule

This is the network rule that allows outbound access to two IP addresses at port 53 (DNS).

1. Click the **Network rule collection** tab.
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

Now test the firewall to confirm that it works as expected.

1. From the Azure portal, review the network settings for the **Srv-Work** virtual machine and note the private IP address.
2. Connect a remote desktop to **Srv-Jump** virtual machine, and from there open a remote desktop connection to the **Srv-Work** private IP address.

5. Open Internet Explorer and browse to http://github.com.
6. Click **OK** > **Close** on the security alerts.

   You should see the GitHub home page.

7. Browse to http://www.msn.com.

   You should be blocked by the firewall.

So now you have verified that the firewall rules are working:

- You can browse to the one allowed FQDN, but not to any others.
- You can resolve DNS names using the configured external DNS server.

## Clean up resources

You can keep your firewall resources for the next tutorial, or if no longer needed, delete the **Test-FW-RG** resource group to delete all firewall-related resources.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Monitor Azure Firewall logs](./tutorial-diagnostics.md)
