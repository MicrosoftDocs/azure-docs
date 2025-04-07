---
title: "Azure Operator Nexus: How to configure the Cluster deployment"
description: Learn the steps for deploying the Operator Nexus Cluster.
author: JAC0BSMITH
ms.author: jacobsmith
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 10/29/2024
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

## Limitations

- **Naming** - Naming rules can be found [here](../azure-resource-manager/management/resource-name-rules.md#microsoftnetworkcloud).

## Create a Cluster

The Infrastructure Cluster resource represents an on-premises deployment of the platform
within the Cluster Manager. All other platform-specific resources are
dependent upon it for their lifecycle.

You should create the Network Fabric before this on-premises deployment.
Each Operator Nexus on-premises instance has a one-to-one association
with a Network Fabric.

> [!IMPORTANT]
> There's a known issue where updating a cluster immediately after creating it can cause cluster deployment failures. The problem happens when the resource is updated before the bmcConnectionString fields are populated in the `cluster.spec.computeRackDefinitions.bareMetalMachineConfigurationData` section. The bmcConnectionStrings are normally set within a few minutes of creating the Cluster.
>
> To avoid this issue, ensure that the bmcConnectionStrings contain nonempty values before updating the Cluster resource via Azure portal or the az networkcloud update command.
>
> To confirm the status, open the JSON properties for the Cluster (Operator Nexus) resource in Azure portal, or run an `az networkcloud cluster show` CLI command as shown in the following example. If the bmmConnectionString values show nonempty `redfish+https..` values, then it's safe to update the cluster. This issue will be fixed in a future release.
>
> Sample bmcConnectionString output for `az networkcloud cluster show -n cluster01 -g cluster01resourceGroup--query 'computeRackDefinitions[].bareMetalMachineConfigurationData[].bmcConnectionString' -o json` is as follows:
> 
> ```
> ["redfish+https://10.9.3.20/redfish/v1/Systems/System.Embedded.1",
> "redfish+https://10.9.3.19/redfish/v1/Systems/System.Embedded.1",
> "redfish+https://10.9.3.18/redfish/v1/Systems/System.Embedded.1",
> "redfish+https://10.9.3.17/redfish/v1/Systems/System.Embedded.1"]
> ```

### Create the Cluster using Azure CLI - single storage appliance:

>[!IMPORTANT]
>This command creates the cluster for a Nexus instance that contains a single storage appliance. If you run it against an instance with two storage appliances the second appliance will not be configured. Follow [the instructions for multiple storage appliances](#create-the-cluster-using-azure-cli---multiple-storage-appliances) if your Nexus instance includes two storage appliances.

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
  --storage-appliance-configuration-data '[{"adminCredentials":{"password":"$SA1_PASS","username":"$SA_USER"},"rackSlot":1,"serialNumber":"$SA1_SN","storageApplianceName":"$SA1_NAME"}]' \
  --compute-rack-definitions '[{"networkRackId": "$COMPX_RACK_RESOURCE_ID", "rackSkuId": "$COMPX_RACK_SKU", "rackSerialNumber": "$COMPX_RACK_SN", "rackLocation": "$COMPX_RACK_LOCATION", "storageApplianceConfigurationData": [], "bareMetalMachineConfigurationData":[{"bmcCredentials": {"password":"$COMPX_SVRY_BMC_PASS", "username":"$COMPX_SVRY_BMC_USER"}, "bmcMacAddress":"$COMPX_SVRY_BMC_MAC", "bootMacAddress":"$COMPX_SVRY_BOOT_MAC", "machineDetails":"$COMPX_SVRY_SERVER_DETAILS", "machineName":"$COMPX_SVRY_SERVER_NAME"}]}]'\
  --managed-resource-group-configuration name="$MRG_NAME" location="$MRG_LOCATION" \
  --network fabric-id "$NF_ID" \
  --cluster-service-principal application-id="$SP_APP_ID" \
    password="$SP_PASS" principal-id="$SP_ID" tenant-id="$TENANT_ID" \
  --subscription "$SUBSCRIPTION_ID" \
  --secret-archive "{key-vault-id:$KVRESOURCE_ID, use-key-vault:true}" \
  --cluster-type "$CLUSTER_TYPE" --cluster-version "$CLUSTER_VERSION" \
  --tags $TAG_KEY1="$TAG_VALUE1" $TAG_KEY2="$TAG_VALUE2"
```

### Create the Cluster using Azure CLI - multiple storage appliances:

"$AGGR_RACK_SKU" must be set to a value which supports two storage appliances. See [Operator Nexus Network Cloud SKUs](./reference-operator-nexus-skus.md) to pick an appropriate SKU. The cluster creation command also sets the default storage appliance for volume creation. The default appliance is the appliance with `"rackSlot":1` in its configuration data.

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
  --storage-appliance-configuration-data '[{"adminCredentials":{"password":"$SA1_PASS","username":"$SA_USER"},"rackSlot":1,"serialNumber":"$SA1_SN","storageApplianceName":"$SA1_NAME"},{"adminCredentials":{"password":"$SA2_PASS","username":"$SA_USER"},"rackSlot":2,"serialNumber":"$SA2_SN","storageApplianceName":"$SA2_NAME"}]' \
  --compute-rack-definitions '[{"networkRackId": "$COMPX_RACK_RESOURCE_ID", "rackSkuId": "$COMPX_RACK_SKU", "rackSerialNumber": "$COMPX_RACK_SN", "rackLocation": "$COMPX_RACK_LOCATION", "storageApplianceConfigurationData": [], "bareMetalMachineConfigurationData":[{"bmcCredentials": {"password":"$COMPX_SVRY_BMC_PASS", "username":"$COMPX_SVRY_BMC_USER"}, "bmcMacAddress":"$COMPX_SVRY_BMC_MAC", "bootMacAddress":"$COMPX_SVRY_BOOT_MAC", "machineDetails":"$COMPX_SVRY_SERVER_DETAILS", "machineName":"$COMPX_SVRY_SERVER_NAME"}]}]'\
  --managed-resource-group-configuration name="$MRG_NAME" location="$MRG_LOCATION" \
  --network fabric-id "$NF_ID" \
  --cluster-service-principal application-id="$SP_APP_ID" \
    password="$SP_PASS" principal-id="$SP_ID" tenant-id="$TENANT_ID" \
  --subscription "$SUBSCRIPTION_ID" \
  --secret-archive "{key-vault-id:$KVRESOURCE_ID, use-key-vault:true}" \
  --cluster-type "$CLUSTER_TYPE" --cluster-version "$CLUSTER_VERSION" \
  --tags $TAG_KEY1="$TAG_VALUE1" $TAG_KEY2="$TAG_VALUE2"
```

### Parameters for cluster operations

| Parameter name            | Description                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CLUSTER_NAME              | Resource Name of the Cluster                                                                                                                            |
| LOCATION                  | The Azure Region where the Cluster is deployed                                                                                                          |
| CL_NAME                   | The Cluster Manager Custom Location from Azure portal                                                                                                   |
| CLUSTER_RG                | The cluster resource group name                                                                                                                         |
| LAW_ID                    | Log Analytics Workspace ID for the Cluster                                                                                                              |
| CLUSTER_LOCATION          | The local name of the Cluster                                                                                                                           |
| AGGR_RACK_RESOURCE_ID     | RackID for Aggregator Rack                                                                                                                              |
| AGGR_RACK_SKU             | Rack SKU for Aggregator Rack \*See [Operator Nexus Network Cloud SKUs](./reference-operator-nexus-skus.md)                                              |
| AGGR_RACK_SN              | Rack Serial Number for Aggregator Rack                                                                                                                  |
| AGGR_RACK_LOCATION        | Rack physical location for Aggregator Rack                                                                                                              |
| AGGR_RACK_BMM             | Used for single rack deployment only, empty for multi-rack                                                                                              |
| SA1_NAME                   | First Storage Appliance Device name                                                                                                                           |
| SA2_NAME                   | Second Storage Appliance Device name                                                                                                                           |
| SA1_PASS                   | First Storage Appliance admin password                                                                                                                        |
| SA2_PASS                   | Second Storage Appliance admin password                                                                                                                        |
| SA_USER                   | Storage Appliance admin user                                                                                                                            |
| SA1_SN                     | First Storage Appliance Serial Number                                                                                                                         |
| SA2_SN                     | Second Storage Appliance Serial Number                                                                                                                         |
| COMPX_RACK_RESOURCE_ID    | RackID for CompX Rack; repeat for each rack in compute-rack-definitions                                                                                 |
| COMPX_RACK_SKU            | Rack SKU for CompX Rack; repeat for each rack in compute-rack-definitions \*See [Operator Nexus Network Cloud SKUs](./reference-operator-nexus-skus.md) |
| COMPX_RACK_SN             | Rack Serial Number for CompX Rack; repeat for each rack in compute-rack-definitions                                                                     |
| COMPX_RACK_LOCATION       | Rack physical location for CompX Rack; repeat for each rack in compute-rack-definitions                                                                 |
| COMPX_SVRY_BMC_PASS       | CompX Rack ServerY Baseboard Management Controller (BMC) password; repeat for each rack in compute-rack-definitions and for each server in rack         |
| COMPX_SVRY_BMC_USER       | CompX Rack ServerY BMC user; repeat for each rack in compute-rack-definitions and for each server in rack                                               |
| COMPX_SVRY_BMC_MAC        | CompX Rack ServerY BMC MAC address; repeat for each rack in compute-rack-definitions and for each server in rack                                        |
| COMPX_SVRY_BOOT_MAC       | CompX Rack ServerY boot Network Interface Card (NIC) MAC address; repeat for each rack in compute-rack-definitions and for each server in rack          |
| COMPX_SVRY_SERVER_DETAILS | CompX Rack ServerY details; repeat for each rack in compute-rack-definitions and for each server in rack                                                |
| COMPX_SVRY_SERVER_NAME    | CompX Rack ServerY name; repeat for each rack in compute-rack-definitions and for each server in rack                                                   |
| MRG_NAME                  | Cluster managed resource group name                                                                                                                     |
| MRG_LOCATION              | Cluster Azure region                                                                                                                                    |
| NF_ID                     | Reference to Network Fabric                                                                                                                             |
| SP_APP_ID                 | Service Principal App ID                                                                                                                                |
| SP_PASS                   | Service Principal Password                                                                                                                              |
| SP_ID                     | Service Principal ID                                                                                                                                    |
| TENANT_ID                 | Subscription tenant ID                                                                                                                                  |
| SUBSCRIPTION_ID           | Subscription ID                                                                                                                                         |
| KV_RESOURCE_ID            | Key Vault ID                                                                                                                                            |
| CLUSTER_TYPE              | Type of cluster, Single, or MultiRack                                                                                                                   |
| CLUSTER_VERSION           | Network Cloud (NC) Version of cluster                                                                                                                   |
| TAG_KEY1                  | Optional tag1 to pass to Cluster Create                                                                                                                 |
| TAG_VALUE1                | Optional tag1 value to pass to Cluster Create                                                                                                           |
| TAG_KEY2                  | Optional tag2 to pass to Cluster Create                                                                                                                 |
| TAG_VALUE2                | Optional tag2 value to pass to Cluster Create                                                                                                           |

## Cluster Identity

From the 2024-07-01 API version, a customer can assign managed identity to a Cluster. Both System-assigned and User-Assigned managed identities are supported.

Once added, the Identity can only be removed via the API call at this time.

For more information on managed identities for Operator Nexus Clusters, see [Azure Operator Nexus Cluster Support for Managed Identities and User Provided Resources](./howto-cluster-managed-identity-user-provided-resources.md).

### Create the Cluster using Azure Resource Manager template editor

An alternate way to create a Cluster is with the ARM template editor.

In order to create the cluster this way, you need to provide a template file (cluster.jsonc) and a parameter file (cluster.parameters.jsonc).
You can find examples for an 8-Rack 2M16C SKU cluster using these two files:

[cluster.jsonc](./cluster-jsonc-example.md) ,
[cluster.parameters.jsonc](./cluster-parameters-jsonc-example.md)

> [!NOTE]
> To get the correct formatting, copy the raw code file. The values within the cluster.parameters.jsonc file are customer specific and might not be a complete list. Update the value fields for your specific environment.

1. Navigate to [Azure portal](https://portal.azure.com/) in a web browser and sign in.
1. Search for 'Deploy a custom template' in the Azure portal search bar, and then select it from the available services.
1. Select Build your own template in the editor.
1. Select Load file. Locate your cluster.jsonc template file and upload it.
1. Select Save.
1. Select Edit parameters.
1. Select Load file. Locate your cluster.parameters.jsonc parameters file and upload it.
1. Select Save.
1. Select the correct Subscription.
1. Search for the Resource group to see if it already exists. If not, create a new Resource group.
1. Make sure all Instance Details are correct.
1. Select Review + create.

### Cluster validation

A successful Operator Nexus Cluster creation results in the creation of an Azure resource
inside your subscription. The cluster ID, cluster provisioning state, and
deployment state are returned as a result of a successful `cluster create`.

View the status of the Cluster:

```azurecli
az networkcloud cluster show --cluster-name "<clusterName>" /
--resource-group "<resourceGroupName>" /
--subscription <subscriptionID>
```

The Cluster creation is complete when the `provisioningState` of the resource
shows: `"provisioningState": "Succeeded"`

### Cluster logging

Cluster create Logs can be viewed in the following locations:

1. Azure portal Resource/ResourceGroup Activity logs.
2. Azure CLI with `--debug` flag passed on command-line.

### Set deployment thresholds

There are two types of deployment thresholds that can be set on a cluster before cluster deployment: `compute-deployment-threshold` and `update-strategy`.

**--compute-deployment-threshold - The validation threshold indicating the allowable failures of compute nodes during environment hardware validation.**

If `compute-deployment-threshold` isn't set, the defaults are as follows:

```
      "strategyType": "Rack",
      "thresholdType": "PercentSuccess",
      "thresholdValue": 80,
      "waitTimeMinutes": 1
```

If the customer requests a `compute-deployment-threshold` that is different from the default of 80%, you can run the following cluster update command.

This example is for a customer requesting type "PercentSuccess" with a success rate of 97%.

```azurecli
az networkcloud cluster update --name "<clusterName>" /
--resource-group "<resourceGroup>" /
--compute-deployment-threshold type="PercentSuccess" grouping="PerCluster" value=97 /
--subscription <subscriptionID>
```

### Validate update

```
az networkcloud cluster show --resource-group "<resourceGroup>" --name "<clusterName>" | grep -a3 computeDeploymentThreshold

  "clusterType": "MultiRack",
  "clusterVersion": "<CLUSTER_VERSION>",
  "computeDeploymentThreshold": {
    "grouping": "PerCluster",
    "type": "PercentSuccess",
    "value": 97
```

In this example, if less than 97% of the compute nodes being deployed pass hardware validation, the cluster deployment fails. **NOTE: All kubernetes control plane (KCP) and nexus management plane (NMP) must pass hardware validation.** If 97% or more of the compute nodes being deployed pass hardware validation, the cluster deployment continues to the bootstrap provisioning phase. During compute bootstrap provisioning, the `update-strategy` is used for compute nodes.

**--update-strategy - The strategy for updating the cluster indicating the allowable compute node failures during bootstrap provisioning.**

If the customer requests an `update-strategy` threshold that is different from the default of 80%, you can run the following cluster update command.

```azurecli
az networkcloud cluster update --name "<clusterName>" /
--resource-group "<resourceGroup>" /
--update-strategy strategy-type="Rack" threshold-type="PercentSuccess" /
threshold-value="<thresholdValue>" wait-time-minutes=<waitTimeBetweenRacks> /
--subscription <subscriptionID>
```

The strategy-type can be "Rack" (Rack by Rack) OR "PauseAfterRack" (Wait for customer response to continue).

The threshold-type can be "PercentSuccess" OR "CountSuccess"

If updateStrategy isn't set, the defaults are as follows:

```
      "strategyType": "Rack",
      "thresholdType": "PercentSuccess",
      "thresholdValue": 80,
      "waitTimeMinutes": 1
```

This example is for a customer using Rack by Rack strategy with a Percent Success of 60% and a 1-minute pause.

```azurecli
az networkcloud cluster update --name "<clusterName>" /
--resource-group "<resourceGroup>" /
--update-strategy strategy-type="Rack" threshold-type="PercentSuccess" /
threshold-value=60 wait-time-minutes=1 /
--subscription <subscriptionID>
```

Verify update:

```
az networkcloud cluster show --resource-group "<resourceGroup>" /
--name "<clusterName>" /
--subscription <subscriptionID>| grep -a5 updateStrategy

      "strategyType": "Rack",
      "thresholdType": "PercentSuccess",
      "thresholdValue": 60,
      "waitTimeMinutes": 1
```

In this example, if less than 60% of the compute nodes being provisioned in a rack fail to provision (on a rack by rack basis), the cluster deployment fails. If 60% or more of the compute nodes are successfully provisioned, cluster deployment moves on to the next rack of compute nodes.

This example is for a customer using Rack by Rack strategy with a threshold type CountSuccess of 10 nodes per rack and a 1-minute pause.

```azurecli
az networkcloud cluster update --name "<clusterName>" /
--resource-group "<resourceGroup>" /
--update-strategy strategy-type="Rack" threshold-type="CountSuccess" /
threshold-value=10 wait-time-minutes=1 /
--subscription <subscriptionID>
```

Verify update:

```
az networkcloud cluster show --resource-group "<resourceGroup>" /
--name "<clusterName>" /
--subscription <subscriptionID>| grep -a5 updateStrategy

      "strategyType": "Rack",
      "thresholdType": "CountSuccess",
      "thresholdValue": 10,
      "waitTimeMinutes": 1
```

In this example, if less than 10 compute nodes being provisioned in a rack fail to provision (on a rack by rack basis), the cluster deployment fails. If 10 or more of the compute nodes are successfully provisioned, cluster deployment moves on to the next rack of compute nodes.

> [!NOTE]
> Deployment thresholds can't be changed after cluster deployment starts.

## Deploy Cluster

The deploy Cluster action can be triggered after creating the Cluster.
The deploy Cluster action creates the bootstrap image and deploys the Cluster.

Deploy Cluster initiates a sequence of events that occur in the Cluster Manager.

1.  Validation of the cluster/rack properties.
2.  Generation of a bootable image for the ephemeral bootstrap cluster
    (Validation of Infrastructure).
3.  Interaction with the Intelligent Platform Management Interface (IPMI) interface of the targeted bootstrap machine.
4.  Performing hardware validation checks.
5.  Monitoring of the Cluster deployment process.

Deploy the on-premises Cluster:

```azurecli
az networkcloud cluster deploy \
  --name "$CLUSTER_NAME" \
  --resource-group "$CLUSTER_RG" \
  --subscription "$SUBSCRIPTION_ID" \
  --no-wait --debug
```

> [!TIP]
> To check the status of the `az networkcloud cluster deploy` command, it can be executed using the `--debug` flag.
> This command allows you to obtain the `Azure-AsyncOperation` or `Location` header used to query the `operationStatuses` resource.
> See the section [Cluster Deploy Failed](#cluster-deploy-failed) for more detailed steps.
> Optionally, the command can run asynchronously using the `--no-wait` flag.

### Cluster Deployment with hardware validation

During a Cluster deploy process, one of the steps executed is hardware validation.
The hardware validation procedure runs various test and checks against the machines
provided through the Cluster's rack definition. Based on the results of these checks
and any user skipped machines, a determination is done on whether sufficient nodes
passed and/or are available to meet the thresholds necessary for deployment to continue.

> [!IMPORTANT]
> The hardware validation process writes the results to the specified `analyticsWorkspaceId` at Cluster Creation.
> Additionally, the provided Service Principal in the Cluster object is used for authentication against the Log Analytics Workspace Data Collection API.
> This capability is only visible during a new deployment (Green Field); existing cluster doesn't have the logs available retroactively.

> [!NOTE]
> The RAID controller is reset during Cluster deployment wiping all data from the server's virtual disks. Any Baseboard Management Controller (BMC) virtual disk alerts can typically be ignored unless there are more physical disk and/or RAID controllers alerts.

By default, the hardware validation process writes the results to the configured Cluster `analyticsWorkspaceId`.
However, due to the nature of Log Analytics Workspace data collection and schema evaluation, there can be ingestion delay that can take several minutes or more.
For this reason, the Cluster deployment proceeds even if there was a failure to write the results to the Log Analytics Workspace.
To help address this possible event, the results, for redundancy, are also logged within the Cluster Manager.

In the provided Cluster object's Log Analytics Workspace, a new custom table with the Cluster's name as prefix and the suffix `*_CL` should appear.
In the _Logs_ section of the LAW resource, a query can be executed against the new `*_CL` Custom Log table.

#### Cluster Deployment with skipping specific bare-metal-machine

The `--skip-validation-for-machines` parameter represents the names of
bare metal machines in the cluster that should be skipped during hardware validation.
Nodes skipped aren't validated and aren't added to the node pool.
Additionally, nodes skipped don't count against the total used by threshold calculations.

```azurecli
az networkcloud cluster deploy \
  --name "$CLUSTER_NAME" \
  --resource-group "$CLUSTER_RG" \
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
OPERATION_ID="aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e*99399E995..."
az rest -m GET -u "https://management.azure.com/subscriptions/${SUBSCRIPTION_ID}/providers/Microsoft.NetworkCloud/locations/${LOCATION}/operationStatuses/${OPERATION_ID}?api-version=2022-12-12-preview"
```

The output is similar to the JSON struct example. When the error code is
`HardwareValidationThresholdFailed`, then the error message contains a list of bare
metal machines that failed the hardware validation (for example, `COMP0_SVR0_SERVER_NAME`,
`COMP1_SVR1_SERVER_NAME`). These names can be used to parse the logs for further details.

```json
{
  "endTime": "2023-03-24T14:56:59.0510455Z",
  "error": {
    "code": "HardwareValidationThresholdFailed",
    "message": "HardwareValidationThresholdFailed error hardware validation threshold for cluster layout plan is not met for cluster $CLUSTER_NAME in namespace nc-system with listed failed devices $COMP0_SVR0_SERVER_NAME, $COMP1_SVR1_SERVER_NAME"
  },
  "id": "/subscriptions/$SUBSCRIPTION_ID/providers/Microsoft.NetworkCloud/locations/$LOCATION/operationStatuses/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e*99399E995...",
  "name": "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e*99399E995...",
  "resourceId": "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$CLUSTER_RESOURCE_GROUP/providers/Microsoft.NetworkCloud/clusters/$CLUSTER_NAME",
  "startTime": "2023-03-24T14:56:26.6442125Z",
  "status": "Failed"
}
```

For another example, see the article [Tracking Asynchronous Operations Using Azure CLI](./howto-track-async-operations-cli.md).
For more information that might be helpful when specific machines fail validation or deployment, see [Troubleshoot Bare Metal Machine(BMM) provisioning](./troubleshoot-bare-metal-machine-provisioning.md).

## Cluster deployment validation

View the status of the cluster on the portal, or via the Azure CLI:

```azurecli
az networkcloud cluster show --resource-group "$CLUSTER_RG" \
  --name "$CLUSTER_NAME"
```

The Cluster deployment is in-progress when detailedStatus is set to `Deploying` and detailedStatusMessage shows the progress of deployment.
Some examples of deployment progress shown in detailedStatusMessage are `Hardware validation is in progress.` (if cluster is deployed with hardware validation), `Cluster is bootstrapping.`, `KCP initialization in progress.`, `Management plane deployment in progress.`, `Cluster extension deployment in progress.`, `waiting for "<rack-ids>" to be ready`, etc.

:::image type="content" source="./media/nexus-deploy-kcp-status.png" lightbox="./media/nexus-deploy-kcp-status.png" alt-text="Screenshot of Azure portal showing cluster deploy progress kcp init.":::

:::image type="content" source="./media/nexus-deploy-extension-status.png" lightbox="./media/nexus-deploy-extension-status.png" alt-text="Screenshot of Azure portal showing cluster deploy progress extension application.":::

The Cluster deployment is complete when detailedStatus is set to `Running` and detailedStatusMessage shows message `Cluster is up and running`.

:::image type="content" source="./media/nexus-deploy-complete-status.png" lightbox="./media/nexus-deploy-complete-status.png" alt-text="Screenshot of Azure portal showing cluster deploy complete.":::

View the management version of the cluster:

```azurecli
az k8s-extension list --cluster-name "$CLUSTER_NAME" --resource-group "$MRG_NAME" --cluster-type connectedClusters --query "[?name=='nc-platform-extension'].{name:name, extensionType:extensionType, releaseNamespace:scope.cluster.releaseNamespace,provisioningState:provisioningState,version:version}" -o table --subscription "$SUBSCRIPTION_ID"
```

## Cluster deployment Logging

Cluster create Logs can be viewed in the following locations:

1. Azure portal Resource/ResourceGroup Activity logs.
2. Azure CLI with `--debug` flag passed on command-line.

:::image type="content" source="./media/nexus-deploy-activity-log.png" lightbox="./media/nexus-deploy-activity-log.png" alt-text="Screenshot of Azure portal showing cluster deploy progress activity log.":::

## Delete a cluster

Deleting a cluster deletes the resources in Azure and the cluster that resides in the on-premises environment.

> [!NOTE]
> If there are any tenant resources that exist in the cluster, it doesn't get deleted until those resources are deleted.

:::image type="content" source="./media/nexus-delete-failure.png" lightbox="./media/nexus-delete-failure.png" alt-text="Screenshot of the portal showing the failure to delete because of tenant resources.":::

```azurecli
az networkcloud cluster delete --name "$CLUSTER_NAME" --resource-group "$CLUSTER_RG"
```

> [!NOTE]
> The recommendation is to wait for 20 minutes after deleting cluster before trying to create a new cluster with the same name.
