---
title: PostgreSQL - Single Server to Flexible Server CLI migration
author: markingmyname
ms.author: maghan
ms.date: 03/19/2024
ms.service: postgresql
ms.topic: include
---

You can migrate using Azure CLI.

#### [Offline](#tab/offline)

[!INCLUDE [prerequisites-migration-service-postgresql](../prerequisites/prerequisites-migration-service-postgresql-offline-single-server.md)]

## Get started

1. If you're new to Microsoft Azure, [create an account](https://azure.microsoft.com/free/) to evaluate the offerings.

1. Install the latest Azure CLI for your operating system from the [Azure CLI installation page](/cli/azure/install-azure-cli).

   If the Azure CLI is already installed, check the version by using the `az version` command. The version should be **2.50.0** or later to use the migration CLI commands. If not, [update your Azure CLI version](/cli/azure/update-azure-cli).

1. Run the `az login` command:

   ```bash
   az login
   ```

   A browser window opens with the Azure sign-in page. Provide your Azure credentials to do a successful authentication. For other ways to sign with the Azure CLI, refer [this article](/cli/azure/authenticate-azure-cli).

## Migration CLI commands (offline)

The migration service comes with easy-to-use CLI commands to do migration-related tasks. All the CLI commands start with  `az postgres flexible-server migration`. It's important to allowlist the extensions before you initiate a migration.

For help with understanding the options associated with a command and with framing the right syntax, you can use the `help` parameter:

```azurecli-interactive
az postgres flexible-server migration --help
```

The above command gives you the following output:

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/az-postgres-flexible-server-migration-help.png" alt-text="Screenshot of Azure Command Line Interface help." lightbox="../../media/tutorial-migration-service-single-to-flexible/az-postgres-flexible-server-migration-help.png":::

The output lists the supported migration commands, along with their actions. Let's look at these commands in detail.

### Create a migration using the Azure CLI

The `create` command helps in creating a migration from a source server to a target server:

```azurecli-interactive
az postgres flexible-server migration create -- help
```

The above command gives you the following result:

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/az-postgres-flexible-server-migration-create.png" alt-text="Screenshot of the command for creating a migration." lightbox="../../media/tutorial-migration-service-single-to-flexible/az-postgres-flexible-server-migration-create.png":::

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
| --- | --- |
| `subscription` | Subscription ID of the Flexible Server target. |
| `resource-group` | Resource group of the Flexible Server target. |
| `name` | Name of the Flexible Server target. |
| `migration-name` | Unique identifier to migrations attempted to Flexible Server. This field accepts only alphanumeric characters and doesn't accept any special characters, except a hyphen (`-`). The name can't start with `-`, and no two migrations to a Flexible Server target can have the same name. |
| `migration-mode` | This is an optional parameter. Default value: Offline. Offline migration involves copying of your source databases at a point in time, to your target server. |
| `properties` | Absolute path to a JSON file that has the information about the Single Server source. |

For example:

```azurecli-interactive
az postgres flexible-server migration create --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1 --properties "C:\Users\Administrator\Documents\migrationBody.JSON" --migration-mode offline
```

The `migration-name` argument used in the `create` command is used in other CLI commands, such as `update`, `delete`, and `show.` It uniquely identifies the migration attempt in the corresponding actions in all those commands.

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
    },
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

The `create` parameters that go into the JSON file format are as shown below:

