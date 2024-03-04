---
title: Overview of mutual authentication on Azure Application Gateway
description: This article is an overview of mutual authentication on Application Gateway.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.date: 07/29/2023
ms.topic: conceptual 
ms.author: greglin

---
# Overview of mutual authentication with Application Gateway

Mutual authentication, or client authentication, allows for the Application Gateway to authenticate the client sending requests. Usually, only the client is authenticating the Application Gateway; mutual authentication allows for both the client and the Application Gateway to authenticate each other. 

> [!NOTE]
> We recommend using TLS 1.2 with mutual authentication as TLS 1.2 will be mandated in the future. 

## Mutual authentication

Application Gateway supports certificate-based mutual authentication where you can upload a trusted client CA certificate(s) to the Application Gateway, and the gateway will use that certificate to authenticate the client sending a request to the gateway. With the rise in IoT use cases and increased security requirements across industries, mutual authentication provides a way for you to manage and control which clients can talk to your Application Gateway. 

To configure mutual authentication, a trusted client CA certificate is required to be uploaded as part of the client authentication portion of an SSL profile. The SSL profile will then need to be associated to a listener in order to complete configuration of mutual authentication. There must always be a root CA certificate in the client certificate that you upload. You can upload a certificate chain as well, but the chain must include a root CA certificate in addition to as many intermediate CA certificates as you'd like. The maximum size of each uploaded file must be 25 KB or less.

For example, if your client certificate contains a root CA certificate, multiple intermediate CA certificates, and a leaf certificate, make sure that the root CA certificate and all the intermediate CA certificates are uploaded onto Application Gateway in one file. For more information on how to extract a trusted client CA certificate, see [how to extract trusted client CA certificates](./mutual-authentication-certificate-management.md).

If you're uploading a certificate chain with root CA and intermediate CA certificates, the certificate chain must be uploaded as a PEM or CER file to the gateway.

> [!IMPORTANT]
> Make sure you upload the entire trusted client CA certificate chain to the Application Gateway when using mutual authentication. 

Each SSL profile can support up to 100 trusted client CA certificate chains.  A single Application Gateway can support a total of 200 trusted client CA certificate chains.

> [!NOTE] 
> Mutual authentication is only available on Standard_v2 and WAF_v2 SKUs. 

### Certificates supported for mutual authentication

Application Gateway supports certificates issued from both public and privately established certificate authorities.

- CA certificates issued from well-known certificate authorities: Intermediate and root certificates are commonly found in trusted certificate stores and enable trusted connections with little to no additional configuration on the device.
- CA certificates issued from organization established certificate authorities: These certificates are typically issued privately via your organization and not trusted by other entities. Intermediate and root certificates must be imported in to trusted certificate stores for clients to establish chain trust.

> [!NOTE]
> When issuing client certificates from well established certificate authorities, consider working with the certificate authority to see if an intermediate certificate can be issued for your organization to prevent inadvertent cross-organizational client certificate authentication.

## Additional client authentication validation

### Verify client certificate DN

You have the option to verify the client certificate's immediate issuer and only allow the Application Gateway to trust that issuer. This option is off by default but you can enable this through Portal, PowerShell, or Azure CLI. 

If you choose to enable the Application Gateway to verify the client certificate's immediate issuer, here's how to determine what client certificate issuer DN will be extracted from the certificates uploaded. 
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

With mutual TLS authentication, there are additional server variables that you can use to pass information about the client certificate to the backend servers behind the Application Gateway. For more information about which server variables are available and how to use them, check out [server variables](./rewrite-http-headers-url.md#mutual-authentication-server-variables).

## Certificate Revocation

When a client initiates a connection to an Application Gateway configured with mutual TLS authentication, not only can the certificate chain and issuer's distinguished name be validated, but revocation status of the client certificate can be checked with OCSP (Online Certificate Status Protocol). During validation, the certificate presented by the client will be looked up via the defined OCSP responder defined in its Authority Information Access (AIA) extension. In the event the client certificate has been revoked, the application gateway will respond to the client with an HTTP 400 status code and reason.  If the certificate is valid, the request will continue to be processed by application gateway and forwarded on to the defined backend pool.

Client certificate revocation can be enabled via REST API, ARM, Bicep, CLI, or PowerShell.

# [Azure PowerShell](#tab/powershell)
To configure client revocation check on an existing Application Gateway via Azure PowerShell, the following commands can be referenced:
```azurepowershell
# Get Application Gateway configuration
$AppGw = Get-AzApplicationGateway -Name "ApplicationGateway01" -ResourceGroupName "ResourceGroup01"

# Create new SSL Profile
$profile  = Get-AzApplicationGatewaySslProfile -Name "SslProfile01" -ApplicationGateway $AppGw

# Verify Client Cert Issuer DN and enable Client Revocation Check
Set-AzApplicationGatewayClientAuthConfiguration -SslProfile $profile -VerifyClientCertIssuerDN -VerifyClientRevocation OCSP

# Update Application Gateway
Set-AzApplicationGateway -ApplicationGateway $AppGw

```

A list of all Azure PowerShell references for Client Authentication Configuration on Application Gateway can be found here:
- [Set-AzApplicationGatewayClientAuthConfiguration](/powershell/module/az.network/set-azapplicationgatewayclientauthconfiguration)
- [New-AzApplicationGatewayClientAuthConfiguration](/powershell/module/az.network/new-azapplicationgatewayclientauthconfiguration)

# [Azure CLI](#tab/cli)
```azurecli
# Update existing gateway's SSL Profile
az network application-gateway update -n ApplicationGateway01 -g ResourceGroup01 --ssl-profiles [0].client-auth-configuration.verify-client-revocation=OCSP

```

A list of all Azure CLI references for client authentication configuration on Application Gateway can be found here:
- [Azure CLI - Application Gateway](/cli/azure/network/application-gateway)

# [Azure portal](#tab/portal)
Azure portal support is currently not available.

---

To verify OCSP revocation status has been evaluated for the client request, [access logs](./application-gateway-diagnostics.md#access-log) will contain a property called "sslClientVerify", with the status of the OCSP response.

It is critical that the OCSP responder is highly available and network connectivity between Application Gateway and the responder is possible. In the event Application Gateway is unable to resolve the fully qualified domain name (FQDN) of the defined responder or network connectivity is blocked to/from the responder, certificate revocation status will fail and Application Gateway will return a 400 HTTP response to the requesting client.

Note: OCSP checks are validated via local cache based on the nextUpdate time defined by a previous OCSP response. If the OCSP cache has not been populated from a previous request, the first response may fail. Upon retry of the client, the response should be found in the cache and the request will be processed as expected. 

## Notes
- Revocation check via CRL is not supported
- Client revocation check was introduced in API version 2022-05-01

## Next steps

After learning about mutual authentication, go to [Configure Application Gateway with mutual authentication in PowerShell](./mutual-authentication-powershell.md) to create an Application Gateway using mutual authentication. 

