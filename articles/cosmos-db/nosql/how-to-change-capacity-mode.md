---
title: Change capacity mode from serverless to provisioned throughput in Azure Cosmos DB (preview)
description: Learn how to change the capacity mode of a serverless account to a provisioned capacity account.
author: richagaur
ms.author: richagaur
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 05/21/2024
ms.custom: build-2024
---
 
# Change from serverless to provisioned capacity mode in Azure Cosmos DB (preview)

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Azure Cosmos DB allows a user to change the capacity mode of an account from serverless to provisioned capacity. Changing from serverless to provisioned capacity mode converts all containers within the account to manual provisioned throughput containers in-place. The containers' throughput is determined according to the following formula.

`Throughput(RU/s) = max(5000, StorageInGB * 10)`

Users can also change the throughput or provisioning mode from manual to autoscale once the migration is complete.

>[!Caution]
>This is an irreversible operation. Once migrated, the capacity mode can't be changed back to serverless.

## Getting started

To enable this feature, register for the preview feature **Change capacity mode (preview)** on your subscription.

## How to change capacity mode?

Follow the steps below to change the capacity mode using Azure portal. 

1. Click on the **Change** link next to *capacity mode* on the overview page of your Cosmos DB account.

2. Review the changes and click on **Confirm** to start the migration.

3. Monitor the status in the **updating** state on the overview page of Cosmos DB account while the migration is in progress.

4. Once the migration is complete, the capacity mode will be changed to **provisioned capacity**.

> [!Note] 
> There are no SLA's associated with the duration of the capacity mode change.
> Users cannot execute any management operation while the migration is in progress. However, the containers can be accessed as usual by any client application.

## Next Steps

- Learn [how to chose between autoscale and manual throughput](../how-to-choose-offer.md).
- Learn [how to chose between serverless and provisioned throughput](../throughput-serverless.md).
- Trying to do capacity planning for Azure Cosmos DB with provisioned capacity?  
    If you know typical request rates for your current database workload, [read about estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md).

