<properties
	pageTitle="Create a LinkedIn application - Azure Active Directory B2C"
	description="How to create a LinkedIn application - Azure Active Directory B2C"
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

# How to create a LinkedIn application that works with Azure Active Directory B2C

To use LinkedIn as an identity provider in Azure AD B2C, you will first need to create a LinkedIn application and supply it with the right parameters. You will need a LinkedIn account to do this; if you don’t have one, you can get it at [https://www.linkedin.com/](https://www.linkedin.com/).

- Go to the [LinkedIn Developers website](https://www.developer.linkedin.com/) and sign in with your LinkedIn account credentials.
- Click **Create Application**.
- In the **Create a New Application** form, fill in the relevant information (**Company Name**, **Name**, **Description**, **Application Logo URL**, **Application Use**, **Website URL**, **Business Email** and **Business Phone**).
- Agree to the LinkedIn API Terms of Use and click **Submit**.
- Copy the values of **Client ID** and **Client Secret**. You will need both of them to configure LinkedIn as an identity provider in your directory.

> [AZURE.NOTE]
**Client Secret** is an important security credential.

- Enter `https://login.microsoftonline.com/te/<directory>/oauth2/authresp` in the **Authorized Redirect URLs** field (under the **OAuth 2.0** section), where `<directory>` should be replaced with your directory's name (for example, contoso.onmicrosoft.com) and click **Add**. Then click **Update**.

You can go back to the Azure AD B2C features blade on the [Azure Portal](htts://portal.azure.com/) to setup LinkedIn as an identity provider.
