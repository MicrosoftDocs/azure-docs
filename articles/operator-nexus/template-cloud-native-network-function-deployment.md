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
export MYLOC="eastus"
export MYRG="****"
export MSYS_NO_PATHCONV=1
export MYSUB="******"
export MYNFIND='******'
export MYPLATCUSTLOC='******'
export MYHAKSCUSTLOC='******'
```

## Initialization

Set `$MYSUB` as the active subscription for your Operator Nexus instance.

```azurecli
  az account set --subscription "$MYSUB"
```

Get list of `internalnetworks` in the L3 isolation-domain `$myl3isd`

```azurecli
  az nf internalnetwork list --l3domain "$MYL3ISD" \
     -g "$MYRG" --subscription "$MYSUB"
```

## Create Cloud Services Network

```bash
export MYCSN="******"
```

```azurecli
az networkcloud cloudservicesnetwork create --name "$MYCSN" \
--resource-group "$MYRG" \
--subscription "$MYSUB" \
--extended-location name="$MYPLATCUSTLOC" type="CustomLocation" \
--location "$MYLOC" \
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
az networkcloud cloudservicesnetwork show --name "$MYCSN" --resource-group "$MYRG" --subscription "$MYSUB" -o table
```

## Create Default CNI Network

```bash
export MYL3N=="******"
export MYALLOCTYPE="IPV4"
export MYVLAN=****
export MYIPV4SUB=="******"
export MYMTU="9000"
export MYL3ISDARM=="******"
```

```azurecli
az networkcloud defaultcninetwork create --name "$MYL3N" \
  --resource-group "$MYRG" \
  --subscription "$MYSUB" \
  --extended-location name="$MYPLATCUSTLOC" type="CustomLocation" \
  --location "$MYLOC" \
  --bgp-peers '[]' \
  --community-advertisements '[{"communities": ["65535:65281", "65535:65282"], "subnetPrefix": "10.244.0.0/16"}]' \
  --service-external-prefixes '["10.101.65.0/24"]' \
  --service-load-balancer-prefixes '["10.101.66.0/24"]' \
  --ip-allocation-type "$MYALLOCTYPE" \
  --ipv4-connected-prefix "$MYIPV4SUB" \
  --l3-isolation-domain-id "$MYL3ISDARM" \
  --vlan $MYVLAN
```

### Validate Default CNI Network has been created

```azurecli
az networkcloud defaultcninetwork show --name "$MYL3N" \
   --resource-group "$MYRG" --subscription "$MYSUB" -o table
```

## Set AKS-Hybrid Extended Location

```bash
export MYHAKSCUSTLOC=="******"
```

## Create AKS-Hybrid Network Cloud Services Network vNET

The AKS-Hybrid (HAKS) Virtual Networks are different from the Azure to on-premises Virtual Networks.

```bash
export MYHAKSVNETNAME=="******"
export MYNCNW=="******"
```

```azurecli
az hybridaks vnet create \
  --name "$MYHAKSVNETNAME" \
  --resource-group "$MYRG" \
  --subscription "$MYSUB" \
  --custom-location "$MYHAKSCUSTLOC" \
  --aods-vnet-id "$MYNCNW"
```

## Create AKS-Hybrid Cluster

The AKS-Hybrid (HAKS) cluster will be used to host the CNF.

```bash
export MYHAKSVNET1=="******"
export MYHAKSVNET2=="******"
export MYENCODEDKEY=="******"
export ="******"
export MYCLUSTERNAME=="******"
```

```azurecli
az hybridaks create \
  --name "$MYCLUSTERNAME" \
  --resource-group "$MYRG" \
  --subscription "$MYSUB" \
  --aad-admin-group-object-ids "$AADID" \
  --custom-location "$MYHAKSCUSTLOC" \
  --location eastus \
  --control-plane-vm-size NC_G4_v1 \
  --node-vm-size NC_H16_v1 \
  --kubernetes-version v1.22.11 \
  --load-balancer-sku stacked-kube-vip \
  --load-balancer-count 0 \
  --load-balancer-vm-size '' \
  --vnet-ids "$myhaksvnet1","$MYHAKSVNET2" \
  --ssh-key-value "$MYENCODEDKEY" \
  --control-plane-count 3 \
  --node-count 4
```

## Next Step

Deploy the CNF on the AKS-Hybrid Cluster using Azure Network Function Manager.
