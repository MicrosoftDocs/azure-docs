---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 03/09/2023
ms.author: danlep
---

With a private endpoint and Private Link, you can:

- Create multiple Private Link connections to an API Management instance. 

- Use the private endpoint to send inbound traffic on a secure connection. 

- Use policy to distinguish traffic that comes from the private endpoint. 

- Limit incoming traffic only to private endpoints, preventing data exfiltration.

> [!IMPORTANT]
> * You can only configure a private endpoint connection for **inbound** traffic to the API Management instance. Currently, outbound traffic isn't supported. 
> 
>   You can use the external or internal [virtual network](/azure/api-management/virtual-network-concepts) model to establish outbound connectivity to private endpoints from your API Management instance.
> * To enable private endpoints, the API Management instance can't already be configured with an external or internal [virtual network](../articles/api-management/virtual-network-concepts.md).  
