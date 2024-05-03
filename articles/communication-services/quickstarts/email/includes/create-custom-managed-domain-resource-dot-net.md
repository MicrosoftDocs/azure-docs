---
author: v-vprasannak
ms.service: azure-communication-services
ms.topic: include
ms.date: 04/14/2024
ms.author: v-vprasannak
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- The latest version [.NET Core SDK](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- Get the latest version of the [.NET Identity SDK](/dotnet/api/azure.identity).
- Get the latest version of the [.NET Management SDK](../../../concepts/sdk-options.md).

## Provision a custom domain

To provision a custom domain, you need to:
    
* Verify the custom domain ownership by adding a TXT record in your Domain Name System (DNS).
* Configure the sender authentication by adding Sender Policy Framework (SPF) and DomainKeys Identified Mail (DKIM) records.

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

To communicate with Domain resource, you must first authenticate yourself to Azure.

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

For each of the following examples, we'll be assigning our Domain resources to an existing Email communication service.

If you need to create an Email Communication Service, you can do so by using the [Azure portal](../../../../communication-services/quickstarts/email/create-email-communication-resource.md). 

## Create a Domain resource

When creating a Domain resource, you'll specify the resource group name, Email Communication Service name, resource name and DomainManagement.

> [!NOTE]
> The `Location` property is always `global`.

```csharp
// this example assumes you already have this EmailServiceResource created on azure
// for more information of creating EmailServiceResource, please refer to the document of EmailServiceResource
string subscriptionId = "11112222-3333-4444-5555-666677778888";
string resourceGroupName = "MyResourceGroup";
string emailServiceName = "MyEmailServiceResource";
ResourceIdentifier emailServiceResourceId = EmailServiceResource.CreateResourceIdentifier(subscriptionId, resourceGroupName, emailServiceName);
EmailServiceResource emailServiceResource = client.GetEmailServiceResource(emailServiceResourceId);

// get the collection of this CommunicationDomainResource
CommunicationDomainResourceCollection collection = emailServiceResource.GetCommunicationDomainResources();

// invoke the operation
string domainName = "contoso.com";
CommunicationDomainResourceData data = new CommunicationDomainResourceData(new AzureLocation("Global"))
{
    DomainManagement = DomainManagement.CustomerManaged,
};
ArmOperation<CommunicationDomainResource> lro = await collection.CreateOrUpdateAsync(WaitUntil.Completed, domainName, data);            
CommunicationDomainResource result = lro.Value;

// the variable result is a resource, you could call other operations on this instance as well
// but just for demo, we get its data from this resource instance
CommunicationDomainResourceData resourceData = result.Data;
// for demo we just print out the id
Console.WriteLine($"Succeeded on id: {resourceData.Id}");
```

## Manage your Domain Resources

### Update a Domain resource

```csharp
...
// this example assumes you already have this CommunicationDomainResource created on azure
// for more information of creating CommunicationDomainResource, please refer to the document of CommunicationDomainResource
string subscriptionId = "11112222-3333-4444-5555-666677778888";
string resourceGroupName = "MyResourceGroup";
string emailServiceName = "MyEmailServiceResource";
string domainName = "contoso.com";
ResourceIdentifier communicationDomainResourceId = CommunicationDomainResource.CreateResourceIdentifier(subscriptionId, resourceGroupName, emailServiceName, domainName);
CommunicationDomainResource communicationDomainResource = client.GetCommunicationDomainResource(communicationDomainResourceId);

// invoke the operation
CommunicationDomainResourcePatch patch = new CommunicationDomainResourcePatch()
{
    UserEngagementTracking = UserEngagementTracking.Enabled,
};
ArmOperation<CommunicationDomainResource> lro = await communicationDomainResource.UpdateAsync(WaitUntil.Completed, patch);
CommunicationDomainResource result = lro.Value;

// the variable result is a resource, you could call other operations on this instance as well
// but just for demo, we get its data from this resource instance
CommunicationDomainResourceData resourceData = result.Data;
// for demo we just print out the id
Console.WriteLine($"Succeeded on id: {resourceData.Id}");
```

### List by Email Service

```csharp
// this example assumes you already have this EmailServiceResource created on azure
// for more information of creating EmailServiceResource, please refer to the document of EmailServiceResource
string subscriptionId = "11112222-3333-4444-5555-666677778888";
string resourceGroupName = "MyResourceGroup";
string emailServiceName = "MyEmailServiceResource";
ResourceIdentifier emailServiceResourceId = EmailServiceResource.CreateResourceIdentifier(subscriptionId, resourceGroupName, emailServiceName);
EmailServiceResource emailServiceResource = client.GetEmailServiceResource(emailServiceResourceId);

// get the collection of this CommunicationDomainResource
CommunicationDomainResourceCollection collection = emailServiceResource.GetCommunicationDomainResources();

// invoke the operation and iterate over the result
await foreach (CommunicationDomainResource item in collection.GetAllAsync())
{
    // the variable item is a resource, you could call other operations on this instance as well
    // but just for demo, we get its data from this resource instance
    CommunicationDomainResourceData resourceData = item.Data;
    // for demo we just print out the id
    Console.WriteLine($"Succeeded on id: {resourceData.Id}");
}

Console.WriteLine($"Succeeded");
```

### Get Domain resource

```csharp
// this example assumes you already have this EmailServiceResource created on azure
// for more information of creating EmailServiceResource, please refer to the document of EmailServiceResource
string subscriptionId = "11112222-3333-4444-5555-666677778888";
string resourceGroupName = "MyResourceGroup";
string emailServiceName = "MyEmailServiceResource";
ResourceIdentifier emailServiceResourceId = EmailServiceResource.CreateResourceIdentifier(subscriptionId, resourceGroupName, emailServiceName);
EmailServiceResource emailServiceResource = client.GetEmailServiceResource(emailServiceResourceId);

// get the collection of this CommunicationDomainResource
CommunicationDomainResourceCollection collection = emailServiceResource.GetCommunicationDomainResources();

// invoke the operation
string domainName = "contoso.com";
bool result = await collection.ExistsAsync(domainName);

Console.WriteLine($"Succeeded: {result}");
```

## Verification operation for your Domain resource

To configure sender authentication for your domains, refer Configure sender authentication for custom domain section from the Azure portal tab.

### Initiate Verification

```csharp
// this example assumes you already have this CommunicationDomainResource created on azure
// for more information of creating CommunicationDomainResource, please refer to the document of CommunicationDomainResource
string subscriptionId = "11112222-3333-4444-5555-666677778888";
string resourceGroupName = "MyResourceGroup";
string emailServiceName = "MyEmailServiceResource";
string domainName = "contoso.com";
ResourceIdentifier communicationDomainResourceId = CommunicationDomainResource.CreateResourceIdentifier(subscriptionId, resourceGroupName, emailServiceName, domainName);
CommunicationDomainResource communicationDomainResource = client.GetCommunicationDomainResource(communicationDomainResourceId);

// invoke the operation
DomainsRecordVerificationContent content = new DomainsRecordVerificationContent(DomainRecordVerificationType.Spf);
await communicationDomainResource.InitiateVerificationAsync(WaitUntil.Completed, content);

Console.WriteLine($"Succeeded");
```

### Cancel Verification

```csharp
// this example assumes you already have this CommunicationDomainResource created on azure
// for more information of creating CommunicationDomainResource, please refer to the document of CommunicationDomainResource
string subscriptionId = "11112222-3333-4444-5555-666677778888";
string resourceGroupName = "MyResourceGroup";
string emailServiceName = "MyEmailServiceResource";
string domainName = "contoso.com";
ResourceIdentifier communicationDomainResourceId = CommunicationDomainResource.CreateResourceIdentifier(subscriptionId, resourceGroupName, emailServiceName, domainName);
CommunicationDomainResource communicationDomainResource = client.GetCommunicationDomainResource(communicationDomainResourceId);

// invoke the operation
DomainsRecordVerificationContent content = new DomainsRecordVerificationContent(DomainRecordVerificationType.Spf);
await communicationDomainResource.CancelVerificationAsync(WaitUntil.Completed, content);

Console.WriteLine($"Succeeded");
```


## Clean up a Domain resource

```csharp
// this example assumes you already have this CommunicationDomainResource created on azure
// for more information of creating CommunicationDomainResource, please refer to the document of CommunicationDomainResource
string subscriptionId = "11112222-3333-4444-5555-666677778888";
string resourceGroupName = "MyResourceGroup";
string emailServiceName = "MyEmailServiceResource";
string domainName = "contoso.com";
ResourceIdentifier communicationDomainResourceId = CommunicationDomainResource.CreateResourceIdentifier(subscriptionId, resourceGroupName, emailServiceName, domainName);
CommunicationDomainResource communicationDomainResource = client.GetCommunicationDomainResource(communicationDomainResourceId);

// invoke the operation
await communicationDomainResource.DeleteAsync(WaitUntil.Completed);

Console.WriteLine($"Succeeded");
```

> [!NOTE]
> Resource deletion is **permanent** and no data, including event grid filters, phone numbers, or other data tied to your resource, can be recovered if you delete the resource.