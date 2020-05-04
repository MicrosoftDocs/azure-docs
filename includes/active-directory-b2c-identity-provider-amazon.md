---
author: msmimart
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 05/04/2020
ms.author: mimart
---
## Create an Amazon application

To use an Amazon account as an [identity provider](authorization-code-flow.md) in Azure Active Directory B2C (Azure AD B2C), you need to create an application in your tenant that represents it. If you don't already have an Amazon account you can sign up at [https://www.amazon.com/](https://www.amazon.com/).

1. Sign in to the [Amazon Developer Console](https://developer.amazon.com/dashboard) with your Amazon account credentials.
1. If you have not already done so, click **Sign Up**, follow the developer registration steps, and accept the policy.
1. From the Dashboard, select **Login with Amazon**.
1. Select **Create a New Security Profile**.
1. Enter a **Security Profile Name**, **Security Profile Description**, and **Consent Privacy Notice URL**, for example `https://www.contoso.com/privacy` The privacy notice URL is a page that you manage that provides privacy information to users. Then click **Save**.
1. In the **Login with Amazon Configurations** section, select the **Security Profile Name** you created, click on the **Manage** icon and select **Web Settings**.
1. In the **Web Settings** section, copy the values of **Client ID**. Select **Show Secret** to get the client secret and then copy it. You need both of them to configure an Amazon account as an identity provider in your tenant. **Client Secret** is an important security credential.
1. In the **Web Settings** section, select **Edit**, and then enter `https://your-tenant-name.b2clogin.com` in **Allowed Origins** and `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp` in **Allowed Return URLs**. Replace `your-tenant-name` with the name of your tenant. You need to use all lowercase letters when entering your tenant name even if the tenant is defined with uppercase letters in Azure AD B2C.
1. Click **Save**.
