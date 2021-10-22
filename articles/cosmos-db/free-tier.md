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

You can have up to one free tier Azure Cosmos DB account per an Azure subscription and you must opt-in when creating the account. If you do not see the option to apply the free tier discount, this means another account in the subscription has already been enabled with free tier. If you create an account with free tier and then delete it, you can apply free tier for a new account. When creating a new account, it’s recommended to enable the free tier discount if it’s available.

> [!NOTE]
> Free tier is currently not available for serverless accounts.

## Free tier with shared throughput database

In shared throughput model, when you provision throughput on a database, the throughput is shared across all the containers in the database. When using the free tier, you can provision a shared database with up to 1000 RU/s for free. All containers in the database will share the throughput. 

Just like the regular account, in the free tier account, a shared throughput database can have a max of 25 containers. 
Any additional databases with shared throughput or containers with dedicated throughput beyond 1000 RU/s are billed at the regular pricing. In a free tier account, you can create a max of 5 shared throughput databases.

## Free tier with Azure discount

The Azure Cosmos DB free tier is compatible with the [Azure free account](optimize-dev-test.md#azure-free-account). To opt-in, create an Azure Cosmos DB free tier account in your Azure free account subscription. For the first 12 months, you will get a combined discount of 1400 RU/s (1000 RU/s from Azure Cosmos DB free tier and 400 RU/s from Azure free account) and 50 GB of storage (25 GB from Azure Cosmos DB free tier and 25 GB from Azure free account). After the 12 months expires, you will continue to get 1000 RU/s and 25 GB from the Azure Cosmos DB free tier, for the lifetime of the Azure Cosmos DB account. For an example of how the charges are stacked, see [Billing examples with free tier accounts](understand-your-bill.md#azure-free-tier).

> [!NOTE]
> Azure Cosmos DB free tier is different from the Azure free account. The Azure free account offers Azure credits and resources for free for a limited time. When using Azure Cosmos DB as a part of this free account, you get 25-GB storage and 400 RU/s of provisioned throughput for 12 months.

## Best practices to keep your account free

When using Azure Cosmos DB free tier, to keep your account completely free of charge, your account should not have any additional RU/s or storage consumption other than the one offered by the free tier.

For example, the following are some options that don’t result in any monthly charge:

* One database with a max of 1000 RU/s provisioned throughput.
* Two containers one with a max of 400 RU/s and other with a max of 600 RU/s provisioned throughput.
* Account with 2 regions with a single region that has one container with a max of 500 RU/s provisioned throughput.

## Create an account with free tier

You can create a free tier account from the Azure portal, PowerShell, CLI, or Azure Resource Manager (ARM) templates. You can choose free tier while creating the account, you can’t set it after the account is created.

### Azure portal

When creating the account using the Azure portal, set the **Apply Free Tier Discount** option to **Apply**. See [create a new account with free tier](create-cosmosdb-resources-portal.md) article for step-by-step guidance.

### ARM template

To create a free tier account by using an ARM template, set the property`"enableFreeTier": true`. For the complete template, see deploy an [ARM template with free tier](manage-with-templates.md#free-tier) example.

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
New-AzCosmosDBAccount -ResourceGroupName "MyResourcegroup" `
    -Name "Myaccount" `
    -ApiKind "sql" `
    -EnableFreeTier true `
    -DefaultConsistencyLevel "Session" `
```

## Next steps

After you create a free tier account, you can start building apps with Azure Cosmos DB with the following articles:

* [Build a console app using the .NET V4 SDK](create-sql-api-dotnet-v4.md) to manage Azure Cosmos DB resources.
* [Build a .NET web app using Azure Cosmos DB's API for MongoDB](mongodb/create-mongodb-dotnet.md)
* [Download a notebook from the gallery](publish-notebook-gallery.md#download-a-notebook-from-the-gallery) and analyze your data.
* Learn more about [Understanding your Azure Cosmos DB bill](understand-your-bill.md)
