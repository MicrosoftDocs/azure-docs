---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 07/06/2022
 ms.author: cherylmc


# This include is used for both Virtual WAN and VPN Gateway articles. Any changes you make must apply address both services.
---
When you generate a client certificate, it's automatically installed on the computer that you used to generate it. If you want to install the client certificate on another client computer, you need to first export the client certificate.

1. To export a client certificate, open **Manage user certificates**. The client certificates that you generated are, by default, located in 'Certificates - Current User\Personal\Certificates'. Right-click the client certificate that you want to export, click **all tasks**, and then click **Export** to open the **Certificate Export Wizard**.

   :::image type="content" source="./media/vpn-gateway-certificates-export-client-cert-include/export-certificate.png" alt-text="Screenshot shows the Certificates window with All Tasks and Export selected." lightbox="./media/vpn-gateway-certificates-export-client-cert-include/export-certificate.png":::

1. In the Certificate Export Wizard, click **Next** to continue.

1. Select **Yes, export the private key**, and then click **Next**.

   :::image type="content" source="./media/vpn-gateway-certificates-export-client-cert-include/yes-export.png" alt-text="Screenshot showing Yes export the private key selected." lightbox="./media/vpn-gateway-certificates-export-client-cert-include/yes-export.png":::

1. On the **Export File Format** page, leave the defaults selected. Make sure that **Include all certificates in the certification path if possible** is selected. This setting additionally exports the root certificate information that is required for successful client authentication. Without it, client authentication fails because the client doesn't have the trusted root certificate. Then, click **Next**.

   :::image type="content" source="./media/vpn-gateway-certificates-export-client-cert-include/personal-information-exchange.png" alt-text="Screenshot for export file format page." lightbox="./media/vpn-gateway-certificates-export-client-cert-include/personal-information-exchange.png":::

1. On the **Security** page, you must protect the private key. If you select to use a password, make sure to record or remember the password that you set for this certificate. Then, click **Next**.

   :::image type="content" source="./media/vpn-gateway-certificates-export-client-cert-include/password.png" alt-text="Screenshot shows password entered and confirmed." lightbox="./media/vpn-gateway-certificates-export-client-cert-include/password.png":::

1. On the **File to Export**, **Browse** to the location to which you want to export the certificate. For **File name**, name the certificate file. Then, click **Next**.

1. Click **Finish** to export the certificate.
