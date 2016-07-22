<properties
	pageTitle="Azure Active Directory B2C: Extensible policy framework | Microsoft Azure"
	description="A topic on the extensible policy framework of Azure Active Directory B2C and on how to create various policy types"
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

# Azure Active Directory B2C: Extensible policy framework

## The basics

The extensible policy framework of Azure Active Directory (Azure AD) B2C is the core strength of the service. Policies fully describe consumer identity experiences such as sign-up, sign-in or profile editing. For instance, a sign-up policy allows you to control behaviors by configuring the following settings:

- Account types (social accounts such as Facebook, or local accounts such as email address) that consumers can use to sign up for the application.
- Attributes (for example, first name, postal code, and shoe size) to be collected from the consumer during sign-up.
- Use of Multi-Factor Authentication.
- The look-and-feel of all sign-up pages.
- Information (which manifests as claims in a token) that the application receives when the policy run finishes.

You can create multiple policies of different types in your tenant and use them in your applications as needed. Policies can be reused across applications. This allows developers to define and modify consumer identity experiences with minimal or no changes to their code.

Policies are available for use via a simple developer interface. Your application triggers a policy using a standard HTTP authentication request (passing a policy parameter in the request) and receives a customized token as response. For example, the only difference between requests invoking a sign-up policy and those invoking a sign-in policy is the policy name used in the "p" query string parameter:

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

