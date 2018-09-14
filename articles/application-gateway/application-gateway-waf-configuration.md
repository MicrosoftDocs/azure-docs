---
title: Web application firewall request size limits and exclusion lists in Azure Application Gateway - Azure portal | Microsoft Docs
description: This article provides information on web application firewall request size limits and exclusion lists in Application Gateway with the Azure portal.
documentationcenter: na
services: application-gateway
author: vhorne
manager: jpconnock
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.custom:
ms.workload: infrastructure-services
ms.date: 09/13/2018
ms.author: victorh

---

# Web application firewall request size limits and exclusion lists

The Azure Application Gateway web application firewall (WAF) provides protection for web applications. This article describes WAF request size limits and exclusion lists configurations.

## WAF request size limits
Web Application Firewall allows users to configure request size limits within lower and upper bounds. The following two size limits configurations are available:
- Maximum request body size field is specified in KBs and controls overall request size limit excluding any file uploads. This field can range from 1 KB min to 128 KB max value. Default value for request body size is 128 KB.
- File upload limit field is specified in MB and governs the maximum allowed file upload size. This field can have a minimum value of 1 MB and a maximum of 500MB. Default value for file upload limit is 100 MB.

WAF also offers a configurable knob to turn on or off request body inspection. By default, request body inspection is enabled. If request body inspection is turned off, WAF does not evaluate the contents of HTTP message body. In such cases, WAF continues to enforce WAF rules on headers, cookies, and URI. If request body inspection is turned off, then maximum request body size field is not applicable and cannot be set. Turning off request body inspection allows for messages larger than 128KB to be sent to WAF, however the message body is not inspected for vulnerabilities.

## WAF exclusion lists

WAF exclusion lists allow users to omit certain request attributes from a WAF evaluation. A common example is Active Directory inserted tokens which are used for authentication or password fields. Such attributes are prone to contain special characters which may trigger a false positive from the WAF rules. Once an attribute is added to the WAF exclusion list, it is not taken into consideration by any configured and active WAF rule. Exclusion lists are global in scope.
Users can add request headers, request cookies, or request query string arguments to WAF exclusion lists. Users can specify an exact request header, cookie, or query string attribute match, or, can optionally specify partial matches. The following are the supported match criteria operators: 
- Equals – this operator is used for an exact match. As an example, for selecting header named “bearerToken” use equals operator with selector set as bearerToken. 
- Starts with – matches all fields which start with specified selector value. 
- Ends with – matches all request fields which ends with specified selector value. 
- Contains – matches all request fields which contain specified selector value.

In all cases matching is case insensitive and regular expression are not allowed as selectors.

## Next steps

After you configure your WAF settings, you can learn how to view your WAF logs. For more information, see [Application Gateway diagnostics](application-gateway-diagnostics.md#diagnostic-logging).