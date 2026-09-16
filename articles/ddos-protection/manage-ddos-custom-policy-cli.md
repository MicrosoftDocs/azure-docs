---
title: 'Create an Azure DDoS Protection custom policy using Azure CLI (preview)'
description: Learn how to create an Azure DDoS Protection custom policy with protocol-specific detection thresholds by using Azure CLI.
services: ddos-protection
author: duongau
ms.service: azure-ddos-protection
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.author: duau
ms.date: 06/25/2026
# Customer intent: As a network administrator, I want to create a DDoS Protection custom policy with Azure CLI, so that I can script protocol-specific detection thresholds.
---

# Create an Azure DDoS Protection custom policy using Azure CLI (preview)

This article describes how to use Azure CLI to create an Azure DDoS Protection custom policy. A custom policy defines protocol-specific detection thresholds that override adaptive auto-tuning. For more information, see [What is Azure DDoS Protection custom policy?](ddos-custom-policy-overview.md)

> [!IMPORTANT]
> Azure DDoS Protection custom policy is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Use the Bash environment in [Azure Cloud Shell](/azure/cloud-shell/overview), or [install the Azure CLI](/cli/azure/install-azure-cli) locally and sign in with [az login](/cli/azure/reference-index#az-login).

## Create a resource group

Use [az group create](/cli/azure/group#az-group-create) to create a resource group to hold the custom policy and load balancer resources.

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

The `--packets-per-second` value must be from 50,000 to 2,000,000. The `--traffic-type` value is one of `Tcp`, `Udp`, or `TcpSyn`. The `create` command sets a single detection rule. To tune more protocols, add rules from the policy's **Policy settings** page in the [Azure portal](manage-ddos-custom-policy-portal.md), or use an [ARM template](manage-ddos-custom-policy-template.md).

## View the custom policy

Use [az network ddos-custom-policy show](/cli/azure/network/ddos-custom-policy#az-network-ddos-custom-policy-show) to view the policy and its detection rules.

```azurecli-interactive
az network ddos-custom-policy show \
  --resource-group MyResourceGroup \
  --name MyCustomPolicy \
  --query '{name:name, state:provisioningState, rules:detectionRules[].trafficDetectionRule}'
```

## Create a Standard Load Balancer with a frontend IP

To apply the policy to traffic, associate it with a Standard Load Balancer frontend IP configuration. Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) and [az network lb create](/cli/azure/network/lb#az-network-lb-create) to create a Standard Load Balancer with a static IPv4 public IP.

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

## Associate the policy with the frontend IP

> [!NOTE]
> The `--ddos-settings` parameter on `az network lb frontend-ip` is part of the custom policy preview and isn't available in all Azure CLI versions yet. If the parameter isn't recognized, use the [Azure portal](manage-ddos-custom-policy-portal.md) to associate the policy.

Get the policy's resource ID, then use [az network lb frontend-ip update](/cli/azure/network/lb/frontend-ip#az-network-lb-frontend-ip-update) to attach the policy to the frontend IP configuration.

```azurecli-interactive
dcpId=$(az network ddos-custom-policy show \
  --resource-group MyResourceGroup \
  --name MyCustomPolicy \
  --query id --output tsv)

az network lb frontend-ip update \
  --resource-group MyResourceGroup \
  --lb-name MyLoadBalancer \
  --name MyFrontendIP \
  --ddos-settings "ddos-custom-policy={id:$dcpId}"
```

## Verify the association

Use [az network lb frontend-ip show](/cli/azure/network/lb/frontend-ip#az-network-lb-frontend-ip-show) to confirm the policy is associated with the frontend IP.

```azurecli-interactive
az network lb frontend-ip show \
  --resource-group MyResourceGroup \
  --lb-name MyLoadBalancer \
  --name MyFrontendIP \
  --query '{fip:name, dcp:ddosSettings.ddosCustomPolicy.id}'
```

## Remove the association

To return the frontend IP to adaptive auto-tuning, detach the policy by setting `ddos-custom-policy` to `null`.

```azurecli-interactive
az network lb frontend-ip update \
  --resource-group MyResourceGroup \
  --lb-name MyLoadBalancer \
  --name MyFrontendIP \
  --ddos-settings 'ddos-custom-policy=null'
```

## Clean up resources

When you no longer need the resources, delete the resource group to remove the custom policy and any other resources it contains.

```azurecli-interactive
az group delete --name MyResourceGroup
```

## Next steps

> [!div class="nextstepaction"]
> [Monitor Azure DDoS Protection](monitor-ddos-protection.md)
