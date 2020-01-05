---
title: Configure VPN on your Azure Stack Edge device
description: Describes how to configure VPN on your Azure Stack Edge device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 01/05/2019
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to configure VPN on my Azure Stack Edge device so that I can have a second layer of encryption for my data-in-flight.
---

# Configure VPN on your Azure Stack Edge device

The VPN option provides a second layer of encryption for the data-in-motion over *https* from your Azure Stack Edge device to Azure. 

This article describes the steps required to configure VPN on your Azure Stack Edge device including the configuration in the cloud and the configuration on the device.

## About VPN setup

A cross-premises VPN connection consists of an Azure VPN gateway, an on-premises VPN device, and an IPsec S2S VPN tunnel connecting the two. The typical work flow includes the following steps:

- Configure prerequisites.
- Set up necessary resources on Azure.
    - Create and configure an Azure VPN gateway (virtual network gateway).
    - Create and configure an Azure local network gateway that represents your on-premises network and VPN device.
    - Create and configure an Azure VPN connection between the Azure VPN gateway and the local network gateway.
- Set up VPN in the local web UI of the device. You configure the on-premises VPN device represented by the local network gateway to establish the actual S2S VPN tunnel with the Azure VPN gateway.

The detailed steps are provided in the following sections.

## Configure prerequisites

1. You should have access to an Azure Stack Edge device that is installed as per the instructions in Install your Azure Stack Edge device. This device will serve as the on-premises VPN device to create the VPN connection with Azure. A list of supported devices can found here.

2. Your VPN device should have a static Public IP address (external). This address shouldn't be NAT.

3. You should have access to a valid Azure Subscription that is enabled for Azure Stack Edge / Data Box Gateway service in Azure. Use this subscription to create a corresponding resource in Azure to manage your Azure Stack Edge device. Use the instructions in 

4. You have access to a Windows client that you'll use to access your Azure Stack Edge device. You'll need to configure this client to add networks rules and application rules to the firewall, and add routes to the routing table.

    1. To install the required version of PowerShell on your Windows client, run the following commands:

        ```azurepowershell
        Install-Module -Name Az -AllowClobber -Scope CurrentUser 
        Import-Module Az.Accounts
        ```
    2. To connect to your Azure account and subscription, run the following commands:

        ```azurepowershell
        Connect-AzAccount 
        Set-AzContext -Subscription "<Your subscription name>"
        ```
        Provide the Azure subscription name you are using with your Azure Stack Edge device to configure VPN.

    3. Download the scripts required to create network and application rules and routes from http://aka.ms/ase-vpn-scripts.

    4. Download the service tags from the Azure to your local client and save as a *json* file in the same folder that contains the scripts: https://www.microsoft.com/en-us/download/details.aspx?id=56519 


## VPN configuration in the cloud  

The configuration in Azure requires the following steps:

- Create a virtual network in Azure.
- Create a virtual network gateway.
- Create a local network gateway per node of your Azure Stack Edge device.
- Create a VPN connection object.
- Create firewall.

Each of these steps is described in the following sections.

## Create virtual network

First, you'll create a virtual network resource under your resource group.

1. Create a virtual network resource. In the Azure portal, select **+ Create a resource**, search for *virtual network* and then select **Create**.

2. In the **Basics** tab, provide the subscription, create new or choose from an existing resource group, enter a name for the virtual network, and select the same region as that associated with your Azure Stack Edge device (when creating the resource).

3. In the **IP addresses** tab, assign a valid address space. Accept the default settings for tabs for **Security** and **Tags**. Finally in **Review + Create** tab, review the settings for your virtual network and select **Create**. 

The virtual network is created immediately.

After the virtual network is created, create a subnet.

1. In the virtual network, go to **Settings > Subnets**. Select **+ Subnet** to create a subnet. 

2. Provide the address range and accept the default settings for other parameters.

