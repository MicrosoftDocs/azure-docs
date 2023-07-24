---
title: Filter inbound Internet traffic with Azure Firewall DNAT using the portal
description: In this article, you learn how to deploy and configure Azure Firewall DNAT using the Azure portal. 
services: firewall
author: vhorne
ms.service: firewall
ms.topic: how-to
ms.date: 06/06/2022
ms.author: victorh
ms.custom: mvc
#Customer intent: As an administrator, I want to deploy and configure Azure Firewall DNAT so that I can control inbound Internet access to resources located in a subnet.
---

# Filter inbound Internet traffic with Azure Firewall DNAT using the Azure portal

You can configure Azure Firewall Destination Network Address Translation (DNAT) to translate and filter inbound Internet traffic to your subnets. When you configure DNAT, the NAT rule collection action is set to **Dnat**. Each rule in the NAT rule collection can then be used to translate your firewall public IP address and port to a private IP address and port. DNAT rules implicitly add a corresponding network rule to allow the translated traffic. For security reasons, the recommended approach is to add a specific Internet source to allow DNAT access to the network and avoid using wildcards. To learn more about Azure Firewall rule processing logic, see [Azure Firewall rule processing logic](rule-processing.md).

In this article, you learn how to:

> [!div class="checklist"]
> * Set up a test network environment
> * Deploy a firewall
> * Create a default route
> * Configure a DNAT rule
> * Test the firewall

> [!NOTE]
> This article uses classic Firewall rules to manage the firewall. The preferred method is to use [Firewall Policy](../firewall-manager/policy-overview.md). To complete this procedure using Firewall Policy, see [Tutorial: Filter inbound Internet traffic with Azure Firewall policy DNAT using the Azure portal](tutorial-firewall-dnat-policy.md)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.



## Create a resource group

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the Azure portal home page, select **Resource groups**, then select **Create**.
4. For **Subscription**, select your subscription.
1. For **Resource group**, type **RG-DNAT-Test**.
5. For **Region**, select a region. All other resources that you create must be in the same region.
6. Select **Review + create**.
1. Select **Create**.

## Set up the network environment

For this article, you create a two peered VNets:

- **VN-Hub** - the firewall is in this VNet.
- **VN-Spoke** - the workload server is in this VNet.

First, create the VNets and then peer them.

### Create the Hub VNet

