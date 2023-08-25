---
title: Manage emergency access to a bare metal machine using the `az networkcloud cluster baremetalmachinekeyset` command for Azure Operator Nexus
description: Step by step guide on using the `az networkcloud cluster baremetalmachinekeyset` command to manage emergency access to a bare metal machine.
author: eak13
ms.author: ekarandjeff
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 04/18/2023
ms.custom: template-how-to, devx-track-azurecli
---

# Manage emergency access to a bare metal machine using the `az networkcloud cluster baremetalmachinekeyset`

> [!CAUTION]
> Please note this process is used in emergency situations when all other troubleshooting options using Azure have been exhausted. SSH access to these bare metal machines is restricted to users managed via this method from the specified jump host list.

There are rare situations where a user needs to investigate & resolve issues with a bare metal machine and all other ways have been exhausted via Azure. Azure Operator Nexus provides the `az networkcloud cluster baremetalmachinekeyset` command so users can manage SSH access to these bare metal machines.

When the command runs, it executes on each bare metal machine in the Cluster with an active Kubernetes node. There's a reconciliation process that runs periodically that retries the command on any bare metal machine that wasn't available at the time of the original command. Also, any bare metal machine that returns to the cluster via an `az networkcloud baremetalmachine actionreimage` or `az networkcloud baremetalmachine actionreplace` command (see [BareMetal functions](./howto-baremetal-functions.md)) sends a signal causing any active keysets to be sent to the machine as soon as it returns to the cluster. Multiple commands execute in the order received.

There's no limit to the number of users in a group.

> [!CAUTION]
> Notes for jump host IP addresses

- The keyset create/update process adds the jump host IP addresses to the IP tables for each machine in the Cluster. This restricts SSH access to be allowed only from those jump hosts.
- It's important to specify the Cluster facing IP addresses for the jump hosts. These IP addresses may be different than the public facing IP address used to access the jump host.
- Once added, users are able to access bare metal machines from any specified jump host IP including a jump host IP defined in another bare metal machine keyset group.
- Existing SSH access remains when adding the first bare metal machine keyset. However, the keyset command limits an existing user's SSH access to the specified jump host IPs in the keyset commands.
- Currently, only IPv4 jump host addresses are supported. There is a known issue that IPv4 jump host addresses may be mis-parsed and lost if IPv6 addresses are also specified in the `--jump-hosts-allowed` argument of an `az networkcloud cluster baremetalmachinekeyset` command. Use only IPv4 addresses until IPv6 support is added.

## Prerequisites

- Install the latest version of the [appropriate CLI extensions](./howto-install-cli-extensions.md).
- The on-premises Cluster must have connectivity to Azure.
- Get the Resource Group name for the `Cluster` resource.
- The process applies keysets to all running bare metal machines.
- The added users must be part of an Azure Active Directory (Azure AD) group. For more information, see [How to Manage Groups](../active-directory/fundamentals/how-to-manage-groups.md).
- To restrict access for managing keysets, create a custom role. For more information, see [Azure Custom Roles](../role-based-access-control/custom-roles.md). In this instance, add or exclude permissions for `Microsoft.NetworkCloud/clusters/bareMetalMachineKeySets`. The options are `/read`, `/write`, and `/delete`.

> [!NOTE]
> When bare metal machine access is created, modified or deleted via the commands described in this
> article, a background process delivers those changes to the machines. This process is paused during
> Operator Nexus software upgrades. If an upgrade is known to be in progress, you can use the `--no-wait`
> option with the command to prevent the command prompt from waiting for the process to complete.

## Creating a bare metal machine keyset

The `baremetalmachinekeyset create` command creates SSH access to the bare metal machine in a Cluster for a group of users.

The command syntax is:

```azurecli
az networkcloud cluster baremetalmachinekeyset create \
  --name <bare metal machine Keyset Name> \
  --extended-location name=<Extended Location ARM ID> \
    type="CustomLocation" \
  --location <Azure Region> \
  --azure-group-id <Azure AAD Group ID> \
  --expiration <Expiration Timestamp> \
  --jump-hosts-allowed <List of jump server IP addresses> \
  --os-group-name <Name of the Operating System Group> \
  --privilege-level <"Standard" or "Superuser"> \
  --user-list '[{"description":"<User List Description>","azureUserName":"<User Name>",\
    "sshPublicKey":{"keyData":"<SSH Public Key>"}}]' \
  --tags key1=<Key Value> key2=<Key Value> \
  --cluster-name <Cluster Name> \
  --resource-group <Resource Group>
```

### Create Arguments

