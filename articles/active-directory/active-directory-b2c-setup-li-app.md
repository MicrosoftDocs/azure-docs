<properties
	pageTitle="Azure AD B2C preview | Microsoft Azure"
	description="Provide sign up and sign in to consumers with LinkedIn accounts in your applications secured by Azure AD B2C"
	services="active-directory"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="curtand"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/11/2015"
	ms.author="swkrish"/>

# Azure AD B2C preview: Provide sign up and sign in to consumers with LinkedIn accounts in your applications

## Create a LinkedIn application

To use LinkedIn as an identity provider in Azure AD B2C, you will first need to create a LinkedIn application and supply it with the right parameters. You will need a LinkedIn account to do this; if you don’t have one, you can get it at [https://www.linkedin.com/](https://www.linkedin.com/).

1. Go to the [LinkedIn Developers website](https://www.developer.linkedin.com/) and sign in with your LinkedIn account credentials.
2. Click **My Apps** in the top menu bar and then **Create Application**.

    ![LinkedIn - New app](../media/active-directory-b2c/linkedin-new-app.png)

3. In the **Create a New Application** form, fill in the relevant information (**Company Name**, **Name**, **Description**, **Application Logo URL**, **Application Use**, **Website URL**, **Business Email** and **Business Phone**).
4. Agree to the LinkedIn API Terms of Use and click **Submit**.

    ![LinkedIn - Register app](../media/active-directory-b2c/linkedin-register-app.png)

5. Copy the values of **Client ID** and **Client Secret** (you can find them under the **Authentication Keys** section). You will need both of them to configure LinkedIn as an identity provider in your directory.

    > [AZURE.NOTE]
    **Client Secret** is an important security credential.

6. Enter [https://login.microsoftonline.com/te/{directory}/oauth2/authresp](https://login.microsoftonline.com/te/{directory}/oauth2/authresp) in the **Authorized Redirect URLs** field (under the **OAuth 2.0** section), where **{directory}** is to be replaced with your directory's name (for e.g., contoso.onmicrosoft.com) and click **Add**. Then click **Update**.

    ![LinkedIn - Setup app](../media/active-directory-b2c/linkedin-setup.png)

## Configure LinkedIn as an identity provider in your directory

1. [Navigate to the B2C features blade on the Azure Portal](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade-on-the-azure-portal).
2. On the B2C features blade, click **Social identity providers**.
3. Click **+Add** at the top of the blade.
4. Provide a friendly **Name** for the identity provider configuration. For e.g., enter "LI".
5. Click **Identity provider type**, select **LinkedIn** and click **OK**.

    ![LinkedIn - B2C](../media/active-directory-b2c/linkedin-b2c.png)

6. Click **Set up this identity provider** and enter the **Client ID** and **Client secret** of the LinkedIn application that you created earlier.

    ![LinkedIn - B2C setup](../media/active-directory-b2c/linkedin-b2c-setup.png)

7. Click **OK** and then **Create** to save your LinkedIn configuration.
