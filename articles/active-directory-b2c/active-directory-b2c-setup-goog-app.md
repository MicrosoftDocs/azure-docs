<properties
	pageTitle="Azure Active Directory B2C preview: Google+ configuration | Microsoft Azure"
	description="Provide sign up and sign in to consumers with Google+ accounts in your applications secured by Azure Active Directory B2C"
	services="active-directory-b2c"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="curtand"/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/28/2015"
	ms.author="swkrish"/>

# Azure Active Directory B2C preview: Provide Sign up and Sign in to Consumers with Google+ Accounts

[AZURE.INCLUDE [active-directory-b2c-preview-note](../../includes/active-directory-b2c-preview-note.md)]

## Create a Google+ Application

To use Google+ as an identity provider in Azure Active Directory (AD) B2C, you will first need to create a Google+ application and supply it with the right parameters. You will need a Google+ account to do this; if you don’t have one, you can get it at [https://accounts.google.com/SignUp](https://accounts.google.com/SignUp).

1. Go to the [Google Developers Console](https://console.developers.google.com/) and sign in with your Google+ account credentials.
2. Click **Create Project**, enter a **Project name**, agree to the Terms of Service and then click **Create**.

    ![G+ - Get started](./media/active-directory-b2c-setup-goog-app/google-get-started.png)

    ![G+ - New project](./media/active-directory-b2c-setup-goog-app/google-new-project.png)

3. Click **APIs & Auth** and then **Credentials** in the left hand navigation.
4. Click the **OAuth consent screen** tab at the top.

    ![G+ - Credentials](./media/active-directory-b2c-setup-goog-app/google-add-cred.png)

5. Select or specify a valid **Email address**, provide a **Product name** and click **Save**.

    ![G+ - OAuth consent screen](./media/active-directory-b2c-setup-goog-app/google-consent-screen.png)

6. Click on **Add credentials** and then choose **OAuth 2.0 client ID**.

    ![G+ - OAuth consent screen](./media/active-directory-b2c-setup-goog-app/google-add-oauth2-client-id.png)

7. Under **Application type**, select **Web application**.

    ![G+ - OAuth consent screen](./media/active-directory-b2c-setup-goog-app/google-web-app.png)

8. Provide a **Name** for your application, enter [https://login.microsoftonline.com](https://login.microsoftonline.com) in the **Authorized redirect URIs** field and [https://login.microsoftonline.com/te/{tenant}/oauth2/authresp](https://login.microsoftonline.com/te/{tenant}/oauth2/authresp) in the **Authorized redirect URIs** field, where **{tenant}** is to be replaced with your tenant's name (for example, contosob2c.onmicrosoft.com). Click **Create**.

    > [AZURE.NOTE]
    The **{tenant}** value is case-sensitive.

    ![G+ - Create client ID](./media/active-directory-b2c-setup-goog-app/google-create-client-id.png)

9. Copy the values of **Client ID** and **Client secret**. You will need both of them to configure Google+ as an identity provider in your tenant.

    > [AZURE.NOTE]
    **Client secret** is an important security credential.

    ![G+ - Client secret](./media/active-directory-b2c-setup-goog-app/google-client-secret.png)

## Configure Google+ as an Identity Provider in your Tenant

1. [Navigate to the B2C features blade on the Azure preview portal](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade).
2. On the B2C features blade, click **Identity providers**.
3. Click **+Add** at the top of the blade.
4. Provide a friendly **Name** for the identity provider configuration. For example, enter "G+".
5. Click **Identity provider type**, select **Google** and click **OK**.
6. Click **Set up this identity provider** and enter the **Client ID** and **Client secret** of the Google+ application that you created earlier.
7. Click **OK** and then **Create** to save your Google+ configuration.
