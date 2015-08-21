<properties
	pageTitle="LinkedIn configuration - Azure Active Directory B2C"
	description="Azure Active Directory B2C - Provide sign up and sign in to consumers with LinkedIn accounts in your applications"
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

# Azure Active Directory B2C - Provide sign up and sign in to consumers with LinkedIn accounts in your applications

## Create a LinkedIn application

To use LinkedIn as an identity provider in Azure AD B2C, you will first need to create a LinkedIn application and supply it with the right parameters. You will need a LinkedIn account to do this; if you don’t have one, you can get it at [https://www.linkedin.com/](https://www.linkedin.com/).

1. Go to the [LinkedIn Developers website](https://www.developer.linkedin.com/) and sign in with your LinkedIn account credentials.
2. Click **Create Application**.
3. In the **Create a New Application** form, fill in the relevant information (**Company Name**, **Name**, **Description**, **Application Logo URL**, **Application Use**, **Website URL**, **Business Email** and **Business Phone**).
4. Agree to the LinkedIn API Terms of Use and click **Submit**.
5. Copy the values of **Client ID** and **Client Secret**. You will need both of them to configure LinkedIn as an identity provider in your directory.

> [AZURE.NOTE]
**Client Secret** is an important security credential.

6. Enter [https://login.microsoftonline.com/te/<directory>/oauth2/authresp](https://login.microsoftonline.com/te/<directory>/oauth2/authresp) in the **Authorized Redirect URLs** field (under the **OAuth 2.0** section), where **<directory>** is to be replaced with your directory's name (for e.g., contoso.onmicrosoft.com) and click **Add**. Then click **Update**.

## Configure LinkedIn as an identity provider in your directory

1. Navigate to the B2C features blade on the [Azure Portal](htts://portal.azure.com/). Read [here](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade-on-the-azure-portal) on how to do this.
2. On the B2C features blade, click **Social identity providers**.
3. Click **+Add** at the top of the blade.
4. Provide a friendly **Name** for the identity provider configuration. For e.g., enter "LinkedIn (Contoso)".
5. Click **Identity provider type**, select **LinkedIn** and click **OK**.
6. Click **Set up this identity provider** and enter the **Client ID** and **Client secret** of the LinkedIn application that you created earlier.
7. Click **OK** and then **Create** to save your LinkedIn configuration.
