---
title: 'Create a VPN between Azure and AWS using managed solutions'
description: How to create a VPN connection between Azure and AWS using managed solutions, instead of VMs or appliances.
services: vpn-gateway
titleSuffix: Azure VPN Gateway
author: ricmmartins

ms.service: vpn-gateway
ms.topic: how-to
ms.date: 02/03/2021
ms.author: ricmart

---

# Create a VPN connection between Azure and AWS using managed solutions

You can establish a connection between Azure and AWS by using managed solutions. Previously, you were required to use an appliance or VM acting as a responder. Now, you can connect the AWS virtual private gateway to Azure VPN Gateway directly without having to worry about managing IaaS resources such as virtual machines. This article helps you create a VPN connection between Azure and AWS by using only managed solutions.

:::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/diagram.png" alt-text="Architecture diagram":::

## Configure Azure

### Configure a virtual network

Configure a virtual network. For instructions, see the [Virtual Network Quickstart](../virtual-network/quick-create-portal.md).

The following example values are used in this article:

* **Resource Group:** rg-azure-aws
* **Region:** East US
* **Virtual network name:** vnet-azure
* **IPv4 address space:** 172.10.0.0/16
* **Subnet name:** subnet-01
* **Subnet address range:** 172.10.1.0/24

### Create a VPN gateway

Create a VPN gateway for your virtual network. For instructions, see [Tutorial: Create and manage a VPN gateway](tutorial-create-gateway-portal.md).

The following example values and settings are used in this article:

* **Gateway name:** vpn-azure-aws
* **Region:** East US
* **Gateway type:** VPN
* **VPN type:** Route-based
* **SKU:** VpnGw1
* **Generation:** Generation 1
* **Virtual network:** Must be the VNet that you want to create the gateway for.
* **Gateway subnet address range:** 172.10.0.0/27
* **Public IP address:** Create new
* **Public IP address name:** pip-vpn-azure-aws
* **Enable active-active mode:** Disable
* **Configure BGP:** Disable

Example:

:::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/summary.png" alt-text="Virtual network gateway summary":::

## Configure AWS

1. Create the Virtual Private Cloud (VPC).

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/create-vpc.png" alt-text="Create VPC info":::

1. Create a subnet inside the VPC (virtual network).

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/create-subnet-vpc.png" alt-text="Create the subnet":::

1. Create a customer gateway that points to the public IP address of Azure VPN Gateway. The **Customer Gateway** is an AWS resource that contains information for AWS about the customer gateway device, which in this case, is the Azure VPN Gateway.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/create-customer-gw.png" alt-text="Create customer gateway":::

1. Create the virtual private gateway.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/create-vpg.png" alt-text="Create virtual private gateway":::

1. Attach the virtual private gateway to the VPC.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/attach-vpg.png" alt-text="Attach the VPG to the VPC":::

1. Select the VPC.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/attaching-vpg.png" alt-text="Attach":::

1. Create a site-to-site VPN connection.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/create-vpn-connection.png" alt-text="Create VPN Connection":::

1. Set the routing option to **Static** and point to the Azure subnet-01 prefix **(172.10.1.0/24).**

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/set-static-route.png" alt-text="Setting a static route":::

1. After you fill the options, **Create** the connection.

1. Download the configuration file. To download the correct configuration, change the Vendor, Platform, and Software to **Generic**, since Azure isn't a valid option.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/download-config.png" alt-text="Download configuration":::

1. The configuration file contains the Pre-Shared Key and the public IP Address for each of the two IPsec tunnels created by AWS.

   **Tunnel 1**

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/tunnel-1.png" alt-text="Tunnel 1":::

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/tunnel-1-config.png" alt-text="Tunnel 1 configuration":::

   **Tunnel 2**

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/tunnel-2.png" alt-text="Tunnel 2":::

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/tunnel-2-config.png" alt-text="Tunnel 2 configuration":::

1. After the tunnels are created, you will see something similar to this example.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/aws-connection-details.png" alt-text="AWS VPN Connection Details":::

## Create local network gateway

In Azure, the local network gateway is an Azure resource that typically represents an on-premises location. It's populated with information used to connect to the on-premises VPN device. However, in this configuration, the local network gateway is created and populated with the AWS virtual private gateway connection information. For more information about Azure local network gateways, see [Azure VPN Gateway settings](vpn-gateway-about-vpn-gateway-settings.md#lng).

