---
title: Configure VPN on your Azure Stack Edge Pro R device using Azure PowerShell
description: Describes how to configure VPN on your Azure Stack Edge Pro R device using an Azure PowerShell script to create Azure resources.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 10/23/2020
ms.author: alkohli 
ms.custom: devx-track-azurepowershell
#Customer intent: As an IT admin, I need to understand how to configure VPN on my Azure Stack Edge Pro R device so that I can have a second layer of encryption for my data-in-flight.
---

# Configure VPN on your Azure Stack Edge Pro R device via Azure PowerShell

<!--[!INCLUDE [applies-to-r-skus](../../includes/azure-stack-edge-applies-to-r-sku.md)]-->

The VPN option provides a second layer of encryption for the data-in-motion over *TLS* from your Azure Stack Edge Pro R device to Azure. You can configure VPN on your Azure Stack Edge Pro R device via the Azure portal or via Azure PowerShell.

This article describes the steps required to configure VPN on your Azure Stack Edge Pro R device using an Azure PowerShell to create the configuration in the cloud.

## About VPN setup

A cross-premises VPN connection consists of an Azure VPN gateway, an on-premises VPN device, and an IPsec S2S VPN tunnel connecting the two. The typical work flow includes the following steps:

- Configure prerequisites.
- Set up necessary resources on Azure.
    - Create and configure an Azure VPN gateway (virtual network gateway).
    - Create and configure an Azure local network gateway that represents your on-premises network and VPN device.
    - Create and configure an Azure VPN connection between the Azure VPN gateway and the local network gateway.
    - Set up Azure Firewall and add network and app rules.
    - Create Azure Routing Table and add routes.
- Set up VPN in the local web UI of the device. You configure the on-premises VPN device represented by the local network gateway to establish the actual S2S VPN tunnel with the Azure VPN gateway.

The detailed steps are provided in the following sections.

## Configure prerequisites

1. You should have access to an Azure Stack Edge Pro R device that is installed as per the instructions in [Install your Azure Stack Edge Pro R device](azure-stack-edge-pro-r-deploy-install.md). This device will serve as the on-premises VPN device to create the VPN connection with Azure. 

2. Your VPN device should have a static Public IP address (external). This address shouldn't be NAT.

3. You should have access to a valid Azure Subscription that is enabled for Azure Stack Edge service in Azure. Use this subscription to create a corresponding resource in Azure to manage your Azure Stack Edge Pro R device.  

