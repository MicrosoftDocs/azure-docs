---
title: Enabling end to end TLS on Azure Application Gateway
description: This article is an overview of the Application Gateway end to end TLS support.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: conceptual
ms.date: 03/27/2023
ms.author: greglin

---
# Overview of TLS termination and end to end TLS with Application Gateway

Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL), is the standard security technology for establishing an encrypted link between a web server and a browser. This link ensures that all data passed between the web server and browsers remain private and encrypted. Application gateway supports both TLS termination at the gateway as well as end to end TLS encryption.

## TLS termination

Application Gateway supports TLS termination at the gateway, after which traffic typically flows unencrypted to the backend servers. There are a number of advantages of doing TLS termination at the application gateway:

- **Improved performance** – The biggest performance hit when doing TLS decryption is the initial handshake. To improve performance, the server doing the decryption caches TLS session IDs and manages TLS session tickets. If this is done at the application gateway, all requests from the same client can use the cached values. If it’s done on the backend servers, then each time the client’s requests go to a different server the client must re‑authenticate. The use of TLS tickets can help mitigate this issue, but they aren't supported by all clients and can be difficult to configure and manage.
- **Better utilization of the backend servers** – SSL/TLS processing is very CPU intensive, and is becoming more intensive as key sizes increase. Removing this work from the backend servers allows them to focus on what they are most efficient at, delivering content.
- **Intelligent routing** – By decrypting the traffic, the application gateway has access to the request content, such as headers, URI, and so on, and can use this data to route requests.
- **Certificate management** – Certificates only need to be purchased and installed on the application gateway and not all backend servers. This saves both time and money.

To configure TLS termination, a TLS/SSL certificate must be added to the listener. This allows the Application Gateway to decrypt incoming traffic and encrypt response traffic to the client. The certificate provided to the Application Gateway must be in Personal Information Exchange (PFX) format, which contains both the private and public keys.

> [!IMPORTANT] 
> The certificate on the listener requires the entire certificate chain to be uploaded (the root certificate from the CA, the intermediates and the leaf certificate) to establish the chain of trust. 


> [!NOTE] 
> Application gateway doesn't provide any capability to create a new certificate or send a certificate request to a certification authority.

For the TLS connection to work, you need to ensure that the TLS/SSL certificate meets the following conditions:

- That the current date and time is within the "Valid from" and "Valid to" date range on the certificate.
- That the certificate's "Common Name" (CN) matches the host header in the request. For example, if the client is making a request to `https://www.contoso.com/`, then the CN must be `www.contoso.com`.

### Certificates supported for TLS termination

Application gateway supports the following types of certificates:

- CA (Certificate Authority) certificate: A CA certificate is a digital certificate issued by a certificate authority (CA)
- EV (Extended Validation) certificate: An EV certificate is a certificate that conforms to industry standard certificate guidelines. This will turn the browser locator bar green and publish the company name as well.
- Wildcard Certificate: This certificate supports any number of subdomains based on *.site.com, where your subdomain would replace the *. It doesn’t, however, support site.com, so in case the users are accessing your website without typing the leading "www", the wildcard certificate won't cover that.
- Self-Signed certificates: Client browsers don't trust these certificates and will warn the user that the virtual service’s certificate isn't part of a trust chain. Self-signed certificates are good for testing or environments where administrators control the clients and can safely bypass the browser’s security alerts. Production workloads should never use self-signed certificates.

For more information, see [configure TLS termination with application gateway](./create-ssl-portal.md).

