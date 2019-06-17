---
title: 'How to configure Postman for Azure Digital Twins | Microsoft Docs'
description: How to configure Postman for Azure Digital Twins.
author: kingdomofends
manager: alinast
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 06/05/2019
ms.author: v-adgera
---

# How to configure Postman for Azure Digital Twins

This article describes how to configure the Postman REST client to interact with and test the Azure Digital Twins Management APIs. Specifically, it describes:

* How to configure an Azure Active Directory application to use the OAuth 2.0 implicit grant flow.
* How to use the Postman REST client to make token-bearing HTTP requests to your Management APIs.
* How to use Postman to make multipart POST requests to your Management APIs.

## Postman summary

Get started on Azure Digital Twins by using a REST client tool such as [Postman](https://www.getpostman.com/) to prepare your local testing environment. The Postman client helps to quickly create complex HTTP requests. Download the desktop version of the Postman client by going to [www.getpostman.com/apps](https://www.getpostman.com/apps).

[Postman](https://www.getpostman.com/) is a REST testing tool that locates key HTTP request functionalities into a useful desktop and plugin-based GUI.

Through the Postman client, solutions developers can specify the kind of HTTP request (*POST*, *GET*, *UPDATE*, *PATCH*, and *DELETE*), API endpoint to call, and use of SSL. Postman also supports adding HTTP request headers, parameters, form-data, and bodies.

## Configure Azure Active Directory to use the OAuth 2.0 implicit grant flow

Configure your Azure Active Directory app to use the OAuth 2.0 implicit grant flow.

1. Follow the steps in [this quickstart](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v1-integrate-apps-with-azure-ad) to create an Azure AD application of type Native. Or you can reuse an existing Native app registration.

1. Under **Required permissions**, select **Add** and enter **Azure Digital Twins** under **Add API access**. If your search doesn't locate the API, search for **Azure Smart Spaces** instead. Then, select **Grant Permissions > Delegated Permissions** and **Done**.

    [![Azure Active Directory app registrations add api](../../includes/media/digital-twins-permissions/aad-app-req-permissions.png)](../../includes/media/digital-twins-permissions/aad-app-req-permissions.png#lightbox)

1. Select **Manifest** to open the application manifest for your app. Set *oauth2AllowImplicitFlow* to `true`.

    [![Azure Active Directory implicit flow](media/how-to-configure-postman/implicit-flow.png)](media/how-to-configure-postman/implicit-flow.png#lightbox)

1. Configure a **Reply URL** to `https://www.getpostman.com/oauth2/callback`.

    [![Azure Active Directory Reply URL](media/how-to-configure-postman/reply-url.png)](media/how-to-configure-postman/reply-url.png#lightbox)

1. Copy and keep the **Application ID** of your Azure Active Directory app. It's used in the steps that follow.

## Obtain an OAuth 2.0 token

Next, set up and configure Postman to obtain an Azure Active Directory token. Afterwards, make an authenticated HTTP request to Azure Digital Twins using the acquired token:

1. Go to [www.getpostman.com](https://www.getpostman.com/) to download the app.
1. Verify that your **Authorization URL** is correct. It should take the format:

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
    | Callback URL | `https://www.getpostman.com/oauth2/callback` |
    | Auth URL | Use the **Authorization URL** from step 2 |
    | Client ID | Use the **Application ID** for the Azure Active Directory app that was created or repurposed from the previous section |
    | Scope | Leave blank |
    | State | Leave blank |
    | Client Authentication | `Send as Basic Auth header` |

1. The client should now appear as:

    [![Postman client example](media/how-to-configure-postman/postman-oauth-token.png)](media/how-to-configure-postman/postman-oauth-token.png#lightbox)

1. Select **Request Token**.

    >[!TIP]
    >If you receive the error message "OAuth 2 couldn’t be completed," try the following:
    > * Close Postman, and reopen it and try again.
  
1. Scroll down, and select **Use Token**.

<div id="multi"></div>

## Make a multipart POST request

After completing the previous steps, configure Postman to make an authenticated HTTP multipart POST request:

1. Under the **Header** tab, add an HTTP request header key **Content-Type** with value `multipart/mixed`.

   [![Content type multipart/mixed](media/how-to-configure-postman/content-type.png)](media/how-to-configure-postman/content-type.png#lightbox)

1. Serialize non-text data into files. JSON data would be saved as a JSON file.
1. Under the **Body** tab, add each file by assigning a **key** name, selecting `file` or `text`.
1. Then, select each file through the **Choose File** button.

   [![Postman client example](media/how-to-configure-postman/form-body.png)](media/how-to-configure-postman/form-body.png#lightbox)

   >[!NOTE]
   > * The Postman client does not require that multipart chunks have a manually assigned **Content-Type** or **Content-Disposition**.
   > * You do not need to specify those headers for each part.
   > * You must select `multipart/mixed` or another appropriate  **Content-Type** for the entire request.

1. Lastly, select **Send** to submit your multipart HTTP POST request.

## Next steps

- To learn about the Digital Twins management APIs, and how to use them, read [How to use Azure Digital Twins management APIs](how-to-navigate-apis.md).

- Use multipart requests to [add blobs to Azure Digital Twins' entities](./how-to-add-blobs.md).

- To learn about authenticating with the Management APIs, read [Authenticate with APIs](./security-authenticating-apis.md).