4. You have access to a Windows client that you'll use to access your Azure Stack Edge Pro R device. You'll use this client to programmatically create the configuration in the cloud.

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
        Provide the Azure subscription name you are using with your Azure Stack Edge Pro R device to configure VPN.

    3. [Download the script](https://aka.ms/ase-vpn-deployment) required to create configuration in the cloud. The script will:
        
        - Create an Azure Virtual network and the following subnets: *GatewaySubnet*, and *AzureFirewallSubnet*.
        - Create and configure an Azure VPN gateway.
        - Create and configure an Azure local network gateway.
        - Create and configure an Azure VPN connection between the Azure VPN gateway and the local network gateway.
        - Create an Azure Firewall and add network rules, app rules.
        - Create an Azure Routing table and add routes to it.


## Use the script

First you modify the `parameters.json` file to input your parameters. Next, you run the script using the modified json file.

Each of these steps is discussed in the following sections.

### Download service tags file

You may already have a `ServiceTags.json` file in the folder where you downloaded the script. If not, you can download the service tags file.

[!INCLUDE [azure-stack-edge-gateway-download-service-tags](../../includes/azure-stack-edge-gateway-download-service-tags.md)]

### Modify parameters file

The first step would be to modify the `parameters.json` file and save the changes. 


For the Azure resources that you create, you'll provide the following names:

|Parameter name  |Description  |
|---------|---------|
|virtualNetworks_vnet_name    | Azure Virtual Network name        |
|azureFirewalls_firewall_name     | Azure Firewall name        |
|routeTables_routetable_name     | Azure Route table name        |
|publicIPAddresses_VNGW_public_ip_name     | Public IP address name for your Virtual network gateway       |
|virtualNetworkGateways_VNGW_name    | Azure VPN gateway (virtual network gateway) name        |
|publicIPAddresses_firewall_public_ip_name     | Public IP address name for your Azure Firewall         |
|localNetworkGateways_LNGW_name    |Azure Local network gateway name          |
|connections_vngw_lngw_name    | Azure VPN connection name. This is the connection between your virtual network gateway and the local network gateway.       |
|location     |This is the region in which you want to create your virtual network. Select the same region as the one associated with your device.         |

The following IP addresses and address spaces pertain to the Azure resources that are created including the virtual network and associated subnets (default, firewall, GatewaySubnet).

|Parameter name  |Description  |
|---------|---------|
|VnetIPv4AddressSpace    | This is the address space associated with your virtual network.       |
|DefaultSubnetIPv4AddressSpace    |This is the address space associated with the `Default` subnet for your virtual network.         |
|FirewallSubnetIPv4AddressSpace    |This is the address space associated with the `Firewall` subnet for your virtual network.          |
|GatewaySubnetIPv4AddressSpace    |This is the address space associated with the `GatewaySubnet` for your virtual network.          |
|GatewaySubnetIPv4bgpPeeringAddress    | This is the IP address that is reserved for BGP communication and is based off the address space associated with the `GatewaySubnet` for your virtual network.          |

The following IP addresses and address spaces pertain to the on-premises network (where your Azure Stack Edge Pro R device is deployed).

|Parameter name  |Description  |
|---------|---------|
|CustomerNetworkAddressSpace    |  This is the address space for your private IP address.       |
|CustomerPublicNetworkAddressSpace    |  This is the address space for your public IP address.       |
|DbeIOTNetworkAddressSpace    |This IP address is reserved by the IoT service. Do not change this parameter.        |
|AzureVPNsharedKey    |This shared key is used during the creation of Azure VPN connection resource. This key is also provided as the VPN shared secret during the local web UI VPN configuration.         |
|DBE-Gateway-ipaddress   | Public IP address for your Azure Stack Edge Pro R device. This may not be known and you can run the script with a placeholder IP address. Edit the local network gateway later with the actual IP address.     |

#### Caveats to keep in mind:

- You'll not have the IP address of the Azure Stack Edge Pro R device. You can use a placeholder IP address to create your resource and later modify the Azure local network gateway to assign the actual device IP address and the address space of the local network for the device.
- Based on direction from IETF on Internet Assigned Numbers Authority (IANA), use any subnet from 172.16.x.y to 172.24.z.a. We reserve the 172.24 IPv4 address ranges for the Azure network.

### Run the script

Follow these steps to use the modified `parameters.json` and run the script to create Azure resources.

1. Run PowerShell as an administrator.

2. Switch to the directory where the script is located.

3. Run the script.

    `.\AzDeployVpn.ps1 -Location <Location> -AzureAppRuleFilePath "appRule.json" -AzureIPRangesFilePath "<Service tag json file>"  -ResourceGroupName "<Resource group name>" -AzureDeploymentName "<Deployment name>" -NetworkRuleCollectionName "<Name for collection of network rules>" -Priority 115 -AppRuleCollectionName "<Name for collection of app rules>"`

    A sample output is shown below.

    `.\AzDeployVpn.ps1 -Location eastus -AzureAppRuleFilePath "appRule.json" -AzureIPRangesFilePath "ServiceTags_Public_20191216.json"  -ResourceGroupName "devtestrg4" -AzureDeploymentName "dbetestdeployment20" -NetworkRuleCollectionName "testnrc20" -Priority 115 -AppRuleCollectionName "testarc20"`

    The script takes approximately 90 minutes to run. After the script is complete, a deployment log is generated in the same folder where the script resides.


## Verify the Azure resources

After you've successfully run the script, verify that all the resources were created in Azure.

You'll next configure the VPN on the local web UI of your device.


## VPN configuration on the device

[!INCLUDE [azure-stack-edge-gateway-configure-vpn-local-ui](../../includes/azure-stack-edge-gateway-configure-vpn-local-ui.md)]


## Verify VPN

[!INCLUDE [azure-stack-edge-gateway-verify-vpn](../../includes/azure-stack-edge-gateway-verify-vpn.md)]

## Validate data transfer through VPN

To confirm that VPN is working, copy data to an SMB share. Follow the steps in [Add a share](azure-stack-edge-gpu-manage-shares.md#add-a-share) on your Azure Stack Edge Pro R device. 

1. Copy a file, for example \data\pictures\waterfall.jpg to the SMB share that you mounted on your client system. 
2. Verify that this file shows up in your storage account on the cloud.

To validate that the data is going through VPN:

1. Open the Connection resource present in the resource group. 

2. Check the Data in and Data Out value.
 
3. Open the Virtual Network Gateway in your resource group. View the charts for **Total tunnel ingress** and **Total tunnel egress**.
 
## Debug issues

To debug any issues, use the following commands:

```
Get-AzResourceGroupDeployment -DeploymentName $deploymentName -ResourceGroupName $ResourceGroupName
```

The sample output is shown below:


```azurepowershell
PS C:\Projects\VPN\Azure-VpnDeployment> Get-AzResourceGroupDeployment -DeploymentName "aseprorvpnrg14_deployment" -ResourceGroupName "aseprorvpnrg14"


DeploymentName          : aseprorvpnrg14_deployment
ResourceGroupName       : aseprorvpnrg14
ProvisioningState       : Succeeded
Timestamp               : 10/21/2020 6:23:13 PM
Mode                    : Incremental
TemplateLink            :
Parameters              :
                          Name                                         Type                       Value
                          ===========================================  =========================  ==========
                          virtualNetworks_vnet_name                    String                     aseprorvpnrg14_vnet
                          azureFirewalls_firewall_name                 String                     aseprorvpnrg14_firewall
                          routeTables_routetable_name                  String                     aseprorvpnrg14_routetable
                          publicIPAddresses_VNGW_public_ip_name        String                     aseprorvpnrg14_vngwpublicip
                          virtualNetworkGateways_VNGW_name             String                     aseprorvpnrg14_vngw
                          publicIPAddresses_firewall_public_ip_name    String                     aseprorvpnrg14_fwpip
                          localNetworkGateways_LNGW_name               String                     aseprorvpnrg14_lngw
                          connections_vngw_lngw_name                   String                     aseprorvpnrg14_connection
                          location                                     String                     East US
                          vnetIPv4AddressSpace                         String                     172.24.0.0/16
                          defaultSubnetIPv4AddressSpace                String                     172.24.0.0/24
                          firewallSubnetIPv4AddressSpace               String                     172.24.1.0/24
                          gatewaySubnetIPv4AddressSpace                String                     172.24.2.0/24
                          gatewaySubnetIPv4bgpPeeringAddress           String                     172.24.2.254
                          customerNetworkAddressSpace                  String                     10.0.0.0/18
                          customerPublicNetworkAddressSpace            String                     207.68.128.0/24
                          dbeIOTNetworkAddressSpace                    String                     10.139.218.0/24
                          azureVPNsharedKey                            String                     1234567890
                          dbE-Gateway-ipaddress                        String                     207.68.128.113

Outputs                 :
                          Name                     Type                       Value
                          =======================  =========================  ==========
                          virtualNetwork           Object                     {
                            "provisioningState": "Succeeded",
                            "resourceGuid": "dcf673d3-5c73-4764-b077-77125eda1303",
                            "addressSpace": {
                              "addressPrefixes": [
                                "172.24.0.0/16"
                              ]
================= CUT ============================= CUT ===========================
```


```
Get-AzResourceGroupDeploymentOperation -ResourceGroupName $ResourceGroupName -DeploymentName $AzureDeploymentName
```

## Next steps

[Configure VPN via local UI on your Azure Stack Edge Pro R device](azure-stack-edge-pro-r-deploy-configure-certificates-vpn-encryption.md#configure-vpn)
