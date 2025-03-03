---
 ms.topic: include
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.date: 01/28/2025
 ms.author: cherylmc


 # this file is used for both virtual wan and vpn gateway. When modifying, make sure that your changes work for both environments.
---


1. Open the Azure VPN Client.

1. Select **+** on the bottom left of the page, then select **Import**.

1. In the window, navigate to the **azurevpnconfig.xml** or **azurevpnconfig_cert.xml** file, depending on your configuration. Select the file, then select **Open**.

1. On the client profile page, notice that many of the settings are already specified. The preconfigured settings are contained in the VPN client profile package that you imported. Even though most of the settings are already specified, you need to configure settings specific to the client computer.

   From the **Certificate Information** dropdown, select the name of the child certificate (the client certificate). For example, **P2SChildCert**. For this exercise, for secondary profile, select **None**.

   :::image type="content" source="./media/vpn-gateway-vwan-configure-azure-vpn-client-certificate/configure-certificate.png" alt-text="Screenshot showing Azure VPN client profile configuration page." lightbox="./media/vpn-gateway-vwan-configure-azure-vpn-client-certificate/configure-certificate.png":::

   If you don't see a client certificate in the **Certificate Information** dropdown, you'll need to cancel the profile configuration import and fix the issue before proceeding. It's possible that one of the following things is true:

   * The client certificate isn't installed locally on the client computer.
   * There are multiple certificates with exactly the same name installed on your local computer (common in test environments).
   * The child certificate is corrupt.

1. After the import validates (imports with no errors), select **Save**.

1. In the left pane, locate the **VPN connection**, then select **Connect**.