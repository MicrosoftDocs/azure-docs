--- 
title: "Azure Operator Distributor Services: Platform deployment"
description: Learn the steps for deploying the Azure Operator Distributor Services platform software.
author: JAC0BSMITH
ms.author: jacobsmith@microsoft.com
ms.service: #Required; service per approved list. slug assigned by ACOM.
ms.topic: quickstart #Required; leave this attribute/value as-is.
ms.date: 01/26/2023 #Required; mm/dd/yyyy format.
ms.custom: template-quickstart #Required; leave this attribute/value as-is.
---

# Platform Software Deployment

In this quickstart, you'll learn step by step process to deploy the Azure Operator Distributor
Services platform software.

- Prerequisites: [CLI Extensions and Log in to your Subscription](Docs/quickstarts-platform-prerequisites.md#install-cli-extensions-and-Log-in-to your-azure-subscription)

- Step1: Create Network Fabric Controller
- Step2: Create Cluster Manager
- Step3: Create Network Fabric
- Step4: Create a Cluster
- Step5: Provision the Network Fabric
- Step6: Provision the Cluster

**Note** that the example commands and parameters are more completely defined in the API documents.

## Resource Provider models and API Guide, and Metrics

The [API guide](https://docs.microsoft.com/en-us/rest/api/azure/azure-operator-distributed-srveices) provides
information on the resource providers and resource models, and the APIs.

The metrics generated from the logging data are available in [Azure Monitor metrics](https://docs.microsoft.com/en-us/azure/azure-monitor/essentials/data-platform-metrics).

Resource providers:

## Step 1: Create a Network Fabric Controller

Deployment of the Azure Operator Distributor Services (AODS) platform software starts
with the creation of a Network Fabric
Controller. Operators will login to their subscription to create a `Network
Fabric Controller` (NFC) in an Azure region to manage multiple network fabric
(NF) instances associated. Each network fabric instance is associated
with an on-premises AODS instance. Bootstrapping
and management of network fabric instances are performed from the NFC.

You'll create a Network Fabric Controller (NFC) prior to the first deployment
of an on-premises AODS instance. Each NFC can manage up to 32 AODS instances.
For subsequent network fabric deployments, managed by this
Fabric Controller, an NFC won't need to be created. After 32 AODS instances
have been deployed, another NFC will need to be created.

An NFC manages network fabric of AODS instances deployed in an Azure region.
You.ll need to create an NFC in every Azure region that you'll deploy
AODS instances in.

Create the NFC:

```azurecli
az nf controller create \
--resource-group "$NFC_RESOURCE_GROUP" \
--location "$LOCATION"  \
--resource-name "$NFC_RESOURCE_NAME" \
--ipv4-address-space "$NFC_MANAGEMENT_CLUSTER_IPV4" \
--ipv6-address-space "$NFC_MANAGEMENT_CLUSTER_IPV6" \
--infra-er-connections '[{"expressRouteCircuitId": "$INFRA_ER_CIRCUIT1_ID", \ 
  "expressRouteAuthorizationKey": "$INFRA_ER_CIRCUIT1_AUTH"}]'
--workload-er-connections '[{"expressRouteCircuitId": "$WORKLOAD_ER_CIRCUIT1_ID", \ 
  "expressRouteAuthorizationKey": "$WORKLOAD_ER_CIRCUIT1_AUTH"}]'
```

### Parameters required for Network Fabric Controller operations

| Parameter name    | Description                          |
|-|-|
| NFC_RESOURCE_GROUP | The resource group name                        |
| LOCATION | The Azure Region where the NFC will be deployed (for example, `eastus`)   |
| NFC_RESOURCE_NAME  | Resource Name of the Network Fabric Controller |
| NFC_MANAGEMENT_CLUSTER_IPV4   | Optional IPv4 Prefixes for NFC VNet. Can be specified at the time of creation. If unspecified, default value of `10.0.0.0/19` is assigned. The prefix should be at least of length `/19`          |
| NFC_MANAGEMENT_CLUSTER_IPV6   | Optional IPv6 Prefixes for NFC `vnet`. Can be specified at the time of creation. If unspecified, undefined. The prefix should be at least of length `/59` |
| INFRA_ER_CIRCUIT1_ID  | The name of express route circuit for infrastructure, must be of type Microsoft.Network/expressRouteCircuits/circuitName           |
| INFRA_ER_CIRCUIT1_AUTH | Authorization key for the circuit for infrastructure, must be of type Microsoft.Network/expressRouteCircuits/authorizations        |
| WORKLOAD_ER_CIRCUIT1_ID  | The name of express route circuit for workloads, must be of type Microsoft.Network/expressRouteCircuits/circuitName           |
| WORKLOAD_ER_CIRCUIT1_AUTH | Authorization key for the circuit for workloads, must be of type Microsoft.Network/expressRouteCircuits/authorizations        |

The Network Fabric Controller is created within the resource group in your Azure Subscription.

The Network Fabric Controller ID will be needed in the next steps to create
the Cluster Manager and Network Fabric resources. The v4 and v6 IP address
space is a private large subnet, recommended for `/16` in multi-rack
environments, which is used by the NFC to allocate IP to all devices in all Instances under the NFC and Cluster Manager domain.

### Validation

The NFC and a few other hosted resources will be created in the NFC hosted resource groups.
The additional resources include:

  * ExpressRoute Gateway,
  * Infrastructure vnet,
  * Tenant vnet,
  * Infrastructure Proxy/DNS/NTP VM,
  * storage account,
  * Key Vault,
  * SAW restricted jumpbox VM,
  * hosted AKS,
  * resources for each cluster, and 
  * Kubernetes clusters for the controller, infrastructure, and tenant.

View the status of the NFC:

```azurecli
az nf controller show --resource-group "$NFC_RESOURCE_GROUP" --resource-name "$NFC_RESOURCE_NAME"
```

The NFC deployment is complete when the `provisioningState` of the resource shows: `"provisioningState": "Succeeded"`

### Logging

NFC created logs can be viewed in:

  1. Azure portal Resource/ResourceGroup Activity logs.
  2. Azure CLI with `--debug` flag on the command-line.
  3. Resource provider logs based off subscription or correlation ID in debug

## Step 2: Create a Cluster Manager

A Cluster Manager (CM) represents the control-plane to manage one or more of your
on-premises Azure Operator Distributor Services clusters (instances).
The Cluster Manager is served by a User Resource Provider (RP) that
resides in an AKS cluster within your Subscription. The Cluster Manager
is responsible for the lifecycle management of your AODS cClusters (instances).
The CM will appear in your subscription as a resource.

A Fabric Controller is required before the Cluster Manager can be created.
There's a one-to-one dependency between the Network Fabric Controller and
Cluster Manager. You'll need to create a Cluster Manager every time another
NFC is created.

You need to create a CM before the first deployment of an AODS instance.
You don't need to create a CM for subsequent AODS on-premises deployments to be managed by
the same Cluster Manager.

Create Cluster Manager:

```azurecli
az networkcloud clustermanager create --name "$CM_RESOURCE_NAME" \
  --location "$LOCATION" --analytics-workspace-id "$LAW_ID" \
  --availability-zones "$AVAILABILITY_ZONES" --fabric-controller-id "$NFC_ID" \
  --managed-resource-group-configuration name="$CM_MRG_RG" \
  --tags $TAG1="$VALUE1" $TAG2="$VALUE2" \
  --resource-group "$CM_RESOURCE_GROUP"

az networkcloud clustermanager wait --created --name "$CM_RESOURCE_NAME" \
  --resource-group "$CM_RESOURCE_GROUP"
```

You can also create a Cluster Manger using ARM template/parameter files in
[ARM Template Editor](https://portal.azure.com/#create/Microsoft.Template):

### Parameters for use in Cluster Manager operations

| Parameter name    | Description                          |
|-|-|
| CM_RESOURCE_NAME  | Resource Name of the Network Fabric Controller |
| LAW_ID | Log Analytics Workspace ID for the CM |
| LOCATION | The Azure Region where the NFC will be deployed (for example,  `eastus`)   |
| AVAILABILITY_ZONES | List of targeted availability zones, recommended "1" "2" "3"   |
| CM_RESOURCE_GROUP | The resource group name                        |
| NFC_ID | ID for NFC integrated with this Cluster Manager from `az nf controller show` output |
| CM_MRG_RG | The resource group name for the Cluster Manager managed resource group |
| TAG/VALUE | Custom tag/value pairs to pass to Cluster Manager |

The Cluster Manager is created within the resource group in your Azure Subscription.

The CM Custom Location will be needed to create the Cluster.

### Validation

The CM creation will also create other resources in the CM hosted resource groups.
These additional resources include a storage account, Key Vault, AKS cluster,
managed identity, and a custom location.

You can view the status of the CM:

```azurecli
az networkcloud clustermanager show --resource-group "$CM_RESOURCE_GROUP" \
  --name $CM_RESOURCE_NAME"
```

The CM deployment is complete when the `provisioningState` of the resource shows: `"provisioningState": "Succeeded",`

### Logging

CM create logs can be viewed in:

  1. Azure portal Resource/ResourceGroup Activity logs.
  2. Azure CLI with `--debug` flag passed on command-line.
  3. Resource provider logs based off subscription or correlation ID in debug

## Step 3: Create Network Fabric

The network fabric instance (NF) is a collection of all network devices
described in the previous section, associated with a single AODS instance. The NF
instance interconnects compute servers and storage instances within an AODS
instance. The NF facilitates connectivity to and from your network to
the AODS instance.

Create the Network Fabric:

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

Create the Network Fabric Racks (Aggregate and Compute Racks).
Repeat for each rack in the SKU.

```azurecli
az nf rack create  \
--resource-group "$FABRIC_RG"  \
--location "$LOCATION"  \
--network-rack-sku "$RACK_SKU"  \
--nf-id "$FABRIC_ID" \
--resource-name "$RACK_RESOURCE_NAME"
```

Update the Network Fabric Device names and Serial Numbers for all devices.
Repeat for each device in the SKU.

```azurecli
az nf device update  --resource-group "$FABRIC_RG" \
  --location "$LOCATION"  \
  --resource-name "$DEVICE_RESOURCE_NAME" \
  --device-name "$DEVICE_NAME" \
  --network-device-role "$DEVICE_ROLE" --serial-number "$DEVICE_SN"
```

### Parameters for Network Fabric operations

| Parameter name    | Description                          |
|-|-|
| FABRIC_RESOURCE_NAME  | Resource Name of the Network Fabric Controller |
| LOCATION | The Azure Region where the NFC will be deployed (for example, `eastus`)   |
| FABRIC_RG | The resource group name                        |
| NF_SKU | SKU of the Network Fabric that needs to be created |
| NFC_ID | Reference to Network Fabric Controller |
| NNI_FABRIC_ASN | ASN of PE devices |
| NNI_PEER_ASN | Router Id to be used for MP-BGP between PE and CE |
| L3_IPV4_PREFIX1 | L3 IPV4 Primary Prefix |
| L3_IPV4_PREFIX2 | L3 IPV4 Secondary Prefix |
| TS_IPV4_PREFIX1 | Primary TS IPV4 Prefix |
| TS_IPV4_PREFIX2 | Secondary TS IPV4 Prefix |
| TS_USER | Username of Terminal Server |
| TS_PASS | Password for Terminal Server username |
| IR_TARGETS | Import route targets of management VPN (MP-BGP) to NFC via PE devices and express route. |
| ER_TARGETS | Export route targets of management VPN (MP-BGP) to NFC via PE devices and express route. |
| WL_IR_TARGETS | Import route targets of workload VPN (MP-BGP) to NFC via PE devices and express route. |
| WL_ER_TARGETS | Export route targets of workload VPN (MP-BGP) to NFC via PE devices and express route. |
| RACK_SKU | SKU of the Network Fabric Rack that needs to be created |
| RACK_RESOURCE_NAME | RACK resource name |
| DEVICE_RESOURCE_NAME | Device resource name |
| DEVICE_NAME | Device customer name |
| DEVICE_ROLE | Device Type (CE/NPB/MGMT/TOR) |
| DEVICE_SN | Device serial number for DHCP using format `*VENDOR*;*DEVICE_MODEL*;*DEVICE_HW_VER*;*DEVICE_SN*` (for example, `Arista;DCS-7280DR3K-24;12.04;JPE22113317`) |

### Validation

The Network Fabric creation will result in the Fabric Resource and other hosted resources to be created in the Fabric hosted resource groups. The additional resources include racks, devices, MTU size, IP Address prefixes.

View the status of the Fabric:

```azurecli
az nf fabric show --resource-group "$FABRIC_RG" \
  --resource-name $FABRIC_RESOURCE_NAME"
```

The Fabric deployment is complete when the `provisioningState` of the resource shows: `"operationalState": "Succeeded"`

### Logging

Fabric create Logs can be viewed in the following locations:

  1. Azure Portal Resource/ResourceGroup Activity logs.
  2. Azure CLI with `--debug` flag passed on command-line.

## Step 4: Create a Cluster

The Cluster resource represents an on-premises deployment of the platform
within the Cluster Manager. All other platform-specific resources are
dependent upon it for their lifecycle.

You should have successfully created the Network Fabric for this on-premises deployment.
Each AODS on-premises instance (a.k.a, Cluster) has one-to-one association
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
  --network-fabric-id "$NFC_ID" \
  --cluster-service-principal application-id="$SP_APP_ID" \
    password="$SP_PASS" principal-id="$SP_ID" tenant-id="$TENANT_ID" \
  --cluster-type "$CLUSTER_TYPE" --cluster-version "$CLUSTER_VERSION" \
  --tags $TAG_KEY1="$TAG_VALUE1" $TAG_KEY2="$TAG_VALUE2"

az networkcloud cluster wait --created --name "$CLUSTER_NAME" --resource-group
"$CLUSTER_RG"
```

You can instead create a Cluster with ARM template/parameter files in
[ARM Template Editor](https://portal.azure.com/#create/Microsoft.Template):

### Parameters for Cluster operations

| Parameter name    | Description                          |
|-|-|
| CLUSTER_NAME  | Resource Name of the Cluster |
| LOCATION | The Azure Region where the Cluster will be deployed  |
| CL_NAME | The Cluster Manager Custom Location from Azure Portal  |
| CLUSTER_RG | The cluster resource group name      |
| LAW_ID | Log Analytics Workspace ID for the Cluster |
| CLUSTER_LOCATION | The local name of the Cluster |
| AGGR_RACK_RESOURCE_ID | RackID for Aggregator Rack |
| AGGR_RACK_SKU | Rack SKU for Aggregator Rack |
| AGGR_RACK_SN | Rack Serial Number for Aggregator Rack |
| AGGR_RACK_LOCATION | Rack physical location for Aggregator Rack |
| AGGR_RACK_BMM | Used for single rack deployment only, empty for multi-rack |
| SA_NAME | Storage Appliance Device name |
| SA_PASS | Storage Appliance admin password |
| SA_USER | Storage Appliance admin user |
| SA_SN | Storage Appliance Seria Number |
| COMPX_RACK_RESOURCE_ID | RackID for CompX Rack, repeat for each rack in compute-rack-definitions |
| COMPX_RACK_SKU | Rack SKU for CompX Rack, repeat for each rack in compute-rack-definitions |
| COMPX_RACK_SN | Rack Serial Number for CompX Rack, repeat for each rack in compute-rack-definitions |
| COMPX_RACK_LOCATION | Rack physical location for CompX Rack, repeat for each rack in compute-rack-definitions |
| COMPX_SVRY_BMC_PASS | CompX Rack ServerY BMC password, repeat for each rack in compute-rack-definitions and for each server in rack |
| COMPX_SVRY_BMC_USER | CompX Rack ServerY BMC user, repeat for each rack in compute-rack-definitions and for each server in rack |
| COMPX_SVRY_BMC_MAC | CompX Rack ServerY BMC MAC Address, repeat for each rack in compute-rack-definitions and for each server in rack |
| COMPX_SVRY_BOOT_MAC | CompX Rack ServerY boot NIC MAC Address, repeat for each rack in compute-rack-definitions and for each server in rack |
| COMPX_SVRY_SERVER_DETAILS | CompX Rack ServerY details, repeat for each rack in compute-rack-definitions and for each server in rack |
| COMPX_SVRY_SERVER_NAME | CompX Rack ServerY name, repeat for each rack in compute-rack-definitions and for each server in rack |
| MRG_NAME | Cluster managed resource group name |
| MRG_LOCATION | Cluster Azure region |
| NFC_ID | Reference to Network Fabric Controller |
| SP_APP_ID | Service Principal App ID |
| SP_PASS | Service Principal Password |
| SP_ID | Service Principal ID |
| TENANT_ID | Subscription tenant ID |
| CLUSTER_TYPE | Type of cluster, Single or MultiRack |
| CLUSTER_VERSION | NC Version of cluster |
| TAG_KEY1 | Optional tag1 to pass to Cluster Create |
| TAG_VALUE1 | Optional tag1 value to pass to Cluster Create |
| TAG_KEY2 | Optional tag2 to pass to Cluster Create |
| TAG_VALUE2 | Optional tag2 value to pass to Cluster Create |

### Validation

A successful AODS Cluster creation will result in the creation of an AKS Cluster
inside your subscription. The cluster id, cluster provisioning state and
deployment state are returned as a result of a successful `cluster create`.

View the status of the Cluster:

```azurecli
az networkcloud cluster show --resource-group "$CLUSTER_RG" \
  --resource-name "$CLUSTER_RESOURCE_NAME"
```

The Cluster deployment is complete when the `provisioningState` of the resource
shows: `"provisioningState": "Succeeded"`

#### Logging

Cluster create Logs can be viewed in the following locations:

  1. Azure Portal Resource/ResourceGroup Activity logs.
  2. Azure CLI with `--debug` flag passed on command-line.

### Step 5: Provision Network Fabric

The network fabric instance (NF) is a collection of all network devices
associated with a single AODS instance. The NF
instance interconnects compute servers and storage instances within an AODS
instance. The NF also facilitates connectivity to and from your network into
the AODS instance.

Provision the Network Fabric:

```azurecli
az nf fabric provision --resource-group "$FABRIC_RG" \
  --resource-name "$FABRIC_RESOURCE_NAME" 
```

### Validation

Provisioning of the Fabric will result in the Fabric racks and device resources created
in the Fabric hosted resource groups. The following data is returned as a result of
successful Network Fabric create: racks, MTU size, IP Address prefixes, etc.

View the status of the Fabric:

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

## Step 6: Deploy Cluster

Once a Cluster has been created and the Rack Manifests have been added, the
deploy cluster action is triggered. The deploy cluster action creates the
bootstrap image and deploys the cluster.

Deploy Cluster will cause a sequence of events to occur in the Cluster Manager

1.  Validation of the cluster/rack manifests for completeness.
2.  Generation of a bootable image (for the ephemeral bootstrap cluster).
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

### Validation

Deploying the Cluster will result in the on-premises AODS control plane, racks,
compute machines, storage appliance and enrollment of the machines in the hosted
AKS resources in Azure.

View the status of the cluster:

```azurecli
az networkcloud Cluster show --resource-group "$CLUSTER_RG" \
  --resource-name "$CLUSTER_RESOURCE_NAME"
```

The Cluster deployment is complete when the `provisioningState` of the resource
shows: `"provisioningState": "Succeeded"`

### Logging

Cluster create Logs can be viewed in the following locations:

  1. Azure Portal Resource/ResourceGroup Activity logs.
  2. Azure CLI with `--debug` flag passed on command-line.
