---
author: cherylmc
ms.author: cherylmc
ms.date: 07/30/2021
ms.service: virtual-wan
ms.topic: include
---
1. Navigate to the virtual WAN that you created. 

1. Select **User VPN configurations** from the menu on the left.

1. On the **User VPN configurations** page, select **+Create user VPN config**.

   :::image type="content" source="media/virtual-wan-p2s-configuration/user-vpn.png" alt-text="Screenshot of user VPN configurations page.":::

1. On the **Create new User VPN configuration** page **Basics** tab, under **Instance details**, enter the **Name** you want to assign to your VPN configuration.

   :::image type="content" source="media/virtual-wan-p2s-configuration/custom.png" alt-text="Screenshot of IPsec switch to custom.":::

1. For **Tunnel type**, select the tunnel type that you want from the dropdown. The tunnel type options are: **IKEv2 VPN, OpenVPN,** and **OpenVpn and IKEv2**. Each tunnel type has specific required settings. The tunnel type you choose corresponds to the authentication choices available.

   **Requirements and parameters**:

     **IKEv2 VPN**

     * **Requirements:** When you select the **IKEv2** tunnel type, you see a message directing you to select an authentication method. For IKEv2, you may specify multiple authentication methods. You can choose Azure Certificate, RADIUS-based authentication or both.

     * **IPSec custom parameters:** To customize the parameters for IKE Phase 1 and IKE Phase 2, toggle the IPsec switch to **Custom** and select the parameter values. For more information about customizable parameters, see the [Custom IPsec](../articles/virtual-wan/point-to-site-ipsec.md) article.

     **OpenVPN**

     * **Requirements:** When you select the **OpenVPN** tunnel type, you see a message directing you to select an authentication mechanism. If OpenVPN is selected as the tunnel type, you may specify multiple authentication methods. You can choose any subset of Azure Certificate, Azure Active Directory, or RADIUS-based authentication. For RADIUS-based authentication, you can provide a secondary RADIUS server IP address and server secret.

     **OpenVPN and IKEv2**

     * **Requirements:** When you select the **OpenVPN and IKEv2** tunnel type, you see a message directing you to select an authentication mechanism. If OpenVPN and IKEv2 is selected as the tunnel type, you may specify multiple authentication methods. You can choose Azure Active Directory along with either Azure Certificate or RADIUS-based authentication. For RADIUS-based authentication, you can provide a secondary RADIUS server IP address and server secret.

1. Configure the **Authentication** methods you want to use. Each authentication method is in a separate tab: **Azure certificate**, **RADIUS authentication**, and **Azure Active Directory**. Some authentication methods are only available on certain tunnel types.

   On the tab for the authentication method you want to configure, select **Yes** to reveal the available configuration settings.

   * **Example - Certificate authentication**

      To configure this setting, the tunnel type the Basics page can be IKEv2, OpenVPN, or OpenVPN and IKEv2.

      :::image type="content" source="media/virtual-wan-p2s-configuration/certificate-authentication.png" alt-text="Screenshot of Yes selected.":::

   * **Example - RADIUS authentication**

      To configure this setting, the tunnel type on the Basics page can be Ikev2, OpenVPN, or OpenVPN and IKEv2.

      :::image type="content" source="media/virtual-wan-p2s-configuration/radius-authentication.png" alt-text="Screenshot of RADIUS authentication page.":::

   * **Example - Azure Active Directory authentication**

      To configure this setting, the tunnel type on the Basics page must be OpenVPN. Azure Active Directory-based authentication is only supported with OpenVPN.

      :::image type="content" source="media/virtual-wan-p2s-configuration/configure.png" alt-text="Azure Active Directory authentication page.":::

1. When you have finished configuring the settings, select **Review + create** at the bottom of the page.

1. Select **Create** to create the User VPN configuration.
