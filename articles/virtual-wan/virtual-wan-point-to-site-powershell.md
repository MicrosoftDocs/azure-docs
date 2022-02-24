---

title: 'Tutorial: Use Azure Virtual WAN to create a Point-to-Site connection to Azure using PowerShell'
description: In this tutorial, learn how to use Azure Virtual WAN to create a User VPN (point-to-site) connection to Azure using PowerShell
services: virtual-wan
author: reasuquo

ms.service: virtual-wan
ms.topic: tutorial
ms.date: 02/01/2022
ms.author: reasuquo

---
# Tutorial: Create a User VPN connection to Azure Virtual WAN using PowerShell

This tutorial shows you how to use Virtual WAN to connect to your resources in Azure over an OpenVPN or IPsec/IKE (IKEv2) VPN connection using a User VPN (P2S) configuration using PowerShell. This type of connection requires the native VPN client to be configured on each connecting client computer.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual WAN
> * Create the User VPN configuration
> * Create the virtual hub and gateway
> * Generate client configuration files
> * Configure VPN clients
> * Connect to a VNet
> * Clean up resources


:::image type="content" source="./media/virtual-wan-about/virtualwanp2s.png" alt-text="Virtual WAN diagram.":::

## Prerequisites

[!INCLUDE [Before beginning](../../includes/virtual-wan-before-include.md)]

### Azure PowerShell

[!INCLUDE [PowerShell](../../includes/vpn-gateway-cloud-shell-powershell-about.md)]

## <a name="signin"></a>Sign in

[!INCLUDE [sign in](../../includes/vpn-gateway-cloud-shell-ps-login.md)]

## <a name="openvwan"></a>Create a virtual WAN

Before you can create a virtual wan, you have to create a resource group to host the virtual wan or use an existing resource group. Create a resource group with [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup). This example creates a new resource group named **testRG** in the **West US** location: 

Create a resource group:

```azurepowershell-interactive 
New-AzResourceGroup -Location "West US" -Name "testRG" 
``` 

Create the virtual wan:

```azurepowershell-interactive
$virtualWan = New-AzVirtualWan -ResourceGroupName testRG -Name myVirtualWAN -Location "West US"
```

## <a name="p2sconfig"></a>Create a User VPN configuration

The User VPN (P2S) configuration defines the parameters for remote clients to connect depending on the authentication method you want to use. When selecting the authentication method, there are three methods available with each method having its specific requirements.

* **Azure certificates:** For this configuration, certificates are required. You need to either generate or obtain certificates. A client certificate is required for each client. Additionally, the root certificate information (public key) needs to be uploaded. For more information about the required certificates, see [Generate and export certificates](certificates-point-to-site.md).

* **Azure Active Directory authentication:** Use the [Configure a User VPN connection - Azure Active Directory authentication](virtual-wan-point-to-site-azure-ad.md) article, which contains the specific steps necessary for this configuration.

* **Radius-based authentication:** Obtain the Radius server IP, Radius server secret, and certificate information.

### Configuration steps using Azure Certificate authentication

User VPN (point-to-site) connections can use certificates to authenticate. To create a self-signed root certificate and generate client certificates using PowerShell on Windows 10 or Windows Server 2016, see [Generate and export certificates](certificates-point-to-site.md).

Once you have generated and exported the self-signed root certificate, you need to reference the location of the stored certificate. If using Cloud Shell on the Azure portal, you would need to upload the certificate first.

```azurepowershell-interactive 
$VpnServerConfigCertFilePath = Join-Path -Path /home/name -ChildPath "\P2SRootCert1.cer"
$listOfCerts = New-Object "System.Collections.Generic.List[String]"
$listOfCerts.Add($VpnServerConfigCertFilePath)
``` 

Next is to create the User VPN Server Configuration. For the VPN Protocol, you can choose IKEv2 VPN, OpenVPN, and OpenVpn and IKEv2 depending on your requirements. 

```azurepowershell-interactive 
New-AzVpnServerConfiguration -Name testconfig -ResourceGroupName testRG -VpnProtocol IkeV2 -VpnAuthenticationType Certificate -VpnClientRootCertificateFilesList $listOfCerts -VpnClientRevokedCertificateFilesList $listOfCerts -Location westus
``` 

## <a name="hub"></a>Create the hub and Point-to-Site Gateway

