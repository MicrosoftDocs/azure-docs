---
title: Management libraries - Azure Event Hubs| Microsoft Docs
description: This article provides information on the library that you can use to manage Azure Event Hubs namespaces and entities from .NET.
ms.topic: article
ms.date: 09/06/2022
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-dotnet
---

# Event Hubs management libraries

You can use the Azure Event Hubs management libraries to dynamically provision Event Hubs namespaces and entities. This dynamic nature enables complex deployments and messaging scenarios, so that you can programmatically determine what entities to provision. These libraries are currently available for .NET.

## Supported functionality

* Namespace creation, update, deletion
* Event Hubs creation, update, deletion
* Consumer Group creation, update, deletion

## Prerequisites

To get started using the Event Hubs management libraries, you must authenticate with Microsoft Entra ID. Microsoft Entra ID requires that you authenticate as a service principal, which provides access to your Azure resources. For information about creating a service principal, see one of these articles:  

* [Use the Azure portal to create Active Directory application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md)
* [Use Azure PowerShell to create a service principal to access resources](../active-directory/develop/howto-authenticate-service-principal-powershell.md)
* [Use Azure CLI to create a service principal to access resources](/cli/azure/create-an-azure-service-principal-azure-cli)

These tutorials provide you with an `AppId` (Client ID), `TenantId`, and `ClientSecret` (authentication key), all of which are used for authentication by the management libraries. The Microsoft Entra application must be added to the **Azure Event Hubs Data Owner** role at the resource group level.

## Sample code

The pattern to manipulate any Event Hubs resource follows a common protocol:

1. Obtain a token from Microsoft Entra ID using the `Microsoft.Identity.Client` library.
1. Create the `EventHubManagementClient` object.
1. Then, use the client object to create an Event Hubs namespace and an event hub. 

Here's the sample code to create an Event Hubs namespace and an event hub.

```csharp

namespace event_hub_dotnet_management
{
	using System;
	using System.Threading.Tasks;
	using Microsoft.Azure.ResourceManager.EventHubs;
	using Microsoft.Azure.ResourceManager.EventHubs.Models;
	using Microsoft.Identity.Client;
	using Microsoft.Rest;


	public static class EventHubManagementSample
	{
		private static string resourceGroupName = "<YOUR EXISTING RESOURCE GROUP NAME>";
		private static string namespaceName = "<EVENT HUBS NAMESPACE TO BE CREATED>";
		private const string eventHubName = "<EVENT HUB TO BE CREATED>";
		private const string location = "<REGION>"; //for example: "eastus"

		public static async Task Main()
		{
			// get a token from Azure AD 
			var token = await GetToken();

			// create an EventHubManagementClient 
			var creds = new TokenCredentials(token);
			var ehClient = new EventHubManagementClient(creds)
			{
				SubscriptionId = "<AZURE SUBSCRIPTION ID>"
			};

			// create an Event Hubs namespace using the EventHubManagementClient
			await CreateNamespace(ehClient);

			// create an event hub using the EventHubManagementClient
			await CreateEventHub(ehClient);

			Console.WriteLine("Press a key to exit.");
			Console.ReadLine();
		}

		// Get an authentication token from Azure AD first
		private static async Task<string> GetToken()
		{
			try
			{
				Console.WriteLine("Acquiring token...");

				var tenantId = "<AZURE TENANT ID>";

				// use the Azure AD app that's a member of Azure Event Hubs Data Owner role at the resource group level
				var clientId = "<AZURE APPLICATION'S CLIENT ID>";
				var clientSecret = "<CLIENT SECRET>";

				IConfidentialClientApplication app;

				app = ConfidentialClientApplicationBuilder.Create(clientId)
							.WithClientSecret(clientSecret)
							.WithAuthority($"https://login.microsoftonline.com/{tenantId}")
							.Build();

				var result = await app.AcquireTokenForClient(new[] { $"https://management.core.windows.net/.default" })
					.ExecuteAsync()
					.ConfigureAwait(false);

				// If the token isn't a valid string, throw an error.
				if (string.IsNullOrEmpty(result.AccessToken))
				{
					throw new Exception("Token result is empty!");
				}

				return result.AccessToken;
			}
			catch (Exception e)
			{
				Console.WriteLine("Could not get a new token...");
				Console.WriteLine(e.Message);
				throw e;
			}
		}

		// Create an Event Hubs namespace
		private static async Task CreateNamespace(EventHubManagementClient ehClient)
		{
			try
			{
				Console.WriteLine("Creating namespace...");
				await ehClient.Namespaces.CreateOrUpdateAsync(resourceGroupName, namespaceName, new EHNamespace { Location = location });
				Console.WriteLine("Created namespace successfully.");
			}
			catch (Exception e)
			{
				Console.WriteLine("Could not create a namespace...");
				Console.WriteLine(e.Message);
			}
		}


		// Create an event hub
		private static async Task CreateEventHub(EventHubManagementClient ehClient)
		{
			try
			{
				Console.WriteLine("Creating Event Hub...");
				await ehClient.EventHubs.CreateOrUpdateAsync(resourceGroupName, namespaceName, eventHubName, new Eventhub());
				Console.WriteLine("Created Event Hub successfully.");
			}
			catch (Exception e)
			{
				Console.WriteLine("Could not create an Event Hub...");
				Console.WriteLine(e.Message);
			}
		}
	}
}
```

## Next steps
* [.NET Management sample](https://github.com/Azure-Samples/event-hubs-dotnet-management/)
* [Microsoft.Azure.Management.EventHub Reference](/dotnet/api/Microsoft.Azure.Management.EventHub) 
