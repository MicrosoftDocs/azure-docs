---
title: "Azure Operator Nexus: How to configure the Cluster deployment"
description: Learn the steps for deploying the Operator Nexus Cluster.
author: bartpinto
ms.author: bpinto
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 05/22/2025
ms.custom: template-how-to, devx-track-azurecli
---

# Create and provision a Cluster using Azure CLI

This article describes how to create a Cluster by using the Azure Command Line Interface (AzCLI). This document also shows you how to check the status, update, or delete a Cluster.

## Prerequisites

- Verify that Network Fabric Controller and Cluster Manager exist in your Azure region
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
> To avoid this issue, ensure that the bmcConnectionStrings contain nonempty values before updating the Cluster resource via Azure portal or the `az networkcloud update` command.
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
>This command creates the cluster for a Nexus instance that contains a single storage appliance. If you run it against an instance with two storage appliances, the second appliance doesn't configure. Follow [the instructions for multiple storage appliances](#create-the-cluster-using-azure-cli---multiple-storage-appliances) if your Nexus instance includes two storage appliances.

```azurecli
az networkcloud cluster create --name "<CLUSTER_NAME>" --location "<LOCATION>" \
  --extended-location name="<CL_NAME>" type="CustomLocation" \
  --resource-group "<CLUSTER_RG>" \
  --analytics-workspace-id "<LAW_ID>" \
  --cluster-location "<CLUSTER_LOCATION>" \
  --network-rack-id "<AGGR_RACK_RESOURCE_ID>" \
  --rack-sku-id "<AGGR_RACK_SKU>"\
  --rack-serial-number "<AGGR_RACK_SN>" \
  --rack-location "<AGGR_RACK_LOCATION>" \
  --bare-metal-machine-configuration-data "["<AGGR_RACK_BMM>"]" \
  --storage-appliance-configuration-data '[{"adminCredentials":{"password":"<SA1_PASS>","username":"<SA_USER>"},"rackSlot":1,"serialNumber":"<SA1_SN>","storageApplianceName":"<SA1_NAME>"}]' \
  --compute-rack-definitions '[{"networkRackId": "<COMPX_RACK_RESOURCE_ID>", "rackSkuId": "<COMPX_RACK_SKU>", "rackSerialNumber": "<COMPX_RACK_SN>", "rackLocation": "<COMPX_RACK_LOCATION>", "storageApplianceConfigurationData": [], "bareMetalMachineConfigurationData":[{"bmcCredentials": {"password":"<COMPX_SVRY_BMC_PASS>", "username":"<COMPX_SVRY_BMC_USER>"}, "bmcMacAddress":"<COMPX_SVRY_BMC_MAC>", "bootMacAddress":"<COMPX_SVRY_BOOT_MAC>", "machineDetails":"<COMPX_SVRY_SERVER_DETAILS>", "machineName":"<COMPX_SVRY_SERVER_NAME>"}]}]'\
  --managed-resource-group-configuration name="<MRG_NAME>" location="<MRG_LOCATION>" \
  --network fabric-id "<NF_ID>" \
  --cluster-service-principal application-id="<SP_APP_ID>" \
    password="$SP_PASS" principal-id="$SP_ID" tenant-id="<TENANT_ID>" \
  --subscription "<SUBSCRIPTION_ID>" \
  --secret-archive-settings "{identity-type:<ID_TYPE>, vault-uri:<VAULT_URI>}" \
  --cluster-type "<CLUSTER_TYPE>" --cluster-version "<CLUSTER_VERSION>" \
  --tags <TAG_KEY1>="<TAG_VALUE1>" <TAG_KEY2>="<TAG_VALUE2>"
```

### Create the Cluster using Azure CLI - multiple storage appliances:

"<AGGR_RACK_SKU>" must be set to a value which supports two storage appliances. See [Operator Nexus Network Cloud SKUs](./reference-operator-nexus-skus.md) to pick an appropriate SKU. The cluster creation command also sets the default storage appliance for volume creation. The default appliance is the appliance with `"rackSlot":1` in its configuration data.

