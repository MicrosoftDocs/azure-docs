---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 10/18/2019
 ms.author: cherylmc
 ms.custom: include file
---
Steps for creating a connection from Azure virtual network gateway VPN to virtual WAN is very similar to how you setup connectivity to virtual WAN from branch VPN sites. In order to setup this connectivity, you need to take care of two things (1) create 2 VPN sites for your virtual WAN which represent active-active instances of azure virtual network gateway VPN (2) create two local network gateways and connect these to Azure virtual network gateway VPN. The local network gateways need to have same settings as VPN gateway instances of virtual WAN. You can find these settings when you Download Site-to-Site VPN configuration from the VPN sites blade under your virtual WAN.

If the connectivity is to be setup over BGP, you’ll need to choose Enable BGP option and provide BGP ASN and BGP peer IP addresses during the setup. Note that BGP ASN for local network gateways is 65515 (same settings as VPN gateway instances of virtual WAN). For azure virtual network gateway VPN, the BGP ASN is a value other than 65515 (same settings as VPN sites of the virtual WAN).

### Virtual network gateway VPN settings

![connect](./media/virtual-wan-tutorial-connect-vpn-site-include/connect.png "connect")

### Virtual WAN sites settings

![connect](./media/virtual-wan-tutorial-connect-vpn-site-include/connect.png "connect")


![connect](./media/virtual-wan-tutorial-connect-vpn-site-include/connect.png "connect")

### Local network gateway settings

![connect](./media/virtual-wan-tutorial-connect-vpn-site-include/connect.png "connect")

