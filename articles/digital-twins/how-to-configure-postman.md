---
title: How to configure Postman for Azure Digital Twins | Microsoft Docs
description: How to configure Postman for Azure Digital Twins
author: kingdomofends
manager: alinast
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 11/13/2018
ms.author: adgera
---

# How to configure Postman for Azure Digital Twins

This article describes how to configure an Azure Active Directory (Azure AD) application to use the OAuth 2.0 implicit grant flow. Then, it discusses how to configure the Postman REST client to make token-bearing HTTP requests to your Management APIs.

## Postman summary

Get started on Azure Digital Twins by using a REST client tool such as [Postman](https://www.getpostman.com/) to prepare your local testing environment. The Postman client helps to quickly create complex HTTP requests. Download the desktop version of the Postman client by going to [www.getpostman.com/apps](https://www.getpostman.com/apps).

[Postman](https://www.getpostman.com/) is a REST testing tool that locates key HTTP request functionalities into a useful desktop and plugin-based GUI. Through the Postman client, solutions developers can specify the kind of HTTP request (POST, GET, UPDATE, PATCH, and DELETE), API endpoint to call, and use of SSL. Postman also supports adding HTTP request headers, parameters, form-data, and bodies.

## Configure Azure Active Directory to use the OAuth 2.0 implicit grant flow

Configure your Azure AD app to use the OAuth 2.0 implicit grant flow.

1. Follow the steps in [this quickstart](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v1-integrate-apps-with-azure-ad) to create an Azure AD application of type Native. Or you can reuse an existing Native app registration.

1. Under **Required permissions**, enter `Azure Digital Twins` and select **Delegated Permissions**. Then select **Grant Permissions**.

    ![Azure AD app registrations add api](../../includes/media/digital-twins-permissions/aad-app-req-permissions.png)

1. Click **Manifest** to open the application manifest for your app. Set *oauth2AllowImplicitFlow* to `true`.

      ![Azure AD implicit flow][1]

1. Configure a **Reply URL** to [`https://www.getpostman.com/oauth2/callback`](https://www.getpostman.com/oauth2/callback).

      ![Azure AD Reply URL][2]

1. Copy and keep the **Application ID** of your Azure AD app. It is used below.

## Configure the Postman client

Next, set up and configure Postman to obtain an Azure AD token. Afterwards, make an authenticated HTTP request to Azure Digital Twins using the acquired token:

1. Go to [www.getpostman.com]([https://www.getpostman.com/) to download the app.
1. Ensure that your **Authorization URL** is correct. It should take the format:

    ```plaintext
    https://login.microsoftonline.com/YOUR_AZURE_TENANT.onmicrosoft.com/oauth2/authorize?resource=0b07f429-9f4b-4714-9392-cc5e8e80c8b0
    ```

    | Name  | Replace with | Example |
    |---------|---------|---------|
    | YOUR_AZURE_TENANT | The name of your tenant or organization | `microsoft` |

1. Select the **Authorization** tab, select **OAuth 2.0**, and then select **Get New Access Token**.

    | Field  | Value |
    |---------|---------|
    | Grant Type | `Implicit` |
    | Callback URL | [`https://www.getpostman.com/oauth2/callback`](https://www.getpostman.com/oauth2/callback) |
    | Auth URL | Use the **Authorization URL** from step 2 above |
    | Client ID | Use the **Application ID** for the Azure AD app that was created or repurposed from the previous section |
    | Scope | Leave blank |
    | State | Leave blank |
    | Client Authentication | `Send as Basic Auth header` |

1. The client should now look like:

   ![Postman client example][3]

1. Select **Request Token**.

    >[!NOTE]
    >If you receive the error message "OAuth 2 couldn’t be completed," try the following:
    > * Close Postman, and reopen it and try again.
  
1. Scroll down, and select **Use Token**.

## Next steps

To learn about authenticating with the Management APIs, read [Authenticate with APIs](./security-authenticating-apis.md).

<!-- Images -->
[1]: media/how-to-configure-postman/implicit-flow.png
[2]: media/how-to-configure-postman/reply-url.png
[3]: media/how-to-configure-postman/postman-oauth-token.png
