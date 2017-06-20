---
title: 'Azure Active Directory B2C: Built-in Policies | Microsoft Docs'
description: A topic on the extensible policy framework of Azure Active Directory B2C and on how to create various policy types
services: active-directory-b2c
documentationcenter: ''
author: sama
manager: mbaldwin
editor: bryanla

ms.assetid: 0d453e72-7f70-4aa2-953d-938d2814d5a9
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/26/2017
ms.author: sama

---
# Azure Active Directory B2C: Built-in policies


The extensible policy framework of Azure Active Directory (Azure AD) B2C is the core strength of the service. Policies fully describe consumer identity experiences such as sign-up, sign-in or profile editing. For instance, a sign-up policy allows you to control behaviors by configuring the following settings:

* Account types (social accounts such as Facebook or local accounts such as email addresses) that consumers can use to sign up for the application.
* Attributes (for example, first name, postal code, and shoe size) to be collected from the consumer during sign-up.
* Use of Multi-Factor Authentication.
* The look and feel of all sign-up pages.
* Information (which manifests as claims in a token) that the application receives when the policy run finishes.

You can create multiple policies of different types in your tenant and use them in your applications as needed. Policies can be reused across applications. This allows developers to define and modify consumer identity experiences with minimal or no changes to their code.

Policies are available for use via a simple developer interface. Your application triggers a policy by using a standard HTTP authentication request (passing a policy parameter in the request) and receives a customized token as response. For example, the only difference between requests that invoke a sign-up policy and those that invoke a sign-in policy is the policy name that's used in the "p" query string parameter:

```

https://login.microsoftonline.com/contosob2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=2d4d11a2-f814-46a7-890a-274a72a7309e      // Your registered Application ID
&redirect_uri=https%3A%2F%2Flocalhost%3A44321%2F    // Your registered Reply URL, url encoded
&response_mode=form_post                            // 'query', 'form_post' or 'fragment'
&response_type=id_token
&scope=openid
&nonce=dummy
&state=12345                                        // Any value provided by your application
&p=b2c_1_siup                                       // Your sign-up policy

```

```

https://login.microsoftonline.com/contosob2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=2d4d11a2-f814-46a7-890a-274a72a7309e      // Your registered Application ID
&redirect_uri=https%3A%2F%2Flocalhost%3A44321%2F    // Your registered Reply URL, url encoded
&response_mode=form_post                            // 'query', 'form_post' or 'fragment'
&response_type=id_token
&scope=openid
&nonce=dummy
&state=12345                                        // Any value provided by your application
&p=b2c_1_siin                                       // Your sign-in policy

```

