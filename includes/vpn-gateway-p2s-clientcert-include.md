---
 ms.topic: include
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.date: 05/13/2024
 ms.author: cherylmc

---
Each client computer that you connect to a VNet with a point-to-site connection must have a client certificate installed. You generate it from the root certificate and install it on each client computer. If you don't install a valid client certificate, authentication will fail when the client tries to connect to the VNet.

You can either generate a unique certificate for each client, or you can use the same certificate for multiple clients. The advantage to generating unique client certificates is the ability to revoke a single certificate. Otherwise, if multiple clients use the same client certificate to authenticate and you revoke it, you'll need to generate and install new certificates for every client that uses that certificate.

You can generate client certificates by using the following methods:

* **Enterprise certificate:**

  * If you're using an enterprise certificate solution, generate a client certificate with the common name value format *name\@yourdomain.com*. Use this format instead of the *domain name\username* format.

  * Make sure the client certificate is based on a user certificate template that has *Client Authentication* listed as the first item in the user list. Check the certificate by double-clicking it and viewing **Enhanced Key Usage** in the **Details** tab.

* **Self-signed root certificate:** Follow the steps in one of the following P2S certificate articles so that the client certificates you create will be compatible with your P2S connections.

  When you generate a client certificate from a self-signed root certificate, it's automatically installed on the computer that you used to generate it. If you want to install a client certificate on another client computer, export it as a .pfx file, along with the entire certificate chain. Doing so will create a .pfx file that contains the root certificate information required for the client to authenticate.

  The steps in these articles generate a compatible client certificate, which you can then export and distribute.

  * [Windows 10 or later PowerShell instructions](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site.md#clientcert): These instructions require Windows 10 or later, and PowerShell to generate certificates. The generated certificates can be installed on any supported P2S client.

  * [MakeCert instructions](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site-makecert.md): Use MakeCert if you don't have access to a Windows 10 or later computer for generating certificates. Although MakeCert is deprecated, you can still use it to generate certificates. You can install the generated certificates on any supported P2S client.

  * Linux: See [strongSwan](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site-linux.md) or [OpenSSL](../articles/vpn-gateway/point-to-site-certificates-linux-openssl.md) instructions.