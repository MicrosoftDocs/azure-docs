---
title: "Operator Nexus: Platform deployment"
description: Learn the steps for deploying the Operator Nexus platform software.
author: JAC0BSMITH
ms.author: jacobsmith
ms.service: azure #Required; service per approved list. slug assigned by ACOM.
ms.topic: quickstart #Required; leave this attribute/value as-is.
ms.date: 01/26/2023 #Required; mm/dd/yyyy format.
ms.custom: template-quickstart #Required; leave this attribute/value as-is.
---

# Platform software deployment

In this quickstart, you'll learn step by step process to deploy the Azure Operator Distributed
Services platform software.

- Step 1: Create Network fabric
- Step 2: Create a Cluster
- Step 3: Provision the Network fabric
- Step 4: Provision the Cluster

These steps use commands and parameters that are detailed in the API documents.

## Prerequisites

- Verify that Network fabric Controller and Cluster Manger exist in your Azure region
- Complete the [prerequisite steps](./quickstarts-platform-prerequisites.md).

## API guide and metrics

The [API guide](/rest/api/azure/azure-operator-distributed-services) provides
information on the resource providers and resource models, and the APIs.

The metrics generated from the logging data are available in [Azure Monitor metrics](/azure/azure-monitor/essentials/data-platform-metrics).

## Step 1: create network fabric

The network fabric instance (NF) is a collection of all network devices
described in the previous section, associated with a single Operator Nexus instance. The NF
instance interconnects compute servers and storage instances within an Operator Nexus
instance. The NF facilitates connectivity to and from your network to
the Operator Nexus instance.

Create the Network fabric:

```azurecli
az nf fabric create --resource-group $FABRIC_RG --location $LOCATION \
  --resource-name $FABRIC_RESOURCE_NAME --nf-sku "$NF_SKU" \
  --nfc-id "$NFC_ID" \
  --nni-config '{"layer2Configuration": null, "layer3Configuration":{"primaryIpv4Prefix":"$L3_IPV4_PREFIX1", \
       "secondaryIpv4Prefix": "$L3_IPV4_PREFIX2", "fabricAsn":$NNI_FABRIC_ASN, "peerAsn":$NNI_PEER_ASN}}' \
  --ts-config '{"primaryIpv4Prefix":"$TS_IPV4_PREFIX1", "secondaryIpv4Prefix":"$TS_IPV4_PREFIX2", \
       "username":"$TS_USER", "password": "$TS_PASS"}' \
  --managed-network-config '{"ipv4Prefix":"{ManagedNetworkIPV4Prefix}", \
       "managementVpnConfiguration":{"optionBProperties":{"importRouteTargets":["$IR_TARGETS"], \
       "exportRouteTargets":["$ER_TARGETS"]}}, "workloadVpnConfiguration":{"optionBProperties":{"importRouteTargets":["WL_IR_TARGETS"], \
       "exportRouteTargets":["WL_ER_TARGETS"]}}'

az nf fabric show --resource-group "$FABRIC_RG" \
  --resource-name "$FABRIC_RESOURCE_NAME"
```

Create the Network fabric Racks (Aggregate and Compute Racks).
Repeat for each rack in the SKU.

```azurecli
az nf rack create  \
--resource-group "$FABRIC_RG"  \
--location "$LOCATION"  \
--network-rack-sku "$RACK_SKU"  \
--nf-id "$FABRIC_ID" \
--resource-name "$RACK_RESOURCE_NAME"
```

Update the Network fabric Device names and Serial Numbers for all devices.
Repeat for each device in the SKU.

```azurecli
az nf device update  --resource-group "$FABRIC_RG" \
  --location "$LOCATION"  \
  --resource-name "$DEVICE_RESOURCE_NAME" \
  --device-name "$DEVICE_NAME" \
  --network-device-role "$DEVICE_ROLE" --serial-number "$DEVICE_SN"
```

### Parameters for network fabric operations

