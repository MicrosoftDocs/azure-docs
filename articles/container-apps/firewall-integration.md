---
title: Securing a custom VNET in Azure Container Apps
description: Firewall settings to secure a custom VNET in Azure Container Apps
services: container-apps
author: CaryChai
ms.service: container-apps
ms.topic:  reference
ms.date: 08/29/2023
ms.author: cachai
---

# Securing a custom VNET in Azure Container Apps  with Network Security Groups

Network Security Groups (NSGs) needed to configure virtual networks closely resemble the settings required by Kubernetes.

You can lock down a network via NSGs with more restrictive rules than the default NSG rules to control all inbound and outbound traffic for the Container Apps environment at the subscription level.

In the workload profiles environment, user-defined routes (UDRs) and [securing outbound traffic with a firewall](./networking.md#configuring-udr-with-azure-firewall) are supported. When using an external workload profiles environment, inbound traffic to Azure Container Apps is routed through the public IP that exists in the [managed resource group](./networking.md#workload-profiles-environment-2) rather than through your subnet. This means that locking down inbound traffic via NSG or Firewall on an external workload profiles environment isn't supported. For more information, see [Networking in Azure Container Apps environments](./networking.md#user-defined-routes-udr).

In the Consumption only environment, custom user-defined routes (UDRs) and ExpressRoutes aren't supported.

## NSG allow rules

The following tables describe how to configure a collection of NSG allow rules. The specific rules required depend on your [environment type](./environment.md#types).

### Inbound

# [Workload profiles environment](#tab/workload-profiles)

>[!Note]
> When using workload profiles, inbound NSG rules only apply for traffic going through your virtual network. If your container apps are set to accept traffic from the public internet, incoming traffic goes through the public endpoint instead of the virtual network.

| Protocol | Source | Source ports | Destination | Destination ports | Description |
|--|--|--|--|--|--|
| TCP | Your client IPs | \* | Your container app's subnet<sup>1</sup> | `80`, `31080` | Allow your Client IPs to access Azure Container Apps when using HTTP. `31080` is the port on which the Container Apps Environment Edge Proxy responds to the HTTP traffic. It is behind the internal load balancer.  |
| TCP | Your client IPs | \* | Your container app's subnet<sup>1</sup> | `443`, `31443` | Allow your Client IPs to access Azure Container Apps when using HTTPS. `31443` is the port on which the Container Apps Environment Edge Proxy responds to the HTTPS traffic. It is behind the internal load balancer. |
| TCP | AzureLoadBalancer | \* | Your container app's subnet | `30000-32767`<sup>2</sup> | Allow Azure Load Balancer to probe backend pools. | 

# [Consumption only environment](#tab/consumption-only)

| Protocol | Source | Source ports | Destination | Destination ports | Description |
|--|--|--|--|--|--|
| TCP | Your client IPs | \* | Your container app's subnet<sup>1</sup> | `80`, `443` | Allow your Client IPs to access Azure Container Apps. Use port `80` for HTTP and `443` for HTTPS. |
| TCP | Your client IPs | \* | The `staticIP` of your container app environment | `80`, `443` | Allow your Client IPs to access Azure Container Apps. Use port `80` for HTTP and `443` for HTTPS. |
| TCP | AzureLoadBalancer | \* | Your container app's subnet | `30000-32767`<sup>2</sup> | Allow Azure Load Balancer to probe backend pools. | 
| TCP | Your container app's subnet | \* | Your container app's subnet | \* | Required to allow the container app envoy sidecar to connect to envoy service. |

---

<sup>1</sup> This address is passed as a parameter when you create an environment. For example, `10.0.0.0/21`.   
<sup>2</sup> The full range is required when creating your Azure Container Apps as a port within the range will by dynamically allocated. Once created, the required ports are two immutable, static values, and you can update your NSG rules.


### Outbound 

# [Workload profiles environment](#tab/workload-profiles)

| Protocol | Source | Source ports | Destination | Destination ports | Description |
|--|--|--|--|--|--|
| TCP | Your container app's subnet | \* | `MicrosoftContainerRegistry` | `443` | This is the service tag for Microsoft container registry for system containers. |
| TCP | Your container app's subnet | \* | `AzureFrontDoor.FirstParty` | `443` | This is a dependency of the `MicrosoftContainerRegistry` service tag. |
| Any | Your container app's subnet | \* | Your container app's subnet | \* |  Allow communication between IPs in your container app's subnet.  |
| TCP | Your container app's subnet | \* | `AzureActiveDirectory` | `443` | If you're using managed identity, this is required. | 
| TCP | Your container app's subnet | \* | `AzureMonitor` | `443` | Only required when using Azure Monitor. Allows outbound calls to Azure Monitor. |
| TCP and UDP | Your container app's subnet | \* | `168.63.129.16` | `53` | Enables the environment to use Azure DNS to resolve the hostname. |
| TCP | Your container app's subnet<sup>1</sup> | \* | Your Container Registry | Your container registry's port | This is required to communicate with your container registry. For example, when using ACR, you need `AzureContainerRegistry` and `AzureActiveDirectory` for the destination, and the port will be your container registry's port unless using private endpoints.<sup>2</sup> |
| TCP | Your container app's subnet | \* | `Storage.<Region>` | `443` | Only required when using `Azure Container Registry` to host your images. |


# [Consumption only environment](#tab/consumption-only)

>[!Note]
> When using Consumption only environments, all [outbound ports required by Azure Kubernetes Service](/azure/aks/outbound-rules-control-egress#required-outbound-network-rules-and-fqdns-for-aks-clusters) are also required for your container app.

| Protocol | Source | Source ports | Destination | Destination ports | Description |
|--|--|--|--|--|--|
| UDP | Your container app's subnet | \* | `AzureCloud.<REGION>` | `1194` | Required for internal AKS secure connection between underlying nodes and control plane. Replace `<REGION>` with the region where your container app is deployed. |
| TCP | Your container app's subnet | \* | `AzureCloud.<REGION>` | `9000` | Required for internal AKS secure connection between underlying nodes and control plane. Replace `<REGION>` with the region where your container app is deployed. |
| TCP | Your container app's subnet | \* | `AzureCloud` | `443` | Allowing all outbound on port `443` provides a way to allow all FQDN based outbound dependencies that don't have a static IP. | 
| UDP | Your container app's subnet | \* | \* | `123` | NTP server. |
| Any | Your container app's subnet | \* | Your container app's subnet | \* |  Allow communication between IPs in your container app's subnet. |
| TCP and UDP | Your container app's subnet | \* | `168.63.129.16` | `53` | Enables the environment to use Azure DNS to resolve the hostname. |
| TCP | Your container app's subnet<sup>1</sup> | \* | Your Container Registry | Your container registry's port | This is required to communicate with your container registry. For example, when using ACR, you need `AzureContainerRegistry` and `AzureActiveDirectory` for the destination, and the port will be your container registry's port unless using private endpoints.<sup>2</sup> |
| TCP | Your container app's subnet | \* | `Storage.<Region>` | `443` | Only required when using `Azure Container Registry` to host your images. |
| TCP | Your container app's subnet | \* | `AzureFrontDoor.FirstParty` | `443` | Only required when using `Azure Container Registry` to host your images. |
| TCP | Your container app's subnet | \* | `AzureMonitor` | `443` | Only required when using Azure Monitor. Allows outbound calls to Azure Monitor. |


---

<sup>1</sup> This address is passed as a parameter when you create an environment. For example, `10.0.0.0/21`.  
<sup>2</sup> If you're using Azure Container Registry (ACR) with NSGs configured on your virtual network, create a private endpoint on your ACR to allow Azure Container Apps to pull images through the virtual network. You don't need to add an NSG rule for ACR when configured with private endpoints.


#### Considerations

- If you're running HTTP servers, you might need to add ports `80` and `443`.
- Don't explicitly deny the Azure DNS address `168.63.128.16` in the outgoing NSG rules, or your Container Apps environment won't be able to function.
