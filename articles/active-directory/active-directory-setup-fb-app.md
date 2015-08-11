<properties
	pageTitle="Create a Facebook application - Azure Active Directory B2C"
	description="How to create a Facebook application - Azure Active Directory B2C"
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

# How to create a Facebook application that works with Azure Active Directory B2C

To use Facebook as an identity provider in Azure AD B2C, you will first need to create a Facebook application and supply it with the right parameters. You will need a Facebook account to do this; if you don’t have one, you can get it at [https://www.facebook.com/](https://www.facebook.com/).

- Go to the [Facebook Developers website](https://developers.facebook.com/) and sign in with your Facebook account credentials.
- If you have not already done so, click **Apps** then click **Register as a Developer**, accept the policy and follow the registration steps.
- Click **Apps** and then **Add a new App**. Then choose **Website** as the platform, and then click **Skip and Create App ID**.
- On the form, provide a **Display Name**, choose the appropriate **Category** and click **Create App ID**. Note: This requires you to accept Facebook Platform Policies and complete an online Security Check.
- Click **Settings** on the left hand navigation. Enter a valid **Contact Email**.
- Click on **+Add Platform** and then select **Website**.
- Enter `https://login.microsoftonline.com/` in the **Site URL** field and then click **Save Changes**.
- Copy the value of **App ID**. Click **Show** and copy the value of **App Secret**. You will need both of them to configure Facebook as an identity provider in your directory.

> [AZURE.NOTE]
**App Secret** is an important security credential.

- Click the **Advanced** tab at the top, and then enter `https://login.microsoftonline.com/te/<directory>/oauth2/authresp` in the **Valid OAuth redirect URIs** field (in the **Security** section), where `<directory>` should be replaced with your directory's name (for example, contoso.onmicrosoft.com). Click **Save Changes** at the bottom of the page.
- To make your Facebook application usable by Azure AD B2C, you need to make it publicly available. You can do this by clicking on **Status & Review** on the left navigation and turning the switch at the top of the page to **YES**. And click **Confirm**.

You can go back to the Azure AD B2C features blade on the [Azure Portal](htts://portal.azure.com/) to setup Facebook as an identity provider.