```azurecli
  --azure-group-id                            [Required] : The object ID of Azure Active Directory
                                                           group that all users in the list must
                                                           be in for access to be granted. Users
                                                           that are not in the group do not have
                                                           access.
  --bare-metal-machine-key-set-name --name -n [Required] : The name of the bare metal machine key
                                                           set.
  --cluster-name                              [Required] : The name of the cluster.
  --expiration                                [Required] : The date and time after which the users
                                                           in this key set are removed from
                                                           the bare metal machines. Format is:
                                                           "YYYY-MM-DDTHH:MM:SS.000Z"
  --extended-location                         [Required] : The extended location of the cluster
                                                           associated with the resource.
    Usage: --extended-location name=XX type=XX
      name: Required. The resource ID of the extended location on which the resource is created.
      type: Required. The extended location type: "CustomLocation".
  --jump-hosts-allowed                        [Required] : The list of IP addresses of jump hosts
                                                           with management network access from
                                                           which a login is be allowed for the
                                                           users. Supports IPv4 or IPv6 addresses.
  --privilege-level                           [Required] : The access level allowed for the users
                                                           in this key set.  Allowed values:
                                                           "Standard" or "Superuser".
  --resource-group -g                         [Required] : Name of resource group. Optional if
                                                           configuring the default group using `az
                                                           configure --defaults group=<name>`.
  --user-list                                 [Required] : The unique list of permitted users.
    Usage: --user-list azure-user-name=XX description=XX key-data=XX
      azure-user-name: Required. User name used to login to the server.
      description: The free-form description for this user.
      key-data: Required. The public ssh key of the user.

      Multiple users can be specified by using more than one --user-list argument.
  --os-group-name                                        : The name of the group that users are assigned
                                                           to on the operating system of the machines.
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
az networkcloud cluster baremetalmachinekeyset create \
  --name "bareMetalMachineKeySetName" \
  --extended-location name="/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ExtendedLocation/customLocations/clusterExtendedLocationName" \
    type="CustomLocation" \
  --location "location" \
  --azure-group-id "f110271b-XXXX-4163-9b99-214d91660f0e" \
  --expiration "2022-12-31T23:59:59.008Z" \
  --jump-hosts-allowed "192.0.2.1" "192.0.2.5" \
  --os-group-name "standardAccessGroup" \
  --privilege-level "Standard" \
  --user-list '[{"description":"Needs access for troubleshooting as a part of the support team","azureUserName":"userABC", "sshPublicKey":{"keyData":"ssh-rsa  AAtsE3njSONzDYRIZv/WLjVuMfrUSByHp+jfaaOLHTIIB4fJvo6dQUZxE20w2iDHV3tEkmnTo84eba97VMueQD6OzJPEyWZMRpz8UYWOd0IXeRqiFu1lawNblZhwNT/ojNZfpB3af/YDzwQCZgTcTRyNNhL4o/blKUmug0daSsSXISTRnIDpcf5qytjs1XoyYyJMvzLL59mhAyb3p/cD+Y3/s3WhAx+l0XOKpzXnblrv9d3q4c2tWmm/SyFqthaqd0= admin@vm"}},\
  {"description":"Needs access for troubleshooting as a part of the support team","azureUserName":"userXYZ","sshPublicKey":{"keyData":"ssh-rsa  AAtsE3njSONzDYRIZv/WLjVuMfrUSByHp+jfaaOLHTIIB4fJvo6dQUZxE20w2iDHV3tEkmnTo84eba97VMueQD6OzJPEyWZMRpz8UYWOd0IXeRqiFu1lawNblZhwNT/ojNZfpB3af/YDzwQCZgTcTRyNNhL4o/blKUmug0daSsSXTSTRnIDpcf5qytjs1XoyYyJMvzLL59mhAyb3p/cD+Y3/s3WhAx+l0XOKpzXnblrv9d3q4c2tWmm/SyFqthaqd0= admin@vm"}}]' \
  --tags key1="myvalue1" key2="myvalue2" \
  --cluster-name "clusterName"
  --resource-group "resourceGroupName"
```

