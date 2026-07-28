---
title: 'Tutorial: Filter inbound Internet traffic with Azure Firewall DNAT policy using the portal'
description: In this tutorial, you learn how to deploy and configure Azure Firewall policy DNAT to publish a web server using the Azure portal. 
services: firewall
author: varunkalyana
ms.service: azure-firewall
ms.topic: tutorial
ms.date: 01/22/2026
ms.author: varunkalyana
ms.custom: mvc
#Customer intent: As an administrator, I want to deploy and configure Azure Firewall policy DNAT so that I can publish web applications and control inbound Internet access to resources located in a subnet.
---

# Tutorial: Filter inbound Internet traffic with Azure Firewall policy DNAT using the Azure portal

You can configure Azure Firewall policy Destination Network Address Translation (DNAT) to translate and filter inbound internet traffic to your subnets. When you configure DNAT, the *rule collection action* is set to **DNAT**. Each rule in the NAT rule collection can then be used to translate your firewall public IP address and port to a private IP address and port. DNAT rules implicitly add a corresponding network rule to allow the translated traffic. For security reasons, the recommended approach is to add a specific source to allow DNAT access to the network and avoid using wildcards. To learn more about Azure Firewall rule processing logic, see [Azure Firewall rule processing logic](rule-processing.md).

This tutorial demonstrates publishing a web server using DNAT.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up a test network environment
> * Deploy a firewall and policy
> * Create a default route
> * Deploy and configure a web server
> * Configure a DNAT rule to publish the web server
> * Test the firewall

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.



## Create a resource group

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the Azure portal home page, select **Resource groups**, then select **Add**.
4. For **Subscription**, select your subscription.
1. For **Resource group name**, type **RG-DNAT-Test**.
5. For **Region**, select a region. All other resources that you create must be in the same region.
6. Select **Review + create**.
1. Select **Create**.

## Set up the network environment

For this tutorial, you create a two peered VNets:

- **VN-Hub** - the firewall is in this VNet.
- **VN-Spoke** - the workload server is in this VNet.

First, create the VNets and then peer them.

### Create the Hub VNet

1. From the Azure portal home page, select **All services**.
2. Under **Networking**, select **Virtual networks**.
3. Select **Add**.
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
3. Select **Add**.
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
2. Under **Popular**, select **Ubuntu Server 22.04 LTS**.

**Basics**

1. For **Subscription**, select your subscription.
1. For **Resource group**, select **RG-DNAT-Test**.
1. For **Virtual machine name**, type **Srv-Workload**.
1. For **Region**, select the same location that you used previously.
1. For **Image**, select **Ubuntu Server 22.04 LTS - x64 Gen2**.
1. For **Size**, select **Standard_B2s**.
1. For **Authentication type**, select **SSH public key**.
1. For **Username**, type **azureuser**.
1. For **SSH public key source**, select **Generate new key pair**.
1. For **Key pair name**, type **Srv-Workload_key**.
1. Select **None** in **Public inbound ports**.
1. Select **Next: Disks**.

**Disks**
- Select **Next: Networking**.

**Networking**

1. For **Virtual network**, select **VN-Spoke**.
2. For **Subnet**, select **SN-Workload**.
3. For **Public IP**, select **None**.
4. For **Public inbound ports**, select **None**. 
2. Leave the other default settings and select **Next: Management**.

**Management**

- Select **Next: Monitoring**.

**Monitoring**

1. For **Boot diagnostics**, select **Disable**.
1. Select **Review + Create**.

**Review + Create**

Review the summary, and then select **Create**. 

- On the **Generate new key pair** dialog, select **Download private key and create resource**. Save the key file as **Srv-Workload_key.pem**.

After deployment finishes, note the private IP address for the virtual machine. It will be used later when you configure the firewall. Select the virtual machine name, and under **Settings**, select **Networking** to find the private IP address.

## Install web server

Use the Azure portal Run Command feature to install a web server on the virtual machine.

1. Navigate to the **Srv-Workload** virtual machine in the Azure portal.
1. Under **Operations**, select **Run command**.
1. Select **RunShellScript**.
1. In the **Run Command Script** window, paste the following script:

   ```bash
   sudo apt-get update
   sudo apt-get install -y nginx
   echo "<h1>Azure Firewall DNAT Demo - $(hostname)</h1>" | sudo tee /var/www/html/index.html
   ```