Create a local network gateway in Azure. For steps, see [Create a local network gateway](tutorial-site-to-site-portal.md#LocalNetworkGateway).

Specify the following values:

* **Name:** In the example, we use lng-azure-aws.
* **Endpoint:** IP address
* **IP address:** The public IP address from the AWS virtual private gateway and the VPC CIDR prefix. You can find the public IP address in configuration file you previously downloaded.

AWS creates two IPsec tunnels for high availability purposes. The following example shows the public IP address from IPsec Tunnel #1.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/local-network-gateway.png" alt-text="Local network gateway":::

## Create VPN connection

In this section, you create the VPN connection between the Azure virtual network gateway, and the AWS gateway.

1. Create the Azure connection. For steps to create a connection, see [Create a VPN connection](tutorial-site-to-site-portal.md#CreateConnection).

   In the following example, the Shared key was obtained from the configuration file that you downloaded earlier. In this example, we use the values for IPsec Tunnel #1 created by AWS and described at the configuration file.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/create-connection.png" alt-text="Azure connection object":::

1. View the connection. After a few minutes, the connection is established.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/connection-established.png" alt-text="Working connection":::

1. Verify that AWS IPsec Tunnel #1 is **UP**.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/aws-connection-established.png" alt-text="Verify AWS tunnel is UP":::

1. Edit the route table associated with the VPC.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/edit-aws-route.png" alt-text="Edit the route":::

1. Add the route to Azure subnet. This route will travel through the VPC gateway.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/save-aws-route.png" alt-text="Save the route configuration":::

## Configure second connection

In this section, you create a second connection to ensure high availability.

1. Create another local network gateway that points to the public IP address of the IPsec tunnel #2 on AWS. This is the standby gateway.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/create-lng-standby.png" alt-text="Create the local network gateway":::

1. Create the second VPN connection from Azure to AWS.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/create-connection-standby.png" alt-text="Create the standby local network gateway connection":::

1. View the Azure VPN gateway connections.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/azure-tunnels.png" alt-text="Azure connection status":::

1. View the AWS connections. In this example, you can see that the connections are now established.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/aws-tunnels.png" alt-text="AWS connection status":::

## To test connections

1. Add an **internet gateway** to the VPC on AWS. The internet gateway is a logical connection between an Amazon VPN and the Internet. This resource allows you to connect through the test VM from the AWS public IP through the Internet. This resource is not required for the VPN connection. We are only using it to test.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/create-igw.png" alt-text="Create the Internet gateway":::

1. Select **Attach to VPC**.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/attach-igw.png" alt-text="Attaching the Internet Gateway to VPC":::

1. Select a VPC and **Attach internet gateway**.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/attach-igw-2.png" alt-text="Attach the gateway":::

1. Create a route to allow connections to **0.0.0.0/0** (Internet) through the internet gateway.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/allow-internet-igw.png" alt-text="Configure the route through the gateway":::

1. In Azure, the route is automatically created. You can check the route from the Azure VM by selecting **VM  > Networking > Network Interface > Effective routes**. You see 2 routes, 1 route per connection.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/azure-effective-routes.png" alt-text="Check the effective routes":::

1. You can test this from a Linux VM on Azure. The result will appear similar to the following example.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/azure-overview.png" alt-text="Azure overview from Linux VM":::

1. You can also test this from a Linux VM on AWS. The result will appear similar to the following example.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/aws-overview.png" alt-text="AWS overview from Linux VM":::

1. Test the connectivity from the Azure VM.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/azure-ping.png" alt-text="Ping test from Azure":::

1. Test the connectivity from the AWS VM.

   :::image type="content" source="./media/create-vpn-azure-aws-managed-solutions/aws-ping.png" alt-text="Ping test from AWS":::

## Next steps

* For more information about AWS support for IKEv2, see the [AWS article](https://aws.amazon.com/about-aws/whats-new/2019/02/aws-site-to-site-vpn-now-supports-ikev2/).

* For more information about building a multicloud VPN at scale, see the video [Build the Best MultiCloud VPN at Scale](https://www.youtube.com/watch?v=p7h-frLDFE0).
