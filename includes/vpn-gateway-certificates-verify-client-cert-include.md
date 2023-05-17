---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 11/21/2022
 ms.author: cherylmc
---
If you have trouble connecting, check the following items:

* If you exported a client certificate with **Certificate Export Wizard**, make sure that you exported it as a .pfx file and selected **Include all certificates in the certification path if possible**. When you export it with this value, the root certificate information is also exported. After you install the certificate on the client computer, the root certificate in the .pfx file is also installed. To verify that the root certificate is installed, open **Manage user certificates** and select **Trusted Root Certification Authorities\Certificates**. Verify that the root certificate is listed, which must be present for authentication to work.

* If you used a certificate that was issued by an Enterprise CA solution and you can't authenticate, verify the authentication order on the client certificate. Check the authentication list order by double-clicking the client certificate, selecting the **Details** tab, and then selecting **Enhanced Key Usage**. Make sure *Client Authentication* is the first item in the list. If it isn't, issue a client certificate based on the user template that has *Client Authentication* as the first item in the list.

* For additional P2S troubleshooting information, see [Troubleshoot P2S connections](../articles/vpn-gateway/vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).