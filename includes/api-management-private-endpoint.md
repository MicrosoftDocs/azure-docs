---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 03/09/2023
ms.author: danlep
---

With a private endpoint and Private Link, you can:

- Create multiple Private Link connections to an API Management instance. 

- Use the private endpoint to send inbound traffic on a secure connection. 

- Use policy to distinguish traffic that comes from the private endpoint. 

- Limit incoming traffic only to private endpoints, preventing data exfiltration.

- Combine inbound private endpoints to Standard v2 instances with outbound [virtual network integration](../articles/api-management/integrate-vnet-outbound.md) to provide end-to-end network isolation of your API Management clients and backend services.

    :::image type="content" source="../articles/api-management/media/private-endpoint/private-endpoint.png" alt-text="Diagram that shows a secure inbound connection to API Management Standard v2 using private endpoint.":::


> [!IMPORTANT]
> * You can only configure a private endpoint connection for **inbound** traffic to the API Management instance.
> 
 
