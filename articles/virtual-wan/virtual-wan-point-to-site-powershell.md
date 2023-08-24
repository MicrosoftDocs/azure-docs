---

title: Create a point-to-site connection to Azure using PowerShell'
description: Learn how to use Azure Virtual WAN to create a User VPN (point-to-site) connection to Azure using PowerShell.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 08/24/2023
ms.author: cherylmc
---
# Create a P2S User VPN connection using Azure Virtual WAN - PowerShell

This article shows you how to use Virtual WAN to connect to your resources in Azure. In this article, you create a point-to-site User VPN connection over OpenVPN or IPsec/IKE (IKEv2) using PowerShell. This type of connection requires the native VPN client to be configured on each connecting client computer. Most of the steps in this article can be performed using Azure Cloud Shell, except for uploading certificates for certificate authentication.

:::image type="content" source="./media/virtual-wan-about/virtualwanp2s.png" alt-text="Virtual WAN diagram.":::

## Prerequisites

[!INCLUDE [Before beginning](../../includes/virtual-wan-before-include.md)]

### Azure PowerShell

[!INCLUDE [PowerShell](../../includes/vpn-gateway-cloud-shell-powershell-about.md)]

## <a name="signin"></a>Sign in

[!INCLUDE [sign in](../../includes/vpn-gateway-cloud-shell-ps-login.md)]

## <a name="openvwan"></a>Create a virtual WAN

Before you can create a virtual wan, you have to create a resource group to host the virtual wan or use an existing resource group. Create a resource group with [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup). This example creates a new resource group named **testRG** in the **West US** location:

1. Create a resource group:

   ```azurepowershell-interactive
   New-AzResourceGroup -Location "West US" -Name "testRG" 
   ```

1. Create the virtual wan:

   ```azurepowershell-interactive
   $virtualWan = New-AzVirtualWan -ResourceGroupName testRG -Name myVirtualWAN -Location "West US"
   ```

## <a name="p2sconfig"></a>Create a User VPN configuration

The User VPN (P2S) configuration defines the parameters for remote clients to connect. The instructions you follow depend on the authentication method you want to use.

In the following steps, when selecting the authentication method, you have three choices. Each method has specific requirements. Select one of the following methods, and then complete the steps.

* **Azure certificates:** For this configuration, certificates are required. You need to either generate or obtain certificates. A client certificate is required for each client. Additionally, the root certificate information (public key) needs to be uploaded. For more information about the required certificates, see [Generate and export certificates](certificates-point-to-site.md).

* **Radius-based authentication:** Obtain the Radius server IP, Radius server secret, and certificate information.

* **Azure Active Directory authentication:** See [Configure a User VPN connection - Azure Active Directory authentication](virtual-wan-point-to-site-azure-ad.md).

### Configuration steps using Azure Certificate authentication

1. User VPN (point-to-site) connections can use certificates to authenticate. To create a self-signed root certificate and generate client certificates using PowerShell, see [Generate and export certificates](certificates-point-to-site.md).

1. Once you've generated and exported the self-signed root certificate, you need to reference the location of the stored certificate. This step can't be completed using Azure Cloud Shell because you can't upload certificate files through the Cloud Shell interface. To perform the next steps in this section, you need to either install the Azure PowerShell cmdlets and use PowerShell locally, or use the [Azure portal](virtual-wan-point-to-site-portal.md#p2sconfig).

   ```azurepowershell
   $VpnServerConfigCertFilePath = Join-Path -Path /home/name -ChildPath "\P2SRootCert1.cer"
   $listOfCerts = New-Object "System.Collections.Generic.List[String]"
   $listOfCerts.Add($VpnServerConfigCertFilePath)
   ```

1. Create the User VPN Server Configuration. For the VPN protocol, you can choose IKEv2 VPN, OpenVPN, and OpenVPN and IKEv2, depending on your requirements.

   ```azurepowershell
   New-AzVpnServerConfiguration -Name testconfig -ResourceGroupName testRG -VpnProtocol IkeV2 -VpnAuthenticationType Certificate -VpnClientRootCertificateFilesList $listOfCerts -VpnClientRevokedCertificateFilesList $listOfCerts -Location westus
   ```

## <a name="hub"></a>Create the hub and point-to-site gateway

