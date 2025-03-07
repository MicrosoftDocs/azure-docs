---
title: Manage emergency access to a bare metal machine using the `az networkcloud cluster bmckeyset` command for Azure Operator Nexus
description: Step by step guide on using the `az networkcloud cluster bmckeyset` command to manage emergency access to a bare metal machine.
author: DanCrank
ms.author: danielcrank
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 06/12/2024
ms.custom: template-how-to, devx-track-azurecli
---

# Manage emergency access to a bare metal machine using the `az networkcloud cluster bmckeyset`

> [!CAUTION]
> Please note this process is used in emergency situations when all other troubleshooting options via Azure are exhausted. SSH access to these bare metal machines is restricted to users managed via this method from the specified jump host list.

There are rare situations where a user needs to investigate & resolve issues with a bare metal machine and all other ways using Azure are exhausted. Operator Nexus provides the `az networkcloud cluster bmckeyset` command so users can manage SSH access to the baseboard management controller (BMC) on these bare metal machines. On keyset creation, users are validated against Microsoft Entra ID for proper authorization by cross referencing the User Principal Name provided for a user against the supplied Azure Group ID `--azure-group-id <Entra Group ID>`.

Users in a keyset are validated every four hours, and also when any changes are made to any keyset. Each user's status is then set to "Active" or "Invalid." Invalid users remain in the keyset but their keys are removed from all hosts and they aren't allowed access. Reasons for a user being invalid are:
- The user's User Principal Name hasn't been specified
- The user's User Principal Name isn't a member of the given Entra group
- The given Entra group doesn't exist (in which case all users in the keyset are invalid)
- The keyset is expired (in which case all users in the keyset are invalid)

> [!NOTE]
> The User Principal Name is now required for keysets as Microsoft Entra ID validation is enforced for all users. Current keysets that do not specify User Principal Names for all users will continue to work until the expiration date. If a keyset without User Principal Names expires, the keyset will need to be updated with User Principal Names, for all users, in order to become valid again. Keysets that have not been updated with the User Principal Names for all users prior to December 2024 are at-risk of being `Invalid`. Note that if any user fails to specify a User Principal Name this results in the entire keyset being invalidated.

The keyset and each individual user also have detailed status messages communicating other information:
- The keyset's detailedStatusMessage tells you whether the keyset is expired, and other information about problems encountered while updating the keyset across the cluster.
- The user's statusMessage tells you whether the user is active or invalid, and a list of machines that aren't yet updated to the user's latest active/invalid state. In each case, causes of problems are included if known.

When the command runs, it executes on each bare metal machine in the Cluster with an active Kubernetes node. There's a reconciliation process that runs periodically that retries the command on any bare metal machine that wasn't available at the time of the original command. Also, any bare metal machine that returns to the cluster via an `az networkcloud baremetalmachine actionreimage` or `az networkcloud baremetalmachine actionreplace` command (see [BareMetal functions](./howto-baremetal-functions.md)) sends a signal causing any active keysets to be sent to the machine as soon as it returns to the cluster. Multiple commands execute in the order received.

The BMCs support a maximum number of 12 users. Users are defined on a per Cluster basis and applied to each bare metal machine. Attempts to add more than 12 users results in an error. Delete a user before adding another one when 12 already exists.

## Prerequisites

- Install the latest version of the [appropriate CLI extensions](./howto-install-cli-extensions.md).
- The on-premises Cluster must have connectivity to Azure.
- Get the Resource Group name for the `Cluster` resource.
- The process applies keysets to all running bare metal machines.
- The users added must be part of a Microsoft Entra group. For more information, see [How to Manage Groups](../active-directory/fundamentals/how-to-manage-groups.md).
- To restrict access for managing keysets, create a custom role. For more information, see [Azure Custom Roles](../role-based-access-control/custom-roles.md). In this instance, add or exclude permissions for `Microsoft.NetworkCloud/clusters/bmcKeySets`. The options are `/read`, `/write`, and `/delete`.

