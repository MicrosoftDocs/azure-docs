<properties
   pageTitle="Azure Active Directory Graph API | Microsoft Azure"
   description="An overview and quickstart guide for the Graph API which allows programmatic access to Azure AD through REST API endpoints."
   services="active-directory"
   documentationCenter=""
   authors="msmbaldwin"
   manager="mbaldwin"
   editor="mbaldwin" />
<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="09/17/2015"
   ms.author="mbaldwin" />

# Azure Active Directory Graph API

> *Jump right in with the [Graph API quick-start guide](active-directory-graph-api-quickstart.md) and the [interactive Graph API reference documentation](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/api-catalog).*

The Azure Active Directory Graph API provides programmatic access to Azure AD through REST API endpoints. Applications can use the Graph API to perform create, read, update, and delete (CRUD) operations on directory data and objects. For example, the Graph API supports the following common operations for a user object:

- Create a new user in a directory

- Get a user’s detailed properties, such as their groups

- Update a user’s properties, such as their location and phone number, or change their password

- Check a user’s group membership for role-based access

- Disable a user’s account or delete it entirely

In addition to user objects, you can perform similar operations on other objects such as groups and applications. To call the Graph API on a directory, the application must be registered with Azure AD and be configured to allow access to the directory. This is normally achieved through a user or admin consent flow.

To begin using the Azure Active Directory Graph API, see the [Graph API Quickstart Guide](active-directory-graph-api-quickstart.md), or view the [interactive Graph API reference documentation](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/api-catalog).


## Features

The Graph API provides the following features:

- **REST API Endpoints**: The Graph API is a RESTful service comprised of endpoints that are accessed using standard HTTP requests. The Graph API supports XML or Javascript Object Notation (JSON) content types for requests and responses. For more information, see [Azure AD Graph REST API Reference](https://msdn.microsoft.com/library/azure/hh974478.aspx).

- **Authentication with Azure AD**: Every request to the Graph API must be authenticated by appending a JSON Web Token (JWT) in the Authorization header of the request. This token is acquired by making a request to Azure AD’s token endpoint and providing valid credentials. You can use the OAuth 2.0 client credentials flow or the authorization code grant flow to acquire a token to call the Graph. For more information, [OAuth 2.0 in Azure AD](https://msdn.microsoft.com/library/azure/dn645545.aspx).

- **Role-Based Authorization (RBAC)**: Security groups are used to perform RBAC in the Graph API. For example, if you want to determine whether a user has access to a specific resource, the application can call the [Check Group Membership (transitive)](https://msdn.microsoft.com/library/azure/dn151601.aspx) operation, which returns true or false.

- **Differential Query**: If you want to check for changes in a directory between two time periods without having to make frequent queries to the Graph API, you can make a differential query request. This type of request will return only the changes made between the previous differential query request and the current request. For more information, see [Azure AD Graph API Differential Query](https://msdn.microsoft.com/library/azure/jj836245.aspx).

- **Directory Extensions**: If you are developing an application that needs to read or write unique properties for directory objects, you can register and use extension values by using the Graph API. For example, if your application requires a Skype ID property for each user, you can register the new property in the directory and it will be available on every user object. For more information, see [Azure AD Graph API Directory Schema Extensions](https://msdn.microsoft.com/library/azure/dn720459.aspx).

## Scenarios

The Graph API enables many application scenarios. The following scenarios are the most common:

- **Line of Business (Single Tenant) Application**: In this scenario, an enterprise developer works for an organization that has an Office 365 subscription. The developer is building a web application that interacts with Azure AD to perform tasks such assigning a license to a user. This task requires access to the Graph API, so the developer registers the single tenant application in Azure AD and configures read and write permissions for the Graph API. Then the application is configured to use either its own credentials or those of the currently sign-in user to acquire a token to call the Graph API.

- **Software as a Service Application (Multi-Tenant)**: In this scenario, an independent software vendor (ISV) is developing hosted multi-tenant web application that provides user management features for other organizations that use Azure AD. These features require access to directory objects, and so the application needs to call the Graph API. The developer registers the application in Azure AD, configures it to require read and write permissions for the Graph API, and then enables external access so that other organizations can consent to use the application in their directory. When a user in another organization authenticates to the application for the first time, they are shown a consent dialog with the permissions the application is requesting.  Granting consent will then give the application those requested permissions to the Graph API in the user’s directory. For more information on the consent framework, see [Overview of the Consent Framework](https://msdn.microsoft.com/library/azure/dn132599.aspx#BKMK_Consent).

## See Also

[Azure AD Graph API Quickstart Guide](active-directory-graph-api-quickstart.md)

[AD Graph REST documentation](https://msdn.microsoft.com/library/azure/hh974476.aspx)

[Azure Active Directory developer's guide](active-directory-developers-guide.md)
