---
title: Partitioned DNS for Azure Event Hubs and Azure Service Bus
description: Learn how Azure Event Hubs and Azure Service Bus namespaces are moving to partitioned DNS zones, how the legacy FQDN is deprecated, and what to change for private endpoints.
ms.date: 08/12/2026
ms.topic: concept-article
---

# Partitioned DNS for Azure Event Hubs and Azure Service Bus

Azure Event Hubs and Azure Service Bus are deprecating their dependency on a single shared legacy DNS zone (e.g. `servicebus.windows.net` for Azure Public Cloud) in favor of a set of **partitioned, service-specific DNS zones** (e.g. `eventhubs.azure.net` and `servicebus.azure.net` for Azure Public Cloud).

The legacy DNS zone contains DNS records for Event Hubs, Relay, and Service Bus. Migration to Partitioned DNS and deprecation of legacy DNS pertain to Event Hubs and Service Bus only.

This deprecation is a potentially breaking change to services that depend on newly created namespaces. This article explains the required actions to ensure resilience against deprecation.

## Partitioned FQDN

| Service | Legacy FQDN | Partitioned FQDN |
|---|---|---|
| **Event Hubs** | `<namespace>.servicebus.windows.net` | `<namespace>.z<N>.eventhubs.azure.net` |
| **Service Bus** | `<namespace>.servicebus.windows.net` | `<namespace>.z<N>.servicebus.azure.net` |

In both patterns, `<namespace>` is the name of the Event Hubs or Service Bus namespace, and `z<N>` is a partition label where `<N>` is a number assigned deterministically from the resource name. You do not choose it and it does not change.

## Deprecation of the legacy FQDN

Existing namespaces continue to support the legacy FQDN until they are deleted and are scheduled to also resolve on the partitioned FQDN.

New namespaces are scheduled to support only the partitioned FQDN. This introduces a risk of breaking change to services that depend on namespaces that are newly created.

For example:

- Services using connection strings that are hardcoded instead of read from resource APIs likely use the deprecated legacy FQDN.

- Services accessing namespaces via private endpoints require a new private DNS zone.

### Deprecation schedule

Event Hubs and Service Bus is scheduled to automatically transition to this deprecation in the following order of steps.

1. **Dual Provisioning of DNS records**: All namespaces, existing and new, support both the partitioned FQDN and the legacy FQDN. Legacy DNS records have a backfilled equivalent record in the partitioned DNS zone.