> [!NOTE]
> When BMC access is created, modified, or deleted via the commands described in this
> article, a background process delivers those changes to the machines. This process is paused during
> Operator Nexus software upgrades. If an upgrade is known to be in progress, you can use the `--no-wait`
> option with the command to prevent the command prompt from waiting for the process to complete.

## Creating a BMC keyset

The `bmckeyset create` command creates SSH access to the bare metal machine in a Cluster for a group of users.

The command syntax is:

```azurecli
az networkcloud cluster bmckeyset create \
  --name <BMC Keyset Name> \
  --extended-location name=<Extended Location ARM ID> \
    type="CustomLocation" \
  --location <Azure Region> \
  --azure-group-id <Azure AAD Group ID> \
  --expiration <Expiration Timestamp> \
  --privilege-level <"Administrator" or "ReadOnly"> \
  --user-list '[{"description":"<User List Description>","azureUserName":"<User Name>",\
    "sshPublicKey":{"keyData":"<SSH Public Key>"}, \
    "userPrincipalName":""}]', \
  --tags key1=<Key Value> key2=<Key Value> \
  --cluster-name <Cluster Name> \
  --resource-group <Resource Group Name>
```

### Create Arguments

```azurecli
  --azure-group-id                            [Required] : The object ID of Azure Active Directory
                                                           group that all users in the list must
                                                           be in for access to be granted. Users
                                                           that are not in the group do not have
                                                           access.
  --bmc-key-set-name --name -n                [Required] : The name of the BMC key set.
  --cluster-name                              [Required] : The name of the cluster.
  --expiration                                [Required] : The date and time after which the users
                                                           in this key set are removed from
                                                           the BMCs. The maximum expiration date is a
                                                           year from creation date. Format is
                                                           "YYYY-MM-DDTHH:MM:SS.000Z".
  --extended-location                         [Required] : The extended location of the cluster
                                                           associated with the resource.
    Usage: --extended-location name=XX type=XX
      name: Required. The resource ID of the extended location on which the resource is created.
      type: Required. The extended location type: "CustomLocation".
  --privilege-level                           [Required] : The access level allowed for the users
                                                           in this key set.  Allowed values:
                                                           "Administrator" or "ReadOnly".
  --resource-group -g                         [Required] : Name of resource group. Optional if
                                                           configuring the default group using `az
                                                           configure --defaults group=<name>`.
  --user-list                                 [Required] : The unique list of permitted users.
    Usage: --user-list azure-user-name=XX description=XX key-data=XX
      azure-user-name: Required. User name used to login to the server.
      description: The free-form description for this user.
      key-data: Required. The public ssh key of the user.
      userPrincipalName: Required. The User Principal Name of the User.

      Multiple users can be specified by using more than one --user-list argument.
  --tags                                                 : Space-separated tags: key[=value]
                                                           [key[=value] ...]. Use '' to clear
                                                           existing tags.
  --location -l                                          : Azure Region. Values from: `az account
                                                           list-locations`. You can configure the
                                                           default location using `az configure
                                                           --defaults location=<location>`.
  --no-wait                                              : Do not wait for the long-running
                                                           operation to finish.
```

### Global Azure CLI arguments (applicable to all commands)

```azurecli
  --debug                                                : Increase logging verbosity to show all
                                                           debug logs.
  --help -h                                              : Show this help message and exit.
  --only-show-errors                                     : Only show errors, suppressing warnings.
  --output -o                                            : Output format.  Allowed values: json,
                                                           jsonc, none, table, tsv, yaml, yamlc.
                                                           Default: json.
  --query                                                : JMESPath query string. See
                                                           http://jmespath.org/ for more
                                                           information and examples.
  --subscription                              [Required] : Name or ID of subscription. Optional if
                                                           configuring the default subscription
                                                           using `az account set -s NAME_OR_ID`.
  --verbose                                              : Increase logging verbosity. Use --debug
                                                           for full debug logs.
```

