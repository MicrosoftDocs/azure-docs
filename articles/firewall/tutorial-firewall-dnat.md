---
title: Filter inbound Internet or intranet traffic with Azure Firewall DNAT using the portal
description: In this article, you learn how to deploy and configure Azure Firewall DNAT using the Azure portal. 
services: firewall
author: varunkalyana
ms.service: azure-firewall
ms.topic: how-to
ms.date: 05/07/2025
ms.author: varunkalyana
ms.custom: mvc
#Customer intent: As an administrator, I want to deploy and configure Azure Firewall DNAT so that I can control inbound internet access to resources located in a subnet.
# Customer intent: As a network administrator, I want to deploy and configure DNAT rules on Azure Firewall so that I can effectively manage and control inbound traffic to my network resources.
---

# Filter inbound Internet or intranet traffic with Azure Firewall DNAT using the Azure portal

You can configure Azure Firewall Destination Network Address Translation (DNAT) to translate and filter inbound internet traffic to your subnets or intranet traffic between private networks. When you configure DNAT, the NAT rule collection action is set to **DNAT**. Each rule in the NAT rule collection can then be used to translate your firewall's public or private IP address and port to a private IP address and port. DNAT rules implicitly add a corresponding network rule to allow the translated traffic. For security reasons, it's recommended to add a specific source to allow DNAT access to the network and avoid using wildcards. To learn more about Azure Firewall rule processing logic, see [Azure Firewall rule processing logic](rule-processing.md).

> [!NOTE]
> This article uses classic Firewall rules to manage the firewall. The preferred method is to use [Firewall Policy](../firewall-manager/policy-overview.md). To complete this procedure using Firewall Policy, see [Tutorial: Filter inbound Internet traffic with Azure Firewall policy DNAT using the Azure portal](tutorial-firewall-dnat-policy.md).

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a resource group

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the Azure portal home page, select **Resource groups**, then select **Create**.
3. For **Subscription**, select your subscription.
4. For **Resource group**, type **RG-DNAT-Test**.
5. For **Region**, select a region. All other resources that you create must be in the same region.
6. Select **Review + create**.
7. Select **Create**.

## Set up the network environment

For this article, you create two peered VNets:

- **VN-Hub** - the firewall is in this virtual network.
- **VN-Spoke** - the workload server is in this virtual network.

First, create the VNets and then peer them.

### Create the Hub virtual network

1. From the Azure portal home page, select **All services**.
2. Under **Networking**, select **Virtual networks**.
3. Select **Create**.
4. For **Resource group**, select **RG-DNAT-Test**.
5. For **Name**, type **VN-Hub**.
6. For **Region**, select the same region that you used before.
7. Select **Next**.
8. On the **Security** tab, select **Next**.
9. For **IPv4 Address space**, accept the default **10.0.0.0/16**.
10. Under **Subnets**, select **default**.
11. For **Subnet template**, select **Azure Firewall**.

   The firewall is in this subnet, and the subnet name **must** be AzureFirewallSubnet.
   > [!NOTE]
   > The size of the AzureFirewallSubnet subnet is /26. For more information about the subnet size, see [Azure Firewall FAQ](firewall-faq.yml#why-does-azure-firewall-need-a--26-subnet-size).

12. Select **Save**.
13. Select **Review + create**.
14. Select **Create**.

### Create a spoke virtual network

1. From the Azure portal home page, select **All services**.
2. Under **Networking**, select **Virtual networks**.
3. Select **Create**.
4. For **Resource group**, select **RG-DNAT-Test**.
5. For **Name**, type **VN-Spoke**.
6. For **Region**, select the same region that you used before.
7. Select **Next**.
8. On the **Security** tab, select **Next**.
9. For **IPv4 Address space**, edit the default and type **192.168.0.0/16**.
10. Under **Subnets**, select **default**.
11. For the subnet **Name**, type **SN-Workload**.
12. For **Starting address**, type **192.168.1.0**.
13. For **Subnet size**, select **/24**.
14. Select **Save**.
15. Select **Review + create**.
16. Select **Create**.

### Peer the VNets

Now peer the two VNets.

1. Select the **VN-Hub** virtual network.
2. Under **Settings**, select **Peerings**.
3. Select **Add**.
4. Under **This virtual network**, for the **Peering link name**, type **Peer-HubSpoke**.
5. Under **Remote virtual network**, for **Peering link name**, type **Peer-SpokeHub**.
6. Select **VN-Spoke** for the virtual network.
7. Accept all the other defaults, and then select **Add**.

## Create a virtual machine

Create a workload virtual machine, and place it in the **SN-Workload** subnet.

1. From the Azure portal menu, select **Create a resource**.
2. Under **Popular Marketplace products**, select **Windows Server 2019 Datacenter**.

**Basics**

1. For **Subscription**, select your subscription.
2. For **Resource group**, select **RG-DNAT-Test**.
3. For **Virtual machine name**, type **Srv-Workload**.
4. For **Region**, select the same location that you used previously.
5. Type a username and password.
6. Select **Next: Disks**.

**Disks**

1. Select **Next: Networking**.

**Networking**

1. For **Virtual network**, select **VN-Spoke**.
2. For **Subnet**, select **SN-Workload**.
3. For **Public IP**, select **None**.
4. For **Public inbound ports**, select **None**.
5. Leave the other default settings and select **Next: Management**.

**Management**

1. Select **Next: Monitoring**.

**Monitoring**

1. For **Boot diagnostics**, select **Disable**.
2. Select **Review + Create**.

**Review + Create**

Review the summary, and then select **Create**. This process takes a few minutes to complete.

After the deployment finishes, note the private IP address of the virtual machine. You need this IP address later when configuring the firewall. Select the virtual machine name, go to **Overview**, and under **Networking**, note the private IP address.

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]