| Parameter | Type | Description |
| --- | --- | --- |
| `sourceDbServerResourceId` | Required | This parameter is the resource ID of the Single Server source and is mandatory. |
| `adminCredentials` | Required | This parameter lists passwords for admin users for both the Single Server source and the Flexible Server target. These passwords help to authenticate against the source and target servers.
| `sourceServerUserName` | Required | The default value is the admin user created during the creation of a single server, and the password provided is used for authentication against this user. If you aren't using the default user, this parameter is the user or role on the source server for performing the migration. This user should have the necessary privileges and ownership of the database objects involved in the migration and should be a member of the **azure_pg_admin** role. |
| `targetServerUserName` | Required | The default value is the admin user created during the creation of a flexible server, and the password provided is used for authentication against this user. In case you aren't using the default user, this parameter is the user or role on the target server used for performing the migration. This user should be a member of **azure_pg_admin**, **pg_read_all_settings**, **pg_read_all_stats**,**pg_stat_scan_tables** roles and should have the **Create role, Create DB** attributes. |
| `dbsToMigrate` | Required | Specify the list of databases that you want to migrate to Flexible Server. Only user databases are migrated. System databases or template databases such as template0 and template1 won't be migrated. |
| `overwriteDbsInTarget` | Required | When set to true, if the target server happens to have an existing database with the same name as the one you're trying to migrate, migration service automatically overwrites the database. |
| `SetupLogicalReplicationOnSourceDBIfNeeded` | Optional | You can automatically enable logical replication on the source server by setting this property to `true`. This change in the server settings requires a server restart with two to three minutes of downtime. |
| `SourceDBServerFullyQualifiedDomainName` | Optional | Use it when a custom DNS server is used for name resolution for a virtual network. Provide the FQDN of the Single Server source according to the custom DNS server for this property. |
| `TargetDBServerFullyQualifiedDomainName` | Optional | Use it when a custom DNS server is used for name resolution inside a virtual network. Provide the FQDN of the Flexible Server target according to the custom DNS server.<br />`SourceDBServerFullyQualifiedDomainName` and `TargetDBServerFullyQualifiedDomainName` are included as a part of the JSON only in the rare scenario that a custom DNS server is used for name resolution instead of Azure-provided DNS. Otherwise, don't include these parameters in the JSON file. |

Note these essential points for the command response:

- When the `create` command is triggered, the migration moves to the `InProgress` state and the `PerformingPreRequisiteSteps` substrate. The migration workflow takes a few minutes to deploy the migration infrastructure and set up connections between the source and target.
- After the `PerformingPreRequisiteSteps` substate is completed, the migration moves to the substrate of `Migrating Data,` where the Cloning/Copying of the databases takes place.
- Each database migrated has its own section with all migration details, such as table count, incremental inserts, deletions, and pending bytes.
- The time that the `Migrating Data` substate takes to finish depends on the size of the databases that are migrated.
- The migration moves to the `Succeeded` state as soon as the `Migrating Data` substate finishes successfully. If there's a problem at the `Migrating Data` substate, the migration moves into a `Failed` state.

### Setup replication

If the **Online** migration preview is selected, Logical replication must be turned on in the source Single server. If it isn't turned on, the migration service automatically turns on logical replication at the source Single server when the `SetupLogicalReplicationOnSourceDBIfNeeded` parameter is passed with a value of `true` in the accompanying JSON file. Replication can also be set up manually at the source after starting the migration using the command below. Either approach of turning on logical replication restarts the source Single server.

For example:

```azurecli-interactive
az postgres flexible-server migration update --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name CLIMigrationExample --setup-replication
```

This command is required to advance the migration when the flexible server is waiting in the `WaitingForLogicalReplicationSetupRequestOnSourceDB` state.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/az-postgres-flexible-server-migration-logical-replication.png" alt-text="Screenshot of logical replication setup." lightbox="../../media/tutorial-migration-service-single-to-flexible/az-postgres-flexible-server-migration-logical-replication.png":::

To perform Online migration in any of the above regions, use:

```azurecli-interactive
az postgres flexible-server migration create --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1 --properties "C:\Users\Administrator\Documents\migrationBody.JSON" --migration-mode online
```

### List the migrations

The `list` command lists all the migration attempts made to a Flexible Server target:

```azurecli
az postgres flexible-server migration list [--subscription]
                                            [--resource-group]
                                            [--name]
                                            [--filter]
```

The `filter` parameter has two options:

- `Active`: Lists the current active migration attempts (in progress) into the target server. It doesn't include the migrations that have failed, canceled, or succeeded.
- `All`: Lists all the migration attempts into the target server. This includes both the active and past migrations, regardless of the state.

For more information about this command, use the `help` parameter:

```azurecli-interactive
az postgres flexible-server migration list -- help
```

### Monitor the migration

The `show` command helps you monitor ongoing migrations and gives the current state and substate of the migration.
These details include information on the current state and substate of the migration.

```azurecli
az postgres flexible-server migration show [--subscription]
                                            [--resource-group]
                                            [--name]
                                            [--migration-name]
```

