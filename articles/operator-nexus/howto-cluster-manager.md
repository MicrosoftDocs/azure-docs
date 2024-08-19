---
title: How to guide for running commands for Cluster Manager on Azure Operator Nexus
description: Learn to create, view, list, update, delete commands for Cluster Manager on Operator Nexus
author: jaredr80
ms.author: jaredro
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


## Global arguments

Some arguments that are available for every Azure CLI command

- **--debug** - prints even more information about CLI operations, used for debugging purposes. If you find a bug, provide output generated with the `--debug` flag on when submitting a bug report.
- **--help -h** - prints CLI reference information about commands and their arguments and lists available subgroups and commands.
- **--only-show-errors** - Only show errors, suppressing warnings.
- **--output -o** - specifies the output format. The available output formats are Json, Jsonc (colorized JSON), tsv (Tab-Separated Values), table (human-readable ASCII tables), and yaml. By default the CLI outputs Json.
- **--query** - uses the JMESPath query language to filter the output returned from Azure services.
- **--verbose** - prints information about resources created in Azure during an operation, and other useful information

## Cluster Manager properties

| Property Name                     | Description                                                                                                                                                                                                                              |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name, ID, location, tags, type    | Name: User friendly name <br> ID: < Resource ID > <br> Location: Azure region where the Cluster Manager is created. Values from: `az account list -locations`.<br> Tags: Resource tags <br> Type: Microsoft.NetworkCloud/clusterManagers |
| managerExtendedLocation           | The ExtendedLocation associated with the Cluster Manager                                                                                                                                                                                 |
| managedResourceGroupConfiguration | Information about the Managed Resource Group                                                                                                                                                                                             |
| fabricControllerId                | The reference to the Network Fabric Controller that is 1:1 with this Cluster Manager                                                                                                                                                               |
| analyticsWorkspaceId              | The Log Analytics workspace where logs that are relevant to the customer will be relayed.                                                                                                                                                  |
| clusterVersions[]                 | The list of Cluster versions that the Cluster Manager supports. It is used as an input in the cluster clusterVersion property.                                                                              |
| provisioningState                 | The provisioning status of the latest operation on the Cluster Manager. One of: Succeeded, Failed, Canceled, Provisioning, Accepted, Updating                                                                                                                                                                            |
| detailedStatus                    | The detailed statuses that provide additional information about the status of the Cluster Manager.                                                                                                                                           |
| detailedStatusMessage             | The descriptive message about the current detailed status.                                                                                                                                   |

## Cluster Manager Identity

Starting with the 2024-06-01-preview API version, a customer can assign managed identity to a Cluster Manager. Both System-assigned and User-Assigned managed identities are supported.

If a Cluster Manager is created with the User-assigned managed identity, a customer is required to provision access to that identity for the Nexus platform.
Specifically, `Microsoft.ManagedIdentity/userAssignedIdentities/assign/action` permission needs to be added to the User-assigned identity for `AFOI-NC-MGMT-PME-PROD` Entra ID. It is a known limitation of the platform that will be addressed in the future.

The role assignment can be done via Portal:

- Open Azure Portal and locate User-assigned identity in question.
  - If you expect multiple managed identities provisioned, the role can be added instead at the resource group or subscription level.
