---
title: Known issue - Inferencing | CORS error when invoking a managed online endpoint
description: Online endpoints (v2) currently don't support Cross-Origin Resource Sharing (CORS). Invoking online endpoints from a local application can result in an error.
author: s-polly
ms.author: scottpolly
ms.topic: troubleshooting  
ms.service: machine-learning
ms.subservice: core
ms.date: 08/04/2023
ms.custom: known-issue
---

# Known issue  - CORS error when invoking a managed online endpoint

Online endpoints (v2) currently don't support Cross-Origin Resource Sharing (CORS). Invoking online endpoints from a local application can result in an error.


 

[!INCLUDE [dev v2](../includes/machine-learning-dev-v2.md)]

**Status:** Open


**Problem area:** Inferencing

## Symptoms

When trying to invoke a managed online endpoint in a local application user might get the following error:

`Access to fetch at 'https://{your-endpoint-name}.{your-region}.inference.ml.azure.com/score' from origin http://{your-url} has been blocked by CORS policy: Response to preflight request doesn't pass access control check. No 'Access-control-allow-origin' header is present on the request resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with the CORS disabled.`

This error occurs because online endpoints(v2) currently don't natively support Cross-Origin Resource Sharing (CORS).

## Solutions and workarounds

We recommend that you use Azure Functions, Azure Application Gateway, or any service as an interim layer to handle CORS preflight requests.

## Next steps

- [About known issues](azureml-known-issues.md)
