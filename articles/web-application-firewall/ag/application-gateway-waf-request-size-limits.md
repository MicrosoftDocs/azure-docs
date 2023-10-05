---
title: Web application firewall request size limits in Azure Application Gateway - Azure portal
description: This article provides information on Web Application Firewall request size limits in Application Gateway with the Azure portal.
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.date: 10/05/2023
ms.author: victorh
ms.topic: conceptual 
---

# Web Application Firewall request size limits

Web Application Firewall allows you to configure request size limits within lower and upper bounds.

Request size limits are global in scope.

## Limits

The following two size limits configurations are available:

- The maximum request body size field is specified in kilobytes and controls overall request size limit excluding any file uploads. This field has a minimum value of 8 KB and a maximum value of 128 KB. The default value for request body size is 128 KB.
- The file upload limit field is specified in MB and it governs the maximum allowed file upload size. This field can have a minimum value of 1 MB and the following maximums:

   - 100 MB for v1 Medium WAF gateways
   - 500 MB for v1 Large WAF gateways
   - 750 MB for v2 WAF gateways 

The default value for file upload limit is 100 MB.

For CRS 3.2 (on the WAF_v2 SKU) and newer, these limits are as follows when using a WAF policy for Application Gateway:
   
   - 2 MB request body size limit
   - 4 GB file upload limit 

Only requests with Content-Type of *multipart/form-data* are considered for file uploads. For content to be considered as a file upload, it has to be a part of a multipart form with a *filename* header. For all other content types, the request body size limit applies.

To set request size limits in the Azure portal, configure **Global parameters** in the WAF policy resource's **Policy settings** page:

:::image type="content" source="../media/application-gateway-waf-request-size-limits/waf-policy-limits.png" alt-text="Screenshot of the Azure portal that shows the request size limits configuration for the W A F policy.":::

## Request body inspection

WAF offers a configuration setting to enable or disable the request body inspection. By default, the request body inspection is enabled. If the request body inspection is disabled, WAF doesn't evaluate the contents of an HTTP message's body. In such cases, WAF continues to enforce WAF rules on headers, cookies, and URI. If the request body inspection is turned off, then maximum request body size field isn't applicable and can't be set.

Turning off the request body inspection allows for messages larger than 128 KB to be sent to WAF, but the message body isn't inspected for vulnerabilities.

When your WAF receives a request that's over the size limit, the behavior depends on the mode of your WAF and the version of the managed ruleset you use.
- When your WAF policy is in prevention mode, WAF logs and blocks requests that are over the size limit.
- When your WAF policy is in detection mode, WAF inspects the body up to the limit specified and ignores the rest. If the `Content-Length` header is present and is greater than the file upload limit, WAF ignores the entire body and logs the request.

## Next steps

- After you configure your WAF settings, you can learn how to view your WAF logs. For more information, see [Application Gateway diagnostics](../../application-gateway/application-gateway-diagnostics.md#diagnostic-logging).
- [Learn more about Azure network security](../../networking/security/index.yml)

