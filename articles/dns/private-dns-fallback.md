---
title: Fallback to Internet for Azure Private DNS zones
titleSuffix: Azure DNS
description: Learn how to enable fallback to Internet resolution for private DNS.
services: dns
author: greg-lindsay
ms.service: azure-dns
ms.date: 11/06/2024
ms.author: greglin
ms.topic: how-to
---

# Fallback to Internet for Azure Private DNS zones

Azure Private DNS Zones is a globally available, fully managed, cloud-native DNS service. It offers private name resolution in Azure, complemented by Azure Private DNS Resolver, a hybrid recursive resolver for name resolution to and from Azure. When linked to a Virtual Network, it provides authoritative responses for matching namespace queries and hosts private records for Azure Private Link endpoints.

## Problem

The growing use of Azure Private Link and network isolation across different tenants has highlighted a need for an alternative name resolution path when authoritative Private DNS returns an NXDOMAIN response, which stops name resolution if a record is not found. This affected the ability to reach Private Link-enabled resources outside a specific tenant's control. Traditional IaaS VM-based solutions to address this issue increased operational complexity, security risks, and incurred high costs.

## Solution

By introducing the "Resolution Policy" property in Azure Private DNS Zones, a fully managed native solution is now available. This allows public recursion via Azure’s recursive resolver fleet when an authoritative NXDOMAIN response is received from Private DNS Zones for Private link that have this policy enabled. This functionality, enabled at the Virtual Network link level with the NxDomainRedirect setting, simplifies operations and enhances security.

## Policy definition

In order to enable this policy customer should use api-version=2024-06-01 or higher and setup "resolutionPolicy" as "NxDomainRedirect" at the virtualNetworkLinks resource level

```
{
  "id": "'string'",
  "name": '"string'",
  "type": "Microsoft.Network/privateDnsZones/virtualNetworkLinks",
  "location": "global",
  "properties": {
    "provisioningState": "Succeeded",
    "registrationEnabled": bool,
    "resolutionPolicy": "NxDomainRedirect",
    "virtualNetwork": {
      "id": "'string'"
    }
  }
}
```

## How it works

An NXDOMAIN (RCODE3) response means the queried domain name doesn't exist. This definitive negative answer typically prevents resolvers from retrying the query until the negative caching duration (defined by the SOA record's TTL) expires.

When the NxDomainRedirect Resolution Policy is applied to a Private DNS zone, the Azure Recursive Resolver (RR) will retry the query using the public endpoint QNAME as the query label each time an NXDOMAIN response is received from PrivateEdge for that specific Private zone scope.

Customer Experience
From the customer's perspective, this adjustment should be seen in the CNAME chain resolution. However, the NXDOMAIN should not appear, making the retry process seamless for the user.

```
C:\Users\azureuser>nslookup remoteprivateendpoint.blob.core.windows.net
Server:  UnKnown
Address:  168.63.129.16

Non-authoritative answer:
Name:    blob.mwh20prdstr02e.store.core.windows.net
Address:  20.60.153.33
Aliases:  remoteprivateendpoint.blob.core.windows.net
          remoteprivateendpoint.privatelink.blob.core.windows.net
```

## Confirm Fallback to Internet is working as intended

1. In ASC, check the Virtual Network Link for the correspondent Private DNS zone. The property Policy Resolution should show NxDomainRedirect
2. You can confirm if the resolution Policy is taking effect using the following query:

Resolution: DnsServingPlaneProd

The following filters will help to determine that the Fallback to Internet policy took effect for a given query:

```
| where AliasNameChaseCount == 1
| where AliasNameChaseBitMask == 2
```
For a working example see Jarvis sample 
AliasNameChaseCount indicates the number of times that alias chasing has been done for a given query, while a values of 2 for the AliasNameChaseBitMask indicates that privatednsfallback is enabled due to the Fallback to Internet Resoltion Policy.

## Limitations
This policy is only available for Private DNS zones associated to Private Link resources
ResolutionPolicy parameter currently only accepts "Default" and "NxDomainRedirect" as possible values.

## Next steps

* Learn how to [manage record sets and records](./private-dns-getstarted-cli.md) in your DNS zone.