For more information, go to [Create a virtual network](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal#CreatVNet).

## Create virtual network gateway

Do the following steps:

1. Create a virtual network gateway. In the Azure portal, select **+ Create a resource**, search for *virtual network gateway* and then select **Create**.

2. In the **Basics** tab:

    - Enter the name for your virtual network gateway.
    - Select the same region associated with your device and your virtual network that you created previously.
    - Use the virtual network created previously. 
    - Create a new public IP address and assign it a name.
    - Accept other default settings.

3. In the **Tags** tab, accept all the default settings.

4. In the **Review + create** tab, review the settings associated with your virtual network gateway. Select **Create**.

This operation may take from 20 - 40 minutes. After the  VPN gateway is created, you need to configure a site-to-site connection in it. 

For more information, go to [Configure site-to-site connection on your virutal network gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal#VNetGateway).

## Create local network gateway

Do the following steps:

1. Create a local network gateway. In the Azure portal, select **+ Create a resource**, search for *local network gateway* and then select **Create**.

2. In the **Create local network gateway** blade:

    - Enter a name for your local network gateway.
    - Provide an IP address for your local network gateway.
    - Provide the address space for your local network.
    - Select the same resource group that you used for your virtual network and virtual network gateway.
    - Select the same region that you used for your Azure Stack Edge device and for the virtual network.
    - Accept the other default settings.
    - Select **Create**.

For more information, go to [Create local network gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal#LocalNetworkGateway).

## Create VPN connection

Do the following steps:

1. Create a VPN connection object. In the Azure portal, select **+ Create a resource**, search for *connection* and then select **Create**.

2. In **Step 1: Basics**, configure the basic settings. 

    - Select Connection type as Site-to-site (IPsec).
    - Select the same resource group that you have selected in all the previous steps so far.
    - Select the same location as that associated with the device, virtual network, virtual network gateway, and the local network gateway.
    - Accept other default settings.
    - Select **OK**.

3. In **Step 2: Settings**, configure connection settings. 

    - Choose the virtual network gateway you created previously.
    - Choose the local network gateway you created previously.
    - Specify a name for your connection.
    - Provide a Shared key (PSK). Make a note of this key as you'll need this key later when configuring VPN connection on the local web UI of the device.
    - Accept other default settings.
    - Select **OK**.

4. In **Step 3: Summary**, review your connection settings and create the connection.

For more information, go to [Create VPN connection object](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal#CreateConnection).

## Create firewall, rules, routes

First, you'll next create an Azure Firewall and add network and application rules to it.

Next create an Azure Route table and add routes to it. Finally you'll download the VPN configuration file.

For more information on firewall, rules, routes, go to [Tutorial: Deploy and configure Azure Firewall using the Azure portal](https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal).

### Create firewall

First, you will create an Azure Firewall. Do the following steps:

1. Create an Azure Firewall. In the Azure portal, select **+ Create a resource**, search for *firewall* and then select **Create**.

2. In the **Basics** tab:

    - Select the resource group you have used in the previous steps.
    - Enter the name for your firewall.
    - Select the same region that is associated with your device, virtual network, virtual network gateway, and local network gateway.
    - Use the existing virtual network that you created in the previous step.
    - Provide a name for the public IP address.
    - Accept other default settings.

3. In the **Tags** tab, accept all the default settings.

4. In the **Review + create** tab, review the settings for your firewall and select **Create**.

The firewall may take several minutes to complete.

For more information, go to [Create Azure Firewall](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal#CreatVNet).


### Add rules

First add network rules and then add application rules.

1. Add network rules. To add network rules to your firewall, run the following script: 
 
 
    `.\Add-AzFirewallRoutes.ps1 -ServiceTagAndRegionList AzureCloud.<Azure Region> -AzureIPRangesFilePath <Path to json file containing Azure service tags> -ResourceGroupName <Resource group> -FirewallName <Azure firewall name> -NetworkRuleCollectionName <Network rule name> -Priority 100`

    Here is a sample output: 

    `.\Add-AzFirewallRoutes.ps1 -ServiceTagAndRegionList AzureCloud.centraluseuap -AzureIPRangesFilePath .\ServiceTags_Public_20191209.json -ResourceGroupName myasevpnrg -FirewallName myasefirewall1 -NetworkRuleCollectionName MyNetworkRuleCollection1 -Priority 201`

    > [!NOTE]
    > Make sure that only one region is selected.

2. Verify in Azure portal that the network rules are added.
  
3. Add application rules. To add application rules, run the following script: 

    `.\Add-AzFirewallAppRule.ps1 -AzureAppRuleFilePath .\appRule.json -ResourceGroupName <Resource group name> -FirewallName <Azure Firewall name> -AppRuleCollectionName <App rule name> -Priority 100` 

    Here is a sample output:

    `.\Add-AzFirewallAppRule.ps1 -AzureAppRuleFilePath .\appRule.json -ResourceGroupName myasevpnrg -FirewallName myasefirewall1 -AppRuleCollectionName MyAppRuleCollection1 -Priority 100` 

    Following application rules to be added for https and http. 
    Protocol should be: http:80, https:443 

    [Insert the table of URL patterns for firewall rules]

### Create a routing table

Create a route table. Do the following steps:

1. Create a routing table. In the Azure portal, select **+ Create a resource**, search for *route table* and then select **Create**.

2. In the **Create route table** blade:

    - Provide a name for the route table.
    - Select the same resource group as that selected in all the previous steps.
    - Select the same location as that of the device, virtual networks, and gateways.
    - Accept the other default settings.
    - Select **Create**.

3. Associate the subnet with the route table. In your route table, go to **Settings > Subnets**. 

4. In the right pane, from the top command bar, select **+ Associate**. In the **Associate subnet** blade, select the virtual network you created in the previous step. Select **default** subnet and then select **OK**.

    This associates the default subnet with the routing table. Repeat the steps to add the **GatewaySubnet**. 
    
    **Default** and **GatewaySubnet** are now associated with your route table.
 
### Add routes

Add the routes to the routing table that you created in the previous step. Do the following steps: 
 
1. Add routes. To add routes to the Azure Route table, run the following command:

    `.\ Add-AseAzRoutes.ps1 -ServiceTagAndRegionList azurecloud.<Azure region>,AzureActiveDirectory,AzureActiveDirectoryDomainServices -IntendedAction ApplyAzureRoutes -AzureIPRangesFilePath <Path to json file containing Azure Service tags> -ResourceGroupName <Resource group name> -RouteTableName <Route table name> -FirewallIPv4 <Private IPv4 address for firewall> -RouteNamePrefix "<Prefix for route name>"` 

    Here is a sample output:

    `.\ Add-AseAzRoutes.ps1 -ServiceTagAndRegionList azurecloud.centraluseuap,AzureActiveDirectory,AzureActiveDirectoryDomainServices -IntendedAction ApplyAzureRoutes -AzureIPRangesFilePath .\ServiceTags_Public_20191209.json -ResourceGroupName myasevpnrg -RouteTableName myaseroutetable1 -FirewallIPv4 10.3.1.4 -RouteNamePrefix "myase1routes_"`
 
2. Verify that the routes are added to the route table.

3. Add the following routes manually in the route table. Are these routes now included in the script?

### Download VPN configuration 

To download the VPN configuration, go to the **Connection** you created in the Azure portal in the previous step.

1. In the **Connection**, go to **Overview > Download configuration**.

2. In the **Download configuration** blade:

    - Choose the **device vendor**.
    - Select the **device family**.
    - Select the **firmware version**.
    - Select **Download configuration**.
3. Save the *json* configuration file to use in the local web UI.

For more information, go to [Download configuration for your VPN device](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal#VPNDevice).

## VPN configuration on the device

Do the following steps in the local web UI of your device.

1. Go to **Settings > VPN**.

2. Select **Configure**.

3. In the **Configure VPN** blade:

    - Enable **VPN settings**.
    - Provide the **VPN shared secret**. This is the shared key you provided while creating the Azure VPN connection object.
    - Provide the **VPN gateway IP** address. This is the Azure local network gateway IP address.
    - For **PFS group**, select **None**. 
    - For **DH group**, select **Group2**.
    - For **IPsec integrity method**, select **SHA256**.
    - For IPsec**cipher transform constants**, select **GCMAE256**.
    - For **IPsec authentication transform constants**, select **GCMAES256**.
    - For **IKE encryption method**, select **AES256**.
    - Select **Apply**.

4. To upload the VPN route configuration file, select **Upload**. 

    - Browse to the VPN configuration *json* file that you downloaded on your local system in the previous step.
    - Select the region as the Azure region associated with the device, vnet, and gateways.
    - Select **Apply**.
 
5. To add client-specific routes, configure IP address ranges to be accessed using VPN only. 

    - Under **IP address ranges to be accessed using VPN only**, select **Configure**.
    - Provide a valid IPv4 range and select **Add**. Repeat the steps to add other ranges.
    - Select **Apply**.

## Next steps

[Connect, set up, activate your Azure Stack Edge device](azure-stack-edge-r-series-deploy-connect-setup-activate.md).