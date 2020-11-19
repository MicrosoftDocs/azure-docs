---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/06/2020
ms.author: glenga
---
[Azure Private Endpoint](../articles/private-link/private-endpoint-overview.md) is a network interface that connects you privately and securely to a service powered by Azure Private Link.  Private Endpoint uses a private IP address from your virtual network, effectively bringing the service into your virtual network.

You can use Private Endpoint for your functions hosted in the [Premium](../articles/azure-functions/functions-premium-plan.md) and [App Service](../articles/azure-functions/dedicated-plan.md) plans.

When creating an inbound private endpoint connection for functions, you will also need a DNS record to resolve  the private address.  By default a private DNS record will be created for you when creating a private endpoint using the Azure portal.

To learn more, see [using Private Endpoints for Web Apps](../articles/app-service/networking/private-endpoint.md).