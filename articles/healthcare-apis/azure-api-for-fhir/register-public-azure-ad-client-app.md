---
title: Register a public client app in Microsoft Entra ID - Azure API for FHIR
description: This article explains how to register a public client application in Microsoft Entra ID, in preparation for deploying FHIR API in Azure.
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: conceptual
ms.date: 09/27/2023
ms.author: kesheth
---

# Register a public client application in Microsoft Entra ID for Azure API for FHIR

[!INCLUDE[retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

In this article, you learn how to register a public application in Microsoft Entra ID.  

Client application registrations are Microsoft Entra representations of applications that can authenticate and ask for API permissions on behalf of a user. Public clients are applications such as mobile applications and single page JavaScript applications that can't keep secrets confidential. The procedure is similar to [registering a confidential client](register-confidential-azure-ad-client-app.md), but since public clients can't be trusted to hold an application secret, there's no need to add one.

This quickstart provides general information about how to [register an application with the Microsoft identity platform](../../active-directory/develop/quickstart-register-app.md).

## App registrations in Azure portal

1. In the [Azure portal](https://portal.azure.com), on the left navigation panel, select **Microsoft Entra ID**.

2. In the **Microsoft Entra ID** blade, select **App registrations**:

    ![Azure portal. New App Registration.](media/add-azure-active-directory/portal-aad-new-app-registration.png)

3. Select **New registration**.

## Application registration overview

1. Give the application a display name.

2. Provide a reply URL. The reply URL is where authentication codes are returned to the client application. You can add more reply URLs and edit existing ones later.

    ![Azure portal. New public App Registration.](media/add-azure-active-directory/portal-aad-register-new-app-registration-pub-client-name.png)


To configure your [desktop](../../active-directory/develop/scenario-desktop-app-registration.md), [mobile](../../active-directory/develop/scenario-mobile-app-registration.md) or [single-page](../../active-directory/develop/scenario-spa-app-registration.md) application as public application:

1. In the [Azure portal](https://portal.azure.com), in **App registrations**, select your app, and then select **Authentication**.

2. Select **Advanced settings** > **Default client type**. For **Treat application as a public client**, select **Yes**.

3. For a single-page application, select **Access tokens** and **ID tokens** to enable implicit flow.

   - If your application signs in users, select **ID tokens**.
   - If your application also needs to call a protected web API, select **Access tokens**.

## API permissions

Permissions for Azure API for FHIR are managed through role-based access control (RBAC). For more details, visit [Configure Azure RBAC for FHIR](configure-azure-rbac.md).

>[!NOTE]
>Use a `grant_type` of `client_credentials` when trying to obtain an access token for Azure API for FHIR using tools for intuitive querying.

## Validate FHIR server authority
If the application you registered and your FHIR server are in the same Microsoft Entra tenant, you're good to proceed to the next steps.

If you configure your client application in a different Microsoft Entra tenant from your FHIR server, you need to update the **Authority**. In Azure API for FHIR, you do set the Authority under **Settings** > **Authentication**. Set your Authority to `https://login.microsoftonline.com/\<TENANT-ID>`.

## Next steps

In this article, you learned how to register a public client application in Microsoft Entra ID. Next, test access to your FHIR Server using REST Client.
 
>[!div class="nextstepaction"]
>[Access the FHIR service using REST Client](./../fhir/using-rest-client.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]