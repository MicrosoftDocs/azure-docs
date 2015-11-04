<properties
	pageTitle="Account management with Batch Management .NET | Microsoft Azure"
	description="Create, delete, and modify Azure Batch accounts in your applications with the Batch Management .NET library."
	services="batch"
	documentationCenter=".net"
	authors="mmacy"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="batch"
	ms.devlang="multiple"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows"
	ms.workload="big-compute"
	ms.date="11/06/2015"
	ms.author="v-marsma"/>

# Manage Azure Batch accounts and monitor quotas with Batch Management .NET

With the [Batch Management .NET][api_mgmt_net] library, you can add Batch account creation, deletion, key management, and quota discovery to your Azure Batch applications. Lower account maintenance overhead and proactively adjust compute resource allocation based on quota information discovered with the Batch Management API.

- **Create and delete Batch accounts** within any region. If, as an ISV for example, you provide a service for your clients in which each is assigned a separate Batch account for billing purposes, you can add account creation and deletion capabilities to your customer portal.
- **Retrieve and regenerate account keys** programmatically for any of your Batch accounts. This is particularly handy for maintaining compliance with security policies that might enforce the periodic rollover or expiry of account keys. When you have a number of a Batch accounts in various Azure regions, automation of this rollover process will increase your solution's efficiency.
- **Check account quotas** and take the trial-and-error guesswork out of determining which Batch accounts have what limits. By checking your account quotas prior to starting jobs, creating pools, or adding compute nodes, you can proactively adjust where or when these compute resources are created. You can determine which accounts require quota increases prior to the allocation of additional resources in those accounts.
- **Combine features of other Azure services** for a full-featured management experience by leveraging Batch Management .NET, [Azure Active Directory][aad_about], and the [Azure Resource Manager][resman_overview] together in the same application. Using these features and their APIs, you can provide a frictionless authentication experience, creation and deletion of Resource Groups, and the capabilities described above for an end-to-end management solution.

## Create and delete Batch accounts

As mentioned above, one of the primary features of the Batch Management API is to create and delete Batch accounts within an Azure region. To do so, you will use [BatchManagementClient.Accounts.CreateAsync][net_create] and [DeleteAsync][net_delete], or their synchronous counterparts (use of asynchronous methods is always recommended).

The following code snippet creates an account, obtains the newly created account from the Batch service, then deletes it. In this and the other snippets in this article, `batchManagementClient` is a fully initialized instance of [BatchManagementClient][net_mgmt_client].

```
// Create a new Batch account
await batchManagementClient.Accounts.CreateAsync("MyResourceGroup",
	"MyNewAccount",
	new BatchAccountCreateParameters() { Location = "West US" });

// Get the new account from the Batch service
BatchAccountGetResponse getResponse = await batchManagementClient.Accounts.GetAsync("MyResourceGroup", "MyNewAccount");
AccountResource account = getResponse.Resource;

// Delete the account
await batchManagementClient.Accounts.DeleteAsync("MyResourceGroup", account.Name);
```

> [AZURE.NOTE] For an example of creating a fully initialized instance of a [BatchManagementClient][net_mgmt_client], please see the [AccountManagement][acct_mgmt_sample] code sample on GitHub.

## Retrieve and regenerate account keys

Obtain primary and secondary account keys from any Batch account within your subscription by using [ListKeysAsync][net_list_keys], and regenerate those keys with [RegenerateKeyAsync][net_regenerate_keys].

```
// Get and print the primary and secondary keys
BatchAccountListKeyResponse accountKeys = await batchManagementClient.Accounts.ListKeysAsync("MyResourceGroup", "MyBatchAccount");
Console.WriteLine("Primary key:   {0}", accountKeys.PrimaryKey);
Console.WriteLine("Secondary key: {0}", accountKeys.SecondaryKey);

// Regenerate the primary key
BatchAccountRegenerateKeyResponse newKeys = await batchManagementClient.Accounts.RegenerateKeyAsync(
	"MyResourceGroup",
	"MyBatchAccount",
	new BatchAccountRegenerateKeyParameters() { KeyName = AccountKeyType.Primary });
```

