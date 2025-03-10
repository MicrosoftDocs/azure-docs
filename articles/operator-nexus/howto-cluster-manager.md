---
title: "Cluster Manager: How to manage the Cluster Manager in Operator Nexus"
description: Learn to create, view, list, update, delete commands for Cluster Manager on Operator Nexus
author: mbashtovaya
ms.author: mbashtovaya
ms.date: 01/23/2023
ms.topic: how-to
# ms.prod: used for on prem applications
ms.service: azure-operator-nexus 
ms.custom: devx-track-azurecli
---

# Cluster Manager: How to manage the Cluster Manager in Operator Nexus

The Cluster Manager is deployed in the operator's Azure subscription to manage the lifecycle of Operator Nexus Infrastructure Clusters. 

## Before you begin

Ensure you have the following information:

- **Azure Subscription ID** - The Azure subscription ID where Cluster Manager needs to be created (should be the same subscription ID of the Network Fabric Controller).
- **Network Fabric Controller ID** - Network Fabric Controller and Cluster Manager have a 1:1 association. You need the resource ID of the Network Fabric Controller to be associated with the Cluster Manager.
- **Log Analytics Workspace ID** - The resource ID of the Log Analytics Workspace used for the logs collection.
- **Azure Region** - The Cluster Manager should be created in the same Azure region as the Network Fabric Controller.
This Azure region should be used in the `Location` field of the Cluster Manager and all associated Operator Nexus instances.

