---
title: 'Tutorial - Configure a BGP-enabled connection between Azure and Amazon Web Services (AWS) using the portal'
description: In this tutorial, learn how to connect Azure and AWS using an active-active VPN Gateway and two site-to-site connections on AWS.
titleSuffix: Azure VPN Gateway
author: jaidharosenblatt
ms.author: jrosenblatt
ms.service: vpn-gateway
ms.topic: tutorial
ms.date: 12/2/2021

---

# How to Connect AWS and Azure using a BGP-enabled VPN Gateway

This article walks you through the setup of a BGP-enabled connection between Azure and Amazon Web Services (AWS). You will use an Azure VPN Gateway with BGP and active-active enabled and an AWS Virtual Private Gateway with two site-to-site connections.

## <a name="architecture"></a>Architecture
In this setup, you will create the following resources:

Azure
* One Virtual Network
* One Virtual Network Gateway with active-active and BGP enabled 
* Four Local Network Gateways
* Four site-to-site connections 

AWS
* One Virtual Private Cloud (VPC)
* One Virtual Private Gateway
* Two Customer Gateways
* Two site-to-site connections, each with two tunnels (total of four tunnels)

A site-to-site connection on AWS has two tunnels, each with their own Outside IP Address and Inside IPv4 CIDR (used for BGP APIPA). An active-passive VPN Gateway only supports **one** custom BGP APIPA. To connect to each of the four tunnels in AWS, you will need to enable **active-active** on your Azure VPN Gateway. 

On the AWS side, you will create a Customer Gateway and site-to-site connection for **each of the two Azure VPN Gateway instances** (total of four outgoing tunnels). In Azure, you will need to create four Local Network Gateways and connections to receive these four AWS tunnels.

:::image type="content" source="./media/vpn-gateway-howto-aws-bgp/Architecture.png" alt-text="Diagram showing architecture for this setup" border="false":::


## <a name="apipa-config"></a> Choosing BGP APIPA Addresses

You can use the values below for your BGP APIPA configuration throughout the tutorial.

| **Tunnel**                           | **Azure Custom Azure APIPA BGP IP Address** | **AWS BGP Peer IP Address** |  **AWS Inside IPv4 CIDR** |
|--------------------------------------|---------------------------------------------|--------------------------   | --------------------------|
| **AWS Tunnel 1 to Azure Instance 0** | 169.254.21.2                                | 169.254.21.1                 | 169.254.21.0/30            |
| **AWS Tunnel 2 to Azure Instance 0** | 169.254.22.2                                | 169.254.22.1                 | 169.254.22.0/30            |
| **AWS Tunnel 1 to Azure Instance 1** | 169.254.21.6                                | 169.254.21.5                 | 169.254.21.4/30            |
| **AWS Tunnel 2 to Azure Instance 1** | 169.254.22.6                                | 169.254.22.5                 | 169.254.22.4/30            |

You can also set up your own custom APIPA addresses. AWS requires a /30 **Inside IPv4 CIDR** in the APIPA range of **169.254.0.0/16** for each tunnel. This CIDR must also be in the Azure-reserved APIPA range for VPN, which is from **169.254.21.0** to **169.254.22.255**. AWS will use the first IP address of your /30 inside CIDR and Azure will use the second. This means you will need to reserve space for two IP addresses in your AWS /30 CIDR.

For example, if you set your AWS **Inside IPv4 CIDR** to be **169.254.21.0/30**, AWS will use the BGP IP address **169.254.21.1** and Azure will use the IP address **169.254.21.2**. 
   >
   > [!IMPORTANT]
   >
   > Your APIPA addresses must not overlap between the on-premises VPN devices and all connected Azure VPN gateways.
   >

## Prerequisites

You must have both an Azure account and AWS account with an active subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).

## <a name ="part-1"></a> Part 1: Create an active-active VPN Gateway in Azure