| Parameter name       | Description                                                                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FABRIC_RESOURCE_NAME | Resource Name of the Network fabric Controller                                                                                                             |
| LOCATION             | The Azure Region where the NFC will be deployed (for example, `eastus`)                                                                                    |
| FABRIC_RG            | The resource group name                                                                                                                                    |
| NF_SKU               | SKU of the Network fabric that needs to be created                                                                                                         |
| NFC_ID               | Reference to Network fabric Controller                                                                                                                     |
| NNI_FABRIC_ASN       | ASN of PE devices                                                                                                                                          |
| NNI_PEER_ASN         | Router ID to be used for MP-BGP between PE and CE                                                                                                          |
| L3_IPV4_PREFIX1      | L3 IPV4 Primary Prefix                                                                                                                                     |
| L3_IPV4_PREFIX2      | L3 IPV4 Secondary Prefix                                                                                                                                   |
| TS_IPV4_PREFIX1      | Primary TS IPV4 Prefix                                                                                                                                     |
| TS_IPV4_PREFIX2      | Secondary TS IPV4 Prefix                                                                                                                                   |
| TS_USER              | Username of Terminal Server                                                                                                                                |
| TS_PASS              | Password for Terminal Server username                                                                                                                      |
| IR_TARGETS           | Import route targets of management VPN (MP-BGP) to NFC via PE devices and express route.                                                                   |
| ER_TARGETS           | Export route targets of management VPN (MP-BGP) to NFC via PE devices and express route.                                                                   |
| WL_IR_TARGETS        | Import route targets of workload VPN (MP-BGP) to NFC via PE devices and express route.                                                                     |
| WL_ER_TARGETS        | Export route targets of workload VPN (MP-BGP) to NFC via PE devices and express route.                                                                     |
| RACK_SKU             | SKU of the Network fabric Rack that needs to be created                                                                                                    |
| RACK_RESOURCE_NAME   | RACK resource name                                                                                                                                         |
| DEVICE_RESOURCE_NAME | Device resource name                                                                                                                                       |
| DEVICE_NAME          | Device customer name                                                                                                                                       |
| DEVICE_ROLE          | Device Type (CE/NPB/MGMT/TOR)                                                                                                                              |
| DEVICE_SN            | Device serial number for DHCP using format `*VENDOR*;*DEVICE_MODEL*;*DEVICE_HW_VER*;*DEVICE_SN*` (for example, `Arista;DCS-7280DR3K-24;12.04;JPE22113317`) |

### NF validation

The Network fabric creation will result in the Fabric Resource and other hosted resources to be created in the Fabric hosted resource groups. The other resources include racks, devices, MTU size, IP address prefixes.

View the status of the Fabric:

```azurecli
az nf fabric show --resource-group "$FABRIC_RG" \
  --resource-name $FABRIC_RESOURCE_NAME"
```

The Fabric deployment is complete when the `provisioningState` of the resource shows: `"operationalState": "Succeeded"`

### NF logging

Fabric create Logs can be viewed in the following locations:

1. Azure portal Resource/ResourceGroup Activity logs.
2. Azure CLI with `--debug` flag passed on command-line.

## Step 2: create a cluster

The Cluster resource represents an on-premises deployment of the platform
within the Cluster Manager. All other platform-specific resources are
dependent upon it for their lifecycle.

You should have successfully created the Network fabric for this on-premises deployment.
Each Operator Nexus on-premises instance has a one-to-one association
with a Network fabric.

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

#### Cluster logging

Cluster create Logs can be viewed in the following locations:

1. Azure portal Resource/ResourceGroup Activity logs.
2. Azure CLI with `--debug` flag passed on command-line.

## Step 3: provision network fabric

The network fabric instance (NF) is a collection of all network devices
associated with a single Operator Nexus instance.

Provision the Network fabric:

```azurecli
az nf fabric provision --resource-group "$FABRIC_RG" \
  --resource-name "$FABRIC_RESOURCE_NAME"
```

### NF provisioning validation

Provisioning of the fabric will result in the Fabric racks and device resources created
in the Fabric hosted resource groups. The following data is returned as a result of
successful Network fabric create: racks, MTU size, IP address prefixes, etc.

View the status of the fabric:

```azurecli
az nf fabric show --resource-group "$FABRIC_RG" \
  --resource-name "$FABRIC_RESOURCE_NAME"
```

The Fabric provisioning is complete when the `provisioningState` of the resource
shows: `"provisioningState": "Succeeded"`

### Logging

Fabric create Logs can be viewed in the following locations:

1. Azure portal Resource/ResourceGroup Activity logs.
2. Azure CLI with `--debug` flag passed on command-line.

## Step 4: Deploy cluster

Once a Cluster has been created and the Rack Manifests have been added, the
deploy cluster action is triggered. The deploy cluster action creates the
bootstrap image and deploys the cluster.

Deploy Cluster will cause a sequence of events to occur in the Cluster Manager

1.  Validation of the cluster/rack manifests for completeness.
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