For more details about the policy framework, see this [blog post about Azure AD B2C on the Enterprise Mobility and Security Blog](http://blogs.technet.com/b/ad/archive/2015/11/02/a-look-inside-azuread-b2c-with-kim-cameron.aspx).

## Create a sign-up or sign-in policy
This policy handles both consumer sign-up and sign-in experiences with a single configuration. Consumers are led down the right path (sign-up or sign-in) depending on the context. 

The policy also describes the contents of tokens that the application receives after successful sign-ups or sign-ins occur. A code sample for the sign-up or sign-in policy is [available here](active-directory-b2c-devquickstarts-web-dotnet-susi.md).  We recommend that you use this policy instead of a sign-up policy and sign-in policy.  

1. [First, follow these steps to go  to the B2C features blade on the Azure portal](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade).

2. Select **Sign-up or sign-in policies**.

3. At the top of the blade, select **+Add**.

4. The **Name** determines the sign-up policy name that's used by your application. For example, enter **SiUpIn**.

5. Select **Identity providers**, and then select **Email signup**. Optionally, you can also select social identity providers if they're already configured. Click **OK**.

6. Select **Sign-up attributes**. Here you choose attributes that you want to collect from the consumer during sign-up. For example, select **Country/Region**, **Display Name**, and **Postal Code**. Click **OK**.

7. Select **Application claims**. Here you choose claims that you want returned in the tokens that are sent back to your application after a successful sign-up or sign-in experience. For example, select **Display Name**, **Identity Provider**, **Postal Code**, **User is new**, and **User's Object ID**.

8. Select **Create**. Note that the policy that you just created appears as **B2C_1_SiUpIn** (the **B2C\_1\_** fragment is automatically added) in the **Sign-up or sign-in policies** blade.

9. Open the policy by selecting **B2C_1_SiUpIn**.

10. In the **Applications** drop-down menu, select **Contoso B2C app**, and in the **Reply URL / Redirect URI** drop-down menu, select `https://localhost:44321/`.

11. Select **Run now**. A new browser tab opens, and you can run through the sign-up or sign-in consumer experience.
    
    > [!NOTE]
    > It takes up to a minute for policy creation and updates to take effect.
    > 
    > 

## Create a sign-up policy
To enable sign-up in your application, you need to create a sign-up policy. This policy describes the experiences that consumers go through during sign-up and the contents of tokens that the application receives after successful sign-ups.

1. [First, follow these steps to navigate to the B2C features blade on the Azure portal](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade).

2. Select **Sign-up policies**.

3. Select **+Add** at the top of the blade.

4. The **Name** determines the the name of the sign-up policy name that's used by your application. For example, enter **SiUp**.

5. Select **Identity providers**, and then select **Email signup**. Optionally, you can also select social identity providers if they're already configured. Click **OK**.

6. Select **Sign-up attributes**. Here you choose attributes that you want to collect from the consumer during sign-up. For example, select **Country/Region**, **Display Name,** and **Postal Code**, and then click **OK**.

7. Select **Application claims**. Here you choose claims that you want returned in the tokens that are sent back to your application after a successful sign-up experience. For example, select **Display Name**, **Identity Provider**, **Postal Code**, **User is new**, and **User's Object ID**.

8. Select **Create**. Note that the policy that was just created appears as **B2C_1_SiUp** (the **B2C\_1\_** fragment is automatically added) in the **Sign-up policies** blade.

9. Open the policy by selecting **B2C_1_SiUp**.

10. Select **Contoso B2C app** in the **Applications** drop-down and `https://localhost:44321/` in the **Reply URL / Redirect URI** drop-down.

11. Select **Run now**. A new browser tab opens, and you can run through the consumer experience of signing up for your application.
    
    > [!NOTE]
    > It takes up to a minute for policy creation and updates to take effect.
    > 
    > 

## Create a sign-in policy
To enable sign-in in your application, you need to create a sign-in policy. This policy describes the experiences that consumers go through during sign-in and the contents of tokens that the application receives after successful sign-ins.

1. [First, follow these steps to navigate to the B2C features blade on the Azure portal](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade).

2. Select **Sign-in policies**.

3. Select **+Add** at the top of the blade.

4. The **Name** determines the name of the sign-in policy name that's used by your application. For example, enter **SiIn**.

5. Select **Identity providers**, and then select **Local Account SignIn**. Optionally, you can also select social identity providers if they're already configured. Click **OK**.

6. Select **Application claims**. Here you choose claims that you want returned in the tokens that are sent back to your application after a successful sign-in experience. For example, select **Display Name**, **Identity Provider**, **Postal Code**,  and **User's Object ID**, and then click **OK**.

7. Select **Create**. Note that the policy that was just created appears as **B2C_1_SiIn** (the **B2C\_1\_** fragment is automatically added) in the **Sign-in policies** blade.

8. Open the policy by clicking **B2C_1_SiIn**.

9. In the **Reply URL / Redirect URI** drop-down menu, select **Contoso B2C app** and `https://localhost:44321/`.

10. Select **Run now**. A new browser tab opens, and you can run through the consumer experience of signing into your application.
    
    > [!NOTE]
    > It takes up to a minute for policy creation and updates to take effect.
    > 
    > 

## Create a profile editing policy
To enable profile editing on your application, you need to create a profile editing policy. This policy describes the experiences that consumers go through during profile editing and the contents of tokens that the application receives after successful completion.

1. First, [follow these steps to navigate to the B2C features blade on the Azure portal](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade).

1. Select **Profile editing policies**.

2. Select **+Add** at the top of the blade.

3. The **Name** determines the profile editing policy name that's used by your application. For example, enter **SiPe**.

4. Select **Identity providers**, and then select **Local Account Signin**. Optionally, you can also select social identity providers, if they're configured. Click **OK**.

5. Select **Profile attributes**. Here you choose attributes that the consumer can view and edit. For example, select **Country/Region**, **Display Name**, and **Postal Code**, and then select **OK**.

6. Select **Application claims**. Here you choose claims that you want returned in the tokens that are sent back to your application after a successful profile editing experience. For example, select **Display Name** and **Postal Code**.

8. Select **Create**. Note that the policy that was just created appears as **B2C_1_SiPe** (the **B2C\_1\_** fragment is automatically added) in the **Profile editing policies** blade.

9. Open the policy by selecting **B2C_1_SiPe**.

10. In the **Applications** drop-down menu, select  **Contoso B2C app**, and in the **Reply URL / Redirect URI** drop-down menu, select `https://localhost:44321/`.

11. Select **Run now**. A new browser tab opens, and you can run through the profile editing consumer experience in your application.
    
    > [!NOTE]
    > It takes up to a minute for policy creation and updates to take effect.
    > 
    > 

## Create a password reset policy
To enable fine-grained password reset on your application, you need to create a password reset policy. Note that the tenant-wide password reset option specified at [
Azure Active Directory B2C: Set up self-service password reset for your consumers](active-directory-b2c-reference-sspr.md) is still applicable for sign-in policies. 

This policy describes the experiences that the consumers  go through during password reset and the contents of tokens that the application receive after the password is successfully reset.

1. [First, follow these steps to navigate to the B2C features blade on the Azure portal.](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade).

2. Select **Password reset policies**.

3. Select **+Add** at the top of the blade.

4. The **Name** determines the name of password reset policy that's used by your application. For example, enter **SSPR**.

5. Select **Identity providers**, and then select **Reset password using email address**. Click **OK**.

6. Select **Application claims**. Here you choose claims that you want returned in the tokens that are sent back to your application after a successful password reset experience. For example, select **User's Object ID**.

7. Select **Create**. Note that the policy that was just created appears as **B2C_1_SSPR** (the **B2C\_1\_** fragment is automatically added) in the **Password reset policies** blade.

8. Open the policy by clicking "**B2C_1_SSPR**".

9. in the **Applications** drop-down menu, select **Contoso B2C app**, and in the **Reply URL / Redirect URI** drop-down menu, select `https://localhost:44321/` .

10. Select **Run now**. A new browser tab opens, and you can run through the password reset consumer experience in your application.
    
    > [!NOTE]
    > It takes up to a minute for policy creation and updates to take effect.
    > 
    > 

## Frequently asked questions

### How do I link a sign-up or sign-in policy with a password reset policy?
When you create a sign-up or sign-in policy (with local accounts), you see a **Forgot password?** link on the first page of the experience. Clicking on this link doesn't automatically trigger a password reset policy. 

Instead, the error code **`AADB2C90118`** is returned to your app. Your app needs to handle this and invoke a specific password reset policy. For more information, see a [sample that demonstrates the approach of linking policies](https://github.com/AzureADQuickStarts/B2C-WebApp-OpenIDConnect-DotNet-SUSI).

### Should I use a sign-up or sign-in policy or a sign-up policy and a sign-in policy?
We recommend that you use a sign-up or sign-in policy over a sign-up policy and a sign-in policy.  

The sign-up or sign-in policy has more capabilities than the sign-in policy. It also enables you to use page UI customization and has better support for localization. 

The sign-in policy is recommended if you don't need to localize your policies, only need minor customization capabilities for branding, and want password reset built into it.

## Next steps
* [Token, session and single sign-on configuration](active-directory-b2c-token-session-sso.md)
* [Disable email verification during consumer sign-up](active-directory-b2c-reference-disable-ev.md)

