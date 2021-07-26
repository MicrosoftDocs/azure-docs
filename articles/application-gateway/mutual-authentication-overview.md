---
title: Overview of mutual authentication on Azure Application Gateway
description: This article is an overview of mutual authentication on Application Gateway.
services: application-gateway
author: mscatyao
ms.service: application-gateway
ms.date: 03/30/2021
ms.topic: conceptual 
ms.author: caya

---
# Overview of mutual authentication with Application Gateway (Preview)

Mutual authentication, or client authentication, allows for the Application Gateway to authenticate the client sending requests. Usually only the client is authenticating the Application Gateway; mutual authentication allows for both the client and the Application Gateway to authenticate each other. 

> [!NOTE]
> We recommend using TLS 1.2 with mutual authentication as TLS 1.2 will be mandated in the future. 

## Mutual authentication

Application Gateway supports certificate based mutual authentication where you can upload a trusted client CA certificate(s) to the Application Gateway and the gateway will use that certificate to authenticate the client sending a request to the gateway. With the rise in IoT use cases and increased security requirements across industries, mutual authentication provides a way for you to manage and control which clients can talk to your Application Gateway. 

To configure mutual authentication, a trusted client CA certificate is required to be uploaded as part of the client authentication portion of an SSL profile. The SSL profile will then need to be associated to a listener in order to complete configuration of mutual authentication. There must always be a root CA certificate in the client certificate that you upload. You can upload a certificate chain as well, but the chain must include a root CA certificate in addition to as many intermediate CA certificates as you'd like. 

For example, if your client certificate contains a root CA certificate, multiple intermediate CA certificates, and a leaf certificate, make sure that the root CA certificate and all the intermediate CA certificates are uploaded onto Application Gateway in one file. For more information on how to extract a trusted client CA certificate, see [how to extract trusted client CA certificates](./mutual-authentication-certificate-management.md).

If you're uploading a certificate chain with root CA and intermediate CA certificates, the certificate chain must be uploaded as a PEM or CER file to the gateway. 

> [!NOTE] 
> Mutual authentication is only available on Standard_v2 and WAF_v2 SKUs. 

### Certificates supported for mutual authentication

Application Gateway supports the following types of certificates:

- CA (Certificate Authority) certificate: A CA certificate is a digital certificate issued by a certificate authority (CA)
- Self-signed CA certificates: Client browsers do not trust these certificates and will warn the user that the virtual service’s certificate is not part of a trust chain. Self-signed CA certificates are good for testing or environments where administrators control the clients and can safely bypass the browser’s security alerts. Production workloads should never use self-signed CA certificates.

For more information on how to set up mutual authentication, see [configure mutual authentication with Application Gateway](./mutual-authentication-portal.md).

> [!IMPORTANT]
> Make sure you upload the entire trusted client CA certificate chain to the Application Gateway when using mutual authentication. 

## Additional client authentication validation

### Verify client certificate DN

You have the option to verify the client certificate's immediate issuer and only allow the Application Gateway to trust that issuer. This options is off by default but you can enable this through Portal, PowerShell, or Azure CLI. 

If you choose to enable the Application Gateway to verify the client certificate's immediate issuer, here's how to determine what the client certificate issuer DN will be extracted from the certificates uploaded. 
* **Scenario 1:** Certificate chain includes: root certificate - intermediate certificate - leaf certificate 
    * *Intermediate certificate's* subject name is what Application Gateway will extract as the client certificate issuer DN and will be verified against. 
* **Scenario 2:** Certificate chain includes: root certificate - intermediate1 certificate - intermediate2 certificate - leaf certificate
    * *Intermediate2 certificate's* subject name will be what's extracted as the client certificate issuer DN and will be verified against. 
* **Scenario 3:** Certificate chain includes: root certificate - leaf certificate 
    * *Root certificate's* subject name will be extracted and used as client certificate issuer DN.
* **Scenario 4:** Multiple certificate chains of the same length in the same file. Chain 1 includes: root certificate - intermediate1 certificate - leaf certificate. Chain 2 includes: root certificate - intermediate2 certificate - leaf certificate. 
    * *Intermediate1 certificate's* subject name will be extracted as client certificate issuer DN.  
* **Scenario 5:** Multiple certificate chains of different lengths in the same file. Chain 1 includes: root certificate - intermediate1 certificate - leaf certificate. Chain 2 includes root certificate - intermediate2 certificate - intermediate3 certificate - leaf certificate. 
    * *Intermediate3 certificate's* subject name will be extracted as client certificate issuer DN. 

> [!IMPORTANT]
> We recommend only uploading one certificate chain per file. This is especially important if you enable verify client certificate DN. By uploading multiple certificate chains in one file, you will end up in scenario four or five and may run into issues later down the line when the client certificate presented doesn't match the client certificate issuer DN Application Gateway extracted from the chains. 

For more information on how to extract trusted client CA certificate chains, see [how to extract trusted client CA certificate chains](./mutual-authentication-certificate-management.md).

## Server variables 

With mutual authentication, there are additional server variables that you can use to pass information about the client certificate to the backend servers behind the Application Gateway. For more information about which server variables are available and how to use them, check out [server variables](./rewrite-http-headers-url.md#mutual-authentication-server-variables-preview).

## Next steps

After learning about mutual authentication, go to [Configure Application Gateway with mutual authentication in PowerShell](./mutual-authentication-powershell.md) to create an Application Gateway using mutual authentication. 

