---
title: 'Generate and export certificates for Point-to-Site: Linux: CLI: Azure | Microsoft Docs'
description: Create a self-signed root certificate, export the public key, and generate client certificates using the Linux (strongSwan) CLI.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: article
ms.date: 09/06/2018
ms.author: cherylmc

---
# Generate and export certificates for Point-to-Site using Linux strongSwan CLI

Point-to-Site connections use certificates to authenticate. This article shows you how to create a self-signed root certificate and generate client certificates using the Linux CLI and strongSwan. If you are looking for different certificate instructions, see the [Powershell](vpn-gateway-certificates-point-to-site.md) or [MakeCert](vpn-gateway-certificates-point-to-site-makecert.md) articles.

> [!NOTE]
> The steps in this article require strongSwan.
>

The computer configuration used for the steps for this article was the following:

| | |
|---|---|
|**Computer**| Ubuntu Server 16.04<br>ID_LIKE=debian<br>PRETTY_NAME="Ubuntu 16.04.4 LTS"<br>VERSION_ID="16.04" |
|**Dependencies**| apt-get install strongswan-ikev2 strongswan-plugin-eap-tls<br>apt-get install libstrongswan-standard-plugins |

## Install strongSwan

1. `apt-get install strongswan-ikev2 strongswan-plugin-eap-tls`
2. `apt-get install libstrongswan-standard-plugins`

For information about how to install strongSwan using the GUI, see the steps in the [Client configuration](point-to-site-vpn-client-configuration-azure-cert.md#install) article.

## Generate keys and certificate

1. Generate the CA certificate.

  ```
  ipsec pki --gen --outform pem > caKey.pem
  ipsec pki --self --in caKey.pem --dn "CN=VPN CA" --ca --outform pem > caCert.pem
  ```
2. Print the CA certificate in base64 format. This is the format that is supported by Azure. You will later upload this to Azure as part of your P2S configuration.

  ```
  openssl x509 -in caCert.pem -outform der | base64 -w0 ; echo
  ```
3. Generate the user certificate.

  ```
  export PASSWORD="password"
  export USERNAME="client"

  ipsec pki --gen --outform pem > "${USERNAME}Key.pem"
  ipsec pki --pub --in "${USERNAME}Key.pem" | ipsec pki --issue --cacert caCert.pem --cakey caKey.pem --dn "CN=${USERNAME}" --san "${USERNAME}" --flag clientAuth --outform pem > "${USERNAME}Cert.pem"
  ```
4. Generate a p12 bundle containing the user certificate. This bundle will be used in the next steps when working with the [Client configuration files](point-to-site-vpn-client-configuration-azure-cert.md#linuxinstallcli).

  ```
  openssl pkcs12 -in "${USERNAME}Cert.pem" -inkey "${USERNAME}Key.pem" -certfile caCert.pem -export -out "${USERNAME}.p12" -password "pass:${PASSWORD}"
  ```

## Next steps

Continue with your Point-to-Site configuration to [Create and install VPN client configuration files](point-to-site-vpn-client-configuration-azure-cert.md#linuxinstallcli).