> [AZURE.TIP] You can create a streamlined connection workflow for your management applications. First, obtain an account key for the Batch account you wish to manage with [ListKeysAsync][net_list_keys], then use this key when initializing the Batch .NET library's [BatchSharedKeyCredentials][net_sharedkeycred] used when initializing a [BatchClient][net_batch_client].

## Check your Azure subscription and Batch account quotas

Azure subscriptions and the individual Azure services like Batch all have default quotas limiting the number of certain entities within them. The default quotas for Azure subscriptions can be found in [Azure Subscription and Service Limits, Quotas, and Constraints](./../azure-subscription-service-limits.md), and those of the Batch service can be found in [Quotas and limits for the Azure Batch service](batch-quota-limit.md). The Batch Management .NET library provides the ability to check these quotas within your applications, enabling you to make allocation decisions before adding accounts or compute resources like pools and compute nodes.

### Check an Azure subscription for Batch account quotas

Before creating a Batch account in a region, you can check your Azure subscription to see whether you are able to add an account in that region.

In the code snippet below, we first use [BatchManagementClient.Accounts.ListAsync][net_mgmt_listaccounts] to get a collection of all Batch accounts within a subscription. Once we've obtained this collection, we determine how many accounts are in the target region, then use [BatchManagementClient.Subscriptions][net_mgmt_subscriptions] to obtain the Batch account quota and determine how many accounts (if any) can be created in that region.

```
// Get a collection of all Batch accounts within the subscription
BatchAccountListResponse listResponse = await batchManagementClient.Accounts.ListAsync(new AccountListParameters());
IList<AccountResource> accounts = listResponse.Accounts;
Console.WriteLine("Total number of Batch accounts under subscription id {0}:  {1}", context.Subscription.Id, accounts.Count);

// Get a count of all accounts within the target region
string region = "westus";
int accountsInRegion = accounts.Count(o => o.Location == region);

// Get the account quota for the specified region
SubscriptionQuotasGetResponse quotaResponse = await batchManagementClient.Subscriptions.GetSubscriptionQuotasAsync(region);
Console.WriteLine("Account quota for {0} region: {1}", region, quotaResponse.AccountQuota);

// Determine how many accounts can be created in the target region
Console.WriteLine("Accounts in {0}: {1}", region, accountsInRegion);
Console.WriteLine("You can create {0} accounts in the {1} region.", quotaResponse.AccountQuota - accountsInRegion, region);
```

> [AZURE.NOTE] In the above snippet, `context` is an instance of [AzureContext][common_azurecontext]. For more information on obtaining a valid AzureContext, see the [AccountManagement][acct_mgmt_sample] code sample on GitHub.

### Check a Batch account for compute resource quotas

Prior to increasing compute resources within your Batch solution, you can check to ensure that the resources you intend to allocate will not eclipse account quotas that are currently in place. In the code snippet below we print the quota information for the Batch account named `MyBatchAccount`, but in your own application, you could use such information to determine whether the account can handle the additional resources you wish to create.

```
// First obtain the Batch account
BatchAccountGetResponse getResponse = await batchManagementClient.Accounts.GetAsync("MyResourceGroup", "MyBatchAccount");
AccountResource account = getResponse.Resource;

// Now print the compute resource quotas for the account
Console.WriteLine("Core quota: {0}", account.Properties.CoreQuota);
Console.WriteLine("Pool quota: {0}", account.Properties.PoolQuota);
Console.WriteLine("Active job and job schedule quota: {0}", account.Properties.ActiveJobAndJobScheduleQuota);
```

> [AZURE.IMPORTANT] While there are default quotas for Azure subscriptions and services, many of these limits can be raised by issuing a request in the [Azure preview portal][azure_portal]. For example, please see [Quotas and limits for the Azure Batch service](batch-quota-limit.md) for instructions on increasing your Batch account quotas.

## Batch Management .NET, Azure Active Directory, and the Resource Manager

When working with the Batch Management .NET library, you will typically leverage the capabilities of both [Azure Active Directory][aad_about] (AAD) and the [Azure Resource Manager][resman_overview]. The sample project discussed below employs both Azure Active Directory and the Resource Manager while demonstrating the Batch Management .NET API.

