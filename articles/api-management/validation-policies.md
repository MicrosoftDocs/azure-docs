---
title: Azure API Management validation policies | Microsoft Docs
description: Azure API Management policies to validate API requests and responses against a schema. 
services: api-management
documentationcenter: ''
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 09/09/2022
ms.author: danlep
---

# API Management policies to validate requests and responses

The following API Management policies validate REST or SOAP API requests and responses against schemas defined in the API definition or supplementary JSON or XML schemas. Validation policies protect from vulnerabilities such as injection of headers or payload or leaking sensitive data. Learn more about common [API vulnerabilites](mitigate-owasp-api-threats.md).

While not a replacement for a Web Application Firewall, validation policies provide flexibility to respond to an additional class of threats that aren’t covered by security products that rely on static, predefined rules. 

- [Validate content](validate-content-policy.md) - Validates the size or content of a request or response body against one or more API schemas. The supported schema formats are JSON and XML.
- [Validate parameters](validate-parameters-policy.md) - Validates the request header, query, or path parameters against the API schema.
- [Validate headers](validate-headers-policy.md) - Validates the response headers against the API schema.
- [Validate status code](validate-status-code-policy.md) - Validates the HTTP status codes in responses against the API schema.

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
