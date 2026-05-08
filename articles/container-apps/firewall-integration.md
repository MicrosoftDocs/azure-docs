---
title: Securing a Virtual Network in Azure Container Apps
description: Learn about network security group (NSG) rules that help secure a virtual network in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: reference
ms.date: 04/01/2026
ms.author: cshoe
---

# Network security groups for configuring a virtual network in Azure Container Apps

Network security groups (NSGs) that you need for configuring virtual networks closely resemble the settings that Kubernetes requires.

You can help secure a network via NSGs with more restrictive rules than the default NSG rules to control all inbound and outbound traffic for the Azure Container Apps environment at the subscription level.

In the workload profile environment, user-defined routes (UDRs) and [securing outbound traffic with a firewall](./use-azure-firewall.md) are supported. For a guide on how to set up a UDR for Container Apps to restrict outbound traffic with Azure Firewall, see [Control outbound traffic in Azure Container Apps with user-defined routes](user-defined-routes.md).

When you use an external workload profile environment, inbound traffic to Container Apps routes through the public IP that exists in the [managed resource group](./networking.md#ports-and-ip-addresses) rather than through your subnet. This limitation means that locking down inbound traffic via NSG or firewall on an external workload profile environment isn't supported.

In the legacy Consumption-only environment, Azure ExpressRoute isn't supported, and custom user-defined routes (UDRs) have limited support. For more information on the level of UDR support available in a Consumption-only environment, see the [FAQ](faq.yml#do-consumption-only-environments-support-custom-user-defined-routes-).

## NSG allow rules

The following tables describe how to configure a collection of NSG allow rules. The specific rules that you need depend on your [environment type](./environment.md#types).

### Inbound

# [Workload profile environment](#tab/workload-profiles)

> [!NOTE]
> When you use workload profiles, inbound NSG rules apply only to traffic that goes through your virtual network. If you set your container apps to accept traffic from the public internet, incoming traffic goes through the public endpoint instead of the virtual network.

| Protocol | Source | Source ports | Destination | Destination ports | Description |
| --- | --- | --- | --- | --- | --- |
| TCP | Your client IPs | \* | Your container app's subnet<sup>1</sup> | `80`, `31080` | Allow your client IPs to access Container Apps when you're using HTTP. `31080` is the port on which the Container Apps environment edge proxy responds to the HTTP traffic. It's behind the internal load balancer. |
| TCP | Your client IPs | \* | Your container app's subnet<sup>1</sup> | `443`, `31443` | Allow your client IPs to access Container Apps when you're using HTTPS. `31443` is the port on which the Container Apps environment edge proxy responds to the HTTPS traffic. It's behind the internal load balancer. |
| TCP | Azure Load Balancer | \* | Your container app's subnet | `30000-32767`<sup>2</sup> | Allow Azure Load Balancer to probe backend pools. |
| TCP | Your client IPs | \* | Your container app's subnet | Exposed ports and `30000-32767`<sup>2</sup> | This rule applies only to TCP apps. It isn't required for HTTP apps. |

# [Consumption-only environment](#tab/consumption-only)

| Protocol | Source | Source ports | Destination | Destination ports | Description |
| --- | --- | --- | --- | --- | --- |
| TCP | Your client IPs | \* | Your container app's subnet<sup>1</sup> | `80`, `443` | Allow your client IPs to access Container Apps. Use port `80` for HTTP and `443` for HTTPS. |
| TCP | Your client IPs | \* | The `staticIP` value of your Container Apps environment | `80`, `443` | Allow your client IPs to access Container Apps. Use port `80` for HTTP and `443` for HTTPS. |
| TCP | Azure Load Balancer | \* | Your container app's subnet | `30000-32767`<sup>2</sup> | Allow Azure Load Balancer to probe backend pools. |
| TCP | Your container app's subnet | \* | Your container app's subnet | \* | This rule is required to allow the container app Envoy sidecar to connect to the Envoy service. |

---

<sup>1</sup> You pass this address as a parameter when you create an environment. For example, `10.0.0.0/21`.

<sup>2</sup> You need the full range when creating your container apps as a port within the range is dynamically allocated. After you create the container apps, the required ports are two immutable, static values, and you can update your NSG rules.

### Outbound

# [Workload profile environment](#tab/workload-profiles)

| Protocol | Source | Source ports | Destination | Destination ports | Description |
| --- | --- | --- | --- | --- | --- |
| TCP | Your container app's subnet | \* | `MicrosoftContainerRegistry` | `443` | This service tag represents Microsoft Artifact Registry for system containers. |
| TCP | Your container app's subnet | \* | `AzureFrontDoor.FirstParty` | `443` | This service tag is a dependency of the `MicrosoftContainerRegistry` service tag. |
| Any | Your container app's subnet | \* | Your container app's subnet | \* | This rule allows communication between IPs in your container app's subnet. |
| TCP | Your container app's subnet | \* | `AzureActiveDirectory` | `443` | If you're using a managed identity, it's required. |
| TCP | Your container app's subnet | \* | `AzureMonitor` | `443` | This rule is required only when you're using Azure Monitor. It allows outbound calls to Azure Monitor. |
| TCP and UDP | Your container app's subnet | \* | `168.63.129.16` | `53` | This rule enables the environment to use Azure DNS to resolve the host name. <br><br>DNS communication to Azure DNS isn't subject to NSGs unless it's targeted via the `AzurePlatformDNS` service tag. To block DNS traffic, create an outbound rule to deny traffic to the `AzurePlatformDNS` service tag. |
| TCP | Your container app's subnet<sup>1</sup> | \* | Your container registry | Your container registry's port | This rule is required to communicate with your container registry. For example, when you're using Azure Container Registry, you need `AzureContainerRegistry` and `AzureActiveDirectory` for the destination. The port is your container registry's port unless you're using private endpoints.<sup>2</sup> |
| TCP | Your container app's subnet | \* | `Storage.<Region>` | `443` | This rule is required only when you're using Container Registry to host your images. |

# [Consumption-only environment](#tab/consumption-only)

> [!NOTE]
> When you use Consumption-only environments, your container app also needs all [outbound ports that Azure Kubernetes Service (AKS) requires](/azure/aks/outbound-rules-control-egress#required-outbound-network-rules-and-fqdns-for-aks-clusters).

| Protocol | Source | Source ports | Destination | Destination ports | Description |
| --- | --- | --- | --- | --- | --- |
| TCP | Your container app's subnet | \* | `MicrosoftContainerRegistry` | `443` | This service tag represents Microsoft Artifact Registry for system containers. |
| TCP | Your container app's subnet | \* | `AzureFrontDoor.FirstParty` | `443` | This service tag is a dependency of the `MicrosoftContainerRegistry` service tag. |
| UDP | Your container app's subnet | \* | `AzureCloud.<REGION>` | `1194` | This rule is required for an internal AKS secure connection between underlying nodes and the control plane. Replace `<REGION>` with the region where your container app is deployed. |
| TCP | Your container app's subnet | \* | `AzureCloud.<REGION>` | `9000` | This rule is required for an internal AKS secure connection between underlying nodes and the control plane. Replace `<REGION>` with the region where your container app is deployed. |
| TCP | Your container app's subnet | \* | `AzureCloud` | `443` | Allowing all outbound on port `443` provides a way to allow all FQDN-based outbound dependencies that don't have a static IP. |
| TCP | Your container app's subnet | \* | `EventHub.<REGION>` | `5671`, `5672` | This rule is required for internal diagnostics logging in consumption-only environments. Replace `<REGION>` with the region where your container app is deployed. |
| UDP | Your container app's subnet | \* | \* | `123` | This rule is for the Network Time Protocol (NTP) server. |
| Any | Your container app's subnet | \* | Your container app's subnet | \* | This rule allows communication between IPs in your container app's subnet. |
| TCP and UDP | Your container app's subnet | \* | `168.63.129.16` | `53` | This rule enables the environment to use Azure DNS to resolve the host name. <br><br>DNS communication to Azure DNS isn't subject to NSGs unless it's targeted via the `AzurePlatformDNS` service tag. To block DNS traffic, create an outbound rule to deny traffic to the `AzurePlatformDNS` service tag. |
| TCP | Your container app's subnet<sup>1</sup> | \* | Your container registry | Your container registry's port | This rule is required to communicate with your container registry. For example, when you're using Azure Container Registry, you need `AzureContainerRegistry` and `AzureActiveDirectory` for the destination. The port is your container registry's port unless you're using private endpoints.<sup>2</sup> |
| TCP | Your container app's subnet | \* | `Storage.<Region>` | `443` | This rule is required only when you're using Container Registry to host your images. |
| TCP | Your container app's subnet | \* | `AzureMonitor` | `443` | This rule is required only when you're using Azure Monitor. It allows outbound calls to Azure Monitor. |

---

<sup>1</sup> You pass this address as a parameter when you create an environment. For example, `10.0.0.0/21`.

<sup>2</sup> If you're using Container Registry with NSGs configured on your virtual network, create a private endpoint on your container registry to allow Container Apps to pull images through the virtual network. You don't need to add an NSG rule for Container Registry when it's configured with private endpoints.

## Considerations

- If you're running HTTP servers, you might need to add ports `80` and `443`.
- Don't explicitly deny the Azure DNS address `168.63.129.16` in the outgoing NSG rules. If you do, your Container Apps environment doesn't function.

## Related content

- [Use a private endpoint with an Azure Container Apps environment](how-to-use-private-endpoint.md)
