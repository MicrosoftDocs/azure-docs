---
title: "Migrate Azure Database for MySQL - Single Server to Flexible Server using Azure MySQL Import CLI"
description: This tutorial describes how to use the Azure MySQL Import CLI to migrate an Azure Database for MySQL Single Server to Flexible Server.
author: adig
ms.author: adig
ms.reviewer: maghan
ms.date: 07/03/2023
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
ms.custom:
  - mvc
  - devx-track-azurecli
  - mode-api
ms.devlang: azurecli
---
# Migrate Azure Database for MySQL - Single Server to Flexible Server using Azure MySQL Import CLI

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

Azure MySQL Import enables you to migrate your Azure Database for MySQL seamlessly - Single Server to Flexible Server. It uses snapshot backup and restores technology to offer a simple and fast migration path to restore the source server's physical data files to the target server. Post MySQL Import operation, you can take advantage of the benefits of Flexible Server, including better price & performance, granular control over database configuration, and custom maintenance windows.

Azure MySQL Import currently supports the offline mode of import. Based on user-inputs, it takes up the responsibility of provisioning your target Flexible Server and then taking the backup of the source server and restoring the target. It copies the data files, server parameters and server properties - tier, version, sku-name, storage-size, location, geo-redundant-backup, public-access, tags, auto grow, backup-retention-days, admin-user and admin-password from Single to Flexible Server instance.

This tutorial shows how to use the Azure MySQL Import CLI command to migrate your Azure Database for MySQL Single Server to Flexible Server.

## Launch Azure Cloud Shell

The [Azure Cloud Shell](../../cloud-shell/overview.md) is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, select **Try it** from the upper right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this tutorial requires Azure CLI version 2.52.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Setup

