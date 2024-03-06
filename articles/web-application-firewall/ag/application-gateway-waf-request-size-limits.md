---
title: Web application firewall request size limits in Azure Application Gateway - Azure portal
description: This article provides information on Web Application Firewall request size limits in Application Gateway with the Azure portal.
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.date: 03/05/2024
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

For CRS 3.2 (on the WAF_v2 SKU) and newer, the maximum request body size enforcement and max file upload size enforcement can be disabled and the WAF will no longer reject a request, or file upload, for being too large. Additionally, the limits for the request body size limit and the file upload size limit are as follows when using a WAF policy running CRS 3.2 (on the WAF_v2 SKU) or newer for Application Gateway:
   
   - 2 MB request body size limit
   - 4 GB file upload limit 

Only requests with Content-Type of *multipart/form-data* are considered for file uploads. For content to be considered as a file upload, it has to be a part of a multipart form with a *filename* header. For all other content types, the request body size limit applies.

To set request size limits in the Azure portal, configure **Global parameters** in the WAF policy resource's **Policy settings** page.

>[!NOTE]
>If you are running CRS 3.2 or later, and you have a high priority custom rule that takes action based on the content of a request's headers, this will take precedence over any max request size, or max file upload size, limits. This optimization let's the WAF run high priority custom rules that don't require reading, and/or measuring, the full WAF request of file upload.


## Request body inspection

WAF offers a configuration setting to enable or disable the request body inspection. By default, the request body inspection is enabled. If the request body inspection is disabled, WAF doesn't evaluate the contents of an HTTP message's body. In such cases, WAF continues to enforce WAF rules on headers, cookies, and URI. In WAFs running CRS 3.1 (or lower) if the request body inspection is turned off, then maximum request body size field isn't applicable and can't be set. 

For Policy WAFs running CRS 3.2 (or newer) request body inspection can be enabled/disabled independently of request body size enforcement and file upload size limits. Additionally, policy WAFs running CRS 3.2 (or newer) can set the maximum request body inspection limit independently of the maximum request body size. The maximum request body inspection limit tells the WAF how deep into a request it should inspect and apply rules; setting a lower value for this field can improve WAF performance but may allow for uninspected malicious content to pass through your WAF.

For older WAFs running CRS 3.1 (or lower) turning off the request body inspection allows for messages larger than 128 KB to be sent to WAF, but the message body isn't inspected for vulnerabilities. For Policy WAFs running CRS 3.2 (or newer) you can achieve the same outcome by disabling maximum request body limit.

When your WAF receives a request that's over the size limit, the behavior depends on the mode of your WAF and the version of the managed ruleset you use.
- When your WAF policy is in prevention mode, WAF logs and blocks requests and file uploads that are over the size limits.
- When your WAF policy is in detection mode, WAF inspects the body up to the limit specified and ignores the rest. If the `Content-Length` header is present and is greater than the file upload limit, WAF ignores the entire body and logs the request.

## Next steps

- After you configure your WAF settings, you can learn how to view your WAF logs. For more information, see [Application Gateway diagnostics](../../application-gateway/application-gateway-diagnostics.md#diagnostic-logging).
- [Learn more about Azure network security](../../networking/security/index.yml)

