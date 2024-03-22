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
- Get the latest version of the [.NET Microsoft Azure Event Grid Management SDK](/azure/event-grid/sdk-overview).
- Get the latest version of the [Azure Identity](/dotnet/api/overview/azure/identity-readme) library.
- An [Azure Communication Services resource](../../create-communication-resource.md).

[!INCLUDE [register-event-grid-resource-provider.md](register-event-grid-resource-provider.md)]

## Installing the SDK

First, install the Microsoft Azure Event Grid Management library for .NET with [NuGet](https://www.nuget.org/):

```csharp
dotnet add package Azure.ResourceManager.EventGrid;
```
Include the Event Grid Management SDK in your C# project:

```csharp
using Microsoft.Azure.Management.EventGrid;
using Microsoft.Azure.Management.EventGrid.Models;
```

## Authenticating with Azure Identity library

### Prerequisites:
1. Create a Microsoft Entra application and Service Principal and set up a client secret or trusted certificate issued by certificate authority by following the instructions [here](/entra/identity-platform/howto-create-service-principal-portal).
1. Store the secret or the certificate in the Azure Keyvault. 
1. Give contributor or owner access to the subscription to that application following the instructions [here](/azure/role-based-access-control/quickstart-assign-role-user-portal).
1. Read more about authorizing access to Event Grid resources [here](/azure/event-grid/security-authorization). 

The Azure Identity library provides Microsoft Entra ID (Formerly Azure Active Directory) token authentication support across the Azure SDK. It provides a set of TokenCredential implementations, which can be used to construct Azure SDK clients that support Microsoft Entra token authentication. You can read more about it [here](/dotnet/api/overview/azure/identity-readme).

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

3. You can either pass the secret credentials or certificate credentials to get access token, based on how your Service Principal is configured.

    * Get access token using secret credential

        To get the secret credentials, you need to read it from the Keyvault you created in Prerequisite #2 using [SecretClient](/azure/key-vault/secrets/quick-create-net). 
        
        ```csharp
        // Authenticate the Keyvault client with DefaultAzureCredential and get the secret.
        SecretClient secretClient = new SecretClient(new Uri("https://myvault.vault.azure.net/"), new DefaultAzureCredential());
        string clientSecret = await secretClient.GetSecretAsync(secretName).Value;
        
        // Get access token using secret credentials
        string[] scopes = { "https://management.azure.com/.default" };
        var application = ConfidentialClientApplicationBuilder
                            .Create('your-servicePrincipal-appId')
                            .WithAuthority(authorityUri: new Uri(authority), validateAuthority: true)
                            .WithTenantId('your-tenant_id')
                            .WithClientSecret(clientSecret)
                            .Build();
        
        var token = await application
                        .AcquireTokenForClient(scopes)
                        .ExecuteAsync();
        ```

    * Get access token using certificate credential

        To get the certificate credentials, you need to read it from the Keyvault you created in Prerequisite #2 using [CertificateClient](/azure/key-vault/certificates/quick-create-net). 
        
        Read more about the Microsoft Entra application configuration authority [here](/entra/identity-platform/msal-client-application-configuration)
        
        ```csharp
        // Authenticate the certificate client with DefaultAzureCredential and get the certificate.
        CertificateClient certificateClient = new SecretClient(new Uri("https://myvault.vault.azure.net/"), new DefaultAzureCredential());
        X509Certificat2 cert = await certificateClient.DownloadCertificateAsync(certificateName);
        
        // Get access token using certificate credentials
        string[] scopes = { "https://management.azure.com/.default" };
        string authority = "https://login.microsoftonline.com/<tenant>/";
        var application = ConfidentialClientApplicationBuilder
                            .Create('<servicePrincipal-appId>')
                            .WithAuthority(authorityUri: new Uri(authority), validateAuthority: true)
                            .WithTenantId("<tenantId>")
                            .WithCertificate(cert)
                            .Build();
        
        var token = await application
                        .AcquireTokenForClient(scopes)
                        .WithSendX5C(true)
                        .ExecuteAsync();
        ```

4. Authenticate EventGridManagementClient with access token using secret or certificate credentials


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

## Update event subscription
This code sample shows how to update the event subscription to add more events, you want to receive on the webhook subscriber endpoint.

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

## Delete event Subscription
This code sample shows how to delete the event subscription for the webhook subscriber endpoint.

```csharp
string webhookUri = $"<webhookUri>";
string resourceId="/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Communication/CommunicationServices/<acsResourceName>";

await eventGridClient.EventSubscriptions.DeleteAsync(
    scope: resourceId,
    eventSubscriptionName: "<eventSubscriptionName>");
```

