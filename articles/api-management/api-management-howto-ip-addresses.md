---
title: IP Addresses of Azure API Management
description: Learn how to retrieve the public and private IP addresses of Azure API Management, understand when they change, and use them to configure firewall rules.
services: api-management

ms.service: azure-api-management
ms.topic: concept-article
ms.date: 09/11/2026
ms.custom:
  - fasttrack-edit
  - sfi-image-nochange

#customer intent: As an API developer, I want to learn how to retrieve the IP addresses of API Management so that I can configure firewall rules and filter traffic.
---

# IP addresses in Azure API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article describes how to retrieve the IP addresses of Azure API Management. IP addresses can be public or private if the service is in a virtual network. You can use IP addresses to create firewall rules, filter incoming traffic to backend services, or restrict outbound traffic.

## Public IP addresses

Every API Management instance in Developer, Basic, Standard, or Premium tier has public IP addresses that are exclusive to that instance. (They're not shared with other resources.)

Retrieve the IP addresses from the overview dashboard of your resource in the Azure portal:

:::image type="content" source="media/api-management-howto-ip-addresses/public-ip.png" alt-text="Screenshot that shows an IP address in API Management." lightbox="media/api-management-howto-ip-addresses/public-ip.png":::

Alternatively, fetch them programmatically by using this API call:

```http
GET https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.ApiManagement/service/<service-name>?api-version=<api-version>
```

Public IP addresses appear in the response:

```json
{
  ...
  "properties": {
    ...
    "publicIPAddresses": [
      "172.31.0.1"
    ],
    ...
  }
  ...
}
```

In [multi-regional deployments](api-management-howto-deploy-multi-region.md), each regional deployment has one public IP address.

## IP addresses of API Management in a virtual network

If your API Management instance is inside a virtual network, it has two types of IP addresses: public and private.

* Use public IP addresses for internal communication on port `3443` to manage configuration, such as through Azure Resource Manager. In the *external* virtual network configuration, also use them for runtime API traffic. In the *internal* virtual network configuration, use public IP addresses only for Azure internal management operations. They don't expose your instance to the internet.

* Use private virtual IP (VIP) addresses, available only in [internal virtual network mode](api-management-using-with-internal-vnet.md), to connect from within the network to API Management endpoints: gateways, the developer portal, and the management plane for direct API access. Use these addresses to set up DNS records within the network.

You see addresses of both types in the Azure portal and in the response of an API call:

:::image type="content" source="media/api-management-howto-ip-addresses/vnet-ip.png" alt-text="Screenshot that shows a VIP address in API Management." lightbox="media/api-management-howto-ip-addresses/vnet-ip.png":::


```http
GET https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.ApiManagement/service/<service-name>?api-version=<api-version>
```

```json
{
  ...
  "properties": {
    ...
    "publicIPAddresses": [
      "172.31.0.1"
    ],
    "privateIPAddresses": [
      "192.168.1.5"
    ],
    ...
  },
  ...
}
```

> [!IMPORTANT]
> The internal load balancer and API Management units get private IP addresses dynamically. You can't anticipate the private IP of the API Management instance before its deployment. Also, changing to a different subnet and then returning might cause a change in the private IP address.

### IP addresses for outbound traffic

API Management uses a public IP address for a connection outside the virtual network or a peered virtual network. It uses a private IP address for a connection in the virtual network or a peered virtual network.

* When you deploy API Management in an external or internal virtual network and it connects to private (intranet-facing) backends, API Management uses internal IP addresses (dynamic IP, or DIP, addresses) from the subnet for the runtime API traffic. When API Management sends a request to a private backend, a private IP address is visible as the origin of the request.

    Therefore, if IP restriction lists secure resources within the virtual network or a peered virtual network, use the whole API Management [subnet range](virtual-network-injection-resources.md#subnet-size) with an IP rule and (in internal mode) not just the private IP address associated with the API Management resource.

* When API Management sends a request to a public (internet-facing) backend, a public IP address is always visible as the origin of the request.

## IP addresses of Consumption, Basic v2, Standard v2, and Premium v2 tier API Management instances

If you create your API Management instance in a service tier that runs on a shared infrastructure, it doesn't have a dedicated IP address. Currently, instances in the following service tiers run on a shared infrastructure and without a deterministic IP address: Consumption, Basic v2, Standard v2, Premium v2.

If you need to add the outbound IP addresses that your Consumption, Basic v2, Standard v2, or Premium v2 tier instance uses to an allow list, you can add the instance's datacenter (Azure region) to an allow list. [Download a JSON file that lists IP addresses for all Azure datacenters](https://www.microsoft.com/download/details.aspx?id=56519). Then find the JSON fragment that applies to the region that your instance runs in.

For example, the following JSON fragment is what the allow list for Western Europe might look like:

```json
{
  "name": "AzureCloud.westeurope",
  "id": "AzureCloud.westeurope",
  "properties": {
    "changeNumber": 9,
    "region": "westeurope",
    "platform": "Azure",
    "systemService": "",
    "addressPrefixes": [
      "13.69.0.0/17",
      "13.73.128.0/18",
      ... Some IP addresses not shown here
     "213.199.183.0/24"
    ]
  }
}
```

For information about when this file is updated and when the IP addresses change, expand the **Details** section of the [Download Center page](https://www.microsoft.com/download/details.aspx?id=56519).

## Changes to IP addresses

In the Developer, Basic, Standard, and Premium tiers of API Management, the public IP address or addresses (VIP) and private VIP addresses (if configured in the internal virtual network mode) are static for the lifetime of a service, with the following exceptions:

* The API Management is deleted and then re-created.
* The service subscription is disabled or warned (for example, for nonpayment) and then reinstated. [Learn more about subscription states](/azure/cost-management-billing/manage/subscription-states).
* (Developer and Premium tiers) Azure Virtual Network is added to or removed from the service.
* (Developer and Premium tiers) API Management is switched between external and internal virtual network deployment mode.
* (Developer and Premium tiers) API Management is moved to a different subnet or configured with a different public IP address resource.
* (Premium tier) [Availability zones](/azure/reliability/migrate-api-mgt) are enabled, added, or removed.
* (Premium tier) In [multi-regional deployments](api-management-howto-deploy-multi-region.md), the regional IP address changes if a region is vacated and then reinstated.
    
    > [!IMPORTANT]
    > [!INCLUDE [api-management-publicip-change](../../includes/api-management-publicip-change.md)]

## Related content

- [Deploy API Management to a virtual network - external mode](api-management-using-with-vnet.md)
- [Deploy API Management to a virtual network - internal mode](api-management-using-with-internal-vnet.md)
- [Using a virtual network with Azure API Management](virtual-network-concepts.md)