1. [GET private link resources API returns partitioned private DNS zone](#get-private-link-resources-api-returns-partitioned-private-dns-zone). This step is to advertise the new resource dependency for new namespaces on private endpoints when the legacy FQDN is deprecated. If your service accesses newly created namespaces via private endpoints, [configure the partitioned private DNS zone](#configure-the-partitioned-private-dns-zone).

1. [Private endpoint resources are backfilled with partitioned FQDN](#private-endpoint-resources-are-backfilled-with-partitioned-fqdn). As a consequence, API responses on these resources contain the partitioned FQDN.
Ensure that your service is resilient against additional values in the resource API response.

1. [New namespaces return the partitioned FQDN in resource APIs](#new-namespaces-return-the-partitioned-fqdn-in-resource-apis).

1. **Default Dual Provisioning, Optional Partitioned FQDN Only**: All new namespaces by default support both the partitioned FQDN and the legacy FQDN. In this default provisioning mode, an [Azure Feature Exposure Control (AFEC)](../azure-resource-manager/management/preview-features.md) feature named `PartitionedDns` explicitly overrides the default to provision only the partitioned FQDN. [Register the AFEC feature](#register-the-afec-feature) to test that your workload is compatible with deprecation of the legacy FQDN on a new namespace.

1. **Default Partitioned FQDN Only, Optional Dual Provisioning**: All new namespaces by default support only the partitioned FQDN. In this default provisioning mode, an AFEC feature named `LegacyDns` explicitly overrides the default to provision both the partitioned FQDN and the legacy FQDN. [Register the AFEC feature](#register-the-afec-feature) to mitigate a breaking change while a dependent service still requires the legacy FQDN.

1. **Strict Partitioned FQDN Only**: All new namespaces support only the partitioned FQDN, and the AFEC overrides are no longer honored.

## Register the AFEC feature

To register and unregister AFEC features that override default DNS provisioning, follow this document on [Azure Feature Exposure Control (AFEC)](../azure-resource-manager/management/preview-features.md) and register for the Resource Provider namespace `Microsoft.EventHub` or `Microsoft.ServiceBus`.

If both `PartitionedDns` and `LegacyDns` are registered, `LegacyDns` takes precedence.

## New namespaces return the partitioned FQDN in resource APIs

All new namespaces are scheduled to return the partitioned FQDN in resource APIs from Event Hubs and Service Bus.

If your service accesses a namespace via private endpoint, [configure the partitioned private DNS zone](#configure-the-partitioned-private-dns-zone) before this change.

Optionally, [Register the AFEC feature](#register-the-afec-feature) named `LegacyDns` to revert to the legacy FQDN in API responses.

### Event Hubs and Service Bus namespaces

The property `properties.serviceBusEndpoint` in [Event Hubs - Namespaces - Get](/rest/api/eventhub/namespaces/get) and [Service Bus - Namespaces - Get](/rest/api/servicebus/controlplane/namespaces/get) is scheduled to contain the partitioned FQDN instead of the legacy FQDN.

For example:

```json
"serviceBusEndpoint": "https://<namespace>.z<N>.eventhubs.azure.net:443/"
```

instead of

```json
"serviceBusEndpoint": "https://<namespace>.servicebus.windows.net:443/"
```

where `<namespace>` is the namespace name and `z<N>` is the partition label.

### List keys

The connection strings returned by [Event Hubs - Namespaces - List Keys](/rest/api/eventhub/namespaces/list-keys) and [Service Bus - Namespaces - List Keys](/rest/api/servicebus/controlplane/namespaces/list-keys) are scheduled to contain the partitioned FQDN.

For example:

```
Endpoint=sb://<namespace>.z<N>.eventhubs.azure.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=<SharedAccessKey>
```

instead of

```
Endpoint=sb://<namespace>.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=<SharedAccessKey>
```

## Private endpoints

### GET private link resources API returns partitioned private DNS zone

The property `requiredZoneNames` in [GET private link resources](/rest/api/eventhub/private-link-resources/get) API is scheduled to include a newly required private DNS zone name for the partitioned FQDN.

This is to advertise the new resource dependency for new namespaces on private endpoints when the legacy FQDN is deprecated.

For example:

```json
  "requiredZoneNames": [
    "privatelink.servicebus.windows.net",
    "privatelink.eventhubs.azure.net"
  ]
```

instead of

```json
  "requiredZoneNames": [
    "privatelink.servicebus.windows.net"
  ]
```

In the preceding example, `privatelink.servicebus.windows.net` is the legacy private DNS zone and `privatelink.eventhubs.azure.net` is the partitioned private DNS zone.

When new namespaces no longer support the legacy FQDN, they require only the partitioned private DNS zone (and not the legacy private DNS zone).

### Configure the partitioned private DNS zone

[Configure a new required private DNS zone](../private-link/private-endpoint-dns-integration.md) for new namespaces before the service reaches the deprecation step where [control plane APIs return the partitioned FQDN](#new-namespaces-return-the-partitioned-fqdn-in-resource-apis); otherwise, a dependent service using the partitioned FQDN returned by the API fails to resolve to the private IP address of the private endpoint.

The new required private DNS zone name is formatted like this: `privatelink.<partitioned-parent-domain>` where `<partitioned-parent-domain>` is the domain suffix of a partitioned FQDN after the partition label.

For example, for a namespace having partitioned FQDN `<namespace>.z<N>.eventhubs.azure.net` for Event Hubs (or `<namespace>.z<N>.servicebus.azure.net` for Service Bus), its required private DNS zone name is `privatelink.eventhubs.azure.net` (or `privatelink.servicebus.azure.net` for Service Bus).

### Private endpoint resources are backfilled with partitioned FQDN

For all Event Hubs and Service Bus namespaces, existing and new, [accessed via private endpoints](private-link-service.md) all Microsoft.Network resources that configure the private endpoint are scheduled to be backfilled to include the partitioned FQDN, in addition to the legacy FQDN.

As a consequence, API responses on these resources contain the partitioned FQDN.
Ensure that your service is resilient against additional values in the resource API response.

For example, array property `fqdns` in [Network interfaces](/rest/api/virtualnetwork/network-interfaces/get#networkinterfaceipconfigurationprivatelinkconnectionproperties) is scheduled to contain an additional item.

## Related content

- [Allow access to Azure Event Hubs namespaces via private endpoints](private-link-service.md)
- [Allow access to Azure Service Bus namespaces via private endpoints](../service-bus-messaging/private-link-service.md)
- [Azure Private Endpoint private DNS zone values](../private-link/private-endpoint-dns.md)
- [Set up preview features in an Azure subscription](../azure-resource-manager/management/preview-features.md)
