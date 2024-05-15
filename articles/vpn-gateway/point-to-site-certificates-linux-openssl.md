---
title: 'Generate and export certificates for point-to-site: Linux - OpenSSL'
description: Learn how to create a self-signed root certificate, export the public key, and generate client certificates using OpenSSL.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 03/25/2024
ms.author: cherylmc

---
# Generate and export certificates - Linux - OpenSSL

VPN Gateway point-to-site (P2S) connections can be configured to use certificate authentication. The root certificate public key is uploaded to Azure and each VPN client must have the appropriate certificate files installed locally in order to connect. This article helps you create a self-signed root certificate and generate client certificates using OpenSSL. For more information, see [Point-to-site configuration - certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md).

## Prerequisites

To use this article, you must have a computer running OpenSSL.

## Self-signed root certificate

This section helps you generate a self-signed root certificate. After you generate the certificate, you export root certificate public key data file.

1. The following example helps you generate the self-signed root certificate.

   ```CLI
   openssl genrsa -out caKey.pem 2048
   openssl req -x509 -new -nodes -key caKey.pem -subj "/CN=VPN CA" -days 3650 -out caCert.pem
   ```

1. Print the self-signed root certificate public data in base64 format. This is the format that's supported by Azure. Upload this certificate to Azure as part of your [P2S configuration](vpn-gateway-howto-point-to-site-resource-manager-portal.md#uploadfile) steps.

   ```CLI
   openssl x509 -in caCert.pem -outform der | base64 -w0 && echo
   ```

## Client certificates

In this section, you generate the user certificate (client certificate). Certificate files are generated in the local directory in which you run the commands. You can use the same client certificate on each client computer, or generate certificates that are specific to each client. It's crucial is that the client certificate is signed by the root certificate.

1. To generate a client certificate, use the following examples.

   ```CLI
   export PASSWORD="password"
   export USERNAME=$(hostnamectl --static)
 
   # Generate a private key
   openssl genrsa -out "${USERNAME}Key.pem" 2048
 
   # Generate a CSR (Certificate Sign Request)
   openssl req -new -key "${USERNAME}Key.pem" -out "${USERNAME}Req.pem" -subj "/CN=${USERNAME}"
 
   # Sign the CSR using the CA certificate and CA key
   openssl x509 -req -days 365 -in "${USERNAME}Req.pem" -CA caCert.pem -CAkey caKey.pem -CAcreateserial -out "${USERNAME}Cert.pem" -extfile <(echo -e "subjectAltName=DNS:${USERNAME}\nextendedKeyUsage=clientAuth")
   ```

1. To verify the client certificate, use the following example.

   ```CLI
   openssl verify -CAfile caCert.pem caCert.pem "${USERNAME}Cert.pem"
   ```

## Next steps

To continue configuration steps, see [Point-to-site certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md#uploadfile).
