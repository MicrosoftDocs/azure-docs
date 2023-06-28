---
title: Limit the total throughput provisioned on your Azure Cosmos DB account
description: Learn how to limit the total throughput provisioned on your Azure Cosmos DB account
author: seesharprun
ms.service: cosmos-db
ms.topic: how-to
ms.date: 03/31/2022
ms.author: sidandrews
ms.custom: ignite-fall-2021, ignite-2022
---

# Limit the total throughput provisioned on your Azure Cosmos DB account
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

When using an Azure Cosmos DB account in [provisioned throughput](./set-throughput.md) mode, most of your costs usually come from the amount of throughput that you have provisioned across your account. In particular, these costs are directly influenced by:

- The number of databases that have shared throughput.
- The number of containers that have dedicated throughput.
- The amount of throughput provisioned on each of these resources.
- The number of regions where your account is available.

It can be challenging to keep track of the total amount of throughput that you have provisioned across your account, especially when you're getting started with Azure Cosmos DB. This can lead to unexpected charges when this amount ends up going over a certain budget that you didn't expect to exceed. To help you better control your costs, Azure Cosmos DB lets you limit the total throughput provisioned on your account.

> [!NOTE]
> This feature is not available on [serverless](./serverless.md) accounts.

After you've set a limit to your account's total throughput, any of the following operations that results in exceeding this limit is blocked and will explicitly fail:

- Creating a new database with shared throughput.
- Creating a new container with dedicated throughput.
- Increasing the provisioned throughput on a resource configured in standard (manual) mode.
- Increasing the maximum provisioned throughput on a resource configured in autoscale mode.
- Adding a new region to your account.

> [!NOTE]
> For resources configured in autoscale mode, it is the maximum throughput configured on the resource that counts towards your account's total throughput.

> [!IMPORTANT]
> Once a total throughput limit is enabled on your account, you must pass an explicit throughput value when creating new containers. You will currently get an error if you try to create a container with no explicit throughput.

## Set the total throughput limit from the Azure portal

### New account

When creating a new Azure Cosmos DB account from the portal, you have the option to limit the account's total throughput:

:::image type="content" source="./media/limit-total-account-throughput/create-account.png" alt-text="Screenshot of the Azure portal showing how to limit total account throughput when creating a new account" border="true":::

Checking this option will limit your account's total throughput to 1,000 RU/s for a [free tier account](free-tier.md) and 4,000 RU/s for a regular, non-free tier account. You can change this value after your account has been created.

### Existing account

From the Azure portal, navigate to your Azure Cosmos DB account and select **Cost management** from the left menu.

:::image type="content" source="./media/limit-total-account-throughput/existing-account.png" alt-text="Screenshot of the Azure portal showing how to update total account throughput on an existing account" border="true":::

This section shows a summary of the total throughput provisioned on your account and lets you configure the total throughput limit. The following three options are available:

- **Limit the account's total provisioned throughput to the amount included in the free tier discount**. This option is only available on free tier accounts and will limit your account's total throughput to 1,000 RU/s. When checking this option, you ensure that you won't incur any charges for provisioned throughput.
- **Allow the account's total throughput to be provisioned up to a custom amount**. This option lets you enter the total provisioned throughput that you don't want to exceed. A monthly cost estimate corresponding to your input is shown as a reference.
  > [!NOTE]
  > This custom limit can't be lower than the total throughput currently provisioned across the account.
- **No limit, allow the account's total throughput to be provisioned to any amount**. This option disables the limit.

## Set the total throughput limit programmatically

### Using Azure Resource Manager templates

When creating or updating your Azure Cosmos DB account with Azure Resource Manager, you can configure the total throughput limit by setting the `properties.capacity.totalThroughputLimit` property:

```json
{
  "location": "West US",
  "kind": "DocumentDB",
  "properties": {
    "locations": [
      {
        "locationName": "West US",
        "failoverPriority": 0,
        "isZoneRedundant": false
      }
    ],
    "databaseAccountOfferType": "Standard",
    "capacity": {
        "totalThroughputLimit": 2000
    }
  }
}
```

Set this property to `-1` to disable the limit.

## Frequently asked questions

#### Are there situations where the total provisioned throughput can exceed the limit?

Azure Cosmos DB enforces a minimum throughput of 1 RU/s per GB of data stored. If you're ingesting data while already being at that minimum, the throughput provisioned on your resources will automatically increase to honor 1 RU/s per GB. In this case, and this case only, your total provisioned throughput may exceed the limit you've set.

## Next steps

- Get started with [planning and managing your costs](./plan-manage-costs.md) on Azure Cosmos DB.
- Learn more about [provisioned throughput](./set-throughput.md).
- Find out how to [optimize provisioned throughput costs](./optimize-cost-throughput.md).
