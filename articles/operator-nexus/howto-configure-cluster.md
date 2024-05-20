---
title: "Azure Operator Nexus: How to configure the Cluster deployment"
description: Learn the steps for deploying the Operator Nexus Cluster.
author: JAC0BSMITH
ms.author: jacobsmith
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 02/08/2024
ms.custom: template-how-to, devx-track-azurecli
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

The Infrastructure Cluster resource represents an on-premises deployment of the platform
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
  --secret-archive "{key-vault-id:$KVRESOURCE_ID, use-key-vault:true}" \
  --cluster-type "$CLUSTER_TYPE" --cluster-version "$CLUSTER_VERSION" \
  --tags $TAG_KEY1="$TAG_VALUE1" $TAG_KEY2="$TAG_VALUE2"

```

You can instead create a Cluster with ARM template/parameter files in
[ARM Template Editor](https://portal.azure.com/#create/Microsoft.Template):

### Parameters for cluster operations

| Parameter name            | Description                                                                                                           |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| CLUSTER_NAME              | Resource Name of the Cluster                                                                                          |
| LOCATION                  | The Azure Region where the Cluster is deployed                                                                   |
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
| KV_RESOURCE_ID            | Key Vault ID                                                                                                          |
| CLUSTER_TYPE              | Type of cluster, Single or MultiRack                                                                                  |
| CLUSTER_VERSION           | NC Version of cluster                                                                                                 |
| TAG_KEY1                  | Optional tag1 to pass to Cluster Create                                                                               |
| TAG_VALUE1                | Optional tag1 value to pass to Cluster Create                                                                         |
| TAG_KEY2                  | Optional tag2 to pass to Cluster Create                                                                               |
| TAG_VALUE2                | Optional tag2 value to pass to Cluster Create                                                                         |

### Cluster validation

A successful Operator Nexus Cluster creation results in the creation of an AKS cluster
inside your subscription. The cluster ID, cluster provisioning state and
deployment state are returned as a result of a successful `cluster create`.

View the status of the Cluster:

```azurecli
az networkcloud cluster show --resource-group "$CLUSTER_RG" \
  --resource-name "$CLUSTER_RESOURCE_NAME"
```

The Cluster creation is complete when the `provisioningState` of the resource
shows: `"provisioningState": "Succeeded"`

### Cluster logging

Cluster create Logs can be viewed in the following locations:

1. Azure portal Resource/ResourceGroup Activity logs.
2. Azure CLI with `--debug` flag passed on command-line.

## Deploy Cluster

Once a Cluster has been created, the deploy cluster action can be triggered.
The deploy Cluster action creates the bootstrap image and deploys the Cluster.

Deploy Cluster initiates a sequence of events to occur in the Cluster Manager

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
  --subscription "$SUBSCRIPTION_ID" \
  --no-wait --debug
```

