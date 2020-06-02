---
title: Get started with custom policies
titleSuffix: Azure AD B2C
description: Learn how to get started with custom policies in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 02/28/2020
ms.author: mimart
ms.subservice: B2C
---

# Get started with custom policies in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

[Custom policies](custom-policy-overview.md) are configuration files that define the behavior of your Azure Active Directory B2C (Azure AD B2C) tenant. In this article, you create a custom policy that supports local account sign-up or sign-in by using an email address and password. You also prepare your environment for adding identity providers.

## Prerequisites

- If you don't have one already, [create an Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.
- [Register your application](tutorial-register-applications.md) in the tenant that you created so that it can communicate with Azure AD B2C.
- Complete the steps in [Set up sign-up and sign-in with a Facebook account](identity-provider-facebook.md) to configure a Facebook application. Although a Facebook application is not required for using custom policies, it's used in this walkthrough to demonstrate enabling social login in a custom policy.

## Add signing and encryption keys

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. On the overview page, under **Policies**, select **Identity Experience Framework**.

### Create the signing key

1. Select **Policy Keys** and then select **Add**.
1. For **Options**, choose `Generate`.
1. In **Name**, enter `TokenSigningKeyContainer`. The prefix `B2C_1A_` might be added automatically.
1. For **Key type**, select **RSA**.
1. For **Key usage**, select **Signature**.
1. Select **Create**.

### Create the encryption key

1. Select **Policy Keys** and then select **Add**.
1. For **Options**, choose `Generate`.
1. In **Name**, enter `TokenEncryptionKeyContainer`. The prefix `B2C_1A`_ might be added automatically.
1. For **Key type**, select **RSA**.
1. For **Key usage**, select **Encryption**.
1. Select **Create**.

### Create the Facebook key

Add your Facebook application's [App Secret](identity-provider-facebook.md) as a policy key. You can use the App Secret of the application you created as part of this article's prerequisites.

1. Select **Policy Keys** and then select **Add**.
1. For **Options**, choose `Manual`.
1. For **Name**, enter `FacebookSecret`. The prefix `B2C_1A_` might be added automatically.
1. In **Secret**, enter your Facebook application's *App Secret* from developers.facebook.com. This value is the secret, not the application ID.
1. For **Key usage**, select **Signature**.
1. Select **Create**.

## Register Identity Experience Framework applications

Azure AD B2C requires you to register two applications that it uses to sign up and sign in users with local accounts: *IdentityExperienceFramework*, a web API, and *ProxyIdentityExperienceFramework*, a native app with delegated permission to the IdentityExperienceFramework app. Your users can sign up with an email address or username and a password to access your tenant-registered applications, which creates a "local account." Local accounts exist only in your Azure AD B2C tenant.

You need to register these two applications in your Azure AD B2C tenant only once.

### Register the IdentityExperienceFramework application

To register an application in your Azure AD B2C tenant, you can use the **App registrations** experience.

1. Select **App registrations**, and then select **New registration**.
1. For **Name**, enter `IdentityExperienceFramework`.
1. Under **Supported account types**, select **Accounts in this organizational directory only**.
1. Under **Redirect URI**, select **Web**, and then enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com`, where `your-tenant-name` is your Azure AD B2C tenant domain name.
1. Under **Permissions**, select the *Grant admin consent to openid and offline_access permissions* check box.
1. Select **Register**.
1. Record the **Application (client) ID** for use in a later step.

Next, expose the API by adding a scope:

1. Under **Manage**, select **Expose an API**.
1. Select **Add a scope**, then select **Save and continue** to accept the default application ID URI.
1. Enter the following values to create a scope that allows custom policy execution in your Azure AD B2C tenant:
    * **Scope name**: `user_impersonation`
    * **Admin consent display name**: `Access IdentityExperienceFramework`
    * **Admin consent description**: `Allow the application to access IdentityExperienceFramework on behalf of the signed-in user.`
1. Select **Add scope**

* * *

### Register the ProxyIdentityExperienceFramework application

1. Select **App registrations**, and then select **New registration**.
1. For **Name**, enter `ProxyIdentityExperienceFramework`.
1. Under **Supported account types**, select **Accounts in this organizational directory only**.
1. Under **Redirect URI**, use the drop-down to select **Public client/native (mobile & desktop)**.
1. For **Redirect URI**, enter `myapp://auth`.
1. Under **Permissions**, select the *Grant admin consent to openid and offline_access permissions* check box.
1. Select **Register**.
1. Record the **Application (client) ID** for use in a later step.

Next, specify that the application should be treated as a public client:

1. Under **Manage**, select **Authentication**.
1. Under **Advanced settings**, enable **Treat application as a public client** (select **Yes**). Ensure that **"allowPublicClient": true** is set in the application manifest. 
1. Select **Save**.

Now, grant permissions to the API scope you exposed earlier in the *IdentityExperienceFramework* registration:

