---
title: Azure App Configuration network access errors
description: Reference page for network access errors when using the Azure App Configuration data plane
author: austintolani 
ms.author: austintolani
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 1/5/2026
---

# Network access errors

This article describes network access related errors that can occur when making requests to the Azure App Configuration data plane. 

## IP address rejected

When public network access is disabled for a configuration store, requests will be rejected unless they meet the criteria for inbound access.

### Error response

```http
HTTP/1.1 403 Forbidden
Content-Type: application/problem+json; charset=utf-8
```

```json
{
  "type": "https://azconfig.io/errors/ip-address-rejected",
  "title": "Access to this resource is governed by a network access policy. The client IP address fails to meet the criteria for access. See https://aka.ms/appconfig/network-access-errors for more information.",
  "status": 403
}
```

**Reason:** The configuration store has public network access disabled and the IP address that the request originates from doesn't meet the criteria for inbound access.

**Solution:** When a configuration store has public network access disabled, requests must originate from within a virtual network via a private endpoint.
- Verify that the client making the request is within a virtual network and the relevant [DNS changes](./concept-private-endpoint.md#dns-changes-for-private-endpoints) are in place to ensure the endpoint of the configuration store resolves to the IP address of the private endpoint connected to the configuration store.
- Verify that the private endpoint connection associated with the private endpoint has been approved. 

## Related documentation

- [Use private endpoints for Azure App Configuration](./concept-private-endpoint.md)
- [Set up private access in Azure App Configuration](./howto-set-up-private-access.md)
- [Disable public access in Azure App Configuration](./howto-disable-public-access.md)
- [Troubleshoot Azure Private Endpoint connectivity problems](../private-link/troubleshoot-private-endpoint-connectivity.md)
