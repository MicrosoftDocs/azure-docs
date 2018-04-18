---
title: How and why applications are added to Azure Active Directory
description: What does it mean for an application to be added to Azure AD and how do they get there?
services: active-directory
documentationcenter: ''
author: mtillman
manager: mtillman
editor: ''

ms.assetid: 3321d130-f2a8-4e38-b35e-0959693f3576
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/18/2018
ms.author: mtillman
ms.custom: aaddev

---
# How and why applications are added to Azure AD
There are two representations of applications in Azure AD: [application objects](active-directory-application-objects.md#application-object) and [service principals](active-directory-application-objects.md#service-principal-object).  Although there are [exceptions](#a-couple-of-notes-and-exceptions), generally an application object can be considered the definition of an application while a service principal can be considered an instance of an application.  Service principals generally reference an application object, and one application object can be referenced by multiple service principals across directories.

## What are application objects and where do they come from?
[Application objects](active-directory-application-objects.md#application-object) (which can be managed in the Azure portal via the [App Registrations](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ApplicationsListBlade) experience) describe the application to Azure AD and can be considered the definition of the application.  The application object may include any of the following (or more):
* Name, logo, and publisher
* Reply URLs
* Secrets (symmetric and/or asymmetric keys used to authenticate the application)
* API dependencies (OAuth)
* Published APIs/resources/scopes (OAuth)
* App roles (RBAC)
* SSO metadata and configuration
* User provisioning metadata and configuration
* Proxy metadata and configuration

Application objects can be created via multiple pathways, including:
* Application registrations in the Azure portal
* Creating a new application using Visual Studio and configuring it to use Azure AD authentication
* Using the Azure AD API or Powershell to create a new application
* Many others including various developer experiences in Azure and in API explorer experiences across developer centers

## What are service principals and where do they come from?
[Service principals](active-directory-application-objects.md#service-principal-object) (which can be managed via the [Enterprise Applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/AllApps/menuId/) experience) are what actually govern an application connecting to Azure AD and can be considered the instance of the application in your directory.  For any given application, it can have at most one application object (which is registered in a "home" directory) and one or more service principal objects representing instances of the application in every directory in which it acts.  

The service principal can include:

* A reference back to an application object via the application ID property
* Records of local user and group application-role assignments
* Records of local user and admin permissions granted to the application
  * For example: permission for the application to access a particular user's email
* Records of local policies including conditional access policy
* Records of alternate local settings for an application
  * Claims transformation rules
  * Attribute mappings (User provisioning)
  * Directory-specific app roles (if the application supports custom roles)
  * Directory-specific name or logo

Like application objects, service principals can also be created via multiple pathways including:

* When users sign in to a third-party application integrated with Azure Active Directory
  * During sign-in users are asked to give permission to the application to access their profile and other permissions.  The first person to give consent causes a service principal representing the application to be added to the directory.
* When users sign in to Microsoft online services like [Office 365](http://products.office.com/)
  * When you subscribe to Office 365 or begin a trial, one or more service principals are created in the directory representing the various services that are used to deliver all of the functionality associated with Office 365.
  * Some Office 365 services like SharePoint create service principals on an on-going basis to allow secure communication between components including workflows.
* Add an application to use the [Azure AD Application Proxy](https://msdn.microsoft.com/library/azure/dn768219.aspx)
* Connect an application for single sign on using SAML or Password SSO

## How are application objects and service principals related to each other?
An application has one application object in its home directory that is referenced by one or more service principals in each of the directories where it operates.
![A diagram illustrating how application objects and service principals interact with each other and Azure AD instances.][apps_service_principals_directory]

As you can see from the diagram above.  Microsoft maintains two directories internally (shown on the left) that it uses to publish applications.

* One for Microsoft Apps (Microsoft services directory)
* One for pre-integrated third-party applications (App gallery directory)

Application publishers/vendors who integrate with Azure AD are required to have a publishing directory.  (shown on the right as "Some SaaS Directory").

Applications that you add yourself (represented as **App (yours)** in the diagram) include:

* Apps you developed (integrated with AAD)
* Apps you connected for single-sign-on
* Apps you published using the Azure AD application proxy

### A couple of notes and exceptions
* Not all service principals point back to an application object.  When Azure AD was originally built the services provided to applications were much more limited and the service principal was sufficient for establishing an application identity.  The original service principal was closer in shape to the Windows Server Active Directory service account.  For this reason it's still possible to create service principals via various pathways, such as using Azure AD PowerShell, without first creating an application object.  The Azure AD Graph API requires an application object before creating a service principal.
* Not all of the information described above is currently exposed programmatically.  The following are only available in the UI:
  * Claims transformation rules
  * Attribute mappings (User provisioning)
* For more detailed information on the service principal and application objects refer to the Azure AD Graph REST API reference documentation:
  * [Application](https://msdn.microsoft.com/library/azure/ad/graph/api/entity-and-complex-type-reference#application-entity)
  * [Service Principal](https://msdn.microsoft.com/library/azure/ad/graph/api/entity-and-complex-type-reference#serviceprincipal-entity)

## Why do applications integrate with Azure AD?
Applications are added to Azure AD to leverage one or more of the services it provides including:

* Application authentication and authorization
* User authentication and authorization
* Single sign-on (SSO) using federation or password
* User provisioning & synchronization
* Role-based access control: Use the directory to define application roles to perform roles based authorization checks in an application
* OAuth authorization services (used by Office 365 and other Microsoft applications to authorize access to APIs/resources.)
* Application publishing & proxy: Publish an application from a private network to the internet

## Who has permission to add applications to my Azure AD instance?
While there are some tasks that only global administrators can do (such as adding applications from the app gallery and configuring an application to use the Application Proxy) by default all users in your directory have rights to register application objects that they are developing and discretion over which applications they share/give access to their organizational data via consent.  If a person is the first user in your directory to sign in to an application and grant consent, that will create a service principal in your tenant, otherwise the consent grant information will be stored on the existing service principal.

Allowing users to register and consent to applications might initially sound concerning, but keep the following in mind:

* Applications have been able to leverage Windows Server Active Directory for user authentication for many years without requiring the application to be registered or recorded in the directory.  Now the organization will have improved visibility to exactly how many applications are using the directory and for what.
* Negates the need for admin driven application registration and publishing process.  With Active Directory Federation Services it was likely that an admin had to add an application as a relying party on behalf of their developers.  Now developers can self-service.
* Users signing in to applications using their organization accounts for business purposes is a good thing.  If they subsequently leave the organization they will automatically lose access to their account in the application they were using.
* Having a record of what data was shared with which application is a good thing.  Data is more transportable than ever and it's useful to have a clear record of who shared what data with which applications.
* Applications who use Azure AD for OAuth decide exactly what permissions that users are able to grant to applications and which permissions require an admin to agree to.  Only admins can consent to larger scopes and more significant permissions, while user consent is scoped to the users' own data and capabilities.
* When a user adds or allows an application to access their data, the event can be audited so you can view the Audit Reports within the Azure portal to determine how an application was added to the directory.

If you still want to prevent users in your directory from registering applications and from signing in to applications without administrator approval, there are two settings that you can change to turn off those capabilities:

* To prevent users from consenting to applications on their own behalf, go to the [User settings](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/UserSettings/menuId/) section under Enterprise applications in the Azure portal and change **Users can consent to apps accessing company data on their behalf** to **No**.  *Note that if you decide to turn off user consent, an admin will be required to consent to any new app a user needs to use.*
* To prevent users from registering their own applications, go to the [User settings](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/UserSettings) section under Azure Active Directory in the Azure portal and change **Users can register applications** to **No**.

**Note:** Microsoft itself uses the default configuration with users able to register applications and consent to applications on their own behalf.

<!--Image references-->
[apps_service_principals_directory]:../media/active-directory-how-applications-are-added/HowAppsAreAddedToAAD.jpg

