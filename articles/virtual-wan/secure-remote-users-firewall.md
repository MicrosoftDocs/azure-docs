---
title: 'Connect cross-tenant VNets to a hub:PowerShell'
titleSuffix: Azure Virtual WAN
description: This article helps you connect cross-tenant VNets to a virtual hub using PowerShell.
services: virtual-wan
author: wtnlee

ms.service: virtual-wan
ms.topic: how-to
ms.date: 09/28/2020
ms.author: wellee

---
# Tutorial: Secure Remote Users (P2S) Using Azure Firewall

This tutorial shows you how to use Virtual WAN and Azure Firewall to secure connections to your resources in Azure over IPsec/IKE (IKEv2) or Open VPN P2S connections.
You may want to use a similar set up if you have remote users for whom you want to restrict to Azure resources or hope to secure your resources in Azure.

For instance, this tutorial will help you create the architecture in the diagram below to allow User VPN clients to access certain VM’s (VM1) in spoke networks but not others (VM2) connected to the Virtual Hub. The steps in this tutorial can be extended fit the case you need.

:::image type="content" source="./media/secure-remote-users-firewall/secured-setup-sample.png" alt-text="Set up routing configuration" :::

In this article, you learn how to:

* Create a Virtual WAN with a Virtual Hub
* Create a P2S Configuration 
* Configure a client-side P2S VPN Configuration
* Set up Azure Firewall to create a Secured Hub
* Set up Firewall Rules to Secure Resources


## Setting up a Virtual WAN, Virtual Hub, and P2S VPN Gateway

### Create a Virtual WAN

From a browser, navigate to the Azure portal and sign in with your Azure account.

1. In the portal, select **+Create a resource**. Type Virtual WAN into the search box and select Enter.
2. Select Virtual WAN from the results. On the Virtual WAN page select **Create** to open the Create WAN  menu and fill in the relevant fields. Make sure you select the type of the hub to be Standard. Currently, Basic hubs do not support P2S connectivity.
3. Click **Review + Create** to validate your deployment parameters.
4. Click **Create** to finalize and create the resource in Azure.

### <a name = "create-hub"></a>Create a Virtual Hub with a P2S VPN Gateway

1. Navigate to your resource group and click on the Virtual WAN resource you created in the preceding section.
2. From the menu on the left-hand side, select **Hubs** (under the subsection **Connectivity**)
3. Click **+New Hub** from the navigation menu. Enter a name for your Hub and the Hub private address space (in our example, **10.0.00/24**).  

:::image type="content" source="./media/secure-remote-users-firewall/create-virtual-hub.png" alt-text="Set up virtual hub" :::

