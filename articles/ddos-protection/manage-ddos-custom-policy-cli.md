---
title: 'Create an Azure DDoS Protection custom policy using Azure CLI'
description: Learn how to create an Azure DDoS Protection custom policy with protocol-specific detection thresholds by using Azure CLI.
services: ddos-protection
author: duongau
ms.service: azure-ddos-protection
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.author: duau
ms.date: 10/13/2026
# Customer intent: As a network administrator, I want to create a DDoS Protection custom policy with Azure CLI, so that I can script protocol-specific detection thresholds.
---

# Create an Azure DDoS Protection custom policy by using Azure CLI

This article describes how to use Azure CLI to create an Azure DDoS Protection custom policy. A custom policy defines protocol-specific detection thresholds that override adaptive auto-tuning. For more information, see [What is Azure DDoS Protection custom policy?](ddos-custom-policy-overview.md)

Azure CLI and Azure PowerShell provide different management paths to the same custom-policy capability. For a Standard Load Balancer, this Azure CLI example configures the policy on the associated public IP address. The [Azure PowerShell example](manage-ddos-custom-policy-powershell.md) uses the load balancer's frontend IP configuration. Both tools can associate a policy directly with an instance-level public IP address.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Use the Bash environment in [Azure Cloud Shell](/azure/cloud-shell/overview), or [install the Azure CLI](/cli/azure/install-azure-cli) locally and sign in with [az login](/cli/azure/reference-index#az-login).
- To complete the association examples, use either a Standard Load Balancer with a Standard public IP address or an instance-level Standard public IP address associated with a network interface.

## Create a resource group

Use [az group create](/cli/azure/group#az-group-create) to create a resource group to hold the custom policy and example resources.

```azurecli-interactive
az group create --name MyResourceGroup --location eastus
```

## Create a custom policy

Use [az network ddos-custom-policy create](/cli/azure/network/ddos-custom-policy#az-network-ddos-custom-policy-create) to create a policy with a detection threshold rule. The following example creates a policy with one inbound TCP rule set to 1,000,000 packets per second.

```azurecli-interactive
az network ddos-custom-policy create \
  --resource-group MyResourceGroup \
  --name MyCustomPolicy \
  --location eastus \
  --detection-rule-name tcp-threshold \
  --detection-mode TrafficThreshold \
  --traffic-type Tcp \
  --packets-per-second 1000000
```

The `--packets-per-second` value must match the range for the selected `--traffic-type`:

| Traffic type | Minimum threshold (packets per second) | Maximum threshold (packets per second) |
| --- | --- | --- |
| `Tcp` | 50,000 | 2,000,000 |
| `Udp` | 20,000 | 200,000 |
| `TcpSyn` | 1,000 | 100,000 |

The `create` command sets a single detection rule. To tune more protocols, add rules from the policy's **Policy settings** page in the [Azure portal](manage-ddos-custom-policy-portal.md), or use an [ARM template](manage-ddos-custom-policy-template.md).

## View the custom policy

Use [az network ddos-custom-policy show](/cli/azure/network/ddos-custom-policy#az-network-ddos-custom-policy-show) to view the policy and its detection rules.

```azurecli-interactive
az network ddos-custom-policy show \
  --resource-group MyResourceGroup \
  --name MyCustomPolicy \
  --query '{name:name, state:provisioningState, rules:detectionRules[].trafficDetectionRule}'
```

## Associate the policy with a Load Balancer public IP

To apply the policy to traffic through a Standard Load Balancer, associate the policy with the load balancer's public IP address. The following example creates a Standard public IP address and a Standard Load Balancer that uses the address.

```azurecli-interactive
az network public-ip create \
  --resource-group MyResourceGroup \
  --name MyPublicIP \
  --sku Standard \
  --allocation-method Static \
  --version IPv4 \
  --location eastus

az network lb create \
  --resource-group MyResourceGroup \
  --name MyLoadBalancer \
  --sku Standard \
  --frontend-ip-name MyFrontendIP \
  --public-ip-address MyPublicIP \
  --location eastus
```

Get the policy's resource ID, and then use [az network public-ip update](/cli/azure/network/public-ip#az-network-public-ip-update) to associate the policy with the public IP address.

```azurecli-interactive
dcpId=$(az network ddos-custom-policy show \
  --resource-group MyResourceGroup \
  --name MyCustomPolicy \
  --query id --output tsv)

az network public-ip update \
  --resource-group MyResourceGroup \
  --name MyPublicIP \
  --ddos-custom-policy "id=$dcpId"
```

Use [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show) to verify the association and display the Load Balancer frontend configuration that uses the public IP address.

```azurecli-interactive
az network public-ip show \
  --resource-group MyResourceGroup \
  --name MyPublicIP \
  --query '{publicIp:name, policy:ddosSettings.ddosCustomPolicy.id, attachment:ipConfiguration.id}'
```

## Associate the policy with an instance-level public IP

You can also associate the custom policy with a Standard public IP address that's attached to a network interface. The following example assumes that `MyInstancePublicIP` is a Standard public IP address associated with a network interface.

```azurecli-interactive
az network public-ip update \
  --resource-group MyResourceGroup \
  --name MyInstancePublicIP \
  --ddos-custom-policy "id=$dcpId"

az network public-ip show \
  --resource-group MyResourceGroup \
  --name MyInstancePublicIP \
  --query '{publicIp:name, policy:ddosSettings.ddosCustomPolicy.id, networkInterface:ipConfiguration.id}'
```

To confirm that the custom policy references both public IP addresses, use [az network ddos-custom-policy show](/cli/azure/network/ddos-custom-policy#az-network-ddos-custom-policy-show).

```azurecli-interactive
az network ddos-custom-policy show \
  --resource-group MyResourceGroup \
  --name MyCustomPolicy \
  --query 'publicIPAddresses[].id'
```

## Remove the associations

To return the public IP addresses to adaptive auto-tuning, detach the policy by setting `--ddos-custom-policy` to `null`.

```azurecli-interactive
az network public-ip update \
  --resource-group MyResourceGroup \
  --name MyPublicIP \
  --ddos-custom-policy null

az network public-ip update \
  --resource-group MyResourceGroup \
  --name MyInstancePublicIP \
  --ddos-custom-policy null
```

## Clean up resources

First remove the policy associations, including any associations with resources outside the example resource group. When you no longer need the example resources, delete their resource group to remove the custom policy and any other resources it contains.

```azurecli-interactive
az group delete --name MyResourceGroup
```

## Next steps

> [!div class="nextstepaction"]
> [Monitor Azure DDoS Protection](monitor-ddos-protection.md)
