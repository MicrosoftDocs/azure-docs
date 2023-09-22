---
title: Deploy and configure Azure Firewall in a hybrid network by using the Azure portal
description: In this article, you learn how to deploy and configure Azure Firewall by using the Azure portal. 
services: firewall
author: vhorne
ms.service: firewall
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 08/31/2023
ms.author: victorh
#Customer intent: As an administrator, I want to control network access from an on-premises network to an Azure virtual network.
---

# Deploy and configure Azure Firewall in a hybrid network by using the Azure portal

When you connect your on-premises network to an Azure virtual network to create a hybrid network, the ability to control access to your Azure network resources is an important part of an overall security plan.

You can use Azure Firewall to control network access in a hybrid network by using rules that define allowed and denied network traffic.

For this article, you create three virtual networks:

- **VNet-Hub**: The firewall is in this virtual network.
- **VNet-Spoke**: The spoke virtual network represents the workload located on Azure.
- **VNet-Onprem**: The on-premises virtual network represents an on-premises network. In an actual deployment, you can connect to it by using either a virtual private network (VPN) connection or an Azure ExpressRoute connection. For simplicity, this article uses a VPN gateway connection, and an Azure-located virtual network represents an on-premises network.

![Diagram that shows a firewall in a hybrid network.](media/tutorial-hybrid-ps/hybrid-network-firewall.png)

If you want to use Azure PowerShell instead to complete the procedures in this article, see [Deploy and configure Azure Firewall in a hybrid network by using Azure PowerShell](tutorial-hybrid-ps.md).

> [!NOTE]
> This article uses classic Azure Firewall rules to manage the firewall. The preferred method is to use an [Azure Firewall Manager policy](../firewall-manager/policy-overview.md). To complete this procedure by using an Azure Firewall Manager policy, see [Tutorial: Deploy and configure Azure Firewall and policy in a hybrid network using the Azure portal](tutorial-hybrid-portal-policy.md).

## Prerequisites

A hybrid network uses the hub-and-spoke architecture model to route traffic between Azure virtual networks and on-premises networks. The hub-and-spoke architecture has the following requirements:

- Set **Use this virtual network's gateway or Route Server** when you're peering **VNet-Hub** to **VNet-Spoke**. In a hub-and-spoke network architecture, a gateway transit allows the spoke virtual networks to share the VPN gateway in the hub, instead of deploying VPN gateways in every spoke virtual network.

   Additionally, routes to the gateway-connected virtual networks or on-premises networks automatically propagate to the routing tables for the peered virtual networks via the gateway transit. For more information, see [Configure VPN gateway transit for virtual network peering](../vpn-gateway/vpn-gateway-peering-gateway-transit.md).

- Set **Use the remote virtual network's gateways or Route Server** when you peer **VNet-Spoke** to **VNet-Hub**. If **Use the remote virtual network's gateways or Route Server** is set and **Use this virtual network's gateway or Route Server** on remote peering is also set, the spoke virtual network uses gateways of the remote virtual network for transit.
- To route the spoke subnet traffic through the hub firewall, you can use a user-defined route (UDR) that points to the firewall with the **Virtual network gateway route propagation** option disabled. Disabling this option prevents route distribution to the spoke subnets, so learned routes can't conflict with your UDR. If you want to keep **Virtual network gateway route propagation** enabled, make sure that you define specific routes to the firewall to override routes that are published from on-premises over Border Gateway Protocol (BGP).
- Configure a UDR on the hub gateway subnet that points to the firewall IP address as the next hop to the spoke networks. No UDR is required on the Azure Firewall subnet, because it learns routes from BGP.

