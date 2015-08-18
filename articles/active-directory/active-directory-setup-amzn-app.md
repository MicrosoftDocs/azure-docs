<properties
	pageTitle="Create an Amazon application - Azure Active Directory B2C"
	description="How to create an Amazon application - Azure Active Directory B2C"
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
	ms.date="08/12/2015"
	ms.author="swkrish"/>

# How to create an Amazon application that works with Azure Active Directory B2C

To use Amazon as an identity provider in Azure AD B2C, you will first need to create an Amazon application and supply it with the right parameters. You will need an Amazon account to do this; if you don’t have one, you can get it at [http://www.amazon.com/](http://www.amazon.com/).

- Go to the [Amazon Developers Center](https://login.amazon.com/) and sign in with your Amazon account credentials.
- If you have not already done so, click **Sign Up**, follow the developer registration steps and accept the policy.
- Click **Register new application**.
- Provide application information (**Name**, **Description** and **Privacy Notice URL**) and click **Save**.
- In the **Web Settings** section, copy the values of **Client ID** and **Client secret**. You will need both of them to configure Amazon as an identity provider in your directory.

> [AZURE.NOTE]
**Client secret** is an important security credential.

- Click **Edit** in the **Web Settings** section.
- Enter `https://login.microsoftonline.com` in the **Allowed JavaScript origins** field and `https://login.microsoftonline.com/te/<directory>/oauth2/authresp` in the **Allowed Return URLs** field, where `<directory>` should be replaced with your directory's name (for example, contoso.onmicrosoft.com). Click **Save**.

> [AZURE.NOTE]
The directory's name is case-sensitive.

You can go back to the Azure AD B2C features blade on the [Azure Portal](htts://portal.azure.com/) to setup Amazon as an identity provider.
