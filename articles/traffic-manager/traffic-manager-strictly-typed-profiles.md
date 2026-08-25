---
title: Strictly Typed Profiles for Azure Traffic Manager
titleSuffix: Azure Traffic Manager
description: Learn how Strictly Typed Profiles in Azure Traffic Manager enforce endpoint IP type consistency for profiles linked via Traffic Manager Linked Records.
services: traffic-manager
author: asudbring
ms.service: azure-traffic-manager
ms.topic: concept-article
ms.date: 06/01/2026
ms.author: allensu
# Customer intent: "As a network administrator, I want to understand Strictly Typed Profiles in Azure Traffic Manager, so that I can correctly configure Traffic Manager profiles that are linked to Azure DNS record sets and avoid endpoint type misconfigurations."
---

# Strictly Typed Profiles for Azure Traffic Manager

**Strictly Typed Profiles (STP)** is a Traffic Manager feature that enforces IP address type consistency for Traffic Manager profiles, so DNS record sets can be linked to a profile via [Traffic Manager Linked Records](../dns/dns-traffic-manager-linked-records.md). Profile types can be set upon creation of a profile or in the configuration settings of a profile. Once the type is set, it can't be changed—preventing the type of misconfigurations that were possible with the older alias-to-Traffic Manager approach.

> [!IMPORTANT]
> Strictly Typed Profiles is currently in PREVIEW and applies only to Traffic Manager profiles linked through Traffic Manager Linked Records. Existing Traffic Manager profiles used with alias records aren't affected unless you migrate them to Traffic Manager Linked Records. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Why Strictly Typed Profiles?

With the original [alias record to Traffic Manager](../dns/dns-alias.md) approach, type validation was performed only at the time the alias record was created and had limited enforcement. Strictly Typed Profiles addresses these issues by moving type ownership and enforcement to Traffic Manager. When a Traffic Manager Linked Record is created, Traffic Manager validates the profile's endpoint configuration and enforces type consistency going forward.

## How it works

### Profile type assignment

Profile types can be set when you create a profile or in the configuration settings of an existing profile. After this association is set, Traffic Manager validates all new endpoint additions against the declared profile type and rejects endpoints of the wrong IP type.

The following table shows how the DNS record type maps to the Traffic Manager profile type:

| DNS record type | Traffic Manager profile type |
|-----------------|------------------------------|
| **A** | IPv4 (only IPv4 endpoints allowed) |
| **AAAA** | IPv6 (only IPv6 endpoints allowed) |
| **CNAME** | No type restriction (any FQDN endpoints allowed) |

> [!NOTE]
> The profile type is locked once set and can't be changed. A new profile with a different type must be created if a change is necessary.

> [!NOTE]
> Strictly Typed Profiles are available in the **2024-04-01-preview** API version. The `RecordType` property on `ProfileProperties` controls the profile type:
>
> ```json
> "recordType": {
>   "$ref": "#/definitions/RecordType",
>   "description": "when record type is set, a traffic manager profile will allow only endpoints that match this type."
> }
> ```

### Profile deletion

Traffic Manager blocks profile deletion while DNS records still reference the profile. Remove all linked DNS records before deleting the profile. This prevents DNS records from returning empty responses and ensures clean management of linked DNS records.

### Resolution

During DNS resolution, Azure DNS queries the Traffic Manager profile as part of the Traffic Manager Linked Record resolution. Because the profile's endpoints are guaranteed to be of the correct type (due to STP enforcement), Azure DNS can reliably construct A or AAAA responses from the endpoint data.

## Compatibility with alias records

Strictly Typed Profiles applies **only** to Traffic Manager profiles linked via Traffic Manager Linked Records. It does **not** affect:

- Existing alias records pointing to Traffic Manager profiles.
- The endpoint type restrictions set by the older alias-to-Traffic Manager mechanism.

If you create both an alias record and a Traffic Manager Linked Record pointing to the same Traffic Manager profile, the STP type lock is set when the Traffic Manager Linked Record is created and does not interfere with the existing alias record.

> [!NOTE]
> Microsoft recommends migrating existing alias-to-Traffic-Manager configurations to Traffic Manager Linked Records for stronger type enforcement and the integrated resolution mode. For more information, see [Traffic Manager Linked Records overview](../dns/dns-traffic-manager-linked-records.md).

## Limitations

- **CNAME Traffic Manager Linked Records** don't impose an IP type restriction. All endpoints with FQDN targets are permitted.
- **Multiple simultaneous profile type assignments are prevented.** You can't link an A record and an AAAA record to the same profile at the same time. The first linked record sets the profile type, and all subsequent linked records must use a compatible DNS record type.

## Next steps

- Learn about [Traffic Manager Linked Records](../dns/dns-traffic-manager-linked-records.md).
- Create a Traffic Manager Linked Record using the [Azure portal](../dns/tutorial-traffic-manager-linked-records-portal.md), [Azure CLI](../dns/tutorial-traffic-manager-linked-records-cli.md), or [Azure PowerShell](../dns/tutorial-traffic-manager-linked-records-powershell.md).
- Learn about [Traffic Manager endpoint types](traffic-manager-endpoint-types.md).
- Learn about [Traffic Manager routing methods](traffic-manager-routing-methods.md).