1. Create the virtual hub.

   ```azurepowershell-interactive
   New-AzVirtualHub -VirtualWan $virtualWan -ResourceGroupName "testRG" -Name "westushub" -AddressPrefix "10.11.0.0/24" -Location "westus"
   ```

1. Declare the variables for the existing resources and specify the Client address pool from which IP addresses will be automatically assigned to VPN clients.

   ```azurepowershell-interactive
   $virtualHub = Get-AzVirtualHub -ResourceGroupName testRG -Name westushub
   $vpnServerConfig = Get-AzVpnServerConfiguration -ResourceGroupName testRG -Name testconfig
   $vpnClientAddressSpaces = New-Object string[] 1
   $vpnClientAddressSpaces[0] = "192.168.2.0/24"
   ```

1. For the point-to-site gateway, you need to specify the gateway scale units and also reference the User VPN Server Configuration created earlier. Creating a point-to-site gateway can take 30 minutes or more to complete.

   ```azurepowershell-interactive
   $P2SVpnGateway = New-AzP2sVpnGateway -ResourceGroupName testRG -Name p2svpngw -VirtualHub $virtualHub -VpnGatewayScaleUnit 1 -VpnClientAddressPool $vpnClientAddressSpaces -VpnServerConfiguration $vpnServerConfig -EnableInternetSecurityFlag -EnableRoutingPreferenceInternetFlag
   ```

## <a name="download"></a>Generate client configuration files

When you connect to VNet using User VPN (P2S), you use the VPN client that is natively installed on the operating system from which you're connecting. All of the necessary configuration settings for the VPN clients are contained in a VPN client configuration zip file. The settings in the zip file help you easily configure the VPN clients. The VPN client configuration files that you generate are specific to the User VPN configuration for your gateway. In this section, you run the script to get the profile URL to generate and download the files used to configure your VPN clients.

```azurepowershell-interactive
Get-AzVirtualWanVpnServerConfigurationVpnProfile -Name myVirtualWAN -ResourceGroupName testRG -VpnServerConfiguration $vpnServerConfig -AuthenticationMethod EAPTLS
```

## <a name="configure-client"></a>Configure VPN clients

Use the downloaded profile package to configure the remote access VPN clients. The procedure for each operating system is different. Follow the instructions that apply to your system.
Once you have finished configuring your client, you can connect.

[!INCLUDE [Configure clients](../../includes/virtual-wan-p2s-configure-clients-include.md)]

## <a name="connect-vnet"></a>Connect VNet to hub

1. Declare a variable to get the already existing virtual network.

   ```azurepowershell-interactive
   $remoteVirtualNetwork = Get-AzVirtualNetwork -Name "testRGvnet" -ResourceGroupName "testRG"
   ```

1. Create a connection between your virtual hub and your VNet.

   ```azurepowershell-interactive
   New-AzVirtualHubVnetConnection -ResourceGroupName "testRG" -VirtualHubName "westushub" -Name "testvnetconnection" -RemoteVirtualNetwork $remoteVirtualNetwork
   ```

## <a name="cleanup"></a>Clean up resources

When you no longer need the resources that you created, delete them. Some of the Virtual WAN resources must be deleted in a certain order due to dependencies. Deleting can take about 30 minutes to complete.

Delete the gateway entities following the below order for the point-to-site VPN configuration. This can take up to 30 minutes to complete.

1. Delete the point-to-site VPN gateway.

   ```azurepowershell-interactive
   Remove-AzP2sVpnGateway -Name "p2svpngw" -ResourceGroupName "testRG"
   ```

1. Delete the User VPN Server configuration.

   ```azurepowershell-interactive
   Remove-AzVpnServerConfiguration -Name "testconfig" -ResourceGroupName "testRG"
   ```

1. You can delete the entire resource group in order to delete all the remaining resources it contains, including the hubs, sites, and the virtual WAN.

   ```azurepowershell-interactive
   Remove-AzResourceGroup -Name "testRG"
   ```

1. Or, you can choose to delete each of the resources in the resource group.

   Delete the virtual hub.

   ```azurepowershell-interactive
   Remove-AzVirtualHub -ResourceGroupName "testRG" -Name "westushub"
    ```

   Delete the virtual WAN.

   ```azurepowershell-interactive
   Remove-AzVirtualWan -Name "MyVirtualWan" -ResourceGroupName "testRG"
   ```

## Next steps

Next, to learn more about Virtual WAN, see the [Virtual WAN FAQ](virtual-wan-faq.md).
