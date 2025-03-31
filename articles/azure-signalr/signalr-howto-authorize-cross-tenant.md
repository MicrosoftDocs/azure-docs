---
title: Cross tenant authorization with Microsoft Entra
description: This article provides information about building multitenant applications and configures authorization in SignalR.
author: terencefan
ms.author: tefa
ms.date: 03/12/2023
ms.service: azure-signalr-service
ms.topic: how-to
ms.devlang: csharp
ms.custom: subject-rbac-steps
---

# Cross tenant authorization with Microsoft Entra

For security reasons, your server may host in an independent tenant from your Azure SignalR resource.

Since managed identity can't be used across tenants, you need to register an application in `tenantA` and then provision it as an enterprise application in `tenantB`.

This doc helps you create an application in `tenantA` and use it to connect to a SignalR resource in `tenantB`.

## Register a multitenant application in tenant A

The first step is to create a multitenant application, see:

[Quickstart: Register an application in Microsoft Entra ID](/entra/identity-platform/quickstart-register-app)

In the case that you already have a single tenant application.

[Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant)

There are four account types:

- Accounts in this organizational directory
- Accounts in any organizational directory	
- Accounts in any organizational directory and personal Microsoft accounts
- Personal Microsoft accounts

Be sure to select either type 2 or type 3 when creating the application.

![Screenshot of overview information for a registered application.](./media/signalr-howto-authorize-application/application-overview.png)

Note down the **Application (client) ID** and **Directory (tenant) ID**, they can be useful in the following steps.

## Provision the application in tenant B

The role can't be assigned to the application registered in other tenants. We have to provision it as an external enterprise application in the tenant B.

Click to learn [differences between App registration and Enterprise applications](/answers/questions/270680/app-registration-vs-enterprise-applications).

For short, the enterprise application is a service principal, while the app registration isn't. The enterprise application inherits certain properties from the application object, such as **Application (client) ID**. 

A default service principal is created in the tenant where the app is registered. For other tenants, you need to provision the app to get an enterprise application service principal, see:

[Create an enterprise application from a multitenant application in Microsoft Entra ID](/entra/identity/enterprise-apps/create-service-principal-cross-tenant)

Enterprise applications in different tenant have different **Directory (tenant) ID**, but share the same **Application (client) ID**.

## Assign roles to the enterprise application

Once you have the enterprise application provisioned in your tenant B. You will be able to assign roles to it.

[!INCLUDE [add role assignments](includes/signalr-add-role-assignments.md)]

## Configure SignalR SDK to use the enterprise application

There are 3 different types of credentials for an application to authenticate itself:

- Certificates
- Client secrets
- Federated identity

We strongly recommend you to use the first 2 ways to make cross tenant requests.

### Use Certificates or Client secrets

- `tenantId` should be the ID of your **Tenant B**.
- `clientId` in both tenants are equal.
- `clientSecret` and `clientCert` should be configured in **Tenant A**, see [Add credentials](/entra/identity-platform/quickstart-register-app?tabs=certificate%2Cexpose-a-web-api#add-credentials).

If you aren't sure about your tenant ID, see [Find your Microsoft Entra tenant](/azure/azure-portal/get-subscription-tenant-id#find-your-microsoft-entra-tenant)

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

### Use Federated identity

However, for security reasons, certificates and client secrets might be disabled in your subscription. In this case, you need to either use an external identity provider or try the preview support for managed identity.

- [Configure an app to trust an external identity provider](/entra/workload-id/workload-identity-federation-create-trust)
- [Configure an application to trust a managed identity (preview)](/entra/workload-id/workload-identity-federation-config-app-trust-managed-identity)

You can check this repo: [Entra Cross-Tenant Application Federated Identity Credential (FIC)](https://github.com/arsenvlad/entra-cross-tenant-app-fic-managed-identity) for detailed info and video guide.

When using managed identity as an identity provider, the code should look like this:

- `tenantId` should be the ID of your **Tenant B**.
- `clientId` in both tenants are equal.

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

When using external identity providers, the code should look like this:

```csharp
services.AddSignalR().AddAzureSignalR(option =>
{
    var credential = new ClientAssertionCredential("tenantId", "appClientId", async (ctoken) =>
    {
        // Find your own way to get a token from the external identity provider.
        // The audience of the token should be "api://AzureADTokenExchange", as it is the recommended value.
        return "TheTokenYouGetFromYourExternalIdentityProvider";
    });

    option.Endpoints = [
        new ServiceEndpoint(new Uri(), "https://<resource>.service.signalr.net"), credential);
    ];
});
```

Debugging token acquisition with the SignalR SDK can be challenging since it depends on the token results. 
We recommend testing the token acquisition process locally before integrating with the SignalR SDK.

```csharp
var assertion = new ClientAssertionCredential("tenantId", "appClientId", async (ctoken) =>
{
    // Find your own way to get a token from the external identity provider.
    // The audience of the token should be "api://AzureADTokenExchange", as it is the recommended value.
    return TheTokenYouGetFromYourExternalIdentityProvider;
});

var request = new TokenRequestContext(["https://signalr.azure.com/.default");
var token = await assertion.GetTokenAsync(assertion);
Console.log(token.Token);
```

The key point is to use an inner credential to get a `clientAssertion` from `api://AzureADTokenExchange` or other trusted identity platforms. Then use it to exchange for a token with `https://signalr.azure.com/.default` audience to access your resource.

Your goal is to get a token with following claims. Use [jwt.io](https://jwt.io/) to help you decode the token:

- **oid**

  The value should be equal to your enterprise application object ID. 

  If you don't know where to get it, see [How Retrieve Enterprise Object ID](/answers/questions/1007608/how-retrieve-enterprise-object-id-from-azure-activ)

- **tid**

  The value should be equal to the Directory ID of your tenant B. 

  If you aren't sure about your tenant ID, see [Find your Microsoft Entra tenant](/azure/azure-portal/get-subscription-tenant-id#find-your-microsoft-entra-tenant)

- **audience**

  Has to be `https://signalr.azure.com/.default` to access SignalR resources.

## Next steps

See the following related articles:

- [Microsoft Entra ID for Azure SignalR Service](signalr-concept-authorize-azure-active-directory.md)
- [Authorize requests to Azure SignalR Service resources with Microsoft Entra applications](signalr-howto-authorize-application.md)
- [Authorize requests to Azure SignalR Service resources with Managed identities for Azure resources](./signalr-howto-authorize-managed-identity.md)