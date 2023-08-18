---
title: "Tutorial: Migrate Azure Database for PostgreSQL - Single Server to Flexible Server using the Azure CLI"
titleSuffix: "Azure Database for PostgreSQL Flexible Server"
description: "Learn about migrating your Single Server databases to Azure Database for PostgreSQL Flexible Server by using the Azure CLI."
author: hariramt
ms.author: hariramt
ms.service: postgresql
ms.topic: tutorial
ms.date: 02/02/2023
ms.custom: seo-lt-2023, devx-track-azurecli
---

# Tutorial: Migrate Azure Database for PostgreSQL - Single Server to Flexible Server by using the Azure CLI

[!INCLUDE[applies-to-postgres-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

You can migrate an instance of Azure Database for PostgreSQL – Single Server to Azure Database for PostgreSQL – Flexible Server by using the Azure Command Line Interface (CLI). In this tutorial, we perform migration of a sample database from an Azure Database for PostgreSQL single server to a PostgreSQL flexible server using the Azure CLI.

In this tutorial, you learn about:

> [!div class="checklist"]
>
> * Prerequisites
> * Getting started
> * Migration CLI commands
> * Monitor the migration
> * Cancel the migration
> * Migration best practices

## Prerequisites

To complete this tutorial, you need to:

1. Use an existing instance of Azure Database for PostgreSQL – Single Server (the source server)
2. All extensions used on the Single Server (source) must be [allow-listed on the Flexible Server (target)](./concepts-single-to-flexible.md#allow-list-required-extensions)

>[!NOTE]
> If TIMESCALEDB, POSTGIS_TOPOLOGY, POSTGIS_TIGER_GEOCODER, POSTGRES_FDW or PG_PARTMAN extensions are used in your single server database, please raise a support request since the Single to Flex migration tool will not handle these extensions.

3. Create the target flexible server. For guided steps, refer to the quickstart [Create an Azure Database for PostgreSQL flexible server using the Portal](../flexible-server/quickstart-create-server-portal.md) or [Create an Azure Database for PostgreSQL flexible server using the CLI](../flexible-server/quickstart-create-server-cli.md)

> [!IMPORTANT]
> To provide the best migration experience, performing migration using a burstable instance of Flexible server is not supported. Please use a general purpose or a memory optimized instance (4 VCore or higher) as your Target Flexible server to perform the migration. Once the migration is complete, you can downscale back to a burstable instance if necessary.

4. Check if the data distribution among all the tables of a database is skewed with most of the data present in a single (or few) tables. If it is skewed, the migration speed could be slower than expected. In this case, the migration speed can be increased by [migrating the large table(s) in parallel](./concepts-single-to-flexible.md#improve-migration-speed---parallel-migration-of-tables).


## Getting started

1. If you're new to Microsoft Azure, [create an account](https://azure.microsoft.com/free/) to evaluate the offerings.

2. Install the latest Azure CLI for your operating system from the [Azure CLI installation page](/cli/azure/install-azure-cli).

   If the Azure CLI is already installed, check the version by using the `az version` command. The version should be **2.50.0** or later to use the migration CLI commands. If not, [update your Azure CLI version](/cli/azure/update-azure-cli).

3. Run the `az login` command:
   
   ```bash
   az login
   ```

   A browser window opens with the Azure sign-in page. Provide your Azure credentials to do a successful authentication. For other ways to sign with the Azure CLI, refer [this article](/cli/azure/authenticate-azure-cli).

## Migration CLI commands

The migration tool comes with easy-to-use CLI commands to do migration-related tasks. All the CLI commands start with  `az postgres flexible-server migration`.
Allow-list all required extensions as shown in [Migrate from Azure Database for PostgreSQL Single Server to Flexible Server](./concepts-single-to-flexible.md#allow-list-required-extensions). It is important to allow-list the extensions before you initiate a migration using this tool.
For help with understanding the options associated with a command and with framing the right syntax, you can use the `help` parameter:

```azurecli-interactive
az postgres flexible-server migration --help
```

The above command gives you the following output:

:::image type="content" source="./media/concepts-single-to-flexible/az-postgres-flexible-server-migration-help.png" alt-text="Screenshot of Azure Command Line Interface help." lightbox="./media/concepts-single-to-flexible/az-postgres-flexible-server-migration-help.png":::

The output lists the supported migration commands, along with their actions. Let's look at these commands in detail.

### Create a migration using the Azure CLI

The `create` command helps in creating a migration from a source server to a target server:

```azurecli-interactive
az postgres flexible-server migration create -- help
```

The above command gives you the following result:

:::image type="content" source="./media/concepts-single-to-flexible/az-postgres-flexible-server-migration-create.png" alt-text="Screenshot of the command for creating a migration." lightbox="./media/concepts-single-to-flexible/az-postgres-flexible-server-migration-create.png":::

It lists the expected arguments and has an example syntax for successfully creating a migration from the source server to the target server. Here's the CLI command to create a new migration:

```azurecli
az postgres flexible-server migration create [--subscription]
                                            [--resource-group]
                                            [--name] 
                                            [--migration-name] 
                                            [--migration-mode]
                                            [--properties]
```

| Parameter | Description |
| ---- | ---- |
|`subscription` | Subscription ID of the Flexible Server target. |
|`resource-group` | Resource group of the Flexible Server target. |
|`name` | Name of the Flexible Server target. |
|`migration-name` | Unique identifier to migrations attempted to Flexible Server. This field accepts only alphanumeric characters and does not accept any special characters, except a hyphen (`-`). The name can't start with `-`, and no two migrations to a Flexible Server target can have the same name. |
|`migration-mode` | This is an optional parameter. Default value: Offline. Offline migration involves copying of your source databases at a point in time, to your target server. |
|`properties` | Absolute path to a JSON file that has the information about the Single Server source. |

For example:

```azurecli-interactive
az postgres flexible-server migration create --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1 --properties "C:\Users\Administrator\Documents\migrationBody.JSON" --migration-mode offline
```

The `migration-name` argument used in the `create` command will be used in other CLI commands, such as `update`, `delete`, and `show.` In all those commands, it uniquely identifies the migration attempt in the corresponding actions.

Finally, the `create` command needs a JSON file to be passed as part of its `properties` argument.

The structure of the JSON is:

```bash
{
"properties": {
 "sourceDbServerResourceId":"/subscriptions/<subscriptionid>/resourceGroups/<src_ rg_name>/providers/Microsoft.DBforPostgreSQL/servers/<source server name>",
"secretParameters": {
    "adminCredentials": 
    {
      "sourceServerPassword": "<password>",
      "targetServerPassword": "<password>"
    }
   "sourceServerUserName": "<username>@<servername>",
   "targetServerUserName": "<username>"
},

"dbsToMigrate": 
   [
   "<db1>","<db2>"
   ],

"overwriteDbsInTarget":"true"

}
}

```

The `create` parameters that go into the json file format are as shown below:

| Parameter | Type | Description |
| ---- | ---- | ---- |
| `sourceDbServerResourceId` | Required |  This parameter is the resource ID of the Single Server source and is mandatory. |
| `adminCredentials` | Required | This parameter lists passwords for admin users for both the Single Server source and the Flexible Server target. These passwords help to authenticate against the source and target servers.
| `sourceServerUserName` | Required | The default value is the admin user created during the creation of single server and the password provided will be used for authentication against this user. In case you are not using the default user, this parameter is the user or role on the source server used for performing the migration. This user should have necessary privileges and ownership on the database objects involved in the migration and should be a member of **azure_pg_admin** role. |
| `targetServerUserName` | Required | The default value is the admin user created during the creation of flexible server and the password provided will be used for authentication against this user. In case you are not using the default user, this parameter is the user or role on the target server used for performing the migration. This user should be a member of **azure_pg_admin**, **pg_read_all_settings**, **pg_read_all_stats**,**pg_stat_scan_tables** roles and should have the **Create role, Create DB** attributes. |
| `dbsToMigrate` | Required | Specify the list of databases that you want to migrate to Flexible Server. You can include a maximum of eight database names at a time. |
| `overwriteDbsInTarget` | Required | When set to true (default), if the target server happens to have an existing database with the same name as the one you're trying to migrate, migration tool automatically overwrites the database. |
| `SetupLogicalReplicationOnSourceDBIfNeeded` | Optional | You can enable logical replication on the source server automatically by setting this property to `true`. This change in the server settings requires a server restart with a downtime of two to three minutes. |
| `SourceDBServerFullyQualifiedDomainName` | Optional |  Use it when a custom DNS server is used for name resolution for a virtual network. Provide the FQDN of the Single Server source according to the custom DNS server for this property. |
| `TargetDBServerFullyQualifiedDomainName` | Optional |  Use it when a custom DNS server is used for name resolution inside a virtual network. Provide the FQDN of the Flexible Server target according to the custom DNS server. <br> `SourceDBServerFullyQualifiedDomainName` and `TargetDBServerFullyQualifiedDomainName` are included as a part of the JSON only in the rare scenario that a custom DNS server is used for name resolution instead of Azure-provided DNS. Otherwise, don't include these parameters as a part of the JSON file. |

Note these important points for the command response:

- As soon as the `create` command is triggered, the migration moves to the `InProgress` state and the `PerformingPreRequisiteSteps` substate. The migration workflow takes a couple of minutes to deploy the migration infrastructure and setup connections between the source and target.
- After the `PerformingPreRequisiteSteps` substate is completed, the migration moves to the substate of `Migrating Data`, where the Cloning/Copying of the databases take place.
- Each database migrated has its own section with all migration details, such as table count, incremental inserts, deletions, and pending bytes.
- The time that the `Migrating Data` substate takes to finish depends on the size of databases that are migrated.
- The migration moves to the `Succeeded` state as soon as the `Migrating Data` substate finishes successfully. If there's a problem at the `Migrating Data` substate, the migration moves into a `Failed` state.

>[!NOTE]
> Gentle reminder to [allow-list the extensions](./concepts-single-to-flexible.md#allow-list-required-extensions) before you execute **Create** in case it is not yet done. It is important to allow-list the extensions before you initiate a migration using this tool.

### List the migration(s)

The `list` command lists all the migration attempts made to a Flexible Server target:

```azurecli
az postgres flexible-server migration list [--subscription]
                                            [--resource-group]
                                            [--name]  
                                            [--filter] 
```

The `filter` parameter has two options:

- `Active`: Lists the current active migration attempts (in progress) into the target server. It does not include the migrations that have reached a failed, canceled, or succeeded state.
- `All`: Lists all the migration attempts into the target server. This includes both the active and past migrations, regardless of the state.

For more information about this command, use the `help` parameter:

```azurecli-interactive
az postgres flexible-server migration list -- help
```

## Monitor the migration

The `show` command helps you monitor ongoing migrations and gives the current state and substate of the migration.
These details include information on the current state and substate of the migration.

```azurecli
az postgres flexible-server migration show [--subscription]
                                            [--resource-group]
                                            [--name]  
                                            [--migration-name] 
```

The `migration_name` parameter is the name you have assigned to the migration during the `create` command. Here's a snapshot of the sample response from the CLI command for showing details:

:::image type="content" source="./media/concepts-single-to-flexible/az-postgres-flexible-server-migration-show.png" alt-text="Screenshot of Command Line Interface migration Show." lightbox="./media/concepts-single-to-flexible/az-postgres-flexible-server-migration-show.png":::

For more information about this command, use the `help` parameter:

```azurecli-interactive
 az postgres flexible-server migration show -- help
 ```

The following tables describe the migration states and substates.

| Migration state | Description |
| ---- | ---- |
| `InProgress` | The migration infrastructure is set up, or the actual data migration is in progress. |
| `Canceled` | The migration is canceled or deleted. |
| `Failed` | The migration has failed. |
| `Succeeded` | The migration has succeeded and is complete. |

| Migration substate | Description |
| ----  | ---- |
| `PerformingPreRequisiteSteps` | Infrastructure is set up and is prepped for data migration. |
| `MigratingData` | Data migration is in progress. |
| `CompletingMigration` | Migration cutover is in progress. |
| `Completed` | Cutover was successful, and migration is complete. |

## Cancel the migration

You can cancel any ongoing migration attempts by using the `cancel` command. This command stops the particular migration attempt, but it doesn't drop or roll back any changes on your target server. Here's the CLI command to delete a migration:

```azurecli
az postgres flexible-server migration update cancel [--subscription]
                                            [--resource-group]
                                            [--name]  
                                            [--migration-name]
```

For example:

```azurecli-interactive
az postgres flexible-server migration update cancel --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1"
```

For more information about this command, use the `help` parameter:

```azurecli-interactive
 az postgres flexible-server migration update cancel -- help
 ```

The command gives you the following output:

:::image type="content" source="./media/concepts-single-to-flexible/az-postgres-flexible-server-migration-update-cancel-help.png" alt-text="Screenshot of Azure Command Line Interface Cancel." lightbox="./media/concepts-single-to-flexible/az-postgres-flexible-server-migration-update-cancel-help.png":::

## Migration best practices

- For a successful end-to-end migration, follow the post-migration steps in [Migrate from Azure Database for PostgreSQL Single Server to Flexible Server](./concepts-single-to-flexible.md#best-practices).