- Under `Access control (IAM)`, click Add new role assignment
- Select Role: `Managed Identity Operator`. See the [permissions](../role-based-access-control/built-in-roles/identity.md#managed-identity-operator) that the role provides.
- Assign access to: User, group, or service principal
- Select Member: `AFOI-NC-MGMT-PME-PROD` application
- Review and assign

## Create a Cluster Manager

### Create the Cluster Manager using Azure CLI:

Use the `az networkcloud clustermanager create` command to create a Cluster Manager. This command creates a new Cluster Manager or updates the properties of the Cluster Manager if it exists. If you have multiple Azure subscriptions, select the appropriate subscription ID using the [az account set](/cli/azure/account#az-account-set) command.

```azurecli
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

- **Arguments**
  - **--name -n [Required]** - The name of the Cluster Manager.
  - **--fabric-controller-id [Required]** - The resource ID of the Network Fabric Controller that is associated with the Cluster Manager.
  - **--resource-group -g [Required]** - Name of resource group. You can configure the default resource group using `az configure --defaults group=<name>`.
  - **--analytics-workspace-id** - The resource ID of the Log Analytics Workspace that is used for the logs collection
  - **--location -l** - Location. Azure region where the Cluster Manager is created. Values from: `az account list -locations`. You can configure the default location using `az configure --defaults location="$LOCATION"`.
  - **--managed-resource-group-configuration** - The configuration of the managed resource group associated with the resource.
    - Usage: --managed-resource-group-configuration location=XX name=XX
    - location: The region of the managed resource group. If not specified, the region of the
      parent resource is chosen.
    - name: The name for the managed resource group. If not specified, a unique name is
      automatically generated.
  - **wait/--no-wait** - Wait for command to complete or don't wait for the long-running operation to finish.
  - **--tags** - Space-separated tags: key[=value] [key[=value]...]. Use '' to clear existing tags
  - **--subscription** - Name or ID of subscription. You can configure the default subscription using `az account set -s NAME_OR_ID`.
  - **--mi-system-assigned** - Enable System-assigned managed identity. Once added, the Identity can only be removed via the API call at this time.
  - **--mi-user-assigned** - Space-separated resource IDs of the User-assigned managed identities to be added. Once added, the Identity can only be removed via the API call at this time.

### Create the Cluster Manager using Azure Resource Manager template editor:

An alternate way to create a Cluster Manager is with the ARM template editor.

In order to create the cluster this way, you need to provide a template file (clusterManager.jsonc) and a parameter file (clusterManager.parameters.jsonc).

You can find examples of these two files here:

[clusterManager.jsonc](./clusterManager-jsonc-example.md) , 
[clusterManager.parameters.jsonc](./clusterManager-parameters-jsonc-example.md)

>[!NOTE]
>To get the correct formatting, copy the raw code file. The values within the clusterManager.parameters.jsonc file are customer specific and may not be a complete list. Please update the value fields for your specific environment.

1. In a web browser, go to the [Azure portal](https://portal.azure.com/) and sign in.
1. From the Azure portal search bar, search for 'Deploy a custom template' and then select it from the available services.
1. Click on Build your own template in the editor.
1. Click on Load file. Locate your clusterManager.jsonc template file and upload it.
1. Click Save.
1. Click Edit parameters.
1. Click Load file.  Locate your clusterManager.parameters.jsonc parameters file and upload it.
1. Click Save.
1. Select the correct Subscription.
1. Search for the Resource group if it already exists or create new.
1. Make sure all Instance Details are correct.
1. Click Review + create.


## List/show Cluster Manager(s)

List and show commands are used to get a list of existing Cluster Managers or the properties of a specific Cluster Manager.

### List Cluster Managers in resource group

This command lists the Cluster Managers in the specified Resource group.

```azurecli
az networkcloud clustermanager list --resource-group "$CLUSTER_MANAGER_RG"
```

### List Cluster Managers in subscription

This command lists the Cluster Managers in the specified subscription.

```azurecli
az networkcloud clustermanager list  --subscription "$SUB_ID"
```

### Show Cluster Manager properties

This command lists the properties of the specified Cluster Manager.

```azurecli
az networkcloud clustermanager show \
    --name "$CLUSTER_MANAGER_NAME" \
    --resource-group "$CLUSTER_MANAGER_RG" \
    --subscription "$SUB_ID"
```

### List/show command arguments

- **--name -n** - The name of the Cluster Manager.
- **--IDs** - One or more resource IDs (space-delimited). It should be a complete resource ID containing all information of 'Resource ID' arguments.
- **--resource-group -g** - Name of resource group. You can configure the default group using `az configure --defaults group=<name>`.
- **--subscription** - Name or ID of subscription. You can configure the default subscription using `az account set -s NAME_OR_ID`.

## Update Cluster Manager

This command is used to patch properties of the provided Cluster Manager, or update the tags assigned to the Cluster Manager. Properties and tag updates can be done independently.

```azurecli
az networkcloud clustermanager update \
    --name "$CLUSTER_MANAGER_NAME" \
    --tags $TAG_KEY1="$TAG_VALUE1" $TAG_KEY2="$TAG_VALUE2" \
    --resource-group "$CLUSTER_MANAGER_RG" \
    --subscription "$SUB_ID"
```

- **Arguments**
  - **--tags** - TSpace-separated tags: key[=value] [key[=value] ...]. Use '' to clear existing tags.
  - **--name -n** - The name of the Cluster Manager.
  - **--IDs** - One or more resource IDs (space-delimited). It should be a complete resource ID containing all information of 'Resource ID' arguments.
  - **--resource-group -g** - Name of resource group. You can configure the default group using `az configure --defaults group=<name>`.
  - **--subscription** - Name or ID of subscription. You can configure the default subscription using `az account set -s NAME_OR_ID`.
  - **--mi-system-assigned** - Enable System-assigned managed identity. Once added, the Identity can only be removed via the API call at this time.
  - **--mi-user-assigned** - Space-separated resource IDs of the User-assigned managed identities to be added. Once added, the Identity can only be removed via the API call at this time.

### Update Cluster Manager Identities via APIs

Cluster Manager managed identities can be assigned via CLI. The un-assignment of the identities can be done via API calls.
Note, `<APIVersion>` is the API version 2024-06-01-preview or newer.

- To remove all managed identities, execute:

  ```azurecli
  az rest --method PATCH --url /subscriptions/$SUB_ID/resourceGroups/$CLUSTER_MANAGER_RG/providers/Microsoft.NetworkCloud/clusterManagers/$CLUSTER_MANAGER_NAME?api-version=<APIVersion> --body "{\"identity\":{\"type\":\"None\"}}"
  ```

- If both User-assigned and System-assigned managed identities were added, the User-assigned can be removed by updating the `type` to `SystemAssigned`:

  ```azurecli
  az rest --method PATCH --url /subscriptions/$SUB_ID/resourceGroups/$CLUSTER_MANAGER_RG/providers/Microsoft.NetworkCloud/clusterManagers/$CLUSTER_MANAGER_NAME?api-version=<APIVersion> --body @~/uai-body.json
  ```

  The request body (uai-body.json) example:
  
  ```azurecli
  {
	"identity": {
        "type": "SystemAssigned"
	}
  }
  ```

- If both User-assigned and System-assigned managed identities were added, the System-assigned can be removed by updating the `type` to `UserAssigned`:

  ```azurecli
  az rest --method PATCH --url /subscriptions/$SUB_ID/resourceGroups/$CLUSTER_MANAGER_RG/providers/Microsoft.NetworkCloud/clusterManagers/$CLUSTER_MANAGER_NAME?api-version=<APIVersion> --body @~/uai-body.json
  ```

  The request body (uai-body.json) example:
  
  ```azurecli
  {
	"identity": {
        "type": "UserAssigned",
		"userAssignedIdentities": {
			"/subscriptions/$SUB_ID/resourceGroups/$UAI_RESOURCE_GROUP/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$UAI_NAME": {}
		}
	}
  }
  ```

- If multiple User-assigned managed identities were added, one of them can be removed by executing:

  ```azurecli
  az rest --method PATCH --url /subscriptions/$SUB_ID/resourceGroups/$CLUSTER_MANAGER_RG/providers/Microsoft.NetworkCloud/clusterManagers/$CLUSTER_MANAGER_NAME?api-version=<APIVersion> --body @~/uai-body.json
  ```
  
  The request body (uai-body.json) example:
  
  ```azurecli
  {
	"identity": {
        "type": "UserAssigned",
		"userAssignedIdentities": {
			"/subscriptions/$SUB_ID/resourceGroups/$UAI_RESOURCE_GROUP/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$UAI_NAME": null
		}
	}
  }
  ```

## Delete Cluster Manager

This command is used to Delete the provided Cluster Manager.

> [!Warning]
> A Cluster Manager that has an existing associated Network Fabric Controller, or any Clusters that reference this Cluster Manager may not be deleted.

```azurecli
az networkcloud clustermanager delete \
    --name "$CLUSTER_MANAGER_NAME" \
    --resource-group "$CLUSTER_MANAGER_RG" \
    --subscription "$SUB_ID"
```

- **Arguments**
  - **--no-wait** - Don't wait for the long-running operation to complete.
  - **--yes -y** - Don't prompt for confirmation.
  - **--name -n** - The name of the Cluster Manager.
  - **--IDs** - One or more resource IDs (space-delimited). It should be a complete resource ID containing all information of 'Resource ID' arguments.
  - **--resource-group -g** - Name of resource group. You can configure the default group using `az configure --defaults group=<name>`.
  - **--subscription** - Name or ID of subscription. You can configure the default subscription using `az account set -s NAME_OR_ID`.

## Next steps

After you successfully created the Network Fabric Controller and the Cluster Manager, the next step is to create a [Network Fabric](./howto-configure-network-fabric.md).
