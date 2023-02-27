---
title: How to guide for running commands for Cluster Manager on Azure Operator Nexus
description: Learn to create, view, list, update, delete commands for Cluster Manager on Operator Nexus
author: krishnaposa
ms.author: sriposa
ms.date: 01/23/2023
ms.topic: how-to
# ms.prod: used for on prem applications
ms.service: azure 
---

# Cluster manager: lifecycle management

You'll need to upgrade or patch a Cluster Manager. You may need to examine or change its properties. When all Operator Nexus  instances have been deleted from your sites, you may need to delete the Cluster Manager.
In this how-to guide you'll learn to manage a Cluster Manager. The `networkcloud` resource provider supports `create`, `list` (also known as read), `show`, `update` and `delete` operations on the `clustermanager` resource.

## Before you begin

You'll need:

- **Azure subscription ID** - The Azure subscription ID where Cluster Manager needs to be created (should be the same subscription ID of the Network fabric Controller) or exists.
- **Fabric Controller ID** - Network fabric Controller and Cluster Manager have a 1:1 association. You'll need the resource ID of the Network fabric Controller associated with the Cluster Manager. Both the Cluster Manager and Fabric Controller need to be in your same Resource group.
- **analytics workspace ID** - The resource ID of the Log Analytics workspace used for the logs collection.
- **Azure Region** - The Cluster Manager should be created in the same region as the Network fabric Controller.
This Azure region should be used in the `Location` field of the Cluster Manager and all associated Operator Nexus instances.

## Prerequisites: install CLI extensions

Install latest version of the [appropriate CLI extensions](./howto-install-cli-extensions.md)

## Global arguments

Some arguments that are available for every Azure CLI command

- **--debug** - prints even more information about CLI operations, used for debugging purposes. If you find a bug, provide output generated with the `--debug` flag on when submitting a bug report.
- **--help -h** - prints CLI reference information about commands and their arguments and lists available subgroups and commands.
- **--only-show-errors** - Only show errors, suppressing warnings.
- **--output -o** - specifies the output format. The available output formats are Json, Jsonc (colorized JSON), tsv (Tab-Separated Values), table (human-readable ASCII tables), and yaml. By default the CLI outputs Json.
- **--query** - uses the JMESPath query language to filter the output returned from Azure services.
- **--verbose** - prints information about resources created in Azure during an operation, and other useful information

## Cluster manager elements

| Elements                          | Description                                                                                                                                                                                                                              |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name, ID, location, tags, type    | Name: User friendly name <br> ID: < Resource ID > <br> Location: Azure region where the Cluster Manager is created. Values from: `az account list -locations`.<br> Tags: Resource tags <br> Type: Microsoft.NetworkCloud/clusterManagers |
| managerExtendedLocation           | The ExtendedLocation associated with the Cluster Manager                                                                                                                                                                                 |
| managedResourceGroupConfiguration | Information about the Managed Resource Group                                                                                                                                                                                             |
| fabricControllerId                | A reference to the fabric controller that is 1:1 with this Cluster Manager                                                                                                                                                               |
| analyticsWorkspaceId              | This workspace will be where any logs that 's relevant to the customer will be relayed.                                                                                                                                                  |
| clusterVersions[]                 | List of ClusterAvailableVersions objects. <br> Cluster versions that the manager supports. Will be used as an input in the cluster clusterVersion property.                                                                              |
| provisioningState                 | Succeeded, Failed, Canceled, Provisioning, Accepted, Updating                                                                                                                                                                            |
| detailedStatus                    | Detailed statuses that provide additional information about the status of the Cluster Manager.                                                                                                                                           |
| detailedStatusMessage             | Descriptive message about the current detailedStatus.                                                                                                                                                                                    |

## Create a cluster manager