The [Create the routes](#create-the-routes) section later in this article shows how to create these routes.

Azure Firewall must have direct internet connectivity. If your **AzureFirewallSubnet** subnet learns a default route to your on-premises network via BGP, you must override it by using a 0.0.0.0/0 UDR with the `NextHopType` value set as `Internet` to maintain direct internet connectivity.

> [!NOTE]
> You can configure Azure Firewall to support forced tunneling. For more information, see [Azure Firewall forced tunneling](forced-tunneling.md).

Traffic between directly peered virtual networks is routed directly, even if a UDR points to Azure Firewall as the default gateway. To send subnet-to-subnet traffic to the firewall in this scenario, a UDR must contain the target subnet network prefix explicitly on both subnets.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create the firewall hub virtual network

First, create the resource group to contain the resources:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the Azure portal home page, select **Resource groups** > **Create**.
1. For **Subscription**, select your subscription.
1. For **Resource group**, enter **RG-fw-hybrid-test**.
1. For **Region**, select a region. All resources that you create later must be in the same region.
1. Select **Review + Create**.
1. Select **Create**.

Now, create the virtual network.

> [!NOTE]
> The size of the **AzureFirewallSubnet** subnet is /26. For more information about the subnet size, see [Azure Firewall FAQ](firewall-faq.yml#why-does-azure-firewall-need-a--26-subnet-size).

1. On the Azure portal home page, select **Create a resource**.
1. In the search box, enter **virtual network**.
1. Select **Virtual network**, and then select **Create**.
1. For **Resource group**, select **RG-fw-hybrid-test**.
1. For **Virtual network name**, enter **VNet-Hub**.
1. For **Region**, select the region that you used previously.
1. Select **Next**.
1. On the **Security** tab, select **Next**.
1. For **IPv4 Address space**, delete the default address and enter **10.5.0.0/16**.
1. Under **Subnets**, delete the default subnet.
1. Select **Add a subnet**.
1. On the **Add a subnet** page, for **Subnet template**, select **Azure Firewall**.
1. Select **Add**.

Create a second subnet for the gateway:

1. Select **Add a subnet**.
1. For **Subnet template**, select **Virtual Network Gateway**.
1. For **Starting address**, accept the default value of **10.5.1.0**.
1. For **Subnet size**, accept the default value of **/27**.
1. Select **Add**.
1. Select **Review + create**.
1. Select **Create**.

## Create the spoke virtual network

1. On the Azure portal home page, select **Create a resource**.
1. In the search box, enter **virtual network**.
1. Select **Virtual network**, and then select **Create**.
1. For **Resource group**, select **RG-fw-hybrid-test**.
1. For **Name**, enter **VNet-Spoke**.
1. For **Region**, select the region that you used previously.
1. Select **Next**.
1. On the **Security** tab, select **Next**.
1. For **IPv4 Address space**, delete the default address and enter **10.6.0.0/16**.
1. Under **Subnets**, delete the default subnet.
1. Select **Add a subnet**.
1. For **Name**, enter **SN-Workload**.
1. For **Starting address**, accept the default value of **10.6.0.0**.
1. For **Subnet size**, accept the default value of **/24**.
1. Select **Add**.
1. Select **Review + create**.
1. Select **Create**.

## Create the on-premises virtual network

1. On the Azure portal home page, select **Create a resource**.
1. In the search box, enter **virtual network**.
1. Select **Virtual network**, and then select **Create**.
1. For **Resource group**, select **RG-fw-hybrid-test**.
1. For **Name**, enter **VNet-Onprem**.
1. For **Region**, select the region that you used previously.
1. Select **Next**.
1. On the **Security** tab, select **Next**.
1. For **IPv4 Address space**, delete the default address and enter **192.168.0.0/16**.
1. Under **Subnets**, delete the default subnet.
1. Select **Add a subnet**.
1. For **Name**, enter **SN-Corp**.
1. For **Starting address**, accept the default value of **192.168.0.0**.
1. For **Subnet size**, accept the default value of **/24**.
1. Select **Add**.

Now, create a second subnet for the gateway:

1. Select **Add a subnet**.
1. For **Subnet template**, select **Virtual Network Gateway**.
1. For **Starting address**, accept the default value of **192.168.1.0**.
1. For **Subnet size**, accept the default value of **/27**.
1. Select **Add**.
1. Select **Review + create**.
1. Select **Create**.

## Configure and deploy the firewall

Deploy the firewall into the firewall hub's virtual network:

1. On the Azure portal home page, select **Create a resource**.
1. In the search box, enter **firewall**.
1. Select **Firewall**, and then select **Create**.
1. On the **Create a Firewall** page, use the following table to configure the firewall:

   |Setting  |Value  |
   |---------|---------|
   |**Subscription**| Select your subscription.|
   |**Resource group**|Enter **RG-fw-hybrid-test**. |
   |**Name**|Enter **AzFW01**.|
   |**Region**|Select the region that you used before.|
   |**Firewall SKU** |Select **Standard**.|
   |**Firewall management**|Select **Use Firewall rules (classic) to manage this firewall**.|
   |**Choose a virtual network**|Select **Use existing** > **VNet-Hub**.|
   |**Public IP address**|Select **Add new** > **fw-pip**. |

1. Select **Review + create**.
1. Review the summary, and then select **Create** to create the firewall.

   The firewall takes a few minutes to deploy.
1. After deployment finishes, go to the **RG-fw-hybrid-test** resource group and select the **AzFW01** firewall.
1. Note the private IP address. You use it later when you create the default route.

### Configure network rules

First, add a network rule to allow web traffic:

1. On the **AzFW01** page, select **Rules (classic)**.
1. Select the **Network rule collection** tab.
1. Select **Add network rule collection**.
1. For **Name**, enter **RCNet01**.
1. For **Priority**, enter **100**.
1. For **Rule collection action**, select **Allow**.
1. Under **Rules IP Addresses**, for **Name**, enter **AllowWeb**.
1. For **Protocol**, select **TCP**.
1. For **Source type**, select **IP address**.
1. For **Source**, enter **192.168.0.0/24**.
1. For **Destination type**, select **IP address**.
1. For **Destination Address**, enter **10.6.0.0/16**.
1. For **Destination Ports**, enter **80**.

Now, add a rule to allow RDP traffic. On the second rule row, enter the following information:

1. For **Name**, enter **AllowRDP**.
1. For **Protocol**, select **TCP**.
1. For **Source type**, select **IP address**.
1. For **Source**, enter **192.168.0.0/24**.
1. For **Destination type**, select **IP address**.
1. For **Destination Address**, enter **10.6.0.0/16**.
1. For **Destination Ports**, enter **3389**.
1. Select **Add**.

## Create and connect the VPN gateways

The hub and on-premises virtual networks are connected via VPN gateways.

### Create a VPN gateway for the hub virtual network

Create the VPN gateway for the hub virtual network. Network-to-network configurations require a route-based VPN type. Creating a VPN gateway can often take 45 minutes or more, depending on the SKU that you select.

1. On the Azure portal home page, select **Create a resource**.
1. In the search box, enter **virtual network gateway**.
1. Select **Virtual network gateway**, and then select **Create**.
1. For **Name**, enter **GW-hub**.
1. For **Region**, select the same region that you used previously.
1. For **Gateway type**, select **VPN**.
1. For **VPN type**, select **Route-based**.
1. For **SKU**, select **Basic**.
1. For **Virtual network**, select **VNet-Hub**.
1. For **Public IP address**, select **Create new** and enter **VNet-Hub-GW-pip** for the name.
1. For **Enable active-active mode**, select **Disabled**.
1. Accept the remaining defaults, and then select **Review + create**.
1. Review the configuration, and then select **Create**.

### Create a VPN gateway for the on-premises virtual network

Create the VPN gateway for the on-premises virtual network. Network-to-network configurations require a route-based VPN type. Creating a VPN gateway can often take 45 minutes or more, depending on the SKU that you select.

1. On the Azure portal home page, select **Create a resource**.
1. In the search box, enter **virtual network gateway**.
1. Select **Virtual network gateway**, and then select **Create**.
1. For **Name**, enter **GW-Onprem**.
1. For **Region**, select the same region that you used previously.
1. For **Gateway type**, select **VPN**.
1. For **VPN type**, select **Route-based**.
1. For **SKU**, select **Basic**.
1. For **Virtual network**, select **VNet-Onprem**.
1. For **Public IP address**, select **Create new** and enter **VNet-Onprem-GW-pip** for the name.
1. For **Enable active-active mode**, select **Disabled**.
1. Accept the remaining defaults, and then select **Review + create**.
1. Review the configuration, and then select **Create**.

### Create the VPN connections

Now you can create the VPN connections between the hub and on-premises gateways.

In the following steps, you create the connection from the hub virtual network to the on-premises virtual network. The examples show a shared key, but you can use your own value for the shared key. The important thing is that the shared key must match for both connections. Creating a connection can take a short while to complete.

1. Open the **RG-fw-hybrid-test** resource group and select the **GW-hub** gateway.
1. Select **Connections** in the left column.
1. Select **Add**.
1. For the connection name, enter **Hub-to-Onprem**.
1. For **Connection type**, select **VNet-to-VNet** .
1. Select **Next**.
1. For **First virtual network gateway**, select **GW-hub**.
1. For **Second virtual network gateway**, select **GW-Onprem**.
1. For **Shared key (PSK)**, enter **AzureA1b2C3**.
1. Select **Review + Create**.
1. Select **Create**.

Create the virtual network connection between on-premises and the hub. The following steps are similar to the previous ones, except that you create the connection from **VNet-Onprem** to **VNet-Hub**. Make sure that the shared keys match. The connection is established after a few minutes.

1. Open the **RG-fw-hybrid-test** resource group and select the **GW-Onprem** gateway.
1. Select **Connections** in the left column.
1. Select **Add**.
1. For the connection name, enter **Onprem-to-Hub**.
1. For **Connection type**, select **VNet-to-VNet**.
1. Select **Next: Settings**.
1. For **First virtual network gateway**, select **GW-Onprem**.
1. For **Second virtual network gateway**, select **GW-hub**.
1. For **Shared key (PSK)**, enter **AzureA1b2C3**.
1. Select **Review + Create**.
1. Select **Create**.

### Verify the connections

After about five minutes, the status of both connections should be **Connected**.

![Screenshot that shows gateway connections.](media/tutorial-hybrid-portal/gateway-connections.png)

## Peer the hub and spoke virtual networks

Now, peer the hub and spoke virtual networks:

1. Open the **RG-fw-hybrid-test** resource group and select the **VNet-Hub** virtual network.
1. In the left column, select **Peerings**.
1. Select **Add**.
1. Under **This virtual network**:

   |Setting name  |Setting  |
   |---------|---------|
   |**Peering link name**|Enter **HubtoSpoke**.|
   |**Traffic to remote virtual network**|Select **Allow**.|
   |**Traffic forwarded from remote virtual network**|Select **Allow**.|
   |**Virtual network gateway**|Select **Use this virtual network's gateway**.|

1. Under **Remote virtual network**:

   |Setting name  |Value  |
   |---------|---------|
   |**Peering link name**|Enter **SpoketoHub**.|
   |**Virtual network deployment model**|Select **Resource manager**.|
   |**Subscription**|Select your subscription.|
   |**Virtual network**|Select **VNet-Spoke**.|
   |**Traffic to remote virtual network**|Select **Allow**.|
   |**Traffic forwarded from remote virtual network**|Select **Allow**.|
   |**Virtual network gateway**|Select **Use the remote virtual network's gateway**.|

1. Select **Add**.

The following screenshot shows the settings to use when you peer hub and spoke virtual networks:

:::image type="content" source="media/tutorial-hybrid-portal/firewall-peering.png" alt-text="Screenshot that shows selections for peering hub and spoke virtual networks.":::

## Create the routes

In the following steps, you create these routes:

- A route from the hub gateway subnet to the spoke subnet through the firewall IP address
- A default route from the spoke subnet through the firewall IP address

To create the routes:

1. On the Azure portal home page, select **Create a resource**.
1. In the search box, enter **route table**.
1. Select **Route table**, and then select **Create**.
1. For the resource group, select **RG-fw-hybrid-test**.
1. For **Region**, select the same location that you used previously.
1. For the name, enter **UDR-Hub-Spoke**.
1. Select **Review + Create**.
1. Select **Create**.
1. After the route table is created, select it to open the route table page.
1. Select **Routes** in the left column.
1. Select **Add**.
1. For the route name, enter **ToSpoke**.
1. For **Destination type**, select **IP addresses**.
1. For **Destination IP addresses/CIDR ranges**, enter **10.6.0.0/16**.
1. For the next hop type, select **Virtual appliance**.
1. For the next hop address, enter the firewall's private IP address that you noted earlier.
1. Select **Add**.

Now, associate the route to the subnet:

1. On the **UDR-Hub-Spoke - Routes** page, select **Subnets**.
1. Select **Associate**.
1. Under **Virtual network**, select **VNet-Hub**.
1. Under **Subnet**, select **GatewaySubnet**.
1. Select **OK**.

Create the default route from the spoke subnet:

1. On the Azure portal home page, select **Create a resource**.
1. In the search box, enter **route table**.
1. Select **Route table**, and then select **Create**.
1. For the resource group, select **RG-fw-hybrid-test**.
1. For **Region**, select the same location that you used previously.
1. For the name, enter **UDR-DG**.
1. For **Propagate gateway route**, select **No**.
1. Select **Review + Create**.
1. Select **Create**.
1. After the route table is created, select it to open the route table page.
1. Select **Routes** in the left column.
1. Select **Add**.
1. For the route name, enter **ToHub**.
1. For **Destination type**, select **IP addresses**.
1. For **Destination IP addresses/CIDR ranges**, enter **0.0.0.0/0**.
1. For the next hop type, select **Virtual appliance**.
1. For the next hop address, enter the firewall's private IP address that you noted earlier.
1. Select **Add**.

Associate the route to the subnet:

1. On the **UDR-DG - Routes** page, select **Subnets**.
1. Select **Associate**.
1. Under **Virtual network**, select **VNet-Spoke**.
1. Under **Subnet**, select **SN-Workload**.
1. Select **OK**.

## Create virtual machines

Create the spoke workload and on-premises virtual machines, and place them in the appropriate subnets.

### Create the workload virtual machine

Create a virtual machine in the spoke virtual network that runs Internet Information Services (IIS) and has no public IP address:

1. On the Azure portal home page, select **Create a resource**.
1. Under **Popular Marketplace products**, select **Windows Server 2019 Datacenter**.
1. Enter these values for the virtual machine:
    - **Resource group**: Select **RG-fw-hybrid-test**.
    - **Virtual machine name**: Enter **VM-Spoke-01**.
    - **Region**: Select the same region that you used previously.
    - **User name**: Enter a username.
    - **Password**: Enter a password.
1. For **Public inbound ports**, select **Allow selected ports**, and then select **HTTP (80)** and **RDP (3389)**.
1. Select **Next: Disks**.
1. Accept the defaults and select **Next: Networking**.
1. For the virtual network, select **VNet-Spoke**. The subnet is **SN-Workload**.
1. For **Public IP**, select **None**.
1. Select **Next: Management**.
1. Select **Next: Monitoring**.
1. For **Boot diagnostics**, select **Disable**.
1. Select **Review+Create**, review the settings on the summary page, and then select **Create**.

### Install IIS

1. On the Azure portal, open Azure Cloud Shell and make sure that it's set to **PowerShell**.
1. Run the following command to install IIS on the virtual machine, and change the location if necessary:

   ```azurepowershell-interactive
   Set-AzVMExtension `
           -ResourceGroupName RG-fw-hybrid-test `
           -ExtensionName IIS `
           -VMName VM-Spoke-01 `
           -Publisher Microsoft.Compute `
           -ExtensionType CustomScriptExtension `
           -TypeHandlerVersion 1.4 `
           -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell      Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}' `
           -Location EastUS
   ```

### Create the on-premises virtual machine

Create a virtual machine that you use to connect via remote access to the public IP address. From there, you can connect to the spoke server through the firewall.

1. On the Azure portal home page, select **Create a resource**.
1. Under **Popular**, select **Windows Server 2019 Datacenter**.
1. Enter these values for the virtual machine:
    - **Resource group**: Select **Existing**, and then select **RG-fw-hybrid-test**.
    - **Virtual machine name**: Enter **VM-Onprem**.
    - **Region**: Select the same region that you used previously.
    - **User name**: Enter a username.
    - **Password**: Enter a user password.
1. For **Public inbound ports**, select **Allow selected ports**, and then select **RDP (3389)**.
1. Select **Next: Disks**.
1. Accept the defaults and select **Next: Networking**.
1. For the virtual network, select **VNet-Onprem**. The subnet is **SN-Corp**.
1. Select **Next: Management**.
1. Select **Next: Monitoring**.
1. For **Boot diagnostics**, select **Disable**.
1. Select **Review+Create**, review the settings on the summary page, and then select **Create**.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Test the firewall

1. Note the private IP address for the **VM-Spoke-01** virtual machine.

1. On the Azure portal, connect to the **VM-Onprem** virtual machine.

1. Open a web browser on **VM-Onprem**, and browse to `http://<VM-Spoke-01 private IP>`.

   The **VM-Spoke-01** webpage should open.

   ![Screenshot that shows the webpage for the spoke virtual machine.](media/tutorial-hybrid-portal/VM-Spoke-01-web.png)

1. From the **VM-Onprem** virtual machine, open a remote access connection to **VM-Spoke-01** at the private IP address.

   Your connection should succeed, and you should be able to sign in.

Now that you've verified that the firewall rules are working, you can:

- Browse to the web server on the spoke virtual network.
- Connect to the server on the spoke virtual network by using RDP.

Next, change the action for the collection of firewall network rules to **Deny**, to verify that the firewall rules work as expected:

1. Select the **AzFW01** firewall.
2. Select **Rules (classic)**.
3. Select the **Network rule collection** tab, and select the **RCNet01** rule collection.
4. For **Action**, select **Deny**.
5. Select **Save**.

Close any existing remote access connections. Run the tests again to test the changed rules. They should all fail this time.

## Clean up resources

You can keep your firewall resources for further testing. If you no longer need them, delete the **RG-fw-hybrid-test** resource group to delete all firewall-related resources.

## Next steps

[Monitor Azure Firewall logs](./firewall-diagnostics.md)
