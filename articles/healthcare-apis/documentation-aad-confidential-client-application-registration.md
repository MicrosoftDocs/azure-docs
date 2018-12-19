---
title: Register confidential client application in Azure Active Directory
description: Register confidential client application in Azure Active Directory
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.topic: conceptual 
ms.date: 02/11/2019.
ms.author: mihansen
---

# How-to Guide: Register a confidential client application in Azure Active Directory

In this How-to guide, you'll learn how to register a confidential client application in Azure Active Directory. A client application registration is an Azure Active Directory representation of an application that can be used to authenticate on behalf of a user and request access to [resource applications](documentation-aad-resource-application-registration.md). A confidential client application is an application that can be trusted to hold a secret and present that secret when requesting access tokens. Examples of confidential applications are server-side applications.

To register a new confidential application in the portal, follow the steps below.

## Open the Azure portal's Active Directory section

Azure Active Directory applications can be registered and edited in the "App registrations" view of the Azure AD section of the Azure portal:

![Azure portal. New App Registration.](media/how-to-aad/portal-aad-new-app-registration.png)

Click the "+ New registration".

## Register a new application

Give the application a display name and fill in the Reply URL. These details can be changed later, but if you know the reply URL of your application, enter it now. 

![New Confidential Client App Registration.](media/how-to-aad/portal-aad-register-new-app-registration-CONF-CLIENT.png)

## API Permissions

Next add API Permissions:
 
![Confidential client. API Permissions](media/how-to-aad/portal-aad-register-new-app-registration-CONF-CLIENT-API-Permissions.png)

Select your [FHIR API Resource Application Registration](documentation-aad-resource-application-registration.md):

![Confidential client. My APIs](media/how-to-aad/portal-aad-register-new-app-registration-CONF-CLIENT-API-MyApis.png)

And select scopes (permissions) that the confidential application should be able to ask for on behalf of a user:

![Confidential client. Delegated Permissions](media/how-to-aad/portal-aad-register-new-app-registration-CONF-CLIENT-API-DelegatedPermissions.png)

## Application Secret

Last step is to create an application secret (client secret):

![Confidential client. Application Secret](media/how-to-aad/portal-aad-register-new-app-registration-CONF-CLIENT-SECRET.png)

You will be prompted for a description and duration of the secret. Once generated, it will be displayed in the portal only once. Make a note of it and store it securely.