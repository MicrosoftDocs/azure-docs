---
title: Integrate Azure Firewall with NAT Gateway V2 for zone-redundant SNAT
description: Integrate Azure Firewall with a StandardV2 NAT Gateway for zone-redundant outbound SNAT scaling. Step-by-step tutorial with Azure CLI.
author: gopikann
ms.service: azure-firewall
ms.topic: tutorial
ms.date: 03/16/2026
ms.author: gopikann
ms.custom: devx-track-azurecli
# Customer intent: As a network architect, I want to integrate Azure NAT Gateway V2 with Azure Firewall, so that I can scale SNAT ports with zone-redundant outbound connectivity.
---

# Integrate Azure Firewall with NAT Gateway V2

This tutorial shows how to deploy Azure Firewall with NAT Gateway V2 (StandardV2 SKU) for zone-redundant outbound SNAT. You also deploy a test virtual machine and Azure Bastion to verify the configuration.

Azure Firewall provides 2,496 SNAT ports per public IP address configured per backend virtual machine scale set instance (at least two instances). You can associate up to [250 public IP addresses](deploy-multi-public-ip-powershell.md). To scale and dynamically allocate outbound SNAT ports, use [Azure NAT Gateway](../nat-gateway/nat-overview.md).

## Why NAT Gateway V2?

The Standard NAT Gateway SKU doesn't support zone-redundant deployments. If you deploy a zone-redundant Azure Firewall with a Standard NAT Gateway, the NAT Gateway becomes a single point of failure during a zonal outage. **NAT Gateway V2 (StandardV2 SKU) supports zone-redundant deployments**, making it the recommended choice when integrating with a zone-redundant Azure Firewall.

For more information about NAT Gateway SKUs, see [NAT Gateway SKUs](../nat-gateway/nat-sku.md).

> [!NOTE]
> The [Scale SNAT ports with Azure NAT Gateway](integrate-with-nat-gateway.md) article covers integration with Standard NAT Gateway. This tutorial covers the StandardV2 (V2) SKU, which adds zone-redundant support.

## Traffic flow

When you associate NAT Gateway V2 with the **AzureFirewallSubnet**, inbound and outbound traffic use **different public IP addresses**:

- **Outbound traffic (SNAT)** flows through the NAT Gateway V2 public IP.
- **Inbound traffic (DNAT)** flows through the Azure Firewall's own public IP.
- **Management traffic** (health probes, metrics reporting, and platform management) uses the Azure Firewall's own public IP. The firewall still needs its own public IP even when a NAT Gateway handles outbound SNAT.

This architecture doesn't use double NAT. Azure Firewall instances send traffic to the NAT gateway by using their private IP address rather than the Azure Firewall public IP address.

| Traffic type | Public IP used |
|---|---|
| Outbound (SNAT) | NAT Gateway V2 PIP |
| Inbound (DNAT) | Azure Firewall PIP |
| Management and health probes | Azure Firewall PIP |

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network with an **AzureFirewallSubnet**, workload subnet, and **AzureBastionSubnet**.
> * Create a NAT Gateway V2 with a StandardV2 public IP and associate it with the firewall subnet.
> * Deploy an Azure Firewall and configure a firewall policy with application and network rules.
> * Create a route table to send traffic through the firewall.
> * Deploy a test VM and Azure Bastion to verify outbound SNAT uses the NAT Gateway V2 public IP.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Azure CLI version 2.78 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Create a resource group

Use [az group create](/cli/azure/group#az-group-create) to create a resource group for the deployment.

```azurecli-interactive
az group create \
  --name rg-azfw-natgwv2-test \
  --location eastus2
```

## Create the virtual network and subnets

Create a virtual network with three subnets:
- **AzureFirewallSubnet** — Required name for Azure Firewall (at least /26).
- **workload-subnet** — Hosts the test virtual machine.
- **AzureBastionSubnet** — Required name for Azure Bastion (at least /26).

Use [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) to create the virtual network with the first subnet. Then, use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) to add the remaining subnets.