1. Select **Run**.
1. Wait for the script to complete. The output should show successful installation of Nginx.


## Deploy the firewall and policy

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
   |Firewall management|**Use a Firewall Policy to manage this firewall**|
   |Firewall policy|**Add new**:<br>**fw-dnat-pol**<br>your selected region 
   |Choose a virtual network     |**Use existing**: VN-Hub|
   |Public IP address     |**Add new**, Name: **fw-pip**.|

1. Uncheck the box next to **Enable Firewall Management NIC**.
5. Accept the other defaults, and then select **Review + create**.
6. Review the summary, and then select **Create** to create the firewall.

   This takes a few minutes to deploy.
7. After deployment completes, go to the **RG-DNAT-Test** resource group, and select the **FW-DNAT-test** firewall.
8. Note the firewall's private and public IP addresses. You'll use them later when you create the default route and NAT rule.

## Create a default route

For the **SN-Workload** subnet, you configure the outbound default route to go through the firewall.

> [!IMPORTANT]
> You do not need to configure an explicit route back to the firewall at the destination subnet. Azure Firewall is a stateful service and handles the packets and sessions automatically. If you create this route, you'll create an asymmetrical routing environment that interrupts the stateful session logic and results in dropped packets and connections.

1. From the Azure portal home page, select **All services**.
2. Under **Networking**, select **Route tables**.
3. Select **Add**.
5. For **Subscription**, select your subscription.
1. For **Resource group**, select **RG-DNAT-Test**.
1. For **Region**, select the same region that you used previously.
1. For **Name**, type **RT-FW-route**.
1. Select **Review + create**.
1. Select **Create**.
1. Select **Go to resource**.
1. Select **Subnets**, and then select **Associate**.
1. For **Virtual network**, select **VN-Spoke**.
1. For **Subnet**, select **SN-Workload**.
1. Select **OK**.
1. Select **Routes**, and then select **Add**.
1. For **Route name**, type **fw-dg**.
1. For **Address prefix**, type **0.0.0.0/0**.
1. For **Next hop type**, select **Virtual appliance**.

    Azure Firewall is actually a managed service, but virtual appliance works in this situation.
18. For **Next hop address**, type the private IP address for the firewall that you noted previously.
19. Select **OK**.

## Configure a DNAT rule

This rule allows inbound HTTP traffic from the Internet to reach the web server through the firewall.

1. Open the **RG-DNAT-Test** resource group, and select the **fw-dnat-pol** firewall policy. 
1. Under **Settings**, select **DNAT rules**.
2. Select **Add a rule collection**.
3. For **Name**, type **web-access**.
1. For **Priority**, type **200**.
1. For **Rule collection group**, select **DefaultDnatRuleCollectionGroup**.
1. Under **Rules**, for **Name**, type **http-dnat**.
1. For **Source type**, select **IP address**.
1. For **Source**, type **\*** to allow traffic from any source.
1. For **Protocol**, select **TCP**.
1. For **Destination Ports**, type **80**.
1. For **Destination Type**, select **IP Address**.
1. For **Destination**, type the firewall public IP address.
1. For **Translated address**, type the **Srv-Workload** private IP address.
1. For **Translated port**, type **80**.
1. Select **Add**.

## Test the firewall

Now test the DNAT rule to verify that the web server is accessible through the firewall.

1. Open a web browser.
1. Navigate to `http://<firewall-public-ip>` (use the firewall's public IP address you noted earlier).
1. You should see the web page displaying: **Azure Firewall DNAT Demo - Srv-Workload**

The DNAT rule successfully translates the incoming HTTP request on the firewall's public IP address to the web server's private IP address. This demonstrates how Azure Firewall DNAT can be used to publish web applications while keeping the backend servers in a private subnet.

## Clean up resources

You can keep your firewall resources for the next tutorial, or if no longer needed, delete the **RG-DNAT-Test** resource group to delete all firewall-related resources.

## Next steps

For advanced DNAT scenarios involving overlapped networks or non-routable network access, see:
> [!div class="nextstepaction"]
> [Deploy Azure Firewall private IP DNAT for overlapped and non-routable networks](tutorial-private-ip-dnat.md)
