<properties
	pageTitle="Azure Active Directory B2C preview: Amazon configuration | Microsoft Azure"
	description="Provide sign up and sign in to consumers with LinkedIn accounts in your applications secured by Azure Active Directory B2C"
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
	ms.date="09/22/2015"
	ms.author="swkrish"/>

# Azure Active Directory B2C preview: Provide Sign up and Sign in to Consumers with Amazon Accounts

[AZURE.INCLUDE [active-directory-b2c-preview-note](../../includes/active-directory-b2c-preview-note.md)]

## Create an Amazon Application

To use Amazon as an identity provider in Azure Active Directory (AD) B2C, you will first need to create an Amazon application and supply it with the right parameters. You will need an Amazon account to do this; if you don’t have one, you can get it at [http://www.amazon.com/](http://www.amazon.com/).

1. Go to the [Amazon Developers Center](https://login.amazon.com/) and sign in with your Amazon account credentials.
2. If you have not already done so, click **Sign Up**, follow the developer registration steps and accept the policy.
3. Click **Register new application**.

    ![Amazon - New app](./media/active-directory-b2c-setup-amzn-app/amzn-new-app.png)

4. Provide application information (**Name**, **Description** and **Privacy Notice URL**) and click **Save**.

    ![Amazon - Register app](./media/active-directory-b2c-setup-amzn-app/amzn-register-app.png)

5. In the **Web Settings** section, copy the values of **Client ID** and **Client secret** (you will need to click the **Show Secret** button to see this). You will need both of them to configure Amazon as an identity provider in your directory. Click **Edit** at the bottom of the section.

    > [AZURE.NOTE]
    **Client secret** is an important security credential.

    ![Amazon - Client secret](./media/active-directory-b2c-setup-amzn-app/amzn-client-secret.png)

6. Enter [https://login.microsoftonline.com](https://login.microsoftonline.com) in the **Allowed JavaScript origins** field and [https://login.microsoftonline.com/te/{directory}/oauth2/authresp](https://login.microsoftonline.com/te/{directory}/oauth2/authresp) in the **Allowed Return URLs** field, where **{directory}** is to be replaced with your directory's name (for example, contoso.onmicrosoft.com). Click **Save**.

    > [AZURE.NOTE]
    The **{directory}** value is case-sensitive.

    ![Amazon - URLs](./media/active-directory-b2c-setup-amzn-app/amzn-urls.png)

## Configure Amazon as an Identity Provider in your Directory

1. [Navigate to the B2C features blade on the Azure preview portal](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade).
2. On the B2C features blade, click **Social identity providers**.
3. Click **+Add** at the top of the blade.
4. Provide a friendly **Name** for the identity provider configuration. For example, enter "Amzn".
5. Click **Identity provider type**, select **Amazon** and click **OK**.
6. Click **Set up this identity provider** and enter the **Client ID** and **Client secret** of the Amazon application that you created earlier.
7. Click **OK** and then **Create** to save your Amazon configuration.
