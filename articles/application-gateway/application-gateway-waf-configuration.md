---
title: Web application firewall request size limits and exclusion lists in Azure Application Gateway - Azure portal
description: This article provides information on web application firewall request size limits and exclusion lists configuration in Application Gateway with the Azure portal.
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.workload: infrastructure-services
ms.date: 10/11/2018
ms.author: victorh

---

# Web application firewall request size limits and exclusion lists (Public Preview)

The Azure Application Gateway web application firewall (WAF) provides protection for web applications. This article describes WAF request size limits and exclusion lists configuration.

> [!IMPORTANT]
> Configuration of WAF request size limits and exclusion lists is currently in public preview. This preview is provided without a service level agreement and isn't recommended for production workloads. Certain features may not be supported or may have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.

## WAF request size limits
Web Application Firewall allows users to configure request size limits within lower and upper bounds. The following two size limits configurations are available:

- The maximum request body size field is specified in KBs and controls overall request size limit excluding any file uploads. This field can range from 1-KB minimum to 128-KB maximum value. The default value for request body size is 128 KB.
- The file upload limit field is specified in MB and it governs the maximum allowed file upload size. This field can have a minimum value of 1 MB and a maximum of 500 MB. The default value for file upload limit is 100 MB.

WAF also offers a configurable knob to turn the request body inspection on or off. By default, the request body inspection is enabled. If the request body inspection is turned off, WAF does not evaluate the contents of HTTP message body. In such cases, WAF continues to enforce WAF rules on headers, cookies, and URI. If the request body inspection is turned off, then maximum request body size field isn't applicable and can't be set. Turning off the request body inspection allows for messages larger than 128 KB to be sent to WAF. However, the message body isn't inspected for vulnerabilities.

## WAF exclusion lists

WAF exclusion lists allow users to omit certain request attributes from a WAF evaluation. A common example is Active Directory inserted tokens that are used for authentication or password fields. Such attributes are prone to contain special characters that may trigger a false positive from the WAF rules. Once an attribute is added to the WAF exclusion list, it isn't taken into consideration by any configured and active WAF rule. Exclusion lists are global in scope.
You can add request headers, request body, request cookies, or request query string arguments to WAF exclusion lists. If the body has form data or XML/JSON (key value pairs) then request attribute exclusion type can be used.

You can specify an exact request header, body, cookie, or query string attribute match, or, can optionally specify partial matches.

The following are the supported match criteria operators:

- **Equals**:  This operator is used for an exact match. As an example, for selecting header named **bearerToken** use equals operator with selector set as **bearerToken**.
- **Starts with**: This operator matches all fields that start with specified selector value. 
- **Ends with**:  This operator matches all request fields that end with specified selector value. 
- **Contains**: This operator matches all request fields that contain specified selector value.

In all cases matching is case insensitive and regular expression are not allowed as selectors.

## Next steps

After you configure your WAF settings, you can learn how to view your WAF logs. For more information, see [Application Gateway diagnostics](application-gateway-diagnostics.md#diagnostic-logging).