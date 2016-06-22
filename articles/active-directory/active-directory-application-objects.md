<properties
pageTitle="Azure Active Directory Application and Service Principal Objects | Microsoft Azure"
description="A discussion of the relationship between Application and Service Principal objects in Azure Active Directory"
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
ms.date="06/10/2016"
ms.author="bryanla;mbaldwin"/>

# Application and Service Principal objects in Azure Active Directory
When someone refers to an Azure Active Directory (AD) "application", it's not always clear what they are referring to. The goal of this article is to make it clearer, by providing a distinct set of definitions for both the conceptual and concrete aspects of Azure AD application integration, followed by a discussion of application implementation within an Azure AD tenant.

## Definitions
An Azure AD application is broader than just a piece of software. It's a conceptual term, referring to a piece of software that has also been registered/integrated with Azure AD, in order to allow it to participate in authentication and/or authorization "conversations" at runtime, in a specific role. [By definition](https://tools.ietf.org/html/rfc6749#section-1.1), and for the purposes of this article, an application can function in a client role (ie: consumes a resource), a resource server role (ie: exposes an API for clients), or even both. The conversation protocol is defined by an [OAuth 2.0 Authorization Grant flow](https://tools.ietf.org/html/rfc6749#section-1.3), with a goal of allowing the client/resource to access/protect a resource's data respectively. Now lets go a level deeper, and see how the Azure AD application model represents an application internally. 

When you register an application in the [Azure classic portal](https://manage.windowsazure.com), two objects are created in your Azure AD tenant:

- **An Application object**, which represents the base *definition* of the application. The one-and-only Application object therefore has a 1:1 relationship with the application, and is the basis from which the application's Service Principal(s) are derived. Your tenant is considered the application's "home" tenant. You can find a detailed description of its properties in the **Application Object** section below.

- **A Service Principal (SP) object**, which represents the identity configuration used by a specific application *instance*, from an Azure AD tenant's perspective. This identity configuration is used to govern the instance's access to resources secured by the tenant where the SP lives. More specifically, the SP is the security principal that represents the identity configuration of the application instance at runtime, much like a user principal represents a user at runtime. The identity configuration is derived from the application's Application object at the point in time at which the Service Principal is created, including the access policies required. You can apply policies to Service Principal objects, such as assigning permissions, allowing it to reflect the type of access (scope-based or role-based) required by the application instance. 
 
There will always be a Service Principal in the same tenant where the application is registered, symmetric with the Application object. Optionally, there is also an SP representing a multi-tenant application in each tenant where a user has given consent for it to access that tenant's resources. 

    There is a 1:1+ relationship between the Application object and it's Service Principal objects, as an application needs a Service Principal object representing it's identity in each tenant in which it has been authorized to access resources protected by that tenant.

> [AZURE.NOTE] Any changes you make to your Application object, are also reflected in it's Service Principal object in the application's home tenant only (ie: the tenant where it was registered). If your application is configured for multi-tenant access, changes to the Application object are not reflected in any consumer tenants' Service Principal objects, until the consumer tenant removes access and grants access again.

## Application & Service Principal relationships
The diagram below illustrates the relationship between an application's Application object and corresponding Service Principal objects, in the context of a sample multi-tenant application called **HR app**. There are three Azure AD tenants in this scenario: 

- **Adatum** - the tenant used by the company that developed the **HR app**
- **Contoso**  - the tenant used by the Contoso organization, which is a consumer of the **HR app**
- **Fabrikam** - the tenant used by the Fabrikam organization, which also consumes the **HR app**

![Relationship between an Application object and a Service Principal object](./media/active-directory-application-objects/application-objects-relationship.png)

In the diagram above, Step "1" is the process of creating the Application and Service Principal objects.

In Step 2, when a company admin grants access, a Service Principal object is created in the company's Azure AD tenant and is assigned the directory access level that the company admin granted.

In Step 3, the consumer tenants of an app (such as Contoso and Fabrikam) each have their own Service Principal object that represents their instance of the app. In this example, they each have a Service Principal that represents the HR app.

## Next section
The Application object can be access via the Azure AD Graph API, as represented it's the OData [Application entity](https://msdn.microsoft.com/library/azure/ad/graph/api/entity-and-complex-type-reference?branch=master#ApplicationEntity)

The Service Principal object can be access via the Azure AD Graph API, as represented it's OData [Application entity](https://msdn.microsoft.com/library/azure/ad/graph/api/entity-and-complex-type-reference?branch=master#ApplicationEntity)