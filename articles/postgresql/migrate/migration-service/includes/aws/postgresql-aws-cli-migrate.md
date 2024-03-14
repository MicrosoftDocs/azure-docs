---
title: PostgreSQL - AWS RDS PostgreSQL to Flexible Server CLI migration
author: markingmyname
ms.author: maghan
ms.date: 03/19/2024
ms.service: postgresql
ms.topic: include
---

You can migrate using Azure CLI.

[!INCLUDE [prerequisites-setup-azure-CLI-commands-postgresql](../prerequisites/prerequisites-setup-azure-cli-commands-postgresql.md)]

## Connect to the source

- For this tutorial, we're going to migrate "ticketdb," "inventorydb," and "timedb" into Azure Database for PostgreSQL flexible server.

:::image type="content" source="..\..\media\tutorial-migration-service-aws\az-migration-source-CLI-aws.png" alt-text="Screenshot of the az migration source page." lightbox="..\..\media\tutorial-migration-service-aws\az-migration-source-CLI-aws.png":::

## Perform migration using CLI

- Open the command prompt and sign in into Azure using the `az login` command

    :::image type="content" source="..\..\media\tutorial-migration-service-aws\success-az-login-CLI.png" alt-text="Screenshot of the az success sign in." lightbox="..\..\media\tutorial-migration-service-aws\success-az-login-CLI.png":::

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
           "<<comma separated list of databases like - "ticketdb","timedb","inventorydb">>"
        ],
        "OverwriteDBsInTarget": "true",
        "MigrationMode": "Offline",
        "sourceType": "AWS",
        "sslMode": "Require"
    }
}
```

- Run the following command to check if any migrations are running. The migration name is unique across the migrations within the Azure Database for PostgreSQL flexible server target.

    ```bash
    az postgres flexible-server migration list --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible  Server>> --filter All
    ```

    :::image type="content" source="..\..\media\tutorial-migration-service-aws\list-CLI.png" alt-text="Screenshot of list the migration runs in CLI." lightbox="..\..\media\tutorial-migration-service-aws\list-CLI.png":::

- In the above steps, there are no migrations performed so we start with the new migration by running the following command

    ```bash
    az postgres flexible-server migration create --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --migration-name <<Unique Migration Name>> --migration-option ValidateAndMigrate --properties "C:\migration-cli\migration_body.json"
    ```

- Run the following command to initiate the migration status in the previous step. You can check the status of the migration by providing the migration name

    ```bash
    az postgres flexible-server migration show --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --migration-name <<Migration ID>>
    ```

- The status of the migration progress is shown in the CLI.

    :::image type="content" source="..\..\media\tutorial-migration-service-aws\status-migration-CLI-aws.png" alt-text="Screenshot of status migration CLI." lightbox="..\..\media\tutorial-migration-service-aws\status-migration-CLI-aws.png":::

- You can also see the status of the PostgreSQL flexible server portal in the Azure Database.

    :::image type="content" source="..\..\media\tutorial-migration-service-aws\status-migration-portal-aws.png" alt-text="Screenshot of status migration portal." lightbox="..\..\media\tutorial-migration-service-aws\status-migration-portal-aws.png":::

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