The `migration_name` parameter is the name assigned to the migration during the `create` command. Here's a snapshot of the sample response from the CLI command for showing details:

For more information about this command, use the `help` parameter:

```azurecli-interactive
 az postgres flexible-server migration show -- help
 ```

The following tables describe the migration states and substates.

| Migration state | Description |
| --- | --- |
| `InProgress` | The migration infrastructure is set up, or the actual data migration is in progress. |
| `Canceled` | The migration is canceled or deleted. |
| `Failed` | The migration has failed. |
| `Succeeded` | The migration has succeeded and is complete. |

| Migration substate | Description |
| --- | --- |
| `PerformingPreRequisiteSteps` | Infrastructure is set up and is prepped for data migration. |
| `MigratingData` | Data migration is in progress. |
| `CompletingMigration` | Migration cutover is in progress. |
| `Completed` | cutover was successful, and migration is complete. |

#### [Online (preview)](#tab/online)

[!INCLUDE [prerequisites-migration-service-postgresql-online-single-server](../prerequisites/prerequisites-migration-service-postgresql-online-single-server.md)]

## Get started

1. If you're new to Microsoft Azure, [create an account](https://azure.microsoft.com/free/) to evaluate the offerings.

1. Install the latest Azure CLI for your operating system from the [Azure CLI installation page](/cli/azure/install-azure-cli).

   If the Azure CLI is already installed, check the version by using the `az version` command. The version should be **2.50.0** or later to use the migration CLI commands. If not, [update your Azure CLI version](/cli/azure/update-azure-cli).

1. Run the `az login` command:

   ```bash
   az login
   ```

   A browser window opens with the Azure sign-in page. Provide your Azure credentials to do a successful authentication. For other ways to sign with the Azure CLI, refer [this article](/cli/azure/authenticate-azure-cli).

## Migration CLI commands (online)

The migration service comes with easy-to-use CLI commands to do migration-related tasks. All the CLI commands start with  `az postgres flexible-server migration`. It's important to allowlist the extensions before you initiate a migration.

For help with understanding the options associated with a command and with framing the right syntax, you can use the `help` parameter:

```azurecli-interactive
az postgres flexible-server migration --help
```

The above command gives you the following output:

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/az-postgres-flexible-server-migration-help.png" alt-text="Screenshot of Azure Command Line Interface help." lightbox="../../media/tutorial-migration-service-single-to-flexible/az-postgres-flexible-server-migration-help.png":::

The output lists the supported migration commands, along with their actions. Let's look at these commands in detail.

### Create a migration using the Azure CLI

The `create` command helps in creating a migration from a source server to a target server:

```azurecli-interactive
az postgres flexible-server migration create -- help
```

The above command gives you the following result:

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/az-postgres-flexible-server-migration-create.png" alt-text="Screenshot of the command for creating a migration." lightbox="../../media/tutorial-migration-service-single-to-flexible/az-postgres-flexible-server-migration-create.png":::

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
| --- | --- |
| `subscription` | Subscription ID of the Flexible Server target. |
| `resource-group` | Resource group of the Flexible Server target. |
| `name` | Name of the Flexible Server target. |
| `migration-name` | Unique identifier to migrations attempted to Flexible Server. This field accepts only alphanumeric characters and doesn't accept any special characters, except a hyphen (`-`). The name can't start with `-`, and no two migrations to a Flexible Server target can have the same name. |
| `migration-mode` | This is an optional parameter. Default value: Offline. Offline migration involves copying of your source databases at a point in time, to your target server. |
| `properties` | Absolute path to a JSON file that has the information about the Single Server source. |

For example:

```azurecli-interactive
az postgres flexible-server migration create --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1 --properties "C:\Users\Administrator\Documents\migrationBody.JSON" --migration-mode offline
```

The `migration-name` argument used in the `create` command is used in other CLI commands, such as `update`, `delete`, and `show.` It uniquely identifies the migration attempt in the corresponding actions in all those commands.

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
    },
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

The `create` parameters that go into the JSON file format are as shown below:

