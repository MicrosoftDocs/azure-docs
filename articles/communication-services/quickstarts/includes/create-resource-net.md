---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 06/30/2021
ms.author: rifox
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- The latest version [.NET Core SDK](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- Get the latest version of the [.NET Identity SDK](/dotnet/api/azure.identity).
- Get the latest version of the [.NET Management SDK](../../concepts/sdk-options.md).

If you're planning on using phone numbers, you can't use the free trial account. Check that your subscription meets all the [requirements](../../concepts/telephony/plan-solution.md) if you plan to purchase phone numbers before creating your resource. 

## Installing the SDK

First, include the Communication Services Management SDK in your C# project:

```csharp
using Azure.ResourceManager.Communication;
```

## Subscription ID

You need to know the ID of your Azure subscription. This can be acquired from the portal:

1.  Sign in into your account on the [Azure portal](https://portal.azure.com).
2.  From the left sidebar, select **Subscriptions**.
3.  Select the subscription you want to use.
4.  Click **Overview**.
5.  Select your Subscription ID.

For the examples in this quickstart to work, you need to store your subscription ID in an environment variable called `AZURE_SUBSCRIPTION_ID`.

## Authentication

To communicate with Azure Communication Services, you must first authenticate yourself to Azure. You'll usually do this using a service principal identity.

### Option 1: Managed Identity

If your code is running as a service in Azure, the easiest way to authenticate is to acquire a managed identity from Azure. For more information, see:

- [Managed identities overview](/entra/identity/managed-identities-azure-resources/overview)

- [Azure services that support Managed Identities](/entra/identity/managed-identities-azure-resources/managed-identities-status)

- [How to use managed identities for App Service and Azure Functions](../../../app-service/overview-managed-identity.md?tabs=dotnet)

#### [System-assigned Managed Identity](../../../app-service/overview-managed-identity.md?tabs=dotnet#add-a-system-assigned-identity)

```csharp
using Azure.Identity;
using Azure.ResourceManager.Communication;
using Azure.ResourceManager.Communication.Models;
using System;
...
var subscriptionId = "AZURE_SUBSCRIPTION_ID";
var acsClient = new CommunicationManagementClient(subscriptionId, new ManagedIdentityCredential());
```

#### [User-assigned Managed Identity](../../../app-service/overview-managed-identity.md?tabs=dotnet#add-a-user-assigned-identity)

ClientId of the managed identity that you created must be passed to the `ManagedIdentityCredential` explicitly.

```csharp
using Azure.Identity;
using Azure.ResourceManager.Communication;
using Azure.ResourceManager.Communication.Models;
using System;
...
var subscriptionId = "AZURE_SUBSCRIPTION_ID";
var managedIdentityCredential = new ManagedIdentityCredential("AZURE_CLIENT_ID");
var acsClient = new CommunicationManagementClient(subscriptionId, managedIdentityCredential);
```

### Option 2: Service Principal

Instead of using a managed identity, you may want to authenticate to Azure using a service principal that you manage yourself. For more information, see [creating and managing a service principal in Microsoft Entra ID](/entra/identity-platform/howto-create-service-principal-portal).

After you create your service principal, you need to collect the following information about it from the Azure portal:

- **Client ID**
- **Client Secret**
- **Tenant ID**

Store these values as environment variables named `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, and `AZURE_TENANT_ID`, respectively. You can then create a Communication Services management client like this:

```csharp
using Azure.Identity;
using Azure.ResourceManager.Communication;
using Azure.ResourceManager.Communication.Models;
using System;
...
var subscriptionId = Environment.GetEnvironmentVariable("AZURE_SUBSCRIPTION_ID");
var acsClient = new CommunicationManagementClient(subscriptionId, new EnvironmentCredential());
```

### Option 3: User Identity

If you want to call Azure on behalf of an interactive user, rather than using a service identity, you can use the following code to create an Azure Communication Services Management client. This opens a browser window to prompt the user for their MSA or Microsoft Entra credentials.

```csharp
using Azure.Identity;
using Azure.ResourceManager.Communication;
using Azure.ResourceManager.Communication.Models;
using System;
...
var subscriptionId = Environment.GetEnvironmentVariable("AZURE_SUBSCRIPTION_ID");
var communicationServiceClient = new CommunicationManagementClient(subscriptionId, new InteractiveBrowserCredential());
```

## Managing Communication Services Resources

### Interacting with Azure resources

Now that you're authenticated, you can use your management client to make API calls.

For each of the following examples, we assign our Communication Services resources to an existing resource group.

If you need to create a resource group, you can do so by using the [Azure portal](../../../azure-resource-manager/management/manage-resource-groups-portal.md) or the [Azure Resource Manager SDK](https://github.com/Azure/azure-sdk-for-net/blob/master/doc/mgmt_preview_quickstart.md).

### Create and manage a Communication Services resource

You can use the instance of the Communication Services Management SDK client (``Azure.ResourceManager.Communication.CommunicationManagementClient``) to perform operations on Communication Services resources.

#### Create a Communication Services resource

When creating a Communication Services resource, specify the resource group name and resource name. The `Location` property is always `global`, and during public preview the `DataLocation` value must be `UnitedStates`.

```csharp
var resourceGroupName = "myResourceGroupName";
var resourceName = "myResource";
var resource = new CommunicationServiceResource { Location = "Global", DataLocation = "UnitedStates"  };
var operation = await acsClient.CommunicationService.StartCreateOrUpdateAsync(resourceGroupName, resourceName, resource);
await operation.WaitForCompletionAsync();
```

#### Update a Communication Services resource

```csharp
...
var resourceGroupName = "myResourceGroupName";
var resourceName = "myResource";
var resource = new CommunicationServiceResource { Location = "Global", DataLocation = "UnitedStates" };
resource.Tags.Add("environment","test");
resource.Tags.Add("department","tech");
// Use existing resource name and new resource object
var operation = await acsClient.CommunicationService.StartCreateOrUpdateAsync(resourceGroupName, resourceName, resource);
await operation.WaitForCompletionAsync();
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

Every Communication Services resource has a pair of access keys and corresponding connection strings. You can access these keys using the Management SDK and then make them available to other Communication Services SDKs to authenticate themselves to Azure Communication Services.

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
var keys = await acsClient.CommunicationService.RegenerateKeyAsync(resourceGroupName, resourceName, keyParams);

Console.WriteLine(keys.Value.PrimaryKey);
```
