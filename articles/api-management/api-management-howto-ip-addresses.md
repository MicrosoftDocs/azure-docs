---
title: IP addresses of Azure API Management service | Microsoft Docs
description: Learn how to retrieve the IP addresses of an Azure API Management service and when they change.
services: api-management
documentationcenter: ''
author: mikebudzynski
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/29/2019
ms.author: apimpm
---

# IP addresses of Azure API Management

In this article we describe how to retrieve the IP address of your Azure API Management service instance. The IP address can be public or private if your service is in a virtual network.

You can use IP address to create firewall rules, filter the incoming traffic to the backend services, or restrict the outbound traffic.

## IP addresses of API Management service

If your API Management service is Developer, Basic, Standard, or Premium tier service, you can retrieve the IP address from the overview dashboard of your resource in the Azure portal.

![API Management IP address](media/api-management-howto-ip-addresses/public-ip.png)

You can also fetch it programmatically with the following API call:

```
GET https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.ApiManagement/service/<service-name>?api-version=<api-version>
```

Public IP addresses will be part of the response:

```json
{
  ...
  "properties": {
    ...
    "publicIPAddresses": [
      "13.77.143.53"
    ],
    ...
  }
  ...
}
```

If your API Management service is inside a virtual network, it will have two types of IP addresses - public and private. You will see both types of addresses in the Azure portal and in the response of the API call:

![API Management in VNET IP address](media/api-management-howto-ip-addresses/vnet-ip.png)


```json
GET https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.ApiManagement/service/<service-name>?api-version=<api-version>

{
  ...
  "properties": {
    ...
    "publicIPAddresses": [
      "13.85.20.170"
    ],
    "privateIPAddresses": [
      "192.168.1.5"
    ],
    ...
  },
  ...
}
```

For [multi-regional deployments](api-management-howto-deploy-multi-region.md), each regional deployment has one public IP address.

## IP addresses of Consumption tier API Management service

If your API Management service is Consumption tier service, it doesn't have a dedicated IP address. It runs on a shared infrastructure and the IP address is not deterministic. 

For traffic restriction purposes, you can use the range of IP addresses of Azure data centers. Refer to [the Azure Functions documentation article](../azure-functions/ip-addresses#data-center-outbound-ip-addresses.md) for precise steps.

## Changes to the IP addresses

In the Developer, Basic, Standard, and Premium tiers of API Management, the public IP addresses (VIP) are static for the lifetime of the service, with a few exceptions:

* The service is deleted and then re-created.
* The service subscription is [suspended](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/subscription-lifecycle-api-reference.md#subscription-states) or [warned](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/subscription-lifecycle-api-reference.md#subscription-states) (for example, for nonpayment) and then reinstated.
* Azure Virtual Network is added or removed.

In [multi-regional deployments](api-management-howto-deploy-multi-region.md), the regional IP address changes if a region is vacated and then reinstated.
