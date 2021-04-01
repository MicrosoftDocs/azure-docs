---
title: Generate self-signed certificate for mutual authentication
titleSuffix: Azure Application Gateway
description: Learn how to generate an Azure Application Gateway self-signed certificate with a custom root CA for mutual authentication.
services: application-gateway
author: mscatyao
ms.service: application-gateway
ms.topic: how-to
ms.date: 03/31/2021
ms.author: caya
---

# Generate a self-signed certificate for mutual authentication 
You can generate a self-signed CA certificate to upload onto your Application Gateway to use to verify client certificates. The self-signed CA certificate will be treated as a trusted root CA certificate by Application Gateway and will be used to verify client certificates presented to the gateway. 

> [!NOTE]
> Self-signed certificates are not trusted by default and they can be difficult to maintain. Also, they may use outdated hash and cipher suites that may not be strong. For better security, purchase a certificate signed by a well-known certificate authority.

In this article, you will learn how to:
- Create a key
- Create a certificate
- Verify the certificate
- Deploy the certificate 

## Prerequisites
- **[OpenSSL](https://www.openssl.org/) on a computer running Windows or Linux** 

   While there could be other tools available for certificate management, this tutorial uses OpenSSL. You can find OpenSSL bundled with many Linux distributions, such as Ubuntu.

- **An Application Gateway v2 SKU**
   
  If you don't have an existing Application Gateway, see [Quickstart: Direct web traffic with Azure Application Gateway - Azure portal](quick-create-portal.md).

## Create a key 
Create a private key in OpenSSL.

```
cd /root/ca
openssl genrsa -aes256 \
    -out intermediate/private/www.contoso.com.key.pem 2048
chmod 400 intermediate/private/www.contoso.com.key.pem
```

## Create a certificate
Use the private key you created in the last step to create a certificate signing request (CSR). The Common Name can't be the same as either your root or intermediate certificate. 

```
cd /root/ca
openssl req -config intermediate/openssl.cnf \
    -key intermediate/private/www.contoso.com.key.pem \
    -new -sha256 -out intermediate/csr/www.contoso.com.csr.pem
```

Use the intermediate CA to sign teh CSR. Use the `usr_cert` extension for user authentication.

```
cd /root/ca
openssl ca -config intermediate/openssl.cnf \
    -extensions server_cert -days 375 -notext -md sha256 \
    -in intermediate/csr/www.contoso.com.csr.pem \
    -out intermediate/certs/www.contoso.com.cert.pem
chmod 444 intermediate/certs/www.contoso.com.cert.pem
``` 

## Verify the certificate 
Verify the certificate you generated. 

```
openssl x509 -noout -text \
    -in intermediate/certs/www.contoso.com.cert.pem
```

The **Issuer** is the intermediate CA, and the **Subject** refers to the certificate itself. 

Use the CA certificate chain you created earlier to verify that the new certificate has a valid chain of trust. 

```
openssl verify -CAfile intermediate/certs/ca-chain.cert.pem \
    intermediate/certs/www.contoso.com.cert.pem

www.contoso.com.cert.pem: OK
```

## Deploy the certificate
Deploy your new certificate to a client. 

## Next steps
For more about mutual authentication on Application Gateway, see [Overview of mutual authentication](./mutual-authentication-overview.md).