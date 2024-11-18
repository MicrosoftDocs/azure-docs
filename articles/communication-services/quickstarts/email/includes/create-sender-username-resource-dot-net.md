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

## Installing the SDK

First, include the Communication Services Management SDK in your C# project:

```csharp
using Azure.ResourceManager.Communication;
```

## Subscription ID

You need to know the ID of your Azure subscription. This can be acquired from the portal:

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

For each of the following examples, we'll be assigning our Sender Username resources to an existing Domain resource.

If you need to create an Email Communication Service, you can do so by using the [Azure portal](../../../../communication-services/quickstarts/email/create-email-communication-resource.md) and to create a Domain resource, you can do so by using the [Azure portal](../../../../communication-services/quickstarts/email/add-custom-verified-domains.md).

## Create a Sender Username resource

When creating a Sender Username resource, you have to specify the resource group name, Email Communication Service name, Domain name and resource name.

```csharp
// this example assumes you already have this CommunicationDomainResource created on azure
// for more information of creating CommunicationDomainResource, please refer to the document of CommunicationDomainResource
string subscriptionId = "11112222-3333-4444-5555-666677778888";
string resourceGroupName = "contosoResourceGroup";
string emailServiceName = "contosoEmailService";
string domainName = "contoso.com";
ResourceIdentifier communicationDomainResourceId = CommunicationDomainResource.CreateResourceIdentifier(subscriptionId, resourceGroupName, emailServiceName, domainName);
CommunicationDomainResource communicationDomainResource = client.GetCommunicationDomainResource(communicationDomainResourceId);

// get the collection of this SenderUsernameResource
SenderUsernameResourceCollection collection = communicationDomainResource.GetSenderUsernameResources();

// invoke the operation
string senderUsername = "contosoNewsAlerts";
SenderUsernameResourceData data = new SenderUsernameResourceData()
{
    Username = "contosoNewsAlerts",
    DisplayName = "Contoso News Alerts",
};
ArmOperation<SenderUsernameResource> lro = await collection.CreateOrUpdateAsync(WaitUntil.Completed, senderUsername, data);
SenderUsernameResource result = lro.Value;

// the variable result is a resource, you could call other operations on this instance as well
// but just for demo, we get its data from this resource instance
SenderUsernameResourceData resourceData = result.Data;
// for demo we just print out the id
Console.WriteLine($"Succeeded on id: {resourceData.Id}");
```
## Managing Sender Username Resources

### List by Domain resource

```csharp
// this example assumes you already have this CommunicationDomainResource created on azure
// for more information of creating CommunicationDomainResource, please refer to the document of CommunicationDomainResource
string subscriptionId = "11112222-3333-4444-5555-666677778888";
string resourceGroupName = "contosoResourceGroup";
string emailServiceName = "contosoEmailService";
string domainName = "contoso.com";
ResourceIdentifier communicationDomainResourceId = CommunicationDomainResource.CreateResourceIdentifier(subscriptionId, resourceGroupName, emailServiceName, domainName);
CommunicationDomainResource communicationDomainResource = client.GetCommunicationDomainResource(communicationDomainResourceId);

// get the collection of this SenderUsernameResource
SenderUsernameResourceCollection collection = communicationDomainResource.GetSenderUsernameResources();

// invoke the operation and iterate over the result
await foreach (SenderUsernameResource item in collection.GetAllAsync())
{
    // the variable item is a resource, you could call other operations on this instance as well
    // but just for demo, we get its data from this resource instance
    SenderUsernameResourceData resourceData = item.Data;
    // for demo we just print out the id
    Console.WriteLine($"Succeeded on id: {resourceData.Id}");
}

Console.WriteLine($"Succeeded");
```
### Get Sender Username

```csharp
// this example assumes you already have this CommunicationDomainResource created on azure
// for more information of creating CommunicationDomainResource, please refer to the document of CommunicationDomainResource
string subscriptionId = "11112222-3333-4444-5555-666677778888";
string resourceGroupName = "contosoResourceGroup";
string emailServiceName = "contosoEmailService";
string domainName = "contoso.com";
ResourceIdentifier communicationDomainResourceId = CommunicationDomainResource.CreateResourceIdentifier(subscriptionId, resourceGroupName, emailServiceName, domainName);
CommunicationDomainResource communicationDomainResource = client.GetCommunicationDomainResource(communicationDomainResourceId);

// get the collection of this SenderUsernameResource
SenderUsernameResourceCollection collection = communicationDomainResource.GetSenderUsernameResources();

// invoke the operation
string senderUsername = "contosoNewsAlerts";
bool result = await collection.ExistsAsync(senderUsername);

Console.WriteLine($"Succeeded: {result}");
```

### Clean up a Sender Username resource

```csharp
// this example assumes you already have this SenderUsernameResource created on azure
// for more information of creating SenderUsernameResource, please refer to the document of SenderUsernameResource
string subscriptionId = "11112222-3333-4444-5555-666677778888";
string resourceGroupName = "MyResourceGroup";
string emailServiceName = "MyEmailServiceResource";
string domainName = "contoso.com";
string senderUsername = "contosoNewsAlerts";
ResourceIdentifier senderUsernameResourceId = SenderUsernameResource.CreateResourceIdentifier(subscriptionId, resourceGroupName, emailServiceName, domainName, senderUsername);
SenderUsernameResource senderUsernameResource = client.GetSenderUsernameResource(senderUsernameResourceId);

// invoke the operation
await senderUsernameResource.DeleteAsync(WaitUntil.Completed);

Console.WriteLine($"Succeeded");
```

> [!NOTE]
> Resource deletion is **permanent** and no data, including event grid filters, phone numbers, or other data tied to your resource, can be recovered if you delete the resource.