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

# Web Application Firewall request and file upload size limits

Web Application Firewall allows you to configure request size limits within a lower and upper boundary. Application Gateways WAFs running CRS 3.2 or later have additional request and file upload size controls, including the ability to disable max size enforcement for requests and/or file uploads.


> [!IMPORTANT]
> We are in the process of deploying a new feature for Application Gateway v2 WAFs running Core Rule Set (CRS) 3.2 or later that allows for greater control of your request body size, file upload size, and request body inspection. If you are running Application Gateway v2 WAF with CRS 3.2 or later, and you notice requests getting rejected (or not getting rejected) for a size limit please refer to the troubleshooting steps at the bottom of this page.


## Limits

The request body size field and the file upload size limit are both configurable within the WAF. The maximum request body size field is specified in kilobytes and controls overall request size limit excluding any file uploads. The file upload limit field is specified in MB and it governs the maximum allowed file upload size. The request size limits and file upload size limits can be found here: [Application Gateway limits](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits#application-gateway-limits).

For Application Gateway v2 WAFs running Core Rule Set 3.2, or newer, the maximum request body size enforcement and max file upload size enforcement can be disabled and the WAF will no longer reject a request, or file upload, for being too large. When maximum request body size enforcement and max file upload size enforcement are disabled within the WAF the maximum size allowable is determined by Application Gateway's limits which can be found here: [Application Gateway limits](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits#application-gateway-limits).

Only requests with Content-Type of *multipart/form-data* are considered for file uploads. For content to be considered as a file upload, it has to be a part of a multipart form with a *filename* header. For all other content types, the request body size limit applies.

To set request size limits in the Azure portal, configure **Global parameters** in the WAF policy resource's **Policy settings** page.

>[!NOTE]
>If you are running CRS 3.2 or later, and you have a high priority custom rule that takes action based on the content of a request's headers, cookies, or URI, this will take precedence over any max request size, or max file upload size, limits. This optimization let's the WAF run high priority custom rules that don't require reading and/or measuring the full WAF request (or file upload) first before performing the full request inspection.
>
>Example: If you have a custom rule with priority 0 (the highest priority) set to approve a request with the header xyz, even if the request's size is larger than your maximum request size limit, it will get approved. This is because the WAF will attempt to run all high priority custom rules that don't require reading the request body before enforcing any rules or size constraints that require reading the full request body.


## Request body inspection

WAF offers a configuration setting to enable or disable the request body inspection. By default, the request body inspection is enabled. If the request body inspection is disabled, WAF doesn't evaluate the contents of an HTTP message's body. In such cases, WAF continues to enforce WAF rules on headers, cookies, and URI. In WAFs running CRS 3.1 (or lower) if the request body inspection is turned off, then maximum request body size field isn't applicable and can't be set. 

For Policy WAFs running CRS 3.2 (or newer) request body inspection can be enabled/disabled independently of request body size enforcement and file upload size limits. Additionally, policy WAFs running CRS 3.2 (or newer) can set the maximum request body inspection limit independently of the maximum request body size. The maximum request body inspection limit tells the WAF how deep into a request it should inspect and apply rules; setting a lower value for this field can improve WAF performance but may allow for uninspected malicious content to pass through your WAF.

For older WAFs running CRS 3.1 (or lower) turning off the request body inspection allows for messages larger than 128 KB to be sent to WAF, but the message body isn't inspected for vulnerabilities. For Policy WAFs running CRS 3.2 (or newer) you can achieve the same outcome by disabling maximum request body limit.

When your WAF receives a request that's over the size limit, the behavior depends on the mode of your WAF and the version of the managed ruleset you use.
- When your WAF policy is in prevention mode, WAF logs and blocks requests and file uploads that are over the size limits.
- When your WAF policy is in detection mode, WAF inspects the body up to the limit specified and ignores the rest. If the `Content-Length` header is present and is greater than the file upload limit, WAF ignores the entire body and logs the request.

## Trouble Shooting



## Next steps

- After you configure your WAF settings, you can learn how to view your WAF logs. For more information, see [Application Gateway diagnostics](../../application-gateway/application-gateway-diagnostics.md#diagnostic-logging).
- [Learn more about Azure network security](../../networking/security/index.yml)

