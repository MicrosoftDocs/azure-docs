---
title: Register a public client application in Azure Active Directory - Microsoft Healthcare APIs
description: This article explains how to register a public client application in Azure Active Directory.
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.topic: conceptual
ms.date: 02/11/2019
ms.author: mihansen
---

# Register a public client application in Azure Active Directory

In this article, you'll learn how to register a public application in Azure Active Directory. Client application registrations are Azure Active Directory representations of applications that can authenticate and ask for API permissions on behalf of a user. Public clients are applications such as mobile applications and single page javascript applications that cannot keep secrets confidential. The procedure is similar to [registering a confidential client](register-confidential-aad-client-app.md), but since public clients cannot be trusted to hold an application secret, there is no need to add one.

## Open app registrations in Azure portal's Active Directory section

1. In the [Azure portal](https://portal.azure.com), on the left navigation panel, click **Azure Active Directory**.

2. In the **Azure Active Directory** blade click **App registrations (Preview)**:

    ![Azure portal. New App Registration.](media/how-to-aad/portal-aad-new-app-registration.png)

3. Click the **New registration**.

## Application registration overview

1. Give the application with a display name.

2. Provide a reply URL. The reply URL is where authentication codes will be returned to the client application. You can add more reply URLs and edit existing ones later.

    ![Azure portal. New public App Registration.](media/how-to-aad/portal-aad-register-new-app-registration-PUB-CLIENT-NAME.png)

## API permissions

Similarly to the [confidential client application](register-confidential-aad-client-app.md), you will need to select which API permissions this application should be able to request on behalf of users:

1. Open the **API permissions** and select your [FHIR API Resource Application Registration](register-resource-aad-client-app.md):

    ![Azure portal. New public API Permissions.](media/how-to-aad/portal-aad-register-new-app-registration-PUB-CLIENT-API-PERMISSIONS.png)

2. Select the scopes that you would like the application to be able to request.