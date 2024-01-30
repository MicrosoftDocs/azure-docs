---
title: 'Tutorial: Secure your hub virtual network using Azure Firewall Manager'
description: In this tutorial, you learn how to secure your virtual network with Azure Firewall Manager using the Azure portal.
services: firewall-manager
author: vhorne
ms.service: firewall-manager
ms.custom: ignite-2022
ms.topic: tutorial
ms.date: 09/26/2023
ms.author: victorh
---

# Tutorial: Secure your hub virtual network using Azure Firewall Manager

When you connect your on-premises network to an Azure virtual network to create a hybrid network, the ability to control access to your Azure network resources is an important part of an overall security plan.

Using Azure Firewall Manager, you can create a hub virtual network to secure your hybrid network traffic destined to private IP addresses, Azure PaaS, and the Internet. You can use Azure Firewall Manager to control network access in a hybrid network using policies that define allowed and denied network traffic.

Firewall Manager also supports a secured virtual hub architecture. For a comparison of the secured virtual hub and hub virtual network architecture types, see [What are the Azure Firewall Manager architecture options?](vhubs-and-vnets.md)

For this tutorial, you create three virtual networks:

- **VNet-Hub** - the firewall is in this virtual network.
- **VNet-Spoke** - the spoke virtual network represents the workload located on Azure.
- **VNet-Onprem** - The on-premises virtual network represents an on-premises network. In an actual deployment, it can be connected using either a VPN or ExpressRoute connection. For simplicity, this tutorial uses a VPN gateway connection, and an Azure-located virtual network is used to represent an on-premises network.

![Hybrid network](media/tutorial-hybrid-portal/hybrid-network-firewall.png)

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

- Set **AllowGatewayTransit** when peering VNet-Hub to VNet-Spoke. In a hub-and-spoke network architecture, a gateway transit allows the spoke virtual networks to share the VPN gateway in the hub, instead of deploying VPN gateways in every spoke virtual network.

   Additionally, routes to the gateway-connected virtual networks or on-premises networks are automatically propagated to the routing tables for the peered virtual networks using the gateway transit. For more information, see [Configure VPN gateway transit for virtual network peering](../vpn-gateway/vpn-gateway-peering-gateway-transit.md).

- Set **UseRemoteGateways** when you peer VNet-Spoke to VNet-Hub. If **UseRemoteGateways** is set and **AllowGatewayTransit** on remote peering is also set, the spoke virtual network uses gateways of the remote virtual network for transit.
- To route the spoke subnet traffic through the hub firewall, you need a User Defined route (UDR) that points to the firewall with the **Virtual network gateway route propagation** setting disabled. This option prevents route distribution to the spoke subnets. This prevents learned routes from conflicting with your UDR.
- Configure a UDR on the hub gateway subnet that points to the firewall IP address as the next hop to the spoke networks. No UDR is required on the Azure Firewall subnet, as it learns routes from BGP.

