---
title: 'Azure Active Directory B2C: Add Twitter as an OAuth1 identity provider using Custom policies'
description: Sample using Twitter as identity provider using OAuth1 protocol
services: active-directory-b2c
documentationcenter: ''
author: yoelhor
manager: joroja
editor: 

ms.assetid:
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: article
ms.devlang: na
ms.date: 10/02/2017
ms.author: yoelh
---

# Azure Active Directory B2C: Add Twitter as an OAuth1 identity provider using Custom policies
[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article shows you how to enable sign-in for users from Twitter account through the use of [custom policies](active-directory-b2c-overview-custom.md).

## Prerequisites
Complete the steps in the [Getting started with custom policies](active-directory-b2c-get-started-custom.md) article.

These steps include:

1.  Creating a Twitter account application.
2.  Adding the Twitter account application key to Azure AD B2C
3.  Adding claims provider to a policy
4.  Registering the Twitter account claims provider to a user journey
5.  Uploading the policy to an Azure AD B2C tenant and test it

## Step 1: Create a Twitter account application
To use Twitter as an identity provider in Azure Active Directory (Azure AD) B2C, you need to create a Twitter application and supply it with the right parameters. You can register a Twitter application here: [https://twitter.com/signup](https://twitter.com/signup)

1.  Navigate to the [Twitter Developers](https://apps.twitter.com/) website, sign in with your Twitter account credentials, and click **Create New App**.

    ![Twitter account - Create new app](media/active-directory-b2c-custom-setup-twitter-idp/adb2c-ief-setup-twitter-idp-new-app1.png)

2.  Type in the **Name** and a **Description** for your new app. Paste in `https://login.microsoftonline.com` for the **Website** value. Then, for the **Callback URL**, paste the `https://login.microsoftonline.com/te/{tenant}.onmicrosoft.com/oauth2/authresp`. Replace {tenant} with your tenant's name (for example, contosob2c.onmicrosoft.com). and make sure that you are using the HTTPS scheme. At the bottom the page, read and accept the terms. Then click **Create your Twitter application**.

    ![Twitter account - Add a new app](media/active-directory-b2c-custom-setup-twitter-idp/adb2c-ief-setup-twitter-idp-new-app2.png)

3.  Click the **Settings** tab, check **Allow this application to be used to sign in with Twitter**, then click **Update Settings**.
4.  Select the **Keys and Access Tokens** tab. Make a note of the values of **Consumer Key (API Key)** and **Consumer secret (API Secret)**.

    ![Twitter account - Set application properties](media/active-directory-b2c-custom-setup-twitter-idp/adb2c-ief-setup-twitter-idp-new-app3.png)

> [!NOTE]
>
>The Consumer Secret is an important security credential. Do not share this secret with anyone or distribute it with your app.

## Step 2: Add the Twitter account application key to Azure AD B2C
Federation with Twitter accounts requires a client secret for Twitter account to trust Azure AD B2C on behalf of the application. You need to store the Twitter application's consumer secret in your Azure AD B2C tenant:  

1.  Go to your Azure AD B2C tenant, and select **B2C Settings** > **Identity Experience Framework**
2.  Select **Policy Keys** to view the keys available in your tenant.
3.  Click **+Add**.
4.  For **Options**, use **Manual**.
5.  For **Name**, use `TwitterSecret`.  
    The prefix `B2C_1A_` might be added automatically.
6.  In the **Secret** box, enter your Microsoft application secret from https://apps.dev.microsoft.com
7.  For **Key usage**, use **Encryption**.
8.  Click **Create**
9.  Confirm that you've created the key `B2C_1A_TwitterSecret`.

## Step 3: Add a claims provider in your extension policy

If you want users to sign in by using Twitter account, you need to define Twitter as a claims provider. In other words, you need to specify endpoints that Azure AD B2C communicates with. The endpoints provide a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated.

Define Twitter as a claims provider, by adding `<ClaimsProvider>` node in your extension policy file:

1.  Open the extension policy file (TrustFrameworkExtensions.xml) from your working directory. 
2.  Find the `<ClaimsProviders>` section
3.  Add following XML snippet under the `<ClaimsProviders>` node:  

    ```xml
    <ClaimsProvider>
        <Domain>twitter.com</Domain>
        <DisplayName>Twitter</DisplayName>
        <TechnicalProfiles>
        <TechnicalProfile Id="Twitter-OAUTH1">
            <DisplayName>Twitter</DisplayName>
            <Protocol Name="OAuth1" />
            <Metadata>
            <Item Key="ProviderName">Twitter</Item>
            <Item Key="authorization_endpoint">https://api.twitter.com/oauth/authenticate</Item>
            <Item Key="access_token_endpoint">https://api.twitter.com/oauth/access_token</Item>
            <Item Key="request_token_endpoint">https://api.twitter.com/oauth/request_token</Item>
            <Item Key="ClaimsEndpoint">https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true</Item>
            <Item Key="ClaimsResponseFormat">json</Item>
            <Item Key="client_id">Your Twitter application consumer key</Item>
            </Metadata>
            <CryptographicKeys>
            <Key Id="client_secret" StorageReferenceId="B2C_1A_TwitterSecret" />
            </CryptographicKeys>
            <InputClaims />
            <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="socialIdpUserId" PartnerClaimType="user_id" />
            <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="screen_name" />
            <OutputClaim ClaimTypeReferenceId="email" />
            <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="twitter.com" />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" />
            </OutputClaims>
            <OutputClaimsTransformations>
            <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName" />
            <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName" />
            <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId" />
            <OutputClaimsTransformation ReferenceId="CreateSubjectClaimFromAlternativeSecurityId" />
            </OutputClaimsTransformations>
            <UseTechnicalProfileForSessionManagement ReferenceId="SM-SocialLogin" />
        </TechnicalProfile>
        </TechnicalProfiles>
    </ClaimsProvider>
    ```

4.  Replace `client_id` value with your Twitter account application's consumer key

5.  Save the file.

## Step 4: Register the Twitter account claims provider to Sign up or Sign in user journey
At this point, the identity provider has been set up. However, it is not available in any of the sign-up/sign-in screens. Now you need to add the Twitter account identity provider to your user `SignUpOrSignIn` user journey.

### Step 4.1 Make a copy of the user journey
To make it available, you create a duplicate of an existing template user journey. Then you add the Twitter identity provider:

> [!NOTE]
>
>If you copied the `<UserJourneys>` element from base file of your policy to the extension file (TrustFrameworkExtensions.xml), you can skip to the next section.

1.  Open the base file of your policy (for example, TrustFrameworkBase.xml).
2.  Find the `<UserJourneys>` element and copy the entire content of `<UserJourneys>` node.
3.  Open the extension file (for example, TrustFrameworkExtensions.xml) and find the `<UserJourneys>` element. If the element doesn't exist, add one.
4.  Paste the entire content of `<UserJournesy>` node that you copied as a child of the `<UserJourneys>` element.

### Step 4.2 Display the "button"
The `<ClaimsProviderSelections>` element defines the list of claims provider selection options and their order.  `<ClaimsProviderSelection>` element is analogous to an identity provider button on a sign-up/sign-in page. If you add a `<ClaimsProviderSelection>` element for Twitter account, a new button shows up when a user lands on the page. To add this element:

1.  Find the `<UserJourney>` node that includes `Id="SignUpOrSignIn"` in the user journey that you copied.
2.  Locate the `<OrchestrationStep>` node that includes `Order="1"`
3.  Add following XML snippet under `<ClaimsProviderSelections>` node:

    ```xml
    <ClaimsProviderSelection TargetClaimsExchangeId="TwitterExchange" />
    ```

### Step 4.3 Link the button to an action
Now that you have a button in place, you need to link it to an action. The action, in this case, is for Azure AD B2C to communicate with Twitter account to receive a token. Link the button to an action by linking the technical profile for your Twitter account claims provider:

1.  Find the `<OrchestrationStep>` that includes `Order="2"` in the `<UserJourney>` node.
2.  Add following XML snippet under `<ClaimsExchanges>` node:

    ```xml
    <ClaimsExchange Id="TwitterExchange" TechnicalProfileReferenceId="Twitter-OAUTH1" />
    ```

    > [!NOTE]
    >
    > * Ensure the `Id` has the same value as that of `TargetClaimsExchangeId` in the preceding section
    > * Ensure `TechnicalProfileReferenceId` ID is set to the technical profile you created earlier (Twitter-OAUTH1).

## Step 5: Upload the policy to your tenant
1.  In the [Azure portal](https://portal.azure.com), switch into the [context of your Azure AD B2C tenant](active-directory-b2c-navigate-to-b2c-context.md), and click on **Azure AD B2C**.
2.  Select **Identity Experience Framework**.
3.  Click on **All Policies**.
4.  Select **Upload Policy**
5.  Check **Overwrite the policy if it exists** box.
6.  **Upload** TrustFrameworkExtensions.xml and ensure that it does not fail the validation

## Step 6: Test the custom policy by using Run Now

1.  Open **Azure AD B2C Settings** and go to **Identity Experience Framework**.

    > [!NOTE]
    >
    >**Run now** requires at least one application to be preregistered on the tenant. To learn how to register applications, see the Azure AD B2C [Get started](active-directory-b2c-get-started.md) article or the [Application registration](active-directory-b2c-app-registration.md) article.

2.  Open **B2C_1A_signup_signin**, the relying party (RP) custom policy that you uploaded. Select **Run now**.
3.  You should be able to sign in using Twitter account.

## Step 7: [Optional] Register the Twitter account claims provider to Profile-Edit user journey
You may want to add the Twitter account identity provider also to your user `ProfileEdit` user journey. To make it available, you repeat the step #4. This time, select the `<UserJourney>` node that includes `Id="ProfileEdit"`. Save, upload, and test your policy.


## Download the complete policy files
Optional: We recommend you build your scenario using your own Custom policy files after completing the Getting Started with Custom Policies walk through instead of using these sample files.  [Sample policy files for reference](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/scenarios/aadb2c-ief-setup-twitter-app)