---
title: 'How to configure OpenVPN on Azure VPN Gateway: PowerShell| Microsoft Docs'
description: Steps to configure OpenVPN for Azure VPN Gateway
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 09/21/2018
ms.author: cherylmc

---
# Configure OpenVPN for Azure point-to-site VPN Gateway (Preview)

This article helps you set up OpenVPN on Azure VPN Gateway. The article assumes that you already have a working point-to-site environment. If you do not, use the instructions in step 1 to create a point-to-site VPN.

> [!IMPORTANT]
> OpenVPN for Azure point-to-site VPN Gateway is a managed Public Preview. To use Virtual WAN, you must [Enroll in the Preview](#enroll).
>
> This Public Preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.

## Before you begin

Verify that you have met the following prerequistes:

* Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

## <a name="vnet"></a>1. Create a point-to-site VPN

If you don't already have a functioning point-to-site environment, follow the instruction to create one. See [Create a point-to-site VPN](vpn-gateway-howto-point-to-site-resource-manager-portal.md) to create and configure a point-to-site VPN gateway with native Azure certificate authentication.

## <a name="enroll"></a>2. Enroll in the preview

Send ali.zaman@microsoft.com the subscription ID and the name of the newly created gateway to get the Microsoft.Network/AllowVnetGatewayOpenVpnProtocol feature enabled.

## <a name="cmdlets"></a>3. Install the Azure Resource Manager PowerShell cmdlets.

1. Use the following example to install the required version of the PowerShell cmdlets.

  ```powershell
  Save-Module -Name AzureRM -Path c:\ps -RequiredVersion 6.4.0
  Install-Module -Name AzureRM -RequiredVersion 6.4.0
  ```

  For more information about installing the PowerShell cmdlets, see [How to install and configure Azure PowerShell](/powershell/azure/overview).
2. Verify that the **AzureRM.Network** version is 6.3.0 or greater

![Certificate data](./media/vpn-gateway-howto-openvpn/rmnetworkversion.png)

## <a name="cmdlets"></a>4. Update the gateway with OpenVPN protocol

Once you have confirmation that the 'AllowVnetGatewayOpenVpnProtocol' feature flag has been enabled for your subscription, enable OpenVPN on your gateway. Make sure that the gateway is already configured for point-to-site (IKEv2 or SSTP) before running the commands below.

```powershell
$gw = Get-AzureRmVirtualNetworkGateway -ResourceGroupName $rgname -name $name
Set-AzureRmVirtualNetworkGateway -VirtualNetworkGateway $gw -VpnClientProtocol OpenVPN
```

## Next Steps

To configure clients for OpenVPN, see [Configure OpenVPN clients](vpn-gateway-howto-openvpn-clients.md)