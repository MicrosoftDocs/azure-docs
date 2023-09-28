---
title: |
  Try Azure Cosmos DB free
description: |
  Try Azure Cosmos DB free. No credit card required. Test your apps, deploy, and run small workloads free for 30 days. Upgrade your account at any time.
author: seesharprun
ms.author: sidandrews
ms.reviewer: merae
ms.service: cosmos-db
ms.custom: ignite-2022, references_regions
ms.topic: overview
ms.date: 11/07/2022
---

# Try Azure Cosmos DB free

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table, PostgreSQL](includes/appliesto-nosql-mongodb-cassandra-gremlin-table-postgresql.md)]

[Try Azure Cosmos DB](https://aka.ms/trycosmosdb) makes it easy to try out Azure Cosmos DB for free before you commit. There's no credit card required to get started. Your account is free for 30 days. After expiration, a new sandbox account can be created. You can extend beyond 30 days for 24 hours. You can upgrade your active Try Azure Cosmos DB account at any time during the 30 day trial period.

If you're using the API for NoSQL or PostgreSQL, you can also migrate your Try Azure Cosmos DB data to your upgraded account before the trial ends.

This article walks you through how to create your account, limits, and upgrading your account. This article also walks through how to migrate your data from your Try Azure Cosmos DB sandbox to your own account using the API for NoSQL.

## Limits to free account

### [NoSQL / Cassandra/ Gremlin / Table](#tab/nosql+cassandra+gremlin+table)

The following table lists the limits for the [Try Azure Cosmos DB](https://aka.ms/trycosmosdb) for Free trial.

| Resource | Limit |
| --- | --- |
| Duration of the trial | 30 days¹²  |
| Maximum containers per subscription | 1 |
| Maximum throughput per container | 5,000 |
| Maximum throughput per shared-throughput database | 20,000 |
| Maximum total storage per account | 10 GB |

¹ A new trial can be requested after expiration.
² After expiration, the information stored in your account is deleted. You can upgrade your account prior to expiration and migrate the information stored.

> [!NOTE]
> Try Azure Cosmos DB supports global distribution in only the **East US**, **North Europe**, **Southeast Asia**, and **North Central US** regions. Azure support tickets can't be created for Try Azure Cosmos DB accounts. However, support is provided for subscribers with existing support plans.

### [MongoDB](#tab/mongodb)

The following table lists the limits for the [Try Azure Cosmos DB](https://aka.ms/trycosmosdb) for Free trial.

| Resource | Limit |
| --- | --- |
| Duration of the trial | 30 days¹²  |
| Maximum containers per subscription | 3 |
| Maximum throughput per container | 5,000 |
| Maximum throughput per shared-throughput database | 20,000 |
| Maximum total storage per account | 10 GB |

¹ A new trial can be requested after expiration.
² After expiration, the information stored in your account is deleted. You can upgrade your account prior to expiration and migrate the information stored.

> [!NOTE]
> Try Azure Cosmos DB supports global distribution in only the **East US**, **North Europe**, **Southeast Asia**, and **North Central US** regions. Azure support tickets can't be created for Try Azure Cosmos DB accounts. However, support is provided for subscribers with existing support plans.

### [PostgreSQL](#tab/postgresql)

The following table lists the limits for the [Try Azure Cosmos DB](https://aka.ms/trycosmosdb) for Free trial.

| Resource | Limit |
| --- | --- |
| Duration of the trial | 30 days¹² |
| Type of account | Single node |
| vCores | 2 |
| Memory (GiB) | 8 |
| Maximum storage size (GiB) | 128 |

¹ A new trial can be requested after expiration.
² After expiration, the information stored in your account is deleted. You can upgrade your account prior to expiration and migrate the information stored.

---

## Create your Try Azure Cosmos DB account

From the [Try Azure Cosmos DB home page](https://aka.ms/trycosmosdb), select an API. Azure Cosmos DB provides five APIs: NoSQL and MongoDB for document data, Gremlin for graph data, Azure Table, and Cassandra.

> [!NOTE]
> Not sure which API will best meet your needs? To learn more about the APIs for Azure Cosmos DB, see [Choose an API in Azure Cosmos DB](choose-api.md).

:::image type="content" source="media/try-free/try-cosmos-db-page.png" lightbox="media/try-free/try-cosmos-db-page.png" alt-text="Screenshot of the API options including NoSQL, MongoDB, and Cassandra on the Try Azure Cosmos DB page.":::

## Launch a Quick Start

Launch the Quickstart in Data Explorer in Azure portal to start using Azure Cosmos DB or get started with our documentation.

* [API for NoSQL](nosql/quickstart-portal.md#create-container-database)
* [API for PostgreSQL](postgresql/quickstart-create-portal.md)
* [API for MongoDB](mongodb/quickstart-python.md#object-model)
* [API for Apache Cassandra](cassandra/adoption.md)
* [API for Apache Gremlin](gremlin/quickstart-console.md)
* [API for Table](table/quickstart-dotnet.md)

You can also get started with one of the learning resources in the Data Explorer.

:::image type="content" source="media/try-free/data-explorer.png" lightbox="media/try-free/data-explorer.png" alt-text="Screenshot of the Azure Cosmos DB Data Explorer landing page.":::

## Upgrade your account

Your account is free for 30 days. After expiration, a new sandbox account can be created. You can upgrade your active Try Azure Cosmos DB account at any time during the 30 day trial period. Here are the steps to start an upgrade.

### Start upgrade

1. From either the Azure portal or the Try Azure Cosmos DB free page, select the option to **Upgrade** your account.

    :::image type="content" source="media/try-free/upgrade-account.png" lightbox="media/try-free/upgrade-account.png" alt-text="Screenshot of the confirmation page for the account upgrade experience.":::

1. Choose to either **Sign up for an Azure account** or **Sign in** and create a new Azure Cosmos DB account following the instructions in the next section.

### Create a new account

#### [NoSQL / MongoDB / Cassandra / Gremlin / Table](#tab/nosql+mongodb+cassandra+gremlin+table)

> [!NOTE]
> While this example uses API for NoSQL, the steps are similar for the APIs for MongoDB, Cassandra, Gremlin, or Table.

[!INCLUDE[Create NoSQL account](includes/create-nosql-account.md)]

#### [PostgreSQL](#tab/postgresql)

[!INCLUDE[Create PostgreSQL account](includes/create-postgresql-account.md)]

---

### Move data to new account

If you desire, you can migrate your existing data from the free account to the newly created account.

#### [NoSQL](#tab/nosql)

1. Navigate back to the **Upgrade** page from the [Start upgrade](#start-upgrade) section of this guide. Select **Next** to move on to the third step and move your data.

    :::image type="content" source="media/try-free/account-creation-options.png" lightbox="media/try-free/account-creation-options.png" alt-text="Screenshot of the sign-in/sign-up experience to upgrade your current account.":::

1. Locate your **Primary Connection string** for the Azure Cosmos DB account you created for your data. This information can be found within the **Keys** page of your new account.

    :::image type="content" source="media/try-free/account-keys.png" lightbox="media/try-free/account-keys.png" alt-text="Screenshot of the Keys page for an Azure Cosmos DB account.":::

1. Back in the **Upgrade** page from the [Start upgrade](#start-upgrade) section of this guide, insert the connection string of the new Azure Cosmos DB account in the **Connection string** field.

    :::image type="content" source="media/try-free/migrate-data.png" lightbox="media/try-free/migrate-data.png" alt-text="Screenshot of the migrate data options in the portal.":::

1. Select **Next** to move the data to your account. Provide your email address to be notified by email once the migration has been completed.

#### [PostgreSQL](#tab/postgresql)

1. Navigate back to the **Upgrade** page from the [Start upgrade](#start-upgrade) section of this guide. Select **Next** to move on to the third step and move your data.

    :::image type="content" source="media/try-free/account-creation-options.png" lightbox="media/try-free/account-creation-options.png" alt-text="Screenshot of the sign-in/sign-up experience to upgrade your current account.":::

1. Locate your **PostgreSQL connection URL** of the Azure Cosmos DB account you created for your data. This information can be found within the **Connection String** page of your new account.

1. Back in the **Upgrade** page from the [Start upgrade](#start-upgrade) section of this guide, insert the connection string of the new Azure Cosmos DB account in the **Connection string** field.

1. Select the region where you account was created.

1. Select **Finish** to move the data to your account.

#### [MongoDB / Cassandra / Gremlin / Table](#tab/mongodb+cassandra+gremlin+table)

> [!IMPORTANT]
> Data migration is not available for the APIs for MongoDB, Cassandra, Gremlin, or Table.

---

## Delete your account

There can only be one free Try Azure Cosmos DB account per Microsoft account. You may want to delete your account or to try different APIs, you'll have to create a new account. Here’s how to delete your account.

1. Go to the [Try Azure Cosmos DB](https://aka.ms/trycosmosdb) page.

1. Select **Delete my account**.

    :::image type="content" source="media/try-free/delete-account.png" lightbox="media/try-free/delete-account.png" alt-text="Screenshot of the confirmation page for the account deletion experience.":::

## Next steps

After you create a Try Azure Cosmos DB sandbox account, you can start building apps with Azure Cosmos DB with the following articles:

* Use [API for NoSQL to build a console app using .NET](nosql/quickstart-dotnet.md) to manage data in Azure Cosmos DB.
* Use [API for MongoDB to build a sample app using Python](mongodb/quickstart-python.md) to manage data in Azure Cosmos DB.
* [Create a Jupyter notebook](notebooks-overview.md) and analyze your data.
* Learn more about [understanding your Azure Cosmos DB bill](understand-your-bill.md)
* Get started with Azure Cosmos DB with one of our quickstarts:
  * [Get started with Azure Cosmos DB for NoSQL](nosql/quickstart-portal.md#create-container-database)
  * [Get started with Azure Cosmos DB for PostgreSQL](postgresql/quickstart-create-portal.md)
  * [Get started with Azure Cosmos DB for MongoDB](mongodb/quickstart-python.md#object-model)
  * [Get started with Azure Cosmos DB for Cassandra](cassandra/adoption.md)
  * [Get started with Azure Cosmos DB for Gremlin](gremlin/quickstart-console.md)
  * [Get started with Azure Cosmos DB for Table](table/quickstart-dotnet.md)
* Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for [capacity planning](sql/estimate-ru-with-capacity-planner.md).
* If all you know is the number of vCores and servers in your existing database cluster, see [estimating request units using vCores or vCPUs](convert-vcore-to-request-unit.md).
* If you know typical request rates for your current database workload, see [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md).
