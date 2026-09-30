---
title: Traffic Manager Linked Records overview - Azure DNS
description: Learn how Traffic Manager Linked Records in Azure DNS link record sets directly to Traffic Manager profiles for integrated traffic management.
services: dns
author: asudbring
ms.service: azure-dns
ms.topic: concept-article
ms.date: 06/01/2026
ms.author: allensu
# Customer intent: "As a DNS administrator, I want to understand Traffic Manager Linked Records in Azure DNS, so that I can create Traffic Manager-backed DNS record sets that return IP addresses directly to clients without an intermediate CNAME hop."
---

# Traffic Manager Linked Records overview

Traffic Manager Linked Records is an Azure DNS feature that creates a direct, managed link between an Azure DNS record set and an Azure Traffic Manager profile. When a DNS query is resolved, Azure DNS queries the linked Traffic Manager profile and returns the appropriate IP addresses directly to the client—without an intermediate CNAME redirect to `trafficmanager.net`.

> [!IMPORTANT]
> Traffic Manager Linked Records is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## How it works

With the existing [alias record](dns-alias.md) approach, an A, AAAA, or CNAME record set can reference a Traffic Manager profile via the `targetResource` property. In that model, CNAME alias records require an extra DNS lookup—the response includes the `trafficmanager.net` FQDN, and the client must resolve that name to reach an endpoint.

Traffic Manager Linked Records use a new record set property called `trafficManagementProfile` to declare the link. When this property is set, Azure DNS resolves the Traffic Manager profile internally and returns the endpoint IP addresses (for A and AAAA records) or FQDNs (for CNAME records) directly in the DNS response. This process is known as **DNS flattening**, because Azure DNS resolves the intermediate Traffic Manager name on behalf of the client and returns the final answer directly. Integrated mode is always active for Traffic Manager Linked Records.

## Benefits

Traffic Manager Linked Records provide several advantages over alias records and traditional CNAME configurations:

- **No `trafficmanager.net` exposure** - Because Azure DNS resolves the Traffic Manager profile internally, the `trafficmanager.net` domain is never returned in the DNS response. Clients don't need firewall rules for `trafficmanager.net`—a shared domain that hosts profiles for all Azure customers. This isolation reduces your attack surface and avoids unintentionally allowing access to other customers' Traffic Manager profiles.

- **DNSSEC compatibility** - Traffic Manager Linked Records maintain the DNSSEC chain of trust. Because DNS resolution stays within Azure DNS infrastructure, there's no unsigned intermediate hop to `trafficmanager.net` that would break DNSSEC validation. This compatibility makes Traffic Manager Linked Records suitable for DNSSEC-signed zones.

- **50 linked records per profile** - Both alias records and Traffic Manager Linked Records support up to 50 links per Traffic Manager profile.

- **Zone apex support** - Traffic Manager Linked Records work at the zone apex (naked domain), where the DNS protocol doesn't allow CNAME records. You can use Traffic Manager at `contoso.com` directly.

- **Stronger type enforcement** - [Strictly Typed Profiles](../traffic-manager/traffic-manager-strictly-typed-profiles.md) ensure that endpoints always match the DNS record type, preventing misconfigurations that were possible with alias records.

## Supported record types

Traffic Manager Linked Records support the following DNS record types:

| Record type | Description | Traffic Manager endpoint requirement |
|-------------|-------------|--------------------------------------|
| **A** | Returns IPv4 addresses | All enabled endpoints must have IPv4 targets |
| **AAAA** | Returns IPv6 addresses | All enabled endpoints must have IPv6 targets |
| **CNAME** | Returns FQDNs | All enabled endpoints must have FQDN targets |

> [!NOTE]
> The record type you choose determines the endpoint type Traffic Manager must use. For more information, see [Traffic Manager endpoint types](../traffic-manager/traffic-manager-endpoint-types.md).

## Time-to-live (TTL)

Traffic Manager Linked Records always inherit their TTL from the Traffic Manager profile's DNS configuration. Azure DNS ignores any TTL value set on the DNS record set itself. As a result, DNS caching accurately reflects the Traffic Manager profile's health-monitoring behavior and failover timing.