4. Click **Next** until you reach point-to-site. At this point, you will select **Yes** to provision a Point to site VPN Gateway. Choose your desired aggregate bandwidth from the dropdown.
5. At this point, if you have previously created a Point to site configuration you would like to use, select the configuration from the dropdown. Otherwise, look at the next [section](#set-up-p2s) titled Setting up a Point to site Configuration. Afterwards, select your newly created configuration from the drop down menu.
6. Specify a Client Address pool, making sure it does not overlap with any addresses in the Virtual Hub or any spoke Virtual Networks connected to the hub. In this case, we will use **10.5.0.0/16**.
7. Specify a the IP address of a custom DNS server, if desired.
8. Click create. It can take around 30 minutes for the P2S VPN Gateway to be provisioned and ready for use.

### <a name= "set-up-p2s"> </a>Setting up a Point to site Configuration

The following section teaches you how to set up a new Point to site Configuration from within the menu for creating a new P2S VPN Gateway.

1. Click **Create New** (in blue text).
2. Choose a name for the configuration and the tunnel type (Azure supports OpenVPN, IkeV2, or both).
3.	Choose the authentication method you prefer for this setup.
    1. For **Azure certificates** you will need to input the public certificate data or generate a self-signed certificate. For help on this, look [here.](https://docs.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-certificates-point-to-site). For help on viewing and gettingthe public certificate data that needs to be input into the Azure portal, look [here.](https://docs.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-certificates-point-to-site#cer)
     
    2. For **Radius-based authentication**, you will need the Radius server IP, Radius server secret and certificate information.
    3. For **Azure Active Directory authentication**, you will need the Application ID of the Azure VPN Enterprise Application registered in your Azure AD tenant, the issuer (which can be found here: https://sts.windows.net/your-Directory-ID/) and the AAD tenant (which can be found here: https://login.microsoftonline.com/your-Directory-ID)
4. Click **Create** 

## Setting up the Client-Side P2S VPN Connection

In this section, you will be setting up the P2S VPN Connection on your client devices so that they can connect to the VPN Gateway in the Virtual Hub.

1. After the VPN Gateway has been provisioned, navigate to your virtual hub resource and click on **User VPN (point to site)** underneath connectivity
2. Download the virtual Hub User VPN Profile (circled in picture below)
:::image type="content" source="./media/secure-remote-users-firewall/download-vpn.png" alt-text="Image on Downloading VPN" :::
3. Click on **Generate and download the profile**
4. The profile will have three folders in it, each of which are described below
    1. **WindowsX86** and **WindowsAmd64**: these folders contain  executables  that will set up the VPN connection on your Windows device.
    2. **Generic** will contain information that is needed to set up P2S for other Operating Systems. For more information, see [here.](https://docs.microsoft.com/en-us/azure/vpn-gateway/point-to-site-vpn-client-configuration-azure-cert)
5. At this point, you should be able to connect via VPN to the Azure Virtual Hub you have created.

## Creating Spoke Networks and Virtual Machines
The following section is designed to guide you in setting up the setup described in the diagram. You may substitute the resources for your own architecture. However, please ensure that the address spaces in any spokes attached to the virtual hub do not overlap with User VPN spaces, any other spoke or the virtual hub itself.

In this example, we attach a single Virtual Network to our Virtual Wan Hub.
 
1.	Create a **virtual network** with an address space that does not overlap with the Virtual Hub or VPN Client pool. In our case we will use **10.18.0.0/16**.
2.	Click on your Virtual WAN Resource and navigate to **Virtual network connections** (under Connectivity)
3.	Click **Add connection** and fill in the name, select the hub you created in the previous section and select the Virtual Network and Resource Group from the first step. For the purposes of this tutorial, select **Default** for Associate Route Table.
4.	Create two **Virtual Machines** in this Virtual Network, one with private IP address **10.18.0.5** and one with IP address **10.18.0.4**. 
   

## Securing the Virtual Hub
A standard virtual hub has no security policies built into it protecting the resources in spoke virtual networks. A secured virtual hub uses Azure Firewall or a third party provider to manage in and outgoing traffic to protect your resources in Azure. In this example, we will be using Azure Firewall to provide security functionalities.

1. Secure the Hub using the following [guide.](https://docs.microsoft.com/en-us/azure/virtual-wan/howto-firewall)

### <a name= "create-rules"> </a> Creating Rules to Manage and Filter Traffic
The next important step is to create rules that dictate the behavior of Azure firewall. By securing the hub, we ensure that all packets that enter the virtual hub are subject to firewall processing before accessing your Azure resources. 

At the end of this section, you will have created an architecture that allows VPN users to access the VM with private IP address 10.18.0.4 but **NOT** access the VM with private IP address 10.18.0.5

1.	Navigate to Firewall Manager from Azure portal.
2.	Click on **Azure Firewall policies** under Security.
3.	Click **Create Azure Firewall Policy**
4.	Under **Policy details** type in a name and select the region your Virtual Hub is deployed in
5.	Select **Next: DNS Settings (preview)**.
6.	Select **Next: Rules**.
7.	On the **Rules** tab, select **Add a rule collection**.
8.	Provide a name for the collection and set the type as Network and add a priority value **100**
9.	Fill in the name of the rule, source type, source, protocol, destination ports, destination type, destination type as shown in the picture below and click **add**.  This rule essentially allows any IP address from the VPN client pool to access the VM with private IP address 10.18.04, but not any other resource connected to the Virtual Hub. You may create any rule you wish to fit your desired architecture and permissions rules.

:::image type="content" source="./media/secure-remote-users-firewall/rules.png" alt-text="Set up routing configuration" :::

10.	Select **Next: Threat intelligence**.
11.	Select **Next: Hubs**.
12.	On the **Hubs* tab, select **Associate virtual hubs**.
13.	Select the virtual hub you created [earlier](#create-hub) and then select **Add**.
14.	Select **Review + create**.
15.	Select **Create**.

This can take about five minutes or more to complete. After this has completed, we need to ensure that the traffic that the traffic that goes through your up actually gets routed through the firewall.

16.	From Firewall Manager, select **Secured virtual hubs**.
17.	Select the virtual hub you created [earlier](#create-hub)
18.	Under **Settings**, select **Security configuration**.
19.	Under **Internet traffic**, select **Azure Firewall**.
20.	Under **Private traffic**, select **Send via Azure Firewall**.
21.	Verify that the **hub-spoke** connection shows **Internet Traffic** as **Secured**.
22.	Select **Save**.

## Validating your Setup
If you have been following the steps of this tutorial, we can now verify the setup of our secured hub.
1.	Connect to the **Secured Virtual Hub** via VPN from your client device.
2.	Ping the IP address **10.18.0.4** from your client. You should see a response
3.	Ping the IP address **10.18.0.5** from your client. You should not be able to see a response.

## <a name="troubleshoot"></a>Troubleshooting

* Make sure that the **Effective Routes Table** on the Secured Virtual Hub has the next hop for all traffic to be the Azure Firewall. You can access the Effetive Routes Table by navigating to your **Virtual Hub** resource, click on **Routing** under **Connectivity** then click on **Effective Routes**. From thee, select the **Default** Route table.
* Make sure you follow **steps 16-21** from the [Creating Rules](#create-rules) section. If these steps are missed, the rules you created will not actually be associated to the hub and the route table and packet flow will not use the Azure Firewall.


## Next steps

For more information about Virtual WAN, see:

* The Virtual WAN [FAQ](virtual-wan-faq.md)

For more infromation about Azure Firewall:

* The Azure Firewall [FAQ](../firewall/firewall-faq.md)