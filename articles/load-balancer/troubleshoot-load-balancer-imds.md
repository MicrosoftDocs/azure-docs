---
title: Common error codes for Azure Instance Metadata Service (IMDS)
titleSuffix: Azure Load Balancer
description: Overview of common error codes and corresponding mitigation methods for Azure Instance Metadata Service (IMDS) when retrieving load balancer information.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: troubleshooting
ms.date: 05/22/2023
ms.author: mbender
---

# Common error codes when using IMDS to retrieve load balancer information

This article describes common deployment errors and how to resolve those errors while using the Azure Instance Metadata Service (IMDS) to retrieve load balancer information.

## Error codes

| Error code | Error message | Details and mitigation |
| --- | ---------- | ----------------- |
| 400 | Missing required parameter "\<ParameterName>". Please fix the request and retry. | The error code indicates a missing parameter. </br> For more information on adding the missing parameter, see [How to retrieve load balancer metadata using the Azure Instance Metadata Service (IMDS)](howto-load-balancer-imds.md#sample-request-and-response).
| 400 | Parameter value is not allowed, or parameter value "\<ParameterValue>" is not allowed for parameter "ParameterName". Please fix the request and retry. | The error code indicates that the request format is not configured properly. </br> Learn [How to retrieve load balancer metadata using the Azure Instance Metadata Service (IMDS)](howto-load-balancer-imds.md#sample-request-and-response) to fix the request body and issue a retry. |
| 400 | Unexpected request. Please check the query parameters and retry. | The error code indicates that the request format is not configured properly. </br> Learn [How to retrieve load balancer metadata using the Azure Instance Metadata Service (IMDS)](howto-load-balancer-imds.md#sample-request-and-response) to fix the request body and issue a retry. |
| 404 | No load balancer metadata is found. Please check if your VM is using any nonbasic SKU load balancer and retry later. | The error code indicates that your virtual machine isn't associated with a load balancer or the load balancer is basic SKU instead of standard. </br> For more information, see [Quickstart: Create a public load balancer to load balance VMs using the Azure portal](quickstart-load-balancer-standard-public-portal.md?tabs=option-1-create-load-balancer-standard) to deploy a standard load balancer.|
| 404 | API is not found: Path = "\<UrlPath>", Method = "\<Method>" | The error code indicates a misconfiguration of the path. </br> Learn [How to retrieve load balancer metadata using the Azure Instance Metadata Service (IMDS)](howto-load-balancer-imds.md#sample-request-and-response) to fix the request body and issue a retry. |
| 405 | Http method is not allowed: Path = "\<UrlPath>", Method = "\<Method>" | The error code indicates an unsupported HTTP verb. </br> For more information, see [Azure Instance Metadata Service (IMDS)](../virtual-machines/windows/instance-metadata-service.md?tabs=windows#http-verbs) for supported verbs. |
| 429 | Too many requests | The error code indicates a rate limit. </br> For more information on rate limiting, see [Azure Instance Metadata Service (IMDS)](../virtual-machines/windows/instance-metadata-service.md?tabs=windows#rate-limiting).|
| 400 | Request body is larger than MaxBodyLength: … | The error code indicates a request larger than the MaxBodyLength. </br> For more information on body length, see [How to retrieve load balancer metadata using the Azure Instance Metadata Service (IMDS)](howto-load-balancer-imds.md#sample-request-and-response).|
| 400 | Parameter key length is larger than MaxParameterKeyLength: … | The error code indicates a parameter key length larger than the MaxParameterKeyLength. </br> For more information on body length, see [How to retrieve load balancer metadata using the Azure Instance Metadata Service (IMDS)](howto-load-balancer-imds.md#sample-request-and-response). |
| 400 | Parameter value length is larger than MaxParameterValueLength: … | The error code indicates a parameter key length larger than the MaxParameterValueLength. </br> For more information on value length, see [How to retrieve load balancer metadata using the Azure Instance Metadata Service (IMDS)](howto-load-balancer-imds.md#sample-request-and-response).|
| 400 | Parameter header value length is larger than MaxHeaderValueLength: … | The error code indicates a parameter header value length larger than the MaxHeaderValueLength. </br> For more information on value length, see [How to retrieve load balancer metadata using the Azure Instance Metadata Service (IMDS)](howto-load-balancer-imds.md#sample-request-and-response).|
| 404 | Load Balancer metadata API is not available right now. Please retry later | The error code indicates the API could be provisioning. Try your request later. |
| 404 | /metadata/loadbalancer is not currently available | The error code indicates the API is in the progress of enablement. Try your request later. |
| 503 | Internal service unavailable. Please retry later  | The error code indicates the API is temporarily unavailable. Try your request later. |
|  |  |

## Next steps

Learn more about [Azure Instance Metadata Service](../virtual-machines/windows/instance-metadata-service.md)

