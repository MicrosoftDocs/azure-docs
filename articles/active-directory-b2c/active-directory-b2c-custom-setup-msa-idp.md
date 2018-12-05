---
title: Add Microsoft Account (MSA) as an identity provider using custom policies in Azure Active Directory B2C | Microsoft Docs
description: Sample using Microsoft as identity provider using OpenID Connect (OIDC) protocol.
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

# Set up sign-in with a Microsoft account using custom policies in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article shows you how to enable sign-in for users from a Microsoft account by using [custom policies](active-directory-b2c-overview-custom.md) in Azure Active Directory (Azure AD) B2C.

## Prerequisites

- Complete the steps in [Get started with custom policies in Azure Active Directory B2C](active-directory-b2c-get-started-custom.md).
- If you don't already have a Microsoft account, create one at [https://www.live.com/](https://www.live.com/).

## Add an application

To use a Microsoft account as an identity provider in Azure AD B2C, you need to add a Microsoft account application.

1. Sign in to the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/?referrer=https://azure.microsoft.com/documentation/articles&deeplink=/appList) with your Microsoft account credentials.
2. In the upper-right corner, select **Add an app**.
3. Enter an **Application Name**, and then click **Create** 
4. Select **Generate New Password** and make sure that you copy the password to use when you configure the identity provider. Also copy the **Application Id**. 
5. Enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp` in **Redirect URLs**. Replace `your-tenant-name` with the name of your tenant.
6. Select **Save**.

## Create a policy key

You need to store the password that you generated and previously recorded in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. On the Overview page, select **Identity Experience Framework - PREVIEW**.
5. Select **Policy Keys** and then select **Add**.
6. For **Options**, choose `Manual`.
7. Enter a **Name** for the policy key. For example, `MSASecret`. The prefix `B2C_1A_` is added automatically to the name of your key.
8. In **Secret**, enter the password that you previously recorded.
9. For **Key usage**, select `Signature`.
10. Click **Create**.

## Add a claims provider

If you want users to sign in using a Microsoft account, you need to define the account as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated. 

You can define Azure AD as a claims provider by adding the **ClaimsProvider** element in the extension file of your policy.

1. Open the *TrustFrameworkExtensions.xml*.
2. Find the **ClaimsProviders** element. If it does not exist, add it under the root element.
3. Add a new **ClaimsProvider** as follows:

    ```xml
    <ClaimsProvider>
      <Domain>live.com</Domain>
      <DisplayName>Microsoft Account</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="MSA-OIDC">
          <DisplayName>Microsoft Account</DisplayName>
          <Protocol Name="OpenIdConnect" />
          <Metadata>
            <Item Key="ProviderName">https://login.live.com</Item>
            <Item Key="METADATA">https://login.live.com/.well-known/openid-configuration</Item>
            <Item Key="response_types">code</Item>
            <Item Key="response_mode">form_post</Item>
            <Item Key="scope">openid profile email</Item>
            <Item Key="HttpBinding">POST</Item>
            <Item Key="UsePolicyInRedirectUri">0</Item>
            <Item Key="client_id">Your Microsoft application client id</Item>
          </Metadata>
          <CryptographicKeys>
            <Key Id="client_secret" StorageReferenceId="B2C_1A_MSASecret" />
          </CryptographicKeys>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="live.com" />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" />
            <OutputClaim ClaimTypeReferenceId="socialIdpUserId" PartnerClaimType="sub" />
            <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
            <OutputClaim ClaimTypeReferenceId="email" />
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

4.  Replace the value of **client_id** with the application ID that you previously recorded.
5.  Save the file.

### Upload the extension file for verification

By now, you have configured your policy so that Azure AD B2C knows how to communicate with your Microsoft account. Try uploading the extension file of your policy just to confirm that it doesn't have any issues so far.

1. On the **Custom Policies** page in your Azure AD B2C tenant, select **Upload Policy**.
2. Enable **Overwrite the policy if it exists**, and then browse to and select the *TrustFrameworkExtensions.xml* file.
3. Click **Upload**.

## Register the claims provider

At this point, the identity provider has been set up, but it’s not available in any of the sign-up or sign-in screens. To make it available, you create a duplicate of an existing template user journey, and then modify it so that it also has the Microsoft account identity provider.

1. Open the *TrustFrameworkBase.xml* file from the starter pack.
2. Find and copy the entire contents of the **UserJourney** element that includes `Id="SignUpOrSignIn"`.
3. Open the *TrustFrameworkExtensions.xml* and find the **UserJourneys** element. If the element doesn't exist, add one.
4. Paste the entire content of the **UserJourney** element that you copied as a child of the **UserJourneys** element.
5. Rename the ID of the user journey. For example, `SignUpSignInMSA`.

### Display the button

The **ClaimsProviderSelection** element is analogous to an identity provider button on a sign-up or sign-in screen. If you add a **ClaimsProviderSelection** element for a Microsoft account, a new button shows up when a user lands on the page.

1. In the *TrustFrameworkExtensions.xml* file, find the **OrchestrationStep** element that includes `Order="1"` in the user journey that you created.
2. Under **ClaimsProviderSelects**, add the following element. Set the value of **TargetClaimsExchangeId** to an appropriate value, for example `MicrosoftAccountExchange`:

    ```XML
    <ClaimsProviderSelection TargetClaimsExchangeId="MicrosoftAccountExchange" />
    ```

### Link the button to an action

Now that you have a button in place, you need to link it to an action. The action, in this case, is for Azure AD B2C to communicate with a Twitter account to receive a token.

1. Find the **OrchestrationStep** that includes `Order="2"` in the user journey.
2. Add the following **ClaimsExchange** element making sure that you use the same value for **Id** that you used for **TargetClaimsExchangeId**:

    ```xml
    <ClaimsExchange Id="MicrosoftAccountExchange" TechnicalProfileReferenceId="MSA-OIDC" />
    ```
    
    Update the value of **TechnicalProfileReferenceId** to the **Id** of the technical profile you created earlier. For example, `MSA-OIDC`.

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

1. Make a copy of *SignUpOrSignIn.xml* in your working directory, and rename it. For example, rename it to *SignUpSignInMSA.xml*.
2. Open the new file and update the value of the **PolicyId** attribute for **TrustFrameworkPolicy** with a unique value. For example, `SignUpSignInMSA`.
3. Update the value of **PublicPolicyUri** with the URI for the policy. For example,`http://contoso.com/B2C_1A_signup_signin_msa`
4. Update the value of the **ReferenceId** attribute in **DefaultUserJourney** to match the ID of the new user journey that you created (SignUpSignInMSA).
5. Save your changes, upload the file, and then select the new policy in the list.
6. Make sure that Azure AD B2C application that you created is selected in the **Select application** field, and then test it by clicking **Run now**.
