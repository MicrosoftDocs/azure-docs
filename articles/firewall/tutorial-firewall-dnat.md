---
title: Deploy and configure Azure Firewall DNAT using the Azure portal
description: In this tutorial, you learn how to deploy and configure Azure Firewall DNAT using the Azure portal. 
services: firewall
author: vhorne
manager: jpconnock

ms.service: firewall
ms.topic: tutorial
ms.date: 8/25/2018
ms.author: victorh
ms.custom: mvc
#Customer intent: As an administrator, I want to deploy and configure Azure Firewall DNAT so that I can control inbound access to resources located in a subnet.
---
# Tutorial: Deploy and configure Azure Firewall DNAT using the Azure portal


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up a test network environment
> * Deploy a firewall
> * Create a default route
> * Configure DNAT rules
> * Test the firewall



If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

For this tutorial, you create a single VNet with three subnets:
- **FW-SN** - the firewall is in this subnet.
- **Workload-SN** - the workload server is in this subnet. This subnet's network traffic goes through the firewall.
- **Jump-SN** - The "jump" server is in this subnet. The jump server has a public IP address that you can connect to using Remote Desktop. From there, you can then connect to (using another Remote Desktop) the workload server.

This tutorial uses a simplified network configuration for easy deployment. For production deployments, a [hub and spoke model](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) is recommended, where the firewall is in its own VNet, and workload servers are in peered VNets in the same region with one or more subnets.

## Create a resource group
1. Sign in to the Azure portal at [http://portal.azure.com](http://portal.azure.com).
1. On the Azure portal home page, click **Resource groups**, then click **Add**.
2. For **Resource group name**, type **Test-FW-RG**.
3. For **Subscription**, select your subscription.
4. For **Resource group location**, select a location. All subsequent resources that you create must be in the same location.
5. Click **Create**.

## Set up the network environment
First, create a resource group to contain the resources needed to deploy the firewall. Then create a VNet, subnets, and test servers.

### Create the Hub VNet
1. From the Azure portal home page, click **All services**.
2. Under **Networking**, click **Virtual networks**.
3. Click **Add**.
4. For **Name**, type **VN-Hub**.
5. For **Address space**, type **10.0.0.0/16**.
7. For **Subscription**, select your subscription.
8. For **Resource group**, select **Use existing**, and then select **Test-FW-RG**.
9. For **Location**, select the same location that you used previously.
10. Under **Subnet**, for **Name** type **AzureFirewallSubnet**.

     The firewall will be in this subnet, and the subnet name **must** be AzureFirewallSubnet.
     > [!NOTE]
     > The minimum size of the AzureFirewallSubnet subnet is /25.
11. For **Address range**, type **10.0.1.0/24**.
12. Use the other default settings, and then click **Create**.

### Create a spoke VNet

1. From the Azure portal home page, click **All services**.
2. Under **Networking**, click **Virtual networks**.
3. Click **Add**.
4. For **Name**, type **VN-Spoke**.
5. For **Address space**, type **192.168.0.0/16**.
7. For **Subscription**, select your subscription.
8. For **Resource group**, select **Use existing**, and then select **Test-FW-RG**.
9. For **Location**, select the same location that you used previously.
10. Under **Subnet**, for **Name** type **SN-Workload**.

    The server will be in this subnet.
1. For **Address range**, type **192.168.1.0/24**.
2. Use the other default settings, and then click **Create**.

### Peer the VNets

#### Hub to spoke

1. Click the **VN-Hub** virtual network.
2. Under **Settings**, click **Peerings**.
3. Click **Add**.
4. Type **Peer-HubSpoke** for the name.
5. Select **VN-Spoke** for the virtual network.
7. Click **OK**.

#### Spoke to hub

1. Click the **VN-Spoke** virtual network.
2. Under **Settings**, click **Peerings**.
3. Click **Add**.
4. Type **Peer-SpokeHub** for the name.
5. Select **VN-Hub** for the virtual network.
6. Click **Allow forwarded traffic**.
7. Click **OK**.

### Create a virtual machine

Now create a workload virtual machine, and place it in the appropriate subnet.

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

1. Under **Network**, for **Virtual network**, select **VN-Spoke**.
2. For **Subnet**, select **SN-Workload**.
3. For **Select public inbound ports**, select **RDP (3389)**. 

    You'll want to limit the access to your public IP address, but you need to open port 3389 so you can connect a remote desktop to the workload server. 
2. Leave the other default settings and click **OK**.

**Summary**

Review the summary, and then click **Create**. This will take a few minutes to complete.


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
   |Choose a virtual network     |**Use existing**: VN-Hub|
   |Public IP address     |**Create new**. The Public IP address must be the Standard SKU type.|

2. Click **Review + create**.
3. Review the summary, and then click **Create** to create the firewall.

   This will take a few minutes to deploy.
4. After deployment completes, go to the **Test-FW-RG** resource group, and click the **Test-FW01** firewall.
6. Note the private IP address. You'll use it later when you create the default route.


## Create a default route

For the **SN-Workload** subnet, you configure the outbound default route to go through the firewall.

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
11. Click **Virtual network**, and then select **VN-Spoke**.
12. For **Subnet**, click **SN-Workload**.
13. Click **OK**.
14. Click **Routes**, and then click **Add**.
15. For **Route name**, type **FW-DG**.
16. For **Address prefix**, type **0.0.0.0/0**.
17. For **Next hop type**, select **Virtual appliance**.

    Azure Firewall is actually a managed service, but virtual appliance works in this situation.
1. For **Next hop address**, type the private IP address for the firewall that you noted previously.
2. Click **OK**.


## Configure DNAT rules


1. Open the **Test-FW-RG**, and click the **Test-FW01** firewall.
1. On the **Test-FW01** page, under **Settings**, click **Rules**.
2. Click **Add DNAT rule collection**.
3. For **Name**, type **DNAT-Coll01**.
1. For **Priority**, type **200**.
2. For **Action**, select **Allow**.

6. Under **Rules**, for **Name**, type **AllowRDP**.
7. For **Source Addresses**, type **Any**.
8. For **Protocol:port**, type **TCP:3389**. 
10. Click **Add**.


## Test the firewall

1. From the Azure portal, review the network settings for the **Srv-Work** virtual machine and note the private IP address.
2. Connect a remote desktop to **Srv-Jump** virtual machine.
3. Close the remote desktop.
4. Change the DNAT-Coll01 rule action to **Deny**.
5. Try to connect to **Srv-Jump** again. This time it should not succeeed because of the **Deny** rule.


## Clean up resources

You can keep your firewall resources for the next tutorial, or if no longer needed, delete the **Test-FW-RG** resource group to delete all firewall-related resources.


## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Set up the network
> * Create a firewall
> * Create a default route
> * Configure DNAT firewall rules
> * Test the firewall

Next, you can monitor the Azure Firewall logs.

> [!div class="nextstepaction"]
> [Tutorial: Monitor Azure Firewall logs](./tutorial-diagnostics.md)
