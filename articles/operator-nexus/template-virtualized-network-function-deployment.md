---
title: "Operator Nexus: Sample VNF deployment script"
description: Sample script to create the environment for VNF deployment on Operator Nexus.
author: atwumbarimah
ms.author: atwumbarimah
ms.date: 01/24/2023
ms.topic: sample
# ms.prod: used for on prem applications
ms.service: azure
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
export myloc="eastus"
export myrg="****"
export MSYS_NO_PATHCONV=1
export mysub="******"
export mynfid='******'
export myplatcustloc='******'
export myhakscustloc='******'
```

## Initialization

Set `$mysub` as the active subscription for your Operator Nexus instance.

```azurecli
  az account set --subscription "$mysub"
```

## Create `cloudservicesnetwork`

```azurecli
az networkcloud cloudservicesnetwork create --name "$mycsn" \
--resource-group "$myrg" \
--subscription "$mysub" \
--extended-location name="$myplatcustloc" type="CustomLocation" \
--location "$myloc" \
--additional-egress-endpoints "[{\"category\":\"azure-resource-management\",\"endpoints\":[{\"domainName\":\"az \",\"port\":443}]}]" \
--debug
```

### Validate `cloudservicesnetwork` has been created

```azurecli
az networkcloud cloudservicesnetwork show --name "$mycsn" --resource-group "$myrg" --subscription "$mysub" -o table
```

## Create management L3network

```azurecli
az networkcloud l3network create --name "$myl3n-mgmt" \
--resource-group "$myrg" \
--subscription "$mysub" \
--extended-location name="$myplatcustloc" type="CustomLocation" \
--location "$myloc" \
--hybrid-aks-ipam-enabled "False" \
--hybrid-aks-plugin-type "HostDevice" \
--ip-allocation-type "$myalloctype" \
--ipv4-connected-prefix "$myipv4sub" \
--l3-isolation-domain-id "$myl3isdarm" \
--vlan $myvlan \
--debug
```

### Validate `l3network` has been created

```azurecli
az networkcloud l3network show --name "$myl3n-mgmt" \
   --resource-group "$myrg" --subscription "$mysub"
```

## Create trusted L3network

```azurecli
az networkcloud l3network create --name "$myl3n-trust" \
--resource-group "$myrg" \
--subscription "$mysub" \
--extended-location name="$myplatcustloc" type="CustomLocation" \
--location "$myloc" \
--hybrid-aks-ipam-enabled "False" \
--hybrid-aks-plugin-type "HostDevice" \
--ip-allocation-type "$myalloctype" \
--ipv4-connected-prefix "$myipv4sub" \
--l3-isolation-domain-id "$myl3isdarm" \
--vlan $myvlan \
--debug
```

### Validate trusted `l3network` has been created

```azurecli
az networkcloud l3network show --name "$myl3n-trust" \
   --resource-group "$myrg" --subscription "$mysub"
```

## Create untrusted L3network

```azurecli
az networkcloud l3network create --name "$myl3n-untrust" \
--resource-group "$myrg" \
--subscription "$mysub" \
--extended-location name="$myplatcustloc" type="CustomLocation" \
--location "$myloc" \
--hybrid-aks-ipam-enabled "False" \
--hybrid-aks-plugin-type "HostDevice" \
--ip-allocation-type "$myalloctype" \
--ipv4-connected-prefix "$myipv4sub" \
--l3-isolation-domain-id "$myl3isdarm" \
--vlan $myvlan \
--debug
```

### Validate untrusted `l3network` has been created

```azurecli
az networkcloud l3network show --name "$myl3n-untrust" \
   --resource-group "$myrg" --subscription "$mysub"
```

## Create L2network

```azurecli
az networkcloud l2network create --name "$myl2n" \
--resource-group "$myrg" \
--subscription "$mysub" \
--extended-location name="$myplatcustloc" type="CustomLocation" \
--location "$myloc" \
--hybrid-aks-plugin-type "HostDevice" \
--l2-isolation-domain-id "$myl2isdarm" \
--debug
```

### Validate `l2network` has been created

```azurecli
az networkcloud l2network show --name "$myl2n" --resource-group "$myrg" --subscription "$mysub"
```

## Create Virtual Machine and deploy VNF

The virtual machine parameters include the VNF image.

```azurecli
az networkcloud virtualmachine create --name "$myvm" \
--resource-group "$myrg" --subscription "$mysub" \
--virtual-machine-parameters "$vmparm" \
--debug
```
