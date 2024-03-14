---
title: PostgreSQL - Single Server to Flexible Server CLI migration
author: markingmyname
ms.author: maghan
ms.date: 03/19/2024
ms.service: postgresql
ms.topic: include
---

You can migrate using Azure CLI.

[!INCLUDE [prerequisites-setup-azure-CLI-commands-postgresql](../prerequisites/prerequisites-setup-azure-cli-commands-postgresql.md)]

## Connect to the source

We're going to migrate "ticketdb","inventorydb","salesdb" into Azure Database for PostgreSQL flexible server.

:::image type="content" source="../../media\tutorial-migration-service-iaas\az-migration-source-CLI.png" alt-text="Screenshot of the az migration source page." lightbox="../../media\tutorial-migration-service-iaas\az-migration-source-CLI.png":::

## Perform migration using CLI

- Open the command prompt and sign in to the Azure using `az login` command

    :::image type="content" source="../../media\tutorial-migration-service-iaas\success-az-login-CLI.png" alt-text="Screenshot of the az success sign in." lightbox="../../media\tutorial-migration-service-iaas\success-az-login-CLI.png":::

- Edit the below placeholders `<< >>` in the JSON lines and store them in the local machine as `<<filename>>.json` where the CLI is being invoked. In this tutorial, we have saved the file in C:\migration-CLI\migration_body.json

    ```bash
    {
    "properties": {
    "SourceDBServerResourceId": "<<source hostname or IP address>>:<<port>>@<<username>>",
            "SecretParameters": {
                "AdminCredentials": {
                    "SourceServerPassword": "<<Source Password>>",
                    "TargetServerPassword": "<<Target Password>>"
                }
            },
         "targetServerUserName":"<<Target username>>",
            "DBsToMigrate": [
               "<<comma separated list of databases like - "ticketdb","timedb","salesdb">>"
            ],
            "OverwriteDBsInTarget": "true",
            "MigrationMode": "Offline",
            "sourceType": "AzureVM",
            "sslMode": "Prefer"
        }
    }
    ```

- Run the following command to check if any migrations are running. The migration name is unique across the migrations within the Azure Database for PostgreSQL flexible server target.

    ```bash
    az postgres flexible-server migration list --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --filter All
    ```

    :::image type="content" source="../../media\tutorial-migration-service-iaas\list-CLI.png" alt-text="Screenshot of list the migration runs in CLI." lightbox="../../media\tutorial-migration-service-iaas\list-CLI.png":::

- In the above steps, there are no migrations performed so we start with the new migration by running the following command

    ```bash
    az postgres flexible-server migration create --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --migration-name <<Unique Migration Name>> --migration-option ValidateAndMigrate --properties "C:\migration-cli\migration_body.json"
    ```

- Run the following command to initiate the migration status in the previous step. You can check the status of the migration by providing the migration name

    ```bash
    az postgres flexible-server migration show --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --migration-name <<Migration ID>>
    ```

- The status of the migration progress is shown in the CLI.

    :::image type="content" source="../../media\tutorial-migration-service-iaas\status-migration-CLI.png" alt-text="Screenshot of status migration CLI." lightbox="../../media\tutorial-migration-service-iaas\status-migration-CLI.png":::

- You can also see the status in the Azure Database for PostgreSQL flexible server portal.

    :::image type="content" source="../../media\tutorial-migration-service-iaas\status-migration-portal.png" alt-text="Screenshot of status migration portal." lightbox="../../media\tutorial-migration-service-iaas\status-migration-portal.png":::

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

---

