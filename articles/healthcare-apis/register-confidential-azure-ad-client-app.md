---
title: Register a confidential client app in Azure AD - Azure API for FHIR
description: Register a confidential client application in Azure Active Directory that authenticates on a user's behalf and requests access to resource applications.
services: healthcare-apis
author: matjazl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 02/07/2019
ms.author: matjazl
---

# Register a confidential client application in Azure Active Directory

In this tutorial, you'll learn how to register a confidential client application in Azure Active Directory. 

A client application registration is an Azure Active Directory representation of an application that can be used to authenticate on behalf of a user and request access to [resource applications](register-resource-azure-ad-client-app.md). A confidential client application is an application that can be trusted to hold a secret and present that secret when requesting access tokens. Examples of confidential applications are server-side applications.

To register a new confidential application in the portal, follow these steps.

## Register a new application

1. In the [Azure portal](https://portal.azure.com), navigate to **Azure Active Directory**.

1. Select **App registrations**.

    ![Azure portal. New App Registration.](media/how-to-aad/portal-aad-new-app-registration.png)

1. Select **New registration**.

1. Give the application a display name.

1. Provide a reply URL. These details can be changed later, but if you know the reply URL of your application, enter it now.

    ![New Confidential Client App Registration.](media/how-to-aad/portal-aad-register-new-app-registration-CONF-CLIENT.png)
1. Select **Register**.

## API permissions

Now that you have registered your application, you'll need to select which API permissions this application should be able to request on behalf of users:

1. Select **API permissions**.

    ![Confidential client. API Permissions](media/how-to-aad/portal-aad-register-new-app-registration-CONF-CLIENT-API-Permissions.png)

1. Select **Add a permission**.

    If you are using the Azure API for FHIR, you will add a permission to the Azure Healthcare APIs by searching for **Azure Healthcare APIs** under **APIs my organization uses**. You will only be able to find this if you have already [deployed the Azure API for FHIR](fhir-paas-powershell-quickstart.md).

    If you are referencing a different Resource Application, select your [FHIR API Resource Application Registration](register-resource-azure-ad-client-app.md) that you created previously under **My APIs**.


    :::image type="content" source="media/conf-client-app/confidential-client-org-api.png" alt-text="Confidential client. My Org APIs" lightbox="media/conf-client-app/confidential-app-org-api-expanded.png":::
    

3. Select scopes (permissions) that the confidential application should be able to ask for on behalf of a user:

    :::image type="content" source="media/conf-client-app/confidential-client-add-permission.png" alt-text="Confidential client. Delegated Permissions":::

## Application secret

1. Select **Certificates & secrets**.
1. Select **New client secret**. 

    ![Confidential client. Application Secret](media/how-to-aad/portal-aad-register-new-app-registration-CONF-CLIENT-SECRET.png)

2. Provide a description and duration of the secret (either 1 year, 2 years or never).

3. Once generated, it will be displayed in the portal only once. Make a note of it and store it securely.

## Next steps

In this article, you've learned how to register a confidential client application in Azure Active Directory. Next you can access your FHIR server using Postman
 
>[!div class="nextstepaction"]
>[Access Azure API for FHIR with Postman](access-fhir-postman-tutorial.md)
