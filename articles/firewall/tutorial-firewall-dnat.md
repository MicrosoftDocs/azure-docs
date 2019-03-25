---
title: Filter inbound traffic with Azure Firewall DNAT using the Azure portal
description: In this tutorial, you learn how to deploy and configure Azure Firewall DNAT using the Azure portal. 
services: firewall
author: vhorne

ms.service: firewall
ms.topic: tutorial
ms.date: 11/28/2018
ms.author: victorh
ms.custom: mvc
#Customer intent: As an administrator, I want to deploy and configure Azure Firewall DNAT so that I can control inbound access to resources located in a subnet.
---
# Tutorial: Filter inbound traffic with Azure Firewall DNAT using the Azure portal

You can configure Azure Firewall Destination Network Address Translation (DNAT) to translate and filter inbound traffic to your subnets. When you configure DNAT, the NAT rule collection action is set to **Dnat**. Each rule in the NAT rule collection can then be used to translate your firewall public IP and port to a private IP and port. DNAT rules implicitly add a corresponding network rule to allow the translated traffic. You can override this behavior by explicitly adding a network rule collection with deny rules that match the translated traffic. To learn more about Azure Firewall rule processing logic, see [Azure Firewall rule processing logic](rule-processing.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up a test network environment
> * Deploy a firewall
> * Create a default route
> * Configure a DNAT rule
> * Test the firewall

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

For this tutorial, you create a two peered VNets:

- **VN-Hub** - the firewall is in this VNet.
- **VN-Spoke** - the workload server is in this VNet.

## Create a resource group

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).
2. On the Azure portal home page, click **Resource groups**, then click **Add**.
3. For **Resource group name**, type **RG-DNAT-Test**.
4. For **Subscription**, select your subscription.
5. For **Resource group location**, select a location. All subsequent resources that you create must be in the same location.
6. Click **Create**.

## Set up the network environment

First, create the VNets and then peer them.

### Create the Hub VNet

1. From the Azure portal home page, click **All services**.
2. Under **Networking**, click **Virtual networks**.
3. Click **Add**.
4. For **Name**, type **VN-Hub**.
5. For **Address space**, type **10.0.0.0/16**.
6. For **Subscription**, select your subscription.
7. For **Resource group**, select **Use existing**, and then select **RG-DNAT-Test**.
8. For **Location**, select the same location that you used previously.
9. Under **Subnet**, for **Name** type **AzureFirewallSubnet**.

     The firewall will be in this subnet, and the subnet name **must** be AzureFirewallSubnet.
     > [!NOTE]
     > The minimum size of the AzureFirewallSubnet subnet is /26.
10. For **Address range**, type **10.0.1.0/24**.
11. Use the other default settings, and then click **Create**.

### Create a spoke VNet

1. From the Azure portal home page, click **All services**.
2. Under **Networking**, click **Virtual networks**.
3. Click **Add**.
4. For **Name**, type **VN-Spoke**.
5. For **Address space**, type **192.168.0.0/16**.
6. For **Subscription**, select your subscription.
7. For **Resource group**, select **Use existing**, and then select **RG-DNAT-Test**.
8. For **Location**, select the same location that you used previously.
9. Under **Subnet**, for **Name** type **SN-Workload**.

    The server will be in this subnet.
10. For **Address range**, type **192.168.1.0/24**.
11. Use the other default settings, and then click **Create**.

### Peer the VNets

Now peer the two VNets.

#### Hub to spoke

1. Click the **VN-Hub** virtual network.
2. Under **Settings**, click **Peerings**.
3. Click **Add**.
4. Type **Peer-HubSpoke** for the name.
5. Select **VN-Spoke** for the virtual network.
6. Click **OK**.

#### Spoke to hub

1. Click the **VN-Spoke** virtual network.
2. Under **Settings**, click **Peerings**.
3. Click **Add**.
4. Type **Peer-SpokeHub** for the name.
5. Select **VN-Hub** for the virtual network.
6. Click **Allow forwarded traffic**.
7. Click **OK**.

## Create a virtual machine

Create a workload virtual machine, and place it in the **SN-Workload** subnet.

1. From the Azure portal home page, click **All services**.
2. Under **Compute**, click **Virtual machines**.
3. Click **Add**, and click **Windows Server**,  click **Windows Server 2016 Datacenter**, and then click **Create**.

**Basics**

