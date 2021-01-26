---
author: msmimart
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 05/04/2020
ms.author: mimart
---

1. Sign in to the [Amazon Developer Console](https://developer.amazon.com/dashboard) with your Amazon account credentials.
1. If you have not already done so, click **Sign Up**, follow the developer registration steps, and accept the policy.
1. From the Dashboard, select **Login with Amazon**.
1. Select **Create a New Security Profile**.
1. Enter a **Security Profile Name**, **Security Profile Description**, and **Consent Privacy Notice URL**, for example `https://www.contoso.com/privacy` The privacy notice URL is a page that you manage that provides privacy information to users. Then click **Save**.
1. In the **Login with Amazon Configurations** section, select the **Security Profile Name** you created, click on the **Manage** icon and select **Web Settings**.
1. In the **Web Settings** section, copy the values of **Client ID**. Select **Show Secret** to get the client secret and then copy it. You need both of them to configure an Amazon account as an identity provider in your tenant. **Client Secret** is an important security credential.
1. In the **Web Settings** section, select **Edit**. In **Allowed Origins** and **Allowed Return URLs**, enter the appropriate URLs (noted above). 
1. Click **Save**.