### Size of the certificate
Check the [Application Gateway limits](../azure-resource-manager/management/azure-subscription-service-limits.md#application-gateway-limits) section to know the maximum TLS/SSL certificate size supported.

## End-to-end TLS encryption

You may not want unencrypted communication to the backend servers. You may have security requirements, compliance requirements, or the application may only accept a secure connection. Azure Application Gateway has end-to-end TLS encryption to support these requirements.

End-to-end TLS allows you to encrypt and securely transmit sensitive data to the backend while you use Application Gateway's Layer-7 load-balancing features. These features include cookie-based session affinity, URL-based routing, support for routing based on sites, the ability to rewrite or inject X-Forwarded-* headers, and so on.

When configured with end-to-end TLS communication mode, Application Gateway terminates the TLS sessions at the gateway and decrypts user traffic. It then applies the configured rules to select an appropriate backend pool instance to route traffic to. Application Gateway then initiates a new TLS connection to the backend server and re-encrypts data using the backend server's public key certificate before transmitting the request to the backend. Any response from the web server goes through the same process back to the end user. End-to-end TLS is enabled by setting protocol setting in [Backend HTTP Setting](./configuration-overview.md#http-settings) to HTTPS, which is then applied to a backend pool.

In Application Gateway v1 SKU gateways, [TLS policy](./application-gateway-ssl-policy-overview.md) applies the TLS version only to frontend traffic and the defined ciphers to both frontend and backend targets.  In Application Gateway v2 SKU gateways, TLS policy only applies to frontend traffic, backend TLS connections will always be negotiated via TLS 1.0 to TLS 1.2 versions.

Application Gateway only communicates with those backend servers that have either allow-listed their certificate with the Application Gateway or whose certificates are signed by well-known CA authorities and the certificate's CN matches the host name in the HTTP backend settings. These include the trusted Azure services such as Azure App Service/Web Apps and Azure API Management.

If the certificates of the members in the backend pool aren't signed by well-known CA authorities, then each instance in the backend pool with end to end TLS enabled must be configured with a certificate to allow secure communication. Adding the certificate ensures that the application gateway only communicates with known backend instances. This further secures the end-to-end communication.

> [!NOTE] 
>
> The certificate added to **Backend HTTP Setting** to authenticate the backend servers can be the same as the certificate added to the **listener** for TLS termination at application gateway or different for enhanced security.

![end to end TLS scenario][1]

In this example, requests using TLS1.2 are routed to backend servers in Pool1 using end to end TLS.

## End to end TLS and allow listing of certificates

Application Gateway only communicates with those backend servers that have either allow-listed their certificate with the Application Gateway or whose certificates are signed by well-known CA authorities and the certificate's CN matches the host name in the HTTP backend settings. There are some differences in the end-to-end TLS setup process with respect to the version of Application Gateway used. The following section explains them individually.

## End-to-end TLS with the v1 SKU

To enable end-to-end TLS with the backend servers and for Application Gateway to route requests to them, the health probes must succeed and return healthy response.

For HTTPS health probes, the Application Gateway v1 SKU uses an exact match of the authentication certificate (public key of the backend server certificate and not the root certificate) to be uploaded to the HTTP settings.

Only connections to known and allowed backends are then allowed. The remaining backends are considered unhealthy by the health probes. Self-signed certificates are for test purposes only and not recommended for production workloads. Such certificates must be allow-listed with the application gateway as described in the preceding steps before they can be used.

> [!NOTE]
> Authentication and trusted root certificate setup aren't required for trusted Azure services such as Azure App Service. They are considered trusted by default.

## End-to-end TLS with the v2 SKU

Authentication Certificates have been deprecated and replaced by Trusted Root Certificates in the Application Gateway v2 SKU. They function similarly to Authentication Certificates with a few key differences:

- Certificates signed by well known CA authorities whose CN matches the host name in the HTTP backend settings don't require any additional step for end to end TLS to work. 

   For example, if the backend certificates are issued by a well known CA and has a CN of contoso.com, and the backend http setting’s host field is also set to contoso.com, then no additional steps are required. You can set the backend http setting protocol to HTTPS and both the health probe and data path would be TLS enabled. If you're using Azure App Service or other Azure web services as your backend, then these are implicitly trusted as well and no further steps are required for end to end TLS.
   
> [!NOTE] 
>
> In order for a TLS/SSL certificate to be trusted, that certificate of the backend server must have been issued by a CA that is well-known. If the certificate was not issued by a trusted CA, the application gateway will then check to see if the certificate of the issuing CA was issued by a trusted CA, and so on until either a trusted CA is found (at which point a trusted, secure connection will be established) or no trusted CA can be found (at which point the application gateway will mark the backend unhealthy). Therefore, it is recommended the backend server certificate contain both the root and intermediate CAs.

- If the backend server certificate is self-signed, or signed by unknown CA/intermediaries, then to enable end to end TLS in Application Gateway v2 a trusted root certificate must be uploaded. Application Gateway will only communicate with backends whose server certificate’s root certificate matches one of the list of trusted root certificates in the backend http setting associated with the pool.

- In addition to the root certificate match, Application Gateway v2 also validates if the Host setting specified in the backend http setting matches that of the common name (CN) presented by the backend server’s TLS/SSL certificate. When trying to establish a TLS connection to the backend, Application Gateway v2 sets the Server Name Indication (SNI) extension to the Host specified in the backend http setting.

- If **pick hostname from backend target** is chosen instead of the Host field in the backend http setting,  then the SNI header is always set to the backend pool FQDN and the CN on the backend server TLS/SSL certificate must match its FQDN. Backend pool members with IPs aren't supported in this scenario.

- The root certificate is a base64 encoded root certificate from the backend server certificates.

## SNI differences in the v1 and v2 SKU

As mentioned previously, Application Gateway terminates TLS traffic from the client at the Application Gateway Listener (let's call it the frontend connection), decrypts the traffic, applies the necessary rules to determine the backend server to which the request has to be forwarded, and establishes a new TLS session with the backend server (let's call it the backend connection).

The following tables outline the differences in SNI between the v1 and v2 SKU in terms of frontend and backend connections.

### Frontend TLS connection (client to application gateway)


|Scenario | v1 | v2 |
| --- | --- | --- |
| If the client specifies SNI header and all the multi-site listeners are enabled with "Require SNI" flag | Returns the appropriate certificate and if the site doesn't exist (according to the server_name), then the connection is reset. | Returns appropriate certificate if available, otherwise, returns the certificate of the first HTTPS listener according to the order specified by the request routing rules associated with the HTTPS listeners|
| If the client doesn't specify a SNI header and if all the multi-site headers are enabled with "Require SNI" | Resets the connection | Returns the certificate of the first HTTPS listener according to the order specified by the request routing rules associated with the HTTPS listeners
| If the client doesn't specify SNI header and if there's a basic listener configured with a certificate | Returns the certificate configured in the basic listener to the client (default or fallback certificate) | Returns the certificate configured in the basic listener |

### Backend TLS connection (application gateway to the backend server)

#### For probe traffic


|Scenario | v1 | v2 |
| --- | --- | --- |
| SNI (server_name) header during the TLS handshake as FQDN | Set as FQDN from the backend pool. As per [RFC 6066](https://tools.ietf.org/html/rfc6066), literal IPv4 and IPv6 addresses aren't permitted in SNI hostname. <br> **Note:** FQDN in the backend pool should DNS resolve to backend server’s IP address (public or private) | SNI header (server_name) is set as the hostname from the custom probe attached to the HTTP settings (if configured), otherwise from the hostname mentioned in the HTTP settings, otherwise from the FQDN mentioned in the backend pool. The order of precedence is custom probe > HTTP settings > backend pool. <br> **Note:** If the hostnames configured in HTTP settings and custom probe are different, then according to the precedence, SNI will be set as the hostname from the custom probe.
| If the backend pool address is an IP address (v1) or if custom probe hostname is configured as IP address (v2) | SNI (server_name) won’t be set. <br> **Note:** In this case, the backend server should be able to return a default/fallback certificate and this should be allow-listed in HTTP settings under authentication certificate. If there’s no default/fallback certificate configured in the backend server and SNI is expected, the server might reset the connection and will lead to probe failures | In the order of precedence mentioned previously, if they have IP address as hostname, then SNI won't be set as per [RFC 6066](https://tools.ietf.org/html/rfc6066). <br> **Note:** SNI also won't be set in v2 probes if no custom probe is configured and no hostname is set on HTTP settings or backend pool |

> [!NOTE] 
> If a custom probe isn't configured, then Application Gateway sends a default probe in this format - \<protocol\>://127.0.0.1:\<port\>/. For example, for a default HTTPS probe, it will be sent as https://127.0.0.1:443/. Note that, the 127.0.0.1 mentioned here is only used as HTTP host header and as per RFC 6066, won't be used as SNI header. For more information on health probe errors, check the [backend health troubleshooting guide](application-gateway-backend-health-troubleshooting.md).

#### For live traffic


|Scenario | v1 | v2 |
| --- | --- | --- |
| SNI (server_name) header during the TLS handshake as FQDN | Set as FQDN from the backend pool. As per [RFC 6066](https://tools.ietf.org/html/rfc6066), literal IPv4 and IPv6 addresses aren't permitted in SNI hostname. <br> **Note:** FQDN in the backend pool should DNS resolve to backend server’s IP address (public or private) | SNI header (server_name) is set as the hostname from the HTTP settings, otherwise, if *PickHostnameFromBackendAddress* option is chosen or if no hostname is mentioned, then it will be set as the FQDN in the backend pool configuration
| If the backend pool address is an IP address or hostname isn't set in HTTP settings | SNI won't be set as per [RFC 6066](https://tools.ietf.org/html/rfc6066) if the backend pool entry isn't an FQDN | SNI will be set as the hostname from the input FQDN from the client and the backend certificate's CN has to match with this hostname.
| Hostname isn't provided in HTTP Settings, but an FQDN is specified as the Target for a backend pool member | SNI will be set as the hostname from the input FQDN from the client and the backend certificate's CN has to match with this hostname. | SNI will be set as the hostname from the input FQDN from the client and the backend certificate's CN has to match with this hostname.

## Next steps

After learning about end to end TLS, go to [Configure end to end TLS by using Application Gateway with PowerShell](application-gateway-end-to-end-ssl-powershell.md) to create an application gateway using end to end TLS.

<!--Image references-->

[1]: ./media/ssl-overview/scenario.png
