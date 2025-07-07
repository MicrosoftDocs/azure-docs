---
author: cherylmc
ms.author: cherylmc
ms.date: 03/20/2025
ms.service: azure-virtual-wan
ms.topic: include
This is for both VPN Gateway and Virtual WAN
---

## Prerequisites

To use this article, you must have a computer running OpenSSL.

## Self-signed root certificate

This section helps you generate a self-signed root certificate. After you generate the certificate, you export root certificate public key data file.

1. The following example helps you generate the self-signed root certificate.

   ```CLI
   openssl genrsa -out caKey.pem 2048
   openssl req -x509 -new -nodes -key caKey.pem -subj "/CN=VPN CA" -days 3650 -out caCert.pem
   ```

1. Print the self-signed root certificate public data in base64 format. This is the format that's supported by Azure.

   ```CLI
   openssl x509 -in caCert.pem -outform der | base64 -w0 && echo
   ```

## Client certificates

> [!NOTE]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that aren't present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

In this section, you generate the user certificate (client certificate). Certificate files are generated in the local directory in which you run the commands. You can use the same client certificate on each client computer, or generate certificates that are specific to each client. It's crucial that the client certificate is signed by the root certificate.

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