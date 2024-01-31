---
author: pgrandhi
ms.service: azure-communication-services
ms.topic: include
ms.date: 01/28/2024
ms.author: pgrandhi
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- The latest version [.NET Core SDK](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- Get the latest version of the [.NET Microsoft Azure EventGrid Management SDK](/azure/event-grid/sdk-overview).
- Setup a way to authenticate to Azure with [Azure Identity](dotnet/api/overview/azure/identity-readme) library as described below.
- An [Azure Communication Services resource](../../create-communication-resource.md).

## Retreiving Communication Services ResourceId
You will need to know the resourceId of your Azure Commmunication Services resource. This can be acquired from the portal:

1. Login into your Azure account
2. Select Resources in the left sidebar
3. Select your Azure Communication Services resource
4. Click on Overview and click on **JSON View**
    :::image type="content" source="../media/subscribe-through-portal/resource-json-view.png" alt-text="Screenshot highlighting the JSON View button in the Overview tab in the Azure portal.":::
5. Select the Copy button to copy the resourceId 
    :::image type="content" source="../media/subscribe-through-portal/communication-services-resourceid.png" alt-text="Screenshot highlighting the ResourceID button in the JSON View in the Azure portal.":::

## Installing the SDK

First, install the Microsoft Azure Event Grid Management library for .NET with [NuGet](https://www.nuget.org/):

```csharp
dotnet add package Azure.ResourceManager.EventGrid;
```
1. Include the Communication Services Management SDK in your C# project:

```csharp
using Microsoft.Azure.Management.EventGrid;
using Microsoft.Azure.Management.EventGrid.Models;
```

## Authenticating with Azure Identity library

### Prerequisites:
1. Create a Microsoft Entra application and Service Principal that can access the resources in your subscription by following the instructions [here](/entra/identity-platform/howto-create-service-principal-portal).
2. Create a new Client secret or upload a trusted certificate issued by a certificate authority following the instructions above.
3. Give contributor or owner access to the subscription to that application following the instructions [here](/azure/role-based-access-control/quickstart-assign-role-user-portal).
4. Read more about authorizing access to Event Grid resources [here](/azure/event-grid/security-authorization). 

The Azure Identity library provides Microsoft Entra ID (Formerly Azure Active Directory) token authentication support across the Azure SDK. It provides a set of TokenCredential implementations which can be used to construct Azure SDK clients which support Microsoft Entra token authentication. You can read more about it [here](/dotnet/api/overview/azure/identity-readme).

1. Include the Azure Identity client library for .NET with [NuGet](https://www.nuget.org/):

```csharp
dotnet add package Azure.Identity;
dotnet add package Azure.Security.KeyVault.Secrets
```
2. Include the Azure Identity library in your C# project

```csharp
using Microsoft.Azure.Identity;
using Azure.Security.KeyVault.Secrets
```

3. You can either pass the secret credentials or certificate credentials to get access token based on how your Service Principal is configured.

```csharp
// Authenticate the Keyvault client with DefaultAzureCredential and get secret/certificate
SecretClient keyVaultClient = new SecretClient(new Uri("https://myvault.vault.azure.net/"), new DefaultAzureCredential());
string secret = keyVaultClient.GetSecretAsync(certSecretName).Value;
```

a. Get Access token using secret credential

```csharp
string clientSecret = 'your-secret-from-keyvault';
string[] scopes = { "https://management.azure.com/.default" };
var application = ConfidentialClientApplicationBuilder
                    .Create('your-servicePrincipal-appId')
                    .WithTenantId('your-tenant_id')
                    .WithClientSecret(clientSecret)
                    .Build();

var token = await application
                .AcquireTokenForClient(scopes)
                .ExecuteAsync();
```


b. Get Access token using certificate credential

```csharp
string[] scopes = { "https://management.azure.com/.default" };
X509Certificate2 cert = 'your-certificate-from-keyvault';
var application = ConfidentialClientApplicationBuilder
                    .Create('your-servicePrincipal-appId')
                    .WithAuthority(authorityUri: new Uri(authority), validateAuthority: true)
                    .WithTenantId('your-tenant_id')
                    .WithCertificate(cert)
                    .Build();

var token = await application
                .AcquireTokenForClient(scopes)
                .WithSendX5C(true)
                .ExecuteAsync();
```

4. Authenticate EventGridManagementClient with Acess Token using SecretCredential or CertificateCredential


```csharp
// Authenticate EventGridManagementClient with Microsoft Entra ID access token credential
eventGridClient = new EventGridManagementClient(new Uri("https://management.azure.com/"),
    new TokenCredentials(token.AccessToken));

eventGridClient.SubscriptionId = 'your_subscripiton_id';
```

## Create Event Subscription
This code sample shows how to create the event subscription for the webhook subscriber endpoint.

```csharp
string webhookUri = $"<webhookUri>";
string resourceId="/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Communication/CommunicationServices/<acsResourceName>";
string[] includedEventTypes = new string[]{ "Microsoft.Communication.SMSReceived", 
                                            "Microsoft.Communication.SMSDeliveryReportReceived"
                                            };

EventSubscription eventSubscription = new EventSubscription(
    name: "<eventSubscriptionName>",
    eventDeliverySchema: "EventGridSchema",
    filter: new EventSubscriptionFilter(
    includedEventTypes: includedEventTypes),
    destination: new WebHookEventSubscriptionDestination(webhookUri));

await eventGridClient.EventSubscriptions.CreateOrUpdateAsync(
    scope: resourceId,
    eventSubscriptionName: "<eventSubscriptionName>",
    eventSubscriptionInfo: eventSubscription);
```

## Update Event Subscription
This code sample shows how to update the event subscription to add additional events you want to receive on the webhook subscriber endpoint.

```csharp
string webhookUri = $"<webhookUri>";
string resourceId="/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Communication/CommunicationServices/<acsResourceName>";
string[] additionalEventTypes = new string[]{ 
                                            "Microsoft.Communication.ChatMessageReceived"
                                        };

await eventGridClient.EventSubscriptions.UpdateAsync(
    scope: resourceId,
    eventSubscriptionName: "<eventSubscriptionName>",
    eventSubscriptionUpdateParameters: new EventSubscriptionUpdateParameters(
            filter: new EventSubscriptionFilter(includedEventTypes: additionalEventTypes)));
```

## Delete Event Subscription
This code sample shows how to delete the event susbcription for the webhook subscriber endpoint.

```csharp
string webhookUri = $"<webhookUri>";
string resourceId="/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Communication/CommunicationServices/<acsResourceName>";

await eventGridClient.EventSubscriptions.DeleteAsync(
    scope: resourceId,
    eventSubscriptionName: "<eventSubscriptionName>");
```

