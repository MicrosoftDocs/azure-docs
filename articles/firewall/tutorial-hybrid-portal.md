---
title: 'Tutorial: Deploy and configure Azure Firewall in a hybrid network using the Azure portal'
description: In this tutorial, you learn how to deploy and configure Azure Firewall using Azure portal. 
services: firewall
author: vhorne
ms.service: firewall
ms.topic: tutorial
ms.date: 6/15/2019
ms.author: victorh
customer intent: As an administrator, I want to control network access from an on-premises network to an Azure virtual network.
---
# Tutorial: Deploy and configure Azure Firewall in a hybrid network using the Azure portal

When you connect your on-premises network to an Azure virtual network to create a hybrid network, the ability to control access to your Azure network resources is an important part of an overall security plan.

You can use Azure Firewall to control network access in a hybrid network using rules that define allowed and denied network traffic.

For this tutorial, you create three virtual networks:

- **VNet-Hub** - the firewall is in this virtual network.
- **VNet-Spoke** - the spoke virtual network represents the workload located on Azure.
- **VNet-Onprem** - The on-premises virtual network represents an on-premises network. In an actual deployment, it can be connected by either a VPN or ExpressRoute connection. For simplicity, this tutorial uses a VPN gateway connection, and an Azure-located virtual network is used to represent an on-premises network.

![Firewall in a hybrid network](media/tutorial-hybrid-ps/hybrid-network-firewall.png)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Declare the variables
> * Create the firewall hub virtual network
> * Create the spoke virtual network
> * Create the on-premises virtual network
> * Configure and deploy the firewall
> * Create and connect the VPN gateways
> * Peer the hub and spoke virtual networks
> * Create the routes
> * Create the virtual machines
> * Test the firewall

## Prerequisites

There are three key requirements for this scenario to work correctly:

- A User Defined Route (UDR) on the spoke subnet that points to the Azure Firewall IP address as the default gateway. BGP route propagation must be **Disabled** on this route table.
- A UDR on the hub gateway subnet must point to the firewall IP address as the next hop to the spoke networks.

   No UDR is required on the Azure Firewall subnet, as it learns routes from BGP.
- Make sure to set **AllowGatewayTransit** when peering VNet-Hub to VNet-Spoke and **UseRemoteGateways** when peering VNet-Spoke to VNet-Hub.

See the [Create Routes](#create-the-routes) section in this tutorial to see how these routes are created.

>[!NOTE]
>Azure Firewall must have direct Internet connectivity. If your AzureFirewallSubnet learns a default route to your on-premises network via BGP, you must override this with a 0.0.0.0/0 UDR with the **NextHopType** value set as **Internet** to maintain direct Internet connectivity. By default, Azure Firewall doesn't support forced tunneling to an on-premises network.
>
>However, if your configuration requires forced tunneling to an on-premises network, Microsoft will support it on a case by case basis. Contact Support so that we can review your case. If accepted, we'll allow your subscription and ensure the required firewall Internet connectivity is maintained.

>[!NOTE]
>Traffic between directly peered VNets is routed directly even if a UDR points to Azure Firewall as the default gateway. To send subnet to subnet traffic to the firewall in this scenario, a UDR must contain the target subnet network prefix explicitly on both subnets.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create the firewall hub virtual network

First, create the resource group to contain the resources for this tutorial:

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).
2. On the Azure portal home page, select **Resource groups** > **Add**.
3. For **Resource group name**, type **FW-Hybrid-Test**.
4. For **Subscription**, select your subscription.
5. For **Region**, select **East US**. All subsequent resources that you create must be in the same location.
6. Select **Review + Create**.
7. Select **Create**.

Now, create the VNet:

1. From the Azure portal home page, select **Create a resource**.
2. Under **Networking**, select **Virtual network**.
4. For **Name**, type **VNet-hub**.
5. For **Address space**, type **10.5.0.0/16**.
6. For **Subscription**, select your subscription.
7. For **Resource group**, select **FW-Hybrid-Test**.
8. For **Location**, select **East US**.
9. Under **Subnet**, for **Name** type **AzureFirewallSubnet**. The firewall will be in this subnet, and the subnet name **must** be AzureFirewallSubnet.
10. For **Address range**, type **10.5.0.0/24**.
    > [!NOTE]
    > The minimum size of the AzureFirewallSubnet subnet is /26.
1. Accept the other default settings, and then select **Create**.

## Create the spoke virtual network

Define the subnets to be included in the spoke virtual network:

This VNet will contain three subnets.

1. From the Azure portal home page, select **Create a resource**.
2. Under **Networking**, select **Virtual network**.
4. For **Name**, type **Test-FW-VN**.
5. For **Address space**, type **10.0.0.0/16**.
6. For **Subscription**, select your subscription.
7. For **Resource group**, select **Test-FW-RG**.
8. For **Location**, select the same location that you used previously.
9. Under **Subnet**, for **Name** type **AzureFirewallSubnet**. The firewall will be in this subnet, and the subnet name **must** be AzureFirewallSubnet.
10. For **Address range**, type **10.0.1.0/24**.
11. Accept the other default settings, and then select **Create**.