| Parameter | Type | Description |
| --- | --- | --- |
| `sourceDbServerResourceId` | Required | This parameter is the resource ID of the Single Server source and is mandatory. |
| `adminCredentials` | Required | This parameter lists passwords for admin users for both the Single Server source and the Flexible Server target. These passwords help to authenticate against the source and target servers.
| `sourceServerUserName` | Required | The default value is the admin user created during the creation of a single server, and the password provided is used for authentication against this user. If you aren't using the default user, this parameter is the user or role on the source server for performing the migration. This user should have the necessary privileges and ownership of the database objects involved in the migration and should be a member of the **azure_pg_admin** role. |
| `targetServerUserName` | Required | The default value is the admin user created during the creation of a flexible server, and the password provided is used for authentication against this user. In case you aren't using the default user, this parameter is the user or role on the target server used for performing the migration. This user should be a member of **azure_pg_admin**, **pg_read_all_settings**, **pg_read_all_stats**,**pg_stat_scan_tables** roles and should have the **Create role, Create DB** attributes. |
| `dbsToMigrate` | Required | Specify the list of databases that you want to migrate to Flexible Server. Only user databases are migrated. System databases or template databases such as template0 and template1 won't be migrated. |
| `overwriteDbsInTarget` | Required | When set to true, if the target server happens to have an existing database with the same name as the one you're trying to migrate, migration service automatically overwrites the database. |
| `SetupLogicalReplicationOnSourceDBIfNeeded` | Optional | You can automatically enable logical replication on the source server by setting this property to `true`. This change in the server settings requires a server restart with two to three minutes of downtime. |
| `SourceDBServerFullyQualifiedDomainName` | Optional | Use it when a custom DNS server is used for name resolution for a virtual network. Provide the FQDN of the Single Server source according to the custom DNS server for this property. |
| `TargetDBServerFullyQualifiedDomainName` | Optional | Use it when a custom DNS server is used for name resolution inside a virtual network. Provide the FQDN of the Flexible Server target according to the custom DNS server.<br />`SourceDBServerFullyQualifiedDomainName` and `TargetDBServerFullyQualifiedDomainName` are included as a part of the JSON only in the rare scenario that a custom DNS server is used for name resolution instead of Azure-provided DNS. Otherwise, don't include these parameters in the JSON file. |

Note these essential points for the command response:

- When the `create` command is triggered, the migration moves to the `InProgress` state and the `PerformingPreRequisiteSteps` substrate. The migration workflow takes a few minutes to deploy the migration infrastructure and set up connections between the source and target.
- After the `PerformingPreRequisiteSteps` substate is completed, the migration moves to the substrate of `Migrating Data,` where the Cloning/Copying of the databases takes place.
- Each database migrated has its own section with all migration details, such as table count, incremental inserts, deletions, and pending bytes.
- The time that the `Migrating Data` substate takes to finish depends on the size of the databases that are migrated.
- The migration moves to the `Succeeded` state as soon as the `Migrating Data` substate finishes successfully. If there's a problem at the `Migrating Data` substate, the migration moves into a `Failed` state.

### Setup replication

If the **Online** migration preview is selected, Logical replication must be turned on in the source Single server. If it isn't turned on, the migration service automatically turns on logical replication at the source Single server when the `SetupLogicalReplicationOnSourceDBIfNeeded` parameter is passed with a value of `true` in the accompanying JSON file. Replication can also be set up manually at the source after starting the migration using the command below. Either approach of turning on logical replication restarts the source Single server.

For example:

```azurecli-interactive
az postgres flexible-server migration update --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name CLIMigrationExample --setup-replication
```

This command is required to advance the migration when the flexible server is waiting in the `WaitingForLogicalReplicationSetupRequestOnSourceDB` state.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/az-postgres-flexible-server-migration-logical-replication.png" alt-text="Screenshot of logical replication setup." lightbox="../../media/tutorial-migration-service-single-to-flexible/az-postgres-flexible-server-migration-logical-replication.png":::

To perform Online migration in any of the above regions, use:

```azurecli-interactive
az postgres flexible-server migration create --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1 --properties "C:\Users\Administrator\Documents\migrationBody.JSON" --migration-mode online
```

### List the migrations

The `list` command lists all the migration attempts made to a Flexible Server target:

```azurecli
az postgres flexible-server migration list [--subscription]
                                            [--resource-group]
                                            [--name]
                                            [--filter]
```

The `filter` parameter has two options:

