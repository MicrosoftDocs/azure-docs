<properties
pageTitle="Azure Active Directory Application and Service Principal Objects | Microsoft Azure"
description="A discussion of the relationship between application and service principal objects in Azure Active Directory"
documentationCenter="dev-center-name"
authors="bryanla"
manager="mbaldwin"
services="active-directory"
editor=""/>

<tags
ms.service="active-directory"
ms.devlang="na"
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="identity"
ms.date="07/06/2016"
ms.author="bryanla;mbaldwin"/>

# Application and service principal objects in Azure Active Directory
When someone refers to an Azure Active Directory (AD) "application", it's not always clear exactly what they are referring to. The goal of this article is to make it clearer, by providing a distinct set of definitions for both the conceptual and concrete aspects of Azure AD application integration, followed by a discussion of application registration/implementation within an Azure AD tenant.

## Definitions
An Azure AD application is broader than just a piece of software. It's a conceptual term, referring not only to application software, but also it's registration with Azure AD (aka: identity configuration), which allows it to participate in authentication and an authorization "conversation" at runtime, in a specific role. [By definition](https://tools.ietf.org/html/rfc6749#section-1.1), and for the purposes of this article, an application can function in a client role (ie: consumes a resource), a resource server role (ie: exposes API(s) to clients), or even both. The conversation protocol is defined by an [OAuth 2.0 Authorization Grant flow](active-directory-dev-glossary.md#authorization-grant), with a goal of allowing the client/resource to access/protect a resource's data respectively. Now lets go a level deeper, and see how the Azure AD application model represents an application internally. 

When you register an application in the [Azure classic portal](https://manage.windowsazure.com), two objects are created in your Azure AD tenant:

- An [application object](active-directory-dev-glossary.md#application-object):  An Azure AD application is an overarching concept, *defined* by it's one and only application object which lives in the Azure AD tenant where the application was registered. The application object serves as the application's identity configuration, and is the template from which it's corresponding service principal object(s) are *derived* for use at run-time. The Azure AD Graph application entity defines the schema for an application object. The tenant in which the application object lives is considered the application's "home" tenant.

    The application object therefore has a 1:1 relationship with the application, and a 1:*n* relationship with it's corresponding service principal object(s). A single-tenant application will have only 1 service principal (in its home tenant) symmetric with it's application object; a multi-tenant application will have the same, plus a service principal in each tenant where the application has been given consent to access resources. 

- A [service principal object](active-directory-dev-glossary.md#service-principal): As mentioned above, the application object serves as the template for an application's identity configuration, from which its service principal object(s) are *derived*. It is the service principal object to which policy and permissions are applied, for use at run-time by the tenant in which it lives. A service principal object is required in each tenant for which an instance of the application must be represented, governing access to resources protected by user accounts from that tenant.

    For a multi-tenant Web application, the service principal object is created in the end-user's Azure AD tenant after successful consent, acknowledging permission to access a protected resource on behalf of the user. Going forward, the service principal object will be consulted for future authorization requests. 

> [AZURE.NOTE] Any changes you make to your application object, are also reflected in it's service principal object in the application's home tenant only (ie: the tenant where it was registered). If your application is configured for multi-tenant access, changes to the application object are not reflected in any consumer tenants' service principal objects, until the consumer tenant removes access and grants access again.

## Application & service principal relationships
The diagram below illustrates the relationship between an application's application object and corresponding service principal objects, in the context of a sample multi-tenant application called **HR app**. There are three Azure AD tenants in this scenario: 

- **Adatum** - the tenant used by the company that developed the **HR app**
- **Contoso**  - the tenant used by the Contoso organization, which is a consumer of the **HR app**
- **Fabrikam** - the tenant used by the Fabrikam organization, which also consumes the **HR app**

![Relationship between an application object and a service principal object](./media/active-directory-application-objects/application-objects-relationship.png)

In the diagram above, Step 1 is the process of creating the application and service principal objects in their home tenant.

In Step 2, when Contoso and Fabrikam administrators complete consent and grant access to the application, a service principal object is created in their company's Azure AD tenant and is assigned the permissions that the company administrator granted. Note: the HR app could also be designed to allow consent by users for individual use.

In Step 3, the consumer tenants of the HR application (such as Contoso and Fabrikam) each have their own service principal object that represents their use of an instance of the application at runtime, governed by the permissions consented by the administrator.

## Next steps
An application's application object can be accessed via the Azure AD Graph API, as represented by it's OData [Application entity](https://msdn.microsoft.com/library/azure/ad/graph/api/entity-and-complex-type-reference?branch=master#ApplicationEntity)

An application's service principal object can be accessed via the Azure AD Graph API, as represented by it's OData [ServicePrincipal entity](https://msdn.microsoft.com/library/azure/ad/graph/api/entity-and-complex-type-reference?branch=master#ServicePrincipalEntity)