---
title: Configure Cross-Tenant Authorization with Microsoft Entra
description: Learn how to build multitenant applications and configure cross-tenant authorization in Azure SignalR Service.
author: terencefan
ms.author: tefa
ms.date: 03/12/2023
ms.service: azure-signalr-service
ms.topic: how-to
ms.devlang: csharp
ms.custom: subject-rbac-steps
---

# Configure cross-tenant authorization with Microsoft Entra

For security reasons, your server might host in a tenant independent from your Azure SignalR Service resource. Because managed identity can't be used across tenants, you need to register an application in tenant A and then provision it as an enterprise application in tenant B. This article helps you create an application in tenant A and use it to connect to an Azure SignalR Service resource in tenant B.

## Register a multitenant application in tenant A

The first step is to create a multitenant application. For more information, see [Quickstart: Register an application in Microsoft Entra ID](/entra/identity-platform/quickstart-register-app).

If you already have a single tenant application, follow the instructions in [Convert a single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

There are four account types:

- Accounts in this organizational directory
- Accounts in any organizational directory
- Accounts in any organizational directory and personal Microsoft accounts
- Personal Microsoft accounts

Be sure to select either the second type or the third type when you create the application.

![Screenshot that shows an overview of information for a registered application](./media/signalr-howto-authorize-application/application-overview.png).

Make a note of the application (client) ID and the directory (tenant) ID for use in the following steps.

## Provision the application in tenant B

You can't assign the role to the application registered in other tenants. You have to provision it as an external enterprise application in tenant B. If you need more information, you can learn about the [differences between app registration and enterprise applications](/answers/questions/270680/app-registration-vs-enterprise-applications).

In brief, the enterprise application is a service principal and the app registration isn't. The enterprise application inherits certain properties from the application object, such as the application (client) ID.

A default service principal is created in the tenant where the app is registered. For other tenants, you need to provision the app to get an enterprise application service principal. For more information, see [Create an enterprise application from a multitenant application in Microsoft Entra ID](/entra/identity/enterprise-apps/create-service-principal-cross-tenant).

Enterprise applications in different tenants have different directory (tenant) IDs, but they share the same application (client) ID.

## Assign roles to the enterprise application

After you have the enterprise application provisioned in your tenant B, you can assign roles to it.

[!INCLUDE [add role assignments](includes/signalr-add-role-assignments.md)]

## Configure the Azure SignalR Service SDK to use the enterprise application

An application uses three different types of credentials to authenticate itself:

- Certificates
- Client secrets
- Federated identity

We strongly recommend that you use certificates or client secrets to make cross-tenant requests.

### Use certificates or client secrets

- The `tenantId` parameter is the ID of your tenant B.
- The `clientId` parameters in both tenants are equal.
- The `clientSecret` and `clientCert` parameters are configured in tenant A. For more information, see [Add credentials](/entra/identity-platform/quickstart-register-app?tabs=certificate%2Cexpose-a-web-api#add-credentials).

If you aren't sure about your tenant ID, see [Find your Microsoft Entra tenant](/azure/azure-portal/get-subscription-tenant-id#find-your-microsoft-entra-tenant).

```csharp
services.AddSignalR().AddAzureSignalR(option =>
{
    var credential1 = new ClientSecretCredential("tenantId", "clientId", "clientSecret");
    var credential2 = new ClientCertificateCredential("tenantId", "clientId", "path-to-cert");

    option.Endpoints = new ServiceEndpoint[]
    {
        new ServiceEndpoint(new Uri("https://<resource1>.service.signalr.net"), credential1),
        new ServiceEndpoint(new Uri("https://<resource2>.service.signalr.net"), credential2),
    };
});
```

### Use federated identity

For security reasons, certificates and client secrets might be disabled in your subscription. In this case, you need to either use an external identity provider or try the preview support for managed identity. For more information, see:

- [Configure an app to trust an external identity provider](/entra/workload-id/workload-identity-federation-create-trust)
- [Configure an application to trust a managed identity (preview)](/entra/workload-id/workload-identity-federation-config-app-trust-managed-identity)

For detailed information and video guidance, see [Microsoft Entra Cross-Tenant Application Federated Identity Credential (FIC)](https://github.com/arsenvlad/entra-cross-tenant-app-fic-managed-identity).

When you use managed identity as an identity provider, the code looks like the following example:

- The `tenantId` parameter is the ID of your tenant B.
- The `clientId` parameters in both tenants are equal.

```csharp
services.AddSignalR().AddAzureSignalR(option =>
{
    var msiCredential = new ManagedIdentityCredential("msiClientId");

    var credential = new ClientAssertionCredential("tenantId", "appClientId", async (ctoken) =>
    {
        // Entra ID US Government: api://AzureADTokenExchangeUSGov
        // Entra ID China operated by 21Vianet: api://AzureADTokenExchangeChina
        var request = new TokenRequestContext([$"api://AzureADTokenExchange/.default"]);
        var response = await msiCredential.GetTokenAsync(request, ctoken).ConfigureAwait(false);
        return response.Token;
    });

    option.Endpoints = [
        new ServiceEndpoint(new Uri(), "https://<resource>.service.signalr.net"), credential);
    ];
});
```

When you use external identity providers, the code looks like the following example:

```csharp
services.AddSignalR().AddAzureSignalR(option =>
{
    var credential = new ClientAssertionCredential("tenantId", "appClientId", async (ctoken) =>
    {
        // Find your own way to get a token from the external identity provider.
        // The audience of the token should be "api://AzureADTokenExchange" because it is the recommended value.
        return "TheTokenYouGetFromYourExternalIdentityProvider";
    });

    option.Endpoints = [
        new ServiceEndpoint(new Uri(), "https://<resource>.service.signalr.net"), credential);
    ];
});
```

Debugging token acquisition with the Azure SignalR Service SDK is a challenge because it depends on the token results. We recommend that you test the token acquisition process locally before you integrate with the Azure SignalR Service SDK.

```csharp
var assertion = new ClientAssertionCredential("tenantId", "appClientId", async (ctoken) =>
{
    // Find your own way to get a token from the external identity provider.
    // The audience of the token should be "api://AzureADTokenExchange" because it is the recommended value.
    return TheTokenYouGetFromYourExternalIdentityProvider;
});

var request = new TokenRequestContext(["https://signalr.azure.com/.default");
var token = await assertion.GetTokenAsync(assertion);
Console.log(token.Token);
```

The key point is to use an inner credential to get a `clientAssertion` parameter from `api://AzureADTokenExchange` or other trusted identity platforms. Then use it to exchange for a token with the `https://signalr.azure.com/.default` audience to access your resource.

Your goal is to get a token with the following claims. Use [jwt.io](https://jwt.io/) to help you decode the token:

- **oid**: The value should be equal to your enterprise application object ID. If you don't know where to get it, see [Retrieve an enterprise object ID](/answers/questions/1007608/how-retrieve-enterprise-object-id-from-azure-activ).
- **tid**: The value should be equal to the directory ID of your tenant B. If you aren't sure about your tenant ID, see [Find your Microsoft Entra tenant](/azure/azure-portal/get-subscription-tenant-id#find-your-microsoft-entra-tenant).
- **audience**: The audience must be `https://signalr.azure.com/.default` to access Azure SignalR Service resources.

## Related content

- [Microsoft Entra ID for Azure SignalR Service](signalr-concept-authorize-azure-active-directory.md)
- [Authorize requests to Azure SignalR Service resources with Microsoft Entra applications](signalr-howto-authorize-application.md)
- [Authorize requests to Azure SignalR Service resources with managed identities for Azure resources](./signalr-howto-authorize-managed-identity.md)