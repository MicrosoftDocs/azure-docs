---
title: "Migrate MySQL on-premises or Virtual Machine (VM) workload to Azure Database for MySQL - Flexible Server using Azure MySQL Import CLI"
description: This tutorial describes how to use the Azure MySQL Import CLI to migrate MySQL on-premises or VM workload to Azure Database for MySQL - Flexible Server.
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
# Migrate MySQL on-premises or Virtual Machine (VM) workload to Azure Database for MySQL - Flexible Server using Azure MySQL Import CLI

Azure MySQL Import enables you to migrate your MySQL on-premises or Virtual Machine (VM) workload seamlessly to Azure Database for MySQL - Flexible Server. It uses a user-provided physical backup file and restores the source server's physical data files to the target server offering a simple and fast migration path. Post MySQL Import operation, you can take advantage of the benefits of Flexible Server, including better price & performance, granular control over database configuration, and custom maintenance windows.

Based on user-inputs, it takes up the responsibility of provisioning your target Flexible Server and then restoring the user-provided physical backup of the source server stored in the Azure Blob storage account to the target Flexible Server instance.

This tutorial shows how to use the Azure MySQL Import CLI command to migrate your Migrate MySQL on-premises or Virtual Machine (VM) workload to Azure Database for MySQL - Flexible Server.

## Launch Azure Cloud Shell

The [Azure Cloud Shell](../../cloud-shell/overview.md) is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, select **Try it** from the upper right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this tutorial requires Azure CLI version 2.54.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Setup

