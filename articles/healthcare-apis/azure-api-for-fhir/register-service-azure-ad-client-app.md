---
title: Register a service app in Microsoft Entra ID - Azure API for FHIR
description: Learn how to register a service client application in Microsoft Entra ID. 
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: conceptual
ms.date: 09/27/2023
ms.author: kesheth
---

# Register a service client application in Microsoft Entra ID for Azure API for FHIR

[!INCLUDE[retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

In this article, you learn how to register a service client application in Microsoft Entra ID. Client application registrations are Microsoft Entra representations of applications that can be used to authenticate and obtain tokens. A service client is intended to be used by an application to obtain an access token without interactive authentication of a user. It has certain application permissions and can use an application secret (password) when obtaining access tokens.

Follow these steps to create a new service client.

## App registrations in Azure portal

1. In the [Azure portal](https://portal.azure.com), navigate to **Microsoft Entra ID**.

2. Select **App registrations**.

    ![Azure portal. New App Registration.](media/add-azure-active-directory/portal-aad-new-app-registration.png)

3. Select **New registration**.

4. Give the service client a display name. Service client applications typically don't use a reply URL.

    :::image type="content" source="media/service-client-app/service-client-registration.png" alt-text="Azure portal. New Service Client App Registration.":::

5. Select **Register**.

## API permissions

Permissions for Azure API for FHIR are managed through role-based access control (RBAC). For more details, visit [Configure Azure RBAC for FHIR](configure-azure-rbac.md).

>[!NOTE]
>Use a `grant_type` of `client_credentials` when trying to obtain an access token for Azure API for FHIR using tools such as Postman. For more details, visit [Testing the FHIR API on Azure API for FHIR](tutorial-web-app-test-postman.md).

## Application secret

The service client needs a secret (password) to obtain a token.

1. Select **Certificates & secrets**.
2. Select **New client secret**.

    ![Azure portal. Service Client Secret](media/add-azure-active-directory/portal-aad-register-new-app-registration-service-client-secret.png)

3. Provide a description and duration of the secret (either one year, two years or never).

4. Once the secret is generated, it will only be displayed once in the portal. Make a note of it and store it in a secure location.

## Next steps

In this article, you learned how to register a service client application in Microsoft Entra ID. Next, test access to your FHIR server using Postman.
 
>[!div class="nextstepaction"]
>[Access the FHIR service using Postman](./../fhir/use-postman.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]