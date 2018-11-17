---
title:  Set up sign-in with a Google account in Azure Active Directory B2C using custom policies | Microsoft Docs
description: Set up sign-in with an Google account in Azure Active Directory B2C using custom policies.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 09/20/2018
ms.author: davidmu
ms.component: B2C
---

# Set up sign-in with a Google account using custom policies in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article shows you how to enable sign-in for users from a Google account by using [custom policies](active-directory-b2c-overview-custom.md) in Azure Active Directory (Azure AD) B2C.

## Prerequisites

- Complete the steps in the [Get started with custom policies in Active Directory B2C](active-directory-b2c-get-started-custom.md).
- If you don't already have a Google account, create one at [Create your Google Account](https://accounts.google.com/SignUp).

## Register the application

To enable sign-in for users from a Google account, you need to create a Google application project. 

1. Sign in to the [Google Developers Console](https://console.developers.google.com/) with your account credentials.
2. Enter a **Project Name**, click **Create**, and then make sure you are using the new project.
3. Select **Credentials** in the left menu, and then select **Create credentials > Oauth client ID**.
4. Select **Configure consent screen**.
5. Select or specify a valid **Email address**, provide a **Product name** shown to users, enter `b2clogin.com` in **Authorized domains**, and then click **Save**.
6. Under **Application type**, select **Web application**.
7. Enter a **Name** for your application.
8. In **Authorized JavaScript origins**, enter `https://your-tenant-name.b2clogin.com` and in **Authorized redirect URIs**, enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp`. Replace your-tenant-name with the name of your tenant. You need to use all lowercase letters when entering your tenant name even if the tenant is defined with uppercase letters in Azure AD B2C.
8. Click **Create**.
9. Copy the values of **Client ID** and **Client secret**. You will need both of them to configure Google as an identity provider in your tenant. Client secret is an important security credential.

## Create a policy key

You need to store the client secret that you previously recorded in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. On the Overview page, select **Identity Experience Framework - PREVIEW**.
5. Select **Policy Keys** and then select **Add**.
6. For **Options**, choose `Manual`.
7. Enter a **Name** for the policy key. For example, `GoogleSecret`. The prefix `B2C_1A_` is added automatically to the name of your key.
8. In **Secret**, enter your client secret that you previously recorded.
9. For **Key usage**, select `Signature`.
10. Click **Create**.

## Add a claims provider

If you want users to sign in by using a Google account, you need to define the account as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated. 

You can define a Google account as a claims provider by adding it to the **ClaimsProviders** element in the extension file of your policy.

1. Open the *TrustFrameworkExtensions.xml*.
2. Find the **ClaimsProviders** element. If it does not exist, add it under the root element.
3. Add a new **ClaimsProvider** as follows:

    ```xml
    <ClaimsProvider>
      <Domain>google.com</Domain>
      <DisplayName>Google</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="Google-OAUTH">
          <DisplayName>Google</DisplayName>
          <Protocol Name="OAuth2" />
          <Metadata>
            <Item Key="ProviderName">google</Item>
            <Item Key="authorization_endpoint">https://accounts.google.com/o/oauth2/auth</Item>
            <Item Key="AccessTokenEndpoint">https://accounts.google.com/o/oauth2/token</Item>
            <Item Key="ClaimsEndpoint">https://www.googleapis.com/oauth2/v1/userinfo</Item>
            <Item Key="scope">email</Item>
            <Item Key="HttpBinding">POST</Item>
            <Item Key="UsePolicyInRedirectUri">0</Item>
            <Item Key="client_id">Your Google application ID</Item>
          </Metadata>
          <CryptographicKeys>
            <Key Id="client_secret" StorageReferenceId="B2C_1A_GoogleSecret" />
          </CryptographicKeys>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="socialIdpUserId" PartnerClaimType="id" />
            <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="email" />
            <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name" />
            <OutputClaim ClaimTypeReferenceId="surname" PartnerClaimType="family_name" />
            <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
            <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="google.com" />
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

4. Set **client_id** to the application ID from the application registration.
5. Save the file.

### Upload the extension file for verification

By now, you have configured your policy so that Azure AD B2C knows how to communicate with your Azure AD directory. Try uploading the extension file of your policy just to confirm that it doesn't have any issues so far.

1. On the **Custom Policies** page in your Azure AD B2C tenant, select **Upload Policy**.
2. Enable **Overwrite the policy if it exists**, and then browse to and select the *TrustFrameworkExtensions.xml* file.
3. Click **Upload**.

## Register the claims provider

At this point, the identity provider has been set up, but it’s not available in any of the sign-up/sign-in screens. To make it available, you create a duplicate of an existing template user journey, and then modify it so that it also has the Azure AD identity provider.

1. Open the *TrustFrameworkBase.xml* file from the starter pack.
2. Find and copy the entire contents of the **UserJourney** element that includes `Id="SignUpOrSignIn"`.
3. Open the *TrustFrameworkExtensions.xml* and find the **UserJourneys** element. If the element doesn't exist, add one.
4. Paste the entire content of the **UserJourney** element that you copied as a child of the **UserJourneys** element.
5. Rename the ID of the user journey. For example, `SignUpSignInGoogle`.

### Display the button

The **ClaimsProviderSelection** element is analogous to an identity provider button on a sign-up/sign-in screen. If you add a **ClaimsProviderSelection** element for a Google account, a new button shows up when a user lands on the page.

1. Find the **OrchestrationStep** element that includes `Order="1"` in the user journey that you created.
2. Under **ClaimsProviderSelects**, add the following element. Set the value of **TargetClaimsExchangeId** to an appropriate value, for example `GoogleExchange`:

    ```XML
    <ClaimsProviderSelection TargetClaimsExchangeId="GoogleExchange" />
    ```

### Link the button to an action

Now that you have a button in place, you need to link it to an action. The action, in this case, is for Azure AD B2C to communicate with a Google account to receive a token.

1. Find the **OrchestrationStep** that includes `Order="2"` in the user journey.
2. Add the following **ClaimsExchange** element making sure that you use the same value for **Id** that you used for **TargetClaimsExchangeId**:

    ```XML
    <ClaimsExchange Id="GoogleExchange" TechnicalProfileReferenceId="Google-OAuth" />
    ```
    
    Update the value of **TechnicalProfileReferenceId** to the **Id** of the technical profile you created earlier. For example, `Google-OAuth`.

3. Save the *TrustFrameworkExtensions.xml* file and upload it again for verification.

## Create an Azure AD B2C application

Communication with Azure AD B2c occurs through an application that you create in your tenant. This section lists optional steps you can complete to create a test application if you haven't already done so.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. Select **Applications**, and then select **Add**.
5. Enter a name for the application, for example *testapp1*.
6. For **Web App / Web API**, select `Yes`, and then enter `https://jwt.ms` for the **Reply URL**.
7. Click **Create**.

## Update and test the relying party file

Update the relying party (RP) file that initiates the user journey that you created.

1. Make a copy of *SignUpOrSignIn.xml* in your working directory, and rename it. For example, rename it to *SignUpSignInGoogle.xml*.
2. Open the new file and update the value of the **PolicyId** attribute for **TrustFrameworkPolicy** with a unique value. For example, `SignUpSignInGoogle`.
3. Update the value of **PublicPolicyUri** with the URI for the policy. For example,`http://contoso.com/B2C_1A_signup_signin_google`
4. Update the value of the **ReferenceId** attribute in **DefaultUserJourney** to match the ID of the new user journey that you created (SignUpSignGoogle).
5. Save your changes, upload the file, and then select the new policy in the list.
6. Make sure that Azure AD B2C application that you created is selected in the **Select application** field, and then test it by clicking **Run now**.
