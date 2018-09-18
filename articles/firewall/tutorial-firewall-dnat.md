---
title: Filter inbound traffic with Azure Firewall DNAT using the Azure portal
description: In this tutorial, you learn how to deploy and configure Azure Firewall DNAT using the Azure portal. 
services: firewall
author: vhorne

ms.service: firewall
ms.topic: tutorial
ms.date: 9/25/2018
ms.author: victorh
ms.custom: mvc
#Customer intent: As an administrator, I want to deploy and configure Azure Firewall DNAT so that I can control inbound access to resources located in a subnet.
---
# Tutorial: Filter inbound traffic with Azure Firewall DNAT using the Azure portal

You can configure Azure Firewall Destination Network Address Translation (DNAT) to translate and filter inbound traffic to your subnets. Azure Firewall does not have a concept of inbound rules and outbound rules. There are application rules and network rules, and they are applied to any traffic that comes into the firewall. Network rules are applied first, then application rules, and the rules are terminating.

>[!NOTE]
>The Firewall DNAT feature is currently available in Azure PowerShell and REST only.

For example, if a network rule is matched, the packet will not be evaluated by application rules. If there is no network rule match, and if the packet protocol is HTTP/HTTPS, the packet is then evaluated by the application rules. If still no match is found, then the packet is evaluated agains the [infrastructure rule collection](infrastructure-fqdns.md). If there is still no match, then the packet is denied by default.

When you configure DNAT, the NAT rule collection action is set to **Destination Network Address Translation (DNAT)**. The firewall public IP and port translates to a private IP address and port. Then rules are applied as usual, network rules first and then application rules. For example, you might configure a network rule to allow Remote Desktop traffic on TCP port 3389. Address translation happens first and then the network and application rules are applied using the translated addresses.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up a test network environment
> * Deploy a firewall
> * Create a default route
> * Configure a DNAT rule
> * Configure a network rule
> * Test the firewall

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

For this tutorial, you create a two peered VNets:
- **VN-Hub** - the firewall is in this VNet.
- **VN-Spoke** - the workload server is in this VNet.

## Create a resource group
1. Sign in to the Azure portal at [http://portal.azure.com](http://portal.azure.com).
1. On the Azure portal home page, click **Resource groups**, then click **Add**.
2. For **Resource group name**, type **RG-DNAT-Test**.
3. For **Subscription**, select your subscription.
4. For **Resource group location**, select a location. All subsequent resources that you create must be in the same location.
5. Click **Create**.

## Set up the network environment
First, create the VNets and then peer them.

### Create the Hub VNet
1. From the Azure portal home page, click **All services**.
2. Under **Networking**, click **Virtual networks**.
3. Click **Add**.
4. For **Name**, type **VN-Hub**.
5. For **Address space**, type **10.0.0.0/16**.
7. For **Subscription**, select your subscription.
8. For **Resource group**, select **Use existing**, and then select **RG-DNAT-Test**.
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
8. For **Resource group**, select **Use existing**, and then select **RG-DNAT-Test**.
9. For **Location**, select the same location that you used previously.
10. Under **Subnet**, for **Name** type **SN-Workload**.

    The server will be in this subnet.
1. For **Address range**, type **192.168.1.0/24**.
2. Use the other default settings, and then click **Create**.

### Peer the VNets

Now peer the two VNets.

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

2. Click **Review + create**.
3. Review the summary, and then click **Create** to create the firewall.

   This will take a few minutes to deploy.
4. After deployment completes, go to the **RG-DNAT-Test** resource group, and click the **FW-DNAT-test** firewall.
6. Note the private IP address. You'll use it later when you create the default route.


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
1. For **Next hop address**, type the private IP address for the firewall that you noted previously.
2. Click **OK**.


## Configure a DNAT rule

```azurepowershell-interactive
 $rgName  = "RG-DNAT-Test"
 $firewallName = "FW-DNAT-test"
 $publicip = type the Firewall public ip
 $newAddress = type the private IP address for the Srv-Workload virtual machine 
 
# Get Firewall
    $firewall = Get-AzureRmFirewall -ResourceGroupName $rgName -Name $firewallName
  # Create NAT rule
    $natRule = New-AzureRmFirewallNatRule -Name RL-01 -SourceAddress * -DestinationAddress $publicip -DestinationPort 3389 -Protocol TCP -TranslatedAddress $newAddress -TranslatedPort 3389
  # Create NAT rule collection
    $natRuleCollection = New-AzureRmFirewallNatRuleCollection -Name RC-DNAT-01 -Priority 200 -Rule $natRule
  # Add NAT Rule collection to firewall:
    $firewall.AddNatRuleCollection($natRuleCollection)
  # Save:
    $firewall | Set-AzureRmFirewall
```
## Configure a network rule

1. Open the **RG-DNAT-Test**, and click the **FW-DNAT-test** firewall.
1. On the **FW-DNAT-test** page, under **Settings**, click **Rules**.
2. Click **Add network rule collection**.

Configure the rule using the following table and then click **Add**:


|Parameter  |Value  |
|---------|---------|
|Name     |**RC-Net-01**|
|Priority     |**200**|
|Action     |**Allow**|

Under **Rules**:

|Parameter  |Setting  |
|---------|---------|
|Name     |**RL-RDP**|
|Protocol     |**TCP**|
|Source Addresses     |*|
|Destination Addresses     |**Srv-Workload** private IP address|
|Destination ports|**3389**|


## Test the firewall

1. Connect a remote desktop to firewall public IP address. You should be connected to the **Srv-Workload** virtual machine.
3. Close the remote desktop.
4. Change the **RC-Net-01** network rule collection action to **Deny**.
5. Try to connect to firewall public IP address again. This time it should not succeed because of the **Deny** rule.

## Clean up resources

You can keep your firewall resources for the next tutorial, or if no longer needed, delete the **RG-DNAT-Test** resource group to delete all firewall-related resources.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Set up a test network environment
> * Deploy a firewall
> * Create a default route
> * Configure a DNAT rule
> * Configure a network rule
> * Test the firewall

Next, you can monitor the Azure Firewall logs.

> [!div class="nextstepaction"]
> [Tutorial: Monitor Azure Firewall logs](./tutorial-diagnostics.md)
