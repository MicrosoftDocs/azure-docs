---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 09/06/2018
 ms.author: cherylmc
 ms.custom: include file
---
You can use either a root certificate that was generated using an enterprise solution (recommended), or you can generate a self-signed certificate. After creating the root certificate, export the public certificate data (not the private key) as a Base-64 encoded X.509 .cer file and upload the public certificate data to Azure.

* **Enterprise certificate:** If you are using an enterprise solution, you can use your existing certificate chain. Obtain the .cer file for the root certificate that you want to use.
* **Self-signed root certificate:** If you aren't using an enterprise certificate solution, you need to create a self-signed root certificate. It's important that you follow the steps in one of the P2S certificate articles below. Otherwise, the certificates you create won't be compatible with P2S connections and clients receive a connection error when trying to connect. You can use Azure PowerShell, MakeCert, or OpenSSL. The steps in the provided articles generate a compatible certificate:

  * [Windows 10 PowerShell instructions](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site.md): These instructions require Windows 10 and PowerShell to generate certificates. Client certificates that are generated from the root certificate can be installed on any supported P2S client.
  * [MakeCert instructions](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site-makecert.md): Use MakeCert if you don't have access to a Windows 10 computer to use to generate certificates. MakeCert deprecated, but you can still use MakeCert to generate certificates. Client certificates that are generated from the root certificate can be installed on any supported P2S client.
  * [Linux instructions](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site-linux.md)
