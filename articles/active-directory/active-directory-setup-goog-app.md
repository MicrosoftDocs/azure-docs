<properties
	pageTitle="Create a Google+ application - Azure Active Directory B2C"
	description="How to create a Google+ application - Azure Active Directory B2C"
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
	ms.date="08/10/2015"
	ms.author="swkrish"/>

# How to create a Google+ application that works with Azure Active Directory B2C

To use Google+ as an identity provider in Azure AD B2C, you will first need to create a Google+ application and supply it with the right parameters. You will need a Google+ account to do this; if you don’t have one, you can get it at [https://accounts.google.com/SignUp](https://accounts.google.com/SignUp).

- Go to the [Google Developers Console](https://console.developers.google.com/) and sign in with your Google+ account credentials.
- Click **Create Project**, enter a **Project name** and then click **Create**.
- Click **APIs & Auth** and then **Credentials** in the left hand navigation.
- Click **Create new Client ID** under the **OAuth** section.
- Under **Application type**, select **Web application**. Click **Configure consent screen**.
- Specify a valid **Email address**, provide a **Product name** and click **Save**.
- On the **Create Client ID** dialog, enter `https://login.microsoftonline.com` in the **Authorized JavaScript origins** field and `https://login.microsoftonline.com/te/<directory>/oauth2/authresp` in the **Authorized redirect URIs** field, where `<directory>` should be replaced with your directory's name (for example, contoso.onmicrosoft.com). Click **Create Client ID**.

> [AZURE.NOTE]
The directory's name is case-sensitive.

- Copy the values of **Client ID** and **Client secret**. You will need both of them to configure Google+ as an identity provider in your directory.

> [AZURE.NOTE]
**Client secret** is an important security credential.

You can go back to the Azure AD B2C features blade on the [Azure Portal](htts://portal.azure.com/) to setup Google+ as an identity provider.
