---
title: Add Twitter as an OAuth1 identity provider by using custom policies in Azure Active Directory B2C | Microsoft Docs
description: Use Twitter as an identity provider by using the OAuth1 protocol.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 10/23/2017
ms.author: davidmu
ms.component: B2C
---

# Azure Active Directory B2C: Add Twitter as an OAuth1 identity provider by using custom policies
[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article shows you how to enable sign-in for users of a Twitter account by using [custom policies](active-directory-b2c-overview-custom.md).

## Prerequisites
Complete the steps in the [Get started with custom policies](active-directory-b2c-get-started-custom.md) article.

## Step 1: Create a Twitter account application
To use Twitter as an identity provider in Azure Active Directory B2C (Azure AD B2C), you must create a Twitter application and supply it with the right parameters. You can register a Twitter application by going to the [Twitter sign-up page](https://twitter.com/signup).

1. Go to the [Twitter Developers](https://apps.twitter.com/) website, sign in with your Twitter account credentials, and then select  **Create New App**.

    ![Twitter account - Create new app](media/active-directory-b2c-custom-setup-twitter-idp/adb2c-ief-setup-twitter-idp-new-app1.png)

2. In the **Create an application** window, do the following:
 
    a. Type the **Name** and a **Description** for your new app. 

    b. In the **Website** box, paste **https://{tenant}.b2clogin.com**. Where **{tenant}** is your tenant's name (for example, https://contosob2c.b2clogin.com).

    c. 4. For the **Callback URL**, enter `https://{tenant}.b2clogin.com/te/{tenant}.onmicrosoft.com/{policyId}/oauth1/authresp`. Make sure to replace **{tenant}** with your tenant's name (for example, contosob2c) and **{policyId}** with your policy id (for example, b2c_1_policy).  **The callback URL needs to be in all lowercase.** You should add a callback URL for all policies that use the Twitter login. Make sure to use `b2clogin.com` instead of ` login.microsoftonline.com` if you are using it in your application.

    d. At the bottom of the page, read and accept the terms, and then select **Create your Twitter application**.

    ![Twitter account - Add a new app](media/active-directory-b2c-custom-setup-twitter-idp/adb2c-ief-setup-twitter-idp-new-app2.png)

3. In the **B2C demo** window, select **Settings**, select the **Allow this application to be used to sign in with Twitter** check box, and then select **Update Settings**.

4. Select **Keys and Access Tokens**, and note the **Consumer Key (API Key)** and **Consumer Secret (API Secret)** values.

    ![Twitter account - Set application properties](media/active-directory-b2c-custom-setup-twitter-idp/adb2c-ief-setup-twitter-idp-new-app3.png)

    >[!NOTE]
    >The consumer secret is an important security credential. Do not share this secret with anyone or distribute it with your app.

## Step 2: Add your Twitter account application key to Azure AD B2C
Federation with Twitter accounts requires a consumer secret for the Twitter account to trust Azure AD B2C on behalf of the application. To store the Twitter application's consumer secret in your Azure AD B2C tenant, do the following: 

1. In your Azure AD B2C tenant, select **B2C Settings** > **Identity Experience Framework**.

2. To view the keys that are available in your tenant, select **Policy Keys**.

3. Select **Add**.

4. In the **Options** box, select **Manual**.

5. In the **Name** box, select **TwitterSecret**.  
    The prefix *B2C_1A_* might be added automatically.

6. In the **Secret** box, enter your Microsoft application secret from the [Application Registration Portal](https://apps.dev.microsoft.com).

7. For **Key usage**, use **Encryption**.

8. Select **Create**.

9. Confirm that you've created the `B2C_1A_TwitterSecret` key.

## Step 3: Add a claims provider in your extension policy

If you want users to sign in by using Twitter account, you must define Twitter as a claims provider. In other words, you must specify the endpoints that Azure AD B2C communicates with. The endpoints provide a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated.

Define Twitter as a claims provider by adding `<ClaimsProvider>` node in your extension policy file:

1. In your working directory, open the *TrustFrameworkExtensions.xml* extension policy file. 

2. Search for the `<ClaimsProviders>` section.

3. In the `<ClaimsProviders>` node, add the following XML snippet:  

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

4. Replace the *client_id*` value with your Twitter account application consumer key.

5. Save the file.

## Step 4: Register the Twitter account claims provider to your sign-up or sign-in user journey
You've set up the identity provider. However, it is not yet available in any of the sign-up or sign-in windows. Now you must add the Twitter account identity provider to your user `SignUpOrSignIn` user journey.

### Step 4.1: Make a copy of the user journey
To make the user journey available, you create a duplicate of an existing user journey template and then add the Twitter identity provider:

>[!NOTE]
>If you copied the `<UserJourneys>` element from the base file of your policy to the *TrustFrameworkExtensions.xml* extension file, you can skip to the next section.

1. Open the base file of your policy (for example, TrustFrameworkBase.xml).

2. Search for the `<UserJourneys>` element, select the entire contents of the `<UserJourney>` node, and then select **Cut** to move the selected text to the clipboard.

3. Open the extension file (for example, TrustFrameworkExtensions.xml), and then search for the `<UserJourneys>` element. If the element doesn't exist, add it.

4. Paste the entire contents of the `<UserJourney>` node, which you moved to the clipboard in step 2, into the `<UserJourneys>` element.

### Step 4.2: Display the "button"
The `<ClaimsProviderSelections>` element defines the list of claims provider selection options and their order. The `<ClaimsProviderSelection>` node is analogous to an identity provider button on a sign-up or sign-in page. If you add a `<ClaimsProviderSelection>` node for a Twitter account, a new button is displayed when a user lands on the page. To add this element, do the following:

1. Search for the `<UserJourney>` node that contains `Id="SignUpOrSignIn"` in the user journey that you copied.

2. Locate the `<OrchestrationStep>` node that contains `Order="1"`.

3. In the `<ClaimsProviderSelections>` element, add the following XML snippet:

    ```xml
    <ClaimsProviderSelection TargetClaimsExchangeId="TwitterExchange" />
    ```

### Step 4.3: Link the button to an action
Now that you have a button in place, you must link it to an action. The action, in this case, is for Azure AD B2C to communicate with the Twitter account to receive a token. Link the button to an action by linking the technical profile for your Twitter account claims provider:

1. Search for the `<OrchestrationStep>` node that contains `Order="2"` in the `<UserJourney>` node.
2. In the `<ClaimsExchanges>` element, add the following XML snippet:

    ```xml
    <ClaimsExchange Id="TwitterExchange" TechnicalProfileReferenceId="Twitter-OAUTH1" />
    ```

    >[!NOTE]
    >* Ensure that `Id` has the same value as that of `TargetClaimsExchangeId` in the preceding section.
    >* Ensure that the `TechnicalProfileReferenceId` ID is set to the technical profile that you created earlier (Twitter-OAUTH1).

## Step 5: Upload the policy to your tenant
1. In the [Azure portal](https://portal.azure.com), switch to the [context of your Azure AD B2C tenant](active-directory-b2c-navigate-to-b2c-context.md), and then select **Azure AD B2C**.

2. Select **Identity Experience Framework**.

3. Select **All Policies**.

4. Select **Upload Policy**.

5. Select the **Overwrite the policy if it exists** check box.

6. Upload the *TrustFrameworkBase.xml* and *TrustFrameworkExtensions.xml* files, and ensure that they pass validation.

## Step 6: Test the custom policy by using Run Now

1. Select **Azure AD B2C Settings**, and then select **Identity Experience Framework**.

    >[!NOTE]
    >Run Now requires at least one application to be preregistered on the tenant. To learn how to register applications, see the Azure AD B2C [Get started](active-directory-b2c-get-started.md) article or the [Application registration](active-directory-b2c-app-registration.md) article.

2. Open **B2C_1A_signup_signin**, the relying party (RP) custom policy that you uploaded, and then select **Run now**.  
    You should now be able to sign in by using the Twitter account.

## Step 7: (Optional) Register the Twitter account claims provider to the profile-edit user journey
You might also want to add the Twitter account identity provider to your `ProfileEdit` user journey. To make the user journey available, repeat "Step 4." This time, select the `<UserJourney>` node that contains `Id="ProfileEdit"`. Save, upload, and test your policy.


## (Optional) Download the complete policy files
After you complete the [Get started with custom policies](active-directory-b2c-get-started-custom.md) walkthrough, we recommend that you build your scenario by using your own custom policy files. For your reference, we have provided [Sample policy files](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/scenarios/aadb2c-ief-setup-twitter-app).