## Deploy the firewall

1. From the portal home page, select **Create a resource**.
2. Search for **Firewall**, and then select **Firewall**.
3. Select **Create**.
4. On the **Create a Firewall** page, use the following table to configure the firewall:

   | Setting               | Value                           |
   |-----------------------|---------------------------------|
   | Subscription          | \<your subscription\>           |
   | Resource group        | Select **RG-DNAT-Test**         |
   | Name                  | **FW-DNAT-test**                |
   | Region                | Select the same location used previously |
   | Firewall SKU          | **Standard**                    |
   | Firewall management   | **Use Firewall rules (classic) to manage this firewall** |
   | Choose a virtual network | **Use existing**: VN-Hub     |
   | Public IP address     | **Add new**, Name: **fw-pip**   |

5. Accept the other defaults, and then select **Review + create**.
6. Review the summary, and then select **Create** to deploy the firewall.

   This process takes a few minutes to complete.
7. After deployment completes, go to the **RG-DNAT-Test** resource group and select the **FW-DNAT-test** firewall.
8. Note the firewall's private and public IP addresses. You use them later when creating the default route and NAT rule.

## Create a default route

For the **SN-Workload** subnet, configure the outbound default route to go through the firewall.

> [!IMPORTANT]
> You don't need to configure an explicit route back to the firewall at the destination subnet. Azure Firewall is a stateful service and handles the packets and sessions automatically. Creating this route would result in an asymmetrical routing environment, interrupting the stateful session logic and causing dropped packets and connections.

1. From the Azure portal home page, select **Create a resource**.
2. Search for **Route table** and select it.
3. Select **Create**.
4. For **Subscription**, select your subscription.
5. For **Resource group**, select **RG-DNAT-Test**.
6. For **Region**, select the same region used previously.
7. For **Name**, type **RT-FWroute**.
8. Select **Review + create**.
9. Select **Create**.
10. Select **Go to resource**.
11. Select **Subnets**, and then select **Associate**.
12. For **Virtual network**, select **VN-Spoke**.
13. For **Subnet**, select **SN-Workload**.
14. Select **OK**.
15. Select **Routes**, and then select **Add**.
16. For **Route name**, type **FW-DG**.
17. For **Destination type**, select **IP Addresses**.
18. For **Destination IP addresses/CIDR ranges**, type **0.0.0.0/0**.
19. For **Next hop type**, select **Virtual appliance**.

    Azure Firewall is a managed service, but selecting virtual appliance works in this situation.
20. For **Next hop address**, type the private IP address of the firewall noted previously.
21. Select **Add**.

## Configure a NAT rule

1. Open the **RG-DNAT-Test** resource group, and select the **FW-DNAT-test** firewall.
2. On the **FW-DNAT-test** page, under **Settings**, select **Rules (classic)**.
3. Select **Add NAT rule collection**.
4. For **Name**, type **RC-DNAT-01**.
5. For **Priority**, type **200**.
6. Under **Rules**, for **Name**, type **RL-01**.
7. For **Protocol**, select **TCP**.
8. For **Source type**, select **IP address**.
9. For **Source**, type *.
10. For **Destination Addresses**, type the firewall's public IP address.
11. For **Destination ports**, type **3389**.
12. For **Translated Address**, type the private IP address of the Srv-Workload virtual machine.
13. For **Translated port**, type **3389**.
14. Select **Add**.

This process takes a few minutes to complete.

## Test the firewall

1. Connect a remote desktop to the firewall's public IP address. You should be connected to the **Srv-Workload** virtual machine.
2. Close the remote desktop.

## Clean up resources

You can keep your firewall resources for further testing, or if no longer needed, delete the **RG-DNAT-Test** resource group to delete all firewall-related resources.

## Next steps

Next, you can monitor the Azure Firewall logs.

[Tutorial: Monitor Azure Firewall logs](./firewall-diagnostics.md)
