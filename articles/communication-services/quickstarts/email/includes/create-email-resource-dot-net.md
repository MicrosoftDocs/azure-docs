---
author: v-vprasannak
ms.service: azure-communication-services
ms.topic: include
ms.date: 04/26/2024
ms.author: v-vprasannak
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- The latest version [.NET Core SDK](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- Get the latest version of the [.NET Identity SDK](/dotnet/api/azure.identity).
- Get the latest version of the [.NET Management SDK](../../../concepts/sdk-options.md).

## Installing the SDK

First, include the Communication Services Management SDK in your C# project:

```csharp
using Azure.ResourceManager.Communication;
```

## Subscription ID

You'll need to know the ID of your Azure subscription. This can be acquired from the portal:

1.  Login into your Azure account
2.  Select Subscriptions in the left sidebar
3.  Select whichever subscription is needed
4.  Click on Overview
5.  Select your Subscription ID

In this quickstart, we'll assume that you've stored the subscription ID in an environment variable called `AZURE_SUBSCRIPTION_ID`.

## Authentication

To communicate with Azure Communication Services, you must first authenticate yourself to Azure.

### Authenticate the Client

The default option to create an authenticated client is to use DefaultAzureCredential. Since all management APIs go through the same endpoint, in order to interact with resources, only one top-level ArmClient has to be created.

To authenticate to Azure and create an ArmClient, do the following code:

```csharp
using System;
using System.Threading.Tasks;
using Azure;
using Azure.Core;
using Azure.Identity;
using Azure.ResourceManager;
using Azure.ResourceManager.Communication;
using Azure.ResourceManager.Resources;
...
// get your azure access token, for more details of how Azure SDK get your access token, please refer to https://learn.microsoft.com/dotnet/azure/sdk/authentication?tabs=command-line
TokenCredential cred = new DefaultAzureCredential();
// authenticate your client
ArmClient client = new ArmClient(cred);
```

## Interacting with Azure resources

Now that you're authenticated.

For each of the following examples, we'll be assigning our Email Services resources to an existing resource group.

If you need to create a resource group, you can do so by using the [Azure portal](../../../../azure-resource-manager/management/manage-resource-groups-portal.md) or the [Azure Resource Manager SDK](https://github.com/Azure/azure-sdk-for-net/blob/master/doc/mgmt_preview_quickstart.md).

## Create an Email Services resource

When creating an Email Services resource, you'll specify the resource group name and resource name. 
>[!Note]
>The `Location` property is always `global`, and during public preview the `DataLocation` value must be `UnitedStates`.

```csharp
// this example assumes you already have this ResourceGroupResource created on azure
// for more information of creating ResourceGroupResource, please refer to the document of ResourceGroupResource
string subscriptionId = "11112222-3333-4444-5555-666677778888";
string resourceGroupName = "MyResourceGroup";
ResourceIdentifier resourceGroupResourceId = ResourceGroupResource.CreateResourceIdentifier(subscriptionId, resourceGroupName);
ResourceGroupResource resourceGroupResource = client.GetResourceGroupResource(resourceGroupResourceId);

// get the collection of this EmailServiceResource
EmailServiceResourceCollection collection = resourceGroupResource.GetEmailServiceResources();

// invoke the operation
string emailServiceName = "MyEmailServiceResource";
EmailServiceResourceData data = new EmailServiceResourceData(new AzureLocation("Global"))
{
    DataLocation = "United States",
};
ArmOperation<EmailServiceResource> lro = await collection.CreateOrUpdateAsync(WaitUntil.Completed, emailServiceName, data);
EmailServiceResource result = lro.Value;

// the variable result is a resource, you could call other operations on this instance as well
// but just for demo, we get its data from this resource instance
EmailServiceResourceData resourceData = result.Data;
// for demo we just print out the id
Console.WriteLine($"Succeeded on id: {resourceData.Id}");
```

## Manage your Email Communication Services resource

### Update an Email Communication Services resource

```csharp
...
// this example assumes you already have this EmailServiceResource created on azure
// for more information of creating EmailServiceResource, please refer to the document of EmailServiceResource
string subscriptionId = "11112222-3333-4444-5555-666677778888";
string resourceGroupName = "MyResourceGroup";
string emailServiceName = "MyEmailServiceResource";
ResourceIdentifier emailServiceResourceId = EmailServiceResource.CreateResourceIdentifier(subscriptionId, resourceGroupName, emailServiceName);
EmailServiceResource emailServiceResource = client.GetEmailServiceResource(emailServiceResourceId);

// invoke the operation
EmailServiceResourcePatch patch = new EmailServiceResourcePatch()
{
    Tags =
    {
    ["newTag"] = "newVal",
    },
};
ArmOperation<EmailServiceResource> lro = await emailServiceResource.UpdateAsync(WaitUntil.Completed, patch);
EmailServiceResource result = lro.Value;

// the variable result is a resource, you could call other operations on this instance as well
// but just for demo, we get its data from this resource instance
EmailServiceResourceData resourceData = result.Data;
// for demo we just print out the id
Console.WriteLine($"Succeeded on id: {resourceData.Id}");
```

### List all Email Communication Service resources by resource group

```csharp
// this example assumes you already have this ResourceGroupResource created on azure
// for more information of creating ResourceGroupResource, please refer to the document of ResourceGroupResource
string subscriptionId = "11112222-3333-4444-5555-666677778888";
string resourceGroupName = "MyResourceGroup";
ResourceIdentifier resourceGroupResourceId = ResourceGroupResource.CreateResourceIdentifier(subscriptionId, resourceGroupName);
ResourceGroupResource resourceGroupResource = client.GetResourceGroupResource(resourceGroupResourceId);

// get the collection of this EmailServiceResource
EmailServiceResourceCollection collection = resourceGroupResource.GetEmailServiceResources();

// invoke the operation and iterate over the result
await foreach (EmailServiceResource item in collection.GetAllAsync())
{
    // the variable item is a resource, you could call other operations on this instance as well
    // but just for demo, we get its data from this resource instance
    EmailServiceResourceData resourceData = item.Data;
    // for demo we just print out the id
    Console.WriteLine($"Succeeded on id: {resourceData.Id}");
}

Console.WriteLine($"Succeeded");
```

### List all Email Communication Service resources by subscription

```csharp
// this example assumes you already have this SubscriptionResource created on azure
// for more information of creating SubscriptionResource, please refer to the document of SubscriptionResource
string subscriptionId = "11112222-3333-4444-5555-666677778888";
ResourceIdentifier subscriptionResourceId = SubscriptionResource.CreateResourceIdentifier(subscriptionId);
SubscriptionResource subscriptionResource = client.GetSubscriptionResource(subscriptionResourceId);

// invoke the operation and iterate over the result
await foreach (EmailServiceResource item in subscriptionResource.GetEmailServiceResourcesAsync())
{
    // the variable item is a resource, you could call other operations on this instance as well
    // but just for demo, we get its data from this resource instance
    EmailServiceResourceData resourceData = item.Data;
    // for demo we just print out the id
    Console.WriteLine($"Succeeded on id: {resourceData.Id}");
}

Console.WriteLine($"Succeeded");
```

## Clean up resource

```csharp
// this example assumes you already have this EmailServiceResource created on azure
// for more information of creating EmailServiceResource, please refer to the document of EmailServiceResource
string subscriptionId = "11112222-3333-4444-5555-666677778888";
string resourceGroupName = "MyResourceGroup";
string emailServiceName = "MyEmailServiceResource";
ResourceIdentifier emailServiceResourceId = EmailServiceResource.CreateResourceIdentifier(subscriptionId, resourceGroupName, emailServiceName);
EmailServiceResource emailServiceResource = client.GetEmailServiceResource(emailServiceResourceId);

// invoke the operation
await emailServiceResource.DeleteAsync(WaitUntil.Completed);

Console.WriteLine($"Succeeded");
```
> [!NOTE]
> Resource deletion is **permanent** and no data, including event grid filters, phone numbers, or other data tied to your resource, can be recovered if you delete the resource.