This example creates a new keyset with two users that have standard access from two jump hosts.

```azurecli
az networkcloud cluster bmckeyset create \
  --name "bmcKeySetName" \
  --extended-location name="/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ExtendedLocation/customLocations/clusterExtendedLocationName" \
    type="CustomLocation" \
  --location "location" \
  --azure-group-id "f110271b-XXXX-4163-9b99-214d91660f0e" \
  --expiration "2023-12-31T23:59:59.008Z" \
  --privilege-level "Standard" \
  --user-list '[{"description":"Needs access for troubleshooting as a part of the support team",\
  "azureUserName":"userABC","sshPublicKey":{"keyData":"ssh-rsa  AAtsE3njSONzDYRIZv/WLjVuMfrUSByHp+jfaaOLHTIIB4fJvo6dQUZxE20w2iDHV3tEkmnTo84eba97VMueQD6OzJPEyWZMRpz8UYWOd0IXeRqiFu1lawNblZhwNT/ojNZfpB3af/YDzwQCZgTcTRyNNhL4o/blKUmug0daSsSXISTRnIDpcf5qytjs1XoyYyJMvzLL59mhAyb3p/cD+Y3/s3WhAx+l0XOKpzXnblrv9d3q4c2tWmm/SyFqthaqd0= admin@vm"}},\
  {"description":"Needs access for troubleshooting as a part of the support team",\
  "azureUserName":"userXYZ","sshPublicKey":{"keyData":"ssh-rsa  AAtsE3njSONzDYRIZv/WLjVuMfrUSByHp+jfaaOLHTIIB4fJvo6dQUZxE20w2iDHV3tEkmnTo84eba97VMueQD6OzJPEyWZMRpz8UYWOd0IXeRqiFu1lawNblZhwNT/ojNZfpB3af/YDzwQCZgTcTRyNNhL4o/blKUmug0daSsSXTSTRnIDpcf5qytjs1XoyYyJMvzLL59mhAyb3p/cD+Y3/s3WhAx+l0XOKpzXnblrv9d3q4c2tWmm/SyFqthaqd0= admin@vm"}}]' \
  --tags key1="myvalue1" key2="myvalue2" \
  --cluster-name "clusterName" \
  --resource-group "resourceGroupName"
```

