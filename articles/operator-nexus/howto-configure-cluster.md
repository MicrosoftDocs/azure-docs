---
title: "Azure Operator Nexus: How to configure the Cluster deployment"
description: Learn the steps for deploying the Operator Nexus Cluster.
author: JAC0BSMITH
ms.author: jacobsmith
ms.service: azure #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 03/03/2023 #Required; mm/dd/yyyy format.
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Create and provision a Cluster using Azure CLI

This article describes how to create a Cluster by using the Azure Command Line Interface (AzCLI). This document also shows you how to check the status, update, or delete a Cluster.

## Prerequisites

- Verify that Network Fabric Controller and Cluster Manger exist in your Azure region
- Verify that Network Fabric is successfully provisioned

## API guide and metrics

The [API guide](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/networkcloud/resource-manager) provides
information on the resource providers and resource models, and the APIs.

The metrics generated from the logging data are available in [Azure Monitor metrics](./list-of-metrics-collected.md).


## Create a Cluster

The Cluster resource represents an on-premises deployment of the platform
within the Cluster Manager. All other platform-specific resources are
dependent upon it for their lifecycle.

You should have successfully created the Network Fabric for this on-premises deployment.
Each Operator Nexus on-premises instance has a one-to-one association
with a Network Fabric.

Create the Cluster:

```azurecli
az networkcloud cluster create --name "$CLUSTER_NAME" --location "$LOCATION" \
  --extended-location name="$CL_NAME" type="CustomLocation" \
  --resource-group "$CLUSTER_RG" \
  --analytics-workspace-id "$LAW_ID" \
  --cluster-location "$CLUSTER_LOCATION" \
  --network-rack-id "$AGGR_RACK_RESOURCE_ID" \
  --rack-sku-id "$AGGR_RACK_SKU"\
  --rack-serial-number "$AGGR_RACK_SN" \
  --rack-location "$AGGR_RACK_LOCATION" \
  --bare-metal-machine-configuration-data "["$AGGR_RACK_BMM"]" \
  --storage-appliance-configuration-data '[{"adminCredentials":{"password":"$SA_PASS","username":"$SA_USER"},"rackSlot":1,"serialNumber":"$SA_SN","storageApplianceName":"$SA_NAME"}]' \
  --compute-rack-definitions '[{"networkRackId": "$COMPX_RACK_RESOURCE_ID", "rackSkuId": "$COMPX_RACK_SKU", "rackSerialNumber": "$COMPX_RACK_SN", "rackLocation": "$COMPX_RACK_LOCATION", "storageApplianceConfigurationData": [], "bareMetalMachineConfigurationData":[{"bmcCredentials": {"password":"$COMPX_SVRY_BMC_PASS", "username":"$COMPX_SVRY_BMC_USER"}, "bmcMacAddress":"$COMPX_SVRY_BMC_MAC", "bootMacAddress":"$COMPX_SVRY_BOOT_MAC", "machineDetails":"$COMPX_SVRY_SERVER_DETAILS", "machineName":"$COMPX_SVRY_SERVER_NAME"}]}]'\
  --managed-resource-group-configuration name="$MRG_NAME" location="$MRG_LOCATION" \
  --network fabric-id "$NFC_ID" \
  --cluster-service-principal application-id="$SP_APP_ID" \
    password="$SP_PASS" principal-id="$SP_ID" tenant-id="$TENANT_ID" \
  --cluster-type "$CLUSTER_TYPE" --cluster-version "$CLUSTER_VERSION" \
  --tags $TAG_KEY1="$TAG_VALUE1" $TAG_KEY2="$TAG_VALUE2"

az networkcloud cluster wait --created --name "$CLUSTER_NAME" --resource-group
"$CLUSTER_RG"
```

