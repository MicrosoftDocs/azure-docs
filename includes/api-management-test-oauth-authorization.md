---

title: include file
description: include file
services: api-management
author: dlepow

ms.service: api-management
ms.topic: include
ms.date: 08/20/2021
ms.author: danlep
ms.custom: 
---

Once you've configured your OAuth 2.0 authorization server and configured your API to use that server, you can test it by going to the developer portal and calling an API. 

1. Select **Developer portal** in the top menu from your Azure API Management instance **Overview** page.
1. Browse to any operation under the API in the developer portal. 
1. Select **Try it** to bring you to the developer console.

1. Note a new item in the **Authorization** section, corresponding to the authorization server you just added.

1. Select **Authorization code** from the authorization drop-down list. 

    :::image type="content" source="../includes/media/api-management-test-oauth-authorization/select-authorization-code-authorization.png" alt-text="Select Authorization code authorization":::
1. Once prompted, sign in to the Microsoft Entra tenant. 
    * If you are already signed into the account, you might not be prompted.

1. After successful sign-in, an `Authorization` header is added to the request, with an access token from Microsoft Entra ID. The following is an abbreviated sample token (Base64 encoded):

   ```
   Authorization: Bearer eyJ0eXAiOi[...]3pkCfvEOyA
   ```

1. Configure the desired values for the remaining parameters, and select **Send** to call the API.
