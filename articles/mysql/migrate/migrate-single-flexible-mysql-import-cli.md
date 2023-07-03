---
title: 'Migrate Azure Database for MySQL - Single Server to Flexible Server using Azure MySQL Import CLI'
description: This tutorial describes how to use the Azure MySQL Import CLI to migrate an Azure Database for MySQL Single Server to Flexible Server.
ms.service: mysql
ms.subservice: single-server
author: adig
ms.author: adig
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 06/20/2023
ms.custom: mvc, devx-track-azurecli, mode-api
---

# Migrate Azure Database for MySQL - Single Server to Flexible Server using Azure MySQL Import CLI

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Azure MySQL Import enables you to seamlessly migrate your Azure Database for MySQL - Single Server to Flexible Server. It uses snapshot backup and restore technology to offer a simple and fast migration path to restore the source server's physical data files onto the target server. Post MySQL Import operation, you can take advantage of the benefits of Flexible Server, including better price & performance, granular control over database configuration, and custom maintenance windows.

Azure MySQL Import currently supports offline mode of import. Based on user-inputs it takes up the responsibility of provisioning your target Flexible Server and then taking the backup of the source server and restoring on the target.

This tutorial shows how to use the Azure MySQL Import CLI command to migrate your Azure Database for MySQL Single Server to Flexible Server.

## Launch Azure Cloud Shell

The [Azure Cloud Shell](../../cloud-shell/overview.md) is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this tutorial requires Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli).

## Prerequisites