### <a name ="create-vnet"></a> Create a VNet
Create a Virtual Network with the following values by following the steps in the [create a gateway tutorial](./tutorial-create-gateway-portal.md#CreatVNet).

* **VNet Name**: VNet1
* **Address space**: 10.1.0.0/16 - For this example, we use only one address space. You can have more than one address space for your VNet.
* **Subnet name**: FrontEnd
* **Subnet address range**: 10.1.0.0/24
* **Subscription**: If you have more than one subscription, verify that you are using the correct one.
* **Resource Group**: TestRG1
* **Location**: East US

### <a name ="create-gateway"></a> Create an active-active VPN gateway with BGP
Create a VPN gateway using the following values:
* **Name**: VNet1GW
* **Region**: East US
* **Gateway type**: VPN
* **VPN type**: Route-based
* **SKU**: VpnGw2
* **Generation**: Generation 2
* **Virtual network**: VNet1
* **Gateway subnet address range**: 10.1.1.0/24
* **Public IP address**: Create new
* **Public IP address name**: VNet1GWpip
* **Enable active-active mode**: Enabled
* **SECOND PUBLIC IP ADDRESS**: Create new
* **Public IP address 2 name**: VNet1GWpip2
* **Configure BGP**: Enabled
* **Autonomous system number (ASN)**: 65000
* **Custom Azure APIPA BGP IP address**: 169.254.21.2, 169.254.22.2
* **Second Custom Azure APIPA BGP IP address**: 169.254.21.6, 169.254.22.6

1. In the Azure portal, navigate to the **Virtual Network Gateway** resource from the Marketplace, and select **Create**.
2. Fill in the parameters as shown below:
    
    :::image type="content" source="./media/vpn-gateway-howto-aws-bgp/create-gw-config.png" alt-text="Parameters for creating gateway" border="false":::
3.	Enable active-active mode

    :::image type="content" source="./media/vpn-gateway-howto-aws-bgp/create-gw-active-active.png" alt-text="Active active for creating gateway" border="false":::
    - Under Public IP Address, select **Enabled** for **Enable active-active mode**.
    - Specify names for the first and second **Public IP address name**. These settings specify the public IP address object that gets associated to the VPN gateway. The public IP address is dynamically assigned to this object when the VPN gateway is created. 
4. Configure BGP

    :::image type="content" source="./media/vpn-gateway-howto-aws-bgp/create-gw-bgp.png" alt-text="BGP for creating gateway" border="false":::
    - Select **Enabled** for **Configure BGP** to show the BGP configuration section.
    - Fill in a **ASN (Autonomous System Number)**. This ASN must be different than the ASN used by AWS.
    - Add two addresses to **Custom Azure APIPA BGP IP address**. Include the IP addresses for **AWS Tunnel 1 to Azure Instance 0** and **AWS Tunnel 2 to Azure Instance 0** from the [APIPA configuration you chose](#apipa-config). The second input will only appear after you add your first APIPA BGP IP address.
    - Add two addresses to **Second Custom Azure APIPA BGP IP address**. Include the IP addresses for **AWS Tunnel 1 to Azure Instance 1** and **AWS Tunnel 2 to Azure Instance 1** from the [APIPA configuration you chose](#apipa-config). The second input will only appear after you add your first APIPA BGP IP address.
6. Select **Review + create** to run validation. Once validation passes, select **Create** to deploy the VPN gateway. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU. You can see the deployment status on the Overview page for your gateway.

## <a name ="part-2"></a> Part 2: Connect to your VPN Gateway from AWS
In this step, you will connect to your Azure VPN Gateway from AWS. For updated instructions, refer to the [official AWS documentation](https://docs.aws.amazon.com/directconnect/latest/UserGuide/virtualgateways.html).

### <a name ="create-vpc"></a> Create a VPC

1.	Open the [Amazon VPC console](https://console.aws.amazon.com/vpc/)
2.	In the navigation pane, click **VPC Dashboard**, then **Launch VPC Wizard**.
3.	Select the second option, **VPC with a Single Public Subnet**, and then click **Select**.
4.	Enter values for **CIDR block** and select **Create VPC**. Make sure that your CIDR block does not overlap with the Virtual Network you created in Azure.
    
    :::image type="content" source="./media/vpn-gateway-howto-aws-bgp/aws-vpc.png" alt-text="Create a VPC" border="false":::

### <a name ="create-vpg"></a> Create a Virtual Private Gateway
1.	In the navigation pane, click **Virtual Private Gateways**, **Create Virtual Private Gateway**
2.	Enter a name for your virtual private gateway.
3.	For **ASN**, leave the default selection to use the **Amazon default ASN**. If you choose to have a Custom ASN, it must be different than the ASN you used on Azure.
4.	Select **Create Virtual Private Gateway**.

    :::image type="content" source="./media/vpn-gateway-howto-aws-bgp/aws-vpg.png" alt-text="Create a Virtual Private Gateway" border="false":::
5.	Select the virtual private gateway that you created, and then choose **Actions, Attach to VPC**.
6.	Select the VPC you created from the list and choose **Yes, Attach**.

### <a name ="enable-route-propagation"></a> Enable Route Propagation  
1. In the navigation pane, choose **Route Tables**, and then select the route table for the VPC you created.
2. Choose **Actions** then **Edit route propagation**.
3. Select the **Enable** check box next to the virtual private gateway, and then choose **Save**.

### <a name ="create-customer-gateways"></a> Create Customer Gateways
You will be creating **two Customer Gateways**, one for each of the IP addresses of your Azure VPN Gateway. 
1.	In the navigation pane, choose **Customer Gateways**, and then **Create Customer Gateway**.
2.	Enter a name for your Customer Gateway.
3.	For **Routing**, select **Dynamic**.
4.	For **BGP ASN**, enter the ASN you used in Azure.
5.	For **IP Address**, enter your first public IP address for your VPN Gateway. You can locate your **Public IP address** on Azure in the **Configuration** section of your **Virtual Network Gateway**, under **Public IP Address**.
6.	Leave the rest of the fields as default and select **Create Customer Gateway**
7.	Create a **second Customer Gateway** by **repeating steps 1 to 6** with your second public IP address. You can locate your **Second Public IP address** on Azure in the **Configuration** section of your **Virtual Network Gateway**, under **Second Public IP Address**.

:::image type="content" source="./media/vpn-gateway-howto-aws-bgp/aws-cgw.png" alt-text="Create a Customer Gateway" border="false":::

### <a name ="create-aws-connections"></a> Create Site-to-Site VPN Connections
1.	In the navigation pane, choose **Site-to-Site VPN Connections**, **Create VPN Connection**.
2.	Enter a name for your Site-to-Site VPN connection.
3.	For **Target Gateway Type**, choose **Virtual Private Gateway**. Then choose the Virtual Private Gateway you created.
4.	For **Customer Gateway ID**, select the customer gateway that you created earlier.
5.	For **Routing Options**, select **Dynamic (requires BGP)**.
6.	Leave both **Local IPv4 Network CIDR** and **Remote IPv4 Network CIDR** the default value of **(0.0.0.0/0)**.
7.	Under **Tunnel Options**
    * Enter the **Inside IPv4 CIDR for Tunnel 1** [from the APIPA configuration you chose](#apipa-config) 
    * Enter a value for the **Pre-Shared Key for Tunnel 1**. This key will need to match the one you later provide in Azure.
    * Enter the **Inside IPv4 CIDR for Tunnel 2** [from the APIPA configuration you chose](#apipa-config) 
    * Enter a value for the **Pre-Shared Key for Tunnel 2**. This key will need to match the one you later provide in Azure.

    :::image type="content" source="./media/vpn-gateway-howto-aws-bgp/aws-create-connection.png" alt-text="Parameters for creating connection" border="false":::
8.	Select **Edit Tunnel 1 Options** for **Advanced Options for Tunnel 1**. Select **Start** for the **Startup Action** to allow AWS to initiate the connection with Azure. Leave the rest of the advanced options as their default values.

    :::image type="content" source="./media/vpn-gateway-howto-aws-bgp/aws-advanced-tunnel.png" alt-text="Enabling Startup Action as Start" border="false":::
9.	Select **Edit Tunnel 2 Options** for **Advanced Options for Tunnel 2**. Select **Start** for the **Startup Action** to allow AWS to initiate the connection with Azure. Leave the rest of the advanced options as their default values.
10.	Select **Create VPN Connection**.
11.	You will need to save the IP address of the tunnels for both of your site-to-site connections after they have finished deploying. Making sure you are still in the **Site-to-Site VPN Connections** page, select the connection you made, and select the **Tunnel Details** tab. You will need the **Outside IP Address** for both **Tunnel 1** and **Tunnel 2** to connect to Azure.
    :::image type="content" source="./media/vpn-gateway-howto-aws-bgp/aws-tunnel-ip.png" alt-text="Getting tunnel IP addresses" border="false":::
12.	Repeat steps **1-11**, with the same values for everything but **Inside IPv4 CIDR for Tunnel 1** and **Inside IPv4 CIDR for Tunnel 2**. For these values, instead use the address space corresponding to your **Second Custom Azure APIPA BGP IP address**.

## <a name ="part-3"></a> Part 3: Connect to your AWS Customer Gateways from Azure
In this step, you will connect your AWS tunnels to Azure. For each of the four tunnels, you will have both a Local Network Gateway and a site-to-site connection. You should have the AWS **Outside IP Address** for each of these four tunnels from step 11 of the previous section.

Repeat the following sections for **each of your four AWS tunnels**, using their respective **Outside IP Address**:

### <a name ="create-local-network-gateways"></a> Create Local Network Gateways
1. In the Azure portal, navigate to the **Local Network Gateway** resource from the Marketplace, and select **Create**.
2. Select the same **Subscription**, **Resource Group**, and **Region** you used to create your Virtual Network Gateway.
3. Enter a name for your Local Network Gateway.
4. Leave **IP Address** as the value for **Endpoint**.
5. For **IP Address**, enter the **Outside IP Address** (from AWS) for the tunnel you are creating.
6. Leave **Address Space** as blank and select **Advanced**.

:::image type="content" source="./media/vpn-gateway-howto-aws-bgp/create-lng.png" alt-text="Values for your Local Network Gateway" border="false":::

7. Select **Yes** for **Configure BGP settings**.
8. For **Autonomous system number (ASN)**, enter the ASN for your AWS Virtual Private Network. Use the ASN **64512** if you left this as the AWS default value.
9. For **BGP peer IP address**, enter the AWS BGP Peer IP Address based on the [APIPA configuration you chose](#apipa-config).

:::image type="content" source="./media/vpn-gateway-howto-aws-bgp/lng-bgp.png" alt-text="Values for your Local Network Gateway BGP settings" border="false":::


### <a name ="create-azure-connections"></a> Create Connections
1. Open the page for your **Virtual Network Gateway**, navigate to the **Connections** page, then select **Add**.
2. Enter a name for your connection.
3. Select **Site-to-Site** as the **Connection type**.
4. Select the **Local Network Gateway** you created.
5. Enter the **Shared key (PSK)** that matches the **Pre-Shared Key** you entered when making the AWS connections.
6. Select **Enable BGP**, then **Enable Custom BGP Addresses**.
7. Under **Custom BGP Addresses**
    * Enter the Custom BGP Address based on the [APIPA configuration you chose](#apipa-config) 
    * The **Custom BGP Address** (Inside IPv4 CIDR in AWS) must match with the **IP Address** (Outside IP Address in AWS) that you specified in the **Local Network Gateway** you are using for this connection.

    :::image type="content" source="./media/vpn-gateway-howto-aws-bgp/aws-ip-cidr.png" alt-text="Where to find APIPA and IP Address on AWS" border="false":::

    * Only one of the two Custom BGP Addresses will be used, depending on the tunnel you are specifying it for.
    * For making a connection from AWS to the **first public IP address** of your VPN Gateway (instance 0), **only the Primary Custom BGP Address** will be used.
    * For making a connection from AWS to the **second public IP address** of your VPN Gateway (instance 1), **only the Secondary Custom BGP Address** will be used.
    * Leave the other **Custom BGP Address** as default.

    If you used the [default APIPA configuration](#apipa-config), you can use the addresses below.

    | Tunnel                           | Primary Custom BGP Address     | Secondary Custom BGP Address  |
    |----------------------------------|--------------------------------|-------------------------------|
    | AWS Tunnel 1 to Azure Instance 0 | 169.254.21.2                   | Not used (select 169.254.21.6)|
    | AWS Tunnel 2 to Azure Instance 0 | 169.254.22.2                   | Not used (select 169.254.21.6)|
    | AWS Tunnel 1 to Azure Instance 1 | Not used (select 169.254.21.2) | 169.254.21.6                  |
    | AWS Tunnel 2 to Azure Instance 1 | Not used (select 169.254.21.2) | 169.254.22.6                  |
8. Leave the rest of the fields as their default values and select **Ok**.

    :::image type="content" source="./media/vpn-gateway-howto-aws-bgp/create-connection.png" alt-text="Modifying connection" border="false":::

9. From the **Connections** page for your VPN Gateway, select the connection you created and navigate to the **Configuration** page.
10. Select **ResponderOnly** for the **Connection Mode** and select **Save**


Verify that you have a **Local Network Gateway** and **Connection** for **each of your four AWS tunnels**. 

## <a name ="part-4"></a> Part 4: Test your connections
### <a name ="verify-azure"></a> Check your connections status on Azure
1. Open the page for your **Virtual Network Gateway**, navigate to the **Connections** page.
2. Verify that all 4 connections show as **Connected**.

    :::image type="content" source="./media/vpn-gateway-howto-aws-bgp/verify-connections.png" alt-text="Verify Azure connections" border="false":::

### <a name ="verify-bgp-peers"></a> Check your BGP Peers status on Azure
1. Open the page for your **Virtual Network Gateway**, navigate to the **BGP Peers** page.
2. In the **BGP Peers** table, verify that all of the connections with the **Peer address** you specified show as **Connected** and are exchanging routes.

    :::image type="content" source="./media/vpn-gateway-howto-aws-bgp/verify-bgp-peers.png" alt-text="Verify BGP Peers" border="false":::

### <a name ="verify-aws-status"></a> Check your connections status on AWS
1.	Open the [Amazon VPC console](https://console.aws.amazon.com/vpc/)
2.	In the navigation pane, click **Site-to-Site VPN Connections**.
3. Select the first connection you made and then select the **Tunnel Details** tab.
4. Verify that the **Status** of both tunnels shows as **UP**.
5. Verify that the **Details** of both tunnels shows one or more BGP routes.

    :::image type="content" source="./media/vpn-gateway-howto-aws-bgp/verify-bgp-aws.png" alt-text="Verify AWS connections" border="false":::