### Azure Active Directory

Azure itself uses AAD for the authentication of its users, and in the context of Batch Management .NET, you can use it to authenticate an account administrator and then obtain subscription information for each of the subscriptions within the Azure account.

In the sample project discussed below, the [Microsoft.Azure.Common.Authentication][common_auth] library is used to prompt the user for their Azure credentials. This library acts as convenience wrapper for a number of Azure Active Directory functions, and in the case of the sample project discussed below, is used to initialize an `AzureContext` that is in turn used in creating a `ResourceManagementClient` (see Resource Manager below).

### Resource Manager

When creating Batch accounts with the Batch Management .NET library, you will typically be creating them within a [Resource Group][resman_overview]. You can create the resource group programmatically using the [ResourceManagementClient][resman_client] found within the [Resource Manager .NET][resman_api] library, or you can add an account to an existing resource group you've created previously using the [Azure preview portal][azure_portal].

## Sample project on GitHub

Check out the [AccountManagment][acct_mgmt_sample] sample project on GitHub to see the Batch Management .NET library in action. This console application does the following:

1. Obtain an `AzureContext` by prompting the user for their Azure credentials using the [Microsoft.Azure.Common.Authentication][common_auth] library
2. Create a [ResourceManagementClient][resman_client]
3. Use the ResourceManagementClient to create a resource group
4. Use the [BatchManagementClient][net_mgmt_client] to perform a number of Batch account operations:
  - Create a new Batch account within the newly created resource group
  - Get the newly created account from the Batch service
  - Print the account keys for the new account
  - Regenerate a new primary key for the account
  - Print the quota information for the account
  - Print the quota information for the subscription
  - Print all accounts within the subscription
  - Delete newly created account
5. Delete the resource group

[aad_about]: ../active-directory/active-directory-whatis.md "What is Azure Active Directory?"
[aad_auth_scenarios]: ../active-directory/active-directory-authentication-scenarios.md "Authentication Scenarios for Azure AD"
[acct_mgmt_sample]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/AccountManagement
[api_net]: http://msdn.microsoft.com/library/azure/mt348682.aspx
[api_mgmt_net]: https://msdn.microsoft.com/library/azure/mt463120.aspx
[azure_storage]: https://azure.microsoft.com/services/storage/
[azure_portal]: http://portal.azure.com
[batch_explorer_project]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/BatchExplorer
[common_auth]: https://www.nuget.org/packages/Microsoft.Azure.Common.Authentication
[common_azurecontext]: http://THIS_ASSEMBLY_IS_NOT_ON_MSDN
[net_batch_client]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.batchclient.aspx
[net_list_keys]: https://msdn.microsoft.com/library/azure/microsoft.azure.management.batch.accountoperationsextensions.listkeysasync.aspx
[net_create]: https://msdn.microsoft.com/library/azure/microsoft.azure.management.batch.accountoperationsextensions.createasync.aspx
[net_delete]: https://msdn.microsoft.com/library/azure/microsoft.azure.management.batch.accountoperationsextensions.deleteasync.aspx
[net_regenerate_keys]: https://msdn.microsoft.com/library/azure/microsoft.azure.management.batch.accountoperationsextensions.regeneratekeyasync.aspx
[net_sharedkeycred]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.auth.batchsharedkeycredentials.aspx
[net_mgmt_client]: https://msdn.microsoft.com/library/azure/microsoft.azure.management.batch.batchmanagementclient.aspx
[net_mgmt_subscriptions]: https://msdn.microsoft.com/library/azure/microsoft.azure.management.batch.batchmanagementclient.subscriptions.aspx
[net_mgmt_listaccounts]: https://msdn.microsoft.com/library/azure/microsoft.azure.management.batch.iaccountoperations.listasync.aspx
[resman_client]: https://msdn.microsoft.com/library/azure/microsoft.azure.management.resources.resourcemanagementclient.aspx
[resman_api]: https://msdn.microsoft.com/library/azure/mt418626.aspx
[resman_overview]: ../resource-group-overview.md
[resman_goups]: ../blah.md

[1]: ./media/batch-management-dotnet/image-01.png
