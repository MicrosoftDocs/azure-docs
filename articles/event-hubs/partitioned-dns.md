---
title: Partitioned DNS for Azure Event Hubs and Azure Service Bus
description: Understand partitioned namespace endpoints, prepare applications for DNS changes, and configure private DNS for Event Hubs and Service Bus.
ms.date: 11/24/2026
ms.topic: concept-article
author: EldertGrootenboer
ms.author: egrootenboer
ms.service: azure-event-hubs
---

# Partitioned DNS for Azure Event Hubs and Azure Service Bus

Partitioned DNS uses service-specific DNS zones for Azure Event Hubs and Azure Service Bus namespace endpoints. Partitioned DNS is separate from Event Hubs event partitions and Service Bus partitioned queues, topics, or namespaces.

## Endpoint formats

The following examples apply to Azure public cloud.

| Service | Legacy fully qualified domain name (FQDN) | Partitioned FQDN |
|---|---|---|
| Event Hubs | `<namespace>.servicebus.windows.net` | `<namespace>.z<N>.eventhubs.azure.net` |
| Service Bus | `<namespace>.servicebus.windows.net` | `<namespace>.z<N>.servicebus.azure.net` |

`<namespace>` represents your namespace name. The service assigns the `z<N>` partition label. Use the endpoint returned for your namespace rather than constructing a hostname from the namespace name and a fixed suffix. Review code and configuration that construct or validate endpoint suffixes.

## DNS provisioning and compatibility

Under the planned transition, existing namespaces retain support for their legacy FQDN until they're deleted. For new namespaces, the service's defaults and any supported DNS feature registration determine which DNS records are created. Dual DNS provisioning creates both legacy and partitioned DNS records; partitioned-only provisioning creates only partitioned DNS records, with no legacy hostname ending in `servicebus.windows.net`.

Deleting and recreating a namespace applies the DNS provisioning rules in effect at that time. The recreated namespace can therefore have only a partitioned hostname even if the original namespace supported the legacy FQDN. Use the endpoint returned for the recreated namespace in your deployment and recovery automation.

## How endpoint discovery works