```azurecli-interactive
az network vnet create \
  --resource-group rg-azfw-natgwv2-test \
  --name vnet-azfw-natgwv2 \
  --address-prefixes 10.0.0.0/16 \
  --subnet-name AzureFirewallSubnet \
  --subnet-prefixes 10.0.1.0/24 \
  --location eastus2

az network vnet subnet create \
  --resource-group rg-azfw-natgwv2-test \
  --vnet-name vnet-azfw-natgwv2 \
  --name workload-subnet \
  --address-prefixes 10.0.2.0/24

az network vnet subnet create \
  --resource-group rg-azfw-natgwv2-test \
  --vnet-name vnet-azfw-natgwv2 \
  --name AzureBastionSubnet \
  --address-prefixes 10.0.3.0/26
```

## Create the NAT Gateway V2

NAT Gateway V2 requires a **StandardV2** SKU public IP. You can't attach a Standard SKU public IP to a StandardV2 NAT Gateway.

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create the StandardV2 public IP. Then, use [az network nat gateway create](/cli/azure/network/nat/gateway#az-network-nat-gateway-create) to create the NAT Gateway.

```azurecli-interactive
az network public-ip create \
  --resource-group rg-azfw-natgwv2-test \
  --name pip-natgw-v2 \
  --sku StandardV2 \
  --allocation-method Static \
  --location eastus2

az network nat gateway create \
  --resource-group rg-azfw-natgwv2-test \
  --name natgw-v2 \
  --sku StandardV2 \
  --public-ip-addresses pip-natgw-v2 \
  --idle-timeout 4 \
  --location eastus2
```

## Associate the NAT Gateway V2 with the AzureFirewallSubnet

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to associate the NAT Gateway with the firewall subnet.

```azurecli-interactive
az network vnet subnet update \
  --resource-group rg-azfw-natgwv2-test \
  --vnet-name vnet-azfw-natgwv2 \
  --name AzureFirewallSubnet \
  --nat-gateway natgw-v2
```

## Create the Azure Firewall

The firewall needs its own public IP for management and inbound DNAT. A Standard SKU public IP is zone redundant by default, so it matches the zone redundant firewall deployment.

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create the firewall's public IP, use [az network firewall create](/cli/azure/network/firewall#az-network-firewall-create) to deploy the firewall, and use [az network firewall ip-config create](/cli/azure/network/firewall/ip-config#az-network-firewall-ip-config-create) to attach it to the virtual network.

```azurecli-interactive
az network public-ip create \
  --resource-group rg-azfw-natgwv2-test \
  --name pip-azfw \
  --sku Standard \
  --allocation-method Static \
  --location eastus2

az network firewall create \
  --resource-group rg-azfw-natgwv2-test \
  --name azfw-natgwv2-test \
  --location eastus2 \
  --sku AZFW_VNet \
  --tier Standard \
  --zones 1 2 3

az network firewall ip-config create \
  --resource-group rg-azfw-natgwv2-test \
  --firewall-name azfw-natgwv2-test \
  --name azfw-ipconfig \
  --public-ip-address pip-azfw \
  --vnet-name vnet-azfw-natgwv2
```

Use [az network firewall show](/cli/azure/network/firewall#az-network-firewall-show) to get the firewall's private IP address.

```azurecli-interactive
FIREWALL_PRIVATE_IP=$(az network firewall show \
  --resource-group rg-azfw-natgwv2-test \
  --name azfw-natgwv2-test \
  --query "ipConfigurations[0].privateIPAddress" \
  --output tsv)

echo $FIREWALL_PRIVATE_IP
```

## Create a route table

Use [az network route-table create](/cli/azure/network/route-table#az-network-route-table-create) to create a route table, use [az network route-table route create](/cli/azure/network/route-table/route#az-network-route-table-route-create) to add a default route that sends all traffic to the Azure Firewall, and use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to associate it with the workload subnet.

```azurecli-interactive
az network route-table create \
  --resource-group rg-azfw-natgwv2-test \
  --name rt-workload \
  --location eastus2

az network route-table route create \
  --resource-group rg-azfw-natgwv2-test \
  --route-table-name rt-workload \
  --name default-to-firewall \
  --address-prefix 0.0.0.0/0 \
  --next-hop-type VirtualAppliance \
  --next-hop-ip-address $FIREWALL_PRIVATE_IP

az network vnet subnet update \
  --resource-group rg-azfw-natgwv2-test \
  --vnet-name vnet-azfw-natgwv2 \
  --name workload-subnet \
  --route-table rt-workload
```

## Create a firewall policy

Create a firewall policy and associate it with Azure Firewall. Add both network rules and application rules.

> [!TIP]
> Allow web traffic (HTTP or HTTPS) by using either network rules or application rules. For web traffic, use **application rules**. Application rules provide FQDN-based filtering, TLS inspection, and URL filtering that aren't available with network rules.

Use [az network firewall policy create](/cli/azure/network/firewall/policy#az-network-firewall-policy-create) to create the policy.

```azurecli-interactive
az network firewall policy create \
  --resource-group rg-azfw-natgwv2-test \
  --name policy-azfw-natgwv2 \
  --location eastus2 \
  --sku Standard
```

Use [az network firewall policy rule-collection-group create](/cli/azure/network/firewall/policy/rule-collection-group#az-network-firewall-policy-rule-collection-group-create) to create a network rule collection group, and [add-filter-collection](/cli/azure/network/firewall/policy/rule-collection-group/collection#az-network-firewall-policy-rule-collection-group-collection-add-filter-collection) to add a rule that allows TCP and UDP traffic from the workload subnet.

```azurecli-interactive
az network firewall policy rule-collection-group create \
  --resource-group rg-azfw-natgwv2-test \
  --policy-name policy-azfw-natgwv2 \
  --name DefaultNetworkRuleCollectionGroup \
  --priority 200

az network firewall policy rule-collection-group collection add-filter-collection \
  --resource-group rg-azfw-natgwv2-test \
  --policy-name policy-azfw-natgwv2 \
  --rule-collection-group-name DefaultNetworkRuleCollectionGroup \
  --name allow-outbound \
  --collection-priority 100 \
  --action Allow \
  --rule-type NetworkRule \
  --rule-name allow-tcp-udp \
  --source-addresses "10.0.2.0/24" \
  --destination-addresses "*" \
  --ip-protocols TCP UDP \
  --destination-ports "*"
```

> [!IMPORTANT]
> These rules allow all outbound traffic for testing purposes. In production, restrict destination addresses, ports, and FQDNs to only what your workloads need.

Use [az network firewall policy rule-collection-group create](/cli/azure/network/firewall/policy/rule-collection-group#az-network-firewall-policy-rule-collection-group-create) to create an application rule collection group, and [add-filter-collection](/cli/azure/network/firewall/policy/rule-collection-group/collection#az-network-firewall-policy-rule-collection-group-collection-add-filter-collection) to add a rule that allows HTTP and HTTPS traffic.

```azurecli-interactive
az network firewall policy rule-collection-group create \
  --resource-group rg-azfw-natgwv2-test \
  --policy-name policy-azfw-natgwv2 \
  --name DefaultApplicationRuleCollectionGroup \
  --priority 300

az network firewall policy rule-collection-group collection add-filter-collection \
  --resource-group rg-azfw-natgwv2-test \
  --policy-name policy-azfw-natgwv2 \
  --rule-collection-group-name DefaultApplicationRuleCollectionGroup \
  --name allow-web \
  --collection-priority 100 \
  --action Allow \
  --rule-type ApplicationRule \
  --rule-name allow-http-https \
  --source-addresses "10.0.2.0/24" \
  --protocols Http=80 Https=443 \
  --target-fqdns "*"
```

Use [az network firewall policy show](/cli/azure/network/firewall/policy#az-network-firewall-policy-show) to get the policy ID and [az network firewall update](/cli/azure/network/firewall#az-network-firewall-update) to associate it with the firewall.

```azurecli-interactive
POLICY_ID=$(az network firewall policy show \
  --resource-group rg-azfw-natgwv2-test \
  --name policy-azfw-natgwv2 \
  --query id -o tsv)

az network firewall update \
  --resource-group rg-azfw-natgwv2-test \
  --name azfw-natgwv2-test \
  --firewall-policy "$POLICY_ID"
```

## Deploy a test virtual machine

Use [az vm create](/cli/azure/vm#az-vm-create) to deploy a Linux VM in the workload subnet with no public IP address and SSH key authentication.

```azurecli-interactive
az vm create \
  --resource-group rg-azfw-natgwv2-test \
  --name vm-test-workload \
  --image Ubuntu2404 \
  --size Standard_B2s \
  --vnet-name vnet-azfw-natgwv2 \
  --subnet workload-subnet \
  --public-ip-address "" \
  --admin-username azureuser \
  --generate-ssh-keys \
  --location eastus2
```

## Deploy Azure Bastion

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public IP and [az network bastion create](/cli/azure/network/bastion#az-network-bastion-create) to deploy Azure Bastion for connecting to the VM through the Azure portal.

```azurecli-interactive
az network public-ip create \
  --resource-group rg-azfw-natgwv2-test \
  --name pip-bastion \
  --sku Standard \
  --allocation-method Static \
  --location eastus2

az network bastion create \
  --resource-group rg-azfw-natgwv2-test \
  --name bastion-azfw-test \
  --public-ip-address pip-bastion \
  --vnet-name vnet-azfw-natgwv2 \
  --sku Standard \
  --location eastus2
```

## Verify the deployment

1. In the Azure portal, go to **vm-test-workload** > **Connect** > **Bastion**.
2. Select **SSH Private Key from Local File** as the authentication type.
3. Enter **azureuser** as the username and select your private key file.
4. After you connect, run:

    ```bash
    curl icanhazip.com
    ```

The response shows the **NAT Gateway V2 public IP address**, confirming that outbound traffic flows through Azure Firewall and exits through NAT Gateway V2.

To verify without the NAT Gateway, use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to temporarily disassociate it.

```azurecli-interactive
az network vnet subnet update \
  --resource-group rg-azfw-natgwv2-test \
  --vnet-name vnet-azfw-natgwv2 \
  --name AzureFirewallSubnet \
  --remove natGateway
```

Run `curl icanhazip.com` again. The response now shows the **Azure Firewall's own public IP**, confirming that SNAT behavior changes based on NAT Gateway association.

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to reassociate the NAT Gateway when you're done.

```azurecli-interactive
az network vnet subnet update \
  --resource-group rg-azfw-natgwv2-test \
  --vnet-name vnet-azfw-natgwv2 \
  --name AzureFirewallSubnet \
  --nat-gateway natgw-v2
```

## Clean up resources

Use [az group delete](/cli/azure/group#az-group-delete) to remove the resource group and all resources.

```azurecli-interactive
az group delete --name rg-azfw-natgwv2-test --yes --no-wait
```

## Next steps

- [Scale SNAT ports with Azure NAT Gateway (Standard SKU)](integrate-with-nat-gateway.md)
- [Design virtual networks with NAT gateway](../nat-gateway/nat-gateway-resource.md)
- [Integrate NAT gateway with Azure Firewall in a hub and spoke network](../nat-gateway/tutorial-hub-spoke-nat-firewall.md)
- [NAT Gateway SKUs](../nat-gateway/nat-sku.md)