Use the `az network clustermanager create` command to create a Cluster Manager. This command creates a new Cluster Manager or updates the properties of the Cluster Manager if it exists. If you have multiple Azure subscriptions, select the appropriate subscription ID using the [az account set](/cli/azure/account#az-account-set) command.

```azurecli
az networkcloud clustermanager create \
    --name <Cluster Manager name> \
    --location <region> \
    --analytics-workspace-id <log analytics workspace ID>
    --fabric-controller-id <Fabric controller ID associated with this Cluster Manager>
    --managed-resource-group-configuration < name=<Managed Resource group Name> location=<Managed Resource group location> >
    --tags <key=value key=value>
    --resource-group <Resource Group Name>
    --subscription <subscription ID>
```

The command returns 200 OK in the successful creation or update. 201 Created is returned when the operation is performed asynchronously.

- **Arguments**
  - **--name -n [Required]** - The name of the Cluster Manager.
  - **--fabric-controller-id [Required]** - The resource ID of the Network fabric Controller that is associated with the Cluster Manager.
  - **--resource-group -g [Required]** - Name of resource group. You can configure the default resource group using `az configure --defaults group=<name>`.
  - **--analytics-workspace-id** - The resource ID of the Log Analytics workspace that is used for the logs collection
  - **--location -l** - Location. Azure region where the Cluster Manager is created. Values from: `az account list -locations`. You can configure the default location using `az configure --defaults location=<location>`.
  - **--managed-resource-group-configuration** - The configuration of the managed resource group associated with the resource.
    - Usage: --managed-resource-group-configuration location=XX name=XX
    - location: The region of the managed resource group. If not specified, the region of the
      parent resource is chosen.
    - name: The name for the managed resource group. If not specified, a unique name is
      automatically generated.
  - **wait/--no-wait** - Wait for command to complete or don't wait for the long-running operation to finish.
  - **--tags** - Space-separated tags: key[=value] [key[=value]...]. Use '' to clear existing tags
  - **--subscription** - Name or ID of subscription. You can configure the default subscription using `az account set -s NAME_OR_ID`.

## List/show cluster manager(s)

List and show commands are used to get a list of existing Cluster Managers or the properties of a specific Cluster Manager.

### List cluster managers in resource group

This command lists the Cluster Managers in the specified Resource group.

```azurecli
az networkcloud clustermanager list --resource-group <Azure Resource group>
```

### List cluster managers in subscription

This command lists the Cluster Managers in the specified subscription.

```azurecli
az networkcloud clustermanager list  --subscription <subscription ID>
```

### Show cluster manager properties

This command lists the properties of the specified Cluster Manager.

```azurecli
az networkcloud clustermanager show \
    --name <Cluster Manager name> \
    --resource-group <Resource group Name>
    --subscription <subscription ID>
```

### List/show command arguments

- **--name -n** - The name of the Cluster Manager.
- **--IDs** - One or more resource IDs (space-delimited). It should be a complete resource ID containing all information of 'Resource ID' arguments.
- **--resource-group -g** - Name of resource group. You can configure the default group using `az configure --defaults group=<name>`.
- **--subscription** - Name or ID of subscription. You can configure the default subscription using `az account set -s NAME_OR_ID`.

## Update cluster manager

This command is used to Patch properties of the provided Cluster Manager, or update the tags assigned to the Cluster Manager. Properties and tag updates can be done independently.

```azurecli
az networkcloud clustermanager update \
    --name <Cluster Manager name> \
    --tags < <key1=value1> <key2=value2>>
    --resource-group <Resource group Name>
    --subscription <subscription ID>
```

- **Arguments**
  - **--tags** - TSpace-separated tags: key[=value] [key[=value] ...]. Use '' to clear existing tags.
  - **--name -n** - The name of the Cluster Manager.
  - **--IDs** - One or more resource IDs (space-delimited). It should be a complete resource ID containing all information of 'Resource ID' arguments.
  - **--resource-group -g** - Name of resource group. You can configure the default group using `az configure --defaults group=<name>`.
  - **--subscription** - Name or ID of subscription. You can configure the default subscription using `az account set -s NAME_OR_ID`.

## Delete cluster manager

This command is used to Delete the provided Cluster Manager.
A Cluster Manager that has an existing associated Network fabric Controller, or any Clusters that reference this Cluster Manager may not be deleted

```azurecli
az networkcloud clustermanager delete \
    --name <Cluster Manager name> \
    --resource-group <Resource Group Name>
    --subscription <subscription ID>
```

- **Arguments**
  - **--no-wait** - Don't wait for the long-running operation to complete.
  - **--yes -y** - Don't prompt for confirmation.
  - **--name -n** - The name of the Cluster Manager.
  - **--IDs** - One or more resource IDs (space-delimited). It should be a complete resource ID containing all information of 'Resource ID' arguments.
  - **--resource-group -g** - Name of resource group. You can configure the default group using `az configure --defaults group=<name>`.
  - **--subscription** - Name or ID of subscription. You can configure the default subscription using `az account set -s NAME_OR_ID`.