You need to log in to your account using the [az login](https://learn.microsoft.com/cli/azure/reference-index?view=azure-cli-latest#az-login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

```azurecli-interactive
az login
```

Select the specific subscription in which the source Azure Database for MySQL - Single Server resides under your account using [az account set](https://learn.microsoft.com/cli/azure/account?view=azure-cli-latest#az-account-set) command. Make a note of the **id** value from the **az login** output to use as the value for **subscription** argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the source Azure Database for MySQL - Single Server resides. To get all your subscriptions, use [az account list](https://learn.microsoft.com/cli/azure/account?view=azure-cli-latest#az-account-list).

```azurecli-interactive
az account set --subscription <subscription id>
```

## Limitations

* The source Azure Database for MySQL - Single Server and the target Azure Database for MySQL - Flexible Server must be in the same subscription, resource group, region and on the same MySQL version. MySQL Import across subscriptions, resource groups, regions and versions aren't possible.
* MySQL Import for Single Servers with Legacy Storage architecture (General Purpose storage V1) isn't supported. You must upgrade your storage to latest storage architecture (General Purpose storage V2) to trigger a MySQL Import operation. Find your storage type and upgrade steps by following directions [here](../single-server/concepts-pricing-tiers.md#how-can-i-determine-which-storage-type-my-server-is-running-on).
* MySQL Import to an existing Azure MySQL Flexible Server isn’t supported. The CLI command provisions a new Azure MySQL Flexible Server and initiate the import.  
* If the target flexible server is provisioned as non-HA (High Availability disabled) when updating the CLI command parameters, it can later be switched to Same-Zone HA but not Zone-Redundant HA.
* Azure Database for MySQL Single Servers with Customer managed key (CMK) aren't supported by MySQL Import currently.
* Only instance level import is supported, no option to import selected databases within an instance is provided.
* Below items should be copied from source to target by the user post MySQL Import operation:  
  * Server parameters  
  * Firewall rules  
  * Read-Replicas  
  * Monitoring blade settings (Alerts, Metrics and Diagnostic settings)
  * Any Terraform/CLI scripts hosted by you to manage your Single Server instance should be updated with Flexible Server references

## Trigger a MySQL Import operation to migrate from Azure Database for MySQL - Single Server to Flexible Server

Trigger a MySQL Import operation with the `az mysql flexible-server import create` command. The following command creates a target Flexible Server and performs instance-level import from source to target destination using service defaults and values from your Azure CLI's local context:

```azurecli
az mysql flexible-server import create --data-source-type
                                --data-source
                                --resource-group
                                --server-name
                                [--subscription]
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
                                [--sku-name]
                                [--standby-zone]
                                [--storage-auto-grow {Disabled, Enabled}]
                                [--storage-size]
                                [--subnet]
                                [--subnet-prefixes]
                                [--tags]
                                [--tier]
                                [--version]
                                [--vnet]
                                [--zone]
```

 The following example takes in the data source information for Single Server named 'test-single-server' and target Flexible Server information, creates a target Flexible Server named `test-flexible-server` in the `westus` location (same location as that of source Single Server) and performs an import from source to target.

```azurecli-interactive
az mysql flexible-server import create --data-source-type “mysql_single” --data-source “test-single-server” --subscription “test-subscription” --resource-group “test-rg” --location westus --server-name "test-flexible-server" --admin-user "username" --admin-password "password" --sku-name "Standard_B1ms" --tier "Burstable" --public-access 0.0.0.0 --storage-size 32 --tags "key=value" --version 5.7 --high-availability ZoneRedundant --zone 1 --standby-zone 3 --storage-auto-grow Enabled --iops 500 
```

Here are the details for arguments above:

**Setting** | **Sample value** | **Description**
---|---|---
data-source-type | mysql_single | The type of data source that serves as the source destination for triggering MySQL Import. Accepted values: [mysql_single]. Description of accepted values- mysql_single: Azure Database for MySQL Single Server.
data-source | test-single-server | The name or resource ID of the source Azure Database for MySQL Single Server.
subscription | test-subscription | The name or ID of subscription of the source Azure Database for MySQL Single Server.
resource-group | test-rg | The name of the Azure resource group of the source Azure Database for MySQL Single Server.
mode | Offline | The mode of MySQL import. Accepted values: [Offline]; Default value: Offline.
location | westus | The Azure location for the source Azure Database for MySQL Single Server.
server-name | test-flexible-server | Enter a unique name for your target Azure Database for MySQL Flexible Server. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain from 3 to 63 characters. Note : This server is deployed in the same subscription, resource group and region as the source.
admin-user | adminuser | The username for the administrator login for your target Azure Database for MySQL Flexible Server. It cannot be **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public**.
admin-password | *password* | The password of the administrator user for your target Azure Database for MySQL Flexible Server. It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.
sku-name|GP_Gen5_2|Enter the name of the pricing tier and compute configuration for your target Azure Database for MySQL Flexible Server. Follows the convention {pricing tier}_{compute generation}_{vCores} in shorthand. See the [pricing tiers](../flexible-server/concepts-service-tiers-storage.md#service-tiers-size-and-server-types) for more information.
tier | Burstable | Compute tier of the target Azure Database for MySQL Flexible Server. Accepted values: Burstable, GeneralPurpose, MemoryOptimized; Default value: Burstable.
public-access | 0.0.0.0 | Determines the public access for the target Azure Database for MySQL Flexible Server. Enter single or range of IP addresses to be included in the allowed list of IPs. IP address ranges must be dash-separated and not contain any spaces. Specifying 0.0.0.0 allows public access from any resources deployed within Azure to access your server. Setting it to "None" sets the server in public access mode but doesn't create a firewall rule.
storage-size | 32 | The storage capacity of the target Azure Database for MySQL Flexible Server. Minimum is 20 GiB and max is 16 TiB.
tags | key=value | Provide the name of the Azure resource group.
version | 5.7 | Server major version of the target Azure Database for MySQL Flexible Server. Default value: 5.7.
high-availability | ZoneRedundant | Enable (ZoneRedundant or SameZone) or disable high availability feature for the target Azure Database for MySQL Flexible Server. Accepted values: Disabled, SameZone, ZoneRedundant; Default value: Disabled.
zone | 1 | Availability zone into which to provision the resource.
standby-zone | 3 | The availability zone information of the standby server when high availability is enabled.
storage-auto-grow | Enabled | Enable or disable autogrow of storage for the target Azure Database for MySQL Flexible Server. Default value is Enabled. Accepted values: Disabled, Enabled; Default value: Enabled.
iops | 500 | Number of IOPS to be allocated for the target Azure Database for MySQL Flexible Server. You get certain amount of free IOPS based on compute and storage provisioned. The default value for IOPS is free IOPS. To learn more about IOPS based on compute and storage, refer to IOPS in Azure Database for MySQL Flexible Server.

## Post-import steps

* Copy the following properties from source Single Server to target Flexible Server post MySQL Import operation is completed successfully:  
  * Server parameters  
  * Firewall rules  
  * Read-Replicas  
  * Monitoring blade settings (Alerts, Metrics and Diagnostic settings)
  * Any Terraform/CLI scripts hosted by you to manage your Single Server instance should be updated with Flexible Server references.

## Next steps

* [Manage an Azure Database for MySQL - Flexible Server using the Azure portal](../flexible-server/how-to-manage-server-portal.md)