---
title: "Quickstart: Set up sign in for a single-page app (SPA)"
titleSuffix: Azure AD B2C
description: In this Quickstart, run a sample single-page application that uses Azure Active Directory B2C to provide account sign-in.

author: garrodonnell
manager: CelesteDG
ms.service: active-directory

ms.topic: quickstart
ms.date: 02/23/2023
ms.author: godonnell
ms.subservice: B2C
ms.custom: mode-other
---

# Quickstart: Set up sign in for a single-page app using Azure Active Directory B2C

Azure Active Directory B2C (Azure AD B2C) provides cloud identity management to keep your application, business, and customers protected. Azure AD B2C enables your applications to authenticate to social accounts, and enterprise accounts using open standard protocols. 

In this quickstart, you use a single-page application to sign in using a social identity provider and call an Azure AD B2C protected web API.

<!--[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] -->

## Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/en/download/)
- Social account from Facebook, Google, or Microsoft
- Code sample from GitHub: [ms-identity-b2c-javascript-spa](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa):

    You can [download the zip archive](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa/archive/main.zip) or clone the repository

    ```console
    git clone https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa.git
    ```

## Run the application

1. Start the server by running the following commands from the Node.js command prompt:

    ```console
    npm install
    npm update
    npm start
    ```

    The server started by *server.js* displays the port it's listening on:

    ```console
    Listening on port 6420...
    ```

1. Browse to the URL of the application. For example, `http://localhost:6420`.

:::image type="content" source="./media/quickstart-single-page-app/sample-app-spa.png" alt-text="Screenshot of single-page application sample app shown in browser window." lightbox="./media/quickstart-single-page-app/sample-app-spa.png":::

## Sign in using your account

1. Select **Sign In** to start the user journey.
1. Azure AD B2C presents a sign-in page for a fictitious company called "Fabrikam" for the sample web application. To sign up using a social identity provider, select the button of the identity provider you want to use.

    :::image type="content" source="./media/quickstart-single-page-app/sign-in-or-sign-up-spa.png" alt-text="Screenshot of Sign In or Sign Up page showing identity         provider buttons" lightbox="./media/quickstart-single-page-app/sign-in-or-sign-up-spa.png":::

    You authenticate (sign in) using your social account credentials and authorize the application to read information from your social account. By granting access,       the application can retrieve profile information from the social account such as your name and city.

1. Finish the sign-in process for the identity provider.

## Access a protected API resource

Select **Call API** to have your display name returned from the web API as a JSON object.

:::image type="content" source="./media/quickstart-single-page-app/call-api-spa.png" alt-text="Screenshot of web API response showing in sample application in browser window." lightbox="./media/quickstart-single-page-app/sample-app-spa.png":::

The sample single-page application includes an access token in the request to the protected web API resource.

<!-- ## Clean up resources

You can use your Azure AD B2C tenant if you plan to try other Azure AD B2C quickstarts or tutorials. When no longer needed, you can [delete your Azure AD B2C tenant](faq.yml#how-do-i-delete-my-azure-ad-b2c-tenant-).-->

## Next steps

<!---In this quickstart, you used a sample single-page application to:

- Sign in with a social identity provider
- Create an Azure AD B2C user account (created automatically at sign-in)
- Call a web API protected by Azure AD B2C -->

- Get started creating your own [Azure Active Directory B2C tenant in the Azure portal](tutorial-create-tenant.md)
