---
title: Integrate Azure Firewall with NAT Gateway V2 for zone-redundant SNAT
description: Learn how to integrate Azure Firewall with a StandardV2 NAT Gateway for zone-redundant outbound SNAT scaling. Step-by-step tutorial with Azure CLI.
services: firewall
author: gopikann
ms.service: azure-firewall
ms.topic: tutorial
ms.date: 03/16/2026
ms.author: gopikann
ms.custom: devx-track-azurecli
# Customer intent: As a network architect, I want to integrate Azure NAT Gateway V2 with Azure Firewall, so that I can scale SNAT ports with zone-redundant outbound connectivity.
---

# Integrate Azure Firewall with NAT Gateway V2

In this tutorial, you learn how to deploy an Azure Firewall integrated with a NAT Gateway V2 (StandardV2 SKU) for zone-redundant outbound SNAT. You also deploy a test virtual machine and Azure Bastion to verify the configuration.

Azure Firewall provides 2,496 SNAT ports per public IP address configured per backend virtual machine scale set instance (minimum of two instances), and you can associate up to [250 public IP addresses](deploy-multi-public-ip-powershell.md). A better option to scale and dynamically allocate outbound SNAT ports is to use an [Azure NAT Gateway](../virtual-network/nat-gateway/nat-overview.md).

## Why NAT Gateway V2?

The Standard NAT Gateway SKU doesn't support zone-redundant deployments. If you deploy a zone-redundant Azure Firewall with a Standard NAT Gateway, the NAT Gateway becomes a single point of failure during a zonal outage. **NAT Gateway V2 (StandardV2 SKU) supports zone-redundant deployments**, making it the recommended choice when integrating with a zone-redundant Azure Firewall.

For more information about NAT Gateway SKUs, see [NAT Gateway SKUs](../virtual-network/nat-gateway/nat-sku.md).

> [!NOTE]
> The [Scale SNAT ports with Azure NAT Gateway](integrate-with-nat-gateway.md) article covers integration with Standard NAT Gateway. This tutorial covers the StandardV2 (V2) SKU, which adds zone-redundant support.

## Traffic flow

With NAT Gateway V2 associated to the AzureFirewallSubnet, inbound and outbound traffic use **different public IP addresses**:

- **Outbound traffic (SNAT)** flows through the NAT Gateway V2 public IP.
- **Inbound traffic (DNAT)** flows through the Azure Firewall's own public IP.
- **Management traffic** (health probes, metrics reporting, and platform management) uses the Azure Firewall's own public IP. This is why the firewall still requires its own public IP even when a NAT Gateway handles outbound SNAT.

There's no double NAT with this architecture. Azure Firewall instances send the traffic to NAT gateway using their private IP address rather than the Azure Firewall public IP address.

| Traffic type | Public IP used |
|---|---|
| Outbound (SNAT) | NAT Gateway V2 PIP |
| Inbound (DNAT) | Azure Firewall PIP |
| Management & health probes | Azure Firewall PIP |

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network with an AzureFirewallSubnet, workload subnet, and AzureBastionSubnet
> * Create a NAT Gateway V2 with a StandardV2 public IP and associate it with the firewall subnet
> * Deploy an Azure Firewall and configure a Firewall Policy with application and network rules
> * Create a route table to send traffic through the firewall
> * Deploy a test VM and Azure Bastion to verify outbound SNAT uses the NAT Gateway V2 public IP

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Azure CLI version 2.50 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Create a resource group

Create a resource group for the deployment.

```azurecli-interactive
az group create \
  --name rg-azfw-natgwv2-test \
  --location eastus2
```

## Create the virtual network and subnets

Create a virtual network with three subnets:
- **AzureFirewallSubnet** — Required name for Azure Firewall (minimum /26).
- **workload-subnet** — Hosts the test virtual machine.
- **AzureBastionSubnet** — Required name for Azure Bastion (minimum /26).

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

NAT Gateway V2 requires a **StandardV2** SKU public IP. A Standard SKU public IP can't be attached to a StandardV2 NAT Gateway.

Create the StandardV2 public IP and NAT Gateway:

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

```azurecli-interactive
az network vnet subnet update \
  --resource-group rg-azfw-natgwv2-test \
  --vnet-name vnet-azfw-natgwv2 \
  --name AzureFirewallSubnet \
  --nat-gateway natgw-v2
```