> [!TIP]
> To check the status of the `az networkcloud cluster deploy` command, it can be executed using the `--debug` flag.
> This will allow you to obtain the `Azure-AsyncOperation` or `Location` header used to query the `operationStatuses` resource.
> See the section [Cluster Deploy Failed](#cluster-deploy-failed) for more detailed steps.
> Optionally, the command can run asynchronously using the `--no-wait` flag.

### Cluster Deploy with hardware validation

During a Cluster deploy process, one of the steps executed is hardware validation.
The hardware validation procedure runs various test and checks against the machines
provided through the Cluster's rack definition. Based on the results of these checks
and any user skipped machines, a determination is done on whether sufficient nodes
passed and/or are available to meet the thresholds necessary for deployment to continue.

> [!IMPORTANT]
> The hardware validation process will write the results to the specified `analyticsWorkspaceId` at Cluster Creation.
> Additionally, the provided Service Principal in the Cluster object is used for authentication against the Log Analytics Workspace Data Collection API.
> This capability is only visible during a new deployment (Green Field); existing cluster will not have the logs available retroactively.

By default, the hardware validation process writes the results to the configured Cluster `analyticsWorkspaceId`.
However, due to the nature of Log Analytics Workspace data collection and schema evaluation, there can be ingestion delay that can take several minutes or more.
For this reason, the Cluster deployment proceeds even if there was a failure to write the results to the Log Analytics Workspace.
To help address this possible event, the results, for redundancy, are also logged within the Cluster Manager.

In the provided Cluster object's Log Analytics Workspace, a new custom table with the Cluster's name as prefix and the suffix `*_CL` should appear.
In the _Logs_ section of the LAW resource, a query can be executed against the new `*_CL` Custom Log table.

#### Cluster Deploy Action with skipping specific bare-metal-machine

A parameter can be passed in to the deploy command that represents the names of
bare metal machines in the cluster that should be skipped during hardware validation.
Nodes skipped aren't validated and aren't added to the node pool.
Additionally, nodes skipped don't count against the total used by threshold calculations.

```azurecli
az networkcloud cluster deploy \
  --name "$CLUSTER_NAME" \
  --resource-group "$CLUSTER_RESOURCE_GROUP" \
  --subscription "$SUBSCRIPTION_ID" \
  --skip-validations-for-machines "$COMPX_SVRY_SERVER_NAME"
```

#### Cluster Deploy failed

To track the status of an asynchronous operation, run with a `--debug` flag enabled.
When `--debug` is specified, the progress of the request can be monitored.
The operation status URL can be found by examining the debug output looking for the
`Azure-AsyncOperation` or `Location` header on the HTTP response to the creation request.
The headers can provide the `OPERATION_ID` field used in the HTTP API call.

```azurecli
OPERATION_ID="12312312-1231-1231-1231-123123123123*99399E995..."
az rest -m GET -u "https://management.azure.com/subscriptions/${SUBSCRIPTION_ID}/providers/Microsoft.NetworkCloud/locations/${LOCATION}/operationStatuses/${OPERATION_ID}?api-version=2022-12-12-preview"
```

The output is similar to the JSON struct example. When the error code is
`HardwareValidationThresholdFailed`, then the error message contains a list of bare
metal machine(s) that failed the hardware validation (for example, `COMP0_SVR0_SERVER_NAME`,
`COMP1_SVR1_SERVER_NAME`). These names can be used to parse the logs for further details.

```json
{
  "endTime": "2023-03-24T14:56:59.0510455Z",
  "error": {
    "code": "HardwareValidationThresholdFailed",
    "message": "HardwareValidationThresholdFailed error hardware validation threshold for cluster layout plan is not met for cluster $CLUSTER_NAME in namespace nc-system with listed failed devices $COMP0_SVR0_SERVER_NAME, $COMP1_SVR1_SERVER_NAME"
  },
  "id": "/subscriptions/$SUBSCRIPTION_ID/providers/Microsoft.NetworkCloud/locations/$LOCATION/operationStatuses/12312312-1231-1231-1231-123123123123*99399E995...",
  "name": "12312312-1231-1231-1231-123123123123*99399E995...",
  "resourceId": "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$CLUSTER_RESOURCE_GROUP/providers/Microsoft.NetworkCloud/clusters/$CLUSTER_NAME",
  "startTime": "2023-03-24T14:56:26.6442125Z",
  "status": "Failed"
}
```

See the article [Tracking Asynchronous Operations Using Azure CLI](./howto-track-async-operations-cli.md) for another example.

## Cluster deployment validation

View the status of the cluster on the portal, or via the Azure CLI:

```azurecli
az networkcloud cluster show --resource-group "$CLUSTER_RG" \
  --resource-name "$CLUSTER_RESOURCE_NAME"
```

The Cluster deployment is in-progress when detailedStatus is set to `Deploying` and detailedStatusMessage shows the progress of deployment. 
Some examples of deployment progress shown in detailedStatusMessage are `Hardware validation is in progress.` (if cluster is deployed with hardware validation) ,`Cluster is bootstrapping.`, `KCP initialization in progress.`, `Management plane deployment in progress.`, `Cluster extension deployment in progress.`, `waiting for "<rack-ids>" to be ready`, etc.

:::image type="content" source="./media/nexus-deploy-kcp-status.png" lightbox="./media/nexus-deploy-kcp-status.png" alt-text="Screenshot of Azure portal showing cluster deploy progress kcp init.":::

:::image type="content" source="./media/nexus-deploy-extension-status.png" lightbox="./media/nexus-deploy-extension-status.png" alt-text="Screenshot of Azure portal showing cluster deploy progress extension application.":::

The Cluster deployment is complete when detailedStatus is set to `Running` and detailedStatusMessage shows message `Cluster is up and running`.

:::image type="content" source="./media/nexus-deploy-complete-status.png" lightbox="./media/nexus-deploy-complete-status.png" alt-text="Screenshot of Azure portal showing cluster deploy complete.":::

View the management version of the cluster:

```azurecli
az k8s-extension list --cluster-name <cluster> --resource-group "$MANAGED_CLUSTER_RG" --cluster-type connectedClusters --query "[?name=='nc-platform-extension'].{name:name, extensionType:extensionType, releaseNamespace:scope.cluster.releaseNamespace,provisioningState:provisioningState,version:version}" -o table --subscription "$SUBSCRIPTION_ID"
```

## Cluster deployment Logging

Cluster create Logs can be viewed in the following locations:

1. Azure portal Resource/ResourceGroup Activity logs.
2. Azure CLI with `--debug` flag passed on command-line.

:::image type="content" source="./media/nexus-deploy-activity-log.png" lightbox="./media/nexus-deploy-activity-log.png" alt-text="Screenshot of Azure portal showing cluster deploy progress activity log.":::
