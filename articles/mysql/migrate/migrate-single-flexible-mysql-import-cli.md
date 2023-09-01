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

Azure MySQL Import currently supports the offline mode of import. Based on user-inputs, it takes up the responsibility of provisioning your target Flexible Server and then taking the backup of the source server and restoring the target.

This tutorial shows how to use the Azure MySQL Import CLI command to migrate your Azure Database for MySQL Single Server to Flexible Server.

## Launch Azure Cloud Shell

The [Azure Cloud Shell](../../cloud-shell/overview.md) is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, select **Try it** from the upper right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this tutorial requires Azure CLI version 2.50.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Prerequisites

You must sign in to your account using the [az sign-in](/cli/azure/reference-index?view=azure-cli-latest#az-login) command. Note the **id** property, which refers to your Azure account's **Subscription ID**.

```azurecli-interactive
az login
```

Select the specific subscription in which the source Azure Database for MySQL - Single Server resides under your account using the [az account set](/cli/azure/account?view=azure-cli-latest#az-account-set) command. Note the **id** value from the **az login** output to use as the value for the **subscription** argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the source Azure Database for MySQL - Single Server resides. To get all your subscriptions, use [az account list](/cli/azure/account?view=azure-cli-latest#az-account-list).

```azurecli-interactive
az account set --subscription <subscription id>
```

## Limitations

- The source Azure Database for MySQL - Single Server and the target Azure Database for MySQL - Flexible Server must be in the same subscription, resource group, region, and on the same MySQL version. MySQL Import across subscriptions, resource groups, regions, and versions isn't possible.
- MySQL versions supported by Azure MySQL Import are 5.7 and 8.0.21. If you are on a different MySQL version on Single Server, make sure to upgrade your version on your Single Server instance before triggering the import command.
- MySQL Import for Single Servers with Legacy Storage architecture (General Purpose storage V1) isn't supported. You must upgrade your storage to the latest storage architecture (General Purpose storage V2) to trigger a MySQL Import operation. Find your storage type and upgrade steps by following directions [here](../single-server/concepts-pricing-tiers.md#how-can-i-determine-which-storage-type-my-server-is-running-on).
- MySQL Import to an existing Azure MySQL Flexible Server isn't supported. The CLI command initiates the import of a new Azure MySQL Flexible Server.
- If the flexible target server is provisioned as non-HA (High Availability disabled) when updating the CLI command parameters, it can later be switched to Same-Zone HA but not Zone-Redundant HA.
- MySQL Import doesn't currently support Azure Database for MySQL Single Servers with Customer managed key (CMK).
- MySQL Imposer doesn't currently support Azure Database for MySQL Single Servers with Infrastructure Double Encryption.
- Only instance-level import is supported. No option to import selected databases within an instance is provided.
- Below items should be copied from source to target by the user post MySQL Import operation:
  - Server parameters
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
                                --sku-name
                                --tier
                                --version
                                --storage-size
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

The following example takes in the data source information for Single Server named 'test-single-server' and target Flexible Server information, creates a target Flexible Server named `test-flexible-server` in the `westus` location (same location as that of the source Single Server) and performs an import from source to target.

```azurecli-interactive
az mysql flexible-server import create --data-source-type "mysql_single" --data-source "test-single-server" --resource-group "test-rg" --location westus --name "test-flexible-server" --admin-user "username" --admin-password "password" --sku-name "Standard_B1ms" --tier "Burstable" --public-access 0.0.0.0 --storage-size 32 --tags "key=value" --version 5.7 --high-availability ZoneRedundant --zone 1 --standby-zone 3 --storage-auto-grow Enabled --iops 500
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
storage-size | 32 | The storage capacity of the target Azure Database for MySQL Flexible Server. The minimum is 20 GiB, and max is 16 TiB.
tags | key=value | Provide the name of the Azure resource group.
version | 5.7 | Server major version of the target Azure Database for MySQL Flexible Server. Default value: 5.7.
high-availability | ZoneRedundant | Enable (ZoneRedundant or SameZone) or disable the high availability feature for the target Azure Database for MySQL Flexible Server. Accepted values: Disabled, SameZone, ZoneRedundant; Default value: Disabled.
zone | 1 | Availability zone into which to provision the resource.
standby-zone | 3 | The availability zone information of the standby server when high Availability is enabled.
storage-auto-grow | Enabled | Enable or disable auto grow of storage for the target Azure Database for MySQL Flexible Server. The default value is Enabled. Accepted values: Disabled, Enabled; Default value: Enabled.
iops | 500 | Number of IOPS to be allocated for the target Azure Database for MySQL Flexible Server. You get a certain amount of free IOPS based on compute and storage provisioned. The default value for IOPS is free IOPS. To learn more about IOPS based on compute and storage, refer to IOPS in Azure Database for MySQL Flexible Server.

## Best practices for configuring Azure MySQL Import CLI command parameters

 Before you trigger the Azure MySQL Import command, consider the following parameter configuration guidance to help ensure faster data loads using Azure MySQL Import.

- Select the compute tier and SKU name for the target flexible server based on the source single server’s pricing tier and VCores based on the detail in the following table.

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
  | ------------- |:-------------:|
  | 100 | 4 min 24 secs |
  | 200 | 4 min 40 secs |
  | 800 | 4 min 52 secs |
  | 14,400 | 17 min 41 secs |
  | 28,800 | 19 min 18 secs |
  | 38,400 | 22 min 50 secs |
  
 As the number of files increases, each file/table in the database may become very small. This will result in a consistent amount of data being transferred, but there will be more frequent file-related operations, which may impact the performance of Mysql Import.

## Post-import steps

- Copy the following properties from the source Single Server to target Flexible Server post MySQL Import operation is completed successfully:
  - Server parameters
  - Firewall rules
  - Read-Replicas
  - Monitoring page settings (Alerts, Metrics, and Diagnostic settings)
  - Any Terraform/CLI scripts you host to manage your Single Server instance should be updated with Flexible Server references.

## Next steps

- [Manage an Azure Database for MySQL - Flexible Server using the Azure portal](../flexible-server/how-to-manage-server-portal.md)
