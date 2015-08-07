<properties
	pageTitle="Azure AD B2C .NET Getting Started | Microsoft Azure"
	description="How to build a .NET MVC Web application that integrates with Azure AD B2C for sign up & sign in."
	services="active-directory"
	documentationCenter=".net"
	authors="swkrish"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="08/03/2015"
	ms.author="swkrish"/>

# Web application Sign Up & Sign In with Azure AD B2C

[AZURE.INCLUDE [active-directory-devguide](../../includes/active-directory-devguide.md)]

Azure AD B2C makes it easy to add user sign up & sign in to your consumer-facing web application using only a few lines of code. Here, we will build a .NET MVC web application that:

- Allows users to sign up with Facebook or email address (local) accounts.
- Collects information from users during sign up.
- Allows users to sign in with Facebook or email address accounts (with passwords) previously used for sign up.
- Uses OpenID Connect to integrate sign up and sign in with the application, with some help from Microsoft's OWIN middleware.
- Displays the contents of id_tokens received after sign up and sign in.

> [AZURE.NOTE]
Local accounts allow consumers to sign in with arbitrary email addresses (& passwords) into your application; for example, 'joe@comcast.net'. Azure Active Directory B2C also allows local accounts with usernames (& passwords); for example, 'joe'.

Follow the steps below to get this done:

1. Register an application with Azure AD B2C.
2. Create a Sign-up policy and test.
3. Create a Sign-in policy and test.
4. Set up your application to use policies created in your directory.
5. Run the application and issue sign up, sign in and sign out requests to Azure AD B2C.
6. Add a custom user attribute to the directory.
7. Modify the Sign-up policy to use the custom attribute.
8. Register an application with Facebook.
9. Setup Facebook as a social identity provider in your directory.
10. Modify the Sign-up and Sign-in policies to include Facebook as an Identity Provider.
11. Re-run the application to issue requests to Azure AD B2C.

