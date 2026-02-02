---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 01/29/2026
ms.author: danlep
ms.custom:
---
### CNAME record

Configure a CNAME record that points from your custom domain name (for example, `api.contoso.com`) to your API Management service hostname (for example, `yourapim-service-name.azure-api.net`). A CNAME record is more stable than an A record in case the IP address changes. For more information, see [IP addresses of Azure API Management](../articles/api-management/api-management-howto-ip-addresses.md#changes-to-ip-addresses) and the [API Management FAQ](../articles/api-management/api-management-faq.yml#how-can-i-secure-the-connection-between-the-api-management-gateway-and-my-backend-services-).

> [!NOTE]
> Some domain registrars only allow you to map subdomains when using a CNAME record, such as `www.contoso.com`, and not root names, such as `contoso.com`. For more information on CNAME records, see the documentation provided by your registrar or [IETF Domain Names - Implementation and Specification](https://tools.ietf.org/html/rfc1035).
