---
title: Use the Batch Management .NET library to manage account resources
description: Create, delete, and modify Azure Batch account resources with the Batch Management .NET library.
ms.topic: how-to
ms.date: 01/26/2021
ms.devlang: csharp
ms.custom: seodec18, has-adal-ref, devx-track-csharp, devx-track-dotnet
---
# Manage Batch accounts and quotas with the Batch Management client library for .NET

You can lower maintenance overhead in your Azure Batch applications by using the [Batch Management .NET](/dotnet/api/overview/azure/batch) library to automate Batch account creation, deletion, key management, and quota discovery.

- **Create and delete Batch accounts** within any region. If, as an independent software vendor (ISV) for example, you provide a service for your clients in which each is assigned a separate Batch account for billing purposes, you can add account creation and deletion capabilities to your customer portal.
- **Retrieve and regenerate account keys** programmatically for any of your Batch accounts. This can help you comply with security policies that enforce periodic rollover or expiry of account keys. When you have several Batch accounts in various Azure regions, automation of this rollover process increases your solution's efficiency.
- **Check account quotas** and take the trial-and-error guesswork out of determining which Batch accounts have what limits. By checking your account quotas before starting jobs, creating pools, or adding compute nodes, you can proactively adjust where or when these compute resources are created. You can determine which accounts require quota increases before allocating additional resources in those accounts.
- **Combine features of other Azure services** for a full-featured management experience by using Batch Management .NET, [Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md), and the [Azure Resource Manager](../azure-resource-manager/management/overview.md) together in the same application. By using these features and their APIs, you can provide a frictionless authentication experience, the ability to create and delete resource groups, and the capabilities that are described above for an end-to-end management solution.

> [!NOTE]
> While this article focuses on the programmatic management of your Batch accounts, keys, and quotas, you can also perform many of these activities by [using the Azure portal](batch-account-create-portal.md).

## Create and delete Batch accounts

One of the primary features of the Batch Management API is to create and delete [Batch accounts](accounts.md) in an Azure region. To do so, use [BatchManagementClient.Account.CreateAsync](/dotnet/api/microsoft.azure.management.batch.batchaccountoperationsextensions.createasync) and [DeleteAsync](/dotnet/api/microsoft.azure.management.batch.batchaccountoperationsextensions.deleteasync), or their synchronous counterparts.

The following code snippet creates an account, obtains the newly created account from the Batch service, and then deletes it. In this snippet and the others in this article, `batchManagementClient` is a fully initialized instance of [BatchManagementClient](/dotnet/api/microsoft.azure.management.batch.batchmanagementclient).

```csharp
// Create a new Batch account
await batchManagementClient.Account.CreateAsync("MyResourceGroup",
    "mynewaccount",
    new BatchAccountCreateParameters() { Location = "West US" });

// Get the new account from the Batch service
AccountResource account = await batchManagementClient.Account.GetAsync(
    "MyResourceGroup",
    "mynewaccount");

// Delete the account
await batchManagementClient.Account.DeleteAsync("MyResourceGroup", account.Name);
```

> [!NOTE]
> Applications that use the Batch Management .NET library and its BatchManagementClient class require service administrator or coadministrator access to the subscription that owns the Batch account to be managed. For more information, see the Microsoft Entra ID section and the [AccountManagement](https://github.com/Azure-Samples/azure-batch-samples/tree/master/CSharp/AccountManagement) code sample.

## Retrieve and regenerate account keys

Obtain primary and secondary account keys from any Batch account within your subscription by using [GetKeysAsync](/dotnet/api/microsoft.azure.management.batch.batchaccountoperationsextensions.getkeysasync). You can regenerate those keys by using [RegenerateKeyAsync](/dotnet/api/microsoft.azure.management.batch.batchaccountoperationsextensions.regeneratekeyasync).

```csharp
// Get and print the primary and secondary keys
BatchAccountGetKeyResult accountKeys =
    await batchManagementClient.Account.GetKeysAsync(
        "MyResourceGroup",
        "mybatchaccount");
Console.WriteLine("Primary key:   {0}", accountKeys.Primary);
Console.WriteLine("Secondary key: {0}", accountKeys.Secondary);

// Regenerate the primary key
BatchAccountRegenerateKeyResponse newKeys =
    await batchManagementClient.Account.RegenerateKeyAsync(
        "MyResourceGroup",
        "mybatchaccount",
        new BatchAccountRegenerateKeyParameters() {
            KeyName = AccountKeyType.Primary
            });
```

> [!TIP]
> You can create a streamlined connection workflow for your management applications. First, obtain an account key for the Batch account you wish to manage with [GetKeysAsync](/dotnet/api/microsoft.azure.management.batch.batchaccountoperationsextensions.getkeysasync). Then, use this key when initializing the Batch .NET library's [BatchSharedKeyCredentials](/dotnet/api/microsoft.azure.batch.auth.batchsharedkeycredentials) class, which is used when initializing [BatchClient](/dotnet/api/microsoft.azure.batch.batchclient).

## Check Azure subscription and Batch account quotas

Azure subscriptions and the individual Azure services like Batch all have default quotas that limit the number of certain entities within them. For the default quotas for Azure subscriptions, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md). For the default quotas of the Batch service, see [Quotas and limits for the Azure Batch service](batch-quota-limit.md). By using the Batch Management .NET library, you can check these quotas in your applications. This enables you to make allocation decisions before you add accounts or compute resources like pools and compute nodes.

