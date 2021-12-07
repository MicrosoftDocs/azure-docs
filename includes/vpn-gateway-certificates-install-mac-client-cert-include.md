---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 07/12/2021
 ms.author: cherylmc
 ms.custom: include file
---
1. Locate the .pfx certificate file and copy it to your Mac. You can get the certificate to the Mac in several ways. For example, you can email the certificate file.
1. Double-click the certificate. You will either be asked to input the password and the certificate will automatically install, or the **Add Certificates** box will appear. On the **Add Certificates** box, click **Add** to begin the install.
1. Select **login** from the dropdown.

   :::image type="content" source="./media/vpn-gateway-certificates-install-mac-client-cert-include/add-cert.png" alt-text="Screenshot showing Add Certificates box.":::
1. Enter the password that you created when the client certificate was exported. The password protects the private key of the certificate. Click **OK**.

   :::image type="content" source="./media/vpn-gateway-certificates-install-mac-client-cert-include/password.png" alt-text="creenshot shows a dialog box that prompts you for a password.":::
1. Click **Add** to add the certificate.
1. To view the added certificate, open the **Keychain Access** application and navigate to the **Certificates** tab.
