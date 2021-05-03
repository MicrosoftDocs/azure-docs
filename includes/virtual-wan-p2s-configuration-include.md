---
author: cherylmc
ms.author: cherylmc
ms.date: 03/03/2021
ms.service: virtual-wan
ms.topic: include
ms.date: 02/23/2021
---

[!INCLUDE [Portal feature rollout](virtual-wan-portal-feature-rollout.md)]

1. Navigate to **All resources** and select the virtual WAN that you created, then select **User VPN configurations** from the menu on the left.
1. On the **User VPN configurations** page, select **+Create user VPN config** at the top of the page to open the **Create new user VPN configuration** page.

   :::image type="content" source="media/virtual-wan-p2s-configuration/user-vpn.png" alt-text="Screenshot of user VPN configurations page.":::

1. On the **Basics** tab, under **Instance details**, enter the **Name** you want to assign to your VPN configuration.
1. For **Tunnel type**, from the dropdown, select the tunnel type that you want. The tunnel type options are: **IKEv2 VPN**, **OpenVPN**, and **OpenVpn and IkeV2**.
1. Use the following steps that correspond to the tunnel type that you selected. After all the values are specified, click **Review + create**, then **Create** to create the configuration.

   **IKEv2 VPN**

   * **Requirements:** When you select the **IKEv2** tunnel type, you see a message directing you to select an authentication method. For IKEv2, you may specify only one authentication method. You can choose Azure Certificate, Azure Active Directory, or RADIUS-based authentication.

   * **IPSec custom parameters:** To customize the parameters for IKE Phase 1 and IKE Phase 2, toggle the IPsec switch to **Custom** and select the parameter values. For more information about customizable parameters, see the [Custom IPsec](../articles/virtual-wan/point-to-site-ipsec.md) article.

     :::image type="content" source="media/virtual-wan-p2s-configuration/custom.png" alt-text="Screenshot of IPsec switch to custom.":::

   * **Authentication:** Navigate to the authentication mechanism that you want to use by either clicking **Next** at the bottom of the page to advance to the authentication method, or click the appropriate tab at the top of the page. Toggle the switch to **Yes** to select the method.

     In this example, RADIUS authentication is selected. For RADIUS-based authentication, you can provide a secondary RADIUS server IP address and server secret.

     :::image type="content" source="media/virtual-wan-p2s-configuration/ike-radius.png" alt-text="Screenshot of IKE.":::

   **OpenVPN**

   * **Requirements:** When you select the **OpenVPN** tunnel type, you see a message directing you to select an authentication mechanism. If OpenVPN is selected as the tunnel type, you may specify multiple authentication methods. You can choose any subset of Azure Certificate, Azure Active Directory, or RADIUS-based authentication. For RADIUS-based authentication, you can provide a secondary RADIUS server IP address and server secret.

   * **Authentication:** Navigate to the authentication method(s) that you want to use by either clicking **Next** at the bottom of the page to advance to the authentication method, or click the appropriate tab at the top of the page.
   For each method that you want to select, toggle the switch to **Yes** and enter the appropriate values.

     In this example, Azure Active Directory is selected.

     :::image type="content" source="media/virtual-wan-p2s-configuration/openvpn.png" alt-text="Screenshot of OpenVPN page.":::
