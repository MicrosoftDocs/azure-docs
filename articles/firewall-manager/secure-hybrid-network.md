---
title: 'Tutorial: Secure your hub virtual network using Azure Firewall Manager'
description: In this tutorial, you learn how to secure your virtual network with Azure Firewall Manager using the Azure portal.
services: firewall-manager
author: duongau
ms.service: azure-firewall-manager
ms.topic: tutorial
ms.date: 01/21/2026
ms.author: duau
ms.custom: sfi-image-nochange
---


# Tutorial: Secure your hub virtual network using Azure Firewall Manager


When you connect your on-premises network to an Azure virtual network to create a hybrid network, the ability to control access to your Azure network resources is an important part of an overall security plan.

Using Azure Firewall Manager, you can create a hub virtual network to secure your hybrid network traffic destined to private IP addresses, Azure PaaS, and the Internet. You can use Azure Firewall Manager to control network access in a hybrid network using policies that define allowed and denied network traffic.

Firewall Manager also supports a secured virtual hub architecture. For a comparison of the secured virtual hub and hub virtual network architecture types, see [What are the Azure Firewall Manager architecture options?](vhubs-and-vnets.md)

For this tutorial, you create three virtual networks:


- **VNet-Hub** - the firewall is in this virtual network.

- **VNet-Spoke** - the spoke virtual network represents the workload located on Azure.

- **VNet-Onprem** - The on-premises virtual network represents an on-premises network. In an actual deployment, it can be connected using either a VPN or ExpressRoute connection. For simplicity, this tutorial uses a VPN gateway connection, and an Azure-located virtual network is used to represent an on-premises network.

:::image type="content" source="media/tutorial-hybrid-portal/hybrid-network-firewall.png" alt-text="Screenshot of an Azure Firewall Manager hub hybrid network." lightbox="media/tutorial-hybrid-portal/hybrid-network-firewall.png":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a firewall policy
> * Create the virtual networks
> * Configure and deploy the firewall
> * Create and connect the VPN gateways
> * Peer the hub and spoke virtual networks
> * Create the routes
> * Create the virtual machines
> * Test the firewall



## Prerequisites


A hybrid network uses the hub-and-spoke architecture model to route traffic between Azure VNets and on-premises networks. The hub-and-spoke architecture has the following requirements:


- To route the spoke subnet traffic through the hub firewall, you need a User Defined route (UDR) that points to the firewall with the **Virtual network gateway route propagation** setting disabled. This option prevents route distribution to the spoke subnets. This prevents learned routes from conflicting with your UDR.

- Configure a UDR on the hub gateway subnet that points to the firewall IP address as the next hop to the spoke networks. No UDR is required on the Azure Firewall subnet, as it learns routes from BGP.

