<properties
	pageTitle="Azure Active Directory B2C: Microsoft account configuration | Microsoft Azure"
	description="Provide sign-up and sign-in to consumers with Microsoft accounts in your applications that are secured by Azure Active Directory B2C."
	services="active-directory-b2c"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="bryanla"/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/22/2016"
	ms.author="swkrish"/>

# Azure Active Directory B2C: Provide sign-up and sign-in to consumers with Microsoft accounts

## Create a Microsoft account application

To use Microsoft account as an identity provider in Azure Active Directory (Azure AD) B2C, you need to create a Microsoft account application and supply it with the right parameters. You can use a Microsoft personal account, or a work or school account to do this.  If you don't have one you can create one during sign-in.

1. Go to the [Microsoft App Registration Portal](https://apps.dev.microsoft.com) and sign in.
2. Click **Add an app**.
3. Provide an **Application name** and click **Create**.
4. Scroll to the **Platforms** section and add the **Web** platform.
5. Enter `https://login.microsoftonline.com/te/{tenant}/oauth2/authresp` in the **Redirect URIs** field. Replace **{tenant}** with your tenant's name (for example, contosob2c.onmicrosoft.com)
7. Create a new client secret for your app by clicking on **Generate New Password** in the **Application Secrets** section.  Make sure to copy the secret once generated.
7.  Copy the values of **Client ID** and **Client secret**. You will need both of them to configure Microsoft account as an identity provider in your tenant. **Client secret** is an important security credential.
6. Make sure to click **Save** at the bottom of the page.

## Configure Microsoft account as an identity provider in your tenant

1. Follow these steps to [navigate to the B2C features blade](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade) on the Azure portal.
2. On the B2C features blade, click **Identity providers**.
3. Click **+Add** at the top of the blade.
4. Provide a friendly **Name** for the identity provider configuration. For example, enter "MSA".
5. Click **Identity provider type**, select **Microsoft account**, and click **OK**.
6. Click **Set up this identity provider** and enter the client ID and client secret of the Microsoft account application that you created earlier.
7. Click **OK** and then click **Create** to save your Microsoft account configuration.
