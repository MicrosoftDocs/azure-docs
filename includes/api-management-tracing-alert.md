---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 05/05/2024
ms.author: danlep
---
> [!IMPORTANT]
> * API Management request tracing can no longer be enabled by setting the **Ocp-Apim-Trace** header in a request and using the value of the **Ocp-Apim-Trace-Location** header in the response to retrieve the trace.
> * To improve security, tracing is now enabled at the level of an individual API by obtaining a time-limited token using the API Management REST API, and passing the token in a request to the gateway. For details, see later in this tutorial.
> * Take care when enabling tracing, as it can expose sensitive information in the trace data. Ensure that you have appropriate security measures in place to protect the trace data.
