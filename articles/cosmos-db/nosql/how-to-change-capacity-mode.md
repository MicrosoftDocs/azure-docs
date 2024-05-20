---
title: Change from serverless to provisioned throughput (preview)
titleSuffix: Azure Cosmos DB for NoSQL
description: Review the steps on how to change the capacity mode of a serverless Azure Cosmos DB for NoSQL account to a provisioned capacity account.
author: richagaur
ms.author: richagaur
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 05/08/2024
#Customer Intent: As an administrator, I want to change the capacity mode, so that I can migrate from serverless to provisioned capacity.
---
 
# Change from serverless to provisioned capacity mode in Azure Cosmos DB for NoSQL (preview)

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Azure Cosmos DB for NoSQL accounts in serverless capacity mode can be changed to provisioned capacity mode. Changing from serverless to provisioned capacity mode converts all containers within the account to manual provisioned throughput containers in-place. The containers' throughput is determined according to the following formula: `Throughput(RU/s) = max(5000, StorageInGB * 10)`.

You can also change the throughput or provisioning mode from manual to autoscale once the migration is complete.

> [!WARNING]
> This is an irreversible operation. Once migrated, the capacity mode can't be changed back to serverless.

## Prerequisites

- An existing Azure Cosmos DB for NoSQL account.
  - If you have an Azure subscription, [create a new account](how-to-create-account.md?tabs=azure-portal).
  - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  - Alternatively, you can [try Azure Cosmos DB free](../try-free.md) before you commit.

## Register for preview

To enable this feature, register for the preview feature **Change capacity mode (preview)** in your subscription. For more information, see [register for an Azure Cosmos DB preview feature](../access-previews.md).

## Change capacity mode

Follow these steps to change the capacity mode using Azure portal.

1. In the Azure portal, navigate to your API for NoSQL account.

1. Select the **Change** option associated with the **capacity mode** field in the **Overview** section of the account page.

1. Review the changes and select **Confirm** to start the migration.

1. Monitor the status using the **state** field in the **Overview** section. The status indicates that the account is **updating** while the migration is in progress.

1. Once the migration is complete, the **capacity mode** field is now set to **provisioned capacity**.

> [!IMPORTANT]
> There are no service level agreements (SLAs) associated with the duration of the capacity mode change. You cannot execute any management operation while the migration is in progress. However, the containers can be accessed as usual by any client application.

## Related content

- [Chose between autoscale and manual throughput](../how-to-choose-offer.md).
- [Choose between serverless and provisioned throughput](../throughput-serverless.md).
