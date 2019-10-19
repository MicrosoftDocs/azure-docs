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
1. Select **Connect VPN Sites** to open the **Connect sites** page.

    ![connect](./media/virtual-wan-tutorial-connect-vpn-site-include/connect.png "connect")

   Complete the following fields:

   * Enter a Pre-shared key. Azure auto generates it for you otherwise. 
   * Select the Protocol and IPsec settings. Refer to default/custom IPSec details (put the link to the page)
   * Select the appropriate option for Propagate Default Route. An Enable option allows Virtual Hub to propagate a learnt default route to this connection. This flag enables default route propagation to a connection only if the default route is already learned by the Virtual WAN hub as a result of deploying a firewall in the hub or if another connected site has forced tunneling enabled. The default route does not originate in the Virtual WAN hub

2. Select **Connect**. 