1. Under **Manage**, select **API permissions**.
1. Under **Configured permissions**, select **Add a permission**.
1. Select the **My APIs** tab, then select the **IdentityExperienceFramework** application.
1. Under **Permission**, select the **user_impersonation** scope that you defined earlier.
1. Select **Add permissions**. As directed, wait a few minutes before proceeding to the next step.
1. Select **Grant admin consent for (your tenant name)**.
1. Select your currently signed-in administrator account, or sign in with an account in your Azure AD B2C tenant that's been assigned at least the *Cloud application administrator* role.
1. Select **Accept**.
1. Select **Refresh**, and then verify that "Granted for ..." appears under **Status** for the scopes - offline_access, openid and user_impersonation. It might take a few minutes for the permissions to propagate.

* * *

## Custom policy starter pack

Custom policies are a set of XML files you upload to your Azure AD B2C tenant to define technical profiles and user journeys. We provide starter packs with several pre-built policies to get you going quickly. Each of these starter packs contains the smallest number of technical profiles and user journeys needed to achieve the scenarios described:

- **LocalAccounts** - Enables the use of local accounts only.
- **SocialAccounts** - Enables the use of social (or federated) accounts only.
- **SocialAndLocalAccounts** - Enables the use of both local and social accounts.
- **SocialAndLocalAccountsWithMFA** - Enables social, local, and multi-factor authentication options.

Each starter pack contains:

- **Base file** - Few modifications are required to the base. Example: *TrustFrameworkBase.xml*
- **Extension file** - This file is where most configuration changes are made. Example: *TrustFrameworkExtensions.xml*
- **Relying party files** - Task-specific files called by your application. Examples: *SignUpOrSignin.xml*, *ProfileEdit.xml*, *PasswordReset.xml*

In this article, you edit the XML custom policy files in the **SocialAndLocalAccounts** starter pack. If you need an XML editor, try [Visual Studio Code](https://code.visualstudio.com/download), a lightweight cross-platform editor.

### Get the starter pack

Get the custom policy starter packs from GitHub, then update the XML files in the SocialAndLocalAccounts starter pack with your Azure AD B2C tenant name.

1. [Download the .zip file](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/archive/master.zip) or clone the repository:

    ```console
    git clone https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack
    ```

1. In all of the files in the **SocialAndLocalAccounts** directory, replace the string `yourtenant` with the name of your Azure AD B2C tenant.

    For example, if the name of your B2C tenant is *contosotenant*, all instances of `yourtenant.onmicrosoft.com` become `contosotenant.onmicrosoft.com`.

### Add application IDs to the custom policy

Add the application IDs to the extensions file *TrustFrameworkExtensions.xml*.

1. Open `SocialAndLocalAccounts/`**`TrustFrameworkExtensions.xml`** and find the element `<TechnicalProfile Id="login-NonInteractive">`.
1. Replace both instances of `IdentityExperienceFrameworkAppId` with the application ID of the IdentityExperienceFramework application that you created earlier.
1. Replace both instances of `ProxyIdentityExperienceFrameworkAppId` with the application ID of the ProxyIdentityExperienceFramework application that you created earlier.
1. Save the file.

## Upload the policies

1. Select the **Identity Experience Framework** menu item in your B2C tenant in the Azure portal.
1. Select **Upload custom policy**.
1. In this order, upload the policy files:
    1. *TrustFrameworkBase.xml*
    1. *TrustFrameworkExtensions.xml*
    1. *SignUpOrSignin.xml*
    1. *ProfileEdit.xml*
    1. *PasswordReset.xml*

As you upload the files, Azure adds the prefix `B2C_1A_` to each.

> [!TIP]
> If your XML editor supports validation, validate the files against the `TrustFrameworkPolicy_0.3.0.0.xsd` XML schema that is located in the root directory of the starter pack. XML schema validation identifies errors before uploading.

## Test the custom policy

1. Under **Custom policies**, select **B2C_1A_signup_signin**.
1. For **Select application** on the overview page of the custom policy, select the web application named *webapp1* that you previously registered.
1. Make sure that the **Reply URL** is `https://jwt.ms`.
1. Select **Run now**.
1. Sign up using an email address.
1. Select **Run now** again.
1. Sign in with the same account to confirm that you have the correct configuration.

## Add Facebook as an identity provider

As mentioned in [Prerequisites](#prerequisites), Facebook is *not* required for using custom policies, but is used here to demonstrate how you can enable federated social login in a custom policy.

1. In the `SocialAndLocalAccounts/`**`TrustFrameworkExtensions.xml`** file, replace the value of `client_id` with the Facebook application ID:

   ```xml
   <TechnicalProfile Id="Facebook-OAUTH">
     <Metadata>
     <!--Replace the value of client_id in this technical profile with the Facebook app ID"-->
       <Item Key="client_id">00000000000000</Item>
   ```

1. Upload the *TrustFrameworkExtensions.xml* file to your tenant.
1. Under **Custom policies**, select **B2C_1A_signup_signin**.
1. Select **Run now** and select Facebook to sign in with Facebook and test the custom policy.

## Next steps

Next, try adding Azure Active Directory (Azure AD) as an identity provider. The base file used in this getting started guide already contains some of the content that you need for adding other identity providers like Azure AD.

For information about setting up Azure AD as and identity provider, see [Set up sign-up and sign-in with an Azure Active Directory account using Active Directory B2C custom policies](identity-provider-azure-ad-single-tenant-custom.md).
