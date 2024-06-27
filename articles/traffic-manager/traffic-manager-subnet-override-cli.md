---
title: Azure Traffic Manager subnet override using Azure CLI
description: This article helps you understand the Traffic Manager subnet override feature. This feature is used to override the routing method of a Traffic Manager profile. Traffic is directed to an endpoint based upon the end-user IP address using predefined IP range to endpoint mappings.
services: traffic-manager
author: greg-lindsay
ms.topic: how-to
ms.service: traffic-manager
ms.date: 06/03/2024
ms.author: greglin
ms.custom: template-how-to, devx-track-azurecli
---

# Traffic Manager subnet override using Azure CLI

Traffic Manager subnet override allows you to alter the routing method of a profile. The addition of an override directs traffic based upon the end user's IP address with a predefined IP address range to endpoint mapping. 

## How subnet override works

When subnet overrides are added to a traffic manager profile, Traffic Manager first checks if there's a subnet override for the end user’s IP address. If one is found, the user’s DNS query ix directed to the corresponding endpoint. If a mapping is not found, Traffic Manager falls back to the profile’s original routing method. 

The IP address ranges can be specified as either CIDR ranges (for example, 1.2.3.0/24) or as address ranges (for example, 1.2.3.4-5.6.7.8). The IP ranges associated with each endpoint must be unique to that endpoint. Any overlap of IP address ranges among different endpoints causes the profile to be rejected by Traffic Manager.

There are two types of routing profiles that support subnet overrides:

* **Geographic** - If Traffic Manager finds a subnet override for the DNS query's IP address, it routes the query to the endpoint whatever the health of the endpoint is.
* **Performance** - If Traffic Manager finds a subnet override for the DNS query's IP address, it only routes the traffic to the endpoint if it's healthy. Traffic Manager falls back to the performance routing heuristic if the subnet override endpoint isn't healthy.

> [!NOTE]
> Azure Traffic Manager supports IPv6 addresses in subnet overrides for subnet profiles. This capability enables more granular control over traffic routing based on the source IP address of DNS queries, including both IPv4 and IPv6 addresses. 

## Create a Traffic Manager subnet override

To create a Traffic Manager subnet override, you can use Azure CLI to add the subnets for the override to the Traffic Manager endpoint.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Update the Traffic Manager endpoint with subnet override.
Use Azure CLI to update your endpoint with [az network traffic-manager endpoint update](/cli/azure/network/traffic-manager/endpoint#az-network-traffic-manager-endpoint-update).

```azurecli-interactive
### Add a range of IPs ###
az network traffic-manager endpoint update \
    --name MyEndpoint \
    --profile-name MyTmProfile \
    --resource-group MyResourceGroup \
    --subnets 1.2.3.4-5.6.7.8 \
    --type AzureEndpoints

### Add a subnet ###
az network traffic-manager endpoint update \
    --name MyEndpoint \
    --profile-name MyTmProfile \
    --resource-group MyResourceGroup \
    --subnets 9.10.11.0:24 \
    --type AzureEndpoints
```

You can remove the IP address ranges by running the [az network traffic-manager endpoint update](/cli/azure/network/traffic-manager/endpoint#az-network-traffic-manager-endpoint-update) with the **--remove** option.

```azurecli-interactive
az network traffic-manager endpoint update \
    --name MyEndpoint \
    --profile-name MyTmProfile \
    --resource-group MyResourceGroup \
    --remove subnets \
    --type AzureEndpoints
```

## Next Steps

Learn more about Traffic Manager [traffic routing methods](traffic-manager-routing-methods.md).

Learn about the [Subnet traffic-routing method](./traffic-manager-routing-methods.md#subnet-traffic-routing-method)