### Create additional subnets

Next, create subnets for the jump server, and a subnet for the workload servers.

1. On the Azure portal home page, select **Resource groups** > **Test-FW-RG**.
2. Select the **Test-FW-VN** virtual network.
3. Select **Subnets** > **+Subnet**.
4. For **Name**, type **Workload-SN**.
5. For **Address range**, type **10.0.2.0/24**.
6. Select **OK**.

## Create the on-premises virtual network

Define the subnets to be included in the virtual network:

## Configure and deploy the firewall

Now deploy the firewall into the hub virtual network.



#Save the firewall private IP address for future use


### Configure network rules


## Create and connect the VPN gateways

The hub and on-premises virtual networks are connected via VPN gateways.

### Create a VPN gateway for the hub virtual network

Create the VPN gateway configuration. The VPN gateway configuration defines the subnet and the public IP address to use.

Now create the VPN gateway for the hub virtual network. Network-to-network configurations require a RouteBased VpnType. Creating a VPN gateway can often take 45 minutes or more, depending on the selected VPN gateway SKU.


### Create a VPN gateway for the on-premises virtual network

Create the VPN gateway configuration. The VPN gateway configuration defines the subnet and the public IP address to use.

Now create the VPN gateway for the on-premises virtual network. Network-to-network configurations require a RouteBased VpnType. Creating a VPN gateway can often take 45 minutes or more, depending on the selected VPN gateway SKU.


### Create the VPN connections

Now you can create the VPN connections between the hub and on-premises gateways

#### Get the VPN gateways

#### Create the connections

In this step, you create the connection from the hub virtual network to the on-premises virtual network. You'll see a shared key referenced in the examples. You can use your own values for the shared key. The important thing is that the shared key must match for both connections. Creating a connection can take a short while to complete.

Create the on-premises to hub virtual network connection. This step is similar to the previous one, except you create the connection from VNet-Onprem to VNet-hub. Make sure the shared keys match. The connection will be established after a few minutes.

#### Verify the connection

You can verify a successful connection by using the *Get-AzVirtualNetworkGatewayConnection* cmdlet, with or without *-Debug*. 
Use the following cmdlet example, configuring the values to match your own. If prompted, select **A** to run **All**. In the example, *-Name* refers to the name of the connection that you want to test.

After the cmdlet finishes, view the values. In the following example, the connection status shows as *Connected* and you can see ingress and egress bytes.

## Peer the hub and spoke virtual networks

Now peer the hub and spoke virtual networks.

## Create the routes

Next, create a couple routes:

- A route from the hub gateway subnet to the spoke subnet through the firewall IP address
- A default route from the spoke subnet through the firewall IP address


## Create virtual machines

Now create the spoke workload and on-premises virtual machines, and place them in the appropriate subnets.

### Create the workload virtual machine

Create a virtual machine in the spoke virtual network, running IIS, with no public IP address, and allows pings in.
When prompted, type a user name and password for the virtual machine.


### Create the on-premises virtual machine

This is a simple virtual machine that you use to connect using Remote Desktop to the public IP address. From there, you then connect to the on-premises server through the firewall. When prompted, type a user name and password for the virtual machine.

## Test the firewall

First, get and then note the private IP address for **VM-spoke-01** virtual machine.

From the Azure portal, connect to the **VM-Onprem** virtual machine.
<!---2. Open a Windows PowerShell command prompt on **VM-Onprem**, and ping the private IP for **VM-spoke-01**.

   You should get a reply.--->
Open a web browser on **VM-Onprem**, and browse to http://\<VM-spoke-01 private IP\>.

You should see the Internet Information Services default page.

From **VM-Onprem**, open a remote desktop to **VM-spoke-01** at the private IP address.

Your connection should succeed, and you should be able to sign in using your chosen username and password.

So now you've verified that the firewall rules are working:

<!---- You can ping the server on the spoke VNet.--->
- You can browse web server on the spoke virtual network.
- You can connect to the server on the spoke virtual network using RDP.

Next, change the firewall network rule collection action to **Deny** to verify that the firewall rules work as expected. Run the following script to change the rule collection action to **Deny**.

Now run the tests again. They should all fail this time. Close any existing remote desktops before testing the changed rules.

## Clean up resources

You can keep your firewall resources for the next tutorial, or if no longer needed, delete the **FW-Hybrid-Test** resource group to delete all firewall-related resources.

## Next steps

Next, you can monitor the Azure Firewall logs.

> [!div class="nextstepaction"]
> [Tutorial: Monitor Azure Firewall logs](./tutorial-diagnostics.md)