1. For **Name**, type **Srv-Workload**.
5. Type a username and password.
6. For **Subscription**, select your subscription.
7. For **Resource group**, click **Use existing**, and then select **RG-DNAT-Test**.
8. For **Location**, select the same location that you used previously.
9. Click **OK**.

**Size**

1. Choose an appropriate size for a test virtual machine running Windows Server. For example, **B2ms** (8 GB RAM, 16 GB storage).
2. Click **Select**.

**Settings**

1. Under **Network**, for **Virtual network**, select **VN-Spoke**.
2. For **Subnet**, select **SN-Workload**.
3. Click **Public IP address** and then click **None**.
4. For **Select public inbound ports**, select **No public inbound ports**. 
2. Leave the other default settings and click **OK**.

**Summary**

Review the summary, and then click **Create**. This will take a few minutes to complete.

After deployment finishes, note the private IP address for the virtual machine. It will be used later when you configure the firewall. Click the virtual machine name, and under **Settings**, click **Networking** to find the private IP address.

## Deploy the firewall

1. From the portal home page, click **Create a resource**.
2. Click **Networking**, and after **Featured**, click **See all**.
3. Click **Firewall**, and then click **Create**. 
4. On the **Create a Firewall** page, use the following table to configure the firewall:

   |Setting  |Value  |
   |---------|---------|
   |Name     |FW-DNAT-test|
   |Subscription     |\<your subscription\>|
   |Resource group     |**Use existing**: RG-DNAT-Test |
   |Location     |Select the same location that you used previously|
   |Choose a virtual network     |**Use existing**: VN-Hub|
   |Public IP address     |**Create new**. The Public IP address must be the Standard SKU type.|

5. Click **Review + create**.
6. Review the summary, and then click **Create** to create the firewall.

   This will take a few minutes to deploy.
7. After deployment completes, go to the **RG-DNAT-Test** resource group, and click the **FW-DNAT-test** firewall.
8. Note the private IP address. You'll use it later when you create the default route.

## Create a default route

For the **SN-Workload** subnet, you configure the outbound default route to go through the firewall.

1. From the Azure portal home page, click **All services**.
2. Under **Networking**, click **Route tables**.
3. Click **Add**.
4. For **Name**, type **RT-FWroute**.
5. For **Subscription**, select your subscription.
6. For **Resource group**, select **Use existing**, and select **RG-DNAT-Test**.
7. For **Location**, select the same location that you used previously.
8. Click **Create**.
9. Click **Refresh**, and then click the **RT-FWroute** route table.
10. Click **Subnets**, and then click **Associate**.
11. Click **Virtual network**, and then select **VN-Spoke**.
12. For **Subnet**, click **SN-Workload**.
13. Click **OK**.
14. Click **Routes**, and then click **Add**.
15. For **Route name**, type **FW-DG**.
16. For **Address prefix**, type **0.0.0.0/0**.
17. For **Next hop type**, select **Virtual appliance**.

    Azure Firewall is actually a managed service, but virtual appliance works in this situation.
18. For **Next hop address**, type the private IP address for the firewall that you noted previously.
19. Click **OK**.

## Configure a NAT rule

1. Open the **RG-DNAT-Test**, and click the **FW-DNAT-test** firewall. 
2. On the **FW-DNAT-test** page, under **Settings**, click **Rules**. 
3. Click **Add NAT rule collection**. 
4. For **Name**, type **RC-DNAT-01**. 
5. For **Priority**, type **200**. 
6. Under **Rules**, for **Name**, type **RL-01**.
7. For **Protocol**, select **TCP**.
8. For **Source Addresses**, type *. 
9. For **Destination Addresses** type the firewall's public IP address. 
10. For **Destination ports**, type **3389**. 
11. For **Translated Address** type the private IP address for the Srv-Workload virtual machine. 
12. For **Translated port**, type **3389**. 
13. Click **Add**. 

## Test the firewall

1. Connect a remote desktop to firewall public IP address. You should be connected to the **Srv-Workload** virtual machine.
2. Close the remote desktop.

## Clean up resources

You can keep your firewall resources for the next tutorial, or if no longer needed, delete the **RG-DNAT-Test** resource group to delete all firewall-related resources.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Set up a test network environment
> * Deploy a firewall
> * Create a default route
> * Configure a DNAT rule
> * Test the firewall

Next, you can monitor the Azure Firewall logs.

> [!div class="nextstepaction"]
> [Tutorial: Monitor Azure Firewall logs](./tutorial-diagnostics.md)