See the [Create Routes](#create-the-routes) section in this tutorial to see how these routes are created.

> [!NOTE]
> Azure Firewall must have direct Internet connectivity. If your AzureFirewallSubnet learns a default route to your on-premises network via BGP, you must override this with a 0.0.0.0/0 UDR with the **NextHopType** value set as **Internet** to maintain direct Internet connectivity.
>
> Azure Firewall can be configured to support forced tunneling. For more information, see [Azure Firewall forced tunneling](../firewall/forced-tunneling.md).

> [!NOTE]
> Traffic between directly peered VNets is routed directly even if a UDR points to Azure Firewall as the default gateway. To send subnet to subnet traffic to the firewall in this scenario, a UDR must contain the target subnet network prefix explicitly on both subnets.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.


## Create a Firewall Policy



1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the Azure portal search bar, enter **Firewall Manager**. Select **Firewall Policies** in the search results.

1. Select **+ Create**.

1. In **Create an Azure Firewall Policy**, select your subscription, and for Resource group, select **Create new** and create a resource group named **FW-Hybrid-Test**.

1. For the policy name, enter **Pol-Net01**.

1. For Region, select **East US**.

1. Select **Next : DNS Settings**.

1. Select **Next : TLS inspection**

1. Select **Next:Rules**.

1. Select **Add a rule collection**.

1. For **Name**, enter **RCNet01**.

1. For **Rule collection type**, select **Network**.

1. For **Priority**, enter **100**.

1. For **Action**, select **Allow**.

1. Under **Rules**, for **Name**, enter **AllowWeb**.

1. Select **IP Address** in **Source type**.

1. For **Source**, enter **192.168.1.0/24**.

1. For **Protocol**, select **TCP**.

1. For **Destination Ports**, enter **80**.

1. For **Destination Type**, select **IP Address**.

1. For **Destination**, enter **10.6.0.0/16**.

1. Select **Add**.

1. Select **Review + Create**.

1. Review the details and then select **Create**.


## Create the firewall hub virtual network


> [!NOTE]
> The size of the AzureFirewallSubnet subnet is /26. For more information about the subnet size, see [Azure Firewall FAQ](../firewall/firewall-faq.yml#why-does-azure-firewall-need-a--26-subnet-size).


1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual network** in the search results.

1. Select **Create**.

1. For **Subscription**, select your subscription.

1. For **Resource group**, select **FW-Hybrid-Test**.

1. For **Name**, enter **VNet-Hub**.

1. For **Region**, select **East US**.

1. Select **Next**.

1. On the **Security**, select **Next**.


1. For **IPv4 address space**, enter **10.5.0.0/16**.

1. Under **Subnets**, select **default**.

1. For **Subnet purpose**, select **Azure Firewall**.

1. For **Starting address**, enter **10.5.0.0/26**.

1. Accept the other default settings, and then select **Save**.

1. Select **Review + create**.

1. Select **Create**.

Add another subnet with a subnet purpose set to **Virtual Network Gateway** with a starting address of **10.5.1.0/27**. This subnet is used for the VPN gateway.


## Create the spoke virtual network



1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual network** in the search results.

1. Select **Create**.

1. For **Subscription**, select your subscription.

1. For **Resource group**, select **FW-Hybrid-Test**.

1. For **Name**, enter **VNet-Spoke**.

1. For **Region**, select **East US**.

1. Select **Next**.

1. On the **Security** page, select **Next**.

1. Select **Next : IP Addresses**.

1. For **IPv4 address space**, enter **10.6.0.0/16**.

1. Under **Subnets**, select **default**.

1. Change the **Name** to **SN-Workload**.

1. For **Starting address**, enter **10.6.0.0/24**.

1. Accept the other default settings, and then select **Save**.

1. Select **Review + create**.

1. Select **Create**.



## Create the on-premises virtual network



1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual network** in the search results.

1. Select **Create**.

1. For **Subscription**, select your subscription.

1. For **Resource group**, select **FW-Hybrid-Test**.

1. For **Virtual network name**, enter **VNet-Onprem**.

1. For **Region**, select **East US**.

1. Select **Next**.

1. On the **Security** page, select **Next**.


1. For **IPv4 address space**, enter **192.168.0.0/16**.

1. Under **Subnets**, select **default**.

1. Change the **Name** to **SN-Corp**.

1. For **Starting address**, enter **192.168.1.0/24**.

1. Accept the other default settings, and then select **Save**.

1. Select **Add a subnet**.

1. For **Subnet purpose**, select **Virtual Network Gateway**.

1. For **Starting address** enter **192.168.2.0/27**.

1. Select **Add**.

1. Select **Review + create**.

1. Select **Create**.





## Configure and deploy the firewall


When security policies are associated with a hub, it's referred to as a *hub virtual network*.

Convert the **VNet-Hub** virtual network into a *hub virtual network* and secure it with Azure Firewall.


1. In the Azure portal search bar, enter **Firewall Manager** and press **Enter**.

1. In the right pane, select **Overview**.

1. On the Azure Firewall Manager page, under **Add security to virtual networks**, select **View hub virtual networks**.

1. Under **Virtual Networks**, select the check box for **VNet-Hub**.

1. Select **Manage Security**, and then select **Deploy a Firewall with Firewall Policy**.

1. On the **Convert virtual networks** page, under **Azure Firewall tier**, select **Premium**. Under **Firewall Policy**, select the check box for **Pol-Net01**.

1. Select **Next : Review + confirm**

1. Review the details and then select **Confirm**.


   This takes a few minutes to deploy.

1. After deployment completes, go to the **FW-Hybrid-Test** resource group, and select the firewall.

1. Note the firewall **Private IP** address on the **Overview** page. You use it later when you create the default route.


## Deploy Azure Bastion


Deploy Azure Bastion Developer edition to securely connect to the virtual machines for testing.


1. In the search box at the top of the portal, enter **Bastion**. Select **Bastions** from the search results.

1. Select **Create**.

1. On the **Create a Bastion** page, enter or select the following values:

   | Setting | Value |
   | ------- | ----- |
   | **Project details** | |
   | Subscription | Select your Azure subscription. |
   | Resource group | Select **FW-Hybrid-Test**. |
   | **Instance details** | |
   | Name | Enter **Bastion-Hub**. |
   | Region | Select **East US**. |
   | Tier | Select **Developer**. |
   | Virtual network | Select **VNet-Hub**. |
   | Subnet | The **AzureBastionSubnet** is created automatically with address space **10.5.2.0/26**. |


1. Select **Review + create**.

1. Review the settings and select **Create**.

   The deployment takes a few minutes to complete.


## Create and connect the VPN gateways


The hub and on-premises virtual networks are connected via VPN gateways.


### Create a VPN gateway for the hub virtual network


Now create the VPN gateway for the hub virtual network. Network-to-network configurations require a RouteBased VpnType. Creating a VPN gateway can often take 45 minutes or more, depending on the selected VPN gateway SKU.


1. In the search box at the top of the portal, enter **virtual network gateway**. Select **Virtual network gateways** in the search results.

1. Select **Virtual network gateway**, and select **Create**.

1. For **Name**, enter **GW-hub**.

1. For **Region**, select **(US) East US**.

1. For **Gateway type**, select **VPN**.

1. For **SKU**, select **VpnGw2**.

1. For **Generation**, select **Generation2**.

1. For **Virtual network**, select **VNet-Hub**.

1. For **Public IP address**, select **Create new**, and enter **VNet-Hub-GW-pip** for the name.

1. For **Enable active-active mode**, select **Disabled**.

1. Accept the remaining defaults and then select **Review + create**.

1. Review the configuration, then select **Create**.


### Create a VPN gateway for the on-premises virtual network


Now create the VPN gateway for the on-premises virtual network. Network-to-network configurations require a RouteBased VpnType. Creating a VPN gateway can often take 45 minutes or more, depending on the selected VPN gateway SKU.


1. In the search box at the top of the portal, enter **virtual network gateway**. Select **Virtual network gateways** in the search results.

1. Select **Virtual network gateway**, and select **Create**.

1. For **Name**, enter **GW-Onprem**.

1. For **Region**, select **(US) East US**.

1. For **Gateway type**, select **VPN**.

1. For **SKU**, select **VpnGw2**.

1. For **Generation**, select **Generation2**.

1. For **Virtual network**, select **VNet-Onprem**.

1. For **Public IP address**, select **Create new**, and enter **VNet-Onprem-GW-pip** for the name.

1. For **Enable active-active mode**, select **Disabled**.

1. Accept the remaining defaults and then select **Review + create**.

1. Review the configuration, then select **Create**.


### Create the VPN connections


Now you can create the VPN connections between the hub and on-premises gateways.

In this step, you create the connection from the hub virtual network to the on-premises virtual network. A shared key is referenced in the examples. You can use your own values for the shared key. The important thing is that the shared key must match for both connections. It takes some time to create the connection.


1. Open the **FW-Hybrid-Test** resource group and select the **GW-hub** gateway.

1. In the left column, under **Settings**, select **Connections**.

1. Select **Add**.

1. For the connection name, enter **Hub-to-Onprem**.

1. Select **VNet-to-VNet** for **Connection type**.

1. Select **Next : Settings**.

1. For the **First virtual network gateway**, select **GW-hub**.

1. For the **Second virtual network gateway**, select **GW-Onprem**.

1. For **Shared key (PSK)**, enter **AzureA1b2C3**.

1. Select **Review + create**.

1. Select **Create**.

Create the on-premises to hub virtual network connection. This step is similar to the previous one, except you create the connection from VNet-Onprem to VNet-Hub. Make sure the shared keys match. The connection will be established after a few minutes.


1. Open the **FW-Hybrid-Test** resource group and select the **GW-Onprem** gateway.

1. Select **Connections** in the left column.

1. Select **Add**.

1. For the connection name, enter **Onprem-to-Hub**.

1. Select **VNet-to-VNet** for **Connection type**.

1. Select **Next : Settings**.

1. For the **First virtual network gateway**, select **GW-Onprem**.

1. For the **Second virtual network gateway**, select **GW-hub**.

1. For **Shared key (PSK)**, enter **AzureA1b2C3**.

1. Select **OK**.



#### Verify the connection


After about five minutes or so after the second network connection is deployed, the status of both connections should be **Connected**.

:::image type="content" source="media/secure-hybrid-network/gateway-connections.png" alt-text="Screenshot of the VPN gateway connections." lightbox="media/secure-hybrid-network/gateway-connections.png":::


## Peer the hub and spoke virtual networks


Now peer the hub and spoke virtual networks.


1. Open the **FW-Hybrid-Test** resource group and select the **VNet-Hub** virtual network.

1. In the left column, select **Peerings**.

1. Select **Add**.

1. Under **Remote virtual network summary**:

   |Setting name  |Value  |
   |---------|---------|
   |Peering link name | SpoketoHub|
   |Virtual network deployment model| Resource Manager|
   |Subscription|\<your subscription\>|
   |Virtual network| VNet-Spoke|
   |Allow 'VNet-Spoke' to access 'VNet-Hub'|selected|
   |Allow 'VNet-Spoke' to receive forwarded traffic from 'VNet-Hub'|selected|
   |Allow gateway or route server in 'VNet-Spoke' to forward traffic to 'VNet-Hub'| not selected|
   |Enable 'VNet-Spoke' to use 'VNet-Hub's' remote gateway or route server|selected|


1. Under **Local virtual network summary**:


   |Setting name  |Value  |
   |---------|---------|
   |Peering link name| HubtoSpoke|
   |Allow 'VNet-Hub' to access 'VNet-Spoke'|selected|
   |Allow 'VNet-Hub' to receive forwarded traffic from 'VNet-Spoke'|selected|
   |Allow gateway or route server in 'VNet-Hub' to forward traffic to 'VNet-Spoke'|selected|
   |Enable 'VNet-Hub' to use 'VNet-Spoke's' remote gateway or route server| not selected|



1. Select **Add**.

   :::image type="content" source="media/secure-hybrid-network/firewall-peering.png" alt-text="Screenshot of VNet peering." lightbox="media/secure-hybrid-network/firewall-peering.png":::


## Create the routes


Next, create a couple routes:


- A route from the hub gateway subnet to the spoke subnet through the firewall IP address

- A default route from the spoke subnet through the firewall IP address


1. From the Azure portal home page, select **Create a resource**.

1. In the search text box, enter **route table** and press **Enter**.

1. Select **Route table**.

1. Select **Create**.

1. Select the **FW-Hybrid-Test** for the resource group.

1. For **Region**, select **East US**.

1. For the name, enter **UDR-Hub-Spoke**.

1. Select **Review + Create**.

1. Select **Create**.

1. After the route table is created, select it to open the route table page.

1. Select **Routes** in the left column.

1. Select **Add**.

1. For the route name, enter **ToSpoke**.

1. For **Destination type**, select **IP addresses**.

1. For **Destination IP addresses/CIDR ranges**, enter **10.6.0.0/16**.

1. For next hop type, select **Virtual appliance**.

1. For next hop address, enter the firewall's private IP address that you noted earlier.

1. Select **Add**.

Now associate the route to the subnet.


1. On the **UDR-Hub-Spoke - Routes** page, select **Subnets**.

1. Select **Associate**.

4. Under **Virtual network**, select **VNet-Hub**.

1. Under **Subnet**, select **GatewaySubnet**.

1. Select **OK**.

Now create the default route from the spoke subnet.


1. From the Azure portal home page, select **Create a resource**.

1. In the search text box, enter **route table** and press **Enter**.

1. Select **Route table**.

1. Select **Create**.

1. Select the **FW-Hybrid-Test** for the resource group.

1. For **Region**, select **East US**.

1. For the name, enter **UDR-DG**.

1. For **Propagate gateway routes**, select **No**.

1. Select **Review + create**.

1. Select **Create**.

1. After the route table is created, select it to open the route table page.

1. Select **Routes** in the left column.

1. Select **Add**.

1. For the route name, enter **ToHub**.

1. For **Destination type**, select **IP addresses**

1. For **Destination IP addresses/CIDR ranges**, enter **0.0.0.0/0**.

1. For next hop type, select **Virtual appliance**.

1. For next hop address, enter the firewall's private IP address that you noted earlier.

1. Select **Add**.

Now associate the route to the subnet.


1. On the **UDR-DG - Routes** page, select **Subnets**.

1. Select **Associate**.

1. Under **Virtual network**, select **VNet-spoke**.

1. Under **Subnet**, select **SN-Workload**.

1. Select **OK**.


## Create virtual machines


Now create the spoke workload and on-premises virtual machines, and place them in the appropriate subnets.


### Create the workload virtual machine


Create a virtual machine in the spoke virtual network with a web server, with no public IP address.


1. From the Azure portal home page, select **Create a resource**.

1. In the search box at the top of the portal enter **Virtual machine**, select **Virtual machines** in the search results.

1. Select **Create** > **Virtual machine**.

1. Enter or select these values for the virtual machine:

   | Setting | Value |
   | ------- | ----- |
   | **Project details** | |
   | Subscription  | Select your Azure subscription. |
   | Resource group | Select **FW-Hybrid-Test**. |
   | **Instance details** | |
   | Virtual machine name | Enter **VM-Spoke-01**. |
   | Region | Select **East US**. |
   | Availability options | Select **No infrastructure redundancy required**. |
   | Security type | Select **Standard**. |
   | Image | Select **Ubuntu Server 24.04 LTS -x64 Gen2** |
   | Size | Select a size for the virtual machine. |
   | **Administrator account** | |
   | Username | Enter **azureuser**. |
   | SSH public key source | Select **Generate new key pair**. |
   | Key pair name | Enter **VM-Spoke-01_key**. |


1. Under **Inbound port rules**, **Public inbound ports**, select **None**.

1. Select **Next: Disks**.

1. Accept the defaults and select **Next: Networking**.

1. Select **VNet-Spoke** for the virtual network and the subnet is **SN-Workload**.

1. For **Public IP**, select **None**.

1. Select **Review + create**.

1. Review the settings on the summary page, and then select **Create**.

1. When prompted, select **Download private key and create resource**. Save the private key file to your computer.

1. After the deployment completes, note the private IP address for later use.


### Install a web server


Connect to the virtual machine and install a web server for testing.


1. On the Azure portal menu, select **Resource groups** or search for and select *Resource groups* from any page. Select the **FW-Hybrid-Test** resource group.

1. Select the **VM-Spoke-01** virtual machine.

1. Select **Operations** > **Run command** > **RunShellScript**.

1. In the script box, enter the following commands:

   ```bash
   sudo apt-get update
   sudo apt-get install -y nginx
   echo "<html><body><h1>VM-Spoke-01</h1><p>Hybrid network test page</p></body></html>" | sudo tee /var/www/html/index.html
   ```


1. Select **Run**.

1. Wait for the script to complete successfully.


### Create the on-premises virtual machine


This is a virtual machine that you use to connect through Azure Bastion to test the firewall.


1. From the Azure portal home page, select **Create a resource**.

1. In the search box at the top of the portal enter **Virtual machine**, select **Virtual machines** in the search results.

1. Select **Create** > **Virtual machine**.

1. Enter or select these values for the virtual machine:

   | Setting | Value |
   | ------- | ----- |
   | **Project details** | |
   | Subscription  | Select your Azure subscription. |
   | Resource group | Select **FW-Hybrid-Test**. |
   | **Instance details** | |
   | Virtual machine name | Enter **VM-Onprem**. |
   | Region | Select **East US**. |
   | Availability options | Select **No infrastructure redundancy required**. |
   | Security type | Select **Standard**. |
   | Image | Select **Ubuntu Server 24.04 LTS -x64 Gen2** |
   | Size | Select a size for the virtual machine. |
   | **Administrator account** | |
   | Username | Enter **azureuser**. |
   | SSH public key source | Select **Generate new key pair**. |
   | Key pair name | Enter **VM-Onprem_key**. |


1. Under **Inbound port rules**, **Public inbound ports**, select **None**.

1. Select **Next: Disks**.

1. Accept the defaults and select **Next: Networking**.

1. Select **VNet-Onprem** for the virtual network and verify the subnet is **SN-Corp**.

1. For **Public IP**, select **None**.

1. Select **Review + create**.

1. Review the settings on the summary page, and then select **Create**.

1. When prompted, select **Download private key and create resource**. Save the private key file to your computer.

1. After the deployment completes, note the private IP address for later use.


## Test the firewall


Now, test the firewall to confirm that it works as expected.


1. Connect to **VM-Onprem** virtual machine using Azure Bastion and the SSH key you downloaded:
   - From the Azure portal, select the **VM-Onprem** virtual machine.
   - Select **Connect** > **Connect** > **Connect via Bastion**.
   - For **Authentication Type**, select **SSH Private Key from Local File**.
   - For **Username**, enter **azureuser**.
   - For **Local File**, select **Upload a file** and browse to the **VM-Onprem_key.pem** file you downloaded earlier.
   - Select **Connect**.


1. From the SSH session, test the web server on VM-Spoke-01 using its private IP address (you can find this on the VM-Spoke-01 Overview page):

   ```bash
   curl http://10.0.1.4
   ```

   You should see the HTML response from the VM-Spoke-01 web page:

   ```html
   <html><body><h1>VM-Spoke-01</h1><p>Hybrid network test page</p></body></html>
   ```


1. Close the Bastion SSH session.

So now you verified that the firewall rules are working:


- You can browse the web server on the spoke virtual network.

Next, change the firewall network rule collection action to **Deny** to verify that the firewall rules work as expected.


1. Open the **FW-Hybrid-Test** resource group and select the **Pol-Net01** firewall policy.

1. Under **Settings**, select **Rule Collections**.

1. Select the **RCNet01** rule collection.

1. For **Rule collection action**, select **Deny**.

1. Select **Save**.

Close any existing remote desktops and browsers on **VM-Onprem** before testing the changed rules. After the rule collection update is complete, run the tests again. They should all fail to connect this time.


## Clean up resources


You can keep your firewall resources for further investigation, or if no longer needed, delete the **FW-Hybrid-Test** resource group to delete all firewall-related resources.


## Next steps


> [!div class="nextstepaction"]
> [Tutorial: Secure your virtual WAN using Azure Firewall Manager](secure-cloud-network.md)