1. From the Azure portal home page, select **All services**.
2. Under **Networking**, select **Virtual networks**.
3. Select **Create**.
7. For **Resource group**, select **RG-DNAT-Test**.
1. For **Name**, type **VN-Hub**.
1. For **Region**, select the same region that you used before.
1. Select **Next: IP Addresses**.
1. For **IPv4 Address space**, accept the default **10.0.0.0/16**.
1. Under **Subnet name**, select **default**.
1. Edit the **Subnet name** and type **AzureFirewallSubnet**.

     The firewall will be in this subnet, and the subnet name **must** be AzureFirewallSubnet.
     > [!NOTE]
     > The size of the AzureFirewallSubnet subnet is /26. For more information about the subnet size, see [Azure Firewall FAQ](firewall-faq.yml#why-does-azure-firewall-need-a--26-subnet-size).

10. For **Subnet address range**, type **10.0.1.0/26**.
11. Select **Save**.
1. Select **Review + create**.
1. Select **Create**.

### Create a spoke VNet

1. From the Azure portal home page, select **All services**.
2. Under **Networking**, select **Virtual networks**.
3. Select **Create**.
1. For **Resource group**, select **RG-DNAT-Test**.
1. For **Name**, type **VN-Spoke**.
1. For **Region**, select the same region that you used before.
1. Select **Next: IP Addresses**.
1. For **IPv4 Address space**, edit the default and type **192.168.0.0/16**.
1. Select **Add subnet**.
1. For the **Subnet name** type **SN-Workload**.
10. For **Subnet address range**, type **192.168.1.0/24**.
11. Select **Add**.
1. Select **Review + create**.
1. Select **Create**.

### Peer the VNets

Now peer the two VNets.

1. Select the **VN-Hub** virtual network.
2. Under **Settings**, select **Peerings**.
3. Select **Add**.
4. Under **This virtual network**, for the **Peering link name**, type **Peer-HubSpoke**.
5. Under **Remote virtual network**, for **Peering link name**, type **Peer-SpokeHub**. 
1. Select **VN-Spoke** for the virtual network.
1. Accept all the other defaults, and then select **Add**.

## Create a virtual machine

Create a workload virtual machine, and place it in the **SN-Workload** subnet.

1. From the Azure portal menu, select **Create a resource**.
2. Under **Popular**, select **Windows Server 2019 Datacenter**.

**Basics**

1. For **Subscription**, select your subscription.
1. For **Resource group**, select **RG-DNAT-Test**.
1. For **Virtual machine name**, type **Srv-Workload**.
1. For **Region**, select the same location that you used previously.
1. Type a username and password.
1. Select **Next: Disks**.

**Disks**
1. Select **Next: Networking**.

**Networking**

1. For **Virtual network**, select **VN-Spoke**.
2. For **Subnet**, select **SN-Workload**.
3. For **Public IP**, select **None**.
4. For **Public inbound ports**, select **None**. 
2. Leave the other default settings and select **Next: Management**.

**Management**

1. For **Boot diagnostics**, select **Disable**.
1. Select **Review + Create**.

**Review + Create**

Review the summary, and then select **Create**. This will take a few minutes to complete.

After deployment finishes, note the private IP address for the virtual machine. It will be used later when you configure the firewall. Select the virtual machine name, and under **Settings**, select **Networking** to find the private IP address.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Deploy the firewall

1. From the portal home page, select **Create a resource**.
1. Search for **Firewall**, and then select **Firewall**.
1. Select **Create**. 
1. On the **Create a Firewall** page, use the following table to configure the firewall:

   |Setting  |Value  |
   |---------|---------|
   |Subscription     |\<your subscription\>|
   |Resource group     |Select **RG-DNAT-Test** |
   |Name     |**FW-DNAT-test**|
   |Region     |Select the same location that you used previously|
   |Firewall tier|**Standard**|
   |Firewall management|**Use Firewall rules (classic) to manage this firewall**|
   |Choose a virtual network     |**Use existing**: VN-Hub|
   |Public IP address     |**Add new**, Name: **fw-pip**.|

5. Accept the other defaults, and then select **Review + create**.
6. Review the summary, and then select **Create** to create the firewall.

   This will take a few minutes to deploy.
7. After deployment completes, go to the **RG-DNAT-Test** resource group, and select the **FW-DNAT-test** firewall.
8. Note the firewall's private and public IP addresses. You'll use them later when you create the default route and NAT rule.

## Create a default route

For the **SN-Workload** subnet, you configure the outbound default route to go through the firewall.

> [!IMPORTANT]
> You do not need to configure an explicit route back to the firewall at the destination subnet. Azure Firewall is a stateful service and handles the packets and sessions automatically. If you create this route, you'll create an asymmetrical routing environment that interrupts the stateful session logic and results in dropped packets and connections.

1. From the Azure portal home page, select **All services**.
2. Under **Networking**, select **Route tables**.
3. Select **Create**.
5. For **Subscription**, select your subscription.
1. For **Resource group**, select **RG-DNAT-Test**.
1. For **Region**, select the same region that you used previously.
1. For **Name**, type **RT-FWroute**.
1. Select **Review + create**.
1. Select **Create**.
1. Select **Go to resource**.
1. Select **Subnets**, and then select **Associate**.
1. For **Virtual network**, select **VN-Spoke**.
1. For **Subnet**, select **SN-Workload**.
1. Select **OK**.
1. Select **Routes**, and then select **Add**.
1. For **Route name**, type **FW-DG**.
1. For **Address prefix destination**, select **IP Addresses**.
1. For **Destination IP addresses/CIDR ranges**, type **0.0.0.0/0**.
1. For **Next hop type**, select **Virtual appliance**.

    Azure Firewall is actually a managed service, but virtual appliance works in this situation.
18. For **Next hop address**, type the private IP address for the firewall that you noted previously.
19. Select **Add**.

## Configure a NAT rule

1. Open the **RG-DNAT-Test** resource group, and select the **FW-DNAT-test** firewall. 
2. On the **FW-DNAT-test** page, under **Settings**, select **Rules (classic)**. 
3. Select **Add NAT rule collection**. 
4. For **Name**, type **RC-DNAT-01**. 
5. For **Priority**, type **200**. 
6. Under **Rules**, for **Name**, type **RL-01**.
7. For **Protocol**, select **TCP**.
1. For **Source type**, select **IP address**.
1. For **Source**, type *. 
1. For **Destination Addresses**, type the firewall's public IP address. 
1. For **Destination ports**, type **3389**. 
1. For **Translated Address** type the private IP address for the Srv-Workload virtual machine. 
1. For **Translated port**, type **3389**. 
1. Select **Add**. This will take a few minutes to complete.

## Test the firewall

1. Connect a remote desktop to firewall public IP address. You should be connected to the **Srv-Workload** virtual machine.
2. Close the remote desktop.

## Clean up resources

You can keep your firewall resources for further testing, or if no longer needed, delete the **RG-DNAT-Test** resource group to delete all firewall-related resources.

## Next steps

Next, you can monitor the Azure Firewall logs.

[Tutorial: Monitor Azure Firewall logs](./firewall-diagnostics.md)
