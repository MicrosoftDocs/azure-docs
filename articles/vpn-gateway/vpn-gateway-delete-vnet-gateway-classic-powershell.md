---
title: 'Delete a virtual network gateway: Azure classic'
description: Delete a virtual network gateway using PowerShell in the classic deployment model.
titleSuffix: Azure VPN Gateway
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 01/09/2020
ms.author: cherylmc
---
# Delete a virtual network gateway using PowerShell (classic)

> [!div class="op_single_selector"]
> * [Resource Manager - Azure portal](vpn-gateway-delete-vnet-gateway-portal.md)
> * [Resource Manager - PowerShell](vpn-gateway-delete-vnet-gateway-powershell.md)
> * [Classic - PowerShell](vpn-gateway-delete-vnet-gateway-classic-powershell.md)
>

This article helps you delete a VPN gateway in the classic deployment model by using PowerShell. After the virtual network gateway has been deleted, modify the network configuration file to remove elements that you are no longer using.

## <a name="connect"></a>Step 1: Connect to Azure

### 1. Install the latest PowerShell cmdlets.

[!INCLUDE [vpn-gateway-classic-powershell](../../includes/vpn-gateway-powershell-classic-locally.md)]

### 2. Connect to your Azure account.

Open your PowerShell console with elevated rights and connect to your account. Use the following example to help you connect:

1. Open your PowerShell console with elevated rights. To switch to service management, use this command:

   ```powershell
   azure config mode asm
   ```
2. Connect to your account. Use the following example to help you connect:

   ```powershell
   Add-AzureAccount
   ```

## <a name="export"></a>Step 2: Export and view the network configuration file

Create a directory on your computer and then export the network configuration file to the directory. You use this file to both view the current configuration information, and also to modify the network configuration.

In this example, the network configuration file is exported to C:\AzureNet.

```powershell
Get-AzureVNetConfig -ExportToFile C:\AzureNet\NetworkConfig.xml
```

Open the file with a text editor and view the name for your classic VNet. When you create a VNet in the Azure portal, the full name that Azure uses is not visible in the portal. For example, a VNet that appears to be named 'ClassicVNet1' in the Azure portal, may have a much longer name in the network configuration file. The name might look something like: 'Group ClassicRG1 ClassicVNet1'. Virtual network names are listed as **'VirtualNetworkSite name ='**. Use the names in the network configuration file when running your PowerShell cmdlets.

## <a name="delete"></a>Step 3: Delete the virtual network gateway

When you delete a virtual network gateway, all connections to the VNet through the gateway are disconnected. If you have P2S clients connected to the VNet, they will be disconnected without warning.

This example deletes the virtual network gateway. Make sure to use the full name of the virtual network from the network configuration file.

```powershell
Remove-AzureVNetGateway -VNetName "Group ClassicRG1 ClassicVNet1"
```

If successful, the return shows:

```
Status : Successful
```

## <a name="modify"></a>Step 4: Modify the network configuration file

When you delete a virtual network gateway, the cmdlet does not modify the network configuration file. You need to modify the file to remove the elements that are no longer being used. The following sections help you modify the network configuration file that you downloaded.

### <a name="lnsref"></a>Local Network Site References

To remove site reference information, make configuration changes to **ConnectionsToLocalNetwork/LocalNetworkSiteRef**. Removing a local site reference triggers Azure to delete a tunnel. Depending on the configuration that you created, you may not have a **LocalNetworkSiteRef** listed.

```
<Gateway>
   <ConnectionsToLocalNetwork>
     <LocalNetworkSiteRef name="D1BFC9CB_Site2">
       <Connection type="IPsec" />
     </LocalNetworkSiteRef>
   </ConnectionsToLocalNetwork>
 </Gateway>
```

Example:

```
<Gateway>
   <ConnectionsToLocalNetwork>
   </ConnectionsToLocalNetwork>
 </Gateway>
```

### <a name="lns"></a>Local Network Sites

Remove any local sites that you are no longer using. Depending on the configuration you created, it is possible that you don't have a **LocalNetworkSite** listed.

```
<LocalNetworkSites>
  <LocalNetworkSite name="Site1">
    <AddressSpace>
      <AddressPrefix>192.168.0.0/16</AddressPrefix>
    </AddressSpace>
    <VPNGatewayAddress>5.4.3.2</VPNGatewayAddress>
  </LocalNetworkSite>
  <LocalNetworkSite name="Site3">
    <AddressSpace>
      <AddressPrefix>192.168.0.0/16</AddressPrefix>
    </AddressSpace>
    <VPNGatewayAddress>57.179.18.164</VPNGatewayAddress>
  </LocalNetworkSite>
 </LocalNetworkSites>
```

In this example, we removed only Site3.

```
<LocalNetworkSites>
  <LocalNetworkSite name="Site1">
    <AddressSpace>
      <AddressPrefix>192.168.0.0/16</AddressPrefix>
    </AddressSpace>
    <VPNGatewayAddress>5.4.3.2</VPNGatewayAddress>
  </LocalNetworkSite>
 </LocalNetworkSites>
```

### <a name="clientaddresss"></a>Client AddressPool

If you had a P2S connection to your VNet, you will have a **VPNClientAddressPool**. Remove the client address pools that correspond to the virtual network gateway that you deleted.

```
<Gateway>
    <VPNClientAddressPool>
      <AddressPrefix>10.1.0.0/24</AddressPrefix>
    </VPNClientAddressPool>
  <ConnectionsToLocalNetwork />
 </Gateway>
```

Example:

```
<Gateway>
  <ConnectionsToLocalNetwork />
 </Gateway>
```

### <a name="gwsub"></a>GatewaySubnet

Delete the **GatewaySubnet** that corresponds to the VNet.

```
<Subnets>
   <Subnet name="FrontEnd">
     <AddressPrefix>10.11.0.0/24</AddressPrefix>
   </Subnet>
   <Subnet name="GatewaySubnet">
     <AddressPrefix>10.11.1.0/29</AddressPrefix>
   </Subnet>
 </Subnets>
```

Example:

```
<Subnets>
   <Subnet name="FrontEnd">
     <AddressPrefix>10.11.0.0/24</AddressPrefix>
   </Subnet>
 </Subnets>
```

## <a name="upload"></a>Step 5: Upload the network configuration file

Save your changes and upload the network configuration file to Azure. Make sure you change the file path as necessary for your environment.

```powershell
Set-AzureVNetConfig -ConfigurationPath C:\AzureNet\NetworkConfig.xml
```

If successful, the return shows something similar to this example:

```
OperationDescription        OperationId                      OperationStatus                                                
--------------------        -----------                      ---------------                                           
Set-AzureVNetConfig         e0ee6e66-9167-cfa7-a746-7casb9   Succeeded
```
