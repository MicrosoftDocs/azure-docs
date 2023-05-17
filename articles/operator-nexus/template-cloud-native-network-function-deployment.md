---
title: "Operator Nexus: Sample CNF deployment script"
description: "Sample script to create the resources required for CNF deployment on Operator Nexus. After the resources have been created, the Azure Network Function Manager is used to deploy the CNF."
author: dramasamymsft
ms.author: dramasamy
ms.date: 03/02/2023
ms.topic: sample
# ms.prod: used for on prem applications
ms.service: azure-operator-nexus
---

# Sample: CNF deployment script

This script creates the resources required to deploy a CNF on an Operator
Nexus cluster (instance) on your premises. Once the resources have
been created, the Azure Network Function Manager is used to deploy the CNF.

The first step is to create the workload networks, followed by the AKS-Hybrid
vNET, and finally the AKS-Hybrid cluster that will host the CNF.

## Prerequisites

- fully deployed and configured Operator Nexus cluster
  (instance)
- Tenant inter-fabric network (the L2 and L3 isolation-domains) has been created

## Common parameters

```bash
export DC_LOCATION="eastus"
export RESOURCE_GROUP="****"
export SUBSCRIPTION="******"
export CUSTOM_LOCATION='******'
export HAKS_CUSTOM_LOCATION='******'
export L3_ISD='******'
```

## Initialization

Set `$SUBSCRIPTION` as the active subscription for your Operator Nexus instance.

```azurecli
  az account set --subscription "$SUBSCRIPTION"
```

Get list of `internalnetworks` in the L3 isolation-domain `$L3_ISD`

```azurecli
  az nf internalnetwork list --l3domain "$L3_ISD" \
     -g "$RESOURCE_GROUP" --subscription "$SUBSCRIPTION"
```

## Create Cloud Services Network

```bash
export CLOUD_SERVICES_NETWORK="******"
```

```azurecli
az networkcloud cloudservicesnetwork create --name "$CLOUD_SERVICES_NETWORK" \
--resource-group "$RESOURCE_GROUP" \
--subscription "$SUBSCRIPTION" \
--extended-location name="$CUSTOM_LOCATION" type="CustomLocation" \
--location "$DC_LOCATION" \
--additional-egress-endpoints '[{
    "category": "azure-resource-management",
    "endpoints": [{
      "domainName": "https://storageaccountex.blob.core.windows.net",
      "port": 443
    }]
  },
  {
    "category": "ubuntu",
    "endpoints": [{
      "domainName": ".ubuntu.com",
      "port": 443
    },
    {
      "domainName": ".ubuntu.com",
      "port": 80
    }]
  },
  {
    "category": "google",
    "endpoints": [{
      "domainName": ".google.com",
      "port": 80
    },
    {
      "domainName": ".google.com",
      "port": 443
    }]
  }
]'

--debug
```

### Validate Cloud Services Network has been created

```azurecli
az networkcloud cloudservicesnetwork show --name "$CLOUD_SERVICES_NETWORK" --resource-group "$RESOURCE_GROUP" --subscription "$SUBSCRIPTION" -o table
```

## Create Default CNI Network

```bash
export DCN_NAME="******"
export IP_ALLOCATION_TYPE="IPV4"
export VLAN=****
export IPV4_SUBNET="******"
export L3_ISD_ARM="******"
```

```azurecli
az networkcloud defaultcninetwork create --name "$DCN_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --subscription "$SUBSCRIPTION" \
  --extended-location name="$CUSTOM_LOCATION" type="CustomLocation" \
  --location "$DC_LOCATION" \
  --bgp-peers '[]' \
  --community-advertisements '[{"communities": ["65535:65281", "65535:65282"], "subnetPrefix": "10.244.0.0/16"}]' \
  --service-external-prefixes '["10.101.65.0/24"]' \
  --service-load-balancer-prefixes '["10.101.66.0/24"]' \
  --ip-allocation-type "$IP_ALLOCATION_TYPE" \
  --ipv4-connected-prefix "$IPV4_SUBNET" \
  --l3-isolation-domain-id "$L3_ISD_ARM" \
  --vlan $VLAN
```

### Validate Default CNI Network has been created

```azurecli
az networkcloud defaultcninetwork show --name "$DCN_NAME" \
   --resource-group "$RESOURCE_GROUP" --subscription "$SUBSCRIPTION" -o table
```

## Set AKS-Hybrid Extended Location

```bash
export HAKS_CUSTOM_LOCATION="******"
```

## Create AKS-Hybrid Network Cloud Services Network vNET

The AKS-Hybrid (HAKS) Virtual Networks are different from the Azure to on-premises Virtual Networks.

```bash
export HAKS_VNET_NAME="******"
export NC_NETWORK="******"
```

```azurecli
az hybridaks vnet create \
  --name "$HAKS_VNET_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --subscription "$SUBSCRIPTION" \
  --custom-location "$HAKS_CUSTOM_LOCATION" \
  --aods-vnet-id "$NC_NETWORK"
```

## Create AKS-Hybrid Cluster

The AKS-Hybrid (HAKS) cluster will be used to host the CNF.

```bash
export HAKS_VNET_1="******"
export HAKS_VNET_2="******"
export ENCODED_KEY="******"
export AAD_ID="******"
export HAKS_CLUSTER_NAME="******"
```

```azurecli
az hybridaks create \
  --name "$HAKS_CLUSTER_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --subscription "$SUBSCRIPTION" \
  --aad-admin-group-object-ids "$AAD_ID" \
  --custom-location "$HAKS_CUSTOM_LOCATION" \
  --location eastus \
  --control-plane-vm-size NC_G4_v1 \
  --node-vm-size NC_H16_v1 \
  --kubernetes-version v1.22.11 \
  --load-balancer-sku stacked-kube-vip \
  --load-balancer-count 0 \
  --load-balancer-vm-size '' \
  --vnet-ids "$HAKS_VNET_1","$HAKS_VNET_2" \
  --ssh-key-value "$ENCODED_KEY" \
  --control-plane-count 3 \
  --node-count 4
```

## Next Step

Deploy the CNF on the AKS-Hybrid Cluster using Azure Network Function Manager.
