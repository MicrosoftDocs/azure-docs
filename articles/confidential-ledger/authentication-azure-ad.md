---
title: Azure Active Directory authentication with Azure confidential ledger
description: Azure Active Directory authentication with Azure confidential ledger
services: confidential-ledger
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: overview
ms.date: 07/12/2022
ms.author: mbaldwin

---
# Azure confidential ledger authentication with Azure Active Directory (Azure AD)

The recommended way to access Azure confidential ledger is by authenticating to the **Azure Active Directory (Azure AD)** service; doing so guarantees that Azure confidential ledger never gets the accessing principal's directory credentials.

To do so, the client performs a two-steps process:

1. In the first step, the client:
    1. Communicates with the Azure AD service.
    1. Authenticates to the Azure AD service.
    1. Requests an access token issued specifically for Azure confidential ledger.
1. In the second step, the client issues requests to Azure confidential ledger, providing the access token acquired in the first step as a proof of identity to Azure confidential ledger.

Azure confidential ledger then executes the request on behalf of the security principal for which Azure AD issued the access token. All authorization checks are performed using this identity.

In most cases, the recommendation is to use one of Azure confidential ledger SDKs to access the service programmatically, as they remove much of the hassle of implementing the
flow above (and much more). See, for example, the [Python client library](https://pypi.org/project/azure-confidentialledger/) and [.NET client library](/dotnet/api/azure.security.confidentialledger).

The main authenticating scenarios are:

- **A client application authenticating a signed-in user**: In this scenario, an interactive (client) application triggers an Azure AD prompt to the user for credentials (such as username and password). See [user authentication](#user-authentication).

- **A "headless" application**: In this scenario, an application is running with no user present to provide credentials. Instead the application authenticates as "itself" to Azure AD using some credentials it has been configured with. See [application authentication](#application-authentication).

- **On-behalf-of authentication**. In this scenario, sometimes called the "web service" or "web app" scenario, the application gets an Azure AD access token from another application, and then "converts" it to another Azure AD access token that can be used with Azure confidential ledger. In other words, the application acts as a mediator between the user or application that provided credentials and the Azure confidential ledger service. See [on-behalf-of authentication](#on-behalf-of-authentication).

## Azure AD parameters

### Azure AD resource for Azure confidential ledger

When acquiring an access token from Azure AD, the client must indicate which *Azure AD resource* the token should be issued to. The Azure AD resource of an Azure confidential ledger endpoint is the URI of the endpoint, barring the port information and the path.

For example, if you had an Azure confidential ledger called "myACL", the URI would be:

```txt
https://myACL.confidential-ledger.azure.com
```

### Azure AD tenant ID

Azure AD is a multi-tenant service, and every organization can create an object called **directory** in Azure AD. The directory object holds security-related objects such as user accounts, applications, and groups. Azure AD often refers to the directory as a **tenant**. Azure AD tenants are identified by a GUID (**tenant ID**). In many cases, Azure AD tenants can also be identified by the domain name of the organization.

For example, an organization called "Contoso" might have the tenant ID `4da81d62-e0a8-4899-adad-4349ca6bfe24` and the domain name `contoso.com`.

### Azure AD authority endpoint

Azure AD has many endpoints for authentication:

- When the tenant hosting the principal being authenticated is known (in other words, when one knows which Azure AD directory the user or application are in), the Azure AD endpoint is `https://login.microsoftonline.com/{tenantId}`. Here, `{tenantId}` is either the organization's tenant ID in Azure AD, or its domain name (for example, `contoso.com`).
- When the tenant hosting the principal being authenticated isn't known, the "common" endpoint can be used by replacing the `{tenantId}` above with the value `common`.

The Azure AD service endpoint used for authentication is also called *Azure AD authority URL* or simply **Azure AD authority**.

> [!NOTE]
> The Azure AD service endpoint changes in national clouds. When working with an Azure confidential ledger service deployed in a national cloud, please set the corresponding national cloud Azure AD service endpoint. To change the endpoint, set an environment variable `AadAuthorityUri` to the required URI.

## User authentication

The easiest way to access Azure confidential ledger with user authentication is to use the Azure confidential ledger SDK and set the `Federated Authentication` property of the Azure confidential ledger connection string to `true`. The first time the SDK is used to send a request to the service the user will be presented with a sign-in form to enter the Azure AD credentials. Following a successful authentication the request will be sent to Azure confidential ledger.

Applications that don't use the Azure confidential ledger SDK can still use the [Microsoft Authentication Library (MSAL)](../active-directory/develop/msal-overview.md) instead of implementing the Azure AD service security protocol client. See [Enable your Web Apps to sign-in users and call APIs with the Microsoft identity platform for developers](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2).

If your application is intended to serve as front-end and authenticate users for an Azure confidential ledger cluster, the application must be granted delegated permissions on Azure confidential ledger.

## Application authentication

Applications that use Azure confidential ledger authenticate by using a token from Azure Active Directory. The owner of the application must first register it in Azure Active Directory. Registration also creates a second application object that identifies the app across all tenants.

For detailed steps on registering an Azure confidential ledger application with Azure Active Directory, review these articles:

- [How to register an Azure confidential ledger application with Azure AD](register-application.md)
- [Use portal to create an Azure AD application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md)
- [Create an Azure service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli).

At the end of registration, the application owner gets the following values:

- An **Application ID** (also known as the Azure Active Directory Client ID or appID)
- An **authentication key** (also known as the shared secret).

The application must present both these values to Azure Active Directory to get a token.

The Azure confidential ledger SDKs use Azure Identity client library, which allows seamless authentication to Azure confidential ledger across environments with same code.

| .NET | Python | Java | JavaScript |
|--|--|--|--|
|[Azure Identity SDK .NET](/dotnet/api/overview/azure/identity-readme)|[Azure Identity SDK Python](/python/api/overview/azure/identity-readme)|[Azure Identity SDK Java](/java/api/overview/azure/identity-readme)|[Azure Identity SDK JavaScript](/javascript/api/overview/azure/identity-readme)|

## On-behalf-of authentication

In this scenario, an application was sent an Azure AD access token for some arbitrary resource managed by the application, and it uses that token to acquire a new Azure AD access token for the Azure confidential ledger resource so that the application could access the confidential ledger on behalf of the principal indicated by the original Azure AD access token.

This flow is called the[OAuth2 token exchange flow](https://tools.ietf.org/html/draft-ietf-oauth-token-exchange-04). It generally requires multiple configuration steps with Azure AD, and in some cases(depending on the Azure AD tenant configuration) might require special consent from the administrator of the Azure AD tenant.

## Next steps

- [How to register an Azure confidential ledger application with Azure AD](register-application.md)
- [Overview of Microsoft Azure confidential ledger](overview.md)
- [Integrating applications with Azure Active Directory](../active-directory/develop/quickstart-register-app.md)
- [Use portal to create an Azure AD application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md)
- [Create an Azure service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli).
- [Authenticating Azure confidential ledger nodes](authenticate-ledger-nodes.md)
