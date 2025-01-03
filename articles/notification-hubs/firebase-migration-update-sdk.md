---
title: Updating Azure notification hub with FCMv1 credentials
description: Describes how Azure Notification Hubs can be updated using FCMv1 credentials
author: sreeharir
manager: nanooka
ms.service: azure-notification-hubs
ms.topic: article
ms.date: 09/12/2024
ms.author: sreeharir
ms.reviewer: sethm
ms.lastreviewed: 09/12/2024
---

# Updating Azure Notification Hub with FCMv1 Credentials

This guide explains how to update an Azure notification hub with FCMv1 credentials using the Azure Management SDK for .NET. This is essential for enabling push notifications to Android devices via Firebase Cloud Messaging (FCMv1).

## Prerequisites
- An existing Azure Notification Hub within a namespace.
- FCMv1 credentials including `clientEmail`, `privateKey`, and `projectId`.

### Step 1: Set up and retrieve the Notification Hub
Before you can update the Notification Hub, ensure that you have set up the `ArmClient` and retrieved the relevant Notification Hub resource.

```csharp
ArmClient client = new ArmClient(new DefaultAzureCredential());
SubscriptionResource subscription = client.GetSubscriptionResource(new ResourceIdentifier($"/subscriptions/{subscriptionId}"));
ResourceGroupResource resourceGroup = subscription.GetResourceGroups().Get(resourceGroupName);
NotificationHubNamespaceResource notificationHubNamespaceResource = resourceGroup.GetNotificationHubNamespaces().Get(namespaceName);
NotificationHubResource notificationHubResource = notificationHubNamespaceResource.GetNotificationHubs().Get(notificationHubName);
```

### Step 2: Define and update FCMv1 credentials
Next, create an `FcmV1Credential` object with your FCMv1 details and use it to update the Notification Hub.

```csharp
NotificationHubUpdateContent updateContent = new()
{
    FcmV1Credential = new FcmV1Credential("clientEmail", "privateKey", "projectid")
};

NotificationHubResource updatedNotificationHub = await notificationHubResource.UpdateAsync(updateContent);
Console.WriteLine($"Notification Hub '{notificationHubName}' updated successfully with FCMv1 credentials.");
```

### Step 3: Verify the update
After updating, you can verify the credentials by retrieving and printing them.

```csharp
var notificationHubCredentials = updatedNotificationHub.GetPnsCredentials().Value;
Console.WriteLine($"FCMv1 Credentials Email: '{notificationHubCredentials.FcmV1Credential.ClientEmail}'");
```

This step confirms that the Notification Hub has been updated with the correct FCMv1 credentials.

## Complete code example
Below is the complete code example that includes the setup, creation, update, and verification of the Notification Hub.

```csharp
using Azure;
using Azure.Core;
using Azure.Identity;
using Azure.ResourceManager;
using Azure.ResourceManager.NotificationHubs;
using Azure.ResourceManager.NotificationHubs.Models;
using Azure.ResourceManager.Resources;

class Program
{
    static async Task Main(string[] args)
    {
        string subscriptionId = "<Replace with your subscriptionid>";
        string resourceGroupName = "<Replace with your resourcegroupname>";
        string location = "<Replace with your location>";
        string namespaceName = "<Replace with your notificationhubnamespacename>";
        string notificationHubName = "<Replace with your notificationhubname>";

        Console.WriteLine("Started Program");
        ArmClient client = new ArmClient(new DefaultAzureCredential());
        SubscriptionResource subscription = client.GetSubscriptionResource(new ResourceIdentifier($"/subscriptions/{subscriptionId}"));

        // Create or get the resource group
        ResourceGroupCollection resourceGroups = subscription.GetResourceGroups();
        ResourceGroupResource? resourceGroup = null;
        bool resourceGroupExists = resourceGroups.Exists(resourceGroupName);
        if (!resourceGroupExists)
        {
            ArmOperation<ResourceGroupResource> operation = await resourceGroups.CreateOrUpdateAsync(WaitUntil.Completed, resourceGroupName, new ResourceGroupData(location));
            resourceGroup = operation.Value;
            Console.WriteLine($"ResourceGroup '{resourceGroupName}' created successfully.");
        }
        else
        {
            resourceGroup = resourceGroups.Get(resourceGroupName);
            Console.WriteLine($"ResourceGroup '{resourceGroupName}' already exists.");
        }

        // Create or get a Notification Hub namespace with the required SKU
        NotificationHubNamespaceData namespaceData = new NotificationHubNamespaceData(location)
        {
            Sku = new NotificationHubSku(NotificationHubSkuName.Standard)
        };

        NotificationHubNamespaceCollection notificationHubNamespaces = resourceGroup.GetNotificationHubNamespaces();
        NotificationHubNamespaceResource? notificationHubNamespaceResource = null;
        bool notificationHubNamespaceResourceExists = notificationHubNamespaces.Exists(namespaceName);
        if (!notificationHubNamespaceResourceExists)
        {
            ArmOperation<NotificationHubNamespaceResource> namespaceOperation = await notificationHubNamespaces.CreateOrUpdateAsync(WaitUntil.Completed, namespaceName, namespaceData);
            notificationHubNamespaceResource = namespaceOperation.Value;
            Console.WriteLine($"Notification Hub Namespace '{namespaceName}' created successfully.");
        }
        else
        {
            notificationHubNamespaceResource = notificationHubNamespaces.Get(namespaceName);
            Console.WriteLine($"NotificationHubNamespace '{namespaceName}' already exists.");
        }

        // Create or get a Notification Hub in the namespace
        NotificationHubCollection notificationHubs = notificationHubNamespaceResource.GetNotificationHubs();
        NotificationHubResource? notificationHubResource = null;
        bool notificationHubResourceExists = notificationHubs.Exists(notificationHubName);
        if (!notificationHubResourceExists)
        {
            ArmOperation<NotificationHubResource> hubOperation = await notificationHubs.CreateOrUpdateAsync(WaitUntil.Completed, notificationHubName, new NotificationHubData(location));
            notificationHubResource = hubOperation.Value;
            Console.WriteLine($"Notification Hub '{notificationHubName}' created successfully in Namespace '{namespaceName}'.");
        }
        else
        {
            notificationHubResource = notificationHubs.Get(notificationHubName);
            Console.WriteLine($"NotificationHub '{notificationHubName}' already exists.");
        }

        // Update the Notification Hub with FCMv1 credentials
        NotificationHubUpdateContent updateContent = new()
        {
            FcmV1Credential = new FcmV1Credential("<Replace with your clientEmail>", "<Replace with your privateKey>", "<Replace with your projectid>")
        };

        NotificationHubResource notificationHubResource = await notificationHubResource.UpdateAsync(updateContent);
        Console.WriteLine($"Notification Hub '{notificationHubName}' updated successfully with FCMv1 credentials.");

        // Get Notification Hub Credentials
        var notificationHubCredentials = notificationHubResource.GetPnsCredentials().Value;
        Console.WriteLine($"FCMv1 Credentials Email '{notificationHubCredentials.FcmV1Credential.ClientEmail}'");
    }
}
```
