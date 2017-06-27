> [!NOTE]
> The VPN Gateway Public IP address will change when migrating from an old SKU to a new SKU.
> 

You can't resize your Azure VPN gateways directly between the old SKUs and the new SKU families. If you have VPN gateways in the Resource Manager deployment model that are using the older version of the SKUs, you can migrate to the new SKUs. To migrate, you delete the existing VPN gateway for your virtual network, then create a new one.

Migration workflow:

1. Remove any connections to the virtual network gateway.
2. Delete the old VPN gateway.
3. Create the new VPN gateway.
4. Update your on-premises VPN devices with the new VPN gateway IP address (for Site-to-Site connections).
5. Update the gateway IP address value for any VNet-to-VNet local network gateways that will connect to this gateway.
6. Download new client VPN configuration packages for P2S clients connecting to the virtual network through this VPN gateway.
7. Recreate the connections to the virtual network gateway.