You must sign in to your account using the [az sign-in](/cli/azure/reference-index#az-login) command. Note the **id** property, which refers to your Azure account's **Subscription ID**.

```azurecli-interactive
az login
```

Select the specific subscription under your account where you want to deploy the target Flexible Server using the [az account set](/cli/azure/account#az-account-set) command. Note the **id** value from the **az login** output to use as the value for the **subscription** argument in the command. To get all your subscriptions, use [az account list](/cli/azure/account#az-account-list).

```azurecli-interactive
az account set --subscription <subscription id>
```

## Prerequisites

* Source server should have the following parameters:
  * Lower_case_table_names = 1
  * Innodb_file_per_table = ON
  * System tablespace name should be ibdata1.
  * System tablespace size should be greater than or equal to 12 MB. (MySQL Default)
  * Innodb_page_size = 16348 (MySQL Default)
  * Only INNODB engine is supported.
* Take a physical backup of your MySQL workload using Percona XtraBackup
The following are the steps for using Percona XtraBackup to take a full backup :
  * Install Percona XtraBackup on the on-premises or VM workload. For MySQL engine version v5.7, install Percona XtraBackup version 2.4, see [Installing Percona XtraBackup 2.4]( https://docs.percona.com/percona-xtrabackup/2.4/installation.html). For MySQL engine version v8.0, install Percona XtraBackup version 8.0, see [Installing Percona XtraBackup 8.0]( https://docs.percona.com/percona-xtrabackup/8.0/installation.html).
  * For instructions for taking a Full backup with Percona XtraBackup 2.4, see [Full backup]( https://docs.percona.com/percona-xtrabackup/2.4/backup_scenarios/full_backup.html). For instructions for taking a Full backup with Percona XtraBackup 8.0, see [Full backup] (<https://docs.percona.com/percona-xtrabackup/8.0/create-full-backup.html>).
  * [Create an Azure Blob container](../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container) and get the Shared Access Signature (SAS) Token ([Azure portal](../../ai-services/translator/document-translation/how-to-guides/create-sas-tokens.md?tabs=Containers#create-sas-tokens-in-the-azure-portal) or [Azure CLI](../../storage/blobs/storage-blob-user-delegation-sas-create-cli.md)) for the container. Ensure that you grant Add, Create and Write in the **Permissions** drop-down list.  Copy and paste the Blob SAS token and URL values in a secure location. They're only displayed once and can't be retrieved once the window is closed.
* Upload the full backup file to your Azure Blob storage. Follow steps [here]( ../../storage/common/storage-use-azcopy-blobs-upload.md#upload-a-file).
* For performing an online migration, capture and store the bin-log position of the backup file taken using Percona XtraBackup by running the **cat xtrabackup_info** command and copying the bin_log pos output.

## Limitations

* Source server configuration isn't migrated. You must configure the target Flexible server appropriately.
* Users and privileges aren't migrated as part of MySQL Import. You must take a manual dump of users and privileges before initiating MySQL Import to migrate logins post import operation by restoring them on the target Flexible Server.
* High Availability (HA) enabled Flexible Servers are returned as HA disabled servers to increase the speed of migration operation post the import migration. Enable HA for your target Flexible Server post migration.

## Recommendations for an optimal migration experience

* Consider keeping the Azure Blob storage account and the target Flexible Server to be deployed in the same region for better import performance.
* Recommended SKU configuration for target Azure Database for MySQL Flexible Server –
  * Setting Burstable SKU for target isn't recommended in order to optimize migration time when running the MySQL Import operation. We recommend scaling to General Purpose/ Business Critical for the course of the import operation, post, which you can scale down to Burstable SKU.

## Trigger a MySQL Import operation to migrate from Azure Database for MySQL -Flexible Server

Trigger a MySQL Import operation with the `az mysql flexible-server import create` command. The following command creates a target Flexible Server and performs instance-level import from backup file to target destination using your Azure CLI's local context:

```azurecli
az mysql flexible-server import create --data-source-type
                                --data-source
                                --data-source-sas-token
                                --resource-group
                                --name
                                --sku-name
                                --tier
                                --version
                                --location
                                [--data-source-backup-dir]
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


The following example takes in the data source information for your source MySQL server’s backup file and target Flexible Server information, creates a target Flexible Server named `test-flexible-server` in the `westus` location and performs an import from backup file to target. 

azurecli-interactive
az mysql flexible-server import create --data-source-type "azure_blob" --data-source "https://onprembackup.blob.core.windows.net/onprembackup" --data-source-backup-dir "mysql_backup_percona" –-data-source-token "{sas-token}" --resource-group "test-rg"  --name "test-flexible-server" –-sku-name Standard_D2ds_v4  --tier GeneralPurpose –-version 5.7 -–location "westus”
```

Here are the details for the arguments above:

**Setting** | **Sample value** | **Description**
---|---|---
data-source-type | azure_blob | The type of data source that serves as the source destination for triggering MySQL Import. Accepted values: [azure_blob]. Description of accepted values- azure_blob: Azure Blob storage.
data-source | {resourceID} | The resource ID of the Azure Blob container.
data-source-backup-dir | mysql_percona_backup | The directory of the Azure Blob storage container in which the backup file was uploaded. This value is required only when the backup file isn't stored in the root folder of Azure Blob container.
data-source-sas-token | {sas-token} | The Shared Access Signature (SAS) token generated for granting access to import from the Azure Blob storage container.
resource-group | test-rg | The name of the Azure resource group of the target Azure Database for MySQL Flexible Server.
mode | Offline | The mode of MySQL import. Accepted values: [Offline]; Default value: Offline.
location | westus | The Azure location for the source Azure Database for MySQL Flexible Server.
name | test-flexible-server | Enter a unique name for your target Azure Database for MySQL Flexible Server. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain from 3 to 63 characters. Note: This server is deployed in the same subscription, resource group, and region as the source.
admin-user | adminuser | The username for the administrator sign-in for your target Azure Database for MySQL Flexible Server. It can't be **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public**.
admin-password | *password* | The administrator user's password for your target Azure Database for MySQL Flexible Server. It must contain between 8 and 128 characters. Your password must contain characters from three categories: English uppercase letters, English lowercase letters, numbers, and nonalphanumeric characters.
sku-name|GP_Gen5_2|Enter the name of the pricing tier and compute configuration for your target Azure Database for MySQL Flexible Server. Follows the convention {pricing tier}*{compute generation}*{vCores} in shorthand. See the [pricing tiers](../flexible-server/concepts-service-tiers-storage.md#service-tiers-size-and-server-types) for more information.
tier | Burstable | Compute tier of the target Azure Database for MySQL Flexible Server. Accepted values: Burstable, GeneralPurpose, MemoryOptimized; Default value: Burstable.
public-access | 0.0.0.0 | Determines the public access for the target Azure Database for MySQL Flexible Server. Enter single or range of IP addresses to be included in the allowed list of IPs. IP address ranges must be dash-separated and not contain any spaces. Specifying 0.0.0.0 allows public access from any resources deployed within Azure to access your server. Setting it to "None" sets the server in public access mode but doesn't create a firewall rule.
vnet | myVnet | Name or ID of a new or existing virtual network. If you want to use a vnet from different resource group or subscription, provide a resource ID. The name must be between 2 to 64 characters. The name must begin with a letter or number, end with a letter, number or underscore, and can contain only letters, numbers, underscores, periods, or hyphens.
subnet | mySubnet | Name or resource ID of a new or existing subnet. If you want to use a subnet from different resource group or subscription, provide resource ID instead of name. Note that the subnet is delegated to flexibleServers. After delegation, this subnet can't be used for any other type of Azure resources.
private-dns-zone | myserver.private.contoso.com | The name or ID of new or existing private dns zone. You can use the private dns zone from same resource group, different resource group, or different subscription. If you want to use a zone from different resource group or subscription, provide resource Id. CLI creates a new private dns zone within the same resource group as virtual network if not provided by users.
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

## Migrate to Flexible Server with minimal downtime

In order to perform an online migration after completing the initial seeding from backup file using MySQL import, you can configure data-in replication between the source and target by following steps [here](../flexible-server/how-to-data-in-replication.md?tabs=bash%2Ccommand-line). You can use the bin-log position captured while taking the backup file using Percona XtraBackup to set up Bin-log position based replication.

## How long does MySQL Import take to migrate my MySQL instance?

Benchmarked performance based on storage size.

  | Backup file Storage Size | MySQL Import time |
  | ------------- |:-------------:|
  | 1 GiB | 0 min 23 secs |
  | 10 GiB | 4 min 24 secs |
  | 100 GiB | 10 min 29 secs |
  | 500 GiB | 13 min 15 secs |
  | 1 TB | 22 min 56 secs |
  | 10 TB | 2 hrs 5 min 30 secs |
  
As the storage size increases, the time required for data copying also increases, almost in a linear relationship. However, it's important to note that copy speed can be significantly impacted by network fluctuations. Therefore, the data provided here should be taken as a reference only.

## Next steps

* [Manage an Azure Database for MySQL - Flexible Server using the Azure portal](../flexible-server/how-to-manage-server-portal.md)
