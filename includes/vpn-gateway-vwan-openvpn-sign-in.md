---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 02/14/2020
 ms.author: cherylmc
 ms.custom: include file

 # this file is used for both virtual wan and vpn gateway. When modifying, make sure that your changes work for both environments.
---

On the **Azure VPN - Properties** page, configure sign-in settings.

1. Set **Enabled for users to sign-in?** to **Yes**. This setting allows all users in the AD tenant to connect to the VPN successfully.
2. Set **User assignment required?** to **Yes** if you want to limit sign-in to only users that have permissions to the Azure VPN.
3. Save your changes.

   ![Permissions](./media/vpn-gateway-vwan-openvpn-sign-in/user2.jpg)