For assistance in creating the `--user-list` structure, see [Azure CLI Shorthand](https://github.com/Azure/azure-cli/blob/dev/doc/shorthand_syntax.md).

## Deleting a BMC keyset

The `bmckeyset delete` command removes SSH access to the BMC for a group of users. All members of the group lose SSH access to any of the BMCs in the Cluster.

The command syntax is:

```azurecli
az networkcloud cluster bmckeyset delete \
  --name <BMC Keyset Name> \
  --cluster-name <Cluster Name> \
  --resource-group <Resource Group Name> \
```

### Delete Arguments

```azurecli
  --bmc-key-set-name --name -n                [Required] : The name of the BMC key set to be deleted.
  --cluster-name                              [Required] : The name of the cluster.
  --resource-group -g                         [Required] : Name of resource group. Optional if configuring the
                                                           default group using `az configure --defaults
                                                           group=<name>`.
  --no-wait                                              : Do not wait for the long-running operation to finish.
  --yes -y                                               : Do not prompt for confirmation.
```

This example removes the "bmcKeysetName" keyset group in the "clusterName" Cluster.

```azurecli
az networkcloud cluster bmckeyset delete \
  --name "bmcKeySetName" \
  --cluster-name "clusterName" \
  --resource-group "resourceGroupName" \
```

## Updating a BMC Keyset

The `bmckeyset update` command allows users to make changes to an existing keyset group.

The command syntax is:

```azurecli
az networkcloud cluster bmckeyset update \
  --name <BMC Keyset Name> \
  --privilege-level <"Standard" or "Superuser"> \
  --user-list '[{"description":"<User List Description>","azureUserName":"<User Name>",\
    "sshPublicKey":{"keyData":"<SSH Public Key>"}, \
    "userPrincipalName":""}]', \
  --tags key1=<Key Value> key2=<Key Value> \
  --cluster-name <Cluster Name> \
  --resource-group <Resource Group Name>
```

### Update Arguments

```azurecli
  --bmc-key-set-name --name -n                [Required] : The name of the BMC key set.
  --cluster-name                              [Required] : The name of the cluster.
  --expiration                                [Required] : The date and time after which the users
                                                           in this key set are removed from
                                                           the BMCs. The maximum expiration date is a
                                                           year from creation date. Format is
                                                           "YYYY-MM-DDTHH:MM:SS.000Z".
  --privilege-level                                      : The access level allowed for the users
                                                           in this key set.  Allowed values:
                                                           "Administrator" or "ReadOnly".
  --user-list                                            : The unique list of permitted users.
    Usage: --user-list azure-user-name=XX description=XX key-data=XX
      azure-user-name: Required. User name used to login to the server.
      description: The free-form description for this user.
      key-data: Required. The public SSH key of the user.
      userPrincipalName: Required. The User Principal Name of the User.

      Multiple users can be specified by using more than one --user-list argument.
  --resource-group -g                         [Required] : Name of resource group. Optional if
                                                           configuring the default group using `az
                                                           configure --defaults group=<name>`.
  --tags                                                 : Space-separated tags: key[=value]
                                                           [key[=value] ...]. Use '' to clear
                                                           existing tags.
  --no-wait                                              : Do not wait for the long-running
                                                           operation to finish.
```

This example adds two new users to the "bmcKeySetName" group and changes the expiry time for the group.

```azurecli
az networkcloud cluster bmckeyset update \
  --name "bmcKeySetName" \
  --expiration "2023-12-31T23:59:59.008Z" \
  --user-list '[{"description":"Needs access for troubleshooting as a part of the support team",\
    "azureUserName":"userDEF", \
    "sshPublicKey":{"keyData":"ssh-rsa  AAtsE3njSONzDYRIZv/WLjVuMfrUSByHp+jfaaOLHTIIB4fJvo6dQUZxE20w2iDHV3tEkmnTo84eba97VMueQD6OzJPEyWZMRpz8UYWOd0IXeRqiFu1lawNblZhwNT/ojNZfpB3af/YDzwQCZgTcTRyNNhL4o/blKUmug0daSsSXISTRnIDpcf5qytjs1XoyYyJMvzLL59mhAyb3p/cD+Y3/s3WhAx+l0XOKpzXnblrv9d3q4c2tWmm/SyFqthaqd0= admin@vm"}, \
    "userPrincipalName":"example@contoso.com"}] \
  --cluster-name "clusterName" \
  --resource-group "resourceGroupName"
```

## Listing BMC Keysets

The `bmckeyset list` command allows users to see the existing keyset groups in a Cluster.

The command syntax is:

```azurecli
az networkcloud cluster bmckeyset list \
  --cluster-name <Cluster Name> \
  --resource-group <Resource Group Name>
```

### List Arguments

```azurecli
  --cluster-name                              [Required] : The name of the cluster.
  --resource-group -g                         [Required] : Name of resource group. Optional if
                                                             configuring the default group using `az
                                                             configure --defaults group=<name>`.
```

## Show BMC Keyset Details

The `bmckeyset show` command allows users to see the details of an existing keyset group in a Cluster.

The command syntax is:

```azurecli
az networkcloud cluster bmckeyset show \
  --cluster-name <Cluster Name> \
  --resource-group <Resource Group Name>
```

### Show Arguments

```azurecli
  --bmc-key-set-name --name -n                [Required] : The name of the BMC key set.
  --cluster-name                              [Required] : The name of the cluster.
  --resource-group -g                         [Required] : Name of resource group. You can
                                                           configure the default group using `az
                                                           configure --defaults group=<name>`.
```
