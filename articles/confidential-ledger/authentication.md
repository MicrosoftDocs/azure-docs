---
title: Authenticate to Azure confidential ledger
description: Learn how to authenticate to Azure confidential ledger
author: msmbaldwin
ms.author: mbaldwin
ms.date: 03/31/2021
ms.service: key-vault
ms.subservice: general
ms.topic: conceptual

---
# Authentication in Azure confidential ledger

Authentication with Azure confidential ledger works in conjunction with [Azure Active Directory (Azure AD)](../../active-directory/fundamentals/active-directory-whatis.md), which is responsible for authenticating the identity of any given **security principal**.

A security principal is an object that represents a user, group, service, or application that's requesting access to Azure resources. Azure assigns a unique **object ID** to every security principal.

- A **user** security principal identifies an individual who has a profile in Azure Active Directory.

- A **group** security principal identifies a set of users created in Azure Active Directory. Any roles or permissions assigned to the group are granted to all of the users within the group.

-A **service principal** is a type of security principal that identifies an application or service, which is to say, a piece of code rather than a user or group. A service principal's object ID is known as its **client ID** and acts like its username. The service principal's **client secret** acts like its password.

## The Azure confidential ledger request operation flow with authentication

Azure confidential ledger authentication occurs as part of every request operation on Azure confidential ledger. Once token is retrieved, it can be reused for subsequent calls. Authentication flow example:

1. A token requests to authenticate with Azure AD, for example:
    - Azure confidential ledger contacts the REST endpoint to get an access token.
    - A user logs into the Azure portal using a username and password.

1. If authentication with Azure AD is successful, the security principal is granted an OAuth token.

1. A call to the Azure confidential ledger REST API through the Azure confidential ledger's endpoint (URI).

1. Azure confidential ledger calls Azure AD to validate the security principal's access token.

1. Azure confidential ledger checks if the security principal has the necessary permission for requested operation. If not, Azure confidential ledger returns a forbidden response.

1. Azure confidential ledger carries out the requested operation and returns the result.

## Authentication to confidential ledger in application code

The Azure confidential ledger SDKs use Azure Identity client library, which allows seamless authentication to Azure confidential ledger across environments with same code.

**Azure Identity client libraries**

| .NET | Python | Java | JavaScript |
|--|--|--|--|
|[Azure Identity SDK .NET](/dotnet/api/overview/azure/identity-readme)|[Azure Identity SDK Python](/python/api/overview/azure/identity-readme)|[Azure Identity SDK Java](/java/api/overview/azure/identity-readme)|[Azure Identity SDK JavaScript](/javascript/api/overview/azure/identity-readme)| 

For applications, there are two ways to obtain a service principal:

- Recommended: enable a system-assigned **managed identity** for the application.

    With managed identity, Azure internally manages the application's service principal and automatically authenticates the application with other Azure services. Managed identity is available for applications deployed to a variety of services.

    For more information, see the [Managed identity overview](../../active-directory/managed-identities-azure-resources/overview.md). Also see [Azure services that support managed identity](../../active-directory/managed-identities-azure-resources/services-support-managed-identities.md), which links to articles that describe how to enable managed identity for specific services (such as App Service, Azure Functions, Virtual Machines, etc.).

- If you cannot use managed identity, you instead **register** the application with your Azure AD tenant, as described on [Quickstart: Register an application with the Azure identity platform](../../active-directory/develop/quickstart-register-app.md). Registration also creates a second application object that identifies the app across all tenants.

## Next Steps

