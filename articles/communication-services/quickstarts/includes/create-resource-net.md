---
author: mikben
ms.service: azure-communication-services
ms.topic: include
ms.date: 9/1/2020
ms.author: mikben
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- The latest version [.NET Core SDK](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- Get the latest version of the .NET [Management SDK](../../concepts/sdk-options.md).

## Installing the SDK

First, include the Communication Services Management SDK in your C# project:

```dotnetcli

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

To communicate with Azure Communication Services, you must first authenticate yourself to Azure. You'll usually do this using a service principal identity.

### Option 1: Managed Identity

If your code is running as a service in Azure, the easiest way to authenticate is to acquire a managed identity from Azure. More about managed identities, including
how to enable them on your service, can be found [here](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).

If you've enabled managed identity on your service, you can create a Communication Services management client like this:

```csharp
    using Azure.Identity;
    using Azure.ResourceManager.Communication;
    using System;
    ...
    var subscriptionId = Environment.GetEnvironmentVariable("AZURE_SUBSCRIPTION_ID");
    var acsClient = new CommunicationManagementClient(subscriptionId, new ManagedIdentityCredential());
```

### Option 2: Service Principal

Instead of using a managed identity, you may want to authenticate to Azure using a service principal that you manage yourself. Documentation on creating and managing
a service principal in Azure Active Directory can be found [here](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal).

After you've created your service principal, you'll need to collect the following information about it from the Azure portal:

- **Client ID**
- **Client Secret**
- **Tenant ID**

Store these values in environment variables named `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, and `AZURE_TENANT_ID` respectively. You can then create a Communication Services management client like this:

```csharp
    using Azure.Identity;
    using Azure.ResourceManager.Communication;
    using System;
    ...
    var subscriptionId = Environment.GetEnvironmentVariable("AZURE_SUBSCRIPTION_ID");
    var acsClient = new CommunicationManagementClient(subscriptionId, new EnvironmentCredential());
```

## Managing Communication Services Resources

### Interacting with Azure resources

Now that you're authenticated, you can use your management client to make API calls.

For each of the following examples, we'll be assigning our Communication Services resources to an existing resource group.

If you need to create a resource group, you can do so by using the [Azure portal](https://docs.microsoft.com/azure/azure-resource-manager/management/manage-resource-groups-portal) or the [ARM Management SDK](https://github.com/Azure/azure-sdk-for-net/blob/master/doc/mgmt_preview_quickstart.md).


### Create and manage a Communication Services resource

Our instance of the Communication Services Management SDK client (``Azure.ResourceManager.Communication.CommunicationManagementClient``) can be used to perform operations on Communication Services resources.

#### Create a Communication Services resource

```csharp
    var resourceGroupName = "myResourceGroupName";
    var resourceName = "myResource";
    var resource = new CommunicationServiceResource { Location = "West US" };
    await acsClient.CommunicationService.StartCreateOrUpdateAsync(resourceGroupName, resourceName, resource);
```

#### Update a Communication Services resource

```csharp
    ...
    var resourceGroupName = "myResourceGroupName";
    var resourceName = "myResource";
    var tags = new Dictionary<string,string>();
    tags.Add("environment","test");
    tags.Add("department","tech");
    var resource = new CommunicationServiceResource { Tags = tags };
    // Use existing resource name and new resource object
    await acsClient.CommunicationService.StartCreateOrUpdateAsync(resourceGroupName, resourceName, resource);
```


#### List all Communication Services resources

```csharp
    var resources = acsClient.CommunicationService.ListBySubscription();
    foreach (var resource in resources)
    {
        Console.WriteLine(resource.Name);
    }
```

#### Delete a Communication Services resource

```csharp
    var resourceGroupName = "myResourceGroupName";
    var resourceName = "myResource";
    await acsClient.CommunicationService.StartDeleteAsync(resourceGroupName, resourceName);
```

## Managing keys and connection strings

Every Communication Services resource has a pair of access keys and corresponding connection strings. These keys can be accessed with the Management SDK and then used by other Communication Services SDKs to authenticate themselves to Azure Communication Services.

#### Get access keys for a Communication Services resource

```csharp
    var resourceGroupName = "myResourceGroupName";
    var resourceName = "myResource";
    var keys = await acsClient.CommunicationService.ListKeysAsync(resourceGroupName, resourceName);

    Console.WriteLine(keys.Value.PrimaryConnectionString);
    Console.WriteLine(keys.Value.SecondaryConnectionString);
```

#### Regenerate an access key for a Communication Services resource

```csharp
    var resourceGroupName = "myResourceGroupName";
    var resourceName = "myResource";
    var keyParams = new RegenerateKeyParameters { KeyType = KeyType.Primary };
    var keys = acsClient.CommunicationService.RegenerateKeyAsync(resourceGroupName, resourceGroup, keyParams);

    Console.WriteLine(keys.Value.PrimaryKey);
```