See the [Create Routes](#create-the-routes) section in this tutorial to see how these routes are created.

>[!NOTE]
>Azure Firewall must have direct Internet connectivity. If your AzureFirewallSubnet learns a default route to your on-premises network via BGP, you must override this with a 0.0.0.0/0 UDR with the **NextHopType** value set as **Internet** to maintain direct Internet connectivity.
>
>Azure Firewall can be configured to support forced tunneling. For more information, see [Azure Firewall forced tunneling](../firewall/forced-tunneling.md).

>[!NOTE]
>Traffic between directly peered VNets is routed directly even if a UDR points to Azure Firewall as the default gateway. To send subnet to subnet traffic to the firewall in this scenario, a UDR must contain the target subnet network prefix explicitly on both subnets.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a Firewall Policy

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the Azure portal search bar, type **Firewall Manager** and press **Enter**.
3. On the Azure Firewall Manager page, under **Security**, select **Azure firewall policies**.

   :::image type="content" source="media/secure-hybrid-network/firewall-manager-policy.png" alt-text="Screenshot showing Firewall Manager main page."lightbox="media/secure-hybrid-network/firewall-manager-policy.png":::

1. Select **Create Azure Firewall Policy**.
1. Select your subscription, and for Resource group, select **Create new** and create a resource group named **FW-Hybrid-Test**.
2. For the policy name, type **Pol-Net01**.
3. For Region, select **East US**.
1. Select **Next : DNS Settings**.
1. Select **Next : TLS inspection**
1. Select **Next:Rules**.
1. Select **Add a rule collection**.
1. For **Name**, type **RCNet01**.
1. For **Rule collection type**, select **Network**.
1. For **Priority**, type **100**.
1. For **Action**, select **Allow**.
1. Under **Rules**, for **Name**, type **AllowWeb**.
1. For **Source**, type **192.168.1.0/24**.
1. For **Protocol**, select **TCP**.
1. For **Destination Ports**, type **80**.
1. For **Destination Type**, select **IP Address**.
1. For **Destination**, type **10.6.0.0/16**.
1. On the next rule row, enter the following information:

    Name: type **AllowRDP**<br>
    Source: type **192.168.1.0/24**.<br>
    Protocol, select **TCP**<br>
    Destination Ports, type **3389**<br>
    Destination Type, select **IP Address**<br>
    For Destination, type **10.6.0.0/16**

1. Select **Add**.
2. Select **Review + Create**.
3. Review the details and then select **Create**.

## Create the firewall hub virtual network

> [!NOTE]
> The size of the AzureFirewallSubnet subnet is /26. For more information about the subnet size, see [Azure Firewall FAQ](../firewall/firewall-faq.yml#why-does-azure-firewall-need-a--26-subnet-size).

1. From the Azure portal home page, select **Create a resource**.
2. Search for **Virtual network** and then select **Virtual network**.
1. Select **Create**.
1. For **Subscription**, select your subscription.
1. For **Resource group**, select **FW-Hybrid-Test**.
1. For **Name**, type **VNet-hub**.
1. For **Region**, select **East US**.
1. Select **Next**.
1. On the **Security**, select **Next**.

1. For **IPv4 address space**, type **10.5.0.0/16**.
1. Under **Subnets**, select **default**.
1. For Subnet template, select **Azure Firewall**.
1. For **Starting address**, type **10.5.0.0/26**.
1. Accept the other default settings, and then select **Save**.
1. Select **Review + create**.
1. Select **Create**.

Add another subnet named **GatewaySubnet** with an address space of 10.5.1.0/27. This subnet is used for the VPN gateway. 

## Create the spoke virtual network

1. From the Azure portal home page, select **Create a resource**.
2. Search for **Virtual network** and then select **Virtual network**.
1. Select **Create**.
1. For **Subscription**, select your subscription.
1. For **Resource group**, select **FW-Hybrid-Test**.
1. For **Name**, type **VNet-Spoke**.
1. For **Region**, select **East US**.
1. Select **Next**.
1. On the **Security** page, select **Next**.
1. Select **Next : IP Addresses**.
1. For **IPv4 address space**, type **10.6.0.0/16**.
1. Under **Subnets**, select **default**.
1. Change the **Name** to **SN-Workload**.
1. For **Starting address**, type **10.6.0.0/24**.
1. Accept the other default settings, and then select **Save**.
1. Select **Review + create**.
1. Select **Create**.


## Create the on-premises virtual network

1. From the Azure portal home page, select **Create a resource**.
2. Search for **Virtual network** and then select **Virtual network**.
1. Select **Create**.
1. For **Subscription**, select your subscription.
1. For **Resource group**, select **FW-Hybrid-Test**.
1. For **Virtual network name**, type **VNet-OnPrem**.
1. For **Region**, select **East US**.
1. Select **Next**.
1. On the **Security** page, select **Next**.

1. For **IPv4 address space**, type **192.168.0.0/16**.
1. Under **Subnets**, select **default**.
1. Change the **Name** to **SN-Corp**.
1. For **Starting address**, type **192.168.1.0/24**.
1. Accept the other default settings, and then select **Save**.
2. Select **Add a subnet**.
1. For **Subnet template**, select **Virtual Network Gateway**.
1. For **Starting address** type **192.168.2.0/27**.
1. Select **Add**.
1. Select **Review + create**.
1. Select **Create**.




## Configure and deploy the firewall

When security policies are associated with a hub, it's referred to as a *hub virtual network*.

Convert the **VNet-Hub** virtual network into a *hub virtual network* and secure it with Azure Firewall.

1. In the Azure portal search bar, type **Firewall Manager** and press **Enter**.
1. In the right pane, select **Overview**.
1. On the Azure Firewall Manager page, under **Add security to virtual networks**, select **View hub virtual networks**.
1. Under **Virtual Networks**, select the check box for **VNet-hub**.
1. Select **Manage Security**, and then select **Deploy a Firewall with Firewall Policy**.
1. On the **Convert virtual networks** page, under **Azure Firewall tier**, select **Premium**. Under **Firewall Policy**, select the check box for **Pol-Net01**.
1. Select **Next : Review + confirm**
1. Review the details and then select **Confirm**.


   This takes a few minutes to deploy.
7. After deployment completes, go to the **FW-Hybrid-Test** resource group, and select the firewall.
9. Note the **Firewall private IP** address on the **Overview** page. You use it later when you create the default route.

## Create and connect the VPN gateways

The hub and on-premises virtual networks are connected via VPN gateways.

### Create a VPN gateway for the hub virtual network

Now create the VPN gateway for the hub virtual network. Network-to-network configurations require a RouteBased VpnType. Creating a VPN gateway can often take 45 minutes or more, depending on the selected VPN gateway SKU.

1. From the Azure portal home page, select **Create a resource**.
2. In the search text box, type **virtual network gateway** and press **Enter**.
3. Select **Virtual network gateway**, and select **Create**.
4. For **Name**, type **GW-hub**.
5. For **Region**, select **(US) East US**.
6. For **Gateway type**, select **VPN**.
7. For **VPN type**, select **Route-based**.
8. For **SKU**, select **VpnGw2**.
1. For **Generation**, select **Generation2**.
1. For **Virtual network**, select **VNet-hub**.
1. For **Public IP address**, select **Create new**, and type **VNet-hub-GW-pip** for the name.
1. For **Enable active-active mode**, select **Disabled**.
1. Accept the remaining defaults and then select **Review + create**.
1. Review the configuration, then select **Create**.

### Create a VPN gateway for the on-premises virtual network

Now create the VPN gateway for the on-premises virtual network. Network-to-network configurations require a RouteBased VpnType. Creating a VPN gateway can often take 45 minutes or more, depending on the selected VPN gateway SKU.

1. From the Azure portal home page, select **Create a resource**.
2. In the search text box, type **virtual network gateway** and press **Enter**.
3. Select **Virtual network gateway**, and select **Create**.
4. For **Name**, type **GW-Onprem**.
5. For **Region**, select **(US) East US**.
6. For **Gateway type**, select **VPN**.
7. For **VPN type**, select **Route-based**.
8. For **SKU**, select **VpnGw2**.
1. For **Generation**, select **Generation2**.
1. For **Virtual network**, select **VNet-Onprem**.
1. For **Public IP address**, select **Create new**, and type **VNet-Onprem-GW-pip** for the name.
1. For **Enable active-active mode**, select **Disabled**.
1. Accept the remaining defaults and then select **Review + create**.
1. Review the configuration, then select **Create**.

### Create the VPN connections

Now you can create the VPN connections between the hub and on-premises gateways.

In this step, you create the connection from the hub virtual network to the on-premises virtual network. A shared key is referenced in the examples. You can use your own values for the shared key. The important thing is that the shared key must match for both connections. It takes some time to create the connection.

1. Open the **FW-Hybrid-Test** resource group and select the **GW-hub** gateway.
2. Select **Connections** in the left column.
3. Select **Add**.
4. For the connection name, type **Hub-to-Onprem**.
5. Select **VNet-to-VNet** for **Connection type**.
1. Select **Next : Settings**.
1. For the **First virtual network gateway**, select **GW-hub**.
1. For the **Second virtual network gateway**, select **GW-Onprem**.
1. For **Shared key (PSK)**, type **AzureA1b2C3**.
1. Select **Review + create**.
1. Select **Create**.

Create the on-premises to hub virtual network connection. This step is similar to the previous one, except you create the connection from VNet-Onprem to VNet-hub. Make sure the shared keys match. The connection will be established after a few minutes.

1. Open the **FW-Hybrid-Test** resource group and select the **GW-Onprem** gateway.
2. Select **Connections** in the left column.
3. Select **Add**.
4. For the connection name, type **Onprem-to-Hub**.
5. Select **VNet-to-VNet** for **Connection type**.
6. For the **Second virtual network gateway**, select **GW-hub**.
7. For **Shared key (PSK)**, type **AzureA1b2C3**.
8. Select **OK**.


#### Verify the connection

After about five minutes or so, the status of both connections should be **Connected**.

:::image type="content" source="media/secure-hybrid-network/gateway-connections.png" alt-text="Screenshot showing the vpn gateway connections.":::

## Peer the hub and spoke virtual networks

Now peer the hub and spoke virtual networks.

1. Open the **FW-Hybrid-Test** resource group and select the **VNet-hub** virtual network.
2. In the left column, select **Peerings**.
3. Select **Add**.
4. Under **This virtual network**:


   |Setting name  |Value  |
   |---------|---------|
   |Peering link name| HubtoSpoke|
   |Allow traffic to remote virtual network|  selected      |
   |Allow traffic forwarded from the remote virtual network (allow gateway transit)    |   selected      |
   |Use remote Virtual network gateway or route server    |  not selected       |

5. Under **Remote virtual network**:

   |Setting name  |Value  |
   |---------|---------|
   |Peering link name | SpoketoHub|
   |Virtual network deployment model| Resource Manager|
   |Subscription|\<your subscription\>|
   |Virtual network| VNet-Spoke
   |Allow traffic to current virtual network     |   selected     |
   |Allow traffic forwarded from current virtual network (allow gateway transit)    |   selected      |
   |Use current virtual network gateway or route server    |  selected       |

5. Select **Add**.

   :::image type="content" source="media/secure-hybrid-network/firewall-peering.png" alt-text="Screenshot showing Vnet peering.":::

## Create the routes

Next, create a couple routes:

- A route from the hub gateway subnet to the spoke subnet through the firewall IP address
- A default route from the spoke subnet through the firewall IP address

1. From the Azure portal home page, select **Create a resource**.
2. In the search text box, type **route table** and press **Enter**.
3. Select **Route table**.
4. Select **Create**.
1. Select the **FW-Hybrid-Test** for the resource group.
1. For **Region**, select **East US**.
1. For the name, type **UDR-Hub-Spoke**.
1. Select **Review + Create**.
1. Select **Create**.
1. After the route table is created, select it to open the route table page.
1. Select **Routes** in the left column.
1. Select **Add**.
1. For the route name, type **ToSpoke**.
1. For **Destination type**, select **IP addresses**.
1. For **Destination IP addresses/CIDR ranges**, type **10.6.0.0/16**.
1. For next hop type, select **Virtual appliance**.
1. For next hop address, type the firewall's private IP address that you noted earlier.
1. Select **Add**.

Now associate the route to the subnet.

1. On the **UDR-Hub-Spoke - Routes** page, select **Subnets**.
2. Select **Associate**.
4. Under **Virtual network**, select **VNet-hub**.
5. Under **Subnet**, select **GatewaySubnet**.
6. Select **OK**.

Now create the default route from the spoke subnet.

1. From the Azure portal home page, select **Create a resource**.
2. In the search text box, type **route table** and press **Enter**.
3. Select **Route table**.
5. Select **Create**.
7. Select the **FW-Hybrid-Test** for the resource group.
8. For **Region**, select **East US**.
1. For the name, type **UDR-DG**.
4. For **Propagate gateway routes**, select **No**.
1. Select **Review + create**.
1. Select **Create**.
1. After the route table is created, select it to open the route table page.
1. Select **Routes** in the left column.
1. Select **Add**.
1. For the route name, type **ToHub**.
1. For **Destination type**, select **IP addresses**
1. For **Destination IP addresses/CIDR ranges**, type **0.0.0.0/0**.
1. For next hop type, select **Virtual appliance**.
1. For next hop address, type the firewall's private IP address that you noted earlier.
1. Select **Add**.

Now associate the route to the subnet.

1. On the **UDR-DG - Routes** page, select **Subnets**.
2. Select **Associate**.
4. Under **Virtual network**, select **VNet-spoke**.
5. Under **Subnet**, select **SN-Workload**.
6. Select **OK**.

## Create virtual machines

Now create the spoke workload and on-premises virtual machines, and place them in the appropriate subnets.

### Create the workload virtual machine

Create a virtual machine in the spoke virtual network, running IIS, with no public IP address.

1. From the Azure portal home page, select **Create a resource**.
2. Under **Popular Marketplace products**, select **Windows Server 2019 Datacenter**.
3. Enter these values for the virtual machine:
    - **Resource group** - Select **FW-Hybrid-Test**
    - **Virtual machine name**: *VM-Spoke-01*
    - **Region** - *(US) East US*
    - **User name**: type a user name
    - **Password**: type a password

4. For **Public inbound ports**, select **Allow selected ports**, and then select **HTTP (80)**, and **RDP (3389)**
1. Select **Next:Disks**.
1. Accept the defaults and select **Next: Networking**.
1. Select **VNet-Spoke** for the virtual network and the subnet is **SN-Workload**.
1. Select **Next:Management**.
1. Select **Next : Monitoring**.
1. For **Boot diagnostics**, Select **Disable**.
1. Select **Review + Create**, review the settings on the summary page, and then select **Create**.

### Install IIS

1. From the Azure portal, open the Cloud Shell and make sure that it's set to **PowerShell**.
2. Run the following command to install IIS on the virtual machine and change the location if necessary:

   ```azurepowershell-interactive
   Set-AzVMExtension `
           -ResourceGroupName FW-Hybrid-Test `
           -ExtensionName IIS `
           -VMName VM-Spoke-01 `
           -Publisher Microsoft.Compute `
           -ExtensionType CustomScriptExtension `
           -TypeHandlerVersion 1.4 `
           -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell      Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}' `
           -Location EastUS
   ```

### Create the on-premises virtual machine

This is a virtual machine that you use to connect using Remote Desktop to the public IP address. From there, you then connect to the on-premises server through the firewall.

1. From the Azure portal home page, select **Create a resource**.
2. Under **Popular**, select **Windows Server 2019 Datacenter**.
3. Enter these values for the virtual machine:
    - **Resource group** - Select existing, and then select **FW-Hybrid-Test**
    - **Virtual machine name** - *VM-Onprem*
    - **Region** - *(US) East US*
    - **User name**: type a user name
    - **Password**: type your password

7. For **Public inbound ports**, select **Allow selected ports**, and then select **RDP (3389)**
4. Select **Next:Disks**.
5. Accept the defaults and select **Next:Networking**.
6. Select **VNet-Onprem** for virtual network and verify the subnet is **SN-Corp**.

8. Select **Next:Management**.
1. Select **Next : Monitoring**.
1. For **Boot diagnostics**, select **Disable**.
1. Select **Review + Create**, review the settings on the summary page, and then select **Create**.

## Test the firewall

1. First, note the private IP address for VM-Spoke-01 virtual machine on the VM-Spoke-01 Overview page.

2. From the Azure portal, connect to the **VM-Onprem** virtual machine.
<!---2. Open a Windows PowerShell command prompt on **VM-Onprem**, and ping the private IP for **VM-spoke-01**.

   You should get a reply.--->
3. Open a web browser on **VM-Onprem**, and browse to http://\<VM-spoke-01 private IP\>.

   You should see the **VM-spoke-01** web page:
   :::image type="content" source="media/secure-hybrid-network/vm-spoke-01-web.png" alt-text="Screenshot showing vm-spoke-01 web page.":::

4. From the **VM-Onprem** virtual machine, open a remote desktop to **VM-spoke-01** at the private IP address.

   Your connection should succeed, and you should be able to sign in.

So now you've verified that the firewall rules are working:

<!---- You can ping the server on the spoke VNet.--->
- You can browse web server on the spoke virtual network.
- You can connect to the server on the spoke virtual network using RDP.

Next, change the firewall network rule collection action to **Deny** to verify that the firewall rules work as expected.

1. Open the **FW-Hybrid-Test** resource group and select the **Pol-Net01** firewall policy.
2. Under **Settings**, select **Rule Collections**.
1. Select the **RCNet01** rule collection.
1. For **Rule collection action**, select **Deny**.
1. Select **Save**.

Close any existing remote desktops and browsers on **VM-Onprem** before testing the changed rules. After the rule collection update is complete, run the tests again. They should all fail to connect this time.

## Clean up resources

You can keep your firewall resources for further investigation, or if no longer needed, delete the **FW-Hybrid-Test** resource group to delete all firewall-related resources.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Secure your virtual WAN using Azure Firewall Manager](secure-cloud-network.md)