The DNS records available for a namespace can differ from the endpoint returned by its APIs. A namespace can have both DNS records while its APIs return the legacy endpoint. When the partitioned endpoint format is selected at namespace creation, the namespace API and List Keys connection strings contain the partitioned FQDN. When the legacy endpoint format is selected, those responses contain the legacy FQDN. Before using a returned partitioned endpoint through a private endpoint, complete the [private DNS configuration](#configure-private-dns).

### Namespace endpoint

The `properties.serviceBusEndpoint` property is returned by [Event Hubs - Namespaces - Get](/rest/api/eventhub/namespaces/get) and [Service Bus - Namespaces - Get](/rest/api/servicebus/controlplane/namespaces/get). The following JSON examples show the `serviceBusEndpoint` property. Each example shows only the relevant part of the API response.

#### [Event Hubs](#tab/event-hubs)

When an Event Hubs namespace returns a partitioned endpoint:

```json
{
  "properties": {
    "serviceBusEndpoint": "https://<namespace>.z<N>.eventhubs.azure.net:443/"
  }
}
```

#### [Service Bus](#tab/service-bus)

When a Service Bus namespace returns a partitioned endpoint:

```json
{
  "properties": {
    "serviceBusEndpoint": "https://<namespace>.z<N>.servicebus.azure.net:443/"
  }
}
```

---

When either service returns a legacy endpoint:

```json
{
  "properties": {
    "serviceBusEndpoint": "https://<namespace>.servicebus.windows.net:443/"
  }
}
```

### List Keys connection strings

[Event Hubs - Namespaces - List Keys](/rest/api/eventhub/namespaces/list-keys) and [Service Bus - Namespaces - List Keys](/rest/api/servicebus/controlplane/namespaces/list-keys) return connection strings that use the endpoint format selected for the namespace.

#### [Event Hubs](#tab/event-hubs)

When Event Hubs returns a partitioned endpoint:

```text
Endpoint=sb://<namespace>.z<N>.eventhubs.azure.net/;SharedAccessKeyName=<key-name>;SharedAccessKey=<key>
```

#### [Service Bus](#tab/service-bus)

When Service Bus returns a partitioned endpoint:

```text
Endpoint=sb://<namespace>.z<N>.servicebus.azure.net/;SharedAccessKeyName=<key-name>;SharedAccessKey=<key>
```

---

When either service returns a legacy endpoint:

```text
Endpoint=sb://<namespace>.servicebus.windows.net/;SharedAccessKeyName=<key-name>;SharedAccessKey=<key>
```

Get the actual endpoint and, if you use shared access signatures, get the appropriate connection string from your namespace. Keep connection strings and access keys out of logs and source control.

## Private endpoints

### Discover the required private DNS zones

Use [Event Hubs - Private Link Resources - Get](/rest/api/eventhub/private-link-resources/get) or [Service Bus - Private Link Resources - Get](/rest/api/servicebus/controlplane/private-link-resources/get) to inspect `properties.requiredZoneNames` for your namespace. When the API returns partitioned private DNS zone requirements, this property includes the service-specific partitioned private DNS zone. The following JSON examples show `requiredZoneNames` for a namespace that uses both DNS formats. Each example shows only the relevant part of the API response.

#### [Event Hubs](#tab/event-hubs)

```json
{
  "properties": {
    "requiredZoneNames": [
      "privatelink.servicebus.windows.net",
      "privatelink.eventhubs.azure.net"
    ]
  }
}
```

#### [Service Bus](#tab/service-bus)

```json
{
  "properties": {
    "requiredZoneNames": [
      "privatelink.servicebus.windows.net",
      "privatelink.servicebus.azure.net"
    ]
  }
}
```

---

A partitioned-only namespace requires its service-specific partitioned private DNS zone. Use the API response for your namespace to identify the required zones. This section applies only to connections that use private endpoints; namespaces accessed through public endpoints don't need this private DNS configuration.

### Configure private DNS

Configure your private DNS zones, virtual network links, and any custom DNS forwarding before applications use a partitioned endpoint. Configure these resources even if the public DNS record or private endpoint metadata already includes the partitioned FQDN.

For Azure Private DNS:

1. Inspect the namespace's required private DNS zones and the private endpoint's DNS configuration, including its FQDN and private IP address information.
1. Create the required service-specific zone: `privatelink.eventhubs.azure.net` for Event Hubs or `privatelink.servicebus.azure.net` for Service Bus.
1. Associate the required zones with the private endpoint through a private DNS zone group. Use the endpoint-provided DNS information to verify the generated records; avoid deriving record names from the example hostname.
1. Link the zones to the virtual networks that need to resolve the endpoint, or configure resolution through a linked resolver virtual network.
1. Keep the legacy zone and its records while applications still use the legacy FQDN. Verify existing zone groups and records when a new zone becomes required.

For custom DNS or on-premises applications, use the [private endpoint DNS integration guidance](../private-link/private-endpoint-dns-integration.md) to configure a DNS forwarder or Azure DNS Private Resolver with access to the linked private zones. Forward queries for the public service domain, rather than the `privatelink` zone: `eventhubs.azure.net` for Event Hubs partitioned endpoints and `servicebus.azure.net` for Service Bus partitioned endpoints. Retain forwarding for `servicebus.windows.net` while applications use legacy endpoints.

If you manage private DNS records yourself, use the FQDNs and private IP addresses supplied by the private endpoint. Keep this configuration consistent with endpoint changes.

### Verify from the client network

Run the following checks from the network where the application runs, including on-premises networks if applicable:

1. Resolve the actual partitioned namespace FQDN returned by the service or private endpoint configuration. For example, use `nslookup <actual-partitioned-fqdn>`.
1. Confirm that the final address matches the private endpoint's private IP address.
1. During coexistence, repeat the resolution check for the legacy FQDN used by existing applications.
1. Test application connectivity using its normal identity, endpoint, and network configuration.

Verify both DNS resolution and application connectivity to check authentication and network access.

### Handle additional FQDNs in API responses

Private endpoint metadata in `Microsoft.Network` resources for existing and new namespaces can include partitioned FQDNs alongside legacy FQDNs. These additions change API responses even when an application's existing endpoint remains unchanged. For example, the `fqdns` array in [network interface private link connection properties](/rest/api/virtualnetwork/network-interfaces/get#networkinterfaceipconfigurationprivatelinkconnectionproperties) can contain an additional item. Update code that assumes a fixed array length or a single FQDN. Select the endpoint relevant to your application rather than relying on array position.

## Register a DNS feature before creating a namespace

Azure Feature Exposure Control (AFEC) feature registrations apply to a subscription and resource provider. Event Hubs uses `Microsoft.EventHub`; Service Bus uses `Microsoft.ServiceBus`. Use a DNS feature override only when the service supports it for your subscription and namespace creation scenario. These features optionally override the Resource Provider's scheduled DNS provisioning default for newly created namespaces. During the dual-provisioning default stage, `PartitionedDns` selects partitioned-only provisioning. During the partitioned-only default stage, `LegacyDns` selects dual DNS provisioning. In the final strict partitioned-only stage, neither override is honored.

> [!IMPORTANT]
> Feature registrations apply when you create a namespace. Registering or unregistering a feature afterward doesn't change that namespace's DNS settings.

### Prerequisites

- Confirm eligibility and the supported feature and DNS provisioning mode for your service and test or compatibility scenario.
- Inspect your subscription's current feature registrations and confirm the effect on other namespaces created in the same subscription. If another DNS feature is already registered, confirm the supported combination before proceeding.
- Ensure that you have the applicable `Microsoft.Features/*` permissions, provided by Owner, Contributor, or a suitable custom role. For registration states, approval, and propagation guidance, see [Set up preview features in an Azure subscription](../azure-resource-manager/management/preview-features.md).
- Use an isolated test subscription where possible.

### Register the partitioned-only test feature

#### [Event Hubs](#tab/event-hubs)

Follow [Set up preview features in an Azure subscription](../azure-resource-manager/management/preview-features.md) to register the applicable DNS feature and check its registration state. After you register the feature and provider propagation is complete, create the test namespace. Review its endpoint, connection strings, and private DNS requirements, and verify application connectivity.

#### [Service Bus](#tab/service-bus)

Follow [Set up preview features in an Azure subscription](../azure-resource-manager/management/preview-features.md) to register the applicable DNS feature and check its registration state. After you register the feature and provider propagation is complete, create the test namespace. Review its endpoint, connection strings, and private DNS requirements, and verify application connectivity.

---

For compatibility testing, where `LegacyDns` is supported, register it before creating the test namespace. After testing, review your feature registrations so later namespace creation follows your intended DNS configuration.

## Next steps

- [Use private endpoints with Event Hubs](private-link-service.md)
- [Use private endpoints with Service Bus](../service-bus-messaging/private-link-service.md)
- [Configure private endpoint DNS integration](../private-link/private-endpoint-dns-integration.md)
- [Review private endpoint DNS zone values](../private-link/private-endpoint-dns.md)
- [Manage feature registrations](../azure-resource-manager/management/preview-features.md)
