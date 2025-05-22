---
author: cherylmc
ms.author: cherylmc
ms.date: 02/13/2025
ms.service: azure-virtual-wan
ms.topic: include
---

## <a name="rootcert"></a>Create a self-signed root certificate

The following steps show you how to create a self-signed certificate using MakeCert. These steps aren't deployment-model specific.

1. Download and install [MakeCert](/windows/win32/seccrypto/makecert).
1. After installation, you can typically find the makecert.exe utility under this path: 'C:\Program Files (x86)\Windows Kits\10\bin\<arch>'. However, it's possible that it was installed to another location. Open a command prompt as administrator and navigate to the location of the MakeCert utility. You can use the following example, adjusting for the proper location:

   ```cmd
   cd C:\Program Files (x86)\Windows Kits\10\bin\x64
   ```

1. Create and install a certificate in the Personal certificate store on your computer. The following example creates a corresponding *.cer* file that you upload to Azure when configuring P2S. Replace 'P2SRootCert' and 'P2SRootCert.cer' with the name that you want to use for the certificate. The certificate is located in your 'Certificates - Current User\Personal\Certificates'.

   ```cmd
   makecert -sky exchange -r -n "CN=P2SRootCert" -pe -a sha256 -len 2048 -ss My
   ```

## <a name="cer"></a>Export the public key (.cer)

[!INCLUDE [Export public key](vpn-gateway-certificates-export-public-key-include.md)]

The exported.cer file is uploaded to Azure when you configure your P2S gateway.

### Export the self-signed certificate and private key to store it (optional)

You might want to export the self-signed root certificate and store it safely. You can later install it on another computer and generate more client certificates, or export another .cer file. To export the self-signed root certificate as a .pfx, select the root certificate and use the same steps as described in [Export a client certificate](#clientexport).

## Create and install client certificates

You don't install the self-signed certificate directly on the client computer. You need to generate a client certificate from the self-signed certificate. You then export and install the client certificate to the client computer. The following steps aren't deployment-model specific.

### <a name="clientcert"></a>Generate a client certificate

Each client computer that connects to a virtual network using Point-to-Site must have a client certificate installed. You generate a client certificate from the self-signed root certificate, and then export and install the client certificate. If the client certificate isn't installed, authentication fails.

The following steps walk you through generating a client certificate from a self-signed root certificate. You can generate multiple client certificates from the same root certificate. When you generate client certificates using the following steps, the client certificate is automatically installed on the computer that you used to generate the certificate. If you want to install a client certificate on another client computer, you can export the certificate.

1. On the same computer that you used to create the self-signed certificate, open a command prompt as administrator.
1. Modify and run the sample to generate a client certificate.
   * Change *"P2SRootCert"* to the name of the self-signed root that you're generating the client certificate from. Make sure you're using the name of the root certificate, which is whatever the 'CN=' value was that you specified when you created the self-signed root.
   * Change *P2SChildCert* to the name you want to generate a client certificate to be.

   If you run the following example without modifying it, the result is a client certificate named P2SChildcert in your Personal certificate store that was generated from root certificate P2SRootCert.

   ```cmd
   makecert.exe -n "CN=P2SChildCert" -pe -sky exchange -m 96 -ss My -in "P2SRootCert" -is my -a sha256
   ```