```azurecli
az networkcloud cluster create --name "<CLUSTER_NAME>" --location "<LOCATION>" \
  --extended-location name="<CL_NAME>" type="CustomLocation" \
  --resource-group "<CLUSTER_RG>" \
  --analytics-workspace-id "<LAW_ID>" \
  --cluster-location "<CLUSTER_LOCATION>" \
  --network-rack-id "<AGGR_RACK_RESOURCE_ID>" \
  --rack-sku-id "<AGGR_RACK_SKU>"\
  --rack-serial-number "<AGGR_RACK_SN>" \
  --rack-location "<AGGR_RACK_LOCATION>" \
  --bare-metal-machine-configuration-data "["<AGGR_RACK_BMM>"]" \
  --storage-appliance-configuration-data '[{"adminCredentials":{"password":"<SA1_PASS>","username":"<SA_USER>"},"rackSlot":1,"serialNumber":"<SA1_SN>","storageApplianceName":"<SA1_NAME>"},{"adminCredentials":{"password":"<SA2_PASS>","username":"<SA_USER>"},"rackSlot":2,"serialNumber":"<SA2_SN>","storageApplianceName":"<SA2_NAME>"}]' \
  --compute-rack-definitions '[{"networkRackId": "<COMPX_RACK_RESOURCE_ID>", "rackSkuId": "<COMPX_RACK_SKU>", "rackSerialNumber": "<COMPX_RACK_SN>", "rackLocation": "<COMPX_RACK_LOCATION>", "storageApplianceConfigurationData": [], "bareMetalMachineConfigurationData":[{"bmcCredentials": {"password":"<COMPX_SVRY_BMC_PASS>", "username":"<COMPX_SVRY_BMC_USER>"}, "bmcMacAddress":"<COMPX_SVRY_BMC_MAC>", "bootMacAddress":"<COMPX_SVRY_BOOT_MAC>", "machineDetails":"<COMPX_SVRY_SERVER_DETAILS>", "machineName":"<COMPX_SVRY_SERVER_NAME>"}]}]'\
  --managed-resource-group-configuration name="<MRG_NAME>" location="<MRG_LOCATION>" \
  --network fabric-id "<NF_ID>" \
  --cluster-service-principal application-id="<SP_APP_ID>" \
    password="$SP_PASS" principal-id="$SP_ID" tenant-id="<TENANT_ID>" \
  --subscription "<SUBSCRIPTION_ID>" \
  --secret-archive-settings "{identity-type:<ID_TYPE>, vault-uri:<VAULT_URI>}" \
  --cluster-type "<CLUSTER_TYPE>" --cluster-version "<CLUSTER_VERSION>" \
  --tags <TAG_KEY1>="<TAG_VALUE1>" <TAG_KEY2>="<TAG_VALUE2>"
```

### Parameters for Cluster operations

