---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/06/2020
ms.author: glenga
---
[Azure Private Endpoint](../articles/private-link/private-endpoint-overview.md) is a network interface that connects you privately and securely to a service powered by Azure Private Link. Private Endpoint uses a private IP address from your virtual network, effectively bringing the service into your virtual network.

You can use Private Endpoint for your functions hosted in the [Flex Consumption](../articles/azure-functions/flex-consumption-plan.md), [Elastic Premium](../articles/azure-functions/functions-premium-plan.md) and [Dedicated (App Service)](../articles/azure-functions/dedicated-plan.md) plans.

If you want to make calls to Private Endpoints, then you must make sure that your DNS lookups resolve to the private endpoint. You can enforce this behavior in one of the following ways: 

* Integrate with Azure DNS private zones. When your virtual network doesn't have a custom DNS server, this is done automatically.
* Manage the private endpoint in the DNS server used by your app. To manage a private endpoint, you must know the endpoint address and use an A record to reference the endpoint you're trying to reach.
* Configure your own DNS server to forward to [Azure DNS private zones](../articles/dns/private-dns-privatednszone.md).

To learn more, see [using Private Endpoints for Web Apps](../articles/app-service/networking/private-endpoint.md).
