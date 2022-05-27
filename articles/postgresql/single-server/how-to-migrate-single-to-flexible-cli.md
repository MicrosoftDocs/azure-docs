---
title: "Migrate PostgreSQL Single Server to Flexible Server using the Azure CLI"
titleSuffix: Azure Database for PostgreSQL Flexible Server
description: Learn about migrating your Single server databases to Azure database for PostgreSQL Flexible server using CLI.
author: hariramt
ms.author: hariramt
ms.service: postgresql
ms.topic: conceptual
ms.date: 05/09/2022
---

# Migrate Single Server to Flexible Server PostgreSQL using Azure CLI

>[!NOTE]
> Single Server to Flexible Server migration feature is in public preview.

This quick start article shows you how to use Single to Flexible Server migration feature to migrate databases from Azure database for PostgreSQL Single server to Flexible server.

## Before you begin

1. If you are new to Microsoft Azure, [create an account](https://azure.microsoft.com/free/) to evaluate our offerings. 
2. Register your subscription for Azure Database Migration Service (DMS). If you have already done it, you can skip this step. Go to Azure portal homepage and navigate to your subscription as shown below.

  :::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-cli-dms.png" alt-text="Screenshot of C L I Database Migration Service." lightbox="./media/concepts-single-to-flexible/single-to-flex-cli-dms.png":::

3. In your subscription, navigate to **Resource Providers** from the left navigation menu. Search for "**Microsoft.DataMigration**"; as shown below and click on **Register**.

  :::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-cli-dms-register.png" alt-text="Screenshot of C L I Database Migration Service register button." lightbox="./media/concepts-single-to-flexible/single-to-flex-cli-dms-register.png":::

## Pre-requisites

### Setup Azure CLI

1. Install the latest Azure CLI for your corresponding operating system from the [Azure CLI install page](/cli/azure/install-azure-cli)
2. In case Azure CLI is already installed, check the version by issuing **az version** command. The version should be **2.28.0 or above** to use the migration CLI commands. If not, update your Azure CLI using this [link](/cli/azure/update-azure-cli.md).
3. Once you have the right Azure CLI version, run the **az login** command. A browser page is opened with Azure sign-in page to authenticate. Provide your Azure credentials to do a successful authentication. For other ways to sign with Azure CLI, visit this [link](/cli/azure/authenticate-azure-cli.md).
   
      ```bash
      az login
      ```
4. Take care of the pre-requisites listed in this [**document**](./concepts-single-to-flexible.md#pre-requisites) which are necessary to get started with the Single to Flexible migration feature.

## Migration CLI commands

Single to Flexible Server migration feature comes with a list of easy-to-use CLI commands to do migration-related tasks. All the CLI commands start with  **az postgres flexible-server migration**. You can use the **help** parameter to help you with understanding the various options associated with a command and in framing the right syntax for the same.

```azurecli-interactive
az postgres flexible-server migration --help
```

  gives you the following output.

  :::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-cli-help.png" alt-text="Screenshot of C L I help." lightbox="./media/concepts-single-to-flexible/single-to-flex-cli-help.png":::

It lists the set of migration commands that are supported along with their actions. Let us look into these commands in detail.

### Create migration

The create migration command helps in creating a migration from a source server to a target server

```azurecli-interactive
az postgres flexible-server migration create -- help
```

gives the following result

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-cli-create.png" alt-text="Screenshot of C L I create." lightbox="./media/concepts-single-to-flexible/single-to-flex-cli-create.png":::

It calls out the expected arguments and has an example syntax that needs to be used to create a successful migration from the source to target server. The CLI command to create a migration is given below

```azurecli
az postgres flexible-server migration create [--subscription]
                                            [--resource-group]
                                            [--name] 
                                            [--migration-name] 
                                            [--properties] 
```

| Parameter | Description |
| ---- | ---- |
|**subscription** | Subscription ID of the target flexible server |
| **resource-group** | Resource group of the target flexible server |
| **name** | Name of the target flexible server |
| **migration-name** | Unique identifier to migrations attempted to the flexible server. This field accepts only alphanumeric characters and does not accept any special characters except  **-**. The name cannot start with a  **-** and no two migrations to a flexible server can have the same name. |
| **properties** | Absolute path to a JSON file, that has the information about the source single server |

**For example:**

```azurecli-interactive
az postgres flexible-server migration create --subscription 5c5037e5-d3f1-4e7b-b3a9-f6bf9asd2nkh0 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1 --properties "C:\Users\Administrator\Documents\migrationBody.JSON"
```

The **migration-name** argument used in **create migration** command will be used in other CLI commands such as **update, delete, show** to uniquely identify the migration attempt and to perform the corresponding actions.

The migration feature offers online and offline mode of migration. To know more about the migration modes and their differences, visit this [link](./concepts-single-to-flexible.md)

Create a migration between a source and target server with a migration mode of your choice. The **create** command needs a JSON file to be passed as part of its **properties** argument.

The structure of the JSON is given below.

```bash
{
"properties": {
 "SourceDBServerResourceId":"subscriptions/<subscriptionid>/resourceGroups/<src_ rg_name>/providers/Microsoft.DBforPostgreSQL/servers/<source server name>",

"SourceDBServerFullyQualifiedDomainName": "fqdn of the source server as per the custom DNS server", 
"TargetDBServerFullyQualifiedDomainName": "fqdn of the target server as per the custom DNS server"

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
 "ResourceId":"subscriptions/<subscriptionid>/resourceGroups/<temp_rg_name>",
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

Create migration parameters:

| Parameter | Type | Description |
| ---- | ---- | ---- |
| **SourceDBServerResourceId** | Required |  Resource ID of the single server and is mandatory. |
| **SourceDBServerFullyQualifiedDomainName** | optional |  Used when a custom DNS server is used for name resolution for a virtual network. The FQDN of the single server as per the custom DNS server should be provided for this property. |
| **TargetDBServerFullyQualifiedDomainName** | optional |  Used when a custom DNS server is used for name resolution inside a virtual network. The FQDN of the flexible server as per the custom DNS server should be provided for this property. <br> **_SourceDBServerFullyQualifiedDomainName_**, **_TargetDBServerFullyQualifiedDomainName_** should be included as a part of the JSON only in the rare scenario of a custom DNS server being used for name resolution instead of Azure provided DNS. Otherwise, these parameters should not be included as a part of the JSON file. |
| **SecretParameters** | Required | Passwords for admin user for both single server and flexible server along with the Azure AD app credentials. They help to authenticate against the source and target servers and help in checking proper authorization access to the resources.
| **MigrationResourceGroup** | optional | This section consists of two properties. <br> **ResourceID (optional)** : The migration infrastructure and other network infrastructure components are created to migrate data and schema from the source to target. By default, all the components created by this feature are provisioned under the resource group of the target server. If you wish to deploy them under a different resource group, then you can assign the resource ID of that resource group to this property. <br> **SubnetResourceID (optional)** : In case if your source has public access turned OFF or if your target server is deployed inside a VNet, then specify a subnet under which migration infrastructure needs to be created so that it can connect to both source and target servers. |
| **DBsToMigrate** | Required | Specify the list of databases you want to migrate to the flexible server. You can include a maximum of 8 database names at a time. |
| **SetupLogicalReplicationOnSourceDBIfNeeded** | Optional | Logical replication can be enabled on the source server automatically by setting this property to **true**. This change in the server settings requires a server restart with a downtime of few minutes (~ 2-3 mins). |
| **OverwriteDBsinTarget** | Optional | If the target server happens to have an existing database with the same name as the one you are trying to migrate, the migration will pause until you acknowledge that overwrites in the target DBs are allowed. This pause can be avoided by giving the migration feature, permission to automatically overwrite databases by setting the value of this property to **true** |

### Mode of migrations

The default migration mode for migrations created using CLI commands is **online**. With the above properties filled out in your JSON file, an online migration would be created from your single server to flexible server.

If you want to migrate in **offline** mode, you need to add an additional property **"TriggerCutover":"true"** to your properties JSON file before initiating the create command.

### List migrations

The **list command** shows the migration attempts that were made to a flexible server. The CLI command to list migrations is given below

```azurecli
az postgres flexible-server migration list [--subscription]
                                            [--resource-group]
                                            [--name]  
                                            [--filter] 
```

There is a parameter called **filter** and it can take **Active** and **All** as values.

- **Active** – Lists down the current active migration attempts for the target server. It does not include the migrations that have reached a failed/canceled/succeeded state.
- **All** – Lists down all the migration attempts to the target server. This includes both the active and past migrations irrespective of the state.

```azurecli-interactive
az postgres flexible-server migration list -- help
```

For any additional information.

### Show Details

The **list** gets the details of a specific migration. This includes information on the current state and substate of the migration. The CLI command to show the details of a migration is given below:

```azurecli
az postgres flexible-server migration list [--subscription]
                                            [--resource-group]
                                            [--name]  
                                            [--migration-name] 
```

The **migration_name** is the name assigned to the migration during the **create migration** command. Here is a snapshot of the sample response from the **Show Details** CLI command.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-cli-migration-name.png" alt-text="Screenshot of C L I migration name." lightbox="./media/concepts-single-to-flexible/single-to-flex-cli-migration-name.png":::

Some important points to note on the command response:

- As soon as the **create** migration command is triggered, the migration moves to the **InProgress** state and **PerformingPreRequisiteSteps** substate. It takes up to 15 minutes for the migration workflow to deploy the migration infrastructure, configure firewall rules with source and target servers, and to perform a few maintenance tasks. 
- After the **PerformingPreRequisiteSteps** substate is completed, the migration moves to the substate of **Migrating Data** where the dump and restore of the databases take place.
- Each DB being migrated has its own section with all migration details such as table count, incremental inserts, deletes, pending bytes, etc.
- The time taken for **Migrating Data** substate to complete is dependent on the size of databases that are being migrated.
- For **Offline** mode, the migration moves to **Succeeded** state as soon as the **Migrating Data** sub state completes successfully. If there is an issue at the **Migrating Data** substate, the migration moves into a **Failed** state.
- For **Online** mode, the migration moves to the state of  **WaitingForUserAction** and a substate of **WaitingForCutoverTrigger** after the **Migrating Data** state completes successfully. The details of **WaitingForUserAction** state are covered in detail in the next section.

```azurecli-interactive
 az postgres flexible-server migration show -- help
 ```

for any additional information.

### Update migration

As soon as the infrastructure setup is complete, the migration activity will pause with appropriate messages seen in the  **show details**  CLI command response if some pre-requisites are missing or if the migration is at a state to perform a cutover. At this point, the migration goes into a state called  **WaitingForUserAction**. The  **update migration**  command is used to set values for parameters, which helps the migration to move to the next stage in the process. Let us look at each of the sub-states.

- **WaitingForLogicalReplicationSetupRequestOnSourceDB** - If the logical replication is not set at the source server or if it was not included as a part of the JSON file, the migration will wait for logical replication to be enabled at the source. A user can enable the logical replication setting manually by changing the replication flag to **Logical** on the portal. This would require a server restart. This can also be enabled by the following CLI command

```azurecli
az postgres flexible-server migration update [--subscription]
                                            [--resource-group]
                                            [--name]  
                                            [--migration-name]
                                            [--initiate-data-migration] 
```

You need to pass the value **true** to the **initiate-data-migration** property to set logical replication on your source server.

**For example:**

```azurecli-interactive
az postgres flexible-server migration update --subscription 5c5037e5-d3f1-4e7b-b3a9-f6bf9asd2nkh0 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1 --initiate-data-migration true"
```

In case you have enabled it manually, **you would still need to issue the above update command** for the migration to move out of the **WaitingForUserAction** state. The server does not need a reboot again since it was already done via the portal action.

- **WaitingForTargetDBOverwriteConfirmation** - This is the state where migration is waiting for confirmation on target overwrite as data is already present in the target server for the database that is being migrated. This can be enabled by the following CLI command.

```azurecli
az postgres flexible-server migration update [--subscription]
                                            [--resource-group]
                                            [--name]  
                                            [--migration-name]
                                            [--overwrite-dbs] 
```

You need to pass the value **true** to the **overwrite-dbs** property to give the permissions to the migration to overwrite any existing data in the target server.

**For example:**

```azurecli-interactive
az postgres flexible-server migration update --subscription 5c5037e5-d3f1-4e7b-b3a9-f6bf9asd2nkh0 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1 --overwrite-dbs true"
```

- **WaitingForCutoverTrigger** - Migration gets to this state when the dump and restore of the databases have been completed and the ongoing writes at your source single server is being replicated to the target flexible server.You should wait for the replication to complete so that the target is in sync with the source. You can monitor the replication lag by using the response from the **show migration** command. There is a metric called **Pending Bytes** associated with each database that is being migrated and this gives you indication of the difference between the source and target database in bytes. This should be nearing zero over time. Once it reaches zero for all the databases, stop any further writes to your single server. This should be followed by the validation of data and schema on your flexible server to make sure it matches exactly with the source server. After completing the above steps, you can trigger **cutover** by using the following CLI command.

```azurecli
az postgres flexible-server migration update [--subscription]
                                            [--resource-group]
                                            [--name]  
                                            [--migration-name]
                                            [--cutover] 
```

**For example:**

```azurecli-interactive
az postgres flexible-server migration update --subscription 5c5037e5-d3f1-4e7b-b3a9-f6bf9asd2nkh0 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1 --cutover"
```

After issuing the above command, use the **show details** command to monitor if the cutover has completed successfully. Upon successful cutover, migration will move to **Succeeded** state. Update your application to point to the new target flexible server.

```azurecli-interactive
 az postgres flexible-server migration update -- help
 ```

for any additional information.

### Delete/Cancel Migration

Any ongoing migration attempts can be deleted or canceled using the **delete migration** command. This command stops all migration activities in that task, but does not drop or rollback any changes on your target server. Below is the CLI command to delete a migration

```azurecli
az postgres flexible-server migration delete [--subscription]
                                            [--resource-group]
                                            [--name]  
                                            [--migration-name]
```

**For example:**

```azurecli-interactive
az postgres flexible-server migration delete --subscription 5c5037e5-d3f1-4e7b-b3a9-f6bf9asd2nkh0 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1"
```

```azurecli-interactive
 az postgres flexible-server migration delete -- help
 ```

for any additional information.

## Monitoring Migration

The **create migration** command starts a migration between the source and target servers. The migration goes through a set of states and substates before eventually moving into the **completed** state. The **show command** helps to monitor ongoing migrations since it gives the current state and substate of the migration.

Migration **states**:

| Migration State | Description |
| ---- | ---- |
| **InProgress** | The migration infrastructure is being setup, or the actual data migration is in progress. |
| **Canceled** | The migration has been canceled or deleted. |
| **Failed** | The migration has failed. |
| **Succeeded** | The migration has succeeded and is complete. |
| **WaitingForUserAction** | Migration is waiting on a user action. This state has a list of substates that were discussed in detail in the previous section. |

Migration **substates**:

| Migration substates | Description |
| ----  | ---- |
| **PerformingPreRequisiteSteps** | Infrastructure is being set up and is being prepped for data migration. |
| **MigratingData** | Data is being migrated. |
| **CompletingMigration** | Migration cutover in progress. |
| **WaitingForLogicalReplicationSetupRequestOnSourceDB** | Waiting for logical replication enablement. You can manually enable this manually or enable via the update migration CLI command covered in the next section. |
| **WaitingForCutoverTrigger** | Migration is ready for cutover. You can start the cutover when ready. |
| **WaitingForTargetDBOverwriteConfirmation** | Waiting for confirmation on target overwrite as data is present in the target server being migrated into. <br> You can enable this via the  **update migration**  CLI command. |
| **Completed** | Cutover was successful, and migration is complete. |


## How to find if custom DNS is used for name resolution?
Navigate to your Virtual network where you deployed your source or the target server and click on **DNS server**. It should indicate if it is using a custom DNS server or default Azure provided DNS server.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-cli-dns-server.png" alt-text="Screenshot of CLI dns server." lightbox="./media/concepts-single-to-flexible/single-to-flex-cli-dns-server.png":::

## Post Migration Steps

Make sure the post migration steps listed [here](./concepts-single-to-flexible.md) are followed for a successful end to end migration.

## Next steps

- [Single Server to Flexible migration concepts](./concepts-single-to-flexible.md)
