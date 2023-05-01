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
export DC_LOCATION="eastus"
export RESOURCE_GROUP="****"
export SUBSCRIPTION="******"
export CUSTOM_LOCATION="******"
export VM_NAME="******"
export IP_ALLOCATION_TYPE="IPV4"
export IPV4_SUBNET="******"
export VLAN=****
export L3_ISD_ARM="******"
export L3_MGMT_NET_NAME="******"
export L3_TRUSTED_NET_NAME="******"
export L3_UNTRUSTED_NET_NAME="******"
export L2_NETWORK_NAME="******"
export L2_ISD_ARM="******"
export VM_PARAMS="******"
```
## Initialization

Set `$SUBSCRIPTION` as the active subscription for your Operator Nexus instance.

```azurecli
  az account set --subscription "$SUBSCRIPTION"
```

## Create `cloudservicesnetwork`

```azurecli
az networkcloud cloudservicesnetwork create --name "$CLOUD_SERVICES_NETWORK" \
--resource-group "$RESOURCE_GROUP" \
--subscription "$SUBSCRIPTION" \
--extended-location name="$CUSTOM_LOCATION" type="CustomLocation" \
--location "$DC_LOCATION" \
--additional-egress-endpoints "[{\"category\":\"azure-resource-management\",\"endpoints\":[{\"domainName\":\"az \",\"port\":443}]}]" \
--debug
```

### Validate `cloudservicesnetwork` has been created

```azurecli
az networkcloud cloudservicesnetwork show --name "$CLOUD_SERVICES_NETWORK" --resource-group "$RESOURCE_GROUP" --subscription "$SUBSCRIPTION" -o table
```

## Create management L3network

```azurecli
az networkcloud l3network create --name "$L3_MGMT_NET_NAME" \
--resource-group "$RESOURCE_GROUP" \
--subscription "$SUBSCRIPTION" \
--extended-location name="$CUSTOM_LOCATION" type="CustomLocation" \
--location "$DC_LOCATION" \
--ip-allocation-type "$IP_ALLOCATION_TYPE" \
--ipv4-connected-prefix "$IPV4_SUBNET" \
--l3-isolation-domain-id "$L3_ISD_ARM" \
--vlan $VLAN \
--debug
```

### Validate `l3network` has been created

```azurecli
az networkcloud l3network show --name "$L3_MGMT_NET_NAME" \
   --resource-group "$RESOURCE_GROUP" --subscription "$SUBSCRIPTION"
```

## Create trusted L3network

```azurecli
az networkcloud l3network create --name "$L3_TRUSTED_NET_NAME" \
--resource-group "$RESOURCE_GROUP" \
--subscription "$SUBSCRIPTION" \
--extended-location name="$CUSTOM_LOCATION" type="CustomLocation" \
--location "$DC_LOCATION" \
--ip-allocation-type "$IP_ALLOCATION_TYPE" \
--ipv4-connected-prefix "$IPV4_SUBNET" \
--l3-isolation-domain-id "$L3_ISD_ARM" \
--vlan $VLAN \
--debug
```

### Validate trusted `l3network` has been created

```azurecli
az networkcloud l3network show --name "$L3_TRUSTED_NET_NAME" \
   --resource-group "$RESOURCE_GROUP" --subscription "$SUBSCRIPTION"
```

## Create untrusted L3network

```azurecli
az networkcloud l3network create --name "$L3_UNTRUSTED_NET_NAME" \
--resource-group "$RESOURCE_GROUP" \
--subscription "$SUBSCRIPTION" \
--extended-location name="$CUSTOM_LOCATION" type="CustomLocation" \
--location "$DC_LOCATION" \
--ip-allocation-type "$IP_ALLOCATION_TYPE" \
--ipv4-connected-prefix "$IPV4_SUBNET" \
--l3-isolation-domain-id "$L3_ISD_ARM" \
--vlan $VLAN \
--debug
```

### Validate untrusted `l3network` has been created

```azurecli
az networkcloud l3network show --name "$L3_UNTRUSTED_NET_NAME" \
   --resource-group "$RESOURCE_GROUP" --subscription "$SUBSCRIPTION"
```

## Create L2network

```azurecli
az networkcloud l2network create --name "$L2_NETWORK_NAME" \
--resource-group "$RESOURCE_GROUP" \
--subscription "$SUBSCRIPTION" \
--extended-location name="$CUSTOM_LOCATION" type="CustomLocation" \
--location "$DC_LOCATION" \
--l2-isolation-domain-id "$L2_ISD_ARM" \
--debug
```

### Validate `l2network` has been created

```azurecli
az networkcloud l2network show --name "$L2_NETWORK_NAME" --resource-group "$RESOURCE_GROUP" --subscription "$SUBSCRIPTION"
```

## Create Virtual Machine and deploy VNF

The virtual machine parameters include the VNF image.

```azurecli
az networkcloud virtualmachine create --name "$VM_NAME" \
--resource-group "$RESOURCE_GROUP" --subscription "$SUBSCRIPTION" \
--virtual-machine-parameters "$VM_PARAMS" \
--debug
```