You must sign in to your account using the [az sign-in](/cli/azure/reference-index#az-login) command. Note the **id** property, which refers to your Azure account's **Subscription ID**.

```azurecli-interactive
az login
```

Select the specific subscription in which the source Azure Database for MySQL - Single Server resides under your account using the [az account set](/cli/azure/account#az-account-set) command. Note the **id** value from the **az login** output to use as the value for the **subscription** argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the source Azure Database for MySQL - Single Server resides. To get all your subscriptions, use [az account list](/cli/azure/account#az-account-list).

```azurecli-interactive
az account set --subscription <subscription id>
```

## Limitations and pre-requisites

- The source Azure Database for MySQL - Single Server and the target Azure Database for MySQL - Flexible Server must be in the same subscription, resource group, region, and on the same MySQL version. MySQL Import across subscriptions, resource groups, regions, and versions isn't possible.
- MySQL versions supported by Azure MySQL Import are 5.7 and 8.0. If you are on a different major MySQL version on Single Server, make sure to upgrade your version on your Single Server instance before triggering the import command.
- If the Azure Database for MySQL - Single Server instance has server parameter 'lower_case_table_names' set to 2 and your application used partition tables, MySQL Import will result in corrupted partition tables. The recommendation is to set 'lower_case_table_names' to 1 for your Azure Database for MySQL - Single Server instance in order to proceed with corruption-free MySQL Import operation.
- MySQL Import for Single Servers with Legacy Storage architecture (General Purpose storage V1) isn't supported. You must upgrade your storage to the latest storage architecture (General Purpose storage V2) to trigger a MySQL Import operation. Find your storage type and upgrade steps by following directions [here](../single-server/concepts-pricing-tiers.md#how-can-i-determine-which-storage-type-my-server-is-running-on).
- MySQL Import to an existing Azure MySQL Flexible Server isn't supported. The CLI command initiates the import of a new Azure MySQL Flexible Server.
- If the flexible target server is provisioned as non-HA (High Availability disabled) when updating the CLI command parameters, it can later be switched to Same-Zone HA but not Zone-Redundant HA.
- For CMK enabled Single Server instances, MySQL Import command requires you to provide mandatory input parameters for enabling CMK on target Flexible Server.
- If the Single Server instance has ' Infrastructure Double Encryption' enabled, enabling Customer Managed Key (CMK) on target Flexible Server instance is recommended to support similar functionality. You can choose to enable CMK on target server with MySQL Import CLI input parameters or post migration as well.
- Only instance-level import is supported. No option to import selected databases within an instance is provided.
- Below items should be copied from source to target by the user post MySQL Import operation:
  - Firewall rules
  - Read-Replicas
  - Monitoring page settings (Alerts, Metrics, and Diagnostic settings)
  - Any Terraform/CLI scripts hosted by you to manage your Single Server instance should be updated with Flexible Server references

## Trigger a MySQL Import operation to migrate from Azure Database for MySQL - Single Server to Flexible Server

Trigger a MySQL Import operation with the `az mysql flexible-server import create` command. The following command creates a target Flexible Server and performs instance-level import from source to target destination using service defaults and values from your Azure CLI's local context:

```azurecli
az mysql flexible-server import create --data-source-type
                                --data-source
                                --resource-group
                                --name
                                [--sku-name]
                                [--tier]
                                [--version]
                                [--storage-size]
                                [--mode]
                                [--admin-password]
                                [--admin-user]
                                [--auto-scale-iops {Disabled, Enabled}]
                                [--backup-identity]
                                [--backup-key]
                                [--backup-retention]
                                [--database-name]
                                [--geo-redundant-backup {Disabled, Enabled}]
                                [--high-availability {Disabled, SameZone, ZoneRedundant}]
                                [--identity]
                                [--iops]
                                [--key]
                                [--location]
                                [--private-dns-zone]
                                [--public-access]
                                [--resource-group]
                                [--standby-zone]
                                [--storage-auto-grow {Disabled, Enabled}]
                                [--subnet]
                                [--subnet-prefixes]
                                [--tags]
                                [--vnet]
                                [--zone]
```

The following example takes in the data source information for Single Server named 'test-single-server' and target Flexible Server information, creates a target Flexible Server named `test-flexible-server` in the `westus` location (same location as that of the source Single Server) and performs an import from source to target. MySQL Import command maps over the corresponding tier, version, sku-name, storage-size, location, geo-redundant-backup, public-access, tags, auto grow, backup-retention-days, admin-user and admin-password  properties from Single Server to Flexible Server as smart defaults if no inputs are provided to the CLI command. You can chose to override the smart defaults by providing inputs for these optional parameters.

```azurecli-interactive
az mysql flexible-server import create --data-source-type "mysql_single" --data-source "test-single-server" --resource-group "test-rg"  --name "test-flexible-server"
```

The following example takes in the data source information for Single Server named 'test-single-server' and target Flexible Server information, creates a target Flexible Server named `test-flexible-server` in the `westus` location (same location as that of the source Single Server) with Zone Redundancy enabled and virtual network integration and performs an import from source to target. Learn more about virtual network configuration [here](../flexible-server/how-to-manage-virtual-network-cli.md).

```azurecli-interactive
# create vnet
az network vnet create --resource-group testGroup --name myVnet --location testLocation --address-prefixes 172.0.0.0/16

# create subnet
az network vnet subnet create --resource-group testGroup --vnet-name myVnet --address-prefixes 172.0.0.0/24 --name mySubnet

# create private dns zone
az network private-dns zone create -g testGroup -n myserver.private.contoso.com

# trigger mysql import
az mysql flexible-server import create --data-source-type "mysql_single" --data-source "test-single-server" --resource-group "test-rg"  --name "test-flexible-server" --high-availability ZoneRedundant --zone 1 --standby-zone 3  --vnet "myVnet" --subnet "mySubnet" --private-dns-zone "myserver.private.contoso.com"
```

The following example takes in the data source information for Single Server named 'test-single-server' with Customer Managed Key (CMK) enabled and target Flexible Server information, creates a target Flexible Server named `test-flexible-server` and performs an import from source to target. For CMK enabled Single Server instances, MySQL Import command requires you to provide mandatory input parameters for enabling CMK : --key keyIdentifierOfTestKey --identity testIdentity.

```azurecli-interactive
# create keyvault
az keyvault create -g testGroup -n testVault --location testLocation \
  --enable-purge-protection true

# create key in keyvault and save its key identifier
keyIdentifier=$(az keyvault key create --name testKey -p software \
  --vault-name testVault --query key.kid -o tsv)

# create identity and save its principalId
identityPrincipalId=$(az identity create -g testGroup --name testIdentity \
  --location testLocation --query principalId -o tsv)

# add testIdentity as an access policy with key permissions 'Wrap Key', 'Unwrap Key', 'Get' and 'List' inside testVault
az keyvault set-policy -g testGroup -n testVault --object-id $identityPrincipalId \
  --key-permissions wrapKey unwrapKey get list

# trigger mysql import for CMK enabled single server
az mysql flexible-server import create --data-source-type "mysql_single" --data-source "test-single-server" --resource-group "test-rg"  --name "test-flexible-server" --key $keyIdentifier --identity testIdentity
```

Here are the details for the arguments above:

**Setting** | **Sample value** | **Description**
---|---|---
data-source-type | mysql_single | The type of data source that serves as the source destination for triggering MySQL Import. Accepted values: [mysql_single]. Description of accepted values- mysql_single: Azure Database for MySQL Single Server.
data-source | test-single-server | The name or resource ID of the source Azure Database for MySQL Single Server.
resource-group | test-rg | The name of the Azure resource group of the source Azure Database for MySQL Single Server.
mode | Offline | The mode of MySQL import. Accepted values: [Offline]; Default value: Offline.
location | westus | The Azure location for the source Azure Database for MySQL Single Server.
name | test-flexible-server | Enter a unique name for your target Azure Database for MySQL Flexible Server. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain from 3 to 63 characters. Note: This server is deployed in the same subscription, resource group, and region as the source.
admin-user | adminuser | The username for the administrator sign-in for your target Azure Database for MySQL Flexible Server. It can't be **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public**.
admin-password | *password* | The administrator user's password for your target Azure Database for MySQL Flexible Server. It must contain between 8 and 128 characters. Your password must contain characters from three categories: English uppercase letters, English lowercase letters, numbers, and nonalphanumeric characters.
sku-name|GP_Gen5_2|Enter the name of the pricing tier and compute configuration for your target Azure Database for MySQL Flexible Server. Follows the convention {pricing tier}*{compute generation}*{vCores} in shorthand. See the [pricing tiers](../flexible-server/concepts-service-tiers-storage.md#service-tiers-size-and-server-types) for more information.
tier | Burstable | Compute tier of the target Azure Database for MySQL Flexible Server. Accepted values: Burstable, GeneralPurpose, MemoryOptimized; Default value: Burstable.
public-access | 0.0.0.0 | Determines the public access for the target Azure Database for MySQL Flexible Server. Enter single or range of IP addresses to be included in the allowed list of IPs. IP address ranges must be dash-separated and not contain any spaces. Specifying 0.0.0.0 allows public access from any resources deployed within Azure to access your server. Setting it to "None" sets the server in public access mode but doesn't create a firewall rule.
vnet | myVnet | Name or ID of a new or existing virtual network. If you want to use a vnet from different resource group or subscription, please provide a resource ID. The name must be between 2 to 64 characters. The name must begin with a letter or number, end with a letter, number or underscore, and may contain only letters, numbers, underscores, periods, or hyphens.
subnet | mySubnet | Name or resource ID of a new or existing subnet. If you want to use a subnet from different resource group or subscription, please provide resource ID instead of name. Please note that the subnet will be delegated to flexibleServers. After delegation, this subnet cannot be used for any other type of Azure resources.
private-dns-zone | myserver.private.contoso.com | The name or id of new or existing private dns zone. You can use the private dns zone from same resource group, different resource group, or different subscription. If you want to use a zone from different resource group or subscription, please provide resource Id. CLI creates a new private dns zone within the same resource group as virtual network if not provided by users.
key | key identifier of testKey | The resource ID of the primary keyvault key for data encryption.
identity | testIdentity | The name or resource ID of the user assigned identity for data encryption.
storage-size | 32 | The storage capacity of the target Azure Database for MySQL Flexible Server. The minimum is 20 GiB, and max is 16 TiB.
tags | key=value | Provide the name of the Azure resource group.
version | 5.7 | Server major version of the target Azure Database for MySQL Flexible Server.
high-availability | ZoneRedundant | Enable (ZoneRedundant or SameZone) or disable the high availability feature for the target Azure Database for MySQL Flexible Server. Accepted values: Disabled, SameZone, ZoneRedundant; Default value: Disabled.
zone | 1 | Availability zone into which to provision the resource.
standby-zone | 3 | The availability zone information of the standby server when high Availability is enabled.
storage-auto-grow | Enabled | Enable or disable auto grow of storage for the target Azure Database for MySQL Flexible Server. The default value is Enabled. Accepted values: Disabled, Enabled; Default value: Enabled.
iops | 500 | Number of IOPS to be allocated for the target Azure Database for MySQL Flexible Server. You get a certain amount of free IOPS based on compute and storage provisioned. The default value for IOPS is free IOPS. To learn more about IOPS based on compute and storage, refer to IOPS in Azure Database for MySQL Flexible Server.

## Best practices for configuring Azure MySQL Import CLI command parameters

 Before you trigger the Azure MySQL Import command, consider the following parameter configuration guidance to help ensure faster data loads using Azure MySQL Import.

- If you want to override smart defaults, select the compute tier and SKU name for the target flexible server based on the source single server’s pricing tier and VCores based on the detail in the following table.

    | Single Server Pricing Tier | Single Server VCores | Flexible Server Tier | Flexible Server SKU Name |
    | ------------- | ------------- |:-------------:|:-------------:|
    | Basic | 1 | Burstable | Standard_B1s |
    | Basic | 2 | Burstable | Standard_B2s |
    | General Purpose | 4 | GeneralPurpose | Standard_D4ds_v4 |
    | General Purpose | 8 | GeneralPurpose | Standard_D8ds_v4 |
    | General Purpose | 16 | GeneralPurpose | Standard_D16ds_v4 |
    | General Purpose | 32 | GeneralPurpose | Standard_D32ds_v4 |
    | General Purpose | 64 | GeneralPurpose | Standard_D64ds_v4 |
    | Memory Optimized | 4 | MemoryOptimized | Standard_E4ds_v4 |
    | Memory Optimized | 8 | MemoryOptimized | Standard_E8ds_v4 |
    | Memory Optimized | 16 | MemoryOptimized | Standard_E16ds_v4 |
    | Memory Optimized | 32 | MemoryOptimized | Standard_E32ds_v4 |

- The MySQL version, region, subscription and resource for the target flexible server must be equal to that of the source single server.
- The storage size for target flexible server should be equal to or greater than on the source single server.
- If the Single Server instance has ' Infrastructure Double Encryption' enabled, enabling Customer Managed Key (CMK) on target Flexible Server instance is recommended to support similar functionality. You can choose to enable CMK on target server with MySQL Import CLI input parameters or post migration as well.

## How long does MySQL Import take to migrate my Single Server instance?

Below is the benchmarked performance based on storage size.

  | Single Server Storage Size | MySQL Import time |
  | ------------- |:-------------:|
  | 1 GiB | 0 min 23 secs |
  | 10 GiB | 4 min 24 secs |
  | 100 GiB | 10 min 29 secs |
  | 500 GiB | 13 min 15 secs |
  | 1 TB | 22 min 56 secs |
  | 10 TB | 2 hrs 5 min 30 secs |
  
From the table above, as the storage size increases, the time required for data copying also increases, almost in a linear relationship. However, it's important to note that copy speed can be significantly impacted by network fluctuations. Therefore, the data provided here should be taken as a reference only.

Below is the benchmarked performance based on varying number of tables for 10 GiB storage size.

  | Number of tables in Single Server instance | MySQL Import time |
  | ------------- | :-------------: |
  | 100 | 4 min 24 secs |
  | 200 | 4 min 40 secs |
  | 800 | 4 min 52 secs |
  | 14,400 | 17 min 41 secs |
  | 28,800 | 19 min 18 secs |
  | 38,400 | 22 min 50 secs |
  
 As the number of files increases, each file/table in the database may become very small. This will result in a consistent amount of data being transferred, but there will be more frequent file-related operations, which may impact the performance of Mysql Import.

## Post-import steps

- Copy the following properties from the source Single Server to target Flexible Server post MySQL Import operation is completed successfully:
  - Firewall rules
  - Read-Replicas
  - Monitoring page settings (Alerts, Metrics, and Diagnostic settings)
  - Any Terraform/CLI scripts you host to manage your Single Server instance should be updated with Flexible Server references.

## Next steps

- [Manage an Azure Database for MySQL - Flexible Server using the Azure portal](../flexible-server/how-to-manage-server-portal.md)
