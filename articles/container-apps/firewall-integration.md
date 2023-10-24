---
title: Securing a custom VNET in Azure Container Apps
description: Firewall settings to secure a custom VNET in Azure Container Apps
services: container-apps
author: CaryChai
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic:  reference
ms.date: 08/29/2023
ms.author: cachai
---

# Securing a custom VNET in Azure Container Apps  with Network Security Groups

Network Security Groups (NSGs) needed to configure virtual networks closely resemble the settings required by Kubernetes.

You can lock down a network via NSGs with more restrictive rules than the default NSG rules to control all inbound and outbound traffic for the Container Apps environment at the subscription level.

In the workload profiles environment, user-defined routes (UDRs) and securing outbound traffic with a firewall are supported. When using an external workload profiles environment, inbound traffic to Container Apps that use external ingress routes through the public IP that exists in the [managed resource group](./networking.md#workload-profiles-environment-1) rather than through your subnet. This means that locking down inbound traffic via NSG or Firewall on an external workload profiles environment is not supported. For more information, see [Networking in Azure Container Apps environments](./networking.md#user-defined-routes-udr).

In the Consumption only environment, custom user-defined routes (UDRs) and ExpressRoutes aren't supported.

## NSG allow rules

The following tables describe how to configure a collection of NSG allow rules. The specific rules required will depend on your [environment type](add link).
>[!NOTE]
> The subnet associated with a Container App Environment on the Consumption only environment requires a CIDR prefix of `/23` or larger. On the workload profiles environment, a `/27` or larger is required.

### Workload Profile Environments

The following rules are required when using NSGs with workload profile environments.

#### Inbound

>[!Note]
> Inbound NSG rules only apply for traffic going through your virtual network. If your container apps are set to accept traffic from the public internet, incoming traffic will go through the public endpoint instead of the virtual network.

| Protocol | Source | Source Ports | Destination | Destination Ports | Description |
|--|--|--|--|--|--|
| TCP | Your Client IP | \* | Azure Container Apps Environment `staticIP` | 443 | This is the staticIP used by the load balancer for Azure Container Apps. |
| TCP | AzureLoadBalancer | \* | Infrastructure Subnet address space | 30,000-32,676* | Allow communication between IPs in the infrastructure subnet. This address is passed as a parameter when you create an environment. For example, `10.0.0.0/21`. | 
| TCP | Your Client IP | \* | Infrastructure Subnet address space | 30,000-32,676* | Allow communication between IPs in the infrastructure subnet. This address is passed as a parameter when you create an environment. For example, `10.0.0.0/21`. | 

* The full range is required when creating your Azure Container Apps as a port within the range will by dynamically allocated on create. Once created, the required ports will be 2 static values, and you can update your NSG rules to reflect this once created.

#### Outbound

>[!Note]
> If you are using Azure Container Registry (ACR) with NSGs configured on your virtual network, create a private endpoint on your ACR to allow Container Apps to pull images through the virtual network.

| Protocol | Source | Source Ports | Destination | Destination Ports | Description |
|--|--|--|--|--|--|
| TCP | Infrastructure Subnet address space | \* | `AzureMonitor` | `443` | Allows outbound calls to Azure Monitor. |
| TCP | Infrastructure Subnet address space | \* | `MicrosoftContainerRegistry` | `443` | This is the service tag for container registry for microsoft containers. |
| TCP | Infrastructure Subnet address space | \* | `AzureFrontDoor.FirstParty` | `443` | This is a dependency of the `MicrosoftContainerRegistry` service tag. |
| TCP | Infrastructure Subnet address space | \* | `AzureCloud` | `443` | Allowing all outbound on port `443` provides a way to allow all FQDN based outbound dependencies that don't have a static IP. | 
| UDP | Infrastructure Subnet address space | \* | \* | `123` | NTP server. |
| Any | Infrastructure Subnet address space | \* | Infrastructure subnet address space | \* |  Allow communication between IPs in the infrastructure subnet. This address is passed as a parameter when you create an environment. For example, `10.0.0.0/21`. |

#### Consumption only environments

The following rules are required when using NSGs with Consumption only environments.

#### Inbound

>[!Note]
> Inbound NSG rules only apply for traffic going through your virtual network. If your container apps are set to accept traffic from the public internet, incoming traffic will go through the public endpoint instead of the virtual network.

| Protocol | Source | Source Ports | Destination | Destination Ports | Description |
|--|--|--|--|--|--|
| TCP | Your Client IP | \* | Azure Container Apps Environment `staticIP` | 443 | This is the staticIP used by the load balancer for Azure Container Apps. |
| TCP | AzureLoadBalancer | \* | Infrastructure Subnet | 30,000-32,676* | Allow communication between IPs in the infrastructure subnet. This address is passed as a parameter when you create an environment. For example, `10.0.0.0/21`. |

* The full range is required when creating your Azure Container Apps as a port within the range will by dynamically allocated on create. Once created, the required ports will be 2 static values, and you can update your NSG rules to reflect this once created.

#### Outbound

>[!Note]
> If you are using Azure Container Registry (ACR) with NSGs configured on your virtual network, create a private endpoint on your ACR to allow Container Apps to pull images through the virtual network.

| Protocol | Source | Source Ports | Destination | Destination Ports | Description |
|--|--|--|--|--|--|
| UDP | Infrastructure Subnet address space | \* | `AzureCloud.<REGION>` | `1194` | Required for internal AKS secure connection between underlying nodes and control plane. Replace `<REGION>` with the region where your container app is deployed. |
| TCP | Infrastructure Subnet address space | \* | `AzureCloud.<REGION>` | `9000` | Required for internal AKS secure connection between underlying nodes and control plane. Replace `<REGION>` with the region where your container app is deployed. |
| TCP | Infrastructure Subnet address space | \* | `AzureMonitor` | `443` | Allows outbound calls to Azure Monitor. |
| TCP | Infrastructure Subnet address space | \* | `AzureCloud` | `443` | Allowing all outbound on port `443` provides a way to allow all FQDN based outbound dependencies that don't have a static IP. | 
| UDP | Infrastructure Subnet address space | \* | \* | `123` | NTP server. |
| TCP | Infrastructure Subnet address space | \* | `5671` | Container Apps control plane. |
| TCP | Infrastructure Subnet address space | \* | `5672` | Container Apps control plane. |
| Any | Infrastructure Subnet address space | \* | Infrastructure subnet address space | \* |  Allow communication between IPs in the infrastructure subnet. This address is passed as a parameter when you create an environment. For example, `10.0.0.0/21`. |

#### Considerations

- If you're running HTTP servers, you might need to add ports `80` and `443`.
- Adding deny rules for some ports and protocols with lower priority than `65000` may cause service interruption and unexpected behavior.
- Don't explicitly deny the Azure DNS address `168.63.128.16` in the outgoing NSG rules, or your Container Apps environment won't be able to function.