| Parameter name            | Description                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CLUSTER_NAME              | Resource Name of the Cluster                                                                                                                            |
| LOCATION                  | The Azure Region where the Cluster is deployed                                                                                                          |
| CL_NAME                   | The Cluster Manager Custom Location from Azure portal                                                                                                   |
| CLUSTER_RG                | The Cluster resource group name                                                                                                                         |
| LAW_ID                    | Log Analytics Workspace ID for the Cluster                                                                                                              |
| CLUSTER_LOCATION          | The local name of the Cluster                                                                                                                           |
| AGGR_RACK_RESOURCE_ID     | RackID for Aggregator Rack                                                                                                                              |
| AGGR_RACK_SKU             | The Rack Stock Keeping Unit (SKU) for Aggregator Rack \*See [Operator Nexus Network Cloud SKUs](./reference-operator-nexus-skus.md)                                              |
| AGGR_RACK_SN              | Rack Serial Number for Aggregator Rack                                                                                                                  |
| AGGR_RACK_LOCATION        | Rack physical location for Aggregator Rack                                                                                                              |
| AGGR_RACK_BMM             | Used for single rack deployment only, empty for multi-rack                                                                                              |
| SA1_NAME                   | First Storage Appliance Device name                                                                                                                           |
| SA2_NAME                   | Second Storage Appliance Device name                                                                                                                           |
| SA1_PASS                   | First Storage Appliance admin password reference URI or password value \*See [Key Vault Credential Reference](reference-key-vault-credential.md)                                                                                            |
| SA2_PASS                   | Second Storage Appliance admin password reference URI or password value \*See [Key Vault Credential Reference](reference-key-vault-credential.md)                                                                                             |
| SA_USER                   | Storage Appliance admin user                                                                                                                            |
| SA1_SN                     | First Storage Appliance Serial Number                                                                                                                         |
| SA2_SN                     | Second Storage Appliance Serial Number                                                                                                                         |
| COMPX_RACK_RESOURCE_ID    | RackID for CompX Rack; repeat for each rack in compute-rack-definitions                                                                                 |
| COMPX_RACK_SKU            | The Rack Stock Keeping Unit (SKU) for CompX Rack; repeat for each rack in compute-rack-definitions \*See [Operator Nexus Network Cloud Stock Keeping Unit (SKUs)](./reference-operator-nexus-skus.md) |
| COMPX_RACK_SN             | Rack Serial Number for CompX Rack; repeat for each rack in compute-rack-definitions                                                                     |
| COMPX_RACK_LOCATION       | Rack physical location for CompX Rack; repeat for each rack in compute-rack-definitions                                                                 |
| COMPX_SVRY_BMC_PASS       | CompX Rack ServerY Baseboard Management Controller (BMC) password reference URI or password value; repeat for each rack in compute-rack-definitions and for each server in rack \*See [Key Vault Credential Reference](reference-key-vault-credential.md)        |
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
| CLUSTER_TYPE              | Type of Cluster, Single, or MultiRack                                                                                                                   |
| CLUSTER_VERSION           | Network Cloud (NC) Version of Cluster                                                                                                                   |
| TAG_KEY1                  | Optional tag1 to pass to Cluster Create                                                                                                                 |
| TAG_VALUE1                | Optional tag1 value to pass to Cluster Create                                                                                                           |
| TAG_KEY2                  | Optional tag2 to pass to Cluster Create                                                                                                                 |
| TAG_VALUE2                | Optional tag2 value to pass to Cluster Create                                                                                                           |
| ID_TYPE                   | See [Cluster Support for Managed Identities](./howto-cluster-managed-identity-user-provided-resources.md#key-vault-settings) for details on secret-archive-settings                               |
| VAULT_URI                 | See [Cluster Support for Managed Identities](./howto-cluster-managed-identity-user-provided-resources.md#key-vault-settings) for details on secret-archive-settings                               |

## Cluster Identity

After release of the `2024-07-01` API version, a customer can assign managed identity to a Cluster. Both System-assigned and User-Assigned managed identities are supported.

Once added, the Identity can only be removed via the API call at this time.

For more information on managed identities for Operator Nexus Clusters, see [Azure Operator Nexus Cluster Support for Managed Identities and User Provided Resources](./howto-cluster-managed-identity-user-provided-resources.md).

### Create the Cluster using Azure Resource Manager template editor

An alternate way to create a Cluster is with the ARM template editor.

In order to create the Cluster this way, you need to provide a template file (cluster.jsonc) and a parameter file (cluster.parameters.jsonc).
You can find examples for an 8-Rack 2M16C SKU Cluster using these two files:

[cluster.jsonc](./cluster-jsonc-example.md) ,
[cluster.parameters.jsonc](./cluster-parameters-jsonc-example.md)

> [!NOTE]
> To get the correct formatting, copy the raw code file. The values within the cluster.parameters.jsonc file are customer specific and may not be a complete list. Update the value fields for your specific environment.

1. Navigate to [Azure portal](https://portal.azure.com/) in a web browser and sign in.
1. Search for 'Deploy a custom template' in the Azure portal search bar, and then select it from the available services.
1. Click on Build your own template in the editor.
1. Click on Load file. Locate your cluster.jsonc template file and upload it.
1. Click Save.
1. Click Edit parameters.
1. Click Load file. Locate your cluster.parameters.jsonc parameters file and upload it.
1. Click Save.
1. Select the correct Subscription.
1. Search for the Resource group to see if it already exists. If not, create a new Resource group.
1. Make sure all Instance Details are correct.
1. Click Review + create.

### Cluster validation

A successful Operator Nexus Cluster creation results in the creation of an Azure resource
inside your subscription. The Cluster ID, Cluster provisioning state, and
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

### Set compute deployment threshold

The threshold for the allowable failures of compute nodes during hardware validation is set using the `compute-deployment-threshold` parameter.

If `compute-deployment-threshold` isn't set, the defaults are as follows:

```
      "strategyType": "Rack",
      "thresholdType": "PercentSuccess",
      "thresholdValue": 80,
      "waitTimeMinutes": 1
```

If a `compute-deployment-threshold` different from the default of 80% is required, run the following `cluster update` command.

For example, a customer requesting type "PercentSuccess" with a success rate of 97%:

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

In this example, if less than 97% of the compute nodes being deployed pass hardware validation, the Cluster deployment fails. **NOTE: All kubernetes control plane (KCP) and nexus management plane (NMP) must pass hardware validation.** If 97% or more of the compute nodes being deployed pass hardware validation, the Cluster deployment continues to the bootstrap provisioning phase. 

> [!NOTE]
> Deployment thresholds can't be changed after Cluster deployment is started.

## Deploy Cluster

> [!IMPORTANT]
> As best practice, wait 20 minutes after creating a Cluster before deploying to ensure all associated resources are created.

The deploy Cluster action can be triggered after creating the Cluster.
The deploy Cluster action creates the bootstrap image and deploys the Cluster.

Deploy Cluster initiates a sequence of events that occur in the Cluster Manager.

1.  Validation of the Cluster/Rack properties.
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
> Obtain the `Azure-AsyncOperation` or `Location` header used to query the `operationStatuses` resource from the debug output.
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
> This capability is only visible during a new deployment (Green Field); the logs aren't available retroactively.

> [!NOTE]
> The RAID controller is reset during Cluster deployment wiping all data from the server's virtual disks. Any Baseboard Management Controller (BMC) virtual disk alerts can be ignored unless there are other physical disk and/or RAID controllers alerts.

By default, the hardware validation process writes the results to the configured Cluster `analyticsWorkspaceId`.
However, due to the nature of Log Analytics Workspace data collection and schema evaluation, there can be ingestion delay that can take several minutes or more.
For this reason, the Cluster deployment proceeds even if there was a failure to write the results to the Log Analytics Workspace.
To help address this possible event, the results, for redundancy, are also logged within the Cluster Manager.

In the provided Cluster object's Log Analytics Workspace, a new custom table with the Cluster's name as prefix and the suffix `*_CL` should appear.
In the _Logs_ section of the LAW resource, a query can be executed against the new `*_CL` Custom Log table.

#### Cluster Deployment with skipping specific bare-metal-machine

The `--skip-validation-for-machines` parameter represents the names of
bare metal machines in the Cluster that should be skipped during hardware validation.
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

> [!IMPORTANT]
> If a Cluster is in `Failed` state, it must be deleted and recreated before it can be deployed again. Cluster failures can occur when the hardware validation threshold isn't met, or any phase of the deployment can't complete up until the Cluster is in `Running` state.

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

See the article [Tracking Asynchronous Operations Using Azure CLI](./howto-track-async-operations-cli.md) for another example.
For more information on specific machine validation or deployment failures, see [Troubleshoot Bare Metal Machine (BMM) provisioning](./troubleshoot-bare-metal-machine-provisioning.md).

## Cluster deployment validation

View the status of the Cluster on the portal, or via the Azure CLI:

```azurecli
az networkcloud cluster show --resource-group "$CLUSTER_RG" \
  --name "$CLUSTER_NAME"
```

The Cluster deployment is in-progress when detailedStatus is set to `Deploying` and detailedStatusMessage shows the progress of deployment.

Some examples of deployment progress shown in detailedStatusMessage are `Hardware validation is in progress.` (if Cluster is deployed with hardware validation), `Cluster is bootstrapping.`, `KCP initialization in progress.`, `Management plane deployment in progress.`, `Cluster extension deployment in progress.`, `waiting for "<rack-ids>" to be ready`, etc.

:::image type="content" source="./media/nexus-deploy-kcp-status.png" lightbox="./media/nexus-deploy-kcp-status.png" alt-text="Screenshot of Azure portal showing Cluster deploy progress kcp init.":::

:::image type="content" source="./media/nexus-deploy-extension-status.png" lightbox="./media/nexus-deploy-extension-status.png" alt-text="Screenshot of Azure portal showing Cluster deploy progress extension application.":::

The Cluster deployment is complete when detailedStatus is set to `Running` and detailedStatusMessage shows message `Cluster is up and running`.

:::image type="content" source="./media/nexus-deploy-complete-status.png" lightbox="./media/nexus-deploy-complete-status.png" alt-text="Screenshot of Azure portal showing Cluster deploy complete.":::

View the management version of the Cluster:

```azurecli
az k8s-extension list --cluster-name "$CLUSTER_NAME" --resource-group "$MRG_NAME" --cluster-type connectedClusters --query "[?name=='nc-platform-extension'].{name:name, extensionType:extensionType, releaseNamespace:scope.cluster.releaseNamespace,provisioningState:provisioningState,version:version}" -o table --subscription "$SUBSCRIPTION_ID"
```

## Cluster deployment Logging

Cluster create Logs can be viewed in the following locations:

1. Azure portal Resource/ResourceGroup Activity logs.
2. Azure CLI with `--debug` flag passed on command-line.

:::image type="content" source="./media/nexus-deploy-activity-log.png" lightbox="./media/nexus-deploy-activity-log.png" alt-text="Screenshot of Azure portal showing cluster deploy progress activity log.":::

## Deleting a Cluster

Deleting a Cluster deletes the resources in Azure and the Cluster that resides in the on-premises environment.

> [!IMPORTANT]
> If there are any tenant resources that exist in the Cluster, the delete fails until the tenant resources are deleted.

:::image type="content" source="./media/nexus-delete-failure.png" lightbox="./media/nexus-delete-failure.png" alt-text="Screenshot of the portal showing the failure to delete because of tenant resources.":::

```azurecli
az networkcloud cluster delete --name "$CLUSTER_NAME" --resource-group "$CLUSTER_RG"
```

> [!NOTE]
> As a best practice, wait 20 minutes after deleting a Cluster before trying to create a new Cluster with the same name to ensure all associated resources are deleted.