## Limitations
- **Naming** - Naming rules can be found [here](../azure-resource-manager/management/resource-name-rules.md#microsoftnetworkcloud).

## Cluster Manager properties

| Property Name                     | Description                                                                                                                                                                                                                              |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name, ID, location, tags, type    | The Name: User friendly name <br> ID: The Resource ID <br> Location: The Azure region where the Cluster Manager is created. Values from: `az account list -locations`.<br> Tags: The resource tags <br> Type: Microsoft.NetworkCloud/clusterManagers |
| managerExtendedLocation           | The ExtendedLocation associated with the Cluster Manager                                                                                                                                                                                 |
| managedResourceGroupConfiguration | The details of Managed Resource Group that is created for the Cluster Manager to host its internally used resources.                                                                                                                                                                                             |
| fabricControllerId                | The reference to the Network Fabric Controller that is 1:1 with this Cluster Manager                                                                                                                                                               |
| analyticsWorkspaceId              | The Log Analytics workspace where logs that are relevant to the customer can be found.                                                                                                                                                  |
| clusterVersions[]                 | The list of Cluster versions that the Cluster Manager supports. It's used as an input in the cluster clusterVersion property.                                                                              |
| provisioningState                 | The provisioning status of the latest operation on the Cluster Manager. One of: Succeeded, Failed, Canceled, Provisioning, Accepted, Updating                                                                                                                                                                            |
| detailedStatus                    | The detailed statuses that provide additional information about the status of the Cluster Manager.                                                                                                                                           |
| detailedStatusMessage             | The descriptive message about the current detailed status.                                                                                                                                   |

## Cluster Manager Identity

A customer can assign managed identity to a Cluster Manager. Both System-assigned and User-Assigned managed identities are supported starting with the `2024-07-01` API version.

If a Cluster Manager is created with the User-assigned managed identity, a customer is required to provision access to that identity for the Nexus platform.
Specifically, `Microsoft.ManagedIdentity/userAssignedIdentities/assign/action` permission needs to be added to the User-assigned identity for `AFOI-NC-MGMT-PME-PROD` Microsoft Entra ID. It's a known limitation of the platform that will be addressed in the future.

The role assignment can be done via the Azure portal:

- Open Azure portal and locate User-assigned identity in question.
  - If you expect multiple managed identities provisioned, the role can be added instead at the resource group or subscription level.
- Under `Access control (IAM)`, click Add new role assignment
- Select Role: `Managed Identity Operator`. See the [permissions](../role-based-access-control/built-in-roles/identity.md#managed-identity-operator) that the role provides.
- Assign access to: User, group, or service principal
- Select Member: `AFOI-NC-MGMT-PME-PROD` application
- Review and assign

## Create a Cluster Manager

Use the below commands to create a Cluster Manager.

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az networkcloud clustermanager create \
    --name "$CLUSTER_MANAGER_NAME" \
    --location "$LOCATION" \
    --analytics-workspace-id "$LAW_NAME" \
    --fabric-controller-id "$NFC_ID" \
    --managed-resource-group-configuration name="$MRG_NAME" location="$MRG_LOCATION" \
    --tags $TAG_KEY1="$TAG_VALUE1" $TAG_KEY2="$TAG_VALUE2"
    --resource-group "$CLUSTER_MANAGER_RG"
    --subscription "$SUB_ID"
```

Arguments:
- `--name` or `-n` [Required] - The name of the Cluster Manager.
- `--resource-group` or `-g` [Required] - The name of resource group. You can configure the default resource group using `az configure --defaults group=<name>`.
- `--fabric-controller-id` [Required] - The resource ID of the Network Fabric Controller that is associated with the Cluster Manager.
- `--analytics-workspace-id` - The resource ID of the Log Analytics Workspace that is used for the logs collection
- `--location` or `-l` - The Azure region where the Cluster Manager is created. Values from: `az account list -locations`. You can configure the default location using `az configure --defaults location="$LOCATION"`.
- `--managed-resource-group-configuration` - The configuration of the managed resource group associated with the resource.
  - Usage: `--managed-resource-group-configuration location=XX name=XX`
  - location: The region of the managed resource group. If not specified, the region of the
    parent resource is chosen.
  - name: The name for the managed resource group. If not specified, a unique name is
    automatically generated.
- `wait`/`--no-wait` - Wait for command to complete or don't wait for the long-running operation to finish.
- `--tags` - Space-separated tags: key[=value] [key[=value]...]. Use '' to clear existing tags
- `--subscription` - Name or ID of subscription. You can configure the default subscription using `az account set -s NAME_OR_ID`.
- `--mi-system-assigned` - Enable System-assigned managed identity.
- `--mi-user-assigned` - Space-separated resource IDs of the User-assigned managed identities to be added.
- `--if-match`/`if-none-match` - Specify the last-seen ETag value to prevent accidentally overwriting concurrent changes. The ETag is returned as the resource property once the resource is created and can be used on the update operations.

Common arguments that are available for every Azure CLI command:

- `--debug` - prints detailed information about CLI execution that is used for debugging purposes. If you find a bug, provide output generated with the `--debug` flag on when submitting a bug report.
- `--output` or `-o` - specifies the output format. The available output formats are Json, Jsonc (colorized JSON), tsv (Tab-Separated Values), table (human-readable ASCII tables), and yaml. By default the CLI outputs Json.
- `--query` - uses the JMESPath query language to filter the output returned from Azure services.

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$TAGS_HASH = @{
  tag1 = "true"
  tag2 = "false"
}

New-AzNetworkCloudClusterManager -Name "$CLUSTER_MANAGER_NAME -Location $LOCATION -ResourceGroupName $CLUSTER_MANAGER_RG -SubscriptionId $SUB_ID -AnalyticsWorkspaceId $LAW_NAME -ManagedResourceGroupConfigurationName $MRG_NAME -ManagedResourceGroupConfigurationLocation $MRG_LOCATION -FabricControllerId $NFC_ID -Tag $TAGS_HASH
```

Parameters:
- `-Name` - The name of the cluster manager.
- `-ResourceGroupName` - The name of the resource group.
- `-SubscriptionId` - The ID of the target subscription.
- `-FabricControllerId` - The resource ID of the fabric controller that has one to one mapping with the cluster manager.
- `-Location` - The geo-location where the resource lives.
- `-AnalyticsWorkspaceId` - The resource ID of the Log Analytics workspace that is used for the logs collection.
- `-ManagedResourceGroupConfigurationLocation` - The location of the managed resource group. If not specified, the location of the parent resource is chosen.
- `-ManagedResourceGroupConfigurationName` - The name for the managed resource group. If not specified, the unique name is automatically generated.
- `-Tag` - Hashtable of Resource tags.

### [ARM Template](#tab/template)

To create a Cluster Manager via ARM Template, you need to provide a template file (clusterManager.jsonc) and a parameter file (clusterManager.parameters.jsonc).

You can find examples of these two files here:
- [clusterManager.jsonc](./clusterManager-jsonc-example.md) 
- [clusterManager.parameters.jsonc](./clusterManager-parameters-jsonc-example.md)

>[!NOTE]
>To get the correct formatting, copy the raw code file. The values within the clusterManager.parameters.jsonc file are customer specific and may not be a complete list. Update the values for your specific environment.

1. Open a web browser and go to the [Azure portal](https://portal.azure.com/) and sign in.
1. Use the Azure portal search bar and type 'Deploy a custom template.' Select it from the available services.
1. Click on Build your own template in the editor.
1. Click on Load file. Locate your clusterManager.jsonc template file and upload it.
1. Click Save.
1. Click Edit parameters.
1. Click Load file. Locate your clusterManager.parameters.jsonc parameters file and upload it.
1. Click Save.
1. Select the correct Subscription.
1. Search for the Resource group if it already exists, or create new.
1. Make sure all Instance Details are correct.
1. Click Review + create.

---

## List/show Cluster Managers

List and show commands are used to get a list of existing Cluster Managers or the properties of a specific Cluster Manager.

### [Azure CLI](#tab/azure-cli)

This command lists the Cluster Managers in the specified Resource group.

```azurecli-interactive
az networkcloud clustermanager list --resource-group "$CLUSTER_MANAGER_RG"
```

This command lists the Cluster Managers in the specified subscription.

```azurecli-interactive
az networkcloud clustermanager list  --subscription "$SUB_ID"
```

This command shows the properties of the specified Cluster Manager.

```azurecli-interactive
az networkcloud clustermanager show \
    --name "$CLUSTER_MANAGER_NAME" \
    --resource-group "$CLUSTER_MANAGER_RG" \
    --subscription "$SUB_ID"
```

### [Azure PowerShell](#tab/azure-powershell)

This command lists the Cluster Managers in the specified Resource group.

```azurepowershell-interactive
 Get-AzNetworkCloudClusterManager -ResourceGroupName "$CLUSTER_MANAGER_RG"
```

This command lists the Cluster Managers in the specified subscription.

```azurepowershell-interactive
 Get-AzNetworkCloudClusterManager -SubscriptionId "$SUB_ID"
```

This command shows the properties of the specified Cluster Manager in JSON format.

```azurepowershell-interactive
 Get-AzNetworkCloudClusterManager -Name "$CLUSTER_MANAGER_NAME" -ResourceGroupName "$CLUSTER_MANAGER_RG" -SubscriptionId "$SUB_ID" | ConvertTo-Json
```

### [ARM Template](#tab/template)

To view Cluster Managers, use Portal, CLI, or PowerShell.

---

## Update Cluster Manager

This command is used to patch properties of the provided Cluster Manager, or update the tags assigned to the Cluster Manager. Properties and tag updates can be done independently.

### [Azure CLI](#tab/azure-cli)

This command updates the Cluster Managers in the specified Resource group.

```azurecli-interactive
az networkcloud clustermanager update \
    --name "$CLUSTER_MANAGER_NAME" \
    --tags $TAG_KEY1="$TAG_VALUE1" $TAG_KEY2="$TAG_VALUE2" \
    --resource-group "$CLUSTER_MANAGER_RG" \
    --subscription "$SUB_ID"
```

Cluster Manager identity can be managed via CLI using `az networkcloud clustermanager identity` sub commands.

This command shows the currently assigned identities.

```azurecli-interactive
az networkcloud clustermanager identity show \
    --name "$CLUSTER_MANAGER_NAME" \
    --resource-group "$CLUSTER_MANAGER_RG" \
    --subscription "$SUB_ID"
```

This command adds a new user-assigned identity.

```azurecli-interactive
az networkcloud clustermanager identity assign \
    --name "$CLUSTER_MANAGER_NAME" \
    --resource-group "$CLUSTER_MANAGER_RG" \
    --subscription "$SUB_ID"
    --mi-user-assigned "$UAI_RESOURCE_ID"
```

This command adds a system-assigned identity.

```azurecli-interactive
az networkcloud clustermanager identity assign \
    --name "$CLUSTER_MANAGER_NAME" \
    --resource-group "$CLUSTER_MANAGER_RG" \
    --subscription "$SUB_ID"
    --mi-system-assigned
```

This command removes the existing user-assigned identity.

```azurecli-interactive
az networkcloud clustermanager identity remove \
    --name "$CLUSTER_MANAGER_NAME" \
    --resource-group "$CLUSTER_MANAGER_RG" \
    --subscription "$SUB_ID"
    --mi-user-assigned "$UAI_RESOURCE_ID"
```

This command removes the existing system-assigned identity.

```azurecli-interactive
az networkcloud clustermanager identity remove \
    --name "$CLUSTER_MANAGER_NAME" \
    --resource-group "$CLUSTER_MANAGER_RG" \
    --subscription "$SUB_ID"
    --mi-system-assigned
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$TAGS_HASH = @{
  tag1 = "true"
  tag2 = "false"
}

Update-AzNetworkCloudClusterManager -Name "$CLUSTER_MANAGER_NAME -ResourceGroupName $CLUSTER_MANAGER_RG -SubscriptionId $SUB_ID -Tag $TAGS_HASH
```

### [ARM Template](#tab/template)

The template used for creation can also be used to update the Cluster Manager.

---

## Delete Cluster Manager

This command is used to Delete the provided Cluster Manager.

> [!Warning]
> A Cluster Manager that has an existing associated Network Fabric Controller, or any Clusters that reference this Cluster Manager may not be deleted.

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az networkcloud clustermanager delete \
    --name "$CLUSTER_MANAGER_NAME" \
    --resource-group "$CLUSTER_MANAGER_RG" \
    --subscription "$SUB_ID"
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Remove-AzNetworkCloudClusterManager -Name "$CLUSTER_MANAGER_NAME -ResourceGroupName $CLUSTER_MANAGER_RG -SubscriptionId $SUB_ID
```

### [ARM Template](#tab/template)

To delete the Cluster Manager, use Portal, CLI, or PowerShell.

---

>[!NOTE]
>It is recommended to wait for 20 minutes after deleting clustermanager before trying to create a new clustermanager with the same name.

## Next steps

After you successfully created the Network Fabric Controller and the Cluster Manager, the next step is to create a [Network Fabric](./howto-configure-network-fabric.md).

## Useful links

- [NetworkCloud REST APIs Reference](/rest/api/networkcloud/)
- [NetworkCloud PowerShell Reference](/powershell/module/az.networkcloud/)

