---
title: Register service application in Azure Active Directory
description: Register service application in Azure Active Directory
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.topic: conceptual 
ms.date: 02/11/2019.
ms.author: mihansen
---

# How-to Guide: Register a service client application in Azure Active Directory

In this How-to guide, you'll learn how to register a service client application in Azure Active Directory. Client application registrations are Azure Active Directory representations of applications that can be used to authenticate and obtain tokens. A service client is intended to be used by an application to obtain an access token without interactive authentication of a user. It will have certain application permissions and use an application secret (password) when obtaining access tokens.

Follow the steps below to create a new service client.

## Open the Azure portal's Active Directory section

Azure Active Directory applications can be registered and edited in the "App registrations" view of the Azure AD section of the Azure portal:

![Azure portal. New App Registration.](media/how-to-aad/portal-aad-new-app-registration.png)

Click the "+ New registration".

## Service client application details

The service client needs a display name and you can also provide a reply URL but it will typically not be used.

![Azure portal. New Service Client App Registration.](media/how-to-aad/portal-aad-register-new-app-registration-SERVICE-CLIENT-NAME.png)

## API Permissions

You will need to grant the service client application roles. First you should open the API permissions and select your [FHIR API Resource Application Registration](documentation-aad-resource-application-registration.md):

![Azure portal. Service Client API Permissions](media/how-to-aad/portal-aad-register-new-app-registration-SERVICE-CLIENT-API-PERMISSIONS.png)

Now select the application roles you from the ones that are defined on the resource application:

![Azure portal. Service Client Application Permissions](media/how-to-aad/portal-aad-register-new-app-registration-SERVICE-CLIENT_APPLICATION-PERMISSIONS.png)

You will need to grant consent to the application. If you don't have the permissions required, check with your Azure Active Directory administrator:

![Azure portal. Service Client Admin Consent](media/how-to-aad/portal-aad-register-new-app-registration-SERVICE-CLIENT-ADMIN-CONSENT.png)

## Application Secret

The service client needs a secret (password), which you will used when obtaining tokens.

![Azure portal. Service Client Secret](media/how-to-aad/portal-aad-register-new-app-registration-SERVICE-CLIENT-SECRET.png)

Provide a duration of the secret. Once it has been generated, it will only be displayed once in the portal. Make a note of it and store in a securely.