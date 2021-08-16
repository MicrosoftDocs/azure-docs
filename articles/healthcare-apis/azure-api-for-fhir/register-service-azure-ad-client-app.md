---
title: Register a service app in Azure AD - Azure API for FHIR
description: Learn how to register a service client application in Azure Active Directory. 
services: healthcare-apis
author: matjazl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 08/16/2021
ms.author: cavoeg
---

# Register a service client application in Azure Active Directory for Azure API for FHIR

In this article, you'll learn how to register a service client application in Azure Active Directory. Client application registrations are Azure Active Directory representations of applications that can be used to authenticate and obtain tokens. A service client is intended to be used by an application to obtain an access token without interactive authentication of a user. It will have certain application permissions and use an application secret (password) when obtaining access tokens.

Follow these steps to create a new service client.

## App registrations in Azure portal

1. In the [Azure portal](https://portal.azure.com), navigate to **Azure Active Directory**.

2. Select **App registrations**.

    ![Azure portal. New App Registration.](media/add-azure-active-directory/portal-aad-new-app-registration.png)

3. Select **New registration**.

4. Give the service client a display name. Service client applications typically do not use a reply URL.

    :::image type="content" source="media/service-client-app/service-client-registration.png" alt-text="Azure portal. New Service Client App Registration.":::

5. Select **Register**.

## API permissions

Now that you have registered your application, you'll need to select which API permissions this application should be able to request on behalf of users:

1. Select **API permissions**.
1. Select **Add a permission**.

    If you are using the Azure API for FHIR, you will add a permission to the Azure Healthcare APIs by searching for **Azure Healthcare APIs** under **APIs my organization uses**. 

    If you are referencing a different Resource Application, select your [FHIR API Resource Application Registration](register-resource-azure-ad-client-app.md) that you created previously under **My APIs**.

    :::image type="content" source="media/service-client-app/service-client-org-api.png" alt-text="Confidential client. My Org APIs" lightbox="media/service-client-app/service-client-org-api-expanded.png":::

1. Select scopes (permissions) that the confidential application should be able to ask for on behalf of a user:

    :::image type="content" source="media/service-client-app/service-client-add-permission.png" alt-text="Service client. Delegated Permissions":::

1. Grant consent to the application. If you don't have the permissions required, check with your Azure Active Directory administrator:

    :::image type="content" source="media/service-client-app/service-client-grant-permission.png" alt-text="Service client. Grant Consent":::

## Application secret

The service client needs a secret (password) to obtain a token.

1. Select **Certificates & secrets**.
2. Select **New client secret**.

    ![Azure portal. Service Client Secret](media/add-azure-active-directory/portal-aad-register-new-app-registration-service-client-secret.png)

3. Provide a description and duration of the secret (either 1 year, 2 years or never).

4. Once the secret has been generated, it will only be displayed once in the portal. Make a note of it and store in a securely.

## Next steps

In this article, you've learned how to register a service client application in Azure Active Directory. Next, test access to your FHIR server using Postman.
 
>[!div class="nextstepaction"]
>[Access the FHIR service using Postman](../fhir/using-postman.md)
