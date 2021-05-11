---
title: Azure Cosmos DB free tier 
description: Use Azure Cosmos DB free tier to get started, develop, test your applications. With free tier, you'll get the first 1000 RU/s and 25 GB of storage in the account for free. 
author: SnehaGunda
ms.service: cosmos-db
ms.topic: how-to
ms.date: 05/25/2021
ms.author: sngun
---

# Azure Cosmos DB free tier 
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

Azure Cosmos DB free tier makes it easy to get started, develop, test your applications, or even run small production workloads for free. When free tier is enabled on an account, you'll get the first 1000 RU/s and 25 GB of storage in the account for free. The throughput and storage consumed beyond these limits are billed at regular price. Free tier is available for all API accounts with provisioned throughput, autoscale throughput, single, or multiple write regions.

Free tier lasts indefinitely for the lifetime of the account and it comes with all the [benefits and features](introduction.md#key-benefits) of a regular Azure Cosmos DB account. These benefits include unlimited storage and throughput (RU/s), SLAs, high availability, turnkey global distribution in all Azure regions, and more.

You can have up to one free tier Azure Cosmos DB account per an Azure subscription and you must opt-in when creating the account. If you do not see the option to apply the free tier discount, this means another account in the subscription has already been enabled with free tier. When creating a new account, it’s recommended to enable the free tier discount if it’s available.

> [!NOTE]
> Free tier is currently not available for serverless accounts.

## Free tier with shared throughput database

When using free tier, you can create a shared throughput database with 25 containers that share up to 1000 RU/s throughput for free at the database level. In a free tier account, you can create a max of 5 shared throughput databases.

When using the free tier, if you provision a shared database with a minimum throughput of 1000 RU/s, all the containers within that database share the throughput. Any new databases with shared throughput or containers with dedicated throughput are billed at the regular pricing.

## Free tier with Azure discount

The Azure Cosmos DB free tier is compatible with the [Azure free account](optimize-dev-test.md#azure-free-account). To opt-in, create an Azure Cosmos DB free tier account in your Azure free account subscription. For the first 12 months, you will get a combined discount of 1400 RU/s (1000 RU/s from Azure Cosmos DB free tier and 400 RU/s from Azure free account) and 50 GB of storage (25 GB from Azure Cosmos DB free tier and 25 GB from Azure free account). After the 12 months expires, you will continue to get 1000 RU/s and 25 GB from the Azure Cosmos DB free tier, for the lifetime of the Azure Cosmos DB account.

> [!NOTE]
> Azure Cosmos DB free tier is different from the Azure free account. The Azure free account offers Azure credits and resources for free for a limited time. When using Azure Cosmos DB as a part of this free account, you get 25-GB storage and 400 RU/s of provisioned throughput for 12 months.

## Best practices to keep your account feee

When using Azure Cosmos DB free tier, to keep your account completely free of charge, your account should not have any additional RU/s or storage consumption other than the one offered by the free tier.

For example, the following are some options that don’t result in any monthly charge:

* One database with a max of 1000 RU/s provisioned throughput.
* Two containers one with a max of 400 RU/s and other with a max of 600 RU/s provisioned throughput.
* Account with 2 regions with a single write region that has one container with a max of 500 RU/s provisioned throughput.

## Create an account with free tier

You can create a free tier account from the Azure portal, PowerShell, CLI, or Azure Resource Manager templates. You can choose free tier while creating the account, you can’t set it after the account is created.

### Azure portal

When creating the account using the Azure portal, set the **Apply Free Tier Discount** option to **Apply**. See [create a new account with free tier](create-cosmosdb-resources-portal.md) article for step-by-step guidance.

### Resource manager template

To create a free tier account using Resource Manager template, set the property`"enableFreeTier": true`. For the complete template, see deploy a [Resource Manager template with free tier](manage-with-templates.md#free-tier) example.

### CLI

To create an account with free tier using CLI, set the `--enable-free-tier` parameter to true:

```azurecli-interactive
# Create a free tier account for SQL API

az cosmosdb create \
    -n "Myaccount" \
    -g "MyResourcegroup" \
    --enable-free-tier true \
    --default-consistency-level "Session"
    
```

### PowerShell

To create an account with free tier using Azure PowerShell, set the `-EnableFreeTier` parameter to true:

```powershell-interactive

# Create a free tier account for SQL API. 
New-AzCosmosDBAccount -ResourceGroupName MyResourcegroup" `
    -Name "Myaccount" `
    -ApiKind "sql" `
    -EnableFreeTier true `
    -DefaultConsistencyLevel "Session" `
```

## Next steps

You can learn more about optimizing the costs for your Azure Cosmos DB resources in the following articles:

* Learn about [Optimizing for development and testing](optimize-dev-test.md)
* Learn more about [Understanding your Azure Cosmos DB bill](understand-your-bill.md)
* Learn more about [Optimizing throughput cost](optimize-cost-throughput.md)
