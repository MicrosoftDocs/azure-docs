---
title: Add an API connector to a user flow 
description: Configure a web API to be used in a user flow.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 04/20/2020

ms.author: edgomezc
author: edgomezc
manager: kexia
ms.reviewer: mal
ms.custom: "it-pro"                 
ms.collection: M365-identity-device-management
---

# Add an API connector

To use an [API connector](api-connectors-overview.md), you first [create the API connector](#create-an-api-connector) and then [enabling it in a user flow](#enable-the-api-connector-in-a-user-flow). 

## Create an API connector

1. Sign in to the [Azure portal](https://portal.azure.com/) as an Azure AD administrator.
2. Under **Azure services**, select **Azure Active Directory**.
3. In the left menu, select **External Identities**.
4. Select **All API connectors (Preview)**, and then select **New API connector**.

    ![Add a new API connector](./media/api-connectors-set-up-api/api-connectors-new-api.png)

5. Provide a display name for the call. For example, **Check approval status**.
6. Provide the **Endpoint URL** for the API call.
7. Provide the authentication information for the API.

> [!NOTE]
> Only Basic Authentication is currently supported. If you wish to use an API without Basic Authentication for development purposes, put in a dummy **Username** and **Password**, your API can ignore it. For use with an Azure Functions with an API key, you can include the code as a query parameter in the **Endpoint URL** (e.g. `https://contosouserflows.azurewebsites.net/api/endpoint`**?code=123456789**).

    ![Configure an API connector](./media/api-connectors-set-up-api/api-connectors-configure.png)

8. Select the claims that you want to send to the API. 
9. Select any claims that you plan to receive back from the API, if any.
 
    ![Set API connector claims](./media/api-connectors-set-up-api/api-connectors-claims.png)
 
10. To take advantage of the two hooks previously described for a user flow, repeat steps 1 through 9 to add a **Create new approval** API.

> [!TIP]
> **Identities ('identities')** and the **Email Address ('email_address')** claims can be used to identify a user before they have an account in your tenant. They are always sent.

> [!NOTE]
> The **UI Locales ('ui_locales')** claim is sent by default in all requests. It provides a user's locale(s) and can be used by the API to return internationalized responses. It doesn't appear in the API configuration pane.

 
## Enable the API connector in a user flow

These steps show how to add an API connector to a self-service sign-up user flow:

1. Sign in to the [Azure portal](https://portal.azure.com/) as an Azure AD administrator.
2. Under **Azure services**, select **Azure Active Directory**.
3. In the left menu, select **External Identities**.
4. Select **User flows (Preview)**, and then select the user flow you want to add the API connector to.
5. Select **API connectors**, and then select the API endpoints you want to invoke at the following steps in the user flow:
   - **After signing in with an identity provider**
   - **Before creating the user**

   ![Add APIs to the user flow](./media/api-connectors-user-flow/api-connectors-user-flow-select.png)

6. Select **Save**.

## Next steps
- Learn [how your Web API should respond](api-connectors-overview.md#expected-response-types-from-the-web-api)
- Learn [where you can enable an API connector](api-connectors-overview.md#where-you-can-enable-an-API-connector-for-a-user-flow)
- Learn how to [add an approval system to self service sign up](self-service-sign-up-add-approvals.md)
- Learn how to [use API connectors for identity proofing using IDology](sample-identity-proofing-idology.md) <!--#TODO: Make doc, link.-->