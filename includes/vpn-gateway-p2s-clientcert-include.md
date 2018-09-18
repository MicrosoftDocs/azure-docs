---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 09/06/2018
 ms.author: cherylmc

---
Each client computer that connects to a VNet using Point-to-Site must have a client certificate installed. The client certificate is generated from the root certificate and installed on each client computer. If a valid client certificate is not installed and the client tries to connect to the VNet, authentication fails.

You can either generate a unique certificate for each client, or you can use the same certificate for multiple clients. The advantage to generating unique client certificates is the ability to revoke a single certificate. Otherwise, if multiple clients are using the same client certificate and you need to revoke it, you have to generate and install new certificates for all the clients that use that certificate to authenticate.

You can generate client certificates using the following methods:

- **Enterprise certificate:**

  - If you are using an enterprise certificate solution, generate a client certificate with the common name value format 'name@yourdomain.com', rather than the 'domain name\username' format.
  - Make sure the client certificate is based on the 'User' certificate template that has 'Client Authentication' as the first item in the use list, rather than Smart Card Logon, etc. You can check the certificate by double-clicking the client certificate and viewing **Details > Enhanced Key Usage**.

- **Self-signed root certificate:** It's important that you follow the steps in one of the P2S certificate articles below. Otherwise, the client certificates you create won't be compatible with P2S connections and clients receive an error when trying to connect. The steps in either of the following articles generate a compatible client certificate: 

  * [Windows 10 PowerShell instructions](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site.md#clientcert): These instructions require Windows 10 and PowerShell to generate certificates. The certificates that are generated can be installed on any supported P2S client.
  * [MakeCert instructions](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site-makecert.md): Use MakeCert if you don't have access to a Windows 10 computer to use to generate certificates. MakeCert deprecated, but you can still use MakeCert to generate certificates. The certificates that are generated can be installed on any supported P2S client.
  * [Linux instructions](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site-linux.md)

  When you generate a client certificate from a self-signed root certificate using the preceding instructions, it's automatically installed on the computer that you used to generate it. If you want to install a client certificate on another client computer, you need to export it as a .pfx, along with the entire certificate chain. This creates a .pfx file that contains the root certificate information that is required for the client to successfully authenticate. For steps to export a certificate, see [Certificates - export a client certificate](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site.md#clientexport).