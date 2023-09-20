---
title: Register a confidential client app in Azure AD - Azure API for FHIR
description: Register a confidential client application in Azure Active Directory that authenticates on a user's behalf and requests access to resource applications.
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 09/27/2023
ms.author: kesheth
---

# Register a confidential client application in Azure Active Directory for Azure API for FHIR

[!INCLUDE [retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

In this tutorial, you'll learn how to register a confidential client application in Azure Active Directory (Azure AD).  

A client application registration is an Azure AD representation of an application that can be used to authenticate on behalf of a user and request access to [resource applications](register-resource-azure-ad-client-app.md). A confidential client application is an application that can be trusted to hold a secret and present that secret when requesting access tokens. Examples of confidential applications are server-side applications. 

To register a new confidential client application, refer to the steps below. 

## Register a new application

1. In the [Azure portal](https://portal.azure.com), select **Azure Active Directory**.

1. Select **App registrations**. 

    :::image type="content" source="media/add-azure-active-directory/portal-aad-new-app-registration.png" alt-text="Azure portal. New App Registration.":::

1. Select **New registration**.

1. Give the application a user-facing display name.

1. For **Supported account types**, select who can use the application or access the API.

1. (Optional) Provide a **Redirect URI**. These details can be changed later, but if you know the reply URL of your application, enter it now.

    :::image type="content" source="media/add-azure-active-directory/portal-aad-register-new-app-registration-confidential-client.png" alt-text="New Confidential Client App Registration.":::

1. Select **Register**.

## API permissions

Permissions for Azure API for FHIR are managed through RBAC. For more details, visit [Configure Azure RBAC for FHIR](configure-azure-rbac.md).

>[!NOTE]
>Use  grant_type of client_credentials when trying to otain an access token for Azure API for FHIR using tools such as Postman. For more details, visit [Testing the FHIR API on Azure API for FHIR](tutorial-web-app-test-postman.md).


## Application secret

1. Select **Certificates & secrets**, and then select **New client secret**. 

    :::image type="content" source="media/add-azure-active-directory/portal-aad-register-new-app-registration-confidential-client-secret.png" alt-text="Confidential client. Application Secret.":::

1. Enter a **Description** for the client secret. Select the **Expires** drop-down menu to choose an expiration time frame, and then click **Add**.

   :::image type="content" source="media/add-azure-active-directory/add-a-client-secret.png" alt-text="Add a client secret.":::

1. After the client secret string is created, copy its **Value** and **ID**, and store them in a secure location of your choice.

   :::image type="content" source="media/add-azure-active-directory/client-secret-string-password.png" alt-text="Client secret string."::: 

> [!NOTE]
>The client secret string is visible only once in the Azure portal. When you navigate away from the Certificates & secrets web page and then return back to it, the Value string becomes masked. It's important to make a copy your client secret string immediately after it is generated. If you don't have a backup copy of your client secret, you must repeat the above steps to regenerate it.
 
## Next steps

In this article, you were guided through the steps of how to register a confidential client application in the Azure AD. You were also guided through the steps of how to add API permissions in Azure AD for Azure API for FHIR. Lastly, you were shown how to create an application secret. Furthermore, you can learn how to access your FHIR server using Postman.
 
>[!div class="nextstepaction"]
>[Access the FHIR service using Postman](./../fhir/use-postman.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
