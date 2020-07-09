---
title: "Known issues: Migrate from MongoDB to Azure CosmosDB"
titleSuffix: Azure Database Migration Service
description: Learn about known issues and migration limitations with migrations from MongoDB to Azure Cosmos DB using the Azure Database Migration Service.
services: database-migration
author: pochiraju
ms.author: rajpo
manager: craigg
ms.reviewer: craigg
ms.service: dms
ms.workload: data-services
ms.custom: "seo-lt-2019"
ms.topic: article
ms.date: 02/27/2020
---

# Known issues/migration limitations with migrations from MongoDB to Azure Cosmos DB's API for MongoDB

Known issues and limitations associated with migrations from MongoDB to Cosmos DB's API for MongoDB are described in the following sections.

## Migration fails as a result of using the incorrect SSL Cert

* **Symptom**: This issue is apparent when a user cannot connect to the MongoDB source server. Despite having all firewall ports open, the user still can't connect.

| Cause         | Resolution |
| ------------- | ------------- |
| Using a self-signed certificate in Azure Database Migration Service may lead to the migration failing because of the incorrect SSL Cert. The Error message may include "The remote certificate is invalid according to the validation procedure." | Use a genuine certificate from CA.  Self-signed certs are generally only used in internal tests. When you install a genuine cert from a CA authority, you can then use SSL in Azure Database Migration Service without issue (connections to Cosmos DB use SSL over Mongo API).<br><br> |

## Unable to get the list of databases to map in DMS

* **Symptom**: Unable to get DB list on the **Database setting** blade when using **Data from Azure Storage** mode on the **Select source** blade.

| Cause         | Resolution |
| ------------- | ------------- |
| The storage account connection string is missing the SAS info and thus cannot be authenticated. | Create the SAS on the blob container in Storage Explorer and use the URL with container SAS info as the source detail connection string.<br><br> |

## Using an unsupported version of the database

* **Symptom**: The migration fails.

| Cause         | Resolution |
| ------------- | ------------- |
| You attempt to migrate to Azure Cosmos DB from an unsupported version of MongoDB. | As new versions of MongoDB are released, they are tested to ensure compatibility with Azure Database Migration Service, and the  service is being updated periodically to accept the latest version(s). If there is an immediate need to migrate, as a workaround you can export the databases/collections to Azure Storage and then point the source to the resulting dump. Create the SAS on the blob container in Storage Explorer, and then use the URL with container SAS info as the source detail connection string.<br><br> |

## Next steps

* View the tutorial [Migrate MongoDB to Azure Cosmos DB's API for MongoDB online using DMS](tutorial-mongodb-cosmos-db-online.md).
* View the tutorial [Migrate MongoDB to Azure Cosmos DB's API for MongoDB offline using DMS](tutorial-mongodb-cosmos-db.md).