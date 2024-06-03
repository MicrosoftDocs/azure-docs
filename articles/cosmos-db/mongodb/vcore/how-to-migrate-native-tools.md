---
title: Migrate MongoDB using MongoDB native tools
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Use MongoDB native tools to migrate small datasets from existing MongoDB instances to Azure Cosmos DB for MongoDB vCore offline.
author: gahl-levy
ms.author: gahllevy
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 10/24/2023
# CustomerIntent: As a database owner, I want to use the native tools in MongoDB Core so that I can migrate an existing dataset to Azure Cosmos DB for MongoDB vCore.
---

# Migrate MongoDB to Azure Cosmos DB for MongoDB vCore offline using MongoDB native tools

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

In this tutorial, you use MongoDB native tools to perform an offline (one-time) migration of a database from an on-premises or cloud instance of MongoDB to Azure Cosmos DB for MongoDB vCore. The MongoDB native tools are a set of binaries that facilitate data manipulation on an existing MongoDB instance. The focus of this doc is on migrating data out of a MongoDB instance using *mongoexport/mongoimport* or *mongodump/mongorestore*. Since the native tools connect to MongoDB using connection strings, you can run the tools anywhere. The native tools can be the simplest solution for small datasets where total migration time isn't a concern.

## Prerequisites

- An existing Azure Cosmos DB for MongoDB vCore cluster.
  - If you don't have an Azure subscription, [create an account for free](https://azure.microsoft.com/free).
  - If you have an existing Azure subscription, [create a new Azure Cosmos DB for MongoDB vCore cluster](quickstart-portal.md).
- [MongoDB native tools](https://www.mongodb.com/try/download/database-tools) installed on your machine.

## Prepare

Prior to starting the migration, make sure you have prepared your Azure Cosmos DB for MongoDB vCore account and your existing MongoDB instance for migration.

- MongoDB instance (source)
  - Complete the [premigration assessment](../pre-migration-steps.md#pre-migration-assessment) to determine if there are a list of incompatibilities and warnings between your source instance and target account.
  - Ensure that your MongoDB native tools match the same version as the existing (source) MongoDB instance.
    - If your MongoDB instance has a different version than Azure Cosmos DB for MongoDB vCore, then install both MongoDB native tool versions and use the appropriate tool version for MongoDB and Azure Cosmos DB for MongoDB vCore, respectively.
  - Add a user with `readWrite` permissions, unless one already exists. You eventually use this credential with the *mongoexport* and *mongodump* tools.
- Azure Cosmos DB for MongoDB vCore (target)
  - Gather the Azure Cosmos DB for MongoDB vCore [account's credentials](./quickstart-portal.md#get-cluster-credentials).
  - [Configure Firewall Settings](./security.md#network-security-options) on Azure Cosmos DB for MongoDB vCore.

> [!TIP]
> We recommend running these tools within the same network as the MongoDB instance to avoid further firewall issues.

## Choose the proper MongoDB native tool

There are some high-level considerations when choosing the right MongoDB native tool for your offline migration.

## Perform the migration

Migrate a collection from the source MongoDB instance to the target Azure Cosmos DB for MongoDB vCore account using your preferred native tool. For more information on selecting a tool, see [native MongoDB tools](migration-options.md#native-mongodb-tools-offline)

> [!TIP]
> If you simply have a small JSON file that you want to import into Azure Cosmos DB for MongoDB vCore, the *mongoimport* tool is a quick solution for ingesting the data.

### [mongoexport/mongoimport](#tab/export-import)

1. To export the data from the source MongoDB instance, open a terminal and use any of three methods listed here.

    - Specify the ``--host``, ``--username``, and ``--password`` arguments to connect to and export JSON records.

        ```bash
        mongoexport \
            --host <hostname><:port> \
            --username <username> \
            --password <password> \
            --db <database-name> \
            --collection <collection-name> \
            --out <filename>.json
        ```

    - Export a subset of the MongoDB data by adding a ``--query`` argument. This argument ensures that the tool only exports documents that match the filter.

        ```bash
        mongoexport \
            --host <hostname><:port> \
            --username <username> \
            --password <password> \
            --db <database-name> \
            --collection <collection-name> \
            --query '{ "quantity": { "$gte": 15 } }' \
            --out <filename>.json
        ```

    - Export data from Azure Cosmos DB for MongoDB vCore.

        ```bash
        mongoexport \
            --uri <target-connection-string>
            --db <database-name> \
            --collection <collection-name> \
            --query '{ "quantity": { "$gte": 15 } }' \
            --out <filename>.json
        ```

1. Import the previously exported file into the target Azure Cosmos DB for MongoDB vCore account.

    ```bash
    mongoimport \
        --file <filename>.json \
        --type json \
        --db <database-name> \
        --collection <collection-name> \
        --ssl \
        --uri <target-connection-string>
    ```

1. Monitor the terminal output from *mongoimport*. The output prints lines of text to the terminal with updates on the import operation's status.

### [mongodump/mongorestore](#tab/dump-restore)

1. To create a data dump of all data in your MongoDB instance, open a terminal and use any of three methods listed here.

    - Specify the ``--host``, ``--username``, and ``--password`` arguments to dump the data as native BSON.

        ```bash
        mongodump \
            --host <hostname><:port> \
            --username <username> \
            --password <password> \
            --out <dump-directory>
        ```

    - Specify the ``--db`` and ``--collection`` arguments to narrow the scope of the data you wish to dump:

        ```bash
        mongodump \
            --host <hostname><:port> \
            --username <username> \
            --password <password> \    
            --db <database-name> \
            --out <dump-directory>
        ```

        ```bash
        mongodump \
            --host <hostname><:port> \
            --username <username> \
            --password <password> \    
            --db <database-name> \
            --collection <collection-name> \
            --out <dump-directory>
        ```

    - Create a data dump of all data in your Azure Cosmos DB for MongoDB vCore.

        ```bash
        mongodump \
            --uri <target-connection-string> \
            --out <dump-directory>
        ```

1. Observe that the tool created a directory with the native BSON data dumped. The files and folders are organized into a resource hierarchy based on the database and collection names. Each database is a folder and each collection is a `.bson` file.

1. Restore the contents of any specific collection into an Azure Cosmos DB for MongoDB vCore account by specifying the collection's specific BSON file. The filename is constructed using this syntax: `<dump-directory>/<database-name>/<collection-name>.bson`.

    ```bash
    mongorestore \ 
       --db <database-name> \
       --collection <collection-name> \
       --ssl \
       --uri <target-connection-string> \
       <dump-directory>/<database-name>/<collection-name>.bson
    ```

1. Monitor the terminal output from *mongoimport*. The output prints lines of text to the terminal with updates on the restore operation's status.

---

## Next step

> [!div class="nextstepaction"]
> [Build a Node.js web application](tutorial-nodejs-web-app.md)
