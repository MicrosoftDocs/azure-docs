---
title: Fallback to internet for Azure Private DNS zones (Preview)
titleSuffix: Azure DNS
description: Learn how to enable fallback to internet resolution for private DNS.
services: dns
author: greg-lindsay
ms.service: azure-dns
ms.date: 11/11/2024
ms.author: greglin
ms.topic: how-to
---

# Fallback to internet for Azure Private DNS zones (Preview)

This article shows you how to set the [ResolutionPolicy](/java/api/com.azure.resourcemanager.privatedns.models.resolutionpolicy) property in Azure Private DNS to enable fallback to internet recursion when an authoritative NXDOMAIN response is received for a Private Link zone.

> [!NOTE]
> Fallback to internet for Azure Private DNS is in PREVIEW.<br> 
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.<br>
> This DNS security policy preview is offered without a requirement to enroll in a preview.

## Problem

Azure Private Link and network isolation across different tenants can require an alternative name resolution path when Private DNS queries return an NXDOMAIN response. The NXDOMAIN response stops name resolution and affects the ability to reach Private Link-enabled resources outside a tenant's control. VM-based workarounds exist to address this issue, but these solutions increase operational complexity and are associated with security risks and higher costs.

## Solution

The **Resolution Policy** property in Azure Private DNS is a fully managed native solution. This property enables public recursion via Azure’s recursive resolver fleet when an authoritative NXDOMAIN response is received for a private link zone. Resolution policy is enabled at the virtual network link level with the **NxDomainRedirect** setting. In the Azure portal, **NxDomainRedirect** is enabled by selecting **Enable fallback to internet** in virtual network link configuration.

## Policy definition

This policy is available in api-version=2024-06-01 or higher. The following example has **resolutionPolicy** set to **NxDomainRedirect** at the **virtualNetworkLinks** resource level:

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

An NXDOMAIN (RCODE3) response means the (Private Link) queried domain name doesn't exist. This negative answer typically prevents resolvers from retrying the query until the cached negative answer expires.

When the **NxDomainRedirect** resolution policy is enabled on a virtual network link, the Azure recursive resolver retries the query. The resolver uses the public endpoint QNAME as the query label each time an NXDOMAIN response is received from PrivateEdge for that private zone scope.

This change can be seen in the CNAME chain resolution. The NXDOMAIN does not appear, making the retry process seamless.

```
C:\>nslookup remoteprivateendpoint.blob.core.windows.net
Server:  UnKnown
Address:  168.63.129.16

Non-authoritative answer:
Name:    blob.mwh20prdstr02e.store.core.windows.net
Address:  20.60.153.33
Aliases:  remoteprivateendpoint.blob.core.windows.net
          remoteprivateendpoint.privatelink.blob.core.windows.net
```

## Limitations
* This policy is only available for Private DNS zones associated to Private Link resources.
* The ResolutionPolicy parameter only accepts **Default** or **NxDomainRedirect** as possible values.

## Demonstrate fallback to internet

## Prerequisites

* A virtual machine in a virtual network
* A private endpoint with a private DNS integrated private link zone

## Next steps

* Learn how to [manage record sets and records](./private-dns-getstarted-cli.md) in your DNS zone.