For assistance in creating the `--user-list` structure, see [Azure CLI Shorthand](https://github.com/Azure/azure-cli/blob/dev/doc/shorthand_syntax.md).

## Deleting a bare metal machine keyset

The `baremetalmachinekeyset delete` command removes SSH access to the bare metal machine for a group of users. All members of the group no longer have SSH access to any of the bare metal machines in the Cluster.

The command syntax is:

```azurecli
az networkcloud cluster baremetalmachinekeyset delete \
  --name <bare metal machine Keyset Name> \
  --cluster-name <Cluster Name> \
  --resource-group <Resource Group Name>
```

### Delete Arguments

```azurecli
    --bare-metal-machine-key-set-name --name -n [Required] : The name of the bare metal machine key set to be
                                                             deleted.
    --cluster-name                              [Required] : The name of the cluster.
    --resource-group -g                         [Required] : Name of resource group. Optional if configuring the
                                                             default group using `az configure --defaults
                                                             group=<name>`.
    --no-wait                                              : Do not wait for the long-running operation to
                                                             finish.
    --yes -y                                               : Do not prompt for confirmation.
```

This example removes the "bareMetalMachineKeysetName" keyset group in the "clusterName" Cluster.

```azurecli
az networkcloud cluster baremetalmachinekeyset delete \
  --name "bareMetalMachineKeySetName" \
  --cluster-name "clusterName" \
  --resource-group "resourceGroupName"
```

## Updating a Bare Metal Machine Keyset

The `baremetalmachinekeyset update` command allows users to make changes to an existing keyset group.

The command syntax is:

```azurecli
az networkcloud cluster baremetalmachinekeyset update \
  --name <bare metal machine Keyset Name> \
  --jump-hosts-allowed <List of jump server IP addresses> \
  --privilege-level <"Standard" or "Superuser"> \
  --user-list '[{"description":"<User List Description>","azureUserName":"<User Name>",\
   "sshPublicKey":{"keyData":"<SSH Public Key>"}}]' \
  --tags key1=<Key Value> key2=<Key Value> \
  --cluster-name <Cluster Name> \
  --resource-group <Resource Group>
```

### Update Arguments

```azurecli
  --bare-metal-machine-key-set-name --name -n [Required] : The name of the bare metal machine key set.
  --cluster-name                              [Required] : The name of the cluster.
  --expiration                                           : The date and time after which the users
                                                           in this key set are removed from
                                                           the bare metal machines. Format is:
                                                           "YYYY-MM-DDTHH:MM:SS.000Z"
  --jump-hosts-allowed                                   : The list of IP addresses of jump hosts
                                                           with management network access from
                                                           which a login is allowed for the
                                                           users. Supports IPv4 or IPv6 addresses.
  --privilege-level                                      : The access level allowed for the users
                                                           in this key set.  Allowed values:
                                                           "Standard" or "Superuser".
  --user-list                                            : The unique list of permitted users.
    Usage: --user-list azure-user-name=XX description=XX key-data=XX
      azure-user-name: Required. User name used to login to the server.
      description: The free-form description for this user.
      key-data: Required. The public SSH key of the user.

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

This example adds two new users to the "baremetalMachineKeySetName" group and changes the expiry time for the group.

```azurecli
az networkcloud cluster baremetalmachinekeyset update \
  --name "bareMetalMachineKeySetName" \
 --expiration "2023-12-31T23:59:59.008Z" \
  --user-list '[{"description":"Needs access for troubleshooting as a part of the support team",\
  "azureUserName":"userABC","sshPublicKey":{"keyData":"ssh-rsa  AAtsE3njSONzDYRIZv/WLjVuMfrUSByHp+jfaaOLHTIIB4fJvo6dQUZxE20w2iDHV3tEkmnTo84eba97VMueQD6OzJPEyWZMRpz8UYWOd0IXeRqiFu1lawNblZhwNT/ojNZfpB3af/YDzwQCZgTcTRyNNhL4o/blKUmug0daSsSXISTRnIDpcf5qytjs1XoyYyJMvzLL59mhAyb3p/cD+Y3/s3WhAx+l0XOKpzXnblrv9d3q4c2tWmm/SyFqthaqd0= admin@vm"}},\
  {"description":"Needs access for troubleshooting as a part of the support team",\
  "azureUserName":"userXYZ","sshPublicKey":{"keyData":"ssh-rsa  AAtsE3njSONzDYRIZv/WLjVuMfrUSByHp+jfaaOLHTIIB4fJvo6dQUZxE20w2iDHV3tEkmnTo84eba97VMueQD6OzJPEyWZMRpz8UYWOd0IXeRqiFu1lawNblZhwNT/ojNZfpB3af/YDzwQCZgTcTRyNNhL4o/blKUmug0daSsSXTSTRnIDpcf5qytjs1XoyYyJMvzLL59mhAyb3p/cD+Y3/s3WhAx+l0XOKpzXnblrv9d3q4c2tWmm/SyFqthaqd0= admin@vm"}}]' \
   --cluster-name "clusterName" \
  --resource-group "resourceGroupName"
```

## Listing Bare Metal Machine Keysets

The `baremetalmachinekeyset list` command allows users to see the existing keyset groups in a Cluster.

The command syntax is:

```azurecli
az networkcloud cluster baremetalmachinekeyset list \
  --cluster-name <Cluster Name> \
  --resource-group <Resource Group>
```

### List Arguments

```azurecli
  --cluster-name                              [Required] : The name of the cluster.
  --resource-group -g                         [Required] : Name of resource group. Optional if
                                                           configuring the default group using `az
                                                           configure --defaults group=<name>`.
```

## Show Bare Metal Machine Keyset Details

The `baremetalmachinekeyset show` command allows users to see the details of an existing keyset group in a Cluster.

The command syntax is:

```azurecli
az networkcloud cluster baremetalmachinekeyset show \
  --cluster-name <Cluster Name> \
  --resource-group <Resource Group>
```

### Show Arguments

```azurecli
  --bare-metal-machine-key-set-name --name -n [Required] : The name of the bare metal machine key
                                                           set.
  --cluster-name                              [Required] : The name of the cluster.
  --resource-group -g                         [Required] : Name of resource group. You can
                                                           configure the default group using `az
                                                           configure --defaults group=<name>`.
```
