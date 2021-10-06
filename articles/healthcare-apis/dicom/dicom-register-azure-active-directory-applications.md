---
title: Register Azure Active Directory applications for the DICOM service - Azure Healthcare APIs 
description: This article describes registering Azure Active Directory application for the DICOM service.
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 07/10/2021
ms.author: aersoy
---

# Register Azure Active Directory applications for the DICOM service

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

You have several options to choose from when you're setting up the DICOM service or the FHIR Server for Azure (OSS). For open source, you'll need to create your own resource application registration. For Azure API for FHIR, this resource application is created automatically.

## Application registrations

For an application to interact with Azure AD, it must be registered. In the context of the DICOM Service, there are three types of client application registrations to discuss.

## Client applications

Client applications are registrations of the clients that will be requesting tokens. Often in OAuth 2.0, we distinguish between at least three different types of applications.

### Confidential clients

Confidential clients are also known as web apps in Azure AD. Confidential clients are applications that use [authorization code flow](../../active-directory/azuread-dev/v1-protocols-oauth-code.md) to obtain a token on behalf of a signed in user presenting valid credentials. They are called confidential clients because they can hold a secret and will present this secret to Azure AD when exchanging the authentication code for a token. Since confidential clients can authenticate themselves using the client secret, they are trusted more than public clients and can have longer lived tokens and be granted a refresh token. For more information, see [Register a confidential client application in Azure Active Directory](dicom-register-confidential-client-application.md). It’s important to register the reply URL at which the client will be receiving the authorization code.

### Public clients

These are clients that cannot keep a secret. Typically, this would be a mobile device application or a single page JavaScript application, where a secret in the client could be discovered by a user. Public clients also use authorization code flow, but they are not allowed to present a secret when obtaining a token and they may have shorter lived tokens and no refresh token. Read the details on how to [Register a public client application in Azure Active Directory](dicom-register-public-application.md).

### Service clients

These clients obtain tokens on behalf of themselves (not on behalf of a user) using the [client credentials flow](.././../active-directory/azuread-dev/v1-oauth2-client-creds-grant-flow.md). They typically represent applications that access the DICOM Service in a non-interactive way. An example would be an ingestion process. When using a service client, it is not necessary to start the process of getting a token with a call to the /authorize endpoint. A service client can go straight to the /token endpoint and present client ID and client secret to obtain a token. For more information, see [Register a service client application in Azure Active Directory](dicom-register-service-client-application.md).

## Next steps

This overview article guided you through the application registration process for resource and client applications to work with the DICOM service. After you’ve registered your applications, you can deploy the DICOM service.

>[!div class="nextstepaction"]
>[Register a confidential client application in Azure Active Directory](dicom-register-confidential-client-application.md)

>[!div class="nextstepaction"]
>[Register a public client application in Azure Active Directory](dicom-register-public-application.md)

>[!div class="nextstepaction"]
>[Register a service client application in Azure Active Directory](dicom-register-service-client-application.md)