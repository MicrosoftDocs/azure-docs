---
title: Azure API Management transformation policies | Microsoft Docs
description: Reference for the transformation policies available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: reference
ms.date: 12/08/2022
ms.author: danlep
---

# API Management transformation policies
The following API Management policies are used to transform API requests or responses. 

-   [Convert JSON to XML](json-to-xml-policy.md) - Converts request or response body from JSON to XML.

-   [Convert XML to JSON](xml-to-json-policy.md) - Converts request or response body from XML to JSON.

-   [Find and replace string in body](find-and-replace-policy.md) - Finds a request or response substring and replaces it with a different substring.

-   [Mask URLs in content](redirect-content-urls-policy.md) - Rewrites (masks) links in the response body so that they point to the equivalent link via the gateway.

-   [Set backend service](set-backend-service-policy.md) - Changes the backend service for an incoming request.

-   [Set body](set-body-policy.md) - Sets the message body for incoming and outgoing requests.

-   [Set HTTP header](set-header-policy.md) - Assigns a value to an existing response and/or request header or adds a new response and/or request header.

-   [Set query string parameter](set-query-parameter-policy.md) - Adds, replaces value of, or deletes request query string parameter.

-   [Rewrite URL](rewrite-uri-policy.md) - Converts a request URL from its public form to the form expected by the web service.

-   [Transform XML using an XSLT](xsl-transform-policy.md) - Applies an XSL transformation to XML in the request or response body.
-   [Set query string parameter](#SetQueryStringParameter) - Adds, replaces value of, or deletes request query string parameter.

-   [Rewrite URL](#RewriteURL) - Converts a request URL from its public form to the form expected by the web service.

-   [Transform XML using an XSLT](#XSLTransform) - Applies an XSL transformation to XML in the request or response body.

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
