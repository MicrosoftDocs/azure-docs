---
title: "Migrate from Single Server to Flexible Server by using the Azure CLI"
titleSuffix: Azure Database for PostgreSQL Flexible Server
description: Learn about migrating your Single Server databases to Azure Database for PostgreSQL Flexible Server by using the Azure CLI.
author: hariramt
ms.author: hariramt
ms.service: postgresql
ms.topic: conceptual
ms.date: 05/09/2022
---

# Migrate from Single Server to Flexible Server by using the Azure CLI

[!INCLUDE[applies-to-postgres-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

This article shows you how to use the migration tool in the Azure CLI to migrate databases from Azure Database for PostgreSQL Single Server to Flexible Server.

>[!NOTE]
> The migration tool is in public preview.

## Getting started

1. If you're new to Microsoft Azure, [create an account](https://azure.microsoft.com/free/) to evaluate the offerings.

2. Install the latest Azure CLI for your operating system from the [Azure CLI installation page](/cli/azure/install-azure-cli).

   If the Azure CLI is already installed, check the version by using the `az version` command. The version should be 2.28.0 or later to use the migration CLI commands. If not, [update your Azure CLI version](/cli/azure/update-azure-cli).

3. Run the `az login` command:
   
   ```bash
   az login
   ```

   A browser window opens with the Azure sign-in page. Provide your Azure credentials to do a successful authentication. For other ways to sign with the Azure CLI, see [this article](/cli/azure/authenticate-azure-cli).

4. Complete the prerequisites listed in [Migrate from Azure Database for PostgreSQL Single Server to Flexible Server](./concepts-single-to-flexible.md#migration-prerequisites). It is very important to complete the prerequisite steps before you initiate a migration using this tool.

## Migration CLI commands

The migration tool comes with easy-to-use CLI commands to do migration-related tasks. All the CLI commands start with  `az postgres flexible-server migration`.

For help with understanding the options associated with a command and with framing the right syntax, you can use the `help` parameter:

```azurecli-interactive
az postgres flexible-server migration --help
```

That command gives you the following output:

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-cli-help.png" alt-text="Screenshot of Azure Command Line Interface help." lightbox="./media/concepts-single-to-flexible/single-to-flex-cli-help.png":::

The output lists the supported migration commands, along with their actions. Let's look at these commands in detail.

### Create a migration

The `create` command helps in creating a migration from a source server to a target server:

```azurecli-interactive
az postgres flexible-server migration create -- help
```

That command gives the following result:

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-cli-create.png" alt-text="Screenshot of the command for creating a migration." lightbox="./media/concepts-single-to-flexible/single-to-flex-cli-create.png":::

It calls out the expected arguments and has an example syntax for creating a successful migration from the source server to the target server. Here's the CLI command to create a migration:

```azurecli
az postgres flexible-server migration create [--subscription]
                                            [--resource-group]
                                            [--name] 
                                            [--migration-name] 
                                            [--properties] 
```

| Parameter | Description |
| ---- | ---- |
|`subscription` | Subscription ID of the Flexible Server target. |
|`resource-group` | Resource group of the Flexible Server target. |
|`name` | Name of the Flexible Server target. |
|`migration-name` | Unique identifier to migrations attempted to Flexible Server. This field accepts only alphanumeric characters and does not accept any special characters, except a hyphen (`-`). The name can't start with `-`, and no two migrations to a Flexible Server target can have the same name. |
|`properties` | Absolute path to a JSON file that has the information about the Single Server source. |

For example:

```azurecli-interactive
az postgres flexible-server migration create --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1 --properties "C:\Users\Administrator\Documents\migrationBody.JSON"
```

The `migration-name` argument used in the `create` command will be used in other CLI commands, such as `update`, `delete`, and `show.` In all those commands, it will uniquely identify the migration attempt in the corresponding actions.

The migration tool offers online and offline modes of migration. To know more about the migration modes and their differences, see [Migrate from Azure Database for PostgreSQL Single Server to Flexible Server](./concepts-single-to-flexible.md).

Create a migration between source and target servers by using the migration mode of your choice. The `create` command needs a JSON file to be passed as part of its `properties` argument.

The structure of the JSON is:

```bash
{
"properties": {
 "SourceDBServerResourceId":"/subscriptions/<subscriptionid>/resourceGroups/<src_ rg_name>/providers/Microsoft.DBforPostgreSQL/servers/<source server name>",

"SourceDBServerFullyQualifiedDomainName": "fqdn of the source server as per the custom DNS server", 
"TargetDBServerFullyQualifiedDomainName": "fqdn of the target server as per the custom DNS server",

"SecretParameters": {
    "AdminCredentials": 
    {
  "SourceServerPassword": "<password>",
  "TargetServerPassword": "<password>"
    },
"AADApp": 
    {
   "ClientId": "<client id>",
   "TenantId": "<tenant id>",
   "AadSecret": "<secret>"
     }
},

"MigrationResourceGroup":
    {
 "ResourceId":"/subscriptions/<subscriptionid>/resourceGroups/<temp_rg_name>",
 "SubnetResourceId":"/subscriptions/<subscriptionid>/resourceGroups/<rg_name>/providers/Microsoft.Network/virtualNetworks/<Vnet_name>/subnets/<subnet_name>"
    },

"DBsToMigrate": 
   [
   "<db1>","<db2>"
   ],

"SetupLogicalReplicationOnSourceDBIfNeeded": "true", 

"OverwriteDBsInTarget": "true"

}

}

```
>[!NOTE]
> Gentle reminder to complete the [prerequisites](./concepts-single-to-flexible.md#migration-prerequisites) before you execute **Create** in case it is not yet done. It is very important to complete the prerequisite steps in before you initiate a migration using this tool.

Here are the `create` parameters:

| Parameter | Type | Description |
| ---- | ---- | ---- |
| `SourceDBServerResourceId` | Required |  This is the resource ID of the Single Server source and is mandatory. |
| `SourceDBServerFullyQualifiedDomainName` | Optional |  Use it when a custom DNS server is used for name resolution for a virtual network. Provide the FQDN of the Single Server source according to the custom DNS server for this property. |
| `TargetDBServerFullyQualifiedDomainName` | Optional |  Use it when a custom DNS server is used for name resolution inside a virtual network. Provide the FQDN of the Flexible Server target according to the custom DNS server. <br> `SourceDBServerFullyQualifiedDomainName` and `TargetDBServerFullyQualifiedDomainName` should be included as a part of the JSON only in the rare scenario of a custom DNS server being used for name resolution instead of Azure-provided DNS. Otherwise, don't include these parameters as a part of the JSON file. |
| `SecretParameters` | Required | This parameter lists passwords for admin users for both the Single Server source and the Flexible Server target, along with the Azure Active Directory app credentials. These passwords help to authenticate against the source and target servers. They also help in checking proper authorization access to the resources.
| `MigrationResourceGroup` | Optional | This section consists of two properties: <br><br> `ResourceID` (optional): The migration infrastructure and other network infrastructure components are created to migrate data and schemas from the source to the target. By default, all the components that this tool creates are provisioned under the resource group of the target server. If you want to deploy them under a different resource group, you can assign the resource ID of that resource group to this property. <br><br> `SubnetResourceID` (optional): If your source has public access turned off, or if your target server is deployed inside a virtual network, specify a subnet under which migration infrastructure needs to be created so that it can connect to both source and target servers. |
| `DBsToMigrate` | Required | Specify the list of databases that you want to migrate to Flexible Server. You can include a maximum of eight database names at a time. |
| `SetupLogicalReplicationOnSourceDBIfNeeded` | Optional | You can enable logical replication on the source server automatically by setting this property to `true`. This change in the server settings requires a server restart with a downtime of two to three minutes. |
| `OverwriteDBsinTarget` | Optional | If the target server happens to have an existing database with the same name as the one you're trying to migrate, the migration will pause until you acknowledge that overwrites in the target databases are allowed. You can avoid this pause by setting the value of this property to `true`, which gives the migration tool permission to automatically overwrite databases. |

### Choose a migration mode

The default migration mode for migrations created through CLI commands is *online*. Filling out the preceding properties in your JSON file would create an online migration from your Single Server source to the Flexible Server target.

If you want to migrate in offline mode, you need to add another property (`"TriggerCutover":"true"`) to your JSON file before you initiate the `create` command.

### List migrations

The `list` command shows the migration attempts that were made to a Flexible Server target. Here's the CLI command to list migrations:

```azurecli
az postgres flexible-server migration list [--subscription]
                                            [--resource-group]
                                            [--name]  
                                            [--filter] 
```

The `filter` parameter can take these values:

- `Active`: Lists the current active migration attempts for the target server. It does not include the migrations that have reached a failed, canceled, or succeeded state.
- `All`: Lists all the migration attempts to the target server. This includes both the active and past migrations, regardless of the state.

For more information about this command, use the `help` parameter: 

```azurecli-interactive
az postgres flexible-server migration list -- help
```

### Show details

Use the following `list` command to get the details of a specific migration. These details include information on the current state and substate of the migration. 

```azurecli
az postgres flexible-server migration list [--subscription]
                                            [--resource-group]
                                            [--name]  
                                            [--migration-name] 
```

The `migration_name` parameter is the name assigned to the migration during the `create` command. Here's a snapshot of the sample response from the CLI command for showing details:

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-cli-migration-name.png" alt-text="Screenshot of Command Line Interface migration name." lightbox="./media/concepts-single-to-flexible/single-to-flex-cli-migration-name.png":::

Note these important points for the command response:

- As soon as the `create` command is triggered, the migration moves to the `InProgress` state and the `PerformingPreRequisiteSteps` substate. It takes up to 15 minutes for the migration workflow to deploy the migration infrastructure, configure firewall rules with source and target servers, and perform a few maintenance tasks. 
- After the `PerformingPreRequisiteSteps` substate is completed, the migration moves to the substate of `Migrating Data`, where the dump and restore of the databases take place.
- Each database being migrated has its own section with all migration details, such as table count, incremental inserts, deletions, and pending bytes.
- The time that the `Migrating Data` substate takes to finish depends on the size of databases that are being migrated.
- For offline mode, the migration moves to the `Succeeded` state as soon as the `Migrating Data` substate finishes successfully. If there's a problem at the `Migrating Data` substate, the migration moves into a `Failed` state.
- For online mode, the migration moves to the state of  `WaitingForUserAction` and a substate of `WaitingForCutoverTrigger` after the `Migrating Data` state finishes successfully. The next section covers the details of the `WaitingForUserAction` state.

For more information about this command, use the `help` parameter:

```azurecli-interactive
 az postgres flexible-server migration show -- help
 ```

### Update a migration

As soon as the infrastructure setup is complete, the migration activity will pause. Messages in the response for the CLI command will show details if some prerequisites are missing or if the migration is at a state to perform a cutover. At this point, the migration goes into a state called `WaitingForUserAction`. 

You use the `update` command to set values for parameters, which helps the migration move to the next stage in the process. Let's look at each of the substates.

#### WaitingForLogicalReplicationSetupRequestOnSourceDB

If the logical replication is not set at the source server or if it was not included as a part of the JSON file, the migration will wait for logical replication to be enabled at the source. You can enable the logical replication setting manually by changing the replication flag to `Logical` on the portal. This change requires a server restart. 

You can also enable the logical replication setting by using the following CLI command:

```azurecli
az postgres flexible-server migration update [--subscription]
                                            [--resource-group]
                                            [--name]  
                                            [--migration-name]
                                            [--initiate-data-migration] 
```

To set logical replication on your source server, pass the value `true` to the `initiate-data-migration` property. For example:

```azurecli-interactive
az postgres flexible-server migration update --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1 --initiate-data-migration true"
```

If you enable it manually, *you still need to issue the preceding `update` command* for the migration to move out of the `WaitingForUserAction` state. The server doesn't need to restart again because that already happened via the portal action.

#### WaitingForTargetDBOverwriteConfirmation

`WaitingForTargetDBOverwriteConfirmation` is the state where migration is waiting for confirmation on target overwrite, because data is already present in the target server for the database that's being migrated. You can enable it by using the following CLI command:

```azurecli
az postgres flexible-server migration update [--subscription]
                                            [--resource-group]
                                            [--name]  
                                            [--migration-name]
                                            [--overwrite-dbs] 
```

To give the migration permissions to overwrite any existing data in the target server, you need to pass the value `true` to the `overwrite-dbs` property. For example:

```azurecli-interactive
az postgres flexible-server migration update --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1 --overwrite-dbs true"
```

#### WaitingForCutoverTrigger

Migration gets to the `WaitingForCutoverTrigger` state when the dump and restore of the databases have finished and the ongoing writes at your Single Server source are being replicated to the Flexible Server target. You should wait for the replication to finish so that the target is in sync with the source. 

You can monitor the replication lag by using the response from the `show` command. A metric called **Pending Bytes** is associated with each database that's being migrated. This metric gives you an indication of the difference between the source and target databases in bytes. This number should be nearing zero over time. After the number reaches zero for all the databases, stop any further writes to your Single Server source. Then, validate the data and schema on your Flexible Server target to make sure they match exactly with the source server. 

After you complete the preceding steps, you can trigger a cutover by using the following CLI command:

```azurecli
az postgres flexible-server migration update [--subscription]
                                            [--resource-group]
                                            [--name]  
                                            [--migration-name]
                                            [--cutover] 
```

For example:

```azurecli-interactive
az postgres flexible-server migration update --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1 --cutover"
```

After you use the preceding command, use the command for showing details to monitor if the cutover has finished successfully. Upon successful cutover, migration will move to a `Succeeded` state. Update your application to point to the new Flexible Server target.

For more information about this command, use the `help` parameter:

```azurecli-interactive
 az postgres flexible-server migration update -- help
 ```

### Delete or cancel a migration

You can delete or cancel any ongoing migration attempts by using the `delete` command. This command stops all migration activities in that task, but it doesn't drop or roll back any changes on your target server. Here's the CLI command to delete a migration:

```azurecli
az postgres flexible-server migration delete [--subscription]
                                            [--resource-group]
                                            [--name]  
                                            [--migration-name]
```

For example:

```azurecli-interactive
az postgres flexible-server migration delete --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1"
```

For more information about this command, use the `help` parameter:

```azurecli-interactive
 az postgres flexible-server migration delete -- help
 ```

## Monitoring migration

The `create` command starts a migration between the source and target servers. The migration goes through a set of states and substates before eventually moving into the `completed` state. The `show` command helps you monitor ongoing migrations, because it gives the current state and substate of the migration.

The following tables describe the migration states and substates.

| Migration state | Description |
| ---- | ---- |
| `InProgress` | The migration infrastructure is being set up, or the actual data migration is in progress. |
| `Canceled` | The migration has been canceled or deleted. |
| `Failed` | The migration has failed. |
| `Succeeded` | The migration has succeeded and is complete. |
| `WaitingForUserAction` | Migration is waiting on a user action. This state has a list of substates that were discussed in detail in the previous section. |

| Migration substate | Description |
| ----  | ---- |
| `PerformingPreRequisiteSteps` | Infrastructure is being set up and is being prepped for data migration. |
| `MigratingData` | Data is being migrated. |
| `CompletingMigration` | Migration cutover is in progress. |
| `WaitingForLogicalReplicationSetupRequestOnSourceDB` | Waiting for logical replication enablement. You can enable this substate manually or by using the `update` CLI command covered in the next section. |
| `WaitingForCutoverTrigger` | Migration is ready for cutover. You can start the cutover when ready. |
| `WaitingForTargetDBOverwriteConfirmation` | Waiting for confirmation on target overwrite. Data is present in the target server. <br> You can enable this substate via the `update` CLI command. |
| `Completed` | Cutover was successful, and migration is complete. |

## Custom DNS for name resolution

To find out if custom DNS is used for name resolution, go to the virtual network where you deployed your source or target server, and then select **DNS server**. The virtual network should indicate if it's using a custom DNS server or the default Azure-provided DNS server.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-cli-dns-server.png" alt-text="Screenshot of D N S information, with the default option selected." lightbox="./media/concepts-single-to-flexible/single-to-flex-cli-dns-server.png":::

## Next steps

- For a successful end-to-end migration, follow the post-migration steps in [Migrate from Azure Database for PostgreSQL Single Server to Flexible Server](./concepts-single-to-flexible.md).
