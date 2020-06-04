---
title: Add an API connector to a user flow 
description: Configure a web API to be used in a user flow.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 04/20/2020

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: mal
ms.custom: "it-pro"                 
ms.collection: M365-identity-device-management
---

# Add an API connector to a user flow

To use an [API connector](api-connectors-overview.md), you first create the API connector and then enable it in a user flow.

## Create an API connector

1. Sign in to the [Azure portal](https://portal.azure.com/) as an Azure AD administrator.
2. Under **Azure services**, select **Azure Active Directory**.
3. In the left menu, select **External Identities**.
4. Select **All API connectors (Preview)**, and then select **New API connector**.

    ![Add a new API connector](./media/self-service-sign-up-add-api-connector/api-connector-new.png)

5. Provide a display name for the call. For example, **Check approval status**.
6. Provide the **Endpoint URL** for the API call.
7. Provide the authentication information for the API.

   > [!NOTE]
   > Only Basic Authentication is currently supported. If you wish to use an API without Basic Authentication for development purposes, enter a dummy **Username** and **Password**, so that your API will ignore it. For use with an Azure Function with an API key, you can include the code as a query parameter in the **Endpoint URL** ( for example, https[]()://contoso.azurewebsites.net/api/endpoint<b>?code=0123456789</b>).

   ![Add a new API connector](./media/self-service-sign-up-add-api-connector/api-connector-config.png)

8. Select the claims you want to send to the API.
9. Select any claims you plan to receive back from the API.
 
    ![Set API connector claims](./media/self-service-sign-up-add-api-connector/api-connector-claims.png)

10. Select **Save**.

> [!TIP]
> [**Identities ('identities')**](https://docs.microsoft.com/graph/api/resources/objectidentity?view=graph-rest-1.0) and the **Email Address ('email_address')** claims can be used to identify a user before they have an account in your tenant. These claims are always sent.

> [!NOTE]
> - The **UI Locales ('ui_locales')** claim is sent by default in all requests. It provides a user's locale(s) and can be used by the API to return internationalized responses. It doesn't appear in the API configuration pane.
> - If a claim to send does not have a value at the time the API endpoint is called, the claim will not be sent to the API.
> - Custom attributes can be created for the user using the **extension_\<app-id>_\<CamelCaseAttributeName>** format. Your API should expect to receive and return claims in this same serialized format. For more information about custom and extension attributes, see [Add custom data to users using open extensions](user-flow-add-custom-attributes.md).
<!--TODO: Nick, ask Shantanu what happens if an API doesn't return a claim that's marked as 'claim to receive'. Does the call fail?-->
 
## Enable the API connector in a user flow

Follow these steps to add an API connector to a self-service sign-up user flow.

1. Sign in to the [Azure portal](https://portal.azure.com/) as an Azure AD administrator.
2. Under **Azure services**, select **Azure Active Directory**.
3. In the left menu, select **External Identities**.
4. Select **User flows (Preview)**, and then select the user flow you want to add the API connector to.
5. Select **API connectors**, and then select the API endpoints you want to invoke at the following steps in the user flow:
   - **After signing in with an identity provider**
   - **Before creating the user**

   ![Add APIs to the user flow](./media/self-service-sign-up-add-api-connector/api-connectors-user-flow-select.png)

6. Select **Save**.


## Next steps
- Learn [how your API should respond](api-connectors-overview.md#expected-response-types-from-the-web-api)
- Learn [where you can enable an API connector](api-connectors-overview.md#where-you-can-enable-an-API-connector-for-a-user-flow)
- Learn how to [add a custom approval system to self-service sign-up](self-service-sign-up-add-approvals.md)
- Learn how to [use API connectors for identity proofing using IDology](sample-identity-proofing-idology.md) <!--#TODO: Make doc, link.-->