### Check an Azure subscription for Batch account quotas

Before creating a Batch account in a region, you can check your Azure subscription to see whether you are able to add an account in that region.

In the code snippet below, we first use **ListAsync** to get a collection of all Batch accounts that are within a subscription. Once we've obtained this collection, we determine how many accounts are in the target region. Then we use **GetQuotasAsync** to obtain the Batch account quota and determine how many accounts (if any) can be created in that region.

```csharp
// Get a collection of all Batch accounts within the subscription
BatchAccountListResponse listResponse =
        await batchManagementClient.BatchAccount.ListAsync(new AccountListParameters());
IList<AccountResource> accounts = listResponse.Accounts;
Console.WriteLine("Total number of Batch accounts under subscription id {0}:  {1}",
    creds.SubscriptionId,
    accounts.Count);

// Get a count of all accounts within the target region
string region = "westus";
int accountsInRegion = accounts.Count(o => o.Location == region);

// Get the account quota for the specified region
SubscriptionQuotasGetResponse quotaResponse = await batchManagementClient.Location.GetQuotasAsync(region);
Console.WriteLine("Account quota for {0} region: {1}", region, quotaResponse.AccountQuota);

// Determine how many accounts can be created in the target region
Console.WriteLine("Accounts in {0}: {1}", region, accountsInRegion);
Console.WriteLine("You can create {0} accounts in the {1} region.", quotaResponse.AccountQuota - accountsInRegion, region);
```

In the snippet above, `creds` is an instance of **TokenCredentials**. To see an example of creating this object, see the [AccountManagement](https://github.com/Azure-Samples/azure-batch-samples/tree/master/CSharp/AccountManagement) code sample on GitHub.

### Check a Batch account for compute resource quotas

Before increasing compute resources in your Batch solution, you can check to ensure the resources you want to allocate won't exceed the account's quotas. In the code snippet below, we print the quota information for the Batch account named `mybatchaccount`. In your own application, you could use such information to determine whether the account can handle the additional resources to be created.

```csharp
// First obtain the Batch account
BatchAccountGetResponse getResponse =
    await batchManagementClient.Account.GetAsync("MyResourceGroup", "mybatchaccount");
AccountResource account = getResponse.Resource;

// Now print the compute resource quotas for the account
Console.WriteLine("Core quota: {0}", account.Properties.CoreQuota);
Console.WriteLine("Pool quota: {0}", account.Properties.PoolQuota);
Console.WriteLine("Active job and job schedule quota: {0}", account.Properties.ActiveJobAndJobScheduleQuota);
```

> [!IMPORTANT]
> While there are default quotas for Azure subscriptions and services, many of these limits can be raised by [requesting a quota increase in the Azure portal](batch-quota-limit.md#increase-a-quota).

<a name='use-azure-ad-with-batch-management-net'></a>

## Use Microsoft Entra ID with Batch Management .NET

The Batch Management .NET library is an Azure resource provider client, and is used together with [Azure Resource Manager](../azure-resource-manager/management/overview.md) to manage account resources programmatically. Microsoft Entra ID is required to authenticate requests made through any Azure resource provider client, including the Batch Management .NET library, and through Azure Resource Manager. For information about using Microsoft Entra ID with the Batch Management .NET library, see [Use Microsoft Entra ID to authenticate Batch solutions](batch-aad-auth.md).

## Sample project on GitHub

To see Batch Management .NET in action, check out the [AccountManagement](https://github.com/Azure/azure-batch-samples/tree/master/CSharp/AccountManagement) sample project on GitHub. The AccountManagement sample application demonstrates the following operations:

1. Acquire a security token from Microsoft Entra ID by using [Acquire and cache tokens using the Microsoft Authentication Library (MSAL)](../active-directory/develop/msal-net-acquire-token-silently.md). If the user is not already signed in, they are prompted for their Azure credentials.
2. With the security token obtained from Microsoft Entra ID, create a [SubscriptionClient](/dotnet/api/microsoft.azure.management.resourcemanager.subscriptionclient) to query Azure for a list of subscriptions associated with the account. The user can select a subscription from the list if it contains more than one subscription.
3. Get credentials associated with the selected subscription.
4. Create a [ResourceManagementClient](/dotnet/api/microsoft.azure.management.resourcemanager.resourcemanagementclient) object by using the credentials.
5. Use a [ResourceManagementClient](/dotnet/api/microsoft.azure.management.resourcemanager.resourcemanagementclient) object to create a resource group.
6. Use a [BatchManagementClient](/dotnet/api/microsoft.azure.management.batch.batchmanagementclient) object to perform several Batch account operations:
   - Create a Batch account in the new resource group.
   - Get the newly created account from the Batch service.
   - Print the account keys for the new account.
   - Regenerate a new primary key for the account.
   - Print the quota information for the account.
   - Print the quota information for the subscription.
   - Print all accounts within the subscription.
   - Delete the newly created account.
7. Delete the resource group.

To run the sample application successfully, you must first register it with your Microsoft Entra tenant in the Azure portal and grant permissions to the Azure Resource Manager API. Follow the steps provided in [Authenticate Batch Management solutions with Active Directory](batch-aad-auth-management.md).

## Next steps

- Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
- Learn the basics of developing a Batch-enabled application using the [Batch .NET client library](quick-run-dotnet.md) or [Python](quick-run-python.md). These quickstarts guide you through a sample application that uses the Batch service to execute a workload on multiple compute nodes, using Azure Storage for workload file staging and retrieval.git pus
