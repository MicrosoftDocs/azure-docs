---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 12/08/2021
ms.author: danlep
---
## How API Management proxy server responds with SSL certificates in the TLS handshake

When configuring a custom domain for the Gateway endpoint, you can set additional properties that determine how API Management responds with a server certificate, depending on the client request.

### Clients calling with Server Name Indication (SNI) header
If you have one or multiple custom domains configured for the Gateway endpoint, API Management can respond to HTTPS requests from either:
* Custom domain (for example, `contoso.com`)
* Default domain (for example, `apim-service-name.azure-api.net`). 

Based on the information in the SNI header, API Management responds with the appropriate server certificate.

### Clients calling without SNI header
If you are using a client that does not send the [SNI](https://tools.ietf.org/html/rfc6066#section-3) header, API Management creates responses based on the following logic:

* **If the service has just one custom domain configured for Gateway**, the default certificate is the certificate issued to the Gateway's custom domain.
* **If the service has configured multiple custom domains for Gateway (supported in the **Developer** and **Premium** tier)**, you can designate the default certificate by setting the [defaultSslBinding](/rest/api/apimanagement/current-ga/api-management-service/create-or-update#hostnameconfiguration) property to true (`"defaultSslBinding":"true"`). In the portal, select the **Default SSL binding** checkbox. 
  
  If you do not set the property, the default certificate is the certificate issued to the default Gateway domain hosted at `*.azure-api.net`.

## Support for PUT/POST request with large payload

API Management proxy server supports requests with large payloads (>40 KB) when using client-side certificates in HTTPS. To prevent the server's request from freezing, you can set the [negotiateClientCertificate](/rest/api/apimanagement/current-ga/api-management-service/create-or-update#hostnameconfiguration) property to true (`"negotiateClientCertificate": "true"`) on the Gateway hostname. In the portal, select the **Negotiate client certificate** checkbox.

If the property is set to true, the client certificate is requested at SSL/TLS connection time, before any HTTP request exchange. Since the setting applies at the **Gateway hostname** level, all connection requests ask for the client certificate. You can work around this limitation and configure up to 20 custom domains for Gateway (only supported in the **Premium** tier).
