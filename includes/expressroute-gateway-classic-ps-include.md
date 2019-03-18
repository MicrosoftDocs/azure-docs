---
 title: include file
 description: include file
 services: expressroute
 author: cherylmc
 ms.service: expressroute
 ms.topic: include
 ms.date: 12/13/2018
 ms.author: cherylmc
 ms.custom: include file
---

> [!NOTE]
> These examples do not apply to S2S/ExpressRoute coexist configurations.
> For more information about working with gateways in a coexist configuration, see [Configure coexisting connections.](../articles/expressroute/expressroute-howto-coexist-classic.md#gw)

## Add a gateway

When you add a gateway to a virtual network using the classic resource model, you modify the network configuration file directly before creating the gateway. The values in the examples below must be present in the file to create a gateway. If your virtual network previously had a gateway associated to it, some of these values will already be present. Modify the file to reflect the values below.

### Download the network configuration file

1. Download the network configuration file using the steps in [network configuration file](../articles/virtual-network/virtual-networks-using-network-configuration-file.md) article. Open the file using a text editor.
2. Add a local network site to the file. You can use any valid address prefix. You can add any valid IP address for the VPN gateway. The address values in this section are not used for ExpressRoute operations, but are required for file validation. In the example, "branch1" is the name of the site. You may use a different name, but be sure to use the same value in the Gateway section of the file.

   ```
   <VirtualNetworkConfiguration>
    <Dns />
    <LocalNetworkSites>
      <LocalNetworkSite name="branch1">
        <AddressSpace>
          <AddressPrefix>165.3.1.0/27</AddressPrefix>
        </AddressSpace>
        <VPNGatewayAddress>3.2.1.4</VPNGatewayAddress>
    </LocalNetworkSite>
   ```
3. Navigate to the VirtualNetworkSites and modify the fields.

   * Verify that the Gateway Subnet exists for your virtual network. If it does not, you can add one at this time. The name must be "GatewaySubnet".
   * Verify the  Gateway section of the file exists. If it doesn't, add it. This is required to associate the virtual network with the local network site (which represents the network to which you are connecting).
   * Verify that the connection type = Dedicated. This is required for ExpressRoute connections.

   ```
   </LocalNetworkSites>
    <VirtualNetworkSites>
      <VirtualNetworkSite name="myAzureVNET" Location="East US">
        <AddressSpace>
          <AddressPrefix>10.0.0.0/16</AddressPrefix>
        </AddressSpace>
        <Subnets>
          <Subnet name="default">
            <AddressPrefix>10.0.0.0/24</AddressPrefix>
          </Subnet>
          <Subnet name="GatewaySubnet">
            <AddressPrefix>10.0.1.0/27</AddressPrefix>
          </Subnet>
        </Subnets>
        <Gateway>
          <ConnectionsToLocalNetwork>
            <LocalNetworkSiteRef name="branch1">
              <Connection type="Dedicated" />
            </LocalNetworkSiteRef>
          </ConnectionsToLocalNetwork>
        </Gateway>
      </VirtualNetworkSite>
    </VirtualNetworkSites>
   </VirtualNetworkConfiguration>
   </NetworkConfiguration>
   ```
4. Save the file and upload it to Azure.

### Create the gateway

Use the command below to create a gateway. Substitute any values for your own.

```powershell
New-AzureVNetGateway -VNetName "MyAzureVNET" -GatewayType DynamicRouting -GatewaySKU  Standard
```

## Verify the gateway was created

Use the command below to verify that the gateway has been created. This command also retrieves the gateway ID, which you need for other operations.

```powershell
Get-AzureVNetGateway
```

## Resize a gateway

There are a number of [Gateway SKUs](../articles/expressroute/expressroute-about-virtual-network-gateways.md). You can use the following command to change the Gateway SKU at any time.

> [!IMPORTANT]
> This command doesn't work for UltraPerformance gateway. To change your gateway to an UltraPerformance gateway, first remove the existing ExpressRoute gateway, and then create a new UltraPerformance gateway. To downgrade your gateway from an UltraPerformance gateway, first remove the UltraPerformance gateway, and then create a new gateway.
>
>

```powershell
Resize-AzureVNetGateway -GatewayId <Gateway ID> -GatewaySKU HighPerformance
```

## Remove a gateway

Use the command below to remove a gateway

```powershell
Remove-AzureVnetGateway -GatewayId <Gateway ID>
```