For more details about the policy framework, see this [blog post](http://blogs.technet.com/b/ad/archive/2015/11/02/a-look-inside-azuread-b2c-with-kim-cameron.aspx).

## Create a sign-up policy

To enable sign-up on your application, you will need to create a sign-up policy. This policy describes the experiences that consumers will go through during sign-up and the contents of tokens that the application will receive on successful sign-ups.

1. [Follow these steps to navigate to the B2C features blade on the Azure portal](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade).
2. Click **Sign-up policies**.
3. Click **+Add** at the top of the blade.
4. The **Name** determines the sign-up policy name used by your application. For example, enter "SiUp".
5. Click **Identity providers** and select "Email signup". Optionally, you can also select social identity providers, if already configured. Click **OK**.
6. Click **Sign-up attributes**. Here you choose attributes that you want to collect from the consumer during sign-up. For example, select "Country/Region", "Display Name" and "Postal Code". Click **OK**.
7. Click **Application claims**. Here you choose claims that you want returned in the tokens sent back to your application after a successful sign-up experience. For example, select "Display Name", "Identity Provider", "Postal Code", "User is new" and "User's Object ID".
8. Click **Create**. Note that the policy just created appears as "**B2C_1_SiUp**" (the **B2C\_1\_** fragment is automatically added) in the **Sign-up policies** blade.
9. Open the policy by clicking "**B2C_1_SiUp**".
10. Select "Contoso B2C app" in the **Applications** drop-down and `https://localhost:44321/` in the **Reply URL / Redirect URI** drop-down.
11. Click **Run now**. A new browser tab opens, and you can run through the consumer experience of signing up for your application.

    > [AZURE.NOTE]
    It takes up to a minute for policy creation and updates to take effect.

## Create a sign-in policy

To enable sign-in on your application, you will need to create a sign-in policy. This policy describes the experiences that consumers will go through during sign-in and the contents of tokens that the application will receive on successful sign-ins.

1. [Follow these steps to navigate to the B2C features blade on the Azure portal](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade).
2. Click **Sign-in policies**.
3. Click **+Add** at the top of the blade.
4. The **Name** determines the sign-in policy name used by your application. For example, enter "SiIn".
5. Click **Identity providers** and select "Local Account SignIn". Optionally, you can also select social identity providers, if already configured. Click **OK**.
6. Click **Application claims**. Here you choose claims that you want returned in the tokens sent back to your application after a successful sign-in experience. For example, select "Display Name", "Identity Provider", "Postal Code"  and "User's Object ID". Click **OK**.
7. Click **Create**. Note that the policy just created appears as "**B2C_1_SiIn**" (the **B2C\_1\_** fragment is automatically added) in the **Sign-in policies** blade.
8. Open the policy by clicking "**B2C_1_SiIn**".
9. Select "Contoso B2C app" in the **Applications** drop-down and `https://localhost:44321/` in the **Reply URL / Redirect URI** drop-down.
10. Click **Run now**. A new browser tab opens, and you can run through the consumer experience of signing into your application.

    > [AZURE.NOTE]
    It takes up to a minute for policy creation and updates to take effect.

## Create a sign-up or sign-in policy

This policy handles both consumer sign-up & sign-in experiences with a single configuration. Consumers are led down the right path (sign-up or sign-in) depending on the context. It also describes the contents of tokens that the application will receive upon successful sign-ups or sign-ins.  A code sample for the sign-up or sign-in policy is [available here](active-directory-b2c-devquickstarts-web-dotnet-susi.md).

1. [Follow these steps to navigate to the B2C features blade on the Azure portal](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade).
2. Click **Sign-up or sign-in policies**.
3. Click **+Add** at the top of the blade.
4. The **Name** determines the sign-up policy name used by your application. For example, enter "SiUpIn".
5. Click **Identity providers** and select "Email signup". Optionally, you can also select social identity providers, if already configured. Click **OK**.
6. Click **Sign-up attributes**. Here you choose attributes that you want to collect from the consumer during sign-up. For example, select "Country/Region", "Display Name" and "Postal Code". Click **OK**.
7. Click **Application claims**. Here you choose claims that you want returned in the tokens sent back to your application after a successful sign-up or sign-in experience. For example, select "Display Name", "Identity Provider", "Postal Code", "User is new" and "User's Object ID".
8. Click **Create**. Note that the policy just created appears as "**B2C_1_SiUpIn**" (the **B2C\_1\_** fragment is automatically added) in the **Sign-up or sign-in policies** blade.
9. Open the policy by clicking "**B2C_1_SiUpIn**".
10. Select "Contoso B2C app" in the **Applications** drop-down and `https://localhost:44321/` in the **Reply URL / Redirect URI** drop-down.
11. Click **Run now**. A new browser tab opens, and you can run through the sign-up or sign-in consumer experience as configured.

    > [AZURE.NOTE]
    It takes up to a minute for policy creation and updates to take effect.

## Create a profile editing policy

To enable profile editing on your application, you will need to create a profile editing policy. This policy describes the experiences that consumers will go through during profile editing and the contents of tokens that the application will receive on successful completion.

1. [Follow these steps to navigate to the B2C features blade on the Azure portal](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade).
2. Click **Profile editing policies**.
3. Click **+Add** at the top of the blade.
4. The **Name** determines the profile editing policy name used by your application. For example, enter "SiPe".
5. Click **Identity providers** and select "Email address". Optionally, you can also select social identity providers, if already configured. Click **OK**.
6. Click **Profile attributes**. Here you choose attributes that the consumer can view and edit. For example, select "Country/Region", "Display Name", and "Postal Code". Click **OK**.
7. Click **Application claims**. Here you choose claims that you want returned in the tokens sent back to your application after a successful profile editing experience. For example, select "Display Name" and "Postal Code".
8. Click **Create**. Note that the policy just created appears as "**B2C_1_SiPe**" (the **B2C\_1\_** fragment is automatically added) in the **Profile editing policies** blade.
9. Open the policy by clicking "**B2C_1_SiPe**".
10. Select "Contoso B2C app" in the **Applications** drop-down and `https://localhost:44321/` in the **Reply URL / Redirect URI** drop-down.
11. Click **Run now**. A new browser tab opens, and you can run through the profile editing consumer experience in your application.

    > [AZURE.NOTE]
    It takes up to a minute for policy creation and updates to take effect.
    
## Create a password reset policy

To enable fine-grained password reset on your application, you will need to create a password reset policy. Note that the tenant-wide password reset option specified [here](active-directory-b2c-reference-sspr.md) is still applicable for sign-in policies. This policy describes the experiences that the consumers will go through during password reset and the contents of tokens that the application will receive on successful completion.

1. [Follow these steps to navigate to the B2C features blade on the Azure portal](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade).
2. Click **Password reset policies**.
3. Click **+Add** at the top of the blade.
4. The **Name** determines the password reset policy name used by your application. For example, enter "SSPR".
5. Click **Identity providers** and select "Reset password using email address". Click **OK**.
6. Click **Application claims**. Here you choose claims that you want returned in the tokens sent back to your application after a successful password reset experience. For example, select "User's Object ID".
7. Click **Create**. Note that the policy just created appears as "**B2C_1_SSPR**" (the **B2C\_1\_** fragment is automatically added) in the **Password reset policies** blade.
8. Open the policy by clicking "**B2C_1_SSPR**".
9. Select "Contoso B2C app" in the **Applications** drop-down and `https://localhost:44321/` in the **Reply URL / Redirect URI** drop-down.
10. Click **Run now**. A new browser tab opens, and you can run through the password reset consumer experience in your application.

    > [AZURE.NOTE]
    It takes up to a minute for policy creation and updates to take effect.

## Additional resources

- [Token, session and single sign-on configuration](active-directory-b2c-token-session-sso.md).
