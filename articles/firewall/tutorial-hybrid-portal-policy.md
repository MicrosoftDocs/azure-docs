---
title: 'Tutorial: Deploy and configure Azure Firewall and policy in a hybrid network by using the Azure portal'
description: In this tutorial, you learn how to deploy and configure Azure Firewall and policy by using the Azure portal.
author: duau
ms.service: azure-firewall
ms.topic: tutorial
ms.date: 03/23/2026
ms.author: duau
ms.custom: sfi-image-nochange
# Customer intent: "As a network administrator, I want to deploy and configure Azure Firewall in a hybrid network environment, so that I can secure and control network access between on-premises resources and Azure virtual networks effectively."
---

# Tutorial: Deploy and configure Azure Firewall and policy in a hybrid network by using the Azure portal

When you connect your on-premises network to an Azure virtual network to create a hybrid network, you need to control access to your Azure network resources as part of your overall security plan.

Azure Firewall and Firewall Policy control network access in a hybrid network by using rules that define allowed and denied network traffic.

For this tutorial, you create three virtual networks:

- **VNet-Hub** - The firewall is in this virtual network.
- **VNet-Spoke** - The spoke virtual network represents the workload located on Azure.
- **VNet-Onprem** - The on-premises virtual network represents an on-premises network. In an actual deployment, you can connect it by using either a VPN or ExpressRoute connection. For simplicity, this tutorial uses a VPN gateway connection, and an Azure-located virtual network represents an on-premises network.

:::image type="content" source="media/tutorial-hybrid-ps/hybrid-network-firewall.png" alt-text="Diagram showing a hybrid network architecture with hub, spoke, and on-premises virtual networks connected through Azure Firewall." lightbox="media/tutorial-hybrid-ps/hybrid-network-firewall.png":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create the firewall hub virtual network
> * Create the spoke virtual network
> * Create the on-premises virtual network
> * Configure and deploy the firewall and policy
> * Create and connect the VPN gateways
> * Peer the hub and spoke virtual networks
> * Create the routes
> * Create the virtual machine
> * Test the firewall

To use Azure PowerShell instead, see [Deploy and configure Azure Firewall in a hybrid network using Azure PowerShell](tutorial-hybrid-ps.md).

## Prerequisites

A hybrid network uses the hub-and-spoke architecture model to route traffic between Azure virtual networks and on-premises networks. The hub-and-spoke architecture has the following requirements:

- To route the spoke subnet traffic through the hub firewall, use a user-defined route (UDR) that points to the firewall with the **Virtual network gateway route propagation** option disabled. The **Virtual network gateway route propagation** disabled option prevents route distribution to the spoke subnets. This option prevents learned routes from conflicting with your UDR. If you want to keep **Virtual network gateway route propagation** enabled, make sure to define specific routes to the firewall to override those routes that are published from on-premises over BGP.
- Configure a UDR on the hub gateway subnet that points to the firewall IP address as the next hop to the spoke networks. No UDR is required on the Azure Firewall subnet, as it learns routes from BGP.

