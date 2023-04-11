---
title: "Operator Nexus: Sample VNF deployment script"
description: Sample script to create the environment for VNF deployment on Operator Nexus.
author: atwumbarimah
ms.author: atwumbarimah
ms.date: 01/24/2023
ms.topic: sample
# ms.prod: used for on prem applications
ms.service: azure-operator-nexus
---

# Sample: VNF deployment script

This script creates the resources required to deploy a VNF on an Operator Nexus cluster (instance) on your premises.

The first step is to create the workload L2 and L3 networks, followed by the creation of the virtual machine for the VNF.

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
export MYHAKCUSTLOC='******'
```

## Initialization

Set `$mysub` as the active subscription for your Operator Nexus instance.

```azurecli
  az account set --subscription "$MYSUB"
```

## Create `cloudservicesnetwork`

```azurecli
az networkcloud cloudservicesnetwork create --name "$MYCSN" \
--resource-group "$MYRG" \
--subscription "$MYSUB" \
--extended-location name="$MYPLATCUSTLOC" type="CustomLocation" \
--location "$MYLOC" \
--additional-egress-endpoints "[{\"category\":\"azure-resource-management\",\"endpoints\":[{\"domainName\":\"az \",\"port\":443}]}]" \
--debug
```

### Validate `cloudservicesnetwork` has been created

```azurecli
az networkcloud cloudservicesnetwork show --name "$MYCSN" --resource-group "$MYRG" --subscription "$MYSUB" -o table
```

## Create management L3network

```azurecli
az networkcloud l3network create --name "$MYL3N_MGMT" \
--resource-group "$MYRG" \
--subscription "$MYSUB" \
--extended-location name="$MYPLATCUSTLOC" type="CustomLocation" \
--location "$MYLOC" \
--hybrid-aks-ipam-enabled "False" \
--hybrid-aks-plugin-type "HostDevice" \
--ip-allocation-type "$MYALLOCTYPE" \
--ipv4-connected-prefix "$MYIPV4SUB" \
--l3-isolation-domain-id "$MYL3ISDARM" \
--vlan $MYVLAN \
--debug
```

### Validate `l3network` has been created

```azurecli
az networkcloud l3network show --name "$MYL3N_MGMT" \
   --resource-group "$MYRG" --subscription "$MYSUB"
```

## Create trusted L3network

```azurecli
az networkcloud l3network create --name "$MYL3N_TRUST" \
--resource-group "$MYRG" \
--subscription "$MYSUB" \
--extended-location name="$MYPLATCUSTLOC" type="CustomLocation" \
--location "$MYLOC" \
--hybrid-aks-ipam-enabled "False" \
--hybrid-aks-plugin-type "HostDevice" \
--ip-allocation-type "$MYIPV4SUB" \
--ipv4-connected-prefix "$MYALLOCTYPE" \
--l3-isolation-domain-id "$MYL3ISDARM" \
--vlan $MYVLAN \
--debug
```

### Validate trusted `l3network` has been created

```azurecli
az networkcloud l3network show --name "$MYL3N_TRUST" \
   --resource-group "$MYRG" --subscription "$MYSUB"
```

## Create untrusted L3network

```azurecli
az networkcloud l3network create --name "$MYL3N_UNTRUST" \
--resource-group "$MYRG" \
--subscription "$MYSUB" \
--extended-location name="$MYPLATCUSTLOC" type="CustomLocation" \
--location "$MYLOC" \
--hybrid-aks-ipam-enabled "False" \
--hybrid-aks-plugin-type "HostDevice" \
--ip-allocation-type "$MYALLOCTYPE" \
--ipv4-connected-prefix "$MYIPV4SUB" \
--l3-isolation-domain-id "$MYL3ISDARM" \
--vlan $MYVLAN \
--debug
```

### Validate untrusted `l3network` has been created

```azurecli
az networkcloud l3network show --name "$MYL3N_UNTRUST" \
   --resource-group "$MYRG" --subscription "$MYSUB"
```

## Create L2network

```azurecli
az networkcloud l2network create --name "$MYL2N" \
--resource-group "$MYRG" \
--subscription "$MYSUB" \
--extended-location name="$MYPLATCUSTLOC" type="CustomLocation" \
--location "$MYLOC" \
--hybrid-aks-plugin-type "HostDevice" \
--l2-isolation-domain-id "$MYL2ISDARM" \
--debug
```

### Validate `l2network` has been created

```azurecli
az networkcloud l2network show --name "$MYL2N" --resource-group "$MYRG" --subscription "$MYSUB"
```

## Create Virtual Machine and deploy VNF

The virtual machine parameters include the VNF image.

```azurecli
az networkcloud virtualmachine create --name "$MYVM" \
--resource-group "$MYRG" --subscription "$MYSUB" \
--virtual-machine-parameters "$VMPARM" \
--debug
```