You can instead create a Cluster with ARM template/parameter files in
[ARM Template Editor](https://portal.azure.com/#create/Microsoft.Template):

### Parameters for cluster operations

| Parameter name            | Description                                                                                                           |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| CLUSTER_NAME              | Resource Name of the Cluster                                                                                          |
| LOCATION                  | The Azure Region where the Cluster will be deployed                                                                   |
| CL_NAME                   | The Cluster Manager Custom Location from Azure portal                                                                 |
| CLUSTER_RG                | The cluster resource group name                                                                                       |
| LAW_ID                    | Log Analytics Workspace ID for the Cluster                                                                            |
| CLUSTER_LOCATION          | The local name of the Cluster                                                                                         |
| AGGR_RACK_RESOURCE_ID     | RackID for Aggregator Rack                                                                                            |
| AGGR_RACK_SKU             | Rack SKU for Aggregator Rack                                                                                          |
| AGGR_RACK_SN              | Rack Serial Number for Aggregator Rack                                                                                |
| AGGR_RACK_LOCATION        | Rack physical location for Aggregator Rack                                                                            |
| AGGR_RACK_BMM             | Used for single rack deployment only, empty for multi-rack                                                            |
| SA_NAME                   | Storage Appliance Device name                                                                                         |
| SA_PASS                   | Storage Appliance admin password                                                                                      |
| SA_USER                   | Storage Appliance admin user                                                                                          |
| SA_SN                     | Storage Appliance Serial Number                                                                                       |
| COMPX_RACK_RESOURCE_ID    | RackID for CompX Rack, repeat for each rack in compute-rack-definitions                                               |
| COMPX_RACK_SKU            | Rack SKU for CompX Rack, repeat for each rack in compute-rack-definitions                                             |
| COMPX_RACK_SN             | Rack Serial Number for CompX Rack, repeat for each rack in compute-rack-definitions                                   |
| COMPX_RACK_LOCATION       | Rack physical location for CompX Rack, repeat for each rack in compute-rack-definitions                               |
| COMPX_SVRY_BMC_PASS       | CompX Rack ServerY BMC password, repeat for each rack in compute-rack-definitions and for each server in rack         |
| COMPX_SVRY_BMC_USER       | CompX Rack ServerY BMC user, repeat for each rack in compute-rack-definitions and for each server in rack             |
| COMPX_SVRY_BMC_MAC        | CompX Rack ServerY BMC MAC address, repeat for each rack in compute-rack-definitions and for each server in rack      |
| COMPX_SVRY_BOOT_MAC       | CompX Rack ServerY boot NIC MAC address, repeat for each rack in compute-rack-definitions and for each server in rack |
| COMPX_SVRY_SERVER_DETAILS | CompX Rack ServerY details, repeat for each rack in compute-rack-definitions and for each server in rack              |
| COMPX_SVRY_SERVER_NAME    | CompX Rack ServerY name, repeat for each rack in compute-rack-definitions and for each server in rack                 |
| MRG_NAME                  | Cluster managed resource group name                                                                                   |
| MRG_LOCATION              | Cluster Azure region                                                                                                  |
| NFC_ID                    | Reference to Network fabric Controller                                                                                |
| SP_APP_ID                 | Service Principal App ID                                                                                              |
| SP_PASS                   | Service Principal Password                                                                                            |
| SP_ID                     | Service Principal ID                                                                                                  |
| TENANT_ID                 | Subscription tenant ID                                                                                                |
| CLUSTER_TYPE              | Type of cluster, Single or MultiRack                                                                                  |
| CLUSTER_VERSION           | NC Version of cluster                                                                                                 |
| TAG_KEY1                  | Optional tag1 to pass to Cluster Create                                                                               |
| TAG_VALUE1                | Optional tag1 value to pass to Cluster Create                                                                         |
| TAG_KEY2                  | Optional tag2 to pass to Cluster Create                                                                               |
| TAG_VALUE2                | Optional tag2 value to pass to Cluster Create                                                                         |

### Cluster validation

A successful Operator Nexus Cluster creation will result in the creation of an AKS cluster
inside your subscription. The cluster ID, cluster provisioning state and
deployment state are returned as a result of a successful `cluster create`.

View the status of the Cluster:

```azurecli
az networkcloud cluster show --resource-group "$CLUSTER_RG" \
  --resource-name "$CLUSTER_RESOURCE_NAME"
```

The Cluster deployment is complete when the `provisioningState` of the resource
shows: `"provisioningState": "Succeeded"`

### Cluster logging

Cluster create Logs can be viewed in the following locations:

1. Azure portal Resource/ResourceGroup Activity logs.
2. Azure CLI with `--debug` flag passed on command-line.

## Deploy Cluster

Once a Cluster has been created and the Rack Manifests have been added, the
deploy cluster action can be triggered. The deploy Cluster action creates the
bootstrap image and deploys the Cluster.

Deploy Cluster will initiate a sequence of events to occur in the Cluster Manager

1.  Validation of the cluster/rack properties
2.  Generation of a bootable image for the ephemeral bootstrap cluster
    (Validation of Infrastructure).
3.  Interaction with the IPMI interface of the targeted bootstrap machine.
4.  Perform hardware validation checks
5.  Monitoring of the Cluster deployment process.

Deploy the on-premises Cluster:

```azurecli
az networkcloud cluster deploy \
  --name "$CLUSTER_NAME" \
  --resource-group "$CLUSTER_RESOURCE_GROUP" \
  --subscription "$SUBSCRIPTION_ID"
```

## Cluster deployment validation

View the status of the cluster:

```azurecli
az networkcloud Cluster show --resource-group "$CLUSTER_RG" \
  --resource-name "$CLUSTER_RESOURCE_NAME"
```

The Cluster deployment is complete when the `provisioningState` of the resource
shows: `"provisioningState": "Succeeded"`

## Cluster deployment Logging

Cluster create Logs can be viewed in the following locations:

1. Azure portal Resource/ResourceGroup Activity logs.
2. Azure CLI with `--debug` flag passed on command-line.