```azurepowershell-interactive 
New-AzVirtualHub -VirtualWan $virtualWan -ResourceGroupName "testRG" -Name "westushub" -AddressPrefix "10.11.0.0/24" -Location "westus"
``` 

Next you declare the variables for the existing resources and  also specify the Client address pool from which IP addresses will be automatically assigned to VPN clients.

```azurepowershell-interactive 
$virtualHub = Get-AzVirtualHub -ResourceGroupName testRG -Name westushub
$vpnServerConfig = Get-AzVpnServerConfiguration -ResourceGroupName testRG -Name testconfig
$vpnClientAddressSpaces = New-Object string[] 1
$vpnClientAddressSpaces[0] = "192.168.2.0/24"
``` 

For the Point-to-Site Gateway, you need to specify the Gateway scale units and also reference the User VPN Server Configuration created earlier. Creating a Point-to-Site Gateway can take 30 minutes or more to complete

```azurepowershell-interactive 
$P2SVpnGateway = New-AzP2sVpnGateway -ResourceGroupName testRG -Name p2svpngw -VirtualHub $virtualHub -VpnGatewayScaleUnit 1 -VpnClientAddressPool $vpnClientAddressSpaces -VpnServerConfiguration $vpnServerConfig -EnableInternetSecurityFlag -EnableRoutingPreferenceInternetFlag
``` 

## <a name="download"></a>Generate client configuration files

When you connect to VNet using User VPN (P2S), you use the VPN client that is natively installed on the operating system from which you are connecting. All of the necessary configuration settings for the VPN clients are contained in a VPN client configuration zip file. The settings in the zip file help you easily configure the VPN clients. The VPN client configuration files that you generate are specific to the User VPN configuration for your gateway. In this section, you run the script to get the profile URL to generate and download the files used to configure your VPN clients.

```azurepowershell-interactive 
Get-AzVirtualWanVpnServerConfigurationVpnProfile -Name myVirtualWAN -ResourceGroupName testRG -VpnServerConfiguration $vpnServerConfig -AuthenticationMethod EAPTLS
``` 

## <a name="configure-client"></a>Configure VPN clients

Use the downloaded profile package to configure the remote access VPN clients. The procedure for each operating system is different. Follow the instructions that apply to your system.
Once you have finished configuring your client, you can connect.

[!INCLUDE [Configure clients](../../includes/virtual-wan-p2s-configure-clients-include.md)]

## <a name="connect-vnet"></a>Connect VNet to hub

First the declare a variable to get the already existing Virtual network

```azurepowershell-interactive 
$remoteVirtualNetwork = Get-AzVirtualNetwork -Name "testRGvnet" -ResourceGroupName "testRG"
``` 

Then you create a connection between your virtual hub and your VNet.
 
```azurepowershell-interactive 
New-AzVirtualHubVnetConnection -ResourceGroupName "testRG" -VirtualHubName "westushub" -Name "testvnetconnection" -RemoteVirtualNetwork $remoteVirtualNetwork
``` 

## <a name="cleanup"></a>Clean up resources

When you no longer need the resources that you created, delete them. Some of the Virtual WAN resources must be deleted in a certain order due to dependencies. Deleting can take about 30 minutes to complete.

1. Delete the gateway entities following the below order for the Point-to-Site VPN configuration. This can take up to 30 minutes to complete.

    Delete the Point-to-Site VPN Gateway 
    
     ```azurepowershell-interactive
        Remove-AzP2sVpnGateway -Name "p2svpngw" -ResourceGroupName "testRG"
     ```

    Delete the User VPN Server configuration
        
     ```azurepowershell-interactive
        Remove-AzVpnServerConfiguration -Name "testconfig" -ResourceGroupName "testRG"
     ```

1. You can delete the Resource Group to delete all the other resources in the resource group, including the hubs, sites and the virtual WAN.

    ```azurepowershell-interactive
    Remove-AzResourceGroup -Name "testRG"
    ```

1. Or you can choose to delete each of the resources in the Resource Group
 
    Delete the Virtual Hub
    
    ```azurepowershell-interactive
    Remove-AzVirtualHub -ResourceGroupName "testRG" -Name "westushub"
    ```
    
    Delete the Virtual WAN
    
    ```azurepowershell-interactive
    Remove-AzVirtualWan -Name "MyVirtualWan" -ResourceGroupName "testRG"
    ```


## Next steps

Next, to learn more about Virtual WAN, see:

> [!div class="nextstepaction"]
> * [Virtual WAN FAQ](virtual-wan-faq.md)