---
title: Microsoft Entra authentication with Azure confidential ledger
description: Microsoft Entra authentication with Azure confidential ledger
services: confidential-ledger
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: overview
ms.date: 07/12/2022
ms.author: mbaldwin

---
# Azure confidential ledger authentication with Microsoft Entra ID

The recommended way to access Azure confidential ledger is by authenticating to the **Microsoft Entra ID** service; doing so guarantees that Azure confidential ledger never gets the accessing principal's directory credentials.

To do so, the client performs a two-steps process:

1. In the first step, the client:
    1. Communicates with the Microsoft Entra service.
    1. Authenticates to the Microsoft Entra service.
    1. Requests an access token issued specifically for Azure confidential ledger.
1. In the second step, the client issues requests to Azure confidential ledger, providing the access token acquired in the first step as a proof of identity to Azure confidential ledger.

Azure confidential ledger then executes the request on behalf of the security principal for which Microsoft Entra ID issued the access token. All authorization checks are performed using this identity.

In most cases, the recommendation is to use one of Azure confidential ledger SDKs to access the service programmatically, as they remove much of the hassle of implementing the
flow above (and much more). See, for example, the [Python client library](https://pypi.org/project/azure-confidentialledger/) and [.NET client library](/dotnet/api/azure.security.confidentialledger).

The main authenticating scenarios are:

- **A client application authenticating a signed-in user**: In this scenario, an interactive (client) application triggers a Microsoft Entra prompt to the user for credentials (such as username and password). See [user authentication](#user-authentication).

- **A "headless" application**: In this scenario, an application is running with no user present to provide credentials. Instead the application authenticates as "itself" to Microsoft Entra ID using some credentials it has been configured with. See [application authentication](#application-authentication).

- **On-behalf-of authentication**. In this scenario, sometimes called the "web service" or "web app" scenario, the application gets a Microsoft Entra access token from another application, and then "converts" it to another Microsoft Entra access token that can be used with Azure confidential ledger. In other words, the application acts as a mediator between the user or application that provided credentials and the Azure confidential ledger service. See [on-behalf-of authentication](#on-behalf-of-authentication).

<a name='azure-ad-parameters'></a>

## Microsoft Entra parameters

<a name='azure-ad-resource-for-azure-confidential-ledger'></a>

### Microsoft Entra resource for Azure confidential ledger

When acquiring an access token from Microsoft Entra ID, the client must indicate which *Microsoft Entra resource* the token should be issued to. The Microsoft Entra resource of an Azure confidential ledger endpoint is the URI of the endpoint, barring the port information and the path.

For example, if you had an Azure confidential ledger called "myACL", the URI would be:

```txt
https://myACL.confidential-ledger.azure.com
```

<a name='azure-ad-tenant-id'></a>

### Microsoft Entra tenant ID

Microsoft Entra ID is a multi-tenant service, and every organization can create an object called **directory** in Microsoft Entra ID. The directory object holds security-related objects such as user accounts, applications, and groups. Microsoft Entra ID often refers to the directory as a **tenant**. Microsoft Entra tenants are identified by a GUID (**tenant ID**). In many cases, Microsoft Entra tenants can also be identified by the domain name of the organization.

For example, an organization called "Contoso" might have the tenant ID `4da81d62-e0a8-4899-adad-4349ca6bfe24` and the domain name `contoso.com`.

<a name='azure-ad-authority-endpoint'></a>

### Microsoft Entra authority endpoint

Microsoft Entra ID has many endpoints for authentication:

- When the tenant hosting the principal being authenticated is known (in other words, when one knows which Microsoft Entra directory the user or application are in), the Microsoft Entra endpoint is `https://login.microsoftonline.com/{tenantId}`. Here, `{tenantId}` is either the organization's tenant ID in Microsoft Entra ID, or its domain name (for example, `contoso.com`).
- When the tenant hosting the principal being authenticated isn't known, the "common" endpoint can be used by replacing the `{tenantId}` above with the value `common`.

The Microsoft Entra service endpoint used for authentication is also called *Microsoft Entra authority URL* or simply **Microsoft Entra authority**.

> [!NOTE]
> The Microsoft Entra service endpoint changes in national clouds. When working with an Azure confidential ledger service deployed in a national cloud, please set the corresponding national cloud Microsoft Entra service endpoint. To change the endpoint, set an environment variable `AadAuthorityUri` to the required URI.

## User authentication

The easiest way to access Azure confidential ledger with user authentication is to use the Azure confidential ledger SDK and set the `Federated Authentication` property of the Azure confidential ledger connection string to `true`. The first time the SDK is used to send a request to the service the user will be presented with a sign-in form to enter the Microsoft Entra credentials. Following a successful authentication the request will be sent to Azure confidential ledger.

Applications that don't use the Azure confidential ledger SDK can still use the [Microsoft Authentication Library (MSAL)](../active-directory/develop/msal-overview.md) instead of implementing the Microsoft Entra service security protocol client. See [Enable your Web Apps to sign-in users and call APIs with the Microsoft identity platform for developers](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2).

If your application is intended to serve as front-end and authenticate users for an Azure confidential ledger cluster, the application must be granted delegated permissions on Azure confidential ledger.

## Application authentication

Applications that use Azure confidential ledger authenticate by using a token from Microsoft Entra ID. The owner of the application must first register it in Microsoft Entra ID. Registration also creates a second application object that identifies the app across all tenants.

For detailed steps on registering an Azure confidential ledger application with Microsoft Entra ID, review these articles:

- [How to register an Azure confidential ledger application with Microsoft Entra ID](register-application.md)
- [Use portal to create a Microsoft Entra application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md)
- [Create an Azure service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli).

At the end of registration, the application owner gets the following values:

- An **Application ID** (also known as the Microsoft Entra Client ID or appID)
- An **authentication key** (also known as the shared secret).

The application must present both these values to Microsoft Entra ID to get a token.

The Azure confidential ledger SDKs use Azure Identity client library, which allows seamless authentication to Azure confidential ledger across environments with same code.

| .NET | Python | Java | JavaScript |
|--|--|--|--|
|[Azure Identity SDK .NET](/dotnet/api/overview/azure/identity-readme)|[Azure Identity SDK Python](/python/api/overview/azure/identity-readme)|[Azure Identity SDK Java](/java/api/overview/azure/identity-readme)|[Azure Identity SDK JavaScript](/javascript/api/overview/azure/identity-readme)|

## On-behalf-of authentication

In this scenario, an application was sent a Microsoft Entra access token for some arbitrary resource managed by the application, and it uses that token to acquire a new Microsoft Entra access token for the Azure confidential ledger resource so that the application could access the confidential ledger on behalf of the principal indicated by the original Microsoft Entra access token.

This flow is called the[OAuth2 token exchange flow](https://tools.ietf.org/html/draft-ietf-oauth-token-exchange-04). It generally requires multiple configuration steps with Microsoft Entra ID, and in some cases(depending on the Microsoft Entra tenant configuration) might require special consent from the administrator of the Microsoft Entra tenant.

## Next steps

- [How to register an Azure confidential ledger application with Microsoft Entra ID](register-application.md)
- [Overview of Microsoft Azure confidential ledger](overview.md)
- [Integrating applications with Microsoft Entra ID](../active-directory/develop/quickstart-register-app.md)
- [Use portal to create a Microsoft Entra application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md)
- [Create an Azure service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli).
- [Authenticating Azure confidential ledger nodes](authenticate-ledger-nodes.md)