To learn how these routes are created, see [Create the routes](#create-the-routes) in this tutorial.

>[!NOTE]
>Azure Firewall must have direct internet connectivity. If your **AzureFirewallSubnet** learns a default route to your on-premises network through BGP, you must override this route by using a 0.0.0.0/0 UDR with the **NextHopType** value set as **Internet** to maintain direct internet connectivity.
>
>You can configure Azure Firewall to support forced tunneling. For more information, see [Azure Firewall forced tunneling](forced-tunneling.md).

>[!NOTE]
>Traffic between directly peered virtual networks routes directly even if a UDR points to Azure Firewall as the default gateway. To send subnet-to-subnet traffic to the firewall in this scenario, a UDR must contain the target subnet network prefix explicitly on both subnets.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Create the firewall hub virtual network

First, create the resource group to contain the resources for this tutorial:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the Azure portal home page, select **Resource groups** > **Create**.
1. For **Subscription**, select your subscription.
1. For **Resource group name**, enter **FW-Hybrid-Test**.
1. For **Region**, select **(US) East US**. All resources that you create later must be in the same location.
1. Select **Review + Create**, and then select **Create**.

Next, create the virtual network:

> [!NOTE]
> The size of the AzureFirewallSubnet subnet is /26. For more information about the subnet size, see [Azure Firewall FAQ](firewall-faq.yml#why-does-azure-firewall-need-a--26-subnet-size).

1. From the Azure portal home page, select **Create a resource**.
1. Under **Networking**, select **Virtual network**, and then select **Create**.
1. For **Resource group**, select **FW-Hybrid-Test**.
1. For **Name**, enter **VNet-hub**.
1. On the **Security** tab, select **Next**.
1. For **IPv4 Address space**, enter **10.5.0.0/16**.
1. Under **Subnets**, select **default**.
1. For **Subnet purpose**, select **Azure Firewall**.
1. For **Starting address**, enter **10.5.0.0/26**.
1. Select **Save**, select **Review + create**, and then select **Create**.

Create a second subnet for the gateway.

1. On the **VNet-hub** page, select **Subnets**.
1. Select **+Subnet**.
1. For **Subnet purpose**, select **Virtual Network Gateway**.
1. For **Starting address**, enter **10.5.2.0/26**.
1. Select **Add**.

## Create the spoke virtual network

1. From the Azure portal home page, select **Create a resource**.
1. In **Networking**, select **Virtual network**, and then select **Create**.
1. For **Resource group**, select **FW-Hybrid-Test**.
1. For **Name**, enter **VNet-Spoke**.
1. For **Region**, select **(US) East US**.
1. Select **Next**. On the **Security** tab, select **Next**.
1. For **IPv4 address space**, enter **10.6.0.0/16**.
1. Under **Subnets**, select **default**.
1. For **Name**, enter **SN-Workload**.
1. For **Starting address**, enter **10.6.0.0/24**.
1. Select **Save**, select **Review + create**, and then select **Create**.

## Create the on-premises virtual network

1. From the Azure portal home page, select **Create a resource**.
1. In **Networking**, select **Virtual network**, and then select **Create**.
1. For **Resource group**, select **FW-Hybrid-Test**.
1. For **Name**, enter **VNet-OnPrem**.
1. For **Region**, select **(US) East US**.
1. Select **Next**. On the **Security** tab, select **Next**.
1. For **IPv4 address space**, enter **192.168.0.0/16**.
1. Under **Subnets**, select **default**.
1. For **Name**, enter **SN-Corp**.
1. For **Starting address**, enter **192.168.1.0/24**.
1. Select **Save**, select **Review + create**, and then select **Create**.

Create a second subnet for the gateway.

1. On the **VNet-OnPrem** page, select **Subnets**.
1. Select **+Subnet**.
1. For **Subnet purpose**, select **Virtual Network Gateway**.
1. For **Starting address**, enter **192.168.2.0/24**.
1. Select **Add**.

## Configure and deploy the firewall

Deploy the firewall into the firewall hub virtual network.

1. From the Azure portal home page, select **Create a resource**.
1. Search for **Firewall**, select it from the results, and then select **Create**.
1. On **Create a Firewall**, use the following table to configure the firewall:

   |Setting  |Value  |
   |---------|---------|
   |Subscription     |\<your subscription\>|
   |Resource group     |**FW-Hybrid-Test** |
   |Name     |**AzFW01**|
   |Region     |**East US**|
   |Firewall tier|**Standard**|
   |Firewall management|**Use a Firewall Policy to manage this firewall**|
   |Firewall policy|Add new:<br>**hybrid-test-pol**<br>**East US** 
   |Choose a virtual network     |Use existing:<br> **VNet-hub**|
   |Public IP address     |Add new: <br>**fw-pip** |

1. Select **Next : Tags**, **Next: Review + create**, and then **Create**.

   Deployment takes a few minutes.
1. After deployment finishes, go to the **FW-Hybrid-Test** resource group, and select the **AzFW01** firewall.
1. Note the private IP address. You use it later when you create the default route.

### Configure network rules

First, add a network rule to allow web traffic.

1. From the **FW-Hybrid-Test** resource group, select the **hybrid-test-pol** Firewall Policy.
1. Under **Settings**, select **Network rules**.
1. Select **Add a rule collection**.
1. For **Name**, enter `RCNet01`.
1. For **Priority**, enter `100`.
1. For **Rule collection action**, select **Allow**.
1. Under **Rules**, for **Name**, enter `AllowWeb`.
1. For **Source type**, select **IP address**.
1. For **Source**, enter `192.168.1.0/24`.
1. For **Protocol**, select **TCP**.
1. For **Destination Ports**, enter `80`.
1. For **Destination type**, select **IP address**.
1. For **Destination**, enter `10.6.0.0/16`.
1. Select **Add**.

## Create and connect the VPN gateways

The hub and on-premises virtual networks connect through VPN gateways.

### Create the VPN gateways

Create a VPN gateway for both the hub and on-premises virtual networks. Network-to-network configurations require a RouteBased VpnType. Creating a VPN gateway can often take 45 minutes or more, depending on the selected VPN gateway SKU.

Repeat the following steps for each gateway by using the values in the table.

| Setting | Hub gateway | On-premises gateway |
|---------|-------------|-------------------|
| Name | **GW-hub** | **GW-Onprem** |
| Virtual network | **VNet-hub** | **VNet-Onprem** |
| Public IP address | **VNet-hub-GW-pip** | **VNet-Onprem-GW-pip** |
| Second Public IP address | **VNet-hub-GW-pip2** | **VNet-Onprem-GW-pip2** |

1. From the Azure portal home page, select **Create a resource**.
1. In the search box, type **virtual network gateway** and press **Enter**.
1. Select **Virtual network gateway**, and select **Create**.
1. Enter the **Name** from the table.
1. For **Region**, select the same region that you used previously.
1. For **Gateway type**, select **VPN**.
1. For **SKU**, select **VpnGw1**.
1. Select the **Virtual network** from the table.
1. For **Public IP address**, select **Create new**, and enter the name from the table.
1. For **Second Public IP address**, select **Create new**, and enter the name from the table.
1. Accept the remaining defaults, select **Review + create**, and then select **Create**.

### Create the VPN connections

Create the VPN connections between the hub and on-premises gateways. You need a connection from each direction, and the shared key must match for both.

Repeat the following steps for each connection by using the values in the table.

| Setting | Hub to on-premises | On-premises to hub |
|---------|-------------------|-------------------|
| Gateway to open | **GW-hub** | **GW-Onprem** |
| Connection name | **Hub-to-Onprem** | **Onprem-to-Hub** |
| First virtual network gateway | **GW-hub** | **GW-Onprem** |
| Second virtual network gateway | **GW-Onprem** | **GW-hub** |

1. Open the **FW-Hybrid-Test** resource group and select the gateway from the table.
1. Under **Settings**, select **Connections** in the left column.
1. Select **Add**.
1. Enter the **Connection name** from the table.
1. Select **VNet-to-VNet** for **Connection type**.
1. Select **Next : Settings**.
1. Select the **First virtual network gateway** and **Second virtual network gateway** from the table.
1. For **Shared key (PSK)**, enter **AzureA1b2C3**.
1. Select **Review + create**, and then select **Create**.

#### Verify the connection

After about five minutes, the status of both connections should be **Connected**.

## Peer the hub and spoke virtual networks

Peer the hub and spoke virtual networks.

1. Open the **FW-Hybrid-Test** resource group and select the **VNet-hub** virtual network.
1. In the left column, select **Peerings**.
1. Select **Add**.
1. Under **Remote virtual network summary**:

   |Setting name  |Value  |
   |---------|---------|
   |Peering link name | SpoketoHub|
   |Subscription|\<your subscription\>|
   |Virtual network| VNet-Spoke|
   |Allow 'VNet-Spoke' to access 'VNet-hub'|selected|
   |Allow 'VNet-Spoke' to receive forwarded traffic from 'VNet-Hub'|selected|
   |Allow gateway or route server in 'VNet-Spoke' to forward traffic to 'VNet-Hub'| not selected|
   |Enable 'VNet-Spoke' to use 'VNet-hub's' remote gateway or route server|selected|

1. Under **Local virtual network summary**:

   |Setting name  |Value  |
   |---------|---------|
   |Peering link name| HubtoSpoke|
   |Allow 'VNet-hub' to access 'VNet-Spoke'|selected|
   |Allow 'VNet-hub' to receive forwarded traffic from 'VNet-Spoke'|selected|
   |Allow gateway or route server in 'VNet-Hub' to forward traffic to 'VNet-Spoke'|selected|
   |Enable 'VNet-hub' to use 'VNet-Spoke's' remote gateway or route server| not selected|

1. Select **Add**.

   :::image type="content" source="../firewall-manager/media/secure-hybrid-network/firewall-peering.png" lightbox="../firewall-manager/media/secure-hybrid-network/firewall-peering.png" alt-text="Screenshot showing the VNet peering configuration between hub and spoke virtual networks.":::

## Create the routes

Next, create two route tables:

- A route from the hub gateway subnet to the spoke subnet through the firewall IP address
- A default route from the spoke subnet through the firewall IP address

Repeat the following steps for each route table by using the values in the table.

| Setting | Hub-to-spoke route | Default spoke route |
|---------|-------------------|-------------------|
| Route table name | **UDR-Hub-Spoke** | **UDR-DG** |
| Propagate gateway route | Yes (default) | **No** |
| Route name | **ToSpoke** | **ToHub** |
| Destination IP addresses/CIDR ranges | **10.6.0.0/16** | **0.0.0.0/0** |
| Associate virtual network | **VNet-hub** | **VNet-spoke** |
| Associate subnet | **GatewaySubnet** | **SN-Workload** |

1. From the Azure portal home page, select **Create a resource**.
1. In the search box, type **route table** and press **Enter**.
1. Select **Route table**, and then select **Create**.
1. Select **FW-Hybrid-Test** for the resource group.
1. For **Region**, select the same location that you used previously.
1. Enter the route table **Name** from the table. If applicable, set **Propagate gateway route** to **No**.
1. Select **Review + Create**, and then select **Create**.
1. After the route table is created, select it to open the route table page.
1. Under **Settings**, select **Routes** in the left column.
1. Select **Add**.
1. Enter the **Route name** from the table.
1. For **Destination type**, select **IP Addresses**.
1. Enter the **Destination IP addresses/CIDR ranges** from the table.
1. For **Next hop type**, select **Virtual appliance**.
1. For **Next hop address**, type the firewall's private IP address that you noted earlier.
1. Select **Add**.

Associate each route table to its subnet.

1. On the route table page, select **Subnets**.
1. Select **Associate**.
1. Select the **Virtual network** and **Subnet** from the table.
1. Select **OK**.

## Create virtual machines

Create the spoke workload and on-premises virtual machines, and place them in the appropriate subnets.

### Create the workload virtual machine

Create a virtual machine in the spoke virtual network, running NGINX, with no public IP address.

1. From the Azure portal home page, select **Create a resource**.
1. Under **Popular Marketplace products**, select **Ubuntu Server 24.04 LTS**.
1. Enter these values for the virtual machine:
    - **Resource group** - Select **FW-Hybrid-Test**
    - **Virtual machine name**: *VM-Spoke-01*
    - **Region** - Same region that you used previously
    - **Image** - Ubuntu Server 24.04 LTS - x64 Gen2
    - **Size** - Standard_B2s
    - **Authentication type** - SSH public key
    - **Username**: **azureuser**
    - **SSH public key source** - Generate new key pair
    - **Key pair name** - **VM-Spoke-01_key**
1. For **Public inbound ports**, select **None**.
1. Select **Next: Disks**, accept the defaults, and then select **Next: Networking**.
1. Select **VNet-Spoke** for the virtual network and the subnet is **SN-Workload**.
1. For **Public IP**, select **None**.
1. Select **Next: Management**, and then select **Next: Monitoring**.
1. For **Boot diagnostics**, select **Disable**.
1. Select **Review + Create**, review the settings on the summary page, and then select **Create**.
1. On the **Generate new key pair** dialog, select **Download private key and create resource**. Save the key file as **VM-Spoke-01_key.pem**.

### Install Nginx

After you create the virtual machine, install the Nginx web server.

1. From the Azure portal, open the Cloud Shell and make sure that it's set to **Bash**.
1. Run the following command to install Nginx on the virtual machine:

   ```azurecli-interactive
   az vm run-command invoke \
      --resource-group FW-Hybrid-Test \
      --name VM-Spoke-01 \
      --command-id RunShellScript \
      --scripts "sudo apt-get update && sudo apt-get install -y nginx && echo '<h1>'$(hostname)'</h1>' | sudo tee /var/www/html/index.html"
   ```

### Create the on-premises virtual machine

Use this virtual machine to connect by using Azure Bastion. From there, you connect to the spoke server through the firewall.

1. From the Azure portal home page, select **Create a resource**.
1. Under **Popular Marketplace products**, select **Ubuntu Server 24.04 LTS**.
1. Enter these values for the virtual machine:
    - **Resource group** - Select existing, and then select **FW-Hybrid-Test**.
    - **Virtual machine name** - *VM-Onprem*.
    - **Region** - Same region that you used previously.
    - **Image** - Ubuntu Server 24.04 LTS - x64 Gen2
    - **Size** - Standard_B2s
    - **Authentication type** - SSH public key
    - **Username**: **azureuser**
    - **SSH public key source** - Generate new key pair
    - **Key pair name** - **VM-Onprem_key**
1. For **Public inbound ports**, select **None**.
1. Select **Next: Disks**, accept the defaults, and then select **Next: Networking**.
1. Select **VNet-Onprem** for virtual network and the subnet is **SN-Corp**.
1. Select **Next: Management**, and then select **Next: Monitoring**.
1. For **Boot diagnostics**, select **Disable**.
1. Select **Review + Create**, review the settings on the summary page, and then select **Create**.
1. On the **Generate new key pair** dialog, select **Download private key and create resource**. Save the key file as **VM-Onprem_key.pem**.

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]

## Deploy Azure Bastion

Deploy Azure Bastion to provide secure access to the virtual machine.

1. On the Azure portal menu, select **Create a resource**.
1. In the search box, type **Bastion** and select it from the results.
1. Select **Create**.
1. On **Create a Bastion**, configure the following settings:

   | Setting | Value |
   |---------|-------|
   | Subscription | Select your subscription |
   | Resource group | **FW-Hybrid-Test** |
   | Name | **Hub-Bastion** |
   | Region | Same as your other resources |
   | Tier | **Developer** |
   | Virtual network | **VNet-hub** |

1. Select **Review + create**. After validation passes, select **Create**.

## Test the firewall

1. First, note the private IP address for **VM-spoke-01** virtual machine.
1. From the Azure portal, go to the **VM-Onprem** virtual machine.
1. Select **Connect** > **Connect via Bastion**.
1. Select **Use SSH Private Key from Local File**.
1. For **Username**, enter **azureuser**.
1. Browse to and select the **VM-Onprem_key.pem** file you downloaded earlier.
1. Select **Connect**.
1. From the SSH session on **VM-Onprem**, test the web server on the spoke virtual network:

   ```bash
   curl http://<VM-spoke-01 private IP>
   ```

   The web server returns a response.

Next, change the firewall network rule collection action to **Deny** to verify that the firewall rules work as expected.

1. Select the **hybrid-test-pol** Firewall Policy.
1. Select **Rule Collections**.
1. Select the **RCNet01** rule collection.
1. For **Rule collection action**, select **Deny**.
1. Select **Save**.

Run the test again. This time, the test fails.

## Clean up resources

Keep your firewall resources for the next tutorial, or if you no longer need them, delete the **FW-Hybrid-Test** resource group to delete all firewall-related resources.

## Next steps

> [!div class="nextstepaction"]
> [Deploy and configure Azure Firewall Premium](premium-deploy.md)
