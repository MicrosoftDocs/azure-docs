---
title: 'Delete a virtual network gateway: Azure classic'
description: Learn how to delete a virtual network gateway using PowerShell in the classic deployment model.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: vpn-gateway
ms.custom:
ms.topic: how-to
ms.date: 10/31/2023
ms.author: cherylmc
---
# Delete a virtual network gateway using PowerShell (classic)

This article helps you delete a VPN gateway in the classic (legacy) deployment model by using PowerShell. After the virtual network gateway is deleted, modify the network configuration file to remove elements that you're no longer using.

The steps in this article apply to the classic deployment model and don't apply to the current deployment model, Resource Manager. **Unless you want to work in the classic deployment model specifically, we recommend that you use the [Resource Manager version of this article](vpn-gateway-delete-vnet-gateway-powershell.md)**.

> [!IMPORTANT]
> [!INCLUDE [classic gateway restrictions](../../includes/vpn-gateway-classic-gateway-restrict-create.md)]

## <a name="connect"></a>Step 1: Connect to Azure

### 1. Install the latest PowerShell cmdlets.

[!INCLUDE [vpn-gateway-classic-powershell](../../includes/vpn-gateway-powershell-classic-locally.md)]

### 2. Connect to your Azure account.

Open your PowerShell console with elevated rights and connect to your account. Use the following example to help you connect:

1. Open your PowerShell console with elevated rights.
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

Open the file with a text editor and view the name for your classic VNet. When you create a VNet in the Azure portal, the full name that Azure uses isn't visible in the portal. For example, a VNet that appears to be named 'ClassicVNet1' in the Azure portal, might have a longer name in the network configuration file. The name might look something like: 'Group ClassicRG1 ClassicVNet1'. Virtual network names are listed as **'VirtualNetworkSite name ='**. Use the names in the network configuration file when running your PowerShell cmdlets.

## <a name="delete"></a>Step 3: Delete the virtual network gateway

When you delete a virtual network gateway, all connections to the VNet through the gateway are disconnected. If you have P2S clients connected to the VNet, they'll be disconnected without warning.

This example deletes the virtual network gateway. Make sure to use the full name of the virtual network from the network configuration file.

```powershell
Remove-AzureVNetGateway -VNetName "Group ClassicRG1 ClassicVNet1"
```

If successful, the return shows:

```
Status : Successful
```

## <a name="modify"></a>Step 4: Modify the network configuration file

When you delete a virtual network gateway, the cmdlet doesn't modify the network configuration file. You need to modify the file to remove the elements that are no longer being used. The following sections help you modify the network configuration file that you downloaded.

### <a name="lnsref"></a>Local Network Site References

To remove site reference information, make configuration changes to **ConnectionsToLocalNetwork/LocalNetworkSiteRef**. Removing a local site reference triggers Azure to delete a tunnel. Depending on the configuration that you created, you might not have a **LocalNetworkSiteRef** listed.

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

Remove any local sites that you're no longer using. Depending on the configuration you created, it's possible that you don't have a **LocalNetworkSite** listed.

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

If you had a P2S connection to your VNet, you'll have a **VPNClientAddressPool**. Remove the client address pools that correspond to the virtual network gateway that you deleted.

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