## Create the Azure Firewall

The firewall requires its own public IP for management and inbound DNAT. This is a Standard SKU public IP.

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
  --tier Standard

az network firewall ip-config create \
  --resource-group rg-azfw-natgwv2-test \
  --firewall-name azfw-natgwv2-test \
  --name azfw-ipconfig \
  --public-ip-address pip-azfw \
  --vnet-name vnet-azfw-natgwv2
```

Note the firewall's private IP address from the output (for example, `10.0.1.4`). You need this value for the route table in the next step.

## Create a route table

Create a route table with a default route that sends all traffic to the Azure Firewall's private IP address, then associate it with the workload subnet.

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
  --next-hop-ip-address 10.0.1.4

az network vnet subnet update \
  --resource-group rg-azfw-natgwv2-test \
  --vnet-name vnet-azfw-natgwv2 \
  --name workload-subnet \
  --route-table rt-workload
```

## Create a Firewall Policy

Create a Firewall Policy and associate it with the Azure Firewall. Add both network rules and application rules.

> [!TIP]
> Web traffic (HTTP/HTTPS) can be allowed using either network rules or application rules. However, it's best practice to use **application rules** for web traffic. Application rules provide additional capabilities such as FQDN-based filtering, TLS inspection, and URL filtering that aren't available with network rules.

```azurecli-interactive
az network firewall policy create \
  --resource-group rg-azfw-natgwv2-test \
  --name policy-azfw-natgwv2 \
  --location eastus2 \
  --sku Standard
```

Create a network rule collection group with a rule that allows TCP and UDP traffic from the workload subnet:

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

Create an application rule collection group with a rule that allows HTTP and HTTPS traffic:

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

Associate the policy with the firewall:

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

Deploy a Linux VM in the workload subnet with no public IP address. Use SSH key authentication.

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

Deploy Azure Bastion with the Premium SKU to connect to the VM through the Azure portal.

```azurecli-interactive
az network public-ip create \
  --resource-group rg-azfw-natgwv2-test \
  --name pip-bastion \
  --sku Standard \
  --allocation-method Static \
  --location eastus2

az network bastion create \
  --resource-group rg-azfw-natgwv2-test \
  --name bastion-premium \
  --public-ip-address pip-bastion \
  --vnet-name vnet-azfw-natgwv2 \
  --sku Premium \
  --location eastus2
```

## Verify the deployment

1. In the Azure portal, go to **vm-test-workload** > **Connect** > **Bastion**.
2. Select **SSH Private Key from Local File** as the authentication type.
3. Enter **azureuser** as the username and select your private key file.
4. Once connected, run:

    ```bash
    curl icanhazip.com
    ```

The response should show the **NAT Gateway V2 public IP address**, confirming that outbound traffic flows through the Azure Firewall and exits via the NAT Gateway V2.

To verify without the NAT Gateway, you can temporarily disassociate it:

```azurecli-interactive
az network vnet subnet update \
  --resource-group rg-azfw-natgwv2-test \
  --vnet-name vnet-azfw-natgwv2 \
  --name AzureFirewallSubnet \
  --remove natGateway
```

Running `curl icanhazip.com` again now returns the **Azure Firewall's own public IP**, proving that SNAT behavior changes based on NAT Gateway association.

Re-associate the NAT Gateway when done:

```azurecli-interactive
az network vnet subnet update \
  --resource-group rg-azfw-natgwv2-test \
  --vnet-name vnet-azfw-natgwv2 \
  --name AzureFirewallSubnet \
  --nat-gateway natgw-v2
```

## Clean up resources

When you're done, delete the resource group to remove all resources:

```azurecli-interactive
az group delete --name rg-azfw-natgwv2-test --yes --no-wait
```

## Next steps

- [Scale SNAT ports with Azure NAT Gateway (Standard SKU)](integrate-with-nat-gateway.md)
- [Design virtual networks with NAT gateway](../virtual-network/nat-gateway/nat-gateway-resource.md)
- [Integrate NAT gateway with Azure Firewall in a hub and spoke network](../virtual-network/nat-gateway/tutorial-hub-spoke-nat-firewall.md)
- [NAT Gateway SKUs](../virtual-network/nat-gateway/nat-sku.md)