Before you start, [download the sample](https://github.com/AzureADQuickStarts/WebApp-OpenIdConnect-DotNet/archive/complete.zip). It is a Visual Studio 2013 solution. Also complete the pre-requisites as described [here](active-directory-get-started-b2c.md), if you haven't done so already. Leave the B2C features blade on the [Azure Portal](https://portal.azure.com/) open.

## Step 1: Register an application with Azure AD B2C

To secure your application, you will first need to create an application in your directory and provide Azure AD B2C with a few key pieces of information.

- On the B2C features blade on the [Azure Portal](https://portal.azure.com/), click on **Applications**.
- Click **+Add** at the top of the blade.
- The **Name** of the application will describe your application to end users. Enter "B2C app".
- Click **Web app / Web API**.
- The **Reply URL** is the location that Azure AD B2C will use to return any tokens your application requests. Enter `https://localhost:44321/`. Click **OK**.
- Click **Create** to register your application.
- Open the application that you just created by clicking on it in the **Applications** blade.
- Click **Properties** and copy the **Client ID** of your application; you will need this value later on. Close the two blades just opened. Leave the B2C features blade open.

## Step 2: Create a Sign-up policy and test

To enable sign up on your application, you will need to create a Sign-up policy. This policy describes the experiences that users will go through during sign up and the contents of tokens that the application will receive on successful sign ups.

> [AZURE.NOTE]
Policies are units of re-use. You can create multiple policies of the same type and use any policy in any application at run-time. Policies have a consistent developer interface; you invoke them in your applications using standard identity protocol requests and you receive tokens (customized by you) as responses.

- On the B2C features blade, click **Sign-up policies**.
- Click **+Add** at the top of the blade.
- The **Name** determines the sign-up policy name used by your application. Enter "SiUp".
- Click **Identity providers** and select "Email address". Click **OK**.
- Click **Sign-up attributes**. Here you choose attributes that you want to collect from the user during sign up. For the purposes of this tutorial, select "Display Name", "City" and "Postal Code". Click **OK**.
- Click **Application claims**. Here you can choose the claims that you want returned in the tokens back to your application after a successful sign up experience. For now, select "Display Name", "Postal Code", "Identity Provider" and "User's Object ID".
- Click **Create**. Note that the policy just created appears as "B2C_1_SiUp" (the B2C_1_ fragment is automatically added) in the **Sign-up policies** blade.
- Open the policy by clicking on it and click the **Run now** command at the top of the blade.

> [AZURE.NOTE]
The policy "Run now" command allows you to simulate and test user experience without writing a single line of code.

- Select "B2C app" in the **Applications** drop-down and `https://localhost:44321/` in the **Reply URL / Redirect URI** drop-down. Click the **Run now** button.
- A new browser tab opens up and you can run through the user experience of signing up for your application.
- Go back to the browser tab where the Azure Portal is open. Close the two blades just opened. Leave the B2C features blade open.

## Step 3: Create a Sign-in policy and test

To enable sign in on your application, you will need to create a Sign-in policy. This policy describes the experiences that users will go through during sign in and the contents of tokens that the application will receive on successful sign ins.

- On the B2C features blade, click **Sign-in policies**.
- Click **+Add** at the top of the blade.
- The **Name** determines the sign-in policy name used by your application. Enter "SiIn".
- Click **Identity providers** and select "Email address". Click **OK**.
- Click **Application claims**. Here you can choose the claims that you want returned in the tokens back to your application after a successful sign in experience. For now, select "Display Name", "Postal Code", "Identity Provider" and "User's Object ID".
- Click **Create**. Note that the policy just created appears as "B2C_1_SiIn" (the B2C_1_ fragment is automatically added) in the **Sign-in policies** blade.
- Open the policy by clicking on it and click the **Run now** command at the top of the blade.
- Select "B2C app" in the **Applications** drop-down and `https://localhost:44321/` in the **Reply URL / Redirect URI** drop-down. Click the **Run now** button.
- A new browser tab opens up and you can run through the user experience of signing into your application.
- Go back to the browser tab where the Azure Portal is open. Close the two blades just opened. Leave the B2C features blade open.

## Step 4: Set up your application to use policies created in your directory

Here, we will configure the sample to use the Sign-up and Sign-in policies created in your directory. This will allow your application (using the OWIN middleware) to issue sign-up and sign-in requests to the Azure AD B2C service.

- Open the `web.config` file in the root of the project, and enter values for these configuration keys:
  - For "ida:Tenant", enter your directory name. For e.g., "contoso.onmicrosoft.com".
	- For "ida:ClientId", enter the **Client ID** copied down in Step 1.
	- Leave "ida:RedirectUri" as `https://localhost:44321/`.
	- For "ida:SignUpPolicyId", enter "B2C_1_SiUp".
	- For "ida.SignInPolicyId", enter "B2C_1_SiIn".

## Step 5: Run the application and issue sign up, sign in and sign out requests to Azure AD B2C

You are almost done securing your application with Azure AD B2C!

- Build the Visual Studio solution and run the application.
- Run through sign-up, sign-out and sign-in in order using any email address.
- Click on the "Claims" tab after sign-up and sign-in to view the contents of tokens received.

## Step 6: Add a custom user attribute to the directory

You can collect additional information from the user during sign-up in addition to standard directory attributes. To do that you have to create custom attributes and use them in your policies.

- On the B2C features blade, click **User attributes**.
- Click **+Add** at the top of the blade.
- Provide a **Name** for the custom attribute. For example, enter "ShoeSize".
- Leave **Data type** as "String".
- Click **Create**.
- Close the two blades just opened. Leave the B2C features blade open.

## Step 7: Modify the Sign-up policy to use the custom attribute

- On the B2C features blade, click **Sign-up policies**.
- Click on "B2C_1_SiUp" and then on **Sign-up attributes**.
- Select "ShoeSize" from the list of attributes and click **OK**.
- **Save** the sign-up policy.
- If you want to run through the modified sign-up experience, click the **Run now** command and follow the steps outlined in Step 2.
- Close the two blades just opened. Leave the B2C features blade open.

## Step 8: Register an application with Facebook

To use Facebook sign-up and sign-in in your application, you will need to [create a Facebook application](link) and supply it with the right parameters to work properly with the Azure AD B2C service. Do this on a separate browser tab and leave the B2C features blade open.

You can also setup [Google](link), [LinkedIn](link) and [Amazon](link) apps as well. However, it is optional for the steps that follow.

## Step 9: Setup Facebook as a social identity provider in your directory

- On the B2C features blade, click **Social identity providers**.
- Click **+Add** at the top of the blade.
- Provide a friendly **Name** for the identity provider configuration. For example, enter "Facebook (default)".
- Click **Identity provider type**, select **Facebook** and click **OK**.
- Click **Set up this identity provider** and enter the **Client ID** and **Client secret** of the Facebook application that you created in Step 8.
- Click **OK** and then **Create** to save your Facebook configuration.
- Close the **Social identity providers** blade. Leave the B2C features blade open.

## Step 10: Modify the Sign-up and Sign-in policies to include Facebook as an Identity Provider

- On the B2C features blade, click **Sign-up policies**.
- Click on "B2C_1_SiUp" and then on **Identity providers**.
- Select "Facebook (default)" from the list of identity providers and click **OK**.
- **Save** the sign-up policy.
- If you want to run through the modified sign-up experience, click the **Run now** command and follow the steps outlined in Step 2.
- Close the two blades just opened.
- On the B2C features blade, click **Sign-in policies**.
- Click on "B2C_1_SiIn" and then on **Identity providers**.
- Select "Facebook (default)" from the list of identity providers and click **OK**.
- **Save** the sign-in policy.
- If you want to run through the modified sign-in experience, click the **Run now** command and follow the steps outlined in Step 1.
- You can close the Azure Portal tab if you want to.

## Step 11: Re-run the application to issue requests to Azure AD B2C

Your application now has enhanced functionality, all without changing a single line of code!

- Re-build the Visual Studio solution and re-run the application.
- Run through sign-up, sign-out and sign-in in order using any Facebook account.
- Click on the "Claims" tab after sign-up and sign-in to view the contents of tokens received.

If you want to move onto advanced topics, you may want to try:
- [Customizing user pages in sign-up, sign-in and other policies](link)
- [Setting up self-service password reset for your users](link)
- [Setting up company branding on the local account sign-in page](link)