- `Active`: Lists the current active migration attempts (in progress) into the target server. It doesn't include the migrations that have failed, canceled, or succeeded.
- `All`: Lists all the migration attempts into the target server. This includes both the active and past migrations, regardless of the state.

For more information about this command, use the `help` parameter:

```azurecli-interactive
az postgres flexible-server migration list -- help
```

### Monitor the migration

The `show` command helps you monitor ongoing migrations and gives the current state and substate of the migration.
These details include information on the current state and substate of the migration.

```azurecli
az postgres flexible-server migration show [--subscription]
                                            [--resource-group]
                                            [--name]
                                            [--migration-name]
```

The `migration_name` parameter is the name assigned to the migration during the `create` command. Here's a snapshot of the sample response from the CLI command for showing details:

For more information about this command, use the `help` parameter:

```azurecli-interactive
 az postgres flexible-server migration show -- help
 ```

The following tables describe the migration states and substates.

| Migration state | Description |
| --- | --- |
| `InProgress` | The migration infrastructure is set up, or the actual data migration is in progress. |
| `Canceled` | The migration is canceled or deleted. |
| `Failed` | The migration has failed. |
| `Succeeded` | The migration has succeeded and is complete. |

| Migration substate | Description |
| --- | --- |
| `PerformingPreRequisiteSteps` | Infrastructure is set up and is prepped for data migration. |
| `MigratingData` | Data migration is in progress. |
| `CompletingMigration` | Migration cutover is in progress. |
| `Completed` | cutover was successful, and migration is complete. |

### Cutover the migration

In Online migrations, after the base data migration is complete, the migration task moves to `WaitingForCutoverTrigger` substate. In this state, user can trigger cutover through CLI using the command below. The cutover can also be triggered from the portal by selecting the migration name in the migration grid.

For example:

```azurecli-interactive
az postgres flexible-server migration update --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name CLIMigrationExample --cutover
```

Before initiating cutover, it's important to ensure that:
- Writes to the source are stopped
-`latency` parameter decreases to 0 or close to 0

`latency` parameter indicates when the target last synced up with the source. For example, here it's 201 and 202 for the two databases as shown in the picture below. It means that the changes that occurred in the last ~200 seconds at the source are yet to be synced to the target. At this point, writes to the source can be stopped and cutover initiated. In case there's heavy traffic at the source, it's recommended to stop writes first so that `Latency` can come close to 0, and then cutover is initiated. The Cutover operation applies all pending changes from the source to the Target and completes the migration. If you trigger a "Cutover" even with nonzero `Latency`, the replication stops until that point in time. All the data on the source until the cutover point is then applied to the target. Say a latency was 15 minutes at the cutover point, so all the change data in the last 15 minutes applies to the target. The time taken depends on the backlog of changes that occurred in the last 15 minutes. Hence, it's recommended that the latency goes to zero or near zero, before triggering the cutover.
The `latency` information can be obtained using the [migration show command](#monitor-the-migration).
Here's a snapshot of the migration before initiating the cutover:

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/az-postgres-flexible-server-migration-cutover.png" alt-text="Screenshot of Azure Command Line Interface check for cutover." lightbox="../../media/tutorial-migration-service-single-to-flexible/az-postgres-flexible-server-migration-cutover.png":::

After the cutover is initiated, all transactions that happened during the base copy are copied sequentially to the target, and migration is completed.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/az-postgres-flexible-server-migration-cutover-success.png" alt-text="Screenshot of Azure Command Line Interface complete cutover." lightbox="../../media/tutorial-migration-service-single-to-flexible/az-postgres-flexible-server-migration-cutover-success.png":::

If the cutover isn't successful, the migration moves to the `Failed` state.

For more information about this command, use the `help` parameter:

```azurecli-interactive
 az postgres flexible-server migration update -- help
 ```

---

## Cancel the migration using CLI

You can cancel any ongoing migration attempts by using the `cancel` command. This command stops the particular migration attempt but doesn't drop or roll back any changes on your target server. Here's the CLI command to delete a migration:

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

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/az-postgres-flexible-server-migration-update-cancel-help.png" alt-text="Screenshot of Azure Command Line Interface Cancel." lightbox="../../media/tutorial-migration-service-single-to-flexible/az-postgres-flexible-server-migration-update-cancel-help.png":::