## Strictly Typed Profiles

When you create a Traffic Manager Linked Record, Azure DNS validates with the Traffic Manager profile to confirm that the profile's endpoint configuration is compatible with the DNS record type. This process, called **Strictly Typed Profiles (STP)**, moves type validation to the Traffic Manager side, making misconfiguration much harder.

Under STP:
- A Traffic Manager profile becomes associated with a specific IP type (A-type or AAAA-type) when you create the profile. You can also configure the type field on an existing profile.
- The profile type is fixed once you set it, regardless of whether any DNS records are currently linked to the profile.
- The Traffic Manager profile enforces endpoint type consistency—only endpoints of the correct IP version can be added.

For more information, see [Strictly Typed Profiles for Azure Traffic Manager](../traffic-manager/traffic-manager-strictly-typed-profiles.md).

## Traffic Manager Linked Records vs. alias records

Both Traffic Manager Linked Records and [alias records](dns-alias.md) can reference a Traffic Manager profile. The two features serve different purposes and have different behaviors.

| Feature | Alias records (`targetResource`) | Traffic Manager Linked Records (`trafficManagementProfile`) |
|---------|----------------------------------|-------------------------------------------------------------|
| Resolution mode | CNAME hop to `trafficmanager.net` (CNAME type) or integrated (A/AAAA type) | Integrated always—IPs returned directly |
| TTL source | DNS record set value (A/AAAA); record set value (CNAME without flag) | Always from Traffic Manager profile |
| Type validation | Done by Azure DNS based on current endpoint state | Done by Traffic Manager via STP |
| Misconfiguration protection | Limited | Stronger—profile type enforced by TM |
| First-class portal experience | General alias workflow | Dedicated Traffic Manager Linked Record UI |
| Nested TM support | Not supported | Supported for all profile types |
| Per-profile record limit | 50 alias records per profile | 50 linked records per profile |
| `trafficmanager.net` visible to client | Yes (CNAME type) | Never |
| DNSSEC compatible | No (unsigned intermediate hop) | Yes (no intermediate hop) |

**Use Traffic Manager Linked Records when:**

Traffic Manager Linked Records is the recommended way to link a DNS record to a Traffic Manager profile.

- You want the cleanest, most direct DNS experience with no intermediate CNAME hop for any record type.
- You need to keep `trafficmanager.net` off the wire for security or firewall compliance.
- Your DNS zone is DNSSEC-signed and you need to maintain the chain of trust.
- You want stronger type enforcement via Strictly Typed Profiles.
- You're setting up a new Traffic Manager-backed DNS record and want to follow current best practices.

**Use alias records when:**
- You're referencing a resource other than Traffic Manager (public IP, CDN endpoint, Front Door, or zone record set).
- You have an existing alias-to-TM configuration and want to maintain backward compatibility.

## Zone apex support

Like alias records, Traffic Manager Linked Records support the DNS zone apex (also called a *naked domain* or *root domain*). The DNS protocol prevents CNAME records at the zone apex—Traffic Manager Linked Records work around this limitation by returning IP addresses directly, making it possible to use Traffic Manager at `contoso.com` rather than only at `www.contoso.com`.

## What happens when a Traffic Manager profile is deleted

Traffic Manager blocks profile deletion while Traffic Manager Linked Records still reference the profile. Remove all linked DNS records before deleting the profile. This safeguard prevents accidental DNS record breakage and ensures clean management of linked resources.

## Next steps

- [Create a Traffic Manager Linked Record using the Azure portal](tutorial-traffic-manager-linked-records-portal.md)
- [Create a Traffic Manager Linked Record using Azure CLI](tutorial-traffic-manager-linked-records-cli.md)
- [Create a Traffic Manager Linked Record using Azure PowerShell](tutorial-traffic-manager-linked-records-powershell.md)
- [Alias records overview](dns-alias.md)
- [Traffic Manager overview](../traffic-manager/traffic-manager-overview.md)
- [Strictly Typed Profiles for Azure Traffic Manager](../traffic-manager/traffic-manager-strictly-typed-profiles.md)
